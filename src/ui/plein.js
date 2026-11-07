// Vue plein écran (assiette, routine) : se pose par-dessus l'écran, se ferme avec « Retour ». Aucun état global.
import { h } from "./dom.js";
import { pxUi } from "./pixel.js";

export function ouvrirPlein(titre, contenu, { auFermer } = {}) {
  const fermer = () => { vue.remove(); document.body.classList.remove("plein-ouvert"); if (auFermer) auFermer(); };
  const vue = h("div", { class: "plein", role: "dialog", "aria-label": titre },
    h("div", { class: "plein__haut" },
      h("button", { class: "bouton bouton--icone", "aria-label": "Retour", onclick: fermer, html: pxUi("back", 24) }),
      h("h2", { class: "ui-titre" }, titre)),
    h("div", { class: "plein__corps" }, contenu));
  document.body.append(vue);
  document.body.classList.add("plein-ouvert");
  return { fermer, vue };
}
