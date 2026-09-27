"use client";

import { gsap, SplitText, prefersReducedMotion } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { EASE, DURATION, STAGGER, HERO, HEADING } from "./tokens";

/**
 * The hero load sequence, run as one timeline so the three parts stay related
 * to each other rather than each guessing its own delay.
 *
 * Order is deliberate: headline lines first, the ledger panel at +0.1 so it
 * overlaps the headline and the two read as connected, then the body copy and
 * buttons at +0.5 — after all the headline lines have landed. Copy arriving
 * mid-headline is what makes a hero feel busy.
 *
 * Targets are found by data attribute rather than ref so the markup stays plain
 * and a section can be reordered without rewiring the timeline.
 */
export function HeroSequence() {
  useIsomorphicLayoutEffect(() => {
    const scope = document.querySelector<HTMLElement>("[data-hero]");
    if (!scope) return;

    const heading = scope.querySelector<HTMLElement>("[data-hero-heading]");
    const media = scope.querySelector<HTMLElement>("[data-hero-media]");
    const copy = scope.querySelectorAll<HTMLElement>("[data-hero-copy]");

    if (prefersReducedMotion()) {
      gsap.set([heading, media, ...Array.from(copy)], { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      let lines: Element[] = [];

      if (heading) {
        const split = new SplitText(heading, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
        });
        lines = split.lines;
        gsap.set(heading, { opacity: 1 });
      }

      const tl = gsap.timeline();
      tl.add("start");

      if (lines.length) {
        tl.fromTo(
          lines,
          { ...HEADING.from },
          {
            ...HEADING.to,
            duration: DURATION.base,
            ease: EASE.revealIn,
            stagger: STAGGER.in,
          },
          "start",
        );
      }

      if (media) {
        tl.fromTo(
          media,
          { ...HERO.mediaFrom },
          { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.revealIn },
          `start+=${HERO.mediaOffset}`,
        );
      }

      if (copy.length) {
        tl.fromTo(
          copy,
          { ...HERO.copyFrom },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.base,
            ease: EASE.revealIn,
            stagger: STAGGER.out,
          },
          `start+=${HERO.copyOffset}`,
        );
      }
    }, scope);

    return () => ctx.revert();
  }, []);

  return null;
}
