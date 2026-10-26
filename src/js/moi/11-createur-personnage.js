// ---- auras animées en pixel art : tuiles générées une fois, utilisées en fond
(function auraTiles(){
  const SP={
    ember:[".y.","yoy",".o."],ember2:["y","o"],
    star:[".w.","wyw",".w."],dot:["w"],
    note:["...##.","...#.#","...#..","...#..",".###..","####..",".##..."],
    sparkle:["..w..","..w..","wwyww","..w..","..w.."],
    petal:[".pp","pPp","Pp."],petal2:["pp","Pp"],
    bubble:[".#######.","#wwwwwww#","#wdwdwdw#","#wwwwwww#",".##w####.","..#w#....","...#....."],
    grid:null};
  const COL={y:"#ffd75e",o:"#ff7a1a",w:"#fffbe6",p:"#ffc1dc",P:"#e2709f",d:"#2a1c0c"};
  const mk=(T,items,extra)=>{const c=document.createElement("canvas");c.width=c.height=T;const g=c.getContext("2d");
    items.forEach(([sp,x,y,pal])=>{const P={...COL,...(pal||{})};SP[sp].forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch!=="."&&P[ch]){g.fillStyle=P[ch];g.fillRect((x+i)%T,(y+j)%T,1,1)}}))});
    if(extra)extra(g,T);return"url("+c.toDataURL()+")"};
  const R=document.documentElement.style;
  R.setProperty("--aut-fl1",mk(40,[["ember",4,6],["ember2",17,14],["ember",28,2],["ember2",35,22],["ember",11,27],["ember2",23,33],["ember",33,36],["ember2",6,19]]));
  R.setProperty("--aut-fl2",mk(40,[["ember2",9,3,{y:"#ffb03a"}],["ember2",26,18,{y:"#ffb03a"}],["ember2",14,30,{y:"#ffb03a"}],["ember2",37,9,{y:"#ffb03a"}]]));
  R.setProperty("--aut-st1",mk(40,[["star",5,5],["dot",20,3],["star",29,15],["dot",12,22],["star",16,31],["dot",34,33],["dot",3,36]]));
  R.setProperty("--aut-st2",mk(40,[["dot",9,13,{w:"#ffd75e"}],["star",24,24,{w:"#ffd75e",y:"#fff"}],["dot",36,6,{w:"#ffd75e"}],["dot",2,28,{w:"#ffd75e"}]]));
  R.setProperty("--aut-no1",mk(48,[["note",6,4,{"#":"#e0a52a"}],["note",30,20,{"#":"#e0a52a"}],["note",14,36,{"#":"#e0a52a"}]].map(a=>[a[0],a[1],a[2],{"#":"#d79b1c"}])));
  R.setProperty("--aut-no2",mk(48,[["note",24,6],["note",40,34],["note",4,24]].map(a=>[a[0],a[1],a[2],{"#":"#fff3c4"}])));
  R.setProperty("--aut-ne1",mk(16,[],(g,T)=>{g.fillStyle="rgba(76,201,240,.55)";g.fillRect(0,0,T,1);g.fillRect(0,0,1,T)}));
  R.setProperty("--aut-ne2",mk(32,[["dot",8,8,{w:"#bff3ff"}],["dot",24,20,{w:"#bff3ff"}]]));
  R.setProperty("--aut-go1",mk(40,[["sparkle",4,4,{w:"#fff6c8",y:"#ffd75e"}],["sparkle",26,16,{w:"#fff6c8",y:"#ffd75e"}],["sparkle",12,28,{w:"#fff6c8",y:"#ffd75e"}]]));
  R.setProperty("--aut-go2",mk(40,[["dot",20,6,{w:"#ffd75e"}],["dot",36,26,{w:"#ffd75e"}],["dot",6,20,{w:"#fff6c8"}],["dot",30,36,{w:"#fff6c8"}]]));
  R.setProperty("--aut-lo1",mk(40,[["petal",3,5],["petal2",22,12],["petal",31,28],["petal2",12,33],["petal",17,20]]));
  R.setProperty("--aut-lo2",mk(40,[["petal2",9,2,{p:"#fff",P:"#ffc1dc"}],["petal2",29,8,{p:"#fff",P:"#ffc1dc"}],["petal2",5,25,{p:"#fff",P:"#ffc1dc"}]]));
  R.setProperty("--aut-he1",mk(60,[["bubble",4,6,{"#":"#2a8fd6"}],["bubble",34,30,{"#":"#e0447a"}]]));
  R.setProperty("--aut-he2",mk(60,[["bubble",30,4,{"#":"#36b679"}],["bubble",10,38,{"#":"#f0b62e"}]]));
})();

// ---- Créateur de personnage pixel art (30 × 35)
const AVW=30,AVH=35;
const AV_DEF={faceW:0,size:0,skin:1,hairC:3,eyeC:0,topC:3,accC:0,bgC:0,bgP:0,hair:0,beard:1,top:0,hat:0,glasses:0,bijou:0,mouth:0,eyes:0,mark:0,main:0};
function avHex(h){h=h.replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
function avMix(a,b,t){const A=avHex(a),B=avHex(b);return"#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("")}
// ---- fonds en scène (12+)
const BG_H=[13,18,11,20,15,9,17,12,19,14];
function bgScene(pat,x,y,bg){const W=30,H=35,t=y/H,hit=(cx,cy,r)=>Math.hypot(x-cx,y-cy)<=r,hs=(a,b,m)=>((x*a+y*b)%m+m)%m===0;
  if(pat===12){let c=avMix(avMix(bg,"#fff",.45),bg,Math.min(1,t*1.3));for(const[cx,cy,r]of[[5,6,3],[8.5,5,3.5],[12,6.5,2.5],[21,13,2.5],[24,11.5,3.2],[27,13,2.4],[2,25,2.6],[5.5,24,3],[26,27,2.2]])if(hit(cx,cy,r)){c=y>=cy+r*.35?"#dde8f4":"#ffffff";break}return c}
  if(pat===13){let c=avMix(avMix(bg,"#fff",.5),bg,Math.min(1,y/22));if(hit(23,6,2.2))c="#fff3c4";const h1=16+Math.abs(((x+3)%14)-7)*.95;if(y>=h1)c=y<h1+1.6&&h1<18.5?"#f4f6fb":avMix(bg,"#4a5a7a",.6);const h2=24+Math.abs(((x*1.3+5)%18)-9)*.6;if(y>=h2)c=avMix(bg,"#25324a",.78);return c}
  if(pat===14){let c=avMix("#14173a","#4a2f5a",Math.min(1,t*1.4));if(hit(24,5,2.6)&&!hit(25.3,4.2,2.2))c="#f4ecc8";else if(y<20&&hs(7,13,37))c="#f4f1e8";const i=Math.floor(x/3),top=H-BG_H[i%BG_H.length];if(y>=top){c="#0f1026";if(x%3===1&&(y-top)%3===1&&y<H-1)c=(x*7+y*3)%5<2?"#ffd36e":"#262a4a"}return c}
  if(pat===15){let c=avMix(avMix(bg,"#fff",.35),"#ffd9a8",Math.min(1,t*1.6));if(hit(23,15,3.5))c=hit(23,15,2.6)?"#fff0b0":"#ffcf6a";if(y>=19){c=y<20?"#5a9ad8":"#2f7fc4";if(hs(1,3,7))c="#6fb6ec"}const sd=27+Math.round(Math.sin(x*.5)*.8);if(y>=sd)c=hs(3,5,6)?"#e2c486":"#f2d9a0";return c}
  if(pat===16){let c=avMix(avMix(bg,"#fff",.4),bg,Math.min(1,t*1.2));const tree=(cx,top,col)=>{if(y>=top&&Math.abs(x-cx)<=(y-top)*.42+.3)c=col};[[2,13],[7,11],[12,14],[17,12],[22,13],[27,11]].forEach(([cx,tp])=>tree(cx,tp,avMix(bg,"#1e5a3a",.72)));[[0,18],[5,20],[25,19],[30,18]].forEach(([cx,tp])=>tree(cx,tp,"#183822"));if(y>=32)c="#24402a";return c}
  if(pat===17){const tx=x%5,ty=y%5,d=Math.min(tx,4-tx,ty,4-ty);let c=avMix(avMix(bg,"#2b2433",.5),"#000",(2-d)*.11);if(d===0)c=avMix(bg,"#141018",.8);if(y===0)c=avMix(bg,"#fff",.35);else if(y===1)c=avMix(bg,"#2b2433",.4);return c}
  if(pat===18){let c=avMix("#081026","#16304f",Math.min(1,t*1.2));if(hs(7,13,31))c="#e8f0ff";const yc=9+Math.sin(x*.45)*2.5+Math.sin(x*.17)*1.5,d=y-yc;if(d>=-1&&d<=4)c=avMix(d<1?"#b8ffd8":d<2.5?"#3fd99a":"#2a8a8a","#9a5ce0",Math.max(0,(x-14)/30));if(y>=29+Math.sin(x*.3)*1.5)c="#0a1424";return c}
  if(pat===19){let c=avMix("#1a0a3a","#ff4fa0",Math.min(1,y/22));if(hit(22,9,5.5)&&!(y>9&&y%3===0))c=avMix("#ffe14a","#ff5aa0",Math.max(0,Math.min(1,(y-4)/10)));if(y>=22){c="#1a0636";const k=y-22,v=Math.abs((x-14.5)*(10/(k+3)))%4;if([0,2,5,9].includes(k)||v<.7)c="#ff3fd0"}return c}
  if(pat===20){let c=avMix(avMix(bg,"#1a1428",.5),avMix(bg,"#1a1428",.75),t);[[4,5,3],[24,4,2.2],[27,15,3.4],[3,18,2],[6,29,3],[25,28,2.4],[13,2,1.6],[18,31,2]].forEach(([cx,cy,r],k)=>{const dd=Math.hypot(x-cx,y-cy);if(dd<=r)c=avMix(bg,"#fff",dd>r-1?.6:.3+(k%3)*.08)});return c}
  if(pat===21){let c=avMix("#0e1a3a","#2a3f70",Math.min(1,t*1.3));if(hs(13,7,29))c="#ffffff";else if(hs(5,11,41))c="#b8c8ee";const g=29+Math.sin(x*.6)*1.1;if(y>g)c=y>g+1?"#e8eef8":"#ffffff";if(y>=11&&y<=29&&Math.abs(x-3.5)<=(y-11)*.24+.4)c=(x+y)%5===0?"#2a8a4a":"#1f6a3a";if(y>=29&&y<=31&&x>=3&&x<=4)c="#5a3a1a";return c}
  if(pat===22){let c=avMix("#0b0d24","#241c50",Math.min(1,t*1.2));if(hs(7,13,37))c="#d8d8ff";const i=Math.floor(x/3),top=H-Math.round(BG_H[(i+3)%BG_H.length]*.45);if(y>=top){c="#0a0a18";if(x%3===1&&(y-top)%2===1)c=(x+y)%3?"#ffd36e":"#1c1c34"}return c}
  return null}
function bgOver(pat,set,bg){
  if(pat===21){const L=["#ff4a4a","#4aff7a","#ffd75e","#4ab8ff"];for(let x=0;x<30;x++){const gy=1+Math.round(1.6-1.6*Math.cos(x*Math.PI/7.5));set(x,gy,"#2a2a2a");if(x%3===1){set(x,gy+1,L[(x/3|0)%4])}}
    [[3,10],[2,11],[4,11],[3,11],[3,12]].forEach(([x,y],k)=>set(x,y,k===3?"#fff7c0":"#ffd75e"));[[2,16,"#ff4a4a"],[5,19,"#ffd75e"],[1,22,"#4ab8ff"],[4,25,"#ff4a4a"],[6,27,"#ffd75e"]].forEach(([x,y,c])=>set(x,y,c));
    [[23,27,4,"#c0283a","#ffd75e"],[27,28,3,"#2f8a4f","#f4f1e8"]].forEach(([x0,y0,w,c1,c2])=>{for(let y=y0;y<y0+w;y++)for(let x=x0;x<x0+w;x++)set(x,y,(x===x0+(w>>1)||y===y0+1)?c2:c1)})}
  if(pat===22){[[6,7,"#ff5a7a"],[23,6,"#ffd75e"],[25,18,"#5ad8ff"],[4,19,"#9aff7a"]].forEach(([cx,cy,c])=>{set(cx,cy,"#ffffff");for(let k=0;k<8;k++){const a=k*Math.PI/4;for(let r=1;r<=4;r++){if(r===3&&k%2)continue;set(Math.round(cx+Math.cos(a)*r),Math.round(cy+Math.sin(a)*r),r===4?avMix(c,"#fff",.4):c)}}})}
}

function avDrawOld(cfg){
  const c={...AV_DEF,...(cfg||{})};const px=new Array(AVW*AVH).fill(null);
  const pick=(k)=>{const L=AV_OPT[k];return L[c[k]]!==undefined?L[c[k]]:L[0]};
  const TG=new Array(AVW*AVH).fill(0);let curT=0;const set=(x,y,col)=>{if(x>=0&&y>=0&&x<AVW&&y<AVH&&col){px[y*AVW+x]=col;TG[y*AVW+x]=curT}};
  const get=(x,y)=>x>=0&&y>=0&&x<AVW&&y<AVH?px[y*AVW+x]:null;
  const P=(arr,col)=>arr.forEach(([x,y])=>set(x,y,col));
  const mask=sp=>{const m=new Set();sp.forEach(([y,a,b])=>{for(let x=a;x<=b;x++)m.add(y*100+x)});return m};
  const has=(m,x,y)=>m.has(y*100+x);
  const OL=f=>avMix(f,"#120a06",.62);
  const layer=(m,fill,opt={})=>{const ol=opt.ol||OL(fill),sh=opt.sh||avMix(fill,"#000",.22),li=opt.li||avMix(fill,"#fff",.28);
    m.forEach(k=>{const y=Math.floor(k/100),x=k%100;
      const edge=!has(m,x-1,y)||!has(m,x+1,y)||!has(m,x,y-1)||!has(m,x,y+1);
      if(edge&&!(opt.noOl&&opt.noOl(x,y)))set(x,y,ol);
      else if(opt.shade&&opt.shade(x,y))set(x,y,sh);
      else if(opt.light&&opt.light(x,y))set(x,y,li);
      else set(x,y,fill)})};
  const rows=(y0,y1,f)=>{const a=[];for(let y=y0;y<=y1;y++){const r=f(y);if(!r)continue;if(Array.isArray(r[0]))r.forEach(q=>a.push([y,q[0],q[1]]));else a.push([y,r[0],r[1]])}return a};
  const M=(y0,y1,f)=>mask(rows(y0,y1,f));
  const skin=pick("skin"),hc=pick("hairC"),tc=pick("topC"),ac=pick("accC"),bg=pick("bgC"),ec=pick("eyeC");
  const skOl=avMix(skin[1],"#1a0d06",.6),dk="#1a1210";
  // ---- fond
  const pat=c.bgP|0,bl=avMix(bg,"#fff",.16),bd=avMix(bg,"#000",.1);
  if(!c.nobg)for(let y=0;y<AVH;y++)for(let x=0;x<AVW;x++){let col=bg;
    if(pat===0){if(Math.hypot(x-14.5,y-13)<12)col=bl}
    else if(pat===1){if(Math.floor(x/3)%2===0)col=bl}
    else if(pat===2){if(x%6===2&&y%6===2||x%6===5&&y%6===5)col=bl}
    else if(pat===3){if((Math.floor(x/5)+Math.floor(y/5))%2===0)col=bl}
    else if(pat===5){const t=y/AVH;col=t<.45?bl:t<.55?((x+y)%2?bl:bg):t<.8?bg:t<.86?((x+y)%2?bg:bd):bd}
    else if(pat===6){const base=avMix(bg,"#2a0a04",.8),h=14+((x*5)%7)+(x%3===0?5:0)+(x%4===1?-3:0),d=AVH-y;col=d<h-4?"#ff7a1a":d<h-1?"#ffb02e":d<h?"#ffe27a":base;if(d<h-7)col="#d1381a"}
    else if(pat===7){col=y<AVH*.6?"#141a3a":"#1e2650";if((x*7+y*13)%37===0)col="#f4f1e8";if((x*11+y*5)%53===0)col="#9fb0ff"}
    else if(pat===8){const t=y/AVH;col=t<.25?"#ffb347":t<.45?"#ff7a5a":t<.65?"#e0507a":t<.8?"#9a4a9a":"#4a3a7a";if(t>.2&&t<.3&&(x+y)%2)col="#ff9a50";if(t>.6&&t<.68&&(x+y)%2)col="#c04a8a"}
    else if(pat===9){col="#0c1a10";const h=(x*7)%11;if(x%2===0&&(y+h)%6<3)col=(y+h)%6===0?"#a8ffb8":"#2fb35a"}
    else if(pat===11){const t=y/AVH;col=t<.45?"#1d2a4a":t<.7?"#2c3d66":"#3a4f80";const g=AVH*.8+Math.sin(x*.6)*1.2;if(y>g)col=y>g+1?"#e8eef8":"#ffffff";else if((x*13+y*7)%29===0)col="#ffffff";else if((x*5+y*11)%41===0)col="#b8c8ee"}
    else if(pat>=12){const r=bgScene(pat,x,y,bg);if(r)col=r}
    else if(pat===10){col=avMix(bg,"#fff",.35);const r=Math.hypot(x-14.5,y-34);const R=["#e8402a","#f08a2a","#f2c94c","#4cb85a","#3a8ad6","#7a5ad0"];const k=Math.floor((r-15)/2);if(k>=0&&k<6)col=R[k]}
    set(x,y,col)}
  if(pat===7){[[3,4],[25,3],[6,10],[26,12],[2,16]].forEach(([x,y])=>{set(x,y,"#fff");set(x-1,y,"#8a9adf");set(x+1,y,"#8a9adf");set(x,y-1,"#8a9adf");set(x,y+1,"#8a9adf")});for(let y=2;y<=7;y++)for(let x=21;x<=27;x++){const d=Math.hypot(x-24,y-4.5),d2=Math.hypot(x-25.5,y-3.5);if(d<3.2&&d2>2.4)set(x,y,"#f4e8b0")}}
  if(pat===8){for(let y=3;y<=12;y++)for(let x=19;x<=29;x++){const d=Math.hypot(x-24,y-7.5);if(d<4.2)set(x,y,d<3?"#fff3b0":"#ffd36e")}}
  if(pat===4)[[3,3],[24,5],[6,9],[27,13],[2,18],[25,22],[4,28],[27,30],[13,1],[19,2]].forEach(([x,y])=>{const w=avMix(bg,"#fff",.6);set(x,y,w);set(x-1,y,bl);set(x+1,y,bl);set(x,y-1,bl);set(x,y+1,bl)});
  else if(pat===0)[[3,4],[26,6],[2,19],[27,15],[4,28],[25,27]].forEach(([x,y])=>set(x,y,avMix(bg,"#fff",.55)));
  if(pat>=21&&!c.nobg)bgOver(pat,set,bg);if(c.bgonly)return px;
  const BGP=px.slice();
  // ---- cheveux arrière
  curT=1;let H=c.hair|0;const hatT=c.hat|0,HAT_FULL=[1,2,6,7,8,9,10,11,12,13,17,18,19,20],HAT_LIGHT=[3,4,15,21];if(hatT){if(H===7)H=1;if(H===13)H=0;if(HAT_FULL.includes(hatT)){if(H===16||H===18)H=0;if(H===19)H=1}if(H===4&&HAT_FULL.includes(hatT))H=8}const noBun=hatT&&!HAT_LIGHT.includes(hatT);
  const back={3:M(9,27,y=>y<12?[6,23]:[5,24]),15:M(9,27,y=>y<12?[6,23]:[5,24]),
    5:M(8,28,y=>y<11?[6,23]:y<26?[5,24]:[[5,9],[20,24]]),
    4:M(5,19,y=>y<7?[4,25]:y<16?[3,26]:y<18?[4,25]:[6,23]),
    11:M(2,25,y=>y<4?[18,21]:y<6?[19,23]:y<9?[21,25]:y<15?[23,26]:y<22?[24,27]:[24,26]),
    14:M(10,22,y=>y<14?[[6,8],[21,23]]:y<21?[6,23]:[[6,8],[10,11],[18,19],[21,23]]),
    20:M(9,19,y=>[6,23]),
    21:M(8,23,y=>y<21?[5,24]:y===21?[[5,9],[20,24]]:[[5,7],[22,24]]),
    22:M(8,19,y=>y<18?[5,24]:[[5,8],[21,24]]),
    23:M(8,23,y=>y<14?[6,23]:y<19?[5,24]:y<22?[[5,9],[20,24]]:[[6,8],[21,23]]),
    24:M(9,31,y=>y<12?[6,23]:y<29?[4,25]:[[4,9],[20,25]]),
    25:M(9,26,y=>y<11?[[5,7],[22,24]]:y<25?[[3,6],[23,26]]:[[4,5],[24,25]]),
    26:M(9,28,y=>y<12?[6,23]:[5,24])}[H];
  if(back){layer(back,H===11?avMix(hc,"#000",.3):hc,{shade:(x,y)=>x>20||y>20});
    if(H===5){const d1=avMix(hc,"#000",.32),l1=avMix(hc,"#fff",.18);for(let y=8;y<=28;y++)for(let x=5;x<=24;x++){const p=get(x,y);if(p!==hc&&p!==avMix(hc,"#000",.22))continue;if(x%3===0)set(x,y,d1);else if(x%3===1&&(y+x)%4===0)set(x,y,l1)}}
    if(H===4){const l1=avMix(hc,"#fff",.22),d1=avMix(hc,"#000",.25);for(let y=5;y<=19;y++)for(let x=3;x<=26;x++){const p=get(x,y);if(p!==hc&&p!==avMix(hc,"#000",.22))continue;if((x*5+y*3)%7===0)set(x,y,l1);else if((x*3+y*5)%11===0)set(x,y,d1)}}
    if(H===21||H===24){const d1=avMix(hc,"#000",.3),l1=avMix(hc,"#fff",.2);for(let y=9;y<=31;y++)for(let x=3;x<=26;x++){const p=get(x,y);if(p!==hc&&p!==avMix(hc,"#000",.22))continue;const w=(y+Math.round(Math.sin(x*.9)*1.5))%4;if(w===0)set(x,y,d1);else if(w===2&&x%2)set(x,y,l1)}}
    if(H===22){const d1=avMix(hc,"#000",.35),l1=avMix(hc,"#fff",.2);for(let y=8;y<=19;y++)for(let x=5;x<=24;x++){const p=get(x,y);if(p!==hc&&p!==avMix(hc,"#000",.22))continue;if(x%2===0)set(x,y,(y+x/2)%2?d1:l1)}}
    if(H===23){const d1=avMix(hc,"#000",.3);[[6,14],[7,17],[23,14],[22,17],[6,20],[23,20]].forEach(([x,y])=>{set(x,y,d1);set(x,y+1,d1)})}
    if(H===25){P([[4,10],[5,10],[6,10],[23,10],[24,10],[25,10]],ac);P([[3,11],[26,11]],avMix(ac,"#000",.3));const d1=avMix(hc,"#000",.3);for(let y=12;y<=24;y+=2){set(4,y,d1);set(25,y,d1)}}
    if(H===26&&!noBun){layer(M(2,5,y=>y===2?[13,16]:[12,17]),hc,{light:(x,y)=>x<=13,shade:(x,y)=>x>=16});P([[12,5],[13,5],[14,5],[15,5],[16,5],[17,5]].filter(()=>false),ac);P([[11,4],[18,4]],ac)}
    if(H===11){P([[21,4],[22,4],[22,5],[21,5]],ac);const d1=avMix(hc,"#000",.48);for(let y=9;y<=24;y+=3)set(25,y,d1)}}
  if(H===10){const br=avMix(hc,"#000",.3);for(let y=10;y<=27;y++)[[6,7],[22,23]].forEach(([a,b])=>{set(a,y,(y%2)?hc:br);set(b,y,(y%2)?br:hc)});P([[6,28],[7,28],[22,28],[23,28]],ac);P([[5,10],[5,27],[8,27],[21,27],[24,10],[24,27]].filter(()=>false),hc)}
  curT=0;
  // ---- cape royale (derrière)
  if((c.top|0)===10){layer(M(19,34,y=>y<22?[7,22]:y<24?[3,26]:[1,28]),"#b3202e",{shade:(x,y)=>x>=25||y>=32,light:(x,y)=>x<=3})}
  // ---- cou + buste
  layer(M(17,23,y=>[12,17]),skin[0],{ol:skOl,shade:(x,y)=>y<=19||x>=16});
  const torsoRows=y=>y===22?[9,20]:y===23?[6,23]:y===24?[4,25]:[3,26];
  const torso=M(22,34,torsoRows);
  const T=c.top,tOl=OL(tc),tSh=avMix(tc,"#000",.22),tLi=avMix(tc,"#fff",.3);
  const roundNeck=()=>{P([[12,22],[13,22],[14,22],[15,22],[16,22],[17,22],[13,23],[14,23],[15,23],[16,23]],skin[0]);P([[11,22],[18,22],[12,23],[17,23],[13,24],[14,24],[15,24],[16,24]],tOl)};
  if(T===2){ // débardeur à bretelles
    layer(torso,skin[0],{ol:skOl,shade:(x,y)=>x>=23,light:(x,y)=>x<=5&&y>=25});
    const tank=M(23,34,y=>y===23?[[9,10],[19,20]]:y===24?[[8,10],[19,21]]:y===25?[[8,11],[18,21]]:y===26?[[8,12],[17,21]]:[7,22]);
    layer(tank,tc,{shade:(x,y)=>x>=19&&y>=27,light:(x,y)=>x<=9&&y>=27});
  }else{
    layer(torso,tc,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=6&&y>=25});
    if(T===0||T===4)roundNeck();
    if(T===4){for(let y=25;y<=34;y++){set(8,y,avMix(tc,"#fff",.55));set(21,y,avMix(tc,"#fff",.55))}
      const n=["111","..1","111","1..","111"],m=["111","1.1","111","1.1","111"],w=c.topC===1?"#2c2c34":"#fff";
      n.forEach((r,i)=>[...r].forEach((ch,j)=>{if(ch==="1")set(11+j,27+i,w)}));m.forEach((r,i)=>[...r].forEach((ch,j)=>{if(ch==="1")set(15+j,27+i,w)}))}
    if(T===1){ // hoodie : capuche en col + cordons + poche
      const hood=M(19,24,y=>y===19?[[10,11],[18,19]]:y===20?[[9,12],[17,20]]:y===21?[[8,12],[17,21]]:y===22?[[7,12],[17,22]]:y===23?[6,23]:[[6,12],[17,23]]);
      layer(hood,avMix(tc,"#000",.38),{shade:(x,y)=>(x===12||x===17)&&y<=22,light:(x,y)=>x<=8,noOl:(x,y)=>y>=24&&x>6&&x<23});
      P([[13,23],[14,23],[15,23],[16,23],[14,24],[15,24]],skin[0]);P([[13,24],[16,24],[14,25],[15,25]],tOl);
      const str=c.topC===1?"#8a8f99":"#f2f0ea";for(let y=25;y<=28;y++){set(13,y,str);set(16,y,str)}P([[13,29],[16,29]],avMix(str,"#000",.35));
      for(let x=9;x<=20;x++)set(x,30,tOl);for(let y=31;y<=34;y++){set(9,y,tOl);set(20,y,tOl)}for(let y=31;y<=33;y++)for(let x=10;x<=19;x++)set(x,y,tSh)}
    if(T===3){ // veste ouverte
      const inner=c.topC===1||c.topC===5?"#2c2c34":"#f2f0ea";
      layer(M(22,34,y=>y<24?[12,17]:[11,18]),inner,{});
      P([[12,22],[13,22],[14,22],[15,22],[16,22],[17,22],[13,23],[14,23],[15,23],[16,23]],skin[0]);P([[13,24],[14,24],[15,24],[16,24]],OL(inner));
      P([[10,23],[11,24],[11,25],[12,26],[12,27],[19,23],[18,24],[18,25],[17,26],[17,27]],tLi);
      P([[11,22],[10,22],[18,22],[19,22]],tOl);
      for(let y=28;y<=34;y++){set(11,y,tOl);set(18,y,tOl)}P([[9,30],[20,30]],tSh)}
    if(T===5){ // chemise
      P([[13,22],[14,22],[15,22],[16,22],[14,23],[15,23]],skin[0]);
      const col=avMix(tc,"#fff",.45);P([[11,22],[12,22],[12,23],[13,23],[13,24],[18,22],[17,22],[17,23],[16,23],[16,24]],col);P([[14,24],[15,24]],tOl);
      for(let y=25;y<=34;y++)set(14,y,tSh);[26,29,32].forEach(y=>set(15,y,avMix(tc,"#fff",.7)));P([[6,26],[7,27],[22,27],[23,26]].filter(()=>false),tSh);
}
    if(T===6){ // col roulé
      layer(M(18,23,y=>y<20?[12,17]:[11,18]),avMix(tc,"#fff",.06),{light:(x,y)=>x<=12});
      for(let x=12;x<=17;x++){set(x,20,tSh);set(x,22,tSh)}}
    if(T===7){ // survêt zippé
      layer(M(20,23,y=>y<22?[[10,13],[16,19]]:[9,20]),tc,{});
      P([[13,22],[14,22],[15,22],[16,22],[14,23],[15,23]],skin[0]);
      for(let y=23;y<=34;y++){set(14,y,"#c9ccd2");set(15,y,tOl)}set(14,25,"#fff");
      const st=c.topC===1?"#2c2c34":"#f2f0ea";for(let y=24;y<=34;y++){set(4+(y<25?1:0),y,st);set(25-(y<25?1:0),y,st)}for(let y=25;y<=34;y++){set(5,y,st);set(24,y,st)}}
    const openV=(inner)=>{layer(M(22,34,y=>y<24?[12,17]:[11,18]),inner,{});P([[12,22],[13,22],[14,22],[15,22],[16,22],[17,22],[13,23],[14,23],[15,23],[16,23]],skin[0]);P([[13,24],[14,24],[15,24],[16,24]],OL(inner))};
    if(T===8){const lc="#3b2b24";layer(torso,lc,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=6&&y>=25});openV(tc);
      P([[10,23],[11,24],[11,25],[12,26],[12,27],[19,23],[18,24],[18,25],[17,26],[17,27]],avMix(lc,"#fff",.25));for(let y=28;y<=34;y++){set(11,y,OL(lc));set(18,y,OL(lc))}P([[6,26],[23,26],[7,30],[22,30]],"#c9ccd2")}
    if(T===9){const st="#9aa4b0",sd=avMix(st,"#000",.25);layer(torso,st,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=7&&y>=25});
      for(let x=4;x<=25;x++){set(x,29,sd)}for(let y=24;y<=34;y++)set(14,y,avMix(st,"#fff",.35));
      layer(M(22,26,y=>y===22?[[5,9],[20,24]]:[[3,9],[20,26]]),avMix(st,"#fff",.15),{shade:(x,y)=>y>=26});
      P([[12,22],[13,22],[14,22],[15,22],[16,22],[17,22]],sd);
      for(let y=25;y<=31;y++){set(14,y,tc);set(15,y,tc)}for(let x=12;x<=17;x++)set(x,27,tc)}
    if(T===10){roundNeck();layer(M(21,24,y=>y===21?[[6,11],[18,23]]:y<24?[[4,12],[17,25]]:[[3,10],[19,26]]),"#f4f1e8",{});
      [[6,22],[9,23],[5,24],[20,22],[23,23],[24,24],[11,22],[18,22]].forEach(([x,y])=>set(x,y,"#1e1a18"));P([[14,23],[15,23],[14,24],[15,24]],"#f2c94c");for(let x=4;x<=25;x++)set(x,34,"#f2c94c")}
    if(T===11){const cl="#f4f1e8";for(let i=0;i<9;i++){set(11+i,22+i,cl);set(12+i,22+i,cl);set(18-i,22+i,avMix(cl,"#000",.12));}P([[13,22],[14,22],[15,22],[16,22],[14,23],[15,23]],skin[0]);
      for(let x=3;x<=26;x++){set(x,30,"#2c2c34");set(x,31,"#2c2c34")}for(let x=3;x<=26;x++)set(x,32,avMix(tc,"#000",.2))}
    if(T===12){const nv="#26324a";layer(torso,nv,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=6&&y>=25});layer(M(22,31,y=>{const w=Math.max(0,4-Math.floor((y-22)/2.4));return[14-w,15+w]}),"#f4f1e8",{});
      P([[13,22],[14,22],[15,22],[16,22]],skin[0]);for(let y=23;y<=30;y++){set(14,y,"#c0283a");set(15,y,y<25?"#c0283a":avMix("#c0283a","#000",.25))}
      P([[11,23],[11,24],[12,25],[12,26],[18,23],[18,24],[17,25],[17,26]],avMix(nv,"#fff",.25))}
    if(T===13){const pu="#4b2a8a";layer(torso,pu,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=6&&y>=25});roundNeck();
      for(let y=24;y<=34;y++){set(14,y,"#f2c94c");set(15,y,"#d9a72a")}[[6,27],[22,26],[9,32],[20,31],[5,33]].forEach(([x,y])=>set(x,y,"#f2c94c"));for(let x=3;x<=26;x++)set(x,34,"#f2c94c")}
    if(T===14){const wb="#f4f1e8";layer(torso,wb,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=6});
      for(let i=0;i<8;i++){set(11+i,22+i,avMix(wb,"#000",.15));set(18-i,22+i,avMix(wb,"#000",.15))}layer(M(22,27,y=>{const w=Math.max(0,3-(y-22));return[14-w,15+w]}),skin[0],{ol:skOl});
      for(let x=3;x<=26;x++)set(x,30,"#8ab4e0");P([[12,31],[13,32],[17,31],[16,32]],"#8ab4e0")}
    if(T===15){roundNeck();for(let y=25;y<=34;y+=2)for(let x=3;x<=26;x++)set(x,y,"#2f4f9a")}
    if(T===17){const rd="#b3202e",gn="#2f7a46",wt="#f4f1e8";layer(torso,rd,{shade:(x,y)=>x>=22||y>=32,light:(x,y)=>x<=6&&y>=25});roundNeck();
      for(let x=3;x<=26;x++){set(x,26,wt);set(x,x%2?27:28,wt);set(x,29,gn);set(x,30,gn)}
      [[8,32],[14,32],[20,32]].forEach(([x,y])=>{set(x,y,wt);set(x-1,y,wt);set(x+1,y,wt);set(x,y-1,wt);set(x,y+1,wt)})}
    if(T===16){const fl=["#f08cc0","#f2c94c","#36b679"];for(let y=24;y<=34;y++)for(let x=3;x<=26;x++)if(get(x,y)===tc&&(x*3+y*5)%7===0)set(x,y,fl[(x+y)%3]);P([[12,22],[13,22],[14,22],[15,22],[16,22],[17,22],[13,23],[14,23],[15,23],[16,23],[14,24],[15,24]],skin[0]);P([[11,22],[11,23],[12,24],[18,22],[18,23],[17,24]],avMix(tc,"#fff",.5))}
  }
  // chaîne / perles
  if(c.bijou===2||c.bijou===3){P([[11,23],[12,24],[13,25],[14,26],[15,26],[16,25],[17,24],[18,23]],"#f2c94c");set(14,27,"#f2c94c");set(15,27,"#d9a72a")}
  if(c.bijou===5)P([[11,23],[13,25],[15,26],[17,24],[12,24],[14,26],[16,25],[18,23]].filter((_,i)=>i%1===0),"#f6f2ea");
  if(c.bijou===5)P([[12,24],[14,26],[16,25]],"#d9d2c4");
  if(c.bijou===8){const r="#c0283a",w="#f4f1e8";for(let y=21;y<=23;y++)for(let x=10;x<=19;x++)set(x,y,(x+y)%4<2?r:w);for(let y=24;y<=29;y++){set(17,y,y%2?r:w);set(18,y,y%2?w:r)}P([[17,30],[18,30]],w)}
  if(c.bijou===7){P([[11,23],[12,24],[13,25],[16,25],[17,24],[18,23]],"#f2c94c");layer(M(25,28,y=>y===25||y===28?[14,15]:[13,16]),"#f2c94c",{});P([[14,26],[15,26],[14,27],[15,27]],"#d63b3b")}
  // ---- tête
  const headM=M(5,19,y=>y===5?[11,18]:y===6?[9,20]:y<=16?[8,21]:y===17?[9,20]:y===18?[10,19]:[12,17]);
  layer(headM,skin[0],{ol:skOl,shade:(x,y)=>x>=19,light:(x,y)=>x<=10&&y>=8&&y<=13});
  P([[7,11],[7,12],[7,13],[22,11],[22,12],[22,13]],skOl);P([[8,12],[21,12]],skin[1]);
  const blush=avMix(skin[0],"#e8625a",.35);set(10,15,blush);set(19,15,blush);
  // ---- sourcils + yeux
  const brc=H===9?avMix(skin[1],"#000",.4):avMix(hc,"#000",.35),E=c.eyes|0;
  const by=E===4?9:10;
  if(E===2){P([[10,10],[11,10],[12,11],[17,11],[18,10],[19,10]],brc)}else P([[10,by],[11,by],[12,by],[17,by],[18,by],[19,by]],brc);
  const eyeN=(x,y)=>{set(x,y,dk);set(x+1,y,"#fff");set(x,y+1,ec);set(x+1,y+1,dk)};
  if(E===1){P([[11,13],[12,12],[13,13],[16,13],[17,12],[18,13]],dk)}
  else if(E===3){eyeN(11,12);P([[17,13],[18,13],[16,12]],dk)}
  else if(E===4){[[11,11],[17,11]].forEach(([x,y])=>{set(x,y,dk);set(x+1,y,dk);set(x,y+1,dk);set(x+1,y+1,"#fff");set(x,y+2,ec);set(x+1,y+2,ec)})}
  else{eyeN(11,12);eyeN(17,12)}
  // nez
  set(15,14,skin[1]);set(15,15,skin[1]);
  // bouche
  const mc=avMix(skin[1],"#5a1a1a",.55),Mo=c.mouth|0;
  const smile=()=>{P([[13,16],[16,16],[14,17],[15,17]],mc)};
  if(Mo===0)smile();
  else if(Mo===1)P([[13,17],[14,17],[15,17],[16,17]],mc);
  else if(Mo===2){P([[12,16],[13,16],[14,16],[15,16],[16,16],[17,16]],mc);P([[13,17],[14,17],[15,17],[16,17]],"#fff");P([[13,18],[14,18],[15,18],[16,18]],mc)}
  else if(Mo===3){P([[13,16],[14,16],[15,16],[16,16]],mc);P([[14,17],[15,17]],"#e8626a");set(15,18,avMix("#e8626a","#000",.25))}
  else if(Mo===4){P([[14,16],[15,16],[14,18],[15,18],[13,17],[16,17]],mc);P([[14,17],[15,17]],"#4a1414")}
  // barbe
  const bc=avMix(hc,"#000",.15),B=c.beard|0;
  if(B===1)P([[12,15],[13,15],[14,15],[15,15],[16,15],[17,15],[12,16],[17,16]],bc);
  if(B===2){P([[13,18],[14,18],[15,18],[16,18],[13,19],[14,19],[15,19],[16,19],[14,20],[15,20]],bc);P([[12,15],[13,15],[16,15],[17,15]],bc)}
  if(B===3||B===4){const full=B===4;
    for(let y=13;y<=19;y++)for(let x=8;x<=21;x++){if(!has(headM,x,y))continue;const side=x<=9||x>=20,low=y>=17;
      if((side&&y>=(full?13:14))||low||(full&&y>=16&&(x<=11||x>=18)))set(x,y,bc)}
    P([[12,15],[13,15],[14,15],[15,15],[16,15],[17,15]],bc);
    if(Mo===2){P([[13,16],[14,16],[15,16],[16,16]],mc);P([[13,17],[14,17],[15,17],[16,17]],"#fff")}else P([[14,17],[15,17]],mc);
    if(full){for(let x=12;x<=17;x++)set(x,20,bc);for(let x=13;x<=16;x++)set(x,21,avMix(bc,"#000",.2))}}
  if(B===5){const st=avMix(skin[0],hc,.45);for(let y=15;y<=19;y++)for(let x=9;x<=20;x++){if(!has(headM,x,y))continue;const p=get(x,y);if((p===skin[0]||p===skin[1])&&(x+y)%2===0&&!(y===16&&x>=13&&x<=16))set(x,y,st)}}
  // ---- marques
  const mk=c.mark|0;
  if(mk===1)P([[10,14],[11,15],[12,14],[17,14],[18,15],[19,14]],avMix(skin[1],"#7a3a1a",.35));
  if(mk===2){P([[18,13],[19,14],[20,15]],avMix(skin[0],"#7a1a1a",.55));P([[19,13],[18,15]],avMix(skin[0],"#7a1a1a",.3))}
  if(mk===3)set(18,16,avMix(skin[1],"#2a140a",.6));
  if(mk===4){P([[9,14],[10,14],[11,14],[9,15],[10,15],[11,15]],"#f0d2a8");P([[10,14],[10,15]],"#d8b080");P([[8,14],[12,14],[8,15],[12,15]],"#c99a6a")}
  if(mk===5)P([[10,14],[11,14],[12,14],[17,14],[18,14],[19,14]],"#d63b3b");
  // ---- cheveux avant
  const hl=(x,y)=>(x+y)%5===0&&y<7;
  const HM={
    0:M(3,11,y=>y===3?[11,18]:y===4?[9,20]:y<=8?[8,21]:[[8,9],[20,21]]),
    2:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[7,22]:y===8?[7,17]:y===9?[[7,14],[21,22]]:[[7,9],[21,22]]),
    3:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=8?[7,22]:[[7,9],[20,22]]),
    4:M(0,12,y=>y===0?[11,18]:y===1?[8,21]:y===2?[6,23]:y<=4?[5,24]:y<=8?[4,25]:[[4,8],[21,25]]),
    5:M(3,9,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[7,22]:[[7,9],[20,22]]),
    6:M(4,10,y=>y===4?[11,18]:y===5?[9,20]:y<=6?[8,21]:[[8,9],[20,21]]),
    8:M(1,12,y=>y===1?[[9,10],[13,16],[19,20]]:y===2?[8,21]:y===3?[7,22]:y===4?[6,23]:y===5?[7,22]:y===6?[6,23]:y===7?[7,22]:y===8?[6,23]:y===9?[[6,9],[20,23]]:y===10?[[7,9],[20,22]]:y===11?[[6,8],[21,23]]:[[7,8],[21,22]]),
    10:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=8?[7,22]:[[7,9],[20,22]]),
    11:M(3,8,y=>y===3?[10,19]:y===4?[8,21]:y<=6?[8,21]:[[8,9],[20,21]]),
    12:M(3,13,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[7,22]:y===8?[[7,9],[11,12],[14,15],[17,18],[20,22]]:[[7,8],[21,22]]),
    15:M(3,14,y=>y===3?[10,19]:y===4?[8,21]:y<=9?[7,22]:[[7,8],[21,22]]),
    13:M(3,6,y=>y===3?[11,18]:[9,20]),
    14:M(3,11,y=>y===3?[11,18]:y===4?[9,20]:y<=8?[8,21]:[[8,9],[20,21]]),
    16:M(1,9,y=>y<=4?[9,20]:y<=7?[8,21]:[[8,9],[20,21]]),
    17:M(3,10,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[8,21]:y===8?[[8,13],[20,21]]:[[8,9],[20,21]]),
    18:M(0,9,y=>y===0?[13,20]:y===1?[11,22]:y===2?[10,22]:y===3?[9,22]:y<=7?[8,21]:[[8,9],[20,21]]),
    20:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[7,22]:[[6,8],[21,23]]),
    21:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=6?[7,22]:y===7?[[7,12],[16,22]]:y===8?[[7,10],[18,22]]:[[6,8],[21,23]]),
    22:M(2,9,y=>y===2?[10,19]:y===3?[8,21]:y<=7?[7,22]:[[7,9],[20,22]]),
    23:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[7,22]:y===8?[[7,10],[12,13],[16,17],[19,22]]:y===9?[[7,9],[20,22]]:[[6,8],[21,23]]),
    24:M(3,12,y=>y===3?[10,19]:y===4?[8,21]:y===5?[7,22]:y===6?[[7,13],[16,22]]:y===7?[[7,11],[18,22]]:[[6,8],[21,23]]),
    25:M(3,9,y=>y===3?[10,19]:y===4?[8,21]:y<=7?[7,22]:y===8?[[7,9],[11,12],[14,15],[17,18],[20,22]]:[[7,8],[21,22]]),
    26:M(3,11,y=>y===3?[10,19]:y===4?[8,21]:y<=8?[7,22]:[[7,9],[20,22]])
  };
  const recolorTop=(y0,y1,col,skip)=>{for(let y=y0;y<=y1;y++)for(let x=8;x<=21;x++){if(skip&&skip(x,y))continue;const p=get(x,y);if(p===skin[0]||p===skin[1]||p===avMix(skin[0],"#fff",.28))set(x,y,col)}};
  if(H===19){const wv=avMix(hc,"#000",.1),wl=avMix(hc,"#fff",.3);layer(M(4,9,y=>y===4?[11,18]:y===5?[9,20]:y<=7?[8,21]:[[8,9],[20,21]]),wv,{noOl:(x,y)=>y>=8});for(let y=5;y<=8;y++)for(let x=9;x<=20;x++)if(get(x,y)===wv&&((x+(y%2)*2)%4===0))set(x,y,wl)}
  else if(H===1){const bz=avMix(hc,skin[0],.45),bzd=avMix(hc,skin[0],.2);layer(M(4,9,y=>y===4?[11,18]:y===5?[9,20]:y<=7?[8,21]:[[8,9],[20,21]]),bz,{ol:bzd,noOl:(x,y)=>y>=8});for(let y=5;y<=8;y++)for(let x=9;x<=20;x++)if((x+y*2)%4===0&&get(x,y)===bz)set(x,y,bzd)}
  else if(H===7){recolorTop(5,9,avMix(hc,skin[0],.72),(x)=>x>=13&&x<=16);layer(M(0,8,y=>y===0?[14,15]:y===1?[13,16]:[13,16]),hc,{light:(x,y)=>x===14&&y>0,shade:(x,y)=>x===16&&y>1})}
  else if(H===13){const f1=avMix(hc,skin[0],.45),f2=avMix(hc,skin[0],.72);for(let y=6;y<=11;y++)for(let x=8;x<=21;x++){if(x>9&&x<20&&y>6)continue;const p=get(x,y);if(p===skin[0]||p===skin[1]||p===avMix(skin[0],"#fff",.28)||p===avMix(skin[0],"#000",.22))set(x,y,y<=8?f1:((x+y)%2?f1:f2))}layer(HM[13],hc,{light:hl,shade:(x,y)=>y>=5||x>=19})}
  else if(HM[H]){
    layer(HM[H],hc,{light:hl,shade:(x,y)=>y>=8||x>=21});
    if(H===0||H===14)P([[10,8],[13,8],[16,8],[19,8]],OL(hc));
    if(H===8){const d1=avMix(hc,"#000",.3),l1=avMix(hc,"#fff",.25);for(let y=1;y<=12;y++)for(let x=6;x<=23;x++){if(get(x,y)!==hc)continue;const k=(x+(y%2?2:0))%4;if(k===0)set(x,y,d1);else if(k===1&&y%2===0)set(x,y,l1)}}
    if(H===4){for(let y=0;y<=12;y++)for(let x=4;x<=25;x++){if(get(x,y)!==hc)continue;if((x*5+y*3)%7===0)set(x,y,avMix(hc,"#fff",.22));else if((x*3+y*5)%11===0)set(x,y,avMix(hc,"#000",.25))}}
    if(H===5){const d1=avMix(hc,"#000",.32);for(let y=4;y<=9;y++)for(let x=7;x<=22;x++)if(x%3===0&&get(x,y)===hc)set(x,y,d1);}
    if(H===6){for(let x=10;x<=19;x+=3)set(x,5,avMix(hc,"#000",.28));if(!noBun){layer(M(0,4,y=>y===0?[13,16]:y===1?[12,17]:y<=3?[11,18]:[12,17]),hc,{light:(x,y)=>x<=13&&y<=2,shade:(x,y)=>x>=17});P([[12,4],[13,4],[14,4],[15,4],[16,4],[17,4]],ac)}}
    if(H===10)for(let x=9;x<=20;x+=3){set(x,5,OL(hc));set(x,6,OL(hc))}
    if(H===11){const d1=avMix(hc,"#000",.28);[[10,4],[12,4],[14,4],[16,4],[18,4],[11,5],[15,5],[19,5]].forEach(([x,y])=>set(x,y,d1))}
    if(H===15)for(let x=8;x<=21;x+=2)set(x,9,OL(hc));
    if(H===12){const d1=avMix(hc,"#000",.28);for(let x=9;x<=20;x+=3){set(x,6,d1);set(x,7,d1)}}
    if(H===16){const d1=avMix(hc,"#000",.25),l1=avMix(hc,"#fff",.25);for(let x=9;x<=20;x++){set(x,1,x%2?l1:hc);if(x%3===0){set(x,2,d1);set(x,3,d1)}}const f=avMix(hc,skin[0],.5);P([[8,8],[8,9],[21,8],[21,9]],f)}
    if(H===17){P([[12,3],[12,4],[12,5]],avMix(skin[0],hc,.35));const l1=avMix(hc,"#fff",.25);P([[13,5],[14,5],[15,5],[16,6],[17,6]],l1);P([[10,8],[12,8]],OL(hc))}
    if(H===18){const l1=avMix(hc,"#fff",.3),d1=avMix(hc,"#000",.28);P([[13,1],[14,1],[15,1],[12,2],[13,2]],l1);for(let x=11;x<=20;x+=3)set(x,4,d1);P([[9,8],[20,8]],d1)}
    if(H===20)for(let x=8;x<=21;x+=3)set(x,7,avMix(hc,"#000",.25));
    if(H===21){const l1=avMix(hc,"#fff",.3);P([[9,4],[10,5],[11,5],[17,4],[18,5]],l1)}
    if(H===22){const d1=avMix(hc,"#000",.35);for(let y=3;y<=8;y++)for(let x=7;x<=22;x++)if(get(x,y)===hc&&x%2===0)set(x,y,d1);P([[8,10],[21,10],[8,11],[21,11]],hc)}
    if(H===24){P([[14,4],[15,4],[14,5],[15,5]],avMix(skin[0],hc,.3));const l1=avMix(hc,"#fff",.22);P([[10,4],[11,5],[18,5],[19,4]],l1)}
    if(H===25){const d1=avMix(hc,"#000",.28);for(let x=9;x<=20;x+=3)set(x,7,d1)}
    if(H===26){const l1=avMix(hc,"#fff",.22);P([[10,4],[11,4],[18,4],[19,4]],l1)}
  }
  // ---- chapeaux
  const hat=c.hat|0,ash=avMix(ac,"#000",.3);
  if(hat===1){layer(M(2,8,y=>y===2?[11,18]:y===3?[9,20]:[8,21]),ac,{light:(x,y)=>x<=11&&y<=5,shade:(x,y)=>x>=19});
    layer(M(8,9,y=>y===8?[6,19]:[5,17]),ash,{});P([[14,3],[15,3]],avMix(ac,"#fff",.4))}
  if(hat===2){const b=avMix(ac,"#fff",.1);layer(M(2,8,y=>y===2?[11,18]:y===3?[9,20]:[8,21]),b,{shade:(x,y)=>x>=19,light:(x,y)=>x<=10});
    layer(M(7,9,y=>[7,22]),avMix(b,"#000",.2),{});for(let x=8;x<=21;x+=2)set(x,8,avMix(b,"#000",.35));layer(M(0,2,y=>y===1?[13,16]:[14,15]),"#f2f0ea",{})}
  if(hat===3){layer(M(6,8,y=>[7,22]),ac,{});P([[9,7],[13,7],[17,7],[20,7]],avMix(ac,"#fff",.8));layer(M(8,11,y=>y<10?[22,24]:[23,25]),ac,{})}
  if(hat===4){const hp="#2c2c34";layer(M(2,4,y=>y===2?[10,19]:y===3?[8,21]:[[7,8],[21,22]]),hp,{});
    layer(M(9,15,y=>[4,8]),hp,{light:(x,y)=>x===5});layer(M(9,15,y=>[21,25]),hp,{shade:(x,y)=>x===24});set(6,12,ac);set(23,12,ac)}
  if(hat===5){layer(M(1,4,y=>[10,19]),"#f2c94c",{light:(x,y)=>x<=11});P([[10,0],[12,0],[13,0],[16,0],[17,0],[19,0]],"#f2c94c");P([[14,3],[15,3]],"#d63b3b");P([[11,3],[18,3]],"#2f6fd6")}
  if(hat===6){layer(M(2,7,y=>y===2?[10,19]:[8,21]),ac,{light:(x,y)=>x<=10,shade:(x,y)=>x>=19});layer(M(7,9,y=>y===7?[6,23]:y===8?[5,24]:[5,24]),ash,{});for(let x=9;x<=20;x++)set(x,6,avMix(ac,"#fff",.5))}
  if(hat===7){layer(M(2,8,y=>y===2?[11,18]:y===3?[9,20]:[8,21]),ac,{light:(x,y)=>x<=11&&y<=5,shade:(x,y)=>x>=19});layer(M(0,2,y=>y===0?[12,17]:[11,18]),ash,{});P([[13,6],[14,6],[15,6],[16,6]],avMix(ac,"#fff",.5));set(14,7,OL(ac));set(15,7,OL(ac))}
  if(hat===8){layer(M(3,9,y=>y===3?[10,19]:y===4?[8,21]:[7,22]),ac,{light:(x,y)=>(x+y)%4===0&&y<7,shade:(x,y)=>y>=8});for(let x=8;x<=21;x++)set(x,8,ash);layer(M(9,18,y=>y<13?[22,23]:[23,24]),ac,{shade:(x,y)=>x===24})}
  if(hat===9){const w1="#3b2a8a";layer(M(0,7,y=>{const w=Math.min(6,Math.floor(y*0.9));return[14-w,15+w]}),w1,{light:(x,y)=>x<=12,shade:(x,y)=>x>=17});layer(M(7,8,y=>[5,24]),avMix(w1,"#000",.2),{});P([[13,3],[16,5],[11,6]],"#f2c94c");set(15,1,"#f2c94c")}
  if(hat===10){const st="#9aa4b0";layer(M(2,9,y=>y===2?[10,19]:y===3?[8,21]:[7,22]),st,{light:(x,y)=>x<=10,shade:(x,y)=>x>=20});layer(M(9,16,y=>[[6,8],[21,23]]),st,{shade:(x,y)=>x>=22});for(let y=9;y<=14;y++){set(14,y,avMix(st,"#000",.2));set(15,y,st)}
    layer(M(0,2,y=>[14,16]),"#d63b3b",{});for(let x=7;x<=22;x++)set(x,8,avMix(st,"#000",.3))}
  if(hat===11){const br="#9a7a4a",iv="#f2ead2";layer(M(3,8,y=>y===3?[10,19]:y===4?[8,21]:[7,22]),br,{light:(x,y)=>x<=10,shade:(x,y)=>x>=20});for(let x=7;x<=22;x++)set(x,8,avMix(br,"#000",.35));[9,12,17,20].forEach(x=>set(x,8,"#e8e2d0"));
    const hn=[[6,7],[5,7],[5,6],[4,6],[4,5],[3,5],[3,4],[3,3],[2,3],[2,2]];hn.forEach(([x,y],i)=>{set(x,y,i>7?avMix(iv,"#000",.15):iv);set(29-x,y,i>7?avMix(iv,"#000",.15):iv)});P([[6,6],[23,6]],iv)}
  if(hat===12){const cb="#8a5a2a";layer(M(0,6,y=>y===0?[[11,13],[16,18]]:[10,19]),cb,{light:(x,y)=>x<=11,shade:(x,y)=>x>=18});for(let x=10;x<=19;x++)set(x,5,"#3a2414");layer(M(6,8,y=>y===6?[4,25]:y===7?[[2,7],[22,27]]:[[2,3],[26,27]]),avMix(cb,"#000",.15),{})}
  if(hat===13){const wt="#f7f5ef";layer(M(0,7,y=>y<=4?[9,20]:[10,19]),wt,{shade:(x,y)=>x>=18||y===4,light:(x,y)=>x<=10&&y<4});for(let y=1;y<=4;y++){set(12,y,avMix(wt,"#000",.12));set(16,y,avMix(wt,"#000",.12))}layer(M(5,7,y=>[9,20]),avMix(wt,"#000",.06),{})}
  if(hat===14){const gd="#f2c94c";for(let x=11;x<=18;x++){set(x,0,gd);set(x,2,avMix(gd,"#000",.15))}P([[10,1],[19,1]],gd);for(let x=11;x<=18;x++)set(x,1,"#fff6c8")}
  if(hat===15){const nj="#2c2c34";for(let y=6;y<=8;y++)for(let x=7;x<=22;x++)set(x,y,nj);P([[23,8],[24,9],[24,10],[25,11],[23,9],[24,11],[25,12]],nj);layer(M(6,8,y=>[12,17]),"#b8c2cc",{});P([[14,7],[15,7]],"#1e1a18")}
  if(hat===16){const fl=["#f08cc0","#f2c94c","#f4f1e8","#c3a6ff"];for(let x=8;x<=21;x++){set(x,5,"#36b679");if(x%3===2){const f=fl[(x/3|0)%4];set(x,4,f);set(x-1,5,f);set(x+1,5,f);set(x,5,"#f2c94c");set(x,6,f)}}}
  if(hat===17){const pb="#1e1a18";layer(M(1,7,y=>y===1?[11,18]:y<=4?[9,20]:y===5?[6,23]:[5,24]),pb,{light:(x,y)=>x<=10&&y<5});for(let x=6;x<=23;x++)set(x,6,"#f2c94c");P([[14,2],[15,2],[14,3],[15,3]],"#f4f1e8");set(14,3,"#1e1a18")}
  if(hat===18){layer(M(3,7,y=>y===3?[10,19]:y===4?[8,21]:[7,22]),ac,{light:(x,y)=>x<=10,shade:(x,y)=>x>=20});set(14,2,ash);set(15,2,ash);for(let x=8;x<=21;x++)set(x,7,ash)}
  if(hat===19){const sw="#e8cf7a";layer(M(1,6,y=>y===1?[11,18]:[9,20]),sw,{light:(x,y)=>(x+y)%3===0,shade:(x,y)=>x>=19});for(let x=9;x<=20;x++)set(x,5,"#d63b3b");layer(M(6,8,y=>y===6?[3,26]:[2,27]),avMix(sw,"#000",.1),{light:(x,y)=>(x+y)%3===0})}
  if(hat===20){const rd="#c0283a",wt="#f4f1e8";layer(M(1,7,y=>y===1?[12,18]:y===2?[10,21]:y===3?[9,23]:y===4?[8,24]:[8,22]),rd,{light:(x,y)=>x<=10&&y<=4,shade:(x,y)=>x>=21});
    layer(M(5,8,y=>y<=6?[23,25]:[24,26]),rd,{shade:(x,y)=>x>=25});for(let x=7;x<=22;x++){set(x,7,wt);set(x,8,x%3===0?"#d9d4c8":wt)}P([[24,9],[25,9],[26,9],[25,10],[24,10],[26,10],[25,11]],wt)}
  if(hat===21){const ab="#8a5a2a",al=avMix(ab,"#fff",.3);for(let x=8;x<=21;x++)set(x,6,"#3a2414");
    [[9,5],[9,4],[8,3],[8,2],[7,1],[9,3],[10,2],[11,1],[7,3],[6,2]].forEach(([x,y])=>{set(x,y,ab);set(29-x,y,ab)});P([[7,1],[22,1],[11,1],[18,1],[6,2],[23,2]],al)}
  // ---- lunettes
  const fr="#1e1a18",G=c.glasses|0;
  if(G===1){P([[10,11],[11,11],[12,11],[13,11],[10,14],[11,14],[12,14],[13,14],[9,12],[9,13],[14,12],[14,13],[16,11],[17,11],[18,11],[19,11],[16,14],[17,14],[18,14],[19,14],[15,12],[20,12],[20,13]],fr)}
  if(G===2){for(let x=9;x<=14;x++){set(x,11,fr);set(x,14,fr)}for(let x=15;x<=20;x++){set(x,11,fr);set(x,14,fr)}P([[9,12],[9,13],[14,12],[14,13],[15,12],[15,13],[20,12],[20,13]],fr)}
  if(G===3){for(let x=9;x<=20;x++)set(x,11,fr);for(let y=12;y<=13;y++){for(let x=10;x<=13;x++)set(x,y,"#26262e");for(let x=16;x<=19;x++)set(x,y,"#26262e")}set(10,12,"#6a7a9a");set(16,12,"#6a7a9a");P([[14,12],[15,12]],fr)}
  if(G===4){const hr="#e8406a",hd=avMix(hr,"#000",.3);[[9],[16]].forEach(([x0])=>{P([[x0+1,11],[x0+3,11]],hr);P([[x0,12],[x0+1,12],[x0+2,12],[x0+3,12],[x0+4,12]],hr);P([[x0+1,13],[x0+2,13],[x0+3,13]],hr);set(x0+2,14,hd);set(x0+1,12,"#ffc0d0")});P([[14,12],[15,12]],fr)}
  if(G===5){for(let y=11;y<=13;y++)for(let x=8;x<=21;x++){const eye=(x===11||x===12||x===17||x===18)&&(y===12||y===13);if(!eye)set(x,y,y===11?avMix(ac,"#000",.15):ac)}P([[22,12],[23,13],[23,11]],ac)}
  if(G===6){const gd="#f2c94c";P([[17,11],[18,11],[16,12],[19,12],[16,13],[19,13],[17,14],[18,14]],gd);P([[20,15],[20,16],[21,17],[21,18]],avMix(gd,"#000",.2))}
  if(G===7){for(let x=8;x<=21;x++){set(x,11,"#2c2c34");set(x,12,x%3===0?"#b8f4ff":"#4cc9f0");set(x,13,"#1a8fc0")}P([[22,12],[7,12]],"#2c2c34")}
  if(G===8){const gd="#f2c94c";for(let x=9;x<=14;x++){set(x,11,gd);set(x,14,gd)}for(let x=15;x<=20;x++){set(x,11,gd);set(x,14,gd)}P([[9,12],[9,13],[14,12],[14,13],[15,12],[15,13],[20,12],[20,13]],gd);for(let y=12;y<=13;y++){for(let x=10;x<=13;x++)set(x,y,"#c98a2a");for(let x=16;x<=19;x++)set(x,y,"#c98a2a")}set(10,12,"#f2d68a");set(16,12,"#f2d68a")}
  // boucles d'oreilles
  if(c.bijou===6){P([[7,14],[22,14]],"#ffffff");P([[7,15],[22,15],[6,15],[23,15]],"#7fd6f0");P([[7,16],[22,16]],"#3aa6d0")}
  if(c.bijou===1||c.bijou===3){P([[7,14],[22,14],[7,15],[22,15]],"#f2c94c");P([[7,16],[22,16]],"#b8861a")}
  if(c.bijou===4){P([[16,15],[17,15]],"#f2c94c");set(16,16,"#b8861a")}
  {const dy=[0,-1,-2,1,2][c.size|0]||0;if(dy){const cp=px.slice();for(let i=0;i<px.length;i++)px[i]=BGP[i];
    for(let y=0;y<AVH;y++)for(let x=0;x<AVW;x++){const i=y*AVW+x;if(cp[i]===BGP[i])continue;const ny=y+dy;if(ny>=0&&ny<AVH)px[ny*AVW+x]=cp[i]}
    if(dy<0)for(let y=AVH-1+dy;y<AVH;y++)for(let x=0;x<AVW;x++){const s0=(AVH-2+dy)*AVW+x;if(px[s0]!==BGP[s0])px[y*AVW+x]=px[s0]}}}
  const MI=c.main|0;if(MI&&AV_MAIN[MI]){const[sp,pal,x0,y0]=AV_MAIN[MI];sp.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch!=="."){const col=ch==="k"?"#1a1210":ch==="a"?ac:pal[ch];if(col)set(AVW-1-(x0+i),y0+j,col)}}));}
  return px;
}
function avCanvas(cfg,scale){const s=scale||1,cv=document.createElement("canvas");cv.width=AVW*s;cv.height=AVH*s;const g=cv.getContext("2d");const px=avDraw(cfg);
  for(let y=0;y<AVH;y++)for(let x=0;x<AVW;x++){const c=px[y*AVW+x];if(c){g.fillStyle=c;g.fillRect(x*s,y*s,s,s)}}return cv}

// ---- Fenêtre du créateur
function avLock(key,i){if(avcWho!=="__me"||!S.g)return null;if(key==="bijou"&&i===3)return S.g.gear.includes("chain")?null:gearOf("chain");const it=GEAR.find(x=>x.k===key&&x.o===i);return it&&!S.g.gear.includes(it.id)?it:null}
const AVC_TABS=[["face","Visage",[["skin","Teint","sw"],["size","Taille","th"],["eyes","Regard","th"],["eyeC","Couleur des yeux","sw"],["mouth","Bouche","th"],["mark","Détails","th"]]],
  ["hair","Cheveux",[["hair","Coupe","th"],["hairC","Couleur","sw"],["beard","Barbe","th"]]],
  ["top","Tenue",[["top","Haut","th"],["topC","Couleur du haut","sw"],["bot","Bas","th"],["botC","Couleur du bas","sw"],["shoe","Chaussures","th"],["shoeC","Couleur des chaussures","sw"]]],
  ["acc","Accessoires",[["hat","Tête","th"],["glasses","Yeux","th"],["bijou","Bijoux","th"],["main","Objet en main","th"],["accC","Couleur des accessoires","sw"]]],
  ["bg","Fond",[["bgP","Motif","th"],["bgC","Couleur","sw"]]]];
const HAIR_GRP=[["Court",[0,17,16,13,2,12,18,19,7,1,9]],["Mi-long",[20,21,23,22,4,8,14,6]],["Long",[3,24,26,15,25,5,10,11]]];
let avcCfg=null,avcWho="__me";
