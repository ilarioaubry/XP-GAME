// Chez moi : affichage de la maison et des pièces (ex-25, partie 3)
// ---------- Affichage : mêmes codes que les autres cartes (bordure 2 px colorée, titre en capitales, boutons carrés à icône)
const HM_COL={chambre:"#a99cff",biblio:"#c98a4a",studio:"#2fe3d6",video:"#ff5fa8",cuisine:"#e8873a",sport:"#d63b3b",carte:"#5ac27a"};
const HM_NAME={chambre:"Chambre",biblio:"Bibliothèque",studio:"Studio",video:"Vidéoclub",cuisine:"Cuisine",sport:"Sport",carte:"Sorties"};
function renderHome(force){const box=document.getElementById("homeBox");if(!box||!S.g)return;if(!force&&box.contains(document.activeElement)&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  const H=hmData();document.documentElement.dataset.room=hmRoom||"home";
  if(!hmRoom){const hh=`<div class="hmcard hmover">${hmHTML(H)}</div>`;if(box.__h===hh&&box.querySelector(".hmhouse"))return;box.innerHTML=hh;box.__h=hh;
    box.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{hmRoom=b.dataset.r;sfx("blip");renderHome(1);box.scrollIntoView({block:"start",behavior:"smooth"})});return}
  box.__h="";const i=HM_ROOMS.findIndex(r=>r[0]===hmRoom),col=HM_COL[hmRoom];
  const nav=`<div class="hmh2"><h2>${HM_NAME[hmRoom]}</h2><button type="button" class="hmib hmback" aria-label="Retour à la maison"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/></svg></button><button type="button" class="hmib hmprev" data-d="-1" aria-label="Pièce précédente">${ICO("chev",20)}</button><button type="button" class="hmib hmnext" data-d="1" aria-label="Pièce suivante">${ICO("chev",20)}</button></div>`;
  if(hmRoom==="biblio"){box.innerHTML=`<div class="hmcard" style="--hc:${col}">${nav}<div class="hmscene hmlib">${libHTML()}</div></div>`;libBind(box)}
  else{const D=hmRoomData(H,hmRoom);
    box.innerHTML=`<div class="hmcard" style="--hc:${col}">${nav}<div class="hmscene">${D.svg}</div><div class="hminfo" aria-live="polite"></div>${D.extra||""}</div>`;
    const info=box.querySelector(".hminfo"),show=g=>{const o=g.dataset.o;if(o==="book"){const r=box.querySelector(".rcp");r&&r.scrollIntoView({block:"center",behavior:"smooth"});return}const h=D.info(o);if(!h)return;const was=g.classList.contains("sel");box.querySelectorAll(".hmo.sel").forEach(x=>x.classList.remove("sel"));if(was){info.innerHTML="";return}g.classList.add("sel");info.innerHTML=h;sfx("coin");bindNames()};
    const bindNames=()=>{info.querySelectorAll("[data-ns]").forEach(b=>b.onclick=()=>{const t=b.dataset.ns,v=info.querySelector(`[data-nt="${t}"]`).value.trim();if(v)H.nm[t]=v;else delete H.nm[t];save();renderHome(1)});
      info.querySelectorAll("[data-ps]").forEach(b=>b.onclick=()=>{const t=b.dataset.ps,v=info.querySelector(`[data-pt="${t}"]`).value.trim();if(v)H.pl[t]=v;else delete H.pl[t];save();renderHome(1)});
      info.querySelectorAll("[data-sg]").forEach(b=>b.onclick=()=>{H.nm[b.dataset.sg]=b.dataset.v;save();renderHome(1)});
      info.querySelectorAll("input").forEach(inp=>inp.onkeydown=e=>{if(e.key==="Enter"){const b=inp.nextElementSibling;b&&b.click()}})};
    box.querySelectorAll(".hmo").forEach(g=>{g.onclick=()=>show(g);g.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();show(g)}}});
    if(hmRoom==="cuisine")hmRecipeBind(box)}
  box.querySelector(".hmback").onclick=()=>{hmRoom=null;renderHome(1)};
  box.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{const j=(i+ +b.dataset.d+HM_ROOMS.length)%HM_ROOMS.length;hmRoom=HM_ROOMS[j][0];sfx("blip");renderHome(1)});
  const sc=box.querySelector(".hmscene");if(sc){let x0=null;sc.addEventListener("touchstart",e=>{x0=e.touches[0].clientX},{passive:true});sc.addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>60){const b=box.querySelector(`[data-d="${dx<0?1:-1}"]`);b&&b.click()}},{passive:true})}};
// infos : lignes simples, sans carte dans la carte
function hmPop(kind,title,rows,extra){return`<div class="hmpop"><h4>${esc(title)}</h4><ul>${rows}</ul>${extra||""}</div>`};
function hmRecipes(){const R=S.g.rcp||[],op=window.__rcpOpen;return`<div class="rcp"><div class="rcph2"><h3>Recettes</h3><button type="button" class="hmib rcpadd" aria-label="Nouvelle recette">${ICO("plus",20)}</button></div>
  ${window.__rcpNew?`<div class="rcpf"><input id="rcpN" maxlength="50" placeholder="Nom"><textarea id="rcpI" rows="3" placeholder="Ingrédients, un par ligne"></textarea><textarea id="rcpS" rows="3" placeholder="Étapes, une par ligne"></textarea><div class="rcpb"><button type="button" class="btn rcpx">Annuler</button><button type="button" class="btn primary rcpok">Enregistrer</button></div></div>`:""}
  ${R.length?`<ul class="rcpl">${R.map(r=>`<li class="${op===r.id?"open":""}"><button type="button" class="rcph" data-ro="${r.id}"><b></b><small>${r.c?`${r.c} fois · ${hmFd(r.t)}`:"jamais faite"}</small></button><button type="button" class="hmib rcpdo" data-rd="${r.id}" aria-label="Je l'ai cuisinée">${ICO("check",20)}</button>
    ${op===r.id?`<div class="rcpd">${r.ing?`<small>Ingrédients</small><ul>${r.ing.split("\n").filter(Boolean).map(()=>`<li></li>`).join("")}</ul>`:""}${r.st?`<small>Étapes</small><ol>${r.st.split("\n").filter(Boolean).map(()=>`<li></li>`).join("")}</ol>`:""}<button type="button" class="lnk rcpdel" data-rx="${r.id}">Supprimer</button></div>`:""}</li>`).join("")}</ul>`:""}</div>`};

/*HM2-END*/
