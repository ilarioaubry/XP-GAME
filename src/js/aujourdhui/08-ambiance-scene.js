// ---- Ambiance du moment
function ambPhase(){const h=adjH();return h>=5&&h<9?"aube":h>=9&&h<12.5?"matin":h>=12.5&&h<17?"aprem":h>=17&&h<20.5?"crep":"nuit"}
const AMB_SKY={aube:"linear-gradient(180deg,#2b2a5e 0%,#7a4a7a 38%,#e8705a 70%,#ffb46a 100%)",matin:"linear-gradient(180deg,#3d9be6 0%,#7cc8f4 55%,#d8f0ff 100%)",aprem:"linear-gradient(180deg,#2f86d8 0%,#6ab8f0 60%,#bfe4ff 100%)",crep:"linear-gradient(180deg,#24184a 0%,#6a2f6a 40%,#d8584a 75%,#ff9a4a 100%)",nuit:"linear-gradient(180deg,#050817 0%,#0e1430 55%,#1d1d44 100%)"};
const AMB_HILL={aube:["#5a3a66","#2e1d3e"],matin:["#6cbf62","#3a8a44"],aprem:["#62b558","#347e3e"],crep:["#4a2a58","#1f1230"],nuit:["#18203e","#0a0d20"]};
function ambPx(rows,pal){let r="";rows.forEach((row,y)=>[...row].forEach((ch,x)=>{if(pal[ch])r+=`<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${pal[ch]}"/>`}));return`<svg viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}
function ambSun(ph){const rows=[];for(let y=0;y<12;y++){let s="";for(let x=0;x<12;x++){const d=(x-5.5)**2+(y-5.5)**2;s+=d<=31?(d<=9&&x<6&&y<6?"h":"a"):"."}rows.push(s)}const warm=ph==="aube"||ph==="crep";return ambPx(rows,{a:warm?"#ff8a3a":"#ffd94a",h:warm?"#ffc07a":"#fff6b0"})}
function ambMoon(){const rows=[];for(let y=0;y<12;y++){let s="";for(let x=0;x<12;x++){const d=(x-5.5)**2+(y-5.5)**2,d2=(x-8)**2+(y-3.5)**2;s+=d<=31&&d2>20?"a":"."}rows.push(s)}return ambPx(rows,{a:"#f4f0d0"})}
const AMB_CLOUD=ambPx(["....wwww........","..wwwwwwww.ww...",".wwwwwwwwwwwwww.","wwwwwwwwwwwwwwww",".ssssssssssssss."],{w:"#ffffff",s:"#d8e6f2"});
function ambHills(c1,c2){let r="";for(let x=0;x<64;x++){const y1=Math.round(8+2.2*Math.sin(x/7)+1.3*Math.sin(x/3.1)),y2=Math.round(12+1.6*Math.sin(x/5+2));r+=`<rect x="${x}" y="${y1}" width="1.03" height="${16-y1}" fill="${c1}"/><rect x="${x}" y="${y2}" width="1.03" height="${16-y2}" fill="${c2}"/>`}
  return`<svg viewBox="0 0 64 16" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}
function ambEl(ph){const d=document.createElement("div");d.className="amb amb-"+ph;d.dataset.ph=ph;d.setAttribute("aria-hidden","true");const[h1,h2]=AMB_HILL[ph];
  let h=`<div class="ambsky" style="background:${AMB_SKY[ph]}"></div>`;
  if(ph!=="matin"&&ph!=="aprem")h+=`<div class="ambstars">${Array.from({length:ph==="nuit"?24:8},(_,i)=>`<i style="left:${(i*37+11)%100}%;top:${(i*53+7)%(ph==="nuit"?68:34)}%;animation-delay:${(i%7)*.45}s"></i>`).join("")}</div>`;
  h+=`<div class="ambbody b-${ph}">${ph==="nuit"?ambMoon():ambSun(ph)}</div>`;
  if(ph!=="nuit")h+=`<div class="ambcl c1">${AMB_CLOUD}</div><div class="ambcl c2">${AMB_CLOUD}</div>`;
  h+=`<div class="ambhill">${ambHills(h1,h2)}</div>`;
  if(ph==="nuit"||ph==="crep")h+=`<div class="ambff">${Array.from({length:5},(_,i)=>`<i style="left:${10+i*19}%;animation-delay:${i*.9}s"></i>`).join("")}</div>`;
  d.innerHTML=h;return d}
// ---- Moment vivant : ciel continu, lune réelle, saisons, scène, son
const SKY_K=[[0,["#050817","#0b1230","#141a3a","#1d1d44"],1,"#a99cff"],[4.5,["#060a1c","#0e1434","#1a1c42","#25204a"],1,"#a99cff"],[6,["#2b2a5e","#5a3a72","#c0607a","#ff9a6a"],.55,"#ffa36a"],[7.5,["#3f6ab8","#8a8fc8","#f0a888","#ffd0a0"],.25,"#ffb070"],[9,["#3d9be6","#62b4ee","#a8dcf8","#e0f4ff"],0,"#ffd94a"],[13,["#2f86d8","#4aa0e8","#8cccf6","#c8e8ff"],0,"#ffd94a"],[17,["#3a7ec8","#6aa4dc","#f0c890","#ffd9a0"],.05,"#ffc060"],[18.6,["#3a3a7a","#a04a7a","#f07a5a","#ffb060"],.3,"#ff9a7a"],[19.8,["#24184a","#5a2a62","#c04a5a","#ff8a4a"],.6,"#ff8a9a"],[21,["#0a0d26","#1a1840","#3a2450","#4a2a50"],.9,"#b09cff"],[22,["#050817","#0b1230","#141a3a","#1d1d44"],1,"#a99cff"],[24,["#050817","#0b1230","#141a3a","#1d1d44"],1,"#a99cff"]];
const hx3=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mixc=(a,b,t)=>{const A=hx3(a),B=hx3(b);return"#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("")};
function isWeekend(){const d=new Date(dayKey(Date.now())+"T12:00").getDay();return d===0||d===6}
function skyAt(h){let i=0;while(i<SKY_K.length-2&&SKY_K[i+1][0]<=h)i++;const a=SKY_K[i],b=SKY_K[i+1],t=Math.max(0,Math.min(1,(h-a[0])/(b[0]-a[0])));let c=a[1].map((x,k)=>mixc(x,b[1][k],t));const n=a[2]+(b[2]-a[2])*t;
  if(isWeekend()&&n<.5)c=c.map(x=>mixc(x,"#ffffff",.1*(1-n*2)));return{c,n,ac:mixc(a[3],b[3],t)}}
function season(d){d=d||new Date(dayKey(Date.now())+"T12:00");const v=(d.getMonth()+1)*100+d.getDate();return v>=1221||v<320?"hiver":v<621?"printemps":v<922?"ete":"automne"}
const SEA={printemps:{h:["#82d070","#4a9a4a"],g:["#6cc05a","#8a5a2a"],p:"petal",n:"Printemps"},ete:{h:["#6cbf52","#3a8a3a"],g:["#5cb048","#7a4a20"],p:"",n:"Été"},automne:{h:["#c89a44","#8a5a2a"],g:["#b08a3a","#6a4420"],p:"leaf",n:"Automne"},hiver:{h:["#e4ecf4","#a8b6c6"],g:["#eef4fa","#8a96a6"],p:"snow",n:"Hiver"}};
const NIGHT_HILL=["#18203e","#0a0d20"];
function moonPhase(t){const syn=29.530588853,ref=Date.UTC(2000,0,6,18,14);return(((t-ref)/864e5)%syn+syn)%syn/syn}
function moonName(f){return f<.03||f>.97?"Nouvelle lune":f<.22?"Premier croissant":f<.28?"Premier quartier":f<.47?"Lune gibbeuse":f<.53?"Pleine lune":f<.72?"Lune gibbeuse":f<.78?"Dernier quartier":"Dernier croissant"}
function moonSvg(f){const rows=[];const k=Math.cos(2*Math.PI*f);for(let y=0;y<13;y++){let s="";for(let x=0;x<13;x++){const nx=(x-6)/6.3,ny=(y-6)/6.3;if(nx*nx+ny*ny>1){s+=".";continue}const w=Math.sqrt(1-ny*ny),lit=f<.5?nx>k*w:nx<-k*w;s+=lit?(nx<-.25&&ny<-.25?"h":"a"):"d"}rows.push(s)}return ambPx(rows,{a:"#f4f0d0",h:"#fffbe6",d:"#262b48"})}
function skyHillsSvg(){let r="";for(let x=0;x<64;x++){const y1=Math.round(8+2.2*Math.sin(x/7)+1.3*Math.sin(x/3.1)),y2=Math.round(12+1.6*Math.sin(x/5+2));r+=`<rect class="k1" x="${x}" y="${y1}" width="1.03" height="${16-y1}"/><rect class="k2" x="${x}" y="${y2}" width="1.03" height="${16-y2}"/>`}
  return`<svg viewBox="0 0 64 16" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`}
function skyParts(p){if(!p)return"";const C={leaf:["#e0782a","#c8501e","#f0b040"],snow:["#ffffff","#e8f0ff","#ffffff"],petal:["#ffb0d0","#ffd0e4","#ff90b8"]}[p];
  return Array.from({length:p==="snow"?26:14},(_,i)=>`<i class="${p}" style="left:${(i*41+7)%100}%;--c:${C[i%3]};--sw:${(i%5)*6-12}px;animation-duration:${(p==="snow"?11:9)+(i%6)*2}s;animation-delay:${-(i*1.7)%14}s"></i>`).join("")}
function skyApply(){const on=!(S.g&&S.g.da==="classic"),Rt=document.documentElement;Rt.classList.toggle("sky",on);let bg=document.getElementById("skyBg");
  if(!on){if(bg)bg.remove();delete Rt.dataset.ph;Rt.style.removeProperty("--skyac");return}
  Rt.dataset.ph=ambPhase();if(!bg){bg=document.createElement("div");bg.id="skyBg";bg.setAttribute("aria-hidden","true");document.body.prepend(bg)}
  if(!bg.dataset.sv){bg.dataset.sv="2";bg.innerHTML=`<div class="skg"></div><div class="skst">${Array.from({length:34},(_,i)=>`<i style="left:${(i*37+11)%100}%;top:${(i*53+7)%62}%;animation-delay:${(i%7)*.45}s"></i>`).join("")}</div><div class="sksun">${ambSun("matin")}</div><div class="skmoon"></div><div class="skcl c1">${AMB_CLOUD}</div><div class="skcl c2">${AMB_CLOUD}</div><div class="skpt"></div><div class="skhill">${skyHillsSvg()}</div><div class="skshade"></div>`}
  skyTick()}
function skyTick(){const bg=document.getElementById("skyBg");if(!bg)return;const h=adjH(),S0=skyAt(h),se=season(),SE=SEA[se],n=S0.n,Rt=document.documentElement;
  bg.querySelector(".skg").style.background=`linear-gradient(180deg,${S0.c[0]} 0%,${S0.c[1]} 38%,${S0.c[2]} 72%,${S0.c[3]} 100%)`;
  bg.style.setProperty("--k1",mixc(SE.h[0],NIGHT_HILL[0],n));bg.style.setProperty("--k2",mixc(SE.h[1],NIGHT_HILL[1],n));
  bg.querySelector(".skst").style.opacity=Math.max(0,(n-.35)/.65).toFixed(2);bg.querySelectorAll(".skcl").forEach(c=>c.style.opacity=((1-n)*.85).toFixed(2));
  const sun=bg.querySelector(".sksun"),ts=(h-6.2)/(20.2-6.2);if(ts>-.05&&ts<1.05){sun.hidden=false;sun.style.left=(4+ts*82)+"%";sun.style.top=(44-Math.sin(Math.PI*Math.max(0,Math.min(1,ts)))*36)+"%";sun.style.filter=`drop-shadow(0 0 14px ${mixc("#ffe080","#ff7a3a",Math.min(1,n*2))})`;sun.dataset.w=n>.15?"1":""}else sun.hidden=true;
  const mo=bg.querySelector(".skmoon"),f=moonPhase(Date.now()),fk=f.toFixed(2);if(mo.dataset.f!==fk){mo.dataset.f=fk;mo.innerHTML=moonSvg(f)}
  const tm=((h-19.5+24)%24)/11;if(n>.45&&tm<=1){mo.hidden=false;mo.style.left=(8+tm*78)+"%";mo.style.top=(40-Math.sin(Math.PI*tm)*30)+"%";mo.style.opacity=Math.min(1,(n-.45)/.3).toFixed(2)}else mo.hidden=true;
  const pt=bg.querySelector(".skpt");if(pt.dataset.s!==se){pt.dataset.s=se;pt.innerHTML=skyParts(SE.p)}
  Rt.style.setProperty("--skyac",S0.ac);Rt.dataset.ph=ambPhase();Rt.dataset.mo=momentOf()}
setInterval(()=>{if(document.documentElement.classList.contains("sky")&&!document.hidden){skyTick();sceneTick()}},60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&document.documentElement.classList.contains("sky")){skyTick();sceneTick()}});
function momentOf(){const h=dayH();return h>=4&&h<12?"matin":h<17.5?"midi":h<21?"soir":"nuit"}
// ---- La scène : ton avatar dans le décor
// ---- Avatar en pied pour la scène

let __scBody={k:"",u:{}};
function sceneBody(){const cfg=sceneState().c,k=JSON.stringify(cfg);if(__scBody.k!==k){const u=(p,f)=>chURL(cfg,p,f,2);__scBody={k,u:{yw:chURL({...cfg,eyes:8,mouth:7},"idle",0,2),i0:u("idle",0),i1:u("idle",1),w0:u("walk",0),w1:u("walk",1),w2:u("walk",2),w3:u("walk",3),up:u("up",0),st:u("stretch",0),sit:u("sit",0),wv0:u("wave",0),wv1:u("wave",1)}}}return __scBody.u}



// ---- Visiteurs : les proches passent dans la scène (anniversaire du jour, contact du jour)
function sceneVisitors(){const G=S.g,tk=dayKey(Date.now()),P=S.profiles||{},out=[],seen=new Set();
  const add=(n,why,msg)=>{if(seen.has(n)||out.length>=2)return;const p=P[n];if(!p||!p.avc)return;seen.add(n);out.push({n,why,msg,avc:p.avc})};
  const today=(S.log||[]).filter(e=>e.who&&e.xp>0&&dayKey(e.t)===tk).sort((a,b)=>b.t-a.t);
  Object.keys(P).forEach(n=>{const nb=nextBirthday(P[n].bd);if(nb&&nb.days===0)add(n,"bd",today.some(e=>e.who===n&&/anniv/i.test(e.name||""))||(S.log||[]).some(e=>dayKey(e.t)===tk&&/anniversaire/i.test(e.name||"")&&(e.name||"").endsWith(n))?"Merci pour tes vœux !":"C'est mon anniversaire !")});
  {const D=G.duo;if(D&&D.who&&Array.isArray(D.him)&&D.him.includes(tk))add(D.who,"duo","J'ai fait notre défi : "+D.c.charAt(0).toLowerCase()+D.c.slice(1)+" !")}
  today.forEach(e=>{const a=e.a||"",nm=e.name||"";add(e.who,"call",/call|^Appeler/i.test(a+" "+nm)&&/call/.test(a)||/^Appeler/.test(nm)?"Merci pour l'appel !":/meet/.test(a)||/^Voir/.test(nm)?"Trop bien de t'avoir vu !":/news/.test(a)||/nouvelles/.test(nm)?"Merci d'avoir pris des nouvelles !":"Ça m'a fait plaisir !")});
  return out}
function sceneVisHTML(V,sit){return V.map((v,i)=>{const c={...AV_DEF,...v.avc},u=(p,f)=>chURL(c,p,f,2);
  const idle=sit?[u("sit",0)]:[u("idle",0),u("idle",1)];
  return`<div class="scvis v${i}${sit?" sit":""}" data-n="${esc(v.n)}" role="button" tabindex="0" aria-label="${esc(v.n)} est passé·e te voir : ${esc(v.msg)}"><div class="scvi n${idle.length}">${idle.map((s,k)=>`<img class="f f${k}" src="${s}" alt="">`).join("")}</div>${sit?"":`<div class="scvw">${[0,1,2,3].map(k=>`<img class="f f${k}" src="${u("walk",k)}" alt="">`).join("")}</div><div class="scvv"><img class="f f0" src="${u("wave",0)}" alt=""><img class="f f1" src="${u("wave",1)}" alt=""></div>`}${v.why==="bd"?`<span class="scgift">${pxImg("gift",2)}</span>`:""}<span class="scbub"><b></b> <span></span></span></div>`}).join("")}
function sceneVisWire(box,V){const G=S.g,tk=dayKey(Date.now());if(!G.visA||G.visA.d!==tk)G.visA={d:tk,n:[]};const rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  box.querySelectorAll(".scvis").forEach((el,i)=>{const v=V[i];if(!v)return;el.querySelector(".scbub b").textContent=v.n;el.querySelector(".scbub span").textContent=v.msg;
    let tt=0;const talk=(ms)=>{box.querySelectorAll(".scvis.talk").forEach(o=>{if(o!==el)o.classList.remove("talk")});el.classList.add("talk");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("talk"),ms||3800)};
    const wave=()=>{if(el.classList.contains("sit"))return;el.classList.add("wv");setTimeout(()=>el.classList.remove("wv"),1500)};
    if(!G.visA.n.includes(v.n)){G.visA.n.push(v.n);save();
      if(!rm&&!el.classList.contains("sit")){el.classList.add("arr");setTimeout(()=>{el.classList.remove("arr");wave()},2300+i*500);setTimeout(()=>{talk(4000);try{sfx("blip")}catch(e){}},2400+i*4400);el.style.animationDelay=i*.5+"s"}
      else setTimeout(()=>talk(4000),400+i*4400)}
    el.onclick=()=>{if(el.classList.contains("talk")){openProfile(v.n);return}wave();talk();try{sfx("blip")}catch(e){}};
    el.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();el.onclick()}}})}
// ---- L'avatar fait le rituel avec toi
const ACTS={dents:{fx:"spark",face:[1,2]},lit:{fr:[["stretch",0],["idle",0]],fx:"spark",face:[1,0]},douche:{fx:"rain",face:[8,2]},visage:{fx:"splash",face:[8,2]},
  barbe:{fx:"foam",face:[0,0]},fenetre:{fx:"wind",face:[1,0]},eau:{item:13,fx:"up",face:[0,0]},sport:{item:9,fr:[["idle",0],["up",0]],fx:"spark",face:[2,1]},
  lire:{item:5,fx:"spark",face:[0,0]},medit:{fr:[["sit",0],["sit",0]],fx:"glow",face:[8,0]},note:{fx:"spark",face:[0,0]},repas:{item:10,fx:"steam",face:[1,2]},
  ecran:{fx:"spark",face:[0,1]},vit:{fx:"spark",face:[0,0]},_:{fr:[["wave",0],["wave",1]],fx:"spark",face:[1,0]}};
const R_=(a,b)=>a+Math.random()*(b-a);
function sceneFx(kind){const L=[];const add=(x,y,cls,dx,dy,d)=>L.push(`<i class="${cls}" style="left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px;animation-delay:${d}s"></i>`);
  if(kind==="rain")for(let i=0;i<14;i++)add(R_(4,58),R_(-14,6),"fd",0,R_(80,100),i*.1);
  else if(kind==="splash")for(let i=0;i<9;i++)add(R_(22,40),R_(34,44),"fs",R_(-26,26),R_(-26,-6),i*.07);
  else if(kind==="up")for(let i=0;i<8;i++)add(R_(44,56),R_(56,66),"fs",R_(-10,10),R_(-50,-30),i*.16);
  else if(kind==="wind")for(let i=0;i<7;i++)add(-30,R_(8,92),i%3?"fw":"fl",R_(120,150),R_(-8,8),i*.17);
  else if(kind==="steam")for(let i=0;i<6;i++)add(R_(46,56),R_(54,60),"fm",R_(-8,8),R_(-36,-26),i*.25);
  else if(kind==="foam")for(let i=0;i<7;i++)add(R_(20,40),R_(28,36),"ff",0,0,i*.1);
  else if(kind==="glow")for(let i=0;i<3;i++)add(2,0,"fg",0,0,i*.45);
  else for(let i=0;i<8;i++)add(R_(0,58),R_(0,48),"fp",0,0,i*.12);
  return`<span class="scfx">${L.join("")}</span>`}
function sceneAct(k){const box=$("sceneBox"),av=box&&box.querySelector(".scav");if(!av||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const A=ACTS[k]||ACTS._,st=sceneState(),sit=!!av.closest(".pose-sit");clearTimeout(av.__at);av.querySelectorAll(".fa,.scbk,.scfx").forEach(x=>x.remove());av.classList.remove("cheer","cheer2","yawn");
  if(!sit){const c={...st.c,...(A.item!=null?{main:A.item}:{}),...(A.face?{eyes:A.face[0],mouth:A.face[1]}:{})};(A.fr||[["idle",0],["idle",1]]).forEach(([p,f],i)=>{const im=document.createElement("img");im.className="fa fa"+i;im.src=chURL(c,p,f,2);im.alt="";av.appendChild(im)});av.classList.add("act")}
  av.insertAdjacentHTML("beforeend",`<span class="scbk">${rkSvg(k)}</span>`+sceneFx(A.fx));
  av.__at=setTimeout(()=>{av.classList.remove("act");av.querySelectorAll(".fa,.scbk,.scfx").forEach(x=>x.remove())},2200)}
let __yawnT=0;
function sceneYawn(on){clearTimeout(__yawnT);if(!on)return;__yawnT=setTimeout(function y(){const av=document.querySelector("#sceneBox .scn:not(.pose-sit) .scav");if(av&&!av.classList.contains("act")&&!document.hidden){av.classList.add("yawn");setTimeout(()=>av.classList.remove("yawn"),1500)}__yawnT=setTimeout(y,9000+Math.random()*7000)},5000)}
const FIRE=["....y.....","...yYy....","..yYrYy...","..YrRrY...",".yYrRrYy..","..YrRrY...","oNNoNNoNNo",".oNNNNNNo."];
function sceneTick(){const box=$("sceneBox");if(!box||!S.g)return;const h=dayH(),ph=ambPhase(),se=season(),SE=SEA[se],we=isWeekend(),f=moonPhase(Date.now());
  const V=sceneVisitors(),SS=sceneState();let pose=ph==="aube"?"stretch":ph==="nuit"||ph==="crep"?"sit":"walk";if(pose==="walk"&&V.length)pose="idle";const night=ph==="nuit",B=sceneBody(),hi={aube:"Bon réveil",matin:"Bonjour",aprem:"Bon après-midi",crep:"Bonsoir",nuit:"Bonne nuit"}[ph];
  const dl=new Date(dayKey(Date.now())+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"short"});
  const sub=dl.charAt(0).toUpperCase()+dl.slice(1);
  const key=[pose,night,sub,__scBody.k,S.g.ambS?1:0,S.name,se,V.map(v=>v.n+v.msg+JSON.stringify(v.avc)).join(",")].join("|");if(box.__k===key)return;box.__k=key;
  let g="";for(let x=0;x<64;x++){const y=Math.round(2+Math.sin(x/6)*1.2);g+=`<rect x="${x}" y="${y}" width="1.03" height="1" fill="${mixc(SE.g[0],"#ffffff",.18)}"/><rect x="${x}" y="${y+1}" width="1.03" height="${3}" fill="${SE.g[0]}"/><rect x="${x}" y="${y+4}" width="1.03" height="${8-y-4}" fill="${SE.g[1]}"/>`;if(x%9===3&&se!=="hiver")g+=`<rect x="${x}" y="${y-1}" width="1" height="1" fill="${SE.g[0]}"/>`}
  box.innerHTML=`<div class="scn se-${se} pose-${pose}${night?" night":""}${SS.md?" md"+SS.md:""}${SS.tired?" tired":""}${SS.tired||(SS.md&&SS.md<=2)?" slow":SS.md===5?" glad":""}"><div class="scnt"><b></b><small></small></div><button type="button" class="scwx" aria-label="Météo"></button><button type="button" class="scsnd" aria-pressed="${!!S.g.ambS}" aria-label="Ambiance sonore" title="Ambiance sonore">${S.g.ambS?'<svg class="ic pxic" viewBox="0 0 12 12" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><rect x="5" y="1" width="1" height="1.02"/><rect x="4" y="2" width="2" height="1.02"/><rect x="9" y="2" width="1" height="1.02"/><rect x="3" y="3" width="3" height="1.02"/><rect x="10" y="3" width="1" height="1.02"/><rect x="0" y="4" width="4" height="1.02"/><rect x="5" y="4" width="1" height="1.02"/><rect x="8" y="4" width="1" height="1.02"/><rect x="11" y="4" width="1" height="1.02"/><rect x="0" y="5" width="4" height="1.02"/><rect x="5" y="5" width="1" height="1.02"/><rect x="9" y="5" width="1" height="1.02"/><rect x="11" y="5" width="1" height="1.02"/><rect x="0" y="6" width="4" height="1.02"/><rect x="5" y="6" width="1" height="1.02"/><rect x="9" y="6" width="1" height="1.02"/><rect x="11" y="6" width="1" height="1.02"/><rect x="0" y="7" width="4" height="1.02"/><rect x="5" y="7" width="1" height="1.02"/><rect x="8" y="7" width="1" height="1.02"/><rect x="11" y="7" width="1" height="1.02"/><rect x="3" y="8" width="3" height="1.02"/><rect x="10" y="8" width="1" height="1.02"/><rect x="4" y="9" width="2" height="1.02"/><rect x="9" y="9" width="1" height="1.02"/><rect x="5" y="10" width="1" height="1.02"/></svg>':'<svg class="ic pxic" viewBox="0 0 12 12" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true"><rect x="5" y="1" width="1" height="1.02"/><rect x="4" y="2" width="2" height="1.02"/><rect x="3" y="3" width="3" height="1.02"/><rect x="7" y="3" width="1" height="1.02"/><rect x="11" y="3" width="1" height="1.02"/><rect x="0" y="4" width="4" height="1.02"/><rect x="5" y="4" width="1" height="1.02"/><rect x="8" y="4" width="1" height="1.02"/><rect x="10" y="4" width="1" height="1.02"/><rect x="0" y="5" width="4" height="1.02"/><rect x="5" y="5" width="1" height="1.02"/><rect x="9" y="5" width="1" height="1.02"/><rect x="0" y="6" width="4" height="1.02"/><rect x="5" y="6" width="1" height="1.02"/><rect x="9" y="6" width="1" height="1.02"/><rect x="0" y="7" width="4" height="1.02"/><rect x="5" y="7" width="1" height="1.02"/><rect x="8" y="7" width="1" height="1.02"/><rect x="10" y="7" width="1" height="1.02"/><rect x="3" y="8" width="3" height="1.02"/><rect x="7" y="8" width="1" height="1.02"/><rect x="11" y="8" width="1" height="1.02"/><rect x="4" y="9" width="2" height="1.02"/><rect x="5" y="10" width="1" height="1.02"/></svg>'}</button>
    <div class="scgr"><svg viewBox="0 0 64 8" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">${g}</svg></div>
    ${pose==="sit"?`<div class="sclog">${ambPx(["..oooooooooo..",".oNNNNNNNNnNo.","oNnNNNNNNNNNNo","oNNNNNNnNNNNNo",".oNNNNNNNNNNo.","..oooooooooo.."],{o:"#2a1606",N:"#7a4a24",n:"#a8743a"})}</div>`:""}${pose==="sit"?`<div class="scfire">${ambPx(FIRE,{y:"#ffe066",Y:"#ffb030",r:"#ff7a2a",R:"#e8402a",o:"#3a2410",N:"#7a4a24"})}</div>`:""}
    <div class="scav n${(pose==="walk"?4:pose==="sit"?1:2)}">${(pose==="walk"?[B.w0,B.w1,B.w2,B.w3]:pose==="sit"?[B.sit]:pose==="stretch"?[B.i0,B.st]:[B.i0,B.i1]).map((u,i)=>`<img class="f f${i}" src="${u}" alt="">`).join("")}<img class="fu" src="${B.up}" alt=""><img class="fw0" src="${B.wv0}" alt=""><img class="fw1" src="${B.wv1}" alt=""><img class="fy" src="${B.yw}" alt="">${(()=>{const w=wxNow();return w&&(w.k==="rain"||w.k==="storm")?`<span class="scumb">${ambPx(WX_UMB,{o:"#24182c",R:"#d64a3a",W:"#f4f1e8",k:"#5a3a2a"})}</span>`:""})()}${SS.md===1?`<span class="sccloud">${ambPx(["...oooo.....","..oWWWWo.oo.",".oWWWWWWoWWo","oWWWWWWWWWWo","oKKKKKKKKKKo",".oooooooooo."],{o:"#24182c",W:"#c8ccd8",K:"#9aa0b4"})}<i></i><i></i><i></i></span>`:""}${SS.md===5?`<span class="scglad"><i></i><i></i><i></i></span>`:""}</div>${sceneVisHTML(V,pose==="sit")}</div>`;sceneVisWire(box,V);sceneYawn(SS.tired&&pose!=="sit");{const x=box.querySelector(".scwx");if(x)x.onclick=()=>wxSheet()}box.__wx=wxK2();wxBoot();
  box.querySelector(".scnt b").textContent=hi+(S.name?", "+S.name:"");box.querySelector(".scnt small").textContent=sub;
  {const av=box.querySelector(".scav");if(av)av.onclick=()=>{av.classList.add("wave");sfx("blip");setTimeout(()=>av.classList.remove("wave"),1600)}}
  box.querySelector(".scsnd").onclick=()=>{S.g.ambS=!S.g.ambS;save();sfxCtx();ambSnd(!!S.g.ambS);box.__k="";sceneTick();toast(S.g.ambS?"Ambiance sonore activée":"Ambiance sonore coupée")}}
function skyCheer(big){const a=document.querySelector("#sceneBox .scav");if(!a)return;a.classList.remove("cheer","cheer2");void a.offsetWidth;a.classList.add(big?"cheer2":"cheer");setTimeout(()=>a.classList.remove("cheer","cheer2"),1300)}
// ---- Ambiance sonore 8 bits
let ambT=0;
function ambSnd(on){clearTimeout(ambT);if(!on)return;const loop=()=>{ambT=setTimeout(loop,900+Math.random()*1900);if(!S.g||!S.g.ambS||document.hidden||!sfxOn())return;const c=sfxCtx();if(!c||c.state!=="running")return;const t=c.currentTime+.03,n=skyAt(adjH()).n;
  if(n<.4){if(Math.random()<.65){const f=2300+Math.random()*1300,k=2+(Math.random()*3|0);for(let i=0;i<k;i++)tone(c,f+i*90,t+i*.085,.06,"sine",.022,f*1.28)}if(Math.random()<.3)noise(c,t,1.4,.012,450)}
  else{for(let i=0;i<5;i++)tone(c,4100+Math.random()*120,t+i*.05,.022,"sine",.011);if(n>.9&&Math.random()<.07){tone(c,390,t+.3,.32,"sine",.035,340);tone(c,380,t+.8,.42,"sine",.035,320)}if(n<.8&&Math.random()<.3)noise(c,t,1.2,.01,350)}};loop()}
// ---- Quêtes du moment
const MQ=[["lumiere","5 min dehors à la lumière du matin",[7,10.5],15,"soi"],["dejdehors","Manger dehors ou près d'une fenêtre",[12,14.5],15,"soi"],["pause","10 min de marche dehors",[15,17],10,"sport"],["coucher","5 min dehors au coucher du soleil",[18.3,20.3],20,"soi"],["etoiles","Préparer tes affaires pour demain",[21,23.5],10,"maison"],["balade","Aller au marché ou à la boulangerie à pied",[10,18],25,"sport","we"],["sortie","Voir quelqu'un en vrai aujourd'hui",[11,22],25,"social","we"]];
function mqActive(){if(!S.g)return[];const h=dayH(),we=isWeekend(),tk=dayKey(Date.now()),done=((S.g.mq||{})[tk])||[];const w=typeof wxNow==="function"?wxNow():null,wet=w&&["rain","storm","snow"].includes(w.k),grey=w&&["cloudy","fog"].includes(w.k),fo=typeof fqHasOut==="function"&&fqHasOut();return MQ.concat(typeof wxQuests==="function"?wxQuests():[]).filter(q=>!((wet||grey)&&(q[0]==="coucher"||q[0]==="etoiles"))&&!((wet||fo)&&(q[0]==="lumiere"||q[0]==="balade"))&&!(fo&&q[0]==="wxsun")).filter(q=>h>=q[2][0]&&h<q[2][1]&&(!q[5]||we)&&!done.includes(q[0])&&!((S.g.fqNo||{})["m:"+q[0]])&&normOk(q[1]))}
function mqUntil(b){const r=(b+wakeH()-8+48)%24,hh=Math.floor(r),mm=Math.round((r-hh)*60);return hh+"h"+(mm?String(mm).padStart(2,"0"):"")}
function mqCards(st){const FI=typeof feedIds==="function"?feedIds():{mq:new Set()};mqActive().filter(q=>!FI.mq.has(q[0])).forEach(q=>{const d=document.createElement("div");d.className="sq mq";d.innerHTML=`<span class="sqk"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg><span>avant ${mqUntil(q[2][1])}</span></span><span class="sqn"></span><span class="sqr"><span class="sqc">+${XPE(q[3])} XP</span><button class="btn primary" type="button">Fait</button></span>`;
  d.querySelector(".sqn").textContent=q[1];const go=d.querySelector(".primary");go.onclick=ev=>{const G=S.g,tk=dayKey(Date.now());if(!G.mq||typeof G.mq!=="object")G.mq={};if(!G.mq[tk])G.mq[tk]=[];G.mq[tk].push(q[0]);{const ks=Object.keys(G.mq).sort();while(ks.length>20)delete G.mq[ks.shift()]}complete({id:"mq-"+q[0],cat:q[4],name:q[1],xp:XPE(q[3])},go,ev);skyCheer()};st.prepend(d)})}
// ---- Écran de nuit apaisé
let nightAll="";
function renderNight(){const box=$("nightBox");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now()),h=dayH(),J=(G.jr||{})[tk]||{},calm=momentOf()==="nuit"&&(!!J.at||h>=24)&&nightAll!==tk;
  document.documentElement.classList.toggle("nightcalm",calm);box.classList.toggle("voff",!calm);if(!calm){box.innerHTML="";return}
  const H=ritH()[tk]||{},T=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritDue(t)),dn=T.filter(t=>H[t.id]).length,xp=S.log.filter(e=>dayKey(e.t)===tk).reduce((a,e)=>a+Math.max(0,e.xp||0),0),md=G.mood[tk];
  const tom=evList().filter(e=>e.inD===1),mt=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)==="matin").length,f=moonPhase(Date.now());
  box.innerHTML=`<div class="ngt"><h2>Bonne nuit${S.name?", "+esc(S.name):""}</h2><p class="ngm">${moonName(f)} ce soir</p>
    <div class="ngs"><div><b>${dn}/${T.length}</b><small>rituels</small></div><div><b>${xp}</b><small>XP du jour</small></div><div><b>${md?moodFace(md,24):"-"}</b><small>humeur</small></div></div>
    ${J.t?`<blockquote class="ngq"></blockquote>`:""}
    <h3>Demain</h3><ul class="ngd"><li>Réveil vers ${wakeH()} h · ${mt} rituel${mt>1?"s":""} du matin</li>${tom.map(e=>`<li></li>`).join("")}</ul>
    <button type="button" class="lnk ngall">Voir le reste quand même</button></div>`;
  {const q=box.querySelector(".ngq");if(q)q.textContent="« "+J.t+" »"}box.querySelectorAll(".ngd li").forEach((li,i)=>{if(i>0)li.textContent=tom[i-1].n})
  box.querySelector(".ngall").onclick=()=>{nightAll=tk;render()}}

function ambApply(el){if(!el)return;const ph=ambPhase();let a=el.querySelector(":scope>.amb");if(a&&a.dataset.ph===ph)return;if(a)a.remove();el.prepend(ambEl(ph));el.dataset.amb=ph}
// ---- Animation propre à chaque type de rituel
const RKA={dents:["rise","#ffffff",6],lit:["puff","#e8e0ff",6],douche:["fall","#7fd4ff",9],visage:["splash","#7fd4ff",8],barbe:["",0,0],fenetre:["wind","#dff4ff",5],eau:["rise","#7fd4ff",6],sport:["splash","#ffd94a",8],lire:["rise","#fff5d0",4],medit:["ring","#ff9ec0",2],note:["rise","#ffd94a",4],repas:["steam","#ffffff",5],ecran:["",0,0],vit:["splash","#ff7aa8",8],soleil:["splash","#ffd94a",10],lune:["twinkle","#ffffff",6]};
function rkAnim(el,k){if(!el||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const ic=el.querySelector(".rtic,.rtmic");el.classList.add("rka-"+k);setTimeout(()=>el.classList.remove("rka-"+k),950);
  const[p,c,n]=RKA[k]||["splash","#ffd94a",8];if(!n||!ic)return;const w=document.createElement("span");w.className="rkp rkp-"+p;let h="";
  for(let i=0;i<n;i++){const a=i/n*2*Math.PI;h+=`<i style="--c:${c};--x:${(i*29)%60-30}px;--dx:${Math.round(Math.cos(a)*38)}px;--dy:${Math.round(Math.sin(a)*38)}px;animation-delay:${(i%4)*70}ms"></i>`}
  w.innerHTML=h;ic.appendChild(w);setTimeout(()=>w.remove(),1200)}
// ---- Dernière tuile du moment
function momentDone(per){skyCheer(1);if(per==="soir"){setTimeout(()=>closeOpen(1),950);return}if(document.querySelector(".mdone"))return;
  const n=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)===per&&ritDue(t)).length,sk=ritStreak();
  const o=document.createElement("div");o.className="bpop mdone";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Matin bouclé");
  o.innerHTML=`<div class="mdc"><div class="mdin"><div class="mdrays"></div><div class="mdchest">${pxImg("chest",6)}</div><div class="mdcoins">${Array.from({length:10},(_,i)=>`<i style="--a:${i*36}deg;animation-delay:${.6+i*.03}s">${pxImg("coin",2)}</i>`).join("")}</div><h3>Matin bouclé</h3><p>${n} rituel${n>1?"s":""} tenu${n>1?"s":""}${sk?` · essentiels ${sk} jour${sk>1?"s":""}`:""}. Belle façon de lancer la journée.</p><button type="button" class="btn primary">Continuer</button></div></div>`;
  o.querySelector(".mdc").prepend(ambEl(ambPhase()));document.body.appendChild(o);sfx("badge");setTimeout(()=>sfx("open",3),600);
  const close=()=>{o.classList.add("out");setTimeout(()=>o.remove(),200)};o.querySelector("button").onclick=close;o.onclick=e=>{if(e.target===o)close()}}
