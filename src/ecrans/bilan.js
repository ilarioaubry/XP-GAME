// Moi > Bilan : Semaine / Mois / Année. Humeur, sommeil, « Est-ce que je mange assez ? », points forts, personnes vues, actions, XP.
// Le détail long de l'ancienne version est retiré ; les données techniques sont repliées tout en bas.

import { h } from "../ui/dom.js";
import { etat } from "../core/state.js";
import { cleJour } from "../core/temps.js";
import { LES_ANGLES, angleDe } from "../regles/xp.js";
import { REPAS } from "../regles/repas.js";

const PERIODES = { semaine: ["Semaine", 7], mois: ["Mois", 30], annee: ["Année", 365] };
let periode = "semaine";

const decaler = (cle, n) => { const d = new Date(cle + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const moy = l => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : null);
const NOMS_HUMEUR = ["", "Dur", "Bof", "Moyen", "Bien", "Super"];
const section = (titre, couleur, ...c) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null }, h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre)), c);
const ligne = (k, v) => h("div", { class: "ui-ligne" }, h("span", {}, k), h("b", {}, v));

/** Tout ce qui sert au bilan, calculé sur les N derniers jours (fenêtre glissante). */
export function calculer(S, jours) {
  const fin = cleJour(S), cles = Array.from({ length: jours }, (_, i) => decaler(fin, -(jours - 1 - i)));
  const dans = new Set(cles), G = S.g;
  const log = S.log.filter(e => dans.has(cleJour(S, e.t)) && e.xp > 0);
  const humeurs = cles.map(k => (G.mood || {})[k] || 0);
  const nuits = cles.map(k => (G.sleep || {})[k]).filter(Boolean).map(x => (x.h != null ? x.h : ((x.wake - x.bed) + 24) % 24));
  // « Manges-tu assez ? » : jours où au moins 3 repas sont notés, et assiettes qui ont les 3 familles
  const reperes = cles.map(k => { const n = Object.keys(G.mb || {}).filter(c => c.startsWith(k + ":")).length; return { k, n }; });
  const repasNotes = cles.reduce((s, k) => s + REPAS.filter(r => { const d = (G.mbd || {})[k + ":" + r.periode]; return d && d.m && d.m[r.id]; }).length, 0);
  const assiettes = cles.flatMap(k => Object.values((G.plt || {})[k] || {}));
  const completes = assiettes.filter(m => ["f", "p", "l"].every(q => (m[q] || []).length)).length;
  const xpAngle = Object.fromEntries(LES_ANGLES.map(a => [a.id, 0]));
  log.forEach(e => { xpAngle[angleDe(e.cat)] += e.xp; });
  const vus = [...new Set(log.filter(e => e.who).map(e => e.who))];
  return { cles, humeurs, humeurMoy: moy(humeurs.filter(Boolean)), nuits, sommeilMoy: moy(nuits), repasNotes, repasPossibles: jours * REPAS.length, assiettes: assiettes.length, completes,
    actifs: cles.filter(k => S.days.includes(k)).length, xp: log.reduce((s, e) => s + e.xp, 0), actions: log.length, xpAngle, vus, reperes };
}

function mange(b, jours) {
  const sur = b.repasNotes / Math.max(1, jours * 3);
  const msg = b.repasNotes === 0 ? "Pas de repas noté sur la période : note-les pour que ce point serve." : sur >= 0.8 ? "Oui, tu manges régulièrement." : sur >= 0.5 ? "Presque : il manque quelques repas dans la période." : "Il manque des repas notés : un petit-déj ou un dîner de plus aiderait.";
  return section("Est-ce que je mange assez ?", "var(--angle-corps)",
    h("p", { class: "t-texte" }, msg), ligne("Repas notés", `${b.repasNotes}`), ligne("Assiettes", `${b.assiettes}`), ligne("Avec féculent, protéine et légume", `${b.completes}`));
}

function humeurs(b) {
  return section("Humeur et sommeil", "var(--angle-esprit)",
    h("div", { class: "histo", role: "img", "aria-label": "Humeur jour par jour" }, b.humeurs.slice(-31).map(v => h("i", { style: `--v:${v * 20}%`, class: v ? "" : "vide-jour" }))),
    ligne("Humeur moyenne", b.humeurMoy == null ? "pas notée" : NOMS_HUMEUR[Math.round(b.humeurMoy)]),
    ligne("Sommeil moyen", b.sommeilMoy == null ? "pas noté" : b.sommeilMoy.toFixed(1).replace(".", ",") + " h"));
}

function forts(b) {
  const tri = LES_ANGLES.map(a => ({ ...a, xp: b.xpAngle[a.id] })).sort((x, y) => y.xp - x.xp);
  return section("Points forts", "var(--angle-liens)",
    b.xp ? h("p", { class: "t-texte" }, `${tri[0].nom} a porté ta période (${tri[0].xp} XP).`) : h("p", { class: "vide" }, "Rien à raconter encore sur cette période."),
    h("div", { class: "angles" }, tri.map(a => h("div", { class: "angle", style: `--ac:${a.couleur}` }, h("span", { class: "angle__nom t-info" }, a.nom), h("div", { class: "ui-barre" }, h("i", { style: `--p:${b.xp ? Math.round(100 * a.xp / b.xp) : 0}%` })), h("span", { class: "t-info" }, a.xp + " XP")))));
}

export function bilan(donnees) {
  const S = etat(), [, jours] = PERIODES[periode], b = calculer(S, jours);
  return h("div", { class: "bilan" },
    h("div", { class: "puces", role: "tablist" }, Object.entries(PERIODES).map(([id, [n]]) => h("button", { class: "bouton puce", role: "tab", "aria-selected": String(id === periode), onclick: () => { periode = id; document.dispatchEvent(new CustomEvent("moi:rubrique")); } }, n))),
    section("En bref", "var(--angle-foyer)", ligne("XP gagnée", `${b.xp}`), ligne("Actions", `${b.actions}`), ligne("Jours actifs", `${b.actifs} sur ${jours}`),
      ligne("Personnes vues", b.vus.length ? b.vus.join(", ") : "personne pour l'instant")),
    humeurs(b), mange(b, jours), forts(b),
    h("details", { class: "suivis" }, h("summary", { class: "t-carte" }, "Données et journal d'erreurs"), donnees()));
}
