// ---- Événements : anniversaires des proches + événements perso
const EV_DAYS=30,GIFT_DAYS=30,GIFT_XP=15;
const GIFT_IC='<rect x="3" y="9" width="18" height="12" rx="2" fill="currentColor"/><rect x="2" y="7" width="20" height="4" rx="1.5" fill="currentColor" opacity=".8"/><path d="M12 7v14" stroke="var(--surface)" stroke-width="2"/><path d="M12 7c-2-4-6-4-6-1.5S10 7 12 7zm0 0c2-4 6-4 6-1.5S14 7 12 7z" fill="none" stroke="currentColor" stroke-width="1.8"/>';
function evList(){
  const t=new Date();t.setHours(0,0,0,0);const y=t.getFullYear(),out=[];const G=S.g;if(!Array.isArray(G.ev))G.ev=[];
  relNames().forEach(n=>{const bd=(S.profiles[n]||{}).bd;if(!bd||!bd.d||!bd.m)return;
    let dt=new Date(y,bd.m-1,bd.d);if(dt.getMonth()!==bd.m-1)return;let since=Math.round((t-dt)/864e5);
    if(since>2||(since>=0&&S.bdDone[n]===y)){dt=new Date(y+1,bd.m-1,bd.d);since=Math.round((t-dt)/864e5)}
    if(since>0&&S.bdDone[n]===y)return;const inD=-since;if(inD>EV_DAYS)return;
    out.push({k:"bd",id:"bd:"+n,who:n,n:"Anniversaire de "+n,dt,inD,fam:isFam(n),q:S.specials.find(q=>q.bd===n)})});
  const tk=dayKey(t);
  {const keep=G.ev.filter(e=>e.d>=tk||(e.d<tk&&!S.log.some(l=>l.evd===e.id)&&Math.round((t-new Date(e.d+"T00:00"))/864e5)<=1)),gone=G.ev.filter(e=>!keep.includes(e));if(gone.length){if(!Array.isArray(G.evArc))G.evArc=[];gone.forEach(e=>{if(!G.evArc.some(x=>x.id===e.id))G.evArc.push({id:e.id,n:e.n,d:e.d,t:e.t,a:e.a})});G.evArc=G.evArc.slice(-80)}G.ev=keep}
  G.ev.forEach(e=>{const dt=new Date(e.d+"T00:00");out.push({k:"ev",id:e.id,n:e.n,xp:e.xp,dt,inD:Math.round((dt-t)/864e5),done:S.log.some(l=>l.evd===e.id)})});
  return out.sort((a,b)=>a.inD-b.inD);
}
function evWhen(d){return d<0?(d===-1?"Hier":"Il y a "+(-d)+" jours"):d===0?"Aujourd'hui":d===1?"Demain":"Dans "+d+" jours"}
const EV_IC={bd:'<path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" fill="currentColor" opacity=".9"/><path d="M4 16c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0" fill="none" stroke="var(--surface)" stroke-width="1.6"/><path d="M12 12V8" stroke="currentColor" stroke-width="2"/><path d="M12 3c1.2 1.4 1.2 2.6 0 3.6-1.2-1-1.2-2.2 0-3.6z" fill="currentColor"/>',
  ev:'<path d="M12 2l2.6 6.4L21 9l-5 4.4L17.6 20 12 16.6 6.4 20 8 13.4 3 9l6.4-.6z" fill="currentColor"/>'};
let evOpen=null;
function renderEvents(){
  const box=$("evtList");if(!box)return;const L=evList();
  $("evtCnt").textContent=L.length;$("evtCnt").hidden=!L.length;
  box.innerHTML="";
  const evAddRect=()=>{const a=document.createElement("button");a.type="button";a.className="evch evadd";a.innerHTML=`<span class="evci"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span class="evctx"><b>Ajouter</b><small>un événement</small></span>`;a.onclick=()=>$("evtAdd").click();return a};
  if(!L.length){const fz=document.createElement("div");fz.className="evfz";fz.appendChild(evAddRect());box.appendChild(fz);box.insertAdjacentHTML("beforeend",'<p class="hint evempty vide">Aucun événement pour l\'instant.</p>');return}const MO=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
  if(evOpen&&!L.some(e=>e.id===evOpen))evOpen=null;
  {const fz=document.createElement("div");fz.className="evfz";fz.setAttribute("role","tablist");fz.setAttribute("aria-label","Prochains événements");
   L.forEach(e=>{const c=document.createElement("button");c.type="button";const gs=e.k==="bd"&&e.inD>=0&&e.inD<=GIFT_DAYS?gfState(e.who):null,gpend=gs&&!gs.given;
     c.className="evch"+(e.k==="bd"?" bdch":"")+(e.inD<=0?" now":e.inD<=7?" soon":"")+(e.done?" done":"");c.setAttribute("aria-pressed",evOpen===e.id);c.style.setProperty("--ec",e.k==="bd"?(e.fam?"var(--c-famille)":"var(--c-social)"):"var(--gold)");
     const cd=e.inD<0?"Passé":e.inD===0?"Auj.":e.inD===1?"Demain":"J-"+e.inD;
     c.innerHTML=`<span class="evci"></span><span class="evctx"><small>${e.dt.getDate()} ${MO[e.dt.getMonth()]}</small><b class="evcn"></b><em>${cd}</em></span>${gpend?`<i class="evcg" title="Cadeau à prévoir"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">${GIFT_IC}</svg></i>`:""}`;
     c.querySelector(".evcn").textContent=e.k==="bd"?e.who:e.n;
     {const ic=c.querySelector(".evci");if(e.k==="bd"){ic.classList.add("av");ic.style.setProperty("--h",`hsl(${hueOf(e.who)} 55% 50%)`);const pc=picOf(e.who);if(pc){const im=document.createElement("img");im.src=pc;im.alt="";ic.appendChild(im)}else ic.textContent=e.who[0].toUpperCase()}else ic.innerHTML=`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${EV_IC.ev}</svg>`}c.setAttribute("aria-label",e.n+", "+cd);
     c.onclick=()=>{evOpen=evOpen===e.id?null:e.id;renderEvents()};fz.appendChild(c)});
   fz.appendChild(evAddRect());box.appendChild(fz)}
  L.forEach(e=>{const r=document.createElement("div");const today=e.inD<=0;r.hidden=evOpen!==e.id;
    r.className="evr "+e.k+(today?" now":"")+(e.done?" done":"")+(e.fam?" fam":"");
    const act=e.k==="bd"?(e.q?`<button type="button" class="btn primary evgo">+${e.q.xp} XP</button>`:""):(e.done?`<span class="evok">${ICO("check",16)} Fait</span>`:today?`<button type="button" class="btn primary evgo">+${e.xp} XP</button>`:`<span class="evxp">+${e.xp} XP</span>`);
    r.style.setProperty("--ec",e.k==="bd"?(e.fam?"var(--c-famille)":"var(--c-social)"):"var(--gold)");
    const cd=e.inD<0?"Passé":e.inD===0?"Aujourd'hui !":e.inD===1?"Demain":"J-"+e.inD;
    r.innerHTML=`<span class="evd"><small>${MO[e.dt.getMonth()]}</small><b>${e.dt.getDate()}</b></span><span class="evt-t"><span class="evkind">${e.k==="bd"?(e.fam?"Anniversaire · famille":"Anniversaire · ami"):"Événement"}</span><b></b><span class="evj">${cd}</span></span><span class="evside">${e.k==="ev"?`<span class="evstar"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">${EV_IC.ev}</svg></span>`:""}</span>${act?`<span class="evact">${act}</span>`:""}${e.k==="ev"?`<button type="button" class="evx" aria-label="Supprimer l'événement">${ICO("close",14)}</button>`:""}`;
    r.querySelector(".evt-t b").textContent=e.n;
    if(e.k==="bd"){const av=document.createElement("button");av.type="button";av.className="evav";av.setAttribute("aria-label","Ouvrir le profil de "+e.who);av.style.setProperty("--h",`hsl(${hueOf(e.who)} 55% 50%)`);
      const pc=picOf(e.who);if(pc){const im=document.createElement("img");im.src=pc;im.alt="";av.appendChild(im)}else av.textContent=e.who[0].toUpperCase();
      av.onclick=ev=>{ev.stopPropagation();openProfile(e.who)};r.querySelector(".evside").appendChild(av)}
    if(e.k==="bd"&&e.inD>=0&&e.inD<=GIFT_DAYS){const gk=e.who+":"+e.dt.getFullYear(),gd=S.log.some(l=>l.gift===gk);
      const g=document.createElement("div");g.className="evq"+(gd?" done":"");
      const gs=gfState(e.who),gstp=gs.given?3:gs.bought?2:gs.idea?1:0;
      g.innerHTML=`<span class="evqi"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">${GIFT_IC}</svg></span><span class="evqn">Cadeau pour <b></b><span class="gfmini">${["Idée","Acheté","Offert"].map((l,k)=>`<i class="${k<gstp?"ok":""}">${l}</i>`).join("")}</span>${gs.idea?`<small class="evqg"></small>`:""}</span>${gstp===3?`<span class="evok">${ICO("check",16)} Offert</span>`:`<button type="button" class="btn evqgo">${gstp===0?"Idée":gstp===1?"Acheté":"Offert"}</button>`}`;
      g.querySelector("b").textContent=e.who;{const gi=g.querySelector(".evqg");if(gi)gi.textContent="Idée : "+S.profiles[e.who].gifts}
      const gb=g.querySelector(".evqgo");if(gb)gb.onclick=()=>gfOpen(null,e.who,ev=>{S.xp+=GIFT_XP;S.log.push({a:"bonus",cat:null,name:"Cadeau pour "+e.who,xp:GIFT_XP,t:Date.now(),bonus:1,gift:gk});floatXp(GIFT_XP,ev,gb);save();render();toast(`Cadeau acheté pour <span class="p">${esc(e.who)}</span> +${GIFT_XP} XP`)});
      r.appendChild(g)}
    const go=r.querySelector(".evgo");
    if(go)go.onclick=ev=>{if(e.k==="bd"){completeSpecial(e.q,go,ev);return}
      S.xp+=e.xp;S.log.push({a:"bonus",cat:null,name:e.n,xp:e.xp,t:Date.now(),bonus:1,evd:e.id});floatXp(e.xp,ev,go);save();render();toast(`Événement : <span class="p">${esc(e.n)}</span> +${e.xp} XP`)};
    const x=r.querySelector(".evx");if(x)x.onclick=()=>undoAfter("Événement supprimé",()=>{S.g.ev=S.g.ev.filter(v=>v.id!==e.id);save();render()});
    box.appendChild(r)});
}
$("evtAdd").onclick=()=>{calOpen();return;const f=$("evtForm");f.hidden=!f.hidden;$("evtAdd").setAttribute("aria-expanded",!f.hidden);if(!f.hidden){if(!$("evtDate").value)$("evtDate").value=dayKey(new Date());$("evtName").focus()}};
$("evtForm").addEventListener("submit",e=>{e.preventDefault();const n=$("evtName").value.trim(),d=$("evtDate").value;if(!n||!d)return;
  if(!Array.isArray(S.g.ev))S.g.ev=[];S.g.ev.push({id:"ev"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),n,d,xp:+$("evtXp").value||20});
  $("evtName").value="";$("evtForm").hidden=true;$("evtAdd").setAttribute("aria-expanded","false");save();render();toast("Événement ajouté")});



