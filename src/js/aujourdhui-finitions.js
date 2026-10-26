// Aujourd'hui : finitions des blocs (noter une action, univers visuels, quêtes intelligentes, menus, frise, repas, nuit…). Ex-correctifs.js, à fondre dans les rendus d'origine lors de la refonte écran par écran.
// Ancienne grosse IIFE de rustines, désormais à portée globale (phase 4)

const EV=["sleepGo","enBox","nowBox","evmBox","wkSun","rtrBox","gameBox","xmBox"];
const XPRE=/^\+\s?\d+(\s?XP)?$/;
function oneEv(){let found=false;
  EV.forEach(id=>{const el=document.getElementById(id);if(!el)return;el.classList.remove("evhide");
    if(found){if(!el.classList.contains("voff")&&el.innerHTML.trim())el.classList.add("evhide");return}
    if(!el.classList.contains("voff")&&el.innerHTML.trim()&&getComputedStyle(el).display!=="none")found=true})}
function tagXP(){document.querySelectorAll('.wrap>section:not(.qxp):not(#trkBox)').forEach(sec=>{
    sec.querySelectorAll("em,small,span,b,i,.xp,button").forEach(el=>{if(el.closest(".fqcnt"))return;
      const t=(el.textContent||"").trim();if(!XPRE.test(t))return;
      if(el.tagName==="BUTTON"){if(!el.querySelector("*"))el.classList.add("xpb");return}
      if(!el.querySelector("*")&&el.closest("button,.q,.sq,.wkx,.rtile,.mbw,.dqi"))el.classList.add("xph")})})}
function bilMore(){const c=document.getElementById("chapBox");if(!c||c.querySelector(".bmore"))return;const hero=c.querySelector(".bhero");if(!hero)return;
  const b=document.createElement("button");b.type="button";b.className="btn bmore";const lab=()=>b.textContent=document.documentElement.classList.contains("bilopen")?"Masquer le détail":"Voir le détail";lab();
  b.onclick=()=>{document.documentElement.classList.toggle("bilopen");lab()};hero.after(b)}
function noBoss(){if(!S||!Array.isArray(S.specials))return;const n=S.specials.length;S.specials=S.specials.filter(q=>!q.bq&&!q.bs);if(S.specials.length!==n)save()}

function cGoSub(k,sb){if(sb!==undefined)return window.goSub(k,sb);try{subs.c=k;localStorage.setItem("cq-subs",JSON.stringify(subs))}catch(e){}try{applySub()}catch(e){}}
{let t=0;document.addEventListener("pointerdown",e=>{if(e.target&&e.target.id==="setTitle"){t=setTimeout(()=>{document.documentElement.classList.toggle("admin");try{toast(document.documentElement.classList.contains("admin")?"Mode admin":"Mode admin masqué")}catch(_){}},800)}});["pointerup","pointercancel","pointerleave"].forEach(n=>document.addEventListener(n,()=>clearTimeout(t)))}
try{const ms=document.getElementById("meSet");if(ms)ms.onclick=()=>{try{showView("c")}catch(e){}cGoSub("vie");setTimeout(()=>{const b=document.getElementById("setBox");if(b)b.scrollIntoView({behavior:"smooth",block:"start"})},150)}}catch(e){}
// ===== Noter une action : Action → Quoi → Avec qui → Pendant
const LZ_KW=[["lect",/\b(lire|livre|lecture|pages?|bd|manga)\b/i],["cine",/(film|s[ée]rie|[ée]pisode|cin[ée]ma|documentaire)/i],["cuis",/(cuisin|nouveau plat|recette|repas maison|p[âa]tisser)/i],["jeu",/(jeu vid[ée]o|gaming)/i],["orga",/(planifi|organis|mails?|agenda|pr[ée]parer ma semaine|t[âa]che importante|dossier|administratif|papiers)/i],["style",/(tenue|armoire|v[êe]tement|look)/i],["explo",/(balade|d[ée]couvr|nouveau lieu|explor)/i],["photo",/(photo|montage)/i],["lang",/(anglais|espagnol|langue|duolingo|le[çc]on)/i]];
window.lzGuess=function(a){try{if(!a||!a.name||/^(rit|mb|sleep|lz|sp|mq|fq|f:|tik|arc|duo|ev|af:)/.test(String(a.id||"")))return"";for(const[id,re]of LZ_KW)if(re.test(a.name))return id}catch(e){}return""};
const norm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const IC={home:'<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',force:'<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',soi:'<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',food:'<path d="M7 3v8a3 3 0 0 0 6 0V3M10 3v18M17 3c-2 2-2 6 0 8v10"/>',work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',fun:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15.5 12h.01M18 13.5h.01"/>',make:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',learn:'<path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM4 19a2 2 0 0 1 2-2h12"/>',people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 5.5 2 5.5 5"/>'};
const DOMS=[["maison","Maison","var(--c-maison)","home","maison"],["sport","Force","var(--c-sport)","force","sport"],["soi","Soi","var(--c-soi)","soi","soi"],["nourriture","Nourriture","var(--c-food)","food","nourriture"],["travail","Travail","#6f8fe0","work","travail"],["divert","Divertissement","#7b6cf0","fun","soi"],["creer","Créer","var(--c-perso)","make","perso"],["apprendre","Apprendre","#2a8fd6","learn","soi"],["proches","Proches","var(--c-social)","people","social"]];
// {id, dom, cat, l, xp, o:[label | [label, nom enregistré]], lz, fr:[jours orange, jours rouge], solo, who}
const FAM=[
  {id:"ranger",dom:"maison",cat:"maison",l:"Ranger",xp:10,o:["Chambre","Salon","Cuisine","Salle de bain","Bureau","Entrée","Placard","Voiture"],fr:[7,14]},
  {id:"nettoyer",dom:"maison",cat:"maison",l:"Nettoyer",xp:10,o:["Sol","Cuisine","Salle de bain","Toilettes","Vitres","Frigo","Poussière"],fr:[7,14]},
  {id:"linge",dom:"maison",cat:"maison",l:"Linge",xp:6,o:["Lancer une machine","Étendre","Plier et ranger","Repasser","Changer les draps"],fr:[5,10]},
  {id:"vaisselle",dom:"maison",cat:"maison",l:"Vaisselle",xp:6,o:["Laver","Ranger","Lave-vaisselle"],fr:[2,4]},
  {id:"mmaison",dom:"maison",cat:"maison",l:"Petites tâches",xp:5,o:["Sortir les poubelles","Courses","Arroser les plantes","Réparer un truc"],fr:[5,10]},
  {id:"armoire",dom:"maison",cat:"maison",l:"Garde-robe",xp:8,o:["Trier l'armoire","Tenue soignée"],lz:"style"},
  {id:"clarte",dom:"maison",cat:"maison",l:"Tri du téléphone",xp:10,o:["Photos","Notes","Messages et contacts","Mails","Applis","Réseaux","Notifications","Modes de concentration","Fond d'écran","Albums photos","Musique locale","Spotify","Cartes","Docs et Drive","Fichiers"],fr:[30,60],fro:{"Mails":[14,30],"Modes de concentration":[60,120],"Fond d'écran":[60,120],"Musique locale":[60,120],"Cartes":[60,120]},solo:1},
  {id:"renfo",dom:"sport",cat:"sport",l:"Renforcement",xp:10,o:["Pompes","Squats","Gainage","Abdos","Tractions"],fr:[3,7],q:{Pompes:"reps",Squats:"reps",Abdos:"reps",Tractions:"reps"}},
  {id:"cardio",dom:"sport",cat:"sport",l:"Cardio",xp:15,o:["Marche","Course","Vélo","Natation","Corde à sauter"],fr:[4,10],q:{Marche:"km",Course:"km",Vélo:"km",Natation:"km"}},
  {id:"souple",dom:"sport",cat:"sport",l:"Souplesse",xp:8,o:["Étirements","Yoga","Mobilité"],fr:[4,10]},
  {id:"sportco",dom:"sport",cat:"sport",l:"Sport à plusieurs",xp:20,o:["Foot","Basket","Escalade","Danse","Autre sport"],fr:[10,21]},
  {id:"bouger",dom:"sport",cat:"sport",l:"Bouger au quotidien",xp:8,o:["Trajet à pied","Trajet à vélo","Escaliers"]},
  {id:"calme",dom:"soi",cat:"soi",l:"Se poser",xp:10,o:["Méditer","Respirer","Pause sans écran"],fr:[3,7]},
  {id:"sieste",dom:"soi",cat:"soi",l:"Sieste",xp:8,o:["Sieste"],nap:1},
  {id:"soin",dom:"soi",cat:"soi",l:"Prendre soin de moi",xp:8,o:["Coiffeur","Masque","Bain","Ongles","Crème"],fr:[7,14],fro:{Coiffeur:[35,50],Ongles:[10,18],"Crème":[3,7]}},
  {id:"sante",dom:"soi",cat:"soi",l:"Santé",xp:15,o:["Dentiste","Médecin","Kiné","Ophtalmo","Prise de sang"],fr:[150,240],fro:{"Médecin":[300,400],"Kiné":[14,30]}},
  {id:"ecrire",dom:"soi",cat:"soi",l:"Écrire",xp:8,o:["Journal","Gratitude","Pensées"],fr:[4,10]},
  {id:"dehors",dom:"soi",cat:"soi",l:"Prendre l'air",xp:8,o:["Balade","Soleil","Nature","Nouveau lieu"],lz:"explo",fr:[3,7],fro:{"Nouveau lieu":[14,30]}},
  {id:"nuit",dom:"soi",cat:"soi",l:"Bien dormir",xp:10,o:["Coucher avant minuit","Pas d'écran au lit"],solo:1},
  {id:"manger",dom:"nourriture",cat:"nourriture",l:"Bien manger",xp:10,o:["Repas équilibré","Repas végétarien","Fruit ou légume","Petit-déj complet"],fr:[2,4]},
  {id:"cuisiner",dom:"nourriture",cat:"nourriture",l:"Cuisiner",xp:12,o:["Repas maison","Nouveau plat","Pâtisserie","Préparer demain"],lz:"cuis",fr:[3,7],fro:{"Nouveau plat":[14,30],"Pâtisserie":[21,45]}},
  {id:"eau",dom:"nourriture",cat:"eau",l:"Boire de l'eau",xp:3,o:["Un verre"],quick:1},
  {id:"sans",dom:"nourriture",cat:"nourriture",l:"Journée sans…",xp:10,o:["Soda","Sucre","Grignotage"],quick:1},
  {id:"focus",dom:"travail",cat:"travail",l:"Travail concentré",xp:15,o:["Dossier","Candidature","Révisions","Projet perso"]},
  {id:"admin",dom:"travail",cat:"travail",l:"Administratif",xp:10,o:["Mails","Papiers","Rendez-vous pris","Factures"],lz:"orga",fr:[3,7],fro:{Papiers:[14,30],Factures:[25,35],"Rendez-vous pris":[30,60]}},
  {id:"planif",dom:"travail",cat:"travail",l:"Planifier",xp:8,o:["Ma journée","Ma semaine"],lz:"orga"},
  {id:"fini",dom:"travail",cat:"travail",l:"Tâche importante finie",xp:25,o:["Fini !"],quick:1},
  {id:"lire",dom:"divert",cat:"soi",l:"Lire",xp:10,o:["Livre","BD ou manga","Article","Livre fini"],lz:"lect",fr:[3,7],fro:{"Livre fini":[30,60]},q:{Livre:"pages","BD ou manga":"pages"}},
  {id:"regarder",dom:"divert",cat:"soi",l:"Regarder",xp:10,o:["Film","Épisode","Série finie","Documentaire"],lz:"cine"},
  {id:"jouer",dom:"divert",cat:"soi",l:"Jouer",xp:10,o:["Jeu vidéo","Jeu de société","Jeu fini"],lz:"jeu"},
  {id:"sorties",dom:"divert",cat:"soi",l:"Sortir",xp:20,lzo:{"Cinéma":"cine","Musée ou expo":"explo"},o:["Cinéma","Concert","Musée ou expo","Théâtre","Restaurant","Bar","Jam session","Stand-up","Soirée quiz","Karaoké","Bar à jeux","Escape game","Bowling ou billard","Arcade","Brocante","Friperie","Disquaire","Atelier","Escalade","Festival","Match","Excursion"],fr:[14,30],fro:{"Cinéma":[14,30],"Concert":[30,60]}},
  {id:"ecouter",dom:"divert",cat:"soi",l:"Écouter",xp:8,o:["Album","Podcast","Concert"]},
  {id:"musique",dom:"creer",cat:"perso",l:"Musique",xp:20,o:[["Faire du son","Faire du son (1 h)"],["Écrire un texte","Écrire un couplet"]],fr:[3,7]},
  {id:"image",dom:"creer",cat:"perso",l:"Image",xp:12,o:["Séance photo","Vidéo","Montage"],lz:"photo"},
  {id:"art",dom:"creer",cat:"perso",l:"Dessin et art",xp:12,o:["Dessin","Peinture","Bricolage"],fr:[7,14]},
  {id:"langue",dom:"apprendre",cat:"soi",l:"Langue",xp:10,o:["Leçon","Film en VO","Conversation"],lz:"lang",fr:[3,7]},
  {id:"cours",dom:"apprendre",cat:"soi",l:"Apprendre",xp:12,o:["Tuto","Formation","Lecture utile"]},
  {id:"contact",dom:"proches",cat:"social",l:"Prendre des nouvelles",xp:10,o:["Message","Appel","Vocal"],who:1},
  {id:"voir",dom:"proches",cat:"social",l:"Voir quelqu'un",xp:20,o:["Café","Repas","Soirée","Activité","Visite"],who:1},
  {id:"service",dom:"proches",cat:"social",l:"Rendre service",xp:15,o:["Un coup de main"],who:1}];
const DUR=[[0,"Rapide"],[15,"15 min"],[30,"30 min"],[60,"1 h"],[120,"2 h"],[180,"3 h +"]],NAP=[[10,"10 min"],[20,"20 min"],[30,"30 min"],[45,"45 min"],[60,"1 h"],[90,"1 h 30"]];
const durXp=m=>m<=0?0:m<=60?m:Math.round(60+(m-60)*.65);
const QTY={reps:{u:"rép.",o:[10,20,30,50,100],x:q=>Math.round(q/2)},km:{u:"km",o:[1,2,3,5,10,21],x:q=>q*8},pages:{u:"pages",o:[10,20,30,50,100],x:q=>Math.round(q/2)}};
let afCat="",afQ="",afSel=null,afWho=[],afDur=0,afAllP=false,afFam="",afStep="who",afQty=0,afAdd=false;
function afClose(){setTimeout(()=>{const b=document.querySelector("#plusBox .plusb");if(b&&document.documentElement.classList.contains("plusopen"))b.click()},380)}
function afFinish(it,el,ev){try{uniBurst(el,it.dom||domOfCat(it.cat))}catch(e){}afDo(it,el,ev,afDur,afWho,afQty);el.classList.add("pop");afSel=null;afWho=[];afDur=0;afQty=0;afAllP=false;afStep="who";afClose()}
const qKind=it=>it&&it.k==="fam"&&it.f.q?it.f.q[it.opt]||"":"";
const nextStep=it=>qKind(it)?"qty":"dur";
window.__AFB={FAM,DUR,QTY,afDo:(...a)=>afDo(...a),items:()=>afItems(),people:()=>people(),groups:()=>groups(),qKind};
function afDefaults(){const L=[];try{[STARTER,MICRO,PERSO,NOURRITURE].forEach(A=>(A||[]).forEach(a=>L.push(a.name)))}catch(e){}return new Set(L)}
const strip=n=>String(n).replace(/\s*\((\d+\s*(min|h))\)/i,"").replace(/\b\d+\s*(min|h)\b\s*(de\s*)?/i,"").replace(/\s{2,}/g," ").trim();
const domOfCat=c=>({perso:"creer",social:"proches",famille:"proches",eau:"nourriture"}[c]||c);
function afItems(){const out=[],def=afDefaults(),famW=[];
  FAM.forEach(f=>{famW.push(norm(f.l));[...f.o,...(((S.g&&S.g.afCustom)||{})[f.id]||[])].forEach(o=>{const[lab,log]=Array.isArray(o)?o:[o,null];famW.push(norm(lab));out.push({k:"fam",f,opt:lab,log,cat:f.cat,dom:f.dom,lz:(f.lzo&&f.lzo[lab])||f.lz||"",name:f.o.length===1&&(lab===f.l||f.nap||f.quick)?f.l:f.l+" · "+lab})})});
  (S.actions||[]).forEach(a=>{if(def.has(a.name)||(typeof ACT_HIDE!=="undefined"&&ACT_HIDE.has(a.name)))return;const nn=norm(a.name);if(famW.some(w=>w.length>3&&nn.includes(w)))return;out.push({k:"own",a,cat:a.cat,dom:domOfCat(a.cat),name:strip(a.name),lz:lzGuess({id:"x",name:a.name})})});return out}
function afCats(){const all=DOMS.map(([id,l,c,ic])=>({id:"dom:"+id,label:l,c,ic:IC[ic]}));return{D:all,Z:[],all}}
const afKey=it=>it.k==="fam"?"af:"+it.f.id+":"+it.opt:it.a.id;
function afLast(key){const L=(S.g.afLast||{})[key];return L||0}
function afFr(f,opt){return(f.fro&&f.fro[opt])||f.fr||null}
function afFresh(it){if(it.k!=="fam")return"";const fr=afFr(it.f,it.opt);if(!fr)return"";const t=afLast(afKey(it));if(!t)return"fr-g";const d=(Date.now()-t)/864e5;return d>=fr[1]?"fr-r":d>=fr[0]?"fr-o":"fr-g"}
function afToday(key){const tk=dayKey(Date.now());return(S.log||[]).filter(e=>e.a===key&&dayKey(e.t)===tk).length}
function groups(){try{return fgList().map(g=>({id:g.id,n:g.n,m:fgMembers(g.id)})).filter(g=>g.m.length>=2)}catch(e){return[]}}
function whoLabel(who){const G=groups().find(g=>g.m.length===who.length&&g.m.every(n=>who.includes(n)));return G?G.n:who.join(", ")}
function people(){let L=[];try{L=relNames()}catch(e){L=[...(S.family||[]),...(S.friends||[])]}L=[...new Set(L)];return L.sort((a,b)=>((S.bondsLast||{})[b]||0)-((S.bondsLast||{})[a]||0))}
function afDo(it,el,ev,dur,who,qty){
  const key=afKey(it),n=afToday(key);let base=it.k==="own"?((()=>{try{return actXp(it.a,n)}catch(e){return n<3?it.a.xp:0}})()):(it.f.cat==="eau"?it.f.xp:(n<3?it.f.xp:Math.round(it.f.xp/3)));
  const qk=qKind(it);let xp=it.k==="fam"&&it.f.nap?(n<2?it.f.xp:0):qty&&qk?Math.max(base,QTY[qk].x(qty)):dur?Math.max(base,durXp(dur)):base;if(it.k==="fam"&&it.f.nap&&dur){if(!S.g.nap||typeof S.g.nap!=="object")S.g.nap={};const tk=dayKey(Date.now());S.g.nap[tk]=(S.g.nap[tk]||0)+dur}
  let cat=it.cat;if(it.k==="fam"&&it.f.dom==="proches"&&who.length&&who.every(p=>{try{return isFam(p)}catch(e){return false}}))cat="famille";
  const name=(it.k==="fam"&&it.f.nap?"Sieste":it.k==="own"?it.a.name:(it.log||it.name))+(who.length?" avec "+whoLabel(who):"")+(qty&&qk?" · "+qty+" "+QTY[qk].u:"")+(dur&&!(qty&&qk)?" · "+([...DUR,...NAP].find(d=>d[0]===dur)||[0,dur+" min"])[1]:"");
  const a={id:key,cat,name:name+(()=>{try{return skTrack(it,qty)}catch(e){return""}})(),xp};
  if(!S.g.afLast||typeof S.g.afLast!=="object")S.g.afLast={};S.g.afLast[key]=Date.now();if(!S.g.afMem||typeof S.g.afMem!=="object")S.g.afMem={};S.g.afMem[key]={w:who.slice(0,3),d:dur||0};try{navigator.vibrate&&navigator.vibrate(15)}catch(e){}
  who.forEach(p=>{S.bonds[p]=(S.bonds[p]||0)+Math.max(5,Math.round(xp/2));S.bondsLast[p]=Date.now()});
  try{recCheck(it,qty)}catch(e){}if(who.length&&it.k==='fam'&&it.f.dom==='proches')setTimeout(()=>{try{kwAsk(who)}catch(e){}},2800);
  let extra=who.length?{withp:who.slice()}:null;
  if(it.lz&&it.lz!=="son"&&xp>0){try{lzGain(it.lz,xp)}catch(e){}extra={...(extra||{}),lz:it.lz+":af",lzx:xp}}
  if(!xp){noXp(a,el,ev,extra);return}
  complete(a,el,ev,false,extra);if(who.length)setTimeout(()=>{try{toast(`Lien renforcé avec <span class="p">${esc(who.join(", "))}</span>`)}catch(e){}},900)}
function renderAF(){try{return renderAF0()}finally{try{afSkill()}catch(e){}try{afWhoViz()}catch(e){}}}
// « Avec qui ? » : les avatars comme partout ailleurs, et l'icône pixel des groupes à la place de l'emoji
function afWhoViz(){document.querySelectorAll('#actFind .afppl button[data-p]').forEach(b=>{const p=b.dataset.p;if(!p||b.querySelector('.pav'))return;b.insertAdjacentHTML('afterbegin',pAv(p,'fmini afav'))});document.querySelectorAll('#actFind .afppl .afgrp').forEach(b=>{if(b.querySelector('.afgi'))return;b.textContent=b.textContent.replace(/^\s*👥\s*/,'');b.insertAdjacentHTML('afterbegin','<span class="afgi">'+rkSvg('duo')+'</span>')})}
function renderAF0(){const box=document.getElementById("actFind");if(!box||!S||!S.g)return;const C=afCats(),q=norm(afQ).trim(),items=afItems();
  // étape précisions : d'abord avec qui, puis combien de temps
  if(afSel){const it=afSel,P0=people(),mw=(((S.g.afMem||{})[afKey(it)]||{}).w||[]),HM=(it.dom==="maison"?(()=>{try{const s=sitOf();return(Array.isArray(s.with)?s.with:[]).filter(p=>P0.includes(p)&&!mw.includes(p))}catch(e){return[]}})():[]),P=[...mw.filter(p=>P0.includes(p)),...HM,...P0.filter(p=>!mw.includes(p)&&!HM.includes(p))],shownP=afAllP?P:P.slice(0,10);const isWho=it.k==="fam"&&it.f.who,quickDur=it.k==="fam"&&(it.f.quick||/\bfini(e)?$/i.test(it.opt));
    if(afStep==="who"){box.innerHTML=`<div class="afd"><div class="afdh"><button type="button" class="afback" aria-label="Retour">${ICO("chev",18)}</button><b></b></div><div class="afdr"><small>Avec qui ?</small><div class="afppl">${isWho?"":`<button type="button" class="afsolo" data-p="">Seul·e</button>`}${groups().map((g,i)=>`<button type="button" class="afgrp" data-g="${i}" aria-pressed="${g.m.every(n=>afWho.includes(n))}"></button>`).join("")}${shownP.map(p=>`<button type="button" data-p="${esc(p)}" aria-pressed="${afWho.includes(p)}"></button>`).join("")}${!afAllP&&P.length>10?`<button type="button" class="afmore">+ ${P.length-10}</button>`:""}</div></div>${afWho.length?`<button type="button" class="btn primary afnext"></button>`:""}</div>`;
      box.querySelector(".afdh b").textContent=it.name;setTimeout(dressAF,0);
      box.querySelectorAll(".afppl [data-p]").forEach(b=>{const p=b.dataset.p;if(p)b.textContent=p;b.onclick=ev=>{if(!p){afWho=[];if(quickDur){afFinish(it,b,ev);return}afStep=nextStep(it);renderAF();return}afWho=afWho.includes(p)?afWho.filter(x=>x!==p):[...afWho,p];renderAF()}});
      {const GG=groups();box.querySelectorAll(".afppl [data-g]").forEach(b=>{const g=GG[+b.dataset.g];b.innerHTML=ICO("users",14)+" "+esc(g.n);b.onclick=()=>{const all=g.m.every(n=>afWho.includes(n));afWho=all?afWho.filter(n=>!g.m.includes(n)):[...new Set([...afWho,...g.m])];renderAF()}})}
      {const nx=box.querySelector(".afnext");if(nx){{const wl=whoLabel(afWho);nx.textContent="Continuer avec "+(wl!==afWho.join(", ")?wl:afWho.length>2?afWho.slice(0,2).join(", ")+" +"+(afWho.length-2):afWho.join(" et "))+" →"}nx.onclick=ev=>{if(quickDur){afFinish(it,nx,ev);return}afStep=nextStep(it);renderAF()}}}
      const m=box.querySelector(".afmore");if(m)m.onclick=()=>{afAllP=true;renderAF()};
      box.querySelector(".afback").onclick=()=>{afSel=null;renderAF()};return}
    if(afStep==="qty"){const Q=QTY[qKind(it)];box.innerHTML=`<div class="afd"><div class="afdh"><button type="button" class="afback" aria-label="Retour">${ICO("chev",18)}</button><b></b></div><div class="afdr"><small>Combien ?</small><div class="afdur big">${Q.o.map(v=>`<button type="button" data-q="${v}">${v} ${Q.u}</button>`).join("")}</div><div class="afqin"><input type="number" inputmode="decimal" min="0" placeholder="Autre" aria-label="Autre quantité"><button type="button" class="btn">OK</button></div><button type="button" class="lnk aftime">Noter en temps plutôt</button></div></div>`;
      box.querySelector(".afdh b").textContent=it.name+(afWho.length?" avec "+whoLabel(afWho):"");
      box.querySelectorAll("[data-q]").forEach(b=>b.onclick=ev=>{afQty=+b.dataset.q;afFinish(it,b,ev)});
      {const qi=box.querySelector(".afqin input"),qb=box.querySelector(".afqin .btn");const go=ev=>{const v=parseFloat(String(qi.value).replace(",","."));if(v>0){afQty=v;afFinish(it,qb,ev)}};qb.onclick=go;qi.onkeydown=e=>{if(e.key==="Enter")go(e)}}
      box.querySelector(".aftime").onclick=()=>{afStep="dur";renderAF()};
      box.querySelector(".afback").onclick=()=>{afStep="who";renderAF()};return}
    box.innerHTML=`<div class="afd"><div class="afdh"><button type="button" class="afback" aria-label="Retour">${ICO("chev",18)}</button><b></b></div><div class="afdr"><small>Combien de temps ?</small><div class="afdur big">${(it.f&&it.f.nap?NAP:DUR).map(([m,l])=>`<button type="button" data-d="${m}">${l}</button>`).join("")}</div></div></div>`;
    box.querySelector(".afdh b").textContent=it.name+(afWho.length?" avec "+whoLabel(afWho):"");setTimeout(dressAF,0);
    box.querySelectorAll("[data-d]").forEach(b=>b.onclick=ev=>{afDur=+b.dataset.d;afFinish(it,b,ev)});
    box.querySelector(".afback").onclick=()=>{if(it.f&&it.f.nap){afSel=null}else afStep="who";renderAF()};return}
  const fams=c=>{const id=c.split(":")[1];const F=FAM.filter(f=>f.dom===id).map(f=>({l:f.l,c:(DOMS.find(d=>d[0]===id)||[])[2],its:items.filter(it=>it.k==="fam"&&it.f===f)}));const own=items.filter(it=>it.k==="own"&&it.dom===id);if(own.length)F.push({l:"Mes actions",c:(DOMS.find(d=>d[0]===id)||[])[2],its:own});return F};
  const reg=[];const chip=(it,lab)=>{reg.push([it,lab]);const n=afToday(afKey(it));return`<button type="button" class="afo ${afFresh(it)}${n?" did":""}"><span></span>${n?`<em>${n>1?"×"+n:ICO("check",12)}</em>`:""}</button>`};
  let body="";
  if(q){const L=items.filter(it=>norm(it.name).includes(q)).slice(0,30);body=`<small class="afh">${L.length} résultat${L.length>1?"s":""}</small><div class="afopts">${L.map(it=>chip(it,it.name)).join("")}</div><button type="button" class="afnew">+ Créer « <b></b> »</button>`}
  else if(afCat&&afFam){const F=fams(afCat).find(F=>F.l===afFam);if(!F){afFam=""}else {const fid=F.its[0]&&F.its[0].k==="fam"?F.its[0].f.id:"",cu=((S.g.afCustom||{})[fid]||[]);body=`<div class="aff" style="--fc:${F.c||"var(--gold)"}"><div class="affh"><button type="button" class="afback afup" aria-label="Retour">${ICO("chev",18)}</button><b class="afft"></b></div><div class="afopts">${F.its.map(it=>chip(it,it.k==="fam"?it.opt:it.name)).join("")}${fid?(afAdd?`<span class="afaddin"><input maxlength="30" placeholder="Nouveau…" aria-label="Nouvelle option"><button type="button" class="btn primary afaddok">Ajouter</button></span>`:`<button type="button" class="afo afadd" aria-label="Ajouter une option">+</button>`):""}</div>${afAdd&&cu.length?`<div class="afcu"><small>Tes ajouts</small>${cu.map((c,i)=>`<button type="button" class="afcux" data-cu="${i}"></button>`).join("")}</div>`:""}</div>`;box.__fid=fid}}
  if(afCat&&!afFam&&!q){const FF=fams(afCat);body=`<div class="afgrid">${FF.map((F,i)=>{const red=F.its.filter(it=>afFresh(it)==="fr-r").length,org=F.its.filter(it=>afFresh(it)==="fr-o").length,dn=F.its.some(it=>afToday(afKey(it)));return`<button type="button" class="aft${red?" r":org?" o":""}${dn?" did":""}" data-fam="${i}" style="--fc:${F.c||"var(--gold)"}"><b></b>${red?`<i class="afred">${red}</i>`:org?`<i class="afor">${org}</i>`:dn?`<em>${ICO("check",12)}</em>`:""}</button>`}).join("")}</div><button type="button" class="afnew">+ Créer une action</button>`}
  else if(!afCat&&!q){const cnt={};(S.log||[]).forEach(e=>{if(e.a)cnt[e.a]=(cnt[e.a]||0)+1});const L=items.filter(it=>cnt[afKey(it)]).sort((a,b)=>(habitRank(afKey(b))||cnt[afKey(b)])-(habitRank(afKey(a))||cnt[afKey(a)])).slice(0,8);body=L.length?`<small class="afh">Tes habituelles</small><div class="afopts">${L.map(it=>chip(it,it.name)).join("")}</div>`:`<small class="afh">Choisis une catégorie</small>`}
  box.innerHTML=`<div class="afs"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="text" class="afq" placeholder="Chercher : cuisine, film, pompes…" autocomplete="off" enterkeyhint="search">${afQ?`<button type="button" class="afx" aria-label="Effacer">${ICO("close",14)}</button>`:""}</div>
    ${q?"":`<div class="afc">${C.D.map(c=>`<button type="button" data-afc="${c.id}" aria-pressed="${afCat===c.id}" style="--cc:${c.c}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.ic}</svg><span></span></button>`).join("")}</div>`}
    <div class="afl">${body}</div>`;
  box.querySelectorAll("[data-afc] span").forEach((s,i)=>s.textContent=C.all[i].label);setTimeout(dressAF,0);
  box.querySelectorAll("[data-afc]").forEach(b=>{const id=b.dataset.afc.split(":")[1];const red=items.filter(it=>it.k==="fam"&&it.f.dom===id&&afFresh(it)==="fr-r").length;if(red)b.insertAdjacentHTML("beforeend",`<i class="afred">${red}</i>`)});
  {const h=document.querySelector("#plusSheet .ps-h b");if(h){let x=0;try{x=xpToday()}catch(e){}h.innerHTML=`Actions <small class="psxp">${window.__dayShift?"pour hier":x+" XP aujourd'hui"}</small><button type="button" class="afday" aria-pressed="${!!window.__dayShift}">Hier</button>`}}
  box.__reg=reg;
  if(afCat&&!q&&afFam){const t=box.querySelector(".aff .afft");if(t)t.textContent=afFam;const up=box.querySelector(".afup");if(up)up.onclick=()=>{afFam="";afAdd=false;renderAF()};
    const fid=box.__fid,CU=()=>{if(!S.g.afCustom||typeof S.g.afCustom!=="object")S.g.afCustom={};return S.g.afCustom[fid]=S.g.afCustom[fid]||[]};
    const ab=box.querySelector(".afadd");if(ab)ab.onclick=()=>{afAdd=true;renderAF();const i=document.querySelector("#actFind .afaddin input");if(i)i.focus()};
    const ai=box.querySelector(".afaddin input"),ao=box.querySelector(".afaddok");if(ai){const go=()=>{const v=ai.value.trim();if(!v){afAdd=false;renderAF();return}const L=CU();if(!L.some(x=>norm(x)===norm(v)))L.push(v.charAt(0).toUpperCase()+v.slice(1));save();afAdd=false;renderAF()};ao.onclick=go;ai.onkeydown=e=>{if(e.key==="Enter")go();if(e.key==="Escape"){afAdd=false;renderAF()}}}
    box.querySelectorAll(".afcux").forEach(b=>{const L=CU(),c=L[+b.dataset.cu];b.innerHTML=ICO("close",12)+" "+esc(c);b.onclick=()=>{L.splice(+b.dataset.cu,1);save();renderAF()}})}
  if(afCat&&!q&&!afFam){const FF=fams(afCat);box.querySelectorAll(".aft").forEach(b=>{const F=FF[+b.dataset.fam];b.querySelector("b").textContent=F.l;b.onclick=ev=>{if(F.its.length===1){const it=F.its[0];if(it.k==="fam"&&it.f.quick){try{uniBurst(b,it.dom)}catch(e){}afDo(it,b,ev,0,[]);b.classList.add("pop");afClose();return}const M=(S.g.afMem||{})[afKey(it)]||{};afSel=it;afWho=[];afDur=0;afAllP=false;afStep=it.k==="fam"&&it.f.nap?"dur":"who";renderAF();return}afFam=F.l;renderAF()}})}
  box.querySelectorAll(".afo:not(.afadd)").forEach((b,i)=>{const[it,lab]=reg[i];b.querySelector("span").textContent=lab;
    b.onclick=ev=>{if(it.k==="fam"&&it.f.quick&&!it.f.who){try{uniBurst(b,it.dom)}catch(e){}afDo(it,b,ev,0,[]);b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop","did");afClose();return}const M=(S.g.afMem||{})[afKey(it)]||{};afSel=it;afWho=[];afDur=0;afAllP=false;afStep=it.k==="fam"&&it.f.nap?"dur":"who";renderAF()}});
  const inp=box.querySelector(".afq");inp.value=afQ;inp.oninput=()=>{afQ=inp.value;const pos=inp.selectionStart;renderAF();const n=document.querySelector("#actFind .afq");if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}};
  const x=box.querySelector(".afx");if(x)x.onclick=()=>{afQ="";renderAF()};
  box.querySelectorAll("[data-afc]").forEach(b=>b.onclick=()=>{afCat=afCat===b.dataset.afc?"":b.dataset.afc;afFam="";afAdd=false;renderAF()});
  const nb=box.querySelector(".afnew");if(nb){const nbB=nb.querySelector("b");if(nbB)nbB.textContent=afQ.trim();nb.onclick=()=>{const name=afQ.trim();try{qcOpen("act")}catch(e){}if(name)setTimeout(()=>{const i=document.querySelector(".qwname");if(i){i.value=name;i.dispatchEvent(new Event("input",{bubbles:true}))}},80)}}}
try{const z=lzState();LZ.forEach(L=>{if(!z.on.includes(L.id))z.on.push(L.id)})}catch(e){}
// ===== Univers visuels : icônes et décors par catégorie
try{void 0;}catch(e){}
const FIC={ranger:["armoire",{Chambre:"lit",Salon:"canape",Cuisine:"casserole","Salle de bain":"bain",Bureau:"ecran","Entrée":"porte",Placard:"armoire",Voiture:"voiture"}],
  nettoyer:["balai",{Sol:"balai",Cuisine:"casserole","Salle de bain":"bain",Toilettes:"wc",Vitres:"fenetre",Frigo:"frigo","Poussière":"plumeau"}],
  linge:["machine",{"Changer les draps":"lit"}],vaisselle:["assiette",{}],mmaison:["poubelle",{"Sortir les poubelles":"poubelle",Courses:"panier","Arroser les plantes":"plante","Réparer un truc":"check"}],armoire:["armoire",{}],
  renfo:["halteres",{}],cardio:["basket",{"Vélo":"velo",Marche:"pas",Natation:"eau"}],souple:["tapis",{}],sportco:["ballon",{}],bouger:["pas",{"Trajet à vélo":"velo"}],
  calme:["medit",{"Pause sans écran":"tel"}],sieste:["sieste",{}],soin:["visage",{Coiffeur:"ciseaux",Bain:"bain",Ongles:"pinceau"}],sante:["sante",{}],ecrire:["note",{}],dehors:["soleil",{Nature:"plante"}],nuit:["lune",{}],
  manger:["pomme",{"Repas équilibré":"repas","Petit-déj complet":"tasse"}],cuisiner:["poele",{}],eau:["eau",{}],sans:["check",{}],
  focus:["ecran",{Dossier:"dossier"}],admin:["enveloppe",{Papiers:"dossier"}],planif:["note",{}],fini:["check",{}],
  lire:["lire",{}],regarder:["clap",{}],jouer:["manette",{}],ecouter:["casque",{}],sorties:["ticket",{Restaurant:"repas",Bar:"tasse",Concert:"casque"}],
  musique:["micro",{"Écrire un texte":"note"}],image:["photo",{}],art:["pinceau",{}],langue:["bulle",{}],cours:["ampoule",{}],
  contact:["tel",{Message:"bulle"}],voir:["tasse",{"Soirée":"coeur"}],service:["coeur",{}]};
const DUNI={maison:{ic:"canape",w:"#3b2b48",f:"#6b4426",fx:"etoile"},sport:{ic:"halteres",w:"#173a5c",f:"#c0602a",fx:"eclair"},soi:{ic:"medit",w:"#1f4248",f:"#2f6a5a",fx:"bulle"},nourriture:{ic:"repas",w:"#4a2a1c",f:"#d8c8a8",fx:"etoile"},
  travail:{ic:"ecran",w:"#141c30",f:"#2a3450",fx:"check"},divert:{ic:"manette",w:"#2a1c4a",f:"#4a2a6a",fx:"etoile"},creer:{ic:"micro",w:"#160f26",f:"#5a1f5a",fx:"notec"},apprendre:{ic:"ampoule",w:"#2a2216",f:"#5a3f22",fx:"ampoule"},proches:{ic:"coeur",w:"#3a1c28",f:"#6a3a2a",fx:"coeur"}};
const uIc=(fid,opt)=>{const F=FIC[fid];if(!F)return"";return(opt&&F[1][opt])||F[0]};
const domOf=key=>{const f=FAM.find(x=>x.id===String(key||"").split(":")[1]);return f?f.dom:""};
const catDom=c=>({maison:"maison",sport:"sport",soi:"soi",nourriture:"nourriture",eau:"nourriture",travail:"travail",perso:"creer",social:"proches",famille:"proches"}[c]||"");
window.rkIc=k=>k&&RKI[k]?rkSvg(k):"";
const decoC={};function decor(dom,small){const U=DUNI[dom];if(!U)return"";const ck=dom+(small?"s":"");if(decoC[ck])return decoC[ck];
  const ics=Object.entries(FIC).filter(([fid])=>{const f=FAM.find(x=>x.id===fid);return f&&f.dom===dom}).map(([,F])=>F[0]).slice(0,4);
  const px=(k,ox,oy,sc)=>{const R=RKI[k];if(!R)return"";let r="";R.forEach((row,y)=>[...row].forEach((ch,x)=>{const c=RKP[ch];if(c&&ch!=="o")r+=`<rect x="${ox+x*sc}" y="${oy+y*sc}" width="${sc}" height="${sc}" fill="${c}"/>`}));return r};
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" shape-rendering="crispEdges" opacity=".16">${px(ics[0],6,8,2)}${px(ics[1]||ics[0],70,26,2)}${px(ics[2]||ics[0],22,74,2)}${px(ics[3]||ics[1]||ics[0],84,88,1.5)}</svg>`;
  return decoC[ck]=small?`url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0/120px 120px repeat,linear-gradient(160deg,${U.w} 0%,${U.w} 70%,${U.f} 140%)`:`url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0/120px 120px repeat,linear-gradient(180deg,${U.w} 0,${U.w} calc(100% - 64px),${U.f} calc(100% - 64px),${U.f} 100%)`}
window.uniDecor=decor;
window.DOMS=DOMS;window.DUNI=DUNI;
// ---- particules propres à chaque univers
function burst(el,dom){try{const U=DUNI[dom]||DUNI.maison,r=el.getBoundingClientRect(),n=7;for(let i=0;i<n;i++){const d=document.createElement("i");d.className="unip";d.innerHTML=rkSvg(U.fx);const a=-Math.PI/2+(Math.random()-.5)*2.2,dist=50+Math.random()*50;
    d.style.cssText=`left:${r.left+r.width/2-9}px;top:${r.top+r.height/2-9}px;--dx:${Math.cos(a)*dist}px;--dy:${Math.sin(a)*dist}px;animation-delay:${i*35}ms`;document.body.appendChild(d);setTimeout(()=>d.remove(),1100)}}catch(e){}}
window.uniBurst=burst;
// ---- habillage du panneau + et des quêtes
function dressAF(){const box=document.getElementById("actFind");if(!box)return;const dom=(afCat||"").split(":")[1]||(afSel&&afSel.dom)||"";
  box.classList.toggle("uni",!!(dom&&DUNI[dom]));box.style.setProperty("--uni",dom&&DUNI[dom]?decor(dom):"none");
  box.querySelectorAll("[data-afc]").forEach(b=>{if(b.querySelector(".uic"))return;const id=b.dataset.afc.split(":")[1],U=DUNI[id];if(!U)return;const sv=b.querySelector("svg");if(sv){const sp=document.createElement("span");sp.className="uic";sp.innerHTML=rkSvg(U.ic);sv.replaceWith(sp)}});
  const FF=(()=>{try{return afCat&&!afFam?FAM.filter(f=>f.dom===afCat.split(":")[1]):[]}catch(e){return[]}})();
  box.querySelectorAll(".aft").forEach((b,i)=>{if(b.querySelector(".uic"))return;const F=FAM.filter(f=>f.dom===(afCat||"").split(":")[1])[+b.dataset.fam];if(!F)return;const sp=document.createElement("span");sp.className="uic";sp.innerHTML=rkSvg(uIc(F.id));b.prepend(sp)});
  const reg=box.__reg||[];box.querySelectorAll(".afo:not(.afadd)").forEach((b,i)=>{if(b.querySelector(".uic"))return;const it=(reg[i]||[])[0];if(!it)return;const k=it.k==="fam"?uIc(it.f.id,it.opt):"";if(!k)return;const sp=document.createElement("span");sp.className="uic";sp.innerHTML=rkSvg(k);b.prepend(sp)});
  const dh=box.querySelector(".afdh");if(dh&&afSel&&!dh.querySelector(".uic")&&afSel.k==="fam"){const sp=document.createElement("span");sp.className="uic big";sp.innerHTML=rkSvg(uIc(afSel.f.id,afSel.opt));dh.querySelector("b").before(sp)}}
function dressQuests(){document.querySelectorAll("#sqBox .sq,#fqBox .fqr").forEach(c=>{if(c.dataset.uni)return;const t=(c.querySelector(".sqn,.fqt b")||{}).textContent||"";if(!t)return;c.dataset.uni=1;
    const k=afMatch(t);let dom=k?domOf(k):"",ic=k?uIc(k.split(":")[1],k.split(":")[2]):"";
    if(!dom){const q=(S.specials||[]).find(x=>x.name===t);if(q){dom=q.who||q.bd||q.grp==="friends"||q.fg?"proches":catDom(q.cat)}}
    if(!dom&&c.classList.contains("fqr")){try{const x=fqList()[+c.dataset.i];if(x){dom=x.k==="arc"&&x.p?catDom(x.p.cat||x.cat):catDom(x.cat)}}catch(e){}}
    if(!dom)return;if(!ic)ic=(DUNI[dom]||{}).ic;c.classList.add("unicard");c.style.setProperty("--uni",decor(dom,1));c.style.setProperty("--uc",(DUNI[dom]||{}).f||"var(--gold)");
    if(ic&&!c.querySelector(".uiq")){const sp=document.createElement("span");sp.className="uiq";sp.innerHTML=rkSvg(ic);c.appendChild(sp)}})}
// ---- la scène : une bulle avec l'objet de ta dernière action
let bubK="";function sceneBubble(){const sc=document.querySelector("#sceneBox .scn");if(!sc)return;const L=(S.log||[]).slice().reverse().find(e=>e.af&&Date.now()-e.t<3*36e5);const k=L?uIc(L.af.split(":")[1],L.af.split(":")[2]):"";
  let b=sc.querySelector(".scbub");if(!k){if(b)b.remove();bubK="";return}if(b&&bubK===k+L.t)return;bubK=k+L.t;if(!b){b=document.createElement("span");b.className="scbub";sc.appendChild(b)}b.innerHTML=rkSvg(k);b.title=L.name}
// ===== Tout relié : un seul journal
const ROOT=t=>norm(t).replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>3).map(w=>w.replace(/(s|x)$/,""));
const AF_OVR=[[/coiff/,"soin","Coiffeur"],[/dentist/,"sante","Dentiste"],[/medecin|docteur|generaliste/,"sante","Médecin"],[/cinema|\bcine\b/,"sorties","Cinéma"],[/concert/,"sorties","Concert"],[/musee|expo\b/,"sorties","Musée ou expo"],[/theatre/,"sorties","Théâtre"],[/frigo/,"nettoyer","Frigo"],[/ongles/,"soin","Ongles"],[/\blit\b/,"ranger","Chambre"],[/lessive|machine a laver/,"linge","Lancer une machine"],[/draps/,"linge","Changer les draps"],[/vaisselle/,"vaisselle","Laver"],[/etirement/,"souple","Étirements"],[/mediter|meditation/,"calme","Méditer"],[/\b(lire|lecture)\b|pages? de|livre/,"lire","Livre"],[/\bfilm\b/,"regarder","Film"],[/episode/,"regarder","Épisode"],[/repas maison|cuisiner/,"cuisiner","Repas maison"],[/nouveau plat/,"cuisiner","Nouveau plat"],[/\bmails?\b/,"admin","Mails"],[/marche/,"cardio","Marche"],[/\bcourir|course\b/,"cardio","Course"],[/velo/,"cardio","Vélo"],[/pompe/,"renfo","Pompes"],[/squat/,"renfo","Squats"],[/gainage/,"renfo","Gainage"],[/masque/,"soin","Masque"],[/sieste/,"sieste","Sieste"],[/candidature/,"focus","Candidature"],[/\bson\b|morceau|couplet/,"musique","Faire du son"],[/balade|dehors|soleil/,"dehors","Balade"]];
try{const L=(S.g||{}).afLast;if(L&&L["af:soin:Coiffure"]&&!L["af:soin:Coiffeur"]){L["af:soin:Coiffeur"]=L["af:soin:Coiffure"];delete L["af:soin:Coiffure"]}}catch(e){}
window.afMatch=function(name){const n=norm(name);if(!n)return"";for(const[re,fid,opt]of AF_OVR)if(re.test(n))return"af:"+fid+":"+opt;
  const W=ROOT(name);let best="",bs=0;FAM.forEach(f=>{const fr=ROOT(f.l);[...f.o,...(((S.g||{}).afCustom||{})[f.id]||[])].forEach(o=>{const lab=Array.isArray(o)?o[0]:o,or=ROOT(lab);let sc=0;or.forEach(w=>{if(W.includes(w))sc+=2});if(sc&&fr.some(w=>W.includes(w)))sc+=2;if(sc>bs){bs=sc;best="af:"+f.id+":"+lab}})});return bs>=4?best:""};
// quêtes reliées : une action peut valider une quête ouverte
function autoQuest(e){const L=(S.specials||[]).filter(q=>q.sm&&!q.eod);if(!L.length)return;let hit=null;
  if(e.af)hit=L.find(q=>q.afk&&q.afk===e.af);
  if(!hit&&e.withp)hit=L.find(q=>q.who&&e.withp.includes(q.who));
  if(!hit&&e.af){const fid=e.af.split(":")[1];hit=L.find(q=>!q.who&&!q.afk&&afMatch(q.name)&&afMatch(q.name).split(":")[1]===fid)}
  if(!hit)return;S.specials=S.specials.filter(q=>q!==hit);const g=S.g;if(!Array.isArray(g.smHist))g.smHist=[];g.smHist.push({n:hit.name,t:Date.now()});
  try{addBonus("Quête accomplie : "+hit.name,hit.xp,0,"autoq")}catch(err){}setTimeout(()=>{try{toast(`Quête accomplie au passage : <span class="p">${esc(hit.name)}</span> +${hit.xp} XP`);renderSpecials()}catch(err){}},1300)}

// ===== Habitudes apprises
const JRS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function habits(){const now=Date.now(),wd=new Date().getDay(),tk=dayKey(now),H={},P={};
  (S.log||[]).forEach(e=>{if(now-e.t>70*864e5)return;const k=e.af||(String(e.a||"").startsWith("af:")?e.a:"");const d=new Date(e.t).getDay();
    if(k){const o=H[k]=H[k]||{n:0,wd:{},hr:[],last:0,name:e.name};o.n++;o.wd[d]=(o.wd[d]||0)+1;o.hr.push(new Date(e.t).getHours());o.last=Math.max(o.last,e.t)}
    (e.withp||[]).forEach(p=>{const o=P[p]=P[p]||{wd:{},last:0};o.wd[d]=(o.wd[d]||0)+1;o.last=Math.max(o.last,e.t)})});
  return{H,P,wd,tk}}
window.__habits=habits;
function habitQuests(add){const{H,P,wd,tk}=habits(),h=new Date().getHours();
  Object.entries(H).forEach(([k,o])=>{const c=o.wd[wd]||0;if(c<2||dayKey(o.last)===tk)return;const[,fid,opt]=k.split(":"),f=FAM.find(x=>x.id===fid);if(!f||f.who||f.quick)return;const avgH=o.hr.reduce((a,b)=>a+b,0)/o.hr.length;if(Math.abs(avgH-h)>6)return;
    add({name:f.l+" · "+opt,cat:f.cat,xp:f.xp+10,why:"Souvent le "+JRS[wd],sc:5.2+c*.3,afk:k})});
  let bp=null;Object.entries(P).forEach(([p,o])=>{const c=o.wd[wd]||0;if(c>=2&&dayKey(o.last)!==tk&&(!bp||c>bp.c))bp={p,c}});
  if(bp){let fam=false;try{fam=isFam(bp.p)}catch(e){}add({name:"Voir ou appeler "+bp.p,cat:fam?"famille":"social",xp:20,why:"Souvent le "+JRS[wd],sc:5.6,who:bp.p})}}
// ordre des « habituelles » : ce que tu fais d'habitude à ce moment-là
window.habitRank=function(key){const{H,wd}=habits(),o=H[key];if(!o)return 0;const h=new Date().getHours(),avg=o.hr.reduce((a,b)=>a+b,0)/o.hr.length;return o.n+(o.wd[wd]||0)*3+Math.max(0,4-Math.abs(avg-h))}
// ===== Quêtes spéciales intelligentes
const GOALQ={forme:[["30 min de marche","sport",25],["20 pompes, 20 squats, 1 min de gainage","sport",20]],sommeil:[["@bed"]],ecrans:[["Poser le téléphone dans une autre pièce pendant 1 h","soi",15]],manger:[["Cuisiner un repas maison avec un légume","nourriture",20]],chez:[["@room"]],argent:[["Noter tes dépenses de la semaine","travail",15]],apprendre:[["Regarder un tuto de 20 min et le refaire","soi",20]],moral:[["15 min dehors sans écouteurs","soi",15]],job:[["Envoyer une candidature","travail",25]],son:[["30 min sur un morceau en cours","perso",25]]};

// ---- ciel et nature
function sunSet(d){const r=Math.PI/180,lat=43.6,lon=3.88,J=d.getTime()/864e5+2440587.5,n=Math.round(J-2451545),Js=n-lon/360,M=(357.5291+0.98560028*Js)%360,C=1.9148*Math.sin(M*r)+0.02*Math.sin(2*M*r)+0.0003*Math.sin(3*M*r),L=(M+C+282.9372)%360,Jt=2451545+Js+0.0053*Math.sin(M*r)-0.0069*Math.sin(2*L*r),sd=Math.sin(L*r)*Math.sin(23.44*r),cd=Math.cos(Math.asin(sd)),w=Math.acos((Math.sin(-0.833*r)-Math.sin(lat*r)*sd)/(Math.cos(lat*r)*cd))/r;
  const ms=j=>new Date((j-2440587.5)*864e5);return{rise:ms(Jt-w/360),set:ms(Jt+w/360)}}
const hm=d=>d.getHours()+"h"+String(d.getMinutes()).padStart(2,"0");
const METEOR=[[1,2,4,"Quadrantides"],[4,21,23,"Lyrides"],[5,5,7,"Êta Aquarides"],[8,10,14,"Perséides"],[10,20,23,"Orionides"],[11,16,18,"Léonides"],[12,12,15,"Géminides"]];
const SOL={"3-20":["Le printemps commence : repérer 3 arbres en fleurs","Équinoxe de printemps","leaf"],"6-21":["Jour le plus long : dîner ou marcher dehors après 21h","Solstice d'été","sun"],"9-22":["L'automne commence : 20 min en forêt ou au parc","Équinoxe d'automne","leaf"],"12-21":["Jour le plus court : 20 min dehors avant 14h","Solstice d'hiver","sun"]};
const PROD=[0,["du poireau","des oranges","des endives"],["du chou","du poireau","des pommes"],["des épinards","des radis","du poireau"],["des asperges","des radis","des petits pois"],["des fraises","des asperges","des courgettes"],["des cerises","des tomates","des courgettes"],["des pêches","du melon","des tomates"],["des aubergines","des figues","des poivrons"],["du raisin","des figues","des poivrons"],["de la courge","des champignons","des pommes"],["des châtaignes","du poireau","des poires"],["des clémentines","du chou","de la mâche"]];
const MOIS1=["","janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const NATM=[0,"Marcher 20 min au soleil d'hiver","Repérer les premiers bourgeons en balade","Trouver les premières fleurs en balade","Pique-nique ou repas dehors","Lire 20 min dans un parc","Marcher pieds nus dans l'herbe 5 min","Un bain de mer ou de lac","Dîner dehors à la fraîche","Cueillir des mûres ou des figues en balade","Ramasser des châtaignes ou des feuilles rouges en balade","Balade en forêt pour les couleurs d'automne","Aller voir les illuminations en ville"];
function natQuests(add,wx,h){const t=new Date(),m=t.getMonth()+1,d=t.getDate(),wet=wx&&["rain","storm","snow"].includes(wx.k),we=isWeekend();
  // lune
  const age=((t-Date.UTC(2000,0,6,18,14))/864e5)%29.530588853;
  if(Math.abs(age-14.77)<1.3&&!wet&&h>=16)add({name:"15 min de balade de nuit sous la pleine lune",cat:"sport",xp:20,why:"Pleine lune",sc:5.2,nat:"moon"});
  else if((age<1.3||age>28.2)&&!wet&&h>=17)add({name:"Éteindre les lumières et regarder les étoiles 10 min",cat:"soi",xp:15,why:"Nuit sans lune",sc:4.2,nat:"star"});
  // étoiles filantes
  const mt=METEOR.find(x=>x[0]===m&&d>=x[1]&&d<=x[2]);if(mt&&!wet&&h>=15)add({name:"Chercher des étoiles filantes 15 min après 23h",cat:"soi",xp:25,why:mt[3]+" cette nuit",sc:5.6,nat:"meteor"});
  // coucher de soleil
  try{const st=sunSet(t).set,dh=(st-t)/36e5;if(dh>0.25&&dh<3&&!wet)add({name:"Regarder le coucher de soleil à "+hm(st),cat:"soi",xp:15,why:"Ce soir",sc:4.6,nat:"sun"})}catch(e){}
  // solstices et équinoxes
  const so=SOL[m+"-"+d];if(so&&!(m===12&&h>=13))add({name:so[0],cat:"soi",xp:30,why:so[1],sc:6,nat:so[2]});
  // de saison
  {const P=PROD[m],p=P[Math.floor(t/864e5)%P.length];add({name:"Cuisiner avec "+p,cat:"nourriture",xp:20,why:"De saison en "+MOIS1[m],sc:4.1,nat:"leaf"})}
  if(!wet&&(we||d%2===0)&&!inWork(h))add({name:NATM[m],cat:"sport",xp:25,why:"En "+MOIS1[m],sc:we?4.4:3.6,nat:"leaf"});
  if(wx&&wx.k==="snow")add({name:"Sortir 10 min voir la neige",cat:"sport",xp:20,why:"Il neige",sc:6.5,nat:"snow"});
  if(wx&&wx.k==="storm"&&h>=19)add({name:"Regarder l'orage depuis la fenêtre, lumières éteintes",cat:"soi",xp:10,why:"Orage ce soir",sc:3.5,nat:"star"})}
const NATV={moon:["linear-gradient(160deg,#121a46,#2c2f72)","#f5e6a8",'<circle cx="12" cy="12" r="8" fill="#f5e6a8"/><circle cx="9" cy="10" r="1.6" fill="#d8c784"/><circle cx="14.5" cy="14" r="2.2" fill="#d8c784"/><circle cx="14" cy="8" r="1" fill="#d8c784"/>'],
  star:["linear-gradient(160deg,#0d1236,#24275e)","#cfd8ff",'<path d="M12 3l2 6 6 .4-4.8 3.8 1.7 6L12 15.6 7.1 19.2l1.7-6L4 9.4l6-.4z" fill="#ffe27a"/>'],
  meteor:["linear-gradient(160deg,#0d1236,#2b2266)","#ffd56b",'<path d="M3 4l11 9" stroke="#ffd56b" stroke-width="2" stroke-linecap="round" opacity=".5"/><path d="M6 3l10 10" stroke="#fff3c4" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><circle cx="17" cy="15" r="3.4" fill="#fff6d6"/>'],
  sun:["linear-gradient(170deg,#ff9d55,#d14d6e 60%,#4a2f7a)","#ffd36b",'<circle cx="12" cy="15" r="6" fill="#ffd36b"/><rect x="2" y="15" width="20" height="7" fill="#7a3a6e"/><path d="M12 4v3M5 8l2 2M19 8l-2 2" stroke="#ffd36b" stroke-width="2" stroke-linecap="round"/>'],
  leaf:["linear-gradient(160deg,#c9772e,#7d4a1f 55%,#3e5a2a)","#ffb35c",'<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z" fill="#e8873a"/><path d="M5 19L15 9" stroke="#8a3f12" stroke-width="1.6"/>'],
  snow:["linear-gradient(160deg,#5d7fb8,#9bb7e0)","#ffffff",'<path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9" stroke="#fff" stroke-width="2" stroke-linecap="round"/>']};
const STARS="radial-gradient(1.2px 1.2px at 22% 30%,#fff 60%,transparent),radial-gradient(1px 1px at 48% 68%,#fff 60%,transparent),radial-gradient(1.4px 1.4px at 72% 22%,#fff 60%,transparent),radial-gradient(1px 1px at 86% 58%,#fff 60%,transparent),radial-gradient(1px 1px at 35% 82%,#fff 60%,transparent),radial-gradient(1.2px 1.2px at 62% 44%,#fff8 60%,transparent)";
function natDress(){document.querySelectorAll("#sqBox .sq").forEach(c=>{if(c.dataset.uni)return;const t=(c.querySelector(".sqn")||{}).textContent||"";const q=t&&(S.specials||[]).find(x=>x.name===t&&x.nat);if(!q)return;const V=NATV[q.nat];if(!V)return;c.dataset.uni=1;
    c.classList.add("unicard","natq","nat-"+q.nat);c.style.setProperty("--uni",(["moon","star","meteor"].includes(q.nat)?STARS+",":"")+V[0]);c.style.setProperty("--uc",V[1]);
    if(!c.querySelector(".uiq")){const sp=document.createElement("span");sp.className="uiq";sp.innerHTML=rkSvg({moon:"lune",star:"etoile",meteor:"etoile",sun:"soleil",leaf:/^Cuisiner/i.test(t)?"courge":"plante",snow:"flocon"}[q.nat]||"etoile");c.appendChild(sp)}})}
// ---- quête spéciale : idée de sortie (plusieurs propositions)
// [nom, quand (s=soir, j=journée, w=week-end seulement), dedans(1)/dehors(0), xp, option d'action, icône]
const IDQ=[
  ["Une jam session ouverte dans un bar","s",1,35,"Jam session","mus"],["Une scène ouverte de stand-up, en spectateur","s",1,30,"Stand-up","mic"],
  ["Une soirée quiz ou blind test dans un bar","s",1,30,"Soirée quiz","q"],["La dernière séance d'un film en VO","s",1,25,"Cinéma","cine"],
  ["Un vieux film culte au ciné-club ou en rétrospective","s",1,30,"Cinéma","cine"],["Le concert d'un groupe local que tu ne connais pas","s",1,35,"Concert","mus"],
  ["Un karaoké avec des potes","s",1,30,"Karaoké","mic"],["Un bar à jeux : tester un jeu de société inconnu","s",1,30,"Bar à jeux","dice"],
  ["Un match d'impro théâtrale","s",1,30,"Théâtre","mask"],["Du jazz dans une cave ou un petit bar","s",1,30,"Concert","mus"],
  ["Un escape game à deux ou plus","sj",1,35,"Escape game","key"],["Bowling ou billard, la revanche","sj",1,25,"Bowling ou billard","dice"],
  ["Une soirée slam ou lecture en librairie","s",1,30,"Scène ouverte","mic"],["Un cours d'essai de salsa ou de danse","s",1,35,"Cours d'essai","mus"],
  ["Une salle d'arcade ou des flippers","sj",1,25,"Arcade","dice"],["Un marché nocturne ou un food market","s",0,25,"Marché","food"],
  ["Une brocante ou un vide-grenier","w",0,25,"Brocante","bag"],["Chiner un vinyle à moins de 5 € chez un disquaire","j",1,25,"Disquaire","mus"],
  ["Une friperie : une tenue complète à moins de 20 €","j",1,25,"Friperie","bag"],["Une expo dans une petite galerie gratuite","j",1,25,"Musée ou expo","art"],
  ["Un atelier d'initiation : poterie, sérigraphie ou cuisine","w",1,40,"Atelier","art"],["Une séance découverte en salle d'escalade","j",1,35,"Escalade","run"],
  ["Louer un kayak ou un paddle","w",0,40,"Kayak ou paddle","run"],["Un restaurant d'une cuisine jamais goûtée (éthiopienne, géorgienne…)","js",1,30,"Restaurant","food"],
  ["Prendre un train régional vers une ville à moins d'une heure","w",0,45,"Excursion","map"],["Une visite guidée de ta propre ville","w",0,35,"Visite guidée","map"],
  ["Un match de sport amateur du coin (rugby, hand, foot)","w",0,25,"Match","run"],["Le planétarium ou une soirée d'observation des étoiles","s",1,35,"Planétarium","q"],
  ["Accrobranche ou trampoline park","w",0,35,"Accrobranche","run"],["Un festival ou une fête de quartier ce week-end","w",0,35,"Festival","mus"],
  ["La bibliothèque : un livre pris au hasard dans un rayon inconnu","j",1,20,"Bibliothèque","q"],["Un concert classique ou d'orgue gratuit dans une église","js",1,30,"Concert","mus"]];
const IDI={mus:'<path d="M9 18V6l10-2v12" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="7" cy="18" r="2.6" fill="#fff"/><circle cx="17" cy="16" r="2.6" fill="#fff"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3" fill="#fff"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="#fff" stroke-width="2"/>',
  q:'<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 16.5v.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',cine:'<rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="#fff" stroke-width="2"/><path d="M10 9.5v6l5-3z" fill="#fff"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="#fff" stroke-width="2"/><circle cx="9" cy="9" r="1.5" fill="#fff"/><circle cx="15" cy="15" r="1.5" fill="#fff"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>',mask:'<path d="M4 5h16v6a8 8 0 0 1-16 0z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="9" cy="10" r="1.4" fill="#fff"/><circle cx="15" cy="10" r="1.4" fill="#fff"/><path d="M9 14q3 2.5 6 0" fill="none" stroke="#fff" stroke-width="2"/>',
  key:'<circle cx="8" cy="12" r="4" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 12h9M18 12v3M21 12v2" stroke="#fff" stroke-width="2"/>',food:'<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8" fill="none" stroke="#fff" stroke-width="2"/>',
  bag:'<path d="M5 8h14l-1 13H6z" fill="none" stroke="#fff" stroke-width="2"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="#fff" stroke-width="2"/>',art:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 3 0 4-1 3-2 3-4a9 9 0 0 0-9-8z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="8" cy="10" r="1.4" fill="#fff"/><circle cx="12" cy="7" r="1.4" fill="#fff"/><circle cx="16" cy="10" r="1.4" fill="#fff"/>',
  run:'<circle cx="14" cy="4.5" r="2" fill="#fff"/><path d="M6 21l3-6 3 2v4M9 15l2-6 4 3 3-1M11 9L7 11" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="none" stroke="#fff" stroke-width="2"/><path d="M9 4v14M15 6v14" stroke="#fff" stroke-width="2"/>'};
const idSvg=k=>'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">'+(IDI[k]||IDI.q)+'</svg>';
function cIdPick(n){const g=S.g,h=dayH(),we=isWeekend();let wx=null;try{wx=wxNow()}catch(e){}const wet=wx&&["rain","storm","snow"].includes(wx.k),H=(g.idqH||[]);
  const ok=x=>(x[1].includes("w")?we:true)&&(x[1].includes("s")&&h>=15||x[1].includes("j")&&h<18||x[1]==="w"&&h<17)&&(!wet||x[2]);
  let L=IDQ.map((x,i)=>i).filter(i=>ok(IDQ[i]));if(L.length<n)L=IDQ.map((x,i)=>i).filter(i=>!wet||IDQ[i][2]);
  const fresh=L.filter(i=>!H.includes(i)),P=(fresh.length>=n?fresh:L).sort(()=>Math.random()-.5),out=[];
  for(const i of P){if(out.length>=n)break;if(out.some(j=>IDQ[j][4]===IDQ[i][4]))continue;out.push(i)}return out}
function idqCard(){const tr=document.getElementById("sqTrack");if(!tr)return;const g=S.g;if(!g)return;const tk=dayKey(Date.now());
  if(!g.idq||g.idq.d!==tk){g.idq={d:tk,o:cIdPick(1),p:null,ok:0};try{save()}catch(e){}}const Q=g.idq;let c=tr.querySelector(".idq");
  if(Q.ok){if(c)c.remove();return}const sig=Q.o.join(",")+"|"+Q.p;if(c&&c.dataset.sig===sig&&c===tr.firstElementChild)return;
  if(!c){c=document.createElement("div");c.className="sq idq"}c.dataset.sig=sig;if(c!==tr.firstElementChild){const z=tr.scrollLeft<12;tr.prepend(c);if(z)tr.scrollLeft=0}const we=isWeekend(),h=dayH(),when=h>=15?"Ce soir":we?"Ce week-end":"Aujourd'hui";
  if(Q.p==null)Q.p=Q.o[0];const x=IDQ[Q.p];
  c.innerHTML=`<span class="sqk">${idSvg(x[5])}<span>Idée sortie · ${when}</span></span><span class="sqn">${esc(x[0])}</span><span class="sqr"><button class="btn primary idqf" type="button">Fait</button><button type="button" class="idqr" aria-label="Une autre idée">${ICO("refresh",16)}<span>Une autre</span></button></span>`;
  c.querySelector(".idqr").onclick=()=>{g.idqH=[...(g.idqH||[]),Q.p].slice(-24);Q.o=cIdPick(1);Q.p=Q.o[0];save();idqCard()};
  c.querySelector(".idqf").onclick=e=>{const prev=levelInfo(S.xp).l;Q.ok=1;g.idqH=[...(g.idqH||[]),Q.p].slice(-24);if(!g.afLast)g.afLast={};g.afLast["af:sorties:"+x[4]]=Date.now();
    try{uniBurst(e.currentTarget,"divert")}catch(_){}addBonus("Sortie : "+x[0],x[3],0,"idq");save();try{toast(`Belle sortie <span class="p">+${x[3]} XP</span>`)}catch(_){}setTimeout(()=>{try{render(prev)}catch(_){}idqCard()},600)}}

// ---- anniversaires : fond de fête
try{RKI.cake=["................", "....y...y...y...", "...yY..yY..yY...", "...mm..bb..gg...", "...wm..wb..wg...", "...mm..bb..gg...", ".oooooooooooooo.", ".owwwwbwwwwwgwo.", ".owrwvwwwywrwwo.", ".owwmwwmwwmwwmo.", ".ommmmmmmmmmmmo.", ".oyyyyyyyyyyyyo.", ".ommmmmmmmmmmmo.", ".oMMMMMMMMMMMMo.", "kkkkkkkkkkkkkkkk", ".KKKKKKKKKKKKKK."]}catch(e){}
const BDCAKE0='<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><rect x="4" y="12" width="16" height="9" rx="2" fill="#fff"/><path d="M4 15.5q2 1.6 4 0t4 0 4 0 4 0" fill="none" stroke="#ff5fa2" stroke-width="1.8"/><rect x="7" y="8" width="2" height="4" fill="#ffd56b"/><rect x="11" y="8" width="2" height="4" fill="#7fe0ff"/><rect x="15" y="8" width="2" height="4" fill="#b8ff8a"/><path d="M8 4.5q1 1.4 0 2.6q-1-1.2 0-2.6M12 4.5q1 1.4 0 2.6q-1-1.2 0-2.6M16 4.5q1 1.4 0 2.6q-1-1.2 0-2.6" fill="#ffb347"/></svg>';
const BDCAKE=(()=>{try{return rkSvg("cake")}catch(e){return BDCAKE0}})();window.BDCAKE=BDCAKE;
const BDBG=(()=>{const C=["#ffd56b","#7fe0ff","#b8ff8a","#ffffff","#ff9de2","#ffb347"],P=[];let r=7;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};
  for(let i=0;i<22;i++){const x=(rnd()*120).toFixed(1),y=(rnd()*120).toFixed(1),c=C[i%C.length],a=Math.round(rnd()*180);P.push(i%3?`<rect x="${x}" y="${y}" width="5" height="2.4" rx="1" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`:`<circle cx="${x}" cy="${y}" r="1.6" fill="${c}"/>`)}
  const conf="url(\"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" opacity=".8">${P.join("")}</svg>`)+"\")";
  const F=["#ffd56b","#7fe0ff","#b8ff8a","#ff9de2"];const fl="url(\"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="22"><path d="M0 2q48 10 96 0" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>${F.map((c,i)=>{const x=i*24+4;const y=2+10*Math.sin(Math.PI*(x+8)/96)*.8;return `<path d="M${x} ${y.toFixed(1)}l16 0-8 12z" fill="${c}"/>`}).join("")}</svg>`)+"\")";
  return{conf,fl,grad:"linear-gradient(150deg,#ff4f9a,#b44be0 55%,#5b3bd6)"}})();
window.bdConf=bdConf;
function bdConf(el){const r=el.getBoundingClientRect(),C=["#ffd56b","#7fe0ff","#b8ff8a","#fff","#ff9de2","#ffb347"];for(let i=0;i<26;i++){const d=document.createElement("i");d.className="bdcf";d.style.left=(r.left+r.width*Math.random())+"px";d.style.top=(r.top+r.height*.3)+"px";d.style.background=C[i%C.length];
    d.style.setProperty("--dx",(Math.random()-.5)*160+"px");d.style.setProperty("--dy",(-60-Math.random()*90)+"px");d.style.setProperty("--rt",(Math.random()*720-360)+"deg");document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}}
function bdDress(){document.querySelectorAll("#sqBox .sq:not(.bdq)").forEach(c=>{const t=(c.querySelector(".sqn")||{}).textContent||"";const q=t&&(S.specials||[]).find(x=>x.name===t);if(!q||!(q.bd||/anniversaire/i.test(q.name)))return;c.dataset.uni=1;c.classList.remove("unicard");c.classList.add("bdq");c.querySelectorAll(".uiq").forEach(x=>x.remove());{const k=c.querySelector(".sqk svg");if(k)k.outerHTML='<span class="bdk">'+BDCAKE+'</span>'}if(!c.querySelector(".bdav")){const w=q.bd||q.who||(relNames().find(n=>t.includes(n))||"");const sp=document.createElement("span");sp.className="bdav";sp.innerHTML=(w?pAv(w,"bdp"):"")+'<span class="bdck">'+BDCAKE+'</span>';c.appendChild(sp)}});
  document.querySelectorAll("#fqBox .fqr:not(.bdq)").forEach(c=>{const w=(c.querySelector(".fqw")||{}).textContent||"",t=(c.querySelector(".fqt b")||{}).textContent||"";if(!/anniversaire/i.test(w+" "+t))return;c.dataset.uni=1;c.classList.remove("unicard");c.classList.add("bdq");c.querySelectorAll(".uiq").forEach(x=>x.remove());const wn=relNames().find(n=>t.includes(n));if(wn&&!c.querySelector(".bdav")){const sp=document.createElement("span");sp.className="bdav";sp.innerHTML=pAv(wn,"bdp")+'<span class="bdck">'+BDCAKE+'</span>';c.querySelector(".fqa")?c.querySelector(".fqa").before(sp):c.appendChild(sp)}});
  const r=document.documentElement;if(!r.style.getPropertyValue("--bdconf")){r.style.setProperty("--bdconf",BDBG.conf);r.style.setProperty("--bdfl",BDBG.fl);r.style.setProperty("--bdgrad",BDBG.grad)}
  // jour J : confettis une fois à l'ouverture
  try{const g=S.g,tk=dayKey(Date.now()),el=document.querySelector("#evToday .bd0");if(el&&el.offsetHeight&&(g.bdSeen||"")!==tk){g.bdSeen=tk;save();setTimeout(()=>bdConf(el),600)}}catch(e){}}
// Atelier de création : choisir une action avec la même recherche
function qwTpl(kind,dom){const out=[];try{const doms=dom?[dom]:Object.keys(QC_TPL);doms.forEach(d=>(QC_TPL[d]||[]).forEach(t=>{if(t[1]===kind&&!out.some(x=>x.name===t[0]))out.push({name:t[0],cat:d,k:"tpl"})}))}catch(e){}return out}
function qwFind(inp){const kind=/Courir/.test(inp.placeholder)?"act":"";if(!kind)return;
  let box=inp.parentNode.querySelector(".qwfind");if(!box){box=document.createElement("div");box.className="qwfind";const h=inp.parentNode.querySelector(".qwhint")||inp;h.after(box);box.__cat="";inp.addEventListener("input",()=>draw())}
  const draw=()=>{const q=norm(inp.value).trim(),cats=[{id:"",label:"Idées",c:"var(--gold)",ic:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/>'},...afCats().all];
    const acts=afItems();let L;
    if(q)L=[...qwTpl(kind),...acts].filter(it=>norm(it.name).includes(q));
    else if(!box.__cat)L=qwTpl(kind).slice(0,12);
    else{const id=box.__cat.split(":")[1],dc=(DOMS.find(d=>d[0]===id)||[])[4];L=[...(["divert","creer","apprendre","proches"].includes(id)?[]:qwTpl(kind,dc)),...acts.filter(it=>it.dom===id)]}
    const seen=new Set();L=L.filter(it=>{const k=norm(it.name);if(seen.has(k))return false;seen.add(k);return true}).slice(0,30);
    box.innerHTML=`${q?"":`<div class="afc">${cats.map(c=>`<button type="button" data-qwc="${c.id}" aria-pressed="${box.__cat===c.id}" style="--cc:${c.c}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.ic}</svg><span></span></button>`).join("")}</div>`}<div class="afl">${L.length?L.map(it=>`<button type="button" class="afr" style="--ac:${(CATS[it.cat]||{}).c||"var(--gold)"}"><span class="afn"></span><span class="afgo">Choisir</span></button>`).join(""):`<small class="afh">Rien de trouvé : garde ton nom et touche Suivant.</small>`}</div>`;
    box.querySelectorAll("[data-qwc] span").forEach((s,i)=>s.textContent=cats[i].label);box.querySelectorAll(".afr .afn").forEach((s,i)=>s.textContent=L[i].name);
    box.querySelectorAll("[data-qwc]").forEach(b=>b.onclick=()=>{box.__cat=box.__cat===b.dataset.qwc?"":b.dataset.qwc;draw()});
    box.querySelectorAll(".afr").forEach((b,i)=>b.onclick=()=>{inp.value=L[i].name;inp.dispatchEvent(new Event("input",{bubbles:true}));inp.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))})};
  draw()}
try{new MutationObserver(()=>{document.querySelectorAll(".qwname").forEach(i=>{if(!i.__qf){i.__qf=1;try{qwFind(i)}catch(e){}}})}).observe(document.body,{childList:true,subtree:true})}catch(e){}
// ===== Ergonomie : réglages là où vivent les choses
function pop(anchor,items,title){document.querySelectorAll(".epop").forEach(x=>x.remove());const r=anchor.getBoundingClientRect(),p=document.createElement("div");p.className="epop";p.setAttribute("role","menu");
  p.innerHTML=(title?`<b class="eph"></b>`:"")+items.map((it,i)=>`<button type="button" role="menuitem" data-i="${i}"${it.on?' aria-pressed="true"':""}>${it.l}</button>`).join("");
  if(title)p.querySelector(".eph").textContent=title;document.body.appendChild(p);const w=p.offsetWidth,h=p.offsetHeight;
  let x=Math.min(Math.max(10,r.left+r.width/2-w/2),innerWidth-w-10),y=r.bottom+8;if(y+h>innerHeight-10)y=Math.max(10,r.top-h-8);p.style.left=x+"px";p.style.top=y+"px";
  p.querySelectorAll("[data-i]").forEach(b=>b.onclick=e=>{e.stopPropagation();p.remove();try{items[+b.dataset.i].f()}catch(err){}});
  setTimeout(()=>{const off=e=>{if(!p.contains(e.target)){p.remove();document.removeEventListener("pointerdown",off,true)}};document.addEventListener("pointerdown",off,true)},0)}
function hold(sel,fn,ms){let t=0,el=null,fired=false;document.addEventListener("pointerdown",e=>{const x=e.target.closest&&e.target.closest(sel);if(!x)return;el=x;fired=false;clearTimeout(t);t=setTimeout(()=>{fired=true;try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}fn(el,e)},ms||500)},true);
  ["pointerup","pointercancel","pointermove"].forEach(n=>document.addEventListener(n,e=>{if(n==="pointermove"&&el&&Math.abs(e.movementY)+Math.abs(e.movementX)<4)return;clearTimeout(t)},true));
  window.addEventListener("click",e=>{if(fired&&e.target.closest&&e.target.closest(sel)){e.preventDefault();e.stopImmediatePropagation();fired=false}},true);
  document.addEventListener("contextmenu",e=>{if(e.target.closest&&e.target.closest(sel))e.preventDefault()},true)}
hold("#actFind .afo",(b)=>{const box=document.getElementById("actFind"),i=[...box.querySelectorAll(".afo")].indexOf(b),r=box.__reg&&box.__reg[i];if(!r)return;try{uniBurst(b,r[0].dom)}catch(e){}afDo(r[0],b,{currentTarget:b,clientX:0,clientY:0},0,[]);b.classList.add("pop","did");afClose()},450);
// bouton flottant
{const f=document.createElement("button");f.type="button";f.id="afFab";f.dataset.v="q";f.setAttribute("aria-label","Noter une action");f.innerHTML='<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';f.onclick=()=>{const b=document.querySelector("#plusBox .plusb");if(b&&!document.documentElement.classList.contains("plusopen"))b.click()};document.body.appendChild(f);try{f.hidden=view!=="q"}catch(e){}}
// 1. Rituels : appui long sur une tuile
hold("#dqBox .rtile",(b)=>{const n=(b.querySelector(".rtn")||{}).textContent;const t=ritTasks().find(x=>x.name===n);if(!t)return;
  pop(b,[{l:ICO("star",14)+(t.core?" Retirer des essentiels":" Mettre dans mes essentiels"),f:()=>{t.core=!t.core;try{ritCoreCheck()}catch(e){}save();render()}},
    {l:"Mettre en pause",f:()=>{t.pz=dayKey(Date.now());save();render();toast("Rituel en pause")}},
    {l:ICO("edit",14)+" Modifier (moment, rythme…)",f:()=>{try{qcOpen("rit",{edit:t,done:()=>render()})}catch(e){}}}],t.name)});
// 8. Cigarettes : appui long pour masquer
hold("#trkBox .trk-n",(b)=>{pop(b,[{l:"Masquer le compteur",f:()=>{const v=S.g.vie||(S.g.vie={});v.track=v.track||{};v.track.cig=false;save();try{renderTrk()}catch(e){}toast("Compteur masqué · à réactiver dans Ma vie")}}])});
// 3. Capacité : toucher le compteur d'Aujourd'hui
document.addEventListener("click",e=>{const c=e.target.closest&&e.target.closest("#fqBox .head .count");if(!c)return;e.preventDefault();e.stopPropagation();const tk=dayKey(Date.now()),v=S.g.vie||(S.g.vie={}),cur=vieCap();
  pop(c,[1,2,3,5,8].map(n=>({l:n+" quête"+(n>1?"s":"")+" aujourd'hui",on:n===cur,f:()=>{v.capDay={d:tk,n};if(S.g.fq)S.g.fq.d="";save();render()}})),"Aujourd'hui")},true);


// 2, 4, 5. Menu « … » des quêtes du jour enrichi
function fqExtra(){const L=(()=>{try{return fqList()}catch(e){return[]}})();document.querySelectorAll("#fqBox .fqr .fqno").forEach(m=>{if(m.querySelector("[data-ex]"))return;const r=m.closest(".fqr"),x=L[+r.dataset.i];if(!x)return;
    const add=(k,l,sub,f)=>{const b=document.createElement("button");b.type="button";b.className="btn";b.dataset.ex=k;b.innerHTML=`${l}<small>${sub}</small>`;b.onclick=e=>{e.stopPropagation();f()};m.prepend(b)};
    add("rem","Me le rappeler","régulièrement",()=>{const g=S.g;if(!Array.isArray(g.last))g.last=[];if(!g.last.some(y=>y.name===x.t))g.last.push({id:"l"+Date.now().toString(36),name:x.t,n:1,u:"s",d:dayKey(Date.now())});save();try{renderTrk();renderVie()}catch(e){}toast("Ajouté à « La dernière fois que… »")});
    if(CATS[x.cat])add("more","Plus comme ça",esc(CATS[x.cat].label)+" en priorité",()=>{const v=S.g.vie||(S.g.vie={}),P=Array.isArray(v.pri)?v.pri:[];if(!P.includes(x.cat)){if(P.length>=3)P.shift();P.push(x.cat)}v.pri=P;if(S.g.fq)S.g.fq.d="";save();render();toast(esc(CATS[x.cat].label)+" passe en priorité")});
    if(x.k==="arc"&&x.p)add("prj","Voir le projet","étapes, modifier",()=>{try{showView("c")}catch(e){}cGoSub("vie");setTimeout(()=>{const b=document.getElementById("prjBox2");if(b){b.scrollIntoView({behavior:"smooth",block:"start"});const h=b.querySelector('.prh[aria-expanded="false"]');if(h)h.click()}},200)})})}
// 7. Quêtes spéciales : un seul « … »
function sqMenus(){document.querySelectorAll("#sqBox .sq").forEach(c=>{const x=c.querySelector(":scope>.sqx");if(!x||c.querySelector(".sqm"))return;const b=document.createElement("button");b.type="button";b.className="sqm";b.setAttribute("aria-label","Options");b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="5" cy="12" r="2.2" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><circle cx="19" cy="12" r="2.2" fill="currentColor"/></svg>';
    b.onclick=e=>{e.stopPropagation();const lab=x.getAttribute("aria-label")||"Retirer";pop(b,[{l:/autre/i.test(lab)?ICO("refresh",14)+" Proposer autre chose":ICO("close",14)+" Retirer cette quête",f:()=>x.click()}])};c.appendChild(b)})}
// Plus de quêtes : un panneau qui monte du bas
const PLUS_IDS=[];
function plusSheet(){const open=document.documentElement.classList.contains("plusopen");let sh=document.getElementById("plusSheet");
  if(!sh){sh=document.createElement("div");sh.id="plusSheet";sh.innerHTML='<div class="ps-bg"></div><div class="ps-in" role="dialog" aria-modal="true" aria-label="Plus de quêtes"><div class="ps-h"><b>Actions</b><button type="button" class="ps-x" aria-label="Fermer"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div id="actFind" class="actfind"></div><div class="wrap ps-wrap"></div></div>';document.body.appendChild(sh);
    const cl=()=>{const b=document.querySelector("#plusBox .plusb");if(b&&document.documentElement.classList.contains("plusopen"))b.click()};sh.querySelector(".ps-x").onclick=cl;sh.querySelector(".ps-bg").onclick=cl;
    let y0=null;const pi=sh.querySelector(".ps-in");pi.addEventListener("touchstart",e=>{y0=pi.scrollTop<=0?e.touches[0].clientY:null},{passive:true});pi.addEventListener("touchend",e=>{if(y0!=null&&e.changedTouches[0].clientY-y0>90)cl();y0=null})}
  const pw=sh.querySelector(".ps-wrap"),wrap=document.querySelector("body>.wrap")||document.querySelector(".wrap:not(.ps-wrap)"),plus=document.getElementById("plusBox");
  const secs=PLUS_IDS.map(id=>document.getElementById(id)).filter(Boolean);
  if(open){secs.forEach(x=>{if(x.parentNode!==pw)pw.appendChild(x)});if(!sh.__af){afQ="";afCat="";afSel=null;afFam="";afStep="who";renderAF()}sh.__af=1}
  else if(wrap&&plus){sh.__af=0;secs.forEach(x=>{if(x.parentNode===pw)wrap.insertBefore(x,plus.nextSibling)})}}
try{new MutationObserver(()=>plusSheet()).observe(document.documentElement,{attributes:true,attributeFilter:["class"]})}catch(e){}
// Événement du jour, en haut d'Aujourd'hui
let evK="";const deN=n=>/^[aeiouyhéèêàâîôûAEIOUYHÉÈ]/.test(n)?"d'"+n:"de "+n;
function evToday(){const b=document.getElementById("evToday");if(!b||!S||!S.g)return;let L=[];try{L=evList().filter(e=>e.inD===0||e.k==="bd"&&e.inD>0&&e.inD<=3).sort((a,b)=>a.inD-b.inD)}catch(e){}
  L=L.map(e=>e.k!=="bd"?e:{...e,n:"Anniversaire "+deN(e.who),sub:e.inD===0?"C'est aujourd'hui":e.inD===1?"Demain · pense au cadeau":"Dans "+e.inD+" jours · pense au cadeau"});
  const k=L.map(e=>e.id+e.n+(e.sub||"")).join("|");if(k===evK)return;evK=k;
  b.innerHTML=L.map(e=>{let c="var(--gold)";try{c=e.k==="bd"?"var(--c-autres)":evtOf(e.t||evtGuess(e.n))[2]}catch(_){}if(e.k==="bd")return`<button type="button" class="evtd bdy${e.inD===0?" bd0":""}"><span class="bdav">${pAv(e.who,"bdp")}<span class="bdck">${BDCAKE}</span></span><span class="bdtx"><b></b><small>${e.sub}</small></span></button>`;return`<button type="button" class="evtd" style="--ec:${c}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e.k==="bd"?'<path d="M4 21h16M5 21v-7h14v7M12 14v-3M12 8a1.5 1.5 0 0 0 1.5-1.5C13.5 5 12 3 12 3s-1.5 2-1.5 3.5A1.5 1.5 0 0 0 12 8z"/>':'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>'}</svg><b></b></button>`}).join("");
  b.querySelectorAll(".evtd b").forEach((x,i)=>x.textContent=L[i].n);b.querySelectorAll(".evtd").forEach((x,i)=>x.onclick=()=>{if(L[i].k==="bd"){try{bdConf(x)}catch(_){}setTimeout(()=>{try{openProfile(L[i].who)}catch(_){}},450);return}try{showView("c")}catch(_){}cGoSub("vie");setTimeout(()=>{const e=document.getElementById("evtBox");if(e)e.scrollIntoView({behavior:"smooth",block:"start"})},150)})}
// ---- frise de la journée : soleil qui avance, plage de travail, XP du jour
function friseViz(){const q=document.getElementById("qDay");if(!q||!S||!S.g)return;const now=new Date(),h=now.getHours()+now.getMinutes()/60;let w0=8;try{w0=wakeH()}catch(e){}const a=w0,b=Math.max(a+15,24);
  let sr=7.5,ss=19;try{const t=sunSet(now);sr=t.rise.getHours()+t.rise.getMinutes()/60;ss=t.set.getHours()+t.set.getMinutes()/60}catch(e){}
  const v=S.g.vie||{},tk=dayKey(Date.now()),dw=now.getDay(),per=(S.g.per||[]).some(p=>p.t==="contrat"&&p.s<=tk&&tk<=p.e);let sj="";try{sj=(sitOf()||{}).job||""}catch(e){}
  const work=(v.wd||[]).includes(dw)&&(v.job||per||sj==="poste")&&v.wf&&v.wt;const hh=x=>{const[m,n]=String(x).split(":");return+m+(+n||0)/60};
  const pc=x=>Math.max(0,Math.min(100,(x-a)/(b-a)*100)),xp=((document.getElementById("qDayT")||{}).textContent||"").split("/")[0].trim();
  const k=[Math.round(h*12),work,xp,a].join("|");let f=q.querySelector(".frise");if(f&&f.dataset.k===k)return;if(!f){f=document.createElement("span");f.className="frise";q.appendChild(f)}f.dataset.k=k;
  const day=h>=sr&&h<ss,grad=`linear-gradient(90deg,#1d2350 ${pc(sr-1.2)}%,#f08a5a ${pc(sr)}%,#7fd4ff ${pc(sr+1.5)}%,#7fd4ff ${pc(ss-1.5)}%,#f08a5a ${pc(ss)}%,#2b2266 ${pc(ss+1.2)}%,#141836 100%)`;
  f.innerHTML=`<span class="frt" style="background:${grad}">${work?`<span class="frw" style="left:${pc(hh(v.wf))}%;width:${pc(hh(v.wt))-pc(hh(v.wf))}%"><span class="frwi">${vI("dossier")}</span></span>`:""}<span class="frp" style="width:${pc(h)}%"></span><span class="frs ${day?"sun":"moon"}" style="left:${pc(h)}%">${vI(day?"soleil":"lune")}</span></span><span class="frl"><small>${Math.floor(a)}h</small><b>+${esc(xp||"0")} XP</b><small>${b>=24?"0h":b+"h"}</small></span>`}
// ---- avec qui pour la sortie
const IDW={mus:/musi|f[êe]t/i,mic:/f[êe]t|musi|humour/i,q:/intello|geek/i,cine:/cin[ée]/i,dice:/geek|f[êe]t/i,mask:/artiste|humour/i,key:/geek|intello/i,food:/gourm/i,bag:/artiste|mode/i,art:/artiste|dessin/i,run:/sport/i,map:/voyag|nature/i};
function idWho(ix,skip){const x=IDQ[ix],re=IDW[x[5]]||/./,now=Date.now();const L=(S.friends||[]).map(n=>{const P=(S.profiles||{})[n]||{},ty=[...(P.types||[]),...(P.talents||[])].join(" "),d=((S.bondsLast||{})[n]?(now-S.bondsLast[n])/864e5:60);return{n,s:(re.test(ty)?5:0)+Math.min(4,d/7)+((S.bonds||{})[n]||0)/200+(P.best?1:0)}}).sort((a,b)=>b.s-a.s).map(o=>o.n);return L.filter(n=>!(skip||[]).includes(n))[0]||L[0]||""}
function idqWho(){const old=document.querySelector("#sqBox .idq .idqw");if(old)old.remove();return;const c=document.querySelector("#sqBox .idq");if(!c||!S.g.idq||S.g.idq.p==null)return;const Q=S.g.idq;if(!Q.w||Q.wp!==Q.p){Q.w=idWho(Q.p,Q.ws||[]);Q.wp=Q.p;save()}if(!Q.w)return;let w=c.querySelector(".idqw");if(w&&w.dataset.n===Q.w)return;if(!w){w=document.createElement("button");w.type="button";w.className="idqw";const sn=c.querySelector(".sqn");sn.after(w)}
  w.dataset.n=Q.w;w.innerHTML=`${pAv(Q.w,"fmini")}<span>avec ${esc(Q.w)} ?</span>`;w.onclick=ev=>{ev.stopPropagation();Q.ws=[...(Q.ws||[]),Q.w].slice(-12);Q.w=idWho(Q.p,Q.ws);save();idqWho()};
  const f=c.querySelector(".idqf");if(f&&!f.dataset.w){f.dataset.w=1;f.addEventListener("click",()=>{const n=Q.w;if(n){S.bonds[n]=(S.bonds[n]||0)+20;S.bondsLast[n]=Date.now();save();setTimeout(()=>kwAsk([n]),2800)}},true)}}
// ---- les repas en une seule rangée d'assiettes (remplace les cartes repas, le bilan repas et « + Repas »)
const MEALS=[["pdej","matin","Petit-déj","cup"],["dej","matin","Déjeuner","plate"],["gouter","soir","Goûter","cookie"],["diner","soir","Dîner","plate"]];
function mealState(k,per){const tk=dayKey(Date.now()),key=tk+":"+per,b=(S.g.mb||{})[key],dr=(S.g.mbd||{})[key];const m=(b&&b.m)||(dr&&dr.m)||{};return m[k]===1?"ok":m[k]===0?"ko":""}
function mealAuto(){const tk=dayKey(Date.now()),G=S.g;if(!G.mb)G.mb={};["matin","soir"].forEach(per=>{const key=tk+":"+per,dr=(G.mbd||{})[key];if(G.mb[key]||!dr||!dr.cr)return;if(!MB[per].every(([k])=>dr.cr[k]))return;let ng=0;try{if(!isSoft(tk))MB[per].forEach(([k,,,m])=>{if(dr.m[k]===0)ng+=m})}catch(e){}G.mb[key]={m:{...dr.m},ex:{...(dr.ex||{})},w:{...(dr.w||{})},v:{},neg:ng,pl:{},xp:0,t:Date.now(),auto:1};save()})}
function mealRow(){const tr=document.getElementById("spTrack");if(!tr||!S||!S.g)return;try{mealAuto()}catch(e){}const h=dayH();
  const st=MEALS.map(([k,per])=>mealState(k,per)+(h>=MEAL_H[k]?"":"|later")).join(",");let r=tr.querySelector(".mlrow");if(r&&r.dataset.k===st&&r.parentElement===tr){try{plateDay(r)}catch(e){}return}
  if(!r){r=document.createElement("div");r.className="mlrow"}r.dataset.k=st;tr.querySelectorAll(".mlpop").forEach(x=>x.remove());
  r.innerHTML=MEALS.map(([k,per,l,ic])=>{const s=mealState(k,per),later=h<MEAL_H[k];return`<button type="button" class="mlp st-${s||"none"}${later?" later":""}" data-k="${k}" data-per="${per}" ${later||(s&&!(s==="ok"&&MB_PLM.includes(k)))?"disabled":""} aria-label="${l}${s==="ok"?", pris":s==="ko"?", sauté":""}"><span class="mli">${pxImg(ic,3)}${s==="ko"?'<i class="mlx"></i>':""}${s==="ok"?`<span class="mlb">${vI("check")}</span>`:""}</span><small>${l}</small></button>`}).join("");
  const anchor=tr.querySelector(".rtl.main");if(anchor)anchor.after(r);else tr.appendChild(r);
  r.querySelectorAll(".mlp:not([disabled])").forEach(b=>b.onclick=()=>{if(typeof plateOpen==="function"&&MB_PLM.includes(b.dataset.k)){tr.querySelectorAll(".mlpop").forEach(x=>x.remove());plateOpen(b.dataset.per,b.dataset.k,b);return}const ps=[...tr.querySelectorAll(".mlpop")],same=ps.some(x=>x.dataset.k===b.dataset.k);ps.forEach(x=>x.remove());if(same)return;const p=document.createElement("div");p.className="mlpop";p.dataset.k=b.dataset.k;const l=b.querySelector("small").textContent;
    p.innerHTML=`<button type="button" data-v="1"><span>${pxImg(MEALS.find(m=>m[0]===b.dataset.k)[3],3)}</span>Pris</button><button type="button" data-v="0"><span class="mlskip">${pxImg(MEALS.find(m=>m[0]===b.dataset.k)[3],3)}<i class="mlx"></i></span>Sauté</button>`;r.after(p);
    p.querySelectorAll("[data-v]").forEach(x=>x.onclick=ev=>{p.remove();try{mealQuick(b.dataset.per,b.dataset.k,b,+x.dataset.v,ev)}catch(e){}r.dataset.k="";setTimeout(mealRow,60)})});try{plateDay(r)}catch(e){}}
// ---- la nuit en frise : lune et soleil à glisser (remplace les deux champs d'heure)
function sleepVars(){const r=document.documentElement;if(r.style.getPropertyValue('--slmoon'))return;const u=k=>'url("data:image/svg+xml,'+encodeURIComponent(vI(k).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))+'")';r.style.setProperty('--slmoon',u('lune'));r.style.setProperty('--slsun',u('soleil'))}
function sleepViz(){sleepVars();const f=document.getElementById("slForm");if(!f||f.querySelector(".slviz"))return;const C=document.getElementById("slC"),R=document.getElementById("slR");if(!C||!R)return;
  const toM=v=>{const[a,b]=String(v||"0:0").split(":").map(Number);return a*60+(b||0)},fm=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")},lab=m=>{m=((m%1440)+1440)%1440;return Math.floor(m/60)+"h"+(m%60?String(m%60).padStart(2,"0"):"")};
  let c=toM(C.value);if(c<12*60)c+=1440;let w=toM(R.value);if(w<12*60)w+=1440;else w+=0;if(w<=c)w+=1440;
  const v=document.createElement("div");v.className="slviz";v.innerHTML=`<div class="slhd"><b class="sldur"></b><small class="slrg"></small></div><div class="sltr"><label class="slh"><span class="slk">${vI("lune")}</span><input type="range" class="slc" min="${20*60}" max="${28*60}" step="15" aria-label="Heure du coucher"></label><label class="slh"><span class="slk">${vI("soleil")}</span><input type="range" class="slr" min="${28*60}" max="${37*60}" step="15" aria-label="Heure du réveil"></label></div>`;
  f.insertBefore(v,f.firstChild);const ic=v.querySelector(".slc"),ir=v.querySelector(".slr");ic.value=Math.min(28*60,Math.max(20*60,c));ir.value=Math.min(37*60,Math.max(28*60,w));
  const sb=f.querySelector('button[type="submit"]');if(sb)f.appendChild(sb);const pos=(i)=>{const k=i.parentElement.querySelector(".slk");k.style.left=((+i.value-+i.min)/(+i.max-+i.min)*100)+"%"};
  const sync=()=>{const a=+ic.value,b=+ir.value;pos(ic);pos(ir);C.value=fm(a);R.value=fm(b);const d=b-a;v.querySelector(".sldur").textContent=Math.floor(d/60)+" h"+(d%60?" "+String(d%60).padStart(2,"0"):"");v.querySelector(".slrg").textContent=lab(a)+" → "+lab(b)};ic.oninput=sync;ir.oninput=sync;sync()}
// ---- Aujourd'hui : noms courts sous les icônes de rituels (le nom complet reste lu par VoiceOver)

// ---- l'idée sortie prend le décor Divertissement, comme les autres cartes
function idqDress(){const c=document.querySelector("#sqTrack .sq.idq");if(!c)return;const t=(c.querySelector(".sqn")||{}).textContent||"";if(c.dataset.dz===t)return;c.dataset.dz=t;
  c.classList.add("unicard");c.style.setProperty("--uni",decor("divert",1));c.style.setProperty("--uc",(DUNI.divert||{}).f||"var(--gold)");
  let ic="";try{const k=afMatch(t);if(k)ic=uIc(k.split(":")[1],k.split(":")[2])}catch(e){}if(!ic||!RKI[ic])ic=(DUNI.divert||{}).ic||"clap";
  let sp=c.querySelector(".uiq");if(!sp){sp=document.createElement("span");sp.className="uiq";c.appendChild(sp)}sp.innerHTML=rkSvg(ic)}
// ---- quêtes « avec quelqu'un » : préciser avec qui en validant
const SOC=/avec (des|tes|mes|un|une|ta|ton|ses|quelqu)|potes|\bamis?\b|à deux|à plusieurs|en groupe|ensemble|en famille|coloc|bande|soirée/i;
function questWho(card){const t=((card.querySelector(".fqt b,.sqn")||{}).textContent||"").trim();if(t&&card.classList.contains("idq"))return t;if(!t||!SOC.test(t))return null;
  const names=(typeof relNames==="function"?relNames():[]);if(names.some(n=>new RegExp("\\b"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(t)))return null;
  const q=(S.specials||[]).find(x=>x.name===t);if(q&&(q.who||q.bd||q.fg))return null;return t}
function whoSheet(title,done){const o=document.createElement("div");o.className="bpop whopop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Avec qui ?");
  const P=whoRank(title,people()),hot=new Set(P.filter(n=>whoScore(title,n)>0)),G=fgList().filter(g=>fgMembers(g.id).length),sel=new Set();
  const draw=()=>{o.innerHTML=`<div class="bpc whoc"><h3>Avec qui ?</h3><p class="whot"></p><div class="whog">${G.map(g=>`<button type="button" class="whob grp" data-g="${g.id}" aria-pressed="${fgMembers(g.id).every(n=>sel.has(n))}">${rkSvg("duo")}<span class="whl"></span></button>`).join("")}${P.map(n=>`<button type="button" class="whob" data-n="${esc(n)}" aria-pressed="${sel.has(n)}">${pAv(n,"whav")}${hot.has(n)?`<i class="whs" title="Colle bien à cette quête">${rkSvg("etoile")}</i>`:""}<span class="whl"></span></button>`).join("")}</div><div class="whoa"><button type="button" class="btn whono">Passer</button><button type="button" class="btn primary whook"${sel.size?"":" disabled"}>Valider${sel.size?" · "+sel.size:""}</button></div></div>`;
    o.querySelector(".whot").textContent=title;o.querySelectorAll(".whob.grp .whl").forEach((s,i)=>s.textContent=G[i].n);o.querySelectorAll(".whob[data-n] .whl").forEach((s,i)=>s.textContent=P[i]);
    o.querySelectorAll(".whob").forEach(b=>b.onclick=()=>{if(b.dataset.g){const M=fgMembers(b.dataset.g),all=M.every(n=>sel.has(n));M.forEach(n=>all?sel.delete(n):sel.add(n))}else{const n=b.dataset.n;sel.has(n)?sel.delete(n):sel.add(n)}const st=o.querySelector(".whog").scrollTop;draw();o.querySelector(".whog").scrollTop=st});
    o.querySelector(".whono").onclick=()=>{o.remove();done([])};o.querySelector(".whook").onclick=()=>{o.remove();done([...sel])}};
  o.onclick=e=>{if(e.target===o)o.remove()};draw();document.body.appendChild(o)}
document.addEventListener("click",e=>{const go=e.target.closest("#fqBox .fqr .fqgo, #sqBox .sq .btn.primary");if(!go||go.dataset.wok)return;const card=go.closest(".fqr,.sq");if(!card||card.classList.contains("later"))return;const t=questWho(card);if(!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  whoSheet(t,who=>{const t0=Date.now();go.dataset.wok="1";go.click();delete go.dataset.wok;if(!who.length)return;
    setTimeout(()=>{try{const L=S.log||[];let ent=null;for(let i=L.length-1;i>=0&&i>=L.length-6;i--){if(L[i].t>=t0-50&&(L[i].name||"").includes(t.slice(0,18))){ent=L[i];break}}if(!ent)for(let i=L.length-1;i>=0&&i>=L.length-3;i--){if(L[i].t>=t0-50){ent=L[i];break}}
      const xp=Math.max(0,(ent&&ent.xp)||20);if(ent)ent.withp=[...new Set([...(ent.withp||[]),...who])];
      who.forEach(p=>{S.bonds[p]=(S.bonds[p]||0)+Math.max(5,Math.round(xp/2));S.bondsLast[p]=Date.now()});save();
      toast(who.length===1?`Avec ${esc(who[0])} · lien +${Math.max(5,Math.round(xp/2))}`:`Avec ${who.length} personnes · liens +${Math.max(5,Math.round(xp/2))}`)}catch(err){console.warn("questWho",err)}},120)})},true);
// ---- noter une action pour hier depuis le +
document.addEventListener("click",e=>{if(e.target.closest("#afFab")){window.__dayShift=0;return}const b=e.target.closest(".afday");if(!b)return;e.preventDefault();window.__dayShift=window.__dayShift?0:1;b.setAttribute("aria-pressed",!!window.__dayShift);const s=b.parentElement.querySelector(".psxp");if(s){let x=0;try{x=xpToday()}catch(er){}s.textContent=window.__dayShift?"pour hier":x+" XP aujourd'hui"}try{navigator.vibrate&&navigator.vibrate(10)}catch(er){}},true);
document.addEventListener("click",e=>{if(e.target.closest("#plusSheet .ps-x"))window.__dayShift=0},true);
// ---- apprendre des refus : 3 refus d'une même famille en 30 jours = elle se met en retrait 3 semaines
const famOfQ=x=>{try{const t=x.t||(x.q&&x.q.name)||"";const k=afMatch(t);return k?k.split(":")[1]:""}catch(e){return""}};
const famCool=f=>{const R=(S.g&&S.g.fqFam)||{},L=(R[f]||[]).filter(t=>Date.now()-t<30*864e5);return L.length>=3&&Date.now()-L[L.length-1]<21*864e5};


// ---- les quêtes du jour prennent place dans les creux de la journée (frise + « vers 18 h »)
function fqSlots(){const box=document.getElementById("fqBox"),fr=document.querySelector("#qDay .frise .frt");if(!box||!S||!S.g)return;
  const now=new Date(),h=now.getHours()+now.getMinutes()/60;let a=8;try{a=wakeH()}catch(e){}const b=Math.max(a+15,24),pc=x=>Math.max(0,Math.min(100,(x-a)/(b-a)*100));
  const v=S.g.vie||{},tk=dayKey(Date.now()),dw=now.getDay(),per=(S.g.per||[]).some(p=>p.t==="contrat"&&p.s<=tk&&tk<=p.e);let sj="";try{sj=(sitOf()||{}).job||""}catch(e){}
  const hh=x=>{const[m,n]=String(x).split(":");return+m+(+n||0)/60},work=(v.wd||[]).includes(dw)&&(v.job||per||sj==="poste")&&v.wf&&v.wt,w0=work?hh(v.wf):99,w1=work?hh(v.wt):-1;
  const free=[];for(let x=Math.max(Math.ceil(h+.25),Math.ceil(a+1));x<=22;x++){if(x>=w0&&x<w1)continue;free.push(x)}
  let HB={};try{HB=(window.__habits&&window.__habits().H)||{}}catch(e){}
  const med=A=>{const s=A.slice().sort((p,q)=>p-q);return s[Math.floor(s.length/2)]};const used=new Set(),L=(()=>{try{return fqList()}catch(e){return[]}})(),marks=[];
  box.querySelectorAll(".fqr").forEach(card=>{const old=card.querySelector(".fqh");const x=L[+card.dataset.i];if(!x||x.done||card.classList.contains("done")||!free.length){if(old)old.remove();return}
    const t=x.t||"";if(/\b\d{1,2} ?h\b|ce soir|ce matin|demain/i.test(t)){if(old)old.remove();return}
    let pick=null;try{const k=afMatch(t);if(k){const f=k.split(":")[1],hr=[];Object.entries(HB).forEach(([kk,o])=>{if(kk===k||kk.split(":")[1]===f)(o.hr||[]).forEach(z=>hr.push(z))});if(hr.length>=2){const m=med(hr);const c=free.filter(z=>!used.has(z)).sort((p,q)=>Math.abs(p-m)-Math.abs(q-m))[0];if(c!=null&&Math.abs(c-m)<=2)pick=c}}}catch(e){}
    if(pick==null)pick=free.find(z=>!used.has(z));if(pick==null){if(old)old.remove();return}used.add(pick);
    const lab=`vers ${pick} h`;const w=card.querySelector(".fqw");if(w){if(old){if(old.textContent!==lab)old.textContent=lab}else{const e=document.createElement("em");e.className="fqh";e.textContent=lab;w.appendChild(e)}}
    const ic=card.querySelector(".uiq svg");marks.push({x:pick,ic:ic?ic.outerHTML:rkSvg("etoile"),t})});
  if(!fr)return;const sig=marks.map(m=>m.x+m.t+m.ic.length).join("|");if(fr.dataset.fq===sig&&fr.querySelector(".frq")||(!marks.length&&!fr.querySelector(".frq"))){fr.dataset.fq=sig;return}fr.dataset.fq=sig;fr.querySelectorAll(".frq").forEach(e=>e.remove());
  marks.forEach(m=>{const s=document.createElement("span");s.className="frq";s.style.left=pc(m.x)+"%";s.title=m.t+" · vers "+m.x+" h";s.innerHTML=m.ic;fr.appendChild(s)})}
// les blocs du matin/soir (repas, nuit) et les données des quêtes se font au rendu du bloc lui-même



// ---- chaque bloc d'Aujourd'hui finit son propre rendu (plus de retouche globale après coup)
function sqFinish(){idqCard();idqDress();idqWho();bdDress();natDress();dressQuests();sqMenus();sqEod()}
function fqFinish(){dressQuests();bdDress();fqExtra();friseViz();fqSlots()}
window.__sqFinish=sqFinish;window.__fqFinish=fqFinish;window.__friseViz=()=>{friseViz();fqSlots()};
function sqEod(){const L=(S.specials||[]).filter(q=>q.sm&&q.eod);if(!L.length)return;const tk=dayKey(Date.now());document.querySelectorAll("#sqBox .sq").forEach(c=>{const n=(c.querySelector(".sqn")||{}).textContent,q=L.find(x=>x.name===n);if(!q)return;const go=c.querySelector(".primary");if(!go||go.dataset.eod)return;go.dataset.eod=1;go.disabled=true;go.removeAttribute("data-tm");
    let st="ce soir";if(q.eod==="cig"){const n0=(S.g.cig||{})[tk]||0;st=n0+" / moins de "+q.eodv}if(q.eod==="bed")st="au coucher";go.textContent=st;go.classList.add("eodb")})}
 // ---- Proches et profil : chaque bloc finit son propre rendu
