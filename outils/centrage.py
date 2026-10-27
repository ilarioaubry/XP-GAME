"""centrage.py : vérifie que le contenu des éléments courts (boutons, tuiles, onglets, compteurs) est centré.
Règle (CLAUDE.md > Standards, « Centrage ») : l'icône seule est centrée ; icône + texte forment un groupe centré.
Pour chaque élément court visible, on mesure le bloc formé par son contenu (texte + icônes) et on le compare au centre
de l'élément. Écart > 2 px = signalé. Sortie : liste par écran, puis le total. Code de sortie 1 s'il reste des écarts.
Usage : python3 outils/centrage.py [index.html]"""
import os, sys, datetime
OUT = os.path.dirname(os.path.abspath(__file__)) + '/'
APP = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else OUT + '../index.html')
exec(open(OUT + 'shots.py').read().split("with sync_playwright")[0].replace("H,D=sys.argv[1],sys.argv[2];os.makedirs(D,exist_ok=True)", ""))
from playwright.sync_api import sync_playwright
APP = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else OUT + '../index.html')  # après shots.py, qui fixe aussi APP

MESURE = r"""()=>{
const COURT='button,[role=button],[role=tab],.rtile,.mlp,.rtmgo,.pbs,label.tg,.ui-compteur,.ui-etiquette';
const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0'};
const nm=e=>(e.classList.length||e.id?'':(e.parentElement.className?'.'+String(e.parentElement.className).split(' ')[0]+'>':''))+e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+[...e.classList].slice(0,2).map(c=>'.'+c).join('');
const out=[];
document.querySelectorAll(COURT).forEach(e=>{if(!vis(e)||e.closest('svg')||/^H[1-6]$/.test(e.tagName)||e.matches('.hmslot,.rmt>button,.evch,.pladd,.plfoods .plf'))return;   // hors règle : titres repliables et cartes titre + texte (alignés à gauche), étiquettes de la maison, curseur du rappel, barre d'XP ; « Ajouter » de l'assiette aligné sur ses voisins (en rangée, l'alignement prime)
  const t=(e.textContent||'').trim().replace(/\s+/g,' ');if(t.length>24)return;           // carte avec titre + texte : alignée à gauche, pas concernée
  if(e.querySelector(COURT))return;                                                        // conteneur d'autres boutons
  const r=e.getBoundingClientRect(),c=getComputedStyle(e);if(r.width<20||r.height<20)return;
  let L=1e9,T=1e9,R=-1e9,B=-1e9;const take=b=>{if(b.width<1||b.height<1)return;L=Math.min(L,b.left);T=Math.min(T,b.top);R=Math.max(R,b.right);B=Math.max(B,b.bottom)};
  const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
  const hors=x=>{for(let a=x;a&&a!==e;a=a.parentElement){const ps=getComputedStyle(a).position;if(ps==='absolute'||ps==='fixed')return true}return false}; // étiquettes et pastilles posées en coin : hors du groupe
  while(n=w.nextNode()){if(n.nodeType===3){if(!n.textContent.trim())continue;const p=n.parentElement;if(!vis(p)||p.closest('svg')||hors(p))continue;const g=document.createRange();g.selectNodeContents(n);[...g.getClientRects()].forEach(take)}
    else if(/^(svg|img|canvas)$/i.test(n.tagName)&&vis(n)&&!n.parentElement.closest('svg')&&!hors(n))take(n.getBoundingClientRect())}
  if(R<L)return;
  // pseudo-éléments ::before/::after décoratifs ignorés ; centre de la zone intérieure (padding compris : c'est la case visible)
  const bl=parseFloat(c.borderLeftWidth),br=parseFloat(c.borderRightWidth),bt=parseFloat(c.borderTopWidth),bb=parseFloat(c.borderBottomWidth);
  const cx=(r.left+bl+r.right-br)/2,cy=(r.top+bt+r.bottom-bb)/2,dx=Math.round((L+R)/2-cx),dy=Math.round((T+B)/2-cy);
  if(Math.abs(dx)>2||Math.abs(dy)>2)out.push(nm(e)+' «'+t.slice(0,16)+'» dx='+dx+' dy='+dy)});
// ligne de séparation doublée : une section trace sa ligne en haut, et un bloc juste dessous (≤ 40 px) en trace une autre
document.querySelectorAll('.wrap>section').forEach(s=>{if(!vis(s))return;const cs=getComputedStyle(s);if(!/repeating-linear-gradient/.test(cs.backgroundImage))return;const top=s.getBoundingClientRect().top;
  s.querySelectorAll('*').forEach(d=>{if(!vis(d))return;const c=getComputedStyle(d);if((c.borderTopStyle==='dashed'||c.borderTopStyle==='dotted')&&parseFloat(c.borderTopWidth)>0&&d.getBoundingClientRect().top-top<40)out.push('séparateur doublé : '+nm(s)+' > '+nm(d))})});
// ligne de séparation juste sous les onglets
document.querySelectorAll('.wrap>.subtabs').forEach(t=>{let x=t.nextElementSibling;while(x&&!(x.tagName==='SECTION'&&vis(x)))x=x.nextElementSibling;if(x&&/repeating-linear-gradient/.test(getComputedStyle(x).backgroundImage))out.push('ligne sous les onglets : '+nm(x))});
return out}"""

tot = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for st, T, setup in STATES[:3]:
        ctx = b.new_context(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True, timezone_id="Europe/Paris", reduced_motion="reduce")
        pg = ctx.new_page()
        t = datetime.datetime.fromisoformat(T); pg.clock.install(time=t); pg.clock.pause_at(t)
        pg.add_init_script("Math.random=(()=>{let s=42;return()=>{s=(s*16807)%2147483647;return s/2147483647}})()")
        pg.goto("file://" + APP); pg.wait_for_timeout(1500)
        pg.click(".obnext"); pg.fill(".obname", "Ilario"); pg.click(".obnext"); pg.click(".obnext")
        pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
        pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
        for n in ("Léa", "Tom"): pg.fill(".obadd input", n); pg.press(".obadd input", "Enter")
        pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
        for name, js in SCREENS + [("routine", "showView('q');rtmOpen()")]:
            try:
                pg.evaluate("()=>{" + CLOSE + ";document.querySelectorAll('.rtm').forEach(e=>e.remove())}"); pg.evaluate("()=>{" + js + "}"); pg.wait_for_timeout(350)
                for x in pg.evaluate(MESURE): tot.setdefault(x, set()).add(name)
            except Exception as e: tot.setdefault("erreur " + name + " " + str(e)[:60], set()).add(st)
        ctx.close()
    b.close()
for k in sorted(tot): print(f"{k}   [{', '.join(sorted(tot[k]))}]")
print(f"\n{len(tot)} élément(s) mal centré(s)")
sys.exit(1 if tot else 0)
