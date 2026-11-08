// Badges : les 72 conditions de l'ancienne version, portées en règles explicites (une fonction par identifiant, lisant la sauvegarde).
// Le catalogue (nom, description, icône, niveau) vient de src/donnees/brut/badges.js ; ici seules les CONDITIONS.
// Écarts voulus avec l'ancienne version (listés dans V2.md) : « Journée parfaite » = routine du matin ET du soir finies ;
// la série ne compte pas encore les jours protégés « pause » et « événement » (jours off et jokers, oui).

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { erreur } from "../core/journal.js";
import { cleJour, niveau } from "../core/temps.js";
import { BADGES } from "../donnees/brut/badges.js";
import { RANKS, STAT_KEYS } from "../donnees/brut/donnees-base.js";
import { MB } from "../donnees/brut/repas-barre-de-vie.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { WR_SETS } from "../donnees/brut/icones-unifiees.js";
import { VIANDE } from "../donnees/aliments.js";

// ---- niveaux : coûts d'origine
const niveauDe = (xp, besoin) => { let l = 1, r = xp || 0; while (r >= besoin(l)) { r -= besoin(l); l++; } return l; };
const niveauStat = xp => niveauDe(xp, l => 30 + 20 * l);
// Les liens suivent la courbe ralentie de Proches (COEF_LIEN) : les badges de lien demandent donc plus de temps qu'avant.
import { niveauLien as lien } from "./proches.js";
const niveauLien = xp => lien(xp).l;
const niveauComp = xp => niveauDe(xp, l => 20 + 10 * l);
const CATS_PALIER = ["sport", "perso", "social", "famille", "maison", "soi", "travail", "nourriture"];
const palier = (S, c) => { const l = niveauStat((S.stats || {})[c]); return l >= 10 ? 3 : l >= 5 ? 2 : l >= 3 ? 1 : 0; };

// ---- jours
const jourDe = (S, t) => cleJour(S, t);
const decaler = (cle, n) => { const d = new Date(cle + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const numJour = cle => Math.round(new Date(cle + "T12:00:00") / 864e5);
const semaine = (S, t) => Math.floor((numJour(jourDe(S, t)) + 3) / 7); // semaines du lundi

export function serie(S) {
  const actifs = new Set(S.days), prot = new Set([...actifs, ...(S.g.offs || []), ...(S.g.jokD || [])]);
  let j = cleJour(S), n = 0;
  if (!prot.has(j)) j = decaler(j, -1);
  while (prot.has(j)) { if (actifs.has(j)) n++; j = decaler(j, -1); }
  return n;
}

// ---- relations
const noms = S => [...(S.friends || []), ...(S.family || [])].map(x => (typeof x === "string" ? x : x.n || x.name));
const recents = (S, jours, maintenant) => Object.values(S.bondsLast || {}).filter(t => t && maintenant - t < jours * 864e5).length;
function parPersonne(S) {
  const par = {};
  S.log.filter(e => e.who && (e.rel || e.fr)).forEach(e => (par[e.who] ||= []).push(e.t));
  return par;
}
const fidele = S => { let best = 0; for (const ts of Object.values(parPersonne(S))) { const w = [...new Set(ts.map(t => semaine(S, t)))].sort((a, b) => a - b); let r = 1; for (let i = 1; i < w.length; i++) { r = w[i] === w[i - 1] + 1 ? r + 1 : 1; best = Math.max(best, r); } best = Math.max(best, w.length ? 1 : 0); } return best; };
const retrouvailles = S => Object.values(parPersonne(S)).some(L => { L = L.slice().sort((a, b) => a - b); return L.some((t, i) => i && t - L[i - 1] > 60 * 864e5); });

// ---- repas et assiettes
const nb = (m, q) => ((m || {})[q] || []).length;
function typeAssiette(m) {
  if (!m) return "";
  if (m.w === "fast") return "fast";
  const ids = ["f", "p", "l"].flatMap(s => m[s] || []), n = ["f", "p", "l"].filter(s => nb(m, s)).length;
  if (!ids.length) return "";
  if (!ids.some(id => VIANDE.has(id)) && n >= 2 && nb(m, "p")) return "veg";
  return n === 3 ? "equi" : "";
}
const assiettes = S => Object.values(S.g.plt || {}).flatMap(D => Object.values(D || {}));
const compter = (S, fn) => assiettes(S).filter(m => { try { return m && fn(m); } catch (e) { return false; } }).length;
const vu = (S, t) => !!((S.g.plT || {})[t]) || assiettes(S).some(m => t === "chef" ? !!(m && m.x && m.x.maison) : typeAssiette(m) === t);
function serieLegumes(S) { let n = 0, j = cleJour(S); const l = d => Object.values((S.g.plt || {})[d] || {}).reduce((s, m) => s + nb(m, "l"), 0); if (!l(j)) j = decaler(j, -1); while (l(j) && n < 400) { n++; j = decaler(j, -1); } return n; }
function joursRepasComplets(S) {
  const G = S.g, D = new Set([...Object.keys(G.mb || {}), ...Object.keys(G.mbd || {})].map(k => k.split(":")[0]));
  let n = 0;
  D.forEach(d => { if (Object.keys(MB).every(per => MB[per].every(([k]) => { const dr = (G.mbd || {})[d + ":" + per], b = (G.mb || {})[d + ":" + per]; const m = (b && b.m) || (dr && dr.m) || {}; return m[k] === 1; }))) n++; });
  return n;
}

// ---- divers
const max = o => Math.max(0, ...Object.values((o && o.m) || {}));
// Héritage : les anciennes entrées du journal n'ont pas de marqueur « musique » ; on les reconnaît à ces mots (limité aux anciennes données).
const MOTS_MUSIQUE = ["musique", "son", "sons", "beat", "instru", "guitare", "piano", "chant", "couplet", "morceau", "studio", "jam", "freestyle", "maquette"];
const estMusique = e => (e.xp > 0) && (/^son\b/.test(e.lz || "") || e.lz === "son" || (e.name || "").toLowerCase().split(/[^a-zàâçéèêëîïôûùüÿœ]+/).some(m => MOTS_MUSIQUE.includes(m)));
const apres21h = S => { const vus = {}; for (const e of S.log) { if (!(e.xp > 0) || e.bonus) continue; const k = jourDe(S, e.t); if (vus[k]) continue; vus[k] = 1; if (new Date(e.t).getHours() >= 21) return true; } return false; };
const gardeRobe = S => (S.g.gear || []).filter(id => GEAR[id] || Object.values(GEAR).some(g => g.id === id)).length;
const objet = id => Object.values(GEAR).find(g => g.id === id) || {};
const panopliesFaites = S => WR_SETS.filter(([k]) => Object.values(GEAR).filter(x => x.set === k).every(x => (S.g.gear || []).includes(x.id)));
const nuitHeures = x => x.h != null ? x.h : (x.bed != null && x.wake != null ? ((x.wake - x.bed) + 24) % 24 : 0);
const compMax = (S, n) => Object.values(((S.g.lz || {}).xp) || {}).filter(x => niveauComp(x) >= n).length;
const mois = t => new Date(t).toISOString().slice(0, 7);

/** Condition de chaque badge. maintenant = Date.now() (passé pour pouvoir tester). */
const CONDITIONS = {
  first: S => S.xp > 0,
  streak3: S => serie(S) >= 3, streak7: S => serie(S) >= 7, streak30: S => serie(S) >= 30,
  stat10: S => STAT_KEYS.some(k => niveauStat(S.stats[k]) >= 10),
  eau3: S => niveauStat(S.stats.eau) >= 3, food3: S => niveauStat(S.stats.nourriture) >= 3,
  bond1: S => Object.values(S.bonds || {}).some(x => x > 0),
  bond3: S => Object.values(S.bonds || {}).some(x => niveauLien(x) >= 5),
  bond5: S => Object.values(S.bonds || {}).some(x => niveauLien(x) >= 10),
  bond20: S => Object.values(S.bonds || {}).some(x => niveauLien(x) >= 15),
  circle: (S, t) => recents(S, 30, t) >= 10,
  loyal: S => fidele(S) >= 4, reunion: S => retrouvailles(S),
  grp1: S => (S.g.fgQ || 0) >= 5,
  grptour: (S, t) => (S.g.fgr || []).some(g => { const M = noms(S).filter(n => ((S.profiles[n] || {}).grp || []).includes(g.id)); return M.length >= 3 && M.every(n => S.bondsLast[n] && t - S.bondsLast[n] < 30 * 864e5); }),
  pu100: S => max(S.g.pu) >= 100, pu30: S => ((S.g.pu || {}).rec || 0) >= 30, pu500: S => max(S.g.pu) >= 500,
  gn120: S => ((S.g.gn || {}).rec || 0) >= 120, run42: S => max(S.g.run) >= 42, zen60: S => max(S.g.md) >= 60,
  book1: S => (S.g.books || []).length >= 1, book5: S => (S.g.books || []).length >= 5,
  clean7: S => joursRepasComplets(S) >= 7,
  clutch: S => apres21h(S), lucky3: S => (S.g.rareN || 0) >= 3, secret1: S => (S.g.secDone || 0) >= 1, rest1: S => (S.g.offs || []).length >= 1,
  bday: S => Object.keys(S.bdDone || {}).length > 0,
  skill1: S => S.log.filter(estMusique).length >= 1, skill3: S => S.log.filter(estMusique).length >= 15,
  perfect: S => !!((S.daily && S.daily.bonusDay) || S.log.some(e => e.dayb)) || Object.values(S.g.rh || {}).some(d => d && d.matin && d.soir && d.matin.length > 0 && d.soir.length > 0),
  chall: S => S.log.some(e => e.dzq) || Object.keys(S.g.afLast || {}).some(k => k.startsWith("af:sorties:")),
  buy1: S => panopliesFaites(S).length >= 1, buy5: S => gardeRobe(S) >= 25, buy15: S => gardeRobe(S) >= 50,
  chest1: S => (S.g.opened || 0) >= 1,
  gear4: S => (S.g.gear || []).filter(id => objet(id).s !== "aura").length >= 10,
  legend: S => (S.g.gear || []).some(id => objet(id).r === 3),
  out1: S => Object.keys(S.g.rel || {}).length >= 1, out3: S => Object.keys(S.g.rel || {}).length >= 3, out12: S => Object.keys(S.g.rel || {}).length >= 12,
  sleep7: S => Object.values(S.g.sleep || {}).filter(x => nuitHeures(x) >= 7).length >= 7,
  plveg: S => compter(S, m => typeAssiette(m) === "veg") >= 5,
  plchef: S => vu(S, "chef"),
  plfast: S => compter(S, m => (m.w === "fast" || m.w === "pouce") && nb(m, "l")) >= 1,
  mood30: S => Object.keys(S.g.mood || {}).length >= 30,
  lz5: S => compMax(S, 5) >= 1, lz3x3: S => compMax(S, 3) >= 3,
  pal2: S => CATS_PALIER.some(c => palier(S, c) >= 1), pal3: S => CATS_PALIER.some(c => palier(S, c) >= 2), palall: S => CATS_PALIER.every(c => palier(S, c) >= 1),
  fam10: S => S.log.filter(e => e.cat === "famille" && e.xp > 0).length >= 10,
  menage30: (S, t) => S.log.filter(e => e.cat === "maison" && e.xp > 0 && mois(e.t) === mois(t)).length >= 30,
  contrat1: S => Object.keys(S.g.perOk || {}).length >= 1,
  prj1: S => (S.g.prj || []).some(p => p.won),
  anc1: S => (S.g.ancL || []).length >= 1,
  veg7: S => serieLegumes(S) >= 7,
};
for (const [min] of RANKS) if (min > 1 && min !== 5) CONDITIONS["rank" + min] = S => niveau(S.xp || 0).l >= min;
for (const k of STAT_KEYS) CONDITIONS["stat5" + k] = S => niveauStat(S.stats[k]) >= 5;

export const conditionDe = id => CONDITIONS[id];
export const sansCondition = () => BADGES.filter(b => !CONDITIONS[b.id]).map(b => b.id);

/** Quels badges sont remplis maintenant ? (ids) */
export function remplis(S = etat(), maintenant = Date.now()) {
  const r = [];
  // une condition qui échoue ne bloque pas les autres
  for (const b of BADGES) { const f = CONDITIONS[b.id]; try { if (f && f(S, maintenant)) r.push(b.id); } catch (e) { erreur("badge:" + b.id, e); } }
  return r;
}

/** Donne les nouveaux badges. Premier passage (badgesInit absent) : on rattrape en silence, comme avant. */
export function verifier() {
  const S = etat(), nouveaux = [];
  const premier = !S.badgesInit;
  for (const id of remplis(S)) if (!S.badges[id]) nouveaux.push(id);
  if (!nouveaux.length && !premier) return [];
  modifier("badges", S2 => { for (const id of nouveaux) S2.badges[id] = Date.now(); S2.badgesInit = true; if (!premier) S2.g.nb = [...new Set([...(S2.g.nb || []), ...nouveaux])]; });
  if (!premier) for (const id of nouveaux) emit("badge:obtenu", { id });
  return nouveaux;
}
