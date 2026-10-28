// ---- Figurines (anciens personnages par catégorie, gardés pour la collection), objets, coffres, quêtes du jour
const CB_LIST=[];Object.entries(BOSS_CAT).forEach(([cat,L])=>L.forEach((b,i)=>{const[id,n,sp,col,th,steps]=b;const o={id,n,sp,col,th,steps,cat,i};CB_LIST.push(o);
  AV_OPT.main.push("Figurine : "+n);const idx=AV_OPT.main.length-1;o.fi=idx;AV_MAIN[idx]=[SPRITES[sp],{"#":col,o:"#fff",x:"#1a1a1a"},20,26];
  GEAR.push({id:"fig_"+id,s:"main",k:"main",o:idx,n:"Figurine : "+n.replace(/^(Le|La|L') ?/,""),r:3,ex:"Finir le projet « "+th+" »"});
  AV_OPT.main.push("Figurine dorée : "+n);const gi=AV_OPT.main.length-1;o.gi=gi;AV_MAIN[gi]=[SPRITES[sp],{"#":"#f2c230",o:"#fff",x:"#1a1a1a"},20,26];
  GEAR.push({id:"fig_"+id+"_or",s:"main",k:"main",o:gi,n:"Figurine dorée : "+n,r:3,ex:"Finir deux fois le projet « "+th+" »"})}));
SPRITES.bougon=["....##....","..######..",".##o##o##.",".##x##x##.","##########","###xxxx###",".#x####x#.","..##..##.."];
AV_OPT.hat.push("Bonnet de Noël","Bois de renne");AV_OPT.top.push("Pull de Noël");AV_OPT.bijou.push("Écharpe");AV_OPT.bgP.push("Neige","Nuages","Montagnes","Ville la nuit","Plage","Forêt","Studio","Aurore boréale","Rétro","Bokeh","Nuit de Noël","Feu d'artifice");
AV_OPT.main.push("Sucre d'orge");const XM_CANE=AV_OPT.main.length-1;AV_MAIN[XM_CANE]=[[".kkk.","krwrk","kk.wk","...rk","...wk","...rk","...wk","...rk","...kk"],{r:"#d63b3b",w:"#f4f1e8"},22,24];
AV_OPT.main.push("Figurine : Bougonnoël");const XM_FIG=AV_OPT.main.length-1;AV_MAIN[XM_FIG]=[SPRITES.bougon,{"#":"#3f8f5a",o:"#fff",x:"#1a1a1a"},20,26];
const FIGI={};if(window.chFigure){CB_LIST.forEach(b=>{const F=chFigure(b.sp,b.col,false),Gd=chFigure(b.sp,b.col,true);CH_MAIN[b.fi]=F.main;CH_MAIN[b.gi]=Gd.main;FIGI[b.fi]=F.icon;FIGI[b.gi]=Gd.icon});{const F=chFigure("slime","#3f8f5a",false);CH_MAIN[XM_FIG]=F.main;FIGI[XM_FIG]=F.icon}}
GEAR.push({id:"xmscarf",s:"bijou",k:"bijou",o:8,n:"Écharpe d'hiver",r:1,ex:"Calendrier de l'Avent · case 1"},
 {id:"xmcane",s:"main",k:"main",o:XM_CANE,n:"Sucre d'orge",r:1,ex:"Calendrier de l'Avent · case 4"},
 {id:"bgsnow",s:"fond",k:"bgP",o:11,n:"Fond enneigé",r:2,ex:"Calendrier de l'Avent · case 8"},
 {id:"xmantler",s:"tete",k:"hat",o:21,n:"Bois de renne",r:2,ex:"Calendrier de l'Avent · case 12"},
 {id:"xmsweater",s:"haut",k:"top",o:17,n:"Pull de Noël",r:2,ex:"Calendrier de l'Avent · case 16"},
 {id:"xmflakes",s:"aura",n:"Flocons",r:2,ex:"Calendrier de l'Avent · case 20",svg:'<g stroke="#e8f2ff" stroke-width="1.6" stroke-linecap="round">'+[[14,18,6],[104,26,5],[106,104,6],[16,96,4],[60,10,4]].map(([x,y,r])=>`<path d="M${x-r} ${y}h${2*r}M${x} ${y-r}v${2*r}M${x-r*.7} ${y-r*.7}l${r*1.4} ${r*1.4}M${x-r*.7} ${y+r*.7}l${r*1.4} ${-r*1.4}"/>`).join("")+'</g>'},
 {id:"xmhat",s:"tete",k:"hat",o:20,n:"Bonnet de Noël",r:3,ex:"Calendrier de l'Avent · case 24"},
 {id:"bgxmas",s:"fond",k:"bgP",o:21,n:"Nuit de Noël",r:3,ex:"Ouvrir ton carnet entre le 24 et le 26 décembre"},
 {id:"bgnewyear",s:"fond",k:"bgP",o:22,n:"Feu d'artifice",r:3,ex:"Ouvrir ton carnet entre le 31 décembre et le 2 janvier"},
 {id:"fig_bougon",s:"main",k:"main",o:XM_FIG,n:"Figurine : Bougonnoël",r:3,ex:"Vaincre Bougonnoël avant Noël"});
const gearOf=id=>GEAR.find(x=>x.id===id);
const boostOn=()=>S.g&&S.g.boost>Date.now();
function gearOverlay(){const E=S.g?S.g.eq:{};let s="";[].forEach(k=>{const it=gearOf(E[k]);if(it&&S.g.gear.includes(it.id))s+=(k==="haut"||it.id==="chain")?`<g transform="translate(0,8)">${it.svg}</g>`:k==="aura"?`<g class="aur aur-${it.id}">${it.svg}</g>`:it.svg});return s}

// historique compact par jour (le journal est limité à 300 lignes)
function syncHist(){
  const L=S.log,H=S.g.hist;if(!L.length)return;
  let mn=Infinity;L.forEach(e=>{if(e.t<mn)mn=e.t});const first=dayKey(mn),full=L.length<300;
  const keep=k=>full?k>=first:k>first;
  Object.keys(H).forEach(k=>{if(keep(k))delete H[k]});
  L.forEach(e=>{const k=dayKey(e.t);if(!keep(k))return;const h=H[k]=H[k]||{x:0,c:{},s:0};h.x+=e.xp;const c=catOf(e);if(c&&e.xp)h.c[c]=(h.c[c]||0)+e.xp;if(e.snd)h.s+=Object.values(e.snd).reduce((a,b)=>a+b,0)});
}
let gameMsgs=[];
function gameTick(){
  if(!S.g)S.g=newG();const G=S.g,now=Date.now();let ch=false;
  syncHist();
  // anciennes quêtes de boss encore présentes : retirées ; quêtes du jour périmées : retirées
  S.specials=S.specials.filter(q=>{if(q.bq){ch=true;return false}if(q.bs){ch=true;return false}if(q.sur&&q.sur!==dayKey(now)){ch=true;return false}return true});

  // quête surprise du jour (XP doublé, valable aujourd'hui seulement)
  const tk=dayKey(now);
  {const hh=dayH();S.specials=S.specials.filter(q=>{if(q.org&&q.org!==tk){ch=true;return false}return true});
   if(hh>=15&&G.orgDone!==tk&&!S.specials.some(q=>q.org)){S.specials.push({id:"org"+tk,name:"Préparer mon repas de demain",cat:"nourriture",xp:15,org:tk,lzs:"orga"});ch=true}}
  if(!G.rare||G.rare.d!==tk){const r=Math.random();let k="";if(r<.08)k="x2";else if(r<.16)k="secret";G.rare={d:tk,k,seen:0};if(k)G.rareN=(G.rareN||0)+1;ch=true;
    if(k==="gold")G.bchests=(G.bchests||0)+1;if(k==="x2")G.boost=Date.now()+36e5;
    if(k==="secret"){const L=[["Ramener une viennoiserie à quelqu'un","social"],["Écrire une lettre à la main","famille"],["Ranger un tiroir oublié","maison"],["Marcher 15 min sans téléphone","sport"],["Cuisiner un plat jamais fait","nourriture"],["Apprendre 5 mots d'une langue","soi"],["Enregistrer 30 s d'impro","perso"]],q=L[Math.floor(Math.random()*L.length)];S.specials.unshift({id:"sec"+tk,name:q[0],cat:q[1],xp:45,secret:tk})}}
  S.specials=S.specials.filter(q=>{if(q.secret&&q.secret!==tk){ch=true;return false}return true});
  {S.specials=S.specials.filter(q=>{if(q.fg&&q.d!==tk){ch=true;return false}return true});const FL=fgList().filter(g=>fgMembers(g.id).length>=2);
   if(FL.length&&G.fgDone!==tk&&!S.specials.some(q=>q.fg)&&(Date.now()-Math.max(0,...Object.values(G.fgLast||{0:0})))>4*864e5&&new Date().getDate()%3===0){const lt=x=>(G.fgLast||{})[x.id]||0,g=FL.slice().sort((a,b)=>lt(a)-lt(b))[0],T=["Écrire un message dans le groupe {g}","Proposer une sortie au groupe {g}","Partager un souvenir avec le groupe {g}","Lancer un appel vidéo avec le groupe {g}","Organiser un repas avec le groupe {g}","Prendre des nouvelles du groupe {g}"],t=T[Math.floor(Math.random()*T.length)];
     S.specials.push({id:"fg"+tk,name:t.replace("{g}",g.n),cat:"social",xp:15,fg:g.id,d:tk,col:fgCol(g)});ch=true}}
  if(G.surDone!==tk&&!S.specials.some(q=>q.sur)){const zp=lzState().on.map(lzOf).filter(Boolean).flatMap(L=>L.a.filter(a=>a[2]>=10).map(a=>[L.n+" : "+a[1],a[3],a[2],L.id]));const pool=[...SURPRISE.filter(surOk).map(x=>x[3]==="cour"?[x[0],x[1],x[2]+8]:x),...zp].filter(x=>x[0]!==G.surLast);const[n,c,x,zid]=pool[Math.floor(Math.random()*pool.length)];G.surLast=n;S.specials.unshift({id:"su"+tk,name:n,cat:c,xp:x*2,sur:tk,...(zid?{lzs:zid}:{})});ch=true}
  if(catRewards())ch=true;if(idCheck())ch=true;if(ritAncCheck())ch=true;if(S.g&&ritLive().length)ritCoreCheck();if(wrSetCheck())ch=true;
  const l=levelInfo(S.xp).l;
  if(G.chestLvl==null){G.chestLvl=l;ch=true}
  if(!G.lvcFix){G.lvcFix=1;if(l>=2)G.chests=(G.chests||0)+1;ch=true}
  if(l>G.chestLvl){G.chests=(G.chests||0)+(l-G.chestLvl);gameMsgs.push(`Niveau ${l} : <span class="p">un coffre</span> t'attend`);G.chestLvl=l;ch=true}
  if(gameMsgs.length){const m=gameMsgs.join(" · ");gameMsgs=[];setTimeout(()=>toast(m),1200)}
  return ch;
}
function rollLoot(kind){
  const G=S.g,own=new Set(G.gear),boss=kind==="boss";
  const pool=GEAR.filter(x=>!x.ex&&!own.has(x.id)).map(x=>({k:"gear",it:x,r:x.r})).concat(RARE_TITLES.filter(t=>!G.rt.includes(t)).map(t=>({k:"title",t,r:2})));
  if(!pool.length){addBonus("Coffre : collection complète",50,0);return{k:"xp",r:3,txt:"+50 XP",sub:"Ta collection est complète !",col:RAR[3][1]}}
  const W=boss?[0,0,75,25]:[55,30,12,3];let p=Math.random()*W.reduce((a,b)=>a+b,0),rr=0;for(let i=0;i<4;i++){if((p-=W[i])<=0){rr=i;break}}
  const order=boss?[rr,rr===3?2:3,1,0]:[rr,rr-1,rr-2,rr-3,rr+1,rr+2,rr+3].filter(x=>x>=0&&x<=3);
  let cand=[];for(const r of order){cand=pool.filter(x=>x.r===r);if(cand.length)break}
  const c=cand[Math.floor(Math.random()*cand.length)];
  if(c.k==="title"){G.rt.push(c.t);return{k:"title",r:2,txt:"« "+c.t+" »",sub:RAR[2][0]+" · nouveau titre",col:RAR[2][1]}}
  G.gear.push(c.it.id);return{k:"gear",it:c.it,r:c.it.r,txt:c.it.n,sub:RAR[c.it.r][0]+" · "+(WR_CATS.find(w=>w[0]===c.it.s)||["",""])[1].replace(/s$/,"").toLowerCase(),col:RAR[c.it.r][1]}
}
const CHEST_SVG='<svg viewBox="0 0 32 28" width="96" height="84" shape-rendering="crispEdges" aria-hidden="true"><rect x="2" y="12" width="28" height="14" fill="#8a5a2b"/><rect x="2" y="4" width="28" height="9" fill="#a8703a"/><rect x="2" y="12" width="28" height="2" fill="#5a3a18"/><rect x="0" y="4" width="2" height="22" fill="#e0b030"/><rect x="30" y="4" width="2" height="22" fill="#e0b030"/><rect x="2" y="2" width="28" height="2" fill="#e0b030"/><rect x="2" y="26" width="28" height="2" fill="#e0b030"/><rect x="13" y="10" width="6" height="8" fill="#e0b030"/><rect x="15" y="13" width="2" height="3" fill="#2a1c0c"/></svg>';
const CHEST2=b=>`<svg class="cx" viewBox="0 0 32 30" width="160" height="150" shape-rendering="crispEdges" aria-hidden="true">
<g class="cx-base"><rect x="2" y="14" width="28" height="14" fill="#8a5a2b"/><rect x="2" y="14" width="28" height="2" fill="#5a3a18"/><rect x="0" y="13" width="2" height="15" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="30" y="13" width="2" height="15" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="2" y="28" width="28" height="2" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="13" y="14" width="6" height="6" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="15" y="16" width="2" height="3" fill="#2a1c0c"/><rect x="4" y="18" width="2" height="8" fill="#a8703a"/></g>
<g class="cx-glow"><rect x="3" y="11" width="26" height="3" fill="var(--lc)"/></g>
<g class="cx-lid"><rect x="2" y="5" width="28" height="9" fill="#a8703a"/><rect x="2" y="3" width="28" height="2" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="0" y="5" width="2" height="9" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="30" y="5" width="2" height="9" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="13" y="9" width="6" height="5" fill="${b?"#b06ad9":"#e0b030"}"/><rect x="4" y="7" width="20" height="1" fill="#c48a4a"/></g></svg>`;
function lxBurst(fx,n,col,big){const C=[col,"#f2c94c","#fff6c8",col,"#ffffff"];for(let i=0;i<n;i++){const p=document.createElement("i");const a=Math.random()*Math.PI*2,d=(big?140:90)+Math.random()*(big?160:90);p.style.setProperty("--dx",Math.cos(a)*d+"px");p.style.setProperty("--dy",Math.sin(a)*d-40+"px");p.style.setProperty("--c",C[i%C.length]);p.style.setProperty("--s",(4+Math.floor(Math.random()*3)*2)+"px");p.style.animationDelay=Math.random()*.08+"s";fx.appendChild(p)}setTimeout(()=>{fx.innerHTML=""},1600)}
function openChest(kind){
  const G=S.g;kind=kind==="boss"||(!G.chests&&G.bchests)?"boss":"day";if(kind==="boss"){if(!G.bchests)return;G.bchests--}else{if(!G.chests)return;G.chests--}G.opened++;
  const res=rollLoot(kind),r=res.r|0;G.ol.push({t:Date.now(),k:res.k});if(G.ol.length>200)G.ol=G.ol.slice(-200);save();
  let ov=$("lootOv");if(!ov){ov=document.createElement("div");ov.id="lootOv";document.body.appendChild(ov)}ov.className="lootov lx-ov";
  const red=matchMedia("(prefers-reduced-motion: reduce)").matches;
  ov.innerHTML=`<div class="lx r${r}${kind==="boss"?" lxb":""}" role="dialog" aria-modal="true" aria-label="${kind==="boss"?"Coffre spécial":"Coffre"}" style="--lc:${res.col}">
    <div class="lx-rays"></div><div class="lx-flash"></div>
    <div class="lx-stage"><span class="lx-kind">${kind==="boss"?"Coffre spécial":"Coffre du jour"}</span><button type="button" class="lx-chest" aria-label="Toucher le coffre pour l'ouvrir">${CHEST2(kind==="boss")}</button><p class="lx-hint">Touche le coffre !</p><div class="lx-dots"><i></i><i></i><i></i></div></div>
    <div class="lx-loot" hidden><em class="lrar">${RAR[r][0]}</em><span class="lk">${res.k==="gear"?itemImg(res.it,96):pxImg("check",6)}</span><b></b><small></small><button class="btn primary" type="button">Super !</button></div>
    <div class="lx-fx"></div></div>`;
  ov.querySelector(".lx-loot b").textContent=res.txt;ov.querySelector(".lx-loot small").textContent=res.sub;ov.hidden=false;
  const lx=ov.querySelector(".lx"),ch=ov.querySelector(".lx-chest"),fx=ov.querySelector(".lx-fx");let taps=0,done=false;
  sfx("drop");
  const reveal=()=>{if(done)return;done=true;lx.classList.add("open");sfx("open",r);if(navigator.vibrate)try{navigator.vibrate(r>=2?[30,40,60]:30)}catch(e){}
    if(!red)lxBurst(fx,[10,18,30,48][r],res.col,r>=2);
    setTimeout(()=>{const l=ov.querySelector(".lx-loot");l.hidden=false;lx.classList.add("shown");const b=l.querySelector("button");b.focus({preventScroll:true})},red?50:520)};
  ch.onclick=()=>{if(done)return;taps++;sfx("shake",taps);lx.style.setProperty("--k",taps);lx.classList.add("k"+taps);ch.classList.remove("hit");void ch.offsetWidth;ch.classList.add("hit");
    ov.querySelectorAll(".lx-dots i").forEach((d,i)=>d.classList.toggle("on",i<taps));if(!red)lxBurst(fx,3+taps*2,taps>=2?res.col:"#f2c94c",false);
    if(taps>=3)setTimeout(reveal,red?0:260)};
  ov.querySelector(".lx-loot button").onclick=()=>{ov.hidden=true;ov.innerHTML="";render()};
}
function renderGame(){
  const box=$("gameBox");if(!box)return;const G=S.g;
  const nc=(G.chests||0)+(G.bchests||0);box.innerHTML=nc?`<button type="button" class="gcard chestb${G.bchests?" bossc":""}" id="chestBtn"><span class="cic">${CHEST_SVG}</span><span><b>${G.bchests?"Coffre spécial":nc>1?nc+" coffres à ouvrir":"Un coffre à ouvrir"}</b><small>${G.bchests?"Objet épique garanti":"Un nouvel objet"}</small></span><span class="go">Ouvrir</span></button>`:"";
  box.classList.toggle("gempty",!box.innerHTML);
  const cb=$("chestBtn");if(cb)cb.onclick=openChest;
}

