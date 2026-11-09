// Moi > Bilan : Semaine / Mois / Année. Humeur, sommeil, « Est-ce que je mange assez ? », points forts, personnes vues, actions, XP.
// Le détail long de l'ancienne version est retiré ; les données techniques sont repliées tout en bas.

import { h } from "../ui/dom.js";
import { saisir } from "../ui/plein.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { imageAssiette } from "./assiette.js";
import { visageHumeur } from "../avatar/rendu.js";
import { vide } from "../ui/illustrations.js";
import { dire } from "../ui/messages.js";
import * as M from "../regles/moi.js";
import { TYPES_EVENEMENT } from "../donnees/quetes-pour-toi.js";
import { etat, modifier } from "../core/state.js";
import { cleJour } from "../core/temps.js";
import { LES_ANGLES, angleDe } from "../regles/xp.js";
import { REPAS } from "../regles/repas.js";

const PERIODES = { semaine: ["Semaine", 7], mois: ["Mois", 30], annee: ["Année", 365] };
let periode = "semaine";

const decaler = (cle, n) => { const d = new Date(cle + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const moy = l => (l.length ? l.reduce((a, b) => a + b, 0) / l.length : null);
const NOMS_HUMEUR = ["", "Dur", "Bof", "Moyen", "Bien", "Super"];
const section = (titre, couleur, ...c) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null }, h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre)), c);
const sectionD = (titre, couleur, droite, ...c) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null }, h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre), h("span", { class: "ui-entete__droite" }, droite)), c);

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

/** Un chiffre illustré : l'image, le nombre, deux mots. */
const chiffre = (image, n, mots) => h("div", { class: "chiffre" }, h("span", { class: "chiffre__img" }, image), h("b", {}, String(n)), h("span", {}, mots));

function mange(b, jours) {
  const sur = b.repasNotes / Math.max(1, jours * 3);
  const msg = b.repasNotes === 0 ? "Pas de repas noté sur la période : note-les pour que ce point serve." : sur >= 0.8 ? "Oui, tu manges régulièrement." : sur >= 0.5 ? "Presque : il manque quelques repas dans la période." : "Il manque des repas notés : un petit-déj ou un dîner de plus aiderait.";
  return section("Est-ce que je mange assez ?", "var(--angle-corps)",
    h("p", { class: "t-texte" }, msg),
    h("div", { class: "chiffres" },
      chiffre(h("span", { html: pxRk("repas", 48) || "" }), b.repasNotes, "repas notés"),
      chiffre(h("img", { class: "px", src: imageAssiette({ f: 1, p: 1, l: 0 }), alt: "" }), b.assiettes, "assiettes"),
      chiffre(h("img", { class: "px", src: imageAssiette({ f: 3, p: 3, l: 3 }, "equi"), alt: "" }), b.completes, "complètes")));
}

function humeurs(b) {
  return section("Humeur et sommeil", "var(--angle-esprit)",
    b.humeurs.length <= 7
      ? h("div", { class: "visages-sem", role: "img", "aria-label": "Humeur jour par jour" }, b.humeurs.map((v, i) => h("div", { class: "visages-sem__j" },
        v ? h("span", { html: visageHumeur(etat(), v, 40) }) : h("span", { class: "visages-sem__rien" }), h("span", { class: "t-info" }, lettre(b.cles.at(i))))))
      : h("div", { class: "histo", role: "img", "aria-label": "Humeur jour par jour" }, b.humeurs.slice(-31).map(v => h("i", { style: `--v:${v * 20}%`, class: v ? "" : "vide-jour" }))),
    h("div", { class: "chiffres" },
      chiffre(b.humeurMoy == null ? h("span", { html: pxRk("bulle", 48) || "" }) : h("span", { html: visageHumeur(etat(), Math.round(b.humeurMoy), 48) }), b.humeurMoy == null ? "—" : NOMS_HUMEUR[Math.round(b.humeurMoy)], "humeur moyenne"),
      chiffre(h("span", { html: pxRk("lit", 48) || "" }), b.sommeilMoy == null ? "—" : b.sommeilMoy.toFixed(1).replace(".", ",") + " h", "de sommeil")));
}

function forts(b) {
  const tri = LES_ANGLES.map(a => ({ ...a, xp: b.xpAngle[a.id] })).sort((x, y) => y.xp - x.xp);
  return section("Points forts", "var(--angle-liens)",
    b.xp ? null : vide("Rien à raconter encore sur cette période.", "lire"),
    h("div", { class: "forts" }, tri.map((a, i) => h("div", { class: "fort" + (i === 0 && b.xp ? " fort--premier" : ""), style: `--ac:var(--angle-${a.id})` },
      h("span", { class: "fort__ic", html: pxRk(a.icone, i === 0 && b.xp ? 48 : 32) || "" }), h("span", { class: "fort__nom" }, a.nom),
      h("div", { class: "ui-barre" }, h("i", { style: `--p:${b.xp ? Math.round(100 * a.xp / b.xp) : 0}%` })), h("span", { class: "ui-compteur" }, a.xp + " XP")))));
}

const LETTRES = ["D", "L", "M", "M", "J", "V", "S"];
const lettre = k => LETTRES[new Date(k + "T12:00:00").getDay()];

/** Chiffres « en vrai » : ce qu'on a fait, compté dans le journal sur la période. */
function envrai(S, b, jours) {
  const dans = new Set(b.cles), log = S.log.filter(e => dans.has(cleJour(S, e.t)) && e.xp > 0);
  const n = f => log.filter(f).length, id = e => String(e.a || "");
  return [[b.vus.length, "proches vus", "var(--angle-liens)", "duo"], [n(e => e.cat === "sport"), "séances", "var(--angle-corps)", "halteres"], [n(e => id(e).startsWith("af:")), "actions", "var(--c-orange)", "etoile"],
    [n(e => id(e).startsWith("rt:")), "routines", "var(--angle-esprit)", "soleil"], [b.repasNotes, "repas notés", "var(--angle-corps)", "repas"], [b.actifs, "jours actifs", "var(--angle-foyer)", "calendrier"]];
}

function chapitre(S, b) {
  const tri = LES_ANGLES.map(a => ({ ...a, xp: b.xpAngle[a.id] })).sort((x, y) => y.xp - x.xp)[0];
  const nom = ((S.g.chap || {})[periode]) || (b.xp ? `Une période ${tri.nom.toLowerCase()}` : "Une page blanche");
  const quand = { semaine: "LA SEMAINE", mois: "DU MOIS", annee: "DE L'ANNÉE" }[periode];
  return h("button", { class: "chapitre", onclick: () => saisir("Nom du chapitre", [{ id: "n", etiquette: "Comment s'appelle cette période ?", defaut: nom }],
    v => modifier("chapitre", s => { (s.g.chap ||= {})[periode] = v.n; }), "Renommer") },
    h("span", { class: "chapitre__quand" }, "CHAPITRE " + quand), h("span", { class: "chapitre__nom" }, nom), h("span", { class: "chapitre__aide" }, "Toucher pour renommer"));
}

function xpParJour(S, b, jours) {
  const cles = b.cles.slice(-Math.min(jours, 31)), par = Object.fromEntries(cles.map(k => [k, 0]));
  S.log.forEach(e => { const k = cleJour(S, e.t); if (k in par && e.xp > 0) par[k] += e.xp; });
  const max = Math.max(1, ...Object.values(par)), auj = cleJour(S);
  return sectionD("XP par jour", "var(--c-orange)", `${b.xp} XP`,
    h("div", { class: "xpj", role: "img", "aria-label": "XP gagnée jour par jour" }, cles.map(k => h("div", { class: "xpj__col" + (k === auj ? " xpj__col--auj" : "") },
      h("div", { class: "xpj__piste" }, h("i", { style: `--v:${Math.round(100 * par[k] / max)}%` })), cles.length <= 8 ? h("span", {}, lettre(k)) : null))));
}

function assietteSemaine(S, b) {
  const cles = b.cles.slice(-7);
  // l'assiette du jour en image : chaque côté se remplit avec ce qui a été mangé midi et soir (3 portions = plein)
  const niveaux = k => { const n = { f: 0, p: 0, l: 0 }; for (const m of Object.values((S.g.plt || {})[k] || {})) for (const f of ["f", "p", "l"]) n[f] = Math.min(3, n[f] + (m[f] || []).length); return n; };
  return sectionD("Mon assiette", "var(--angle-corps)", "7 derniers jours",
    h("div", { class: "assiette-sem" }, cles.map(k => { const n = niveaux(k), g = ["f", "p", "l"].filter(f => n[f]).length;
      return h("div", { class: "assiette-sem__j" }, h("img", { class: "px", src: imageAssiette(n, g === 3 ? "equi" : ""), alt: `${g} groupe${g > 1 ? "s" : ""} sur 3` }), h("span", {}, lettre(k))); })));
}

// ---- Calendrier : un mois, avec ce qui s'est passé (XP, humeur) et les événements ; un jour touché s'ouvre dessous.
let moisVu = null, jourVu = null;
const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const cle = (a, m, j) => a + "-" + String(m + 1).padStart(2, "0") + "-" + String(j).padStart(2, "0");
const bouge = () => document.dispatchEvent(new CustomEvent("moi:rubrique"));

function calendrier(S) {
  const auj = cleJour(S);
  if (!moisVu) moisVu = auj.slice(0, 7);
  if (!jourVu) jourVu = auj;
  const [an, mo] = moisVu.split("-").map(Number), m0 = mo - 1;
  const nbJours = new Date(an, m0 + 1, 0).getDate(), decal = (new Date(an, m0, 1).getDay() + 6) % 7;
  const evs = M.evenements(S), xpJour = {};
  for (const e of S.log) if (e.xp > 0) { const k = cleJour(S, e.t); xpJour[k] = (xpJour[k] || 0) + e.xp; }
  const titreMois = new Date(an, m0, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const aller = n => { const d = new Date(an, m0 + n, 1); moisVu = cle(d.getFullYear(), d.getMonth(), 1).slice(0, 7); bouge(); };
  const cases = [...Array(decal).fill(null), ...Array.from({ length: nbJours }, (_, i) => i + 1)].map(j => {
    if (!j) return h("span", { class: "cal__vide" });
    const k = cle(an, m0, j), ev = evs.some(e => e.d === k), hu = (S.g.mood || {})[k];
    return h("button", { class: "cal__jour" + (k === auj ? " cal__jour--auj" : "") + (k === jourVu ? " cal__jour--choisi" : ""), "aria-label": `${j} ${titreMois}`, "aria-pressed": String(k === jourVu),
      onclick: () => { jourVu = k; bouge(); } },
      h("span", { class: "cal__num" }, String(j)),
      h("span", { class: "cal__points" }, h("i", { class: xpJour[k] ? "xp" : "" }), h("i", { class: hu ? "hu" : "" }), h("i", { class: ev ? "ev" : "" })));
  });
  // détail du jour choisi
  const logJour = S.log.filter(l => cleJour(S, l.t) === jourVu && l.xp > 0);
  const evJour = evs.filter(e => e.d === jourVu), hu = (S.g.mood || {})[jourVu];
  const dateLongue = new Date(jourVu + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const detail = h("div", { class: "cal__detail" },
    h("p", { class: "ui-carte__titre" }, dateLongue.charAt(0).toUpperCase() + dateLongue.slice(1)),
    h("p", { class: "ui-carte__texte" }, [xpJour[jourVu] ? `${xpJour[jourVu]} XP` : "Pas d'XP", hu ? "humeur " + NOMS_HUMEUR[hu].toLowerCase() : null].filter(Boolean).join(" · ")),
    evJour.map(e => h("div", { class: "ligne-carte ui-carte" }, h("div", { class: "ligne-carte__texte" }, h("p", { class: "ui-carte__titre" }, e.n), h("p", { class: "ui-carte__texte" }, (TYPES_EVENEMENT.find(t => t[0] === e.t) || [, "Événement"])[1])),
      h("button", { class: "bouton bouton--icone", "aria-label": "Supprimer", title: "Supprimer", html: pxUi("trash", 24), onclick: () => dire("Événement supprimé", M.retirerEvenement(e.id)) }))),
    logJour.slice(-6).reverse().map(l => h("p", { class: "t-texte cal__fait" }, h("span", {}, l.name || l.a), h("b", {}, "+" + l.xp))));
  return h("section", { class: "ui-section", style: "--sc:var(--angle-liens)" },
    h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, "Calendrier"),
      h("button", { class: "bouton bouton--icone", "aria-label": "Ajouter un événement", title: "Ajouter un événement", html: pxUi("plus", 24),
        onclick: () => saisir("Nouvel événement", [{ id: "n", etiquette: "Nom" }, { id: "d", etiquette: "Date", type: "date", defaut: jourVu }, { id: "t", etiquette: "Type", type: "choix", options: TYPES_EVENEMENT, defaut: "autre" }], v => { if (v.d) M.ajouterEvenement(v.n, v.d, v.t); }) })),
    h("div", { class: "cal__nav" },
      h("button", { class: "bouton bouton--icone cal__prec", "aria-label": "Mois précédent", html: pxUi("chev", 24), onclick: () => aller(-1) }),
      h("p", { class: "cal__mois" }, titreMois.charAt(0).toUpperCase() + titreMois.slice(1)),
      h("button", { class: "bouton bouton--icone cal__suiv", "aria-label": "Mois suivant", html: pxUi("chev", 24), onclick: () => aller(1) })),
    h("div", { class: "cal__grille" }, JOURS.map(j => h("span", { class: "cal__lettre" }, j)), cases),
    detail);
}

export function bilan(donnees) {
  const S = etat(), [, jours] = PERIODES[periode], b = calculer(S, jours);
  return h("div", { class: "bilan" },
    h("div", { class: "periodes", role: "tablist" }, Object.entries(PERIODES).map(([id, [n]]) => h("button", { class: "periode", role: "tab", "aria-selected": String(id === periode), onclick: () => { periode = id; document.dispatchEvent(new CustomEvent("moi:rubrique")); } }, n))),
    chapitre(S, b), calendrier(S),
    section("Cette " + { semaine: "semaine", mois: "période", annee: "année" }[periode] + " en vrai", "var(--c-orange)",
      h("div", { class: "envrai" }, envrai(S, b, jours).map(([v, l, c, ic]) => h("div", { class: "envrai__case", style: `--c:${c}` }, h("span", { class: "envrai__ic", html: pxRk(ic, 32) || "" }), h("b", {}, String(v)), h("span", {}, l))))),
    xpParJour(S, b, jours), assietteSemaine(S, b),
    humeurs(b), mange(b, jours), forts(b),
    h("details", { class: "suivis" }, h("summary", { class: "t-carte" }, "Données et sauvegarde"), donnees()));
}
