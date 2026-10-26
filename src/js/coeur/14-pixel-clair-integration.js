// ---- Pixel Clair : intégration
AV_OPT.bot=CH_BOT;AV_OPT.botC=CH_BOTC;AV_OPT.shoe=CH_SHOE;AV_OPT.shoeC=CH_SHOEC;Object.assign(AV_DEF,CH_DEF);
// portrait (listes, relations, vignettes) : fond choisi + tête de 3/4
// portrait de face : on découpe la tête et les épaules du personnage en pied
const __frC={};
function chCrop(cfg,x0,dy0,W,H){const c={...AV_DEF,...CH_DEF,...(cfg||{}),size:0,main:0},k=JSON.stringify(c)+"|"+x0+"|"+dy0+"|"+W+"|"+H;if(__frC[k])return __frC[k];
  const ks=Object.keys(__frC);if(ks.length>200)ks.slice(0,100).forEach(q=>delete __frC[q]);
  const px=chDraw(c,"idle",0),A=chAnchors(c,"idle",0),y0=A.t+dy0,out=new Array(W*H).fill(null);
  for(let y=0;y<H;y++){const sy=y0+y;if(sy<0||sy>=CH.H)continue;for(let x=0;x<W;x++){const sx=x0+x;if(sx<0||sx>=CH.W)continue;out[y*W+x]=px[sy*CH.W+sx]||null}}
  return __frC[k]={W,H,px:out}}
const chFront=cfg=>chCrop(cfg,5,-6,22,26);
const chFace=cfg=>chCrop(cfg,6,-6,20,22);
function avDraw(cfg){const c={...AV_DEF,...(cfg||{})};const out=c.nobg?new Array(AVW*AVH).fill(null):avDrawOld({...c,bgonly:1});
  const F=chFront(c),ox=Math.floor((AVW-F.W)/2),oy=AVH-F.H;for(let y=0;y<F.H;y++)for(let x=0;x<F.W;x++){const v=F.px[y*F.W+x];if(v)out[(y+oy)*AVW+x+ox]=v}return out}
// personnage en pied
const __chCache={};
function chURL(cfg,pose,fr,scale){const c={...AV_DEF,...(cfg||{})},k=JSON.stringify(c)+"|"+pose+"|"+fr+"|"+scale;if(__chCache[k])return __chCache[k];const ks=Object.keys(__chCache);if(ks.length>120)ks.slice(0,60).forEach(x=>delete __chCache[x]);
  return __chCache[k]=chCanvas(chDraw(c,pose,fr),scale||2).toDataURL("image/png")}
// carte du personnage : fond choisi agrandi + corps entier
// avatars des proches : générés depuis leur config
// gros plan sur la tête : fond de la scène + crop serré du visage
const __hdC={};
function headURL(cfg,W,H,x0,dy0,sc){const c={...AV_DEF,...(cfg||{})},k=JSON.stringify(c)+"|"+[W,H,x0,dy0,sc];if(__hdC[k])return __hdC[k];const ks=Object.keys(__hdC);if(ks.length>80)ks.slice(0,40).forEach(q=>delete __hdC[q]);
  const bg=c.nobg?null:avDrawOld({...c,bgonly:1}),F=chCrop(c,x0,dy0,W,H),cv=document.createElement("canvas");cv.width=W*sc;cv.height=H*sc;const g=cv.getContext("2d"),bx=Math.floor((AVW-W)/2);
  if(bg)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=bg[(y+2)*AVW+x+bx];if(v){g.fillStyle=v;g.fillRect(x*sc,y*sc,sc,sc)}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=F.px[y*W+x];if(v){g.fillStyle=v;g.fillRect(x*sc,y*sc,sc,sc)}}
  return __hdC[k]=cv.toDataURL("image/png")}
function avPicURL(avc){return headURL(avc,20,22,6,-7,6)}
// figurines (personnages pixel de la collection)
function spriteSvg(kind,col,px){return px>=3?bossFrames(kind,col,px):bossSvg(kind,col,px,0)}
// icônes de garde-robe
function itemIconNew(it){if(it.s==="aura")return null;
  if(it.k==="main"&&window.chItemIcon){const I=chItemIcon(it.o)||(typeof FIGI!=="undefined"&&FIGI[it.o]);if(I){const cv=document.createElement("canvas");cv.width=cv.height=16;const g=cv.getContext("2d");I.rows.forEach((r,y)=>[...r].forEach((ch,x)=>{const c=I.pal[ch];if(c){g.fillStyle=c;g.fillRect(x,y,1,1)}}));return cv.toDataURL()}}
  if(it.s==="fond")return null;
  const base={...AV_DEF,skin:1,hairC:0,hair:9,top:0,topC:7,beard:0,bot:1,botC:1},a=chDraw(base,"idle",0),b=chDraw({...base,[it.k]:it.o},"idle",0),A=chAnchors(base,"idle",0);
  let x0,y0,x1,y1;if(it.k==="top"){x0=4;x1=27;y0=A.t+13;y1=A.t+32}else{x0=99;y0=99;x1=-1;y1=-1;for(let y=0;y<CH.H;y++)for(let x=0;x<CH.W;x++)if(a[y*CH.W+x]!==b[y*CH.W+x]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}if(x1<0)return null;x0=Math.max(0,x0-1);y0=Math.max(0,y0-1);x1=Math.min(CH.W-1,x1+1);y1=Math.min(CH.H-1,y1+1)}
  const w=x1-x0+1,h=y1-y0+1,sz=Math.max(w,h),cv=document.createElement("canvas");cv.width=cv.height=sz;const g=cv.getContext("2d"),ox=Math.floor((sz-w)/2),oy=Math.floor((sz-h)/2);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const k=y*CH.W+x,col=it.k==="top"?b[k]:(a[k]!==b[k]?b[k]:null);if(col){g.fillStyle=col;g.fillRect(ox+x-x0,oy+y-y0,1,1)}}return cv.toDataURL()}
// éditeur : aperçu en pied + vignettes
const AVC_BODYK=["top","topC","bot","botC","shoe","shoeC","size","main","bijou"];
let avcFr=0,avcIv=0,avcSt=0,avcPg=0,avcHg=0;
// Assistant en étapes : visage, cheveux, tenue, accessoires, fond. Une seule famille d'options à l'écran.
// z : cadrage de l'aperçu (t = visage de près, h = tête et chapeau, b = corps entier)
const AVS=[
 {l:"Visage",ic:"visage",p:[["skin","Teint","t"],["eyes","Regard","t"],["eyeC","Couleur des yeux","t"],["mouth","Bouche","t"],["mark","Détails","t"]]},
 {l:"Cheveux",ic:"ciseaux",p:[["hair","Coupe","h"],["hairC","Couleur","h"],["beard","Barbe","t"]]},
 {l:"Tenue",ic:"tshirt",p:[["size","Silhouette","b"],["top","Haut","b"],["topC","Couleur du haut","b"],["bot","Bas","b"],["botC","Couleur du bas","b"],["shoe","Chaussures","b"],["shoeC","Couleur des chaussures","b"]]},
 {l:"Accessoires",ic:"casquette",p:[["hat","Sur la tête","h"],["glasses","Lunettes","t"],["bijou","Bijoux","t"],["main","Objet en main","b"],["accC","Couleur des accessoires","b"]]},
 {l:"Fond",ic:"paysage",p:[["bgP","Motif","h"],["bgC","Couleur","h"]]}];
const AVK={};AVC_TABS.forEach(t=>t[2].forEach(([k,l,kind])=>AVK[k]=kind));
const avcLast=()=>avcSt===AVS.length-1&&avcPg===AVS[avcSt].p.length-1;
function avcThumb(cfg,key){return avcThumbNew(cfg,key)}
function avcThumbNew(cfg,key){const cv=document.createElement("canvas");cv.setAttribute("aria-hidden","true");
  if(["bgC","bgP"].includes(key)){const src=avCanvas(cfg,1);cv.width=AVW*2;cv.height=AVH*2;const g=cv.getContext("2d");g.imageSmoothingEnabled=false;g.drawImage(src,0,0,AVW*2,AVH*2);cv.className="avt";return cv}
  if(AVC_BODYK.includes(key)){cfg={...cfg,hat:0};const px=chDraw({...AV_DEF,...cfg},"idle",0),A=chAnchors({...AV_DEF,...cfg},"idle",0);const y0=key==="shoe"||key==="shoeC"||key==="bot"||key==="botC"?A.t+24:key==="size"?0:A.t-2,y1=key==="size"?CH.H-1:Math.min(CH.H-1,y0+30);const h=y1-y0+1;cv.width=CH.W*2;cv.height=h*2;const g=cv.getContext("2d");
    for(let y=y0;y<=y1;y++)for(let x=0;x<CH.W;x++){const v=px[y*CH.W+x];if(v){g.fillStyle=v;g.fillRect(x*2,(y-y0)*2,2,2)}}cv.className="avt body";return cv}
  const H=chFace({...AV_DEF,...cfg});cv.width=H.W*3;cv.height=H.H*3;const g=cv.getContext("2d");for(let y=0;y<H.H;y++)for(let x=0;x<H.W;x++){const v=H.px[y*H.W+x];if(v){g.fillStyle=v;g.fillRect(x*3,y*3,3,3)}}cv.className="avt face";return cv}
// aperçu : le fond choisi, puis le visage ou le corps, grossis selon l'étape
function avcPaintNew(){const cv=$("avcPrev");if(!cv||!avcCfg)return;const K=6,W=AVW*K,H=AVH*K;if(cv.width!==W){cv.width=W;cv.height=H}
  const g=cv.getContext("2d");g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);
  const bg=avDrawOld({...avcCfg,bgonly:1});for(let y=0;y<AVH;y++)for(let x=0;x<AVW;x++){const v=bg[y*AVW+x];if(v){g.fillStyle=v;g.fillRect(x*K,y*K,K,K)}}
  const z=AVS[avcSt].p[avcPg][2],c={...AV_DEF,...CH_DEF,...avcCfg};if(z!=="b")c.main=0;if(AVS[avcSt].l==="Cheveux")c.hat=0;
  const px=chDraw(c,"idle",z==="b"?avcFr:0),A=chAnchors(c,"idle",z==="b"?avcFr:0);
  const put=(x0,y0,w,h,s)=>{const ox=Math.floor((W-w*s)/2),oy=H-h*s-(z==="b"?2:0);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const sx=x0+x,sy=y0+y;if(sx<0||sx>=CH.W||sy<0||sy>=CH.H)continue;const v=px[sy*CH.W+sx];if(v){g.fillStyle=v;g.fillRect(ox+x*s,oy+y*s,s,s)}}};
  if(z==="b")put(0,0,CH.W,CH.H,4);else if(z==="h")put(3,A.t-8,26,30,6);else put(6,A.t-5,20,24,8);
  if(!avcIv)avcIv=setInterval(()=>{if($("avCreator").hidden){clearInterval(avcIv);avcIv=0;return}if(AVS[avcSt].p[avcPg][2]==="b"){avcFr=1-avcFr;avcPaintNew()}},700)}
function avcPaint(){return avcPaintNew()}
function avcOptions(key,sec){const kind=AVK[key],body=$("avcBody");
  const row=document.createElement("div");row.className=kind==="sw"?"avc-sw":"avc-th";
  const opts=key==="skin"?AV_OPT.skin.map(x=>x[0]):AV_OPT[key];
  const pick=(i,b)=>{avcCfg[key]=i;avcPaint();sec.querySelectorAll("[data-i]").forEach(x=>x.setAttribute("aria-pressed",+x.dataset.i===i))};
  const mk=(i,thumbKey)=>{const lk=kind==="th"?avLock(key,i):null;if(lk&&avcCfg[key]!==i)return null;const b=document.createElement("button");b.type="button";b.dataset.i=i;b.setAttribute("aria-pressed",avcCfg[key]===i);
    if(kind==="sw"){b.style.setProperty("--sw",opts[i]);b.setAttribute("aria-label",AVS[avcSt].p[avcPg][1]+" "+(i+1))}
    else{b.appendChild(avcThumb({...avcCfg,[key]:i,...(key==="hair"?{hat:0}:{})},thumbKey||key));const sp=document.createElement("span");sp.textContent=opts[i];b.appendChild(sp)}
    b.onclick=()=>pick(i,b);return b};
  if(key==="hair"){const cur=HAIR_GRP.findIndex(([,ids])=>ids.includes(avcCfg.hair|0));if(!avcHg||avcHg>=HAIR_GRP.length)avcHg=Math.max(0,cur);
    const seg=document.createElement("div");seg.className="avc-seg";HAIR_GRP.forEach(([gl],gi)=>{const b=document.createElement("button");b.type="button";b.textContent=gl;b.setAttribute("aria-pressed",gi===avcHg);b.onclick=()=>{avcHg=gi;avcRender()};seg.appendChild(b)});sec.appendChild(seg);
    HAIR_GRP[avcHg][1].forEach(i=>{const b=mk(i);if(b)row.appendChild(b)});sec.appendChild(row);return}
  let nl=0;opts.forEach((_,i)=>{const b=mk(i);if(b)row.appendChild(b);else nl++});sec.appendChild(row);
  if(nl){const h=document.createElement("p");h.className="avc-lock";h.textContent=`+ ${nl} à débloquer dans l'Armoire`;sec.appendChild(h)}}
function avcRender(){
  const st=AVS[avcSt],pg=st.p[avcPg];
  $("avcTabs").innerHTML=AVS.map((s,i)=>`<button type="button" role="tab" data-i="${i}" aria-selected="${i===avcSt}" aria-label="${s.l}"><i>${s.ic==="visage"?`<img alt="" src="${avcFaceIcon()}">`:rkSvg(s.ic)}</i><span>${s.l}</span></button>`).join("");
  $("avcTabs").querySelectorAll("button").forEach(b=>b.onclick=()=>{avcSt=+b.dataset.i;avcPg=0;avcRender()});
  $("avcPgT").textContent=pg[1];
  $("avcDots").innerHTML=st.p.map((_,i)=>`<i class="${i===avcPg?"on":i<avcPg?"done":""}"></i>`).join("");
  const body=$("avcBody");body.innerHTML="";body.scrollTop=0;const sec=document.createElement("div");sec.className="avc-sec";body.appendChild(sec);avcOptions(pg[0],sec);
  $("avcBack").disabled=avcSt===0&&avcPg===0;$("avcSave").textContent=avcLast()?"Enregistrer":"Suivant";$("avcNow").hidden=avcLast();
  avcPaint()}
function avcFaceIcon(){const H=chFace({...avcCfg,hat:0,main:0}),cv=document.createElement("canvas");cv.width=H.W;cv.height=H.H;const g=cv.getContext("2d");for(let y=0;y<H.H;y++)for(let x=0;x<H.W;x++){const v=H.px[y*H.W+x];if(v){g.fillStyle=v;g.fillRect(x,y,1,1)}}return cv.toDataURL()}
function avcGo(d){if(d>0){if(avcPg<AVS[avcSt].p.length-1)avcPg++;else if(avcSt<AVS.length-1){avcSt++;avcPg=0}}else{if(avcPg>0)avcPg--;else if(avcSt>0){avcSt--;avcPg=AVS[avcSt].p.length-1}}avcRender()}
function openAvc(who){if(!S.g)return;avcWho=typeof who==="string"?who:"__me";const me=avcWho==="__me",P=me?null:(S.profiles[avcWho]=S.profiles[avcWho]||{});
  avcCfg={...AV_DEF,...(me?(S.g.avc||{}):(P.avc||{beard:0,hairC:Math.floor(Math.random()*6),skin:Math.floor(Math.random()*6),hair:Math.floor(Math.random()*9),topC:Math.floor(Math.random()*10),bgC:Math.floor(Math.random()*8)}))};
  $("avcT").textContent=me?"Mon personnage":"Avatar de "+avcWho;$("avcPhoto").textContent=me?"Garder ma photo":"Retirer l'avatar";$("avcPhoto").hidden=me||!P.avc;avcSt=0;avcPg=0;avcHg=0;$("avCreator").hidden=false;document.body.classList.add("avc-open");avcRender();$("avcSave").focus({preventScroll:true})}
function closeAvc(){$("avCreator").hidden=true;document.body.classList.remove("avc-open")}
$("avBtn").onclick=openAvc;
$("avcClose").onclick=closeAvc;
$("avCreator").addEventListener("click",e=>{if(e.target===$("avCreator"))closeAvc()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("avCreator").hidden)closeAvc()});
$("avcRnd").onclick=()=>{const r=n=>Math.floor(Math.random()*n);const L=k=>AV_OPT[k].length;avcCfg={skin:r(L("skin")),hairC:r(L("hairC")),eyeC:r(L("eyeC")),topC:r(L("topC")),accC:r(L("accC")),bgC:r(L("bgC")),bgP:Math.random()<.5?0:r(L("bgP")),hair:r(L("hair")),beard:Math.random()<.5?0:r(L("beard")),top:r(L("top")),hat:Math.random()<.4?r(L("hat")):0,glasses:Math.random()<.3?r(L("glasses")):0,bijou:Math.random()<.5?0:r(L("bijou")),mouth:r(L("mouth")),eyes:Math.random()<.6?0:r(L("eyes")),mark:Math.random()<.7?0:r(L("mark")),main:0,bot:r(L("bot")),botC:r(L("botC")),shoe:r(L("shoe")),shoeC:r(L("shoeC"))};["hat","top","glasses","bijou","bgP","main"].forEach(k=>{if(avLock(k,avcCfg[k]|0))avcCfg[k]=0});avcPaint();avcRender()};
function avcDoSave(){const url=avCanvas(avcCfg,4).toDataURL("image/png"),me=avcWho==="__me",P=me?S.g:S.profiles[avcWho];
  const prev=me?S.myPic:P.pic,prevC=P.avc;if(me)S.myPic="";else delete P.pic;P.avc={...avcCfg};
  if(JSON.stringify(snapshot()).length>235000){if(me)S.myPic=prev;else P.pic=prev;P.avc=prevC;toast("Plus assez de place pour enregistrer le portrait");return}
  save();closeAvc();render();if(!me&&view==="p")renderProfile(true);toast(me?"Personnage enregistré":`Avatar de <span class="p">${esc(avcWho)}</span> enregistré`)}
$("avcSave").onclick=()=>{if(avcLast())avcDoSave();else avcGo(1)};$("avcBack").onclick=()=>avcGo(-1);$("avcNow").onclick=avcDoSave;
$("avcPhoto").onclick=()=>{if(avcWho==="__me")return;
  const P=S.profiles[avcWho];if(P){delete P.pic;delete P.avc}save();closeAvc();render();if(view==="p")renderProfile(true);toast("Avatar retiré")};

