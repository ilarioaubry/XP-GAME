
  (function(){
    const P2=n=>String(n).padStart(2,"0");
    const toD=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d,12)};
    const toK=d=>d.getFullYear()+"-"+P2(d.getMonth()+1)+"-"+P2(d.getDate());
    const addD=(s,n)=>{const d=toD(s);d.setDate(d.getDate()+n);return toK(d)};
    const nDays=(a,b,wd)=>{if(b<a)return 0;let n=0;for(let d=toD(a),e=toD(b);d<=e;d.setDate(d.getDate()+1)){const w=d.getDay();if(!wd||(w>0&&w<6))n++}return n};
    const fmt=s=>toD(s).toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"});
    const WL=["D","L","M","M","J","V","S"];
    const ICS={cig:'<rect x="2" y="13" width="17" height="4" rx="1"/><path d="M15 13v4M21 13v4M18 9c0-2 2-2 2-4M21 9c0-2 1-2 1-3"/>',contrat:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18"/>',vacances:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',malade:'<path d="M14 4v6a4 4 0 11-4 0V4a2 2 0 014 0z"/>',examens:'<path d="M4 19V5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h12"/>',demenagement:'<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',autre:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>'};
    const ic=(k,s)=>`<svg viewBox="0 0 24 24" width="${s||20}" height="${s||20}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${typeof rkIn==="function"&&ICS_PX[k]?rkIn(ICS_PX[k]):ICS[k]||ICS.autre}</svg>`;
    // Types de période et leur effet sur les quêtes
    const PT={contrat:{l:"Contrat / travail",fx:"Les jours de travail suivent ta capacité « jour de travail »"},vacances:{l:"Vacances",cap:2,goal:1,fx:"+2 quêtes par jour"},malade:{l:"Malade / repos",cap:-9,goal:.4,soft:1,fx:"1 quête par jour, seulement les rituels de ton socle"},examens:{l:"Examens",max:2,goal:.7,fx:"2 quêtes max par jour"},demenagement:{l:"Déménagement",max:2,goal:.7,fx:"2 quêtes max par jour"},autre:{l:"Autre",fx:"Juste un compte à rebours"}};
    const MODS=[["sceneBox","Scène animée","Le décor en haut de l'écran"],["enBox","Énergie du matin","La question sur ta batterie"],["nowBox","Maintenant","La carte de la chose à faire tout de suite"],["plusBox","Plus de quêtes","Le raccourci vers les autres quêtes"],["wkBox","Cette semaine","Tes actions avec un rythme"],["sqBox","Quêtes spéciales","Amis, famille, musique…"],["gameBox","Coffres","Les coffres et récompenses"],["evtBox","Événements","Tes événements à venir"],["duoBox","Défi à deux","Les défis partagés"],["rtrBox","Rattrapage","Les rituels manqués à rattraper"],["xmBox","Saison des fêtes","Les quêtes de saison"]];
    const UN={j:[1,"jour","jours"],s:[7,"semaine","semaines"],m:[30,"mois","mois"]};
    const SUG=[["Coiffeur",6,"s"],["Dentiste",6,"m"],["Changer les draps",2,"s"],["Laver les serviettes",1,"s"],["Nettoyer le frigo",1,"m"],["Couper mes ongles",2,"s"],["Faire le ménage à fond",1,"m"],["Vider la poubelle de la salle de bain",2,"s"],["Bilan chez le médecin",12,"m"]];
        let editId=null,editFrom=null,lEdit=null,lAll=false,lPre=null,force=false;
    const tkNow=()=>dayKey(Date.now());
    const hh=t=>{const[a,b]=(t||"0:0").split(":");return(+a)+"h"+(b&&b!=="00"?b:"")};
    const V=()=>{const g=S.g;if(!g.vie||typeof g.vie!=="object")g.vie={};const v=g.vie;
      if(typeof v.cap!=="number")v.cap=3;if(typeof v.capW!=="number")v.capW=2;if(!Array.isArray(v.pri))v.pri=[];if(!Array.isArray(v.wd))v.wd=[1,2,3,4,5];
      if(typeof v.wf!=="string")v.wf="09:00";if(typeof v.wt!=="string")v.wt="17:00";if(typeof v.job!=="boolean")v.job=false;
      if(!v.track||typeof v.track!=="object")v.track={cig:true,per:true};if(!Array.isArray(v.off))v.off=[];if(!v.pf||typeof v.pf!=="object")v.pf={};if(!v.pc||typeof v.pc!=="object")v.pc={};
      g.cig=g.cig&&typeof g.cig==="object"?g.cig:{};g.per=Array.isArray(g.per)?g.per:[];g.per.forEach(p=>{if(!PT[p.t])p.t="contrat"});g.last=Array.isArray(g.last)?g.last:[];return v};
    const actPer=tk=>{const L=(S.g.per||[]).filter(p=>p.s<=tk&&tk<=p.e);return L.find(p=>p.t==="malade")||L.find(p=>p.t!=="contrat"&&p.t!=="autre")||L.find(p=>p.t==="contrat")||L[0]||null};
    const workDay=tk=>{const v=V(),wd=toD(tk).getDay();if(!v.wd.includes(wd))return false;if(v.job)return true;return(S.g.per||[]).some(p=>p.t==="contrat"&&p.s<=tk&&tk<=p.e&&(!p.wd||(wd>0&&wd<6)))};
    // ---- Réglages lus par le reste de l'appli
    const vieCapBase=function(){try{if(!S||!S.g)return 3;const v=V(),tk=tkNow(),p=actPer(tk),T=p&&PT[p.t]||{};let c=workDay(tk)?v.capW:v.cap;if(T.cap)c+=T.cap;if(T.max)c=Math.min(c,T.max);return Math.max(1,Math.min(8,c))}catch(e){return 3}};
    // vieCap = vieCapBase (le cœur) → capacité choisie pour aujourd'hui (vieCapBase2) → ajustée selon énergie et sommeil. Ex-réécritures de correctifs.js.
    const vieCapBase2=function(){try{const v=S.g&&S.g.vie,tk=dayKey(Date.now());if(v&&v.capDay&&v.capDay.d===tk)return v.capDay.n}catch(e){}return vieCapBase()};
    window.vieCap=function(){try{const v=S.g&&S.g.vie,tk=dayKey(Date.now());if(v&&v.capDay&&v.capDay.d===tk)return v.capDay.n;
      if(v){v.cap=4;v.capW=2}let c=vieCapBase2();const e=enOf();if(e===1)c-=1;if(e===3)c+=1;const sl=((S.g.sleep||{})[tk]||{}).h;if(sl&&sl<6)c-=1;return Math.max(1,Math.min(6,c))}catch(e){return 3}};
    window.vieGoalF=function(){try{const tk=tkNow(),p=actPer(tk),T=p&&PT[p.t]||{};let f=T.goal||1;if(workDay(tk)&&f>.7)f=.7;return f}catch(e){return 1}};
    window.vieSoft=function(){try{const p=actPer(tkNow());return!!(p&&PT[p.t]&&PT[p.t].soft)}catch(e){return false}};
    window.viePri=function(cat){try{const i=V().pri.indexOf(cat);return i<0?9:i}catch(e){return 9}};
    window.vieMods=function(){try{if(!S||!S.g)return;const off=V().off;let st=document.getElementById("vieModCss");if(!st){st=document.createElement("style");st.id="vieModCss";document.head.appendChild(st)}
      const css=off.filter(id=>id!=="sceneBox"&&MODS.some(m=>m[0]===id)).map(id=>`html:not(#_m1):not(#_m2):not(#_m3):not(#_m4) body #${id}`).join(",");st.textContent=css?css+"{display:none!important}":""}catch(e){}};
    const rt=()=>{force=true;try{renderTrk();renderVie()}finally{force=false}};
    const busy=box=>{const ae=document.activeElement;return!force&&ae&&box.contains(ae)&&ae.matches("input,select,textarea")};
    // ---- La dernière fois que…
    const ago=(d,tk)=>{if(!d)return"Jamais noté";const n=nDays(d,tk,false)-1;if(n<=0)return"Aujourd'hui";if(n===1)return"Hier";if(n<14)return`Il y a ${n} jours`;if(n<60)return`Il y a ${Math.round(n/7)} semaines`;const m=Math.round(n/30);return m<12?`Il y a ${m} mois`:`Il y a ${Math.floor(n/365)} an${n>=730?"s":""}`};
    const evL=x=>{const u=UN[x.u]||UN.j;return x.n>1?`tous les ${x.n} ${u[2]}`:`chaque ${u[1]}`};
    const ratio=(x,tk)=>{if(!x.d)return 1.01;const n=nDays(x.d,tk,false)-1;return n/Math.max(1,x.n*(UN[x.u]||UN.j)[0])};
    const lRow=(x,r,tk,mini)=>{const td=x.d===tk,st=td?"ok":r>=1?"late":r>=.8?"soon":"ok";return`<div class="lst-r ${st}"><button type="button" class="lst-n" data-le="${x.id}"><b>${esc(x.name)}</b><small>${ago(x.d,tk)}${mini?"":" · "+evL(x)}</small></button><button type="button" class="lst-do${td?" dn":""}" data-ld="${x.id}" aria-label="${td?"Annuler":"Fait aujourd'hui"} : ${esc(x.name)}">${td?ICO("check",14)+" Fait":"Fait"}</button></div>`};
    function lastHTML(tk){const L=S.g.last;let h="";
      if(lEdit==="new")h+=lForm(null,tk);
      if(!L.length&&lEdit!=="new")return h+`<div class="lst-sug">${SUG.map((s,i)=>`<button type="button" data-sg="${i}">${esc(s[0])}</button>`).join("")}</div>`;
      const R=L.map(x=>({x,r:ratio(x,tk)})).sort((a,b)=>b.r-a.r),show=lAll?R:R.slice(0,6);
      h+=`<div class="trk-c lst">${show.map(({x,r})=>lEdit===x.id?`</div>${lForm(x,tk)}<div class="trk-c lst">`:lRow(x,r,tk)).join("")}</div>`.replace(/<div class="trk-c lst"><\/div>/g,"");
      if(R.length>6)h+=`<button type="button" class="lnk lst-more">${lAll?"Réduire":`Tout voir (${R.length})`}</button>`;
      return h}
    function lForm(x,tk){const p=x||lPre||{name:"",n:2,u:"s",d:tk};
      return`<form class="trk-c trk-f lst-f"><label>Quoi<input type="text" name="n" maxlength="50" value="${esc(p.name||"")}" placeholder="Ex. Coiffeur" autocomplete="off"></label>
      ${x?"":`<div class="lst-sug">${SUG.map((s,i)=>`<button type="button" data-sg="${i}">${esc(s[0])}</button>`).join("")}</div>`}
      <div class="two"><label>À refaire tous les<span class="lst-ev"><input type="number" name="ev" min="1" max="99" inputmode="numeric" value="${p.n}"><select name="u">${Object.keys(UN).map(k=>`<option value="${k}"${p.u===k?" selected":""}>${UN[k][2]}</option>`).join("")}</select></span></label>
      <label>Dernière fois<input type="date" name="d" value="${p.d||""}" max="${tk}"></label></div>
      <div class="acts">${x?`<button type="button" class="del">Supprimer</button>`:""}<button type="button" class="cancel">Annuler</button><button type="submit" class="ok">${x?"Enregistrer":"Ajouter"}</button></div></form>`}
    function bindLast(box,tk){const L=S.g.last;
      box.querySelectorAll(".lst-add").forEach(a=>a.onclick=()=>{lEdit=lEdit==="new"?null:"new";lPre=null;rt();const i=document.querySelector("#vieBox .lst-f input");if(i)i.focus()});
      box.querySelectorAll("[data-sg]").forEach(b=>b.onclick=()=>{const s=SUG[+b.dataset.sg];lEdit="new";lPre={name:s[0],n:s[1],u:s[2],d:tk};rt()});
      box.querySelectorAll("[data-le]").forEach(b=>b.onclick=()=>{lEdit=b.dataset.le;rt()});
      box.querySelectorAll("[data-ld]").forEach(b=>b.onclick=()=>{const x=L.find(y=>y.id===b.dataset.ld);if(!x)return;
        if(x.d===tk){x.d=x.pv||null;delete x.pv}else{x.pv=x.d;x.d=tk;try{const k=window.afMatch&&afMatch(x.name);if(k){S.g.afLast=S.g.afLast||{};S.g.afLast[k]=Date.now()}}catch(e){}try{toast(`Noté : <span class="p">${esc(x.name)}</span>`)}catch(e){}}save();rt()});
      const m=box.querySelector(".lst-more");if(m)m.onclick=()=>{lAll=!lAll;rt()};
      const f=box.querySelector(".lst-f");if(!f)return;
      f.querySelector(".cancel").onclick=()=>{lEdit=null;lPre=null;rt()};
      const dl=f.querySelector(".del");if(dl)dl.onclick=()=>undoAfter("Élément supprimé",()=>{S.g.last=L.filter(y=>y.id!==lEdit);lEdit=null;save();rt()});
      f.onsubmit=e=>{e.preventDefault();const name=f.querySelector("[name=n]").value.trim();if(!name){f.querySelector("[name=n]").focus();return}
        const o={name,n:Math.max(1,Math.min(99,parseInt(f.querySelector("[name=ev]").value)||1)),u:f.querySelector("[name=u]").value,d:f.querySelector("[name=d]").value||null};if(o.d&&o.d>tk)o.d=tk;
        if(lEdit==="new")L.push({id:"l"+Date.now().toString(36),...o});else{const x=L.find(y=>y.id===lEdit);if(x){Object.assign(x,o);delete x.pv}}lEdit=null;lPre=null;save();rt()}}
    // ---- Périodes
    function perStat(p,tk){const tot=nDays(p.s,p.e,p.wd),done=tk<p.s?0:nDays(p.s,tk>p.e?p.e:tk,p.wd),left=Math.max(0,tot-done),pct=tot?Math.round(done/tot*100):0,us=p.wd?"jours de travail":"jours",u=p.wd?"jour de travail":"jour";
      let st;if(tk<p.s){const k=nDays(tk,addD(p.s,-1),false);st=`Commence ${k===1?"demain":"dans "+k+" jours"} · ${fmt(p.s)}`}else if(tk>p.e)st=`Terminé le ${fmt(p.e)}, bravo`;else if(left===0)st=tk===p.e?"Dernier jour, tu y es !":"C'est bouclé, bravo !";else st=`Plus que ${left} ${left>1?us:u} · fin ${fmt(p.e)}`;
      const lbl=tk<p.s?"À venir":tk>p.e?"Terminé":`${p.wd?"Jour de travail":"Jour"} ${Math.max(done,1)} sur ${tot}`;return{tot,done,left,pct,st,lbl}}
    const perCard=(p,tk,cls)=>{const s=perStat(p,tk);return`<button type="button" class="trk-p ${cls||"trk-c"}${tk>p.e?" over":""}" data-p="${p.id}" aria-label="${esc(p.name)} : modifier"><span class="trk-row"><span class="trk-ic">${ICS_PX[p.t]?rkSvg(ICS_PX[p.t]):ic(p.t)}</span><span class="trk-t"><b>${esc(p.name)}</b><small>${s.lbl} · ${s.st}</small></span><span class="trk-pct">${s.pct}%</span></span><span class="trk-bar"><i style="width:${s.pct}%"></i></span></button>`};
    const perMini=(p,tk)=>{const s=perStat(p,tk);return`<button type="button" class="trk-p${tk>p.e?" over":""}" data-p="${p.id}" aria-label="${esc(p.name)} : ${s.lbl}, ${s.st}"><span class="trk-row"><span class="trk-ic">${ICS_PX[p.t]?rkSvg(ICS_PX[p.t]):ic(p.t)}</span><span class="trk-t"><b>${esc(p.name)}</b></span><span class="trk-pct">${tk>p.e?ICO("check",14):Math.max(s.done,1)+"/"+s.tot}</span></span><span class="trk-bar"><i style="width:${s.pct}%"></i></span></button>`};
    function perForm(p){const tk=tkNow(),s=p?p.s:tk,e=p?p.e:addD(tk,13),t=p?p.t:"contrat";
      return`<form class="trk-c trk-f per-f"><label>Type<select name="t">${Object.keys(PT).map(k=>`<option value="${k}"${t===k?" selected":""}>${PT[k].l}</option>`).join("")}</select></label>
      <label>Nom<input type="text" name="n" maxlength="40" value="${p?esc(p.name):"Contrat"}" autocomplete="off"></label>
      <div class="two"><label>Début<input type="date" name="s" value="${s}"></label><label>Fin (dernier jour)<input type="date" name="e" value="${e}"></label></div>
      <label class="ck"><input type="checkbox" name="wd"${p&&p.wd?" checked":""}>Compter seulement du lundi au vendredi</label><span class="hint"></span>
      <div class="acts">${p?`<button type="button" class="del">Supprimer</button>`:""}<button type="button" class="cancel">Annuler</button><button type="submit" class="ok">${p?"Enregistrer":"Ajouter"}</button></div></form>`}
    function bindPer(box){const g=S.g;
      box.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{editId=b.dataset.p;rt()});
      box.querySelectorAll(".per-add").forEach(b=>b.onclick=()=>{editId="new";rt();const i=document.querySelector("#vieBox .per-f [name=n]");if(i)i.focus()});
      const f=box.querySelector(".per-f");if(!f)return;
      const sI=f.querySelector("[name=s]"),eI=f.querySelector("[name=e]"),wI=f.querySelector("[name=wd]"),tI=f.querySelector("[name=t]"),nI=f.querySelector("[name=n]"),hint=f.querySelector(".hint"),eff=f.querySelector(".vie-eff");
      const upd=()=>{if(sI.value&&eI.value&&eI.value>=sI.value){const t=nDays(sI.value,eI.value,wI.checked);hint.textContent=`${t} ${wI.checked?"jours de travail":"jours"} au total`}else hint.textContent="La fin doit venir après le début"};
      tI.onchange=()=>{const names=Object.values(PT).map(x=>x.l.split(" /")[0]).concat("Contrat");if(!nI.value.trim()||names.includes(nI.value.trim()))nI.value=PT[tI.value].l.split(" /")[0];upd()};
      [sI,eI,wI].forEach(x=>x.oninput=upd);upd();
      f.querySelector(".cancel").onclick=()=>{editId=null;rt()};
      const dl=f.querySelector(".del");if(dl)dl.onclick=()=>undoAfter("Période supprimée",()=>{g.per=g.per.filter(p=>p.id!==editId);editId=null;save();rt()});
      f.onsubmit=e=>{e.preventDefault();if(!sI.value||!eI.value||eI.value<sI.value){upd();return}const o={t:tI.value,name:nI.value.trim()||PT[tI.value].l,s:sI.value,e:eI.value,wd:wI.checked};
        if(editId==="new")g.per.push({id:"p"+Date.now().toString(36),...o});else Object.assign(g.per.find(p=>p.id===editId)||{},o);editId=null;save();rt();try{render()}catch(e){}}}
    // ---- Proches
    const lastSeen=n=>{const a=(S.bondsLast||{})[n]||0,b=V().pc[n]?toD(V().pc[n]).getTime():0,t=Math.max(a,b);return t?dayKey(t):null};
    const pcLate=tk=>{const v=V();return Object.keys(v.pf).filter(n=>v.pf[n]>0).map(n=>{const d=lastSeen(n),days=d?nDays(d,tk,false)-1:999;return{n,d,days,r:days/v.pf[n]}}).filter(x=>x.r>=1).sort((a,b)=>b.r-a.r)};
    // ---- Aller vers Ma vie
    function goVie(anchor){try{subs.c="vie";localStorage.setItem("cq-subs",JSON.stringify(subs))}catch(e){}try{showView("c")}catch(e){}rt();setTimeout(()=>{const a=document.getElementById(anchor);if(a)a.scrollIntoView({block:"start",behavior:"smooth"})},120)}
    // ---- Bandeau du jour (onglet Quêtes)
    window.renderTrk=function(){
      const box=document.getElementById("trkBox");if(!box||!S||!S.g)return;if(busy(box))return;const v=V(),g=S.g,tk=tkNow();vieMods();
      const rows=[];
      const p=actPer(tk),T=p&&PT[p.t];
      if(v.track.cig){const n=g.cig[tk]||0,y=g.cig[addD(tk,-1)]||0;rows.push(`<div class="trk-row"><span class="trk-ic">${rkSvg("cigarette")}</span><span class="trk-t" aria-label="Cigarettes"><small>hier ${y}</small></span><button type="button" class="trk-b" data-c="-1" aria-label="Retirer une cigarette"${n?"":" disabled"}>−</button><span class="trk-n" aria-live="polite">${n}</span><button type="button" class="trk-b plus" data-c="1" aria-label="Ajouter une cigarette">+</button></div>`)}
      const forms=[];if(v.track.per)g.per.filter(x=>x.s<=tk&&tk<=x.e||(x.e<tk&&nDays(x.e,tk,false)<=2)).forEach(x=>{if(editId===x.id)forms.push(perForm(x));else rows.push(perMini(x,tk))});
      const late=g.last.map(x=>({x,r:ratio(x,tk)})).filter(o=>o.r>=1&&o.x.d!==tk||o.x.d===tk&&o.x.pv!==undefined).filter(o=>!(S.specials||[]).some(q=>(q.name||"").toLowerCase().includes(String(o.x.name||"").toLowerCase()))).sort((a,b)=>b.r-a.r).slice(0,3);
      late.forEach(o=>{if(lEdit===o.x.id)forms.push(lForm(o.x,tk));else rows.push(lRow(o.x,o.r,tk,1))});
      let mode="";const cap=vieCap();
      if(T&&p.t!=="contrat"&&p.t!=="autre")mode=`${ic(p.t,16)}<span>${esc(PT[p.t].l.split(" /")[0])}</span>`;
      else if(workDay(tk))mode=`${ic("contrat",16)}<span>${hh(v.wf)}–${hh(v.wt)}</span>`;
      if(!rows.length&&!mode&&!forms.length){box.innerHTML="";box.classList.add("voff");return}
      box.classList.remove("voff");
      box.innerHTML=(mode?`<button type="button" class="bnd-mode" data-govie="1" aria-label="Ma vie">${mode}</button>`:"")+(rows.length?`<div class="trk-c bnd">${rows.join("")}</div>`:"")+forms.join("");
      box.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{g.cig[tk]=Math.max(0,(g.cig[tk]||0)+(+b.dataset.c));const ks=Object.keys(g.cig).sort();while(ks.length>400)delete g.cig[ks.shift()];save();rt()});
      box.querySelectorAll("[data-pc]").forEach(b=>b.onclick=ev=>{const n=b.dataset.pc;try{bondAction(n,REL_ACTIONS.find(x=>x.k==="news"),b,ev)}catch(e){V().pc[n]=tk;save()}setTimeout(rt,50)});
      box.querySelectorAll("[data-pcgo]").forEach(b=>b.onclick=()=>{try{openProfile(b.dataset.pcgo)}catch(e){}});
      box.querySelectorAll("[data-govie]").forEach(b=>b.onclick=()=>goVie("vie-per"));
      bindPer(box);bindLast(box,tk)};
    // ---- Page « Ma vie » (Profil)
    const renderVieBase=function(){
      const box=document.getElementById("vieBox");if(!box||!S||!S.g)return;if(busy(box))return;const v=V(),g=S.g,tk=tkNow();
      const seg=(k,opts,cur)=>`<div class="seg" role="group">${opts.map(o=>`<button type="button" data-seg="${k}" data-val="${o}" aria-pressed="${cur===o}">${o}</button>`).join("")}</div>`;
      const p=actPer(tk),cap=vieCap();
      const pers=g.per.slice().sort((a,b)=>(a.e<tk)-(b.e<tk)||a.s.localeCompare(b.s));
      const wk=Array.from({length:7},(_,i)=>addD(tk,i-6)),vals=wk.map(k=>g.cig[k]||0),mx=Math.max(1,...vals),past=wk.slice(0,6).filter(k=>k in g.cig),avg=past.length?past.reduce((a,k)=>a+(g.cig[k]||0),0)/past.length:null;
      const people=[...(S.family||[]),...(S.friends||[])].filter((n,i,a)=>a.indexOf(n)===i);
      let h=`<p class="vie-intro">Aujourd'hui : <b>${cap} quête${cap>1?"s":""}</b>${p?` · ${esc(p.name)}`:""}${workDay(tk)?" · jour de travail":""}.</p>
      <div class="vie-c" id="vie-per"><h3>${ic("autre",18)}Ma période du moment</h3>
        ${pers.map(x=>editId===x.id?perForm(x):perCard(x,tk)).join("")}${editId==="new"?perForm(null):`<button type="button" class="trk-add per-add">+ Ajouter une période</button>`}</div>
      <div class="vie-c" id="vie-rythme"><h3>${ic("vacances",18)}Mon rythme</h3>
        <label class="vie-l">Réveil<select data-wake="1">${[5,6,7,8,9,10,11,12,13].map(n=>`<option value="${n}"${wakeH()===n?" selected":""}>${n} h</option>`).join("")}</select></label>
        <div class="vie-l">Mes jours de travail<div class="chipz day">${[1,2,3,4,5,6,0].map(d=>`<button type="button" data-wd="${d}" aria-pressed="${v.wd.includes(d)}">${WL[d]}</button>`).join("")}</div></div>
        <div class="two"><label class="vie-l">Je commence à<input type="time" data-wf="1" value="${v.wf}"></label><label class="vie-l">Je finis à<input type="time" data-wt="1" value="${v.wt}"></label></div>
        <label class="ck"><input type="checkbox" data-job="1"${v.job?" checked":""}>Je travaille toute l'année (pas seulement pendant un contrat)</label></div>
      <div class="vie-c" id="vie-cap"><h3>${ic("autre",18)}Ma capacité<small>quêtes par jour</small></h3>
        <div class="vie-l">Jour normal${seg("cap",[1,3,5,8],v.cap)}</div>
        <div class="vie-l">Jour de travail${seg("capW",[1,2,3,5],v.capW)}</div></div>
      <div class="vie-c" id="vie-suivi"><h3>${ic("cig",18)}Ce que je surveille</h3>
        <label class="tg"><span><b>Cigarettes</b><small>Dans ton bandeau</small></span><input type="checkbox" class="sw" data-trk="cig"${v.track.cig?" checked":""}></label>
        ${v.track.cig?`<div class="trk-w" aria-label="Cigarettes sur 7 jours">${wk.map((k,i)=>`<span class="${i===6?"td":""}" title="${fmt(k)} : ${vals[i]}"><i style="height:${Math.round(vals[i]/mx*30)+3}px"></i><em>${WL[toD(k).getDay()]}</em></span>`).join("")}</div><small class="hint">Aujourd'hui ${g.cig[tk]||0} · hier ${g.cig[addD(tk,-1)]||0}${avg!=null?` · moyenne ${avg.toLocaleString("fr-FR",{maximumFractionDigits:1})}`:""}</small>`:""}
        <label class="tg"><span><b>Périodes en cours</b><small>Contrat et progression</small></span><input type="checkbox" class="sw" data-trk="per"${v.track.per?" checked":""}></label></div>
      <div class="vie-c" id="vie-maison"><h3>${ic("demenagement",18)}La dernière fois que…<button type="button" class="btn edbtn lst-add" style="margin-left:auto" aria-label="Ajouter un élément">+</button></h3><p>Les retards remontent dans tes quêtes.</p>${lastHTML(tk)}</div>
`;
      box.innerHTML=h;
      {const sm=document.getElementById("setMods");if(sm)sm.innerHTML=`<div id="vie-mods"><h3>${ic("autre",18)}Mes modules</h3><p>Ce qui est coupé disparaît.</p>
        ${MODS.map(m=>`<label class="tg"><span><b>${m[1]}</b><small>${m[2]}</small></span><input type="checkbox" class="sw" data-mod="${m[0]}"${v.off.includes(m[0])?"":" checked"}></label>`).join("")}</div>`}
      const ch=()=>{save();rt();try{render()}catch(e){}};
      box.querySelectorAll("[data-seg]").forEach(b=>b.onclick=()=>{v[b.dataset.seg]=+b.dataset.val;ch()});
      box.querySelectorAll("[data-wd]").forEach(b=>b.onclick=()=>{const d=+b.dataset.wd;v.wd=v.wd.includes(d)?v.wd.filter(x=>x!==d):[...v.wd,d];ch()});
      box.querySelector("[data-wf]").onchange=e=>{v.wf=e.target.value||"09:00";save();rt()};box.querySelector("[data-wt]").onchange=e=>{v.wt=e.target.value||"17:00";save();rt()};
      box.querySelector("[data-wake]").onchange=e=>{g.wake=+e.target.value;e.target.blur();ch()};
      box.querySelector("[data-job]").onchange=e=>{v.job=e.target.checked;ch()};
      if(0)box.querySelectorAll("[data-pri]").forEach(b=>b.onclick=()=>{const k=b.dataset.pri;if(v.pri.includes(k))v.pri=v.pri.filter(x=>x!==k);else{if(v.pri.length>=3){try{toast("3 priorités maximum")}catch(e){}return}v.pri=[...v.pri,k]}ch()});
      box.querySelectorAll("[data-trk]").forEach(b=>b.onchange=()=>{v.track[b.dataset.trk]=b.checked;ch()});
      document.querySelectorAll("#setMods [data-mod]").forEach(b=>b.onchange=()=>{const id=b.dataset.mod;v.off=b.checked?v.off.filter(x=>x!==id):[...v.off.filter(x=>x!==id),id];vieMods();save()});
      bindPer(box);bindLast(box,tk)};
    // renderVie : finitions autour de renderVieBase (le cœur), ex-retouche de correctifs.js
    window.renderVie=function(){const r=renderVieBase.apply(this,arguments);try{vieViz();ficheMove()}catch(e){console.warn("renderVie",e)}return r};
  })();
  