"use client";

import { useRef, useState } from "react";
import { HeroVideoKick } from "./HeroVideoKick";

/**
 * The hero object's loop.
 *
 * It ships the way the reference ships its own hero: a pre-rendered, looping
 * video - WebM (VP9) first, MP4 (H.264) for anything that cannot play it. The
 * frames come out of the Blender scene in blender/, and the bottom dissolve is
 * in the pixels because it lives in the materials (alpha by world height), so
 * nothing here masks or crops the picture.
 *
 * Why video and not the animated WebP it replaced: WebP compresses each frame
 * on its own, so 252 frames at this size cost ~2MB for soft texture. VP9 and
 * H.264 compress across time - a slow mechanical loop is mostly unchanged
 * pixels frame to frame - so the same frames arrive sharper for a fraction of
 * the bytes, and the browser can start playing before the whole file lands.
 *
 * Playback needs no JavaScript: autoplay + muted + loop + playsinline is what
 * every browser honours without a script, so it renders before hydration and
 * with scripting off. The poster is frame one of the loop itself, so the
 * hand-off from poster to playback is invisible.
 *
 * Reduced motion: each <source> carries a media query, so a browser that
 * honours it hands the video no source at all and shows the poster; the
 * stylesheet also swaps the video for the still, which covers browsers that
 * ignore media on video sources. Decided at load, no flash of motion first.
 *
 * Pause: WCAG 2.2.2 requires a control in the page for anything that moves
 * for more than five seconds, however gentle. The button is the only
 * JavaScript here, and the loop plays exactly as before if it never runs.
 * The wrapper carries the text alternative; <video> may not take role="img".
 */

/*
 * Phones: a 720px H.264 cut (~0.5MB, Main profile, fast-start) is listed FIRST
 * for narrow screens. H.264 is hardware-decoded on every phone, whereas VP9 is
 * not on many iPhones and older Androids, and the 1000px file is twice the
 * bytes for pixels a phone never shows. Every MP4 is fast-start (moov atom at
 * the front) so playback can begin before the whole file has downloaded.
 * Codec strings on each type let a browser skip a source it cannot decode
 * instead of picking it and stalling on the poster.
 */
export function HeroLoop({
  webm,
  mp4,
  mobileMp4,
  still,
  label,
  width,
  height,
  className = "",
}: {
  webm: string;
  mp4: string;
  mobileMp4: string;
  still: string;
  label: string;
  width: number;
  height: number;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.userPaused;
      void v.play();
      setPaused(false);
    } else {
      // Tells HeroVideoKick this pause was chosen, so it never restarts the loop.
      v.dataset.userPaused = "true";
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className="hero-figure" role="img" aria-label={label}>
      <video
        ref={video}
        className={`hero-object hero-video ${className}`}
        width={width}
        height={height}
        autoPlay
        muted
        loop
        playsInline
        data-hero-video
        preload="auto"
        poster={still}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      >
        <source
          src={mobileMp4}
          type='video/mp4; codecs="avc1.4D401F"'
          media="(max-width: 700px) and (prefers-reduced-motion: no-preference)"
        />
        <source
          src={webm}
          type='video/webm; codecs="vp9"'
          media="(prefers-reduced-motion: no-preference)"
        />
        <source
          src={mp4}
          type='video/mp4; codecs="avc1.640028"'
          media="(prefers-reduced-motion: no-preference)"
        />
      </video>
      <HeroVideoKick />
      <img
        className={`hero-object hero-still ${className}`}
        src={still}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        decoding="async"
      />
      <button
        type="button"
        className="hero-pause"
        onClick={toggle}
        aria-pressed={paused}
      >
        {paused ? "Play animation" : "Pause animation"}
      </button>
    </div>
  );
}
