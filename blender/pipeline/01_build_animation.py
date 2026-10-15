"""
Rebuild the animation on the Dayos mechanics, observed on the live site
(hero-latest.webm, 10.17 s loop, sampled every 0.5 s and then every 0.3 s).

WHAT DAYOS ACTUALLY DOES - and what this reproduces:
  * a ring of six blocks leaves the tower NEAR THE BASE as one unit: it slides
    out radially, tips outward like petals (inner faces up), rises up the
    OUTSIDE of the stack and closes onto the TOP slot;
  * every ring above it drops one slot while it is in flight - a mechanical
    layer exchange, not two things translating;
  * about two rings are in flight at any moment, so nothing is ever still;
  * the whole tower leans slowly across the loop (~8 degrees);
  * every ring keeps a permanent material, and two ring colours repeat
    (Dayos repeats its dark and its white). Inner faces carry a flat accent.
  * the bottom of the tower dissolves INSIDE the render, not in CSS.

Seven rings on a six-slot stack. Ring i departs at i*P; its state is a pure
function of phase = ((t - i*P) mod 7P)/P, so frame F0 and F0+LOOP are
identical by construction - the seam is exact, not tuned.

OUR CONCEPT SURVIVES: the modular tower, one master mesh instanced, one colour
per layer, and the Rubik's counter-twist - slot 3 clockwise, slots 1-2
anti-clockwise, out and back to zero between drops so no block ever changes
slot on a twisted structure. Dayos has no twist, so it is kept small (18 deg).
"""
import bpy, math, sys
from mathutils import Vector, Matrix

A = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
BLEND, OUT = A[0], A[1]
bpy.ops.wm.open_mainfile(filepath=BLEND)
sc = bpy.context.scene

FPS, P, N_RINGS, STACK, COLS = 24, 36, 7, 6, 6
LOOP = N_RINGS * P                                   # 252 frames = 10.5 s
F0 = 1
SPACING, H = sc["ROW_SPACING"], sc["BLOCK_H"]


def row_z(r): return r * SPACING - (STACK - 1) * SPACING / 2


old = sorted([o for o in bpy.data.objects if o.name.startswith("Block_")], key=lambda o: o.name)
HOME_R = old[0]["home_r"]
HX = max(v[0] for v in old[0].bound_box)             # the apex ridge, local +X
HINGE = Vector((HX, 0.0, -H / 2))                    # outer-bottom edge: the petal hinge

# ── choreography, in cadence units (1.0 = P frames) ─────────────────────
# X_OUT is the minimum that lets an upright block pass the apex ridge; anything
# more and the ring orbits instead of hugging the stack (measured: an extra
# 0.25 arc plus a 50-degree tip put the petals half a width out and the tower
# at 44% of frame). Tipping does not buy clearance with a block this deep.
X_OUT, X_ARC, THETA = 1.08, 0.00, math.radians(45.0)
Z_HOVER = row_z(STACK - 1) + 0.25
T_SLIDE, T_TIP, T_RISE, T_CLOSE = (0.00, 0.30), (0.20, 0.60), (0.30, 1.80), (1.80, 2.25)
DROP = (0.30, 0.90)                                  # the stack settles one slot
TWIST_W, TWIST = (0.92, 1.26), math.radians(18.0)    # between the drop and the next
LEAN, YAW, YAW_PHASE = math.radians(6.0), math.radians(8.0), 1.1

# inner-face clearance: the tower's apex radius is R_APEX; the inner face of a
# block slid out by X_OUT sits at HOME_R + X_OUT - (HOME_R - R_IN cos30)
R_APEX, R_IN = sc["R_APEX"], sc["R_IN"]
inner_r = HOME_R + X_OUT - (HOME_R - R_IN * math.cos(math.radians(30)))
assert inner_r > R_APEX + 0.03, f"petal would sweep the tower: {inner_r:.3f} vs {R_APEX}"

# ── rings: departure order, permanent material, inner accent ────────────
# graphite, ash, yellow, mint, smoke, white, mint again. The repeat sits three
# rings from its twin and never adjacent to it, including across the wrap.
RING_MAT = ["TP_Layer_0", "TP_Layer_1", "TP_Layer_3", "TP_Layer_2",
            "TP_Layer_4", "TP_Layer_5", "TP_Layer_2"]
RING_RGB = [(0x1c, 0x1c, 0x1a), (0xdc, 0xdc, 0xd5), (0xff, 0xf1, 0x00), (0xd1, 0xff, 0xca),
            (0x6b, 0x6b, 0x63), (0xff, 0xff, 0xff), (0xd1, 0xff, 0xca)]
RING_INNER = ["Y", "Y", "G", "G", "Y", "Y", "G"]


def lin(c):
    def f(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)


def coated(name, body, rough):
    """Flat painted accent for the inner faces - same recipe as the mint layer."""
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    co = nt.nodes.new("ShaderNodeTexCoord")
    sub = nt.nodes.new("ShaderNodeTexNoise")
    sub.inputs["Scale"].default_value = 7.0
    sub.inputs["Detail"].default_value = 3.0
    nt.links.new(co.outputs["Object"], sub.inputs["Vector"])
    r = nt.nodes.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].position = 0.32
    r.color_ramp.elements[0].color = tuple(v * 0.94 for v in lin(body)[:3]) + (1.0,)
    r.color_ramp.elements[1].position = 0.70
    r.color_ramp.elements[1].color = tuple(min(1.0, v * 1.05) for v in lin(body)[:3]) + (1.0,)
    nt.links.new(sub.outputs["Fac"], r.inputs["Fac"])
    nt.links.new(r.outputs["Color"], b.inputs["Base Color"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.018
    nt.links.new(sub.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = 0.0
    for s in ("Specular IOR Level", "Specular"):
        if s in b.inputs:
            b.inputs[s].default_value = 0.55
            break
    return m


INNER = {"Y": coated("TP_Inner_Yellow", (0xff, 0xf1, 0x00), 0.48),
         "G": coated("TP_Inner_Graphite", (0x1c, 0x1c, 0x1a), 0.52)}

# ── the inner face gets its own slot on the ONE shared mesh ─────────────
me = old[0].data
while len(me.materials) < 2:
    me.materials.append(None)
n_inner = 0
for p in me.polygons:
    if p.normal.x < -0.85:
        p.material_index = 1
        n_inner += 1
    else:
        p.material_index = 0

# ── seven rings of six: rows 0-5 as they are, ring 6 instanced from row 0 ─
rings = []
for i in range(STACK):
    rings.append([bpy.data.objects[f"Block_R{i+1:02d}_C{c+1:02d}"] for c in range(COLS)])
extra = []
for c in range(COLS):
    src = rings[0][c]
    n = src.copy()                     # same mesh datablock - still one master
    n.animation_data_clear()
    n.name = f"Block_R07_C{c+1:02d}"
    src.users_collection[0].objects.link(n)
    extra.append(n)
rings.append(extra)

root = bpy.data.objects.get("ROOT_TOWER") or bpy.data.objects.new("ROOT_TOWER", None)
if root.name not in sc.collection.objects and not root.users_collection:
    sc.collection.objects.link(root)
root.animation_data_clear()
root.location = (0, 0, 0)
root.rotation_euler = (0, 0, 0)

for i, ring in enumerate(rings):
    for c, o in enumerate(ring):
        o.animation_data_clear()
        o["row"] = i
        o["ring"] = i
        o["col"] = c
        o.parent = root
        o.matrix_parent_inverse = Matrix.Identity(4)
        for k in range(2):
            o.material_slots[k].link = "OBJECT"
        o.material_slots[0].material = bpy.data.materials[RING_MAT[i]]
        o.material_slots[1].material = INNER[RING_INNER[i]]

# labels keep contrast against whatever ring they now sit on
for ob in bpy.data.objects:
    if ob.type != "FONT" or not ob.parent:
        continue
    c = RING_RGB[ob.parent["ring"]]
    lum = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    ob.data.materials.clear()
    ob.data.materials.append(bpy.data.materials["TP_Type_Light" if lum < 110 else "TP_Type_Dark"])

# ── which way is clockwise on screen, measured through the camera ────────
cam = sc.camera
cam.animation_data_clear()
cam.data.lens = 60.0                                 # Dayos reads wider than 85
inv = cam.matrix_world.inverted()


def screen_angle(phi, z):
    axis = inv @ Vector((0.0, 0.0, z))
    tot = 0.0
    for c in range(COLS):
        a = c * math.tau / COLS + phi
        p = inv @ Vector((math.cos(a) * HOME_R, math.sin(a) * HOME_R, z))
        d = p - axis
        tot += math.atan2(d.y, d.x)
    return tot / COLS


CW = -1.0 if screen_angle(math.radians(6), row_z(3)) > screen_angle(0.0, row_z(3)) else 1.0
TWIST_BY_SLOT = {3: CW * TWIST, 2: -CW * TWIST, 1: -CW * TWIST}

# the lean axis: the camera's forward direction laid flat on the ground, so
# the tower leans left/right ON SCREEN rather than toward the viewer
fwd = -cam.matrix_world.translation.copy()
fwd.z = 0.0
fwd.normalize()


# ── the motion, as pure functions of phase ──────────────────────────────
def ss(t):
    t = max(0.0, min(1.0, t))
    return t * t * t * (t * (t * 6 - 15) + 10)


def seg(phi, a, b): return ss((phi - a) / (b - a))


def tri(u):
    u = max(0.0, min(1.0, u))
    return ss(u / 0.5) if u < 0.5 else ss((1.0 - u) / 0.5)


def ring_state(phi):
    """(dx, theta, z, slot_or_None) for a ring at phase phi in [0, N_RINGS)."""
    if phi < T_CLOSE[1]:
        dx = X_OUT * seg(phi, *T_SLIDE)
        if T_RISE[0] <= phi <= T_RISE[1]:
            u = (phi - T_RISE[0]) / (T_RISE[1] - T_RISE[0])
            dx += X_ARC * math.sin(math.pi * u)
        th = THETA * seg(phi, *T_TIP)
        z = row_z(0) + (Z_HOVER - row_z(0)) * seg(phi, *T_RISE)
        if phi >= T_CLOSE[0]:
            e = seg(phi, *T_CLOSE)
            dx, th = X_OUT * (1 - e), THETA * (1 - e)
            z = Z_HOVER + (row_z(STACK - 1) - Z_HOVER) * e
        return dx, th, z, None
    s = float(STACK - 1)
    for j in range(2, N_RINGS):
        s -= seg(phi, j + DROP[0], j + DROP[1])
    return 0.0, 0.0, row_z(s), s


def twist_at(tau, slot):
    if slot is None or abs(slot - round(slot)) > 1e-6:
        return 0.0
    amp = TWIST_BY_SLOT.get(int(round(slot)), 0.0)
    if amp == 0.0:
        return 0.0
    u = ((tau - TWIST_W[0]) % 1.0) / (TWIST_W[1] - TWIST_W[0])
    return amp * tri(u) if u < 1.0 else 0.0


prefs = bpy.context.preferences.edit
prefs.keyframe_new_interpolation_type = "LINEAR"
prefs.keyframe_new_handle_type = "VECTOR"

max_step = 0.0
prev = {}
for k in range(LOOP + 1):
    f = F0 + k
    t = k / P
    for i, ring in enumerate(rings):
        phi = (t - i) % N_RINGS
        dx, th, z, slot = ring_state(phi)
        tw = twist_at(t % 1.0, slot)
        for c, o in enumerate(ring):
            a = c * math.tau / COLS + tw
            M = (Matrix.Rotation(a, 4, "Z") @ Matrix.Translation((HOME_R + dx, 0.0, z))
                 @ Matrix.Translation(HINGE) @ Matrix.Rotation(th, 4, "Y")
                 @ Matrix.Translation(-HINGE))
            o.location = M.translation
            o.rotation_euler = (0.0, th, a)
            o.keyframe_insert("location", frame=f)
            o.keyframe_insert("rotation_euler", frame=f)
            if o.name in prev:
                max_step = max(max_step, (M.translation - prev[o.name]).length)
            prev[o.name] = M.translation.copy()
    w = math.tau * k / LOOP
    R = (Matrix.Rotation(LEAN * math.sin(w), 4, fwd)
         @ Matrix.Rotation(YAW * math.sin(w + YAW_PHASE), 4, "Z"))
    root.rotation_euler = R.to_euler("XYZ")
    root.keyframe_insert("rotation_euler", frame=f)

sc.frame_start, sc.frame_end = F0, F0 + LOOP
sc.render.fps, sc.render.fps_base = FPS, 1.0
for key in ("BUILD_END", "ROT_START", "SPIN_ROW"):
    if key in sc:
        del sc[key]
sc["DAYOS_P"], sc["DAYOS_RINGS"], sc["DAYOS_LOOP"] = P, N_RINGS, LOOP

# ── the fade lives in the geometry: alpha = f(world height) ─────────────
FADE_FULL = row_z(1) - H / 2 + 0.02
FADE_ZERO = row_z(0) - H / 2 - 0.02
faded = []
for m in bpy.data.materials:
    if not (m.name.startswith("TP_") and m.use_nodes):
        continue
    nt = m.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if not bsdf or "Alpha" not in bsdf.inputs:
        continue
    for ln in list(nt.links):
        if ln.to_socket == bsdf.inputs["Alpha"]:
            nt.links.remove(ln)
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    rng = nt.nodes.new("ShaderNodeMapRange")
    nt.links.new(geo.outputs["Position"], sep.inputs["Vector"])
    nt.links.new(sep.outputs["Z"], rng.inputs["Value"])
    rng.inputs[1].default_value, rng.inputs[2].default_value = FADE_ZERO, FADE_FULL
    rng.inputs[3].default_value, rng.inputs[4].default_value = 0.0, 1.0
    rng.clamp = True
    nt.links.new(rng.outputs["Result"], bsdf.inputs["Alpha"])
    if hasattr(m, "surface_render_method"):
        m.surface_render_method = "DITHERED"       # stochastic: no sorting artefacts
    if hasattr(m, "use_transparent_shadow"):
        m.use_transparent_shadow = True
    faded.append(m.name)

sc.render.film_transparent = True
if sc.render.engine.startswith("BLENDER_EEVEE"):
    for attr, val in (("taa_render_samples", 128),):
        try:
            setattr(sc.eevee, attr, val)
        except Exception as e:
            print("[build] skipped", attr, e)

bpy.ops.wm.save_as_mainfile(filepath=OUT)
print(f"[build] {len(rings)} rings x {COLS} = {sum(len(r) for r in rings)} blocks on one mesh; "
      f"inner-face polys {n_inner}")
print(f"[build] cadence P={P}f ({P/FPS:.2f}s)  loop {LOOP}f = {LOOP/FPS:.2f}s @ {FPS}fps  "
      f"frames {F0}..{F0+LOOP}")
print(f"[build] flight: slide {T_SLIDE} tip {T_TIP} rise {T_RISE} close {T_CLOSE}; "
      f"drop {DROP}; twist {TWIST_W} {math.degrees(TWIST):.0f}deg (cw sign {CW:+.0f})")
print(f"[build] lean {math.degrees(LEAN):.0f}deg about {tuple(round(v,3) for v in fwd)}, "
      f"yaw {math.degrees(YAW):.0f}deg; max centre step {max_step:.4f} u/frame")
print(f"[build] fade: alpha 1 at z>={FADE_FULL:+.3f}, 0 at z<={FADE_ZERO:+.3f} on {len(faded)} mats")
print(f"[build] petal inner face at r={inner_r:.3f} vs apex {R_APEX} - clears by {inner_r-R_APEX:.3f}")
