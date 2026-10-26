# XP

Appli personnelle en pixel art pour prendre soin de soi et de ses proches, un jour à la fois : repas (assiette), rituels, quêtes du jour, projets, proches, bilan de la semaine. Chaque action rapporte un peu d'XP.

## L'installer sur iPhone

1. Ouvrir **https://ilarioaubry.github.io/XP-GAME/** dans Safari.
2. Partager → **Sur l'écran d'accueil**.
3. Ouvrir « XP » depuis l'écran d'accueil : plein écran, fonctionne sans réseau.

Les données restent sur le téléphone. **Sauvegarde** : Moi > Bilan > Données > « Exporter en fichier » (à ranger dans iCloud Drive). Pour récupérer : « Restaurer depuis un fichier ».

## Le projet

| Fichier | Rôle |
|---|---|
| `src/` | le code (page, styles, scripts) |
| `index.html` | la page assemblée par `python3 build.py` (ne pas modifier à la main) |
| `CLAUDE.md` | règles de travail et standards de l'appli |
| `DESIGN.md` | guide de construction : tailles, boutons, espacements, couleurs, interactions |
| `FEUILLE-DE-ROUTE.md` | le plan en cours |
| `FONCTIONNALITES.md` | ce que fait l'appli, écran par écran |
| `DONNEES.md` | ce que contient la sauvegarde |
| `CHANGELOG.md` | ce qui a changé, et quand |
| `outils/` | captures et vérifications automatiques |
| `manifest.json`, `sw.js`, `icones/` | installation sur l'écran d'accueil et hors ligne |
