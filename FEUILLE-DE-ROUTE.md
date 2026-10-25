# Feuille de route — Carnet de Quêtes

Issue du rapport complet du 25/10/2026 (doc : https://claude.ai/artifact/TxKnkAVsLLj1E75MbprWGP).
**Rien ne se retire de cette liste sans l'accord d'Ilario.**

## Méthode (à chaque demande)

1. Claude présente l'étape suivante : ce qui change, ce que ça touche, ce qu'Ilario aura à vérifier.
2. Ilario dit « go ».
3. Claude fait l'étape, teste à 393 px, montre une capture, dit ce qui n'a pas pu être vérifié sur iPhone.
4. Ilario vérifie sur son iPhone.
5. Claude coche l'étape ici (`[x]` + date), commit, puis présente la suivante.

Les éléments marqués **(décision)** demandent un choix d'Ilario avant de construire.

---

## Phase 0 — Fait

- [x] Retirer les captures de test du dépôt, ajouter `.gitignore` (25/10/2026)

## Phase 1 — Sécurité des données et hors ligne

- [x] 1.1 (25/10/2026) Export de la sauvegarde en fichier (partage iOS → iCloud Drive / Fichiers) + import depuis un fichier, à la place du copier-coller
- [-] 1.2 (passé le 25/10/2026, à la demande d'Ilario) Rappel d'export régulier (discret, ton encourageant)
- [x] 1.3 (25/10/2026) Numéro de version dans la sauvegarde + liste de migrations numérotées qui remplace les drapeaux ponctuels (`dst26`, `voc1`) sans casser les données
- [x] 1.4 (25/10/2026) `manifest.json` : nom « XP » (aussi dans l'appli : bannière, accueil), icône pixel, écran de démarrage, mode appli
- [x] 1.5 (25/10/2026) Service worker : l'appli s'ouvre sans réseau
- [x] 1.6 (25/10/2026) Documenter les clés de `S.g` (`DONNEES.md` : 148 clés trouvées, pas 88 ; 13 héritées à trancher en phase 2)
- [x] 1.7 (25/10/2026, choix B) Supprimer le code de synchronisation avec le compte Claude (inutile sur GitHub Pages) et l'enveloppe HTML en double (deux documents imbriqués). Fait aussi : Spotify et les fonctions qui appelaient Claude (Écrire avec Claude, Renouveler, étapes de projet par Claude, arc par Claude → découpage automatique sans Claude) retirés, car ils ne marchent pas hors de Claude
- [x] 1.8 (25/10/2026) Météo : remplacer le connecteur AccuWeather de Claude (ne marche pas sur GitHub Pages) par Open-Meteo, gratuit et sans compte, position gardée sur le téléphone ; d'ici là le bouton « Météo » ne fonctionne pas

## Phase 2 — Tri et code mort (avec Ilario)

- [x] 2.1 (25/10/2026) Passer en revue les 32 sections jamais affichées, une par une : garder / déplacer / supprimer
  nightBox, evToday, evmBox, sleepGo, wkSun, plusBox, nowBox, rtrBox, gameBox, xmBox, duoBox, wkBox, prjBox, prof, weekBox, sonSeance, Armoire, Badges, lzProf, Skills, musBox, dzBox, pathBox, ritStat, wkRecap, recBox, sleepBox, plWeek, jrBox, moodBox, pcBox, fd
  **Décisions d'Ilario (25/10) :**
  - Garder (s'affichent à un moment précis) : nightBox, evToday, evmBox, sleepGo, wkSun, rtrBox, nowBox, plusBox + wkBox + duoBox (panneau « + »), prof, Armoire, Badges, plWeek, gameBox (retirer ses restes de boss)
  - Noël (xmBox) : garder la saison des fêtes, **supprimer son boss** (« Bougonnoël »)
  - Supprimer : compétences musique (Skills, lzProf, musBox, dzBox, sonSeance), Mon chemin (pathBox), Sommeil (sleepBox), Humeur de l'année (moodBox), Mes rituels (ritStat), Ma semaine / Records / Journal (wkRecap, recBox, jrBox), Rappels (pcBox), ancien Projets (prjBox), weekBox
  - Les données correspondantes restent dans la sauvegarde
- [x] 2.2 (25/10/2026) Supprimer les 24 déclarations jamais utilisées (+ 3 devenues inutiles ensuite : SELL, chCardCanvas, __myCard ; plus aucune déclaration inutilisée) : FAMILLE, vkind, VK_IC, avcTab, chHeadDx, myCardURL, __picC, SK_XP, MAP_T, ritOpen, PROJ, PJ_XP, PJ_BONUS, pjOpen, pjArm, sellPrice, LOOTVB, bgPrjRev, bgPrjFast, bgSoiDays, LOOTPX, LOOTWAIT, PX1, TALENTS
- [x] 2.3 (25/10/2026) Supprimer ce qui est seulement caché (fait selon les décisions de 2.1 : 14 sections + onglet « Domaines » + leur code ; boss de Noël et restes de boss des coffres retirés ; Noël gardé) (selon 2.1) : Noël (xmBox, masqué en CSS seulement), vue « t » et barre `qnav`, sous-onglets sons / compétences, weekBox, sections masquées en CSS (ritStat, sleepBox, moodBox)
- [x] 2.4 (25/10/2026) Renommer les fichiers « boss » (→ 13-figurines-expressions, 23-coffres-quetes-du-jour, 28-sons-proches-validation ; code de boss restant supprimé ; identifiants internes gardés car enregistrés dans les données : badges boss1/boss4, coffre « boss », clés boss/bh) (13-pixel-clair-boss, 23-boss-par-categorie, 28-sons-boss) et n'en garder que ce qui sert (figurines `BOSS_CAT`, projets `CB_LIST`, sons)
- [x] 2.7 (25/10/2026) Renommer `17-spotify-meteo.js` (→ `17-meteo.js`) en fichier météo (Spotify retiré)
- [x] 2.5 (25/10/2026) Liste des fonctionnalités avec leur statut : active / cachée / à supprimer (`FONCTIONNALITES.md`)
- [x] 2.6 (25/10/2026) Règle : toute fonctionnalité retirée est supprimée du code, jamais seulement cachée (à ajouter dans CLAUDE.md)

## Phase 3 — Composants et fusion des CSS (écran par écran, Aujourd'hui d'abord)

- [ ] 3.1 Variables uniques : couleurs (`--gold`…), tailles de texte (`--t-card`…), espacements (`--sp-2`…)
- [ ] 3.2 Composants définis une fois : bouton (3 variantes), carte d'action, tuile, titre de section, barre, étiquette, compteur, fenêtre courte, fenêtre plein écran, état vide
- [ ] 3.3 Fusion des 27 feuilles CSS en : base + composants + une feuille par zone — Aujourd'hui
- [ ] 3.4 … Proches
- [ ] 3.5 … Moi (Profil, Bilan, Réglages)
- [ ] 3.6 … Fenêtres (assiette, menus, « Avec qui ? »…)
- [ ] 3.7 Supprimer les 1 451 `!important` et les hacks `html:not(#_a)…` au fil de la fusion
- [ ] 3.9 Supprimer le CSS des fonctionnalités retirées (radio Spotify `.scradio`, `.spt`, `.spsh`, boss, Noël…)
- [ ] 3.8 Coins carrés définis dans les composants, plus par une règle universelle avec liste blanche de ronds

## Phase 4 — Scripts

- [ ] 4.1 Reporter chaque rustine de `correctifs.js` (139 Ko) dans sa fonction d'origine, puis supprimer le fichier
- [ ] 4.2 Remplacer les 24 réécritures de fonctions globales par des modifications directes (`render` ×2 dans correctifs et assiette, `ICO`, `feedDo`, `badgeDefs`, `complete`, `famOf`…)
- [ ] 4.3 Icônes pixel écrites à la source, suppression des observateurs DOM (`pxSwap`, `sqIcons`)
- [ ] 4.4 Regrouper les scripts par zone : `coeur/` (données, sauvegarde, XP, dates), `aujourdhui/` (repas, assiette, rituels, quêtes du jour), `proches/`, `moi/` (profil, armoire, badges, bilan, réglages), `decor/` (ciel, scène, sons), `ui/` (fenêtres, toasts, icônes, boutons)
- [ ] 4.5 Sortir le contenu du code dans des fichiers de données : grilles d'icônes (RKI, IC, PXUI), aliments, badges, quêtes
- [ ] 4.6 Alléger les gros fichiers : 12-pixel-clair-moteur (114 Ko), 25-chez-moi (78 Ko), 26-bibliotheque-badges (69 Ko)
- [ ] 4.7 Passer en modules JavaScript par zone (s'importent au lieu de se réécrire), un seul point d'état `load()` / `save()`

## Phase 5 — Standards précisés, uniformité, lisibilité

Standards trop globaux → version précisée :
- [ ] 5.1 Centrage : centré pour bouton, tuile, compteur ; aligné à gauche pour les cartes avec description
- [ ] 5.2 État « à faire maintenant » : garder « bordure colorée = actif », ajouter un signal défini (étiquette « Maintenant » ou opacité réduite pour « plus tard ») **(décision)**
- [ ] 5.3 Textes longs : titres de carte 2 lignes max ; noms dans les listes 1 ligne avec « … »
- [ ] 5.4 11 px seulement sur fond sombre, sinon 13 px
- [ ] 5.5 Un seul séparateur (pointillés) pour tous les groupes, Proches et Bilan compris (sauf fiches de proches)
- [ ] 5.6 Icônes en 3 tailles : 16, 32, 48 px (multiples de la grille, pixels nets)
- [ ] 5.7 Rareté : étoiles + mot de la rareté dans la fiche détaillée
- [ ] 5.8 Toute action par appui long existe aussi dans le menu « … »

Points d'uniformité restants :
- [ ] 5.9 Fond des cartes : un seul fond partout
- [ ] 5.10 Avatars des proches : un seul format (carré pixel, initiale si pas de photo)
- [ ] 5.11 Titres de Bilan (« CHAPITRE EN COURS ») au modèle des titres de section
- [ ] 5.12 Restes : pastilles « 0/10+5 », libellé « Goûter » grisé, tuile « Routine » de taille différente
- [ ] 5.13 Menus contextuels encore en survol / positionnés au doigt → petite fenêtre centrée
- [ ] 5.14 Revérifier les fenêtres rarement ouvertes après le passage à l'échelle de texte
- [ ] 5.19 Carte « Ta semaine est finie » : cadre jaune et cadre autour du graphique (contraire à « pas d'encadrés »), repérée le 25/10
- [x] 5.20 Salut « Bonsoir, Ilar » : pas un bug, c'est le prénom choisi (25/10/2026)
- [ ] 5.21 Fenêtre Météo : en bas d'écran alors qu'on y tape une ville (standard : plein écran) ; lignes Aujourd'hui / Demain encadrées
- [ ] 5.22 Carte « Saison des fêtes » (décembre) : cadre et bordures rouges à gauche (contraire à « pas d'encadrés » et « bordure colorée = actif »)
- [ ] 5.23 Bonnes actions : le choix d'XP va jusqu'à 50 et 100 (contraire à « pas de bonus géants » ; barème 2–30)
- [ ] 5.15 Carrousel des quêtes spéciales avec une seule carte : même taille de carte

Lisibilité :
- [ ] 5.16 Voile sombre sous le contenu, ou ciel limité à un bandeau en haut **(décision)**
- [ ] 5.17 Libellés de stats (Force, Talent…) lisibles (fond sombre)

- [ ] 5.18 Intégrer les standards précisés dans CLAUDE.md

## Phase 6 — Interface et utilisation

- [ ] 6.1 **(décision)** Phrase du cœur de l'appli (ex. « Prendre soin de moi et de mes proches, un jour à la fois »)
- [ ] 6.2 **(décision)** Rôle du jeu : récompense discrète ou moteur ? (XP, niveaux, armoire, badges, stats)
- [ ] 6.3 **(décision)** Définir la version 1 stable (ce qui est « terminé »)
- [ ] 6.4 Aujourd'hui en ordre fixe : prochaine action → la journée (repas + assiette, rituels, quêtes du jour) → quêtes spéciales ; le décoratif part dans Moi > Profil
- [ ] 6.5 Mettre en avant la prochaine action (« qu'est-ce que je fais maintenant ? »)
- [ ] 6.6 Le jeu apparaît à la validation (+XP, petite animation) et dans Profil, pas en bloc dans Aujourd'hui
- [ ] 6.7 Moi en trois sous-pages : Profil, Bilan, Réglages (réglages : rituels, sauvegarde, sons, aide)
- [ ] 6.8 Un seul chemin principal par action (repas : tuile / assiette / quête ; quête : bouton / « … » / appui long)
- [ ] 6.9 Page « Aide » courte pour les gestes
- [ ] 6.10 Proches triés par temps depuis le dernier contact **(décision)**
- [ ] 6.11 Stats de personnage → résumé concret (« ce mois-ci : 12 repas équilibrés, 4 sorties ») **(décision)**

## Phase 7 — Organisation du projet

- [ ] 7.1 README : à quoi sert l'appli, installation sur iPhone
- [ ] 7.2 CHANGELOG (ce qui a changé, quand)
- [ ] 7.3 5 à 10 tests Playwright versionnés (valider un repas, une quête, annuler, assiette, sauvegarde…)
- [ ] 7.4 GitHub Actions : build `--check` + tests à chaque envoi

## Phase 8 — Nouvelles fonctionnalités (seulement après, à valider)

- [ ] 8.1 **(décision)** Vue mensuelle et annuelle dans Bilan (correction du 25/10 : des onglets Semaine / Mois / Année existent déjà, à revoir plutôt qu'à créer)
- [ ] 8.2 **(décision)** Rappels (notifications iOS pour appli web installée, ou Rappels / Raccourcis Apple)

## À vérifier sur l'iPhone d'Ilario (non vérifiable ici)

- [ ] Fluidité de l'assiette (tremblement corrigé ?)
- [ ] Zoom bien bloqué en mode appli
- [ ] Clavier dans les fenêtres plein écran
- [ ] Encoche et barre du bas
- [ ] Sons
