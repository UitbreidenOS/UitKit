---
name: debug
description: "Systematic bug isolation: reproduce, hypothesise, narrow, fix, verify — for any language or error type"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../debug.md).

# Debug Vaardigheid

## Wanneer activeren
- Er bestaat een bug maar u weet niet waar of waarom
- Een foutmelding wijst naar een symptoom, niet naar een oorzaak
- Een test mislukt en de reden is niet duidelijk
- Intermitterend / onbetrouwbaar gedrag dat moeilijk te reproduceren is
- Iets werkte eerder en nu niet meer (regressie)

## Wanneer NIET gebruiken
- U kent de oorzaak al — fix het gewoon
- Performance-problemen — gebruik eerst profileringtools
- Afhankelijkheids-/versieconflicten — controleer changelogs voor u code debugt

## Instructies

### De debuglus

```
1. REPRODUCEREN — de bug betrouwbaar laten optreden
2. HYPOTHESE — een specifieke, testbare theorie formuleren
3. INPERKEN — elimineren wat niet de oorzaak kan zijn
4. OPLOSSEN — één ding tegelijk veranderen
5. VERIFIËREN — de fix bevestigen en controleren op regressies
```

Stap 1 nooit overslaan. Als u het niet kunt reproduceren, kunt u de fix niet verifiëren.

### Stap 1 — Betrouwbaar reproduceren

```python
# Turn a vague "it crashes sometimes" into a deterministic test case
def test_reproduces_bug():
    # Exact inputs that trigger the bug
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # this should FAIL right now
```

**Te beantwoorden vragen:**
- Welke exacte invoer triggert het?
- Gebeurt het elke keer, of soms?
- Gebeurt het alleen in productie, of ook lokaal?
- Wanneer begon het? (`git bisect` gebruiken om de commit te vinden)

### Stap 2 — Specifiek hypothetiseren

Slechte hypothese: "Er is iets mis met de database"
Goede hypothese: "De query geeft null terug als de gebruiker geen bestellingen heeft, en we behandelen het null-geval op regel 47 niet"

Een goede hypothese is:
- Specifiek (noemt een bestand, functie of regel)
- Testbaar (u kunt het bewijzen of weerleggen)
- Falsifieerbaar (u weet wat het zou weerleggen)

### Stap 3 — Inperken met binair zoeken

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

**Binaire zoekaanpak:** als een functie 100 regels heeft en u niet weet waar de bug zit:
- Voeg een print toe op regel 50
- Als de print de juiste toestand toont, zit de bug in regels 51–100
- Voeg een print toe op regel 75
- Herhaal totdat de exacte regel is geïsoleerd

### Stap 4 — Één ding tegelijk oplossen

```python
# Bad: fixing 3 things at once
# - Changed the query
# - Added null check
# - Updated the cache TTL
# Now you don't know which fix worked

# Good: fix one thing, run tests, commit if green, then fix next
```

**De fix moet de kleinste wijziging zijn die de test doet slagen.** Als uw fix meer dan 10 regels omvat, overweeg dan of u de onderliggende oorzaak oplost of alleen het symptoom maskeert.

### Stap 5 — Verifiëren en terugkeer voorkomen

```python
# The test that reproduced the bug should now pass
def test_reproduces_bug():
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # now GREEN

# Add this test to the test suite so the bug never regresses
```

### Veelvoorkomende bugcategorieën en diagnostische commando's

**NullPointerException / AttributeError / TypeError:**
```python
# Add type guard before the crash
print(type(obj), repr(obj))  # what is it actually?
assert obj is not None, f"Expected User, got {obj!r}"
```

**Off-by-one (één-naast-fout):**
```python
# Print boundary values
print(f"len={len(items)}, index={index}, range={range(start, end)}")
```

**Race condition / async-bug:**
```python
import asyncio
# Add sleep to exaggerate timing
await asyncio.sleep(0.1)  # does this make the bug more or less likely?
```

**"Werkt lokaal, mislukt in CI":**
```bash
# Check for environment differences
env | sort > local-env.txt
# Compare with CI env variables
# Common causes: timezone, locale, file paths, missing env vars
```

**Regressie — werkte eerder, nu kapot:**
```bash
# Find the commit that broke it
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
# Run your reproducer on each bisect step
# git bisect good / git bisect bad until it finds the culprit commit
```

**Flaky test (slaagt soms, mislukt soms):**
```bash
# Run 20 times to force it to fail consistently
for i in {1..20}; do pytest tests/test_flaky.py -x && echo "pass $i" || echo "FAIL $i" && break; done
```

### Gestructureerde debug-prompt voor Claude

```
/debug

Error: {volledige foutmelding en stack trace plakken}
Code: {functie of bestand plakken, of pad opgeven}
Reproduction: {exacte stappen / invoer die het triggert}
What I've tried: {wat u al heeft uitgesloten}
Expected: {wat er zou moeten gebeuren}
Actual: {wat er werkelijk gebeurt}
```

### Stack traces lezen

```
Traceback (most recent call last):
  File "app.py", line 42, in process_order      ← buitenste aanroeper
    total = calculate_total(order)
  File "billing.py", line 17, in calculate_total ← tussenliggend
    return sum(item.price for item in order.items)
  File "billing.py", line 17, in <genexpr>       ← binnenste — LEES DIT EERST
AttributeError: 'NoneType' object has no attribute 'price'
```

**Begin altijd onderaan een stack trace.** Bovenaan begint de uitvoering; onderaan is de crashlocatie.

## Voorbeeld

**Fout:**
```
KeyError: 'user_id'
  File "api/auth.py", line 34, in get_current_user
    return User.get(session['user_id'])
```

**Debugsessie met Claude:**
1. **Reproduceren:** `print(session)` toevoegen voor regel 34 → onthult `session = {}`
2. **Hypothese:** sessie is leeg — ofwel stelt login het niet in, ofwel wordt het gewist
3. **Inperken:** login-handler controleren — `session['user_id'] = user.id` staat er. Middleware controleren — `session.clear()` wordt bij elke aanvraag aangeroepen door een verkeerd geconfigureerde CORS-handler
4. **Oplossen:** De foutieve `session.clear()`-aanroep verwijderen
5. **Verifiëren:** test slaagt, test toegevoegd voor sessiepersistentie over aanvragen heen

---
