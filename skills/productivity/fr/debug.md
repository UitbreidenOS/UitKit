---
name: debug
description: "Systematic bug isolation: reproduce, hypothesise, narrow, fix, verify — for any language or error type"
---

> 🇫🇷 Version française. [English version](../debug.md).

# Compétence Débogage

## Quand activer
- Un bug existe mais vous ne savez pas où ni pourquoi
- Un message d'erreur pointe vers un symptôme, pas une cause
- Un test échoue et la raison n'est pas évidente
- Comportement intermittent / instable difficile à reproduire
- Quelque chose fonctionnait avant et ne fonctionne plus (régression)

## Quand NE PAS utiliser
- Vous connaissez déjà la cause — corrigez-la directement
- Problèmes de performance — utiliser d'abord les outils de profilage
- Conflits de dépendances/versions — vérifier les changelogs avant de déboguer le code

## Instructions

### La boucle de débogage

```
1. REPRODUIRE — faire apparaître le bug de manière fiable
2. HYPOTHÈSE — formuler une théorie spécifique et testable
3. RÉDUIRE — éliminer ce qui ne peut pas être la cause
4. CORRIGER — changer une chose à la fois
5. VÉRIFIER — confirmer la correction et vérifier les régressions
```

Ne jamais sauter l'étape 1. Si vous ne pouvez pas le reproduire, vous ne pouvez pas vérifier la correction.

### Étape 1 — Reproduire de manière fiable

```python
# Turn a vague "it crashes sometimes" into a deterministic test case
def test_reproduces_bug():
    # Exact inputs that trigger the bug
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # this should FAIL right now
```

**Questions auxquelles répondre :**
- Quelle entrée exacte le déclenche ?
- Cela arrive-t-il à chaque fois, ou seulement parfois ?
- Cela arrive-t-il uniquement en production, ou aussi localement ?
- Quand cela a-t-il commencé ? (Utiliser `git bisect` pour trouver le commit)

### Étape 2 — Formuler une hypothèse précise

Mauvaise hypothèse : "Il y a quelque chose qui ne va pas avec la base de données"
Bonne hypothèse : "La requête renvoie null quand l'utilisateur n'a pas de commandes, et nous ne gérons pas le cas null à la ligne 47"

Une bonne hypothèse est :
- Spécifique (nomme un fichier, une fonction ou une ligne)
- Testable (vous pouvez la prouver ou la réfuter)
- Falsifiable (vous savez ce qui la réfuterait)

### Étape 3 — Réduire par recherche binaire

```python
# Add temporary print/log statements to find where things go wrong
def process_payment(order):
    print(f"[DEBUG] order: {order}")           # is this right?
    total = calculate_total(order)
    print(f"[DEBUG] total: {total}")           # is this right?
    result = charge_card(order.card, total)
    print(f"[DEBUG] charge result: {result}")  # is this right?
    return result
```

**Approche par recherche binaire :** si une fonction a 100 lignes et que vous ne savez pas où est le bug :
- Ajouter un print à la ligne 50
- Si le print montre un état correct, le bug est dans les lignes 51–100
- Ajouter un print à la ligne 75
- Répéter jusqu'à avoir isolé la ligne exacte

### Étape 4 — Corriger une chose à la fois

```python
# Bad: fixing 3 things at once
# - Changed the query
# - Added null check
# - Updated the cache TTL
# Now you don't know which fix worked

# Good: fix one thing, run tests, commit if green, then fix next
```

**La correction doit être le changement minimal qui fait passer le test.** Si votre correction dépasse 10 lignes, demandez-vous si vous corrigez la cause racine ou si vous masquez simplement le symptôme.

### Étape 5 — Vérifier et prévenir la récurrence

```python
# The test that reproduced the bug should now pass
def test_reproduces_bug():
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # now GREEN

# Add this test to the test suite so the bug never regresses
```

### Catégories de bugs courantes et commandes de diagnostic

**NullPointerException / AttributeError / TypeError :**
```python
# Add type guard before the crash
print(type(obj), repr(obj))  # what is it actually?
assert obj is not None, f"Expected User, got {obj!r}"
```

**Décalage d'un (Off-by-one) :**
```python
# Print boundary values
print(f"len={len(items)}, index={index}, range={range(start, end)}")
```

**Condition de course / bug async :**
```python
import asyncio
# Add sleep to exaggerate timing
await asyncio.sleep(0.1)  # does this make the bug more or less likely?
```

**"Fonctionne localement, échoue en CI" :**
```bash
# Check for environment differences
env | sort > local-env.txt
# Compare with CI env variables
# Common causes: timezone, locale, file paths, missing env vars
```

**Régression — fonctionnait avant, cassé maintenant :**
```bash
# Find the commit that broke it
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
# Run your reproducer on each bisect step
# git bisect good / git bisect bad until it finds the culprit commit
```

**Test instable (passe parfois, échoue parfois) :**
```bash
# Run 20 times to force it to fail consistently
for i in {1..20}; do pytest tests/test_flaky.py -x && echo "pass $i" || echo "FAIL $i" && break; done
```

### Prompt de débogage structuré pour Claude

```
/debug

Error: {coller le message d'erreur complet et la trace}
Code: {coller la fonction ou le fichier, ou donner le chemin}
Reproduction: {étapes exactes / entrée qui le déclenche}
What I've tried: {ce que vous avez déjà écarté}
Expected: {ce qui devrait se passer}
Actual: {ce qui se passe réellement}
```

### Lire les traces d'exécution (stack traces)

```
Traceback (most recent call last):
  File "app.py", line 42, in process_order      ← appelant le plus externe
    total = calculate_total(order)
  File "billing.py", line 17, in calculate_total ← intermédiaire
    return sum(item.price for item in order.items)
  File "billing.py", line 17, in <genexpr>       ← le plus interne — LIRE EN PREMIER
AttributeError: 'NoneType' object has no attribute 'price'
```

**Toujours commencer par le bas d'une trace d'exécution.** Le haut est là où l'exécution a commencé ; le bas est là où elle a planté.

## Exemple

**Erreur :**
```
KeyError: 'user_id'
  File "api/auth.py", line 34, in get_current_user
    return User.get(session['user_id'])
```

**Session de débogage avec Claude :**
1. **Reproduire :** ajouter `print(session)` avant la ligne 34 → révèle `session = {}`
2. **Hypothèse :** la session est vide — soit la connexion ne la définit pas, soit elle est effacée
3. **Réduire :** vérifier le gestionnaire de connexion — `session['user_id'] = user.id` est là. Vérifier le middleware — `session.clear()` est appelé à chaque requête à cause d'un gestionnaire CORS mal configuré
4. **Corriger :** supprimer l'appel erroné à `session.clear()`
5. **Vérifier :** le test passe, ajout d'un test pour la persistance de session entre les requêtes

---
