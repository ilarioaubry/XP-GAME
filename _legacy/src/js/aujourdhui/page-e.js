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
// humeur (5 visages pixel) + nuit, en haut du panneau
const TDE_MD=["M2 4h3v1h-3z M1 5h1v1h-1z M5 5h1v1h-1z","M3 4h1v1h-1z M2 5h3v1h-3z","M2 4h3v1h-3z","M1 4h1v1h-1z M5 4h1v1h-1z M2 5h3v1h-3z","M1 3h1v1h-1z M5 3h1v1h-1z M2 4h3v2h-3z"];
function tdeMood(){const G=S.g,tk=dayKey(Date.now()),md=(G.mood||{})[tk]|0,sl=(G.sleep||{})[tk];
  const face=(i,on)=>`<svg viewBox="0 0 7 7" width="28" height="28" shape-rendering="crispEdges" aria-hidden="true"><path fill="${on?"var(--ui-carte-2)":"var(--ui-sable)"}" d="M2 0h3v1h-3z M1 1h5v1h-5z M0 2h7v3h-7z M1 5h5v1h-5z M2 6h3v1h-3z"/><path fill="var(--ink)" d="M2 2h1v1h-1z M4 2h1v1h-1z ${TDE_MD[i]}"/></svg>`;
  const pick=n=>()=>{if(!G.mood)G.mood={};if(md===n)delete G.mood[tk];else G.mood[tk]=n;save();try{renderLife();renderSpecials()}catch(e){}renderTodayE()};
  return`<div class="tde-md"><div class="tde-mf" role="group" aria-label="Humeur du jour">${MOODS.map((m,i)=>`<button type="button" class="tde-mb" data-tdk="${tdk(pick(i+1))}" aria-pressed="${md===i+1}" aria-label="${m[1]}" title="${m[1]}">${face(i,md===i+1)}</button>`).join("")}</div>
    <button type="button" class="tde-sl" data-tdk="${tdk(sleepWin)}" aria-label="${sl&&sl.h?"Nuit de "+fmtH(sl.h)+", modifier":"Noter ma nuit"}"><svg viewBox="0 0 6 8" width="12" height="16" shape-rendering="crispEdges" aria-hidden="true"><path fill="var(--ui-carte-2)" d="M3 0h3v1h-3z M2 1h2v1h-2z M1 2h2v4h-2z M2 6h2v1h-2z M3 7h3v1h-3z"/></svg><span>${sl&&sl.h?fmtH(sl.h):"Ma nuit"}</span></button></div>`}
// fenêtre plein écran pour noter la nuit (champs → plein écran)
function sleepWin(){const sl=(S.g.sleep||{})[dayKey(Date.now())];
  mvWin("Ma nuit",true,C=>{C.innerHTML=`<div class="mv-two"><label class="mv-gl">Coucher<input class="ui-champ" type="time" data-sc value="${sl?sl.c:bedTime()||"23:30"}"></label><label class="mv-gl">Réveil<input class="ui-champ" type="time" data-sr value="${sl?sl.r:"07:30"}"></label></div>`},
    C=>{const c=C.querySelector("[data-sc]").value,r=C.querySelector("[data-sr]").value;if(!c||!r)return false;sleepSave(c,r,document.getElementById("tdMood"),null);try{renderLife()}catch(e){}renderTodayE()})}
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
  document.getElementById("tdMood").innerHTML=tdeMood();
  // quêtes du jour, puis idées (quêtes spéciales)
  const Q=tdeQuests("#fqBox"),SP=tdeQuests("#sqBox"),cnt=((document.querySelector("#fqBox .count")||{}).textContent||"").trim();
  const row=(q,cls,k)=>`<div class="tde-row ${cls}"><div class="tde-rt">${k?`<small>${k}</small>`:""}<b>${esc(q.nm)}</b></div><button type="button" class="btn primary" data-tdk="${tdk(()=>tdeGo(q.tm))}">${q.xp?esc(q.xp)+" XP":"Go"}</button></div>`;
  document.getElementById("tdQuests").innerHTML=`${tdeH(`Quêtes du jour <em class="count">${esc(cnt)}</em>`)}${Q.length?Q.map(q=>row(q,"")).join(""):`<p class="vide">Aucune quête pour l'instant.</p>`}${SP.slice(0,2).map((q,i)=>row(q,i?"tde-defi":"tde-idee",i?"Défi":"Idée du moment")).join("")}`;
  document.getElementById("tdMeals").innerHTML=mealTiles();
  let rt=0;try{rt=rtmSteps(dayPer()).length}catch(e){}
  const done=!!((G.jr||{})[dayKey(Date.now())]||{}).at;
  document.getElementById("tdEnd").innerHTML=`<div class="tde-dots"></div>${rt>1?`<button type="button" class="tde-row tde-soft" data-tdk="${tdk(()=>rtmOpen())}"><div class="tde-rt"><b>Routine ${dayPer()==="matin"?"du matin":"du soir"}</b><small>${rt} étapes</small></div></button>`:""}<button type="button" class="tde-row tde-soft" data-tdk="${tdk(()=>closeOpen())}"><div class="tde-rt"><b>Bilan du soir</b><small>${done?"Fait":"Humeur, nuit, ta journée · dès 21 h"}</small></div></button>`;
  tdeBind(root)}
