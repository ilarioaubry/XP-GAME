#!/usr/bin/env python3
"""Assemble le code source en index.html (la page que GitHub Pages sert).

  python3 build.py           reconstruit index.html
  python3 build.py --check   vérifie que index.html est à jour (code 1 sinon)

Le code vit dans src/ :
  src/index.src.html   la page : balises HTML + emplacements @@include(chemin)@@
  src/css/*.css        les feuilles de style
  src/js/*.js          les scripts

Chaque @@include(chemin)@@ est remplacé par le contenu exact du fichier
(les espaces autour de l'emplacement sont absorbés). L'ordre des emplacements
est l'ordre d'exécution : ne pas le changer à la légère, la cascade CSS et
l'initialisation du JS en dépendent.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
MARK = re.compile(r"\s*@@include\(([^)]+)\)@@\s*")


def build():
    skeleton = (SRC / "index.src.html").read_text(encoding="utf8", newline="")
    used = []

    def sub(m):
        rel = m.group(1)
        used.append(rel)
        f = SRC / rel
        if not f.is_file():
            sys.exit(f"Fichier manquant : src/{rel}")
        return f.read_text(encoding="utf8", newline="")

    out = MARK.sub(sub, skeleton)
    dup = {u for u in used if used.count(u) > 1}
    if dup:
        sys.exit("Fichier inclus deux fois : " + ", ".join(sorted(dup)))
    on_disk = {str(p.relative_to(SRC)) for d in ("css", "js") for p in (SRC / d).glob("*") if p.is_file()}
    orphan = sorted(on_disk - set(used))
    if orphan:
        sys.exit("Fichier non inclus dans src/index.src.html : " + ", ".join(orphan))
    return out, len(used)


def main():
    out, n = build()
    target = ROOT / "index.html"
    if "--check" in sys.argv:
        cur = target.read_text(encoding="utf8", newline="") if target.exists() else None
        if cur != out:
            sys.exit("index.html n'est pas à jour : lance  python3 build.py")
        print(f"index.html est à jour ({n} fichiers).")
        return
    target.write_text(out, encoding="utf8", newline="")
    print(f"index.html reconstruit ({n} fichiers, {len(out):,} caractères).")


if __name__ == "__main__":
    main()
