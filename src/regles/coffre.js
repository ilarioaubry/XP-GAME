// Jauge du coffre : 5 crans par jour. 1 repas, 1 routine ou 1 quête spéciale = +1 cran ; 5/5 = un coffre garanti.
// Nouvelle clé S.g.coffre = { jour, n, src: [ids déjà comptés], ok: coffre donné }. L'ancien coffre S.g.chests reste tel quel.

import { modifier, etat } from "../core/state.js";
import { emit } from "../core/events.js";
import { cleJour } from "../core/temps.js";
import { GEAR } from "../donnees/brut/equipement.js";
import { RAR, RARE_TITLES } from "../donnees/brut/icones-unifiees.js";
import { gagner } from "./xp.js";

export const CRANS = 5;

function courant(S) {
  const j = cleJour(S);
  let c = S.g.coffre;
  if (!c || c.jour !== j) c = S.g.coffre = { jour: j, n: 0, src: [], ok: false };
  return c;
}

export const crans = (S = etat()) => (S.g.coffre && S.g.coffre.jour === cleJour(S) ? S.g.coffre.n : 0);

/** Compte un cran pour une source (une même source ne compte qu'une fois par jour). */
export function ajouterCran(source) {
  let r = { n: crans(), nouveau: false, pret: false };
  modifier("coffre", S => {
    const c = courant(S);
    if (c.n >= CRANS || c.src.includes(source)) { r.n = c.n; return; }
    c.src.push(source);
    c.n++;
    r = { n: c.n, nouveau: true, pret: false };
    if (c.n >= CRANS && !c.ok) {
      c.ok = true;
      S.g.chests = (+S.g.chests || 0) + 1; // le coffre arrive dans la file des coffres à ouvrir
      r.pret = true;
    }
  });
  if (r.nouveau) emit("coffre:cran", { n: r.n, source });
  if (r.pret) emit("coffre:pret", {});
  return r;
}

/** Un coffre par niveau gagné (règle de l'ancienne version, même clé S.g.chestLvl). Renvoie le nombre de coffres ajoutés. */
export function coffresDeNiveau(l) {
  let n = 0;
  modifier("coffre-niveau", S => {
    if (S.g.chestLvl == null) { S.g.chestLvl = l; return; }
    if (l > S.g.chestLvl) { n = l - S.g.chestLvl; S.g.chests = (+S.g.chests || 0) + n; S.g.chestLvl = l; }
  });
  return n;
}

export const coffresAOuvrir = (S = etat()) => (+S.g.chests || 0) + (+S.g.bchests || 0);

// ---- Ouvrir un coffre (règle de l'ancienne version) : un objet pas encore obtenu ou un titre rare, la rareté tirée au sort
// (coffre du jour 55/30/12/3 %, coffre spécial : épique ou légendaire). Les fonds, retirés, ne sortent plus.
// Mêmes clés : S.g.chests / bchests (file), S.g.opened, S.g.ol (historique), S.g.gear, S.g.rt.
export const RARETES = RAR.map(([nom]) => nom);

export function ouvrirUnCoffre() {
  let res = null;
  modifier("coffre-ouvert", S => {
    const G = S.g;
    const special = !(+G.chests) && +G.bchests > 0;
    if (special) G.bchests--; else if (+G.chests > 0) G.chests--; else return;
    G.opened = (+G.opened || 0) + 1;
    const a = new Set(G.gear || []), rt = G.rt || [];
    const pool = Object.values(GEAR).filter(x => !x.ex && x.s !== "fond" && !a.has(x.id)).map(x => ({ k: "gear", it: x, r: x.r | 0 }))
      .concat(RARE_TITLES.filter(t => !rt.includes(t)).map(t => ({ k: "title", t, r: 2 })));
    if (!pool.length) { res = { k: "xp", r: 3, nom: "+30 XP", sous: "Ta collection est complète !", special }; }
    else {
      const W = special ? [0, 0, 75, 25] : [55, 30, 12, 3];
      let p = Math.random() * W.reduce((x, y) => x + y, 0), rr = 0;
      for (let i = 0; i < 4; i++) if ((p -= W[i]) <= 0) { rr = i; break; }
      const ordre = special ? [rr, rr === 3 ? 2 : 3, 1, 0] : [rr, rr - 1, rr - 2, rr - 3, rr + 1, rr + 2, rr + 3].filter(x => x >= 0 && x <= 3);
      let cand = [];
      for (const r of ordre) { cand = pool.filter(x => x.r === r); if (cand.length) break; }
      const c = cand[Math.floor(Math.random() * cand.length)];
      if (c.k === "title") { (G.rt ||= []).push(c.t); res = { k: "title", r: 2, nom: "« " + c.t + " »", sous: "Nouveau titre", special }; }
      else { (G.gear ||= []).push(c.it.id); res = { k: "gear", it: c.it, r: c.it.r | 0, nom: c.it.n, sous: "Nouvel objet", special }; }
    }
    (G.ol ||= []).push({ t: Date.now(), k: res.k });
    if (G.ol.length > 200) G.ol = G.ol.slice(-200);
  });
  if (res && res.k === "xp") gagner({ id: "coffre", nom: "Coffre : collection complète", cat: "perso", xp: 30 });
  if (res) emit("coffre:ouvert", { k: res.k, r: res.r });
  return res;
}
