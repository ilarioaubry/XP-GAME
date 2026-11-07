// Pixel Clair 
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
