// Démarrage de la V2. Brique 1 : socle seulement (état, sauvegarde, journal, événements, sons, pixel, tokens).
// Les 3 écrans (Aujourd'hui, Moi, Proches) arrivent aux briques 2 à 4 ; en attendant, Aujourd'hui montre
// le contrôle du socle : ta sauvegarde est-elle relue entièrement ?

import { installer as installerJournal, lire as lireJournal, nbErreurs, erreur } from "./core/journal.js";
import { charger, etat, etatLecture } from "./core/state.js";
import { emit, on } from "./core/events.js";
import { estEnLectureSeule, CLE_AVANT } from "./core/sauvegarde.js";
import { installer as installerSons } from "./core/sons.js";
import { niveau, rang, cleJour } from "./core/temps.js";
import { h, $, $$, monter } from "./ui/dom.js";
import { pxUi, pxRk } from "./ui/pixel.js";
import { installerMessages } from "./ui/messages.js";
import { installerEffets } from "./ui/effets.js";
import { coffresDeNiveau } from "./regles/coffre.js";
import { monterAujourdhui } from "./ecrans/aujourdhui.js";
import { monterMoi } from "./ecrans/moi.js";
import { monterProches } from "./ecrans/proches.js";
import { bilan } from "./ecrans/bilan.js";
import { verifier as verifierBadges } from "./regles/badges.js";
import { BADGES } from "./donnees/brut/badges.js";
import { dire } from "./ui/messages.js";

installerJournal();

const ECRANS = [
  { id: "aujourdhui", nom: "Aujourd'hui", icone: "star" },
  { id: "moi", nom: "Moi", icone: "user" },
  { id: "proches", nom: "Proches", icone: "users" },
];

function monterOnglets() {
  const liste = $(".onglets__liste");
  monter(liste, ECRANS.map(e => h("button", {
    class: "onglet", role: "tab", "data-ecran": e.id, "aria-selected": "false", onclick: () => aller(e.id),
    html: pxUi(e.icone, 24) + `<span>${e.nom}</span>`,
  })));
}

function aller(id) {
  $$(".ecran").forEach(el => { el.classList.toggle("actif", el.id === "e-" + id); el.classList.remove("entre"); });
  const e = $("#e-" + id); if (e) { void e.offsetWidth; e.classList.add("entre"); setTimeout(() => e.classList.remove("entre"), 400); }
  $$(".onglet").forEach(el => el.setAttribute("aria-selected", String(el.dataset.ecran === id)));
  emit("onglet:change", { id });
  scrollTo(0, 0);
}

const lignes = (...l) => h("dl", { class: "ui-lignes" }, l.map(([k, v, ok]) =>
  h("div", { class: "ui-ligne" + (ok === true ? " ui-ligne--ok" : ok === false ? " ui-ligne--ko" : "") }, h("dt", {}, k), h("dd", {}, v))));

function controleSocle() {
  const S = etat();
  const nv = niveau(S.xp || 0);
  const g = S.g || {};
  const cles = Object.keys(g).length;
  const lect = etatLecture();
  const j = lireJournal();
  const entete = (titre) => h("div", { class: "ui-entete" }, h("h2", { class: "ui-titre" }, titre));
  return h("div", { class: "page" },
    h("h1", { class: "t-chiffre" }, "XP · V2"),
    h("p", { class: "t-info" }, "Brique 1 : le socle. Cet écran sert à vérifier que ta sauvegarde est bien relue ; l'accueil arrive à la brique 2."),
    h("section", { class: "ui-section" }, entete("Ta sauvegarde"),
      lignes(
        ["Lecture", { neuve: "Aucune sauvegarde (premier lancement)", lue: "Relue", illisible: "Illisible : rien n'est écrit", ancienne: "Format ancien : à ouvrir dans l'ancienne version", future: "Format plus récent : rien n'est écrit" }[lect], lect === "lue" || lect === "neuve"],
        ["Prénom", S.name || "—"],
        ["XP totale", String(S.xp)],
        ["Niveau", `${nv.l} · ${rang(nv.l)} (${nv.cur}/${nv.need})`],
        ["Journal des actions", S.log.length + " entrées"],
        ["Jours actifs", String(S.days.length)],
        ["Proches", `${S.friends.length} amis · ${S.family.length} famille · ${Object.keys(S.profiles).length} fiches`],
        ["Repas notés", String(Object.keys(g.mb || {}).length)],
        ["Assiettes", String(Object.keys(g.plt || {}).length)],
        ["Humeurs notées", String(Object.keys(g.mood || {}).length)],
        ["Nuits notées", String(Object.keys(g.sleep || {}).length)],
        ["Badges", String(Object.keys(S.badges || {}).length)],
        ["Objets obtenus", String((g.gear || []).length)],
        ["Clés de données (S.g)", String(cles)],
        ["Version des migrations", String(g.ver ?? "—")],
        ["Jour de l'appli", cleJour(S)],
        ["Écriture", estEnLectureSeule() ? "Bloquée (protège ta sauvegarde)" : "Autorisée", !estEnLectureSeule()],
        ["Copie d'origine", localStorage.getItem(CLE_AVANT) ? "Gardée" : "Pas encore (créée à la 1re écriture)"],
      )),
    h("section", { class: "ui-section" }, entete("Journal d'erreurs"),
      lignes(["Erreurs", String(nbErreurs()), nbErreurs() === 0], ["Lignes gardées", String(j.length)]),
      j.slice(-5).map(l => h("p", { class: "t-info" }, `${l.n} · ${l.ou} · ${l.m}`))),
    h("section", { class: "ui-section" }, entete("Pixel art et sons"),
      h("div", { class: "ui-tuiles" },
        ["riz", "pomme", "pain", "casserole"].map(n => h("div", { class: "ui-tuile", html: (pxRk(n, 48) || pxRk("soleil", 48)) + `<span>${n}</span>` }))),
      h("p", { class: "ui-ligne" }),
      h("button", { class: "bouton bouton--principal", onclick: () => import("./core/sons.js").then(m => m.jouer("coin")) }, "Tester un son")));
}

const erreurSure = f => { try { f(); } catch (e) { erreur("badges", e); } };

function demarrer() {
  charger();
  installerSons();
  monterOnglets();
  installerMessages();
  installerEffets();
  monterAujourdhui($("#e-aujourdhui"));
  monterMoi($("#e-moi"), () => bilan(controleSocle));
  monterProches($("#e-proches"));
  // Badges : on revérifie quand l'état change (ne réécrit que s'il y a du nouveau, donc pas de boucle).
  let revue = 0;
  on("etat:modifie", () => { cancelAnimationFrame(revue); revue = requestAnimationFrame(() => erreurSure(verifierBadges)); });
  on("badge:obtenu", ({ id }) => { const b = BADGES.find(x => x.id === id); dire("Badge : " + (b ? b.name : id)); });
  erreurSure(verifierBadges);
  // Niveau : un coffre par niveau gagné (comme l'ancienne version), dit tout de suite.
  on("niveau:monte", ({ niveau: l }) => { if (coffresDeNiveau(l)) dire(`Niveau ${l} : un coffre t'attend`); });
  aller("aujourdhui");
  emit("app:prete");
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(e => erreur("service-worker", e)));
  }
  document.documentElement.dataset.prete = "1";
}

try {
  demarrer();
} catch (e) {
  erreur("demarrage", e);
  document.body.append(h("p", { class: "vide" }, "XP n'a pas pu démarrer. L'erreur est notée dans le journal."));
}
