> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../debugging-session.md).

# Debugging-Sitzungs-Workflow

Systematischer Workflow zur Diagnose und Behebung von Bugs mit Claude Code — ohne Symptome zu jagen.

---

## Wann diesen Workflow verwenden
- Ein Bug, der nicht sofort aus dem Code ersichtlich ist
- Ein fehlschlagender Test, dessen Ursache unklar ist
- Produktionsfehler, der lokal nicht reproduziert werden kann
- Intermittierende Fehler

---

## Schritt 1 — Zuerst eine Feedback-Schleife aufbauen

Vor der Untersuchung einen zuverlässigen Weg zur Reproduktion des Bugs erstellen. Diesen Schritt nicht überspringen.

**Claude fragen:**
```
I have a bug: [describe the symptom exactly — error message, unexpected behavior, what you expected]

Before we investigate, help me build a reliable way to reproduce it.

Options to consider:
- A failing test that captures the bug
- A curl command or script that triggers it
- A minimal code snippet that demonstrates it
- Steps to reproduce via the UI

Which is most appropriate here, and write it now.
```

**Nicht fortfahren, bis eine zuverlässige Reproduktion vorhanden ist.** Debuggen ohne Reproduktion ist Raten.

---

## Schritt 2 — Den Wirkungsbereich isolieren

Verstehen, wo der Bug überhaupt liegen kann, bevor Code gelesen wird.

**Claude fragen:**
```
Here is the reproduction: [paste the reproduction from Step 1]

Without looking at code yet, answer:
1. What is the earliest point in the call stack where this could go wrong?
2. What external systems are involved (DB, cache, third-party API, queue)?
3. What changed recently that could have introduced this? (check git log)
4. What is the smallest unit of code that, if wrong, would cause this symptom?

List the files most likely to contain the bug, ranked by probability.
```

---

## Schritt 3 — Hypothesen generieren

**Claude fragen:**
```
Based on the reproduction and the candidate files, generate 3–5 falsifiable hypotheses.

For each hypothesis:
- State it as a specific claim: "The bug occurs because [X] when [Y]"
- Describe how to test it: what would we observe if this hypothesis is true?
- Describe how to disprove it: what would we observe if it's false?

Do not start testing yet. List all hypotheses first.
```

Die Hypothesen überprüfen. Eigene Ideen hinzufügen, die Claude verpasst hat. Nach Wahrscheinlichkeit ordnen.

---

## Schritt 4 — Hypothesen testen, beginnend mit der wahrscheinlichsten

**Für jede Hypothese:**
```
Test hypothesis [N]: "[paste the hypothesis]"

Add the minimal instrumentation needed to confirm or rule this out:
- A log statement at the right point
- A debug assertion
- A targeted test with a specific input

Do not add instrumentation for other hypotheses yet.
```

Nach jedem Test:
- Wenn bestätigt: zu Schritt 5 übergehen
- Wenn widerlegt: zur nächsten Hypothese übergehen
- Wenn nicht eindeutig: Hypothese verfeinern und erneut testen

---

## Schritt 5 — Korrigieren und verifizieren

Sobald die Grundursache bestätigt ist:

**Claude fragen:**
```
Root cause confirmed: [describe what you found]

Now:
1. Apply the minimal fix — change only what's needed to fix this specific bug
2. Do not refactor surrounding code
3. Update the reproduction from Step 1 to be a regression test
4. Run the full test suite — confirm nothing else broke

Explain in one sentence why this fix works.
```

---

## Schritt 6 — Post-Mortem (für schwerwiegende Bugs)

Für Bugs, die Benutzerauswirkungen, Datenverlust verursacht haben oder mehr als 2 Stunden zum Auffinden benötigten:

**Claude fragen:**
```
Write a brief post-mortem for this bug:

1. What was the bug? (one sentence)
2. What was the root cause?
3. How long did it take to find and why?
4. What would have caught this earlier? (missing test, missing monitoring, code review gap)
5. What should we add/change to prevent this class of bug?

Keep it under 200 words. No blame, no fluff.
```

---

## Zu vermeidende Anti-Muster

- **Das Symptom beheben, nicht die Ursache** — wenn nicht verstanden wird warum, wurde es nicht behoben
- **Mehrere Dinge gleichzeitig ändern** — es wird nicht bekannt sein, welche Änderung es behoben hat
- **Debuggen ohne Reproduktion** — es wird geraten
- **Überall Instrumentierung hinzufügen** — spezifische Hypothesen gezielt ansprechen
- **Den Regressionstest überspringen** — der Bug kommt zurück

---

> **Mit uns arbeiten:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
