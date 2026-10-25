// ---- Bilan repas de fin de moment : récompense les extras, pénalise un repas sauté
const MB={matin:[["pdej","Petit-déjeuner",10,-10,"cup"],["dej","Déjeuner",10,-10,"plate"]],soir:[["gouter","Goûter",5,0,"cookie"],["diner","Dîner",10,-10,"plate"]]},MB_W=3;
const MB_PL=[["l","Légumes","veg"],["p","Protéines","meat"],["f","Féculents","rice"]],MB_PLM=["dej","diner"],MB_PLX=2,MB_PLB=4;
const MB_EX=[["fromage","Fromage","cheese",5],["yaourt","Yaourt","yogurt",5],["vege","Journée végé","veg",10,"soir"]];
const MB_V=[["junk","Mal mangé","burger",-10],["smoke","Fumé","smoke",-15],["drink","Bu de l'alcool","wine",-15],["soda","Bu du soda","soda",-5]],MB_CLEAN=10;
const mbDraft={};
const MEAL_H={pdej:0,dej:11,gouter:16,diner:19};
function mbDr(key){const MBD=(S.g.mbd&&typeof S.g.mbd==="object")?S.g.mbd:(S.g.mbd={});const dr=MBD[key]=MBD[key]||{m:{},ex:{},w:{}};dr.pl=dr.pl||{};dr.v=dr.v||{};dr.cr=dr.cr||{};return dr}
function mealQuick(per,k,btn,v,ev,bx,extra){const tk=dayKey(Date.now()),key=tk+":"+per,dr=mbDr(key),M=MB[per].find(x=>x[0]===k);if(!M)return;const[,l,p]=M;
  if(dr.cr[k]||dr.m[k]===0||dr.m[k]===1||(S.g.mb&&S.g.mb[key])){render();return}
  dr.m[k]=v;delete dr.w[k];dr.cr[k]=1;if(btn){btn.disabled=true;const it=btn.closest(".dqi");if(it)it.classList.add("leave")}
  if(v===1&&p>0)complete({id:"mb",cat:"nourriture",name:l,xp:p+(bx||0)},btn,ev,false,extra);else{save();render();toast(l+(v?" noté":" sauté"))}}

function mbCard(pp){const[per,day0]=pp.split(":"),day=day0||dayKey(Date.now()),key=day+":"+per,MBD=(S.g.mbd&&typeof S.g.mbd==="object")?S.g.mbd:(S.g.mbd={}),dr=MBD[key]=MBD[key]||{m:{},ex:{},w:{}};Object.keys(MBD).filter(k=>k.slice(0,10)<dayKey(Date.now()-2*864e5)).forEach(k=>delete MBD[k]);
  const MBX=MB_EX.filter(e=>!e[4]||e[4]===per),soft=isSoft(day);const c=document.createElement("div");c.className="mbil";const late=(per==="matin"&&dayPer()!=="matin")||!!day0;
  dr.v=dr.v||{};const isSoir=per==="soir";
  dr.pl=dr.pl||{};const plN=k=>MB_PL.filter(([q])=>(dr.pl[k]||{})[q]).length;
  const neg=()=>{let x=0;MB[per].forEach(([k,,,m])=>{if(dr.m[k]===0&&!soft)x+=m});if(isSoir)MB_V.forEach(([k,,,p])=>{if(dr.v[k]===1&&!soft)x+=p});return x};
  dr.cr=dr.cr||{};const tot=()=>{let x=0;MB[per].forEach(([k,,p,m])=>{if(dr.cr[k])return;if(dr.m[k]===1){x+=p;if(dr.w[k])x+=MB_W;if(MB_PLM.includes(k)){const n=plN(k);x+=n*MB_PLX+(n===3?MB_PLB:0)}}else if(dr.m[k]===0)x+=0});MBX.forEach(([k,,,p])=>{if(dr.ex[k]&&!(dr.exc&&dr.exc[k]))x+=p});
    if(isSoir){let bad=0;MB_V.forEach(([k,,,p])=>{if(dr.v[k]===1){bad++}});if(MB_V.every(([k])=>dr.v[k]===0))x+=MB_CLEAN}return x};
  let mbFirst=1;const draw=()=>{if(!mbFirst)save();mbFirst=0;const ready=MB[per].every(([k])=>dr.m[k]===0||dr.m[k]===1),x=tot();
    c.innerHTML=`<div class="mbh"><b>Bilan ${per==="matin"?"du matin":"du soir"}</b><small>${soft?(isOff(day)?"Jour off · aucun malus":"Journée difficile · aucun malus"):""}</small></div>
    <div class="mbmeals">${MB[per].map(([k,l,p,m,ic])=>`<div class="mbm${dr.m[k]===1?" ok":dr.m[k]===0?" ko":""}${dr.cr[k]?" cr":""}"><span class="mbic">${pxImg(ic,3)}</span><b>${l}</b><div class="mbseg"><button type="button" data-m="${k}" data-mv="1" aria-pressed="${dr.m[k]===1}">Pris${p?`<em>+${p}</em>`:""}</button><button type="button" data-m="${k}" data-mv="0" aria-pressed="${dr.m[k]===0}" class="neg">Sauté</button><button type="button" class="mbw" data-w="${k}" aria-pressed="${!!dr.w[k]}" aria-label="Un verre d'eau avec le ${l.toLowerCase()}"${dr.m[k]===1?"":" disabled"}>${pxImg("glass",3)}<em>+${MB_W}</em></button></div>${dr.m[k]===1&&MB_PLM.includes(k)?`<div class="mbpl${plN(k)===3?" full":""}"><small>${plN(k)===3?"Assiette équilibrée ! +"+(3*MB_PLX+MB_PLB):"Dans ton assiette"}</small>${MB_PL.map(([q,ql,qi])=>`<button type="button" data-pl="${k}:${q}" aria-pressed="${!!(dr.pl[k]||{})[q]}">${pxImg(qi,2)}<span>${ql}</span></button>`).join("")}</div>`:""}</div>`).join("")}</div>
    <div class="mbex"><div>${MBX.map(([k,l,ic,p])=>`<button type="button" data-x="${k}" aria-pressed="${!!dr.ex[k]}"${dr.exc&&dr.exc[k]?" disabled":""}><span class="mbic">${pxImg(ic,3)}</span><b>${l}</b><em>+${p}</em></button>`).join("")}</div></div>
    ${isSoir?`<div class="mbv"><small>Ta journée</small>${MB_V.map(([k,l,ic,p])=>`<div class="mbvr"><span class="mbic">${pxImg(ic,3)}</span><b>${l} ?</b><div class="mbseg"><button type="button" data-v2="${k}" data-val="0" aria-pressed="${dr.v[k]===0}">Non</button><button type="button" class="neg" data-v2="${k}" data-val="1" aria-pressed="${dr.v[k]===1}">Oui<em>${p}</em></button></div></div>`).join("")}<p class="mbclean">Rien de tout ça</p></div>`:""}
    <button type="button" class="btn primary mbok"${ready?"":" disabled"}>Fait</button>`;
    c.querySelectorAll("[data-v2]").forEach(b=>b.onclick=()=>{dr.v[b.dataset.v2]=+b.dataset.val;draw()});
    c.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{dr.m[b.dataset.m]=+b.dataset.mv;if(+b.dataset.mv===0)delete dr.w[b.dataset.m];draw()});
    c.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>{const k=b.dataset.w;dr.w[k]=!dr.w[k];if(dr.w[k]){sfx("glug",2);window.__wFill=k}draw();if(window.__wFill){const nb=c.querySelector(`[data-w="${window.__wFill}"]`);window.__wFill=null;if(nb){nb.classList.add("fill");setTimeout(()=>nb.classList.remove("fill"),900)}}});
    c.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{dr.ex[b.dataset.x]=!dr.ex[b.dataset.x];draw()});
    c.querySelectorAll("[data-pl]").forEach(b=>b.onclick=()=>{const[k,q]=b.dataset.pl.split(":");const P=dr.pl[k]=dr.pl[k]||{};P[q]=!P[q];const full=plN(k)===3;sfx(full&&P[q]?"badge":"blip");draw()});
    c.querySelector(".mbok").onclick=ev=>{if(!MB[per].every(([k])=>dr.m[k]===0||dr.m[k]===1))return;const G=S.g,x=tot(),eaten=MB[per].filter(([k])=>dr.m[k]===1).map(([,l])=>l),skip=MB[per].filter(([k])=>dr.m[k]===0).map(([,l])=>l),ex=MBX.filter(([k])=>dr.ex[k]).map(([,l])=>l);
      const nw=MB[per].filter(([k])=>dr.m[k]===1&&dr.w[k]).length;G.mb[key]={m:{...dr.m},ex:{...dr.ex},w:{...dr.w},v:{...dr.v},neg:neg(),pl:JSON.parse(JSON.stringify(dr.pl||{})),xp:x,t:Date.now()};{const bal=MB_PLM.filter(k=>dr.m[k]===1&&plN(k)===3).length;if(bal)ex.push(bal>1?bal+" assiettes équilibrées":"assiette équilibrée")}if(isSoir){const vb=MB_V.filter(([k])=>dr.v[k]===1).map(([,l])=>l.toLowerCase());if(vb.length)skip.push(vb.join(" et "))}delete mbDraft[key];if(nw)ex.push(nw+" verre"+(nw>1?"s":"")+" d'eau");
      const name=`Bilan repas ${per==="matin"?"du matin":"du soir"}${ex.length?" · "+ex.join(" + "):""}${skip.length?" · sauté : "+skip.join(", "):""}`;
      if(x>0)complete({id:"mb",cat:"nourriture",name,xp:x},ev.currentTarget,ev,false,{mb:key});
      else{save();render()}
      setTimeout(()=>toast(x>0?`Bien mangé ! <span class="p">+${x} XP</span>`:"Bilan enregistré"),300)}};
  draw();return c}

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

const RARE={legend:["Jour légendaire","XP ×2 + 1 coffre","#f2c230"],gold:["Coffre doré","objet épique garanti","#f2c230"],x2:["Heure d'or","XP double pendant 1 h","#ff9a3d"],secret:["Quête secrète","une quête rare t'attend","#9b5de5"]};
function vkind(b){const n=(b.dataset.tmn||"").trim();if(!n)return"";if(qSpecial(n))return"scr";if(durOf(n))return"tmr";if(holdable(b))return"hold";return""}
const VK_IC={scr:'<path d="M8 5l11 7-11 7z" fill="currentColor"/>',tmr:'<path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9" fill="none" stroke="currentColor" stroke-width="2.4"/>',hold:'<circle cx="12" cy="12" r="4" fill="currentColor"/><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="3 2.4"/>'};
function tagVK(){document.querySelectorAll("[data-tm]").forEach(b=>{const k=vkind(b);const old=b.querySelector(":scope>.vk");if(old&&old.dataset.k===k)return;if(old)old.remove();if(!k)return;const i=document.createElement("i");i.className="vk vk-"+k;i.dataset.k=k;i.setAttribute("aria-hidden","true");i.innerHTML=`<svg viewBox="0 0 24 24" width="11" height="11">${VK_IC[k]}</svg>`;b.appendChild(i)})}
let nowRaf=0;function schedNow(){if(nowRaf)return;nowRaf=requestAnimationFrame(()=>{nowRaf=0;renderNow();tagVK()})}
function renderNow(){const box=$("nowBox");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now());let h="",set=false;
  if(G.rare&&G.rare.d===tk&&G.rare.k&&G.rare.k!=="legend"&&G.rare.k!=="gold"&&!G.rare.seen){const R0=RARE[G.rare.k];h+=`<div class="rarec rare1" style="--rc:${R0[2]}"><b>${R0[0]}<span class="rared"> : ${R0[1]}</span></b><button type="button" class="rarex" aria-label="OK">${ICO("check",16)}</button></div>`}
  if(lateNight()){h+=`<div class="nowc night"><span class="nowk">Il est tard</span><b>Le reste attendra demain</b><small>Pose le téléphone. Bonne nuit.</small></div>`}
  else if(pzActive()){const P=pzActive();h+=`<div class="nowc off"><span class="nowk">En pause · ${P.k==="malade"?"malade":"vacances"}</span><b>${P.k==="malade"?"Soigne-toi":"Profite"}</b><small>Série gelée jusqu'au ${new Date(P.to+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}.</small></div>`}
  else if(isOff()){h+=`<div class="nowc off"><span class="nowk">Jour off</span><b>Repose-toi</b><small>Série protégée, aucun malus.</small></div>`}
  else{const T=[];
    const ritLeft=!!document.querySelector("#spTrack > .rtl.main .rtile:not(.done)");
    

    const t=T[0];
    if(t){const [el,lab,col]=t,nm=(el.dataset.tmn||el.textContent||"").trim(),soft=isSoft();
      h+=`<div class="nowc" style="--nc:${col}"><span class="nowk">Maintenant · ${esc(lab)}</span><b class="nown"></b>${soft?`<small>Journée difficile : aucun malus.</small>`:""}<button type="button" class="btn nowgo" data-tm="${esc(el.dataset.tm||"")}" data-tmn="${esc(nm)}"${el.closest(".dqi")?' data-nohold="1"':""}>C'est parti</button>${durOf(nm)&&el.dataset.tm?`<button type="button" class="nowdone">Déjà fait</button>`:""}</div>`;
      box.innerHTML=h;set=true;box.querySelector(".nown").textContent=nm;const go=box.querySelector(".nowgo");if(!el.dataset.tm){go.removeAttribute("data-tm")}go.onclick=ev=>{const real=document.querySelector(`[data-tm="${CSS.escape(el.dataset.tm||"")}"]:not(.nowgo)`)||el;real.click()};
      {const card=box.querySelector(".nowc");card.classList.add("swp");const sw=document.createElement("span");sw.className="nowsw";sw.textContent="Glisse à droite si c'est déjà fait ›";card.appendChild(sw);swipeable(card,()=>{if(tmOn()){toast("Un timer est en cours : termine-le d'abord");renderNow();return}const real=document.querySelector(`[data-tm="${CSS.escape(el.dataset.tm||"")}"]:not(.nowgo)`)||el;window.__tmPass=true;try{real.click()}finally{window.__tmPass=false}setTimeout(()=>{const c2=box.querySelector(".nowc");if(c2&&c2===card)renderNow()},700)})}
      const nd=box.querySelector(".nowdone");if(nd)nd.onclick=()=>{if(tmOn()){toast("Un timer est en cours : termine-le d'abord");return}const real=document.querySelector(`[data-tm="${CSS.escape(el.dataset.tm||"")}"]:not(.nowgo)`)||el;window.__tmPass=true;try{real.click()}finally{window.__tmPass=false}}}
}
  if(!set)box.innerHTML=h;
  const rx=box.querySelector(".rarex");if(rx)rx.onclick=()=>{G.rare.seen=1;save();renderNow()};
  if(G.rare&&G.rare.d===tk&&G.rare.k&&!G.rare.played){G.rare.played=1;setTimeout(()=>sfx("level"),400)}}
function renderBalance(){const box=document.querySelector("#balCard .balrows");if(!box||!S.g)return;const G=S.g,off=isOff(),left=offLeft();
  box.innerHTML=`<div class="balr"><span><b>Jour off</b><small>1 par semaine · série protégée</small></span><button type="button" class="btn" id="offGo" ${off||!left?"disabled":""}>${off?"Aujourd'hui":left?"Prendre":"Déjà pris"}</button></div>
    <div class="balr"><span><b>Pause malade / vacances</b><small>${pzActive()?`En pause (${pzActive().k}) jusqu'au ${new Date(pzActive().to+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}. Série gelée.`:`Gèle ta série plusieurs jours. ${pzLeft()} jour${pzLeft()>1?"s":""} restant${pzLeft()>1?"s":""} cette année.`}</small></span><button type="button" class="btn" id="pzGo">${pzActive()?"Reprendre":"Pause"}</button></div>
    <label class="balr"><span><b>Mode doux</b><small>Si ton humeur du jour est basse, les malus sont désactivés.</small></span><input type="checkbox" id="softTg" ${G.softAuto!==false?"checked":""}></label>
    <label class="balr"><span><b>Style de l'appli</b><small>« Ciel » suit le moment de la journée. « Classique » reprend l'ancien style brun et doré.</small></span><select id="daSel" aria-label="Style de l'appli"><option value="sky"${S.g.da!=="classic"?" selected":""}>Ciel</option><option value="classic"${S.g.da==="classic"?" selected":""}>Classique</option></select></label>
    <label class="balr"><span><b>Heure de réveil</b><small>Décale le matin, le soir, les repas et la fin de journée (${wakeH()-4} h).</small></span><select id="wakeSel" aria-label="Heure de réveil">${[5,6,7,8,9,10,11,12,13].map(h=>`<option value="${h}"${h===wakeH()?" selected":""}>${h} h</option>`).join("")}</select></label>
    <label class="balr"><span><b>Couvre-feu</b><small>Après 23 h 30, l'appli te conseille d'aller dormir.</small></span><input type="checkbox" id="cfTg" ${G.curfew!==false?"checked":""}></label>`;
  $("offGo").onclick=takeOff;$("pzGo").onclick=()=>pzActive()?pzStop():pzOpen();$("softTg").onchange=e=>{G.softAuto=e.target.checked;save()};$("cfTg").onchange=e=>{G.curfew=e.target.checked;save();renderNow()};$("daSel").onchange=e=>{G.da=e.target.value;save();render()};$("wakeSel").onchange=e=>{G.wake=+e.target.value;save();render();toast("Réveil réglé à "+G.wake+" h")}}

const xpToday=()=>{const tk=dayKey(Date.now());return S.log.filter(e=>dayKey(e.t)===tk&&e.xp>0).reduce((a,e)=>a+e.xp,0)};




