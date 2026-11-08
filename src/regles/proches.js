// Proches : famille et amis (S.friends, S.family : listes de noms), lien par personne (S.bonds : XP), dernier contact (S.bondsLast),
// fiches (S.profiles), groupes (S.g.fgr [{id, n}], membres = profiles[nom].grp). Clés d'origine, rien de renommé.
// COURBE RALENTIE : un palier de lien coûte COEF_LIEN fois plus qu'avant (avant : paliers atteints en 3 semaines ; maintenant : plusieurs mois).
// Le lien déjà gagné ne change pas, seuls les paliers s'étalent.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { gagner } from "./xp.js";

export const COEF_LIEN = 3;
export const ACTIONS = [
  { k: "news", nom: "Nouvelles", xp: 10, lien: 10 },
  { k: "call", nom: "Appeler", xp: 20, lien: 20 },
  { k: "meet", nom: "Vu en vrai", xp: 30, lien: 40 },
];

const besoin = l => 15 * (l + 1) * COEF_LIEN;
export function niveauLien(xp) { let l = 1, r = xp || 0; while (r >= besoin(l)) { r -= besoin(l); l++; } return { l, cur: r, need: besoin(l) }; }
export const titreLien = l => (l >= 8 ? "Ami de toujours" : l >= 5 ? "Ami proche" : l >= 3 ? "Pote" : "Connaissance");

export const amis = (S = etat()) => S.friends || [];
export const famille = (S = etat()) => S.family || [];
export const tous = (S = etat()) => [...famille(S).map(n => ({ n, type: "famille" })), ...amis(S).map(n => ({ n, type: "ami" }))];
export const typeDe = (n, S = etat()) => (famille(S).includes(n) ? "famille" : "ami");

export function ajouter(n, type) {
  modifier("proche-ajoute", S => { const L = type === "famille" ? (S.family ||= []) : (S.friends ||= []); if (!S.friends.includes(n) && !(S.family || []).includes(n)) L.push(n); });
  emit("proche:modifie", { n });
}
/** Retire un proche ; renvoie la fonction qui le rend (barre « Annuler »). */
export function retirer(n) {
  let c;
  modifier("proche-retire", S => {
    c = { type: typeDe(n, S), pos: (S[typeDe(n, S) === "famille" ? "family" : "friends"] || []).indexOf(n), bond: S.bonds[n], last: S.bondsLast[n], prof: S.profiles[n] };
    for (const k of ["friends", "family"]) S[k] = (S[k] || []).filter(x => x !== n);
    delete S.bonds[n]; delete S.bondsLast[n]; delete S.profiles[n];
  });
  emit("proche:modifie", { n });
  return () => modifier("proche-rendu", S => {
    const L = c.type === "famille" ? (S.family ||= []) : (S.friends ||= []); L.splice(Math.max(0, c.pos), 0, n);
    if (c.bond != null) S.bonds[n] = c.bond; if (c.last != null) S.bondsLast[n] = c.last; if (c.prof) S.profiles[n] = c.prof;
  });
}

/** Prendre contact : lien + XP (Amis → social, Famille → famille) + dernier contact. */
export function contacter(n, k) {
  const A = ACTIONS.find(a => a.k === k) || ACTIONS[0], S = etat(), t = typeDe(n, S);
  modifier("lien", S2 => { S2.bonds[n] = (S2.bonds[n] || 0) + A.lien; S2.bondsLast[n] = Date.now(); });
  gagner({ id: "rel:" + k + ":" + n, nom: A.nom + " · " + n, cat: t === "famille" ? "famille" : "social", xp: A.xp, extra: { who: n, rel: 1 } });
  emit("proche:contact", { n, k });
  return A;
}

export const joursSans = (n, S = etat()) => { const t = S.bondsLast[n]; return t ? Math.floor((Date.now() - t) / 864e5) : null; };

/** Ami du mois / membre de la famille du mois : celui avec qui il y a eu le plus de contacts ce mois-ci. */
export function duMois(type, S = etat()) {
  const m = cleJour(S).slice(0, 7), c = {};
  for (const e of S.log) if (e.who && e.rel && typeDe(e.who, S) === type && cleJour(S, e.t).slice(0, 7) === m) c[e.who] = (c[e.who] || 0) + 1;
  const best = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  return best ? { n: best[0], fois: best[1] } : null;
}

// ---- Groupes
export const groupes = (S = etat()) => (S.g.fgr || []).map(g => ({ ...g, membres: tous(S).map(x => x.n).filter(n => ((S.profiles[n] || {}).grp || []).includes(g.id)) }));

// ---- Roulette des proches : tirage pondéré par l'ancienneté du dernier contact.
// Poids = 1 + jours sans nouvelles (au plus 120) ; jamais la même personne deux fois d'affilée ; personne contactée il y a moins de 3 jours.
export function tirer(hasard = Math.random) {
  const S = etat(), prec = (S.g.roulette || {}).n;
  let pool = tous(S).filter(x => x.n !== prec && (joursSans(x.n, S) == null || joursSans(x.n, S) >= 3));
  if (!pool.length) pool = tous(S).filter(x => x.n !== prec);
  if (!pool.length) return null;
  const w = pool.map(x => 1 + Math.min(120, joursSans(x.n, S) ?? 120));
  let r = hasard() * w.reduce((a, b) => a + b, 0), i = 0;
  while (i < pool.length - 1 && (r -= w[i]) > 0) i++;
  const choix = pool[i];
  modifier("roulette", S2 => { S2.g.roulette = { n: choix.n, t: Date.now() }; });
  emit("roulette:tiree", { n: choix.n });
  return choix;
}
export const tirageActuel = (S = etat()) => (S.g.roulette && Date.now() - S.g.roulette.t < 864e5 ? S.g.roulette.n : null);
