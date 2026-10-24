// ==== Saison des fêtes : hotte, Avent, Bougonnoël, vœux, ton année, résolutions
const XM_ST=["Idée","Acheté","Emballé","Offert"],XM_XP=[5,10,5,15],XM_HP=100;
const XM_ADV=[
 ["Faire ta liste de Noël","famille",10,"xmscarf"],["Écrire à quelqu'un que tu n'as pas vu depuis longtemps","social",15],["Mettre une playlist de fêtes et ranger 10 min","maison",10],["Boire un chocolat chaud sans écran","soi",10,"xmcane"],
 ["Décorer un coin de chez toi","maison",15],["Regarder un film de Noël","soi",15],["Faire 16 mesures d'un son de saison","perso",20],["Préparer des biscuits ou un dessert de fêtes","nourriture",20,"bgsnow"],
 ["Appeler un grand-parent ou un proche âgé","famille",20],["Donner un objet ou un vêtement dont tu ne te sers plus","maison",15],["Marcher 20 min dehors au froid","sport",15],["Envoyer une photo souvenir à un ami","social",10,"xmantler"],
 ["Lire 20 pages au chaud","soi",15],["Offrir une boisson chaude à quelqu'un","social",10],["Garder tes 10 meilleures photos de l'année","soi",15],["Emballer tes cadeaux","maison",15,"xmsweater"],
 ["Préparer un plat pour quelqu'un","nourriture",20],["Trier les photos et les applis de ton téléphone","soi",15],["Remercier quelqu'un qui t'a aidé cette année","social",15],["Écouter un album en entier sous un plaid","soi",15,"xmflakes"],
 ["Cuisiner un plat de fêtes","nourriture",25],["Envoyer tes vœux à un groupe","social",15],["Préparer ta tenue du réveillon","soi",10],["Pas d'écran pendant le repas du réveillon","famille",25,"xmhat"]];
const XM_RES={lect:["Lire 10 pages","soir"],sport:["10 pompes","matin"],run:["10 min de marche rapide","matin"],art:["Écrire 4 lignes de texte","soir"],ami:["Envoyer un message à un proche","soir"],reg:["Faire mon lit","matin"],zen:["Méditer 5 min","matin"],org:["Préparer mes affaires pour demain","soir"],pro:["Noter ma priorité du jour","matin"],sante:["Boire un grand verre d'eau","matin"]};
function xmY(){const d=new Date();return d.getMonth()===0?d.getFullYear()-1:d.getFullYear()}
function xmPhase(){const d=new Date(),m=d.getMonth(),dd=d.getDate();if(m===11&&dd<=26)return"noel";if(m===11||(m===0&&dd<=7))return"an";return""}
function xmS(){const G=S.g,y=xmY();if(!G.xm||G.xm.y!==y)G.xm={y,list:{},sel:0,ss:{},adv:{},cu:{},boss:{},wish:{},res:null,recap:0};const X=G.xm;["list","ss","adv","cu","boss","wish"].forEach(k=>{if(!X[k]||typeof X[k]!=="object")X[k]={}});return X}
function xmDec(){const d=new Date();return d.getMonth()===11?d.getDate():0}
function xmLeft(){const d=new Date();d.setHours(0,0,0,0);return Math.round((new Date(d.getFullYear(),11,24)-d)/864e5)}
function xmCanGive(){const d=new Date();return(d.getMonth()===11&&d.getDate()>=24)||(d.getMonth()===0&&d.getDate()<=7)}
function xmHist(ti,tx,ic){if(!Array.isArray(S.g.xmh))S.g.xmh=[];S.g.xmh.push({t:Date.now(),ti,tx,ic});S.g.xmh=S.g.xmh.slice(-60)}
function xmGroups(){const L=[{id:"@fam",n:"Famille",c:"var(--c-famille)",m:S.family.slice()}];fgList().forEach(g=>{const m=fgMembers(g.id);if(m.length)L.push({id:g.id,n:g.n,c:g.c||"#9b5de5",m})});return L}
function xmDmg(){const X=xmS();let d=0;Object.values(X.list).forEach(f=>{if(f.s>=1)d+=3;if(f.s>=2)d+=5;if(f.s>=3)d+=3});Object.values(X.adv).forEach(a=>{if(a&&a.d)d+=5});return Math.min(XM_HP,d)}
function xmBossCheck(){const X=xmS();if(X.boss.dead||xmPhase()!=="noel"||xmDec()>25)return;if(xmDmg()<XM_HP)return;X.boss.dead=Date.now();const G=S.g;if(!G.gear.includes("fig_bougon"))G.gear.push("fig_bougon");G.chests=(G.chests||0)+1;
  const prev=levelInfo(S.xp).l;addBonus("Bougonnoël vaincu",50,0,"xmb");xmHist("Bougonnoël vaincu","Il a retrouvé le sourire. Figurine gagnée.","star");save();setTimeout(()=>{render(prev);sfx("level");toast(`Bougonnoël est vaincu ! <span class="p">+50 XP</span>, un coffre et sa figurine`)},400)}
function xmStep(name,ev,btn){const X=xmS(),f=X.list[name];if(!f||f.s>=4)return;if(f.s===3&&!xmCanGive()){sfx("error");toast("Les cadeaux s'offrent à partir du 24 décembre");return}
  const k=f.s,xp=XM_XP[k];f.s++;const prev=levelInfo(S.xp).l;addBonus(["Idée cadeau","Cadeau acheté","Cadeau emballé","Cadeau offert"][k]+" pour "+name,xp,0,"xm");if(btn&&ev)floatXp(xp,ev,btn);
  if(f.s===4){xmHist("Cadeau offert",name,"gift");xmGiveFx(name)}else sfx(k===1?"open":"coin");xmBossCheck();save();render(prev)}
function xmGiveFx(name){sfx("level");const o=document.createElement("div");o.className="bpop xmgive";o.innerHTML=`<div class="bpc xmgc"><div class="xmgb">${pxImg("gift",8)}</div><h3>Offert à <span></span></h3><p class="hint">Le plus beau, c'est sa tête quand il ou elle l'ouvre.</p><button type="button" class="btn primary">Continuer</button></div>`;o.querySelector("h3 span").textContent=name;document.body.appendChild(o);
  const close=()=>o.remove();o.querySelector(".primary").onclick=close;o.onclick=e=>{if(e.target===o)close()}}
function xmSheet(cls){const o=document.createElement("div");o.className="bpop rapop "+cls;o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);return o}
// --- la hotte
function xmHotte(pick,focus){const X=xmS(),o=xmSheet("xmpop");let sel=null,edit=focus||"";const close=()=>{o.remove();render()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const names=relNames(),L=Object.keys(X.list),picking=pick||!X.sel;
    if(picking){if(!sel)sel=new Set(L);const GR=xmGroups();
      o.innerHTML=`<div class="bpc rap xmrap"><div class="raph"><h3>Noël arrive</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
      <p class="xmlead">À qui veux-tu offrir un cadeau cette année ?</p>
      <h4>Par groupe</h4><div class="xmchips">${GR.map((g,i)=>{const all=g.m.every(n=>sel.has(n));return`<button type="button" class="xmch grp${all?" on":""}" data-g="${i}" style="--gc:${g.c}"><b></b><small>${g.m.length}</small></button>`}).join("")}</div>
      <h4>Une par une</h4><div class="xmchips">${names.map((n,i)=>`<button type="button" class="xmch${sel.has(n)?" on":""}" data-n="${i}">${pAv(n,"xmav")}<b></b></button>`).join("")}</div>
      <button type="button" class="btn primary xmok"${sel.size?"":" disabled"}>${sel.size?`Valider ma liste · ${sel.size} cadeau${sel.size>1?"x":""}`:"Choisis au moins une personne"}</button></div>`;
      o.querySelectorAll(".xmch.grp").forEach(b=>{const g=GR[+b.dataset.g];b.querySelector("b").textContent=g.n;b.onclick=()=>{const all=g.m.every(n=>sel.has(n));g.m.forEach(n=>all?sel.delete(n):sel.add(n));sfx("blip");draw()}});
      o.querySelectorAll(".xmch[data-n]").forEach(b=>{const n=names[+b.dataset.n];b.querySelector("b").textContent=n;b.onclick=()=>{sel.has(n)?sel.delete(n):sel.add(n);sfx("blip");draw()}});
      o.querySelector(".xmok").onclick=()=>{if(!sel.size)return;const first=!X.sel;sel.forEach(n=>{if(!X.list[n])X.list[n]={s:0}});Object.keys(X.list).forEach(n=>{if(!sel.has(n)&&X.list[n].s===0&&!X.list[n].sec)delete X.list[n]});X.sel=1;pick=false;
        if(first){const prev=levelInfo(S.xp).l;addBonus("Liste de Noël",10,0,"xm");xmHist("Liste de Noël",sel.size+" personnes dans ta hotte","gift");save();render(prev);sfx("badge")}else save();draw()};
    }else{const F=L.map(n=>[n,X.list[n]]).sort((a,b)=>a[1].s-b[1].s||a[0].localeCompare(b[0])),ready=F.filter(([,f])=>f.s>=3).length,left=xmLeft(),bud=F.reduce((a,[,f])=>a+(+f.b||0),0),GR=xmGroups().filter(g=>g.m.length>=3);
      o.innerHTML=`<div class="bpc rap xmrap"><div class="raph"><h3>Ma hotte</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
      <div class="xmhead"><span class="xmhi">${pxImg("gift",4)}</span><span><b>${ready} cadeau${ready>1?"x":""} sur ${F.length} prêt${ready>1?"s":""}</b><small>${xmDec()&&left>0?`Noël dans ${left} jour${left>1?"s":""}`:xmCanGive()?"C'est le moment d'offrir":""}${bud?` · budget ${bud} €`:""}</small></span></div>
      <div class="xmbar"><i style="width:${F.length?Math.round(ready/F.length*100):0}%"></i></div>
      <ul class="xmlist">${F.map(([n,f],i)=>{const nx=f.s<4?XM_ST[f.s]:"";return`<li class="xmf s${f.s}${edit===n?" ed":""}" data-i="${i}"><div class="xmfr">${pAv(n,"xmav")}<span class="xmfn"><b></b>${f.sec?`<em class="tg">secret</em>`:""}<small class="xmid"></small></span>${f.s<4?`<button type="button" class="btn${f.s===3&&!xmCanGive()?"":" primary"} xmgo" >${f.s===0?"Idée":f.s===3?(xmCanGive()?"Offert":"Le 24"):nx}<em>+${XM_XP[f.s]}</em></button>`:`<span class="evok">${ICO("check",16)} Offert</span>`}</div>
        <ol class="xmst">${XM_ST.map((l,k)=>`<li class="${k<f.s?"ok":""}">${l}</li>`).join("")}</ol>
        ${edit===n?`<div class="xmed"><label class="rdl">Idée<input class="xmi" maxlength="60" placeholder="Ex. un vinyle, une écharpe"></label><label class="rdl xmbl">Budget<input class="xmb" type="number" inputmode="decimal" min="0" placeholder="€"></label><button type="button" class="btn primary xmsv">Enregistrer</button></div>`:""}</li>`}).join("")}</ul>
      ${GR.length?`<h4>Père Noël secret</h4><div class="xmss">${GR.map((g,i)=>{const d=X.ss[g.id];return`<div class="xmsg" style="--gc:${g.c}"><b></b>${d?`<button type="button" class="xmrev${d.rev?" on":""}" data-g="${i}">${d.rev?`Tu offres à <span></span>`:"Appuie pour voir à qui tu offres"}</button>`:`<button type="button" class="btn xmdraw" data-g="${i}">Tirer au sort</button>`}</div>`}).join("")}</div>`:""}
      <button type="button" class="btn xmpick">Modifier ma liste</button></div>`;
      o.querySelectorAll(".xmf").forEach(li=>{const[n,f]=F[+li.dataset.i];li.querySelector(".xmfn b").textContent=n;li.querySelector(".xmid").textContent=f.i?f.i+(f.b?" · "+f.b+" €":""):"Pas encore d'idée";
        li.querySelector(".xmfn").onclick=()=>{edit=edit===n?"":n;draw()};
        const go=li.querySelector(".xmgo");if(go)go.onclick=ev=>{if(f.s===0){edit=n;draw();return}xmStep(n,ev,go);draw()};
        const sv=li.querySelector(".xmsv");if(sv){const ii=li.querySelector(".xmi"),bi=li.querySelector(".xmb");ii.value=f.i||"";bi.value=f.b||"";setTimeout(()=>ii.focus(),50);
          sv.onclick=ev=>{const v=ii.value.trim();f.b=Math.max(0,+bi.value||0)||undefined;if(v){f.i=v;if(f.s===0)xmStep(n,ev,sv)}edit="";save();draw()}}});
      o.querySelectorAll(".xmsg").forEach((d,i)=>{d.querySelector("b").textContent=GR[i].n});
      o.querySelectorAll(".xmdraw").forEach(b=>b.onclick=()=>{const g=GR[+b.dataset.g],taken=new Set(Object.values(X.ss).map(x=>x.to)),pool=g.m.filter(n=>!taken.has(n));if(!pool.length){toast("Tout le monde a déjà été tiré");return}
        const to=pool[Math.floor(Math.random()*pool.length)];X.ss[g.id]={to,rev:0};if(!X.list[to])X.list[to]={s:0,sec:g.id};else X.list[to].sec=g.id;sfx("shake");save();draw()});
      o.querySelectorAll(".xmrev").forEach(b=>{const g=GR[+b.dataset.g],d=X.ss[g.id];const sp=b.querySelector("span");if(sp)sp.textContent=d.to;b.onclick=()=>{d.rev=d.rev?0:1;if(d.rev)sfx("badge");save();draw()}});
      o.querySelector(".xmpick").onclick=()=>{pick=true;sel=null;draw()}}
    o.querySelector(".raclose").onclick=close};
  draw();if(focus)setTimeout(()=>{const e=o.querySelector(".xmf.ed");if(e)e.scrollIntoView({block:"center"})},80)}
// --- calendrier de l'Avent
function xmWeek(){return dayKey(mondayOf(Date.now()))}
function xmAdvOpen(d){const X=xmS(),today=xmDec();if(X.adv[d]||d>today||d>24)return false;if(d<today){const wk=xmWeek();if(X.cu[wk])return false;X.cu[wk]=d}X.adv[d]={o:Date.now()};sfx("open",1);save();return true}
function xmAdvDone(d,btn,ev){const X=xmS(),a=X.adv[d];if(!a||a.d)return;const[q,cat,xp,it]=XM_ADV[d-1];a.d=Date.now();const G=S.g;let msg="";
  if(it&&!G.gear.includes(it)){G.gear.push(it);const g=GEAR.find(x=>x.id===it);msg=g?` · nouvel objet : <span class="p">${esc(g.n)}</span>`:""}
  complete({id:"xmadv",cat,name:"Avent, case "+d+" : "+q,xp},btn,ev);xmBossCheck();save();if(msg)setTimeout(()=>toast(`Case ${d} réussie${msg}`),900)}
function xmAdvent(){const X=xmS(),o=xmSheet("xmpop xmadvpop");let sel=0;const close=()=>{o.remove();render()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{const today=xmDec(),wkUsed=!!X.cu[xmWeek()];
    o.innerHTML=`<div class="bpc rap xmrap"><div class="raph"><h3>Calendrier de l'Avent</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
    <p class="xmlead">Une case par jour jusqu'au 24. ${wkUsed?"Rattrapage de la semaine déjà utilisé.":"Tu peux rattraper une case oubliée par semaine."}</p>
    <div class="xmcal">${Array.from({length:24},(_,i)=>{const d=i+1,a=X.adv[d],it=XM_ADV[i][3],st=a?(a.d?"done":"open"):d===today?"today":d<today?(wkUsed?"miss":"catch"):"lock";return`<button type="button" class="xmdoor ${st}${sel===d?" sel":""}${it?" it":""}" data-d="${d}" aria-label="Case ${d}"><b>${d}</b>${a&&a.d?pxImg("check",2):a?pxImg("star",2):it&&st!=="lock"?pxImg("gift",2):""}</button>`}).join("")}</div>
    ${sel?(()=>{const[q,,xp,it]=XM_ADV[sel-1],a=X.adv[sel],g=it&&GEAR.find(x=>x.id===it);return`<div class="xmdd"><small>Case ${sel}</small><b>${esc(q)}</b><span>+${xp} XP${g?` · ${esc(g.n)}`:""}</span>${a&&!a.d?`<button type="button" class="btn primary xmdone">C'est fait</button>`:a&&a.d?`<em>${ICO("check",14)} Réussie</em>`:""}</div>`})():""}</div>`;
    o.querySelectorAll(".xmdoor").forEach(b=>b.onclick=()=>{const d=+b.dataset.d;if(b.classList.contains("lock")){sfx("error");toast("Patience, cette case s'ouvre le "+d+" décembre");return}if(b.classList.contains("miss")){sfx("error");toast("Tu as déjà rattrapé une case cette semaine");return}
      if(!X.adv[d])xmAdvOpen(d);sel=d;draw()});
    const dn=o.querySelector(".xmdone");if(dn)dn.onclick=ev=>{xmAdvDone(sel,dn,ev);draw()};
    o.querySelector(".raclose").onclick=close};
  draw()}
// --- vœux
function xmWish(kind){const X=xmS(),o=xmSheet("xmpop");const GR=xmGroups();let gi=0;const sent=new Set();const close=()=>{o.remove();render()};o.onclick=e=>{if(e.target===o)close()};
  const msg=n=>kind==="an"?`Bonne année ${n} ! Que ${X.y+1} te ressemble.`:`Joyeux Noël ${n} ! Plein de belles choses pour toi.`;
  const draw=()=>{const g=GR[gi];o.innerHTML=`<div class="bpc rap xmrap"><div class="raph"><h3>${kind==="an"?"Souhaiter la bonne année":"Souhaiter un joyeux Noël"}</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
    <div class="xmchips">${GR.map((x,i)=>`<button type="button" class="xmch grp${i===gi?" on":""}" data-g="${i}" style="--gc:${x.c}"><b></b><small>${x.m.length}</small></button>`).join("")}</div>
    <ul class="xmwl">${g.m.map((n,i)=>{const P=S.profiles[n]||{},tel=(P.phone||P.tel||"").replace(/[^\d+]/g,"");return`<li class="${sent.has(n)?"on":""}">${pAv(n,"xmav")}<b data-i="${i}"></b><a class="btn${sent.has(n)?"":" primary"} xmsend" data-i="${i}" href="sms:${tel}&body=${encodeURIComponent(msg(n))}" target="_blank" rel="noopener">${sent.has(n)?ICO("check",16):ICO("chat",16)}</a></li>`}).join("")}</ul>
    <button type="button" class="btn primary xmok"${sent.size?"":" disabled"}>${sent.size?`Terminé · +${5+5*sent.size} XP`:"Envoie au moins un message"}</button></div>`;
    o.querySelectorAll(".xmch").forEach(b=>{b.querySelector("b").textContent=GR[+b.dataset.g].n;b.onclick=()=>{gi=+b.dataset.g;draw()}});
    o.querySelectorAll(".xmwl b").forEach(b=>b.textContent=g.m[+b.dataset.i]);
    o.querySelectorAll(".xmsend").forEach(a=>a.onclick=()=>{sent.add(g.m[+a.dataset.i]);setTimeout(draw,300)});
    o.querySelector(".xmok").onclick=ev=>{if(!sent.size)return;const k=kind+X.y;X.wish[k]=Date.now();const xp=5+5*sent.size;complete({id:"xmwish",cat:kind==="an"?"famille":"social",name:(kind==="an"?"Vœux de bonne année":"Vœux de Noël")+" · "+sent.size+" personne"+(sent.size>1?"s":""),xp},ev.currentTarget,ev);o.remove();xmBossCheck()};
    o.querySelector(".raclose").onclick=close};
  draw()}
// --- ton année
function xmYearData(){const y=String(xmY()),G=S.g,H=Object.entries(G.hist||{}).filter(([k])=>k.startsWith(y));const xp=H.reduce((a,[,h])=>a+(h.x||0),0),days=H.filter(([,h])=>h.x>0).length;
  const best=H.reduce((b,d)=>!b||d[1].x>b[1].x?d:b,null);const cat={};H.forEach(([,h])=>Object.entries(h.c||{}).forEach(([c,v])=>cat[c]=(cat[c]||0)+v));const top=Object.entries(cat).sort((a,b)=>b[1]-a[1])[0];
  const books=(G.books||[]).filter(b=>new Date(b.d).getFullYear()==y).length,sons=Object.entries(G.rel||{}).filter(([ym,r])=>ym.startsWith(y)&&r&&r.t).length;
  const bonds=Object.entries(S.bonds||{}).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n])=>n);
  const steps=idState().log.filter(l=>new Date(l.t).getFullYear()==y).length,anc=(G.ancL||[]).filter(a=>new Date(a.t).getFullYear()==y).length,bad=Object.values(S.badges||{}).filter(t=>typeof t==="number"&&new Date(t).getFullYear()==y).length;
  return{y,xp,days,best,top,books,sons,bonds,steps,anc,bad}}
function xmRecap(){const X=xmS(),D=xmYearData();const fmtD=k=>{const[yy,mm,dd]=k.split("-").map(Number);return dd+" "+MOIS[mm-1]};
  const sl=[{k:"Ton année "+D.y,big:"",tx:`${esc(S.name||"")}${S.name?", v":"V"}oici ce que tu as construit cette année.`,av:1},
    {k:"Expérience gagnée",n:D.xp,u:"XP",tx:`sur ${D.days} jour${D.days>1?"s":""} actif${D.days>1?"s":""}`},
    D.best?{k:"Ton plus grand jour",big:fmtD(D.best[0]),tx:`${D.best[1].x} XP en une journée`}:null,
    D.top&&CATS[D.top[0]]?{k:"Ta force de l'année",big:CATS[D.top[0]].label,tx:`${D.top[1]} XP dans cette catégorie`}:null,
    D.books?{k:"Lecture",n:D.books,u:"livre"+(D.books>1?"s":""),tx:"finis cette année",ic:"book"}:null,
    D.sons?{k:"Musique",n:D.sons,u:"son"+(D.sons>1?"s":""),tx:"sortis cette année",ic:"star"}:null,
    D.bonds.length?{k:"Les gens de ton année",ppl:D.bonds,tx:"Ceux avec qui tu as passé le plus de temps"}:null,
    {k:"Ton chemin",n:D.steps+D.anc,u:"étape"+(D.steps+D.anc>1?"s":""),tx:`${D.anc} rituel${D.anc>1?"s":""} ancré${D.anc>1?"s":""} · ${D.bad} badge${D.bad>1?"s":""} gagné${D.bad>1?"s":""}`,ic:"flame"},
    {k:"Et maintenant",big:String(+D.y+1),tx:"Qu'est-ce que tu veux devenir cette année ?",end:1}].filter(Boolean);
  let i=0;const o=document.createElement("div");o.className="bpop xrpop";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");document.body.appendChild(o);
  if(!X.recap){X.recap=1;const prev=levelInfo(S.xp).l;addBonus("Ton année "+D.y,20,0,"xm");save();setTimeout(()=>render(prev),200)}
  const close=()=>{o.remove();render()};
  const draw=()=>{const s0=sl[i];let av="";if(s0.av){try{av=`<img class="xrav" src="${myAvatarURL()}" alt="">`}catch(e){}}
    o.innerHTML=`<div class="xrc"><div class="xrbar">${sl.map((_,j)=>`<i class="${j<=i?"on":""}"></i>`).join("")}</div><button type="button" class="xrx" aria-label="Fermer">${ICO("close",18)}</button>
    <div class="xrs">${av}${s0.ic?pxImg(s0.ic,6):""}<small>${esc(s0.k)}</small>${s0.n!=null?`<b class="xrn" data-n="${s0.n}">0</b><em>${esc(s0.u)}</em>`:s0.big?`<b class="xrbig">${esc(s0.big)}</b>`:""}${s0.ppl?`<div class="xrppl">${s0.ppl.map(n=>`<span>${pAv(n,"xmav big")}<i>${esc(n)}</i></span>`).join("")}</div>`:""}<p>${s0.tx}</p>
    ${s0.end?`${xmPhase()==="an"&&new Date().getMonth()===0||xmDec()>=31?`<button type="button" class="btn primary xrres">Choisir mes résolutions</button>`:`<p class="hint">Tes résolutions s'ouvrent le 31 décembre.</p>`}<button type="button" class="btn xrend">Fermer</button>`:`<p class="hint xrtap">Touche pour continuer</p>`}</div></div>`;
    const nEl=o.querySelector(".xrn");if(nEl){const N=+nEl.dataset.n,t0=performance.now();const tick=t=>{const k=Math.min(1,(t-t0)/900);nEl.textContent=Math.round(N*(1-Math.pow(1-k,3))).toLocaleString("fr-FR");if(k<1&&o.isConnected)requestAnimationFrame(tick)};requestAnimationFrame(tick)}
    sfx(i===sl.length-1?"level":"blip");
    o.querySelector(".xrx").onclick=e=>{e.stopPropagation();close()};const en=o.querySelector(".xrend");if(en)en.onclick=e=>{e.stopPropagation();close()};
    const rs=o.querySelector(".xrres");if(rs)rs.onclick=e=>{e.stopPropagation();o.remove();xmResolutions()}};
  o.onclick=()=>{if(i<sl.length-1){i++;draw()}};draw()}
// --- résolutions
function xmResolutions(){const X=xmS(),o=xmSheet("xmpop");const ch=new Set((X.res&&X.res.ids)||[]),rit=new Set(Object.keys(XM_RES));let txt=(X.res&&X.res.txt)||"";const close=()=>{o.remove();render()};o.onclick=e=>{if(e.target===o)close()};
  const draw=()=>{o.innerHTML=`<div class="bpc rap xmrap"><div class="raph"><h3>Mes résolutions ${X.y+1}</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
    <p class="xmlead">Choisis 1 à 3 intentions. Chacune devient une identité à suivre et un petit rituel, plutôt qu'une promesse en l'air.</p>
    <div class="idlist">${IDS.map(I=>{const on=ch.has(I.id),R0=XM_RES[I.id];return`<div class="idopt xmro${on?" on":""}" style="--ic:${I.c}"><button type="button" class="xmrb" data-id="${I.id}"><span class="idi">${pxImg(I.ic,3)}</span><span class="idt"><b>${esc(I.n)}</b><small>${esc(I.d)}</small></span></button>${on&&R0?`<label class="xmrr"><input type="checkbox" data-r="${I.id}"${rit.has(I.id)?" checked":""}> Rituel : ${esc(R0[0])} (${R0[1]})</label>`:""}</div>`}).join("")}</div>
    <label class="rdl">Ma phrase pour ${X.y+1} (facultatif)<input class="xmrt" maxlength="80" placeholder="Ex. Finir ce que je commence"></label>
    <button type="button" class="btn primary xmok"${ch.size?"":" disabled"}>${ch.size?"Valider mes résolutions":"Choisis au moins une intention"}</button></div>`;
    const ti=o.querySelector(".xmrt");ti.value=txt;ti.oninput=()=>{txt=ti.value};
    o.querySelectorAll(".xmrb").forEach(b=>b.onclick=()=>{const id=b.dataset.id;if(ch.has(id))ch.delete(id);else{if(ch.size>=3){sfx("error");toast("3 intentions maximum : mieux vaut peu et tenu");return}ch.add(id)}sfx("blip");draw()});
    o.querySelectorAll("[data-r]").forEach(c=>c.onchange=()=>{c.checked?rit.add(c.dataset.r):rit.delete(c.dataset.r)});
    o.querySelector(".xmok").onclick=()=>{if(!ch.size)return;const first=!X.res,ids=[...ch],T=idState();T.ch=ids.slice(0,3);let nr=0;
      ids.forEach(id=>{const R0=XM_RES[id];if(R0&&rit.has(id)&&!ritTasks().some(t=>t.name.toLowerCase()===R0[0].toLowerCase())){ritAdd(R0[0],R0[1],1);nr++}});
      X.res={ids,txt:txt.trim(),t:Date.now()};if(first){const prev=levelInfo(S.xp).l;addBonus("Résolutions "+(X.y+1),20,0,"xm");xmHist("Résolutions "+(X.y+1),txt.trim()||ids.map(id=>idOf(id).n).join(", "),"star");save();render(prev);sfx("level")}else{save();render()}
      o.remove();toast(`Tes intentions sont posées${nr?` · ${nr} rituel${nr>1?"s":""} ajouté${nr>1?"s":""}`:""}`)};
    o.querySelector(".raclose").onclick=close};
  draw()}
// --- la carte de saison
function xmQuests(){const X=xmS(),Q=[],d=xmDec(),m=new Date().getMonth(),dd=new Date().getDate(),ph=xmPhase(),L=Object.entries(X.list);
  if(ph==="noel"&&!X.sel)Q.push({lab:"Noël",n:"Noël arrive : à qui veux-tu offrir ?",xp:10,go:"Choisir",fn:()=>xmHotte(true)});
  if(d&&d<=24){const a=X.adv[d];if(!a)Q.push({lab:"Avent · case "+d,n:"Ouvre la case du jour",go:"Ouvrir",fn:()=>{xmAdvOpen(d);xmAdvent()}});else if(!a.d){const q=XM_ADV[d-1];Q.push({lab:"Avent · case "+d,n:q[0],xp:q[2],go:"+"+q[2],fn:(b,ev)=>xmAdvDone(d,b,ev),it:q[3]})}}
  if(xmCanGive()&&L.some(([,f])=>f.s>=2&&f.s<4))Q.push({lab:"Noël",n:"Offrir les cadeaux",go:"Ouvrir",fn:()=>xmHotte()});
  if(m===11&&(dd===24||dd===25)&&!X.wish["noel"+X.y])Q.push({lab:"Vœux",n:"Souhaiter un joyeux Noël à un groupe",go:"Écrire",fn:()=>xmWish("noel")});
  if(m===0&&dd<=2&&!X.wish["an"+X.y])Q.push({lab:"Vœux",n:"Souhaiter la bonne année à tes proches",go:"Écrire",fn:()=>xmWish("an")});
  if(ph==="noel"&&X.sel&&d<24){const L0=L.filter(([,f])=>f.s===0).map(([n])=>n),L1=L.filter(([,f])=>f.s===1).map(([n])=>n),L2=L.filter(([,f])=>f.s===2).map(([n])=>n),left=xmLeft();
    if(L0.length)Q.push({lab:"Hotte",n:left<=7&&L0.length>1?`Plus que ${left} jours : ${L0.length} cadeaux sans idée`:"Trouver une idée pour "+L0[0],xp:5,go:"+5",fn:()=>xmHotte(false,L0[0])});
    else if(L1.length&&d>=3)Q.push({lab:"Hotte",n:"Acheter le cadeau de "+L1[0],xp:10,go:"Ouvrir",fn:()=>xmHotte()});
    else if(L2.length)Q.push({lab:"Hotte",n:`Emballer ${L2.length>1?L2.length+" cadeaux":"le cadeau de "+L2[0]}`,xp:5*L2.length,go:"Ouvrir",fn:()=>xmHotte()})}
  return Q.slice(0,4)}
function xmBgGrant(){const d=new Date(),m=d.getMonth(),dd=d.getDate(),G=S.g;const give=(id,msg)=>{if(G.gear.includes(id))return;G.gear.push(id);save();setTimeout(()=>{sfx("badge");toast(msg)},1200)};
  if(m===11&&dd>=24&&dd<=26)give("bgxmas",`Cadeau de Noël : le fond <span class="p">Nuit de Noël</span> est à toi`);
  if((m===11&&dd===31)||(m===0&&dd<=2))give("bgnewyear",`Bonne année : le fond <span class="p">Feu d'artifice</span> est à toi`)}
function renderXm(){const box=$("xmBox");if(!box||!S.g)return;const ph=xmPhase();box.classList.toggle("voff",!ph);if(!ph){box.innerHTML="";return}const X=xmS();xmBossCheck();xmBgGrant();
  const L=Object.values(X.list),ready=L.filter(f=>f.s>=3).length,d=xmDec(),left=xmLeft(),Q=xmQuests();let h="";
  if(ph==="noel"){const dmg=xmDmg(),hp=XM_HP-dmg,opened=Object.keys(X.adv).length;
    h=`<div class="xmc"><div class="xmt"><span>${pxImg("tree",3)}</span><span><small>Saison des fêtes</small><b>${d<24?`Noël dans ${left} jour${left>1?"s":""}`:d===24?"C'est le réveillon":"Joyeux Noël"}</b></span>${pxImg("snow",3,"xmsn")}</div>
    <div class="xmtiles"><button type="button" class="xmtile" id="xmHot">${pxImg("gift",4)}<span><b>Ma hotte</b><small>${X.sel?`${ready}/${L.length} prêts`:"À préparer"}</small></span></button>
    <button type="button" class="xmtile" id="xmAdvB">${pxImg("star",3)}<span><b>Avent</b><small>${d<=24?(X.adv[d]?`${opened}/24 ouvertes`:`Case ${d} à ouvrir`):`${opened}/24 ouvertes`}</small></span></button></div>
    <div class="xmboss${X.boss.dead?" dead":""}"><span class="xmbs">${spriteSvg("bougon","#3f8f5a",3)}</span><span class="xmbt"><b>Bougonnoël</b><small>${X.boss.dead?"Vaincu. Il a retrouvé le sourire.":d>25?"Il est reparti bouder ailleurs.":"Chaque cadeau prêt et chaque case réussie le fait reculer."}</small><span class="xmhp"><i style="width:${X.boss.dead?0:Math.round(hp/XM_HP*100)}%"></i></span></span><em>${X.boss.dead?ICO("check",16):hp+" PV"}</em></div>`}
  else{const y=X.y,dec=d>=31||new Date().getMonth()===0;
    h=`<div class="xmc an"><div class="xmt"><span>${pxImg("star",3)}</span><span><small>Nouvelle année</small><b>${new Date().getMonth()===0?"Bonne année "+(y+1):"Plus que "+(32-d)+" jour"+(32-d>1?"s":"")+" en "+y}</b></span>${pxImg("snow",3,"xmsn")}</div>
    <div class="xmtiles"><button type="button" class="xmtile" id="xmRec">${pxImg("flame",3)}<span><b>Ton année ${y}</b><small>${X.recap?"Revoir":"Découvrir"}</small></span></button>
    <button type="button" class="xmtile${dec?"":" off"}" id="xmResB">${pxImg("star",3)}<span><b>Résolutions</b><small>${X.res?X.res.ids.map(id=>idOf(id).n).join(", "):dec?"À choisir":"Le 31 décembre"}</small></span></button></div>`}
  h+=Q.length?`<div class="xmql">${Q.map((q,i)=>`<div class="xmq"><span class="xmqt"><small>${esc(q.lab)}</small><b>${esc(q.n)}</b></span><button type="button" class="btn primary xmqgo" data-i="${i}">${esc(q.go)}</button></div>`).join("")}</div>`:"";
  box.innerHTML=h+"</div>";
  const b1=$("xmHot");if(b1)b1.onclick=()=>xmHotte(!X.sel);const b2=$("xmAdvB");if(b2)b2.onclick=()=>xmAdvent();const b3=$("xmRec");if(b3)b3.onclick=()=>xmRecap();
  const b4=$("xmResB");if(b4)b4.onclick=()=>{if(b4.classList.contains("off")){toast("Les résolutions s'ouvrent le 31 décembre");return}xmResolutions()};
  box.querySelectorAll(".xmqgo").forEach(b=>b.onclick=ev=>{const q=Q[+b.dataset.i];q.fn(b,ev)})}

