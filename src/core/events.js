// Bus d'événements : les modules ne s'appellent pas entre eux, ils annoncent ce qui s'est passé.
//   emit("repas:note", {jour, repas})   on("repas:note", f)   → on() renvoie de quoi se désabonner
// Un écouteur qui plante est noté dans le journal ; les autres écouteurs passent quand même.
// La liste NOMS est le vocabulaire de l'appli : un nom inconnu est signalé (faute de frappe).

import { erreur, alerte } from "./journal.js";

export const NOMS = new Set([
  // système
  "app:prete", "etat:modifie", "sauvegarde:ecrite", "sauvegarde:echec", "sauvegarde:importee", "migration:faite",
  "onglet:change", "jour:change",
  // progression
  "xp:gagnee", "niveau:monte", "coffre:cran", "coffre:pret", "coffre:ouvert", "badge:obtenu", "objet:obtenu",
  // Aujourd'hui
  "repas:note", "repas:saute", "repas:efface", "routine:lancee", "routine:finie", "habitude:faite",
  "quete:faite", "quete:ecartee", "humeur:notee", "sommeil:note", "bilan-soir:fait",
  // Moi et Proches
  "equipement:change", "evenement:ajoute", "projet:modifie", "proche:modifie", "proche:contact", "roulette:tiree",
  // messages
  "toast", "annuler",
]);

const abonnes = new Map();

export function on(nom, f) {
  if (nom !== "*" && !NOMS.has(nom)) alerte("evenements", "écoute d'un événement inconnu : " + nom);
  if (!abonnes.has(nom)) abonnes.set(nom, new Set());
  abonnes.get(nom).add(f);
  return () => abonnes.get(nom).delete(f);
}

export function once(nom, f) {
  const off = on(nom, d => { off(); f(d); });
  return off;
}

export function emit(nom, donnees) {
  if (!NOMS.has(nom)) alerte("evenements", "événement inconnu : " + nom);
  for (const cle of [nom, "*"]) {
    const set = abonnes.get(cle);
    if (!set) continue;
    for (const f of [...set]) {
      try {
        f(donnees, nom);
      } catch (e) {
        erreur("evenement " + nom, e);
      }
    }
  }
}
