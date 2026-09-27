import numpy as np, os, glob
from PIL import Image
from scipy import ndimage as ndi
TOK={'white':(255,255,255),'yellow':(255,241,0),'mint':(209,255,202),
     'ash':(220,220,213),'smoke':(107,107,99),'slate':(74,74,68),'graphite':(28,28,26)}
MAP={'white':'white','yellow':'yellow','red':'mint','orange':'ash','green':'smoke','blue':'slate'}
BG=(239,239,237)
def hsv(rgb):
    mx=rgb.max(-1); mn=rgb.min(-1); d=np.maximum(mx-mn,1e-6)
    r,g,b=rgb[...,0],rgb[...,1],rgb[...,2]
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
    s=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)
    return h,s,mx
def classify(h,s,v):
    if s < 0.45+0.30*v: return 'white'
    if h<15 or h>=330: return 'red'
    if h<42: return 'orange'
    if h<75: return 'yellow'
    if h<175: return 'green'
    if h<290: return 'blue'
    return 'red'
def segment(rgba):
    a=rgba[...,3].astype(np.float32)/255; rgb=rgba[...,:3].astype(np.float32)/255
    h,s,v=hsv(rgb); lum=0.2126*rgb[...,0]+0.7152*rgb[...,1]+0.0722*rgb[...,2]
    obj=a>0.5
    vcl=ndi.grey_closing(v,size=25)
    body=(v<0.07)|((s<0.14)&(v<0.55))|(v<0.62*vcl)|((v<0.16)&(s<0.5))
    cand=obj&~body
    er=ndi.binary_erosion(cand,iterations=2)
    lab,n=ndi.label(er)
    if n==0: return dict(lab=np.zeros(obj.shape,np.int32),st=[],lum=lum,obj=obj)
    areas=ndi.sum(er,lab,range(1,n+1))
    minarea=max(100,0.0025*obj.sum()/9)
    keep=[i+1 for i,ar in enumerate(areas) if ar>=minarea]
    lab2=np.zeros_like(lab)
    for k,i in enumerate(keep): lab2[lab==i]=k+1
    d,(iy,ix)=ndi.distance_transform_edt(lab2==0,return_indices=True)
    grown=lab2[iy,ix]; grown[~cand|(d>3)]=0
    st=[]
    for k in range(1,len(keep)+1):
        m=grown==k; px=lum[m]; b=m&(lum>=np.percentile(px,40))
        cy,cx=ndi.center_of_mass(m)
        hh,ss,vv=float(np.median(h[b])),float(np.median(s[b])),float(np.median(v[b]))
        st.append(dict(k=k,cx=cx,cy=cy,area=int(m.sum()),h=hh,s=ss,v=vv,cls=classify(hh,ss,vv)))
    return dict(lab=grown,st=st,lum=lum,obj=obj)
def track(segs, maxdist=None):
    """assign track ids across frames by nearest centroid; returns list of dict k->tid per frame"""
    tracks=[]; nxt=0; prev={}; out=[]
    for i,sg in enumerate(segs):
        cur={}
        pts=[(s['cx'],s['cy'],s['k'],s['area']) for s in sg['st']]
        used=set()
        for cx,cy,k,ar in pts:
            r=(maxdist or 0.6*np.sqrt(ar))
            best=None;bd=r
            for tid,(px,py) in prev.items():
                if tid in used: continue
                d=np.hypot(px-cx,py-cy)
                if d<bd: bd=d;best=tid
            if best is None: best=nxt; nxt+=1
            used.add(best); cur[k]=best
        prev={cur[k]:(s['cx'],s['cy']) for s in sg['st'] for k in [s['k']]}
        out.append(cur)
    return out,nxt
def vote(segs,tids,ntr):
    hist={t:{} for t in range(ntr)}
    for sg,tm in zip(segs,tids):
        for s in sg['st']:
            t=tm[s['k']]; hist[t][s['cls']]=hist[t].get(s['cls'],0)+1
    return {t:max(h,key=h.get) for t,h in hist.items() if h}
def render(rgba,seg,cls_of_k,grain=0.008,seed=0,lift=0.7):
    rgb=rgba[...,:3].astype(np.float32)/255; lum=seg['lum']; grown=seg['lab']
    out=np.zeros_like(rgb)
    gph=np.array(TOK['graphite'],np.float32)/255
    bsh=np.clip((lum/0.09)**lift,0.55,3.0)
    out[:]=gph[None,None,:]*bsh[...,None]
    for s in seg['st']:
        m=grown==s['k']; px=lum[m]
        tgt=np.array(TOK[MAP[cls_of_k[s['k']]]],np.float32)/255
        ref=np.percentile(px,75)
        sh=np.clip((px/max(ref,1e-3))**lift,0.30,1.15)
        sh=np.where(sh>1,1+(sh-1)*0.3,sh)
        out[m]=tgt[None,:]*sh[:,None]
    out=np.clip(out,0,1)
    if grain>0:
        rng=np.random.default_rng(seed)
        out=np.clip(out+rng.normal(0,grain,out.shape[:2]).astype(np.float32)[...,None],0,1)
    return np.concatenate([(out*255).round().astype(np.uint8),rgba[...,3:4]],-1)
def composite(rgba,bg=BG):
    im=Image.new('RGBA',(rgba.shape[1],rgba.shape[0]),bg+(255,)); im.alpha_composite(Image.fromarray(rgba)); return im.convert('RGB')
