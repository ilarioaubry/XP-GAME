// ---- Sons 8 bits synthétisés
const SFX={ctx:null,noise:null};
function sfxCtx(){if(!SFX.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{SFX.ctx=new C()}catch(e){return null}}if(SFX.ctx.state==="suspended")SFX.ctx.resume().catch(()=>{});return SFX.ctx}
function sfxOn(){return!(S.g&&S.g.mute)}
function tone(c,f,t,d,type,vol,f2){const o=c.createOscillator(),g=c.createGain();o.type=type||"square";o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.08,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
function noise(c,t,d,vol,hp){if(!SFX.noise){const b=c.createBuffer(1,c.sampleRate*.4,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;SFX.noise=b}const s2=c.createBufferSource(),g=c.createGain(),f=c.createBiquadFilter();s2.buffer=SFX.noise;f.type="bandpass";f.frequency.value=hp||900;g.gain.setValueAtTime(vol||.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s2.connect(f);f.connect(g);g.connect(c.destination);s2.start(t);s2.stop(t+d+.02)}
const seq=(c,t,notes,step,type,vol)=>notes.forEach((f,i)=>{if(f)tone(c,f,t+i*step,step*1.6,type,vol)});
function sfx(n,arg){if(!sfxOn())return;const c=sfxCtx();if(!c)return;SFX.last=performance.now();const t=c.currentTime+.01;
  switch(n){
   case"coin":tone(c,988,t,.07,"square",.07);tone(c,1319,t+.07,.18,"square",.07);break;
   case"level":seq(c,t,[523,659,784,1047,0,784,1047,1319],.085,"square",.07);tone(c,1568,t+.7,.45,"triangle",.09);break;
   case"badge":seq(c,t,[784,988,1175,1568],.09,"square",.06);tone(c,2093,t+.36,.3,"triangle",.07);break;
   case"moment":seq(c,t,[659,784,988,1319],.1,"triangle",.1);break;
   case"start":tone(c,660,t,.06,"square",.05);tone(c,990,t+.06,.1,"square",.05);break;
   case"alarm":for(let i=0;i<4;i++){tone(c,880,t+i*.3,.12,"square",.07);tone(c,660,t+i*.3+.14,.12,"square",.07)}break;
   case"error":tone(c,180,t,.1,"sawtooth",.05);tone(c,140,t+.12,.14,"sawtooth",.05);break;
   case"blip":tone(c,1200,t,.04,"square",.04);break;
   case"bop":tone(c,520,t,.05,"triangle",.11,780);tone(c,1040,t+.035,.04,"square",.025);break;
   case"rep":{const f=523*Math.pow(2,(arg||0)/12);tone(c,f,t,.07,"square",.06);tone(c,f*1.5,t+.05,.08,"square",.045);break}
   case"glug":{const b=380+(arg||0)*40;tone(c,b,t,.09,"sine",.12,b*1.8);tone(c,b*1.3,t+.08,.08,"sine",.09,b*2.2);noise(c,t+.02,.06,.03,900);break}
   case"hit":noise(c,t,.07,.13,1600);tone(c,arg?300:460,t,arg?.35:.14,"square",.08,arg?60:150);if(arg)seq(c,t+.3,[392,330,262],.09,"square",.05);break;
   case"drop":tone(c,180,t,.18,"triangle",.14,60);noise(c,t,.12,.08,300);break;
   case"shake":{const k=arg||1;noise(c,t,.09+.03*k,.07+.03*k,500+k*250);tone(c,140+k*45,t,.08,"square",.05,90+k*30);break}
   case"open":{const r=arg|0;noise(c,t,.35,.12,2500);tone(c,300,t,.28,"triangle",.1,1200);
     const A=[[523,659,784],[523,659,784,1047],[523,659,784,1047,1319,1568],[392,523,659,784,1047,1319,1568,2093]][r];seq(c,t+.25,A,r>=2?.075:.09,"square",.07);
     if(r>=2){const e=t+.25+A.length*.075;[1047,1319,1568].forEach(f=>tone(c,f,e,r===3?1.1:.6,"triangle",.06))}
     if(r===3)for(let i=0;i<10;i++)tone(c,2000+Math.random()*2000,t+1+i*.07,.06,"square",.025);break}
  }}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;const el=t.closest("button,[role=button],[role=tab],[role=link],a[href],summary,.rl,.motc,.bdg,.wr-it,.evav");if(!el||el.disabled)return;if(performance.now()-(SFX.last||0)<90)return;sfx("bop")});
["pointerdown","touchstart","keydown"].forEach(ev=>document.addEventListener(ev,function un(){sfxCtx();if(S.g&&S.g.ambS)ambSnd(true);document.removeEventListener(ev,un)},{once:true,passive:true}));

// ---- Proches : profils, relations, groupes


function cbWho(t){return[...S.friends,...S.family].filter(n=>n&&t.includes(n)).sort((a,b)=>b.length-a.length)[0]||null}
function pAv(n,cls){const pc=picOf(n);return`<span class="pav ${cls||""}" style="--h:hsl(${hueOf(n)} 55% 50%)">${pc?`<img src="${pc}" alt="">`:esc((n[0]||"?").toUpperCase())}</span>`}
function openProfile(n){profName=n;showView("p")}
const MONTHS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const picOf=n=>{const P=S.profiles[n]||{};if(P.avc)return avPicURL(P.avc);return P.pic||PICS[n.toLowerCase()]||null};
function nextBirthday(bd){
  if(!bd||!bd.d||!bd.m)return null;
  const t=new Date();t.setHours(0,0,0,0);
  const mk=y=>{const dt=new Date(y,bd.m-1,bd.d);return dt.getMonth()===bd.m-1&&dt.getDate()===bd.d?dt:null};
  let y=t.getFullYear(),dt=mk(y);if(!dt)return null;
  if(dt<t){y++;dt=mk(y)}
  return{days:Math.round((dt-t)/864e5),date:dt,age:bd.y?y-bd.y:null};
}
const relNames=()=>[...S.friends,...S.family.filter(n=>!S.friends.includes(n))];
const isFam=n=>S.family.includes(n);
function hueOf(n){let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))%360;return h}

const TYPES=["Geek","Cinéphile","Musique","Sportif","Artiste","Voyageur","Gourmand","Fêtard","Intello","Nature"];

/* ===== Fiche personne : un lien précis, un statut déduit, tout est sur la fiche ===== */
function rkBust(o){
  const T=["................",".....oooooo.....","....oHHHHHHo....","...oHHHHHHHHo...","...oHHppppHHo...","...oHppppppHo...","...oppoppoppo...","...oppppppppo...","....oppmmppo....",".....oppppo.....","...oooSSSSooo...","..oSSSSSSSSSSo..",".oSSSSSSSSSSSSo.",".oSttSSSSSSttSo.",".oooooooooooooo.","................"];
  let g=T.map(r=>[...r]);
  if(o.long)for(let y=5;y<=9;y++){g[y][2]="o";g[y][3]="H";g[y][12]="H";g[y][13]="o"}
  if(o.beard){for(let x=4;x<=11;x++){if(g[8][x]==="p")g[8][x]="H";if(g[9][x]==="p")g[9][x]="H"}[4,5,10,11].forEach(x=>{if(g[7][x]==="p")g[7][x]="H"})}
  if(o.stache)for(let x=6;x<=9;x++)if(g[7][x]==="p")g[7][x]="H";
  if(o.cap){for(let x=3;x<=12;x++){if(g[2][x]==="H")g[2][x]="r";if(g[3][x]==="H")g[3][x]="r"}[4,5,10,11].forEach(x=>{if(g[4][x]==="H")g[4][x]="r"});for(let x=6;x<=9;x++)g[4][x]="R"}
  if(o.glasses)for(let x=5;x<=10;x++)g[6][x]="o";
  if(o.bow){g[2][9]="r";g[2][10]="r"}
  if(o.kid){const n=Array.from({length:16},()=>Array(16).fill("."));for(let y=1;y<=9;y++)n[y+2]=g[y];n[11]=g[10];n[12]=g[11];n[13]=g[13];n[14]=g[14];n[1]=[...".......HH......."];n[2]=[...".....oooooo....."];g=n}
  return g.map(r=>r.join("").replace(/H/g,o.h).replace(/S/g,o.s).replace(/t/g,o.t));
}
Object.assign(RKI,{
  pere:rkBust({h:"N",s:"B",t:"d",beard:1}),
  mere:rkBust({h:"n",s:"m",t:"M",long:1}),
  frere:rkBust({h:"N",s:"g",t:"G",cap:1}),
  soeur:rkBust({h:"y",s:"v",t:"V",long:1,bow:1}),
  grand:rkBust({h:"k",s:"n",t:"N",glasses:1,stache:1}),
  enfant:rkBust({h:"N",s:"y",t:"Y",kid:1}),
  oncle:rkBust({h:"x",s:"r",t:"R",stache:1}),
  cousin:rkBust({h:"Y",s:"b",t:"B"})
});
const REL_FAM=[["pere","Père","pere"],["mere","Mère","mere"],["frere","Frère","frere"],["soeur","Sœur","soeur"],["grand","Grand-parent","grand"],["enfant","Enfant","enfant"],["oncle","Oncle · tante","oncle"],["cousin","Cousin·e","cousin"]];
const REL_FR=[["couple","En couple","coeur"],["bestie","Meilleur ami","medaille"],["ami","Ami·e","duo"],["collegue","Collègue","dossier"]];
function relOf(n){const P=S.profiles[n]||{},L=isFam(n)?REL_FAM:REL_FR;
  if(P.rel&&L.some(r=>r[0]===P.rel))return P.rel;
  if(isFam(n)){if(/^(papa|p[èe]re|daron|dad)$/i.test(n))return"pere";if(/^(maman|m[èe]re|daronne|mom)$/i.test(n))return"mere";return null}
  return P.love?"couple":P.best?"bestie":"ami"}
function relInfo(n){const k=relOf(n),r=(isFam(n)?REL_FAM:REL_FR).find(x=>x[0]===k);return r?{k,l:r[1],ic:r[2]}:{k:null,l:"Famille",ic:"famille"}}
function setRel(n,k){const P=S.profiles[n]||(S.profiles[n]={});
  if(k)P.rel=k;else delete P.rel;
  if(k==="couple"){Object.keys(S.profiles).forEach(m=>{const Q=S.profiles[m];if(m!==n&&Q&&Q.love){delete Q.love;if(Q.rel==="couple")delete Q.rel}});P.love=true}
  else delete P.love;
  if(k==="bestie")P.best=true;else delete P.best;
  const s=S.g&&S.g.sit;if(s&&typeof window.homeOf==="function"){s.home=window.homeOf(s)}
  save();try{renderFiche()}catch(e){}}
function statusOf(n){const s=(S.g&&S.g.sit)||{},W=Array.isArray(s.with)?s.with:[];if(!W.includes(n))return null;
  return isFam(n)||relOf(n)==="couple"?{k:"foyer",l:"Au foyer",ic:"maisonp"}:{k:"coloc",l:"Coloc",ic:"canape"}}
function setWith(n,on){const G=S.g;if(!G.sit||typeof G.sit!=="object")G.sit={goals:[],pass:[]};const s=G.sit;if(!Array.isArray(s.with))s.with=[];
  const i=s.with.indexOf(n);if(on&&i<0)s.with.push(n);if(!on&&i>=0)s.with.splice(i,1);
  if(typeof window.homeOf==="function")s.home=window.homeOf(s);s.t=Date.now();if(G.fq)G.fq.d="";save();try{renderFiche()}catch(e){}}
/* tags de personnalité : pictos + déduction depuis ce qu'on fait ensemble */
const TGI=[[/geek|jeu|gamer/i,"manette"],[/cin[ée]/i,"clap"],[/musi|chant|^sons?$/i,"micro"],[/sport/i,"halteres"],[/artiste|^art$|dessin|peint/i,"pinceau"],[/voyag/i,"valise"],[/gourm/i,"repas"],[/cuisin/i,"casserole"],[/f[êe]tard/i,"cocktail"],[/intello|lect/i,"lire"],[/[ée]cri/i,"notec"],[/code/i,"laptop"],[/nature/i,"plante"],[/danse/i,"pas"],[/humour/i,"bulle"],[/photo/i,"photo"],[/brico/i,"ciseaux"]];
const tgIc=t=>(TGI.find(([r])=>r.test(t))||[0,"etoile"])[1];
const TAGX=[["Geek",/jeux? ?vid|vid[ée]o ?game|manette|console|gaming|jouer (à|en ligne)|\bLAN\b|donjons/i],["Cinéphile",/\bfilm|cin[ée]ma|\bs[ée]rie|netflix|s[ée]ance/i],["Musique",/concert|musique|karaok|festival|\bjam\b/i],["Sportif",/sport|courir|footing|v[ée]lo|salle de|muscu|\bfoot\b|basket|tennis|nager|piscine|escalade|yoga/i],["Gourmand",/resto|brunch|cuisin|pizza|sushi|g[âa]teau/i],["Fêtard",/soir[ée]e|\bf[êe]te\b|\bbar\b|\bverre\b|\bclub\b|danser/i],["Artiste",/expo|mus[ée]e|dessin|peind|peinture|th[ée][âa]tre|atelier/i],["Voyageur",/voyage|week-?end|road ?trip|visiter/i],["Intello",/\blivre|lecture|d[ée]bat|conf[ée]rence|biblioth|\b[ée]checs/i],["Nature",/balade|randonn|jardin|pique-?nique|for[êe]t|plage|camping/i]];
function tagSug(n){const P=S.profiles[n]||{},have=[...(P.types||[]),...(P.talents||[])],no=P.nope||[],t0=Date.now()-150*864e5,cnt={};
  const rx=new RegExp("\\b"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b");
  (S.log||[]).forEach(e=>{if(!e||e.t<t0||(e.xp||0)<0)return;const nm=e.name||"";if(!((e.withp||[]).includes(n)||(e.fgw||[]).includes(n)||rx.test(nm)))return;TAGX.forEach(([tag,re])=>{if(re.test(nm))cnt[tag]=(cnt[tag]||0)+1})});
  return Object.entries(cnt).filter(([t,c])=>c>=3&&!have.includes(t)&&!no.includes(t)).sort((a,b)=>b[1]-a[1]).map(([t,c])=>({t,c}))[0]||null}
function whoScore(t,n){const P=S.profiles[n]||{},tags=[...(P.types||[]),...(P.talents||[])];let s=0;
  TAGX.forEach(([tag,re])=>{if(re.test(t)&&tags.includes(tag))s+=3});
  if(/famille|parents|\bmaman\b|\bpapa\b/i.test(t)&&isFam(n))s+=2;
  if(/coloc/i.test(t)&&statusOf(n))s+=2;
  if(/à deux|couple|romantique/i.test(t)&&relOf(n)==="couple")s+=3;
  if(/coll[èe]gue|boulot|travail/i.test(t)&&relOf(n)==="collegue")s+=3;
  if(/\bmeilleur/i.test(t)&&relOf(n)==="bestie")s+=3;
  return s}
function whoRank(t,L){return L.map((n,i)=>({n,i,s:whoScore(t,n)})).sort((a,b)=>b.s-a.s||a.i-b.i).map(o=>o.n)}

// renderProfile : finitions autour de renderProfileBase (le cœur), ex-retouche de correctifs.js
function renderProfile(){try{homeFix()}catch(e){console.warn("renderProfile",e)}const r=renderProfileBase.apply(this,arguments);try{profViz();profRemind();proFrame()}catch(e){console.warn("renderProfile",e)}return r}
function renderProfileBase(force){
  const root=$("prof");
  if(!force&&root.contains(document.activeElement)&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  const n=profName;if(!n){root.innerHTML="";return}
  if(n.startsWith("@g:")){renderGroupPage(n.slice(3));return}
  const P=S.profiles[n]||(S.profiles[n]={});
  const bi=bondInfo(S.bonds[n]||0),last=S.bondsLast[n],now=Date.now();
  const days=last?Math.floor((now-last)/864e5):null;
  const when=last==null?"Pas encore de nouvelles":days<1?"Nouvelles aujourd'hui":days===1?"Dernières nouvelles hier":`Dernières nouvelles il y a ${days} j`;
  const fam=isFam(n),RL=fam?REL_FAM:REL_FR,rk=relOf(n),ri=relInfo(n),st=statusOf(n);
  root.style.setProperty("--h",`hsl(${hueOf(n)} 55% 50%)`);
  root.innerHTML=`<button type="button" class="btn back" id="pBack">${ICO("back",14)} Proches</button>
  <div class="char pf fpf${P.bg&&FP_BG.includes(P.bg)?" aura-on au-"+P.bg:""}" id="pCardF">
    <div class="pf-head"><div class="pf-name"><h2 id="pName" class="fp-name"></h2><span class="ctitle">${bondTitle(bi.l)}</span><span class="fp-badges"><span class="rk" title="Lien"><i>${rkSvg(ri.ic)}</i>${esc(ri.l)}</span>${st?`<span class="rk st" title="Statut"><i>${rkSvg(st.ic)}</i>${st.l}</span>`:""}</span></div>
      <div class="fp-btns"><button type="button" class="me-set" id="pBgBtn" aria-label="Changer le fond" aria-expanded="false" title="Fond"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.3-1.7-.4-1 .2-2.3 1.4-2.3H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10.5" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/></svg></button></div></div>
    <div class="fp-bgpick" id="pBgPick" hidden></div>
    <div class="pf-body fp-body"><div class="pf-side"><div class="p-pic" id="pPic"></div>${P.pic?`<button type="button" class="lnk" id="pPicDel">Retirer la photo</button>`:""}</div></div>
    <div class="pf-xp fp-xp"><div class="lvl" style="${lvlStyle(bi.l,"LIEN")}"><small>Lien</small><b>${bi.l}</b></div><div class="bar" title="${when}"><i style="width:${bi.cur/bi.need*100}%"></i><span class="bt"><em>${bi.cur} / ${bi.need} XP</em></span></div></div>
    <div class="fp-bd" id="pBdBox"></div>
    <div class="pf2bded" id="pBdEd" hidden></div>
    <small class="fp-when">${when}</small>
  </div>
  <div class="ract" id="pActs"></div>
  <section class="set-card pf2" id="pLien"><h3>Lien</h3>
    <div class="fjobs fpris" id="pRel">${RL.map(([k,l,ic])=>`<button type="button" data-rel="${k}" aria-pressed="${rk===k}"><span class="fti">${rkSvg(ic)}</span><span>${esc(l)}</span></button>`).join("")}</div>
    <button type="button" class="pf2tog" id="pHome" aria-pressed="${!!st}"><span class="fti">${rkSvg(st?st.ic:"maisonp")}</span><span class="pf2t"><b>Vit avec moi</b><small>${st?"Statut : "+st.l:fam?"Ajouter à mon foyer":"Ajouter à mon foyer : statut coloc"}</small></span><i class="pf2sw" aria-hidden="true"></i></button></section>
  <section class="set-card pf2" id="pTags"><h3>Ses univers</h3><div class="pf2sug" id="pSug" hidden></div><div class="tagrow" id="tgTypes"></div>
    <h3>Ses talents</h3><div class="tagrow" id="tgTal"></div>
    <form class="tagadd" id="tgForm"><input id="tgNew" maxlength="20" placeholder="Autre talent…" aria-label="Autre talent"><button class="btn" type="submit">Ajouter</button></form></section>
  <section class="set-card pf2" id="pGroups"><h3>Groupes</h3><div class="tagrow" id="pGrp"></div>
    <form class="tagadd" id="pGrpForm"><input id="pGrpNew" maxlength="24" placeholder="Nouveau groupe…" aria-label="Nouveau groupe"><button class="btn" type="submit">Créer</button></form></section>
  <label class="pf2gift"><span class="fti">${rkSvg("cadeau")}</span><span class="pf2t"><b>Idée cadeau</b><input id="pGift" maxlength="120" placeholder="ex. un livre de photo" aria-label="Idée cadeau"></span></label>
  <div class="set-card" id="pHistCard" hidden><h3>Historique</h3><ul class="hist" id="pHist"></ul></div>
  <div class="pf2del" id="delCard"><button type="button" class="lnk delf" id="delBtn">${fam?"Retirer de mes proches":"Supprimer l'ami"}</button>
    <div id="delAsk" hidden style="display:none"><p>Supprimer ${fam?"ce proche":"cet ami"} ? Son XP et sa fiche seront perdus.</p>
    <div class="delrow"><button type="button" class="btn" id="delNo">Annuler</button><button type="button" class="danger" id="delYes">Oui, supprimer</button></div></div></div>`;
  $("pName").textContent=n;
  try{fpExtras(n,P)}catch(e){xpErr(e)} // tôt : le bouton Fond marche même si une partie plus bas plante
  $("pGift").value=P.gifts||"";$("pGift").onchange=()=>{const v=$("pGift").value.trim();if(v)P.gifts=v;else delete P.gifts;save()};
  {const items=S.log.filter(e=>e.who===n&&(e.rel||e.fr)).slice(-8).reverse(),ul=$("pHist");$("pHistCard").hidden=!items.length;
   items.forEach(e=>{const d=new Date(e.t),li=document.createElement("li"),t=document.createElement("time"),nm=document.createElement("span"),x=document.createElement("span");t.textContent=d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});nm.textContent=e.name;x.className="x";x.textContent="+"+e.xp;li.append(t,nm,x);ul.appendChild(li)})}
  $("delBtn").onclick=()=>{$("delBtn").style.display="none";$("delAsk").hidden=false;$("delAsk").style.display="block"};
  $("delNo").onclick=()=>{$("delAsk").hidden=true;$("delAsk").style.display="none";$("delBtn").style.display=""};
  $("delYes").onclick=()=>removeFriend(n);
  if(fam&&!S.friends.includes(n))$("delCard").hidden=true;
  const pic=picOf(n),pp=$("pPic");
  if(pic){const im=document.createElement("img");im.src=pic;im.alt="";pp.appendChild(im)}else pp.textContent=n[0].toUpperCase();
  $("pBack").onclick=()=>showView("r");
  pp.classList.add("editable");pp.classList.toggle("px",!!P.avc);pp.tabIndex=0;pp.setAttribute("role","button");pp.setAttribute("aria-label","Créer l'avatar de "+n);pp.onclick=()=>openAvc(n);pp.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openAvc(n)}};
  const pd=$("pPicDel");if(pd)pd.onclick=()=>{delete P.pic;delete P.avc;save();renderProfile(true);renderRelations()};
  REL_ACTIONS.forEach(A=>{const b=document.createElement("button");b.type="button";b.className="btn primary";b.innerHTML=`<span>${A.label}</span><b>+${A.xp} XP</b>`;b.onclick=ev=>bondAction(n,A,b,ev);$("pActs").appendChild(b)});
  // lien + foyer
  $("pRel").querySelectorAll("[data-rel]").forEach(b=>b.onclick=()=>{const k=b.dataset.rel;setRel(n,fam||relOf(n)!==k?k:null);renderProfile(true);renderRelations()});
  $("pHome").onclick=()=>{setWith(n,!statusOf(n));renderProfile(true);renderRelations()};
  // univers & talents
  const drawTags=()=>{
    const mk=(box,list,key,cls)=>{box.innerHTML="";const sel=P[key]||[];
      list.concat(sel.filter(x=>!list.includes(x))).forEach(x=>{const b=document.createElement("button");b.type="button";b.className="tg "+cls;b.setAttribute("aria-pressed",sel.includes(x));
        b.innerHTML=`<span class="tgi">${rkSvg(tgIc(x))}</span>`;b.append(x);
        b.onclick=()=>{const a=P[key]||[],i=a.indexOf(x);if(i>=0)a.splice(i,1);else a.push(x);if(a.length)P[key]=a;else delete P[key];save();drawTags();renderRelations()};box.appendChild(b)})};
    mk($("tgTypes"),TYPES,"types","typ");mk($("tgTal"),TALENTS_UI,"talents","tal");
    const sg=tagSug(n),sb=$("pSug");sb.hidden=!sg;
    if(sg){sb.innerHTML=`<span class="fti">${rkSvg(tgIc(sg.t))}</span><span class="pf2t"><b></b><small>${sg.c} fois ensemble ces derniers mois</small></span><button type="button" class="pf2y" aria-label="Ajouter ce profil">${rkSvg("check")}</button><button type="button" class="pf2n" aria-label="Ignorer">${ICO("close",14)}</button>`;
      sb.querySelector("b").textContent=sg.t+" ?";
      sb.querySelector(".pf2y").onclick=()=>{(P.types||(P.types=[])).push(sg.t);save();drawTags();renderRelations()};
      sb.querySelector(".pf2n").onclick=()=>{(P.nope||(P.nope=[])).push(sg.t);save();drawTags()}}};
  drawTags();
  $("tgForm").onsubmit=e=>{e.preventDefault();const v=$("tgNew").value.trim().slice(0,20);if(!v)return;const a=P.talents||(P.talents=[]);if(!a.includes(v))a.push(v);$("tgNew").value="";save();drawTags()};
  // groupes
  {const box=$("pGrp");const draw=()=>{const L=fgList();box.innerHTML=L.length?"":`<p class="hint vide">Aucun groupe pour l'instant.</p>`;
     L.forEach(g=>{const b=document.createElement("button");b.type="button";b.className="tg grp";b.style.setProperty("--gc",fgCol(g));b.setAttribute("aria-pressed",(P.grp||[]).includes(g.id));b.innerHTML=`<span class="tgi">${rkSvg("duo")}</span>`;b.append(g.n);
       b.onclick=()=>{const a=P.grp||(P.grp=[]),i=a.indexOf(g.id);if(i>=0)a.splice(i,1);else a.push(g.id);save();draw();renderRelations()};box.appendChild(b)})};
   draw();$("pGrpForm").onsubmit=e=>{e.preventDefault();const v=$("pGrpNew").value.trim();if(!v)return;const g=fgAdd(v);g.c=FG_COL[(fgList().length-1)%FG_COL.length];(P.grp||(P.grp=[])).push(g.id);$("pGrpNew").value="";save();draw();renderRelations()}}
  try{fpExtras(n,P)}catch(e){xpErr(e)}
}
const TALENTS_UI=["Dessin","Écriture","Code","Cuisine","Photo","Chant","Humour","Bricolage","Danse"];
const FP_BG=["flames","stars","notes","neon","goldaura","lotus","hello"];
const BD_ICON=`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" fill="currentColor"/><path d="M4 16c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0" fill="none" stroke="var(--surface)" stroke-width="1.6"/><path d="M12 12V8" stroke="currentColor" stroke-width="2"/><path d="M12 3c1.2 1.4 1.2 2.6 0 3.6-1.2-1-1.2-2.2 0-3.6z" fill="currentColor"/></svg>`;
function fpExtras(n,P){
  const box=$("pBdBox"),ed=$("pBdEd");
  const view=()=>{ed.hidden=true;box.hidden=false;const nb=nextBirthday(P.bd);
    if(nb){const d=P.bd;box.className="fp-bd"+(nb.days===0?" now":"");box.innerHTML=`<span class="fpbi">${BD_ICON}</span><span class="fpbt"><b>${d.d} ${MONTHS[d.m-1]}${d.y?" "+d.y:""}</b><small>${nb.days===0?"C'est aujourd'hui !":nb.days===1?"Demain":"Dans "+nb.days+" jours"}${nb.age?" · "+nb.age+" ans":""}</small></span><button type="button" class="btn" id="pBdGo">Modifier</button>`}
    else{box.className="fp-bd none";box.innerHTML=`<span class="fpbi">${BD_ICON}</span><span class="fpbt"><b>Anniversaire</b><small>Pas encore de date</small></span><button type="button" class="btn" id="pBdGo">Ajouter</button>`}
    $("pBdGo").onclick=edit};
  const edit=()=>{box.hidden=true;ed.hidden=false;const b=P.bd||{};
    ed.innerHTML=`<label>Jour<input id="bdD" type="text" maxlength="2" inputmode="numeric" autocomplete="off" placeholder="12" value="${b.d||""}"></label><label>Mois<select id="bdM"><option value="">—</option>${MONTHS.map((m,i)=>`<option value="${i+1}"${b.m===i+1?" selected":""}>${m}</option>`).join("")}</select></label><label>Année<input id="bdY" type="text" maxlength="4" inputmode="numeric" autocomplete="off" placeholder="1996" value="${b.y||""}"></label><button type="button" class="btn primary" id="bdOk">OK</button>`;
    $("bdOk").onclick=()=>{const d=parseInt($("bdD").value,10),m=parseInt($("bdM").value,10),y=parseInt($("bdY").value,10),o={};
      if(d>=1&&d<=31)o.d=d;if(m>=1&&m<=12)o.m=m;if(y>=1900&&y<=2100)o.y=y;
      if(o.d&&o.m)P.bd=o;else if(!Object.keys(o).length)delete P.bd;else{toast("Il faut au moins le jour et le mois");return}
      save();view();renderRelations()};
    $("bdD").focus()};
  view();
  const pk=$("pBgPick"),bb=$("pBgBtn");if(!pk||!bb)return;
  const draw=()=>{const cur=P.bg&&FP_BG.includes(P.bg)?P.bg:"";
    pk.innerHTML=`<div class="augrid"><button type="button" class="aut none" data-id="" aria-pressed="${!cur}"><span class="aui"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M6.5 17.5l11-11" stroke="currentColor" stroke-width="2.4"/></svg></span><b>Aucun</b></button>${FP_BG.map(id=>{const u=AUI[id],g=GEAR.find(x=>x.id===id);return`<button type="button" class="aut" style="--a1:${u[0]};--a2:${u[1]}" data-id="${id}" aria-pressed="${cur===id}"><span class="aui">${auraPix(id,40)}</span><b>${esc(g?g.n:id)}</b></button>`}).join("")}</div>`;
    pk.querySelectorAll(".aut").forEach(b=>b.onclick=()=>{const id=b.dataset.id;if(id)P.bg=id;else delete P.bg;save();
      const card=$("pCardF");[...card.classList].forEach(c=>{if(c.startsWith("au-")||c==="aura-on")card.classList.remove(c)});if(id)card.classList.add("aura-on","au-"+id);draw()})};
  bb.onclick=()=>{pk.hidden=!pk.hidden;bb.setAttribute("aria-expanded",!pk.hidden);if(!pk.hidden)draw()};
}

function bondAction(n,A,el,ev){
  const q=A.k==="news"?S.specials.find(x=>x.grp==="friends"&&x.who===n):null;
  if(q){completeSpecial(q,el,ev);render();renderProfile(true);return}
  const pl=bondInfo(S.bonds[n]||0).l;
  S.bonds[n]=(S.bonds[n]||0)+A.xp;S.bondsLast[n]=Date.now();
  const nl=bondInfo(S.bonds[n]).l;
  complete({id:"rel-"+A.k+"-"+n,name:A.verb(n),cat:"social",xp:A.xp},el,ev,false,{rel:1,who:n});
  toast(`${esc(A.verb(n))} <span class="p">+${A.xp} XP</span>${nl>pl?` · ${esc(n)} niveau <span class="p">${nl}</span>`:""}`);
  render();renderProfile(true);
}
// Ajouter un proche (famille ou ami) : fenêtre plein écran (règle : champ texte = plein écran), Annuler à gauche, Ajouter à droite
function addPerson(fam){if(document.querySelector(".addfw"))return;
  const w=document.createElement("form");w.className="ui-plein addfw";w.setAttribute("role","dialog");w.setAttribute("aria-label",fam?"Nouveau membre de la famille":"Nouvel ami");
  w.innerHTML=`<div class="ui-plein__haut"><h2 class="ui-plein__titre">${fam?"Famille":"Nouvel ami"}</h2></div>
    <div class="ui-plein__corps"><input class="ui-champ" id="addFName" maxlength="30" placeholder="${fam?"Prénom ou surnom (Maman, Léa…)":"Prénom de l'ami"}" aria-label="Prénom" autocomplete="off"></div>
    <div class="ui-plein__bas"><button type="button" class="ui-btn addfno">Annuler</button><button type="submit" class="ui-btn ui-btn--principal">Ajouter</button></div>`;
  const close=()=>w.remove();w.querySelector(".addfno").onclick=close;
  w.onsubmit=e=>{e.preventDefault();const n=$("addFName").value.trim();if(!n)return;
    if([...S.friends,...S.family].some(x=>x.toLowerCase()===n.toLowerCase())){toast(`<span class="p">${esc(n)}</span> est déjà dans tes proches`);return}
    (fam?S.family:S.friends).push(n);close();ensureGroupQuests();save();render();toast(`<span class="p">${esc(n)}</span> ajouté`)};
  document.body.appendChild(w);$("addFName").focus()}
function removeFriend(n){
  S.friends=S.friends.filter(x=>x!==n);S.friendDone=S.friendDone.filter(x=>x!==n);
  delete S.bonds[n];delete S.bondsLast[n];delete S.profiles[n];if(S.g&&S.g.sit&&Array.isArray(S.g.sit.with))S.g.sit.with=S.g.sit.with.filter(x=>x!==n);
  S.specials=S.specials.filter(q=>!(q.grp==="friends"&&q.who===n));ensureGroupQuests();
  profName=null;save();showView("r");render();toast("Ami supprimé")}
function renderRemind(){
  const box=$("relRemind");box.innerHTML="";
  const bds=relNames().map(n=>({n,nb:nextBirthday((S.profiles[n]||{}).bd)})).filter(x=>x.nb&&x.nb.days<=30).sort((a,b)=>a.nb.days-b.nb.days);
  const st=staleFriends(3);
  const mkCard=(cls,title)=>{const c=document.createElement("div");c.className="rem "+cls;const h=document.createElement("h3");h.textContent=title;c.appendChild(h);box.appendChild(c);return c};
  const row=(c,n,txt,strong)=>{const b=document.createElement("button");b.type="button";const a=document.createElement("span"),t=document.createElement("span");a.textContent=n;t.textContent=txt;if(strong)t.className="urg";const ic=document.createElement("span");ic.className="ini";ic.style.setProperty("--h",`hsl(${hueOf(n)} 55% 50%)`);const pc=picOf(n);
    if(pc){const im=document.createElement("img");im.src=pc;im.alt="";ic.appendChild(im);ic.classList.add("pic")}else ic.textContent=n[0].toUpperCase();
    a.style.marginRight="auto";b.append(ic,a,t);b.style.alignItems="center";b.onclick=()=>openProfile(n);c.appendChild(b)};
  if(false){
    const c=mkCard("bdc","Anniversaires à venir");
    bds.forEach(x=>{
      const n=x.n,d=x.nb.days,g=(S.profiles[n]||{}).gifts;
      const b=document.createElement("button");b.type="button";b.className="bdr";
      const ic=document.createElement("span");ic.className="ini";ic.style.setProperty("--h",`hsl(${hueOf(n)} 55% 50%)`);const pc=picOf(n);
      if(pc){const im=document.createElement("img");im.src=pc;im.alt="";ic.appendChild(im);ic.classList.add("pic")}else ic.textContent=n[0].toUpperCase();
      const tx=document.createElement("span");tx.className="bdt";
      const nm=document.createElement("b");nm.textContent=n.toUpperCase();
      const wh=document.createElement("span");wh.className="bdw"+(d<=3?" urg":"");wh.textContent="anniversaire "+(d===0?"aujourd'hui !":d===1?"demain":`dans ${d}J`);
      const gf=document.createElement("span");gf.className="bdg";gf.textContent="idée de cadeau : "+(g||"aucune");
      tx.append(nm,wh,gf);b.append(ic,tx);b.onclick=()=>openProfile(n);c.appendChild(b)})}
  // ---- ami du mois / membre du mois
  const now=new Date(),m0=new Date(now.getFullYear(),now.getMonth(),1).getTime(),mx={};
  S.log.forEach(e=>{if(e.t>=m0&&e.who&&(e.fr||e.rel)&&e.xp>0)mx[e.who]=(mx[e.who]||0)+e.xp});
  const best=list=>list.filter(n=>mx[n]).sort((a,b)=>mx[b]-mx[a]||(S.bonds[b]||0)-(S.bonds[a]||0))[0];
  const fr=best(S.friends.filter(n=>!S.family.includes(n))),fa=best(S.family.slice());
  const MO=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][now.getMonth()];
  const spot=document.createElement("div");spot.className="motm";
  const card=(n,lab,col,ph)=>{const c=document.createElement(n?"button":"div");if(n)c.type="button";c.className="motc"+(n?"":" empty");c.style.setProperty("--mc",col);
    let av;if(n){const pc=picOf(n);av=pc?`<img src="${pc}" alt="">`:`<span class="motini" style="--h:hsl(${hueOf(n)} 55% 50%)">${esc(n[0].toUpperCase())}</span>`}else av=`<span class="motini q">?</span>`;
    const bi=n?bondInfo(S.bonds[n]||0):null;
    c.innerHTML=`<span class="motk">${lab}</span><span class="motav">${av}<i class="motcr" aria-hidden="true"></i></span><b class="motn"></b><small class="mots">${n?`+${mx[n]} XP de lien en ${MO}`:ph}</small>${bi?`<span class="motl">Lien niv. ${bi.l}</span>`:""}`;
    c.querySelector(".motn").textContent=n||"À élire";if(n)c.onclick=()=>openProfile(n);spot.appendChild(c)};
  card(fr,"Ami du mois","var(--c-social)","Prends des nouvelles d'un ami pour l'élire");
  card(fa,"Membre du mois","var(--c-famille)","Appelle un proche pour l'élire");
  box.appendChild(spot);
}
let relShut=[];
const FG_COL=["#ff7aa8","#e0447a","#f08a2a","#f2c94c","#5fae4f","#4fb3b3","#2a8fd6","#9b5de5"];
const FG_ACT=[{k:"news",label:"Prendre des nouvelles",verb:n=>"Prendre des nouvelles du groupe "+n,xp:10},{k:"call",label:"Appel de groupe",verb:n=>"Appel avec le groupe "+n,xp:20},{k:"meet",label:"Les voir",verb:n=>"Voir le groupe "+n,xp:40}];
const fgCol=g=>g.c||FG_COL[0];
function openGroup(id,edit){profName="@g:"+id;showView("p");if(edit)setTimeout(()=>{const i=$("gName");if(i){i.focus();i.select()}},150)}
function fgAct(g,A,el){const M=fgMembers(g.id);if(!M.length){toast("Ajoute d'abord des membres au groupe");return}
  const o=document.createElement("div");o.className="bpop fgpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.style.setProperty("--gc",fgCol(g));document.body.appendChild(o);const here=new Set(M);
  const close=()=>o.remove();o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const per=Math.max(2,Math.round(A.xp/2));o.innerHTML=`<div class="bpc fgc"><h3>Qui était là ?</h3><div class="fgl">${M.map(n=>`<button type="button" class="fgm${here.has(n)?" on":""}" data-n="${esc(n)}">${pAv(n)}<span>${esc(n)}</span></button>`).join("")}</div><p class="fgx">+${A.xp} XP pour toi · +${per} de lien pour chacun des ${here.size} présent${here.size>1?"s":""}</p><button type="button" class="btn primary" id="fgGo" ${here.size?"":"disabled"}>Valider</button><button type="button" class="lnk" id="fgNo">Annuler</button></div>`;
    o.querySelectorAll(".fgm").forEach(b=>b.onclick=()=>{const n=b.dataset.n;if(here.has(n))here.delete(n);else here.add(n);draw()});
    o.querySelector("#fgNo").onclick=close;
    o.querySelector("#fgGo").onclick=ev=>{const G=S.g,per=Math.max(2,Math.round(A.xp/2)),now=Date.now();here.forEach(n=>{S.bonds[n]=(S.bonds[n]||0)+per;S.bondsLast[n]=now});if(!G.fgLast)G.fgLast={};G.fgLast[g.id]=now;
      const q=S.specials.find(x=>x.fg===g.id);if(q&&A.k!=="news"){}close();
      complete({id:"fg-"+A.k+"-"+g.id,name:A.verb(g.n)+(here.size<M.length?" ("+[...here].join(", ")+")":""),cat:"social",xp:A.xp},el,ev,false,{fgid:g.id,fgw:[...here]});
      toast(`${esc(A.verb(g.n))} <span class="p">+${A.xp} XP</span> · +${per} de lien pour ${here.size} ami${here.size>1?"s":""}`);render();renderProfile(true)}};
  draw()}
// photo de classe : les têtes de profil côte à côte, rangées de 4
const __ghC={};
function grpHead(avc){const k=JSON.stringify(avc);if(!__ghC[k]){const H=chHead({...AV_DEF,...avc}),cv=document.createElement("canvas");cv.width=H.W*4;cv.height=H.H*4;const g=cv.getContext("2d");for(let y=0;y<H.H;y++)for(let x=0;x<H.W;x++){const v=H.px[y*H.W+x];if(v){g.fillStyle=v;g.fillRect(x*4,y*4,4,4)}}__ghC[k]=cv.toDataURL("image/png")}return __ghC[k]}
function grpHeadHTML(n){const P=S.profiles[n]||{};return P.avc?`<img class="cphead" alt="" src="${grpHead(P.avc)}">`:pAv(n)}
function grpRows(items){const R=[];for(let i=0;i<items.length;i+=4)R.push(items.slice(i,i+4));return R.map(r=>`<div class="cprow">${r.join("")}</div>`).join("")}
const GRP_ICO={news:"bulle",call:"tel",meet:"duo"};
function renderGroupPage(id){const root=$("prof"),g=fgList().find(x=>x.id===id);if(!g){profName=null;showView("r");return}
  const M=fgMembers(id),G=S.g,last=(G.fgLast||{})[id],d=last?Math.floor((Date.now()-last)/864e5):null,hist=S.log.filter(e=>e.fgid===id).slice(-8).reverse(),col=fgCol(g);
  root.style.setProperty("--h",col);
  const HI=[[/vu|voir|les voir/i,"duo"],[/appel/i,"tel"],[/nouvelles|message/i,"bulle"]];
  const grp=[];hist.forEach(e=>{const t=new Date(e.t).toLocaleDateString("fr-FR",{day:"numeric",month:"short"}).replace(/\.$/,""),k=t+"|"+e.name,l=grp[grp.length-1];if(l&&l.k===k){l.n++;l.x+=e.xp||0}else grp.push({k,t,nm:e.name,n:1,x:e.xp||0})});
  root.innerHTML=`<button type="button" class="btn back" id="pBack">${ICO("back",14)} Proches</button>
  <div class="grpcard" style="--gc:${col}"><div class="grph"><div><span class="grpk">Groupe</span><input class="grpn grpin2" id="gName" maxlength="24" aria-label="Nom du groupe"><small>${M.length} membre${M.length>1?"s":""} · ${d==null?"jamais vus ensemble":d<1?"contactés aujourd'hui":"contactés il y a "+d+" j"}</small></div></div>
    <div class="cphoto">${grpRows(M.map(n=>`<div class="grpmw"><button type="button" class="grpmb" data-n="${esc(n)}">${grpHeadHTML(n)}<span>${esc(n)}</span></button><button type="button" class="grpx" data-x="${esc(n)}" aria-label="Retirer ${esc(n)}">${ICO("close",12)}</button></div>`).concat([`<button type="button" class="grpadd" id="gAdd" aria-label="Ajouter des membres"><span class="pav">+</span><span>Ajouter</span></button>`]))}</div>
    <div class="grpcols" id="gCols">${FG_COL.map(c=>`<button type="button" class="grpc${c===col?" on":""}" data-c="${c}" style="--c:${c}" aria-label="Couleur"></button>`).join("")}</div></div>
  <div class="ract ractz" id="gActs"></div>
  ${grp.length?`<div class="set-card"><h3>Historique</h3><div class="histviz">${grp.slice(0,16).map(o=>`<div class="hvt" title="${esc(o.nm)}"><span class="hvi">${rkSvg((HI.find(([r])=>r.test(o.nm))||[0,"etoile"])[1])}</span>${o.n>1?`<em>×${o.n}</em>`:""}<small>${esc(o.t)}</small>${o.x?`<b>+${o.x}</b>`:""}</div>`).join("")}</div></div>`:""}
  <div class="pf2del"><button type="button" class="lnk delf" id="gDel">Supprimer le groupe</button></div>`;
  $("pBack").onclick=()=>{profName=null;showView("r")};
  const nm=$("gName");nm.value=g.n;nm.onchange=()=>{const v=nm.value.trim();if(v){g.n=v;save();renderRelations()}else nm.value=g.n};
  root.querySelectorAll(".grpmb").forEach(b=>b.onclick=()=>openProfile(b.dataset.n));
  root.querySelectorAll(".grpx").forEach(b=>b.onclick=()=>{const P=S.profiles[b.dataset.x];if(P&&P.grp)P.grp=P.grp.filter(x=>x!==id);save();renderGroupPage(id);renderRelations()});
  root.querySelectorAll(".grpc").forEach(b=>b.onclick=()=>{g.c=b.dataset.c;save();renderGroupPage(id);renderRelations()});
  $("gAdd").onclick=()=>{nm.dispatchEvent(new Event("change"));fgOpen(id,()=>renderGroupPage(id))};
  FG_ACT.forEach(A=>{const b=document.createElement("button");b.type="button";b.className="btn primary";b.innerHTML=`<span class="rai">${rkSvg(GRP_ICO[A.k])}</span><span>${A.label}</span><b>+${A.xp} XP</b>`;b.style.setProperty("--gc",col);b.onclick=ev=>fgAct(g,A,b,ev);$("gActs").appendChild(b)});
  $("gDel").onclick=()=>undoAfter("Groupe « "+g.n+" » supprimé",()=>{S.g.fgr=fgList().filter(x=>x.id!==id);relNames().forEach(n=>{const P=S.profiles[n];if(P&&P.grp)P.grp=P.grp.filter(x=>x!==id)});save();profName=null;showView("r");renderRelations()})}
function fgList(){const G=S.g;if(!G)return[];if(!Array.isArray(G.fgr))G.fgr=[];return G.fgr}
function fgAdd(n){const g={id:"g"+Date.now().toString(36),n:n.slice(0,24)};fgList().push(g);return g}
function fgMembers(id){return relNames().filter(n=>((S.profiles[n]||{}).grp||[]).includes(id))}
function fgOpen(id,after){const g=fgList().find(x=>x.id===id);if(!g)return;const o=document.createElement("div");o.className="bpop fgpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);const close=()=>{o.remove();renderRelations();if(after)after()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const M=fgMembers(id);o.innerHTML=`<div class="bpc fgc"><input class="fgname" maxlength="24" aria-label="Nom du groupe"><div class="fgl">${relNames().map(n=>`<button type="button" class="fgm${M.includes(n)?" on":""}" data-n="${esc(n)}">${pAv(n)}<span>${esc(n)}</span></button>`).join("")}</div><button type="button" class="btn primary" id="fgOk">Terminé</button><button type="button" class="lnk" id="fgDel">Supprimer le groupe</button></div>`;
    const nm=o.querySelector(".fgname");nm.value=g.n;nm.onchange=()=>{const v=nm.value.trim();if(v){g.n=v;save()}};
    o.querySelectorAll(".fgm").forEach(b=>b.onclick=()=>{const P=S.profiles[b.dataset.n]=S.profiles[b.dataset.n]||{},a=P.grp||(P.grp=[]),i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);save();draw()});
    o.querySelector("#fgOk").onclick=()=>{nm.dispatchEvent(new Event("change"));close()};
    o.querySelector("#fgDel").onclick=()=>undoAfter("Groupe « "+g.n+" » supprimé",()=>{S.g.fgr=fgList().filter(x=>x.id!==id);relNames().forEach(n=>{const P=S.profiles[n];if(P&&P.grp)P.grp=P.grp.filter(x=>x!==id)});save();close()})};
  draw()}
// renderFG : finitions autour de renderFGBase (le cœur), ex-retouche de correctifs.js
function renderFG(){const r=renderFGBase.apply(this,arguments);try{grpViz()}catch(e){console.warn("renderFG",e)}return r}
function renderFGBase(){const box=$("relGroups");if(!box||!S.g)return;const L=fgList(),G=S.g;
  box.innerHTML=`<div class="fgh"><b>Groupes</b><button type="button" class="addf fgplus" id="fgAddB" aria-label="Créer un groupe"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div><div class="fgcards">${L.map(g=>{const M=fgMembers(g.id),d=G.fgLast&&G.fgLast[g.id]?Math.floor((Date.now()-G.fgLast[g.id])/864e5):null;return`<button type="button" class="fgcard" data-g="${g.id}" style="--gc:${fgCol(g)}"><b></b><span class="fgav">${M.slice(0,5).map(n=>pAv(n,"fgsm")).join("")}${M.length>5?`<i>+${M.length-5}</i>`:""}</span><small>${M.length} membre${M.length>1?"s":""} · ${d==null?"jamais contacté":d<1?"aujourd'hui":"il y a "+d+" j"}</small></button>`}).join("")}</div>`;
  box.querySelectorAll(".fgcard").forEach(b=>{b.querySelector("b").textContent=L.find(g=>g.id===b.dataset.g).n;b.onclick=()=>openGroup(b.dataset.g)});
  $("fgAddB").onclick=()=>{const g=fgAdd("Nouveau groupe");g.c=FG_COL[(fgList().length-1)%FG_COL.length];save();renderFG();openGroup(g.id,true)}}
// renderRelations : finitions autour de renderRelationsBase (le cœur), ex-retouche de correctifs.js
function renderRelations(){const r=renderRelationsBase.apply(this,arguments);try{relViz()}catch(e){console.warn("renderRelations",e)}return r}
function renderRelationsBase(){
  renderRemind();renderFG();
  const ul=$("relList");ul.innerHTML="";
  const srt=a=>a.sort((x,y)=>{const lx=S.bondsLast[x],ly=S.bondsLast[y];if(lx==null&&ly==null)return x.localeCompare(y,"fr");if(lx==null)return 1;if(ly==null)return -1;return lx-ly});
  const fam=srt(S.family.slice()),fr=srt(S.friends.filter(n=>!S.family.includes(n))),names=[...fam,...fr];
  $("relSub").textContent="";
  const now=Date.now();
  let curGrp="";
  // Famille et Amis : en-tête de section comme Groupes (titre + bouton + pour ajouter), toujours ouverts
  const heads=[["Famille",fam,"famille",true,"Aucun membre de la famille pour l'instant."],["Amis",fr,"social",false,"Aucun ami pour l'instant."]];
  const rows=[];heads.forEach(([t,L,key,isF,vide])=>{rows.push({h:[t,L.length,key,isF,vide,!L.length]});L.forEach(n=>rows.push({n,key}))});
  rows.forEach(r=>{
    if(r.h){const [t,cnt,key,isF,vide,empty]=r.h;curGrp=key;const hd=document.createElement("li");hd.className="rgh";
      hd.innerHTML=`<div class="fgh" style="--fc:${CATS[key].c}"><b></b><button type="button" class="addf fgplus" aria-label="${isF?"Ajouter un membre de la famille":"Ajouter un ami"}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div>${empty?`<p class="vide"></p>`:""}`;
      hd.querySelector("b").textContent=t;if(empty)hd.querySelector(".vide").textContent=vide;
      hd.querySelector("button").onclick=()=>addPerson(isF);ul.appendChild(hd);return}
    const n=r.n;
    const xp=S.bonds[n]||0,bi=bondInfo(xp);
    let h=0;for(const ch of n)h=(h*31+ch.charCodeAt(0))%360;
    const last=S.bondsLast[n];const days=last?Math.floor((now-last)/864e5):null;
    const when=last==null?"Pas encore de nouvelles":days<1?"Nouvelles aujourd'hui":days===1?"Dernières nouvelles hier":`Dernières nouvelles il y a ${days} j`;
    const li=document.createElement("li");const fg=curGrp==="famille";li.className="rl "+(fg?"gfam":"gami");li.style.setProperty("--h",`hsl(${h} 55% 50%)`);
    li.innerHTML=`<span class="ini"></span><span class="rb"><span class="rn"><b></b></span><small class="rw"></small></span><span class="rx" title="${bi.cur} / ${bi.need} XP"><span class="rbar"><i style="width:${bi.cur/bi.need*100}%"></i></span><span class="rl-lv">Nv ${bi.l}</span></span>${days!=null&&days<1?"":`<button type="button" class="rvu" aria-label="Vu ${esc(n)} en vrai">Vu</button>`}`;if(!(days!=null&&days<1))li.classList.add("hasvu");
    {const vu=li.querySelector(".rvu");if(vu)vu.onclick=ev=>{ev.stopPropagation();bondAction(n,REL_ACTIONS.find(x=>x.k==="meet"),vu,ev)}}
    const ini=li.querySelector(".ini"),pic=picOf(n);
    if(pic){const im=document.createElement("img");im.src=pic;im.alt="";ini.appendChild(im);ini.classList.add("pic")}else ini.textContent=n[0].toUpperCase();
    {const ri=relInfo(n),st=statusOf(n),b=li.querySelector("b");b.textContent=n;b.insertAdjacentHTML("afterend",`<i class="rlk" title="${esc(ri.l)}">${rkSvg(ri.ic)}</i>${st?`<em class="rst">${st.l}</em>`:""}`)}li.querySelector(".rw").textContent=last==null?"Jamais":days<1?"Nouvelles aujourd'hui":days===1?"Hier":`Il y a ${days} j`;if(days!=null&&days<1)li.classList.add("fresh");
    li.tabIndex=0;li.setAttribute("role","link");li.setAttribute("aria-label","Ouvrir le profil de "+n);
    li.onclick=()=>openProfile(n);li.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openProfile(n)}};
    ul.appendChild(li);
  });
}
function renderActList(){
  const ul=$("actList");ul.innerHTML="";
  if(!S.actions.length){ul.innerHTML=`<li class="empty" style="padding:0">Aucune bonne action. Ajoute-en une ci-dessous.</li>`;return}
  S.actions.forEach(a=>{
    const c=CATS[a.cat],li=document.createElement("li");li.style.setProperty("--cat",c?c.c:"var(--accent)");
    li.innerHTML=`<span class="an"></span><span class="ac">${c?c.label:""}</span><span class="ax">+${a.xp}</span><button type="button" aria-label="Supprimer cette action">${ICO("close",14)}</button>`;
    li.querySelector(".an").textContent=a.name;li.querySelector(".an").setAttribute("role","button");li.querySelector(".an").tabIndex=0;li.querySelector(".an").title="Modifier";li.querySelector(".an").onclick=()=>qcOpen("act",{edit:a});
    li.querySelector("button").onclick=()=>{S.actions=S.actions.filter(x=>x.id!==a.id);save();render()};
    ul.appendChild(li);
  });
}
function setRule(id,key){$(id).addEventListener("change",()=>{const v=parseFloat($(id).value);if(isFinite(v)&&v>=0){S[key]=v;save()}render()})}
setRule("xpCap","xpCap");

const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function streak(){
  const A=new Set(S.days),set=new Set([...S.days,...protDays()]);let n=0;const d=new Date();
  if(!set.has(dayKey(d)))d.setDate(d.getDate()-1);
  while(set.has(dayKey(d))){if(A.has(dayKey(d)))n++;d.setDate(d.getDate()-1)}
  return n;
}
function recomputeDays(){const ex=new Set([dayKey(Date.now()),...(window.__jDay?[dayKey(Date.now()-864e5)]:[])]),keep=new Set(S.days.filter(k=>!ex.has(k)));S.log.forEach(e=>keep.add(dayKey(e.t)));S.days=[...keep].sort().slice(-400)}

// complete : version complète (ex-réécriture de correctifs.js), completeBase = le cœur d'origine
function complete(a,el,ev,sp,extra){const r=completeBase.apply(this,arguments);try{const e=S.log[S.log.length-1];if(e&&e.name===a.name&&!e.bonus&&!/^(mb|sleep|bonus)/.test(String(e.a||""))){
      let k=String(e.a||"").startsWith("af:")?e.a:afMatch(e.name);if(k){e.af=k;const g=S.g;if(!g.afLast||typeof g.afLast!=="object")g.afLast={};g.afLast[k]=e.t;(g.last||[]).forEach(x=>{if(afMatch(x.name)===k&&x.d!==dayKey(e.t)){x.pv=x.d;x.d=dayKey(e.t)}});if(!String(e.a).startsWith("af:")){const L=k.split(":")[3]?null:FAM.find(f=>f.id===k.split(":")[1]);if(L&&L.lz&&!e.lz&&a.xp>0){try{lzGain(L.lz,a.xp)}catch(_){}e.lz=L.lz+":link";e.lzx=a.xp}}}
      autoQuest(e)}}catch(err){}return r}
function completeBase(a,el,ev,sp,extra){
  {const k=String(a.id||"")+"|"+(a.name||"")+"|"+(a.who||"");if(!/^rit/.test(String(a.id||""))&&window.__lastC&&window.__lastC.k===k&&Date.now()-window.__lastC.t<700)return;window.__lastC={k,t:Date.now()}}
  if(S.g&&!(extra&&(extra.rit||extra.mb))&&!/^(rit|mb|sleep)/.test(String(a.id||""))){try{questReact(a.name,a.cat);mapReveal(a.name)}catch(e){}}
  {const P=window.__xpP;if(P&&Date.now()-P.t<4000){window.__xpP=null;if(P.ov!=null)a={...a,xp:P.ov};if(P.add)a={...a,xp:a.xp+P.add}}else window.__xpP=null}
  if(!(extra&&extra.lz)&&S.g){const _lk=LZ_LINK[a.name]||(typeof lzGuess==="function"?lzGuess(a):"");if(_lk&&a.xp>0){lzGain(_lk,a.xp);extra={...(extra||{}),lz:_lk+":link",lzx:a.xp}}}
  if(boostOn()&&a.xp>0){a={...a,xp:a.xp*2};extra={...(extra||{}),x2:1}}
  if(false&&S.xpCap>0&&a.xp>0){const tk=dayKey(Date.now()),done=S.log.filter(e=>dayKey(e.t)===tk&&!e.bonus).reduce((s2,e)=>s2+Math.max(0,e.xp),0),left=Math.max(0,S.xpCap-done);
    if(a.xp>left){a={...a,xp:left};extra={...(extra||{}),cap:1};setTimeout(()=>toast(left?`Plafond du jour atteint : <span class="p">+${left} XP</span> seulement`:"Plafond du jour atteint : l'XP reprend demain"),500)}}
  const prev=levelInfo(S.xp).l;
  const prevStat=statInfo(S.stats[a.cat]||0).l;
  const sg=sndGain(a);if(sg)Object.entries(sg).forEach(([k,v])=>{S.snd[k]=(S.snd[k]||0)+v});
  const T0=Date.now()-(window.__dayShift?864e5:0);S.xp+=a.xp;S.stats[a.cat]=(S.stats[a.cat]||0)+a.xp;S.log.push({a:a.id,cat:a.cat,name:a.name,xp:a.xp,t:T0,...(window.__dayShift?{yd:1}:{}),...(sp?{sp:1}:{}),...(sg?{snd:sg}:{}),...(extra||{})});
  // garde le journal léger : 300 dernières entrées
  if(S.log.length>300)S.log=S.log.slice(-300);
  const k=dayKey(T0);if(!S.days.includes(k)){S.days.push(k);S.days.sort()}if(window.__dayShift){try{syncHist()}catch(e){}}
  const bt=window.__dayShift?"":streakBonusCheck();
  {const rc=window.__ritCtx;window.__ritCtx=null;undoOffer(S.log[S.log.length-1],rc&&Date.now()-rc.t<1500?rc:null)}
  floatXp(a.xp,ev,el);if(!window.__ritSnd)sfx("coin");
  save();render(prev);
  const ns=statInfo(S.stats[a.cat]||0).l;
  if(ns>prevStat&&STAT_KEYS.includes(a.cat))toast(`${CATS[a.cat].label} niveau <span class="p">${ns}</span> !`);
  if(bt)setTimeout(()=>toast(bt),900);
}
let undoT=0;
// suppression immédiate + « Annuler » quelques secondes (standard de l'appli) : on restaure l'état d'avant comme une sauvegarde
function undoAfter(label,fn,restore){const snap=restore?null:JSON.stringify(snapshot());fn();let b=$("undoBar");if(!b){b=document.createElement("div");b.id="undoBar";b.setAttribute("role","status");document.body.appendChild(b)}
  b.innerHTML=`<span></span><button type="button">Annuler</button>`;b.querySelector("span").textContent=label;b.classList.add("show");clearTimeout(undoT);undoT=setTimeout(()=>b.classList.remove("show"),5000);
  b.querySelector("button").onclick=()=>{clearTimeout(undoT);b.classList.remove("show");try{if(restore)restore();else{load(JSON.parse(snap));save();render()}}catch(e){}toast("Annulé")}}
function undoOffer(e,rc){if(!e||e.bonus)return;let b=$("undoBar");if(!b){b=document.createElement("div");b.id="undoBar";b.setAttribute("role","status");document.body.appendChild(b)}
  b.innerHTML=`<span></span><button type="button">Annuler</button>`;b.querySelector("span").textContent=e.name+(e.yd?" noté pour hier":" validé");b.classList.add("show");clearTimeout(undoT);undoT=setTimeout(()=>b.classList.remove("show"),5000);
  b.querySelector("button").onclick=()=>{clearTimeout(undoT);b.classList.remove("show");const li=[...document.querySelectorAll("#log li")].find(x=>x.__e===e);if(!li){toast("Trop tard pour annuler ici : passe par le journal");return}
    if(rc){S.daily.c[rc.id]=rc.c;ritMark(rc.id,0,1);if(S.g.rcore&&!ritCore().every(t=>(ritH()[dayKey(Date.now())]||{})[t.id]))S.g.rcore=S.g.rcore.filter(k=>k!==dayKey(Date.now()))}
    li.querySelector(".undo").click();toast("Annulé")}}
function rngDays(a,b){const out=[],d=new Date(a+"T12:00");let n=0;while(dayKey(d)<=b&&n++<400){out.push(dayKey(d));d.setDate(d.getDate()+1)}return out}
function runAt(set,k){let n=0;const d=new Date(k+"T12:00");while(set.has(dayKey(d))){n++;d.setDate(d.getDate()-1)}return n}
function bestRun(set){const ks=[...set].sort();let best=0,c=0,prev=null;ks.forEach(k=>{const t=new Date(k+"T12:00");c=prev&&Math.round((t-prev)/864e5)===1?c+1:1;if(c>best)best=c;prev=t});return best}
function lastN(set,N){let n=0;for(let i=0;i<N;i++){if(set.has(dayKey(Date.now()-i*864e5)))n++}return n}
const JOK_MAX=3,BACK_D=4;
function backCheck(){const G=S.g;if(!G||window.__tmode0)return;const tk=dayKey(Date.now()),last=G.seen;if(last===tk)return;G.seen=tk;
  if(last&&last<tk){const gap=Math.round((new Date(tk+"T12:00")-new Date(last+"T12:00"))/864e5);
    if(gap>=BACK_D){const mid=rngDays(last,tk).slice(1,-1);G.abs=[...new Set([...(G.abs||[]),...mid])].slice(-120);G.rtr=[...new Set([...(G.rtr||[]),...mid])].slice(-60);G.jokChk=tk;setTimeout(()=>backPop(gap),900)}}
  save()}
function backPop(gap){if(document.querySelector(".backpop"))return;const o=document.createElement("div");o.className="bpop backpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Content de te revoir");
  o.innerHTML=`<div class="bpc" style="--tc:var(--gold)"><div class="bpbig" aria-hidden="true">${pxImg("star",5)}</div><h3>Content de te revoir</h3><p class="bpd">Ces ${gap-1} jours ne comptent pas. On repart d'aujourd'hui.</p><button type="button" class="btn primary" style="width:100%;margin-top:12px">C'est reparti</button></div>`;
  document.body.appendChild(o);o.querySelector("button").onclick=()=>{o.remove();render()};sfx("moment")}
function jokCheck(){const G=S.g;if(!G)return;if(typeof G.jok!=="number")G.jok=0;if(!Array.isArray(G.jokD))G.jokD=[];const s=streak();let ch=false;
  if(G.jokS==null){G.jokS=Math.floor(s/10)*10;if(s>=10&&!G.jok){G.jok=1}ch=true}
  if(s<G.jokS){G.jokS=Math.floor(s/10)*10;ch=true}
  if(Math.floor(s/10)>Math.floor(G.jokS/10)){G.jokS=s;if(G.jok<JOK_MAX){G.jok++;setTimeout(()=>toast(`Joker gagné ! <span class="p">${G.jok}/${JOK_MAX}</span> Il protège ta série un jour d'oubli.`),1400)}ch=true}
  const tk=dayKey(Date.now());if(G.jokChk!==tk&&G.jok>0){const y=dayKey(Date.now()-864e5),y2=dayKey(Date.now()-2*864e5),P=new Set(protDays());
    if(!P.has(y)&&!rtrPending().some(p=>p.k===y)){G.jokChk=tk;const F=new Set([...S.days,...P]),C=new Set([...(G.rcore||[]),...P]);
      const fb=!F.has(y)&&runAt(F,y2)>=3,cb=!C.has(y)&&runAt(C,y2)>=3&&ritLive().some(t=>t.core);
      if(fb||cb){G.jokD.push(y);G.jokD=G.jokD.slice(-60);G.jok--;setTimeout(()=>toast(`Un joker a protégé ta série d'hier. Il t'en reste ${G.jok}.`),1600)}ch=true}}
  if(ch)save()}
function streakLine(){const G=S.g,P=protDays(),F=new Set([...S.days,...P]),s=streak(),best=Math.max(bestRun(new Set(S.days)),s),l40=lastN(F,40);
  return`Série ${s} j · record ${best} j · actif ${l40} jours sur 40${G&&G.jok?` · ${G.jok} joker${G.jok>1?"s":""}`:""}`}
const STREAK_MS=[[7,1],[30,2],[100,3]];
function addBonus(name,xp,eurAmt,flag){S.xp+=xp;if(eurAmt)S.extraMoney=Math.round((S.extraMoney+eurAmt)*100)/100;S.log.push({a:"bonus",cat:null,name,xp,t:Date.now(),bonus:1,...(eurAmt?{eur:eurAmt}:{}),...(flag?{[flag]:1}:{})})}
function streakBonusCheck(){
  const n=streak();let msg="";
  STREAK_MS.forEach(([m,xp])=>{
    if(n<m)return;
    const d=new Date();d.setDate(d.getDate()-(m-1));const startKey=dayKey(d);
    if(!S.streakBonus[m]||S.streakBonus[m]<startKey){S.streakBonus[m]=dayKey(Date.now());const sid=STREAK_IT[m];if(sid&&!S.g.gear.includes(sid)){S.g.gear.push(sid);msg+=`Série de ${m} jours ! <span class="p">${esc(gearOf(sid).n)}</span> débloqué `}}
  });
  return msg;
}
