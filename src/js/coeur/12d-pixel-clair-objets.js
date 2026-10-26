// Pixel Clair 
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
