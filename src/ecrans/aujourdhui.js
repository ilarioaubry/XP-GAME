// Onglet Aujourd'hui : tout ce qui se fait dans la journée, dans cet ordre.
// Scène · coffre (5 crans) · 4 Angles · repas · routine · habitudes · quêtes · bonne nuit · suivis repliés.
// Il se redessine quand l'état change ; les vues plein écran (assiette, routine) vivent à part.

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { on } from "../core/events.js";
import { etat, modifier } from "../core/state.js";
import { cleJour, heureJournee } from "../core/temps.js";
import { scene } from "./scene.js";
import { ouvrirAssiette } from "./assiette.js";
import { ouvrirRoutine } from "./routine.js";
import { LES_ANGLES, xpDuJour, faitAujourdhui } from "../regles/xp.js";
import { crans, CRANS } from "../regles/coffre.js";
import { REPAS, repasFait, repasSaute, noter } from "../regles/repas.js";
import { quetesDuJour, quetesSpeciales, evenementProche, faire, ecarter, rappeler, habitudes, faireHabitude } from "../regles/quetes.js";
import { MOMENTS, momentActuel, routineFaite } from "../regles/routine.js";
import { HUMEURS, humeur, sommeil, mot, noterHumeur, noterSommeil, bonneNuit, nuitFaite } from "../regles/nuit.js";

const OBJECTIF_ANGLE = 30; // XP du jour pour remplir la barre d'un angle : un repère, pas une obligation
let suivisOuverts = false;

const section = (titre, couleur, ...contenu) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null },
  h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre)), contenu);

function coffre() {
  const n = crans();
  return h("div", { class: "coffre", role: "img", "aria-label": `Coffre du jour : ${n} cran${n > 1 ? "s" : ""} sur ${CRANS}` },
    h("span", { class: "coffre__icone", html: pxRk("coffre", 32) || "" }),
    h("div", { class: "coffre__crans" }, Array.from({ length: CRANS }, (_, i) => h("i", { class: i < n ? "rempli" : "" }))),
    h("span", { class: "t-info" }, n >= CRANS ? "Coffre gagné" : `${n} / ${CRANS}`));
}

function angles() {
  const { parAngle } = xpDuJour();
  return h("div", { class: "angles" }, LES_ANGLES.map(a => h("div", { class: "angle", style: `--ac:${a.couleur}` },
    h("span", { class: "angle__nom t-info", html: pxRk(a.icone, 16) || "" }, a.nom),
    h("div", { class: "ui-barre" }, h("i", { style: `--p:${Math.min(100, Math.round(100 * parAngle[a.id] / OBJECTIF_ANGLE))}%` })),
    h("span", { class: "t-info" }, `${parAngle[a.id]} XP`))));
}

function repas() {
  return section("Repas", "var(--angle-corps)",
    h("button", { class: "bouton bouton--principal assiette-hub", onclick: () => ouvrirAssiette(heureJournee(etat()) < 16 ? "dej" : "diner") },
      h("span", { html: pxRk("assiette", 32) || "" }), "Mon assiette"),
    h("div", { class: "pastilles" }, REPAS.map(r => {
      const fait = repasFait(r.id), saute = repasSaute(r.id);
      return h("button", { class: "bouton", "aria-pressed": String(fait), onclick: () => {
        if (fait || saute) return;
        if (r.id === "dej" || r.id === "diner") return ouvrirAssiette(r.id);
        if (noter(r.id)) { jouer("coin"); dire(`${r.nom} noté`); }
      } }, h("span", { html: pxRk(r.icone, 16) || "" }), r.nom, fait ? " ✓" : saute ? " (sauté)" : "");
    })));
}

function routine() {
  const S = etat();
  const premier = momentActuel(S);
  const ordre = [premier, premier === "matin" ? "soir" : "matin"];
  return section("Routine", "var(--angle-esprit)",
    h("div", { class: "routines" }, ordre.map((id, k) => {
      const m = MOMENTS.find(x => x.id === id), fait = routineFaite(id);
      return h("button", { class: "bouton" + (k === 0 && !fait ? " bouton--principal" : ""), onclick: () => ouvrirRoutine(id) },
        h("span", { html: pxRk(m.icone, 16) || "" }), m.nom, fait ? " ✓" : "");
    })));
}

function habitudesBloc() {
  return section("Habitudes", "var(--angle-corps)",
    h("div", { class: "habitudes" }, habitudes().map(hb => {
      const fait = faitAujourdhui("hab:" + hb.id);
      return h("button", { class: "bouton", "aria-pressed": String(fait), disabled: fait, onclick: () => { if (faireHabitude(hb)) { jouer("blip"); dire(`${hb.n} · +${hb.xp} XP`); } } },
        hb.n, h("span", { class: "ui-compteur" }, fait ? "✓" : "+" + hb.xp));
    })));
}

function carteQuete(q) {
  const fait = faitAujourdhui(q.id);
  return h("div", { class: "quete ui-carte" + (fait ? " quete--faite" : "") },
    h("div", { class: "quete__texte" }, h("p", { class: "ui-carte__titre" }, q.nom), h("p", { class: "ui-carte__texte" }, `+${q.xp} XP`)),
    fait ? h("span", { class: "ui-compteur" }, "✓") : h("div", { class: "quete__actions" },
      h("button", { class: "bouton bouton--icone", "aria-label": "Écarter cette quête", html: pxUi("close", 24),
        onclick: () => { ecarter(q.id); dire("Quête écartée", () => rappeler(q.id)); } }),
      h("button", { class: "bouton bouton--principal bouton--icone", "aria-label": "Fait", html: pxUi("check", 24),
        onclick: () => { if (faire(q)) { jouer("coin"); dire(`+${q.xp} XP`); } } })));
}

function quetes() {
  const jour = quetesDuJour(), spec = quetesSpeciales(), ev = evenementProche();
  return [
    section("Quêtes du jour", "var(--angle-liens)", jour.length ? jour.map(carteQuete) : h("p", { class: "vide" }, "Rien à faire pour l'instant.")),
    section("Quêtes spéciales", "var(--angle-foyer)",
      ev ? h("div", { class: "ui-carte evenement" }, h("p", { class: "ui-carte__titre" }, ev.n || ev.name || "Événement"), h("p", { class: "ui-carte__texte" }, ev.d === cleJour(etat()) ? "Aujourd'hui" : ev.d)) : null,
      spec.length ? spec.map(carteQuete) : h("p", { class: "vide" }, "Pas de quête spéciale aujourd'hui.")),
  ];
}

function nuit() {
  const S = etat(), hu = humeur(S), sm = sommeil(S);
  const champHeure = (id, val, etiquette) => h("label", { class: "champ" }, h("span", { class: "t-info" }, etiquette),
    h("input", { type: "time", id, value: val == null ? "" : `${String(Math.floor(val)).padStart(2, "0")}:${String(Math.round((val % 1) * 60)).padStart(2, "0")}` }));
  const lire = id => { const v = document.getElementById(id).value; if (!v) return null; const [a, b] = v.split(":").map(Number); return a + b / 60; };
  const note = h("textarea", { class: "champ__texte", rows: "2", maxlength: "500", placeholder: "Un mot sur ta journée (facultatif)" }, mot(S));
  return section("Bonne nuit", "var(--angle-esprit)",
    h("div", { class: "humeurs", role: "group", "aria-label": "Humeur" }, HUMEURS.map(([v, n]) =>
      h("button", { class: "bouton", "aria-pressed": String(hu === v), onclick: () => { noterHumeur(v); jouer("blip"); } }, n))),
    h("div", { class: "sommeil" }, champHeure("h-coucher", sm && sm.bed, "Couché à"), champHeure("h-lever", sm && sm.wake, "Levé à")),
    note,
    h("button", { class: "bouton bouton--principal", onclick: () => {
      const c = lire("h-coucher"), l = lire("h-lever");
      if (c != null && l != null) noterSommeil(c, l);
      bonneNuit(note.value.trim());
      jouer("moment"); dire(nuitFaite() ? "Bonne nuit, c'est noté" : "Bonne nuit");
    } }, nuitFaite() ? "Mettre à jour" : "Noter ma journée"));
}

function suivis() {
  const S = etat(), j = cleJour(S);
  const cafes = (S.g.cafe || {})[j] || 0;
  const d = h("details", { class: "suivis", open: suivisOuverts || null },
    h("summary", { class: "t-carte" }, "Mes suivis / Limites"),
    h("div", { class: "suivis__corps" },
      h("div", { class: "ui-ligne" }, h("span", {}, `Cafés aujourd'hui : ${cafes}`),
        h("button", { class: "bouton", onclick: () => modifier("cafe", s => { (s.g.cafe ||= {})[j] = (s.g.cafe[j] || 0) + 1; }) }, "+1")),
      h("p", { class: "t-info" }, "Les autres suivis (cigarettes, limites) se règlent dans Moi, à la brique 3.")));
  d.addEventListener("toggle", () => { suivisOuverts = d.open; });
  return d;
}

export function monterAujourdhui(racine) {
  const dessiner = () => {
    const y = scrollY;
    racine.replaceChildren(h("div", { class: "page aujourdhui" },
      scene(), coffre(), angles(), repas(), routine(), habitudesBloc(), ...quetes(), nuit(), suivis()));
    scrollTo(0, y);
  };
  let attente = 0;
  on("etat:modifie", () => { cancelAnimationFrame(attente); attente = requestAnimationFrame(dessiner); });
  dessiner();
}
