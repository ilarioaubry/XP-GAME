// ===== Nouveau Bilan : ta semaine comme un chapitre
let bilTab="w",bilOff=0,bilDet=false,bilEdit=false;
const GOAL_CAT={job:["travail"],forme:["sport"],potes:["social"],famille:["famille"],son:["perso"],apprendre:["perso"],chez:["maison"],manger:["nourriture"],argent:["maison","travail"],ecrans:["soi"],moral:["soi"],sommeil:[]};
const GOAL_INT={job:"Envoyer 5 candidatures",forme:"3 séances de sport",sommeil:"Au lit avant minuit, 5 soirs",ecrans:"Pas d'écran au lit",potes:"Voir un pote en vrai",famille:"Appeler un proche 3 fois",son:"3 séances de son",argent:"Noter chaque dépense",apprendre:"20 min d'apprentissage par jour",chez:"Ranger une zone par jour",moral:"Un moment rien que pour toi chaque jour",manger:"Un vrai repas maison chaque soir"};
const CHAP_CAT={sport:"La semaine du sport",social:"La semaine des potes",famille:"La semaine en famille",maison:"La semaine du grand rangement",soi:"La semaine pour toi",perso:"La semaine du son",travail:"La semaine au travail",nourriture:"La semaine aux fourneaux"};
const JOURS=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"],MOIS_C=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function wxRec(){const G=S.g;if(!G)return;const c=G.wxc;if(!c||!c.td||!c.td.d)return;if(!G.wxh||typeof G.wxh!=="object")G.wxh={};const o=G.wxh[c.td.d];if(!o||o.ic!==c.td.ic)G.wxh[c.td.d]={ic:c.td.ic,mx:c.td.max};const ks=Object.keys(G.wxh).sort();while(ks.length>400)delete G.wxh[ks.shift()]}
const bXp=k=>((S.g.hist||{})[k]||{}).x||0,bCat=k=>((S.g.hist||{})[k]||{}).c||{};
function bWeek(off){const d=new Date(dayKey(Date.now())+"T12:00");d.setDate(d.getDate()-7*off);return wkKeys(dayKey(d))}

function evArc(){const G=S.g;return[...(Array.isArray(G.evArc)?G.evArc:[]),...(Array.isArray(G.ev)?G.ev:[])]}
function bRit(K){const tk=dayKey(Date.now()),T=ritTasks().filter(t=>!t.bar&&!t.auto),rh=S.g.rh||{};let due=0,ok=0;
  const rows=T.slice().sort((a,b)=>(ritPer(a)==="soir")-(ritPer(b)==="soir")).map(t=>{const ct=t.ct?dayKey(t.ct):"";return{t,c:K.map((k,i)=>{if(k>tk)return"f";if(ct&&k<ct)return"n";const done=!!(rh[k]||{})[t.id];if(t.pz&&k>=t.pz)return done?"d":"n";
    const sched=Array.isArray(t.wd)&&t.wd.length?t.wd.includes(wdOf(k)):!(t.xw||t.ev>1);if(done){ok++;due++;return"d"}if(!sched)return"o";if(k===tk)return"t";due++;return"m"})}}).filter(r=>r.c.some(x=>x!=="n"&&x!=="f"));
  return{rows,pct:due?Math.round(ok/due*100):0,due}}
function bChapAuto(K){const G=S.g,tk=dayKey(Date.now()),xp=K.reduce((a,k)=>a+bXp(k),0),past=K.filter(k=>k<=tk);
  const ev=evArc().filter(e=>K.includes(e.d)&&e.d<=tk);let t;if(ev.length)t="La semaine "+evTitle(ev[0].n);
  else if(xp<100)t="Une semaine au calme";else{const c={};K.forEach(k=>Object.entries(bCat(k)).forEach(([a,v])=>{if(a!=="eau")c[a]=(c[a]||0)+v}));const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];t=top&&CHAP_CAT[top[0]]||"Une semaine bien remplie"}
  const best=past.slice().sort((a,b)=>bXp(b)-bXp(a))[0],R=bRit(K),sl=past.map(k=>(G.sleep||{})[k]).filter(x=>x&&x.h),md=past.map(k=>(G.mood||{})[k]).filter(Boolean);
  const avs=sl.length?sl.reduce((a,x)=>a+ +x.h,0)/sl.length:0,avm=md.length?md.reduce((a,b)=>a+b,0)/md.length:0;
  const L=[`${xp} XP${best&&bXp(best)?` · meilleur jour : ${JOURS[wdOf(best)]}`:""}`,R.due?`Rituels : ${R.pct} %${ritStreak()&&K.includes(tk)?` · essentiels ${ritStreak()} j`:""}`:"Pas encore de rituels suivis",[avs?`nuits de ${hFmt(avs)}`:"",(()=>{const m=K.reduce((a,k)=>a+((G.nap||{})[k]||0),0);return m?`siestes ${m>=60?hFmt(m/60):m+" min"}`:""})(),avm?`humeur ${MOODS[Math.round(avm)-1][1].toLowerCase()}`:""].filter(Boolean).join(" · ")].filter(Boolean);
  if(L[2])L[2]=L[2].charAt(0).toUpperCase()+L[2].slice(1);return{t,l:L,xp}}
function evTitle(n){const l=n.charAt(0).toLowerCase()+n.slice(1);if(/^(concert|voyage|rendez-vous|match|festival|entretien|examen|anniversaire|week-end|départ|déménagement)/.test(l))return"du "+l;if(/^(soirée|fête|sortie|rentrée)/.test(l))return"de la "+l;return"de « "+n+" »"}
function hFmt(h){h=+h;const m=Math.round(h%1*60);return Math.floor(h)+" h"+(m?" "+String(m).padStart(2,"0"):"")}
function bGoals(K,mult){const G=S.g,s=sitOf();if(!s||!(s.goals||[]).length)return null;const tk=dayKey(Date.now()),past=K.filter(k=>k<=tk);
  return s.goals.map(g=>{const lab=((SIT_Q.goals.find(x=>x[0]===g)||[])[1])||g;
    if(g==="sommeil"){const n=past.filter(k=>((G.sleep||{})[k]||{}).h>=7).length;return{g,lab,v:n,max:Math.round(5*mult),u:n>1?"nuits de 7 h ou plus":"nuit de 7 h ou plus"}}
    if(g==="moral"){const n=past.filter(k=>((G.mood||{})[k]|0)>=4).length,x=K.reduce((a,k)=>a+(bCat(k).soi||0),0);return{g,lab,v:n,max:Math.round(4*mult),u:n>1?`bonnes journées · ${x} XP pour toi`:`bonne journée · ${x} XP pour toi`}}
    const cs=GOAL_CAT[g]||[],x=K.reduce((a,k)=>a+cs.reduce((b,c)=>b+(bCat(k)[c]||0),0),0);return{g,lab,v:x,max:Math.round(10*mult)*10,u:"XP",cat:cs[0]}})}
function bStrip(K,small){const G=S.g,tk=dayKey(Date.now()),mx=Math.max(dayGoal(),...K.map(bXp));let av=K.filter(k=>k<=tk).pop()||K[0];const ai=K.indexOf(av);
  return`<div class="bstrip${small?" sm":""}">${K.map((k,i)=>{const fut=k>tk,x=bXp(k),w=(G.wxh||{})[k],md=(G.mood||{})[k],d=new Date(k+"T12:00");
    return`<div class="bsd${fut?" fut":""}${k===tk?" now":""}"><span class="bsw">${w?wxIcon(wxKind(w.ic),true):fut?"":`<i class="bsq">·</i>`}</span><span class="bsm">${md?moodFace(md,small?18:24):`<i class="bse"></i>`}</span><span class="bsb"><i style="height:${fut?0:Math.max(x?6:0,Math.round(x/mx*82))}%"></i>${x&&!small?`<em>${x}</em>`:""}</span><span class="bsl">${"LMMJVSD"[i]}<small>${d.getDate()}</small></span></div>`}).join("")}
    <img class="bsav" src="${myAvatarURL()}" alt="" style="--i:${ai}"></div>`}
function bCheck(R){let last="";return`<div class="bdam"><div class="bdh"><span></span>${"LMMJVSD".split("").map(l=>`<b>${l}</b>`).join("")}</div>${R.rows.map(r=>{const p=ritPer(r.t),hd=p!==last?`<p class="bdp">${p==="soir"?"Soir":"Matin"}</p>`:"";last=p;return hd+`<div class="bdr"><span class="bdn"></span>${r.c.map(c=>`<i class="c-${c}"></i>`).join("")}</div>`}).join("")}</div>`}
function bBody(K){const G=S.g,tk=dayKey(Date.now());return`<div class="bbody"><span class="bb7"><small>7 h</small></span>${K.map((k,i)=>{const s=(G.sleep||{})[k],h=s&&+s.h||0,md=(G.mood||{})[k];return`<div class="bbd${k>tk?" fut":""}"><span class="bbm">${md?moodFace(md,22):""}</span><span class="bbb"><i class="${h&&h<6?"low":""}" style="height:${Math.min(100,h/11*100)}%"></i></span><span class="bbl">${h?hFmt(h).replace(" h ","h").replace(" h","h"):"–"}</span></div>`}).join("")}</div>`}
function bMoments(K){const G=S.g,tk=dayKey(Date.now()),M=[];
  evArc().filter(e=>K.includes(e.d)&&e.d<=tk).forEach(e=>{const ty=evtOf(e.t||evtGuess(e.n));M.push({d:e.d,h:`<div class="bmt tik" style="--tc:${ty[2]}"><span class="tkl"><small>${esc(ty[1])}</small><b>${esc(e.n)}</b>${e.a?`<em>${esc(e.a)}</em>`:""}</span><span class="tkr"><b>${new Date(e.d+"T12:00").getDate()}</b><small>${MOIS_C[new Date(e.d+"T12:00").getMonth()].slice(0,4)}</small></span></div>`})});
  K.forEach(k=>{const j=(G.jr||{})[k];if(j&&(j.t||j.k))M.push({d:k,h:`<div class="bmt jr"><small>${JOURS[wdOf(k)]}</small>${j.t?`<b>« ${esc(j.t)} »</b>`:""}${j.k?`<span>Le kif : ${esc(j.k)}</span>`:""}</div>`});
    const s=(G.sdj||{})[k];if(s&&s.n)M.push({d:k,h:`<a class="bmt sdj" href="${esc(s.u||"#")}" target="_blank" rel="noopener">${spCov(s,44)}<span><small>Son du ${JOURS[wdOf(k)]}</small><b>${esc(s.n)}</b><em>${esc(s.a||"")}</em></span></a>`});
    if(((G.mood||{})[k]|0)===5)M.push({d:k,h:`<div class="bmt md">${moodFace(5,32)}<span><small>${JOURS[wdOf(k)]}</small><b>Super journée</b></span></div>`})});
  (Array.isArray(G.mem)?G.mem:[]).filter(m=>K.includes(m.d)).forEach(m=>M.push({d:m.d,h:`<div class="bmt mem">${m.ph?`<img src="${m.ph}" alt="">`:""}<span><small>${m.ev?"Souvenir du concert":"Souvenir · "+JOURS[wdOf(m.d)]}</small><b>${esc(m.q)}</b>${m.w?`<em>« ${esc(m.w)} »</em>`:""}${m.s?`<i class="memsr">${ICO("star",12).repeat(m.s)}</i>`:""}</span></div>`}));
  return M.sort((a,b)=>a.d<b.d?-1:1).slice(-10).map(x=>x.h).join("")}
function bGains(K){const end=new Date(K[K.length-1]+"T23:59").getTime(),start=new Date(K[0]+"T00:00").getTime()+dayCut()*36e5,B=badgeDefs(),out=[];
  Object.entries(S.badges||{}).forEach(([id,t])=>{if(t>=start&&t<=end+dayCut()*36e5){const b=B.find(x=>x.id===id);if(b)out.push(`<div class="bgn">${bdgIconImg(b,36)}<span><small>Badge</small><b>${esc(b.name)}</b></span></div>`)}});
  const tk=dayKey(Date.now());let after=0;Object.entries(S.g.hist||{}).forEach(([k,h])=>{if(k>K[6])after+=h.x||0});const wx=K.reduce((a,k)=>a+bXp(k),0),l1=levelInfo(Math.max(0,S.xp-after)).l,l0=levelInfo(Math.max(0,S.xp-after-wx)).l;
  if(l1>l0)out.unshift(`<div class="bgn lv"><span class="bgl">${l1}</span><span><small>Niveau</small><b>${l1-l0>1?`+${l1-l0} niveaux`:`Niveau ${l1} atteint`}</b></span></div>`);return out.join("")}
function bNext(){const G=S.g,wk=bWeek(-1)[0],s=sitOf(),cur=(G.intn||{})[wk];
  const ev=(()=>{try{return evList().filter(e=>e.inD>=0&&e.inD<=14).slice(0,4)}catch(e){return[]}})();
  const goals=(s&&s.goals||[]).filter(g=>GOAL_INT[g]),props=goals.length?goals.map(g=>GOAL_INT[g]):["Un moment rien que pour toi chaque jour","Appeler un proche 3 fois","Ranger une zone par jour"];
  return`${ev.length?`<ul class="bnev">${ev.map(e=>`<li><b>${esc(e.n)}</b><small>${esc(evWhen(e.inD))}</small></li>`).join("")}</ul>`:`<p class="hint vide">Aucun événement pour l'instant.</p>`}
    <h4 class="bh4">Ton intention pour la semaine prochaine</h4><div class="bint">${props.slice(0,3).map(p=>`<button type="button" class="qchip" data-int="${esc(p)}" aria-pressed="${cur===p}">${esc(p)}</button>`).join("")}</div>`}
function intNow(){const G=S.g;return G&&G.intn?G.intn[bWeek(0)[0]]||"":""}
function bSec(h,b,cls){return`<div class="bsec ${cls||""}">${h?`<h3 class="bh3">${h}</h3>`:""}${b}</div>`}
function renderChap(){const box=$("chapBox");if(!box||!S.g)return;wxRec();const G=S.g,tk=dayKey(Date.now());if(!G.chap||typeof G.chap!=="object")G.chap={};
  document.documentElement.classList.toggle("bildet",bilDet);
  const tabs=`<div class="btabs" role="tablist">${[["w","Semaine"],["m","Mois"],["y","Année"]].map(([k,l])=>`<button type="button" role="tab" data-bt="${k}" aria-selected="${bilTab===k}">${l}</button>`).join("")}</div>`;
  let h="";
  if(bilTab==="w"){const K=bWeek(bilOff),wk=K[0],auto=bChapAuto(K),ch=G.chap[wk]||{},title=ch.t||auto.t,lines=ch.l&&ch.l.length?ch.l:auto.l,cur=K.includes(tk);
    const R=bRit(K),gl=bGoals(K,1),mo=bMoments(K),gn=bGains(K);
    h+=`<div class="bnav"><button type="button" class="bnv" data-d="1" aria-label="Semaine précédente">${ICO("chev",18)}</button><span>${(()=>{const a=new Date(K[0]+"T12:00"),b=new Date(K[K.length-1]+"T12:00"),m=d=>d.toLocaleDateString("fr-FR",{month:"short"});return a.getMonth()===b.getMonth()?a.getDate()+"–"+b.getDate()+" "+m(b):a.getDate()+" "+m(a)+" – "+b.getDate()+" "+m(b)})()}</span><button type="button" class="bnv nx" data-d="-1" aria-label="Semaine suivante" ${bilOff<=0?"disabled":""}>${ICO("chev",18)}</button></div>`;
    h+=`<div class="bhero">${bStrip(K)}<div class="bchap"><small>${cur&&wdOf(tk)<6?"Chapitre en cours":"Chapitre"}${ch.ai?" · écrit avec Claude":""}</small>${bilEdit?`<form class="bced"><input maxlength="60" aria-label="Titre du chapitre"><button type="submit" class="btn primary">OK</button></form>`:`<h3 class="bct"></h3>`}<ul class="bcl">${lines.map(()=>"<li></li>").join("")}</ul>
      <div class="bcb">${bilEdit?"":`<button type="button" class="lnk bced1">Renommer</button>`}${ch.t||ch.l?`<button type="button" class="lnk bcrs">Revenir au titre auto</button>`:""}</div></div></div>`;
    h+=bSec("Tes quêtes principales",gl?`<div class="bgl">${gl.map(x=>{const p=Math.min(100,Math.round(x.v/Math.max(1,x.max)*100));return`<div class="bgr${p>=100?" full":""}" style="--gc:${x.cat&&CATS[x.cat]?CATS[x.cat].c:"var(--gold)"}"><span class="bgt"><b>${esc(x.lab)}</b><small>${x.v} ${x.u==="XP"?"/ "+x.max+" XP":esc(x.u)+(x.max?" · objectif "+x.max:"")}</small></span><span class="bgb"><i style="width:${p}%"></i>${[25,50,75].map(v=>`<u style="left:${v}%"></u>`).join("")}</span></div>`}).join("")}</div>`:`<button type="button" class="wkcta bsit">${ICO("spark",18)}<span><b>Dis-moi ce qui compte pour toi</b><small>Tes objectifs de la fiche deviennent des jauges ici.</small></span></button>`);
    h+=bSec(`Tes rituels<span class="bh3r">${R.due?R.pct+" %":""}${ritStreak()&&cur?` · essentiels ${ritStreak()} j`:""}</span>`,R.rows.length?bCheck(R)+`<p class="blg"><i class="c-d"></i>fait<i class="c-m"></i>pas fait<i class="c-o"></i>pas prévu</p>`:`<p class="hint vide">Aucun rituel suivi cette semaine.</p>`);
    h+=bSec("Corps et tête",bBody(K)+`<p class="hint">Barres : tes nuits. Visages : ton humeur du jour.</p>`);
    if(mo)h+=bSec("Moments forts",`<div class="bmo">${mo}</div>`);
    if(gn)h+=bSec("Ce que tu as gagné",`<div class="bgns">${gn}</div>`);
    
    if(cur)h+=bSec("Le prochain chapitre",bNext());
    box.innerHTML=tabs+h;
    {const t=box.querySelector(".bct");if(t)t.textContent=title;box.querySelectorAll(".bcl li").forEach((li,i)=>li.textContent=lines[i]);
     const R2=bRit(K);box.querySelectorAll(".bdr .bdn").forEach((e,i)=>{if(R2.rows[i])e.textContent=R2.rows[i].t.name});
     const f=box.querySelector(".bced");if(f){const i=f.querySelector("input");i.value=title;setTimeout(()=>i.focus(),30);f.onsubmit=e=>{e.preventDefault();const v=i.value.trim();G.chap[wk]={...(G.chap[wk]||{}),t:v||undefined};if(!v)delete G.chap[wk].t;bilEdit=false;save();renderChap()}}
     const e1=box.querySelector(".bced1");if(e1)e1.onclick=()=>{bilEdit=true;renderChap()};
     const rs=box.querySelector(".bcrs");if(rs)rs.onclick=()=>{delete G.chap[wk];save();renderChap()};
     
     const sb=box.querySelector(".bsit");if(sb)sb.onclick=()=>sitSheet();
     box.querySelectorAll("[data-int]").forEach(b=>b.onclick=()=>{if(!G.intn||typeof G.intn!=="object")G.intn={};const nk=bWeek(-1)[0];G.intn[nk]=G.intn[nk]===b.dataset.int?"":b.dataset.int;save();renderChap();if(G.intn[nk])toast("Intention notée pour lundi")})}}
  else if(bilTab==="m"){const d=new Date(dayKey(Date.now())+"T12:00");d.setDate(1);d.setMonth(d.getMonth()-bilOff);const y=d.getFullYear(),m=d.getMonth(),n=new Date(y,m+1,0).getDate(),K=[];for(let i=1;i<=n;i++)K.push(`${y}-${String(m+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`);
    const xp=K.reduce((a,k)=>a+bXp(k),0),act=K.filter(k=>bXp(k)>0).length,mx=Math.max(1,...K.map(bXp)),past=K.filter(k=>k<=tk),sl=past.map(k=>(G.sleep||{})[k]).filter(x=>x&&x.h),md=past.map(k=>(G.mood||{})[k]).filter(Boolean),gl=bGoals(K,n/7);
    const c={};K.forEach(k=>Object.entries(bCat(k)).forEach(([a,v])=>{if(a!=="eau")c[a]=(c[a]||0)+v}));const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0],ev=evArc().filter(e=>K.includes(e.d));
    const title=(G.chap["m"+y+"-"+m]||{}).t||(ev.length?"Le mois "+evTitle(ev[0].n):top&&xp>300?CHAP_CAT[top[0]].replace("La semaine","Le mois"):"Un mois au calme");
    h+=`<div class="bnav"><button type="button" class="bnv" data-d="1" aria-label="Mois précédent">${ICO("chev",18)}</button><span>${MOIS_C[m].charAt(0).toUpperCase()+MOIS_C[m].slice(1)} ${y}</span><button type="button" class="bnv nx" data-d="-1" aria-label="Mois suivant" ${bilOff<=0?"disabled":""}>${ICO("chev",18)}</button></div>`;
    h+=`<div class="bhero"><div class="bcal"><div class="bdh">${"LMMJVSD".split("").map(l=>`<b>${l}</b>`).join("")}</div><div class="bcg">${"<i></i>".repeat(wdOf(K[0]))}${K.map(k=>{const x=bXp(k),mm=(G.mood||{})[k];return`<span class="bcd${k===tk?" now":""}${k>tk?" fut":""}${mm?" md":""}${k<=tk?" mpk":""}"${k<=tk?` data-k="${k}" role="button" tabindex="0" aria-label="${mm?"Changer":"Noter"} l'humeur du ${+k.slice(8)}"`:""} style="--a:${x?.15+.6*x/mx:0}${mm?`;--mc:${MOODS[mm-1][2]}`:""}"${mm?` title="${+k.slice(8)} : ${MOODS[mm-1][1]}"`:""}>${mm?moodFace(mm,22,1):`<em>${+k.slice(8)}</em>`}</span>`}).join("")}</div></div>
      <div class="bchap"><small>Chapitre du mois</small>${bilEdit?`<form class="bced"><input maxlength="60" aria-label="Titre du mois"><button type="submit" class="btn primary">OK</button></form>`:`<h3 class="bct">${esc(title)}</h3>`}<ul class="bcl"><li>${xp} XP · ${act} jour${act>1?"s":""} actif${act>1?"s":""}</li>${sl.length?`<li>Nuits de ${hFmt(sl.reduce((a,x)=>a+ +x.h,0)/sl.length)} en moyenne</li>`:""}${md.length?`<li>${md.filter(v=>v>=4).length} bonne${md.filter(v=>v>=4).length>1?"s":""} journée${md.filter(v=>v>=4).length>1?"s":""} sur ${md.length} notée${md.length>1?"s":""}</li>`:""}</ul>${bilEdit?"":`<div class="bcb"><button type="button" class="lnk bced1">Renommer le mois</button>${(G.chap["m"+y+"-"+m]||{}).t?`<button type="button" class="lnk bcrs">Titre auto</button>`:""}</div>`}</div></div>`;
    {const B=(Array.isArray(G.prj)?G.prj:[]).filter(p=>p.arc||!p.won).sort((a,b)=>(b.arc?1:0)-(a.arc?1:0))[0];if(B&&!bilOff){const N=B.st.length,dn=B.st.filter(x=>x.d).length;h+=bSec("Le projet du mois",`<div class="bbm"><span class="prm">${rkSvg((typeof SQ_IC!=="undefined"&&SQ_IC[B.cat])||"dossier")}</span><span class="bbt"><b></b><small>${B.won?"Vaincu !":`${dn} / ${N} étapes · ${B.arc?"ton arc":"ton projet"}`}</small><span class="bgb"><i style="width:${Math.round(dn/N*100)}%;background:var(--gold)"></i></span></span></div>`)}}
    if(gl)h+=bSec("Tes quêtes principales",`<div class="bgl">${gl.map(x=>{const p=Math.min(100,Math.round(x.v/Math.max(1,x.max)*100));return`<div class="bgr${p>=100?" full":""}" style="--gc:${x.cat&&CATS[x.cat]?CATS[x.cat].c:"var(--gold)"}"><span class="bgt"><b>${esc(x.lab)}</b><small>${x.v} ${x.u==="XP"?"/ "+x.max+" XP":esc(x.u)+(x.max?" · objectif "+x.max:"")}</small></span><span class="bgb"><i style="width:${p}%"></i></span></div>`}).join("")}</div>`);
    box.innerHTML=tabs+h;{const bt=box.querySelector(".bbt b"),B=(Array.isArray(G.prj)?G.prj:[]).filter(p=>p.arc||!p.won).sort((a,b)=>(b.arc?1:0)-(a.arc?1:0))[0];if(bt&&B)bt.textContent=B.n}
    {const mk="m"+y+"-"+m,f=box.querySelector(".bced");if(f){const i=f.querySelector("input");i.value=title;setTimeout(()=>i.focus(),30);f.onsubmit=e=>{e.preventDefault();const v=i.value.trim();if(v)G.chap[mk]={t:v.slice(0,60)};else delete G.chap[mk];bilEdit=false;save();renderChap()}}
     const e1=box.querySelector(".bced1");if(e1)e1.onclick=()=>{bilEdit=true;renderChap()};const rs=box.querySelector(".bcrs");if(rs)rs.onclick=()=>{delete G.chap[mk];save();renderChap()}}}
  else{const y=new Date(dayKey(Date.now())+"T12:00").getFullYear()-bilOff,H=G.hist||{},M=[];for(let m=0;m<12;m++){const pre=`${y}-${String(m+1).padStart(2,"0")}`,ks=Object.keys(H).filter(k=>k.startsWith(pre)),xp=ks.reduce((a,k)=>a+(H[k].x||0),0),md=Object.entries(G.mood||{}).filter(([k])=>k.startsWith(pre)).map(([,v])=>v);
      const c={};ks.forEach(k=>Object.entries(H[k].c||{}).forEach(([a,v])=>{if(a!=="eau")c[a]=(c[a]||0)+v}));const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];M.push({m,xp,md:md.length?Math.round(md.reduce((a,b)=>a+b,0)/md.length):0,top:top?top[0]:""})}
    const mx=Math.max(1,...M.map(x=>x.xp)),tot=M.reduce((a,x)=>a+x.xp,0),cm=new Date().getFullYear()===y?new Date(dayKey(Date.now())+"T12:00").getMonth():11;
    h+=`<div class="bnav"><button type="button" class="bnv" data-d="1" aria-label="Année précédente">${ICO("chev",18)}</button><span>${y}</span><button type="button" class="bnv nx" data-d="-1" aria-label="Année suivante" ${bilOff<=0?"disabled":""}>${ICO("chev",18)}</button></div>`;
    h+=`<div class="bhero"><div class="byr">${M.map(x=>`<button type="button" class="bym${x.m>cm?" fut":""}${x.m===cm&&!bilOff?" now":""}" data-m="${x.m}" ${x.m>cm?"disabled":""} style="--gc:${x.top&&CATS[x.top]?CATS[x.top].c:"var(--gold)"}"><span class="bymf">${x.md?moodFace(x.md,20):""}</span><span class="bymb"><i style="height:${x.xp?Math.max(4,x.xp/mx*100):0}%"></i></span><span class="byml">${MOIS_C[x.m].slice(0,1).toUpperCase()}</span></button>`).join("")}</div>
      <div class="bchap"><small>Ton année en douze chapitres</small><h3 class="bct">${tot} XP en ${y}</h3><ul class="bcl">${M.filter(x=>x.xp&&x.top).slice(-3).reverse().map(x=>`<li>${MOIS_C[x.m].charAt(0).toUpperCase()+MOIS_C[x.m].slice(1)} : ${esc((CHAP_CAT[x.top]||"").replace("La semaine","le mois").replace(/^le mois/,"le mois"))||x.xp+" XP"}</li>`).join("")}</ul><p class="hint">Touche un mois pour l'ouvrir.</p></div></div>`;
    box.innerHTML=tabs+h;box.querySelectorAll(".bym").forEach(b=>b.onclick=()=>{const now=new Date(dayKey(Date.now())+"T12:00");bilTab="m";bilOff=(now.getFullYear()-y)*12+now.getMonth()-(+b.dataset.m);renderChap()})}
  box.insertAdjacentHTML("beforeend",`<button type="button" class="bdet" aria-expanded="${bilDet}">${bilDet?"Masquer mon chemin":"Mon chemin"}${ICO("chev",14)}</button>`);
  box.querySelector(".bdet").onclick=()=>{bilDet=!bilDet;renderChap()};
  box.querySelectorAll("[data-bt]").forEach(b=>b.onclick=()=>{bilTab=b.dataset.bt;bilOff=0;bilEdit=false;renderChap()});
  box.querySelectorAll(".bnv").forEach(b=>b.onclick=()=>{bilOff=Math.max(0,bilOff+ +b.dataset.d);bilEdit=false;renderChap()});
  {const sunK=wdOf(tk)===6&&dayH()>=18?bWeek(0)[0]:wdOf(tk)===0&&dayH()<14?bWeek(1)[0]:null;if(sunK&&bilTab==="w"&&bWeek(bilOff)[0]===sunK&&typeof subs!=="undefined"&&subs.c==="bilan"&&view==="c"&&G.wkSeen!==sunK){G.wkSeen=sunK;save()}}}
// --- récap du dimanche soir (et du lundi matin) sur l'accueil
function renderWkSun(){const box=$("wkSun");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now()),wd=wdOf(tk),h=dayH();let K=null;
  if(wd===6&&h>=18)K=bWeek(0);else if(wd===0&&h<14)K=bWeek(1);const show=!!K&&G.wkSeen!==K[0]&&!isOff();box.classList.toggle("voff",!show);if(!show){box.innerHTML="";return}
  const a=bChapAuto(K),ch=(G.chap||{})[K[0]]||{};box.innerHTML=`<div class="wksc"><span class="wksk">${wd===6?"Ta semaine est finie":"Ta semaine dernière"}</span><b class="wkst"></b>${bStrip(K,1)}<div class="wksb"><button type="button" class="btn primary wksgo">Voir mon bilan</button><button type="button" class="lnk wksx">Plus tard</button></div></div>`;
  box.querySelector(".wkst").textContent=ch.t||a.t;
  box.querySelector(".wksgo").onclick=()=>{G.wkSeen=K[0];save();bilTab="w";bilOff=wd===6?0:1;goSub("c","bilan")};box.querySelector(".wksx").onclick=()=>{G.wkSeen=K[0];save();renderWkSun()}}

// --- Fil « Aujourd'hui » : 3 quêtes fusionnées (événements, spéciales, moment, pour toi, Claude)
const FEED_SP=["gift","secret","sur"];
function enOf(){const G=S.g,tk=dayKey(Date.now());return G&&G.en&&G.en.d===tk?G.en.v|0:0}
function dayGoal(){return Math.round(dayGoal0()*(window.vieGoalF?vieGoalF():1))}
function dayGoal0(){const G=S.g;if(!G)return 150;const tk=dayKey(Date.now()),e=enOf(),md=(G.mood||{})[tk]|0;if(e===1||(md&&md<=2))return 80;if(e===2)return 120;return 150}
function fqNo(){const G=S.g;if(!G.fqNo||typeof G.fqNo!=="object")G.fqNo={};return G.fqNo}
function fqWt(k){const G=S.g;return k&&G.fqW&&typeof G.fqW[k]==="number"?G.fqW[k]:0}
function fqWAdd(k,d){if(!k)return;const G=S.g;if(!G.fqW||typeof G.fqW!=="object")G.fqW={};G.fqW[k]=Math.max(-2,Math.min(1.5,(G.fqW[k]||0)+d))}
function feedPick(){const G=S.g,F=fqPick(false),tk=dayKey(Date.now()),now=Date.now(),NO=fqNo();
  if(!Array.isArray(F.done))F.done=[];if(!Array.isArray(F.dn)||F.dnd!==tk){F.dn=[];F.dnd=tk}if(!Array.isArray(F.sk)||F.skd!==tk){F.sk=[];F.lt={};F.skd=tk}if(!F.lt||typeof F.lt!=="object")F.lt={};
  const done=new Set(F.done),hid=id=>F.sk.includes(id)||(F.lt[id]&&F.lt[id]>now);
  const ev=evQuests().map(x=>({...x,k:"ev",key:"e:"+x.tpl})).filter(x=>!NO[x.key]);
  const sp=[];if(Array.isArray(S.specials)){S.specials.filter(q=>!q.bd&&!q.bs&&FEED_SP.includes(dqKind(q))).sort((a,b)=>DQ_ORD[dqKind(a)]-DQ_ORD[dqKind(b)]).forEach(q=>{const k=dqKind(q);sp.push({id:"sp:"+q.id,t:q.name,why:(DQ_K[k]||DQ_K[""])[0],cat:q.cat||"soi",xp:q.xp,k:"sp",q,key:k==="gift"?"":"s:"+q.name,gift:k==="gift"})})}
  const mq=mqActive().filter(q=>!NO["m:"+q[0]]).map(q=>({id:"mq:"+q[0],t:q[1],why:"avant "+mqUntil(q[2][1]),cat:q[4],xp:XPE(q[3]),k:"mq",q,key:"m:"+q[0]}));
  const all=fqItems().map(x=>({...x,k:x.ai?"ai":(x.ev?"ev":"fq"),key:x.ai?"":"f:"+x.id.split(":")[0]})).filter(x=>!x.key||!NO[x.key]),ai=all.filter(x=>x.k==="ai"),base=all.filter(x=>x.k==="fq");
  const useAi=F.useAi&&ai.some(x=>!done.has(x.id)),e=enOf();
  const tkk=dayKey(Date.now()),ago=k=>Math.round((new Date(tkk+"T12:00")-new Date(k+"T12:00"))/864e5);
  const tik=tickets().filter(e=>{const a=ago(e.d);return a>=1&&a<=3&&!memOf("tik:"+e.id)}).slice(0,1).map(e=>({id:"tik:"+e.id,t:"Ton billet : "+e.n,why:"Garde un souvenir : une photo, un mot, une note",cat:"perso",xp:10,k:"tik",e,nonever:1}));
  const arc=(()=>{const a=arcStep();if(!a)return[];const N=a.p.st.length,last=a.p.st.filter(x=>!x.d).length===1;return[{id:"arc:"+a.p.id+":"+a.i,t:a.p.st[a.i].t,why:`${a.p.n} · ${last?"boss final":(a.i+1)+"/"+N}`,cat:CATS[a.p.cat]?a.p.cat:"perso",xp:DIFF[a.p.d||0][1],k:"arc",p:a.p,i:a.i,nonever:1}]})();
  const duo=(()=>{const D=duoCur();if(!D||D.me.includes(tkk)||D.me.length>=D.n)return[];return[{id:"duo:"+tkk,t:D.c,why:`Défi à deux avec ${D.who} · ${D.me.length}/${D.n}`,cat:"social",xp:10,k:"duo",nonever:1}]})();
  const cf=comfortQ().filter(x=>!NO["c:"+x.t]);
  let C=evmOn()?[...ev,...tik]:[...ev,...tik,...cf,...arc,...sp.slice(0,1),...(useAi?ai:[]),...duo,...mq.slice(0,1),...base,...sp.slice(1),...mq.slice(1)];
  const back=C.filter(x=>F.lt[x.id]&&F.lt[x.id]<=now);C=[...back,...C.filter(x=>!back.includes(x))];
  const seen=new Set(),out=[];
  const CAP=window.vieCap?vieCap():3;
  F.dn.forEach(x=>{if(out.length<CAP&&!seen.has(x.id)){out.push({...x,done:1});seen.add(x.id)}});
  C.forEach(x=>{if(done.has(x.id)&&!seen.has(x.id)&&out.length<CAP){out.push({...x,done:1});seen.add(x.id)}});
  let open=C.filter(x=>!seen.has(x.id)&&!done.has(x.id)&&!hid(x.id));
  if(e===1){const sm=open.filter(x=>x.k==="ev"||x.k==="sp"||(x.xp|0)<35);if(sm.length>=CAP-out.length)open=sm}
  {const ids=new Set();open=open.filter(x=>{if(ids.has(x.id))return false;ids.add(x.id);return normOk(x.t)})}
  {const W=/verre d'eau|boire/i;if([...F.dn,...out].some(x=>W.test(x.t||"")))open=open.filter(x=>!W.test(x.t||""));else{let one=false;open=open.filter(x=>{if(!W.test(x.t||""))return true;if(one)return false;one=true;return true})}}
  {const pos=[],fq=[];open.forEach((x,i)=>{if(x.k==="fq"||x.k==="ai"){pos.push(i);fq.push([x,fq.length])}});if(window.viePri){fq.sort((a,b)=>viePri(a[0].cat)-viePri(b[0].cat)||a[1]-b[1]);pos.forEach((p,i)=>open[p]=fq[i][0])}}
  const fill=[];for(const x of open){if(out.length+fill.length>=CAP)break;if(x.k==="mq"&&fill.some(y=>y.k==="mq"))continue;if(x.k==="sp"&&fill.some(y=>y.k==="sp")&&!x.gift)continue;fill.push(x)}
  fill.forEach(x=>{out.push(x);seen.add(x.id)});
  return{L:out,rest:open.filter(x=>!seen.has(x.id)).length,F}}
function fqList(){return feedPick().L}
function feedIds(){try{const P=feedPick(),L=P.L,F=P.F,now=Date.now(),hd=id=>(F.sk||[]).includes(id)||(F.lt&&F.lt[id]>now),sp=new Set(L.filter(x=>x.k==="sp"&&!x.done).map(x=>x.q.id)),mq=new Set(L.filter(x=>x.k==="mq"&&!x.done).map(x=>x.q[0]));(S.specials||[]).forEach(q=>{if(hd("sp:"+q.id))sp.add(q.id)});mqActive().forEach(q=>{if(hd("mq:"+q[0]))mq.add(q[0])});return{sp,mq}}catch(e){return{sp:new Set(),mq:new Set()}}}
function feedDo(x,go,ev){const G=S.g,F=G.fq,tk=dayKey(Date.now());if(x.later){toast(`Cette quête s'ouvre à partir de ${mqUntil(x.from)}`);return}
  if((F.done||[]).includes(x.id)||(go&&go.dataset.busy))return;if(go&&x.k!=="tik"){go.dataset.busy="1";go.disabled=true}
  const mark=()=>{F.done=[...(F.done||[]),x.id];F.dn=[...(F.dn||[]),{id:x.id,t:x.t,why:x.why,cat:x.cat,xp:x.xp,k:x.k}];F.dnd=tk;fqWAdd(x.key,.2);if(F.lt)delete F.lt[x.id]};
  if(x.k==="tik"){memOpen({id:"tik:"+x.e.id,q:x.e.n,ev:x.e.id,d:x.e.d},()=>{mark();complete({id:"tik",cat:"perso",name:"Billet : "+x.e.n,xp:x.xp},document.querySelector("#fqBox")||document.body,null)});return}
  mark();
  if(x.k==="arc"){prjStep(x.p,x.i,document.createElement("div"),go,ev);return}
  if(x.k==="duo"){duoMe(go,ev);return}
  if(x.k==="sp"){completeSpecial(x.q,go,ev);return}
  if(x.k==="mq"){const q=x.q;if(!G.mq||typeof G.mq!=="object")G.mq={};if(!G.mq[tk])G.mq[tk]=[];G.mq[tk].push(q[0]);{const ks=Object.keys(G.mq).sort();while(ks.length>20)delete G.mq[ks.shift()]}complete({id:"mq-"+q[0],cat:q[4],name:q[1],xp:x.xp},go,ev);skyCheer();return}
  if(x.ev){if(!G.evq||typeof G.evq!=="object")G.evq={};G.evq[x.ev]=[...(G.evq[x.ev]||[]),x.tpl]}
  if(x.film)filmSeen(x.t,true);
  if(/verre d'eau/i.test(x.t)){const wt=ritTasks().find(t=>t.bar==="eau");if(wt)S.daily.c[wt.id]=Math.min(wt.n,(S.daily.c[wt.id]||0)+1)}
  complete({id:"fq-"+x.id.split(":")[0],cat:x.cat,name:x.t,xp:x.xp},go,ev,0,{fq:1});skyCheer()}
function feedNo(x,how){const G=S.g,F=G.fq,now=Date.now();
  if(how==="seen"){filmSeen(x.t);G.filmDay=null;save();renderFq();toast("Noté comme déjà vu : voici un autre film");return}
  if(how==="part"){if((F.done||[]).includes(x.id))return;const tk=dayKey(now),hx=Math.max(1,Math.round(x.xp/2));F.done=[...(F.done||[]),x.id];F.dn=[...(F.dn||[]),{id:x.id,t:x.t,why:x.why,cat:x.cat,xp:hx,k:x.k,part:1}];F.dnd=tk;if(F.lt)delete F.lt[x.id];
    if(x.k==="mq"){if(!G.mq||typeof G.mq!=="object")G.mq={};if(!G.mq[tk])G.mq[tk]=[];G.mq[tk].push(x.q[0])}if(x.ev){if(!G.evq||typeof G.evq!=="object")G.evq={};G.evq[x.ev]=[...(G.evq[x.ev]||[]),x.tpl]}
    complete({id:"fq-part",cat:x.cat,name:x.t+" (en partie)",xp:hx},document.querySelector("#fqBox .fqr")||document.body,null,0,{fq:1,part:1});return}
  if(how==="later"){const d=new Date();const h=dayH();let t;if(h<17){d.setHours(18,0,0,0);t=d.getTime()}else t=now+2*36e5;F.lt[x.id]=t;save();renderFq();toast(h<17?"Elle revient ce soir, vers 18 h":"Elle revient dans 2 heures");return}
  if(how==="today"){F.sk=[...F.sk,x.id];fqWAdd(x.key,-.25);save();renderFq();toast("Pas aujourd'hui : elle reviendra un autre jour");sfx("blip");return}
  if(how==="never"){const NO=fqNo();if(x.key)NO[x.key]=1;if(x.k==="cf")NO["c:"+x.t]=1;F.sk=[...F.sk,x.id];fqWAdd(x.key,-1);
    if(!Array.isArray(G.fqNoT))G.fqNoT=[];G.fqNoT=[...G.fqNoT.filter(t=>t!==x.t),x.t].slice(-15);
    if(x.k==="sp"&&!x.gift){S.specials=S.specials.filter(q=>q.id!==x.q.id)}
    if(x.k==="ev"&&x.ev){if(!G.evq||typeof G.evq!=="object")G.evq={};G.evq[x.ev]=[...(G.evq[x.ev]||[]),x.tpl]}
    save();render();toast("Compris : je ne te la proposerai plus");sfx("blip")}}
let fqMenu="";
function renderFq(){const box=$("fqBox");if(!box||!S.g)return;const G=S.g,s=sitOf();
  const P=feedPick(),L=P.L,F=P.F,left=L.filter(x=>!x.done).length,c=fqCtx(),e=enOf();
  const ctxL=[e?["","batterie faible","batterie moyenne","batterie pleine"][e]:"",c.wx?`${WX_L[c.wx.k]||""} · ${c.wx.tc}°`:"",c.md?["","journée dure","journée bof","journée moyenne","bonne journée","super journée"][c.md]:"",c.tired?"nuit courte":"",typeof intNow==="function"&&intNow()?"intention : "+intNow():""].filter(Boolean).join(" · ");
  const nNo=Object.keys(fqNo()).length;
  box.innerHTML=`<div class="head"><h2>Aujourd'hui<span class="count">${L.length-left}/${L.length}</span></h2><button type="button" class="btn edbtn fqsit" aria-label="Ma situation" title="Ma situation">${ICO("edit",16)}</button></div>${ctxL?`<p class="fqctx"></p>`:""}
    ${L.length?`<div class="fql">${L.map((x,i)=>{const C=CATS[x.cat]||{},d=!!x.done,m=!d&&fqMenu===x.id;return`<div class="fqr k-${x.k}${d?" done":""}${x.later&&!d?" later":""}${m?" menu":""}" style="--zc:${C.c||"var(--gold)"}" data-i="${i}"><span class="fqt"><small class="fqw">${x.k==="ai"?`<em>Claude</em> · `:""}<span></span></small><b></b>${!d&&freeAlt(x.t)?`<small class="fqfree">Version gratuite : ${esc(freeAlt(x.t))}</small>`:""}${d&&x.k!=="tik"?`<button type="button" class="lnk fqmem">${memOf("q:"+dayKey(Date.now())+":"+x.id)?"Souvenir gardé · voir":"+ Un souvenir"}</button>`:""}</span>
      <span class="fqa">${d?`<span class="fqok">${x.part?"½":ICO("check",18)}</span>`:`${(()=>{const cn=!x.later&&cntOf(x.t),dm0=!x.later&&!cn&&durOf(x.t),dm=dm0>=10?dm0:0;if(cn){const k=((F.cnt||{})[x.id])|0;return`<span class="ui-compteur fqcn">${k}/${cn.n}</span><button type="button" class="btn primary fqgo fqcnt" data-cnt="1">+${Math.min(cn.st,cn.n-k)}</button>`}return`<button type="button" class="btn primary fqgo"${dm?` data-tm="fq-${esc(x.id)}" data-tmn="${esc(x.t)}"`:""}>${x.later?"À partir de "+mqUntil(x.from).replace(/^(\d+)h$/,"$1 h"):dm?`${dm>=60?(dm/60).toLocaleString("fr-FR")+" h":dm+" min"}`:"Fait"} <small>+${x.xp}</small></button>`})()}<button type="button" class="fqrr" aria-label="Pas maintenant" aria-expanded="${m}" title="Pas maintenant"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="5" cy="12" r="2.2" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><circle cx="19" cy="12" r="2.2" fill="currentColor"/></svg></button>`}</span>
      ${m?`<span class="fqno">${x.film?`<button type="button" class="btn" data-no="seen">Déjà vu<small>un autre film</small></button>`:""}${["fq","ai","mq","ev","cf"].includes(x.k)?`<button type="button" class="btn" data-no="part">En partie<small>moitié des XP</small></button>`:""}<button type="button" class="btn" data-no="later">Plus tard<small>revient ce soir</small></button><button type="button" class="btn" data-no="today">Pas aujourd'hui<small>un autre jour</small></button>${x.gift||x.nonever?"":`<button type="button" class="btn" data-no="never">Pas pour moi<small>ne revient plus</small></button>`}</span>`:""}</div>`}).join("")}</div>`:`<p class="fqempty">C'est tout pour l'instant.</p>`}
    ${s?"":`<button type="button" class="wkcta fqcta">${ICO("spark",18)}<span><b>Dis-m'en un peu plus sur toi</b><small>Pour des quêtes tirées de ta vie.</small></span></button>`}
    
    ${s&&s.note&&!arcCur()&&!evmOn()?`<button type="button" class="wkcta arccta"${arcBusy?" disabled":""}>${ICO("spark",18)}<span><b>${arcBusy?"Découpage…":"Faire de « "+esc(s.note.slice(0,40))+" » un arc"}</b><small>Ton objectif découpé en chapitres.</small></span></button>`:""}
    ${nNo?`<button type="button" class="lnk fqrst">${nNo} quête${nNo>1?"s":""} écartée${nNo>1?"s":""} · les réautoriser</button>`:""}`;
  {const cx=box.querySelector(".fqctx");if(cx)cx.textContent=ctxL}
  box.querySelectorAll(".fqr").forEach(r=>{const x=L[+r.dataset.i];r.querySelector(".fqt b").textContent=x.t;r.querySelector(".fqw span").textContent=x.why||"";
    const go=r.querySelector(".fqgo");if(go)go.onclick=ev=>{fqMenu="";if(go.dataset.cnt){const cn=cntOf(x.t);if(!F.cnt||typeof F.cnt!=="object")F.cnt={};const k=Math.min(cn.n,((F.cnt[x.id])|0)+cn.st);F.cnt[x.id]=k;sfx("blip");if(k>=cn.n){delete F.cnt[x.id];feedDo(x,go,ev)}else{save();renderFq()}return}feedDo(x,go,ev)};
    {const mm=r.querySelector(".fqmem");if(mm)mm.onclick=()=>memOpen({id:"q:"+dayKey(Date.now())+":"+x.id,q:x.t})}
    const rr=r.querySelector(".fqrr");if(rr)rr.onclick=()=>{fqMenu=fqMenu===x.id?"":x.id;renderFq()};
    r.querySelectorAll("[data-no]").forEach(b=>b.onclick=()=>{fqMenu="";feedNo(x,b.dataset.no)})});
  box.querySelector(".fqsit").onclick=()=>sitSheet();{const a=box.querySelector(".fqcta");if(a)a.onclick=()=>sitSheet()}{const a=box.querySelector(".arccta");if(a)a.onclick=()=>arcAsk()}
  {const a=box.querySelector(".fqrst");if(a)a.onclick=()=>undoAfter("Quêtes écartées réautorisées",()=>{G.fqNo={};G.fqNoT=[];G.fqFam={};Object.keys(G.fqW||{}).forEach(k=>{if(G.fqW[k]<0)G.fqW[k]=0});if(G.fq)G.fq.d="";save();render()})}
  try{window.__fqFinish&&window.__fqFinish()}catch(e){}
  renderPlus()}
// --- énergie du matin
function renderEn(){const box=$("enBox");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now()),h=dayH(),P=dayPer();
  const show=!enOf()&&P==="matin"&&h<14&&!isOff()&&!pzActive()&&!lateNight();box.classList.toggle("voff",!show);if(!show){box.innerHTML="";return}
  const sl=G.sleep&&G.sleep[tk],hh=sl&&+sl.h;const slt=hh?`Tu as dormi ${Math.floor(hh)} h${hh%1?" "+String(Math.round(hh%1*60)).padStart(2,"0"):""}. `:"";
  box.innerHTML=`<div class="enc"><div class="enr">${[1,2,3].map(v=>`<button type="button" class="btn enb" data-en="${v}">${enSvg(v)}<span>${["","Faible","Moyenne","Pleine"][v]}</span><small>${[0,80,120,150][v]} XP</small></button>`).join("")}</div></div>`;
  box.querySelectorAll(".enb").forEach(b=>b.onclick=()=>enSet(+b.dataset.en))}
function enSvg(v,s){s=s||30;const c=["","#ff6a5a","#ffc94a","#5fd068"][v];return`<svg viewBox="0 0 30 16" width="${s}" height="${Math.round(s*16/30)}" aria-hidden="true" shape-rendering="crispEdges"><rect x="1" y="1" width="24" height="14" fill="none" stroke="currentColor" stroke-width="2"/><rect x="25" y="5" width="4" height="6" fill="currentColor"/>${[0,1,2].map(i=>i<v?`<rect x="${4+i*7}" y="4" width="5" height="8" fill="${c}"/>`:"").join("")}</svg>`}
function enSet(v){const G=S.g,tk=dayKey(Date.now());G.en={d:tk,v};if(G.fq){G.fq.d="";}save();render();toast(`Batterie ${["","faible","moyenne","pleine"][v]} · objectif du jour : ${dayGoal()} XP`)}
// --- tiroir « Plus »
let plusOpen=false;
function renderPlus(){const box=$("plusBox");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now());
  const fi=feedIds(),nSp=(S.specials||[]).filter(q=>!q.bd&&!q.bs&&!fi.sp.has(q.id)).length+mqActive().filter(q=>!fi.mq.has(q[0])).length,nPr=(Array.isArray(G.prj)?G.prj:[]).filter(p=>!p.won).length,nEv=(()=>{try{return evList().length}catch(e){return 0}})();
  const parts=[nSp?`${nSp} spéciale${nSp>1?"s":""}`:"","bonnes actions",typeof rhOn==="function"&&S.actions.some(a=>rhOn(a))?"ta semaine":"",nPr?`${nPr} projet${nPr>1?"s":""}`:"",nEv?`${nEv} événement${nEv>1?"s":""}`:""].filter(Boolean);
  document.documentElement.classList.toggle("plusopen",plusOpen);
  box.innerHTML=`<button type="button" class="plusb" aria-expanded="${plusOpen}"><span class="plusi">${plusOpen?"−":"+"}</span><span><b>${plusOpen?"Ranger":"Noter une action"}</b><small>${esc(parts.join(" · "))}</small></span>${nSp&&!plusOpen?`<em>${nSp}</em>`:""}</button>`;
  box.querySelector(".plusb").onclick=()=>{plusOpen=!plusOpen;renderPlus();if(plusOpen)setTimeout(()=>{const n=box.nextElementSibling;box.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"})},50)}}


