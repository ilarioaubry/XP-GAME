"""who.py "<js préparation>" "<sélecteur élément>" prop1,prop2 : règles CSS qui posent ces propriétés sur l'élément (dans l'ordre de cascade)."""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import sys,datetime
from playwright.sync_api import sync_playwright
JS,SEL,PROPS=sys.argv[1],sys.argv[2],sys.argv[3].split(',');T=sys.argv[4] if len(sys.argv)>4 else "2026-10-26T07:30:00+01:00"
Q="""([sel,props])=>{const e=document.querySelector(sel);if(!e)return'introuvable';const out=[];
for(const sh of document.styleSheets){const id=(sh.ownerNode&&sh.ownerNode.id)||'?';const walk=(rules,m)=>{for(const r of rules){if(r.cssRules&&!r.selectorText){walk(r.cssRules,(r.conditionText||'')+' ');continue}
 if(!r.selectorText)continue;let ok=false;try{ok=e.matches(r.selectorText)}catch(x){}if(!ok)continue;for(const p of props){const v=r.style.getPropertyValue(p);if(v)out.push(id+' | '+m+p+': '+v+(r.style.getPropertyPriority(p)?' !':'')+' | '+r.selectorText.slice(0,140))}}};try{walk(sh.cssRules,'')}catch(x){}}
const cs=getComputedStyle(e);out.push('== calculé: '+props.map(p=>p+'='+cs.getPropertyValue(p)).join(' ; '));return out.join('\\n')}"""
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={"width":393,"height":852},timezone_id="Europe/Paris");pg=ctx.new_page()
    t=datetime.datetime.fromisoformat(T);pg.clock.install(time=t);pg.clock.pause_at(t)
    pg.goto("file://"+APP);pg.wait_for_timeout(1500)
    pg.click(".obnext"); pg.fill(".obname","Ilario"); pg.click(".obnext"); pg.click(".obnext")
    pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
    pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
    pg.fill(".obadd input","Léa"); pg.press(".obadd input","Enter"); pg.fill(".obadd input","Tom"); pg.press(".obadd input","Enter")
    pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
    pg.evaluate("()=>{"+JS+"}");pg.wait_for_timeout(400)
    print(pg.evaluate(Q,[SEL,PROPS]))
