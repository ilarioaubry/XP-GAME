// Temps de l'appli, à l'identique de l'ancienne version (_legacy/src/js/coeur/01-donnees-base.js) :
// la journée commence 4 h avant l'heure de réveil (S.g.wake, 8 h par défaut), si bien qu'un repas
// noté à 1 h du matin compte pour la veille. Les clés de jour « AAAA-MM-JJ » de la sauvegarde en dépendent.

import { RANKS } from "../donnees/brut/donnees-base.js";

export function heureReveil(S) {
  const w = S && S.g && +S.g.wake;
  return w >= 5 && w <= 13 ? w : 8;
}

const coupure = S => Math.max(0, heureReveil(S) - 4);

/** Clé du jour d'un instant (ms), comme dayKey de l'ancienne version. */
export function cleJour(S, t = Date.now()) {
  const d = new Date(+new Date(t));
  d.setHours(d.getHours() - coupure(S)); // heures d'horloge, pas une durée : le changement d'heure ne décale pas le jour
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/** Heure ramenée à un réveil à 8 h (0–24), comme adjH. */
export function heureRelative(S, d = new Date()) {
  return (d.getHours() + d.getMinutes() / 60 - (heureReveil(S) - 8) + 48) % 24;
}

/** Heure de la journée de l'appli : après minuit on continue à compter (25 h…), comme dayH. */
export function heureJournee(S, d = new Date()) {
  const h = heureRelative(S, d);
  return h < 4 ? h + 24 : h;
}

// Niveaux : passer du niveau n au niveau n+1 coûte 50 + 50n XP (100, 150, 200…)
export const xpPourNiveau = l => 50 + 50 * l;

export function niveau(xp) {
  let l = 1, reste = xp;
  while (reste >= xpPourNiveau(l)) { reste -= xpPourNiveau(l); l++; }
  return { l, cur: reste, need: xpPourNiveau(l) };
}

export function rang(l) {
  let r = RANKS[0][1];
  for (const [min, n] of RANKS) if (l >= min) r = n;
  return r;
}
