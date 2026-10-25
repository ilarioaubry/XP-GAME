// ---- Réglages : limite, stockage, sauvegarde
function renderData(){
  const sz=JSON.stringify(snapshot()).length,max=256*1024,p=Math.min(100,sz/max*100);
  $("storTxt").textContent=`Stockage : ${Math.round(sz/1024)} Ko / 256 Ko`;$("storBar").style.width=p+"%";$("storBar").style.background=p>80?"var(--bad,#b3261e)":"";
  $("storHint").textContent=p>80?"Presque plein : retire des photos d'amis ou des notes longues pour éviter une perte d'enregistrement.":"Tout va bien. Les photos d'amis sont ce qui pèse le plus.";
  if(document.activeElement!==$("dayLimit"))$("dayLimit").value=String(S.dayLimit);
}
$("dayLimit").onchange=()=>{S.dayLimit=+$("dayLimit").value;save();render()};
$("expBtn").onclick=async()=>{
  const t=JSON.stringify(snapshot()),b=$("dataBox");b.value=t;b.hidden=false;b.select();
  let ok=false;try{await navigator.clipboard.writeText(t);ok=true}catch(e){try{ok=document.execCommand("copy")}catch(e2){}}
  toast(ok?"Sauvegarde copiée : colle-la dans une note":"Sélectionne le texte et copie-le");
};
let impArmed=false;
// sauvegarde en fichier : menu de partage iOS (Enregistrer dans Fichiers), sinon téléchargement
$("expFile").onclick=async()=>{
  const name="carnet-"+new Date().toISOString().slice(0,10)+".json",f=new File([JSON.stringify(snapshot())],name,{type:"application/json"});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});S.g.bkLast=Date.now();save();return}}catch(e){if(e&&e.name==="AbortError")return}
  const a=document.createElement("a");a.href=URL.createObjectURL(f);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  S.g.bkLast=Date.now();save();toast("Sauvegarde exportée");
};
$("impFileBtn").onclick=()=>$("impFile").click();
$("impFile").onchange=async e=>{
  const fl=e.target.files&&e.target.files[0];e.target.value="";if(!fl)return;let d;
  try{d=JSON.parse(await fl.text())}catch(x){toast("Ce fichier n'est pas une sauvegarde");return}
  if(!d||typeof d!=="object"||typeof d.xp!=="number"||!Array.isArray(d.actions)){toast("Sauvegarde non reconnue");return}
  undoAfter("Données restaurées",()=>{load(d);save();render()});
};
$("impBtn").onclick=()=>{
  const m=$("impMsg");let d;
  try{d=JSON.parse($("impBox").value.trim())}catch(e){m.textContent="Ce texte n'est pas une sauvegarde valide.";impArmed=false;$("impBtn").textContent="Restaurer";return}
  if(!d||typeof d!=="object"||typeof d.xp!=="number"||!Array.isArray(d.actions)){m.textContent="Sauvegarde non reconnue.";return}
  if(!impArmed){impArmed=true;$("impBtn").textContent="Confirmer : remplace tout";m.textContent="Cela remplace toute ta progression actuelle.";return}
  impArmed=false;$("impBtn").textContent="Restaurer";load(d);save();render();$("impBox").value="";m.textContent="Sauvegarde restaurée.";toast("Données restaurées");
};

// ---- Talents perso
const SK_NEED=l=>20+10*l;
const SQ=[["texte","Texte"],["topline","Topline"],["voix","Voix"],["poly","Polyvalence"],["visuel","Visuel"],["prod","Production"],["flow","Flow"],["collab","Collab"]];
function sndGain(a){
  const n=a.name||"",g={};const all=v=>SQ.forEach(([k])=>g[k]=(g[k]||0)+v);
  if(/^Défi son/.test(n)){g.poly=3;g.texte=2;g.topline=2;g.flow=2;g.prod=2;g.voix=1}
  else if(/^Faire un son dans le style/.test(n)){all(1);g.poly+=5}
  else if(/^Faire un son avec Octave/.test(n)){all(1);g.collab+=5;g.poly+=1}
  else if(n==="Faire du son (1 h)"){g.prod=4;g.topline=2;g.flow=2;g.voix=1}
  else if(n==="Écrire un couplet"){g.texte=5;g.flow=2}
  else if(n==="Séance : Sons"){all(2);delete g.collab}
  else return null;
  return g}


function skInfo(xp){let l=1,r=xp;while(r>=SK_NEED(l)){r-=SK_NEED(l);l++}return{l,cur:r,need:SK_NEED(l)}}


// ---- Réglages : cartes repliables
function foldInit(){
  document.querySelectorAll(".settings>.set-card").forEach(c=>{const h=c.querySelector(":scope>h3");if(!h)return;c.classList.add("fold","closed");h.tabIndex=0;h.setAttribute("role","button");h.setAttribute("aria-expanded","false");
    const t=()=>{const cl=c.classList.toggle("closed");h.setAttribute("aria-expanded",!cl)};h.onclick=t;h.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();t()}}});
}
foldInit();

function applyTheme(){const t=S.theme||"auto",r=document.documentElement;document.querySelectorAll(".thseg [data-th]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.th===t));if(t==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",t);
  try{const m=document.querySelector('meta[name="color-scheme"]');}catch(e){}}
document.querySelectorAll(".thseg [data-th]").forEach(b=>b.onclick=()=>{S.theme=b.dataset.th;applyTheme();save()});
document.querySelectorAll("[data-snd]").forEach(b=>b.onclick=()=>{if(!S.g)return;S.g.mute=b.dataset.snd!=="1";save();document.querySelectorAll("[data-snd]").forEach(x=>x.setAttribute("aria-pressed",(x.dataset.snd==="1")===!S.g.mute));if(!S.g.mute)sfx("coin")});

// ---- Rituels du jour
const RIT_DEFAULT=[{id:"r1",name:"Pompes",n:1,link:"10 pompes"},{id:"r2",name:"Brossage de dents",n:2,link:"Se brosser les dents"},{id:"r3",name:"Manger",n:3},{id:"r6",name:"Verres d'eau",n:8,link:"1 verre d'eau"},{id:"r4",name:"Faire mon lit",n:1},{id:"r5",name:"Prendre ma douche",n:1}];
// noms courts des rituels (« Prendre ma douche » → « Douche »)
var SHORT=[[/douche/i,"Douche"],[/fen[êe]tre|a[ée]rer/i,"Fenêtre"],[/\blit\b/i,"Lit"],[/dents/i,"Dents"],[/barbe|raser/i,"Barbe"],[/[ée]tirement/i,"Étirements"],[/visage/i,"Visage"],[/verre|\beau\b/i,"Eau"],[/m[ée]dit/i,"Méditer"],[/respir/i,"Respirer"],[/\blire\b|pages/i,"Lecture"],[/pompes/i,"Pompes"],[/squats/i,"Squats"],[/gainage/i,"Gainage"],[/vitamine|m[ée]dic/i,"Vitamines"],[/plante/i,"Plantes"],[/t[ée]l[ée]phone|[ée]cran/i,"Écrans"],[/journal|[ée]crire/i,"Journal"],[/demain|planifi/i,"Demain"],[/\bsac\b|affaires/i,"Sac"],[/vaisselle/i,"Vaisselle"],[/ranger|rangement/i,"Ranger"],[/cr[èe]me|soin/i,"Soin"],[/cheveux/i,"Cheveux"],[/marche/i,"Marche"],[/charge/i,"Recharge"],[/d[ée]o/i,"Déo"],[/parfum/i,"Parfum"],[/pri[èe]re/i,"Prière"],[/sport/i,"Sport"]];
var STOP=/^(prendre|faire|se|me|mon|ma|mes|la|le|les|de|du|des|un|une|d'|l'|\d+|min|minutes?|h)$/i;
function shortName(n){const m=SHORT.find(([r])=>r.test(n));if(m)return m[1];const w=String(n).replace(/[’']/g,"' ").split(/\s+/).filter(x=>x&&!STOP.test(x));const t=(w.slice(0,2).join(" ")||n);return t.charAt(0).toUpperCase()+t.slice(1)}
function ritTasks(){if(!S.daily.tasks){S.daily.tasks=RIT_DEFAULT.map(x=>({...x}));S.daily.wAdded=true}
  if(!S.daily.wAdded){S.daily.wAdded=true;if(!S.daily.tasks.some(t=>t.link==="1 verre d'eau")){const i=S.daily.tasks.findIndex(t=>t.id==="r3");S.daily.tasks.splice(i>=0?i+1:S.daily.tasks.length,0,{id:"r6",name:"Verres d'eau",n:8,link:"1 verre d'eau"})}}
  S.daily.tasks.forEach(t=>{if(!t.ct)t.ct=Date.now()});
  if(S.g&&!S.g.rhInit){S.g.rhInit=1;const tk=dayKey(Date.now());if(S.daily.day===tk)S.daily.tasks.forEach(t=>{if(!t.bar&&(S.daily.c[t.id]||0)>=t.n)ritMark(t.id,1,1)})}
  return S.daily.tasks}
function ritH(){const G=S.g;if(!G.rh||typeof G.rh!=="object")G.rh={};return G.rh}
function ritMark(id,on,quiet){if(!S.g)return;const H=ritH(),tk=dayKey(Date.now());if(!H[tk])H[tk]={};if(on)H[tk][id]=1;else delete H[tk][id];const ks=Object.keys(H).sort();while(ks.length>70)delete H[ks.shift()];if(!quiet)ritCoreCheck()}
function ritDays(t,N){const H=ritH(),offs=new Set([...protDays(),...(t.pzs||[]).flatMap(r=>rngDays(r[0],r[1])),...(t.pz?rngDays(t.pz,dayKey(Date.now())):[]),...(S.g.abs||[])]),out=[],ct=dayKey(t.ct||Date.now()),ev=t.ev||1;let last=null;
  for(let i=N-1+ev;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dayKey(d),done=!!(H[k]&&H[k][t.id]);let v;
    if(done)v=1;else if(k<ct||offs.has(k)||rhOff(t,k,H))v=-1;else if(last!=null&&i>last-ev)v=-1;else v=i===0?2:0;
    if(done)last=i;if(i<N)out.push(v)}return out}
function ritDue(t){if((!t.ev||t.ev<=1)&&!rhOn(t))return true;const D=ritDays(t,1);return D[0]!==-1||(ritH()[dayKey(Date.now())]||{})[t.id]}
const PZ_IC='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>';
const evLab=t=>t.ev>1?(t.ev===7?"1×/sem.":"1 j/"+t.ev):"";
function ritRate(t,N){const D=ritDays(t,N).filter(x=>x===0||x===1);return D.length?D.filter(x=>x===1).length/D.length:null}
function ritLive(){return ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritDue(t))}
function ritCore(){const T=ritLive(),C=T.filter(t=>t.core);return C.length?C:T}
function ritCoreCheck(){const tk=dayKey(Date.now()),G=S.g;if(!Array.isArray(G.rcore))G.rcore=[];if(G.rcore.includes(tk))return;const H=ritH()[tk]||{},C=ritCore();
  if(C.length&&C.every(t=>H[t.id])){G.rcore.push(tk);G.rcore=G.rcore.slice(-400);if(ritLive().some(t=>t.core))setTimeout(()=>{const n=ritStreak();toast(`Socle tenu <span class="p">série de ${n} jour${n>1?"s":""}</span>`);sfx("badge")},900)}}
function ritStreak(){const A=new Set((S.g&&S.g.rcore)||[]),set=new Set([...A,...protDays()]);let n=0;const d=new Date();if(!set.has(dayKey(d)))d.setDate(d.getDate()-1);while(set.has(dayKey(d))){if(A.has(dayKey(d)))n++;d.setDate(d.getDate()-1)}return n}
function ritWeak(t){if(t.anc||t.auto||(t.wk&&Date.now()-t.wk<14*864e5))return false;const D=ritDays(t,14).filter(x=>x===0||x===1);return D.length>=10&&D.filter(x=>x===1).length/D.length<.3}
function ritLighter(t){if(t.n>1)return{n:t.n-1};const m=t.name.match(/\d+/);if(m&&+m[0]>1){return{name:t.name.replace(m[0],String(Math.max(1,Math.round(+m[0]/2))))}}return null}
let ancQ=[];
function ritAncCheck(){if(!S.g)return false;let ch=false;ritTasks().forEach(t=>{if(t.bar||t.anc)return;if(ritDays(t,30).filter(x=>x===1).length>=Math.ceil(21/(t.ev||1))){t.anc=Date.now();if(!Array.isArray(S.g.ancL))S.g.ancL=[];S.g.ancL.push({n:t.name,t:Date.now()});ancQ.push(t);ch=true}});if(ancQ.length)setTimeout(ancShowNext,1800);return ch}
function ancShowNext(){if(!ancQ.length)return;if(document.querySelector(".idpop,.bpop,.pu"))return setTimeout(ancShowNext,2500);const t=ancQ.shift();
  const o=document.createElement("div");o.className="bpop idpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.style.setProperty("--ic","#e0a020");
  o.innerHTML=`<div class="bpc idc"><span class="idk">Rituel ancré</span><div class="idbig">${pxImg("star",6)}</div><h3></h3><p class="idmsg">21 jours sur 30 : c'est une habitude.</p><p class="idmsg" style="font-weight:800;color:var(--ic)">+50 XP</p><button type="button" class="btn primary">Continuer</button><button type="button" class="btn ghost ancauto">Le rendre automatique</button></div>`;
  o.querySelector("h3").textContent=t.name;document.body.appendChild(o);sfx("level");
  const prev=levelInfo(S.xp).l;addBonus("Rituel ancré : "+t.name,50,0,"anc");save();
  const close=()=>{o.remove();render(prev);setTimeout(ancShowNext,600)};o.querySelector(".primary").onclick=close;
  o.querySelector(".ancauto").onclick=()=>{t.auto=1;save();close();toast("Rituel automatique : il ne charge plus ta liste")}}
const RIT_BRICKS=[["Faire mon lit","matin",["org"]],["Ouvrir la fenêtre","matin",[]],["Boire un grand verre d'eau","matin",["sante"]],["10 pompes","matin",["sport"]],["20 squats","matin",["sport"]],["5 min d'étirements","both",["sport","zen"]],["Méditer 5 min","both",["zen"]],["Lire 10 pages","both",["lect"]],["Noter ma priorité du jour","matin",["org","pro"]],["Petit-déjeuner sans écran","matin",["sante","zen"]],["Prendre ma douche","matin",[]],["Se brosser les dents","both",[]],["Se laver le visage","both",[]],["Préparer mes affaires pour demain","soir",["org"]],["Ranger 10 min","soir",["org"]],["Lâcher l'écran avant de dormir","soir",["zen","sante"]],["Écrire 3 choses positives","soir",["zen"]],["Envoyer un message à un proche","soir",["ami"]],["Écrire 4 lignes de texte","soir",["art"]],["Préparer le repas de demain","soir",["sante","org"]]];
const STAR_SVG='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.5 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.8z" fill="currentColor"/></svg>';
function ritDots(t,N){return`<span class="rdots${N>14?" long":""}">${ritDays(t,N).map(x=>`<i class="${x===1?"on":x===0?"off":x===2?"td":"na"}"></i>`).join("")}</span>`}
function ritAdd(name,when,n,ev){name=name.trim().slice(0,40);if(!name)return;const a=S.actions.find(x=>x.name.toLowerCase()===name.toLowerCase());ritTasks().push({id:"r"+Date.now().toString(36),name,n:n||1,when,ct:Date.now(),...(ev>1?{ev}:{}),...(a?{link:a.name}:{})});save()}
// ---- Atelier des rituels : une tuile par rituel, une fiche par rituel, création pas à pas
// Gestes proposés par famille (mêmes familles et mêmes couleurs que le « + » des actions) : [nom, icône, moment]
const RIT_G={
 maison:[["Faire mon lit","lit","matin"],["Ouvrir la fenêtre","fenetre","matin"],["Arroser les plantes","plante","matin"],["Ranger 10 min","armoire","soir"],["Faire la vaisselle","assiette","soir"],["Sortir les poubelles","poubelle","soir"],["Préparer mes affaires","porte","soir"]],
 sport:[["10 pompes","sport","matin"],["20 squats","sport","matin"],["Gainage 1 min","halteres","matin"],["5 min d'étirements","tapis","both"],["Marcher 10 min","pas","soir"]],
 soi:[["Prendre ma douche","douche","matin"],["Se brosser les dents","dents","both"],["Se laver le visage","visage","both"],["Se raser","barbe","matin"],["Prendre mes vitamines","vit","matin"],["Méditer 5 min","medit","both"],["Respirer 3 min","medit","both"],["Écrire 3 choses positives","note","soir"],["Lâcher l'écran avant de dormir","ecran","soir"]],
 nourriture:[["Boire un grand verre d'eau","eau","matin"],["Petit-déjeuner sans écran","repas","matin"],["Manger un fruit","pomme","matin"],["Préparer le repas de demain","poele","soir"]],
 travail:[["Noter ma priorité du jour","note","matin"],["Planifier ma journée","calendrier","matin"],["Vider ma boîte mail","enveloppe","soir"],["Préparer demain","dossier","soir"]],
 divert:[["Lire 10 pages","lire","both"],["Écouter de la musique","casque","soir"],["Jouer 15 min","manette","soir"],["Un épisode","clap","soir"]],
 creer:[["Écrire 4 lignes","note","soir"],["Dessiner 5 min","pinceau","soir"],["Faire un peu de son","micro","soir"],["Prendre une photo","photo","matin"]],
 apprendre:[["Une leçon de langue","bulle","matin"],["Un nouveau mot","ampoule","matin"],["Réviser 10 min","ampoule","soir"]],
 proches:[["Envoyer un message à un proche","tel","soir"],["Appeler un proche","tel","soir"],["Dire un mot gentil","coeur","matin"]]};
// couleurs des familles utilisées par le rituel lui-même (tuile de l'écran Aujourd'hui)
const RIT_DC={maison:"#c08cff",sport:"#ff6a5c",soi:"#4fb4ff",nourriture:"#d9965a",travail:"#6f8fe0",divert:"#9a8cf8",creer:"#ffaa33",apprendre:"#4aa8ee",proches:"#2fe3d6"};
const rwFam=()=>(window.DOMS||[]).filter(d=>RIT_G[d[0]]);
const rwIcons=dom=>[...new Set([...(RIT_G[dom]||[]).map(g=>g[1]),...RIC_KEYS,...(dom?[]:Object.values(RIT_G).flatMap(L=>L.map(g=>g[1])))])].filter(k=>RKI[k]);
const rwSheet=(label,cls)=>{const o=document.createElement("div");o.className="bpop rapop "+(cls||"");o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",label);document.body.appendChild(o);return o};
function ritRhTxt(t){const l=rhLab(t)||"chaque jour";return(t.n>1?t.n+"× · ":"")+l}

// ---- Liste : une tuile par rituel
function ritAtelier(per){per=per||(dayPer()==="soir"?"soir":"matin");const o=rwSheet("Mes rituels","rwa");
  const close=()=>{o.remove();render()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const L=ritTasks(),T=L.filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)===per),PZ=L.filter(t=>!t.bar&&t.pz&&ritPer(t)===per),A=L.filter(t=>!t.bar&&t.auto&&!t.pz&&ritPer(t)===per),sk=ritStreak(),cnt=p=>L.filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)===p).length;
    const tile=(t,cls)=>{const K=ritKind(t);return`<button type="button" class="rwt${cls||""}" data-id="${t.id}" style="--kc:${K.c}"><span class="rwi">${rkSvg(K.k)}</span><b></b><small></small>${t.core?`<span class="rws">${STAR_SVG}</span>`:""}${!cls&&ritWeak(t)?`<i class="rwk" title="Ne tient pas"></i>`:""}</button>`};
    o.innerHTML=`<div class="bpc rap rwp"><div class="raph"><h3>Mes rituels</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
      <div class="raseg" role="tablist">${["matin","soir"].map(p=>`<button type="button" role="tab" data-p="${p}" aria-selected="${p===per}">${p==="matin"?"Matin":"Soir"} · ${cnt(p)}</button>`).join("")}</div>
      ${sk?`<p class="rwsk"><span class="rastar on">${STAR_SVG}</span><b>Socle tenu ${sk} jour${sk>1?"s":""} d'affilée</b></p>`:""}
      <div class="rwl">${T.map(t=>tile(t)).join("")}<button type="button" class="rwt add" aria-label="Ajouter un rituel"><span class="rwi">${ICO("plus",30)}</span><b>Ajouter</b></button></div>
      <p class="rwhint">${T.length>=7?"Au-delà de 7, c'est dur à tenir. ":""}${T.length?"Touche un rituel pour le régler.":"Aucun rituel "+(per==="matin"?"le matin":"le soir")+". Commence par un seul, tout petit."}</p>
      ${PZ.length?`<h4>En pause</h4><div class="rwl">${PZ.map(t=>tile(t," off")).join("")}</div>`:""}
      ${A.length?`<h4>Ancrés, ils vivent seuls</h4><div class="rwl">${A.map(t=>tile(t," off")).join("")}</div>`:""}
      <label class="raord"><input type="checkbox"${S.g.rtAuto!==false?" checked":""}><span>Ranger mes rituels dans l'ordre où je les fais vraiment</span></label></div>`;
    o.querySelectorAll(".rwt[data-id]").forEach(b=>{const t=L.find(x=>x.id===b.dataset.id);b.querySelector("b").textContent=shortName(t.name);b.querySelector("small").textContent=t.pz?"En pause":t.auto?"Automatique":ritRhTxt(t);b.setAttribute("aria-label",t.name+", "+ritRhTxt(t));b.onclick=()=>ritFiche(t,draw)});
    o.querySelector(".rwt.add").onclick=()=>ritNew({per,done:p=>{if(p)per=p;draw()}});
    o.querySelector(".raclose").onclick=close;o.querySelectorAll(".raseg [data-p]").forEach(b=>b.onclick=()=>{per=b.dataset.p;draw()});
    {const ro=o.querySelector(".raord input");ro.onchange=()=>{S.g.rtAuto=ro.checked;save();toast(ro.checked?"Ordre appris activé":"Ordre manuel")}}};
  draw()}

// ---- Fiche d'un rituel : une ligne par réglage, une action par bouton
function ritFiche(t,done){const o=rwSheet("Régler le rituel","rwa rwf");let armed=false,pickIc=false;
  const close=()=>{o.remove();done&&done()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const L=ritTasks(),per=ritPer(t),K=ritKind(t),r=ritRate(t,14),w=ritWeak(t),lg=w&&ritLighter(t),live=!t.auto&&!t.pz;
    o.innerHTML=`<div class="bpc rap rwp" style="--kc:${K.c}"><div class="raph"><span></span><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
      <div class="rwh"><button type="button" class="rwhi" data-a="ic" aria-label="Changer l'icône">${rkSvg(K.k)}</button><input class="rwnm" maxlength="40" aria-label="Nom du rituel"><small>${live?(r==null?"":ritDots(t,14))+`<em>${r==null?"Nouveau : pas encore d'historique":Math.round(r*100)+" % sur 14 jours"}${t.anc?" · ancré":""}</em>`:t.pz?"En pause : il ne compte plus, ni dans ta série ni dans ton historique":"Automatique : il ne charge plus ta liste"}</small></div>
      ${pickIc?`<div class="rwic">${rwIcons().map(k=>`<button type="button" data-ic="${k}" aria-pressed="${K.k===k}" aria-label="Icône ${k}">${rkSvg(k)}</button>`).join("")}</div>`:""}
      ${w?`<div class="rawk"><p>Ce rituel ne tient pas. On l'adapte ?</p><div>${lg?`<button type="button" data-a="lite">${lg.n?"Plutôt "+lg.n+" fois":"« "+esc(lg.name)+" »"}</button>`:""}<button type="button" data-a="mv">Passer au ${per==="matin"?"soir":"matin"}</button><button type="button" data-a="keep">Je le garde</button></div></div>`:""}
      ${t.anc&&!t.auto?`<div class="raanc"><span>Ancré : tu peux le laisser vivre seul.</span><button type="button" data-a="auto">Le rendre automatique</button></div>`:""}
      ${live?`<div class="rwrow">
        <button type="button" data-a="ev"><span>Rythme</span><b>${esc(cap(ritRhTxt(t)))}</b></button>
        <button type="button" data-a="mv"><span>Moment</span><b>${per==="matin"?"Le matin":"Le soir"}</b></button>
        <button type="button" data-a="trg"><span>Déclencheur</span><b>${t.trg?esc(t.trg):"Aucun"}</b></button>
        <button type="button" data-a="core" aria-pressed="${!!t.core}"><span>Dans mes essentiels</span><b class="rwsw${t.core?" on":""}">${STAR_SVG}</b></button></div>
        <div class="rwbt"><button type="button" class="btn" data-a="up">${ICO("chev",14)} Plus tôt</button><button type="button" class="btn" data-a="dn">Plus tard ${ICO("chev",14)}</button></div>`:""}
      <div class="rwbt">${t.pz?`<button type="button" class="btn primary" data-a="unpz">Reprendre</button>`:t.auto?`<button type="button" class="btn primary" data-a="back">Réactiver</button>`:`<button type="button" class="btn" data-a="pz">${PZ_IC} Mettre en pause</button>`}<button type="button" class="btn rwdel${armed?" armed":""}" data-a="rm">${armed?"Oui, supprimer":"Supprimer"}</button></div></div>`;
    const nm=o.querySelector(".rwnm");nm.value=t.name;nm.onchange=()=>{const v=nm.value.trim().slice(0,40);if(v){t.name=v;save()}else nm.value=t.name};
    o.querySelector(".raclose").onclick=close;
    o.querySelectorAll("[data-ic]").forEach(b=>b.onclick=()=>{t.ic=b.dataset.ic;pickIc=false;save();draw()});
    o.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{const a=b.dataset.a;
      if(a==="ic"){pickIc=!pickIc;draw();return}
      if(a==="rm"){if(!armed){armed=true;draw();return}S.daily.tasks=L.filter(x=>x!==t);save();toast("Rituel supprimé");o.remove();done&&done();return}
      if(a==="ev"){rhPick(t,t.name,false,()=>{save();draw()});return}
      if(a==="trg"){trgPick(t,()=>draw());return}
      if(a==="core"){t.core=!t.core;if(t.core)sfx("coin");ritCoreCheck()}
      else if(a==="mv"){t.when=per==="matin"?"soir":"matin";t.wk=Date.now();if(t.trg&&!TRG[ritPer(t)].includes(t.trg))delete t.trg;toast("Passé "+(t.when==="soir"?"au soir":"au matin"))}
      else if(a==="up"||a==="dn"){if(S.g.rtAuto!==false){S.g.rtAuto=false;toast("Ordre manuel activé")}const same=L.filter(x=>!x.bar&&!x.auto&&ritPer(x)===per),i=same.indexOf(t),j=i+(a==="up"?-1:1);if(j<0||j>=same.length)return;const p1=L.indexOf(t),p2=L.indexOf(same[j]);L[p1]=same[j];L[p2]=t}
      else if(a==="lite"){const g=ritLighter(t);if(g.n)t.n=g.n;if(g.name){t.name=g.name;if(t.link&&!S.actions.some(x=>x.name===t.name))delete t.link}t.wk=Date.now();toast("Allégé. Petit et tenu, c'est mieux que grand et oublié")}
      else if(a==="keep"){t.wk=Date.now()}
      else if(a==="auto"){t.auto=1}
      else if(a==="back"){delete t.auto}
      else if(a==="pz"){t.pz=dayKey(Date.now());toast("Rituel en pause")}
      else if(a==="unpz"){const tk=dayKey(Date.now());if(t.pz<tk){if(!Array.isArray(t.pzs))t.pzs=[];t.pzs.push([t.pz,dayKey(Date.now()-864e5)]);t.pzs=t.pzs.slice(-10)}delete t.pz;toast("Rituel repris")}
      armed=false;save();draw()})};
  draw()}

// ---- Création : famille, geste, moment, déclencheur, rythme (même parcours que le « + » des actions)
function ritNew(opt){opt=opt||{};const per0=opt.per||(dayPer()==="soir"?"soir":"matin"),
    st={i:0,dom:"",name:"",ic:"",per:per0,trg:"",rh:{m:"day",n:3,wd:[]},custom:false},STEPS=["dom","geste","when","trg","rh"],p=rwSheet("Créer un rituel","qcw rwa");
  const close=()=>{p.remove();opt.done&&opt.done()};p.onclick=e=>{if(e.target===p)close()};
  const go=d=>{st.i=Math.max(0,Math.min(STEPS.length-1,st.i+d));draw()},auto=()=>setTimeout(()=>go(1),160),DM=()=>rwFam().find(d=>d[0]===st.dom)||[],col=()=>RIT_DC[st.dom]||"var(--gold)";
  const opt3=(L,cur,attr)=>`<div class="qwo">${L.map(([v,l,sm])=>`<button type="button" class="qwb" data-${attr}="${v}" aria-pressed="${cur===v}"><b>${l}</b>${sm?`<small>${sm}</small>`:""}</button>`).join("")}</div>`;
  const finish=el=>{const name=st.name.trim().slice(0,40);if(!name)return;const ts=Date.now(),a=S.actions.find(x=>x.name.toLowerCase()===name.toLowerCase()),t={id:"r"+ts.toString(36),name,n:1,when:st.per,ct:ts,...(st.ic?{ic:st.ic}:{}),...(st.dom?{c:col()}:{}),...(st.trg?{trg:st.trg}:{}),...(a?{link:a.name}:{})};
    rhApply(t,st.rh);ritTasks().push(t);sfx("coin");try{uniBurst(el,st.dom)}catch(e){}save();toast(`Rituel ajouté ${st.per==="soir"?"au soir":"au matin"}`);setTimeout(()=>{p.remove();opt.done&&opt.done(st.per)},260)};
  const draw=()=>{const n=STEPS[st.i];let q="",h="";
    if(n==="dom"){q="Dans quelle famille ?";h=`<div class="rwdg">${rwFam().map(d=>`<button type="button" class="rwdb" data-dom="${d[0]}" style="--cc:${RIT_DC[d[0]]}"><span class="rwi">${rkSvg((window.DUNI[d[0]]||{}).ic||"soleil")}</span><span>${esc(d[1])}</span></button>`).join("")}</div>`}
    else if(n==="geste"){const have=new Set(ritTasks().map(t=>t.name.toLowerCase())),G=(RIT_G[st.dom]||[]).filter(g=>!have.has(g[0].toLowerCase()));q="Quel geste ?";
      h=st.custom?`<input class="qcname qwname rwname" maxlength="40" placeholder="Ex. Boire un verre d'eau" aria-label="Nom du rituel"><p class="qwsub">Choisis son icône :</p><div class="rwic">${rwIcons(st.dom).map(k=>`<button type="button" data-ic="${k}" aria-pressed="${(st.ic||icFromName(st.name)||"")===k}" aria-label="Icône ${k}">${rkSvg(k)}</button>`).join("")}</div><button type="button" class="btn primary qwnext rwnext"${st.name.trim()?"":" disabled"}>Suivant</button>`
        :`<div class="rwgg" style="--cc:${col()}">${G.map((g,i)=>`<button type="button" class="rwgb" data-g="${i}"><span class="rwi">${rkSvg(g[1])}</span><b></b></button>`).join("")}<button type="button" class="rwgb own" data-own="1"><span class="rwi">${ICO("plus",26)}</span><b>Écrire le mien</b></button></div>`}
    else if(n==="when"){q="Le matin ou le soir ?";h=`<div class="rwmm">${[["matin","Le matin","soleil","Au réveil, pour bien démarrer"],["soir","Le soir","lune","Avant de dormir, pour finir la journée"]].map(([v,l,ic,sm])=>`<button type="button" class="rwmb" data-per="${v}" aria-pressed="${st.per===v}"><span class="rwi">${rkSvg(ic)}</span><b>${l}</b><small>${sm}</small></button>`).join("")}</div>`}
    else if(n==="trg"){q="Après quoi ?";h=`<p class="qwsub">Accroche-le à un moment précis : tu l'oublieras moins.</p><div class="qwo rwtg">${[["","Peu importe","Il reste dans ta liste, sans heure"],...TRG[st.per].map(x=>[x,x,""])].map(([v,l,sm],i)=>`<button type="button" class="qwb" data-trg="${i}" aria-pressed="${st.trg===v}"><b></b>${sm?`<small>${sm}</small>`:""}</button>`).join("")}</div><form class="trgf rwtf"><input maxlength="30" placeholder="Ou écris le tien : après…" aria-label="Mon déclencheur"><button type="submit" class="btn primary">OK</button></form>`}
    else{q="À quel rythme ?";const M=[["day","Chaque jour",""],["ev2","Un jour sur deux",""],["xw","Quelques fois par semaine",""],["wd","Certains jours",""]];
      h=opt3(M,st.rh.m,"rh")+(st.rh.m==="xw"?`<div class="rhx qwx"><button type="button" class="rhpm" data-d="-1" aria-label="Moins">−</button><b>${st.rh.n} fois</b><button type="button" class="rhpm" data-d="1" aria-label="Plus">+</button><span>par semaine</span></div>`:"")
        +(st.rh.m==="wd"?`<div class="rhw qwx">${WDL.map((l,i)=>`<button type="button" data-wd="${i}" aria-pressed="${st.rh.wd.includes(i)}" aria-label="${WDN[i]}">${l}</button>`).join("")}</div><div class="rhq"><button type="button" class="lnk" data-q="sem">En semaine</button><button type="button" class="lnk" data-q="we">Le week-end</button></div>`:"")
        +((st.rh.m==="xw"||st.rh.m==="wd")?`<button type="button" class="btn primary rwgo"${st.rh.m==="wd"&&!st.rh.wd.length?" disabled":""}>Ajouter ce rituel</button>`:"")}
    const chip=st.dom&&n!=="dom"?`<span class="rwcrumb" style="--cc:${col()}">${rkSvg((window.DUNI[st.dom]||{}).ic||"soleil")}${esc(DM()[1]||"")}${st.name&&n!=="geste"?" · "+esc(shortName(st.name)):""}</span>`:"";
    p.innerHTML=`<div class="bpc rap qc qwz rwp"><div class="qwh">${st.i>0?`<button type="button" class="qwback" aria-label="Retour">${ICO("chev",18)}</button>`:"<span></span>"}<span class="qwprog" aria-label="Étape ${st.i+1} sur ${STEPS.length}">${STEPS.map((_,i)=>`<i class="${i<=st.i?"on":""}"></i>`).join("")}</span><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>${chip}<h3 class="qwq">${q}</h3><div class="qwbody">${h}</div></div>`;
    p.querySelector(".raclose").onclick=close;{const b=p.querySelector(".qwback");if(b)b.onclick=()=>{if(n==="geste"&&st.custom){st.custom=false;draw()}else go(-1)}}
    p.querySelectorAll("[data-dom]").forEach(b=>{b.onclick=()=>{st.dom=b.dataset.dom;st.custom=false;sfx("blip");auto()}});
    {const G=(RIT_G[st.dom]||[]).filter(g=>!new Set(ritTasks().map(t=>t.name.toLowerCase())).has(g[0].toLowerCase()));p.querySelectorAll("[data-g]").forEach(b=>{const g=G[+b.dataset.g];b.querySelector("b").textContent=g[0];b.onclick=()=>{st.name=g[0];st.ic=g[1];if(g[2]!=="both")st.per=g[2];sfx("blip");auto()}})}
    {const b=p.querySelector("[data-own]");if(b)b.onclick=()=>{st.custom=true;draw()}}
    {const nm=p.querySelector(".rwname");if(nm){nm.value=st.name;const nb=p.querySelector(".rwnext");nm.oninput=()=>{st.name=nm.value;nb.disabled=!st.name.trim()};nm.onkeydown=e=>{if(e.key==="Enter"&&st.name.trim()){e.preventDefault();nb.click()}};nb.onclick=()=>{if(!st.ic)st.ic=icFromName(st.name)||"";go(1)};setTimeout(()=>nm.focus({preventScroll:true}),60)}}
    p.querySelectorAll(".rwic [data-ic]").forEach(b=>b.onclick=()=>{st.ic=b.dataset.ic;const v=(p.querySelector(".rwname")||{}).value;draw();const nm=p.querySelector(".rwname");if(nm&&v!=null)nm.value=v})
    p.querySelectorAll("[data-per]").forEach(b=>b.onclick=()=>{st.per=b.dataset.per;if(st.trg&&!TRG[st.per].includes(st.trg))st.trg="";sfx("blip");draw();auto()});
    {const L=[["",""],...TRG[st.per].map(x=>[x,x])];p.querySelectorAll("[data-trg]").forEach(b=>{const x=L[+b.dataset.trg];if(x[0])b.querySelector("b").textContent=x[0];else b.querySelector("b").textContent="Peu importe";b.onclick=()=>{st.trg=x[0];draw();auto()}});
      const f=p.querySelector(".rwtf");if(f)f.onsubmit=e=>{e.preventDefault();const v=f.querySelector("input").value.trim();if(v){st.trg=cap(v).slice(0,30);draw();auto()}}}
    p.querySelectorAll("[data-rh]").forEach(b=>b.onclick=()=>{st.rh.m=b.dataset.rh;if(st.rh.m==="wd"&&!st.rh.wd.length)st.rh.wd=[wdOf(dayKey(Date.now()))];if(st.rh.m==="day"||st.rh.m==="ev2"){finish(b);return}draw()});
    p.querySelectorAll(".rhpm").forEach(b=>b.onclick=()=>{st.rh.n=Math.max(1,Math.min(6,st.rh.n+ +b.dataset.d));draw()});
    p.querySelectorAll("[data-wd]").forEach(b=>b.onclick=()=>{const i=+b.dataset.wd;st.rh.wd=st.rh.wd.includes(i)?st.rh.wd.filter(x=>x!==i):[...st.rh.wd,i];draw()});
    p.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{st.rh.wd=b.dataset.q==="sem"?[0,1,2,3,4]:[5,6];draw()});
    {const g=p.querySelector(".rwgo");if(g)g.onclick=()=>finish(g)}};
  draw()}
