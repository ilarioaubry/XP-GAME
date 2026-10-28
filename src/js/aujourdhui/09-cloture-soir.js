// ---- Clôture du soir : bilan de la journée
function closeOpen(fromLast,bed){if(document.querySelector(".clo")||!S.g)return;const G=S.g,tk=dayKey(Date.now());if(!G.jr||typeof G.jr!=="object")G.jr={};const J=G.jr[tk]||{},AFB=window.__AFB;
  const dl=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  const ML=[["pdej","matin","Petit-déj",10],["dej","matin","Déjeuner",10],["gouter","soir","Goûter",5],["diner","soir","Dîner",10]];
  const mDone=(k,per)=>{const key=tk+":"+per,b=(G.mb||{})[key],dr=(G.mbd||{})[key];const m=(b&&b.m)||(dr&&dr.m)||{};return m[k]===1||m[k]===0};
  // id, libellé court, titre page « quoi », familles d'actions, détails (durée/quantité), avec qui, icône
  const CT=[["sport","Du sport","Quel sport ?",["renfo","cardio","souple","sportco","bouger"],1,1,"sport"],
    ["sortie","Une sortie","Où es-tu allé·e ?",["sorties","dehors"],0,1,"paysage"],
    ["gens","Vu du monde","Qui et comment ?",["voir","contact","service"],0,1,"duo"],
    ["regard","Regardé / écouté","Quoi ?",["regarder","ecouter"],1,1,"ecran"],
    ["joue","Joué","À quoi ?",["jouer"],1,1,"epee"],
    ["lu","Lu","Quoi ?",["lire"],1,0,"lire"],
    ["maison","Fait du ménage","Quoi de fait ?",["ranger","nettoyer","linge","vaisselle","mmaison"],0,0,"fenetre"],
    ["travail","Bossé","Sur quoi ?",["focus","admin"],1,0,"sablier"]];
  const W={md:G.mood[tk]||0,meal:{},cat:{},pick:{},amt:{},who:{},sans:{},t:J.t||""};
  const SANS=(AFB?AFB.items():[]).filter(it=>it.k==="fam"&&it.f.id==="sans"),sansDone=it=>(S.log||[]).some(e=>e.a==="af:sans:"+it.opt&&dayKey(e.t)===tk);let si=0;
  const itemsOf=c=>(AFB?AFB.items():[]).filter(it=>it.k==="fam"&&c[3].includes(it.f.id));
  const ik=it=>it.f.id+"|"+it.opt;
  const EN=typeof engToday==="function"?engToday().filter(e=>e.res===undefined):[];W.en={};EN.forEach(e=>{if(engAuto(e))W.en[e.id]=engOk(e,tk)?1:0});
  const TD=typeof todoOpen==="function"?todoOpen():[];W.td={};TD.forEach(x=>W.td[x.id]="rep");
  const stepList=()=>{const L=["mood","meals","quick"];CT.forEach(c=>{if(!W.cat[c[0]])return;L.push(c[0]+":a");if(c[4]||c[5])L.push(c[0]+":b")});if(EN.length)L.push("eng");if(TD.length)L.push("todo");L.push("end");return L};
  const o=document.createElement("div");o.className="clo clo2";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Bilan de la journée");
  o.prepend(ambEl("nuit"));document.body.appendChild(o);document.body.classList.add("rtmon");
  const close=()=>{o.remove();document.body.classList.remove("rtmon")};
  const chip=(label,on,attr)=>`<button type="button" class="bsch" aria-pressed="${!!on}" ${attr}>${esc(label)}</button>`;
  const go=n=>{si=Math.max(0,Math.min(stepList().length-1,si+n));draw()};
  function draw(still){const L=stepList(),st=L[si],[cid,ph]=st.split(":"),c=CT.find(x=>x[0]===cid);let title="",sub="",body="",next="Continuer",nx=()=>go(1);
    if(st==="mood"){title="Comment s'est passée ta journée ?";sub=dl;body=`<div class="mrow clomd picked">${MOODS.map((m,i)=>`<button type="button" data-m="${i+1}" aria-pressed="${W.md===i+1}" aria-label="${m[1]}" style="--mc:${m[2]}">${moodFace(i+1,44)}</button>`).join("")}</div>`;next=W.md?"Continuer":"Passer"}
    else if(st==="meals"){title="Tes repas";sub="Touche ce que tu as mangé, même si tu rattrapes ta journée.";body=`<div class="bsmeals">${ML.map(([k,per,l,p])=>{const d=mDone(k,per);return`<div class="bsmr"><b>${l}</b>${d?`<span class="bsdone">${pxImg("check",1,"inl")} noté</span>`:`<div class="bsyn">${typeof plateOpen==="function"&&MB_PLM.includes(k)&&W.meal[k]!==0?`<button type="button" class="bsch" data-pl="${k}" data-per="${per}">Remplir l'assiette</button>`:`<button type="button" class="bsch" data-ml="${k}" data-v="1" aria-pressed="${W.meal[k]===1}">Mangé</button>`}<button type="button" class="bsch" data-ml="${k}" data-v="0" aria-pressed="${W.meal[k]===0}">Sauté</button></div>`}</div>`}).join("")}</div>`}
    else if(st==="quick"){title="Dans ta journée, il y a eu…";sub="Touche ce qui est vrai. On détaille juste après.";body=`<div class="bsq">${CT.map(c=>`<button type="button" class="bsqb" data-c="${c[0]}" aria-pressed="${!!W.cat[c[0]]}"><span class="bsqi">${rkSvg(c[6])}</span><b>${c[1]}</b></button>`).join("")}</div>`;next=CT.some(c=>W.cat[c[0]])?"Continuer":"Rien d'autre"}
    else if(ph==="a"){title=c[2];sub="Plusieurs choix possibles.";const P=W.pick[cid]||(W.pick[cid]=[]);body=`<div class="bswrap">${itemsOf(c).map(it=>chip(it.opt,P.includes(ik(it)),`data-pk="${esc(ik(it))}"`)).join("")}</div>`;next=P.length?"Continuer":"Passer"}
    else if(ph==="b"){title="Un peu de détail";sub="Facultatif : touche, ou continue.";const P=(W.pick[cid]||[]).map(k=>itemsOf(c).find(it=>ik(it)===k)).filter(Boolean);
      let h="";if(c[4])h+=P.map(it=>{const qk=AFB.qKind(it),opts=qk?AFB.QTY[qk].o.map(v=>[v,v+" "+AFB.QTY[qk].u]):AFB.DUR.filter(d=>d[0]>0),cur=W.amt[cid+"|"+ik(it)];return`<div class="bsrow"><small>${esc(it.opt)}</small><div class="bswrap">${opts.map(([v,l])=>chip(l,cur===v,`data-am="${esc(cid+"|"+ik(it))}" data-v="${v}" data-qk="${qk?1:0}"`)).join("")}</div></div>`}).join("");
      if(c[5]){const Wh=W.who[cid]||(W.who[cid]=[]),pp=AFB.people().slice(0,10),gg=AFB.groups();h+=`<div class="bsrow"><small>Avec qui ?</small><div class="bswrap">${gg.map((g,i)=>chip(g.n,g.m.every(n=>Wh.includes(n)),`data-wg="${i}"`)).join("")}${pp.map(p=>chip(p,Wh.includes(p),`data-wp="${esc(p)}"`)).join("")}</div></div>`}
      body=h;next=cid==="gens"&&!(W.who[cid]||[]).length?"Continuer sans nom":"Continuer"}
    else if(st==="eng"){title="Tes engagements";sub="Comment ça s'est passé ?";body=`<div class="bsmeals">${EN.map(e=>`<div class="bsmr"><b></b>${engAuto(e)?`<span class="bsdone">${W.en[e.id]?pxImg("check",1,"inl")+" tenu":"pas cette fois"}${e.id==="cigmax"?" · "+engCig(tk)+"/"+e.lim:""}</span>`:`<div class="bsyn">${chip("Tenu",W.en[e.id]===1,`data-en="${esc(e.id)}" data-v="1"`)}${chip("Pas cette fois",W.en[e.id]===0,`data-en="${esc(e.id)}" data-v="0"`)}</div>`}</div>`).join("")}</div>`}
    else if(st==="todo"){title="Ta liste à faire";sub="Pas fait aujourd'hui : on le garde pour demain ?";body=`<div class="bsmeals">${TD.map(x=>`<div class="bsmr"><b></b><div class="bsyn">${chip("Demain",W.td[x.id]==="rep",`data-td="${x.id}" data-v="rep"`)}${chip("Retirer",W.td[x.id]==="del",`data-td="${x.id}" data-v="del"`)}</div></div>`).join("")}</div>`}
    else if(st==="end"){const n=ML.filter(m=>W.meal[m[0]]!==undefined&&!mDone(m[0],m[1])).length+CT.reduce((a,c)=>a+(W.cat[c[0]]?(W.pick[c[0]]||[]).length:0),0);title="Ta journée en une phrase";sub=n?`${n} chose${n>1?"s":""} à ajouter à ton journal.`:"";const EG=(typeof engToday==="function"?engToday():[]).map(e=>e.id),SL=SANS.filter(it=>!sansDone(it)&&!EG.includes({Soda:"soda",Sucre:"sucre",Grignotage:"grign"}[it.opt]));body=`<textarea class="clot" maxlength="220" rows="3" placeholder="Ce dont tu te souviendras"></textarea>${SL.length?`<div class="bsrow closans"><small>Journée sans…</small><div class="bswrap">${SL.map(it=>chip(it.opt,W.sans[it.opt],`data-sans="${esc(it.opt)}"`)).join("")}</div></div>`:""}`;next="Bonne nuit"}
    o.querySelector(".cloin")?.remove();const d=document.createElement("div");d.className="cloin";
    d.innerHTML=`<div class="qwh">${si>0?`<button type="button" class="qwback" aria-label="Retour">${ICO("chev",18)}</button>`:"<span></span>"}<span class="qwprog" aria-label="Étape ${si+1} sur ${L.length}">${L.map((_,i)=>`<i class="${i<=si?"on":""}"></i>`).join("")}</span><button type="button" class="qwback clox" aria-label="Plus tard">×</button></div><div class="qwbody"${still?' style="animation:none"':""}><h2 class="qwq">${esc(title)}</h2>${sub?`<p class="qwsub">${esc(sub)}</p>`:""}${body}</div><button type="button" class="btn primary clogo">${esc(next)}</button>`;
    o.appendChild(d);const T=d.querySelector(".clot");if(T)T.value=W.t;
    d.querySelector(".clox").onclick=close;const bk=d.querySelector(".qwback:not(.clox)");if(bk)bk.onclick=()=>go(-1);
    d.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{W.md=+b.dataset.m;sfx("blip");d.querySelectorAll("[data-m]").forEach(x=>x.setAttribute("aria-pressed",x===b));setTimeout(()=>go(1),260)});
    d.querySelectorAll(".bsmr").forEach((r,i)=>{if(st==="todo"&&TD[i])r.querySelector("b").textContent=TD[i].n;if(st==="eng"&&EN[i])r.querySelector("b").textContent=EN[i].n});
    d.querySelectorAll("[data-en]").forEach(b=>b.onclick=()=>{const k=b.dataset.en,v=+b.dataset.v;W.en[k]=W.en[k]===v?undefined:v;sfx("blip");draw(1)});
    d.querySelectorAll("[data-td]").forEach(b=>b.onclick=()=>{W.td[b.dataset.td]=b.dataset.v;sfx("blip");draw(1)});
    d.querySelectorAll("[data-pl]").forEach(b=>b.onclick=()=>plateOpen(b.dataset.per,b.dataset.pl,b,{onClose:()=>draw(1)}));
    d.querySelectorAll("[data-sans]").forEach(b=>b.onclick=()=>{const k=b.dataset.sans;W.sans[k]=!W.sans[k];sfx("blip");b.setAttribute("aria-pressed",!!W.sans[k])});
    d.querySelectorAll("[data-ml]").forEach(b=>b.onclick=()=>{const k=b.dataset.ml,v=+b.dataset.v;W.meal[k]=W.meal[k]===v?undefined:v;sfx("blip");draw(1)});
    d.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{const k=b.dataset.c;W.cat[k]=!W.cat[k];sfx("blip");b.setAttribute("aria-pressed",!!W.cat[k]);d.querySelector(".clogo").textContent=CT.some(c=>W.cat[c[0]])?"Continuer":"Rien d'autre"});
    d.querySelectorAll("[data-pk]").forEach(b=>b.onclick=()=>{const P=W.pick[cid],k=b.dataset.pk,i=P.indexOf(k);if(i>=0)P.splice(i,1);else P.push(k);sfx("blip");b.setAttribute("aria-pressed",i<0);d.querySelector(".clogo").textContent=P.length?"Continuer":"Passer"});
    d.querySelectorAll("[data-am]").forEach(b=>b.onclick=()=>{const k=b.dataset.am,v=+b.dataset.v;W.amt[k]=W.amt[k]===v?undefined:v;sfx("blip");draw(1)});
    d.querySelectorAll("[data-wp]").forEach(b=>b.onclick=()=>{const Wh=W.who[cid],p=b.dataset.wp;W.who[cid]=Wh.includes(p)?Wh.filter(x=>x!==p):[...Wh,p];sfx("blip");draw(1)});
    d.querySelectorAll("[data-wg]").forEach(b=>b.onclick=()=>{const g=AFB.groups()[+b.dataset.wg],Wh=W.who[cid],all=g.m.every(n=>Wh.includes(n));W.who[cid]=all?Wh.filter(n=>!g.m.includes(n)):[...new Set([...Wh,...g.m])];sfx("blip");draw(1)});
    d.querySelector(".clogo").onclick=st==="end"?finish:()=>go(1)}
  function finish(){const T=o.querySelector(".clot"),t=T?T.value.trim():W.t,first=!J.at;if(W.md)G.mood[tk]=W.md;G.jr[tk]={t,k:J.k||"",at:Date.now()};if(bed)G.bed=Date.now();
    {const ks=Object.keys(G.jr).sort();while(ks.length>400)delete G.jr[ks.shift()]}
    const Q=[];ML.forEach(([k,per,l,p])=>{const v=W.meal[k];if(v===undefined||mDone(k,per))return;Q.push(()=>{const dr=mbDr(tk+":"+per);dr.m[k]=v;dr.cr[k]=1;if(v===1&&p>0)complete({id:"mb",cat:"nourriture",name:l,xp:p},FK,null);else save()})});
    CT.forEach(c=>{if(!W.cat[c[0]])return;const who=(W.who[c[0]]||[]).slice();(W.pick[c[0]]||[]).forEach(k=>{const it=itemsOf(c).find(x=>ik(x)===k);if(!it)return;const v=W.amt[c[0]+"|"+k],qk=AFB.qKind(it);Q.push(()=>AFB.afDo(it,FK,null,qk?0:(v||0),c[5]?who:[],qk?(v||0):0))})});
    if(EN.length){const T=engToday();EN.forEach(e=>{const v=W.en[e.id];if(v===undefined)return;const y=T.find(z=>z.id===e.id);if(!y)return;y.res=v;if(v===1)Q.push(()=>complete({id:"eng:"+e.id,cat:"soi",name:"Engagement tenu : "+e.n,xp:ENG_XP},FK,null))})}
    if(TD.length){const tm=todoDay(1);S.g.todo=todoL().filter(x=>!(W.td[x.id]==="del"));TD.forEach(x=>{if(W.td[x.id]!=="rep")return;const y=todoL().find(z=>z.id===x.id);if(!y)return;if(todoL().some(z=>z.d===tm&&z!==y&&(y.key?z.key===y.key:z.n===y.n)))S.g.todo=todoL().filter(z=>z!==y);else{y.d=tm;y.c=Date.now()}})}
    SANS.forEach(it=>{if(W.sans[it.opt]&&!sansDone(it))Q.push(()=>AFB.afDo(it,FK,null,0,[],0))});
    const FK={getBoundingClientRect:()=>({left:innerWidth/2-20,width:40,top:innerHeight*.45}),classList:{add(){}}};
    const prev=levelInfo(S.xp).l;if(first)addBonus("Bilan de la journée",10,0,"jr");close();save();render(prev);sfx("moment");
    Q.forEach((f,i)=>setTimeout(()=>{try{f()}catch(e){}},300+i*450));
    setTimeout(()=>{try{dayRecap(first)}catch(e){toast("Bilan mis à jour")}},450+Q.length*450)}
  draw()}
// ---- Ta journée : le bilan qui remplace les messages empilés (fin de Bonne nuit)
function dayRecap(first){if(document.querySelector(".jrc"))return;const tk=dayKey(Date.now()),G=S.g,L=(S.log||[]).filter(e=>dayKey(e.t)===tk),xp=L.filter(e=>e.xp>0).reduce((a,e)=>a+e.xp,0),li=levelInfo(S.xp);
  const acts=L.filter(e=>!e.bonus&&e.xp>0),bc={};acts.forEach(e=>{const c=CATS[e.cat]?e.cat:"";if(c)bc[c]=(bc[c]||0)+e.xp});const BC=Object.entries(bc).sort((a,b)=>b[1]-a[1]),mx=BC.length?BC[0][1]:1;
  const ppl=[...new Set(L.flatMap(e=>e.withp||[]))];let nM=0;try{nM=MEALS.filter(([k,per])=>mealState(k,per)==="ok").length}catch(e){}
  let bd=[];try{bd=badgeDefs().filter(b=>S.badges[b.id]&&dayKey(S.badges[b.id])===tk).map(b=>b.name)}catch(e){}
  const notes=((G.dlog||{})[tk]||[]).slice(-8),line=(ic,h)=>`<li class="jrl"><span class="jri">${ic}</span><span>${h}</span></li>`;
  const o=document.createElement("div");o.className="clo clo2 jrc";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Ta journée");o.prepend(ambEl("nuit"));document.body.appendChild(o);document.body.classList.add("rtmon");
  const d=document.createElement("div");d.className="cloin";
  d.innerHTML=`<div class="qwh"><span></span><span></span><button type="button" class="qwback clox" aria-label="Fermer">×</button></div><div class="qwbody"><h2 class="qwq">Ta journée</h2><p class="qwsub">${esc(new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"}))}</p>
    <div class="jrxp"><b class="ui-chiffre">+${xp} XP</b><small class="ui-info">${acts.length} action${acts.length>1?"s":""}${first?" · bilan +10 XP":""} · encore ${Math.max(0,li.need-li.cur)} XP avant le niveau ${li.l+1}</small></div>
    ${BC.length?`<ul class="jrcat">${BC.map(([c,x])=>`<li><span class="jrn">${esc(CATS[c].label)}</span><span class="ui-barre jrb" style="--cc:${CATS[c].c}"><i style="width:${Math.round(x/mx*100)}%"></i></span><span class="ui-compteur">${x}</span></li>`).join("")}</ul>`:`<p class="vide">Aucune action notée aujourd'hui.</p>`}
    <ul class="jrlist">${[...bd.map(n=>line(rkSvg("etoile"),"Badge : <b>"+esc(n)+"</b>")),...notes.map(h=>line(rkSvg("check"),h)),ppl.length?line(rkSvg("coeur"),"Avec "+esc(ppl.slice(0,4).join(", "))+(ppl.length>4?" +"+(ppl.length-4):"")):"",line(rkSvg("repas"),nM+" repas sur 4 notés")].join("")}</ul></div>
    <button type="button" class="btn primary clogo">Bonne nuit</button>`;
  o.appendChild(d);const close=()=>{o.remove();document.body.classList.remove("rtmon")};d.querySelector(".clox").onclick=close;d.querySelector(".clogo").onclick=close}
function rkSnd(k){if(!sfxOn())return;const c=sfxCtx();if(!c)return;const t=c.currentTime+.01;SFX.last=performance.now();
  switch(k){
   case"dents":for(let i=0;i<4;i++)noise(c,t+i*.07,.06,.09,i%2?3800:2600);tone(c,1319,t+.3,.12,"square",.05);break;
   case"lit":tone(c,110,t,.18,"triangle",.16,70);seq(c,t+.14,[523,659,784],.07,"triangle",.07);break;
   case"douche":noise(c,t,.35,.05,2400);for(let i=0;i<5;i++){const f=700+Math.random()*700;tone(c,f,t+i*.06,.06,"sine",.07,f*1.6)}break;
   case"visage":noise(c,t,.12,.12,1400);tone(c,420,t+.06,.1,"sine",.1,900);tone(c,1175,t+.16,.12,"triangle",.06);break;
   case"barbe":{const o=c.createOscillator(),g=c.createGain();o.type="sawtooth";o.frequency.setValueAtTime(95,t);for(let i=0;i<9;i++)g.gain.setValueAtTime(i%2?.012:.045,t+i*.03);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.32);tone(c,1568,t+.32,.1,"square",.04);break}
   case"fenetre":noise(c,t,.4,.06,600);tone(c,1568,t+.25,.25,"triangle",.06);tone(c,2093,t+.38,.2,"triangle",.04);break;
   case"eau":sfx("glug",2);break;
   case"sport":noise(c,t,.07,.14,1600);tone(c,200,t,.12,"square",.09,80);seq(c,t+.12,[659,988],.06,"square",.05);break;
   case"lire":noise(c,t,.05,.1,3000);noise(c,t+.09,.05,.08,2400);tone(c,880,t+.18,.1,"triangle",.05);break;
   case"medit":tone(c,528,t,1.1,"sine",.12);tone(c,792,t+.02,.9,"sine",.05);break;
   case"note":for(let i=0;i<4;i++)noise(c,t+i*.05,.04,.06,4500);tone(c,1047,t+.24,.1,"square",.04);break;
   case"repas":seq(c,t,[392,523,659],.07,"triangle",.09);break;
   case"ecran":seq(c,t,[880,660,440],.07,"square",.05);break;
   case"vit":tone(c,700,t,.05,"square",.05);tone(c,1400,t+.05,.08,"triangle",.06);break;
   case"lune":seq(c,t,[784,659,523],.1,"triangle",.07);break;
   default:seq(c,t,[523,659,784],.07,"square",.06)}}
function rkFx(el,K){rkSnd(K.k);rkAnim(el,K.k);sceneAct(K.k);if(matchMedia("(prefers-reduced-motion: reduce)").matches||!el)return;const s=document.createElement("span");s.className="rkst";s.style.setProperty("--kc",K.c);
  s.innerHTML=`<b>${ICO("check",22)}</b>`+Array.from({length:8},(_,i)=>`<i style="--a:${i*45}deg"></i>`).join("");el.appendChild(s);setTimeout(()=>s.remove(),750)}
function ritOrder(L){const G=S.g;if(!G||G.rtAuto===false)return L;const R=G.rto||{},med=t=>{const a=(R[t.id]||[]).slice().sort((x,y)=>x-y);return a.length>=3?a[Math.floor(a.length/2)]:null};
  const known=L.filter(t=>med(t)!=null).sort((x,y)=>med(x)-med(y));let ki=0;return L.map(t=>med(t)!=null?known[ki++]:t)}
function ritUntap(t){const tk=dayKey(Date.now()),a0=t.link&&S.actions.find(x=>x.name===t.link),id0=a0?a0.id:"rit-"+t.id,e=[...S.log].reverse().find(x=>dayKey(x.t)===tk&&x.a===id0);
  S.daily.c[t.id]=0;ritMark(t.id,0,1);if(S.g.rcore&&!ritCore().every(x=>(ritH()[tk]||{})[x.id]))S.g.rcore=S.g.rcore.filter(k=>k!==tk);
  if(e){render();const li=[...document.querySelectorAll("#log li")].find(x=>x.__e===e);if(li){li.querySelector(".undo").click();toast("Rituel décoché");return}}
  save();render();toast("Rituel décoché")}
function ritTiles(list,per,cls){const w=document.createElement("div");w.className="rtl "+(cls||"");const tk=dayKey(Date.now());
  list.forEach(t=>{const c=S.daily.c[t.id]||0,full=c>=t.n,K=ritKind(t),a0=t.link&&S.actions.find(x=>x.name===t.link),xp=a0?actXp(a0,S.log.filter(e=>e.a===a0.id&&dayKey(e.t)===tk).length):RIT_XP;
    const b=document.createElement("button");b.type="button";b.className="rtile"+(full?" done":"")+(t.core?" core":"");b.style.setProperty("--kc",K.c);
    if(!full){b.dataset.tm="rit-"+t.id;b.dataset.tmn=t.name;b.dataset.nohold="1"}
    b.innerHTML=`<span class="rtic">${rkSvg(K.k,K.c)}</span><span class="rtn"></span>${t.trg&&!full?`<span class="rttr"></span>`:""}${t.n>1?`<span class="rtd">${Array.from({length:t.n},(_,i)=>`<i class="${i<c?"on":""}"></i>`).join("")}</span>`:""}<em>${full?ICO("check",12):(xp?"+"+xp:ICO("check",12))}</em>${t.core?`<span class="rtcore">${STAR_SVG}</span>`:""}`;
    if(isWeekend()&&!t.core&&!full&&list.some(x=>x.core))b.insertAdjacentHTML("beforeend",`<span class="rtbonus">Bonus</span>`);b.querySelector(".rtn").textContent=shortName(t.name);{const tr=b.querySelector(".rttr");if(tr)tr.textContent=t.trg}b.setAttribute("aria-label",t.name+(full?", fait. Toucher pour décocher":xp?", +"+xp+" XP":""));
    b.onclick=ev=>{if(full){undoAfter("Rituel décoché",()=>ritUntap(t));return}
      if(b.classList.contains("busy"))return;b.classList.add("busy");rkFx(b,K);const last=c+1>=t.n,fin=last&&w.classList.contains("main")&&[...w.querySelectorAll(".rtile:not(.done)")].length===1;
      setTimeout(()=>{window.__ritSnd=1;try{ritTap(t,b,ev)}finally{window.__ritSnd=0}if(fin)momentDone(per)},last?700:90)};
    w.appendChild(b)});
  return w}
// glisser pour valider
function swipeable(el,onR,onL){let x0=null,y0=0,dx=0,id=null,drag=false;el.style.touchAction="pan-y";
  el.addEventListener("pointerdown",e=>{if(e.button>0)return;x0=e.clientX;y0=e.clientY;dx=0;id=e.pointerId;drag=false});
  el.addEventListener("pointermove",e=>{if(x0==null||e.pointerId!==id)return;dx=e.clientX-x0;const dy=e.clientY-y0;
    if(!drag&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.2){drag=true;el.style.transition="none";try{el.setPointerCapture(id)}catch(_){}}
    if(drag){const v=(!onL&&dx<0)?dx/4:dx;el.style.transform=`translateX(${v}px) rotate(${v/28}deg)`;el.classList.toggle("swr",dx>70);el.classList.toggle("swl",dx<-70&&!!onL)}});
  const end=e=>{if(x0==null)return;const d=dx;x0=null;el.style.transition="";el.classList.remove("swr","swl");
    if(!drag)return;el.__drag=Date.now();if(d>80){el.style.transform="translateX(115%) rotate(10deg)";setTimeout(()=>onR(e),170)}else if(d<-80&&onL){el.style.transform="translateX(-115%) rotate(-10deg)";setTimeout(()=>onL(e),170)}else el.style.transform=""};
  el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);
  el.addEventListener("click",e=>{if(el.__drag&&Date.now()-el.__drag<450){e.preventDefault();e.stopPropagation()}},true)}
// mode routine
// ---- Ma routine (refonte 26/10, style « liste à cocher ») : écran de départ avec toutes les étapes et le record,
// puis on coche dans l'ordre (l'étape en cours est mise en avant), chrono en grand ; le repas du moment et un verre d'eau font partie des étapes ;
// à la fin, récap des étapes, temps comparé au record, XP gagnée. XP et record : inchangés (ceux des rituels, du repas et de l'eau).
function rtmSteps(per){const tk=dayKey(Date.now()),h=dayH(),L=[];
  ritOrder(ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)===per&&ritDue(t)&&(S.daily.c[t.id]||0)<t.n)).forEach(t=>{const K=ritKind(t);L.push({k:"rit",t,name:t.name,ic:rkSvg(K.k,K.c),K})});
  const mk=per==="matin"?"pdej":"diner",M=MEALS.find(m=>m[0]===mk);
  if(M&&!mealState(mk,M[1])&&h>=MEAL_H[mk])L.push({k:"meal",mk,per:M[1],name:M[2],ic:pxImg(M[3],3),plate:MB_PLM.includes(mk)});
  const w=ritTasks().find(t=>t.bar==="eau");if(w&&(S.daily.c[w.id]||0)<w.n)L.push({k:"eau",t:w,name:"Un verre d'eau",ic:rkSvg("eau"),K:ritKind(w)});
  if(per==="soir"&&!((S.g.jr||{})[tk]||{}).at)L.push({k:"night",name:"Bonne nuit",ic:rkSvg("lune")});
  return L}
function rtmOpen(){const per=dayPer();if(per==="nuit"||document.querySelector(".rtm"))return;
  const Q=rtmSteps(per);if(!Q.length){toast("Tout est déjà fait pour ce moment");return}
  if(tmOn()){toast("Termine ton timer d'abord");return}
  const G=S.g,best=(G.rtb||{})[per],lab=per==="soir"?"Routine du soir":"Routine du matin";
  const st={i:0,skip:0,done:0,xp0:S.xp,t0:0,run:false,end:false,res:Q.map(()=>"")};
  const o=document.createElement("div");o.className="rtm rtq";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",lab);document.body.appendChild(o);document.body.classList.add("rtmon");try{o.appendChild(ambEl(ambPhase()))}catch(e){}const C=document.createElement("div");C.className="rtq-in";o.appendChild(C);
  let iv=0;const clk=()=>st.t0?Date.now()-st.t0:0;
  const close=()=>{clearInterval(iv);o.remove();document.body.classList.remove("rtmon");render()};
  const draw=()=>{const n=Q.length,fait=st.res.filter(r=>r==="ok").length,cur=Q[st.i];
    const head=st.end?(per==="soir"?"Soir bouclé":"Matin bouclé"):lab;
    C.innerHTML=`<div class="rtq-haut"><h2 class="ui-titre rtq-titre">${head}</h2><button type="button" class="ui-btn ui-btn--icone rtq-x" aria-label="Quitter la routine">${ICO("close",24)}</button></div>
    <div class="rtq-chrono"><b class="ui-chiffre rtq-clk">${rtmFmt(clk())}</b><small class="ui-info rtq-rec"></small></div>
    <div class="rtq-prog"><span class="ui-barre rtq-barre"><i style="width:${Math.round(fait/n*100)}%"></i></span><span class="ui-compteur">${fait}/${n}</span></div>
    <ol class="rtq-liste">${Q.map((x,i)=>{const r=st.res[i],now=st.run&&!st.end&&i===st.i,c=x.t?(S.daily.c[x.t.id]||0):0;
      return`<li class="rtq-et${now?" cur":""}${r==="ok"?" ok":""}${r==="skip"?" skip":""}" data-i="${i}"><span class="rtq-ic">${x.ic}</span><span class="rtq-tx"><b></b><small class="ui-info">${r==="ok"?"Fait":r==="skip"?"Passé":x.k==="meal"?(x.plate?"Remplis ton assiette":"Pris ou sauté"):x.k==="night"?"Ton bilan de la journée":x.t&&x.t.n>1&&x.k==="rit"?c+" / "+x.t.n:""}</small></span><span class="rtq-etat">${r==="ok"?ICO("check",24):""}</span></li>`}).join("")}</ol>
    <div class="rtq-bas">${st.end?`<button type="button" class="ui-btn ui-btn--principal rtq-fin">Terminer</button>`:!st.run?`<button type="button" class="ui-btn ui-btn--principal rtq-go">C'est parti</button>`:`<button type="button" class="ui-btn rtq-skip">Passer</button><button type="button" class="ui-btn ui-btn--principal rtq-ok">${cur&&cur.k==="meal"&&cur.plate?"Remplir l'assiette":cur&&cur.k==="night"?"Bonne nuit":"Fait"}</button>`}</div>`;
    o.querySelectorAll(".rtq-et b").forEach((e,i)=>e.textContent=Q[i].name);
    const rec=o.querySelector(".rtq-rec");
    if(st.end){const ms=st.ms;rec.textContent=st.recN===2?"Nouveau record !":st.recN===1?"Premier temps enregistré":best?"Record : "+rtmFmt(best):"Fais tout sans passer pour enregistrer un temps";
      o.querySelector(".rtq-clk").textContent=rtmFmt(ms);const g=S.xp-st.xp0;if(g>0)rec.textContent+=" · +"+g+" XP"}
    else rec.textContent=best?"Record : "+rtmFmt(best):"Pas encore de record";
    o.querySelector(".rtq-x").onclick=close;
    const go=o.querySelector(".rtq-go");if(go)go.onclick=()=>{st.run=true;st.t0=Date.now();sfx("start");iv=setInterval(()=>{const c=o.querySelector(".rtq-clk");if(c&&!st.end)c.textContent=rtmFmt(clk())},250);draw()};
    const fin=o.querySelector(".rtq-fin");if(fin)fin.onclick=()=>{close();if(per==="soir"&&!rtmSteps("soir").some(x=>x.k==="rit"||x.k==="night"))setTimeout(()=>closeOpen(1),300)};
    const row=o.querySelector(".rtq-et.cur");if(row){row.scrollIntoView({block:"nearest"});swipeable(row,ev=>ok(ev),()=>skip())}
    const okb=o.querySelector(".rtq-ok");if(okb)okb.onclick=ev=>ok(ev);const sk=o.querySelector(".rtq-skip");if(sk)sk.onclick=()=>skip()};
  const next=()=>{st.i++;if(st.i>=Q.length)finish();else draw()};
  let busy=false;
  const ok=ev=>{if(busy)return;const x=Q[st.i];if(!x)return;const row=o.querySelector(".rtq-et.cur");
    if(x.k==="night"){st.res[st.i]="ok";st.done++;clearInterval(iv);st.ms=clk();if(!G.rtb||typeof G.rtb!=="object")G.rtb={};if(!st.skip&&st.done>=3&&(!best||st.ms<best))G.rtb[per]=st.ms;save();close();setTimeout(()=>closeOpen(1),300);return}
    if(x.k==="meal"&&x.plate){plateOpen(x.per,x.mk,row,{onClose:()=>{if(plDone(dayKey(Date.now()),x.per,x.mk)){st.res[st.i]="ok";st.done++;next()}else draw()}});return}
    busy=true;
    if(x.k==="meal"){try{mealQuick(x.per,x.mk,row,1,ev)}catch(e){}st.res[st.i]="ok";st.done++;setTimeout(()=>{busy=false;next()},300);return}
    try{rkFx(row&&row.querySelector(".rtq-ic"),x.K)}catch(e){}window.__ritSnd=1;try{ritTap(x.t,row,ev)}finally{window.__ritSnd=0}
    const full=x.k==="eau"||(S.daily.c[x.t.id]||0)>=x.t.n;if(full){st.res[st.i]="ok";st.done++;setTimeout(()=>{busy=false;next()},300)}else setTimeout(()=>{busy=false;draw()},150)};
  const skip=()=>{if(busy)return;st.res[st.i]="skip";st.skip++;sfx("blip");next()};
  const finish=()=>{clearInterval(iv);st.ms=clk();st.end=true;if(!G.rtb||typeof G.rtb!=="object")G.rtb={};st.recN=0;
    if(!st.skip&&st.done>=2&&(!best||st.ms<best)){G.rtb[per]=st.ms;st.recN=best?2:1}save();sfx(st.recN===2?"level":"moment");draw()};
  draw()}
function rtmFmt(ms){const s=Math.floor(ms/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}

const RIT_SOIR_H=20;let dqMorn=false,sqMore=false;
// renderSpecials : version complète (ex-réécriture de correctifs.js), renderSpecialsBase = le cœur d'origine
function renderSpecials(){try{noBoss();smartQuests()}catch(e){}const r=renderSpecialsBase.apply(this,arguments);try{mealRow();sleepViz()}catch(e){console.warn("dq",e)}return r}
function renderSpecialsBase(){schedNow();renderBalance();
  renderGroups();ritRoll();
  const tr=$("spTrack");tr.innerHTML="";const tk=dayKey(Date.now()),G=S.g,P=dayPer(),box=$("dqBox");ambApply(box);
  const PER=P==="nuit"?null:P;
  const FI=typeof feedIds==="function"?feedIds():{sp:new Set(),mq:new Set()};const QS=S.specials.filter(q=>!q.bs&&!FI.sp.has(q.id)&&(q.gift||q.grp||normOk(q.name))).sort((a,b)=>DQ_ORD[dqKind(a)]-DQ_ORD[dqKind(b)]);
  const DONE=(G.dq&&G.dq.d===tk?G.dq.done:[]).filter(x=>!String(x.id||"").startsWith("bs"));
  const hNow=dayH(),soirWait=PER==="soir"&&hNow<RIT_SOIR_H&&ritTasks().some(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)==="soir"&&ritDue(t)),RM=PER==="soir"?ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)==="matin"&&ritDue(t)&&(S.daily.c[t.id]||0)<t.n):[];
  const sMood=softMood(),RT0=PER&&!soirWait?ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)===PER&&ritDue(t)):[],RT=(sMood||evmOn())&&RT0.some(t=>t.core)?RT0.filter(t=>t.core):RT0,RL=RT.filter(t=>(S.daily.c[t.id]||0)<t.n);
  const lifeOk=PER==="matin"?!!G.sleep[tk]:PER==="soir"?!!G.mood[tk]:true;
  if(!G.mb||typeof G.mb!=="object")G.mb={};const mbOk=!PER||!!G.mb[tk+":"+PER];
  const WE=isWeekend()&&RT.some(t=>t.core),RTc=WE?RT.filter(t=>t.core):RT,RLc=WE?RL.filter(t=>t.core):RL;
  const tot0=PER?RTc.length+2:0,left0=PER?RLc.length+(lifeOk?0:1)+(mbOk?0:1):0;
  const _ml=PER?MB[PER].filter(([k])=>dayH()>=MEAL_H[k]):[],_mll=_ml.filter(([k])=>{const dr=(S.g.mbd||{})[tk+":"+PER];return!(G.mb&&G.mb[tk+":"+PER])&&!(dr&&dr.m&&(dr.m[k]===0||dr.m[k]===1))});
  const tot=tot0+_ml.length,left=left0+_mll.length,nd=tot-left;
  $("dqTitle").firstChild.textContent=PER==="soir"?"Rituels du soir":"Rituels du matin";box.setAttribute("aria-label",PER==="soir"?"Rituels du soir":"Rituels du matin");
  $("spCount").textContent=nd+"/"+tot;{const sk=ritStreak(),e=$("ritSk");e.hidden=!sk;e.innerHTML=STAR_SVG+"<span>"+sk+" j</span>";e.title="Série des essentiels";$("ritEdBtn").onclick=()=>ritAtelier()}
  const red=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
  const leave=(d,go,run,ev)=>{if(d.classList.contains("leave"))return;d.classList.add("leave");go.disabled=true;if(red()){run();return}const last=tr.querySelectorAll(".dqi:not(.leave)").length===0;
    setTimeout(()=>{if(last)return;d.style.height=d.offsetHeight+"px";void d.offsetHeight;d.classList.add("shrink")},300);setTimeout(run,last?320:560)};
  const mk=(lab,col,ic,name,btn,aria,par)=>{const d=document.createElement("div");d.className="dqi";d.style.setProperty("--tc",col);
    d.innerHTML=`<span class="dqic"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">${ic}</svg></span><span class="dqt"><b></b><small></small></span><span class="dqa"></span>`;
    d.querySelector("b").textContent=name;d.querySelector("small").textContent=lab;(par||tr).appendChild(d);return d};
  {const st=$("sqTrack"),keep=st.scrollLeft;st.innerHTML="";const qt=QS.length+DONE.length;$("sqCnt").textContent=DONE.length+"/"+qt;$("sqBox").classList.toggle("voff",!qt&&!mqActive().length);
   const SQ_MAX=99,hidN=0;
   QS.forEach((q,qi)=>{if(!sqMore&&qi>=SQ_MAX)return;const k=dqKind(q),[lab,col,ic]=DQ_K[k]||DQ_K[""],L=q.bs&&q.bn?"Boss · "+q.bn.replace(/^(Le|La|L') ?/,""):q.dz&&lzOf(q.dz)?"Défi · "+lzOf(q.dz).n:q.dfi?"Défi · Musique":q.why||lab;
    const d=document.createElement("div");d.className="sq dqk"+(k==="sur"?" sur":"");d.style.setProperty("--tc",q.col||(q.dz&&lzOf(q.dz)?lzOf(q.dz).c:col));
    d.innerHTML=`<span class="sqk"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">${ic}</svg><span></span></span><span class="sqn"></span><span class="sqr"><span class="sqc">+${q.xp} XP</span><button class="btn primary" type="button">Fait</button></span>${q.grp?`<button class="sqx" type="button" aria-label="Proposer autre chose" title="Une autre">${ICO("swap",15)}</button>`:!q.sur&&!q.bq?`<button class="sqx" type="button" aria-label="Retirer la quête">${ICO("close",14)}</button>`:""}`;
    d.querySelector(".sqk span").textContent=L;d.querySelector(".sqn").textContent=q.name;{const id=(q.grp==="friends"||q.grp==="family")&&q.who?relIdea(q.who):"",fa=!id&&freeAlt(q.name);if(id||fa){const sm=document.createElement("small");sm.className="sqidea";sm.textContent=id?"Idée : "+id.charAt(0).toLowerCase()+id.slice(1):"Version gratuite : "+fa;d.querySelector(".sqn").after(sm)}}
    const go=d.querySelector(".primary");go.dataset.tm="sp-"+q.id;go.dataset.tmn=q.name;go.onclick=ev=>{if(d.classList.contains("leave"))return;d.classList.add("leave");go.disabled=true;setTimeout(()=>completeSpecial(q,go,ev),matchMedia("(prefers-reduced-motion: reduce)").matches?0:300)};
    if(q.dz==="cine"){const sv=document.createElement("button");sv.type="button";sv.className="lnk sqseen";sv.textContent="Déjà vu";sv.onclick=()=>{filmSeen(q.name);q.name=filmPick([q.name]);save();renderSpecials();toast("Noté comme déjà vu : voici un autre film")};d.querySelector(".sqn").after(sv)}
    const sw=d.querySelector(".sqx");if(sw)sw.onclick=()=>{if(q.grp){if(q.grp==="music"){swapGroup(q);return}const r=d.querySelector(".sqr");r.innerHTML=`<button type="button" class="btn sqa">Une autre</button><button type="button" class="btn sqa">Pas ${esc(q.who)}</button>`;r.classList.add("ask");const[b1,b2]=r.querySelectorAll(".sqa");b1.onclick=()=>swapGroup(q);b2.onclick=()=>grpBlock(q);sw.hidden=true;return}if(q.gift){if(!Array.isArray(S.g.gfNo))S.g.gfNo=[];S.g.gfNo.push(q.gift)}S.specials=S.specials.filter(x=>x.id!==q.id);save();render()};
    if(window.__swapId===q.id){d.classList.add("swapin");window.__swapId=""}st.appendChild(d)});
   if(hidN||(sqMore&&QS.length>SQ_MAX)){const m=document.createElement("button");m.type="button";m.className="sq sqmore";m.innerHTML=sqMore?`<b>Ranger</b><small>Garder 3 quêtes visibles</small>`:`<b>+${hidN}</b><small>en réserve</small>`;m.onclick=()=>{sqMore=!sqMore;renderSpecials()};st.appendChild(m)}
   mqCards(st);
   if(qt&&!QS.length&&!st.querySelector(".mq")){st.innerHTML=`<p class="dqend sqend"><b>Toutes les quêtes spéciales sont faites ${pxImg("check",2,"inl")}</b><small>De nouvelles quêtes arrivent demain.</small></p>`}
   try{window.__sqFinish&&window.__sqFinish()}catch(e){}
   st.scrollLeft=keep}
  const RI=PER==="soir"?'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/>':'<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>';
  const RIm='<circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>';
  const rit=(t,RP,par)=>{const c=S.daily.c[t.id]||0,a0=t.link&&S.actions.find(x=>x.name===t.link),xp=a0?actXp(a0,S.log.filter(e=>e.a===a0.id&&dayKey(e.t)===tk).length):(!t.bar&&c+1>=t.n?RIT_XP:0);
    const d=mk((t.core?"Socle · ":"")+(RP==="soir"?"Rituel du soir":"Rituel du matin"),RP==="soir"?"#7a6ad8":"#e0a020",RP==="soir"?RI:RIm,t.name+(t.n>1?` (${c}/${t.n})`:""),0,0,par);if(t.core)d.classList.add("core");if(t.ev>1)d.querySelector("small").textContent+=" · "+evLab(t);
    const a=d.querySelector(".dqa");a.innerHTML=`<button type="button" class="btn primary dqgo">${xp?"+"+xp:ICO("check",18)}</button>`;const go=a.querySelector(".dqgo");go.setAttribute("aria-label",t.name+(xp?", +"+xp+" XP":", fait"));go.dataset.tm="rit-"+t.id;go.dataset.tmn=t.name;
    go.onclick=ev=>{if(c+1<t.n){ritTap(t,go,ev);return}leave(d,go,()=>ritTap(t,go,ev),ev)}};
  if(RT.length&&RL.length){const W=ritTiles(ritOrder(RT),PER,"main");if(RL.length>=2&&!soirWait){const g=document.createElement("button");g.type="button";g.className="rtmgo";const bt=(S.g.rtb||{})[PER];g.innerHTML=`${ICO("play",18)}Routine${bt?`<small>record ${rtmFmt(bt)}</small>`:""}`;g.onclick=rtmOpen;W.appendChild(g)}tr.appendChild(W)}
  const ML=PER?MB[PER].filter(([k])=>dayH()>=MEAL_H[k]):[],MLL=ML.filter(([k])=>{const dr=(S.g.mbd||{})[tk+":"+PER];return!G.mb[tk+":"+PER]&&!(dr&&dr.m&&(dr.m[k]===0||dr.m[k]===1))});
  MLL.forEach(([k,l,p,m,ic])=>{const d=mk("","#5fae4f","",l);d.classList.add("dqmeal");d.querySelector(".dqic").innerHTML=pxImg(ic,2);
    const a=d.querySelector(".dqa");a.innerHTML=`<button type="button" class="dqskip" aria-label="${l} sauté">${ICO("close",14)}</button><button type="button" class="btn primary dqgo">Fait</button>`;const go=a.querySelector(".dqgo");go.setAttribute("aria-label",l+" pris");go.onclick=ev=>mealQuick(PER,k,go,1,ev);a.querySelector(".dqskip").onclick=ev=>mealQuick(PER,k,go,0,ev)});
  {const ak=tk+":matin",adr=(G.mbd||{})[ak];if(!G.mb[ak]&&adr&&adr.cr&&MB.matin.every(([k])=>adr.cr[k])&&!isSoft(tk)||(!G.mb[ak]&&adr&&adr.cr&&MB.matin.every(([k])=>adr.cr[k]))){let ng=0;if(!isSoft(tk))MB.matin.forEach(([k,,,m])=>{if(adr.m[k]===0)ng+=m});G.mb[ak]={m:{...adr.m},ex:{...adr.ex},w:{...adr.w},v:{},neg:ng,pl:JSON.parse(JSON.stringify(adr.pl||{})),xp:0,t:Date.now(),auto:1};save()}}
  {const h=dayH(),pend=[];
   if(PER==="soir"&&!G.mb[tk+":matin"])pend.push("matin");
   if(PER&&!G.mb[tk+":"+PER]&&MLL.length===0&&ML.length===MB[PER].length&&(RL.length===0||(PER==="matin"?h>=13:h>=20)))pend.push(PER);
   if(!PER&&h<8){const y=dayKey(Date.now()-864e5);if(!G.mb[y+":soir"])pend.push("soir:"+y)}
   pend.forEach(pp=>tr.appendChild(mbCard(pp)))}
  if(soirWait){const e=document.createElement("p");e.className=left===0?"dqend dqwait":"dqwait";e.innerHTML=`<span class="dqwi">${rkSvg("lune")}</span><b>${RIT_SOIR_H}h</b>`;tr.appendChild(e)}
  if(RM.length){const w=document.createElement("div");w.className="dqmorn"+(dqMorn?" open":"");w.innerHTML=`<button type="button" class="dqmh" aria-expanded="${dqMorn}"><span>Encore possible du matin</span><em>${RM.length}</em><i class="dqchev">${ICO("chev",14)}</i></button><div class="dqmb"></div>`;
    w.classList.add("open","dqmbar");w.querySelector(".dqmh").onclick=()=>{};{const bd=w.querySelector(".dqmb");bd.appendChild(ritTiles(ritOrder(RM),"matin","mini"))}{const mn=tr.querySelector(".rtl.main");if(mn)mn.after(w);else tr.prepend(w)}}
  {const hide=sMood;$("sqBox").classList.toggle("vsoft",hide);
   if(sMood&&PER){const e=document.createElement("div");e.className="softc";e.innerHTML=`<b>Journée difficile</b><small>Juste l'essentiel${RT0.some(t=>t.core)?" : ton socle":""}.</small><button type="button" class="lnk">Voir tout quand même</button>`;e.querySelector("button").onclick=()=>{S.g.softAll=tk;save();render()};tr.prepend(e)}}
  const all=!!PER&&tot>0&&left===0&&!soirWait;box.classList.toggle("voff",all&&G.endHide===tk+":"+PER);
  $("dqHead").hidden=!PER||all;box.classList.toggle("alldone",all||!PER);$("bars").hidden=!PER;
  if(!PER){const keep=[...tr.querySelectorAll(".mbil")];tr.innerHTML=`<p class="dqend night"><b>Bonne nuit</b><small>Tes quêtes du matin arrivent à 8h.</small></p>`;keep.forEach(k=>tr.prepend(k))}
  else if(all){const e=document.createElement("p");e.className="dqend";e.innerHTML=PER==="matin"?`<b>Matinée terminée ${pxImg("check",2,"inl")}</b><small>Coffre gagné · rendez-vous à 15h pour la suite.</small>`:`<b>Journée terminée ${pxImg("check",2,"inl")}</b><small>Coffre gagné · de nouvelles quêtes demain à 8h.</small>`;e.classList.add("dqendx");e.setAttribute("role","button");e.tabIndex=0;e.title="Toucher pour masquer";e.insertAdjacentHTML("beforeend",`<span class="dqendh">Toucher pour masquer</span>`);{const cb=e.querySelector(".dqclo");if(cb)cb.onclick=ev=>{ev.stopPropagation();closeOpen(0)}}const hideEnd=()=>{G.endHide=tk+":"+PER;save();e.classList.add("out");setTimeout(()=>renderSpecials(),260)};e.onclick=hideEnd;e.onkeydown=ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();hideEnd()}};tr.appendChild(e);
    if(!G.pb||G.pb.d!==tk)G.pb={d:tk};if(!G.pb[PER]){G.pb[PER]=1;setTimeout(()=>sfx("moment"),300);const bx=Math.round((S.dayBonus.xp||30)/2);G.chests=(G.chests||0)+1;save();setTimeout(()=>{const prev=levelInfo(S.xp).l;if(bx)addBonus(PER==="matin"?"Matinée terminée":"Journée terminée",bx,0,"pb");save();render(prev);toast(`${PER==="matin"?"Matinée":"Journée"} terminée ! <span class="p">+${bx} XP</span> et un coffre`)},500)}}
}



