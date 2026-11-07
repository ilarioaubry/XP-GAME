// Quêtes d'Aujourd'hui, tirées de catalogues EXPLICITES (aucune fonction ni expression régulière sur les noms) :
//  - quêtes du jour : FAM (id, domaine, catégorie, libellé, xp, options)
//  - quêtes spéciales : IDQ (idées « qui tu deviens »), ECL (défis éclair) + l'événement du calendrier proche
// Le tirage est stable pour la journée (même liste si on rouvre l'appli). « Fait » se lit dans le journal.
// Les 191 quêtes « pour toi » (FQ) et 51 quêtes d'événement (EVQ) arrivent avec leurs champs explicites en brique 3/4.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { FAM, IDQ } from "../donnees/brut/quetes.js";
import { ECL } from "../donnees/brut/moments.js";
import { gagner, faitAujourdhui, angleDe } from "./xp.js";
import { ajouterCran } from "./coffre.js";

const graine = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
function melange(liste, cle) {
  const a = liste.slice(); let s = graine(cle) || 1;
  for (let i = a.length - 1; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const FAMILLES = Object.values(FAM);
const ecartees = (S, j) => ((S.g.qNo || {})[j]) || [];

/** 3 quêtes du jour, une par angle différent autant que possible. */
export function quetesDuJour(S = etat()) {
  const j = cleJour(S);
  const hors = ecartees(S, j);
  const vues = new Set(), r = [];
  for (const f of melange(FAMILLES, "dq" + j)) {
    const a = angleDe(f.cat);
    if (vues.has(a) || hors.includes("dq:" + f.id)) continue;
    vues.add(a);
    const option = f.o && f.o.length ? f.o[graine(j + f.id) % f.o.length] : "";
    r.push({ id: "dq:" + f.id, nom: option ? `${f.l} : ${option}` : f.l, cat: f.cat, xp: f.xp, angle: a });
    if (r.length === 3) break;
  }
  return r;
}

/** 2 quêtes spéciales (idée d'identité + défi éclair) ; le tirage est stable pour le jour. */
export function quetesSpeciales(S = etat()) {
  const j = cleJour(S);
  const hors = ecartees(S, j);
  const idee = melange(IDQ, "idq" + j).map(q => ({ id: "sp:" + graine(q[0]), nom: q[0], cat: "perso", xp: q[3], angle: "esprit", icone: q[5] }));
  const eclair = melange(ECL, "ecl" + j).map(q => ({ id: "ecl:" + graine(q[0]), nom: q[0], cat: q[1], xp: 10, angle: angleDe(q[1]) }));
  return [idee.find(q => !hors.includes(q.id)), eclair.find(q => !hors.includes(q.id))].filter(Boolean);
}

/** Événement du calendrier dans les 2 jours (S.g.ev : [{n, d: "AAAA-MM-JJ"}]), pour la carte « À venir ». */
export function evenementProche(S = etat()) {
  const j = cleJour(S), d2 = new Date(j + "T12:00:00"); d2.setDate(d2.getDate() + 2);
  const lim = d2.getFullYear() + "-" + String(d2.getMonth() + 1).padStart(2, "0") + "-" + String(d2.getDate()).padStart(2, "0");
  return (S.g.ev || []).filter(e => e && e.d && e.d >= j && e.d <= lim).sort((a, b) => a.d.localeCompare(b.d))[0] || null;
}

export const quetteFaite = id => faitAujourdhui(id);

/** Valide une quête. Les quêtes spéciales (sp:, ecl:) comptent aussi un cran de coffre. */
export function faire(q) {
  if (faitAujourdhui(q.id)) return false;
  gagner({ id: q.id, nom: q.nom, cat: q.cat, xp: q.xp });
  emit("quete:faite", { id: q.id });
  if (q.id.startsWith("sp:") || q.id.startsWith("ecl:")) ajouterCran("quete:" + q.id);
  return true;
}

/** Écarte une quête pour aujourd'hui (rien n'est perdu, aucun malus). */
export function ecarter(id) {
  modifier("quete-ecartee", S => {
    const j = cleJour(S);
    const t = ((S.g.qNo ||= {})[j] ||= []);
    if (!t.includes(id)) t.push(id);
    for (const k of Object.keys(S.g.qNo)) if (k < j) delete S.g.qNo[k]; // on ne garde que le jour
  });
  emit("quete:ecartee", { id });
}
export function rappeler(id) {
  modifier("quete-rappel", S => { const t = (S.g.qNo || {})[cleJour(S)]; if (t) t.splice(t.indexOf(id) >>> 0, 1); });
}

// ---- Habitudes libres (1 ou 2) : S.g.hab = [{ id, n, cat, xp }]
export const HABITUDES_DEFAUT = [
  { id: "h1", n: "Boire un verre d'eau", cat: "eau", xp: 2 },
  { id: "h2", n: "10 pompes", cat: "sport", xp: 5 },
];
export const habitudes = (S = etat()) => (S.g.hab && S.g.hab.length ? S.g.hab : HABITUDES_DEFAUT).slice(0, 2);
export function faireHabitude(h) {
  if (faitAujourdhui("hab:" + h.id)) return false;
  gagner({ id: "hab:" + h.id, nom: h.n, cat: h.cat, xp: h.xp });
  emit("habitude:faite", { id: h.id });
  return true;
}
