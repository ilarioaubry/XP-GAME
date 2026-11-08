// Onglet Proches : Roulette, ami et famille du mois, groupes, liste avec recherche ; fiche plein écran avec les 3 façons de prendre contact.

import { h } from "../ui/dom.js";
import { pxUi } from "../ui/pixel.js";
import { ouvrirPlein, saisir } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { on } from "../core/events.js";
import { etat } from "../core/state.js";
import * as P from "../regles/proches.js";

let recherche = "", filtre = "";

const section = (titre, couleur, ...contenu) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null },
  h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre)), contenu);
const depuis = n => { const j = P.joursSans(n); return j == null ? "Pas encore de nouvelles" : j === 0 ? "Aujourd'hui" : j === 1 ? "Hier" : `Il y a ${j} jours`; };

function fiche(n) {
  const corps = h("div", { class: "fiche" });
  const dessiner = () => {
    const S = etat(), li = P.niveauLien(S.bonds[n] || 0);
    corps.replaceChildren(
      h("p", { class: "ui-carte__texte" }, `${P.typeDe(n, S) === "famille" ? "Famille" : "Ami"} · ${P.titreLien(li.l)} · niveau ${li.l}`),
      h("div", { class: "ui-barre ui-barre--grande" }, h("i", { style: `--p:${Math.round(100 * li.cur / li.need)}%` })),
      h("p", { class: "t-info" }, `${li.cur} / ${li.need} · ${depuis(n)}`),
      h("div", { class: "fiche__actions" }, P.ACTIONS.map(a => h("button", { class: "bouton" + (a.k === "news" ? " bouton--principal" : ""),
        onclick: () => { P.contacter(n, a.k); jouer("coin"); dire(`${a.nom} · +${a.xp} XP`); dessiner(); } }, a.nom, h("span", { class: "ui-compteur" }, "+" + a.xp)))),
      h("button", { class: "bouton", onclick: () => { const annuler = P.retirer(n); vue.fermer(); dire(n + " retiré", annuler); } }, "Retirer"));
  };
  const vue = ouvrirPlein(n, corps); dessiner();
}

function roulette() {
  const S = etat(), n = P.tirageActuel(S);
  const tirer = () => { const c = P.tirer(); if (c) jouer("blip"); else dire("Ajoute d'abord des proches"); };
  return section("Roulette des proches", "var(--angle-liens)",
    n ? h("div", { class: "ui-carte roulette" }, h("p", { class: "ui-carte__titre" }, `Et si tu écrivais à ${n} ?`), h("p", { class: "ui-carte__texte" }, depuis(n)),
      h("div", { class: "fiche__actions" },
        h("button", { class: "bouton bouton--principal", onclick: () => { P.contacter(n, "news"); jouer("coin"); dire("Nouvelles · +10 XP"); } }, "C'est fait"),
        h("button", { class: "bouton", onclick: tirer }, "Quelqu'un d'autre")))
      : h("button", { class: "bouton bouton--principal", onclick: tirer }, "Tirer au sort un proche"));
}

function duMois() {
  const a = P.duMois("ami"), f = P.duMois("famille");
  if (!a && !f) return null;
  return section("Du mois", "var(--angle-foyer)", h("div", { class: "du-mois" }, [[a, "Ami du mois"], [f, "Famille du mois"]].filter(x => x[0]).map(([x, t]) =>
    h("div", { class: "ui-carte" }, h("p", { class: "ui-carte__texte" }, t), h("p", { class: "ui-carte__titre" }, x.n), h("p", { class: "ui-carte__texte" }, `${x.fois} contact${x.fois > 1 ? "s" : ""}`)))));
}

function groupes() {
  const g = P.groupes();
  if (!g.length) return null;
  return section("Groupes", "var(--angle-esprit)", g.map(x => h("div", { class: "ui-carte" }, h("p", { class: "ui-carte__titre" }, x.n), h("p", { class: "ui-carte__texte" }, x.membres.join(", ") || "Aucun membre"))));
}

function liste() {
  const q = recherche.trim().toLowerCase();
  const L = P.tous().filter(x => (!filtre || x.type === filtre) && (!q || x.n.toLowerCase().includes(q)));
  return section("Mes proches", "var(--angle-liens)",
    h("input", { class: "recherche", type: "search", placeholder: "Chercher un prénom", value: recherche, "aria-label": "Chercher", oninput: e => { recherche = e.target.value; document.dispatchEvent(new CustomEvent("proches:filtre")); } }),
    h("div", { class: "puces" }, [["", "Tous"], ["famille", "Famille"], ["ami", "Amis"]].map(([v, t]) => h("button", { class: "bouton puce", "aria-pressed": String(filtre === v), onclick: () => { filtre = v; document.dispatchEvent(new CustomEvent("proches:filtre")); } }, t))),
    L.length ? L.map(x => { const li = P.niveauLien(etat().bonds[x.n] || 0);
      return h("button", { class: "ui-carte proche", onclick: () => fiche(x.n) },
        h("span", { class: "proche__texte" }, h("span", { class: "ui-carte__titre" }, x.n), h("span", { class: "ui-carte__texte" }, `${depuis(x.n)} · ${P.titreLien(li.l)}`)),
        h("span", { class: "ui-compteur" }, "Niv. " + li.l)); })
      : h("p", { class: "vide" }, "Aucun proche trouvé."),
    h("button", { class: "bouton bouton--ajout", onclick: () => saisir("Nouveau proche", [{ id: "n", etiquette: "Prénom" }], v => P.ajouter(v.n, "ami"), "Ajouter comme ami") }, "Ajouter un proche"),
    h("button", { class: "bouton bouton--ajout", onclick: () => saisir("Nouveau membre de la famille", [{ id: "n", etiquette: "Prénom" }], v => P.ajouter(v.n, "famille"), "Ajouter à la famille") }, "Ajouter un membre de la famille"));
}

export function monterProches(racine) {
  const dessiner = () => {
    const y = scrollY, actif = document.activeElement && document.activeElement.classList.contains("recherche");
    racine.replaceChildren(h("div", { class: "page proches" }, roulette(), duMois(), groupes(), liste()));
    if (actif) { const i = racine.querySelector(".recherche"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
    scrollTo(0, y);
  };
  let a = 0; const plus = () => { cancelAnimationFrame(a); a = requestAnimationFrame(dessiner); };
  on("etat:modifie", plus); document.addEventListener("proches:filtre", plus);
  dessiner();
}
