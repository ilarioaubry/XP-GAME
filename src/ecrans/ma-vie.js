// Moi > Ma vie : profil, événements, projets, « la dernière fois que… », paliers et équilibre sur les 4 Angles.

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { PAL_LV, PAL_TXT } from "../donnees/brut/paliers.js";
import { saisir } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { etat, modifier } from "../core/state.js";
import { cleJour, heureReveil } from "../core/temps.js";
import * as M from "../regles/moi.js";
import { TYPES_EVENEMENT } from "../donnees/quetes-pour-toi.js";
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const section = (titre, couleur, ...contenu) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null },
  h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre)), contenu);
const iconeBtn = (nom, etiquette, fn) => h("button", { class: "bouton bouton--icone", "aria-label": etiquette, title: etiquette, html: pxUi(nom, 24), onclick: fn });
const ajout = (texte, fn) => h("button", { class: "bouton bouton--ajout", onclick: fn }, texte);

const dateFr = d => new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

function evenements(S) {
  const liste = M.evenements(S).filter(e => e.d >= cleJour(S));
  return section("Calendrier", "var(--angle-liens)",
    liste.length ? liste.map(e => h("div", { class: "ui-carte ligne-carte" },
      h("div", { class: "ligne-carte__texte" }, h("p", { class: "ui-carte__titre" }, e.n), h("p", { class: "ui-carte__texte" }, dateFr(e.d))),
      iconeBtn("trash", "Supprimer", () => { const annuler = M.retirerEvenement(e.id); dire("Événement supprimé", annuler); }))) : h("p", { class: "vide" }, "Aucun événement pour l'instant."),
    ajout("Ajouter un événement", () => saisir("Nouvel événement", [{ id: "n", etiquette: "Nom" }, { id: "d", etiquette: "Date", type: "date", defaut: cleJour(S) }, { id: "t", etiquette: "Type", type: "choix", options: TYPES_EVENEMENT, defaut: "autre" }], v => { if (v.d) M.ajouterEvenement(v.n, v.d, v.t); })));
}

function projets(S) {
  const liste = M.projets(S);
  return section("Projets", "var(--angle-esprit)",
    liste.length ? liste.map(p => {
      const etapes = p.st || [], faites = etapes.filter(s => s.d).length;
      return h("div", { class: "ui-carte projet" },
        h("div", { class: "ligne-carte" },
          h("div", { class: "ligne-carte__texte" }, h("p", { class: "ui-carte__titre" }, p.n), h("p", { class: "ui-carte__texte" }, `${faites} / ${etapes.length} étapes`)),
          iconeBtn("trash", "Supprimer le projet", () => dire("Projet supprimé", M.retirerProjet(p.id)))),
        etapes.length ? h("div", { class: "ui-barre ui-barre" }, h("i", { style: `--p:${Math.round(100 * faites / etapes.length)}%` })) : null,
        etapes.map((s, i) => h("button", { class: "bouton etape", "aria-pressed": String(!!s.d), onclick: () => { M.basculerEtape(p.id, i); if (!s.d) jouer("blip"); } }, s.t, s.d ? " ✓" : "")),
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
  return section("Mes 4 angles", "var(--c-orange)",
    h("div", { class: "cartes-angles" }, p.map(a => {
      const coches = PAL_LV.filter(l => l <= a.palier).length, suivant = PAL_LV.findIndex(l => l > a.palier);
      return h("div", { class: "cangle", style: `--ac:var(--angle-${a.id})` },
        h("div", { class: "cangle__haut" }, h("span", { class: "cangle__ico", html: pxRk(a.icone, 24) || "" }), h("span", { class: "cangle__nom" }, a.nom), h("span", { class: "cangle__niv" }, String(a.palier))),
        h("div", { class: "cangle__barre" }, h("i", { style: `--p:${Math.round(100 * a.cur / a.need)}%` })),
        h("div", { class: "cangle__crans" }, PAL_LV.map((_, k) => h("i", { class: k < coches ? "on" : "" }))),
        h("p", { class: "cangle__txt" }, suivant < 0 ? "Tout est débloqué" : `Palier ${PAL_LV[suivant]} : ${PAL_TXT[suivant].replace(" débloquées", "").replace(" débloqués", "").toLowerCase()}`));
    })));
}

function fiche(S) {
  const tuile = (l, v, fn) => h("button", { class: "fi" + (v ? "" : " fi--vide"), onclick: fn }, h("small", {}, l), h("b", {}, v || "À remplir"));
  const j = S.bd && S.bd.d ? `${S.bd.d} ${MOIS[(S.bd.m || 1) - 1] || ""}` : "";
  return section("Ma fiche", "var(--c-orange)",
    h("div", { class: "fiches" },
      tuile("Rythme", `Réveil ${Math.floor(heureReveil(S))} h`, null),
      tuile("Anniversaire", j, null),
      tuile("Jours actifs", String(S.days.length), null),
      tuile("XP", String(S.xp || 0), null),
      tuile("En ce moment", S.note || "", () => saisir("En ce moment", [{ id: "n", etiquette: "Un mot sur ta période", defaut: S.note || "" }], v => modifier("fiche-note", s => { s.note = v.n; })))));
}

export function maVie() {
  const S = etat();
  return h("div", { class: "ma-vie" }, paliers(S), fiche(S), evenements(S), projets(S), derniereFois(S));
}
