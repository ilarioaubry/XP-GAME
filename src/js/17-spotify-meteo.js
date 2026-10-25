// ===== Météo réelle (Open-Meteo : gratuit, sans compte) : ciel, avatar, quêtes =====
// Données inchangées : S.g.wx = {k:"lat,lon", n:nom, off}, S.g.wxc = {cur, td, tm, dt}. Les codes météo sont convertis
// dans l'ancienne numérotation (icônes AccuWeather) pour garder l'historique (S.g.wxh) lisible.
const WX={tried:false,err:"",res:null,busy:false,iv:0};
function wxKind(ic){ic=+ic;if([15,16,17,41,42].includes(ic))return"storm";if([12,13,14,18,26,39,40].includes(ic))return"rain";if([19,20,21,22,23,24,25,29,43,44].includes(ic))return"snow";
  if(ic===11)return"fog";if([6,7,8,38].includes(ic))return"cloudy";if([3,4,5,35,36,37].includes(ic))return"partly";if(ic===32)return"wind";return"clear"}
const WX_L={clear:"Grand ciel",partly:"Quelques nuages",cloudy:"Nuageux",fog:"Brouillard",rain:"Pluie",storm:"Orage",snow:"Neige",wind:"Venteux"};
// code météo WMO (Open-Meteo) → ancien code d'icône + phrase
function wxConv(c,day,wind){c=+c;let ic,ph;
  if(c===0){ic=day?1:33;ph=day?"Grand soleil":"Ciel dégagé"}else if(c<=2){ic=day?3:35;ph="Quelques nuages"}else if(c===3){ic=7;ph="Couvert"}
  else if(c===45||c===48){ic=11;ph="Brouillard"}else if(c>=51&&c<=57){ic=18;ph="Bruine"}else if((c>=61&&c<=67)||(c>=80&&c<=82)){ic=18;ph=c>=80?"Averses":c>=65?"Forte pluie":"Pluie"}
  else if((c>=71&&c<=77)||c===85||c===86){ic=22;ph="Neige"}else if(c>=95){ic=15;ph="Orage"}else{ic=7;ph="Nuageux"}
  if(wind>=45&&(ic===1||ic===3||ic===7)){ic=32;ph="Venteux"}return{ic,ph}}
function wxNow(){const C=S.g&&S.g.wxc;if(!S.g||!S.g.wx||S.g.wx.off||!C||!C.cur||Date.now()-C.cur.t>3*36e5)return null;return{...C.cur,k:wxKind(C.cur.ic)}}
const WX_MSG={geo:"Localisation refusée : tape ta ville à la place.",net:"La météo n'a pas pu être chargée (pas de réseau ?). Réessaie dans un moment.",old:"Choisis ta ville pour activer la météo."};
function wxMsg(e){return WX_MSG[e&&e.code]||WX_MSG.net}
const wxLL=()=>{const k=S.g&&S.g.wx&&S.g.wx.k;const m=/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(k||"");return m?[+m[1],+m[2]]:null};
async function wxFetch(force){const G=S.g;if(!G||!G.wx||G.wx.off)return;const ll=wxLL();if(!ll){WX.err="old";wxPaint();return}
  if(!G.wxc||typeof G.wxc!=="object")G.wxc={};if(!force&&G.wxc.cur&&Date.now()-G.wxc.cur.t<25*6e4){wxPaint();return}WX.tried=true;
  try{const u=`https://api.open-meteo.com/v1/forecast?latitude=${ll[0]}&longitude=${ll[1]}&current=temperature_2m,weather_code,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=2`;
    const r=await fetch(u);if(!r.ok)throw 0;const d=await r.json(),c=d.current||{},D=d.daily||{};
    const now=wxConv(c.weather_code,c.is_day!==0,+c.wind_speed_10m||0);G.wxc.cur={ic:now.ic,ph:now.ph,tc:Math.round(+c.temperature_2m),day:c.is_day!==0,t:Date.now()};
    const one=i=>D.weather_code&&D.weather_code[i]!=null?(x=>({d:dayKey(Date.now()+i*864e5),ic:x.ic,ph:x.ph,max:Math.round(+D.temperature_2m_max[i]),min:Math.round(+D.temperature_2m_min[i]),p:Math.round(+((D.precipitation_probability_max||[])[i])||0)}))(wxConv(D.weather_code[i],true,0)):null;
    G.wxc.td=one(0);G.wxc.tm=one(1);G.wxc.dt=Date.now();WX.err="";save()}catch(e){WX.err="net"}wxPaint()}
function wxStart(){wxFetch(false);clearInterval(WX.iv);WX.iv=setInterval(()=>{if(!document.hidden)wxFetch(false)},30*6e4)}
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&S.g&&S.g.wx&&!S.g.wx.off)wxFetch(false)});
const WXI={clear:["...y.y....","....y.....",".y.yyy.y..","..yyyyy...","yyyyYyyyy.","..yyyyy...",".y.yyy.y..","....y.....","...y.y...."],
 moon:["...wwww...","..wwW.....",".wwW......",".wwW......",".wwW......",".wwwW.....","..wwwWwww.","...wwwww..","..........."],
 partly:["..y.......","y.yyy.....",".yyyy.....","yyywwww...",".ywwwwwww.","wwwwwwwwww","wwwwwwwwwW",".WWWWWWWW.",".........."],
 cloudy:["...wwww...","..wwwwww..",".wwwwwwwww","wwwwwwwwww","wwwwwwwwwW",".WWWWWWWW.","..........","..........",".........."],
 fog:["..........","wwwwwww...","..........","..wwwwwwww","..........","wwwwwwwww.","..........","...wwwwww.",".........."],
 rain:["...wwww...","..wwwwww..",".wwwwwwwww","wwwwwwwwwW",".WWWWWWWW.","..b..b..b.",".b..b..b..","b..b..b...",".........."],
 storm:["...WWWW...","..WWWWWW..",".WWWWWWWWW","WWWWWWWWWW",".WWWyyWWW.","....yy....","...yy.....","..yy......","...y......"],
 snow:["...wwww...","..wwwwww..",".wwwwwwwww","wwwwwwwwwW",".WWWWWWWW.","..w..w..w.","...w..w..w","..w..w..w.",".........."],
 wind:["..........","wwwwww....","......w...","wwwwwww...","..........","wwwwwwwww.",".........w","wwwwwwww..",".........."]};
const WXP={y:"#ffd94a",Y:"#f0a020",w:"#f4f6fb",W:"#aeb6c8",b:"#7fd4ff"};
function wxIcon(k,day){return ambPx(WXI[k==="clear"&&!day?"moon":k]||WXI.cloudy,WXP)}
const WX_UMB=["..oooooooooo..",".oRRRWWWRRRRo.","oRRRWWWWWRRRRo","oRRRRWWWRRRRRo","oooooooooooooo","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","...........k..","..........k.k.","...........k.."];
function wxPaint(){const Rt=document.documentElement,w=wxNow();if(w)Rt.dataset.wx=w.k;else delete Rt.dataset.wx;
  const bg=document.getElementById("skyBg");if(bg){let L=bg.querySelector(".skwx");if(!L){L=document.createElement("div");L.className="skwx";const hill=bg.querySelector(".skhill");bg.insertBefore(L,hill||null)}
    const k=w?w.k:"",want=["rain","storm","snow","fog","cloudy"].includes(k)?k:"";if(L.dataset.k!==want){L.dataset.k=want;
      L.innerHTML=want==="rain"||want==="storm"?Array.from({length:46},(_,i)=>`<i style="left:${(i*29+7)%100}%;animation-delay:-${((i*37)%100)/100*2.2}s;animation-duration:${1.6+((i*13)%7)/8}s"></i>`).join("")+(want==="storm"?`<b class="wxfl"></b>`:"")
       :want==="snow"?Array.from({length:40},(_,i)=>`<i class="sn" style="left:${(i*31+3)%100}%;animation-delay:-${(i*17)%9}s;animation-duration:${7+(i*7)%5}s"></i>`).join("")
       :want==="fog"?`<span class="fg f1"></span><span class="fg f2"></span><span class="fg f3"></span>`
       :want==="cloudy"?`<span class="wcl a">${AMB_CLOUD}</span><span class="wcl b">${AMB_CLOUD}</span><span class="wcl c">${AMB_CLOUD}</span>`:""}}
  const chip=document.querySelector("#sceneBox .scwx");if(chip){chip.innerHTML=w?`${wxIcon(w.k,w.day)}<b>${w.tc}°</b>`:`${wxIcon("partly",true)}<b>${S.g.wx&&!S.g.wx.off&&wxLL()?"…":"Météo"}</b>`;chip.setAttribute("aria-label",w?`Météo : ${w.ph}, ${w.tc} degrés`:"Météo")}
  const sh=document.querySelector(".wxsh");if(sh&&sh.__draw)sh.__draw();
  const sb=$("sceneBox");if(sb&&sb.__wx!==undefined){const k2=wxK2();if(sb.__wx!==k2){sb.__wx=k2;sb.__k="";sceneTick()}}}
function wxK2(){const w=wxNow();return w?(["rain","storm"].includes(w.k)?"u":"")+(w.k==="snow"||w.tc<=4?"c":""):""}
function wxQuests(){const w=wxNow();if(!w)return[];const h=dayH();
  if((w.k==="clear"||w.k==="partly")&&w.day&&w.tc>=8&&w.tc<=30)return[["wxsun","Il fait beau : 10 min dehors, sans téléphone",[9,19],15,"soi"]];
  if(w.k==="rain"||w.k==="storm")return[["wxrain","Il pleut : un moment cosy (thé, lecture, musique)",[9,22],10,"soi"]];
  if(w.k==="snow")return[["wxsnow","Il neige : va voir la neige 5 minutes",[8,20],15,"soi"]];
  if(w.tc>=28)return[["wxhot","Il fait chaud : une douche fraîche et 10 min au calme",[12,19],10,"soi"]];return[]}
function wxSheet(){if(document.querySelector(".wxsh"))return;const G=S.g,p=document.createElement("div");p.className="bpop rapop wxsh";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Météo");document.body.appendChild(p);
  const close=()=>p.remove();p.onclick=e=>{if(e.target===p)close()};let setup=!G.wx||!wxLL(),q="";
  const draw=p.__draw=()=>{if(!document.body.contains(p))return;const w=wxNow(),C=G.wxc||{};let h=`<div class="bpc rap qc wxc"><div class="raph"><h3>Météo</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>`;
    if(setup){h+=`<p class="qcsub">La vraie météo dans ton ciel et tes quêtes.</p>
      <button type="button" class="btn primary wxgeo" style="width:100%"${WX.busy?" disabled":""}>Utiliser ma position</button>
      <form class="qcadd wxf"><input maxlength="60" placeholder="Ou tape ta ville" aria-label="Ville" value="${esc(q)}"><button type="submit" class="btn" aria-label="Chercher"${WX.busy?" disabled":""}>${ICO("check",18)}</button></form>
      ${WX.busy?`<p class="hint">Recherche…</p>`:""}${WX.err&&WX.res===null?`<p class="sperr">${esc(wxMsg({code:WX.err}))}</p>`:""}
      ${WX.res?WX.res.length?`<div class="wxres">${WX.res.map((r,i)=>`<button type="button" class="qctp" data-r="${i}"><span></span></button>`).join("")}</div>`:`<p class="hint vide">Aucune ville trouvée.</p>`:""}
      ${G.wx&&wxLL()?`<button type="button" class="lnk wxback">Annuler</button>`:""}`}
    else{h+=`<div class="wxnow">${w?`<span class="wxbig">${wxIcon(w.k,w.day)}</span><span><b>${w.tc}°</b><small></small><em></em></span>`:`<span><small>${WX.err?esc(wxMsg({code:WX.err})):G.wx.off?"Météo désactivée.":"Chargement de la météo…"}</small><em></em></span>`}</div>
      ${C.td&&C.td.d===dayKey(Date.now())?`<div class="wxd"><span>${wxIcon(wxKind(C.td.ic),true)}</span><b>Aujourd'hui</b><small class="wtd"></small><em>${C.td.min}° / ${C.td.max}°${C.td.p>=20?` · ${C.td.p} %`:""}</em></div>`:""}
      ${C.tm&&C.tm.d===dayKey(Date.now()+864e5)?`<div class="wxd"><span>${wxIcon(wxKind(C.tm.ic),true)}</span><b>Demain</b><small class="wtm"></small><em>${C.tm.min}° / ${C.tm.max}°${C.tm.p>=20?` · ${C.tm.p} %`:""}</em></div>`:""}
      <div class="sppl"><button type="button" class="btn wxcity">Changer de ville</button><button type="button" class="btn wxoff">${G.wx.off?"Réactiver la météo":"Désactiver la météo"}</button></div>`}
    p.innerHTML=h+`</div>`;p.querySelector(".raclose").onclick=close;
    if(!setup){const nw=p.querySelector(".wxnow small"),ne=p.querySelector(".wxnow em");if(w&&nw){nw.textContent=w.ph;ne.textContent=G.wx.n}else if(ne)ne.textContent=G.wx.n||"";const a=p.querySelector(".wtd");if(a)a.textContent=C.td.ph;const b=p.querySelector(".wtm");if(b)b.textContent=C.tm.ph;
      p.querySelector(".wxcity").onclick=()=>{setup=true;WX.res=null;draw()};p.querySelector(".wxoff").onclick=()=>{G.wx.off=!G.wx.off;save();if(G.wx.off)clearInterval(WX.iv);else wxStart();wxPaint();draw()}}
    else{const pick=(lat,lon,name)=>{G.wx={k:(+lat).toFixed(2)+","+(+lon).toFixed(2),n:String(name).slice(0,60)};G.wxc={};save();setup=false;WX.err="";WX.res=null;wxStart();sfx("badge");draw()};
      p.querySelectorAll("[data-r]").forEach(b=>{const r=WX.res[+b.dataset.r];b.querySelector("span").textContent=[r.name,r.admin1,r.country].filter(Boolean).join(", ");b.onclick=()=>pick(r.latitude,r.longitude,r.name)});
      p.querySelector(".wxgeo").onclick=()=>{if(!navigator.geolocation){WX.err="geo";draw();return}WX.busy=true;WX.err="";draw();
        navigator.geolocation.getCurrentPosition(ps=>{WX.busy=false;pick(ps.coords.latitude,ps.coords.longitude,"Ma position")},()=>{WX.busy=false;WX.err="geo";WX.res=null;draw()},{timeout:15000,maximumAge:36e5})};
      const bk=p.querySelector(".wxback");if(bk)bk.onclick=()=>{setup=false;draw()};
      const f=p.querySelector(".wxf");f.onsubmit=async e=>{e.preventDefault();q=f.querySelector("input").value.trim();if(!q)return;WX.busy=true;WX.res=null;WX.err="";draw();
        try{const r=await fetch("https://geocoding-api.open-meteo.com/v1/search?count=6&language=fr&name="+encodeURIComponent(q));if(!r.ok)throw 0;WX.res=((await r.json()).results||[]).filter(x=>x&&x.latitude!=null).slice(0,6)}catch(err){WX.err="net";WX.res=null}WX.busy=false;draw()}}};
  draw();setTimeout(()=>{const i=p.querySelector(".wxf input");if(i)i.focus({preventScroll:true})},60)}
function wxBoot(){if(S.g&&S.g.wx&&wxLL()&&!S.g.wx.off&&!WX.tried)wxStart();wxPaint()}
