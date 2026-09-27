"use client";

import { useEffect, useRef, useState } from "react";

/* MotionRoot used to run an IntersectionObserver here. Scroll reveals are now
   driven by GSAP ScrollTrigger.batch in ./motion/MotionProvider, so the two do
   not fight over the same [data-reveal] elements. */

/** Live clock. Renders nothing until mounted, so server and client agree. */
export function LiveClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="mono" style={{ fontVariantNumeric: "tabular-nums" }}>
      {now ?? "--:--:--"}
    </span>
  );
}

export type LedgerEntry = {
  time: string;
  event: string;
  tag: string;
};

/**
 * The hero's working object: the product's own output, arriving in sequence.
 * Code-native UI rather than a photographic stand-in.
 */
export function HeroLedger({ entries }: { entries: LedgerEntry[] }) {
  const [shown, setShown] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(entries.length);
      return;
    }

    const created = entries.map((_, i) =>
      window.setTimeout(() => setShown(i + 1), 420 + i * 260),
    );
    timers.current = created;

    return () => created.forEach(window.clearTimeout);
  }, [entries]);

  return (
    <figure className="ledger" aria-label="Illustrative log of calls handled in one day">
      <div className="ledger-head">
        <span className="row" style={{ gap: 8 }}>
          <span className="live-dot" aria-hidden="true" />
          <span className="mono">Handled today</span>
        </span>
        <LiveClock />
      </div>

      <ul className="ledger-list">
        {entries.map((entry, i) => (
          <li
            key={entry.time}
            className={`ledger-row${i < shown ? " is-in" : ""}`}
            aria-hidden={i >= shown}
          >
            <span className="mono ledger-time">{entry.time}</span>
            <span className="ledger-event">{entry.event}</span>
            <span className="tag tag-dark ledger-tag">{entry.tag}</span>
          </li>
        ))}
      </ul>

      <figcaption className="mono ledger-foot">
        Illustrative · your own log is live in the portal
      </figcaption>
    </figure>
  );
}

/** Transcript that plays out line by line once it is scrolled into view. */
export function Transcript({
  lines,
}: {
  lines: { who: string; said: string }[];
}) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(lines.length);
      return;
    }

    let timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        timers = lines.map((_, i) =>
          window.setTimeout(() => setShown(i + 1), 260 + i * 700),
        );
      },
      { threshold: 0.25 },
    );

    io.observe(node);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [lines]);

  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <div key={line.said} className={`record-line${i < shown ? " is-in" : ""}`}>
          <span className="mono who">{line.who}</span>
          <p className="said">{line.said}</p>
        </div>
      ))}
    </div>
  );
}
