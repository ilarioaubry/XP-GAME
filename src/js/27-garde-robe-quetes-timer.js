// ---- Sections repliables : tout replié à chaque ouverture de l'appli
const FOLD={evt:1,"g:pathBox:0":1,"g:ritStat:0":1};
function tagFolds(){
  document.querySelectorAll("#dzBox>.dzc,#musBox>.dzc").forEach((el,i)=>{if(el.classList.contains("fd"))return;const h=el.querySelector(":scope>.dzh");if(!h)return;el.classList.add("fd");el.dataset.fk="dz:"+(h.textContent.trim().split(/\s/)[0]||i);h.classList.add("fdh")});
  document.querySelectorAll('section[data-sub="bilan"]:not(#libBox)>.gcard').forEach((el,i)=>{if(el.classList.contains("fd"))return;const h=el.firstElementChild;if(!h)return;el.classList.add("fd");el.dataset.fk="g:"+(el.parentElement.id||"")+":"+[...el.parentElement.children].indexOf(el);h.classList.add("fdh")});
}
function applyFolds(){tagFolds();document.querySelectorAll(".fd").forEach(el=>{const o=!!FOLD[el.dataset.fk];el.classList.toggle("fo",o);const h=el.querySelector(":scope>.fdh");if(!h)return;const t=h.querySelector(".fdt")||h.querySelector(":scope>h2,:scope>h3,:scope>b,:scope>.bh2>h3")||h;t.classList.add("fdt");t.setAttribute("role","button");t.tabIndex=0;t.setAttribute("aria-expanded",o)})}
function toggleFold(el,force){const k=el.dataset.fk;FOLD[k]=force===undefined?!FOLD[k]:force;applyFolds()}
document.addEventListener("click",e=>{const h=e.target.closest&&e.target.closest(".fdh");if(!h||!h.parentElement.classList.contains("fd"))return;const el=h.parentElement,ctl=e.target.closest("button,a,input,select,label,form");
  if(ctl&&!ctl.classList.contains("fdt")){if(!FOLD[el.dataset.fk])toggleFold(el,true);return}toggleFold(el)});
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("fdt")){const el=e.target.closest(".fd");if(el){e.preventDefault();toggleFold(el)}}});
{let q=0;new MutationObserver(()=>{if(q)return;q=1;queueMicrotask(()=>{q=0;applyFolds()})}).observe(document.querySelector(".wrap"),{childList:true,subtree:true})}

// ---- Garde-robe : collection, équipement, panoplies
let wrCat="tete";
function wrOwned(){return S.g?S.g.gear.filter(id=>gearOf(id)).length:0}
function wrSetsDone(){if(!S.g)return[];return WR_SETS.filter(([k])=>GEAR.filter(x=>x.set===k).every(x=>S.g.gear.includes(x.id)))}
function wrSetCheck(){if(!S.g)return false;let ch=false;wrSetsDone().forEach(([k,n,t])=>{if(!S.g.rt.includes(t)){S.g.rt.push(t);ch=true;gameMsgs.push(`Panoplie ${esc(n)} complète ! Titre <span class="p">${esc(t)}</span>`)}});return ch}
function wrCfg(){return{...AV_DEF,...(S.g.avc||{})}}
function wrEquipped(it){if(it.s==="aura")return S.g.eq.aura===it.id;const c=wrCfg();return(c[it.k]|0)===it.o}
function wrToggle(it){const G=S.g;if(it.s==="aura"){if(G.eq.aura===it.id)delete G.eq.aura;else G.eq.aura=it.id}
  else{if(!G.avc)G.avc={...AV_DEF};if((G.avc[it.k]|0)===it.o)G.avc[it.k]=0;else G.avc[it.k]=it.o;if(it.k==="bijou"&&it.o===2&&G.avc.bijou===0&&false)G.avc.bijou=0}
  sfx("blip");save();render();renderWardrobe()}
function renderWardrobe(){
  const G=S.g;if(!G||!$("wrBody"))return;
  const tot=GEAR.length,own=wrOwned();$("wrCnt").textContent=own+"/"+tot;
  {const nc=(G.chests||0)+(G.bchests||0);$("wrChest").innerHTML=nc?`<button type="button" class="gcard chestb${G.bchests?" bossc":""}" id="wrChestBtn"><span class="cic">${CHEST_SVG}</span><span><b>${G.bchests?"Coffre du boss":nc>1?nc+" coffres à ouvrir":"Un coffre à ouvrir"}</b><small>${G.bchests?"Objet épique garanti":"Un nouvel objet"}</small></span><span class="go">Ouvrir</span></button>`:"";const b=$("wrChestBtn");if(b)b.onclick=()=>openChest()}
  $("wrCats").innerHTML=WR_CATS.map(([k,l])=>{const L=k==="titre"||k==="set"||k==="badges"?null:GEAR.filter(x=>x.s===k);const n=L?L.filter(x=>G.gear.includes(x.id)).length+"/"+L.length:k==="set"?wrSetsDone().length+"/"+WR_SETS.length:k==="badges"?(()=>{try{const D=badgeDefs().filter(b=>!b.sec||(S.badges||{})[b.id]);return D.filter(b=>(S.badges||{})[b.id]).length+"/"+D.length}catch(e){return""}})():"";const [a0,b0]=n?n.split("/").map(Number):[0,0];return`<button type="button" role="tab" data-c="${k}" aria-selected="${wrCat===k}" aria-label="${l}${n?" "+n:""}"><i class="wci">${rkSvg(({tete:"casquette",haut:"tshirt",yeux:"lunettes",bijou:"bague",main:"epee",fond:"paysage",aura:"aura",titre:"banniere",set:"cintre",badges:"medaille"})[k]||"etoile")}</i><span class="wcl">${l}</span>${n?`<span class="wcg"><i style="width:${b0?Math.round(a0/b0*100):0}%"></i></span>`:`<span class="wcg wcg0"></span>`}</button>`}).join("");
  $("wrCats").querySelectorAll("button").forEach(b=>b.onclick=()=>{wrCat=b.dataset.c;renderWardrobe();try{window.wrBadges&&window.wrBadges()}catch(e){}});
  const body=$("wrBody");
  if(wrCat==="titre"){const l=levelInfo(S.xp).l,ranks=RANKS.filter(r=>l>=r[0]).map(r=>r[1]);const all=[...new Set([...ranks,...G.rt])],locked=RARE_TITLES.filter(t=>!G.rt.includes(t)).length+WR_SETS.filter(([,,t])=>!G.rt.includes(t)).length;
    body.innerHTML=`<div class="wr-titles">${all.map(t=>`<button type="button" class="wr-t" data-t="${esc(t)}" aria-pressed="${S.title===t}">${esc(t)}</button>`).join("")}${locked?`<span class="wr-t lock">+ ${locked} titres à trouver</span>`:""}</div><p class="hint">Touche un titre pour l'afficher sous ton nom.</p>`;
    body.querySelectorAll("button.wr-t").forEach(b=>b.onclick=()=>{S.title=S.title===b.dataset.t?"":b.dataset.t;save();render();renderWardrobe()});return}
  if(wrCat==="set"){body.innerHTML=`<div class="wr-sets">${WR_SETS.map(([k,n,t])=>{const L=GEAR.filter(x=>x.set===k),h=L.filter(x=>G.gear.includes(x.id)).length,done=h===L.length;
      return`<div class="wr-set${done?" done":""}"><div class="wr-sh"><b>${esc(n)}</b><span>${done?"Complète":h+"/"+L.length}</span></div><div class="wr-si">${L.map(x=>`<span class="wr-mini${G.gear.includes(x.id)?"":" lock"}" style="--rc:${RAR[x.r][1]}" title="${G.gear.includes(x.id)?esc(x.n):"???"}">${itemImg(x,40)}</span>`).join("")}</div><small>Bonus : titre « ${esc(t)} »</small></div>`}).join("")}</div>`;return}
  const L=GEAR.filter(x=>x.s===wrCat).sort((a,b)=>(!!a.ex-!!b.ex)||a.r-b.r);
  body.innerHTML=`<div class="wr-grid">${L.map((x,i)=>{const has=G.gear.includes(x.id),on=has&&wrEquipped(x);return`<button type="button" class="wr-it${has?"":" lock"}${on?" on":""}" data-i="${i}" style="--rc:${RAR[x.r][1]}" aria-pressed="${on}" aria-label="${has?esc(x.n):"Objet à trouver"}"><span class="wr-ic">${itemImg(x,56)}</span><b>${has?esc(x.n):"???"}</b><small>${x.ex?(has?"Exclusif":esc(x.ex)):RAR[x.r][0]}</small>${on?`<i class="wr-on">${ICO("check",12)}</i>`:""}</button>`}).join("")}</div>`;
  body.querySelectorAll(".wr-it").forEach(b=>b.onclick=()=>{const x=L[+b.dataset.i];if(!G.gear.includes(x.id)){toast(x.ex?`À débloquer : <span class="p">${esc(x.ex)}</span>`:`À trouver dans les coffres · <span class="p">${RAR[x.r][0]}</span>`);return}wrToggle(x)});
}

// ---- Quêtes chronométrées : le timer remplace la validation directe
function durOf(n){n=(n||"").toLowerCase();let t=0;const h=n.match(/(\d+(?:[.,]\d+)?)\s*h(?![a-zà-ü])/);if(h)t+=parseFloat(h[1].replace(",","."))*60;const m=n.match(/(\d+)\s*min/);if(m)t+=+m[1];if(!t&&/dents/.test(n))t=2;return Math.round(t)}
const tmOn=()=>!!(S.g&&S.g.tm);
let tmIv=0;
function tmFmt(ms){const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return(h?h+":"+String(m).padStart(2,"0"):String(m))+":"+String(x).padStart(2,"0")}
function tmStart(key,name,min){sfx("start");const G=S.g;G.tm={k:key,n:name,m:min,s:Date.now(),e:Date.now()+min*60000};save();tmShow();toast(`Timer lancé : <span class="p">${min>=60?(min/60).toLocaleString("fr-FR")+" h":min+" min"}</span>`)}
function tmShow(){let p=$("tmPanel");const T=S.g&&S.g.tm;document.body.classList.toggle("timing",!!T);
  if(!T){if(p)p.remove();clearInterval(tmIv);tmIv=0;return}
  if(!p){p=document.createElement("div");p.id="tmPanel";p.setAttribute("role","timer");p.innerHTML=`<div class="tmc"><span class="tmi" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12M6 22h12M7 2v4l5 6-5 6v4M17 2v4l-5 6 5 6v4"/></svg></span><span class="tmt"><small>En cours</small><b></b></span><span class="tmn"></span><button type="button" class="tmok">Déjà fait</button><button type="button" class="tmx" aria-label="Abandonner le timer">${ICO("close",16)}</button></div><span class="tmbar"><i></i></span>`;document.body.appendChild(p);
    p.querySelector(".tmx").onclick=()=>{const b=p.querySelector(".tmx");if(!b.dataset.arm){b.dataset.arm="1";b.classList.add("arm");b.innerHTML="Abandonner ?";setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.classList.remove("arm");b.innerHTML=ICO("close",16)}},3000);return}delete S.g.tm;save();tmShow();toast("Timer abandonné")};
    p.querySelector(".tmok").onclick=ev=>{const r=ev.currentTarget.getBoundingClientRect();window.__tmFloat={x:r.left+r.width/2,y:r.top};const a=$("tmAsk");if(a)a.remove();clearInterval(tmIv);tmIv=0;tmFinish(true);setTimeout(()=>{window.__tmFloat=null},50)}}
  p.querySelector(".tmt b").textContent=T.n;
  const tick=()=>{const T2=S.g&&S.g.tm;if(!T2){tmShow();return}const left=T2.e-Date.now();p.querySelector(".tmn").textContent=tmFmt(left);p.querySelector(".tmbar i").style.width=Math.min(100,(Date.now()-T2.s)/(T2.e-T2.s)*100)+"%";if(left<=0){clearInterval(tmIv);tmIv=0;tmAsk()}};
  tick();if(!tmIv&&S.g.tm&&S.g.tm.e>Date.now())tmIv=setInterval(tick,1000)}
function tmAsk(){const T=S.g&&S.g.tm;if(!T||$("tmAsk"))return;sfx("alarm");const o=document.createElement("div");o.id="tmAsk";o.className="bpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  const d=T.m>=60?(T.m/60).toLocaleString("fr-FR")+" h":T.m+" min";
  o.innerHTML=`<div class="bpc tmask" style="--tc:var(--gold)"><div class="tmbig" aria-hidden="true">${pxImg("hourglass",6)}</div><h3>Temps écoulé !</h3><p class="bpd"></p><div class="tmbtns"><button type="button" class="btn primary" id="tmYes">Oui, c'est fait !</button><button type="button" class="btn" id="tmMore">J'en ai fait plus · +5</button><button type="button" class="btn" id="tmNo">Pas cette fois</button></div></div>`;
  o.querySelector(".bpd").textContent=`Tu as bien fait ${d} : « ${T.n} » ?`;document.body.appendChild(o);
  $("tmYes").onclick=ev=>{const r=$("tmYes").getBoundingClientRect();window.__tmFloat={x:r.left+r.width/2,y:r.top};o.remove();tmFinish(true);setTimeout(()=>{window.__tmFloat=null},50)};
  $("tmNo").onclick=()=>{o.remove();tmFinish(false)};$("tmMore").onclick=()=>{const r=$("tmMore").getBoundingClientRect();window.__tmFloat={x:r.left+r.width/2,y:r.top};o.remove();window.__xpP={add:5,t:Date.now()};tmFinish(true);setTimeout(()=>{window.__tmFloat=null},50)}}
function tmFinish(ok){const T=S.g.tm;delete S.g.tm;save();tmShow();if(!ok||!T){toast("Pas de souci, ce sera pour la prochaine fois");return}
  ["q","t"].forEach(v=>{if(viewDirty[v])runView(v)});
  const b=document.querySelector(`[data-tm="${T.k}"]`);if(!b||b.disabled){toast("Cette quête n'est plus disponible");return}
  window.__tmPass=true;try{b.click()}finally{window.__tmPass=false}}
document.addEventListener("click",e=>{if(window.__tmPass)return;const t=e.target;if(!t.closest)return;
  if(t.closest("#tmPanel,#tmAsk"))return;
  const q=t.closest("[data-tm],.lzbtn,.dqgo,.sq .primary,.evgo,.evqgo,.pjgo");
  if(tmOn()){const b2=t.closest("[data-tm]"),nm=b2?(b2.dataset.tmn||""):"";if(q&&b2&&durOf(nm)&&!qSpecial(nm)){e.preventDefault();e.stopImmediatePropagation();sfx("error");toast("Un timer est déjà en cours : termine-le d'abord")}return}
  const b=t.closest("[data-tm]");if(!b||b.disabled)return;if(qSpecial(b.dataset.tmn||""))return;const m=durOf(b.dataset.tmn);if(!m)return;
  e.preventDefault();e.stopImmediatePropagation();tmStart(b.dataset.tm,b.dataset.tmn,m)},true);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&tmOn())tmShow()});
// ---- Quêtes vérifiées : lecture, pompes, appui long
const qName=b=>(b.dataset.tmn||b.dataset.n||b.textContent||"").trim();
const isRead=n=>!/fini|relire|élire| ou |premières/i.test(n)&&/(^|[\s:])lire(\s|$)|^lecture\b|séance de lecture/i.test(n);
const isBookEnd=n=>/livre fini|finir le livre|un livre en entier/i.test(n);
const isPush=n=>/pompes|squats/i.test(n)&&!/ou \d+ min|marche rapide demain/i.test(n);
function qPass(b,xp,add){window.__qPass=true;window.__xpP=(xp!=null||add)?{ov:xp,add,t:Date.now()}:null;try{b.click()}finally{window.__qPass=false}}
document.addEventListener("click",e=>{if(window.__qPass||window.__tmPass||window.__holdPass)return;const b=e.target.closest&&e.target.closest("[data-tm]");if(!b||b.disabled)return;const n=qName(b);
  {const sp=qSpecialOpen(b,n);if(sp){e.preventDefault();e.stopImmediatePropagation();return}}
  if(isBookEnd(n)){e.preventDefault();e.stopImmediatePropagation();rdOpen(b,n,1);return}
  if(isRead(n)){e.preventDefault();e.stopImmediatePropagation();rdOpen(b,n);return}
  if(isPush(n)){e.preventDefault();e.stopImmediatePropagation();puOpen(b,n);return}
  if(holdable(b)&&e.detail>0){e.preventDefault();e.stopImmediatePropagation();if(!HOLD.hinted){HOLD.hinted=1;toast("Maintiens le bouton appuyé pour valider")}}},true);
// appui long (hors rituels)
const HOLD={t:0,b:null,hinted:0},HOLD_MS=600;
function holdable(b){if(!b||b.dataset.nohold||b.closest(".dqi,.mbil,#dqBox"))return false;const n=qName(b);return!durOf(n)&&!qSpecial(n)}
function holdEnd(ok){const b=HOLD.b;clearTimeout(HOLD.t);HOLD.b=null;if(!b)return;b.classList.remove("holding");if(ok){b.classList.add("held");setTimeout(()=>b.classList.remove("held"),400);sfx("blip");window.__holdPass=true;try{b.click()}finally{window.__holdPass=false}}}
document.addEventListener("pointerdown",e=>{const b=e.target.closest&&e.target.closest("[data-tm]");if(!b||b.disabled||!holdable(b))return;holdEnd(false);HOLD.b=b;b.style.setProperty("--hold",HOLD_MS+"ms");b.classList.add("holding");HOLD.t=setTimeout(()=>holdEnd(true),HOLD_MS)},true);
["pointerup","pointercancel","pointerleave"].forEach(ev=>document.addEventListener(ev,e=>{if(HOLD.b&&(ev!=="pointerleave"||e.target===HOLD.b))holdEnd(false)},true));
document.addEventListener("contextmenu",e=>{if(e.target.closest&&e.target.closest(".holding"))e.preventDefault()},true);

// ---------- quêtes interactives (corps, esprit, relations, cadeau)
const isPlank=n=>/gainage|planche/i.test(n)&&!/ et |record de pompes|note tes/i.test(n);
const isStretch=n=>/étirement/i.test(n);
const isRun=n=>/(courir|course|footing|marche-courir)/i.test(n)&&!durOf(n);
const isMed=n=>/médit/i.test(n)&&!/ ou /i.test(n);
const isGift=n=>/^acheter un cadeau pour /i.test(n);
const isContact=n=>!!cbWho(n)&&/écri|appel|vocal|nouvelles|message|contact|envoie|envoyer|demande|propose|recommand|raconte|parle|dis /i.test(n)&&!isGift(n);
function qSpecial(n){return isRead(n)||isBookEnd(n)||isPush(n)||isPlank(n)||isStretch(n)||isRun(n)||isMed(n)||isGift(n)||isContact(n)}
function qSpecialOpen(b,n){if(isGift(n)){gfOpen(b,n.replace(/^acheter un cadeau pour /i,"").trim());return 1}if(isPlank(n)){gnOpen(b,n);return 1}if(isStretch(n)){stOpen(b,n);return 1}if(isRun(n)){runOpen(b,n);return 1}if(isMed(n)){mdOpen(b,n);return 1}if(isContact(n)){ctOpen(b,n);return 1}return 0}
function fmtSec(t){t=Math.max(0,Math.round(t));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")}
function puDecor(o,av){const pad=o.querySelector(".pupad");if(!pad)return;{const hp=pad.querySelector(".puhelp"),k=(o.className.match(/rep-\w+|\b(gn|st|rn|md)\b/)||["x"])[0],G=S.g;if(hp&&G){if(!G.help)G.help={};G.help[k]=(G.help[k]||0)+1;if(G.help[k]>2)hp.remove()}}
  if(av){let src="";try{src=myAvatarURL()}catch(e){}if(src){const im=document.createElement("img");im.className="puav";im.src=src;im.alt="";pad.insertBefore(im,pad.firstChild)}}
  const fl=document.createElement("span");fl.className="pufloor";fl.setAttribute("aria-hidden","true");pad.appendChild(fl);
  const x=o.querySelector("#puX");if(x){x.innerHTML=ICO("close",18);x.setAttribute("aria-label","Annuler");o.appendChild(x)}
  const sm=o.querySelector(".puh small");if(sm){const parts=sm.textContent.split(" · ");sm.innerHTML=parts.map(t=>`<span class="puchip${/record/i.test(t)?" rec":""}">${esc(t)}</span>`).join("")}}
function puAvHop(o){const a=o.querySelector(".puav");if(!a)return;a.classList.remove("hop");void a.offsetWidth;a.classList.add("hop")}
function mdOrb(r,lit){const N=29,c=14,P=[];let h="";for(let y=0;y<N;y++)for(let x=0;x<N;x++){const d=Math.hypot(x-c,y-c);if(d<=r+.35){const edge=d>r-.75,hi=!edge&&x-c<-r*.25&&y-c<-r*.25&&d>r*.35&&d<r*.75,sh=!edge&&x-c>r*.2&&y-c>r*.2&&d>r*.55;h+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${edge?"#0d1a33":hi?"#d8ecff":sh?"#3a6ec0":"#5a9cf0"}"/>`}}
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2-Math.PI/2,x=Math.round(c+Math.cos(a)*13),y=Math.round(c+Math.sin(a)*13);h+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${i<lit?"#ffd75a":"#2a3550"}"/>`}
  return h}
function fsOpen(cls,inner){const o=document.createElement("div");o.className="pu "+cls;o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.innerHTML=inner;document.body.appendChild(o);puDecor(o,/\b(gn|rn|md|st)\b/.test(cls));return o}
function burstIn(FX,k){for(let i=0;i<k;i++){const e=document.createElement("i");const a=Math.random()*Math.PI*2,d=70+Math.random()*90;e.style.setProperty("--dx",Math.cos(a)*d+"px");e.style.setProperty("--dy",Math.sin(a)*d+"px");e.style.setProperty("--d",(.45+Math.random()*.35)+"s");FX.appendChild(e);setTimeout(()=>e.remove(),900)}}
function monthAdd(o,v){const ym=ymOf(Date.now());if(!o.m)o.m={};o.m[ym]=(o.m[ym]||0)+v}
// gainage : chrono qui monte
function gnOpen(btn,n){const G=S.g;if(!G.gn)G.gn={rec:0};const P=G.gn,mm=n.match(/(\d+)\s*s(?:ec)?\b/i),goal=durOf(n)?durOf(n)*60:mm?+mm[1]:60,rec0=P.rec||0;let t0=0,el=0,iv=0,state="ready",recHit=0,goalHit=0,lastS=-1;
  const o=fsOpen("gn",`<div class="puh"><b class="pun"></b><small>Objectif ${fmtSec(goal)}${rec0?" · record "+fmtSec(rec0):""}</small></div>
    <div class="pupad gnpad"><span class="pufx" aria-hidden="true"></span><span class="puban"></span><b class="puc gnc">0:00</b><span class="pug"><i></i><em></em></span><span class="pucall"></span><small class="puhelp">Mets-toi en position, puis appuie sur Go. Appuie sur Stop quand tu lâches.</small></div>
    <div class="pub"><button type="button" class="btn" id="puX">Annuler</button><button type="button" class="btn primary" id="puOk">Go</button></div>`);
  o.querySelector(".pun").textContent=n;const C=o.querySelector(".gnc"),GI=o.querySelector(".pug i"),GR=o.querySelector(".pug em"),OK=o.querySelector("#puOk"),BAN=o.querySelector(".puban"),CALL=o.querySelector(".pucall"),FX=o.querySelector(".pufx");
  const ban=(t)=>{BAN.textContent=t;BAN.classList.remove("show");void BAN.offsetWidth;BAN.classList.add("show")};
  const bonus=()=>Math.min(30,Math.max(0,Math.floor((el-goal)/10)))+(recHit?10:0);
  const tick=()=>{el=(Date.now()-t0)/1000;const sec=Math.floor(el);C.textContent=fmtSec(sec);const top=Math.max(goal,rec0,el);GI.style.width=Math.min(100,el/top*100)+"%";GR.style.left=rec0&&rec0>goal?Math.min(100,rec0/top*100)+"%":"-999px";
    if(sec!==lastS){lastS=sec;if(sec>0&&!goalHit&&sec>=goal-3&&sec<goal)sfx("blip");
      if(!goalHit&&sec>=goal){goalHit=1;o.classList.add("goal");ban("OBJECTIF ATTEINT");sfx("moment");burstIn(FX,14)}
      else if(goalHit&&!recHit&&rec0&&sec>rec0){recHit=1;o.classList.add("rec");ban("NOUVEAU RECORD !");sfx("level");burstIn(FX,26)}
      else if(goalHit&&sec%5===0){sfx("rep",Math.min(24,Math.floor((sec-goal)/5)));burstIn(FX,recHit?10:6);o.classList.remove("shk");void o.offsetWidth;o.classList.add("shk")}
      if(sec>goal){o.classList.add("over");o.style.setProperty("--heat",Math.min(1,(sec-goal)/60).toFixed(2));CALL.textContent=recHit?"+"+fmtSec(sec-rec0)+" au-dessus du record":(PU_CALL[Math.min(PU_CALL.length-1,Math.floor((sec-goal)/10))]+" +"+(sec-goal)+" s")}
      OK.textContent=goalHit?(bonus()?`Stop · +${bonus()} XP bonus`:"Stop · valider"):"Stop"}};
  OK.onclick=()=>{if(state==="ready"){state="cd";OK.disabled=true;let k=3;C.textContent=k;sfx("blip");const cd=setInterval(()=>{k--;if(k>0){C.textContent=k;sfx("blip")}else{clearInterval(cd);state="run";o.classList.add("running");t0=Date.now();sfx("start");OK.disabled=false;OK.textContent="Stop";o.querySelector(".puhelp").textContent="Tiens bon !";iv=setInterval(tick,100);tick()}},1000);return}
    if(state==="run"){clearInterval(iv);state="end";o.classList.remove("running");tick();const ok=el>=goal,b=bonus(),rec=el>rec0;
      if(ok){if(rec)P.rec=Math.floor(el);monthAdd(P,Math.floor(el));o.remove();qPass(btn,null,b);setTimeout(()=>toast(rec&&rec0?`Nouveau record de gainage : <span class="p">${fmtSec(el)}</span> !`:`Gainage tenu ${fmtSec(el)}${b?` · <span class="p">+${b} XP</span> bonus`:""}`),900)}
      else{if(rec)P.rec=Math.floor(el);sfx("error");CALL.textContent="Il manquait "+fmtSec(goal-el);OK.textContent="Réessayer";state="ready";o.classList.remove("over","rec","goal");goalHit=recHit=0;lastS=-1}}};
  o.querySelector("#puX").onclick=()=>{clearInterval(iv);o.remove()}}
// étirements guidés
const STRETCH=[["Cou","Penche doucement la tête de chaque côté"],["Épaules","Fais de grands cercles avec les épaules"],["Bras","Tire un bras derrière la tête, puis l'autre"],["Dos","Enroule le dos, mains vers les pieds"],["Hanches","Fente basse, bassin vers l'avant"],["Ischios","Jambes tendues, attrape tes chevilles"],["Quadriceps","Debout, attrape ton pied derrière toi"],["Mollets","Mains au mur, une jambe tendue derrière"]];
function stOpen(btn,n){const tot=Math.min(5,Math.max(1,durOf(n)||5))*60,L=STRETCH.slice(0,Math.max(4,Math.min(8,Math.round(tot/40)))),per=tot/L.length;let i=0,t0=0,iv=0,paused=0,pacc=0,pst=0,run=0;
  const o=fsOpen("st",`<div class="puh"><b class="pun"></b><small>${L.length} étirements · ${fmtSec(tot)}</small></div>
    <div class="pupad stpad"><div class="stdots">${L.map(()=>"<i></i>").join("")}</div><small class="stk">Étirement <b class="sti">1</b> / ${L.length}</small><b class="stn"></b><span class="sth"></span><div class="string"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="sbg"/><circle cx="50" cy="50" r="44" class="sfg"/></svg><b class="stt"></b></div></div>
    <div class="pub"><button type="button" class="btn" id="puX">Annuler</button><button type="button" class="btn primary" id="puOk">Commencer</button></div>`);
  o.querySelector(".pun").textContent=n;const OK=o.querySelector("#puOk"),FG=o.querySelector(".sfg"),D=o.querySelectorAll(".stdots i");
  const show=()=>{o.querySelector(".sti").textContent=i+1;o.querySelector(".stn").textContent=L[i][0];o.querySelector(".sth").textContent=L[i][1];D.forEach((d,k)=>d.className=k<i?"on":k===i?"cur":"")};
  const now=()=>(Date.now()-t0-pacc)/1000;
  const tick=()=>{if(paused)return;const e=now(),k=Math.min(L.length-1,Math.floor(e/per)),left=per*(k+1)-e;if(k!==i){i=k;show();sfx("badge");o.querySelector(".stpad").classList.remove("swap");void o.offsetWidth;o.querySelector(".stpad").classList.add("swap")}
    o.querySelector(".stt").textContent=Math.ceil(Math.max(0,left));FG.style.strokeDashoffset=(276.5*(1-(per-left)/per)).toFixed(1);
    if(e>=tot){clearInterval(iv);run=0;sfx("moment");D.forEach(d=>d.className="on");o.querySelector(".stn").textContent="Terminé !";o.querySelector(".sth").textContent="Bien étiré.";OK.textContent="Valider";OK.onclick=()=>{o.remove();qPass(btn)}}};
  const vis=()=>{if(!run)return;if(document.hidden){paused=1;pst=Date.now()}else if(paused){pacc+=Date.now()-pst;paused=0}};document.addEventListener("visibilitychange",vis);
  show();OK.onclick=()=>{if(!run&&!t0){run=1;t0=Date.now();sfx("start");OK.textContent="Pause";iv=setInterval(tick,200);tick();return}
    if(run){if(!paused){paused=1;pst=Date.now();OK.textContent="Reprendre"}else{pacc+=Date.now()-pst;paused=0;OK.textContent="Pause"}}};
  o.querySelector("#puX").onclick=()=>{clearInterval(iv);document.removeEventListener("visibilitychange",vis);o.remove()}}
// course : chrono + distance
function runOpen(btn,n){const G=S.g;if(!G.run)G.run={rec:0};const P=G.run,km0=(n.match(/(\d+(?:[.,]\d+)?)\s*km/i)||[])[1];const goalKm=km0?parseFloat(km0.replace(",",".")):0;let t0=0,el=0,iv=0,state="ready",km=goalKm||2;
  const o=fsOpen("rn",`<div class="puh"><b class="pun"></b><small>${goalKm?"Objectif "+goalKm.toLocaleString("fr-FR")+" km":"Cours à ton rythme"}${P.rec?" · record "+P.rec.toLocaleString("fr-FR")+" km":""}</small></div>
    <div class="pupad rnpad"><span class="rnrd" aria-hidden="true"><i></i><i></i><i></i></span><b class="puc rnc">0:00</b><span class="pucall rnsub">Lance le chrono au départ</span><div class="rnkm" hidden><p>Distance parcourue</p><div class="rdk2"><button type="button" class="btn rdm" data-d="-0.5">-0,5</button><button type="button" class="btn rdm" data-d="-0.1">-0,1</button><b class="rdv rnv"></b><button type="button" class="btn rdm" data-d="0.1">+0,1</button><button type="button" class="btn rdm" data-d="0.5">+0,5</button></div><small class="rnpace"></small></div></div>
    <div class="pub"><button type="button" class="btn" id="puX">Annuler</button><button type="button" class="btn primary" id="puOk">Go</button></div>`);
  o.querySelector(".pun").textContent=n;const C=o.querySelector(".rnc"),OK=o.querySelector("#puOk"),SUB=o.querySelector(".rnsub");
  const pace=()=>{const sk=el/Math.max(.1,km);return Math.floor(sk/60)+"'"+String(Math.round(sk%60)).padStart(2,"0")+'" / km'};
  const bonus=()=>(goalKm&&km>goalKm?Math.min(30,Math.round((km-goalKm)*10)):0)+(P.rec&&km>P.rec?10:0);
  const drawKm=()=>{o.querySelector(".rnv").textContent=km.toLocaleString("fr-FR",{minimumFractionDigits:1,maximumFractionDigits:1})+" km";o.querySelector(".rnpace").textContent="Allure "+pace()+(P.rec&&km>P.rec?" · nouveau record !":"");
    const ok=!goalKm||km>=goalKm;OK.disabled=!ok;OK.textContent=ok?"Fait":"Il manque "+(Math.round((goalKm-km)*10)/10).toLocaleString("fr-FR")+" km";o.classList.toggle("rec",!!(P.rec&&km>P.rec))};
  OK.onclick=()=>{if(state==="ready"){state="run";t0=Date.now();sfx("start");o.classList.add("running");SUB.textContent="En course · garde l'écran allumé ou reviens à la fin";OK.textContent="Arrivé !";iv=setInterval(()=>{el=(Date.now()-t0)/1000;C.textContent=fmtSec(el)},500);return}
    if(state==="run"){clearInterval(iv);el=(Date.now()-t0)/1000;C.textContent=fmtSec(el);state="km";o.classList.remove("running");SUB.textContent="Bravo ! Combien de km ?";o.querySelector(".rnkm").hidden=false;drawKm();sfx("moment");return}
    const b=bonus(),rec=km>(P.rec||0);if(rec)P.rec=Math.round(km*10)/10;monthAdd(P,km);o.remove();qPass(btn,null,b);setTimeout(()=>toast(`${km.toLocaleString("fr-FR")} km en ${fmtSec(el)}${b?` · <span class="p">+${b} XP</span> bonus`:""}`),900)};
  o.querySelectorAll(".rdm").forEach(b=>b.onclick=()=>{km=Math.max(.1,Math.round((km+ +b.dataset.d)*10)/10);drawKm()});
  o.querySelector("#puX").onclick=()=>{clearInterval(iv);o.remove()}}
// méditation : respiration guidée
function mdOpen(btn,n){const G=S.g;if(!G.md)G.md={};const tot=Math.max(1,durOf(n)||5)*60,PH=[["Inspire",4],["Bloque",2],["Expire",6]],CY=12;let t0=0,iv=0,paused=0,pacc=0,pst=0,run=0,lp=-1;
  const o=fsOpen("md",`<div class="puh"><b class="pun"></b><small>${fmtSec(tot)} de respiration</small></div>
    <div class="pupad mdpad"><span class="mdstars" aria-hidden="true"></span><div class="mdc"><svg class="mdorb" viewBox="0 0 29 29" shape-rendering="crispEdges" aria-hidden="true">${mdOrb(4,0)}</svg></div><b class="mdt">Prêt ?</b><b class="mdl">${fmtSec(tot)}</b></div>
    <div class="pub"><button type="button" class="btn" id="puX">Annuler</button><button type="button" class="btn primary" id="puOk">Commencer</button></div>`);
  o.querySelector(".pun").textContent=n;const OK=o.querySelector("#puOk"),ORB=o.querySelector(".mdorb"),T=o.querySelector(".mdt"),LF=o.querySelector(".mdl");let lastR=-1,lastL=-1;
  const bell=f=>{const c=sfxCtx();if(!c||!sfxOn())return;tone(c,f,c.currentTime+.01,1.6,"sine",.07)};
  const tick=()=>{if(paused)return;const e=(Date.now()-t0-pacc)/1000,left=tot-e;LF.textContent=fmtSec(Math.ceil(Math.max(0,left)));const cy=e%CY;let k=cy<4?0:cy<6?1:2;const pf=k===0?cy/4:k===1?(cy-4)/2:(cy-6)/6,ease=v=>v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2,r=Math.round(k===0?4+6*ease(pf):k===1?10:10-6*ease(pf)),lit=Math.min(16,Math.floor(pf*16)+1);
    if(r!==lastR||lit!==lastL){lastR=r;lastL=lit;ORB.innerHTML=mdOrb(r,lit)}
    if(k!==lp){lp=k;T.textContent=PH[k][0];o.dataset.ph=k;bell(k===0?392:k===1?494:330)}
    if(left<=0){clearInterval(iv);run=0;bell(523);setTimeout(()=>bell(659),400);T.textContent="Terminé";monthAdd(G.md,Math.round(tot/60));OK.textContent="Valider";OK.onclick=()=>{o.remove();qPass(btn)}}};
  const vis=()=>{if(!run)return;if(document.hidden){paused=1;pst=Date.now()}else if(paused){pacc+=Date.now()-pst;paused=0;T.textContent="On reprend"}};document.addEventListener("visibilitychange",vis);
  OK.onclick=()=>{if(!run&&!t0){run=1;t0=Date.now();OK.textContent="Pause";iv=setInterval(tick,200);tick();return}
    if(run){if(!paused){paused=1;pst=Date.now();OK.textContent="Reprendre";T.textContent="Pause"}else{pacc+=Date.now()-pst;paused=0;OK.textContent="Pause";lp=-1}}};
  o.querySelector("#puX").onclick=()=>{clearInterval(iv);document.removeEventListener("visibilitychange",vis);o.remove()}}
// relations : écrire / appeler directement
function ctOpen(btn,n){const who=cbWho(n),P=S.profiles[who]=S.profiles[who]||{};const o=document.createElement("div");o.className="bpop ctpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);
  const close=()=>o.remove();o.onclick=e=>{if(e.target===o)close()};
  const draw=(edit)=>{const tel=(P.phone||P.tel||"").replace(/[^\d+]/g,""),ig=(P.ig||"").replace(/^@/,"").trim();
    o.innerHTML=`<div class="bpc ctc" style="--h:hsl(${hueOf(who)} 55% 50%)">${pAv(who,"ctav")}<h3 class="ctn"></h3><p class="bpd ctq"></p>
      ${edit||(!tel&&!ig)?`<div class="ctf"><label class="rdl">Numéro<input id="ctTel" type="tel" inputmode="tel" placeholder="06 12 34 56 78"></label><label class="rdl">Instagram<input id="ctIg" placeholder="@pseudo" autocapitalize="off"></label><button type="button" class="btn" id="ctSave">Enregistrer</button></div>`:
      `<div class="ctl">${tel?`<a class="ctb msg" href="sms:${tel}" target="_blank" rel="noopener">${ICO("chat",20)}<span>Message</span></a><a class="ctb call" href="tel:${tel}" target="_blank" rel="noopener">${ICO("phone",20)}<span>Appeler</span></a>`:""}${ig?`<a class="ctb ig" href="https://ig.me/m/${encodeURIComponent(ig)}" target="_blank" rel="noopener">${ICO("camera",20)}<span>Instagram</span></a>`:""}</div><button type="button" class="lnk" id="ctEd">Modifier le numéro ou l'Insta</button>`}
      <button type="button" class="btn primary" id="ctOk">C'est fait !</button><button type="button" class="btn" id="ctX">Plus tard</button></div>`;
    o.querySelector(".ctn").textContent=who;o.querySelector(".ctq").textContent=n;
    const ti=o.querySelector("#ctTel");if(ti){ti.value=P.phone||P.tel||"";o.querySelector("#ctIg").value=P.ig||"";o.querySelector("#ctSave").onclick=()=>{P.tel=P.phone=ti.value.trim();P.ig=o.querySelector("#ctIg").value.trim();save();sfx("coin");draw(false)}}
    const ed=o.querySelector("#ctEd");if(ed)ed.onclick=()=>draw(true);
    o.querySelectorAll(".ctb").forEach(a=>a.addEventListener("click",()=>{o.querySelector(".ctc").classList.add("sent")}));
    o.querySelector("#ctX").onclick=close;o.querySelector("#ctOk").onclick=()=>{close();S.bondsLast[who]=Date.now();qPass(btn)}};
  draw(false)}
// cadeau : idée -> acheté -> offert
function gfKey(who){const bd=(S.profiles[who]||{}).bd,t=new Date();t.setHours(0,0,0,0);let y=t.getFullYear();if(bd&&bd.m){const d=new Date(y,bd.m-1,bd.d);if((t-d)/864e5>2)y++}return who+":"+y}
function gfState(who){const gk=gfKey(who),G=S.g;if(!G.gfs)G.gfs={};const st=G.gfs[gk]||{};return{gk,idea:(S.profiles[who]||{}).gifts||"",bought:S.log.some(l=>l.gift===gk),given:!!st.given}}
function gfOpen(btn,who,onBuy){const o=document.createElement("div");o.className="bpop gfpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);const close=()=>o.remove();o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const g=gfState(who),stp=g.given?3:g.bought?2:g.idea?1:0;
    o.innerHTML=`<div class="bpc gfc"><div class="gfbox ${stp>=2?"open":""}">${pxImg("chest",5)}</div><h3>Cadeau pour <span class="gfw"></span></h3>
      <ol class="gfst">${["Idée","Acheté","Offert"].map((l,k)=>`<li class="${k<stp?"ok":k===stp?"cur":""}"><i>${k<stp?ICO("check",14):k+1}</i><span>${l}</span></li>`).join("")}</ol>
      ${stp===0?`<label class="rdl">Ton idée<input id="gfI" maxlength="60" placeholder="Ex. un vinyle, un livre de photo"></label><button type="button" class="btn primary" id="gfGo">Noter l'idée · +5 XP</button>`:
       stp===1?`<p class="gfi">Idée : <b></b></p><button type="button" class="btn primary" id="gfGo">Je l'ai acheté !</button><button type="button" class="lnk" id="gfRe">Changer d'idée</button>`:
       stp===2?`<p class="gfi">Idée : <b></b></p><p class="hint">Il ne reste plus qu'à l'offrir le jour J.</p><button type="button" class="btn primary" id="gfGo">Je l'ai offert · +10 XP</button>`:`<p class="gfi">Offert. Bien joué !</p>`}
      <button type="button" class="btn" id="gfX">Fermer</button></div>`;
    o.querySelector(".gfw").textContent=who;const ib=o.querySelector(".gfi b");if(ib)ib.textContent=g.idea;o.querySelector("#gfX").onclick=close;
    const re=o.querySelector("#gfRe");if(re)re.onclick=()=>{S.profiles[who].gifts="";save();draw()};
    const go=o.querySelector("#gfGo");if(!go)return;
    go.onclick=ev=>{if(stp===0){const v=o.querySelector("#gfI").value.trim();if(!v){sfx("error");return}S.profiles[who]=S.profiles[who]||{};S.profiles[who].gifts=v;const prev=levelInfo(S.xp).l;addBonus("Idée cadeau pour "+who,5,0,"gfi");save();render(prev);sfx("coin");draw()}
      else if(stp===1){close();if(btn)qPass(btn);else if(onBuy)onBuy(ev);sfx("open",1)}
      else if(stp===2){S.g.gfs[g.gk]={given:Date.now()};const prev=levelInfo(S.xp).l;addBonus("Cadeau offert à "+who,10,0,"gfo");save();render(prev);sfx("level");close();toast(`Cadeau offert à <span class="p">${esc(who)}</span> · +10 XP`)}}};
  draw()}
// lecture
const rdXp=k=>Math.max(2,Math.min(60,k)),rdXpEnd=k=>Math.max(5,Math.min(150,k));
function rdOpen(btn,n,fin){const G=S.g;const o=document.createElement("div");o.className="bpop rdpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);
  let k=10;const close=()=>o.remove();o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const B=G.book;
    if(!B){o.innerHTML=`<div class="bpc rdc"><div class="rdic">${pxImg("book",5)}</div><h3>${fin?"Quel livre as-tu fini ?":"Quel livre lis-tu ?"}</h3><label class="rdl">Titre<input id="rdT" maxlength="60" placeholder="Ex. L'Alchimiste"></label><label class="rdl">Nombre de pages<input id="rdN" type="number" inputmode="numeric" min="1" max="5000" placeholder="Ex. 220"></label><button type="button" class="btn primary" id="rdGo">${fin?"Continuer":"Commencer le livre"}</button><button type="button" class="btn" id="rdX">Annuler</button></div>`;
      o.querySelector("#rdX").onclick=close;o.querySelector("#rdGo").onclick=()=>{const t=o.querySelector("#rdT").value.trim(),nn=parseInt(o.querySelector("#rdN").value,10);if(!t||!(nn>0)){sfx("error");return}G.book={t,n:nn,p:0,s:Date.now()};save();sfx("start");draw()};return}
    const pct=Math.round(B.p/B.n*100),left=B.n-B.p;
    if(fin){const xe=rdXpEnd(left);o.innerHTML=`<div class="bpc rdc"><div class="rdic">${pxImg("book",5)}</div><small class="rdk">Livre fini</small><h3 class="rdt"></h3><div class="rdbar"><i style="width:${pct}%"></i></div><p class="rdp">Page ${B.p} / ${B.n} · il restait <b>${left} page${left>1?"s":""}</b></p>
      <p class="rdx">+${xe} XP pour les pages restantes + 40 XP de livre fini</p><button type="button" class="btn primary" id="rdOk">Oui, je l'ai fini !</button><div class="rdlinks"><button type="button" class="lnk" id="rdNew">Ce n'est pas ce livre</button><button type="button" class="lnk" id="rdX">Annuler</button></div></div>`;
      o.querySelector(".rdt").textContent=B.t;o.querySelector("#rdX").onclick=close;o.querySelector("#rdNew").onclick=()=>{G.book=null;save();draw()};
      o.querySelector("#rdOk").onclick=()=>{close();rdPages(left);B.p=B.n;B.x=(B.x||0)+xe;B.ss=(B.ss||0)+1;qPass(btn,xe);rdDone(B)};return}
    k=Math.min(k,left)||1;
    o.innerHTML=`<div class="bpc rdc"><small class="rdk">Livre en cours</small><h3 class="rdt"></h3><div class="rdbar"><i style="width:${pct}%"></i></div><p class="rdp">Page ${B.p} / ${B.n} · <b>${pct} %</b></p>
      <p class="rdq">Combien de pages as-tu lues ?</p><div class="rdk2"><button type="button" class="btn rdm" data-d="-5">-5</button><button type="button" class="btn rdm" data-d="-1">-1</button><b class="rdv">${k}</b><button type="button" class="btn rdm" data-d="1">+1</button><button type="button" class="btn rdm" data-d="5">+5</button></div>
      <p class="rdx">${B.p+k>=B.n?"Livre terminé · ":""}+${rdXp(k)} XP${B.p+k>=B.n?" + 40 XP bonus":""}</p><button type="button" class="btn primary" id="rdOk">Valider</button><div class="rdlinks"><button type="button" class="lnk" id="rdNew">Changer de livre</button><button type="button" class="lnk" id="rdX">Annuler</button></div></div>`;
    o.querySelector(".rdt").textContent=B.t;
    o.querySelectorAll(".rdm").forEach(b=>b.onclick=()=>{k=Math.max(1,Math.min(left,k+ +b.dataset.d));draw()});
    o.querySelector("#rdX").onclick=close;o.querySelector("#rdNew").onclick=()=>{if(confirm("Abandonner « "+B.t+" » et en commencer un autre ?")){G.book=null;save();draw()}};
    o.querySelector("#rdOk").onclick=()=>{const done=B.p+k>=B.n;rdPages(Math.min(k,B.n-B.p));B.p=Math.min(B.n,B.p+k);B.x=(B.x||0)+rdXp(k);B.ss=(B.ss||0)+1;close();qPass(btn,rdXp(k));
      if(done)rdDone(B);else save()}};
  draw()}
function rdPages(k){const G=S.g,ym=ymOf(Date.now());if(!G.rdp)G.rdp={};G.rdp[ym]=(G.rdp[ym]||0)+k}
function rdDone(B){const G=S.g;if(!Array.isArray(G.books))G.books=[];G.books.push({t:B.t,n:B.n,s:B.s,d:Date.now(),x:(B.x||0)+40,ss:B.ss||1});G.book=null;const prev=levelInfo(S.xp).l;addBonus("Livre fini : "+B.t,40,0,"book");save();render(prev);
  setTimeout(()=>{sfx("level");toast(`Livre terminé : <span class="p">${esc(B.t)}</span> · +40 XP. La prochaine lecture te demandera ton nouveau livre.`)},900)}
// pompes
function puTarget(n,P){P=P||{};let m=n.match(/(\d+)\s*séries?\s*de\s*(\d+)/i);if(m)return{s:+m[1],r:+m[2]};m=n.match(/(\d+)\s*séries?/i);if(m)return{s:+m[1],r:Math.max(5,Math.round((P.rec||10)/2))};
  if(/record/i.test(n))return{s:1,r:(P.rec||0)+1,rec:1};m=n.match(/(\d+)\s*(?:pompes|squats)/i);if(m)return{s:1,r:+m[1]};return{s:1,r:10}}
const PU_CALL=["Encore !","Ça chauffe !","Machine !","Bête de guerre !","Inarrêtable !","Légendaire !"];
const REPK={pu:{rk:"pu",u:"pompes",help:"Pose le téléphone au sol et touche l'écran avec le nez à chaque pompe"},sq:{rk:"sq",u:"squats",help:"Pose le téléphone sur une chaise devant toi et touche l'écran à chaque remontée"}};
function puOpen(btn,n){const G=S.g,K=/squat/i.test(n)?REPK.sq:REPK.pu;if(!G[K.rk])G[K.rk]={rec:0,tot:0};const P=G[K.rk],T=puTarget(n,P),goal=T.s*T.r,rec0=P.rec||0;let c=0,set=0,best=0,run=0,recHit=0;
  const o=document.createElement("div");o.className="pu rep-"+K.rk;o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  o.innerHTML=`<div class="puh"><b class="pun"></b><small>${T.s>1?T.s+" séries de "+T.r:"Objectif "+goal}${rec0?" · record "+rec0:""}</small></div>
    <button type="button" class="pupad" aria-label="Compter"><span class="pufx" aria-hidden="true"></span><span class="puban"></span><span class="puset"></span><b class="puc">0</b><span class="pug"><i></i><em></em></span><span class="pucall"></span><small class="puhelp">${K.help}</small></button>
    <div class="pub"><button type="button" class="btn" id="puX">Annuler</button><button type="button" class="btn primary" id="puOk" disabled>Terminer</button></div>`;
  o.querySelector(".pun").textContent=n;document.body.appendChild(o);puDecor(o,1);
  const C=o.querySelector(".puc"),SET=o.querySelector(".puset"),GI=o.querySelector(".pug i"),GR=o.querySelector(".pug em"),OK=o.querySelector("#puOk"),BAN=o.querySelector(".puban"),CALL=o.querySelector(".pucall"),FX=o.querySelector(".pufx"),PAD=o.querySelector(".pupad");
  const bonus=()=>Math.min(30,Math.max(0,c-goal))+(recHit?10:0);
  const upd=()=>{C.textContent=c;SET.textContent=T.s>1&&c<goal?`Série ${Math.min(T.s,set+1)} / ${T.s}`:"";
    const top=Math.max(goal,rec0||0,c);GI.style.width=Math.min(100,c/top*100)+"%";GR.style.left=rec0&&rec0>goal?Math.min(100,rec0/top*100)+"%":"-999px";
    OK.disabled=c<goal;const b=bonus();OK.textContent=c<goal?"Encore "+(goal-c):"Fait"};
  const burst=(k)=>{for(let i=0;i<k;i++){const e=document.createElement("i");const a=Math.random()*Math.PI*2,d=70+Math.random()*90;e.style.setProperty("--dx",Math.cos(a)*d+"px");e.style.setProperty("--dy",Math.sin(a)*d+"px");e.style.setProperty("--d",(.45+Math.random()*.35)+"s");FX.appendChild(e);setTimeout(()=>e.remove(),900)}};
  PAD.addEventListener("pointerdown",e=>{e.preventDefault();c++;run++;best=Math.max(best,run);
    if(T.s>1&&c%T.r===0&&c<goal){set++;run=0;sfx("badge")}
    const over=c>goal,isRec=rec0>0&&best>rec0&&!(T.s>1&&c<goal);
    if(isRec&&!recHit){recHit=1;o.classList.add("rec");BAN.textContent="NOUVEAU RECORD !";BAN.classList.remove("show");void BAN.offsetWidth;BAN.classList.add("show");sfx("level");burst(26)}
    else if(c===goal){o.classList.add("goal");BAN.textContent="OBJECTIF ATTEINT";BAN.classList.remove("show");void BAN.offsetWidth;BAN.classList.add("show");sfx("moment");burst(14)}
    else if(over||recHit){sfx("rep",Math.min(24,(c-goal)))}else sfx("blip");
    if(over){o.classList.add("over");const ex=c-goal;CALL.textContent=recHit?`+${best-rec0} au-dessus du record`:(PU_CALL[Math.min(PU_CALL.length-1,Math.floor((ex-1)/3))]+" +"+ex);if(!recHit&&!(c===goal))burst(Math.min(12,4+ex))
      if(recHit)burst(10);o.style.setProperty("--heat",Math.min(1,ex/15).toFixed(2))}
    C.classList.remove("pop");void C.offsetWidth;C.classList.add("pop");puAvHop(o);o.classList.remove("shk");void o.offsetWidth;if(over)o.classList.add("shk");upd()});
  o.querySelector("#puX").onclick=()=>o.remove();
  OK.onclick=()=>{const rec=best>rec0,b=bonus();P.tot=(P.tot||0)+c;{const ym=ymOf(Date.now());if(!P.m)P.m={};P.m[ym]=(P.m[ym]||0)+c}if(rec)P.rec=best;o.remove();qPass(btn,null,b);if(rec&&rec0)setTimeout(()=>toast(`Nouveau record : <span class="p">${best} ${K.u}</span> d'affilée !`),900);else if(b)setTimeout(()=>toast(`${c} ${K.u} : <span class="p">+${b} XP</span> de bonus`),900)};
  upd()}

