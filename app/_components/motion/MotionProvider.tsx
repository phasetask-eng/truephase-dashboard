"use client";

import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { SmoothScroll } from "./SmoothScroll";
import { EASE, DURATION, STAGGER } from "./tokens";

/**
 * One provider for everything that is page-wide rather than per-component:
 * smooth scroll, the scroll-reveal batch, and re-measuring once fonts land.
 *
 * Reveals are batched rather than one ScrollTrigger per element. A dozen cards
 * entering together share a single trigger and stagger off it, which is both
 * cheaper and the reason they arrive as a group instead of a ragged queue.
 */
export function MotionProvider() {
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion()) {
      // Everything visible, nothing hidden. Reduced motion is not no content.
      root.classList.add("motion-static");
      return;
    }

    root.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      // Initial state in JS, not CSS: if this never runs, the content is simply
      // visible rather than permanently invisible.
      gsap.set("[data-reveal]", { opacity: 0, y: 24 });

      // The signature scrub. Desktop only — against touch momentum it judders.
      if (window.matchMedia("(min-width: 1000px)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.9, y: 100 },
            {
              scale: 1,
              y: 0,
              transformOrigin: "top center",
              ease: EASE.scrub,
              immediateRender: false,
              clearProps: "transform",
              scrollTrigger: { trigger: el, start: "top bottom", end: "top center", scrub: true },
            },
          );
        });
      }

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.revealIn,
            stagger: STAGGER.in,
            overwrite: true,
          }),
      });
    });

    // Line breaks and section offsets are both wrong until the webfont swaps in.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
      root.classList.remove("motion-ready");
    };
  }, []);

  return <SmoothScroll />;
}
