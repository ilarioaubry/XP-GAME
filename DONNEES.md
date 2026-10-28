# Données d'XP (sauvegarde)

Tout tient dans une seule clé du stockage local : `carnet-quetes`, au format JSON produit par `snapshot()` (`js/coeur/29-defis-semaine-test-sauvegarde.js`) et relu par `load()` / `loadCore()`.

**Règles** (voir CLAUDE.md) : nouvelles clés dans `S.g` ; jamais de renommage ni de changement de format ; toute réparation = une migration numérotée dans `js/migrations.js`.

Statut : **active** = utilisée par une fonctionnalité visible · **héritée** = liée à une fonctionnalité retirée ou cachée, à trancher en phase 2 · **?** = rôle à confirmer en lisant le code.
Fichiers : numéro du script (`03` = `03-repas-barre-de-vie.js`), ou nom court (`finitions` = les fichiers `*-finitions.js`, ex-`correctifs`, `assiette`…).

Inventaire établi le 25/10/2026 par recherche de `S.g.x` et `G.x` (quand `G=S.g`). Une clé lue par un autre alias peut manquer : compléter au fil des étapes.

---

## Niveau supérieur (`S`)

| Clé | Contenu |
|---|---|
| `v` | Ancien numéro de format, **figé à 28** dans `snapshot()`. Ne pas confondre avec `S.g.ver`. |
| `xp`, `perLevel`, `xpCap`, `rankBonus`, `streakBonus`, `dayBonus` | XP totale et réglages du barème |
| `actions`, `log`, `days` | Actions possibles, journal des validations, jours actifs |
| `daily` | État du jour (rituels cochés, compteurs) |
| `specials`, `epics`, `weekly` | Quêtes spéciales, grandes quêtes, défis de la semaine |
| `name`, `title`, `frame`, `theme`, `myPic` | Profil : prénom, titre affiché, cadre, thème, photo |
| `friends`, `family`, `friendDone`, `familyDone`, `profiles`, `bonds`, `bondsLast`, `bdDone` | Proches : listes, fiches, niveau de lien, anniversaires faits |
| `stats`, `badges`, `badgesInit` | Compteurs par catégorie, badges obtenus |
| `skills`, `snd`, `musicDone` | Compétences (musique) — **héritée ?** (sous-onglet jamais affiché) |
| `wishes`, `spent`, `qPrice`, `extraMoney` | Envies et dépenses d'XP — **?** |
| `dayLimit`, `seeded` | Réglage de limite quotidienne, contenu initial posé |
| `g` | Toutes les données ajoutées depuis : voir ci-dessous |

---

## `S.g` — par domaine

### Système et sauvegarde
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `ver` | migrations | Nombre de migrations appliquées | active |
| `dst26`, `voc1` | migrations | Drapeaux des migrations 1 et 2 (gardés pour compatibilité) | active |
| `plb` | migrations | Ancienne clé de l'assiette, supprimée par la migration 3 | supprimée |
| `bkLast` | 15 | Date du dernier export en fichier | active |
| `onb` | 06, 29 | Date de fin de l'accueil (création du profil) | active |
| `help` | 27 | Nombre d'affichages des aides, pour les masquer après 3 | active |
| `mute`, `ambS` | 02, 15, 28, 08 | Sons coupés, ambiance sonore de la scène | active |
| `da` | 03, 08, finitions | Style de l'appli (ciel / classique) | active |
| `wake`, `curfew` | 01, 03 | Heure de réveil (début de journée), alerte de couche tardive | active |

### Repas et assiette
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `mb` | 02, 03, 04, 09, 26, assiette, finitions | Repas validés : `"AAAA-MM-JJ:période"` → `{t}` | active |
| `mbd` | 03, 09, 26, assiette, finitions | Détail des repas par période (`m`, `ex`, `w`, `cr`) | active |
| `plt` | assiette | Assiettes : `plt[jour][dej|diner] = {f:[], p:[], l:[], s:[] (sauces, depuis le 27/10), x:{yaourt, fromage, eau, maison, nouv (Cuisiné maison / Nouvelle recette, depuis le 27/10)}, r?}` | active |
| `plr` | assiette | Recettes enregistrées | active |
| `plf`, `plh` | assiette | Aliments ajoutés par toi, aliments masqués | active |
| `rcp` | 25 | Recettes cuisinées (Chez moi) | active ? |
| `hpFull`, `hpWarn` | 03 | Barre de vie : bonus « pleine » du jour, alerte « basse » du jour | active |

### Rituels et journée
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `rh`, `rhInit` | 15, 19 | Historique des rituels par jour ; initialisation unique | active |
| `rcore` | 09, 15, 20, 28 | Jours où tous les rituels essentiels sont faits | active |
| `rto`, `rtAuto` | 09, 20, 15 | Heures habituelles des rituels ; rangement automatique | active |
| `rtb` | 09 | Records de la routine chronométrée par période | active |
| `ancL` | 04, 05, 15 | Rituels « ancrés » (historique) | active |
| `pb`, `endHide` | 09 | Son de moment déjà joué ; fin de période masquée | active |
| `softAll`, `softAuto`, `mood` | 03, 08, 09, 13, 17, 18, 19, 24, 26 | Journée douce, humeur par jour | active |
| `offs`, `pz`, `rtr`, `abs` | 03, 15, 28 | Jours off, pauses, jours de reprise, absences | active |
| `jok`, `jokD`, `jokS`, `jokChk` | 03, 28 | Jokers de série (jours rattrapés) | active |
| `seen` | 28 | Dernier jour d'ouverture (calcul des absences) | active |
| `sleep`, `bed`, `nap` | 02, 09, 13, 18, 19, 24, 26, finitions | Sommeil, heure de coucher, siestes | active |
| `jr` | 08, 09, 18, 19 | Journal du soir par jour | active |
| `en` | 19 | Énergie du jour | active ? |
| `goalHit`, `goalN` | 02, 26 | Objectif du jour atteint (date, total) | active |
| `cig` | finitions | Compteur de cigarettes par jour | active |
| `vie` | finitions | Réglages de vie : jours de travail, compteurs suivis | active |
| `per`, `perAsk` | finitions, ma-vie | Périodes (contrat…) ; bilan de fin de période demandé | active |
| `eng` | engagements, cloture-soir | {lib: engagements écrits, d: jour → [{id,k,n,lim?,res?}], skip: jour où la carte a été fermée} | active |
| `todo` | a-faire, cloture-soir | Liste à faire : [{id, d jour, c créée le, n nom, key action du panneau}] ; « fait » se lit dans le journal | active |
| `dlog` | coeur/29, cloture-soir | Messages gardés pour le bilan du soir (jour → liste), 7 derniers jours | active |
| `perOk` | ma-vie | Contrats clos par la coche (id → date), +50 XP Travail une fois | active |
| `last` | ma-vie | « Dernière fois que… » | active |
| `tm` | 27 | Minuteur en cours | active |

### Quêtes
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `fq`, `fqW`, `fqNo`, `fqNoT`, `fqFam` | 08, 18, 19, 20, 22, 28, assiette, finitions | Quêtes pour toi : tirage du jour, poids appris, quêtes écartées | active |
| `mq` | 08, 19 | Petites quêtes du moment faites par jour | active |
| `dq` | 02, 09, 29 | Quêtes du jour | active |
| `idq`, `idt` | finitions, 04, 22 | Quête d'identité, suivi « qui tu deviens » | active |
| `surDone`, `surLast` | 02, 23, 29 | Quête surprise du jour | active |
| `orgDone`, `secDone` | 23, 29, 26 | Quête d'organisation du jour ; quêtes secrètes faites | active |
| `fgDone`, `fgLast`, `fgQ`, `fgr` | 06, 23, 26, 28, 29 | Quêtes de groupe d'amis, groupes | active |
| `grpNo`, `gfNo` | 29, 09 | Personnes / cadeaux écartés des quêtes | active |
| `gfs` | 27 | Idées et cadeaux offerts par proche | active |
| `prj` | 02, 16, 18, 19, 26 | Projets (étapes) | active |
| `ev`, `evArc`, `evq`, `evmOff` | 10, 18, 19, 20 | Événements à venir, archivés, quêtes liées, mode événement masqué | active |
| `duo` | 08, 18 | Défi à deux de la semaine | active ? |
| `filmDay`, `filmSeen`, `filmDone` | 19, 24, 25 | Film du jour, films vus | active |
| `taste`, `sit`, `normOff`, `lz`, `noMus`, `music` | 06, 18, 22, 28, finitions | Goûts, situation, préférences, centres d'intérêt | active |
| `aiN` | — | Compteur mensuel des appels à Claude (code retiré à l'étape 1.7) | **héritée** |
| `afLast`, `afMem`, `afCustom` | 18, 26, finitions, ma-vie | Dernière fois par activité, avec qui, activités perso | active |
| `cur`, `fini`, `dm` | finitions | En cours (livre, série…), terminés, objectifs du mois | active |
| `map` | 15, 18, finitions | Sorties : lieux visités | active |
| `ms` | 22 | Progression par étapes (`MS`) | ? |

### Proches
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `rel` | 02, 04, 05, 24, 26, finitions | Dernières sorties / liens par personne | active |

### Profil, collections, récompenses
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `avc` | 02, 06, 13, 14, 21, 24, 25, 27 | Configuration du personnage | active |
| `gear`, `eq` | 02, 05, 11, 21–29 | Objets obtenus, objets portés (armoire) | active |
| `rt` | 02, 22, 23, 24, 27, 29, migrations | Titres obtenus | active |
| `show` | 26 | 3 badges mis en avant | active |
| `nb` | 25, 26, 29 | Badges vus (« nouveau ») | active |
| `cr` | 22 | Récompenses par catégorie déjà données | active |
| `chests`, `chestLvl`, `lvcFix` | 05, 09, 16, 21, 23, 27, 29 | Coffres à ouvrir, niveau du dernier coffre, coffre offert une fois | active |
| `bchests`, `opened`, `ol` | 23, 24, 26, 27, 29, finitions | Coffres bonus, coffres ouverts, historique d'ouverture | active |
| `rare`, `rareN`, `boost` | 03, 23, 26, 29 | Journée rare du jour, compteur, XP doublée | active |
| `hist` | 05, 19, 23, 26 | Bilan par semaine (XP, catégories) | active |
| `chap`, `intn`, `wkSeen`, `mem` | 18, 19 | Chapitres du Bilan, intention de la semaine, bilan vu, souvenirs | active |
| `visA` | 08 | Animations de visiteurs déjà jouées aujourd'hui | active |

### Chez moi et activités
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `hm` | 25 | Chez moi : événements, noms, plantes | active |
| `book`, `books`, `rdp` | 04, 05, 25, 26, 27, finitions | Livre en cours, livres finis, pages lues | active |
| `run`, `pu`, `sq`, `gn` | 04, 25, 26, 27 | Course (km), pompes, squats, gainage : records | active |
| `md` | 04, 26, 27 | Méditation (minutes) | active |

### Météo et musique
| Clé | Fichiers | Contenu | Statut |
|---|---|---|---|
| `wx`, `wxc`, `wxh` | 17, 19, 20 | Météo (Open-Meteo depuis le 25/10) : `wx.k` = "lat,lon" (un ancien code AccuWeather sans virgule redemande la ville), cache, historique ; codes d'icône gardés dans l'ancienne numérotation | active |
| `sdj`, `spOn` | 19 | Spotify : titres du jour (encore affichés dans l'historique du Bilan), activé — Spotify retiré à l'étape 1.7 | **héritée** |

### Héritées (fonctionnalités retirées ou cachées) — à trancher en phase 2
| Clé | Fichiers | Contenu |
|---|---|---|
| `boss`, `bh`, `cbE`, `cb` | 02, 21, 23, 24, 29 | Boss de la semaine (code désactivé par `if(false&&…)`), historique, boss par catégorie |
| `bqDone`, `bsDone`, `bsDoneP` | 02, 09, 29 | Quêtes de boss de la semaine / de séance |
| `xm`, `xmh` | 04, 05 | Noël (calendrier, historique) |
| `pj`, `pjd`, `pjf` | 22 | Ancien système de projets (`PJ_XP`, `PJ_BONUS` jamais utilisés) |
