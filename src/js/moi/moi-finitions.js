// Moi : finitions des blocs (Bilan, compétences, Ma fiche, Ce que tu deviens, Collection…). Ex-correctifs.js, à fondre dans les rendus d'origine lors de la refonte écran par écran.
// ===== Le Bilan raconte ta semaine
function weekStory(K){const set=new Set(K),L=(S.log||[]).filter(e=>set.has(dayKey(e.t))),out=[],g=S.g;
  const prevK=K.map(k=>{const d=new Date(k+"T12:00");d.setDate(d.getDate()-7);return dayKey(d)}),pset=new Set(prevK),PL=(S.log||[]).filter(e=>pset.has(dayKey(e.t)));
  // proches
  const pc={};L.forEach(e=>(e.withp||[]).forEach(p=>pc[p]=(pc[p]||0)+1));L.forEach(e=>{if(e.fr&&e.who)pc[e.who]=(pc[e.who]||0)+1});
  const top=Object.entries(pc).sort((a,b)=>b[1]-a[1]).slice(0,3);if(top.length)out.push("Tu as passé du temps avec "+top.map(([p,n])=>p+(n>1?" ("+n+" fois)":"")).join(", ")+".");
  // maison
  {const R=FAM.find(f=>f.id==="ranger");if(R){const opts=[...R.o,...((g.afCustom||{}).ranger||[])],done=opts.filter(o=>L.some(e=>e.af==="af:ranger:"+o));if(done.length){const left=opts.filter(o=>!done.includes(o)&&(g.afLast||{})["af:ranger:"+o]);out.push("Rangé : "+done.map(x=>x.toLowerCase()).join(", ")+(left.length&&left.length<=3?" — il reste "+left.map(x=>x.toLowerCase()).join(", ")+".":"."))}}}
  // sport
  {const n=L.filter(e=>e.cat==="sport"&&!e.bonus).length,p=PL.filter(e=>e.cat==="sport"&&!e.bonus).length;if(n||p)out.push(`${n} moment${n>1?"s":""} de sport`+(p?(n>p?`, ${n-p} de plus que la semaine d'avant.`:n<p?`, ${p-n} de moins que la semaine d'avant.`:", comme la semaine d'avant."):"."))}
  // cigarettes
  {const sum=A=>A.reduce((a,k)=>a+((g.cig||{})[k]||0),0),a=sum(K),b=sum(prevK),nd=K.filter(k=>k in(g.cig||{})).length;if(nd&&b){const pct=Math.round((a-b)/b*100);out.push(pct<0?`Tu as fumé ${-pct} % de moins que la semaine d'avant (${a} cigarettes).`:pct>0?`${a} cigarettes, ${pct} % de plus que la semaine d'avant.`:`${a} cigarettes, comme la semaine d'avant.`)}else if(nd)out.push(`${a} cigarette${a>1?"s":""} cette semaine.`)}
  // skills
  {const z={};L.forEach(e=>{if(e.lz&&e.lzx){const id=String(e.lz).split(":")[0];z[id]=(z[id]||0)+e.lzx}});const t=Object.entries(z).sort((a,b)=>b[1]-a[1])[0];if(t){const Z=lzOf(t[0]);if(Z)out.push(`Ta compétence qui a le plus avancé : ${Z.n} (+${t[1]} XP).`)}}
  // siestes, quêtes
  {const m=K.reduce((a,k)=>a+((g.nap||{})[k]||0),0);if(m)out.push(`${m>=60?Math.round(m/6)/10+" h":m+" min"} de sieste.`)}
  {const q=L.filter(e=>e.sp||e.autoq||e.eod).length;if(q)out.push(`${q} quête${q>1?"s":""} spéciale${q>1?"s":""} réussie${q>1?"s":""}.`)}
  return out}
window.__weekStory=weekStory;
// ---- les skills vivent dans les actions : niveau, en cours, objectif du mois
const SKB={lire:{z:"lect",g:["af:lire:Livre fini",1,"livre fini","lect:l"],c:{k:"book",lab:"Livre en cours",ph:"Titre du livre",u:"pages",inc:{"Livre":"q","BD ou manga":"q"},fin:"Livre fini"}},
  regarder:{z:"cine",g:["af:regarder:Film",4,"films","cine:f"],c:{k:"serie",lab:"Série en cours",ph:"Nom de la série",u:"épisodes",inc:{"Épisode":1},fin:"Série finie"}},
  jouer:{z:"jeu",g:["af:jouer:Jeu fini",1,"jeu fini","jeu:f"],c:{k:"game",lab:"Jeu en cours",ph:"Nom du jeu",u:"sessions",inc:{"Jeu vidéo":1},fin:"Jeu fini"}},
  cuisiner:{z:"cuis",g:["af:cuisiner:Nouveau plat",4,"nouveaux plats","cuis:n"]},planif:{z:"orga",g:["af:planif:Ma semaine",4,"semaines préparées","orga:s"]},
  langue:{z:"lang",g:["af:langue:Leçon",12,"leçons","lang:l"]},image:{z:"photo",g:["af:image:Montage",1,"montage fini","photo:m"]},
  dehors:{z:"explo",g:["af:dehors:Nouveau lieu",2,"nouveaux lieux","explo:l"]},musique:{son:1}};
const skMonth=g=>{const ym=ymOf(Date.now());return(S.log||[]).filter(e=>ymOf(e.t)===ym&&(e.a===g[0]||e.lz===g[3])).length};
function skTrack(it,qty){if(!it||it.k!=="fam")return"";const B=SKB[it.f.id];if(!B||!B.c)return"";const G=S.g;if(!G.cur||typeof G.cur!=="object")G.cur={};const C=B.c,cur=G.cur[C.k];
  if(it.opt===C.fin){if(!cur)return"";if(!G.fini||typeof G.fini!=="object")G.fini={};(G.fini[C.k]=G.fini[C.k]||[]).push({t:cur.t,n:cur.n,s:cur.s,e:Date.now()});if(C.k==="book"){if(!Array.isArray(G.books))G.books=[];G.books.push({t:cur.t,n:cur.n,s:cur.s,d:Date.now(),x:40,ss:1})}delete G.cur[C.k];return" : "+cur.t}
  const inc=C.inc[it.opt];if(inc&&cur){cur.n+=inc==="q"?(qty||0):inc;return" : "+cur.t}return""}
window.__afSkill=()=>afSkill();
function afSkill(){const box=document.getElementById("actFind");if(!box)return;const aff=box.querySelector(".aff");if(!aff||aff.querySelector(".afsk"))return;const fid=box.__fid,B=SKB[fid];if(!B)return;
  const G=S.g,ym=ymOf(Date.now()),el=document.createElement("div");el.className="afsk";let h="";
  if(B.son){const k=(S.skills||[]).find(x=>x.name==="Sons"),i=k?skInfo(k.xp):null,now=new Date(),mo=now.getMonth(),y=now.getFullYear(),dl=Math.ceil((new Date(y,mo+1,1)-now)/864e5),rel=(G.rel||{})[ym];
    if(i)h+=`<div class="sklv"><b>Musique</b><span>Nv ${i.l}</span><i><em style="width:${i.cur/i.need*100}%"></em></i></div>`;
    h+=`<div class="skrow"><small>Sortie ${/^[ao]/.test(MOIS1[mo+1])?"d'":"de "}${MOIS1[mo+1]}</small>${rel?`<b class="skok">${ICO("check",14)} Sorti : <span></span></b>`:`<b>J-${dl} pour sortir un son</b><span class="skin"><input maxlength="40" placeholder="Titre du son" aria-label="Titre du son"><button type="button" class="btn primary skrel">Il est sorti ! +150</button></span>`}
      <div class="skmo">${MOIS1.slice(1).map((m,j)=>{const kk=y+"-"+String(j+1).padStart(2,"0");return`<span class="${(G.rel||{})[kk]?"on":""}${j===mo?" cur":""}">${m[0].toUpperCase()}</span>`}).join("")}</div></div>`;
    el.innerHTML=h;aff.appendChild(el);if(rel)el.querySelector(".skok span").textContent=rel.n||"sans titre";
    const go=el.querySelector(".skrel");if(go)go.onclick=()=>{const n=el.querySelector("input").value.trim().slice(0,40),prev=levelInfo(S.xp).l,sg={visuel:4,prod:3,poly:1};if(!G.rel)G.rel={};Object.entries(sg).forEach(([kk,v])=>S.snd[kk]=(S.snd[kk]||0)+v);G.rel[ym]={n,t:Date.now()};
      S.xp+=150;S.log.push({a:"bonus",cat:null,name:"Son sorti"+(n?" : "+n:""),xp:150,t:Date.now(),bonus:1,out:ym,snd:sg});save();try{uniBurst(go,"creer")}catch(e){}render(prev);setTimeout(()=>toast(`Son sorti ! <span class="p">+150 XP</span>`),300);el.remove();afSkill()};return}
  const z=lzState(),L=lzOf(B.z),i=skInfo(z.xp[B.z]||0);
  h+=`<div class="sklv"><b>${esc(L?L.n:"")}</b><span>Nv ${i.l}</span><i><em style="width:${i.cur/i.need*100}%"></em></i></div>`;
  if(B.c){const cur=(G.cur||{})[B.c.k],nf=((G.fini||{})[B.c.k]||[]).length;
    h+=`<div class="skrow"><small>${B.c.lab}</small>${cur?`<b class="skcur"><span></span><em>${cur.n} ${B.c.u}</em></b><button type="button" class="skch">Changer</button>`:`<span class="skin"><input maxlength="40" placeholder="${B.c.ph}" aria-label="${B.c.ph}"><button type="button" class="btn primary skset">OK</button></span>`}${nf?`<small class="sknf">${nf} terminé${nf>1?"s":""} au total</small>`:""}</div>`}
  const g=B.g,d=skMonth(g),cl=(G.dm||{})[ym+B.z];
  h+=`<div class="skrow"><small>Ce mois-ci</small><b>${Math.min(d,g[1])} / ${g[1]} ${g[2]}</b><i class="skbar"><em style="width:${Math.min(100,d/g[1]*100)}%"></em></i>${cl?`<small class="skok">${ICO("check",13)} Objectif atteint</small>`:d>=g[1]?`<button type="button" class="btn primary skcl">Récupérer +100 XP</button>`:`<small>+100 XP à la clé</small>`}</div>`;
  el.innerHTML=h;aff.appendChild(el);
  if(B.c){const cur=(G.cur||{})[B.c.k];if(cur)el.querySelector(".skcur span").textContent=cur.t;
    const set=el.querySelector(".skset");if(set){const inp=el.querySelector("input");const ok=()=>{const t=inp.value.trim().slice(0,40);if(!t)return;if(!G.cur||typeof G.cur!=="object")G.cur={};G.cur[B.c.k]={t,n:0,s:Date.now()};save();el.remove();afSkill()};set.onclick=ok;inp.onkeydown=e=>{if(e.key==="Enter")ok()}}
    const ch=el.querySelector(".skch");if(ch)ch.onclick=()=>{delete G.cur[B.c.k];save();el.remove();afSkill()}}
  const c2=el.querySelector(".skcl");if(c2)c2.onclick=()=>{const prev=levelInfo(S.xp).l;if(!G.dm||typeof G.dm!=="object")G.dm={};G.dm[ym+B.z]=1;addBonus("Objectif du mois : "+(L?L.n:""),100);save();try{uniBurst(c2,"divert")}catch(e){}render(prev);toast(`Objectif atteint ! <span class="p">+100 XP</span>`);el.remove();afSkill()}}
// le bilan reprend la série et les coffres
function bilKpi(){const b=document.getElementById("chapBox");if(!b||!S||!S.g)return;let st=0;try{st=streak()}catch(e){}const o=S.g.opened||0,k=st+"|"+o;let r=b.querySelector(".bilkpi");if(r&&r.dataset.k===k&&r===b.firstElementChild)return;
  if(!r){r=document.createElement("div");r.className="bilkpi"}r.dataset.k=k;let fl="",ch="";try{fl=pxImg("flame",2,"ic");ch=pxImg("chest",2,"ic")}catch(e){}
  r.innerHTML=`<div><span>${fl}</span><b>${st}</b><small>jour${st>1?"s":""} de suite</small></div><div><span>${ch}</span><b>${o}</b><small>coffre${o>1?"s":""} ouvert${o>1?"s":""}</small></div>`;b.prepend(r)}
// Moi : plus de Domaines, « Ce que tu deviens » dans Ma vie
function moiTabs(){const id=document.getElementById("idBox");if(id&&id.dataset.sub!=="vie"){id.dataset.sub="vie";try{applySub()}catch(e){}}
  ["musBox","dzBox"].forEach(x=>{const e=document.getElementById(x);if(e&&e.dataset.sub!=="off")e.dataset.sub="off"});document.querySelectorAll(".wrap>section.lzs").forEach(e=>{if(e.dataset.sub!=="off")e.dataset.sub="off"});
  const sb=document.querySelector('.subtabs button[data-sub="sons"]');if(sb){const nv=sb.parentElement;sb.remove();nv.classList.remove("four");nv.classList.add("three");try{if(subs.c==="sons"){subs.c="vie";applySub()}placeInds()}catch(e){}}}
// ---- records perso
const QRX=/·\s*(\d+(?:[.,]\d+)?)\s*(rép\.|km|pages)/;
function recOf(key){let m=0,n=0;(S.log||[]).forEach(e=>{if(e.a!==key)return;const r=String(e.name||"").match(QRX);if(!r)return;n++;const v=parseFloat(r[1].replace(",","."));if(v>m)m=v});return{m,n}}
function recQuests(add){const seen=new Set();(S.log||[]).slice(-400).forEach(e=>{if(typeof e.a==="string"&&e.a.startsWith("af:")&&QRX.test(e.name||""))seen.add(e.a)});
  seen.forEach(key=>{const[,fid,opt]=key.split(":"),f=FAM.find(x=>x.id===fid);if(!f||!f.q||!f.q[opt])return;const r=recOf(key);if(r.n<2||!r.m)return;const u=f.q[opt],st=u==="km"?(r.m<5?1:2):u==="pages"?10:Math.max(2,Math.round(r.m*.1));const goal=Math.round((r.m+st)*10)/10,un=({reps:"",km:" km",pages:" pages"})[u];
    add({name:`${opt} : ${goal}${un}${u==="reps"?" d'affilée":" d'un coup"}`,cat:f.cat,xp:30,why:"Record : "+r.m+un,sc:4.7,rec:key,recv:r.m,afk:key})})}
function recCheck(it,qty){if(!it||it.k!=="fam"||!qty)return;const key="af:"+it.f.id+":"+it.opt;if(!it.f.q||!it.f.q[it.opt])return;const r=recOf(key);if(r.n>=1&&qty>r.m){setTimeout(()=>{try{toast(`Nouveau record : <span class="p">${qty}</span>`)}catch(e){}},900);
    const q=(S.specials||[]).find(x=>x.rec===key);if(q){S.specials=S.specials.filter(x=>x!==q);try{addBonus("Record battu : "+q.name,q.xp,0,"rec")}catch(e){}}}}
// 6. Skills : un interrupteur par skill

// Ma fiche : modifiable directement
let fEdit=false;
// ---- Ma fiche, version visuelle
try{void 0;}catch(e){}
const JOBI={etud:"lire",poste:"chantier",cherche:"loupe",indep:"laptop",pause:"pause",autre:"autre"};
const HOMEI={seul:["maisonp","Seul·e"],coloc:["canape","En coloc"],couple:["coeur","En couple"],parents:["famille","En famille"]};
const PRII={sport:"halteres",perso:"micro",social:"bulle",famille:"famille",maison:"canape",soi:"medit",travail:"dossier"};
const PARENT=/^(papa|maman|p[èe]re|m[èe]re|daron|daronne|mom|dad|parents?)$/i;
const tkF=()=>dayKey(Date.now());
function homeOf(s){try{(S.family||[]).forEach(n=>{if(S.profiles[n]&&S.profiles[n].love)delete S.profiles[n].love})}catch(e){}const W=Array.isArray(s.with)?s.with:[];if(!W.length)return"seul";const P=S.profiles||{};if(W.some(n=>P[n]&&P[n].love))return"couple";if(W.some(n=>PARENT.test(n)||isFam(n)))return"parents";return"coloc"}
window.homeOf=homeOf;
function perNow(){const tk=tkF(),L=(S.g.per||[]);return L.find(p=>p.s<=tk&&p.e>=tk)||null}
function perEnded(){const tk=tkF(),A=S.g.perAsk||{};return(S.g.per||[]).filter(p=>p.e<tk&&!A[p.id]&&(Date.parse(tk)-Date.parse(p.e))/864e5<=21).sort((a,b)=>b.e.localeCompare(a.e))[0]||null}
const tileI=k=>{try{return rkSvg(k)}catch(e){return""}};
function fPick(s,commit){if(document.querySelector(".fpick"))return;const p=document.createElement("div");p.className="bpop rapop fpick";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Qui vit avec toi ?");document.body.appendChild(p);
  const draw=()=>{const W=s.with||[];p.innerHTML=`<div class="bpc rap"><div class="raph"><h3>Qui vit avec toi ?</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div><div class="fpg">${relNames().map(n=>`<button type="button" class="fpp" data-n="${esc(n)}" aria-pressed="${W.includes(n)}">${pAv(n,"fpav")}<span class="fpn"></span></button>`).join("")}</div><button type="button" class="btn primary fpok">Terminé</button></div>`;
    p.querySelectorAll(".fpp").forEach((b,i)=>{b.querySelector(".fpn").textContent=b.dataset.n;b.onclick=()=>{const n=b.dataset.n,a=(s.with||[]).slice(),j=a.indexOf(n);if(j>=0)a.splice(j,1);else a.push(n);s.with=a;s.home=homeOf(s);commit();draw()}});
    const cl=()=>{p.remove();renderFiche()};p.querySelector(".raclose").onclick=cl;p.querySelector(".fpok").onclick=cl;p.onclick=e=>{if(e.target===p)cl()}};draw()}
function ficheMove(){const slot=document.querySelector("#ficheBox .fposte");const vb=document.getElementById("vieBox");if(!vb)return;
  ["vie-per","vie-rythme"].forEach(id=>{const inV=vb.querySelector("#"+id);if(!slot){if(inV)inV.hidden=true;return}
    const old=slot.querySelector("#"+id);if(inV){if(old&&old.contains(document.activeElement)){inV.remove();return}if(old)old.remove();inV.hidden=false;slot.appendChild(inV)}})}
function autoTime(){const s=sitOf();if(!s)return;let wd=false;try{wd=vieCap()<3}catch(e){}const t=["poste","etud","indep"].includes(s.job)&&wd?"30":"plus";if(s.time!==t){s.time=t;save()}}
function perAskCard(){const P=perEnded();const s=sitOf();if(!P||!s||s.job!=="poste")return"";return`<div class="fask" data-pid="${P.id}"><b>« ${esc(P.name||"Ta période")} » est terminé</b><small>Ta situation a changé ?</small><div class="fjobs mini">${[["poste","Toujours en poste"],["cherche","En recherche"],["pause","En pause"],["etud","Étudiant·e"]].map(([v,l])=>`<button type="button" data-ask="${v}"><span class="fti">${tileI(JOBI[v])}</span><span>${l}</span></button>`).join("")}</div></div>`}
function bindAsk(root){root.querySelectorAll(".fask [data-ask]").forEach(b=>b.onclick=()=>{const c=b.closest(".fask"),G=S.g;if(!G.perAsk||typeof G.perAsk!=="object")G.perAsk={};G.perAsk[c.dataset.pid]=1;const cur=sitOf()||{};G.sit={...cur,job:b.dataset.ask,t:Date.now()};if(G.fq)G.fq.d="";save();
    if(b.dataset.ask==="poste"){fEdit=true;try{showView("c");cGoSub("c","vie")}catch(e){}setTimeout(()=>{const x=document.getElementById("ficheBox");if(x)x.scrollIntoView({behavior:"smooth"})},200);try{toast("Ajoute ta nouvelle période")}catch(e){}}else{try{toast("Situation mise à jour")}catch(e){}}
    try{render()}catch(e){}renderFiche();const t=document.getElementById("evToday");if(t)t.querySelectorAll(".fask").forEach(x=>x.remove())})}
function askToday(){const b=document.getElementById("evToday");if(!b)return;const h=perAskCard();let c=b.querySelector(".fask");if(!h){if(c)c.remove();return}if(c)return;b.insertAdjacentHTML("afterbegin",h);bindAsk(b)}
// renderFiche : finitions autour de renderFicheBase (le cœur), ex-retouche de correctifs.js
function renderFiche(){try{homeFix()}catch(e){console.warn("renderFiche",e)}const r=renderFicheBase.apply(this,arguments);try{autoTime();ficheMove()}catch(e){console.warn("renderFiche",e)}return r}
function renderFicheBase(){const box=document.getElementById("ficheBox");if(!box||!S||!S.g)return;const G=S.g;let s0=null;try{s0=sitOf()}catch(e){}
  const s=s0?{...s0}:{goals:[],pass:[]};if(!Array.isArray(s.with))s.with=[];s.home=homeOf(s);const lab=(k,v)=>((SIT_Q[k].find(x=>x[0]===v)||[])[1])||"";const pri=(G.vie&&G.vie.pri)||[];
  const commit=()=>{const cur=sitOf()||{};G.sit={...cur,...s,t:Date.now()};if(G.fq)G.fq.d="";save()};
  const H=HOMEI[s.home]||HOMEI.seul,av=s.with.slice(0,4).map(n=>pAv(n,"fmini")).join("");
  const P=perNow();let perH="";if(s.job==="poste"&&P){const a=Date.parse(P.s),e=Date.parse(P.e),t=Date.parse(tkF()),tot=Math.round((e-a)/864e5)+1,dn=Math.round((t-a)/864e5)+1;perH=`<div class="fper"><b></b><small>Jour ${dn} sur ${tot} · plus que ${tot-dn} j</small><i><em style="width:${Math.min(100,dn/tot*100)}%"></em></i></div>`}
  if(!fEdit){const gl=(s.goals||[]).map(v=>lab("goals",v)).filter(Boolean);
    box.innerHTML=`<div class="fcard fviz"><div class="fch"><b>Ma fiche</b><button type="button" class="btn fced edbtn" aria-label="Modifier ma fiche">${ICO("edit",24)}</button></div>
      ${perAskCard()}
      <div class="fsum"><div class="fsq"><span class="fti">${tileI(JOBI[s.job]||"autre")}</span><small>${esc(lab("job",s.job)||"Situation ?")}</small></div>
      <div class="fsq"><span class="fti">${tileI(H[0])}</span><small>${H[1]}</small>${av?`<span class="fav">${av}</span>`:""}</div>
      <div class="fsq fpr">${pri.length?`<span class="fpri3">${pri.map(k=>`<span class="fti sm" title="${esc(CATS[k]?CATS[k].label:"")}">${tileI(PRII[k]||"etoile")}</span>`).join("")}</span>`:`<span class="fti">${tileI("etoile")}</span>`}<small>${pri.length?"Priorités":"Pas de priorité"}</small></div></div>
      ${perH}${gl.length?`<div class="fcs">${gl.map(g=>`<span class="fchip">${esc(g)}</span>`).join("")}</div>`:""}${!s0?`<span class="fnone">Touche Modifier pour la remplir</span>`:""}</div>`;
    if(P&&box.querySelector(".fper b"))box.querySelector(".fper b").textContent=P.name||"Ma période";
    box.querySelector(".fced").onclick=()=>{fEdit=true;renderFiche()};bindAsk(box);ficheMove();return}
  const row=(k,title,multi,max)=>`<div class="fr2"><small>${title}${max?` · ${max} max`:""}</small><div class="fopts">${SIT_Q[k].map(([v,l])=>{const on=multi?(s[k]||[]).includes(v):s[k]===v;return`<button type="button" data-fk="${k}" data-fv="${v}" aria-pressed="${on}">${esc(l)}</button>`}).join("")}</div></div>`;
  box.innerHTML=`<div class="fcard fedit fviz"><div class="fch"><b>Ma fiche</b><button type="button" class="btn primary fcok">Terminé</button></div>
    <div class="fr2"><small>Ma situation</small><div class="fjobs">${SIT_Q.job.map(([v,l])=>`<button type="button" data-job="${v}" aria-pressed="${s.job===v}"><span class="fti">${tileI(JOBI[v])}</span><span>${esc(l.replace("En recherche d'emploi","En recherche"))}</span></button>`).join("")}</div>
      ${s.job==="poste"?`<div class="fposte"></div>`:""}</div>
    <div class="fr2"><small>Chez moi</small><div class="fhome"><div class="fsq"><span class="fti">${tileI(H[0])}</span><small>${H[1]}</small></div><div class="fwho">${s.with.map(n=>`<span class="fwp" data-n="${esc(n)}">${pAv(n,"fmini")}<b></b>${isFam(n)?"":`<button type="button" class="flove" aria-pressed="${!!((S.profiles||{})[n]||{}).love}" aria-label="En couple avec ${esc(n)}">${tileI("coeur")}</button>`}<button type="button" class="fwx2" aria-label="Retirer">${ICO("close",12)}</button></span>`).join("")}<button type="button" class="fadd">+ Ajouter quelqu'un</button></div></div><small class="fhint">Seul·e par défaut. Papa ou maman : en famille · des amis : en coloc · le cœur : en couple.</small></div>
    <div class="fr2"><small>Mes priorités · 3 max · ces quêtes passent en premier</small><div class="fjobs fpris">${Object.keys(PRII).filter(k=>CATS[k]).map(k=>`<button type="button" data-fp="${k}" aria-pressed="${pri.includes(k)}"><span class="fti">${tileI(PRII[k])}</span><span>${esc(CATS[k].label)}</span></button>`).join("")}</div></div>
    ${row("goals","Ce que je veux améliorer",1,3)}${row("pass","Ce que j'aime",1)}
    <div class="fr2"><small>Ce qui compte en ce moment</small><input class="fnote" maxlength="80" placeholder="Ex. trouver un appart à Montpellier"></div>
    <div class="fr2 frow2"><button type="button" class="btn fart">${ICO("edit",14)}<span>Mes artistes</span></button></div></div>`;
  box.querySelectorAll(".fwp").forEach(x=>x.querySelector("b").textContent=x.dataset.n);
  box.querySelectorAll("[data-job]").forEach(b=>b.onclick=()=>{s.job=b.dataset.job;commit();renderFiche()});
  box.querySelectorAll("[data-fk]").forEach(b=>b.onclick=()=>{const k=b.dataset.fk,v=b.dataset.fv;const a=(s[k]||[]).slice(),i=a.indexOf(v);if(i>=0)a.splice(i,1);else{if(k==="goals"&&a.length>=3){try{toast("3 maximum")}catch(e){}return}a.push(v)}s[k]=a;commit();renderFiche()});
  box.querySelectorAll("[data-fp]").forEach(b=>b.onclick=()=>{if(!G.vie||typeof G.vie!=="object")G.vie={};const Q=Array.isArray(G.vie.pri)?G.vie.pri.slice():[],k=b.dataset.fp,i=Q.indexOf(k);if(i>=0)Q.splice(i,1);else{if(Q.length>=3){try{toast("3 priorités maximum")}catch(e){}return}Q.push(k)}G.vie.pri=Q;save();renderFiche()});
  box.querySelector(".fadd").onclick=()=>fPick(s,commit);
  box.querySelectorAll(".fwp .fwx2").forEach(b=>b.onclick=()=>{const n=b.closest(".fwp").dataset.n;s.with=s.with.filter(x=>x!==n);s.home=homeOf(s);commit();renderFiche()});
  box.querySelectorAll(".fwp .flove").forEach(b=>b.onclick=()=>{const n=b.closest(".fwp").dataset.n;setRel(n,relOf(n)==="couple"?null:"couple");s.home=homeOf(s);commit();renderFiche()});
  const n=box.querySelector(".fnote");n.value=s.note||"";n.onchange=()=>{s.note=n.value.trim().slice(0,80);commit()};
  box.querySelector(".fart").onclick=()=>{try{sitSheet()}catch(e){}};
  box.querySelector(".fcok").onclick=()=>{if(n.value.trim()!==(s.note||"")){s.note=n.value.trim().slice(0,80);commit()}fEdit=false;renderFiche();try{render()}catch(e){}};
  ficheMove()}
// ---- capacité déduite + suivi en cartes
try{void 0;}catch(e){}

function vieViz(){const vb=document.getElementById("vieBox");if(!vb||!S||!S.g)return;
  {let c=3;try{c=vieCap()}catch(e){}const e=enOf(),tk=dayKey(Date.now());let wd=false;try{wd=(S.g.vie.wd||[]).includes(new Date().getDay())&&c<=3}catch(_){}
    const why=[];try{const s=sitOf();if(s&&["poste","etud","indep"].includes(s.job)&&wd)why.push("jour de travail")}catch(_){}if(e===1)why.push("batterie basse");if(e===3)why.push("en forme");const sl=((S.g.sleep||{})[tk]||{}).h;if(sl&&sl<6)why.push("nuit courte");
    const k=c+"|"+why.join(",");let cv=vb.querySelector(".capviz");if(!cv||cv.dataset.k!==k||cv!==vb.firstElementChild){if(!cv){cv=document.createElement("div");cv.className="capviz"}cv.dataset.k=k;
      cv.innerHTML=`<span class="cvi">${rkSvg("batterie")}</span><div><b>${c} quête${c>1?"s":""} aujourd'hui</b><span class="cvp">${Array.from({length:6},(_,i)=>`<i class="${i<c?"on":""}"></i>`).join("")}</span>${why.length?`<small>${why.join(" · ")}</small>`:""}</div>`;vb.prepend(cv)}}
  const su=vb.querySelector("#vie-suivi");if(su&&!su.querySelector(".svx")){const T=[["cig","cigarette","Cigarettes"],["per","calendrier","Mes périodes"]];const g=document.createElement("div");g.className="svx";
    g.innerHTML=T.map(([k,ic,l])=>{const cb=su.querySelector(`[data-trk="${k}"]`);return`<button type="button" class="svt" data-t="${k}" aria-pressed="${cb&&cb.checked?"true":"false"}"><span class="fti">${rkSvg(ic)}</span><span>${l}</span><em>${cb&&cb.checked?"Suivi":"Off"}</em></button>`}).join("");
    const h3=su.querySelector("h3");(h3||su.firstChild).after(g);g.querySelectorAll(".svt").forEach(b=>b.onclick=()=>{const cb=su.querySelector(`[data-trk="${b.dataset.t}"]`);if(!cb)return;cb.checked=!cb.checked;cb.dispatchEvent(new Event("change"))})}}
// ---- Équilibre en carrés, réglages d'un proche en carrés, situation recalculée
function balViz(){const bc=document.getElementById("balCard");if(!bc)return;bc.classList.remove("closed");try{if(S.g.da!=="sky"&&document.getElementById("daSel")){const d=document.getElementById("daSel");if(d.value!=="sky"){d.value="sky";d.dispatchEvent(new Event("change"))}}}catch(e){}
  const og=document.getElementById("offGo"),pz=document.getElementById("pzGo"),so=document.getElementById("softTg"),cf=document.getElementById("cfTg");
  const pzs=(bc.querySelector("#pzGo")||{}).closest?bc.querySelector("#pzGo").closest(".balr").querySelector("small").textContent:"";const left=(pzs.match(/(\d+)\s*jours? restants?/)||[])[1];
  const T=[["off","sieste","Jour off",og?(og.disabled?"Déjà pris":"1 par semaine"):"",og&&og.disabled],["pz","sante","Pause",left?left+" j restants":"",false],["soft","plante","Mode doux",so&&so.checked?"Actif":"Off",so&&so.checked],["cf","lune","Couvre-feu",cf&&cf.checked?"23 h 30":"Off",cf&&cf.checked]];
  const k=T.map(t=>t[3]+t[4]).join("|");let g=bc.querySelector(".balviz");if(g&&g.dataset.k===k)return;if(!g){g=document.createElement("div");g.className="balviz";bc.querySelector("h3").after(g)}g.dataset.k=k;
  g.innerHTML=T.map(([id,ic,l,sub,on])=>`<button type="button" class="svt" data-b="${id}" aria-pressed="${on?"true":"false"}"><span class="fti">${vI(ic)}</span><span>${l}</span><em>${esc(sub)}</em></button>`).join("");
  g.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{const id=b.dataset.b;if(id==="off"&&og)og.click();if(id==="pz"&&pz)pz.click();if(id==="soft"&&so){so.checked=!so.checked;so.dispatchEvent(new Event("change"))}if(id==="cf"&&cf){cf.checked=!cf.checked;cf.dispatchEvent(new Event("change"))}g.dataset.k="";setTimeout(balViz,50)})}
function homeFix(){const s=sitOf();if(!s)return;if(!Array.isArray(s.with))s.with=[];const h=homeOf(s);if(s.home!==h){s.home=h;save();try{if(!fEdit)renderFiche()}catch(e){}}}
// ---- Ce que tu deviens : titre + barre + icône du prochain palier
function idViz(){document.querySelectorAll("#idBox .idcard").forEach(c=>{const bar=c.querySelector(".idbar");if(!bar)return;const st=[...c.querySelectorAll(".idsteps i")],nx=st.find(i=>!i.classList.contains("on")),img=c.querySelector(".idi img");
    const k=(nx?nx.title:"max")+"|"+(bar.querySelector("i")||{}).style?.width;if(c.dataset.vz===k)return;c.dataset.vz=k;let w=c.querySelector(".idrow");if(!w){w=document.createElement("span");w.className="idrow";bar.before(w);w.appendChild(bar)}
    let n=w.querySelector(".idnx");if(!n){n=document.createElement("span");n.className="idnx";w.appendChild(n)}n.title=nx?"Prochain : "+nx.title:"Palier max";n.classList.toggle("max",!nx);n.innerHTML=img?`<img src="${img.src}" alt="">`:"";})}
// ---- ce mois-ci, en vrai
function realRecap(){const b=document.getElementById("chapBox");if(!b||!S||!S.g)return;const ym=ymOf(Date.now()),L=(S.log||[]).filter(e=>ymOf(e.t)===ym&&e.xp>=0),T=[];
  const ppl={};L.forEach(e=>{const W=new Set(e.withp||[]);(S.friends||[]).concat(S.family||[]).forEach(n=>{if(new RegExp("\\b"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(e.name||""))W.add(n)});W.forEach(n=>ppl[n]=(ppl[n]||0)+1)});
  Object.entries(ppl).sort((a,b)=>b[1]-a[1]).slice(0,2).forEach(([n,c])=>T.push([pAv(n,"fmini rrav"),n,c>1?"×"+c:"1 fois"]));
  const fin=((S.g.fini||{}).book||[]).filter(x=>ymOf(x.e)===ym);if(fin.length)T.push([vI("lire"),fin.length>1?fin.length+" livres":fin[0].t,"terminé"]);
  const cnt=re=>L.filter(e=>re.test(e.a||"")).length,film=cnt(/^af:regarder:Film/);if(film)T.push([vI("clap"),film+" film"+(film>1?"s":""),"vus"]);
  const sums={};L.forEach(e=>{const r=String(e.name||"").match(QRX);if(!r)return;const u=r[2];sums[u]=(sums[u]||0)+parseFloat(r[1].replace(",","."))});
  if(sums["rép."])T.push([vI("halteres"),Math.round(sums["rép."])+" rép.","de renfo"]);if(sums.km)T.push([vI("pas"),Math.round(sums.km*10)/10+" km","parcourus"]);if(sums.pages)T.push([vI("lire"),Math.round(sums.pages)+" pages","lues"]);
  const so=L.filter(e=>e.idq).length;if(so)T.push([vI("ticket"),so+" sortie"+(so>1?"s":""),"découvertes"]);const rm=new Set(L.filter(e=>/^af:ranger:/.test(e.a||"")).map(e=>e.a)).size;if(rm)T.push([vI("balai"),rm+" pièce"+(rm>1?"s":""),"rangées"]);
  const k=T.map(t=>t[1]+t[2]).join("|");let c=b.querySelector(".realrc");if(c&&c.dataset.k===k)return;if(!T.length){if(c)c.remove();return}if(!c){c=document.createElement("div");c.className="realrc";const anc=b.querySelector(".bchap");(anc||b.firstElementChild).after(c)}c.dataset.k=k;
  c.innerHTML=`<h3 class="bh3">Ce mois-ci, en vrai</h3><div class="rrg">${T.slice(0,6).map(([ic,a,s2])=>`<div class="rrt"><span class="rri">${ic}</span><b>${esc(a)}</b><small>${esc(s2)}</small></div>`).join("")}</div>`}

// ---- une seule porte par fonction : la carte perso renvoie vers Collection au lieu d'ouvrir ses propres sélecteurs
function charLinks(){const c=document.querySelector('section.char');if(!c||c.dataset.lk)return;c.dataset.lk=1;
  c.addEventListener('click',e=>{const t=e.target.closest('#charTitle');if(!t)return;e.stopPropagation();e.preventDefault();cGoSub('c','wr');
    setTimeout(()=>{if(t.id==='charTitle'){const b=document.querySelector('#wrCats [data-c="titre"]');if(b)b.click();const w=document.querySelector('.wardrobe');if(w)w.scrollIntoView({behavior:'smooth',block:'start'})}else{const g=[...document.querySelectorAll('.colh h3,.col h3')].find(x=>/^\s*badges/i.test(x.textContent||''));if(g)(g.closest('.colh')||g).scrollIntoView({behavior:'smooth',block:'start'})}},420)},true)}
// ---- Collection : « Badges » est une catégorie comme les autres
function wrBadges(){const on=typeof wrCat!=="undefined"&&wrCat==="badges";document.documentElement.dataset.wrc=on?"badges":"wr"}
window.wrBadges=wrBadges;

// ---- Bilan du mois : toucher un jour pour noter (ou corriger) son humeur
document.addEventListener("click",e=>{const c=e.target.closest(".bcd.mpk[data-k]");if(!c)return;try{moodPick(c.dataset.k)}catch(err){}});
document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const c=e.target.closest&&e.target.closest(".bcd.mpk[data-k]");if(!c)return;e.preventDefault();try{moodPick(c.dataset.k)}catch(err){}});

// ---- Moi : chaque bloc finit son propre rendu (plus de retouche globale après coup)
try{charLinks();moiTabs()}catch(e){}
