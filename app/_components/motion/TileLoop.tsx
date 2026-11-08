/**
 * The looping animation on a service card.
 *
 * Same recipe as HeroLoop, sized for a card: a square, silent, pre-rendered
 * loop (WebM first, MP4 fallback) that plays without JavaScript, with a poster
 * taken from the loop itself. Each <source> carries a reduced-motion media
 * query, so a browser honouring it gets no source and shows the still; the
 * stylesheet swaps the two as well for browsers that ignore media on sources.
 *
 * `base` is the path without an extension: `/tiles/ai-chatbot` resolves to
 * `/tiles/ai-chatbot.webm`, `.mp4` and `-poster.jpg`.
 *
 * The wrapper carries the text alternative; <video> may not take role="img".
 */
export function TileLoop({ base, label }: { base: string; label: string }) {
  const still = `${base}-poster.jpg`;
  return (
    <div className="tile-loop" role="img" aria-label={label}>
      <video
        className="tile-loop-video"
        width={960}
        height={960}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={still}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
      >
        <source src={`${base}.webm`} type="video/webm" media="(prefers-reduced-motion: no-preference)" />
        <source src={`${base}.mp4`} type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
      </video>
      {/* a plain <img>, like HeroLoop: the poster is already sized and compressed for this slot */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="tile-loop-still" src={still} alt="" aria-hidden="true" width={960} height={960} loading="lazy" decoding="async" />
    </div>
  );
}
