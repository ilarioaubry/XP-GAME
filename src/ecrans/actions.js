// Panneau « + » d'Aujourd'hui (repris de l'ancienne version, en plein écran) : chercher, ou choisir un domaine puis une action ;
// ensuite la durée et, si ça se fait à plusieurs, « Avec qui ? », sur un seul écran, et « Fait · +N XP » en bas.

import { h } from "../ui/dom.js";
import { pxRk, pxUi } from "../ui/pixel.js";
import { ouvrirPlein } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { pop } from "../ui/effets.js";
import * as A from "../regles/actions.js";

export function ouvrirActions() {
  let q = "", dom = "", choix = null, duree = 0, avec = [], tous = false;
  const corps = h("div", { class: "actions" });
  const vue = ouvrirPlein("Noter une action", corps, { bas: true });

  const puce = a => {
    const n = A.foisAujourdhui(a.cle);
    return h("button", { class: "act" + (n ? " act--fait" : ""), onclick: e => prendre(a, e.currentTarget) },
      h("span", { class: "act__ico", html: pxRk(a.icone, 24) || pxRk("etoile", 24) }),
      h("span", { class: "act__nom" }, q || !dom ? a.nom : a.opt),
      n ? h("span", { class: "act__fois" }, n > 1 ? "×" + n : h("span", { html: pxUi("check", 12) })) : null);
  };
  const prendre = (a, bouton) => {
    if (A.rapide(a) && !A.avecQui(a)) { finir(a, 0, [], bouton); return; }
    choix = a; duree = 0; avec = []; tous = false; dessiner();
    vue.vue.querySelector(".plein__corps").scrollTop = 0;
  };
  const finir = (a, d, qui, bouton) => {
    const xp = A.noterAction(a, d, qui);
    jouer(xp ? "coin" : "blip");
    if (bouton) pop(bouton);
    dire("Fait : " + a.nom + (qui.length ? " avec " + qui.join(", ") : ""));
    vue.fermer();
  };

  function liste() {
    const champ = h("input", { class: "actions__chercher", type: "search", placeholder: "Chercher : ménage, film, pompes…", "aria-label": "Chercher une action", value: q, autocomplete: "off", enterkeyhint: "search",
      oninput: e => { q = e.target.value; const pos = e.target.selectionStart; dessiner(); const i = corps.querySelector(".actions__chercher"); if (i) { i.focus(); i.setSelectionRange(pos, pos); } } });
    const domaines = h("div", { class: "actions__domaines", role: "group", "aria-label": "Domaines" }, A.DOMAINES.map(d =>
      h("button", { class: "domaine", "aria-pressed": String(dom === d.id), onclick: () => { dom = dom === d.id ? "" : d.id; dessiner(); } },
        h("span", { html: pxRk({ maison: "canape", sport: "halteres", soi: "medit", nourriture: "repas", travail: "laptop", divert: "manette", creer: "pinceau", apprendre: "lire", proches: "duo" }[d.id], 24) || "" }), d.nom)));
    let contenu;
    if (q.trim()) {
      const L = A.chercher(q);
      contenu = L.length ? h("div", { class: "actions__puces" }, L.map(puce)) : h("p", { class: "vide" }, "Aucune action trouvée.");
    } else if (dom) {
      contenu = A.familles(dom).map(F => h("section", { class: "famille" },
        h("h3", { class: "famille__titre" }, h("span", { html: pxRk(F.icone, 24) || "" }), F.nom),
        h("div", { class: "actions__puces" }, F.actions.map(puce))));
    } else {
      const R = A.recentes();
      contenu = [h("p", { class: "actions__sous" }, R.titre), h("div", { class: "actions__puces" }, R.liste.map(puce))];
    }
    return [champ, q.trim() ? null : domaines, contenu];
  }

  function detail() {
    const a = choix, qui = A.avecQui(a), D = A.rapide(a) ? [] : A.durees(a);
    const P = A.personnes(a), montres = tous ? P : P.slice(0, 10);
    return [
      h("div", { class: "detail__haut" },
        h("span", { class: "detail__ico", html: pxRk(a.icone, 48) || pxRk("etoile", 48) }), h("p", { class: "ui-carte__titre" }, a.nom)),
      D.length ? h("section", { class: "detail__bloc" }, h("p", { class: "actions__sous" }, "Combien de temps ?"),
        h("div", { class: "durees" }, D.map(([m, l]) => h("button", { class: "duree", "aria-pressed": String(duree === m), onclick: () => { duree = m; dessiner(); } },
          h("span", {}, l), h("small", {}, "+" + A.xpPrevu(a, m) + " XP"))))) : null,
      qui ? h("section", { class: "detail__bloc" }, h("p", { class: "actions__sous" }, "Avec qui ?"),
        P.length ? h("div", { class: "actions__puces" }, montres.map(p => h("button", { class: "personne", "aria-pressed": String(avec.includes(p)),
          onclick: () => { avec = avec.includes(p) ? avec.filter(x => x !== p) : [...avec, p]; dessiner(); } }, p)),
          !tous && P.length > 10 ? h("button", { class: "personne", onclick: () => { tous = true; dessiner(); } }, "+ " + (P.length - 10)) : null)
          : h("p", { class: "vide" }, "Ajoute tes proches dans l'onglet Proches.")) : null,
    ];
  }

  function dessiner() {
    corps.replaceChildren(...(choix ? detail() : liste()).flat().filter(Boolean));
    if (!choix) { vue.bas.replaceChildren(); return; }
    const a = choix, xp = A.xpPrevu(a, duree), manque = a.fam.who && !avec.length;
    vue.bas.replaceChildren(h("button", { class: "bouton", onclick: () => { choix = null; dessiner(); } }, "Retour"),
      h("button", { class: "bouton bouton--principal", disabled: manque, onclick: e => finir(a, duree, avec, e.currentTarget) },
        manque ? "Choisis avec qui" : (avec.length ? "Fait avec " + (avec.length > 2 ? avec.slice(0, 2).join(", ") + " +" + (avec.length - 2) : avec.join(" et ")) : "Fait") + (xp ? " · +" + xp + " XP" : "")));
  }
  dessiner();
}
