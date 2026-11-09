// Assiette (reconstruite d'après l'ancienne version, en Cobalt) : une vraie assiette pixel 64×64 dont chaque côté
// (féculents, protéines, légumes) se remplit du centre vers le bord ; les aliments s'y posent et se retirent d'un toucher.
// Étape 1 : recettes en un toucher, aliments rangés par groupe et triés par usage, « Trier » pour masquer, « Ajouter » pour
// créer un aliment. Étape 2 : dessert, avec quoi, où, en cuisine. « Sauté » reste possible, sans pénalité.

import { h } from "../ui/dom.js";
import { pxRk, pxUi } from "../ui/pixel.js";
import { ouvrirPlein } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { pop } from "../ui/effets.js";
import { jouer } from "../core/sons.js";
import { PL_DES, PL_OU, PL_X, PL_C, PL_A, PL_TY, PL_GRP, PL_ICONS, PL_SIDES } from "../donnees/brut/assiette.js";
import * as R from "../regles/repas.js";

// ---- L'assiette pixel : rendue une fois par état (64×64 sur un canevas), nette et stable sur iPhone
const IMG = new Map();
const COUL = { bord: "#101443", rebord: ["#fff3e0", "#f6e6c8", "#e8d6b4", "#d9c59f"], creux: "#d9c59f", fond: "#fff3e0" };
function assietteImg(lv, type) {
  const cle = ["f", "p", "l"].map(k => Math.min(3, lv[k] || 0)).join("") + type;
  if (IMG.has(cle)) return IMG.get(cle);
  const N = 64, c = 31.5, RC = type && PL_TY[type] ? PL_TY[type][1] : null;
  const cv = document.createElement("canvas"); cv.width = cv.height = N;
  const g = cv.getContext("2d");
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = x - c, dy = y - c, d = Math.hypot(dx, dy);
    let col = "";
    if (d > 31.4) col = "";
    else if (d > 29.6) col = COUL.bord;
    else if (d > 25.8) { const l = (-dx - dy) / (d || 1); col = RC ? (l > .55 ? RC[0] : l > -.35 ? RC[1] : RC[2]) : l > .55 ? COUL.rebord[0] : l > -.35 ? COUL.rebord[(x + y) % 2] : l > -.75 ? COUL.rebord[2] : COUL.rebord[3]; }
    else if (d > 24.6) col = (-dx - dy) > 0 ? COUL.creux : COUL.rebord[1];
    else {
      const a = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      const trait = [30, 150, 270].some(b => d * Math.abs(Math.sin((a - b) * Math.PI / 180)) < .9 && Math.cos((a - b) * Math.PI / 180) > 0);
      if (trait) col = COUL.creux;
      else {
        const k = a >= 30 && a < 150 ? "l" : a >= 150 && a < 270 ? "f" : "p", cote = PL_SIDES.find(z => z[0] === k), n = Math.min(3, lv[k] || 0), rayon = 24.6 * n / 3;
        col = n && d <= rayon ? (d > rayon - 1.2 ? cote[3] : ((x * 7 + y * 3) % 11 === 0 ? COUL.fond : (x + 2 * y) % 5 === 0 || (2 * x + y) % 7 === 0 ? cote[3] : cote[2])) : COUL.fond;
      }
    }
    if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); }
  }
  const src = cv.toDataURL();
  IMG.set(cle, src);
  return src;
}
/** Où poser le n-ième aliment d'un côté (en % de l'assiette), comme l'ancienne version. */
function place(k, n) {
  const a = PL_A[k], P = [[7, 0], [9, -34], [9, 34], [4.2, 0]];
  return P.slice(0, n).map(([r, da]) => { const t = (a + da) * Math.PI / 180; return [(15.5 + r * Math.cos(t)) / 32 * 100, (15.5 + r * Math.sin(t)) / 32 * 100]; });
}

const NOM_COTE = Object.fromEntries(PL_SIDES.map(([k, n]) => [k, n]));

export function ouvrirAssiette(slot, options = {}) {
  const nomSlot = slot === "dej" ? "Déjeuner" : "Dîner";
  const idRepas = slot === "dej" ? "dej" : "diner";
  const avant = R.assietteDe(slot);
  const a = { f: [...(avant.f || [])], p: [...(avant.p || [])], l: [...(avant.l || [])], s: [...(avant.s || [])], x: { ...(avant.x || {}), ...(options.x || {}) }, ...(avant.w ? { w: avant.w } : {}), ...(avant.r ? { r: avant.r } : {}) };
  const corriger = R.repasFait(idRepas);
  const manque = R.manquaitAMidi(slot);
  let etape = 1, tri = false, ajout = "", ajoutIcone = "", ajoutNom = "", nommer = false, dernierPose = "";
  const corps = h("div", { class: "assiette" });
  const niveaux = () => ({ f: R.nbCote(a, "f"), p: R.nbCote(a, "p"), l: R.nbCote(a, "l") });

  const poser = (k, id) => { a[k].push(id); delete a.r; dernierPose = k + ":" + Math.min(a[k].length, 3); jouer("blip"); dessiner(); };
  const retirer = (k, i) => { a[k].splice(i, 1); delete a.r; dessiner(); };

  // -- l'assiette et ses aliments posés
  function plat() {
    const L = niveaux(), type = R.typeAssiette(a);
    const resume = PL_SIDES.map(([k, n]) => `${n} ${L[k]}`).join(", ");
    return h("div", { class: "plat", "aria-label": "Assiette : " + resume },
      h("img", { class: "plat__img px", src: assietteImg(L, type), width: "64", height: "64", alt: "" }),
      ["f", "p", "l"].flatMap(k => {
        const n = L[k], pos = place(k, Math.min(n, 3));
        const poses = a[k].slice(0, 3).map((id, i) => {
          const b = h("button", { class: "plat__aliment", style: `left:${pos[i][0]}%;top:${pos[i][1]}%`, "aria-label": "Retirer " + R.aliment(id).nom, html: pxRk(R.aliment(id).icone, 32) || pxRk("assiette", 32), onclick: () => retirer(k, i) });
          if (dernierPose === k + ":" + (i + 1)) requestAnimationFrame(() => pop(b));
          return b;
        });
        if (n > 3) { const p4 = place(k, 4)[3]; poses.push(h("b", { class: "plat__plus", style: `left:${p4[0]}%;top:${p4[1]}%` }, "+" + (n - 3))); }
        return poses;
      }));
  }

  // -- recettes en un toucher (+ enregistrer cette assiette)
  function lesRecettes() {
    const L = R.recettes().slice().sort((x, y) => (y.u || 0) - (x.u || 0));
    const vide = !R.nbCote(a, "f") && !R.nbCote(a, "p") && !R.nbCote(a, "l");
    return h("div", { class: "recettes", role: "group", "aria-label": "Mes recettes" },
      L.map(r => h("button", { class: "recette" + (a.r && a.r === r.id ? " actif" : ""), "aria-pressed": String(!!a.r && a.r === r.id), "aria-label": tri ? "Supprimer " + r.n : r.n,
        onclick: () => {
          if (tri) { const rendre = R.retirerRecette(r.id); dire(`Recette « ${r.n} » supprimée`, () => { rendre(); dessiner(); }); dessiner(); return; }
          for (const k of ["f", "p", "l", "s"]) a[k] = [...(r[k] || [])];
          a.r = r.id; jouer("blip"); dessiner();
        } },
        h("span", { class: "recette__icones", html: ["f", "p", "l"].flatMap(k => r[k] || []).slice(0, 3).map(id => pxRk(R.aliment(id).icone, 24) || "").join("") }),
        h("span", { class: "recette__nom" }, r.n),
        tri ? h("span", { class: "recette__x", html: pxUi("close", 12) }) : null)),
      tri ? null : h("button", { class: "recette recette--ajout", disabled: vide, onclick: () => { nommer = true; dessiner(); setTimeout(() => { const i = corps.querySelector(".assiette__nommer input"); if (i) i.focus(); }, 30); } },
        h("span", { class: "recette__icones", html: pxUi("plus", 24) }), h("span", { class: "recette__nom" }, "Enregistrer cette assiette")));
  }
  function nommerRecette() {
    if (!nommer) return null;
    const champ = h("input", { maxlength: "40", placeholder: "Nom de la recette", "aria-label": "Nom de la recette", autocomplete: "off" });
    const ok = () => { const n = champ.value.trim(); if (!n) { champ.focus(); return; } const r = R.enregistrerRecette(n, a); a.r = r.id; nommer = false; dire(`Recette « ${n} » enregistrée`); dessiner(); };
    champ.onkeydown = e => { if (e.key === "Enter") ok(); };
    return h("div", { class: "assiette__nommer champ" }, champ,
      h("div", { class: "assiette__deux" }, h("button", { class: "bouton", onclick: () => { nommer = false; dessiner(); } }, "Annuler"), h("button", { class: "bouton bouton--principal", onclick: ok }, "Enregistrer")));
  }

  // -- un côté : ses rangées (Pain, Classiques…) qui glissent, triées par usage
  function cote(k, nom, couleur) {
    const u = R.usages(), regime = R.regime(), H = R.caches();
    const liste = R.aliments(k).filter(f => !regime.has(f.id) && (tri || !H.includes(f.id))).map((f, i) => [f, i])
      .sort((x, y) => ((u[y[0].id] || 0) - (u[x[0].id] || 0)) || x[1] - y[1]).map(x => x[0]);
    const n = k === "s" ? a.s.length : R.nbCote(a, k), besoin = !tri && manque.includes(k) && !n;
    const puce = f => {
      const cache = H.includes(f.id), choisie = k === "s" && a.s.includes(f.id);
      return h("button", { class: "aliment" + (cache ? " aliment--cache" : "") + (choisie ? " actif" : ""), "aria-pressed": tri ? String(!cache) : k === "s" ? String(choisie) : null,
        onclick: () => {
          if (tri) { R.basculerCache(f.id); dessiner(); return; }
          if (k === "s") { const i = a.s.indexOf(f.id); if (i < 0) a.s.push(f.id); else a.s.splice(i, 1); delete a.r; jouer("blip"); dessiner(); return; }
          poser(k, f.id);
        } },
        h("span", { class: "aliment__ico", html: pxRk(f.icone, 48) || pxRk("assiette", 48) }), h("span", { class: "aliment__nom" }, f.nom));
    };
    const ajouter = h("button", { class: "aliment aliment--ajout", "aria-expanded": String(ajout === k), onclick: () => { ajout = ajout === k ? "" : k; ajoutIcone = ""; ajoutNom = ""; dessiner(); } },
      h("span", { class: "aliment__ico", html: pxUi("plus", 24) }), h("span", { class: "aliment__nom" }, "Ajouter"));
    const groupes = PL_GRP[k], dernier = groupes && groupes[groupes.length - 1][0];
    const rangees = groupes
      ? groupes.map(([g, l]) => { const L = liste.filter(f => (f.groupe || dernier) === g); if (!L.length && g !== dernier) return null;
        return h("div", { class: "rangee" }, h("p", { class: "rangee__nom" }, l), h("div", { class: "rangee__liste" }, L.map(puce), g === dernier ? ajouter : null)); })
      : h("div", { class: "rangee" }, h("div", { class: "rangee__liste" }, liste.map(puce), ajouter));
    return h("section", { class: "cote", style: `--cc:${couleur}` },
      h("h3", { class: "cote__titre" }, h("i"), nom, n ? h("span", { class: "ui-compteur" }, String(n)) : null, besoin ? h("span", { class: "ui-etiquette" }, "Il t'en manque aujourd'hui") : null),
      rangees, ajout === k ? creerAliment(k) : null);
  }
  function creerAliment(k) {
    const champ = h("input", { maxlength: "30", placeholder: k === "s" ? "Nom de la sauce" : "Nom de l'aliment", "aria-label": "Nom de l'aliment", value: ajoutNom, autocomplete: "off", oninput: e => { ajoutNom = e.target.value; } });
    const ok = () => {
      const n = ajoutNom.trim(); if (!n) { champ.focus(); return; }
      const f = R.ajouterAliment(k, n, ajoutIcone || (k === "s" ? "ketchup" : PL_SIDES.find(z => z[0] === k)[4][0][0]));
      if (!tri) { a[k].push(f.id); delete a.r; }
      ajout = ""; dire(`« ${n} » ajouté`); dessiner();
    };
    champ.onkeydown = e => { if (e.key === "Enter") ok(); };
    setTimeout(() => { if (!ajoutIcone) champ.focus(); }, 30);
    return h("div", { class: "nouvel champ" }, champ,
      h("div", { class: "nouvel__icones", role: "group", "aria-label": "Choisis une icône" }, PL_ICONS.map(ic => h("button", { class: "nouvel__icone" + (ic === ajoutIcone ? " actif" : ""), "aria-pressed": String(ic === ajoutIcone), "aria-label": "Icône " + ic,
        html: pxRk(ic, 32) || "", onclick: () => { ajoutIcone = ic; dessiner(); } }))),
      h("div", { class: "assiette__deux" }, h("button", { class: "bouton", onclick: () => { ajout = ""; dessiner(); } }, "Annuler"), h("button", { class: "bouton bouton--principal", onclick: ok }, "Ajouter")));
  }

  // -- étape 2 : dessert, avec, où, en cuisine
  function ouiNon(icone, nom, oui, basculer) {
    return h("button", { class: "oui-non", "aria-pressed": String(oui), onclick: () => { basculer(); jouer("blip"); dessiner(); } },
      h("span", { class: "oui-non__ico", html: pxRk(icone, 48) || "" }), h("span", { class: "oui-non__nom" }, nom), h("span", { class: "oui-non__etat" }, oui ? "Oui" : "Non"));
  }
  function suite() {
    const regime = R.regime();
    const bloc = (titre, couleur, lignes) => h("section", { class: "cote", style: `--cc:${couleur}` }, h("h3", { class: "cote__titre" }, h("i"), titre), h("div", { class: "oui-non__liste" }, lignes));
    const x = id => () => { if (a.x[id]) delete a.x[id]; else a.x[id] = 1; };
    return [
      bloc("Dessert", "var(--c-rose)", PL_DES.filter(z => !regime.has(z[0])).map(([id, n, ic]) => ouiNon(ic, n, !!a.x[id], x(id)))),
      bloc("Avec", "var(--angle-liens)", PL_X.filter(z => z[0] !== "yaourt" && !regime.has(z[0])).map(([id, n, ic]) => ouiNon(ic, n, !!a.x[id], x(id)))),
      bloc("Où", "var(--c-sable)", PL_OU.map(([id, n, ic]) => ouiNon(ic, n, a.w === id, () => { if (a.w === id) delete a.w; else a.w = id; }))),
      bloc("En cuisine", "var(--action)", PL_C.map(([id, n, ic]) => ouiNon(ic, n, !!a.x[id], x(id)))),
    ];
  }

  function dessiner() {
    const y = vue.vue.querySelector(".plein__corps")?.scrollTop || 0;
    const L = niveaux(), bonus = R.xpAssiette(a), type = R.typeAssiette(a), manqueNow = manque.filter(k => !L[k]);
    const indice = tri ? "Touche un aliment pour le masquer ou le remettre. Touche une recette pour la supprimer."
      : manqueNow.length ? `À midi il manquait : ${manqueNow.map(k => NOM_COTE[k].toLowerCase()).join(", ")}. C'est le moment d'en ajouter.`
      : corriger ? "Ajoute ou retire ce que tu as oublié." : "Touche ce que tu manges, ou une recette. Touche un aliment sur l'assiette pour le retirer.";
    corps.replaceChildren(...(etape === 1 ? [
      h("div", { class: "assiette__outils" }, h("button", { class: "bouton" + (tri ? " actif" : ""), "aria-pressed": String(tri), onclick: () => { tri = !tri; ajout = ""; nommer = false; dessiner(); } }, tri ? "Terminé" : "Trier")),
      lesRecettes(), nommerRecette(),
      plat(),
      type ? h("p", { class: "assiette__type" }, h("span", { class: "ui-etiquette" }, PL_TY[type][0])) : null,
      h("p", { class: "assiette__indice" }, indice),
      corriger || tri ? null : h("p", { class: "assiette__xp" }, bonus ? `+${bonus} XP d'assiette${bonus >= 10 ? " · complète !" : ""}` : "Chaque côté rempli rapporte de l'XP"),
      ...PL_SIDES.map(([k, nom, , c2]) => cote(k, nom, c2)),
      cote("s", "Sauces", "var(--c-sable)"),
    ] : suite()).filter(Boolean));
    vue.bas.replaceChildren(...(etape === 1
      ? [corriger ? h("button", { class: "bouton", onclick: effacer }, "Effacer") : h("button", { class: "bouton", onclick: sauter }, "Sauté"),
        h("button", { class: "bouton bouton--principal", onclick: () => { etape = 2; tri = false; ajout = ""; nommer = false; dessiner(); vue.vue.querySelector(".plein__corps").scrollTop = 0; } }, "Suite")]
      : [h("button", { class: "bouton", onclick: () => { etape = 1; dessiner(); } }, "Retour"),
        h("button", { class: "bouton bouton--principal", onclick: valider }, corriger ? "Enregistrer" : "Valider")]));
    const c = vue.vue.querySelector(".plein__corps"); if (c && etape === 1) c.scrollTop = y;
  }

  const vue = ouvrirPlein(nomSlot + (corriger ? " · corriger" : ""), corps, { bas: true });
  function valider() {
    const nouveau = R.enregistrerAssiette(slot, a);
    jouer(nouveau ? "coin" : "blip");
    dire(nouveau ? nomSlot + " noté" : "Assiette corrigée");
    vue.fermer();
  }
  function sauter() { R.sauter(idRepas); dire(nomSlot + " sauté, pas de souci"); vue.fermer(); }
  function effacer() { R.effacer(idRepas); dire(nomSlot + " effacé"); vue.fermer(); }
  jouer("open");
  dessiner();
}
