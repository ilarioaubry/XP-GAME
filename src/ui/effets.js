// Animations de fin d'action, reprises de l'ancienne version (03/11) et redessinées en Cobalt :
//  - « +N XP » qui monte depuis le doigt (toujours, même en « réduire les animations », mais alors sans mouvement) ;
//  - un tampon « coche » pixel, puis des carrés orange qui filent vers la barre d'XP, qui clignote à l'arrivée ;
//  - le personnage fait un petit saut ; un cran du coffre qui se remplit fait un « pop ».
// Rien ne bouge tout seul : chaque effet suit un geste et dure moins d'une seconde.

import { on } from "../core/events.js";
import { pxRk } from "./pixel.js";

let toucher = null;
export const calme = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Endroit du dernier toucher (s'il date de moins de 3 s), sinon le milieu de l'écran. */
function origine() {
  if (toucher && Date.now() - toucher.t < 3000) return toucher;
  return { x: innerWidth / 2, y: innerHeight / 2 };
}

function poser(classe, x, y, html, texte) {
  const el = document.createElement("div");
  el.className = classe;
  el.style.left = x + "px";
  el.style.top = y + "px";
  if (html) el.innerHTML = html;
  if (texte) el.textContent = texte;
  document.body.append(el);
  return el;
}

/** Après un rendu : la cible visible du même nom dans l'écran affiché. */
const visible = sel => [...document.querySelectorAll(".ecran.actif " + sel + ", .plein " + sel)].find(e => e.getBoundingClientRect().width > 0);

function relancer(el, classe) {
  if (!el) return;
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
  setTimeout(() => el.classList.remove(classe), 700);
}

/** Fin d'action : +XP, tampon, carrés vers la barre d'XP, saut du personnage. */
export function finAction(xp) {
  const { x, y } = origine();
  const t = poser("fx-texte", x, y, null, `+${xp} XP`);
  setTimeout(() => t.remove(), 1000);
  if (calme() || !xp || !document.body.animate) return;
  const tampon = poser("fx-tampon", x, y, pxRk("check", 44));
  setTimeout(() => tampon.remove(), 700);
  // la cible se lit après le rendu suivant (l'écran se redessine quand l'état change)
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const barre = visible(".xp .segs"), r = barre && barre.getBoundingClientRect();
    const dansEcran = r && r.top >= 0 && r.bottom <= innerHeight;
    const tx = dansEcran ? r.right - 6 : x, ty = dansEcran ? r.top + r.height / 2 : y - 90;
    const n = xp >= 25 ? 10 : xp >= 10 ? 6 : 3;
    let reste = n;
    for (let k = 0; k < n; k++) {
      const c = poser("fx-carre" + (k % 3 === 2 ? " fx-carre--clair" : ""), 0, 0);
      const sx = x + (Math.random() - .5) * 32, sy = y + (Math.random() - .5) * 20;
      const mx = (sx + tx) / 2 + (Math.random() - .5) * 100, my = Math.min(sy, ty) - 20 - Math.random() * 50;
      c.animate([
        { transform: `translate(${sx}px,${sy}px)`, opacity: 1 },
        { transform: `translate(${mx}px,${my}px)`, opacity: 1 },
        { transform: `translate(${tx}px,${ty}px)`, opacity: dansEcran ? 1 : 0 },
      ], { duration: 600 + k * 35, delay: k * 40, easing: "steps(7)", fill: "both" }).onfinish = () => {
        c.remove();
        if (--reste === 0 && dansEcran) relancer(visible(".xp"), "xp--flash");
      };
    }
    relancer(visible(".hero__perso"), "hero__perso--saut");
  }));
}

/** Petit « pop » sur un élément (aliment posé, cran gagné…). */
export function pop(el) { if (!calme()) relancer(el, "fx-pop"); }

/** Fait sortir une carte avant de la retirer de la liste (la quête faite disparaît, elle ne se grise pas). */
export function sortir(el, ensuite) {
  if (!el || calme()) { ensuite(); return; }
  el.classList.add("fx-sortie");
  setTimeout(ensuite, 220);
}

export function installerEffets() {
  document.addEventListener("pointerdown", e => { toucher = { x: e.clientX, y: e.clientY, t: Date.now() }; }, { capture: true, passive: true });
  on("xp:gagnee", ({ xp }) => finAction(xp));
  on("coffre:cran", ({ n }) => requestAnimationFrame(() => requestAnimationFrame(() =>
    pop(visible(`.segs--coffre i:nth-child(${n})`)))));
}
