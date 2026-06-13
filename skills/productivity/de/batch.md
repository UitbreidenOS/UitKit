---
name: batch
description: "Parallel agent orchestration: decompose large tasks into independent units, spawn background agents in worktrees, each opens a PR"
---

> 🇩🇪 Deutsche Version. [Englische Version](../batch.md).

# Skill: Batch (Stapelverarbeitung)

## Wann aktivieren
- Dieselbe Änderung auf 10+ Dateien anwenden (umbenennen, refactoring, migration)
- Einen großen Codebase-Audit durchführen (Sicherheitsscan, Abhängigkeitscheck, Testabdeckung)
- Boilerplate für viele Module parallel generieren
- Jede Aufgabe, bei der die Arbeit in unabhängige, nicht überlappende Einheiten aufgeteilt werden kann

## Wann NICHT verwenden
- Aufgaben mit sequentiellen Abhängigkeiten (Schritt B erfordert die Ausgabe von Schritt A)
- Änderungen an einer einzelnen Datei oder einer kleinen Anzahl verwandter Dateien
- Aufgaben, die gemeinsamen Kontext über alle Einheiten erfordern (stattdessen einen einzelnen Agent verwenden)
- Wenn Sie jede Änderung überprüfen und genehmigen müssen, bevor die nächste beginnt

## Anweisungen

### Das Batch-Pattern

Standard Claude Code funktioniert sequentiell: eine Aufgabe → ein Agent → eine Sitzung. Der Batch-Modus zerlegt eine große Aufgabe in N unabhängige Einheiten und verarbeitet sie parallel — jede Einheit läuft als separater Hintergrund-Agent in einem isolierten git worktree, nimmt ihre Änderungen vor und öffnet einen PR.

```
Große Aufgabe
    │
    ├── Einheit 1 → worktree-1 → branch-1 → PR #1
    ├── Einheit 2 → worktree-2 → branch-2 → PR #2
    ├── Einheit 3 → worktree-3 → branch-3 → PR #3
    └── Einheit N → worktree-N → branch-N → PR #N
```

### Aktivierungs-Prompt

```
/batch

Task: [describe the full task]
Files/scope: [list files or glob patterns, or describe the scope]
```

Claude wird:
1. **Recherche-Phase** — den Codebase lesen, um Muster und Umfang zu verstehen
2. **Zerlegung** — die Aufgabe in 5–30 unabhängige Einheiten aufteilen
3. **Plan-Überprüfung** — die Aufschlüsselung präsentieren und auf Ihre Genehmigung warten
4. **Ausführung** — einen Hintergrund-Agent pro Einheit in einem isolierten worktree starten
5. **PRs** — jeder Agent committet seine Änderungen und öffnet einen PR gegen main

### Zerlegungsregeln, die Claude befolgt
- Jede Einheit muss **unabhängig** sein — kein gemeinsamer Zustand, keine Inter-Einheits-Abhängigkeiten
- Jede Einheit muss **in einer Agent-Sitzung abgeschlossen werden können** (~15–30 Min. Arbeit)
- Jede Einheit muss ein **klares Erfolgskriterium** haben (Tests bestehen, Lint besteht)
- Einheiten sind so dimensioniert, dass sie **in einem PR überprüfbar** sind (kleine PRs bevorzugen)

### Gute Batch-Aufgaben

```bash
# Eine Funktion im gesamten Codebase umbenennen
/batch
Task: Rename `getUserById` to `findUserById` everywhere it's used.
Scope: src/**/*.ts, tests/**/*.ts

# Typ-Annotationen zu allen Python-Modulen hinzufügen
/batch
Task: Add full type annotations (PEP 484) to all functions in the services layer.
Scope: src/services/*.py

# API-Aufrufe auf neues SDK migrieren
/batch
Task: Migrate all uses of the old `stripe.charges.create()` to `stripe.paymentIntents.create()`.
Scope: src/billing/**

# Sicherheits-Audit
/batch
Task: Audit every endpoint handler for missing authentication middleware.
Scope: routes/**/*.ts
Report findings per file — do not make changes.
```

### Fortschritt überwachen

Während Agents im Hintergrund laufen, mit Folgendem überwachen:
```bash
# worktree-Status prüfen
git worktree list

# Offene PRs prüfen
gh pr list --label batch

# Sehen, welche Agents noch laufen
claude agents
```

### Ergebnisse zusammenführen

Sobald PRs geöffnet sind:
1. Jeden PR unabhängig überprüfen — sie sind absichtlich klein
2. In beliebiger Reihenfolge mergen (sie sind unabhängig)
3. Worktrees bereinigen, nachdem alle PRs gemergt wurden:
```bash
git worktree prune
```

### Wenn eine Einheit fehlschlägt

Wenn der PR eines Agents Tests nicht besteht:
- Die anderen Agents laufen weiter — Fehler kaskadieren nicht
- Den fehlgeschlagenen PR überprüfen, manuell korrigieren oder diese Einheit neu starten
- `git worktree remove worktree-N` verwenden, um zu bereinigen und neu zu starten

## Beispiel

**Aufgabe:** JSDoc-Kommentare zu allen exportierten Funktionen in einer 40-Datei TypeScript-Bibliothek hinzufügen.

**Claudes Zerlegung:**
```
Unit 1: src/auth/*.ts (6 files, ~15 functions)
Unit 2: src/billing/*.ts (5 files, ~12 functions)
Unit 3: src/api/users/*.ts (4 files, ~18 functions)
...
Unit 8: src/utils/*.ts (3 files, ~8 functions)
```

**Nach Genehmigung:** 8 Hintergrund-Agents starten parallel. Jeder öffnet einen PR mit dem Titel `docs(jsdoc): add JSDoc to [module name]`. Gesamtzeit: ~20 Minuten statt ~2,5 Stunden sequentiell.

---
