// Rendu des icônes pixel art : mêmes grilles et mêmes palettes que l'ancienne version, sorties en SVG nets.
//   pxUi("plus", 24)       icône d'interface 12×12, une couleur (currentColor)
//   pxRk("riz", 48)        icône de contenu 16×16 (aliments, rituels, objets), palette RKP
// Les grilles viennent de src/donnees/brut (copie de l'ancienne version) : rien n'est redessiné.

import { PXUI, RKI } from "../donnees/brut/icones.js";
import { RKP } from "../donnees/brut/rituels-tuiles.js";

const cache = new Map();

/** Icône d'interface 12×12 : rectangles horizontaux fusionnés, couleur = currentColor. */
export function pxUi(nom, taille = 24, classe = "") {
  const g = PXUI[nom];
  if (!g) return "";
  const cle = "u:" + nom;
  let rects = cache.get(cle);
  if (rects === undefined) {
    rects = "";
    g.forEach((ligne, y) => {
      let x = 0;
      while (x < 12) {
        if (ligne[x] !== "#") { x++; continue; }
        let w = 1;
        while (x + w < 12 && ligne[x + w] === "#") w++;
        rects += `<rect x="${x}" y="${y}" width="${w}" height="1.02"/>`;
        x += w;
      }
    });
    cache.set(cle, rects);
  }
  return `<svg class="px px-ui ${classe}" viewBox="0 0 12 12" width="${taille}" height="${taille}" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

/** Grille 16×16 recentrée (comme rkC de l'ancienne version) : un sprite plus petit reste au milieu de sa case. */
function centrer(g) {
  let y0 = 99, y1 = -1, x0 = 99, x1 = -1;
  g.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch !== "." && RKP[ch]) { if (y < y0) y0 = y; if (y > y1) y1 = y; if (x < x0) x0 = x; if (x > x1) x1 = x; }
  }));
  if (y1 < 0) return g;
  const ty = Math.floor((16 - (y1 - y0 + 1)) / 2), tx = Math.floor((16 - (x1 - x0 + 1)) / 2);
  const O = Array.from({ length: 16 }, () => Array(16).fill("."));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const ch = (g[y] || "")[x] || ".";
    if (RKP[ch]) O[ty + y - y0][tx + x - x0] = ch;
  }
  return O.map(r => r.join(""));
}

/** Icône de contenu 16×16 en couleurs. Une icône inconnue donne null (le module appelant décide du repli). */
export function pxRk(nom, taille = 48, classe = "") {
  const brut = RKI[nom];
  if (!brut) return null;
  const cle = "r:" + nom;
  let rects = cache.get(cle);
  if (rects === undefined) {
    rects = "";
    centrer(brut).forEach((ligne, y) => [...ligne].forEach((ch, x) => {
      const c = RKP[ch];
      if (c) rects += `<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${c}"/>`;
    }));
    cache.set(cle, rects);
  }
  return `<svg class="px px-rk ${classe}" viewBox="0 0 16 16" width="${taille}" height="${taille}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

export const nomsUi = () => Object.keys(PXUI);
export const nomsRk = () => Object.keys(RKI);
