// Moi > Chez moi, d'après la maquette : Ma maison, Armoire, Titres, Badges, puis Auras. (Fonds et panoplies : retirés.)
// Règle des collections : on montre ce qui est obtenu, puis UNE tuile « +N » pour le reste (jamais la liste du verrouillé).

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { jouer } from "../core/sons.js";
import { etat } from "../core/state.js";
import { HM_ROOMS } from "../donnees/brut/chez-moi.js";
import { badgeSvg } from "../avatar/rendu.js";
import * as M from "../regles/moi.js";

const PORTES = ["tete", "haut", "yeux", "bijou", "main"];
const etoiles = r => h("span", { class: "etoiles", "aria-label": `Rareté ${r + 1} sur 4`, html: pxUi("star", 12).repeat(r + 1) });
const plus = n => n > 0 ? h("div", { class: "ui-tuile ui-tuile--plus", "aria-label": `Encore ${n} à trouver` }, h("span", { class: "t-carte" }, "+" + n)) : null;
const tuile = (contenu, nom, actif, fn, extra) => h("button", { class: "ui-tuile", "aria-pressed": String(!!actif), onclick: fn }, contenu, h("span", { class: "t-info" }, nom), extra);
const section = (titre, droite, ...c) => h("section", { class: "ui-section", style: "--sc:var(--c-orange)" },
  h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre), droite ? h("span", { class: "ui-entete__droite" }, droite) : null), c);
const apercu = o => o.svg ? h("span", { class: "tuile__apercu", html: `<svg viewBox="0 0 120 140" width="48" height="56" aria-hidden="true">${o.svg}</svg>` }) : h("span", { html: pxRk("etoile", 48) || "" });

function objets(slot, S) {
  const liste = M.objetsDe(slot, S), a = liste.filter(o => o.a), eq = M.equipe(slot, S);
  return [a.map(o => tuile(apercu(o), o.n, eq === o.id, () => { M.equiper(slot, o.id); jouer("blip"); }, etoiles(o.r || 0))), liste.length - a.length];
}

function maison() {
  return section("Ma maison", `${HM_ROOMS.length} pièces`,
    h("div", { class: "pieces" }, HM_ROOMS.map(([id, nom]) => h("div", { class: "piece" }, h("span", { html: pxRk(id, 32) || pxRk("maisonp", 32) || "" }), h("span", { class: "piece__nom" }, nom)))));
}

function armoire(S) {
  let obtenus = [], reste = 0, total = 0;
  for (const slot of PORTES) {
    const liste = M.objetsDe(slot, S), a = liste.filter(o => o.a), eq = M.equipe(slot, S);
    total += liste.length; reste += liste.length - a.length;
    obtenus = obtenus.concat(a.map(o => tuile(apercu(o), o.n, eq === o.id, () => { M.equiper(slot, o.id); jouer("blip"); }, etoiles(o.r || 0))));
  }
  return section("Armoire", `${total - reste} sur ${total}`,
    h("div", { class: "ui-tuiles" }, obtenus, plus(reste)), obtenus.length ? null : h("p", { class: "vide" }, "Rien d'obtenu ici pour l'instant."));
}

function titresVue(S) {
  const t = M.titres(S), porte = M.titrePorte(S);
  return section("Titres", `${t.obtenus.length} sur ${t.total}`,
    h("div", { class: "plaques" }, t.obtenus.map(x => h("button", { class: "plaque", "aria-pressed": String(porte === x.n), onclick: () => { M.porterTitre(x.n); jouer("blip"); } }, x.n)), plus(t.total - t.obtenus.length)));
}

function badgesVue(S) {
  const liste = M.badges(S), a = liste.filter(b => b.a);
  return section("Badges", `${a.length} sur ${liste.length}`,
    h("div", { class: "ui-tuiles" }, a.map(b => h("div", { class: "ui-tuile ui-tuile--badge", title: b.desc },
      h("span", { html: badgeSvg(b, false, 48) }), h("span", { class: "t-info tuile__nom" }, b.name))), plus(liste.length - a.length)),
    a.length ? null : h("p", { class: "vide" }, "Aucun badge pour l'instant."));
}

function collection(slot, titre, S) {
  const [tuiles, reste] = objets(slot, S);
  return section(titre, `${tuiles.length} sur ${tuiles.length + reste}`, h("div", { class: "ui-tuiles" }, tuiles, plus(reste)), tuiles.length ? null : h("p", { class: "vide" }, "Rien d'obtenu ici pour l'instant."));
}

export function chezMoi() {
  const S = etat();
  return h("div", { class: "chez-moi" }, maison(), armoire(S), titresVue(S), badgesVue(S), collection("aura", "Auras", S));
}
