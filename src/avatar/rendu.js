// Dessine l'avatar : configuration (S.g.avc) + objets équipés (S.g.eq) → moteur Pixel Clair → SVG net.
// Sert aussi aux visages d'humeur (rond de couleur + tête, comme l'ancienne version), aux têtes des proches et aux badges.
import { chDraw, chAnchors, CH, PIECES } from "./moteur.js";
import { bdgPx } from "./badges-pixel.js";
import { AV_DEF } from "../donnees/brut/createur-personnage.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { BODY_MOOD } from "../donnees/brut/figurines-expressions.js";

/** Configuration d'avatar : l'équipé l'emporte sur le réglage de base (comme dans l'ancienne version). */
export function configAvatar(S) {
  const cfg = { ...AV_DEF, ...((S.g && S.g.avc) || {}) };
  const eq = (S.g && S.g.eq) || {};
  for (const [slot, id] of Object.entries(eq)) {
    if (slot === "aura" || slot === "fond") continue;
    const o = Object.values(GEAR).find(g => g.id === id && g.s === slot);
    if (o && o.k != null) cfg[o.k] = o.o;
  }
  return cfg;
}

/** Tableau de pixels (couleur ou null) → rectangles horizontaux fusionnés. */
function rectangles(px, W, H, dx = 0, dy = 0) {
  let r = "";
  for (let y = 0; y < H; y++) for (let x = 0; x < W;) {
    const c = px[y * W + x];
    if (!c) { x++; continue; }
    let x2 = x + 1; while (x2 < W && px[y * W + x2] === c) x2++;
    r += `<rect x="${x + dx}" y="${y + dy}" width="${x2 - x}" height="1" fill="${c}"/>`; x = x2;
  }
  return r;
}
const svgPixels = (rects, W, H, taille, classe = "px") =>
  `<svg class="${classe}" viewBox="0 0 ${W} ${H}" width="${taille}" height="${Math.round(taille * H / W)}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;

const cache = new Map();
const garder = (cle, fabrique) => {
  if (!cache.has(cle)) { if (cache.size > 120) cache.clear(); cache.set(cle, fabrique()); }
  return cache.get(cle);
};

/** SVG de l'avatar en pied (grille 32×52), pose « idle ». `echelle` = taille d'un pixel de la grille. */
export function avatarSvg(S, echelle = 4, pose = "idle") {
  const cfg = configAvatar(S);
  return garder(JSON.stringify(cfg) + pose + echelle, () => {
    const px = chDraw(cfg, pose, 0);
    return `<svg class="px scene__avatar" viewBox="0 0 ${CH.W} ${CH.H}" width="${CH.W * echelle}" height="${CH.H * echelle}" shape-rendering="crispEdges" aria-hidden="true">${rectangles(px, CH.W, CH.H)}</svg>`;
  });
}

// ---- Visages d'humeur de l'ancienne version : un rond de couleur et la tête de l'avatar avec l'expression du jour.
export const COULEURS_HUMEUR = ["#d1493f", "#e8873a", "#e0c03a", "#8cc56a", "#3c9a4f"];
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const melange = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");

export function visageHumeur(S, n, taille = 44) {
  n = Math.max(1, Math.min(5, n | 0));
  const base = (S.g && S.g.avc) || {}, lunettes = [3, 4, 7].includes(base.glasses | 0) ? 0 : (base.glasses | 0);
  return garder("humeur" + JSON.stringify(base) + n + taille, () => {
    const [yeux, bouche] = BODY_MOOD[n - 1];
    const cfg = { ...AV_DEF, ...base, eyes: yeux, mouth: bouche, hat: 0, glasses: lunettes, size: 0, main: 0 };
    const px = chDraw(cfg, "idle", 0), A = chAnchors(cfg, "idle", 0);
    const N = 22, R = 10.45, C = 10.5, ox = 2, oy = 2, HW = 18, HH = 18, x0 = 7, y0 = A.t - 3, col = COULEURS_HUMEUR[n - 1];
    const grille = new Array(N * N).fill(null);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const d = (x - C) ** 2 + (y - C) ** 2;
      if (d <= R * R) grille[y * N + x] = d > (R - 1.4) ** 2 ? melange(col, "#000000", .35) : col;
    }
    for (let y = 0; y < HH; y++) for (let x = 0; x < HW; x++) {
      const sx = x0 + x, sy = y0 + y;
      if (sx < 0 || sx >= CH.W || sy < 0 || sy >= CH.H) continue;
      const v = px[sy * CH.W + sx], X = x + ox, Y = y + oy;
      if (v && X >= 0 && X < N && Y >= 0 && Y < N && (X - C) ** 2 + (Y - C) ** 2 <= (R - .3) ** 2) grille[Y * N + X] = v;
    }
    return svgPixels(rectangles(grille, N, N), N, N, taille, "px visage-svg");
  });
}

// ---- Tête d'un proche (profil S.profiles[nom].avc, créé dans l'ancienne version)
export function teteSvg(avc, taille = 40) {
  return garder("tete" + JSON.stringify(avc) + taille, () => {
    const H = PIECES.chHead({ ...AV_DEF, ...avc });
    return svgPixels(rectangles(H.px, H.W, H.H), H.W, H.H, taille, "px tete-svg");
  });
}

// ---- Badge (32×32) de l'ancienne version ; verrouillé = gris.
export function badgeSvg(b, verrouille = false, taille = 48) {
  return garder("badge" + b.id + verrouille + taille, () => {
    const g = bdgPx(b, verrouille);
    return svgPixels(rectangles(g.px, g.W, g.H), g.W, g.H, taille, "px badge-svg");
  });
}
