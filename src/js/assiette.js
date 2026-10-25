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
const PL_SIDES=[["f","Féculents","#ffd94a","#f0a020",[["pates","Pâtes"],["riz","Riz"],["pain","Pain"],["patate","Patates"]]],
  ["p","Protéines","#ff9ec0","#e8473a",[["viande","Poulet"],["steak","Viande"],["oeuf","Œuf"],["poisson","Poisson"],["lentilles","Lentilles"]]],
  ["l","Légumes","#a8eb8a","#4fb84a",[["salade","Salade"],["carotte","Carotte"],["tomate","Tomate"],["legume","Brocoli"]]]];
const PL_X=[["yaourt","Yaourt","yaourt"],["fromage","Fromage","fromage"],["eau","Verre d'eau","verre"]];
const PL_A={f:210,p:330,l:90};// angle du milieu de chaque côté (0° = droite, 90° = bas)
const plDay=d=>{const P=S.g.plt=S.g.plt||{};return P[d]||{}};
const plN=(m,q)=>((m||{})[q]||[]).length;
// assiette pixel 32×32 : chaque côté se remplit du centre vers le bord selon le nombre de portions (3 = plein)
function plSvg(lv){const c=15.5,rows=[];for(let y=0;y<32;y++){let row="";for(let x=0;x<32;x++){const dx=x-c,dy=y-c,d=Math.hypot(dx,dy);let col="";
  if(d>15.6)col="";else if(d>14.6)col="#2a1606";else if(d>13)col=(x+y)%2?"#dfe8f0":"#ffffff";else if(d>12.4)col="#c9d3dd";else{const a=(Math.atan2(dy,dx)*180/Math.PI+360)%360;
    const div=[30,150,270].some(b=>d*Math.abs(Math.sin((a-b)*Math.PI/180))<.55&&Math.cos((a-b)*Math.PI/180)>0);
    if(div)col="#c9d3dd";else{const s=a>=30&&a<150?"l":a>=150&&a<270?"f":"p",S2=PL_SIDES.find(z=>z[0]===s),n=Math.min(3,lv[s]||0);col=n&&d<=12.4*n/3?((x*3+y)%4?S2[2]:S2[3]):"#ffffff"}}
  row+=col+"|"}rows.push(row)}
  let r="";rows.forEach((row,y)=>{const cs=row.split("|");let x=0;while(x<32){const col=cs[x];let w=1;while(x+w<32&&cs[x+w]===col)w++;if(col)r+=`<rect x="${x}" y="${y}" width="${w}" height="1.03" fill="${col}"/>`;x+=w}});
  return`<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}
function plSlots(s,n){const a=PL_A[s],P=[[7,0],[9,-34],[9,34],[4.2,0]];return P.slice(0,n).map(([r,da])=>{const t=(a+da)*Math.PI/180;return[(15.5+r*Math.cos(t))/32*100,(15.5+r*Math.sin(t))/32*100]})}

const plDone=(d,per,k)=>{const key=d+":"+per,b=(S.g.mb||{})[key],dr=(S.g.mbd||{})[key];return(((b&&b.m)||(dr&&dr.m)||{})[k])===1};
const plXp=L=>{const n=["f","p","l"].filter(s=>L[s]).length;return n*MB_PLX+(n===3?MB_PLB:0)};
function plateOpen(per,k,btn){const tk=dayKey(Date.now()),M=MB[per].find(m=>m[0]===k),cur=plDay(tk)[k]||{},m={f:[...(cur.f||[])],p:[...(cur.p||[])],l:[...(cur.l||[])],x:{...(cur.x||{})},...(cur.bh?{bh:1}:{})};
  const edit=plDone(tk,per,k),lunch=k==="diner"?plDay(tk).dej:null,need=lunch?PL_SIDES.filter(([s])=>!plN(lunch,s)).map(([s])=>s):[];
  const o=document.createElement("div");o.className="plo";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",M[1]);let step=1;
  const close=()=>{o.remove();document.removeEventListener("keydown",onKey)},onKey=e=>{if(e.key==="Escape")close()};
  const lv=()=>({f:plN(m,"f"),p:plN(m,"p"),l:plN(m,"l")});
  const draw=()=>{const L=lv(),nd=need.filter(s=>!L[s]),bx=plXp(L);
    o.innerHTML=`<div class="plin"><div class="plhd"><h2>${step===1?M[1]+(edit?" <small>· corriger</small>":""):"Et avec ça ?"}</h2><button type="button" class="plcl" aria-label="Fermer">✕</button></div>`+
    (step===1?`<div class="plate" aria-label="Assiette : ${PL_SIDES.map(([s,l])=>l+" "+L[s]).join(", ")}">${plSvg(L)}${PL_SIDES.map(([s])=>{const n=L[s],sl=plSlots(s,Math.min(n,3));return m[s].slice(0,3).map((id,i)=>`<button type="button" class="plit" data-rm="${s}:${i}" style="left:${sl[i][0]}%;top:${sl[i][1]}%" aria-label="Retirer ${plName(s,id)}">${rkSvg(id)}</button>`).join("")+(n>3?`<b class="plmore" style="left:${plSlots(s,4)[3][0]}%;top:${plSlots(s,4)[3][1]}%">+${n-3}</b>`:"")}).join("")}</div>
      <p class="plhint">${nd.length?`À midi il manquait : <b>${nd.map(s=>PL_SIDES.find(z=>z[0]===s)[1].toLowerCase()).join(", ")}</b>. C'est le moment d'en ajouter.`:edit?"Ajoute ou retire ce que tu as oublié.":"Touche ce que tu manges. Touche-le sur l'assiette pour le retirer."}</p>
      ${edit?"":`<p class="plxp${bx>=MB_PLX*3+MB_PLB?" full":""}">${bx?`+${bx} XP d'assiette${bx>=MB_PLX*3+MB_PLB?" · complète !":""}`:"Chaque côté rempli rapporte de l'XP"}</p>`}
      <div class="plsides">${PL_SIDES.map(([s,l,c1,c2,F])=>`<div class="plside${nd.includes(s)?" need":""}" style="--pc:${c2}"><h3><i></i>${l}${L[s]?` <small>${L[s]}</small>`:""}${nd.includes(s)?`<em>Il t'en manque aujourd'hui</em>`:""}</h3><div class="plfoods">${F.map(([id,n])=>`<button type="button" class="plf" data-add="${s}:${id}"><span>${rkSvg(id)}</span><small>${n}</small></button>`).join("")}</div></div>`).join("")}</div>
      <div class="plbar">${edit?`<button type="button" class="btn plcl2">Annuler</button>`:`<button type="button" class="btn plskip">Sauté</button>`}<button type="button" class="btn primary plnext">Suite</button></div>`
    :`<div class="plxs">${PL_X.map(([id,l,ic])=>`<button type="button" class="plx${m.x[id]?" on":""}" data-x="${id}" aria-pressed="${!!m.x[id]}"><span>${rkSvg(ic)}</span><b>${l}</b><em>${m.x[id]?"Oui":"Non"}</em></button>`).join("")}</div>
      ${plWaterRit()?`<p class="plhint">Le verre d'eau compte aussi pour ton rituel « ${esc(plWaterRit().name)} ».</p>`:""}
      <div class="plbar"><button type="button" class="btn plback">Retour</button><button type="button" class="btn primary plok">${edit?"Enregistrer":"Valider"}</button></div>`)+`</div>`;
    o.querySelectorAll(".plcl,.plcl2").forEach(b=>b.onclick=close);
    o.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const[s,id]=b.dataset.add.split(":");m[s].push(id);try{sfx("blip")}catch(e){}draw();const it=o.querySelectorAll(`.plit[data-rm^="${s}:"]`);const last=it[Math.min(m[s].length,3)-1];if(last&&m[s].length<=3)last.classList.add("pop")});
    o.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{const[s,i]=b.dataset.rm.split(":");m[s].splice(+i,1);draw()});
    o.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>{const id=b.dataset.x;if(m.x[id])delete m.x[id];else m.x[id]=1;try{sfx("blip")}catch(e){}draw()});
    const nx=o.querySelector(".plnext");if(nx)nx.onclick=()=>{step=2;draw()};
    const bk=o.querySelector(".plback");if(bk)bk.onclick=()=>{step=1;draw()};
    const sk=o.querySelector(".plskip");if(sk)sk.onclick=ev=>{close();try{mealQuick(per,k,btn,0,ev)}catch(e){}};
    const ok=o.querySelector(".plok");if(ok)ok.onclick=ev=>{const water=m.x.eau&&!(cur.x||{}).eau,hit=plBossHit(m);plSave(tk,k,m);close();
      if(edit){try{render()}catch(e){}toast("Assiette corrigée")}else{try{mealQuick(per,k,btn,1,ev,plXp(lv()),{plk:tk+":"+k,plp:per})}catch(e){}}
      if(water)setTimeout(()=>{try{const t=plWaterRit();if(t)ritTap(t,btn,null)}catch(e){}},900);
      if(hit)setTimeout(()=>plBossFx(hit),water?1900:1100)}};
  draw();o.onclick=e=>{if(e.target===o)close()};document.addEventListener("keydown",onKey);document.body.appendChild(o);try{sfx("open")}catch(e){}}
// rituel Eau du jour (s'il existe et n'est pas fini)
function plWaterRit(){try{ritRoll();return(S.daily.tasks||[]).find(t=>/\beau\b|verre/i.test(t.name)&&(S.daily.c[t.id]||0)<t.n)||null}catch(e){return null}}
// annuler le repas depuis « Annuler » ou le journal : l'assiette et l'état du repas repartent à zéro
function plUndo(e){const[d,k]=e.plk.split(":"),per=e.plp,P=(S.g.plt||{})[d],m=P&&P[k];if(m&&m.bh){const B=plBoss();if(B.h>0)B.h--}if(P)delete P[k];
  const key=d+":"+per,dr=(S.g.mbd||{})[key];if(dr){if(dr.m)delete dr.m[k];if(dr.cr)delete dr.cr[k]}if(S.g.mb&&S.g.mb[key]){if(dr)Object.keys(S.g.mb[key].m||{}).forEach(q=>{if(q!==k&&dr.m[q]==null){dr.m[q]=S.g.mb[key].m[q];dr.cr=dr.cr||{};dr.cr[q]=1}});delete S.g.mb[key]}}

// ---- Boss d'assiette : chaque assiette complète (les 3 côtés) lui retire 1 PV
const PL_BOSS=[["Gloutonnet","slime","#8bc34a",5],["Sucrétin","ghost","#ff9ec0",7],["Frittosaure","dragon","#f0a020",10]],PL_BOSS_XP=50;
function plBoss(){const G=S.g;if(!G.plb||typeof G.plb!=="object")G.plb={i:0,h:0};const B=G.plb,b=PL_BOSS[B.i%PL_BOSS.length],tier=Math.floor(B.i/PL_BOSS.length);B.n=b[0];B.sp=b[1];B.col=b[2];B.hp=b[3]+tier*3;B.tier=tier;return B}
function plBossHit(m){if(m.bh||!["f","p","l"].every(s=>plN(m,s)))return null;m.bh=1;const B=plBoss(),n=B.n;B.h++;if(B.h<B.hp)return{n,left:B.hp-B.h};
  B.i++;B.h=0;addBonus("Boss vaincu : "+n,PL_BOSS_XP,0,"plbw");S.g.bchests=(S.g.bchests||0)+1;return{n,win:1}}
function plBossFx(r){try{sfx(r.win?"level":"hit")}catch(e){}toast(r.win?`<span class="p">${esc(r.n)}</span> est vaincu ! +${PL_BOSS_XP} XP et un coffre`:`Assiette complète : <span class="p">${esc(r.n)}</span> perd 1 PV (encore ${r.left})`);try{render()}catch(e){}}
// série : jours d'affilée avec des légumes (aujourd'hui compte s'il y en a, sinon on part d'hier)
function plVegRun(){let n=0;const d=new Date();if(!plTot(dayKey(d)).l)d.setDate(d.getDate()-1);for(let i=0;i<400;i++){if(!plTot(dayKey(d)).l)break;n++;d.setDate(d.getDate()-1)}return n}
try{const _bd=badgeDefs;badgeDefs=function(){const B=_bd.apply(this,arguments);B.push({id:"veg7",name:"Potager",desc:"Des légumes 7 jours d'affilée",ic:"heart",t:2,ok:()=>plVegRun()>=7});return B}}catch(e){}
try{const _fo=famOf;famOf=function(id){return id==="veg7"?"reg":_fo(id)}}catch(e){}
function plName(s,id){const f=PL_SIDES.find(z=>z[0]===s)[4].find(z=>z[0]===id);return f?f[1]:id}
function plSave(tk,k,m){const P=S.g.plt=S.g.plt||{};(P[tk]=P[tk]||{})[k]=m;const lim=dayKey(Date.now()-120*864e5);Object.keys(P).forEach(d=>{if(d<lim)delete P[d]});save()}
// totaux d'une journée (déjeuner + dîner)
function plTot(d){const D=plDay(d),t={f:0,p:0,l:0,x:{yaourt:0,fromage:0,eau:0},n:0};MB_PLM.forEach(k=>{const m=D[k];if(!m)return;t.n++;["f","p","l"].forEach(s=>t[s]+=plN(m,s));PL_X.forEach(([id])=>{if((m.x||{})[id])t.x[id]++})});return t}

// Aujourd'hui : petite assiette du jour sous les repas (dès qu'un repas est rempli)
function plateDay(row){if(!row||!row.parentElement)return;const t=plTot(dayKey(Date.now()));let e=row.parentElement.querySelector(".pldy");
  if(!t.n&&!S.g.plb){if(e)e.remove();return}const B=plBoss(),run=plVegRun(),st=JSON.stringify([t,B.i,B.h,run]);if(e&&e.dataset.k===st)return;
  if(!e){e=document.createElement("div");e.className="pldy";row.after(e)}e.dataset.k=st;
  const miss=PL_SIDES.filter(([s])=>!t[s]).map(([,l])=>l.toLowerCase());
  e.innerHTML=`<div class="pldp">${plSvg(t)}</div><div class="pldt"><b>${!t.n?"Pas encore d'assiette aujourd'hui":miss.length?"Il manque : "+miss.join(", "):"Assiette complète aujourd'hui"}</b><div class="pldl">${PL_SIDES.map(([s,l,c1,c2])=>`<span style="--pc:${c2}"><i></i>${l} ${t[s]}</span>`).join("")}</div><div class="pldx">${PL_X.map(([id,l,ic])=>`<span class="${t.x[id]?"on":""}" title="${l}">${rkSvg(ic)}<em>${t.x[id]}</em></span>`).join("")}${run>1?`<span class="on plrun" title="Jours d'affilée avec des légumes">${rkSvg("legume")}<em>${run} j de suite</em></span>`:""}</div></div>
  <div class="plboss" style="--bc:${B.col}"><span class="plbs">${spriteSvg(B.sp,B.col,3)}</span><div><b>${esc(B.n)}${B.tier?" <small>· revanche</small>":""}</b><small>Chaque assiette complète lui retire 1 PV</small><div class="plpv" aria-label="${B.hp-B.h} PV sur ${B.hp}">${Array.from({length:B.hp},(_,i)=>`<i class="${i<B.hp-B.h?"on":""}"></i>`).join("")}</div></div></div>`}

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
(function(){try{const G=S&&S.g;if(!G||G.dst26)return;G.dst26=1;const a=Date.UTC(2026,9,25,2),b=a+36e5,A="2026-10-25",Z="2026-10-24",win=t=>t>=a&&t<b;
  const hit=(S.log||[]).filter(e=>e.a==="mb"&&win(e.t)).map(e=>e.name),mb=G.mb||{},D=G.mbd||{},P=G.plt||{};let n=0;
  ["matin","soir"].forEach(per=>{const ka=A+":"+per,kz=Z+":"+per,whole=mb[ka]&&win(mb[ka].t);
    MB[per].forEach(([k,l])=>{if(!whole&&!hit.includes(l))return;const s=D[ka];
      if(s&&s.m&&k in s.m){const t=D[kz]=D[kz]||{m:{},ex:{},w:{}};t.cr=t.cr||{};if(!(k in t.m)){t.m[k]=s.m[k];t.cr[k]=1}delete s.m[k];if(s.cr)delete s.cr[k];n++}
      if(P[A]&&P[A][k]){(P[Z]=P[Z]||{})[k]=P[A][k];delete P[A][k];n++}});
    if(whole){if(!mb[kz])mb[kz]=mb[ka];delete mb[ka];n++}});
  save();if(n){try{render()}catch(e){}}}catch(e){}})();
