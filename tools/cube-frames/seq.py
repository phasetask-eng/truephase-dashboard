"""Export the scroll frame sequence: stabilised, cropped to the temporal union, baked onto --bg-page."""
import sys,os,glob,numpy as np
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
s,e,step,q,size,win,dest=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),int(sys.argv[6]),sys.argv[7]
BG=(239,239,237); PAD=26
idx=list(range(s,e+1,step))
def load(i):
    arr=np.array(Image.open(f'out/r_{i:04d}.png').convert('RGBA'))
    a=arr[...,3].astype(np.int32); a=np.clip((a-24)*255//(255-24),0,255); arr[...,3]=a.astype(np.uint8)
    return Image.fromarray(arr)
ims=[load(i) for i in idx]
cents=np.array([(lambda a:(np.where(a>48)[1].mean(),np.where(a>48)[0].mean()))(np.array(im)[...,3]) for im in ims])
if win>0:
    k=np.ones(win)/win; padc=np.pad(cents,((win//2,win-1-win//2),(0,0)),mode='edge')
    sm=np.stack([np.convolve(padc[:,0],k,'valid'),np.convolve(padc[:,1],k,'valid')],1)
    shifts=cents.mean(0)-sm
    ims=[im.transform(im.size,Image.AFFINE,(1,0,-sx,0,1,-sy),resample=Image.BILINEAR) for im,(sx,sy) in zip(ims,shifts)]
    print('stabilised, max shift',np.abs(shifts).max().round(1),'px')
x0=y0=10**9; x1=y1=-1
for im in ims:
    a=np.array(im)[...,3]; ys,xs=np.where(a>48)
    x0=min(x0,xs.min()); y0=min(y0,ys.min()); x1=max(x1,xs.max()); y1=max(y1,ys.max())
x0-=PAD;y0-=PAD;x1+=PAD;y1+=PAD
# square crop around the union, centred
cw,ch=x1-x0,y1-y0; side=max(cw,ch); cx,cy=(x0+x1)//2,(y0+y1)//2
box=(cx-side//2,cy-side//2,cx-side//2+side,cy-side//2+side)
print('union',x0,y0,x1,y1,'square',box,'->',size,'scale',round(size/side,3))
os.makedirs(dest,exist_ok=True); total=0
for n,im in enumerate(ims):
    big=Image.new('RGBA',im.size,(0,0,0,0)); big.paste(im,(0,0))
    c=big.crop(box).resize((size,size),Image.LANCZOS)
    bg=Image.new('RGBA',(size,size),BG+(255,)); bg.alpha_composite(c)
    p=f'{dest}/f-{n:03d}.webp'; bg.convert('RGB').save(p,quality=q,method=6); total+=os.path.getsize(p)
print('frames',len(ims),'total KB',total//1024,'avg KB',total//len(ims)//1024)
