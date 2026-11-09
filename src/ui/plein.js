// Vue plein écran (assiette, routine) : se pose par-dessus l'écran, se ferme avec « Retour ». Aucun état global.
import { h } from "./dom.js";
import { pxUi } from "./pixel.js";

/** bas : true → une barre de boutons collée en bas (renvoyée dans « bas », à remplir par l'écran). */
export function ouvrirPlein(titre, contenu, { auFermer, bas } = {}) {
  const fermer = () => { vue.remove(); document.body.classList.remove("plein-ouvert"); if (auFermer) auFermer(); };
  const vue = h("div", { class: "plein", role: "dialog", "aria-label": titre },
    h("div", { class: "plein__haut" },
      h("button", { class: "bouton bouton--icone", "aria-label": "Retour", onclick: fermer, html: pxUi("back", 24) }),
      h("h2", { class: "ui-titre" }, titre)),
    h("div", { class: "plein__corps" }, contenu),
    bas ? h("div", { class: "plein__bas" }) : null);
  document.body.append(vue);
  document.body.classList.add("plein-ouvert");
  return { fermer, vue, bas: vue.querySelector(".plein__bas") };
}

/** Saisie plein écran (tout ce qui contient un champ texte). champs = [{ id, etiquette, type, defaut }] ; auValider(valeurs) */
export function saisir(titre, champs, auValider, libelle = "Ajouter") {
  const choisi = {};
  const entrees = champs.map(c => c.type === "choix" ? h("div", { class: "champ", role: "group", "aria-label": c.etiquette }, h("span", { class: "t-info" }, c.etiquette),
    h("div", { class: "perso__options" }, c.options.map(([v, n]) => { const b = h("button", { class: "bouton", "aria-pressed": String(v === c.defaut), onclick: () => {
      choisi[c.id] = v; b.parentNode.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); } }, n); if (v === c.defaut) choisi[c.id] = v; return b; })))
    : h("label", { class: "champ" }, h("span", { class: "t-info" }, c.etiquette),
    h("input", { id: "champ-" + c.id, type: c.type || "text", value: c.defaut || "", maxlength: "80", autocomplete: "off" })));
  const fin = ouvrirPlein(titre, h("div", { class: "saisie" }, entrees,
    h("button", { class: "bouton bouton--principal", onclick: () => {
      const v = {}; for (const c of champs) v[c.id] = c.type === "choix" ? choisi[c.id] : document.getElementById("champ-" + c.id).value.trim();
      if (!v[champs[0].id]) return;
      auValider(v); fin.fermer();
    } }, libelle)));
  setTimeout(() => { const i = entrees[0].querySelector("input"); if (i) i.focus(); }, 50);
  return fin;
}
