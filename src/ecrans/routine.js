// Mode Routine : vue plein écran, une étape à la fois avec son minuteur. « Fait » passe à la suivante, « Passer » aussi.
// Pas de culpabilité : on peut s'arrêter quand on veut, ce qui est fait compte.

import { h } from "../ui/dom.js";
import { pxRk } from "../ui/pixel.js";
import { ouvrirPlein } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { etapes, terminer, lancee, MOMENTS, record } from "../regles/routine.js";

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
      h("button", { class: "bouton bouton--ajout", onclick: () => { sortir(); fenetre.fermer(); } }, "Arrêter ici"));
  }

  fenetre = ouvrirPlein(nom, corps, { auFermer: () => { clearInterval(tic); if (!fini) { fini = true; bilan(); } } });
  lancee(moment);
  jouer("start");
  dessiner();
}
