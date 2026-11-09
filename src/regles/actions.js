// Panneau « + » (repris de l'ancienne version) : noter n'importe quelle action du catalogue (FAM : familles d'actions et
// leurs options, rangées par domaine), avec une durée et, pour ce qui se fait à plusieurs, « Avec qui ? ».
// Mêmes clés qu'avant : la ligne du journal a l'id « af:famille:option », S.g.afLast[clé] = dernière fois, S.g.afMem[clé] = {w, d}.
// Barème : l'XP de la famille, ou celui de la durée si c'est plus (30 au plus) ; au-delà de 3 fois dans la journée, un tiers.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { FAM, FIC } from "../donnees/brut/quetes.js";
import { DOMS, DUR, AF_OFF } from "../donnees/brut/aujourdhui-finitions.js";
import { gagner } from "./xp.js";

export const DOMAINES = DOMS.map(([id, nom, , , icone]) => ({ id, nom, icone }));
export const DUREES = DUR;
const SIESTE = [[10, "10 min"], [20, "20 min"], [30, "30 min"], [45, "45 min"], [60, "1 h"], [90, "1 h 30"]];
const MAX = 30;
const xpDuree = m => m <= 0 ? 0 : m <= 15 ? 8 : m <= 30 ? 12 : m <= 60 ? 18 : m <= 120 ? 24 : 30;
const sansAccent = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const cache = new Set((AF_OFF && AF_OFF.__set__) || []);

/** Ce que la fiche « J'ai… » coche (chien, voiture…) fait apparaître les familles qui en dépendent. */
const ai = (k, S) => ((S.g.sit && S.g.sit.have) || []).includes(k);

/** Toutes les actions : [{ cle, fam, opt, nom, dom, cat, icone }] */
export function actions(S = etat()) {
  const out = [];
  for (const f of FAM) {
    if (cache.has(f.id) || (f.have && !ai(f.have, S))) continue;
    const opts = [...f.o, ...(((S.g.afCustom || {})[f.id]) || [])];
    for (const o of opts) {
      const [opt, journal] = Array.isArray(o) ? o : [o, null];
      const nom = f.o.length === 1 && (opt === f.l || f.nap || f.quick) ? f.l : f.l + " · " + opt;
      const ic = FIC[f.id];
      out.push({ cle: "af:" + f.id + ":" + opt, fam: f, opt, journal, nom, dom: f.dom, cat: f.cat, icone: ic ? (ic[1][opt] || ic[0]) : "" });
    }
  }
  return out;
}

export const familles = (dom, S = etat()) => FAM.filter(f => f.dom === dom && !cache.has(f.id) && (!f.have || ai(f.have, S)))
  .map(f => ({ fam: f, nom: f.ls || f.l, icone: FIC[f.id] ? FIC[f.id][0] : "", actions: actions(S).filter(a => a.fam === f) }));

export const chercher = (q, S = etat()) => { const n = sansAccent(q).trim(); return n ? actions(S).filter(a => sansAccent(a.nom).includes(n)).slice(0, 30) : []; };

export const foisAujourdhui = (cle, S = etat()) => { const j = cleJour(S); return S.log.filter(l => l.a === cle && cleJour(S, l.t) === j).length; };

/** Les actions déjà notées le plus souvent (6), sinon une par domaine pour commencer. */
export function recentes(S = etat()) {
  const n = {};
  for (const l of S.log) if (l.a && l.a.startsWith("af:")) n[l.a] = (n[l.a] || 0) + 1;
  const L = actions(S).filter(a => n[a.cle]).sort((a, b) => n[b.cle] - n[a.cle]).slice(0, 6);
  if (L.length) return { titre: "Récentes", liste: L };
  return { titre: "Pour commencer", liste: ["maison", "sport", "soi", "divert", "travail", "proches"].map(d => actions(S).find(a => a.dom === d)).filter(Boolean) };
}

/** Ce qui se fait à plusieurs demande « Avec qui ? » (au moment de « Fait », jamais suggéré avant). */
export const avecQui = a => !!(a.fam.who || a.dom === "proches" || /^(sorties|sportco)$/.test(a.fam.id));
/** Action rapide : pas de durée à choisir. */
export const rapide = a => !!(a.fam.quick || /\bfini(e)?$/i.test(a.opt));
export const durees = a => (a.fam.nap ? SIESTE : DUR);

export function xpPrevu(a, duree = 0, S = etat()) {
  const n = foisAujourdhui(a.cle, S), f = a.fam;
  const base = f.cat === "eau" ? f.xp : n < 3 ? f.xp : Math.round(f.xp / 3);
  const xp = f.nap ? (n < 2 ? f.xp : 0) : duree ? Math.max(base, xpDuree(duree)) : base;
  return Math.min(MAX, xp);
}

/** Note l'action : journal, XP, lien avec les personnes choisies (la moitié de l'XP, 5 au moins). */
export function noterAction(a, duree = 0, avec = []) {
  const xp = xpPrevu(a, duree);
  const libDuree = duree ? " · " + ([...DUR, ...SIESTE].find(d => d[0] === duree) || [0, duree + " min"])[1] : "";
  const nom = (a.fam.nap ? "Sieste" : (a.journal || a.nom)) + (avec.length ? " avec " + avec.join(", ") : "") + libDuree;
  let cat = a.cat;
  const S0 = etat(), famille = new Set(S0.family || []);
  if (avec.length && (a.dom === "proches" || a.fam.id === "sorties")) cat = avec.every(p => famille.has(p)) ? "famille" : "social";
  modifier("action", S => {
    (S.g.afLast ||= {})[a.cle] = Date.now();
    (S.g.afMem ||= {})[a.cle] = { w: avec.slice(0, 3), d: duree || 0 };
    if (a.fam.nap && duree) { const j = cleJour(S); (S.g.nap ||= {})[j] = (S.g.nap[j] || 0) + duree; }
    for (const p of avec) { S.bonds[p] = (S.bonds[p] || 0) + Math.max(5, Math.round(xp / 2)); S.bondsLast[p] = Date.now(); }
  });
  if (xp) gagner({ id: a.cle, nom, cat, xp, extra: avec.length ? { withp: avec.slice() } : null });
  else modifier("action-sans-xp", S => { S.log.push({ t: Date.now(), a: a.cle, name: nom, cat, xp: 0 }); });
  for (const p of avec) emit("proche:contact", { n: p });
  return xp;
}

/** Les personnes, la plus récemment vue d'abord ; celles choisies la dernière fois pour cette action en tête. */
export function personnes(a, S = etat()) {
  const tous = [...new Set([...(S.family || []), ...(S.friends || [])])].sort((x, y) => ((S.bondsLast || {})[y] || 0) - ((S.bondsLast || {})[x] || 0));
  const avant = (((S.g.afMem || {})[a.cle] || {}).w || []).filter(p => tous.includes(p));
  return [...avant, ...tous.filter(p => !avant.includes(p))];
}
