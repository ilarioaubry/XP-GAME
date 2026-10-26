# Journal des versions

Le numéro de version affiché dans Moi > Bilan > Données est une empreinte du contenu : il change à chaque mise en ligne.

## 26/10/2026
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
