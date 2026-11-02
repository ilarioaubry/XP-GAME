"""styles_diff.py <avant.json> <après.json> [n] : écarts de styles calculés entre deux relevés de styles.py"""
import json,sys,collections
A=json.load(open(sys.argv[1]));B=json.load(open(sys.argv[2]));lim=int(sys.argv[3]) if len(sys.argv)>3 else 40
n=0;miss=0;byp=collections.Counter();lines=[]
for s in A:
  a=A[s];b=B.get(s,{})
  for k in a:
    if k not in b:miss+=1;lines.append(f"{s} MANQUE {k[-120:]}");continue
    for p,v in a[k].items():
      if b[k].get(p)!=v:n+=1;byp[p]+=1;lines.append(f"{s} {k[-110:]} | {p}: {v[:60]} -> {b[k].get(p,'')[:60]}")
  for k in b:
    if k not in a:miss+=1;lines.append(f"{s} EN PLUS {k[-120:]}")
print("diffs",n,"éléments manquants/en plus",miss);print(byp.most_common(15))
for l in lines[:lim]:print(l)
