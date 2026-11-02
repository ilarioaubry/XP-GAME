// cascade.js : pour chaque élément et propriété, la règle CSS qui gagne (feuille|sélecteur#n) ; utilisé par styles.py (ANA=1)
(props)=>{
const PS=new Set(props);
const key=e=>{const p=[];let n=e;while(n&&n.nodeType===1&&n!==document.body){if(n.id&&!/^_/.test(n.id)){p.unshift('#'+n.id);break}const par=n.parentElement;const i=par?[...par.children].indexOf(n):0;p.unshift(n.tagName.toLowerCase()+(n.classList.length?'.'+[...n.classList].sort().join('.'):'')+':'+i);n=par}return p.join('>')};
function splitTop(s){const o=[];let d=0,c='';for(const ch of s){if(ch==='('||ch==='[')d++;if(ch===')'||ch===']')d--;if(ch===','&&d===0){o.push(c);c=''}else c+=ch}o.push(c);return o.map(x=>x.trim()).filter(Boolean)}
function spec(sel){let a=0,b=0,c=0;let s=sel;
  // pseudo-classes fonctionnelles
  let out='';for(let i=0;i<s.length;){const m=/^:(is|not|has|where|matches|nth-child|nth-last-child)\(/.exec(s.slice(i));
    if(m){let d=0,j=i+m[0].length-1;for(;j<s.length;j++){if(s[j]==='(')d++;else if(s[j]===')'){d--;if(d===0)break}}const inner=s.slice(i+m[0].length,j);
      if(m[1]==='where'){}else if(m[1].startsWith('nth')){b++;const of=/\bof\s+(.*)$/.exec(inner);if(of){const sp=splitTop(of[1]).map(spec).reduce((x,y)=>cmp(x,y)>=0?x:y,[0,0,0]);a+=sp[0];b+=sp[1];c+=sp[2]}}
      else{const sp=splitTop(inner).map(spec).reduce((x,y)=>cmp(x,y)>=0?x:y,[0,0,0]);a+=sp[0];b+=sp[1];c+=sp[2]}
      out+=' ';i=j+1;continue}
    out+=s[i];i++}
  s=out.replace(/\[[^\]]*\]/g,m=>{b++;return ' '});
  s=s.replace(/::[\w-]+(\([^)]*\))?/g,()=>{c++;return ' '});
  s=s.replace(/#[\w-]+/g,()=>{a++;return ' '});
  s=s.replace(/\.[\w-]+/g,()=>{b++;return ' '});
  s=s.replace(/:[\w-]+/g,m=>{if(/^:(before|after|first-line|first-letter)$/.test(m))c++;else b++;return ' '});
  s.replace(/(^|[\s>+~(])([a-zA-Z][\w-]*)/g,()=>{c++});
  return [a,b,c]}
function cmp(x,y){for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]-y[i]}return 0}
// règles dans l'ordre
const rules=[];let ord=0;
for(const st of document.querySelectorAll('style')){const sid=st.id||('anon'+ord);let R;try{R=st.sheet.cssRules}catch(e){continue}let idx=0;
  const seen={};const norm=t=>t.replace(/:not\(#_\w+\)/g,'').replace(/(^|,\s*)html(\.[\w-]+)?\s+body\s+/g,(m,a,b)=>a+(b?'html'+b+' ':'')).replace(/\s+/g,' ').trim();const walk=(L,ok)=>{for(const r of L){if(r.type===4){walk(r.cssRules,ok&&matchMedia(r.media.mediaText).matches);continue}if(r.type===12){walk(r.cssRules,ok&&CSS.supports(r.conditionText));continue}
    if(r.type!==1){continue}idx++;const nk=sid+'|'+norm(r.selectorText);seen[nk]=(seen[nk]||0)+1;if(!ok)continue;rules.push({sid,idx:nk+'#'+seen[nk],r,ord:ord++})}};walk(R,true)}
const best=new Map();const Z={};const zone=e=>e.closest('#plusSheet')?'plus':e.closest('.wrap>[data-v="q"],#afFab')?'q':e.closest('.wrap>[data-v]')?'v':(e.closest('body>.wrap')?'w':'o');// el -> {prop:[imp,spec,ord,id]}
for(const R of rules){const sel=R.r.selectorText;if(/::/.test(sel))continue;let els;try{els=document.querySelectorAll(sel)}catch(e){continue}if(!els.length)continue;{const zs=Z[R.idx]||(Z[R.idx]={});for(const e of els){zs[zone(e)]=1}}
  const parts=splitTop(sel);const st=R.r.style;const decl=[];for(let i=0;i<st.length;i++){const p=st[i];if(PS.has(p))decl.push([p,st.getPropertyPriority(p)==='important'?1:0])}if(!decl.length)continue;
  for(const e of els){if(e.closest('script,style,svg'))continue;let sp=[0,0,0];if(parts.length===1)sp=spec(parts[0]);else for(const p of parts){try{if(e.matches(p)){const q=spec(p);if(cmp(q,sp)>0)sp=q}}catch(x){}}
    let m=best.get(e);if(!m){m={};best.set(e,m)}
    for(const [p,imp] of decl){const cur=m[p];const cand=[imp,sp,R.ord,R.idx];
      if(!cur||imp>cur[0]||(imp===cur[0]&&(cmp(sp,cur[1])>0||(cmp(sp,cur[1])===0&&R.ord>cur[2]))))m[p]=cand}}}
const out={};
for(const [e,m] of best){const c=getComputedStyle(e);if(c.display==='none'&&e.parentElement&&getComputedStyle(e.parentElement).display==='none')continue;const k=key(e);const o={};for(const p in m)o[p]=m[p][3]+(m[p][0]?'!':'')+(e.style.getPropertyValue(p)?'*inline'+(e.style.getPropertyPriority(p)?'!':''):'');out[k]=o}
return {out,Z}}
