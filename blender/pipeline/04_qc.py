"""QC for the Dayos mechanics: seam, collisions, ring integrity, smoothness,
twist discipline, and that every layer keeps one material."""
import bpy, sys, math, itertools
from mathutils import Vector
A = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
bpy.ops.wm.open_mainfile(filepath=A[0])
sc = bpy.context.scene
blocks = [o for o in bpy.data.objects if o.name.startswith("Block_")]
F0, F1 = sc.frame_start, sc.frame_end
P, NR, LOOP = sc["DAYOS_P"], sc["DAYOS_RINGS"], sc["DAYOS_LOOP"]
STACK = COLS = 6
SPC, H, R_APEX, R_IN = sc["ROW_SPACING"], sc["BLOCK_H"], sc["R_APEX"], sc["R_IN"]
HOME_R = blocks[0]["home_r"]; R_SH, HALF = 1.02, math.radians(30.0)
CX = (R_IN * math.cos(HALF) + R_APEX) / 2.0
root = bpy.data.objects["ROOT_TOWER"]


def row_z(r): return r * SPC - (STACK - 1) * SPC / 2


PLAN = [(R_IN * math.cos(-HALF), R_IN * math.sin(-HALF)), (R_SH * math.cos(-HALF), R_SH * math.sin(-HALF)),
        (R_APEX, 0.0), (R_SH * math.cos(HALF), R_SH * math.sin(HALF)), (R_IN * math.cos(HALF), R_IN * math.sin(HALF))]
LOC = [Vector((x - CX, y, z)) for z in (-H / 2, H / 2) for x, y in PLAN]
LN = [Vector((0, 0, 1)), Vector((0, 0, -1))]; LE = [Vector((0, 0, 1))]
for i in range(5):
    x1, y1 = PLAN[i]; x2, y2 = PLAN[(i + 1) % 5]
    e = Vector((x2 - x1, y2 - y1, 0.0)); LE.append(e.normalized()); LN.append(Vector((e.y, -e.x, 0.0)).normalized())


def parts(o):
    M = o.matrix_world; R = M.to_3x3(); return [M @ v for v in LOC], [R @ n for n in LN], [R @ e for e in LE]


def hit(pa, na, ea, pb, nb, eb, eps=0.004):
    ax = list(na) + list(nb)
    for x in ea:
        for y in eb:
            c = x.cross(y)
            if c.length > 1e-6: ax.append(c.normalized())
    for a in ax:
        amin = min(a.dot(p) for p in pa); amax = max(a.dot(p) for p in pa)
        bmin = min(a.dot(p) for p in pb); bmax = max(a.dot(p) for p in pb)
        if amax < bmin + eps or bmax < amin + eps: return False
    return True


def go(f): sc.frame_set(f); bpy.context.view_layer.update()
def poses(): return {o.name: (o.matrix_world.translation.copy(), o.matrix_world.to_quaternion()) for o in blocks}


go(F0); a = poses(); go(F1); b = poses()
print(f"[qc] loop seam {max((a[k][0]-b[k][0]).length for k in a):.6f} units / "
      f"{math.degrees(max(abs(a[k][1].rotation_difference(b[k][1]).angle) for k in a)):.4f} deg")

keyed_mat = any(o.animation_data and o.animation_data.action and
                any("material" in fc.data_path for lay in o.animation_data.action.layers
                    for st in lay.strips for bag in st.channelbags for fc in bag.fcurves)
                for o in blocks if o.animation_data)
print(f"[qc] any material channel animated: {keyed_mat}  (must be False)")

# every ring moves as ONE unit: identical local z, radius and tip on all six
rings = {}
for o in blocks:
    rings.setdefault(o["ring"], []).append(o)
worst_z = worst_r = worst_tip = 0.0
for f in range(F0, F1, 2):
    go(f)
    for r, ob in rings.items():
        zs = [o.matrix_local.translation.z for o in ob]
        rs = [math.hypot(o.matrix_local.translation.x, o.matrix_local.translation.y) for o in ob]
        ts = [o.rotation_euler.y for o in ob]
        worst_z = max(worst_z, max(zs) - min(zs)); worst_r = max(worst_r, max(rs) - min(rs))
        worst_tip = max(worst_tip, max(ts) - min(ts))
print(f"[qc] ring integrity: z spread {worst_z:.7f}  radius spread {worst_r:.7f}  "
      f"tip spread {math.degrees(worst_tip):.5f} deg  (all must be ~0)")

# smoothness: largest centre move per frame, and largest change of that (jerk)
maxv = maxa = 0.0; pv = {}; pp = {}
for f in range(F0, F1 + 1):
    go(f)
    for o in blocks:
        p = o.matrix_world.translation.copy()
        if o.name in pp:
            v = (p - pp[o.name]).length
            maxv = max(maxv, v)
            if o.name in pv: maxa = max(maxa, abs(v - pv[o.name]))
            pv[o.name] = v
        pp[o.name] = p
print(f"[qc] max speed {maxv:.4f} u/frame, max speed change {maxa:.4f} u/frame^2")

# a settled stack: each occupied slot holds exactly one material, no twist
# when anything is between slots
bad_rows = 0; off = 0.0
for f in range(F0, F1, 3):
    go(f)
    rows = {}
    moving = False
    for o in blocks:
        lp = o.matrix_local.translation
        r = math.hypot(lp.x, lp.y)
        if abs(r - HOME_R) > 1e-3: continue          # in flight
        s = (lp.z + (STACK - 1) * SPC / 2) / SPC
        if abs(s - round(s)) > 1e-3: moving = True
        rows.setdefault(round(s), set()).add(o.material_slots[0].material.name)
    for s, mats in rows.items():
        if len(mats) != 1: bad_rows += 1
    if moving:
        for o in blocks:
            lp = o.matrix_local.translation
            if abs(math.hypot(lp.x, lp.y) - HOME_R) > 1e-3: continue
            ang = math.atan2(lp.y, lp.x) % (math.tau / COLS)
            off = max(off, min(ang, math.tau / COLS - ang))
print(f"[qc] slots holding >1 material: {bad_rows} (must be 0);  twist while a drop is "
      f"under way: {math.degrees(off):.4f} deg (must be 0)")

pen = 0; ex = None
for f in range(F0, F1, 2):
    go(f); PP = {o.name: parts(o) for o in blocks}
    for x, y in itertools.combinations(blocks, 2):
        if (x.matrix_world.translation - y.matrix_world.translation).length > 2.4: continue
        pa, na, ea = PP[x.name]; pb, nb, eb = PP[y.name]
        if hit(pa, na, ea, pb, nb, eb): pen += 1; ex = ex or (f, x.name, y.name)
print(f"[qc] interpenetrating pairs (every 2nd frame): {pen}" + (f"  e.g. {ex}" if ex else ""))

# the lean is measured, not assumed
go(F0); q0 = root.matrix_world.to_quaternion()
mx = 0.0
for f in range(F0, F1, 3):
    go(f); mx = max(mx, math.degrees(root.matrix_world.to_quaternion().rotation_difference(q0).angle))
go(F1)
print(f"[qc] root sway peak {mx:.2f} deg from the loop start; returns to "
      f"{math.degrees(root.matrix_world.to_quaternion().rotation_difference(q0).angle):.4f} deg at F1")
