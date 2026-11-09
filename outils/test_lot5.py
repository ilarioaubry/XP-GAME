#!/usr/bin/env python3
"""test_lot5.py : ce qui revient de l'ancienne version (lot du 09/11) à 393 px : ciel selon l'heure, coffre à ouvrir,
panneau « + », maison en coupe et ses pièces, objets de l'armoire dessinés, animations de fin d'action, sans erreur."""
import datetime, json, os, pathlib, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import test_socle as T
fails = []
def check(nom, ok, info=""):
    print(("OK     " if ok else "ÉCHEC  ") + nom + (f"  ({info})" if info and not ok else ""), flush=True)
    if not ok: fails.append(nom)

def ouvrir(b, raw, heure, motion="reduce"):
    ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion=motion)
    pg = ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    pg.clock.install(time=datetime.datetime.fromisoformat(heure))
    pg.add_init_script("if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('carnet-quetes'," + json.dumps(raw) + ")}")
    pg.goto(T_url); pg.wait_for_selector("html[data-prete]", timeout=8000); pg.wait_for_timeout(300)
    return ctx, pg, errs

def sauve(pg):
    pg.evaluate("import('/src/core/state.js').then(s=>import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(s.etat())))"); pg.wait_for_timeout(150)
    return json.loads(pg.evaluate("localStorage.getItem('carnet-quetes')"))

def main():
    global T_url
    srv, T_url = T.serveur()
    with sync_playwright() as p:
        b = p.chromium.launch()
        raw = pathlib.Path(os.environ["CARNET_SAVE"]).read_text(encoding="utf8") if os.environ.get("CARNET_SAVE") else T.sauvegarde_ancienne(b)
        d = json.loads(raw); d["g"]["chests"] = 2; d["g"]["wake"] = 8; raw = json.dumps(d)

        # ciel : nuit à 23 h (lune, étoiles), jour à 10 h (soleil, nuages) ; le haut suit le ciel
        ctx, pg, errs = ouvrir(b, raw, "2026-11-02T23:00:00+01:00")
        check("23 h : ciel de nuit, lune et étoiles", pg.locator("#e-aujourdhui .hero[data-moment=nuit] .ciel__astre--lune").count() == 1 and pg.locator("#e-aujourdhui .ciel__etoiles i").count() > 10)
        check("23 h : la question du moment est le bilan du soir (pas la routine du matin)", "Bilan du soir" in pg.inner_text(".question"))
        ctx.close()
        ctx, pg, errs = ouvrir(b, raw, "2026-11-02T10:00:00+01:00", "no-preference")
        check("10 h : ciel de jour, soleil et nuages", pg.locator("#e-aujourdhui .hero[data-moment=matin] .ciel__astre").count() == 1 and pg.locator("#e-aujourdhui .ciel__nuage").count() == 2)

        # coffre : on le touche 3 fois, il s'ouvre, l'objet va dans l'armoire
        g0 = len(sauve(pg)["g"].get("gear", []))
        pg.locator(".coffre__icone--pret").click(); pg.wait_for_selector(".coffre-vue")
        check("coffre : le résultat est caché avant d'ouvrir", pg.locator(".coffre-vue__resultat").is_hidden())
        for _ in range(3): pg.locator(".coffre-vue__coffre").click(); pg.wait_for_timeout(120)
        pg.wait_for_selector(".coffre-vue__resultat:not([hidden])", timeout=3000)
        s = sauve(pg)
        check("coffre ouvert : un coffre de moins, un objet ou un titre de plus", s["g"]["chests"] == 1 and (len(s["g"].get("gear", [])) == g0 + 1 or len(s["g"].get("rt", [])) > len(d["g"].get("rt", []))), (s["g"]["chests"], len(s["g"].get("gear", []))))
        pg.get_by_role("button", name="Super !").click(); pg.wait_for_timeout(150)
        check("coffre refermé", pg.locator(".coffre-vue").count() == 0)

        # panneau « + » : Maison > Ranger · Chambre > 30 min > Fait ; animation de fin d'action (+XP, carrés)
        pg.get_by_role("button", name="Noter une action").click(); pg.wait_for_selector(".actions")
        pg.locator(".domaine", has_text="Maison").click(); pg.locator(".act", has_text="Chambre").first.click()
        pg.locator(".duree", has_text="30 min").click()
        check("« Fait · +12 XP » pour 30 min", "+12 XP" in pg.inner_text(".plein__bas .bouton--principal"))
        pg.locator(".plein__bas .bouton--principal").click(); pg.wait_for_timeout(160)
        check("animation de fin d'action : +XP qui monte et carrés vers la barre", pg.locator(".fx-texte").count() == 1 and pg.locator(".fx-carre").count() > 0)
        s = sauve(pg)
        check("action notée dans le journal (clé de l'ancienne version)", any(l.get("a") == "af:ranger:Chambre" and l.get("xp") == 12 for l in s["log"]))
        check("journal du jour : l'action apparaît", "Ranger · Chambre" in pg.inner_text(".journal"))

        # Moi > Chez moi : la maison en coupe, une pièce s'ouvre, les objets de l'armoire sont dessinés
        pg.locator(".onglet", has_text="Moi").click(); pg.get_by_role("tab", name="Chez moi").click(); pg.wait_for_timeout(250)
        check("maison : 7 pièces touchables sur la coupe", pg.locator(".hmslot").count() == 7)
        pg.locator(".hmslot[data-r=chambre]").click(); pg.wait_for_timeout(150)
        check("la chambre s'ouvre (scène pixel)", pg.locator(".hmscene .hmsvg").count() == 1)
        pg.locator(".hmnext").click(); pg.wait_for_timeout(150)
        check("pièce suivante : la bibliothèque", "BIBLIOTH" in pg.inner_text(".hmh2").upper())
        check("armoire : objets dessinés (pas d'étoile de remplacement)", pg.locator(".tuile__apercu svg rect").count() > 20)
        check("pas de défilement horizontal", pg.evaluate("document.documentElement.scrollWidth") <= 393)
        check("aucune erreur JavaScript", not errs, errs[:3])
        ctx.close(); b.close()
    print("\n" + ("TOUT EST BON" if not fails else f"{len(fails)} échec(s)"))
    sys.exit(1 if fails else 0)

main()
