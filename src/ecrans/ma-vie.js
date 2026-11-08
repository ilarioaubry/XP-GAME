// Moi > Ma vie : profil, événements, projets, « la dernière fois que… », paliers et équilibre sur les 4 Angles.

import { h } from "../ui/dom.js";
import { pxUi } from "../ui/pixel.js";
import { saisir } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { etat } from "../core/state.js";
import { niveau, rang, cleJour } from "../core/temps.js";
import { avatar } from "./scene.js";
import * as M from "../regles/moi.js";

const section = (titre, couleur, ...contenu) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null },
  h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre)), contenu);
const iconeBtn = (nom, etiquette, fn) => h("button", { class: "bouton bouton--icone", "aria-label": etiquette, title: etiquette, html: pxUi(nom, 24), onclick: fn });
const ajout = (texte, fn) => h("button", { class: "bouton bouton--ajout", onclick: fn }, texte);

function profil(S) {
  const nv = niveau(S.xp || 0), t = M.titrePorte(S);
  return h("div", { class: "profil ui-carte" },
    h("div", { class: "profil__avatar", html: avatar(S) }),
    h("div", { class: "profil__texte" },
      h("p", { class: "ui-carte__titre" }, S.name || "Moi"),
      h("p", { class: "ui-carte__texte" }, `Niveau ${nv.l} · ${rang(nv.l)}`),
      t ? h("p", { class: "ui-carte__texte" }, t) : null,
      h("p", { class: "ui-carte__texte" }, `${S.xp || 0} XP · ${S.days.length} jours actifs`)));
}

const dateFr = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

function evenements(S) {
  const liste = M.evenements(S).filter(e => e.d >= cleJour(S));
  return section("Calendrier", "var(--angle-liens)",
    liste.length ? liste.map(e => h("div", { class: "ui-carte ligne-carte" },
      h("div", { class: "ligne-carte__texte" }, h("p", { class: "ui-carte__titre" }, e.n), h("p", { class: "ui-carte__texte" }, dateFr(e.d))),
      iconeBtn("trash", "Supprimer", () => { const annuler = M.retirerEvenement(e.id); dire("Événement supprimé", annuler); }))) : h("p", { class: "vide" }, "Aucun événement pour l'instant."),
    ajout("Ajouter un événement", () => saisir("Nouvel événement", [{ id: "n", etiquette: "Nom" }, { id: "d", etiquette: "Date", type: "date", defaut: cleJour(S) }], v => { if (v.d) M.ajouterEvenement(v.n, v.d); })));
}

function projets(S) {
  const liste = M.projets(S);
  return section("Projets", "var(--angle-esprit)",
    liste.length ? liste.map(p => {
      const faites = p.steps.filter(s => s.done).length;
      return h("div", { class: "ui-carte projet" },
        h("div", { class: "ligne-carte" },
          h("div", { class: "ligne-carte__texte" }, h("p", { class: "ui-carte__titre" }, p.n), h("p", { class: "ui-carte__texte" }, `${faites} / ${p.steps.length} étapes`)),
          iconeBtn("trash", "Supprimer le projet", () => dire("Projet supprimé", M.retirerProjet(p.id)))),
        p.steps.length ? h("div", { class: "ui-barre ui-barre" }, h("i", { style: `--p:${Math.round(100 * faites / p.steps.length)}%` })) : null,
        p.steps.map((s, i) => h("button", { class: "bouton etape", "aria-pressed": String(!!s.done), onclick: () => { M.basculerEtape(p.id, i); if (!s.done) jouer("blip"); } }, s.t, s.done ? " ✓" : "")),
        ajout("Ajouter une étape", () => saisir("Nouvelle étape", [{ id: "t", etiquette: "Étape" }], v => M.ajouterEtape(p.id, v.t))));
    }) : h("p", { class: "vide" }, "Aucun projet pour l'instant."),
    ajout("Nouveau projet", () => saisir("Nouveau projet", [{ id: "n", etiquette: "Nom du projet" }], v => M.ajouterProjet(v.n))));
}

function derniereFois(S) {
  const liste = M.dernieresFois(S);
  const texte = l => { const j = l.d ? M.joursDepuis(l.d, S) : null; return (j == null ? "Pas encore noté" : j <= 0 ? "Aujourd'hui" : j === 1 ? "Hier" : `Il y a ${j} jours`) + (M.enRetard(l, S) ? " · ce serait le moment" : ""); };
  return section("La dernière fois que…", "var(--angle-foyer)",
    liste.length ? liste.map(l => h("div", { class: "ui-carte ligne-carte" },
      h("div", { class: "ligne-carte__texte" }, h("p", { class: "ui-carte__titre" }, l.name), h("p", { class: "ui-carte__texte" }, texte(l))),
      h("button", { class: "bouton", onclick: () => { M.dernierFaitAujourdhui(l.name); jouer("blip"); } }, "Fait"),
      iconeBtn("trash", "Supprimer", () => dire("Supprimé", M.retirerDerniere(l.name))))) : h("p", { class: "vide" }, "Rien de suivi pour l'instant. Ex. : appeler Mamie."),
    ajout("Suivre une chose", () => saisir("La dernière fois que…", [{ id: "n", etiquette: "Ex. : j'ai appelé Mamie" }], v => M.ajouterDerniere(v.n))));
}

function paliers(S) {
  const p = M.paliers(S);
  const plus = p.reduce((a, b) => (b.part > a.part ? b : a)), moins = p.reduce((a, b) => (b.part < a.part ? b : a));
  return section("Paliers et équilibre", "var(--angle-corps)",
    h("div", { class: "angles angles--paliers" }, p.map(a => h("div", { class: "angle", style: `--ac:${a.couleur}` },
      h("span", { class: "angle__nom t-info" }, a.nom, h("span", { class: "ui-compteur" }, "Palier " + a.palier)),
      h("div", { class: "ui-barre" }, h("i", { style: `--p:${Math.round(100 * a.cur / a.need)}%` })),
      h("span", { class: "t-info" }, `${a.cur} / ${a.need} XP · ${a.part} % de ton énergie`)))),
    h("p", { class: "t-texte" }, plus === moins ? "Tout reste à construire." : `${plus.nom} est ton Angle le plus nourri. ${moins.nom} aimerait un peu d'attention.`));
}

export function maVie() {
  const S = etat();
  return h("div", { class: "ma-vie" }, profil(S), paliers(S), evenements(S), projets(S), derniereFois(S));
}
