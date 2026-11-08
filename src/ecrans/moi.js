// Onglet Moi, d'après la maquette : scène du personnage en haut (commune aux 3 sous-onglets), puis Ma vie / Chez moi / Bilan.
import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { on } from "../core/events.js";
import { etat } from "../core/state.js";
import { niveau, rang } from "../core/temps.js";
import { decor } from "./scene.js";
import { maVie } from "./ma-vie.js";
import { chezMoi } from "./chez-moi.js";
import { ouvrirPersonnage } from "./personnage.js";
import * as M from "../regles/moi.js";

const SOUS = [["vie", "Ma vie"], ["chez", "Chez moi"], ["bilan", "Bilan"]];
let sous = "vie";

function sceneMoi() {
  const S = etat(), nv = niveau(S.xp || 0), titre = M.titrePorte(S) || rang(nv.l);
  const aura = (S.g.eq || {}).aura;
  return decor(S,
    h("div", { class: "hero__entete" }, h("p", { class: "hero__nom" }, S.name || "Moi"),
      h("p", { class: "hero__niveau" }, `Niveau ${nv.l}` + (aura ? ` · ${(M.objetsDe("aura", S).find(o => o.id === aura) || {}).n || "Aura"}` : ""))),
    h("button", { class: "hero__reglage", "aria-label": "Mon personnage", title: "Mon personnage", html: pxUi("edit", 24), onclick: ouvrirPersonnage }),
    h("div", { class: "hero__plaque" }, h("span", { html: pxRk("etoile", 16) || "" }), h("span", {}, titre)));
}

export function monterMoi(racine, bilan) {
  const dessiner = () => {
    const y = scrollY;
    const vue = sous === "vie" ? maVie() : sous === "chez" ? chezMoi() : bilan();
    racine.replaceChildren(h("div", { class: "moi" }, sceneMoi(),
      h("div", { class: "moi__corps" },
        h("div", { class: "sous-onglets", role: "tablist" }, SOUS.map(([id, n]) => h("button", { class: "sous-onglet", role: "tab", "aria-selected": String(id === sous),
          onclick: () => { sous = id; dessiner(); scrollTo(0, 0); } }, n))), vue)));
    scrollTo(0, y);
  };
  let attente = 0;
  const demain = () => { cancelAnimationFrame(attente); attente = requestAnimationFrame(dessiner); };
  on("etat:modifie", demain);
  document.addEventListener("moi:rubrique", demain);
  dessiner();
}
