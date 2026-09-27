import sys,glob,os,json,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); os.chdir(os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from recolor3 import *
mode=sys.argv[1]
if mode=='analyze':
    files=sorted(glob.glob('cut/f_*.png')); rows=[]
    for f in files:
        a=np.array(Image.open(f).convert('RGBA'))[...,3]
        m=a>128; ys,xs=np.where(m)
        if len(xs)==0: rows.append(None); continue
        # residue: mask pixels far from the main blob -> count components
        lab,n=__import__('scipy.ndimage',fromlist=['label']).label(m)
        sizes=sorted((lab==i).sum() for i in range(1,n+1))
        rows.append(dict(x0=int(xs.min()),x1=int(xs.max()),y0=int(ys.min()),y1=int(ys.max()),area=int(m.sum()),ncomp=n,second=int(sizes[-2]) if n>1 else 0))
    json.dump(rows,open('analysis.json','w'))
    for i,r in enumerate(rows):
        if i%15==0 and r: print(i, 'bbox',r['x0'],r['y0'],r['x1'],r['y1'],'w',r['x1']-r['x0'],'h',r['y1']-r['y0'],'area',r['area'],'comps',r['ncomp'],'2nd',r['second'])
elif mode=='loop':
    # find best loop pair (i,j) within [s,e], j-i>=minlen, by alpha-mask IoU + rgb diff of matted cube
    s,e,minlen=int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4])
    thumbs=[]
    for i in range(s,e+1):
        im=Image.open(f'cut/f_{i:04d}.png').convert('RGBA').resize((240,135),Image.BILINEAR)
        thumbs.append(np.array(im).astype(np.float32)/255)
    T=np.stack(thumbs); best=[]
    for i in range(0,len(T)-minlen):
        d=np.abs(T[i+minlen:]-T[i]).mean(axis=(1,2,3))
        j=int(d.argmin()); best.append((float(d[j]),s+i,s+i+minlen+j))
    best.sort(); print('best loop pairs (diff, start, end):'); [print(b) for b in best[:8]]
elif mode=='render':
    s,e=int(sys.argv[2]),int(sys.argv[3]); step=int(sys.argv[4]) if len(sys.argv)>4 else 1
    idx=list(range(s,e+1,step)); segs=[]
    for i in idx:
        segs.append(segment(np.array(Image.open(f'cut/f_{i:04d}.png').convert('RGBA'))))
    tids,ntr=track(segs); voted=vote(segs,tids,ntr)
    os.makedirs('out',exist_ok=True)
    for n,(i,seg) in enumerate(zip(idx,segs)):
        rgba=np.array(Image.open(f'cut/f_{i:04d}.png').convert('RGBA'))
        cls={st['k']:voted[tids[n][st['k']]] for st in seg['st']}
        Image.fromarray(render(rgba,seg,cls,seed=i,lift=0.6)).save(f'out/r_{i:04d}.png')
        if n%20==0: print('rendered',n,'/',len(idx),flush=True)
    print('DONE')
