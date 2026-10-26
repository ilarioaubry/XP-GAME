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
