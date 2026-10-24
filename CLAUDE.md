# Carnet de Quêtes

Appli perso en français (quêtes, XP, rituels, relations), utilisée sur iPhone en appli installée depuis GitHub Pages. Répondre en français, de façon concise.

## Règles de travail

- Le code source est dans `src/` (`index.src.html`, `css/`, `js/`). `index.html` est GÉNÉRÉ : ne jamais l'éditer à la main.
- Après toute modification dans `src/`, lancer `python3 build.py` puis committer `src/` ET `index.html` ensemble.
- L'ordre des emplacements `@@include(...)@@` est l'ordre d'exécution : les CSS « principal-XX » et « epure-XX » sont des couches chronologiques (le dernier gagne), ne pas les réordonner.
- Tous les scripts partagent la portée globale (état `S`, `save()`, `load()`, clé localStorage `carnet-quetes`) ; `js/correctifs.js` est une grosse IIFE de rustines.
- Tester à largeur iPhone (≈393 px) avec Playwright avant de livrer. iOS en mode appli : la classe `fullh` + `100lvh` corrige la hauteur ; ne pas la retirer.
- Ne pas casser les données existantes de l'utilisateur (format de sauvegarde localStorage).
