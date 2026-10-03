"use client";

import { useEffect } from "react";

/**
 * Makes sure the hero loop actually plays on phones.
 *
 * `autoplay muted playsinline` is enough on most browsers, but mobile Safari and
 * Chrome on Android can decline autoplay — Low Power Mode, Data Saver, a tab
 * opened in the background, or the file still arriving over mobile data — and
 * when they do the reader is left on the still frame for good. This asks again
 * once the page is interactive, again when there is enough data, again when
 * the tab becomes visible, and on touch, tap, key press or scroll. A tap
 * (touchend/click) or key press is what a browser counts as permission to play
 * once it has blocked autoplay; a scroll succeeds only within a few seconds of
 * one.
 *
 * A reader's own Pause (HeroLoop marks it with data-user-paused) always wins:
 * the kick stands down rather than restart a loop someone chose to stop.
 *
 * Renders nothing; the <video> itself stays server-rendered so it can start
 * before any JavaScript has loaded.
 */
export function HeroVideoKick() {
  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>("video[data-hero-video]");
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // iOS checks the muted PROPERTY, which the attribute alone does not always set.
    video.muted = true;
    video.defaultMuted = true;

    const gestures = ["touchstart", "pointerdown", "touchend", "click", "scroll", "keydown"] as const;
    let done = false;

    const cleanup = () => {
      if (done) return;
      done = true;
      gestures.forEach((e) => window.removeEventListener(e, tryPlay));
      document.removeEventListener("visibilitychange", onVisible);
      video.removeEventListener("canplay", tryPlay);
    };

    function tryPlay() {
      if (done || !video) return;
      if (!video.paused || video.dataset.userPaused) return cleanup();
      const attempt = video.play();
      if (attempt) attempt.then(cleanup).catch(() => {});
    }

    function onVisible() {
      if (document.visibilityState === "visible") tryPlay();
    }

    gestures.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("playing", cleanup, { once: true });

    // If the source failed to load (e.g. a stalled first request), load it again once.
    if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
    tryPlay();

    return cleanup;
  }, []);

  return null;
}
