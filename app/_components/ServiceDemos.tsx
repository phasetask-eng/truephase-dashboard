"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Code-drawn card animations for the "Six things" grid.
 *
 * Built from the site's own pieces (Inter, JetBrains Mono, mint chip, graphite)
 * instead of a GIF, so they stay sharp at any size, weigh almost nothing and
 * pick up the real fonts. Each demo is a short sequence of steps on a timer;
 * CSS transitions do the motion. It only runs while on screen, and visitors
 * who ask for less motion see the finished state, still.
 */

function useStepLoop(steps: number[], loopMs: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(steps.length);
      return;
    }

    let timers: number[] = [];
    const clear = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };
    const run = () => {
      clear();
      setStep(0);
      steps.forEach((at, i) => timers.push(window.setTimeout(() => setStep(i + 1), at)));
      timers.push(window.setTimeout(run, loopMs));
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) run();
        else {
          clear();
          setStep(steps.length);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      clear();
    };
  }, [steps, loopMs]);

  return { ref, step };
}

const RECEPTIONIST_STEPS = [500, 1500, 2700, 3700, 4700, 5500];

/** An after-hours call answered and booked, start to finish. */
export function ReceptionistDemo() {
  const { ref, step } = useStepLoop(RECEPTIONIST_STEPS, 8200);
  const on = (n: number) => (step >= n ? " is-in" : "");

  return (
    <div ref={ref} className="sd" aria-hidden="true">
      <div className="sd-head">
        <span className="sd-call">
          <span className={`sd-ring${step >= 1 && step < 5 ? " is-live" : ""}`} />
          <span className="mono">{step >= 5 ? "Call ended" : "Call · 21:47"}</span>
        </span>
        <span className="mono sd-chip-yellow">After hours</span>
      </div>

      <div className="sd-thread">
        <p className={`sd-msg sd-them${on(1)}`}>Can I book a scalp check tomorrow?</p>
        <p className={`sd-msg sd-us${on(2)}`}>Of course. 10:00 or 14:15?</p>
        <p className={`sd-msg sd-them${on(3)}`}>10:00, please.</p>
      </div>

      <div className={`sd-result${on(4)}`}>
        <span className="sd-tick" />
        <span className="mono">Booked · Tue 10:00</span>
      </div>
      <p className={`mono sd-foot${on(6)}`}>Text confirmation sent</p>
    </div>
  );
}
