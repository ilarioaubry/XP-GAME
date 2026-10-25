// ---- Standards globaux de l'appli (voir CLAUDE.md, « Standards de l'appli »)
// Jamais de zoom : ni pincement, ni double-tap (géré par touch-action en CSS ; iOS ignore parfois user-scalable=no).
["gesturestart","gesturechange","gestureend"].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener("touchmove",e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
