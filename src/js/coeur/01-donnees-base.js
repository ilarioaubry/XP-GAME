// ---- Journal d'erreurs : les 5 dernières erreurs JavaScript, visibles dans Moi > Bilan > Données (pour diagnostiquer sur l'iPhone)
function xpErr(e,src){try{const L=JSON.parse(localStorage.getItem("xp-erreurs")||"[]");const m=String((e&&(e.message||e.reason&&e.reason.message||e.reason))||e).slice(0,160);
  L.push({t:Date.now(),m,s:String(src||(e&&e.filename?e.filename.split("/").pop()+":"+e.lineno:"")||(e&&e.stack?String(e.stack).split("\n")[1]||"":"")).slice(0,80)});localStorage.setItem("xp-erreurs",JSON.stringify(L.slice(-5)))}catch(x){}}
addEventListener("error",e=>xpErr(e));addEventListener("unhandledrejection",e=>xpErr(e));

const SCR=document.body;
// Les six caractéristiques du personnage, puis les deux barres du jour (eau, nourriture)
const CATS={sport:{label:"Force",c:"var(--c-sport)"},perso:{label:"Talent",c:"var(--c-perso)"},social:{label:"Ami",c:"var(--c-social)"},famille:{label:"Famille",c:"var(--c-famille)"},maison:{label:"Maison",c:"var(--c-maison)"},soi:{label:"Soi",c:"var(--c-soi)"},eau:{label:"Eau",c:"var(--c-eau)"},nourriture:{label:"Nourriture",c:"var(--c-food)"},travail:{label:"Travail",c:"#6f8fe0"}};
const BARS={eau:{goal:16,segs:8,unit:"verres",done:"Hydraté !"},nourriture:{goal:40,segs:10,unit:"XP",done:"Rassasié !"}};
const STAT_KEYS=["sport","perso","social","famille","maison","soi","travail"];
const REMAP={planete:"maison",autres:"social"}; // anciennes catégories
// Objectifs personnels : la musique (chant) et le dossier en cours
const PERSO=[["Faire du son (1 h)","perso",40],["Avancer sur le dossier (30 min)","perso",25]].map(([name,cat,xp],i)=>({id:"p"+i,name,cat,xp}));
const RANKS=[[1,"Novice"],[3,"Apprenti"],[5,"Bienfaiteur"],[8,"Gardien"],[12,"Héros"],[17,"Champion"],[23,"Légende"],[30,"Mythe vivant"]];
// Micro-actions qui remplacent « Boire 1,5 L d'eau » (s0) et « 30 min de sport » (s1)
const MICRO=[
  ["1 verre d'eau","eau",2],["10 pompes","sport",5],["20 squats","sport",5],["1 min de gainage","sport",5],["10 min de marche rapide","sport",10],["5 min d'étirements","sport",5]
].filter((a,i,arr)=>arr.findIndex(b=>b[0]===a[0])===i).map(([name,cat,xp],i)=>({id:"m"+i,name,cat,xp}));
const STARTER_REST=[
  ["Lire","soi",10],["Méditer 10 min","soi",10],["Se coucher avant minuit","soi",10],
  ["Faire un compliment","social",5],
  ["Trier ses déchets","maison",5],["Trajet à pied ou à vélo","sport",10],["Repas végétarien","nourriture",10],
  ["Faire la vaisselle","maison",10],["Ranger sa chambre","maison",10],["Faire une lessive","maison",10],["Cuisiner un vrai repas","nourriture",25]
].map(([name,cat,xp],i)=>({id:"s"+(i+2),name,cat,xp}));
const NOURRITURE=[["Petit-déjeuner complet","nourriture",10],["Repas équilibré","nourriture",15],["Fruit ou légume en plus","nourriture",5]].map(([name,cat,xp],i)=>({id:"n"+i,name,cat,xp}));
const SPORT_IDS=["m1","m2","m3","m4","m5"];
const FRIENDS=["Adeline","Tom","Lila","Sacha","Félix","Oko","Eva","Mimi","Charlie","Rami","Bill","Tamara","Emma","Lola","Antoine","Louis","Josh","Mila","Salomé","Octave"];
const FAMILY=["Papa","Maman","Adri","Ingrid","Tiph","Raph","Gaby","Emy"];

const MUSIC=["dans le style : shatta","dans le style : JUL","dans le style : vidéo club","dans le style : indie","dans le style : trap","dans le style : Lady Gaga","avec Octave"];
const GROUPS={friends:{list:"friends",done:"friendDone",verb:"Prendre des nouvelles de ",title:"Mes amis",ph:"Ajouter un ami",cat:"social"},music:{list:"music",done:"musicDone",verb:"Faire un son ",title:"Sons",cat:"perso",hidden:true},family:{list:"family",done:"familyDone",verb:"Appeler ",title:"Ma famille",ph:"Ajouter un proche",cat:"famille",hidden:true}};
const HYGIENE=[{id:"h0",name:"Se brosser les dents",cat:"maison",xp:5}];
// actions déjà couvertes par l'assiette (27/10) : plus proposées
const PLATE_DUP=new Set(["Petit-déjeuner complet","Repas équilibré","Fruit ou légume en plus","Repas végétarien","Cuisiner un vrai repas"]);
// bonnes actions retirées à la refonte (Q.4, 28/10) ; « 1 verre d'eau » reste : c'est l'action derrière le rituel des verres d'eau (déjà masquée de la liste)
const ACT_RETIRE=new Set(["Avancer sur le dossier (30 min)","Se coucher avant minuit","Trajet à pied ou à vélo"]);
const STARTER=[...PERSO,...NOURRITURE,...HYGIENE,...MICRO,...STARTER_REST].filter(a=>!PLATE_DUP.has(a.name)&&!ACT_RETIRE.has(a.name));

// Niveau n -> n+1 coûte 50 + 50n XP (100, 150, 200…)
const needFor=l=>50+50*l;
function levelInfo(xp){let l=1,rest=xp;while(rest>=needFor(l)){rest-=needFor(l);l++}return{l,cur:rest,need:needFor(l)}}
const rankOf=l=>{let r=RANKS[0][1];for(const[min,n]of RANKS)if(l>=min)r=n;return r};

function wakeH(){try{const w=S&&S.g&&+S.g.wake;return w>=5&&w<=13?w:8}catch(e){return 8}}
function dayCut(){return Math.max(0,wakeH()-4)}
function adjH(){const d=new Date();return(d.getHours()+d.getMinutes()/60-(wakeH()-8)+48)%24}
function dayH(){const h=adjH();return h<4?h+24:h}
const dayKey=t=>{const d=new Date(+new Date(t));d.setHours(d.getHours()-dayCut());// heures d'horloge, pas de durée : sinon la nuit du changement d'heure décale le jour
return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};

const STARTER_WISHES=[{id:"w0",name:"Un bon dessert",price:5},{id:"w1",name:"Une place de ciné",price:12},{id:"w2",name:"Un nouveau livre",price:20},{id:"w3",name:"Un jeu vidéo",price:60}];
let S={xp:0,actions:STARTER,log:[],days:[],perLevel:1,rankBonus:5,wishes:STARTER_WISHES,spent:[],stats:{},bonds:{},bondsLast:{},profiles:{},myPic:"",name:"",specials:[],friends:[],friendDone:[],family:[],familyDone:[],music:MUSIC.slice(),musicDone:[],snd:{},g:newG(),qPrice:1,xpCap:300,dayLimit:3,streakBonus:{},weekly:{wk:"",done:[]},skills:[],epics:[],title:"",frame:"",bdDone:{},theme:"auto",daily:{tasks:null,day:"",c:{},wAdded:false,bonusDay:""},seeded:[],badges:{},badgesInit:false,extraMoney:0,dayBonus:{xp:30,eur:1}};
// Chaque caractéristique a son niveau : passer de n à n+1 coûte 30 + 20n XP (50, 70, 90…)
const statNeed=l=>30+20*l;
// Relations : chaque ami a son XP. Niveau l → l+1 coûte 15 × (l+1) XP (30, 45, 60…)
const PICS={};
const REL_ACTIONS=[{k:"news",label:"Prendre des nouvelles",verb:n=>"Prendre des nouvelles de "+n,xp:10},{k:"call",label:"Appeler",verb:n=>"Appeler "+n,xp:20},{k:"meet",label:"Vu en vrai",verb:n=>"Voir "+n,xp:40}];
let profName=null;
const bondNeed=l=>15*(l+1);
function bondInfo(xp){let l=1,r=xp;while(r>=bondNeed(l)){r-=bondNeed(l);l++}return{l,cur:r,need:bondNeed(l)}}
const bondTitle=l=>l>=8?"Ami de toujours":l>=5?"Ami proche":l>=3?"Pote":"Connaissance";
function statInfo(xp){let l=1,r=xp;while(r>=statNeed(l)){r-=statNeed(l);l++}return{l,cur:r,need:statNeed(l)}}
const catOf=e=>e.cat||(S.actions.find(a=>a.id===e.a)||{}).cat||((e.a==="s0"||e.a==="s1")?"soi":null);
function deriveStats(){const s={};S.log.forEach(e=>{const c=catOf(e);if(c)s[c]=(s[c]||0)+e.xp});return s}
const eur=n=>(Math.round(n*100)/100).toLocaleString("fr-FR",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+" €";
// Argent gagné : (niveau-1) × montant par niveau + un bonus pour chaque rang débloqué après Novice
const qualityLevels=()=>STAT_KEYS.reduce((a,k)=>a+statInfo(S.stats[k]||0).l-1,0);
const earnedAt=l=>(l-1)*S.perLevel+RANKS.filter(([min])=>min>1&&l>=min).length*S.rankBonus+qualityLevels()*(S.qPrice||0);
const spentTotal=()=>S.spent.reduce((a,s)=>a+s.price,0);
const balance=()=>earnedAt(levelInfo(S.xp).l)+S.extraMoney-spentTotal();
let filter="all",dirty=false,saveTimer=null;
const $=id=>document.getElementById(id);


