"""probe.py "<js prépa>" "<js qui renvoie une valeur>" [heure]"""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import sys,datetime,json
from playwright.sync_api import sync_playwright
JS,EX=sys.argv[1],sys.argv[2];T=sys.argv[3] if len(sys.argv)>3 else "2026-10-26T13:00:00+01:00"
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
    r=pg.evaluate("()=>{"+EX+"}");print(r if isinstance(r,str) else json.dumps(r,ensure_ascii=False,indent=0))
