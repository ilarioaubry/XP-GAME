// État central : un seul objet S (même forme que la sauvegarde), un seul point de modification.
//   etat()                       lecture (ne pas modifier directement)
//   modifier("repas", S => {…})  change S, planifie l'écriture, annonce "etat:modifie"
// Les modules métier (repas, routine, proches…) exposent leurs propres fonctions qui passent par modifier().

import * as sauvegarde from "./sauvegarde.js";
import { migrer } from "./migrations.js";
import { emit } from "./events.js";
import { erreur, info } from "./journal.js";

let S = null;
let lecture = "neuve";

/** Charge la sauvegarde du téléphone et applique les migrations manquantes. */
export function charger() {
  const r = sauvegarde.lire();
  S = r.S;
  lecture = r.etat;
  if (r.etat === "lue") {
    const n = migrer(S);
    if (n) {
      info("migrations", n + " appliquée(s), ver = " + S.g.ver);
      emit("migration:faite", { n, ver: S.g.ver });
      sauvegarde.planifier(S);
    }
  }
  return S;
}

export const etat = () => S;
export const etatLecture = () => lecture;

/** Seule façon de changer l'état. Renvoie ce que renvoie fn. */
export function modifier(raison, fn) {
  let r;
  try {
    r = fn(S);
  } catch (e) {
    erreur("modifier:" + raison, e);
    return undefined;
  }
  sauvegarde.planifier(S);
  emit("etat:modifie", { raison });
  return r;
}

/** S.g.<cle>, créé avec sa valeur par défaut s'il manque (règle : nouvelles clés dans S.g). */
export function cleG(cle, defaut) {
  if (S.g[cle] === undefined) S.g[cle] = defaut;
  return S.g[cle];
}

/** Remplace tout l'état par un fichier importé (après la copie de sécurité). */
export function remplacer(nouveau) {
  S = nouveau;
  migrer(S);
  sauvegarde.ecrireMaintenant(S);
  emit("sauvegarde:importee");
  emit("etat:modifie", { raison: "import" });
}
