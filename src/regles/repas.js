// Repas : mêmes clés que l'ancienne version. mb["jour:période"] = {t}, mbd["jour:période"] = {m:{repas:1}, ex, w, cr},
// plt[jour][dej|diner] = assiette {f,p,l,s,x,w}. Période : "matin" (petit-déj, déjeuner) ou "soir" (goûter, dîner).

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { MB } from "../donnees/brut/repas-barre-de-vie.js";
import { PL_SIDES } from "../donnees/brut/assiette.js";
import { gagner, faitAujourdhui } from "./xp.js";
import { ajouterCran } from "./coffre.js";

/** Les repas du jour : [{ id, nom, xp, periode, icone }] */
export const REPAS = Object.entries(MB).flatMap(([periode, liste]) => liste.map(([id, nom, xp, , icone]) => ({ id, nom, xp, periode, icone })));

const cle = (S, periode) => cleJour(S) + ":" + periode;
export const repasFait = (id, S = etat()) => { const r = REPAS.find(x => x.id === id); const d = S.g.mbd && S.g.mbd[cle(S, r.periode)]; return !!(d && d.m && d.m[id]); };
export const repasSaute = (id, S = etat()) => { const r = REPAS.find(x => x.id === id); const d = S.g.mbd && S.g.mbd[cle(S, r.periode)]; return !!(d && d.sk && d.sk[id]); };

/** Note un repas (une fois par jour). */
export function noter(id) {
  const r = REPAS.find(x => x.id === id);
  if (!r || repasFait(id)) return false;
  modifier("repas", S => {
    const k = cle(S, r.periode);
    (S.g.mb ||= {})[k] = { t: Date.now() };
    const d = ((S.g.mbd ||= {})[k] ||= { m: {}, ex: {}, w: {}, cr: {} });
    d.m = { ...(d.m || {}), [id]: 1 };
    if (d.sk) delete d.sk[id];
  });
  gagner({ id: "mb", nom: r.nom, cat: "nourriture", xp: r.xp });
  emit("repas:note", { id, periode: r.periode });
  ajouterCran("repas:" + id);
  return true;
}

/** « Repas sauté » : on le dit sans pénalité (rien dans la barre de vie, aucun XP). */
export function sauter(id) {
  const r = REPAS.find(x => x.id === id);
  if (!r || repasFait(id)) return false;
  modifier("repas-saute", S => {
    const d = ((S.g.mbd ||= {})[cle(S, r.periode)] ||= { m: {}, ex: {}, w: {}, cr: {} });
    (d.sk ||= {})[id] = 1;
  });
  emit("repas:saute", { id });
  return true;
}

/** Annule la note d'un repas (le « fait » se retire ; l'XP reste dans le journal, comme avant). */
export function effacer(id) {
  const r = REPAS.find(x => x.id === id);
  modifier("repas-efface", S => {
    const d = S.g.mbd && S.g.mbd[cle(S, r.periode)];
    if (d && d.m) delete d.m[id];
    if (d && d.sk) delete d.sk[id];
    if (d && !Object.keys(d.m || {}).length && S.g.mb) delete S.g.mb[cle(S, r.periode)];
  });
  emit("repas:efface", { id });
}

// ---- Assiette : 3 repères (féculent, protéine, légume) → pastille douce « manges-tu assez ? »
export const GROUPES = PL_SIDES.map(([k, nom, c1, c2, items]) => ({ k, nom, c1, c2, items: items.map(([id, n, grp]) => ({ id, nom: n, icone: id, groupe: grp })) }));
export const SAUCES = null; // chargées par l'écran (catalogue d'origine)

export const assietteDe = (slot, S = etat()) => ((S.g.plt || {})[cleJour(S)] || {})[slot] || { f: [], p: [], l: [], s: [], x: {} };

/** Enregistre l'assiette d'un repas (dej | diner) et note le repas correspondant. */
export function enregistrerAssiette(slot, a) {
  modifier("assiette", S => {
    const j = cleJour(S);
    ((S.g.plt ||= {})[j] ||= {})[slot] = { f: a.f || [], p: a.p || [], l: a.l || [], s: a.s || [], x: a.x || {}, ...(a.w ? { w: a.w } : {}) };
  });
  return noter(slot === "dej" ? "dej" : "diner");
}

/** Pastille douce : jamais une alerte. { texte, niveau: 0|1|2|3 } = nombre de familles présentes. */
export function pastille(a) {
  const n = ["f", "p", "l"].filter(k => (a[k] || []).length).length;
  const texte = n === 0 ? "Ajoute ce que tu manges" : n === 3 ? "Bien rempli, bravo" : n === 2 ? "Presque complet" : "C'est un début";
  return { texte, niveau: n };
}

export { faitAujourdhui };
