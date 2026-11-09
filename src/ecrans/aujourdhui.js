// Onglet Aujourd'hui : tout ce qui se fait dans la journée, dans cet ordre.
// Maquette « Focus+ » : haut cobalt (date, barre collante coffre + XP, question du moment, scène, 4 Angles), puis panneau crème
// (humeur et nuit, quêtes, idée, défi, roulette, repas en tuiles, routine, bilan du soir).
// Il se redessine quand l'état change ; les vues plein écran (assiette, routine) vivent à part.

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { dire } from "../ui/messages.js";
import { sortir } from "../ui/effets.js";
import { jouer } from "../core/sons.js";
import { on } from "../core/events.js";
import { etat } from "../core/state.js";
import { cleJour, heureJournee, niveau } from "../core/temps.js";
import { decor, momentCiel } from "./scene.js";
import { ouvrirAssiette } from "./assiette.js";
import { ouvrirRoutine, ouvrirReglageRoutine } from "./routine.js";
import { LES_ANGLES, faitAujourdhui } from "../regles/xp.js";
import { paliers } from "../regles/moi.js";
import { visageHumeur } from "../avatar/rendu.js";
import { crans, CRANS, coffresAOuvrir } from "../regles/coffre.js";
import { ouvrirCoffre } from "./coffre.js";
import { ouvrirActions } from "./actions.js";
import { REPAS, repasFait, repasSaute, noter } from "../regles/repas.js";
import { quetesDuJour, quetesSpeciales, quetesEvenement, faire, ecarter, rappeler } from "../regles/quetes.js";
import { MOMENTS, momentActuel, routineFaite } from "../regles/routine.js";
import { ouvrirPlein } from "../ui/plein.js";
import { tirer, tirageActuel, contacter } from "../regles/proches.js";
import { HUMEURS, humeur, sommeil, mot, noterHumeur, noterSommeil, bonneNuit, nuitFaite } from "../regles/nuit.js";

const COURT = { pdej: "Petit-déj" };
const HEURE_REPAS = { pdej: "8 h", dej: "12 h 30", gouter: "16 h", diner: "19 h" };


const titre = (texte, droite) => h("div", { class: "pt" }, h("h2", { class: "pt__titre" }, texte), droite ? h("span", { class: "pt__droite" }, droite) : null);

// ---- Haut : date et salut, puis la barre qui suit au défilement (coffre du jour + XP)
function entete() {
  const S = etat(), hr = heureJournee(S);
  const brut = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
  const date = brut.charAt(0).toUpperCase() + brut.slice(1);
  const salut = hr < 5 || hr >= 23 ? "Bonne nuit" : hr < 12 ? "Bon matin" : hr < 18 ? "Bon après-midi" : "Bonsoir";
  return h("div", { class: "ah__haut" }, h("p", { class: "ah__date" }, date), h("p", { class: "ah__salut" }, salut));
}

function barre() {
  const S = etat(), nv = niveau(S.xp || 0), n = crans(), SEG = 8, plein = Math.round(SEG * nv.cur / nv.need), aOuvrir = coffresAOuvrir(S);
  return h("div", { class: "barre" },
    h("div", { class: "coffre", role: aOuvrir ? "group" : "img", "aria-label": n >= CRANS ? "Coffre du jour gagné" : `Coffre du jour : ${n} cran${n > 1 ? "s" : ""} sur ${CRANS}` },
      aOuvrir ? h("button", { class: "coffre__icone coffre__icone--pret", "aria-label": `Ouvrir un coffre (${aOuvrir} à ouvrir)`, title: "Ouvrir un coffre", onclick: ouvrirCoffre },
        h("span", { html: pxRk("coffre", 32) || "" }), h("b", { class: "coffre__nb" }, String(aOuvrir)))
        : h("span", { class: "coffre__icone", html: pxRk("coffre", 32) || "" }),
      h("span", { class: "segs segs--coffre" }, Array.from({ length: CRANS }, (_, i) => h("i", { class: i < n ? "on" : "" })))),
    h("div", { class: "xp", role: "progressbar", "aria-valuenow": nv.cur, "aria-valuemax": nv.need, "aria-label": "Expérience" },
      h("span", { class: "xp__niv" }, "Niv " + nv.l),
      h("span", { class: "segs" }, Array.from({ length: SEG }, (_, i) => h("i", { class: i < plein ? "on" : "" })))),
    h("button", { class: "barre__plus", "aria-label": "Noter une action", title: "Noter une action", html: pxUi("plus", 24), onclick: ouvrirActions }));
}

// ---- La question du moment : une seule, selon l'heure
function ouvrirBilan() {
  const S = etat(), hu = humeur(S), sm = sommeil(S);
  const champHeure = (id, val, etiquette) => h("label", { class: "champ" }, h("span", { class: "t-info" }, etiquette),
    h("input", { type: "time", id, value: val == null ? "" : `${String(Math.floor(val)).padStart(2, "0")}:${String(Math.round((val % 1) * 60)).padStart(2, "0")}` }));
  const lire = id => { const v = document.getElementById(id).value; if (!v) return null; const [a, b] = v.split(":").map(Number); return a + b / 60; };
  const note = h("textarea", { class: "champ__texte", rows: "3", maxlength: "500", placeholder: "Un mot sur ta journée (facultatif)" }, mot(S));
  let choix = hu;
  const boutons = HUMEURS.map(([v, n]) => h("button", { class: "bouton visage", "aria-label": n, "aria-pressed": String(choix === v), html: visageHumeur(S, v, 40), onclick: () => {
    choix = v; boutons.forEach((b, i) => b.setAttribute("aria-pressed", String(HUMEURS[i][0] === v)));
  } }));
  const fin = ouvrirPlein("Bilan du soir", h("div", { class: "bilan-soir" },
    h("div", { class: "humeurs", role: "group", "aria-label": "Humeur" }, boutons),
    h("div", { class: "sommeil" }, champHeure("h-coucher", sm && sm.bed, "Couché à"), champHeure("h-lever", sm && sm.wake, "Levé à")),
    note,
    h("button", { class: "bouton bouton--principal", onclick: () => {
      const c = lire("h-coucher"), l = lire("h-lever");
      if (choix) noterHumeur(choix);
      if (c != null && l != null) noterSommeil(c, l);
      bonneNuit(note.value.trim());
      jouer("moment"); dire(nuitFaite() ? "Bonne nuit, c'est noté" : "Bonne nuit");
      fin.fermer();
    } }, nuitFaite() ? "Mettre à jour" : "Noter ma journée")));
}

const POINTE = '<svg viewBox="0 0 3 2" width="12" height="8" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M0 0h3v1h-3z M1 1h1v1h-1z"/></svg>';
const pointe = () => h("span", { class: "pointe", html: POINTE });

/** Boutons d'une quête : écarter (avec « Annuler ») et fait. Partagés par les cartes et le message du haut. */
function boutonsQuete(q) {
  return h("div", { class: "cq__actions" },
    h("button", { class: "cq__x", "aria-label": "Écarter cette quête", title: "Écarter", html: pxUi("close", 24),
      onclick: () => { ecarter(q.id); dire("Quête écartée", () => rappeler(q.id)); } }),
    h("button", { class: "cq__fait", "aria-label": "Fait", title: "Fait", html: pxUi("check", 24),
      onclick: e => sortir(e.currentTarget.closest(".cq, .bulle"), () => { if (faire(q)) { jouer("coin"); dire("Fait : " + q.nom); } }) }));
}

/** Petite bulle du personnage : une quête à la fois, qu'on peut écarter. */
function bulle(q) {
  return [h("div", { class: "bulle" },
    h("div", { class: "bulle__corps" },
      h("p", { class: "bulle__etiquette" }, q ? "Une chose à la fois" : "Tout est fait"),
      h("p", { class: "bulle__texte" }, q ? q.nom : "Profite de ta journée.")),
    q ? boutonsQuete(q) : null), pointe()];
}

function question() {
  const S = etat(), hr = heureJournee(S);
  const aFaire = id => !repasFait(id) && !repasSaute(id);
  let texte, bouton, action;
  if (hr >= 20.5 && !nuitFaite()) { texte = ["C'est la fin de journée.", "On fait le point ?"]; bouton = "Bilan du soir"; action = ouvrirBilan; }
  else if (hr >= 11.5 && hr < 16 && aFaire("dej")) { texte = ["Midi passé.", "Tu as mangé ?"]; bouton = "Remplir l'assiette"; action = () => ouvrirAssiette("dej"); }
  else if (hr >= 18 && hr < 23 && aFaire("diner")) { texte = ["C'est l'heure du dîner.", "Tu as mangé ?"]; bouton = "Remplir l'assiette"; action = () => ouvrirAssiette("diner"); }
  else if (hr < 11.5 && !routineFaite("matin")) { texte = ["Bon matin.", "Une routine pour démarrer ?"]; bouton = "Routine du matin"; action = () => ouvrirRoutine("matin"); }
  else return bulle(quetesDuJour().find(x => !faitAujourdhui(x.id)));
  return [h("div", { class: "question" },
    h("p", { class: "question__texte" }, texte[0], h("br"), texte[1]),
    h("button", { class: "bouton bouton--principal question__bouton", onclick: action }, bouton)), pointe()];
}

// ---- Scène : demi-sphère pixel, personnage, aura ; puis les 4 Angles
function hero() { return decor(etat()); }

function angles() {
  return h("div", { class: "angles" }, paliers().map(a => h("div", { class: "angle", style: `--ac:var(--angle-${a.id})` },
    h("div", { class: "angle__ligne" }, h("span", { class: "angle__ico", html: pxRk(a.icone, 24) || "" }),
      h("div", {}, h("div", { class: "angle__nom" }, a.nom), h("div", { class: "angle__val" }, String(a.palier)))),
    h("div", { class: "angle__barre", role: "progressbar", "aria-valuenow": a.cur, "aria-valuemax": a.need, "aria-label": a.nom }, h("i", { style: `--p:${Math.round(100 * a.cur / a.need)}%` })))));
}

// ---- Panneau crème
function humeurNuit() {
  const S = etat(), hu = humeur(S), sm = sommeil(S);
  const dur = sm && (sm.h != null ? sm.h : null);
  const txt = dur != null ? `${Math.floor(dur)} h ${String(Math.round((dur % 1) * 60)).padStart(2, "0")}` : "Ma nuit";
  return h("div", { class: "humnuit" },
    h("div", { class: "visages" + (hu ? " visages--choisi" : ""), role: "group", "aria-label": "Humeur" }, HUMEURS.map(([v, n]) =>
      h("button", { class: "visage", "aria-label": n, title: n, "aria-pressed": String(hu === v), html: visageHumeur(S, v, 40), onclick: () => { noterHumeur(v); jouer("blip"); } }))),
    h("button", { class: "nuitpuce", onclick: ouvrirBilan }, h("span", { html: pxRk("lune", 24) || "" }), txt));
}

function carteQuete(q) {
  const pts = q.xp <= 10 ? 1 : q.xp <= 20 ? 2 : 3;
  return h("div", { class: "cq" },
    h("span", { class: "cq__ico", html: pxRk(LES_ANGLES.find(a => a.id === (q.angle || "esprit"))?.icone || "etoile", 24) || "" }),
    h("div", { class: "cq__texte" }, h("p", { class: "cq__nom" }, q.nom), q.why ? h("p", { class: "cq__why" }, q.why) : null,
      h("span", { class: "segs segs--petit", "aria-label": `+${q.xp} XP` }, [0, 1, 2].map(i => h("i", { class: i < pts ? "on" : "" })))),
    boutonsQuete(q));
}

function ligneAction(icone, etiquette, texte, bouton, onclick, modifier) {
  return h("div", { class: "la" },
    h("span", { class: "la__ico", html: pxRk(icone, 24) || "" }),
    h("div", { class: "la__texte" }, h("p", { class: "la__etiquette" }, etiquette), h("p", { class: "la__nom" }, texte)),
    modifier ? h("button", { class: "bouton bouton--icone la__reglage", "aria-label": "Modifier", title: "Modifier", html: pxUi("edit", 24), onclick: modifier }) : null,
    h("button", { class: "la__bouton", onclick }, bouton));
}

function quetes() {
  // Les préparatifs d'un événement passent en premier ; au total 3 quêtes, pas une de plus : le compteur dit vrai.
  const liste = [...quetesEvenement(), ...quetesDuJour()].slice(0, 3);
  const faites = liste.filter(q => faitAujourdhui(q.id)).length;
  const [idee, defi] = quetesSpeciales();
  const fairePuis = q => e => sortir(e.currentTarget.closest(".la"), () => { if (faire(q)) { jouer("coin"); dire("Fait : " + q.nom); } });
  return [
    titre("Quêtes du jour", `${faites}/${liste.length}`),
    liste.length && faites === liste.length ? h("p", { class: "vide" }, "Tout est fait. Bravo !") : liste.filter(q => !faitAujourdhui(q.id)).map(carteQuete),
    idee && !faitAujourdhui(idee.id) ? ligneAction("ampoule", "IDÉE DU MOMENT", idee.nom, "Go", fairePuis(idee)) : null,
    defi && !faitAujourdhui(defi.id) ? ligneAction("eclair", "DÉFI", defi.nom, "Fait", fairePuis(defi)) : null,
  ];
}

function roulette() {
  const n = tirageActuel();
  if (n && faitAujourdhui("rel:news:" + n)) return null;
  if (n) return ligneAction("coeur", "ROULETTE DES PROCHES", `Prends des nouvelles de ${n}`, "Nouvelles",
    e => sortir(e.currentTarget.closest(".la"), () => { contacter(n, "news"); jouer("coin"); dire(`Nouvelles de ${n} · lien +`); }));
  return ligneAction("coeur", "ROULETTE DES PROCHES", "Qui prendre des nouvelles ?", "Tourner", () => {
    const c = tirer(); if (!c) dire("Ajoute d'abord des proches"); else jouer("blip");
  });
}

function repas() {
  const S = etat(), hr = heureJournee(S);
  const faits = REPAS.filter(r => repasFait(r.id)).length;
  const plt = (S.g.plt || {})[cleJour(S)] || {};
  const groupes = new Set(); for (const k of ["dej", "diner"]) { const a = plt[k]; if (a) { if ((a.f || []).length) groupes.add("f"); if ((a.p || []).length) groupes.add("p"); if ((a.l || []).length) groupes.add("l"); } }
  const enCours = REPAS.find(r => !repasFait(r.id) && !repasSaute(r.id) && ((r.id === "pdej" && hr < 11) || (r.id === "dej" && hr >= 11 && hr < 16) || (r.id === "gouter" && hr >= 15 && hr < 18.5) || (r.id === "diner" && hr >= 18)));
  const tuile = r => {
    const fait = repasFait(r.id), saute = repasSaute(r.id), cours = enCours && enCours.id === r.id, assiette = r.id === "dej" || r.id === "diner";
    const ouvre = () => assiette ? ouvrirAssiette(r.id) : (noter(r.id) && (jouer("coin"), dire(`${r.nom} noté`)));
    const icone = h("span", { class: "tuile__ico", html: pxRk(r.icone, cours ? 32 : 24) || pxRk("assiette", cours ? 32 : 24) || "" });
    if (cours) return h("div", { class: "tuile tuile--cours" },
      h("div", { class: "tuile__haut" }, h("div", {}, h("p", { class: "tuile__titre" }, r.nom), h("p", { class: "tuile__etat" }, "À noter")), icone),
      h("button", { class: "tuile__bouton", onclick: ouvre }, assiette ? "Assiette" : "Noter"));
    return h("button", { class: "tuile" + (fait ? " tuile--pris" : ""), "aria-label": r.nom, onclick: () => { if (!fait && !saute) ouvre(); } },
      icone, h("span", { class: "tuile__nom" }, COURT[r.id] || r.nom), h("span", { class: "tuile__etat" }, fait ? "✓" : saute ? "sauté" : (HEURE_REPAS[r.id] || "")));
  };
  return [
    titre("Mes repas", h("span", { class: "pastille" }, `${faits} repas · ${groupes.size} groupe${groupes.size > 1 ? "s" : ""} sur 3`)),
    h("div", { class: "tuiles" }, REPAS.map(tuile)),
  ];
}

function rituels() {
  const S = etat(), hr = heureJournee(S);
  const visible = id => !routineFaite(id) && (id === "matin" ? hr < 12 : hr >= 19);
  return [
    ...MOMENTS.filter(m => visible(m.id)).map(m => ligneAction(m.icone, "ROUTINE", m.nom, "Lancer", () => ouvrirRoutine(m.id), () => ouvrirReglageRoutine(m.id))),
    hr >= 20.5 && !nuitFaite() ? ligneAction("lune", "BILAN DU SOIR", "Humeur, nuit, ta journée", "Ouvrir", ouvrirBilan) : null,
  ];
}

/** Journal du jour : ce qui a été validé aujourd'hui, le plus récent en haut. */
function journalDuJour() {
  const S = etat(), j = cleJour(S);
  const L = S.log.filter(l => cleJour(S, l.t) === j && l.xp > 0).reverse();
  const heure = t => new Date(t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).replace(":", " h ");
  return [titre("Journal", L.length ? `${L.reduce((s, l) => s + l.xp, 0)} XP` : null),
    L.length ? h("ul", { class: "journal" }, L.map(l => h("li", { class: "journal__ligne" },
      h("span", { class: "journal__heure" }, heure(l.t)), h("span", { class: "journal__nom" }, l.name || l.a), h("b", { class: "journal__xp" }, "+" + l.xp))))
      : h("p", { class: "vide" }, "Rien noté pour l'instant.")];
}

export function monterAujourdhui(racine) {
  const dessiner = () => {
    const y = scrollY;
    racine.replaceChildren(h("div", { class: "aujourdhui", "data-moment": momentCiel(etat()) },
      entete(), barre(),
      h("div", { class: "ah" }, ...question(), hero(), angles()),
      h("div", { class: "panneau" }, h("span", { class: "panneau__poignee" }), ...repas(), humeurNuit(), ...quetes(), roulette(), ...rituels(), ...journalDuJour())));
    scrollTo(0, y);
  };
  let attente = 0;
  on("etat:modifie", () => { cancelAnimationFrame(attente); attente = requestAnimationFrame(dessiner); });
  dessiner();
}
