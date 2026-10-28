// Collection, vitrine des badges, onglets et navigation entre écrans (ex-26, partie 3)
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
const subs={c:"vie",q:"q"};try{Object.assign(subs,JSON.parse(localStorage.getItem("cq-subs")||"{}"))}catch(e){}
if(subs.c==="prj")subs.c="vie";if(subs.c==="badges")subs.c="wr";if(!["vie","wr","bilan"].includes(subs.c))subs.c="vie";delete subs.t;subs.q="q";
let lastNb=0;
function badgeDots(){const n=(S.g&&S.g.nb||[]).length,grew=n>lastNb;lastNb=n;{const r=document.documentElement;r.classList.toggle("anb",n>0);r.style.setProperty("--nb",String(n))}  // pastilles CSS sur la Chambre et la tuile Badges (redessinées souvent)
  [["tabC",n],["subWr",n]].forEach(([id,c])=>{const el=id==="subWr"?document.querySelector('.subtabs button[data-sub="wr"]'):$(id);if(!el)return;let d=el.querySelector(".ndot");if(c&&!d){d=document.createElement("span");d.className="ndot";el.appendChild(d)}if(d){d.hidden=!c;d.textContent=c;if(grew&&c){d.classList.remove("pop");void d.offsetWidth;d.classList.add("pop")}}})}
// sous des onglets, la première section visible ne trace pas sa ligne de séparation (les onglets séparent déjà)
function sepFirst(){document.querySelectorAll("#vieBox").forEach(sec=>{let first=true;[...sec.children].forEach(c=>{if(!c.classList.contains("vie-c"))return;const v=c.offsetParent!==null;c.classList.toggle("premier",v&&first);if(v)first=false})});document.querySelectorAll(".wrap>.subtabs").forEach(t=>{let x=t.nextElementSibling,first=true;while(x){if(x.tagName==="SECTION"){const v=x.offsetParent!==null&&!x.hidden;x.classList.toggle("sans-sep",v&&first);if(v)first=false}x=x.nextElementSibling}})}
function applySub(){if(view==="c"&&subs.c==="wr"&&S.g&&S.g.nb&&S.g.nb.length){setTimeout(()=>{const t=document.querySelector("#bdgGrid .bdg.new");if(t)t.scrollIntoView({block:"center",behavior:"smooth"})},350)}document.querySelectorAll('[data-v][data-sub]').forEach(el=>el.hidden=view!==el.dataset.v||el.dataset.sub!==subs[el.dataset.v]);document.querySelectorAll(".subtabs").forEach(nv=>nv.querySelectorAll("button").forEach(b=>b.setAttribute("aria-selected",b.dataset.sub===subs[nv.dataset.v])));requestAnimationFrame(placeInds);try{sepFirst()}catch(e){}}
function goSub(v,sb){const old=subs[v];subs[v]=sb;try{localStorage.setItem("cq-subs",JSON.stringify(subs))}catch(e){}if(view!==v){showView(v);SCR.scrollTo(0,0);return}
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
  $("tabQ").setAttribute("aria-selected",v==="q");$("tabR").setAttribute("aria-selected",v==="r"||v==="p");$("tabC").setAttribute("aria-selected",v==="c"||v==="s");
  $("strip").hidden=v!=="q";
  if(v==="p")renderProfile(true);
  if(!fromHash){try{history.replaceState(null,"",v==="b"?"#boutique":v==="s"?"#reglages":v==="t"?"#defis":v==="c"?"#profil":(v==="r"||v==="p")?"#relations":"#quetes")}catch(e){}SCR.scrollTo(0,0)}
}
{const qs=[...document.querySelectorAll(".qxp,.subtabs")];let t=0;const chk=()=>{t=0;qs.forEach(q=>{if(q.hidden||!q.offsetHeight){q.classList.remove("stuck");return}const r=q.getBoundingClientRect(),top=parseFloat(getComputedStyle(q).top)||0;q.classList.toggle("stuck",r.top<=top+.5&&SCR.scrollTop>20)})};SCR.addEventListener("scroll",()=>{if(!t)t=requestAnimationFrame(chk)},{passive:true});}
["spTrack","grid"].forEach(id=>{const el=$(id);el.addEventListener("scroll",()=>{el.classList.toggle("sl",el.scrollLeft>4);el.classList.toggle("end",el.scrollLeft+el.clientWidth>=el.scrollWidth-4&&el.scrollLeft>4)},{passive:true})});
$("wallet").onclick=()=>{goSub("c","wr");setTimeout(()=>{const n=document.querySelector(".subtabs[data-v=c]");if(n)n.scrollIntoView({behavior:"smooth",block:"start"})},200)};$("qxpBtn").onclick=()=>showView("c");$("meSet").onclick=()=>showView("s");
{const tp=$("pfTPick"),tb=$("charTitle"),setT=o=>{tp.hidden=!o;tb.setAttribute("aria-expanded",o)};tb.onclick=()=>setT(tp.hidden);$("pfTClose").onclick=()=>setT(false);window.__closeTPick=()=>setT(false)}$("setBack").onclick=()=>showView("c");$("tabQ").onclick=()=>showView("q");$("tabR").onclick=()=>showView("r");$("tabC").onclick=()=>showView("c");

