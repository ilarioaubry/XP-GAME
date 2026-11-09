// Messages : un seul emplacement, au-dessus des onglets. emit("toast", { texte, annuler }) ; annuler = fonction qui défait.
import { on, emit } from "../core/events.js";
import { h, $ } from "./dom.js";
import { pxRk } from "./pixel.js";
import { iconeMessage } from "./illustrations.js";

let minuteur = 0;
export function installerMessages() {
  on("toast", ({ texte, annuler }) => {
    const zone = $(".messages");
    if (!zone) return;
    clearTimeout(minuteur);
    const bouton = annuler ? h("button", { class: "bouton", onclick: () => { zone.replaceChildren(); annuler(); emit("annuler", {}); } }, "Annuler") : null;
    zone.replaceChildren(h("div", { class: "message" }, h("span", { class: "message__ic", html: pxRk(iconeMessage(texte), 24) || "" }), h("span", { class: "message__texte" }, texte), bouton));
    minuteur = setTimeout(() => zone.replaceChildren(), annuler ? 6000 : 3000);
  });
}
export const dire = (texte, annuler) => emit("toast", { texte, annuler });
