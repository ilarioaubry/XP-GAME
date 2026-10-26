# Guide de construction d'XP

Ce fichier dit **comment construire** n'importe quel élément de l'appli : taille des textes, place des boutons, espacements, cadres, couleurs, interactions.
Les **règles d'Ilario** (le pourquoi) sont dans `CLAUDE.md` > Standards ; ce guide les traduit en mesures et en composants (`css/composants.css`, préfixe `ui-`).
Statut : validé par Ilario le 26/10/2026.

---

## 1. La page

| Mesure | Valeur | Composant / variable |
|---|---|---|
| Largeur de référence | 393 px (iPhone) | — |
| Marge gauche / droite du contenu | **24 px** | (marge de `.wrap`) |
| Espace entre deux sections | **24 px**, plus la ligne en pointillés de la section | `--ui-e6`, `.ui-sep` |
| Titre de section → son contenu | **12 px** | `--ui-e3` |
| Entre deux cartes ou deux rangées de tuiles | **8 px** | `--ui-e2` |
| Intérieur d'une carte | **12 px** | `--ui-e3` |
| Grille des tuiles | 4 colonnes, carrées, 8 px d'écart | `.ui-tuiles` |

Tous les espacements sont des multiples de 4 : 4 · 8 · 12 · 16 · 24 · 32.

## 2. Les rôles de texte

Chaque texte a **un rôle**, et sa taille vient de son rôle, jamais d'une règle écrite pour lui seul.

| Rôle | Taille | Police | Exemple | Classe |
|---|---|---|---|---|
| Titre de section | 20 px, majuscules, losange à la couleur de la section | pixel | MATIN, RELATIONS | `.ui-titre` |
| Titre de carte | 15 px gras, 2 lignes max puis « … » | texte | « Manger dehors ou près d'une fenêtre » | `.ui-carte__titre` |
| Texte | 13 px | texte | descriptions, consignes | `.ui-carte__texte` |
| Petite info | 11 px (seulement sur fond sombre ; sur le ciel : 13 px) | texte | « vers 14 h », « hier 0 » | `.ui-info` |
| Chiffre décoratif | 22 px et plus | pixel | 3°, niveau | `.ui-chiffre` |
| Champ de saisie | 16 px (sinon l'iPhone zoome) | texte | — | `.ui-champ` |
| Étiquette | 11 px gras, fond sombre, sans bordure | texte | NOUVEAU, Ami du mois | `.ui-etiquette` |
| Compteur | 15 px, or, sans fond | pixel | 0/3 | `.ui-compteur` |

Un titre de fenêtre plein écran est un **chiffre décoratif** (26 px) ; le nom d'un proche sur sa fiche aussi.

## 3. L'en-tête de section (le même partout)

```
[◆ TITRE DE SECTION] [compteur]                    [action]
 ← 24 px                                       24 px →
```

- Titre à gauche, compteur juste après (s'il y en a un).
- **Une seule action**, collée à droite, alignée sur le bord du contenu (24 px du bord de l'écran).
- L'action est un **bouton icône carré 44 × 44, style secondaire** :
  - ajouter → icône `plus`
  - modifier / régler → icône `edit`
- Plus d'une action → un seul bouton « … » qui ouvre une petite fenêtre centrée.
- Pas de bouton texte dans les en-têtes (« Modifier » de Ma fiche est l'icône crayon). Les boutons « Créer » / « Ajouter » à côté d'un champ appartiennent au formulaire, pas à l'en-tête.

Composant : `.ui-entete` (titre + compteur + action).

## 4. Les boutons

| Type | Usage | Aspect |
|---|---|---|
| Principal | l'action attendue (Fait, Valider, Exporter) — **un seul par carte ou par fenêtre** | jaune plein, texte sombre |
| Secondaire | les autres actions (Plus tard, Fermer, Changer) | fond sombre, bordure neutre |
| Ajout | créer quelque chose de nouveau dans une liste | pointillés |
| Icône | action courte sans texte (fermer, crayon, +) | carré 44 × 44, secondaire |
| Lien | action discrète dans un texte (Renommer, Plus tard) | texte souligné |

- Hauteur **44 px** pour tous, sans exception (zone de toucher).
- Dans une carte : le bouton principal à droite, centré verticalement.
- En bas d'une fenêtre plein écran : secondaire à gauche (1/3), principal à droite (2/3), comme l'assiette.
- Le bouton dit son action, rien d'autre (pas de compteur, pas de minuteur, pas d'indicateur) ; un compteur se met à côté.
- **Puces de choix** (Étudiant·e, Geek…) : boutons secondaires de 44 px ; sélectionnée = bordure or.
- **Bouton flottant « + »** : un seul dans l'appli, sur Aujourd'hui, en bas à droite au-dessus de la barre d'onglets, carré **56 px**, jaune.

## 5. Cadres, cartes et tuiles

- **Section** : jamais de cadre. Séparation = espace + ligne en pointillés à la couleur de la section.
- **Carte** (un élément qu'on lit et sur lequel on agit) : fond sombre `--ui-fond`, bordure **2 px neutre**, coins carrés, padding 12 px, contenu aligné à gauche.
- **Tuile** (un élément court : icône + mot) : carrée, même fond et même bordure, contenu centré, nom sur une ligne.
- **Fiche d'un proche** et **ma fiche profil** : seules exceptions de grand cadre, bordure neutre 2 px ; l'aura équipée remplit le fond de ma fiche.
- **Bordure or 2 px = actif / sélectionné**. Aucune autre bordure colorée.

## 6. Couleurs

| Couleur | Sens | Variable |
|---|---|---|
| Or `#ffd94a` | action principale, sélection, progression (XP, compteurs) | `--ui-or` |
| Rouge `#ff7a6b` | nouveau, alerte | `--ui-alerte` |
| Couleur de catégorie | la catégorie (losange du titre, pointillés, teinte d'une quête) | `--c-sport`, `--c-food`… |
| Crème `#fff7e6` | texte | `--ui-creme` |
| Crème 60 % | texte secondaire | `--ui-creme-2` |
| Blanc 17 % | bordure neutre | `--ui-bord` |
| Fond sombre | cartes, tuiles, boutons secondaires | `--ui-fond` |

Jamais de couleur pour la rareté (étoiles), jamais la couleur du ciel dans l'interface.

## 7. Icônes et images

- Icônes d'interface (`PXUI`, grille 12) : **24 px**.
- Icônes de contenu (aliments, rituels, objets, grille 16) : **48 px**.
- Exceptions : étoiles de rareté, petites icônes collées au texte.
- Pixels nets : toujours un multiple de la grille, `image-rendering: pixelated`.

## 8. Interactions

| Geste | Effet |
|---|---|
| Toucher | l'action principale de l'élément |
| Appui long | un raccourci seulement ; **toujours aussi dans le menu « … »** |
| « … » | petite fenêtre centrée ; toucher à côté la ferme sans rien déclencher |
| Valider (Fait) | petit son + petite animation (≤ 300 ms), XP affichée à ce moment-là |
| Supprimer | immédiat + barre « Annuler » 5 s en haut ; jamais de confirmation |
| Saisir du texte | fenêtre plein écran (automatique dès qu'il y a un champ) |
| Revenir | bouton secondaire « ← Écran » en haut à gauche |
| Associer des personnes | au moment de « Fait », fenêtre « Avec qui ? » |

Rien ne bouge tout seul (voir 6.12 de la feuille de route pour le décor) ; « réduire les animations » est respecté.

## 9. Où placer un nouvel élément

| C'est… | Ça va dans… |
|---|---|
| une action à faire aujourd'hui | Aujourd'hui |
| un historique, une stat | Moi > Bilan |
| un réglage | Moi > Ma vie (Réglages) |
| un objet gagné, une collection | Moi > Chez moi |
| ce qui concerne une personne | Proches, sur sa fiche |

## 10. Recette : ajouter un élément

1. **Placer** : l'onglet et la section (§ 9). S'il faut une nouvelle section : en-tête standard (§ 3).
2. **Choisir le composant** : carte, tuile, bouton, barre, fenêtre (§ 4–5). Ne pas inventer de nouveau style ; s'il en faut un, l'ajouter à `composants.css` pour tout le monde.
3. **Donner un rôle à chaque texte** (§ 2).
4. **Couleurs** : seulement celles du § 6, avec leur sens.
5. **Interactions** : celles du § 8 ; tout appui long a son équivalent dans « … ».
6. **XP** : barème de CLAUDE.md (petite action 2–5, repas / rituel ~10, quête 15–30).
7. **Données** : nouvelle clé dans `S.g`, ajoutée à `DONNEES.md` ; fonctionnalité ajoutée à `FONCTIONNALITES.md`.
8. **Style** : dans la feuille de la zone (`aujourdhui.css`, `moi.css`…), jamais dans `base.css`, jamais de `!important`.
9. **Vérifier** : captures à 393 px, comparaison avant / après sur tous les écrans, audit des standards.
