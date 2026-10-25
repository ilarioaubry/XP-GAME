# Carnet de Quêtes

Appli perso en français (quêtes, XP, rituels, relations), utilisée sur iPhone en appli installée depuis GitHub Pages. Répondre en français, de façon concise.

## Règles de travail

- Le code source est dans `src/` (`index.src.html`, `css/`, `js/`). `index.html` est GÉNÉRÉ : ne jamais l'éditer à la main.
- Après toute modification dans `src/`, lancer `python3 build.py` puis committer `src/` ET `index.html` ensemble.
- L'ordre des emplacements `@@include(...)@@` est l'ordre d'exécution : les CSS « principal-XX » et « epure-XX » sont des couches chronologiques (le dernier gagne), ne pas les réordonner.
- Tous les scripts partagent la portée globale (état `S`, `save()`, `load()`, clé localStorage `carnet-quetes`) ; `js/correctifs.js` est une grosse IIFE de rustines.
- Tester à largeur iPhone (≈393 px) avec Playwright avant de livrer. iOS en mode appli : la classe `fullh` + `100lvh` corrige la hauteur ; ne pas la retirer.
- Ne pas casser les données existantes de l'utilisateur (format de sauvegarde localStorage).

## Standards de l'appli

Règles données par Ilario (à respecter sans redemander) :

- **Tout en pixel art** : icônes, illustrations, éléments graphiques. Pas d'emoji ni d'icône vectorielle dans le contenu.
- **Pas d'encadrés** autour des sections ni des blocs (cadres colorés, boîtes à bordure). Séparer par l'espacement et une ligne pixel en pointillés à la couleur de la section ; si ça devient flou, trouver une séparation graphique, pas un cadre.
- **Pas de boss ni de combats.** Ne pas en ajouter, ne pas en proposer.
- **Ne pas inventer de mécanique de jeu** non demandée : proposer d'abord, construire après accord.
- Avant de livrer : tester à largeur iPhone (393 px) et montrer une capture. Dire clairement ce qui n'a pas pu être vérifié sur son iPhone.
- Réponses en français, concises.
- **Fenêtres** : petite fenêtre centrée pour les choix rapides (oui/non, choisir une option) ; plein écran (fond sombre, titre en haut, boutons en bas, comme l'assiette) pour tout ce qui demande de saisir ou composer.
- **XP** : une nouvelle fonctionnalité rapporte de l'XP sur le barème actuel : petite action 2–5, repas/rituel ~10, quête 15–30. Pas de bonus géants.
- **Sons et animations : sobres.** Un petit son et une petite animation à la validation, rien qui bouge tout seul ; respecter « réduire les animations ».
- **Suppression** : immédiate, avec un bouton « Annuler » quelques secondes (barre du bas), pas de question de confirmation.
- **Placement** : action du jour → Aujourd'hui ; historique et stats → Moi > Bilan ; réglages → Moi.
- **Ton** : simple et encourageant, direct, jamais culpabilisant (« Il manque : légumes », pas « Tu n'as pas mangé de légumes »).
- **Grandes illustrations** (assiette, scène, personnage) : pixel art détaillé, grilles fines (jusqu'à 64×64), pixels nets, mêmes palettes que les icônes.

Conventions du code existant (à suivre) :

- **Icônes 16×16** : aliments, rituels, objets → `RKI` (palette `RKP`, rendu `rkSvg`) : contour `o` foncé, reflet clair en haut à gauche, ombre en bas à droite. Badges → grille 16×16 dans `IC` (`26-bibliotheque-badges.js`, palette `PAL`, ombre auto) + couleur dans `FILL` : **tout nouveau badge a son icône**.
- **Couleurs** : celles des catégories (`--c-soi`, `--c-sport`, `--c-food`…) ; assiette : féculents jaune `#f0a020`, protéines rouge `#e8473a`, légumes vert `#4fb84a`.
- **Typo** : `--f-pixel` (Lilita One) pour les titres, `--f-body` (Atkinson Hyperlegible) pour le texte.
- **Textes** : tutoiement, phrases courtes, vocabulaire simple.
- **Données** : nouvelles clés dans `S.g`, jamais de renommage ni de changement de format. Réparation ponctuelle = une seule fois, marquée par un drapeau dans `S.g`.
- **Ajout d'un élément visible** : vérifier qu'aucune règle CSS existante ne le masque (ex. Bilan masque les sections non listées).

## Ponytail

Skills Ponytail installés dans `.claude/skills/` (MIT, github.com/DietrichGebert/ponytail) : `/ponytail` (mode « dev paresseux » : plus petit changement qui résout le problème), `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`. Niveaux : `/ponytail lite|full|ultra|off`.

## frontend-design

Skill `frontend-design` (Apache-2.0, github.com/anthropics/skills) dans `.claude/skills/`. À utiliser pour créer ou refondre un écran. Pour une retouche sur l'existant, garder le style actuel de l'appli (pixel art, couleurs, composants) plutôt que d'y appliquer une nouvelle direction artistique.
