// Démarrage : premier rendu complet une fois tous les scripts chargés, et bouton « Déjà fait » des minuteurs.
// Plus aucune retouche globale : chaque écran (Aujourd'hui, Moi, Proches, profil) se dessine dans sa forme finale.
try{if(S&&S.g)render()}catch(e){console.warn("init",e)}
try{renderFiche()}catch(e){}


// Minuteurs (gainage, étirements, course, méditation, pompes) : bouton « Déjà fait » dans la fenêtre, appelé par gnOpen, stOpen, runOpen, mdOpen, puOpen
function puDejaFait(btn){try{const o=[...document.querySelectorAll(".pu")].pop(),pb=o&&o.querySelector(".pub");if(pb&&btn&&!pb.querySelector(".pudone")){const d=document.createElement("button");d.type="button";d.className="lnk pudone";d.textContent="Déjà fait";d.onclick=()=>{o.remove();qPass(btn)};pb.appendChild(d);o.addEventListener("click",e=>{if(e.target.closest("#puOk,.pupad"))d.hidden=true},true)}}catch(e){}}
