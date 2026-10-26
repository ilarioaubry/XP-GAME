// Pixel Clair 
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
