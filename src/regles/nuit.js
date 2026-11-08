// Bonne nuit : on note la journée (mot), l'humeur (1 à 5) et le sommeil. Clés d'origine : jr, mood, sleep.
import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { gagner, faitAujourdhui } from "./xp.js";

export const HUMEURS = [[1, "Dur"], [2, "Bof"], [3, "Moyen"], [4, "Bien"], [5, "Super"]];
export const humeur = (S = etat()) => (S.g.mood || {})[cleJour(S)] || 0;
export const sommeil = (S = etat()) => (S.g.sleep || {})[cleJour(S)] || null;
export const mot = (S = etat()) => (S.g.jr || {})[cleJour(S)] || "";

export function noterHumeur(v) {
  modifier("humeur", S => { (S.g.mood ||= {})[cleJour(S)] = v; });
  emit("humeur:notee", { v });
}
/** coucher et lever en heures décimales (23.5 = 23 h 30). */
export function noterSommeil(coucher, lever) {
  modifier("sommeil", S => { (S.g.sleep ||= {})[cleJour(S)] = { bed: coucher, wake: lever, h: Math.round((((lever - coucher) + 24) % 24) * 10) / 10 }; });
  emit("sommeil:note", { coucher, lever });
}
export function bonneNuit(texte) {
  modifier("bonne-nuit", S => { if (texte) (S.g.jr ||= {})[cleJour(S)] = texte.slice(0, 500); });
  if (!faitAujourdhui("bn")) gagner({ id: "bn", nom: "Bonne nuit", cat: "soi", xp: 5 });
  emit("bilan-soir:fait", {});
}
export const nuitFaite = () => faitAujourdhui("bn");
