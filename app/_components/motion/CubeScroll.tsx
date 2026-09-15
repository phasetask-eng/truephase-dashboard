"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * The scroll-driven cube: a pre-rendered frame sequence drawn to a canvas,
 * with the frame index scrubbed to scroll position.
 *
 * Why frames on a canvas and not a <video>: seeking a video from scroll is
 * decode-bound and stutters, and it cannot run backwards smoothly. A frame
 * per image decodes once and draws in a fraction of a millisecond, forwards
 * or back, so the cube tracks the scroll in both directions.
 *
 * Why the frames are baked onto --bg-page: WebP stores alpha losslessly,
 * which is the expensive part of a soft-edged object. Compositing at export
 * halves the bytes, and the section is that same colour, so the edge is
 * invisible. If --bg-page ever changes, re-export the frames to match.
 *
 * Scrub smoothing is in the ScrollTrigger (`scrub: 0.6`), which lets the
 * frame index ease toward the scroll target rather than snapping to every
 * wheel tick, while never running on its own: no scroll, no motion.
 *
 * Frames are fetched only after the page has loaded and the section is within
 * a couple of viewports of the fold, so they never compete with the hero for
 * bandwidth. Until they land, the poster (frame one) is what is visible.
 *
 * Reduced motion: the canvas never takes over and the poster stays — the
 * finished object, no scrubbing.
 */
export function CubeScroll({
  frameCount,
  src,
  poster,
  label,
  size,
}: {
  frameCount: number;
  /** Frame path with `{i}` as a zero-padded (3 digit) index placeholder. */
  src: string;
  poster: string;
  label: string;
  /** Rendered frame size in px (square). */
  size: number;
}) {
  const root = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const rootEl = root.current;
    const canvas = canvasRef.current;
    if (!rootEl || !canvas || prefersReducedMotion()) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const frames: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    const url = (i: number) => src.replace("{i}", String(i).padStart(3, "0"));
    let started = false;
    let disposed = false;
    let current = -1;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const draw = (i: number) => {
      const img = frames[i];
      if (!img) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.drawImage(img, 0, 0, canvas.width, canvas.height);
      current = i;
      canvas.classList.add("is-live");
    };

    // Nearest loaded frame, so the scrub is usable while later frames arrive.
    const nearest = (i: number) => {
      for (let d = 0; d < frameCount; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    const progress = { p: 0 };
    const render = () => {
      const target = Math.round(progress.p * (frameCount - 1));
      const i = nearest(target);
      if (i >= 0 && i !== current) draw(i);
    };

    const load = () => {
      if (started) return;
      started = true;
      // Frame one first, then spread outward so the whole range fills in evenly.
      const order = [0];
      for (let step = 8; step >= 1; step = step >> 1) {
        for (let i = step; i < frameCount; i += step) if (!order.includes(i)) order.push(i);
      }
      order.forEach((i) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (disposed) return;
          frames[i] = img;
          render();
        };
        img.src = url(i);
      });
    };

    // Not before the page has loaded: the hero's video is the first thing the
    // reader sees and these frames must never compete with it for bandwidth.
    // The preload is a ScrollTrigger rather than an IntersectionObserver so it
    // measures scroll the same way every other trigger on the page does.
    let preload: ScrollTrigger | null = null;
    const arm = () => {
      if (disposed) return;
      preload = ScrollTrigger.create({
        trigger: rootEl,
        start: "top 250%",
        once: true,
        onEnter: load,
      });
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    const ctx = gsap.context(() => {
      gsap.to(progress, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: render,
        },
      });

      // The object arrives with the section rather than appearing fully formed.
      gsap.fromTo(
        canvas.parentElement,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: rootEl, start: "top 90%", end: "top 30%", scrub: true },
        },
      );
    }, rootEl);

    return () => {
      disposed = true;
      window.removeEventListener("load", arm);
      preload?.kill();
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [frameCount, src, size]);

  return (
    <section ref={root} className="cube-scroll" aria-label={label}>
      <div className="cube-stage">
        <div className="cube-frame" style={{ ["--cube-size" as string]: `${size}px` }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the poster is
              a frame of the sequence itself, already sized and encoded; a
              second optimised copy would just be a different first frame. */}
          <img
            className="cube-poster"
            src={poster}
            alt={label}
            width={size}
            height={size}
            decoding="async"
          />
          <canvas ref={canvasRef} className="cube-canvas" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
