"""
Pack the rendered frames into WebM (VP9) and MP4 (H.264) the way the reference
ships its hero, using the FFmpeg that Blender bundles - there is none on the
machine. Runs INSIDE Blender: an empty scene, the composited PNGs as one image
strip in the sequencer, written out through the FFmpeg encoder.

Stage 1 (system python, PIL): composite the RGBA renders onto --bg-page. The
video has no alpha channel, so the page colour is baked in exactly as it was
for the WebP; the fade is already in the pixels because it lives in the
materials, not in a mask.
Stage 2 (Blender): strip -> WebM / MP4.

    python3 encode_video.py composite <src_dir> <rgb_dir>
    Blender -b --python encode_video.py -- encode <rgb_dir> <out_stem> <fps> <crf_webm> <crf_mp4>
"""
import sys, os, glob

if sys.argv[1:2] == ["composite"]:
    from PIL import Image
    SRC, DST = sys.argv[2], sys.argv[3]
    PAGE = (0xef, 0xef, 0xed)
    os.makedirs(DST, exist_ok=True)
    paths = sorted(glob.glob(f"{SRC}/f_*.png"))
    assert paths, "no frames"
    for i, p in enumerate(paths):
        im = Image.open(p).convert("RGBA")
        bg = Image.new("RGBA", im.size, PAGE + (255,))
        bg.alpha_composite(im)
        bg.convert("RGB").save(f"{DST}/f_{i:04d}.png", compress_level=1)
    w, h = im.size
    assert bg.getpixel((2, 2))[:3] == PAGE
    print(f"[composite] {len(paths)} frames {w}x{h} onto #{PAGE[0]:02x}{PAGE[1]:02x}{PAGE[2]:02x}")
    sys.exit(0)

import bpy
A = sys.argv[sys.argv.index("--") + 1:]
assert A[0] == "encode"
RGB, STEM, FPS = A[1], A[2], int(A[3])
CRF_WEBM, CRF_MP4 = A[4], A[5]

paths = sorted(glob.glob(f"{RGB}/f_*.png"))
assert paths, "no rgb frames"
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
img = bpy.data.images.load(paths[0])
W, H = img.size
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
sc.render.fps, sc.render.fps_base = FPS, 1.0
sc.frame_start, sc.frame_end = 1, len(paths)
# the PNGs are already display-referred sRGB: pass them through untouched
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"
sc.sequencer_colorspace_settings.name = "sRGB"

sc.sequence_editor_create()
se = sc.sequence_editor
strips = se.strips if hasattr(se, "strips") else se.sequences   # empty collection is falsy
strip = strips.new_image(name="hero", filepath=paths[0], channel=1, frame_start=1)
for p in paths[1:]:
    strip.elements.append(os.path.basename(p))

ims = sc.render.image_settings
if hasattr(ims, "media_type"):          # Blender 5: video is a media type, not a format
    ims.media_type = "VIDEO"
else:
    ims.file_format = "FFMPEG"
ims.color_mode = "RGB"
ff = sc.render.ffmpeg


def set_crf(v):
    """Either one of Blender's named levels, or an exact x264/vp9 CRF number."""
    if v.isdigit() and "CUSTOM" in [i.identifier for i in ff.bl_rna.properties["constant_rate_factor"].enum_items]:
        ff.constant_rate_factor = "CUSTOM"
        ff.custom_constant_rate_factor = int(v)
    else:
        ff.constant_rate_factor = v
ff.audio_codec = "NONE"
ff.gopsize = FPS * 2            # a keyframe every 2 s: seeks fine, loop restart cheap
ff.ffmpeg_preset = "BEST"        # slowest, smallest, best - it is a one-off encode

made = []
for container, codec, crf, ext in (("WEBM", "WEBM", CRF_WEBM, ".webm"),
                                   ("MPEG4", "H264", CRF_MP4, ".mp4")):
    ff.format = container
    ff.codec = codec
    set_crf(crf)
    sc.render.filepath = STEM + ext
    bpy.ops.render.render(animation=True)
    # Blender may append the frame range to the name; normalise
    out = STEM + ext
    if not os.path.exists(out):
        cands = sorted(glob.glob(STEM + "*" + ext), key=os.path.getmtime)
        assert cands, f"no output for {ext}"
        os.replace(cands[-1], out)
    made.append((out, os.path.getsize(out)))

for out, size in made:
    print(f"[video] {os.path.basename(out)}  {size/1024:.0f} KB  ({len(paths)} frames @ {FPS} fps = {len(paths)/FPS:.2f} s)")
