#!/usr/bin/env python3
"""test_quetes.py : quêtes « pour toi » (selon la fiche S.g.sit et les artistes) et quêtes d'événement (S.g.ev + type), 393 px."""
import datetime, json, os, pathlib, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import test_socle as T
fails = []
def check(nom, ok, info=""):
    print(("OK     " if ok else "ÉCHEC  ") + nom + (f"  ({info})" if info and not ok else ""), flush=True)
    if not ok: fails.append(nom)

def main():
    srv, url = T.serveur()
    with sync_playwright() as p:
        b = p.chromium.launch()
        raw = pathlib.Path(os.environ["CARNET_SAVE"]).read_text(encoding="utf8") if os.environ.get("CARNET_SAVE") else T.sauvegarde_ancienne(b)
        d = json.loads(raw)
        d["g"]["sit"] = {"job": "cherche", "home": "seul", "goals": ["job", "forme"], "pass": ["creer", "rap"], "time": "30", "note": "finir mon EP"}
        d["g"]["taste"] = {"art": ["Nekfeu"]}
        d["g"]["ev"] = [{"id": "e1", "n": "Concert de Nekfeu", "d": "2026-11-05", "t": "concert", "a": "Nekfeu"}]
        d["g"]["evq"] = {}
        d["g"]["qNo"] = {}
        ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
        pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-02T10:00:00+01:00"))
        pg.add_init_script("if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('carnet-quetes'," + json.dumps(json.dumps(d)) + ")}")
        pg.goto(url); pg.wait_for_selector("html[data-prete]", timeout=8000); pg.wait_for_timeout(300)
        textes = pg.locator(".cq__nom").all_inner_texts()
        raisons = " ".join(pg.locator(".cq__why").all_inner_texts())
        check("3 quêtes du jour au plus (le compteur dit vrai)", len(textes) == 3 and pg.locator(".pt__droite").first.inner_text().endswith("/3"), textes)
        check("au moins une quête « pour toi » (avec sa raison)", len(raisons) > 0, raisons)
        check("aucun [crochet] ni {accolade} laissé dans les textes", not any("{" in t or "[" in t for t in textes + [raisons]), textes)
        ev = pg.locator(".cq", has_text="Concert")
        check("une quête d'événement apparaît (concert dans 3 jours)", ev.count() >= 1, pg.locator(".cq").all_inner_texts()[:5])
        if ev.count():
            ev.first.locator(".cq__fait").click(); pg.wait_for_timeout(200)
            s = (pg.evaluate("import('/src/core/state.js').then(s=>import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(s.etat())))"), pg.wait_for_timeout(150), json.loads(pg.evaluate("localStorage.getItem('carnet-quetes')")))[2]
            check("la quête d'événement est mémorisée (g.evq)", len(s["g"]["evq"].get("e1", [])) == 1, s["g"].get("evq"))
        check("aucune erreur JavaScript", not errs, errs[:3])
        b.close()
    print("\n" + ("TOUT EST BON" if not fails else f"{len(fails)} échec(s) : {fails}"))
    sys.exit(1 if fails else 0)
main()
