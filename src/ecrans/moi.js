// Onglet Moi : trois sous-onglets (Ma vie, Chez moi, Bilan). Bilan arrive à la brique 4 ; en attendant il montre le contrôle des données.
import { h } from "../ui/dom.js";
import { on } from "../core/events.js";
import { maVie } from "./ma-vie.js";
import { chezMoi } from "./chez-moi.js";

const SOUS = [["vie", "Ma vie"], ["chez", "Chez moi"], ["bilan", "Bilan"]];
let sous = "vie";

export function monterMoi(racine, bilan) {
  const dessiner = () => {
    const y = scrollY;
    const vue = sous === "vie" ? maVie() : sous === "chez" ? chezMoi() : bilan();
    racine.replaceChildren(h("div", { class: "page moi" },
      h("div", { class: "sous-onglets", role: "tablist" }, SOUS.map(([id, n]) => h("button", { class: "sous-onglet", role: "tab", "aria-selected": String(id === sous),
        onclick: () => { sous = id; dessiner(); scrollTo(0, 0); } }, n))), vue));
    scrollTo(0, y);
  };
  let attente = 0;
  const demain = () => { cancelAnimationFrame(attente); attente = requestAnimationFrame(dessiner); };
  on("etat:modifie", demain);
  document.addEventListener("moi:rubrique", demain);
  dessiner();
}
