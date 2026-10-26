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

## Suite réorganisée (26/10/2026)

Bilan : phases 0, 1, 2, 5 faites ; phase 3 faite sauf le nettoyage fin (3.7, 3.8, 3.10). Ordre retenu pour la suite :

1. **Finitions rapides** : 2.8 (vue « t »), 7.5 (outils dans le projet), 7.1 README, 7.2 CHANGELOG, et les décisions courtes 2.9 / 2.10.
2. **Vérifications sur l'iPhone** (liste en bas) : avant de toucher à l'organisation des écrans.
3. **Décisions de la phase 6** (6.1 phrase du cœur, 6.2 rôle du jeu, 6.3 version 1, 6.12 décor animé) : une conversation, pas de code.
4. **Refonte écran par écran** selon ces décisions (6.4 à 6.13), en passant chaque écran sur les composants `ui-` : ça règle au passage 3.7, 3.8 et 3.10. Ordre : Aujourd'hui → Moi → Proches → fenêtres.
5. **Sécurité du projet** : 7.3 tests automatiques, 7.4 vérification à chaque mise en ligne.
6. **Phase 4** (scripts), protégée par les tests.
7. **Phase 8** (nouveautés), seulement si tu le décides.

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
- [ ] 2.8 Oubli de 2.3 : la vue « t » (onglet Quêtes / Projets) et sa barre d'onglets sont toujours construites mais jamais affichées → supprimer
- [ ] 2.9 Clés de données héritées (13, voir DONNEES.md : boss, bh, cb, cbE, bqDone, bsDone, bsDoneP, pj, pjd, pjf, aiN, sdj, spOn) : **(décision)** les garder, ou les retirer de la sauvegarde par une migration
- [ ] 2.10 « Mode test » : préciser comment on y accède, le garder ou le retirer **(décision)**

## Phase 3 — Composants et fusion des CSS (écran par écran, Aujourd'hui d'abord)

- [x] 3.1 (25/10/2026) Variables uniques : couleurs (`--gold`…), tailles de texte (`--t-card`…), espacements (`--sp-2`…)
- [x] 3.2 (25/10/2026) Composants définis une fois (`css/composants.css`, préfixe `ui-`, pas encore utilisés) : bouton (3 variantes), carte d'action, tuile, titre de section, barre, étiquette, compteur, fenêtre courte, fenêtre plein écran, état vide
- [x] 3.3 (26/10/2026) Une feuille par zone : `aujourdhui-haut`, `aujourdhui`, `proches`, `moi`, `fenetres` (rangement automatique d'après les classes réellement présentes dans chaque zone ; rendu identique au pixel sur 55 écrans)
  - [x] 3.3a (25/10/2026) haut d'Aujourd'hui → `css/aujourdhui-haut.css` : 235 règles sorties des couches, 35 sans effet supprimées, 0 `!important`, 0 hack ; rendu identique au pixel (midi, nuit, matin, pluie, décembre)
- [x] 3.4 (26/10/2026) Proches → `proches.css`
- [x] 3.5 (26/10/2026) Moi → `moi.css`
- [x] 3.6 (26/10/2026) Fenêtres → `fenetres.css` ; les 27 anciennes couches (principal, épure, maison…) fusionnées dans `base.css` dans leur ordre ; en-tête de page remis dans <head>
- [ ] 3.7 Supprimer les `!important` et les hacks `html:not(#_a)…` : fait pour `aujourdhui-haut.css` (0) ; ailleurs le retrait en bloc change le rendu (les feuilles se battent entre elles) → à faire écran par écran pendant la phase 5, quand on retouche le visuel. Reste ≈ 1 800 `!important`
- [x] 3.9 (26/10/2026) Supprimer le CSS des fonctionnalités retirées (328 règles et 355 sélecteurs dont les classes n'existent plus dans le code)
- [ ] 3.10 Les écrans n'utilisent pas encore les composants `ui-` (créés en 3.2) : à faire écran par écran, avec 3.7 et 3.8
- [ ] 3.8 Coins carrés définis dans les composants, plus par une règle universelle avec liste blanche de ronds → à faire avec 3.7 (la règle universelle reste en attendant, elle marche)

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
- [x] 5.1 (26/10/2026) Centrage : centré pour bouton, tuile, compteur ; aligné à gauche pour les cartes avec description → cartes de quêtes (pour toi, spéciales) alignées à gauche
- [x] 5.2 (25/10/2026, choix C) État « à faire maintenant » : aucun signal pour l'instant ; « bordure colorée = actif / sélectionné » reste la seule règle
- [x] 5.3 (26/10/2026) Textes longs : titres de carte 2 lignes max ; noms dans les listes 1 ligne avec « … » → quêtes pour toi : titre sur 2 lignes
- [x] 5.4 (26/10/2026) 11 px seulement sur fond sombre, sinon 13 px → Énergie du matin et « meilleur jour » passés à 13 px ; règle écrite dans CLAUDE.md
- [x] 5.5 (26/10/2026) Un seul séparateur (pointillés) pour tous les groupes, Proches et Bilan compris (sauf fiches de proches) → Proches : bandeaux pleins Famille / Amis remplacés par titre + pointillés à leur couleur
- [x] 5.6 (26/10/2026) Icônes en 3 tailles : 16, 32, 48 px (multiples de la grille, pixels nets) **(décision)** : aujourd'hui 15, 16, 18, 22, 24, 26, 27 px. Les icônes d'interface sont dessinées sur une grille de 12 : nettes à 12, 24 ou 36 px, floues à 16 ou 32 → proposition : interface 24 px, contenu 16 / 32 / 48 px → décision : interface 24 px, contenu 48 px (exceptions : étoiles de rareté, petites icônes dans les recettes et le récap d'assiette)
- [x] 5.7 (26/10/2026) Rareté : étoiles + mot de la rareté dans la fiche détaillée → déjà le cas : le mot de rareté s'affiche à l'ouverture du coffre
- [x] 5.8 (26/10/2026) Toute action par appui long existe aussi dans le menu « … » → vérifié : rituels (Atelier), compteur (Ma vie) ont un autre chemin ; seul le rythme des actions de « Cette semaine » reste en appui long

Points d'uniformité restants :
- [x] 5.9 (26/10/2026) Fond des cartes : un seul fond partout → cartes du moment au même fond que les autres ; les quêtes gardent la teinte de leur catégorie (couleur = catégorie)
- [x] 5.10 (26/10/2026) Avatars des proches : un seul format (carré pixel, initiale si pas de photo) → déjà le cas : carrés pixel avec initiale
- [x] 5.11 (26/10/2026) Titres de Bilan (« CHAPITRE EN COURS ») au modèle des titres de section → « Chapitre en cours » et « Données » au modèle des titres de section
- [x] 5.12 (26/10/2026) Restes : pastilles « 0/10+5 », libellé « Goûter » grisé, tuile « Routine » de taille différente → « Goûter » plus grisé, tuile « Routine » au même fond, « 0/10 +5 » séparé en compteur + bouton « +5 »
- [x] 5.13 (26/10/2026) Menus contextuels encore en survol / positionnés au doigt → petite fenêtre centrée → menus déjà centrés ; effets de survol limités aux appareils qui en ont (collaient sur iPhone)
- [x] 5.14 (26/10/2026) Revérifier les fenêtres rarement ouvertes après le passage à l'échelle de texte → vérifiées : météo, situation, projet, cadeau, retour après absence, coffre, assiette ; atelier des rituels non capturé
- [x] 5.19 (26/10/2026) Carte « Ta semaine est finie » : cadre jaune et cadre autour du graphique (contraire à « pas d'encadrés »), repérée le 25/10 → plus de cadre jaune ni de cadre autour du graphique
- [x] 5.20 Salut « Bonsoir, Ilar » : pas un bug, c'est le prénom choisi (25/10/2026)
- [x] 5.21 (26/10/2026) Fenêtre Météo : en bas d'écran alors qu'on y tape une ville (standard : plein écran) ; lignes Aujourd'hui / Demain encadrées → plein écran quand on tape une ville ; lignes Aujourd'hui / Demain sans cadre
- [x] 5.22 (26/10/2026) Carte « Saison des fêtes » (décembre) : cadre et bordures rouges à gauche (contraire à « pas d'encadrés » et « bordure colorée = actif ») → plus de cadre rouge ni de bordures à gauche
- [x] 5.23 (26/10/2026) Bonnes actions : le choix d'XP va jusqu'à 50 et 100 (contraire à « pas de bonus géants » ; barème 2–30) → choix : 2, 5, 10, 15, 20, 30 (les actions existantes gardent leur XP)
- [x] 5.24 (26/10/2026) Aura « Notes de musique » (armoire) dessinée avec des caractères ♪ ♫ au lieu de pixels → redessinées en pixels
- [ ] 5.25 Boutons sous 44 px (audit du 26/10) : onglets 40, boutons fermer 36–40, puces de choix 34–36, « Annuler » 22, « Hier » 32, titre du personnage 28, barre d'XP 42
- [ ] 5.26 Icônes de la barre du bas à 27 px (standard : 24)
- [ ] 5.27 Confirmations en deux temps au lieu de « suppression immédiate + Annuler » : supprimer un événement, arrêter le minuteur, décocher un rituel terminé, restaurer par texte
- [ ] 5.28 XP au-dessus du barème : « Son sorti » 150, collection complète 50, rituel ancré 50, livre fini 40, deux quêtes à 40 et une à 45 **(décision)**
- [ ] 5.29 Barre d'XP du personnage (Moi) : contour blanc pâle au lieu du modèle (crème 2 px)
- [ ] 5.30 Fiche d'un proche : le cadre (exception voulue) est bleu ; le passer en neutre ? **(décision)**
- [ ] 5.31 Un texte à 10,8 px dans « Ma situation » (hors échelle)
- [x] 5.15 (26/10/2026) Carrousel des quêtes spéciales avec une seule carte : même taille de carte → déjà le cas : la carte seule a la même largeur

Lisibilité :
- [x] 5.16 (26/10/2026) Voile sombre sous le contenu, ou ciel limité à un bandeau en haut **(décision)** → choix A : voile sombre plus marqué sous le contenu, le haut (scène) reste clair
- [x] 5.17 (26/10/2026) Libellés de stats (Force, Talent…) lisibles (fond sombre) → libellés en crème avec un petit carré de la couleur de la stat

- [x] 5.18 (26/10/2026) Intégrer les standards précisés dans CLAUDE.md

## Phase 6 — Interface et utilisation

- [ ] 6.1 **(décision)** Phrase du cœur de l'appli (ex. « Prendre soin de moi et de mes proches, un jour à la fois »)
- [ ] 6.2 **(décision)** Rôle du jeu : récompense discrète ou moteur ? (XP, niveaux, armoire, badges, stats)
- [ ] 6.3 **(décision)** Définir la version 1 stable (ce qui est « terminé »)
- [ ] 6.4 Aujourd'hui en ordre fixe : prochaine action → la journée (repas + assiette, rituels, quêtes du jour) → quêtes spéciales ; le décoratif part dans Moi > Profil
- [ ] 6.5 Mettre en avant la prochaine action (« qu'est-ce que je fais maintenant ? »)
- [ ] 6.6 Le jeu apparaît à la validation (+XP, petite animation) et dans Profil, pas en bloc dans Aujourd'hui
- [ ] 6.7 Réorganiser Moi en gardant Bilan et Chez moi (Ilario y tient, 25/10) : où mettre Profil et Réglages ? (réglages : rituels, sauvegarde, sons, aide)
- [ ] 6.8 Un seul chemin principal par action (repas : tuile / assiette / quête ; quête : bouton / « … » / appui long)
- [ ] 6.9 Page « Aide » courte pour les gestes
- [ ] 6.10 Proches triés par temps depuis le dernier contact **(décision)**
- [ ] 6.12 Décor animé (ciel, scène) : il bouge tout seul alors que le standard dit « rien qui bouge tout seul », et c'est ce qui coûte le plus en batterie **(décision)** : garder, calmer, ou désactiver par défaut
- [ ] 6.13 Seul le rythme des actions de « Cette semaine » reste accessible uniquement par appui long (reste de 5.8) → l'ajouter au menu « … »
- [ ] 6.11 Stats de personnage → résumé concret (« ce mois-ci : 12 repas équilibrés, 4 sorties ») **(décision)**

## Phase 7 — Organisation du projet

- [ ] 7.1 README : à quoi sert l'appli, installation sur iPhone
- [ ] 7.2 CHANGELOG (ce qui a changé, quand)
- [ ] 7.5 Ranger dans le projet les outils de vérification construits pendant la phase 3 (captures de 55 écrans + comparaison au pixel, styles calculés, tri du CSS)
- [ ] 7.3 5 à 10 tests Playwright versionnés (valider un repas, une quête, annuler, assiette, sauvegarde…)
- [ ] 7.4 GitHub Actions : build `--check` + tests à chaque envoi

## Phase 8 — Nouvelles fonctionnalités (seulement après, à valider)

- [ ] 8.1 **(décision)** Vue mensuelle et annuelle dans Bilan (correction du 25/10 : des onglets Semaine / Mois / Année existent déjà, à revoir plutôt qu'à créer)
- [ ] 8.3 Rappel d'export régulier (passé en 1.2, à reprendre si besoin)
- [ ] 8.2 **(décision)** Rappels (notifications iOS pour appli web installée, ou Rappels / Raccourcis Apple)

## À vérifier sur l'iPhone d'Ilario (non vérifiable ici)

- [ ] Fluidité de l'assiette (tremblement corrigé ?)
- [ ] Zoom bien bloqué en mode appli
- [ ] Clavier dans les fenêtres plein écran
- [ ] Encoche et barre du bas
- [ ] Sons
