// Sauvegarde : la même que l'ancienne version, au même endroit, au même format.
// - Clé localStorage « carnet-quetes », JSON de la forme écrite par snapshot() (v: 28, données dans S.g).
// - Rien n'est jamais retiré : toute clé lue (même inconnue de la V2) est réécrite telle quelle.
// - Avant la toute première écriture de la V2, la sauvegarde d'origine est copiée sous « carnet-quetes:avant-v2 ».
// - Une sauvegarde illisible ou d'un format inconnu n'est JAMAIS écrasée : l'appli passe en lecture seule.

import {
  STARTER, STARTER_WISHES, FRIENDS, FAMILY, MUSIC,
} from "../donnees/brut/donnees-base.js";
import { erreur, alerte, info } from "./journal.js";
import { emit } from "./events.js";

export const CLE = "carnet-quetes";
export const CLE_AVANT = "carnet-quetes:avant-v2";
export const FORMAT = 28; // S.v écrit par l'ancienne version (figé)

// Ordre des clés écrit par l'ancienne snapshot() : on le garde pour que les fichiers se comparent ligne à ligne.
const ORDRE = ["xp", "actions", "log", "days", "perLevel", "qPrice", "xpCap", "rankBonus", "wishes", "spent", "stats", "name", "specials",
  "friends", "friendDone", "family", "familyDone", "musicDone", "snd", "bonds", "bondsLast", "profiles", "myPic", "dayLimit", "streakBonus",
  "weekly", "skills", "epics", "title", "frame", "bdDone", "theme", "daily", "seeded", "extraMoney", "dayBonus", "badges", "badgesInit", "g", "v"];
// Clés présentes en mémoire mais jamais écrites par l'ancienne version (S.music vient de S.g.music).
const MEMOIRE_SEULE = new Set(["music"]);

const copie = x => JSON.parse(JSON.stringify(x));

/** S.g neuf, comme newG(). */
export const gNeuf = () => ({ nb: [], chests: 1, chestLvl: null, opened: 0, ol: [], gear: [], eq: {}, boost: 0, rt: [], hist: {}, mood: {}, sleep: {}, rel: {} });

/** État d'un premier lancement, comme l'état initial de l'ancienne version. */
export function etatNeuf() {
  return {
    xp: 0, actions: copie(STARTER), log: [], days: [], perLevel: 1, rankBonus: 5, wishes: copie(STARTER_WISHES), spent: [], stats: {}, bonds: {},
    bondsLast: {}, profiles: {}, myPic: "", name: "", specials: [], friends: FRIENDS.slice(), friendDone: [], family: FAMILY.slice(), familyDone: [],
    music: MUSIC.slice(), musicDone: [], snd: {}, g: gNeuf(), qPrice: 1, xpCap: 300, dayLimit: 3, streakBonus: {}, weekly: { wk: "", done: [] },
    skills: [], epics: [], title: "", frame: "", bdDone: {}, theme: "auto", daily: { tasks: null, day: "", c: {}, wAdded: false, bonusDay: "" },
    seeded: [], badges: {}, badgesInit: false, extraMoney: 0, dayBonus: { xp: 30, eur: 1 },
  };
}

/** Complète S.g comme normG() : valeurs par défaut sous les valeurs lues, types garantis. */
function normG(g) {
  const o = { ...gNeuf(), ...(g && typeof g === "object" ? g : {}) };
  ["ol", "gear", "rt"].forEach(k => { if (!Array.isArray(o[k])) o[k] = []; });
  ["eq", "hist", "mood", "sleep", "rel"].forEach(k => { if (!o[k] || typeof o[k] !== "object") o[k] = {}; });
  return o;
}

/**
 * Données lues → état en mémoire. Seules les clés ABSENTES reçoivent une valeur par défaut :
 * tout ce qui est lu est gardé tel quel (y compris les clés que la V2 ne connaît pas).
 */
export function normaliser(d) {
  const lu = copie(d);
  const S = { ...etatNeuf(), ...lu };
  S.g = normG(lu.g);
  S.music = Array.isArray(S.g.music) ? S.g.music.slice() : MUSIC.slice();
  return S;
}

/** État en mémoire → données écrites (même forme que snapshot(), plus les clés inconnues gardées). */
export function instantane(S) {
  const o = {};
  for (const k of ORDRE) if (k !== "v") o[k] = S[k];
  if (Array.isArray(o.spent)) o.spent = o.spent.slice(-300);
  for (const k of Object.keys(S)) if (!(k in o) && k !== "v" && !MEMOIRE_SEULE.has(k)) o[k] = S[k];
  o.v = FORMAT;
  return o;
}

// ---- lecture

let brutOrigine = null; // texte lu au démarrage, gardé pour la copie « avant-v2 »
let lectureSeule = false;

export const estEnLectureSeule = () => lectureSeule;

/**
 * Lit la sauvegarde du téléphone.
 * Renvoie { S, etat } avec etat = "neuve" | "lue" | "illisible" | "ancienne" | "future".
 */
export function lire() {
  let brut = null;
  try {
    brut = localStorage.getItem(CLE);
  } catch (e) {
    erreur("sauvegarde:lire", e);
    lectureSeule = true;
    return { S: etatNeuf(), etat: "illisible" };
  }
  if (!brut) return { S: etatNeuf(), etat: "neuve" };
  brutOrigine = brut;
  let d;
  try {
    d = JSON.parse(brut);
  } catch (e) {
    erreur("sauvegarde:lire", e, { debut: brut.slice(0, 80) });
    lectureSeule = true;
    return { S: etatNeuf(), etat: "illisible" };
  }
  return depuisDonnees(d);
}

function depuisDonnees(d) {
  if (!d || typeof d !== "object") { lectureSeule = true; return { S: etatNeuf(), etat: "illisible" }; }
  const v = +d.v || 1;
  if (v < FORMAT) {
    // Format d'avant le 28 : seule l'ancienne version sait le convertir (migrateActions, loadCore).
    alerte("sauvegarde:lire", "format " + v + " : à ouvrir d'abord dans l'ancienne version");
    lectureSeule = true;
    return { S: normaliser(d), etat: "ancienne" };
  }
  if (v > FORMAT) {
    alerte("sauvegarde:lire", "format " + v + " inconnu");
    lectureSeule = true;
    return { S: normaliser(d), etat: "future" };
  }
  return { S: normaliser(d), etat: "lue" };
}

// ---- écriture

let minuteur = null;
let enAttente = null;

export function ecrireMaintenant(S) {
  clearTimeout(minuteur);
  minuteur = null;
  const s = S || enAttente;
  enAttente = null;
  if (!s) return false;
  if (lectureSeule) { alerte("sauvegarde:ecrire", "lecture seule : rien n'est écrit"); return false; }
  try {
    if (brutOrigine && localStorage.getItem(CLE_AVANT) === null) {
      try {
        localStorage.setItem(CLE_AVANT, brutOrigine);
        info("sauvegarde", "copie de la sauvegarde d'origine gardée sous " + CLE_AVANT);
      } catch (e) {
        alerte("sauvegarde:copie", "copie d'origine impossible (stockage plein ?) : " + e);
      }
    }
    localStorage.setItem(CLE, JSON.stringify(instantane(s)));
    emit("sauvegarde:ecrite");
    return true;
  } catch (e) {
    erreur("sauvegarde:ecrire", e);
    emit("sauvegarde:echec", { message: String(e) });
    return false;
  }
}

/** Écriture groupée : plusieurs changements rapprochés = une seule écriture (400 ms, comme avant). */
export function planifier(S) {
  enAttente = S;
  clearTimeout(minuteur);
  minuteur = setTimeout(() => ecrireMaintenant(), 400);
}

// On écrit tout de suite quand l'appli passe en arrière-plan (l'iPhone peut la fermer sans prévenir).
addEventListener("pagehide", () => { if (enAttente) ecrireMaintenant(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && enAttente) ecrireMaintenant(); });

// ---- export / import (fichier)

export const exporter = S => JSON.stringify(instantane(S));

/** Texte d'un fichier exporté → état. Lève une erreur si le fichier n'est pas une sauvegarde. */
export function importer(texte) {
  const d = JSON.parse(texte);
  if (!d || typeof d !== "object" || !("g" in d) || !("xp" in d)) throw new Error("Ce fichier n'est pas une sauvegarde d'XP.");
  const r = depuisDonnees(d);
  if (r.etat !== "lue") throw new Error("Format de sauvegarde " + d.v + " : à ouvrir dans l'ancienne version.");
  lectureSeule = false;
  return r.S;
}
