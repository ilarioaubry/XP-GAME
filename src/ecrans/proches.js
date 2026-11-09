// Onglet Proches (disposition de l'ancienne version, reconstruite) : Relations (ami et famille du mois en grand), Groupes, Famille, Amis.
// Un proche s'ouvre en fiche plein écran : avatar de face, lien, trois façons de prendre contact, historique ; le crayon ouvre sa modification.

import { h } from "../ui/dom.js";
import { pxUi, pxRk } from "../ui/pixel.js";
import { ouvrirPlein, saisir } from "../ui/plein.js";
import { dire } from "../ui/messages.js";
import { jouer } from "../core/sons.js";
import { on } from "../core/events.js";
import { etat } from "../core/state.js";
import { teteSvg, avatarDepuis } from "../avatar/rendu.js";
import { ouvrirPersonnage } from "./personnage.js";
import { vide, tuileIcone, avatarParDefaut } from "../ui/illustrations.js";
import * as P from "../regles/proches.js";

const section = (titre, couleur, droite, ...contenu) => h("section", { class: "ui-section", style: couleur ? `--sc:${couleur}` : null },
  h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre), droite || null), contenu);
const plus = (etiquette, fn) => h("button", { class: "bouton bouton--icone", "aria-label": etiquette, title: etiquette, html: pxUi("plus", 24), onclick: fn });

const teinte = n => { let t = 0; for (const c of n) t = (t * 31 + c.charCodeAt(0)) % 360; return t; };
/** Avatar carré d'un proche : sa tête, sinon sa photo, sinon son initiale sur une couleur à lui. */
function avatarProche(n, taille = 44) {
  const p = etat().profiles[n] || {};
  const contenu = p.pic && !p.avc ? h("img", { src: p.pic, alt: "" }) : h("span", { class: "pav__tete", html: teteSvg(p.avc || avatarParDefaut(n), taille) });
  return h("span", { class: "pav", style: `--h:hsl(${teinte(n)} 55% 50%);--t:${taille}px`, "aria-hidden": "true" }, contenu);
}
const depuis = n => { const j = P.joursSans(n); return j == null ? "Pas encore de nouvelles" : j === 0 ? "Aujourd'hui" : j === 1 ? "Hier" : `Il y a ${j} jours`; };
const nom = t => (t === "famille" ? "Famille" : "Ami");

// ---- Fiche d'un proche
function fiche(n) {
  const corps = h("div", { class: "fiche" });
  const dessiner = () => {
    const S = etat();
    if (!P.tous(S).some(x => x.n === n)) return;
    const li = P.niveauLien(S.bonds[n] || 0), t = P.typeDe(n, S), hist = S.log.filter(l => l.who === n).slice(-6).reverse();
    corps.replaceChildren(
      h("div", { class: "ui-carte fiche__carte" },
        h("button", { class: "bouton bouton--icone fiche__crayon", "aria-label": "Modifier " + n, title: "Modifier", html: pxUi("edit", 24), onclick: () => modifierProche(n, dessiner) }),
        h("div", { class: "fiche__avatar", html: avatarDepuis((S.profiles[n] || {}).avc || avatarParDefaut(n), 4) }),
        h("p", { class: "fiche__nom" }, n),
        h("p", { class: "etiquette" }, nom(t)),
        h("div", { class: "fiche__lien" }, h("span", { html: pxRk("coeur", 24) || "" }), h("span", { class: "ui-carte__texte" }, `${P.titreLien(li.l)} · niveau ${li.l}`)),
        h("div", { class: "ui-barre ui-barre--grande" }, h("i", { style: `--p:${Math.round(100 * li.cur / li.need)}%` })),
        h("p", { class: "t-info" }, `${li.cur} / ${li.need} · ${depuis(n)}`)),
      h("div", { class: "fiche__actions" }, P.ACTIONS.map(a => h("button", { class: "bouton" + (a.k === "news" ? " bouton--principal" : ""),
        onclick: () => { P.contacter(n, a.k); jouer("coin"); dire(`${a.nom} · +${a.xp} XP`); dessiner(); } }, a.nom, h("span", { class: "ui-compteur" }, "+" + a.xp)))),
      section("Historique", "var(--angle-liens)", null, hist.length ? hist.map(l => h("div", { class: "ui-ligne" },
        h("span", {}, l.name || l.a), h("b", {}, new Date(l.t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })))) : vide("Pas encore de contact noté.", "enveloppe")));
  };
  ouvrirPlein(n, corps); dessiner();
}

/** Modifier un proche : prénom, relation, avatar, groupes, retirer. */
function modifierProche(n, apres) {
  let nomCourant = n;
  const corps = h("div", { class: "fiche" });
  let vue;
  const dessiner = () => {
    const S = etat(), t = P.typeDe(nomCourant, S), g = P.groupes(S);
    corps.replaceChildren(
      h("div", { class: "fiche__avatar", html: avatarDepuis((S.profiles[nomCourant] || {}).avc || avatarParDefaut(nomCourant), 4) }),
      h("button", { class: "bouton", onclick: () => ouvrirPersonnage(nomCourant) }, "Modifier l'avatar"),
      h("label", { class: "champ" }, h("span", { class: "t-info" }, "Prénom"),
        h("input", { id: "champ-prenom", value: nomCourant, maxlength: "40", autocomplete: "off", onchange: e => { const v = e.target.value.trim(); if (P.renommer(nomCourant, v)) { nomCourant = v; dessiner(); } else e.target.value = nomCourant; } })),
      h("div", { class: "champ", role: "group", "aria-label": "Relation" }, h("span", { class: "t-info" }, "Relation"),
        h("div", { class: "perso__options" }, [["ami", "Ami"], ["famille", "Famille"]].map(([v, l]) => h("button", { class: "bouton", "aria-pressed": String(t === v), onclick: () => { P.changerType(nomCourant, v); dessiner(); } }, l)))),
      g.length ? h("div", { class: "champ", role: "group", "aria-label": "Groupes" }, h("span", { class: "t-info" }, "Groupes"),
        h("div", { class: "perso__options" }, g.map(x => h("button", { class: "bouton", "aria-pressed": String(x.membres.includes(nomCourant)), onclick: () => { P.basculerGroupe(nomCourant, x.id); dessiner(); } }, x.n)))) : null,
      h("button", { class: "bouton", onclick: () => { const annuler = P.retirer(nomCourant); vue.fermer(); document.querySelectorAll(".plein").forEach(v => v.remove()); document.body.classList.remove("plein-ouvert"); dire(nomCourant + " retiré", annuler); } }, "Retirer ce proche"));
  };
  vue = ouvrirPlein("Modifier " + n, corps, { icone: "duo", couleur: "var(--angle-liens)", auFermer: () => { if (apres) apres(); } }); dessiner();
}

// ---- Groupe : ses membres, à cocher
function pageGroupe(id) {
  const corps = h("div", { class: "fiche" });
  const dessiner = () => {
    const g = P.groupes().find(x => x.id === id); if (!g) return;
    corps.replaceChildren(h("div", { class: "champ", role: "group", "aria-label": "Membres" }, h("span", { class: "t-info" }, "Membres"),
      P.tous().length ? h("div", { class: "perso__options" }, P.tous().map(x => h("button", { class: "bouton", "aria-pressed": String(g.membres.includes(x.n)), onclick: () => { P.basculerGroupe(x.n, id); dessiner(); } }, x.n)))
        : vide("Ajoute d'abord des proches.", "duo")),
      h("button", { class: "bouton", onclick: () => { const annuler = P.retirerGroupe(id); vue.fermer(); dire("Groupe supprimé", annuler); } }, "Supprimer le groupe"));
  };
  const vue = ouvrirPlein((P.groupes().find(x => x.id === id) || {}).n || "Groupe", corps, { icone: "famille", couleur: "var(--angle-esprit)" }); dessiner();
}

// ---- Sections de l'onglet
function relations() {
  const cases = [["ami", "Ami du mois"], ["famille", "Membre de la famille du mois"]].map(([t, titre]) => {
    const x = P.duMois(t);
    return h("button", { class: "ui-carte du-mois__carte", disabled: !x, onclick: () => x && fiche(x.n) },
      x ? avatarProche(x.n, 72) : tuileIcone(t === "famille" ? "famille" : "coeur", t === "famille" ? "var(--angle-foyer)" : "var(--angle-liens)", 48),
      h("p", { class: "etiquette" }, titre), h("p", { class: "ui-carte__titre" }, x ? x.n : "Personne encore"),
      h("p", { class: "ui-carte__texte" }, x ? `${x.fois} contact${x.fois > 1 ? "s" : ""} ce mois-ci` : "Prends des nouvelles"));
  });
  return section("Relations", "var(--angle-liens)", null, h("div", { class: "du-mois" }, cases));
}

function groupes() {
  const g = P.groupes();
  return section("Groupes", "var(--angle-esprit)", plus("Nouveau groupe", () => saisir("Nouveau groupe", [{ id: "n", etiquette: "Nom du groupe" }], v => P.ajouterGroupe(v.n), "Créer", "famille", "var(--angle-esprit)")),
    g.length ? g.map(x => h("button", { class: "ui-carte proche", onclick: () => pageGroupe(x.id) },
      h("span", { class: "proche__texte" }, h("span", { class: "ui-carte__titre" }, x.n), h("span", { class: "ui-carte__texte" }, x.membres.join(", ") || "Aucun membre")),
      h("span", { class: "ui-compteur" }, String(x.membres.length)))) : vide("Aucun groupe pour l'instant.", "famille"));
}

function grille(type, titre, couleur, libelle) {
  const L = P.tous().filter(x => x.type === type);
  return section(titre, couleur, plus(libelle, () => saisir(libelle, [{ id: "n", etiquette: "Prénom" }], v => P.ajouter(v.n, type), "Ajouter", type === "famille" ? "famille" : "duo", couleur)),
    L.length ? h("div", { class: "proches__grille" }, L.map(x => { const li = P.niveauLien(etat().bonds[x.n] || 0);
      return h("button", { class: "proche-carte", onclick: () => fiche(x.n) },
        avatarProche(x.n, 64), h("span", { class: "proche-carte__nom" }, x.n),
        h("span", { class: "proche-carte__niv" }, h("span", { class: "ui-compteur" }, "Nv " + li.l), h("span", { class: "ui-barre" }, h("i", { style: `--p:${Math.round(100 * li.cur / li.need)}%` }))));
    })) : vide(type === "famille" ? "Aucun membre de la famille pour l'instant." : "Aucun ami pour l'instant.", type === "famille" ? "famille" : "duo"));
}

export function monterProches(racine) {
  const dessiner = () => {
    const y = scrollY;
    racine.replaceChildren(h("div", { class: "page proches" }, relations(), groupes(),
      grille("famille", "Famille", "var(--angle-foyer)", "Ajouter un membre de la famille"), grille("ami", "Amis", "var(--angle-liens)", "Ajouter un ami")));
    scrollTo(0, y);
  };
  let a = 0; on("etat:modifie", () => { cancelAnimationFrame(a); a = requestAnimationFrame(dessiner); });
  dessiner();
}
