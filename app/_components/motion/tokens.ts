/**
 * Motion tokens.
 *
 * The one rule that gives the whole system its character: entrances stagger at
 * 0.1 and exits stagger at 0.05, travelling the opposite way. Content leaves
 * faster than it arrives. Do not "tidy" these into one number.
 *
 * Only transform, opacity and clip-path are ever animated — never a layout
 * property. That is what keeps this at 60fps with a dozen live ScrollTriggers.
 */

export const EASE = {
  hoverLoop: "power1.inOut",
  revealIn: "power2.out",
  panelSwing: "power3.inOut",
  base: "power1.out",
  scrub: "none",
} as const;

export const DURATION = {
  fast: 0.2,
  hover: 0.3,
  base: 0.5,
  slow: 0.9,
} as const;

export const STAGGER = {
  in: 0.1,
  out: 0.05,
  column: 0.2,
} as const;

/** Hero entrance offsets, relative to the shared "start" label. */
export const HERO = {
  mediaOffset: 0.1,
  copyOffset: 0.5,
  mediaFrom: { opacity: 0, y: "20%" },
  copyFrom: { opacity: 0, y: 50 },
} as const;

/** h1 lines travel up through a mask and in from the left at the same time. */
export const HEADING = {
  from: { yPercent: 100, x: -50 },
  to: { yPercent: 0, x: 0 },
} as const;

/**
 * The signature move: sections scale up from 0.9 and rise 100px as they enter,
 * scrubbed to scroll. transformOrigin top center is load-bearing — scaling from
 * the top edge keeps the arc pinned to the section boundary while the body grows.
 */
export const SECTION_SCRUB = {
  from: { scale: 0.9, y: 100 },
  to: { scale: 1, y: 0, transformOrigin: "top center" },
  start: "top bottom",
  end: "top center",
} as const;

/** Cursor tilt. lerp is per-frame — lower is heavier. */
export const TILT = {
  amount: 15,
  amountCard: 8,
  lerp: 0.05,
} as const;
