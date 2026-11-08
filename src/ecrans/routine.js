// Mode Routine : vue plein écran, une étape à la fois avec son minuteur. « Fait » passe à la suivante, « Passer » aussi.
// Pas de culpabilité : on peut s'arrêter quand on veut, ce qui est fait compte.

import { h } from "../ui/dom.js";
import { pxRk } from "../ui/pixel.js";
import { ouvrirPlein } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { pxUi } from "../ui/pixel.js";
import { etapes, terminer, lancee, MOMENTS, record, enregistrer, proposees } from "../regles/routine.js";

const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

export function ouvrirRoutine(moment) {
  const liste = etapes(moment);
  const nom = MOMENTS.find(m => m.id === moment).nom;
  const faites = [];
  let i = 0, restant = liste[0].s, debut = Date.now(), fini = false, pause = false;
  const corps = h("div", { class: "routine" });
  let fenetre;

  const tic = setInterval(() => {
    if (fini || pause) return;
    restant = Math.max(0, restant - 1);
    const t = corps.querySelector(".routine__temps");
    if (t) t.textContent = mmss(restant);
    if (restant === 0 && !corps.dataset.sonne) { corps.dataset.sonne = "1"; jouer("alarm"); }
  }, 1000);

  const sortir = () => { clearInterval(tic); if (!fini) { fini = true; bilan(); } };
  const bilan = () => {
    const sec = Math.round((Date.now() - debut) / 1000);
    const r = terminer(moment, faites, sec);
    if (r.xp) { jouer(r.toutes ? "level" : "coin"); dire(`+${r.xp} XP${r.nouveauRecord ? " · nouveau record" : ""}`); }
  };

  const suivante = (fait) => {
    if (fait) { faites.push(i); jouer("blip"); }
    i++;
    if (i >= liste.length) { clearInterval(tic); fini = true; bilan(); fenetre.fermer(); return; }
    restant = liste[i].s; delete corps.dataset.sonne; dessiner();
  };

  function dessiner() {
    const e = liste[i];
    corps.replaceChildren(
      h("p", { class: "t-info routine__compte" }, `Étape ${i + 1} sur ${liste.length}` + (record(moment) ? ` · record ${mmss(record(moment))}` : "")),
      h("div", { class: "ui-barre", "aria-hidden": "true" }, h("i", { style: `--p:${Math.round(100 * i / liste.length)}%` })),
      h("div", { class: "routine__scene", html: pxRk(e.ic, 96) || pxRk("etoile", 96) || "" }),
      h("h3", { class: "routine__nom" }, e.n),
      h("p", { class: "routine__temps t-chiffre", "aria-live": "off" }, mmss(restant)),
      h("div", { class: "routine__actions" },
        h("button", { class: "bouton bouton--principal", onclick: () => suivante(true) }, i === liste.length - 1 ? "Fait, terminer" : "Fait"),
        h("button", { class: "bouton", onclick: () => suivante(false) }, "Passer"),
        h("button", { class: "bouton", "aria-pressed": String(pause), onclick: () => { pause = !pause; dessiner(); } }, pause ? "Reprendre" : "Pause")),
      h("button", { class: "bouton bouton--ajout", onclick: () => { sortir(); fenetre.fermer(); } }, "Arrêter ici"),
      h("button", { class: "bouton", onclick: () => { sortir(); fenetre.fermer(); ouvrirReglageRoutine(moment); } }, "Modifier la routine"));
  }

  fenetre = ouvrirPlein(nom, corps, { auFermer: () => { clearInterval(tic); if (!fini) { fini = true; bilan(); } } });
  lancee(moment);
  jouer("start");
  dessiner();
}

/** Réglage d'une routine : ordre, durée, étapes en plus ou en moins. Enregistré à chaque geste. */
export function ouvrirReglageRoutine(moment) {
  const nom = MOMENTS.find(m => m.id === moment).nom;
  let liste = etapes(moment);
  const corps = h("div", { class: "reglage" });
  const ok = () => { enregistrer(moment, liste); dessiner(); };
  const btn = (icone, etiquette, fn, classe = "") => h("button", { class: "bouton bouton--icone " + classe, "aria-label": etiquette, title: etiquette, html: pxUi(icone, 24), onclick: fn });
  const dessiner = () => {
    const autres = proposees(moment).filter(b => !liste.some(e => e.n === b.n));
    corps.replaceChildren(
      h("div", { class: "reglage__liste" }, liste.map((e, i) => h("div", { class: "ui-carte reglage__ligne" },
        h("span", { class: "reglage__ico", html: pxRk(e.ic, 24) || "" }),
        h("div", { class: "reglage__texte" }, h("p", { class: "ui-carte__titre" }, e.n),
          h("div", { class: "reglage__duree" },
            h("button", { class: "bouton reglage__pas", "aria-label": "Moins de temps", onclick: () => { liste[i].s = Math.max(15, e.s - 15); ok(); } }, "−"),
            h("span", { class: "t-texte" }, mmss(e.s)),
            h("button", { class: "bouton reglage__pas", "aria-label": "Plus de temps", onclick: () => { liste[i].s = e.s + 15; ok(); } }, "+"))),
        h("div", { class: "reglage__gestes" },
          btn("chev", "Monter", () => { if (i) { [liste[i - 1], liste[i]] = [liste[i], liste[i - 1]]; ok(); } }, "reglage__haut"),
          btn("chev", "Descendre", () => { if (i < liste.length - 1) { [liste[i + 1], liste[i]] = [liste[i], liste[i + 1]]; ok(); } }),
          btn("trash", "Retirer", () => { if (liste.length > 1) { const avant = liste.slice(); liste = liste.filter((_, k) => k !== i); enregistrer(moment, liste); dessiner(); dire("Étape retirée", () => { liste = avant; enregistrer(moment, liste); dessiner(); }); } else dire("Garde au moins une étape"); }))))),
      h("h3", { class: "ui-titre reglage__sous" }, "Ajouter une étape"),
      autres.length ? h("div", { class: "reglage__ajouts" }, autres.map(b => h("button", { class: "bouton bouton--ajout", onclick: () => { liste.push(b); ok(); } }, b.n))) : h("p", { class: "vide" }, "Tout est déjà dans ta routine."),
      h("button", { class: "bouton", onclick: () => { liste = proposees(moment).slice(0, moment === "matin" ? 5 : 4); ok(); } }, "Revenir au réglage d'origine"));
  };
  ouvrirPlein(nom, corps); dessiner();
}
