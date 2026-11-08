// Gagner de l'XP : un seul endroit. Écrit dans S.xp, S.stats, S.log, S.days (formes de l'ancienne sauvegarde).
// Les 4 Angles sont un regroupement à l'affichage des catégories d'XP : rien n'est migré.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour, niveau } from "../core/temps.js";
import { ANGLES } from "../donnees/brut/repas-barre-de-vie.js";

/** Angles : [{ id, nom, couleur, cats, icone }] à partir du catalogue d'origine. */
export const LES_ANGLES = ANGLES.map(([nom, couleur, cats, icone]) => ({
  id: nom.toLowerCase(), nom, couleur, cats, icone,
}));

export const angleDe = cat => (LES_ANGLES.find(a => a.cats.includes(cat)) || LES_ANGLES[1]).id;

/** Ajoute de l'XP. Renvoie le niveau atteint si on vient de monter, sinon 0. */
export function gagner({ id, nom, cat, xp, extra }) {
  let monte = 0;
  modifier("xp:" + id, S => {
    const avant = niveau(S.xp || 0).l;
    S.xp = (S.xp || 0) + xp;
    S.stats[cat] = (+S.stats[cat] || 0) + xp;
    S.log.push({ t: Date.now(), a: id, name: nom, cat, xp, ...(extra || {}) });
    const j = cleJour(S);
    if (!S.days.includes(j)) S.days.push(j);
    const apres = niveau(S.xp).l;
    if (apres > avant) monte = apres;
  });
  emit("xp:gagnee", { id, nom, cat, xp });
  if (monte) emit("niveau:monte", { niveau: monte });
  return monte;
}

/** XP du jour par angle (lu dans le journal). */
export function xpDuJour(S = etat()) {
  const j = cleJour(S);
  const r = Object.fromEntries(LES_ANGLES.map(a => [a.id, 0]));
  let total = 0;
  for (const l of S.log) {
    if (cleJour(S, l.t) !== j) continue;
    r[angleDe(l.cat)] += l.xp || 0;
    total += l.xp || 0;
  }
  return { parAngle: r, total };
}

/** Une action identifiée a-t-elle déjà été validée aujourd'hui ? (le « fait » se lit dans le journal) */
export function faitAujourdhui(id, S = etat()) {
  const j = cleJour(S);
  return S.log.some(l => l.a === id && cleJour(S, l.t) === j);
}
