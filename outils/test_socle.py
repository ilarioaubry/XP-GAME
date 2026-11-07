#!/usr/bin/env python3
"""test_socle.py : le socle V2 relit et réécrit la sauvegarde de l'ancienne version sans rien perdre.

  python3 outils/test_socle.py                 sauvegarde fabriquée par l'ancienne version (profil + données riches)
  CARNET_SAVE=fichier.json python3 outils/test_socle.py   en plus : TA sauvegarde exportée (Moi > Bilan > Données)

Vérifie : A) aller-retour sans perte · B) clés inconnues gardées · C) formats ancien/futur/illisible non écrasés ·
D) migrations identiques à l'ancienne version · E) copie d'origine · F) aucun écran en erreur · G) 393 px sans défilement horizontal.
"""
import copy, datetime, functools, http.server, json, os, pathlib, socketserver, sys, threading
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEG = ROOT / "_legacy" / "index.html"
fails = []


def check(nom, ok, info=""):
    print(("OK     " if ok else "ÉCHEC  ") + nom + (f"  ({info})" if info and not ok else ""), flush=True)
    if not ok:
        fails.append(nom)


def diff(a, b, chemin="S", out=None, lim=12):
    """Écarts profonds entre deux valeurs JSON (le premier niveau d'une liste compte comme un tout si les tailles diffèrent)."""
    out = [] if out is None else out
    if len(out) >= lim:
        return out
    if type(a) != type(b):
        out.append(f"{chemin}: {type(a).__name__} ≠ {type(b).__name__}")
    elif isinstance(a, dict):
        for k in sorted(set(a) | set(b)):
            if k not in a: out.append(f"{chemin}.{k}: absent avant")
            elif k not in b: out.append(f"{chemin}.{k}: PERDU")
            else: diff(a[k], b[k], f"{chemin}.{k}", out, lim)
    elif isinstance(a, list):
        if len(a) != len(b): out.append(f"{chemin}: {len(a)} → {len(b)} éléments")
        else:
            for i, (x, y) in enumerate(zip(a, b)): diff(x, y, f"{chemin}[{i}]", out, lim)
    elif a != b:
        out.append(f"{chemin}: {str(a)[:40]!r} → {str(b)[:40]!r}")
    return out


class Silencieux(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass


def serveur():
    h = functools.partial(Silencieux, directory=str(ROOT))
    srv = socketserver.TCPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}/index.html"


def sauvegarde_ancienne(b):
    """Une vraie sauvegarde écrite par l'ancienne version : profil créé par l'écran d'accueil, puis données riches."""
    ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
    pg = ctx.new_page()
    pg.add_init_script("Math.random=(()=>{let s=42;return()=>{s=(s*16807)%2147483647;return s/2147483647}})()")
    pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-01T13:00:00+01:00"))
    pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>document.documentElement.classList.add('tde-off'))")
    pg.goto(LEG.as_uri()); pg.wait_for_timeout(1500)
    pg.click(".obnext"); pg.fill(".obname", "Ilario"); pg.click(".obnext"); pg.click(".obnext")
    pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
    pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
    for n in ("Léa", "Tom"):
        pg.fill(".obadd input", n); pg.press(".obadd input", "Enter")
    pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
    # données riches, dans les formes décrites par DONNEES.md
    pg.evaluate("""()=>{const G=S.g,T=Date.UTC(2026,10,1,11);
      S.xp=2350;S.days=['2026-10-29','2026-10-30','2026-10-31','2026-11-01'];
      S.log.push({t:T,a:'x1',name:'Marcher 20 min',cat:'soi',xp:15},{t:T+36e5,a:'mb',name:'Déjeuner',cat:'nourriture',xp:10});
      G.mb={'2026-11-01:matin':{t:T}};G.mbd={'2026-11-01:matin':{m:{dej:1},ex:{},w:{},cr:{}}};
      G.plt={'2026-11-01':{dej:{f:['pates'],p:['viande'],l:['salade'],s:['pesto'],x:{yaourt:1,maison:1},w:'maison'}}};
      G.plr=[{n:'Gratin',f:['patate']}];G.plT={veg:'2026-10-20',equi:'2026-10-21'};G.cafe={'2026-11-01':2};
      G.mood={'2026-11-01':4,'2026-10-31':2};G.sleep={'2026-11-01':{bed:23.5,wake:7.5}};G.bed={'2026-10-31':23.5};
      G.rh={'2026-11-01':{matin:[1,2]}};G.rcore=['2026-10-30'];G.rtb={matin:312};G.jr={'2026-10-31':'Bonne journée'};
      G.eng={lib:[{id:'e1',n:'Boire de l\\'eau'}],d:{},skip:''};G.todo=[{id:'t1',d:'2026-11-02',n:'Appeler le médecin'}];
      G.prj=[{id:'p1',n:'Album',steps:[{t:'Maquette',done:true}]}];G.ev=[{id:'v1',n:'Concert',d:'2026-11-14'}];
      G.gear=['beret','phones'];G.eq={tete:'beret'};G.rt=['Novice','Régulier'];G.badgesInit=1;
      G.chests=2;G.hist={'2026-W44':{xp:410,cats:{soi:200}}};G.sit={have:['chien'],bd:{d:3,m:5,y:1995}};
      G.wake=7;G.mute=false;G.ambS=true;G.pal={soi:1};G.boosts=[{c:'',t:1,w:'2026-W44'}];
      G.wx={k:'48.85,2.35',c:{t:1}};G.hm={ev:[],names:{}};G.run={best:5.2};G.md=40;G.book={t:'Dune',p:120};
      G.xm={a:1};G.boss={x:1};G.aiN=3;G.sdj={x:1};G.da='ciel';
      S.bonds={Léa:120};S.bondsLast={Léa:T};S.profiles={Léa:{giftl:['Livre'],gifts:'Livre',love:true}};
      S.badges={first:T};S.title='Maître des projets';S.wishes=[{id:'w9',name:'Un test',price:7}];S.spent=[{n:'x',t:T}];
      S.epics=[{id:'ep',name:'Grande quête',steps:[{t:'a'}]}];S.skills=[{n:'Piano'}];
      save();flush()}""")
    pg.wait_for_timeout(500)
    raw = pg.evaluate("localStorage.getItem('carnet-quetes')")
    ctx.close()
    return raw


def legacy_charge(b, raw):
    """Référence des migrations : l'ancienne version applique load() (lecture + migrations) à `raw`, sans rien d'autre
    (pas de rendu, pas d'attribution de badges ni de coffres, que l'ancienne appli fait d'elle-même à l'ouverture)."""
    ctx = b.new_context(viewport={"width": 393, "height": 852}, timezone_id="Europe/Paris")
    pg = ctx.new_page()
    pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-01T13:00:00+01:00"))
    pg.goto(LEG.as_uri()); pg.wait_for_timeout(1200)
    out = pg.evaluate("r=>{testMode=true;clearTimeout(saveTimer);window.render=()=>{};load(JSON.parse(r));return JSON.stringify(snapshot())}", raw)
    ctx.close()
    return out


def v2(b, url, raw, jouer=None):
    """La V2 relit `raw` ; renvoie (sauvegarde écrite, copie d'origine, erreurs de page, page)."""
    ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-01T13:00:00+01:00"))
    if raw is not None:
        pg.add_init_script("if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('carnet-quetes'," + json.dumps(raw) + ")}")
    pg.goto(url); pg.wait_for_selector("html[data-prete]", timeout=8000)
    if jouer:
        jouer(pg)
    pg.evaluate("import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(null)||0)")
    pg.evaluate("import('/src/core/state.js').then(s=>import('/src/core/sauvegarde.js').then(m=>m.ecrireMaintenant(s.etat())))")
    pg.wait_for_timeout(300)
    return pg.evaluate("localStorage.getItem('carnet-quetes')"), pg.evaluate("localStorage.getItem('carnet-quetes:avant-v2')"), errs, pg


def main():
    srv, url = serveur()
    with sync_playwright() as p:
        b = p.chromium.launch()
        sources = {"sauvegarde fabriquée par l'ancienne version": sauvegarde_ancienne(b)}
        if os.environ.get("CARNET_SAVE"):
            sources["TA sauvegarde exportée"] = pathlib.Path(os.environ["CARNET_SAVE"]).read_text(encoding="utf8")

        for nom, raw in sources.items():
            print(f"\n== {nom} ({len(raw):,} caractères)")
            d0 = json.loads(raw)
            # A. aller-retour : la V2 lit, migre si besoin, réécrit
            ecrit, avant, errs, pg = v2(b, url, raw)
            d1 = json.loads(ecrit)
            ecarts = diff(d0, d1, lim=200)
            check("A. la V2 réécrit exactement la sauvegarde d'origine (rien de perdu, rien de changé)", not ecarts, " ; ".join(ecarts[:6]))
            check("A. XP, journal, jours, proches, repas identiques",
                  all(d0[k] == d1[k] for k in ("xp", "log", "days", "friends", "family", "profiles", "bonds")) and d0["g"].get("mb") == d1["g"].get("mb") and d0["g"].get("plt") == d1["g"].get("plt"))
            check("A. format v = 28 gardé", d1["v"] == 28)
            check("E. copie d'origine gardée à l'identique", avant == raw)
            check("F. aucune erreur JavaScript", not errs, "; ".join(errs[:2]))
            nb = pg.evaluate("import('/src/core/journal.js').then(m=>m.nbErreurs())")
            check("F. journal d'erreurs vide", nb == 0, str(nb))

            # B. clés inconnues gardées (futures données, ou clés d'une version intermédiaire)
            d2 = copy.deepcopy(d0)
            d2["cleFuture"] = {"a": [1, 2, {"b": "c"}]}
            d2["g"]["cleFutureG"] = {"x": 1}
            e2, _, errs2, _ = v2(b, url, json.dumps(d2))
            d3 = json.loads(e2)
            check("B. clés inconnues (S et S.g) gardées", d3.get("cleFuture") == d2["cleFuture"] and d3["g"].get("cleFutureG") == {"x": 1})

            # D. migrations : sauvegarde d'avant les migrations
            d4 = copy.deepcopy(d0)
            d4["g"]["ver"] = 0
            for k in ("dst26", "voc1"):
                d4["g"].pop(k, None)
            d4["title"] = "Dompteur de boss"
            d4["g"]["rt"] = ["Dompteur de boss", "Régulier"]
            d4["g"]["plb"] = {"x": 1}
            d4["actions"].append({"id": "zz", "name": "Repas équilibré", "cat": "nourriture", "xp": 10})
            raw4 = json.dumps(d4)
            e4, _, errs4, _ = v2(b, url, raw4)
            r4 = json.loads(legacy_charge(b, raw4))
            ec4 = diff(r4, json.loads(e4))
            check("D. migrations 1 à 5 : même résultat que load() de l'ancienne version", not ec4, " ; ".join(ec4))
            check("D. S.g.ver = 5", json.loads(e4)["g"]["ver"] == 5)

        # C. formats qui ne doivent JAMAIS être écrasés
        base = json.loads(next(iter(sources.values())))
        for nom, contenu, attendu in (
            ("format ancien (v 20)", json.dumps({**base, "v": 20}), "ancienne"),
            ("format futur (v 40)", json.dumps({**base, "v": 40}), "future"),
            ("JSON illisible", '{"xp": 12, "g": {', "illisible"),
        ):
            ecrit, avant, errs, pg = v2(b, url, contenu)
            etat = pg.evaluate("import('/src/core/state.js').then(s=>s.etatLecture())")
            check(f"C. {nom} : lecture « {attendu} »", etat == attendu, etat)
            check(f"C. {nom} : la sauvegarde n'est pas écrasée", ecrit == contenu)

        # première ouverture, sans sauvegarde
        ecrit, avant, errs, pg = v2(b, url, None)
        check("Première ouverture : démarre sans erreur", not errs, "; ".join(errs[:2]))

        # G. rendu à 393 px
        _, _, _, pg = v2(b, url, next(iter(sources.values())))
        larg = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
        check("G. 393 px : pas de défilement horizontal", larg[0] <= larg[1], str(larg))
        pg.screenshot(path=str(ROOT / "outils" / "socle-393.png"), full_page=True)
        b.close()
    srv.shutdown()
    print(f"\n{len(fails)} échec(s)")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
