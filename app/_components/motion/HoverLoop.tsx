"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { EASE, DURATION } from "./tokens";

type Direction = "up" | "down" | "left" | "right";

/**
 * Hover-loop: two stacked copies of the same label. On hover the first slides
 * out and the second slides in from the opposite side, so the text appears to
 * roll over rather than fade.
 *
 * The second copy is aria-hidden — a screen reader should hear the label once,
 * not twice.
 *
 * Touch devices get the plain label with no duplicate, because there is no
 * hover state to roll into and the clone would just cost layout.
 */
export function HoverLoop({
  children,
  direction = "up",
  className = "",
}: {
  children: string;
  direction?: Direction;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion() || !isFinePointer()) return;

    const first = el.querySelector<HTMLElement>("[data-loop='first']");
    const second = el.querySelector<HTMLElement>("[data-loop='second']");
    if (!first || !second) return;

    const axis = direction === "up" || direction === "down" ? "yPercent" : "xPercent";
    const sign = direction === "up" || direction === "left" ? -1 : 1;

    const ctx = gsap.context(() => {
      gsap.set(second, { [axis]: -sign * 100 });

      const hoverable = el.closest("a, button") ?? el;

      const enter = () => {
        gsap.to(first, {
          [axis]: sign * 100,
          duration: DURATION.hover,
          ease: EASE.hoverLoop,
          overwrite: true,
        });
        gsap.to(second, {
          [axis]: 0,
          duration: DURATION.hover,
          ease: EASE.hoverLoop,
          overwrite: true,
        });
      };

      const leave = () => {
        gsap.to(first, {
          [axis]: 0,
          duration: DURATION.hover,
          ease: EASE.hoverLoop,
          overwrite: true,
        });
        gsap.to(second, {
          [axis]: -sign * 100,
          duration: DURATION.hover,
          ease: EASE.hoverLoop,
          overwrite: true,
        });
      };

      hoverable.addEventListener("pointerenter", enter);
      hoverable.addEventListener("pointerleave", leave);
      // Keyboard users get the same feedback as mouse users.
      hoverable.addEventListener("focus", enter);
      hoverable.addEventListener("blur", leave);

      return () => {
        hoverable.removeEventListener("pointerenter", enter);
        hoverable.removeEventListener("pointerleave", leave);
        hoverable.removeEventListener("focus", enter);
        hoverable.removeEventListener("blur", leave);
      };
    }, el);

    return () => ctx.revert();
  }, [direction]);

  return (
    <span ref={root} className={`hover-loop ${className}`}>
      <span data-loop="first" className="hover-loop-line">
        {children}
      </span>
      <span data-loop="second" className="hover-loop-line" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
