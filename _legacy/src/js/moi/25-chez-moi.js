// ---- Chez moi : la maison en coupe, une pièce par domaine, qui se remplit avec ce que tu fais
const HM_ROOMS=[["chambre","Chambre"],["biblio","Bibliothèque"],["studio","Studio"],["video","Vidéoclub"],["cuisine","Cuisine"],["sport","Salle de sport"],["carte","Dehors"]];
let hmRoom=null;
const hmFd=ms=>{const d=new Date(ms);return d.getDate()+" "+MOIS[d.getMonth()]+" "+d.getFullYear()};
const HM_DIST={cine:["Ciné","#d1493f",["Cinéma"]],scene:["Scène","#9a5ce0",["Concert","Théâtre","Jam session","Stand-up","Soirée quiz","Karaoké","Festival","Match"]],resto:["Resto et bars","#e8873a",["Restaurant","Bar","Bar à jeux"]],
  culture:["Culture","#2a8fd6",["Musée ou expo","Atelier","Disquaire","Brocante","Friperie"]],amis:["Chez les amis","#ff7aa8",[]],loisirs:["Loisirs","#36b679",["Escape game","Bowling ou billard","Arcade"]],nature:["Nature","#3c9a4f",["Balade","Soleil","Nature","Nouveau lieu","Excursion","Escalade","Sortie découverte"]]};
function hmRoomOf(e){const a=String(e.a||""),n=String(e.name||""),m=a.match(/^af:([a-z]+):(.+)$/),fid=m&&m[1],opt=m&&m[2];
  if(fid==="sorties"||fid==="dehors"){const d=Object.keys(HM_DIST).find(k=>HM_DIST[k][2].includes(opt))||"nature";return["carte",d,opt]}
  if(/^lzexplo:/.test(a))return["carte","nature",a.endsWith(":l")?"Nouveau lieu":"Sortie découverte"];
  if(/^(rel|fg)-meet-/.test(a)||fid==="voir")return["carte","amis",fid==="voir"?opt:n.replace(/\s*\(.*\)$/,"")];
  if(fid==="regarder")return["video",opt==="Film"?"f":opt==="Série finie"?"s":opt==="Documentaire"?"d":"e",opt];
  if(/^lzcine:/.test(a)){const k=a.slice(-1);return["video",k,{f:"Film",e:"Épisode",s:"Série finie"}[k]||"Film"]}
  if(a==="lzlang:v")return["video","f","Film en VO"];
  if((fid==="ecouter"&&opt==="Album")||/album en entier/i.test(n))return["studio","vinyl","Album"];
  if(fid==="musique")return["studio",/texte/i.test(opt)?"txt":"son",opt];
  if(e.cat==="perso"&&/\b(son|morceau|texte|couplet|refrain|beat|mix|prod|instru|maquette|enregistr|pistes?)\b/i.test(n))return["studio",/texte|couplet|refrain|écri/i.test(n)?"txt":"son",n.replace(/\s*\(.*?\)|\s·.*$/g,"")];
  if(fid==="cuisiner"||/^lzcuis:/.test(a)||/^rcp:/.test(a)||/cuisin|recette|pâtiss|repas (de|du) (demain|lendemain)/i.test(n)){const o=opt||(a==="lzcuis:n"?"Nouveau plat":/demain|lendemain/i.test(n)?"Préparer demain":/pâtiss/i.test(n)?"Pâtisserie":"Repas maison");return["cuisine",o,o]}
  if(e.cat==="sport")return["sport",fid||"q",n];
  return null}
function hmData(){const G=S.g;let H=G.hm;if(!H||typeof H!=="object"||!Array.isArray(H.ev))H=G.hm={ev:[],nm:{},pl:{}};if(!H.nm||typeof H.nm!=="object")H.nm={};if(!H.pl||typeof H.pl!=="object")H.pl={};
  const L=(S.log||[]).filter(e=>!e.bonus&&e.t),key=e=>e.t+"|"+e.a,inLog=new Set(L.map(key)),t0=L.length?Math.min(...L.map(e=>e.t)):Infinity;let ch=0;
  const n0=H.ev.length;H.ev=H.ev.filter(e=>e.t<t0||inLog.has(key(e)));if(H.ev.length!==n0)ch=1;
  const seen=new Set(H.ev.map(key));
  L.forEach(e=>{if(seen.has(key(e)))return;const r=hmRoomOf(e);if(!r)return;seen.add(key(e));const mm=String(e.a||"").match(/^rel-(?:meet|call|news)-(.+)$/);
    H.ev.push({t:e.t,a:String(e.a||""),n:String(e.name||""),r:r[0],k:r[1],o:r[2],w:Array.isArray(e.withp)?e.withp.slice(0,6):mm?[mm[1]]:[],x:e.xp||0});ch=1});
  if(ch){H.ev.sort((a,b)=>a.t-b.t);if(H.ev.length>1500)H.ev=H.ev.slice(-1500);setTimeout(()=>{try{save()}catch(e){}},0)}
  return H}
const hmEv=(H,r)=>H.ev.filter(e=>e.r===r);
const hmDur=n=>{const m=String(n).match(/(\d+)\s*h(?:\s*(\d+))?|(\d+)\s*min/);return!m?0:m[3]?+m[3]:(+m[1])*60+(+(m[2]||0))};
const hmWho=w=>w&&w.length?w.join(", "):"";
function hmRow(ic,l,v){return`<li><i>${rkSvg(ic)}</i><span>${l}</span><b>${v}</b></li>`}
function hmName(H,e,label,ph){const cur=H.nm[e.t]||"";return`<div class="hmname"><input maxlength="60" placeholder="${esc(ph)}" aria-label="${esc(label)}" value="${esc(cur)}" data-nt="${e.t}"><button type="button" class="btn" data-ns="${e.t}">OK</button></div>`}
// ---------- étagère générique : des objets de largeur variable rangés sur des planches
function hmShelf(items,o){const U=o.U||56,rows=[[]];let x=0;items.forEach(it=>{const w=it.w+(o.gap||0);if(x+w>U){rows.push([]);x=0}it.x=x;x+=w;rows[rows.length-1].push(it)});while(rows.length<(o.min||2))rows.push([]);return rows}

// ---------- VIDÉOCLUB
const HMV_K={f:["Film","#d1493f"],d:["Documentaire","#2a8fd6"],s:["Série finie","#c9a227"],e:["Épisode","#7b6cf0"]};
function fmtMin(m){return m<60?m+" min":Math.floor(m/60)+" h"+(m%60?" "+String(m%60).padStart(2,"0"):"")}

// ---------- STUDIO
const HMS_EQ=[["pc","Ordinateur",1],["casque","Casque",3],["hp","Enceintes",5],["clav","Clavier maître",8],["micro","Micro",12],["mousse","Panneaux acoustiques",18],["platine","Platine vinyle",25],["synth","Synthé",35],["or","Disque d'or",50]];

// ---------- CUISINE
function hmRecipeBind(box){const G=S.g;if(!Array.isArray(G.rcp))G.rcp=[];const R=G.rcp,rr=()=>renderHome(1);
  box.querySelectorAll(".rcpl>li").forEach((li,i)=>{const r=R[i];li.querySelector(".rcph b").textContent=r.n;const ul=li.querySelectorAll(".rcpd ul li"),ol=li.querySelectorAll(".rcpd ol li");(r.ing||"").split("\n").filter(Boolean).forEach((x,k)=>{if(ul[k])ul[k].textContent=x});(r.st||"").split("\n").filter(Boolean).forEach((x,k)=>{if(ol[k])ol[k].textContent=x})});
  const a=box.querySelector(".rcpadd");if(a)a.onclick=()=>{window.__rcpNew=1;rr();setTimeout(()=>{const n=document.getElementById("rcpN");n&&n.focus()},50)};
  const x=box.querySelector(".rcpx");if(x)x.onclick=()=>{window.__rcpNew=0;rr()};
  const ok=box.querySelector(".rcpok");if(ok)ok.onclick=()=>{const n=box.querySelector("#rcpN").value.trim();if(!n){box.querySelector("#rcpN").focus();return}R.push({id:"r"+Date.now().toString(36),n,ing:box.querySelector("#rcpI").value.trim(),st:box.querySelector("#rcpS").value.trim(),c:0,t:0,a:Date.now()});window.__rcpNew=0;save();sfx("coin");rr()};
  box.querySelectorAll("[data-ro]").forEach(b=>b.onclick=()=>{window.__rcpOpen=window.__rcpOpen===b.dataset.ro?null:b.dataset.ro;rr()});
  box.querySelectorAll("[data-rx]").forEach(b=>b.onclick=()=>{const i=R.findIndex(r=>r.id===b.dataset.rx);if(i>=0)R.splice(i,1);save();rr()});
  box.querySelectorAll("[data-rd]").forEach(b=>b.onclick=ev=>{const r=R.find(q=>q.id===b.dataset.rd),A=window.__AFB;if(!r||!A)return;const it=A.items().find(q=>q.k==="fam"&&q.f.id==="cuisiner"&&q.opt===(r.c?"Repas maison":"Nouveau plat"));if(!it)return;
    const n0=S.log.length;A.afDo(it,b,ev,0,[],0);const e=S.log[S.log.length-1];if(S.log.length>n0||e){const H=hmData();if(e)H.nm[e.t]=r.n}r.c=(r.c||0)+1;r.t=Date.now();save();setTimeout(rr,60)})}

// ---------- SALLE DE SPORT
const HMSP_MS=[[5,"un 5 km"],[10,"un 10 km"],[21.1,"un semi-marathon"],[42.2,"un marathon"],[100,"100 km"],[465,"Paris – Lyon"],[775,"Paris – Marseille"],[1000,"1 000 km"],[3400,"un Tour de France"]];

// ---------- CARTE DES SORTIES

// ---------- CHAMBRE

// ---------- vue d'ensemble
function hmCount(H,id){const G=S.g;if(id==="chambre")return 1;if(id==="biblio")return(G.books||[]).length+(G.book?1:0);return hmEv(H,id).length}
function hmRoomData(H,id){return id==="video"?hmVideo(H):id==="studio"?hmStudio(H):id==="cuisine"?hmCuisine(H):id==="sport"?hmSport(H):id==="carte"?hmCarte(H):id==="chambre"?hmChambre():null}
/*HM2-START*/

// ---- Kit pixel pour la maison : police 3x5, sprites, volumes ombrés
const PXF={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",J:"001001001101010",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"110101101101101",O:"010101101101010",P:"110101110100100",Q:"010101101110011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",V:"101101101101010",W:"101101111111101",X:"101101010101101",Y:"101101010010010",Z:"111001010100111","0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001","5":"111100110001110","6":"011100111101111","7":"111001010010010","8":"111101111101111","9":"111101111001110",".":"000000000000010",",":"000000000010100",":":"000010000010000","-":"000000111000000","'":"010010000000000","/":"001001010100100","+":"000010111010000","!":"010010010000010","?":"110001010000010","%":"101001010100101"," ":"000000000000000"};
const OUT="#1a1210";
const hx=(a,b,t)=>{const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));if(!/^#[0-9a-f]{6}$/i.test(a)||!/^#[0-9a-f]{6}$/i.test(b))return a;const A=p(a),B=p(b);return"#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("")};
const lt=(c,t)=>hx(c,"#ffffff",t==null?.25:t),dk=(c,t)=>hx(c,"#000000",t==null?.3:t);
const R=(x,y,w,h,f,o)=>w>0&&h>0?`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o?" "+o:""}/>`:"";
function ptxt(str,x,y,c,sh){const t=String(str).normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase();let s="",cx=x;
  for(const ch of t){const g=PXF[ch]||PXF[" "];for(let i=0;i<15;i++)if(g[i]==="1"){if(sh)s+=R(cx+i%3+1,y+(i/3|0)+1,1,1,sh);s+=R(cx+i%3,y+(i/3|0),1,1,c)}cx+=4}return s}
const ptw=str=>String(str).length*4-1;
// sprite : lignes de caractères, "." = vide, palette {lettre: couleur}
function spr(rows,pal,ox,oy,flip){let s="";rows.forEach((row,y)=>{const r=flip?[...row].reverse().join(""):row;let x=0;while(x<r.length){const c=r[x];if(c==="."||!pal[c]){x++;continue}let w=1;while(r[x+w]===c)w++;s+=R(ox+x,oy+y,w,1,pal[c]);x+=w}});return s}
// volume : contour sombre, lumière en haut à gauche, ombre en bas
function bx(x,y,w,h,c,o){let s=R(x,y,w,h,o||OUT);if(w>2&&h>2){s+=R(x+1,y+1,w-2,h-2,c)+R(x+1,y+1,w-2,1,lt(c))+R(x+1,y+1,1,h-2,lt(c,.12))+R(x+1,y+h-2,w-2,1,dk(c))+R(x+w-2,y+1,1,h-2,dk(c,.18))}return s}
function dith(x,y,w,h,c,ph){let s="";for(let j=0;j<h;j++)for(let i=(j+(ph||0))%2;i<w;i+=2)s+=R(x+i,y+j,1,1,c);return s}
function dithRow(x,y,w,c,step,off){let s="";for(let i=off||0;i<w;i+=step)s+=R(x+i,y,1,1,c);return s}
// pièce : mur, plinthe, parquet, profondeur sur les côtés, ombre du plafond
function shell(W,H,o){const fh=o.fh||14,wy=H-fh;let s=R(0,0,W,H,o.wall);
  if(o.pat==="stripe")for(let x=2;x<W;x+=6)s+=R(x,0,1,wy,o.wall2);
  if(o.pat==="dots")for(let y=3;y<wy;y+=6)for(let x=(y/6|0)%2?3:0;x<W;x+=6)s+=R(x,y,1,1,o.wall2);
  if(o.pat==="tile"){for(let y=o.ty||0;y<wy;y+=4)s+=R(0,y,W,1,o.wall2);for(let y=o.ty||0;y<wy;y+=4)for(let x=((y-(o.ty||0))/4|0)%2?4:0;x<W;x+=8)s+=R(x,y,1,4,o.wall2)}
  if(o.pat==="brick"){for(let y=0;y<wy;y+=5)s+=R(0,y,W,1,o.wall2);for(let y=0;y<wy;y+=5)for(let x=(y/5|0)%2?5:0;x<W;x+=10)s+=R(x,y,1,5,o.wall2)}
  if(o.pat==="panel"){for(let x=0;x<W;x+=16)s+=R(x,0,1,wy,o.wall2)+R(x+1,0,1,wy,lt(o.wall,.06))}
  s+=dith(0,0,W,3,dk(o.wall,.35))+R(0,0,W,1,dk(o.wall,.5));
  s+=R(0,wy-3,W,3,o.base||dk(o.wall,.4))+R(0,wy-3,W,1,lt(o.base||dk(o.wall,.4),.2));
  s+=R(0,wy,W,fh,o.floor);const fl=o.floor2||dk(o.floor,.18);for(let y=wy+3;y<H;y+=3)s+=R(0,y,W,1,fl);
  for(let y=wy;y<H;y+=3)for(let x=((y-wy)/3|0)%2?7:0;x<W;x+=14)s+=R(x,y,1,3,fl);
  s+=dith(0,H-3,W,3,dk(o.floor,.45))+R(0,wy,W,1,dk(o.floor,.4));
  s+=dith(0,0,3,wy,dk(o.wall,.4))+dith(W-3,0,3,wy,dk(o.wall,.4),1);return s}
// lumière : halo tramé
function glow(cx,cy,r,c,op){let s=`<g opacity="${op||.13}" class="hmglow">`;for(let q=3;q>=1;q--){const rr=Math.round(r*q/3);for(let y=-rr;y<=rr;y++){const hw=Math.round(Math.sqrt(rr*rr-y*y));s+=R(cx-hw,cy+y,hw*2+1,1,c)}}return s+"</g>"}
function plant(x,y,big){const L="#3c9a4f",D="#2a6e38",H="#6ccf7c";return R(x+1,y+7,6,5,OUT)+R(x+2,y+8,4,3,"#b5652b")+R(x+2,y+8,4,1,"#d68a4a")+R(x+1,y+7,6,1,"#8b4a1f")+
  (big?R(x+3,y-4,1,11,D)+R(x,y-6,3,4,L)+R(x+5,y-5,3,4,L)+R(x+2,y-9,3,4,H)+R(x-1,y-2,3,3,D)+R(x+6,y-1,3,3,D):"")+R(x+1,y+2,2,4,L)+R(x+4,y+1,3,4,L)+R(x+2,y,2,3,H)+R(x+5,y+3,2,3,D)+R(x+3,y+3,1,4,D)}
