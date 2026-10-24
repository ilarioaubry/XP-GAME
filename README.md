# Carnet de Quêtes

Appli perso gamifiée (quêtes, XP, rituels, relations), en français, pensée pour le téléphone.

## Utilisation

- L'appli publiée est une seule page : `index.html` (c'est elle que GitHub Pages sert).
- Les données sont enregistrées dans le navigateur (stockage local de l'appareil).
- **Sauvegarde** : onglet Moi > Bilan, tout en bas, « Copier mes données (sauvegarde) » puis « Restaurer ».

## Où est le code

Le code est découpé dans `src/` :

- `src/index.src.html` : la page, avec des emplacements `@@include(...)@@`
- `src/css/` : les feuilles de style
- `src/js/` : les scripts, numérotés dans l'ordre d'exécution

**Ne modifie jamais `index.html` à la main.** Modifie les fichiers de `src/`, puis lance :

```
python3 build.py          # reconstruit index.html
python3 build.py --check  # vérifie qu'index.html est à jour
```

Attention : l'ordre des fichiers CSS compte (les règles se superposent, les plus récentes gagnent) et les scripts partagent les mêmes variables globales.

## Mise en ligne

Hébergée avec GitHub Pages depuis la branche `main`.
