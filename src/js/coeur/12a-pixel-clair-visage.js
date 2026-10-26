// Pixel Clair 
(()=>{
// ===== Pixel Clair : cheveux, barbes, yeux, bouches, marques (personnage en pied 32x52) =====
// Remplit CH_HAIR, CH_BEARD, CH_EYES, CH_MOUTH, CH_MARK (registres déclarés dans ch_core.js).
(function(){
"use strict";
// ---------- gabarits ----------
// Une coiffure se dessine avec des lignes de 24 caractères (x = 4..27) ou de 12 caractères (moitié gauche x = 4..15,
// recopiée en miroir). Ligne 0 = A.t-5 (donc ligne 5 = haut de la tête, ligne 9 = sourcils, ligne 11 = yeux).
// a = cheveux (ombré automatiquement au bord droit / bas), # = cheveux sans ombre auto, s/S = ombre, l = reflet,
// A = a à gauche / ombre en miroir, L = reflet à gauche / a en miroir, k = peau, K = reflet peau, d = ombre peau,
// c / C = couleur d'accessoire (élastique), o = contour.
const OX = 4, OY = -5;
function expand(rows){
  return rows.map(r => {
    if (r.length === 24) return r;
    if (r.length === 12) {
      const left = r.replace(/A/g, "a").replace(/L/g, "l");
      const right = r.split("").reverse().map(ch => ch === "A" ? "s" : ch === "L" ? "a" : ch).join("");
      return left + right;
    }
    throw new Error("hair row length " + r.length + ": " + r);
  });
}
function palOf(P){
  return {a:P.hc, "#":P.hc, s:P.hcS, S:P.hcS, l:P.hcL, L:P.hcL, A:P.hc, k:P.sk, K:P.skL, d:P.skS, c:P.ac, C:P.acS, o:P.ol, w:P.w};
}
// dessine un gabarit ; r0 = index de la première ligne fournie ; opt.shade=false désactive l'ombre auto
function T(g, A, P, r0, rows, opt){
  opt = opt || {};
  const R = expand(rows), pal = palOf(P), y0 = A.t + OY + r0;
  const filled = (i, j) => i >= 0 && i < R.length && j >= 0 && j < 24 && R[i][j] !== ".";
  for (let i = 0; i < R.length; i++) for (let j = 0; j < 24; j++) {
    let ch = R[i][j];
    if (ch === ".") continue;
    if (ch === "a" && opt.shade !== false) {
      const x = OX + j;
      if ((x >= 16 && !filled(i, j + 1)) || (!filled(i + 1, j) && opt.bottom !== false)) ch = "s";
    }
    if (ch === "#") ch = "a";
    g.set(OX + j, y0 + i, pal[ch]);
  }
}
// texture de boucles : quelques ombres / reflets réguliers sur les pixels de cheveux d'une zone
function curls(g, A, P, x0, y0, x1, y1){
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (g.get(x, y) !== P.hc) continue;
    const yy = y - A.t + 30, band = Math.floor(yy / 3), ph = yy % 3, xo = (x + (band % 2) * 2) % 4;
    const inside = g.get(x - 1, y) && g.get(x + 1, y) && g.get(x, y + 1);
    if (!inside) continue;
    if (ph === 2 && (xo === 0 || xo === 1)) g.set(x, y, P.hcS);
    else if (ph === 0 && xo === 1 && x < 15 && y < A.t + 1) g.set(x, y, P.hcL);
  }
}
const mirX = x => 31 - x;
// mèche verticale (locks) : 2 px de large, segments marqués
function lock(g, P, x, y0, y1, dark){
  for (let y = y0; y <= y1; y++) {
    const seg = (y - y0) % 3 === 2;
    if (y === y1) { g.set(x, y, P.hcS); continue; }
    g.set(x, y, seg || dark ? P.hcS : P.hc);
    g.set(x + 1, y, P.hcS);
  }
}
// tresse 3 px : motif en chevrons
function braid(g, P, x, y0, y1){
  for (let y = y0; y <= y1; y++) {
    const k = (y - y0) % 2;
    if (k === 0) { g.set(x, y, P.hc); g.set(x + 1, y, P.hc); g.set(x + 2, y, P.hcS); }
    else { g.set(x, y, P.hcS); g.set(x + 1, y, P.hc); g.set(x + 2, y, P.hc); }
  }
  g.set(x + 1, y0, P.hcL);
}
// couleur « rasé / dégradé » : mélange peau + cheveux
const fadeC = (P, t) => avMix(P.sk, P.hc, t == null ? .45 : t);
// ---------- coiffures ----------
const H = CH_HAIR;
// 0 Court
H[0] = {front(g,A,P){ T(g,A,P,3,[
  ".......aaaaa",
  ".....aaLLaaa",
  "....aaLaaaaa",
  "....aaaaaaaa",
  "....aaaaaaaaaa....aa....",
  "....aaaa..........aa....",
  "....aa............aa....",
  ".....a............a.....",
]); }};
// 1 Rasé : boule à zéro, le crâne transparaît
H[1] = {front(g,A,P){ const t=A.t, f=fadeC(P,.55), f2=fadeC(P,.75);
  for(let y=t;y<=t+2;y++) for(let x=9;x<=22;x++){ const v=g.get(x,y); if(v===P.sk||v===P.skS) g.set(x,y,(x+y)%2?f:f2); }
  g.hline(10,21,t-1,f2); g.set(9,t,null); g.set(22,t,null); g.set(10,t-1,null); g.set(21,t-1,null);
  g.hline(11,20,t-1,f2); g.set(9,t,f); g.set(22,t,f);
  [9,22].forEach(x=>{ g.set(x,t+3,f); g.set(x,t+4,f); });
  g.set(11,t,chLight(f2,.25)); g.set(12,t,chLight(f2,.25)); }};
// 2 Mèche
H[2] = {front(g,A,P){ T(g,A,P,2,[
  "..........aaaa..........",
  "......aaaallaaaaa.......",
  ".....aaallaaaaaaaaa.....",
  "....aallaaaaaaaaaaaaa...",
  "....aaaaaaaaaaaaaaaaaa..",
  "....aaa.....aaaaaaaaaa..",
  "....aa........aaaaaaa...",
  ".....a..........aaaa....",
  ".....a............aa....",
]); }};
// 3 Long
H[3] = {
  back(g,A,P){ const r=["....aaaaaaaa","...aaaaaaaaa"]; for(let i=0;i<19;i++) r.push("..aaaaaaaaaa"); r.push("..a.aaaaaaaa","...a.a.aaaaa"); T(g,A,P,4,r); },
  front(g,A,P){ T(g,A,P,3,[
    ".......aaaaa",
    ".....aaLLaaS",
    "....aaLaaaaS",
    "....aLaaaaaa",
    "....aaaaa...",
    "....aaaa....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "....aaa.....",
    "...aaaa.....",
    "...aaaa.....",
    "...aaaa.....",
    "...aaaa.....",
    "...aaaa.....",
    "....aa......",
  ]); }
};
// 4 Afro
H[4] = {
  back(g,A,P){ T(g,A,P,1,[
    ".......aaaaa",
    ".....aaaaaaa",
    "...aaaaaaaaa",
    "..aaaaaaaaaa",
    ".aaaaaaaaaaa",
    ".aaaaaaaaaaa",
    ".aaaaaaaaaaa",
    ".aaaaaaaaaaa",
    ".aaaaaaaaaaa",
    ".aaaaaaaaaaa",
    ".aaaaaaaaaaa",
    "..aaaaaaaaaa",
    "...aaaaaaaaa",
    ".....aaaaaaa",
  ]); curls(g,A,P,4,A.t-5,27,A.t+10); },
  front(g,A,P){ T(g,A,P,4,[
    "....aaaaaaaa",
    "....aaaaaaaa",
    "....aaaaaaaa",
    "....aaaaaaa.",
    "....aaa.....",
    "....aa......",
    "....aa......",
    "....aa......",
    "....aa......",
  ]); curls(g,A,P,8,A.t-1,23,A.t+3); }
};
// 5 Locks
H[5] = {
  back(g,A,P){ const t=A.t; g.rect(8,t,23,t+8,P.hcS);
    [[4,t+15],[6,t+18],[8,t+17],[21,t+17],[23,t+18],[25,t+15]].forEach(([x,e])=>lock(g,P,x,t+1,e,true)); },
  front(g,A,P){ const t=A.t; T(g,A,P,3,[
    ".......aaaaa",
    ".....aaLLaaa",
    "....aaLaaaaa",
    "...aaaaaaaaa",
  ],{bottom:false});
    // locks sur le front et de chaque côté du visage
    [[10,t+3],[13,t+2],[17,t+2],[20,t+3]].forEach(([x,e])=>lock(g,P,x,t+1,e));
    [[6,t+13],[8,t+16],[22,t+16],[24,t+13]].forEach(([x,e])=>lock(g,P,x,t,e)); }
};
// 6 Chignon
H[6] = {front(g,A,P){ T(g,A,P,1,[
  ".........aaa",
  "........aLaa",
  "........aaaa",
  ".....aaSSSSS",
  "....aaLaaaaa",
  "....aLaaaaaa",
  "....aaaa....",
  "....aa......",
  ".....a......",
]); }};
// 7 Crête : côtés rasés + crête de pointes
H[7] = {front(g,A,P){ const t=A.t, st=avMix(P.skS,P.hc,.3);
  for(let y=t;y<=t+3;y++) for(let x=9;x<=22;x++){ const v=g.get(x,y); if((v===P.sk||v===P.skS)&&(x<14||x>17)) g.set(x,y,st); }
  g.set(9,t+4,st); g.set(22,t+4,st);
  T(g,A,P,1,[
  "...........L",
  ".........a.L",
  ".........aLa",
  ".........aLa",
  "..........La",
  "..........La",
  "..........aa",
]); }};
// 8 Bouclé
H[8] = {
  back(g,A,P){ T(g,A,P,4,["...aaaaaaaaa","..aaaaaaaaaa","..aaaaaaaaaa","..aaaaaaaaaa","..aaaaaaaaaa","..aaaaaaaaaa","..aaaaaaaaaa","..aaaaaaaaaa","...aaaaaaaaa"]); },
  front(g,A,P){ T(g,A,P,2,[
    "......aa.aaa",
    "....aaaaaaaa",
    "...aaaaaaaaa",
    "..aaaaaaaaaa",
    "..aaaaaaaaaa",
    "..aaaaaa.aa.",
    "..aaaa....a.",
    "..aaa.......",
    "..aaa.......",
    "...aa.......",
    "..aaa.......",
    "...a........",
  ]); curls(g,A,P,5,A.t-3,26,A.t+8,4); }
};
// 9 Chauve : léger reflet
H[9] = {front(g,A,P){ g.set(11,A.t+1,P.skL); g.set(12,A.t+1,P.skL); g.set(11,A.t+2,P.skL); }};
// 10 Tresses
H[10] = {
  back(g,A,P){ T(g,A,P,4,["....aaaaaaaa","...aaaaaaaaa","...aaaaaaaaa","...aaaaaaaaa","...aaaaaaaaa","...aaaaaaaaa","...aaaaaaaaa"]); },
  front(g,A,P){ T(g,A,P,3,[
    ".......aaaaa",
    ".....aaLLaaS",
    "....aaLaaaaS",
    "....aaaaaaaa",
    "....aaaa....",
    "....aaa.....",
    "....aa......",
    "....a.......",
  ]);
    [7,22].forEach(x=>{ braid(g,P,x,A.t+6,A.t+21); g.rect(x,A.t+22,x+2,A.t+22,P.ac); g.set(x+1,A.t+23,P.hc); g.set(x+1,A.t+24,P.hcS); }); }
};
// 11 Queue de cheval
H[11] = {
  back(g,A,P){ const t=A.t;
    const rows=[[21,24],[22,25],[23,26],[23,27],[24,27],[24,27],[24,27],[24,27],[24,27],[24,26],[24,26],[25,26],[25,26],[25,25]];
    rows.forEach(([a,b],i)=>{ const y=t-1+i; g.hline(a,b,y,P.hc); g.set(b,y,P.hcS); if(b-a>=2) g.set(a+1,y,P.hcL); });
    g.rect(22,t-1,23,t,P.ac); g.set(23,t,P.acS); },
  front(g,A,P){ T(g,A,P,3,[
    "......aaaaaaaaaaa.......",
    "....aaLLaaaaaaaaaaa.....",
    "....aLaaaaaaaaaaaaaa....",
    "....aaaaaaaaaaaaaaaa....",
    "....aaaaaaaaa.....aa....",
    "....aaaaa.........aa....",
    "....aa............a.....",
    "....a...................",
  ]); }
};
// 12 Frange
H[12] = {
  back(g,A,P){ const r=[]; for(let i=0;i<13;i++) r.push("...aaaaaaaaa"); T(g,A,P,4,r); },
  front(g,A,P){ T(g,A,P,3,[
    "......aaaaaa",
    "....aaaLLaaa",
    "...aaaLaaaaa",
    "...aaaaaaaaa",
    "...aaaaaaaaa",
    "...aaaaaaaaa",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
  ]); }
};
// 13 Dégradé : dessus texturé, côtés dégradés
H[13] = {front(g,A,P){ const t=A.t;
  T(g,A,P,2,[
  "........aaaa",
  "......aaaaaa",
  ".....aaaaaaa",
  ".....aaaaaaa",
  ".....aaaaaaa",
  ".....#######",
  ".....#aaaaaa",
],{bottom:false}); curls(g,A,P,9,t-3,22,t+1);
  const f1=fadeC(P,.65), f2=fadeC(P,.35);
  [[9,22]].forEach(([l,r])=>{ [l,r].forEach(x=>{ g.set(x,t,f1); g.set(x,t+1,f1); g.set(x,t+2,f1); g.set(x,t+3,f2); g.set(x,t+4,f2); });
    g.set(l+1,t+2,f1); g.set(r-1,t+2,f1); g.set(l+1,t+3,f2); g.set(r-1,t+3,f2); });
  }};
// 14 Mulet
H[14] = {
  back(g,A,P){ const r=[]; for(let i=0;i<14;i++) r.push("...aaaaaaaaa"); r.push("..aaaaaaaaaa","..aaaaaaaaaa","..a.a.aaaaaa"); T(g,A,P,8,r); },
  front(g,A,P){ T(g,A,P,2,[
    ".........a..",
    ".......a.aaa",
    ".....aaaaaaa",
    "....aaLaaaaa",
    "....aLaaaaaa",
    "....aa.a.a.a",
    "....a.......",
    "....a.......",
  ]); }
};
// 15 Frange longue
H[15] = {
  back(g,A,P){ const r=[]; for(let i=0;i<17;i++) r.push("..aaaaaaaaaa"); r.push("..a.aaaaaaaa"); T(g,A,P,4,r); },
  front(g,A,P){ const r=[
    "......aaaaaaaaaaaa......",
    "....aaaaalaaaaaaaaaa....",
    "...aaaalaaaaaaaaaaaaa...",
    "...aaaaaaaaaaaaaaaaaa...",
    "...aaaaaaaaaaaaaaaaaa...",
    "...aaa.aaaaaaaaaaaaaa...",
    "...aaa....aaaaaaaaaaa...",
    "...aaa........aaaaaaa...",
    "...aaa..........aaaaa...",
  ];
    for(let i=0;i<9;i++) r.push("...aaa...........aaaa...");
    r.push("...a.a...........a.a...."); T(g,A,P,3,r); }
};
// 16 Brosse
H[16] = {front(g,A,P){ T(g,A,P,1,[
  ".....LLLLLLL",
  ".....aSaSaSa",
  ".....aSaSaSa",
  "....aaaaaaaa",
  "....aaaaaaaa",
  "....aaaaaaaa",
  "....aa......",
  ".....a......",
],{bottom:false}); }};
// 17 Raie sur le côté
H[17] = {front(g,A,P){ T(g,A,P,3,[
  "......aaa.aaaaaaa.......",
  ".....aaaa.aLLaaaaaa.....",
  "....aaaaa.aaaaaaaaaaa...",
  "....aaaaa.aaaaaaaaaaa...",
  "....aaaa...aaaaaaaaaa...",
  "....aa........aaaaaa....",
  "....aa...........aaa....",
  ".....a............aa....",
]); }};
// 18 Banane
H[18] = {front(g,A,P){ const t=A.t, f=fadeC(P,.55);
  [9,22].forEach(x=>{ for(let y=t+1;y<=t+5;y++) g.set(x,y,f); });
  g.set(10,t+1,f); g.set(21,t+1,f); g.set(10,t+2,f); g.set(21,t+2,f);
  T(g,A,P,1,[
  "........aaaaaa..........",
  "......aallaaaaaa........",
  ".....aalaaaaaaaaaa......",
  ".....alaaaaaaaaaaaa.....",
  "......aaaaaaaaaaaa......",
  ".......aaaaaaaaaa.......",
]); }};
// 19 Waves : coupe très courte et brillante, vagues concentriques
H[19] = {front(g,A,P){ T(g,A,P,4,[
  ".......allll",
  ".....aallaaa",
  ".....lalaall",
  ".....alaaaaa",
  ".....a......",
  ".....a......",
]); }};
// 20 Carré
H[20] = {
  back(g,A,P){ const r=[]; for(let i=0;i<13;i++) r.push("...aaaaaaaaa"); T(g,A,P,5,r); },
  front(g,A,P){ const r=[
    "......aaaaaaaaaaaa......",
    "....aaaaa.aLLaaaaaaa....",
    "...aaaaaa.aaaaaaaaaaa...",
    "...aaaaa...aaaaaaaaaa...",
    "...aaaa......aaaaaaaa...",
    "...aaa..........aaaaa...",
  ];
    for(let i=0;i<8;i++) r.push("...aaa............aaa...");
    r.push("....aaa..........aaa....");
    T(g,A,P,3,r); }
};
// 21 Surfeur
H[21] = {
  back(g,A,P){ const r=[]; for(let i=0;i<11;i++) r.push("..aaaaaaaaaa"); r.push("..a.aaaaaaaa"); T(g,A,P,5,r); },
  front(g,A,P){ T(g,A,P,2,[
    ".........a..",
    "......aaaaaa",
    ".....aaLaaaA",
    "....aaLaaaaA",
    "...aaLaaaaaa",
    "...aaLaaaa..",
    "...aLaaa....",
    "...aLaa.....",
    "...aLa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "...aaa......",
    "..aa.a......",
    "..a.........",
  ]); }
};
// 22 Twists
H[22] = {front(g,A,P){ const t=A.t;
  T(g,A,P,4,["....aaaaaaaa","....aaaaaaaa","....aaaaaaaa","....aa......","....a......."],{shade:false});
  g.rect(8,t-1,23,t+1,P.hcS);
  for(let x=8,i=0;x<=22;x+=3,i++){ const top=t-3+(i%2), bot=t+2;
    for(let y=top;y<=bot;y++){ const k=(y-top)%2; g.set(x,y,k?P.hcS:P.hc); g.set(x+1,y,k?P.hc:P.hcS); }
    g.set(x,top,P.hcL); }
  g.rect(8,t+2,9,t+4,P.hc); g.rect(22,t+2,23,t+4,P.hcS); }};
// 23 Wolf cut
H[23] = {
  back(g,A,P){ const r=[]; for(let i=0;i<10;i++) r.push("..aaaaaaaaaa"); r.push("..aaaaaaaaaa",".aaaaaaaaaaa",".aaaaaaaaaaa","..aaaaaaaaaa"); T(g,A,P,5,r); },
  front(g,A,P){ T(g,A,P,2,[
    "......a.aa..",
    ".....aaaaaa.",
    "...aaaaLaaaa",
    "..aaaLaaaaaa",
    "..aaLaaaaaaa",
    "..aaaaaaaa..",
    "..a.aaaaa...",
    "...aaaa.....",
    "....aa......",
    "....aa......",
    "...aaa......",
    "..aaa.......",
    ".aaa........",
    ".aa.........",
  ]); }
};
// 24 Long ondulé
const WAVE = [0,0,1,1];
H[24] = {
  back(g,A,P){ const t=A.t;
    for(let y=t-1;y<=t+22;y++){ const i=y-t, o=i<2?Math.max(0,1-i):WAVE[(i+2)%4]; const x0=5+o, x1=31-x0;
      g.hline(x0,x1,y,P.hc); g.set(x1,y,P.hcS); }
    for(let x=6;x<=25;x+=3){ g.set(x,t+23,P.hc); g.set(x+1,t+23,P.hcS); } },
  front(g,A,P){ const t=A.t;
    T(g,A,P,3,[
      ".......aaaaa",
      ".....aaLLaaS",
      "....aaLaaaaS",
      "....aLaaaaaa",
      "....aaaaa...",
      "....aaaa....",
    ]);
    for(let y=t+4;y<=t+20;y++){ const o=WAVE[(y-t)%4]; const x0=7+o;
      g.hline(x0,x0+2,y,P.hc); g.set(x0+2,y,P.hcS); if(o&&WAVE[(y-t+1)%4]===0) g.set(x0,y,P.hcL);
      const r0=mirX(x0+2); g.hline(r0,r0+2,y,P.hc); g.set(r0+2,y,P.hcS); }
  }
};
// 25 Couettes
H[25] = {
  back(g,A,P){ const t=A.t;
    const rows=[[6,8],[5,8],[4,7],[3,7],[3,6],[3,6],[3,6],[3,5],[4,5],[4,5],[4,4]];
    rows.forEach(([a,b],i)=>{ const y=t+2+i;
      g.hline(a,b,y,P.hc); g.set(a+1,y,i>0&&i<6?P.hcL:P.hc); g.set(b,y,P.hcS);
      const ra=mirX(b), rb=mirX(a); g.hline(ra,rb,y,P.hc); g.set(rb,y,P.hcS); g.set(rb-1,y,P.hcS); });
    [[7,8],[23,24]].forEach(([a,b])=>{ g.rect(a,t+2,b,t+3,P.ac); g.set(b,t+3,P.acS); }); },
  front(g,A,P){ T(g,A,P,3,[
    ".......aaaaa",
    ".....aaLLaaS",
    "....aaLaaaaS",
    "....aaaaaaaa",
    "....aaaaaaaa",
    "....aaa.a..a",
    "....aa......",
  ]); }
};
// 26 Demi-queue
H[26] = {
  back(g,A,P){ const r=["...aaaaaaaaa"]; for(let i=0;i<17;i++) r.push("..aaaaaaaaaa"); r.push("..aa.aaaaaaa","...a.aaa.aaa"); T(g,A,P,5,r); },
  front(g,A,P){ const t=A.t;
    T(g,A,P,0,[
      "..........aa",
      ".........aaa",
      "..........cc",
      ".......aaaaa",
      ".....aaLLaaa",
      "....aaLSaaaa",
      "....aLaaaSaa",
      "....aaaa....",
      "....aaa.....",
      "....aaa.....",
      "....aa......",
      "....aa......",
      "....aa......",
      "....aa......",
      "....aa......",
      "....aa......",
      "....a.......",
    ]); }
};

// ---------- barbes ----------
// on ne peint que sur la peau (jamais sur la bouche, les yeux ni les marques)
function skinOnly(g, P){
  const ok = v => v === P.sk || v === P.skS || v === P.skL || v === P.blush || v == null;
  return (x, y, col) => { if (ok(g.get(x, y))) g.set(x, y, col); };
}
// lignes de 24 caractères (x = 4..27), ligne 0 = y0 ; ombre auto au bord droit / bas
function beardMap(g, A, P, rows, y0, colorAt){
  const put = skinOnly(g, P);
  const f = (i, j) => i >= 0 && i < rows.length && j >= 0 && j < 24 && rows[i][j] !== ".";
  rows.forEach((r, i) => [...r].forEach((ch, j) => {
    if (ch === ".") return;
    const x = OX + j, y = y0 + i;
    let col = ch === "l" ? P.hcL : ch === "s" ? P.hcS : P.hc;
    if (ch === "a" && ((x >= 16 && !f(i, j + 1)) || !f(i + 1, j))) col = P.hcS;
    if (colorAt) col = colorAt(x, y, col);
    put(x, y, col);
  }));
}
const B = CH_BEARD;
B[0] = {};
// ligne 0 = A.t+5 (haut des oreilles), 3 = t+8, 4 = t+9 (coins de la bouche), 5 = t+10 (bouche), 8 = t+13 (menton)
B[1] = {draw(g,A,P){ beardMap(g,A,P,[
  ".........aaaaaa.........",
  "........a......a........",
], A.t+8); }};
B[2] = {draw(g,A,P){ beardMap(g,A,P,[
  ".........aaaaaa.........",
  "........................",
  "........................",
  "..........aaaa..........",
  "..........aaaa..........",
  "...........aa...........",
], A.t+8); }};
// barbes par masque : couvrent tout le bas du visage, quelle que soit la forme
function beardIn(A,x,y,full){const h=A.head,t=A.t;if(x<h.x0||x>h.x1||y<t+5||y>h.y1)return false;
  const sb=full?2:1;if(y<=t+8)return x<h.x0+sb||x>h.x1-sb||(y===t+8&&x>=13&&x<=18);
  if(y===t+9)return x<=h.x0+(full?3:2)||x>=h.x1-(full?3:2)||(x>=12&&x<=19);return true}
function beardFill(g,A,P,full,col){const put=skinOnly(g,P),h=A.head;
  for(let y=A.t+5;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){if(!beardIn(A,x,y,full))continue;put(x,y,col?col(x,y):(x>=h.x1-1||y===h.y1||(y>=A.t+10&&!beardIn(A,x,y+1,full))?P.hcS:P.hc))}
  if(!col){put(h.x0+1,A.t+11,P.hcL);put(h.x0+2,A.t+12,P.hcL)}}
B[3] = {draw(g,A,P){ beardFill(g,A,P,false); }};
B[4] = {draw(g,A,P){ beardFill(g,A,P,true);const h=A.head,y=h.y1;
  g.rect(h.x0+1,y+1,h.x1-1,y+1,P.hc);g.rect(h.x0+2,y+2,h.x1-2,y+2,P.hc);g.rect(h.x0+4,y+3,h.x1-4,y+3,P.hcS);g.set(h.x1-1,y+1,P.hcS);g.set(h.x1-2,y+2,P.hcS);g.set(h.x0+3,y+2,P.hcL)}};
B[5] = {draw(g,A,P){ const st=avMix(P.hc,"#3a2a24",.65),a=avMix(P.sk,st,.2),b=avMix(P.sk,st,.34),d=avMix(P.skS,st,.3);beardFill(g,A,P,false,(x,y)=>x>=A.head.x1-1?d:((x*5+y*3)%4===0?b:a)); }};

// ---------- yeux ----------
const E = CH_EYES;
E[0] = {draw(g,A,P){ [A.eyeL,A.eyeR].forEach(e=>{ g.set(e.x,e.y,P.ol); g.set(e.x,e.y+1,P.ol); }); }};
E[1] = {draw(g,A,P){ [A.eyeL,A.eyeR].forEach(e=>{ g.set(e.x-1,e.y+1,P.ol); g.set(e.x,e.y,P.ol); g.set(e.x+1,e.y+1,P.ol); }); }};
E[2] = {draw(g,A,P){ const b=A.brow+1;
  [A.eyeL,A.eyeR].forEach(e=>{ g.set(e.x,e.y,P.ol); g.set(e.x,e.y+1,P.ol); });
  const l=A.eyeL.x, r=A.eyeR.x;
  g.set(l-1,b-1,P.hcS); g.set(l,b,P.hcS); g.set(l+1,b,P.hcS);
  g.set(r+1,b-1,P.hcS); g.set(r,b,P.hcS); g.set(r-1,b,P.hcS); }};
E[3] = {draw(g,A,P){ const l=A.eyeL, r=A.eyeR;
  g.set(l.x,l.y,P.ol); g.set(l.x,l.y+1,P.ol);
  g.set(r.x-1,r.y+1,P.ol); g.set(r.x,r.y+1,P.ol); g.set(r.x+1,r.y+1,P.ol); }};
E[4] = {draw(g,A,P){ [[A.eyeL.x-1,A.eyeL.y],[A.eyeR.x,A.eyeR.y]].forEach(([x,y])=>{
  g.rect(x,y,x+1,y+1,P.ol); g.set(x,y,P.w); g.set(x+1,y+1,P.ec); }); }};

// ---------- bouches ----------
const M = CH_MOUTH;
M[0] = {draw(g,A,P){ const m=A.mouth; g.hline(m.x0,m.x1,m.y,P.mouth); g.set(m.x0-1,m.y-1,P.mouth); g.set(m.x1+1,m.y-1,P.mouth); }};
M[1] = {draw(g,A,P){ const m=A.mouth; g.hline(m.x0,m.x1,m.y,P.mouth); }};
M[2] = {draw(g,A,P){ const m=A.mouth;
  g.set(m.x0-1,m.y-1,P.mouth); g.set(m.x1+1,m.y-1,P.mouth);
  g.hline(m.x0,m.x1,m.y-1,P.w); g.hline(m.x0,m.x1,m.y,P.mouth); g.hline(m.x0+1,m.x1-1,m.y+1,P.mouth); }};
M[3] = {draw(g,A,P){ const m=A.mouth;
  g.hline(m.x0,m.x1,m.y,P.mouth); g.set(m.x0-1,m.y-1,P.mouth); g.set(m.x1+1,m.y-1,P.mouth);
  g.set(m.x0+2,m.y+1,"#f0647e"); g.set(m.x0+3,m.y+1,"#c8445e"); g.set(m.x0+2,m.y,"#f0647e"); }};
M[4] = {draw(g,A,P){ const m=A.mouth, cx=m.x0+1;
  g.hline(cx,cx+1,m.y-1,P.mouth); g.set(cx-1,m.y,P.mouth); g.set(cx+2,m.y,P.mouth); g.hline(cx,cx+1,m.y,P.ol); g.hline(cx,cx+1,m.y+1,P.mouth); }};

// ---------- marques ----------
const K = CH_MARK;
K[0] = {};
K[1] = {draw(g,A,P){ const c=avMix(P.skS,"#7a3a1a",.35), t=A.t;
  [[10,8],[12,8],[11,9],[21,8],[19,8],[20,9]].forEach(([x,y])=>g.set(x,t+y,c)); }};
K[2] = {draw(g,A,P){ const t=A.t, c=avMix(P.skS,"#a03848",.45), x=A.eyeL.x;
  [t+3,t+4,t+5,t+8,t+9].forEach(y=>g.set(x,y,c)); g.set(x-1,t+4,c); g.set(x+1,t+4,c); }};
K[3] = {draw(g,A,P){ g.set(A.mouth.x1,A.mouth.y-2,avMix(P.skS,"#3a2018",.6)); }};
K[4] = {draw(g,A,P){ const t=A.t, b="#f4dcb0", bS="#d2a872", y=A.eyeL.y+1;
  g.hline(13,18,y,b); g.hline(13,18,y+1,bS); g.set(13,y,bS); g.set(18,y,bS); g.set(15,y,"#e8c48e"); g.set(16,y,"#e8c48e"); }};
K[5] = {draw(g,A,P){ const t=A.t;
  [[9,11],[20,22]].forEach(([a,b])=>{ g.hline(a,b,t+8,P.ac); g.hline(a,b,t+10,P.ac); }); }};
})();


})();
