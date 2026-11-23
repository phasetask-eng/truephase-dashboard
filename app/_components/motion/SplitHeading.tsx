"use client";

import { useRef } from "react";
import { gsap, SplitText, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { EASE, DURATION, STAGGER, HEADING } from "./tokens";

type Props = {
  children: React.ReactNode;
  /** "load" fires immediately; "scroll" waits for the heading to enter the viewport. */
  trigger?: "load" | "scroll";
  /** Delay in seconds, used to slot a heading into a larger timeline. */
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

/**
 * Line-masked heading reveal.
 *
 * Each line sits in its own overflow-clipped wrapper, then travels up through
 * that mask from 100% while also sliding in 50px from the left. The two axes
 * together are what stop it reading as a plain slide-up.
 *
 * SplitText is re-run on resize because line breaks change with width — without
 * that, a rotated phone keeps the masks from the old line count.
 */
export function SplitHeading({
  children,
  trigger = "scroll",
  delay = 0,
  className = "",
  as: Tag = "h2",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion still gets the heading — just already in place.
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const split = new SplitText(el, {
        type: "lines",
        linesClass: "split-line",
        autoSplit: true,
        mask: "lines",
      });

      gsap.set(el, { opacity: 1 });

      const tween = gsap.fromTo(
        split.lines,
        { ...HEADING.from },
        {
          ...HEADING.to,
          duration: DURATION.base,
          ease: EASE.revealIn,
          stagger: STAGGER.in,
          delay,
          paused: trigger === "scroll",
        },
      );

      if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => tween.play(),
        });
      }
    }, el);

    return () => ctx.revert();
  }, [delay, trigger]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ opacity: 0 }}
    >
      {children}
    </Tag>
  );
}
