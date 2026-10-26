"""parcours.py [index.html] : tests de parcours (ce qu'on fait vraiment dans l'appli).
Chaque test affiche OK ou ÉCHEC ; code de sortie 1 s'il y a un échec ou une erreur JavaScript.
Parcours : création du profil, rituel, assiette, quête du jour, Annuler, ajouter un ami et un membre de la famille,
fiche d'un proche (bouton Fond), tous les écrans, sauvegarde après rechargement, export / restauration."""
import os, sys, datetime
from playwright.sync_api import sync_playwright

APP = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)) + "/../index.html")
fails, errs = [], []

def check(nom, ok, info=""):
    print(("OK     " if ok else "ÉCHEC  ") + nom + (f"  ({info})" if info and not ok else ""), flush=True)
    if not ok: fails.append(nom)

def xp(pg): return pg.evaluate("S.xp")

# Icônes au trait restées dans la page (elles doivent toutes être en pixel, écrites à la source)
TRAIT = ["M17 21v-2","M9 11l3 3L22 4","M4 21c0-4","M6 9l6 6 6-6","M17 9l5 6","M16 9a4","M4 20h4L19 9","M12 3l2.2 6.8","M12 5v14M5 12h14","M6 6l12 12","M5 12.5l4.5","M4 5h16v11","M5 4h4l2 5","M20 11a8","M4 12a8","M14.5 17.5","M12 22c4"]
trait_vus = set()
def trait(pg, ou):
    r = pg.evaluate("""S=>[...document.querySelectorAll('svg:not(.pxic)')].filter(sv=>sv.getAttribute('shape-rendering')!=='crispEdges'&&(sv.getAttribute('stroke')==='currentColor'||sv.querySelector('[stroke="currentColor"]'))&&S.some(k=>sv.innerHTML.includes(k))&&sv.getClientRects().length).map(sv=>(sv.closest('[id]')||{}).id+' '+sv.outerHTML.slice(0,90))""", TRAIT)
    for x in r: trait_vus.add(ou + " : " + x)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
    pg = ctx.new_page()
    pg.add_init_script("Math.random=(()=>{let s=42;return()=>{s=(s*16807)%2147483647;return s/2147483647}})()")
    pg.on("pageerror", lambda e: errs.append((str(e)+" @ "+((e.stack or "").split("\n")[1:2] or [""])[0].strip())[:220]))
    t = datetime.datetime.fromisoformat("2026-10-26T13:00:00+01:00"); pg.clock.install(time=t)
    pg.goto("file://" + APP); pg.wait_for_timeout(1500)

    # 1. Création du profil
    pg.click(".obnext"); pg.fill(".obname", "Ilario"); pg.click(".obnext"); pg.click(".obnext")
    pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
    pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
    for n in ("Léa", "Tom"): pg.fill(".obadd input", n); pg.press(".obadd input", "Enter")
    pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
    check("création du profil", pg.evaluate("S.g&&S.friends.length===2&&S.family.length===2"))

    # 2. Rituel
    x0 = xp(pg); pg.click(".rtile >> nth=0"); pg.wait_for_timeout(1500)
    check("rituel validé (+XP)", xp(pg) > x0, f"{x0} → {xp(pg)}")

    # 3. Assiette du déjeuner
    x0 = xp(pg); pg.click(".mlp >> nth=1"); pg.wait_for_timeout(400)
    check("l'assiette s'ouvre", pg.is_visible(".plo")); trait(pg, "assiette")
    for f in ("Pâtes", "Poulet", "Salade"): pg.evaluate("f=>[...document.querySelectorAll('.plo .plf')].find(b=>b.textContent.trim()===f).click()", f); pg.wait_for_timeout(150)
    for _ in range(6):
        if pg.is_visible(".plo .plok"): break
        if pg.is_visible(".plo .plnext"): pg.click(".plo .plnext"); pg.wait_for_timeout(250)
    if pg.is_visible(".plo .plok"): pg.click(".plo .plok"); pg.wait_for_timeout(500)
    check("assiette validée (+XP)", xp(pg) > x0 and not pg.is_visible(".plo"), f"{x0} → {xp(pg)}")

    # 4. Quête du jour puis Annuler
    pg.evaluate("document.querySelectorAll('.bpop').forEach(e=>e.remove())")
    x0 = xp(pg); pg.evaluate("[...document.querySelectorAll('.fqgo')].find(b=>/^Fait/.test(b.textContent.trim())).click()"); pg.wait_for_timeout(1500)
    if pg.is_visible(".bpop"):  # « Avec qui ? » éventuel
        pg.evaluate("(document.querySelector('.bpop .primary')||document.querySelector('.bpop button')).click()"); pg.wait_for_timeout(400)
    x1 = xp(pg); check("quête du jour validée (+XP)", x1 > x0, f"{x0} → {x1} " + pg.evaluate("[...document.querySelectorAll('.fqgo')].map(b=>b.textContent+'/'+b.closest('[class]').className).join(' ; ')+' | '+[...document.body.children].slice(-5).map(e=>e.className+':'+e.textContent.slice(0,50)).join(' ; ')"))
    un = pg.evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.trim()==='Annuler'&&!b.closest('.plo,.addfw'));if(b){b.click();return true}return null})()")
    pg.wait_for_timeout(800)
    check("Annuler rend l'XP", un is not None and xp(pg) < x1, f"{x1} → {xp(pg)}")

    # 4b. Quête avec minuteur : la fenêtre s'ouvre avec « Déjà fait »
    r = pg.evaluate("""(()=>{const b=[...document.querySelectorAll('.fqgo')].find(b=>!/^Fait/.test(b.textContent.trim()));if(!b)return 'aucune';b.click();
      const o=[...document.querySelectorAll('.pu')].pop();const ok=!!(o&&o.querySelector('.pudone'));if(o)o.remove();return ok})()""")
    if r != "aucune": check("quête à minuteur : bouton « Déjà fait »", r is True, str(r))

    # 5. Proches : ajouter un ami et un membre de la famille
    pg.evaluate("showView('r')"); pg.wait_for_timeout(300)
    pg.click(".rgh .fgplus >> nth=1"); pg.fill("#addFName", "Adeline"); pg.click(".addfw [type=submit]"); pg.wait_for_timeout(300)
    pg.click(".rgh .fgplus >> nth=0"); pg.fill("#addFName", "Gaby"); pg.click(".addfw [type=submit]"); pg.wait_for_timeout(300)
    check("ajouter un ami / un membre de la famille", pg.evaluate("S.friends.includes('Adeline')&&S.family.includes('Gaby')"))

    # 6. Fiche d'un proche : bouton Fond
    for n in ("Gaby", "Adeline"):
        pg.evaluate(f"openProfile('{n}')"); pg.wait_for_timeout(400)
        pg.evaluate("document.getElementById('pBgBtn').click()"); pg.wait_for_timeout(200)
        trait(pg, "fiche " + n); check(f"fiche de {n} : le bouton Fond ouvre le choix", pg.evaluate("!document.getElementById('pBgPick').hidden"))

    # 6b. Supprimer un proche (poubelle) puis Annuler
    r = pg.evaluate("(()=>{openProfile('Gaby');document.getElementById('delBtn').click();const gone=!S.family.includes('Gaby');document.querySelector('#undoBar button').click();return gone&&S.family.includes('Gaby')})()")
    check("supprimer un proche puis Annuler", r is True)

    # 7. Tous les écrans s'ouvrent
    for nom, js in [("Aujourd'hui", "showView('q')"), ("Ma vie", "showView('c');document.querySelector('[data-sub=vie][role=tab]').click()"),
                    ("Chez moi", "showView('c');document.querySelector('[data-sub=wr][role=tab]').click()"),
                    ("Bilan", "showView('c');document.querySelector('[data-sub=bilan][role=tab]').click()"), ("Proches", "showView('r')"),
                    ("météo", "showView('q');wxSheet()"), ("situation", "showView('q');sitSheet()"), ("projet", "showView('q');qcOpen('proj')")]:
        n0 = len(errs)
        try: pg.evaluate("()=>{document.querySelectorAll('.bpop,.plo,.wxsh,.sitsh,.qcsh,.qcw').forEach(e=>e.remove());" + js + "}"); pg.wait_for_timeout(300)
        except Exception as e: errs.append(nom + ": " + str(e)[:100])
        trait(pg, nom); check(f"écran {nom}", len(errs) == n0)

    # 7a. Créer une action : la recherche s'attache au champ du nom
    pg.evaluate("()=>{document.querySelectorAll('.qcw,.qcsh,.bpop').forEach(e=>e.remove());qcOpen('act')}"); pg.wait_for_timeout(300)
    check("créer une action : recherche sous le nom", pg.evaluate("!!document.querySelector('.qwname')&&!!document.querySelector('.qwfind')"))
    pg.evaluate("document.querySelectorAll('.qcw,.qcsh,.bpop').forEach(e=>e.remove())")

    # 7b. Chez moi : chaque pièce de la maison s'ouvre, chaque objet se touche
    n0 = len(errs)
    nb = pg.evaluate("""(()=>{showView('c');document.querySelector('[data-sub=wr][role=tab]').click();let n=0;
      for(const r of HM_ROOMS){hmRoom=r[0];renderHome(1);document.querySelectorAll('#homeBox .hmo').forEach(g=>{g.dispatchEvent(new MouseEvent('click',{bubbles:true}));n++})}
      hmRoom=null;renderHome(1);return n})()""")
    check("pièces de la maison et objets", len(errs) == n0 and nb > 10, f"{nb} objets")

    # 8. Sauvegarde : tout est encore là après rechargement
    avant = pg.evaluate("JSON.stringify([S.xp,S.friends,S.family])")
    pg.reload(); pg.wait_for_timeout(1500)
    apres = pg.evaluate("JSON.stringify([S.xp,S.friends,S.family])")
    check("sauvegarde gardée après rechargement", apres == avant, avant + " / " + apres)

    # 9. Export puis restauration
    with pg.expect_download() as dl:
        pg.evaluate("showView('c');document.querySelector('[data-sub=bilan][role=tab]').click()")
        pg.evaluate("(document.getElementById('expFile')||[...document.querySelectorAll('button')].find(b=>/Exporter/.test(b.textContent))).click()")
    path = dl.value.path()
    pg.evaluate("S.friends.push('Temporaire');save()")
    pg.set_input_files("input[type=file][accept*=json]", path); pg.wait_for_timeout(800)
    check("restauration du fichier exporté", pg.evaluate("!S.friends.includes('Temporaire')&&S.friends.includes('Adeline')"))

    b.close()

check("aucune icône au trait (tout en pixel)", not trait_vus, " | ".join(sorted(trait_vus)[:4]))
check("aucune erreur JavaScript", not errs, " | ".join(errs[:3]))
print(f"\n{len(fails)} échec(s)")
sys.exit(1 if fails else 0)
