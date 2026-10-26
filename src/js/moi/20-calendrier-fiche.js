// ===== Calendrier, quêtes d'événements, fiche de personnage =====
const EVT=[["concert","Concert","#ff6a8a"],["soiree","Soirée","#b48cff"],["entretien","Entretien","#6f8fe0"],["examen","Examen","#ffc94a"],["voyage","Voyage","#3cc0f0"],["rdv","Rendez-vous","#5fae4f"],["sport","Sport","#ff8a3a"],["autre","Autre","#aab4bd"]];
const evtOf=t=>EVT.find(x=>x[0]===t)||EVT[7];
function evtGuess(n){n=(n||"").toLowerCase();if(/concert|festival|live\b|showcase/.test(n))return"concert";if(/entretien|recrut/.test(n))return"entretien";if(/exam|partiel|bac\b|oral|concours/.test(n))return"examen";
  if(/voyage|vacances|vol\b|avion|train|week-end à|weekend à/.test(n))return"voyage";if(/soir[ée]e|anniv|f[êe]te|apéro|apero|resto/.test(n))return"soiree";if(/m[ée]decin|dentiste|rdv|rendez|docteur|kin[ée]/.test(n))return"rdv";if(/match|course|marathon|comp[ée]t|tournoi/.test(n))return"sport";return"autre"}
// [type, id, de J-a, à J-b (négatif = après), texte(e), cat, xp, pourquoi(e)]
const EVQ=[
 ["concert","setlist",7,2,e=>`Écouter la setlist probable de ${e.a||"l'artiste"} pour connaître les sons par cœur`,"perso",15],
 ["concert","itw",4,1,e=>`Regarder une interview récente de ${e.a}`,"perso",15,e=>!!e.a],
 ["concert","pote",6,2,e=>"Proposer à un pote de venir au concert avec toi","social",15],
 ["concert","sac",1,1,e=>"Préparer ta tenue et ton sac : billet, batterie, bouchons d'oreilles","soi",15],
 ["concert","trajet",1,0,e=>"Vérifier ton billet, l'heure d'ouverture des portes et le trajet","soi",10],
 ["concert","eau",0,0,e=>"Bien manger et boire un grand verre d'eau avant le concert","nourriture",10],
 ["concert","souv",-1,-1,e=>"Noter tes 3 meilleurs moments du concert","soi",15],
 ["concert","share",-1,-1,e=>"Envoyer une photo ou une vidéo du concert à un pote","social",10],
 ["entretien","boite",6,2,e=>"Te renseigner 20 min sur l'entreprise","travail",20],
 ["entretien","rep",4,1,e=>"Préparer tes réponses à 3 questions classiques d'entretien","travail",25],
 ["entretien","tenue",1,1,e=>"Préparer ta tenue et ton trajet pour l'entretien","soi",15],
 ["entretien","merci",-1,-1,e=>"Envoyer un mail de remerciement après l'entretien","travail",15],
 ["examen","rev",10,1,e=>"Réviser 30 min, téléphone dans une autre pièce","travail",25],
 ["examen","fiche",5,2,e=>"Faire une fiche de révision","travail",20],
 ["examen","dodo",1,1,e=>"Préparer tes affaires et te coucher tôt","soi",15],
 ["voyage","liste",7,3,e=>"Faire la liste de ce qu'il faut emporter","maison",15],
 ["voyage","valise",2,1,e=>"Faire ta valise","maison",20],
 ["voyage","docs",1,0,e=>"Vérifier billets, papiers et chargeurs","soi",10],
 ["soiree","cadeau",4,1,e=>/anniv/i.test(e.n)?"Prévoir un petit cadeau":"Proposer d'apporter quelque chose","social",15],
 ["soiree","eau",0,0,e=>"Un grand verre d'eau avant de sortir","nourriture",5],
 ["soiree","merci",-1,-1,e=>"Envoyer un petit message pour remercier de la soirée","social",10],
 ["rdv","quest",3,1,e=>"Noter tes questions pour le rendez-vous","soi",10],
 ["rdv","papiers",1,0,e=>"Préparer les papiers nécessaires","soi",10],
 ["sport","train",7,2,e=>"Séance d'entraînement légère","sport",20],
 ["sport","repos",1,1,e=>"Repos, hydratation et coucher tôt","soi",10],
 ["autre","prep",2,1,e=>`Préparer : ${e.n}`,"soi",10]];
function evInD(e){const t=new Date(dayKey(Date.now())+"T12:00");return Math.round((new Date(e.d+"T12:00")-t)/864e5)}
function evWhenS(d){return d<0?"hier":d===0?"aujourd'hui":d===1?"demain":"dans "+d+" jours"}
function evQuests(){const G=S.g;if(!Array.isArray(G.ev))return[];if(!G.evq||typeof G.evq!=="object")G.evq={};const out=[];
  G.ev.map(e=>({e,d:evInD(e)})).filter(x=>x.d>=-1&&x.d<=10).sort((a,b)=>Math.abs(a.d)-Math.abs(b.d)).forEach(({e,d})=>{if(out.length>=2)return;const t=e.t||evtGuess(e.n),dn=G.evq[e.id]||[];
    const C=EVQ.filter(q=>q[0]===t&&d<=q[2]&&d>=q[3]&&!dn.includes(q[1])&&!(G.fqNo||{})["e:"+q[1]]&&(!q[7]||q[7](e)));if(!C.length)return;const q=C[(evInD({d:"2026-01-01"})*-1+e.id.length)%C.length]||C[0];
    out.push({id:"ev:"+e.id+":"+q[1],t:q[4](e),why:`${evtOf(t)[1]} ${evWhenS(d)} : ${e.n}`.slice(0,60),cat:q[5],xp:XPE(q[6])+(t==="entretien"&&(q[1]==="rep"||q[1]==="merci")?15:0),ev:e.id,tpl:q[1],A:e.a||""})});return out}
let fqOutBusy=false;function fqHasOut(){if(fqOutBusy||!S.g||!sitOf())return false;fqOutBusy=true;try{const d=new Set((S.g.fq&&S.g.fq.done)||[]);return fqList().some(x=>x.out&&!d.has(x.id))}catch(e){return false}finally{fqOutBusy=false}}

// --- calendrier
let calM=null,calSel=null;
function calOpen(day){if(document.querySelector(".calsh"))return;const G=S.g;if(!Array.isArray(G.ev))G.ev=[];const tk=dayKey(Date.now());calSel=day||tk;const d0=new Date(calSel+"T12:00");calM=[d0.getFullYear(),d0.getMonth()];
  const p=document.createElement("div");p.className="bpop rapop calsh";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Calendrier");document.body.appendChild(p);
  const close=()=>{p.remove();render()};p.onclick=e=>{if(e.target===p)close()};const MOIS_L=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  let fType="",fName="",fArt="";
  const bdOn=k=>{const dt=new Date(k+"T12:00");return relNames().filter(n=>{const b=(S.profiles[n]||{}).bd;return b&&b.d===dt.getDate()&&b.m===dt.getMonth()+1})};
  const draw=()=>{const[y,m]=calM,first=new Date(y,m,1),off=(first.getDay()+6)%7,dim=new Date(y,m+1,0).getDate();let cells="";for(let i=0;i<off;i++)cells+=`<i class="no"></i>`;
    for(let dd=1;dd<=dim;dd++){const k=`${y}-${String(m+1).padStart(2,"0")}-${String(dd).padStart(2,"0")}`,E=G.ev.filter(e=>e.d===k),B=bdOn(k);
      cells+=`<button type="button" class="cald${B.length?" hasbd":""}${k===tk?" td":""}${k===calSel?" sel":""}${k<tk?" past":""}" data-k="${k}" aria-label="${dd} ${MOIS_L[m]}${E.length?", "+E.length+" événement"+(E.length>1?"s":""):""}"><span>${dd}</span><span class="caldots">${E.slice(0,3).map(e=>`<i style="background:${evtOf(e.t||evtGuess(e.n))[2]}"></i>`).join("")}${B.length?`<i class="bdpx">${window.BDCAKE||""}</i>`:""}</span></button>`}
    const sd=new Date(calSel+"T12:00"),E=G.ev.filter(e=>e.d===calSel),B=bdOn(calSel),ty=fType||(fName.trim()?evtGuess(fName):"");
    p.innerHTML=`<div class="bpc rap qc calc"><div class="raph"><h3>Calendrier</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
      <div class="calnav"><button type="button" class="rhpm" data-m="-1" aria-label="Mois précédent">‹</button><b>${MOIS_L[m]} ${y}</b><button type="button" class="rhpm" data-m="1" aria-label="Mois suivant">›</button></div>
      <div class="calg">${"LMMJVSD".split("").map(x=>`<b>${x}</b>`).join("")}${cells}</div>
      <h4>${sd.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</h4>
      <div class="cale">${B.map(n=>`<div class="calev bdev">${pAv(n,"bdp")}<span class="bdtx"><span class="calty">Anniversaire</span><b></b></span><span class="bdck">${window.BDCAKE||""}</span></div>`).join("")}${E.map(e=>`<div class="calev" style="--ec:${evtOf(e.t||evtGuess(e.n))[2]}"><span class="calty">${evtOf(e.t||evtGuess(e.n))[1]}</span><b></b><button type="button" class="calrm" data-id="${e.id}" aria-label="Supprimer">${ICO("close",14)}</button></div>`).join("")}${!B.length&&!E.length?`<p class="hint vide">Aucun événement ce jour-là.</p>`:""}</div>
      ${calSel>=tk?`<h4>Ajouter</h4><input class="qcname calname" maxlength="40" placeholder="Ex. Concert de disiz, entretien chez…" aria-label="Nom de l'événement">
      <div class="qcdom calty2">${EVT.map(([k,l,c])=>`<button type="button" class="qchip sm" data-t="${k}" aria-pressed="${ty===k}" style="--zc:${c}"><i class="evti">${rkSvg(({concert:"micro",soiree:"cocktail",entretien:"laptop",examen:"notec",voyage:"valise",rdv:"calendrier",sport:"halteres"})[k]||"autre")}</i>${l==="Rendez-vous"?"RDV":l}</button>`).join("")}</div>
      ${ty==="concert"?`<input class="qcname calart" maxlength="40" placeholder="Quel artiste ?" aria-label="Artiste" list="calArts"><datalist id="calArts">${((G.taste&&G.taste.art)||[]).map(a=>`<option value="${esc(a)}">`).join("")}</datalist>`:""}
      <button type="button" class="btn primary qcgo caladd"${fName.trim()?"":" disabled"}>Ajouter au calendrier</button>
      <p class="hint calhint">Les jours d'avant et d'après, des quêtes « Pour toi » t'aident à le préparer${ty==="concert"?" : setlist, sac, trajet, souvenirs":""}.</p>`:""}</div>`;
    p.querySelectorAll(".cale .calev b").forEach((b,i)=>b.textContent=i<B.length?B[i]:E[i-B.length].n+(E[i-B.length].a?" · "+E[i-B.length].a:""));
    p.querySelector(".raclose").onclick=close;p.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{let[y2,m2]=calM;m2+= +b.dataset.m;if(m2<0){m2=11;y2--}if(m2>11){m2=0;y2++}calM=[y2,m2];draw()});
    p.querySelectorAll(".cald").forEach(b=>b.onclick=()=>{calSel=b.dataset.k;draw()});
    p.querySelectorAll(".calrm").forEach(b=>b.onclick=()=>{G.ev=G.ev.filter(e=>e.id!==b.dataset.id);save();toast("Événement retiré");draw()});
    const nm=p.querySelector(".calname");if(nm){nm.value=fName;nm.oninput=()=>{const was=evtGuess(fName);fName=nm.value;const go=p.querySelector(".caladd");go.disabled=!fName.trim();if(!fType&&evtGuess(fName)!==was){const pos=nm.selectionStart;draw();const n2=p.querySelector(".calname");n2.focus();n2.setSelectionRange(pos,pos)}}}
    const ar=p.querySelector(".calart");if(ar){ar.value=fArt;ar.oninput=()=>{fArt=ar.value}}
    p.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{fType=b.dataset.t;draw()});
    const go=p.querySelector(".caladd");if(go)go.onclick=()=>{const n=fName.trim();if(!n)return;const t=fType||evtGuess(n);let a=t==="concert"?fArt.trim():"";
      if(t==="concert"&&!a){const m=((G.taste&&G.taste.art)||[]).find(x=>n.toLowerCase().includes(x.toLowerCase()));if(m)a=m}
      G.ev.push({id:"e"+Date.now().toString(36),n:n.slice(0,40),d:calSel,xp:t==="concert"||t==="voyage"?30:20,t,...(a?{a:a.slice(0,40)}:{})});G.ev.sort((x,y)=>x.d<y.d?-1:1);fName="";fArt="";fType="";save();sfx("badge");toast("Ajouté au calendrier");draw()}};
  draw()}

// --- fiche de personnage

{const b=document.getElementById("actNew");if(b)b.onclick=()=>qcOpen("act")}
function dailyBonusCheck(){return;
  const tk=dayKey(Date.now()),T=ritTasks();
  if(!T.length||S.daily.bonusDay===tk||S.daily.day!==tk)return;
  if(!T.every(t=>(S.daily.c[t.id]||0)>=t.n))return;
  S.daily.bonusDay=tk;const prev=levelInfo(S.xp).l,B=S.dayBonus;
  addBonus("Journée parfaite",B.xp,0,"dayb");save();render(prev);
  setTimeout(()=>toast(`Journée parfaite ! <span class="p">+${B.xp} XP</span>`),500);
}
function ritRoll(){const tk=dayKey(Date.now());if(S.daily.day!==tk){S.daily.day=tk;S.daily.c={}}}
// ---- Rattrapage : cocher après coup les rituels des jours passés

function rtrSpan(){const y=dayKey(Date.now()-864e5),H=ritH()[y];return(H&&Object.keys(H).length)||S.log.some(e=>dayKey(e.t)===y)?1:2}
function rtrPending(){const G=S.g;if(!G)return[];if(!Array.isArray(G.rtr))G.rtr=[];const done=new Set(G.rtr),out=[],RD=rtrSpan();
  const T=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz);
  for(let i=1;i<=RD;i++){const d=new Date();d.setDate(d.getDate()-i);const k=dayKey(d);if(done.has(k))continue;
    const L=T.filter(t=>ritDays(t,i+1)[0]===0);if(L.length)out.push({k,i,L})}
  return out}
function rtrLab(i){return i===1?"Hier":i===2?"Avant-hier":"Il y a "+i+" jours"}
function rtrXp(t){const a=t.link&&S.actions.find(x=>x.name===t.link);return a?a.xp:RIT_XP}
function rtrCoreOk(k,i){const H=ritH()[k]||{},T=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritDays(t,i+1)[0]!==-1),C=T.filter(t=>t.core),X=C.length?C:T;return X.length>0&&X.every(t=>H[t.id])}
function renderRtr(){const box=$("rtrBox");if(!box||!S.g)return;const P=rtrPending();
  if(!P.length){if(!box.classList.contains("voff")){box.classList.add("voff");box.innerHTML="";box.__h=""}return}
  const n=P.reduce((a,p)=>a+p.L.length,0),lab=P.length===1?rtrLab(P[0].i).toLowerCase():"ces derniers jours";
  const seen=new Set(),IC=[];P.forEach(p=>p.L.forEach(t=>{if(seen.has(t.id)||IC.length>=5)return;seen.add(t.id);try{const K=ritKind(t);IC.push(rkSvg(K.k,K.c))}catch(e){}}));
  const h=`<div class="rtrs"><span class="rtri">${IC.map(x=>`<i>${x}</i>`).join("")}</span><span class="rtrt"><b>${n}</b> à rattraper</span><button type="button" class="btn rtrgo1">Fait</button><button type="button" class="rtrno" aria-label="Non, je ne les ai pas faits" title="Non, je ne les ai pas faits">${ICO("close",14)}</button></div>`;
  if(box.__h!==h){box.__h=h;box.innerHTML=h;box.querySelector(".rtrgo1").onclick=()=>rtrOpen();box.querySelector(".rtrno").onclick=()=>{P.forEach(p=>S.g.rtr.push(p.k));S.g.rtr=S.g.rtr.slice(-30);save();render()}}
  box.classList.remove("voff")}
function rtrOpen(){const P=rtrPending();if(!P.length)return;const sel=new Set();
  const o=document.createElement("div");o.className="bpop rapop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Rattrapage");document.body.appendChild(o);
  const close=()=>{o.remove();render()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const tot=P.reduce((a,p)=>a+p.L.filter(t=>sel.has(p.k+"|"+t.id)).reduce((b,t)=>b+rtrXp(t),0),0),cnt=sel.size,all=P.every(p=>p.L.every(t=>sel.has(p.k+"|"+t.id)));
    o.innerHTML=`<div class="bpc rap rtrp"><div class="raph"><h3>Rattrapage</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
    <p class="rtrhint">Touche ce que tu as fait.</p>
    ${P.map(p=>`<h4 class="rtrday">${rtrLab(p.i)} · ${p.L.length}</h4><ul class="rtrl">${p.L.map(t=>`<li><button type="button" class="rtrt" data-k="${p.k}|${t.id}" aria-pressed="${sel.has(p.k+"|"+t.id)}"><i>${ICO("check",16)}</i><span></span><small>${ritPer(t)==="soir"?"Soir":"Matin"}</small><em>+${rtrXp(t)} XP</em></button></li>`).join("")}</ul>`).join("")}
    <button type="button" class="rtrall">${all?"Tout décocher":"J'ai tout fait"}</button>
    <button type="button" class="btn primary rtrgo">${cnt?"Valider "+cnt+" rituel"+(cnt>1?"s":"")+" · +"+tot+" XP":"Je n'ai rien fait de plus"}</button></div>`;
    o.querySelectorAll(".rtrt").forEach(b=>{const [k,id]=b.dataset.k.split("|"),t=ritTasks().find(x=>x.id===id);b.querySelector("span").textContent=t?t.name:id;b.onclick=()=>{const key=b.dataset.k;sel.has(key)?sel.delete(key):sel.add(key);draw()}});
    o.querySelector(".raclose").onclick=close;
    o.querySelector(".rtrall").onclick=()=>{if(all)sel.clear();else P.forEach(p=>p.L.forEach(t=>sel.add(p.k+"|"+t.id)));draw()};
    o.querySelector(".rtrgo").onclick=()=>rtrSave(P,sel,o)};
  draw()}
function rtrSave(P,sel,o){const G=S.g,H=ritH(),prev=levelInfo(S.xp).l;let xp=0,n=0;const before=ritStreak();
  if(!Array.isArray(G.rcore))G.rcore=[];
  P.forEach(p=>{p.L.forEach(t=>{if(!sel.has(p.k+"|"+t.id))return;if(!H[p.k])H[p.k]={};H[p.k][t.id]=1;xp+=rtrXp(t);n++});
    if(!G.rcore.includes(p.k)&&rtrCoreOk(p.k,p.i)){G.rcore.push(p.k);G.rcore.sort()}
    if(p.L.some(t=>sel.has(p.k+"|"+t.id))&&!S.days.includes(p.k)){S.days.push(p.k);S.days.sort()}
    G.rtr.push(p.k)});
  G.rtr=G.rtr.slice(-30);
  if(xp)addBonus(`Rattrapage : ${n} rituel${n>1?"s":""}`,xp,0,"rtr");
  ritAncCheck&&ritAncCheck();
  o.remove();save();render(prev);const after=ritStreak();
  toast(n?`Rattrapage noté <span class="p">+${xp} XP</span>`+(after>before?` · série de ${after} jour${after>1?"s":""}`:""):"C'est noté. On repart sur aujourd'hui.")}

let ritLeaving="";
function ritTap(t,el,ev){
  ritRoll();const tk=dayKey(Date.now()),c=S.daily.c[t.id]||0;if(c>=t.n)return;S.daily.c[t.id]=c+1;window.__ritCtx={id:t.id,c,t:Date.now()};if(c+1>=t.n&&!t.bar){ritMark(t.id,1);const G=S.g;if(!G.rto||typeof G.rto!=="object")G.rto={};const ar=G.rto[t.id]||(G.rto[t.id]=[]);ar.push(Math.round(dayH()*60));if(ar.length>9)ar.shift()}
  if(c+1>=t.n&&!t.bar){ritLeaving=t.id;clearTimeout(window.__rlT);window.__rlT=setTimeout(()=>{ritLeaving="";renderRituals();renderLife()},450)}
  const a=t.link&&S.actions.find(x=>x.name===t.link);
  if(a&&!(S.dayLimit&&!BARS[a.cat]&&S.log.filter(e=>e.a===a.id&&dayKey(e.t)===tk).length>=S.dayLimit)){complete(a,el,ev)}else if(a&&!t.bar&&c+1>=t.n){noXp({...a},el,ev)}else if(!a&&!t.bar&&c+1>=t.n){complete({id:"rit-"+t.id,cat:/pompe|squat|gainage/i.test(t.name)?"sport":"maison",name:t.name,xp:RIT_XP},el,ev)}else{save();render()}
  dailyBonusCheck()}
const RIT_XP=3;
function renderRituals(){setTimeout(()=>{window.__ritWas=!!document.querySelector("#ritLife")&&!!document.querySelector(".ritdone")},0);
  ritRoll();const tk=dayKey(Date.now());
  const T=ritTasks(),box=$("ritList"),busy=box.contains(document.activeElement)&&document.activeElement.tagName==="INPUT";if(!busy)box.innerHTML="";let done=0;
  const mkRow=t=>{
    const c=Math.min(t.n,S.daily.c[t.id]||0),full=c>=t.n;
    const r=document.createElement("div");r.className="rt"+(full?" full":"");
    r.innerHTML=`<button class="rtb" type="button"><span></span><span class="dots${t.n>5?" many":""}">${Array.from({length:t.n},(_,i)=>`<i class="${i<c?"on":""}"></i>`).join("")}</span></button>${c?'<button class="rtr" type="button" aria-label="Remettre à zéro">'+ICO("reset",16)+'</button>':""}`;
    r.querySelector("span").textContent=t.name;
    r.querySelector(".rtb").onclick=ev=>ritTap(t,ev.currentTarget,ev);
    const rr=r.querySelector(".rtr");if(rr)rr.onclick=()=>{S.daily.c[t.id]=0;ritMark(t.id,0,1);save();render()};
    return r};
  T.forEach(t=>{if((S.daily.c[t.id]||0)>=t.n)done++});
  if(!busy){
    const allDone=T.length>0&&T.every(t=>(S.daily.c[t.id]||0)>=t.n)&&!ritLeaving;
    
    box.classList.toggle("alldone",allDone);let host=box;
    if(allDone){const b=document.createElement("div");b.className="ritdone"+(window.__ritWas===false?" fresh":"");b.innerHTML='<div class="rdh">'+ICO("check",24)+"<div><b>Tu as accompli ta journée !</b><small>Tous tes rituels sont faits. À demain.</small></div></div>";box.appendChild(b);host=b}
    else MOMENTS.forEach(([k,lab])=>{const g=T.filter(t=>!t.bar&&(t.when||"jour")===k);const left=g.filter(t=>(S.daily.c[t.id]||0)<t.n||t.id===ritLeaving);if(!left.length)return;
      const nd=g.filter(t=>(S.daily.c[t.id]||0)>=t.n).length;
      const h=document.createElement("div");h.className="rth";h.innerHTML=`<span></span><em>${nd}/${g.length}</em>`;h.firstChild.textContent=lab;box.appendChild(h);
      left.forEach(t=>{const r=mkRow(t);if(t.id===ritLeaving)r.classList.add("leaving");box.appendChild(r)})});
  }
  $("ritCnt").textContent=done+"/"+T.length;
  if(document.activeElement!==$("dbXp"))$("dbXp").value=S.dayBonus.xp;if(document.activeElement!==$("dbEur"))$("dbEur").value=S.dayBonus.eur;
}
$("dbXp").onchange=()=>{S.dayBonus.xp=Math.max(0,Math.round(+$("dbXp").value)||0);save()};$("dbEur").onchange=()=>{S.dayBonus.eur=Math.max(0,Math.round((+$("dbEur").value||0)*100)/100);save()};
$("ritEdOpen").onclick=()=>ritAtelier();

