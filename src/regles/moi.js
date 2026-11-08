// Règles de Moi : projets, événements, « la dernière fois que », paliers par Angle, objets, titres, panoplies, badges.
// Clés d'origine lues telles quelles : prj, ev, gear, eq, rt, S.badges. Nouvelles clés : S.g.last, S.g.titre.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour, niveau, xpPourNiveau } from "../core/temps.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { WR_SETS } from "../donnees/brut/icones-unifiees.js";
import { RANKS } from "../donnees/brut/donnees-base.js";
import { BADGES } from "../donnees/brut/badges.js";
import { LES_ANGLES, gagner } from "./xp.js";

const nouvelId = () => Math.random().toString(36).slice(2, 8);
export const OBJETS = Object.values(GEAR);

// ---- Événements : S.g.ev = [{ id, n, d: "AAAA-MM-JJ" }]
export const evenements = (S = etat()) => (S.g.ev || []).slice().sort((a, b) => a.d.localeCompare(b.d));
export function ajouterEvenement(n, d) { const e = { id: nouvelId(), n, d }; modifier("evenement", S => { (S.g.ev ||= []).push(e); }); emit("evenement:ajoute", e); return e; }
export function retirerEvenement(id) {
  let sauve, pos;
  modifier("evenement-retire", S => { pos = (S.g.ev || []).findIndex(e => e.id === id); if (pos >= 0) [sauve] = S.g.ev.splice(pos, 1); });
  return () => modifier("evenement-rendu", S => { if (sauve) S.g.ev.splice(Math.min(pos, S.g.ev.length), 0, sauve); });
}

// ---- Projets : S.g.prj = [{ id, n, steps: [{ t, done }] }]
export const projets = (S = etat()) => S.g.prj || [];
export function ajouterProjet(n) { modifier("projet", S => { (S.g.prj ||= []).push({ id: nouvelId(), n, steps: [] }); }); emit("projet:modifie", {}); }
export function ajouterEtape(id, t) { modifier("projet-etape", S => { const p = (S.g.prj || []).find(x => x.id === id); if (p) p.steps.push({ t, done: false }); }); emit("projet:modifie", {}); }
export function basculerEtape(id, i) {
  let fait = false;
  modifier("projet-etape-faite", S => { const e = ((S.g.prj || []).find(x => x.id === id) || { steps: [] }).steps[i]; if (e) { e.done = !e.done; fait = e.done; } });
  if (fait) gagner({ id: `prj:${id}:${i}`, nom: "Étape de projet", cat: "travail", xp: 3 });
  emit("projet:modifie", {});
}
export function retirerProjet(id) {
  let sauve, pos;
  modifier("projet-retire", S => { pos = (S.g.prj || []).findIndex(p => p.id === id); if (pos >= 0) [sauve] = S.g.prj.splice(pos, 1); });
  return () => modifier("projet-rendu", S => { if (sauve) S.g.prj.splice(Math.min(pos, S.g.prj.length), 0, sauve); });
}

// ---- « La dernière fois que… » : S.g.last = [{ id, n, d }]
export const dernieresFois = (S = etat()) => S.g.last || [];
export function ajouterDerniere(n) { modifier("derniere", S => { (S.g.last ||= []).push({ id: nouvelId(), n, d: cleJour(S) }); }); }
export function dernierFaitAujourdhui(id) { modifier("derniere-maj", S => { const x = (S.g.last || []).find(l => l.id === id); if (x) x.d = cleJour(S); }); }
export function retirerDerniere(id) {
  let sauve, pos;
  modifier("derniere-retiree", S => { pos = (S.g.last || []).findIndex(l => l.id === id); if (pos >= 0) [sauve] = S.g.last.splice(pos, 1); });
  return () => modifier("derniere-rendue", S => { if (sauve) S.g.last.splice(Math.min(pos, S.g.last.length), 0, sauve); });
}
export function joursDepuis(d, S = etat()) { return Math.round((new Date(cleJour(S) + "T12:00:00") - new Date(d + "T12:00:00")) / 864e5); }

// ---- Paliers par Angle : on regroupe l'XP par catégorie (S.stats) en 4 Angles ; un palier = un niveau de cet Angle.
export function paliers(S = etat()) {
  const total = LES_ANGLES.map(a => ({ ...a, xp: a.cats.reduce((s, c) => s + (+S.stats[c] || 0), 0) }));
  const somme = total.reduce((s, a) => s + a.xp, 0) || 1;
  return total.map(a => { const nv = niveau(a.xp); return { ...a, palier: nv.l, cur: nv.cur, need: nv.need, part: Math.round(100 * a.xp / somme) }; });
}

// ---- Objets : S.g.gear = ids obtenus, S.g.eq = { emplacement: id }
export const obtenus = (S = etat()) => new Set(S.g.gear || []);
export const objetsDe = (slot, S = etat()) => OBJETS.filter(o => o.s === slot).map(o => ({ ...o, a: obtenus(S).has(o.id) }));
export const equipe = (slot, S = etat()) => (S.g.eq || {})[slot] || "";
export function equiper(slot, id) {
  modifier("equipement", S => { const eq = (S.g.eq ||= {}); if (eq[slot] === id) delete eq[slot]; else eq[slot] = id; });
  emit("equipement:change", { slot, id });
}

// ---- Titres : ceux du rang (jusqu'au niveau atteint) + ceux gagnés (S.g.rt). Titre porté : S.g.titre
export function titres(S = etat()) {
  const nv = niveau(S.xp || 0).l;
  const rang = RANKS.filter(([l]) => l <= nv).map(([, n]) => ({ n, src: "Rang" }));
  const gagnes = (S.g.rt || []).filter(n => !rang.some(r => r.n === n)).map(n => ({ n, src: "Gagné" }));
  return { obtenus: [...rang, ...gagnes], total: RANKS.length + 8 };
}
export const titrePorte = (S = etat()) => S.g.titre || "";
export function porterTitre(n) { modifier("titre", S => { if (S.g.titre === n) delete S.g.titre; else S.g.titre = n; }); emit("equipement:change", { slot: "titre", id: n }); }

// ---- Panoplies : un ensemble est complet quand toutes ses pièces sont obtenues (champ explicite `set` de chaque objet)
export function panoplies(S = etat()) {
  const a = obtenus(S);
  return WR_SETS.map(([k, nom, titre]) => {
    const pieces = OBJETS.filter(o => o.set === k);
    const n = pieces.filter(o => a.has(o.id)).length;
    return { k, nom, titre, n, total: pieces.length, complet: pieces.length > 0 && n === pieces.length };
  });
}

// ---- Badges : obtenus = S.badges { id: date }. L'attribution (72 conditions) est portée à part (voir V2.md).
export const badges = (S = etat()) => BADGES.map(b => ({ ...b, a: !!(S.badges || {})[b.id] }));
export { xpPourNiveau };
