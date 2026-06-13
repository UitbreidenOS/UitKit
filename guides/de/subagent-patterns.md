# Subagent Design-Muster

Wie strukturiert man Multi-Agent Claude Code-Aufgaben für Parallelität, Korrektheit und Kosteneffizienz. Jedes Muster unten hat ein Use-Case-Profil, ein Textdiagramm, Implementierungs-Guidance und häufige Fehler zu vermeiden.

---

## Subagenten in Claude Code verstehen

Wenn Claude Code einen Subagenten spawnt, verwendet es das `Agent`-Tool, um eine separate Claude-Instanz mit seinem eigenen Kontextfenster zu starten. Der Parent-Agent läuft weiter (oder wartet, abhängig vom Muster). Subagenten können Werkzeuge verwenden, Dateien lesen, Dateien schreiben und Ergebnisse an den Parent zurückgeben.

Wichtige Constraints:
- Jeder Subagent hat sein eigenes Token-Budget — Fan-Out multipliziert Kosten linear
- Subagenten können Memory nicht direkt teilen — sie kommunizieren über Dateien oder Return-Werte
- Spawning ist asynchron standardmäßig; der Parent kann auf Ergebnisse warten oder weitermachen
- Tool-Permissions gelten für jeden Subagent unabhängig

---

## Muster 1: Fan-Out

**Starten Sie N Agenten gleichzeitig, aggregieren Sie Ergebnisse.**

```
Parent
  ├── Agent A (handles shard 1)
  ├── Agent B (handles shard 2)
  ├── Agent C (handles shard 3)
  └── [wait for all]
        └── Parent aggregates results
```

**Wann verwenden:**
- Unabhängige Work Units, die keinen Zustand teilen
- Verarbeitung einer Liste (Dateien, Repos, Endpoints, Test Cases), bei der jedes Item eigenständig ist
- Jede Aufgabe, bei der sequ entielle Ausführung N× länger dauern würde ohne Qualität-Nutzen

**Wann NICHT verwenden:**
- Aufgaben mit gemeinsamem veränderbarem Zustand (konkurrierende Datei-Writes verursachen Konflikte)
- Wenn Shard-Ergebnisse voneinander abhängen
- Wenn Token-Kosten ein Concern sind und Quality-per-Token wichtiger als Speed ist

**Implementierung:**
```
Spawn 4 Agenten parallel. Jeder Agent behandelt ein Service-Verzeichnis:
  - Agent 1: audit /services/auth/
  - Agent 2: audit /services/payments/
  - Agent 3: audit /services/notifications/
  - Agent 4: audit /services/reporting/

Jeder Agent schreibt seine Findings zu /tmp/audit-[service].json.
Nachdem alle 4 abgeschlossen sind, lesen Sie alle vier Dateien und produzieren Sie einen konsolidierten Bericht.
```

**Häufige Fehler:**
- Jedem Agent keinen eindeutigen Output-Pfad geben (sie überschreiben sich gegenseitig)
- Mehr Agenten als sinnvolle Work Units spawnen (eine 3-Zeilen-Datei benötigt nicht ihren eigenen Agent)
- Aggregieren vor allen Agenten fertig (prüfen Sie alle Output-Dateien vor Konsolidierung)

---

## Muster 2: Validation Chain

**Agent A → gate → Agent B → gate → Agent C. Jeder Agent kann Progression blockieren.**

```
Input → Agent A → [GATE: pass/fail?] → Agent B → [GATE: pass/fail?] → Agent C → Output
                        │                               │
                      STOP                            STOP
                  (fix required)                 (fix required)
```

**Wann verwenden:**
- Quality Enforcement Pipelines (schreiben → review → genehmigen)
- Security-sensible Workflows, bei denen ein ungeprüfter Schritt schlimmer ist als kein Schritt
- Wenn jede Stage ein transformiertes Artefakt produziert, das die nächste Stage benötigt
- Der `workflows/pre-human-review.md`-Workflow verwendet dieses Muster

**Wann NICHT verwenden:**
- Wenn Stages unabhängig sind und parallel laufen könnten (verwenden Sie Fan-Out stattdessen)
- Wenn alle Agenten wahrscheinlich bestehen (drei Agenten reviewing eine Zwei-Zeilen-Änderung ist Over-Engineering)
- Wenn die Kosten der vollständigen Chain die Kosten eines einzelnen sorgfältigen Agenten übersteigen

**Implementierung:**
```
Chain: simplifier → security reviewer → code reviewer

Nachdem jeder Agent, prüfen Sie sein Output auf ein PASS/FAIL Signal vor dem Spawning des nächsten.
Wenn jeder Agent FAIL zurückgibt, halte die Chain an und surface die Issues.
Spawn den nächsten Agent nur nach explizitem PASS.

Batch die Chain niemals in einen einzelnen Agent-Call — die Gate-Logik muss vom Parent durchgesetzt werden.
```

**Häufige Fehler:**
- Gates zu locker definieren (jeder Agent bestehen, die Chain produziert keinen Wert)
- Gates zu streng definieren (eine Minor-Warnung haltet alles an)
- Agenten wissen lassen, was nach ihnen kommt (sie sollten unabhängig evaluieren, nicht auf die nächste Stage kalibrieren)

---

## Muster 3: Specialist Routing

**Klassifizieren Sie die Aufgabe, routen Sie zum richtigen Expert-Agent.**

```
Input → Classifier → router decision
                          ├── [type: security] → Security Specialist
                          ├── [type: database] → DB Specialist
                          ├── [type: frontend] → UI Specialist
                          └── [type: unknown]  → General Agent
```

**Wann verwenden:**
- Eine heterogene Queue von Aufgaben, die verschiedene Expertise benötigen
- Vermeidung eines General-Purpose-Agenten, der in allem mittelmäßig ist
- Wenn Specialist-Agenten Domain-spezifische Instruktionen tragen, die der General-Agent nicht belastet werden sollte

**Wann NICHT verwenden:**
- Aufgaben, die eindeutig ein Typ sind — keine Notwendigkeit zu klassifizieren, was Sie bereits wissen
- Wenn der Classifier selbst teuer ist (Klassifizierung eines Ein-Zeilen-Bug-Fixes mit Sonnet-Call verschwendet Token)

**Implementierung:**
```
Step 1 — Klassifizieren (Haiku für Kosten verwenden):
  "Read this task description and return one word: security | database | frontend | backend | unknown"

Step 2 — Route basierend auf Klassifizierung:
  if security → spawn agents/security-reviewer.md
  if database → spawn agents/db-specialist.md
  if frontend → spawn agents/ui-reviewer.md
  else        → spawn general agent

Step 3 — Geben Sie das Specialist-Ergebnis an den Benutzer zurück.
```

**Häufige Fehler:**
- Sonnet oder Opus für Klassifizierung verwenden — Haiku klassifiziert genauso genau für einen Bruchteil der Kosten
- Zu einem Specialist routen aber ihm nicht den vollen Kontext vom Classifier geben
- Über-Segmentieren (10 Specialist-Agenten für eine App, die nur 2 jemals benötigt)

---

## Muster 4: Watchdog

**Ein Monitor-Agent beobachtet und kann auf einem langen Agent-Run intervenieren.**

```
Worker Agent ──── progress updates ───→ Watchdog Agent
     │                                        │
     │                                  [monitors for]
     │                                  - stuck loops
     └── [watchdog can signal halt] ←── - dangerous actions
                                        - quality degradation
```

**Wann verwenden:**
- Lange autonome Sessions, bei denen Off-Rails teuer ist
- Wenn der Worker-Agent Werkzeuge mit Echtzeit-Nebenwirkungen verwendet (Datei-Writes, API-Calls, Deploys)
- Over-Night oder unbeaufsichtigte Runs, bei denen Sie einen Circuit-Breaker benötigen

**Wann NICHT verwenden:**
- Kurze Aufgaben (< 5 Minuten) — der Watchdog-Overhead ist nicht wert
- Read-Only-Explorations-Aufgaben, bei denen die schlimmste Outcome eine falsche Antwort ist

**Implementierung:**
```
Spawn Watchdog mit diesen Auslösern:
  HALT if: Worker versucht zu schreiben zu /etc/, run rm -rf, oder zugriff .env-Dateien
  WARN if: Worker hat denselben Tool-Call 3+ Mal ohne Fortschritt gemacht
  WARN if: Worker Output-Größe übersteigt 50k Tokens (wahrscheinlich Looping)
  REPORT at: Task-Abschluss oder Halt

Watchdog kann den Worker nicht direkt überschreiben — es signalisiert dem Parent, welcher entscheidet, ob zu halts ist.
```

**Häufige Fehler:**
- Den Watchdog zu sensitiv machen (er haltet beim ersten Retry an, besiegt den Zweck)
- Den Watchdog zu permissiv machen (er fired nie, produziert falsches Sicherheit-Gefühl)
- Watchdog am selben Model wie den Worker laufen (verwenden Sie Haiku für den Watchdog — er beobachtet, nicht reasoned)

---

## Muster 5: Parallel Investigation

**Mehrere Agenten testen verschiedene Hypothesen gleichzeitig; erstes korrektes Ergebnis gewinnt (oder alle Ergebnisse werden verglichen).**

```
Hypothesis 1 → Agent A ─────┐
Hypothesis 2 → Agent B ─────┼──→ Parent compares results → best answer
Hypothesis 3 → Agent C ─────┘
```

**Wann verwenden:**
- Debugging, bei dem die Root Cause unklar ist und mehrere Theorien plausibel sind
- Research-Aufgaben, bei denen verschiedene Such-Strategien verschiedene Findings liefern könnten
- Jede Aufgabe, bei der der beste Ansatz wirklich unsicher upfront ist

**Wann NICHT verwenden:**
- Aufgaben, bei denen es einen eindeutig korrekten Ansatz gibt
- Cost-sensible Situationen — dieses Muster ist das teuerste pro korrekte Antwort
- Wenn Hypothesen nicht unabhängig sind (Agent A-Ergebnis ändert ob Hypothesis B gültig ist)

**Implementierung:**
```
Spawn 3 Agenten mit verschiedenen Hypothesen, warum die Datenbank langsam ist:
  - Agent A: untersuchen Query-Pläne und fehlende Indexes
  - Agent B: untersuchen Connection-Pool-Erschöpfung
  - Agent C: untersuchen Lock-Kontention

Jeder Agent schreibt seine Findings und Confidence-Level zu /tmp/hypothesis-[A/B/C].md.
Nachdem alle abgeschlossen sind, vergleichen Sie Findings und geben Sie die wahrscheinlichste Root Cause mit Evidence zurück.
```

**Häufige Fehler:**
- Hypothesen so ähnlich framing, dass Agenten beinahe identische Ergebnisse produzieren
- Nicht einschließlich eines Confidence-Scores — ohne es, können Sie zwischen conflicting Findings nicht wählen
- Zu viele Hypothesen laufen (3-4 ist normalerweise richtig; darüber hinaus, Kosten übertrifft den Marginal-Nutzen von einer anderen Theorie)

---

## Token-Kostenvergleich

| Muster | Relative Kosten | Beste Kosteneffizienz |
|---|---|---|
| Fan-Out (N Agenten) | N × Single Agent | Wenn N Tasks vollständig parallelisierbar sind |
| Validation Chain (3 Agenten) | 3× wenn alle bestehen, weniger wenn früh halts | Wenn früh-Halt häufig ist |
| Specialist Routing | ~1× (Classifier ist Haiku) | Fast immer billiger als General + Post-Hoc Fix |
| Watchdog | ~1.05–1.1× (Haiku Watchdog) | Lange autonome Sessions |
| Parallel Investigation | N× ohne frühe Termination | Nur wenn Unsicherheit hoch ist und Fehler teuer |

**Kostenleitung:**
- Verwenden Sie Haiku für: Klassifizierer, Watchdogs, Übersetzungs-Agenten, jeder Agent mit mechanischer Transformation
- Verwenden Sie Sonnet für: Specialists, Reviewer, Agenten, die Judgment benötigen
- Verwenden Sie Opus für: High-Stakes Entscheidungen, komplexe Architektur-Analyse — nicht für unterstützende Rollen

---
