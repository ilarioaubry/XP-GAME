// ===== Quêtes pour toi : situation, goûts, météo, moment =====
const SIT_Q={job:[["etud","Étudiant·e"],["poste","En poste"],["cherche","En recherche d'emploi"],["indep","Indépendant·e"],["pause","En pause"],["autre","Autre"]],
 home:[["seul","Seul·e"],["coloc","En coloc"],["couple","En couple"],["parents","En famille"]],
 goals:[["job","Trouver un travail"],["forme","Ma forme"],["sommeil","Mon sommeil"],["ecrans","Moins d'écrans"],["potes","Mes potes"],["famille","Ma famille"],["son","Ma musique"],["argent","Mes finances"],["apprendre","Apprendre"],["chez","Mon chez-moi"],["moral","Mon moral"],["manger","Manger mieux"]],
 pass:[["rap","Rap"],["creer","Créer du son"],["cine","Ciné, séries"],["lecture","Lecture"],["jeux","Jeux vidéo"],["cuisine","Cuisine"],["sport","Sport"],["dessin","Dessin"],["mode","Mode"],["nature","Nature"],["photo","Photo"],["voyage","Voyage"]],
 time:[["peu","Très peu"],["30","30 min"],["60","1 h"],["plus","Plus"]]};
function sitOf(){const G=S.g;if(!G.sit||typeof G.sit!=="object")return null;return G.sit}
function sitSheet(done){if(document.querySelector(".sitsh"))return;const G=S.g,p=document.createElement("div");p.className="bpop rapop sitsh";p.setAttribute("role","dialog");p.setAttribute("aria-modal","true");p.setAttribute("aria-label","Ma situation");document.body.appendChild(p);
  const lz=((G.lz||[])+"").toLowerCase(),pre=[];if(/mus|son/.test(lz))pre.push("creer");if(/lect/.test(lz))pre.push("lecture");if(/cin/.test(lz))pre.push("cine");if(/cuis/.test(lz))pre.push("cuisine");if(/jeu/.test(lz))pre.push("jeux");
  const st=JSON.parse(JSON.stringify(sitOf()||{job:"",home:"",goals:[],pass:pre,time:"30",note:""}));if(!G.taste||typeof G.taste!=="object")G.taste={art:[]};const art=G.taste.art.slice();let artMsg="",busy=false;const nf=[...(G.normOff||[])];
  const close=()=>{p.remove();done&&done()};p.onclick=e=>{if(e.target===p)close()};
  const chips=(k,multi,max)=>`<div class="qcdom">${SIT_Q[k].map(([v,l])=>`<button type="button" class="qchip sm" data-k="${k}" data-v="${v}" aria-pressed="${multi?st[k].includes(v):st[k]===v}">${l}</button>`).join("")}</div>${multi&&max?`<p class="hint sith">${st[k].length}/${max} au maximum</p>`:""}`;
  const draw=()=>{p.innerHTML=`<div class="bpc rap qc"><div class="raph"><h3>Ma situation</h3><button type="button" class="raclose" aria-label="Fermer">${ICO("close",18)}</button></div>
    <p class="qcsub">1 minute pour des quêtes tirées de ta vie.</p>
    <h4>En ce moment, tu es</h4>${chips("job")}<h4>Tu vis</h4>${chips("home")}
    <h4>Ce que tu veux faire avancer</h4>${chips("goals",true,4)}<h4>Tes passions</h4>${chips("pass",true)}
    <h4>Ton temps libre en semaine</h4>${chips("time")}
    <h4>Ce qui ne te concerne pas <small>ces quêtes ne te seront plus proposées</small></h4><div class="qcdom">${NORMS.map(([k,l])=>`<button type="button" class="qchip sm" data-norm="${k}" aria-pressed="${nf.includes(k)}">${l}</button>`).join("")}</div>
    <h4>Tes artistes <small>pour des quêtes musique</small></h4><div class="sitart">${art.map((a,i)=>`<span class="sita"><b></b><button type="button" data-ra="${i}" aria-label="Retirer">${ICO("close",12)}</button></span>`).join("")}</div>
    <form class="qcadd sitaf"><input maxlength="40" placeholder="Ajouter un artiste" aria-label="Ajouter un artiste"><button type="submit" class="btn" aria-label="Ajouter">${ICO("check",16)}</button></form>
    ${artMsg?`<p class="sperr">${esc(artMsg)}</p>`:""}
    <h4>Ce qui compte pour toi en ce moment <small>facultatif</small></h4><input class="qcname sitnote" maxlength="80" placeholder="Ex. je prépare mon premier concert">
    <button type="button" class="btn primary qcgo">Enregistrer</button></div>`;
    p.querySelector(".raclose").onclick=close;p.querySelectorAll(".sita b").forEach((b,i)=>b.textContent=art[i]);
    const nt=p.querySelector(".sitnote");nt.value=st.note||"";nt.oninput=()=>{st.note=nt.value};
    p.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{const k=b.dataset.k,v=b.dataset.v;if(Array.isArray(st[k])){if(st[k].includes(v))st[k]=st[k].filter(x=>x!==v);else{if(k==="goals"&&st[k].length>=4){toast("4 au maximum : choisis ce qui compte le plus");return}st[k].push(v)}}else st[k]=st[k]===v?"":v;draw()});
    p.querySelectorAll("[data-ra]").forEach(b=>b.onclick=()=>{art.splice(+b.dataset.ra,1);draw()});
    p.querySelectorAll("[data-norm]").forEach(b=>b.onclick=()=>{const k=b.dataset.norm,i=nf.indexOf(k);if(i>=0)nf.splice(i,1);else nf.push(k);draw()});
    p.querySelector(".sitaf").onsubmit=e=>{e.preventDefault();const i=e.target.querySelector("input"),v=i.value.trim();if(!v)return;if(art.length>=12){toast("12 artistes au maximum");return}if(!art.some(a=>a.toLowerCase()===v.toLowerCase()))art.push(v.slice(0,40));draw()};
    p.querySelector(".qcgo").onclick=()=>{G.normOff=nf.slice();G.sit={...st,note:(st.note||"").trim().slice(0,80),t:Date.now()};G.taste={art:art.slice(0,12),t:Date.now()};if(G.fq)G.fq.d="";save();close();render();toast("Situation enregistrée : tes quêtes vont suivre")}};
  draw()}

const cap=t=>(t=String(t||"").trim())?t[0].toUpperCase()+t.slice(1):t;
// --- modèles de quêtes : [id, texte, cat, xp, [hDébut,hFin], condition(ctx), pourquoi, {out,in,short,we,wd}]
const FQ=[
 ["a_itw",c=>`Regarder une interview de ${c.A}`,"perso",15,[12,24],c=>c.A&&c.free!=="peu",c=>`Tu écoutes ${c.A}`,{in:1}],
 ["a_album",c=>`Un album de ${c.A} en entier, sans écran`,"perso",15,[10,24],c=>c.A,c=>`Tu écoutes ${c.A}`,{}],
 ["a_simil",c=>`Découvrir 3 artistes proches de ${c.A}`,"perso",10,[9,24],c=>c.A,c=>`Tu écoutes ${c.A}`,{short:1}],
 ["a_beat",c=>`Faire un beat dans l'esprit de ${c.A} (30 min)`,"perso",30,[10,24],c=>c.A&&(c.p.creer||c.g.son),c=>`Tu fais du son et tu écoutes ${c.A}`,{in:1}],
 ["a_struct",c=>`Décortiquer un son de ${c.A} : intro, couplet, refrain, ce qui t'accroche`,"perso",15,[10,24],c=>c.A&&(c.p.creer||c.p.rap),c=>`Pour nourrir ton son`,{}],
 ["a_live",c=>`Regarder un live ou un concert filmé de ${c.A}`,"perso",15,[18,24],c=>c.A,c=>`Tu écoutes ${c.A}`,{in:1}],
 ["j_cand","Envoyer 2 candidatures","travail",30,[9,18],c=>c.job==="cherche"||c.g.job,c=>"Tu cherches un travail",{wd:1,cour:1}],
 ["j_offres","Repérer 5 offres qui te donnent envie","travail",15,[9,20],c=>c.job==="cherche"||c.g.job,c=>"Tu cherches un travail",{short:1}],
 ["j_cv","Améliorer ton CV pendant 15 min","travail",15,[9,20],c=>c.job==="cherche"||c.g.job,c=>"Tu cherches un travail",{short:1}],
 ["j_reseau","Écrire à quelqu'un de ton réseau pour un conseil","travail",20,[9,19],c=>c.job==="cherche"||c.g.job,c=>"Un contact vaut dix candidatures",{wd:1,cour:1}],
 ["e_revise","Réviser 25 min, téléphone dans une autre pièce","travail",20,[9,22],c=>c.job==="etud",c=>"Tu es étudiant·e",{in:1}],
 ["e_sac","Préparer tes affaires pour demain","maison",10,[19,24],c=>c.job==="etud"||c.job==="poste",c=>"Demain matin sera plus simple",{short:1,wd:1}],
 ["w_plan","Noter les 3 choses importantes de demain","travail",10,[18,24],c=>c.job==="poste"||c.job==="indep",c=>"Pour attaquer demain sans réfléchir",{short:1,wd:1}],
 ["w_mail","Vider ta boîte mail pendant 10 min","travail",10,[9,18],c=>c.job==="poste"||c.job==="indep",c=>"Tu travailles",{short:1,wd:1}],
 ["i_client","45 min sur ton projet principal","travail",30,[9,19],c=>c.job==="indep",c=>"Tu es à ton compte",{wd:1}],
 ["f_out","Marche rapide de 20 min dehors","sport",15,[8,20],c=>c.g.forme||c.p.sport,c=>c.wx&&c.wx.good?`${c.wx.tc}° et beau temps`:"Pour ta forme",{out:1}],
 ["f_in","15 min de sport à la maison : pompes, squats, gainage","sport",15,[8,22],c=>c.g.forme||c.p.sport,c=>c.wx&&c.wx.wet?"Il pleut : on bouge à l'intérieur":"Pour ta forme",{in:1}],
 ["f_stretch","10 min d'étirements avant de dormir","sport",10,[20,24],c=>c.g.forme||c.g.sommeil,c=>"Pour ta forme et ton sommeil",{short:1}],
 ["s_screen","Écrans coupés 30 min avant de dormir","soi",15,[21,24],c=>c.g.sommeil||c.g.ecrans,c=>"Pour mieux dormir",{}],
 ["s_air","Aérer ta chambre 5 min avant de te coucher","maison",5,[20,24],c=>c.g.sommeil,c=>"Pour mieux dormir",{short:1}],
 ["s_nap","Une sieste de 20 min, pas plus","soi",10,[12,16],c=>c.tired&&(c.we||!["poste","etud"].includes(c.job)),c=>"Ta nuit a été courte",{short:1}],
 ["x_noreseau","Une heure sans réseaux, à partir de maintenant","soi",15,[13,18],c=>c.g.ecrans,c=>"Moins d'écrans",{}],
 ["p_sortie","Proposer une sortie ce week-end à un ami","social",15,[10,22],c=>c.g.potes,c=>"Pour tes potes",{short:1}],
 ["p_dehors","Voir un ami dehors aujourd'hui","social",25,[11,21],c=>c.g.potes&&c.wx&&c.wx.good,c=>"Il fait beau, profites-en à deux",{out:1,we:1}],
 ["p_appel","Appeler un pote 10 min, juste pour parler","social",15,[11,23],c=>c.g.potes,c=>c.wx&&c.wx.wet?"Il pleut : parfait pour un appel":"Pour tes potes",{in:1}],
 ["c_photo","Envoyer une photo de ta journée à ta famille","famille",10,[12,22],c=>(c.g.famille||c.home==="seul")&&c.home!=="parents",c=>"Pour ta famille",{short:1}],
 ["c_aide","Rendre un petit service à quelqu'un chez toi","maison",10,[10,22],c=>c.home==="coloc"||c.home==="parents"||c.home==="couple",c=>c.home==="coloc"?"En coloc":"À la maison",{short:1}],
 ["m_depenses","Noter tes dépenses de la semaine","maison",15,[10,22],c=>c.g.argent,c=>"Pour tes finances",{}],
 ["m_abo","Repérer un abonnement que tu peux arrêter","maison",15,[10,22],c=>c.g.argent,c=>"Pour tes finances",{short:1}],
 ["l_tuto","20 min sur une compétence : un tuto, un cours, une vidéo","perso",20,[9,23],c=>c.g.apprendre,c=>"Tu veux apprendre",{in:1}],
 ["h_zone","Ranger une seule zone pendant 10 min","maison",10,[9,22],c=>c.g.chez,c=>"Pour ton chez-toi",{short:1,in:1}],
 ["o_3","Envoyer un vocal d'une minute à ton ami le plus proche","social",10,[12,23],c=>c.g.moral||c.md&&c.md<=2,c=>c.md&&c.md<=2?"Ta journée est dure : quelqu'un pour t'alléger":"Pour ton moral",{short:1}],
 ["o_soleil","10 min au soleil, sans rien faire","soi",10,[9,18],c=>(c.g.moral||c.md&&c.md<=2)&&c.wx&&c.wx.good&&c.wx.day,c=>"Il fait beau dehors",{out:1,short:1}],
 ["r_cuisine","Cuisiner un vrai repas maison","nourriture",20,[11,21],c=>c.g.manger||c.p.cuisine,c=>c.p.cuisine?"Tu aimes cuisiner":"Pour manger mieux",{in:1}],
 ["r_recette","Tester une recette que tu n'as jamais faite","nourriture",25,[11,21],c=>c.p.cuisine,c=>c.wx&&c.wx.wet?"Temps parfait pour cuisiner":"Tu aimes cuisiner",{in:1}],
 ["v_film",c=>filmOfDay(),"perso",20,[18,24],c=>c.p.cine,c=>c.wx&&c.wx.wet?"Soirée pluvieuse : un film culte à voir":"Un film culte à voir",{in:1,film:1}],
 ["v_lire","Lire 20 pages","perso",15,[9,24],c=>c.p.lecture,c=>c.wx&&c.wx.wet?"Il pleut : un livre":"Tu aimes lire",{in:1}],
 ["v_jeu","Finir une mission en jeu, après tes rituels","perso",10,[17,24],c=>c.p.jeux,c=>"Tu as bien bossé",{in:1}],
 ["v_dessin","Dessiner 15 min","perso",15,[9,24],c=>c.p.dessin,c=>"Tu aimes dessiner",{in:1}],
 ["v_photo","Sortir faire 10 photos de ton quartier","perso",20,[9,19],c=>c.p.photo&&c.wx&&c.wx.good,c=>"Belle lumière dehors",{out:1}],
 ["v_parc","Balade dans un parc ou en forêt","sport",20,[9,19],c=>c.p.nature&&c.wx&&!c.wx.wet,c=>"Tu aimes la nature",{out:1}],
 ["v_style","Préparer ta tenue de demain","soi",10,[19,24],c=>c.p.mode,c=>"Tu aimes la mode",{short:1}],
 ["v_son","Faire du son pendant 30 min","perso",30,[10,24],c=>c.p.creer||c.g.son,c=>c.wx&&c.wx.wet?"Il pleut : studio":"Ta musique avance",{in:1}],
 ["n_note",c=>`${cap(c.note)} : 20 min pour avancer`,"perso",25,[9,23],c=>c.note&&!c.arc,c=>"Ce qui compte pour toi en ce moment",{}]];
// ---- Clarté : tri du téléphone, une quête par jour au plus, le point le plus ancien d'abord
const CLAR=[["photos","Photos","Trier 50 photos : doublons, flous et captures d'écran à la corbeille",15,[30,60]],
 ["notes","Notes","Faire le tri dans tes notes : 10 à supprimer ou à ranger",10,[30,60]],
 ["msg","Messages et contacts","Archiver les vieilles conversations et nettoyer 10 contacts",10,[30,60]],
 ["mails","Mails","Te désabonner de 5 newsletters et vider ta boîte de réception",15,[14,30]],
 ["apps","Applis","Supprimer les applis que tu n'as pas ouvertes depuis un mois",10,[30,60]],
 ["reseaux","Réseaux","Trier un réseau : 10 abonnements en moins, et un œil sur tes abonnés",10,[30,60]],
 ["notifs","Notifications","Couper les notifications de 5 applis qui ne servent à rien",10,[30,60]],
 ["focus","Modes de concentration","Régler un mode de concentration pour le soir ou le travail",10,[60,120]],
 ["fond","Fond d'écran","Choisir un nouveau fond d'écran qui te ressemble",5,[60,120]],
 ["albums","Albums photos","Ranger tes photos récentes dans des albums",15,[30,60]],
 ["musique","Musique locale","Faire le tri dans la musique enregistrée sur ton téléphone",10,[60,120]],
 ["spotify","Spotify","Trier tes titres likés Spotify et ranger 10 sons dans des playlists",15,[30,60]],
 ["cartes","Cartes","Ranger tes lieux enregistrés dans Plans ou Maps : listes et favoris",10,[60,120]],
 ["drive","Docs et Drive","Ranger 10 fichiers de ton Drive dans des dossiers",15,[30,60]],
 ["fichiers","Fichiers","Vider les téléchargements et ranger l'app Fichiers",10,[30,60]]];
function clarLast(k){const C=CLAR.find(x=>x[0]===k);if(!C)return 0;let t=((S.g&&S.g.afLast)||{})["af:clarte:"+C[1]]||0;(S.log||[]).forEach(e=>{if(e.t>t&&(e.name===C[2]||String(e.name||"").startsWith("Tri du téléphone · "+C[1])))t=e.t});return t}
CLAR.forEach(([k,l,t,xp,fr])=>FQ.push(["t_"+k,t,"maison",xp,[9,23],c=>{const L=clarLast(k);return!L||(Date.now()-L)/864e5>=fr[0]},c=>"Tri : "+l.toLowerCase(),{in:1,short:1}]));
function clarWt(id){const k=id.slice(2),L=clarLast(k);return L?Math.min(1.5,(Date.now()-L)/864e5/60):1.5}
function fqCtx(){const G=S.g,s=sitOf()||{goals:[],pass:[]},w=typeof wxNow==="function"?wxNow():null,tk=dayKey(Date.now()),sl=G.sleep&&G.sleep[tk];
  const g={},p={};(s.goals||[]).forEach(x=>g[x]=1);(s.pass||[]).forEach(x=>p[x]=1);const art=((G.taste&&G.taste.art)||[]);
  return{arc:typeof arcCur==="function"&&!!arcCur(),en:typeof enOf==="function"?enOf():0,job:s.job,home:s.home,g,p,free:s.time,note:(s.note||"").trim(),art,h:dayH(),we:isWeekend(),md:(G.mood||{})[tk]|0,tired:!!(sl&&sl.h<6),
    wx:w?{...w,good:(w.k==="clear"||w.k==="partly")&&w.tc>=8&&w.tc<=30,wet:["rain","storm","snow"].includes(w.k)}:null}}
function fqText(q,c){return typeof q[1]==="function"?q[1](c):q[1]}
function fqPick(force){const G=S.g,tk=dayKey(Date.now());if(!G.fq||typeof G.fq!=="object")G.fq={};const F=G.fq;
  if(F.d===tk&&!force&&Array.isArray(F.L))return F;const c=fqCtx();const seed=Number(tk.replace(/-/g,""))+(F.rr||0)*7919;let r=seed;const rnd=()=>{r=(r*1103515245+12345)%2147483648;return r/2147483648};
  const art=c.art.slice();for(let i=art.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[art[i],art[j]]=[art[j],art[i]]}
  const pool=[];FQ.forEach(q=>{const o=q[7]||{};if(c.h>=q[4][1]-.5)return;if((G.fqNo||{})["f:"+q[0]])return;const isA=q[0].startsWith("a_");const list=isA?art.slice(0,2):[null];list.forEach(A=>{const cc={...c,A};if(isA&&!A)return;let ok=false;try{ok=!!q[5](cc)}catch(e){}if(!ok)return;
    if(o.we&&!c.we&&q[0]!=="s_nap")return;if(o.wd&&c.we)return;if(o.out&&c.wx&&(c.wx.wet||!c.wx.day&&c.h>19))return;
    let w=1+rnd();if(isA)w+=1.2;if(q[0]==="n_note")w+=1.5;if(q[0].startsWith("t_"))w+=clarWt(q[0]);if(c.wx&&c.wx.good&&o.out)w+=1;if(c.wx&&c.wx.wet&&o.in)w+=1;if(c.free==="peu"&&o.short)w+=.8;if(c.free==="peu"&&q[3]>=30)w-=.8;w+=fqWt("f:"+q[0]);if(c.en===1){if(q[3]>=30)w-=2;if(o.short)w+=.8}if(c.en===3&&q[3]>=25)w+=.7;
    {let tt="";try{tt=fqText(q,cc)}catch(e){}if(!normOk(tt))return}pool.push({id:q[0]+(A?":"+A:""),q,A,w})})});
  pool.sort((a,b)=>b.w-a.w);{const ni=pool.findIndex(x=>x.q[0]==="n_note");if(ni>0)pool.unshift(pool.splice(ni,1)[0])}const out=[],cats=new Set(),fam=new Set();for(const x of pool){if(x.q[0]==="n_note"){out.push(x);fam.add("n");continue}if(out.length>=6)break;const f=x.q[0].split("_")[0];if(fam.has(f)&&f!=="a")continue;if(cats.has(x.q[2])&&pool.length>6)continue;if(f==="a"&&out.filter(y=>y.q[0].startsWith("a_")).length>=1)continue;if((x.q[7]||{}).out&&out.some(y=>(y.q[7]||{}).out))continue;if(["e_sac","w_plan","v_style"].includes(x.q[0])&&out.some(y=>["e_sac","w_plan","v_style"].includes(y.q[0])))continue;out.push(x);cats.add(x.q[2]);fam.add(f)}
  F.d=tk;F.L=out.map(x=>({id:x.id,A:x.A||null}));if(!Array.isArray(F.done)||F.dd!==tk){F.done=[];F.dd=tk}if(F.ad!==tk){F.ai=[];F.ad=tk}return F}
function fqItems(){const F=fqPick(false),c=fqCtx(),out=[];F.L.forEach(x=>{const q=FQ.find(y=>y[0]===x.id.split(":")[0]);if(!q)return;const cc={...c,A:x.A};let t,why;try{t=fqText(q,cc);why=q[6](cc)}catch(e){return}
  if(c.h>=q[4][1]&&!(F.done||[]).includes(x.id))return;const inH=c.h>=q[4][0]-.5&&c.h<q[4][1];const o=q[7]||{};out.push({id:x.id,t,why:o.cour?why+" · courage +15":why,cat:q[2],xp:XPE(q[3])+(o.cour?15:0),later:!inH,from:q[4][0],out:!!o.out,A:x.A||"",film:!!o.film})});
  (F.ai||[]).forEach((x,i)=>out.push({id:x.id||"ai"+i,t:x.t,why:x.why,cat:CATS[x.cat]?x.cat:"soi",xp:x.xp,ai:1}));return out}
// ===== Compléments de l'audit : normes, gratuit, compteur, réconfort, quartier, réactions
const NORMS=[["minuit","Se coucher avant minuit",/minuit|au lit avant|avant 23 ?h/i],["soda","Journée sans soda",/soda/i],["vege","Repas végétarien",/végétarien|végé\b/i],["ecran","Pas d'écran avant de dormir",/écrans? coupés|sans écran.*(dormir|lit)|pas d'écran au lit|écran.*avant de dormir/i],["sport","Le sport",/pompes|squats|gainage|séance de sport|sport à la maison/i]];
function normOk(t){const off=(S.g&&S.g.normOff)||[];if(!off.length)return true;t=String(t||"");return!NORMS.some(([k,,re])=>off.includes(k)&&re.test(t))}
const FREE_ALT=[[/\bsortie\b|\bresto\b|restaurant|boire un verre/i,"une balade ou un pique-nique maison"],[/cinéma|au ciné\b/i,"un film à la maison"],[/cadeau|offrir/i,"un mot écrit à la main ou un dessin"],[/acheter|achète|commander/i,"avec ce que tu as déjà"],[/réserver|\bbillet\b|inscription payante/i,"un plan gratuit : parc, expo gratuite, balade"],[/recette/i,"avec ce qu'il y a dans le frigo"]];
function freeAlt(t){const f=FREE_ALT.find(([re])=>re.test(String(t||"")));return f?f[1]:""}
const REL_IDEAS=["Demande-lui comment s'est passée sa semaine","Rappelle-lui un bon souvenir à vous deux","Demande-lui ce qui l'occupe en ce moment","Dis-lui une chose que tu apprécies chez lui ou elle","Propose un truc simple à faire ensemble","Demande-lui comment il ou elle va, vraiment"];
function relIdea(n){let h=0;for(const ch of String(n)+dayKey(Date.now()))h=(h*31+ch.charCodeAt(0))>>>0;return REL_IDEAS[h%REL_IDEAS.length]}
// compteur : « Lire 20 pages », « Repérer 5 offres »…
function cntOf(t){const m=String(t||"").match(/(\d+)\s*(pages|offres|candidatures|photos|verres|pompes|squats|artistes|choses|séries|messages|idées)/i);if(!m)return null;const n=+m[1];if(n<2||n>60||durOf(t))return null;return{n,u:m[2].toLowerCase(),st:n>=10?5:1}}
// quêtes de réconfort les mauvais jours
const COMFORT=[["Une douche chaude, sans te presser","soi"],["10 min allongé·e avec une musique douce","soi"],["Une boisson chaude, sans écran","soi"],["Écrire ce qui pèse, puis fermer le carnet","soi"],["Appeler un proche 5 min","social"],["Se faire une tisane ou un chocolat chaud","soi"]];
function badDay(){const G=S.g,tk=dayKey(Date.now()),md=(G.mood||{})[tk]|0,sl=(G.sleep||{})[tk];return enOf()===1||(md&&md<=2)||!!(sl&&sl.h&&sl.h<6)}
function comfortQ(){if(!badDay())return[];const tk=dayKey(Date.now());let h=0;for(const ch of tk)h=(h*31+ch.charCodeAt(0))>>>0;const L=COMFORT.filter(c=>normOk(c[0]));const c=L[h%L.length];return c?[{id:"cf:"+tk,t:c[0],why:"Journée lourde : un moment de réconfort",cat:c[1],xp:10,k:"cf",key:""}]:[]}
// la carte du quartier : les quêtes dehors la découvrent
const MAP_N=6;
function mapOrder(){const c=(MAP_N-1)/2,ix=[];for(let i=0;i<MAP_N*MAP_N;i++)ix.push(i);return ix.sort((a,b)=>{const da=Math.hypot(a%MAP_N-c,Math.floor(a/MAP_N)-c),db=Math.hypot(b%MAP_N-c,Math.floor(b/MAP_N)-c);return da-db||a-b})}
function isOutQ(name){return/dehors|marche|marcher|balade|parc|forêt|soleil|lumière du matin|coucher du soleil|sortir|quartier|vélo|courir|course|footing|à pied/i.test(String(name||""))}
function mapReveal(name){const G=S.g;if(!G||!isOutQ(name))return;if(!G.map||typeof G.map!=="object")G.map={n:0,d:{}};const tk=dayKey(Date.now());if((G.map.d[tk]|0)>=2)return;const O=mapOrder();if(G.map.n>=O.length)return;G.map.n++;G.map.d[tk]=(G.map.d[tk]|0)+1;{const ks=Object.keys(G.map.d).sort();while(ks.length>20)delete G.map.d[ks.shift()]}
  0}



// l'avatar réagit à chaque type de quête
let __react=0;
function questReact(name,cat){if(Date.now()-__react<400)return;__react=Date.now();const n=String(name||"").toLowerCase();
  const k=/verre d'eau|boire/.test(n)?"eau":/pompes|squat|gainage|sport|courir|marche|footing|étirement/.test(n)||cat==="sport"?"sport":/lire|pages|livre/.test(n)?"lire":/médit|respir/.test(n)?"medit":/écri|journal|note|lettre|couplet/.test(n)?"note":/cuisin|repas|recette|manger/.test(n)||cat==="nourriture"?"repas":/écran|réseaux/.test(n)?"ecran":"";
  if(k&&typeof sceneAct==="function"){try{sceneAct(k)}catch(e){}}else{const av=document.querySelector("#sceneBox .scav");if(av&&!matchMedia("(prefers-reduced-motion: reduce)").matches){av.classList.remove("cheer");void av.offsetWidth;av.classList.add("cheer");setTimeout(()=>av.classList.remove("cheer"),1100)}}}

// ===== Étape 4 : l'histoire (arcs, souvenirs, billets, déclencheurs, défi à deux, mode événement)
// --- arcs : « ce qui compte » découpé en chapitres
let arcBusy=false,arcErr="";
function arcCur(){return(Array.isArray(S.g.prj)?S.g.prj:[]).find(p=>p.arc&&!p.won)||null}
function arcStep(){const p=arcCur();if(!p)return null;const i=p.st.findIndex(s=>!s.d);return i<0?null:{p,i}}
function arcFallback(note){return["Décrire ton objectif réussi en une phrase","Lister 3 premières actions concrètes","20 min de recherche sur le sujet","Faire la première action de ta liste","En parler à quelqu'un qui peut t'aider","45 min pour avancer sur le plus dur","Étape finale : faire le pas décisif"]}
async function arcAsk(){if(arcBusy)return;const G=S.g,s=sitOf();const note=(s&&s.note||"").trim();if(!note){sitSheet();return}
  arcBusy=true;arcErr="";render();let n=cap(note).slice(0,40),cat="perso",st=null,ai=0;
  if(!st)st=arcFallback(note);if(!Array.isArray(G.prj))G.prj=[];
  G.prj.unshift({id:"arc"+Date.now().toString(36),n,cat,d:2,st:st.map(t=>({t})),ct:Date.now(),arc:1,src:note,ai});arcBusy=false;save();render();sfx("start");toast(`Arc lancé : <span class="p">${esc(n)}</span> · ${st.length} chapitres`)}
// --- souvenirs
function memOf(id){return(Array.isArray(S.g.mem)?S.g.mem:[]).find(m=>m.id===id)||null}
function memOpen(ctx,done){if(document.querySelector(".memsh"))return;const G=S.g,old=memOf(ctx.id)||{};let ph=old.ph||"";
  const o=document.createElement("div");o.className="bpop memsh";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Souvenir");
  o.innerHTML=`<div class="bpc mempc"><small class="memk">${ctx.ev?"Ton billet":"Souvenir"}</small><h3></h3><div class="memph">${ph?`<img src="${ph}" alt="">`:""}<label class="btn memadd"><input type="file" accept="image/*" hidden>${ph?"Changer la photo":"Ajouter une photo"}</label></div>
    <textarea maxlength="140" rows="2" placeholder="Un mot, une phrase, ce que tu veux retenir"></textarea>${ctx.ev?`<div class="memst" role="group" aria-label="Note">${[1,2,3,4,5].map(i=>`<button type="button" data-s="${i}" aria-pressed="${(old.s|0)>=i}" aria-label="${i} sur 5">${ICO("star",22)}</button>`).join("")}</div>`:""}
    <button type="button" class="btn primary memgo">Garder ce souvenir</button><button type="button" class="lnk memx">Plus tard</button></div>`;
  o.querySelector("h3").textContent=ctx.q;o.querySelector("textarea").value=old.w||"";let stars=old.s|0;
  o.querySelectorAll(".memst button").forEach(b=>b.onclick=()=>{stars=+b.dataset.s;o.querySelectorAll(".memst button").forEach(x=>x.setAttribute("aria-pressed",+x.dataset.s<=stars))});
  o.querySelector("input[type=file]").onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const img=new Image(),u=URL.createObjectURL(f);img.onload=()=>{const M=200,k=Math.min(1,M/Math.max(img.width,img.height)),cv=document.createElement("canvas");cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);ph=cv.toDataURL("image/jpeg",.6);URL.revokeObjectURL(u);const box=o.querySelector(".memph");box.querySelector("img")?box.querySelector("img").src=ph:box.insertAdjacentHTML("afterbegin",`<img src="${ph}" alt="">`);box.querySelector(".memadd").lastChild.textContent="Changer la photo"};img.onerror=()=>{URL.revokeObjectURL(u);toast("Cette image ne peut pas être lue")};img.src=u};
  const close=()=>o.remove();o.onclick=e=>{if(e.target===o)close()};o.querySelector(".memx").onclick=close;
  o.querySelector(".memgo").onclick=()=>{const w=o.querySelector("textarea").value.trim();if(!w&&!ph&&!stars){toast("Un mot ou une photo, au moins");return}
    if(!Array.isArray(G.mem))G.mem=[];const first=!memOf(ctx.id);G.mem=G.mem.filter(m=>m.id!==ctx.id);G.mem.push({id:ctx.id,d:ctx.d||dayKey(Date.now()),q:ctx.q,w,...(ph?{ph}:{}),...(ctx.ev?{ev:ctx.ev,s:stars}:{}),t:Date.now()});
    {let n=0;for(let i=G.mem.length-1;i>=0;i--){if(G.mem[i].ph&&++n>12)delete G.mem[i].ph}G.mem=G.mem.slice(-60)}
    close();save();if(done)done(first);else render();sfx("badge");toast(ctx.ev?"Billet rangé dans ta fiche":"Souvenir gardé")};
  document.body.appendChild(o);setTimeout(()=>o.querySelector("textarea").focus({preventScroll:true}),60)}
function tickets(){const G=S.g,tk=dayKey(Date.now()),seen=new Set(),L=[];evArc().forEach(e=>{if(seen.has(e.id))return;seen.add(e.id);if(e.d<=tk&&(e.t||evtGuess(e.n))==="concert")L.push(e)});return L.sort((a,b)=>a.d<b.d?1:-1)}
// --- déclencheurs de rituels
const TRG={matin:["Au réveil","Après le café","Après la douche","Après le petit-déj","Avant de partir"],soir:["En rentrant","Après le dîner","Après la douche","Avant de me coucher","En éteignant les écrans"]};
function trgPick(t,cb){const per=ritPer(t),o=document.createElement("div");o.className="bpop trgsh";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Déclencheur");
  o.innerHTML=`<div class="bpc"><h3>Quand exactement ?</h3><p class="bpd">Accroche « <span></span> » à un moment précis : ça aide à ne plus l'oublier.</p><div class="trgl">${TRG[per].map(x=>`<button type="button" class="qchip" data-t="${esc(x)}" aria-pressed="${t.trg===x}">${esc(x)}</button>`).join("")}</div>
    <form class="trgf"><input maxlength="30" placeholder="Ou écris le tien : après…" aria-label="Mon déclencheur"><button type="submit" class="btn primary">OK</button></form>${t.trg?`<button type="button" class="lnk trgrm">Retirer le déclencheur</button>`:""}<button type="button" class="btn trgx">Fermer</button></div>`;
  o.querySelector(".bpd span").textContent=t.name;const set=v=>{if(v)t.trg=v.slice(0,30);else delete t.trg;save();o.remove();cb&&cb()};
  o.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>set(b.dataset.t));o.querySelector(".trgf").onsubmit=e=>{e.preventDefault();const v=e.target.querySelector("input").value.trim();if(v)set(cap(v))};
  {const r=o.querySelector(".trgrm");if(r)r.onclick=()=>set("")}o.querySelector(".trgx").onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};document.body.appendChild(o)}
// --- défi à deux

function duoCur(){const G=S.g,D=G.duo;if(!D||!D.who)return null;const wk=bWeek(0)[0];if(D.w!==wk){D.w=wk;D.me=[];D.him=[];D.ok=0}return D}

function duoCheck(){const D=duoCur();if(!D||D.ok)return;if(D.me.length>=D.n&&D.him.length>=D.n){D.ok=1;const prev=levelInfo(S.xp).l;addBonus("Défi à deux réussi avec "+D.who,25,0,"duo");save();render(prev);skyCheer(true);toast(`Défi à deux réussi avec <span class="p">${esc(D.who)}</span> ! +25 XP`)}}

function duoMe(btn,ev){const D=duoCur(),tk=dayKey(Date.now());if(!D||D.me.includes(tk))return;D.me=[...D.me,tk];complete({id:"duo",cat:"social",name:"Défi à deux : "+D.c,xp:10},btn,ev);setTimeout(duoCheck,600)}
// --- mode événement
const EVM_T=["concert","voyage","soiree","examen","entretien","sport"];
function evmOf(day){day=day||dayKey(Date.now());const G=S.g;if(!G)return null;return evArc().find(e=>e.d===day&&EVM_T.includes(e.t||evtGuess(e.n)))||null}
function evmDays(){const G=S.g;if(!G)return[];return evArc().filter(e=>EVM_T.includes(e.t||evtGuess(e.n))).map(e=>e.d)}
function evmOn(){const G=S.g,tk=dayKey(Date.now());return!!evmOf()&&G.evmOff!==tk}
function renderEvMode(){const box=$("evmBox");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now()),e=evmOf(),Rt=document.documentElement;
  const on=!!e&&G.evmOff!==tk;Rt.classList.toggle("evmode",on);box.classList.toggle("voff",!e);if(!e){box.innerHTML="";Rt.style.removeProperty("--evc");return}
  const ty=evtOf(e.t||evtGuess(e.n));Rt.style.setProperty("--evc",ty[2]);if(on)Rt.style.setProperty("--skyac",ty[2]);
  box.innerHTML=`<div class="evmc" style="--tc:${ty[2]}"><span class="evmk">Jour de ${esc(ty[1].toLowerCase())}</span><b></b><small>${on?"Socle seulement, série protégée. Profite.":"Mode événement en pause."}</small><button type="button" class="lnk evmt">${on?"Tout afficher quand même":"Remettre le mode événement"}</button></div>`;
  box.querySelector("b").textContent=e.n+(e.a&&!e.n.includes(e.a)?" · "+e.a:"");box.querySelector(".evmt").onclick=()=>{G.evmOff=on?tk:"";save();render()}}

// pochettes : l'image Spotify si le navigateur l'affiche, sinon une pochette pixel générée
const __spc={};
function spPix(t){const k=(t.n||"")+"|"+(t.a||"");if(__spc[k])return __spc[k];let h=2166136261;for(const ch of k){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}
  const r=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h/4294967296},hu=Math.floor(r()*360),c1=`hsl(${hu} 62% 52%)`,c2=`hsl(${(hu+150)%360} 70% 70%)`,bg=`hsl(${(hu+200)%360} 35% 16%)`,N=12,cv=document.createElement("canvas");cv.width=cv.height=N;const g=cv.getContext("2d");
  g.fillStyle=bg;g.fillRect(0,0,N,N);for(let y=1;y<N-1;y++)for(let x=1;x<N/2;x++){const v=r();if(v<.42){g.fillStyle=v<.14?c2:c1;g.fillRect(x,y,1,1);g.fillRect(N-1-x,y,1,1)}}
  g.fillStyle="rgba(0,0,0,.55)";g.fillRect(4,4,4,4);g.fillStyle=c2;g.fillRect(5,5,2,2);g.fillStyle="#000";g.fillRect(5.5,5.5,1,1);
  return __spc[k]=cv.toDataURL("image/png")}
function spCov(t,px){return`<span class="spcov" style="width:${px}px;height:${px}px"><img class="spcp" src="${spPix(t)}" alt="" width="${px}" height="${px}">${t.c&&/^https:\/\//.test(t.c)?`<img class="spci" src="${esc(t.c)}" alt="" width="${px}" height="${px}" referrerpolicy="no-referrer" loading="lazy">`:""}</span>`}
document.addEventListener("error",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("spci"))t.remove()},true);
document.addEventListener("load",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("spci")&&!t.naturalWidth)t.remove()},true);
function bedTime(){const G=S.g;if(!G||!G.bed||Date.now()-G.bed>18*36e5)return"";const d=new Date(G.bed);return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function renderSleepGo(){const box=$("sleepGo");if(!box||!S.g)return;const G=S.g,tk=dayKey(Date.now()),J=(G.jr||{})[tk]||{},h=dayH();
  const show=h>=(evmOn()?23:RIT_SOIR_H)&&!J.at;box.classList.toggle("voff",!show);if(!show){box.innerHTML="";return}
  const left=ritTasks().filter(t=>!t.bar&&!t.auto&&!t.pz&&ritPer(t)==="soir"&&ritDue(t)&&(S.daily.c[t.id]||0)<t.n).length,tx=xpToday(),g=dayGoal();
  box.innerHTML=`<div class="slgc"><button type="button" class="btn primary slgb"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg>Je vais dormir</button></div>`;
  box.querySelector(".slgb").onclick=()=>closeOpen(0,1)}
