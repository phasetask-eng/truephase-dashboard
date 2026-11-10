"""
Print the seven service names ONTO the blocks.

THE MAPPING THAT MAKES THIS WORK: the tower already has exactly seven rings
and we have exactly seven services. So one ring IS one service - permanently.
A ring already keeps its blocks together for the life of the loop (lockstep is
verified in QC), and it already has its own assembly moment: it slides out of
the base, tips open into petals, rises up the outside and closes onto the top.
That is the fragmented -> aligning -> assembled beat the brief asks for, and
it happens seven times per loop, once per service, without inventing anything.

ONE SHORT LABEL PER RING, NOT A SPELLED-OUT SERVICE NAME. The labels are
VOICE, BOOKING, REVIEWS, AUTOMATION, WEB / BRAND, AI VIDEO and CHAT - each
sits whole on one block, or split once across two. Four printable faces exist
per ring (below); the label takes the middle one or two of them and the outer
faces are left blank, so the type reads as a mark on the object rather than a
name chopped into syllables.

WHERE THE LETTERS GO - AND WHY FOUR FACES, NOT SIX. Each block presents a shallow V
of two flat faces, measured off the mesh at +/-46.46 degrees from the block's
own axis. That gives twelve faces, of which six technically face the camera -
but they alternate. Half sit on the outside of a ridge and face you; half form
the valley between two blocks and are nearly edge-on. Measured against this
camera the six run 52.9, 85.8, 7.1, 25.8, 67.2 and 34.2 degrees off-axis, so a
six-way split silently loses the 85.8 one: the name renders with a piece
missing. Only ONE face per block is worth printing on - the half turned toward
the camera - and only four blocks turn one toward it at all. Measured against
this camera those four sit 53, 7, 26 and 34 degrees off-axis, so the middle
two (7 and 26) are the ones a label should occupy.

THE TYPE IS THE SITE'S OWN FONT FILE. Not a lookalike: blender/fonts holds the
exact Anton woff2 that next/font serves for --font-display, and Blender's
FreeType loads woff2 directly. Brand parameters come with it - uppercase,
single weight, and the -0.03em tracking the display roles use.

CAP HEIGHT IS FIXED, WIDTH IS NOT. Fitting each fragment to the face width is
what made the old lettering uneven: a two-letter piece set nearly twice the
height of a six-letter one. Anton's cap is a constant 0.506em, so one size
gives every label on every ring the same cap height - which is what makes them
read as one system. Width is only a guard, and nothing currently trips it.

READING DIRECTION IS PROVEN, NOT GUESSED. Each fragment is laid with its
baseline along (normal rotated +90 degrees). A face is camera-facing when its
normal is within 90 degrees of the camera azimuth; its baseline is then within
90 degrees of screen-right by the same inequality - so every face you can read
reads left to right. The script still verifies it by projecting through the
camera, and assigns the fragment order by actual screen X.

The text is a child of its block. It therefore inherits the block's slide,
tip, rise, close, the ring's twist and the whole tower's lean - there is no
separate transform to keep in sync and nothing to drift.
"""
import bpy, math, sys
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

A = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
BLEND, OUT = A[0], A[1]
FONT_PATH = A[2] if len(A) > 2 else str(__import__("pathlib").Path(__file__).resolve().parent.parent / "fonts" / "Anton-Regular.woff2")
bpy.ops.wm.open_mainfile(filepath=BLEND)
sc = bpy.context.scene

COLS, RINGS, SLOTS = 6, 7, 4
OFFSET = 0.004          # stand-off from the face; also the extrude half-depth
EXTRUDE = 0.004         # printed, not decalled - it catches an edge highlight
CAP_H = 0.150           # cap height in units - 24% of the 0.620 face, fixed
CAP_EM = 0.506          # Anton's cap height as a share of its em, measured
TRACK = 0.881           # the display roles' -0.03em, as a Blender advance scale
MAX_FILL = 0.82         # width guard; with the two-line split nothing trips it
LEADING = 0.82          # tight leading, close to the display roles' 0.94

# ── the seven services ───────────────────────────────────────────────────
# Four slots per ring, left to right. Slots 0 and 3 are the outer faces and
# stay EMPTY: a label takes slot 1 (7 degrees off-axis) alone, or slots 1-2
# when it needs a second face. A split only ever happens once, on a syllable.
SERVICES = [
    ("AI Receptionist",             "VOICE AI",    ["", "VOICE", "AI", ""]),
    ("Appointment Scheduler",       "BOOKING",     ["", "BOOKING", "", ""]),
    # MANAGEMENT is the one word too long for a face: ten characters at the
    # common cap height come to 120% of the flat width, and shrinking it to fit
    # put it a quarter smaller than every other label AND ran it onto the
    # bevel. Set over two lines it keeps the common cap height and sits inside
    # the face with room to spare - the newline is the only one in the table.
    ("Review Management",           "REVIEW MANAGEMENT", ["", "REVIEW", "MANAGE\nMENT", ""]),
    ("Task Automation",             "AUTOMATION",  ["", "AUTO", "MATION", ""]),
    ("Web design & brand identity", "WEB DESIGN",  ["", "WEB", "DESIGN", ""]),
    ("AI video for social",         "AI VIDEO",    ["", "AI", "VIDEO", ""]),
    ("Chatbots",                    "CHATBOT",     ["", "CHATBOT", "", ""]),
]
for service, label, frags in SERVICES:
    assert len(frags) == SLOTS, label
    # the fragments must reconstruct the label exactly - spaces are carried by
    # the block gap, so they are the only thing normalised away
    flat = "".join(frags).replace(" ", "").replace("\n", "")
    assert flat == label.replace(" ", ""), (label, flat)
    assert sum(1 for t in frags if t) <= 2, f"{label} uses more than two blocks"

RING_RGB = [(0x1c, 0x1c, 0x1a), (0xdc, 0xdc, 0xd5), (0xff, 0xf1, 0x00), (0xd1, 0xff, 0xca),
            (0x6b, 0x6b, 0x63), (0xff, 0xff, 0xff), (0xd1, 0xff, 0xca)]


def lin(c):
    def f(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)


def luminance(c):
    r, g, b, _ = lin(c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


# ── ink: flat matte, no grain. Chosen per ring by WCAG contrast, not by a
#    lightness guess - #6b6b63 is the one that flips the naive test. ───────
def ink(name, rgb):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value = lin(rgb)
    b.inputs["Roughness"].default_value = 0.52
    b.inputs["Metallic"].default_value = 0.0
    for s in ("Specular IOR Level", "Specular"):
        if s in b.inputs:
            b.inputs[s].default_value = 0.35
            break
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    if hasattr(m, "surface_render_method"):
        m.surface_render_method = "DITHERED"
    return m


INK_LIGHT = ink("TP_Type_Light", (0xff, 0xff, 0xff))
INK_DARK = ink("TP_Type_Dark", (0x0a, 0x0a, 0x0a))
WHITE, BLACK = (0xff, 0xff, 0xff), (0x0a, 0x0a, 0x0a)

# ── clear every legacy label; this script is the only source of type ─────
old = [o for o in bpy.data.objects if o.type == "FONT"]
for o in old:
    bpy.data.objects.remove(o, do_unlink=True)
print(f"[labels] removed {len(old)} legacy text objects")

font = bpy.data.fonts.load(FONT_PATH)

# ── the two outward faces, measured off the shared mesh ─────────────────
blocks = {(o["ring"], o["col"]): o for o in bpy.data.objects if o.name.startswith("Block_")}
assert len(blocks) == RINGS * COLS, len(blocks)
me = blocks[(0, 0)].data
faces = {}
for p in me.polygons:
    n = p.normal
    if n.x > 0.3 and abs(n.y) > 0.3:
        side = "L" if n.y > 0 else "R"
        if side not in faces or p.area > faces[side].area:
            faces[side] = p
FACE = {s: (faces[s].center.copy(), faces[s].normal.copy(), faces[s].area) for s in ("L", "R")}
FACE_H = sc["BLOCK_H"]
for s, (c, n, area) in FACE.items():
    print(f"[labels] face {s}: centre {tuple(round(v,4) for v in c)} "
          f"normal az {math.degrees(math.atan2(n.y, n.x)):+.2f} deg  "
          f"flat {area/FACE_H:.3f} x {FACE_H:.3f}")
FACE_W = FACE["L"][2] / FACE_H

cam = sc.camera
cam_az = math.degrees(math.atan2(cam.location.y, cam.location.x))
HOME_R = blocks[(0, 0)]["home_r"]


def wrap(d):
    return (d + 180.0) % 360.0 - 180.0


# ── one printable face per block, ordered the way the camera reads them ──
sc.frame_set(sc.frame_start)
bpy.context.view_layer.update()
ring0_z = blocks[(0, 0)].matrix_world.translation.z
cat = []
for c in range(COLS):
    a = c * 360.0 / COLS
    # of the block's two halves, keep the one whose normal is nearest the
    # camera; the other is the valley face and is left blank
    best = min(("R", "L"), key=lambda s_: abs(wrap(
        a + math.degrees(math.atan2(FACE[s_][1].y, FACE[s_][1].x)) - cam_az)))
    phi = a + math.degrees(math.atan2(FACE[best][1].y, FACE[best][1].x))
    ctr = FACE[best][0]
    # ORDER BY WHERE THE FACE IS, NOT WHERE IT POINTS - the normal sits 46.5
    # degrees off the block's axis while the face itself sits only 12.5 off,
    # and sorting by the normal interleaves neighbouring blocks, which shuffles
    # the name into the wrong order.
    w = (Vector((math.cos(math.radians(a)), math.sin(math.radians(a)), 0.0)) * HOME_R
         + Matrix.Rotation(math.radians(a), 3, "Z") @ Vector((ctr.x, ctr.y, 0.0))
         + Vector((0.0, 0.0, ring0_z)))
    cat.append({"col": c, "side": best, "phi": phi,
                "psi": math.degrees(math.atan2(w.y, w.x)),
                "sx": world_to_camera_view(sc, cam, w).x,
                "off": abs(wrap(phi - cam_az)),
                "visible": abs(wrap(phi - cam_az)) < 90.0})
cat.sort(key=lambda f: wrap(f["psi"] - cam_az))
for i, f in enumerate(cat):
    f["rank"] = i

vis = sorted([f for f in cat if f["visible"]], key=lambda f: f["sx"])
assert len(vis) == SLOTS, f"expected {SLOTS} readable blocks, got {len(vis)}"
step = (vis[1]["rank"] - vis[0]["rank"]) % len(cat)
assert step in (1, len(cat) - 1), f"readable blocks are not consecutive: {step}"
step = 1 if step == 1 else -1
print(f"[labels] camera az {cam_az:+.2f}; {len(vis)} of {COLS} blocks turn a face to it")
print("[labels] reading order L->R: " + "  ".join(
    f"c{f['col']}{f['side']}({f['off']:.0f} deg off)" for f in vis))
for f in cat:
    f["slot"] = ((f["rank"] - vis[0]["rank"]) * step) % SLOTS
assert [f["slot"] for f in vis] == list(range(SLOTS)), [f["slot"] for f in vis]

# ── lay the type ────────────────────────────────────────────────────────
made = 0
sizes = []
for ring in range(RINGS):
    service, label, frags = SERVICES[ring]
    body = RING_RGB[ring]
    use_light = contrast(body, WHITE) >= contrast(body, BLACK)
    mat = INK_LIGHT if use_light else INK_DARK
    ratio = max(contrast(body, WHITE), contrast(body, BLACK))
    for f in cat:
        text = frags[f["slot"]]
        if not text:
            continue
        blk = blocks[(ring, f["col"])]
        centre, normal, _ = FACE[f["side"]]
        cu = bpy.data.curves.new(f"TXT_R{ring}_C{f['col']}{f['side']}", type="FONT")
        cu.body = text
        cu.font = font
        cu.align_x = "CENTER"
        cu.align_y = "CENTER"
        cu.size = CAP_H / CAP_EM              # same cap height on every ring
        cu.space_character = TRACK            # the display roles' tracking
        cu.space_line = LEADING               # only bites on the two-line one
        cu.extrude = EXTRUDE
        cu.materials.append(mat)
        ob = bpy.data.objects.new(cu.name, cu)
        blk.users_collection[0].objects.link(ob)
        # Width is checked, not fitted. Dimensions are only valid on the
        # EVALUATED object - reading them off the new object returns 0, which
        # is how a six-letter word once ended up wider than its own face.
        dg = bpy.context.evaluated_depsgraph_get()
        dg.update()
        w = ob.evaluated_get(dg).dimensions.x
        assert w > 0.01, (text, w)
        if w > MAX_FILL * FACE_W:             # guard: shrink, never grow
            cu.size *= MAX_FILL * FACE_W / w
            dg.update()
            w = ob.evaluated_get(dg).dimensions.x
        sizes.append((cu.size, text, round(w / FACE_W * 100)))
        # place on the face, standing off by the extrude depth so the back of
        # the lettering sits exactly on the surface - no z-fighting, no float
        ob.parent = blk
        ob.matrix_parent_inverse = Matrix.Identity(4)
        ob.location = centre + normal * OFFSET
        x = Vector((-normal.y, normal.x, 0.0)).normalized()   # baseline
        z = normal.normalized()
        y = Vector((0.0, 0.0, 1.0))
        ob.rotation_euler = Matrix([[x.x, y.x, z.x], [x.y, y.y, z.y], [x.z, y.z, z.z]]).to_euler()
        made += 1
    print(f"[labels] ring {ring}: {service} -> {label!r} as {[t for t in frags if t]}  "
          f"ink {'light' if use_light else 'dark'} on #{body[0]:02x}{body[1]:02x}{body[2]:02x} "
          f"({ratio:.1f}:1)")

bpy.ops.wm.save_as_mainfile(filepath=OUT)
print(f"[labels] {made} fragments placed across {RINGS} rings x {len(cat)} blocks "
      f"(face {FACE_W:.3f} x {FACE_H:.3f} units)")
widest = max(sizes, key=lambda t: t[2])
base = round(CAP_H, 4)
shrunk = sorted({(t[1], round(t[0] * CAP_EM, 4)) for t in sizes if round(t[0] * CAP_EM, 4) != base})
print(f"[labels] cap height {base} units on a {FACE_H:.3f} face ({CAP_H / FACE_H * 100:.0f}% of it) "
      f"- one value across all seven rings")
print(f"[labels] widest label {widest[1]!r} fills {widest[2]}% of the face width "
      f"(guard trips above {MAX_FILL * 100:.0f}%)")
assert widest[2] <= MAX_FILL * 100 + 1, widest
assert not shrunk, f"the guard had to shrink {shrunk}; every label must share one cap height"
print(f"[labels] font: {font.name}")
