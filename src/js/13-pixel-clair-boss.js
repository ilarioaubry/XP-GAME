// ===== Pixel Clair : boss (monstres des mauvaises habitudes) =====
// Grille 20 x 16 (viewBox 0 0 20 16), affichée en px*10 x px*8 comme l'ancien spriteSvg(kind,col,px).
// Lettres :
//   "." vide            "#" couleur principale (col)   "s" ombre de col (vers noir 25 %)
//   "l" reflet de col (vers blanc 30 %)                  "o" contour #24182c
//   "w" blanc (yeux)    "k" pupille #120c16             "m" bouche rouge sombre #8a2a3a
//   "t" dents #ffffff   "g" or #f0c040
//   couleurs fixes supplémentaires :
//   "c" os / crème #f4ead2   "d" crème ombrée #cbb994   "p" rose (joues, langue) #ff8aa0
//
// Animation d'attente (2 frames, à coller dans la feuille de style) :
/*
.bossani{position:relative;display:inline-block;line-height:0;vertical-align:middle}
.bossani svg{display:block}
.bossani .f1{position:absolute;left:0;top:0}
.bossani svg{animation:bossBlink 1.1s steps(1,end) infinite}
.bossani .f1{animation-delay:-.55s}
@keyframes bossBlink{0%{visibility:visible}50%{visibility:hidden}}
@media (prefers-reduced-motion:reduce){.bossani svg{animation:none}.bossani .f1{visibility:hidden}}
*/
const BOSS2={
slime:[[
  ".........oo.........",
  "........o##o........",
  ".......o#l##o.......",
  ".....oo#w###soo.....",
  "....o#lw#####sso....",
  "...o#ll#######sso...",
  "..o#lo########o#so..",
  ".o#l##oo####oo##sso.",
  ".o#l#www####www#sso.",
  ".o###wkk####kkw##so.",
  ".o###wkk####kkw##so.",
  ".o#pp##mtmmtm##ppso.",
  ".o######mmmm#####so.",
  ".osssssssssssssssso.",
  "..ossooooosoooosso..",
  "...oo.....o....oo..."],[
  "....................",
  ".........oo.........",
  "........o##o........",
  ".......o#l##o.......",
  ".....oo#w###soo.....",
  "...oo#lw#####ssoo...",
  "..o#lo########o#so..",
  ".o#l##oo####oo##sso.",
  ".o#l#www####www#sso.",
  ".o###wkk####kkw##so.",
  ".o###wkk####kkw##so.",
  ".o#pp##mtmmtm##ppso.",
  "o#######mmmm######so",
  "osssssssssssssssssso",
  ".ossoooooossoooooso.",
  "..oo......oo.....o.."]],
ghost:[[
  ".......oooooo.......",
  ".....oo######oo.....",
  "....o#l#######so....",
  "..oo#l#########so...",
  ".o#o#l#########so...",
  ".o##lwk######wkso...",
  "..o#lkkk####kkkso...",
  "...ol#kk####kk#so...",
  "...olpp######pps#o..",
  "...ol###tmmt###s##o.",
  "...ol###mmmm###so#o.",
  "..o######pp#####so..",
  "..o#############so..",
  "..osssosssosssossso.",
  "...oso.oso.oso.oso..",
  "....o...o...o...o..."],[
  "....................",
  ".......oooooo.......",
  ".....oo######oo.....",
  "....o#l#######so....",
  "...o#l#########soo..",
  "...o#l#########so#o.",
  "...olwk######wks##o.",
  "...olkkk####kkks#o..",
  "...ol#kk####kk#so...",
  "..o#lpp######ppso...",
  ".o##l###tmmt###so...",
  ".o#ol###mmmm###so...",
  "..o######pp#####so..",
  ".osssosssosssossso..",
  "..oso.oso.oso.oso...",
  "...o...o...o...o...."]],
golem:[[
  "....................",
  "....oooooooooooo....",
  "...o#l#########so...",
  "..o#l###########so..",
  "..o#l#oo####oo##so..",
  "..o#l#wwo##oww##so..",
  ".ollo#wkk##kkw#ollo.",
  "o##so#tmtmtmtm#o##so",
  "o##so#mmmppmmm#o##so",
  "o##so#mtmtmtmt#o##so",
  "o##sollllllllllo##so",
  "o##so####s#####o##so",
  "osssossssssssssossso",
  ".okkooooooooooookko.",
  "..oo............oo..",
  "...................."],[
  "....................",
  "....................",
  "....oooooooooooo....",
  "...o#l#########so...",
  "..o#l#oo####oo##so..",
  "..o#l#ooo##ooo##so..",
  ".ollo#wkk##kkw#ollo.",
  "o##so#tmtmtmtm#o##so",
  "o##so#mmmppmmm#o##so",
  "o##so#mtmtmtmt#o##so",
  "o##sollllllllllo##so",
  "o##so####s#####o##so",
  "osssossssssssssossso",
  ".okkooooooooooookko.",
  "..oo............oo..",
  "...................."]],
dragon:[[
  "..o..o........o..o..",
  ".o#ooco.oooo.ocoo#o.",
  "o##oocco####ocdoo##o",
  "o#s#ooc######doo#s#o",
  "o#sso#l#######soss#o",
  "osssoloo####oosossso",
  "osssolwk####kwsossso",
  "ososolwk####kwsososo",
  ".o.oo###o##o##soo.o.",
  "....o##ommmmo#so....",
  "....os##t##t##so....",
  ".....o##cccc#so.oo..",
  "....o###cccc#sso#co.",
  ".....o##ccdd#s###o..",
  ".....o##oooo##ooo...",
  "......oo....oo......"],[
  ".....o........o.....",
  "....oco.oooo.oco....",
  "..o.occo####ocdo.o..",
  ".o#o.oc######do.o#o.",
  "o##oo#l#######soo##o",
  "o#s#oloo####ooso#s#o",
  "o#ssolwk####kwsoss#o",
  "osssolwk####kwsossso",
  "ossso###o##o##sossso",
  "ososo##ommmmo#sososo",
  ".o.oos##t##t##soo.o.",
  ".....o##cccc#so.....",
  "....o###cccc#ssoo...",
  ".....o##ccdd#s##co..",
  ".....o##oooo##ooo...",
  "......oo....oo......"]],
bat:[[
  "......o......o......",
  "..o..o#o....o#o..o..",
  ".oso.o##oooo##o.oso.",
  ".ossoo#l####s#oosso.",
  ".os#sol######sos#so.",
  "os##sl#oo##oo#ss##so",
  "os###l#wk##kw#s###so",
  "os##sl#kk##kk#ss##so",
  "os#so#########sos#so",
  "ossoo##tmmmmt#soosso",
  "oso.o##ltmmt#sso.oso",
  ".o...o#llllll#so..o.",
  "......o######so.....",
  ".......okookoo......",
  "........o..o........",
  "...................."],[
  "......o......o......",
  ".....o#o....o#o.....",
  ".....o##oooo##o.....",
  ".....o#l####s#o.....",
  "..o..ol######so..o..",
  ".osool#oo##oo#sooso.",
  ".ossol#wk##kw#sosso.",
  ".os#sl#kk##kk#ss#so.",
  "os##s#########ss##so",
  "os#####tmmmmt#s###so",
  "os##s##ltmmt#sss##so",
  "os#soo#llllll#sos#so",
  "osso..o######so.osso",
  "oso....okookoo...oso",
  ".o......o..o......o.",
  "...................."]],
skull:[[
  ".........oo.........",
  ".......oo##oo.......",
  ".....oo#l###soo.....",
  "....o#l######sso....",
  "...o#l#cccccc##so...",
  "..o#lsccccccccss#o..",
  "..o#lsckkcckkdss#o..",
  "..o#lscklcclkdss#o..",
  "..o#lsckkcckkdss#o..",
  "..o#lscccooccdss#o..",
  "..o#ls#tototo#ss#o..",
  ".o#l#s#dddddd#s##so.",
  ".o#l############s#o.",
  ".o#l#############so.",
  ".ossosssossosssosso.",
  "..oo.ooo.oo.ooo.oo.."],[
  "....................",
  ".........oo.........",
  ".......oo##oo.......",
  ".....oo#l###soo.....",
  "....o#l######sso....",
  "...o#l#cccccc##so...",
  "..o#lsccccccccss#o..",
  "..o#lsckkcckkdss#o..",
  "..o#lsclkcclkdss#o..",
  "..o#lsckkcckkdss#o..",
  "..o#lscccooccdss#o..",
  "..o#ls#tototo#ss#o..",
  ".o#l#s#dddddd#s##so.",
  ".o#l#############so.",
  ".ossosssossosssosso.",
  "..oo.ooo.oo.ooo.oo.."]],
shroom:[[
  "......ooooooo.......",
  "....oo#l####soo.....",
  "...o#lcc######so....",
  "..o#l#cc###cc##so...",
  ".o#l#######cc###so..",
  ".o#cc####c#####sso..",
  ".ossssssssssssssso..",
  "..ooodododododooo...",
  "....ocwkccccwkdo....",
  "....ockkkcckkkdo....",
  "....occkkcckkcdo....",
  "....opcctmmtcpdo....",
  "....occcmmmmccdo....",
  "....oddddddddddo....",
  ".....ocdoooocdo.....",
  "......oo....oo......"],[
  "....................",
  "......ooooooo.......",
  "...ooo#l####sooo....",
  "..o#l#cc###cc##so...",
  ".o#l#######cc###so..",
  ".o#cc####c#####sso..",
  ".ossssssssssssssso..",
  "..ooodododododooo...",
  "....ocwkccccwkdo....",
  "....ockkkcckkkdo....",
  "....occkkcckkcdo....",
  "....opcctmmtcpdo....",
  "....occcmmmmccdo....",
  "....oddddddddddo....",
  ".....ocdoooocdo.....",
  "......oo....oo......"]]
};
const BOSS_FIX={o:"#24182c",w:"#ffffff",k:"#120c16",m:"#8a2a3a",t:"#ffffff",g:"#f0c040",c:"#f4ead2",d:"#cbb994",p:"#ff8aa0"};
function bossMix(a,b,t){
  const h=x=>{x=String(x).replace("#","");if(x.length===3)x=x.split("").map(c=>c+c).join("");const n=parseInt(x,16)||0;return[n>>16&255,n>>8&255,n&255]};
  const A=h(a),B=h(b);return"#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("");
}
function bossSvg(kind,col,px,fr){
  const frames=BOSS2[kind]||BOSS2.slime,G=frames[(fr|0)%frames.length];
  col=col||"#5fae4f";px=px||4;
  const pal=Object.assign({"#":bossMix(col,"#000",0),s:bossMix(col,"#000",.25),l:bossMix(col,"#fff",.3)},BOSS_FIX);
  let r="";
  for(let y=0;y<16;y++){const row=G[y];let x=0;
    while(x<20){const ch=row[x];if(ch==="."){x++;continue}let e=x+1;while(e<20&&row[e]===ch)e++;
      r+=`<rect x="${x}" y="${y}" width="${e-x}" height="1" fill="${pal[ch]||col}"/>`;x=e}}
  return`<svg viewBox="0 0 20 16" width="${px*10}" height="${px*8}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
function bossFrames(kind,col,px){
  return`<span class="bossani">${bossSvg(kind,col,px,0)}${bossSvg(kind,col,px,1).replace("<svg ",'<svg class="f1" ')}</span>`;
}

// ---- expressions du corps (humeur, fatigue, bâillement)
{const sadB=(g,A,P)=>{const b=A.brow+1,l=A.eyeL.x,r=A.eyeR.x,c=P.hcS;g.set(l-1,b,c);g.set(l,b,c);g.set(l+1,b-1,c);g.set(r+1,b,c);g.set(r,b,c);g.set(r-1,b-1,c)};
 CH_EYES[5]={draw(g,A,P){sadB(g,A,P);[A.eyeL,A.eyeR].forEach(e=>g.set(e.x,e.y+1,P.ol))}};
 CH_EYES[6]={draw(g,A,P){sadB(g,A,P);[A.eyeL,A.eyeR].forEach(e=>{g.set(e.x,e.y+1,P.ol);g.set(e.x,e.y+2,"#7fd4ff");g.set(e.x,e.y+3,"#4aa8f0")})}};
 CH_EYES[7]={draw(g,A,P){const d=avMix(P.skS,"#6a4a8a",.35);[A.eyeL,A.eyeR].forEach(e=>{g.set(e.x-1,e.y+1,P.ol);g.set(e.x,e.y+1,P.ol);g.set(e.x,e.y,P.skS);g.set(e.x-1,e.y+2,d);g.set(e.x,e.y+2,d)})}};
 CH_EYES[8]={draw(g,A,P){[A.eyeL,A.eyeR].forEach(e=>g.hline(e.x-1,e.x+1,e.y+1,P.ol))}};
 CH_MOUTH[5]={draw(g,A,P){const m=A.mouth;g.hline(m.x0,m.x1,m.y,P.mouth);g.set(m.x0-1,m.y+1,P.mouth);g.set(m.x1+1,m.y+1,P.mouth)}};
 CH_MOUTH[6]={draw(g,A,P){const m=A.mouth;g.set(m.x0,m.y+1,P.mouth);g.hline(m.x0+1,m.x1-1,m.y,P.mouth);g.set(m.x1,m.y+1,P.mouth)}};
 CH_MOUTH[7]={draw(g,A,P){const m=A.mouth;g.rect(m.x0,m.y-1,m.x1,m.y+2,P.ol);g.rect(m.x0+1,m.y,m.x1-1,m.y+1,"#a8323e");g.set(m.x0+1,m.y+1,"#e86a7a")}};}
const BODY_MOOD=[[6,5],[5,6],[0,1],[0,0],[1,2]];
function sceneState(){const G=S.g,tk=dayKey(Date.now()),md=(G.mood&&G.mood[tk])|0,sl=G.sleep&&G.sleep[tk],tired=!!(sl&&sl.h>0&&sl.h<6);
  const c={...AV_DEF,...(G.avc||{})};if(md){const[e,m]=BODY_MOOD[md-1];c.eyes=e;c.mouth=m}if(tired&&md!==1){c.eyes=7;if(!md||md>=3)c.mouth=1}{const w=typeof wxNow==="function"&&wxNow();if(w&&(w.k==="snow"||w.tc<=4)&&!(c.hat|0))c.hat=2}return{c,md,tired}}
