// Dessine l'avatar : configuration (S.g.avc) + objets équipés (S.g.eq) → moteur Pixel Clair → SVG net.
import { chDraw, CH } from "./moteur.js";
import { AV_DEF } from "../donnees/brut/createur-personnage.js";
import { GEAR } from "../donnees/brut/equipement.js";

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

const cache = new Map();
/** SVG de l'avatar en pied (grille 32×52), pose « idle ». `echelle` = taille d'un pixel de la grille. */
export function avatarSvg(S, echelle = 4, pose = "idle") {
  const cfg = configAvatar(S), cle = JSON.stringify(cfg) + pose + echelle;
  if (cache.has(cle)) return cache.get(cle);
  const px = chDraw(cfg, pose, 0), W = CH.W, H = CH.H;
  let r = "";
  for (let y = 0; y < H; y++) for (let x = 0; x < W;) {
    const c = px[y * W + x];
    if (!c) { x++; continue; }
    let x2 = x + 1; while (x2 < W && px[y * W + x2] === c) x2++;
    r += `<rect x="${x}" y="${y}" width="${x2 - x}" height="1" fill="${c}"/>`; x = x2;
  }
  const svg = `<svg class="px scene__avatar" viewBox="0 0 ${W} ${H}" width="${W * echelle}" height="${H * echelle}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  if (cache.size > 40) cache.clear();
  cache.set(cle, svg);
  return svg;
}
