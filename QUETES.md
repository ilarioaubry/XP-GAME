# Quêtes et bonnes actions d'XP

Référence complète de tout ce que l'appli propose de faire : où ça apparaît, comment on le réalise, ce que ça apporte, puis l'analyse (incohérences, titres, doublons, XP) et, quand la sauvegarde d'Ilario est fournie, son utilisation réelle.
L'inventaire (partie 6) est généré par `python3 outils/inventaire.py` : le relancer après tout ajout ou changement. Les parties 1 à 5 sont écrites à la main ; la partie 5 se remplit avec `python3 outils/usage.py <sauvegarde.json>`.
État au 27/10/2026.

---

## 1. Les familles

| Famille | Où | Qui la choisit | Combien |
|---|---|---|---|
| **Quêtes pour toi** | Aujourd'hui, bloc « Aujourd'hui » | L'appli, selon ta fiche (situation, priorités, intérêts), l'heure, la météo, ta batterie, ce que tu as refusé avant | 3 par jour (selon ta capacité) |
| **Quêtes du moment** | même liste | Un créneau de la journée (lumière du matin, midi, coucher du soleil…) | 7 modèles |
| **Tri** (ménage numérique) | même liste, « Tri : … » | Tirage, une à la fois | 15 modèles |
| **Quêtes spéciales** | Aujourd'hui, carrousel | Amis et famille à recontacter, groupes, surprise du jour, anniversaires, idée sortie | 3 à 6 visibles |
| **Surprise du jour** | carrousel | Tirage (une par jour) | 20 modèles |
| **Idée sortie** | carrousel | Tirage selon le moment (soir, journée, week-end) | 32 modèles |
| **Événements à venir** | Aujourd'hui, avant un événement noté au calendrier | Le type d'événement (concert, entretien, examen, voyage, soirée, rendez-vous, sport, autre), de J-10 à J+1 | 26 modèles |
| **Fêtes** | décembre | Calendrier de l'Avent | 24 |
| **Nature du mois** | une par mois | Le mois | 12 |
| **Objectifs** | quand une priorité est choisie dans Ma fiche | La priorité (forme, sommeil, écrans…) | 10 |
| **Réconfort** | jour difficile (humeur basse, batterie faible) | Ton humeur | 6 |
| **Bonnes actions** | panneau « + » › Bonnes actions | Toi (liste modifiable) | 24 aujourd'hui |
| **Noter une action** | panneau « + » | Toi : action › quoi › avec qui › pendant, avec rappel de fréquence | 39 familles |
| **Centres d'intérêt** | panneau « + », selon tes univers | Tes centres d'intérêt (jeu, lecture, cuisine…) | 22 actions |
| **Proches** | fiche d'un proche | Toi : prendre des nouvelles, appeler, se voir | 3 |
| **Projets** | Moi › Ma vie › Mes projets | Toi, à partir de 21 modèles en 5 étapes | 103 étapes |
| **Modèles « Créer »** | Créer une action ou un projet | Suggestions de départ | 24 |

## 2. Comment on les réalise (interactions)

| Réalisation | Déclenchée par | Ce qui se passe |
|---|---|---|
| **Fait** | par défaut | Petit son + animation, XP affichée, barre « Annuler » 5 s |
| **Minuteur N min** | une durée dans le titre (« 20 min », « 1 h ») | Le bouton affiche la durée ; on lance un minuteur, validé à la fin (ou « Déjà fait ») |
| **Compteur N** | un nombre + une unité (« 50 photos », « 2 candidatures ») | Bouton « +1 / +N » jusqu'au total |
| **Compteur de pompes** | « pompes » ou « squats » | Fenêtre de comptage, record |
| **Minuteur gainage**, **Étirements guidés**, **Course guidée**, **Méditation guidée** | gainage, étirement, courir / course, méditer | Fenêtres guidées (étapes, chrono) avec « Déjà fait » |
| **Lecture (pages)** | « lire » | Noter les pages, livre en cours |
| **Contacter** | un prénom + écrire / appeler / vocal / message | Ouvre le choix appel ou message |
| **Choix du cadeau** | « Acheter un cadeau pour… » | Fenêtre d'idées de cadeau |
| **Assiette** | quête nourriture sur le contenu ou la cuisine (depuis le 27/10) | « Remplir l'assiette », objectif affiché, quête validée en validant l'assiette |
| **Avec qui ?** | quêtes Ami / Famille | Choix des personnes au moment de « Fait » (XP de lien) |
| **Menu « … »** | toutes les quêtes du jour | En partie (moitié des XP), Plus tard (revient vers 18 h ou dans 2 h), Pas aujourd'hui (moins proposée), Pas pour moi (ne revient plus) |
| **Une autre** | idée sortie, surprise, quête spéciale | Tire une autre proposition |
| **Souvenir** | après une quête faite | Ajouter une photo ou un mot |
| **Quête reliée** | une action notée dans le « + » qui correspond à une quête ouverte | La quête est validée au passage |

## 3. Ce qu'elles apportent

- **XP** (niveau du personnage). Barème voulu : petite action 2–5, repas / rituel ~10, quête 15–30. Heure d'or : XP ×2 pendant 1 h.
- **Barre de catégorie** de ma fiche (Force, Talent, Ami, Famille, Maison, Soi, Travail, Nourriture).
- **Lien avec un proche** (barre « Nv » de sa fiche) quand on choisit « Avec qui ? ».
- **Ce que tu deviens** (identités), **badges**, **série** de jours, **niveaux des centres d'intérêt**.
- **Apprentissage** : chaque refus (« Pas aujourd'hui », « Pas pour moi ») baisse le poids de la quête ; 3 refus d'une même famille en 30 jours la mettent en retrait 3 semaines.

---

## 4. Analyse (27/10/2026)

### 4.1 Ce qui ne fonctionne pas comme prévu

1. **« Courses » est pris pour de la course à pied** : « Petites tâches › Courses » (panneau +) et le modèle « Courses de la semaine » ouvriraient la course guidée.
2. **« 15 min de sport à la maison : pompes, squats, gainage »** ouvre le compteur de pompes au lieu d'un minuteur de 15 min.
3. **Ce qui dure une heure ou une journée se valide tout de suite** : « Une heure sans réseaux, à partir de maintenant » (« une heure » n'est pas lu comme une durée), « Une journée sans soda », « Prendre les escaliers toute la journée », « Pas d'écran pendant le repas du réveillon ». On peut appuyer « Fait » avant que ce soit vrai : il faudrait un minuteur, ou ne les proposer à valider que le soir.
4. **La cuisine a encore deux chemins à côté de l'assiette** : panneau + « Cuisiner › Repas maison, Nouveau plat » et centre d'intérêt « Cuisine : Repas maison / Nouveau plat ».
5. **« Journée sans… › Soda »** (panneau +) et la bonne action **« Une journée sans soda »** sont la même chose.
6. **« Préparer : [prénom] »** (événement « autre ») : le titre n'est pas complet.
7. **Projets** : les modèles portent des noms de créatures (Canapix, Courbatou…) hérités des anciens boss (question 4.8 de la feuille de route).

### 4.2 XP hors barème (quête 15–30, petite action 2–5)

- **Au-dessus de 30** : idées sortie (35 à 45 : train régional 45, kayak 40, atelier 40, escape game 35…), « 1 h de travail concentré » 35, groupe Sons 35 à 50, « Jeu fini » 40, « Livre fini » 40, proches « Se voir » 40.
- **Écarts pour une même taille d'effort** : « Lire » (sans quantité) 10 contre « 10 pompes » 3 ; « Cinéphile : Épisode » 5 contre « Film » 15 ; « 30 min de marche » 25 (objectif forme) contre « Marche rapide de 20 min » 15 et « 20 min de marche dehors » 10.

### 4.3 Titres trop longs

Sur une carte de quête (265 px de texte, 2 lignes au plus) :

- **3 lignes, coupés** :
  - « Décortiquer un son de [artiste] : intro, couplet, refrain, ce qui t'accroche » → « Décortiquer un son de [artiste] » ;
  - « Écouter la setlist probable de [artiste] pour connaître les sons par cœur » → « Écouter la setlist de [artiste] ».
- **Lourds sur 2 lignes** (le détail devrait passer en petite info) :
  - « Trier un réseau : 10 abonnements en moins, et un œil sur tes abonnés » ;
  - « Un restaurant d'une cuisine jamais goûtée (éthiopienne, géorgienne…) » ;
  - « Trier 50 photos : doublons, flous et captures d'écran à la corbeille » ;
  - « Préparer ta tenue et ton sac : billet, batterie, bouchons d'oreilles ».
- **Carrousel** (cartes plus étroites) : la plupart des idées sortie sur 2 lignes pleines.

### 4.4 Pas clairs ou trop vagues

| Titre | Problème | Proposition |
|---|---|---|
| Wall-E (2008) | On ne sait pas quoi faire | Regarder Wall-E (2008) |
| [note] : 20 min pour avancer | Dépend de ta note, souvent flou | « 20 min sur [note] » |
| Avancer sur le dossier (30 min) | Quel dossier ? | Le nom du dossier, ou à retirer |
| Finir une tâche importante / Tâche importante finie | Laquelle ? | La choisir au moment de valider |
| Lire (bonne action) | Pas de quantité | Lire 10 pages |
| Rendre un petit service à quelqu'un chez toi / Rendre service | Vague | Un exemple concret : vaisselle d'un autre, courses pour un voisin… |
| Bowling ou billard, la revanche | Revanche de quoi ? | Bowling ou billard entre potes |
| Faire un son [prénom] (groupe Sons) | Sens peu clair | Faire un son avec [prénom] |
| Faire la plus petite / Faire la plus redoutée (projets) | Sans contexte hors du projet | Faire la plus petite tâche repoussée |
| Trier un réseau : … un œil sur tes abonnés | Demi-consigne | Retirer « un œil sur tes abonnés » |

### 4.5 Doublons (la même chose, avec des titres, XP ou catégories différents)

| Action | Versions trouvées |
|---|---|
| Préparer demain | Préparer tes affaires pour demain (Maison 10) · Préparer ta tenue de demain (Soi 10) · Préparer ta tenue et ton sac pour demain (Maison 10, moment) · même titre dans le projet « Mieux dormir » (Soi) · Préparer tes affaires et te coucher tôt (examen) |
| Écrans avant de dormir | Écrans coupés 30 min avant de dormir (15) · Couper le téléphone 1 h avant de dormir (10) · Pas d'écran 30 min avant de dormir (projet) · Bien dormir › Pas d'écran au lit |
| Marcher | Marche rapide de 20 min dehors (Force 15) · 20 min de marche dehors (Soi 10) · 20 min de marche sans téléphone (Force 10) · 10 min de marche autour du pâté de maisons (Force 10) · 10 min de marche rapide (bonne action) · Marcher 20 min au soleil d'hiver (Soi) · 30 min de marche (Force 25) |
| Étirements | 10 min d'étirements avant de dormir · Étirements avant de dormir · 5 min d'étirements (3 XP) · 10 min d'étirements (projet) |
| Lire | Lire 20 pages (Talent 15) · Lire 10 pages (Soi 10) · Lire (Soi 10) · Lecture : Lire · Lire 20 pages au chaud · Lire 20 min dans un parc |
| Album en entier | Un album de [artiste] en entier (Talent 15) · Écouter un album en entier (Soi 20) · … sous un plaid (Soi 15) |
| Photo à la famille | Envoyer une photo de ta journée à ta famille · Envoyer une photo souvenir à la famille · Envoyer une photo à [prénom] (projet) |
| Voir quelqu'un | Voir un ami dehors aujourd'hui (25) · Voir quelqu'un en vrai aujourd'hui (25) · Voir quelqu'un › … (20) · Se voir (fiche d'un proche, 40) |
| Tri du téléphone | 15 quêtes « Tri » · projet « Trier ton téléphone » · panneau + « Tri du téléphone » · fêtes « Trier les photos et les applis » |
| Rendez-vous médecin | Surprise (20) · modèle de projet · panneau + « Santé » |
| Se coucher avant minuit | Bonne action · panneau + « Bien dormir › Coucher avant minuit » |

### 4.6 Catégories incohérentes

- **Marche** : tantôt Force, tantôt Soi.
- **Lecture** : Talent (quête) et Soi (bonne action, centre d'intérêt).
- **Album en entier** : Talent et Soi.
- **Préparer ses affaires** : Maison et Soi.
- **Idées sortie** : toutes en Ami, même seul (bibliothèque, expo, visite guidée). Elles iraient en Soi, et Ami seulement si « Avec qui ? » est rempli.

### 4.7 Créneaux à vérifier

« 5 min dehors au coucher du soleil » (18 h 20 – 20 h 20) et « 5 min dehors à la lumière du matin » (7 h – 10 h 30) ont des heures fixes. En décembre, le soleil se couche vers 17 h, et la quête arrive après.

---

## 5. Ton utilisation (sauvegarde du 27/10/2026, 3 → 27 octobre)

Chiffres seulement, sans détail personnel (ce fichier est dans le dépôt). Commande : `python3 outils/usage.py <sauvegarde.json>`.

**300 validations sur 24 jours actifs (sur 25).** D'où elles viennent :

| Source | Validations | XP |
|---|---|---|
| Rituels | 92 | 303 |
| Repas / assiette | 64 | 917 |
| Bonus (journée terminée, bilan, barre pleine…) | 38 | 578 |
| Bonnes actions | 31 | 370 |
| Proches (voir, appeler, groupes) | 29 | 845 |
| Sommeil | 16 | 225 |
| Centres d'intérêt | 11 | 98 |
| Quêtes du moment | 7 | 95 |
| Panneau + (noter une action) | 7 | 239 |
| Quêtes spéciales | 3 | 75 |
| Projets | 2 | 40 |
| **Quêtes pour toi** | **0** | **0** |

Ce qui est mis de côté :

1. **Les quêtes pour toi : 0 faite en 25 jours.** 3 à 5 sont proposées chaque jour (plus de 80 au total), mais elles ne sont ni faites ni refusées : une seule a reçu « Pas pour moi ». Elles sont simplement ignorées, si bien que l'appli n'apprend rien (ses poids restent à zéro).
2. **Idée sortie : 20 fois « Une autre », 0 faite.**
3. **Quêtes spéciales : 3 faites.** Une dizaine restent en attente (rangement, ménage, cuisine, prendre des nouvelles).
4. **Bonnes actions : 18 sur 24 jamais validées**, dont les deux plus payées (« Faire du son (1 h) », « 1 h de travail concentré »). Six sont utilisées (verre d'eau, ranger 10 min, étirements, dossier…).
5. **Catégories :**
   - Force (sport) n'a reçu que 15 XP en 25 jours, Talent 60 XP.
   - Famille n'a que 25 XP alors qu'elle fait partie des 3 priorités choisies dans la fiche. Une autre priorité, « chez moi », n'a qu'une petite part (10 %).
   - Nourriture et Ami font chacune près d'un quart de l'XP.
6. **Projets :** un projet perso est en cours (2 étapes faites).

Ce qui marche : les **rituels**, l'**assiette**, les **proches** et le **sommeil**. Ce sont des choses qu'on fait de toute façon, avec un geste simple à l'endroit où on les fait.

Pistes (à valider, rien n'est changé) : voir la réponse du 27/10 et la feuille de route.

---

## 6. Inventaire complet

<!-- INVENTAIRE (généré par outils/inventaire.py, ne pas éditer à la main) -->

430 éléments au total. Colonnes : titre tel qu'affiché (les [crochets] sont remplis par l'appli), catégorie (barre de stat), XP, créneau, comment on la réalise, lignes du titre sur une carte de quête (265 px).

### Quêtes pour toi (59)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Regarder une interview de [artiste] — Tu écoutes [artiste] | Talent | 15 | 12–24 h | Fait | 1 |
| Un album de [artiste] en entier, sans écran — Tu écoutes [artiste] | Talent | 15 | 10–24 h | Fait | 2 |
| Découvrir 3 artistes proches de [artiste] — Tu écoutes [artiste] | Talent | 10 | 9–24 h | Compteur 3 | 2 |
| Faire un beat dans l'esprit de [artiste] (30 min) — Tu fais du son et tu écoutes [artiste] | Talent | 30 | 10–24 h | Minuteur 30 min | 2 |
| Décortiquer un son de [artiste] : intro, couplet, refrain, ce qui t'accroche — Pour nourrir ton son | Talent | 15 | 10–24 h | Fait | 3 |
| Regarder un live ou un concert filmé de [artiste] — Tu écoutes [artiste] | Talent | 15 | 18–24 h | Fait | 2 |
| Envoyer 2 candidatures — Tu cherches un travail | Travail | 30 | 9–18 h | Compteur 2 | 1 |
| Repérer 5 offres qui te donnent envie — Tu cherches un travail | Travail | 15 | 9–20 h | Compteur 5 | 2 |
| Améliorer ton CV pendant 15 min — Tu cherches un travail | Travail | 15 | 9–20 h | Minuteur 15 min | 1 |
| Écrire à quelqu'un de ton réseau pour un conseil — Un contact vaut dix candidatures | Travail | 20 | 9–19 h | Fait | 2 |
| Réviser 25 min, téléphone dans une autre pièce — Tu es étudiant·e | Travail | 20 | 9–22 h | Minuteur 25 min | 2 |
| Préparer tes affaires pour demain — Demain matin sera plus simple | Maison | 10 | 19–24 h | Fait | 1 |
| Noter les 3 choses importantes de demain — Pour attaquer demain sans réfléchir | Travail | 10 | 18–24 h | Compteur 3 | 2 |
| Vider ta boîte mail pendant 10 min — Tu travailles | Travail | 10 | 9–18 h | Minuteur 10 min | 1 |
| 45 min sur ton projet principal — Tu es à ton compte | Travail | 30 | 9–19 h | Minuteur 45 min | 1 |
| Marche rapide de 20 min dehors — Pour ta forme | Force | 15 | 8–20 h | Minuteur 20 min | 1 |
| 15 min de sport à la maison : pompes, squats, gainage — Pour ta forme | Force | 15 | 8–22 h | Compteur de pompes | 2 |
| 10 min d'étirements avant de dormir — Pour ta forme et ton sommeil | Force | 10 | 20–24 h | Étirements guidés | 1 |
| Écrans coupés 30 min avant de dormir — Pour mieux dormir | Soi | 15 | 21–24 h | Minuteur 30 min | 2 |
| Aérer ta chambre 5 min avant de te coucher — Pour mieux dormir | Maison | 5 | 20–24 h | Fait | 2 |
| Une sieste de 20 min, pas plus — Ta nuit a été courte | Soi | 10 | 12–16 h | Minuteur 20 min | 1 |
| Une heure sans réseaux, à partir de maintenant — Moins d'écrans | Soi | 15 | 13–18 h | Fait | 2 |
| Proposer une sortie ce week-end à un ami — Pour tes potes | Ami | 15 | 10–22 h | Fait + Avec qui ? | 2 |
| Voir un ami dehors aujourd'hui — Il fait beau, profites-en à deux | Ami | 25 | 11–21 h | Fait + Avec qui ? | 1 |
| Appeler un pote 10 min, juste pour parler — Pour tes potes | Ami | 15 | 11–23 h | Minuteur 10 min + Avec qui ? | 2 |
| Envoyer une photo de ta journée à ta famille — Pour ta famille | Famille | 10 | 12–22 h | Fait + Avec qui ? | 2 |
| Rendre un petit service à quelqu'un chez toi — À la maison | Maison | 10 | 10–22 h | Fait | 2 |
| Noter tes dépenses de la semaine — Pour tes finances | Maison | 15 | 10–22 h | Fait | 1 |
| Repérer un abonnement que tu peux arrêter — Pour tes finances | Maison | 15 | 10–22 h | Fait | 2 |
| 20 min sur une compétence : un tuto, un cours, une vidéo — Tu veux apprendre | Talent | 20 | 9–23 h | Minuteur 20 min | 2 |
| Ranger une seule zone pendant 10 min — Pour ton chez-toi | Maison | 10 | 9–22 h | Minuteur 10 min | 2 |
| Envoyer un vocal d'une minute à ton ami le plus proche — Pour ton moral | Ami | 10 | 12–23 h | Fait + Avec qui ? | 2 |
| 10 min au soleil, sans rien faire — Il fait beau dehors | Soi | 10 | 9–18 h | Minuteur 10 min | 1 |
| Cuisiner un vrai repas maison — Pour manger mieux | Nourriture | 20 | 11–21 h | Assiette | 1 |
| Tester une recette que tu n'as jamais faite — Tu aimes cuisiner | Nourriture | 25 | 11–21 h | Assiette | 2 |
| Matrix (1999) — Un film culte à voir | Talent | 20 | 18–24 h | Fait | 1 |
| Lire 20 pages — Tu aimes lire | Talent | 15 | 9–24 h | Lecture (pages) | 1 |
| Finir une mission en jeu, après tes rituels — Tu as bien bossé | Talent | 10 | 17–24 h | Fait | 2 |
| Dessiner 15 min — Tu aimes dessiner | Talent | 15 | 9–24 h | Minuteur 15 min | 1 |
| Sortir faire 10 photos de ton quartier — Belle lumière dehors | Talent | 20 | 9–19 h | Compteur 10 | 1 |
| Balade dans un parc ou en forêt — Tu aimes la nature | Force | 20 | 9–19 h | Fait | 1 |
| Préparer ta tenue de demain — Tu aimes la mode | Soi | 10 | 19–24 h | Fait | 1 |
| Faire du son pendant 30 min — Ta musique avance | Talent | 30 | 10–24 h | Minuteur 30 min | 1 |
| [note] : 20 min pour avancer — Ce qui compte pour toi en ce moment | Talent | 25 | 9–23 h | Minuteur 20 min | 1 |
| Trier 50 photos : doublons, flous et captures d'écran à la corbeille — Tri : photos | Maison | 15 | 9–23 h | Compteur 50 | 2 |
| Faire le tri dans tes notes : 10 à supprimer ou à ranger — Tri : notes | Maison | 10 | 9–23 h | Fait | 2 |
| Archiver les vieilles conversations et nettoyer 10 contacts — Tri : messages et contacts | Maison | 10 | 9–23 h | Fait | 2 |
| Te désabonner de 5 newsletters et vider ta boîte de réception — Tri : mails | Maison | 15 | 9–23 h | Fait | 2 |
| Supprimer les applis que tu n'as pas ouvertes depuis un mois — Tri : applis | Maison | 10 | 9–23 h | Fait | 2 |
| Trier un réseau : 10 abonnements en moins, et un œil sur tes abonnés — Tri : réseaux | Maison | 10 | 9–23 h | Fait | 2 |
| Couper les notifications de 5 applis qui ne servent à rien — Tri : notifications | Maison | 10 | 9–23 h | Fait | 2 |
| Régler un mode de concentration pour le soir ou le travail — Tri : modes de concentration | Maison | 10 | 9–23 h | Fait | 2 |
| Choisir un nouveau fond d'écran qui te ressemble — Tri : fond d'écran | Maison | 5 | 9–23 h | Fait | 2 |
| Ranger tes photos récentes dans des albums — Tri : albums photos | Maison | 15 | 9–23 h | Fait | 2 |
| Faire le tri dans la musique enregistrée sur ton téléphone — Tri : musique locale | Maison | 10 | 9–23 h | Fait | 2 |
| Trier tes titres likés Spotify et ranger 10 sons dans des playlists — Tri : spotify | Maison | 15 | 9–23 h | Fait | 2 |
| Ranger tes lieux enregistrés dans Plans ou Maps : listes et favoris — Tri : cartes | Maison | 10 | 9–23 h | Fait | 2 |
| Ranger 10 fichiers de ton Drive dans des dossiers — Tri : docs et drive | Maison | 15 | 9–23 h | Fait | 2 |
| Vider les téléchargements et ranger l'app Fichiers — Tri : fichiers | Maison | 10 | 9–23 h | Fait | 2 |

### Quêtes du moment (7)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| 5 min dehors à la lumière du matin | Soi | 15 | 7–10.5 h | Fait | 1 |
| Manger dehors ou près d'une fenêtre | Soi | 15 | 12–14.5 h | Fait | 1 |
| 10 min de marche autour du pâté de maisons | Force | 10 | 15–17 h | Minuteur 10 min | 2 |
| 5 min dehors au coucher du soleil | Soi | 20 | 18.3–20.3 h | Fait | 1 |
| Préparer ta tenue et ton sac pour demain | Maison | 10 | 21–23.5 h | Fait | 2 |
| Aller au marché ou à la boulangerie à pied | Force | 25 | 10–18 h | Fait | 2 |
| Voir quelqu'un en vrai aujourd'hui | Ami | 25 | 11–22 h | Fait + Avec qui ? | 1 |

### Tri (ménage numérique) (15)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Trier 50 photos : doublons, flous et captures d'écran à la corbeille — Tri : Photos | Maison | 15 |  | Compteur 50 | 2 |
| Faire le tri dans tes notes : 10 à supprimer ou à ranger — Tri : Notes | Maison | 10 |  | Fait | 2 |
| Archiver les vieilles conversations et nettoyer 10 contacts — Tri : Messages et contacts | Maison | 10 |  | Fait | 2 |
| Te désabonner de 5 newsletters et vider ta boîte de réception — Tri : Mails | Maison | 15 |  | Fait | 2 |
| Supprimer les applis que tu n'as pas ouvertes depuis un mois — Tri : Applis | Maison | 10 |  | Fait | 2 |
| Trier un réseau : 10 abonnements en moins, et un œil sur tes abonnés — Tri : Réseaux | Maison | 10 |  | Fait | 2 |
| Couper les notifications de 5 applis qui ne servent à rien — Tri : Notifications | Maison | 10 |  | Fait | 2 |
| Régler un mode de concentration pour le soir ou le travail — Tri : Modes de concentration | Maison | 10 |  | Fait | 2 |
| Choisir un nouveau fond d'écran qui te ressemble — Tri : Fond d'écran | Maison | 5 |  | Fait | 2 |
| Ranger tes photos récentes dans des albums — Tri : Albums photos | Maison | 15 |  | Fait | 2 |
| Faire le tri dans la musique enregistrée sur ton téléphone — Tri : Musique locale | Maison | 10 |  | Fait | 2 |
| Trier tes titres likés Spotify et ranger 10 sons dans des playlists — Tri : Spotify | Maison | 15 |  | Fait | 2 |
| Ranger tes lieux enregistrés dans Plans ou Maps : listes et favoris — Tri : Cartes | Maison | 10 |  | Fait | 2 |
| Ranger 10 fichiers de ton Drive dans des dossiers — Tri : Docs et Drive | Maison | 15 |  | Fait | 2 |
| Vider les téléchargements et ranger l'app Fichiers — Tri : Fichiers | Maison | 10 |  | Fait | 2 |

### Surprise du jour (20)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Finir une instru laissée de côté | Talent | 20 |  | Fait | 1 |
| Enregistrer une maquette voix | Talent | 20 |  | Fait | 1 |
| Faire écouter un son à quelqu'un | Talent | 20 |  | Fait | 1 |
| Refaire un son connu à ta façon | Talent | 20 |  | Fait | 1 |
| 16 mesures en 20 min chrono | Talent | 10 |  | Minuteur 20 min | 1 |
| Poster un extrait de son | Talent | 20 |  | Fait | 1 |
| 20 min de marche sans téléphone | Force | 10 |  | Minuteur 20 min | 1 |
| Battre ton record de pompes | Force | 10 |  | Compteur de pompes | 1 |
| Étirements avant de dormir | Force | 10 |  | Étirements guidés | 1 |
| 20 min de marche dehors | Soi | 10 |  | Minuteur 20 min | 1 |
| Lire 10 pages | Soi | 10 |  | Lecture (pages) | 1 |
| Couper le téléphone 1 h avant de dormir | Soi | 10 |  | Minuteur 60 min | 2 |
| Prendre un rendez-vous médecin ou dentiste en retard | Soi | 20 |  | Fait | 2 |
| Trier un tiroir ou une étagère | Maison | 10 |  | Fait | 1 |
| Vider entièrement l'évier | Maison | 10 |  | Fait | 1 |
| Laver ta gourde ou ta tasse | Maison | 3 |  | Fait | 1 |
| Envoyer un vocal à quelqu'un perdu de vue | Ami | 20 |  | Fait + Avec qui ? | 2 |
| Ramener un café ou une viennoiserie à quelqu'un | Ami | 20 |  | Fait + Avec qui ? | 2 |
| Envoyer une photo souvenir à la famille | Famille | 10 |  | Fait + Avec qui ? | 2 |
| Aider à une tâche chez tes parents | Famille | 20 |  | Fait + Avec qui ? | 1 |

### Idée sortie (32)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Une jam session ouverte dans un bar — Jam session | Ami | 35 |  | Fait + Avec qui ? | 2 |
| Une scène ouverte de stand-up, en spectateur — Stand-up | Ami | 30 |  | Fait + Avec qui ? | 2 |
| Une soirée quiz ou blind test dans un bar — Soirée quiz | Ami | 30 |  | Fait + Avec qui ? | 2 |
| La dernière séance d'un film en VO — Cinéma | Ami | 25 |  | Fait + Avec qui ? | 1 |
| Un vieux film culte au ciné-club ou en rétrospective — Cinéma | Ami | 30 |  | Fait + Avec qui ? | 2 |
| Le concert d'un groupe local que tu ne connais pas — Concert | Ami | 35 |  | Fait + Avec qui ? | 2 |
| Un karaoké avec des potes — Karaoké | Ami | 30 |  | Fait + Avec qui ? | 1 |
| Un bar à jeux : tester un jeu de société inconnu — Bar à jeux | Ami | 30 |  | Fait + Avec qui ? | 2 |
| Un match d'impro théâtrale — Théâtre | Ami | 30 |  | Fait + Avec qui ? | 1 |
| Du jazz dans une cave ou un petit bar — Concert | Ami | 30 |  | Fait + Avec qui ? | 2 |
| Un escape game à deux ou plus — Escape game | Ami | 35 |  | Fait + Avec qui ? | 1 |
| Bowling ou billard, la revanche — Bowling ou billard | Ami | 25 |  | Fait + Avec qui ? | 1 |
| Une soirée slam ou lecture en librairie — Scène ouverte | Ami | 30 |  | Fait + Avec qui ? | 2 |
| Un cours d'essai de salsa ou de danse — Cours d'essai | Ami | 35 |  | Fait + Avec qui ? | 2 |
| Une salle d'arcade ou des flippers — Arcade | Ami | 25 |  | Fait + Avec qui ? | 1 |
| Un marché nocturne ou un food market — Marché | Ami | 25 |  | Fait + Avec qui ? | 2 |
| Une brocante ou un vide-grenier — Brocante | Ami | 25 |  | Fait + Avec qui ? | 1 |
| Chiner un vinyle à moins de 5 € chez un disquaire — Disquaire | Ami | 25 |  | Fait + Avec qui ? | 2 |
| Une friperie : une tenue complète à moins de 20 € — Friperie | Ami | 25 |  | Fait + Avec qui ? | 2 |
| Une expo dans une petite galerie gratuite — Musée ou expo | Ami | 25 |  | Fait + Avec qui ? | 2 |
| Un atelier d'initiation : poterie, sérigraphie ou cuisine — Atelier | Ami | 40 |  | Fait + Avec qui ? | 2 |
| Une séance découverte en salle d'escalade — Escalade | Ami | 35 |  | Fait + Avec qui ? | 2 |
| Louer un kayak ou un paddle — Kayak ou paddle | Ami | 40 |  | Fait + Avec qui ? | 1 |
| Un restaurant d'une cuisine jamais goûtée (éthiopienne, géorgienne…) — Restaurant | Ami | 30 |  | Fait + Avec qui ? | 2 |
| Prendre un train régional vers une ville à moins d'une heure — Excursion | Ami | 45 |  | Fait + Avec qui ? | 2 |
| Une visite guidée de ta propre ville — Visite guidée | Ami | 35 |  | Fait + Avec qui ? | 1 |
| Un match de sport amateur du coin (rugby, hand, foot) — Match | Ami | 25 |  | Fait + Avec qui ? | 2 |
| Le planétarium ou une soirée d'observation des étoiles — Planétarium | Ami | 35 |  | Fait + Avec qui ? | 2 |
| Accrobranche ou trampoline park — Accrobranche | Ami | 35 |  | Fait + Avec qui ? | 1 |
| Un festival ou une fête de quartier ce week-end — Festival | Ami | 35 |  | Fait + Avec qui ? | 2 |
| La bibliothèque : un livre pris au hasard dans un rayon inconnu — Bibliothèque | Ami | 20 |  | Fait + Avec qui ? | 2 |
| Un concert classique ou d'orgue gratuit dans une église — Concert | Ami | 30 |  | Fait + Avec qui ? | 2 |

### Objectif « forme » (2)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| 30 min de marche | Force | 25 |  | Minuteur 30 min | 1 |
| 20 pompes, 20 squats, 1 min de gainage | Force | 20 |  | Compteur de pompes | 2 |

### Objectif « sommeil » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| (se coucher à l'heure) | Soi | — |  | Fait | 1 |

### Objectif « ecrans » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Poser le téléphone dans une autre pièce pendant 1 h | Soi | 15 |  | Minuteur 60 min | 2 |

### Objectif « manger » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Cuisiner un repas maison avec un légume | Nourriture | 20 |  | Assiette | 2 |

### Objectif « chez » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| @room | Soi | — |  | Fait | 1 |

### Objectif « argent » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Noter tes dépenses de la semaine | Travail | 15 |  | Fait | 1 |

### Objectif « apprendre » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Regarder un tuto de 20 min et le refaire | Soi | 20 |  | Minuteur 20 min | 2 |

### Objectif « moral » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| 15 min dehors sans écouteurs | Soi | 15 |  | Minuteur 15 min | 1 |

### Objectif « job » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Envoyer une candidature | Travail | 25 |  | Fait | 1 |

### Objectif « son » (1)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| 30 min sur un morceau en cours | Talent | 25 |  | Minuteur 30 min | 1 |

### Événement à venir (26)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Écouter la setlist probable de [artiste] pour connaître les sons par cœur — J-7 (événement « concert ») | Talent | 15 |  | Fait | 3 |
| Regarder une interview récente de [artiste] — J-4 (événement « concert ») | Talent | 15 |  | Fait | 2 |
| Proposer à un pote de venir au concert avec toi — J-6 (événement « concert ») | Ami | 15 |  | Fait + Avec qui ? | 2 |
| Préparer ta tenue et ton sac : billet, batterie, bouchons d'oreilles — J-1 (événement « concert ») | Soi | 15 |  | Fait | 2 |
| Vérifier ton billet, l'heure d'ouverture des portes et le trajet — J-1 (événement « concert ») | Soi | 10 |  | Fait | 2 |
| Bien manger et boire un grand verre d'eau avant le concert — J-0 (événement « concert ») | Nourriture | 10 |  | Fait | 2 |
| Noter tes 3 meilleurs moments du concert — J--1 (événement « concert ») | Soi | 15 |  | Fait | 2 |
| Envoyer une photo ou une vidéo du concert à un pote — J--1 (événement « concert ») | Ami | 10 |  | Fait + Avec qui ? | 2 |
| Te renseigner 20 min sur l'entreprise — J-6 (événement « entretien ») | Travail | 20 |  | Minuteur 20 min | 1 |
| Préparer tes réponses à 3 questions classiques d'entretien — J-4 (événement « entretien ») | Travail | 25 |  | Fait | 2 |
| Préparer ta tenue et ton trajet pour l'entretien — J-1 (événement « entretien ») | Soi | 15 |  | Fait | 2 |
| Envoyer un mail de remerciement après l'entretien — J--1 (événement « entretien ») | Travail | 15 |  | Fait | 2 |
| Réviser 30 min, téléphone dans une autre pièce — J-10 (événement « examen ») | Travail | 25 |  | Minuteur 30 min | 2 |
| Faire une fiche de révision — J-5 (événement « examen ») | Travail | 20 |  | Fait | 1 |
| Préparer tes affaires et te coucher tôt — J-1 (événement « examen ») | Soi | 15 |  | Fait | 2 |
| Faire la liste de ce qu'il faut emporter — J-7 (événement « voyage ») | Maison | 15 |  | Fait | 1 |
| Faire ta valise — J-2 (événement « voyage ») | Maison | 20 |  | Fait | 1 |
| Vérifier billets, papiers et chargeurs — J-1 (événement « voyage ») | Soi | 10 |  | Fait | 1 |
| Proposer d'apporter quelque chose — J-4 (événement « soiree ») | Ami | 15 |  | Fait + Avec qui ? | 1 |
| Un grand verre d'eau avant de sortir — J-0 (événement « soiree ») | Nourriture | 5 |  | Fait | 1 |
| Envoyer un petit message pour remercier de la soirée — J--1 (événement « soiree ») | Ami | 10 |  | Fait + Avec qui ? | 2 |
| Noter tes questions pour le rendez-vous — J-3 (événement « rdv ») | Soi | 10 |  | Fait | 2 |
| Préparer les papiers nécessaires — J-1 (événement « rdv ») | Soi | 10 |  | Fait | 1 |
| Séance d'entraînement légère — J-7 (événement « sport ») | Force | 20 |  | Fait | 1 |
| Repos, hydratation et coucher tôt — J-1 (événement « sport ») | Soi | 10 |  | Fait | 1 |
| Préparer : [prénom] — J-2 (événement « autre ») | Soi | 10 |  | Fait | 1 |

### Fêtes (décembre) (24)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Faire ta liste de Noël | Famille | 10 |  | Fait + Avec qui ? | 1 |
| Écrire à quelqu'un que tu n'as pas vu depuis longtemps | Ami | 15 |  | Fait + Avec qui ? | 2 |
| Mettre une playlist de fêtes et ranger 10 min | Maison | 10 |  | Minuteur 10 min | 2 |
| Boire un chocolat chaud sans écran | Soi | 10 |  | Fait | 1 |
| Décorer un coin de chez toi | Maison | 15 |  | Fait | 1 |
| Regarder un film de Noël | Soi | 15 |  | Fait | 1 |
| Faire 16 mesures d'un son de saison | Talent | 20 |  | Fait | 1 |
| Préparer des biscuits ou un dessert de fêtes | Nourriture | 20 |  | Fait | 2 |
| Appeler un grand-parent ou un proche âgé | Famille | 20 |  | Fait + Avec qui ? | 2 |
| Donner un objet ou un vêtement dont tu ne te sers plus | Maison | 15 |  | Fait | 2 |
| Marcher 20 min dehors au froid | Force | 15 |  | Minuteur 20 min | 1 |
| Envoyer une photo souvenir à un ami | Ami | 10 |  | Fait + Avec qui ? | 2 |
| Lire 20 pages au chaud | Soi | 15 |  | Lecture (pages) | 1 |
| Offrir une boisson chaude à quelqu'un | Ami | 10 |  | Fait + Avec qui ? | 2 |
| Garder tes 10 meilleures photos de l'année | Soi | 15 |  | Fait | 2 |
| Emballer tes cadeaux | Maison | 15 |  | Fait | 1 |
| Préparer un plat pour quelqu'un | Nourriture | 20 |  | Fait | 1 |
| Trier les photos et les applis de ton téléphone | Soi | 15 |  | Fait | 2 |
| Remercier quelqu'un qui t'a aidé cette année | Ami | 15 |  | Fait + Avec qui ? | 2 |
| Écouter un album en entier sous un plaid | Soi | 15 |  | Fait | 2 |
| Cuisiner un plat de fêtes | Nourriture | 25 |  | Assiette | 1 |
| Envoyer tes vœux à un groupe | Ami | 15 |  | Fait + Avec qui ? | 1 |
| Préparer ta tenue du réveillon | Soi | 10 |  | Fait | 1 |
| Pas d'écran pendant le repas du réveillon | Famille | 25 |  | Fait + Avec qui ? | 2 |

### Nature du mois (12)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Marcher 20 min au soleil d'hiver — janvier | Soi | 10 |  | Minuteur 20 min | 1 |
| Repérer les premiers bourgeons en balade — février | Soi | 10 |  | Fait | 2 |
| Trouver les premières fleurs en balade — mars | Soi | 10 |  | Fait | 2 |
| Pique-nique ou repas dehors — avril | Soi | 10 |  | Fait | 1 |
| Lire 20 min dans un parc — mai | Soi | 10 |  | Lecture (pages) | 1 |
| Marcher pieds nus dans l'herbe 5 min — juin | Soi | 10 |  | Fait | 2 |
| Un bain de mer ou de lac — juillet | Soi | 10 |  | Fait | 1 |
| Dîner dehors à la fraîche — août | Soi | 10 |  | Fait | 1 |
| Cueillir des mûres ou des figues en balade — septembre | Soi | 10 |  | Fait | 2 |
| Ramasser des châtaignes ou des feuilles rouges en balade — octobre | Soi | 10 |  | Fait | 2 |
| Balade en forêt pour les couleurs d'automne — novembre | Soi | 10 |  | Fait | 2 |
| Aller voir les illuminations en ville — décembre | Soi | 10 |  | Fait | 1 |

### Centre d'intérêt « Jeu vidéo » (3)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Jeu vidéo : Session 1 h | Soi | 10 |  | Minuteur 60 min | 1 |
| Jeu vidéo : Avec des potes | Ami | 15 |  | Fait + Avec qui ? | 1 |
| Jeu vidéo : Jeu fini | Soi | 40 |  | Fait | 1 |

### Centre d'intérêt « Cinéphile » (3)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Cinéphile : Film | Soi | 15 |  | Fait | 1 |
| Cinéphile : Épisode | Soi | 5 |  | Fait | 1 |
| Cinéphile : Série finie | Soi | 30 |  | Fait | 1 |

### Centre d'intérêt « Lecture » (2)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Lecture : Lire | Soi | 10 |  | Lecture (pages) | 1 |
| Lecture : Livre fini | Soi | 40 |  | Fait | 1 |

### Centre d'intérêt « Cuisine » (2)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Cuisine : Repas maison | Nourriture | 10 |  | Assiette | 1 |
| Cuisine : Nouveau plat | Nourriture | 30 |  | Assiette | 1 |

### Centre d'intérêt « Organisation » (3)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Organisation : Planifier ma journée | Soi | 5 |  | Fait | 1 |
| Organisation : Préparer ma semaine | Soi | 20 |  | Fait | 1 |
| Organisation : Mails à zéro | Soi | 15 |  | Fait | 1 |

### Centre d'intérêt « Style » (2)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Style : Tenue soignée | Maison | 5 |  | Fait | 1 |
| Style : Tri de l'armoire | Maison | 20 |  | Fait | 1 |

### Centre d'intérêt « Exploration » (2)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Exploration : Nouveau lieu | Soi | 25 |  | Fait | 1 |
| Exploration : Sortie découverte | Soi | 15 |  | Fait | 1 |

### Centre d'intérêt « Photo / vidéo » (2)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Photo / vidéo : Séance | Talent | 10 |  | Fait | 1 |
| Photo / vidéo : Montage fini | Talent | 30 |  | Fait | 1 |

### Centre d'intérêt « Langue » (3)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Langue : Leçon 15 min | Soi | 10 |  | Minuteur 15 min | 1 |
| Langue : Film en VO | Soi | 15 |  | Fait | 1 |
| Langue : Conversation | Soi | 25 |  | Fait | 1 |

### Proches (fiche) (3)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| (titre dynamique) | Ami | 10 |  | Fait + Avec qui ? | 1 |
| (titre dynamique) | Ami | 20 |  | Fait + Avec qui ? | 1 |
| (titre dynamique) | Ami | 40 |  | Fait + Avec qui ? | 1 |

### Quêtes spéciales (groupes) (3)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Prendre des nouvelles de [prénom] | Ami | 15 |  | Fait + Avec qui ? | 1 |
| Faire un son [prénom] — groupe masqué | Talent | 35 |  | Fait | 1 |
| Appeler [prénom] — groupe masqué | Famille | 25 |  | Fait + Avec qui ? | 1 |

### Projets (étapes) (103)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Marcher 20 min — Se remettre en mouvement (« Canapix ») | Force | — |  | Minuteur 20 min | 1 |
| 3 séries de 10 pompes — Se remettre en mouvement (« Canapix ») | Force | — |  | Compteur de pompes | 1 |
| 10 min d'étirements — Se remettre en mouvement (« Canapix ») | Force | — |  | Étirements guidés | 1 |
| Prendre les escaliers toute la journée — Se remettre en mouvement (« Canapix ») | Force | — |  | Fait | 2 |
| 20 min de sport — Se remettre en mouvement (« Canapix ») | Force | — |  | Minuteur 20 min | 1 |
| Noter 3 objectifs sportifs — Construire ton programme (« Courbatou ») | Force | — |  | Fait | 1 |
| Choisir 3 jours fixes d'entraînement — Construire ton programme (« Courbatou ») | Force | — |  | Fait | 1 |
| Lister 5 exercices — Construire ton programme (« Courbatou ») | Force | — |  | Fait | 1 |
| Tester une séance complète — Construire ton programme (« Courbatou ») | Force | — |  | Fait | 1 |
| Noter tes séries et répétitions — Construire ton programme (« Courbatou ») | Force | — |  | Fait | 1 |
| 30 min de marche rapide ou de course — Repousser tes limites (« Souffléon ») | Force | — |  | Minuteur 30 min | 2 |
| Battre ton record de pompes — Repousser tes limites (« Souffléon ») | Force | — |  | Compteur de pompes | 1 |
| 2 min de gainage — Repousser tes limites (« Souffléon ») | Force | — |  | Minuteur gainage | 1 |
| 45 min de sport — Repousser tes limites (« Souffléon ») | Force | — |  | Minuteur 45 min | 1 |
| Écrire 4 lignes — Écrire un son (« Blanchou ») | Talent | — |  | Fait | 1 |
| Trouver une instru qui te plaît — Écrire un son (« Blanchou ») | Talent | — |  | Fait | 1 |
| Enregistrer une maquette voix — Écrire un son (« Blanchou ») | Talent | — |  | Fait | 1 |
| Finir un couplet — Écrire un son (« Blanchou ») | Talent | — |  | Fait | 1 |
| Faire écouter la maquette à {a1} — Écrire un son (« Blanchou ») | Talent | — |  | Fait | 1 |
| Ranger tes projets audio — Mettre de l'ordre dans tes sons (« Grésillon ») | Talent | — |  | Fait | 1 |
| Renommer proprement tes fichiers — Mettre de l'ordre dans tes sons (« Grésillon ») | Talent | — |  | Fait | 1 |
| Faire un premier mix — Mettre de l'ordre dans tes sons (« Grésillon ») | Talent | — |  | Fait | 1 |
| Comparer avec un son de référence — Mettre de l'ordre dans tes sons (« Grésillon ») | Talent | — |  | Fait | 1 |
| Exporter une version propre — Mettre de l'ordre dans tes sons (« Grésillon ») | Talent | — |  | Fait | 1 |
| Choisir le son à sortir — Sortir un son (« Timidrake ») | Talent | — |  | Fait | 1 |
| Créer la cover — Sortir un son (« Timidrake ») | Talent | — |  | Fait | 1 |
| Écrire la description — Sortir un son (« Timidrake ») | Talent | — |  | Fait | 1 |
| Programmer la sortie — Sortir un son (« Timidrake ») | Talent | — |  | Fait | 1 |
| Envoyer le son à {a2} — Sortir un son (« Timidrake ») | Talent | — |  | Fait | 1 |
| Écrire à {a1} — Reprendre contact (« Silencio ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Écrire à {a2} — Reprendre contact (« Silencio ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Écrire à {a3} — Reprendre contact (« Silencio ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Envoyer un vocal à {a4} — Reprendre contact (« Silencio ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Proposer un appel à {a5} — Reprendre contact (« Silencio ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Proposer une sortie à {a1} — Organiser une sortie (« Plutardos ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Fixer une date avec {a1} — Organiser une sortie (« Plutardos ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Choisir le lieu de la sortie — Organiser une sortie (« Plutardos ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Proposer la sortie {g1} — Organiser une sortie (« Plutardos ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Ajouter la sortie à ton agenda — Organiser une sortie (« Plutardos ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Reprendre contact avec {a1} — Entretenir les liens (« Lointin ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Faire un appel vidéo avec {a2} — Entretenir les liens (« Lointin ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Envoyer une petite attention à {a3} — Entretenir les liens (« Lointin ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Proposer à {a4} de passer le voir — Entretenir les liens (« Lointin ») | Ami | — |  | Fait + Avec qui ? | 1 |
| Demander la date d'anniversaire de {anb} — Entretenir les liens (« Lointin ») | Ami | — |  | Fait + Avec qui ? | 2 |
| Appeler {f1} — Donner des nouvelles (« Quoidneuf ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Appeler {f2} — Donner des nouvelles (« Quoidneuf ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Envoyer une photo à {f3} — Donner des nouvelles (« Quoidneuf ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Prendre des nouvelles de {f4} — Donner des nouvelles (« Quoidneuf ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Proposer un repas de famille à {f1} — Donner des nouvelles (« Quoidneuf ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Retrouver 5 vieilles photos de famille — Garder les souvenirs (« Nostalgelée ») | Famille | — |  | Fait + Avec qui ? | 2 |
| Créer un album partagé — Garder les souvenirs (« Nostalgelée ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Envoyer une vieille photo à {f1} — Garder les souvenirs (« Nostalgelée ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Demander une histoire de famille à {f2} — Garder les souvenirs (« Nostalgelée ») | Famille | — |  | Fait + Avec qui ? | 2 |
| Demander la recette préférée de {f3} — Garder les souvenirs (« Nostalgelée ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Proposer une date à {f1} pour se voir — Préparer des retrouvailles (« Câlinours ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Choisir une activité à faire ensemble — Préparer des retrouvailles (« Câlinours ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Trouver une idée de petit cadeau pour {f1} — Préparer des retrouvailles (« Câlinours ») | Famille | — |  | Fait + Avec qui ? | 2 |
| Appeler {f1} pour caler les détails — Préparer des retrouvailles (« Câlinours ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Noter la date dans ton agenda — Préparer des retrouvailles (« Câlinours ») | Famille | — |  | Fait + Avec qui ? | 1 |
| Vider le sol — Ranger ta chambre (« Bazardine ») | Maison | — |  | Fait | 1 |
| Faire la poussière — Ranger ta chambre (« Bazardine ») | Maison | — |  | Fait | 1 |
| Ranger le bureau — Ranger ta chambre (« Bazardine ») | Maison | — |  | Fait | 1 |
| Trier une étagère — Ranger ta chambre (« Bazardine ») | Maison | — |  | Fait | 1 |
| Passer l'aspirateur — Ranger ta chambre (« Bazardine ») | Maison | — |  | Fait | 1 |
| Trier les photos — Trier ton téléphone (« Stockagros ») | Maison | — |  | Fait | 1 |
| Vider la boîte mail — Trier ton téléphone (« Stockagros ») | Maison | — |  | Fait | 1 |
| Supprimer les applis inutiles — Trier ton téléphone (« Stockagros ») | Maison | — |  | Fait | 1 |
| Nettoyer l'écran et la coque — Trier ton téléphone (« Stockagros ») | Maison | — |  | Fait | 1 |
| Ranger l'écran d'accueil — Trier ton téléphone (« Stockagros ») | Maison | — |  | Fait | 1 |
| Sauvegarder le téléphone — Trier ton téléphone (« Stockagros ») | Maison | — |  | Fait | 1 |
| Sortir les vêtements trop petits — Trier tes vêtements (« Fripouille ») | Maison | — |  | Fait | 1 |
| Plier et ranger — Trier tes vêtements (« Fripouille ») | Maison | — |  | Fait | 1 |
| Faire un sac de dons — Trier tes vêtements (« Fripouille ») | Maison | — |  | Fait | 1 |
| Ranger les vêtements de l'autre saison — Trier tes vêtements (« Fripouille ») | Maison | — |  | Fait | 2 |
| Organiser les chaussures — Trier tes vêtements (« Fripouille ») | Maison | — |  | Fait | 1 |
| 1 h sans réseaux sociaux — Reprendre ton attention (« Scrollito ») | Soi | — |  | Minuteur 60 min | 1 |
| Couper les notifications inutiles — Reprendre ton attention (« Scrollito ») | Soi | — |  | Fait | 1 |
| Lire 10 pages — Reprendre ton attention (« Scrollito ») | Soi | — |  | Lecture (pages) | 1 |
| 10 min de méditation — Reprendre ton attention (« Scrollito ») | Soi | — |  | Méditation guidée | 1 |
| Téléphone dans une autre pièce pendant 1 h — Reprendre ton attention (« Scrollito ») | Soi | — |  | Minuteur 60 min | 2 |
| Préparer tes affaires pour demain — Mieux dormir (« Roupillon ») | Soi | — |  | Fait | 1 |
| Pas d'écran 30 min avant de dormir — Mieux dormir (« Roupillon ») | Soi | — |  | Minuteur 30 min | 1 |
| Régler un réveil à heure fixe — Mieux dormir (« Roupillon ») | Soi | — |  | Fait | 1 |
| Aérer la chambre — Mieux dormir (« Roupillon ») | Soi | — |  | Fait | 1 |
| Écrire 3 qualités que tu as — Avancer vers un objectif (« Peut-Êtron ») | Soi | — |  | Fait | 1 |
| Noter un objectif à 3 mois — Avancer vers un objectif (« Peut-Êtron ») | Soi | — |  | Fait | 1 |
| Découper l'objectif en étapes — Avancer vers un objectif (« Peut-Êtron ») | Soi | — |  | Fait | 1 |
| Faire la première étape — Avancer vers un objectif (« Peut-Êtron ») | Soi | — |  | Fait | 1 |
| Ranger le bureau de l'ordi — Te concentrer (« Bipbip ») | Travail | — |  | Fait | 1 |
| Faire la to-do du jour — Te concentrer (« Bipbip ») | Travail | — |  | Fait | 1 |
| 25 min de travail concentré — Te concentrer (« Bipbip ») | Travail | — |  | Minuteur 25 min | 1 |
| Répondre aux mails urgents — Te concentrer (« Bipbip ») | Travail | — |  | Fait | 1 |
| Fermer les onglets inutiles — Te concentrer (« Bipbip ») | Travail | — |  | Fait | 1 |
| Lister les tâches repoussées — Débloquer ce qui traîne (« Demainou ») | Travail | — |  | Fait | 1 |
| Faire la plus petite — Débloquer ce qui traîne (« Demainou ») | Travail | — |  | Fait | 1 |
| Faire la plus redoutée — Débloquer ce qui traîne (« Demainou ») | Travail | — |  | Fait | 1 |
| Bloquer 1 h dans l'agenda — Débloquer ce qui traîne (« Demainou ») | Travail | — |  | Minuteur 60 min | 1 |
| Finir une tâche en entier — Débloquer ce qui traîne (« Demainou ») | Travail | — |  | Fait | 1 |
| Définir l'objectif du dossier — Boucler un dossier (« Paperasson ») | Travail | — |  | Fait | 1 |
| Rassembler les documents — Boucler un dossier (« Paperasson ») | Travail | — |  | Fait | 1 |
| Faire un premier jet — Boucler un dossier (« Paperasson ») | Travail | — |  | Fait | 1 |
| Relire et corriger — Boucler un dossier (« Paperasson ») | Travail | — |  | Fait | 1 |
| Envoyer le dossier — Boucler un dossier (« Paperasson ») | Travail | — |  | Fait | 1 |

### Modèles « Créer » (24)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Courir 20 min — action | Force | — |  | Minuteur 20 min | 1 |
| Séance de muscu — action | Force | — |  | Fait | 1 |
| Préparer un 10 km — projet | Force | — |  | Fait | 1 |
| Faire la vaisselle — action | Maison | — |  | Fait | 1 |
| Lessive — action | Maison | — |  | Fait | 1 |
| Courses de la semaine — action | Maison | — |  | Course guidée | 1 |
| Ranger le garage — projet | Maison | — |  | Fait | 1 |
| Journal du soir — action | Soi | — |  | Fait | 1 |
| Prendre rendez-vous chez le médecin — projet | Soi | — |  | Fait | 2 |
| Prendre des nouvelles d'un ami — action | Ami | — |  | Fait + Avec qui ? | 1 |
| Proposer une sortie — action | Ami | — |  | Fait + Avec qui ? | 1 |
| Organiser un anniversaire — projet | Ami | — |  | Fait + Avec qui ? | 1 |
| Appeler mes parents — action | Famille | — |  | Fait + Avec qui ? | 1 |
| Repas en famille — action | Famille | — |  | Fait + Avec qui ? | 1 |
| Album photo de famille — projet | Famille | — |  | Fait + Avec qui ? | 1 |
| Bloc de concentration 1 h — action | Travail | — |  | Minuteur 60 min | 1 |
| Boîte mail à zéro — action | Travail | — |  | Fait | 1 |
| Refaire mon CV — projet | Travail | — |  | Fait | 1 |
| Faire du son 30 min — action | Talent | — |  | Minuteur 30 min | 1 |
| Dessiner 15 min — action | Talent | — |  | Minuteur 15 min | 1 |
| Sortir un son — projet | Talent | — |  | Fait | 1 |
| Cuisiner un vrai repas — action | Nourriture | — |  | Assiette | 1 |
| Préparer mes repas du dimanche — action | Nourriture | — |  | Fait | 1 |
| Apprendre 5 recettes — projet | Nourriture | — |  | Fait | 1 |

### Noter une action (panneau +) (39)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Ranger → Chambre, Salon, Cuisine, Salle de bain, Bureau, Entrée… — rappel après 7 / 14 j | Maison | 10 |  | Fait | 2 |
| Nettoyer → Sol, Cuisine, Salle de bain, Toilettes, Vitres, Frigo… — rappel après 7 / 14 j | Maison | 10 |  | Fait | 2 |
| Linge → Lancer une machine, Étendre, Plier et ranger, Repasser, Changer les draps — rappel après 5 / 10 j | Maison | 6 |  | Fait | 3 |
| Vaisselle → Laver, Ranger, Lave-vaisselle — rappel après 2 / 4 j | Maison | 6 |  | Fait | 2 |
| Petites tâches → Sortir les poubelles, Courses, Arroser les plantes, Réparer un truc — rappel après 5 / 10 j | Maison | 5 |  | Course guidée | 3 |
| Garde-robe → Trier l'armoire, Tenue soignée | Maison | 8 |  | Fait | 2 |
| Tri du téléphone → Photos, Notes, Messages et contacts, Mails, Applis, Réseaux… — rappel après 30 / 60 j | Maison | 10 |  | Fait | 3 |
| Renforcement → Pompes, Squats, Gainage, Abdos, Tractions — rappel après 3 / 7 j | Force | 10 |  | Compteur de pompes | 2 |
| Cardio → Marche, Course, Vélo, Natation, Corde à sauter — rappel après 4 / 10 j | Force | 15 |  | Course guidée | 2 |
| Souplesse → Étirements, Yoga, Mobilité — rappel après 4 / 10 j | Force | 8 |  | Étirements guidés | 2 |
| Sport à plusieurs → Foot, Basket, Escalade, Danse, Autre sport — rappel après 10 / 21 j | Force | 20 |  | Fait | 2 |
| Bouger au quotidien → Trajet à pied, Trajet à vélo, Escaliers | Force | 8 |  | Fait | 2 |
| Se poser → Méditer, Respirer, Pause sans écran — rappel après 3 / 7 j | Soi | 10 |  | Méditation guidée | 2 |
| Sieste → Sieste | Soi | 8 |  | Fait | 1 |
| Prendre soin de moi → Coiffeur, Masque, Bain, Ongles, Crème — rappel après 7 / 14 j | Soi | 8 |  | Fait | 2 |
| Santé → Dentiste, Médecin, Kiné, Ophtalmo, Prise de sang — rappel après 150 / 240 j | Soi | 15 |  | Fait | 2 |
| Écrire → Journal, Gratitude, Pensées — rappel après 4 / 10 j | Soi | 8 |  | Fait | 1 |
| Prendre l'air → Balade, Soleil, Nature, Nouveau lieu — rappel après 3 / 7 j | Soi | 8 |  | Fait | 2 |
| Bien dormir → Coucher avant minuit, Pas d'écran au lit | Soi | 10 |  | Fait | 2 |
| Cuisiner → Repas maison, Nouveau plat, Pâtisserie, Préparer demain — rappel après 3 / 7 j | Nourriture | 12 |  | Assiette | 2 |
| Boire de l'eau → Un verre | Eau | 3 |  | Fait | 1 |
| Journée sans… → Soda, Sucre, Grignotage | Nourriture | 10 |  | Fait | 2 |
| Travail concentré → Dossier, Candidature, Révisions, Projet perso | Travail | 15 |  | Fait | 2 |
| Administratif → Mails, Papiers, Rendez-vous pris, Factures — rappel après 3 / 7 j | Travail | 10 |  | Fait | 2 |
| Planifier → Ma journée, Ma semaine | Travail | 8 |  | Fait | 1 |
| Tâche importante finie → Fini ! | Travail | 25 |  | Fait | 1 |
| Lire → Livre, BD ou manga, Article, Livre fini — rappel après 3 / 7 j | Soi | 10 |  | Fait | 2 |
| Regarder → Film, Épisode, Série finie, Documentaire | Soi | 10 |  | Fait | 2 |
| Jouer → Jeu vidéo, Jeu de société, Jeu fini | Soi | 10 |  | Fait | 2 |
| Sortir → Cinéma, Concert, Musée ou expo, Théâtre, Restaurant, Bar… — rappel après 14 / 30 j | Soi | 20 |  | Fait | 2 |
| Écouter → Album, Podcast, Concert | Soi | 8 |  | Fait | 1 |
| Musique → Faire du son,Faire du son (1 h), Écrire un texte,Écrire un couplet — rappel après 3 / 7 j | Talent | 20 |  | Minuteur 60 min | 3 |
| Image → Séance photo, Vidéo, Montage | Talent | 12 |  | Fait | 2 |
| Dessin et art → Dessin, Peinture, Bricolage — rappel après 7 / 14 j | Talent | 12 |  | Fait | 2 |
| Langue → Leçon, Film en VO, Conversation — rappel après 3 / 7 j | Soi | 10 |  | Fait | 2 |
| Apprendre → Tuto, Formation, Lecture utile | Soi | 12 |  | Fait | 2 |
| Prendre des nouvelles → Message, Appel, Vocal | Ami | 10 |  | Fait + Avec qui ? | 2 |
| Voir quelqu'un → Café, Repas, Soirée, Activité, Visite | Ami | 20 |  | Fait + Avec qui ? | 2 |
| Rendre service → Un coup de main | Ami | 15 |  | Fait + Avec qui ? | 1 |

### Bonnes actions (liste) (24)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Avancer sur le dossier (30 min) | Travail | 20 |  | Minuteur 30 min | 1 |
| Se brosser les dents | Soi | 3 |  | Fait | 1 |
| 1 verre d'eau | Eau | 3 |  | Fait | 1 |
| 10 pompes | Force | 3 |  | Compteur de pompes | 1 |
| 20 squats | Force | 3 |  | Compteur de pompes | 1 |
| 1 min de gainage | Force | 3 |  | Minuteur gainage | 1 |
| 10 min de marche rapide | Force | 10 |  | Minuteur 10 min | 1 |
| 5 min d'étirements | Force | 3 |  | Étirements guidés | 1 |
| Lire | Soi | 10 |  | Lecture (pages) | 1 |
| Méditer 10 min | Soi | 10 |  | Méditation guidée | 1 |
| Se coucher avant minuit | Soi | 10 |  | Fait | 1 |
| Trier ses déchets | Maison | 3 |  | Fait | 1 |
| Trajet à pied ou à vélo | Force | 10 |  | Fait | 1 |
| Faire la vaisselle | Maison | 10 |  | Fait | 1 |
| Ranger sa chambre | Maison | 10 |  | Fait | 1 |
| Faire une lessive | Maison | 10 |  | Fait | 1 |
| Ranger 10 min | Maison | 10 |  | Minuteur 10 min | 1 |
| Écouter un album en entier | Soi | 20 |  | Fait | 1 |
| Changer les draps | Maison | 10 |  | Fait | 1 |
| Préparer mon repas du lendemain | Nourriture | 10 |  | Fait | 1 |
| Une journée sans soda | Nourriture | 10 |  | Fait | 1 |
| 1 h de travail concentré | Travail | 35 |  | Minuteur 60 min | 1 |
| Finir une tâche importante | Travail | 20 |  | Fait | 1 |
| Faire un masque pour le visage | Soi | 10 |  | Fait | 1 |

### Réconfort (jour difficile) (6)

| Titre | Cat. | XP | Quand | Réalisation | Lignes |
|---|---|---|---|---|---|
| Une douche chaude, sans te presser | Soi | 10 |  | Fait | 1 |
| 10 min allongé·e avec une musique douce | Soi | 10 |  | Minuteur 10 min | 2 |
| Une boisson chaude, sans écran | Soi | 10 |  | Fait | 1 |
| Écrire ce qui pèse, puis fermer le carnet | Soi | 10 |  | Fait | 2 |
| Appeler un proche 5 min | Ami | 10 |  | Fait + Avec qui ? | 1 |
| Se faire une tisane ou un chocolat chaud | Soi | 10 |  | Fait | 2 |

<!-- /INVENTAIRE -->
