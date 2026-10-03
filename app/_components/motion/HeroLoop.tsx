"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero object's loop.
 *
 * It ships the way the reference ships its own hero: a pre-rendered, looping
 * video - WebM (VP9) first, MP4 (H.264) for anything that cannot play it. The
 * frames come out of the Blender scene in blender/, and the bottom dissolve is
 * in the pixels because it lives in the materials (alpha by world height), so
 * nothing here masks or crops the picture.
 *
 * Why video and not the animated WebP it replaced: WebP compresses each frame
 * on its own, so 252 frames at this size cost ~2MB for soft texture. VP9 and
 * H.264 compress across time - a slow mechanical loop is mostly unchanged
 * pixels frame to frame - so the same frames arrive sharper for a fraction of
 * the bytes, and the browser can start playing before the whole file lands.
 *
 * Playback needs no JavaScript: autoplay + muted + loop + playsinline is what
 * every browser honours without a script, so it renders before hydration and
 * with scripting off. The poster is frame one of the loop itself, so the
 * hand-off from poster to playback is invisible.
 *
 * Reduced motion: each <source> carries a media query, so a browser that
 * honours it hands the video no source at all and shows the poster; the
 * stylesheet also swaps the video for the still, which covers browsers that
 * ignore media on video sources. Decided at load, no flash of motion first.
 *
 * Pause: WCAG 2.2.2 requires a control in the page for anything that moves
 * for more than five seconds, however gentle. The button is the only
 * JavaScript here, and the loop plays exactly as before if it never runs.
 * An inner wrapper carries the text alternative (<video> may not take
 * role="img"), and the button sits beside it, not inside it: role="img" makes
 * its children presentational, so a button within it can drop out of the
 * accessibility tree altogether.
 */

export function HeroLoop({
  webm,
  mp4,
  still,
  label,
  width,
  height,
  className = "",
}: {
  webm: string;
  mp4: string;
  still: string;
  label: string;
  width: number;
  height: number;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  // The label starts at "Pause" because autoplay normally works. When a browser
  // declines it (iOS Low Power Mode, Data Saver) no event fires and the loop
  // sits on its poster, so ask once after hydration: play() on a muted video is
  // what autoplay does anyway, and it rejects at once when the browser will not
  // allow it. From then on the play/pause events keep the label true.
  useEffect(() => {
    const v = video.current;
    if (!v || !v.paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => setPaused(v.paused));
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => setPaused(v.paused));
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className="hero-figure">
      <div role="img" aria-label={label}>
        <video
          ref={video}
          className={`hero-object hero-video ${className}`}
          width={width}
          height={height}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={still}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
        >
          <source src={webm} type="video/webm" media="(prefers-reduced-motion: no-preference)" />
          <source src={mp4} type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
        </video>
        <img
          className={`hero-object hero-still ${className}`}
          src={still}
          alt=""
          aria-hidden="true"
          width={width}
          height={height}
          decoding="async"
        />
      </div>
      <button
        type="button"
        className="hero-pause"
        onClick={toggle}
        aria-pressed={paused}
      >
        {paused ? "Play animation" : "Pause animation"}
      </button>
    </div>
  );
}
