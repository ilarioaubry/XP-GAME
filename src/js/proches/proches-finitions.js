// Proches : finitions (un mot après avoir vu quelqu'un, rappel, passe visuelle de la fiche, groupes). Ex-correctifs.js, à fondre dans les rendus d'origine lors de la refonte écran par écran.
// ---- un mot à retenir après avoir vu quelqu'un
function kwAsk(names){names=(names||[]).filter(n=>S.profiles&&n);if(!names.length)return;document.querySelectorAll(".kwask").forEach(e=>e.remove());const n=names[0],p=document.createElement("div");p.className="kwask";
  p.innerHTML=`<span class="kwav">${pAv(n,"fmini")}</span><div><small>Un sujet à retenir avec ${esc(names.length>1?n+" et les autres":n)} ?</small><span class="kwin"><input maxlength="50" placeholder="Ex. son entretien, son déménagement"><button type="button" class="btn primary">OK</button></span></div><button type="button" class="kwx" aria-label="Passer">${ICO("close",14)}</button>`;
  document.body.appendChild(p);const inp=p.querySelector("input"),close=()=>{p.classList.add("out");setTimeout(()=>p.remove(),250)};let tm=setTimeout(close,15000);inp.onfocus=()=>clearTimeout(tm);
  const ok=()=>{const t=inp.value.trim().slice(0,50);if(t){names.forEach(x=>{if(!S.profiles[x])S.profiles[x]={};S.profiles[x].kw={t,at:Date.now()}});save();try{toast("Noté, je t'en reparlerai")}catch(e){}}close()};
  p.querySelector(".btn").onclick=ok;inp.onkeydown=e=>{if(e.key==="Enter")ok()};p.querySelector(".kwx").onclick=close}
function kwOf(n){const k=((S.profiles||{})[n]||{}).kw;return k&&Date.now()-k.at<75*864e5&&Date.now()-k.at>2*864e5?k.t:""}
// vrai si l'heure donnée tombe pendant tes heures de travail aujourd'hui
function inWork(h){try{const v=S.g.vie||{},now=new Date(),tk=dayKey(Date.now());if(!(v.wd||[]).includes(now.getDay())||!v.wf||!v.wt)return false;const per=(S.g.per||[]).some(p=>p.t==="contrat"&&p.s<=tk&&tk<=p.e);const sj=(sitOf()||{}).job;if(!(v.job||per||sj==="poste"))return false;const hh=x=>{const[a,b]=String(x).split(":");return+a+(+b||0)/60};return h>=hh(v.wf)&&h<hh(v.wt)}catch(e){return false}}
function smartPool(){const g=S.g,tk=dayKey(Date.now()),now=Date.now(),out=[],v=g.vie||{},pri=Array.isArray(v.pri)?v.pri:[];let s=null;try{s=sitOf()}catch(e){}
  const add=(o)=>{if(pri.includes(o.cat))o.sc+=3;out.push(o)};
  // endroits oubliés
  {const L=[];FAM.forEach(f=>{[...f.o,...((g.afCustom||{})[f.id]||[])].forEach(op=>{const lab=Array.isArray(op)?op[0]:op,fr=afFr(f,lab);if(!fr)return;const k="af:"+f.id+":"+lab,t=(g.afLast||{})[k];if(!t)return;const d=Math.floor((now-t)/864e5);if(d<fr[1])return;L.push({name:f.l+" · "+lab,cat:f.cat,xp:Math.min(40,f.xp+d),why:"Ça fait "+d+" j",sc:5.5+Math.min(2,d/fr[1]),afk:k})})});L.sort((a,b)=>b.sc-a.sc).slice(0,3).forEach(add)}
  // la dernière fois que…
  (g.last||[]).forEach(x=>{if(!x.d)return;const d=Math.floor((now-new Date(x.d+"T12:00"))/864e5),per=x.n*({j:1,s:7,m:30}[x.u]||1);if(d<per)return;add({name:x.name,cat:(()=>{const k=afMatch(x.name),f=k&&FAM.find(y=>y.id===k.split(":")[1]);return f?f.cat:"maison"})(),xp:20,why:"Ça fait "+(d>=60?Math.round(d/30)+" mois":d+" j"),sc:5+d/per,lk:x.id})});
  // une personne qui attend de tes nouvelles
  {const pf=v.pf||{},home=new Set(((sitOf()||{}).with)||[]);let best=null;Object.keys(pf).filter(n=>!home.has(n)).forEach(n=>{const l=(S.bondsLast||{})[n]||0,d=l?(now-l)/864e5:99,r=d/pf[n];if(r>=1&&(!best||r>best.r))best={n,r,d}});
   if(!best){const P=Object.keys(S.bonds||{}).filter(n=>!home.has(n)).sort((a,b)=>(S.bonds[b]||0)-(S.bonds[a]||0)).slice(0,8);P.forEach(n=>{const l=(S.bondsLast||{})[n]||0,d=l?(now-l)/864e5:99;if(d>=14&&(!best||d>best.d))best={n,d,r:0}})}
   if(best){let fam=false;try{fam=isFam(best.n)}catch(e){}add({name:kwOf(best.n)?"Demander à "+best.n+" : « "+kwOf(best.n)+" »":"Prendre des nouvelles de "+best.n,cat:fam?"famille":"social",xp:20,why:best.d>=99?"Pas de nouvelles notées":"Ça fait "+Math.round(best.d)+" j",sc:best.r?7:4,who:best.n})}}
  // tes habitudes
  try{habitQuests(add)}catch(e){}
  // ta fiche
  const oldest=fid=>{const f=FAM.find(x=>x.id===fid);if(!f)return null;return f.o.map(o=>Array.isArray(o)?o[0]:o).map(o=>({o,t:(g.afLast||{})["af:"+fid+":"+o]||0})).sort((a,b)=>a.t-b.t)[0]};
  ((s&&s.goals)||[]).forEach(k=>(GOALQ[k]||[]).forEach(([n,c,x])=>{
    if(n==="@room"){const r=oldest("ranger"),z=oldest("nettoyer");if(r)add({name:"Ranger à fond : "+r.o.toLowerCase(),cat:"maison",xp:25,why:r.t?"La moins rangée":"Ta fiche",sc:4.8,afk:"af:ranger:"+r.o});if(z)add({name:"Nettoyer : "+z.o.toLowerCase(),cat:"maison",xp:20,why:z.t?"Pas fait depuis longtemps":"Ta fiche",sc:4.2,afk:"af:nettoyer:"+z.o});return}
    if(n==="@bed"){add({name:"Au lit avant minuit",cat:"soi",xp:20,why:"Validé au coucher",sc:4.6,eod:"bed"});return}
    add({name:n,cat:c,xp:x,why:"Ta fiche",sc:4.5})}));
  // le contexte du jour
  let wx=null;try{wx=wxNow()}catch(e){}const h=dayH(),we=isWeekend();
  if(wx&&wx.k==="sun"&&h<18&&!inWork(h))add({name:"20 min dehors au soleil",cat:"soi",xp:15,why:"Il fait beau",sc:4});
  if(wx&&["rain","storm","snow"].includes(wx.k))add({name:"Un épisode ou 20 pages au chaud",cat:"soi",xp:15,why:"Il pleut",sc:3});
  if(we)add({name:"Aller dans un café ou un parc où tu n'es jamais allé",cat:"soi",xp:30,why:"C'est le week-end",sc:3.5});
  {const sl=(g.sleep||{})[tk];if(sl&&sl.h&&sl.h<6.5&&h<18&&!inWork(h))add({name:"Une sieste de 20 min",cat:"soi",xp:10,why:"Nuit courte",sc:6,nap:20})}
  {let ev=[];try{ev=evList().filter(e=>e.inD===1)}catch(e){}let evq=[];try{evq=evQuests()}catch(e){}if(ev[0]&&!evq.length)add({name:"Préparer : "+ev[0].n,cat:"soi",xp:15,why:"C'est demain",sc:6})}
  {const P=(g.per||[]).find(p=>p.t==="contrat"&&p.e>=tk);if(P){const left=Math.round((new Date(P.e+"T12:00")-new Date(tk+"T12:00"))/864e5);if(left>=0&&left<=3)add({name:"Préparer la suite après le contrat",cat:"travail",xp:20,why:left?"Fin dans "+left+" j":"Dernier jour",sc:5})}}
  {const y=(g.cig||{})[dayKey(now-864e5)]||0;if(y>0&&!(v.track&&v.track.cig===false))add({name:"Moins de "+y+" cigarette"+(y>1?"s":"")+" aujourd'hui",cat:"soi",xp:25,why:"Validé ce soir",sc:5,eod:"cig",eodv:y})}
  try{natQuests(add,wx,h)}catch(e){}
  try{recQuests(add)}catch(e){}
  // énergie et jour de travail
  let e=0;try{e=enOf()}catch(_){}const wd=(()=>{try{return vieCap()<3}catch(_){return false}})();
  out.forEach(o=>{if(e===1&&o.xp>20)o.sc-=3;if(e===3&&o.xp>=20)o.sc+=1;if(wd&&o.xp>25)o.sc-=1.5});
  return out}
window.__smartPool=()=>smartPool();
function smartQuests(){if(!S||!S.g||!Array.isArray(S.specials))return;const g=S.g,tk=dayKey(Date.now());
  let ch=false;
  // anniversaires sans date complète ou hors période : retirés
  {const n0=S.specials.length,t=new Date();t.setHours(0,0,0,0);S.specials=S.specials.filter(q=>{if(!q.bd)return true;const bd=((S.profiles||{})[q.bd]||{}).bd;if(!bd||!bd.d||!bd.m)return false;let dt=new Date(t.getFullYear(),bd.m-1,bd.d),df=Math.round((t-dt)/864e5);if(df<-300)df+=365;return df>=0&&df<=2});if(S.specials.length!==n0)ch=true}
  // moins de musique et de proches au hasard
  {const n0=S.specials.length;S.specials=S.specials.filter(q=>!(q.grp==="friends"||q.grp==="family"||q.grp==="music"));if(S.specials.length!==n0)ch=true}
  if(!g.sm||g.sm.d!==tk){
    S.specials.filter(q=>q.sm&&q.eod&&q.sm!==tk).forEach(q=>{const d=q.sm;let ok=false,why="";
      if(q.eod==="cig"){const n=(g.cig||{})[d]||0;ok=n<q.eodv;why=n+" cigarette"+(n>1?"s":"")}
      if(q.eod==="bed"){const J=(g.jr||{})[d];if(J&&J.at){const h=new Date(J.at).getHours();ok=h>=17&&h<=23;why="couché à "+h+"h"}}
      if(ok){try{addBonus("Défi réussi : "+q.name,q.xp,0,"eod")}catch(e){}setTimeout(()=>{try{toast(`Défi d'hier réussi (${esc(why)}) <span class="p">+${q.xp} XP</span>`)}catch(e){}},1200)}});
    S.specials=S.specials.filter(q=>!q.sm);const hist=(g.smHist||[]).filter(x=>x.t>Date.now()-5*864e5).map(x=>x.n);
    const P=smartPool().filter(o=>!hist.includes(o.name)&&!S.specials.some(q=>q.name===o.name)).sort((a,b)=>b.sc-a.sc),pick=[],cats=new Set();
    const famOf=o=>{try{const k=o.afk||afMatch(o.name);return k?k.split(":")[1]:""}catch(e){return""}},fams=new Set();
    for(const o of P){if(pick.length>=8)break;const nc=pick.filter(x=>x.cat===o.cat).length;if(nc>=2)continue;const fm=famOf(o);if(fm&&fams.has(fm))continue;if(fm)fams.add(fm);pick.push(o);cats.add(o.cat)}
    pick.slice().reverse().forEach((o,i)=>S.specials.unshift({id:"sm"+tk+i+Math.random().toString(36).slice(2,5),name:o.name,cat:o.cat,xp:o.xp,sm:tk,why:o.why,...(o.who?{who:o.who}:{}),...(o.afk?{afk:o.afk}:{}),...(o.lk?{lk:o.lk}:{}),...(o.nap?{nap:o.nap}:{}),...(o.nat?{nat:o.nat}:{}),...(o.rec?{rec:o.rec,recv:o.recv}:{}),...(o.eod?{eod:o.eod,eodv:o.eodv||0}:{})}));
    g.sm={d:tk};ch=true}
  if(ch){save();try{renderSpecials()}catch(e){}}}
try{DQ_K.bd=["Anniversaire","#e0447a",'<path d="M4 21h16M5 21v-7h14v7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 11V8" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="5.5" r="1.8" fill="currentColor"/>'];DQ_ORD.bd=-2;DQ_K.smart=["Pour toi","#3fbf6a",'<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" fill="currentColor"/>'];DQ_ORD.smart=-.2}catch(e){}

// Profil d'un proche : « Me rappeler de prendre des nouvelles »
const RF=[[0,"Non"],[7,"Semaine"],[14,"2 sem."],[30,"Mois"],[90,"3 mois"]];
function profRemind(){const root=document.getElementById("prof");if(!root||typeof profName==="undefined"||!profName||String(profName).startsWith("@g:")||!S||!S.g)return;
  const card=document.getElementById("pCardF");if(!card)return;const v=(S.g.vie&&S.g.vie.pf)||{},cur=v[profName]||0;
  let el=root.querySelector(".premind");if(el&&el.dataset.n===profName&&+el.dataset.v===cur)return;if(el)el.remove();
  el=document.createElement("div");el.className="premind";el.dataset.n=profName;el.dataset.v=cur;
  el.innerHTML=remindViz(el,profName,cur);
  card.after(el);el.querySelectorAll("[data-rf]").forEach(b=>b.onclick=()=>{if(!S.g.vie||typeof S.g.vie!=="object")S.g.vie={};if(!S.g.vie.pf)S.g.vie.pf={};const d=+b.dataset.rf;if(d)S.g.vie.pf[profName]=d;else delete S.g.vie.pf[profName];save();el.dataset.v=-1;profRemind();try{renderTrk()}catch(e){}})}
// ---- passe visuelle : profil d'un proche, liste, garde-robe, bilan
try{void 0;}catch(e){}
const vI=k=>{try{return rkSvg(k)}catch(e){return""}};
const TAGI=[[/geek|jeu|gamer/i,"manette"],[/cin[ée]/i,"clap"],[/musi|chant|rap/i,"micro"],[/sport|foot|basket/i,"halteres"],[/art|dessin|peint/i,"pinceau"],[/voyag/i,"valise"],[/gourm|cuisi/i,"repas"],[/f[êe]tard|f[êe]te/i,"cocktail"],[/intello|lect|livre/i,"lire"],[/nature|jardin/i,"plante"],[/danse/i,"pas"],[/humour|blague/i,"bulle"],[/photo/i,"photo"],[/brico/i,"ciseaux"],[/[ée]coute|conseil/i,"coeur"]];
const tagIc=t=>(TAGI.find(([r])=>r.test(t))||[0,"etoile"])[1];
const HISTI=[[/vu|voir|en vrai/i,"duo"],[/appel/i,"tel"],[/nouvelles|message|[ée]crire/i,"bulle"],[/anniv/i,"cake"],[/cadeau/i,"cake"]];
function profViz(){const root=document.getElementById("prof");if(!root||root.hidden||!root.offsetHeight)return;
  const acts=root.querySelector("#pActs");if(acts&&!acts.dataset.vz){acts.dataset.vz=1;acts.classList.add("ractz");acts.querySelectorAll("button").forEach(b=>{const t=b.textContent;if(/appel|vrai/i.test(t))b.addEventListener("click",()=>{const n=profName;setTimeout(()=>{try{kwAsk([n])}catch(e){}},2800)});b.insertAdjacentHTML("afterbegin",`<span class="rai">${vI(/appel/i.test(t)?"tel":/vrai/i.test(t)?"duo":"bulle")}</span>`)})}
  const ul=root.querySelector("#pHist");if(ul){const sig=ul.innerText;let hv=root.querySelector(".histviz");if(!hv||hv.dataset.s!==sig){if(!hv){hv=document.createElement("div");hv.className="histviz";ul.after(hv)}hv.dataset.s=sig;
    const L=[];ul.querySelectorAll("li").forEach(li=>{const tm=(li.querySelector("time")||{}).textContent||"",nm=(li.querySelectorAll("span")[0]||{}).textContent||"",x=(li.querySelector(".x")||{}).textContent||"";const k=tm+"|"+nm,last=L[L.length-1];if(last&&last.k===k){last.n++;last.x+=parseInt(x)||0}else L.push({k,tm,nm,n:1,x:parseInt(x)||0})});
    hv.innerHTML=L.slice(0,16).map(o=>`<div class="hvt" title="${esc(o.nm)}"><span class="hvi">${vI((HISTI.find(([r])=>r.test(o.nm))||[0,"etoile"])[1])}</span>${o.n>1?`<em>×${o.n}</em>`:""}<small>${esc(o.tm.replace(/\.$/,""))}</small>${o.x?`<b>+${o.x}</b>`:""}</div>`).join("")||`<p class="hint vide">Aucun élément pour l'instant</p>`}}}
function remindViz(el,name,cur){const l=(S.bondsLast||{})[name]||0,d=l?Math.floor((Date.now()-l)/864e5):null;let bar="";
  if(cur){const left=d==null?0:Math.max(0,cur-d),pc=d==null?0:Math.max(0,Math.min(100,left/cur*100)),col=pc>50?"#6ccf5a":pc>20?"#ffd94a":"#e8473a";bar=`<div class="rmg"><i style="width:${pc}%;background:${col}"></i></div><small>${d==null?"Pas encore de nouvelles":left?"Rappel dans "+left+" j":"C'est le moment"}</small>`}
  return`<div class="rmh"><span class="rmi">${vI("cloche")}</span><div class="rmb"><b>Rappel</b>${bar||"<small>Coupé</small>"}</div></div><div class="rmt">${RF.map(([v,lb])=>`<button type="button" data-rf="${v}" aria-pressed="${cur===v}"><i></i><span>${v?({7:"7 j",14:"14 j",30:"1 mois",90:"3 mois"})[v]:"Off"}</span></button>`).join("")}</div>`}
function relViz(){document.querySelectorAll("#relList li.rl small.rw").forEach(s=>{const t=s.textContent.trim();if(s.dataset.vz===t)return;s.dataset.vz=t;let d=null;const m=t.match(/(\d+)\s*(j|sem|mois)/);if(/aujourd/i.test(t))d=0;else if(/hier/i.test(t))d=1;else if(m)d=+m[1]*(m[2]==="mois"?30:m[2]==="sem"?7:1);
    const col=d==null?"#6d7680":d<=7?"#6ccf5a":d<=14?"#ffd94a":d<=30?"#f0a020":"#e8473a",pc=d==null?0:Math.min(100,d/30*100);let r=s.parentElement.querySelector(".rwr");if(!r){r=document.createElement("span");r.className="rwr";s.after(r)}
    r.style.setProperty("--rc",col);r.style.setProperty("--rp",pc+"%");r.title=t;r.innerHTML=`<i></i><b>${d==null?"–":d>=30?Math.round(d/30)+"m":d+"j"}</b>`})}
function wrViz(){const RN=(typeof RAR!=="undefined"?RAR:[]).map(r=>r[0]);document.querySelectorAll(".wr-it:not([data-vz])").forEach(b=>{b.dataset.vz=1;const sm=b.querySelector("small"),bb=b.querySelector("b");if(sm&&RN.includes(sm.textContent.trim()))sm.classList.add("wrh");if(bb&&bb.textContent.trim()==="???")bb.classList.add("wrh")})}
function bilViz(){document.querySelectorAll("#chapBox ul.bcl:not([data-vz])").forEach(ul=>{ul.dataset.vz=1;const T=[...ul.querySelectorAll("li")].map(li=>{const t=li.textContent.trim(),pts=t.split(" · ");let lab="",main=pts[0],sub=pts.slice(1).join(" · "),ic="etoile";
      if(/XP/.test(main)){ic="eclair";lab="XP"}else if(/^Rituels/i.test(main)){ic="check";lab="Rituels";main=main.replace(/^Rituels\s*:\s*/i,"")}else if(/^Nuits?/i.test(main)){ic="lune";lab="Nuits";main=main.replace(/^Nuits?\s*(de)?\s*/i,"")}else{const m=main.match(/^(.*?)\s*:\s*(.*)$/);if(m){lab=m[1];main=m[2]}}
      return`<div class="bct2"><span class="fti">${vI(ic)}</span><b>${esc(main)}</b>${lab&&ic!=="eclair"?`<small class="bcl2">${esc(lab)}</small>`:""}${sub?`<small>${esc(sub)}</small>`:""}</div>`});ul.insertAdjacentHTML("afterend",`<div class="bcviz">${T.join("")}</div>`)})}
// ---- Proches : les groupes prennent le même anneau de fraîcheur que les personnes
function grpViz(){document.querySelectorAll(".fgcard small").forEach(s=>{const t=s.textContent.trim();if(s.dataset.vz===t)return;s.dataset.vz=t;const m=t.match(/il y a (\d+) j/),d=/aujourd/.test(t)?0:m?+m[1]:null;
    const col=d==null?"#6d7680":d<=7?"#6ccf5a":d<=14?"#ffd94a":d<=30?"#f0a020":"#e8473a",pc=d==null?0:Math.min(100,d/30*100);let r=s.parentElement.querySelector(".rwr");if(!r){r=document.createElement("span");r.className="rwr fgr";s.after(r)}
    r.style.setProperty("--rc",col);r.style.setProperty("--rp",pc+"%");r.title=t;r.innerHTML=`<i></i><b>${d==null?"–":d+"j"}</b>`})}
// ---- cadre du profil : couleur Famille ou Ami
function proFrame(){const c=document.getElementById("pCardF");if(!c)return;const n=(document.getElementById("pName")||{}).textContent||"";c.style.setProperty("--fc",n&&isFam(n)?"var(--c-famille)":"var(--c-social)")}
