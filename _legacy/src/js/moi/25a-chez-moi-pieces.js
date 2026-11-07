// Chez moi : dessin de chaque pièce (carte des sorties, cuisine, chambre, maison en coupe, sport, studio, vidéoclub) (ex-25, partie 2)
// ---------- CARTE DES SORTIES : une petite ville (128 px)
const HMM2={cine:[2,2],scene:[46,2],resto:[90,2],culture:[2,40],amis:[46,40],loisirs:[90,40],nature:[2,78]};
function hmBld(id,x,y){let s="";const win=(X,Y,c)=>R(X,Y,3,3,OUT)+R(X+1,Y+1,1,1,c||"#ffd94a");
  if(id==="cine"){s+=bx(x+5,y+6,26,18,"#7a6aa0")+R(x+4,y+4,28,4,OUT)+R(x+5,y+5,26,2,"#d1493f")+ptxt("CINE",x+10,y+9,"#ffd94a","#3a2352");
    s+=`<g class="an-twk">`+[0,1,2,3,4,5,6].map(i=>R(x+6+i*4,y+5,1,1,"#fff6c8")).join("")+`</g>`+R(x+7,y+15,6,7,OUT)+R(x+8,y+16,4,5,"#2f6fd6")+R(x+23,y+15,6,7,OUT)+R(x+24,y+16,4,5,"#e8873a")+R(x+15,y+16,6,8,OUT)+R(x+16,y+17,4,7,"#3a2352")+R(x+14,y+24,8,3,"#d63b3b")}
  if(id==="scene"){s+=R(x+4,y+8,28,16,OUT)+R(x+5,y+9,26,14,"#4a3a6a")+R(x+6,y+4,24,5,OUT)+R(x+7,y+5,22,3,"#9a5ce0")+R(x+8,y+3,20,1,OUT)+ptxt("LIVE",x+10,y+10,"#ff9ccc","#2a1c40")+R(x+8,y+16,20,7,"#1a1210")+R(x+8,y+16,3,7,"#d63b3b")+R(x+25,y+16,3,7,"#d63b3b")+R(x+17,y+18,1,5,"#c2c6cf")+R(x+16,y+17,3,2,"#2c2c34")+`<g class="an-twk">`+R(x+12,y+16,2,1,"#ffd94a")+R(x+22,y+16,2,1,"#7fe3ff")+`</g>`}
  if(id==="resto"){s+=bx(x+3,y+7,30,16,"#e9e2d0")+[0,1,2,3,4,5,6,7].map(i=>R(x+3+i*4,y+5,4,4,i%2?"#f2f0ea":"#e8873a")).join("")+R(x+3,y+9,30,1,OUT)+ptxt("RESTO",x+8,y+11,"#8b2f2f")+win(x+6,y+17)+win(x+27,y+17)+R(x+15,y+16,6,7,OUT)+R(x+16,y+17,4,6,"#8b5a2b")+R(x+19,y+20,1,1,"#ffd94a");
    [[x+1,y+25],[x+29,y+25]].forEach(([X,Y])=>{s+=R(X,Y-6,6,2,"#d63b3b")+R(X+1,Y-7,4,1,"#f06b6b")+R(X+3,Y-4,1,4,"#c2c6cf")+R(X+1,Y-1,5,1,"#8b5a2b")})}
  if(id==="culture"){s+=R(x+3,y+22,30,3,"#c9c2b0")+R(x+5,y+20,26,2,"#ddd6c4")+R(x+4,y+9,28,2,OUT)+R(x+5,y+9,26,1,"#f2f0ea")+R(x+8,y+5,20,4,OUT)+R(x+9,y+6,18,3,"#e9e2d0")+R(x+14,y+3,8,2,OUT)+R(x+15,y+4,6,1,"#e9e2d0");
    for(let i=0;i<5;i++)s+=R(x+6+i*5,y+11,3,9,"#f2f0ea")+R(x+8+i*5,y+11,1,9,"#c9c2b0");s+=R(x+5,y+11,26,9,"rgba(0,0,0,0)")+R(x+16,y+14,4,6,OUT)+ptxt("ART",x+12,y+5,"#8a7a50")}
  if(id==="amis"){const hs=(X,c,r)=>R(X,y+12,13,11,OUT)+R(X+1,y+13,11,9,c)+R(X-1,y+10,15,3,OUT)+R(X,y+9,13,2,r)+R(X+2,y+7,9,2,r)+R(X+4,y+6,5,1,r)+R(X+5,y+16,3,6,OUT)+R(X+6,y+17,1,5,"#8b5a2b")+win(X+9,y+14,"#ffe58a")+win(X+1,y+14,"#ffe58a");
    s+=hs(x+3,"#f08cc0","#8b2f2f")+hs(x+20,"#7fc8f8","#2f5d8b")+R(x+2,y+24,32,1,"#f2f0ea")+[0,1,2,3,4,5,6,7].map(i=>R(x+2+i*4,y+23,1,2,"#f2f0ea")).join("")+spr([".h.h.","hhhhh",".hhh.","..h.."],{h:"#ff5fa8"},x+16,y+3)}
  if(id==="loisirs"){s+=bx(x+4,y+6,28,18,"#2c2c34")+R(x+5,y+7,26,6,"#36b679")+ptxt("JEUX",x+10,y+8,"#fff6c8","#1a6a40")+R(x+7,y+15,8,8,OUT)+R(x+8,y+16,6,6,"#9a5ce0")+R(x+9,y+17,4,3,"#7fe3ff")+R(x+21,y+15,8,8,OUT)+R(x+22,y+16,6,6,"#d63b3b")+R(x+23,y+17,4,3,"#ffd94a")+`<g class="an-twk">`+R(x+5,y+7,1,1,"#fff")+R(x+30,y+7,1,1,"#fff")+`</g>`+R(x+16,y+17,4,7,OUT)+R(x+17,y+18,2,6,"#5a5f69")}
  if(id==="nature"){const tree=(X,Y)=>R(X+3,Y+8,2,4,"#6b4a28")+R(X,Y+2,8,7,OUT)+R(X+1,Y+1,6,8,"#2f8b4a")+R(X+1,Y+1,4,3,"#5ac27a")+R(X+2,Y,4,1,OUT)+R(X+5,Y+5,2,3,"#1f6a38");
    s+=R(x+40,y+8,40,14,OUT)+R(x+41,y+9,38,12,"#4aa8e8")+R(x+43,y+7,34,2,"#4aa8e8")+R(x+43,y+21,34,2,"#4aa8e8")+R(x+46,y+11,6,1,"#bfe8ff")+R(x+62,y+16,8,1,"#bfe8ff")+spr(["..yy.","wwwy.",".ww.."],{y:"#ffd94a",w:"#f2f0ea"},x+55,y+12);
    [4,16,28,88,100,112].forEach((X,i)=>{s+=tree(x+X,y+2+(i%2)*4)});s+=R(x+84,y+20,10,2,"#8b5a2b")+R(x+85,y+22,1,2,"#6b4a28")+R(x+92,y+22,1,2,"#6b4a28")+ptxt("PARC",x+4,y+19,"#fff6c8","#1f6a38");
    [[30,20],[36,4],[82,6],[118,18]].forEach(([X,Y])=>{s+=R(x+X,y+Y,1,1,"#ff9ccc")+R(x+X+2,y+Y+1,1,1,"#ffd94a")})}
  return s}
function hmCarte(H){const E=hmEv(H,"carte"),by={},W=128,Hh=106;E.forEach(e=>(by[e.k]=by[e.k]||[]).push(e));
  let s=`<svg class="hmsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" role="group" aria-label="Carte des sorties">`+R(0,0,W,Hh,"#6aa84f");
  for(let y=1;y<Hh;y+=3)for(let x=(y*7)%5;x<W;x+=9)s+=R(x,y,1,1,"#5a9640");
  // routes, trottoirs, passages piétons
  const road=(x,y,w,h)=>R(x,y,w,h,"#5a5a66")+(w>h?R(x,y,w,1,"#9a9aa6")+R(x,y+h-1,w,1,"#9a9aa6"):R(x,y,1,h,"#9a9aa6")+R(x+w-1,y,1,h,"#9a9aa6"));
  s+=road(0,32,W,8)+road(0,70,W,8)+road(38,0,8,78)+road(82,0,8,78);
  for(let x=1;x<W;x+=6)s+=R(x,35,3,1,"#e9e2d0")+R(x,73,3,1,"#e9e2d0");for(let y=1;y<78;y+=6)s+=R(41,y,1,3,"#e9e2d0")+R(85,y,1,3,"#e9e2d0");
  [[38,32],[82,32],[38,70],[82,70]].forEach(([x,y])=>{s+=R(x,y,8,8,"#5a5a66");for(let i=0;i<4;i++)s+=R(x+1+i*2,y-3,1,3,"#f2f0ea")+R(x+1+i*2,y+8,1,2,"#f2f0ea")});
  s+=`<g class="an-car">`+R(4,33,7,4,OUT)+R(5,33,5,3,"#d63b3b")+R(6,33,3,1,"#bfe8ff")+R(5,36,1,1,OUT)+R(9,36,1,1,OUT)+`</g>`;
  Object.keys(HMM2).forEach(id=>{const[x,y]=HMM2[id],w=id==="nature"?124:36,h=id==="nature"?26:30,D=HM_DIST[id],L=by[id]||[],on=L.length>0;
    s+=`<g class="hmo hmd${on?"":" lock"}" data-o="d:${id}" tabindex="0" role="button" aria-label="${D[0]}">`+R(x,y,w,h,id==="nature"?"#5a9a44":"#7fb563")+R(x,y,w,1,"#9acb7c")+hmBld(id,x,y);
    if(!on)s+=R(x,y,w,h,"#141a2e",'opacity=".74"')+[[4,4,12],[w-18,8,14],[8,h-9,16]].map(([cx,cy,cw])=>R(x+cx,y+cy,cw,3,"#c8d0e8",'opacity=".22"')+R(x+cx+2,y+cy-2,cw-5,2,"#c8d0e8",'opacity=".22"')).join("")+R(x+w/2-5,y+h/2-6,11,11,OUT)+R(x+w/2-4,y+h/2-5,9,9,"#2a2a3a")+ptxt("?",x+w/2-1,y+h/2-3,"#e9e2d0");
    s+="</g>";
    const cols=Math.floor((w-4)/5),LL=L.slice(-(id==="nature"?cols:7));LL.forEach((e,i)=>{const fx=id==="nature"?x+3+((i*37)%(w-8)):x+2+i*5,fy=id==="nature"?y+h-9:y+h-8;
      s+=`<g class="hmo hmf" data-o="f:${e.t}" tabindex="0" role="button" aria-label="${esc(H.pl[e.t]||e.o)}">`+R(fx,fy,1,8,"#f2f0ea")+R(fx,fy+7,2,1,OUT)+`<g class="an-wave">`+R(fx+1,fy,4,3,D[1])+R(fx+1,fy,4,1,lt(D[1]))+`</g>`+(H.pl[e.t]?R(fx+2,fy+1,1,1,"#fff"):"")+R(fx-1,fy-1,7,10,"transparent")+"</g>"})});
  const nd=Object.keys(by).length;return{svg:s+"</svg>",sum:`${E.length} sortie${E.length>1?"s":""} · ${nd} quartier${nd>1?"s":""} sur 7 découvert${nd>1?"s":""}`,
    empty:"Chaque sortie plante un drapeau. Les quartiers s'éclairent quand tu y vas.",
    info(o){if(o.startsWith("d:")){const id=o.slice(2),D=HM_DIST[id],L=by[id]||[];if(!L.length)return hmPop("Quartier à découvrir",D[0],hmRow("sablier","Pour l'éclairer",id==="amis"?"passer voir un proche":"une sortie : "+D[2].slice(0,3).join(", ").toLowerCase()));
        const cnt={};L.forEach(e=>e.w.forEach(p=>cnt[p]=(cnt[p]||0)+1));const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
        return hmPop("Quartier",D[0],hmRow("paysage","Sorties",L.length)+hmRow("calendrier","Dernière",hmFd(L[L.length-1].t))+(top.length?hmRow("duo","Souvent avec",esc(top.join(", "))):""))}
      const e=E.find(x=>"f:"+x.t===o);if(!e)return"";return hmPop(HM_DIST[e.k][0],H.pl[e.t]||e.o,(e.o!==(H.pl[e.t]||e.o)||e.k!=="amis"?hmRow("paysage","Sortie",esc(e.o)):"")+hmRow("calendrier","Le",hmFd(e.t))+(e.w.length?hmRow("duo","Avec",esc(hmWho(e.w))):"")+hmRow("eclair","XP","+"+e.x),
        `<div class="hmname"><input maxlength="60" placeholder="Nom du lieu" aria-label="Nom du lieu" value="${esc(H.pl[e.t]||"")}" data-pt="${e.t}"><button type="button" class="btn" data-ps="${e.t}">OK</button></div>`)}}};

// ---------- CUISINE (128 px)
const HMC_FILL={"Repas maison":["#6fbf5a","#4a8f3a","pasta"],"Nouveau plat":["#e8873a","#b85f1f","beans"],"Pâtisserie":["#f08cc0","#c25a8d","jam"],"Préparer demain":["#5a93c2","#2f5d8b","rice"]};
function hmCuisine(H){const E=hmEv(H,"cuisine"),W=128,rows=hmShelf(E.map((e,i)=>({e,i,w:7})),{U:60,gap:1,min:2}),RH=14,top=8,shH=rows.length*RH,Hh=top+shH+52;
  let s=`<svg class="hmsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" role="group" aria-label="Cuisine">`;
  s+=shell(W,Hh,{wall:"#efe6d2",wall2:"#ddd2b8",pat:"tile",floor:"#c9b48c",floor2:"#b39d74",fh:12,base:"#8b5a2b"});
  // sol en damier
  const fy=Hh-12;for(let y=fy;y<Hh;y+=4)for(let x=((y-fy)/4|0)%2?0:4;x<W;x+=8)s+=R(x,y,4,4,"#a8916a");s+=dith(0,Hh-3,W,3,"#6b5a40");
  // fenêtre avec rideaux et plante
  s+=R(76,6,30,24,OUT)+R(77,7,28,22,"#9fd8f5")+R(77,7,28,4,"#c4ecff")+R(80,20,8,9,"#6fbf5a")+R(86,17,10,12,"#5aa848")+R(94,21,10,8,"#6fbf5a")+R(97,11,5,5,"#fff6c8")+R(77,17,28,1,OUT)+R(90,7,1,22,OUT);
  s+=R(72,4,8,30,"#d63b3b")+R(73,4,2,30,"#f06b6b")+dithRow(72,12,8,"#a82a2a",2)+dithRow(72,20,8,"#a82a2a",2,1)+R(102,4,8,30,"#d63b3b")+R(103,4,2,30,"#f06b6b")+dithRow(102,12,8,"#a82a2a",2)+R(70,3,42,2,"#8b5a2b");
  s+=R(74,30,34,3,"#f2f0ea")+R(74,32,34,1,"#c9c2b0")+plant(86,21);
  // ustensiles suspendus
  s+=R(110,8,16,1,"#8a8f99")+R(112,9,1,10,"#c2c6cf")+R(111,18,3,3,"#c2c6cf")+R(116,9,1,9,"#8b5a2b")+R(115,17,3,4,"#2c2c34")+R(121,9,1,8,"#c2c6cf")+R(120,16,3,5,"#c2c6cf")+R(121,17,1,3,"#efe6d2");
  // étagères de bocaux
  const sx=4,sw=66;rows.forEach((r,ri)=>{const yb=top+ri*RH+12;s+=R(sx,yb,sw,3,OUT)+R(sx,yb,sw,2,"#a0703e")+R(sx,yb,sw,1,"#c9935a")+R(sx+3,yb+3,2,3,"#6b4a28")+R(sx+sw-5,yb+3,2,3,"#6b4a28")+dith(sx+1,yb+3,sw-2,1,"#c9bca0");
    r.forEach(it=>{const e=it.e,x0=sx+3+it.x,F=HMC_FILL[e.o]||HMC_FILL["Repas maison"],nm=!!H.nm[e.t];let g=`<g class="hmo" data-o="j:${e.t}" tabindex="0" role="button" aria-label="${esc(H.nm[e.t]||e.o)}">`;
      g+=R(x0,yb-10,7,10,OUT)+R(x0+1,yb-9,5,9,"#d8eef5")+R(x0+1,yb-6,5,6,F[0]);
      if(F[2]==="pasta")g+=R(x0+2,yb-5,1,1,F[1])+R(x0+4,yb-3,1,1,F[1])+R(x0+2,yb-2,2,1,F[1]);else if(F[2]==="beans")g+=R(x0+1,yb-5,1,1,F[1])+R(x0+3,yb-4,1,1,F[1])+R(x0+5,yb-2,1,1,F[1])+R(x0+2,yb-2,1,1,F[1]);else if(F[2]==="jam")g+=R(x0+1,yb-6,5,1,lt(F[0]))+R(x0+2,yb-3,3,1,F[1]);else g+=dith(x0+1,yb-5,5,4,F[1]);
      g+=R(x0+1,yb-9,1,7,"#ffffff")+R(x0,yb-12,7,3,OUT)+R(x0+1,yb-11,5,1,nm?"#d63b3b":"#a0703e")+(nm?R(x0+2,yb-5,3,2,"#f3e6c4")+R(x0+2,yb-4,3,1,"#c9a066"):"");
      s+=g+R(x0-.5,yb-13,8,13,"transparent")+"</g>"})});
  // plan de travail et meubles bas
  const cy=Hh-36;s+=R(0,cy,W,4,OUT)+R(0,cy,W,3,"#b98250")+R(0,cy,W,1,"#dba878")+R(0,cy+4,W,20,"#7a5230");
  for(let x=2;x<W;x+=21)s+=R(x,cy+6,19,16,OUT)+R(x+1,cy+7,17,14,"#8b5e36")+R(x+1,cy+7,17,1,"#a87445")+R(x+15,cy+12,1,4,"#e9e2d0");
  // four et plaque
  s+=R(44,cy+5,24,19,OUT)+R(45,cy+6,22,17,"#c2c6cf")+R(47,cy+9,18,11,OUT)+R(48,cy+10,16,9,"#3a2a1c")+R(49,cy+11,14,7,"#e8873a")+R(49,cy+11,14,2,"#ffb03d")+R(47,cy+7,2,1,"#2c2c34")+R(51,cy+7,2,1,"#2c2c34")+R(59,cy+7,2,1,"#2c2c34")+R(63,cy+7,2,1,"#2c2c34");
  s+=R(42,cy-2,28,2,"#2c2c34")+R(46,cy-1,6,1,"#e8473a")+R(60,cy-1,6,1,"#e8473a");
  // marmite fumante
  s+=R(45,cy-12,14,10,OUT)+R(46,cy-11,12,9,"#8a8f99")+R(46,cy-11,12,1,"#c2c6cf")+R(47,cy-9,2,6,"#a5abb5")+R(43,cy-9,3,2,OUT)+R(58,cy-9,3,2,OUT)+R(44,cy-14,16,2,"#5a5f69")+R(51,cy-16,2,2,"#2c2c34");
  s+=`<rect class="an-steam" x="48" y="${cy-21}" width="2" height="4" fill="#ffffff" opacity=".8"/><rect class="an-steam d2" x="54" y="${cy-22}" width="2" height="5" fill="#ffffff" opacity=".7"/>`;
  // planche à découper + légumes
  s+=R(6,cy-4,22,4,OUT)+R(7,cy-3,20,2,"#d8a868")+R(9,cy-6,5,3,"#e8473a")+R(10,cy-7,2,1,"#5ac27a")+R(16,cy-5,6,2,"#f08a2a")+R(21,cy-6,2,1,"#5ac27a")+R(24,cy-5,2,2,"#f2f0ea");
  // carnet de recettes ouvert sur un lutrin
  s+=`<g class="hmo" data-o="book" tabindex="0" role="button" aria-label="Carnet de recettes">`+R(82,cy-14,24,14,OUT)+R(83,cy-13,10,11,"#f3e6c4")+R(95,cy-13,10,11,"#efe2bf")+R(93,cy-13,2,12,"#8b2f2f")+R(84,cy-11,7,1,"#8a8f99")+R(84,cy-9,8,1,"#c9bca0")+R(84,cy-7,6,1,"#c9bca0")+R(96,cy-11,7,1,"#8a8f99")+R(96,cy-9,6,1,"#c9bca0")+R(96,cy-7,8,1,"#c9bca0")+R(97,cy-5,4,2,"#e8873a")+R(86,cy-2,16,2,"#6b4a28")+R(81,cy-15,26,16,"transparent")+"</g>";
  // corbeille de fruits
  s+=R(110,cy-5,14,5,OUT)+R(111,cy-4,12,3,"#c9935a")+dithRow(111,cy-3,12,"#8b5a2b",2)+R(112,cy-9,4,4,"#e8473a")+R(116,cy-10,4,5,"#f4d767")+R(120,cy-8,3,3,"#6fbf5a")+R(113,cy-9,1,1,"#ff8a7a");
  const Rc=S.g.rcp||[];
  return{svg:s+"</svg>",sum:`${E.length} plat${E.length>1?"s":""} cuisiné${E.length>1?"s":""} · ${(q=>q+(q>1?" nouveaux plats":" nouveau plat"))(E.filter(e=>e.o==="Nouveau plat").length)} · ${Rc.length} recette${Rc.length>1?"s":""}`,
    empty:"Chaque plat cuisiné ajoute un bocal sur l'étagère.",
    info(o){if(o==="book")return"";const e=E.find(x=>"j:"+x.t===o);if(!e)return"";return hmPop(e.o,H.nm[e.t]||e.o,hmRow("calendrier","Le",hmFd(e.t))+(e.w.length?hmRow("duo","Avec",esc(hmWho(e.w))):"")+hmRow("eclair","XP","+"+e.x),hmName(H,e,"Nom du plat","Nom du plat"))},
    extra:hmRecipes()}};

// ---------- CHAMBRE (128 px)
function hmChambre(){const W=128,Hh=80,G=S.g,ng=(G.gear||[]).length,nb=(G.nb||[]).length;
  let s=`<svg class="hmsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" role="img" aria-label="Chambre">`;
  s+=shell(W,Hh,{wall:"#3b3358",wall2:"#433a63",pat:"dots",floor:"#7a5838",floor2:"#6a4a2e",fh:18,base:"#2a2340"});
  // fenêtre de nuit
  s+=R(44,6,30,24,OUT)+R(45,7,28,22,"#152045")+R(45,7,28,3,"#1d2a5a")+[[48,10],[66,9],[58,14],[70,20],[50,22]].map(([x,y])=>`<rect class="an-twk" x="${x}" y="${y}" width="1" height="1" fill="#fff6c8"/>`).join("")+R(62,11,5,5,"#f4f0c8")+R(63,11,4,1,"#fff")+R(45,18,28,1,OUT)+R(59,7,1,22,OUT)+R(42,30,34,3,"#e9e2d0")+R(42,32,34,1,"#b5ad98");
  s+=R(40,4,6,28,"#5a3f8a")+R(41,4,2,28,"#7a5aaa")+R(72,4,6,28,"#5a3f8a")+R(73,4,2,28,"#7a5aaa")+R(38,3,42,2,"#8b5a2b");
  // armoire
  s+=bx(4,16,24,46,"#8b5a2b")+R(15,18,1,42,OUT)+R(6,18,9,42,"#a06a36")+R(16,18,10,42,"#9a6432")+R(6,18,9,1,"#c08850")+R(13,36,1,4,"#f4d767")+R(17,36,1,4,"#f4d767")+R(4,14,24,3,OUT)+R(5,14,22,2,"#6b4024")+(ng?R(8,10,8,4,"#2f6fd6")+R(17,11,6,3,"#d63b3b"):"");
  // étagère à trophées
  s+=R(86,14,36,3,OUT)+R(86,14,36,2,"#a0703e")+R(86,14,36,1,"#c9935a");for(let i=0;i<Math.min(6,Math.max(1,nb));i++){const x=88+i*6;s+=R(x,8,5,6,OUT)+R(x+1,9,3,3,i%3===0?"#f4d767":i%3===1?"#e1e5ec":"#e0a065")+R(x+2,12,1,1,"#c9a227")+R(x+1,13,3,1,"#6b4024")}
  // poster
  s+=R(90,19,22,16,OUT)+R(91,20,20,14,"#2f6fd6")+R(93,22,7,7,"#ffd94a")+R(101,25,8,6,"#d63b3b")+R(91,30,20,4,"#1a3a6a")+ptxt("GO",101,21,"#fff");
  // lit
  s+=R(34,44,58,4,OUT)+R(34,40,4,22,OUT)+R(35,41,2,20,"#6b4024")+R(90,48,3,14,OUT)+R(36,48,56,12,OUT)+R(37,48,54,10,"#2f6fd6")+R(37,48,54,1,"#5a93c2")+dithRow(37,52,54,"#2a5ab0",3)+dithRow(37,55,54,"#2a5ab0",3,1)+R(38,44,14,6,OUT)+R(39,45,12,4,"#f2f0ea")+R(39,45,12,1,"#ffffff")+R(54,46,36,3,"#5a93c2")+R(37,58,54,2,"#1f4a8a")+R(38,60,2,4,OUT)+R(88,60,2,4,OUT);
  // table de nuit + lampe
  s+=bx(96,50,14,12,"#8b5a2b")+R(99,55,8,1,"#c9a066")+R(101,44,4,6,"#5a5f69")+R(98,38,10,7,OUT)+R(99,39,8,5,"#ffe58a")+R(99,39,8,1,"#fff6c8");
  // tapis + chaise avec vêtements
  s+=R(30,66,64,8,"#8a3d68")+R(32,67,60,6,"#a64d80")+dithRow(32,69,60,"#c26a9a",3)+dithRow(32,71,60,"#c26a9a",3,1);
  s+=R(114,46,10,3,OUT)+R(115,46,8,2,"#8b5a2b")+R(114,40,2,8,OUT)+R(115,49,1,13,"#6b4024")+R(122,49,1,13,"#6b4024")+R(116,44,7,5,"#36b679")+R(116,44,7,1,"#6fe0a0");
  return{svg:s+"</svg>",sum:"Ta garde-robe et tes badges",empty:"",info(){return""}}};

// ---------- MAISON EN COUPE
const HMH_SLOT={chambre:[6,34],biblio:[66,34],studio:[6,76],video:[66,76],cuisine:[6,118],sport:[66,118]},HMH_W=58,HMH_H=36;
function hmLibMini(){const G=S.g;try{return libSvg(libLayout(G.books||[],G.book)).replace('<svg class="libsvg"','<svg')}catch(e){return""}}
function hmThumb(H,id){let inner="";try{if(id==="biblio")inner=hmLibMini();else{const D=hmRoomData(H,id);inner=D?D.svg:""}}catch(e){inner=""}
  const m=inner.match(/viewBox="0 0 (\d+) (\d+)"/);if(!m)return"";const vw=+m[1],vh=+m[2];const body=inner.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"").replace(/class="hmo[^"]*"/g,"").replace(/ tabindex="0" role="button"/g,"").replace(/aria-label="[^"]*"/g,"");
  return`<svg x="0" y="0" width="${HMH_W}" height="${HMH_H}" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMax slice">${body}</svg>`}
function hmHouseSvg(H,lit){const W=128,Hh=184,h=new Date().getHours(),night=h<7||h>=20;
  let s=`<svg class="hmhsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" aria-hidden="true">`;
  // ciel
  const sky=night?["#0d1230","#18204a","#24306a"]:["#6fb6ea","#8fc8f0","#b4dcf6"];s+=R(0,0,W,Hh,sky[0])+R(0,40,W,40,sky[1])+R(0,80,W,80,sky[2]);s+=dith(0,38,W,4,sky[1])+dith(0,78,W,4,sky[2]);
  if(night){[[8,6],[22,14],[40,4],[100,8],[116,18],[90,24],[12,30],[118,40],[6,60],[122,70]].forEach(([x,y],i)=>s+=`<rect${i%3?"":` class="an-twk"`} x="${x}" y="${y}" width="1" height="1" fill="#fff6c8"/>`);s+=R(104,4,8,8,"#f4f0c8")+R(102,6,2,4,"#f4f0c8")+R(106,3,4,1,"#f4f0c8")+R(108,5,3,3,"#d8d2a8")}
  else{s+=R(104,4,10,10,"#fff6c8")+R(102,7,14,4,"#fff6c8")+R(107,2,4,14,"#fff6c8")+glow(109,9,14,"#fff6c8",.2);[[10,10],[70,16]].forEach(([x,y])=>s+=R(x,y,18,4,"#ffffff")+R(x+4,y-3,10,3,"#ffffff")+R(x,y+3,18,1,"#d8ecf8"))}
  // cheminée + fumée
  s+=R(92,6,10,22,OUT)+R(93,7,8,21,"#8b3a2a")+R(91,5,12,3,OUT)+R(92,5,10,2,"#a64d3a");for(let y=10;y<28;y+=3)s+=R(93,y,8,1,"#6e2a1c");
  s+=`<rect class="an-smoke" x="95" y="0" width="4" height="3" fill="#d8d8e0" opacity=".7"/><rect class="an-smoke d2" x="96" y="-2" width="3" height="3" fill="#d8d8e0" opacity=".6"/>`;
  // toit en tuiles
  for(let r=0;r<7;r++){const y=4+r*4,x0=58-r*9,w=12+r*18;s+=R(x0,y,w,4,OUT)+R(x0+1,y,w-2,3,r%2?"#a63d3d":"#b84a46");for(let x=x0+2+(r%2)*3;x<x0+w-2;x+=6)s+=R(x,y+1,1,2,"#7a2626")}
  s+=R(0,30,W,4,OUT)+R(1,30,W-2,2,"#6e2a1c");
  s+=R(58,10,12,12,OUT)+R(59,11,10,10,night?"#ffe58a":"#7fc8f8")+R(63,11,1,10,OUT)+R(59,15,10,1,OUT);
  // façade : murs en brique et dalles
  s+=R(0,34,W,118,"#c66a4a");for(let y=34;y<152;y+=4){s+=R(0,y,W,1,"#a6553a");for(let x=(y/4|0)%2?4:0;x<W;x+=8)s+=R(x,y,1,4,"#a6553a")}
  s+=R(0,34,1,118,OUT)+R(W-1,34,1,118,OUT);
  Object.entries(HMH_SLOT).forEach(([id,[x,y]])=>{const on=lit[id];s+=R(x-1,y-1,HMH_W+2,HMH_H+2,OUT)+`<g transform="translate(${x} ${y})">`+hmThumb(H,id)+`</g>`;
    if(!on)s+=R(x,y,HMH_W,HMH_H,"#0a0c1c",'opacity=".78"')+R(x+23,y+10,12,22,OUT)+R(x+24,y+11,10,21,"#4e2f1a")+R(x+25,y+12,8,9,"#5e3a22")+R(x+25,y+22,8,9,"#5e3a22")+R(x+31,y+21,1,2,"#f4d767");
    s+=R(x-1,y+HMH_H+1,HMH_W+2,3,"#5a3a22")+R(x-1,y+HMH_H+1,HMH_W+2,1,"#8b5a2b")});
  // rez-de-chaussée : jardin, porte, boîte aux lettres, lampadaire
  s+=R(0,152,W,12,"#6aa84f")+R(0,152,W,1,"#8fcb6a");for(let x=2;x<W;x+=5)s+=R(x,151,1,2,"#4a8a38");
  s+=R(54,152,20,12,"#c9b48c")+R(56,152,16,12,"#d8c49c")+R(52,152,24,2,"#8a8f99");
  [[3,156],[110,156],[40,157]].forEach(([x,y])=>{s+=R(x,y,12,7,OUT)+R(x+1,y+1,10,5,"#2f8b4a")+R(x+1,y+1,6,2,"#5ac27a")+R(x+3,y+2,1,1,"#ff9ccc")+R(x+8,y+3,1,1,"#ffd94a")});
  for(let x=18;x<38;x+=4)s+=R(x,155,1,6,"#f2f0ea");s+=R(18,157,20,1,"#f2f0ea");for(let x=88;x<108;x+=4)s+=R(x,155,1,6,"#f2f0ea");s+=R(88,157,20,1,"#f2f0ea");
  s+=R(78,157,2,7,OUT)+R(75,153,8,5,OUT)+R(76,154,6,3,"#2f6fd6")+R(80,152,1,3,"#d63b3b");
  s+=R(124,155,2,11,"#2c2c34")+R(121,152,8,4,OUT)+R(122,153,6,2,night?"#ffe58a":"#c2c6cf")+(night?glow(125,157,10,"#ffe58a",.18):"");
  // rue (vers la carte des sorties)
  s+=R(0,164,W,20,"#5a5a66")+R(0,164,W,2,"#9a9aa6")+R(0,182,W,2,"#9a9aa6");for(let x=2;x<W;x+=10)s+=R(x,173,5,1,"#e9e2d0");
  s+=R(4,166,33,9,OUT)+R(5,167,31,7,"#2f8b4a")+ptxt("SORTIES",7,168,"#fff6c8")+R(19,175,2,7,"#8a8f99");
  return s+"</svg>"}
function hmHTML(H){const last=H.ev[H.ev.length-1],here=last?last.r:"chambre",me=(()=>{try{return headURL((S.g&&S.g.avc)||{},20,22,6,-7,3)}catch(e){return""}})();
  const lit={};["chambre","biblio","studio","video","cuisine","sport"].forEach(id=>lit[id]=hmCount(H,id)>0);
  const lab={biblio:["livre","livres"],studio:["session","sessions"],video:["objet","objets"],cuisine:["bocal","bocaux"],sport:["séance","séances"]};
  const pc=(v,t)=>(v/t*100).toFixed(2)+"%";
  const slot=id=>{const[x,y]=HMH_SLOT[id],n=hmCount(H,id),on=lit[id],nm=HM_ROOMS.find(r=>r[0]===id)[1];
    return`<button type="button" class="hmslot${on?"":" off"}" data-r="${id}" style="left:${pc(x,128)};top:${pc(y,184)};width:${pc(HMH_W,128)};height:${pc(HMH_H,184)}" aria-label="${nm}${on?"":" (à débloquer)"}"><span class="hml"><b>${nm}</b>${id==="chambre"||!on?"":`<small>${n} ${lab[id][n>1?1:0]}</small>`}</span>${here===id&&me?`<img class="hmme" src="${me}" alt="Toi ici">`:""}</button>`};
  const nC=hmCount(H,"carte");
  const G=S.g,hr=new Date().getHours(),ck=JSON.stringify([H.ev.length,last&&last.t,(G.books||[]).length,G.book&&G.book.p,Object.keys(H.nm).length,(G.gear||[]).length,(G.nb||[]).length,hr<7||hr>=20,G.pu&&G.pu.rec,G.gn&&G.gn.rec,G.run&&G.run.rec,lit]);if(!window.__hmHC||window.__hmHC.k!==ck)window.__hmHC={k:ck,s:hmHouseSvg(H,lit)};
  return`<div class="hmhouse">${window.__hmHC.s}${Object.keys(HMH_SLOT).map(slot).join("")}<button type="button" class="hmslot hmstreet" data-r="carte" style="left:0;top:${pc(152,184)};width:100%;height:${pc(32,184)}" aria-label="Sorties"><span class="hml"><b>Sorties</b>${nC?`<small>${nC} drapeau${nC>1?"x":""}</small>`:""}</span>${here==="carte"&&me?`<img class="hmme" src="${me}" alt="Toi ici">`:""}</button></div>`};

// ---------- SALLE DE SPORT (128 px)
function hmSport(H){const G=S.g,E=hmEv(H,"sport"),W=128,Hh=74,num=re=>E.reduce((a,e)=>{const m=e.n.match(re);return a+(m?parseFloat(m[1].replace(",",".")):0)},0);
  const best=w=>Math.max(0,...E.filter(e=>new RegExp(w,"i").test(e.n)).map(e=>{const m=e.n.match(/(\d+)\s*(?:rép|pompes|squats)/i);return m?+m[1]:0}));
  const km=Math.round(num(/(\d+(?:[.,]\d+)?)\s*km/i)*10)/10,reps=Math.round(num(/(\d+)\s*(?:rép|pompes|squats|abdos|tractions)/i)),pu=Math.max((G.pu&&G.pu.rec)||0,best("pompes")),sq=Math.max((G.sq&&G.sq.rec)||0,best("squats")),gn=(G.gn&&G.gn.rec)||0,rn=Math.max((G.run&&G.run.rec)||0,0,...E.map(e=>{const m=e.n.match(/(\d+(?:[.,]\d+)?)\s*km/i);return m?parseFloat(m[1].replace(",",".")):0}));
  const M=[["gn","Gainage",gn,gn?fmtSec(gn):"",[60,120,180],gn?fmtSec(gn).replace(" ",""):"-"],["pu","Pompes d'affilée",pu,pu+"",[20,40,60],pu||"-"],["sq","Squats d'affilée",sq,sq+"",[30,60,100],sq||"-"],["rn","Plus longue course",rn,rn?rn.toLocaleString("fr-FR")+" km":"",[5,10,21],rn?String(rn).replace(".",",")+"K":"-"],["km","Total parcouru",km,km?km.toLocaleString("fr-FR")+" km":"",[20,100,500],km?Math.round(km)+"K":"-"],["rp","Total répétitions",reps,reps+"",[200,1000,5000],reps?(reps>=1000?Math.round(reps/100)/10+"K":reps):"-"]];
  const tier=(v,t)=>v>=t[2]?["#f4d767","#c9a227","#fff6c8"]:v>=t[1]?["#e1e5ec","#9aa1ad","#ffffff"]:v>=t[0]?["#e0a065","#a5642c","#f6c79a"]:["#8a8f99","#5a5f69","#b5bac4"];
  let s=`<svg class="hmsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" role="group" aria-label="Salle de sport">`;
  s+=shell(W,Hh,{wall:"#3a4252",wall2:"#323a48",pat:"brick",floor:"#2a2d36",floor2:"#24262e",fh:8,base:"#1e2129"});
  // tableau des records : plaque en bois et médailles
  s+=R(4,3,120,26,OUT)+R(5,4,118,24,"#6b4024")+R(6,5,116,22,"#8b5a2b")+R(6,5,116,1,"#b98250")+dithRow(6,14,116,"#7a4e26",3)+dithRow(6,21,116,"#7a4e26",3,1);
  M.forEach((m,i)=>{const x=9+i*19,[c,d,l]=tier(m[2],m[4]),on=m[2]>0;
    s+=`<g class="hmo${on?"":" lock"}" data-o="m:${m[0]}" tabindex="0" role="button" aria-label="${m[1]}"${on?"":' opacity=".45"'}>`+R(x+4,5,3,6,"#d63b3b")+R(x+7,5,3,6,"#2f6fd6")+R(x+4,5,1,6,"#f06b6b")+
      R(x+3,10,9,9,OUT)+R(x+4,11,7,7,d)+R(x+5,11,5,6,c)+R(x+5,11,2,1,l)+R(x+7,13,1,3,d)+R(x+6,14,3,1,d)+
      R(x,20,15,7,OUT)+R(x+1,21,13,5,"#2a1c10")+ptxt(String(m[5]).slice(0,3),x+2,21,on?"#f4d767":"#8a8f99")+R(x-1,4,17,24,"transparent")+"</g>"});
  // rack d'haltères
  const n=E.length,db=Math.min(8,Math.ceil(n/2));s+=`<g class="hmo" data-o="rack" tabindex="0" role="button" aria-label="Haltères">`+R(4,44,40,2,OUT)+R(4,44,40,1,"#8a8f99")+R(4,54,40,2,OUT)+R(4,54,40,1,"#8a8f99")+R(5,44,2,22,"#5a5f69")+R(41,44,2,22,"#5a5f69")+R(4,65,6,2,OUT)+R(38,65,6,2,OUT);
  const DC=["#2c2c34","#d63b3b","#2f6fd6","#f0b62e"];for(let i=0;i<8;i++){const x=8+(i%4)*8,y=i<4?39:49,c=DC[(i/2|0)%4];s+=i<db?R(x,y+2,8,1,"#c2c6cf")+R(x,y,3,5,OUT)+R(x,y+1,2,3,c)+R(x+5,y,3,5,OUT)+R(x+6,y+1,2,3,c)+R(x,y+1,1,1,lt(c)):R(x+1,y+2,6,1,"rgba(255,255,255,.08)")}s+="</g>";
  // banc et barre
  s+=R(56,56,30,4,OUT)+R(57,57,28,2,"#d63b3b")+R(57,57,28,1,"#f06b6b")+R(60,60,2,6,"#5a5f69")+R(80,60,2,6,"#5a5f69")+R(58,65,26,1,"#5a5f69")+R(84,40,2,20,"#8a8f99")+R(54,41,36,2,"#c2c6cf")+R(52,37,4,10,OUT)+R(53,38,2,8,"#2c2c34")+R(88,37,4,10,OUT)+R(89,38,2,8,"#2c2c34");
  // sac de frappe
  s+=`<g class="an-sway">`+R(105,34,1,6,"#8a8f99")+R(100,40,11,20,OUT)+R(101,41,9,18,"#d63b3b")+R(101,41,2,18,"#f06b6b")+R(101,44,9,1,"#8b2f2f")+R(101,55,9,1,"#8b2f2f")+`</g>`;
  // kettlebell, tapis de yoga, gourde, serviette
  s+=R(46,60,8,7,OUT)+R(47,61,6,5,"#36b679")+R(48,58,4,3,OUT)+R(49,59,2,1,"#2a1c10")+R(47,61,2,1,"#6fe0a0");
  s+=R(114,58,8,8,OUT)+R(115,59,6,6,"#9a5ce0")+R(116,60,4,4,"#7a3cc0")+R(117,61,2,2,"#9a5ce0");
  s+=R(94,58,4,8,OUT)+R(95,59,2,6,"#7fc8f8")+R(95,57,2,1,"#2c2c34");
  return{svg:s+"</svg>",sum:`${n} séance${n>1?"s":""} · ${km?km.toLocaleString("fr-FR"):"0"} km · ${reps} répétition${reps>1?"s":""}`,
    empty:"Chaque séance remplit le rack, et tes records s'accrochent au mur.",
    info(o){if(o==="rack"){const l=E[E.length-1];return hmPop("Rack","Séances",hmRow("sport","Séances notées",n)+(l?hmRow("calendrier","Dernière",hmFd(l.t)):""))}
      
      const m=M.find(q=>"m:"+q[0]===o);if(!m)return"";const t=m[4],lv=m[2]>=t[2]?"Or":m[2]>=t[1]?"Argent":m[2]>=t[0]?"Bronze":"",nxT=t.find(q=>q>m[2]);
      const nx=HMSP_MS.find(q=>q[0]>km)||HMSP_MS[HMSP_MS.length-1];return hmPop(lv?"Médaille "+lv.toLowerCase():"Record",m[1],m[2]?hmRow("medaille","Record",m[3])+(m[0]==="km"?hmRow("sablier","Prochain cap",nx[1]):"")+(nxT?hmRow("sablier","Médaille suivante",(m[0]==="gn"?fmtSec(nxT):nxT.toLocaleString("fr-FR")+(/km/.test(m[3])?" km":""))):""):hmRow("sablier","Pas encore de record","Lance l'action pour en poser un"))}}};

// ---------- STUDIO (128 px)
function hmStudio(H){const E=hmEv(H,"studio"),SS=E.filter(e=>e.k==="son"),TX=E.filter(e=>e.k==="txt"),VY=E.filter(e=>e.k==="vinyl"),n=SS.length,mins=SS.reduce((a,e)=>a+(hmDur(e.n)||60),0),W=128,Hh=88;
  const has=id=>n>=HMS_EQ.find(q=>q[0]===id)[2];
  const Z=(id,body)=>`<g class="hmo${has(id)?"":" lock"}" data-o="eq:${id}" tabindex="0" role="button" aria-label="${HMS_EQ.find(q=>q[0]===id)[1]}"${has(id)?"":' opacity=".18" style="filter:grayscale(1)"'}>${body}</g>`;
  let s=`<svg class="hmsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" role="group" aria-label="Studio">`;
  s+=shell(W,Hh,{wall:"#1f2d38",wall2:"#253645",pat:"panel",floor:"#4a3426",floor2:"#3e2b1f",fh:18,base:"#141c24"});
  // fenêtre de nuit
  s+=R(52,6,26,20,OUT)+R(53,7,24,18,"#0f1830")+R(53,7,24,1,"#18264a")+[[56,10],[70,9],[62,15],[74,18],[58,20]].map(([x,y])=>R(x,y,1,1,"#e9e2d0")).join("")+R(68,11,4,4,"#f4f0c8")+R(69,11,3,1,"#fff")+
    [[54,19,5,6],[60,16,4,9],[65,20,6,5],[72,17,4,8]].map(([x,y,w,h])=>R(x,y,w,h,"#141e36")+R(x+1,y+2,1,1,"#ffd94a")+(h>6?R(x+2,y+5,1,1,"#ffd94a"):"")).join("")+R(52,15,26,1,OUT)+R(64,6,1,20,OUT)+R(50,26,30,3,"#6b4a28")+R(50,26,30,1,"#8b5a2b");
  // panneaux acoustiques
  const foam=(x,y)=>{let f=R(x,y,12,12,OUT);for(let j=0;j<3;j++)for(let i=0;i<3;i++){const X=x+1+i*4-(i?0:0),Y=y+1+j*4-(j?0:0);f+=R(X,Y,3,3,"#3a4d63")+R(X,Y,3,1,"#4f6a86")+R(X,Y+2,3,1,"#2a394a")+R(X+1,Y+1,1,1,"#4f6a86")}return f};
  s+=Z("mousse",foam(6,5)+foam(20,5)+foam(6,19)+foam(98,5)+foam(112,5)+foam(112,19));
  // disque d'or
  s+=Z("or",R(32,8,16,18,OUT)+R(33,9,14,16,"#2a2018")+R(34,10,12,12,"#1a1210")+R(35,11,10,10,"#c9a227")+R(36,12,8,8,"#f4d767")+R(37,13,3,2,"#fff6c8")+R(39,15,2,2,"#6e5610")+R(35,23,10,1,"#f4d767"));
  // étagère de vinyles (albums)
  s+=`<g class="hmo" data-o="vinyl" tabindex="0" role="button" aria-label="Albums">`+R(84,30,40,3,"#8b5a2b")+R(84,30,40,1,"#b98250")+R(86,33,2,3,"#6b4a28")+R(120,33,2,3,"#6b4a28");
  const vv=VY.slice(-11);for(let i=0;i<11;i++){const v=vv[i],x=86+i*3;s+=v?R(x,19,3,11,OUT)+R(x+1,20,1,9,LIB_PAL[libHash(v.t+"a")%LIB_PAL.length][0]):""}if(!vv.length)s+=R(86,25,10,5,"rgba(255,255,255,.06)");s+="</g>";
  // bureau
  s+=R(8,52,82,4,OUT)+R(9,53,80,2,"#a0703e")+R(9,53,80,1,"#c9935a")+R(10,56,4,14,OUT)+R(11,56,2,13,"#6b4a28")+R(84,56,4,14,OUT)+R(85,56,2,13,"#6b4a28")+bx(62,56,22,10,"#7a5230")+R(70,60,6,1,"#c9a066");
  s+=R(9,56,80,1,"#7b6cf0")+R(9,57,80,1,"rgba(123,108,240,.35)")+R(9,58,80,1,"rgba(123,108,240,.15)");
  // écran avec logiciel de son
  s+=Z("pc",R(36,32,26,17,OUT)+R(37,33,24,15,"#14141c")+R(38,34,22,12,"#1c2433")+(n?R(38,34,22,2,"#2f6fd6")+R(39,37,8,2,"#5ac27a")+R(48,37,10,2,"#5ac27a")+R(41,40,12,2,"#f0b62e")+R(39,43,5,2,"#ff5fa8")+R(46,43,9,2,"#ff5fa8")+`<rect class="an-tv" x="47" y="36" width="1" height="10" fill="#fff"/>`:"")+R(47,49,4,3,OUT)+R(43,51,12,1,OUT));
  s+=Z("clav",R(30,49,38,4,OUT)+R(31,50,36,2,"#f2f0ea")+[...Array(12)].map((_,i)=>R(32+i*3,50,1,1,[1,3,6,8,10].includes(i)?"#1a1210":"#d8d4ca")).join("")+R(31,49,4,1,"#2c2c34"));
  // enceintes sur pieds
  const spk=x=>bx(x,34,10,16,"#24242c")+R(x+3,37,4,4,"#4a4a58")+R(x+4,38,2,2,"#14141c")+R(x+2,43,6,5,"#4a4a58")+R(x+3,44,4,3,"#14141c")+R(x+4,45,2,1,"#6a6a78");
  s+=Z("hp",spk(18)+spk(68));
  // casque accroché
  s+=Z("casque",R(4,36,8,1,"#8a8f99")+R(6,37,1,4,"#8a8f99")+R(3,40,7,2,OUT)+R(2,41,2,5,OUT)+R(9,41,2,5,OUT)+R(1,43,3,5,"#d63b3b")+R(9,43,3,5,"#d63b3b")+R(1,43,3,1,"#f06b6b")+R(9,43,3,1,"#f06b6b"));
  // micro sur perche
  s+=Z("micro",R(100,40,1,30,"#8a8f99")+R(95,69,11,2,"#5a5f69")+R(92,38,9,1,"#8a8f99")+R(88,34,5,8,OUT)+R(89,35,3,6,"#3a3f4a")+R(89,35,3,1,"#c2c6cf")+R(89,37,3,1,"#5a5f69")+R(83,33,4,10,"rgba(30,30,40,.6)")+R(83,33,4,1,"#5a5f69"));
  // synthé sur stand
  s+=Z("synth",R(104,52,22,7,OUT)+R(105,53,20,2,"#3a3f4a")+R(106,53,2,1,"#ff5fa8")+R(109,53,2,1,"#5ac27a")+R(112,53,1,1,"#ffd94a")+R(105,55,20,3,"#f2f0ea")+[...Array(7)].map((_,i)=>R(106+i*3,55,1,2,"#1a1210")).join("")+R(107,59,1,11,"#5a5f69")+R(122,59,1,11,"#5a5f69")+R(106,66,18,1,"#5a5f69"));
  // platine vinyle
  s+=Z("platine",bx(40,64,20,7,"#3a2a1c")+R(44,61,12,4,OUT)+`<g class="an-spin">`+R(45,62,10,2,"#14141c")+R(49,62,2,2,"#d63b3b")+R(45,62,2,1,"#3a3a46")+`</g>`+R(57,61,1,4,"#c2c6cf")+R(42,66,3,1,"#5ac27a"));
  // carnet de textes + chaise + câbles + plante
  s+=`<g class="hmo" data-o="txt" tabindex="0" role="button" aria-label="Carnet de textes">`+R(70,48,13,5,OUT)+R(71,49,5,3,TX.length?"#f3e6c4":"#5a5a66")+R(77,49,5,3,TX.length?"#efe2bf":"#4e4e5a")+R(76,49,1,3,"#8b2f2f")+(TX.length?R(72,50,3,1,"#8a8f99")+R(78,50,3,1,"#8a8f99")+R(79,47,1,4,"#2f6fd6"):"")+"</g>";
  s+=R(20,58,12,10,OUT)+R(21,59,10,6,"#2c2c34")+R(21,59,10,1,"#4a4a58")+R(25,68,2,6,"#5a5f69")+R(21,74,10,1,"#5a5f69")+R(21,75,1,1,OUT)+R(30,75,1,1,OUT);
  s+=R(14,76,60,1,"#14141c")+R(73,72,1,5,"#14141c");
  s+=plant(114,70,1);
  return{svg:s+"</svg>",sum:`${n} session${n>1?"s":""}${mins?" · "+fmtMin(mins)+" de son":""} · ${TX.length} texte${TX.length>1?"s":""} · ${VY.length} album${VY.length>1?"s":""}`,
    empty:"Le studio s'équipe à chaque session « Faire du son ».",
    info(o){if(o==="vinyl"){const l=VY[VY.length-1];return hmPop("Disques","Albums écoutés",hmRow("note","Écoutés en entier",VY.length)+(l?hmRow("calendrier","Dernier",hmFd(l.t)):""))}
      if(o==="txt"){const l=TX[TX.length-1];return hmPop("Carnet","Textes écrits",hmRow("note","Textes",TX.length)+(l?hmRow("calendrier","Dernier",hmFd(l.t)):""))}
      const id=o.slice(3),q=HMS_EQ.find(x=>x[0]===id);if(!q)return"";const ok=n>=q[2],at=SS[q[2]-1];
      return hmPop(ok?"Équipement":"À débloquer",q[1],ok?hmRow("eclair","Débloqué à la",q[2]+(q[2]>1?"e":"re")+" session")+(at?hmRow("calendrier","Le",hmFd(at.t)):""):hmRow("sablier","Se débloque à la",q[2]+"e session")+hmRow("note","Encore",(q[2]-n)+" session"+(q[2]-n>1?"s":"")))}}};

// ---------- VIDÉOCLUB (128 px)
function hmVideo(H){const E=hmEv(H,"video"),T=E.filter(e=>e.k!=="e"),ep=E.filter(e=>e.k==="e"),W=128;
  const rows=hmShelf(T.map((e,i)=>({e,i,w:e.k==="s"?10:5})),{U:66,gap:1,min:3}),RH=16,top=22,shH=rows.length*RH+4,Hh=top+shH+44;
  let s=`<svg class="hmsvg" viewBox="0 0 ${W} ${Hh}" shape-rendering="crispEdges" role="group" aria-label="Vidéoclub">`;
  s+=shell(W,Hh,{wall:"#2b1846",wall2:"#341d55",pat:"stripe",floor:"#3b2a3a",floor2:"#33232f",fh:16,base:"#1c0f2c"});
  // néon VIDEO CLUB
  {const tw=ptw("VIDEO")+8+ptw("CLUB"),fw=tw+8,fx=(W-fw)/2|0,tx=fx+4;s+=glow(64,9,20,"#ff5fa8",.12)+R(fx,3,fw,13,OUT)+R(fx+1,4,fw-2,11,"#160a26")+`<g class="an-neon">`+R(fx+1,4,fw-2,1,"#ff5fa8")+R(fx+1,14,fw-2,1,"#ff5fa8")+R(fx+1,4,1,11,"#ff5fa8")+R(fx+fw-2,4,1,11,"#ff5fa8")+ptxt("VIDEO",tx,7,"#ff9ccc")+R(tx+ptw("VIDEO")+2,8,2,3,"#ffd94a")+R(tx+ptw("VIDEO")+4,9,1,1,"#ffd94a")+ptxt("CLUB",tx+ptw("VIDEO")+8,7,"#7fe3ff")+`</g>`}
  // étagère
  const sx=6,sw=72;s+=R(sx,top,sw,shH,OUT)+R(sx+1,top+1,sw-2,shH-2,"#4e2f1a")+R(sx+3,top+1,sw-6,shH-2,"#24150f");
  for(let x=sx+5;x<sx+sw-3;x+=4)s+=R(x,top+1,1,shH-2,"#2a1a12");
  s+=R(sx+1,top+1,2,shH-2,"#7a4e2c")+R(sx+1,top+1,1,shH-2,"#9a6a3e")+R(sx+sw-3,top+1,2,shH-2,"#6b4024");
  rows.forEach((r,ri)=>{const yb=top+3+ri*RH+12;s+=dith(sx+3,yb-12,sw-6,2,"#1a0f0b")+R(sx+1,yb,sw-2,3,"#8b5a2b")+R(sx+1,yb,sw-2,1,"#b98250")+R(sx+1,yb+2,sw-2,1,"#4e2f1a");
    r.forEach(it=>{const e=it.e,x0=sx+4+it.x,p=LIB_PAL[libHash(e.t+"v")%LIB_PAL.length];let g=`<g class="hmo" data-o="v:${e.t}" tabindex="0" role="button" aria-label="${esc(H.nm[e.t]||(HMV_K[e.k]||HMV_K.f)[0])}">`;
      if(e.k==="s"){g+=R(x0,yb-12,10,12,OUT)+R(x0+1,yb-11,8,10,p[0])+R(x0+1,yb-11,8,2,"#f4d767")+R(x0+1,yb-11,1,10,p[2])+R(x0+2,yb-7,6,3,"#f3e6c4")+R(x0+3,yb-6,4,1,p[1])+R(x0+8,yb-11,1,10,p[1])+R(x0+1,yb-3,8,1,"#f4d767")}
      else{const doc=e.k==="d",c=doc?"#2a8fd6":p[0];g+=R(x0,yb-11,5,11,OUT)+R(x0+1,yb-10,3,9,"#1c1a22")+R(x0+1,yb-8,3,4,c)+R(x0+1,yb-8,1,4,lt(c))+R(x0+2,yb-7,1,1,"#f3e6c4")+R(x0+2,yb-5,1,1,"#f3e6c4")+R(x0+1,yb-3,3,1,"#3a3644")+R(x0+1,yb-10,3,1,"#3a3644")+(H.nm[e.t]?R(x0+2,yb-2,1,1,"#ffd94a"):"")}
      s+=g+R(x0-.5,yb-13,(e.k==="s"?10:5)+1,13,"transparent")+"</g>"})});
  // affiches + présentoir nouveautés
  const px0=84;[["#d1493f","#ffd94a"],["#2f6fd6","#7fe3ff"]].forEach(([a,b],i)=>{const y=top+2+i*14;s+=R(px0+i*20,y,17,18,OUT)+R(px0+1+i*20,y+1,15,16,a)+R(px0+3+i*20,y+3,11,8,dk(a,.35))+R(px0+5+i*20,y+5,7,5,b)+R(px0+3+i*20,y+13,11,1,"#f3e6c4")+R(px0+3+i*20,y+15,7,1,"#f3e6c4")});
  s+=R(108,top+44,15,8,OUT)+R(109,top+45,13,6,"#f4d767")+ptxt("NEW",110,top+46,"#8b2f2f");
  s+=R(86,top+52,38,3,"#8b5a2b")+R(86,top+52,38,1,"#b98250");T.slice(-4).forEach((e,i)=>{const p=LIB_PAL[libHash(e.t+"v")%LIB_PAL.length];s+=R(88+i*5,top+44,5,8,OUT)+R(89+i*5,top+45,3,6,p[0])+R(89+i*5,top+46,3,2,"#f3e6c4")});
  // bas : meuble télé, magnétoscope, canapé, popcorn, plante, tapis
  const fy=Hh-16;s+=R(30,fy+3,64,9,"#5a2340")+dithRow(30,fy+5,64,"#7a3358",2)+dithRow(30,fy+8,64,"#7a3358",2,1)+R(30,fy+3,64,1,"#8a3d68");
  if(ep.length)s+=glow(16,fy-12,16,"#4aa8e8",.16);s+=`<g class="hmo" data-o="tv" tabindex="0" role="button" aria-label="Télé">`+bx(4,fy-6,24,12,"#6b4024")+R(6,fy+1,20,3,"#1c1a22")+R(7,fy+2,6,1,"#3a3644")+`<rect class="an-blink" x="21" y="${fy+2}" width="3" height="1" fill="#5ac27a"/>`+
    R(5,fy-21,22,16,OUT)+R(6,fy-20,20,14,"#2c2c34")+R(8,fy-18,16,10,ep.length?"#4aa8e8":"#1b2a33")+(ep.length?`<g class="an-tv">`+R(9,fy-17,6,3,"#bfe8ff")+R(9,fy-13,10,1,"#7fc8f8")+R(16,fy-11,6,2,"#2f6fd6")+`</g>`+dithRow(8,fy-16,16,"#3a90d0",2)+dithRow(8,fy-12,16,"#3a90d0",2,1):"")+R(22,fy-7,2,1,"#d63b3b")+R(19,fy-7,2,1,"#8a8f99")+R(12,fy-24,1,3,"#8a8f99")+R(19,fy-25,1,4,"#8a8f99")+"</g>";
    s+=R(38,fy-12,46,14,OUT)+R(39,fy-11,44,6,"#8a2f4a")+R(39,fy-11,44,1,"#b04a6a")+R(39,fy-5,44,6,"#a63d5c")+R(39,fy-5,44,1,"#c25a78")+R(36,fy-8,5,10,OUT)+R(37,fy-7,3,8,"#7a2440")+R(81,fy-8,5,10,OUT)+R(82,fy-7,3,8,"#7a2440")+R(44,fy-9,10,5,"#f4d767")+R(44,fy-9,10,1,"#fff1b0")+R(66,fy-9,10,5,"#7fe3ff")+R(66,fy-9,10,1,"#c8f6ff")+R(39,fy+1,2,2,OUT)+R(81,fy+1,2,2,OUT);
  s+=R(90,fy-2,9,8,OUT)+R(91,fy-1,7,6,"#f2f0ea")+R(92,fy-1,1,6,"#d63b3b")+R(94,fy-1,1,6,"#d63b3b")+R(96,fy-1,1,6,"#d63b3b")+R(91,fy-4,7,3,"#ffe58a")+R(92,fy-5,2,1,"#fff6c8")+R(95,fy-5,2,1,"#fff6c8");
  s+=plant(110,fy-10,1);
  return{svg:s+"</svg>",sum:`${E.filter(e=>e.k==="f").length} film${E.filter(e=>e.k==="f").length>1?"s":""} · ${E.filter(e=>e.k==="s").length} série${E.filter(e=>e.k==="s").length>1?"s":""} finie${E.filter(e=>e.k==="s").length>1?"s":""} · ${ep.length} épisode${ep.length>1?"s":""}`,
    empty:"L'étagère attend sa première cassette : note un film ou une série.",
    info(o){if(o==="tv"){const l=ep[ep.length-1];return hmPop("Télé","Épisodes",hmRow("ecran","Vus",ep.length)+(l?hmRow("calendrier","Dernier",hmFd(l.t)):""))}
      const e=E.find(x=>"v:"+x.t===o);if(!e)return"";const K=HMV_K[e.k]||HMV_K.f,fd=S.g.filmDay,sug=!H.nm[e.t]&&fd&&fd.t&&fd.d===dayKey(e.t)?`<button type="button" class="lnk hmsug" data-sg="${e.t}" data-v="${esc(fd.t)}">C'était « ${esc(fd.t)} » ?</button>`:"";
      return hmPop(K[0],H.nm[e.t]||K[0],hmRow("calendrier","Vu le",hmFd(e.t))+(hmDur(e.n)?hmRow("sablier","Durée",fmtMin(hmDur(e.n))):"")+(e.w.length?hmRow("duo","Avec",esc(hmWho(e.w))):"")+hmRow("eclair","XP","+"+e.x),hmName(H,e,"Titre","Donner un titre")+sug)}}};
