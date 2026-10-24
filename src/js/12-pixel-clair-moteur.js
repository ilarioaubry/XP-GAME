// ===== Pixel Clair : moteur de personnage en pied =====
// Grille 32 x 52. Contour sombre automatique autour de la silhouette, aplats + une nuance d'ombre.
const CH={W:32,H:52,OL:"#24182c"};
const CH_BOT=["Jean","Pantalon","Short","Jupe","Jupe longue","Jogging"];
const CH_BOTC=["#3b5a8c","#2c2c34","#8a6a4a","#d63b3b","#2f6fd6","#6d7680","#f0b62e","#2f9a5a","#8a4fd0","#f2f0ea"];
const CH_SHOE=["Baskets","Chaussures","Bottes","Sandales"];
const CH_SHOEC=["#f2f0ea","#2c2c34","#8a5a2a","#d63b3b","#2f6fd6","#f0b62e"];
const CH_DEF={bot:0,botC:0,shoe:0,shoeC:0};
// registres remplis par les fichiers de pièces (index = option)
const CH_HAIR=[],CH_TOP=[],CH_BOTP=[],CH_SHOEP=[],CH_HAT=[],CH_GLS=[],CH_BIJOU=[],CH_MAIN=[],CH_BEARD=[],CH_MARK=[],CH_EYES=[],CH_MOUTH=[];
function chShade(c,t){return avMix(c,"#000",t==null?.24:t)}
function chLight(c,t){return avMix(c,"#fff",t==null?.28:t)}
function chPal(c){const L=k=>{const a=AV_OPT[k]||[];return a[c[k]]!==undefined?a[c[k]]:a[0]};
  const sk=L("skin"),hc=L("hairC"),tc=L("topC"),ac=L("accC"),ec=L("eyeC"),bc=CH_BOTC[c.botC]||CH_BOTC[0],shc=CH_SHOEC[c.shoeC]||CH_SHOEC[0];
  return{sk:sk[0],skS:sk[1],skL:chLight(sk[0],.18),hc,hcS:chShade(hc),hcL:chLight(hc,.25),tc,tcS:chShade(tc),tcL:chLight(tc),ac,acS:chShade(ac),acL:chLight(ac),ec,
    bc,bcS:chShade(bc),bcL:chLight(bc,.2),shc,shcS:chShade(shc,.3),ol:CH.OL,w:"#ffffff",wS:"#d8dee6",mouth:"#8a2a3a",blush:avMix(sk[0],"#ff6a8a",.35),gold:"#f0c040",goldS:"#b8862a",goldL:"#fff0a0",metal:"#c8d0da",metalS:"#8a94a3"}}
const CH_SIZE=[0,2,3,-2,-3];
// Repères anatomiques selon la pose et l'image
function chAnchors(c,pose,fr){pose=pose||"idle";fr=fr|0;const so=CH_SIZE[c.size|0]||0,L=10+so,feet=50;
  const sit=pose==="sit";const legTop=sit?null:feet-2-L+1;const t0=sit?11:legTop-31; // haut de la tête
  let by=0;if(pose==="idle"&&fr===1)by=1;if(pose==="walk"&&(fr===1||fr===3))by=-1;if(pose==="stretch")by=-1;
  const t=t0+by,A={pose,fr,t,by,L,sit};
  A.head={x0:9,y0:t,x1:22,y1:t+13};A.face={y:t};
  A.eyeL={x:12,y:t+6};A.eyeR={x:19,y:t+6};A.brow=t+4;A.mouth={x0:14,x1:17,y:t+10};A.ear={y0:t+5,y1:t+7};
  A.neck={x0:14,y0:t+14,x1:17,y1:t+15};A.torso={x0:10,y0:t+16,x1:21,y1:t+28};
  const hipY=sit?t0+29:legTop-2;A.hip={x0:10,y0:hipY,x1:21,y1:hipY+1};
  // bras
  const arm=(side,mode,dx,dy)=>{const xL=side<0?7:22;const x0=xL+(dx||0);
    if(mode==="up")return{x0:side<0?5:24,y0:t+3,x1:side<0?7:26,y1:t+17,hand:{x0:side<0?5:24,y0:t+1,x1:side<0?7:26,y1:t+2},up:1};
    return{x0,y0:t+16+(dy||0),x1:x0+2,y1:t+25+(dy||0),hand:{x0,y0:t+26+(dy||0),x1:x0+2,y1:t+27+(dy||0)},up:0}};
  let aL=arm(-1),aR=arm(1);
  if(pose==="walk"){if(fr===0){aL=arm(-1,"",1,1);aR=arm(1,"",1,-1)}else if(fr===2){aL=arm(-1,"",-1,-1);aR=arm(1,"",-1,1)}}
  if(pose==="up"||pose==="stretch"){aL=arm(-1,"up");aR=arm(1,"up")}
  if(pose==="wave"){aR=arm(1,"up");if(fr===1){aR.x0++;aR.x1++;aR.hand.x0++;aR.hand.x1++}}
  if(pose==="sit"){aL=arm(-1,"",1,0);aR=arm(1,"",-1,0)}
  A.armL=aL;A.armR=aR;A.handR={x:aR.hand.x0+1,y:aR.hand.y0+1,up:aR.up};A.handL={x:aL.hand.x0+1,y:aL.hand.y0+1,up:aL.up};
  // jambes et chaussures
  if(sit){A.lap={x0:9,y0:hipY,x1:22,y1:hipY+2};A.legL={x0:10,y0:hipY+3,x1:14,y1:hipY+8};A.legR={x0:17,y0:hipY+3,x1:21,y1:hipY+8};
    A.shoeL={x0:9,y0:hipY+9,x1:14,y1:hipY+10};A.shoeR={x0:17,y0:hipY+9,x1:22,y1:hipY+10}}
  else{let lL=0,lR=0;if(pose==="walk"){if(fr===0)lR=1;if(fr===2)lL=1}
    A.legL={x0:10,y0:legTop,x1:14,y1:feet-2-lL};A.legR={x0:17,y0:legTop,x1:21,y1:feet-2-lR};
    A.shoeL={x0:9,y0:feet-1-lL,x1:14,y1:feet-lL};A.shoeR={x0:17,y0:feet-1-lR,x1:22,y1:feet-lR}}
  return A}
function chNew(){const W=CH.W,H=CH.H,px=new Array(W*H).fill(null);
  const set=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(c&&x>=0&&x<W&&y>=0&&y<H)px[y*W+x]=c};
  const get=(x,y)=>x>=0&&x<W&&y>=0&&y<H?px[y*W+x]:null;
  const rect=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)set(x,y,c)};
  const clear=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&x<W&&y>=0&&y<H)px[y*W+x]=null};
  // boîte remplie + ombre à droite/en bas + contour sombre interne optionnel
  const box=(x0,y0,x1,y1,f,o)=>{o=o||{};if(o.ol!==false){rect(x0,y0,x1,y1,o.olc||CH.OL);rect(x0+1,y0+1,x1-1,y1-1,f);if(o.sh)rect(x1-1,y0+1,x1-1,y1-1,o.sh);if(o.li)rect(x0+1,y0+1,x0+1,y1-1,o.li)}else{rect(x0,y0,x1,y1,f);if(o.sh)rect(x1,y0,x1,y1,o.sh);if(o.li)rect(x0,y0,x0,y1,o.li)}};
  // dessin depuis une liste de lignes ("." = vide) et une palette
  const put=(x0,y0,rows,pal)=>rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=="."&&ch!==" "){const c=pal[ch];if(c)set(x0+x,y0+y,c)}}));
  const hline=(x0,x1,y,c)=>{for(let x=x0;x<=x1;x++)set(x,y,c)};const vline=(x,y0,y1,c)=>{for(let y=y0;y<=y1;y++)set(x,y,c)};
  return{W,H,px,set,get,rect,clear,box,put,hline,vline}}
// ---- corps de base
function chBaseBody(g,A,P){const h=A.head;
  // tête arrondie
  g.rect(h.x0,h.y0+1,h.x1,h.y1-1,P.sk);g.rect(h.x0+1,h.y0,h.x1-1,h.y1,P.sk);
  g.rect(h.x1-1,h.y0+2,h.x1-1,h.y1-2,P.skS);g.hline(h.x0+2,h.x1-1,h.y1,P.skS);
  // oreilles
  g.rect(h.x0-1,A.ear.y0,h.x0-1,A.ear.y1,P.sk);g.rect(h.x1+1,A.ear.y0,h.x1+1,A.ear.y1,P.skS);
  // cou
  g.rect(A.neck.x0,A.neck.y0,A.neck.x1,A.neck.y1,P.skS)}
function chArms(g,A,P){[A.armL,A.armR].forEach(a=>{g.rect(a.x0,a.y0,a.x1,a.y1,P.sk);g.rect(a.x0,a.y0,a.x0,a.y1,P.skS);g.rect(a.hand.x0,a.hand.y0,a.hand.x1,a.hand.y1,P.sk);g.hline(a.hand.x0,a.hand.x1,a.hand.up?a.hand.y0:a.hand.y1,P.skS)})}
function chLegs(g,A,P){[A.legL,A.legR].forEach(l=>{g.rect(l.x0,l.y0,l.x1,l.y1,P.sk);g.rect(l.x1,l.y0,l.x1,l.y1,P.skS)})}
// ---- visage par défaut
function chEyesDef(g,A,P){[A.eyeL,A.eyeR].forEach(e=>{g.set(e.x,e.y,P.ol);g.set(e.x,e.y+1,P.ol)})}
function chMouthDef(g,A,P){const m=A.mouth;g.hline(m.x0,m.x1,m.y,P.mouth);g.set(m.x0-1,m.y-1,P.mouth);g.set(m.x1+1,m.y-1,P.mouth)}
// ---- pièces par défaut (remplacées par les registres)
function chTopDef(g,A,P){const T=A.torso;g.box(T.x0,T.y0,T.x1,T.y1,P.tc,{sh:P.tcS});[A.armL,A.armR].forEach(a=>{if(a.up){g.box(a.x0,a.y1-4,a.x1,a.y1,P.tc,{ol:false,sh:P.tcS})}else g.box(a.x0,a.y0,a.x1,a.y0+4,P.tc,{ol:false,sh:P.tcS})})}
function chBotDef(g,A,P){const H=A.hip;g.rect(H.x0,H.y0,H.x1,H.y1,P.bc);if(A.sit){const l=A.lap;g.rect(l.x0,l.y0,l.x1,l.y1,P.bc)}[A.legL,A.legR].forEach(l=>{g.rect(l.x0,l.y0,l.x1,l.y1,P.bc);g.rect(l.x1,l.y0,l.x1,l.y1,P.bcS)});g.vline(15,H.y0+1,H.y1,P.bcS)}
function chShoeDef(g,A,P){[A.shoeL,A.shoeR].forEach(s=>{g.rect(s.x0,s.y0,s.x1,s.y1,P.shc);g.hline(s.x0,s.x1,s.y1,P.shcS)})}
// ---- contour de silhouette
function chOutline(g,col){const W=g.W,H=g.H,src=g.px.slice();for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(src[y*W+x])continue;const n=(x>0&&src[y*W+x-1])||(x<W-1&&src[y*W+x+1])||(y>0&&src[(y-1)*W+x])||(y<H-1&&src[(y+1)*W+x]);if(n)g.px[y*W+x]=col}}
// ---- assemblage
const chCall=(R,i,fn,...a)=>{const f=R[i];if(f&&typeof f==="object"){if(f[fn])f[fn](...a)}else if(typeof f==="function"&&fn==="draw")f(...a)};
function chDraw(cfg,pose,fr){const c={...AV_DEF,...CH_DEF,...(cfg||{})},A=chAnchors(c,pose,fr),P=chPal(c),g=chNew();
  const hair=c.hair|0,top=c.top|0,bot=c.bot|0,hat=c.hat|0;
  chCall(CH_HAIR,hair,"back",g,A,P,c);
  chCall(CH_TOP,top,"back",g,A,P,c);
  chLegs(g,A,P);
  if(CH_BOTP[bot])chCall(CH_BOTP,bot,"draw",g,A,P,c);else chBotDef(g,A,P);
  if(CH_SHOEP[c.shoe|0])chCall(CH_SHOEP,c.shoe|0,"draw",g,A,P,c);else chShoeDef(g,A,P);
  chBaseBody(g,A,P);chArms(g,A,P);
  if(CH_TOP[top])chCall(CH_TOP,top,"draw",g,A,P,c);else chTopDef(g,A,P);
  if(CH_EYES[c.eyes|0])chCall(CH_EYES,c.eyes|0,"draw",g,A,P,c);else chEyesDef(g,A,P);
  if(CH_MOUTH[c.mouth|0])chCall(CH_MOUTH,c.mouth|0,"draw",g,A,P,c);else chMouthDef(g,A,P);
  g.set(A.eyeL.x-1,A.mouth.y-1,P.blush);g.set(A.eyeR.x+1,A.mouth.y-1,P.blush);
  chCall(CH_MARK,c.mark|0,"draw",g,A,P,c);
  chCall(CH_BEARD,c.beard|0,"draw",g,A,P,c);
  chCall(CH_HAIR,hair,"front",g,A,P,c);
  chCall(CH_BIJOU,c.bijou|0,"draw",g,A,P,c);
  chCall(CH_GLS,c.glasses|0,"draw",g,A,P,c);
  if(hat&&CH_HAT_COVER.has(hat))chHatClip(g,A,P,c,hat);
  chCall(CH_HAT,hat,"draw",g,A,P,c);
  chCall(CH_TOP,top,"over",g,A,P,c);
  chCall(CH_MAIN,c.main|0,"draw",g,A,P,c);
  chOutline(g,P.ol);
  return g.px}
const CH_HAT_COVER=new Set([1,2,3,6,7,8,9,10,11,12,13,17,18,19]);
function chHatClip(g,A,P,c,hat){const W=CH.W,g2=chNew();chCall(CH_HAT,hat,"draw",g2,A,P,c);const h=A.head;const L=[];for(let x=h.x0;x<=h.x1;x++){let b=-1;for(let y=0;y<=h.y0+9;y++)if(g2.get(x,y))b=y;if(b>=0)L.push(b)}if(!L.length)return;L.sort((p,q)=>p-q);const B=L[Math.floor(L.length/2)];
  const HC=new Set([P.hc,P.hcS,P.hcL,P.sk,P.skS,P.skL]);
  for(let y=0;y<B;y++)for(let x=0;x<W;x++){const v=g.get(x,y);if(!v||!HC.has(v)||g2.get(x,y))continue;if(y>=h.y0+3&&x>h.x0&&x<h.x1)continue;g.px[y*W+x]=null}}
function chCanvas(px,scale,W,H){W=W||CH.W;H=H||CH.H;const s=scale||1,cv=document.createElement("canvas");cv.width=W*s;cv.height=H*s;const gg=cv.getContext("2d");for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=px[y*W+x];if(v){gg.fillStyle=v;gg.fillRect(x*s,y*s,s,s)}}return cv}

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
(()=>{
// ===== Pixel Clair : vêtements du personnage en pied (hauts, bas, chaussures) =====
// Remplit CH_TOP, CH_BOTP, CH_SHOEP (voir ch_core.js). Tout est placé à partir des repères A.
(function(){
"use strict";
const lum=h=>{const v=avHex(h);return(0.299*v[0]+0.587*v[1]+0.114*v[2])/255};
const mix=avMix;
const GREEN="#2f7a4a";
// bas du haut : descend jusqu'à la ligne au-dessus des hanches (évite un trou quand le corps rebondit)
const tb=A=>Math.max(A.torso.y1,A.hip.y0-1);
const legBot=A=>Math.min(A.legL.y1,A.legR.y1);
const isSkin=(g,x,y,P)=>{const v=g.get(x,y);return v===P.sk||v===P.skS};

// ---------- outils communs aux hauts ----------
function armSkin(g,a,P){g.rect(a.x0,a.y0,a.x1,a.y1,P.sk);g.vline(a.x0,a.y0,a.y1,P.skS);const h=a.hand;g.rect(h.x0,h.y0,h.x1,h.y1,P.sk);g.hline(h.x0,h.x1,h.up?h.y0:h.y1,P.skS)}
// torse plein : x0..x1 sur toute la hauteur, ombre sur l'avant-dernière colonne (la dernière sert de séparation)
function body(g,A,col,sh,bottom){const T=A.torso,b=bottom==null?tb(A):bottom;g.rect(T.x0,T.y0,T.x1,b,col);if(sh)g.vline(T.x1-1,T.y0,b,sh);return b}
// bras : ligne de séparation, peau redessinée (le bras passe devant le torse), manche
// o={len, col, sh, cuff, sep, conn, fx(a,s,r0,r1,cuffY)}
function arms(g,A,P,o){const T=A.torso,b=o.bottom==null?tb(A):o.bottom;
  [[A.armL,-1],[A.armR,1]].forEach(([a,s])=>{
    const n=Math.max(0,Math.min(o.len||0,a.y1-a.y0+1));
    if(!a.up){const col=s<0?a.x1+1:a.x0-1;if(col>=T.x0&&col<=T.x1){const y0=Math.max(a.y0,T.y0),y1=Math.min(a.hand.y1,b);
        for(let y=y0;y<=y1;y++)g.set(col,y,typeof o.sep==="function"?o.sep(y):(o.sep||P.ol))}}
    armSkin(g,a,P);
    let r0,r1,cy;if(a.up){r1=a.y1;r0=a.y1-n+1;cy=r0}else{r0=a.y0;r1=a.y0+n-1;cy=r1}
    if(a.up){// épaule : relie le bras levé au torse
      const cx0=s<0?a.x1+1:T.x1+1,cx1=s<0?T.x0-1:a.x0-1;g.rect(cx0,a.y1-1,cx1,a.y1,n>0?(o.conn||o.col):P.sk);
      if(n===0)g.hline(cx0,cx1,a.y1,P.skS)}
    if(n>0){g.rect(a.x0,r0,a.x1,r1,o.col);if(o.sh)g.vline(a.x0,r0,r1,o.sh);if(o.cuff)g.hline(a.x0,a.x1,cy,o.cuff)}
    if(o.fx)o.fx(a,s,r0,r1,cy,n)})}
// encolure ronde
function crew(g,A,P,trim){const T=A.torso,Y=T.y0;g.hline(14,17,Y,P.skS);g.set(13,Y,trim);g.set(18,Y,trim);g.hline(14,17,Y+1,trim)}
// petite fleur (+) / étoile
function flower(g,x,y,pet,ctr){g.set(x,y,ctr);g.set(x-1,y,pet);g.set(x+1,y,pet);g.set(x,y-1,pet);g.set(x,y+1,pet)}
function star(g,x,y,P){g.set(x,y,P.goldL);g.set(x-1,y,P.gold);g.set(x+1,y,P.gold);g.set(x,y-1,P.gold);g.set(x,y+1,P.gold)}
// ================= HAUTS =================
const TOP=[];
// 0 T-shirt
TOP[0]={draw(g,A,P){const b=body(g,A,P.tc,P.tcS);crew(g,A,P,P.tcS);g.hline(A.torso.x0,A.torso.x1,b,P.tcS);
  arms(g,A,P,{len:4,col:P.tc,sh:P.tcS,cuff:P.tcS})}};
// 1 Hoodie : capuche autour du cou, cordons, poche kangourou
TOP[1]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  // capuche (bourrelet autour du cou)
  g.put(10,Y-2,[".LcS....Scc.","cccS....SccS","ScccSSSSccSS",".SSS....SSS."],{L:P.tcL,c:P.tc,S:P.tcS,s:P.tcS});
  g.hline(14,17,Y-1,P.skS);g.hline(14,17,Y-2,P.skS);g.hline(14,17,Y,P.tcS);
  // cordons
  g.vline(14,Y+1,Y+4,P.w);g.vline(17,Y+1,Y+3,P.w);g.set(14,Y+5,P.wS);g.set(17,Y+4,P.wS);
  // poche kangourou
  const py=Math.min(Y+7,b-4);g.hline(13,18,py,P.tcS);g.vline(12,py+1,b-2,P.tcS);g.vline(19,py+1,b-2,P.tcS);
  // bord-côte
  g.hline(T.x0,T.x1,b,P.tcS);g.hline(T.x0,T.x1,b-1,P.tc);g.vline(20,Y,b-1,P.tcS);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.tcS})}};
// 2 Débardeur : épaules nues, bretelles
TOP[2]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  g.rect(10,Y,11,Y+1,P.sk);g.rect(20,Y,21,Y+1,P.sk);g.set(10,Y+2,P.sk);g.set(21,Y+2,P.sk);
  g.rect(14,Y,17,Y+1,P.sk);g.hline(15,16,Y+2,P.sk);g.hline(14,17,Y,P.skS);
  g.vline(12,Y,Y+1,P.tc);g.vline(13,Y,Y+1,P.tc);g.vline(18,Y,Y+1,P.tc);g.vline(19,Y,Y+1,P.tcS);
  g.hline(T.x0,T.x1,b,P.tcS);
  arms(g,A,P,{len:0,sep:y=>y<=Y+2?P.skS:P.ol})}};
// 3 Veste ouverte sur un t-shirt blanc
TOP[3]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  g.rect(14,Y,17,b,P.w);g.vline(17,Y+1,b,P.wS);g.hline(15,16,Y,P.skS);g.set(14,Y,P.wS);g.set(17,Y,P.wS);
  // revers
  g.vline(13,Y,b,P.tcS);g.vline(18,Y,b,P.tcS);g.vline(14,Y+1,Y+2,P.tc);g.vline(17,Y+1,Y+2,P.tc);g.set(14,Y+3,P.tcS);g.set(17,Y+3,P.tcS);g.set(13,Y,P.tcL);g.set(18,Y,P.tcL);
  // poches
  g.hline(11,12,Y+8,P.tcS);g.hline(19,20,Y+8,P.tcS);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.tcS})}};
// 4 Maillot de sport : col V et bords contrastés, numéro
const DIG={"1":[".#","##",".#",".#",".#"],"0":["###","#.#","#.#","#.#","###"],"7":["###","..#",".#.",".#.",".#."]};
TOP[4]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  const ed=P.ac===P.tc?(lum(P.tc)>.6?P.ol:P.w):P.ac;const num=lum(P.tc)>.72?(P.ac===P.tc?P.ol:P.ac):P.w;
  g.hline(14,17,Y,P.skS);g.hline(15,16,Y+1,P.skS);g.set(13,Y,ed);g.set(18,Y,ed);g.set(14,Y+1,ed);g.set(17,Y+1,ed);g.hline(15,16,Y+2,ed);
  g.put(12,Y+4,DIG["1"].map(r=>r.replace(/#/g,"n")),{n:num});g.put(16,Y+4,DIG["0"].map(r=>r.replace(/#/g,"n")),{n:num});
  g.hline(T.x0,T.x1,b,ed);g.hline(T.x0,T.x1,b-1,P.tcS);
  arms(g,A,P,{len:4,col:P.tc,sh:P.tcS,cuff:ed})}};
// 5 Chemise : col blanc et cravate
TOP[5]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  const col=P.w,oc=lum(P.tc)>.8?P.wS:P.tcS;
  g.set(13,Y-1,col);g.set(18,Y-1,col);g.hline(13,14,Y,col);g.hline(17,18,Y,col);g.set(14,Y+1,col);g.set(17,Y+1,col);
  g.set(12,Y,oc);g.set(19,Y,oc);g.set(13,Y+1,oc);g.set(18,Y+1,oc);g.set(14,Y+2,oc);g.set(17,Y+2,oc);
  // cravate
  g.hline(15,16,Y,P.acS);g.rect(15,Y+1,16,Y+7,P.ac);g.vline(16,Y+1,Y+7,P.acS);g.set(15,Y+8,P.ac);g.set(16,Y+8,P.acS);
  // boutons + poche
  g.set(15,Y+10,P.tcS);g.hline(18,19,Y+3,P.tcS);
  g.hline(T.x0,T.x1,b,P.tcS);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:col})}};
// 6 Col roulé
TOP[6]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  g.put(12,Y-2,[".LcccLc.","cccccccS","SSSSSSSS"],{L:P.tcL,c:P.tc,S:P.tcS});[13,15,17].forEach(x=>g.set(x,Y-2,P.tcS));
  g.hline(T.x0,T.x1,b,P.tcS);g.hline(T.x0,T.x1,b-1,P.tc);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.tcS})}};
// 7 Survêtement : zip, bandes latérales sur les manches
TOP[7]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
  const st=lum(P.tc)>.75?(P.ac===P.tc?P.ol:P.ac):P.w;
  g.hline(13,18,Y-1,P.tc);g.set(18,Y-1,P.tcS);g.hline(13,18,Y,P.tcS);
  g.vline(15,Y,b,P.tcS);g.set(16,Y+1,P.metal);g.set(16,Y+2,P.metalS);
  g.vline(11,Y,b-1,st);
  g.hline(T.x0,T.x1,b,P.tcS);
  arms(g,A,P,{len:10,col:P.tc,sh:null,cuff:P.tcS,fx:(a,s,r0,r1,cy)=>{const sx=s<0?a.x0:a.x1;g.vline(sx,Math.min(r0,r1),Math.max(r0,r1),st);g.set(sx,cy,P.tcS)}})}};
// 8 Veste en cuir : noire/brune, col large, zip asymétrique, ceinture
TOP[8]={draw(g,A,P){const T=A.torso,Y=T.y0;
  const L=lum(P.tc)<.22?P.tc:mix(P.tc,"#2a1a12",.72),LS=chShade(L,.4),LL=chLight(L,.2);
  const b=body(g,A,L,LS);
  // t-shirt et col
  g.hline(14,17,Y,P.w);g.hline(15,16,Y+1,P.w);
  g.put(11,Y-1,["..l....l..","lllo..olll",".Slll.lS..","..SS.oS..."].map((r,i)=>i===2?".Sll..llS.":r),{l:LL,S:LS,o:P.ol});
  // zip asymétrique
  g.set(14,Y+2,P.metal);g.set(15,Y+3,P.metal);g.set(16,Y+4,P.metal);g.vline(17,Y+5,b-2,P.metal);g.set(18,Y+3,P.metalS);g.set(14,Y+3,LS);
  // reflets
  g.vline(12,Y+4,Y+6,LL);
  // ceinture
  g.hline(T.x0,T.x1,b-1,LS);g.hline(T.x0,T.x1,b,LS);g.set(12,b-1,P.metal);g.set(12,b,P.metalS);
  arms(g,A,P,{len:10,col:L,sh:LS,cuff:LS,fx:(a,s,r0,r1,cy,n)=>{const y=a.up?r1-3:r0+3;g.set(a.x0+1,y,LL)}})}};
// 9 Armure : plastron en métal, épaulières
TOP[9]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.metal,P.metalS);const W="#eef2f6";
  g.hline(13,18,Y-1,P.metalS);g.hline(13,18,Y,P.metalS);
  g.vline(15,Y+1,Y+7,W);g.set(16,Y+2,W);g.vline(12,Y+2,Y+6,P.metalS);g.vline(19,Y+2,Y+6,P.metalS);
  g.hline(11,20,Y+8,P.metalS);
  // ceinture (couleur du haut)
  g.hline(T.x0,T.x1,b-1,P.tc);g.hline(T.x0,T.x1,b,P.tcS);g.rect(15,b-1,16,b,P.gold);g.set(16,b,P.goldS);
  arms(g,A,P,{len:10,col:P.metal,sh:P.metalS,cuff:P.metalS,fx:(a,s,r0,r1)=>{for(let y=r0+3;y<=r1;y+=3)g.hline(a.x0,a.x1,y,P.metalS)}})},
  over(g,A,P){const T=A.torso,W="#eef2f6";[[A.armL,-1],[A.armR,1]].forEach(([a,s])=>{const x0=a.up?(s<0?T.x0-3:T.x1-1):a.x0-1,Y=a.up?T.y0:Math.max(a.y0,T.y0-1);
    g.put(x0,Y-2,[".mmm.","mwmmm","mmmmS","SSSSS","ooooo"].map(r=>s>0?[...r].reverse().join("").replace("S","m").replace(/m(?=$)/,"S"):r),{m:P.metal,w:W,S:P.metalS,o:P.ol})})}};
// 10 Cape royale : rouge et or, fourrure d'hermine
const RED="#c4243a",REDS="#8c1a2e";
TOP[10]={back(g,A,P){const Y=A.torso.y0,yb=A.sit?A.legL.y1-1:Math.max(A.legL.y1,A.legR.y1)-1;
    g.rect(5,Y,26,yb,RED);g.vline(25,Y+1,yb,REDS);g.vline(6,Y+1,yb,REDS);g.hline(5,26,yb,P.gold);g.vline(5,Y+1,yb,P.gold);g.vline(26,Y+1,yb,P.gold)},
  draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS);
    g.vline(15,Y+2,b,P.tcS);[Y+4,Y+7].forEach(y=>g.set(16,y,P.gold));
    g.hline(T.x0,T.x1,b-1,P.gold);g.hline(T.x0,T.x1,b,P.goldS);g.set(15,b-1,P.goldL);
    arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.gold})},
  over(g,A,P){const Y=A.torso.y0;
    g.put(8,Y-1,["....ww....ww....","wwwwwwwwwwwwwwww","wwSwwwwggwwwSwww","SSSSSSSSSSSSSSSS"].map(r=>r),{w:P.w,S:P.wS,g:P.gold});
    [[10,Y],[13,Y+1],[18,Y+1],[21,Y]].forEach(([x,y])=>g.set(x,y,P.ol))}};
// 11 Kimono : croisé, col blanc, ceinture obi, larges manches
TOP[11]={draw(g,A,P){const T=A.torso,Y=T.y0,H=A.hip;const yb=A.sit?A.lap.y0:H.y1;
  g.rect(T.x0,T.y0,T.x1,yb,P.tc);g.vline(20,Y,yb,P.tcS);
  // V de peau + col croisé
  for(let i=0;i<4;i++){g.hline(13+i,18-i,Y+i,P.skS)}
  for(let i=0;i<5;i++){g.set(12+i,Y+i,P.w);g.set(19-i,Y+i,P.w)}g.set(13,Y+1,P.wS);
  for(let i=5;i<8;i++)g.set(12+i,Y+i,P.tcS);
  // obi
  const oy=Math.min(Y+8,yb-3);g.rect(T.x0,oy,T.x1,oy+2,P.ac);g.hline(T.x0,T.x1,oy+2,P.acS);g.rect(15,oy,16,oy+2,P.acS);g.set(15,oy+1,P.acL);
  g.hline(T.x0,T.x1,yb,P.tcS);
  arms(g,A,P,{len:8,col:P.tc,sh:P.tcS,cuff:P.tcS,bottom:yb,fx:(a,s,r0,r1,cy)=>{if(a.up)return;
    const sx=s<0?a.x0-1:a.x1+1;g.vline(sx,a.y0+3,r1,s<0?P.tc:P.tcS);g.set(sx,r1,P.tcS)}})}};
// 12 Costume : veste, chemise blanche, cravate
TOP[12]={draw(g,A,P){const T=A.torso,Y=T.y0,H=A.hip;const yb=A.sit?H.y0:H.y0;
  const b=body(g,A,P.tc,P.tcS,yb);
  g.hline(13,18,Y,P.w);g.rect(14,Y+1,17,Y+3,P.w);g.hline(15,16,Y+4,P.w);g.set(13,Y,P.wS);g.set(18,Y,P.wS);
  g.hline(15,16,Y,P.acS);g.rect(15,Y+1,16,Y+5,P.ac);g.vline(16,Y+1,Y+5,P.acS);
  // revers
  const lp=lum(P.tc)<.3?chLight(P.tc,.18):P.tcS;
  g.put(11,Y,["lo....ol","llo..oll",".lo..ol.",".llollo.","..lolo..","...oo..."].map(r=>r),{l:lp,o:P.ol});
  g.hline(13,13,Y,P.w);
  g.vline(15,Y+6,b,P.tcS);g.set(16,Y+7,P.ol);g.set(16,Y+9,P.ol);
  // pochette, poches
  g.set(19,Y+3,P.w);g.hline(18,19,Y+4,P.tcS);g.hline(11,12,Y+9,P.tcS);g.hline(18,19,Y+9,P.tcS);
  g.hline(T.x0,T.x1,b,P.tcS);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.w,bottom:b})}};
// 13 Robe de mage : longue, étoiles, ceinture
TOP[13]={draw(g,A,P){const T=A.torso,Y=T.y0,H=A.hip;const yb=A.sit?A.legL.y1-1:legBot(A)-1;
  body(g,A,P.tc,P.tcS);
  for(let y=H.y0-1;y<=yb;y++){const k=y>=yb-1?1:0;let x0=H.x0-k,x1=H.x1+k;if(A.sit&&y>=A.lap.y0&&y<=A.lap.y1){x0=A.lap.x0;x1=A.lap.x1}
    g.hline(x0,x1,y,P.tc);g.set(x1-1,y,P.tcS)}
  g.hline(A.sit?9:9,A.sit?22:22,yb,P.gold);g.hline(9,22,yb,P.gold);g.set(9,yb,P.goldS);g.set(22,yb,P.goldS);
  // col en or
  g.hline(14,17,Y,P.skS);g.set(13,Y,P.gold);g.set(18,Y,P.gold);g.set(14,Y+1,P.gold);g.set(17,Y+1,P.gold);g.hline(15,16,Y+2,P.gold);
  // ceinture
  const by=T.y1-2;g.hline(T.x0,T.x1,by,P.ac);g.set(14,by+1,P.ac);g.set(14,by+2,P.acS);
  // plis
  if(yb-by>6){g.vline(13,by+4,yb-1,P.tcS);g.vline(18,by+4,yb-1,P.tcS)}
  // étoiles
  star(g,12,Y+5,P);star(g,18,Y+8,P);if(yb-by>8){star(g,16,by+5,P)}if(yb-by>11)star(g,11,yb-3,P);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.gold,fx:(a,s,r0,r1,cy)=>{if(a.up)return;const sx=s<0?a.x0-1:a.x1+1;g.vline(sx,r1-2,r1,P.tc);g.set(sx,r1,P.gold)}})}};
// 14 Peignoir : col châle clair, ceinture nouée, jusqu'aux genoux
TOP[14]={draw(g,A,P){const T=A.torso,Y=T.y0,H=A.hip;
  const yb=A.sit?A.lap.y1:A.legL.y0+Math.max(2,Math.floor(A.L/2)-1);
  body(g,A,P.tc,P.tcS);
  for(let y=H.y0-1;y<=yb;y++){let x0=H.x0,x1=H.x1;if(A.sit&&y>=A.lap.y0){x0=A.lap.x0;x1=A.lap.x1}g.hline(x0,x1,y,P.tc);g.set(x1-1,y,P.tcS)}
  g.vline(15,T.y1,yb,P.tcS);g.hline(H.x0,H.x1,yb,P.tcL);g.set(15,yb,P.tcS);
  // col châle
  for(let i=0;i<4;i++){g.hline(14,17,Y+i,null)}
  for(let i=0;i<5;i++){g.hline(14+Math.floor(i/2),17-Math.floor(i/2),Y+i,P.skS)}
  for(let i=0;i<6;i++){g.set(12+Math.floor(i*0.7),Y+i,P.tcL);g.set(13+Math.floor(i*0.7),Y+i,P.tcL);g.set(19-Math.floor(i*0.7),Y+i,P.tcL);g.set(18-Math.floor(i*0.7),Y+i,P.tcL)}
  g.vline(16,Y+5,Y+8,P.tcS);
  // ceinture + nœud
  const by=Math.min(Y+9,T.y1-1);g.hline(T.x0,T.x1,by,P.tcS);g.set(13,by,P.tcL);g.set(12,by+1,P.tcL);g.set(14,by+1,P.tcL);g.set(12,by+2,P.tcS);g.set(14,by+2,P.tcS);
  // poche
  g.hline(18,19,by+2,P.tcS);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.tcL,fx:(a,s,r0,r1,cy)=>{if(a.up)g.hline(a.x0,a.x1,cy+1,P.tcL);else g.hline(a.x0,a.x1,cy-1,P.tcL)}})}};
// 15 Marinière : blanc à rayures
TOP[15]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.w,P.wS);const st=lum(P.tc)>.72?"#2f4f8a":P.tc;
  for(let y=Y+2;y<=b;y+=2)g.hline(T.x0,T.x1,y,st);
  g.hline(13,18,Y,P.wS);g.hline(14,17,Y,P.skS);
  arms(g,A,P,{len:7,col:P.w,sh:P.wS,cuff:P.w,fx:(a,s,r0,r1,cy)=>{for(let y=r0;y<=r1;y++){if(y!==cy&&((y-Y)%2===0))g.hline(a.x0,a.x1,y,st)}}})}};
// 16 Chemise hawaïenne : fleurs, col ouvert
TOP[16]={draw(g,A,P){const T=A.torso,Y=T.y0,H=A.hip,b=body(g,A,P.tc,P.tcS,H.y0);
  const pet=lum(P.tc)>.75?(P.ac===P.tc?P.ol:P.ac):P.w,ctr=(P.ac===pet||P.ac===P.tc||lum(P.tc)>.75||P.ac===P.w)?(P.tc==="#f0b62e"?"#d63b3b":P.gold):P.ac;
  g.hline(14,17,Y,P.skS);g.hline(15,16,Y+1,P.skS);
  g.hline(12,13,Y,P.tcL);g.hline(18,19,Y,P.tcL);g.set(14,Y+1,P.tcL);g.set(17,Y+1,P.tcL);g.set(13,Y+1,P.tcS);g.set(18,Y+1,P.tcS);
  g.vline(15,Y+2,b,P.tcS);
  // feuilles + fleurs
  [[11,Y+6],[19,Y+3],[17,Y+10],[12,Y+11]].forEach(([x,y])=>{g.set(x,y,GREEN);g.set(x+1,y+1,GREEN)});
  flower(g,13,Y+4,pet,ctr);flower(g,18,Y+7,pet,ctr);flower(g,13,Y+9,pet,ctr);
  g.hline(T.x0,T.x1,b,P.tcS);
  arms(g,A,P,{len:4,col:P.tc,sh:P.tcS,cuff:P.tcS,bottom:b,fx:(a,s,r0,r1,cy)=>{g.set(a.x0+1,a.up?r1-1:r0+1,pet)}})}};
// 17 Pull de Noël : maille, col côtelé, bande de motifs (flocons, sapin, zigzag)
function xmasCols(P){const L=lum(P.tc),red=/^#d6|^#e8|^#f0/.test(P.tc)&&avHex(P.tc)[0]>200&&avHex(P.tc)[1]<130;
  return{w:L>.8?"#d63b3b":P.w,r:red?"#2f9a5a":(L>.8?"#2f9a5a":"#d63b3b"),k:chShade(P.tc,.38)}}
TOP[17]={draw(g,A,P){const T=A.torso,Y=T.y0,b=body(g,A,P.tc,P.tcS),X=xmasCols(P);
  // col côtelé
  g.hline(13,18,Y,P.tcS);g.hline(14,17,Y,P.skS);g.set(13,Y,X.r);g.set(18,Y,X.r);g.hline(14,17,Y+1,X.r);
  // bande jacquard : pointillés / ligne / flocon-sapin-flocon / ligne / pointillés
  const by=Math.max(Y+2,Math.min(Y+3,b-8));
  for(let x=T.x0;x<=T.x1;x++){if(x%2===0)g.set(x,by,X.w);g.set(x,by+1,X.r);g.set(x,by+5,X.r);if(x%2===1)g.set(x,by+6,X.w)}
  const flake=cx=>{const y=by+3;g.set(cx,y,X.w);g.set(cx-1,y-1,X.w);g.set(cx+1,y-1,X.w);g.set(cx-1,y+1,X.w);g.set(cx+1,y+1,X.w)};
  flake(11);flake(19);
  g.set(15,by+2,X.w);g.hline(14,16,by+3,X.w);g.set(15,by+4,X.r);g.set(14,by+4,X.w);g.set(16,by+4,X.w);
  // maille sous la bande
  for(let y=by+8;y<b-1;y+=2)for(let x=T.x0+1+((y-by)%4?1:0);x<T.x1-1;x+=3)g.set(x,y,X.k);
  // bord-côte
  g.hline(T.x0,T.x1,b,P.tcS);for(let x=T.x0+1;x<=T.x1;x+=2)g.set(x,b,X.k);
  arms(g,A,P,{len:10,col:P.tc,sh:P.tcS,cuff:P.tcS,fx:(a,s,r0,r1,cy,n)=>{if(!n)return;const y=a.up?r1-3:r0+3,y2=a.up?y-1:y+1;
    g.hline(a.x0,a.x1,y,X.r);g.set(a.x0+1,y2,X.w);g.set(a.x0+1,a.up?y+2:y-2,X.w)}})}};
TOP.forEach((t,i)=>CH_TOP[i]=t);

// ================= BAS =================
function pants(g,A,col,sh){const H=A.hip;g.rect(H.x0,H.y0,H.x1,H.y1,col);
  if(A.sit){const l=A.lap;g.rect(l.x0,l.y0,l.x1,l.y1,col);g.vline(15,l.y0+1,l.y1,sh);g.vline(l.x1,l.y0,l.y1,sh);g.hline(l.x0,l.x1,l.y1,sh)}
  [A.legL,A.legR].forEach(l=>{g.rect(l.x0,l.y0,l.x1,l.y1,col);g.vline(l.x1,l.y0,l.y1,sh)});
  g.set(15,H.y1,sh)}
const BOT=[];
// 0 Jean : ceinture, couture, ourlets retroussés
BOT[0]={draw(g,A,P){const H=A.hip;pants(g,A,P.bc,P.bcS);
  g.hline(H.x0,H.x1,H.y0,P.bcS);g.set(15,H.y0,P.gold);g.set(11,H.y1,P.bcL);g.set(20,H.y1,P.bcL);
  [[A.legL,-1],[A.legR,1]].forEach(([l,s])=>{const sx=s<0?l.x0+1:l.x1-1;for(let y=l.y0+1;y<l.y1-1;y+=2)g.set(sx,y,P.bcL);
    g.hline(l.x0,l.x1,l.y1,P.bcL);g.set(l.x1,l.y1,P.bc)});
  if(A.sit){g.set(10,A.lap.y0+1,P.bcL);g.set(21,A.lap.y0+1,P.bcL)}}};
// 1 Pantalon : ceinture, plis marqués
BOT[1]={draw(g,A,P){const H=A.hip;pants(g,A,P.bc,P.bcS);const belt=chShade(P.bc,.5);
  g.hline(H.x0,H.x1,H.y0,belt);g.hline(15,16,H.y0,P.metal);
  [A.legL,A.legR].forEach(l=>{g.vline(l.x0+2,l.y0,l.y1,P.bcS);g.hline(l.x0,l.x1,l.y1,P.bcS)});
  if(A.sit){g.vline(12,A.lap.y0,A.lap.y1-1,P.bcL);g.vline(19,A.lap.y0,A.lap.y1-1,P.bcL)}}};
// 2 Short : genoux nus
BOT[2]={draw(g,A,P){const H=A.hip;g.rect(H.x0,H.y0,H.x1,H.y1,P.bc);g.hline(H.x0,H.x1,H.y0,P.bcS);g.set(15,H.y1,P.bcS);
  if(A.sit){const l=A.lap;g.rect(l.x0,l.y0,l.x1,l.y1,P.bc);g.vline(15,l.y0+1,l.y1,P.bcS);g.hline(l.x0,l.x1,l.y1,P.bcS);g.vline(l.x1,l.y0,l.y1,P.bcS);return}
  const n=Math.max(3,Math.round(A.L*.4));
  [A.legL,A.legR].forEach(l=>{const y1=l.y0+n-1;g.rect(l.x0,l.y0,l.x1,y1,P.bc);g.vline(l.x1,l.y0,y1,P.bcS);g.hline(l.x0,l.x1,y1,P.bcS);g.set(l.x0+1,l.y0+1,P.bcL)})}};
// jupe évasée générique, de H.y0 à yb (bas)
function skirt(g,A,P,yb,long){const H=A.hip,n=Math.max(1,yb-H.y0);
  const K=i=>long?Math.min(2,Math.floor(i*3/(n+1))):(i>=Math.ceil(n/2)?1:0);
  for(let y=H.y0;y<=yb;y++){const i=y-H.y0,k=K(i),x0=H.x0-k,x1=H.x1+k;g.hline(x0,x1,y,P.bc);g.set(x1,y,P.bcS);if(i>0)g.set(x0,y,P.bcL)}
  g.hline(H.x0,H.x1,H.y0,P.bcS);
  // plis qui s'ouvrent vers le bas
  for(let y=H.y1+1;y<yb;y++){const k=K(y-H.y0);g.set(13-Math.floor(k/2),y,P.bcS);g.set(18+Math.floor(k/2),y,P.bcS);if(long&&y>H.y1+2)g.set(16,y,P.bcS)}
  const k=K(n);g.hline(H.x0-k,H.x1+k,yb,P.bcS)}
// 3 Jupe (au-dessus du genou)
BOT[3]={draw(g,A,P){const H=A.hip;
  if(A.sit){const l=A.lap;g.rect(H.x0,H.y0,H.x1,H.y1,P.bc);g.hline(H.x0,H.x1,H.y0,P.bcS);g.rect(l.x0-1,l.y0+1,l.x1+1,l.y1,P.bc);g.rect(l.x0,l.y0,l.x1,l.y0,P.bc);g.hline(l.x0-1,l.x1+1,l.y1,P.bcS);g.vline(l.x1+1,l.y0+1,l.y1,P.bcS);return}
  skirt(g,A,P,A.legL.y0+Math.max(2,Math.round(A.L*.35)),false)}};
// 4 Jupe longue (jusqu'aux chevilles)
BOT[4]={draw(g,A,P){const H=A.hip;
  if(A.sit){const l=A.lap;g.rect(H.x0,H.y0,H.x1,H.y1,P.bc);g.hline(H.x0,H.x1,H.y0,P.bcS);g.rect(l.x0,l.y0,l.x1,l.y1,P.bc);
    g.rect(l.x0,l.y1+1,l.x1,A.legL.y1-1,P.bc);g.vline(l.x1,l.y0,A.legL.y1-1,P.bcS);g.vline(13,l.y1+1,A.legL.y1-1,P.bcS);g.vline(18,l.y1+1,A.legL.y1-1,P.bcS);g.hline(l.x0,l.x1,A.legL.y1-1,P.bcS);return}
  skirt(g,A,P,legBot(A)-1,true)}};
// 5 Jogging : bandes latérales, chevilles resserrées
BOT[5]={draw(g,A,P){const H=A.hip;pants(g,A,P.bc,P.bcS);const st=lum(P.bc)>.75?P.ol:P.w;
  g.hline(H.x0,H.x1,H.y0,P.bcS);g.set(14,H.y1,st);g.set(17,H.y1,st);
  [[A.legL,-1],[A.legR,1]].forEach(([l,s])=>{const sx=s<0?l.x0:l.x1;g.vline(sx,A.sit?l.y0:H.y0,l.y1-1,st);
    if(!A.sit)g.vline(s<0?H.x0:H.x1,H.y0+1,H.y1,st);
    g.set(l.x0,l.y1,null);g.set(l.x1,l.y1,null);g.hline(l.x0+1,l.x1-1,l.y1,P.bcS)});
  if(A.sit){g.vline(A.lap.x0,A.lap.y0,A.lap.y1,st);g.vline(A.lap.x1,A.lap.y0,A.lap.y1,st)}}};
BOT.forEach((b,i)=>CH_BOTP[i]=b);

// ================= CHAUSSURES =================
const SHOE=[];
const feet=A=>[[A.shoeL,A.legL,-1],[A.shoeR,A.legR,1]];
// 0 Baskets : semelle blanche, lacets
SHOE[0]={draw(g,A,P){feet(A).forEach(([s,l,d])=>{const white=lum(P.shc)>.85;const up=white?P.shc:P.shc,sole=white?P.wS:P.w;
  g.hline(s.x0,s.x1,s.y0,up);g.hline(s.x0,s.x1,s.y1,sole);
  const lx=d<0?s.x0+2:s.x1-3;g.hline(lx,lx+1,s.y0,white?P.wS:P.shcS);
  g.set(d<0?s.x1:s.x0,s.y0,white?P.wS:P.shcS);
  // col de cheville
  g.hline(l.x0+1,l.x1-1,s.y0-1,up);g.set(l.x0,s.y0-1,g.get(l.x0,s.y0-1));})}};
// 1 Chaussures de ville : cuir, reflet, talon
SHOE[1]={draw(g,A,P){feet(A).forEach(([s,l,d])=>{const L=chLight(P.shc,.35);
  g.hline(s.x0,s.x1,s.y0,P.shc);g.hline(s.x0,s.x1,s.y1,P.shcS);
  g.set(d<0?s.x0+1:s.x1-1,s.y0,L);g.set(d<0?s.x1:s.x0,s.y1,P.ol);g.set(d<0?s.x0:s.x1,s.y0,null)})}};
// 2 Bottes : montent sur le bas de la jambe
SHOE[2]={draw(g,A,P){feet(A).forEach(([s,l,d])=>{const L=chLight(P.shc,.3),h=Math.min(3,l.y1-l.y0);
  g.rect(l.x0,l.y1-h+1,l.x1,l.y1,P.shc);g.vline(l.x1,l.y1-h+1,l.y1,P.shcS);g.hline(l.x0,l.x1,l.y1-h,L);g.set(l.x1,l.y1-h,P.shc);
  g.hline(s.x0,s.x1,s.y0,P.shc);g.hline(s.x0,s.x1,s.y1,P.shcS);g.set(d<0?s.x0+1:s.x1-1,s.y0,L);g.set(d<0?s.x1:s.x0,s.y1,P.ol)})}};
// 3 Sandales : peau visible, brides
SHOE[3]={draw(g,A,P){feet(A).forEach(([s,l,d])=>{
  g.hline(l.x0,l.x1,s.y0,P.sk);g.set(l.x1,s.y0,P.skS);g.set(d<0?s.x0:s.x1,s.y0,null);
  g.set(l.x0+2,s.y0,P.shc);g.set(l.x0+2,s.y0-1,isSkin(g,l.x0+2,s.y0-1,P)?P.shc:g.get(l.x0+2,s.y0-1));
  if(isSkin(g,l.x0+2,l.y1-1,P)){g.hline(l.x0,l.x1,l.y1-1,P.shc);g.set(l.x1,l.y1-1,P.shcS)}
  g.hline(s.x0,s.x1,s.y1,P.shc);g.set(d<0?s.x1:s.x0,s.y1,P.shcS)})}};
SHOE.forEach((s,i)=>CH_SHOEP[i]=s);
})();


})();
(()=>{
// ===== Pixel Clair : accessoires (chapeaux, lunettes, bijoux) =====
// Remplit CH_HAT, CH_GLS, CH_BIJOU. Tout est positionné via A (repères de pose/taille).
(function(){
// palette courte pour g.put
function K(P,extra){return Object.assign({o:P.ol,a:P.ac,s:P.acS,l:P.acL,w:P.w,W:P.wS,g:P.gold,G:P.goldS,L:P.goldL,m:P.metal,M:P.metalS,k:P.sk,K:P.skS},extra||{})}
// dessine des lignes centrées sur la tête (centre entre x=15 et x=16)
function C(g,y,rows,pal){const w=rows[0].length;g.put(16-w/2,y,rows,pal)}
// efface les cheveux au-dessus d'une ligne (pour qu'un volume ne dépasse pas du chapeau)
function clrAbove(g,y,x0,x1){g.clear(x0==null?8:x0,0,x1==null?23:x1,y)}
const STRAW={y:"#f0cf6a",Y:"#c99a3c",Z:"#fbe7a6",b:"#8a5a2a"};
const LEAF={v:"#4fb348",V:"#2f7d3a"};

const H=[];
H[0]={};
// 1 Casquette (visière vers l'avant)
H[1]={draw(g,A,P){const t=A.t;clrAbove(g,t-4);
  C(g,t-3,[
  "....laaaas....",
  "..llaaaaaass..",
  ".laaaawwaaass.",
  ".laaaawwaaass.",
  "laaaaaaaaaaass",
  ],K(P));
  C(g,t+2,[
  "..llllllllllllllll..",
  "llllllllllllllllllls",
  ".dddddddddddddddddd.",
  ],K(P,{d:chShade(P.ac,.45)}))}};
// 2 Bonnet à pompon
H[2]={draw(g,A,P){const t=A.t;clrAbove(g,t-3);
  C(g,t-7,[
  "......wwww......",
  ".....wwwwWW.....",
  ".....wwwwWW.....",
  "......WWWW......",
  "....laaaaaas....",
  "..llaaaaaaaass..",
  ".laaaaaaaaaaass.",
  ".laaaaaaaaaaass.",
  "lsalsalsalsalsas",
  "lsalsalsalsalsas",
  "lsalsalsalsalsas",
  "oooooooooooooooo",
  ],K(P))}};
// 3 Bandana (à pois, nœud sur le côté)
H[3]={draw(g,A,P){const t=A.t;clrAbove(g,t-2);
  C(g,t-2,[
  "....aaaaaa....",
  "..laawaaawas..",
  ".laaaaaawaass.",
  "lawaaawaaaawas",
  "laaawaaaawaass",
  "sssssssssssss.",
  "oooooooooooooo",
  ],K(P));
  g.put(23,t+1,["sa..","saal","s.as","...s"],K(P))}};
// 4 Casque audio
H[4]={draw(g,A,P){const t=A.t,d="#3b3444",D="#5a5266";clrAbove(g,t-3);
  C(g,t-3,[
  "....dddddddd....",
  "..ddDDDDDDDDdd..",
  ".dDdd......ddDd.",
  "dDd..........dDd",
  "dd............dd",
  ],{d,D});
  const e=A.ear;
  g.put(6,e.y0-2,["odd.","lasd","lasd","lasd","lasd","odd."],K(P,{d}));
  g.put(22,e.y0-2,[".ddo","dasl","dasl","dasl","dasl",".ddo"],K(P,{d}));
  g.set(9,e.y0-2,P.ol);g.set(22,e.y0-2,P.ol)}};
// 5 Couronne (or)
H[5]={draw(g,A,P){const t=A.t,r="#e8304a",b="#3a8ff0";
  C(g,t-5,[
  "L.....LL.....L",
  "gg...gLLg...gG",
  "gLg.gggggg.gGG",
  "ggggggggggggGG",
  "gLrgggbbgggrGG",
  "GGGGGGGGGGGGGG",
  ],K(P,{r,b}))}};
// 6 Bob
H[6]={draw(g,A,P){const t=A.t;clrAbove(g,t-3);
  C(g,t-3,[
  "....laaaaaas....",
  "..llaaaaaaaass..",
  ".laaaaaaaaaaass.",
  ".laaaaaaaaaaass.",
  ".ssssssssssssss.",
  ],K(P));
  C(g,t+2,[
  ".llllllllllllllllll.",
  "laaaaaaaaaaaaaaaaaas",
  "..oooooooooooooooo..",
  ],K(P))}};
// 7 Casquette inversée (visière qui dépasse derrière, ouverture réglable devant)
H[7]={draw(g,A,P,c){const t=A.t,d=chShade(P.ac,.45),h=(c.hair|0)===9?P.sk:P.hc;clrAbove(g,t-5);
  C(g,t-5,[
  "......dddd......",
  "...ssssssssss...",
  "..sssoooooosss..",
  ".sssoo....oosss.",
  ],{d,s:P.acS,o:P.ol});
  C(g,t-3,[
  "....laaaas....",
  "..llaaaaaass..",
  ".laaaaaaaaass.",
  "laaaaaaaaaaass",
  "laaaaoooaaaass",
  "sssssohhhossss",
  ],K(P,{h}));
  g.hline(15,17,t+2,chShade(P.ac,.45))}};
// 8 Durag (tissu brillant, couture centrale, pan qui pend)
H[8]={draw(g,A,P){const t=A.t;clrAbove(g,t-2);
  C(g,t-2,[
  "....llsaaa....",
  "..llaasaaaas..",
  ".llaaasaaaass.",
  "llaaaasaaaaass",
  "laaaaasaaaaass",
  "ssssssssssssss",
  ],K(P));
  g.put(23,t+2,["s","s","a","a","s","a","s"],K(P));g.put(24,t+4,["s","a","s"],K(P))}};
// 9 Chapeau de magicien (pointe courbée, étoiles)
H[9]={draw(g,A,P){const t=A.t,top=Math.max(1,t-8),bot=t+1,n=bot-top+1;
  clrAbove(g,t+1,8,23);
  for(let i=0;i<n;i++){const y=bot-i,f=i/(n-1);let hw=Math.round(6.5*(1-f)*(1-f*.25));if(hw<0)hw=0;
    const bend=i>=n-3?(i-(n-4)):0,cx=15.5+bend;const x0=Math.round(cx-hw-.5),x1=Math.round(cx+hw+.5)-1;const xa=Math.min(x0,x1),xb=Math.max(x0,x1,xa);
    g.hline(xa,xb,y,P.ac);if(xb-xa>=2){g.set(xb,y,P.acS);g.set(xb-1,y,P.acS);g.set(xa,y,P.acL)}}
  // bande dorée
  g.hline(10,21,t,P.gold);g.hline(10,21,t+1,P.goldS);g.set(15,t,P.goldL);g.set(16,t,P.goldL);
  // étoiles
  const sy=Math.round(top+(n-2)*.55);g.put(12,sy-1,[".L.","LgL",".L."],K(P));g.set(18,sy+2,P.goldL);g.set(17,Math.max(top+2,sy-2),P.goldL);
  // bord
  C(g,t+2,[
  "..llllllllllllllllll..",
  "laaaaaaaaaaaaaaaaaaaas",
  ".ssssssssssssssssssss.",
  ],K(P))}};
// 10 Casque de chevalier (visière relevée, plumet)
H[10]={draw(g,A,P){const t=A.t;clrAbove(g,t-2);
  const m=P.metal,M=P.metalS,o=P.ol,w=P.w;
  const py=Math.max(0,t-7);g.put(14,py,["...ll","..lal",".laas","laas.",".as..",".s..."],K(P));
  C(g,t-2,[
  "....wmmmmmmM....",
  "..wwmmmmmmmmMM..",
  ".wmmmmmmmmmmmMM.",
  ".wmmmmmmmmmmmMM.",
  "oooooooooooooooo",
  "wwmmmmmmmmmmmmMM",
  "wmmoomoomoomoomM",
  "oooooooooooooooo",
  ],K(P));
  // protège-joues (le visage reste visible au centre)
  for(let y=t+6;y<=t+12;y++){g.set(8,y,w);g.set(9,y,m);g.set(10,y,o);g.set(21,y,o);g.set(22,y,M);g.set(23,y,M)}
  g.hline(9,10,t+13,M);g.hline(21,22,t+13,M);g.set(10,t+13,o);g.set(21,t+13,o)}};
// 11 Cornes de viking
H[11]={draw(g,A,P){const t=A.t;clrAbove(g,t-3);
  C(g,t-3,[
  ".....mmmmmM.....",
  "...wmmmmmmmmMM..",
  "..wmmmmmmmmmmMM.",
  "..wmmmmmmmmmmMM.",
  ".GgLgGgLgGgLgGg.",
  ".oooooooooooooo.",
  ],K(P));
  g.put(4,t-5,["w...","Ww..","Ww..",".Ww.",".WWw","..WW"],K(P));
  g.put(24,t-5,["...w","..ww","..wW",".wW.","wWW.","WW.."],K(P))}};
// 12 Chapeau de cowboy
H[12]={draw(g,A,P){const t=A.t;clrAbove(g,t-4);
  C(g,t-4,[
  "...laas..laas...",
  "..laaaassaaaas..",
  "..laaaaaaaaaas..",
  "..laaaaaaaaaas..",
  "..oooooooooooo..",
  ],K(P));
  C(g,t+1,[
  "la....................sa",
  "laallllllllllllllllllssa",
  ".saaaaaaaaaaaaaaaaaaass.",
  "...ssssssssssssssssss...",
  ],K(P))}};
// 13 Toque de chef
H[13]={draw(g,A,P){const t=A.t;const topY=Math.max(1,t-6),n=t-topY;clrAbove(g,t,8,23);
  const rows=["..www..www..ww..",".wwwwwwwwwwwwWW.","wwwwwWwwwwWwwwWW","wwwwwWwwwwWwwwWW","wwwwwwwwwwwwwwWW",".WWWWWWWWWWWWWW."];
  const sel=n>=6?rows:rows.slice(0,2).concat(rows.slice(6-n+2));
  C(g,topY,sel,K(P));
  C(g,t,[
  "wwwwwwwwwwwwWW",
  "wwwwwwwwwwwwWW",
  "WWWWWWWWWWWWWW",
  ],K(P))}};
// 14 Auréole (flotte au-dessus, anneau creux)
H[14]={draw(g,A,P){const t=A.t;if(t<8){C(g,Math.max(0,t-4),["...LLLLLLLL...",".LgDDDDDDDDgG.","..GGGGGGGGGG.."],K(P,{D:"#8a5a1a"}));return}
  C(g,t-8,[
  "....LLLLLLLL....",
  "..LL........gg..",
  ".L............G.",
  "..gg........GG..",
  "....GGGGGGGG....",
  ],K(P))}};
// 15 Bandeau ninja (plaque, nœud au côté)
H[15]={draw(g,A,P){const t=A.t,y=t+2;
  g.rect(8,y,23,y+2,P.ac);g.hline(8,23,y+2,P.acS);g.hline(8,23,y,P.acL);g.hline(9,22,y+3,P.ol);
  g.put(13,y-1,["oooooo","omMMmo","oMooMo","omMMmo","oooooo"],K(P));g.set(13,y-1,null);g.set(18,y-1,null);g.set(13,y+3,null);g.set(18,y+3,null);
  g.put(24,y,["aa...","sall.","sa.as","s...a","....s"],K(P))}};
// 16 Couronne de fleurs
H[16]={draw(g,A,P){const t=A.t,v=LEAF.v,V=LEAF.V;
  g.hline(8,23,t+1,V);g.hline(8,23,t,v);
  [[12,t-1],[18,t-1],[8,t-1],[23,t-1]].forEach(([x,y])=>{g.set(x,y,v);g.set(x+1,y,V)});
  const fl=(x,y,p,q,c)=>g.put(x,y,[".pp.","pccq","pcCq",".qq."],{p,q,c,C:P.goldS});
  fl(8,t-2,"#ff7aa8","#d9457a",P.goldL);
  fl(14,t-3,"#fff6d0","#e8cf80",P.gold);
  fl(20,t-2,P.acL,P.acS,P.goldL);
  g.put(11,t,["pq"],{p:"#ffd54a",q:"#e0a020"});g.put(19,t,["pq"],{p:"#ff7aa8",q:"#d9457a"})}};
// 17 Chapeau de pirate (tricorne, tête de mort)
H[17]={draw(g,A,P){const t=A.t;clrAbove(g,t-4);
  C(g,t-5,[
  "........laaaas........",
  "l.....laaaaaaaas.....s",
  "laa.laaaaawwaaaaas.ass",
  "laaaaaaaawwwwaaaaaaass",
  "laaaaaaaawowoaaaaaaass",
  ".laaaaaaaawwaaaaaaass.",
  "..laaaaawawwawaaaass..",
  "..LLLLLLLGLLGLLLLLGG..",
  "...oooooooooooooooo...",
  ],K(P));
  // os croisés (mieux lisibles en blanc)
  g.set(14,t+1,P.wS);g.set(17,t+1,P.wS)}};
// 18 Béret (incliné, tombe sur le côté droit)
H[18]={draw(g,A,P){const t=A.t;clrAbove(g,t-3);
  C(g,t-4,[
  ".......ss.........",
  "....llaaaaaaas....",
  "..llaaaaaaaaaaas..",
  ".laaaaaaaaaaaaaas.",
  ".laaaaaaaaaaaaaass",
  "..sssssssssssssass",
  "..oooooooooooo.ss.",
  ],K(P))}};
// 19 Chapeau de paille
H[19]={draw(g,A,P){const t=A.t;clrAbove(g,t-3);
  C(g,t-4,[
  "....ZyyyyyyY....",
  "...ZyyYyyYyyY...",
  "...ZyyyyyyyyY...",
  "...aaaaaaaaas...",
  "...ssssssssss...",
  ],K(P,STRAW));
  C(g,t+1,[
  "..ZZZyZZZyZZZyZZZyZZZ..",
  "ZyyyyYyyyYyyyYyyyYyyyyY",
  ".YYYYYYYYYYYYYYYYYYYYY.",
  ],K(P,STRAW))}};
// 20 Bonnet de Noël (rouge, fourrure blanche, pointe qui retombe à droite avec pompon)
const XRED={r:"#d8343c",R:"#a02232",q:"#f0646a"},ANT={b:"#9a6434",B:"#64401f",n:"#c48a52"};
// comme g.put, mais saute les lignes au-dessus de y=1 (grandes tailles : le haut reste détouré au lieu d'être coupé)
function putTop(g,x,y,rows,pal){const k=Math.max(0,1-y);g.put(x,y+k,rows.slice(k),pal)}
H[20]={draw(g,A,P){const t=A.t;clrAbove(g,t-3);
  // bras droit levé : la pointe et le pompon passent derrière la main
  const keep=[];if(A.armR.up)for(let y=Math.max(0,t-8);y<=t+3;y++)for(let x=24;x<=28;x++){const v=g.get(x,y);if(v)keep.push([x,y,v])}
  putTop(g,8,t-7,[
  "........rrrr......",
  "......qrrrrrRR....",
  ".....qrrrrrrrRRr..",
  "...qqrrrrrrrRR.rR.",
  "..qrrrrrrrrrrRR.rR",
  ".qrrrrrrrrrrrrR.rR",
  ".qrrrrrrrrrrrrRR.ww",
  "qrrrrrrrrrrrrrrR.wwW",
  ],K(P,XRED));
  g.set(25,t-1,P.wS);g.hline(25,26,t+1,P.wS);g.set(27,t,P.wS);
  keep.forEach(([x,y,v])=>g.set(x,y,v));
  C(g,t+1,[
  ".wwWwwwWwwwWwww.",
  "wwwwwwwwwwwwwwwW",
  "WwWWWwWWWwWWWwWW",
  "oooooooooooooooo",
  ],K(P))}};
// 21 Bois de renne (serre-tête, bois ramifiés, petits grelots)
H[21]={draw(g,A,P){const t=A.t;clrAbove(g,t-2,10,21);
  const pal=K(P,ANT),Lr=[
  "b..b...",
  "bb.bn..",
  ".bbbB..",
  "..nbB..",
  "...bB..",
  "...bB..",
  ];
  putTop(g,7,t-7,Lr,pal);putTop(g,18,t-7,Lr.map(r=>[...r].reverse().join("")),pal);
  // serre-tête qui suit le haut de la tête
  g.hline(10,21,t-1,P.ac);g.hline(12,19,t-2,P.ac);g.set(13,t-2,P.acL);g.set(14,t-2,P.acL);g.set(9,t,P.ac);g.set(22,t,P.acS);g.set(21,t-1,P.acS);g.set(19,t-2,P.acS);
  // grelots rouges à la base des bois
  [12,19].forEach(x=>{g.set(x,t-3,"#e8404a");g.set(x,t-4,P.gold)})}};
H.forEach((h,i)=>CH_HAT[i]=h);

// ================= LUNETTES =================
const G=[];G[0]={};
function lens(g,A,rows,pal,dyL){[A.eyeL,A.eyeR].forEach((e,i)=>{const r=rows[i]||rows[0];g.put(e.x-Math.floor(r[0].length/2),e.y+(dyL||-1),r,pal)})}
// 1 Rondes
G[1]={draw(g,A,P){const y=A.eyeL.y;lens(g,A,[[".ooo.","ow..o","o...o",".ooo."]],K(P));g.hline(15,16,y,P.ol);g.set(9,y,P.ol);g.set(22,y,P.ol)}};
// 2 Carrées (monture épaisse colorée)
G[2]={draw(g,A,P){const y=A.eyeL.y;
  [A.eyeL,A.eyeR].forEach(e=>{g.put(e.x-3,y-2,["aaaaaa","o....o","o....o","oooooo"],K(P));g.set(e.x-2,y-1,P.w)});
  g.hline(15,16,y-1,P.ac);g.set(9,y-1,P.ac);g.set(22,y-1,P.ac);g.hline(15,16,y-2,P.ol)}};
// 3 Soleil
G[3]={draw(g,A,P){const y=A.eyeL.y,d="#1b1822";
  g.hline(9,22,y-1,P.ol);
  [A.eyeL,A.eyeR].forEach(e=>g.put(e.x-2,y,["dwddd","ddwdd",".ddd."],{d,w:"#8e8aa8"}));
  g.hline(15,16,y,P.ol)}};
// 4 Cœur
G[4]={draw(g,A,P){const y=A.eyeL.y,p="#ff4f8b",q="#c22a63",h="#ffc0d8";
  [A.eyeL,A.eyeR].forEach(e=>g.put(e.x-2,y-1,["pp.pp","hpppq",".pqq.","..q.."],{p,q,h}));
  g.hline(15,16,y,P.ol);g.set(9,y,P.ol);g.set(22,y,P.ol)}};
// 5 Masque (loup)
G[5]={draw(g,A,P){const y=A.eyeL.y;
  C(g,y-2,[
  "a..............a",
  "laa..........aas",
  "laaaaaaaaaaaaaas",
  "laaaaaaaaaaaaass",
  ".lsaaassssaaass.",
  "..sss......sss..",
  ],K(P));
  [A.eyeL,A.eyeR].forEach(e=>{g.put(e.x-1,y,["wow","WoW"],K(P))})}};
// 6 Monocle
G[6]={draw(g,A,P){const e=A.eyeR,y=e.y;
  g.put(e.x-2,y-2,[".ggg.","gw..G","g...G","g...G",".GGG."],K(P));
  [[3,3],[3,4],[4,5],[4,6],[4,7],[4,8]].forEach(([dx,dy],i)=>g.set(e.x+dx,y+dy,i%2?P.goldS:P.gold))}};
// 7 Visière cyber
G[7]={draw(g,A,P){const y=A.eyeL.y,c="#3ff0ff",C2="#18a6c8",h="#d8ffff";
  g.hline(8,23,y-2,P.ol);
  g.hline(8,23,y-1,C2);g.hline(8,23,y,c);g.hline(8,23,y+1,C2);
  g.hline(8,23,y+2,P.ol);
  [A.eyeL,A.eyeR].forEach(e=>{g.set(e.x,y,h);g.set(e.x,y-1,c)});g.set(10,y,h);g.set(8,y-1,"#5a6478");g.set(23,y-1,"#5a6478");g.set(8,y,"#5a6478");g.set(23,y,"#5a6478");g.set(8,y+1,"#5a6478");g.set(23,y+1,"#5a6478")}};
// 8 Lunettes dorées (aviateur)
G[8]={draw(g,A,P){const y=A.eyeL.y,b="#7a4a2a",B="#a86a3a";
  g.hline(9,22,y-1,P.gold);g.hline(15,16,y-1,P.goldL);
  [A.eyeL,A.eyeR].forEach(e=>g.put(e.x-2,y-1,["GgggG","gBbbG","gbbbG",".GGG."],K(P,{b,B})));
  g.set(9,y-1,P.goldS);g.set(22,y-1,P.goldS)}};
G.forEach((v,i)=>CH_GLS[i]=v);

// ================= BIJOUX =================
const B=[];B[0]={};
function hoops(g,A,P){const y=A.ear.y1+1;g.put(7,y,[".g","g.",".G"],K(P));g.put(23,y,["g.",".g","G."],K(P))}
function chain(g,A,P){const t=A.torso.y0;
  const pts=[[11,0],[12,1],[13,2],[14,2],[15,3],[16,3],[17,2],[18,2],[19,1],[20,0]];
  pts.forEach(([x,dy],i)=>g.set(x,t+dy,i%2?P.goldS:P.gold));g.set(15,t+3,P.goldL)}
B[1]={draw:hoops};
B[2]={draw:chain};
B[3]={draw(g,A,P){hoops(g,A,P);chain(g,A,P)}};
B[4]={draw(g,A,P){const y=A.mouth.y-1;g.set(15,y,P.w);g.set(16,y,P.metalS);g.set(17,y-1,P.metal)}};
B[5]={draw(g,A,P){const t=A.torso.y0;
  const pts=[[10,0],[11,0],[12,1],[13,1],[14,2],[15,2],[16,2],[17,2],[18,1],[19,1],[20,0],[21,0]];
  pts.forEach(([x,dy],i)=>{g.set(x,t+dy,i%2?P.wS:P.w)})}};
B[6]={draw(g,A,P){const y=A.ear.y1+1,d="#7fe8ff",D="#2fb0e0",L="#e8fdff";g.put(7,y,[".L","dL",".D"],{L,d,D});g.put(23,y,["L.","Ld","D."],{L,d,D})}};
B[7]={draw(g,A,P){const t=A.torso.y0;
  const pts=[[11,0],[12,1],[13,2],[18,2],[19,1],[20,0]];pts.forEach(([x,dy])=>g.set(x,t+dy,P.goldS));
  g.put(14,t+2,[".gg.","gLgG","gaaG","gssG",".GG."],K(P))}};
// 8 Écharpe (rayée couleur d'accessoire + blanc, un pan qui tombe sur la poitrine)
B[8]={draw(g,A,P){const n=A.neck,Y=A.torso.y0,a=P.ac,s=P.acS,l=P.acL,w=P.w,W=P.wS,d=chShade(P.ac,.55);
  // tour de cou épais (rayures verticales)
  const rows=[[12,19,n.y0],[11,20,n.y1],[10,21,Y]];
  rows.forEach(([x0,x1,y],r)=>{for(let x=x0;x<=x1;x++){const st=(x-10)%4===3;g.set(x,y,st?(r===2?W:w):(r===2?s:(x===x0?l:a)))}});
  g.hline(11,20,Y+1,d);
  // pan qui pend (3 px) sur le côté droit, rayures horizontales, franges
  const x0=17,y0=Y+1,len=Math.max(4,Math.min(7,A.torso.y1-y0-3));
  for(let i=0;i<len;i++){const st=(i%3)===2;g.set(x0,y0+i,st?w:l);g.set(x0+1,y0+i,st?w:a);g.set(x0+2,y0+i,st?W:s)}
  g.vline(x0-1,y0,y0+len-1,d);g.vline(x0+3,y0+1,y0+len-1,d);
  g.set(x0,y0+len,a);g.set(x0+2,y0+len,s);g.set(x0+1,y0+len,d);g.set(x0-1,y0+len,null);
  // nœud
  g.set(x0,Y,s);g.set(x0+1,n.y1,s)}};
B.forEach((v,i)=>CH_BIJOU[i]=v);
})();


})();
(()=>{
// ===== Pixel Clair : objets tenus en main (CH_MAIN) + icônes d'inventaire 16x16 (chItemIcon) =====
(function(){
// --- couleurs fixes de matière
const C={
  wood:"#b8733a",woodS:"#7e4a22",
  dark:"#4a4f63",darkS:"#33364a",
  pad:"#6a7088",padS:"#484d63",padL:"#e8ecf2",
  iron:"#5d6478",ironS:"#3c4153",
  red:"#d63b3b",redS:"#9a2433",redL:"#ff7a8a",
  green:"#4caf50",greenS:"#2e7d32",
  blue:"#3a7ad0",yel:"#f0c040",grn:"#3fbf6a",
  glass:"#3a6aa8",glassL:"#9ad0ff",
  book:"#6a3fa0",bookS:"#4a2a78",spine:"#3a2260",page:"#f2ecd8",pageS:"#cfc4a8",
  teal:"#3fb0d0",tealS:"#2a7f9a",
  leather:"#9a6332",leatherS:"#6b4220",
  coffee:"#6b3a1e",steam:"#eef3f8",
  guitar:"#e0913a",guitarS:"#b0642a",guitarL:"#f6c27a",neck:"#6b4226",neckS:"#45291a",hole:"#3a2418",
  bristle:"#ead2a0",clap:"#3e3e4c",clapL:"#c8ccd6"};

// --- palette commune des sprites tenus
function basePal(P){return{h:P.sk,H:P.skS,g:P.gold,G:P.goldS,y:P.goldL,m:P.metal,M:P.metalS,w:P.w,W:P.wS,a:P.ac,A:P.acS,k:P.ol}}

// Dessine un sprite relatif à la main droite.
// it.rows : lignes (sans contour : le contour sombre est ajouté seulement là où l'objet recouvre le corps,
//           le contour automatique du moteur s'occupe du reste)
// v.f=[fx,fy] : poing (3x2) superposé en (fx..fx+2, fy..fy+1) ; la prise = (fx+1, fy+1)
// v.g=[gx,gy] : prise sans poing visible (objet devant la main)
function drawHeld(g,A,P,it){
  const up=!!A.handR.up,v=(up&&it.u)||it.d,rows=(up&&it.ru)||it.rows;
  const pal=Object.assign(basePal(P),it.pal?it.pal(P):{});
  const cells=new Map(),hand=new Set(),K=(x,y)=>x+","+y;
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=="."&&pal[ch])cells.set(K(x,y),[x,y,pal[ch]])}));
  let gx,gy;
  if(v.f){const[fx,fy]=v.f;gx=fx+1;gy=fy+1;
    for(let i=0;i<3;i++){const t=up?[P.skS,P.sk]:[P.sk,P.skS];
      cells.set(K(fx+i,fy),[fx+i,fy,t[0]]);cells.set(K(fx+i,fy+1),[fx+i,fy+1,t[1]]);hand.add(K(fx+i,fy));hand.add(K(fx+i,fy+1))}}
  else{gx=v.g[0];gy=v.g[1]}
  let ox=A.handR.x-gx,oy=A.handR.y-gy;
  // reste dans la grille (1 px de marge pour le contour)
  let x0=99,x1=-99,y0=99,y1=-99;cells.forEach(([x,y])=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)});
  if(ox+x1>g.W-2)ox=g.W-2-x1;if(ox+x0<1)ox=1-x0;if(oy+y0<1)oy=1-y0;if(oy+y1>g.H-2)oy=g.H-2-y1;
  paintCells(g,P,cells,hand,ox,oy)}

// pose les pixels puis un contour sombre là où l'objet touche le corps
function paintCells(g,P,cells,hand,ox,oy){
  const ring=[];hand=hand||new Set();
  cells.forEach(([x,y],k)=>{if(hand.has(k))return;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const nx=x+dx,ny=y+dy;if(!cells.has(nx+","+ny)&&g.get(ox+nx,oy+ny))ring.push([ox+nx,oy+ny])})});
  cells.forEach(([x,y,c])=>g.set(ox+x,oy+y,c));
  ring.forEach(([x,y])=>g.set(x,y,P.ol))}

const S=(rows,d,u,pal,ru)=>({draw:(g,A,P)=>drawHeld(g,A,P,{rows,d,u,pal,ru})});

// --- montre au poignet
function drawWatch(g,A,P){const a=A.armR,h=a.hand,cx=a.x0+1;
  const rows=[".ygG.","gwwwG",".GGG."],pal={g:P.gold,G:P.goldS,y:P.goldL,w:P.w,k:P.ol};
  const cells=new Map();rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!==".")cells.set(x+","+y,[x,y,pal[ch]])}));
  paintCells(g,P,cells,null,cx-2,a.up?h.y1+1:h.y0-3)}

// --- guitare en bandoulière
function drawGuitar(g,A,P){const t=A.t,cells=new Map(),put=(x,y,c)=>cells.set(x+","+y,[x,y,c]);
  const lb=[16.5,t+25.5,4.1],ub=[13,t+21.5,3.1];const inC=(x,y,c)=>(x+.5-c[0])**2+(y+.5-c[1])**2<=c[2]*c[2];
  const inB=(x,y)=>inC(x,y,lb)||inC(x,y,ub);
  // manche (diagonale 2 px) + tête
  for(let i=0;i<=6;i++){put(12-i,t+18-i,C.neck);put(13-i,t+18-i,C.neck)}
  [[4,t+10],[5,t+10],[4,t+11],[5,t+11],[6,t+11],[5,t+12]].forEach(([x,y])=>put(x,y,C.neckS));
  put(3,t+10,P.metal);put(4,t+9,P.metal);
  // caisse
  for(let y=t+16;y<=t+31;y++)for(let x=8;x<=20;x++)if(inB(x,y)){
    const edge=!inB(x+1,y)||!inB(x,y+1);put(x,y,edge?C.guitarS:C.guitar)}
  [[12,t+20],[11,t+21],[13,t+19]].forEach(([x,y])=>{if(inB(x,y))put(x,y,C.guitarL)});
  // rosace + chevalet + cordes
  [[14,t+22],[15,t+22],[14,t+23],[15,t+23]].forEach(([x,y])=>put(x,y,C.hole));
  put(17,t+26,C.neckS);put(18,t+26,C.neckS);put(18,t+27,C.neckS);
  put(16,t+24,C.guitarL);put(17,t+25,C.guitarL);
  // sangle sur l'épaule droite
  for(let y=t+16;y<=t+24&&!inB(19,y);y++)put(19,y,P.ac);
  paintCells(g,P,cells,null,0,0)}

const M=[];
M[0]={};
// 1 Micro
M[1]=S([".wmM.","wmMmM","mMmMM",".MMM.",".aaA.",".....",".....","..k..","..k.."],{f:[1,5]},{f:[1,5]},P=>({k:"#5c6175"}));
// 2 Disque d'or
M[2]=S(["..yyg..",".ygggG.","ygaaagG","ggakagG","ggaaagG",".gggGG.","..GGG.."],{f:[-1,4]},{f:[2,6]});
// 3 Manette
M[3]=S([".dwddddyd.","dwwwddbdaD","ddwddddedD","ddD....ddD"],{f:[7,2]},{f:[4,3]},
  P=>({d:C.pad,D:C.padS,w:C.padL,y:C.yel,b:C.blue,e:C.grn,a:P.ac}));
// 4 Clap
M[4]=S(["dwwddww","m......","wwddwwd","ddddddD","dLLLLLD","ddddddD"],{f:[-1,4]},{f:[2,5]},
  P=>({d:"#4a4a5a",D:"#34343f",L:C.clapL,w:P.w,m:P.metal}));
// 5 Grimoire
M[5]=S(["sgpppgw","sppyppw","spygGpW","sppGpqW","sppppqW","sgqqqgW"],{f:[-1,4]},{f:[2,5]},
  P=>({s:C.spine,p:C.book,q:C.bookS,w:C.page,W:C.pageS}));
// 6 Montre en or (au poignet)
M[6]={draw:drawWatch};
// 7 Boussole
M[7]=S(["...g...",".yggGG.","gwwawwG","gwwawwG","gwwdwwG",".gGGGG."],{f:[-1,4]},{f:[2,5]},
  P=>({w:"#f6efd8",a:C.red,d:C.dark}));
// 8 Appareil photo
M[8]=S(["..ddd.a.","wmmmmmmM","mmkkkkmM","ddkblkdD","ddkkkkdD","DDDDDDDD"],{f:[-1,4]},{f:[3,5]},
  P=>({d:C.dark,D:C.darkS,b:C.glassL,l:C.glass,a:C.red}));
// 9 Haltère
M[9]=S(["pP.....pP","pP.....pP","pPb...bpP","pPB...BpP","pP.....pP","PP.....PP"],{f:[3,2]},{f:[3,2]},
  P=>({p:C.iron,P:C.ironS,b:P.metal,B:P.metalS}));
// 10 Fourchette d'or
M[10]=S(["y.g.G","y.g.G","ygggG",".ggG.","..g..","..g..","..g..","..g..","..G..","..G.."],{f:[1,6]},{f:[1,6]});
// 11 Bouclier
M[11]=S(["wmmmmmM","maagaAM","magggAM","maagaAM","maagaAM",".maaAM.","..mAM..","...M..."],{g:[2,4]},{f:[2,7]});
// 12 Pinceau
M[12]=S([".a.","aaA","bbB","mmM",".r.",".r.","...","...",".r.",".R."],{f:[0,6]},{f:[0,6]},
  P=>({b:C.bristle,B:"#c8a870",r:C.wood,R:C.woodS}));
// 13 Gourde
M[13]=S(["..d..",".....",".....","ttttT","tLttT","wwwwW","tLttT","ttttT",".TTT."],{f:[1,1]},{f:[1,1]},
  P=>({d:C.dark,D:C.darkS,t:C.teal,T:C.tealS,L:"#8fe0f0"}));
// 14 Épée (lame vers le bas, ou brandie vers le haut)
M[14]=S(["..y..",".....",".....","yggGG",".wmM.",".wmM.",".wmM.",".wmM.",".wmM.",".wmM.",".wmM.","..M.."],{f:[1,1]},{f:[1,7]},null,
  ["..w..",".wmM.",".wmM.",".wmM.",".wmM.",".wmM.","yggGG",".....",".....","..g.."]);
// 15 Guitare
M[15]={draw:drawGuitar};
// 16 Rose
M[16]=S([".rrR.","rlrRR","rrRRR",".RRR.","..e..",".ee..","..e..","..e..","..e.."],{f:[1,6]},{f:[1,6]},
  P=>({r:C.red,R:C.redS,l:C.redL,e:C.green}));
// 17 Tasse de café
M[17]=S([".....s..","....s.s.","....s.s.","...wcccW","..wwwwwW","...aaaaA","...wwwwW","...WWWWW"],{f:[0,5]},{f:[0,5]},
  P=>({s:C.steam,c:C.coffee}));
// 18 Ballon
M[18]=S(["..wkw..",".wwwww.","kwkkkwk","wwkkkwW","wwwkwwW",".kwwWk.","..WWW.."],{f:[-1,4]},{f:[2,6]},
  P=>({k:"#2c2c36"}));
// 19 Mallette
M[19]=S([".........","..B...B..","bbbbbbbbB","bbbbbbbbB","BBgBBBgBB","bbbbbbbbB","bbbbbbbbB","BBBBBBBBB"],{f:[3,0]},{f:[3,6]},
  P=>({b:C.leather,B:C.leatherS}),
  ["bbbbbbbbB","bbbbbbbbB","BBgBBBgBB","bbbbbbbbB","BBBBBBBBB","..B...B.."]);
// 62 Sucre d'orge (rayures rouges et blanches en diagonale)
const CANE=[".####.","##..##","##..##","#...##","....##","....##","....##","....##","....##","....##","....##"];
function caneRows(m){return m.map((r,y)=>[...r].map((ch,x)=>{if(ch!=="#")return".";const red=((x-y)%4+4)%4<2,edge=x===r.lastIndexOf("#");return red?(edge?"R":"r"):(edge?"W":"w")}).join(""))}
M[62]=S(caneRows(CANE),{f:[3,6]},{f:[3,6]},P=>({r:"#d8343c",R:"#a02232",w:"#fbf6ee",W:"#d8d2c8"}));
M.forEach((m,i)=>{CH_MAIN[i]=m});

// =================== icônes 16x16 ===================
const OL="#24182c";
function grid(){const a=[];for(let y=0;y<16;y++)a.push(Array(16).fill("."));
  const o={a,
    s(x,y,c){if(x>=0&&x<16&&y>=0&&y<16)a[y][x]=c},
    r(x0,y0,x1,y1,c){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)o.s(x,y,c)},
    p(x0,y0,rows){rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c!==".")o.s(x0+x,y0+y,c)}))},
    each(f){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=f(x,y,a[y][x]);if(v)a[y][x]=v}},
    ol(){const b=a.map(r=>r.slice());for(let y=0;y<16;y++)for(let x=0;x<16;x++){if(b[y][x]!==".")continue;
      const n=(x>0&&b[y][x-1]!==".")||(x<15&&b[y][x+1]!==".")||(y>0&&b[y-1][x]!==".")||(y<15&&b[y+1][x]!==".");if(n)a[y][x]="o"}},
    out(pal){o.ol();return{rows:a.map(r=>r.join("")),pal:Object.assign({o:OL},pal)}}};
  return o}
const D=(x,y,cx,cy)=>Math.hypot(x+.5-cx,y+.5-cy);
const GOLD={g:"#f0c040",G:"#b8862a",y:"#fff0a0"},MET={m:"#c8d0da",M:"#8a94a3",w:"#ffffff",W:"#d8dee6"};

const ICON=[];
ICON[1]=()=>{const q=grid();
  q.each((x,y)=>{const d=D(x,y,8,4.6);if(d<=3.7){const s=(x+.5-8)+(y+.5-4.6);return s>2.2?"M":((x+y)%2&&d<2.9?"M":"m")}});
  q.s(5,2,"w");q.s(6,2,"w");q.s(5,3,"w");q.s(6,1,"w");
  q.r(5,8,10,8,"a");q.s(10,8,"A");q.r(5,9,10,9,"A");
  q.r(6,10,9,11,"d");q.r(9,10,9,11,"D");q.r(7,12,8,14,"d");q.r(8,12,8,14,"D");
  return q.out(Object.assign({},MET,{a:"#d63b3b",A:"#9a2433",d:"#5c6175",D:"#3e4253"}))};
ICON[2]=()=>{const q=grid();
  q.each((x,y)=>{const d=D(x,y,8,8),s=(x+.5-8)+(y+.5-8);if(d>6.9)return;
    if(d<=0.8)return"k";if(d<=2.6)return s>1?"A":"a";
    const groove=(d>=3.6&&d<=4.2)||(d>=5.2&&d<=5.8);
    if(s>3.2)return groove?"g":"G";if(groove)return"G";
    if(s<-5.5&&d>4.2&&d<5.2)return"y";return"g"});
  return q.out(Object.assign({},GOLD,{a:"#d63b3b",A:"#9a2433",k:OL}))};
ICON[3]=()=>{const q=grid();
  q.p(0,4,["...dddddddddd...",
           "..ddwdddddddydd.",
           ".ddwwwdkdkdbdaD.",
           ".dddwdddddddedD.",
           ".ddddDDDDDDdddD.",
           ".dddD......dddD.",
           "..ddD......ddD.."]);
  q.r(3,4,4,4,"l");
  return q.out({d:C.pad,D:C.padS,l:"#8e95ad",w:C.padL,k:OL,y:C.yel,b:C.blue,a:C.red,e:C.grn})};
ICON[4]=()=>{const q=grid();
  // claquette ouverte (inclinée), charnière à gauche
  q.each((x,y)=>{if(x<1||x>14)return;const yt=4-(x-1)*0.23;if(y>=yt-0.5&&y<yt+1.5)return((x-y*2+40)%4<2)?"w":"d"});
  q.s(1,5,"m");
  q.each((x,y)=>{if(y>=6&&y<=7&&x>=1&&x<=14)return((x+y*2)%4<2)?"w":"d"});
  q.r(1,8,14,14,"d");q.r(14,8,14,14,"D");q.r(1,14,14,14,"D");
  q.r(3,10,12,10,"L");q.r(3,12,7,12,"L");q.r(9,12,12,12,"L");
  return q.out({w:"#ffffff",d:"#4a4a5a",D:"#34343f",L:C.clapL,m:"#c8d0da"})};
ICON[5]=()=>{const q=grid();
  q.r(2,1,12,13,"p");q.r(2,1,3,13,"s");q.r(12,1,12,13,"q");q.r(4,13,12,13,"q");
  q.r(13,2,13,14,"w");q.r(3,14,13,14,"w");q.r(13,14,13,14,"W");for(let y=3;y<14;y+=2)q.s(13,y,"W");
  [[4,2],[5,2],[4,3],[11,2],[10,2],[11,3],[4,12],[5,12],[4,11],[11,12],[10,12],[11,11]].forEach(([x,y])=>q.s(x,y,x>=10?"G":"g"));
  q.each((x,y,c)=>{const dx=Math.abs(x+.5-7.5),dy=Math.abs(y+.5-7.5);if(dx+dy<=3.2)return(x+.5-7.5)+(y+.5-7.5)>0?"G":"g"});
  q.s(6,5,"y");q.r(7,7,7,7,"a");q.r(7,6,8,7,"a");q.s(8,7,"A");
  q.r(9,14,9,15,"a");
  return q.out(Object.assign({},GOLD,{p:C.book,q:C.bookS,s:C.spine,w:C.page,W:C.pageS,a:"#d63b3b",A:"#9a2433"}))};
ICON[6]=()=>{const q=grid();
  q.r(5,1,10,3,"g");q.r(5,12,10,14,"g");for(let x=5;x<=10;x++){q.s(x,2,"G");q.s(x,13,"G")}q.r(10,1,10,3,"G");q.r(10,12,10,14,"G");
  q.each((x,y)=>{const d=D(x,y,8,8),s=(x+.5-8)+(y+.5-8);if(d<=3.4)return"w";if(d<=4.9)return s>1.5?"G":(s<-3.5?"y":"g")});
  q.s(13,7,"g");q.s(13,8,"G");
  q.s(8,5,"G");q.s(8,10,"G");q.s(5,8,"G");q.s(10,8,"G");
  q.r(7,5,7,7,"k");q.r(7,7,9,7,"k");q.s(7,8,"a");
  return q.out(Object.assign({},GOLD,{w:"#ffffff",k:OL,a:"#d63b3b"}))};
ICON[7]=()=>{const q=grid();
  q.r(6,0,9,0,"g");q.s(6,1,"g");q.s(9,1,"G");
  q.each((x,y)=>{const d=D(x,y,8,9),s=(x+.5-8)+(y+.5-9);if(d<=4.7)return"w";if(d<=6.4)return s>2?"G":(s<-5&&d>5.6?"y":"g")});
  q.s(7,2,"G");q.s(8,2,"G");
  [[7,5],[8,5],[7,6],[8,6],[6,7],[7,7],[8,7],[9,7],[6,8],[7,8],[8,8],[9,8]].forEach(([x,y])=>q.s(x,y,x>=8?"A":"a"));
  [[6,9],[7,9],[8,9],[9,9],[6,10],[7,10],[8,10],[9,10],[7,11],[8,11],[7,12],[8,12]].forEach(([x,y])=>q.s(x,y,x>=8?"M":"m"));
  q.s(7,8,"k");q.s(8,8,"k");
  q.s(4,9,"G");q.s(11,9,"G");q.s(8,4,"G");q.s(7,13,"G");
  return q.out(Object.assign({},GOLD,{w:"#f6efd8",a:"#d63b3b",A:"#9a2433",m:"#8a94a3",M:"#5c6175",k:OL}))};
ICON[8]=()=>{const q=grid();
  q.r(9,2,12,3,"d");q.r(12,2,12,3,"D");q.r(3,3,4,3,"a");
  q.r(1,4,14,13,"d");q.r(1,4,14,6,"m");q.r(14,4,14,6,"M");q.r(14,7,14,13,"D");q.r(1,13,14,13,"D");q.r(2,4,3,4,"w");
  q.r(11,5,12,5,"w");
  q.each((x,y)=>{const d=D(x,y,8,9.5),s=(x+.5-8)+(y+.5-9.5);if(d<=1.6)return s<-0.5?"b":"l";if(d<=2.6)return"k";if(d<=3.7)return s>1?"M":"m"});
  return q.out(Object.assign({},MET,{d:C.dark,D:C.darkS,a:"#d63b3b",k:OL,l:C.glass,b:C.glassL}))};
ICON[9]=()=>{const q=grid();
  q.r(5,7,10,8,"m");q.r(5,8,10,8,"M");
  [[2,3,4,12],[11,3,13,12]].forEach(([x0,y0,x1,y1])=>{q.r(x0,y0,x1,y1,"p");q.r(x1,y0,x1,y1,"P");q.r(x0,y1,x1,y1,"P");q.r(x0,y0,x0,y1-1,"L")});
  q.r(1,5,1,10,"p");q.r(14,5,14,10,"P");q.s(1,10,"P");
  return q.out(Object.assign({},MET,{p:C.iron,P:C.ironS,L:"#7a8296"}))};
ICON[10]=()=>{const q=grid();
  [4,6,8,10].forEach(x=>q.r(x,1,x,5,x>=10?"G":(x===4?"y":"g")));
  q.r(4,6,10,6,"g");q.r(5,7,9,7,"g");q.s(10,6,"G");q.s(9,7,"G");
  q.r(7,8,8,10,"g");q.r(8,8,8,10,"G");
  q.r(6,11,9,13,"g");q.r(9,11,9,13,"G");q.r(7,14,8,14,"G");q.r(6,11,6,12,"y");
  return q.out(GOLD)};
ICON[11]=()=>{const q=grid();
  const inS=(x,y)=>{if(y<1||y>14)return false;const w=[0,7,7,7,7,7,7,7,7,7,6,5,4,3,1][y]||0;return Math.abs(x+.5-8)<=w-0.5+0.5&&x>=1&&x<=14};
  q.each((x,y)=>{if(!inS(x,y))return;const edge=!inS(x-1,y)||!inS(x+1,y)||!inS(x,y-1)||!inS(x,y+1);
    if(edge)return(x>=8&&!inS(x+1,y))||!inS(x,y+1)&&x>=8?"M":"m";return x>=12?"A":"a"});
  q.r(7,2,8,12,"g");q.r(2,5,13,6,"g");q.r(8,2,8,12,"G");q.r(9,6,13,6,"G");q.s(8,5,"g");
  q.s(2,2,"w");q.s(3,2,"w");q.s(2,3,"w");
  return q.out(Object.assign({},GOLD,MET,{a:"#d63b3b",A:"#9a2433"}))};
ICON[12]=()=>{const q=grid();
  q.each((x,y)=>{const u=x-y,v=x+y;
    if(u>=-13&&u<=-1&&(v===15||v===16))return u===-13&&v===16?null:(v===16?"R":"r");
    if(u>=0&&u<=3&&v>=14&&v<=16)return v===16?"M":(v===14?"w":"m");
    if(u>=4&&u<=6&&v>=14&&v<=16)return v===16?"B":"b";
    if(u>=7&&u<=9&&v>=14&&v<=16)return v===16?"A":"a";
    if(u>=10&&u<=11&&v===15)return"a"});
  q.s(13,3,".");
  return q.out(Object.assign({},MET,{r:C.wood,R:C.woodS,b:C.bristle,B:"#c8a870",a:"#2f6fd6",A:"#1f4a9a"}))};
ICON[13]=()=>{const q=grid();
  q.r(7,1,8,2,"d");q.s(8,1,"D");q.r(5,3,10,4,"d");q.r(10,3,10,4,"D");
  q.r(4,5,11,14,"t");q.r(11,5,11,14,"T");q.r(4,14,11,14,"T");q.s(4,14,".");q.s(11,14,".");q.r(5,15,10,15,".");
  q.r(4,8,11,10,"w");q.r(11,8,11,10,"W");q.r(5,6,5,7,"L");q.r(5,11,5,12,"L");
  q.s(7,9,"a");q.s(8,9,"a");
  return q.out(Object.assign({},MET,{d:C.dark,D:C.darkS,t:C.teal,T:C.tealS,L:"#8fe0f0",a:"#3fb0d0"}))};
ICON[14]=()=>{const q=grid();
  q.each((x,y)=>{const u=x-y,v=x+y;
    if(u>=-2&&u<=9&&v>=14&&v<=16)return v===14?"w":(v===16?"M":"m");
    if(u>=10&&u<=11&&v===15)return"w";if(u===10&&v===16)return"M";
    if((u===-4||u===-3)&&v>=10&&v<=20)return u===-4?"G":"g";
    if(u>=-9&&u<=-5&&(v===15||v===16))return v===16?"R":"r";
    if(u>=-11&&u<=-10&&v>=14&&v<=16)return v===16?"G":"g"});
  return q.out(Object.assign({},GOLD,MET,{r:"#6b4226",R:"#45291a"}))};
ICON[15]=()=>{const q=grid();
  const lb=[5.3,11,3.9],ub=[8.4,7.8,2.9],inC=(x,y,c)=>D(x,y,c[0],c[1])<=c[2],inB=(x,y)=>inC(x,y,lb)||inC(x,y,ub);
  q.each((x,y)=>{if(!inB(x,y))return;return(!inB(x+1,y)||!inB(x,y+1))?"B":"b"});
  q.each((x,y)=>{const u=x-y,v=x+y;if(u>=2&&u<=9&&(v===16||v===17))return v===17?"N":"n";
    if(u>=10&&u<=11&&v>=14&&v<=17)return"N"});
  q.s(12,1,"m");q.s(14,2,"m");q.s(15,4,".");
  q.s(6,8,"L");q.s(7,6,"L");q.s(6,7,"L");q.s(2,10,"L");q.s(2,9,"L");q.s(3,8,"L");
  [[6,9],[7,9],[6,10],[7,10]].forEach(([x,y])=>q.s(x,y,"k"));
  [[3,12],[4,12],[4,13],[5,13]].forEach(([x,y])=>q.s(x,y,"N"));
  return q.out(Object.assign({},MET,{b:C.guitar,B:C.guitarS,L:C.guitarL,n:C.neck,N:C.neckS,k:C.hole}))};
ICON[16]=()=>{const q=grid();
  q.r(7,9,8,14,"e");q.r(8,9,8,14,"E");
  q.p(3,10,["eee..","Eeee.",".EE.."]);q.p(9,9,[".eee","eeeE","..E."]);
  q.each((x,y)=>{const d=D(x,y,8,5);if(d<=4.3){return(x+.5-8)+(y+.5-5)>2.4?"R":"r"}});
  [[7,3],[8,3],[9,4],[9,5],[8,6],[7,6],[6,5],[6,4]].forEach(([x,y])=>q.s(x,y,"R"));q.s(7,4,"R");
  q.s(5,2,"l");q.s(4,3,"l");q.s(6,1,"l");q.s(8,4,"l");
  q.s(5,8,"e");q.s(10,8,"E");
  return q.out({r:C.red,R:C.redS,l:C.redL,e:C.green,E:C.greenS})};
ICON[17]=()=>{const q=grid();
  [[5,1],[6,1],[4,2],[5,2],[5,3],[6,3],[9,0],[10,0],[8,1],[9,1],[9,2],[10,2],[8,3],[9,3]].forEach(([x,y])=>q.s(x,y,"s"));
  q.r(2,6,10,14,"w");q.r(10,6,10,14,"W");q.r(2,14,10,14,"W");q.r(3,6,9,6,"c");q.r(3,7,9,7,"C");
  q.r(2,9,10,10,"a");q.r(10,9,10,10,"A");q.s(2,14,".");q.s(10,14,".");q.r(3,15,9,15,".");
  q.p(11,8,["ww.","..w","..W","..W","WW."]);q.s(11,9,"w");
  return q.out(Object.assign({},MET,{s:C.steam,c:"#8a4f2a",C:C.coffee,a:"#d63b3b",A:"#9a2433"}))};
ICON[18]=()=>{const q=grid();
  q.each((x,y)=>{const d=D(x,y,8,8);if(d<=6.9)return(x+.5-8)+(y+.5-8)>4.5?"W":"w"});
  const pent=(cx,cy,r)=>q.each((x,y,c)=>{if(c!=="."&&D(x,y,cx,cy)<=r)return"k"});
  pent(8,8.3,1.9);
  for(let i=0;i<5;i++){const a=(-90+72*i)*Math.PI/180;pent(8+Math.cos(a)*6.4,8+Math.sin(a)*6.4,1.9)}
  for(let i=0;i<5;i++){const a=(-90+72*i)*Math.PI/180;for(const r of [2.9,3.9]){const x=Math.floor(8+Math.cos(a)*r),y=Math.floor(8+Math.sin(a)*r);if(q.a[y][x]!=="k")q.s(x,y,"M")}}
  return q.out(Object.assign({},MET,{k:"#2c2c36",M:"#8a94a3"}))};
ICON[19]=()=>{const q=grid();
  q.r(6,2,9,2,"h");q.r(5,3,5,4,"h");q.r(10,3,10,4,"h");
  q.r(1,5,14,14,"b");q.r(14,5,14,14,"B");q.r(1,14,14,14,"B");q.r(1,9,14,9,"B");q.r(2,5,13,5,"L");
  q.r(3,8,4,10,"g");q.r(4,8,4,10,"G");q.r(11,8,12,10,"g");q.r(12,8,12,10,"G");
  return q.out(Object.assign({},GOLD,{b:C.leather,B:C.leatherS,L:"#c08850",h:"#4a2c16"}))};

ICON[62]=()=>{const q=grid();
  // crosse dessinée à la main, rayures diagonales (rouge / blanc), ombre à droite, reflet à gauche
  const m=[
  "................",
  "....#######.....",
  "...#########....",
  "..####..####....",
  "..###....###....",
  "..###....###....",
  "...#.....###....",
  ".........###....",
  ".........###....",
  ".........###....",
  ".........###....",
  ".........###....",
  ".........###....",
  ".........###....",
  "..........#.....",
  "................"],F=(x,y)=>m[y]&&m[y][x]==="#";
  q.each((x,y)=>{if(!F(x,y))return;const red=((x+y)%4)<2,R=!F(x+1,y),L=!F(x-1,y);return red?(R?"R":(L?"l":"r")):(R?"W":"w")});
  // nœud de houx sur la tige
  q.p(6,8,["ee....ee","eEe..eEE",".E....E."]);q.s(9,9,"b");q.s(10,9,"b");q.s(10,10,"B");
  return q.out({r:"#d8343c",R:"#a02232",l:"#f06a72",w:"#fbf6ee",W:"#d8d2c8",e:"#4caf50",E:"#2e7d32",b:"#ff5a64",B:"#a02232"})};

// =================== figurines de boss (trophées) ===================
// window.chFigure(kind,col,gold) -> {main, icon}. main : entrée compatible CH_MAIN ; icon : {rows,pal} 16x16.
// Lettres : # couleur du boss, s ombre, l reflet, k yeux / creux, w blanc, m bouche, c crème, d crème ombrée,
//           p/P/q socle (clair / moyen / sombre), * étincelle (version or).
const FIG_KINDS=["slime","ghost","golem","dragon","bat","skull","shroom"];
// mini statuettes 7 px de large (tenues en main)
const FIG_MINI={
  slime:[
  "...l...",
  "..l#s..",
  ".l###s.",
  "l#k#k#s",
  "l##m##s",
  "sssssss"],
  ghost:[
  ".l###s.",
  "l#####s",
  "l#k#k#s",
  "l#####s",
  "l#####s",
  "s.s.s.s"],
  golem:[
  ".l###s.",
  ".#k#k#.",
  "l#####s",
  "l#www#s",
  "l#####s",
  ".ss.ss."],
  dragon:[
  "#.c.c.#",
  "#.###.#",
  "#lk#ks#",
  "s#####s",
  "..#cd#.",
  "..#cd#s",
  "..s.ss."],
  bat:[
  ".#...#.",
  "##l#s##",
  "##k#k##",
  "s##w##s",
  ".s.#.s.",
  "...s..."],
  skull:[
  ".l###s.",
  "l#cccds",
  "#ckckds",
  "#cccdd#",
  "s#cdc#s",
  "sssssss"],
  shroom:[
  ".l#w#s.",
  "lw###ws",
  "sssssss",
  ".ckckd.",
  ".cccdd.",
  ".cd.cd."]};
// icônes : statuettes ~12 px de large
const FIG_ICON={
  slime:[
  "......l#.....",
  ".....l##s....",
  "....l####s...",
  "...l######s..",
  "..l########s.",
  "..l#wk##wk#s.",
  ".l##kk##kk##s",
  ".l####mm####s",
  ".l##########s",
  ".sssssssssss."],
  ghost:[
  "....l####s...",
  "...l######s..",
  "..l########s.",
  "..l#wk##wk#s.",
  "..l#kk##kk#s.",
  ".l####mm####s",
  "..l########s.",
  "..l########s.",
  "..s#ss#ss#ss.",
  "..s..s..s..s."],
  golem:[
  "...l######s...",
  "..l########s..",
  "..l#kk##kk#s..",
  "..l#wk##wk#s..",
  "l#.l######s.#s",
  "l#.l#mwwm#s.#s",
  "l#.l######s.#s",
  "l#lllllllll##s",
  "l############s",
  "ssssssssssssss",
  ".ss........ss."],
  dragon:[
  "#..c......c..#",
  "##..c####c..##",
  "#s.l######s.s#",
  "#s.l#wk#wks.s#",
  "#ss.l#mm#s.ss#",
  "s#s.l####s.s#s",
  "..sl#cccc#ss..",
  "...l#cccd#s...",
  "...l#cccd#s.l.",
  "...s#s..s#ssl.",
  "...ss....sss.."],
  bat:[
  "...#......#...",
  "...##....##...",
  "#..l######s..#",
  "##.lwk##wks.##",
  "###l######s###",
  "#s#l#mwwm#s#s#",
  "#.s.l####s.s.#",
  ".....ssss.....",
  "......ss......"],
  skull:[
  "....l####s...",
  "...l######s..",
  "..l#cccccd#s.",
  "..#ccccccdds.",
  "..#ckkcckkds.",
  "..#ckkcckkds.",
  "..#cccckcdds.",
  "..s#cdcdcd#s.",
  "..s#ckckck#s.",
  "..ssssssssss."],
  shroom:[
  "....l####s....",
  "..l#ww####ws..",
  ".l#www###w##s.",
  "l####ww######s",
  "ssssssssssssss",
  "...cckcckcd...",
  "...cckcckcd...",
  "...cccmmcdd...",
  "...ccccccdd...",
  "...cd....cd..."]};
function figPal(col,gold){
  const mix=(a,b,t)=>(typeof avMix==="function"?avMix:(x,y,t)=>x)(a,b,t);
  if(gold)return{"#":"#f2c230",s:"#c8901a",l:"#ffe58a",k:"#7a5010",w:"#fff4c0",m:"#9a6612",c:"#ffe58a",d:"#e0a828",
    p:"#c8901a",P:"#a06e14",q:"#6e4a0c","*":"#ffffff"};
  return{"#":col,s:mix(col,"#000000",.28),l:mix(col,"#ffffff",.32),k:"#24182c",w:"#ffffff",m:"#8a2a3a",c:"#f4ead2",d:"#cbb994",
    p:"#b8733a",P:"#8a5228",q:"#5e361a","*":"#ffffff"}}
function chFigure(kind,col,gold){kind=FIG_MINI[kind]?kind:"slime";col=col||"#5fae4f";gold=!!gold;const pal=figPal(col,gold);
  // statuette en main : figure + socle 2 lignes, poing sous le socle
  const fig=FIG_MINI[kind],rows=fig.map(r=>"."+r+".");
  rows.push("ppppppppq","PPPPPPPPq");
  const H=rows.length;
  const main={draw:(g,A,P)=>drawHeld(g,A,P,{rows,d:{f:[3,H]},u:{f:[3,H]},pal:()=>pal})};
  // icône 16x16
  const q=grid(),I=FIG_ICON[kind];
  const w=Math.max(...I.map(r=>r.length)),ox=Math.floor((16-w)/2)+(w%2?1:0),oy=12-I.length;
  q.p(ox,oy,I);
  q.r(3,12,12,12,"p");q.r(2,13,13,13,"P");q.s(13,13,"q");q.r(2,14,13,14,"q");q.s(12,12,"P");
  const icon=q.out(pal);
  if(gold){const R=icon.rows.map(r=>[...r]),st=(x,y)=>{if(R[y]&&R[y][x]===".")R[y][x]="*"};
    [[13,0],[12,1],[13,1],[14,1],[13,2],[2,3]].forEach(([x,y])=>st(x,y));icon.rows=R.map(r=>r.join(""))}
  return{main,icon}}
window.chFigure=chFigure;
window.CH_FIG_KINDS=FIG_KINDS.slice();

window.chItemIcon=function(i){const f=ICON[i|0];return f?f():null};
})();


})();
(()=>{
// ===== Pixel Clair : tête de 3/4 (avatar 24 x 24, tournée vers la droite) =====
// chHead(cfg) -> {W:24,H:24,px}. Réutilise chPal / AV_DEF / CH_DEF / avMix de av_base.js + ch_core.js.
(function(){
const W=24,H=24;
function mk(){const px=new Array(W*H).fill(null);
  const set=(x,y,c)=>{if(c&&x>=0&&x<W&&y>=0&&y<H)px[y*W+x]=c};
  const get=(x,y)=>x>=0&&x<W&&y>=0&&y<H?px[y*W+x]:null;
  const del=(x,y)=>{if(x>=0&&x<W&&y>=0&&y<H)px[y*W+x]=null};
  const rect=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)set(x,y,c)};
  const put=(x0,y0,rows,pal)=>rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const ch=r[x];if(ch!=="."&&ch!==" "){const c=pal[ch];if(c)set(x0+x,y0+y,c)}}});
  return{W,H,px,set,get,del,rect,put}}
// calque -> calque (fusion)
function over(dst,src){for(let i=0;i<W*H;i++)if(src.px[i])dst.px[i]=src.px[i]}
function outline(g,col){const s=g.px.slice();for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(s[y*W+x])continue;
  if((x>0&&s[y*W+x-1])||(x<W-1&&s[y*W+x+1])||(y>0&&s[(y-1)*W+x])||(y<H-1&&s[(y+1)*W+x]))g.px[y*W+x]=col}}

// ---------- repères (grille 24) ----------
// crâne : arrière x7, front x16, nez x17 (y13-14), menton y18 ; oreille x6 y10-12 ; œil x13-14 y12-13 ; bouche y16
const HEAD={5:[8,13],6:[7,14],7:[7,15],8:[7,16],9:[7,16],10:[7,16],11:[7,16],12:[7,17],13:[7,17],14:[7,17],15:[7,16],16:[7,16],17:[7,16],18:[8,16]};
const E={x:13,y:12},M={y:16};

// ---------- corps (épaules + col) ----------
function body(g,P,c){const t=c.top|0,tc=P.tc,tS=P.tcS,tL=P.tcL,O=P.ol,w=P.w,wS=P.wS;
  // cou
  g.rect(9,19,13,21,P.skS);
  // épaules
  g.rect(5,21,17,21,tc);g.rect(4,22,18,23,tc);g.rect(17,21,17,21,tS);g.rect(18,22,18,23,tS);
  // encolure de base : ronde
  const neckline=()=>{g.rect(9,21,13,21,P.skS);g.rect(10,22,12,22,P.skS);g.set(9,22,tS);g.set(13,22,tS);g.set(10,23,tS);g.set(11,23,tS);g.set(12,23,tS)};
  const V=(inner)=>{g.rect(9,21,13,21,inner);g.rect(10,22,12,22,inner);g.set(11,23,inner)};
  switch(t){
    case 0: neckline();break; // T-shirt
    case 1: // Hoodie : capuche derrière la nuque + cordons
      g.rect(5,19,8,21,tc);g.rect(4,20,4,21,tc);g.rect(5,19,5,21,tS);g.rect(14,19,15,20,tc);g.set(15,20,tS);
      neckline();g.rect(9,22,9,23,tS);g.rect(13,22,13,23,tS);g.set(10,23,w);g.set(12,23,w);g.set(11,23,tc);break;
    case 2: // Débardeur : épaules nues, bretelles
      g.rect(4,22,18,23,P.sk);g.rect(5,21,17,21,P.sk);g.rect(18,22,18,23,P.skS);g.rect(17,21,17,21,P.skS);
      g.rect(7,21,8,23,tc);g.rect(14,21,15,23,tc);g.rect(9,23,13,23,tc);g.set(8,22,tS);g.set(15,22,tS);break;
    case 3: // Veste : t-shirt blanc + revers
      V(w);g.set(11,23,wS);g.rect(8,21,8,23,tL);g.rect(14,21,14,23,tS);g.set(9,23,tL);g.set(13,23,tS);g.set(9,22,tL);g.set(13,22,tS);break;
    case 4: // Maillot : col contrasté + numéro
      neckline();g.rect(9,21,13,21,P.skS);g.set(8,21,w);g.set(14,21,w);g.set(9,22,w);g.set(13,22,w);g.rect(10,23,12,23,w);g.rect(15,22,16,23,w);break;
    case 5: // Chemise : col pointu blanc
      g.rect(9,21,13,21,P.skS);g.set(11,22,P.skS);g.put(8,20,["w.....w","ww...ww",".ww.ww.","...O..."],{w:w,O:tS});g.rect(11,23,11,23,tS);break;
    case 6: // Col roulé
      g.rect(9,19,13,21,tc);g.rect(13,19,13,21,tS);g.rect(9,20,13,20,tS);g.rect(9,20,12,20,tS);g.rect(9,19,12,19,tc);g.rect(9,21,12,21,tc);g.set(8,21,tS);g.set(14,21,tS);break;
    case 7: // Survêt : col montant zippé + bandes
      g.rect(9,20,13,21,tc);g.rect(9,20,13,20,w);g.set(11,21,P.metal);g.rect(11,22,11,23,P.metal);g.rect(5,22,5,23,w);g.rect(17,22,17,23,w);break;
    case 8: // Veste en cuir : noir/sombre + col large
      {const L="#2c2c34",LS="#18161e";g.rect(5,21,17,21,L);g.rect(4,22,18,23,L);g.rect(18,22,18,23,LS);
       V(tc);g.put(7,20,["ll.....ll","lll...lll",".ll...ll.","..l...l.."],{l:"#4a4a56"});g.set(10,23,P.metal);}break;
    case 9: // Armure
      g.rect(5,21,17,21,P.metal);g.rect(4,22,18,23,P.metal);g.rect(17,21,17,21,P.metalS);g.rect(18,22,18,23,P.metalS);
      g.rect(9,20,13,21,P.metalS);g.rect(9,20,13,20,P.metal);g.rect(4,22,7,22,"#e8eef4");g.rect(15,22,18,22,P.metalS);g.set(11,23,tc);g.set(10,23,tc);g.set(12,23,tc);break;
    case 10: // Cape royale : hermine + fermoir
      g.rect(4,21,18,21,w);g.rect(5,20,8,20,w);g.rect(14,20,17,20,w);g.set(6,21,O);g.set(15,21,O);g.set(9,20,w);g.set(13,20,w);
      neckline();g.rect(9,21,13,21,P.skS);g.set(11,22,P.gold);g.set(11,23,P.goldS);break;
    case 11: // Kimono : col croisé
      g.put(8,20,["w.....","ww....",".ww...","..ww..","...ww."],{w:w});g.rect(9,21,13,21,P.skS);g.rect(10,22,12,22,P.skS);g.set(11,23,P.skS);
      g.put(8,20,["w.....","ww....",".ww...","..ww..","...ww."],{w:w});g.put(11,21,["..w",".ww","ww."],{w:wS});break;
    case 12: // Costume : chemise + cravate
      g.rect(9,21,13,21,w);g.rect(10,22,12,23,w);g.set(9,22,w);g.set(13,22,w);g.rect(11,21,11,23,P.ac);g.set(11,21,P.acS);
      g.rect(8,21,8,23,tL);g.set(9,23,tL);g.set(13,23,tS);g.rect(14,21,14,23,tS);g.rect(10,19,12,20,P.skS);g.rect(9,20,13,20,w);break;
    case 13: // Robe de mage : haut col + liseré or
      g.rect(8,19,8,21,tc);g.rect(14,19,14,21,tS);g.rect(9,21,13,21,P.skS);g.rect(10,22,12,23,P.skS);g.rect(9,22,9,23,P.gold);g.rect(13,22,13,23,P.gold);break;
    case 14: // Peignoir : col châle épais
      g.put(7,20,["ll...ll.","lll.lll.",".lllll..","..lll..."],{l:tL});g.rect(9,21,13,21,P.skS);g.set(11,22,P.skS);break;
    case 15: // Marinière : rayures
      neckline();g.rect(4,23,18,23,w);g.rect(5,21,8,21,w);g.rect(14,21,17,21,w);g.rect(10,23,12,23,w);g.rect(9,22,9,22,tS);break;
    case 16: // Hawaïenne : col ouvert + fleurs
      V(P.skS);g.put(8,20,["w.....w",".w...w."],{w:tL});g.set(5,22,"#ffd23e");g.set(6,23,w);g.set(16,22,w);g.set(15,23,"#ffd23e");g.set(17,23,"#ff6a8a");break;
    case 17: // Pull de Noël : col côtelé, bande jacquard rouge / blanche, flocons
      {const L=avHex(tc),lum=(0.299*L[0]+0.587*L[1]+0.114*L[2])/255,red=L[0]>200&&L[1]<130;
       const wc=lum>.8?"#d63b3b":w,rc=red||lum>.8?"#2f9a5a":"#d63b3b";
       neckline();g.set(9,22,rc);g.set(13,22,rc);g.rect(10,23,12,23,rc);
       for(let x=4;x<=18;x++){if(x>=9&&x<=13)continue;g.set(x,22,x%2?rc:wc)}
       [5,16].forEach(x=>{g.set(x,23,wc)});g.set(7,23,rc);g.set(15,23,rc);g.set(18,23,tS)}break;
    default: neckline()}
}

// ---------- tête ----------
function head(g,P){for(const y in HEAD){const [a,b]=HEAD[y];g.rect(a,+y,b,+y,P.sk)}
  // ombres : dessous du menton, arête du nez, mâchoire
  g.rect(10,18,15,18,P.skS);g.set(17,14,P.skS);g.set(16,15,P.skS);g.set(8,17,P.skS);g.set(7,16,P.skS);g.set(7,17,P.skS)}
function ear(g,P){g.rect(5,10,6,12,P.sk);g.set(6,11,P.skS);g.set(5,12,P.skS)}

// ---------- yeux ----------
const EYES=[
  (g,P)=>{g.set(13,12,P.w);g.set(14,12,P.ol);g.set(13,13,P.w);g.set(14,13,P.ec);g.set(13,11,P.skS);g.set(14,11,P.skS)},           // normaux
  (g,P)=>{g.set(12,13,P.ol);g.set(13,12,P.ol);g.set(14,12,P.ol);g.set(15,13,P.ol)},                                              // heureux
  (g,P)=>{g.set(13,12,P.w);g.set(14,12,P.ol);g.set(13,13,P.w);g.set(14,13,P.ec);g.set(12,10,P.ol);g.set(13,10,P.ol);g.set(14,11,P.ol);g.set(15,11,P.ol)}, // déterminés
  (g,P)=>{g.set(12,12,P.ol);g.set(13,13,P.ol);g.set(14,13,P.ol);g.set(15,12,P.ol)},                                              // clin d'œil
  (g,P)=>{g.rect(12,11,14,13,P.w);g.rect(13,12,14,13,P.ol);g.set(14,13,P.ec);g.set(13,12,P.w);g.set(12,10,P.ol);g.set(13,10,P.ol);g.set(14,10,P.ol)}, // grands
  (g,P)=>{g.set(13,13,P.w);g.set(14,13,P.ol);g.set(13,12,P.skS);g.set(14,12,P.skS);g.set(12,11,P.ol);g.set(13,11,P.ol);g.set(14,10,P.ol)}, // tristes
  (g,P)=>{g.set(13,13,P.w);g.set(14,13,P.ol);g.set(13,12,P.skS);g.set(14,12,P.skS);g.set(12,11,P.ol);g.set(13,11,P.ol);g.set(14,10,P.ol);g.set(13,14,"#7fd4ff");g.set(13,15,"#4aa8f0")} // larme
];
// ---------- bouches ----------
const MOUTH=[
  (g,P)=>{g.set(13,15,P.mouth);g.set(14,16,P.mouth);g.set(15,16,P.mouth)},
  (g,P)=>{g.rect(14,16,16,16,P.mouth)},
  (g,P)=>{g.set(12,15,P.mouth);g.rect(13,16,16,16,P.mouth);g.rect(14,16,15,16,P.w);g.rect(14,17,15,17,P.mouth)},
  (g,P)=>{g.rect(14,16,16,16,P.mouth);g.set(15,17,"#ff7a96");g.set(16,17,"#ff7a96");g.set(17,17,"#e05a7a")},
  (g,P)=>{g.rect(14,16,15,17,P.mouth);g.set(14,16,P.ol)},
  (g,P)=>{g.set(13,17,P.mouth);g.rect(14,16,15,16,P.mouth);g.set(16,17,P.mouth)},
  (g,P)=>{g.rect(13,16,14,16,P.mouth);g.set(15,17,P.mouth)}
];

// ---------- marques ----------
const MARK=[null,
  (g,P)=>{const f=avMix(P.sk,"#9a4a20",.45);g.set(11,14,f);g.set(13,14,f);g.set(12,15,f);g.set(15,14,f)},
  (g,P)=>{const s=avMix(P.skS,"#c83a4a",.45);g.set(11,10,s);g.set(12,11,s);g.set(12,12,s);g.set(12,13,s);g.set(13,14,s);g.set(11,12,s)},
  (g,P)=>{g.set(15,15,avMix(P.skS,"#1a0a08",.55))},
  (g,P)=>{g.put(9,13,[".bbb","bbBb","bBbb","bbb."],{b:"#f6e2b4",B:"#c9a46a"})},
  (g,P)=>{g.rect(11,14,14,14,P.ac);g.rect(10,15,12,15,P.ac);g.set(14,9,P.ac);g.set(15,9,P.ac)}
];

// ---------- barbes ----------
// barbes par masque sur la peau du visage (couvrent tout le bas du visage)
function pbIn(x,y,full){const r=HEAD[y];if(!r||x<r[0]||x>r[1])return false;if(y>=16)return true;if(y===15)return x<=(full?10:9)||x>=12;
  if(y>=13)return x<=(full?10:(y===13?8:9));if(y>=10)return x<=(full?8:7);return false}
function pbFill(g,P,full,col){const sk=new Set([P.sk,P.skS,P.skL]);for(let y=10;y<=18;y++)for(let x=6;x<=17;x++){if(!pbIn(x,y,full)||!sk.has(g.get(x,y)))continue;g.set(x,y,col?col(x,y):(y===18||x>=16?P.hcS:P.hc))}
  if(!col){if(sk.has(g.get(8,16))||g.get(8,16)===P.hc)g.set(8,16,P.hcL)}}
const BEARD=[null,
  (g,P)=>{g.rect(13,15,16,15,P.hc);g.set(12,16,P.hc);g.set(16,15,P.hcS)},
  (g,P)=>{g.rect(14,15,16,15,P.hc);g.rect(14,17,16,18,P.hc);g.rect(15,19,16,19,P.hcS);g.set(16,18,P.hcS);g.set(13,17,P.hcS)},
  (g,P)=>{pbFill(g,P,false)},
  (g,P)=>{pbFill(g,P,true);g.rect(9,19,15,19,P.hc);g.rect(10,20,14,20,P.hc);g.rect(11,21,13,21,P.hcS);g.set(15,19,P.hcS);g.set(14,20,P.hcS);g.set(10,19,P.hcL)},
  (g,P)=>{const st=avMix(P.hc,"#3a2a24",.65),a=avMix(P.sk,st,.22),b=avMix(P.sk,st,.36),d=avMix(P.skS,st,.32);pbFill(g,P,false,(x,y)=>y===18||x>=16?d:((x*5+y*3)%4===0?b:a))}
];

// ---------- coiffures ----------
// lettres : h cheveux, s ombre, l reflet, k peau, K peau ombrée, o contour
// chaque entrée : {f:[y0,rows]} devant, {b:[y0,rows]} derrière la tête, ear:false si l'oreille est couverte
const HAIR=[
 // 0 Court
 {f:[3,[
  "........hhhhh",
  ".......hhllhhhh",
  "......hhhhhhhhhh",
  "......hhhhhhhhhhh",
  "......hhhhhhhhhhs",
  "......hhhhhhs",
  "......hhhhs",
  ".......hs",
 ]]},
 // 1 Rasé
 {f:[5,[
  "........rrrrrr",
  ".......rrrrrrrr",
  ".......rrrrrrrR",
  ".......rrrrR",
  ".......rrR",
  ".......R",
 ]]},
 // 2 Mèche
 {f:[2,[
  "..........hhh",
  "........hhhllhh",
  ".......hhhhhhllhh",
  "......hhhhhhhhhlhh",
  "......hhhhhhhhhhhhh",
  "......hhhhhhhhhhshh",
  "......hhhhhhs....sh",
  "......hhhhs.......s",
  ".......hs",
 ]]},
 // 3 Long
 {f:[3,[
  "........hhhhh",
  "......hhhllhhhh",
  ".....hhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhs",
  ".....hhhhhhhs",
  ".....hhhhhhs",
  ".....hhhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  "....hhhhs",
  "....hhhs",
  "....hhhs",
  "....hhs",
  "....hs",
 ]],ear:false},
 // 4 Afro
 {fn:(g,P)=>{const cx=10.4,cy=7.6;
   for(let y=1;y<16;y++)for(let x=1;x<21;x++){const dx=x-cx,dy=(y-cy)*1.06,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx),re=7.55+0.55*Math.cos(a*9);
     if(d>re)continue;if(x>=12&&y>=8)continue;if(x>=10&&y>=11)continue;if(x>=11&&y>=10)continue;
     let c=P.hc;if(d>re-1.4&&(dy>1.2||dx<-5.5))c=P.hcS;else if(d>re-2.4&&d<re-1.1&&a<-1.0&&a>-2.0)c=P.hcL;g.set(x,y,c)}
   },ear:false},
 // 5 Locks
 {f:[2,[
  ".........hhh",
  ".......hhhhhhh",
  "......hhhllhhhh",
  ".....hhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hshshhhhhhhs",
  "....hshshshhs..hs",
  "....hshshs.....h",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....hshsh",
  "....h.h.h",
 ]],ear:false},
 // 6 Chignon
 {f:[1,[
  ".....hhhh",
  ".....hlhhs",
  "......aaahhh",
  "......hhhhllhh",
  "......hhhhhhhhhh",
  "......hhhhhhhhhhh",
  "......hhhhhhhhhs",
  "......hhhhhs",
  "......hhhs",
  ".......ss",
 ]]},
 // 7 Crête
 {f:[1,[
    "........hh..hh",
  "........hhhhhhh.h",
  ".......hhhlhhhhhh",
  ".......hhhlhhhhs",
  "........rhhhhhr",
  ".......rrrrrrrr",
  ".......rrrrrrrR",
  ".......rrrrR",
  ".......rrR",
 ]]},
 // 8 Bouclé
 {f:[2,[
  "........hh.hh",
  "......hhhhhhhhhh",
  ".....hhhlhhhhlhhh",
  "....hhhhhhhhhhhhhh",
  "....hhhshhhhshhhhh",
  "....hhhhhhhhhhhhhs",
  "....hhhhhhshhhs",
  "....hhhhhs",
  "....hhshs",
  "....hhhs",
  ".....hhs",
  "....hhs",
  ".....s",
 ]],ear:false},
 // 9 Chauve
 {f:[0,[]],shine:1},
 // 10 Tresses
 {f:[3,[
  "........hhhhh",
  ".......ssssssss",
  "......hhhhhhhhhh",
  "......sssssssssss",
  "......hhhhhhhhhhs",
  "......ssssss",
  ".....hhhhs",
  "....hhs",
  "....shh",
  "....hhs",
  "....shh",
  "....hhs",
  "....shh",
  "....hhs",
  "....shh",
  "....hhs",
  "....shh",
  "....aa",
  "....aa",
 ]],earTop:1},
 // 11 Queue de cheval
 {f:[3,[
  "........hhhhh",
  ".......hhllhhhh",
  "......hhhhhhhhhh",
  "....aahhhhhhhhhhh",
  "...hhahhhhhhhhhs",
  "...hhhhhhhhs",
  "...hhhhhhs",
  "...hhhs",
  "...hhhs",
  "...hhhs",
  "....hhs",
  "....hhs",
  "....hhs",
  ".....hs",
  ".....s",
 ]],earTop:1},
 // 12 Frange
 {f:[3,[
  "........hhhhh",
  "......hhhllhhhh",
  ".....hhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhsssssss",
  ".....hhhhs",
  ".....hhhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  "......ss",
 ]],ear:false},
 // 13 Dégradé
 {f:[2,[
  ".........hhhh",
  "........hhllhhh",
  ".......hhhhhhhhh",
  ".......hhhhhhhhhh",
  ".......hhhhhhhhhs",
  ".......rrrrrrrR",
  ".......rrrrR",
  ".......rrR",
 ]]},
 // 14 Mulet
 {f:[3,[
  "........hhhhh",
  ".......hhllhhhh",
  "......hhhhhhhhhh",
  "......hhhhhhhhhhh",
  "......hhhhhhhhhhs",
  "......hhhhhhs",
  "....hhhhhhs",
  "....hhhhs",
  "....hhhs",
  "....hhhs",
  "....hhhs",
  "....hhhs",
  "....hhhs",
  "....hhhs",
  "....hhhs",
  "...hhhs",
  "...hhhs",
  "...hhs",
 ]],earTop:1},
 // 15 Frange longue
 {f:[2,[
  "........hhhhh",
  "......hhhhhllhh",
  ".....hhhhhhhhllhh",
  ".....hhhhhhhhhhhhh",
  ".....hhhhhhhhhhhhh",
  ".....hhhhhhhhhhhhs",
  ".....hhhhhhhhhhhs",
  ".....hhhhhs..hhhs",
  ".....hhhhs.....hs",
  ".....hhhs.......s",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  "......ss",
 ]],ear:false},
 // 16 Brosse
 {f:[2,[
  "........h.h.h.h",
  ".......hhhhhhhhh",
  ".......hshshshshs",
  ".......hhhhhhhhhh",
  ".......hhhhhhhhhs",
  ".......hhhhhhhs",
  ".......hhhs",
  ".......hs",
 ]]},
 // 17 Raie sur le côté
 {f:[3,[
  "........hhhhh",
  ".......hkkhhhhh",
  "......hhhkhhllhh",
  "......hhhhhhhhllhh",
  "......hhhhhhhhhhhs",
  "......hhhhhhs",
  "......hhhs",
  ".......hs",
 ]]},
 // 18 Banane
 {f:[1,[
    ".........hhhllhhh",
  "........hhhhhhllhh",
  ".......hhhhhhhhhhhs",
  ".......hhhhhhhhhhhs",
  ".......hhhhhhhhhss",
  ".......hhhhhhs",
  ".......hhhhs",
  ".......hhs",
  ".......s",
 ]]},
 // 19 Waves
 {f:[3,[
  "........hhhhh",
  ".......hlllhhhh",
  "......hhhhhhhhhh",
  "......lllllllllll",
  "......hhhhhhhhhhs",
  "......lllllls",
  "......hhhhs",
  ".......hs",
 ]]},
 // 20 Carré
 {f:[3,[
  "........hhhhh",
  "......hhhllhhhh",
  ".....hhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhs",
  ".....hhhhhhs",
  ".....hhhhhs",
  ".....hhhhs",
  ".....hhhhs",
  ".....hhhhs",
  ".....hhhhs",
  ".....hhhhs",
  ".....hhhhs",
  ".....sssss",
 ]],ear:false},
 // 21 Surfeur
 {f:[1,[
  "..........h.h",
  "........hhhhhh",
  "......hhhhllhhh",
  ".....hhhhhhhlhhhh",
  ".....hhhhhhhhhhhhh",
  ".....hhhhhhhhhhhhhh",
  ".....hhhhhhhhhhshhs",
  ".....hhhhhhhs",
  ".....hhhhs",
  "....hhhhs",
  "....hhhhs",
  "....hhhs",
  "....hhhs",
  "....hhhs",
  "....hhs",
  "....hs",
 ]],ear:false},
 // 22 Twists
 {f:[1,[
  ".........hh.hh",
  ".......hhhhhhhhh",
  "......hshhshhshhh",
  ".....hhshhshhshhs",
  ".....hhshhshhshhs",
  ".....shhshhshhshh",
  ".....shhshhshhshs",
  ".....hhs.hs.hs.hs",
  ".....hhs",
 ]]},
 // 23 Wolf cut
 {f:[1,[
  ".........hh",
  ".......hhhhhhh",
  "......hhhhllhhhh",
  ".....hhhhhhhllhhh",
  "....hhhhhhhhhhhhhh",
  "....hhhhhhhhhhhhhhh",
  "....hhhhhhhhhhhshhs",
  "....hhhhhhhhs",
  "....hhhhhs",
  "...hhhhhs",
  "...hhhhs",
  "....hhhhs",
  "....hhhs",
  "...hhhhs",
  "...hhhs",
  "....hhs",
  "....hs",
 ]],ear:false},
 // 24 Long ondulé
 {f:[3,[
  "........hhhhh",
  "......hhhllhhhh",
  ".....hhhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhs",
  ".....hhhhhhhs",
  "....hhhhhhs",
  "....lhhhhs",
  ".....hhhhs",
  "......hhhs",
  ".....hhhhs",
  "....lhhhs",
  "....hhhhs",
  ".....hhhs",
  "......hhs",
  ".....hhhs",
  "....lhhs",
  "...hhhhs",
  "...hhhs",
 ]],ear:false},
 // 25 Couettes
 {f:[3,[
  "........hhhhh",
  ".......hhllhhhh",
  "......hhhhhhhhhh",
  "......hhhhhhhhhhh",
  "......hhhhhhhhhhs",
  "...aahhhhhhhs",
  "..hhahhhhhs",
  ".hhhh.hhs",
  ".hhhs",
  ".hhhs",
  "..hhs",
  "..hhs",
  "...s",
 ]],b:[5,[
  "................aahh",
  "................ahhhh",
  "................hhhhs",
  ".................hhs",
 ]],earTop:1},
 // 26 Demi-queue
 {f:[2,[
  "....hhh",
  "...hhhaa.hhhh",
  "....hhhahhllhhh",
  "......hhhhhhhhhh",
  ".....hhhhhhhhhhhh",
  ".....hhhhhhhhhhhs",
  ".....hhhhhhhs",
  ".....hhhhhhs",
  ".....hhhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  ".....hhhs",
  "....hhhhs",
  "....hhhs",
  "....hhhs",
  "....hhs",
 ]],ear:false},
];

// ---------- couvre-chefs ----------
// clip : les cheveux au-dessus de cette ligne sont masqués ; front/back = dessins (avant/arrière tête)
const HOLE="hole";
const GOLD={g:"#f0c040",G:"#b8862a",L:"#fff0a0"};
const HAT=[null,
 // 1 Casquette (visière vers l'avant)
 {clip:7,d:(g,P)=>g.put(5,2,[
  "....aaaaaa",
  "...aaaLaaaa",
  "..aaaaLaaaaa",
  "..aaaaaaaaaaa",
  "..aaaaaaaaaaaS",
  "..SSSSSSSSSSSaaaa",
  "...........SSSSSSS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 2 Bonnet
 {clip:8,d:(g,P)=>g.put(5,1,[
  ".....aaa",
  "....aaLaaa",
  "...aaaLaaaa",
  "..aaaaaaaaaa",
  "..aaaaaaaaaaa",
  "..aaaaaaaaaaaS",
  ".SSSSSSSSSSSSS",
  ".SaSaSaSaSaSaS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 3 Bandana
 {clip:7,d:(g,P)=>g.put(2,2,[
  "......aaaaaa",
  "....aaaaLaaaa",
  "...aaawaaaaawa",
  "...aaaaaaaaaaaa",
  "...awaaaawaaaaS",
  "..aSSSSSSSSSSSS",
  ".aaS",
  "aaSa",
  "aS.aS",
 ],{a:P.ac,S:P.acS,L:P.acL,w:P.w})},
 // 4 Casque audio
 {clip:0,d:(g,P)=>{g.put(5,2,[
  "...bbbbbbb",
  ".bbB.....bb",
  "b..........b",
  "b",
  "b",
  "b",
 ],{b:P.metalS,B:P.metal});g.put(3,8,[
  ".aaa",
  "aaLaa",
  "aaLaa",
  "aaaaS",
  "aaaaS",
  ".SSS",
 ],{a:P.ac,S:P.acS,L:P.acL})}},
 // 5 Couronne
 {clip:0,d:(g,P)=>g.put(7,1,[
  "g...g...g",
  "gg.ggg.gg",
  "gLggggggG",
  "grggbggrG",
  "GGGGGGGGG",
 ],{...GOLD,r:"#e0303c",b:"#3a8ae8"})},
 // 6 Bob
 {clip:8,d:(g,P)=>g.put(4,2,[
  "......aaaa",
  "....aaaLaaaa",
  "...aaaaaaaaaa",
  "...aaaaaaaaaa",
  "...SSSSSSSSSS",
  "..aaaaaaaaaaaaa",
  ".aaaaaaaaaaaaaaa",
  ".SS..........SS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 7 Casquette inversée (visière vers l'arrière)
 {clip:7,d:(g,P)=>g.put(1,2,[
  "........aaaaaa",
  ".......aaaaLaaa",
  "......aaaaaLaaaa",
  "......aaaaaaaaaaa",
  "......aaaaaaaaaaaS",
  "aaaaaaSSSSSSSSSSSS",
  "SSSSSS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 8 Durag
 {clip:8,d:(g,P)=>g.put(3,3,[
  ".....aaaaa",
  "....aaLLaaaa",
  "...aaLaaaaaaa",
  "...aaaaaaaaaaa",
  "...aaaaaaaaaaS",
  "...SSSSSSSSSS",
  "..aS",
  "..aS",
  "..aS",
  ".aaS",
  ".aS",
  ".aS",
  "aS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 9 Chapeau de magicien
 {clip:8,d:(g,P)=>g.put(3,1,[
  "...aaS",
  ".....aaS",
  "......aaaS",
  ".....aaaaaS",
  ".....aagaaaS",
  "....aaaaaaaaS",
  "...SSSSSSSSSSS",
  "aaaaaaaaaaaaaaaaa",
  ".SSSSSSSSSSSSSSS",
 ],{a:P.ac,S:P.acS,g:P.gold})},
 // 10 Casque de chevalier
 {clip:24,d:(g,P)=>{g.put(5,1,[
  "......pp",
  ".....pppp",
  "....mmmmmm",
  "..mmmmmmmmmm",
  ".mmmLmmmmmmmm",
  ".mmLmmmmmmmmmS",
  ".mmLmmmmmmmmmS",
  ".mmmmmmmmmmmmmS",
  ".mmmmmmmoooooooo",
  ".mmmmmmmmmmmmmmS",
  ".mmmmmmmoooooooo",
  ".mmmmmmmmmmmmmmS",
  ".mmmmmmmmm.m.mS",
  ".mmmmmmmmmmmmmS",
  "..mmmmmmmmmmmmS",
  "...mmmmmmmmmmS",
  "....SSSSSSSSS",
  ],{m:P.metal,S:P.metalS,L:"#eef2f6",o:P.ol,p:P.ac})}},
 // 11 Cornes de viking
 {clip:7,d:(g,P)=>g.put(2,1,[
  "c...............c",
  "cc.............cC",
  ".ccC..mmmmm..ccC",
  "..cccmmLmmmmccC",
  "...ccmLmmmmmmS",
  "....mmmmmmmmmS",
  "....ggggggggggg",
  "....GgGgGgGgGgG",
 ],{c:"#f2e6c8",C:"#c8b48a",m:P.metal,S:P.metalS,L:"#eef2f6",g:P.gold,G:P.goldS})},
 // 12 Cowboy
 {clip:7,d:(g,P)=>g.put(1,1,[
  "........aa..aa",
  ".......aaaaaaaa",
  ".......aLaaaaaaS",
  ".......aaaaaaaaS",
  ".......SSSSSSSSS",
  "a.....aaaaaaaaaaa.....a",
  "aaaaaaaaaaaaaaaaaaaaaaS",
  ".SSSSSSSSSSSSSSSSSSSS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 13 Toque de chef
 {clip:8,d:(g,P)=>g.put(5,1,[
  "..www.www",
  ".wwwwwwwwww",
  "wwwwwwwwwwwS",
  "wwwwwwwwwwwS",
  ".wwwwwwwwwS",
  "..wSwwSwwwS",
  "..wSwwSwwwS",
  "..SSSSSSSSS",
 ],{w:P.w,S:P.wS})},
 // 14 Auréole (anneau flottant, intérieur transparent)
 {clip:5,d:(g,P)=>g.put(6,1,[
  "..LLLLLL",
  ".gHHHHHHg",
  "g.HHHHHH.g",
  ".GGGGGGGG",
 ],{L:P.goldL,g:P.gold,G:P.goldS,H:HOLE})},
 // 15 Bandeau ninja
 {clip:0,d:(g,P)=>g.put(0,8,[
  ".....aaaaaaaaaaaa",
  "...aaSSSSSSSmmmSS",
  ".aaS",
  "aS",
 ],{a:P.ac,S:P.acS,m:P.metal})},
 // 16 Couronne de fleurs
 {clip:0,d:(g,P)=>g.put(5,2,[
  "..f.....w",
  ".fyf...wyw..f",
  "..feeeeew..fyf",
  ".eeEeeEeeeeeft",
  "eE...E..E..Ee",
 ],{e:"#3aa85a",E:"#24784a",f:P.ac,y:"#ffd23e",w:P.w,t:P.acS})},
 // 17 Chapeau de pirate
 {clip:7,d:(g,P)=>g.put(3,1,[
  "......kkkkk",
  "....kkkkwkkkk",
  "k.kkkkkwwwkkkk.k",
  "kkkkkkkkwkkkkkkk",
  "gkkkkkkwkwkkkkkg",
  ".gkkkkkkkkkkkkg",
  "..gggggggggggg",
 ],{k:"#2c2c34",w:P.w,g:P.gold})},
 // 18 Béret
 {clip:6,d:(g,P)=>g.put(3,2,[
  ".........a",
  "......aaaaaa",
  "...aaaaaLaaaaa",
  ".aaaaaaaaaaaaaS",
  "aaaaaaaaaaaaaaS",
  ".SSSSSSSSSSSSS",
  "....SSSSSSSSS",
 ],{a:P.ac,S:P.acS,L:P.acL})},
 // 19 Chapeau de paille
 {clip:7,d:(g,P)=>g.put(0,2,[
  "........ppppppp",
  ".......pPpPpPpPp",
  ".......ppppppppp",
  ".......aaaaaaaaaa",
  "..pppppppppppppppppp",
  "ppPpPpPpPpPpPpPpPpPpPp",
  ".PPPPPPPPPPPPPPPPPPPP",
 ],{p:"#ecc970",P:"#c49a44",a:P.ac})},
 // 20 Bonnet de Noël (pointe qui retombe vers l'arrière, pompon blanc)
 {clip:8,d:(g,P)=>g.put(1,1,[
  "......rrrrrr......",
  "...rrrrrrrrrrRR...",
  "..qrR.qrrrrrrrrR..",
  ".wwW.qrrrrrrrrrrR.",
  "wwwW.qrrrrrrrrrrRR",
  ".WW..rrrrrrrrrrrRR",
  "....wwwwwwwwwwwwwW",
  "....WwWWwWWwWWwWWW",
 ],{r:"#d8343c",R:"#a02232",q:"#f0646a",w:P.w,W:P.wS})},
 // 21 Bois de renne (serre-tête qui suit le haut du crâne)
 {clip:5,d:(g,P)=>{const T=[];for(let x=0;x<W;x++){let t=14;for(let y=0;y<14;y++)if(g.get(x,y)){t=y;break}T[x]=t}
   const b="#9a6434",B="#64401f",n="#c48a52",d="#6e4422",D="#4e2e16";
   // bois arrière (dans l'ombre), serre-tête, bois avant
   g.put(6,T[9]-4,["d..d","d.dD","ddD.",".dD."],{d,D});
   for(let x=7;x<=16;x++){if(T[x]<14){g.set(x,T[x],x>=14?P.acS:P.ac);if(x===10||x===11)g.set(x,T[x],P.acL)}}
   g.put(12,T[13]-4,["n..b","b.bB","bbB.",".bB."],{b,B,n});
   g.set(14,T[14]-1,"#e8404a");g.set(14,T[14]-2,P.gold)}},
];

// ---------- lunettes ----------
const GLS=[null,
 (g,P)=>{const o=P.ol;g.put(7,11,[ // rondes
   ".....oo.....",
   "ooooo..oo.o",
   ".....o..o.o",
   "......oo...",
 ],{o})},
 (g,P)=>{const o=P.ol;g.put(7,11,[ // carrées
   ".....oooo.oo",
   "ooooo...ooo",
   ".....o..o.o",
   ".....oooo.oo",
 ],{o})},
 (g,P)=>{const k="#1c2238",r="#8a9ccc";g.put(7,11,[ // soleil
   "kkkkkkkkkkkk",
   ".....rrkk.rk",
   ".....kkkk.kk",
   "......kk",
 ],{k,r})},
 (g,P)=>{const a=P.ac,A=P.acS,l=P.acL;g.put(7,10,[ // coeur
   ".....a.a",
   "oooo.aaaaaoa",
   ".....aaaA.aa",
   "......aA",
 ],{a,A,l,o:P.ol});g.set(12,11,P.acL)},
 (g,P)=>{const a=P.ac,A=P.acS;g.put(4,11,[ // masque
   "aa.aaaaaaaaaaa",
   ".aaaaaaa..aaaA",
   "aa.aaaaa..aaA",
   "....AAAAAAAA",
 ],{a,A})},
 (g,P)=>{g.put(12,10,[ // monocle
   ".ggg",
   "g...g",
   "g...g",
   "g...g",
   ".ggG",
   ".G",
   ".G",
   "G",
 ],GOLD)},
 (g,P)=>{const c="#3ae0e8",C="#1a8aa8",L="#c8fbff";g.put(6,11,[ // visière cyber
   "kkkkkkkkkkkkkk",
   "kccccccLLccccC",
   "kCCCCCCCCCCCC",
 ],{c,C,L,k:"#2c2c34"})},
 (g,P)=>{g.put(7,11,[ // dorées
   ".....gggg.gg",
   "GGGGGtttgggt",
   ".....tttg.gt",
   ".....GGGG.GG",
 ],{g:P.gold,G:P.goldS,t:"#c88a3a"})},
];

// ---------- bijoux ----------
const earR=(g,P)=>{g.set(5,13,P.gold);g.set(4,14,P.gold);g.set(6,14,P.goldS);g.set(5,15,P.goldS);g.set(5,14,HOLE)};
const chain=(g,P)=>{g.put(8,20,["g.....g",".gGgGg."],{g:P.gold,G:P.goldS})};
const BIJOU=[null,earR,chain,(g,P)=>{earR(g,P);chain(g,P)},
 (g,P)=>{g.set(18,14,P.metal);g.set(17,15,P.metalS)},
 (g,P)=>{g.put(8,20,["w.....w",".wWwWw."],{w:P.w,W:P.wS})},
 (g,P)=>{g.set(5,13,"#ffffff");g.set(5,14,"#7ae0ff");g.set(4,14,"#bff4ff")},
 (g,P)=>{chain(g,P);g.put(10,21,[".G.","gLg","GgG"],{g:P.gold,G:P.goldS,L:P.goldL})},
 // 8 Écharpe : tour de cou rayé, pan devant, pan qui flotte derrière
 (g,P)=>{const a=P.ac,S=P.acS,L=P.acL,w=P.w,W=P.wS;
   g.put(4,19,[
   "....LaawaaS",
   "..aaLawaaSS",
   ".waSaaSSSaS",
   "aS.......wS",
   "a........aS",
   ],{a,S,L,w,W});
   g.set(13,22,a);g.set(14,22,S);g.set(13,23,w);g.set(14,23,W);g.set(13,21,a)},
];

// ---------- humeurs (jauge) ----------
const MOODX=[null,
  (g,P)=>{g.set(13,13,P.w);g.set(14,13,P.ol);g.set(13,12,P.skS);g.set(14,12,P.skS);g.set(12,11,P.ol);g.set(13,10,P.ol);g.set(14,10,P.ol);g.set(13,14,"#7fd4ff");g.set(13,15,"#4aa8f0");g.set(13,16,"#7fd4ff");
    g.set(13,17,P.ol);g.rect(14,16,16,16,P.ol);g.set(17,17,P.ol);g.set(15,17,P.mouth)},
  (g,P)=>{g.set(13,13,P.w);g.set(14,13,P.ol);g.set(13,12,P.skS);g.set(14,12,P.skS);g.set(12,11,P.ol);g.set(13,11,P.ol);g.set(14,10,P.ol);
    g.set(13,17,P.mouth);g.rect(14,16,15,16,P.mouth);g.set(16,17,P.mouth)},
  (g,P)=>{g.set(13,12,P.w);g.set(14,12,P.ol);g.set(13,13,P.w);g.set(14,13,P.ec);g.rect(12,10,14,10,P.ol);
    g.rect(14,16,16,16,P.mouth)},
  (g,P)=>{g.set(13,12,P.w);g.set(14,12,P.ol);g.set(13,13,P.w);g.set(14,13,P.ec);g.set(12,10,P.ol);g.set(13,9,P.ol);g.set(14,9,P.ol);
    g.set(13,15,P.mouth);g.rect(14,16,15,16,P.mouth);g.set(16,15,P.mouth);g.set(10,15,P.blush);g.set(11,15,P.blush)},
  (g,P)=>{g.set(12,13,P.ol);g.set(13,12,P.ol);g.set(14,12,P.ol);g.set(15,13,P.ol);g.set(13,9,P.ol);g.set(14,9,P.ol);
    g.set(12,15,P.mouth);g.rect(13,16,16,16,P.mouth);g.rect(14,16,16,16,P.w);g.rect(13,17,16,17,P.mouth);g.rect(14,18,15,18,P.mouth);g.set(17,15,P.mouth);
    g.rect(10,15,11,15,P.blush);g.set(10,14,P.blush)}
];
function chHead(cfg){const c={...AV_DEF,...(typeof CH_DEF!=="undefined"?CH_DEF:{}),...(cfg||{})},P=chPal(c);
  const g=mk(),hb=mk(),hf=mk();const hr=HAIR[c.hair|0]||HAIR[0],hat=HAT[c.hat|0]||null;
  const pal={h:P.hc,s:P.hcS,l:P.hcL,k:P.sk,K:P.skS,o:P.ol,a:P.ac,r:avMix(P.sk,P.hc,.5),R:avMix(P.skS,P.hcS,.5)};
  if(hr.b)hb.put(0,hr.b[0],hr.b[1],pal);
  if(hr.f)hf.put(0,hr.f[0],hr.f[1],pal);
  if(hr.fn)hr.fn(hf,P);
  if(hat&&hat.clip){for(let y=0;y<Math.min(hat.clip,H);y++)for(let x=0;x<W;x++){hf.del(x,y);hb.del(x,y)}}
  if(hat&&hat.b)hat.b(g,P);
  body(g,P,c);
  over(g,hb);
  head(g,P);
  if(hr.ear!==false&&!hr.earTop)ear(g,P);
  if(hr.shine){g.set(10,6,P.skL);g.set(11,6,P.skL);g.set(9,7,P.skL)}
  if(MOODX[c.mood|0])MOODX[c.mood|0](g,P);else{(EYES[c.eyes|0]||EYES[0])(g,P);(MOUTH[c.mouth|0]||MOUTH[0])(g,P);g.set(11,15,P.blush)}
  if(MARK[c.mark|0])MARK[c.mark|0](g,P);
  if(BEARD[c.beard|0])BEARD[c.beard|0](g,P);
  if(MOODX[c.mood|0]&&BEARD[c.beard|0])MOODX[c.mood|0](g,P);
  over(g,hf);
  if(hr.earTop)ear(g,P);
  if(BIJOU[c.bijou|0]){const b=c.bijou|0;if(hr.ear===false&&(b===1||b===3||b===6)){g.set(6,15,P.gold);g.set(6,16,P.goldS);if(b!==1&&b!==6)chain(g,P)}else BIJOU[b](g,P)}
  {const gi=c.glasses|0;if(GLS[gi]){if(c.mood&&(gi===3||gi===4||gi===7)){const t=mk();GLS[gi](t,P);for(let y=4;y<H;y++)for(let x=0;x<W;x++)if(t.px[y*W+x])g.px[(y-4)*W+x]=t.px[y*W+x]}else GLS[gi](g,P)}}
  if(hat&&hat.d)hat.d(g,P);
  outline(g,P.ol);
  for(let i=0;i<W*H;i++)if(g.px[i]===HOLE)g.px[i]=null;
  return{W,H,px:g.px}}
window.chHead=chHead;
window.CH_HEAD_N={hair:HAIR.length,hat:HAT.length,glasses:GLS.length,beard:BEARD.length,eyes:EYES.length,mouth:MOUTH.length,mark:MARK.length,bijou:BIJOU.length};
})();

window.chHead=chHead;
})();
