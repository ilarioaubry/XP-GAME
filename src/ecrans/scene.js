// Scène du haut d'Aujourd'hui : demi-sphère de ciel (selon l'heure), colline, avatar, Aura au premier plan, date, météo, barre d'XP.
// L'avatar vient du moteur Pixel Clair (src/avatar) : coiffures, vêtements, accessoires, objets équipés.

import { h } from "../ui/dom.js";
import { etat } from "../core/state.js";
import { niveau, rang, heureJournee } from "../core/temps.js";
import { AMB_SKY, AMB_HILL } from "../donnees/brut/ambiance-scene.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { WX_L } from "../donnees/brut/meteo.js";
import { avatarSvg } from "../avatar/rendu.js";

/** Moment de la journée → clé de ciel du catalogue d'origine. */
export function momentCiel(S) {
  const t = heureJournee(S) % 24;
  return t < 5 ? "nuit" : t < 8 ? "aube" : t < 12 ? "matin" : t < 17.5 ? "aprem" : t < 20.5 ? "crep" : "nuit";
}

export const avatar = S => avatarSvg(S, 4);

function aura(S) {
  const id = S.g && S.g.eq && S.g.eq.aura;
  const a = id && Object.values(GEAR).find(g => g.s === "aura" && g.id === id);
  if (!a) return null;
  return h("div", { class: "scene__aura", html: `<svg viewBox="0 0 120 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${a.svg}</svg>` });
}

function meteo(S) {
  const c = S.g && S.g.wx && S.g.wx.c;
  if (!c || c.t == null) return null;
  const nom = WX_L[c.k] || WX_L[c.c] || "";
  return `${Math.round(c.t)}°${nom ? " · " + nom : ""}`;
}

export function scene() {
  const S = etat();
  const m = momentCiel(S);
  const nv = niveau(S.xp || 0);
  const date = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const [h1, h2] = AMB_HILL[m];
  const meteoTxt = meteo(S);
  const sphere = h("div", { class: "scene__sphere", style: `--ciel:${AMB_SKY[m]};--col1:${h1};--col2:${h2}` },
    h("div", { class: "scene__colline" }),
    h("div", { class: "scene__perso", html: avatar(S) }),
    aura(S));
  return h("section", { class: "scene", "aria-label": "Ma journée" },
    h("p", { class: "scene__date" }, date, meteoTxt ? h("span", { class: "scene__meteo" }, " · " + meteoTxt) : null),
    sphere,
    h("div", { class: "scene__niveau" },
      h("div", { class: "scene__rang" }, h("span", { class: "ui-compteur" }, "Niv. " + nv.l), h("span", { class: "t-carte" }, rang(nv.l))),
      h("div", { class: "ui-barre ui-barre--grande", role: "progressbar", "aria-valuenow": nv.cur, "aria-valuemax": nv.need, "aria-label": "Expérience" },
        h("i", { style: `--p:${Math.round(100 * nv.cur / nv.need)}%` })),
      h("p", { class: "t-info" }, `${nv.cur} / ${nv.need} XP pour le prochain niveau`)));
}
