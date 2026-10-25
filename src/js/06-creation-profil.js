// ==== Première arrivée : création du profil
const OB_MUSIC=["dans le style : rap","dans le style : pop","dans le style : électro","dans le style : rock","dans le style : lo-fi","dans le style : R&B"];
const OB_FAM=["Maman","Papa"];
function obStart(){if(!S.g||S.g.onb||document.querySelector(".obd"))return;
  const st={step:0,name:"",cfg:{...AV_DEF,skin:1,hair:0,hairC:1,topC:3,bgC:0,bgP:12,beard:0},lz:["lect","cine","cuis"],mus:false,ids:[],rit:{matin:new Set(["Faire mon lit","Se brosser les dents"]),soir:new Set(["Se brosser les dents"])},fam:[],fr:[],best:""};
  const o=document.createElement("div");o.className="obd";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Création de ton profil");document.body.appendChild(o);
  const STEPS=["Bienvenue","Toi","Passions","Identité","Rituels","Famille","Amis","Départ"];
  const avUrl=()=>{const c=avCanvas(st.cfg,6);return c.toDataURL?c.toDataURL():c};
  const people=(list,kind)=>`<ul class="obpl">${list.map((p,i)=>`<li>${pAv(p.n,"xmav")}<b data-i="${i}"></b>${kind==="fr"?`<button type="button" class="obbest${st.best===p.n?" on":""}" data-i="${i}" aria-label="Meilleur ami">${STAR_SVG}</button>`:""}<input class="obbd" data-i="${i}" placeholder="jj/mm" inputmode="numeric" maxlength="5" aria-label="Anniversaire"><button type="button" class="obrm" data-i="${i}" aria-label="Retirer">${ICO("close",14)}</button></li>`).join("")}</ul>
    <form class="obadd"><input maxlength="20" placeholder="${kind==="fam"?"Prénom ou surnom (Maman, Léa…)":"Prénom d'un ami"}" aria-label="Ajouter"><button type="submit" class="btn primary" aria-label="Ajouter">${ICO("check",18)}</button></form>
    ${kind==="fam"?`<div class="obsug">${OB_FAM.filter(n=>!list.some(p=>p.n===n)).map(n=>`<button type="button" class="xmch" data-n="${n}"><b>${n}</b></button>`).join("")}</div>`:""}`;
  const ok=()=>{const s=st.step;if(s===1)return st.name.trim().length>0;if(s===3)return st.ids.length>0;if(s===4)return st.rit.matin.size+st.rit.soir.size>=2;if(s===5)return st.fam.length>=2;if(s===6)return st.fr.length>=2;return true};
  const need=()=>{const s=st.step;return s===1?"Écris ton prénom":s===3?"Choisis au moins une identité":s===4?"Choisis au moins 2 rituels":s===5?`Encore ${2-st.fam.length} personne${2-st.fam.length>1?"s":""}`:s===6?`Encore ${2-st.fr.length} ami${2-st.fr.length>1?"s":""}`:""};
  const draw=()=>{const s=st.step;let b="";
    if(s===0)b=`<div class="obhero">${pxImg("chest",7)}<h2>Bienvenue dans ton Carnet de Quêtes</h2><p>Ta vie devient un jeu de rôle. Chaque petit geste compte : bouger, lire, appeler un proche, tenir tes rituels. Tu gagnes de l'XP, tu relèves des défis, et surtout tu vois qui tu deviens.</p><p class="hint">On va créer ton profil ensemble. Ça prend 3 minutes.</p></div>`;
    if(s===1)b=`<h2>Qui es-tu ?</h2><label class="rdl">Ton prénom<input class="obname" maxlength="14" placeholder="Ton prénom"></label>
      <div class="obav"><img class="obprev" alt="Ton personnage" src="${avUrl()}"><div class="obavo"><small>Teint</small><div class="obsw">${AV_OPT.skin.map((x,i)=>`<button type="button" data-k="skin" data-v="${i}" style="--sw:${x[0]}" aria-pressed="${st.cfg.skin===i}" aria-label="Teint ${i+1}"></button>`).join("")}</div>
      <small>Cheveux</small><div class="obsw">${AV_OPT.hairC.map((x,i)=>`<button type="button" data-k="hairC" data-v="${i}" style="--sw:${x}" aria-pressed="${st.cfg.hairC===i}" aria-label="Couleur ${i+1}"></button>`).join("")}</div>
      <small>Haut</small><div class="obsw">${AV_OPT.topC.map((x,i)=>`<button type="button" data-k="topC" data-v="${i}" style="--sw:${x}" aria-pressed="${st.cfg.topC===i}" aria-label="Couleur ${i+1}"></button>`).join("")}</div></div></div>
      ${HAIR_GRP.map(([gl,ids])=>`<p class="avc-grp">${gl}</p><div class="obhair">${ids.map(i=>`<button type="button" data-h="${i}" aria-pressed="${st.cfg.hair===i}"><span>${esc(AV_OPT.hair[i])}</span></button>`).join("")}</div>`).join("")}
      <p class="hint">Tu pourras tout peaufiner plus tard dans ton profil : barbe, lunettes, fonds, accessoires.</p>`;
    if(s===2)b=`<h2>Tes passions</h2><p class="oblead">Choisis ce que tu fais pour le plaisir. Chaque passion devient un skill qui monte de niveau.</p>
      <div class="oblz"><button type="button" class="oblzb${st.mus?" on":""}" data-z="mus" style="--zc:var(--c-perso)"><b>Musique</b><small>Créer des sons, écrire, enregistrer</small></button>${LZ.map(L=>`<button type="button" class="oblzb${st.lz.includes(L.id)?" on":""}" data-z="${L.id}" style="--zc:${L.c}"><b>${esc(L.n)}</b><small>${L.a.map(a=>esc(a[1])).join(" · ")}</small></button>`).join("")}</div><p class="hint">${LZ_MAX} au maximum, hors musique.</p>`;
    if(s===3)b=`<h2>Qui veux-tu devenir ?</h2><p class="oblead">Choisis 1 à 3 identités. L'appli te proposera des actions dans leur sens et te racontera ton chemin.</p><div class="idlist">${IDS.map(I=>`<button type="button" class="idopt${st.ids.includes(I.id)?" on":""}" data-id="${I.id}" style="--ic:${I.c}"><span class="idi">${pxImg(I.ic,3)}</span><span class="idt"><b>${esc(I.n)}</b><small>${esc(I.d)}</small></span></button>`).join("")}</div>`;
    if(s===4){const sug=p=>RIT_BRICKS.filter(r=>r[1]===p||r[1]==="both").sort((a,b)=>(b[2].some(x=>st.ids.includes(x))?1:0)-(a[2].some(x=>st.ids.includes(x))?1:0));
      b=`<h2>Tes rituels</h2><p class="oblead">Les petits gestes que tu veux faire chaque jour sans y penser. Commence petit : mieux vaut 3 rituels tenus que 10 oubliés.</p>${["matin","soir"].map(p=>`<h4>${p==="matin"?"Le matin":"Le soir"} <em>${st.rit[p].size}</em></h4><div class="rabr">${[...new Set([...st.rit[p],...sug(p).map(r=>r[0])])].map(n=>{const r=RIT_BRICKS.find(x=>x[0]===n),I=r&&r[2].map(idOf).find(I=>I&&st.ids.includes(I.id));return`<button type="button" class="rabk obrb${st.rit[p].has(n)?" on":""}" data-p="${p}" data-n="${esc(n)}"${I?` style="--ic:${I.c}"`:""}>${I?`<em>${esc(I.n)}</em>`:""}<span>${esc(n)}</span></button>`}).join("")}</div>
        <form class="obadd" data-p="${p}"><input maxlength="40" placeholder="Mon propre rituel du ${p}" aria-label="Rituel du ${p}"><button type="submit" class="btn primary" aria-label="Ajouter">${ICO("check",18)}</button></form>`).join("")}`}
    if(s===5)b=`<h2>Ta famille</h2><p class="oblead">Ajoute au moins 2 proches de ta famille. L'appli te rappellera de les appeler et n'oubliera aucun anniversaire.</p>${people(st.fam,"fam")}`;
    if(s===6)b=`<h2>Tes amis</h2><p class="oblead">Ajoute au moins 2 amis. Touche l'étoile pour ton meilleur ami. Tu pourras créer des groupes ensuite.</p>${people(st.fr,"fr")}`;
    if(s===7)b=`<div class="obhero"><img class="obprev big" alt="" src="${avUrl()}"><h2>Prêt, ${esc(st.name.trim())} ?</h2><ul class="obsum"><li><b>${st.ids.map(id=>idOf(id).n).join(", ")}</b><small>ce que tu deviens</small></li><li><b>${st.rit.matin.size+st.rit.soir.size} rituels</b><small>${st.rit.matin.size} le matin, ${st.rit.soir.size} le soir</small></li><li><b>${st.fam.length+st.fr.length} proches</b><small>${st.fam.length} en famille, ${st.fr.length} amis</small></li></ul><p class="hint">Tes premières quêtes t'attendent. +50 XP pour bien démarrer.</p></div>`;
    o.innerHTML=`<div class="obc"><div class="obtop">${s>0?`<button type="button" class="obback" aria-label="Retour">${ICO("chev",18)}</button>`:"<span></span>"}<div class="obdots">${STEPS.map((_,i)=>`<i class="${i<=s?"on":""}"></i>`).join("")}</div><span></span></div><div class="obbody">${b}</div>
      <div class="obfoot"><button type="button" class="btn primary obnext"${ok()?"":" disabled"}>${ok()?(s===0?"Créer mon profil":s===7?"C'est parti !":"Continuer"):need()}</button></div></div>`;
    const nx=o.querySelector(".obnext");nx.onclick=()=>{if(!ok())return;if(s===7){obFinish(st);o.remove();return}st.step++;sfx("blip");draw();o.querySelector(".obbody").scrollTop=0};
    const bk=o.querySelector(".obback");if(bk)bk.onclick=()=>{st.step--;draw()};
    const refresh=()=>{const e=o.querySelector(".obnext");e.disabled=!ok();e.textContent=ok()?"Continuer":need()};
    if(s===1){const ni=o.querySelector(".obname");ni.value=st.name;ni.oninput=()=>{st.name=ni.value;refresh()};
      o.querySelectorAll(".obsw button").forEach(x=>x.onclick=()=>{st.cfg[x.dataset.k]=+x.dataset.v;draw()});
      o.querySelectorAll(".obhair button").forEach(x=>{x.insertBefore(avcThumb({...st.cfg,hair:+x.dataset.h},"hair"),x.firstChild);x.onclick=()=>{st.cfg.hair=+x.dataset.h;const y=o.querySelector(".obbody").scrollTop;draw();o.querySelector(".obbody").scrollTop=y}})}
    if(s===2)o.querySelectorAll(".oblzb").forEach(x=>x.onclick=()=>{const z=x.dataset.z;if(z==="mus")st.mus=!st.mus;else if(st.lz.includes(z))st.lz=st.lz.filter(q=>q!==z);else{if(st.lz.length>=LZ_MAX){toast(LZ_MAX+" passions maximum");return}st.lz.push(z)}sfx("blip");draw()});
    if(s===3)o.querySelectorAll(".idopt").forEach(x=>x.onclick=()=>{const id=x.dataset.id;if(st.ids.includes(id))st.ids=st.ids.filter(q=>q!==id);else{if(st.ids.length>=3){toast("3 identités maximum");return}st.ids.push(id)}sfx("blip");draw()});
    if(s===4){o.querySelectorAll(".obrb").forEach(x=>x.onclick=()=>{const p=x.dataset.p,n=x.dataset.n,S0=st.rit[p];S0.has(n)?S0.delete(n):S0.add(n);sfx("blip");const y=o.querySelector(".obbody").scrollTop;draw();o.querySelector(".obbody").scrollTop=y});
      o.querySelectorAll(".obadd").forEach(f=>f.onsubmit=e=>{e.preventDefault();const v=f.querySelector("input").value.trim();if(!v)return;st.rit[f.dataset.p].add(v);const y=o.querySelector(".obbody").scrollTop;draw();o.querySelector(".obbody").scrollTop=y})}
    if(s===5||s===6){const L=s===5?st.fam:st.fr,kind=s===5?"fam":"fr";
      o.querySelectorAll(".obpl b").forEach(x=>x.textContent=L[+x.dataset.i].n);
      o.querySelectorAll(".obbd").forEach(x=>{const p=L[+x.dataset.i];x.value=p.bd||"";x.oninput=()=>{let v=x.value.replace(/[^\d]/g,"").slice(0,4);if(v.length>2)v=v.slice(0,2)+"/"+v.slice(2);x.value=v;p.bd=v}});
      o.querySelectorAll(".obrm").forEach(x=>x.onclick=()=>{const p=L.splice(+x.dataset.i,1)[0];if(st.best===p.n)st.best="";draw()});
      o.querySelectorAll(".obbest").forEach(x=>x.onclick=()=>{const n=L[+x.dataset.i].n;st.best=st.best===n?"":n;sfx("coin");draw()});
      const add=n=>{n=n.trim().slice(0,20);if(!n)return;if([...st.fam,...st.fr].some(p=>p.n.toLowerCase()===n.toLowerCase())){toast("Cette personne est déjà dans ta liste");return}L.push({n,bd:""});sfx("coin");draw();const i=o.querySelector(".obadd input");if(i)i.focus()};
      o.querySelector(".obadd").onsubmit=e=>{e.preventDefault();add(e.target.querySelector("input").value)};
      o.querySelectorAll(".obsug [data-n]").forEach(x=>x.onclick=()=>add(x.dataset.n))}};
  draw()}
function obFinish(st){const G=S.g;S.name=st.name.trim().slice(0,14);G.avc={...st.cfg};
  const parseBd=v=>{const m=/^(\d{1,2})\/(\d{1,2})$/.exec(v||"");if(!m)return null;const d=+m[1],mo=+m[2];return d>=1&&d<=31&&mo>=1&&mo<=12?{d,m:mo}:null};
  S.profiles={};S.family=st.fam.map(p=>p.n);S.friends=st.fr.map(p=>p.n);S.friendDone=[];S.familyDone=[];S.bonds={};S.bondsLast={};
  [...st.fam,...st.fr].forEach(p=>{const P=S.profiles[p.n]={};const bd=parseBd(p.bd);if(bd)P.bd=bd;if(p.n===st.best)P.best=true});
  G.fgr=[];const z=lzState();z.on=st.lz.slice(0,LZ_MAX);
  G.noMus=st.mus?0:1;S.music=st.mus?OB_MUSIC.slice():[];G.music=S.music.slice();S.musicDone=[];
  if(!st.mus){S.actions=S.actions.filter(a=>!/^Faire du son|couplet/i.test(a.name));S.skills=S.skills.filter(k=>k.name!=="Sons")}
  idState().ch=st.ids.slice(0,3);
  const T=[];let k=0;["matin","soir"].forEach(p=>st.rit[p].forEach(n=>{const a=S.actions.find(x=>x.name.toLowerCase()===n.toLowerCase());T.push({id:"r"+(k++)+Date.now().toString(36),name:n,n:1,when:p,ct:Date.now(),...(a?{link:a.name}:{})})}));
  T.push({id:"r3",name:"Manger",n:3,bar:"nourriture",when:"jour",ct:Date.now()},{id:"r6",name:"Verres d'eau",n:8,bar:"eau",link:"1 verre d'eau",when:"jour",ct:Date.now()});
  S.daily.tasks=T;S.daily.wAdded=true;S.daily.c={};S.daily.day=dayKey(Date.now());
  S.specials=[];G.onb=Date.now();if(typeof ensureGroupQuests==="function")ensureGroupQuests();
  const prev=levelInfo(S.xp).l;addBonus("Bienvenue, "+S.name,50,0,"onb");save();render(prev);showView("q");
  setTimeout(()=>{sfx("level");toast(`Ton aventure commence, <span class="p">${esc(S.name)}</span> ! +50 XP`)},400)}

