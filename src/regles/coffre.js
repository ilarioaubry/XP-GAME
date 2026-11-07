// Jauge du coffre : 5 crans par jour. 1 repas, 1 routine ou 1 quête spéciale = +1 cran ; 5/5 = un coffre garanti.
// Nouvelle clé S.g.coffre = { jour, n, src: [ids déjà comptés], ok: coffre donné }. L'ancien coffre S.g.chests reste tel quel.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";

export const CRANS = 5;

function courant(S) {
  const j = cleJour(S);
  let c = S.g.coffre;
  if (!c || c.jour !== j) c = S.g.coffre = { jour: j, n: 0, src: [], ok: false };
  return c;
}

export const crans = (S = etat()) => (S.g.coffre && S.g.coffre.jour === cleJour(S) ? S.g.coffre.n : 0);

/** Compte un cran pour une source (une même source ne compte qu'une fois par jour). */
export function ajouterCran(source) {
  let r = { n: crans(), nouveau: false, pret: false };
  modifier("coffre", S => {
    const c = courant(S);
    if (c.n >= CRANS || c.src.includes(source)) { r.n = c.n; return; }
    c.src.push(source);
    c.n++;
    r = { n: c.n, nouveau: true, pret: false };
    if (c.n >= CRANS && !c.ok) {
      c.ok = true;
      S.g.chests = (+S.g.chests || 0) + 1; // le coffre arrive dans la file des coffres à ouvrir
      r.pret = true;
    }
  });
  if (r.nouveau) emit("coffre:cran", { n: r.n, source });
  if (r.pret) emit("coffre:pret", {});
  return r;
}
