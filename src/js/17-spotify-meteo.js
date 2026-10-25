// ===== Spotify : la platine de la scène, le son du jour, les playlists =====
const SP={mcp:null,tried:false,tr:null,err:"",unw:null,recent:null,recErr:"",pl:null,plErr:"",plBusy:false,alt:null};
const SP_MSG={needs_reauth:"Spotify s'est déconnecté. Reconnecte-le dans claude.ai, Réglages, Connecteurs.",server_not_connected:"Ajoute Spotify dans claude.ai, Réglages, Connecteurs, puis reviens ici.",selection_required:"Choisis ton compte Spotify dans la fenêtre que Claude t'a montrée, puis réessaie.",
  not_in_manifest:"Tu n'as pas autorisé Spotify pour cette appli. Tu peux l'autoriser depuis les permissions de la page.",blocked_by_policy:"Ton organisation bloque cet outil Spotify.",approval_required:"Ton organisation demande une validation pour cet outil.",
  not_granted:"Les connecteurs ne sont pas disponibles dans cette vue.",capability_disabled:"Les connecteurs ne sont pas disponibles dans cette vue.",capability_removed:"Les connecteurs ne sont pas disponibles dans cette vue.",
  server_unavailable:"Spotify ne répond pas pour l'instant. Réessaie dans un moment.",rate_limited:"Trop de demandes d'un coup. Réessaie dans quelques secondes.",cancelled:"Demande annulée."};
const spMsg=e=>SP_MSG[e&&e.code]||"Spotify n'a pas pu répondre. Réessaie dans un moment.";
const SP_DENY=["needs_reauth","server_not_connected","selection_required","not_in_manifest","blocked_by_policy","approval_required","not_granted","capability_disabled","capability_removed","server_not_found"];
function spFind(o,d){if(!o||typeof o!=="object"||d>5)return null;if(Array.isArray(o)){for(const x of o){const r=spFind(x,d+1);if(r)return r}return null}
  if((o.name||o.title)&&(o.creators||o.artists||o.artist||o.album||o.uri&&/track|episode/.test(o.uri)))return o;for(const k of["currently_playing_entity","item","track","currently_playing","playing","entity","entities","result","data"])if(o[k]){const r=spFind(o[k],d+1);if(r)return r}for(const v of Object.values(o))if(v&&typeof v==="object"){const r=spFind(v,d+1);if(r)return r}return null}
function spTrack(p,ifPlaying){if(typeof p==="string"){try{p=JSON.parse(p)}catch(e){return null}}if(!p||typeof p!=="object"||!Object.keys(p).length)return null;if(ifPlaying&&(p.is_playing===false||p.isPlaying===false))return null;const x=spFind(p,0);if(!x)return null;
  const art=(x.creators||x.artists||[]).map(a=>a&&a.name).filter(Boolean).join(", ")||(typeof x.artist==="string"?x.artist:"")||"";
  const cv=x.display&&x.display.covers?(x.display.covers.find(c=>c.size==="SMALL")||x.display.covers[0]||{}).url:x.album&&x.album.images?(x.album.images.slice(-1)[0]||{}).url:x.image||"";
  const url=x.url||(x.external_urls&&x.external_urls.spotify)||"";return{n:String(x.name||x.title).slice(0,80),a:art.slice(0,80),u:/^https:\/\/open\.spotify\.com\//.test(url)?url:"",c:/^https:\/\/i\.scdn\.co\//.test(cv||"")?cv:""}}
function spUrlIn(o,d){if(d>6||o==null)return null;if(typeof o==="string"){const m=o.match(/https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]+[^\s"')]*/);return m?m[0]:null}if(typeof o==="object")for(const v of Object.values(o)){const r=spUrlIn(v,d+1);if(r)return r}return null}
async function spStart(){if(SP.unw)return true;SP.tried=true;let m=null;try{m=window.claude&&claude.use?await claude.use("mcp"):null}catch(e){m=null}
  if(!m){SP.err="not_granted";spPaint();return false}SP.mcp=m;
  try{SP.unw=m.watchTool("Spotify","get_currently_playing",null,ev=>{if(ev.type==="data"){SP.tr=spTrack(ev.result.payload,true);SP.err=""}else{const c=ev.error&&ev.error.code;if(SP_DENY.includes(c)){SP.tr=null;SP.err=c}else if(!SP.tr)SP.err=c||"upstream_error"}spPaint()},{refetchInterval:60000})}catch(e){SP.err="capability_disabled"}
  spPaint();return true}
function spPaint(){const r=document.querySelector("#sceneBox .scradio");if(r){r.classList.toggle("on",!!SP.tr);r.setAttribute("aria-label",SP.tr?`Sur Spotify : ${SP.tr.n}${SP.tr.a?" de "+SP.tr.a:""}`:"Musique");const b=r.querySelector(".scrb");if(b){b.querySelector("b").textContent=SP.tr?SP.tr.n:"";b.querySelector("span").textContent=SP.tr?SP.tr.a:""}}
  const av=document.querySelector("#sceneBox .scav");if(av)av.classList.toggle("groove",!!SP.tr);const sh=document.querySelector(".spsh");if(sh&&sh.__draw)sh.__draw()}
const SP_RADIO=["....k.......","....k.......","oooooooooooo","oRRRRRRRRRRo","oRwwoRRowwRo","oRwbwRRwbwRo","oRwwoRRowwRo","oRRRRRRRRRRo","oooooooooooo"];
function spRadioHTML(){return`<button type="button" class="scradio${SP.tr?" on":""}" aria-label="Musique">${ambPx(SP_RADIO,{o:"#24182c",R:"#d64a3a",w:"#e8e2d0",b:"#2a2238",k:"#8a8f99"})}<span class="scn2"><i></i><i></i><i></i></span><span class="scrb"><b></b><span></span></span></button>`}
function spCard(t,i){return`<div class="spt">${spCov(t,44)}<span><b></b><small></small></span>${t.u?`<a class="btn sm" href="${t.u}" target="_blank" rel="noopener">Ouvrir</a>`:""}<button type="button" class="btn sm sdj" data-i="${i}">Son du jour</button></div>`}

function spSheet(){if(document.querySelector(".spsh"))return;if(SP.mcp&&SP.mcp.invalidate)SP.mcp.invalidate("Spotify","get_currently_playing").catch(()=>{});const G=S.g,tk=dayKey(Date.now()),p=document.createElement("div");p.className="bpop rapop spsh";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Musique");document.body.appendChild(p);
  const close=()=>p.remove();p.onclick=e=>{if(e.target===p)close()};const soir=dayPer()!=="matin";
  const draw=p.__draw=()=>{if(!document.body.contains(p))return;if(!G.sdj||typeof G.sdj!=="object")G.sdj={};const sd=G.sdj[tk],L=[];
    const cur=SP.tr;if(cur)L.push(cur);const rec=(SP.recent||[]).filter(t=>!cur||t.n!==cur.n);
    let h=`<div class="bpc rap qc spc"><div class="raph"><h3>Musique</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>`;
    if(!G.spOn)h+=`<p class="qcsub">Ta musique sur ta scène et une playlist pour ta routine.</p><button type="button" class="btn primary qcgo spgo">Connecter Spotify</button>`;
    else{if(SP.err&&SP_DENY.includes(SP.err))h+=`<p class="sperr">${esc(spMsg({code:SP.err}))}</p>`;
      if(sd)h+=`<h4>Son du jour</h4><div class="spl">${spCard(sd,-1)}</div>`;
      h+=`<h4>En ce moment</h4>${cur?`<div class="spl">${spCard(cur,0)}</div>`:`<p class="hint" style="margin:0">${SP.err&&!SP_DENY.includes(SP.err)?esc(spMsg({code:SP.err})):"Rien ne joue sur Spotify en ce moment."}</p>`}
      <h4>Tes derniers sons</h4>${SP.recent?rec.length?`<div class="spl">${rec.map((t,k)=>spCard(t,L.length+k)).join("")}</div>`:`<p class="hint vide">Aucun résultat.</p>`:SP.recErr?`<p class="sperr">${esc(SP.recErr)}</p><button type="button" class="btn sprec">Réessayer</button>`:`<button type="button" class="btn sprec">Afficher mes derniers sons</button>`}
      <h4>Playlist</h4><div class="sppl"><button type="button" class="btn${soir?"":" primary"}" data-pl="matin"${SP.plBusy?" disabled":""}>Pour ma routine du matin</button><button type="button" class="btn${soir?" primary":""}" data-pl="soir"${SP.plBusy?" disabled":""}>Pour le feu de camp du soir</button></div>
      ${SP.plBusy?`<p class="hint">Spotify prépare ta playlist…</p>`:""}${SP.pl?`<a class="btn primary qcgo" href="${SP.pl}" target="_blank" rel="noopener">Ouvrir ma playlist dans Spotify</a>`:""}${SP.plErr?`<p class="sperr">${esc(SP.plErr)}</p>`:""}
      ${SP.alt&&SP.alt.length?`<div class="spl">${SP.alt.map(t=>`<div class="spt"><span class="spnc">${ICO("spark",18)}</span><span><b></b><small></small></span>${t.u?`<a class="btn sm" href="${t.u}" target="_blank" rel="noopener">Ouvrir</a>`:""}</div>`).join("")}</div>`:""}`}
    h+=`</div>`;p.innerHTML=h;const all=[...L,...rec];
    p.querySelectorAll(".spl").forEach(box=>{const cards=[...box.querySelectorAll(".spt")];cards.forEach(el=>{const i=+((el.querySelector(".sdj")||{}).dataset||{}).i;const t=i===-1?sd:Number.isNaN(i)?null:all[i];if(t){el.querySelector("b").textContent=t.n;el.querySelector("small").textContent=t.a}})});
    if(SP.alt){const altBox=[...p.querySelectorAll(".spl")].pop();if(altBox)[...altBox.querySelectorAll(".spt")].forEach((el,k)=>{const t=SP.alt[k];if(t&&!el.querySelector(".sdj")){el.querySelector("b").textContent=t.n;el.querySelector("small").textContent=t.a}})}
    p.querySelector(".raclose").onclick=close;
    {const go=p.querySelector(".spgo");if(go)go.onclick=async()=>{G.spOn=1;save();await spStart();if(SP.err&&SP_DENY.includes(SP.err)){G.spOn=0;save()}draw()}}
    p.querySelectorAll(".sdj").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;const t=i===-1?sd:all[i];if(!t)return;if(i===-1){delete G.sdj[tk];toast("Son du jour retiré")}else{G.sdj[tk]={...t,t:Date.now()};const ks=Object.keys(G.sdj).sort();while(ks.length>60)delete G.sdj[ks.shift()];sfx("badge");toast(`Son du jour : <span class="p">${esc(t.n)}</span>`)}save();draw();sceneTick()});
    {const rb=p.querySelector(".sprec");if(rb)rb.onclick=async()=>{rb.disabled=true;rb.textContent="Chargement…";try{if(!SP.mcp&&!(await spStart()))throw{code:"not_granted"};const r=await SP.mcp.callTool("Spotify","search",{prompt:"mes titres écoutés récemment",language:"fr-FR",limit:6});const ents=(r.payload&&r.payload.entities)||[];SP.recent=ents.map(e=>spTrack(e)).filter(Boolean);SP.recErr=""}catch(e){SP.recErr=spMsg(e)}draw()}}
    p.querySelectorAll("[data-pl]").forEach(b=>b.onclick=async()=>{if(SP.plBusy)return;SP.plBusy=true;SP.pl=null;SP.plErr="";SP.alt=null;draw();const mo=b.dataset.pl,md=(G.mood||{})[tk];
      const prompt=mo==="matin"?`Crée une playlist d'environ 25 minutes pour ma routine du matin, énergique et positive${md&&md<=2?", qui remonte le moral en douceur":""}, dans le style de ce que j'écoute`:`Crée une playlist d'environ 40 minutes calme et chaleureuse pour une soirée au coin du feu, dans le style de ce que j'écoute`;
      try{if(!SP.mcp&&!(await spStart()))throw{code:"not_granted"};const r=await SP.mcp.callTool("Spotify","generate_playlist",{prompt,language:"fr-FR"},{cache:false});const u=spUrlIn(r.payload,0)||spUrlIn(r.content,0);
        const txt=JSON.stringify(r.payload||r.content||"");if(u){SP.pl=u;sfx("badge")}else if(/NOT_SUBSCRIBED|PREMIUM/i.test(txt))throw{code:"premium"};else SP.plErr="Spotify a répondu sans lien de playlist. Elle est peut-être déjà dans ta bibliothèque Spotify."}
      catch(e){if(e&&(e.code==="premium"||/NOT_SUBSCRIBED|PREMIUM/i.test(JSON.stringify(e.result||e.message||"")))){SP.plErr="Créer une playlist demande Spotify Premium. Voici des playlists existantes à la place :";
          try{const r=await SP.mcp.callTool("Spotify","search",{prompt:mo==="matin"?"playlist énergique pour la routine du matin":"playlist calme coin du feu soirée",language:"fr-FR",limit:4});SP.alt=((r.payload&&r.payload.entities)||[]).map(x=>({n:String(x.name||"").slice(0,80),a:((x.creators||[]).map(c=>c.name).join(", ")||"Playlist").slice(0,80),u:/^https:\/\/open\.spotify\.com\//.test(x.url||"")?x.url:""})).filter(x=>x.n)}catch(e2){}}
        else SP.plErr=e&&e.code==="tool_error"?"Spotify n'a pas pu créer la playlist : "+String(e.message||"").slice(0,120):spMsg(e)}
      SP.plBusy=false;draw()})};
  draw()}
function spBoot(){if(S.g&&S.g.spOn&&!SP.tried)spStart()}
// ===== Météo réelle (AccuWeather) : ciel, avatar, quêtes =====
const WXS="AccuWeather®";
const WX={mcp:null,tried:false,err:"",unw:null,res:null,busy:false};
function wxKind(ic){ic=+ic;if([15,16,17,41,42].includes(ic))return"storm";if([12,13,14,18,26,39,40].includes(ic))return"rain";if([19,20,21,22,23,24,25,29,43,44].includes(ic))return"snow";
  if(ic===11)return"fog";if([6,7,8,38].includes(ic))return"cloudy";if([3,4,5,35,36,37].includes(ic))return"partly";if(ic===32)return"wind";return"clear"}
const WX_L={clear:"Grand ciel",partly:"Quelques nuages",cloudy:"Nuageux",fog:"Brouillard",rain:"Pluie",storm:"Orage",snow:"Neige",wind:"Venteux"};
function wxNow(){const C=S.g&&S.g.wxc;if(!S.g||!S.g.wx||S.g.wx.off||!C||!C.cur||Date.now()-C.cur.t>3*36e5)return null;return{...C.cur,k:wxKind(C.cur.ic)}}
function wxMsg(e){const c=e&&e.code;return({needs_reauth:"AccuWeather s'est déconnecté. Reconnecte-le dans claude.ai, Réglages, Connecteurs.",server_not_connected:"Ajoute AccuWeather dans claude.ai, Réglages, Connecteurs.",not_in_manifest:"Tu n'as pas autorisé AccuWeather pour cette appli.",
  not_granted:"Les connecteurs ne sont pas disponibles dans cette vue.",capability_disabled:"Les connecteurs ne sont pas disponibles dans cette vue.",server_unavailable:"AccuWeather ne répond pas pour l'instant. Réessaie dans un moment.",selection_required:"Choisis ton compte AccuWeather dans la fenêtre de Claude, puis réessaie."})[c]||"La météo n'a pas pu être chargée. Réessaie dans un moment."}
const WX_DENY=["needs_reauth","server_not_connected","selection_required","not_in_manifest","blocked_by_policy","approval_required","not_granted","capability_disabled","capability_removed","server_not_found"];
async function wxMcp(){if(WX.mcp)return WX.mcp;try{WX.mcp=window.claude&&claude.use?await claude.use("mcp"):null}catch(e){WX.mcp=null}return WX.mcp}
async function wxStart(){const G=S.g;if(!G||!G.wx||!G.wx.k||G.wx.off||WX.unw)return;WX.tried=true;const m=await wxMcp();if(!m){WX.err="not_granted";wxPaint();return}
  const q={queryParams:{locationKey:G.wx.k,unit:"metric",lang:"fr"}};
  try{WX.unw=m.watchTool(WXS,"widgets-current-claude",q,ev=>{if(ev.type==="data"){const c=ev.result.payload&&ev.result.payload.currentConditions;if(c&&c.iconCode!=null){if(!G.wxc||typeof G.wxc!=="object")G.wxc={};const old=JSON.stringify(G.wxc.cur&&{...G.wxc.cur,t:0});
      G.wxc.cur={ic:+c.iconCode,ph:String(c.phrase||"").slice(0,60),tc:Math.round(+c.temperatureValue),day:c.isDayTime!==false,t:Date.now()};WX.err="";if(old!==JSON.stringify({...G.wxc.cur,t:0}))save();wxPaint()}}
    else{const c=ev.error&&ev.error.code;if(WX_DENY.includes(c)){WX.err=c;if(S.g.wxc)delete S.g.wxc.cur;wxPaint()}}},{refetchInterval:15*6e4})}catch(e){WX.err="capability_disabled"}
  wxDaily(false)}
async function wxDaily(force){const G=S.g;if(!G.wx||!G.wx.k)return;if(!G.wxc||typeof G.wxc!=="object")G.wxc={};if(!force&&G.wxc.dt&&Date.now()-G.wxc.dt<3*36e5)return;const m=await wxMcp();if(!m)return;
  try{const r=await m.callTool(WXS,"widgets-daily-claude",{queryParams:{locationKey:G.wx.k,unit:"metric",lang:"fr"}},{cache:{staleTime:3e5}});const D=(r.payload&&r.payload.dailyForecast)||[];
    const one=(x,i)=>x&&x.day?{d:dayKey(Date.now()+i*864e5),ic:+x.day.icon,ph:String(x.day.longPhrase||x.day.phrase||"").slice(0,80),max:Math.round(+x.day.temperature),min:Math.round(+(x.night&&x.night.temperature)),p:Math.max(+x.day.rainProbabilityValue||0,+x.day.snowProbabilityValue||0)}:null;
    G.wxc.td=one(D[0],0);G.wxc.tm=one(D[1],1);G.wxc.dt=Date.now();save();wxPaint()}catch(e){if(WX_DENY.includes(e&&e.code))WX.err=e.code}}
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
  const chip=document.querySelector("#sceneBox .scwx");if(chip){chip.innerHTML=w?`${wxIcon(w.k,w.day)}<b>${w.tc}°</b>`:`${wxIcon("partly",true)}<b>${S.g.wx&&!S.g.wx.off?"…":"Météo"}</b>`;chip.setAttribute("aria-label",w?`Météo : ${w.ph}, ${w.tc} degrés`:"Météo")}
  const sh=document.querySelector(".wxsh");if(sh&&sh.__draw)sh.__draw();
  const sb=$("sceneBox");if(sb&&sb.__wx!==undefined){const k2=wxK2();if(sb.__wx!==k2){sb.__wx=k2;sb.__k="";sceneTick()}}}
function wxK2(){const w=wxNow();return w?(["rain","storm"].includes(w.k)?"u":"")+(w.k==="snow"||w.tc<=4?"c":""):""}
function wxQuests(){const w=wxNow();if(!w)return[];const h=dayH();
  if((w.k==="clear"||w.k==="partly")&&w.day&&w.tc>=8&&w.tc<=30)return[["wxsun","Il fait beau : 10 min dehors, sans téléphone",[9,19],15,"soi"]];
  if(w.k==="rain"||w.k==="storm")return[["wxrain","Il pleut : un moment cosy (thé, lecture, musique)",[9,22],10,"soi"]];
  if(w.k==="snow")return[["wxsnow","Il neige : va voir la neige 5 minutes",[8,20],15,"soi"]];
  if(w.tc>=28)return[["wxhot","Il fait chaud : une douche fraîche et 10 min au calme",[12,19],10,"soi"]];return[]}
function wxSheet(){if(document.querySelector(".wxsh"))return;const G=S.g,p=document.createElement("div");p.className="bpop rapop wxsh";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Météo");document.body.appendChild(p);
  const close=()=>p.remove();p.onclick=e=>{if(e.target===p)close()};let setup=!G.wx||!G.wx.k,q="";
  const draw=p.__draw=()=>{if(!document.body.contains(p))return;const w=wxNow(),C=G.wxc||{};let h=`<div class="bpc rap qc wxc"><div class="raph"><h3>Météo</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>`;
    if(setup){h+=`<p class="qcsub">La vraie météo dans ton ciel et tes quêtes. Tu choisis ta ville.</p>
      <form class="qcadd wxf"><input maxlength="60" placeholder="Ta ville ou ton code postal" aria-label="Ville" value="${esc(q)}"><button type="submit" class="btn primary" aria-label="Chercher"${WX.busy?" disabled":""}>${ICO("check",18)}</button></form>
      ${WX.busy?`<p class="hint">Recherche…</p>`:""}${WX.err&&WX.res===null?`<p class="sperr">${esc(wxMsg({code:WX.err}))}</p>`:""}
      ${WX.res?WX.res.length?`<div class="wxres">${WX.res.map((r,i)=>`<button type="button" class="qctp" data-r="${i}"><span></span></button>`).join("")}</div>`:`<p class="hint vide">Aucune ville trouvée.</p>`:""}
      ${G.wx&&G.wx.k?`<button type="button" class="lnk wxback">Annuler</button>`:""}`}
    else{h+=`<div class="wxnow">${w?`<span class="wxbig">${wxIcon(w.k,w.day)}</span><span><b>${w.tc}°</b><small></small><em></em></span>`:`<span><small>${WX.err?esc(wxMsg({code:WX.err})):G.wx.off?"Météo désactivée.":"Chargement de la météo…"}</small><em></em></span>`}</div>
      ${C.td&&C.td.d===dayKey(Date.now())?`<div class="wxd"><span>${wxIcon(wxKind(C.td.ic),true)}</span><b>Aujourd'hui</b><small class="wtd"></small><em>${C.td.min}° / ${C.td.max}°${C.td.p>=20?` · ${C.td.p} %`:""}</em></div>`:""}
      ${C.tm&&C.tm.d===dayKey(Date.now()+864e5)?`<div class="wxd"><span>${wxIcon(wxKind(C.tm.ic),true)}</span><b>Demain</b><small class="wtm"></small><em>${C.tm.min}° / ${C.tm.max}°${C.tm.p>=20?` · ${C.tm.p} %`:""}</em></div>`:""}
      <div class="sppl"><button type="button" class="btn wxcity">Changer de ville</button><button type="button" class="btn wxoff">${G.wx.off?"Réactiver la météo":"Désactiver la météo"}</button></div>`}
    p.innerHTML=h+`</div>`;p.querySelector(".raclose").onclick=close;
    if(!setup){const nw=p.querySelector(".wxnow small"),ne=p.querySelector(".wxnow em");if(w&&nw){nw.textContent=w.ph;ne.textContent=G.wx.n}else if(ne)ne.textContent=G.wx.n||"";const a=p.querySelector(".wtd");if(a)a.textContent=C.td.ph;const b=p.querySelector(".wtm");if(b)b.textContent=C.tm.ph;
      p.querySelector(".wxcity").onclick=()=>{setup=true;WX.res=null;draw()};p.querySelector(".wxoff").onclick=()=>{G.wx.off=!G.wx.off;save();if(G.wx.off){if(WX.unw){WX.unw();WX.unw=null}}else wxStart();wxPaint();draw()}}
    else{p.querySelectorAll("[data-r]").forEach(b=>{const r=WX.res[+b.dataset.r];b.querySelector("span").textContent=r.name;b.onclick=()=>{if(WX.unw){WX.unw();WX.unw=null}G.wx={k:String(r.locationKey),n:String(r.name).slice(0,60)};G.wxc={};save();setup=false;WX.err="";wxStart();sfx("badge");draw()}});
      const bk=p.querySelector(".wxback");if(bk)bk.onclick=()=>{setup=false;draw()};
      const f=p.querySelector(".wxf");f.onsubmit=async e=>{e.preventDefault();q=f.querySelector("input").value.trim();if(!q)return;WX.busy=true;WX.res=null;WX.err="";draw();
        try{const m=await wxMcp();if(!m)throw{code:"not_granted"};const r=await m.callTool(WXS,"widgets-search-claude",{queryParams:{query:q}});WX.res=((r.payload&&r.payload.results)||[]).filter(x=>x&&x.locationKey).slice(0,6)}catch(err){WX.err=(err&&err.code)||"upstream_error";WX.res=null}WX.busy=false;draw()}}};
  draw();setTimeout(()=>{const i=p.querySelector(".wxf input");if(i)i.focus({preventScroll:true})},60)}
function wxBoot(){if(S.g&&S.g.wx&&S.g.wx.k&&!S.g.wx.off&&!WX.tried)wxStart();wxPaint()}
