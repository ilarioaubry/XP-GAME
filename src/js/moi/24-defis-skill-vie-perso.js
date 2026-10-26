// ===== Défis par skill (même principe que le Son : tirer un défi + objectif du mois) =====
const FILMS=["Le Parrain (1972)","Pulp Fiction (1994)","La Haine (1995)","Le Fabuleux Destin d'Amélie Poulain (2001)","Le Voyage de Chihiro (2001)","Mon voisin Totoro (1988)","Princesse Mononoké (1997)","Fight Club (1999)","Matrix (1999)","Inception (2010)","Interstellar (2014)","The Dark Knight (2008)","Les Évadés (1994)","Forrest Gump (1994)","Le Seigneur des anneaux : La Communauté de l'anneau (2001)","Retour vers le futur (1985)","Star Wars : L'Empire contre-attaque (1980)","Les Dents de la mer (1975)","Alien (1979)","Blade Runner (1982)","Terminator 2 (1991)","Jurassic Park (1993)","Le Silence des agneaux (1991)","Seven (1995)","Gladiator (2000)","Le Bon, la Brute et le Truand (1966)","Il était une fois dans l'Ouest (1968)","Taxi Driver (1976)","Scarface (1983)","Les Affranchis (1990)","Shining (1980)","Orange mécanique (1971)","2001 : L'Odyssée de l'espace (1968)","Psychose (1960)","Fenêtre sur cour (1954)","Les Tontons flingueurs (1963)","Le Dîner de cons (1998)","Intouchables (2011)","La Cité de la peur (1994)","Les Visiteurs (1993)","OSS 117 : Le Caire, nid d'espions (2006)","Le Grand Bleu (1988)","Léon (1994)","Le Cinquième Élément (1997)","Un prophète (2009)","Les Misérables (2019)","La Vie est belle (1946)","Les Temps modernes (1936)","Le Roi lion (1994)","Toy Story (1995)","Là-haut (2009)","Ratatouille (2007)","Wall-E (2008)","Spider-Man : New Generation (2018)","Parasite (2019)","Old Boy (2003)","Memories of Murder (2003)","In the Mood for Love (2000)","Akira (1988)","Your Name (2016)","Le Tombeau des lucioles (1988)","City of God (2002)","Les Sept Samouraïs (1954)","Whiplash (2014)","La La Land (2016)","Drive (2011)","Get Out (2017)","Mad Max : Fury Road (2015)","Kill Bill : Volume 1 (2003)","Django Unchained (2012)","Eternal Sunshine of the Spotless Mind (2004)","The Truman Show (1998)","Le Labyrinthe de Pan (2006)","8 Mile (2002)","Boyz n the Hood (1991)","Do the Right Thing (1989)","Moonlight (2016)","Les Quatre Cents Coups (1959)","À bout de souffle (1960)","Le Mépris (1963)","Babylon (2022)","Dune (2021)","Everything Everywhere All at Once (2022)"];
function filmPick(not){const G=S.g,seen=new Set([...(G.filmSeen||[]),...(G.filmDone||[]),...(not||[])]);const L=FILMS.filter(f=>!seen.has(f));return L.length?L[Math.floor(Math.random()*L.length)]:pick(FILMS)}
function filmSeen(t,done){const G=S.g,k=done?"filmDone":"filmSeen";if(!Array.isArray(G[k]))G[k]=[];if(!G[k].includes(t))G[k].push(t);G[k]=G[k].slice(-300)}
function filmOfDay(){const G=S.g,tk=dayKey(Date.now());if(!G.filmDay||G.filmDay.d!==tk||(G.filmSeen||[]).includes(G.filmDay.t))G.filmDay={d:tk,t:filmPick()};return G.filmDay.t}






function renderMe(){
  const box=$("meBox");if(!box)return;const l=levelInfo(S.xp),G=S.g;
  const keys=[...STAT_KEYS,"eau","nourriture"];
  box.innerHTML=`<div class="gcard me"><button type="button" class="me-set" id="meSet" aria-label="Réglages" title="Réglages"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button><div class="me-top"><div class="me-av">${avatarSvg(l.l)}</div><div class="me-id"><b class="me-n"></b><span class="me-t"></span><div class="me-k"><span><em>${l.l}</em>niveau</span><span><em>${S.xp}</em>XP total</span><span><em>${eur(balance())}</em>en poche</span></div><p class="me-sr">${streakLine()}</p></div></div>
  <div class="me-st">${keys.map(k=>{const i=statInfo(S.stats[k]||0),c=CATS[k];return`<div style="--cat:${c.c}"><span>${c.label}</span><i><em style="width:${i.cur/i.need*100}%"></em></i><b>${i.l}</b></div>`}).join("")}</div></div>`;
  box.querySelector(".me-n").textContent=S.name;box.querySelector(".me-t").textContent=titleOf(l.l)+(frameOf()?" · cadre "+frameOf().n:"");
}
const WRIC={};
function itemIcon(it){if(WRIC[it.id])return WRIC[it.id];{const u=itemIconNew(it);if(u)return WRIC[it.id]=u}
  if(it.s==="aura")return null;
  const base={...AV_DEF,skin:1,hairC:0,hair:1,top:0,topC:7,bgC:7,beard:0};
  const cv=document.createElement("canvas");
  if(it.s==="fond"){const c=avCanvas({...AV_DEF,...((S.g&&S.g.avc)||{}),hat:0,bgP:it.o,bgC:0},1);return WRIC[it.id]=c.toDataURL()}
  const a=avDraw(base),b=avDraw({...base,[it.k]:it.o});let x0=99,y0=99,x1=-1,y1=-1;
  for(let y=0;y<AVH;y++)for(let x=0;x<AVW;x++)if(a[y*AVW+x]!==b[y*AVW+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
  if(x1<0)return WRIC[it.id]=avCanvas(base,1).toDataURL();
  let bgm=null;if(it.s==="haut"){const q=avDraw({...base,[it.k]:it.o,bgC:0});bgm=b.map((v,k)=>v!==q[k]);x0=0;x1=AVW-1;y0=Math.min(y0,19);y1=AVH-1}
  const w=x1-x0+1,h=y1-y0+1,sz=Math.max(w,h)+2;cv.width=cv.height=sz;const g=cv.getContext("2d");const ox=Math.floor((sz-w)/2),oy=Math.floor((sz-h)/2);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const k=y*AVW+x;const col=bgm?(!bgm[k]&&(a[k]!==b[k]||y>=22)?b[k]:null):(a[k]!==b[k]?b[k]:null);if(col){g.fillStyle=col;g.fillRect(ox+x-x0,oy+y-y0,1,1)}}
  return WRIC[it.id]=cv.toDataURL()}
function itemImg(it,px,cls){if(it.s==="aura")return`<span class="wrau ${cls||""}">${auraPix(it.id,px)}</span>`;return`<img class="wric ${cls||""}" src="${itemIcon(it)}" width="${px}" height="${px}" alt="" aria-hidden="true">`}





const AUI={xmflakes:["#9ec8f0","#3d6aa8",""],flames:["#e8381a","#ff8a1a",'<path d="M12 22c4 0 7-2.8 7-6.8 0-3.6-2.4-5.6-3.6-8.7-.4 1.9-1.4 3-2.6 3.5C13 6.5 11.6 4 9 2.5c.3 3.4-4 6.2-4 11.3C5 18.6 8 22 12 22z" fill="currentColor"/>'],stars:["#23205e","#5b3a9e",'<path d="M12 2l2.6 6.4L21 9l-5 4.4L17.6 20 12 16.6 6.4 20 8 13.4 3 9l6.4-.6z" fill="currentColor"/>'],notes:["#b07a10","#e8b830",'<path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><circle cx="6" cy="18" r="3.2" fill="currentColor"/><circle cx="17" cy="16" r="3.2" fill="currentColor"/>'],neon:["#0b3a5c","#1a8fc0",'<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/>'],goldaura:["#a8780a","#f0c838",'<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="currentColor"/>'],lotus:["#c2516b","#f3a6c8",'<g fill="currentColor"><path d="M12 20q-5-9 0-16q5 7 0 16z"/><path d="M12 20q-10-3-10-10q8 2 10 10z" opacity=".85"/><path d="M12 20q10-3 10-10q-8 2-10 10z" opacity=".85"/></g>'],hello:["#2a8fd6","#e05a9a",'<path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="currentColor"/>']};

function renderEquip(){
  const G=S.g;if(!G)return;
  // titres et cadres : même sélection que l'aura
  {const l=levelInfo(S.xp).l,ranks=RANKS.filter(r=>l>=r[0]).map(r=>r[1]),rare=G.rt.slice(),cur=(ranks.includes(S.title)||rare.includes(S.title))?S.title:"";
   const lockedR=RANKS.filter(r=>l<r[0]).length;
   const LZT=LZ.map(L=>L.t),CRT=Object.values(CAT_RW).map(x=>x[0]);
   const grp=(lab,own,total,extra)=>`<div class="tgrp"><span class="tgl">${lab} <em>${own.length}/${total}</em></span><div class="eqchips">${own.map(n=>`<button type="button" class="eqc" ${extra||""} data-t="${esc(n)}" aria-pressed="${cur===n}">${esc(n)}</button>`).join("")}${own.length<total?`<span class="eqc lock">+${total-own.length}</span>`:""}</div></div>`;
   let t=`<div class="eqchips"><button type="button" class="eqc" data-t="" aria-pressed="${!cur}">Rang actuel</button></div>`;
   t+=grp("Rangs",ranks,RANKS.length);
   const rr=rare.filter(n=>RARE_TITLES.includes(n)),sk=rare.filter(n=>LZT.includes(n)),cr=rare.filter(n=>CRT.includes(n));
   t+=grp("Titres rares",rr,RARE_TITLES.length,'style="--rc:#b06ad9"');
   if(sk.length)t+=grp("Skills",sk,LZT.length,'style="--rc:var(--c-eau)"');
   if(cr.length)t+=grp("Caractéristiques",cr,CRT.length,'style="--rc:var(--c-planete)"');
   $("titleChips").innerHTML=t;$("tiCnt").textContent=ranks.length+rare.length;
   $("titleChips").querySelectorAll("button.eqc").forEach(b=>b.onclick=()=>{S.title=b.dataset.t;if(window.__closeTPick)window.__closeTPick();save();render()});
   }
}
// ---- Musique : défi + sortie du mois



const pick=a=>a[Math.floor(Math.random()*a.length)];


const ymOf=t=>{const d=new Date(t);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")};
const MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];


// ---- Bilan intelligent : ma semaine, sommeil ↔ humeur, conseil
// ---- Vie perso : nuit + humeur
const MOODS=[["😞","Mal","#d1493f"],["🙁","Bof","#e8873a"],["😐","Moyen","#e0c03a"],["🙂","Bien","#8cc56a"],["😄","Super","#3c9a4f"]];
const sleepXp=h=>h>=7?15:h>=6?5:0;
const fmtH=h=>Math.floor(h)+" h"+(Math.round(h%1*60)?" "+String(Math.round(h%1*60)).padStart(2,"0"):"");
let sleepEdit=false,moodEdit=false;

const MOUTH={1:[[2,6],[3,5],[4,5],[5,5],[6,6]],2:[[3,6],[4,5],[5,6]],3:[[3,6],[4,6],[5,6]],4:[[3,5],[4,6],[5,5]],5:[[2,5],[3,6],[4,6],[5,6],[6,5]]};
const __mf={};
function moodFace(n,px,flat){n=Math.max(1,Math.min(5,n|0));const base=(S.g&&S.g.avc)||{},k=JSON.stringify(base)+n+(flat?"f":"");
  if(!__mf[k]){const bm=BODY_MOOD[n-1],H=chCrop({...AV_DEF,...base,eyes:bm[0],mouth:bm[1],hat:0,glasses:[3,4,7].includes(base.glasses|0)?0:(base.glasses|0)},7,-3,18,18),N=22,R=10.45,C=10.5,ox=2,oy=2,cv=document.createElement("canvas");cv.width=cv.height=N*2;const g=cv.getContext("2d"),col=MOODS[n-1][2];
    if(!flat)for(let y=0;y<N;y++)for(let x=0;x<N;x++){const d=(x-C)**2+(y-C)**2;if(d<=R*R){g.fillStyle=d>(R-1.4)**2?avMix(col,"#000",.35):col;g.fillRect(x*2,y*2,2,2)}}
    for(let y=0;y<H.H;y++)for(let x=0;x<H.W;x++){const v=H.px[y*H.W+x],X=x+ox,Y=y+oy;if(v&&X>=0&&X<N&&Y>=0&&(flat||(X-C)**2+(Y-C)**2<=(R-.3)**2)){g.fillStyle=v;g.fillRect(X*2,Y*2,2,2)}}
    __mf[k]=cv.toDataURL("image/png")}
  return`<img class="mface" src="${__mf[k]}" width="${px}" height="${px}" alt="" style="image-rendering:pixelated">`}
// renderLife : version complète (ex-réécriture de correctifs.js), renderLifeBase = le cœur d'origine
function renderLife(){const r=renderLifeBase.apply(this,arguments);try{sleepViz()}catch(e){console.warn("sl",e)}return r}
function renderLifeBase(){
  const box=$("ritLife");if(!box)return;if(box.contains(document.activeElement)&&document.activeElement.tagName==="INPUT")return;
  const G=S.g,tk=dayKey(Date.now()),sl=G.sleep[tk],md=G.mood[tk];
  let h="";const P=dayPer(),shSl=P==="matin"&&(!sl||sleepEdit),shMd=false;box.hidden=!(shSl||shMd);
  if(shSl){
  if(sl&&!sleepEdit)h+=`<div class="rt life${sl.h>=7?"":""}"><button class="rtb lifeok" type="button" id="slMod" aria-label="Nuit de ${fmtH(sl.h)}, modifier"><span class="ln" aria-label="Nuit"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></span><b class="lval">${fmtH(sl.h)}</b></button></div>`;
  else h+=`<form class="rt life" id="slForm"><span class="ln" aria-label="Nuit"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></span><div class="slrow"><input type="time" id="slC" value="${sl?sl.c:bedTime()||"23:30"}" aria-label="Heure du coucher" required><span>→</span><input type="time" id="slR" value="${sl?sl.r:(()=>{const d=new Date(),h=d.getHours();return h>=5&&h<12?String(h).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"):String(wakeH()).padStart(2,"0")+":00"})()}" aria-label="Heure du réveil" required><button class="btn primary" type="submit">Fait</button></div></form>`;
  }
  if(shMd){
  if(md&&!moodEdit)h+=`<div class="rt life"><button class="rtb lifeok" type="button" id="mdMod" aria-label="Humeur : ${MOODS[md-1][1]}, modifier"><span class="ln ln0" aria-label="Humeur"></span><span class="lval">${moodFace(md,40)}</span></button></div>`;
  else h+=`<div class="rt life"><span class="ln ln0" aria-label="Humeur"></span><div class="mrow${md?" picked":""}">${MOODS.map((m,i)=>`<button type="button" data-m="${i+1}" aria-pressed="${md===i+1}" aria-label="${m[1]}" title="${m[1]}" style="--mc:${m[2]}">${moodFace(i+1,40)}</button>`).join("")}</div></div>`;
  }
  box.innerHTML=h;
  if($("slMod"))$("slMod").onclick=()=>{sleepEdit=true;renderLife();const c=$("slC");if(c)c.focus()};
  if($("slForm"))$("slForm").addEventListener("submit",e=>{e.preventDefault();const c=$("slC").value,r=$("slR").value;if(!c||!r)return;document.activeElement.blur();
    const[ch,cm]=c.split(":").map(Number),[rh,rm]=r.split(":").map(Number);const mins=((rh*60+rm)-(ch*60+cm)+1440)%1440,hh=Math.round(mins/60*100)/100;
    const old=G.sleep[tk];G.sleep[tk]={c,r,h:hh,x:old?old.x||0:0,bm:old?old.bm||0:0};if(!G.sleep[tk].bm&&ch>=18){G.sleep[tk].bm=1;addBonus("Couché avant minuit",10,0,"bm");setTimeout(()=>toast(`Couché avant minuit : <span class="p">+10 XP</span>`),1200)}sleepEdit=false;const xp=sleepXp(hh);
    if(!G.sleep[tk].x&&xp){G.sleep[tk].x=boostOn()?xp*2:xp;complete({id:"sleep",cat:"soi",name:"Nuit de "+fmtH(hh),xp},e.submitter||$("slForm"),e,false,{sleep:tk})}else{save();render();toast("Nuit enregistrée : "+fmtH(hh))}});
  if($("mdMod"))$("mdMod").onclick=()=>{moodEdit=true;renderLife()};
  box.querySelectorAll(".mrow button").forEach(b=>b.onclick=()=>{const n=+b.dataset.m;G.mood[tk]=n;moodEdit=false;save();renderLife();renderSpecials();renderMoodYear()});
}
function moodPick(k){if(document.querySelector(".mdpop"))return;const G=S.g,o=document.createElement("div");o.className="bpop mdpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Humeur");document.body.appendChild(o);
  const dt=new Date(k+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});o.onclick=e=>{if(e.target===o)o.remove()};
  o.innerHTML=`<div class="bpc mdpc"><h3>Ton humeur</h3><p class="bpdt"></p><div class="mrow">${MOODS.map((m,i)=>`<button type="button" data-m="${i+1}" aria-label="${m[1]}" title="${m[1]}" style="--mc:${m[2]}">${moodFace(i+1,40)}</button>`).join("")}</div><button type="button" class="lnk mdx">Annuler</button></div>`;
  o.querySelector(".bpdt").textContent=dt;o.querySelector(".mdx").onclick=()=>o.remove();
  o.querySelectorAll(".mrow button").forEach(b=>b.onclick=()=>{G.mood[k]=+b.dataset.m;o.remove();save();render();toast("Humeur notée pour "+dt)})}
// ---- Bilan du mois
function renderBilan(){try{renderHome()}catch(e){console.error(e)}}
