# Cube frame pipeline

Produces `public/cube/f-000.webp … f-126.webp`, the scroll-driven sequence
drawn by `app/_components/motion/CubeScroll.tsx`.

Source: a 25 s 1080p cube video supplied by the client (not in the repo).
Only frames 100–478 are used: the cube floating and turning. Before 100 it
sits on a desk whose light pool leaks into the matte; from ~484 it bursts into
pieces and the matte picks up the desk, pencil and glasses.

1. `matte_all.py` — extracts every frame and removes the background with
   rembg (isnet-general-use). Edit the paths at the top.
2. `pipeline.py render 100 478 1` — per-sticker segmentation (grey-closing
   gap detection), hue classification, tracking across frames with a majority
   vote per sticker so colours never flicker, then recolour onto Truephase
   tokens (see `recolor3.py`: MAP and TOK).
3. `seq.py 100 478 3 74 800 45 <repo>/public/cube` — alpha cleanup, drift
   stabilisation (45-frame window), square crop to the temporal union, and
   export baked onto --bg-page (#efefed) at 800 px, quality 74.

Requires Python 3 with numpy, scipy, Pillow, rembg (CPU) and imageio-ffmpeg.
