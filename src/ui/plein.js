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

/** Saisie plein écran (tout ce qui contient un champ texte). champs = [{ id, etiquette, type, defaut }] ; auValider(valeurs) */
export function saisir(titre, champs, auValider, libelle = "Ajouter") {
  const entrees = champs.map(c => h("label", { class: "champ" }, h("span", { class: "t-info" }, c.etiquette),
    h("input", { id: "champ-" + c.id, type: c.type || "text", value: c.defaut || "", maxlength: "80", autocomplete: "off" })));
  const fin = ouvrirPlein(titre, h("div", { class: "saisie" }, entrees,
    h("button", { class: "bouton bouton--principal", onclick: () => {
      const v = {}; for (const c of champs) v[c.id] = document.getElementById("champ-" + c.id).value.trim();
      if (!v[champs[0].id]) return;
      auValider(v); fin.fermer();
    } }, libelle)));
  setTimeout(() => entrees[0].querySelector("input").focus(), 50);
  return fin;
}
