// ===== Scènes des fenêtres (03/11) : chaque fenêtre ouverte par un appui a son petit décor pixel en haut.
// uiScene(icône, couleur, {rays, sub}) : bandeau en marches de couleur (la couleur du sujet : catégorie, or, proche),
// halo pixel derrière une grande icône (64 px), étincelles fixes, ligne pixel en pointillés en bas. Rien ne bouge tout seul.
Object.assign(RKI,{
  cadenas:["................",".....oooooo.....","....okkkkkko....","...okkooookKo...","...okKo..oKKo...","...okKo..oKKo...","...okKo..oKKo...",".oooooooooooooo.",".oyyyyyyyyyyyYo.",".oyYYYYYYYYYYno.",".oyYYYYooYYYYno.",".oyYYYYooYYYYno.",".oyYYYYooYYYYno.",".oyYYYYYYYYYYno.",".oYnnnnnnnnnnno.",".oooooooooooooo."],
  // cadeau ouvert : le couvercle soulevé, des étincelles qui sortent
  cadeauo:["..y.......y.....","...y..o..y......","......oo........","..oooooooooooo..",".ommmmmyymmmmMo.",".oMMMMMyYMMMMMo.","..oooooooooooo..","...y..y..y......","..oooooooooooo..","..ommmmyymmmMo..","..ommmmyYmmmMo..","..oyyyyyYyyyYo..","..ommmmyYmmmMo..","..oMMMMyYMMMMo..","..oMMMMYYMMMMo..","..oooooooooooo.."]
});
const SC_DOTS=[[6,4],[13,9],[22,3],[58,5],[73,3],[30,14],[50,15],[9,16]];
function uiScene(ic,col,o){o=o||{};col=col||"var(--ui-or,#ffd94a)";const W=80,H=24,cx=40,cy=12;let r="";
  // fond : marches de couleur, de plus en plus claires vers le sol
  [[0,6,.08],[6,6,.13],[12,6,.19],[18,6,.27]].forEach(([y,h,a])=>r+=`<rect x="0" y="${y}" width="${W}" height="${h}" style="fill:${col}" fill-opacity="${a}"/>`);
  // rayons (moments à fêter) : 8 branches en escalier
  if(o.rays)for(let i=0;i<16;i++){const a=i*Math.PI/8;if(i%2)continue;for(let d=7;d<46;d+=1){const x=Math.round(cx+Math.cos(a)*d),y=Math.round(cy+Math.sin(a)*d*.62);if(x<0||x>=W||y<0||y>=H)continue;r+=`<rect x="${x}" y="${y}" width="1" height="1" style="fill:${col}" fill-opacity=".32"/>`}}
  // halo : losanges pixel concentriques derrière l'icône
  [[17,10,.14],[13,8,.2],[9,6,.28]].forEach(([sx,sy,a])=>{for(let y=-sy;y<=sy;y++){const hw=Math.round(Math.sqrt(Math.max(0,1-(y/(sy+.5))**2))*sx);if(hw)r+=`<rect x="${cx-hw}" y="${cy+y}" width="${hw*2}" height="1" style="fill:${col}" fill-opacity="${a}"/>`}});
  // étincelles crème, toujours à la même place
  SC_DOTS.forEach(([x,y],i)=>{r+=i%3?`<rect x="${x}" y="${y}" width="1" height="1" fill="#fff7e6" fill-opacity=".7"/>`:`<path d="M${x} ${y-1}h1v1h1v1h-1v1h-1v-1h-1v-1h1z" fill="#fff7e6" fill-opacity=".85"/>`});
  // sol : ombre sous l'icône + ligne en pointillés
  r+=`<rect x="${cx-6}" y="20" width="12" height="1" fill="#000" fill-opacity=".35"/><rect x="${cx-4}" y="21" width="8" height="1" fill="#000" fill-opacity=".25"/>`;
  for(let x=0;x<W;x+=2)r+=`<rect x="${x}" y="23" width="1" height="1" style="fill:${col}"/>`;
  const art=typeof ic==="string"?rkSvg(ic):ic&&ic.html||"";
  return`<div class="ui-scene${o.rays?" ui-scene--fete":""}" style="--sc:${col}" aria-hidden="true"><svg class="ui-scene__fond" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">${r}</svg><span class="ui-scene__ic">${art}</span>${o.sub?`<span class="ui-scene__sub">${o.sub}</span>`:""}</div>`}
// icône d'un message (toast), devinée d'après son texte
const TOAST_IC=[[/cadeau/i,"cadeau"],[/boost|×2|x2/i,"eclair"],[/période|calendrier|événement/i,"calendrier"],[/supprim|retir/i,"poubelle"],[/niveau/i,"medaille"],[/palier/i,"medaille"],[/XP/,"etoile"],[/noté|fait|ajouté|enregistr/i,"check"]];
function toastIc(html){const t=String(html).replace(/<[^>]+>/g,"");const m=TOAST_IC.find(([re])=>re.test(t));return m?m[1]:"etoile"}
