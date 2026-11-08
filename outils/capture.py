#!/usr/bin/env python3
"""capture.py : captures de la V2 à 393 px (Aujourd'hui, Moi > 3 onglets, Proches) dans outils/cap-*.png. Usage : capture.py [heure ISO]"""
import datetime, json, os, pathlib, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import test_socle as T
heure = sys.argv[1] if len(sys.argv) > 1 else "2026-11-02T13:00:00+01:00"
srv, url = T.serveur()
with sync_playwright() as p:
    b = p.chromium.launch()
    raw = pathlib.Path(os.environ["CARNET_SAVE"]).read_text(encoding="utf8") if os.environ.get("CARNET_SAVE") else T.sauvegarde_ancienne(b)
    ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
    pg = ctx.new_page(); pg.on("pageerror", lambda e: print("ERREUR", e))
    pg.clock.install(time=datetime.datetime.fromisoformat(heure))
    pg.add_init_script("if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('carnet-quetes'," + json.dumps(raw) + ")}")
    pg.goto(url); pg.wait_for_selector("html[data-prete]", timeout=8000); pg.wait_for_timeout(400)
    R = T.ROOT / "outils"
    pg.screenshot(path=str(R / "cap-aujourdhui.png"), full_page=True)
    pg.screenshot(path=str(R / "cap-aujourdhui-haut.png"))
    for nom in ("Moi", "Proches"):
        pg.locator(f".onglet:has-text('{nom}')").click(); pg.wait_for_timeout(250)
        if nom == "Moi":
            for sous in ("Ma vie", "Chez moi", "Bilan"):
                pg.get_by_role("tab", name=sous).click() if pg.get_by_role("tab", name=sous).count() else pg.get_by_role("button", name=sous).first.click()
                pg.wait_for_timeout(250); pg.screenshot(path=str(R / f"cap-moi-{sous.replace(' ', '').lower()}.png"), full_page=True)
        else: pg.screenshot(path=str(R / "cap-proches.png"), full_page=True)
    b.close()
