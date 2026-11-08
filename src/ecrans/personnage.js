// Créateur de personnage : on choisit teint, cheveux, tenue, accessoires ; l'aperçu se met à jour tout de suite.
// Réglages dans S.g.avc (clé d'origine). Les catalogues d'options viennent de l'ancienne version (AV_OPT, AVC_TABS).
import { h } from "../ui/dom.js";
import { ouvrirPlein } from "../ui/plein.js";
import { jouer } from "../core/sons.js";
import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { AV_OPT } from "../donnees/brut/equipement.js";
import { AV_DEF, AVC_TABS } from "../donnees/brut/createur-personnage.js";
import { avatarSvg } from "../avatar/rendu.js";
import "../avatar/moteur.js"; // complète AV_OPT (bas, chaussures) avant l'ouverture

let onglet = "face";

export function ouvrirPersonnage() {
  const corps = h("div", { class: "perso" });
  const choisir = (cle, i) => { modifier("avatar", S => { (S.g.avc ||= {})[cle] = i; }); emit("equipement:change", { slot: "avatar", id: cle }); jouer("blip"); dessiner(); };
  const dessiner = () => {
    const S = etat(), cfg = { ...AV_DEF, ...(S.g.avc || {}) }, tab = AVC_TABS.find(t => t[0] === onglet) || AVC_TABS[0];
    corps.replaceChildren(...[
      h("div", { class: "perso__apercu", html: avatarSvg(S, 4) }),
      h("div", { class: "puces", role: "tablist" }, AVC_TABS.map(t => h("button", { class: "bouton puce", role: "tab", "aria-selected": String(t[0] === tab[0]), onclick: () => { onglet = t[0]; dessiner(); } }, t[1]))),
      tab[2].map(([cle, nom, genre]) => {
        const opts = AV_OPT[cle] || [];
        return h("section", { class: "ui-section" }, h("div", { class: "ui-entete" }, h("h3", { class: "ui-titre" }, nom)),
          h("div", { class: "perso__options" }, opts.map((o, i) => {
            const couleur = Array.isArray(o) ? o[0] : (genre === "sw" ? o : null);
            return h("button", { class: "bouton perso__opt" + (couleur ? " perso__opt--couleur" : ""), "aria-pressed": String((cfg[cle] | 0) === i), "aria-label": couleur ? `${nom} ${i + 1}` : String(o),
              style: couleur ? `--c:${couleur}` : null, onclick: () => choisir(cle, i) }, couleur ? "" : String(o));
          })));
      }),
    ].flat());
  };
  ouvrirPlein("Mon personnage", corps); dessiner();
}
