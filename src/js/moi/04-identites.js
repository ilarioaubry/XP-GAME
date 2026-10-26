// ===== Identités : ce que tu deviens
const IDM={pages:()=>Object.values((S.g&&S.g.rdp)||{}).reduce((a,b)=>a+b,0),books:()=>((S.g&&S.g.books)||[]).length,
  sport:()=>S.stats.sport||0,km:()=>Math.round(Object.values((S.g&&S.g.run&&S.g.run.m)||{}).reduce((a,b)=>a+b,0)),
  son:()=>{const k=S.skills.find(x=>x.name==="Sons");return k?k.xp:0},rel:()=>Object.keys((S.g&&S.g.rel)||{}).length,
  lien:()=>(S.stats.social||0)+(S.stats.famille||0),days:()=>S.days.length,zen:()=>Object.values((S.g&&S.g.md&&S.g.md.m)||{}).reduce((a,b)=>a+b,0),
  maison:()=>S.stats.maison||0,travail:()=>S.stats.travail||0,repas:()=>Object.values((S.g&&S.g.mb)||{}).filter(b=>b&&b.xp>0).length};
const IDU={pages:"pages",books:"livres finis",sport:"XP de Force",km:"km courus",son:"XP de musique",rel:"sons sortis",lien:"XP de relations",days:"jours actifs",zen:"min de méditation",maison:"XP de Maison",travail:"XP de Travail",repas:"bilans repas"};
const idOf=id=>IDS.find(x=>x.id===id);
function idStage(I){let k=0;I.st.forEach((s,i)=>{if(IDM[s[1]]()>=s[2])k=i+1});return k}
function idState(){const G=S.g;if(!G.idt)G.idt={ch:[],seen:{},log:[]};const T=G.idt;if(!Array.isArray(T.ch))T.ch=[];if(!T.seen)T.seen={};if(!Array.isArray(T.log))T.log=[];return T}
let idQ=[];
function idCheck(){if(!S.g)return false;const T=idState(),init=!T.init;let ch=false;
  IDS.forEach(I=>{const k=idStage(I),old=T.seen[I.id]||0;if(k>old){for(let i=old;i<k;i++){T.log.push({id:I.id,s:i,t:Date.now()});if(!init)idQ.push([I,i])}T.seen[I.id]=k;ch=true}});
  if(init){T.init=1;ch=true}if(idQ.length)setTimeout(idShowNext,1600);return ch}
function idShowNext(){if(!idQ.length||document.querySelector(".idpop,.bpop,.pu"))return idQ.length&&setTimeout(idShowNext,2500);const [I,i]=idQ.shift(),st=I.st[i],chosen=idState().ch.includes(I.id);
  const o=document.createElement("div");o.className="bpop idpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.style.setProperty("--ic",I.c);
  o.innerHTML=`<div class="bpc idc"><span class="idk">${chosen?"Ton chemin · ":""}${esc(I.n)}</span><div class="idbig">${pxImg(I.ic,6)}</div><h3></h3><p class="idmsg"></p><div class="idsteps">${I.st.map((x,j)=>`<i class="${j<=i?"on":""}"></i>`).join("")}</div><button type="button" class="btn primary">Continuer</button></div>`;
  o.querySelector("h3").textContent=st[0];o.querySelector(".idmsg").textContent=st[3];
  o.querySelector(".btn").onclick=()=>{o.remove();setTimeout(idShowNext,400)};document.body.appendChild(o);sfx("level")}
function idNext(I){const k=idStage(I);if(k>=I.st.length)return null;const s=I.st[k],cur=IDM[s[1]]();return{s,cur,left:Math.max(0,s[2]-cur),pct:Math.min(100,cur/s[2]*100)}}
function idPick(){const T=idState(),o=document.createElement("div");o.className="bpop idpick";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);const close=()=>{o.remove();renderIdentity();renderActCards()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{o.innerHTML=`<div class="bpc idpc"><h3>Qui veux-tu devenir ?</h3><p class="hint" style="margin:0">Choisis jusqu'à 3 identités. L'appli te proposera des actions dans leur sens.</p><div class="idlist">${IDS.map(I=>{const on=T.ch.includes(I.id),k=idStage(I);return`<button type="button" class="idopt${on?" on":""}" data-id="${I.id}" style="--ic:${I.c}"><span class="idi">${pxImg(I.ic,3)}</span><span class="idt"><b>${esc(I.n)}</b><small>${esc(I.d)}</small>${k?`<em>${esc(I.st[k-1][0])}</em>`:""}</span></button>`}).join("")}</div><button type="button" class="btn primary" id="idOk">Valider</button></div>`;
    o.querySelectorAll(".idopt").forEach(b=>b.onclick=()=>{const id=b.dataset.id,i=T.ch.indexOf(id);if(i>=0)T.ch.splice(i,1);else{if(T.ch.length>=3)T.ch.shift();T.ch.push(id)}save();draw()});
    o.querySelector("#idOk").onclick=close};
  draw()}
// renderIdentity : finitions autour de renderIdentityBase (le cœur), ex-retouche de correctifs.js
function renderIdentity(){const r=renderIdentityBase.apply(this,arguments);try{idViz()}catch(e){console.warn("renderIdentity",e)}return r}
function renderIdentityBase(){const box=$("idBox");if(!box||!S.g)return;const T=idState();
  if(!T.ch.length){box.innerHTML=`<button type="button" class="idempty" id="idGo"><b>Qui veux-tu devenir ?</b><small>Choisis 1 à 3 identités : lecteur, sportif, artiste, ami présent…</small><span class="go">Choisir</span></button>`;$("idGo").onclick=idPick;return}
  box.innerHTML=`<div class="idhead"><b>Ce que tu deviens</b><button type="button" class="lnk" id="idChg">Changer</button></div>`+T.ch.map(id=>{const I=idOf(id);if(!I)return"";const k=idStage(I),nx=idNext(I),last=T.log.filter(l=>l.id===id).slice(-1)[0];
    return`<div class="idcard" style="--ic:${I.c}"><span class="idi">${pxImg(I.ic,4)}</span><div class="idt">${k&&String(I.st[k-1][0]).toLowerCase()===String(I.n).toLowerCase()?"":`<small>${esc(I.n)}</small>`}<b>${k?esc(I.st[k-1][0]):"Le chemin commence"}</b>${nx?`<span class="idbar"><i style="width:${nx.pct}%"></i></span><em>Encore ${nx.left} ${IDU[nx.s[1]]} pour « ${esc(nx.s[0])} »</em>`:`<em>Chemin accompli</em>`}</div><div class="idsteps">${I.st.map((x,j)=>`<i class="${j<k?"on":""}" title="${esc(x[0])}"></i>`).join("")}</div></div>`}).join("");
  $("idChg").onclick=idPick}
