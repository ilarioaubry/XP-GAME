// Paliers des jauges (lot 4, 03/11) : chaque quête proposée a un cran (simple, costaud, dur) d'après son XP ;
// le niveau de la catégorie débloque les crans : niv. 1 simple · niv. 3 costaud · niv. 5 dur · niv. 10 exploits (plus de 30 XP).
// Les paliers reprennent les récompenses qui existaient déjà (titre au 3, aura au 5, objet exclusif au 10, voir catRewards)
// et ajoutent 1 h d'XP ×2 sur la catégorie, gardée en réserve, au palier 3. Le panneau + n'est jamais verrouillé.
const PAL_LV=[1,3,5,10];
const PAL_CATS=["sport","perso","social","famille","maison","soi","travail","nourriture"];
const PAL_IC={sport:"halteres",perso:"pinceau",social:"duo",famille:"famille",maison:"maisonp",soi:"soleil",travail:"laptop",nourriture:"repas",eau:"eau"};
const CRAN_N=["","Simple","Costaud","Dur"];
const cranOf=xp=>xp>25?3:xp>15?2:1; // XP affichée : 3–10 simple, 20 costaud, 30–35 dur
const reqOf=xp=>xp>30?10:PAL_LV[cranOf(xp)-1];
const catLv=c=>statInfo(((S&&S.stats)||{})[c]||0).l;
const palOf=c=>{const l=catLv(c);return l>=10?3:l>=5?2:l>=3?1:0};
const cranMax=c=>PAL_CATS.includes(c)?Math.min(3,palOf(c)+1):3;
function questOk(cat,xp){return!PAL_CATS.includes(cat)||catLv(cat)>=reqOf(xp|0)}
function cransHTML(n){return`<i class="crans c${n}" role="img" aria-label="Difficulté : ${CRAN_N[n]}" title="${CRAN_N[n]}"><span></span><span></span><span></span></i>`}
// ce qu'un palier débloque (k = 1, 2 ou 3 : niveaux 3, 5 et 10)
const PAL_TXT=["","Quêtes costaudes débloquées","Quêtes dures débloquées","Exploits débloqués"];
function palNext(c){const l=catLv(c),p=palOf(c);if(p>=3)return null;const lv=PAL_LV[p+1];let need=0;{let x=(S.stats||{})[c]||0,L=1,acc=0;while(L<lv){acc+=statNeed(L);L++}need=Math.max(0,acc-x)}
  const n=FQ.filter(q=>q[2]===c&&reqOf(q[3])===lv).length;return{lv,need,txt:PAL_TXT[p+1],n}}

// ---- boosts en réserve : 1 h d'XP ×2 (sur une catégorie, ou partout), 3 au plus, lancés quand tu veux
const BOOST_MAX=3;
function boostsOf(){const G=S.g;if(!Array.isArray(G.boosts))G.boosts=[];return G.boosts}
function boostAdd(c,why){const L=boostsOf();if(L.length>=BOOST_MAX)return false;L.push({c:c||"",t:Date.now(),w:why||""});return true}
function boostCatOn(c){const B=S.g&&S.g.boostC;return!!(B&&B.e>Date.now()&&B.c===c)}
function boostLive(){const G=S.g||{},now=Date.now();if(G.boost>now)return{c:"",e:G.boost};if(G.boostC&&G.boostC.e>now)return{c:G.boostC.c,e:G.boostC.e};return null}
const boostLab=c=>c?(CATS[c]||{}).label||c:"tout";
function boostUse(i,after){const L=boostsOf(),b=L[i];if(!b)return;if(boostLive()){toast("Un boost est déjà en cours");return}
  L.splice(i,1);const e=Date.now()+36e5;if(b.c)S.g.boostC={c:b.c,e};else S.g.boost=e;save();try{sfx("level")}catch(_){}
  toast(`XP ×2 sur ${esc(boostLab(b.c))} pendant <span class="p">1 h</span>`);render();if(after)after()}
function boostAsk(i,after){const b=boostsOf()[i];if(!b)return;if(document.querySelector(".bstw"))return;
  const v=document.createElement("div");v.className="ui-voile bstw";v.setAttribute("role","dialog");v.setAttribute("aria-modal","true");v.setAttribute("aria-label","Lancer un boost");
  const col=b.c&&CATS[b.c]?CATS[b.c].c:"var(--ui-or)",ln=(ic,t)=>`<li><div class="ui-ligne"><span class="ui-ligne__ic">${rkSvg(ic)}</span><span class="ui-ligne__t"><span>${t}</span></span><span></span></div></li>`;
  v.innerHTML=`<div class="ui-fenetre" style="--sc:${col}">${uiScene("eclair",col,{rays:1,sub:"×2"})}<h2 class="ui-fenetre__titre">Lancer le boost ?</h2><ul class="ui-lignes">${ln(b.c?PAL_IC[b.c]||"etoile":"etoile",`XP ×2 sur ${esc(boostLab(b.c))}`)}${ln("sablier","Pendant 1 h, dès maintenant")}</ul><div class="bstb"><button type="button" class="ui-btn bstno">Plus tard</button><button type="button" class="ui-btn ui-btn--principal bstgo">Lancer</button></div></div>`;
  const close=()=>v.remove();v.onclick=e=>{if(e.target===v)close()};v.querySelector(".bstno").onclick=close;v.querySelector(".bstgo").onclick=()=>{close();boostUse(i,after)};document.body.appendChild(v)}

// ---- passage de palier : récompenses et petite fenêtre (appelé par gameTick)
function palCheck(){const G=S.g;if(!G)return false;
  if(!G.pal||typeof G.pal!=="object"){G.pal={};PAL_CATS.forEach(c=>G.pal[c]=palOf(c));return true}
  const groups=[];let ch=false;
  PAL_CATS.forEach(c=>{const p=palOf(c),o=G.pal[c]|0;if(p<=o)return;G.pal[c]=p;ch=true;const it=[];
    for(let k=o+1;k<=p;k++){it.push({ic:"crans"+Math.min(3,k+1),t:PAL_TXT[k]});
      const rw=CAT_RW[c];
      if(k===1){it.push({ic:"eclair",t:boostAdd(c,"palier")?`1 h d'XP ×2 sur ${boostLab(c)}, en réserve`:"Réserve de boosts pleine (3 au plus)"});if(rw)it.push({ic:"medaille",t:`Titre « ${rw[0]} »`})}
      if(k===2){const au=Q_AURA[c],g=au&&GEAR.find(x=>x.id===au);if(g)it.push({ic:"etoile",t:`Aura « ${g.n} »`})}
      if(k===3&&rw){const g=gearOf(rw[1]);if(g)it.push({ic:"coffre",t:`Objet exclusif « ${g.n} »`})}}
    groups.push({c,lv:PAL_LV[p],it})});
  if(groups.length)setTimeout(()=>palPop(groups),650);
  return ch}
function palPop(groups){if(document.querySelector(".palpop"))return;
  const icon=k=>k.startsWith("crans")?cransHTML(+k.slice(5)):rkSvg(k);
  const v=document.createElement("div");v.className="ui-voile palpop";v.setAttribute("role","dialog");v.setAttribute("aria-modal","true");v.setAttribute("aria-label","Palier débloqué");
  const col=g=>(CATS[g.c]||{}).c||"var(--ui-or)";
  v.innerHTML=`<div class="ui-fenetre palw" style="--sc:${col(groups[0])}">${groups.map((g,i)=>`<div class="palg" style="--sc:${col(g)}">${i?`<span class="palic">${rkSvg(PAL_IC[g.c]||"etoile")}</span>`:uiScene(PAL_IC[g.c]||"etoile",col(g),{rays:1,sub:"Niv "+g.lv})}${i?"":`<h2 class="ui-fenetre__titre">Palier débloqué</h2>`}<p class="ui-sous-titre">${esc((CATS[g.c]||{}).label||g.c)} · niveau ${g.lv}</p>
    <ul class="ui-lignes">${g.it.map(x=>`<li><div class="ui-ligne"><span class="ui-ligne__ic">${icon(x.ic)}</span><span class="ui-ligne__t"><span>${esc(x.t)}</span></span><span></span></div></li>`).join("")}</ul></div>`).join("")}
    <button type="button" class="ui-btn ui-btn--principal palok">Super</button></div>`;
  const close=()=>{v.remove();try{render()}catch(_){}};v.onclick=e=>{if(e.target===v)close()};v.querySelector(".palok").onclick=close;
  document.body.appendChild(v);try{sfx("level")}catch(_){}}

// ---- Moi > Ma vie : mes paliers (refonte du 03/11) : une tuile par jauge (icône, niveau, barre, crans débloqués) ;
// le détail (ce que chaque palier débloque) s'ouvre au toucher. Les boosts en réserve en tuiles au-dessus, sans texte.
let palAng=-1;
function renderPal(){const box=$("palBox");if(!box||!S.g)return;const L=boostsOf(),live=boostLive(),done=PAL_CATS.reduce((a,c)=>a+palOf(c),0);
  const tiles=PAL_CATS.map(c=>{const l=catLv(c),p=palOf(c),C=CATS[c]||{},si=statInfo(((S.stats||{})[c])||0);
    return`<button type="button" class="ui-tuile pal-t" data-c="${c}" style="--pc:${C.c||"var(--gold)"}" aria-label="${esc(C.label||c)} : niveau ${l}, ${si.cur} sur ${si.need} XP"><span class="pal-h">${cransHTML(p)}<span class="pal-lv">${l}</span></span>${rkSvg(PAL_IC[c]||"etoile")}<span class="ui-tuile__nom">${esc(C.label||c)}</span><span class="ui-barre pal-b"><i style="width:${Math.round(si.cur/si.need*100)}%"></i></span></button>`}).join("");
  // Cobalt (maquette E Ma vie) : 4 angles en 2×2 ; toucher un angle déplie ses jauges (et leurs paliers)
  const st=S.stats||{},ang=ANGLES.map(([n,col,cats,ic],i)=>{const I=statInfo(cats.reduce((a,k)=>a+(st[k]||0),0)),pc=cats.filter(k=>PAL_CATS.includes(k)),pp=Math.max(0,...pc.map(palOf));
    const nx=pc.map(k=>palNext(k)).filter(Boolean)[0];
    return`<button type="button" class="ang-t${palAng===i?" on":""}" data-a="${i}" style="--ac:${col}" aria-expanded="${palAng===i}"><span class="ang-th">${rkSvg(ic)}<b>${n}</b><em>${I.l}</em></span><span class="ang-bar"><i style="width:${Math.round(100*I.cur/I.need)}%"></i></span><span class="ang-pips">${[0,1,2,3].map(k=>`<i class="${k<=pp?"on":""}"></i>`).join("")}</span><small>${nx?`Niv ${nx.lv} : ${esc(nx.txt||"")}`:"Tous les paliers atteints"}</small></button>`}).join("");
  const sub=palAng>=0?PAL_CATS.filter(c=>ANGLES[palAng][2].includes(c)):[];
  box.innerHTML=`<div class="ui-entete"><h2 class="ui-titre">Mes 4 angles</h2><span class="ui-compteur">${done}/${PAL_CATS.length*3}</span></div>
    ${live||L.length?`<div class="pal-bst">${live?`<span class="ui-tuile pal-on" role="img" aria-label="XP ×2 sur ${esc(boostLab(live.c))}, encore ${Math.max(1,Math.ceil((live.e-Date.now())/60000))} min">${rkSvg("eclair")}<span class="ui-tuile__nom">${Math.max(1,Math.ceil((live.e-Date.now())/60000))} min</span></span>`:""}${L.map((b,i)=>`<button type="button" class="ui-tuile" data-b="${i}" aria-label="Lancer 1 h d'XP ×2 sur ${esc(boostLab(b.c))}">${rkSvg("eclair")}<span class="ui-tuile__nom">×2 ${esc(b.c?boostLab(b.c):"Partout")}</span></button>`).join("")}</div>`:""}
    <div class="ang-g">${ang}</div>${sub.length?`<div class="ui-tuiles pal-g">${tiles.split("</button>").filter(t=>sub.some(c=>t.includes(`data-c="${c}"`))).map(t=>t+"</button>").join("")}</div>`:""}`;
  box.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{palAng=palAng===+b.dataset.a?-1:+b.dataset.a;renderPal()});
  box.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>boostAsk(+b.dataset.b,renderPal));
  box.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>palOpen(b.dataset.c))}
// détail d'une jauge : petite fenêtre, les 4 paliers et ce qu'ils débloquent
function palOpen(c){if(document.querySelector(".palw2"))return;const l=catLv(c),p=palOf(c),C=CATS[c]||{},si=statInfo(((S.stats||{})[c])||0),nx=palNext(c);
  const R=[[1,"Quêtes simples"],[3,"Quêtes costaudes"],[5,"Quêtes dures"],[10,"Exploits"]];
  const v=document.createElement("div");v.className="ui-voile palw2";v.setAttribute("role","dialog");v.setAttribute("aria-modal","true");v.setAttribute("aria-label",(C.label||c)+" : paliers");
  const col=C.c||"var(--ui-or)";
  v.innerHTML=`<div class="ui-fenetre palf" style="--pc:${col};--sc:${col}">${uiScene(PAL_IC[c]||"etoile",col,{sub:"Niv "+l})}<h2 class="ui-fenetre__titre">${esc(C.label||c)}</h2>
    <span class="ui-barre ui-barre--grande pal-b"><i style="width:${Math.round(si.cur/si.need*100)}%"></i><span class="ui-barre__txt">${si.cur} / ${si.need} XP</span></span>
    <ul class="ui-lignes pal-ech">${R.map(([lv,t],k)=>`<li><div class="ui-ligne${k>p+1?" ui-ligne--off":""}${k<=p?" on":""}"><span class="ui-ligne__ic">${cransHTML(Math.min(3,k+1))}</span><span class="ui-ligne__t"><span>${t}</span><small>${k<=p?"Débloqué":k===p+1&&nx?`Niveau ${lv} · encore ${nx.need} XP`:`Niveau ${lv}`}</small></span><span class="pal-fin">${rkSvg(k<=p?"check":"cadenas")}</span></div></li>`).join("")}</ul>
    <button type="button" class="ui-btn ui-btn--principal palx">Fermer</button></div>`;
  const close=()=>v.remove();v.onclick=e=>{if(e.target===v)close()};v.querySelector(".palx").onclick=close;document.body.appendChild(v)}

// ---- journée relance (4.3) : après deux jours sans rien noter, la première action du jour compte triple, sans reproche
function relanceOn(){const G=S.g;if(!G)return false;const tk=dayKey(Date.now());if(G.relance===tk)return false;
  const L=(S.log||[]).filter(e=>e&&e.xp>0&&!e.bonus);if(L.length<5)return false;
  const days=new Set(L.map(e=>dayKey(e.t)));if(days.has(tk))return false;
  const d1=dayKey(Date.now()-864e5),d2=dayKey(Date.now()-2*864e5);return!days.has(d1)&&!days.has(d2)}
