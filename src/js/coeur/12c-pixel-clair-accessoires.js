// Pixel Clair 
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
