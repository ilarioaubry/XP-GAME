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
- [x] 2.8 (26/10/2026) Oubli de 2.3 : la vue « t » (onglet Quêtes / Projets) et sa barre d'onglets sont toujours construites mais jamais affichées → supprimer → supprimés, avec les onglets fantômes « T » et « B » de la barre du bas
- [x] 2.9 (26/10/2026) Clés de données héritées (13, voir DONNEES.md : boss, bh, cb, cbE, bqDone, bsDone, bsDoneP, pj, pjd, pjf, aiN, sdj, spOn) : **(décision)** les garder, ou les retirer de la sauvegarde par une migration → décision : on les garde
- [x] 2.10 (26/10/2026) « Mode test » : préciser comment on y accède, le garder ou le retirer **(décision)** → décision : on le garde (appui long sur le titre des Réglages)

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
- [ ] 3.11 Donner un rôle à chaque texte (titre de section, titre de carte, texte, petite info, chiffre décoratif, champ) par une classe `ui-`, la taille venant du rôle et non plus d'une règle par élément. Audit du 26/10 : 813 textes, 0 classé ; les titres sont tantôt `h2`, `h3`, `h4`, `b` ou `small`, de 10,8 à 30 px ; « Groupes » existe à 15 et à 20 px. Un test automatique vérifiera ensuite que chaque texte a un rôle et la bonne taille.
- [ ] 3.8 Coins carrés définis dans les composants, plus par une règle universelle avec liste blanche de ronds → à faire avec 3.7 (la règle universelle reste en attendant, elle marche)

## Phase 4 — Scripts

- [x] 4.1 (26/10/2026) `correctifs.js` supprimé : sorti de sa grosse IIFE, puis rangé par zone (`aujourdhui-finitions.js`, `moi-finitions.js`, `proches-finitions.js`, `demarrage.js`). Il reste dans ces fichiers des passes visuelles d'après rendu (`…Viz`, `dress…`) → à fondre dans leurs rendus pendant la refonte écran par écran (3.10, 6.4+)
- [x] 4.2 (26/10/2026) Plus aucune réécriture de fonction globale : les 16 réécritures + les 11 retouches « avant / après » + les 5 minuteurs sont devenues des versions complètes posées à côté de leur origine (`fBase` = le cœur). Doublons de Chez moi et de `renderFiche` supprimés
- [x] 4.3 (26/10/2026) Icônes pixel écrites à la source ; observateurs DOM `pxSwap`, `sqIcons`, recherche d'action et panneau + remplacés par des appels directs. Reste un observateur pour les blocs repliables (`applyFolds`), à revoir avec la refonte
- [x] 4.4 (26/10/2026) Scripts rangés : `js/coeur/` (données, sauvegarde, rendu, icônes, personnage, migrations, démarrage), `js/aujourdhui/` (avec ciel et scène), `js/moi/`, `js/proches/`, `js/donnees/`. Pas de dossiers `decor/` et `ui/` séparés : ce code est encore mêlé aux zones, à séparer pendant la refonte si utile
- [x] 4.5 (26/10/2026) `js/donnees/` : grilles d'icônes (RKI, PXUI, PXSP, PXI, BPX_M), équipement (GEAR, AV_OPT, AV_MAIN), quêtes (FAM, IDQ, IDI, FIC, QC_TPL, BOSS_CAT, DQ_K), contenu (IDS, FILMS, RIT_G, BOSS2). Restent dans le code, car mêlés à des fonctions : icônes des badges (IC), liste des badges (conditions), quêtes pour toi (FQ), aliments de l'assiette
- [x] 4.6 (26/10/2026) Moteur Pixel Clair découpé en 6 fichiers, badges en 3, Chez moi en 3 ; 16 déclarations mortes retirées. Plus gros fichier restant : `aujourdhui-finitions.js` (78 Ko), qui fondra avec la refonte
- [ ] 4.7 **(décision)** Un seul point d'état : déjà le cas (`load()` / `save()`, seule clé `carnet-quetes`) ✔. Modules JavaScript : déconseillé pour l'instant — l'appli est un seul fichier HTML, tout repose sur la portée globale (des centaines de noms à exporter / importer) ; gros risque pour un gain invisible. Proposition : abandonner ou reporter après la refonte
- [x] 4.8 (27/10/2026, réponse : icône d'objet, voir Q.14) Les projets prennent l'apparence de créatures (`BOSS_CAT` : golem, slime…, et `BOSS2`) : héritage des anciens boss. Garder, ou remplacer par une icône d'objet ?

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
- [x] 5.25 (26/10/2026) Boutons sous 44 px (audit du 26/10) : onglets 40, boutons fermer 36–40, puces de choix 34–36, « Annuler » 22, « Hier » 32, titre du personnage 28, barre d'XP 42 → tous à 44 px (audit : plus aucun bouton sous 44)
- [x] 5.26 (26/10/2026) Icônes de la barre du bas à 27 px (standard : 24) → 24 px (l'agrandissement de l'onglet actif est retiré)
- [x] 5.27 (26/10/2026) Confirmations en deux temps au lieu de « suppression immédiate + Annuler » : supprimer un événement, arrêter le minuteur, décocher un rituel terminé, restaurer par texte → suppression immédiate + Annuler partout
- [x] 5.28 (26/10/2026) XP au-dessus du barème : « Son sorti » 150, collection complète 50, rituel ancré 50, livre fini 40, deux quêtes à 40 et une à 45 **(décision)** → décision : on garde ces grosses récompenses
- [x] 5.29 (26/10/2026) Barre d'XP du personnage (Moi) : contour blanc pâle au lieu du modèle (crème 2 px) → 18 px, contour crème 2 px
- [x] 5.30 (26/10/2026) Fiche d'un proche : le cadre (exception voulue) est bleu ; le passer en neutre ? **(décision)** → décision : gris clair ; ma fiche profil retrouve aussi son cadre (neutre), et les auras leur fond (perdu lors d'un ancien épurage)
- [x] 5.31 (26/10/2026) Un texte à 10,8 px dans « Ma situation » (hors échelle) → 11 px
- [x] 5.32 (26/10/2026) Appliquer l'en-tête standard (DESIGN.md § 3) : le « + » de Relations est 10 px plus à gauche que les autres actions ; « Modifier » de Ma fiche est un bouton texte ; « Créer » (groupes, fiche proche) et « Ajouter » aussi → « + » de Relations aligné, « Modifier » de Ma fiche en icône crayon ; « Créer » / « Ajouter » restent : ce sont des boutons de formulaire, pas des actions d'en-tête
- [x] 5.33 (26/10/2026) Écart entre sections : 22 px aujourd'hui, 24 px dans le guide → 24 px
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

- [x] 7.1 (26/10/2026) README : à quoi sert l'appli, installation sur iPhone
- [x] 7.2 (26/10/2026) CHANGELOG (ce qui a changé, quand)
- [x] 7.5 (26/10/2026) Ranger dans le projet les outils de vérification construits pendant la phase 3 (captures de 55 écrans + comparaison au pixel, styles calculés, tri du CSS) → `outils/` + `outils/LISEZMOI.md`
- [x] 7.3 (26/10/2026) Tests de parcours versionnés : `outils/parcours.py` (profil, rituel, assiette, quête, Annuler, minuteur, ajouter un proche, bouton Fond, tous les écrans, maison, recherche d'action, sauvegarde après rechargement, export / restauration, aucune icône au trait, aucune erreur)
- [ ] 7.4 GitHub Actions : build `--check` + tests à chaque envoi

## Phase 8 — Nouvelles fonctionnalités (seulement après, à valider)

- [ ] 8.1 **(décision)** Vue mensuelle et annuelle dans Bilan (correction du 25/10 : des onglets Semaine / Mois / Année existent déjà, à revoir plutôt qu'à créer)
- [ ] 8.3 Rappel d'export régulier (passé en 1.2, à reprendre si besoin)
- [ ] 8.2 **(décision)** Rappels (notifications iOS pour appli web installée, ou Rappels / Raccourcis Apple)

## Refonte des quêtes et bonnes actions (décisions du QCM, 27/10/2026)

Analyse et inventaire : `QUETES.md`. Décisions d'Ilario :

- [x] Q.1 Quêtes pour toi : **3 à 5 par jour, à la même place**, tirées de **mes priorités** (fiche : famille, chez moi, manger). Elles ne lui parlaient pas : les rendre **concrètes et courtes** (tâche précise, 5–15 min) ou **plaisir / envies** (ciné, sorties, jeux, musique)
- [x] Q.2 Idées sortie : **inspiration le week-end**, sans carte à valider — fait 28/10 : carte le samedi et le dimanche, « Je l'ai fait » ouvre Actions › Sortir (durée, « Avec qui ? » : Soi seul, Ami avec quelqu'un)
- [x] Q.3 Quêtes spéciales : carrousel gardé tel quel (rien à faire)
- [x] Q.4 Bonnes actions : Ilario garde 1, 4–10, 12, 14–26 ; **retirer** « Avancer sur le dossier (30 min) », « 1 verre d'eau », « Se coucher avant minuit », « Trajet à pied ou à vélo » (27/10) — fait 28/10 (migration 5) ; « 1 verre d'eau » reste caché derrière le rituel des verres d'eau
- [x] Q.5 Tri : **1 par jour au plus**
- [x] Q.6 XP : **30 max**, sauf grands exploits (livre fini, série finie, sortie loin) jusqu'à 50 — fait 28/10, règle à la validation (`xpRules`), bonus plafonnés à 50 (son sorti, objectif du mois)
- [x] Q.7 Catégories : marche = **Soi** ; lecture = **Soi**, album = **Talent** ; sorties = **Soi**, **Ami si « Avec qui ? »** rempli
- [x] Q.8 Quêtes qui durent (journée sans soda, 1 h sans réseaux, escaliers) : **engagement en début de journée, validation en fin de journée** — fait 28/10 avec les engagements (F.4)
- [x] Q.9 Menu « … » simplifié : **Plus tard + Pas pour moi**
- [x] Q.10 Quêtes travail : gardées (rien à faire)
- [x] Q.11 Force et Talent : **pousser doucement** (1 quête sport et 1 musique par semaine)
- [x] Q.12 Panneau + : **fusionner** « Noter une action » et « Bonnes actions » en un seul endroit (27/10 : les bonnes actions sont dans leur catégorie et dans la recherche)
- [ ] Q.16 Page Actions (analyse du 27/10) : ~~« Avec qui ? » après la durée, seulement pour les proches et les sorties~~ (fait 27/10) · ~~Cuisiner un repas ouvre l'assiette~~ (fait) · ~~icônes 48 px, « Journée sans » non coupé~~ (fait) · ~~accueil « Récents » / « Pour commencer »~~ (fait) · ~~XP de l'action plafonnée à 30~~ (fait, le boost ×2 existant reste) · à confirmer : couleurs (tuile pleine, bordures gauches, décor) et messages empilés
- [x] Q.13 Titres (réponses du 27/10) : « Décortiquer un son de [artiste] » ; films « Regarder [film] » ; « 20 min pour [note] » ; « Rendre un petit service » → une tâche à la place d'une personne avec qui tu vis, nommée (pas proposée si tu vis seul) ; « Trier un réseau : 10 abonnements en moins » ; « Trier 50 photos » (détail en petite info) ; « Préparer : [nom de l'événement] ». **Supprimer** : l'idée sortie « restaurant d'une cuisine jamais goûtée », les étapes « Faire la plus petite / la plus redoutée ». **Inchangés** : setlist, « Lire » (le nombre de pages se note à la validation), « Finir une tâche importante », « Bowling ou billard, la revanche », les versions de « préparer demain »
- [x] Q.14 Projets : créatures remplacées par une **icône d'objet** du thème (règle aussi la question 4.8) — fait 28/10 : création et fin de projet avec l'icône d'objet ; figurines de l'armoire : « Finir le projet « … » » au lieu de « Vaincre »
- [x] Q.15 Corrections de QUETES.md 4.1 (courses, 15 min de sport, durées), doublons fusionnés (une version par action, mêmes titre, XP et catégorie partout) — 28/10 : 4.1.1 à 4.1.5 corrigés, catégories et plafond partout ; 28/10 : une version par action (préparer demain, écrans avant de dormir, marche, étirements, lecture, album, photo à la famille, voir quelqu'un)

## Demandes du 28/10/2026

À régler :
- [x] R.1 Messages (toasts) en bas, juste au-dessus de la barre d'onglets, partout (28/10)
- [x] R.2 « Bonne nuit » (clôture du soir) en fin de liste de la routine du soir
- [x] R.3 Pastilles rouges de nouveauté : montrer le chemin (pastille sur Moi, puis sur Chez moi, puis sur la catégorie, puis sur l'objet)
- [x] R.4 L'assiette dans « Bonne nuit » (le dîner se remplit dans l'assiette)
- [x] R.5 « Journée sans… » : à la fin de « Bonne nuit », plus dans les actions
- [x] R.6 Un titre à la section des rituels : « Rituels du matin » / « Rituels du soir » (28/10)

Fonctionnalités (à proposer avant de construire) :
- [x] F.1 Finir un contrat donne des points de Travail : au dernier jour (14/14), une coche à toucher, +50 XP Travail, puis la jauge disparaît (28/10)
- [x] F.2 Bilan de journée à la place des messages qui s'empilent (l'expérience globale de la journée) : à la fin de Bonne nuit, écran « Ta journée » ; les messages « en passant » y sont gardés, les niveaux s'affichent aussi sur le moment (28/10)
- [x] F.3 To-do dans le + : Hier (journaliser), Aujourd'hui (engagement ou fait), Demain (s'affiche sur l'accueil du lendemain) ; tâche libre 5 XP ; ce qui n'est pas fait est proposé dans Bonne nuit (Demain / Retirer) (28/10)
- [x] F.4 Créer ses engagements (ex. journée sans cigarette, ou moins de N), lié à Q.8 : carte le matin (jusqu'à midi, 3 au plus, « Moins de N cigarettes » avec −/+, les tiens écrits), validés dans Bonne nuit, +15 XP chacun tenu (28/10)

## Journal de bord (demande du 28/10/2026)

- [x] J.1 Rassembler en une section « Ma journée » : cigarettes, engagements, à faire, rituels, repas, contrat (engagement sur sa durée), énergie, sommeil, Bonne nuit, routine, agenda du jour. Pistes A à G proposées ; **D, la liste du carnet**, choisie et faite le 28/10 (Ce matin / Mes engagements / Plus tard aujourd'hui). Reste : retirer le code des anciens blocs (rituels en tuiles, rangée des repas, énergie, à faire, fin de journée, rattrapage), aujourd'hui masqués et encore utilisés en coulisse
- [x] J.3 Rituels plus visuels dans le journal (30/10) : pistes A, B, C refusées ; fait : même structure, icônes sur tuiles pixel à la couleur du rituel, ligne teintée, case à cocher pixel
- [x] J.4 Cases majeures du journal (30/10) : même taille que les autres lignes, aspect pixel art (ciel étoilé pour Ta nuit et Bonne nuit, trois batteries pixel rouge → vert pour l'énergie, une case par jour pour le contrat)
- [ ] J.5 Rituels et routine satisfaisants (analyse du 30/10) : la ligne cochée reste à sa place, « +3 XP » qui vole vers la barre, « Annuler » dans la ligne, moment bouclé ; routine avec étape en cours en grand, pile des faits, barre en étapes, fin fêtée (propositions à valider)
- [ ] J.2 Enchaînements de rituels (douche → barbe) ~~fait 28/10~~, dents proposées à la fin d'un repas (à faire), compteur de cigarettes dans l'engagement lié ~~fait 28/10~~

## Idées utiles (proposées le 28/10/2026, à choisir)

- [ ] U.1 Liste de courses tirée de l'assiette et des recettes (ce qui revient souvent, ce qui manque : légumes…), cochée en magasin
- [ ] U.2 « Je mange quoi ? » : 3 idées de repas depuis tes recettes, ce que tu as mangé cette semaine et ce qui manque
- [ ] U.3 Cigarettes : courbe de la semaine, argent économisé, bouton « envie » (3 min pour la laisser passer)
- [ ] U.4 Heure de coucher conseillée selon le réveil de demain (calendrier, travail) dans Ce soir
- [ ] U.5 Suivi des candidatures et contrats : envoyée, relance à J+7, entretien, réponse ; prochain contrat à trouver
- [ ] U.6 Carnet de sons : idée rapide (phrase, vocal), étapes maquette → mix → sortie, tracklist
- [ ] U.7 Capture rapide : noter une idée en 2 s, triée plus tard (à faire, courses, son, note)
- [ ] U.8 Proches : idées cadeaux notées au fil de l'eau, rappel à J-7 de l'anniversaire avec ces idées
- [ ] U.9 Maison : ce qui revient (draps, frigo, plantes) proposé tout seul quand c'est le moment, d'après « La dernière fois que… »
- [ ] U.10 Dimanche soir : bilan de la semaine et 3 choses à prévoir pour la suivante
- [ ] U.11 Rendez-vous et rappels vers le calendrier de l'iPhone (fichier .ics), puisque l'appli web ne peut pas sonner seule
- [ ] U.12 Visites d'appart : notes par critère (prix, quartier, lumière, bruit) et comparaison

## Appli plus intelligente (analyse du 28/10/2026, à choisir)

- [ ] I.1 Journal trié par l'heure où tu fais vraiment chaque chose (heures apprises), et une ligne « Maintenant » en tête
- [ ] I.2 Engagements proposés d'après ce que tu tiens (ex. « moins de N » = ta moyenne − 1)
- [ ] I.3 Journée allégée toute seule : nuit courte, humeur basse la veille, jour chargé au calendrier → moins de quêtes, plus douces
- [ ] I.4 À faire reporté 3 fois → proposer de le découper, de le mettre en projet ou de le retirer
- [ ] I.5 Repas : l'équilibre de la semaine (assiette) oriente les idées de repas et les quêtes nourriture
- [ ] I.6 Proches : rythme naturel de chaque personne appris → rappel quand il est dépassé
- [ ] I.7 « Ce que j'ai appris de ta semaine » dans Bilan (sommeil ↔ rituels, cigarettes ↔ travail ou humeur…), en phrases simples
- [ ] I.8 Ce qui n'est jamais utilisé depuis 30 jours : proposé au retrait (rituel, bonne action, famille de quêtes)
- [ ] I.9 Chaque proposition dit pourquoi en petite info (« tu le fais souvent le jeudi »)

## Ma vie → actions adaptées (idée du 28/10/2026, à choisir)

- [x] V.1 Nouvelle question dans « Ma situation » : « Chez moi, j'ai… » (chien, chat, petit animal, plantes, jardin, voiture, vélo, lave-vaisselle, bébé ou enfant à garder…) en tuiles pixel
- [x] V.2 Chaque réponse ajoute ses actions (panneau +), ses rituels proposés, ses quêtes et ses rappels à rythme — fait 30/10 : animaux (chien, chat, petit animal), maison (plantes, jardin, lave-vaisselle), transport (voiture, vélo, transports en commun), santé (lentilles, traitement, végé, sans gluten), famille (enfant à garder), activité (club, instrument) ; reste : jours de garde partagée, régime appliqué à l'assiette
- [ ] V.3 L'appli le déduit aussi : si tu notes souvent « sortir le chien », elle propose de l'ajouter à ta fiche
- [ ] V.4 Autres faits utiles : lunettes ou lentilles, traitement à prendre, régime (végé, sans gluten), sport pratiqué en club, instrument, études (examens), jours de garde partagée

## Fait à la demande (hors phases)

- [x] (27/10/2026) Assiette = seule porte pour ce qu'on mange : quêtes nourriture reliées (objectif dans l'assiette, « Cuisiné maison », « Nouvelle recette »), bonnes actions en doublon retirées, plus de quête d'assiette quand les repas sont notés

## Corrigé en passant

- [x] (26/10/2026) La famille était remise à la liste d'origine à chaque chargement (`load()` ignorait `family`) : un proche ajouté à la famille disparaissait. Corrigé, trouvé par les tests de parcours

## À vérifier sur l'iPhone d'Ilario (non vérifiable ici)

- [ ] Fluidité de l'assiette (tremblement corrigé ?)
- [ ] Zoom bien bloqué en mode appli
- [ ] Clavier dans les fenêtres plein écran
- [ ] Encoche et barre du bas
- [ ] Sons
