// ---- Assiette : au déjeuner et au dîner, on pose ce qu'on mange ; chaque côté (féculents, protéines, légumes) se remplit.
// Données : S.g.plt["AAAA-MM-JJ"][repas] = {f:[ids], p:[ids], l:[ids], x:{yaourt:1, fromage:1, eau:1}}
Object.assign(RKI,{
pates:["................","................","................","....oo..oo.oo...","...oyyooyyoyyo..","..oyYyyyYyyyYyo.","..oyyyYyyyYyyyo.",".ooyYyyyYyyyYyoo","owwwwwwwwwwwwwWo",".owwwwwwwwwwwWo.","..owwwwwwwwwWo..","...oWWWWWWWWo...","....oooooooo....","................","................","................"],
pain:["................","............oo..","..........ooYYo.",".........oYyYYo.","........oYYyYo..",".......oYyYYo...","......oYYyYo....",".....oYyYYo.....","....oYYyYo......","...oYyYYo.......","..oYYyYo........","..oYYYo.........","...ooo..........","................","................","................"],
patate:["................","................","................",".....oooooo.....","...oonnnnnnoo...","..onwnnnnnnnNo..",".onwnnnNnnnnnNo.",".onnnnnnnnNnnNo.",".onnNnnnnnnnNNo.","..onnnnnnnnNNo..","...ooNNNNNNoo...",".....oooooo.....","................","................","................","................"],
steak:["................","................","....oooooo......","..oorrrrrroo....",".orrwrrrrrrroo..",".orrrrRRrrrrrRo.","orrrrRwwRrrrrRo.","orrrrRwwRrrrRRo.",".orrrrRRrrrRRo..",".oRrrrrrrrRRo...","..ooRRRRRRoo....","....oooooo......","................","................","................","................"],
oeuf:["................","................","....oooo........","..ooWwwwoooo....",".oWwwwwwwwwWo...",".owwwwoooowwwo..","owwwwoyyyYowwWo.","owwwoyywyYYowWo.",".owwoyyyyYYowWo.",".owwwoYYYYowWWo.","..oWwwooooWWWo..","...ooWWWWWWoo...",".....oooooo.....","................","................","................"],
poisson:["................","................","................",".....ooooo....oo","...oobbbbboo.obo","..obwbbbbbbboobo",".obwobbbbbbbbbbo",".obbbbbbbbbbbBBo","..oBbbbbbbbBBoBo","...ooBBBBBBoo.oo",".....oooooo.....","................","................","................","................","................"],
lentilles:["................","................","................","......o..o......","...oooPooPooo...","..oPnPPnPPnPNo..",".oPPnPPPnPPnNNo.",".oooooooooooooo.","okkkkkkkkkkkkKKo","okwkkkkkkkkkkKKo",".okkkkkkkkkkKKo.","..oKKKKKKKKKKo..","...oooooooooo...","................","................","................"],
salade:["................","................",".....oooooo.....","...oogggGggoo...","..oggGgggggGgo..",".ogGgggGggGggGo.",".oggggGgggggGgo.","ogGggggggGgggGGo","oggGgggGgggggGGo",".ogggGgggggGGGo.","..ooGGGGGGGGoo..","....oooooooo....","................","................","................","................"],
carotte:["................","............o.o.","...........ogog.","..........oggGo.",".........oYYoo..","........oYyYYo..",".......oYyYYo...","......oYyYYo....",".....oYYYYo.....","....oYyYYo......","...oYYYo........","..oYYo..........","..ooo...........","................","................","................"],
tomate:["................","................",".......oo.......","....ooogGooo....","...orrogGorro...","..orwrrrrrrrRo..",".orwrrrrrrrrrRo.",".orwrrrrrrrrrRo.",".orrrrrrrrrrRRo.",".oRrrrrrrrrrRRo.","..oRRrrrrrRRRo..","...ooRRRRRRoo...",".....oooooo.....","................","................","................"]
});
Object.assign(RKI,{
gnocchi:["................","................","................","................","...ooo....ooo...","..oppPo..oppPo..","..opPpo..opPpo..","..oPPPo..oPPPo..","...ooo.ooo.ooo..","......oppPo.....","......opPpo.....","......oPPPo.....",".......ooo......","................","................","................"],
semoule:["................","................","................","................","....oooooooo....","..ooyYyyYyyYoo..",".oyYyyYyyYyyYyo.",".oooooooooooooo.","owwwwwwwwwwwwWWo",".owwwwwwwwwwWWo.","..owwwwwwwwWWo..","...oooooooooo...","................","................","................","................"],
courgette:["................","................","............oo..","...........oyyo.","..........oGgyo.",".........oGggo..","........oGggo...",".......oGggo....","......oGggo.....",".....oGggo......","....oGggo.......","...oGggo........","..oGGgo.........","..oGGo..........","...oo...........","................"],
poivron:["................",".......oo.......",".......oGo......","....oooogoooo...","...orrrrorrrro..","..orwrrrrrrrrRo.","..orwrrrorrrrRo.","..orrrrrorrrrRo.","..orrrrrorrrRRo.","..orrrrrorrrRRo.","...oRrrrorrRRo..","....oRRooRRRo...",".....oo..ooo....","................","................","................"],
haricots:["................","..o....o....o...",".ogo..ogo..ogo..",".ogGo.ogGo.ogGo.",".ogGo.ogGo.ogGo.","..ogGo.ogGo.ogGo","..ogGo.ogGo.ogGo","..ogGo.ogGo.ogGo",".ogGo.ogGo.ogGo.",".ogGo.ogGo.ogGo.",".ogo..ogo..ogo..","..o....o....o...","................","................","................","................"],
champignon:["................","................",".....oooooo.....","...oonnwnnnoo...","..onnwwnnnnnNo..",".onnnnnnnnwnnNo.",".onwnnnnnnnnNNo.","..ooooooooooo...",".....owwwWo.....",".....owwwWo.....",".....owwwWo.....","....owwwwWWo....",".....oooooo.....","................","................","................"],
aubergine:["................","..........o.....",".........ogo....","........ogGgo...",".......oVggo....","......oVvVVo....",".....oVvVVVo....","....oVvVVVVo....","...oVvVVVVVo....","..oVvVVVVVo.....","..oVVVVVVo......","..oVVVVVo.......","...oVVVo........","....ooo.........","................","................"],
jambon:["................","................","....oooooooo....","..oowwwwwwwwoo..",".owwmmmmmmmmWWo.",".owmmmmMmmmmmWo.","owmmMmmmmmMmmmWo","owmmmmmmmmmmMmWo","owmmmmMmmmmmmmWo",".owmmmmmmmMmmWo.",".oWWmmmmmmmmWWo.","..ooWWWWWWWWoo..","....oooooooo....","................","................","................"],
thon:["................","................","................","...oooooooooo...","..okkkkkkkkkKo..","..oKKKKKKKKKKo..","..obbbbbbbbbBo..","..obwwbbbbbbBo..","..obbbbbbbbbBo..","..oKKKKKKKKKKo..","...oooooooooo...","................","................","................","................","................"],
tofu:["................","................","....oooooooo....","...owwwwwwwWo...","..owwwwwwwWWo...","..oooooooooWo...","..owwwwwwwoWo...","..owwwwwwwoWo...","..owwwwwwwoWo...","..owwwwwwwoo....","..oWWWWWWWo.....","..ooooooooo.....","................","................","................","................"],
poischiche:["................","................","................","...oo.oo..oo....","..oppoppooppo...",".opPoopPopPPoo..",".oooooooooooooo.","okkkkkkkkkkkkKKo","okwkkkkkkkkkkKKo",".okkkkkkkkkkKKo.","..oKKKKKKKKKKo..","...oooooooooo...","................","................","................","................"],
crevette:["................","................",".....oooo.......","...ooYYYYoo.....","..oYYwYYYYYo....",".oYYoooooYYYo...",".oYo.....oYYo...",".oYYo.....oYo...","..oYYo...oYYo...","...oYYoooYYo.o..","....oYYYYYooYo..",".....ooooooYYo..","..........oooo..","................","................","................"]
});
Object.assign(RKI,{courge:["................",".......oo.......",".......oGo......","......oNNo......",".....oYYYYo.....",".....oYyYYo.....",".....oYyYYo.....",".....oYYYYo.....","....oYYYYYYo....","...oYyYYYYYYo...","...oYyYYYYYYo...","...oYYYYYYYYo...","...oYYYYYYYYo...","....oYYYYYYo....",".....oooooo.....","................"]});
const PL_SIDES=[["f","Féculents","#ffd94a","#f0a020",[["pates","Pâtes"],["riz","Riz"],["pain","Pain"],["patate","Patates"],["gnocchi","Gnocchi"],["semoule","Semoule"]]],
  ["p","Protéines","#ff9ec0","#e8473a",[["viande","Poulet"],["steak","Viande"],["oeuf","Œuf"],["poisson","Poisson"],["jambon","Jambon"],["thon","Thon"],["crevette","Crevettes"],["tofu","Tofu"],["lentilles","Lentilles"],["poischiche","Pois chiches"]]],
  ["l","Légumes","#a8eb8a","#4fb84a",[["salade","Salade"],["carotte","Carotte"],["tomate","Tomate"],["legume","Brocoli"],["courgette","Courgette"],["poivron","Poivron"],["haricots","Haricots verts"],["champignon","Champignons"],["aubergine","Aubergine"]]]];
const PL_X=[["yaourt","Yaourt","yaourt"],["fromage","Fromage","fromage"],["eau","Verre d'eau","verre"]];
const PL_A={f:210,p:330,l:90};// angle du milieu de chaque côté (0° = droite, 90° = bas)
const plDay=d=>{const P=S.g.plt=S.g.plt||{};return P[d]||{}};
const plN=(m,q)=>((m||{})[q]||[]).length;
// assiette pixel 64×64 : rebord éclairé en haut à gauche ; chaque côté se remplit du centre vers le bord selon le nombre de portions (3 = plein)
// rendu en image (canvas mis en cache) : net et stable sur iPhone, contrairement à un SVG de mille rectangles
function plSvg(lv){const key=["f","p","l"].map(k=>Math.min(3,lv[k]||0)).join("");if(PL_IMG[key])return PL_IMG[key];const N=64,c=31.5,rows=[];for(let y=0;y<N;y++){const row=[];for(let x=0;x<N;x++){const dx=x-c,dy=y-c,d=Math.hypot(dx,dy);let col="";
  if(d>31.4)col="";else if(d>29.6)col="#2a1606";else if(d>25.8){const l=(-dx-dy)/(d||1);col=l>.55?"#ffffff":l>-.35?((x+y)%2?"#f2f5f8":"#ffffff"):l>-.75?"#dfe8f0":"#c9d3dd"}
  else if(d>24.6)col=(-dx-dy)>0?"#b8c4cf":"#e3eaf0";else{const a=(Math.atan2(dy,dx)*180/Math.PI+360)%360;
    const div=[30,150,270].some(b=>d*Math.abs(Math.sin((a-b)*Math.PI/180))<.9&&Math.cos((a-b)*Math.PI/180)>0);
    if(div)col="#c9d3dd";else{const s=a>=30&&a<150?"l":a>=150&&a<270?"f":"p",S2=PL_SIDES.find(z=>z[0]===s),n=Math.min(3,lv[s]||0),R=24.6*n/3;
      col=n&&d<=R?(d>R-1.2?S2[3]:((x*7+y*3)%11===0?"#ffffff":(x+2*y)%5===0||(2*x+y)%7===0?S2[3]:S2[2])):"#ffffff"}}
  row.push(col)}rows.push(row)}
  const cv=document.createElement("canvas");cv.width=cv.height=N;const g=cv.getContext("2d");rows.forEach((cs,y)=>cs.forEach((col,x)=>{if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}}));
  return PL_IMG[key]=`<img class="plimg" src="${cv.toDataURL()}" width="64" height="64" alt="" aria-hidden="true">`}
const PL_IMG={};
function plSlots(s,n){const a=PL_A[s],P=[[7,0],[9,-34],[9,34],[4.2,0]];return P.slice(0,n).map(([r,da])=>{const t=(a+da)*Math.PI/180;return[(15.5+r*Math.cos(t))/32*100,(15.5+r*Math.sin(t))/32*100]})}

const plDone=(d,per,k)=>{const key=d+":"+per,b=(S.g.mb||{})[key],dr=(S.g.mbd||{})[key];return(((b&&b.m)||(dr&&dr.m)||{})[k])===1};
const plXp=L=>{const n=["f","p","l"].filter(s=>L[s]).length;return n*MB_PLX+(n===3?MB_PLB:0)};
// ---- catalogue : aliments de base + les tiens (S.g.plf), masqués (S.g.plh), triés par usage
const plCus=()=>Array.isArray(S.g.plf)?S.g.plf:(S.g.plf=[]);
const plHid=()=>Array.isArray(S.g.plh)?S.g.plh:(S.g.plh=[]);
const plAll=s=>PL_SIDES.find(z=>z[0]===s)[4].map(([id,n])=>({id,n,ic:id})).concat(plCus().filter(c=>c.s===s).map(c=>({id:c.id,n:c.n,ic:c.ic,cus:1})));
function plFood(id){for(const[s] of PL_SIDES){const f=plAll(s).find(x=>x.id===id);if(f)return f}return{id,n:id,ic:RKI[id]?id:"assiette"}}
const plIc=id=>plFood(id).ic;
function plUse(){const u={};Object.values(S.g.plt||{}).forEach(D=>Object.values(D||{}).forEach(m=>["f","p","l"].forEach(s=>((m&&m[s])||[]).forEach(id=>u[id]=(u[id]||0)+1))));return u}
const plFoods=(s,all,u)=>plAll(s).filter(f=>all||!plHid().includes(f.id)).map((f,i)=>[f,i]).sort((a,b)=>((u[b[0].id]||0)-(u[a[0].id]||0))||a[1]-b[1]).map(x=>x[0]);
const PL_ICONS=[...new Set([...PL_SIDES.flatMap(z=>z[4].map(f=>f[0])),"pomme","burger","assiette","casserole","poele","cookie","cake","fromage","yaourt","soda"])].filter(k=>RKI[k]);
// ---- recettes (S.g.plr) : une assiette toute prête, en un toucher
const PL_REC0=[{id:"r1",n:"Pâtes courgettes à la crème",f:["pates"],p:[],l:["courgette"]},{id:"r2",n:"Gnocchi pesto rouge",f:["gnocchi"],p:[],l:["tomate"]},
  {id:"r3",n:"Riz poulet haricots",f:["riz"],p:["viande"],l:["haricots"]},{id:"r4",n:"Omelette champignons",f:[],p:["oeuf"],l:["champignon"]},{id:"r5",n:"Couscous légumes",f:["semoule"],p:["poischiche"],l:["courgette","carotte"]}];
const plRec=()=>Array.isArray(S.g.plr)?S.g.plr:(S.g.plr=PL_REC0.map(r=>({...r})));
// ---- quêtes nourriture que l'assiette peut vérifier
const plNorm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();
const PL_MEAT=/viande|poulet|b(oe|œ)uf|porc|jambon|lardon|thon|poisson|saumon|crevette|steak|dinde|canard|merguez|saucisse|chorizo|bacon/i;
function plRule(t){t=String(t||"");const ns=m=>["f","p","l"].filter(s=>plN(m,s)).length,names=m=>["f","p","l"].flatMap(s=>((m&&m[s])||[]).map(id=>plFood(id).n));
  if(/équilibr/i.test(t))return{ok:m=>ns(m)===3,need:"les trois côtés"};
  if(/végé/i.test(t))return{ok:m=>ns(m)>0&&!names(m).some(n=>PL_MEAT.test(n)),need:"une assiette sans viande ni poisson"};
  if(/fruit ou légume/i.test(t))return{ok:m=>plN(m,"l")>=2,need:"au moins deux légumes"};
  if(/avec un légume/i.test(t))return{ok:m=>plN(m,"l")>=1,need:"au moins un légume"};
  if(/vrai repas/i.test(t))return{ok:m=>ns(m)>=2,need:"au moins deux côtés"};
  const c=t.match(/cuisiner avec (?:du |de la |des |de l'|l'|le |la |les |une? )?(.+)/i);if(c){const w=plNorm(c[1]).replace(/s$/,"");if(!w||!PL_SIDES.some(([s])=>plAll(s).some(f=>plNorm(f.n).includes(w))))return null;return{ok:m=>names(m).some(n=>plNorm(n).includes(w)),need:c[1].toLowerCase()}}
  return null}
function plQuests(m,el,q){let P=[];try{const L=feedPick().L,dn=(S.g.fq&&S.g.fq.done)||[];P=L.filter(x=>x.cat==="nourriture"&&!x.later&&!dn.includes(x.id)&&(r=>r&&r.ok(m))(plRule(x.t)))}catch(e){}
  P.forEach((x,i)=>setTimeout(()=>{try{(window.__plFd||feedDo)(x,el,null)}catch(e){}},1300+i*900));
  if(q&&!P.some(x=>x.id===q.id)){const r=plRule(q.t);if(r)setTimeout(()=>toast(`Quête « ${esc(q.t)} » pas encore remplie : il faut ${r.need}`),1300)}}

function plateOpen(per,k,btn,opt){opt=opt||{};btn=btn||document.querySelector("#fqBox")||document.body;
  const tk=dayKey(Date.now()),M=MB[per].find(m=>m[0]===k),cur=plDay(tk)[k]||{},m={f:[...(cur.f||[])],p:[...(cur.p||[])],l:[...(cur.l||[])],x:{...(cur.x||{})},...(cur.r?{r:cur.r}:{})};
  const edit=plDone(tk,per,k),lunch=k==="diner"?plDay(tk).dej:null,need=lunch?PL_SIDES.filter(([s])=>!plN(lunch,s)).map(([s])=>s):[],q=opt.q,u=plUse();
  const o=document.createElement("div");o.className="plo";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",M[1]);
  let step=1,tri=false,add="",addIc="",addName="",naming=false,recName="";
  const close=()=>{o.remove();document.documentElement.classList.remove("plopen");document.removeEventListener("keydown",onKey)},onKey=e=>{if(e.key==="Escape")close()};
  const lv=()=>({f:plN(m,"f"),p:plN(m,"p"),l:plN(m,"l")});
  const recs=()=>plRec().slice().sort((a,b)=>(b.u||0)-(a.u||0));
  const draw=()=>{const L=lv(),nd=need.filter(s=>!L[s]),bx=plXp(L),empty=!L.f&&!L.p&&!L.l;
    o.innerHTML=`<div class="plin"><div class="plhd"><h2>${step===1?M[1]+(edit?" <small>· corriger</small>":""):"Et avec ça ?"}</h2>${step===1?`<button type="button" class="btn pltri${tri?" on":""}" aria-pressed="${tri}">${tri?"Terminé":"Trier"}</button>`:""}<button type="button" class="plcl" aria-label="Fermer">${ICO("close",18)}</button></div>`+
    (step===1?`${q?`<p class="plq">Quête : <b>${esc(q.t)}</b></p>`:""}
      <div class="plrec" aria-label="Mes recettes">${recs().map(r=>`<button type="button" class="plr${tri?" del":""}${m.r===r.id?" on":""}" data-rec="${r.id}"${tri?` aria-label="Supprimer ${esc(r.n)}"`:""}><span>${["f","p","l"].flatMap(s=>r[s]||[]).slice(0,3).map(id=>rkSvg(plIc(id))).join("")}</span><b>${esc(r.n)}</b>${tri?`<i>${ICO("close",10)}</i>`:""}</button>`).join("")}${tri?"":`<button type="button" class="plr plsv"${empty?" disabled":""}><span>+</span><b>Enregistrer cette assiette</b></button>`}</div>
      ${naming?`<div class="plname"><input type="text" maxlength="40" placeholder="Nom de la recette" aria-label="Nom de la recette" value="${esc(recName)}"><button type="button" class="btn primary plnok">OK</button><button type="button" class="btn plnno" aria-label="Annuler">${ICO("close",14)}</button></div>`:""}
      <div class="plate" aria-label="Assiette : ${PL_SIDES.map(([s,l])=>l+" "+L[s]).join(", ")}">${plSvg(L)}${PL_SIDES.map(([s])=>{const n=L[s],sl=plSlots(s,Math.min(n,3));return m[s].slice(0,3).map((id,i)=>`<button type="button" class="plit" data-rm="${s}:${i}" style="left:${sl[i][0]}%;top:${sl[i][1]}%" aria-label="Retirer ${esc(plName(s,id))}">${rkSvg(plIc(id))}</button>`).join("")+(n>3?`<b class="plmore" style="left:${plSlots(s,4)[3][0]}%;top:${plSlots(s,4)[3][1]}%">+${n-3}</b>`:"")}).join("")}</div>
      <p class="plhint">${tri?"Touche un aliment pour le masquer ou le remettre. Touche une recette pour la supprimer.":nd.length?`À midi il manquait : <b>${nd.map(s=>PL_SIDES.find(z=>z[0]===s)[1].toLowerCase()).join(", ")}</b>. C'est le moment d'en ajouter.`:edit?"Ajoute ou retire ce que tu as oublié.":"Touche ce que tu manges, ou une recette. Touche un aliment sur l'assiette pour le retirer."}</p>
      ${edit||tri?"":`<p class="plxp${bx>=MB_PLX*3+MB_PLB?" full":""}">${bx?`+${bx} XP d'assiette${bx>=MB_PLX*3+MB_PLB?" · complète !":""}`:"Chaque côté rempli rapporte de l'XP"}</p>`}
      <div class="plsides">${PL_SIDES.map(([s,l,c1,c2])=>`<div class="plside${nd.includes(s)&&!tri?" need":""}" style="--pc:${c2}"><h3><i></i>${l}${L[s]?` <small>${L[s]}</small>`:""}${nd.includes(s)&&!tri?`<em>Il t'en manque aujourd'hui</em>`:""}</h3><div class="plfoods">${plFoods(s,tri,u).map(f=>{const h=plHid().includes(f.id);return`<button type="button" class="plf${h?" hid":""}" ${tri?`data-hide="${f.id}" aria-pressed="${!h}"`:`data-add="${s}:${f.id}"`}><span>${rkSvg(f.ic)}</span><small>${esc(f.n)}</small></button>`}).join("")}<button type="button" class="plf pladd" data-new="${s}" aria-expanded="${add===s}"><span>+</span><small>Ajouter</small></button></div>
        ${add===s?`<div class="plnew"><input type="text" maxlength="30" placeholder="Nom de l'aliment" aria-label="Nom de l'aliment" value="${esc(addName)}"><div class="plics" role="group" aria-label="Choisis une icône">${PL_ICONS.map(ic=>`<button type="button" data-ic="${ic}" class="${ic===addIc?"on":""}" aria-label="Icône ${ic}" aria-pressed="${ic===addIc}">${rkSvg(ic)}</button>`).join("")}</div><div class="plnewb"><button type="button" class="btn plnewno">Annuler</button><button type="button" class="btn primary plnewok">Ajouter</button></div></div>`:""}</div>`).join("")}</div>
      <div class="plbar">${edit?`<button type="button" class="btn plcl2">Annuler</button>`:`<button type="button" class="btn plskip">Sauté</button>`}<button type="button" class="btn primary plnext">Suite</button></div>`
    :`<div class="plxs">${PL_X.map(([id,l,ic])=>`<button type="button" class="plx${m.x[id]?" on":""}" data-x="${id}" aria-pressed="${!!m.x[id]}"><span>${rkSvg(ic)}</span><b>${l}</b><em>${m.x[id]?"Oui":"Non"}</em></button>`).join("")}</div>
      ${plWaterRit()?`<p class="plhint">Le verre d'eau compte aussi pour ton rituel « ${esc(plWaterRit().name)} ».</p>`:""}
      <div class="plbar"><button type="button" class="btn plback">Retour</button><button type="button" class="btn primary plok">${edit?"Enregistrer":"Valider"}</button></div>`)+`</div>`;
    const $o=sel=>o.querySelector(sel),on=(sel,f)=>o.querySelectorAll(sel).forEach(b=>b.onclick=f.bind(null,b));
    on(".plcl,.plcl2",()=>close());
    on(".pltri",()=>{tri=!tri;add="";naming=false;draw()});
    on("[data-add]",b=>{const[s,id]=b.dataset.add.split(":");m[s].push(id);delete m.r;try{sfx("blip")}catch(e){}draw();const it=o.querySelectorAll(`.plit[data-rm^="${s}:"]`);const last=it[Math.min(m[s].length,3)-1];if(last&&m[s].length<=3)last.classList.add("pop")});
    on("[data-rm]",b=>{const[s,i]=b.dataset.rm.split(":");m[s].splice(+i,1);delete m.r;draw()});
    on("[data-hide]",b=>{const id=b.dataset.hide,H=plHid(),i=H.indexOf(id);if(i<0)H.push(id);else H.splice(i,1);save();draw()});
    on("[data-rec]",b=>{const R=plRec(),r=R.find(x=>x.id===b.dataset.rec);if(!r)return;if(tri){const i=R.indexOf(r);undoAfter(`Recette « ${r.n} » supprimée`,()=>{R.splice(i,1);save();draw()},()=>{R.splice(i,0,r);save();if(o.isConnected)draw()});return}
      ["f","p","l"].forEach(s=>m[s]=[...(r[s]||[])]);m.r=r.id;try{sfx("blip")}catch(e){}draw();o.querySelectorAll(".plit").forEach(x=>x.classList.add("pop"))});
    on(".plsv",()=>{naming=true;recName="";draw();const i=$o(".plname input");if(i)i.focus()});
    const ni=$o(".plname input");if(ni){ni.oninput=()=>recName=ni.value;ni.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();$o(".plnok").click()}}}
    on(".plnok",()=>{const n=recName.trim();if(!n){if(ni)ni.focus();return}const r={id:"r"+Date.now().toString(36),n,f:[...m.f],p:[...m.p],l:[...m.l]};plRec().unshift(r);m.r=r.id;naming=false;save();toast(`Recette « ${esc(n)} » enregistrée`);draw()});
    on(".plnno",()=>{naming=false;draw()});
    on("[data-new]",b=>{add=add===b.dataset.new?"":b.dataset.new;addIc="";addName="";draw();const i=$o(".plnew input");if(i)i.focus()});
    const ai=$o(".plnew input");if(ai){ai.oninput=()=>addName=ai.value;ai.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();$o(".plnewok").click()}}}
    on("[data-ic]",b=>{addIc=b.dataset.ic;draw();const i=$o(".plnew input");if(i&&!addName)i.focus()});
    on(".plnewno",()=>{add="";draw()});
    on(".plnewok",()=>{const n=addName.trim();if(!n){if(ai)ai.focus();return}const f={id:"c"+Date.now().toString(36),s:add,n,ic:addIc||PL_SIDES.find(z=>z[0]===add)[4][0][0]};plCus().push(f);if(!tri){m[add].push(f.id);delete m.r}add="";save();toast(`« ${esc(n)} » ajouté`);draw()});
    on("[data-x]",b=>{const id=b.dataset.x;if(m.x[id])delete m.x[id];else m.x[id]=1;try{sfx("blip")}catch(e){}draw()});
    on(".plnext",()=>{step=2;tri=false;add="";naming=false;draw()});
    on(".plback",()=>{step=1;draw()});
    const sk=$o(".plskip");if(sk)sk.onclick=ev=>{close();try{mealQuick(per,k,btn,0,ev)}catch(e){}};
    const ok=$o(".plok");if(ok)ok.onclick=ev=>{const water=m.x.eau&&!(cur.x||{}).eau;if(m.r&&m.r!==cur.r){const r=plRec().find(x=>x.id===m.r);if(r)r.u=(r.u||0)+1}plSave(tk,k,m);close();
      if(edit){try{render()}catch(e){}toast("Assiette corrigée")}else{try{mealQuick(per,k,btn,1,ev,plXp(lv()),{plk:tk+":"+k,plp:per})}catch(e){}}
      if(water)setTimeout(()=>{try{const t=plWaterRit();if(t)ritTap(t,btn,null)}catch(e){}},900);
      plQuests(m,btn,q)}};
  draw();o.onclick=e=>{if(e.target===o)close()};document.addEventListener("keydown",onKey);document.body.appendChild(o);document.documentElement.classList.add("plopen");try{sfx("open")}catch(e){}}
// une quête nourriture vérifiable ouvre l'assiette du repas en cours au lieu de se valider d'un coup
try{const _fd=feedDo;window.__plFd=_fd;feedDo=function(x,go,ev){try{const dn=(S.g.fq&&S.g.fq.done)||[];if(x&&x.cat==="nourriture"&&!x.later&&!dn.includes(x.id)&&plRule(x.t)){const k=dayH()<16?"dej":"diner";plateOpen(k==="dej"?"matin":"soir",k,go,{q:x});return}}catch(e){}return _fd.apply(this,arguments)}}catch(e){}
// rituel Eau du jour (s'il existe et n'est pas fini)
function plWaterRit(){try{ritRoll();return(S.daily.tasks||[]).find(t=>/\beau\b|verre/i.test(t.name)&&(S.daily.c[t.id]||0)<t.n)||null}catch(e){return null}}
// annuler le repas depuis « Annuler » ou le journal : l'assiette et l'état du repas repartent à zéro
function plUndo(e){const[d,k]=e.plk.split(":"),per=e.plp,P=(S.g.plt||{})[d],m=P&&P[k];if(P)delete P[k];
  const key=d+":"+per,dr=(S.g.mbd||{})[key];if(dr){if(dr.m)delete dr.m[k];if(dr.cr)delete dr.cr[k]}if(S.g.mb&&S.g.mb[key]){if(dr)Object.keys(S.g.mb[key].m||{}).forEach(q=>{if(q!==k&&dr.m[q]==null){dr.m[q]=S.g.mb[key].m[q];dr.cr=dr.cr||{};dr.cr[q]=1}});delete S.g.mb[key]}}

// série : jours d'affilée avec des légumes (aujourd'hui compte s'il y en a, sinon on part d'hier)
function plVegRun(){let n=0;const d=new Date();if(!plTot(dayKey(d)).l)d.setDate(d.getDate()-1);for(let i=0;i<400;i++){if(!plTot(dayKey(d)).l)break;n++;d.setDate(d.getDate()-1)}return n}
try{const _bd=badgeDefs;badgeDefs=function(){const B=_bd.apply(this,arguments);B.push({id:"veg7",name:"Potager",desc:"Des légumes 7 jours d'affilée",ic:"heart",t:2,ok:()=>plVegRun()>=7});return B}}catch(e){}
try{const _fo=famOf;famOf=function(id){return id==="veg7"?"reg":_fo(id)}}catch(e){}
function plName(s,id){return plFood(id).n}
function plSave(tk,k,m){const P=S.g.plt=S.g.plt||{};(P[tk]=P[tk]||{})[k]=m;const lim=dayKey(Date.now()-120*864e5);Object.keys(P).forEach(d=>{if(d<lim)delete P[d]});save()}
// totaux d'une journée (déjeuner + dîner)
function plTot(d){const D=plDay(d),t={f:0,p:0,l:0,x:{yaourt:0,fromage:0,eau:0},n:0};MB_PLM.forEach(k=>{const m=D[k];if(!m)return;t.n++;["f","p","l"].forEach(s=>t[s]+=plN(m,s));PL_X.forEach(([id])=>{if((m.x||{})[id])t.x[id]++})});return t}

// Aujourd'hui : petite assiette du jour sous les repas (dès qu'un repas est rempli)
function plateDay(row){if(!row||!row.parentElement)return;const t=plTot(dayKey(Date.now()));let e=row.parentElement.querySelector(".pldy");
  if(!t.n){if(e)e.remove();return}const run=plVegRun(),st=JSON.stringify([t,run]);if(e&&e.dataset.k===st)return;
  if(!e){e=document.createElement("div");e.className="pldy";row.after(e)}e.dataset.k=st;
  const miss=PL_SIDES.filter(([s])=>!t[s]).map(([,l])=>l.toLowerCase());
  e.innerHTML=`<div class="pldp">${plSvg(t)}</div><div class="pldt"><b>${miss.length?"Il manque : "+miss.join(", "):"Assiette complète aujourd'hui"}</b><div class="pldl">${PL_SIDES.map(([s,l,c1,c2])=>`<span style="--pc:${c2}"><i></i>${l} ${t[s]}</span>`).join("")}</div><div class="pldx">${PL_X.map(([id,l,ic])=>`<span class="${t.x[id]?"on":""}" title="${l}">${rkSvg(ic)}<em>${t.x[id]}</em></span>`).join("")}${run>1?`<span class="on plrun" title="Jours d'affilée avec des légumes">${rkSvg("legume")}<em>${run} j de suite</em></span>`:""}</div></div>`}

// Bilan : les 7 derniers jours
function renderPlateWeek(){const box=document.getElementById("plWeek");if(!box||!S.g)return;const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push([d,plTot(dayKey(d))])}
  const done=days.filter(x=>x[1].n);box.classList.toggle("gempty",!done.length);if(!done.length){box.innerHTML="";return}
  const cnt=s=>done.filter(x=>x[1][s]).length,xs=id=>done.reduce((a,x)=>a+x[1].x[id],0);
  const weak=PL_SIDES.map(([s,l])=>[l,cnt(s)]).sort((a,b)=>a[1]-b[1])[0];
  box.innerHTML=`<div class="gcard col1"><h3>Mon assiette · 7 jours</h3><div class="plwk">${days.map(([d,t])=>`<span class="${t.n?"":"none"}" title="${d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric"})}">${t.n?plSvg(t):'<i class="plz"></i>'}<em>${"LMMJVSD"[(d.getDay()+6)%7]}</em></span>`).join("")}</div>
    <div class="pldl">${PL_SIDES.map(([s,l,c1,c2])=>`<span style="--pc:${c2}"><i></i>${l} ${cnt(s)}/${done.length} j</span>`).join("")}</div>
    <p class="hint" style="margin:6px 0 0">${weak[1]<done.length?`Le côté qui manque le plus : ${weak[0].toLowerCase()}.`:"Les trois côtés tous les jours, bravo."} Yaourt ${xs("yaourt")} · fromage ${xs("fromage")} · eau ${xs("eau")}.</p></div>`}
try{const _r=render;render=function(){const r=_r.apply(this,arguments);try{renderPlateWeek()}catch(e){}return r}}catch(e){}
// shortcut: réparation unique des repas notés entre 3 h et 4 h la nuit du 25 oct. 2026 (rangés à tort au 25), à supprimer après novembre 2026
