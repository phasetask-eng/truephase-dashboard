"""Frames for the scroll scrub: one WebP per frame, composited onto --bg-page.
Frame 0 is the exploded state (what the poster shows while frames load);
f-still is the assembled cube, for readers with reduced motion.

    python3 encode_frames.py <png_dir> <out_dir> <quality>
"""
import sys, os, glob
from PIL import Image
SRC, DST, Q = sys.argv[1], sys.argv[2], int(sys.argv[3])
PAGE = (0xef, 0xef, 0xed)
os.makedirs(DST, exist_ok=True)
for f in glob.glob(f"{DST}/f-*.webp"):
    os.remove(f)
paths = sorted(glob.glob(f"{SRC}/f_*.png"))
assert paths, "no frames"
total = 0
for i, p in enumerate(paths):
    im = Image.open(p).convert("RGBA")
    bg = Image.new("RGBA", im.size, PAGE + (255,))
    bg.alpha_composite(im)
    out = f"{DST}/f-{i:03d}.webp"
    bg.convert("RGB").save(out, quality=Q, method=6)
    total += os.path.getsize(out)
assert bg.getpixel((2, 2))[:3] == PAGE
still = f"{DST}/f-still.webp"
Image.open(out).save(still, quality=max(Q, 88), method=6)
print(f"[frames] {len(paths)} frames {im.size[0]}x{im.size[1]} q{Q}: {total/1024:.0f} KB total, "
      f"{total/1024/len(paths):.1f} KB avg; still {os.path.getsize(still)//1024} KB")
