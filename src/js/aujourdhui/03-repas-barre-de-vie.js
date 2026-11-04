// ---- Bilan repas de fin de moment : récompense les extras, pénalise un repas sauté
const MB={matin:[["pdej","Petit-déjeuner",10,-10,"cup"],["dej","Déjeuner",10,-10,"plate"]],soir:[["gouter","Goûter",5,0,"cookie"],["diner","Dîner",10,-10,"plate"]]},MB_W=3;
const MB_PL=[["l","Légumes","veg"],["p","Protéines","meat"],["f","Féculents","rice"]],MB_PLM=["dej","diner"],MB_PLX=2,MB_PLB=4;
const MB_EX=[["fromage","Fromage","cheese",5],["yaourt","Yaourt","yogurt",5],["vege","Journée végé","veg",10,"soir"]];
const MB_V=[["junk","Mal mangé","burger",-10],["smoke","Fumé","smoke",-15],["drink","Bu de l'alcool","wine",-15],["soda","Bu du soda","soda",-5]],MB_CLEAN=10;
const mbDraft={};
const MEAL_H={pdej:0,dej:11,gouter:16,diner:19};
function mbDr(key){const MBD=(S.g.mbd&&typeof S.g.mbd==="object")?S.g.mbd:(S.g.mbd={});const dr=MBD[key]=MBD[key]||{m:{},ex:{},w:{}};dr.pl=dr.pl||{};dr.v=dr.v||{};dr.cr=dr.cr||{};return dr}
// Revenir sur un repas noté (pris ou sauté) : on efface la note du jour, et l'XP s'il avait été noté « pris » ; v = 1 pris, 0 sauté, null effacer
function mealClear(tk,per,k){const key=tk+":"+per,dr=mbDr(key),M=MB[per].find(x=>x[0]===k),G=S.g;
  if(dr.m[k]===1&&M){const e=[...S.log].reverse().find(x=>x.a==="mb"&&x.name===M[1]&&dayKey(x.t)===tk);if(e){S.log=S.log.filter(x=>x!==e);S.xp=Math.max(0,S.xp-e.xp);if(e.cat&&S.stats[e.cat]!=null)S.stats[e.cat]=Math.max(0,S.stats[e.cat]-e.xp)}}
  delete dr.m[k];delete dr.cr[k];delete dr.w[k];
  if(G.mb&&G.mb[key]){if(G.mb[key].auto)delete G.mb[key];else if(G.mb[key].m)delete G.mb[key].m[k]}}
function mealSet(per,k,v,btn,ev){mealClear(dayKey(Date.now()),per,k);if(v===0||v===1)mealQuick(per,k,btn,v,ev);else{save();render();toast("Repas effacé")}}
function mealQuick(per,k,btn,v,ev,bx,extra){const tk=dayKey(Date.now()),key=tk+":"+per,dr=mbDr(key),M=MB[per].find(x=>x[0]===k);if(!M)return;const[,l,p]=M;
  if(dr.cr[k]||dr.m[k]===0||dr.m[k]===1||(S.g.mb&&S.g.mb[key])){render();return}
  dr.m[k]=v;delete dr.w[k];dr.cr[k]=1;if(btn){btn.disabled=true;const it=btn.closest(".dqi");if(it)it.classList.add("leave")}
  if(v===1&&p>0)complete({id:"mb",cat:"nourriture",name:l,xp:p+(bx||0)},btn,ev,false,extra);else{save();render();toast(l+(v?" noté":" sauté"))}}

// ---- Barre de vie : se remplit avec les repas, l'eau et les extras du jour
const HP_MEAL={pdej:20,dej:25,gouter:10,diner:25},HP_W=5,HP_EX=5,HP_SKIP=-15;
function hpOf(day){const G=S.g;if(!G||!G.mb)return{v:0,n:0,skip:0};let v=0,n=0,skip=0;
  ["matin","soir"].forEach(per=>{let b=G.mb[day+":"+per];if(!b){const dr=(G.mbd||{})[day+":"+per];if(dr&&dr.cr&&Object.keys(dr.cr).length){const m={},ex={};Object.keys(dr.cr).forEach(k=>{if(dr.m&&dr.m[k]!=null)m[k]=dr.m[k]});Object.keys(dr.exc||{}).forEach(k=>ex[k]=true);b={m,w:dr.w||{},ex}}}if(!b)return;n++;Object.entries(b.m||{}).forEach(([k,x])=>{if(x===1){v+=HP_MEAL[k]||0;if(b.w&&b.w[k])v+=HP_W}else if(x===0){v+=HP_SKIP;skip++}});Object.values(b.ex||{}).forEach(x=>{if(x)v+=HP_EX});Object.entries(b.v||{}).forEach(([k,x])=>{if(x===1)v-=10})});
  return{v:Math.max(0,Math.min(100,v)),n,skip}}
function hpHtml(h){const lvl=h.v>=70?"hi":h.v>=35?"mid":"lo";return`<span class="hpic">${pxImg("heart",2)}</span><span class="hpbar ${lvl}" role="progressbar" aria-label="Points de vie du jour" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${h.v}"><i style="width:${h.v}%"></i></span><span class="hpt"><b>${h.v}</b>/100 PV</span>`}
function renderHp(){const q0=$("qHpRow");if(q0){q0.innerHTML="";q0.hidden=true}const p0=$("pfHp");if(p0){p0.innerHTML="";p0.hidden=true}return;if(!S.g)return;const tk=dayKey(Date.now()),h=hpOf(tk),html=hpHtml(h);
  const q=$("qHpRow");if(q&&q.__h!==html){q.__h=html;q.innerHTML=html}
  const p=$("pfHp");if(p){const sub=h.n===0?"Remplie par tes bilans repas":h.v>=100?"En pleine forme !":h.skip?"Un repas sauté aujourd'hui":"Continue de bien manger";const ph=html+`<small class="hps">${sub}</small>`;if(p.__h!==ph){p.__h=ph;p.innerHTML=ph}}
  const G=S.g;
  if(h.v>=100&&G.hpFull!==tk){G.hpFull=tk;setTimeout(()=>{const prev=levelInfo(S.xp).l;addBonus("Barre de vie pleine",10,0,"hp");save();render(prev);toast(`Barre de vie pleine ! <span class="p">+10 XP</span>`)},700)}
  if(G.hpWarn!==tk&&dayPer()!=="nuit"){const days=[1,2,3].map(i=>dayKey(Date.now()-i*864e5)),past=days.map(hpOf);if(past.every(x=>x.n>0&&x.v<40)){G.hpWarn=tk;setTimeout(()=>toast("Ta barre de vie est basse depuis quelques jours. Prends le temps de bien manger aujourd'hui."),1500)}}}
function pzDays(){const G=S.g,out=[];if(!G||!Array.isArray(G.pz))return out;G.pz.forEach(p=>{const d=new Date(p.from+"T12:00");let n=0;while(dayKey(d)<=p.to&&n++<60){out.push(dayKey(d));d.setDate(d.getDate()+1)}});return out}
function pzActive(day){const G=S.g;day=day||dayKey(Date.now());return G&&Array.isArray(G.pz)?G.pz.find(p=>p.from<=day&&day<=p.to)||null:null}
const PZ_MAX=14;
function pzLeft(){const y=dayKey(Date.now()).slice(0,4);return Math.max(0,PZ_MAX-pzDays().filter(k=>k.startsWith(y)).length)}
function protDays(){const G=S.g;if(!G)return[];return[...(G.offs||[]),...pzDays(),...(G.jokD||[]),...(typeof evmDays==="function"?evmDays():[])]}
function isOff(day){day=day||dayKey(Date.now());return!!(S.g&&((Array.isArray(S.g.offs)&&S.g.offs.includes(day))||pzActive(day)))}
function pzOpen(){const G=S.g,left=pzLeft();if(!left){toast("Plus de jours de pause cette année");return}let k="malade",n=Math.min(3,left);
  const o=document.createElement("div");o.className="bpop rapop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Pause");document.body.appendChild(o);o.onclick=e=>{if(e.target===o)o.remove()};
  const draw=()=>{const end=new Date();end.setDate(end.getDate()+n-1);o.innerHTML=`<div class="bpc rap pzp"><div class="raph"><h3>Faire une pause</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
    <p class="rtrhint">Série gelée · ${left} jour${left>1?"s":""} de pause restant${left>1?"s":""}</p>
    <div class="raseg">${[["malade","Malade"],["vacances","Vacances"]].map(([v,l])=>`<button type="button" data-k="${v}" aria-selected="${k===v}">${l}</button>`).join("")}</div>
    <div class="pzn"><button type="button" class="btn" data-d="-1" aria-label="Un jour de moins">−</button><b>${n} jour${n>1?"s":""}</b><button type="button" class="btn" data-d="1" aria-label="Un jour de plus">+</button></div>
    <p class="rtrhint" style="text-align:center">Jusqu'au ${end.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})} inclus</p>
    <button type="button" class="btn primary rtrgo pzgo">Démarrer la pause</button></div>`;
    o.querySelector(".raclose").onclick=()=>o.remove();o.querySelectorAll(".raseg button").forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
    o.querySelectorAll(".pzn button").forEach(b=>b.onclick=()=>{n=Math.max(1,Math.min(left,n+(+b.dataset.d)));draw()});
    o.querySelector(".pzgo").onclick=()=>{if(!Array.isArray(G.pz))G.pz=[];const tk=dayKey(Date.now());G.pz.push({k,from:tk,to:dayKey(end)});G.rtr=[...(G.rtr||[]),dayKey(Date.now()-864e5)];o.remove();save();render();sfx("moment");toast(k==="malade"?"Pause activée. Soigne-toi bien.":"Pause activée. Bonnes vacances !")}};
  draw()}
function pzStop(){const G=S.g,tk=dayKey(Date.now()),p=pzActive();if(!p)return;if(p.from<tk)p.to=dayKey(Date.now()-864e5);else G.pz=G.pz.filter(x=>x!==p);save();render();toast("Content de te revoir. Ta série reprend aujourd'hui.")}
function softMood(){if(window.vieSoft&&vieSoft())return true;const G=S.g,tk=dayKey(Date.now());return!!(G&&G.softAuto!==false&&G.mood&&G.mood[tk]>0&&G.mood[tk]<=2&&G.softAll!==tk&&!isOff())}
function isSoft(day){day=day||dayKey(Date.now());const G=S.g;if(!G)return false;if(isOff(day))return true;if(/-(12-24|12-25|12-31|01-01)$/.test(day))return true;return G.softAuto!==false&&G.mood&&G.mood[day]>0&&G.mood[day]<=2}
function offLeft(){const G=S.g,w=mondayOf(Date.now()).getTime();return(G.offs||[]).filter(d=>new Date(d+"T12:00").getTime()>=w).length?0:1}
function takeOff(){const G=S.g;if(!Array.isArray(G.offs))G.offs=[];const tk=dayKey(Date.now());if(G.offs.includes(tk)||!offLeft())return;G.offs.push(tk);save();render();sfx("moment");toast("Jour off : ta série est protégée et rien ne compte contre toi aujourd'hui. Repose-toi.")}
function lateNight(){const m=adjH()*60;return S.g&&S.g.curfew!==false&&(m>=23*60+30||m<5*60)}
function dayPer(){const h=adjH();return h>=8&&h<15?"matin":h>=15||h<4?"soir":"nuit"}
function ritPer(t){return t.when==="soir"?"soir":"matin"}

const RARE={secret:["Quête secrète","une quête rare t'attend","#9b5de5"]};
// plus d'indicateurs dans les boutons (appui long, minuteur, écran) : retirés à la demande d'Ilario ; les gestes restent
function tagVK(){document.querySelectorAll(".vk").forEach(i=>i.remove())}
let nowRaf=0;function schedNow(){if(nowRaf)return;nowRaf=requestAnimationFrame(()=>{nowRaf=0;renderNow();tagVK()})}
function renderNow(){const box=$("nowBox");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now());let h="",set=false;
  if(G.rare&&G.rare.d===tk&&RARE[G.rare.k]&&!G.rare.seen){const R0=RARE[G.rare.k];h+=`<div class="rarec rare1" style="--rc:${R0[2]}"><b>${R0[0]}<span class="rared"> : ${R0[1]}</span></b><button type="button" class="rarex" aria-label="OK">${ICO("check",16)}</button></div>`}
  if(lateNight()){h+=`<div class="nowc night"><span class="nowk">Il est tard</span><b>Le reste attendra demain</b><small>Pose le téléphone. Bonne nuit.</small></div>`}
  else if(pzActive()){const P=pzActive();h+=`<div class="nowc off"><span class="nowk">En pause · ${P.k==="malade"?"malade":"vacances"}</span><b>${P.k==="malade"?"Soigne-toi":"Profite"}</b><small>Série gelée jusqu'au ${new Date(P.to+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}.</small></div>`}
  else if(isOff()){h+=`<div class="nowc off"><span class="nowk">Jour off</span><b>Repose-toi</b><small>Série protégée, aucun malus.</small></div>`}
  else{const T=[];
    h+=focusQ()+anglesRow()+mealTiles();
    const t=T[0];
    if(t){const [el,lab,col]=t,nm=(el.dataset.tmn||el.textContent||"").trim(),soft=isSoft();
      h+=`<div class="nowc" style="--nc:${col}"><span class="nowk">Maintenant · ${esc(lab)}</span><b class="nown"></b>${soft?`<small>Journée difficile : aucun malus.</small>`:""}<button type="button" class="btn nowgo" data-tm="${esc(el.dataset.tm||"")}" data-tmn="${esc(nm)}"${el.closest(".dqi")?' data-nohold="1"':""}>C'est parti</button>${durOf(nm)&&el.dataset.tm?`<button type="button" class="nowdone">Déjà fait</button>`:""}</div>`;
      box.innerHTML=h;set=true;box.querySelector(".nown").textContent=nm;const go=box.querySelector(".nowgo");if(!el.dataset.tm){go.removeAttribute("data-tm")}go.onclick=ev=>{const real=document.querySelector(`[data-tm="${CSS.escape(el.dataset.tm||"")}"]:not(.nowgo)`)||el;real.click()};
      {const card=box.querySelector(".nowc");card.classList.add("swp");const sw=document.createElement("span");sw.className="nowsw";sw.textContent="Glisse à droite si c'est déjà fait ›";card.appendChild(sw);swipeable(card,()=>{if(tmOn()){toast("Un timer est en cours : termine-le d'abord");renderNow();return}const real=document.querySelector(`[data-tm="${CSS.escape(el.dataset.tm||"")}"]:not(.nowgo)`)||el;window.__tmPass=true;try{real.click()}finally{window.__tmPass=false}setTimeout(()=>{const c2=box.querySelector(".nowc");if(c2&&c2===card)renderNow()},700)})}
      const nd=box.querySelector(".nowdone");if(nd)nd.onclick=()=>{if(tmOn()){toast("Un timer est en cours : termine-le d'abord");return}const real=document.querySelector(`[data-tm="${CSS.escape(el.dataset.tm||"")}"]:not(.nowgo)`)||el;window.__tmPass=true;try{real.click()}finally{window.__tmPass=false}}}
}
  if(!set)box.innerHTML=h;
  box.querySelectorAll("[data-fk]").forEach(b=>{const f=FOCK[+b.dataset.fk];if(f)b.onclick=ev=>{ev.stopPropagation();f(ev)}});
  const rx=box.querySelector(".rarex");if(rx)rx.onclick=()=>{G.rare.seen=1;save();renderNow()};
  if(G.rare&&G.rare.d===tk&&RARE[G.rare.k]&&!G.rare.played){G.rare.played=1;setTimeout(()=>sfx("level"),400)}}
// Cobalt (04/11) : une seule question selon l'heure (repas en cours > routine du matin > bilan du soir)
let FOCK=[];const fk=f=>(FOCK.push(f),FOCK.length-1);
function focusQ(){FOCK=[];const G=S.g,tk=dayKey(Date.now()),hh=dayH(),END={pdej:MEAL_H.dej,dej:MEAL_H.gouter,gouter:MEAL_H.diner,diner:99};
  const card=(t,btns)=>`<div class="focq"><b class="focqt">${t}</b><div class="focqb">${btns}</div></div>`;
  for(const [k,per,l] of MEALS){if(hh<MEAL_H[k]||hh>=END[k])continue;if(mealState(k,per))break;const pl=MB_PLM.includes(k);
    return card(`C'est l'heure du ${l.toLowerCase()}. Tu as mangé ?`,`<button type="button" class="btn" data-fk="${fk(ev=>mealQuick(per,k,ev.currentTarget,0,ev))}">Sauté</button><button type="button" class="btn primary" data-fk="${fk(ev=>pl?plateOpen(per,k,ev.currentTarget):mealQuick(per,k,ev.currentTarget,1,ev))}">${pl?"Remplir l'assiette":"Pris"}</button>`)}
  if(momentOf()==="matin"){let n=0;try{n=rtmSteps(dayPer()).length}catch(e){}if(n>1)return card("Bien réveillé ? On lance ta routine ?",`<button type="button" class="btn primary" data-fk="${fk(()=>rtmOpen())}">Lancer la routine</button>`)}
  if(momentOf()==="midi"||momentOf()==="soir"){const q=[...document.querySelectorAll("#fqBox .fqgo[data-tm],#sqBox .fqgo[data-tm]")].find(b=>b.offsetParent!==null);
    if(q){const nm=(q.dataset.tmn||"").trim(),tm=q.dataset.tm;if(nm)return card(`${esc(nm)} ?`,`<button type="button" class="btn primary" data-fk="${fk(()=>{const r=document.querySelector(`.fqgo[data-tm="${CSS.escape(tm)}"]`);if(r)r.click()})}">C'est parti</button>`)}}
  if(hh>=21&&!((G.jr||{})[tk]||{}).at)return card("Comment s'est passée ta journée ?",`<button type="button" class="btn primary" data-fk="${fk(()=>closeOpen())}">Faire mon bilan</button>`);
  return""}
// repas en tuiles (maquette E) : fait = rose et coche, en cours = orange avec Assiette, à venir = l'heure
function mealTiles(){const hh=dayH(),tk=dayKey(Date.now()),END={pdej:MEAL_H.dej,dej:MEAL_H.gouter,gouter:MEAL_H.diner,diner:99};let pris=0;
  const T=MEALS.map(([k,per,l,ic])=>{const st=mealState(k,per),pl=MB_PLM.includes(k),cur=!st&&hh>=MEAL_H[k],now=cur&&hh<END[k];if(st==="ok")pris++;
    const go=fk(ev=>{if(st&&!(pl&&st==="ok")){try{mealClear(tk,per,k);save();render()}catch(e){}return}pl?plateOpen(per,k,ev.currentTarget):mealQuick(per,k,ev.currentTarget,1,ev)});
    if(st)return`<button type="button" class="mt mt-ok" data-fk="${go}">${pxImg(ic,3)}<b>${l}</b><small>${st==="ok"?"Pris":"Sauté"}</small></button>`;
    if(cur)return`<div class="mt mt-now${now?"":" mt-late"}"><span class="mtt"><b>${l}</b><small>À noter</small></span><span class="mtb"><button type="button" class="btn" data-fk="${fk(ev=>mealQuick(per,k,ev.currentTarget,0,ev))}">Sauté</button><button type="button" class="btn primary" data-fk="${go}">${pl?"Assiette":"Pris"}</button></span></div>`;
    return`<div class="mt mt-next">${pxImg(ic,3)}<b>${l}</b><small>${MEAL_H[k]} h</small></div>`}).join("");
  let g=0;try{const t=plTot(tk);g=["f","p","l"].filter(x=>t[x]>0).length}catch(e){}
  const sq=n=>[0,1,2].map(i=>`<i class="${i<n?"on":""}"></i>`).join("");
  return`<div class="mtiles"><div class="mthead"><span>Mes repas</span><span class="mtpill" title="Groupes couverts dans les assiettes">${sq(g)}${pris} repas · ${g} groupe${g>1?"s":""} sur 3</span></div><div class="mtrow">${T}</div></div>`}
// les 4 angles : regroupement à l'affichage des 8 jauges (données inchangées)
const ANGLES=[["Corps","var(--c-sport)",["sport","nourriture","eau"],"halteres"],["Esprit","var(--c-soi)",["perso","soi","travail"],"soleil"],["Liens","var(--c-social)",["social","famille"],"duo"],["Foyer","var(--c-maison)",["maison","planete"],"maisonp"]];
function anglesRow(){const st=(S&&S.stats)||{};return`<div class="angles" role="list">${ANGLES.map(([n,c,cats])=>{const I=statInfo(cats.reduce((a,k)=>a+(st[k]||0),0));return`<div class="ang" role="listitem" style="--ac:${c}"><span class="angn">${n}</span><b class="angl">${I.l}</b><span class="angb"><i style="width:${Math.round(100*I.cur/I.need)}%"></i></span></div>`}).join("")}</div>`}
// renderBalance : finitions autour de renderBalanceBase (le cœur), ex-retouche de correctifs.js
function renderBalance(){const r=renderBalanceBase.apply(this,arguments);try{balViz()}catch(e){console.warn("renderBalance",e)}return r}
function renderBalanceBase(){const box=document.querySelector("#balCard .balrows");if(!box||!S.g)return;const G=S.g,off=isOff(),left=offLeft();
  box.innerHTML=`<div class="balr"><span><b>Jour off</b><small>1 par semaine · série protégée</small></span><button type="button" class="btn" id="offGo" ${off||!left?"disabled":""}>${off?"Aujourd'hui":left?"Prendre":"Déjà pris"}</button></div>
    <div class="balr"><span><b>Pause malade / vacances</b><small>${pzActive()?`En pause (${pzActive().k}) jusqu'au ${new Date(pzActive().to+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}. Série gelée.`:`Gèle ta série plusieurs jours. ${pzLeft()} jour${pzLeft()>1?"s":""} restant${pzLeft()>1?"s":""} cette année.`}</small></span><button type="button" class="btn" id="pzGo">${pzActive()?"Reprendre":"Pause"}</button></div>
    <label class="balr"><span><b>Mode doux</b><small>Si ton humeur du jour est basse, les malus sont désactivés.</small></span><input type="checkbox" id="softTg" ${G.softAuto!==false?"checked":""}></label>
    <label class="balr"><span><b>Heure de réveil</b><small>Décale le matin, le soir, les repas et la fin de journée (${wakeH()-4} h).</small></span><select id="wakeSel" aria-label="Heure de réveil">${[5,6,7,8,9,10,11,12,13].map(h=>`<option value="${h}"${h===wakeH()?" selected":""}>${h} h</option>`).join("")}</select></label>
    <label class="balr"><span><b>Couvre-feu</b><small>Après 23 h 30, l'appli te conseille d'aller dormir.</small></span><input type="checkbox" id="cfTg" ${G.curfew!==false?"checked":""}></label>`;
  $("offGo").onclick=takeOff;$("pzGo").onclick=()=>pzActive()?pzStop():pzOpen();$("softTg").onchange=e=>{G.softAuto=e.target.checked;save()};$("cfTg").onchange=e=>{G.curfew=e.target.checked;save();renderNow()};$("wakeSel").onchange=e=>{G.wake=+e.target.value;save();render();toast("Réveil réglé à "+G.wake+" h")}}

const xpToday=()=>{const tk=dayKey(Date.now());return S.log.filter(e=>dayKey(e.t)===tk&&e.xp>0).reduce((a,e)=>a+e.xp,0)};




