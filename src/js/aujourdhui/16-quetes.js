// ===== Quêtes : rythme libre, création rapide, projets en étapes =====
const WDL=["L","M","M","J","V","S","D"],WDN=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
const wdOf=k=>(new Date(k+"T12:00").getDay()+6)%7;
function wkKeys(k){const d=new Date(k+"T12:00");d.setDate(d.getDate()-wdOf(k));const o=[];for(let i=0;i<7;i++){o.push(dayKey(d));d.setDate(d.getDate()+1)}return o}
const rhOn=o=>!!((o.wd&&o.wd.length)||o.xw>0||o.dl);
function rhOff(t,k,H){if(t.wd&&t.wd.length&&!t.wd.includes(wdOf(k)))return true;if(t.xw>0){const n=wkKeys(k).filter(x=>x!==k&&H[x]&&H[x][t.id]).length;if(n>=t.xw)return true}return false}
function rhLab(o){if(o.wd&&o.wd.length){const w=o.wd.slice().sort((a,b)=>a-b),s=w.join("");if(w.length===7)return"chaque jour";if(s==="01234")return"en semaine";if(s==="56")return"le week-end";return w.length===1?"le "+WDN[w[0]]:w.map(i=>WDL[i]).join(" ")}
  if(o.xw>0)return o.xw+"×/sem.";if(o.ev>1)return evLab(o);if(o.dl)return"chaque jour";return""}
function rhState(o,free){if(o.wd&&o.wd.length)return{m:"wd",n:3,wd:o.wd.slice()};if(o.xw>0)return{m:"xw",n:o.xw,wd:[]};if(o.ev===2||o.ev===3)return{m:"ev"+o.ev,n:3,wd:[]};if(o.ev===7)return{m:"xw",n:1,wd:[]};if(o.dl||!free)return{m:"day",n:3,wd:[]};return{m:"free",n:3,wd:[]}}
function rhApply(o,st){delete o.ev;delete o.xw;delete o.wd;delete o.dl;if(st.m==="wd"&&st.wd.length)o.wd=st.wd.slice().sort((a,b)=>a-b);else if(st.m==="xw")o.xw=st.n;else if(st.m==="ev2")o.ev=2;else if(st.m==="ev3")o.ev=3;else if(st.m==="day"&&!o.when)o.dl=1}
function rhHTML(st,free){const M=[...(free?[["free","Quand tu veux"]]:[]),["day","Chaque jour"],...(free?[]:[["ev2","1 jour sur 2"],["ev3","1 jour sur 3"]]),["xw","X fois par semaine"],["wd","Jours précis"]];
  return`<div class="rhm">${M.map(([k,l])=>`<button type="button" class="qchip" data-rh="${k}" aria-pressed="${st.m===k}">${l}</button>`).join("")}</div>
  ${st.m==="xw"?`<div class="rhx"><button type="button" class="rhpm" data-d="-1" aria-label="Moins">−</button><b>${st.n} fois</b><button type="button" class="rhpm" data-d="1" aria-label="Plus">+</button><span>par semaine, les jours que tu veux</span></div>`:""}
  ${st.m==="wd"?`<div class="rhw">${WDL.map((l,i)=>`<button type="button" data-wd="${i}" aria-pressed="${st.wd.includes(i)}" aria-label="${WDN[i]}">${l}</button>`).join("")}</div><div class="rhq"><button type="button" class="lnk" data-q="sem">En semaine</button><button type="button" class="lnk" data-q="we">Le week-end</button></div>`:""}`}
function rhWire(root,st,redraw){root.querySelectorAll("[data-rh]").forEach(b=>b.onclick=()=>{st.m=b.dataset.rh;if(st.m==="wd"&&!st.wd.length)st.wd=[wdOf(dayKey(Date.now()))];redraw()});
  root.querySelectorAll(".rhpm").forEach(b=>b.onclick=()=>{st.n=Math.max(1,Math.min(6,st.n+ +b.dataset.d));redraw()});
  root.querySelectorAll("[data-wd]").forEach(b=>b.onclick=()=>{const i=+b.dataset.wd;st.wd=st.wd.includes(i)?st.wd.filter(x=>x!==i):[...st.wd,i];redraw()});
  root.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{st.wd=b.dataset.q==="sem"?[0,1,2,3,4]:[5,6];redraw()})}
function rhPick(o,title,free,cb){const st=rhState(o,free),p=document.createElement("div");p.className="bpop rapop";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Rythme");document.body.appendChild(p);
  const close=()=>p.remove();p.onclick=e=>{if(e.target===p)close()};
  const draw=()=>{p.innerHTML=`<div class="bpc rap qc"><div class="raph"><h3>Rythme</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div><p class="qcsub"></p>${rhHTML(st,free)}<button type="button" class="btn primary qcgo">Valider</button></div>`;
    p.querySelector(".qcsub").textContent=title;rhWire(p,st,draw);p.querySelector(".raclose").onclick=close;
    p.querySelector(".qcgo").onclick=()=>{if(st.m==="wd"&&!st.wd.length){toast("Choisis au moins un jour");return}rhApply(o,st);close();sfx("coin");cb&&cb()}};draw()}

// ---- création rapide
const DIFF=[["Geste",3,1],["Petit",10,2],["Moyen",20,3],["Gros",35,4]];
const QC_DOM=[["sport","Sport"],["maison","Maison"],["soi","Soi"],["social","Amis"],["famille","Famille"],["travail","Travail"],["perso","Talent"],["nourriture","Cuisine"]];
const RIC_KEYS=["soleil","lune","dents","lit","douche","visage","barbe","fenetre","eau","sport","lire","medit","note","repas","ecran","vit"];
function icFromName(n){for(const[k,re]of RK)if(re.test(n))return k;return null}
// ---- création pas à pas (questionnaire)
const QC_GOALDOM={forme:"sport",chez:"maison",manger:"nourriture",famille:"famille",potes:"social",job:"travail",son:"perso",apprendre:"perso",moral:"soi",sommeil:"soi",ecrans:"soi",argent:"maison"};
const QC_CATRE=[["maison",/déménag|appart|logement|meuble/i],["sport",/sport|courir|\bcourse à pied|pompe|squat|gainage|muscu|vélo|\bmarche|étire|yoga|\bnage|natation|\bfoot|abdos|\d+ ?km\b/i],["nourriture",/cuisin|repas|manger|recette|légume|fruit|eau\b|boire|petit-déj|dîner|déjeuner/i],["maison",/rang|vaisselle|lessive|ménage|aspir|linge|course|poubelle|chambre|garage|plante|draps/i],["famille",/maman|papa|parent|famille|frère|sœur|soeur|grand-|mamie|papi/i],["social",/ami|pote|sortie|appeler|message|nouvelles|soirée/i],["travail",/travail|mail|cv|candidat|dossier|réunion|boulot|bureau|projet pro|concentration/i],["perso",/son|musique|dessin|guitare|piano|écrire|photo|lire|livre|film|apprendre|langue|code/i],["soi",/médit|respir|journal|écran|dormir|coucher|soin|douche|visage|calme|pause/i]];
function qcCatGuess(n){for(const[c,re]of QC_CATRE)if(re.test(n))return c;return null}
function qcDiffGuess(n){const m=durOf(n);if(!m)return null;return m<5?0:m<=15?1:m<=40?2:3}
function qcSugs(kind){const s=sitOf(),doms=[...new Set([...((s&&s.goals)||[]).map(g=>QC_GOALDOM[g]).filter(Boolean),...QC_DOM.map(d=>d[0])])],out=[];
  for(let r=0;r<3&&out.length<6;r++)doms.forEach(d=>{const L=(QC_TPL[d]||[]).filter(t=>t[1]===kind);if(L[r]&&out.length<6&&!out.includes(L[r]))out.push(L[r])});return out}
function qcOpen(kind,opt){opt=opt||{};const E=opt.edit||null;
  const st={k:kind||"",name:"",ic:null,icSet:false,mo:"any",cat:opt.cat||null,catSet:!!opt.cat,diff:1,diffSet:false,rh:{m:"free",n:3,wd:[]},steps:[],due:"",dueM:"none",stepsMode:"me",edit:!!E,pick:""};
  if(E){st.name=E.name||E.n||"";if(kind==="act"){st.cat=E.cat;st.catSet=true;st.mo=E.mo||"any";const i=DIFF.findIndex(d=>d[1]===E.xp);st.diff=i>=0?i:1;st.diffSet=true;if(E.ic){st.ic=E.ic;st.icSet=true}st.rh=rhState(E,true)}}
  const steps=()=>(st.k==="act"?["type","name","when","rh","size","recap"]:st.k==="prj"?["type","name","steps","due","size","recap"]:["type"]).filter(x=>!(E&&x==="type"));
  let si=kind?(E?steps().length-1:1):0;
  const p=document.createElement("div");p.className="bpop rapop qcw";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label",E?"Modifier":"Créer");document.body.appendChild(p);
  const close=()=>{p.remove();opt.done&&opt.done()};p.onclick=e=>{if(e.target===p)close()};
  const go=d=>{si=Math.max(0,Math.min(steps().length-1,si+d));draw()};const goTo=n=>{si=steps().indexOf(n);draw()};
  const ic=()=>st.icSet?st.ic:(icFromName(st.name)||st.ic||null);
  const cat=()=>st.catSet&&st.cat?st.cat:(qcCatGuess(st.name)||st.cat||"soi");
  const diff=()=>st.diffSet?st.diff:(qcDiffGuess(st.name)??st.diff);
  const rhL=()=>{if(st.rh.m==="free")return"Quand tu veux";const o={};rhApply(o,st.rh);return rhLab(o)||"Chaque jour"};
  const tpl=t=>{st.k=t[1];st.name=t[0];st.diff=t[3];st.diffSet=true;if(RKI[t[2]]){st.ic=t[2];st.icSet=true}if(CATS[t[2]]){st.cat=t[2];st.catSet=true}
    if(t[4])st.rh={n:3,wd:[],...t[4],wd:(t[4].wd||[]).slice()};if(t[6]){st.steps=t[6].slice();st.stepsMode="me"}sfx("blip");goTo("recap")};
  const opt3=(L,cur,attr)=>`<div class="qwo">${L.map(([v,l,sm])=>`<button type="button" class="qwb" data-${attr}="${v}" aria-pressed="${cur===v}"><b>${l}</b>${sm?`<small>${sm}</small>`:""}</button>`).join("")}</div>`;
  const draw=()=>{const S2=steps(),n=S2[si],last=S2.length-1;let h="",q="";
    if(n==="type"){q="Tu veux créer quoi ?";h=opt3([["act","Une bonne action","Quand tu veux, ou avec un rythme"],["prj","Un projet","Une grosse tâche découpée en étapes"]],st.k,"k")}
    else if(n==="name"){q=st.k==="prj"?"Quel est ton projet ?":"Comment tu l'appelles ?";const sg=qcSugs(st.k);
      h=`<input class="qcname qwname" maxlength="${st.k==="prj"?50:40}" placeholder="${st.k==="act"?"Ex. Courir 20 min":"Ex. Ranger le garage"}" aria-label="Nom"><p class="qwhint" hidden>Ajoute une durée ou un nombre (10 min, 20 pages…) : c'est plus facile à valider.</p>
      ${sg.length&&!E?`<p class="qwsub">Ou pars d'une idée :</p><div class="qwsug">${sg.map((t,i)=>`<button type="button" class="qwsg" data-sg="${i}">${t[1]!=="prj"&&RKI[t[2]]?`<span class="qcti">${rkSvg(t[2])}</span>`:""}<span></span></button>`).join("")}</div>`:""}
      <button type="button" class="btn primary qwnext"${st.name.trim()?"":" disabled"}>Suivant</button>`}
    else if(n==="when"){q="Quand est-ce que tu le fais ?";
      h=opt3([["any","Quand je veux",""],["matin","Le matin",""],["aprem","L'après-midi",""],["soir","Le soir",""]],st.mo,"mo")}
    else if(n==="rh"){q="À quel rythme ?";const M=[...(st.k==="act"?[["free","Quand je veux","Pas d'obligation"]]:[]),["day","Chaque jour",""],["xw","Quelques fois par semaine",""],["wd","Certains jours",""]];
      h=opt3(M,st.rh.m,"rh")+(st.rh.m==="xw"?`<div class="rhx qwx"><button type="button" class="rhpm" data-d="-1" aria-label="Moins">−</button><b>${st.rh.n} fois</b><button type="button" class="rhpm" data-d="1" aria-label="Plus">+</button><span>par semaine</span></div><button type="button" class="btn primary qwnext">Suivant</button>`:"")
        +(st.rh.m==="wd"?`<div class="rhw qwx">${WDL.map((l,i)=>`<button type="button" data-wd="${i}" aria-pressed="${st.rh.wd.includes(i)}" aria-label="${WDN[i]}">${l}</button>`).join("")}</div><div class="rhq"><button type="button" class="lnk" data-q="sem">En semaine</button><button type="button" class="lnk" data-q="we">Le week-end</button></div><button type="button" class="btn primary qwnext"${st.rh.wd.length?"":" disabled"}>Suivant</button>`:"")}
    else if(n==="size"){q=st.k==="prj"?"Chaque étape te prend combien de temps ?":"Ça te prend combien de temps ?";const d=diff();
      h=opt3([["0","Moins de 5 min","+3 XP"],["1","Un quart d'heure","+10 XP"],["2","Une demi-heure","+20 XP"],["3","Une heure ou plus","+35 XP"]],String(st.diffSet||qcDiffGuess(st.name)!=null?d:-1),"df")}
    else if(n==="steps"){q="Les étapes de ton projet";
      h=st.stepsMode?`<ol class="qcst">${st.steps.map((s,i)=>`<li><span></span><button type="button" data-rmst="${i}" aria-label="Retirer l'étape">${ICO("close",14)}</button></li>`).join("")}</ol>
        <form class="qcadd"><input maxlength="60" placeholder="${st.steps.length?"Étape suivante":"Première étape"}" aria-label="Nouvelle étape"><button type="submit" class="btn" aria-label="Ajouter l'étape">${ICO("check",18)}</button></form>
        <button type="button" class="btn primary qwnext"${st.steps.length>=2?"":" disabled"}>${st.steps.length>=2?"Suivant":"Au moins 2 étapes"}</button>`
        :opt3([["ai","Claude les découpe pour moi","Compte comme un court message Claude"],["me","Je les écris moi-même",""]],"","sm")}
    else if(n==="due"){q="Pour quand ?";h=opt3([["none","Pas de date",""],["week","Cette semaine","Avant dimanche"],["month","Ce mois-ci","Avant la fin du mois"],["pick","Choisir une date",""]],st.dueM,"due")+(st.dueM==="pick"?`<input type="date" class="qcdue qwx" value="${st.due}" aria-label="Échéance"><button type="button" class="btn primary qwnext"${st.due?"":" disabled"}>Suivant</button>`:"")}
    else if(n==="recap"){q=E?"Tout est bon ?":"Ta nouvelle quête";const k=st.k,c=cat(),C=CATS[c]||{},I=ic(),kd=k==="prj"?prjKind({id:"x"+st.name.length,cat:c}):null,x=DIFF[diff()][1];
      const full=!E&&k==="prj"&&(S.g.prj||[]).filter(x=>!x.won).length>=3;
      h=`<div class="qwcard" style="--zc:${C.c||"var(--gold)"}">${k==="prj"?`<span class="qwmon">${rkSvg((typeof SQ_IC!=="undefined"&&SQ_IC[c])||"dossier")}</span>`:`<button type="button" class="qwic" data-ed="ic" aria-label="Changer l'icône">${I?rkSvg(I):(typeof CAT_IC!=="undefined"&&CAT_IC[c]?`<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--zc)">${CAT_IC[c]}</svg>`:ICO("spark",22))}</button>`}<span class="qwct"><small>${k==="act"?"Bonne action":"Projet"} · <button type="button" class="lnk qwcat" data-ed="cat">${esc(C.label||"Soi")}</button></small><b></b><em>${k==="prj"?`${st.steps.length} étapes · +${x} XP chacune${st.due?" · avant le "+new Date(st.due+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long"}):""}`:`${[({any:"",matin:"Le matin",aprem:"L'après-midi",soir:"Le soir"})[st.mo],rhL()].filter(Boolean).join(" · ")} · +${x} XP`}</em></span></div>
        ${st.pick==="ic"&&k!=="prj"?`<div class="qcic">${RIC_KEYS.map(v=>`<button type="button" data-ic="${v}" aria-pressed="${I===v}" aria-label="Icône ${v}">${rkSvg(v)}</button>`).join("")}</div>`:""}
        ${st.pick==="cat"?`<div class="qcdom">${QC_DOM.map(([d,l])=>`<button type="button" class="qchip sm" data-cat="${d}" aria-pressed="${c===d}">${l}</button>`).join("")}</div>`:""}
        <p class="qwsub">Touche l'icône ou le domaine pour changer.</p>${full?`<p class="hint">Déjà 3 projets en cours.</p>`:""}
        <button type="button" class="btn primary qwgo"${full?" disabled":""}>${E?"Enregistrer":k==="act"?"Créer cette action":"Lancer le projet"}</button>`}
    p.innerHTML=`<div class="bpc rap qc qwz"><div class="qwh">${si>0?`<button type="button" class="qwback" aria-label="Retour">${ICO("chev",18)}</button>`:"<span></span>"}<span class="qwprog" aria-label="Étape ${si+1} sur ${S2.length}">${S2.map((_,i)=>`<i class="${i<=si?"on":""}"></i>`).join("")}</span><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
      <h3 class="qwq">${q}</h3><div class="qwbody">${h}</div></div>`;
    p.querySelector(".raclose").onclick=close;{const b=p.querySelector(".qwback");if(b)b.onclick=()=>go(-1)}
    const next=()=>go(1),auto=()=>setTimeout(next,160);
    p.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{const ch=st.k!==b.dataset.k;st.k=b.dataset.k;if(ch){st.rh={m:"free",n:3,wd:[]}}sfx("blip");draw();auto()});
    {const nm=p.querySelector(".qwname");if(nm){nm.value=st.name;const hint=p.querySelector(".qwhint"),nb=p.querySelector(".qwnext");const upd=()=>{st.name=nm.value;nb.disabled=!st.name.trim();hint.hidden=st.k==="prj"||!st.name.trim()||/\d/.test(st.name)||st.name.trim().length<4};upd();nm.oninput=upd;
      nm.onkeydown=e=>{if(e.key==="Enter"&&st.name.trim()){e.preventDefault();if(st.k==="prj")next();else goTo("recap")}};nb.onclick=()=>{if(st.name.trim())next()};setTimeout(()=>nm.focus({preventScroll:true}),60);
      const sg=qcSugs(st.k);p.querySelectorAll("[data-sg]").forEach(b=>{const t=sg[+b.dataset.sg];b.querySelector("span:not(.qcti)").textContent=t[0];b.onclick=()=>tpl(t)});if(!nm.__qf){nm.__qf=1;try{qwFind(nm)}catch(e){}}}}
    p.querySelectorAll("[data-mo]").forEach(b=>b.onclick=()=>{st.mo=b.dataset.mo;draw();auto()});
    p.querySelectorAll("[data-rh]").forEach(b=>b.onclick=()=>{st.rh.m=b.dataset.rh;if(st.rh.m==="wd"&&!st.rh.wd.length)st.rh.wd=[wdOf(dayKey(Date.now()))];draw();if(st.rh.m!=="xw"&&st.rh.m!=="wd")auto()});
    p.querySelectorAll(".rhpm").forEach(b=>b.onclick=()=>{st.rh.n=Math.max(1,Math.min(6,st.rh.n+ +b.dataset.d));draw()});
    p.querySelectorAll("[data-wd]").forEach(b=>b.onclick=()=>{const i=+b.dataset.wd;st.rh.wd=st.rh.wd.includes(i)?st.rh.wd.filter(x=>x!==i):[...st.rh.wd,i];draw()});
    p.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{st.rh.wd=b.dataset.q==="sem"?[0,1,2,3,4]:[5,6];draw()});
    p.querySelectorAll("[data-df]").forEach(b=>b.onclick=()=>{st.diff=+b.dataset.df;st.diffSet=true;draw();auto()});
    p.querySelectorAll("[data-due]").forEach(b=>b.onclick=()=>{st.dueM=b.dataset.due;const t=new Date(dayKey(Date.now())+"T12:00");
      if(st.dueM==="none")st.due="";else if(st.dueM==="week"){t.setDate(t.getDate()+(6-wdOf(dayKey(Date.now()))));st.due=dayKey(t)}else if(st.dueM==="month"){st.due=dayKey(new Date(t.getFullYear(),t.getMonth()+1,0,12))}
      draw();if(st.dueM!=="pick")auto()});
    {const d=p.querySelector(".qcdue");if(d)d.onchange=()=>{st.due=d.value;draw()}}
    p.querySelectorAll("[data-sm]").forEach(b=>b.onclick=()=>{st.stepsMode=b.dataset.sm;draw();setTimeout(()=>{const i=p.querySelector(".qcadd input");i&&i.focus()},60)});
    p.querySelectorAll("[data-rmst]").forEach(b=>b.onclick=()=>{st.steps.splice(+b.dataset.rmst,1);draw()});
    p.querySelectorAll(".qcst li span").forEach((s,i)=>s.textContent=st.steps[i]);
    {const f=p.querySelector(".qcadd");if(f)f.onsubmit=e=>{e.preventDefault();const v=f.querySelector("input").value.trim();if(!v)return;if(st.steps.length>=12){toast("12 étapes maximum");return}st.steps.push(v.slice(0,60));draw();setTimeout(()=>{const i=p.querySelector(".qcadd input");i&&i.focus()},0)}}
    p.querySelectorAll(".qwnext").forEach(b=>{if(!b.onclick)b.onclick=next});
    {const t=p.querySelector(".qwct b");if(t)t.textContent=st.name.trim()}
    p.querySelectorAll("[data-ed]").forEach(b=>b.onclick=()=>{st.pick=st.pick===b.dataset.ed?"":b.dataset.ed;draw()});
    p.querySelectorAll("[data-ic]").forEach(b=>b.onclick=()=>{st.ic=b.dataset.ic;st.icSet=true;st.pick="";draw()});
    p.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{st.cat=b.dataset.cat;st.catSet=true;st.pick="";draw()});
    {const g=p.querySelector(".qwgo");if(g)g.onclick=()=>qcSave(st,E,{ic:ic(),cat:cat(),diff:diff()},close)}};
  draw()}

function qcSave(st,E,g,close){const name=st.name.trim();if(!name)return;const ts=Date.now(),k=st.k;
  if(E){if(k==="act"){E.name=name.slice(0,60);E.cat=g.cat;E.xp=DIFF[g.diff][1];if(g.ic)E.ic=g.ic;if(st.mo!=="any")E.mo=st.mo;else delete E.mo;rhApply(E,st.rh)}
    sfx("badge");save();close();render();toast("Modifié");return}
  if(k==="act"){const a={id:"u"+ts.toString(36),name:name.slice(0,60),cat:g.cat,xp:DIFF[g.diff][1],...(g.ic?{ic:g.ic}:{}),...(st.mo!=="any"?{mo:st.mo}:{})};rhApply(a,st.rh);S.actions.push(a);toast(rhOn(a)?`Action créée · <span class="p">${rhLab(a)}</span>`:"Action créée")}
  else{if(!Array.isArray(S.g.prj))S.g.prj=[];S.g.prj.push({id:"p"+ts.toString(36),n:name.slice(0,50),cat:g.cat,d:g.diff,st:st.steps.map(t=>({t})),...(st.due?{due:st.due}:{}),ct:ts});toast("Projet lancé : à toi de le battre")}
  sfx("badge");save();close();render()}

// ---- Cette semaine : bonnes actions avec un rythme
function wkInfo(a){const tk=dayKey(Date.now()),W=wkKeys(tk),cnt={};S.log.forEach(e=>{if(e.a===a.id&&!e.bonus){const k=dayKey(e.t);if(W.includes(k))cnt[k]=(cnt[k]||0)+1}});
  const doneDays=W.filter(k=>cnt[k]),n=Object.values(cnt).reduce((s,v)=>s+v,0),todayDone=!!cnt[tk],wi=wdOf(tk);
  let goal,due;if(a.wd&&a.wd.length){goal=a.wd.length;due=a.wd.includes(wi)&&!todayDone}else if(a.xw>0){goal=a.xw;due=n<a.xw&&!todayDone}else{goal=7;due=!todayDone}
  const left=a.wd&&a.wd.length?a.wd.filter(i=>i>=wi&&!cnt[W[i]]).length:goal-Math.min(goal,a.xw?n:doneDays.length);
  return{W,cnt,n:a.xw?n:doneDays.length,goal,due,todayDone,wi,left}}
const MO_L={matin:"le matin",aprem:"l'après-midi",soir:"le soir"};
function renderWk(){const box=$("wkBox");if(!box||!S.g)return;const L=S.actions.filter(a=>rhOn(a));
  if(!L.length){box.innerHTML=`<div class="head"><h2>Cette semaine</h2></div><button type="button" class="wkcta">${ICO("plus",18)}<span><b>Donne un rythme à tes actions</b><small>Ex. 3 fois par semaine.</small></span></button>`;box.querySelector(".wkcta").onclick=()=>qcOpen("act");return}
  const R=L.map(a=>({a,i:wkInfo(a)})).sort((x,y)=>(y.i.due-x.i.due)||(x.i.todayDone-y.i.todayDone));const dn=R.filter(r=>r.i.n>=r.i.goal).length;
  box.innerHTML=`<div class="head"><h2>Cette semaine<span class="count">${dn}/${R.length}</span></h2><button type="button" class="btn edbtn wkadd" aria-label="Créer une action avec un rythme" title="Créer"><svg class="ic pxic" viewBox="0 0 12 12" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><rect x="5" y="1" width="2" height="1.02"/><rect x="5" y="2" width="2" height="1.02"/><rect x="5" y="3" width="2" height="1.02"/><rect x="5" y="4" width="2" height="1.02"/><rect x="1" y="5" width="10" height="1.02"/><rect x="1" y="6" width="10" height="1.02"/><rect x="5" y="7" width="2" height="1.02"/><rect x="5" y="8" width="2" height="1.02"/><rect x="5" y="9" width="2" height="1.02"/><rect x="5" y="10" width="2" height="1.02"/></svg></button></div>
  <div class="wkl">${R.map(({a,i},k)=>{const C=CATS[a.cat]||{},full=i.n>=i.goal;
    const marks=a.wd&&a.wd.length?WDL.map((l,j)=>`<i class="${a.wd.includes(j)?"on":""}${i.cnt[i.W[j]]?" ok":""}${j===i.wi?" td":""}">${l}</i>`).join(""):a.xw?Array.from({length:a.xw},(_,j)=>`<i class="dot${j<i.n?" ok":""}"></i>`).join(""):WDL.map((l,j)=>`<i class="on${i.cnt[i.W[j]]?" ok":""}${j===i.wi?" td":""}">${l}</i>`).join("");
    return`<button type="button" class="wkr${i.due?" due":""}${full?" full":""}${i.todayDone?" tdd":""}" data-k="${k}" style="--zc:${C.c||"var(--gold)"}"><span class="wki">${a.ic&&RKI[a.ic]?rkSvg(a.ic):`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CAT_IC[a.cat]||CAT_IC.soi||""}</svg>`}</span>
      <span class="wkt"><b></b><small>${full?"Objectif de la semaine atteint":i.todayDone?"Fait aujourd'hui":i.due?"À faire aujourd'hui"+(a.mo?" · "+MO_L[a.mo]:""):a.xw?`Encore ${i.goal-i.n} cette semaine`:"Pas prévu aujourd'hui"}</small><span class="wkm${a.xw&&!(a.wd&&a.wd.length)?" dots":""}">${marks}</span></span>
      <span class="wkx">${a.xw?`${i.n}/${i.goal}`:""}<em>+${a.xp}</em></span></button>`}).join("")}</div>`;
  box.querySelectorAll(".wkr").forEach(b=>{const r=R[+b.dataset.k];b.querySelector(".wkt b").textContent=r.a.name;b.setAttribute("aria-label",r.a.name+", "+rhLab(r.a));
    b.onclick=ev=>{const tk=dayKey(Date.now()),n=S.log.filter(e=>e.a===r.a.id&&dayKey(e.t)===tk).length;actDo(r.a,b,ev,n)};
    let lp=0;b.oncontextmenu=e=>{e.preventDefault();rhPick(r.a,r.a.name,true,()=>{save();render()})};
    b.onpointerdown=()=>{lp=setTimeout(()=>{lp=-1;rhPick(r.a,r.a.name,true,()=>{save();render()})},600)};b.onpointerup=b.onpointerleave=()=>{if(lp>0)clearTimeout(lp)};
    b.addEventListener("click",e=>{if(lp===-1){e.stopImmediatePropagation();lp=0}},true)});
  box.querySelector(".wkadd").onclick=()=>qcOpen("act")}

// ---- Projets en étapes
function prjKind(p){const L=BOSS_CAT[p.cat];let h=0;for(const ch of String(p.id))h=(h*31+ch.charCodeAt(0))>>>0;if(L&&L.length){const b=L[h%L.length];return[b[2],b[3]]}const K=["slime","ghost","shroom","bat"];return[K[h%K.length],["#5fae4f","#3a9ad8","#c86a3a","#8a5ad0"][h%4]]}
function prjDue(p){if(!p.due)return"";const d=Math.round((new Date(p.due+"T12:00")-new Date(dayKey(Date.now())+"T12:00"))/864e5);return d<0?"en retard":d===0?"aujourd'hui":d===1?"demain":"J-"+d}
let prjOpenId="",prjArm="";
function prjCard(p){const C=CATS[p.cat]||{},kd=prjKind(p),N=p.st.length,done=p.st.filter(s=>s.d).length,nx=p.st.findIndex(s=>!s.d),open=prjOpenId===p.id,du=prjDue(p),x=DIFF[p.d||0][1];
  return`<div class="prc${open?" open":""}" data-id="${p.id}" style="--zc:${C.c||"var(--gold)"}"><button type="button" class="prh" aria-expanded="${open}"><span class="prm">${rkSvg((typeof SQ_IC!=="undefined"&&SQ_IC[p.cat])||"dossier")}</span><span class="prt"><small>${(C.label||"Projet")} · ${p.arc?"arc":"projet"}${du?` · <em class="${du==="en retard"?"late":""}">${du}</em>`:""}</small><b></b>
    <span class="prbarw" aria-label="${done} étapes sur ${N}"><span class="prbar"><i style="width:${Math.round(done/N*100)}%"></i></span><small>${done}/${N}</small></span></span></button>
    ${nx>=0?`<div class="prn"><span><small>Étape ${nx+1}/${N}</small><b class="prnt"></b></span><button type="button" class="btn primary prgo" data-i="${nx}">Fait <small>+${x}</small></button></div>`:""}
    ${open?`<ol class="prl">${p.st.map((s,i)=>`<li class="${s.d?"ok":""}"><button type="button" data-i="${i}" ${s.d?"disabled":""} aria-label="${s.d?"Fait":"Marquer fait"}">${s.d?ICO("check",14):""}</button><span></span></li>`).join("")}</ol>
      <form class="pradd"><input maxlength="60" placeholder="Ajouter une étape" aria-label="Ajouter une étape"><button type="submit" class="btn" aria-label="Ajouter">${ICO("check",16)}</button></form>
      <div class="prft"><button type="button" class="lnk prdel">Abandonner ce projet</button></div>`:""}</div>`}
function renderPrj(){if(!S.g)return;const P=(S.g.prj||[]),A=P.filter(p=>!p.won),W=P.filter(p=>p.won).length;
  ["prjBox2"].forEach(id=>{const box=$(id);if(!box)return;const inBoss=id==="prjBox2";
    if(!A.length&&!inBoss){box.innerHTML="";box.classList.add("voff");return}box.classList.remove("voff");
    box.innerHTML=`<div class="head"><h2>${inBoss?"Mes projets":"Projets"}<span class="count">${A.length}</span></h2><button type="button" class="btn edbtn prnew" aria-label="Lancer un projet" title="Lancer un projet"><svg class="ic pxic" viewBox="0 0 12 12" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><rect x="5" y="1" width="2" height="1.02"/><rect x="5" y="2" width="2" height="1.02"/><rect x="5" y="3" width="2" height="1.02"/><rect x="5" y="4" width="2" height="1.02"/><rect x="1" y="5" width="10" height="1.02"/><rect x="1" y="6" width="10" height="1.02"/><rect x="5" y="7" width="2" height="1.02"/><rect x="5" y="8" width="2" height="1.02"/><rect x="5" y="9" width="2" height="1.02"/><rect x="5" y="10" width="2" height="1.02"/></svg></button></div>
    ${inBoss&&sitOf()&&sitOf().note&&!arcCur()?`<button type="button" class="wkcta arccta2">${ICO("spark",18)}<span><b>Faire de « ${esc(sitOf().note.slice(0,40))} » un arc</b><small>Ton objectif découpé en chapitres.</small></span></button>`:""}
    ${A.length?A.map(prjCard).join(""):`<button type="button" class="wkcta prcta">${ICO("plus",18)}<span><b>Lance un projet</b><small>Une grosse tâche en étapes.</small></span></button>`}${W?`<p class="hint prwon">${W} projet${W>1?"s":""} terminé${W>1?"s":""}</p>`:""}`;
    box.querySelectorAll(".prc").forEach(c=>{const p=P.find(x=>x.id===c.dataset.id);c.querySelector(".prt b").textContent=p.n;const nt=c.querySelector(".prnt");if(nt)nt.textContent=p.st[p.st.findIndex(s=>!s.d)].t;
      c.querySelectorAll(".prl li span").forEach((s,i)=>s.textContent=p.st[i].t);
      c.querySelector(".prh").onclick=()=>{prjOpenId=prjOpenId===p.id?"":p.id;prjArm="";renderPrj()};
      c.querySelectorAll("[data-i]").forEach(b=>b.onclick=ev=>{ev.stopPropagation();prjStep(p,+b.dataset.i,c,b,ev)});
      const f=c.querySelector(".pradd");if(f)f.onsubmit=e=>{e.preventDefault();const v=f.querySelector("input").value.trim();if(!v)return;if(p.st.length>=12){toast("12 étapes maximum");return}p.st.push({t:v.slice(0,60)});save();renderPrj()};
      const dl=c.querySelector(".prdel");if(dl)dl.onclick=()=>undoAfter("Projet abandonné",()=>{S.g.prj=(S.g.prj||[]).filter(x=>x!==p);save();renderPrj()})});
    box.querySelectorAll(".prnew,.prcta").forEach(b=>b.onclick=()=>qcOpen("prj"));{const a=box.querySelector(".arccta2");if(a)a.onclick=()=>arcAsk()}})}
function prjStep(p,i,card,btn,ev){if(!p.st[i]||p.st[i].d)return;p.st[i].d=Date.now();const last=p.st.every(s=>s.d);const m=card.querySelector(".prm"),x=DIFF[p.d||0][1];
  if(m&&!matchMedia("(prefers-reduced-motion: reduce)").matches){m.classList.remove("hit");void m.offsetWidth;m.classList.add("hit");const h=card.querySelectorAll(".prhp i.on");const hi=h[h.length-1];if(hi)hi.classList.add("pop")}
  try{sfx("hit")}catch(e){}
  setTimeout(()=>{complete({id:"prj-"+p.id,name:p.n+" · "+p.st[i].t,cat:CATS[p.cat]?p.cat:"soi",xp:x},btn,ev,0,{prj:p.id,ps:i});if(last){p.won=Date.now();S.g.chests=(S.g.chests||0)+1;save();setTimeout(()=>prjWin(p),500)}},380)}
function prjWin(p){const kd=prjKind(p),bonus=DIFF[p.d||0][1]*2;sfx("open",3);skyCheer(true);const o=document.createElement("div");o.className="bpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Projet terminé");
  o.innerHTML=`<div class="bpc prwin" style="--tc:var(--gold)"><div class="prwm">${rkSvg((typeof SQ_IC!=="undefined"&&SQ_IC[p.cat])||"dossier")}</div><p class="bph">Projet terminé</p><h3></h3><p class="bpd">${p.st.length} étapes bouclées. Tu gagnes un coffre et +${bonus} XP.</p><button type="button" class="btn primary">Récupérer</button></div>`;
  o.querySelector("h3").textContent=p.n;document.body.appendChild(o);const go=o.querySelector("button");go.focus({preventScroll:true});
  go.onclick=ev=>{o.remove();complete({id:"prjwin-"+p.id,name:"Projet terminé · "+p.n,cat:CATS[p.cat]?p.cat:"soi",xp:bonus},document.querySelector(".qxp")||document.body,ev,0,{prj:p.id,win:1})}}
