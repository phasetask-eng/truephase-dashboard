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
 * No JavaScript in the path: autoplay + muted + loop + playsinline is what
 * every browser honours without a script, so it renders before hydration and
 * with scripting off. The poster is frame one of the loop itself, so the
 * hand-off from poster to playback is invisible.
 *
 * Reduced motion: each <source> carries a media query, so a browser that
 * honours it hands the video no source at all and shows the poster; the
 * stylesheet also swaps the video for the still, which covers browsers that
 * ignore media on video sources. Decided at load, no flash of motion first.
 */

export function HeroLoop({
  webm,
  mp4,
  still,
  label,
  width,
  height,
  className = "",
}: {
  webm: string;
  mp4: string;
  still: string;
  label: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <>
      <video
        className={`hero-object hero-video ${className}`}
        width={width}
        height={height}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={still}
        disablePictureInPicture
        disableRemotePlayback
        role="img"
        aria-label={label}
      >
        <source src={webm} type="video/webm" media="(prefers-reduced-motion: no-preference)" />
        <source src={mp4} type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
      </video>
      <img
        className={`hero-object hero-still ${className}`}
        src={still}
        alt={label}
        width={width}
        height={height}
        decoding="async"
      />
    </>
  );
}
