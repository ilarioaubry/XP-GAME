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
const Q_TIPS={sport:"10 pompes ou 10 min de marche rapide demain",perso:"une séance au studio, même 20 min",social:"prends des nouvelles d'un ami",famille:"un appel à quelqu'un de ta famille",maison:"10 min de rangement ou une lessive",soi:"20 pages de lecture ou 10 min de méditation",travail:"25 min de travail concentré sans téléphone"};
function renderWeekRecap(){
  const box=$("wkRecap");if(!box)return;const DAY=864e5,now=new Date();now.setHours(12,0,0,0);
  const keys=n=>[...Array(7)].map((_,i)=>dayKey(new Date(now.getTime()-(i+n)*DAY)));
  const cur=keys(0),prev=keys(7);
  const xpOf=ks=>S.log.filter(e=>ks.includes(dayKey(e.t))).reduce((a,e)=>a+Math.max(0,e.xp),0);
  const xpW=xpOf(cur),xpP=xpOf(prev),act=cur.filter(k=>S.log.some(e=>dayKey(e.t)===k&&e.xp>0)).length;
  const perDay=cur.map(k=>[k,S.log.filter(e=>dayKey(e.t)===k).reduce((a,e)=>a+Math.max(0,e.xp),0)]).sort((a,b)=>b[1]-a[1]);
  const best=perDay[0]&&perDay[0][1]>0?perDay[0]:null;
  const byCat={};STAT_KEYS.forEach(k=>byCat[k]=0);S.log.filter(e=>cur.includes(dayKey(e.t))).forEach(e=>{const c=catOf(e);if(c&&c in byCat)byCat[c]+=Math.max(0,e.xp)});
  const ranked=STAT_KEYS.slice().sort((a,b)=>byCat[b]-byCat[a]),strong=ranked.filter(k=>byCat[k]>0).slice(0,2),weak=ranked.filter(k=>byCat[k]===0);
  const lab=k=>(CATS[k]||{}).label||k,dname=k=>{const d=new Date(k+"T12:00");return d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric"})};
  const trend=xpP?Math.round((xpW-xpP)/xpP*100):null;
  const G=S.g,pairs=Object.keys(G.mood||{}).filter(k=>G.sleep&&G.sleep[k]&&G.sleep[k].h).map(k=>[G.sleep[k].h,G.mood[k]]);
  const B=[["< 6 h",0,6],["6-7 h",6,7],["7-8 h",7,8],["8 h +",8,99]].map(([n,a,b])=>{const L=pairs.filter(q=>q[0]>=a&&q[0]<b).map(q=>q[1]);return{n,c:L.length,m:L.length?L.reduce((x,y)=>x+y,0)/L.length:0}});
  const enough=pairs.length>=3;
  let tip="";const sl=cur.map(k=>G.sleep&&G.sleep[k]&&G.sleep[k].h).filter(Boolean),slAvg=sl.length?sl.reduce((a,b)=>a+b,0)/sl.length:0;
  const goodSleep=B.filter(b=>b.c).sort((a,b)=>b.m-a.m)[0];
  if(act===0)tip="Une seule petite action aujourd'hui suffit pour relancer ta série.";
  else if(enough&&slAvg&&slAvg<7&&goodSleep&&(goodSleep.n==="7-8 h"||goodSleep.n==="8 h +"))tip=`Ton humeur est meilleure quand tu dors ${goodSleep.n}. Cette semaine tu dors ${fmtH(slAvg)} en moyenne : vise un coucher un peu plus tôt.`;
  else if(weak.length)tip=`${lab(weak[0])} est à l'arrêt cette semaine : ${Q_TIPS[weak[0]]}.`;
  else if(trend!==null&&trend<-20)tip="Semaine plus calme que la précédente. Mise sur tes rituels du matin pour reprendre le rythme.";
  else tip="Belle semaine équilibrée, continue comme ça !";
  const mf=m=>m?moodFace(Math.max(1,Math.min(5,Math.round(m))),22):'<span class="wk-none">—</span>';
  box.innerHTML=`<div class="gcard col1 wkr"><div class="bh2"><h3>Ma semaine</h3><span class="hint">7 derniers jours</span></div>
    <div class="wk-kpi"><div><small>XP</small><b>${xpW}</b>${trend!==null?`<span class="${trend>=0?"up":"down"}">${trend>=0?"▲":"▼"} ${Math.abs(trend)} %</span>`:"<span>&nbsp;</span>"}</div><div><small>Jours actifs</small><b>${act}/7</b><span>&nbsp;</span></div><div><small>Meilleur jour</small><b>${best?best[1]:0}</b><span>${best?esc(dname(best[0])):"—"}</span></div></div>
    <div class="wk-cats"><div><small>Points forts</small><p>${strong.length?strong.map(k=>`<span class="wkc" style="--c:${CATS[k].c}">${lab(k)}</span>`).join(""):"—"}</p></div><div><small>Délaissées</small><p>${weak.length?weak.map(k=>`<span class="wkc off" style="--c:${CATS[k].c}">${lab(k)}</span>`).join(""):"Aucune"}</p></div></div>
    <div class="wk-tip"><b>Conseil de la semaine</b><p>${esc(tip)}</p></div></div>
    <div class="gcard col1 wkr"><div class="bh2"><h3>Sommeil et humeur</h3><span class="hint">${pairs.length} nuit${pairs.length>1?"s":""} notée${pairs.length>1?"s":""}</span></div>
    ${enough?`<div class="wk-sm">${B.map(b=>`<div class="${b.c?"":"empty"}"><small>${b.n}</small>${mf(b.m)}<span>${b.c?b.c+" nuit"+(b.c>1?"s":""):"pas de données"}</span></div>`).join("")}</div><p class="hint" style="margin:0">Ton humeur moyenne selon tes heures de sommeil.</p>`:`<p class="hint" style="margin:0">Note ta nuit et ton humeur au moins 3 jours pour voir le lien entre les deux.</p>`}</div>`;
}
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
function renderLife(){
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
function bestStreak(){const d=[...new Set(S.days)].sort();let best=0,c=0,prev=null;d.forEach(k=>{const t=new Date(k+"T12:00");if(prev&&Math.round((t-prev)/864e5)===1)c++;else c=1;if(c>best)best=c;prev=t});return best}
function renderRecords(){
  const box=$("recBox");if(!box)return;const G=S.g,days=[...S.days].sort(),first=days[0]||(S.log[0]?dayKey(S.log[0].t):dayKey(Date.now()));
  const fd=new Date(first+"T12:00"),since=fd.toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"2-digit"});
  const wins=G.bh.filter(b=>b.won).length+(G.boss.won?1:0),B=badgeDefs(),nb=B.filter(b=>S.badges[b.id]).length;
  const R=[["Aventurier depuis",since,"flame"],["Jours actifs",S.days.length,"check"],["Meilleure série",bestStreak()+" j","flame"],["XP total",S.xp,"spark"],["Sons sortis",Object.keys(G.rel).length,"spark"],["Coffres ouverts",G.opened||0,"check"],["Objets trouvés",G.gear.length,"spark"],["Badges",nb+"/"+B.length,"check"]];
  box.innerHTML=`<div class="gcard col1"><h3>Records</h3><p class="me-sr" style="margin:0 0 8px">${streakLine()}</p><div class="recs">${R.map(([k,v,ic])=>`<div><small>${k}</small><b>${esc(String(v))}</b></div>`).join("")}</div></div>`;
}
function renderSleep(){
  const box=$("sleepBox");if(!box)return;const G=S.g;
  const nights=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);nights.push([d,G.sleep[dayKey(d)]])}
  const done=nights.filter(n=>n[1]);box.classList.toggle("gempty",!done.length);if(!done.length){box.innerHTML="";return}
  const avg=done.length?done.reduce((a,n)=>a+n[1].h,0)/done.length:0,good=done.filter(n=>n[1].h>=7).length;
  box.innerHTML=`<div class="gcard col1"><h3>Sommeil · 14 nuits</h3><div class="nights" style="grid-template-columns:repeat(14,1fr)" aria-label="14 dernières nuits">${nights.map(([d,s])=>`<span title="${d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric"})}${s?" : "+fmtH(s.h):""}"><i style="height:${s?Math.min(100,s.h/10*100):0}%;background:${s?s.h>=7?"var(--c-planete)":s.h>=6?"var(--gold)":"var(--c-sport)":"none"}"></i><em>${"LMMJVSD"[(d.getDay()+6)%7]}</em></span>`).join("")}</div><p class="hint" style="margin:0">${done.length?`Moyenne ${fmtH(Math.round(avg*4)/4)} · ${good} nuit${good>1?"s":""} de 7 h ou plus`:"Note ta nuit chaque matin dans les rituels."}</p></div>`;
}
function renderMoodYear(){
  const box=$("moodBox");if(!box)return;const G=S.g,now=new Date(),y=now.getFullYear(),m=now.getMonth(),tk=dayKey(Date.now()),pre=y+"-"+String(m+1).padStart(2,"0");
  const wk=dayKey(Date.now()-7*864e5),canPick=k=>k<tk&&k>=wk&&!G.mood[k];
  const any=Object.keys(G.mood).some(k=>k.startsWith(pre))||Array.from({length:7},(_,i)=>dayKey(Date.now()-(i+1)*864e5)).some(k=>k.startsWith(pre)&&canPick(k));box.classList.toggle("gempty",!any);if(!any){box.innerHTML="";return}
  const dim=new Date(y,m+1,0).getDate(),off=(new Date(y,m,1).getDay()+6)%7;let n=0,cells="";
  for(let i=0;i<off;i++)cells+=`<i class="no"></i>`;
  for(let d=1;d<=dim;d++){const k=pre+"-"+String(d).padStart(2,"0"),v=G.mood[k];if(v)n++;cells+=`<i class="${k>tk?"fut":""}${k===tk?" td":""}${canPick(k)?" pick":""}"${canPick(k)?` data-k="${k}" role="button" tabindex="0" aria-label="Noter l'humeur du ${d}"`:""}${v?` style="background:${MOODS[v-1][2]}" title="${d} : ${MOODS[v-1][1]}"`:""}>${v?moodFace(v,28):`<span>${d}</span>`}</i>`}
  box.innerHTML=`<div class="gcard col1"><h3>Humeur de ${MOIS[m]}</h3><div class="mcal">${"LMMJVSD".split("").map(x=>`<b>${x}</b>`).join("")}${cells}</div><div class="leg">${MOODS.map((mo,i)=>`<span>${moodFace(i+1,16)}${mo[1]}</span>`).join("")}</div><p class="hint" style="margin:0">${n} jour${n>1?"s":""} noté${n>1?"s":""} ce mois-ci.${box.__pk?"":""}${[...cells.matchAll(/ pick"/g)].length?" Touche un jour en pointillés pour noter son humeur.":""}</p></div>`;
  box.querySelectorAll(".mcal i.pick").forEach(c=>{c.onclick=()=>moodPick(c.dataset.k);c.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();moodPick(c.dataset.k)}}});
}
function moodPick(k){if(document.querySelector(".mdpop"))return;const G=S.g,o=document.createElement("div");o.className="bpop mdpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Humeur");document.body.appendChild(o);
  const dt=new Date(k+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});o.onclick=e=>{if(e.target===o)o.remove()};
  o.innerHTML=`<div class="bpc mdpc"><h3>Ton humeur</h3><p class="bpdt"></p><div class="mrow">${MOODS.map((m,i)=>`<button type="button" data-m="${i+1}" aria-label="${m[1]}" title="${m[1]}" style="--mc:${m[2]}">${moodFace(i+1,40)}</button>`).join("")}</div><button type="button" class="lnk mdx">Annuler</button></div>`;
  o.querySelector(".bpdt").textContent=dt;o.querySelector(".mdx").onclick=()=>o.remove();
  o.querySelectorAll(".mrow button").forEach(b=>b.onclick=()=>{G.mood[k]=+b.dataset.m;o.remove();save();render();toast("Humeur notée pour "+dt)})}
// ---- Bilan du mois
function renderBilan(){try{renderHome()}catch(e){console.error(e)}}
