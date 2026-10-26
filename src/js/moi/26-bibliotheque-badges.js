// ---- conditions des badges dont la fonction d'origine a disparu (boss, humeur, bilan repas, skill Sons, défis)
// ---- Bibliothèque : une étagère façon bloc de Minecraft, un livre de plus à chaque livre fini
const LIB_PAL=[["#8b2f2f","#4e1717","#c25a5a"],["#2f5d8b","#16304a","#5a93c2"],["#2f8b4a","#154a26","#5ac27a"],["#8b6b2f","#4a3716","#c2a15a"],["#6a2f8b","#361647","#a35ac2"],["#8b4a2f","#4a2416","#c2795a"],["#2f8b8b","#164a4a","#5ac2c2"],["#c9a227","#6e5610","#f4d767"],["#4a4f58","#1f2227","#80868f"],["#8b2f5e","#4a1632","#c25a8d"]];
const libHash=s=>{let h=5381;for(const c of String(s||""))h=(h*33^c.charCodeAt(0))>>>0;return h};
const libW=n=>!(n>0)?5:n<120?4:n<250?5:n<400?6:n<600?7:8;
const libDay=ms=>Math.max(0,Math.round(ms/864e5));
function libLayout(BK,cur){const U=48,rows=[[]];let x=0;
  const items=BK.map((b,i)=>({b,i,w:libW(b.n),h:11+libHash(b.t+"h")%6}));
  if(cur)items.push({b:cur,cur:1,w:libW(cur.n),h:11+libHash(cur.t+"h")%6});
  items.forEach(it=>{if(x+it.w>U){rows.push([]);x=0}it.x=x;x+=it.w;rows[rows.length-1].push(it)});
  while(rows.length<3)rows.push([]);return rows}
function libSvg(rows){const R=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`,W="54",RH=20,H=3+rows.length*RH,A="#a67c4a",D="#6b4a28",L="#c9a066";
  let s=`<svg class="libsvg" viewBox="0 0 54 ${H}" shape-rendering="crispEdges" role="group" aria-label="Étagère de livres">`;
  s+=R(0,0,54,H,"#2a1c10");
  rows.forEach((r,ri)=>{const y0=3+ri*RH;s+=R(3,y0,48,17,ri%2?"#2f2012":"#342414")+R(3,y0,48,1,"#1f150b")})
  s+=R(0,0,54,3,A)+R(0,0,54,1,L)+R(0,2,54,1,D);
  rows.forEach((r,ri)=>{const y0=3+ri*RH,yp=y0+17;s+=R(0,yp,54,3,A)+R(0,yp,54,1,L)+R(0,yp+2,54,1,D)});
  s+=R(0,3,3,H-3,A)+R(0,3,1,H-3,L)+R(2,3,1,H-3,D)+R(51,3,3,H-3,A)+R(51,3,1,H-3,L)+R(53,3,1,H-3,D);
  rows.forEach((r,ri)=>{const yb=3+ri*RH+17;r.forEach(it=>{const t=it.b.t,hs=libHash(t),p=LIB_PAL[hs%LIB_PAL.length],x0=3+it.x,w=it.w,h=it.h,top=yb-h;
    let g=`<g class="bk${it.cur?" cur":""}" data-i="${it.cur?"c":it.i}" tabindex="0" role="button" aria-label="${esc(t)}">`;
    g+=R(x0,top,w,h,p[1])+R(x0+1,top+1,w-2,h-2,p[0])+R(x0+1,top+1,1,h-2,p[2]);
    const k=(hs>>3)%3;
    if(k===0){g+=R(x0+1,top+2,w-2,1,"#f4d767")+R(x0+1,yb-3,w-2,1,"#f4d767")}
    else if(k===1&&w>=5)g+=R(x0+1,top+Math.floor(h/2)-1,w-2,3,"#f3e6c4")+R(x0+1,top+Math.floor(h/2),w-2,1,p[1]);
    else g+=R(x0+w-2,top+1,1,h-2,p[1]);
    if(it.cur)g+=R(x0+Math.floor(w/2),top-2,1,3,"#e8473a")+`<rect class="curg" x="${x0-.5}" y="${top-.5}" width="${w+1}" height="${h+1}" fill="none" stroke="#ffd94a" stroke-width="1"/>`;
    g+=`<rect x="${x0-.5}" y="${top-2}" width="${w+1}" height="${h+2}" fill="transparent"/></g>`;s+=g})});
  return s+"</svg>"}
function libFmt(ms){const d=libDay(ms);return d<1?"moins d'un jour":d===1?"1 jour":d+" jours"}
function libHTML(){const G=S.g,BK=G.books||[],cur=G.book,pg=Object.values(G.rdp||{}).reduce((a,b)=>a+b,0);
  return`<div class="gcard col1 libc"><div class="bh2"><h3>Bibliothèque</h3><span class="hint">${BK.length} livre${BK.length>1?"s":""}${pg?" · "+pg+" pages":""}</span></div>
    <div class="libshelf">${libSvg(libLayout(BK,cur))}</div>
    <div class="libinfo" id="libInfo" aria-live="polite"><p class="hint">${BK.length||cur?"Touche un livre pour voir son histoire.":"L'étagère est vide : lance une quête « Lire » pour poser ton premier livre."}</p></div></div>`}
function libBind(box){const G=S.g,BK=G.books||[],cur=G.book,info=box.querySelector("#libInfo");if(!info)return;
  const fd=ms=>{const d=new Date(ms);return d.getDate()+" "+MOIS[d.getMonth()]+" "+d.getFullYear()};
  const show=(g)=>{box.querySelectorAll(".bk.sel").forEach(x=>x.classList.remove("sel"));g.classList.add("sel");const c=g.dataset.i==="c",b=c?cur:BK[+g.dataset.i];if(!b)return;
    const row=(ic,l,v)=>`<li><i>${rkSvg(ic)}</i><span>${l}</span><b>${v}</b></li>`;let rows="";
    if(c){const pct=Math.round(b.p/b.n*100);rows=row("lire","Page",`${b.p} / ${b.n} · ${pct} %`)+(b.s?row("sablier","Depuis",libFmt(Date.now()-b.s)):"")+(b.x?row("eclair","XP déjà gagnés","+"+b.x):"")}
    else rows=row("sablier","Temps de lecture",b.s?libFmt(b.d-b.s):"non noté")+(b.n?row("lire","Pages",b.n):"")+row("eclair","XP gagnés","+"+(b.x||40))+row("calendrier","Fini le",fd(b.d));
    info.innerHTML=`<div class="libpop"><small>${c?"En cours":"Livre lu"}</small><h4></h4><ul>${rows}</ul></div>`;info.querySelector("h4").textContent=b.t;sfx&&sfx("coin")};
  box.querySelectorAll(".bk").forEach(g=>{g.onclick=()=>show(g);g.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();show(g)}}})}

function bgPrjWon(){return((S.g&&S.g.prj)||[]).filter(p=>p.won).length}
function bgClutch(){const F={};for(const e of S.log){if(!(e.xp>0)||e.bonus)continue;const k=dayKey(e.t);if(F[k])continue;F[k]=1;if(new Date(e.t).getHours()>=21)return true}return false}
function bgMealDays(){const G=S.g||{},D=new Set();Object.keys(G.mb||{}).concat(Object.keys(G.mbd||{})).forEach(k=>D.add(k.split(":")[0]));let n=0;D.forEach(d=>{if(["matin","soir"].every(per=>MB[per].every(([k])=>{const b=(G.mb||{})[d+":"+per],dr=(G.mbd||{})[d+":"+per],m=(b&&b.m)||(dr&&dr.m)||{};return m[k]===1})))n++});return n}
function bgMusic(){const R=/musique|\bsons?\b|beat|instru|guitare|piano|chant|couplet|morceau|studio|jam|freestyle|maquette/i;return S.log.filter(e=>e.xp>0&&(/^son\b/.test(e.lz||"")||R.test(e.name||""))).length}
function bgPerfect(){if((S.daily&&S.daily.bonusDay)||S.log.some(e=>e.dayb))return true;const T=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz);if(!T.length)return false;return Object.values(ritH()).some(H=>T.every(t=>H[t.id]))}
function bgSortie(){return S.log.some(e=>e.dzq)||Object.keys((S.g&&S.g.afLast)||{}).some(k=>k.startsWith("af:sorties:"))}
const TIERC={1:"#b0763c",2:"#aab4bd",3:"#e0b030"};
// badgeDefs : version complète (ex-réécriture de assiette.js), badgeDefsBase = le cœur d'origine
function badgeDefs(){const B=badgeDefsBase.apply(this,arguments);B.push({id:"veg7",name:"Potager",desc:"Des légumes 7 jours d'affilée",ic:"heart",t:2,ok:()=>typeof plVegRun==="function"&&plVegRun()>=7});return B}
function badgeDefsBase(){
  const L=()=>levelInfo(S.xp).l,B=[];
  RANKS.filter(r=>r[0]>1&&r[0]!==5).forEach(([min,n])=>B.push({id:"rank"+min,name:n,desc:"Atteindre le niveau "+min,ic:"shield",t:min<5?1:min<17?2:3,ok:()=>L()>=min}));
  B.push({id:"first",name:"Première quête",desc:"Accomplir ta première action",ic:"star",t:1,ok:()=>S.xp>0});
  [[3,"Régulier",1],[7,"Semaine de feu",2],[30,"Mois d'acier",3]].forEach(([n,nm,t])=>B.push({id:"streak"+n,name:nm,desc:n+" jours d'affilée",ic:"flame",t,ok:()=>streak()>=n}));
  STAT_KEYS.forEach(k=>B.push({id:"stat5"+k,name:CATS[k].label+" 5",desc:"Monter "+CATS[k].label+" au niveau 5",ic:"bolt",t:2,ok:()=>statInfo(S.stats[k]||0).l>=5}));
  B.push({id:"stat10",name:"Maître",desc:"Une caractéristique au niveau 10",ic:"bolt",t:3,ok:()=>STAT_KEYS.some(k=>statInfo(S.stats[k]||0).l>=10)});
  B.push({id:"eau3",name:"Hydraté",desc:"Eau niveau 3",ic:"drop",t:1,ok:()=>statInfo(S.stats.eau||0).l>=3});
  B.push({id:"food3",name:"Bon appétit",desc:"Nourriture niveau 3",ic:"heart",t:1,ok:()=>statInfo(S.stats.nourriture||0).l>=3});
  B.push({id:"bond1",name:"Premier contact",desc:"Prendre des nouvelles d'un ami",ic:"heart",t:1,ok:()=>Object.values(S.bonds).some(x=>x>0)});
  B.push({id:"bond3",name:"Pote",desc:"Un lien au niveau 5",ic:"heart",t:1,ok:()=>Object.values(S.bonds).some(x=>bondInfo(x).l>=5)});
  B.push({id:"bond5",name:"Ami proche",desc:"Un lien au niveau 10",ic:"heart",t:2,ok:()=>Object.values(S.bonds).some(x=>bondInfo(x).l>=10)});
  B.push({id:"bond20",name:"Âme sœur",desc:"Un lien au niveau 20",ic:"heart",t:3,ok:()=>Object.values(S.bonds).some(x=>bondInfo(x).l>=20)});
  B.push({id:"circle",name:"Cercle élargi",desc:"Contacter 10 personnes différentes en 30 jours",ic:"heart",t:2,ok:()=>relRecent(30)>=10});
  B.push({id:"loyal",name:"Fidèle",desc:"Prendre des nouvelles de la même personne 4 semaines d'affilée",ic:"heart",t:2,ok:()=>relLoyal()>=4});
  B.push({id:"reunion",name:"Retrouvailles",desc:"Reprendre contact avec quelqu'un après 2 mois de silence",ic:"heart",t:2,ok:()=>relReunion()});
  B.push({id:"grp1",name:"Esprit de bande",desc:"Accomplir 5 quêtes de groupe",ic:"heart",t:2,ok:()=>(S.g.fgQ||0)>=5});
  B.push({id:"grptour",name:"Tour du groupe",desc:"Contacter tous les membres d'un groupe en 30 jours",ic:"heart",t:3,ok:()=>fgList().some(g=>{const M=fgMembers(g.id);return M.length>=3&&M.every(n=>S.bondsLast[n]&&Date.now()-S.bondsLast[n]<30*864e5)})});
  // exploits
  const ym=ymOf(Date.now()),mx=o=>Math.max(0,...Object.values((o&&o.m)||{}));
  B.push({id:"pu100",name:"Centurion",desc:"100 pompes dans un même mois",ic:"bolt",t:1,ok:()=>mx(S.g.pu)>=100});
  B.push({id:"pu30",name:"Bras d'acier",desc:"30 pompes d'affilée",ic:"bolt",t:2,ok:()=>((S.g.pu||{}).rec||0)>=30});
  B.push({id:"pu500",name:"Machine de guerre",desc:"500 pompes dans un même mois",ic:"bolt",t:3,ok:()=>mx(S.g.pu)>=500});
  B.push({id:"gn120",name:"Planche de bois",desc:"Tenir 2 min de gainage",ic:"bolt",t:2,ok:()=>((S.g.gn||{}).rec||0)>=120});
  B.push({id:"run42",name:"Marathon du mois",desc:"42 km de course dans un même mois",ic:"bolt",t:3,ok:()=>mx(S.g.run)>=42});
  B.push({id:"zen60",name:"Esprit zen",desc:"60 min de méditation dans un même mois",ic:"face",t:2,ok:()=>mx(S.g.md)>=60});
  B.push({id:"book1",name:"Lecteur",desc:"Finir un livre",ic:"book",t:1,ok:()=>(S.g.books||[]).length>=1});
  B.push({id:"book5",name:"Rat de bibliothèque",desc:"Finir 5 livres",ic:"book",t:3,ok:()=>(S.g.books||[]).length>=5});
  B.push({id:"clean7",name:"Hygiène de vie",desc:"7 jours avec tous tes repas pris",ic:"face",t:2,ok:()=>bgMealDays()>=7});
  B.push({id:"goal7",name:"Objectif tenu",desc:"Atteindre l'objectif du jour 7 fois",ic:"star",t:2,ok:()=>(S.g.goalN||0)>=7});
  // secrets
  B.push({id:"clutch",name:"Sur le fil",desc:"Sauver ta journée avec une action après 21 h",ic:"trophy",t:2,sec:1,ok:()=>bgClutch()});
  B.push({id:"lucky3",name:"Chanceux",desc:"Vivre 3 événements rares",ic:"star",t:2,sec:1,ok:()=>(S.g.rareN||0)>=3});
  B.push({id:"secret1",name:"Chercheur de secrets",desc:"Accomplir une quête secrète",ic:"star",t:2,sec:1,ok:()=>(S.g.secDone||0)>=1});
  B.push({id:"rest1",name:"Sage",desc:"Prendre un jour off",ic:"face",t:1,sec:1,ok:()=>(S.g.offs||[]).length>=1});
  B.push({id:"bday",name:"Bon anniversaire",desc:"Souhaiter l'anniversaire d'un ami",ic:"gift",t:1,ok:()=>Object.keys(S.bdDone||{}).length>0});
  B.push({id:"skill1",name:"Apprenti artiste",desc:"Faire ta première séance de musique",ic:"book",t:1,ok:()=>bgMusic()>=1});
  B.push({id:"skill3",name:"Virtuose",desc:"Faire 15 séances de musique",ic:"book",t:2,ok:()=>bgMusic()>=15});
  B.push({id:"perfect",name:"Journée parfaite",desc:"Tous tes rituels faits dans la journée",ic:"star",t:2,ok:()=>bgPerfect()});
  B.push({id:"chall",name:"Défi relevé",desc:"Faire une sortie proposée",ic:"trophy",t:1,ok:()=>bgSortie()});
  B.push({id:"buy1",name:"Première panoplie",desc:"Compléter une panoplie",ic:"star",t:1,ok:()=>wrSetsDone().length>=1});
  B.push({id:"buy5",name:"Styliste",desc:"25 objets dans ta garde-robe",ic:"star",t:2,ok:()=>wrOwned()>=25});
  B.push({id:"buy15",name:"Grand styliste",desc:"50 objets dans ta garde-robe",ic:"star",t:3,ok:()=>wrOwned()>=50});
  B.push({id:"chest1",name:"Pilleur",desc:"Ouvrir ton premier coffre",ic:"gift",t:1,ok:()=>S.g.opened>=1});
  B.push({id:"gear4",name:"Collectionneur d'objets",desc:"Posséder 10 objets trouvés",ic:"star",t:2,ok:()=>S.g.gear.filter(id=>(gearOf(id)||{}).s!=="aura").length>=10});
  B.push({id:"legend",name:"Objet légendaire",desc:"Trouver un objet légendaire",ic:"star",t:3,ok:()=>S.g.gear.some(id=>(gearOf(id)||{}).r===3)});
  B.push({id:"out1",name:"Premier son sorti",desc:"Sortir un son",ic:"trophy",t:1,ok:()=>Object.keys(S.g.rel).length>=1});
  B.push({id:"out3",name:"Artiste régulier",desc:"Sortir 3 sons",ic:"trophy",t:2,ok:()=>Object.keys(S.g.rel).length>=3});
  B.push({id:"out12",name:"Une année de sons",desc:"Sortir 12 sons",ic:"trophy",t:3,ok:()=>Object.keys(S.g.rel).length>=12});
  B.push({id:"sleep7",name:"Gros dormeur",desc:"7 nuits de 7 h ou plus",ic:"face",t:1,ok:()=>Object.values(S.g.sleep).filter(x=>x.h>=7).length>=7});
  B.push({id:"mood30",name:"Introspection",desc:"Noter ton humeur 30 jours",ic:"face",t:2,ok:()=>Object.keys(S.g.mood||{}).length>=30});
  B.push({id:"lz5",name:"Passionné",desc:"Une compétence au niveau 5",ic:"book",t:2,ok:()=>Object.values(lzState().xp).some(x=>skInfo(x).l>=5)});
  B.push({id:"lz3x3",name:"Touche-à-tout",desc:"3 skills au niveau 3",ic:"star",t:2,ok:()=>Object.values(lzState().xp).filter(x=>skInfo(x).l>=3).length>=3});
  return B.map(b=>b.sec&&!S.badges[b.id]?{...b,name:"???",desc:"Badge secret : continue à jouer pour le découvrir"}:b);
}
function relRecent(d){return Object.values(S.bondsLast).filter(t=>t&&Date.now()-t<d*864e5).length}
function relLoyal(){const W=n=>Math.floor((n-mondayOf(0).getTime())/(7*864e5)),by={};S.log.filter(e=>e.who&&(e.rel||e.fr)).forEach(e=>{(by[e.who]=by[e.who]||new Set()).add(W(e.t))});let best=0;Object.values(by).forEach(set=>{const w=[...set].sort((a,b)=>a-b);let r=1;for(let i=1;i<w.length;i++){r=w[i]===w[i-1]+1?r+1:1;best=Math.max(best,r)}best=Math.max(best,w.length?1:0)});return best}
function relReunion(){const by={};S.log.filter(e=>e.who&&(e.rel||e.fr)).sort((a,b)=>a.t-b.t).forEach(e=>{(by[e.who]=by[e.who]||[]).push(e.t)});return Object.values(by).some(L=>L.some((t,i)=>i&&t-L[i-1]>60*864e5))}
function checkBadges(){
  const B=badgeDefs(),first=!S.badgesInit;let fresh=[];
  B.forEach(b=>{if(!S.badges[b.id]&&b.ok()){S.badges[b.id]=Date.now();fresh.push(b)}});
  S.badgesInit=true;
  if(fresh.length){if(!first)setTimeout(()=>sfx("badge"),400);if(!first){S.g.nb=[...new Set([...(S.g.nb||[]),...fresh.map(b=>b.id)])]}save()}
}

const BFAM=[["prog","Progression"],["reg","Régularité"],["rel","Relations"],["exp","Exploits"],["skl","Compétences & défis"],["col","Aventure & collection"]];
// famOf : version complète (ex-réécriture de assiette.js), famOfBase = le cœur d'origine
function famOf(id){return id==="veg7"?"reg":famOfBase(id)}
function famOfBase(id){return/^(rank|first|stat|eau3|food3)/.test(id)?"prog":/^(streak|perfect|sleep7|mood30|goal7|clean7)/.test(id)?"reg":/^(bond|circle|bday|loyal|reunion|grp)/.test(id)?"rel":/^(pu\d|gn120|run42|zen60|book|bossrev|bossleg|clutch|lucky3|secret1|rest1)/.test(id)?"exp":/^(skill|lz|out|chall)/.test(id)?"skl":"col"}
function badgePr(b){const id=b.id,m=x=>Math.max(0,...x);let r=null;
  const lv=k=>statInfo(S.stats[k]||0).l;
  if(/^rank(\d+)/.test(id))r=[levelInfo(S.xp).l,+id.slice(4)];
  else if(/^streak(\d+)/.test(id))r=[streak(),+id.slice(6)];
  else if(/^stat5/.test(id))r=[lv(id.slice(5)),5];
  else if(id==="stat10")r=[m(STAT_KEYS.map(lv)),10];
  else if(id==="eau3")r=[lv("eau"),3];else if(id==="food3")r=[lv("nourriture"),3];
  else if(id==="bond3"||id==="bond5"||id==="bond20")r=[m(Object.values(S.bonds).map(x=>bondInfo(x).l)),id==="bond3"?5:id==="bond5"?10:20];
  else if(id==="circle")r=[relRecent(30),10];else if(id==="loyal")r=[relLoyal(),4];else if(id==="grp1")r=[S.g.fgQ||0,5];
  else if(id==="pu100"||id==="pu500")r=[Math.max(0,...Object.values((S.g.pu&&S.g.pu.m)||{})),id==="pu100"?100:500];else if(id==="pu30")r=[(S.g.pu||{}).rec||0,30];
  else if(id==="gn120")r=[(S.g.gn||{}).rec||0,120];else if(id==="run42")r=[Math.round(Math.max(0,...Object.values((S.g.run&&S.g.run.m)||{}))),42];else if(id==="zen60")r=[Math.max(0,...Object.values((S.g.md&&S.g.md.m)||{})),60];
  else if(id==="book1"||id==="book5")r=[(S.g.books||[]).length,id==="book1"?1:5];else if(id==="goal7")r=[S.g.goalN||0,7];
  else if(id==="buy1")r=[wrSetsDone().length,1];else if(id==="buy5")r=[wrOwned(),25];else if(id==="buy15")r=[wrOwned(),50];
  else if(id==="boss4")r=[bgPrjWon(),4];
  else if(/^out(\d+)/.test(id))r=[Object.keys(S.g.rel).length,+id.slice(3)];
  else if(id==="sleep7")r=[Object.values(S.g.sleep).filter(x=>x.h>=7).length,7];
  else if(id==="mood30")r=[Object.keys(S.g.mood||{}).length,30];else if(id==="clean7")r=[bgMealDays(),7];
  else if(id==="lz5")r=[m(Object.values(lzState().xp).map(x=>skInfo(x).l)),5];
  else if(id==="lz3x3")r=[Object.values(lzState().xp).filter(x=>skInfo(x).l>=3).length,3];
  else if(id==="gear4")r=[S.g.gear.filter(x=>(gearOf(x)||{}).s!=="aura").length,10];
  else if(id==="skill3")r=[bgMusic(),15];
  return r?[Math.min(r[0],r[1]),r[1]]:null}
let bfOpen={};


// ---- badges en pixel art (même DA que les avatars)
const BPX_N=20,bpxCache={};
function bpxMask(shape){const m=BPX_M[shape]||BPX_M.shield,top=Math.floor((BPX_N-m.length)/2);return(x,y)=>{const r=m[y-top];return!!r&&r[x]==="#"}}
function bpxIcon(ic,n){const c=document.createElement("canvas");c.width=c.height=n;const g=c.getContext("2d");g.scale(n/24,n/24);const src=BI[ic]||"";
  src.replace(/<path[^>]*\sd="([^"]+)"/g,(_,d)=>{try{g.fill(new Path2D(d))}catch(e){}return""});
  src.replace(/<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"[^>]*r="([\d.]+)"/g,(_,x,y,r)=>{g.beginPath();g.arc(+x,+y,+r,0,7);g.fill();return""});
  src.replace(/<rect[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/g,(_,x,y,w,h)=>{g.fillRect(+x,+y,+w,+h);return""});
  const d=g.getImageData(0,0,n,n).data,o=[];for(let i=0;i<n*n;i++)o.push(d[i*4+3]>110);return o}


// ---- objets et auras en pixel art (même DA que les badges)


const AURA_PI={xmflakes:"snowflake",flames:"flame",stars:"star",notes:"note",neon:"bolt",goldaura:"sparkle",lotus:"lotus",hello:"bubble"},AURAPX={};
function auraPix(id,px){const u=AUI[id];if(!u)return"";if(!AURAPX[id]){const N=20,c=document.createElement("canvas");c.width=c.height=N;const g=c.getContext("2d");
  const inC=(x,y)=>Math.hypot(x+.5-N/2,y+.5-N/2)<=N/2-.4,has=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&inC(x,y);
  const base=u[1],ring=u[0];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!has(x,y))continue;let col=base;
    if(!has(x-1,y)||!has(x+1,y)||!has(x,y-1)||!has(x,y+1))col="#24182c";
    else if(!has(x-2,y)||!has(x+2,y)||!has(x,y-2)||!has(x,y+2))col=(y<N/2&&x<N/2)?avMix(ring,"#fff",.25):avMix(ring,"#000",.15);
    else if(!has(x-3,y)||!has(x,y-3))col=avMix(base,"#fff",.4);
    else if(!has(x+3,y)||!has(x,y+3))col=avMix(base,"#000",.25);
    g.fillStyle=col;g.fillRect(x,y,1,1)}
  const pm=PXI[AURA_PI[id]];if(pm){g.fillStyle="#ffffff";pm.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch==="#")g.fillRect(5+x,5+y,1,1)}))}
  AURAPX[id]=c.toDataURL()}
  return`<img class="aurapx" src="${AURAPX[id]}" width="${px}" height="${px}" alt="" aria-hidden="true">`}

const QHEX={sport:"#e8382f",perso:"#f08300",social:"#00a3a3",famille:"#4a55f5",maison:"#8a4df0",soi:"#1f7fe0",travail:"#6f7f99",eau:"#1a8cff",nourriture:"#9a5a26"};
function badgeColor(b){const id=b.id;if(bShape(b)==="heart")return"#e3263a";if(/^stat5/.test(id))return QHEX[id.slice(5)]||"#5b6ee1";
  return({first:"#36b679",stat10:"#b06ad9",eau3:QHEX.eau,food3:QHEX.nourriture,veg7:"#4fb84a",streak3:"#ff7a1a",streak7:"#ff5a1a",streak30:"#e8382f",perfect:"#f0b62e",sleep7:"#5b4fc8",mood30:"#e05a9a",
    bond1:"#f08cc0",bond3:"#e05a9a",bond5:"#d63b5b",circle:"#00a3a3",bday:"#e8406a",skill1:"#f08300",skill3:"#f08300",chall:"#2f9a5a",out1:"#c2185b",out3:"#c2185b",out12:"#c2185b",lz5:"#8a4fd0",lz3x3:"#36b679",
    buy1:"#e0b030",buy5:"#e0b030",buy15:"#e0b030",boss1:"#8a2a2a",boss4:"#8a2a2a",chest1:"#a0662e",gear4:"#4cc9f0",legend:"#ff9f1a"})[id]||(/^rank/.test(id)?"#5b6ee1":"#5b6ee1")}
/* Pixel Clair — badges (32x32) & badge icons (16x16).
   window.bdgPx(b, locked) -> {W:32,H:32,px}   b = {id, t, fam, ic}
   window.bdgIcon(id)      -> {W:16,H:16,px}
   px = Array(W*H) of CSS colours or null. No dependencies. */
