// ---- Standards globaux de l'appli (voir CLAUDE.md, « Standards de l'appli »)
// Jamais de zoom : ni pincement, ni double-tap (géré par touch-action en CSS ; iOS ignore parfois user-scalable=no).
["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener("touchmove",e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
// Quêtes spéciales : chaque carte a une icône pixel en bas à droite (celles qui n'en ont pas reçoivent celle de leur catégorie)
const SQ_IC={maison:"canape",sport:"halteres",soi:"medit",nourriture:"repas",travail:"ecran",perso:"micro",social:"coeur",famille:"famille",eau:"verre"};
function sqIcons(){document.querySelectorAll("#sqBox .sq").forEach(c=>{if(c.querySelector(".uiq"))return;const t=((c.querySelector(".sqn")||{}).textContent||"").trim(),q=(S.specials||[]).find(x=>x.name===t)||{},ic=SQ_IC[q.cat]||"etoile";
  const sp=document.createElement("span");sp.className="uiq";sp.innerHTML=rkSvg(RKI[ic]?ic:"etoile");c.appendChild(sp)})}
{let q=0;const run=()=>{q=0;try{sqIcons()}catch(e){}};new MutationObserver(()=>{if(!q)q=requestAnimationFrame(run)}).observe(document.body,{childList:true,subtree:true});run()}
