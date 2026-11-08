// Scène du haut d'Aujourd'hui : demi-sphère de ciel (selon l'heure), colline, avatar, Aura au premier plan, date, météo, barre d'XP.
// L'avatar est dessiné ici de façon simple (teint, cheveux, haut, bas) ; le moteur complet (42 coiffures, accessoires) arrive en brique 3.

import { h } from "../ui/dom.js";
import { etat } from "../core/state.js";
import { niveau, rang, heureJournee } from "../core/temps.js";
import { AMB_SKY, AMB_HILL } from "../donnees/brut/ambiance-scene.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { WX_L } from "../donnees/brut/meteo.js";

const TEINTS = ["#ffe0c7", "#f5c6a0", "#e0a979", "#b9794d", "#8a5a3a", "#5e3b26"];
const CHEVEUX = ["#2a1c10", "#5a3a1e", "#a8743a", "#d9a441", "#c9c9c9", "#c0392b", "#6a3fb5", "#2f6fd6"];
const HAUTS = ["#ff6a2b", "#2433d6", "#2f9a5a", "#ff9ec7", "#f0b62e", "#c8a2ff", "#f2f0ea", "#d63b3b"];
const BAS = ["#3b5a8c", "#2c2c34", "#8a6a4a", "#d63b3b", "#2f6fd6", "#6d7680"];

/** Moment de la journée → clé de ciel du catalogue d'origine. */
export function momentCiel(S) {
  const t = heureJournee(S) % 24;
  return t < 5 ? "nuit" : t < 8 ? "aube" : t < 12 ? "matin" : t < 17.5 ? "aprem" : t < 20.5 ? "crep" : "nuit";
}

export function avatar(S) {
  const c = (S.g && S.g.avc) || {};
  const p = (liste, i, d) => liste[Number.isInteger(c[i]) ? c[i] % liste.length : d];
  const peau = p(TEINTS, "skin", 1), cheveux = p(CHEVEUX, "hairC", 1), haut = p(HAUTS, "topC", 1), bas = p(BAS, "botC", 0);
  const r = (x, y, w, hh, f) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${f}"/>`;
  const svg = [
    r(5, 1, 6, 2, cheveux), r(4, 2, 8, 2, cheveux), r(4, 4, 8, 5, peau), r(3, 3, 1, 3, cheveux), r(12, 3, 1, 3, cheveux),
    r(6, 6, 1, 1, "#24182c"), r(9, 6, 1, 1, "#24182c"), r(7, 8, 2, 1, "#24182c"),
    r(3, 10, 10, 7, haut), r(2, 11, 1, 5, peau), r(13, 11, 1, 5, peau),
    r(4, 17, 8, 6, bas), r(4, 23, 3, 1, "#24182c"), r(9, 23, 3, 1, "#24182c"),
  ].join("");
  return `<svg class="px scene__avatar" viewBox="0 0 16 24" width="96" height="144" shape-rendering="crispEdges" aria-hidden="true">${svg}</svg>`;
}

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
