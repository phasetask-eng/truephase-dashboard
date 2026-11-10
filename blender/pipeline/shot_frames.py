import bpy, sys
A = sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else []
bpy.ops.wm.open_mainfile(filepath=A[0])
sc = bpy.context.scene
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
sc.render.film_transparent = True
for f in [int(x) for x in A[2:]]:
    sc.frame_set(f); sc.render.filepath = f"{A[1]}_{f}"
    bpy.ops.render.render(write_still=True)
