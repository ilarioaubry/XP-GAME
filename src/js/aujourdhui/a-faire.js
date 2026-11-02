// À faire (28/10) : liste du jour remplie depuis le panneau Actions (Aujourd'hui / Demain) ou en tâche libre.
// Cocher une action ouvre son parcours (durée, « Avec qui ? ») et rapporte son XP ; une tâche libre rapporte 5 XP.
// Une ligne est faite quand le journal contient l'action ce jour-là (donc aussi si elle est notée ailleurs, et « Annuler » la décoche).
// Données : S.g.todo = [{id, d: jour, c: créée le, n: nom, key?: action du panneau}]
const TODO_XP=5;
function todoL(){const G=S.g;if(!Array.isArray(G.todo))G.todo=[];return G.todo}
function todoDay(n){return dayKey(Date.now()+n*864e5)}
function todoAdd(o,day){const L=todoL();if(L.some(x=>x.d===day&&(o.key?x.key===o.key:!x.key&&x.n===o.n)))return false;L.push({id:"t"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),d:day,c:Date.now(),...o});while(L.length>200)L.shift();save();return true}
function todoItem(x){if(!x.key)return null;try{return afItems().find(it=>afKey(it)===x.key)||null}catch(e){return null}}
function todoDone(x){return(S.log||[]).some(e=>e.t>=x.c-1000&&dayKey(e.t)===x.d&&e.a===(x.key||"todo:"+x.id))}
function todoOpen(){const tk=todoDay(0);return todoL().filter(x=>x.d===tk&&!todoDone(x))}
function todoGo(x,el,ev){const it=todoItem(x);
  if(!it){complete({id:"todo:"+x.id,cat:"soi",name:x.n,xp:TODO_XP},el,ev);return}
  if(afFirst(it)==="fin"&&!afCook(it,el)){afDo(it,el,ev,0,[]);return}
  plusToggle(true);
  setTimeout(()=>{afMode="jour";window.__dayShift=0;afPick(it,el,ev)},60)}
