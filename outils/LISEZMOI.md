# Outils de vérification

À lancer depuis la racine du projet, après `python3 build.py`. Besoin : Python 3 + Playwright (Chromium).

| Outil | Ce qu'il fait |
|---|---|
| `shots.py <index.html absolu> <dossier>` | 55 captures : 11 écrans (Aujourd'hui, Ma vie, Chez moi, Bilan, Proches, fiche d'un proche, panneau +, assiette, météo, situation, création de projet) × 5 moments (midi, matin, nuit, décembre, pluie). Affiche les erreurs JavaScript. |
| `diff.py <dossier A> <dossier B>` | Compare deux séries de captures au pixel près. « écrans différents: 0 » = rien n'a bougé. |
| `centrage.py` | Centrage des éléments courts (icône seule ou icône + texte centrés), lignes de séparation doublées, ligne sous les onglets. « 0 élément(s) mal centré(s) » attendu. |
| `parcours.py` | Tests de parcours : profil, rituel, assiette, quête, Annuler, ajouter un proche, bouton Fond, tous les écrans, sauvegarde après rechargement, export / restauration. « 0 échec(s) » attendu. |
| `stdaudit.py` | Audit des standards sur tous les écrans : tailles de texte hors échelle, coins arrondis, bordures colorées, boutons sous 44 px, icônes hors 24 px, mots interdits, emoji. |
| `cssdiff.py <html A> <html B> "<js>" "<sélecteur>"` | Styles calculés qui diffèrent entre deux versions pour un élément. |
| `who.py "<js>" "<sélecteur>" prop1,prop2 [heure]` | Quelles règles CSS posent ces propriétés sur l'élément, dans l'ordre de cascade. |
| `probe.py "<js prépa>" "<js qui renvoie>" [heure]` | Exécute du code dans l'appli après l'accueil et affiche le résultat. |
| `tall.py <sortie.png> "<js>"` | Capture haute (393 × 2600) d'un écran entier. |
| `extract.py`, `deadcss.py`, `setrule.py` | Outils de rangement du CSS utilisés en phase 3 (déplacer des règles par zone, supprimer le CSS mort, modifier une règle). |

Méthode type pour une modification :

```
git stash; python3 build.py; python3 outils/shots.py $PWD/index.html /tmp/avant; git stash pop
python3 build.py; python3 outils/shots.py $PWD/index.html /tmp/apres
python3 outils/diff.py /tmp/avant /tmp/apres     # seuls les écrans voulus doivent changer
python3 outils/stdaudit.py                        # rien de nouveau ne doit apparaître
python3 outils/parcours.py                        # 0 échec(s)
python3 outils/centrage.py                        # 0 élément(s) mal centré(s)
```
