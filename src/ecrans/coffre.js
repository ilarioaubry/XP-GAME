// Ouverture d'un coffre (interface de l'ancienne version, redessinée) : le coffre tombe, on le touche trois fois
// (il tremble un peu plus à chaque fois), il s'ouvre, l'objet apparaît avec sa rareté en étoiles et son nom.
// « Réduire les animations » : pas de tremblement ni d'éclats, le résultat s'affiche tout de suite.

import { h } from "../ui/dom.js";
import { pxRk } from "../ui/pixel.js";
import { jouer } from "../core/sons.js";
import { calme } from "../ui/effets.js";
import { objetSvg } from "../avatar/rendu.js";
import { ouvrirUnCoffre, coffresAOuvrir, RARETES } from "../regles/coffre.js";

// coffre pixel 32×30 : couleurs lues dans tokens.css (classes k-…)
const COFFRE = `<svg class="coffre-vue__svg" viewBox="0 0 32 30" shape-rendering="crispEdges" aria-hidden="true">
<g class="coffre-vue__base"><rect class="k-bois" x="2" y="14" width="28" height="14"/><rect class="k-bois-ombre" x="2" y="14" width="28" height="2"/><rect class="k-ferrure" x="0" y="13" width="2" height="15"/><rect class="k-ferrure" x="30" y="13" width="2" height="15"/><rect class="k-ferrure" x="2" y="28" width="28" height="2"/><rect class="k-ferrure" x="13" y="14" width="6" height="6"/><rect class="k-serrure" x="15" y="16" width="2" height="3"/><rect class="k-bois-clair" x="4" y="18" width="2" height="8"/></g>
<g class="coffre-vue__lueur"><rect class="k-lueur" x="3" y="11" width="26" height="3"/></g>
<g class="coffre-vue__couvercle"><rect class="k-bois-clair" x="2" y="5" width="28" height="9"/><rect class="k-ferrure" x="2" y="3" width="28" height="2"/><rect class="k-ferrure" x="0" y="5" width="2" height="9"/><rect class="k-ferrure" x="30" y="5" width="2" height="9"/><rect class="k-ferrure" x="13" y="9" width="6" height="5"/><rect class="k-bois-reflet" x="4" y="7" width="20" height="1"/></g></svg>`;

function eclats(zone, n, gros) {
  if (calme() || !document.body.animate) return;
  for (let i = 0; i < n; i++) {
    const p = h("i", { class: "coffre-vue__eclat" + (i % 3 === 0 ? " coffre-vue__eclat--clair" : "") });
    zone.append(p);
    const a = Math.random() * Math.PI * 2, d = (gros ? 120 : 70) + Math.random() * (gros ? 120 : 60);
    p.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 30}px)`, opacity: 0 }],
      { duration: 700 + Math.random() * 300, easing: "steps(8)", fill: "both" }).onfinish = () => p.remove();
  }
}

export function ouvrirCoffre() {
  if (!coffresAOuvrir()) return;
  const res = ouvrirUnCoffre();
  if (!res) return;
  let touchers = 0, ouvert = false;
  const points = [0, 1, 2].map(() => h("i"));
  const zone = h("div", { class: "coffre-vue__eclats" });
  const coffre = h("button", { class: "coffre-vue__coffre", "aria-label": "Toucher le coffre pour l'ouvrir", html: COFFRE });
  const indice = h("p", { class: "coffre-vue__indice" }, "Touche le coffre !");
  const image = res.k === "gear" ? objetSvg(res.it, 96) : pxRk(res.k === "title" ? "banniere" : "etoile", 96);
  const resultat = h("div", { class: "coffre-vue__resultat", hidden: true },
    h("p", { class: "coffre-vue__rarete" }, RARETES[res.r]),
    h("p", { class: "coffre-vue__etoiles", role: "img", "aria-label": `${RARETES[res.r]} : ${res.r + 1} étoile${res.r ? "s" : ""} sur 4` },
      [0, 1, 2, 3].map(i => h("span", { class: i <= res.r ? "on" : "", html: pxRk("etoile", 24) || "" }))),
    h("span", { class: "coffre-vue__objet", html: image || "" }),
    h("p", { class: "coffre-vue__nom" }, res.nom),
    h("p", { class: "coffre-vue__sous" }, res.sous + (res.k === "gear" ? " · dans ton armoire" : res.k === "title" ? " · dans Moi > Chez moi" : "")));
  const reste = coffresAOuvrir();
  const fermer = () => vue.remove();
  const boutons = h("div", { class: "coffre-vue__boutons", hidden: true },
    h("button", { class: "bouton bouton--principal", onclick: fermer }, "Super !"),
    reste ? h("button", { class: "bouton", onclick: () => { fermer(); ouvrirCoffre(); } }, `Encore un coffre (${reste})`) : null);
  const vue = h("div", { class: "coffre-vue" + (res.special ? " coffre-vue--special" : ""), role: "dialog", "aria-modal": "true", "aria-label": res.special ? "Coffre spécial" : "Coffre" },
    h("div", { class: "coffre-vue__scene" },
      h("p", { class: "coffre-vue__genre" }, res.special ? "Coffre spécial" : "Coffre"),
      coffre, indice, h("div", { class: "coffre-vue__points" }, points), resultat, boutons, zone));
  const reveler = () => {
    if (ouvert) return; ouvert = true;
    vue.classList.add("coffre-vue--ouvert");
    jouer("open", res.r);
    eclats(zone, [10, 18, 30, 44][res.r], res.r >= 2);
    setTimeout(() => { indice.hidden = true; resultat.hidden = false; boutons.hidden = false; boutons.querySelector("button").focus({ preventScroll: true }); }, calme() ? 0 : 480);
  };
  coffre.onclick = () => {
    if (ouvert) return;
    touchers++;
    jouer("shake", touchers);
    points.forEach((p, i) => p.classList.toggle("on", i < touchers));
    coffre.classList.remove("coffre-vue__coffre--secoue"); void coffre.offsetWidth; coffre.classList.add("coffre-vue__coffre--secoue");
    eclats(zone, 2 + touchers * 2, false);
    if (touchers >= 3) setTimeout(reveler, calme() ? 0 : 240);
  };
  document.body.append(vue);
  jouer("drop");
}
