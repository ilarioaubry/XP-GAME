#!/usr/bin/env python3
"""extraire.py : copie fidèle des catalogues de l'ancienne version vers la V2.

  python3 outils/extraire.py            écrit src/donnees/brut/*.js et outils/extraction.json
  python3 outils/extraire.py --check    vérifie que src/donnees/brut est à jour (code 1 sinon)

Méthode : on ouvre _legacy/index.html (sans sauvegarde) dans Chromium, puis on lit la VALEUR FINALE
de chaque constante de haut niveau des scripts (après tous les Object.assign / push des anciens
fichiers). Rien n'est recopié à la main, donc rien ne se perd.

- Données pures → src/donnees/brut/<fichier d'origine>.js (modules ES, générés, ne pas modifier).
- Fonctions trouvées dans une donnée → marquées {"__fn__":"<nom>"} : logique à porter à la main
  (liste dans outils/extraction.json, rubrique « logique »).
- Set, Map, RegExp gardés sous une forme relisible : {"__set__":[…]}, {"__map__":[…]}, {"__re__":"…","f":"i"}.
- Catalogues construits par une fonction (badges) : la fonction est appelée et ses champs fixes gardés.
"""
import datetime, json, pathlib, re, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
LEG = ROOT / "_legacy"
OUT = ROOT / "src" / "donnees" / "brut"
REPORT = ROOT / "outils" / "extraction.json"

# Constantes qui ne sont pas des catalogues : état, caches, éléments d'écran.
SKIP = {"S", "SFX", "subs", "decoC", "mbDraft", "MIG"}  # état, cache du décor, brouillon ; MIG est porté à la main (src/core/migrations.js)
# Catalogues fabriqués par une fonction : nom du module → expression appelée dans la page.
BUILT = {"BADGES": "badgeDefs()"}

SER = r"""(names)=>{
  const enc=(v,stack)=>{
    if(v===null||typeof v!=='object'&&typeof v!=='function')return v;
    if(typeof v==='function')return {__fn__:v.name||'anonyme'};
    if(v instanceof Node)return undefined;
    if(v instanceof RegExp)return {__re__:v.source,f:v.flags};
    if(stack.includes(v))return {__cycle__:1};
    stack=stack.concat([v]);
    if(v instanceof Set)return {__set__:[...v].map(x=>enc(x,stack))};
    if(v instanceof Map)return {__map__:[...v].map(([k,x])=>[enc(k,stack),enc(x,stack)])};
    if(Array.isArray(v))return v.map(x=>{const e=enc(x,stack);return e===undefined?null:e});
    const o={};for(const k of Object.keys(v)){const e=enc(v[k],stack);if(e!==undefined)o[k]=e}return o};
  const out={};
  for(const [n,expr] of names){let v;try{v=(0,eval)(expr)}catch(e){out[n]={err:String(e)};continue}
    if(typeof v==='function'||v===null||typeof v!=='object'||v instanceof Node){out[n]={skip:typeof v};continue}
    out[n]={v:enc(v,[])}}
  return out}"""


def legacy_consts():
    """Nom de chaque constante de haut niveau → fichier d'origine (ordre d'inclusion)."""
    order = re.findall(r"@@include\((js/[^)]+)\)@@", (LEG / "src" / "index.src.html").read_text(encoding="utf8"))
    found = {}
    for rel in order:
        txt = (LEG / "src" / rel).read_text(encoding="utf8")
        for m in re.finditer(r"^const\s+([A-Za-z_$][\w$]*)\s*=", txt, re.M):
            n = m.group(1)
            if n not in SKIP and not n.startswith("__"):
                found.setdefault(n, rel)
    return found


def walk(v, path, acc):
    if isinstance(v, dict):
        if "__fn__" in v and len(v) == 1:
            acc.append(path)
            return
        for k, x in v.items():
            walk(x, path + "." + str(k), acc)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            walk(x, f"{path}[{i}]", acc)


def regex_on_names():
    """Classements cachés : expressions régulières testées sur un nom (à remplacer par des champs)."""
    pat = re.compile(r"/((?:\\/|[^/\n])+)/[gimsuy]*\.test\(\s*([\w.$\[\]\"']*?(?:name|\.n\b|\bn\b|nm|lbl|label|title|txt|t\b)[\w.$\[\]\"']*)\s*\)")
    res = {}
    for f in sorted((LEG / "src" / "js").rglob("*.js")):
        hits = pat.findall(f.read_text(encoding="utf8"))
        if hits:
            res[str(f.relative_to(LEG / "src" / "js"))] = len(hits)
    return res


def extract():
    consts = legacy_consts()
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 393, "height": 852})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        # date et hasard fixés : la copie est la même à chaque lancement
        pg.add_init_script("Math.random=(()=>{let s=42;return()=>{s=(s*16807)%2147483647;return s/2147483647}})()")
        t0 = datetime.datetime.fromisoformat("2026-11-01T12:00:00+01:00")
        pg.clock.install(time=t0)
        pg.clock.pause_at(t0)
        pg.goto((LEG / "index.html").as_uri())
        pg.clock.run_for(1500)
        names = [[n, n] for n in consts] + [[k, e] for k, e in BUILT.items()]
        vals = pg.evaluate(SER, names)
        b.close()
    if errs:
        sys.exit("Erreur JavaScript dans l'ancienne version : " + errs[0])

    files, report = {}, {"catalogues": {}, "logique": {}, "ignores": {}}
    for n, r in vals.items():
        src = consts.get(n, "construit")
        if "v" not in r:
            report["ignores"][n] = r.get("skip") or r.get("err")
            continue
        v = r["v"]
        fns = []
        walk(v, n, fns)
        stem = "badges" if n in BUILT else pathlib.Path(src).stem
        stem = re.sub(r"^\d+[a-z]?-", "", stem)
        files.setdefault(stem, []).append((n, v, src))
        size = len(v) if isinstance(v, (list, dict)) else 1
        report["catalogues"][n] = {"fichier": src, "type": "liste" if isinstance(v, list) else "objet", "n": size,
                                   "octets": len(json.dumps(v, ensure_ascii=False))}
        if fns:
            report["logique"][n] = {"fichier": src, "fonctions": len(fns), "exemples": fns[:3]}
    report["regex_sur_noms"] = regex_on_names()
    return files, report


def render(files):
    out = {}
    for stem, items in sorted(files.items()):
        srcs = sorted({s for _, _, s in items})
        lines = [f"// GÉNÉRÉ par outils/extraire.py depuis _legacy/src/{', _legacy/src/'.join(srcs)} — ne pas modifier.",
                 "// Valeurs finales de l'ancienne version. Les catalogues propres de la V2 se construisent à partir d'ici."]
        for n, v, _ in items:
            lines.append(f"export const {n} = {json.dumps(v, ensure_ascii=False, separators=(',', ':'))};")
        out[f"{stem}.js"] = "\n".join(lines) + "\n"
    return out


def main():
    files, report = extract()
    out = render(files)
    if "--check" in sys.argv:
        cur = {p.name: p.read_text(encoding="utf8") for p in OUT.glob("*.js")} if OUT.exists() else {}
        if cur != out:
            sys.exit("src/donnees/brut n'est pas à jour : lance  python3 outils/extraire.py")
        print(f"src/donnees/brut est à jour ({len(out)} fichiers).")
        return
    OUT.mkdir(parents=True, exist_ok=True)
    for p in OUT.glob("*.js"):
        p.unlink()
    for name, txt in out.items():
        (OUT / name).write_text(txt, encoding="utf8")
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf8")
    c = report["catalogues"]
    print(f"{len(c)} catalogues copiés dans {len(out)} fichiers ({sum(x['octets'] for x in c.values()):,} octets) ; "
          f"{len(report['logique'])} contiennent de la logique à porter ; "
          f"{sum(report['regex_sur_noms'].values())} expressions régulières sur des noms dans {len(report['regex_sur_noms'])} fichiers.")


if __name__ == "__main__":
    main()
