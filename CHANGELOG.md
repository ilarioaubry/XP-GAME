# Journal des versions

Le numéro de version affiché dans Moi > Bilan > Données est une empreinte du contenu : il change à chaque mise en ligne.

## 03/11/2026
- Le jeu (4.1, choix B + C) : plus de hasard sans action. L'Heure d'or (XP ×2 pendant 1 h, tirée au hasard certains matins) est retirée ; un jour rare donne seulement une quête secrète, qu'il faut faire pour de vrai. Les coffres restent, et ils ne viennent que d'une action : passer un niveau, finir tous les rituels d'un moment, finir un projet. Les restes du jour légendaire et du coffre doré (plus tirés depuis longtemps) sont retirés du code. Tes coffres déjà gagnés et tes données ne changent pas.

## 02/11/2026
- Proches (3.7) : CSS de Proches rangé. 38 règles qui ne servaient qu'à Proches quittent base.css pour proches.css ; 162 règles perdent leurs `!important` et leurs sélecteurs forcés (proches.css : 357 → 157 `!important`, 515 → 213 forçages). Rien ne change à l'écran : 0 écart de style mesuré sur 88 écrans (Aujourd'hui, Moi, Proches, fenêtres, à 13 h et 21 h 30, avec ta sauvegarde).
- Proches (3.6) : quand vous avez fait trois fois quelque chose qui va avec un univers (rando → Nature, ciné → Cinéphile…), la fiche en lecture le propose en haut de « À savoir » (« Nature ? 3 fois ensemble ces derniers mois ») : ✓ l'ajoute, ✕ ne le propose plus. Idées cadeau : on peut en noter plusieurs (Modifier > Idées cadeau, × pour en retirer une) ; elles s'affichent sous la date d'anniversaire sur la fiche et dans la carte d'anniversaire d'Aujourd'hui (« Idées : un vinyle · un livre »). La carte postale n'est pas faite (retirée).
- Proches (3.4) : la page d'un groupe s'ouvre en lecture, comme la fiche d'un proche : nom, « Vus il y a 16 jours », nombre de membres, photo de classe (toucher quelqu'un ouvre sa fiche), actions et un historique en clair (« Vus », « Appel · avec Lola, Josh »…). Le crayon (Modifier) donne le nom, les membres, la couleur et la suppression ; « Terminé » revient à la lecture. Plus de cadre de couleur autour du groupe ni de la photo : la couleur reste dans le fond et le mot « Groupe ». Nouveau : « Prévoir la prochaine sortie » (date et quoi, en plein écran) ; la sortie s'affiche sur la page (« Samedi 7 novembre · Bowling »), se modifie ou se retire en la touchant, et disparaît quand on valide « Les voir » ce jour-là. Pas d'XP pour la prévoir.
- Proches (3.3) : un champ « Chercher un proche » au-dessus de Famille (à partir de 8 proches) filtre Famille et Amis pendant qu'on tape, sans tenir compte des accents ; « Aucun proche ne s'appelle comme ça. » si rien ne correspond. Bordures neutres : les cartes de groupe et le contour des avatars de la liste ne prennent plus de couleur. Ami et Membre du mois restent comme avant, sans légende pour le cercle des jours.
- Proches (3.1) : la fiche d'un proche s'ouvre en lecture. On y voit la relation une seule fois (l'étiquette sous le nom ; « Ami proche » retiré), le niveau de lien, l'anniversaire s'il est noté, « Vus il y a 4 jours » en clair (seul, en groupe ou via « Avec qui ? »), avec en dessous les dernières nouvelles et le rappel s'il y en a un. Puis les actions, « À savoir » (univers, talents, groupes, idée cadeau) et un historique qui dit ce qui a été fait : « Vus avec MégaPotes · 24 oct · +40 XP », « Appel », « Vus en vrai · 4 oct · 4 fois »… Tout se change via le bouton crayon (Modifier) : relation, univers, talents, groupes, idée cadeau, anniversaire, rappel, fond, avatar, suppression ; « Terminé » revient à la lecture.
- iPhone : zones qui restaient vides en passant d'une page à l'autre, et boutons qui ne répondaient pas toujours. Cause la plus probable : l'appli faisait défiler le corps de la page à l'intérieur d'une page bloquée, un montage que Safari dessine et touche mal (morceaux d'écran pas redessinés, touchers qui tombent à côté après un changement). C'est maintenant la page entière qui défile, comme un site normal ; rien ne change à l'écran. En plus, les classes d'animation des changements d'onglet ne peuvent plus rester collées (filet de sécurité).
- Moi (2.8) : CSS de Moi rangé. 215 règles qui ne servaient qu'à Moi quittent base.css et composants.css pour moi.css ; 680 règles de moi.css perdent leurs `!important` et leurs sélecteurs forcés (moi.css : 650 → 273 `!important`, 1 305 → 488 forçages, alors qu'elle a reçu les 215 règles). Les règles qui restent forcées sont celles qui se battent encore avec base.css ; elles partiront avec le nettoyage de base.css (6.4). Vérifié : styles calculés sur 31 écrans de Moi à 4 moments, images identiques sur 15 écrans à 3 moments (seul le numéro de version change), 55 captures. « La dernière fois que… » : créer ou modifier un rappel ouvre maintenant une fenêtre plein écran (Quoi, rythme, dernière fois ; suggestions ; poubelle avec Annuler).
- Ma fiche (2.7) : trois nouveaux champs dans « Modifier » : mon anniversaire (jour, mois, année), mon cœur (célibataire, en couple, fiancé·e, pacsé·e, marié·e), puis avec qui (un de tes amis, même s'il ne vit pas avec toi) et notre anniversaire (ou notre mariage). La fiche les montre en deux puces (gâteau, cœur) ; le Calendrier affiche « Toi » et « Vous deux » dans les 30 jours qui précèdent, sans XP pour l'instant (les quêtes de ces jours-là viendront avec le lot 5).
- Ma vie (2.6) : trois réglages cachés reviennent. Mon rythme (heure de réveil, jours et heures de travail), Ma capacité (nombre de quêtes du jour, jour normal et jour de travail, de 1 à 8 ; ta valeur enregistrée est enfin sélectionnée) et « La dernière fois que… » (créer, modifier, supprimer un rappel comme « Coiffeur » ; bouton + en icône). Les choix sélectionnés sont en or. Retirés du code : les réglages cachés « Limite par jour » et « Bonus par moment terminé (XP / €) » ; leurs valeurs restent dans la sauvegarde et la règle continue de s'appliquer (3 fois par jour, bonus de 30 XP).
- Ma vie (2.5) : « Ce que je surveille » n'a plus qu'un réglage par suivi, la tuile (Cigarettes, Mes périodes : Suivi / Off) ; les interrupteurs en double sont retirés. « Ce que tu deviens » écrit le nom en grand (Lecteur, Ami présent) et l'étape en petit au-dessus. Mes projets : plus de « · arc » sous le nom de catégorie ; « Arc lancé … chapitres » devient « Projet lancé … étapes » ; « boss final » devient « dernière étape » dans les quêtes du jour.
- Moi (2.4) : les jauges portent les mêmes noms que le panneau Actions : Force → Sport, Talent → Créer, Ami → Amis (aussi dans les badges « … 5 », les messages de niveau, l'armoire et la création de quête). La Nourriture a maintenant sa jauge sur la fiche profil (8 jauges) ; elle ne change pas la catégorie phare du portrait. Données inchangées.
- Bilan (2.3) : en haut, « jours de suite » et « coffres ouverts » laissent la place à ce qui a été fait, pour la période choisie : « Cette semaine, en vrai », « Ce mois-ci, en vrai », « Cette année, en vrai » (ou la semaine, le mois, l'année affichés quand on remonte le temps). Proches vus, livres, films, sport, sorties, pièces rangées ; « Rien de noté pour l'instant. » sinon.
- Chez moi : en ouvrant une pièce (Chambre…), son en-tête (nom, maison, flèches) passait sous les onglets collés en haut, on ne voyait plus comment revenir. L'écran remonte maintenant en haut de Chez moi.
- Moi (2.2) : la grande fiche profil n'apparaît plus qu'à Ma vie, sous les onglets ; Chez moi et Bilan commencent directement. Les onglets restent en haut de Moi. La barre d'XP d'Aujourd'hui ouvre Ma vie.
- Moi (2.0) : le réglage « Style de l'appli » (Ciel / Classique) est retiré ; « Classique » revenait de toute façon tout seul à « Ciel ». L'appli garde toujours le ciel. La donnée reste dans la sauvegarde.
- Moi > Bilan > Données (2.1) : la jauge de stockage montre la vraie place prise sur le téléphone (tout ce que l'appli enregistre, 2 octets par caractère) sur la vraie limite de Safari, 5 Mo, au lieu de « / 256 Ko ». Aujourd'hui : 249 Ko sur 5 Mo.
- CSS d'Aujourd'hui (1.6) : les feuilles d'Aujourd'hui n'ont plus aucun `!important` ni sélecteur forcé `:not(#_…)` (avant : 330 `!important`, 750 forçages). 30 règles qui ne servaient qu'à Aujourd'hui quittent base.css et composants.css ; quelques règles anciennes de base.css sont resserrées pour ne plus viser les éléments d'Aujourd'hui. Vérifié élément par élément (styles calculés identiques, 14 heures et dates, avec et sans fenêtres) et sur les 55 captures. Deux retouches voulues : « + Rituel » prend le style des boutons d'ajout (pointillés) et « Bonne nuit » celui des boutons principaux (jaune plein, comme « Fait »). Nouveaux outils : `outils/styles.py` et `outils/styles_diff.py`.
- Nettoyage (1.5b) : les derniers anciens blocs cachés d'Aujourd'hui sont supprimés : l'ancien bloc des rituels (tuiles, rangée de repas, bilan repas, barres d'eau et de repas, fin de moment), le bloc Rattrapage, le bouton caché du panneau Actions et l'ancienne liste des rituels. Le journal appelle directement le rattrapage (Fait / Non) et le « + » ouvre le panneau sans passer par un bouton caché. Les quêtes spéciales, le bonus « Matinée / Journée terminée » et l'enregistrement automatique du bilan repas restent. Environ 340 règles CSS mortes en moins. Rien ne change à l'écran.
- Création du profil (premier lancement) : sur iPhone, le ✓ pour ajouter un ami ou un proche ne fermait plus le clavier sans rien ajouter ; un prénom tapé mais pas validé est ajouté quand on quitte le champ ; champs à 16 px (pas de zoom).

## 01/11/2026
- Nettoyage : 5 anciens blocs d'Aujourd'hui, invisibles depuis le journal, supprimés (HTML, rendu, CSS) : Fin de journée, Énergie du matin (ancienne carte), À faire (ancienne liste), Défi à deux (bloc vide) et Cette semaine. Le module « Énergie du matin » et le module « Rattrapage » de Mes modules s'appliquent maintenant aux lignes du journal. Rien ne change à l'écran.
- Aujourd'hui : noms clarifiés. Les quêtes s'appellent « Quêtes du jour », le journal du bas « Fait aujourd'hui » ; les boutons d'ajout disent ce qu'ils ajoutent (« + Rituel », « + Engagement »), le « + » flottant reste celui des actions.
- Objectif du jour retiré (il était déjà invisible) : son calcul, son message, le badge « Objectif tenu » et l'ancienne frise de la journée sont supprimés du code. Les données restent dans la sauvegarde.
- Aujourd'hui : un repas pas noté se replie dans « Repas à noter » dès que le repas suivant commence (plus de petit-déj à cocher à 21 h) ; le titre suit le moment affiché : Ce matin, Ce midi, Cet après-midi, Ce soir, Cette nuit.
- Aujourd'hui : une seule carte quand un contrat se termine (en haut d'Aujourd'hui, plus dans Moi) ; répondre à « Ta situation a changé ? » clôt le contrat et donne les +50 XP Travail. Nouvelle section « Mes suivis » sous Mes engagements : cigarettes (hors engagement), cafés et contrat en cours ; Mes engagements ne garde que les engagements du jour.
- Aujourd'hui : un bouton « + » à droite du titre de la liste (Ce matin / Ce soir) ouvre la création d'un rituel pour ce moment.
- Aujourd'hui : toucher le nom d'un rituel dans la liste ouvre directement ses réglages (nom, icône, moment, rythme, pause, suppression) ; la case à droite sert toujours à cocher.
- Panneau + : une catégorie montre directement toutes ses options, rangées sous le nom de leur famille (un toucher de moins) ; options sur 2 colonnes, noms en entier, sans l'icône répétée de la famille.
- Panneau + : durée et « Avec qui ? » sur le même écran, bouton « Fait · +N XP » ; l'XP s'affiche sous chaque durée et quantité.
- Panneau + : « Sport » et « Loisirs » (au lieu de Force et Divertissement), icône dossier pour Travail, bordure or sur la catégorie choisie, plus de bande orange en bas.
- « Période terminée, ta situation a changé ? » : les 4 choix tiennent dans la largeur (le 4e sortait de l'écran), carte standard sans cadre doré, icônes alignées.
- Journal : chaque repas a un fond flouté qui montre son moment (aube pour le petit-déj, ciel bleu pour le déjeuner, fin d'après-midi pour le goûter, soir étoilé et lune pour le dîner).
- Assiette : aliments en rangées qui glissent, une par ligne (pain → classiques → atypiques ; viande et œuf → végétal → de la mer). Nouveaux : frites, sandwich, saumon, falafel, ail ; sauces césar et curry coco ; « Crème fraîche ».
- Après l'assiette : dessert (glace, yaourt, fruit, chocolat), où (maison, restaurant, fast-food, sur le pouce). Cuisiné maison → « Cuisiné pour qui ? » : +5 XP Ami ou Famille et du lien.
- Types d'assiette : bord or (équilibrée), vert (végétarienne), orange (fast-food), avec l'étiquette sous l'assiette. Badges Végétarien, Chef cuisinier (cuisiné maison), Sur le pouce.
- J'ai… > Alimentation : végétarien, vegan, halal, sans gluten, sans lactose ; l'assiette masque ce qui ne va pas.
- Cafés : compteur − / + dans Mes engagements, comme les cigarettes (sans XP), repris dans « Ta journée ».
- Assiette : les rangées ne défilent plus de haut en bas ; avatars visibles dans « Cuisiné pour qui ? ».
- Panneau + : Grignotage (sans XP, règle « Sans grignotage ») et Recevoir chez moi (apéro, repas, soirée jeux).

## 31/10/2026
- Mon personnage reste visible sur la scène (il disparaissait entre deux actions).
- « Ma situation » ouvre Ma fiche en modification : un seul formulaire. Ma fiche reçoit le temps libre, « ce qui ne me concerne pas » et les artistes (puces avec une croix, ajout direct).
- Rituels : un rituel fait disparaît de la liste (le compteur du titre le compte) ; « Annuler » le fait revenir.
- Badge Introspection (humeur 30 j) : deux yeux identiques.
- Panneau + : plus de rouge « en retard » ; une petite info « il y a N j » sous les options pas faites depuis longtemps.
- Idée de sortie : bouton « Fait » en jaune ; « une autre idée » garde l'icône en bas à droite.
- Ma fiche (édition) : plus rien ne déborde à droite ; « J'ai… » en tuiles rectangulaires avec le nom sur une ligne ; poisson recentré.
- Ma situation : retirer un artiste ou toucher une puce ne renvoie plus en haut.
- Profil d'un proche : XP centrée dans sa barre, statut au-dessus de la barre, un seul voile flouté derrière toute la fiche (plus de cadres), cases du rappel pleines, « Nouvelles », « Vit avec moi » retiré (se règle dans Ma vie), univers et talents en icônes seules plus grandes (avion pour Voyageur, nouvelle icône Danse).
- Page d'un groupe : nom en grand sans pointillés, petite croix pour retirer un membre.
- Journal : « Annuler » devient une icône retour pixel.
- Quête spéciale « Voir quelqu'un en vrai » : même fond et même icône en bas à droite que les autres.
- Armoire : l'objet porté est surligné en jaune, sans coche.
- Assiette : plus de barre de défilement visible.

## 30/10/2026
- Rituels : un rituel coché glisse et se replie, puis se range dans « N faits » en bas de la liste (à déplier pour le retrouver, ou « Annuler » en bas). La barre d'XP brille un instant et le compteur du titre rebondit. Tout est coupé avec « réduire les animations ».
- Cases majeures du journal en pixel art, même taille : Ta nuit et Bonne nuit sur un ciel étoilé ; l'énergie en trois batteries pixel (rouge, orange, verte) à toucher, sans texte ; le contrat avec une case par jour.
- Journal de bord plus visuel, même structure : ligne légèrement teintée à la couleur du rituel (ou du repas, de l'engagement…), vraie case à cocher pixel (dorée quand c'est fait).
- « J'ai… » dans ma fiche (Moi > Ma vie > Modifier) : animaux, maison, transport, santé, famille, activité. Chaque fait coché ajoute ses actions dans le panneau +, ses rituels (sortir le chien, prendre mon traitement…), ses rappels à rythme (arroser, litière, pression des pneus, lentilles…) qui arrivent dans « Plus tard aujourd'hui » quand c'est le moment, et ses quêtes. Décoché, tout repart.

## 28/10/2026
- Refonte des quêtes, étape 2 : 3 à 5 quêtes du jour, dont au moins 2 « pour toi » ; tes priorités, les quêtes courtes et les envies passent devant ; un tri par jour au plus ; une quête sport et une de musique poussées si ta semaine n'en a pas ; menu « … » réduit à Plus tard / Pas pour moi (« Déjà vu » reste pour les films, « Voir le projet » pour les étapes de projet).
- Refonte des quêtes, étapes 4 et 5 : l'idée sortie devient une inspiration du samedi et du dimanche ; « Je l'ai fait » ouvre Actions › Sortir (seul : Soi, avec quelqu'un : Ami). Les projets montrent l'icône de leur thème, plus de créature. Doublons fusionnés : une seule version de « préparer demain », « pas d'écran 30 min avant de dormir », « 20 min de marche dehors », étirements, lecture, album, photo à la famille, « voir quelqu'un en vrai ».
- Corrections : « Neveu · nièce » dans les liens de famille ; Bonne nuit n'affiche plus d'écran « Un peu de détail » vide quand rien n'est choisi ; lignes faites du journal sans bande sombre sur iPhone.
- Journal de bord : le haut d'Aujourd'hui devient une liste comme un carnet. « Ce matin / Cet après-midi / Ce soir » (ta nuit, ton énergie, rituels à rattraper, rituels du moment avec la barbe enchaînée après la douche, verres d'eau, repas, routine), « Mes engagements » (engagements du jour, compteur de cigarettes, contrat), « Plus tard aujourd'hui » (repas à venir, calendrier du jour, à faire, Bonne nuit). Ce qui est fait reste grisé avec son heure, replié au-delà de 3.
- Refonte des quêtes, étape 1 : XP plafonnée à 30 par validation (50 pour un exploit : livre, jeu ou série fini, son sorti, contrat fini, sortie loin) ; marche et lecture en Soi, album en Talent, idées sortie en Soi ; titres raccourcis (« Décortiquer un son de… », « Regarder [film] », « 20 min pour [note] », « Trier 50 photos »…) ; « Faire une tâche à la place de [prénom] » seulement si tu ne vis pas seul ; bonnes actions retirées (dossier, coucher avant minuit, trajet à pied) ; « Courses » n'ouvre plus la course à pied, « 15 min de sport » ouvre un minuteur, « une heure » est lue comme une durée ; les quêtes spéciales de cuisine se remplissent dans l'assiette.
- Engagements : le matin, choisis jusqu'à 3 engagements (sans cigarette, moins de N cigarettes, sans soda, sucre, grignotage, réseaux, ou le tien). Le soir, Bonne nuit les valide : les cigarettes se vérifient avec le compteur, les autres « Tenu » / « Pas cette fois ». +15 XP par engagement tenu.
- À faire : dans Actions, choisis Hier, Aujourd'hui ou Demain. Aujourd'hui : « Fait » ou « À faire plus tard » ; Demain : l'action va dans la liste du lendemain ; une tâche libre s'écrit dans la recherche (5 XP). Section « À faire » dans Aujourd'hui ; ce qui reste est proposé dans Bonne nuit (Demain / Retirer).
- Bilan de journée : à la fin de Bonne nuit, un écran « Ta journée » (XP, actions par catégorie, badges, ce qui s'est passé, proches, repas). Les messages « en passant » (lien renforcé, objectif atteint, record…) ne s'empilent plus et attendent ce bilan ; les niveaux s'affichent toujours sur le moment.
- Contrat fini : au dernier jour, une coche à toucher dans le bandeau, +50 XP Travail, puis il disparaît (« Annuler » remet la coche).
- La section des rituels s'appelle « Rituels du matin » / « Rituels du soir ».
- Messages et barre « Annuler » en bas, au-dessus de la barre d'onglets.
- Routine du soir : « Bonne nuit » en dernière étape (ouvre le bilan de la journée). Dans Bonne nuit : déjeuner et dîner se remplissent dans l'assiette ; « Journée sans… » (soda, sucre, grignotage) se coche à la fin, et n'est plus dans les actions.
- Nouveau badge : pastille sur Moi, Chez moi, la Chambre et la tuile Badges de l'armoire, pour suivre le chemin.
- Correction : à l'ouverture de l'appli, les tuiles des repas (et l'assiette) n'apparaissaient pas tant qu'on n'avait rien touché. Le démarrage se lance maintenant après tous les scripts.

## 27/10/2026
- Page Actions : « Créer une action » fixé en bas de l'écran ; tuiles des familles toutes de même hauteur (nom sur une ligne : « Tâche importante », « Des nouvelles ») ; icône pour Tri du téléphone ; tuile « Bonnes actions » retirée (elles restent dans la recherche et les Récents).
- Page Actions : le panneau et son décor prennent tout l'écran à chaque étape ; « Créer une action » reste en bas ; tuiles des familles (Travail, Force…) qui ne débordent plus de l'écran, icône au-dessus du nom.
- Page Actions : accueil avec tes actions récentes (ou quelques-unes pour commencer) ; les bonnes actions rangées dans leur catégorie ; la durée d'abord, « Avec qui ? » ensuite et seulement pour les proches et les sorties ; « Cuisiner un repas » ouvre l'assiette ; XP plafonnée à 30 ; icônes plus grandes, « Journée sans » en entier, nouvelle poêle.
- Assiette et quêtes reliées : une quête nourriture (légume, équilibré, végétarien, cuisiner, nouvelle recette…) se valide en remplissant l'assiette, avec son objectif affiché ; « Cuisiné maison » et « Nouvelle recette » à cocher ; plus proposée quand les repas sont notés. Bonnes actions en doublon avec l'assiette retirées (migration 4).
- Assiette : catégorie « Sauces » (10 sauces en pixel art + les tiennes), à cocher ; ne change ni l'équilibre ni l'XP. Gardée dans les recettes.
- Quêtes d'aujourd'hui : cartes plus grandes, plus de titres coupés.
- Centrage des boutons et tuiles, lignes de séparation uniques, outil `centrage.py`.

## 26/10/2026
- Ma routine refaite : écran de départ avec toutes les étapes et le record, liste à cocher avec l'étape en cours mise en avant, chrono en grand sur le ciel du moment, le repas du moment et un verre d'eau inclus, récap à la fin.
- Ma fiche : prénom centré en haut, portrait + titre + badges, barre d'XP pleine largeur, catégories sur 2 colonnes ; aura = fond flouté.
- Bouton retour aligné, poubelle à la place de « Supprimer », icônes recentrées.
- Phase 4 (scripts, invisible à l'écran) : `correctifs.js` supprimé et rangé par zone, plus aucune réécriture de fonction, icônes pixel écrites à la source, observateurs DOM retirés, scripts rangés en dossiers (`coeur`, `aujourdhui`, `moi`, `proches`, `donnees`), gros fichiers découpés, code mort retiré.
- Tests de parcours (`outils/parcours.py`).
- Correction : un proche ajouté à la famille disparaissait au rechargement.
- Proches : Famille et Amis en sections comme Groupes (titre + bouton +), ajout d'un proche en plein écran ; barres de niveau « Nv » centrées, et même barre par catégorie sur ma fiche.
- Fiche d'un proche : bouton Fond branché plus tôt ; dernière erreur affichée dans Bilan > Données.
- Ma fiche profil retrouve son cadre (neutre) et les auras leur fond ; cadre des fiches de proches en gris clair.
- Guide de construction (`DESIGN.md`) : rôles de texte, en-tête de section, boutons, espacements, cadres, couleurs, interactions.
- Tous les boutons à 44 px, puces de choix à 44 px, bouton flottant à 56 px ; actions d'en-tête alignées (Relations, Ma fiche en icône crayon) ; 24 px entre les sections.
- Suppressions immédiates avec « Annuler » au lieu de confirmations (événement, minuteur, rituel décoché, restauration par texte).
- Barre d'XP du personnage au modèle standard ; icônes de la barre du bas à 24 px.
- Icônes d'interface 24 px, icônes de contenu 48 px ; voile sombre sur le ciel pour la lisibilité.
- Phase 5 : cartes sans cadre coloré, fenêtres de saisie en plein écran, textes lisibles sur le ciel, groupes de Proches sans bandeau, stats lisibles, titres de Bilan, XP des bonnes actions plafonnée à 30.
- Phase 3 : CSS rangé en 7 fichiers (base, composants, une feuille par zone), CSS des fonctionnalités retirées supprimé, en-tête de page remis dans `<head>`.
- Vue « Quêtes » cachée et onglets fantômes supprimés.
- Outils de vérification rangés dans `outils/`.

## 25/10/2026
- Sauvegarde en fichier (export / restauration avec Annuler).
- Version de sauvegarde et migrations numérotées (`js/migrations.js`).
- Appli installable « XP » (manifest, icône), fonctionne hors ligne (service worker), numéro de version visible.
- Météo branchée sur Open-Meteo (position ou ville).
- Retiré : synchronisation Claude, Spotify, fonctions qui appelaient Claude, boss (semaine, catégories, Noël), compétences musique, sections cachées de Bilan, Rappels, ancien Projets.
- Inventaires `DONNEES.md` et `FONCTIONNALITES.md`, feuille de route.
- Avant : découpage du code en fichiers, assiette des repas, recettes, standards de l'appli.
