#!/usr/bin/env python3
"""test_brique3.py : Moi (Ma vie, Chez moi) sur une sauvegarde de l'ancienne version, à 393 px."""
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
        pg.get_by_role("tab", name="Moi").click(); pg.wait_for_timeout(300)
        check("Ma vie : profil, 4 paliers", pg.locator(".hero__nom").count() == 1 and pg.locator(".cangle").count() == 4)
        check("routines réglables dans Ma vie", "Routine du matin" in pg.inner_text(".ma-vie"))
        check("projet de la sauvegarde visible", "Album" in pg.inner_text(".ma-vie"))
        pg.screenshot(path=str(T.ROOT / "outils" / "ma-vie-393.png"), full_page=True)
        save = lambda: (pg.evaluate("import('/src/core/state.js').then(s=>import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(s.etat())))"), pg.wait_for_timeout(150), json.loads(pg.evaluate("localStorage.getItem('carnet-quetes')")))[2]
        pg.get_by_role("button", name="Modifier mon personnage").click(); pg.wait_for_selector(".perso")
        pg.get_by_role("tab", name="Cheveux").click(); pg.locator(".perso__opt", has_text="Court").first.click(); pg.wait_for_timeout(150)
        pg.get_by_role("button", name="Retour").click(); pg.wait_for_timeout(150)
        # ajouter un événement, une dernière fois, une étape
        pg.get_by_role("tab", name="Bilan").click(); pg.wait_for_timeout(150)
        pg.get_by_role("button", name="Ajouter un événement").click(); pg.fill("#champ-n", "Dentiste"); pg.fill("#champ-d", "2026-11-20"); pg.get_by_role("button", name="Ajouter", exact=True).click()
        pg.get_by_role("tab", name="Ma vie").click(); pg.wait_for_timeout(150)
        pg.get_by_role("button", name="Suivre une chose").click(); pg.fill("#champ-n", "J'ai appelé Mamie"); pg.get_by_role("button", name="Ajouter", exact=True).click()
        pg.get_by_role("button", name="Ajouter une étape").first.click(); pg.fill("#champ-t", "Mixage"); pg.get_by_role("button", name="Ajouter", exact=True).click()
        pg.get_by_role("button", name="Mixage").click(); pg.wait_for_timeout(150)
        d = save()
        check("événement, dernière fois, étape écrits", any(e["n"] == "Dentiste" for e in d["g"]["ev"]) and any(x.get("name") == "J'ai appelé Mamie" and x.get("u") == "m" for x in d["g"]["last"]) and d["g"]["prj"][0]["st"][-1].get("t") == "Mixage" and d["g"]["prj"][0]["st"][-1].get("d"), d["g"].get("last"))
        check("personnage : coupe écrite (avc.hair)", "hair" in (d["g"].get("avc") or {}))
        check("ancien événement conservé", any(e["n"] == "Concert" for e in d["g"]["ev"]))
        # suppression avec Annuler
        pg.get_by_role("button", name="Supprimer").first.click(); pg.get_by_role("button", name="Annuler").click(); pg.wait_for_timeout(150)
        check("Annuler rend l'événement", len(save()["g"]["ev"]) == len(d["g"]["ev"]))
        # Chez moi
        pg.get_by_role("tab", name="Chez moi").click(); pg.wait_for_timeout(200)
        check("coiffes obtenues visibles (béret, casque)", pg.locator(".ui-tuile", has_text="Casque audio").count() == 1)
        pg.locator(".ui-tuile", has_text="Casque audio").click(); pg.wait_for_timeout(150)
        check("équiper écrit eq.tete", save()["g"]["eq"]["tete"] == "phones", save()["g"].get("eq"))
        pg.locator(".plaque", has_text="Novice").first.click(); pg.wait_for_timeout(150)
        check("titre porté (S.g.titre)", save()["g"].get("titre") == "Novice")
        pg.screenshot(path=str(T.ROOT / "outils" / "chez-moi-393.png"), full_page=True)
        pg.get_by_role("tab", name="Bilan").click(); pg.wait_for_timeout(150)
        d = save()
        perdues = [k for k in d0["g"] if k not in d["g"]] + [k for k in d0 if k not in d]
        check("aucune clé de la sauvegarde d'origine perdue", not perdues, perdues)
        check("aucune erreur JavaScript", not errs, errs[:3])
        check("pas de défilement horizontal", pg.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        b.close()
    print("\n" + ("TOUT EST BON" if not fails else f"{len(fails)} échec(s) : {fails}"))
    sys.exit(1 if fails else 0)
main()
