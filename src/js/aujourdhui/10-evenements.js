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
// mes dates dans le calendrier (2.7) : mon anniversaire, notre anniversaire de couple ; affichées seulement, sans XP
function myDates(){let s=null;try{s=sitOf()}catch(e){}if(!s)return[];const t=new Date();t.setHours(0,0,0,0);const y=t.getFullYear(),out=[];
  const add=(o,id,n,ic)=>{if(!o||!o.d||!o.m)return;let dt=new Date(y,o.m-1,o.d);if(dt.getMonth()!==o.m-1)return;if(dt<t)dt=new Date(y+1,o.m-1,o.d);const inD=Math.round((dt-t)/864e5);if(inD>EV_DAYS)return;
    const ans=o.y?dt.getFullYear()-o.y:0;out.push({k:"me",id,n:ans>0?n+" · "+ans+" ans":n,dt,inD,ic})};
  add(s.bd,"me:bd","Ton anniversaire","cake");if(s.cpl&&s.cpl!=="celib")add(s.cpld,"me:cpl",s.cpl==="marie"?"Anniversaire de mariage":"Anniversaire de couple","coeur");return out}
function evWhen(d){return d<0?(d===-1?"Hier":"Il y a "+(-d)+" jours"):d===0?"Aujourd'hui":d===1?"Demain":"Dans "+d+" jours"}
const EV_IC={bd:'<path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" fill="currentColor" opacity=".9"/><path d="M4 16c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0" fill="none" stroke="var(--surface)" stroke-width="1.6"/><path d="M12 12V8" stroke="currentColor" stroke-width="2"/><path d="M12 3c1.2 1.4 1.2 2.6 0 3.6-1.2-1-1.2-2.2 0-3.6z" fill="currentColor"/>',
  ev:'<path d="M12 2l2.6 6.4L21 9l-5 4.4L17.6 20 12 16.6 6.4 20 8 13.4 3 9l6.4-.6z" fill="currentColor"/>'};



