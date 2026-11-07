"""styles.py <index.html> <out.json> : styles calculés de tous les éléments d'Aujourd'hui, Moi, Proches et de quelques fenêtres,
à plusieurs heures, avec une vraie sauvegarde (fichier texte exporté depuis Moi > Bilan > Données, chemin dans CARNET_SAVE).
ANA=1 : au lieu des styles, note pour chaque propriété la règle qui gagne (outils/cascade.js).
Sert à nettoyer le CSS sans rien changer à l'écran : comparer avant / après avec outils/styles_diff.py (0 écart attendu).
Options : STATES=07:30,2026-12-10T18:00 (heures, ou dates), SETUP="code JS joué après le chargement"."""
import os,sys,datetime,json
from playwright.sync_api import sync_playwright
data=open(os.environ["CARNET_SAVE"],encoding="utf8").read()
H,OUT=sys.argv[1],sys.argv[2]
PROPS="display position top right bottom left width height min-width min-height max-width max-height margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left border-top-width border-right-width border-bottom-width border-left-width border-top-style border-left-style border-top-color border-right-color border-bottom-color border-left-color border-top-left-radius border-bottom-right-radius background-color background-image color font-family font-size font-weight font-style line-height letter-spacing text-align text-transform text-decoration-line white-space overflow-x overflow-y opacity visibility z-index box-shadow text-shadow outline-style outline-color outline-width flex-direction flex-wrap flex-grow flex-shrink flex-basis justify-content align-items align-self align-content justify-items justify-self place-self grid-template-columns grid-template-rows grid-column-start grid-column-end grid-row-start gap row-gap column-gap order transform filter cursor pointer-events object-fit image-rendering vertical-align text-overflow -webkit-line-clamp content isolation mix-blend-mode backdrop-filter clip-path inset aspect-ratio scroll-snap-type overscroll-behavior-y touch-action user-select".split()
JS="""(props)=>{const out={};const key=e=>{const p=[];let n=e;while(n&&n.nodeType===1&&n!==document.body){if(n.id&&!/^_/.test(n.id)){p.unshift('#'+n.id);break}const par=n.parentElement;const i=par?[...par.children].indexOf(n):0;p.unshift(n.tagName.toLowerCase()+(n.classList.length?'.'+[...n.classList].sort().join('.'):'')+':'+i);n=par}return p.join('>')};
for(const e of document.querySelectorAll('body *')){if(e.closest('script,style,svg,#lootOv'))continue;const c=getComputedStyle(e);if(c.display==='none'&&!(e.parentElement&&getComputedStyle(e.parentElement).display!=='none'))continue;const o={};for(const p of props)o[p]=c.getPropertyValue(p);
 for(const ps of ['::before','::after']){const d=getComputedStyle(e,ps);if(d.content&&d.content!=='none'&&d.content!=='normal'){for(const p of ['content','display','position','width','height','background-color','background-image','color','top','left','right','bottom','border-top-width','border-top-color','opacity','transform'])o[ps+p]=d.getPropertyValue(p)}}
 const k=key(e);out[out[k]?k+'~'+Object.keys(out).length:k]=o}return out}"""
STATES=os.environ["STATES"].split(",") if os.environ.get("STATES") else ["07:30","08:30","10:00","13:00","16:00","19:30","21:30","23:50","02:00"]
SCREENS=[("q","showView('q');jdOpenDone=jdOpenMorn=jdOpenMeals=true;renderJdb()"),("plus","showView('q');plusToggle(true)"),("vie","plusToggle(false);showView('c');document.querySelector('[data-sub=vie][role=tab]').click()"),("wr","showView('c');document.querySelector('[data-sub=wr][role=tab]').click()"),("bilan","showView('c');document.querySelector('[data-sub=bilan][role=tab]').click()"),("r","showView('r')"),("p","openProfile(S.family[0])"),("assiette","showView('q');plateOpen('soir','diner')"),("meteo","document.querySelectorAll('.plo,.bpop').forEach(e=>e.remove());showView('q');wxSheet()"),("meteo2","document.querySelectorAll('.wxsh').forEach(e=>e.remove());S.g.wx={k:'1,1',n:'x'};S.g.wxc={cur:{ic:18,ph:'Pluie',tc:3,day:true,t:Date.now()},td:{d:'2026-10-28',ic:18,ph:'Pluie',max:9,min:3,p:80}};wxSheet()"),("situation","document.querySelectorAll('.wxsh').forEach(e=>e.remove());sitSheet()"),("projet","document.querySelectorAll('.sitsh').forEach(e=>e.remove());qcOpen('proj')")]
res={}
with sync_playwright() as p:
  b=p.chromium.launch()
  for st in STATES:
    ctx=b.new_context(viewport={"width":393,"height":852},is_mobile=True,has_touch=True,device_scale_factor=1,reduced_motion="reduce",timezone_id="Europe/Paris");pg=ctx.new_page()
    t=datetime.datetime.fromisoformat((st if "T" in st else "2026-10-28T"+st)+":00+01:00");pg.clock.install(time=t);pg.clock.pause_at(t)
    pg.add_init_script("Math.random=(()=>{let s=42;return()=>{s=(s*16807)%2147483647;return s/2147483647}})();if(!sessionStorage.getItem('x')){sessionStorage.setItem('x',1);localStorage.setItem('carnet-quetes',"+json.dumps(data)+")}")
    pg.goto("file://"+os.path.abspath(H));pg.wait_for_timeout(1500)
    pg.evaluate("document.querySelectorAll('button').forEach(b=>{if(/reparti/.test(b.textContent))b.click()})");pg.wait_for_timeout(300)
    if os.environ.get("SETUP"):pg.evaluate("()=>{"+os.environ["SETUP"]+"}");pg.wait_for_timeout(500)
    for name,js in SCREENS:
      if name in("vie","wr","bilan","r","p","assiette","meteo","meteo2","situation","projet") and st not in("13:00","2026-10-26T13:00"):continue
      try:pg.evaluate(js)
      except Exception as e:print(st,name,"EXC",str(e)[:120]);continue
      pg.wait_for_timeout(500);res[st+"/"+name]=pg.evaluate(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"cascade.js")).read() if os.environ.get("ANA") else JS,PROPS)
      if name=="assiette":pg.evaluate("document.querySelectorAll('.plo,.bpop').forEach(e=>e.remove())")
    ctx.close()
  b.close()
json.dump(res,open(OUT,"w"))
print("états",len(res),"éléments",sum(len(v) for v in res.values()))
