import bpy, sys
A = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
BLEND, OUTDIR, N = A[0], A[1], int(A[2])
bpy.ops.wm.open_mainfile(filepath=BLEND)
sc = bpy.context.scene
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
sc.render.image_settings.compression = 15
sc.render.film_transparent = True
span = sc.frame_end - sc.frame_start
for i in range(N):
    t = sc.frame_start + i * span / N
    sc.frame_set(int(t), subframe=t - int(t))
    sc.render.filepath = f"{OUTDIR}/f_{i:04d}"
    bpy.ops.render.render(write_still=True)
print(f"[seq] {N} frames across {span} source frames")
