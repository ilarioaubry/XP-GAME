"""Supprime les sélecteurs CSS dont une classe ou un id n'existe nulle part dans le code (fonctionnalités retirées)."""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import re,glob,sys
exec(open(OUT+'extract.py').read().split("keys=[k.strip()")[0])
src=open('index.src.html').read()+''.join(open(f).read() for f in glob.glob('js/*.js'))
words=set(re.findall(r'[A-Za-z_][\w-]*',src))
dyn=set(m.group(1) for m in re.finditer(r'([A-Za-z_][\w-]*?)(?:\$\{|"\s*\+|\'\s*\+)',src))
def alive(tok):
    if tok in words:return True
    for i in range(2,len(tok)):
        if tok[:i] in dyn:return True
    return False
def clean_is(sel):
    """retire des listes :is()/:where() les options mortes ; renvoie None si une liste devient vide"""
    out='';i=0
    while True:
        m=re.search(r':(is|where)\(',sel[i:])
        if not m:out+=sel[i:];return out
        a=i+m.start();b=i+m.end();d=1;j=b
        while j<len(sel) and d:
            if sel[j]=='(':d+=1
            elif sel[j]==')':d-=1
            j+=1
        opts=[clean_is(x) for x in split_sel(sel[b:j-1])]
        opts=[x for x in opts if x is not None and not sel_dead0(x)]
        if not opts:return None
        out+=sel[i:a]+':'+m.group(1)+'('+','.join(x.strip() for x in opts)+')';i=j
def sel_dead0(sel):
    s=sel
    while True:  # :not(...) et :has(...) (même imbriqués) : on ne juge pas leur contenu
        m=re.search(r':(not|has)\(',s)
        if not m:break
        d=1;j=m.end()
        while j<len(s) and d:
            d+= (s[j]=='(')-(s[j]==')');j+=1
        s=s[:m.start()]+s[j:]
    toks=re.findall(r'[.#](-?[A-Za-z_][\w-]*)',re.sub(r'\[[^\]]*\]','',s))
    return [t for t in toks if not alive(t) and not re.fullmatch(r'_[a-z]',t)]
exec(open(OUT+'extract.py').read().split("moved=[];total=0")[0].split("def split_sel")[1].join(["def split_sel",""]) if False else "")
EX=open(OUT+'extract.py').read()
ns={};exec(EX[EX.index("def split_sel"):EX.index("def split_is")],ns);exec(EX[EX.index("def blocks"):EX.index("moved=[];total=0")],ns)
split_sel,blocks=ns['split_sel'],ns['blocks']
gone={};nrules=0;nsels=0
def proc(s):
    global nrules,nsels
    out=[];last=0
    for (a,e,pre,body,kind) in blocks(s):
        if kind=='rule':
            sels=split_sel(pre);keep=[]
            for x0 in sels:
                x=clean_is(x0)
                d=['(is vide)'] if x is None else sel_dead0(re.sub(r':(is|where)\((?:[^()]|\([^()]*\))*\)','',x))
                if d:
                    nsels+=1
                    for t in d:gone[t]=gone.get(t,0)+1
                else:keep.append(x)
            if keep!=sels:
                out.append(s[last:a]);last=e
                if keep:out.append(','.join(keep)+'{'+body+'}')
                else:nrules+=1
        elif kind=='at' and pre.strip().startswith('@media'):
            inner=proc(body)
            out.append(s[last:a]);last=e
            if re.search(r'\{',inner):out.append(pre+'{'+inner+'}')
    out.append(s[last:]);return ''.join(out)
for f in sys.argv[1:]:
    s=open(f).read();open(f,'w').write(proc(s))
print("règles supprimées",nrules,"sélecteurs supprimés",nsels)
print("classes/ids disparus (extrait):",' '.join(sorted(gone,key=lambda t:-gone[t])[:80]))
