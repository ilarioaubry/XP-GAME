// ===== Calendrier (refonte du 03/11) : Moi > Ma vie, juste sous la fiche profil.
// Une grille de deux semaines dit d'un coup d'œil ce qui est prévu : travail et périodes (bande en bas de la case),
// événements et anniversaires (icône), nombre de quêtes du jour (petits carrés or). Les quêtes s'adaptent à ces jours (vieDay).
// Toucher un jour ou « + » ouvre le calendrier en plein écran : le mois, le détail du jour, ajouter un événement ou une période.
Object.assign(RKI,{cake:["................",".......y........","......yYy.......",".......y........",".......w........","...oooooooooo...","..ommmmmmmmmmo..","..omwmmmmmmMmo..","..oMmMmMmMmMMo..","..onnnnnnnnnNo..","..onwnnnnnnnNo..","..ommmmmmmmmMo..","..onnnnnnnnnNo..","..oNNNNNNNNNNo..",".oWWWWWWWWWWWWo.","..oooooooooooo.."]});
const CAL_MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const CAL_MC=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const CAL_EVI={concert:"micro",soiree:"cocktail",entretien:"laptop",examen:"notec",voyage:"valise",rdv:"calendrier",sport:"halteres",mariage:"bague",naissance:"cadeau",demenage:"maisonp",medical:"sante",dur:"coeur",autre:"etoile"};
const CAL_PER=[["contrat","Contrat","chantier","#6f8fe0"],["vacances","Vacances","valise","#3cc0f0"],["malade","Malade","sante","#6fd0b0"],["examens","Examens","notec","#ffc94a"],["demenagement","Déménagement","maisonp","#c98a4a"],["autre","Autre","autre","#aab4bd"]];
const calPer=t=>CAL_PER.find(x=>x[0]===t)||CAL_PER[5];
const calK=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const calD=k=>new Date(k+"T12:00");
const calAdd=(k,n)=>{const d=calD(k);d.setDate(d.getDate()+n);return calK(d)};
const calDiff=(a,b)=>Math.round((calD(b)-calD(a))/864e5);
// tout ce qui tombe un jour donné
function calItems(k){const G=S.g,tk=dayKey(Date.now()),dt=calD(k),out=[];
  relNames().forEach(n=>{const b=(S.profiles[n]||{}).bd;if(b&&b.d===dt.getDate()&&b.m===dt.getMonth()+1)out.push({k:"bd",id:"bd:"+n,who:n,n:"Anniversaire de "+n,ic:"cake"})});
  let s=null;try{s=sitOf()}catch(e){}
  if(s){const md=(o,id,n,ic)=>{if(o&&o.d===dt.getDate()&&o.m===dt.getMonth()+1)out.push({k:"me",id,n:o.y&&dt.getFullYear()>o.y?n+" · "+(dt.getFullYear()-o.y)+" ans":n,ic})};
    md(s.bd,"me:bd","Ton anniversaire","cake");if(s.cpl&&s.cpl!=="celib")md(s.cpld,"me:cpl",s.cpl==="marie"?"Anniversaire de mariage":"Anniversaire de couple","coeur")}
  const E=(Array.isArray(G.ev)?G.ev:[]).concat(k<tk&&Array.isArray(G.evArc)?G.evArc.filter(a=>!(G.ev||[]).some(e=>e.id===a.id)):[]);
  E.filter(e=>e.d===k).forEach(e=>{const t=e.t||evtGuess(e.n);out.push({k:"ev",id:e.id,n:e.n+(e.a?" · "+e.a:""),ic:CAL_EVI[t]||"etoile",t,xp:e.xp,done:(S.log||[]).some(l=>l.evd===e.id),e})});
  // « La dernière fois que… » : le jour où le rappel revient (en retard = aujourd'hui)
  if(k>=tk&&typeof rappelsDus==="function")rappelsDus().filter(o=>o.d===k).forEach(o=>out.push({k:"last",id:o.x.id,n:o.x.name,ic:"maisonp",late:o.late}));
  return out}
function calPers(k){return(S.g.per||[]).filter(p=>p.s<=k&&k<=p.e)}
// une case de jour (grille de la page et grille du mois)
function calCell(k,tk,sel,out){const it=calItems(k),P=calPers(k),d=typeof vieDay==="function"?vieDay(k):{cap:0,work:false},pr=P.find(p=>p.t!=="contrat")||P[0],
    band=pr&&(pr.t!=="contrat"||d.work)?calPer(pr.t)[3]:d.work?calPer("contrat")[3]:"",dt=calD(k),lab=`${dt.getDate()} ${CAL_MOIS[dt.getMonth()]}`+(it.length?", "+it.map(x=>x.n).join(", "):"")+(pr?", "+(pr.name||calPer(pr.t)[1]):d.work?", travail":"")+(k>=tk?`, ${d.cap} quête${d.cap>1?"s":""}`:"");
  return`<button type="button" class="cal-j${k<tk?" passe":""}${k===tk?" auj":""}${k===sel?" sel":""}${out?" hors":""}" data-k="${k}" aria-label="${esc(lab)}"${k===sel?' aria-pressed="true"':""}>
    <span class="cal-n">${dt.getDate()}</span><span class="cal-i">${it.length?rkSvg(it[0].ic):""}${it.length>1?`<em>+${it.length-1}</em>`:""}</span>
    ${k>=tk?`<span class="cal-q">${Array.from({length:d.cap},()=>"<i></i>").join("")}</span>`:`<span class="cal-q"></span>`}${band?`<i class="cal-b" style="--b:${band}"></i>`:""}</button>`}
const CAL_JS="LMMJVSD".split("");
// ---- la section de la page
function renderEvents(){const box=$("calBox");if(!box||!S||!S.g)return;const G=S.g;if(!Array.isArray(G.ev))G.ev=[];let L=[];try{L=evList()}catch(e){}
  const tk=dayKey(Date.now()),now=calD(tk),mon=calAdd(tk,-((now.getDay()+6)%7)),days=Array.from({length:14},(_,i)=>calAdd(mon,i));
  // à venir : périodes en cours, puis événements, anniversaires et mes dates des 30 prochains jours
  const R=[];
  (G.per||[]).filter(p=>p.s<=tk&&tk<=p.e).forEach(p=>{const st=typeof viePerStat==="function"?viePerStat(p,tk):null;R.push({k:"per",p,d:p.e,inD:calDiff(tk,p.e),st})});
  (G.per||[]).filter(p=>p.s>tk&&calDiff(tk,p.s)<=30).forEach(p=>R.push({k:"perv",p,d:p.s,inD:calDiff(tk,p.s)}));
  L.concat(myDates()).filter(e=>e.inD>=0&&e.inD<=30||e.k==="ev"&&e.inD===-1&&!e.done).forEach(e=>R.push({...e,d:calK(e.dt)}));
  if(typeof rappelsDus==="function")rappelsDus().filter(o=>calDiff(tk,o.d)<=7).forEach(o=>R.push({k:"last",id:o.x.id,n:o.x.name,d:o.d,inD:calDiff(tk,o.d),late:o.late}));
  R.sort((a,b)=>(a.k==="per"?-1:0)-(b.k==="per"?-1:0)||a.inD-b.inD);
  const cd=n=>n<0?"Hier":n===0?"Aujourd'hui":n===1?"Demain":"Dans "+n+" jours";
  const row=(x,i)=>{const dt=calD(x.d);let ic="",t="",sub="",act="",bar="";
    if(x.k==="per"||x.k==="perv"){const P=calPer(x.p.t);ic=`<span class="cal-ri" style="--b:${P[3]}">${rkSvg(P[2])}</span>`;t=x.p.name||P[1];
      if(x.k==="per"&&x.st){sub=`Jour ${Math.max(1,x.st.done)} sur ${x.st.tot}`;bar=`<span class="ui-barre cal-pb"><i style="width:${x.st.pct}%;background:${P[3]}"></i></span>`}else sub=cd(x.inD)}
    else{ic=x.k==="bd"?`<span class="cal-ri">${pAv(x.who,"cal-av")}</span>`:`<span class="cal-ri">${rkSvg(x.k==="me"?x.ic:CAL_EVI[(G.ev.find(e=>e.id===x.id)||{}).t||evtGuess(x.n)]||"etoile")}</span>`;t=x.n;sub=x.k==="last"?(x.late?"À refaire":"À refaire · "+cd(x.inD).toLowerCase()):cd(x.inD);if(x.k==="last")ic=`<span class="cal-ri">${rkSvg("maisonp")}</span>`;
      if(x.k==="last")act=`<button type="button" class="ui-btn ui-btn--icone" data-ld="${x.id}" aria-label="Fait : ${esc(x.n)}" title="Fait">${ICO("check",24)}</button>`;
      else if(x.k==="ev"&&x.done)act=`<span class="cal-ok">${ICO("check",24)}</span>`;
      else if(x.k==="ev"&&x.inD<=0)act=`<button type="button" class="ui-btn ui-btn--principal" data-go="${i}">+${x.xp} XP</button>`;
      else if(x.k==="bd"){const gs=x.inD<=GIFT_DAYS?gfState(x.who):null;if(x.inD===0&&x.q)act=`<button type="button" class="ui-btn ui-btn--principal" data-go="${i}">+${x.q.xp} XP</button>`;else if(gs&&!gs.given)act=`<button type="button" class="ui-btn ui-btn--icone" data-gf="${i}" aria-label="Cadeau pour ${esc(x.who)}" title="Cadeau">${rkSvg("cadeau")}</button>`}}
    return`<div class="cal-r${x.inD===0||x.k==="per"?" now":""}"><button type="button" class="cal-rm" data-k="${x.k==="per"?tk:x.d}"><span class="cal-rd">${x.k==="per"?`<small>fin</small>`:""}<b>${dt.getDate()}</b><small>${CAL_MC[dt.getMonth()]}</small></span>${ic}<span class="cal-rt"><b></b><small>${sub}</small>${bar}</span></button>${act}</div>`};
  const show=R.slice(0,5);
  box.innerHTML=`<div class="ui-entete"><h2 class="ui-titre">Calendrier</h2><button type="button" class="ui-btn ui-btn--icone" id="calAdd" aria-label="Ajouter au calendrier" title="Ajouter">${ICO("plus",24)}</button></div>
    <div class="cal-g cal-g2"><span class="cal-js">${CAL_JS.map(x=>`<b>${x}</b>`).join("")}</span>${days.map(k=>calCell(k,tk,tk)).join("")}</div>
    ${show.length?`<div class="cal-l">${show.map(row).join("")}</div>`:`<p class="ui-vide">Rien de prévu pour l'instant.</p>`}`;
  box.querySelectorAll(".cal-rt b").forEach((b,i)=>{const x=show[i];b.textContent=x.k==="per"||x.k==="perv"?(x.p.name||calPer(x.p.t)[1]):x.n});
  $("calAdd").onclick=()=>calOpen();
  box.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>calOpen(b.dataset.k));
  box.querySelectorAll("[data-ld]").forEach(b=>b.onclick=()=>rappelFait(b.dataset.ld));
  box.querySelectorAll("[data-go]").forEach(b=>b.onclick=ev=>{const x=show[+b.dataset.go];if(x.k==="bd"){completeSpecial(x.q,b,ev);return}
    S.xp+=x.xp;S.log.push({a:"bonus",cat:null,name:x.n,xp:x.xp,t:Date.now(),bonus:1,evd:x.id});floatXp(x.xp,ev,b);save();render();renderEvents();toast(`Événement : <span class="p">${esc(x.n)}</span> +${x.xp} XP`)});
  box.querySelectorAll("[data-gf]").forEach(b=>b.onclick=()=>{const x=show[+b.dataset.gf],gk=x.who+":"+x.dt.getFullYear();
    gfOpen(null,x.who,ev=>{S.xp+=GIFT_XP;S.log.push({a:"bonus",cat:null,name:"Cadeau pour "+x.who,xp:GIFT_XP,t:Date.now(),bonus:1,gift:gk});floatXp(GIFT_XP,ev,b);save();render();renderEvents();toast(`Cadeau acheté pour <span class="p">${esc(x.who)}</span> +${GIFT_XP} XP`)})});
}
// ---- le calendrier en plein écran
let calM=null,calSel=null;
function calOpen(day){if(document.querySelector(".calw"))return;const G=S.g;if(!Array.isArray(G.ev))G.ev=[];if(!Array.isArray(G.per))G.per=[];const tk=dayKey(Date.now());calSel=day||tk;{const d0=calD(calSel);calM=[d0.getFullYear(),d0.getMonth()]}
  let fType="",fName="",fArt="",fEnd="",pEdit=null;
  const w=document.createElement("div");w.className="ui-plein calw";w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");w.setAttribute("aria-label","Calendrier");
  w.innerHTML=`<div class="ui-plein__haut"><h2 class="ui-plein__titre">Calendrier</h2><button type="button" class="ui-btn ui-btn--icone calx" aria-label="Fermer" title="Fermer">${ICO("close",24)}</button></div><div class="ui-plein__corps"></div><div class="ui-plein__bas"><button type="button" class="ui-btn calno">Fermer</button><button type="button" class="ui-btn ui-btn--principal calgo">Ajouter</button></div>`;
  document.body.appendChild(w);const C=w.querySelector(".ui-plein__corps"),go=w.querySelector(".calgo");
  const close=()=>{w.remove();try{render()}catch(e){}renderEvents()};w.querySelector(".calx").onclick=close;w.querySelector(".calno").onclick=close;
  const isPer=()=>CAL_PER.some(p=>p[0]===fType);
  const ty=()=>fType||(fName.trim()?evtGuess(fName):"");
  const canAdd=()=>calSel>=tk&&(isPer()?(!fEnd||fEnd>=calSel):!!fName.trim());
  const sync=()=>{const t=ty();C.querySelectorAll("[data-t]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t===t));go.disabled=!canAdd();go.hidden=calSel<tk;
    const a=C.querySelector(".calart");if(a)a.hidden=t!=="concert";const e=C.querySelector(".calend");if(e)e.hidden=!isPer();const nm=C.querySelector(".calname");if(nm)nm.placeholder=isPer()?calPer(fType)[1]:"Ex. Concert, entretien, dentiste…"};
  const draw=()=>{const[y,m]=calM,first=new Date(y,m,1,12),off=(first.getDay()+6)%7,start=calAdd(calK(first),-off),dim=new Date(y,m+1,0).getDate(),weeks=Math.ceil((off+dim)/7);
    const cells=Array.from({length:weeks*7},(_,i)=>{const k=calAdd(start,i);return calCell(k,tk,calSel,calD(k).getMonth()!==m)}).join("");
    const sd=calD(calSel),it=calItems(calSel),P=calPers(calSel),d=vieDay(calSel);
    const tags=[];if(P.length)P.forEach(p=>{const X=calPer(p.t);tags.push(`<span class="cal-tag" style="--b:${X[3]}">${rkSvg(X[2])}<span></span></span>`)});else if(d.work)tags.push(`<span class="cal-tag" style="--b:${calPer("contrat")[3]}">${rkSvg("laptop")}<span>Travail</span></span>`);
    if(calSel>=tk)tags.push(`<span class="cal-tag cal-tq"><span class="cal-q">${Array.from({length:d.cap},()=>"<i></i>").join("")}</span><span>${d.cap} quête${d.cap>1?"s":""}</span></span>`);
    C.innerHTML=`<div class="cal-nav"><button type="button" class="ui-btn ui-btn--icone" data-m="-1" aria-label="Mois précédent" title="Mois précédent"><span class="cal-chg">${ICO("chev",24)}</span></button><b>${CAL_MOIS[m]} ${y}</b><button type="button" class="ui-btn ui-btn--icone" data-m="1" aria-label="Mois suivant" title="Mois suivant"><span class="cal-chd">${ICO("chev",24)}</span></button></div>
      <div class="cal-g"><span class="cal-js">${CAL_JS.map(x=>`<b>${x}</b>`).join("")}</span>${cells}</div>
      <h3 class="cal-jt">${sd.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</h3>
      ${tags.length?`<div class="cal-tags">${tags.join("")}</div>`:""}
      <div class="cal-l">${P.map((p,i)=>pEdit===p.id?`<div class="cal-pe"><input class="ui-champ" data-pn maxlength="40" aria-label="Nom de la période"><div class="cal-two"><label class="ui-info">Du<input class="ui-champ" type="date" data-ps value="${p.s}"></label><label class="ui-info">Au<input class="ui-champ" type="date" data-pe value="${p.e}"></label></div><div class="cal-two"><button type="button" class="ui-btn" data-pdel aria-label="Supprimer la période">${ICO("trash",24)}</button><button type="button" class="ui-btn ui-btn--principal" data-pok>Enregistrer</button></div></div>`
        :`<div class="cal-r"><button type="button" class="cal-rm" data-pr="${p.id}"><span class="cal-ri" style="--b:${calPer(p.t)[3]}">${rkSvg(calPer(p.t)[2])}</span><span class="cal-rt"><b data-pi="${i}"></b><small>${calD(p.s).getDate()} ${CAL_MC[calD(p.s).getMonth()]} → ${calD(p.e).getDate()} ${CAL_MC[calD(p.e).getMonth()]}</small></span></button><button type="button" class="ui-btn ui-btn--icone" data-pe2="${p.id}" aria-label="Modifier la période" title="Modifier">${ICO("edit",24)}</button></div>`).join("")}
        ${it.map((x,i)=>`<div class="cal-r"><span class="cal-rm"><span class="cal-ri">${x.k==="bd"?pAv(x.who,"cal-av"):rkSvg(x.ic)}</span><span class="cal-rt"><b data-ii="${i}"></b><small>${x.k==="bd"?"Anniversaire":x.k==="me"?"Ta date":x.k==="last"?"À refaire":evtOf(x.t)[1]}</small></span></span>${x.k==="last"?`<button type="button" class="ui-btn ui-btn--icone" data-ld="${x.id}" aria-label="Fait : ${esc(x.n)}" title="Fait">${ICO("check",24)}</button>`:x.k==="ev"&&!x.done&&G.ev.some(e=>e.id===x.id)?`<button type="button" class="ui-btn ui-btn--icone" data-rm="${x.id}" aria-label="Supprimer l'événement" title="Supprimer">${ICO("trash",24)}</button>`:x.done?`<span class="cal-ok">${ICO("check",24)}</span>`:""}</div>`).join("")}
        ${!P.length&&!it.length?`<p class="ui-vide">Rien de prévu ce jour-là.</p>`:""}</div>
      ${calSel>=tk?`<div class="cal-add"><input class="ui-champ calname" maxlength="40" aria-label="Nom" autocomplete="off">
        <input class="ui-champ calart" maxlength="40" placeholder="Quel artiste ?" aria-label="Artiste" list="calArts" hidden><datalist id="calArts">${((G.taste&&G.taste.art)||[]).map(a=>`<option value="${esc(a)}">`).join("")}</datalist>
        <div class="cal-ty">${EVT.map(([k,l])=>`<button type="button" class="cal-t" data-t="${k}" aria-pressed="false">${rkSvg(CAL_EVI[k]||"etoile")}<span>${l==="Rendez-vous"?"RDV":l==="Moment dur"?"Dur":l}</span></button>`).join("")}</div>
        <small class="ui-info cal-sg">Plusieurs jours</small>
        <div class="cal-ty">${CAL_PER.slice(0,5).map(([k,l,ic,c])=>`<button type="button" class="cal-t cal-tp" data-t="${k}" aria-pressed="false" style="--b:${c}">${rkSvg(ic)}<span>${l==="Déménagement"?"Déménag.":l}</span></button>`).join("")}</div>
        <label class="ui-info calend" hidden>Jusqu'au<input class="ui-champ" type="date" data-end min="${calSel}" value="${fEnd}"></label></div>`:""}`;
    C.querySelectorAll("[data-pi]").forEach(b=>{const p=P[+b.dataset.pi];b.textContent=p.name||calPer(p.t)[1]});C.querySelectorAll("[data-ii]").forEach(b=>b.textContent=it[+b.dataset.ii].n);
    C.querySelectorAll(".cal-tag:not(.cal-tq)>span:last-child:empty").forEach((s,i)=>s.textContent=P[i]?P[i].name||calPer(P[i].t)[1]:"");
    C.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{let[y2,m2]=calM;m2+= +b.dataset.m;if(m2<0){m2=11;y2--}if(m2>11){m2=0;y2++}calM=[y2,m2];draw()});
    C.querySelectorAll(".cal-j").forEach(b=>b.onclick=()=>{calSel=b.dataset.k;pEdit=null;if(fEnd&&fEnd<calSel)fEnd="";const d1=calD(calSel);calM=[d1.getFullYear(),d1.getMonth()];draw()});
    C.querySelectorAll("[data-ld]").forEach(b=>b.onclick=()=>{rappelFait(b.dataset.ld);draw()});
    C.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{const id=b.dataset.rm;undoAfter("Événement supprimé",()=>{G.ev=G.ev.filter(e=>e.id!==id);save();draw()})});
    C.querySelectorAll("[data-pr],[data-pe2]").forEach(b=>b.onclick=()=>{pEdit=b.dataset.pr||b.dataset.pe2;draw()});
    const pe=C.querySelector(".cal-pe");if(pe){const p=G.per.find(x=>x.id===pEdit),n=pe.querySelector("[data-pn]");n.value=p.name||"";
      pe.querySelector("[data-pok]").onclick=()=>{const s=pe.querySelector("[data-ps]").value,e=pe.querySelector("[data-pe]").value;if(!s||!e||e<s){try{toast("La fin doit venir après le début")}catch(_){}return}p.name=n.value.trim()||calPer(p.t)[1];p.s=s;p.e=e;pEdit=null;save();draw()};
      pe.querySelector("[data-pdel]").onclick=()=>{const id=p.id;pEdit=null;undoAfter("Période supprimée",()=>{G.per=G.per.filter(x=>x.id!==id);save();draw()})}}
    const nm=C.querySelector(".calname");if(nm){nm.value=fName;nm.oninput=()=>{fName=nm.value;sync()}}
    const ar=C.querySelector(".calart");if(ar){ar.value=fArt;ar.oninput=()=>{fArt=ar.value}}
    const en=C.querySelector("[data-end]");if(en)en.onchange=()=>{fEnd=en.value;sync()};
    C.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{fType=fType===b.dataset.t?"":b.dataset.t;if(isPer()&&!fEnd){fEnd=calAdd(calSel,fType==="contrat"?27:fType==="vacances"?6:2);const e2=C.querySelector("[data-end]");if(e2)e2.value=fEnd}sync()});
    sync()};
  go.onclick=()=>{if(!canAdd())return;const n=fName.trim();
    if(isPer()){const e=fEnd&&fEnd>=calSel?fEnd:calSel;G.per.push({id:"p"+Date.now().toString(36),t:fType,name:(n||calPer(fType)[1]).slice(0,40),s:calSel,e,wd:fType==="contrat"});try{sfx("badge")}catch(_){}toast("Période ajoutée")}
    else{const t=fType||evtGuess(n);let a=t==="concert"?fArt.trim():"";if(t==="concert"&&!a){const m=((G.taste&&G.taste.art)||[]).find(x=>n.toLowerCase().includes(x.toLowerCase()));if(m)a=m}
      G.ev.push({id:"e"+Date.now().toString(36),n:n.slice(0,40),d:calSel,xp:t==="concert"||t==="voyage"?30:20,t,...(a?{a:a.slice(0,40)}:{})});G.ev.sort((x,y)=>x.d<y.d?-1:1);try{sfx("badge")}catch(_){}toast("Ajouté au calendrier")}
    fName="";fArt="";fType="";fEnd="";save();draw()};
  draw()}
