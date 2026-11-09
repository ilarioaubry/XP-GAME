// Illustrations partagées : on explique par l'image plutôt que par les mots (assets de l'ancienne version).
//  scenePixel(icone, couleur, { rayons, sous })  bandeau en marches de couleur, halo pixel, grande icône, étincelles fixes
//                                                (uiScene de l'ancienne version, 03/11), posé en tête des fenêtres plein écran ;
//  vide(texte, icone)                             état vide illustré ;
//  tuileIcone(icone, couleur, taille)             icône pixel sur un carré de couleur plate ;
//  ICONE_CAT / iconeCat(cat)                      l'icône de chaque catégorie d'XP ;
//  avatarParDefaut(nom)                           un visage pixel stable pour un proche sans avatar.
import { h } from "./dom.js";
import { pxRk } from "./pixel.js";

export const ICONE_CAT = { sport: "halteres", nourriture: "repas", eau: "verre", soi: "medit", perso: "pinceau", travail: "laptop", social: "duo", famille: "famille", maison: "maisonp", planete: "plante", divert: "manette" };
export const iconeCat = cat => ICONE_CAT[cat] || "etoile";
export const COULEUR_CAT = { sport: "var(--angle-corps)", nourriture: "var(--angle-corps)", eau: "var(--angle-corps)", soi: "var(--angle-esprit)", perso: "var(--angle-esprit)", travail: "var(--angle-esprit)", social: "var(--angle-liens)", famille: "var(--angle-liens)", maison: "var(--angle-foyer)", planete: "var(--angle-foyer)" };
export const couleurCat = cat => COULEUR_CAT[cat] || "var(--action)";

const POINTS = [[6, 4], [13, 9], [22, 3], [58, 5], [73, 3], [30, 14], [50, 15], [9, 16], [66, 12]];
/** Bandeau illustré : marches de couleur de plus en plus claires vers le sol, halo, grande icône pixel, étincelles. */
export function scenePixel(icone, couleur = "var(--action)", o = {}) {
  const W = 80, H = 24, cx = 40, cy = 12;
  let r = "";
  [[0, 6, .1], [6, 6, .16], [12, 6, .23], [18, 6, .32]].forEach(([y, hh, a]) => { r += `<rect x="0" y="${y}" width="${W}" height="${hh}" class="sp-c" fill-opacity="${a}"/>`; });
  if (o.rayons) for (let i = 0; i < 16; i += 2) {
    const a = i * Math.PI / 8;
    for (let d = 7; d < 46; d++) { const x = Math.round(cx + Math.cos(a) * d), y = Math.round(cy + Math.sin(a) * d * .62); if (x >= 0 && x < W && y >= 0 && y < H) r += `<rect x="${x}" y="${y}" width="1" height="1" class="sp-c" fill-opacity=".35"/>`; }
  }
  [[17, 10, .16], [13, 8, .24], [9, 6, .34]].forEach(([sx, sy, a]) => {
    for (let y = -sy; y <= sy; y++) { const hw = Math.round(Math.sqrt(Math.max(0, 1 - (y / (sy + .5)) ** 2)) * sx); if (hw) r += `<rect x="${cx - hw}" y="${cy + y}" width="${hw * 2}" height="1" class="sp-c" fill-opacity="${a}"/>`; }
  });
  POINTS.forEach(([x, y], i) => { r += i % 3 ? `<rect x="${x}" y="${y}" width="1" height="1" class="sp-e" fill-opacity=".7"/>` : `<path d="M${x} ${y - 1}h1v1h1v1h-1v1h-1v-1h-1v-1h1z" class="sp-e" fill-opacity=".9"/>`; });
  r += `<rect x="${cx - 6}" y="20" width="12" height="1" class="sp-o" fill-opacity=".35"/><rect x="${cx - 4}" y="21" width="8" height="1" class="sp-o" fill-opacity=".25"/>`;
  const art = typeof icone === "string" ? (pxRk(icone, 64) || pxRk("etoile", 64)) : (icone && icone.html) || "";
  return h("div", { class: "scene-pixel" + (o.rayons ? " scene-pixel--fete" : ""), style: `--sc:${couleur}`, "aria-hidden": "true" },
    h("span", { class: "scene-pixel__fond", html: `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">${r}</svg>` }),
    h("span", { class: "scene-pixel__ic", html: art }),
    o.sous ? h("span", { class: "scene-pixel__sous" }, o.sous) : null);
}

/** État vide illustré : une icône pixel, puis la phrase courte. */
export const vide = (texte, icone = "etoile") => h("div", { class: "vide vide--illustre" }, h("span", { class: "vide__ic", html: pxRk(icone, 48) || "" }), h("p", {}, texte));

/** Icône pixel posée sur un carré plat de couleur (la couleur dit la catégorie, rien d'autre). */
export const tuileIcone = (icone, couleur = "var(--action)", taille = 32) =>
  h("span", { class: "tuile-ic", style: `--tc:${couleur};--tt:${taille}px`, html: pxRk(icone, taille) || pxRk("etoile", taille) || "" });

/** Visage par défaut d'un proche sans avatar : toujours le même pour un même prénom. */
export function avatarParDefaut(nom) {
  let t = 7; for (const c of String(nom)) t = (t * 31 + c.charCodeAt(0)) >>> 0;
  return { skin: t % 8, hair: (t >> 3) % 27, hairC: (t >> 8) % 12, eyes: (t >> 12) % 5, mouth: (t >> 15) % 5, beard: 0, eyeC: (t >> 18) % 6 };
}

/** Icône d'un message, devinée d'après son texte (comme l'ancienne version). */
const MSG_IC = [[/coffre/i, "coffre"], [/cadeau/i, "cadeau"], [/niveau/i, "medaille"], [/badge/i, "medaille"], [/recette|déjeuner|dîner|assiette|repas|goûter|petit-déj/i, "assiette"], [/calendrier|événement/i, "calendrier"],
  [/supprim|retir|écart|effac/i, "poubelle"], [/nouvelles|lien|proche/i, "coeur"], [/nuit|bonne nuit/i, "lune"], [/routine/i, "soleil"], [/XP/, "etoile"], [/noté|fait|ajouté|enregistr/i, "check"]];
export const iconeMessage = t => (MSG_IC.find(([re]) => re.test(t)) || [, "etoile"])[1];
