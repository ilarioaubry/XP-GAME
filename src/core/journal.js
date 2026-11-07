// Journal d'erreurs : remplace les catch(e){} vides de l'ancienne version.
// Toute erreur attrapée passe par erreur(ou, e). Les 200 dernières lignes sont gardées sur le téléphone
// (clé « xp-journal », à part de la sauvegarde) et se lisent dans Moi > Bilan > Données.

const CLE = "xp-journal";
const MAX = 200;
let lignes = [];
let ecouteurs = [];

try {
  const brut = localStorage.getItem(CLE);
  if (brut) lignes = JSON.parse(brut);
  if (!Array.isArray(lignes)) lignes = [];
} catch (e) {
  lignes = [{ t: Date.now(), n: "alerte", ou: "journal", m: "journal illisible, remis à zéro : " + e }];
}

function ecrire() {
  try {
    localStorage.setItem(CLE, JSON.stringify(lignes));
  } catch (e) {
    // le stockage est plein ou bloqué : le journal reste en mémoire pour cette session
    if (!lignes.some(l => l.ou === "journal:stockage")) lignes.push({ t: Date.now(), n: "alerte", ou: "journal:stockage", m: String(e) });
  }
}

/** Ajoute une ligne. niveau : "erreur" | "alerte" | "info". */
export function noter(niveau, ou, quoi, extra) {
  const m = quoi instanceof Error ? quoi.message : String(quoi);
  const pile = quoi instanceof Error && quoi.stack ? quoi.stack.split("\n").slice(0, 3).join(" | ") : undefined;
  const l = { t: Date.now(), n: niveau, ou, m };
  if (pile) l.p = pile;
  if (extra !== undefined) l.x = extra;
  lignes.push(l);
  if (lignes.length > MAX) lignes = lignes.slice(-MAX);
  ecrire();
  if (niveau === "erreur") console.error("[XP]", ou, quoi, extra ?? "");
  else if (niveau === "alerte") console.warn("[XP]", ou, m, extra ?? "");
  ecouteurs.forEach(f => { try { f(l); } catch (e) { console.error("[XP] écouteur du journal", e); } });
  return l;
}

export const erreur = (ou, e, extra) => noter("erreur", ou, e, extra);
export const alerte = (ou, m, extra) => noter("alerte", ou, m, extra);
export const info = (ou, m, extra) => noter("info", ou, m, extra);

/** Exécute fn ; en cas d'erreur, la note et renvoie secours. */
export function proteger(ou, fn, secours) {
  try {
    return fn();
  } catch (e) {
    erreur(ou, e);
    return secours;
  }
}

export const lire = () => lignes.slice();
export const nbErreurs = () => lignes.filter(l => l.n === "erreur").length;
export function vider() { lignes = []; ecrire(); }
export function ecouter(f) { ecouteurs.push(f); return () => { ecouteurs = ecouteurs.filter(x => x !== f); }; }

/** Erreurs non attrapées de toute l'appli. */
export function installer() {
  addEventListener("error", e => erreur("page", e.error || e.message, e.filename ? e.filename + ":" + e.lineno : undefined));
  addEventListener("unhandledrejection", e => erreur("promesse", e.reason instanceof Error ? e.reason : String(e.reason)));
}
