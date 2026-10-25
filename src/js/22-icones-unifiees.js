// ---- Icônes unifiées : tout le contenu passe en pixel art façon badges (16×16, contour sombre)
void 0;
function rkIn(k){const R=rkC(RKI[k]);if(!R)return"";let r="";R.forEach((row,y)=>[...row].forEach((ch,x)=>{const c=RKP[ch];if(c)r+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${c}"/>`}));return`<svg x="0" y="0" width="24" height="24" viewBox="0 0 16 16" stroke="none" shape-rendering="crispEdges">${r}</svg>`}
var RKC=new WeakMap();
function rkC(R){if(!Array.isArray(R)||!RKC)return R;if(RKC.has(R))return RKC.get(R);let y0=99,y1=-1,x0=99,x1=-1;R.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=="."&&RKP[ch]){if(y<y0)y0=y;if(y>y1)y1=y;if(x<x0)x0=x;if(x>x1)x1=x}}));if(y1<0){RKC.set(R,R);return R}
  const ty=Math.floor((16-(y1-y0+1))/2),tx=Math.floor((16-(x1-x0+1))/2),O=Array.from({length:16},()=>Array(16).fill("."));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const ch=(R[y]||"")[x]||".";if(RKP[ch])O[ty+y-y0][tx+x-x0]=ch}const out=O.map(r=>r.join(""));RKC.set(R,out);return out}
var PX_MAP={burger:"burger",soda:"soda",veg:"legume",meat:"viande",rice:"riz",book:"lire",flame:"flamme",star:"etoile",coin:"piece",chest:"coffre",smoke:"cigarette",wine:"vin",gift:"cadeau",tree:"sapin",snow:"flocon",heart:"coeur",cup:"tasse",plate:"assiette",cookie:"cookie",cheese:"fromage",yogurt:"yaourt",glass:"verre",hourglass:"sablier",check:"check"};
function pxU(k){if(!PX_MAP)return;const o=PXSP[k],m=PX_MAP[k];if(!o||!m||!RKI[m]||o[2])return;PXSP[k]=[rkC(RKI[m]),RKP,o[0][0].length];delete PXSPC[k]}
var ICS_PX={cig:"cigarette",contrat:"chantier",vacances:"valise",malade:"sante",examens:"notec",demenagement:"maisonp",autre:"autre"};
(function(){
  const cat={sport:"halteres",maison:"maisonp",soi:"coeur",nourriture:"pomme",social:"bulle",famille:"famille",travail:"laptop",perso:"etoile",eau:"eau"};
  for(const k in cat)if(RKI[cat[k]])CAT_IC[k]=rkIn(cat[k]);
  const dq={fgq:"duo",secret:"gemme",org:"calendrier",gift:"cadeau",sur:"eclair",bq:"epee",music:"micro",friends:"tel",family:"famille",dz:"flamme","":"etoile"};
  for(const k in dq)if(DQ_K[k]&&RKI[dq[k]])DQ_K[k][2]=rkIn(dq[k]);
  if(EV_IC.bd!==undefined)EV_IC.bd=rkIn("cake");if(EV_IC.ev!==undefined)EV_IC.ev=rkIn("calendrier");
  
})();
const CAT_ORDER=["sport","maison","soi","nourriture","travail","perso"];
const CAT_RW={sport:["Colosse","dumbbell"],maison:["Toujours frais","towel"],soi:["Esprit zen","lotus"],nourriture:["Fin gourmet","fork"],social:["Âme sociale","shieldf"],famille:["Pilier de la famille","medal"],perso:["Artiste dans l'âme","brush"],eau:["Source vive","bottle"],travail:["Bourreau de travail","briefcase"]};
let actOpen={},actEdit="";try{actOpen=JSON.parse(localStorage.getItem("cq-actopen")||"{}")||{}}catch(e){}
const actXp=(a,n)=>BARS[a.cat]?a.xp:durOf(a.name)?Math.round(a.xp*Math.min(2,1+.25*n)):n<3?a.xp:0;
const actMul=(a,n)=>!BARS[a.cat]&&durOf(a.name)&&n?Math.min(2,1+.25*n):0;
function pjState(){const G=S.g;if(!G.pj||typeof G.pj!=="object")G.pj={};if(!Array.isArray(G.pjd))G.pjd=[];if(!G.pjf||typeof G.pjf!=="object")G.pjf={};return G}
const SUG_T=[[5,12,["sport","maison"],"Idéal le matin"],[12,18,["travail","perso","maison"],"Bon moment pour ça"],[18,24,["soi","perso","nourriture"],"Pour ta soirée"],[0,5,["soi"],"Avant de dormir"]];
function renderSug(){const box=$("actSug");if(!box||!S.g)return;const tk=dayKey(Date.now()),h=Math.floor(adjH()),ritNames=new Set(ritTasks().map(t=>t.link).filter(Boolean));
  const today={},last={};S.log.forEach(e=>{if(e.bonus||!e.a)return;if(dayKey(e.t)===tk)today[e.a]=(today[e.a]||0)+1;last[e.a]=Math.max(last[e.a]||0,e.t)});
  const wk={};S.log.filter(e=>Date.now()-e.t<7*864e5).forEach(e=>{const c=catOf(e);if(c)wk[c]=(wk[c]||0)+Math.max(0,e.xp)});
  const T=SUG_T.find(([a,b])=>h>=a&&h<b)||SUG_T[0];
  const pool=S.actions.filter(a=>normOk(a.name)&&!ritNames.has(a.name)&&!SON_ACTS.includes(a.name)&&!ACT_HIDE.has(a.name)&&CATS[ACT_MOVE[a.name]||a.cat]);
  const out=[];
  pool.forEach(a=>{const M=msInfo(a);if(M&&M.st&&!M.wait)out.push({a,sc:100,why:"Étape "+(M.i+1)+"/"+M.L.length+" à faire"})});
  const seed=Number(tk.replace(/-/g,""))+Math.floor(h/3),rnd=i=>{const x=Math.sin(seed*13+i*7)*1e4;return x-Math.floor(x)};
  pool.forEach((a,i)=>{if(out.some(o=>o.a===a))return;const M=msInfo(a);if(M&&M.st)return;if(!actXp(a,today[a.id]||0)||today[a.id])return;const c=ACT_MOVE[a.name]||a.cat;let sc=rnd(i)*20,why="",idc="";
    {const ch=(S.g.idt&&S.g.idt.ch)||[];ch.forEach(id=>{const I=idOf(id);if(!I)return;const nm=o0=>o0.toLowerCase();if(I.cats.includes(c)||I.k.some(w=>nm(a.name).includes(w))){sc+=35;if(!why){why="Pour devenir "+I.n.toLowerCase();idc=I.c}}})}
    if(T[2].includes(c)){sc+=30;why=why||T[3]}const w=wk[c]||0;if(w<20){sc+=25-w;why=why||"Peu fait cette semaine"}
    const d=last[a.id]?Math.floor((Date.now()-last[a.id])/864e5):99;if(d>=7&&d<99){sc+=10;why=why||"Pas fait depuis "+d+" jours"}out.push({a,sc,idc,why:why||"Une idée rapide"})});
  out.sort((x,y)=>y.sc-x.sc);const pick=[],cats=new Set();out.forEach(o=>{const c=ACT_MOVE[o.a.name]||o.a.cat;if(pick.length<3&&(o.sc>=100||!cats.has(c))){pick.push(o);cats.add(c)}});
  if(!pick.length){box.innerHTML="";return}
  box.innerHTML=`<p class="sugh">Suggestions</p><div class="sugl">${pick.map((o,k)=>{const c=CATS[ACT_MOVE[o.a.name]||o.a.cat],M=msInfo(o.a),x=M?M.step[1]:actXp(o.a,today[o.a.id]||0);return`<button type="button" class="sugb lzbtn" style="--zc:${c.c}" data-k="${k}" data-tm="act-${o.a.id}" data-tmn="${esc(o.a.name)}" title="${esc(o.why)}"><b></b><em>+${x}</em>${o.idc?`<i class="sugid" style="--ic:${o.idc}">${esc(o.why)}</i>`:""}</button>`}).join("")}</div>`;
  box.querySelectorAll(".sugb").forEach(b=>{const o=pick[+b.dataset.k],M=msInfo(o.a);b.querySelector("b").textContent=M&&M.st?M.step[0]:o.a.name;b.onclick=ev=>actDo(o.a,b,ev,today[o.a.id]||0)})}
function renderActCards(){renderSug();schedNow();
  const g=$("grid"),keep=g.scrollLeft;g.className="actcards";g.innerHTML="";
  const tk=dayKey(Date.now()),ritNames=new Set(ritTasks().map(t=>t.link).filter(Boolean));
  const today={},ever={};S.log.forEach(e=>{if(e.bonus||!e.a)return;if(dayKey(e.t)===tk)today[e.a]=(today[e.a]||0)+1;else ever[e.a]=(ever[e.a]||0)+1});
  CAT_ORDER.forEach(cat=>{
    const C=CATS[cat];if(!C)return;
    const acts=S.actions.filter(a=>normOk(a.name)&&(ACT_MOVE[a.name]||a.cat)===cat&&!ritNames.has(a.name)&&!SON_ACTS.includes(a.name)&&!ACT_HIDE.has(a.name)).sort((a,b)=>(ever[b.id]||0)-(ever[a.id]||0));
    if(!acts.length&&actEdit!==cat)return;
    const si=statInfo(S.stats[cat]||0),open=!!actOpen[cat],shown=open||acts.length<=6?acts:acts.slice(0,5),more=acts.length-shown.length;
    const card=document.createElement("div");card.className="lzc";card.style.setProperty("--zc",C.c);
    card.innerHTML=`<div class="lzh act"><span class="lzi"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAT_IC[cat]||""}</svg></span><b>${C.label}</b><span class="lzl">Nv ${si.l}</span><span class="lzb" title="${si.cur} / ${si.need} XP"><i style="width:${si.cur/si.need*100}%"></i></span><button type="button" class="aced" aria-label="Modifier les actions ${C.label}" aria-expanded="${actEdit===cat}">${ICO(actEdit===cat?"close":"edit",16)}</button></div><div class="lza"></div>`;
    const row=card.querySelector(".lza");

    if(!acts.length)row.innerHTML='<p class="hint vide" style="grid-column:1/-1">Aucune action ici. Touche le crayon pour en ajouter.</p>';
    shown.forEach(a=>{const n=today[a.id]||0,M=msInfo(a),x=M?(M.st||actXp(a,n)?M.step[1]:0):actXp(a,n);const b=document.createElement("button");b.type="button";b.className="lzbtn"+(x?"":" done")+(M?" ms":"")+(M&&M.wait?" wait":"");b.disabled=!x&&!!M;if(x){b.dataset.tm="act-"+a.id;b.dataset.tmn=a.name}
      const mul=M?0:actMul(a,n);b.innerHTML=`<span></span>${M&&(M.st||x)?`${M.wait?`<small class="msl">${Math.ceil(M.wait/6e4)} min</small>`:""}<span class="msd">${M.L.map((_,k)=>`<i class="${k<M.i?"on":k===M.i?"cur":""}"></i>`).join("")}</span>`:""}<em>${x?"+"+x+(mul?` <small class="xmul">×${String(mul).replace(".",",")}</small>`:""):ICO("check",13)+" fait"}</em>`;b.querySelector("span").textContent=M&&M.st?M.step[0]:a.name;b.setAttribute("aria-label",x?`${a.name}, +${x} XP`:`${a.name}, déjà fait aujourd'hui`);
      b.onclick=ev=>{if(!x&&!M){noXp({...a},b,ev);return}actDo(a,b,ev,today[a.id]||0)};row.appendChild(b)});
    if(more>0||open&&acts.length>6){const m=document.createElement("button");m.type="button";m.className="lzmore";m.textContent=open?"Moins":`+${more} autre${more>1?"s":""}`;m.setAttribute("aria-expanded",open);m.onclick=()=>{actOpen[cat]=!open;try{localStorage.setItem("cq-actopen",JSON.stringify(actOpen))}catch(e){}renderActCards()};row.appendChild(m)}
    if(actEdit===cat){const ed=document.createElement("div");ed.className="aced-box";
      ed.innerHTML=`<ul class="aclist">${acts.map(a=>`<li><span></span><button type="button" class="acrh${rhOn(a)?" on":""}" data-rh="${a.id}" aria-label="Rythme">${rhLab(a)||"rythme"}</button><em>+${a.xp}</em><button type="button" data-id="${a.id}" aria-label="Supprimer">${ICO("close",14)}</button></li>`).join("")}</ul><form class="acadd"><input maxlength="60" placeholder="Nouvelle action ${C.label}" aria-label="Nouvelle action" required><select aria-label="XP"><option>5</option><option selected>10</option><option>15</option><option>25</option><option>40</option></select><button class="btn primary" type="submit">Ajouter</button></form>`;
      ed.querySelectorAll("li span").forEach((sp,k)=>sp.textContent=acts[k].name);
      ed.querySelectorAll("li button[data-id]").forEach(bt=>bt.onclick=()=>{S.actions=S.actions.filter(x=>x.id!==bt.dataset.id);save();render()});ed.querySelectorAll("li button[data-rh]").forEach(bt=>bt.onclick=()=>{const a=S.actions.find(x=>x.id===bt.dataset.rh);if(a)rhPick(a,a.name,true,()=>{save();render()})});
      ed.querySelector("form").addEventListener("submit",e=>{e.preventDefault();const n=ed.querySelector("input").value.trim();if(!n)return;S.actions.push({id:"u"+Date.now().toString(36),name:n.slice(0,60),cat,xp:+ed.querySelector("select").value});save();render()});
      card.appendChild(ed)}
    card.querySelector(".aced").onclick=()=>{actEdit=actEdit===cat?"":cat;renderActCards()};
    card.dataset.cat=cat;g.appendChild(card);
  });
  g.scrollLeft=keep;
  let dots=$("actDots");if(!dots){dots=document.createElement("div");dots.id="actDots";dots.className="actdots";g.after(dots)}
  const cards=[...g.children];dots.innerHTML=cards.map((c,i)=>`<button type="button" style="--zc:${CATS[c.dataset.cat].c}" aria-label="${CATS[c.dataset.cat].label}"><span></span>${CATS[c.dataset.cat].label}</button>`).join("");
  const mark=()=>{const w=g.clientWidth,x=g.scrollLeft;let k=0,best=1e9;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft-g.offsetLeft-x);if(d<best){best=d;k=i}});dots.querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-current",i===k))};
  dots.querySelectorAll("button").forEach((b,i)=>b.onclick=()=>g.scrollTo({left:cards[i].offsetLeft-g.offsetLeft,behavior:"smooth"}));
  g.onscroll=()=>{cancelAnimationFrame(g.__r);g.__r=requestAnimationFrame(mark)};mark();
}
const Q_AURA={sport:"flames",perso:"notes",social:"hello",famille:"goldaura",maison:"neon",soi:"lotus",travail:"stars"};
function catRewards(){
  const G=S.g;if(!G.cr||typeof G.cr!=="object")G.cr={};let ch=false;
  Object.entries(CAT_RW).forEach(([k,[t,gid]])=>{const l=statInfo(S.stats[k]||0).l;const lab=(CATS[k]||{}).label||k;
    if(l>=3&&!G.cr[k+"5"]){G.cr[k+"5"]=1;if(!G.rt.includes(t))G.rt.push(t);gameMsgs.push(`${lab} niveau 3 : titre <span class="p">${esc(t)}</span>`);ch=true}
    const au=Q_AURA[k];if(au&&l>=5&&!G.cr[k+"5a"]){G.cr[k+"5a"]=1;if(!G.gear.includes(au)){G.gear.push(au);const g=GEAR.find(x=>x.id===au);gameMsgs.push(`${lab} niveau 5 : aura <span class="p">${esc(g?g.n:au)}</span>`)}ch=true}
    if(l>=10&&!G.cr[k+"10"]){G.cr[k+"10"]=1;if(gid&&gearOf(gid)&&!G.gear.includes(gid)){G.gear.push(gid);gameMsgs.push(`${lab} niveau 10 : objet exclusif <span class="p">${esc(gearOf(gid).n)}</span>`)}ch=true}});
  return ch}

// ----

const LZ=[
 {id:"jeu",n:"Jeu vidéo",c:"#7b6cf0",t:"Gamer confirmé",g:"pad",a:[["s","Session 1 h",10,"soi"],["p","Avec des potes",15,"social"],["f","Jeu fini",40,"soi"]]},
 {id:"cine",n:"Cinéphile",c:"#d1493f",t:"Cinéphile",g:"clap",a:[["f","Film",15,"soi"],["e","Épisode",5,"soi"],["s","Série finie",30,"soi"]]},
 {id:"lect",n:"Lecture",c:"#8a5a2b",t:"Rat de bibliothèque",g:"book",a:[["p","Lire",10,"soi"],["l","Livre fini",40,"soi"]]},
 {id:"cuis",n:"Cuisine",c:"#c97a1a",t:"Chef",g:"toque",a:[["r","Repas maison",10,"nourriture"],["n","Nouveau plat",30,"nourriture"]]},
 {id:"orga",n:"Organisation",c:"#2f7fb5",t:"Maître du temps",g:"watch",a:[["j","Planifier ma journée",5,"soi"],["s","Préparer ma semaine",20,"soi"],["m","Mails à zéro",15,"soi"]]},
 {id:"style",n:"Style",c:"#c2516b",t:"Icône de style",g:"goldspecs",a:[["t","Tenue soignée",5,"maison"],["a","Tri de l'armoire",20,"maison"]]},
 {id:"explo",n:"Exploration",c:"#3c9a4f",t:"Explorateur",g:"compass",a:[["l","Nouveau lieu",25,"soi"],["s","Sortie découverte",15,"soi"]]},
 {id:"photo",n:"Photo / vidéo",c:"#4f8f86",t:"Œil de lynx",g:"camera",a:[["s","Séance",10,"perso"],["m","Montage fini",30,"perso"]]},
 {id:"lang",n:"Langue",c:"#2a8fd6",t:"Polyglotte",g:"hello",a:[["l","Leçon 15 min",10,"soi"],["v","Film en VO",15,"soi"],["c","Conversation",25,"soi"]]}];
const LZ_MAX=5;
const LZ_LINK={"Lire":"lect","Cuisiner un vrai repas":"cuis","Préparer mon repas du lendemain":"cuis","Repas équilibré":"cuis"};
const lzOf=id=>LZ.find(x=>x.id===id);
function lzState(){const G=S.g;if(!G.lz||typeof G.lz!=="object")G.lz={};const z=G.lz;if(!Array.isArray(z.on))z.on=["lect","cine","cuis","orga","jeu"];if(!z.xp||typeof z.xp!=="object")z.xp={};if(!z.rw||typeof z.rw!=="object")z.rw={};return z}
function lzGain(id,x){const z=lzState(),before=skInfo(z.xp[id]||0).l;z.xp[id]=(z.xp[id]||0)+x;const L=lzOf(id),now=skInfo(z.xp[id]).l;if(now<=before||!L)return;
  setTimeout(()=>toast(`${esc(L.n)} niveau <span class="p">${now}</span> !`),600);
  if(now>=5&&!z.rw[id+"5"]){z.rw[id+"5"]=1;if(!S.g.rt.includes(L.t))S.g.rt.push(L.t);setTimeout(()=>toast(`Nouveau titre : <span class="p">${esc(L.t)}</span>`),1200)}
  if(now>=10&&!z.rw[id+"10"]){z.rw[id+"10"]=1;if(!S.g.gear.includes(L.g))S.g.gear.push(L.g);const it=gearOf(L.g);setTimeout(()=>toast(`Objet exclusif : <span class="p">${esc(it?it.n:"")}</span> et un coffre`),1800)}}



const SON_ACTS=["Faire du son (1 h)","Écrire un couplet","Écouter un album en entier"];
const ACT_HIDE=new Set(["Petit-déjeuner complet","Repas équilibré","Fruit ou légume en plus","Lire","Cuisiner un vrai repas","Ranger sa chambre","Se coucher avant minuit","Une journée sans soda","10 pompes","Se brosser les dents","1 verre d'eau","Repas végétarien","Préparer mon repas du lendemain"]);
const ACT_MOVE={};
// actions en plusieurs temps : [étape, XP, attente en minutes avant cette étape]
const MS={"Faire une lessive":[["Lancer la machine",4,0],["Étendre le linge",4,60],["Plier et ranger",7,0]],"Changer les draps":[["Enlever les draps",4,0],["Mettre des draps propres",6,0],["Lancer les draps sales en machine",5,0]],"Faire la vaisselle":[["Laver la vaisselle",6,0],["Ranger la vaisselle sèche",4,30]]};
function msState(a){const G=S.g;if(!G.ms)G.ms={};const st=G.ms[a.name];if(st&&Date.now()-st.t>3*864e5){delete G.ms[a.name];return null}return st||null}
function msInfo(a){const L=MS[a.name];if(!L)return null;const st=msState(a),i=st?st.i:0,step=L[i],wait=st&&step[2]?Math.max(0,st.t+step[2]*6e4-Date.now()):0;return{L,i,step,wait,st}}
function noXp(a,b,ev,extra){complete({...a,xp:0},b,ev,false,{...(extra||{}),nox:1});setTimeout(()=>toast("Noté dans ton journal, sans XP : limite du jour atteinte pour cette action"),400)}
function actDo(a,b,ev,todayN){const M=msInfo(a);
  if(M){const G=S.g,last=M.i===M.L.length-1;if(M.wait>0){sfx("error");toast(`Encore ${Math.ceil(M.wait/6e4)} min avant : ${esc(M.step[0].toLowerCase())}`);return}
    if(last)delete G.ms[a.name];else G.ms[a.name]={i:M.i+1,t:Date.now()};
    complete({...a,name:a.name+" : "+M.step[0],xp:M.step[1]},b,ev);
    if(last)setTimeout(()=>toast(`<span class="p">${esc(a.name)}</span> : terminé !`),700);else{const nx=M.L[M.i+1];setTimeout(()=>toast(nx[2]?`Prochaine étape dans ${nx[2]>=60?nx[2]/60+" h":nx[2]+" min"} : ${esc(nx[0].toLowerCase())}`:`Étape suivante : ${esc(nx[0].toLowerCase())}`),700)}return}
  const xx=actXp(a,todayN||0);if(!xx)return;complete({...a,xp:xx},b,ev)}
setInterval(()=>{if(!S.g||!S.g.ms)return;Object.entries(S.g.ms).forEach(([n,st])=>{const L=MS[n];if(!L||!L[st.i])return;const w=L[st.i][2];if(!w)return;const ready=Date.now()>=st.t+w*6e4;if(ready&&!st.rd){st.rd=1;save();toast(`C'est prêt : <span class="p">${esc(L[st.i][0].toLowerCase())}</span>`);sfx("badge");renderActCards()}else if(!ready&&document.querySelector(".lzbtn.wait"))renderActCards()})},30000);






function newG(){return{nb:[],boss:{wk:"",max:0,name:"",i:-1,won:false},bh:[],chests:1,chestLvl:null,opened:0,ol:[],gear:[],eq:{},boost:0,rt:[],hist:{},mood:{},sleep:{},rel:{}}}
function normG(g){const n=newG();if(!g||typeof g!=="object")return n;const o={...n,...JSON.parse(JSON.stringify(g))};["bh","ol","gear","rt"].forEach(k=>{if(!Array.isArray(o[k]))o[k]=[]});["eq","hist","mood","sleep","rel"].forEach(k=>{if(!o[k]||typeof o[k]!=="object")o[k]={}});if(!o.boss||typeof o.boss!=="object")o.boss=n.boss;return o}
const RAR=[["Commun","#8a8f99"],["Rare","#2a8fd6"],["Épique","#b06ad9"],["Légendaire","#e0b030"]];

const GEAR=[
  // coiffes
  {id:"beret",s:"tete",k:"hat",o:18,n:"Béret",r:0},{id:"straw",s:"tete",k:"hat",o:19,n:"Chapeau de paille",r:0},
  {id:"phones",s:"tete",k:"hat",o:4,n:"Casque audio",r:1,set:"star"},{id:"cowboy",s:"tete",k:"hat",o:12,n:"Chapeau de cowboy",r:1},{id:"ninja",s:"tete",k:"hat",o:15,n:"Bandeau ninja",r:1,set:"ninja"},{id:"flowers",s:"tete",k:"hat",o:16,n:"Couronne de fleurs",r:1},
  {id:"wizard",s:"tete",k:"hat",o:9,n:"Chapeau de magicien",r:2,set:"mage"},{id:"helmet",s:"tete",k:"hat",o:10,n:"Casque de chevalier",r:2,set:"knight"},{id:"viking",s:"tete",k:"hat",o:11,n:"Cornes de viking",r:2},{id:"pirate",s:"tete",k:"hat",o:17,n:"Chapeau de pirate",r:2},
  {id:"crown",s:"tete",k:"hat",o:5,n:"Couronne",r:3,set:"king"},
  {id:"toque",s:"tete",k:"hat",o:13,n:"Toque de chef",r:2,ex:"Cuisine 10"},{id:"halo",s:"tete",k:"hat",o:14,n:"Auréole",r:3,ex:"Série de 100 jours"},
  // tenues
  {id:"mariniere",s:"haut",k:"top",o:15,n:"Marinière",r:0},{id:"hawai",s:"haut",k:"top",o:16,n:"Chemise hawaïenne",r:0},
  {id:"leather",s:"haut",k:"top",o:8,n:"Veste en cuir",r:1},{id:"kimono",s:"haut",k:"top",o:11,n:"Kimono",r:1,set:"ninja"},
  {id:"armor",s:"haut",k:"top",o:9,n:"Armure",r:2,set:"knight"},{id:"robe",s:"haut",k:"top",o:13,n:"Robe de mage",r:2,set:"mage"},
  {id:"cape",s:"haut",k:"top",o:10,n:"Cape royale",r:3,set:"king"},
  {id:"briefcase",s:"haut",k:"top",o:12,n:"Costume",r:2,ex:"Travail 10"},{id:"towel",s:"haut",k:"top",o:14,n:"Peignoir",r:2,ex:"Maison 10"},
  // lunettes
  {id:"heartg",s:"yeux",k:"glasses",o:4,n:"Lunettes cœur",r:0},{id:"mask",s:"yeux",k:"glasses",o:5,n:"Masque",r:1,set:"ninja"},
  {id:"monocle",s:"yeux",k:"glasses",o:6,n:"Monocle",r:2},{id:"cyber",s:"yeux",k:"glasses",o:7,n:"Visière cyber",r:3},
  {id:"goldspecs",s:"yeux",k:"glasses",o:8,n:"Lunettes dorées",r:2,ex:"Style 10"},
  // bijoux
  {id:"pearls",s:"bijou",k:"bijou",o:5,n:"Collier de perles",r:0},{id:"chain",s:"bijou",k:"bijou",o:2,n:"Chaîne en or",r:1},
  {id:"earring",s:"bijou",k:"bijou",o:6,n:"Boucles en diamant",r:2,set:"king"},{id:"medal",s:"bijou",k:"bijou",o:7,n:"Médaillon de famille",r:2,ex:"Famille 10"},
  // objets en main
  {id:"rose",s:"main",k:"main",o:16,n:"Rose",r:0},{id:"cup",s:"main",k:"main",o:17,n:"Tasse de café",r:0},{id:"balloon",s:"main",k:"main",o:18,n:"Ballon",r:0},
  {id:"mic",s:"main",k:"main",o:1,n:"Micro",r:1,set:"star"},{id:"case",s:"main",k:"main",o:19,n:"Mallette",r:1},
  {id:"sword",s:"main",k:"main",o:14,n:"Épée",r:2,set:"knight"},{id:"guitar",s:"main",k:"main",o:15,n:"Guitare",r:2},
  {id:"disc",s:"main",k:"main",o:2,n:"Disque d'or",r:3,set:"star"},
  {id:"pad",s:"main",k:"main",o:3,n:"Manette",r:2,ex:"Jeu vidéo 10"},{id:"clap",s:"main",k:"main",o:4,n:"Clap de cinéma",r:2,ex:"Cinéphile 10"},
  {id:"book",s:"main",k:"main",o:5,n:"Grimoire",r:2,ex:"Lecture 10",set:"mage"},{id:"watch",s:"main",k:"main",o:6,n:"Montre en or",r:2,ex:"Organisation 10"},
  {id:"compass",s:"main",k:"main",o:7,n:"Boussole",r:2,ex:"Exploration 10"},{id:"camera",s:"main",k:"main",o:8,n:"Appareil photo",r:2,ex:"Photo 10"},
  {id:"dumbbell",s:"main",k:"main",o:9,n:"Haltère",r:2,ex:"Force 10"},{id:"fork",s:"main",k:"main",o:10,n:"Fourchette d'or",r:2,ex:"Nourriture 10"},
  {id:"shieldf",s:"main",k:"main",o:11,n:"Bouclier de l'amitié",r:2,ex:"Ami 10"},{id:"brush",s:"main",k:"main",o:12,n:"Pinceau d'artiste",r:2,ex:"Talent 10"},
  {id:"bottle",s:"main",k:"main",o:13,n:"Gourde",r:2,ex:"Eau 10"},
  // fonds
  {id:"bgcheck",s:"fond",k:"bgP",o:3,n:"Fond damier",r:0},{id:"bgstars",s:"fond",k:"bgP",o:4,n:"Fond étoilé",r:0},{id:"bggrad",s:"fond",k:"bgP",o:5,n:"Fond dégradé",r:0},
  {id:"bgnight",s:"fond",k:"bgP",o:7,n:"Nuit étoilée",r:1},{id:"bgsunset",s:"fond",k:"bgP",o:8,n:"Coucher de soleil",r:1},{id:"bgcode",s:"fond",k:"bgP",o:9,n:"Fond code",r:2},
  {id:"bgflame",s:"fond",k:"bgP",o:6,n:"Fond flammes",r:2,ex:"Série de 7 jours"},{id:"bgrainbow",s:"fond",k:"bgP",o:10,n:"Arc-en-ciel",r:3,ex:"Série de 30 jours"},
  // auras
  {id:"stars",s:"aura",n:"Étoiles",r:0,svg:'<g fill="#ffe27a" stroke="#8a6410" stroke-width=".8"><path d="M12 6 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 Z"/><path d="M106 14 l2 4.5 l4.5 2 l-4.5 2 l-2 4.5 l-2 -4.5 l-4.5 -2 l4.5 -2 Z"/><path d="M108 88 l2 4.5 l4.5 2 l-4.5 2 l-2 4.5 l-2 -4.5 l-4.5 -2 l4.5 -2 Z"/></g>'},
  {id:"notes",s:"aura",n:"Notes de musique",r:1,svg:'<g fill="#e0b030" stroke="#5a3d08" stroke-width=".6" font-family="serif" font-weight="700"><text x="6" y="24" font-size="22">♪</text><text x="96" y="30" font-size="22">♫</text><text x="100" y="98" font-size="18">♪</text></g>'},
  {id:"neon",s:"aura",n:"Néon cyan",r:1,glow:"#4cc9f0",svg:'<rect x="3" y="3" width="114" height="134" rx="13" fill="none" stroke="#4cc9f0" stroke-width="3"/>'},
  {id:"goldaura",s:"aura",n:"Aura dorée",r:2,glow:"#e0b030",svg:'<rect x="3" y="3" width="114" height="134" rx="13" fill="none" stroke="#ffd75e" stroke-width="3"/>'},
  {id:"hello",s:"aura",n:"Bulles polyglottes",r:2,ex:"Ami 5",svg:'<g font-family="monospace" font-weight="700" font-size="10"><rect x="2" y="4" width="34" height="15" rx="6" fill="#fff" stroke="#2a8fd6"/><text x="6" y="15" fill="#2a8fd6">Hola</text><rect x="80" y="12" width="38" height="15" rx="6" fill="#fff" stroke="#c2516b"/><text x="84" y="23" fill="#c2516b">Hello</text><rect x="84" y="84" width="34" height="15" rx="6" fill="#fff" stroke="#3c9a4f"/><text x="88" y="95" fill="#3c9a4f">Ciao</text></g>'},
  {id:"lotus",s:"aura",n:"Aura zen",r:2,ex:"Soi 5",glow:"#f3a6c8",svg:'<g fill="#f3a6c8" stroke="#c2516b" stroke-width="1"><path d="M10 26 q-6-12 0-20 q6 8 0 20z"/><path d="M10 26 q-12-4-12-12 q10 2 12 12z"/><path d="M10 26 q12-4 12-12 q-10 2-12 12z"/><path d="M108 30 q-5-10 0-17 q5 7 0 17z"/><path d="M108 30 q-10-3-10-10 q8 2 10 10z"/><path d="M108 30 q10-3 10-10 q-8 2-10 10z"/></g>'},
  {id:"flames",s:"aura",n:"Flammes",r:3,glow:"#ff7a1a",svg:'<g fill="#ff7a1a" stroke="#c43c0c" stroke-width="1"><path d="M0 140 Q2 112 10 104 Q10 118 18 120 Q16 100 28 92 Q26 116 36 140 Z"/><path d="M120 140 Q118 112 110 104 Q110 118 102 120 Q104 100 92 92 Q94 116 84 140 Z"/></g><g fill="#ffd75e"><path d="M8 140 Q10 124 16 120 Q18 132 24 140 Z"/><path d="M112 140 Q110 124 104 120 Q102 132 96 140 Z"/></g>'}
];
const WR_SETS=[["star","Star du micro","Star du micro"],["knight","Chevalier","Paladin"],["mage","Mage","Archimage"],["king","Roi","Souverain"],["ninja","Ninja","Ombre silencieuse"]];
const WR_CATS=[["tete","Coiffes"],["haut","Tenues"],["yeux","Lunettes"],["bijou","Bijoux"],["main","Objets"],["fond","Fonds"],["aura","Auras"],["titre","Titres"],["set","Panoplies"],["badges","Badges"]];
const STREAK_IT={7:"bgflame",30:"bgrainbow",100:"halo"};
const RARE_TITLES=["Barde légendaire","Maître du flow","Prince de la topline","Chevalier du studio","Roi du shatta","Maître des projets","Seigneur du canapé","Âme d'artiste"];

const SURPRISE=[["Finir une instru laissée de côté","perso",20,"son"],["Enregistrer une maquette voix","perso",20,"son"],["Faire écouter un son à quelqu'un","perso",20,"son"],["Refaire un son connu à ta façon","perso",20,"son"],["16 mesures en 20 min chrono","perso",10,"son"],["Poster un extrait de son","perso",20,"son"],["20 min de marche sans téléphone","sport",10,"out"],["Battre ton record de pompes","sport",10],["Étirements avant de dormir","sport",10],["20 min de marche dehors","soi",10,"out"],["Lire 10 pages","soi",10],["Couper le téléphone 1 h avant de dormir","soi",10],["Prendre un rendez-vous médecin ou dentiste en retard","soi",20],["Trier un tiroir ou une étagère","maison",10],["Vider entièrement l'évier","maison",10],["Laver ta gourde ou ta tasse","maison",3],["Envoyer un vocal à quelqu'un perdu de vue","social",20,"cour"],["Ramener un café ou une viennoiserie à quelqu'un","social",20],["Envoyer une photo souvenir à la famille","famille",10,"loin"],["Aider à une tâche chez tes parents","famille",20,"parents"]];
function surOk(x){if(!normOk(x[0]))return false;if(S.g&&(S.g.fqNo||{})["s:"+x[0]])return false;const s=typeof sitOf==="function"?sitOf():null,w=typeof wxNow==="function"?wxNow():null,t=x[3];if(t==="son")return s?!!((s.pass||[]).includes("creer")||(s.pass||[]).includes("rap")||(s.goals||[]).includes("son")):!(S.g&&S.g.noMus);
  if(t==="out")return!(w&&["rain","storm","snow"].includes(w.k))&&!(typeof fqHasOut==="function"&&fqHasOut());if(t==="parents")return!s||s.home==="parents"||(s.goals||[]).includes("famille");if(t==="loin")return!s||s.home!=="parents";return true}
const SPRITES={
 slime:["..........","...####...","..######..",".##o##o##.",".##x##x##.","##########","##########",".########."],
 ghost:["...####...","..######..",".##o##o##.",".##x##x##.",".########.",".########.",".########.",".#.##.##.#"],
 golem:["..######..","..#o##o#..","..#x##x#..","##########","#.######.#","#.######.#","..##..##..","..##..##.."],
 dragon:["#.......#.","##.####.##",".########.",".#o####o#.",".#x####x#.","..######..","...####...","..#.##.#.."],
 bat:["#........#","##.####.##","##########","#.#o##o#.#","..#x##x#..","...####...","....##....",".........."],
 skull:["..######..",".########.","##o####o##","##x####x##",".########.","..##..##..","..#.##.#..",".........."],
 shroom:["..######..",".##.##.##.","##########","...o##o...","...x##x...","..######..","..##..##..",".........."]};
