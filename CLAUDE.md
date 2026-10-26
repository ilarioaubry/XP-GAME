# Carnet de Quêtes

Appli perso en français (quêtes, XP, rituels, relations), utilisée sur iPhone en appli installée depuis GitHub Pages. Répondre en français, de façon concise.

## Règles de travail

- Le code source est dans `src/` (`index.src.html`, `css/`, `js/`). `index.html` est GÉNÉRÉ : ne jamais l'éditer à la main.
- Après toute modification dans `src/`, lancer `python3 build.py` puis committer `src/` ET `index.html` ensemble.
- L'ordre des emplacements `@@include(...)@@` est l'ordre d'exécution. CSS : `base.css` (anciennes couches fusionnées, dans l'ordre) → `composants.css` (briques `ui-`) → une feuille par zone (`aujourdhui-haut`, `aujourdhui`, `proches`, `moi`, `fenetres`). Un nouveau style va dans la feuille de sa zone, ou dans `composants.css` s'il sert partout ; jamais dans `base.css`.
- Tous les scripts partagent la portée globale (état `S`, `save()`, `load()`, clé localStorage `carnet-quetes`) ; `js/correctifs.js` est une grosse IIFE de rustines.
- Tester à largeur iPhone (≈393 px) avec Playwright avant de livrer. iOS en mode appli : la classe `fullh` + `100lvh` corrige la hauteur ; ne pas la retirer.
- Ne pas casser les données existantes de l'utilisateur (format de sauvegarde localStorage).

## Feuille de route

`FEUILLE-DE-ROUTE.md` = le plan issu du rapport complet. On le suit étape par étape : présenter l'étape suivante, attendre « go », faire, tester (393 px + capture), Ilario vérifie, cocher avec la date, puis présenter la suivante. Ne rien retirer de la liste sans son accord ; toute nouvelle idée s'y ajoute.

## Guide de construction

`DESIGN.md` = les mesures et composants pour construire tout élément (rôles de texte, en-tête de section, boutons, espacements, cadres, couleurs, interactions, où placer, recette d'ajout). Le suivre pour tout ajout ou retouche.

## Standards de l'appli

Règles données par Ilario (à respecter sans redemander) :

- **Tout en pixel art** : icônes, illustrations, éléments graphiques. Pas d'emoji ni d'icône vectorielle dans le contenu.
- **Pas d'encadrés** autour des sections ni des blocs (cadres colorés, boîtes à bordure). Séparer par l'espacement et une ligne pixel en pointillés à la couleur de la section ; si ça devient flou, trouver une séparation graphique, pas un cadre. Exception voulue : les fiches des proches (profils d'amis) gardent leur cadre. Les groupes (Famille, Amis…) se séparent par leur titre et une ligne en pointillés à leur couleur, pas par un bandeau plein. Les cartes ont toutes le même fond sombre et une bordure neutre fine.
- **Pas de boss ni de combats.** Ne pas en ajouter, ne pas en proposer.
- **Ne pas inventer de mécanique de jeu** non demandée : proposer d'abord, construire après accord.
- Avant de livrer : tester à largeur iPhone (393 px) et montrer une capture. Dire clairement ce qui n'a pas pu être vérifié sur son iPhone.
- Réponses en français, concises.
- **Fenêtres** : petite fenêtre centrée pour les choix rapides (oui/non, choisir une option) ; plein écran (fond sombre, titre en haut, boutons en bas, comme l'assiette) pour tout ce qui demande de saisir ou composer : toute fenêtre qui contient un champ texte passe automatiquement en plein écran.
- **XP** : une nouvelle fonctionnalité rapporte de l'XP sur le barème actuel : petite action 2–5, repas/rituel ~10, quête 15–30. Pas de bonus géants.
- **Sons et animations : sobres.** Un petit son et une petite animation à la validation, rien qui bouge tout seul ; respecter « réduire les animations ».
- **Suppression** : immédiate, avec un bouton « Annuler » quelques secondes (barre du bas), pas de question de confirmation.
- **Placement** : action du jour → Aujourd'hui ; historique et stats → Moi > Bilan ; réglages → Moi.
- **Ton** : simple et encourageant, direct, jamais culpabilisant (« Il manque : légumes », pas « Tu n'as pas mangé de légumes »).
- **Jamais de zoom** dans l'appli (viewport bloqué, pas de pincement ni de double-tap, champs à 16 px).
- **Coins carrés partout** (pixel art). Jamais de mélange carré dehors / arrondi dedans. Seuls les vrais ronds (`border-radius:50%`) restent ; un nouveau rond doit être ajouté à la liste de `css/standards.css`.
- **Titres de section** : tous identiques (police pixel, majuscules, losange à la couleur de la section), sans ombre ni fond.
- **Même catégorie d'info = même taille et même alignement** (fiches de proches, cartes de quêtes, boutons d'action…), sans changer la taille des polices : texte trop long → titres de carte sur **2 lignes max**, noms dans les listes sur 1 ligne, puis « … ».
- **Contenu centré** dans les éléments courts (bouton, tuile, compteur). Les cartes avec un titre et une description sont **alignées à gauche**.
- **Quêtes spéciales** : carrousel où la carte suivante dépasse un peu (on voit que ça glisse) ; chaque carte a une icône pixel en bas à droite (catégorie par défaut si la quête n'en a pas).
- **Collections** (armoire, badges…) : on montre ce qui est obtenu, puis une seule tuile « +N » pour ce qui reste à trouver, jamais la liste des éléments verrouillés.
- **Personnes associées à une action** : on les choisit au moment de « Fait » (fenêtre « Avec qui ? »), jamais suggérées avant.
- **Bordure colorée = actif / sélectionné**, rien d'autre (ni rareté, ni catégorie, ni « disponible ») ; sinon bordure neutre `rgba(255,255,255,.17)`.
- **Une seule étiquette** (vers 14 h, NOUVEAU, Ami du mois…) : texte 11 px gras, fond sombre, sans bordure. **Un seul compteur** (0/3, 15/117…) : police pixel 15 px, or, sans fond.
- **Barres de progression** : un seul modèle (contour crème 2 px, fond sombre), deux tailles : grande 18 px pour les niveaux (XP, proches), petite 10 px pour tout le reste.
- **Échelle de texte à 4 niveaux** : titre de section 20 px · titre de carte 15 px · texte 13 px · petite info 11 px. Seuls les grands chiffres décoratifs (≥ 22 px) font exception ; les champs restent à 16 px. Le 11 px seulement sur fond sombre ; sur le ciel, 13 px minimum.
- **Messages** : un seul emplacement (en haut) et un seul style pour les toasts et la barre « Annuler ».
- **États vides** : classe `vide`, phrase courte centrée du type « Aucun … pour l'instant. », suivie du bouton pour agir s'il existe.
- **Choix rapides** (menus « … », Pris / Sauté…) : petite fenêtre centrée sur fond assombri ; un toucher à côté la ferme sans rien déclencher derrière.
- **Vocabulaire** : français et neutre. Pas de « boss », « monstre », « skill » : projet, compétence, essentiels, tri.
- **Une couleur = un sens** : couleur de catégorie = la catégorie ; or = action principale, sélection, progression (XP, compteurs) ; rouge = nouveau / alerte. La rareté se lit en étoiles pixel (1 à 4), jamais en couleur ; le mot (Commun, Rare, Épique, Légendaire) est écrit au moment où on découvre l'objet.
- **Accent identique jour et nuit** (or `#ffd94a`) : seul le décor change avec l'heure ; la couleur du ciel ne colore pas l'interface.
- **Boutons : trois styles, hauteur 44 px** : principal = jaune plein ; secondaire = fond sombre, bordure neutre ; ajout = pointillés. Boutons icône = carrés 44×44. Les liens texte restent des liens.
- **Effets au survol** (`:hover`) seulement dans `@media (hover:hover)` : sur iPhone ils restent collés.
- **Pas d'indicateurs dans les boutons** (cercle « appui long », sablier, triangle…) : le bouton dit seulement son action.
- **Tailles d'icônes** : interface (icônes `PXUI`, grille 12) = 24 px ; contenu (aliments, rituels, objets, grille 16) = 48 px. Exceptions : étoiles de rareté, petites icônes collées au texte.
- **Lisibilité sur le ciel** : un voile sombre est posé sur le ciel sous la scène (`#skyBg::after`) ; ne pas l'alléger.
- **Grandes illustrations** (assiette, scène, personnage) : pixel art détaillé, grilles fines (jusqu'à 64×64), pixels nets, mêmes palettes que les icônes.

Conventions du code existant (à suivre) :

- **Icônes 16×16** : aliments, rituels, objets → `RKI` (palette `RKP`, rendu `rkSvg`) : contour `o` foncé, reflet clair en haut à gauche, ombre en bas à droite. Badges → grille 16×16 dans `IC` (`26-bibliotheque-badges.js`, palette `PAL`, ombre auto) + couleur dans `FILL` : **tout nouveau badge a son icône**.
- **Couleurs** : celles des catégories (`--c-soi`, `--c-sport`, `--c-food`…) ; assiette : féculents jaune `#f0a020`, protéines rouge `#e8473a`, légumes vert `#4fb84a`.
- **Typo** : `--f-pixel` (Lilita One) pour les titres, `--f-body` (Atkinson Hyperlegible) pour le texte.
- **Textes** : tutoiement, phrases courtes, vocabulaire simple.
- **Données** : nouvelles clés dans `S.g`, jamais de renommage ni de changement de format. Réparation ponctuelle = une migration numérotée ajoutée à la fin de `MIG` dans `js/migrations.js` (`S.g.ver` = nombre de migrations appliquées) ; ne jamais modifier ni réordonner une migration existante.
- **Fonctionnalité retirée** : supprimée du code (HTML, JS, et CSS lors de la fusion), jamais seulement cachée ; ses données restent dans la sauvegarde. Tenir `FONCTIONNALITES.md` et `DONNEES.md` à jour.
- **Ajout d'un élément visible** : vérifier qu'aucune règle CSS existante ne le masque (ex. Bilan masque les sections non listées).

## Ponytail

Skills Ponytail installés dans `.claude/skills/` (MIT, github.com/DietrichGebert/ponytail) : `/ponytail` (mode « dev paresseux » : plus petit changement qui résout le problème), `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`. Niveaux : `/ponytail lite|full|ultra|off`.

## frontend-design

Skill `frontend-design` (Apache-2.0, github.com/anthropics/skills) dans `.claude/skills/`. À utiliser pour créer ou refondre un écran. Pour une retouche sur l'existant, garder le style actuel de l'appli (pixel art, couleurs, composants) plutôt que d'y appliquer une nouvelle direction artistique.
