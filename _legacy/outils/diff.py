import os as _os
OUT=_os.path.dirname(_os.path.abspath(__file__))+'/'
APP=_os.path.abspath(OUT+'../index.html')
import sys,os
from PIL import Image,ImageChops
A,B=sys.argv[1],sys.argv[2];bad=0
for f in sorted(os.listdir(A)):
    if not f.endswith('.png'):continue
    if not os.path.exists(B+'/'+f):print(f,"MANQUE");bad+=1;continue
    a,b=Image.open(A+'/'+f).convert('RGB'),Image.open(B+'/'+f).convert('RGB')
    if a.size!=b.size:print(f,"TAILLE",a.size,b.size);bad+=1;continue
    bb=ImageChops.difference(a,b).getbbox()
    if bb:print(f,"DIFF",bb);bad+=1
print("écrans différents:",bad)
