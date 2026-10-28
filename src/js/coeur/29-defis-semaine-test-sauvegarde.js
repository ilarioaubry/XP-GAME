// ---- défis de la semaine
const mondayOf=t=>{const c=dayCut(),d=new Date(+new Date(t));d.setHours(d.getHours()-c);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));d.setHours(c);return d};




function staleFriends(max){
  const now=Date.now(),a=[];
  S.friends.forEach(n=>{const t=S.bondsLast[n];a.push({n,t:t||0,days:t?Math.floor((now-t)/864e5):null})});
  return a.filter(x=>x.days==null||x.days>=30).sort((x,y)=>(x.days==null)-(y.days==null)||(y.days||0)-(x.days||0)).slice(0,max);
}
// Prochain proche : au hasard parmi ceux qu'on n'a pas encore appelés dans ce tour, jamais deux fois de suite le même
function grpXp(g,who){return g==="music"?(who==="avec Octave"?50:35):g==="family"?25:15}
function grpNo(g){const G=S.g;if(!G)return[];if(!G.grpNo||typeof G.grpNo!=="object")G.grpNo={};const m=G.grpNo[g]||{},tk=dayKey(Date.now());Object.keys(m).forEach(n=>{if(m[n]<tk)delete m[n]});G.grpNo[g]=m;return Object.keys(m)}
function grpBlock(q){const G=S.g;grpNo(q.grp);const d=new Date();d.setDate(d.getDate()+30);G.grpNo[q.grp][q.who]=dayKey(d);swapGroup(q);toast(`${esc(q.who)} ne sera plus proposé pour ce type de quête pendant un mois`)}
function groupQuest(g,exceptWho){
  const G=GROUPS[g],list=S[G.list];if(!list.length)return null;
  const no=grpNo(g),ok=n=>!no.includes(n);
  let pool=list.filter(n=>ok(n)&&!S[G.done].includes(n)&&n!==exceptWho);
  if(!pool.length){S[G.done]=[];pool=list.filter(n=>ok(n)&&n!==exceptWho);if(!pool.length)pool=list.filter(ok);if(!pool.length)return null}
  const who=pool[Math.floor(Math.random()*pool.length)];
  return{id:"g"+g+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:G.verb+who,cat:G.cat,xp:grpXp(g,who),grp:g,who};
}
const BD_XP=30;
function ensureBirthdayQuests(){
  const t=new Date();t.setHours(0,0,0,0);const y=t.getFullYear();let added=false;
  const RN=relNames();S.specials=S.specials.filter(q=>{if(!q.bd)return true;if(!RN.includes(q.bd)){added=true;return false}return true});
  RN.forEach(n=>{
    const bd=(S.profiles[n]||{}).bd;if(!bd||!bd.d||!bd.m)return;
    const dt=new Date(y,bd.m-1,bd.d);if(dt.getMonth()!==bd.m-1)return;
    const since=Math.round((t-dt)/864e5);
    if(since<0||since>2||S.bdDone[n]===y||S.specials.some(q=>q.bd===n))return;
    S.specials.unshift({id:"bd"+n+y,name:"Souhaiter l'anniversaire de "+n,cat:isFam(n)?"famille":"social",xp:BD_XP,bd:n});added=true;
  });
  // le jour J, si le cadeau n'est pas acheté : quête du jour
  {const tk=dayKey(t),G=S.g;if(G){if(!Array.isArray(G.gfNo))G.gfNo=[];
    const n0=S.specials.length;S.specials=S.specials.filter(q=>!q.gift||(q.d===tk&&!S.log.some(l=>l.gift===q.gift)));if(S.specials.length!==n0)added=true;
    RN.forEach(n=>{const bd=(S.profiles[n]||{}).bd;if(!bd||!bd.d||!bd.m)return;if(t.getDate()!==bd.d||t.getMonth()!==bd.m-1)return;
      const gk=n+":"+y;if(S.log.some(l=>l.gift===gk)||G.gfNo.includes(gk)||S.specials.some(q=>q.gift===gk))return;
      S.specials.unshift({id:"gf"+n+y,name:"Acheter un cadeau pour "+n,cat:isFam(n)?"famille":"social",xp:GIFT_XP,gift:gk,d:tk});added=true})}}
  return added;
}
function ensureGroupQuests(){
  let added=false;{const seen=new Set();S.specials.forEach(q=>{if(!q.id||seen.has(q.id)){q.id="q"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);added=true}seen.add(q.id)})}
  const tk=dayKey(Date.now()),G=S.g||{};if(!G.dq||G.dq.d!==tk){G.dq={d:tk,done:[]};added=true}
  {const n0=G.dq.done.length;G.dq.done=G.dq.done.filter(x=>!S.specials.some(q=>x.id?q.id===x.id:q.name===x.n));if(G.dq.done.length!==n0)added=true}
  [].forEach(g=>{const cur=S.specials.find(q=>q.grp===g);
    if(cur&&!cur.d){cur.d=tk;added=true}
    if(cur&&cur.d!==tk){const nq=groupQuest(g,cur.who);const i=S.specials.indexOf(cur);if(nq){nq.d=tk;S.specials[i]=nq}else S.specials.splice(i,1);added=true;return}
    if(!cur&&S[GROUPS[g].list].length&&!G.dq.done.some(x=>x.grp===g)){const q=groupQuest(g);if(q){q.d=tk;S.specials.unshift(q);added=true}}});
  return added;
}
// completeSpecial : version complète (ex-réécriture de correctifs.js), completeSpecialBase = le cœur d'origine
function completeSpecial(q,el,ev){if(q&&q.sm){const g=S.g;if(!Array.isArray(g.smHist))g.smHist=[];g.smHist.push({n:q.name,t:Date.now()});g.smHist=g.smHist.slice(-40);
      if(q.who){S.bonds[q.who]=(S.bonds[q.who]||0)+10;S.bondsLast[q.who]=Date.now()}if(q.afk){if(!g.afLast)g.afLast={};g.afLast[q.afk]=Date.now()}
      if(q.lk){const x=(g.last||[]).find(y=>y.id===q.lk);if(x){x.pv=x.d;x.d=dayKey(Date.now())}}if(q.nap){if(!g.nap)g.nap={};const tk=dayKey(Date.now());g.nap[tk]=(g.nap[tk]||0)+q.nap}}return completeSpecialBase.apply(this,arguments)}
function completeSpecialBase(q,el,ev){
  if(q.dz==="cine")filmSeen(q.name,true);
  if(q.lzs)lzGain(q.lzs,q.xp);
  if(q.sur)S.g.surDone=q.sur;if(q.org)S.g.orgDone=q.org;if(q.secret)S.g.secDone=(S.g.secDone||0)+1;
  if(q.fg){const G=S.g;G.fgDone=dayKey(Date.now());if(!G.fgLast)G.fgLast={};G.fgLast[q.fg]=Date.now();G.fgQ=(G.fgQ||0)+1;fgMembers(q.fg).forEach(n=>{S.bondsLast[n]=Date.now();S.bonds[n]=(S.bonds[n]||0)+5})}if(q.bq)S.g.bqDone=q.bq;if(q.bs){S.g.bsDone=q.bs.d;S.g.bsDoneP=dayPer();}
  {const i=S.specials.findIndex(x=>x.id===q.id);let nq=null;
   if(q.grp){const D=GROUPS[q.grp].done;if(!S[D].includes(q.who))S[D].push(q.who)}
   {const tk=dayKey(Date.now());if(!S.g.dq||S.g.dq.d!==tk)S.g.dq={d:tk,done:[]};if(!q.bd)S.g.dq.done.push({p:dayPer()==="matin"?"matin":"soir",id:q.id,n:q.name,xp:q.xp,grp:q.grp||"",k:q.gift?"gift":q.sur?"sur":(q.bq||q.bs)?"bq":q.grp||(q.dz||q.dfi?"dz":"")})}
   if(i>=0){if(nq)S.specials[i]=nq;else S.specials.splice(i,1)}else if(nq)S.specials.push(nq)}
  let bondUp="";
  if(q.grp==="friends"||q.grp==="family"){const pl=bondInfo(S.bonds[q.who]||0).l;S.bonds[q.who]=(S.bonds[q.who]||0)+q.xp;S.bondsLast[q.who]=Date.now();const nl=bondInfo(S.bonds[q.who]).l;if(nl>pl)bondUp=` · ${esc(q.who)} niveau <span class="p">${nl}</span>`}
  if(q.bd){S.bonds[q.bd]=(S.bonds[q.bd]||0)+q.xp;S.bondsLast[q.bd]=Date.now();S.bdDone[q.bd]=new Date().getFullYear()}
  complete(q,el,ev,true,q.grp?{fr:1,who:q.who,g:q.grp}:q.bd?{rel:1,who:q.bd,bd:1}:q.bs?{bsq:1,cb:q.cat,cbs:q.bs.s,cbb:q.bs.b,bn:q.bn}:q.bq?{bq:1}:q.gift?{gift:q.gift}:q.sur?{sur:q.sur,...(q.lzs?{lz:q.lzs+":sur",lzx:q.xp}:{})}:q.dz?{lz:q.dz+":dz",lzx:q.xp,dzq:q.dz}:null);
  toast(`Quête accomplie : <span class="p">${esc(q.name)}</span> +${q.xp} XP${bondUp}`);
}
function swapGroup(q){const i=S.specials.findIndex(x=>x.id===q.id);const nq=groupQuest(q.grp,q.who);if(i<0)return;if(nq){nq.d=q.d||dayKey(Date.now());S.specials[i]=nq;window.__swapId=nq.id}else S.specials.splice(i,1);save();render()}
function floatXp(xp,ev,el){
  const r=el.getBoundingClientRect();const f=document.createElement("div");f.className="float";f.textContent="+"+xp+" XP";
  const fp=window.__tmFloat;f.style.left=(fp?fp.x:(ev&&ev.clientX)||r.left+r.width/2)-30+"px";f.style.top=(fp?fp.y:(ev&&ev.clientY)||r.top)-20+"px";document.body.appendChild(f);setTimeout(()=>f.remove(),1000);
}
let toastT,tq=[],tBusy=false,tLast="";
// Bilan de journée (28/10) : les messages « en passant » ne s'empilent plus, ils sont gardés pour le bilan du soir (S.g.dlog) ; les niveaux s'affichent aussi tout de suite
const TOAST_DIFF=/Lien renforcé|Quête accomplie au passage|Défi d'hier réussi|Objectif du jour atteint|Journée parfaite|Socle tenu|Barre de vie pleine|Nouveau titre|Nouveau record|Objet exclusif|Couché avant minuit|dans les coffres|Case \d+ réussie/i,TOAST_NIV=/niveau <span|Niveau <span/i;
function toastKeep(html){try{const G=S.g;if(!G)return;const tk=dayKey(Date.now());if(!G.dlog||typeof G.dlog!=="object")G.dlog={};const L=G.dlog[tk]=G.dlog[tk]||[];if(!L.includes(html)&&L.length<40)L.push(html);const ks=Object.keys(G.dlog).sort();while(ks.length>7)delete G.dlog[ks.shift()]}catch(e){}}
function toast(html){if(!html||/joker/i.test(html))return;if(TOAST_NIV.test(html))toastKeep(html);else if(TOAST_DIFF.test(html)){toastKeep(html);return}if(html===tLast&&tBusy||tq.includes(html))return;tq.push(html);if(tq.length>4)tq.splice(1,1);if(!tBusy)nextToast()}
function nextToast(){const t=$("toast");clearTimeout(toastT);if(!tq.length){tBusy=false;tLast="";t.classList.remove("show");return}
  tBusy=true;tLast=tq.shift();t.innerHTML=tLast;t.classList.add("show");toastT=setTimeout(()=>{t.classList.remove("show");toastT=setTimeout(nextToast,250)},tq.length?1800:2600)}
$("toast").addEventListener("click",()=>{clearTimeout(toastT);$("toast").classList.remove("show");toastT=setTimeout(nextToast,150)});

$("addCat").innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("");
$("addForm").addEventListener("submit",e=>{e.preventDefault();const name=$("addName").value.trim();if(!name)return;
  S.actions.push({id:"u"+Date.now().toString(36),name,cat:$("addCat").value,xp:+$("addXp").value});$("addName").value="";save();render();toast("Action ajoutée")});


// ---- Mode test (admin) : bac à sable sans sauvegarde
function setTestMode(on){
  if(on===testMode)return;
  if(on){clearTimeout(saveTimer);if(dirty){dirty=false}realSnap=JSON.stringify(snapshot());testMode=true;toast("Mode test activé : rien n'est enregistré")}
  else{testMode=false;clearTimeout(saveTimer);dirty=false;const d=JSON.parse(realSnap);realSnap=null;load(d);toast("Mode test quitté : ta vraie progression est revenue")}
  document.body.classList.toggle("testing",testMode);$("testOn").hidden=testMode;$("testTools").hidden=!testMode;
  let bn=$("testBanner");if(!bn){bn=document.createElement("button");bn.type="button";bn.id="testBanner";bn.className="testbanner";bn.onclick=()=>{showView("s")};document.body.appendChild(bn)}
  bn.innerHTML="<b>MODE TEST</b> · rien n'est enregistré · toucher pour quitter";bn.hidden=!testMode;
  render();
}
$("testOn").onclick=()=>setTestMode(true);$("testOff").onclick=()=>setTestMode(false);
document.querySelectorAll("#testTools [data-t]").forEach(b=>b.onclick=()=>{if(!testMode)return;const t=b.dataset.t,prev=levelInfo(S.xp).l;
  if(t==="xp")addBonus("Test : +100 XP",100);
  if(t==="lvl"){const i=levelInfo(S.xp);addBonus("Test : +1 niveau",i.need-i.cur)}
  if(t==="eur")S.extraMoney=Math.round((S.extraMoney+20)*100)/100;
  if(t==="chest")S.g.chests+=3;if(t==="bchest")S.g.bchests=(S.g.bchests||0)+1;
  if(t==="rit"){ritRoll();ritTasks().forEach(x=>S.daily.c[x.id]=x.n);dailyBonusCheck()}
  if(t==="day"){const back=x=>x-864e5;S.log.forEach(e=>e.t=back(e.t));S.days=S.days.map(k=>{const d=new Date(k+"T12:00");d.setDate(d.getDate()-1);return dayKey(d)});S.daily.day="";S.g.surDone="";S.specials=S.specials.filter(q=>!q.sur)}
  if(t==="skills"){const z=lzState();LZ.forEach(L=>lzGain(L.id,100));const k=S.skills.find(x=>x.name==="Sons");if(k)k.xp+=100}
  if(t==="gear"){S.g.gear=GEAR.map(x=>x.id)}
  if(t==="boost")S.g.boost=Date.now()+3600e3;
  if(t==="all"){const G=S.g,top=RANKS[RANKS.length-1][0]+2;let guard=0;while(levelInfo(S.xp).l<top&&guard++<500){const i=levelInfo(S.xp);S.xp+=i.need-i.cur}
    STAT_KEYS.forEach(k=>{let g2=0;while(statInfo(S.stats[k]||0).l<10&&g2++<200){const i=statInfo(S.stats[k]||0);S.stats[k]=(S.stats[k]||0)+(i.need-i.cur)}});
    const z=lzState();LZ.forEach(L=>{let g3=0;while(skInfo(z.xp[L.id]||0).l<10&&g3++<200){const i=skInfo(z.xp[L.id]||0);z.xp[L.id]=(z.xp[L.id]||0)+(i.need-i.cur)}});
    S.skills.forEach(k=>{let g4=0;while(skInfo(k.xp).l<10&&g4++<200){const i=skInfo(k.xp);k.xp+=i.need-i.cur}});
    G.gear=GEAR.map(x=>x.id);
    G.rt=[...new Set([...G.rt,...RARE_TITLES,...LZ.map(L=>L.t),...Object.values(CAT_RW).map(x=>x[0])])];
    G.chests+=5;
    badgeDefs().forEach(b=>{if(!S.badges[b.id])S.badges[b.id]=Date.now()});G.nb=[];
    save();render();toast("Test : tout est débloqué");return}
  save();render(prev);toast("Test : "+b.textContent)});

// ---- Sauvegarde : stockage local du téléphone (clé « carnet-quetes ») ----
function snapshot(){return{xp:S.xp,actions:S.actions,log:S.log,days:S.days,perLevel:S.perLevel,qPrice:S.qPrice,xpCap:S.xpCap,rankBonus:S.rankBonus,wishes:S.wishes,spent:S.spent.slice(-300),stats:S.stats,name:S.name,specials:S.specials,friends:S.friends,friendDone:S.friendDone,family:S.family,familyDone:S.familyDone,musicDone:S.musicDone,snd:S.snd,bonds:S.bonds,bondsLast:S.bondsLast,profiles:S.profiles,myPic:S.myPic,dayLimit:S.dayLimit,streakBonus:S.streakBonus,weekly:S.weekly,skills:S.skills,epics:S.epics,title:S.title,frame:S.frame,bdDone:S.bdDone,theme:S.theme,daily:S.daily,seeded:S.seeded,extraMoney:S.extraMoney,dayBonus:S.dayBonus,badges:S.badges,badgesInit:S.badgesInit,g:S.g,v:28}}
function save(){dirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(flush,400)}
let testMode=false,realSnap=null;
async function flush(){
  if(testMode){dirty=false;clearTimeout(saveTimer);return}
  if(!dirty)return;dirty=false;
  {try{localStorage.setItem("carnet-quetes",JSON.stringify(snapshot()));$("sync").textContent="Enregistré sur ce téléphone"}catch(e){$("sync").textContent="Non enregistré"}}
}
function migrateActions(d){
  let acts=Array.isArray(d.actions)?d.actions.map(a=>({...a})):STARTER.map(a=>({...a}));
  if((d.v||1)<3&&Array.isArray(d.actions)){
    // v3 : remplace l'eau (s0) et le sport (s1) par des micro-actions, sans toucher aux autres actions
    acts=acts.filter(a=>a.id!=="s0"&&a.id!=="s1");
    acts=[...MICRO.map(a=>({...a})),...acts];
  }
  if((d.v||1)<4&&Array.isArray(d.actions)){
    // v4 : ajoute les objectifs perso (musique, dossier) en tête de liste
    acts=[...PERSO.map(a=>({...a})),...acts.filter(a=>!a.id.startsWith("p"))];
  }
  if((d.v||1)<6&&Array.isArray(d.actions)){
    // v6 : le sport devient la Force, la bonne bouffe a sa barre de Nourriture
    acts=acts.map(a=>SPORT_IDS.includes(a.id)?{...a,cat:"sport"}:a.id==="s17"?{...a,cat:"nourriture"}:a);
    acts=[...NOURRITURE.map(a=>({...a})),...acts.filter(a=>!a.id.startsWith("n"))];
  }
  // v8 : « Appeler papa / maman » deviennent des quêtes spéciales, plus des actions de la liste
  acts=acts.filter(a=>a.id!=="f0"&&a.id!=="f1");
  if((d.v||1)<9&&Array.isArray(d.actions)){
    // v9 : retire cinq actions que tu ne voulais plus (déchet, asso, merci, aider, grignotage)
    acts=acts.filter(a=>!["s13","s9","s6","s5","n3"].includes(a.id));
  }
  if((d.v||1)<14&&Array.isArray(d.actions)){
    // v14 : nouvelles catégories (Planète supprimée, Eau en barre à part, Les autres → Ami)
    acts=acts.map(a=>{let cat=a.cat;
      if(a.id==="m0"||a.name==="1 verre d'eau")cat="eau";
      else if(a.name==="Trajet à pied ou à vélo")cat="sport";
      else if(a.name==="Repas végétarien")cat="nourriture";
      return{...a,cat}});
  }
  acts=acts.map(a=>{let cat=REMAP[a.cat]||a.cat;if(!CATS[cat])cat="soi";return cat===a.cat?a:{...a,cat}});
  if((d.v||1)<15&&Array.isArray(d.actions)&&!acts.some(a=>a.id==="h0"||a.name==="Se brosser les dents")){
    // v15 : ajoute « Se brosser les dents » en Hygiène
    const i=acts.findIndex(a=>a.cat==="maison");acts.splice(i>=0?i:acts.length,0,...HYGIENE.map(a=>({...a})));
  }
  if((d.v||1)<13&&Array.isArray(d.actions)){
    // v13 : « Appeler un proche » est remplacé par les quêtes spéciales famille et amis
    acts=acts.filter(a=>a.name!=="Appeler un proche");
  }
  return acts;
}
function load(d){if(!d)return;loadCore(d);if(typeof runMig==="function")runMig();if(S.g&&!S.g.onb&&(S.xp>0||S.log.length))S.g.onb=1;if(S.g&&S.g.onb){const o=document.querySelector(".obd");if(o)o.remove()}}
function loadCore(d){S={xp:+d.xp||0,actions:migrateActions(d),log:Array.isArray(d.log)?d.log.map(e=>({...e})):[],days:Array.isArray(d.days)?[...d.days]:[],
  perLevel:typeof d.perLevel==="number"?d.perLevel:1,qPrice:typeof d.qPrice==="number"?d.qPrice:1,xpCap:typeof d.xpCap==="number"?d.xpCap:300,rankBonus:typeof d.rankBonus==="number"?d.rankBonus:5,
  wishes:Array.isArray(d.wishes)?d.wishes.map(w=>({...w})):STARTER_WISHES.map(w=>({...w})),spent:Array.isArray(d.spent)?d.spent.map(s=>({...s})):[],
  myPic:typeof d.myPic==="string"?d.myPic:"",
  daily:d.daily&&typeof d.daily==="object"?{tasks:Array.isArray(d.daily.tasks)?d.daily.tasks.map(x=>({...x})):null,day:String(d.daily.day||""),c:{...(d.daily.c||{})},wAdded:!!d.daily.wAdded,bonusDay:String(d.daily.bonusDay||"")}:{tasks:null,day:"",c:{},wAdded:false,bonusDay:""},
  g:normG(d.g),badges:d.badges&&typeof d.badges==="object"?{...d.badges}:{},badgesInit:!!d.badgesInit,
  extraMoney:typeof d.extraMoney==="number"?d.extraMoney:0,dayBonus:d.dayBonus&&typeof d.dayBonus.xp==="number"?{xp:d.dayBonus.xp,eur:+d.dayBonus.eur||0}:{xp:30,eur:1},
  seeded:Array.isArray(d.seeded)?[...d.seeded]:[],
  theme:["auto","light","dark"].includes(d.theme)?d.theme:"auto",
  bdDone:d.bdDone&&typeof d.bdDone==="object"?{...d.bdDone}:{},
  skills:Array.isArray(d.skills)?d.skills.map(x=>({...x})):[],epics:Array.isArray(d.epics)?d.epics.map(x=>({...x,steps:(x.steps||[]).map(t=>({...t}))})):[],title:typeof d.title==="string"?d.title:"",frame:typeof d.frame==="string"?d.frame:"",
  dayLimit:typeof d.dayLimit==="number"?d.dayLimit:3,streakBonus:d.streakBonus&&typeof d.streakBonus==="object"?{...d.streakBonus}:{},weekly:d.weekly&&typeof d.weekly==="object"&&Array.isArray(d.weekly.done)?{wk:String(d.weekly.wk||""),done:[...d.weekly.done]}:{wk:"",done:[]},
  profiles:d.profiles&&typeof d.profiles==="object"?JSON.parse(JSON.stringify(d.profiles)):{},
  bonds:d.bonds&&typeof d.bonds==="object"?{...d.bonds}:{},bondsLast:d.bondsLast&&typeof d.bondsLast==="object"?{...d.bondsLast}:{},
  stats:d.stats&&typeof d.stats==="object"?{...d.stats}:{},specials:Array.isArray(d.specials)?d.specials.filter(q=>(d.v||1)>=11||(q.id!=="f0"&&q.id!=="f1")).map(q=>q.friend?{id:q.id,name:q.name,cat:q.cat,xp:q.xp,grp:"friends",who:q.who}:{...q}):[],friends:Array.isArray(d.friends)?[...d.friends]:FRIENDS.slice(),friendDone:Array.isArray(d.friendDone)?[...d.friendDone]:[],family:Array.isArray(d.family)?[...d.family]:FAMILY.slice(),familyDone:Array.isArray(d.familyDone)?[...d.familyDone]:[],snd:d.snd&&typeof d.snd==="object"?{...d.snd}:{},music:(d.g&&Array.isArray(d.g.music))?[...d.g.music]:MUSIC.slice(),musicDone:Array.isArray(d.musicDone)?[...d.musicDone]:[],name:typeof d.name==="string"&&d.name?d.name:"Ilar"};
  // Sauvegardes d'avant les caractéristiques : on reconstruit les stats depuis le journal
  if(!d.bonds){S.log.forEach(e=>{if((e.fr&&(e.g||"friends")==="friends")||e.rel){S.bonds[e.who]=(S.bonds[e.who]||0)+e.xp;S.bondsLast[e.who]=Math.max(S.bondsLast[e.who]||0,e.t)}})}
  if((d.v||1)<18){ // Octave rejoint la liste ; Adeline et Octave reçoivent le badge Meilleur ami
    if(!S.friends.includes("Octave"))S.friends.push("Octave");
    ["Adeline","Octave"].forEach(n=>{const P=S.profiles[n]=S.profiles[n]||{};if(P.best==null)P.best=true});
  }
  if(ensureGroupQuests())save();
  if(!d.stats)S.stats=deriveStats();
  S.specials.forEach(q=>{const c=REMAP[q.cat]||q.cat;q.cat=CATS[c]&&!BARS[c]?c:"soi"});
  if((d.v||1)<14){ // XP déjà gagné : on le range dans les nouvelles catégories
    S.log.forEach(e=>{
      const a=S.actions.find(x=>x.id===e.a);
      let nc=(e.a==="m0"||e.name==="1 verre d'eau")?"eau":a?a.cat:(REMAP[e.cat]||e.cat);
      if(!CATS[nc])nc="soi";
      if(e.cat!==nc){if(S.stats[e.cat]!=null)S.stats[e.cat]=Math.max(0,S.stats[e.cat]-e.xp);S.stats[nc]=(S.stats[nc]||0)+e.xp;e.cat=nc}
    });
    Object.keys(S.stats).forEach(k=>{if(!CATS[k]){const t=REMAP[k]||"soi";S.stats[t]=(S.stats[t]||0)+S.stats[k];delete S.stats[k]}});
  }
  if((d.v||1)<12){ // les quêtes amis/famille passent de « Les autres » à Social/Famille, avec leur XP
    S.specials.forEach(q=>{if(q.grp)q.cat=GROUPS[q.grp].cat});
    S.log.forEach(e=>{if(e.fr){const nc=GROUPS[e.g||"friends"].cat;if(e.cat!==nc){if(S.stats[e.cat]!=null)S.stats[e.cat]=Math.max(0,S.stats[e.cat]-e.xp);S.stats[nc]=(S.stats[nc]||0)+e.xp;e.cat=nc}}});
  }
  if((d.v||1)<6){ // recatégorise le journal avec les nouvelles catégories et recalcule les stats
    S.log.forEach(e=>{const a=S.actions.find(x=>x.id===e.a);if(a)e.cat=a.cat});
    S.stats=deriveStats();
  }}

try{const raw=localStorage.getItem("carnet-quetes");if(raw){window.__hadLocal=1;load(JSON.parse(raw))}}catch(e){}
if(ensureGroupQuests())save();
render();if(location.hash==="#boutique"){subs.c="wr"}showView(location.hash==="#boutique"?"c":location.hash==="#reglages"?"s":/^#(profil|collection)$/.test(location.hash)?"c":location.hash==="#relations"?"r":"q",true);$("sync").textContent="Enregistré sur ce téléphone";

// données enregistrées sur ce téléphone (stockage local) ; premier lancement : création du profil
if(!window.__hadLocal)obStart();
try{$("sync").textContent="Enregistré sur ce téléphone"}catch(e){}
