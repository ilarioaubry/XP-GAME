import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')
import sys,datetime,json,collections
exec(open(OUT+'shots.py').read().split("with sync_playwright")[0].replace("H,D=sys.argv[1],sys.argv[2];os.makedirs(D,exist_ok=True)",""))
from playwright.sync_api import sync_playwright
A=r"""()=>{const R={fs:{},rad:{},bord:{},btn:{},ico:{},mots:[],emoji:[],bars:{},titles:{}};
const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
const nm=e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+'.'+[...e.classList].slice(0,2).join('.');
const add=(o,k,v)=>{o[k]=o[k]||[];if(o[k].length<4&&!o[k].includes(v))o[k].push(v)};
document.querySelectorAll('body *').forEach(e=>{if(e.closest('svg')&&e.tagName.toLowerCase()!=='svg')return;if(!vis(e))return;const c=getComputedStyle(e);
 const txt=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
 if(txt&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)){const f=parseFloat(c.fontSize);if(f<22&&![11,13,15,20].includes(f))add(R.fs,f+'px',nm(e))}
 const rr=c.borderTopLeftRadius;if(rr!=='0px'&&rr!=='50%'&&!(parseFloat(rr)>=e.offsetWidth/2-1))add(R.rad,rr,nm(e));
 if(parseFloat(c.borderTopWidth)>0&&c.borderTopStyle!=='none'){const col=c.borderTopColor;const neutral=/rgba\(255, 255, 255, 0\.1[0-9]*\)|rgba\(0, 0, 0|255, 247, 230/.test(col)||col==='rgb(255, 217, 74)'||/0\.17\)|0\.14\)|0\.28\)|0\.2\)|0\.25\)/.test(col);
   const act=e.matches('[aria-pressed=true],[aria-selected=true],.on,.sel,.active,:focus');if(!neutral&&!act)add(R.bord,col,nm(e))}
 if(e.matches('button,[role=button]')&&!e.closest('.plate')){const h=Math.round(e.getBoundingClientRect().height);if(h<44&&h>0)add(R.btn,h+'px',nm(e)+' «'+e.textContent.trim().slice(0,12)+'»')}
 if(e.tagName.toLowerCase()==='svg'&&(e.classList.contains('ic')||e.classList.contains('pxic'))){const w=Math.round(e.getBoundingClientRect().width);if(w!==24&&!e.closest('.rst,.plr,.pldx'))add(R.ico,w+'px',nm(e.parentElement))}
 if(txt){const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ');if(/\b(boss|skill|monstre)/i.test(t))R.mots.push(t.trim().slice(0,40));if(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t))R.emoji.push(t.trim().slice(0,30))}
});return R}"""
tot={}
with sync_playwright() as p:
  b=p.chromium.launch();ctx=b.new_context(viewport={"width":393,"height":2600},timezone_id="Europe/Paris");pg=ctx.new_page()
  t=datetime.datetime.fromisoformat("2026-10-26T13:00:00+01:00");pg.clock.install(time=t);pg.clock.pause_at(t)
  pg.goto("file://"+APP);pg.wait_for_timeout(1500)
  pg.click(".obnext"); pg.fill(".obname","Ilario"); pg.click(".obnext"); pg.click(".obnext")
  pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
  pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
  pg.fill(".obadd input","Léa"); pg.press(".obadd input","Enter"); pg.fill(".obadd input","Tom"); pg.press(".obadd input","Enter")
  pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
  for name,js in SCREENS:
    pg.evaluate("()=>{"+CLOSE+"}");pg.evaluate("()=>{"+js+"}");pg.wait_for_timeout(350)
    r=pg.evaluate(A)
    for k,v in r.items():
      if isinstance(v,list):tot.setdefault(k,set()).update(v)
      else:
        d=tot.setdefault(k,{})
        for kk,vv in v.items():d.setdefault(kk,set()).update(f"{name}:{x}" for x in vv)
for k,v in tot.items():
  print("=====",k)
  if isinstance(v,set):print("  ",list(v)[:8]);continue
  for kk,vv in sorted(v.items(),key=lambda x:-len(x[1])):print("  ",kk,len(vv),sorted(vv)[:5])
