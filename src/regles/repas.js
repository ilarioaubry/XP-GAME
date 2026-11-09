// Repas : mêmes clés que l'ancienne version. mb["jour:période"] = {t}, mbd["jour:période"] = {m:{repas:1}, ex, w, cr},
// plt[jour][dej|diner] = assiette {f,p,l,s,x,w}. Période : "matin" (petit-déj, déjeuner) ou "soir" (goûter, dîner).

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { MB } from "../donnees/brut/repas-barre-de-vie.js";
import { PL_SIDES, PL_SAUCE, PL_DIET, PL_REC0, PL_MEAT } from "../donnees/brut/assiette.js";
import { gagner, faitAujourdhui } from "./xp.js";
import { ajouterCran } from "./coffre.js";

/** Les repas du jour : [{ id, nom, xp, periode, icone }] */
export const REPAS = Object.entries(MB).flatMap(([periode, liste]) => liste.map(([id, nom, xp, , icone]) => ({ id, nom, xp, periode, icone })));

const cle = (S, periode) => cleJour(S) + ":" + periode;
export const repasFait = (id, S = etat()) => { const r = REPAS.find(x => x.id === id); const d = S.g.mbd && S.g.mbd[cle(S, r.periode)]; return !!(d && d.m && d.m[id]); };
export const repasSaute = (id, S = etat()) => { const r = REPAS.find(x => x.id === id); const d = S.g.mbd && S.g.mbd[cle(S, r.periode)]; return !!(d && d.sk && d.sk[id]); };

/** Note un repas (une fois par jour). bonus = XP d'assiette (2 par côté rempli, +4 si les 3). */
export function noter(id, bonus = 0) {
  const r = REPAS.find(x => x.id === id);
  if (!r || repasFait(id)) return false;
  modifier("repas", S => {
    const k = cle(S, r.periode);
    (S.g.mb ||= {})[k] = { t: Date.now() };
    const d = ((S.g.mbd ||= {})[k] ||= { m: {}, ex: {}, w: {}, cr: {} });
    d.m = { ...(d.m || {}), [id]: 1 };
    if (d.sk) delete d.sk[id];
  });
  gagner({ id: "mb", nom: r.nom, cat: "nourriture", xp: r.xp + bonus });
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

export const assietteDe = (slot, S = etat()) => ((S.g.plt || {})[cleJour(S)] || {})[slot] || { f: [], p: [], l: [], s: [], x: {} };

/** Enregistre l'assiette d'un repas (dej | diner) et note le repas correspondant (avec l'XP d'assiette). */
export function enregistrerAssiette(slot, a) {
  modifier("assiette", S => {
    const j = cleJour(S);
    ((S.g.plt ||= {})[j] ||= {})[slot] = { f: a.f || [], p: a.p || [], l: a.l || [], s: a.s || [], x: a.x || {}, ...(a.w ? { w: a.w } : {}), ...(a.r ? { r: a.r } : {}) };
    if (a.r) { const rec = (S.g.plr ||= PL_REC0.map(x => ({ ...x }))).find(x => x.id === a.r); if (rec) rec.u = (rec.u || 0) + 1; }
  });
  return noter(slot === "dej" ? "dej" : "diner", xpAssiette(a));
}

// ---- Catalogue de l'assiette (comme l'ancienne version) : aliments de base + les tiens (S.g.plf), masqués (S.g.plh),
// filtrés par ton régime (S.g.sit.have), triés par usage ; recettes en un toucher (S.g.plr).
export const nbCote = (a, k) => ((a && a[k]) || []).length;
export const xpAssiette = a => { const n = ["f", "p", "l"].filter(k => nbCote(a, k)).length; return n * 2 + (n === 3 ? 4 : 0); };
const VIANDE = new RegExp(PL_MEAT.__re__, PL_MEAT.f);
const perso = (S = etat()) => (Array.isArray(S.g.plf) ? S.g.plf : []);
export const caches = (S = etat()) => (Array.isArray(S.g.plh) ? S.g.plh : []);
export const recettes = (S = etat()) => (Array.isArray(S.g.plr) ? S.g.plr : PL_REC0);

/** Aliments d'un côté (f, p, l ou s pour les sauces) : { id, nom, icone, groupe, perso }. */
export function aliments(k, S = etat()) {
  const base = k === "s" ? PL_SAUCE.map(([id, n]) => [id, n]) : PL_SIDES.find(z => z[0] === k)[4];
  return base.map(([id, nom, groupe]) => ({ id, nom, icone: id, groupe }))
    .concat(perso(S).filter(c => c.s === k).map(c => ({ id: c.id, nom: c.n, icone: c.ic, perso: true })));
}
export function aliment(id, S = etat()) {
  for (const k of ["f", "p", "l", "s"]) { const a = aliments(k, S).find(x => x.id === id); if (a) return a; }
  return { id, nom: id, icone: "assiette" };
}
export function usages(S = etat()) {
  const u = {};
  for (const jour of Object.values(S.g.plt || {})) for (const m of Object.values(jour || {})) for (const k of ["f", "p", "l", "s"]) for (const id of (m && m[k]) || []) u[id] = (u[id] || 0) + 1;
  return u;
}
export function regime(S = etat()) { const have = (S.g.sit && S.g.sit.have) || []; return new Set(have.flatMap(k => PL_DIET[k] || [])); }

/** Type d'assiette : fast-food, végétarienne ou équilibrée (le bord de l'assiette prend sa couleur). */
export function typeAssiette(a) {
  if (!a) return "";
  if (a.w === "fast") return "fast";
  const ids = ["f", "p", "l"].flatMap(k => a[k] || []), n = ["f", "p", "l"].filter(k => nbCote(a, k)).length;
  if (!ids.length) return "";
  const viande = ids.some(id => VIANDE.test(id) || VIANDE.test(aliment(id).nom));
  if (!viande && n >= 2 && nbCote(a, "p")) return "veg";
  return n === 3 ? "equi" : "";
}

/** Au dîner : les côtés qui manquaient à midi. */
export function manquaitAMidi(slot, S = etat()) {
  if (slot !== "diner") return [];
  const midi = ((S.g.plt || {})[cleJour(S)] || {}).dej;
  return midi ? ["f", "p", "l"].filter(k => !nbCote(midi, k)) : [];
}

export function basculerCache(id) { modifier("assiette-tri", S => { const H = (S.g.plh = caches(S).slice()); const i = H.indexOf(id); if (i < 0) H.push(id); else H.splice(i, 1); }); }
export function ajouterAliment(k, nom, icone) {
  const f = { id: "c" + Date.now().toString(36), s: k, n: nom, ic: icone };
  modifier("assiette-aliment", S => { (S.g.plf = perso(S).slice()).push(f); });
  return f;
}
export function enregistrerRecette(nom, a) {
  const r = { id: "r" + Date.now().toString(36), n: nom, f: [...(a.f || [])], p: [...(a.p || [])], l: [...(a.l || [])], s: [...(a.s || [])] };
  modifier("recette", S => { S.g.plr = [r, ...recettes(S).map(x => ({ ...x }))]; });
  return r;
}
export function retirerRecette(id) {
  let avant;
  modifier("recette-retiree", S => { avant = recettes(S).map(x => ({ ...x })); S.g.plr = avant.filter(x => x.id !== id); });
  return () => modifier("recette-rendue", S => { S.g.plr = avant; });
}

export { faitAujourdhui };
