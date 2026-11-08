// Quêtes d'Aujourd'hui, tirées de catalogues EXPLICITES (aucune fonction ni expression régulière sur les noms) :
//  - quêtes du jour : FAM (id, domaine, catégorie, libellé, xp, options)
//  - quêtes spéciales : IDQ (idées « qui tu deviens »), ECL (défis éclair) + l'événement du calendrier proche
// Le tirage est stable pour la journée (même liste si on rouvre l'appli). « Fait » se lit dans le journal.
//  - quêtes « pour toi » (POUR_TOI) : selon la fiche (situation, objectifs, goûts), la météo, l'humeur, l'heure ; quêtes d'événement (EVQ) : selon le calendrier.
// Les conditions sont des champs explicites (donnees/quetes-pour-toi.js), jamais des expressions sur les noms.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { FAM, IDQ } from "../donnees/brut/quetes.js";
import { ECL } from "../donnees/brut/moments.js";
import { CLAR } from "../donnees/brut/quetes-pour-toi-histoire.js";
import { POUR_TOI, EVQ, TYPES_EVENEMENT } from "../donnees/quetes-pour-toi.js";
import { heureJournee } from "../core/temps.js";
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

// ---- Contexte du moment : la fiche (S.g.sit), les goûts (S.g.taste.art), la météo, l'humeur et la nuit
function contexte(S) {
  const G = S.g, sit = (G.sit && typeof G.sit === "object") ? G.sit : {}, j = cleJour(S), jour = new Date();
  const w = G.wx && G.wx.c && G.wx.c.t != null ? G.wx.c : null;
  const objectifs = new Set(sit.goals || []), gouts = new Set(sit.pass || []);
  const hr = heureJournee(S) % 24, sm = (G.sleep || {})[j], md = (G.mood || {})[j] | 0;
  return {
    h: hr, job: sit.job || "", home: sit.home || "", temps: sit.time || "", note: (sit.note || "").trim(), avec: (Array.isArray(sit.with) && sit.with[0]) || "",
    objectifs, gouts, artistes: ((G.taste && G.taste.art) || []).slice(), weekend: [0, 6].includes(jour.getDay()), mois: jour.getMonth(), jourDuMois: jour.getDate(),
    humeur: md, fatigue: !!(sm && sm.h < 6), meteo: w && { beau: (w.k === "clear" || w.k === "partly") && w.t >= 8 && w.t <= 30, pluie: ["rain", "storm", "snow"].includes(w.k), jour: hr >= 7 && hr <= 20 },
    dentiste: Date.now() - (((G.afLast || {})["af:sante:Dentiste"]) || 0) > 300 * 864e5,
  };
}

/** Une alternative est satisfaite quand TOUTES ses contraintes le sont. */
function alternativeOk(a, c) {
  for (const [k, v] of Object.entries(a)) {
    const ok = k === "artiste" ? c.artistes.length > 0 : k === "job" ? v.includes(c.job) : k === "home" ? v.includes(c.home) : k === "objectif" ? c.objectifs.has(v) : k === "gout" ? c.gouts.has(v)
      : k === "beau" ? !!(c.meteo && c.meteo.beau) : k === "horsPluie" ? !!(c.meteo && !c.meteo.pluie) : k === "jour" ? !!(c.meteo && c.meteo.jour)
      : k === "humeurBasse" ? c.humeur > 0 && c.humeur <= 2 : k === "fatigue" ? c.fatigue : k === "weekendOuLibre" ? c.weekend || !["poste", "etud"].includes(c.job)
      : k === "quelquUn" ? !!c.avec : k === "note" ? !!c.note : k === "mois" ? v.includes(c.mois) : k === "debutMois" ? c.jourDuMois <= 5
      : k === "sansTempsCourt" ? c.temps !== "peu" : k === "dentisteAnciens" ? c.dentiste : false;
    if (!ok) return false;
  }
  return true;
}
const conditionOk = (si, c) => !si || si.some(a => alternativeOk(a, c));

function pourquoiDe(p, c) {
  if (typeof p === "string") return p;
  const m = c.meteo;
  return (p.pluie && m && m.pluie && p.pluie) || (p.beau && m && m.beau && p.beau) || (p.bas && c.humeur > 0 && c.humeur <= 2 && p.bas)
    || (p.debutMois && c.jourDuMois <= 5 && p.debutMois) || (p.coloc && c.home === "coloc" && p.coloc) || (p.gout && p.gout) || p.defaut;
}
const remplir = (t, c, A) => t.replace("{A}", A || "").replace("{W}", c.avec).replace("{note}", c.note);

/** Quêtes « pour toi » : jusqu'à 2, tirées de la fiche. Tirage stable pour la journée. */
export function quetesPourToi(S = etat()) {
  const j = cleJour(S), c = contexte(S), hors = ecartees(S, j);
  let r = graine("pt" + j) || 1;
  const rnd = () => { r = (Math.imul(r, 1664525) + 1013904223) >>> 0; return r / 4294967296; };
  const sem = S.log.filter(e => Date.now() - e.t < 7 * 864e5);
  const sansSport = !sem.some(e => e.cat === "sport"), sansSon = !sem.some(e => String(e.a || "").startsWith("pt:a_") || String(e.a || "").startsWith("pt:v_son"));
  const pri = ((S.g.vie || {}).pri) || [];
  const triFait = S.log.some(e => cleJour(S, e.t) === j && (CLAR.some(x => e.name === x[2]) || /^af:clarte:/.test(e.a || "")));
  const tris = triFait ? [] : CLAR.filter(([, l, t, , fr]) => {
    const dernier = Math.max(((S.g.afLast || {})["af:clarte:" + l]) || 0, ...S.log.filter(e => e.name === t).map(e => e.t), 0);
    return !dernier || (Date.now() - dernier) / 864e5 >= fr[0];
  }).map(([k, l, t, xp]) => ({ id: "t_" + k, nom: t, cat: "maison", xp, h: [9, 23], si: null, pourquoi: "Tri : " + l.toLowerCase(), o: { court: 1, dedans: 1 } }));
  const pool = [];
  for (const q of [...POUR_TOI, ...tris]) {
    const o = q.o || {};
    if (c.h >= q.h[1] - 0.5 || !conditionOk(q.si, c)) continue;
    if ((o.weekend && !c.weekend) || (o.semaine && c.weekend)) continue;
    if (o.dehors && c.meteo && (c.meteo.pluie || (!c.meteo.jour && c.h > 19))) continue;
    const parArtiste = q.id.startsWith("a_") ? c.artistes.slice(0, 2) : [null];
    for (const A of parArtiste) {
      if (q.id.startsWith("a_") && !A) continue;
      const id = "pt:" + q.id + (A ? ":" + A : "");
      if (hors.includes(id)) continue;
      let w = 1 + rnd();
      if (A) w += 1.2; if (q.id === "n_note") w += 1.5;
      if (c.meteo && c.meteo.beau && o.dehors) w += 1; if (c.meteo && c.meteo.pluie && o.dedans) w += 1;
      if (c.temps === "peu" && o.court) w += 0.8; if (c.temps === "peu" && q.xp >= 30) w -= 0.8;
      if (pri.includes(q.cat)) w += 1.2; if (o.court) w += 0.6; if (/^(v_|a_|p_sortie)/.test(q.id)) w += 0.4;
      if (sansSport && q.cat === "sport") w += 3; if (sansSon && (q.id.startsWith("a_") || q.id === "v_son")) w += 3;
      if (q.id.startsWith("t_")) w += 1;
      pool.push({ id, q, A, w });
    }
  }
  pool.sort((a, b) => b.w - a.w);
  const sortie = [], familles = new Set(), angles = new Set();
  for (const x of pool) {
    const fam = x.q.id.split("_")[0], ang = angleDe(x.q.cat);
    if ((familles.has(fam) && fam !== "a") || angles.has(ang)) continue;
    familles.add(fam); angles.add(ang);
    sortie.push({ id: x.id, nom: remplir(x.q.nom, c, x.A), cat: x.q.cat, xp: x.q.xp + (x.q.o && x.q.o.courage ? 15 : 0), angle: ang, why: remplir(pourquoiDe(x.q.pourquoi, c), c, x.A) });
    if (sortie.length === 2) break;
  }
  return sortie;
}

/** 3 quêtes du jour, une par angle différent : jusqu'à 2 « pour toi », puis le catalogue de base. */
export function quetesDuJour(S = etat()) {
  const j = cleJour(S);
  const hors = ecartees(S, j);
  const r = quetesPourToi(S), vues = new Set(r.map(q => q.angle));
  for (const f of melange(FAMILLES, "dq" + j)) {
    if (r.length === 3) break;
    const a = angleDe(f.cat);
    if (vues.has(a) || hors.includes("dq:" + f.id)) continue;
    vues.add(a);
    const option = f.o && f.o.length ? f.o[graine(j + f.id) % f.o.length] : "";
    r.push({ id: "dq:" + f.id, nom: option ? `${f.l} : ${option}` : f.l, cat: f.cat, xp: f.xp, angle: a });
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

// ---- Quêtes d'événement : un événement du calendrier (S.g.ev : {id, n, d, t, a}) propose des préparatifs de J-10 à J+1.
const QUAND = d => (d < 0 ? "hier" : d === 0 ? "aujourd'hui" : d === 1 ? "demain" : `dans ${d} jours`);
const joursAvant = (e, S) => Math.round((new Date(e.d + "T12:00:00") - new Date(cleJour(S) + "T12:00:00")) / 864e5);
export function quetesEvenement(S = etat()) {
  const evq = S.g.evq || {}, hors = ecartees(S, cleJour(S)), sortie = [];
  for (const { e, d } of (S.g.ev || []).filter(e => e && e.d).map(e => ({ e, d: joursAvant(e, S) })).filter(x => x.d >= -1 && x.d <= 10).sort((a, b) => Math.abs(a.d) - Math.abs(b.d))) {
    if (sortie.length >= 2) break;
    const type = e.t || "autre", faits = evq[e.id] || [];
    const choix = EVQ.filter(q => q.type === type && d <= q.de && d >= q.a && !faits.includes(q.id) && !hors.includes("ev:" + e.id + ":" + q.id) && (q.si !== "artiste" || e.a));
    if (!choix.length) continue;
    const q = choix[(graine(cleJour(S) + e.id)) % choix.length];
    const nomType = (TYPES_EVENEMENT.find(t => t[0] === type) || [0, "Événement"])[1];
    sortie.push({ id: "ev:" + e.id + ":" + q.id, nom: q.nom.replace("{A}", e.a || "l'artiste").replace("{n}", e.n), cat: q.cat, xp: q.xp + (type === "entretien" && (q.id === "rep" || q.id === "merci") ? 15 : 0),
      angle: angleDe(q.cat), ev: e.id, tpl: q.id, why: `${nomType} ${QUAND(d)} : ${e.n}`.slice(0, 60) });
  }
  return sortie;
}

export const quetteFaite = id => faitAujourdhui(id);

/** Valide une quête. Les quêtes spéciales (sp:, ecl:) comptent aussi un cran de coffre. */
export function faire(q) {
  if (faitAujourdhui(q.id)) return false;
  gagner({ id: q.id, nom: q.nom, cat: q.cat, xp: q.xp });
  if (q.ev) modifier("evq", S => { const L = ((S.g.evq ||= {})[q.ev] ||= []); if (!L.includes(q.tpl)) L.push(q.tpl); });
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
