// ---- Écusson de niveau en pixel art, couleur selon le rang
const LV_COL=["#b0763c","#aab4bd","#e0b030","#3fae6a","#3b7fe0","#9b5de5","#e0464f","#5fd6e0"],LVPX={};
function lvlCol(l){let i=0;RANKS.forEach((r,k)=>{if(l>=r[0])i=k});return LV_COL[Math.min(i,LV_COL.length-1)]}
// ---- Écusson de niveau : bouclier 14x16 en gros pixels + chiffres pixel, ombre intégrée

const PXL={N:["#..#","##.#","#.##","#..#","#..#"],I:["###",".#.",".#.",".#.","###"],V:["#...#","#...#","#...#",".#.#.","..#.."],L:["#..","#..","#..","#..","###"],E:["###","#..","##.","#..","###"]};
function lvlPix(col,num,lab){const key=col+num+lab;if(LVPX[key])return LVPX[key];
  const M=[".############.",...Array(9).fill("##############"),".############.","..##########..","...########...","....######....",".....####.....","......##......"],W=14,H=16;
  const has=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&M[y][x]==="#";
  const c=document.createElement("canvas");c.width=W*2+2;c.height=H*2+2;const g=c.getContext("2d");
  const li=avMix(col,"#fff",.45),dk=avMix(col,"#000",.3),dk2=avMix(col,"#000",.5),ol="#1a1210";
  g.fillStyle="rgba(20,12,8,.45)";for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(has(x,y))g.fillRect(x*2+2,y*2+2,2,2);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!has(x,y))continue;let k=col;
    if(!has(x-1,y)||!has(x+1,y)||!has(x,y-1)||!has(x,y+1))k=ol;
    else if(!has(x-2,y)||!has(x,y-2)||!has(x-1,y-1))k=li;
    else if(!has(x+2,y)||!has(x,y+2)||!has(x+1,y+1))k=dk2;
    else if(!has(x-3,y)||!has(x,y-3))k=avMix(col,"#fff",.18);
    else if(!has(x+3,y)||!has(x,y+3))k=dk;
    g.fillStyle=k;g.fillRect(x*2,y*2,2,2)}
  g.fillStyle="rgba(255,255,255,.7)";[[3,3],[4,3],[3,4]].forEach(([x,y])=>g.fillRect(x*2,y*2,2,2));
  // texte : contour sombre puis remplissage
  const glyphs=(str,F,sc,gap)=>{const gl=[...str].map(ch=>F[ch]).filter(Boolean);let w=gl.reduce((a,q)=>a+q[0].length*sc,0)+gap*(gl.length-1);return{gl,w,h:(gl[0]?gl[0].length:0)*sc}};
  const draw=(str,F,sc,gap,y0,fill)=>{const{gl,w}=glyphs(str,F,sc,gap);let x0=Math.round((W*2-w)/2);const px=[];
    gl.forEach(q=>{q.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch==="#")px.push([x0+i*sc,y0+j*sc])}));x0+=q[0].length*sc+gap});
    g.fillStyle=sh;px.forEach(([x,y])=>g.fillRect(x+1,y+1,sc,sc));
    g.fillStyle=fill;px.forEach(([x,y])=>g.fillRect(x,y,sc,sc))};
  let sh=ol;if(false){draw(lab,PXL,1,1,4,"#fff")}
  return LVPX[key]=c.toDataURL()}
function lvlStyle(l,lab){return`--lvimg:url(${lvlPix(lvlCol(l),"","")});--lvc:${lvlCol(l)}`}

// ---- Petites icônes pixel (pièce, flamme, étoile, coffre)
const PXSPC={};
Object.assign(PXSP,{"smoke":[["......g.g.",".......g..","......g...","kkkkkkkkkk","kwwwwwwoor","kkkkkkkkkk"],{"k":"#3a2414","w":"#f4f1e8","o":"#e8a040","r":"#e8402a","g":"#9aa4b0"}],"wine":[["kkkkkkk","krrrrrk","krrrrrk",".krrrk.","..kkk..","...k...","...k...",".kkkkk."],{"k":"#3a1a2a","r":"#9a1a3a"}]});
Object.assign(PXSP,{"gift":[["....r..r....","...r.rr.r...","....rrrr....","oooooooooooo","oggggrrggggo","oggggrrggggo","oooooooooooo",".oGGGrrGGGo.",".oGGGrrGGGo.",".oGGGrrGGGo.",".oGGGrrGGGo.",".oooooooooo."],{"o":"#2a1608","g":"#5fc27a","G":"#2f8a4f","r":"#d63b3b"}],
 "tree":[[".....y.....","....yYy....",".....g.....","....ggg....","...gGgrg...","....ggg....","...ggggg...","..gGgggug..","...ggggg...","..ggggggg..",".gyggGggrg.","ggggggggggg","....bbb...."],{"y":"#f2c94c","Y":"#fff3b0","g":"#2f8a4f","G":"#5fc27a","r":"#d63b3b","u":"#3a8ad6","b":"#6a4020"}],
 "snow":[["....w....",".w..w..w.","..w.w.w..","...www...","wwwwWwwww","...www...","..w.w.w..",".w..w..w.","....w...."],{"w":"#cfe2ff","W":"#ffffff"}]});
Object.assign(PXSP,{"heart":[[".kk.kk.","krrkrrk","krwrrrk","krrrrrk",".krrrk.","..krk..","...k..."],{"k":"#3a0a0a","r":"#e3263a","w":"#ffb0b8"}]});
Object.assign(PXSP,{"cup":[["..w.w.....","...w.w....","kkkkkkkk..","kwwwwwwkkk","kwbbbbwk.k","kwwwwwwkkk","kwwwwwwk..",".kkkkkk..."],{"k":"#3a2414","w":"#f4f1e8","b":"#7a4a22"}],"plate":[["...kkkkkk...",".kkggrrggkk.","kwwgrrrrgwwk","kwwwyyyywwwk",".kkwwwwwwkk.","...kkkkkk..."],{"k":"#3a2414","w":"#f4f1e8","g":"#36b679","r":"#d63b3b","y":"#f2c94c"}],"cookie":[["..kkkkk...",".kccdcck..","kcdcccdck.","kccccdcck.","kcdccccck.",".kccdcck..","..kkkkk..."],{"k":"#3a2414","c":"#d8a058","d":"#5a3018"}],"cheese":[["......kk..","....kkyyk.","..kkyyyyyk","kkyyyhyyyk","kyyyyyyhyk","kyhyyyyyyk","kkkkkkkkkk"],{"k":"#5a3a06","y":"#f2c94c","h":"#c99a2a"}],"yogurt":[[".kkkkkk.","kwwwwwwk","kppppppk",".kwwwwk.",".kwwwwk.",".kwwwwk.","..kkkk.."],{"k":"#3a2414","w":"#f4f1e8","p":"#f08cc0"}],"glass":[["kk....kk","k......k","kbbbbbbk","kblbbbbk","kbbbbbbk",".kbbbbk.",".kkkkkk."],{"k":"#1e3a5a","b":"#6ab8f0","l":"#d8f2ff"}],"hourglass":[["kkkkkkk",".kyyyk.","..kyk..","...k...","..kyk..",".kyyyk.","kkkkkkk"],{"k":"#3a2414","y":"#f2c94c"}],"check":[["......kk",".....kgk","k...kgk.","kk.kgk..","kgkgk...",".kgk....","..k....."],{"k":"#1a3a1a","g":"#4cd06a"}]});
function pxSprite(k){if(typeof pxU==="function")pxU(k);if(PXSPC[k])return PXSPC[k];const[r,p]=PXSP[k],c=document.createElement("canvas");c.width=r[0].length;c.height=r.length;const g=c.getContext("2d");
  r.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch!=="."){g.fillStyle=p[ch];g.fillRect(x,y,1,1)}}));return PXSPC[k]=c.toDataURL()}
function pxImg(k,sc,cls){if(typeof pxU==="function")pxU(k);const[r,,w0]=PXSP[k];if(w0)sc=Math.max(1,Math.round(w0*sc/16));return`<img class="pxi ${cls||""}" src="${pxSprite(k)}" width="${r[0].length*sc}" height="${r.length*sc}" alt="" aria-hidden="true">`}
// render = renderBase (le cœur) → finitions d'Aujourd'hui (renderBase2) → assiettes de la semaine. Ex-réécritures de correctifs.js et assiette.js.
function render(){const r=renderBase2.apply(this,arguments);try{renderPlateWeek()}catch(e){}return r}
function renderBase2(){const r=renderBase.apply(this,arguments);try{if(view==="q"){sceneBubble();askToday();oneEv();evToday();tagXP()}}catch(e){console.warn("q",e)}return r}
function renderBase(prevLevel){
  if(seedOnce())save();
  if(gameTick())save();
  const {l,cur,need}=levelInfo(S.xp);
  $("lvl").textContent=l;$("lvlBox").style.cssText=lvlStyle(l);$("cur").textContent=cur;$("need").textContent=need;
  $("bar").style.width=(cur/need*100)+"%";$("barWrap").setAttribute("aria-valuemax",need);$("barWrap").setAttribute("aria-valuenow",cur);
  $("qStreak").textContent=streak();$("qLvl").textContent=l;
  {const near=cur/need>=.9;document.querySelector(".qxp .qbar").classList.toggle("near",near);$("barWrap").classList.toggle("near",near);document.querySelector(".qxp .qs").classList.toggle("lit",S.log.some(e=>e.xp>0&&dayKey(e.t)===dayKey(Date.now())))}$("qCur").textContent=cur;$("qNeed").textContent=need;$("qBar").style.width=(cur/need*100)+"%";
  {const tx=xpToday(),g=dayGoal();{const ql=document.querySelector("#qDay .qdl");if(ql){const e=enOf();ql.innerHTML=e?enSvg(e,22):"Jour";ql.title=e?"Batterie "+["","faible","moyenne","pleine"][e]:""}}$("qDayT").textContent=tx+" / "+g;$("qDayBar").style.width=Math.min(100,tx/g*100)+"%";$("qDay").classList.toggle("ok",tx>=g);try{window.__friseViz&&window.__friseViz()}catch(e){}
   if(tx>=g&&S.g&&S.g.goalHit!==dayKey(Date.now())){S.g.goalHit=dayKey(Date.now());S.g.goalN=(S.g.goalN||0)+1;save();setTimeout(()=>{sfx("badge");toast(`Objectif du jour atteint : <span class="p">${g} XP</span> !`)},900)}}
  if(prevLevel&&l>prevLevel){const q=$("qLvlBox");q.classList.remove("bump");void q.offsetWidth;q.classList.add("bump")}
  const today=dayKey(Date.now()),todays=S.log.filter(e=>dayKey(e.t)===today);
  $("today").textContent=todays.reduce((a,e)=>a+e.xp,0);
  $("streak").textContent=streak();
  if(prevLevel&&l>prevLevel){setTimeout(()=>sfx("level"),180);$("lvlBox").classList.remove("bump");void $("lvlBox").offsetWidth;$("lvlBox").classList.add("bump");toast(`Niveau <span class="p">${l}</span> atteint !${rankOf(l)!==rankOf(prevLevel)?" Nouveau rang : <span class=\"p\">"+rankOf(l)+"</span>":""}`)}
  skyApply();sceneTick();renderNight();backCheck();jokCheck();renderPurse(l);renderChar(l);renderHp();try{renderTrk();renderVie()}catch(e){}renderRtr();if(tmOn()&&!$("tmPanel"))tmShow();else if(!tmOn()&&$("tmPanel"))tmShow();if(ensureBirthdayQuests())save();checkBadges();renderGame();renderEvMode();renderSleepGo();renderWkSun();renderEn();renderFq();if(typeof renderFiche==="function")renderFiche();renderWk();renderPrj();badgeDots();applyTheme();
  $("favs").hidden=true;$("filters").hidden=true;$("seeAll").hidden=true;$("allActs").hidden=false;
  for(const k in viewDirty)viewDirty[k]=true;
  runView(view);
}
function renderJournal(){
  const today=dayKey(Date.now()-(window.__jDay?864e5:0)),todays=S.log.filter(e=>dayKey(e.t)===today);
  {const d=$("log")&&$("log").parentElement;if(d&&!d.querySelector(".jday")){const s=document.createElement("div");s.className="jday";s.setAttribute("role","group");s.setAttribute("aria-label","Jour");s.innerHTML=`<button type="button" data-j="0">Aujourd'hui</button><button type="button" data-j="1">Hier</button>`;d.insertBefore(s,$("log"));s.onclick=ev=>{const b=ev.target.closest("[data-j]");if(!b)return;window.__jDay=+b.dataset.j;renderJournal()}}if(d)d.querySelectorAll(".jday [data-j]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.j===(window.__jDay|0)))}
  // journal
  const ul=$("log");ul.innerHTML="";$("logCnt").textContent=todays.length;{const jr=document.querySelector("details.jrn");if(jr)jr.classList.toggle("jempty",!todays.length&&!window.__jDay)}
  if(!todays.length){ul.innerHTML=`<li style="display:block"><p class="empty" style="padding:4px 0">Rien encore.</p></li>`}
  todays.slice().reverse().forEach(e=>{
    const li=document.createElement("li");const t=new Date(e.t);
    li.innerHTML=`<time>${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}</time><span class="n"></span><span class="x">+${e.xp}</span><button class="undo" type="button">Annuler</button>`;
    li.querySelector(".n").textContent=e.name;li.__e=e;
    li.querySelector(".undo").onclick=()=>{const prev=levelInfo(S.xp).l;S.log=S.log.filter(x=>x!==e);S.xp=Math.max(0,S.xp-e.xp);if(e.prj&&e.ps!=null&&S.g&&Array.isArray(S.g.prj)){const p=S.g.prj.find(x=>x.id===e.prj);if(p&&p.st[e.ps]){delete p.st[e.ps].d;delete p.won}}if(e.sold&&!S.g.gear.includes(e.sold))S.g.gear.push(e.sold);if(e.pj){const G=pjState();if(e.pjfin){try{const o=JSON.parse(e.pjfin);o.i=e.pji;o.last="";G.pj[e.pj]=o;G.pjd=G.pjd.filter(x=>x!==o.id);delete G.pjf[e.pj];if(G.chests>0)G.chests--}catch(er){}}else{const c=G.pj[e.pj];if(c&&c.id===e.pjid){c.i=e.pji;c.last=""}}}if(e.lz&&e.lzx){const zi=e.lz.split(":")[0],z=lzState();z.xp[zi]=Math.max(0,(z.xp[zi]||0)-e.lzx)}if(e.out&&S.g.rel[e.out])delete S.g.rel[e.out];if(e.mb&&S.g.mb)delete S.g.mb[e.mb];if(e.a==="mb"){try{const tk=dayKey(e.t);for(const per of ["matin","soir"]){const M=MB[per].find(x=>x[1]===e.name);if(M){const dr=mbDr(tk+":"+per);delete dr.m[M[0]];delete dr.cr[M[0]];if(S.g.mb&&S.g.mb[tk+":"+per]&&S.g.mb[tk+":"+per].auto)delete S.g.mb[tk+":"+per]}}}catch(er){}}if(e.plk){try{plUndo(e)}catch(er){}}if(e.sleep&&S.g.sleep[e.sleep])S.g.sleep[e.sleep].x=0;if(e.snd)Object.entries(e.snd).forEach(([k,v])=>{S.snd[k]=Math.max(0,(S.snd[k]||0)-v)});if(e.rel&&S.bonds[e.who]!=null)S.bonds[e.who]=Math.max(0,S.bonds[e.who]-e.xp);if(Array.isArray(e.fgw))e.fgw.forEach(n=>{S.bonds[n]=Math.max(0,(S.bonds[n]||0)-Math.max(2,Math.round(e.xp/2)))});if(e.sp&&S.g.dq&&Array.isArray(S.g.dq.done)){const di=S.g.dq.done.findIndex(x=>x.id===e.a||(!x.id&&x.n===e.name));if(di>=0)S.g.dq.done.splice(di,1)}if(e.sp&&!S.specials.some(q=>q.id===e.a)){
      const ug=e.g||"friends";
      if(e.fr&&(ug==="friends"||ug==="family")&&S.bonds[e.who]!=null)S.bonds[e.who]=Math.max(0,S.bonds[e.who]-e.xp);
      if(e.fr){S.specials=S.specials.filter(q=>q.grp!==ug);S[GROUPS[ug].done]=S[GROUPS[ug].done].filter(n=>n!==e.who)}
      S.specials.unshift({id:e.a,name:e.name,cat:e.cat,xp:e.xp,...(e.fr?{grp:ug,who:e.who}:{}),...(e.bd?{bd:e.who}:{}),...(e.sur?{sur:e.sur}:{}),...(e.gift&&e.sp?{gift:e.gift,d:dayKey(Date.now())}:{}),...(e.dzq?{dz:e.dzq,lzs:e.dzq}:{})});if(e.bq)S.g.bqDone="";if(e.sur)S.g.surDone="";if(e.bd)delete S.bdDone[e.who];
    }if(e.eur)S.extraMoney=Math.round(Math.max(0,S.extraMoney-e.eur)*100)/100;if(e.dayb)S.daily.bonusDay="";if(e.sk){const k=S.skills.find(x=>x.id===e.sk);if(k)k.xp=Math.max(0,k.xp-e.xp)}if(e.ep){const ep=S.epics.find(x=>x.id===e.ep.e);if(ep&&ep.steps[e.ep.i]){ep.steps[e.ep.i].done=false;ep.finished=false}}const uc=catOf(e);if(uc)S.stats[uc]=Math.max(0,(S.stats[uc]||0)-e.xp);recomputeDays();save();render();toast(`−${e.xp} XP · « ${esc(e.name)} » annulé`)};
    ul.appendChild(li);
  });
}
// rendu par vue : seule la page visible est redessinée, les autres le sont quand on y va
const viewDirty={q:true,c:true,r:true,p:true,b:true,s:true};
const VIEW_R={
  q:()=>{renderRituals();renderXm();renderSpecials();renderLife();renderEvents();renderActCards();renderJournal();renderActList()},
  c:()=>{renderChap();renderWardrobe();renderCollection();renderShow();renderKpi();renderBilan();renderIdentity();renderEquip();renderMe();try{VIEW_R.s()}catch(e){}},
  r:()=>{renderRelations()},
  p:()=>{renderRelations();renderProfile()},
  
  s:()=>{renderData();document.querySelectorAll("[data-snd]").forEach(b=>b.setAttribute("aria-pressed",(b.dataset.snd==="1")===!(S.g&&S.g.mute)));document.querySelectorAll(".thseg [data-th]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.th===(S.theme||"auto")))}
};
function runView(v){const f=VIEW_R[v];if(!f)return;viewDirty[v]=false;f()}






function renderPurse(l){
  if(document.activeElement!==$("xpCap"))$("xpCap").value=S.xpCap;
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return dayKey(d)});const per=days.map(k=>S.log.filter(e=>dayKey(e.t)===k).reduce((a,e)=>a+Math.max(0,e.xp),0));
  const act=per.filter(x=>x>0),avg=act.length?Math.round(act.reduce((a,b)=>a+b,0)/act.length):0;
  $("ecoBox").innerHTML=`<div><small>Gain moyen</small><b>${avg} XP</b><span>par jour actif (7 derniers jours)</span></div><div><small>Plafond</small><b>${S.xpCap||"∞"}</b><span>XP max par jour</span></div><div><small>Niveau ${l+1}</small><b>${needFor(l)-levelInfo(S.xp).cur}</b><span>XP restants</span></div>`;
}
let __myAv={k:"",u:""};
function myAvatarURL(){const cfg={...AV_DEF,...((S.g&&S.g.avc)||{})},k=JSON.stringify(cfg);if(__myAv.k!==k){__myAv={k,u:avCanvas(cfg,4).toDataURL("image/png")}}return __myAv.u}
const frameOf=()=>null;
const titleOf=l=>{if(S.title&&S.g&&S.g.rt.includes(S.title))return S.title;const t=RANKS.find(r=>r[1]===S.title);return t&&l>=t[0]?t[1]:rankOf(l)};
function avatarSvg(l,top){
  return `<svg class="avatar" viewBox="0 0 120 140" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Avatar de ${esc(S.name)}, niveau ${l}">
  <defs><clipPath id="avClip"><rect width="120" height="140"/></clipPath></defs>
  <image href="${headURL((S.g&&S.g.avc)||{},20,24,6,-7,6)}" x="0" y="0" width="120" height="140" preserveAspectRatio="xMidYMid slice" clip-path="url(#avClip)" style="image-rendering:pixelated"/>
  <g clip-path="url(#avClip)">${gearOverlay()}</g>
  ${frameOf()?`<rect x="2" y="2" width="116" height="136" rx="13" fill="none" stroke="${frameOf().c}" stroke-width="4"/>`:""}
  </svg>`;
}
function renderChar(l){
  const entries=STAT_KEYS.map(k=>({k,xp:S.stats[k]||0}));
  const topXp=Math.max(...entries.map(e=>e.xp));
  const top=topXp>0?entries.find(e=>e.xp===topXp).k:null;
  $("avatarWrap").innerHTML=avatarSvg(l,top);
  {const card=document.querySelector(".char.pf");if(card){const a=S.g&&S.g.eq.aura&&S.g.gear.includes(S.g.eq.aura)?S.g.eq.aura:"";[...card.classList].forEach(c=>{if(c.startsWith("au-")||c==="aura-on")card.classList.remove(c)});if(a)card.classList.add("au-"+a,"aura-on")}}
  if(document.activeElement!==$("charName"))$("charName").value=S.name;
  $("charTitle").textContent=titleOf(l);
  $("csSum").textContent=entries.slice().sort((a,b)=>b.xp-a.xp).slice(0,3).map(e=>CATS[e.k].label+" "+statInfo(e.xp).l).join(" · ");
  const box=$("stats");box.innerHTML="";
  entries.forEach(e=>{
    const si=statInfo(e.xp),c=CATS[e.k];
    const d=document.createElement("div");d.className="stat"+(e.k===top?" top":"");d.style.setProperty("--cat",c.c);
    d.innerHTML=`<span class="sn">${c.label}</span><span class="sb" title="${si.cur} / ${si.need} XP"><i style="width:${si.cur/si.need*100}%"></i></span><span class="sl">Nv ${si.l}</span>`;
    box.appendChild(d);
  });
  // Barres du jour : remplies par les actions d'eau et de nourriture, remises à zéro chaque matin
  const bx=$("bars");bx.innerHTML="";const tk=dayKey(Date.now());
  Object.entries(BARS).forEach(([k,B])=>{
    const c=CATS[k],tx=S.log.filter(x=>dayKey(x.t)===tk&&catOf(x)===k).reduce((a,x)=>a+x.xp,0);
    const full=Math.min(B.segs,Math.floor(tx/B.goal*B.segs));
    const shown=B.unit==="verres"?`${Math.min(B.segs,Math.floor(tx/2))} / ${B.segs} verres`:`${tx} / ${B.goal} XP`;
    const el=document.createElement("div");el.className="bar-d";el.dataset.k=k;el.style.setProperty("--cat",c.c);
    el.innerHTML=`<div class="bh"><b>${c.label}</b><small>${tx>=B.goal?B.done:shown} · Nv ${statInfo(S.stats[k]||0).l}</small></div><div class="seg" style="grid-template-columns:repeat(${B.segs},1fr)" role="img" aria-label="${c.label} : ${full} sur ${B.segs}">${Array.from({length:B.segs},(_,i)=>`<i class="${i<full?"on":""}"></i>`).join("")}</div>`;
    {ritRoll();const rt=ritTasks().find(t=>t.bar===k);
     if(rt){const c=Math.min(rt.n,S.daily.c[rt.id]||0),full=c>=rt.n,row=document.createElement("div");row.className="barbtns";
       const bt=document.createElement("button");bt.type="button";bt.className="barbtn"+(full?" full":"");
       bt.textContent=(k==="eau"?"+ Verre ":"+ Repas ")+c+"/"+rt.n;bt.disabled=full;bt.onclick=ev=>{if(k==="eau"){window.__wPrev=c;sfx("glug",c)}ritTap(rt,bt,ev)};row.appendChild(bt);
       if(k==="eau"){el.classList.add("wbar");const prev=window.__wPrev,h=c/rt.n*100,ph=prev!=null?prev/rt.n*100:h;window.__wPrev=null;
         const bo=document.createElement("div");bo.className="wbot"+(full?" full":"")+(prev!=null?" drink":"");bo.innerHTML=`<span class="wcap"></span><span class="wbody"><span class="wliq" style="height:${ph}%"><i class="wwave"></i></span><span class="wgl"></span>${Array.from({length:rt.n-1},(_,i)=>`<em style="bottom:${(i+1)/rt.n*100}%"></em>`).join("")}</span><span class="wdrop"></span>${full?`<span class="wspl"><i></i><i></i><i></i><i></i><i></i></span>`:""}`;
         el.prepend(bo);if(prev!=null)requestAnimationFrame(()=>requestAnimationFrame(()=>{const l=bo.querySelector(".wliq");if(l)l.style.height=h+"%"}));
         if(full&&prev!=null&&prev<rt.n){setTimeout(()=>{sfx("moment");toast("Hydraté ! La bouteille déborde")},450)}}
       if(c){const rs=document.createElement("button");rs.type="button";rs.className="barrs";rs.innerHTML=ICO("reset",16);rs.setAttribute("aria-label","Remettre à zéro");rs.onclick=()=>{S.daily.c[rt.id]=0;save();render()};row.appendChild(rs)}
       el.appendChild(row)}}
    bx.appendChild(el);
  });
}
function toggleStats(){}
$("csTog").onclick=toggleStats;
[["actEdBtn","actEdCard"]].forEach(([b,c])=>{$(b).onclick=()=>{const el=$(c),open=el.hidden;el.hidden=!open;$(b).setAttribute("aria-expanded",open);$(b).innerHTML=ICO(open?"close":"edit",18);if(open)el.scrollIntoView({block:"nearest",behavior:"smooth"})}});
$("charName").addEventListener("change",()=>{const v=$("charName").value.trim().slice(0,14);S.name=v||S.name||"Moi";save();renderChar(levelInfo(S.xp).l)});
function initGroups(){
  const box=$("grpBox");if(!box)return;
  Object.entries(GROUPS).filter(([,G])=>!G.hidden).forEach(([g,G])=>{
    const det=document.createElement("details");det.className="fr";
    det.innerHTML=`<summary>${G.title} · <b id="cnt-${g}">0</b></summary><div class="chips" id="chips-${g}"></div>${G.fixed?"":`<form class="frform" id="form-${g}"><input maxlength="30" placeholder="${G.ph}" aria-label="${G.ph}" required><button class="btn" type="submit">Ajouter</button></form>`}`;
    box.appendChild(det);
    if(!G.fixed)det.querySelector("form").addEventListener("submit",e=>{e.preventDefault();const inp=det.querySelector("input"),n=inp.value.trim();if(!n)return;
      if(!S[G.list].some(x=>x.toLowerCase()===n.toLowerCase()))S[G.list].push(n);inp.value="";ensureGroupQuests();save();render()});
  });
}
function renderGroups(){
  if(!$("grpBox"))return;
  Object.entries(GROUPS).filter(([,G])=>!G.hidden).forEach(([g,G])=>{
    $("cnt-"+g).textContent=S[G.list].length;
    const c=$("chips-"+g);c.innerHTML="";
    S[G.list].forEach(n=>{const done=S[G.done].includes(n);const sp=document.createElement("span");sp.className=done?"done":"";sp.title=done?"Déjà fait ce tour":"";
      const t=document.createElement("em");t.style.fontStyle="normal";t.textContent=n;sp.appendChild(t);if(!G.fixed){sp.style.paddingRight="4px";const b=document.createElement("button");b.type="button";b.innerHTML=ICO("close",12);b.setAttribute("aria-label","Retirer "+n);
      b.onclick=()=>{S[G.list]=S[G.list].filter(x=>x!==n);S[G.done]=S[G.done].filter(x=>x!==n);save();render()};sp.appendChild(b)}else sp.style.padding="2px 10px";c.appendChild(sp)});
  });
}
initGroups();

function dqKind(q){return q.bd?"bd":q.sm?"smart":q.gift?"gift":q.fg?"fgq":q.secret?"secret":q.org?"org":q.sur?"sur":(q.bq||q.bs)?"bq":q.grp||(q.dz||q.dfi?"dz":"")}
const DQ_ORD={gift:-1,fgq:2.7,secret:-.5,org:2.5,sur:0,bq:1,music:2,friends:3,family:4,dz:5,"":6};

