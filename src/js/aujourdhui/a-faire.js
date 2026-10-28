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
  if(!document.documentElement.classList.contains("plusopen")){const b=document.querySelector("#plusBox .plusb");if(b)b.click()}
  setTimeout(()=>{afMode="jour";window.__dayShift=0;afPick(it,el,ev)},60)}
function renderTodo(){const box=document.getElementById("todoBox");if(!box||!S||!S.g)return;const tk=todoDay(0),L=todoL().filter(x=>x.d===tk);
  if(!L.length){box.innerHTML="";box.classList.add("voff");return}box.classList.remove("voff");
  const D=L.map(todoDone),n=D.filter(Boolean).length;
  box.innerHTML=`<div class="head"><h2>À faire<span class="count">${n}/${L.length}</span></h2></div><ul class="todol">${L.map((x,i)=>{const it=todoItem(x),k=it&&it.k==="fam"?uIc(it.f.id,it.opt):"etoile",xp=it?(it.k==="fam"?it.f.xp:it.a.xp):TODO_XP;
    return`<li class="todor${D[i]?" ok":""}"><button type="button" class="btn todock" aria-label="${D[i]?"Fait":"Cocher"}" title="${D[i]?"Fait":"Cocher"}" aria-pressed="${D[i]}"${D[i]?" disabled":""}>${D[i]?ICO("check",24):""}</button><span class="todoic">${RKI[k]?rkSvg(k):rkSvg("etoile")}</span><span class="todot"><b></b><small class="ui-info">${D[i]?"Fait":"+"+Math.min(30,xp)+" XP"}</small></span><button type="button" class="btn delic todox" aria-label="Retirer de la liste" title="Retirer">${ICO("trash",24)}</button></li>`}).join("")}</ul>`;
  box.querySelectorAll(".todor").forEach((r,i)=>{const x=L[i];r.querySelector(".todot b").textContent=x.n;
    r.querySelector(".todock").onclick=ev=>todoGo(x,r.querySelector(".todock"),ev);
    r.querySelector(".todox").onclick=()=>undoAfter("Retiré de la liste",()=>{S.g.todo=todoL().filter(y=>y.id!==x.id);save();renderTodo()})})}
