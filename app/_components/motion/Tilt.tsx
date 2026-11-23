"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "./gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { TILT } from "./tokens";

/**
 * Cursor-driven 3D tilt.
 *
 * The cursor's position inside the element maps to -1..1 on each axis. Every
 * frame the current rotation lerps toward that target rather than jumping to it,
 * which is what makes the object feel weighted instead of twitchy. When the
 * pointer leaves, the target snaps to 0 and the same lerp eases it home — so
 * there is no separate "reset" animation to fight with.
 *
 * rotateX is negated against the Y input on purpose: moving the cursor up should
 * tilt the top of the object away from you. Getting that backwards is the single
 * most common way this effect ends up feeling wrong, and it is hard to spot.
 *
 * Driven off gsap.ticker, not its own requestAnimationFrame, so it shares a frame
 * with every other tween and Lenis rather than competing for one.
 */
export function Tilt({
  children,
  amount = TILT.amount,
  lerp = TILT.lerp,
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  amount?: number;
  lerp?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const root = useRef<HTMLDivElement | null>(null);
  const target = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const rootEl = root.current;
    const targetEl = target.current;
    if (!rootEl || !targetEl) return;

    // No cursor to follow, or the user asked for stillness.
    if (prefersReducedMotion() || !isFinePointer()) return;

    const rootNode = rootEl;
    const targetNode = targetEl;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };
    let running = false;

    // A ticker per card costs a frame's work whether or not anyone is hovering.
    // With one hero panel that is free; across every card on the page it is not.
    // So the loop runs only while there is motion left to resolve.
    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    function tick() {
      state.x += (state.tx - state.x) * lerp;
      state.y += (state.ty - state.y) * lerp;

      const settled =
        state.tx === 0 &&
        state.ty === 0 &&
        Math.abs(state.x) < 0.001 &&
        Math.abs(state.y) < 0.001;

      if (settled) {
        targetNode.style.transform = "";
        stop();
        return;
      }

      targetNode.style.transform = `rotateY(${state.x * amount}deg) rotateX(${
        state.y * amount * -1
      }deg)`;
    }

    const onMove = (e: PointerEvent) => {
      const r = rootNode.getBoundingClientRect();
      state.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      state.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      start();
    };

    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
      start(); // keep ticking so it eases home, then stops itself
    };

    rootEl.addEventListener("pointermove", onMove);
    rootEl.addEventListener("pointerleave", onLeave);

    return () => {
      rootEl.removeEventListener("pointermove", onMove);
      rootEl.removeEventListener("pointerleave", onLeave);
      stop();
      targetEl.style.transform = "";
    };
  }, [amount, lerp]);

  return (
    <div ref={root} className={`tilt-root ${className}`} {...rest}>
      <div ref={target} className="tilt-target">
        {children}
      </div>
    </div>
  );
}

/**
 * Magnetic: the element itself drifts toward the cursor while it is nearby.
 * Much smaller travel than Tilt — this is a nudge, not a movement.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion() || !isFinePointer()) return;

    const node = el;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      state.tx = (e.clientX - (r.left + r.width / 2)) * strength;
      state.ty = (e.clientY - (r.top + r.height / 2)) * strength;
      start();
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
      start();
    };
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(tick);
    };

    function tick() {
      state.x += (state.tx - state.x) * 0.12;
      state.y += (state.ty - state.y) * 0.12;
      if (
        state.tx === 0 &&
        state.ty === 0 &&
        Math.abs(state.x) < 0.01 &&
        Math.abs(state.y) < 0.01
      ) {
        node.style.transform = "";
        stop();
        return;
      }
      node.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      stop();
      el.style.transform = "";
    };
  }, [strength]);

  return (
    <span ref={root} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
