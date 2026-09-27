"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { SECTION_SCRUB } from "./tokens";

/**
 * The signature move: a section scales up from 0.9 and rises 100px as it enters,
 * scrubbed directly to scroll position rather than played on a timer. It makes
 * the page read as sheets of material sliding over one another.
 *
 * transformOrigin "top center" is the load-bearing detail — scaling from the top
 * edge keeps the rounded top corners pinned to the section boundary while the
 * body grows underneath. Scaling from the centre makes the arc drift and the
 * whole effect stops reading as material.
 *
 * clearProps hands styling back to CSS once the section has fully arrived, so
 * nothing lingers on the compositor for the rest of the page's life.
 *
 * Desktop-only: on touch, scrubbing a transform against momentum scrolling
 * judders badly, so coarse pointers get the finished state immediately.
 */
export function RoundedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const scaler = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const rootEl = root.current;
    const scaleEl = scaler.current;
    if (!rootEl || !scaleEl) return;

    const desktop = window.matchMedia("(min-width: 1000px)").matches;
    if (!desktop || prefersReducedMotion()) {
      gsap.set(scaleEl, { scale: 1, y: 0, clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scaleEl,
        { ...SECTION_SCRUB.from },
        {
          ...SECTION_SCRUB.to,
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: {
            trigger: rootEl,
            start: SECTION_SCRUB.start,
            end: SECTION_SCRUB.end,
            scrub: true,
          },
        },
      );
    }, rootEl);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} id={id} className={`rounded-section ${className}`}>
      <div ref={scaler} className="rs-scale">
        {children}
      </div>
    </div>
  );
}

/** Re-measure every trigger once fonts land, or every start/end is off by a line. */
export function useScrollTriggerRefresh() {
  useIsomorphicLayoutEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);
}
