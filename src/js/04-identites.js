// ===== Identités : ce que tu deviens
const IDM={pages:()=>Object.values((S.g&&S.g.rdp)||{}).reduce((a,b)=>a+b,0),books:()=>((S.g&&S.g.books)||[]).length,
  sport:()=>S.stats.sport||0,km:()=>Math.round(Object.values((S.g&&S.g.run&&S.g.run.m)||{}).reduce((a,b)=>a+b,0)),
  son:()=>{const k=S.skills.find(x=>x.name==="Sons");return k?k.xp:0},rel:()=>Object.keys((S.g&&S.g.rel)||{}).length,
  lien:()=>(S.stats.social||0)+(S.stats.famille||0),days:()=>S.days.length,zen:()=>Object.values((S.g&&S.g.md&&S.g.md.m)||{}).reduce((a,b)=>a+b,0),
  maison:()=>S.stats.maison||0,travail:()=>S.stats.travail||0,repas:()=>Object.values((S.g&&S.g.mb)||{}).filter(b=>b&&b.xp>0).length};
const IDU={pages:"pages",books:"livres finis",sport:"XP de Force",km:"km courus",son:"XP de musique",rel:"sons sortis",lien:"XP de relations",days:"jours actifs",zen:"min de méditation",maison:"XP de Maison",travail:"XP de Travail",repas:"bilans repas"};
const IDS=[
 {id:"lect",n:"Lecteur",c:"#b5512e",ic:"book",cats:[],k:["lire","livre"],d:"Lire chaque semaine, finir des livres.",st:[
  ["Tu ouvres des livres","pages",30,"Tes 30 premières pages. Tout lecteur a commencé exactement comme ça."],
  ["Tu lis régulièrement","pages",300,"300 pages lues : la lecture fait partie de tes semaines."],
  ["Lecteur","books",3,"3 livres finis : tu es devenu un lecteur."],
  ["Grand lecteur","books",10,"10 livres finis. Les livres font partie de qui tu es."]]},
 {id:"sport",n:"Sportif",c:"#ff6a3d",ic:"flame",cats:["sport"],k:[],d:"Bouger tous les jours, se dépasser.",st:[
  ["Tu bouges","sport",100,"Tes premiers efforts comptent. Ton corps commence à s'en souvenir."],
  ["Tu t'entraînes","sport",600,"L'effort n'est plus une exception : tu t'entraînes."],
  ["Sportif","sport",2000,"Des semaines d'efforts : tu es devenu sportif."],
  ["Athlète","sport",5000,"Le sport fait partie de toi. Tu es un athlète."]]},
 {id:"run",n:"Coureur",c:"#3a9cff",ic:"flame",cats:["sport"],k:["cour","course","marche"],d:"Courir, accumuler les kilomètres.",st:[
  ["Tu cours","km",5,"Tes 5 premiers kilomètres. Le plus dur est fait."],
  ["Coureur du dimanche","km",25,"25 km au compteur : tu as pris le rythme."],
  ["Coureur","km",100,"100 km parcourus : tu es devenu un coureur."],
  ["Marathonien dans l'âme","km",400,"400 km. Ton corps connaît la route."]]},
 {id:"art",n:"Artiste",c:"#9b5de5",ic:"star",cats:["perso"],k:["son","couplet","maquette","instru","mix"],d:"Créer souvent, sortir ses sons.",st:[
  ["Tu crées","son",50,"Tes premières séances de création. L'artiste se construit là."],
  ["Tu crées souvent","son",300,"La création est devenue une habitude."],
  ["Artiste qui sort ses sons","rel",1,"Ton premier son est sorti : tu es un artiste qui partage son travail."],
  ["Artiste confirmé","rel",6,"6 sons sortis. Ta musique existe vraiment."]]},
 {id:"ami",n:"Ami présent",c:"#ff7aa8",ic:"heart",cats:["social","famille"],k:["écri","appel","voir","nouvelles","groupe"],d:"Prendre des nouvelles, être là pour les siens.",st:[
  ["Tu prends des nouvelles","lien",100,"Tu reviens vers les gens. Ils le remarquent."],
  ["Ami présent","lien",500,"Tu es devenu quelqu'un de présent pour tes proches."],
  ["Ami sur qui on compte","lien",1500,"On sait qu'on peut compter sur toi."],
  ["Pilier de ta bande","lien",4000,"Tu tiens ton cercle ensemble. Tu en es le pilier."]]},
 {id:"reg",n:"Discipliné",c:"#e0a020",ic:"check",cats:[],k:[],d:"Être là chaque jour, même un peu.",st:[
  ["Tu t'y mets","days",7,"7 jours actifs : la machine est lancée."],
  ["Régulier","days",30,"30 jours actifs : la régularité devient ta nature."],
  ["Discipliné","days",100,"100 jours. Tu n'as plus besoin de motivation, tu as une discipline."],
  ["Inarrêtable","days",250,"250 jours. Rien ne t'arrête."]]},
 {id:"zen",n:"Esprit calme",c:"#5a9cf0",ic:"hourglass",cats:["sport","soi"],k:["médit","respir","étirement"],d:"Méditer, respirer, ralentir.",st:[
  ["Tu respires","zen",10,"Tes 10 premières minutes de calme."],
  ["Esprit calme","zen",60,"Une heure de méditation au total : tu sais ralentir."],
  ["Zen","zen",300,"300 minutes. Le calme est devenu un réflexe."],
  ["Maître zen","zen",1000,"1 000 minutes de présence à toi-même."]]},
 {id:"org",n:"Organisé",c:"#8a4df0",ic:"chest",cats:["maison"],k:["rang","lessive","vaisselle","draps","tri"],d:"Un lieu de vie rangé, des choses faites.",st:[
  ["Tu ranges","maison",100,"Ton espace commence à te ressembler."],
  ["Organisé","maison",500,"Tu es devenu quelqu'un d'organisé."],
  ["Maison nickel","maison",1500,"Chez toi, tout a sa place."],
  ["Maître des lieux","maison",4000,"Ton lieu de vie est entièrement à ton image."]]},
 {id:"pro",n:"Bosseur",c:"#6f8fe0",ic:"star",cats:["travail"],k:["travail","dossier","tâche","mails"],d:"Avancer chaque jour sur ce qui compte.",st:[
  ["Tu t'y mets","travail",100,"Tes premières heures de travail concentré."],
  ["Bosseur","travail",600,"Tu avances vraiment : tu es un bosseur."],
  ["Pro","travail",2000,"Le travail sérieux est devenu ta norme."],
  ["Expert","travail",5000,"Des centaines d'heures : tu es un expert."]]},
 {id:"sante",n:"Bien dans son assiette",c:"#5fae4f",ic:"plate",cats:["nourriture"],k:["repas","cuisin"],d:"Bien manger, prendre soin de soi.",st:[
  ["Tu fais attention","repas",7,"7 bilans repas : tu regardes ce que tu manges."],
  ["Tu manges bien","repas",30,"30 bilans : bien manger devient naturel."],
  ["Bien dans ton assiette","repas",100,"100 bilans. Tu prends soin de toi."],
  ["Hygiène de vie","repas",250,"Ton hygiène de vie est solide."]]}];
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
function renderIdentity(){const box=$("idBox");if(!box||!S.g)return;const T=idState();
  if(!T.ch.length){box.innerHTML=`<button type="button" class="idempty" id="idGo"><b>Qui veux-tu devenir ?</b><small>Choisis 1 à 3 identités : lecteur, sportif, artiste, ami présent…</small><span class="go">Choisir</span></button>`;$("idGo").onclick=idPick;return}
  box.innerHTML=`<div class="idhead"><b>Ce que tu deviens</b><button type="button" class="lnk" id="idChg">Changer</button></div>`+T.ch.map(id=>{const I=idOf(id);if(!I)return"";const k=idStage(I),nx=idNext(I),last=T.log.filter(l=>l.id===id).slice(-1)[0];
    return`<div class="idcard" style="--ic:${I.c}"><span class="idi">${pxImg(I.ic,4)}</span><div class="idt">${k&&String(I.st[k-1][0]).toLowerCase()===String(I.n).toLowerCase()?"":`<small>${esc(I.n)}</small>`}<b>${k?esc(I.st[k-1][0]):"Le chemin commence"}</b>${nx?`<span class="idbar"><i style="width:${nx.pct}%"></i></span><em>Encore ${nx.left} ${IDU[nx.s[1]]} pour « ${esc(nx.s[0])} »</em>`:`<em>Chemin accompli</em>`}</div><div class="idsteps">${I.st.map((x,j)=>`<i class="${j<k?"on":""}" title="${esc(x[0])}"></i>`).join("")}</div></div>`}).join("");
  $("idChg").onclick=idPick}
function renderPath(){const box=$("pathBox");if(!box||!S.g)return;const T=idState(),B=badgeDefs().filter(b=>!b.sec||S.badges[b.id]),bd={};B.forEach(b=>bd[b.id]=b);
  const ev=[];T.log.forEach(l=>{const I=idOf(l.id);if(I)ev.push({t:l.t,c:I.c,ic:I.ic,ti:I.st[l.s][0],tx:I.st[l.s][3]})});
  Object.entries(S.badges||{}).forEach(([id,t])=>{const b=bd[id];if(b&&typeof t==="number"&&b.t>=2)ev.push({t,c:TIERC[b.t],ic:"star",ti:b.name,tx:b.desc})});
  (S.g.books||[]).forEach(b=>ev.push({t:b.d,c:"#b5512e",ic:"book",ti:"Livre fini",tx:b.t}));(S.g.ancL||[]).forEach(a=>ev.push({t:a.t,c:"#e0a020",ic:"star",ti:"Rituel ancré",tx:a.n}));(S.g.xmh||[]).forEach(a=>ev.push({t:a.t,c:"#c0283a",ic:a.ic||"gift",ti:a.ti,tx:a.tx}));
  Object.entries(S.g.rel||{}).forEach(([ym,r])=>{if(r&&r.t)ev.push({t:r.t,c:"#9b5de5",ic:"star",ti:"Son sorti",tx:r.n||"sans titre"})});
  ev.sort((a,b)=>b.t-a.t);const L=pathAll?ev:ev.slice(0,6),G0={};L.forEach((e,i)=>{const d=new Date(e.t),k=MOIS[d.getMonth()]+" "+d.getFullYear();(G0[k]=G0[k]||[]).push(i)});
  box.innerHTML=`<div class="gcard col1 pto"><div class="bh2"><h3>Mon chemin</h3><span class="hint">${ev.length} étape${ev.length>1?"s":""}</span></div>${L.length?Object.entries(G0).map(([m,ix])=>`<p class="rsh">${m.charAt(0).toUpperCase()+m.slice(1)}</p><ul class="pth2">${ix.map(i=>{const e=L[i];return`<li style="--pc:${e.c}"><button type="button" class="pti" data-i="${i}" aria-expanded="false"><span class="pdot">${pxImg(e.ic,2)}</span><b></b><time>${new Date(e.t).getDate()} ${MOIS[new Date(e.t).getMonth()].slice(0,3)}.</time></button><small hidden></small></li>`}).join("")}</ul>`).join("")+(ev.length>6?`<button type="button" class="lnk ptall">${pathAll?"Réduire":"Voir les "+ev.length+" étapes"}</button>`:""):`<p class="hint" style="margin:0">Ton chemin se dessinera au fil de tes progrès.</p>`}</div>`;
  box.querySelectorAll(".pti").forEach(b=>{const e=L[+b.dataset.i],sm=b.nextElementSibling;b.querySelector("b").textContent=e.ti;sm.textContent=e.tx;b.onclick=()=>{const o=sm.hidden;sm.hidden=!o;b.setAttribute("aria-expanded",o)}});
  {const a=box.querySelector(".ptall");if(a)a.onclick=()=>{pathAll=!pathAll;renderPath()}}}
let pathAll=false;
