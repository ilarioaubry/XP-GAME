#!/usr/bin/env python3
"""test_brique2.py : Aujourd'hui (V2) sur une sauvegarde de l'ancienne version, à 393 px.
Vérifie : aucun plantage · pas de défilement horizontal · repas, quête, habitude, routine, bonne nuit écrivent dans la sauvegarde ·
coffre à 5 crans · l'assiette se construit · rien n'est supprimé de la sauvegarde d'origine."""
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
        pg.on("console", lambda m: errs.append("console: " + m.text[:200]) if m.type == "error" and "fonts.g" not in m.text and "ERR_" not in m.text and "403" not in m.text else None)
        pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-02T13:00:00+01:00"))
        pg.add_init_script("if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('carnet-quetes'," + json.dumps(raw) + ")}")
        pg.goto(url); pg.wait_for_selector("html[data-prete]", timeout=8000); pg.wait_for_timeout(400)
        pg.screenshot(path=str(T.ROOT / "outils" / "aujourdhui-393.png"), full_page=True)
        check("l'écran Aujourd'hui s'affiche", pg.locator(".scene").count() == 1 and pg.locator(".coffre__crans i").count() == 5)
        check("pas de défilement horizontal", pg.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        check("4 Angles", pg.locator("#e-aujourdhui .angle").count() == 4)
        save = lambda: (pg.evaluate("import('/src/core/state.js').then(s=>import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(s.etat())))"), pg.wait_for_timeout(150), json.loads(pg.evaluate("localStorage.getItem('carnet-quetes')")))[2]

        # repas : goûter (hors assiette) puis assiette du déjeuner
        pg.get_by_role("button", name="Goûter").click(); pg.wait_for_timeout(150)
        pg.get_by_role("button", name="Mon assiette").click(); pg.wait_for_selector(".assiette")
        for nom in ("Riz", "Poulet", "Salade"):
            pg.locator(".assiette__puce", has_text=nom).first.click()
        check("pastille d'assiette complète", "Bien rempli" in pg.inner_text(".assiette__pastille"))
        pg.get_by_role("button", name="Valider le repas").click(); pg.wait_for_timeout(200)
        d = save()
        j = "2026-11-02"
        check("repas écrits (mb, mbd, plt)", f"{j}:soir" in d["g"]["mb"] and f"{j}:matin" in d["g"]["mb"] and d["g"]["plt"][j]["dej"]["f"] == ["riz"], list(d["g"]["plt"].get(j, {}).items())[:2])
        check("coffre : 2 crans après 2 repas", d["g"]["coffre"]["n"] == 2, d["g"].get("coffre"))
        check("XP augmentée", d["xp"] > d0["xp"])
        check("l'ancienne donnée de l'assiette d'hier est intacte", d["g"]["plt"]["2026-11-01"] == d0["g"]["plt"]["2026-11-01"])

        # routine du matin : tout faire
        pg.get_by_role("button", name="Routine du matin").click(); pg.wait_for_selector(".routine")
        n = pg.evaluate("document.querySelector('.routine__compte').textContent")
        total = int(n.split("sur")[1].split()[0])
        for _ in range(total):
            pg.locator(".routine__actions .bouton--principal").click(); pg.wait_for_timeout(80)
        pg.wait_for_selector(".plein", state="detached")
        d = save()
        check("routine écrite (rh, rtb) + cran", j in d["g"]["rh"] and "matin" in d["g"]["rtb"] and d["g"]["coffre"]["n"] == 3, d["g"].get("coffre"))

        # quête spéciale + habitudes + bonne nuit
        pg.locator(".quete").nth(3).get_by_role("button", name="Fait").click(); pg.wait_for_timeout(120)
        pg.locator(".habitudes .bouton").first.click(); pg.wait_for_timeout(120)
        pg.get_by_role("button", name="Bien").click(); pg.wait_for_timeout(120)
        pg.fill("#h-coucher", "23:30"); pg.fill("#h-lever", "07:30")
        pg.fill(".champ__texte", "Bonne journée"); pg.get_by_role("button", name="Noter ma journée").click(); pg.wait_for_timeout(200)
        d = save()
        check("humeur, sommeil, mot du soir", d["g"]["mood"][j] == 4 and d["g"]["sleep"][j] == {"bed": 23.5, "wake": 7.5, "h": 8.0} and d["g"]["jr"][j] == "Bonne journée", d["g"]["sleep"].get(j))
        check("coffre à 4 crans (repas ×2, routine, quête spéciale)", d["g"]["coffre"]["n"] == 4, d["g"]["coffre"])
        # 5e cran : dîner sauté ne compte pas, dîner noté oui
        pg.get_by_role("button", name="Dîner").first.click(); pg.wait_for_selector(".assiette"); pg.get_by_role("button", name="Valider le repas").click(); pg.wait_for_timeout(200)
        d = save()
        check("5/5 : coffre donné (+1 coffre à ouvrir)", d["g"]["coffre"]["n"] == 5 and d["g"]["coffre"]["ok"] and d["g"]["chests"] == d0["g"].get("chests", 0) + 1, (d["g"]["coffre"], d["g"].get("chests")))
        # aucune clé perdue
        perdues = [k for k in d0["g"] if k not in d["g"]] + [k for k in d0 if k not in d]
        check("aucune clé de la sauvegarde d'origine perdue", not perdues, perdues)
        pg.screenshot(path=str(T.ROOT / "outils" / "aujourdhui-fin-393.png"), full_page=True)
        check("aucune erreur JavaScript", not errs, errs[:3])
        check("pas de défilement horizontal (fin)", pg.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        b.close()
    print("\n" + ("TOUT EST BON" if not fails else f"{len(fails)} échec(s) : {fails}"))
    sys.exit(1 if fails else 0)

main()
