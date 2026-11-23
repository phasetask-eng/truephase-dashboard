"""
The Truephase cube: a 3x3 built from 26 separate cubies plus the core cross,
exploded at frame 1 and perfectly assembled at the last frame. Scroll on the
site scrubs the frame index, so scroll IS the assembly.

GEOMETRY, from the reference video: cubies with a soft bevel, an inset
rounded tile on every exterior face sitting slightly proud of the body, a
visible gap between cubies, and a six-armed core that the centres sit on -
the thing you glimpse when the reference bursts.

ORDER OF ASSEMBLY IS INSIDE-OUT: the core is already home, the six centres
arrive first (they are on the axes), then the twelve edges, then the eight
corners. Every piece travels along ITS OWN outward ray from the cube's centre
- the rays diverge, so a piece never has to cross a neighbour that is already
seated - with a sideways bow that dies away before it arrives, and a tumble
that is fully corrected before the final slide. Positions end EXACT: the
assembled pose is the lattice, not the animation's last sample.

Two-stage arrival: the piece flies to 98% of the way with a smooth decel,
then eases the last 2% - approach, then settle. No overshoot in position
(it would push into neighbours); the tumble is what carries the life.
"""
import bpy, bmesh, math, random, sys
from mathutils import Vector, Matrix, Quaternion

A = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = A[0]
N_FRAMES = int(A[1]) if len(A) > 1 else 144
SEED = int(A[2]) if len(A) > 2 else 7
random.seed(SEED)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [
    i.identifier for i in sc.render.bl_rna.properties["engine"].enum_items] else "BLENDER_EEVEE"
sc.render.resolution_x = sc.render.resolution_y = 1000
sc.render.fps = 30
sc.frame_start, sc.frame_end = 1, N_FRAMES
sc.render.film_transparent = True
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"

# ── proportions ──────────────────────────────────────────────────────────
S = 1.0            # cubie size
GAP = 0.045        # visible seam between cubies
PITCH = S + GAP
BEVEL = 0.075
TILE = 0.80        # tile width as a share of the cubie face
TILE_R = 0.13      # tile corner radius
TILE_T = 0.035     # tile thickness (stands proud of the body)
CUBE_W = 3 * PITCH - GAP   # 3.09 across

# ── palette: the site's tokens, and only those ───────────────────────────
def lin(c):
    def f(v):
        v /= 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)

BODY = (0x1c, 0x1c, 0x1a)
FACES = {                     # axis-direction -> tile colour
    ( 0,  0,  1): ("Up",    (0xf7, 0xf7, 0xf4)),   # warm off-white
    ( 0,  0, -1): ("Down",  (0x2e, 0x2e, 0x2a)),   # charcoal tile
    ( 0, -1,  0): ("Front", (0xff, 0xf1, 0x00)),   # voltage yellow
    ( 0,  1,  0): ("Back",  (0x6b, 0x6b, 0x63)),   # smoke
    ( 1,  0,  0): ("Right", (0xd1, 0xff, 0xca)),   # mint chip
    (-1,  0,  0): ("Left",  (0xdc, 0xdc, 0xd5)),   # ash
}


def new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    co = nt.nodes.new("ShaderNodeTexCoord")
    return m, nt, b, co


def ramp(nt, fac, stops, interp="LINEAR"):
    r = nt.nodes.new("ShaderNodeValToRGB")
    r.color_ramp.interpolation = interp
    while len(r.color_ramp.elements) > 1:
        r.color_ramp.elements.remove(r.color_ramp.elements[-1])
    r.color_ramp.elements[0].position, r.color_ramp.elements[0].color = stops[0]
    for p, c in stops[1:]:
        r.color_ramp.elements.new(p).color = c
    nt.links.new(fac, r.inputs["Fac"])
    return r


def spec(b, v):
    for s in ("Specular IOR Level", "Specular"):
        if s in b.inputs:
            b.inputs[s].default_value = v
            return


def aggregate(name, body, rough, density=0.18, drift=0.06, scale=34.0, bump=0.03):
    """The hero's cast-aggregate recipe: discrete mineral flecks (Voronoi
    distance, hard threshold) driving colour, roughness and a shallow bump.
    Object-space coordinates, so every tile gets its own fleck pattern."""
    m, nt, b, co = new_mat(name)
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.feature = "F1"
    vor.inputs["Scale"].default_value = scale
    nt.links.new(co.outputs["Object"], vor.inputs["Vector"])
    mask = ramp(nt, vor.outputs["Distance"], [(0.0, (1, 1, 1, 1)), (density, (0, 0, 0, 1))], "CONSTANT")
    clump = nt.nodes.new("ShaderNodeTexNoise")
    clump.inputs["Scale"].default_value = 3.4
    nt.links.new(co.outputs["Object"], clump.inputs["Vector"])
    clump_r = ramp(nt, clump.outputs["Fac"], [(0.30, (0.35,) * 3 + (1,)), (0.62, (1, 1, 1, 1))])
    mm = nt.nodes.new("ShaderNodeMix"); mm.data_type = "RGBA"; mm.blend_type = "MULTIPLY"
    mm.inputs["Factor"].default_value = 1.0
    nt.links.new(mask.outputs["Color"], mm.inputs[6]); nt.links.new(clump_r.outputs["Color"], mm.inputs[7])
    dn = nt.nodes.new("ShaderNodeTexNoise"); dn.inputs["Scale"].default_value = 2.4
    nt.links.new(co.outputs["Object"], dn.inputs["Vector"])
    lo = tuple(max(0, min(1, v * (1 - drift))) for v in lin(body)[:3]) + (1,)
    hi = tuple(max(0, min(1, v * (1 + drift))) for v in lin(body)[:3]) + (1,)
    body_r = ramp(nt, dn.outputs["Fac"], [(0.30, lo), (0.70, hi)])
    sepc = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(vor.outputs["Color"], sepc.inputs["Vector"])
    grit = ramp(nt, sepc.outputs["X"], [(0.0, lin((0x2a, 0x2a, 0x27))), (0.6, lin((0x3a, 0x39, 0x33))),
                                         (0.82, lin((0x8c, 0x74, 0x46))), (0.92, lin((0xa8, 0xa8, 0xa0)))], "CONSTANT")
    alb = nt.nodes.new("ShaderNodeMix"); alb.data_type = "RGBA"
    nt.links.new(mm.outputs[2], alb.inputs["Factor"])
    nt.links.new(body_r.outputs["Color"], alb.inputs[6]); nt.links.new(grit.outputs["Color"], alb.inputs[7])
    nt.links.new(alb.outputs[2], b.inputs["Base Color"])
    rr = ramp(nt, mm.outputs[2], [(0.0, (rough,) * 3 + (1,)), (1.0, (rough - 0.08,) * 3 + (1,))])
    nt.links.new(rr.outputs["Color"], b.inputs["Roughness"])
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump
    nt.links.new(mm.outputs[2], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Metallic"].default_value = 0.0
    spec(b, 0.40)
    return m


M_BODY = aggregate("TP_Cube_Body", BODY, 0.70, density=0.12, drift=0.14, scale=40.0, bump=0.02,)
M_TILE = {d: aggregate(f"TP_Tile_{n}", c, 0.74, density=0.17) for d, (n, c) in FACES.items()}

# ── meshes ───────────────────────────────────────────────────────────────
coll = bpy.data.collections.new("Cube")
sc.collection.children.link(coll)


def smooth(me):
    me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))


def cubie_mesh():
    me = bpy.data.meshes.new("MESH_Cubie")
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=S)
    bm.to_mesh(me); bm.free()
    smooth(me)
    me.materials.append(M_BODY)
    return me


def tile_mesh():
    me = bpy.data.meshes.new("MESH_Tile")
    bm = bmesh.new()
    h = TILE * S / 2
    vs = [bm.verts.new(v) for v in ((-h, -h, 0), (h, -h, 0), (h, h, 0), (-h, h, 0))]
    bm.faces.new(vs)
    bmesh.ops.bevel(bm, geom=vs, offset=TILE_R, segments=7, affect="VERTICES", profile=0.5)
    bm.to_mesh(me); bm.free()
    smooth(me)
    return me


ME_CUBIE = cubie_mesh()
ME_TILE = tile_mesh()


def add_bevel(ob, width, segs):
    m = ob.modifiers.new("Bevel", "BEVEL")
    m.width, m.segments = width, segs
    m.limit_method = "ANGLE"
    m.harden_normals = True
    return m


def make_piece(idx):
    i, j, k = idx
    root = bpy.data.objects.new(f"Block_{i+1}{j+1}{k+1}", ME_CUBIE)
    coll.objects.link(root)
    add_bevel(root, BEVEL, 4)
    for d, mat in M_TILE.items():
        if (i, j, k)[[abs(x) for x in d].index(1)] != sum(d):
            continue                                   # not an exterior face
        t = bpy.data.objects.new(f"{root.name}_tile_{FACES[d][0]}", ME_TILE.copy())
        t.data.materials.append(mat)
        coll.objects.link(t)
        n = Vector(d)
        t.location = n * (S / 2 + 0.004)
        t.rotation_euler = n.to_track_quat("Z", "Y").to_euler()
        sol = t.modifiers.new("Solidify", "SOLIDIFY")
        sol.thickness, sol.offset = TILE_T, 1.0
        sol.use_even_offset = True
        add_bevel(t, 0.012, 2)
        t.parent = root
        t.matrix_parent_inverse = Matrix.Identity(4)
    return root


# the core cross: what the centres sit on, seen only while exploded
def make_core():
    core = bpy.data.objects.new("Core", None)
    coll.objects.link(core)
    for ax in range(3):
        for sgn in (-1, 1):
            me = bpy.data.meshes.new(f"MESH_Arm{ax}{sgn}")
            bm = bmesh.new()
            bmesh.ops.create_cone(bm, cap_ends=True, segments=24, radius1=0.13, radius2=0.13, depth=PITCH)
            bm.to_mesh(me); bm.free(); smooth(me); me.materials.append(M_BODY)
            arm = bpy.data.objects.new(f"CoreArm_{ax}{'p' if sgn > 0 else 'n'}", me)
            coll.objects.link(arm)
            d = Vector([0, 0, 0]); d[ax] = sgn
            arm.location = d * PITCH / 2
            arm.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
            arm.parent = core
    me = bpy.data.meshes.new("MESH_CoreBall")
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=16, radius=0.30)
    bm.to_mesh(me); bm.free(); smooth(me); me.materials.append(M_BODY)
    ball = bpy.data.objects.new("CoreBall", me); coll.objects.link(ball); ball.parent = core
    return core


CUBE = bpy.data.objects.new("CUBE", None)
coll.objects.link(CUBE)
core = make_core()
core.parent = CUBE

pieces = []
for i in (-1, 0, 1):
    for j in (-1, 0, 1):
        for k in (-1, 0, 1):
            if (i, j, k) == (0, 0, 0):
                continue
            p = make_piece((i, j, k))
            p.parent = CUBE
            p.matrix_parent_inverse = Matrix.Identity(4)
            p["home"] = (i * PITCH, j * PITCH, k * PITCH)
            p["kind"] = {1: "centre", 2: "edge", 3: "corner"}[abs(i) + abs(j) + abs(k)]
            pieces.append(p)

# ── the explosion, designed per piece ────────────────────────────────────
KIND_WINDOW = {           # when each class of piece is in flight (0..1 of the scrub)
    "centre": (0.00, 0.60),
    "edge":   (0.04, 0.80),
    "corner": (0.10, 0.955),
}
# NESTED LAUNCH SHELLS, measured from the cube's centre, not from each home:
# centres park innermost, corners outermost. Inside-out arrival then means
# no piece ever flies through a shell where something is still parked - the
# earlier single shell had centres crossing waiting edges.
SHELL = {"centre": (2.0, 2.5), "edge": (2.9, 3.5), "corner": (3.8, 4.5)}
SETTLE = 0.985            # share of the way reached by the smooth approach
DEPTH_MAX = 1.4           # how far toward the lens a piece may start (units)


def ss(t):
    t = max(0.0, min(1.0, t))
    return t * t * t * (t * (t * 6 - 15) + 10)


def approach(u):
    """smooth decel to SETTLE by u=0.86, then the last slide to 1.0"""
    if u <= 0.86:
        return SETTLE * ss(u / 0.86)
    v = (u - 0.86) / 0.14
    return SETTLE + (1.0 - SETTLE) * (1 - (1 - v) ** 3)


CAM_DIR = Vector((math.cos(math.radians(-34)), math.sin(math.radians(-34)), 0.0))   # ground-forward: + is toward the lens


def pose(P, t):
    """(position, quaternion) of a piece with launch params P at scrub t"""
    u = max(0.0, min(1.0, (t - P["t0"]) / (P["t1"] - P["t0"])))
    a = approach(u)
    # the sideways bow is EXACTLY zero from 70% of the flight: at 90% the old
    # bump was still 0.065 wide with the piece 0.04 from its seat, across a
    # 0.045 lattice gap - the systematic clash the strict check kept finding
    # ...and it fades IN behind the inward motion too, or the first frames of
    # a launch move the piece slightly away from home before it turns inward
    lateral = P["bow"] * math.sin(math.pi * u / 0.70) ** 2 * ss(u / 0.25) if u < 0.70 else 0.0
    pos = P["start"].lerp(P["home"], a) + P["side"] * lateral
    # the tumble is fully corrected by 72% of the flight, while the piece is
    # still ~0.2 units out: a cubie 8 degrees off-axis at 0.07 out would clip
    # neighbours across a 0.045 gap - measured, that was the failure
    rot = P["q0"].slerp(Quaternion((1, 0, 0, 0)), ss(min(1.0, u / 0.72)))
    return pos, rot


# ── collision test: oriented boxes, separating axes, in numpy ────────────
import numpy as np
HALF = S / 2 + 0.02          # identical to the QC: tiles stand proud
CORN = np.array([[x, y, z] for x in (-HALF, HALF) for y in (-HALF, HALF) for z in (-HALF, HALF)])
R_BROAD = 2 * HALF * math.sqrt(3) + 0.01     # beyond this, boxes cannot touch


def box(pos, q):
    R = np.array(q.to_matrix())
    return np.array(pos) + CORN @ R.T, R.T      # corners (8x3), axes as rows (3x3)


def hit(ca, aa, cb, ab, eps=0.003):
    cross = np.cross(aa[:, None, :], ab[None, :, :]).reshape(-1, 3)
    n = np.linalg.norm(cross, axis=1)
    cross = cross[n > 1e-6] / n[n > 1e-6, None]
    axes = np.vstack([aa, ab, cross])
    pa, pb = axes @ ca.T, axes @ cb.T
    sep = (pa.max(1) < pb.min(1) + eps) | (pb.max(1) < pa.min(1) + eps)
    return not sep.any()


SAMPLES = [f / (N_FRAMES - 1) for f in range(N_FRAMES)]   # every rendered frame
placed_boxes = []            # per placed piece: list over SAMPLES of (corners, axes, centre)


def candidate(p):
    home = Vector(p["home"])
    ray = home.normalized()
    kind = p["kind"]
    # No depth cap: three home rays point almost straight at the lens, and a
    # cap on how close a launch may come to the camera rejected EVERY
    # direction in their cone - the sampler never returned. Perspective
    # growth at the nearest launch is ~1.3x, which reads as depth, not looming.
    for _ in range(200):
        jitter = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))).normalized()
        d = (ray + jitter * 0.5 + CAM_DIR * random.uniform(-0.55, 0.25)).normalized()
        # within ~50 degrees of the home ray: any wider and a piece has to
        # cross the seat of a neighbour that arrives before it
        if d.dot(ray) >= 0.64:
            break
    else:
        d = ray
    start = d * random.uniform(*SHELL[kind])
    side = d.cross(Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)))).normalized()
    axis = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))).normalized()
    w0, w1 = KIND_WINDOW[kind]
    return {"home": home, "start": start, "side": side, "bow": random.uniform(0.2, 0.55),
            "q0": Quaternion(axis, math.radians(random.uniform(110, 260)) * random.choice((-1, 1))),
            "t0": w0 + random.uniform(0.0, 0.10), "t1": w1 - random.uniform(0.0, 0.05)}


def path_boxes(P):
    out = []
    for t in SAMPLES:
        pos, q = pose(P, t)
        c, a = box(pos, q)
        out.append((c, a, np.array(pos)))
    return out


def clear_of(bx):
    """True if this path stays clear of every path already placed."""
    for qi, qb in enumerate(placed_boxes):
        for ti in range(len(SAMPLES)):
            ca, aa, pa = bx[ti]; cb, ab, pb = qb[ti]
            if np.linalg.norm(pa - pb) > R_BROAD:
                continue
            if hit(ca, aa, cb, ab):
                clear_of.last = (qi, SAMPLES[ti], float(np.linalg.norm(pa - pb)), tuple(pa.round(2)), tuple(pb.round(2)))
                return False
    return True


# inside-out, so each class is checked against what will already be seated
placed = []
tries_total = 0
worst = 0
for p in sorted(pieces, key=lambda o: {"centre": 0, "edge": 1, "corner": 2}[o["kind"]]):
    for n in range(200):
        P = candidate(p)
        tries_total += 1
        bx = path_boxes(P)
        if clear_of(bx):
            worst = max(worst, n + 1)
            break
    else:
        print("[cube] DEBUG last collision:", clear_of.last, "home", tuple(p["home"]),
              "placed homes", [tuple(round(v,2) for v in Q["home"]) for Q in placed])
        raise RuntimeError(f"no collision-free launch for {p.name}")
    placed.append(P)
    placed_boxes.append(bx)
    print(f"[cube] placed {p.name} ({p['kind']}) after {n + 1} tries", flush=True)
    p["t0"], p["t1"] = P["t0"], P["t1"]
    p.rotation_mode = "QUATERNION"
    for f in range(1, N_FRAMES + 1):
        pos, rot = pose(P, (f - 1) / (N_FRAMES - 1))
        p.location = pos
        p.rotation_quaternion = rot
        p.keyframe_insert("location", frame=f)
        p.keyframe_insert("rotation_quaternion", frame=f)
print(f"[cube] launches sampled: {tries_total} tries for {len(pieces)} pieces (worst piece {worst}), all paths pairwise clear")

# the whole cube eases from a slight turn into its final presentation angle
for f in range(1, N_FRAMES + 1):
    t = (f - 1) / (N_FRAMES - 1)
    CUBE.rotation_euler = (0.0, 0.0, math.radians(-28.0) * (1 - ss(t)))
    CUBE.keyframe_insert("rotation_euler", frame=f)

for fc in [c for o in bpy.data.objects if o.animation_data and o.animation_data.action
           for lay in o.animation_data.action.layers for st in lay.strips for bag in st.channelbags
           for c in bag.fcurves]:
    for kp in fc.keyframe_points:
        kp.interpolation = "LINEAR"

# ── camera and light: the reference's angle, the site's light ────────────
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 50.0
cam = bpy.data.objects.new("Camera", cam_data)
sc.collection.objects.link(cam)
sc.camera = cam
ELEV, AZ, DIST_CAM = math.radians(22.0), math.radians(-34.0), 16.4
cam.location = Vector((math.cos(AZ) * math.cos(ELEV), math.sin(AZ) * math.cos(ELEV), math.sin(ELEV))) * DIST_CAM
cam.rotation_euler = (-cam.location).to_track_quat("-Z", "Y").to_euler()

for name, energy, size, loc, col in (
        ("KEY", 900.0, 5.0, (-5.5, -6.5, 8.0), (1.0, 0.98, 0.94)),
        ("FILL", 220.0, 9.0, (8.0, -4.0, 3.0), (1.0, 1.0, 1.0)),
        ("RIM", 320.0, 3.0, (2.0, 7.5, 5.0), (1.0, 1.0, 1.0))):
    ld = bpy.data.lights.new(name, "AREA")
    ld.energy, ld.size, ld.color = energy, size, col
    ld.use_shadow = True
    lo = bpy.data.objects.new(name, ld)
    sc.collection.objects.link(lo)
    lo.location = loc
    lo.rotation_euler = (-Vector(loc)).to_track_quat("-Z", "Y").to_euler()

w = bpy.data.worlds.new("World"); w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = lin((0xef, 0xef, 0xed))
w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.42
sc.world = w
for attr, val in (("taa_render_samples", 96), ("use_shadows", True), ("use_raytracing", True),
                  ("shadow_ray_count", 4), ("shadow_step_count", 8), ("use_fast_gi", True)):
    if hasattr(sc.eevee, attr):
        try:
            setattr(sc.eevee, attr, val)
        except Exception as e:
            print("[cube] skipped", attr, e)

sc["CUBE_W"], sc["PITCH"], sc["S"] = CUBE_W, PITCH, S
bpy.ops.wm.save_as_mainfile(filepath=OUT)
print(f"[cube] {len(pieces)} cubies + core; cube {CUBE_W:.2f} across, pitch {PITCH}, gap {GAP}, bevel {BEVEL}")
print(f"[cube] {N_FRAMES} frames; windows {KIND_WINDOW}")
print(f"[cube] camera elev {math.degrees(ELEV):.0f} az {math.degrees(AZ):.0f} lens {cam_data.lens}")
