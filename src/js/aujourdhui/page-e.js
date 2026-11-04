// ===== Aujourd'hui, maquette E (Cobalt, 04/11) =====
// Page neuve : en-tête, question du moment (#nowBox, renderNow), demi-sphère, 4 angles, panneau crème
// (quêtes du jour, idées, repas en tuiles, routine et bilan). Les actions réutilisent les fonctions existantes ;
// les anciennes sections d'Aujourd'hui restent dans le DOM le temps de la migration (masquées, voir aujourdhui-e.css).
const TDE_DOME="M25 0h10v1h-10z M21 1h18v1h-18z M19 2h22v1h-22z M16 3h28v1h-28z M15 4h30v1h-30z M13 5h34v1h-34z M12 6h36v1h-36z M11 7h38v1h-38z M10 8h40v1h-40z M9 9h42v1h-42z M8 10h44v1h-44z M7 11h46v1h-46z M6 12h48v1h-48z M5 13h50v2h-50z M4 15h52v2h-52z M3 17h54v2h-54z M2 19h56v3h-56z M1 22h58v8h-58z";
let TDK=[];const tdk=f=>(TDK.push(f),TDK.length-1);
function tdeBind(el){el.querySelectorAll("[data-tdk]").forEach(b=>{const f=TDK[+b.dataset.tdk];if(f)b.onclick=ev=>{ev.stopPropagation();f(ev)}})}
const tdeH=t=>`<div class="tde-h"><span class="tde-dia"></span><span>${t}</span></div>`;
function tdeQuests(sel){return[...document.querySelectorAll(sel+" .fqgo[data-tm]")].map(b=>({nm:(b.dataset.tmn||"").trim(),xp:((b.querySelector(".xph")||{}).textContent||"").trim(),tm:b.dataset.tm})).filter(q=>q.nm)}
function tdeGo(tm){const r=document.querySelector(`.fqgo[data-tm="${CSS.escape(tm)}"]`);if(r)r.click()}
function renderTodayE(){const root=document.getElementById("todayE");if(!root||!S||!S.g)return;TDK=[];
  const G=S.g,L=levelInfo(S.xp||0),d=new Date(),hh=dayH();
  const hello=hh<12?"Bonjour":hh<18?"Bon après-midi":"Bonsoir";
  const seg=(n,on)=>Array.from({length:n},(_,i)=>`<i class="${i<on?"on":""}"></i>`).join("");
  const chests=(G.chests|0)+(G.bchests|0);
  document.getElementById("tdTop").innerHTML=`<div class="tde-bar"><div><b class="tde-date">${d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"short"})}</b><small>${hello}</small></div>
    <div class="tde-lv"><b>Niv ${L.l}</b><span class="tde-seg">${seg(8,Math.round(8*L.cur/L.need))}</span></div>
    <button type="button" class="tde-plus" aria-label="Ajouter une action" title="Ajouter" data-tdk="${tdk(()=>plusToggle(true))}">${ICO("plus",24)}</button></div>
    <div class="tde-chest">${pxImg("chest",2)}<span class="tde-seg big">${seg(10,Math.round(10*L.cur/L.need))}</span><small>${chests?`${chests} coffre${chests>1?"s":""} à ouvrir`:`Coffre au niveau ${L.l+1}`}</small>${chests?`<button type="button" class="btn primary" data-tdk="${tdk(()=>{const o=[...document.querySelectorAll("#gameBox button")].find(b=>/Ouvrir/.test(b.textContent));if(o)o.click()})}">Ouvrir</button>`:""}</div>`;
  let av="";try{av=`<img src="${sceneBody().i0}" alt="">`}catch(e){}
  document.getElementById("tdHero").innerHTML=`<svg class="tde-dome" viewBox="0 0 60 30" shape-rendering="crispEdges"><path fill="var(--c-sport)" d="${TDE_DOME}"/><path fill="var(--ui-or)" transform="translate(0 3)" d="${TDE_DOME}"/></svg><span class="tde-av">${av}</span>`;
  document.getElementById("tdAng").innerHTML=anglesRow();
  // quêtes du jour, puis idées (quêtes spéciales)
  const Q=tdeQuests("#fqBox"),SP=tdeQuests("#sqBox"),cnt=((document.querySelector("#fqBox .count")||{}).textContent||"").trim();
  const row=(q,cls,k)=>`<div class="tde-row ${cls}"><div class="tde-rt">${k?`<small>${k}</small>`:""}<b>${esc(q.nm)}</b></div><button type="button" class="btn primary" data-tdk="${tdk(()=>tdeGo(q.tm))}">${q.xp?esc(q.xp)+" XP":"Go"}</button></div>`;
  document.getElementById("tdQuests").innerHTML=`${tdeH(`Quêtes du jour <em class="count">${esc(cnt)}</em>`)}${Q.length?Q.map(q=>row(q,"")).join(""):`<p class="vide">Aucune quête pour l'instant.</p>`}${SP.slice(0,2).map((q,i)=>row(q,i?"tde-defi":"tde-idee",i?"Défi":"Idée du moment")).join("")}`;
  document.getElementById("tdMeals").innerHTML=mealTiles();
  let rt=0;try{rt=rtmSteps(dayPer()).length}catch(e){}
  const done=!!((G.jr||{})[dayKey(Date.now())]||{}).at;
  document.getElementById("tdEnd").innerHTML=`<div class="tde-dots"></div>${rt>1?`<button type="button" class="tde-row tde-soft" data-tdk="${tdk(()=>rtmOpen())}"><div class="tde-rt"><b>Routine ${dayPer()==="matin"?"du matin":"du soir"}</b><small>${rt} étapes</small></div></button>`:""}<button type="button" class="tde-row tde-soft" data-tdk="${tdk(()=>closeOpen())}"><div class="tde-rt"><b>Bilan du soir</b><small>${done?"Fait":"Humeur, nuit, ta journée · dès 21 h"}</small></div></button>`;
  tdeBind(root)}
