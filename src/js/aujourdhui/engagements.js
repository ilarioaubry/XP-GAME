// Engagements (28/10, point Q.8) : le matin tu choisis 1 à 3 engagements, le soir Bonne nuit les valide (+15 XP chacun tenu).
// « Sans cigarette » et « Moins de N cigarettes » se vérifient tout seuls avec le compteur ; les autres : « Tenu » ou « Pas cette fois ».
// Données : S.g.eng = {lib:[{id,n}] (tes engagements écrits), d:{jour:[{id,k:"sans"|"max",n,lim?,res?}]}, skip: jour où la carte a été fermée}
const ENG_XP=15,ENG_MAX=3;
const ENG_DEF=[["cig","Sans cigarette","cigarette",1],["cigmax","Moins de N cigarettes","cigarette",1],["soda","Sans soda","soda"],["sucre","Sans sucre","cookie"],["grign","Sans grignotage","cookie"],["res","Sans réseaux","tel"]];
let engPick=[],engLim=5,engAdd=false;
function engS(){const G=S.g;if(!G.eng||typeof G.eng!=="object")G.eng={};const E=G.eng;if(!Array.isArray(E.lib))E.lib=[];if(!E.d||typeof E.d!=="object")E.d={};return E}
function engToday(){return engS().d[dayKey(Date.now())]||[]}
function engCig(tk){return((S.g.cig||{})[tk||dayKey(Date.now())])||0}
function engAuto(e){return e.id==="cig"||e.id==="cigmax"}
function engOk(e,tk){return e.id==="cig"?engCig(tk)===0:e.id==="cigmax"?engCig(tk)<e.lim:null}
function engIc(id){const D=ENG_DEF.find(x=>x[0]===id);return rkSvg(D&&RKI[D[2]]?D[2]:"etoile")}
function engOpts(){const cig=!!(((S.g.vie||{}).track||{}).cig);return[...ENG_DEF.filter(d=>cig||!d[3]).map(([id,n])=>({id,n})),...engS().lib]}
function engName(o){return o.id==="cigmax"?"Moins de "+engLim+" cigarettes":o.n}
function renderEng(){const box=document.getElementById("engBox");if(!box||!S||!S.g)return;const E=engS(),tk=dayKey(Date.now()),T=E.d[tk]||[];
  const choose=!T.length&&E.skip!==tk&&dayH()<12;
  if(!T.length&&!choose){box.innerHTML="";box.classList.add("voff");return}box.classList.remove("voff");
  if(choose){const O=engOpts();
    box.innerHTML=`<div class="head"><h2>Engagements<span class="count">${engPick.length}/${ENG_MAX}</span></h2><button type="button" class="btn engx" aria-label="Pas aujourd'hui" title="Pas aujourd'hui">${ICO("close",24)}</button></div><p class="engsub">Pour aujourd'hui, tu t'engages à…</p>
      <div class="engch">${O.map(o=>`<button type="button" class="engo" data-e="${esc(o.id)}" aria-pressed="${engPick.includes(o.id)}"><span class="engi">${engIc(o.id)}</span><span></span></button>`).join("")}${engAdd?`<span class="engin"><input maxlength="40" placeholder="ex. Pas de téléphone au lit" aria-label="Ton engagement"><button type="button" class="btn primary engok">Ajouter</button></span>`:`<button type="button" class="btn engplus" aria-label="Écrire un engagement" title="Écrire un engagement">${ICO("plus",24)}</button>`}</div>
      ${engPick.includes("cigmax")?`<div class="englim"><span>Moins de</span><button type="button" class="btn" data-l="-1" aria-label="Moins">−</button><b class="ui-compteur">${engLim}</b><button type="button" class="btn" data-l="1" aria-label="Plus">+</button><span>cigarettes</span></div>`:""}
      <button type="button" class="btn primary enggo"${engPick.length?"":" disabled"}>Je m'engage</button>`;
    box.querySelectorAll(".engo").forEach((b,i)=>{b.querySelector("span:last-child").textContent=engName(O[i]);b.onclick=()=>{const id=O[i].id;if(engPick.includes(id))engPick=engPick.filter(x=>x!==id);else{if(engPick.length>=ENG_MAX){toast(ENG_MAX+" engagements au plus");return}engPick.push(id);if(id==="cig")engPick=engPick.filter(x=>x!=="cigmax");if(id==="cigmax")engPick=engPick.filter(x=>x!=="cig")}try{sfx("blip")}catch(e){}renderEng()}});
    box.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{engLim=Math.max(1,Math.min(30,engLim+(+b.dataset.l)));renderEng()});
    box.querySelector(".engx").onclick=()=>{E.skip=tk;save();renderEng()};
    const pl=box.querySelector(".engplus");if(pl)pl.onclick=()=>{engAdd=true;renderEng();const i=box.querySelector(".engin input");if(i)i.focus()};
    const ai=box.querySelector(".engin input");if(ai){const go=()=>{const v=ai.value.trim();engAdd=false;if(v){const o={id:"u"+Date.now().toString(36),n:v.charAt(0).toUpperCase()+v.slice(1)};E.lib.push(o);while(E.lib.length>12)E.lib.shift();if(engPick.length<ENG_MAX)engPick.push(o.id);save()}renderEng()};box.querySelector(".engok").onclick=go;ai.onkeydown=e=>{if(e.key==="Enter")go();if(e.key==="Escape"){engAdd=false;renderEng()}}}
    box.querySelector(".enggo").onclick=ev=>{const O2=engOpts();E.d[tk]=engPick.map(id=>{const o=O2.find(x=>x.id===id);return{id,k:id==="cigmax"?"max":"sans",n:engName(o),...(id==="cigmax"?{lim:engLim}:{})}});engPick=[];
      const ks=Object.keys(E.d).sort();while(ks.length>60)delete E.d[ks.shift()];save();try{sfx("blip")}catch(e){}toast("C'est noté. On en reparle ce soir.");renderEng()};return}
  box.innerHTML=`<div class="head"><h2>Engagements<span class="count">${T.filter(e=>e.res===1||e.res===undefined&&engOk(e)===true).length}/${T.length}</span></h2></div><ul class="engl">${T.map(e=>{const a=engAuto(e),c=engCig(tk);
    const st=e.res===1?"Tenu":e.res===0?"Pas cette fois":e.id==="cigmax"?c+" / "+e.lim+" aujourd'hui":e.id==="cig"?(c?c+" aujourd'hui":"0 aujourd'hui"):"Ce soir dans Bonne nuit";
    return`<li class="engr${e.res===1?" ok":""}"><span class="engi">${engIc(e.id)}</span><span class="engt"><b></b><small class="ui-info">${st}</small></span></li>`}).join("")}</ul>`;
  box.querySelectorAll(".engr b").forEach((b,i)=>b.textContent=T[i].n)}
