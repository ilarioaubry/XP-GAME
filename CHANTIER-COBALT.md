# Chantier Cobalt (branche `cobalt`)

Refonte visuelle d'après les maquettes « E » (canevas Design « XP — Aujourd'hui, maquettes ») : base D (cobalt, orange, rose, crème), les 4 angles et les repas en tuiles de A2.

## Palette (à n'écrire qu'en variables)
- Fond `#101443` · cartes `#1b2275` · cartes 2 `#2433d6` · ligne/piste `#4a58e8` · ciel clair `#7d8cf0` / `#c9d0ff`
- Texte `#fff3e0` · texte discret `#c9d0ff` · panneau crème `#f6e6c8`
- Orange `#ff6a2b` = action, sélection, progression (remplace l'or)
- Angles : Corps `#ff9ec7` · Esprit `#c8a2ff` · Liens `#7d8cf0` · Foyer `#f6e6c8`

## Fait (lot 1, 04/11)
- Un seul thème : thèmes clair/sombre et `data-theme` retirés de `base.css`, `--bg/--surface/--ink/--accent/--gold` en Cobalt.
- Briques `ui-` (`composants.css`) en Cobalt.
- Jaunes et crèmes écrits en dur dans `src/css` remplacés par l'orange et le crème Cobalt.
- Couleurs de catégories regroupées par angle (sport, nourriture → Corps ; soi, créer → Esprit ; amis, famille, social, eau → Liens ; maison, planète → Foyer).
- `parcours.py` : 0 échec.

## Fait (lot 2, 04/11)
- Nouvelle variable `--ui-trait` (#101443) : contours pixel, ombres dures, texte sur orange.
- Bruns-noirs des contours (`#1a1210`, `#2a1c0c`, `#2a1606`, `#24182c`, `#16121c`) et bleus nuit (`#0d0f22`, `#141632`) → `var(--ui-trait)` ; or `#e0a020` → `var(--ui-or)` ; fond `rgba(12,14,32,.62)` → `var(--ui-fond)`.
- parcours 0 échec, centrage 0.

## Fait (lot 3, 04/11)
- `renderNow` : carte « question du moment » (`focusQ`) : repas en cours (Sauté / Remplir l'assiette ou Pris) > routine du matin > bilan après 21 h ; rangée des 4 angles (`anglesRow`, regroupement à l'affichage des 8 jauges via `ANGLES`). CSS `.focq`, `.angles` dans `aujourdhui.css`.
- Vérifié dans le DOM (midi : carte + angles rendus, display grid), parcours 0, centrage 0. Pas encore vu en capture : `shots.py` ne montre pas la zone ; à placer juste sous la scène (au-dessus de « Ta semaine dernière »).
- Reste pour Aujourd'hui : après-midi = prochaine quête, tuiles de repas + pastille, retirer les doublons (Ce midi / repas du journal).

## Reste, dans l'ordre
1. Couleurs encore écrites en dur (≈900 : surtout `#000`, `#fff`, rgba noirs/blancs, quelques couleurs de catégories en dur `#5fae4f`, `#e3263a`, `#ff7aa8`…) : les remplacer par les variables, feuille par feuille, en supprimant l'ancien (jamais de couche par-dessus).
2. Aujourd'hui = maquette E Focus+ : question du haut selon l'heure (matin routine, midi repas, après-midi prochaine quête, soir bilan), 4 angles sous la planète, repas en tuiles + pastille « N repas · N groupes sur 3 ».
3. Les 8 jauges → 4 angles (données gardées dans `S.g`, regroupement à l'affichage + migration si besoin).
4. Assiette = maquette E Assiette : rangées gardées, carré par groupe, boutons « Repas sauté » / « Noter ce repas ».
5. Moi = maquettes E Ma vie / Chez moi / Bilan.
6. Avatar Pixel Clair : contour `#101443`, vêtements dans la palette, une seule ombre ; aura couleur de l'angle dominant ; fonds → ciels.
7. Pixels d'icônes en JS (jaunes `#ffd94a` etc. dans `src/js`) : recolorer.
8. Puis : repas sauté, coffres (jauge visible), Proches, liens plus lents, déblocages progressifs.
