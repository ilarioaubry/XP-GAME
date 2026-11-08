#!/usr/bin/env python3
"""test_badges.py : les 72 conditions de badges de la V2 donnent le même résultat que l'ancienne version.
On fabrique plusieurs états dans l'ancienne appli (vide, moyen, riche), on lit ses badges remplis (badgeDefs().ok()),
puis la V2 relit la même sauvegarde et calcule les siens. Écarts attendus : voir V2.md (journée parfaite, jours « pause »)."""
import datetime, json, sys, pathlib
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import test_socle as T

ETATS = {
"moyen": """()=>{const G=S.g,N=Date.now();S.xp=1800;S.stats={sport:700,perso:300,social:200,famille:150,maison:100,soi:900,travail:50,nourriture:400,eau:200};
 S.days=Array.from({length:9},(_,i)=>dayKey(N-i*864e5));G.mood={};for(let i=0;i<31;i++)G.mood['2026-09-'+String(i%28+1).padStart(2,'0')+(i>27?'x':'')]=3;
 G.sleep={};for(let i=0;i<8;i++)G.sleep['2026-10-'+(10+i)]={h:7.5,bed:23,wake:6.5};G.pu={m:{'2026-11':120},rec:35};G.books=[{t:'A',d:1}];G.opened=1;G.rel={a:1,b:1,c:1};
 G.gear=GEAR.filter(x=>x.s!=='aura').slice(0,12).map(x=>x.id);S.bonds={};const f=(S.friends[0]&&(S.friends[0].n||S.friends[0]))||'Léa';S.bonds[f]=700;S.bondsLast={};S.bondsLast[f]=N-864e5;
 for(let i=0;i<12;i++)S.log.push({t:N-i*864e5,a:'x',name:i%2?'Faire un morceau au studio':'Appeler Mamie',cat:i<11?'famille':'maison',xp:10});
 G.plt={'2026-10-30':{dej:{f:['pates'],p:['tofu'],l:['salade'],w:'maison',x:{maison:1}}}};G.offs=['2026-11-01'];}""",
"riche": """()=>{const G=S.g,N=Date.now();S.xp=60000;S.stats={sport:9000,perso:9000,social:9000,famille:9000,maison:9000,soi:9000,travail:9000,nourriture:9000,eau:2000};
 S.days=Array.from({length:40},(_,i)=>dayKey(N-i*864e5));G.gear=GEAR.map(x=>x.id);G.opened=3;G.rel=Object.fromEntries(Array.from({length:12},(_,i)=>['r'+i,1]));
 G.books=Array.from({length:5},(_,i)=>({t:'L'+i,d:i}));G.pu={m:{'2026-11':600},rec:50};G.gn={rec:130};G.run={m:{'2026-11':45}};G.md={m:{'2026-11':70}};
 G.lz={on:[],xp:{a:5000,b:5000,c:5000},rw:{}};G.fgQ=6;G.rareN=3;G.secDone=1;G.perOk={x:1};G.prj=[{id:'p',n:'x',steps:[],won:true}];G.ancL=[{x:1}];
 S.bdDone={a:1};S.bonds={};S.bondsLast={};(S.friends.concat(S.family)).forEach(p=>{const n=p.n||p;S.bonds[n]=9000;S.bondsLast[n]=N-864e5});
 for(let w=0;w<5;w++)S.log.push({t:N-w*7*864e5,a:'x',name:'Nouvelles',cat:'social',xp:10,who:'Léa',rel:1});
 S.log.push({t:N-200*864e5,a:'x',name:'Nouvelles',cat:'social',xp:10,who:'Tom',rel:1},{t:N-100*864e5,a:'x',name:'Nouvelles',cat:'social',xp:10,who:'Tom',rel:1});
 G.plt={};for(let i=0;i<8;i++)G.plt['2026-10-'+(10+i)]={dej:{f:['pates'],p:['tofu'],l:['salade']},diner:{f:['riz'],p:['oeuf'],l:['carotte'],w:'fast'}};
 G.mood=Object.fromEntries(Array.from({length:35},(_,i)=>['2026-08-'+(i+1),3]));G.sleep=Object.fromEntries(Array.from({length:8},(_,i)=>['2026-10-'+(10+i),{h:8}]));
 for(let i=0;i<12;i++)S.log.push({t:N-i*864e5,a:'x',name:'Famille',cat:'famille',xp:10});for(let i=0;i<31;i++)S.log.push({t:N-i*36e5,a:'x',name:'Ménage',cat:'maison',xp:5});
 S.log.push({t:new Date(new Date().setHours(22,0,0,0)).getTime(),a:'x',name:'Tard',cat:'soi',xp:5});G.offs=['2026-10-01'];G.afLast={'af:sorties:x':1};}""",
}

def main():
    srv, url = T.serveur(); fails = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        base = T.sauvegarde_ancienne(b)
        for nom, js in ETATS.items():
            ctx = b.new_context(viewport={"width": 393, "height": 852}, timezone_id="Europe/Paris")
            pg = ctx.new_page(); pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-02T13:00:00+01:00"))
            pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>document.documentElement.classList.add('tde-off'))")
            pg.add_init_script("if(!sessionStorage.getItem('i')){sessionStorage.setItem('i','1');localStorage.setItem('carnet-quetes'," + json.dumps(base) + ")}")
            pg.goto(T.LEG.as_uri()); pg.wait_for_timeout(1200)
            pg.evaluate("window.render=()=>{}")
            ancien = pg.evaluate("(" + js + ")(),badgeDefs().filter(b=>{try{return b.ok()}catch(e){return false}}).map(b=>b.id).sort()")
            raw = pg.evaluate("JSON.stringify(snapshot())")
            ctx.close()
            ctx = b.new_context(viewport={"width": 393, "height": 852}, timezone_id="Europe/Paris"); pg = ctx.new_page()
            pg.clock.install(time=datetime.datetime.fromisoformat("2026-11-02T13:00:00+01:00"))
            errs = []; pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            pg.add_init_script("if(!sessionStorage.getItem('i')){sessionStorage.setItem('i','1');localStorage.setItem('carnet-quetes'," + json.dumps(raw) + ")}")
            pg.goto(url); pg.wait_for_selector("html[data-prete]", timeout=8000)
            nouveau = pg.evaluate("import('/src/regles/badges.js').then(m=>m.remplis().sort())")
            manque = sorted(set(ancien) - set(nouveau)); en_plus = sorted(set(nouveau) - set(ancien))
            ok = not manque and not en_plus and not errs
            print(("OK     " if ok else "ÉCHEC  ") + f"état {nom} : {len(ancien)} badges (ancien) / {len(nouveau)} (V2)" + ("" if ok else f"  manquent={manque} en plus={en_plus} erreurs={errs[:2]}"))
            if not ok: fails.append(nom)
            ctx.close()
        b.close()
    print("\n" + ("TOUT EST BON" if not fails else f"échecs : {fails}")); sys.exit(1 if fails else 0)
if __name__ == "__main__": main()
