// ---- Migrations des données : une réparation = une migration numérotée, appliquée une seule fois, dans l'ordre.
// S.g.ver = nombre de migrations déjà appliquées. Ne jamais modifier ni réordonner une migration existante : en ajouter une à la fin.
// Les anciens drapeaux (dst26, voc1) restent dans les données : une réparation déjà faite n'est pas refaite.
const MIG=[
  // 1 — changement d'heure du 25/10/2026 : repas notés entre 2 h et 3 h rendus à la veille
  G=>{if(G.dst26)return false;G.dst26=1;const a=Date.UTC(2026,9,25,2),b=a+36e5,A="2026-10-25",Z="2026-10-24",win=t=>t>=a&&t<b;
  const hit=(S.log||[]).filter(e=>e.a==="mb"&&win(e.t)).map(e=>e.name),mb=G.mb||{},D=G.mbd||{},P=G.plt||{};let n=0;
  ["matin","soir"].forEach(per=>{const ka=A+":"+per,kz=Z+":"+per,whole=mb[ka]&&win(mb[ka].t);
    MB[per].forEach(([k,l])=>{if(!whole&&!hit.includes(l))return;const s=D[ka];
      if(s&&s.m&&k in s.m){const t=D[kz]=D[kz]||{m:{},ex:{},w:{}};t.cr=t.cr||{};if(!(k in t.m)){t.m[k]=s.m[k];t.cr[k]=1}delete s.m[k];if(s.cr)delete s.cr[k];n++}
      if(P[A]&&P[A][k]){(P[Z]=P[Z]||{})[k]=P[A][k];delete P[A][k];n++}});
    if(whole){if(!mb[kz])mb[kz]=mb[ka];delete mb[ka];n++}});
  return n>0},
  // 2 — vocabulaire : « Dompteur de boss » devient « Maître des projets »
  G=>{if(G.voc1)return false;G.voc1=1;if(Array.isArray(G.rt))G.rt=G.rt.map(t=>t==="Dompteur de boss"?"Maître des projets":t);if(S.title==="Dompteur de boss")S.title="Maître des projets";return false},
  // 3 — ancienne clé de l'assiette (boss d'assiette retiré)
  G=>{if(!G.plb)return false;delete G.plb;return false},
  // 4 — 27/10 : les bonnes actions qui faisaient doublon avec l'assiette sont retirées de la liste (l'historique et l'XP restent)
  G=>{if(!Array.isArray(S.actions))return false;const n=S.actions.length;S.actions=S.actions.filter(a=>!PLATE_DUP.has(a.name));return S.actions.length!==n},
];
function runMig(){try{const G=S&&S.g;if(!G)return;const v=+G.ver||0;if(v>=MIG.length)return;// sauvegarde à jour, ou plus récente que l'appli : on ne touche à rien
  let r=false;for(let i=v;i<MIG.length;i++){try{if(MIG[i](G))r=true}catch(e){}G.ver=i+1}save();if(r){try{render()}catch(e){}}}catch(e){}}
runMig();
