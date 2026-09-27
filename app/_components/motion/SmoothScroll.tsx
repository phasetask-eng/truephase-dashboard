"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/**
 * Lenis in window mode rather than wrapper mode.
 *
 * Wrapper mode fixes html/body and scrolls an inner element, which subtly breaks
 * position: sticky, scroll-margin, anchor links and browser find-in-page, and
 * forces every ScrollTrigger to carry a `scroller` option. Window mode feels
 * identical and keeps all of that working.
 *
 * GSAP's ticker drives Lenis so tweens and smooth scroll share one frame;
 * lagSmoothing(0) stops GSAP fast-forwarding after a stall, which would
 * otherwise desync the two.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ autoRaf: false });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
