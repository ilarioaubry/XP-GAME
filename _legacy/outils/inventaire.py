"""inventaire.py [index.html] : liste complète des quêtes et bonnes actions (titre, catégorie, XP, créneau, façon de les réaliser)
écrite entre les balises INVENTAIRE de QUETES.md. À relancer après tout ajout ou changement de quête."""
import os,datetime,json
from playwright.sync_api import sync_playwright
import sys
OUT=os.path.dirname(os.path.abspath(__file__))+'/'
APP=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else OUT+'../index.html')
DOC=OUT+'../QUETES.md'
JS=r"""(()=>{
const ctx=new Proxy({},{get:(t,k)=>k==='A'?'[artiste]':k==='who'||k==='n'?'[prénom]':k==='free'?'oui':typeof k==='string'?'['+k+']':undefined});
const T=v=>{try{return typeof v==='function'?String(v(ctx)):String(v)}catch(e){return '(titre dynamique)'}};
const W=document.createElement('canvas').getContext('2d');W.font='700 15px "Atkinson Hyperlegible", Arial, sans-serif';
const lines=(t,w)=>{const words=t.split(' ');let n=1,cur='';for(const x of words){const s=cur?cur+' '+x:x;if(W.measureText(s).width>w){n++;cur=x}else cur=s}return n};
const mode=(t,cat)=>{try{if(typeof plLinked==='function'&&plLinked({cat,t}))return 'Assiette';if(isGift(t))return 'Choix du cadeau';if(isPush(t))return 'Compteur de pompes';if(isPlank(t))return 'Minuteur gainage';if(isStretch(t))return 'Étirements guidés';if(isRun(t))return 'Course guidée';if(isMed(t))return 'Méditation guidée';if(isContact(t))return 'Contacter (appel / message)';if(isRead(t))return 'Lecture (pages)';const c=cntOf(t);if(c)return 'Compteur '+c.n;const d=durOf(t);if(d>=10)return 'Minuteur '+d+' min'}catch(e){}return 'Fait'};
const R=[];const add=(src,o)=>{o.src=src;o.t=o.t.trim();o.len=o.t.length;o.l=lines(o.t,265);o.mode=mode(o.t,o.cat);o.qui=/social|famille/.test(o.cat||'')?'Avec qui ?':'';R.push(o)};
FQ.forEach(q=>add('Quêtes pour toi',{id:q[0],t:T(q[1]),cat:q[2],xp:q[3],h:q[4]?q[4].join('–')+' h':'',cond:typeof q[5]==='function'?String(q[5]).slice(0,90):'',why:T(q[6]||'')}));
MQ.forEach(q=>add('Quêtes du moment',{id:q[0],t:q[1],cat:q[4],xp:q[3],h:q[2].join('–')+' h'}));
CLAR.forEach(q=>add('Tri (ménage numérique)',{id:q[0],t:q[2],cat:'maison',xp:q[3],why:'Tri : '+q[1]}));
SURPRISE.forEach(q=>add('Surprise du jour',{id:q[3],t:q[0],cat:q[1],xp:q[2]}));
IDQ.forEach(q=>add('Idée sortie',{id:q[5],t:q[0],cat:'social',xp:q[3],why:q[4]}));
Object.entries(GOALQ).forEach(([g,L])=>L.forEach(q=>add('Objectif « '+g+' »',{id:g,t:q[0]==='@bed'?'(se coucher à l\'heure)':q[0],cat:q[1]||'soi',xp:q[2]||0})));
EVQ.forEach(q=>add('Événement à venir',{id:q[0]+':'+q[1],t:T(q[4]).replace('[a]','[artiste]'),cat:q[5],xp:q[6],why:'J-'+q[2]+' (événement « '+q[0]+' »)'}));
XM_ADV.forEach(q=>add('Fêtes (décembre)',{id:q[3],t:q[0],cat:q[1],xp:q[2]}));
NATM.forEach((m,i)=>Array.isArray(m)?m.forEach(t=>add('Nature du mois',{id:'m'+i,t,cat:'soi',xp:10,why:MOIS1[i]||''})):typeof m==='string'?add('Nature du mois',{id:'m'+i,t:m,cat:'soi',xp:10,why:MOIS1[i]||''}):0);
LZ.forEach(z=>z.a.forEach(a=>add('Centre d\'intérêt « '+z.n+' »',{id:z.id+':'+a[0],t:z.n+' : '+a[1],cat:a[3],xp:a[2]})));
REL_ACTIONS.forEach(a=>add('Proches (fiche)',{id:a.k,t:T(a.verb),cat:'social',xp:a.xp}));
Object.entries(GROUPS).forEach(([g,G])=>add('Quêtes spéciales (groupes)',{id:g,t:G.verb+'[prénom]',cat:G.cat,xp:grpXp(g,''),why:G.hidden?'groupe masqué':''}));
CB_LIST.forEach(c=>c.steps.forEach((t,i)=>add('Projets (étapes)',{id:c.id+':'+i,t,cat:c.cat,xp:0,why:c.th+' (« '+c.n+' »)'})));
Object.entries(QC_TPL).forEach(([d,L])=>L.forEach(q=>add('Modèles « Créer »',{id:d,t:q[0],cat:q[2],xp:0,why:q[1]==='prj'?'projet':'action'})));
FAM.forEach(f=>add('Noter une action (panneau +)',{id:f.id,t:f.l+(f.o&&f.o.length?' → '+f.o.slice(0,6).join(', ')+(f.o.length>6?'…':''):''),cat:f.cat,xp:f.xp,why:f.fr?'rappel après '+f.fr[0]+' / '+f.fr[1]+' j':''}));
(S.actions||[]).forEach(a=>add('Bonnes actions (liste)',{id:a.id,t:a.name,cat:a.cat,xp:a.xp}));
COMFORT.forEach(q=>add('Réconfort (jour difficile)',{id:'c',t:q[0],cat:q[1],xp:10}));
return R})()"""
CAT={"soi":"Soi","sport":"Force","social":"Ami","famille":"Famille","maison":"Maison","travail":"Travail","perso":"Talent","nourriture":"Nourriture","eau":"Eau"}
def write(R):
    import collections
    src=[];[src.append(r["src"]) for r in R if r["src"] not in src]
    out=["<!-- INVENTAIRE (généré par outils/inventaire.py, ne pas éditer à la main) -->",""]
    out.append(f"{len(R)} éléments au total. Colonnes : titre tel qu'affiché (les [crochets] sont remplis par l'appli), catégorie (barre de stat), XP, créneau, comment on la réalise, lignes du titre sur une carte de quête (265 px).\n")
    for sname in src:
        L=[r for r in R if r["src"]==sname];out.append(f"### {sname} ({len(L)})\n")
        out.append("| Titre | Cat. | XP | Quand | Réalisation | Lignes |");out.append("|---|---|---|---|---|---|")
        for r in L:
            t=r["t"].replace("|","/");w=(" — "+r["why"].replace("|","/")) if r.get("why") else ""
            real=r["mode"]+((" + "+r["qui"]) if r["qui"] else "")
            out.append(f"| {t}{w} | {CAT.get(r['cat'],r['cat'])} | {r['xp'] or '—'} | {r.get('h') or ''} | {real} | {r['l']} |")
        out.append("")
    out.append("<!-- /INVENTAIRE -->")
    doc=open(DOC).read() if os.path.exists(DOC) else "<!-- INVENTAIRE --><!-- /INVENTAIRE -->"
    a=doc.index("<!-- INVENTAIRE");b=doc.index("<!-- /INVENTAIRE -->")+len("<!-- /INVENTAIRE -->")
    open(DOC,"w").write(doc[:a]+"\n".join(out)+doc[b:])
    print(len(R),"éléments écrits dans QUETES.md")
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={"width":393,"height":852},is_mobile=True,has_touch=True,timezone_id="Europe/Paris");pg=ctx.new_page()
    t=datetime.datetime.fromisoformat("2026-10-27T09:00:00+01:00");pg.clock.install(time=t)
    pg.goto("file://"+APP);pg.wait_for_timeout(1500)
    pg.click(".obnext"); pg.fill(".obname","Ilario"); pg.click(".obnext"); pg.click(".obnext")
    pg.click(".idopt >> nth=0"); pg.click(".obnext"); pg.wait_for_timeout(300); pg.click(".obnext")
    pg.click(".obsug [data-n=Maman]"); pg.click(".obsug [data-n=Papa]"); pg.click(".obnext")
    for n in ("Léa","Tom"): pg.fill(".obadd input",n); pg.press(".obadd input","Enter")
    pg.click(".obnext"); pg.click(".obnext"); pg.wait_for_timeout(800)
    R=pg.evaluate(JS)
    write(R)
    b.close()
