// Journal de bord (28/10, piste D) : la journée en liste, comme un carnet.
// Trois sections : le moment (Ce matin / Cet après-midi / Ce soir), Mes engagements, Plus tard aujourd'hui.
// Une ligne = grande icône, nom, petite info, case à cocher à droite. Ce qui est fait reste grisé avec son heure (replié au-delà de 3).
// Tout passe par les fonctions existantes (ritTap, plateOpen, mealQuick, enSet, todoGo, closeOpen…) : aucune donnée nouvelle.
// Les anciens blocs (rituels, énergie, à faire, fin de journée) sont remplacés ; la nuit (#ritLife) et le choix des engagements (#engBox) y sont déplacés.
const JD_CHAIN={douche:["barbe"]};   // enchaînements : la barbe suit la douche
let jdOpenDone=false,jdOpenMorn=false;
const jdEl=ev=>(ev&&ev.currentTarget)||document.body;
function jdFmt(t){const d=new Date(t);return d.getHours()+" h "+String(d.getMinutes()).padStart(2,"0")}
function jdLast(name,tk){const e=[...(S.log||[])].reverse().find(x=>dayKey(x.t)===tk&&x.name===name);return e?e.t:0}
function jdDays(s,e,wd){let n=0;for(let d=new Date(s+"T12:00");dayKey(d.getTime())<=e;d.setDate(d.getDate()+1)){const w=d.getDay();if(!wd||(w>0&&w<6))n++}return n}
function jdRow(o){return`<li class="jdl${o.ok?" ok":""}${o.sub?" sub":""}${o.w?" w":""}"${o.k?` data-j="${o.k}"`:""}><span class="jdi">${o.ic}</span><span class="jdt"><b>${esc(o.n)}</b>${o.s?`<small>${o.s}</small>`:""}</span>${o.r!==undefined?o.r:`<button type="button" class="btn jdck" aria-label="${o.ok?"Défaire : ":"Cocher : "}${esc(o.n)}" title="${o.ok?"Fait":"Cocher"}" aria-pressed="${!!o.ok}">${o.ok?ICO("check",24):""}</button>`}</li>`}
function jdHead(t,c){return`<div class="head"><h2>${t}${c?`<span class="count">${c}</span>`:""}</h2></div>`}
function renderJdb(){const A=document.getElementById("jdNow"),B=document.getElementById("jdEng"),C=document.getElementById("jdLater");if(!A||!B||!C||!S||!S.g)return;
  // la nuit et le choix des engagements sont déplacés ici : on les remet à leur place avant de réécrire, pour ne pas les perdre
  {const rl=document.getElementById("ritLife"),dq=document.getElementById("dqBox"),eb=document.getElementById("engBox");if(rl&&dq&&!dq.contains(rl))dq.appendChild(rl);if(eb&&B.contains(eb))B.after(eb)}
  const G=S.g,tk=dayKey(Date.now()),h=dayH(),P=dayPer(),PER=P==="nuit"?null:P,act={};let id=0;const reg=(f)=>{const k="j"+(id++);act[k]=f;return k};
  // ---- le moment
  const now=[],done=[];
  if(P==="matin"&&!(G.sleep||{})[tk]||P==="matin"&&typeof sleepEdit!=="undefined"&&sleepEdit)now.push(`<li class="jdl jdnuit"><span class="jdi">${rkSvg("lune")}</span><span class="jdt"><b>Ta nuit</b><span class="jdph" data-ph="ritLife"></span></span></li>`);
  else if(P==="matin"&&(G.sleep||{})[tk])done.push(jdRow({ic:rkSvg("lune"),n:"Ta nuit",s:fmtH(G.sleep[tk].h)+" de sommeil",ok:1,k:reg(()=>{try{sleepEdit=true;renderLife();renderJdb()}catch(e){}})}));
  {let en=0;try{en=enOf()}catch(e){}if(P==="matin"&&h<14&&!en)now.push(jdRow({w:1,ic:rkSvg("batterie"),n:"Ton énergie",s:"Pour régler ta journée",r:`<span class="jdmini">${[[1,"Faible"],[2,"Moy."],[3,"Pleine"]].map(([v,l])=>`<button type="button" class="btn" data-k="${reg(()=>enSet(v))}">${l}</button>`).join("")}</span>`}));
    else if(en&&P==="matin")done.push(jdRow({ic:rkSvg("batterie"),n:"Ton énergie",s:["","Faible","Moyenne","Pleine"][en],ok:1,r:""}))}
  // rituels des jours d'avant à rattraper (le bloc d'origine reste la source : on appuie sur ses boutons)
  {let P=[];try{P=rtrPending()}catch(e){}const n=P.reduce((a,p)=>a+p.L.length,0);if(n){const lab=P.length===1?rtrLab(P[0].i):"Ces derniers jours";const tap=sel=>()=>{try{renderRtr();const b=document.querySelector("#rtrBox "+sel);if(b)b.click()}catch(e){}};
    now.push(jdRow({w:1,ic:rkSvg("sablier"),n:n+" rituel"+(n>1?"s":"")+" à rattraper",s:lab+" : tu les as faits ?",r:`<span class="jdmini"><button type="button" class="btn" data-k="${reg(tap(".rtrno"))}">Non</button><button type="button" class="btn primary" data-k="${reg(tap(".rtrgo1"))}">Fait</button></span>`}))}}
  // rituels du moment (le soir : à partir de 20 h)
  const ritOn=PER&&!(PER==="soir"&&h<RIT_SOIR_H);
  const RT=ritOn?ritOrder(ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)===PER&&ritDue(t))):[];
  const kindOf=t=>{try{return ritKind(t).k}catch(e){return""}},used=new Set();
  RT.forEach(t=>{if(used.has(t.id))return;used.add(t.id);const c=S.daily.c[t.id]||0,ok=c>=t.n,K=kindOf(t),at=ok?jdLast(t.name,tk):0;
    const row=info=>jdRow({ic:(()=>{try{const k=ritKind(t);return rkSvg(k.k,k.c)}catch(e){return rkSvg("check")}})(),n:t.name,s:ok?(at?"Fait à "+jdFmt(at):"Fait"):t.n>1?c+" / "+t.n:info||"",ok,k:reg(ev=>{if(ok){try{ritUntap(t)}catch(e){}}else ritTap(t,jdEl(ev),ev)})});
    const chain=(JD_CHAIN[K]||[]).map(k=>RT.find(x=>!used.has(x.id)&&kindOf(x)===k)).filter(Boolean);
    (ok?done:now).push(row(chain.length&&!ok?"puis "+chain.map(x=>x.name.toLowerCase()).join(", "):""));
    chain.forEach(x=>{used.add(x.id);const c2=S.daily.c[x.id]||0,ok2=c2>=x.n,at2=ok2?jdLast(x.name,tk):0;(ok2?done:now).push(jdRow({ic:(()=>{try{const k=ritKind(x);return rkSvg(k.k,k.c)}catch(e){return""}})(),n:x.name,s:ok2?(at2?"Fait à "+jdFmt(at2):"Fait"):"enchaîné après "+t.name.toLowerCase(),ok:ok2,sub:!ok&&!ok2,k:reg(ev=>{if(ok2){try{ritUntap(x)}catch(e){}}else ritTap(x,jdEl(ev),ev)})}))})});
  // l'eau : une ligne avec son compteur
  {const w=ritTasks().find(t=>t.bar==="eau");if(w&&PER){const c=S.daily.c[w.id]||0;(c>=w.n?done:now).push(jdRow({ic:rkSvg("eau"),n:"Verres d'eau",s:c+" / "+w.n,ok:c>=w.n,r:c>=w.n?"":`<button type="button" class="btn jdck" aria-label="Un verre d'eau" title="Un verre" data-k="${reg(ev=>ritTap(w,jdEl(ev),ev))}">${ICO("plus",24)}</button>`}))}}
  // repas dont l'heure est passée
  MEALS.forEach(([k,per,l,ic])=>{if(h<MEAL_H[k])return;const s=mealState(k,per),pl=typeof plateOpen==="function"&&MB_PLM.includes(k);
    if(s)done.push(jdRow({ic:pxImg(ic,3),n:l,s:s==="ok"?"Pris":"Sauté",ok:1,k:reg(()=>{if(pl&&s==="ok")plateOpen(per,k,document.body);else{try{mealClear(dayKey(Date.now()),per,k);save();render()}catch(e){}}})}));
    else now.push(jdRow({ic:pxImg(ic,3),n:l,s:pl?"Remplir l'assiette":"Pris ou sauté",r:`<span class="jdmini">${pl?"":`<button type="button" class="btn" data-k="${reg(ev=>mealQuick(per,k,jdEl(ev),0,ev))}">Sauté</button>`}<button type="button" class="btn ${pl?"primary":""}" data-k="${reg(ev=>pl?plateOpen(per,k,jdEl(ev)):mealQuick(per,k,jdEl(ev),1,ev))}">${pl?"Assiette":"Pris"}</button></span>`}))});
  // le soir avant 20 h : ce qui reste du matin, replié
  let morn="";if(PER==="soir"){const RM=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)==="matin"&&ritDue(t)&&(S.daily.c[t.id]||0)<t.n);
    if(RM.length)morn=`<li class="jdl jdmore"><button type="button" class="jdfold" data-k="${reg(()=>{jdOpenMorn=!jdOpenMorn;renderJdb()})}"><span>Encore possible du matin</span><span class="count">${RM.length}</span><span class="jdchev${jdOpenMorn?" up":""}">${ICO("chev",18)}</span></button></li>`+(jdOpenMorn?RM.map(t=>jdRow({ic:(()=>{try{const k=ritKind(t);return rkSvg(k.k,k.c)}catch(e){return""}})(),n:t.name,k:reg(ev=>ritTap(t,jdEl(ev),ev))})).join(""):"")}
  const rtm=PER&&ritOn&&rtmSteps(PER).length>1?`<button type="button" class="btn primary jdrtm" data-k="${reg(()=>rtmOpen())}">${ICO("play",24)}Tout faire en routine</button>`:"";
  const tot=now.length+done.length,shownDone=done.length>3&&!jdOpenDone?`<li class="jdl jdmore"><button type="button" class="jdfold" data-k="${reg(()=>{jdOpenDone=true;renderJdb()})}"><span>${done.length} faits</span><span class="jdchev">${ICO("chev",18)}</span></button></li>`:done.join("");
  const ttl=h<12?"Ce matin":h<18?"Cet après-midi":"Ce soir";
  A.innerHTML=`${jdHead(ttl,tot?done.length+"/"+tot:"")}<ul class="jdlist">${shownDone}${now.join("")}${morn}</ul>${rtm}${!tot&&!morn?`<p class="vide">Rien à cocher pour l'instant.</p>`:""}`;
  {const ph=A.querySelector('[data-ph="ritLife"]'),rl=document.getElementById("ritLife");if(ph&&rl){rl.hidden=false;ph.replaceWith(rl)}}
  // ---- mes engagements : ceux du jour, les cigarettes, le contrat
  const eng=[];const T=typeof engToday==="function"?engToday():[],cigOn=!!(((G.vie||{}).track||{}).cig),cig=(G.cig||{})[tk]||0,cy=(G.cig||{})[dayKey(Date.now()-864e5)]||0;
  const pm=`<span class="jdpm"><button type="button" class="btn" aria-label="Retirer une cigarette" data-k="${reg(()=>{G.cig[tk]=Math.max(0,cig-1);save();render()})}"${cig?"":" disabled"}>−</button><b class="ui-compteur">${cig}</b><button type="button" class="btn" aria-label="Ajouter une cigarette" data-k="${reg(()=>{if(!G.cig||typeof G.cig!=="object")G.cig={};G.cig[tk]=cig+1;save();render()})}">+</button></span>`;
  let cigShown=false;
  T.forEach(e=>{const isC=e.id==="cig"||e.id==="cigmax";if(isC)cigShown=true;const st=e.res===1?"Tenu":e.res===0?"Pas cette fois":e.id==="cigmax"?cig+" / "+e.lim+" · hier "+cy:e.id==="cig"?"hier "+cy:"Ce soir dans Bonne nuit";
    eng.push(jdRow({ic:engIc(e.id),n:e.n,s:st,ok:e.res===1,r:isC&&e.res===undefined?pm:""}))});
  if(cigOn&&!cigShown)eng.push(jdRow({ic:rkSvg("cigarette"),n:"Cigarettes",s:"hier "+cy,r:pm}));
  const pOk=G.perOk&&typeof G.perOk==="object"?G.perOk:{};
  (G.per||[]).filter(p=>p.t==="contrat").forEach(p=>{const fin=tk>=p.e,closed=pOk[p.id]&&(S.log||[]).some(e=>e.a==="contrat"&&e.name==="Contrat terminé : "+p.name);if(closed||tk<p.s)return;if(fin&&(Date.parse(tk)-Date.parse(p.e))/864e5>21)return;
    const tot=jdDays(p.s,p.e,p.wd),dn=Math.min(tot,jdDays(p.s,tk>p.e?p.e:tk,p.wd)),pc=tot?Math.round(dn/tot*100):0;
    eng.push(jdRow({ic:rkSvg("chantier"),n:p.name,s:fin?"Terminé, bravo : touche la coche":`Jour ${Math.max(dn,1)} sur ${tot}<span class="ui-barre jdbar"><i style="width:${pc}%"></i></span>`,r:fin?`<button type="button" class="btn primary jdck" aria-label="Clore : ${esc(p.name)}" title="Clore" data-k="${reg(ev=>{if(!G.perOk||typeof G.perOk!=="object")G.perOk={};G.perOk[p.id]=Date.now();complete({id:"contrat",cat:"travail",name:"Contrat terminé : "+p.name,xp:50},jdEl(ev),ev)})}">${ICO("check",24)}</button>`:""}))});
  const choose=typeof engS==="function"&&!T.length&&engS().skip!==tk&&h<12;
  B.innerHTML=`${jdHead("Mes engagements",T.length?T.filter(e=>e.res===1).length+"/"+T.length:"")}${choose?`<span class="jdph" data-ph="engBox"></span>`:""}<ul class="jdlist">${eng.join("")}</ul>`;
  {const ph=B.querySelector('[data-ph="engBox"]'),eb=document.getElementById("engBox");if(ph&&eb)ph.replaceWith(eb)}
  B.classList.toggle("voff",!choose&&!eng.length);
  // ---- plus tard aujourd'hui : repas à venir, calendrier, à faire, Bonne nuit
  const later=[];
  MEALS.forEach(([k,per,l,ic])=>{if(h>=MEAL_H[k]||mealState(k,per))return;later.push(jdRow({ic:pxImg(ic,3),n:l,s:"à partir de "+MEAL_H[k]+" h"+(MB_PLM.includes(k)?" · dans l'assiette":""),r:""}))});
  try{evList().filter(e=>e.inD===0&&!e.done).forEach(e=>later.push(jdRow({ic:rkSvg(e.k==="bd"?"cake":"calendrier"),n:e.n,s:e.k==="bd"?"C'est aujourd'hui":"Dans ton calendrier",r:"",k:reg(()=>{if(e.k==="bd"){try{openProfile(e.who)}catch(_){}}else{try{showView("c");cGoSub("vie");setTimeout(()=>{const x=document.getElementById("evtBox");if(x)x.scrollIntoView({behavior:"smooth",block:"start"})},150)}catch(_){}}})})))}catch(e){}
  if(typeof todoL==="function"){todoL().filter(x=>x.d===tk).forEach(x=>{const d=todoDone(x),it=todoItem(x),ik=it&&it.k==="fam"?uIc(it.f.id,it.opt):"etoile";
    later.push(jdRow({ic:RKI[ik]?rkSvg(ik):rkSvg("etoile"),n:x.n,s:d?"Fait":"À faire",ok:d,r:d?"":undefined,k:d?"":reg(ev=>todoGo(x,jdEl(ev),ev))}))})}
  {const J=(G.jr||{})[tk]||{};later.push(jdRow({ic:rkSvg("lune"),n:"Bonne nuit",s:J.at?"Journée close · touche pour revoir":"Ton bilan de la journée",ok:!!J.at,r:J.at?"":`<button type="button" class="btn jdgo" data-k="${reg(()=>closeOpen(1))}">Bonne nuit</button>`,k:J.at?reg(()=>{try{dayRecap(false)}catch(e){}}):""}))}
  C.innerHTML=`${jdHead("Plus tard aujourd'hui")}<ul class="jdlist">${later.join("")}</ul>`;
  // ---- actions
  [A,B,C].forEach(box=>{box.querySelectorAll("[data-k]").forEach(b=>{const f=act[b.dataset.k];if(f)b.onclick=ev=>{ev.stopPropagation();f(ev)}});
    box.querySelectorAll("li[data-j]").forEach(li=>{const f=act[li.dataset.j];if(!f)return;const ck=li.querySelector(".jdck:not([data-k])");if(ck)ck.onclick=ev=>{ev.stopPropagation();f(ev)};else if(!li.querySelector("[data-k]"))li.onclick=ev=>f(ev)})})}
