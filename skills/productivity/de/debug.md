---
name: debug
description: "Systematic bug isolation: reproduce, hypothesise, narrow, fix, verify — for any language or error type"
---

> 🇩🇪 Deutsche Version. [Englische Version](../debug.md).

# Debugging-Kompetenz

## Wann aktivieren
- Ein Bug existiert, aber Sie wissen nicht wo oder warum
- Eine Fehlermeldung zeigt auf ein Symptom, nicht auf eine Ursache
- Ein Test schlägt fehl und der Grund ist nicht offensichtlich
- Intermittierendes / unzuverlässiges Verhalten, das schwer zu reproduzieren ist
- Etwas hat früher funktioniert und jetzt nicht mehr (Regression)

## Wann NICHT verwenden
- Sie kennen die Ursache bereits — beheben Sie sie einfach
- Performance-Probleme — zuerst Profiling-Tools verwenden
- Abhängigkeits-/Versionskonflikte — Changelogs prüfen, bevor Code debuggt wird

## Anweisungen

### Die Debugging-Schleife

```
1. REPRODUZIEREN — den Bug zuverlässig zum Auftreten bringen
2. HYPOTHESE — eine spezifische, testbare Theorie formulieren
3. EINGRENZEN — ausschließen, was nicht die Ursache sein kann
4. BEHEBEN — eine Sache auf einmal ändern
5. VERIFIZIEREN — die Behebung bestätigen und auf Regressionen prüfen
```

Schritt 1 niemals überspringen. Wenn Sie es nicht reproduzieren können, können Sie die Behebung nicht verifizieren.

### Schritt 1 — Zuverlässig reproduzieren

```python
# Turn a vague "it crashes sometimes" into a deterministic test case
def test_reproduces_bug():
    # Exact inputs that trigger the bug
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # this should FAIL right now
```

**Zu beantwortende Fragen:**
- Welche genaue Eingabe löst es aus?
- Passiert es jedes Mal oder nur manchmal?
- Passiert es nur in der Produktion oder auch lokal?
- Wann hat es begonnen? (`git bisect` verwenden, um den Commit zu finden)

### Schritt 2 — Spezifisch hypothetisieren

Schlechte Hypothese: "Mit der Datenbank stimmt etwas nicht"
Gute Hypothese: "Die Abfrage gibt null zurück, wenn der Benutzer keine Bestellungen hat, und wir behandeln den null-Fall in Zeile 47 nicht"

Eine gute Hypothese ist:
- Spezifisch (benennt eine Datei, Funktion oder Zeile)
- Testbar (Sie können sie beweisen oder widerlegen)
- Falsifizierbar (Sie wissen, was sie widerlegen würde)

### Schritt 3 — Mit binärer Suche eingrenzen

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

**Binäre Suche:** wenn eine Funktion 100 Zeilen hat und Sie nicht wissen, wo der Bug ist:
- Einen print bei Zeile 50 hinzufügen
- Wenn der print den korrekten Zustand zeigt, ist der Bug in Zeilen 51–100
- Einen print bei Zeile 75 hinzufügen
- Wiederholen, bis die genaue Zeile isoliert ist

### Schritt 4 — Eine Sache auf einmal beheben

```python
# Bad: fixing 3 things at once
# - Changed the query
# - Added null check
# - Updated the cache TTL
# Now you don't know which fix worked

# Good: fix one thing, run tests, commit if green, then fix next
```

**Die Behebung sollte die kleinste Änderung sein, die den Test bestehen lässt.** Wenn Ihre Behebung mehr als 10 Zeilen umfasst, überlegen Sie, ob Sie die Grundursache beheben oder nur das Symptom überdecken.

### Schritt 5 — Verifizieren und Wiederauftreten verhindern

```python
# The test that reproduced the bug should now pass
def test_reproduces_bug():
    result = function_under_test(specific_input_that_fails)
    assert result == expected  # now GREEN

# Add this test to the test suite so the bug never regresses
```

### Häufige Bug-Kategorien und Diagnosebefehle

**NullPointerException / AttributeError / TypeError:**
```python
# Add type guard before the crash
print(type(obj), repr(obj))  # what is it actually?
assert obj is not None, f"Expected User, got {obj!r}"
```

**Off-by-one (Eins-daneben-Fehler):**
```python
# Print boundary values
print(f"len={len(items)}, index={index}, range={range(start, end)}")
```

**Race condition / async-Bug:**
```python
import asyncio
# Add sleep to exaggerate timing
await asyncio.sleep(0.1)  # does this make the bug more or less likely?
```

**"Funktioniert lokal, schlägt in CI fehl":**
```bash
# Check for environment differences
env | sort > local-env.txt
# Compare with CI env variables
# Common causes: timezone, locale, file paths, missing env vars
```

**Regression — hat früher funktioniert, jetzt defekt:**
```bash
# Find the commit that broke it
git bisect start
git bisect bad HEAD
git bisect good v1.2.0
# Run your reproducer on each bisect step
# git bisect good / git bisect bad until it finds the culprit commit
```

**Flackernder Test (besteht manchmal, schlägt manchmal fehl):**
```bash
# Run 20 times to force it to fail consistently
for i in {1..20}; do pytest tests/test_flaky.py -x && echo "pass $i" || echo "FAIL $i" && break; done
```

### Strukturierter Debug-Prompt für Claude

```
/debug

Error: {vollständige Fehlermeldung und Stack-Trace einfügen}
Code: {Funktion oder Datei einfügen, oder Pfad angeben}
Reproduction: {genaue Schritte / Eingabe, die es auslöst}
What I've tried: {was Sie bereits ausgeschlossen haben}
Expected: {was passieren sollte}
Actual: {was tatsächlich passiert}
```

### Stack-Traces lesen

```
Traceback (most recent call last):
  File "app.py", line 42, in process_order      ← äußerster Aufrufer
    total = calculate_total(order)
  File "billing.py", line 17, in calculate_total ← Zwischenstufe
    return sum(item.price for item in order.items)
  File "billing.py", line 17, in <genexpr>       ← innerste Ebene — ZUERST LESEN
AttributeError: 'NoneType' object has no attribute 'price'
```

**Immer vom Ende eines Stack-Traces aus lesen.** Oben beginnt die Ausführung; unten ist der Absturzpunkt.

## Beispiel

**Fehler:**
```
KeyError: 'user_id'
  File "api/auth.py", line 34, in get_current_user
    return User.get(session['user_id'])
```

**Debug-Sitzung mit Claude:**
1. **Reproduzieren:** `print(session)` vor Zeile 34 hinzufügen → zeigt `session = {}`
2. **Hypothese:** Session ist leer — entweder setzt der Login sie nicht, oder sie wird gelöscht
3. **Eingrenzen:** Login-Handler prüfen — `session['user_id'] = user.id` ist vorhanden. Middleware prüfen — `session.clear()` wird bei jeder Anfrage aufgerufen wegen eines falsch konfigurierten CORS-Handlers
4. **Beheben:** Den fehlerhaften `session.clear()`-Aufruf entfernen
5. **Verifizieren:** Test besteht, Test für Session-Persistenz über Anfragen hinweg hinzugefügt

---
