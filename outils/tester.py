#!/usr/bin/env python3
"""tester.py : tout vérifier d'un coup avant de livrer la V2.
  1. contrôles statiques de src/ (règles de V2.md) ; 2. extraction à jour ; 3. les 5 tests (socle, Aujourd'hui, Moi, Proches/Bilan, badges).
  python3 outils/tester.py        (SAVE : CARNET_SAVE=ma-sauvegarde.json pour tester ta vraie sauvegarde)"""
import pathlib, re, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
VENDU = {"src/avatar/moteur.js", "src/avatar/badges-pixel.js"}  # recopié de l'ancienne version (patrimoine pixel art) : exempt des contrôles de style
echecs = []

def ok(nom, bon, info=""):
    print(("OK     " if bon else "ÉCHEC  ") + nom + (f"  ({info})" if info and not bon else ""), flush=True)
    if not bon: echecs.append(nom)

def fichiers(ext):
    return [p for p in SRC.rglob("*" + ext) if "donnees/brut" not in p.as_posix() and p.relative_to(ROOT).as_posix() not in VENDU]

js, css = fichiers(".js"), fichiers(".css")
code = lambda p: re.sub(r"/\*.*?\*/|//[^\n]*", "", p.read_text("utf8"), flags=re.S)  # sans les commentaires
ok("zéro !important", not [p.name for p in css + js if "!important" in code(p)])
ok("zéro catch vide", not [p.name for p in js if re.search(r"catch\s*(\([^)]*\))?\s*\{\s*\}", code(p))])
ok("zéro variable globale (window.)", not [p.name for p in js if re.search(r"\bwindow\.\w+\s*=", p.read_text("utf8"))])
ok("zéro fichier « finitions »", not [p for p in SRC.rglob("*finitions*") if "donnees/brut" not in p.as_posix()])
ok("couleurs en dur seulement dans tokens.css", not [p.name for p in css if p.name != "tokens.css" and re.search(r"#[0-9a-fA-F]{3,8}\b", p.read_text("utf8"))])
ok("coins carrés (pas de border-radius hors ronds)", not [p.name for p in css if any(not re.match(r"(0|50%)(\s|$)", v.strip()) for v in re.findall(r"border-radius:([^;]+);", code(p)))])
r = subprocess.run([sys.executable, str(ROOT / "outils" / "extraire.py"), "--check"], capture_output=True, text=True)
ok("données extraites à jour", r.returncode == 0, r.stdout[-200:] + r.stderr[-200:])
for t in ("test_socle", "test_brique2", "test_brique3", "test_brique4", "test_quetes", "test_badges"):
    r = subprocess.run([sys.executable, str(ROOT / "outils" / (t + ".py"))], capture_output=True, text=True)
    ok(t, r.returncode == 0, "\n".join(l for l in r.stdout.splitlines() if l.startswith("ÉCHEC"))[:300])
print("\n" + ("TOUT EST BON" if not echecs else f"{len(echecs)} échec(s) : {echecs}"))
sys.exit(1 if echecs else 0)
