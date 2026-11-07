// ---- Icônes d'interface en pixel art (standard « tout en pixel art ») : grilles 12×12, une seule couleur (currentColor),
// pour garder les couleurs et états actuels des boutons. Remplace ICO() et les anciennes icônes vectorielles au trait.
function pxIco(n,s,cls){const R=PXUI[n];if(!R)return"";let r="";R.forEach((row,y)=>{let x=0;while(x<12){if(row[x]!=="#"){x++;continue}let w=1;while(x+w<12&&row[x+w]==="#")w++;r+=`<rect x="${x}" y="${y}" width="${w}" height="1.02"/>`;x+=w}});
  return`<svg class="ic pxic${cls?" "+cls:""}" viewBox="0 0 12 12" width="${s||16}" height="${s||16}" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}

try{render()}catch(e){}
