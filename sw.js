// Service worker d'XP : l'appli s'ouvre sans réseau.
// Page : réseau d'abord, sans le cache HTTP de GitHub Pages (10 min) (toujours la dernière version en ligne), cache si pas de réseau ou réseau trop lent (3 s).
// Manifest, icônes, polices : cache d'abord, mis à jour en arrière-plan. Les données (localStorage) ne passent jamais par ici.
const C="xp-v2",BASE=["./","manifest.json","icones/xp-180.png","icones/xp-192.png","icones/xp-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
const put=(req,res)=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp))}return res};
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(r.mode==="navigate"){
    e.respondWith(new Promise(ok=>{let done=false;const fb=()=>caches.match("./").then(m=>{if(!done&&m){done=true;ok(m)}});
      const t=setTimeout(fb,3000);
      fetch(r.url,{cache:"no-store",credentials:"same-origin"}).then(res=>{clearTimeout(t);put("./",res.clone());if(!done){done=true;ok(res)}}).catch(()=>{clearTimeout(t);caches.match("./").then(m=>{if(!done){done=true;ok(m||Response.error())}})})}));return}
  const same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(!same&&!font)return;
  e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(res=>put(r,res)).catch(()=>m);return m||n}))});
