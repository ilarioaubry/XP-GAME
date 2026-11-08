// Onglet Aujourd'hui : tout ce qui se fait dans la journée, dans cet ordre.
// Maquette « Focus+ » : haut cobalt (date, niveau, coffre, question du moment, scène, 4 Angles), puis panneau crème
// (humeur et nuit, quêtes, idée, défi, roulette, repas en tuiles, routine, bilan du soir, habitudes, suivis repliés).
// Il se redessine quand l'état change ; les vues plein écran (assiette, routine) vivent à part.

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { on } from "../core/events.js";
import { etat, modifier } from "../core/state.js";
import { cleJour, heureJournee, niveau } from "../core/temps.js";
import { decor } from "./scene.js";
import { ouvrirAssiette } from "./assiette.js";
import { ouvrirRoutine } from "./routine.js";
import { LES_ANGLES, xpDuJour, faitAujourdhui } from "../regles/xp.js";
import { crans, CRANS } from "../regles/coffre.js";
import { REPAS, repasFait, repasSaute, noter } from "../regles/repas.js";
import { quetesDuJour, quetesSpeciales, quetesEvenement, evenementProche, faire, ecarter, rappeler, habitudes, faireHabitude } from "../regles/quetes.js";
import { MOMENTS, momentActuel, routineFaite } from "../regles/routine.js";
import { ouvrirPlein } from "../ui/plein.js";
import { tirer, tirageActuel, contacter } from "../regles/proches.js";
import { HUMEURS, humeur, sommeil, mot, noterHumeur, noterSommeil, bonneNuit, nuitFaite } from "../regles/nuit.js";

const OBJECTIF_ANGLE = 30; // XP du jour pour remplir la barre d'un angle : un repère, pas une obligation
let suivisOuverts = false;
const HEURE_REPAS = { pdej: "8 h", dej: "12 h 30", gouter: "16 h", diner: "19 h" };


const titre = (texte, droite) => h("div", { class: "pt" }, h("h2", { class: "pt__titre" }, texte), droite ? h("span", { class: "pt__droite" }, droite) : null);

// ---- Haut : date, niveau, coffre
function entete() {
  const S = etat(), nv = niveau(S.xp || 0), hr = heureJournee(S) % 24;
  const brut = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
  const date = brut.charAt(0).toUpperCase() + brut.slice(1);
  const salut = hr < 5 ? "Bonne nuit" : hr < 12 ? "Bon matin" : hr < 18 ? "Bon après-midi" : "Bonsoir";
  const SEG = 8, plein = Math.round(SEG * nv.cur / nv.need);
  return h("div", { class: "ah__haut" },
    h("div", {}, h("p", { class: "ah__date" }, date), h("p", { class: "ah__salut" }, salut)),
    h("div", { class: "ah__niv", role: "progressbar", "aria-valuenow": nv.cur, "aria-valuemax": nv.need, "aria-label": "Expérience" },
      h("span", { class: "ah__nivtxt" }, "Niv " + nv.l),
      h("span", { class: "segs" }, Array.from({ length: SEG }, (_, i) => h("i", { class: i < plein ? "on" : "" })))));
}

function coffre() {
  const n = crans();
  return h("div", { class: "coffre", role: "img", "aria-label": `Coffre du jour : ${n} cran${n > 1 ? "s" : ""} sur ${CRANS}` },
    h("span", { class: "coffre__icone", html: pxRk("coffre", 32) || "" }),
    h("span", { class: "segs segs--coffre" }, Array.from({ length: CRANS }, (_, i) => h("i", { class: i < n ? "on" : "" }))),
    h("span", { class: "coffre__txt" }, n >= CRANS ? "Coffre gagné" : `${n} / ${CRANS}`));
}

// ---- La question du moment : une seule, selon l'heure
function ouvrirBilan() {
  const S = etat(), hu = humeur(S), sm = sommeil(S);
  const champHeure = (id, val, etiquette) => h("label", { class: "champ" }, h("span", { class: "t-info" }, etiquette),
    h("input", { type: "time", id, value: val == null ? "" : `${String(Math.floor(val)).padStart(2, "0")}:${String(Math.round((val % 1) * 60)).padStart(2, "0")}` }));
  const lire = id => { const v = document.getElementById(id).value; if (!v) return null; const [a, b] = v.split(":").map(Number); return a + b / 60; };
  const note = h("textarea", { class: "champ__texte", rows: "3", maxlength: "500", placeholder: "Un mot sur ta journée (facultatif)" }, mot(S));
  let choix = hu;
  const boutons = HUMEURS.map(([v, n]) => h("button", { class: "bouton", "aria-pressed": String(choix === v), onclick: () => {
    choix = v; boutons.forEach((b, i) => b.setAttribute("aria-pressed", String(HUMEURS[i][0] === v)));
  } }, n));
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

function question() {
  const S = etat(), hr = heureJournee(S) % 24;
  const aFaire = id => !repasFait(id) && !repasSaute(id);
  let texte, bouton, action;
  if (hr >= 21 && !nuitFaite()) { texte = ["C'est la fin de journée.", "On fait le point ?"]; bouton = "Bilan du soir"; action = ouvrirBilan; }
  else if (hr >= 11.5 && hr < 16 && aFaire("dej")) { texte = ["Midi passé.", "Tu as mangé ?"]; bouton = "Remplir l'assiette"; action = () => ouvrirAssiette("dej"); }
  else if (hr >= 18 && hr < 23 && aFaire("diner")) { texte = ["C'est l'heure du dîner.", "Tu as mangé ?"]; bouton = "Remplir l'assiette"; action = () => ouvrirAssiette("diner"); }
  else if (hr < 11.5 && !routineFaite("matin")) { texte = ["Bon matin.", "Une routine pour démarrer ?"]; bouton = "Routine du matin"; action = () => ouvrirRoutine("matin"); }
  else {
    const q = quetesDuJour().find(x => !faitAujourdhui(x.id));
    if (q) { texte = ["Une chose à la fois.", q.nom]; bouton = "Fait"; action = () => { if (faire(q)) { jouer("coin"); dire(`+${q.xp} XP`); } }; }
    else texte = ["Tout est fait.", "Profite de ta journée."];
  }
  return h("div", { class: "question" },
    h("p", { class: "question__texte" }, texte[0], h("br"), texte[1]),
    bouton ? h("button", { class: "bouton bouton--principal question__bouton", onclick: action }, bouton) : null);
}

// ---- Scène : demi-sphère pixel, personnage, aura ; puis les 4 Angles
function hero() { return decor(etat()); }

function angles() {
  const { parAngle } = xpDuJour();
  return h("div", { class: "angles" }, LES_ANGLES.map(a => h("div", { class: "angle", style: `--ac:var(--angle-${a.id})` },
    h("div", { class: "angle__ligne" }, h("span", { class: "angle__ico", html: pxRk(a.icone, 24) || "" }),
      h("div", {}, h("div", { class: "angle__nom" }, a.nom), h("div", { class: "angle__val" }, String(parAngle[a.id])))),
    h("div", { class: "angle__barre" }, h("i", { style: `--p:${Math.min(100, Math.round(100 * parAngle[a.id] / OBJECTIF_ANGLE))}%` })))));
}

// ---- Panneau crème
const VISAGES = {
  1: "M1 1h1v1h-1z M5 1h1v1h-1z M1 4h4v1h-4z M0 5h1v1h-1z M5 5h1v1h-1z",
  2: "M1 1h1v1h-1z M5 1h1v1h-1z M1 4h4v1h-4z",
  3: "M1 1h1v1h-1z M5 1h1v1h-1z M1 4h4v1h-4z",
  4: "M1 1h1v1h-1z M5 1h1v1h-1z M0 3h1v1h-1z M1 4h4v1h-4z M5 3h1v1h-1z",
  5: "M1 1h1v1h-1z M5 1h1v1h-1z M0 3h6v1h-6z M1 4h4v1h-4z",
};
const visage = v => `<svg viewBox="-1 -1 8 8" shape-rendering="crispEdges" aria-hidden="true"><path class="vis-t" d="M1 0h4v1h-4z M0 1h6v4h-6z M1 5h4v1h-4z"/><path class="vis-y" d="${VISAGES[v]}"/></svg>`;

function humeurNuit() {
  const S = etat(), hu = humeur(S), sm = sommeil(S);
  const dur = sm && (sm.h != null ? sm.h : null);
  const txt = dur != null ? `${Math.floor(dur)} h ${String(Math.round((dur % 1) * 60)).padStart(2, "0")}` : "Ma nuit";
  return h("div", { class: "humnuit" },
    h("div", { class: "visages", role: "group", "aria-label": "Humeur" }, HUMEURS.map(([v, n]) =>
      h("button", { class: "visage", "aria-label": n, "aria-pressed": String(hu === v), html: visage(v), onclick: () => { noterHumeur(v); jouer("blip"); } }))),
    h("button", { class: "nuitpuce", onclick: ouvrirBilan }, h("span", { html: pxRk("lune", 24) || "" }), txt));
}

function carteQuete(q) {
  const fait = faitAujourdhui(q.id), pts = q.xp <= 10 ? 1 : q.xp <= 20 ? 2 : 3;
  return h("div", { class: "cq" + (fait ? " cq--faite" : "") },
    h("span", { class: "cq__ico", html: pxRk(LES_ANGLES.find(a => a.id === (q.angle || "esprit"))?.icone || "etoile", 24) || "" }),
    h("div", { class: "cq__texte" }, h("p", { class: "cq__nom" }, q.nom), q.why ? h("p", { class: "cq__why" }, q.why) : null,
      h("span", { class: "segs segs--petit", "aria-label": `+${q.xp} XP` }, [0, 1, 2].map(i => h("i", { class: i < pts ? "on" : "" })))),
    fait ? h("span", { class: "cq__ok" }, "✓") : h("div", { class: "cq__actions" },
      h("button", { class: "cq__x", "aria-label": "Écarter cette quête", html: pxUi("close", 24),
        onclick: () => { ecarter(q.id); dire("Quête écartée", () => rappeler(q.id)); } }),
      h("button", { class: "cq__fait", "aria-label": "Fait", html: pxUi("check", 24),
        onclick: () => { if (faire(q)) { jouer("coin"); dire(`+${q.xp} XP`); } } })));
}

function ligneAction(icone, etiquette, texte, bouton, onclick, fait) {
  return h("div", { class: "la" + (fait ? " la--faite" : "") },
    h("span", { class: "la__ico", html: pxRk(icone, 24) || "" }),
    h("div", { class: "la__texte" }, h("p", { class: "la__etiquette" }, etiquette), h("p", { class: "la__nom" }, texte)),
    fait ? h("span", { class: "cq__ok" }, "✓") : h("button", { class: "la__bouton", onclick }, bouton));
}

function quetes() {
  const jour = quetesDuJour(), spec = quetesSpeciales(), ev = evenementProche();
  const faites = jour.filter(q => faitAujourdhui(q.id)).length;
  const [idee, defi] = spec, evq = quetesEvenement();
  const fairePuis = q => () => { if (faire(q)) { jouer("coin"); dire(`+${q.xp} XP`); } };
  return [
    titre("Quêtes du jour", `${faites}/${jour.length}`),
    jour.length ? jour.map(carteQuete) : h("p", { class: "vide" }, "Rien à faire pour l'instant."),
    ...evq.map(q => ligneAction("calendrier", q.why.toUpperCase(), q.nom, "Fait", fairePuis(q), faitAujourdhui(q.id))),
    ev && !evq.length ? ligneAction("calendrier", "À VENIR", `${ev.n || ev.name || "Événement"} · ${ev.d === cleJour(etat()) ? "aujourd'hui" : ev.d}`, "", null, true) : null,
    idee ? ligneAction("ampoule", "IDÉE DU MOMENT", idee.nom, "Go", fairePuis(idee), faitAujourdhui(idee.id)) : null,
    defi ? ligneAction("eclair", "DÉFI", defi.nom, "Fait", fairePuis(defi), faitAujourdhui(defi.id)) : null,
  ];
}

function roulette() {
  const n = tirageActuel();
  if (n) return ligneAction("coeur", "ROULETTE DES PROCHES", `Prends des nouvelles de ${n}`, "Nouvelles",
    () => { contacter(n, "news"); jouer("coin"); dire(`Nouvelles de ${n} · lien +`); }, faitAujourdhui("rel:news:" + n));
  return ligneAction("coeur", "ROULETTE DES PROCHES", "Qui prendre des nouvelles ?", "Tourner", () => {
    const c = tirer(); if (!c) dire("Ajoute d'abord des proches"); else jouer("blip");
  });
}

function repas() {
  const S = etat(), hr = heureJournee(S) % 24;
  const faits = REPAS.filter(r => repasFait(r.id)).length;
  const plt = (S.g.plt || {})[cleJour(S)] || {};
  const groupes = new Set(); for (const k of ["dej", "diner"]) { const a = plt[k]; if (a) { if ((a.f || []).length) groupes.add("f"); if ((a.p || []).length) groupes.add("p"); if ((a.l || []).length) groupes.add("l"); } }
  const enCours = REPAS.find(r => !repasFait(r.id) && !repasSaute(r.id) && ((r.id === "pdej" && hr < 11) || (r.id === "dej" && hr >= 11 && hr < 16) || (r.id === "gouter" && hr >= 15 && hr < 18.5) || (r.id === "diner" && hr >= 18)));
  const tuile = r => {
    const fait = repasFait(r.id), saute = repasSaute(r.id), cours = enCours && enCours.id === r.id;
    const ouvre = () => (r.id === "dej" || r.id === "diner") ? ouvrirAssiette(r.id) : (noter(r.id) && (jouer("coin"), dire(`${r.nom} noté`)));
    return h("div", { class: "tuile" + (fait ? " tuile--pris" : cours ? " tuile--cours" : "") },
      h("button", { class: "tuile__corps", onclick: () => { if (!fait && !saute) ouvre(); }, "aria-label": r.nom },
        h("span", { html: pxRk(r.icone, 24) || pxRk("assiette", 24) || "" }),
        h("span", { class: "tuile__nom" }, r.nom),
        h("span", { class: "tuile__etat" }, fait ? "✓" : saute ? "sauté" : cours ? "À noter" : (HEURE_REPAS[r.id] || ""))),
      cours && (r.id === "dej" || r.id === "diner") ? h("button", { class: "tuile__assiette", onclick: ouvre }, "Assiette") : null);
  };
  return [
    titre("Mes repas", h("span", { class: "pastille" }, `${faits} repas · ${groupes.size} groupe${groupes.size > 1 ? "s" : ""} sur 3`)),
    h("div", { class: "tuiles" }, REPAS.map(tuile)),
  ];
}

function rituels() {
  const S = etat(), premier = momentActuel(S), ordre = [premier, premier === "matin" ? "soir" : "matin"];
  const libelle = id => (routineFaite(id) ? "Faite" : id === "soir" ? "Dès 19 h" : "Le matin");
  return [
    ...ordre.map(id => { const m = MOMENTS.find(x => x.id === id); return ligneAction(m.icone, "ROUTINE", `${m.nom} · ${libelle(id)}`, "Lancer", () => ouvrirRoutine(id), routineFaite(id)); }),
    ligneAction("lune", "BILAN DU SOIR", "Humeur, nuit, ta journée · dès 21 h", nuitFaite() ? "Modifier" : "Ouvrir", ouvrirBilan),
  ];
}

function habitudesBloc() {
  return [titre("Habitudes"),
    h("div", { class: "habitudes" }, habitudes().map(hb => {
      const fait = faitAujourdhui("hab:" + hb.id);
      return h("button", { class: "hab", "aria-pressed": String(fait), disabled: fait, onclick: () => { if (faireHabitude(hb)) { jouer("blip"); dire(`${hb.n} · +${hb.xp} XP`); } } },
        hb.n, h("span", { class: "hab__xp" }, fait ? "✓" : "+" + hb.xp));
    }))];
}

function suivis() {
  const S = etat(), j = cleJour(S);
  const cafes = (S.g.cafe || {})[j] || 0;
  const d = h("details", { class: "suivis", open: suivisOuverts || null },
    h("summary", {}, "Mes suivis / Limites"),
    h("div", { class: "suivis__corps" },
      h("div", { class: "suivis__ligne" }, h("span", {}, `Cafés aujourd'hui : ${cafes}`),
        h("button", { class: "hab", onclick: () => modifier("cafe", s => { (s.g.cafe ||= {})[j] = (s.g.cafe[j] || 0) + 1; }) }, "+1")),
      h("p", { class: "suivis__info" }, "Les autres suivis (cigarettes, limites) se règlent dans Moi.")));
  d.addEventListener("toggle", () => { suivisOuverts = d.open; });
  return d;
}

export function monterAujourdhui(racine) {
  const dessiner = () => {
    const y = scrollY;
    racine.replaceChildren(h("div", { class: "aujourdhui" },
      h("div", { class: "ah" }, entete(), coffre(), question(), hero(), angles()),
      h("div", { class: "panneau" }, h("span", { class: "panneau__poignee" }), humeurNuit(), ...quetes(), roulette(), ...repas(), ...rituels(), ...habitudesBloc(), suivis())));
    scrollTo(0, y);
  };
  let attente = 0;
  on("etat:modifie", () => { cancelAnimationFrame(attente); attente = requestAnimationFrame(dessiner); });
  dessiner();
}
