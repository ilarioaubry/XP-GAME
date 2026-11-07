// Briques de routine avec icône EXPLICITE (avant : une expression régulière devinait l'icône d'après le nom).
// Généré une fois à partir des anciennes données (RIT_BRICKS + RK) puis possédé à la main : modifier librement.
// m = moment : "matin", "soir" ou "both". ic = nom d'icône pixel 16×16 (pxRk) ; "etoile" si aucune ne convient.
export const BRIQUES = [{"n":"Faire mon lit","m":"matin","ic":"lit"},
  {"n":"Ouvrir la fenêtre","m":"matin","ic":"fenetre"},
  {"n":"Boire un grand verre d'eau","m":"matin","ic":"eau"},
  {"n":"10 pompes","m":"matin","ic":"sport"},
  {"n":"20 squats","m":"matin","ic":"sport"},
  {"n":"5 min d'étirements","m":"both","ic":"sport"},
  {"n":"Méditer 5 min","m":"both","ic":"medit"},
  {"n":"Lire 10 pages","m":"both","ic":"lire"},
  {"n":"Noter ma priorité du jour","m":"matin","ic":"note"},
  {"n":"Petit-déjeuner sans écran","m":"matin","ic":"repas"},
  {"n":"Prendre ma douche","m":"matin","ic":"douche"},
  {"n":"Se brosser les dents","m":"both","ic":"dents"},
  {"n":"Se laver le visage","m":"both","ic":"visage"},
  {"n":"Préparer mes affaires pour demain","m":"soir","ic":"etoile"},
  {"n":"Ranger 10 min","m":"soir","ic":"etoile"},
  {"n":"Lâcher l'écran avant de dormir","m":"soir","ic":"ecran"},
  {"n":"Écrire 3 choses positives","m":"soir","ic":"note"},
  {"n":"Envoyer un message à un proche","m":"soir","ic":"etoile"},
  {"n":"Écrire 4 lignes de texte","m":"soir","ic":"note"},
  {"n":"Préparer le repas de demain","m":"soir","ic":"repas"}];

// Durée par défaut d'une étape (secondes) quand on ne l'a pas réglée.
export const SECONDES = { dents: 120, douche: 300, sport: 180, medit: 300, lire: 600, lit: 60, eau: 30, fenetre: 30 };
