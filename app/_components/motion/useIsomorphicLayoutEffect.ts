import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect warns during SSR. GSAP setup must run before paint on the
 * client (otherwise you see one unstyled frame), so use layout effect in the
 * browser and fall back to useEffect on the server.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
