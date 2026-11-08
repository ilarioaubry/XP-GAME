// Moi > Chez moi : Auras, Fonds, Titres, Badges, Panoplies d'abord ; puis garde-robe et pièces.
// Règle des collections : on montre ce qui est obtenu, puis UNE tuile « +N » pour le reste (jamais la liste du verrouillé).

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { jouer } from "../core/sons.js";
import { etat } from "../core/state.js";
import { HM_ROOMS } from "../donnees/brut/chez-moi.js";
import { WR_CATS } from "../donnees/brut/icones-unifiees.js";
import * as M from "../regles/moi.js";

const RUBRIQUES = [["aura", "Auras"], ["fond", "Fonds"], ["titre", "Titres"], ["badges", "Badges"], ["set", "Panoplies"],
  ["tete", "Coiffes"], ["haut", "Tenues"], ["yeux", "Lunettes"], ["bijou", "Bijoux"], ["main", "Objets"], ["pieces", "Pièces"]];
let courante = "aura";

const etoiles = r => h("span", { class: "etoiles", "aria-label": `Rareté ${r + 1} sur 4`, html: pxUi("star", 12).repeat(r + 1) });
const plus = n => n > 0 ? h("div", { class: "ui-tuile ui-tuile--plus", "aria-label": `Encore ${n} à trouver` }, h("span", { class: "t-carte" }, "+" + n)) : null;
const tuile = (contenu, nom, actif, fn, extra) => h("button", { class: "ui-tuile", "aria-pressed": String(!!actif), onclick: fn }, contenu, h("span", { class: "t-info" }, nom), extra);

function objets(slot, S) {
  const liste = M.objetsDe(slot, S), a = liste.filter(o => o.a), eq = M.equipe(slot, S);
  const apercu = o => o.svg ? h("span", { class: "tuile__apercu", html: `<svg viewBox="0 0 120 140" width="48" height="56" aria-hidden="true">${o.svg}</svg>` }) : h("span", { html: pxRk("etoile", 48) || "" });
  return h("div", { class: "ui-tuiles" }, a.length ? a.map(o => tuile(apercu(o), o.n, eq === o.id, () => { M.equiper(slot, o.id); jouer("blip"); }, etoiles(o.r || 0))) : null, plus(liste.length - a.length),
    a.length ? null : h("p", { class: "vide" }, "Rien d'obtenu ici pour l'instant."));
}

function titresVue(S) {
  const t = M.titres(S), porte = M.titrePorte(S);
  return h("div", { class: "ui-tuiles" }, t.obtenus.map(x => tuile(h("span", { html: pxUi("star", 24) }), x.n, porte === x.n, () => { M.porterTitre(x.n); jouer("blip"); })), plus(t.total - t.obtenus.length));
}

function badgesVue(S) {
  const liste = M.badges(S), a = liste.filter(b => b.a);
  return h("div", { class: "ui-tuiles" }, a.map(b => h("div", { class: "ui-tuile", title: b.desc },
    h("span", { html: pxUi(b.ic, 24) || pxRk(b.ic, 48) || pxUi("star", 24) }), h("span", { class: "t-info" }, b.name), etoiles(Math.max(0, (b.t || 1) - 1)))),
    plus(liste.length - a.length), a.length ? null : h("p", { class: "vide" }, "Aucun badge pour l'instant."));
}

function panopliesVue(S) {
  const p = M.panoplies(S), a = p.filter(x => x.n > 0);
  return h("div", { class: "ui-tuiles" }, a.map(x => h("div", { class: "ui-tuile", "aria-pressed": String(x.complet) },
    h("span", { class: "t-carte" }, x.nom), h("span", { class: "ui-compteur" }, `${x.n}/${x.total}`), h("span", { class: "t-info" }, x.complet ? `Titre : ${x.titre}` : "En cours"))),
    plus(p.length - a.length), a.length ? null : h("p", { class: "vide" }, "Aucune panoplie commencée."));
}

function piecesVue() {
  return h("div", { class: "ui-tuiles" }, HM_ROOMS.map(([id, nom]) => h("div", { class: "ui-tuile" }, h("span", { html: pxUi("gear", 24) }), h("span", { class: "t-info" }, nom))));
}

export function chezMoi() {
  const S = etat();
  const nom = (WR_CATS.find(c => c[0] === courante) || [0, (RUBRIQUES.find(r => r[0] === courante) || [0, ""])[1]])[1];
  const corps = courante === "titre" ? titresVue(S) : courante === "badges" ? badgesVue(S) : courante === "set" ? panopliesVue(S) : courante === "pieces" ? piecesVue() : objets(courante, S);
  return h("div", { class: "chez-moi" },
    h("div", { class: "puces", role: "tablist" }, RUBRIQUES.map(([id, n]) => h("button", { class: "bouton puce", role: "tab", "aria-selected": String(id === courante),
      onclick: () => { courante = id; document.dispatchEvent(new CustomEvent("moi:rubrique")); } }, n))),
    h("section", { class: "ui-section" }, h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, nom)), corps));
}
