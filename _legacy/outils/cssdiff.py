"""cssdiff.py <html A> <html B> <js ouverture> <conteneur> : styles calculés qui diffèrent"""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import sys,datetime,json
exec(open(OUT+'shots.py').read().split("with sync_playwright")[0].replace("H,D=sys.argv[1],sys.argv[2];os.makedirs(D,exist_ok=True)",""))
from playwright.sync_api import sync_playwright
A,B,JS,C=sys.argv[1:5]
G="""(c)=>{const o=[];document.querySelectorAll(c+','+c+' *').forEach((e,i)=>{if(e.closest('svg')&&e.tagName.toLowerCase()!=='svg')return;const cs=getComputedStyle(e);const d={};for(let k=0;k<cs.length;k++){const p=cs[k];d[p]=cs.getPropertyValue(p)}o.push([e.tagName+'.'+[...e.classList].join('.'),d])});return o}"""
def get(h):
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={"width":393,"height":852},timezone_id="Europe/Paris");pg=ctx.new_page()
    t=datetime.datetime.fromisoformat("2026-10-26T13:00:00+01:00");pg.clock.install(time=t);pg.clock.pause_at(t)
    pg.goto("file://"+h);pg.wait_for_timeout(1500)
    pg.click(".obnext"); pg.fill(".obname","Ilario"); pg.click(".obnext"); pg.click(".obnext")
    pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
    pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
    pg.fill(".obadd input","Léa"); pg.press(".obadd input","Enter"); pg.fill(".obadd input","Tom"); pg.press(".obadd input","Enter")
    pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
    pg.evaluate("()=>{"+JS+"}");pg.wait_for_timeout(400);r=pg.evaluate(G,C);b.close();return r
a,b=get(A),get(B)
seen=set()
for (na,da),(nb,db) in zip(a,b):
    for k in da:
        if da[k]!=db.get(k) and (na,k) not in seen:seen.add((na,k));print(na,k,da[k],'->',db.get(k))
