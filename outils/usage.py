"""usage.py <carnet-AAAA-MM-JJ.json> : ce que la sauvegarde dit de l'utilisation des quêtes et bonnes actions.
Le fichier vient de Moi > Bilan > Données > Exporter. Rien n'est envoyé ni modifié : lecture seule, résultat à l'écran.
Mesure : quêtes refusées (« Pas pour moi »), poids appris (les plus souvent mises de côté), familles en retrait,
ce qui est fait souvent / rarement / jamais, équilibre des catégories, bonnes actions jamais utilisées."""
import sys, json, collections, datetime, re

d = json.load(open(sys.argv[1], encoding="utf8"))
G = d.get("g") or {}
log = [e for e in d.get("log") or [] if isinstance(e, dict)]
now = max([e.get("t", 0) for e in log] or [0]) / 1000 or datetime.datetime.now().timestamp()
J = lambda e: (now - e.get("t", 0) / 1000) / 86400
def titre(e): return re.sub(r"\s*\(en partie\)$", "", str(e.get("name", "")))

print("=== Période couverte")
if log:
    t0 = min(e["t"] for e in log) / 1000
    print(f"{len(log)} validations, du {datetime.date.fromtimestamp(t0)} au {datetime.date.fromtimestamp(now)}")

print("\n=== « Pas pour moi » (ne reviennent plus)")
for k in sorted((G.get("fqNo") or {}).keys()): print("  clé :", k)
for t in G.get("fqNoT") or []: print("  titre :", t)

print("\n=== Les plus mises de côté (« Pas aujourd'hui » / « Pas pour moi » répétés : poids appris le plus bas)")
W = sorted((G.get("fqW") or {}).items(), key=lambda x: x[1])
for k, v in W[:25]:
    if v < 0: print(f"  {v:+.2f}  {k}")
print("  … et les plus appréciées :", ", ".join(f"{k} ({v:+.2f})" for k, v in W[::-1][:8] if v > 0) or "aucune")

print("\n=== Familles en retrait (3 refus en 30 jours)")
for f, L in (G.get("fqFam") or {}).items():
    r = [x for x in L if (now - x / 1000) / 86400 < 30]
    if r: print(f"  {f} : {len(r)} refus ces 30 derniers jours")

print("\n=== Faites le plus souvent (60 derniers jours)")
c60 = collections.Counter(titre(e) for e in log if J(e) <= 60 and not e.get("bonus"))
for t, n in c60.most_common(25): print(f"  {n:>3} × {t}")

print("\n=== Catégories (XP sur 60 jours)")
cx = collections.Counter()
for e in log:
    if J(e) <= 60: cx[e.get("cat") or "bonus"] += e.get("xp", 0)
tot = sum(cx.values()) or 1
for c, x in cx.most_common(): print(f"  {c:12} {x:>6} XP  {x * 100 // tot:>3} %")

print("\n=== Bonnes actions de ta liste jamais validées")
faits = set(titre(e) for e in log)
for a in d.get("actions") or []:
    if a.get("name") not in faits: print("  ", a.get("name"), f"({a.get('xp')} XP)")

print("\n=== Faites une seule fois en tout")
call = collections.Counter(titre(e) for e in log if not e.get("bonus"))
print("  " + " · ".join(t for t, n in call.items() if n == 1)[:2000])
