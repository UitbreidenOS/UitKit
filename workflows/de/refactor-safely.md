> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../refactor-safely.md).

# Sicher Refactoren Workflow

So wird Code mit Claude Code refactoriert, ohne Verhalten zu brechen — mit Tests als Sicherheitsnetz während des gesamten Prozesses.

---

## Wann diesen Workflow verwenden
- Funktionen aus einer großen Methode extrahieren
- Module umbenennen und neu organisieren
- Ein Muster durch ein besseres über mehrere Dateien ersetzen
- Duplikate in der gesamten Codebase reduzieren
- Die Struktur eines Moduls verbessern, ohne sein externes Verhalten zu ändern

---

## Die goldene Regel

**Niemals in demselben Commit refactoren und Verhalten ändern.** Ein Refactor bewahrt das externe Verhalten. Wenn Tests fehlschlagen, wurde entweder das Verhalten geändert oder die Tests testeten Implementierungsdetails (beides ist ein Problem).

---

## Schritt 1 — Eine Test-Baseline etablieren

Bevor irgendetwas geändert wird, eine angemessene Testabdeckung sicherstellen.

**Claude fragen:**
```
I want to refactor: [describe what you're refactoring and why]

First, assess the current test coverage:
1. Read the relevant files: [list files]
2. What behaviors are currently tested?
3. What behaviors are NOT tested that could break during refactoring?
4. Write any missing tests now, before we touch production code

Do not change production code yet. Tests only.
```

**Die Test-Ergänzungen committen, bevor refactoriert wird.** So ist klar, welche Tests vor dem Refactor existierten und welche als Teil des Refactors hinzugefügt wurden.

---

## Schritt 2 — Den Refactor-Umfang definieren

**Claude fragen:**
```
Here is what I want to refactor: [describe the goal]

Read the relevant files: [list files]

Define the scope:
1. What will change structurally? (function signatures, file locations, module boundaries)
2. What will NOT change? (external behavior, API contracts, database schema)
3. What are the riskiest parts of this refactor?
4. What is the smallest first step that makes progress without risk?

Do not start the refactor yet.
```

---

## Schritt 3 — In kleinen, testbaren Schritten refactoren

Den Refactor in Schritte aufteilen, die klein genug sind, damit Tests jeden einzelnen verifizieren können.

**Für jeden Schritt:**
```
Refactor step [N]: [describe the specific structural change]

Rules:
- Change only what's needed for this step
- Do not change any behavior
- After this change, all existing tests must still pass
- Tell me what to verify after this step
```

**Nach jedem Schritt:**
```bash
# Tests ausführen — müssen grün sein, bevor nächster Schritt beginnt
npm test  # oder pytest, go test, etc.
```

Wenn Tests nach einer rein strukturellen Änderung fehlschlagen: stoppen, verstehen warum, beheben, bevor fortgefahren wird. Ein fehlschlagender Test nach einem Refactor bedeutet entweder, dass der Refactor Verhalten geändert hat oder der Test testete Implementierung (beides sind Probleme, die jetzt zu beheben sind).

---

## Schritt 4 — Externes Verhalten als unverändert verifizieren

Nach allen Schritten:

**Claude fragen:**
```
The refactor is structurally complete. Verify that external behavior is unchanged:

1. Run the full test suite
2. Check that all public APIs/interfaces are identical to before (same inputs, same outputs)
3. Check that database queries produce identical results
4. Check that error cases still produce the same errors
5. If there are integration tests or end-to-end tests, run them

Report any behavioral differences — even small ones.
```

---

## Schritt 5 — Aufräumen

**Claude fragen:**
```
Before committing, clean up:

1. Remove any debugging code or temporary comments added during refactoring
2. Remove any dead code that the refactor made unreachable
3. Update any documentation or comments that referenced the old structure
4. Check that import paths are clean (no unused imports)

Do not introduce new logic in this step.
```

---

## Schritt 6 — Mit einer klaren Nachricht committen

Die Refactor-Commits so strukturieren, dass sie eine klare Geschichte erzählen:

```
refactor: extract payment processing into PaymentService

Moves payment logic out of OrderController into a dedicated service.
No behavior change — all existing tests pass.
Motivation: OrderController was 600 lines; this makes both units testable in isolation.
```

Einen Refactor-Commit niemals mit einem Feature- oder Bugfix-Commit mischen. Getrennt halten.

---

## Refactoring-Anti-Muster

- **"Wo ich schon dabei bin..."** — gleichzeitig refactoren und ein Feature hinzufügen. Aufhören. Erst den Refactor fertigstellen.
- **Refactoren ohne Tests** — etwas wird gebrochen und es wird nicht bemerkt
- **Big-Bang-Refactor** — alles auf einmal ändern. Inkrementell vorgehen.
- **Umbenennen als letzten Schritt** — zuerst umbenennen (mechanisch, geringes Risiko), dann umstrukturieren
- **Die Baseline überspringen** — annehmen, dass Tests ausreichend sind, ohne es zu prüfen

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
