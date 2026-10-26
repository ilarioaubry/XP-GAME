"""shots.py <html> <dossier> : captures de tous les écrans dans plusieurs états."""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import sys,os,datetime
from playwright.sync_api import sync_playwright
H,D=sys.argv[1],sys.argv[2];os.makedirs(D,exist_ok=True)
CLOSE="document.querySelectorAll('.bpop,.plo,.epop,.mlpop,.wxsh,.sitsh,.qcsh,.ob,.qcw,.lootOv,#lootOv').forEach(e=>e.remove());document.documentElement.classList.remove('plopen')"
STATES=[("midi","2026-10-26T13:00:00+01:00",""),("matin","2026-10-26T07:30:00+01:00",""),("nuit","2026-10-26T23:30:00+01:00",""),("dec","2026-12-10T18:00:00+01:00","S.g.chests=0;S.g.bchests=0"),
 ("pluie","2026-10-28T15:00:00+01:00","S.g.wx={k:'1,1',n:'x'};S.g.wxc={cur:{ic:18,ph:'Pluie',tc:3,day:true,t:Date.now()},td:{d:'2026-10-28',ic:18,ph:'Pluie',max:9,min:3,p:80}};S.g.ambS=1")]
SCREENS=[("q","showView('q')"),("vie","showView('c');document.querySelector('[data-sub=vie][role=tab]').click()"),("wr","showView('c');document.querySelector('[data-sub=wr][role=tab]').click()"),
 ("bilan","showView('c');document.querySelector('[data-sub=bilan][role=tab]').click()"),("r","showView('r')"),("p","openProfile('Maman')"),
 ("plus","showView('q');document.querySelector('.plusb')&&document.querySelector('.plusb').click()"),
 ("assiette","showView('q');plateOpen('soir','diner')"),("meteo","showView('q');wxSheet()"),("situation","showView('q');sitSheet()"),("projet","showView('q');qcOpen('proj')")]
with sync_playwright() as p:
  for st,T,setup in STATES:
    b=p.chromium.launch();ctx=b.new_context(viewport={"width":393,"height":852},is_mobile=True,has_touch=True,timezone_id="Europe/Paris",reduced_motion="reduce");pg=ctx.new_page()
    errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    t=datetime.datetime.fromisoformat(T);pg.clock.install(time=t);pg.clock.pause_at(t)
    pg.add_init_script("Math.random=(()=>{let s=42;return()=>{s=(s*16807)%2147483647;return s/2147483647}})()")
    pg.goto("file://"+H);pg.wait_for_timeout(2000)
    pg.click(".obnext"); pg.fill(".obname","Ilario"); pg.click(".obnext"); pg.click(".obnext")
    pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
    pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
    pg.fill(".obadd input","Léa"); pg.press(".obadd input","Enter"); pg.fill(".obadd input","Tom"); pg.press(".obadd input","Enter")
    pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(1000)
    if setup: pg.evaluate("()=>{"+setup+";save();render();try{wxPaint()}catch(e){}}")
    for name,js in SCREENS:
        try:
            pg.evaluate("()=>{"+CLOSE+"}");pg.evaluate("()=>{"+js+"}");pg.wait_for_timeout(450)
            pg.evaluate("document.getAnimations().forEach(a=>{try{a.pause();a.currentTime=0}catch(e){}})")
            pg.screenshot(path=f"{D}/{st}_{name}.png",full_page=True)
        except Exception as e: errs.append(name+": "+str(e)[:80])
    print(st,"erreurs:",errs,flush=True);b.close()
