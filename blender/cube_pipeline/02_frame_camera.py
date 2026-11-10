"""Fit the crop by projecting every block corner across the whole loop, so
nothing is clipped on any frame."""
import bpy, sys
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
A = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
BLEND, OUT, W, H, MARGIN = A[0], A[1], int(A[2]), int(A[3]), float(A[4])
TEST = A[5] if len(A) > 5 else ""
bpy.ops.wm.open_mainfile(filepath=BLEND)
sc = bpy.context.scene
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
cam = sc.camera
blocks = [o for o in bpy.data.objects if o.name.startswith("Block_")]
def extents(samples=20):
    lo_u = lo_v = 1e9; hi_u = hi_v = -1e9
    span = sc.frame_end - sc.frame_start
    for i in range(samples):
        sc.frame_set(sc.frame_start + round(i*span/samples)); bpy.context.view_layer.update()
        for ob in blocks:
            m = ob.matrix_world
            for c in ob.bound_box:
                p = world_to_camera_view(sc, cam, m @ Vector(c[:]))
                lo_u=min(lo_u,p.x); hi_u=max(hi_u,p.x); lo_v=min(lo_v,p.y); hi_v=max(hi_v,p.y)
    return lo_u, hi_u, lo_v, hi_v
for _ in range(8):
    lo_u, hi_u, lo_v, hi_v = extents()
    need = max((hi_u-lo_u)/(1-2*MARGIN), (hi_v-lo_v)/(1-2*MARGIN))
    if abs(need-1.0) < 0.004: break
    cam.location = cam.location * need
for _ in range(4):
    lo_u, hi_u, lo_v, hi_v = extents()
    du, dv = (lo_u+hi_u)/2 - 0.5, (lo_v+hi_v)/2 - 0.5
    if abs(du) < 0.003 and abs(dv) < 0.003: break
    R = cam.matrix_world.to_quaternion()
    cam.location = cam.location + R @ Vector((du, dv, 0.0)) * (cam.location.length*0.55)
lo_u, hi_u, lo_v, hi_v = extents(30)
print(f"[cam] u {lo_u:.3f}..{hi_u:.3f}  v {lo_v:.3f}..{hi_v:.3f}  dist {cam.location.length:.2f}")
print(f"[cam] clipped={'YES' if (lo_u<0 or hi_u>1 or lo_v<0 or hi_v>1) else 'no'}")
bpy.ops.wm.save_as_mainfile(filepath=OUT)
if TEST:
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.film_transparent = True
    sc.frame_set(sc.frame_start + 40)
    sc.render.filepath = TEST
    bpy.ops.render.render(write_still=True)
