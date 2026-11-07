// Constructeur d'assiette : on choisit féculent, protéine, légume (+ sauce, dessert), on valide, le repas est noté.
// Une pastille douce dit si l'assiette est bien remplie ; « Repas sauté » est dans la même vue, sans pénalité.

import { h } from "../ui/dom.js";
import { pxRk } from "../ui/pixel.js";
import { ouvrirPlein } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { PL_SAUCE, PL_DES, PL_OU } from "../donnees/brut/assiette.js";
import { GROUPES, assietteDe, enregistrerAssiette, pastille, sauter, repasFait, effacer } from "../regles/repas.js";

export function ouvrirAssiette(slot) {
  const nomSlot = slot === "dej" ? "Déjeuner" : "Dîner";
  const a = JSON.parse(JSON.stringify(assietteDe(slot)));
  a.x ||= {};
  const corps = h("div", { class: "assiette" });
  const dessiner = () => {
    const p = pastille(a);
    const choix = (k, id) => { const t = a[k] || (a[k] = []); const i = t.indexOf(id); if (i >= 0) t.splice(i, 1); else t.push(id); jouer("blip"); dessiner(); };
    const puce = (item, k) => h("button", { class: "assiette__puce ui-tuile", "aria-pressed": String((a[k] || []).includes(item.id)), onclick: () => choix(k, item.id),
      html: (pxRk(item.icone, 32) || "") + `<span>${item.nom}</span>` });
    corps.replaceChildren(...[
      h("div", { class: "assiette__plat", "aria-label": "Mon assiette" },
        GROUPES.map(g => h("div", { class: "assiette__part", style: `--part:${g.c1}` },
          h("span", { class: "t-info" }, g.nom),
          h("div", { class: "assiette__contenu" }, (a[g.k] || []).map(id => { const it = g.items.find(i => i.id === id); return it ? h("span", { html: pxRk(it.icone, 32) || "", title: it.nom }) : null; }))))),
      h("p", { class: "assiette__pastille assiette__pastille--" + p.niveau }, p.texte),
      GROUPES.map(g => h("section", { class: "ui-section", style: `--sc:${g.c1}` },
        h("div", { class: "ui-entete" }, h("h3", { class: "ui-titre" }, g.nom)),
        h("div", { class: "ui-tuiles" }, g.items.map(it => puce(it, g.k))))),
      h("section", { class: "ui-section" },
        h("div", { class: "ui-entete" }, h("h3", { class: "ui-titre" }, "Sauce et dessert")),
        h("div", { class: "assiette__lignes" },
          PL_SAUCE.map(([id, n]) => h("button", { class: "bouton", "aria-pressed": String((a.s || []).includes(id)), onclick: () => choix("s", id) }, n)),
          PL_DES.map(([id, n]) => h("button", { class: "bouton", "aria-pressed": String(!!a.x[id]), onclick: () => { a.x[id] = a.x[id] ? 0 : 1; if (!a.x[id]) delete a.x[id]; dessiner(); } }, n)))),
      h("section", { class: "ui-section" },
        h("div", { class: "ui-entete" }, h("h3", { class: "ui-titre" }, "Où ?")),
        h("div", { class: "assiette__lignes" }, PL_OU.map(([id, n]) => h("button", { class: "bouton", "aria-pressed": String(a.w === id), onclick: () => { a.w = a.w === id ? "" : id; dessiner(); } }, n)))),
      h("div", { class: "assiette__actions" },
        h("button", { class: "bouton bouton--principal", onclick: valider }, repasFait(slot === "dej" ? "dej" : "diner") ? "Mettre à jour" : "Valider le repas"),
        repasFait(slot === "dej" ? "dej" : "diner")
          ? h("button", { class: "bouton", onclick: annuler }, "Effacer ce repas")
          : h("button", { class: "bouton", onclick: saute }, "Repas sauté"))].flat());
  };
  const vue = ouvrirPlein(nomSlot, corps);
  const valider = () => {
    const nouveau = enregistrerAssiette(slot, a);
    jouer(nouveau ? "coin" : "blip");
    dire(nouveau ? nomSlot + " noté" : "Assiette mise à jour");
    vue.fermer();
  };
  const saute = () => { sauter(slot === "dej" ? "dej" : "diner"); dire(nomSlot + " sauté, pas de souci"); vue.fermer(); };
  const annuler = () => { effacer(slot === "dej" ? "dej" : "diner"); dire(nomSlot + " effacé"); vue.fermer(); };
  dessiner();
}
