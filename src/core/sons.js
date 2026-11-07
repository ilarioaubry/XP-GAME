// Sons 8 bits synthétisés (Web Audio), copiés à l'identique de l'ancienne version
// (_legacy/src/js/proches/28-sons-proches-validation.js, ambiance : aujourdhui/08-ambiance-scene.js).
// Les 15 sons : coin, level, badge, moment, start, alarm, error, blip, bop, rep, glug, hit, drop, shake, open.
//   jouer("coin")   jouer("open", rarete 0–3)   jouer("rep", demi-tons)   jouer("glug", n)   jouer("shake", 1–3)
// Coupés quand S.g.mute est vrai. Rien ne joue avant le premier toucher (règle de l'iPhone).

import { etat } from "./state.js";
import { erreur } from "./journal.js";

export const SONS = ["coin", "level", "badge", "moment", "start", "alarm", "error", "blip", "bop", "rep", "glug", "hit", "drop", "shake", "open"];

const SFX = { ctx: null, noise: null, last: 0 };

export function contexte() {
  if (!SFX.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { SFX.ctx = new C(); } catch (e) { erreur("sons:contexte", e); return null; }
  }
  if (SFX.ctx.state === "suspended") SFX.ctx.resume().catch(e => erreur("sons:reprise", e));
  return SFX.ctx;
}

export function actifs() {
  const S = etat();
  return !(S && S.g && S.g.mute);
}

function tone(c, f, t, d, type, vol, f2) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || "square";
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol || 0.08, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0008, t + d);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + d + 0.02);
}

function noise(c, t, d, vol, hp) {
  if (!SFX.noise) {
    const b = c.createBuffer(1, c.sampleRate * 0.4, c.sampleRate), a = b.getChannelData(0);
    for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
    SFX.noise = b;
  }
  const s2 = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
  s2.buffer = SFX.noise;
  f.type = "bandpass";
  f.frequency.value = hp || 900;
  g.gain.setValueAtTime(vol || 0.12, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  s2.connect(f); f.connect(g); g.connect(c.destination);
  s2.start(t); s2.stop(t + d + 0.02);
}

const seq = (c, t, notes, step, type, vol) => notes.forEach((f, i) => { if (f) tone(c, f, t + i * step, step * 1.6, type, vol); });

export function jouer(n, arg) {
  if (!actifs()) return;
  const c = contexte();
  if (!c) return;
  SFX.last = performance.now();
  const t = c.currentTime + 0.01;
  try {
    switch (n) {
      case "coin": tone(c, 988, t, 0.07, "square", 0.07); tone(c, 1319, t + 0.07, 0.18, "square", 0.07); break;
      case "level": seq(c, t, [523, 659, 784, 1047, 0, 784, 1047, 1319], 0.085, "square", 0.07); tone(c, 1568, t + 0.7, 0.45, "triangle", 0.09); break;
      case "badge": seq(c, t, [784, 988, 1175, 1568], 0.09, "square", 0.06); tone(c, 2093, t + 0.36, 0.3, "triangle", 0.07); break;
      case "moment": seq(c, t, [659, 784, 988, 1319], 0.1, "triangle", 0.1); break;
      case "start": tone(c, 660, t, 0.06, "square", 0.05); tone(c, 990, t + 0.06, 0.1, "square", 0.05); break;
      case "alarm": for (let i = 0; i < 4; i++) { tone(c, 880, t + i * 0.3, 0.12, "square", 0.07); tone(c, 660, t + i * 0.3 + 0.14, 0.12, "square", 0.07); } break;
      case "error": tone(c, 180, t, 0.1, "sawtooth", 0.05); tone(c, 140, t + 0.12, 0.14, "sawtooth", 0.05); break;
      case "blip": tone(c, 1200, t, 0.04, "square", 0.04); break;
      case "bop": tone(c, 520, t, 0.05, "triangle", 0.11, 780); tone(c, 1040, t + 0.035, 0.04, "square", 0.025); break;
      case "rep": { const f = 523 * Math.pow(2, (arg || 0) / 12); tone(c, f, t, 0.07, "square", 0.06); tone(c, f * 1.5, t + 0.05, 0.08, "square", 0.045); break; }
      case "glug": { const b = 380 + (arg || 0) * 40; tone(c, b, t, 0.09, "sine", 0.12, b * 1.8); tone(c, b * 1.3, t + 0.08, 0.08, "sine", 0.09, b * 2.2); noise(c, t + 0.02, 0.06, 0.03, 900); break; }
      case "hit": noise(c, t, 0.07, 0.13, 1600); tone(c, arg ? 300 : 460, t, arg ? 0.35 : 0.14, "square", 0.08, arg ? 60 : 150); if (arg) seq(c, t + 0.3, [392, 330, 262], 0.09, "square", 0.05); break;
      case "drop": tone(c, 180, t, 0.18, "triangle", 0.14, 60); noise(c, t, 0.12, 0.08, 300); break;
      case "shake": { const k = arg || 1; noise(c, t, 0.09 + 0.03 * k, 0.07 + 0.03 * k, 500 + k * 250); tone(c, 140 + k * 45, t, 0.08, "square", 0.05, 90 + k * 30); break; }
      case "open": {
        const r = arg | 0;
        noise(c, t, 0.35, 0.12, 2500); tone(c, 300, t, 0.28, "triangle", 0.1, 1200);
        const A = [[523, 659, 784], [523, 659, 784, 1047], [523, 659, 784, 1047, 1319, 1568], [392, 523, 659, 784, 1047, 1319, 1568, 2093]][r];
        seq(c, t + 0.25, A, r >= 2 ? 0.075 : 0.09, "square", 0.07);
        if (r >= 2) { const e = t + 0.25 + A.length * 0.075; [1047, 1319, 1568].forEach(f => tone(c, f, e, r === 3 ? 1.1 : 0.6, "triangle", 0.06)); }
        if (r === 3) for (let i = 0; i < 10; i++) tone(c, 2000 + Math.random() * 2000, t + 1 + i * 0.07, 0.06, "square", 0.025);
        break;
      }
      default: erreur("sons", "son inconnu : " + n);
    }
  } catch (e) {
    erreur("sons:" + n, e);
  }
}

// ---- Ambiance sonore 8 bits de la scène (oiseaux le jour, grillons la nuit), réglage S.g.ambS.
// lumiere() renvoie la lumière du ciel (0 = nuit, 1 = plein jour) ; elle viendra de la scène (Brique 2).
let ambT = 0;
export function ambiance(on, lumiere = () => 1) {
  clearTimeout(ambT);
  if (!on) return;
  const boucle = () => {
    ambT = setTimeout(boucle, 900 + Math.random() * 1900);
    const S = etat();
    if (!S.g || !S.g.ambS || document.hidden || !actifs()) return;
    const c = contexte();
    if (!c || c.state !== "running") return;
    const t = c.currentTime + 0.03, n = lumiere();
    if (n < 0.4) {
      if (Math.random() < 0.65) { const f = 2300 + Math.random() * 1300, k = 2 + ((Math.random() * 3) | 0); for (let i = 0; i < k; i++) tone(c, f + i * 90, t + i * 0.085, 0.06, "sine", 0.022, f * 1.28); }
      if (Math.random() < 0.3) noise(c, t, 1.4, 0.012, 450);
    } else {
      for (let i = 0; i < 5; i++) tone(c, 4100 + Math.random() * 120, t + i * 0.05, 0.022, "sine", 0.011);
      if (n > 0.9 && Math.random() < 0.07) { tone(c, 390, t + 0.3, 0.32, "sine", 0.035, 340); tone(c, 380, t + 0.8, 0.42, "sine", 0.035, 320); }
      if (n < 0.8 && Math.random() < 0.3) noise(c, t, 1.2, 0.01, 350);
    }
  };
  boucle();
}

/** Petit « bop » au toucher des boutons, et réveil du son au premier toucher (comme avant). */
export function installer() {
  document.addEventListener("click", e => {
    const el = e.target.closest && e.target.closest("button,[role=button],[role=tab],a[href],summary");
    if (!el || el.disabled) return;
    if (performance.now() - SFX.last < 90) return;
    jouer("bop");
  });
  const reveil = () => {
    contexte();
    const S = etat();
    if (S && S.g && S.g.ambS) ambiance(true);
    ["pointerdown", "touchstart", "keydown"].forEach(ev => document.removeEventListener(ev, reveil));
  };
  ["pointerdown", "touchstart", "keydown"].forEach(ev => document.addEventListener(ev, reveil, { passive: true }));
}
