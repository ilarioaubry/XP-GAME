"""Déplace les règles CSS qui visent des sélecteurs clés vers un fichier de zone, en gardant l'ordre de cascade.
usage: extract.py cles.txt sortie.css   (à lancer dans src/)"""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import re,sys
keys=[k.strip() for k in open(sys.argv[1]) if k.strip() and not k.startswith('#!')]
pat=re.compile('|'.join(re.escape(k)+r'(?![\w-])' for k in keys))
order=re.findall(r'@@include\((css/[^)]+)\)@@',open('index.src.html').read())
out_path=sys.argv[2]
def split_sel(sel):
    parts=[];d=0;cur=''
    for ch in sel:
        if ch in '([':d+=1
        if ch in ')]':d-=1
        if ch==',' and d==0:parts.append(cur);cur=''
        else:cur+=ch
    parts.append(cur);return parts
def split_is(x):
    """:is(a,clé,b) -> [prefix:is(a,b)suffix, prefix:is(clé)suffix] pour ne déplacer que la partie clé"""
    i=x.find(':is(')
    if i<0 or not pat.search(x):return [x]
    d=0;j=i+3
    while j<len(x):
        if x[j]=='(':d+=1
        elif x[j]==')':
            d-=1
            if d==0:break
        j+=1
    inner=split_sel(x[i+4:j]);pre,suf=x[:i],x[j+1:]
    if pat.search(pre) or pat.search(suf):return [x]
    k=[y for y in inner if pat.search(y)];o=[y for y in inner if not pat.search(y)]
    if not k or not o:return [x]
    return [pre+':is('+','.join(o)+')'+suf, pre+':is('+','.join(k)+')'+suf]
def blocks(s):
    """yield (start,end,prelude,body,is_at) top-level"""
    i=0;n=len(s)
    while i<n:
        if s.startswith('/*',i):j=s.find('*/',i)+2;yield(i,j,None,None,'comment');i=j;continue
        if s[i].isspace():i+=1;continue
        b=s.find('{',i);
        if b<0:break
        semi=s.find(';',i)
        if s[i]=='@' and 0<=semi<b:yield(i,semi+1,s[i:semi+1],None,'stmt');i=semi+1;continue
        d=0;j=b
        while j<n:
            if s[j]=='{':d+=1
            elif s[j]=='}':
                d-=1
                if d==0:break
            j+=1
        yield(i,j+1,s[i:b],s[b+1:j],'at' if s[i]=='@' else 'rule');i=j+1
moved=[];total=0
def process(s,ctx):
    global total
    out=[];last=0;mv=[]
    for (a,e,pre,body,kind) in blocks(s):
        if kind=='rule':
            sels=[];
            for x in split_sel(pre): sels+=split_is(x)
            hit=[x for x in sels if pat.search(x)];keep=[x for x in sels if not pat.search(x)]
            if hit:
                total+=1;mv.append(','.join(x.strip() for x in hit)+'{'+body+'}')
                out.append(s[last:a]);out.append((','.join(keep)+'{'+body+'}') if keep else '');last=e
        elif kind=='at' and pre.strip().startswith('@media'):
            inner,imv=process(body,ctx)
            if imv:
                out.append(s[last:a]);out.append(pre+'{'+inner+'}' if inner.strip() else '');last=e
                mv.append(pre.strip()+'{'+'\n'.join(imv)+'}')
    out.append(s[last:]);return ''.join(out),mv
for f in order:
    if f.split('/')[-1] in ('aujourdhui-haut.css','aujourdhui.css','proches.css','moi.css','fenetres.css','composants.css') or f.endswith(out_path.split('/')[-1]):continue
    s=open(f).read();ns,mv=process(s,f)
    if mv:
        moved.append('/* — depuis '+f[4:]+' — */\n'+'\n'.join(mv));open(f,'w').write(ns)
open(out_path,'w').write('\n'.join(moved)+'\n')
print('règles déplacées',total)
