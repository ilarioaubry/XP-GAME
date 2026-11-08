#!/usr/bin/env python3
"""test_brique4.py : Proches (liste, recherche, fiche, roulette) et Bilan (Semaine/Mois/Année), 393 px, sur une sauvegarde de l'ancienne version."""
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
        d0 = json.loads(raw)
        ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
        pg = ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
        pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-02T13:00:00+01:00"))
        pg.add_init_script("if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('carnet-quetes'," + json.dumps(raw) + ")}")
        pg.goto(url); pg.wait_for_selector("html[data-prete]", timeout=8000)
        save = lambda: (pg.evaluate("import('/src/core/state.js').then(s=>import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(s.etat())))"), pg.wait_for_timeout(150), json.loads(pg.evaluate("localStorage.getItem('carnet-quetes')")))[2]
        pg.get_by_role("tab", name="Proches").click(); pg.wait_for_timeout(300)
        n = len(d0["friends"]) + len(d0["family"])
        check("la liste montre tous les proches de la sauvegarde", pg.locator(".proche-carte").count() == n, pg.locator(".proche-carte").count())
        check("pas de roulette dans Proches", pg.locator("#e-proches").get_by_text("Roulette").count() == 0)
        # roulette (dans Aujourd'hui) : un tirage, jamais deux fois la même personne d'affilée
        pg.get_by_role("tab", name="Aujourd'hui").click(); pg.wait_for_timeout(200)
        pg.get_by_role("button", name="Tourner").click(); pg.wait_for_timeout(200)
        r2 = save()["g"]["roulette"]["n"]
        xp0 = save()["xp"]
        pg.get_by_role("button", name="Nouvelles").first.click(); pg.wait_for_timeout(200)
        d = save()
        check("« C'est fait » : lien, dernier contact, XP, journal", d["bonds"].get(r2, 0) > d0["bonds"].get(r2, 0) and d["bondsLast"][r2] and d["xp"] == xp0 + 10 and d["log"][-1].get("who") == r2, d["log"][-1])
        pg.screenshot(path=str(T.ROOT / "outils" / "proches-393.png"), full_page=True)
        # fiche + ajout + retrait avec Annuler
        avant_tom = save()["bonds"].get("Tom", 0)
        pg.get_by_role("tab", name="Proches").click(); pg.locator(".proche-carte", has_text="Tom").click(); pg.wait_for_selector(".fiche")
        pg.get_by_role("button", name="Vu en vrai").click(); pg.wait_for_timeout(200)
        d = save()
        check("Vu en vrai : +40 de lien, +30 XP", d["bonds"]["Tom"] == avant_tom + 40 and d["log"][-1]["xp"] == 30, d["bonds"].get("Tom"))
        pg.get_by_role("button", name="Modifier Tom").click(); pg.get_by_role("button", name="Retirer ce proche").click(); pg.get_by_role("button", name="Annuler").click(); pg.wait_for_timeout(200)
        d = save()
        check("Annuler rend le proche et son lien", "Tom" in d["friends"] and d["bonds"]["Tom"] == avant_tom + 40)
        pg.get_by_role("button", name="Ajouter un ami").click(); pg.fill("#champ-n", "Sam"); pg.get_by_role("button", name="Ajouter", exact=True).click(); pg.wait_for_timeout(200)
        check("nouveau proche écrit", "Sam" in save()["friends"])
        # Bilan
        pg.get_by_role("tab", name="Moi").click(); pg.get_by_role("tab", name="Bilan").click(); pg.wait_for_timeout(300)
        for per in ("Mois", "Année", "Semaine"):
            pg.get_by_role("tab", name=per).click(); pg.wait_for_timeout(150)
        txt = pg.inner_text(".bilan").lower()
        check("Bilan : humeur, sommeil, manger assez, points forts", all(t in txt for t in ("humeur moyenne", "sommeil moyen", "est-ce que je mange assez", "points forts")))
        pg.screenshot(path=str(T.ROOT / "outils" / "bilan-393.png"), full_page=True)
        d = save(); perdues = [k for k in d0["g"] if k not in d["g"]] + [k for k in d0 if k not in d]
        check("aucune clé perdue", not perdues, perdues)
        check("aucune erreur JavaScript", not errs, errs[:3])
        check("pas de défilement horizontal", pg.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        b.close()
    print("\n" + ("TOUT EST BON" if not fails else f"{len(fails)} échec(s) : {fails}"))
    sys.exit(1 if fails else 0)
main()
