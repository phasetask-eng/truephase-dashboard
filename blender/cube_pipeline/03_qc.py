"""QC for the assembling cube: exact final lattice, no interpenetration on the
way in, monotonic progress (scrubbing back must be the exact reverse - it is,
because every pose is keyframed, but the checks below prove the poses)."""
import bpy, sys, math, itertools
from mathutils import Vector
A = sys.argv[sys.argv.index("--") + 1:]
bpy.ops.wm.open_mainfile(filepath=A[0])
sc = bpy.context.scene
F0, F1 = sc.frame_start, sc.frame_end
S, PITCH = sc["S"], sc["PITCH"]
pieces = [o for o in bpy.data.objects if o.name.startswith("Block_") and "_tile_" not in o.name]
HALF = S / 2 + 0.02     # tiles stand proud: the collision box includes them
CORN = [Vector((x, y, z)) for x in (-HALF, HALF) for y in (-HALF, HALF) for z in (-HALF, HALF)]
AX = [Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))]


def go(f): sc.frame_set(f); bpy.context.view_layer.update()


def obb(o):
    M = o.matrix_world
    R = M.to_3x3()
    return [M @ c for c in CORN], [R @ a for a in AX]


def hit(pa, aa, pb, ab, eps=0.003):
    axes = list(aa) + list(ab) + [x.cross(y).normalized() for x in aa for y in ab if x.cross(y).length > 1e-6]
    for a in axes:
        amin = min(a.dot(p) for p in pa); amax = max(a.dot(p) for p in pa)
        bmin = min(a.dot(p) for p in pb); bmax = max(a.dot(p) for p in pb)
        if amax < bmin + eps or bmax < amin + eps:
            return False
    return True


# 1. final lattice exact
go(F1)
err = 0.0; rot = 0.0
for p in pieces:
    err = max(err, (p.matrix_local.translation - Vector(p["home"])).length)
    rot = max(rot, math.degrees(p.matrix_local.to_quaternion().angle))
print(f"[qc] final position error {err:.6f} units, orientation error {rot:.4f} deg (both must be 0)")

# 2. no interpenetration at any sampled frame (the assembled state has a real
#    gap between cubies, so 0 hits there is the baseline)
pen = 0; ex = None
for f in range(F0, F1 + 1, 2):
    go(f)
    B = {p.name: obb(p) for p in pieces}
    for a, b in itertools.combinations(pieces, 2):
        if (a.matrix_world.translation - b.matrix_world.translation).length > 2.2:
            continue
        if hit(*B[a.name], *B[b.name]):
            pen += 1; ex = ex or (f, a.name, b.name)
print(f"[qc] interpenetrating pairs across the scrub: {pen}" + (f"  e.g. {ex}" if ex else ""))

# 3. every piece only ever gets CLOSER to home once it has started moving
back = 0
last = {p.name: None for p in pieces}
for f in range(F0, F1 + 1):
    go(f)
    for p in pieces:
        d = (p.matrix_local.translation - Vector(p["home"])).length
        if last[p.name] is not None and d > last[p.name] + 1e-4:
            back += 1
        last[p.name] = d
print(f"[qc] frames where a piece moved AWAY from home: {back} (must be 0)")

# 4. extents: how much of the frame the assembled cube fills
from bpy_extras.object_utils import world_to_camera_view
def extent(f):
    go(f); lo = Vector((9, 9, 0)); hi = Vector((-9, -9, 0))
    for p in pieces:
        for c in p.bound_box:
            v = world_to_camera_view(sc, sc.camera, p.matrix_world @ Vector(c))
            lo.x, lo.y, hi.x, hi.y = min(lo.x, v.x), min(lo.y, v.y), max(hi.x, v.x), max(hi.y, v.y)
    return lo, hi
lo, hi = extent(F0); print(f"[qc] exploded extent u {lo.x:.3f}..{hi.x:.3f} v {lo.y:.3f}..{hi.y:.3f}")
lo, hi = extent(F1); print(f"[qc] assembled extent u {lo.x:.3f}..{hi.x:.3f} v {lo.y:.3f}..{hi.y:.3f}  "
                           f"(cube = {(hi.x-lo.x)*100:.0f}% of frame width)")
