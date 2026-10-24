// ---- Ajouts de contenu (une seule fois par appareil/compte)
function seed11(){if(!S.g||S.seeded.includes("s11"))return false;S.seeded.push("s11");
  Object.values(S.profiles||{}).forEach(P=>{if(P&&P.pic&&!P.avc)delete P.pic});
  if(S.myPic&&!S.g.avc)S.myPic=null;return true}
function seed12(){if(!S.g||S.seeded.includes("s12"))return false;S.seeded.push("s12");
  // nouvelle économie : l'argent vient surtout des qualités. Le solde actuel ne baisse pas.
  if(S.perLevel===2&&S.rankBonus===10){const l=levelInfo(S.xp).l,before=earnedAt(l)-qualityLevels()*(S.qPrice||0)+0;const oldE=(l-1)*2+RANKS.filter(([m])=>m>1&&l>=m).length*10;
    S.perLevel=1;S.rankBonus=5;if(typeof S.qPrice!=="number")S.qPrice=1;const newE=earnedAt(l);if(oldE>newE)S.extraMoney=Math.round((S.extraMoney+oldE-newE)*100)/100}
  return true}
function seed17(){if(S.seeded.includes("s17"))return false;S.seeded.push("s17");S.specials.forEach(q=>{if(q.name==="Te lever à la première alarme"){q.name="Cuisiner un vrai repas maison";q.cat="nourriture";q.xp=30}if(q.name==="10 min sans écran au réveil")q.name="20 min de marche dehors"});return true}
const RD_REN=JSON.parse('{"Lire 10 pages au lit": "Lire au lit", "Lire 10 pages": "Lire", "Lire 15 pages": "Lire", "Lire 20 pages": "Lire", "Lire 30 pages": "Lire", "Lire les 20 premières pages": "Commencer le livre"}');
const XPE=x=>x<=5?3:x<=15?10:x<=25?20:35;
const XP_NEW={"Avancer sur le dossier (30 min)":20,"1 h de travail concentré":35,"Finir une tâche importante":20,"10 min de marche rapide":10,"5 min d'étirements":3,"1 min de gainage":3,"20 squats":3,"Trajet à pied ou à vélo":10,"Méditer 10 min":10,"Ranger 10 min":10,"Faire la vaisselle":10,"Faire une lessive":10,"Changer les draps":10,"Faire du son (1 h)":35,"Écrire un couplet":20,"Écouter un album en entier":20,"Se brosser les dents":3,"10 pompes":3,"1 verre d'eau":3,"Cuisiner un vrai repas":20,"Faire un masque pour le visage":10,"Préparer mon repas du lendemain":10,"Une journée sans soda":10,"Repas végétarien":10,"Se coucher avant minuit":10};
const XP_TABLE={"Avancer sur le dossier (30 min)":30,"1 h de travail concentré":60,"Finir une tâche importante":30,"10 min de marche rapide":10,"5 min d'étirements":5,"1 min de gainage":5,"20 squats":5,"Trajet à pied ou à vélo":15,"Méditer 10 min":10,"Ranger 10 min":10,"Faire la vaisselle":10,"Faire une lessive":15,"Changer les draps":15,"Faire du son (1 h)":60,"Écrire un couplet":15,"Écouter un album en entier":10,"Se brosser les dents":3,"10 pompes":5,"1 verre d'eau":2};
function seed26(){if(S.seeded.includes("s26"))return false;S.seeded.push("s26");
  S.actions.forEach(a=>{const old=XP_TABLE[a.name]!=null?XP_TABLE[a.name]:durOf(a.name)?Math.max(5,durOf(a.name)):null;if(XP_NEW[a.name]!=null&&(old==null||a.xp===old||a.xp===({"Cuisiner un vrai repas":25,"Faire un masque pour le visage":15,"Préparer mon repas du lendemain":15,"Une journée sans soda":15,"Repas végétarien":10,"Se coucher avant minuit":10})[a.name]))a.xp=XP_NEW[a.name];else if(XP_NEW[a.name]==null&&![3,10,20,35].includes(a.xp))a.xp=XPE(a.xp|0);
    if(a.name==="Méditer 10 min")a.cat="soi";if(a.name==="Se brosser les dents")a.cat="soi"});
  const G=S.g;if(G&&G.cb)Object.values(G.cb).forEach(st=>{if(st&&Array.isArray(st.s))st.s=st.s.map(t=>BOSS_FIX_TXT[t]||t)});return true}
const BOSS_FIX_TXT={"Chercher une nouvelle coque":"Nettoyer l'écran et la coque","Laver les draps":"Ranger les vêtements de l'autre saison","Réserver le lieu de la sortie":"Choisir le lieu de la sortie","Lire":"Lire 10 pages","Écrire 3 choses positives":"Téléphone dans une autre pièce pendant 1 h"};
function seed25(){if(S.seeded.includes("s25"))return false;S.seeded.push("s25");(S.specials||[]).forEach(q=>{if(q.grp==="family"||q.grp==="friends")q.xp=Math.max(q.xp||0,grpXp(q.grp,q.who))});return true}
function seed24(){if(S.seeded.includes("s24"))return false;S.seeded.push("s24");const T=ritTasks();if(!T.some(t=>/raser/i.test(t.name)))T.push({id:"rbarbe",name:"Se raser la barbe",n:1,when:"matin",ev:3,ct:Date.now()});return true}
function seed23(){if(S.seeded.includes("s23"))return false;S.seeded.push("s23");if(!S.actions.some(a=>a.name==="Faire un masque pour le visage"))S.actions.push({id:"fm"+Date.now().toString(36),name:"Faire un masque pour le visage",cat:"soi",xp:15});return true}
function seed22(){if(S.seeded.includes("s22"))return false;S.seeded.push("s22");S.actions.forEach(a=>{if(XP_TABLE[a.name]!=null)a.xp=XP_TABLE[a.name];else{const m=durOf(a.name);if(m)a.xp=Math.max(5,m)}});return true}
function seed21(){if(S.seeded.includes("s21"))return false;S.seeded.push("s21");S.actions.forEach(a=>{if(/^méditer/i.test(a.name))a.cat="sport"});return true}
function seed20(){if(S.seeded.includes("s20"))return false;S.seeded.push("s20");const f=n=>RD_REN[n]||n;
  S.actions.forEach(a=>{a.name=f(a.name)});S.specials.forEach(q=>{q.name=f(q.name)});ritTasks().forEach(t=>{t.name=f(t.name);if(t.link)t.link=f(t.link)});
  if(S.g&&S.g.cb)Object.values(S.g.cb).forEach(st=>{if(Array.isArray(st.s))st.s=st.s.map(f)});
  {const seen=new Set();S.actions=S.actions.filter(a=>{if(a.name!=="Lire")return true;if(seen.has(a.name))return false;seen.add(a.name);return true})}
  return true}
function seed19(){if(S.seeded.includes("s19"))return false;S.seeded.push("s19");
  const ORD={matin:["Faire mon lit","Ouvrir la fenêtre","Prendre ma douche","Brossage de dents","Se laver le visage","Pompes"],soir:["Se laver le visage","Brossage de dents"]};
  const L=ritTasks(),rank=t=>{if(t.bar)return 900;const o=ORD[ritPer(t)]||[],i=o.indexOf(t.name);return(ritPer(t)==="matin"?0:100)+(i<0?50:i)};
  const s2=L.map((t,i)=>[t,i]).sort((a,b)=>rank(a[0])-rank(b[0])||a[1]-b[1]).map(x=>x[0]);L.splice(0,L.length,...s2);return true}
function seed18(){if(S.seeded.includes("s18"))return false;S.seeded.push("s18");
  const ORD={matin:["Prendre ma douche","Brossage de dents","Se laver le visage","Faire mon lit","Ouvrir la fenêtre","Pompes"],soir:["Se laver le visage","Brossage de dents"]};
  const L=ritTasks(),rank=t=>{if(t.bar)return 900;const o=ORD[ritPer(t)]||[],i=o.indexOf(t.name);return(ritPer(t)==="matin"?0:100)+(i<0?50:i)};
  const s2=L.map((t,i)=>[t,i]).sort((a,b)=>rank(a[0])-rank(b[0])||a[1]-b[1]).map(x=>x[0]);L.splice(0,L.length,...s2);return true}
function seed16(){if(!S.g||S.seeded.includes("s16"))return false;S.seeded.push("s16");S.myPic="";if(!S.g.avc)S.g.avc={...AV_DEF};Object.values(S.profiles||{}).forEach(P=>{if(P&&P.pic&&!P.avc)delete P.pic});return true}
function seed15(){if(!S.g||S.seeded.includes("s15"))return false;S.seeded.push("s15");const G=S.g;
  G.gear=[...new Set(G.gear.filter(id=>gearOf(id)))];
  const c={...AV_DEF,...(G.avc||{})};GEAR.forEach(x=>{if(x.k&&(c[x.k]|0)===x.o&&!G.gear.includes(x.id))G.gear.push(x.id)});if((c.bijou|0)===3&&!G.gear.includes("chain"))G.gear.push("chain");
  Object.entries(STREAK_IT).forEach(([m,id])=>{if(S.streakBonus&&S.streakBonus[m]&&!G.gear.includes(id))G.gear.push(id)});
  if(G.chests>3)G.chests=3;return true}
function seed14(){if(S.seeded.includes("s14"))return false;S.seeded.push("s14");ritTasks().forEach(t=>{if(!t.bar&&(t.when||"jour")==="jour")t.when="matin"});return true}
function seed13(){if(S.seeded.includes("s13"))return false;S.seeded.push("s13");S.actions.forEach(a=>{if(a.name==="Écouter un album en entier")a.cat="soi"});return true}
function seedOnce(){const a=seed1(),b=seed2(),c=seed3(),d=seed4(),e=seed6(),f=seed7(),g=seed8(),h=seed9(),i=seed10(),j=seed11(),k=seed12(),l=seed13(),m=seed14(),n=seed15(),o=seed16(),p2=seed17(),p3=seed18(),p4=seed19(),p5=seed20(),p6=seed21(),p7=seed22();seed23();seed24();seed25();const p8=seed26();return a||b||c||d||e||f||g||h||i||j||k||l||m||n||o||p2||p3||p4||p5||p6||p7||p8}
function seed10(){if(S.seeded.includes("s10"))return false;S.seeded.push("s10");S.actions.forEach(a=>{if(/dossier/i.test(a.name))a.cat="travail"});[["1 h de travail concentré",25],["Finir une tâche importante",20]].forEach(([name,xp],i)=>{if(!S.actions.some(a=>a.name===name))S.actions.push({id:"w"+i+Date.now().toString(36),name,cat:"travail",xp})});return true}
function seed9(){if(S.seeded.includes("s9"))return false;S.seeded.push("s9");S.actions=S.actions.filter(a=>!/compliment/i.test(a.name));S.specials=S.specials.filter(q=>!/compliment/i.test(q.name));return true}
function seed8(){
  if(S.seeded.includes("s8"))return false;S.seeded.push("s8");
  S.actions=S.actions.filter(a=>a.name!=="Cuisiner un plat jamais fait");return true}
function seed7(){
  if(S.seeded.includes("s7"))return false;S.seeded.push("s7");
  [["Changer les draps","maison",15],["Cuisiner un plat jamais fait","nourriture",30],["Préparer mon repas du lendemain","nourriture",15],["Une journée sans soda","nourriture",15]].forEach(([name,cat,xp],i)=>{
    if(!S.actions.some(a=>a.name===name))S.actions.push({id:"n7"+i+Date.now().toString(36),name,cat,xp})});return true}
function seed6(){
  if(S.seeded.includes("s6"))return false;S.seeded.push("s6");
  S.log.forEach(e=>{if(e.fr&&e.g==="family"&&e.who){S.bonds[e.who]=(S.bonds[e.who]||0)+e.xp;S.bondsLast[e.who]=Math.max(S.bondsLast[e.who]||0,e.t)}});return true}
function seed4(){
  if(S.seeded.includes("s5"))return false;S.seeded.push("s5");
  S.specials=S.specials.filter(q=>q.grp||!/^Faire un son (dans le style|avec Octave)/.test(q.name));return true}
function seed3(){
  if(S.seeded.includes("s3"))return false;S.seeded.push("s3");
  ritTasks().forEach(t=>{if(t.name==="Manger")t.bar="nourriture";else if(t.link==="1 verre d'eau")t.bar="eau"});return true}
const MOMENTS=[["matin","Matin"],["jour","Journée"],["soir","Soir"]];
function seed2(){
  if(S.seeded.includes("s2"))return false;S.seeded.push("s2");
  const T=ritTasks(),out=[];
  const MAP={"Ouvrir la fenêtre":"matin","Faire mon lit":"matin","Pompes":"matin","Prendre ma douche":"matin","Manger":"jour","Verres d'eau":"jour"};
  T.forEach(t=>{
    if(t.when){out.push(t);return}
    if(t.n===2&&(t.name==="Brossage de dents"||t.name==="Se laver le visage")){
      out.push({...t,n:1,when:"matin"},{...t,id:t.id+"s",n:1,when:"soir"});return}
    out.push({...t,when:MAP[t.name]||"jour"});
  });
  S.daily.tasks=out;return true;
}
function seed1(){
  if(S.seeded.includes("s1"))return false;S.seeded.push("s1");
  const T=ritTasks(),has=n=>T.some(t=>t.name===n);
  if(!has("Ouvrir la fenêtre"))T.push({id:"r7",name:"Ouvrir la fenêtre",n:1});
  if(!has("Se laver le visage"))T.push({id:"r8",name:"Se laver le visage",n:2});
  [["Ranger 10 min","maison",5],["Écouter un album en entier","soi",10],["Écrire un couplet","perso",15]].forEach(([name,cat,xp],i)=>{
    if(!S.actions.some(a=>a.name===name))S.actions.push({id:"a"+Date.now().toString(36)+i,name,cat,xp})});
  if(!S.specials.some(q=>q.name==="Proposer une sortie à un ami"))S.specials.push({id:"q"+Date.now().toString(36)+"s",name:"Proposer une sortie à un ami",cat:"social",xp:25});
  return true;
}

// ---- Collection : badges + inventaire
const BI={
 star:'<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6L2.5 9.4l6.6-.8z"/>',
 flame:'<path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/>',
 shield:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/>',
 heart:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.800-8 11-8 11z"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.500c0-1.200 1.300-2 3-2s3 .8 3 2-1.300 1.800-3 2.500-3 1.200-3 2.500 1.300 2 3 2 3-.8 3-2" style="fill:none;stroke:var(--surface);stroke-width:1.600"/>',
 book:'<path d="M4 4h7a2 2 0 0 1 1 .3A2 2 0 0 1 13 4h7v15h-7a2 2 0 0 0-1 .3 2 2 0 0 0-1-.3H4z"/>',
 drop:'<path d="M12 2.500C8 8 5.500 11 5.500 14.500a6.500 6.500 0 0 0 13 0C18.500 11 16 8 12 2.500z"/>',
 bolt:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
 trophy:'<path d="M7 3h10v6a5 5 0 0 1-10 0z"/><path d="M9 20h6v-3H9z"/><path d="M12 14v3"/>',
 gift:'<rect x="4" y="9" width="16" height="12" rx="1"/><rect x="3" y="6" width="18" height="4" rx="1"/>',
 face:'<circle cx="12" cy="12" r="9"/>'
};
// ===== Bloc Jeu / Musique / Vie perso =====
const ICP={plus:'<path d="M12 5v14M5 12h14"/>',chat:'<path d="M4 5h16v11H9l-5 4z"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',camera:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',chev:'<path d="M6 9l6 6 6-6"/>',swap:'<path d="M20 11a8 8 0 0 0-14-4.5L4 8.5M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 14 4.5l2-2M20 20v-4.5h-4.5"/>',reset:'<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5M4 4v4.5h4.5"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',spark:'<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>',sword:'<path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4"/>',flame:'<path d="M12 22c4 0 7-2.8 7-6.8 0-3.6-2.4-5.6-3.6-8.7-.4 1.9-1.4 3-2.6 3.5C13 6.5 11.6 4 9 2.5c.3 3.4-4 6.2-4 11.3C5 18.6 8 22 12 22z"/>'};
function ICO(n,s){s=s||16;return`<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICP[n]}</svg>`}

// ===== Skills loisirs =====
// ===== Bonnes actions en cartes =====
const CAT_IC={sport:'<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',maison:'<path d="M5 13h14v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM9 13V7a3 3 0 0 1 6 0"/>',soi:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',nourriture:'<path d="M12 7c-3-2-8-1-8 5s4 9 6 9c1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 6-3 6-9s-5-7-8-5zM12 7c0-2 1-4 3-4"/>',social:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 5 2 5 5"/>',famille:'<path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',travail:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',perso:'<path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.6 6.6 19.4l1.2-6L3.4 9.3l6-.7z"/>',eau:'<path d="M12 3C8 9 6 12 6 15a6 6 0 0 0 12 0c0-3-2-6-6-12z"/>'};

