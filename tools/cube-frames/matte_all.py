import os, sys, subprocess, glob, time
from PIL import Image
from rembg import remove, new_session
S='/private/tmp/claude-501/-Users-aravindarundas-truephase-demo/5e5c39a3-ff52-4c33-980b-5c9de67898f4/scratchpad/vid'
FF='/Users/aravindarundas/Library/Python/3.13/lib/python/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
if not glob.glob(f'{S}/frames/f_0750.png'):
    subprocess.run([FF,'-v','error','-y','-i','/Users/aravindarundas/Downloads/m2-res_1080p.mp4','-start_number','0',f'{S}/frames/f_%04d.png'],check=True)
print('frames', len(glob.glob(f'{S}/frames/*.png')), flush=True)
sess=new_session('isnet-general-use')
files=sorted(glob.glob(f'{S}/frames/f_*.png'))
t0=time.time()
for i,f in enumerate(files):
    out=f'{S}/cut/'+os.path.basename(f)
    if os.path.exists(out): continue
    im=Image.open(f).convert('RGB')
    remove(im, session=sess).save(out)
    if i%50==0: print(i, round(time.time()-t0), 's', flush=True)
print('DONE', flush=True)
