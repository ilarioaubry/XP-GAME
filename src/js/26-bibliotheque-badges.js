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
function bgPrjRev(){return((S.g&&S.g.prj)||[]).some(p=>{const T=[p.ct||0,...(p.st||[]).filter(s=>s.d).map(s=>s.d)].filter(Boolean).sort((a,b)=>a-b);for(let i=1;i<T.length;i++)if(T[i]-T[i-1]>=14*864e5)return true;return false})}
function bgPrjFast(){return((S.g&&S.g.prj)||[]).some(p=>p.won&&p.ct&&p.won-p.ct<7*864e5)}
function bgClutch(){const F={};for(const e of S.log){if(!(e.xp>0)||e.bonus)continue;const k=dayKey(e.t);if(F[k])continue;F[k]=1;if(new Date(e.t).getHours()>=21)return true}return false}
function bgSoiDays(){return Object.values((S.g&&S.g.hist)||{}).filter(x=>x&&x.c&&x.c.soi>0).length}
function bgMealDays(){const G=S.g||{},D=new Set();Object.keys(G.mb||{}).concat(Object.keys(G.mbd||{})).forEach(k=>D.add(k.split(":")[0]));let n=0;D.forEach(d=>{if(["matin","soir"].every(per=>MB[per].every(([k])=>{const b=(G.mb||{})[d+":"+per],dr=(G.mbd||{})[d+":"+per],m=(b&&b.m)||(dr&&dr.m)||{};return m[k]===1})))n++});return n}
function bgMusic(){const R=/musique|\bsons?\b|beat|instru|guitare|piano|chant|couplet|morceau|studio|jam|freestyle|maquette/i;return S.log.filter(e=>e.xp>0&&(/^son\b/.test(e.lz||"")||R.test(e.name||""))).length}
function bgPerfect(){if((S.daily&&S.daily.bonusDay)||S.log.some(e=>e.dayb))return true;const T=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz);if(!T.length)return false;return Object.values(ritH()).some(H=>T.every(t=>H[t.id]))}
function bgSortie(){return S.log.some(e=>e.dzq)||Object.keys((S.g&&S.g.afLast)||{}).some(k=>k.startsWith("af:sorties:"))}
const TIERC={1:"#b0763c",2:"#aab4bd",3:"#e0b030"};
function badgeDefs(){
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
  B.push({id:"bossrev",name:"Revanche",desc:"Reprendre un projet resté 2 semaines en plan",ic:"shield",t:2,ok:()=>bgPrjRev()});
  B.push({id:"clean7",name:"Hygiène de vie",desc:"7 jours avec tous tes repas pris",ic:"face",t:2,ok:()=>bgMealDays()>=7});
  B.push({id:"goal7",name:"Objectif tenu",desc:"Atteindre l'objectif du jour 7 fois",ic:"star",t:2,ok:()=>(S.g.goalN||0)>=7});
  // secrets
  B.push({id:"bossleg",name:"Tueur de légende",desc:"Finir un projet en moins d'une semaine",ic:"trophy",t:3,sec:1,ok:()=>bgPrjFast()});
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
  B.push({id:"boss1",name:"Tueur de boss",desc:"Vaincre le boss final d'un projet",ic:"shield",t:1,ok:()=>bgPrjWon()>=1});
  B.push({id:"boss4",name:"Chasseur de boss",desc:"Vaincre le boss final de 4 projets",ic:"shield",t:2,ok:()=>bgPrjWon()>=4});
  B.push({id:"chest1",name:"Pilleur",desc:"Ouvrir ton premier coffre",ic:"gift",t:1,ok:()=>S.g.opened>=1});
  B.push({id:"gear4",name:"Collectionneur d'objets",desc:"Posséder 10 objets trouvés",ic:"star",t:2,ok:()=>S.g.gear.filter(id=>(gearOf(id)||{}).s!=="aura").length>=10});
  B.push({id:"legend",name:"Objet légendaire",desc:"Trouver un objet légendaire",ic:"star",t:3,ok:()=>S.g.gear.some(id=>(gearOf(id)||{}).r===3)});
  B.push({id:"out1",name:"Premier son sorti",desc:"Sortir un son",ic:"trophy",t:1,ok:()=>Object.keys(S.g.rel).length>=1});
  B.push({id:"out3",name:"Artiste régulier",desc:"Sortir 3 sons",ic:"trophy",t:2,ok:()=>Object.keys(S.g.rel).length>=3});
  B.push({id:"out12",name:"Une année de sons",desc:"Sortir 12 sons",ic:"trophy",t:3,ok:()=>Object.keys(S.g.rel).length>=12});
  B.push({id:"sleep7",name:"Gros dormeur",desc:"7 nuits de 7 h ou plus",ic:"face",t:1,ok:()=>Object.values(S.g.sleep).filter(x=>x.h>=7).length>=7});
  B.push({id:"mood30",name:"Introspection",desc:"Noter ton humeur 30 jours",ic:"face",t:2,ok:()=>Object.keys(S.g.mood||{}).length>=30});
  B.push({id:"lz5",name:"Passionné",desc:"Un skill au niveau 5",ic:"book",t:2,ok:()=>Object.values(lzState().xp).some(x=>skInfo(x).l>=5)});
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

const BFAM=[["prog","Progression"],["reg","Régularité"],["rel","Relations"],["exp","Exploits"],["skl","Skills & défis"],["col","Aventure & collection"]];
function famOf(id){return/^(rank|first|stat|eau3|food3)/.test(id)?"prog":/^(streak|perfect|sleep7|mood30|goal7|clean7)/.test(id)?"reg":/^(bond|circle|bday|loyal|reunion|grp)/.test(id)?"rel":/^(pu\d|gn120|run42|zen60|book|bossrev|bossleg|clutch|lucky3|secret1|rest1)/.test(id)?"exp":/^(skill|lz|out|chall)/.test(id)?"skl":"col"}
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
const BPX_M={"heart":["....##........##....", "..######....######..", ".########..########.", "####################", "####################", "####################", "####################", "####################", ".##################.", "..################..", "...##############...", "....############....", ".....##########.....", "......########......", ".......######.......", "........####........", ".........##........."], "shield": [".##################.", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", ".##################.", ".##################.", "..################..", "...##############...", "....############....", ".....##########.....", "......########......", "........####........", ".........##........."], "hex": [".....##########.....", "....############....", "...##############...", "..################..", ".##################.", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", ".##################.", "..################..", "...##############...", "....############....", ".....##########....."], "diamond": [".........##.........", "........####........", ".......######.......", "......########......", ".....##########.....", "....############....", "...##############...", "..################..", ".##################.", "####################", "####################", ".##################.", "..################..", "...##############...", "....############....", ".....##########.....", "......########......", ".......######.......", "........####........", ".........##........."], "banner": [".##################.", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "####################", "########....########", "#######......#######", "######........######", "#####..........#####"]};
function bpxMask(shape){const m=BPX_M[shape]||BPX_M.shield,top=Math.floor((BPX_N-m.length)/2);return(x,y)=>{const r=m[y-top];return!!r&&r[x]==="#"}}
function bpxIcon(ic,n){const c=document.createElement("canvas");c.width=c.height=n;const g=c.getContext("2d");g.scale(n/24,n/24);const src=BI[ic]||"";
  src.replace(/<path[^>]*\sd="([^"]+)"/g,(_,d)=>{try{g.fill(new Path2D(d))}catch(e){}return""});
  src.replace(/<circle[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"[^>]*r="([\d.]+)"/g,(_,x,y,r)=>{g.beginPath();g.arc(+x,+y,+r,0,7);g.fill();return""});
  src.replace(/<rect[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/g,(_,x,y,w,h)=>{g.fillRect(+x,+y,+w,+h);return""});
  const d=g.getImageData(0,0,n,n).data,o=[];for(let i=0;i<n*n;i++)o.push(d[i*4+3]>110);return o}


// ---- objets et auras en pixel art (même DA que les badges)
const LOOTPX={},LOOTWAIT={},PX1="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";


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

const PXI={"snowflake":["....#.....",".#..#..#..","..#.#.#...","...###....","#########.","...###....","..#.#.#...",".#..#..#..","....#.....",".........."],"star": ["....##....", "....##....", "...####...", "##########", ".########.", "..######..", "..######..", ".###..###.", ".##....##.", "##......##"], "flame": ["....#.....", "....##....", "...###....", "...####.#.", "..######..", "..#######.", ".###.####.", ".##...###.", ".##...##..", "..######.."], "shield": ["##########", "##########", "##########", "##########", "##########", ".########.", ".########.", "..######..", "...####...", "....##...."], "heart": [".##....##.", "####..####", "##########", "##########", "##########", ".########.", "..######..", "...####...", "....##....", ".........."], "coin": ["..######..", ".##....##.", "##..##..##", "##.####.##", "##..##..##", "##..##..##", "##.####.##", "##..##..##", ".##....##.", "..######.."], "book": ["##########", "#....##..#", "#.##.##..#", "#....##..#", "#.##.##..#", "#....##..#", "#.##.##..#", "#....##..#", "##########", ".########."], "drop": ["....##....", "....##....", "...####...", "..######..", ".########.", ".########.", "##########", "##########", ".########.", "..######.."], "bolt": [".....###..", "....###...", "...###....", "..######..", "..#####...", "....###...", "...###....", "...##.....", "..##......", ".##......."], "trophy": ["##########", "##########", ".########.", ".########.", "..######..", "...####...", "....##....", "....##....", "..######..", "..######.."], "gift": ["..##..##..", "...####...", "##########", "##########", "##########", "....##....", "##########", "##########", "##########", "##########"], "face": ["..######..", ".########.", "##########", "###.##.###", "##########", "##.####.##", "###....###", "##########", ".########.", "..######.."], "note": ["......####", "....######", "....##..##", "....##..##", "....##..##", "....##..##", ".####.####", "######.###", "######....", ".####....."], "sparkle": ["....##....", "....##....", "...####...", "##########", "##########", "...####...", "....##..#.", "....##.###", "........#.", ".........."], "lotus": ["....##....", "...####...", "...####...", "#..####..#", "##.####.##", "###.##.###", "####..####", ".########.", "..######..", ".........."], "bubble": ["##########", "##########", "##.##.##.#", "##.##.##.#", "##########", "##########", "..###.....", ".##.......", "##........", ".........."]};
const QHEX={sport:"#e8382f",perso:"#f08300",social:"#00a3a3",famille:"#4a55f5",maison:"#8a4df0",soi:"#1f7fe0",travail:"#6f7f99",eau:"#1a8cff",nourriture:"#9a5a26"};
function badgeColor(b){const id=b.id;if(bShape(b)==="heart")return"#e3263a";if(/^stat5/.test(id))return QHEX[id.slice(5)]||"#5b6ee1";
  return({first:"#36b679",stat10:"#b06ad9",eau3:QHEX.eau,food3:QHEX.nourriture,veg7:"#4fb84a",streak3:"#ff7a1a",streak7:"#ff5a1a",streak30:"#e8382f",perfect:"#f0b62e",sleep7:"#5b4fc8",mood30:"#e05a9a",
    bond1:"#f08cc0",bond3:"#e05a9a",bond5:"#d63b5b",circle:"#00a3a3",bday:"#e8406a",skill1:"#f08300",skill3:"#f08300",chall:"#2f9a5a",out1:"#c2185b",out3:"#c2185b",out12:"#c2185b",lz5:"#8a4fd0",lz3x3:"#36b679",
    buy1:"#e0b030",buy5:"#e0b030",buy15:"#e0b030",boss1:"#8a2a2a",boss4:"#8a2a2a",chest1:"#a0662e",gear4:"#4cc9f0",legend:"#ff9f1a"})[id]||(/^rank/.test(id)?"#5b6ee1":"#5b6ee1")}
/* Pixel Clair — badges (32x32) & badge icons (16x16).
   window.bdgPx(b, locked) -> {W:32,H:32,px}   b = {id, t, fam, ic}
   window.bdgIcon(id)      -> {W:16,H:16,px}
   px = Array(W*H) of CSS colours or null. No dependencies. */
(function(){
'use strict';
var OL='#24182c';
/* ---------- shared icon palette (lower = base, UPPER = shade) ---------- */
var PAL={
  o:OL,
  w:'#fbf7ee',W:'#cdc4d6',
  k:'#3c3450',K:'#2a2238',
  j:'#9a9ab4',J:'#68688a',
  m:'#c8d0da',M:'#8a94a8',n:'#f4f8fa',
  g:'#f2c040',G:'#b87f1c',h:'#fff1a8',
  y:'#ffd84a',Y:'#e09a1a',
  a:'#ff9a2a',A:'#cf5e1a',
  r:'#e8433a',R:'#a8262e',q:'#ff9e8e',Q:'#e07a6a',
  p:'#ff7eb0',P:'#d04a86',
  e:'#5ac44a',E:'#2f8a3a',f:'#b0ee7a',
  u:'#4a8ef0',U:'#2c58b8',i:'#b4e0ff',
  c:'#4cd0e8',C:'#1890b0',
  v:'#a066e8',V:'#6a3ab0',
  l:'#c98a4a',L:'#8e5a2a',
  b:'#6e4220',B:'#4a2a16',
  t:'#f0dcae',T:'#c8a874',
  s:'#f6c79c',S:'#d8936a',
  d:'#5a3a8a',D:'#3c2766'
};
var SH={w:'W',k:'K',j:'J',m:'M',g:'G',y:'Y',a:'A',r:'R',p:'P',e:'E',u:'U',c:'C',v:'V',l:'L',b:'B',t:'T',s:'S',d:'D'};

/* ---------- little shape helpers for icon definitions ---------- */
function grid(w,h){var g=[];for(var y=0;y<h;y++){g.push(new Array(w+1).join('.').split(''));}return g;}
function toRows(g){return g.map(function(r){return r.join('');});}
function disc(g,cx,cy,r,ch){for(var y=0;y<g.length;y++)for(var x=0;x<g[0].length;x++){var dx=x-cx,dy=y-cy;if(dx*dx+dy*dy<=r*r)g[y][x]=ch;}}
function put(g,x0,y0,rows){rows.forEach(function(row,y){for(var x=0;x<row.length;x++){var c=row[x];if(c!=='.'&&g[y0+y]&&g[y0+y][x0+x]!==undefined)g[y0+y][x0+x]=c;}});}
function line(g,x0,y0,x1,y1,ch){var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(var i=0;i<=n;i++){var x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);if(g[y]&&g[y][x]!==undefined)g[y][x]=ch;}}
function recol(rows,map){return rows.map(function(r){return r.replace(/./g,function(c){return map[c]!==undefined?map[c]:c;});});}
function mirror(rows){return rows.map(function(r){return r.split('').reverse().join('');});}

/* reusable sprites */
var HEART9=[".rrr.rrr.","rqrrrrrrr","rqrrrrrrr","rrrrrrrrr",".rrrrrrr.","..rrrrr..","...rrr...","....r...."];

var STAR7=["...y...","..yyy..","yyyyyyy",".yyyyy.","..yyy..",".yy.yy.",".y...y."];
var SPARK=[".h.","hwh",".h."];
var SLIME7=["...e...","..eee..",".eeeee.","ewoewoe","eeeeeee",".eeeee."];
var BUST=[".bbb.","bbbbb","bsssb",".sos.","..s..",".uuu.","uuuuu","uuuuu"];
var BUST2=[".bbb.","bbbbb","bosob",".sss.",".uuu.","uuuuu","uuuuu"];

/* ---------- ICONS: content <= 14x14, auto-outlined, centred ---------- */
var IC={
/* ---- Progression ---- */
rank3:{r:[ // wooden training sword
"...l...",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"..tlL..",
"bbbbbbb",
"...B...",
"...B...",
"...B...",
"..lll.."]},
rank8:{r:[ // round guard shield
"....mmmmm....",
"..mmlllllmm..",
".mllLlllLllm.",
".mllLlllLllm.",
"mlllLlllLlllm",
"mlllLmmmLlllm",
"mlllLmnmLlllm",
"mlllLmmMLlllm",
"mlllLlllLlllm",
".mllLlllLllm.",
".mllLlllLllm.",
"..mmlllllmm..",
"....mmmmm...."]},
rank12:{r:[ // sword + shield
"..........n...",
".........nmM..",
".........nmM..",
"gggggggg.nmM..",
"grrggrrg.nmM..",
"grrggrRg.nmM..",
"gggggggg.nmM..",
"grrggrRg.nmM..",
"grrggrRg.nmM..",
".grggRg.YYYYY.",
".grggRg...b...",
"..gggg....b...",
"...gg.....b...",
".........YYY.."]},
rank17:{r:[ // laurel wreath + star
"...e.....e...",
"..ef.....fe..",
".eef.....fee.",
".ee...y...ee.",
"eef.yyyyy.fee",
"ee...yyy...ee",
"eef..y.y..fee",
".ee.......ee.",
".eef.....fee.",
"..eee...eee..",
"...eegggee...",
"....rgygr....",
"...rr...rr..."]},
rank23:{r:[ // crown
".h....h....h.",
"ggg..ggg..ggg",
".g...ggg...g.",
".gg..ggg..gg.",
".ggggggggggg.",
".ggggggggggg.",
".ggrgguggrgg.",
".ggggggggggg.",
".GGGGGGGGGGG."]},
rank30:{r:[ // dragon head (profile)
"...........tt.",
"..........tt..",
".........tt...",
".....rrrrrrr..",
"...rrrrrrrrrr.",
"..rrrrroyrrrrr",
".rrrrrrrrrrrrr",
"rorrrrrrrrrrrr",
"rrrrrrrrrrrrr.",
".wwwwRRRRrrrrr",
"......w.wrrrr.",
".rrrrrrrrrrrrr",
"..qqqqqqrrrrr.",
".........rrrr."]},
first:{r:[ // flag with "1"
".g..........",
".brrrrrrr...",
".brrrrwrrrrr",
".brrrwwrrrrr",
".brrrrwrrrrr",
".brrrrwrrrrr",
".brrrwwwrrrr",
".brrrrrrrr..",
".b..........",
".b..........",
".b..........",
".b..........",
"eeee........"]},
stat5sport:{r:[ // dumbbell
"..jj......jj..",
".jjjj....jjjj.",
".jjjj....jjjj.",
"mjjjjmmmmjjjjm",
"MjjjjMMMMjjjjM",
".jjjj....jjjj.",
".jjjj....jjjj.",
"..JJ......JJ.."],sh:0},
stat5perso:{r:[ // painter palette
"...ttttttt...",
"..ttrrtttuut.",
".tttrrtttuutt",
"ttttttttttttt",
"tyyttt.tttee.",
"tyytt...tteet",
"tttttt.tttttt",
"ttvvtttttttt.",
".tvvttttttt..",
"..ttttttt....",
"....ttt......"]},
stat5social:{r:[ // two speech bubbles
".wwwwwww......",
"wwwwwwwww.....",
"wwkwkwkww.....",
"wwwwwwwww.....",
"wwwwwwooo.....",
".wwwwoccccccc.",
".ww..ccccccccc",
".w...cccrcrccc",
".....cccrrrccc",
"......cccrccc.",
"...........cc.",
"............c."]},
stat5famille:{r:[ // house with heart
"......r......",
".....rrr.bb..",
"....rrrrrbb..",
"...rrrrrrrb..",
"..rrrrrrrrr..",
".rrrrrrrrrrr.",
"rrrrrrrrrrrrr",
".ttttttttttt.",
".tttpptppttt.",
".tttpppppttt.",
".ttttppptttt.",
".tttttpttttt.",
".TTTTTTTTTTT."]},
stat5maison:{r:[ // broom
"....l....",
"....l....",
"....l....",
"....l....",
"....l....",
"....l....",
"...rrr...",
"..yyyyy..",
"..yyyyy..",
".yyyyyyy.",
".yYyYyYy.",
"yyYyYyYyy",
"yYyYyYyYy",
"y.y.y.y.y"],sh:0},
stat5soi:{r:[ // lotus
"......p......",
".....ppp.....",
"....ppppp....",
".p..ppPpp..p.",
".pp.ppPpp.pp.",
".pppPpPpPppp.",
"pppppPPPppppp",
".ppppppppppp.",
"..eeeeeeeee..",
".eeEeeeeeEee.",
"..EEE...EEE.."]},
stat5travail:{r:[ // briefcase
"....BBBBB....",
"....B...B....",
".lllllllllll.",
"lllllllllllll",
"lllllllllllll",
"BBBBBgggBBBBB",
"lllllgYglllll",
"lllllllllllll",
"lllllllllllll",
".LLLLLLLLLLL."]},
stat10:{r:[ // mortarboard (master)
"......kk......",
"....kkjjkk....",
"..kkjjjjjjkk..",
"kkjjjjjjjjjjkk",
"..kkjjjggjkkk.",
"....kkkkgggg..",
"...KkkkkkkKg..",
"...kkkkkkkkg..",
"...kkkkkkkkgg.",
"....KKKKKK.gg."],sh:0},
eau3:{r:[ // water drop
"....c....",
"...ccc...",
"...ccc...",
"..ccccc..",
".ccccccc.",
".cwccccc.",
"cwwcccccc",
"cwccccccc",
"ccccccccc",
"cccccccCc",
".ccccCCc.",
"..ccccc.."]},
food3:{r:[ // apple
".....b.....",
".....bee...",
"....beeee..",
"..rrrbrrr..",
".rrrrrrrrr.",
"rrwrrrrrrrr",
"rwrrrrrrrrr",
"rrrrrrrrrrr",
"rrrrrrrrrrr",
".rrrrrrrrr.",
".rrrrrrrrr.",
"..rrr.rrr.."]},
veg7:{r:[ // brocoli
"...eeeee...",
".eefeeeeee.",
"eefeeeeefee",
"efeeeefeeee",
"eeeeeeeeeee",
".eeeeeeeee.",
"..eeffeee..",
"...fffff...",
"....fff....",
"....fff....",
"...fffff..."]},
/* ---- Relations ---- */
bond1:{L:[[HEART9,0,3],[SPARK,9,0]]},
bond3:{L:[[recol(HEART9,{r:'p',q:'w'}),0,0],[HEART9,5,5]]},
bond5:{f:function(){var g=grid(14,13);put(g,1,1,[".rrrr.rrrr.","rrqrrrrrrrr","rqrrrrrrrrr","rrrrrrrrrrr","rrrrrrrrrrr",".rrrrrrrrr.","..rrrrrrr..","...rrrrr...","....rrr....",".....r....."]);
  line(g,0,11,12,1,'l');put(g,10,0,["..w","ww.","w.."]);put(g,11,0,["","..",""]);g[12][0]='w';g[11][1]='l';return toRows(g);} },
bond20:{L:[[["w...........w","ww.........ww","www.......www","wwww.....wwww","wwww.....wwww",".www.....www.","..ww.....ww.."],0,0],[recol(HEART9,{r:'g',q:'h'}),2,3]]},
circle:{f:function(){var g=grid(14,14),cols=['u','r','e','y','v','a'];
  for(var k=0;k<6;k++){var a=-Math.PI/2+k*Math.PI/3,cx=Math.round(5+5*Math.cos(a)),cy=Math.round(5+5*Math.sin(a));
    var c=cols[k];put(g,cx,cy,["."+c+c+".",c+c+c+c,"ssss",".ss."]);}
  put(g,4,6,["rr.rr","rrrrr",".rrr.","..r.."]);return toRows(g);} },
loyal:{r:[
"..m.......m..",
"rrmrrrrrrrmrr",
"rrrrrrrrrrrrr",
"wwwwwwwwwwwww",
"wwwwrrwrrwwww",
"wwwrrrrrrrwww",
"wwwwrrrrrwwww",
"wwwwwrrrwwwww",
"wwwwwwrwwwwww",
"wjwjwjwjwjwjw",
"wwwwwwwwwwwww",
"WWWWWWWWWWWWW"]},
reunion:{r:[
"....rr.rr....",
"....rrrrr....",
".....rrr.....",
"......r......",
".bbb.....yyy.",
"bbbbs...syyyy",
"bbsss...sssyy",
".sos.....sos.",
".sss.....sss.",
".uuuu...pppp.",
"uuuuuu.pppppp",
"uuussssssspp p".replace(' ',''),
"uuuuuu.pppppp",
"uuuuuu.pppppp"]},
grp1:{L:[[recol(BUST2,{u:'e',b:'b'}),0,2],[recol(BUST2,{u:'a',b:'k'}),9,2],[recol(BUST,{b:'y'}),4,0]]},
grptour:{L:[[recol(BUST2,{u:'e',b:'b'}),0,0],[recol(BUST2,{u:'a',b:'k'}),9,0],[recol(BUST2,{b:'y'}),4.5|0,0],
  [[".........ff",
    "........fff",
    ".......fff.",
    "ff....fff..",
    "fff..fff...",
    ".fffffff...",
    "..fffff....",
    "...fff....."],3,6]]},
bday:{r:[
"......a......",
"......y......",
"......u......",
"......u......",
".ppppppppppp.",
".pwppppppppp.",
".lplllplllpl.",
".lllllllllll.",
".rrrrrrrrrrr.",
".lllllllllll.",
".lllllllllll.",
"mmmmmmmmmmmmm",
".MMMMMMMMMMM."]},
/* ---- Exploits ---- */
pu100:{r:[ // centurion helmet
"..rrrrrrrrr..",
".rrrrrrrrrrr.",
".rRrRrRrRrRr.",
"....ggggg....",
"...mmmmmmm...",
"..mnmmmmmmm..",
".mnmmmmmmmmm.",
".mmmmmmmmmmm.",
".ggggggggggg.",
".mmkkkkkkkmm.",
".mmkkkkkkkmm.",
".mmmkkkkkmmm.",
"..mmk...kmm..",
"..mm.....mm.."]},
pu30:{r:[ // flexed bicep with steel bracer
".....ssss....",
"....ssssss...",
"....sSsSss...",
"....ssssss...",
"...mmmm......",
"..mmmm..sss..",
"..sss..sssss.",
".ssss.sssssss",
".sssssssqqsss",
".ssssssqqssss",
"..sssssssssss",
"...SSSSSSSSSS"],sh:1},
pu500:{r:[ // war machine: robot head
"......rr......",
"......mm......",
"..mmmmmmmmmm..",
".mmnmmmmmmmmm.",
"jmnkkkkkkkkmmj",
"jmnkrrkkrrkmmj",
"jmmkkkkkkkkmmj",
".mmmmmmmmmmmm.",
".mmkykykykymm.",
".mmmmmmmmmmmm.",
"..MMMMMMMMMM.."]},
gn120:{r:[ // stopwatch
".....mmm.....",
"......m......",
"....mmmmm....",
"..mmwwwwwmm..",
".mwwwwkwwwwm.",
".mwwwwkwwwwm.",
"mwwwwwkwwwwwm",
"mwwwwwkrrrwwm",
"mwwwwwwwwwwwm",
".mwwwwwwwwwm.",
".mwwwwwwwwwm.",
"..mmwwwwwmm..",
"....mmmmm...."]},
run42:{r:[ // running shoe
".uuuu.........",
".uuuuu........",
".uuuwuw.......",
".uuuuwuw......",
"uuuuuuuwuuu...",
"uuwwuuuuuuuuu.",
"uuuwwwwuuuuuuu",
"wwwwwwwwwwwwww",
"rrr.rrrr.rrrr."]},
zen60:{r:[ // meditating figure
".....bbb.....",
"....bbbbb....",
"....sssss....",
"....sosos....",
".....sss.....",
"......s......",
"...vvvvvvv...",
"..vvvvvvvvv..",
".svvvvvvvvvs.",
"s.vvvvvvvvv.s",
"ss.vvvvvvv.ss",
"uuuuuuuuuuuuu",
".uuuuuuuuuuu."]},
book1:{r:[ // open book
".wwwww..wwwww.",
"wwwwwwWwwwwwww",
"wjjjjwWwjjjjjw",
"wwwwwwWwwwwwww",
"wjjjjwWwjjjjjw",
"wwwwwwWwwwwwww",
"wjjjwwWwjjjwww",
"wwwwwwWwwwwwww",
"uuuuuuUuuuuuuu",
".uuuuu..uuuuu."]},
book5:{L:[
 [["aaaaaaaaw","aayaaaaaw"],2,0],
 [["uuuuuuuuuuw","uuuyuuuuuuw"],1,3],
 [["eeeeeeeeeew","eyeeeeeeeew"],2,6],
 [["rrrrrrrrrrrw","rrryrrrrrrrw"],0,9],
 [["vvvvvvvvvvw","vvvvyvvvvvw"],1,12]]},
bossrev:{f:function(){var g=grid(14,14);
  var S=[
  "...........nm",
  "..........nmM",
  ".........nmM.",
  "........nmM..",
  ".......nmM...",
  "......nmM....",
  "..Y..nmM.....",
  "..YYnmM......",
  "...YYM.......",
  "..bbYY.......",
  ".bb..Y.......",
  "gb...........",
  "g............"];
  put(g,0,0,S);put(g,1,0,mirror(S).map(function(r){return r.replace(/M/g,'m');}));return toRows(g);} ,sh:0},
clean7:{L:[[[
".......eeeee",
".....eeeeeee",
"....eeeeeEee",
"...eeeeeEeee",
"..efeeeEeeee",
"..efeeEeeee.",
".efeeEeeeee.",
".eeeEeeeee..",
".eeEeeeee...",
"..Eeeeee....",
".E.eee......",
"E..........."],2,1],[["..h..",".hwh.","hwwwh",".hwh.","..h.."],0,0]]},
goal7:{f:function(){var g=grid(14,14);var cs=['r','w','r','w','r'];
  for(var i=0;i<5;i++)disc(g,5.5,8,6.4-i*1.35,cs[i]);
  line(g,6,7,12,1,'b');put(g,10,0,["...","..."]);put(g,11,0,["r.r","rr.",".rr"].map(function(r){return r;}));g[0][13]='r';
  put(g,4,8,["k"]);put(g,5,7,["k"]);return toRows(g);} },
bossleg:{r:[ // horned skull with glowing eyes
"t............t",
"tt..........tt",
".tt.wwwwww.tt.",
"..twwwwwwwwt..",
"..wwwwwwwwww..",
".wwwwwwwwwwww.",
".wwoooowooooww".slice(0,14),
".wworowwworoww".slice(0,14),
".wwoooowwoooww",
"..wwwwwoowwww.",
"...wwwwwwwww..",
"...wowowowow..",
"....wwwwwww..."]},
clutch:{r:[ // hourglass
"lllllllllll",
".iiiiiiiii.",
".iyyyyyyyi.",
"..iyyyyyi..",
"...iyyyi...",
"....iyi....",
".....y.....",
"....iyi....",
"...iiyii...",
"..iiyyyii..",
".iyyyyyyyi.",
".iyyyyyyyi.",
"lllllllllll"],sh:0},
lucky3:{r:[ // four-leaf clover
".eee.eee...",
"eefeeefeee.",
"eeeeEeeeee.",
"eeeeEeeeee.",
".eeeEeeee..",
"EEEEEEEEEEE",
".eeeEeeee..",
"eeeeEeeeee.",
"eefeEefeee.",
"eeeee.eeee.",
".eee..E....",
".......E...",
"........E.."].map(function(r){return r;}),sh:0},
secret1:{r:[ // golden key + "?"
".........yyy..",
"........y...y.",
"............y.",
"..........yy..",
".ggg......y...",
"ggggg.........",
"gg.ggggggggggg",
"ggggg....g.gg.",
".ggg.....g..g."]},
rest1:{f:function(){var g=grid(14,14);disc(g,5,8,5.6,'y');disc(g,7.6,6.3,4.6,'.');
  put(g,8,0,["wwww","..w.",".w..","wwww"]);put(g,11,5,["www",".w.","www"]);return toRows(g);} },
/* ---- Skills & défis ---- */
skill1:{r:[ // music note
"...ww...",
"...www..",
"...w.ww.",
"...w..ww",
"...w...w",
"...w....",
"...w....",
"...w....",
".www....",
"wwww....",
"wwww....",
".ww....."]},
skill3:{r:[ // guitar
"...bbb...",
"...bbb...",
"....l....",
"....l....",
"....l....",
"...aaa...",
"..aalaa..",
"..aakaa..",
"..aaaaa..",
".aaaaaaa.",
"aaaaaaaaa",
"aaabbbaaa",
"aaaaaaaaa",
".aaaaaaa."]},
perfect:{f:function(){var g=grid(14,14);
  [[6,0],[6,1],[7,0],[7,1],[6,12],[6,13],[7,12],[7,13],[0,6],[1,6],[0,7],[1,7],[12,6],[13,6],[12,7],[13,7],[2,2],[11,2],[2,11],[11,11]].forEach(function(p){g[p[1]][p[0]]='a';});
  disc(g,6.5,6.5,4.6,'y');
  put(g,4,4,[".....E","....EE","E..EE.","EEEE..",".EE..."]);return toRows(g);} },
chall:{r:[ // trophy
"...ggggggg...",
"gg.ghggggg.gg",
"g..ghggggg..g",
"g..ghggggg..g",
".g.ggggggg.g.",
"..ggggggggg..",
"....ggggg....",
".....ggg.....",
"......g......",
".....ggg.....",
"...bbbbbbb...",
"...bbgggbb...",
"...bbbbbbb..."]},
out1:{f:function(){var g=grid(13,13);disc(g,6,6,6.5,'k');disc(g,6,6,4.8,'K');disc(g,6,6,4.1,'k');disc(g,6,6,2.4,'p');g[6][6]='o';
  g[2][4]='j';g[3][3]='j';g[1][6]='j';g[2][5]='j';return toRows(g);} ,sh:0},
out3:{r:[ // microphone
"..mmmm..",
".mnmmmm.",
".nmMmMm.",
".mmmmmm.",
".mMmMmm.",
"..mmmm..",
".rrrrrr.",
"..kkkk..",
"..kkkk..",
"...kk...",
"...kk...",
"...kk...",
"..kkkk.."],sh:0},
out12:{f:function(){var g=grid(14,14);disc(g,6,7,6.5,'g');disc(g,6,7,4.8,'G');disc(g,6,7,4.1,'g');disc(g,6,7,2.4,'r');g[7][6]='o';
  g[3][4]='h';g[4][3]='h';g[2][6]='h';g[3][5]='h';put(g,11,0,[".h.","hwh",".h."]);put(g,0,11,[".h.","hwh",".h."]);return toRows(g);} ,sh:0},
lz5:{f:function(){var g=grid(14,13);
  put(g,0,0,["......y......","......y......",".....yyy.....","....yyyyy....","yyyyyyyyyyyyy",".yyyyyyyyyyy.","..yyyyyyyyy..","...yyyyyyy...","...yyyyyyy...","..yyyyyyyyy..","..yyyy.yyyy..",".yyy.....yyy.",".y.........y."]);
  put(g,5,3,["ooo","o..","ooo","..o","ooo"]);return toRows(g);} },
lz3x3:{L:[[STAR7,0,6],[recol(STAR7,{y:'m'}),7,6],[recol(STAR7,{y:'a'}),3.5|0,0]]},
/* ---- Régularité ---- */
streak3:{r:[ // small flame
"....a....",
"...aa....",
"...aaa...",
"..aaaa.a.",
"..aayaaa.",
".aaayyaaa",
".aayyyyaa",
"aaayhhyaa",
"aayhhhhya",
"aayhhhhya",
".aayhhyaa",
"..aaaaaa."]},
streak7:{r:[ // big flame
"......a......",
".....aa......",
".....aaa.....",
"....aaaa..a..",
"..a.aaaaa.aa.",
"..aaaayaaaaa.",
".aaaayyaaaaa.",
".aaayyyyaaaaa",
"aaaayyhyyyaaa",
"aaayyhhhyyaaa",
"aaayhhhhhyaaa",
".aayhhhhhyaa.",
"..aayyyyyaa..",
"....aaaaa...."]},
streak30:{r:[ // blazing triple flame
"......r.......",
".....rr.......",
"..r..rar....r.",
".rr..raar..rr.",
".rar.raaar.rar",
"rraarraaarrrar",
"raaarraaaarraa",
"raaaaayaaaaaar",
"raayaayyyaayar",
"raayyyyhyyyyar",
"rayyyhhhhhyyar",
"rraayhhhhhyarr",
".rraayyyyyarr.",
"...rrrrrrrr..."]},
clean7_:null,
sleep7:{r:[ // bed + sleeper
"ll............",
"ll...........",
"ll..........",
"llwwss.......",
"llwwbsuuuuuuu",
"lluuuuuuuuuuu",
"lluuuuuuuuuuul",
"llllllllllllll",
"l............l"]},
mood30:{f:function(){var g=grid(13,13);disc(g,6,6,6.4,'y');
  put(g,3,4,["o...o","o...o"]);put(g,3,4,["o....","o...."]);g[4][8]='o';g[5][8]='o';
  put(g,2,7,["p.......p"]);put(g,3,8,["o.....o",".o...o.","..ooo.."]);g[2][3]='h';g[3][2]='h';return toRows(g);} },
/* ---- Aventure & collection ---- */
buy1:{r:[ // t-shirt
"...rrr.rrr...",
".rrrrrrrrrrr.",
"rrrrrrrrrrrrr",
"rrrrrwwwrrrrr",
".rr.rrrrr.rr.",
"....rrrrr....",
"....rrrrr....",
"....rrrrr....",
"....rrrrr....",
"....RRRRR...."],sh:0},
buy5:{r:[ // hanger with dress
"......mm......",
".....m..m.....",
"........m.....",
".......m......",
"......pp......",
"....mmpPmm....",
"..mm.pppP.mm..",
"mmmm.pppP.mmmm",
"....ppppPP....",
"...ppppppP....",
"..pppppppPP...",
".pppppppppP...",
".PPPPPPPPPPP.."],sh:0},
buy15:{r:[ // wardrobe
".LLLLLLLLLL.",
"llllllllllll",
"lttttllttttl",
"lttttllttttl",
"lttttllttttl",
"ltttgllgtttl",
"lttttllttttl",
"lttttllttttl",
"lttttllttttl",
"llllllllllll",
"ll........ll"]},
boss1:{r:[ // slime
"......e......",
".....eee.....",
"....eeeee....",
"...eefeeee...",
"..eefeeeeee..",
".eeeeeeeeeee.",
".eewoeeewoee.",
"eeewoeeewoeee",
"eeeeeeeeeeeee",
"eeeeerrreeeee",
"eeeeeeeeeeeee",
".eeeeeeeeeee."]},
boss4:{L:[[recol(SLIME7,{e:'v'}),0,1],[recol(SLIME7,{e:'u'}),7,1],[recol(["....e....","...eee...","..eeeee..",".eeeeeee.","eewoeewoe","eewoeewoe","eeeeeeeee","eeerrreee",".eeeeeee."],{e:'r',r:'k'}),2,5]]},
chest1:{r:[ // treasure chest
"..llllllllll..",
".lgllllllllgl.",
"llglllllllllgl".slice(0,14),
"ggggggyygggggg",
"llgllyooylllgl",
"llglllyylllgll",
"llgllllllllgll",
"llgllllllllgll",
"LLgLLLLLLLLgLL"]},
gear4:{r:[ // backpack
"....bbbb....",
"...b....b...",
"..aaaaaaaa..",
".aaaaaaaaaa.",
".aaaaaaaaaa.",
"aaaaaaaaaaaa",
"aAAAAAAAAAAa",
"aaaaaggaaaaa",
"aallllllllaa",
"aallllllllaa",
"aallllllllaa",
"aaaaaaaaaaaa",
".AAAAAAAAAA."]},
legend:{L:[[[
"...vvvvvvv...",
"..vwvvvvvvv..",
".vwvvvvvvvvv.",
"VVVVVVVVVVVVV",
".vvvVvvvVvvv.",
"..vvVvvvVvv..",
"...vVvvvVv...",
"....vVvVv....",
".....vVv.....",
"......v......"],0,2],[SPARK,11,0],[SPARK,0,9]]}
};
delete IC.clean7_;
IC.chest1.r[2]="llgllllllllgll";
IC.chest1.r[4]="llgllyooyllgll";

/* ---------- icon renderer ---------- */
var _icCache={};
function buildIconChars(def){
  var rows;
  if(def.f) rows=def.f();
  else if(def.L){
    var W=0,H=0;def.L.forEach(function(l){H=Math.max(H,l[2]+l[0].length);l[0].forEach(function(r){W=Math.max(W,l[1]+r.length);});});
    var g=grid(W,H);
    def.L.forEach(function(l,li){
      var rr=l[0],ox=l[1],oy=l[2];
      if(li>0){ // stamp an outline around this layer over what is under it
        for(var y=-1;y<=rr.length;y++)for(var x=-1;x<=W;x++){
          var inL=function(xx,yy){return yy>=0&&yy<rr.length&&xx>=0&&xx<(rr[yy]||'').length&&rr[yy][xx]!=='.';};
          if(inL(x,y))continue;
          if(inL(x-1,y)||inL(x+1,y)||inL(x,y-1)||inL(x,y+1)){
            var gy=oy+y,gx=ox+x;if(g[gy]&&g[gy][gx]!==undefined&&g[gy][gx]!=='.')g[gy][gx]='o';}
        }
      }
      put(g,ox,oy,rr);
    });
    rows=toRows(g);
  } else rows=def.r;
  return rows;
}
function iconGrid(id){
  if(_icCache[id])return _icCache[id];
  var def=IC[id];var out=new Array(256).fill(null);
  if(!def){_icCache[id]=out;return out;}
  var rows=buildIconChars(def);
  var x0=99,y0=99,x1=-1,y1=-1;
  rows.forEach(function(r,y){for(var x=0;x<r.length;x++)if(r[x]!=='.'&&r[x]!==' '){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}});
  var w=x1-x0+1,h=y1-y0+1,ox=Math.floor((16-w)/2)-x0,oy=Math.floor((16-h)/2)-y0;
  var ch=new Array(256).fill(null);
  rows.forEach(function(r,y){for(var x=0;x<r.length;x++){var c=r[x];if(c==='.'||c===' ')continue;var X=x+ox,Y=y+oy;if(X>=0&&X<16&&Y>=0&&Y<16)ch[Y*16+X]=c;}});
  var sh=def.sh===undefined?1:def.sh;
  if(sh){ // auto shade: right / bottom edge pixels
    var c2=ch.slice();
    for(var y=0;y<16;y++)for(var x=0;x<16;x++){var c=ch[y*16+x];if(!c||!SH[c])continue;
      var R=x<15?ch[y*16+x+1]:null,B=y<15?ch[(y+1)*16+x]:null;
      if(!R||!B||R==='o'||B==='o')c2[y*16+x]=SH[c];}
    ch=c2;
  }
  for(var i=0;i<256;i++)if(ch[i])out[i]=PAL[ch[i]]||ch[i];
  // outline (4-neighbour)
  var o2=out.slice();
  for(var y=0;y<16;y++)for(var x=0;x<16;x++){if(out[y*16+x])continue;
    if((x>0&&out[y*16+x-1])||(x<15&&out[y*16+x+1])||(y>0&&out[(y-1)*16+x])||(y<15&&out[(y+1)*16+x]))o2[y*16+x]=OL;}
  _icCache[id]=o2;return o2;
}

/* ---------- colours ---------- */
function hx(c){c=c.replace('#','');return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function toHex(a){return '#'+a.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?'0':'')+v.toString(16);}).join('');}
function mix(a,b,t){a=hx(a);b=hx(b);return toHex([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]);}
function lum(c){var a=hx(c);return (0.299*a[0]+0.587*a[1]+0.114*a[2])/255;}
var TIER={1:{m:'#b0763c',s:'#7a4b24',l:'#dca068'},2:{m:'#aab4bd',s:'#727c8a',l:'#eef3f5'},3:{m:'#e0b030',s:'#a2701a',l:'#fff0a0'}};
var FILL={
 rank3:'#5b6ee1',rank8:'#5b6ee1',rank12:'#5b6ee1',rank17:'#4d63d6',rank23:'#5a4fd0',rank30:'#6f3fc0',
 first:'#36b679',
 stat5sport:'#e8382f',stat5perso:'#f08300',stat5social:'#00a3a3',stat5famille:'#4a55f5',stat5maison:'#8a4df0',stat5soi:'#1f7fe0',stat5travail:'#6f7f99',stat10:'#b06ad9',
 eau3:'#2c62c8',food3:'#9a5a26',veg7:'#2f8a3a',
 streak3:'#c4502a',streak7:'#a83634',streak30:'#7a2a4a',clean7:'#2f8a9a',goal7:'#4f6ed8',perfect:'#3f9ae0',sleep7:'#5b4fc8',mood30:'#e05a9a',
 bond1:'#ef6aa4',bond3:'#d84a70',bond5:'#b8325a',bond20:'#8e2a5a',circle:'#2fa0a0',loyal:'#7f56d0',reunion:'#e07a3a',grp1:'#3a9a5a',grptour:'#3a72d0',bday:'#5ab0e0',
 pu100:'#b0453a',pu30:'#4f5fb8',pu500:'#6a3f8a',gn120:'#2f8f86',run42:'#e07a2a',zen60:'#7a5ad0',book1:'#3a7ac0',book5:'#8a5a3a',bossrev:'#a83a3a',
 bossleg:'#4a3a6a',clutch:'#5f6fb8',lucky3:'#2f6f8a',secret1:'#5a4a8a',rest1:'#2a3a7a',
 skill1:'#f08300',skill3:'#3a6ab0',chall:'#2f9a5a',out1:'#c2185b',out3:'#9a1a6a',out12:'#6a1a4a',lz5:'#8a4fd0',lz3x3:'#36b679',
 buy1:'#3aa0c0',buy5:'#7a5ac8',buy15:'#3f8a6a',boss1:'#8a2a2a',boss4:'#4a2a5a',chest1:'#3a7a9a',gear4:'#4cc9f0',legend:'#ff9f1a'
};

/* ---------- frame silhouettes ---------- */
var N=32;
function mk(fn){var m=new Array(N*N);for(var y=0;y<N;y++)for(var x=0;x<N;x++)m[y*N+x]=!!fn(x,y);return m;}
var SHAPES={};
function shapes(fam){
  if(SHAPES[fam])return SHAPES[fam];
  var S={base:null,extra:null,under:null,cx:15.5,cy:15.5,io:[8,8],gemY:0};
  if(fam==='prog'){ // heraldic shield
    S.base=mk(function(x,y){if(y<1)return 0;var dx=Math.abs(x-15.5);
      if(y===1)return dx<=12.5;
      if(y<=14)return dx<=13.6;var t=(y-14)/17.6;if(t>=1)return 0;return dx<=14*Math.pow(1-Math.pow(t,1.8),0.6);});
    S.cy=13;S.io=[8,6];S.gemY=0;
  } else if(fam==='reg'){ // round medal with ribbon tails
    S.base=mk(function(x,y){var dx=x-15.5,dy=y-13.5;return dx*dx+dy*dy<=13.7*13.7;});
    S.under=mk(function(x,y){if(y<20)return 0;var t=y-20;
      var l=(x>=7-t*0.25&&x<=13.5-t*0.25),r=(x>=17.5+t*0.25&&x<=24+t*0.25);if(!l&&!r)return 0;
      var mid=l?(10.25-t*0.25):(20.75+t*0.25);if(y>=29&&Math.abs(x-mid)<=(y-28.5))return 0;return 1;});
    S.cy=13.5;S.io=[8,6];S.gemY=-1;
  } else if(fam==='rel'){ // heart
    S.base=mk(function(x,y){var a=(x-9.5)*(x-9.5)+(y-10)*(y-10),b=(x-21.5)*(x-21.5)+(y-10)*(y-10),r2=8.4*8.4;
      if(a<=r2||b<=r2)return 1;if(y<10)return 0;var t=(y-10)/21.2;if(t>=1)return 0;return Math.abs(x-15.5)<=14.4*Math.pow(1-Math.pow(t,1.5),0.75);});
    S.cy=14;S.io=[8,7];S.gemY=4;
  } else if(fam==='exp'){ // star burst
    S.base=mk(function(x,y){var dx=x-15.5,dy=y-15.5;return dx*dx+dy*dy<=12.2*12.2;});
    S.extra=mk(function(x,y){var dx=x-15.5,dy=y-15.5,r=Math.sqrt(dx*dx+dy*dy),a=Math.atan2(dy,dx);
      var k=Math.round(a/(Math.PI/4)),d=Math.abs(a-k*Math.PI/4);var R=12.2+3.9*Math.max(0,1-d/0.25);return r<=R;});
    S.io=[8,8];S.gemY=-1;
  } else if(fam==='skl'){ // gem / diamond
    S.base=mk(function(x,y){var dx=Math.abs(x-15.5),dy=Math.abs(y-15.5);return dx+dy<=17.2&&dx<=15.6&&dy<=15.6;});
    S.io=[8,8];S.gemY=0;
  } else { // col: hanging banner
    S.base=mk(function(x,y){if(x<4||x>27||y<3)return 0;if(y>=25&&Math.abs(x-15.5)<=(y-25)*1.25+0.6)return 0;return 1;});
    S.extra=mk(function(x,y){return (y>=1&&y<=3&&x>=1&&x<=30)||((x<=2||x>=29)&&y>=0&&y<=4);});
    S.cy=14;S.io=[8,6];S.gemY=-1;S.rod=1;
  }
  // chebyshev distance to the outside of base
  var d=new Array(N*N).fill(0),q=[];
  for(var i=0;i<N*N;i++){if(!S.base[i])continue;var x=i%N,y=(i/N)|0,edge=0;
    for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){var X=x+ox,Y=y+oy;if(X<0||Y<0||X>=N||Y>=N||!S.base[Y*N+X])edge=1;}
    if(edge){d[i]=1;q.push(i);} }
  for(var qi=0;qi<q.length;qi++){var i=q[qi],x=i%N,y=(i/N)|0;
    for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){var X=x+ox,Y=y+oy;if(X<0||Y<0||X>=N||Y>=N)continue;var j=Y*N+X;if(S.base[j]&&!d[j]){d[j]=d[i]+1;q.push(j);}}}
  S.d=d;SHAPES[fam]=S;return S;
}

function famOf(b){return b.fam||'prog';}

window.bdgIcon=function(id){return {W:16,H:16,px:iconGrid(id).slice()};};

window.bdgPx=function(b,locked){
  var fam=famOf(b),S=shapes(fam),t=Math.max(1,Math.min(3,b.t||1));
  var fill=FILL[b.id]||'#5b6ee1',T=TIER[t];
  var C;
  if(!locked){C={ol:OL,inner:OL,rm:T.m,rs:T.s,rl:T.l,f:fill,fs:mix(fill,'#1c1030',0.32),fl:mix(fill,'#ffffff',0.38),
      rib:mix(fill,'#1c1030',0.15),ribS:mix(fill,'#1c1030',0.42),rod:'#a0662e',rodS:'#6e4220',rodL:'#c98a4a'};}
  else C={ol:'#8f8470',inner:'#8f8470',rm:'#b8ac8f',rs:'#a39678',rl:'#d6ccb2',f:'#c9bc9c',fs:'#b5a88a',fl:'#dad0b6',
      rib:'#b8ab8d',ribS:'#a39678',rod:'#b0a487',rodS:'#998d72',rodL:'#c9bc9c'};
  var px=new Array(N*N).fill(null),cx=15.5,cy=S.cy;
  function inU(x,y){if(x<0||y<0||x>=N||y>=N)return false;var i=y*N+x;return S.base[i]||(S.extra&&S.extra[i]);}
  // 1. ribbons behind
  if(S.under){for(var i=0;i<N*N;i++){if(!S.under[i]||S.base[i])continue;var x=i%N,y=(i/N)|0,e=0;
      for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){var X=x+ox,Y=y+oy;if(X<0||Y<0||X>=N||Y>=N||(!S.under[Y*N+X]&&!S.base[Y*N+X]))e=1;}
      var mid=x<16?(10.25-(y-20)*0.25):(20.75+(y-20)*0.25);
      px[i]=e?C.ol:(x>mid?C.ribS:C.rib);}}
  // 2. extra rim parts (spikes / rod)
  if(S.extra){for(var i=0;i<N*N;i++){if(!S.extra[i]||S.base[i]&&!S.rod)continue;var x=i%N,y=(i/N)|0,e=0;
      for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){if(!inU(x+ox,y+oy))e=1;}
      if(S.rod){ if(e||(y===4&&x>2&&x<29)) {px[i]=C.ol;continue;}
        px[i]=(x<=2||x>=29)?(y<=1?C.rl:(y>=3?C.rs:C.rm)):(y===1?C.rodL:(y===3?C.rodS:C.rod));continue;}
      if(e){px[i]=C.ol;continue;}
      var dot=(x-cx)+(y-cy);px[i]=dot>1?C.rs:(dot<-14?C.rl:C.rm);}}
  // 3. main body: outline / rim / inner line / fill
  var R=fam==='reg'?13.7:14;
  for(var i=0;i<N*N;i++){if(!S.base[i])continue;if(S.rod&&S.extra[i])continue;var x=i%N,y=(i/N)|0,d=S.d[i];
    
    if(d===1){ // true silhouette edge vs junction with extra part
      var e=0;for(var oy=-1;oy<=1;oy++)for(var ox=-1;ox<=1;ox++){if(!inU(x+ox,y+oy))e=1;}
      px[i]=C.ol;continue;}
    if(d===2||d===3){var dot=(x-cx)+(y-cy);
      px[i]=dot>1.5?C.rs:((d===2&&dot<-R*0.55)?C.rl:C.rm);continue;}
    if(d===4){px[i]=C.inner;continue;}
    px[i]=C.f;}
  // fill shading
  var f2=px.slice();
  for(var i=0;i<N*N;i++){if(px[i]!==C.f)continue;var x=i%N,y=(i/N)|0;
    function nf(X,Y){return px[Y*N+X]!==C.f;}
    if(nf(x+1,y)||nf(x,y+1)||nf(x+1,y+1)) f2[i]=C.fs;
    else if((nf(x-1,y)||nf(x,y-1))&&(x-cx)+(y-cy)<-8) f2[i]=C.fl;}
  px=f2;
  // 4. gold tier extra: small gem at top centre
  if(t===3){var gy=S.gemY,gem=locked?{o:C.ol,h:C.rl,r:C.rm,R:C.rs}:{o:OL,h:'#ffd6dc',r:'#e8384f',R:'#a01c3a'};
    if(fam==='reg'||fam==='exp'||fam==='col'){gy={reg:-1,exp:-1,col:-1}[fam];}
    var G=[".oooo.","ohrrRo","orrRRo",".oRRo.","..oo.."];
    if(fam==='col'){G=["oooo","ohRo","oRRo","oooo"];}
    var gx=fam==='col'?14:13,gyy=fam==='prog'?0:fam==='rel'?3:fam==='skl'?0:fam==='col'?0:0;
    if(fam==='reg'||fam==='exp'){gyy=0;}
    for(var y=0;y<G.length;y++)for(var x=0;x<G[y].length;x++){var c=G[y][x];if(c==='.')continue;var X=gx+x,Y=gyy+y;if(Y>=0&&Y<N)px[Y*N+X]=gem[c];}
    if(false){var G2=["oooo","ohRo","oRRo","oooo"];[[0,1],[28,1]].forEach(function(p){for(var y=0;y<4;y++)for(var x=0;x<4;x++){var c=G2[y][x];px[(p[1]+y-1<0?0:p[1]+y-1)*N+p[0]+x]=gem[c];}});}
  }
  // 5. icon
  var ic=iconGrid(b.id),ox=S.io[0],oy=S.io[1];
  for(var y=0;y<16;y++)for(var x=0;x<16;x++){var c=ic[y*16+x];if(!c)continue;
    if(locked)c=lockC(c);
    px[(oy+y)*N+ox+x]=c;}
  return {W:N,H:N,px:px};
};
function lockC(c){if(c===OL)return '#6f6553';var L=lum(c);return L>0.66?'#f1e9d4':L>0.48?'#c9bd9e':L>0.32?'#a89c7f':'#887d66';}
window.bdgIconLocked=function(id){var p=iconGrid(id).map(function(c){if(!c)return c;return lockC(c);});return {W:16,H:16,px:p};};
})();
const __bic={};function pxURL(r){const c=document.createElement("canvas");c.width=r.W;c.height=r.H;const g=c.getContext("2d");for(let i=0;i<r.W*r.H;i++){const v=r.px[i];if(v){g.fillStyle=v;g.fillRect(i%r.W,Math.floor(i/r.W),1,1)}}return c.toDataURL()}
function bdgIconImg(b,px,locked){const k=b.id+(locked?"L":"");if(!__bic[k]){const r=locked&&window.bdgIconLocked?bdgIconLocked(b.id):window.bdgIcon?bdgIcon(b.id):null;__bic[k]=r?pxURL(r):""}return __bic[k]?`<img class="bdi" src="${__bic[k]}" width="${px}" height="${px}" alt="" aria-hidden="true" style="image-rendering:pixelated">`:""}
function badgePix(b,locked){const shape=bShape(b),key=shape+b.t+b.ic+b.id+(locked?"L":"");if(bpxCache[key])return bpxCache[key];
  if(window.bdgPx)return bpxCache[key]=pxURL(bdgPx({id:b.id,t:b.t,fam:famOf(b.id),ic:b.ic},!!locked));
  const N=BPX_N,inS=bpxMask(shape),M=[...Array(N*N)].map((_,i)=>inS(i%N,Math.floor(i/N))),has=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&M[y*N+x];
  const base=locked?"#c9bc9c":badgeColor(b),ring=locked?"#b3a688":TIERC[b.t],ol=locked?"#8f8470":"#1a1210",li=avMix(base,"#fff",.42),dk=avMix(base,"#000",.28);
  const lum=(h=>{const[r,g2,bb]=avHex(h);return .299*r+.587*g2+.114*bb})(base),ink=locked?"#a89c80":lum<120?avMix(base,"#fff",.82):avMix(base,"#1a1210",.78);
  const c=document.createElement("canvas");c.width=c.height=N;const g=c.getContext("2d");
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!has(x,y))continue;let col=base;
    if(!has(x-1,y)||!has(x+1,y)||!has(x,y-1)||!has(x,y+1))col=ol;
    else if(!has(x-2,y)||!has(x+2,y)||!has(x,y-2)||!has(x,y+2)||!has(x-1,y-1)||!has(x+1,y+1)||!has(x-1,y+1)||!has(x+1,y-1))col=(!has(x-2,y)||!has(x,y-2))?avMix(ring,"#fff",.3):(!has(x+2,y)||!has(x,y+2))?avMix(ring,"#000",.25):ring;
    else if(!has(x-3,y)||!has(x,y-3)||!has(x-2,y-2))col=li;
    else if(!has(x+3,y)||!has(x,y+3)||!has(x+2,y+2))col=dk;
    g.fillStyle=col;g.fillRect(x,y,1,1)}
  // reflet pixel en haut à gauche
  g.fillStyle="rgba(255,255,255,.55)";for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(has(x,y)&&has(x-3,y)&&has(x,y-3)&&!has(x-4,y-1)&&x<N/2&&y<N/2){g.fillRect(x,y,1,1)}}
  // icône
  const pm=PXI[b.ic],n=pm?10:Math.round(N*.5),oy={shield:4,banner:3,heart:4,diamond:5,hex:5}[shape]??5,ox=Math.round((N-n)/2),I=pm?pm.join("").split("").map(ch=>ch==="#"):bpxIcon(b.ic,n);
  if(shape!=="heart"){g.fillStyle=ink;for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(I[y*n+x]&&has(ox+x,oy+y))g.fillRect(ox+x,oy+y,1,1)}
  return bpxCache[key]=c.toDataURL()}
function badgeImg(b,locked,px){const u=badgePix(b,locked);return`<span class="bpx" style="width:${px}px;height:${px}px;-webkit-mask-image:url(${u});mask-image:url(${u})"><img src="${u}" width="${px}" height="${px}" alt=""></span>`}

const BSHAPE={prog:"shield",reg:"hex",rel:"heart",skl:"diamond",col:"banner",exp:"shield"};
const bShape=b=>BSHAPE[famOf(b.id)]||"shield";
function badgeTile(b){const on=!!S.badges[b.id],isNew=(S.g.nb||[]).includes(b.id);
  const d=document.createElement("button");d.type="button";d.className="bdg"+(on?"":" lock")+(isNew?" new":"");
  d.innerHTML=badgeImg(b,!on,64)+(isNew?`<span class="bdgnew">Nouveau</span>`:"");d.setAttribute("aria-label",(on?"":"Verrouillé : ")+(isNew?"Nouveau : ":"")+b.name);d.onclick=()=>openBadge(b);return d}
function openBadge(b){if(S.g&&Array.isArray(S.g.nb)&&S.g.nb.includes(b.id)){S.g.nb=S.g.nb.filter(x=>x!==b.id);save();badgeDots();setTimeout(()=>{renderCollection()},0)}const on=S.badges[b.id],pr=on?null:badgePr(b);closeBadge(true);
  const o=document.createElement("div");o.className="bpop";o.id="bPop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",b.name);
  const dt=on&&typeof on==="number"?new Date(on).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):"";
  o.innerHTML=`<div class="bpc${on?"":" lock"}" style="--tc:${TIERC[b.t]}"><button type="button" class="bpx-x" aria-label="Fermer">×</button>
    <div class="bpbig">${badgeImg(b,!on,112)}</div><h3></h3>
    <p class="bph">${on?"Obtenu en":"Pour l'obtenir"}</p><p class="bpd"></p>
    ${on?(dt?`<p class="bpdt">le ${dt}</p>`:""):pr?`<span class="bpr"><i style="width:${pr[0]/pr[1]*100}%"></i></span><p class="bpdt">${pr[0]} / ${pr[1]}</p>`:""}</div>`;
  o.querySelector("h3").textContent=on?b.name:b.name;o.querySelector(".bpd").textContent=b.desc;
  o.onclick=e=>{if(e.target===o||e.target.closest(".bpx-x"))closeBadge()};document.body.appendChild(o);
  o.querySelector(".bpx-x").focus({preventScroll:true});
  document.addEventListener("keydown",bEsc)}
function bEsc(e){if(e.key==="Escape")closeBadge()}
function closeBadge(now){const o=$("bPop");document.removeEventListener("keydown",bEsc);if(!o)return;o.id="";if(now===true||matchMedia("(prefers-reduced-motion: reduce)").matches){o.remove();return}o.classList.add("out");setTimeout(()=>o.remove(),190)}
let showPick=-1;
function renderShow(){
  const box=$("pfBdg");if(!box||!S.g)return;const G=S.g;
  if(!Array.isArray(G.show))G.show=[null,null,null];
  const B=badgeDefs(),byId=Object.fromEntries(B.map(b=>[b.id,b]));
  G.show=G.show.slice(0,3).map(id=>id&&byId[id]&&S.badges[id]?id:null);while(G.show.length<3)G.show.push(null);
  const ic=(b,px)=>bdgIconImg(b,px+4);
  box.innerHTML=G.show.map((id,i)=>{const b=id&&byId[id];return b?`<button type="button" class="pbs on pbt${b.t===3?" gold":""}${showPick===i?" sel":""}" data-i="${i}" style="--tc:${TIERC[b.t]}" aria-label="Badge affiché : ${esc(b.name)}, changer">${badgeImg(b,false,60)}<b>${esc(b.name)}</b></button>`:`<button type="button" class="pbs${showPick===i?" sel":""}" data-i="${i}" aria-label="Emplacement vide, choisir un badge"><span class="pbi">+</span><small>Badge</small></button>`}).join("");
  box.querySelectorAll(".pbs").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;showPick=showPick===i?-1:i;renderShow()});
  const pk=$("pfPick");
  if(showPick<0){pk.hidden=true;pk.innerHTML="";return}
  const own=B.filter(b=>S.badges[b.id]).sort((a,b)=>b.t-a.t);
  pk.hidden=false;
  pk.innerHTML=`<div class="pph"><b>Emplacement ${showPick+1}</b><button type="button" class="ppx" aria-label="Fermer">${ICO("close",16)}</button></div>`+(own.length?`<div class="ppl">${G.show[showPick]?`<button type="button" class="ppc rm" data-id="">Retirer</button>`:""}${own.map(b=>{const used=G.show.indexOf(b.id);return`<button type="button" class="ppc" data-id="${b.id}" style="--tc:${TIERC[b.t]}" aria-pressed="${used===showPick}">${ic(b,16)}<span>${esc(b.name)}</span>${used>=0&&used!==showPick?`<em>${used+1}</em>`:""}</button>`}).join("")}</div>`:`<p class="hint" style="margin:0">Débloque ton premier badge pour pouvoir l'afficher ici.</p>`);
  pk.querySelector(".ppx").onclick=()=>{showPick=-1;renderShow()};
  pk.querySelectorAll(".ppc").forEach(c=>c.onclick=()=>{const id=c.dataset.id||null;if(id){const j=G.show.indexOf(id);if(j>=0)G.show[j]=G.show[showPick]}G.show[showPick]=id;showPick=-1;save();renderShow()});
}
function renderKpi(){
  const box=$("pfKpi");if(!box||!S.g)return;const st=streak(),lit=S.log.some(e=>e.xp>0&&dayKey(e.t)===dayKey(Date.now()));
  const nf=n=>{n=Number(n||0);return n>=100000?(n>=1e6?(n/1e6).toLocaleString("fr-FR",{maximumFractionDigits:1})+" M":Math.round(n/1000)+" k"):n.toLocaleString("fr-FR")};
  const h=`<div class="kp kst${lit&&st?" lit":""}" title="Série : ${st} jour${st>1?"s":""} de suite" aria-label="Série : ${st} jour${st>1?"s":""} de suite"><span class="ki">${pxImg("flame",2,"ic")}</span><b>${st}</b></div>`+
    
    `<div class="kp kch" title="Coffres ouverts" aria-label="Coffres ouverts : ${nf(S.g.opened)}"><span class="ki">${pxImg("chest",2,"ic chs")}</span><b>${nf(S.g.opened)}</b></div>`;
  if(box.__h!==h){box.__h=h;box.innerHTML=h}
}
function renderCollection(){
  checkBadges();
  const B=badgeDefs(),g=$("bdgGrid");g.innerHTML="";const n=B.filter(b=>S.badges[b.id]).length;
  $("bdgCnt").textContent=n+"/"+B.length;
  // prochains badges
  const next=B.filter(b=>!S.badges[b.id]).map(b=>({b,pr:badgePr(b)})).filter(x=>x.pr&&x.pr[0]>0).sort((a,b)=>b.pr[0]/b.pr[1]-a.pr[0]/a.pr[1]).slice(0,3);
  $("bdgNext").innerHTML=next.length?`<div class="gcard col1 bnext"><h3>Prochains badges</h3>${next.map(({b,pr})=>`<div class="bnr" style="--tc:${TIERC[b.t]}"><span class="bni">${bdgIconImg(b,32)}</span><span class="bnt"><b>${esc(b.name)}</b><small>${esc(b.desc)}</small><span class="bpr"><i style="width:${pr[0]/pr[1]*100}%"></i></span></span><em>${pr[0]}/${pr[1]}</em></div>`).join("")}</div>`:"";
  // familles
  BFAM.forEach(([fk,fn])=>{const list=B.filter(b=>famOf(b.id)===fk);if(!list.length)return;const on=list.filter(b=>S.badges[b.id]).length,hasNew=list.some(b=>(S.g.nb||[]).includes(b.id));
    const det=document.createElement("details");det.className="bfam";det.open=hasNew||!!bfOpen[fk];
    det.innerHTML=`<summary><span class="bfn">${fn}${hasNew?` <span class="bfnew">${list.filter(b=>(S.g.nb||[]).includes(b.id)).length} nouveau${list.filter(b=>(S.g.nb||[]).includes(b.id)).length>1?"x":""}</span>`:""}</span><span class="bpr bfbar"><i style="width:${on/list.length*100}%"></i></span><b>${on}/${list.length}</b></summary><div class="brow"></div>`;
    det.addEventListener("toggle",()=>{bfOpen[fk]=det.open});
    const tl=det.querySelector(".brow");const own=list.filter(b=>S.badges[b.id]),lk=list.length-own.length;own.forEach(b=>tl.appendChild(badgeTile(b)));if(lk){const m=document.createElement("button");m.type="button";m.className="bdg bmore";m.setAttribute("aria-label",lk+" badges à débloquer");m.innerHTML=`<span class="wr-plus">+${lk}</span>`;m.onclick=()=>toast(`${lk} badge${lk>1?"s":""} à débloquer dans « ${fn} »`);tl.appendChild(m)}g.appendChild(det)});
  window.__newBadges=null;
}
let view="q";
const subs={c:"vie",t:"boss",q:"q"};try{Object.assign(subs,JSON.parse(localStorage.getItem("cq-subs")||"{}"))}catch(e){}if(subs.t==="son")subs.t="skl";
if(subs.c==="prj")subs.c="vie";if(subs.c==="badges")subs.c="wr";if(!["vie","wr","sons","bilan"].includes(subs.c))subs.c="vie";if(subs.t!=="boss")subs.t="boss";subs.q="q";
let lastNb=0;
function badgeDots(){const n=(S.g&&S.g.nb||[]).length,grew=n>lastNb;lastNb=n;[["tabC",n],["subBadges",n]].forEach(([id,c])=>{const el=id==="subBadges"?document.querySelector('.subtabs button[data-sub="badges"]'):$(id);if(!el)return;let d=el.querySelector(".ndot");if(c&&!d){d=document.createElement("span");d.className="ndot";el.appendChild(d)}if(d){d.hidden=!c;d.textContent=c;if(grew&&c){d.classList.remove("pop");void d.offsetWidth;d.classList.add("pop")}}})}
function applySub(){if(view==="c"&&subs.c==="badges"&&S.g&&S.g.nb&&S.g.nb.length){setTimeout(()=>{const t=document.querySelector("#bdgGrid .bdg.new");if(t)t.scrollIntoView({block:"center",behavior:"smooth"})},350)}document.querySelectorAll('[data-v][data-sub]').forEach(el=>el.hidden=view!==el.dataset.v||el.dataset.sub!==subs[el.dataset.v]);document.querySelectorAll(".subtabs").forEach(nv=>nv.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.sub===subs[nv.dataset.v])));requestAnimationFrame(placeInds)}
function goSub(v,sb){if(v==="q"&&sb!=="q"){subs.t=sb;try{localStorage.setItem("cq-subs",JSON.stringify(subs))}catch(e){}showView("t");return}if(v==="t"&&sb==="q"){showView("q");return}const old=subs[v];subs[v]=sb;try{localStorage.setItem("cq-subs",JSON.stringify(subs))}catch(e){}if(view!==v){showView(v);SCR.scrollTo(0,0);return}
  if(old===sb){applySub();return}
  const nv=document.querySelector('.subtabs[data-v="'+v+'"]'),bs=nv?[...nv.querySelectorAll("button")].map(b=>b.dataset.sub):[],dir=bs.indexOf(sb)>=bs.indexOf(old)?1:-1;
  nv&&nv.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.sub===sb));moveInd(nv);
  const red=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  const outs=[...document.querySelectorAll('[data-v="'+v+'"][data-sub]')].filter(el=>!el.hidden&&el.offsetHeight);
  const tok=window.__subTok=(window.__subTok||0)+1;let keepY=SCR.scrollTop;if(nv){const pr=nv.previousElementSibling;if(pr&&!pr.hidden){const cs=getComputedStyle(nv),nat=pr.getBoundingClientRect().bottom+SCR.scrollTop+(parseFloat(cs.marginTop)||0)-(parseFloat(cs.top)||0);keepY=Math.max(0,Math.min(SCR.scrollTop,nat))}}
  const fin=()=>{if(tok!==window.__subTok)return;document.querySelectorAll(".sout").forEach(el=>{el.classList.remove("sout");el.style.removeProperty("--dx")});applySub();if(SCR.scrollTop>keepY)SCR.scrollTo(0,keepY);if(!red)requestAnimationFrame(()=>slideIn(v,dir,sb))};
  if(red||!outs.length){fin();return}
  outs.forEach(el=>{el.classList.remove("vin","sin");el.style.setProperty("--dx",(-dir*70)+"px");void el.offsetWidth;el.classList.add("sout")});
  setTimeout(fin,150)}
function slideIn(v,dir,sub){[...document.querySelectorAll('[data-v="'+v+'"][data-sub="'+sub+'"]')].filter(el=>!el.hidden).forEach(el=>{el.style.setProperty("--dx",(dir*70)+"px");el.classList.remove("sin","vin");void el.offsetWidth;el.classList.add("sin");el.addEventListener("animationend",function f(e){if(e.target!==el)return;el.classList.remove("sin");el.removeEventListener("animationend",f)})})}
function moveInd(nv){if(!nv)return;let ind=nv.querySelector(".stind");if(!ind){ind=document.createElement("span");ind.className="stind";ind.setAttribute("aria-hidden","true");nv.prepend(ind)}const b=nv.querySelector('button[aria-selected="true"]');if(!b||!b.offsetWidth)return;ind.style.width=b.offsetWidth+"px";ind.style.height=b.offsetHeight+"px";ind.style.transform=`translate(${b.offsetLeft}px,${b.offsetTop}px)`;if(!ind.dataset.on)requestAnimationFrame(()=>{ind.dataset.on="1"})}
function placeInds(){document.querySelectorAll(".subtabs").forEach(nv=>{if(!nv.hidden&&nv.offsetWidth)moveInd(nv)})}
window.addEventListener("resize",placeInds);
/* glisser du doigt sur le contenu pour changer de sous-onglet */
{let sw=null;
 const hScroll=el=>{for(let e=el;e&&e!==document.body;e=e.parentElement){if(e.matches&&e.matches("input,textarea,select,.actcards,.ppl,#sqTrack,.hmscene"))return true;const cs=getComputedStyle(e);if(/(auto|scroll)/.test(cs.overflowX)&&e.scrollWidth>e.clientWidth+2)return true}return false};
 document.addEventListener("touchstart",e=>{sw=null;if(e.touches.length!==1||!subs[view])return;const t=e.target.closest&&e.target.closest(view==="q"?'[data-v="q"]':'[data-v="'+view+'"][data-sub],.subtabs[data-v="'+view+'"]');if(!t||hScroll(e.target))return;sw={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()}},{passive:true});
 document.addEventListener("touchend",e=>{if(!sw)return;const c=e.changedTouches[0],dx=c.clientX-sw.x,dy=c.clientY-sw.y,dt=Date.now()-sw.t;sw=null;
   if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.6||dt>700)return;
   const nv=document.querySelector('.subtabs[data-v="'+view+'"]');if(!nv)return;const bs=[...nv.querySelectorAll("button")].map(b=>b.dataset.sub),i=bs.indexOf(subs[view]),j=i+(dx<0?1:-1);
   if(j>=0&&j<bs.length)goSub(view,bs[j])},{passive:true});
 document.addEventListener("touchcancel",()=>{sw=null},{passive:true})}
document.querySelectorAll(".subtabs").forEach(nv=>nv.querySelectorAll("button").forEach(b=>b.onclick=()=>goSub(nv.dataset.v,b.dataset.sub)));
const VORD={q:0,t:1,c:2,s:2.5,r:3,p:3.5,b:4};
function animIn(v,dir,sub){
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const els=[...document.querySelectorAll('[data-v="'+v+'"]'+(sub?'[data-sub="'+sub+'"]':''))].filter(el=>!el.hidden&&el.offsetHeight);
  els.forEach((el,i)=>{el.style.setProperty("--dx",(dir*44)+"px");el.style.animationDelay="0ms";el.classList.remove("vin");void el.offsetWidth;el.classList.add("vin");
    el.addEventListener("animationend",function f(e){if(e.target!==el)return;el.classList.remove("vin");el.style.animationDelay="";el.removeEventListener("animationend",f)})});
}
function showView(v,fromHash){
  if(viewDirty[v])runView(v);
  const prevV=view;
  view=v;document.querySelectorAll("[data-v]").forEach(el=>el.hidden=el.dataset.v!==v);applySub();
  if(prevV!==v||fromHash)requestAnimationFrame(()=>animIn(v,fromHash||prevV===v?0:(VORD[v]??0)>=(VORD[prevV]??0)?1:-1));
  $("tabQ").setAttribute("aria-selected",v==="q"||v==="t");$("tabB").setAttribute("aria-selected",v==="b");$("tabR").setAttribute("aria-selected",v==="r"||v==="p");$("tabT").setAttribute("aria-selected",v==="t");$("tabC").setAttribute("aria-selected",v==="c"||v==="s");
  $("strip").hidden=v!=="q";
  if(v==="p")renderProfile(true);
  if(!fromHash){try{history.replaceState(null,"",v==="b"?"#boutique":v==="s"?"#reglages":v==="t"?"#defis":v==="c"?"#profil":(v==="r"||v==="p")?"#relations":"#quetes")}catch(e){}SCR.scrollTo(0,0)}
}
{const qs=[...document.querySelectorAll(".qxp,.subtabs")];let t=0;const chk=()=>{t=0;qs.forEach(q=>{if(q.hidden||!q.offsetHeight){q.classList.remove("stuck");return}const r=q.getBoundingClientRect(),top=parseFloat(getComputedStyle(q).top)||0;q.classList.toggle("stuck",r.top<=top+.5&&SCR.scrollTop>20)})};SCR.addEventListener("scroll",()=>{if(!t)t=requestAnimationFrame(chk)},{passive:true});}
["spTrack","grid"].forEach(id=>{const el=$(id);el.addEventListener("scroll",()=>{el.classList.toggle("sl",el.scrollLeft>4);el.classList.toggle("end",el.scrollLeft+el.clientWidth>=el.scrollWidth-4&&el.scrollLeft>4)},{passive:true})});
$("wallet").onclick=()=>{goSub("c","wr");setTimeout(()=>{const n=document.querySelector(".subtabs[data-v=c]");if(n)n.scrollIntoView({behavior:"smooth",block:"start"})},200)};$("qxpBtn").onclick=()=>showView("c");$("meSet").onclick=()=>showView("s");
{const tp=$("pfTPick"),tb=$("charTitle"),setT=o=>{tp.hidden=!o;tb.setAttribute("aria-expanded",o)};tb.onclick=()=>setT(tp.hidden);$("pfTClose").onclick=()=>setT(false);window.__closeTPick=()=>setT(false)}$("setBack").onclick=()=>showView("c");$("tabQ").onclick=()=>showView("q");$("tabB").onclick=()=>showView("b");$("tabR").onclick=()=>showView("r");$("tabT").onclick=()=>showView("t");$("tabC").onclick=()=>showView("c");

