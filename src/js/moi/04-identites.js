// ===== Identités : ce que tu deviens
const IDM={pages:()=>Object.values((S.g&&S.g.rdp)||{}).reduce((a,b)=>a+b,0),books:()=>((S.g&&S.g.books)||[]).length,
  sport:()=>S.stats.sport||0,km:()=>Math.round(Object.values((S.g&&S.g.run&&S.g.run.m)||{}).reduce((a,b)=>a+b,0)),
  son:()=>{const k=S.skills.find(x=>x.name==="Sons");return k?k.xp:0},rel:()=>Object.keys((S.g&&S.g.rel)||{}).length,
  lien:()=>(S.stats.social||0)+(S.stats.famille||0),days:()=>S.days.length,zen:()=>Object.values((S.g&&S.g.md&&S.g.md.m)||{}).reduce((a,b)=>a+b,0),
  maison:()=>S.stats.maison||0,travail:()=>S.stats.travail||0,repas:()=>Object.values((S.g&&S.g.mb)||{}).filter(b=>b&&b.xp>0).length};
const IDU={pages:"pages",books:"livres finis",sport:"XP de Sport",km:"km courus",son:"XP de musique",rel:"sons sortis",lien:"XP de relations",days:"jours actifs",zen:"min de méditation",maison:"XP de Maison",travail:"XP de Travail",repas:"bilans repas"};
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
// La section « Ce que tu deviens » a été retirée de Ma vie le 03/11 (Ilario ne s'y référait jamais) ; les identités restent (création du profil, quêtes, résolutions).
