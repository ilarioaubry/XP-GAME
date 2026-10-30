// « J'ai… » (30/10) : ce que la fiche sait de ta vie fait apparaître les actions, rituels, rappels et quêtes qui vont avec (données : donnees/vie-faits.js).
// Ajouter un fait crée ses rituels et ses rappels (marqués have:k) ; le retirer les enlève. Les familles d'actions et les quêtes n'apparaissent que si le fait est coché.
Object.assign(RKI,{
  chien:["................","..oo........oo..",".oNno......onNo.",".oNnnoooooonnNo.",".oNnnnnnnnnnnNo.","..onnnnnnnnnno..","..onwonnnnowno..","..onoonnnnoono..","..onnnnnnnnnno..","..onnnwwwwnnno..","...onwwoowwno...","...onwwwwwwno...","....onwmmwno....",".....oommoo.....","......oooo......","................"],
  chat:["................",".oo..........oo.",".oko........oko.",".okko......okko.",".okkkoooooookkko",".okkkkkkkkkkkko.",".okgokkkkkkgoko.",".okkkkkkkkkkkko.",".okkkkkmmkkkkko.","..okkkkookkkko..","..oKkkkkkkkkKo..","...oKKkkkkKKo...","....ooKKKKoo....","......oooo......","................","................"],
  poisson:["................","................",".....oooooo.....","...ooYyyyyYoo.oo","..oYyyyyyyyyYoYo",".oYyywoyyyyyyYYo",".oYyyooyyyyyyYYo",".oYyyyyyyyyyyYYo","..oYyyyyyyyyYoYo","...ooYYYYYYoo.oo",".....oooooo.....","................","................","................","................","................"]});
const haveL=()=>{const s=typeof sitOf==="function"?sitOf():null;return s&&Array.isArray(s.have)?s.have:[]};
const haveOn=k=>haveL().includes(k);
const haveOf=k=>HAVE.find(h=>h.k===k);
// familles d'actions, icônes et quêtes ajoutées une fois pour toutes ; elles ne s'affichent que si le fait est coché
HAVE.forEach(h=>{
  if(h.fam&&!FAM.some(f=>f.id===h.fam.id)){FAM.push({...h.fam,have:h.k});try{FIC[h.fam.id]=[h.ic,{}]}catch(e){}}
  (h.fq||[]).forEach(([id,t,cat,xp,hr,o])=>{if(!FQ.some(q=>q[0]===id))FQ.push([id,t,cat,xp,hr,()=>haveOn(h.k),()=>h.l.replace(/^(Un|Une|Des|Du|Je mange) /,"").replace(/^./,c=>c.toUpperCase()),o||{}])})});
function haveOpts(fid){const o=[];HAVE.forEach(h=>{if(h.opt&&h.opt[fid]&&haveOn(h.k))o.push(...h.opt[fid])});return o}
// cocher ou décocher un fait : ses rituels et ses rappels suivent
function haveApply(k,on){const h=haveOf(k);if(!h)return;const G=S.g,tk=dayKey(Date.now());if(!Array.isArray(G.last))G.last=[];
  if(on){(h.rit||[]).forEach(([n,w])=>{if(!S.daily.tasks.some(t=>t.name===n&&t.when===w))S.daily.tasks.push({id:"r"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:n,n:1,when:w,ct:Date.now(),have:k})});
    (h.last||[]).forEach(([n,num,u])=>{if(!G.last.some(x=>x.name===n))G.last.push({id:"l"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:n,n:num,u,d:tk,have:k})});
    const parts=[(h.rit||[]).length?"rituels":"",(h.last||[]).length?"rappels":"",h.fam||h.opt?"actions":""].filter(Boolean);if(parts.length)try{toast(esc(h.l)+" : "+parts.join(", ")+" ajoutés")}catch(e){}}
  else{S.daily.tasks=S.daily.tasks.filter(t=>t.have!==k);G.last=G.last.filter(x=>x.have!==k)}}
// rappels à rythme arrivés à échéance (pour le journal)
function lastDue(){const G=S.g,tk=dayKey(Date.now()),U={j:1,s:7,m:30};return(Array.isArray(G.last)?G.last:[]).filter(x=>{if(x.d===tk)return false;if(!x.d)return true;const n=Math.round((new Date(tk+"T12:00")-new Date(x.d+"T12:00"))/864e5);return n>=x.n*(U[x.u]||1)})}
function lastDone(id){const G=S.g,x=(G.last||[]).find(y=>y.id===id);if(!x)return;x.pv=x.d;x.d=dayKey(Date.now());save()}
