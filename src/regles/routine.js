// Routine : UN bouton par moment (matin / soir) qui ouvre une vue plein écran chronométrée.
// Réglage dans S.g.rout = { matin: [{ n, s }], soir: [...] } (s = secondes prévues), modifiable en brique 3 (Ma vie).
// Historique conservé dans les clés d'origine : rh[jour][moment] = [indices faits], rtb[moment] = record en secondes.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour, heureJournee } from "../core/temps.js";
import { BRIQUES, SECONDES } from "../donnees/routine.js";
import { gagner, faitAujourdhui } from "./xp.js";
import { ajouterCran } from "./coffre.js";

const sec = b => SECONDES[b.ic] || 60;
const parDefaut = m => BRIQUES.filter(b => b.m === m || b.m === "both").slice(0, m === "matin" ? 5 : 4).map(b => ({ n: b.n, s: sec(b), ic: b.ic }));

export const MOMENTS = [{ id: "matin", nom: "Routine du matin", icone: "soleil" }, { id: "soir", nom: "Routine du soir", icone: "lune" }];

export function etapes(moment, S = etat()) {
  const cfg = S.g.rout && S.g.rout[moment];
  const liste = cfg && cfg.length ? cfg : parDefaut(moment);
  return liste.map(e => ({ n: e.n, s: e.s || 60, ic: e.ic || (BRIQUES.find(b => b.n === e.n) || {}).ic || "etoile" }));
}

/** Quel moment proposer d'abord ? Le soir à partir de 17 h. */
export const momentActuel = S => (heureJournee(S) >= 17 ? "soir" : "matin");

export const routineFaite = (moment, S = etat()) => faitAujourdhui("rt:" + moment, S);
export const record = (moment, S = etat()) => (S.g.rtb || {})[moment] || 0;

export function lancee(moment) { emit("routine:lancee", { moment }); }

/** Fin de routine : `faites` = indices des étapes faites, `secondes` = durée réelle. */
export function terminer(moment, faites, secondes) {
  const toutes = faites.length >= etapes(moment).length;
  let nouveauRecord = false;
  modifier("routine", S => {
    const j = cleJour(S);
    ((S.g.rh ||= {})[j] ||= {})[moment] = faites.slice();
    if (toutes) {
      const rec = (S.g.rtb ||= {})[moment];
      if (!rec || secondes < rec) { S.g.rtb[moment] = secondes; nouveauRecord = !!rec; }
    }
  });
  if (!faites.length) return { xp: 0, nouveauRecord };
  const xp = Math.min(20, 4 + faites.length * 2);
  if (!routineFaite(moment)) gagner({ id: "rt:" + moment, nom: moment === "matin" ? "Routine du matin" : "Routine du soir", cat: "soi", xp });
  if (toutes) ajouterCran("routine:" + moment);
  emit("routine:finie", { moment, faites: faites.length, secondes });
  return { xp, nouveauRecord, toutes };
}
