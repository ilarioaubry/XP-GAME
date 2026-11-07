"""setrule(fichier, sélecteur exact, {prop: valeur ou None pour retirer})"""
import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')

import re
def setrule(f,sel,props,must=True):
    s=open(f).read();i=s.find(sel+'{')
    if i<0:
        if must:raise SystemExit('introuvable: '+sel)
        return False
    j=s.index('}',i);body=s[i+len(sel)+1:j]
    decl=[d for d in re.split(r';(?![^(]*\))',body) if d.strip()]
    keys=[d.split(':',1)[0].strip() for d in decl]
    for p,v in props.items():
        # retire la propriété et ses formes longues (border → border-*)
        decl=[d for d in decl if not (d.split(':',1)[0].strip()==p or d.split(':',1)[0].strip().startswith(p+'-'))]
        if v is not None:decl.append(p+':'+v)
    s=s[:i]+sel+'{'+';'.join(decl)+'}'+s[j+1:];open(f,'w').write(s);return True
