// Scène du haut d'Aujourd'hui et de Moi : ciel selon l'heure, colline, avatar, Aura au premier plan.
// L'avatar vient du moteur Pixel Clair (src/avatar) : coiffures, vêtements, accessoires, objets équipés.

import { h } from "../ui/dom.js";
import { heureJournee } from "../core/temps.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { avatarSvg } from "../avatar/rendu.js";
import { ouvrirPersonnage } from "./personnage.js";
import { dire } from "../ui/messages.js";

/** Moment de la journée → clé de ciel du catalogue d'origine. */
export function momentCiel(S) {
  const t = heureJournee(S);
  return t < 5 ? "nuit" : t < 8 ? "aube" : t < 12 ? "matin" : t < 17.5 ? "aprem" : t < 20.5 ? "crep" : "nuit";
}

export const avatar = S => avatarSvg(S, 4);

export function aura(S) {
  const id = S.g && S.g.eq && S.g.eq.aura;
  const a = id && Object.values(GEAR).find(g => g.s === "aura" && g.id === id);
  if (!a) return null;
  return h("div", { class: "scene__aura", html: `<svg viewBox="0 0 120 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${a.svg}</svg>` });
}

// ---- Décor partagé par Aujourd'hui et Moi (maquette Focus+) : ciel en bandes selon le moment, astre (soleil qui suit l'heure,
// vraie phase de lune la nuit), étoiles, nuages, touche de saison, colline pixel, aura, personnage. Repris de l'ancienne
// « ambiance du moment », redessiné en Cobalt. Rien ne bouge tout seul ; toucher l'astre dit le moment et la saison.
const COLLINE = "M25 0h10v1h-10z M21 1h18v1h-18z M19 2h22v1h-22z M16 3h28v1h-28z M15 4h30v1h-30z M13 5h34v1h-34z M12 6h36v1h-36z M11 7h38v1h-38z M10 8h40v1h-40z M9 9h42v1h-42z M8 10h44v1h-44z M7 11h46v1h-46z M6 12h48v1h-48z M5 13h50v2h-50z M4 15h52v2h-52z M3 17h54v2h-54z M2 19h56v3h-56z M1 22h58v8h-58z";

/** Grille de lettres → SVG pixel ; chaque lettre devient une classe de couleur (lue dans tokens.css). */
function pixels(lignes, classes) {
  let r = "";
  lignes.forEach((l, y) => {
    let x = 0;
    while (x < l.length) {
      const ch = l[x];
      if (!classes[ch]) { x++; continue; }
      let w = 1; while (l[x + w] === ch) w++;
      r += `<rect class="${classes[ch]}" x="${x}" y="${y}" width="${w}" height="1.02"/>`;
      x += w;
    }
  });
  return `<svg viewBox="0 0 ${lignes[0].length} ${lignes.length}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
function soleil(chaud) {
  const L = [];
  for (let y = 0; y < 12; y++) { let l = ""; for (let x = 0; x < 12; x++) { const d = (x - 5.5) ** 2 + (y - 5.5) ** 2; l += d <= 31 ? (d <= 9 && x < 6 && y < 6 ? "h" : "a") : "."; } L.push(l); }
  return pixels(L, chaud ? { a: "k-chaud", h: "k-chaud-clair" } : { a: "k-soleil", h: "k-soleil-clair" });
}
/** Phase de la lune (0 = nouvelle, 0,5 = pleine), comme l'ancienne version. */
export function phaseLune(t = Date.now()) { const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14); return (((t - ref) / 864e5) % syn + syn) % syn / syn; }
export function nomLune(f) { return f < .03 || f > .97 ? "Nouvelle lune" : f < .22 ? "Premier croissant" : f < .28 ? "Premier quartier" : f < .47 ? "Lune gibbeuse" : f < .53 ? "Pleine lune" : f < .72 ? "Lune gibbeuse" : f < .78 ? "Dernier quartier" : "Dernier croissant"; }
function lune(f) {
  const L = [], k = Math.cos(2 * Math.PI * f);
  for (let y = 0; y < 13; y++) { let l = ""; for (let x = 0; x < 13; x++) {
    const nx = (x - 6) / 6.3, ny = (y - 6) / 6.3;
    if (nx * nx + ny * ny > 1) { l += "."; continue; }
    const w = Math.sqrt(1 - ny * ny), eclairee = f < .5 ? nx > k * w : nx < -k * w;
    l += eclairee ? (nx < -.25 && ny < -.25 ? "h" : "a") : "d";
  } L.push(l); }
  return pixels(L, { a: "k-lune", h: "k-lune-clair", d: "k-lune-ombre" });
}
const NUAGE = pixels(["....wwww........", "..wwwwwwww.ww...", ".wwwwwwwwwwwwww.", "wwwwwwwwwwwwwwww", ".ssssssssssssss."], { w: "k-nuage", s: "k-nuage-ombre" });
export function saison(d = new Date()) { const v = (d.getMonth() + 1) * 100 + d.getDate(); return v >= 1221 || v < 320 ? "hiver" : v < 621 ? "printemps" : v < 922 ? "ete" : "automne"; }
const NOM_SAISON = { hiver: "Hiver", printemps: "Printemps", ete: "Été", automne: "Automne" };
const NOM_MOMENT = { aube: "Aube", matin: "Matin", aprem: "Après-midi", crep: "Crépuscule", nuit: "Nuit" };

function ciel(S) {
  const t = heureJournee(S), m = momentCiel(S), nuit = m === "nuit", s = saison();
  const f = phaseLune();
  // le soleil traverse la scène de 7 h à 20 h (le matin à gauche, l'après-midi à droite, plus haut vers midi), sans passer
  // derrière le personnage ; la lune reste en haut à droite
  const p = Math.min(1, Math.max(0, (t - 7) / 13));
  const ax = nuit ? 72 : p < .5 ? 8 + p * 56 : 64 + (p - .5) * 56, ay = nuit ? 14 : 36 - Math.sin(p * Math.PI) * 24;
  const etoiles = m === "nuit" ? 22 : m === "aube" || m === "crep" ? 7 : 0;
  const motif = { automne: "feuille", hiver: "neige", printemps: "petale" }[s];
  const dire_ = () => dire(`${NOM_MOMENT[m]} · ${NOM_SAISON[s]}${nuit ? " · " + nomLune(f) : ""}`);
  return [
    etoiles ? h("div", { class: "ciel__etoiles", "aria-hidden": "true" }, Array.from({ length: etoiles }, (_, i) =>
      h("i", { style: `left:${(i * 37 + 11) % 100}%;top:${(i * 53 + 7) % (nuit ? 62 : 30)}%` }))) : null,
    !nuit ? h("div", { class: "ciel__nuages", "aria-hidden": "true" },
      h("span", { class: "ciel__nuage", style: "left:24%;top:30%", html: NUAGE }), h("span", { class: "ciel__nuage ciel__nuage--petit", style: "left:76%;top:46%", html: NUAGE })) : null,
    h("button", { class: "ciel__astre" + (nuit ? " ciel__astre--lune" : ""), style: `left:${ax}%;top:${ay}%`, "aria-label": nuit ? nomLune(f) : "Soleil", title: nuit ? nomLune(f) : NOM_MOMENT[m],
      html: nuit ? lune(f) : soleil(m === "aube" || m === "crep"), onclick: dire_ }),
    motif ? h("div", { class: "ciel__saison", "aria-hidden": "true" }, Array.from({ length: 9 }, (_, i) =>
      h("i", { class: "ciel__" + motif, style: `left:${(i * 41 + 7) % 100}%;top:${48 + (i * 29) % 40}%` }))) : null,
  ];
}

export function decor(S, ...dessus) {
  const colline = `<svg viewBox="0 0 60 30" shape-rendering="crispEdges" aria-hidden="true"><path class="c-rose" d="${COLLINE}"/><path class="c-orange" transform="translate(0 3)" d="${COLLINE}"/><path class="c-nuit" transform="translate(0 12)" d="${COLLINE}"/></svg>`;
  return h("div", { class: "hero", "data-moment": momentCiel(S), "aria-label": "Mon personnage" },
    ciel(S),
    h("div", { class: "hero__colline", html: colline }),
    aura(S),
    h("button", { class: "hero__perso", "aria-label": "Modifier mon personnage", title: "Modifier mon personnage", html: avatar(S), onclick: () => ouvrirPersonnage() }),
    dessus);
}
