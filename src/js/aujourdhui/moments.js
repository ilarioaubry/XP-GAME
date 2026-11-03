// Moments de la vraie vie (lot 5, 03/11) : heure dorée de la semaine (5.2), fêtes du calendrier, mon anniversaire,
// anniversaire du carnet (5.4), défi éclair et ciel réel (5.5). Chaque surprise demande un vrai geste ; rien n'est tiré
// au hasard sans action. Appelé par gameTick (momentsTick) ; l'XP double passe par completeBase (momentX2).
DQ_K.fete=["Fête du jour","#e0447a",""];DQ_K.ecl=["Défi éclair","#f0b73d",""];DQ_K.ciel=["Ciel du jour","#5b6ee1",""];
DQ_ORD.ecl=-.8;DQ_ORD.fete=-.6;DQ_ORD.ciel=-.3;
const MM_JOURS=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const mmRnd=s=>{let x=0;for(const c of String(s))x=(x*31+c.charCodeAt(0))%2147483647;return()=>{x=(x*16807)%2147483647;return x/2147483647}};
const dKey=d=>dayKey(d.getTime());

// ---- 5.2 heure dorée de la semaine : annoncée en début de semaine, 1 h, un domaine, XP ×2 sur ce domaine
function monOf(t){const d=new Date(dayKey(t)+"T12:00");d.setDate(d.getDate()-((d.getDay()+6)%7));return dKey(d)}
function goldWeek(){const G=S.g;if(!G)return null;const now=Date.now(),wk=monOf(now);
  if(G.gold&&G.gold.w===wk)return G.gold;
  const r=mmRnd("gold"+wk),today=new Date(dayKey(now)+"T12:00"),left=[];for(let i=0;i<7;i++){const d=new Date(wk+"T12:00");d.setDate(d.getDate()+i);if(d>=today)left.push(dKey(d))}
  const cats=PAL_CATS.slice().sort((a,b)=>catLv(a)-catLv(b)).slice(0,3),c=cats[Math.floor(r()*cats.length)];
  let d=left[Math.floor(r()*left.length)],h=10+Math.floor(r()*11);
  if(d===dayKey(now)&&h<=new Date().getHours()+1){if(left.length>1)d=left[1+Math.floor(r()*(left.length-1))];else h=Math.min(21,new Date().getHours()+2)}
  for(let k=0;k<12&&typeof inWork==="function"&&d===dayKey(now)&&inWork(h);k++)h=h>=20?10:h+1;
  G.gold={w:wk,d,h,c};save();return G.gold}
function goldOn(c){const g=S.g&&S.g.gold;if(!g||g.d!==dayKey(Date.now()))return false;const h=new Date().getHours();return h===g.h&&(!c||g.c===c)}
function goldTxt(){const g=goldWeek();if(!g)return"";const now=Date.now(),tk=dayKey(now),hh=new Date().getHours();if(g.d<tk||(g.d===tk&&hh>g.h))return"";
  const lab=(CATS[g.c]||{}).label||g.c;if(goldOn())return`Heure dorée en cours : XP ×2 sur ${lab} jusqu'à ${g.h+1} h`;
  const dj=g.d===tk?"aujourd'hui":g.d===dayKey(now+864e5)?"demain":MM_JOURS[new Date(g.d+"T12:00").getDay()];return`Heure dorée : ${dj} ${g.h} h–${g.h+1} h · ${lab} ×2`}

// ---- 5.4 mon anniversaire : XP ×2 toute la journée et un coffre doré
function myBdToday(){try{const s=sitOf();const b=s&&s.bd;if(!b||!b.d||!b.m)return false;const n=new Date();return n.getDate()===b.d&&n.getMonth()+1===b.m}catch(e){return false}}
function momentX2(c){return goldOn(c)||myBdToday()}
// anniversaire du carnet : le jour de ta première action, chaque année
function carnetStart(){let t=Infinity;(S.days||[]).forEach(k=>{const x=Date.parse(k+"T12:00");if(x<t)t=x});(S.log||[]).forEach(e=>{if(e.t<t)t=e.t});return isFinite(t)?t:null}

// ---- 5.4 fêtes du vrai calendrier
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da,12)}
function nthSun(y,m,n){const d=new Date(y,m,1,12);d.setDate(1+((7-d.getDay())%7)+7*(n-1));return d}
function lastSun(y,m){const d=new Date(y,m+1,0,12);d.setDate(d.getDate()-d.getDay());return d}
function fetesOf(y){const md=(m,d)=>dKey(new Date(y,m-1,d,12)),pent=easter(y);pent.setDate(pent.getDate()+49);let meres=lastSun(y,4);if(dKey(meres)===dKey(pent))meres.setDate(meres.getDate()+7);
  return[[md(2,2),"chandeleur","Chandeleur","Faire des crêpes, seul ou à plusieurs","nourriture",10],
    [md(2,14),"valentin","Saint-Valentin","Dire à quelqu'un que tu tiens à lui","social",10],
    [md(3,20),"printemps","Premier jour du printemps","Ouvrir grand les fenêtres et commencer un petit ménage de printemps","maison",15],
    [md(5,1),"muguet","1er mai","Offrir un brin de muguet ou un petit mot à quelqu'un","social",10],
    [dKey(meres),"meres","Fête des mères","Un mot pour ta mère, ou pour une personne qui compte comme elle","famille",15],
    [dKey(nthSun(y,5,3)),"peres","Fête des pères","Un mot pour ton père, ou pour une personne qui compte comme lui","famille",15],
    [md(6,21),"musique","Fête de la musique","Aller écouter de la musique dehors, ou en jouer","perso",15],
    [md(9,22),"automne","Premier jour de l'automne","Une balade pour voir les couleurs de l'automne","soi",15],
    [md(11,13),"gentil","Journée de la gentillesse","Faire un geste gentil pour quelqu'un, sans rien attendre","social",15],
    [md(12,21),"hiver","Solstice d'hiver","Le jour le plus court : 15 min dehors à la lumière","soi",10]]}

// ---- 5.5 ciel réel : pleine lune, pluies d'étoiles, première neige, premier beau jour
function moonAge(t){return(((t-Date.UTC(2000,0,6,18,14))/864e5)%29.530588853+29.530588853)%29.530588853}
const MM_STARS=[[1,3,"Quadrantides"],[4,22,"Lyrides"],[8,12,"Perséides"],[10,21,"Orionides"],[12,14,"Géminides"]];
function skyToday(){const now=new Date(),h=dayH(),G=S.g,y=now.getFullYear(),out=[];
  if(h>=19&&Math.abs(moonAge(Date.now())-14.77)<1)out.push(["lune","Pleine lune : lever les yeux 2 min","soi",5]);
  {const sh=MM_STARS.find(([m,d])=>now.getMonth()+1===m&&now.getDate()===d);if(sh&&(h>=21))out.push(["etoiles"+sh[2],`Pluie d'étoiles (${sh[2]}) : 5 min à regarder le ciel, loin des lumières`,"soi",5])}
  const wx=typeof wxNow==="function"?wxNow():null,sky=G.sky||(G.sky={}),season=now.getMonth()>=6?y:y-1;
  if(wx&&wx.k==="snow"&&sky.neige!==season)out.push(["neige","Première neige : sortir 5 min la voir tomber","soi",5,()=>{sky.neige=season}]);
  if(wx&&(wx.k==="clear"||wx.k==="partly")&&wx.day&&wx.tc>=18&&now.getMonth()>=2&&now.getMonth()<=5&&sky.beau!==y)out.push(["beau","Premier beau jour : 15 min dehors au soleil","soi",5,()=>{sky.beau=y}]);
  return out}

// ---- 5.5 défi éclair : une heure différente chaque jour, 2 à 5 min, 5 XP, visible seulement pendant cette heure
const ECL=[["Boire un grand verre d'eau","eau"],["Ranger 5 objets qui traînent","maison"],["10 respirations lentes","soi"],["Envoyer un merci à quelqu'un","social"],["10 squats","sport"],["Étirer ton dos 2 min","sport"],["Noter une idée qui te trotte dans la tête","perso"],["Ouvrir la fenêtre 2 min","soi"],["Jeter 3 choses inutiles","maison"],["Arroser une plante ou vider une poubelle","maison"],["Envoyer une photo à ta famille","famille"],["Lever les yeux de l'écran et regarder au loin 1 min","soi"],["Vider l'évier ou le lave-vaisselle","maison"],["Écrire ce qui te ferait plaisir ce week-end","soi"],["Marcher 2 min, même dans ton couloir","sport"],["Dire bonjour à un voisin ou un collègue","social"],["Fredonner ou jouer 2 min de musique","perso"],["Ranger ton bureau en 3 min","travail"],["Répondre à un message en attente","social"],["Manger un fruit","nourriture"]];
function eclToday(){const tk=dayKey(Date.now()),r=mmRnd("ecl"+tk);const h=9+Math.floor(r()*12),it=ECL[Math.floor(r()*ECL.length)];return{h,it}}

// ---- tick : ajoute / retire les quêtes du jour, annonce l'anniversaire
function momentsTick(){const G=S.g;if(!G||!Array.isArray(S.specials))return false;const tk=dayKey(Date.now()),hh=new Date().getHours();let ch=false;
  try{goldWeek()}catch(e){}
  // fêtes
  {const n0=S.specials.length;S.specials=S.specials.filter(q=>!q.fete||q.fete===tk);if(S.specials.length!==n0)ch=true;
   const L=fetesOf(new Date().getFullYear()).filter(f=>f[0]===tk);if(L.length&&G.fete!==tk){G.fete=tk;L.forEach(F=>S.specials.unshift({id:"fete"+tk+F[1],name:F[2]+" : "+F[3],cat:F[4],xp:F[5],fete:tk}));ch=true}}
  // défi éclair
  {const E=eclToday(),n0=S.specials.length;S.specials=S.specials.filter(q=>!q.ecl||(q.ecl===tk&&hh<q.until));if(S.specials.length!==n0)ch=true;
   if(hh===E.h&&(!G.ecl||G.ecl.d!==tk)){G.ecl={d:tk};S.specials.unshift({id:"ecl"+tk,name:E.it[0],cat:E.it[1],xp:5,ecl:tk,until:E.h+1});ch=true}}
  // ciel
  {const n0=S.specials.length;S.specials=S.specials.filter(q=>!q.ciel||q.ciel===tk);if(S.specials.length!==n0)ch=true;
   if(!G.cielD||G.cielD.d!==tk)G.cielD={d:tk,k:[]};
   skyToday().forEach(([k,name,cat,xp,mark])=>{if(G.cielD.k.includes(k))return;G.cielD.k.push(k);if(mark)mark();S.specials.unshift({id:"ciel"+tk+k,name,cat,xp,ciel:tk});ch=true})}
  // mon anniversaire : un coffre doré et XP ×2 toute la journée
  if(myBdToday()&&G.myBd!==tk){G.myBd=tk;G.bchests=(G.bchests||0)+1;ch=true;setTimeout(()=>mmPop("cake","Joyeux anniversaire !",["XP ×2 toute la journée","Un coffre doré (objet épique garanti)"]),900)}
  // anniversaire du carnet
  {const t0=carnetStart();if(t0){const d0=new Date(t0),n=new Date(),yrs=n.getFullYear()-d0.getFullYear();
    if(yrs>=1&&n.getMonth()===d0.getMonth()&&n.getDate()===d0.getDate()&&G.carnetY!==n.getFullYear()){G.carnetY=n.getFullYear();G.chests=(G.chests||0)+1;ch=true;
      const from=dayKey(Date.now()-365*864e5),H=G.hist||{},K=Object.keys(H).filter(k=>k>=from),xp=K.reduce((a,k)=>a+((H[k]||{}).x||0),0);
      setTimeout(()=>mmPop("etoile",yrs>1?`${yrs} ans de carnet`:"Un an de carnet",[`${K.length} jours actifs cette année`,`${xp.toLocaleString("fr-FR")} XP gagnés`,`Niveau ${levelInfo(S.xp).l} · ${relNames().length} proches`,"Un coffre pour fêter ça"]),1200)}}}
  return ch}
function mmPop(ic,title,lines){if(document.querySelector(".mmpop"))return;const v=document.createElement("div");v.className="ui-voile mmpop palpop";v.setAttribute("role","dialog");v.setAttribute("aria-modal","true");v.setAttribute("aria-label",title);
  v.innerHTML=`<div class="ui-fenetre palw"><div class="palg"><span class="palic">${rkSvg(ic)}</span><h2 class="ui-fenetre__titre"></h2><ul class="pall">${lines.map(l=>`<li><span class="pali">${rkSvg("etoile")}</span><span></span></li>`).join("")}</ul></div><button type="button" class="ui-btn ui-btn--principal palok">Merci</button></div>`;
  v.querySelector("h2").textContent=title;v.querySelectorAll(".pall li span:last-child").forEach((s,i)=>s.textContent=lines[i]);
  const close=()=>v.remove();v.onclick=e=>{if(e.target===v)close()};v.querySelector(".palok").onclick=close;document.body.appendChild(v);try{sfx("level")}catch(_){}}
