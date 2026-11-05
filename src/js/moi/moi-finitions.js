// Moi : finitions des blocs (Bilan, compétences, Ma fiche, Collection…). Ex-correctifs.js, à fondre dans les rendus d'origine lors de la refonte écran par écran.
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
      S.xp+=50;S.log.push({a:"bonus",cat:null,name:"Son sorti"+(n?" : "+n:""),xp:50,t:Date.now(),bonus:1,out:ym,snd:sg});save();try{uniBurst(go,"creer")}catch(e){}render(prev);setTimeout(()=>toast(`Son sorti ! <span class="p">+50 XP</span>`),300);el.remove();afSkill()};return}
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
  const c2=el.querySelector(".skcl");if(c2)c2.onclick=()=>{const prev=levelInfo(S.xp).l;if(!G.dm||typeof G.dm!=="object")G.dm={};G.dm[ym+B.z]=1;addBonus("Objectif du mois : "+(L?L.n:""),50);save();try{uniBurst(c2,"divert")}catch(e){}render(prev);toast(`Objectif atteint ! <span class="p">+50 XP</span>`);el.remove();afSkill()}}
// Moi : plus de Domaines
function moiTabs(){
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
// ---- Ma fiche, version visuelle
try{void 0;}catch(e){}
const JOBI={etud:"lire",poste:"chantier",cherche:"loupe",indep:"laptop",pause:"pause",autre:"autre"};
const HOMEI={seul:["maisonp","Seul·e"],coloc:["canape","En coloc"],couple:["coeur","En couple"],parents:["famille","En famille"]};
const PRII={sport:"halteres",perso:"micro",social:"bulle",famille:"famille",maison:"canape",soi:"medit",travail:"dossier"};
const PARENT=/^(papa|maman|p[èe]re|m[èe]re|daron|daronne|mom|dad|parents?)$/i;
const tkF=()=>dayKey(Date.now());
function homeOf(s){try{(S.family||[]).forEach(n=>{if(S.profiles[n]&&S.profiles[n].love)delete S.profiles[n].love})}catch(e){}const W=Array.isArray(s.with)?s.with:[];if(!W.length)return"seul";const P=S.profiles||{};if(W.some(n=>P[n]&&P[n].love))return"couple";if(W.some(n=>PARENT.test(n)||isFam(n)))return"parents";return"coloc"}
window.homeOf=homeOf;
function perEnded(){const tk=tkF(),A=S.g.perAsk||{};return(S.g.per||[]).filter(p=>p.e<tk&&!A[p.id]&&(Date.parse(tk)-Date.parse(p.e))/864e5<=21).sort((a,b)=>b.e.localeCompare(a.e))[0]||null}
const tileI=k=>{try{return rkSvg(k)}catch(e){return""}};
function fPick(s,commit){if(document.querySelector(".fpick"))return;const p=document.createElement("div");p.className="bpop rapop fpick";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Qui vit avec toi ?");document.body.appendChild(p);
  const draw=()=>{const W=s.with||[];p.innerHTML=`<div class="bpc rap"><div class="raph"><h3>Qui vit avec toi ?</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div><div class="fpg">${relNames().map(n=>`<button type="button" class="fpp" data-n="${esc(n)}" aria-pressed="${W.includes(n)}">${pAv(n,"fpav")}<span class="fpn"></span></button>`).join("")}</div><button type="button" class="btn primary fpok">Terminé</button></div>`;
    p.querySelectorAll(".fpp").forEach((b,i)=>{b.querySelector(".fpn").textContent=b.dataset.n;b.onclick=()=>{const n=b.dataset.n,a=(s.with||[]).slice(),j=a.indexOf(n);if(j>=0)a.splice(j,1);else a.push(n);s.with=a;s.home=homeOf(s);commit();draw()}});
    const cl=()=>{p.remove();renderFiche()};p.querySelector(".raclose").onclick=cl;p.querySelector(".fpok").onclick=cl;p.onclick=e=>{if(e.target===p)cl()}};draw()}
function autoTime(){const s=sitOf();if(!s)return;let wd=false;try{wd=vieCap()<3}catch(e){}const t=["poste","etud","indep"].includes(s.job)&&wd?"30":"plus";if(s.time!==t){s.time=t;save()}}
function perAskCard(){const P=perEnded();const s=sitOf();if(!P||!s||s.job!=="poste")return"";const xp=P.t==="contrat"&&typeof contratClosed==="function"&&!contratClosed(P);return`<div class="fask" data-pid="${P.id}"><b>« ${esc(P.name||"Ta période")} » est terminé</b><small>${xp?"Bravo, +50 XP Travail. ":""}Ta situation a changé ?</small><div class="fjobs mini">${[["poste","Toujours en poste"],["cherche","En recherche"],["pause","En pause"],["etud","Étudiant·e"]].map(([v,l])=>`<button type="button" data-ask="${v}"><span class="fti">${tileI(JOBI[v])}</span><span>${l}</span></button>`).join("")}</div></div>`}
function bindAsk(root){root.querySelectorAll(".fask [data-ask]").forEach(b=>b.onclick=ev=>{const c=b.closest(".fask"),G=S.g;try{const P=(G.per||[]).find(x=>x.id===c.dataset.pid);if(P&&typeof contratClose==="function")contratClose(P,b,ev)}catch(e){}if(!G.perAsk||typeof G.perAsk!=="object")G.perAsk={};G.perAsk[c.dataset.pid]=1;const cur=sitOf()||{};G.sit={...cur,job:b.dataset.ask,t:Date.now()};if(G.fq)G.fq.d="";save();
    if(b.dataset.ask==="poste"){try{calOpen()}catch(e){}try{toast("Ajoute ta nouvelle période")}catch(e){}}else{try{toast("Situation mise à jour")}catch(e){}}
    try{render()}catch(e){}renderFiche();const t=document.getElementById("evToday");if(t)t.querySelectorAll(".fask").forEach(x=>x.remove())})}
function askToday(){const b=document.getElementById("evToday");if(!b)return;const h=perAskCard();let c=b.querySelector(".fask");if(!h){if(c)c.remove();return}if(c)return;b.insertAdjacentHTML("afterbegin",h);bindAsk(b)}
// renderFiche : finitions autour de renderFicheBase (le cœur), ex-retouche de correctifs.js
// Mes dates (2.7, 02/11) : mon anniversaire (sit.bd), mon cœur (sit.cpl), notre anniversaire (sit.cpld) ; le ou la partenaire = le proche marqué « couple »
const CPL_Q=[["celib","Célibataire"],["couple","En couple"],["fiance","Fiancé·e"],["pacse","Pacsé·e"],["marie","Marié·e"]];
const MO_C=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
function cplWho(){const P=S.profiles||{};return Object.keys(P).find(n=>P[n]&&P[n].love&&!isFam(n))||""}
function dateTxt(o){return o&&o.d&&o.m?o.d+" "+MO_C[o.m-1]+(o.y?" "+o.y:""):""}
function dateFields(k,o){o=o||{};return`<div class="fdate" data-dk="${k}"><label>Jour<input type="text" maxlength="2" inputmode="numeric" autocomplete="off" placeholder="12" data-dp="d" value="${o.d||""}"></label><label>Mois<select data-dp="m"><option value="">—</option>${MO_C.map((m,i)=>`<option value="${i+1}"${o.m===i+1?" selected":""}>${m}</option>`).join("")}</select></label><label>Année<input type="text" maxlength="4" inputmode="numeric" autocomplete="off" placeholder="1996" data-dp="y" value="${o.y||""}"></label></div>`}
// Ma fiche (refonte du 03/11) : des tuiles, sans long formulaire. Chaque tuile se touche pour changer ce qu'elle dit ;
// « + » ajoute dans son groupe. Choix rapides = petite fenêtre ; dates, textes et horaires = plein écran.
const GOALI={job:["loupe","Travail"],forme:["halteres","Forme"],sommeil:["lit","Sommeil"],ecrans:["tel","Écrans"],potes:["duo","Potes"],famille:["famille","Famille"],son:["micro","Musique"],argent:["piece","Finances"],apprendre:["lire","Apprendre"],chez:["maisonp","Chez moi"],moral:["soleil","Moral"],manger:["salade","Manger"]};
const PASSI={rap:"micro",creer:"casque",cine:"clap",lecture:"lire",jeux:"manette",cuisine:"poele",sport:"ballon",dessin:"pinceau",mode:"tshirt",nature:"plante",photo:"photo",voyage:"valise"};
const NORMI={minuit:["lune","Minuit"],soda:["soda","Soda"],vege:["legume","Végé"],ecran:["ecran","Écran au lit"],sport:["halteres","Sport"]};
const JOBL={etud:"Étudiant·e",poste:"En poste",cherche:"En recherche",indep:"Indépendant·e",pause:"En pause",autre:"Autre"};
const CPLI={celib:"Célibataire",couple:"En couple",fiance:"Fiancé·e",pacse:"Pacsé·e",marie:"Marié·e"};
const MV_WDL=["D","L","M","M","J","V","S"];
const mvT=(ic,l,at,cls,extra)=>`<button type="button" class="ui-tuile mv-t${cls?" "+cls:""}" ${at||""}>${ic}<span class="ui-tuile__nom">${l}</span>${extra||""}</button>`;
const mvPlus=(at,l)=>`<button type="button" class="ui-tuile mv-t mv-plus" ${at} aria-label="${l}" title="${l}">${ICO("plus",24)}</button>`;
// petite fenêtre (choix rapide) ou plein écran (saisie) ; draw(corps, refaire) remplit le corps
function mvWin(title,full,draw,onOk,okL){const old=document.querySelector(".mvw");if(old)old.remove();let w;
  if(full){w=document.createElement("div");w.className="ui-plein mvw";w.style.setProperty("--sc","#6f8fe0");w.innerHTML=`<div class="ui-plein__haut"><h2 class="ui-plein__titre"><span class="ui-plein__ic">${rkSvg("note")}</span><span class="t"></span></h2></div><div class="ui-plein__corps mvc"></div><div class="ui-plein__bas${onOk?"":" mv-seul"}">${onOk?`<button type="button" class="ui-btn mvno">Annuler</button>`:""}<button type="button" class="ui-btn ui-btn--principal mvok">${okL||(onOk?"Enregistrer":"Terminé")}</button></div>`}
  else{w=document.createElement("div");w.className="ui-voile mvw";w.innerHTML=`<div class="ui-fenetre"><h2 class="ui-fenetre__titre"></h2><div class="mvc"></div><button type="button" class="ui-btn ui-btn--principal mvok">Terminé</button></div>`;w.onclick=e=>{if(e.target===w)close()}}
  w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");w.setAttribute("aria-label",title);(w.querySelector("h2 .t")||w.querySelector("h2")).textContent=title;
  const C=w.querySelector(".mvc"),close=()=>{w.remove();renderFiche();try{render()}catch(e){}},redo=()=>draw(C,redo);
  w.querySelector(".mvok").onclick=()=>{if(onOk&&onOk(C)===false)return;close()};const no=w.querySelector(".mvno");if(no)no.onclick=()=>{w.remove()};
  document.body.appendChild(w);redo();return w}
function renderFiche(){try{homeFix()}catch(e){console.warn("renderFiche",e)}const r=renderFicheBase.apply(this,arguments);try{autoTime()}catch(e){console.warn("renderFiche",e)}return r}
const fiT=(l,v,f)=>`<button type="button" class="fi-t${v?"":" fi-vide"}" data-f="${f}"><small>${l}</small><b>${v?esc(String(v)):"À remplir"}</b></button>`;
function renderFicheBase(){const box=document.getElementById("ficheBox");if(!box||!S||!S.g)return;const G=S.g;
  const s=sitOf()||{};const pri=(G.vie&&G.vie.pri)||[],v=typeof vieV==="function"?vieV():(G.vie||{}),H=HOMEI[homeOf({...s,with:Array.isArray(s.with)?s.with:[]})]||HOMEI.seul,W=Array.isArray(s.with)?s.with:[];
  const art=(G.taste&&Array.isArray(G.taste.art))?G.taste.art:[],nf=Array.isArray(G.normOff)?G.normOff:[];
  const wds=[1,2,3,4,5,6,0].filter(d=>(v.wd||[]).includes(d)),wdTxt=wds.length===5&&!wds.includes(6)&&!wds.includes(0)?"L–V":wds.length?wds.map(d=>MV_WDL[d]).join(""):"Repos";
  const grp=(lab,tiles)=>`<div class="mv-g">${lab?`<small class="mv-gl">${lab}</small>`:""}<div class="ui-tuiles mv-ts">${tiles}</div></div>`;
  const cl=CPLI[s.cpl],who=cplWho();
  box.innerHTML=`<div class="ui-entete"><h2 class="ui-titre">Ma fiche</h2><span class="fi-hint">Toucher pour changer</span></div>${perAskCard()}
    <div class="fi-g">${fiT("Situation",H[1],"home")}${fiT("Travail",JOBL[s.job],"job")}${fiT("Anniversaire",s.bd&&s.bd.d?s.bd.d+" "+MO_C[s.bd.m-1]:"","bd")}${fiT("Cœur",cl&&s.cpl!=="celib"&&who?who:cl,"cpl")}${fiT("Rythme",`Réveil ${wakeH()} h · ${wdTxt}`,"rythme")}${fiT("Priorités",pri.map(k=>(CATS[k]||{}).label||k).join(", "),"pri")}${fiT("J'aime",(s.pass||[]).map(k=>((SIT_Q.pass.find(x=>x[0]===k)||[])[1]||k)).join(", "),"pass")}${fiT("En ce moment",s.note,"note")}</div>
    ${grp("J'ai",(s.have||[]).map(k=>{const h=typeof haveOf==="function"&&haveOf(k);return h?mvT(tileI(h.ic),esc(h.l.replace(/^(Un|Une|Des|Du) /,"").replace(/^./,c=>c.toUpperCase())),"data-f=\"have\""):""}).join("")+mvPlus("data-f=\"have\"","Ajouter ce que j'ai"))}
    ${grp("Je veux",(s.goals||[]).filter(k=>GOALI[k]).map(k=>mvT(tileI(GOALI[k][0]),GOALI[k][1],"data-f=\"goals\"")).join("")+((s.goals||[]).length<3?mvPlus("data-f=\"goals\"","Ce que je veux améliorer"):""))}
    ${grp("J'aime",(s.pass||[]).filter(k=>PASSI[k]).map(k=>mvT(tileI(PASSI[k]),esc((SIT_Q.pass.find(x=>x[0]===k)||[])[1]||k),"data-f=\"pass\"")).join("")+(art.length?mvT(tileI("casque"),art.length+" artiste"+(art.length>1?"s":""),"data-f=\"pass\""):"")+mvPlus("data-f=\"pass\"","Ce que j'aime"))}
    ${grp("Pas pour moi",nf.filter(k=>NORMI[k]).map(k=>mvT(tileI(NORMI[k][0]),NORMI[k][1],"data-f=\"norm\"","mv-non")).join("")+mvPlus("data-f=\"norm\"","Ce qui ne me concerne pas"))}`;
  box.querySelectorAll(".mv-t").forEach(b=>{const n=b.querySelector(".ui-tuile__nom");if(n&&!b.getAttribute("aria-label"))b.setAttribute("aria-label",n.textContent)});
  box.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>ficheEdit(b.dataset.f));bindAsk(box)}
// enregistrer la fiche (sit) : toute modification passe par là
function sitSet(o){const G=S.g,cur=sitOf()||{goals:[],pass:[]};G.sit={...cur,...o,t:Date.now()};if(!Array.isArray(G.sit.with))G.sit.with=[];G.sit.home=homeOf(G.sit);if(G.fq)G.fq.d="";save()}
function ficheEdit(f){const G=S.g,s=()=>sitOf()||{goals:[],pass:[]},tiles=(L,cur,attr)=>`<div class="ui-tuiles mv-ts">${L.map(([k,ic,l])=>`<button type="button" class="ui-tuile mv-t${cur(k)?" ui-tuile--active":""}" ${attr}="${k}" aria-pressed="${!!cur(k)}">${tileI(ic)}<span class="ui-tuile__nom">${esc(l)}</span></button>`).join("")}</div>`;
  if(f==="job")return mvWin("Ma situation",false,(C,redo)=>{C.innerHTML=tiles(Object.keys(JOBL).map(k=>[k,JOBI[k],JOBL[k]]),k=>s().job===k,"data-v");
    C.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{sitSet({job:b.dataset.v});redo()})});
  if(f==="home"){const o={...s(),with:(s().with||[]).slice()};return fPick(o,()=>sitSet({with:o.with}))}
  if(f==="pri")return mvWin("Mes priorités · 3",false,(C,redo)=>{const P=(G.vie&&G.vie.pri)||[];C.innerHTML=tiles(Object.keys(PRII).filter(k=>CATS[k]).map(k=>[k,PRII[k],CATS[k].label]),k=>P.includes(k),"data-v");
    C.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{if(!G.vie||typeof G.vie!=="object")G.vie={};const Q=Array.isArray(G.vie.pri)?G.vie.pri.slice():[],k=b.dataset.v,i=Q.indexOf(k);if(i>=0)Q.splice(i,1);else{if(Q.length>=3)Q.shift();Q.push(k)}G.vie.pri=Q;save();redo()})});
  if(f==="goals")return mvWin("Je veux · 3",false,(C,redo)=>{const g=s().goals||[];C.innerHTML=tiles(Object.keys(GOALI).map(k=>[k,GOALI[k][0],GOALI[k][1]]),k=>g.includes(k),"data-v");
    C.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{const a=(s().goals||[]).slice(),k=b.dataset.v,i=a.indexOf(k);if(i>=0)a.splice(i,1);else{if(a.length>=3)a.shift();a.push(k)}sitSet({goals:a});redo()})});
  if(f==="norm")return mvWin("Pas pour moi",false,(C,redo)=>{const n=Array.isArray(G.normOff)?G.normOff:[];C.innerHTML=tiles(NORMS.map(([k])=>[k,(NORMI[k]||["autre"])[0],(NORMI[k]||[0,k])[1]]),k=>n.includes(k),"data-v");
    C.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{const a=(Array.isArray(G.normOff)?G.normOff:[]).slice(),k=b.dataset.v,i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);G.normOff=a;if(G.fq)G.fq.d="";save();redo()})});
  if(f==="have")return mvWin("J'ai…",true,(C,redo)=>{const h=s().have||[];C.innerHTML=HAVE_G.map(g=>{const L=HAVE.filter(x=>x.g===g);return L.length?`<small class="mv-gl">${g}</small>`+tiles(L.map(x=>[x.k,x.ic,x.l.replace(/^(Un|Une|Des|Du) /,"").replace(/^./,c=>c.toUpperCase())]),k=>h.includes(k),"data-v"):""}).join("");
    C.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{const a=(s().have||[]).slice(),k=b.dataset.v,i=a.indexOf(k),on=i<0;if(on)a.push(k);else a.splice(i,1);sitSet({have:a});try{haveApply(k,on);save()}catch(e){}const y=C.scrollTop;redo();C.scrollTop=y})});
  if(f==="pass")return mvWin("J'aime",true,(C,redo)=>{const p=s().pass||[],art=(G.taste&&Array.isArray(G.taste.art))?G.taste.art:[];
    C.innerHTML=tiles(SIT_Q.pass.map(([k,l])=>[k,PASSI[k]||"etoile",l]),k=>p.includes(k),"data-v")+`<small class="mv-gl">Mes artistes</small>${art.length?`<div class="mv-arts">${art.map((a,i)=>`<button type="button" class="ui-puce" data-ra="${i}"><span></span>${ICO("close",24)}</button>`).join("")}</div>`:""}<form class="mv-row"><input class="ui-champ" maxlength="40" placeholder="Ajouter un artiste" aria-label="Ajouter un artiste"><button type="submit" class="ui-btn ui-btn--icone" aria-label="Ajouter" title="Ajouter">${ICO("plus",24)}</button></form>`;
    C.querySelectorAll("[data-ra]").forEach(b=>{const a=art[+b.dataset.ra];b.querySelector("span").textContent=a;b.setAttribute("aria-label","Retirer "+a);b.onclick=()=>{G.taste={art:art.filter(x=>x!==a),t:Date.now()};if(G.fq)G.fq.d="";save();redo()}});
    C.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{const a=(s().pass||[]).slice(),k=b.dataset.v,i=a.indexOf(k);if(i>=0)a.splice(i,1);else a.push(k);sitSet({pass:a});redo()});
    C.querySelector("form").onsubmit=e=>{e.preventDefault();const v=e.target.querySelector("input").value.trim().slice(0,40);if(!v)return;if(art.length>=12){toast("12 artistes au maximum");return}if(!art.some(a=>a.toLowerCase()===v.toLowerCase()))G.taste={art:[...art,v],t:Date.now()};if(G.fq)G.fq.d="";save();redo();const i2=C.querySelector("form input");if(i2)i2.focus()}});
  if(f==="note")return mvWin("En ce moment",true,C=>{C.innerHTML=`<input class="ui-champ mvnote" maxlength="80" placeholder="Ex. trouver un appart à Montpellier" aria-label="Ce qui compte en ce moment">`;const i=C.querySelector("input");i.value=s().note||"";setTimeout(()=>i.focus(),50)},C=>{sitSet({note:C.querySelector("input").value.trim().slice(0,80)})});
  if(f==="bd")return mvWin("Mon anniversaire",true,C=>{C.innerHTML=dateFields("bd",s().bd)},C=>{const o=mvDate(C,"bd");if(o===false)return false;sitSet({bd:o});try{renderEvents()}catch(e){}});
  if(f==="cpl"){let st=s().cpl||"";return mvWin("Mon cœur",true,(C,redo)=>{const who=cplWho();
    C.innerHTML=`<div class="mv-puces">${Object.keys(CPLI).map(k=>`<button type="button" class="ui-puce" data-c="${k}" aria-pressed="${st===k}">${CPLI[k]}</button>`).join("")}</div>
      ${st&&st!=="celib"?`<small class="mv-gl">Avec</small><div class="mv-puces">${relNames().filter(n=>!isFam(n)).map(n=>`<button type="button" class="ui-puce" data-w="${esc(n)}" aria-pressed="${who===n}"></button>`).join("")||`<span class="ui-info">Ajoute tes proches dans Proches.</span>`}</div><small class="mv-gl">${st==="marie"?"Notre mariage":"Notre anniversaire"}</small>${dateFields("cpld",s().cpld)}`:""}`;
    C.querySelectorAll("[data-w]").forEach(b=>{b.textContent=b.dataset.w;b.onclick=()=>{const w=b.dataset.w;setRel(w,cplWho()===w?null:"couple");sitSet({});redo()}});
    C.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{st=st===b.dataset.c?"":b.dataset.c;redo()})},C=>{const o=C.querySelector('[data-dk="cpld"]')?mvDate(C,"cpld"):null;if(o===false)return false;sitSet(st&&st!=="celib"?{cpl:st,cpld:o}:{cpl:st});try{renderEvents()}catch(e){}})}
  if(f==="rythme"){const v=vieV(),o={wake:wakeH(),wd:(v.wd||[]).slice(),wf:v.wf,wt:v.wt,job:!!v.job};return mvWin("Mon rythme",true,(C,redo)=>{
    C.innerHTML=`<small class="mv-gl">Réveil</small><div class="mv-puces mv-h">${[5,6,7,8,9,10,11,12].map(n=>`<button type="button" class="ui-puce" data-h="${n}" aria-pressed="${o.wake===n}">${n} h</button>`).join("")}</div>
      <small class="mv-gl">Jours de travail</small><div class="mv-puces mv-j">${[1,2,3,4,5,6,0].map(d=>`<button type="button" class="ui-puce" data-d="${d}" aria-pressed="${o.wd.includes(d)}">${MV_WDL[d]}</button>`).join("")}</div>
      <div class="mv-two"><label class="mv-gl">De<input class="ui-champ" type="time" data-wf value="${o.wf}"></label><label class="mv-gl">À<input class="ui-champ" type="time" data-wt value="${o.wt}"></label></div>
      <button type="button" class="ui-puce mv-an" data-job aria-pressed="${o.job}">Toute l'année, pas seulement en contrat</button>`;
    C.querySelectorAll("[data-h]").forEach(b=>b.onclick=()=>{o.wake=+b.dataset.h;redo()});
    C.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{const d=+b.dataset.d;o.wd=o.wd.includes(d)?o.wd.filter(x=>x!==d):[...o.wd,d];redo()});
    C.querySelector("[data-wf]").onchange=e=>{o.wf=e.target.value||"09:00"};C.querySelector("[data-wt]").onchange=e=>{o.wt=e.target.value||"17:00"};
    C.querySelector("[data-job]").onclick=()=>{o.job=!o.job;redo()}},()=>{const v2=vieV();G.wake=o.wake;v2.wd=o.wd;v2.wf=o.wf;v2.wt=o.wt;v2.job=o.job;save();try{renderEvents();renderTrk()}catch(e){}})}}
// lit Jour / Mois / Année : un objet {d,m,y}, null si vide, false si incomplet
function mvDate(C,k){const f=C.querySelector(`[data-dk="${k}"]`);if(!f)return null;const g=q=>parseInt((f.querySelector(`[data-dp="${q}"]`)||{}).value,10),d=g("d"),m=g("m"),y=g("y"),o={};
  if(d>=1&&d<=31)o.d=d;if(m>=1&&m<=12)o.m=m;if(y>=1900&&y<=2100)o.y=y;if(o.d&&o.m)return o;if(!o.d&&!o.m)return null;try{toast("Il manque le jour ou le mois")}catch(e){}return false}
// ---- Équilibre en carrés, réglages d'un proche en carrés, situation recalculée
function balViz(){const bc=document.getElementById("balCard");if(!bc)return;bc.classList.remove("closed");
  const og=document.getElementById("offGo"),pz=document.getElementById("pzGo"),so=document.getElementById("softTg"),cf=document.getElementById("cfTg");
  const pzs=(bc.querySelector("#pzGo")||{}).closest?bc.querySelector("#pzGo").closest(".balr").querySelector("small").textContent:"";const left=(pzs.match(/(\d+)\s*jours? restants?/)||[])[1];
  const T=[["off","sieste","Jour off",og?(og.disabled?"Déjà pris":"1 par semaine"):"",og&&og.disabled],["pz","sante","Pause",left?left+" j restants":"",false],["soft","plante","Mode doux",so&&so.checked?"Actif":"Off",so&&so.checked],["cf","lune","Couvre-feu",cf&&cf.checked?"23 h 30":"Off",cf&&cf.checked]];
  const k=T.map(t=>t[3]+t[4]).join("|");let g=bc.querySelector(".balviz");if(g&&g.dataset.k===k)return;if(!g){g=document.createElement("div");g.className="balviz";bc.querySelector("h3").after(g)}g.dataset.k=k;
  g.innerHTML=T.map(([id,ic,l,sub,on])=>`<button type="button" class="svt" data-b="${id}" aria-pressed="${on?"true":"false"}"><span class="fti">${vI(ic)}</span><span>${l}</span><em>${esc(sub)}</em></button>`).join("");
  g.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{const id=b.dataset.b;if(id==="off"&&og)og.click();if(id==="pz"&&pz)pz.click();if(id==="soft"&&so){so.checked=!so.checked;so.dispatchEvent(new Event("change"))}if(id==="cf"&&cf){cf.checked=!cf.checked;cf.dispatchEvent(new Event("change"))}g.dataset.k="";setTimeout(balViz,50)})}
function homeFix(){const s=sitOf();if(!s)return;if(!Array.isArray(s.with))s.with=[];const h=homeOf(s);if(s.home!==h){s.home=h;save();}}
// ---- ce mois-ci, en vrai
// haut du Bilan (2.3, 02/11) : ce qui a été fait dans la période choisie (semaine, mois, année)
function bilPer(){const now=new Date(dayKey(Date.now())+"T12:00");
  if(bilTab==="m"){const d=new Date(now);d.setDate(1);d.setMonth(d.getMonth()-bilOff);const ym=ymOf(d.getTime());return{in:t=>ymOf(t)===ym,t:bilOff?"En "+MOIS_C[d.getMonth()]+", en vrai":"Ce mois-ci, en vrai"}}
  if(bilTab==="y"){const y=now.getFullYear()-bilOff;return{in:t=>+dayKey(t).slice(0,4)===y,t:bilOff?"En "+y+", en vrai":"Cette année, en vrai"}}
  const K=new Set(bWeek(bilOff));return{in:t=>K.has(dayKey(t)),t:bilOff?"Cette semaine-là, en vrai":"Cette semaine, en vrai"}}
function realRecap(){const b=document.getElementById("chapBox");if(!b||!S||!S.g)return;const PR=bilPer(),L=(S.log||[]).filter(e=>PR.in(e.t)&&e.xp>=0);
  const ppl=new Set();L.forEach(e=>{(e.withp||[]).forEach(n=>ppl.add(n));(S.friends||[]).concat(S.family||[]).forEach(n=>{if(new RegExp("\\b"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(e.name||""))ppl.add(n)})});
  const pl=(n,a,b)=>n>1?b:a,cnt=re=>L.filter(e=>re.test(e.a||"")).length,T=[],add=(n,l,c)=>{if(n)T.push([n,l,c])};
  add(ppl.size,pl(ppl.size,"proche vu","proches vus"),"var(--c-social)");
  const fin=((S.g.fini||{}).book||[]).filter(x=>x.e&&PR.in(x.e)).length;add(fin,pl(fin,"livre","livres"),"var(--c-soi)");
  const film=cnt(/^af:regarder:Film/);add(film,pl(film,"film","films"),"var(--ink)");
  const sp=L.filter(e=>e.cat==="sport").length;add(sp,pl(sp,"séance","séances"),"var(--c-sport)");
  const so=L.filter(e=>e.idq).length;add(so,pl(so,"sortie","sorties"),"var(--ui-or)");
  const rm=new Set(L.filter(e=>/^af:ranger:/.test(e.a||"")).map(e=>e.a)).size;add(rm,pl(rm,"pièce rangée","pièces rangées"),"var(--ink)");
  const sums={};L.forEach(e=>{const r=String(e.name||"").match(QRX);if(!r)return;const u=r[2];sums[u]=(sums[u]||0)+parseFloat(r[1].replace(",","."))});
  if(sums.km)add(Math.round(sums.km*10)/10,"km parcourus","var(--c-sport)");if(sums.pages)add(Math.round(sums.pages),"pages lues","var(--c-soi)");if(sums["rép."])add(Math.round(sums["rép."]),"rép. de renfo","var(--c-sport)");
  const k=PR.t+"|"+T.map(t=>t[0]+t[1]).join("|"),anc=b.querySelector(".bce-w")||b.querySelector(".bnav")||b.querySelector(".btabs");let c=b.querySelector(".realrc");if(c&&c.dataset.k===k&&anc&&c.previousElementSibling===anc)return;
  if(!c){c=document.createElement("div");c.className="realrc"}if(anc)anc.after(c);else b.prepend(c);c.dataset.k=k;
  c.innerHTML=`<div class="ui-entete"><h2 class="ui-titre">${PR.t}</h2></div>${T.length?`<div class="rrg">${T.slice(0,6).map(([n,l,col])=>`<div class="rrt"><b style="color:${col}">${n}</b><small>${esc(l)}</small></div>`).join("")}</div>`:`<p class="vide">Rien de noté pour l'instant.</p>`}`}

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
