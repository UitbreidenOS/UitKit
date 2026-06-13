---
name: lean-claude
description: "Activate token-efficient mode: caveman output, right model selection, MCP discipline, compaction strategy, cavecrew agents — all in one"
---

> 🇩🇪 Deutsche Version. [Englische Version](../lean-claude.md).

# Lean Claude Skill

## Wann aktivieren
- Zu Beginn jeder Sitzung, bei der Kosten oder Geschwindigkeit eine Rolle spielen
- Bei langen Sitzungen, bei denen der Kontext aufgebläht wird
- Beim Ausführen mehrerer paralleler Agents oder Batch-Workloads
- Bei einem engen Token-Budget
- Vor einer komplexen mehrstufigen Aufgabe, die viel Kontext verbrauchen wird

## Wann NICHT verwenden
- Beim Schreiben von nach außen gerichteter Dokumentation — Kürze kann die Klarheit beeinträchtigen
- Bei Sicherheitsentscheidungen, unumkehrbaren Aktionen oder mehrstufigen Sequenzen, bei denen das Fehlinterpretieren eines Fragments Schaden anrichtet
- Beim Einarbeiten eines neuen Teammitglieds in eine Codebasis

## Anweisungen

Fügen Sie diesen Aktivierungsprompt zu Beginn einer Sitzung ein, um alle Lean-Optimierungen auf einmal zu aktivieren:

```
Activate lean mode for this session:

OUTPUT: caveman full — drop articles, use fragments, short synonyms.
Auto-revert to full prose for: security warnings, irreversible actions,
multi-step sequences where fragment ambiguity is risky.

MODEL: use Haiku 4.5 for any task where output is constrained and verifiable
(linting, formatting, simple renames, single-function edits, classification).
Stay on Sonnet 4.6 for multi-file reasoning. Only escalate to Opus for deep
architectural decisions or complex security analysis.

CONTEXT: do not read full files when a line range will do. Prefer targeted
reads over whole-file reads. Tell me before reading any file >500 lines.

AGENTS: for repetitive or isolated tasks, spawn a Haiku subagent rather than
doing the work in the main session. Each subagent gets a fresh context window.
```

---

### 1. Modellauswahl — der wichtigste Hebel

| Aufgabe | Modell | Einsparungen |
|---------|--------|--------------|
| Linting, Formatierung, einfache Umbenennungen | Haiku 4.5 | ~60 % vs. Sonnet |
| Einfache Funktionsänderungen, Boilerplate-Generierung | Haiku 4.5 | ~60 % |
| Änderungen in mehreren Dateien, Debugging, Code-Review | Sonnet 4.6 | Referenz |
| Architekturentscheidungen, Sicherheitsanalyse | Opus 4.7 | — (es lohnt sich) |
| Klassifizierung, Routing, Extraktion im großen Maßstab | Haiku 4.5 | ~60 % |

**Regel:** Standardmäßig Sonnet 4.6 verwenden. Zu Haiku wechseln, wenn die Ausgabe begrenzt und überprüfbar ist. Nur zu Opus eskalieren, wenn echtes tiefes Denken benötigt wird.

---

### 2. Caveman-Ausgabekomprimierung

Weist Claude an, in knapper, fragmentierter Prosa zu antworten. Gemessen bei ~65 % Reduzierung der Ausgabe-Tokens bei 100 % technischer Genauigkeit.

**Komprimierungsstufen:**

| Stufe | Regel | Beispiel |
|-------|-------|----------|
| `lite` | Füllwörter weglassen, vollständige Sätze behalten | "The function handles edge cases." |
| `full` (Standard) | Artikel weglassen, Fragmente erlaubt | "func handles edge cases" |
| `ultra` | Abkürzen, Konjunktionen entfernen, Pfeile | "fn→edge cases handled" |

**Aktivieren:** `caveman full` zum Sitzungsprompt hinzufügen (bereits im Aktivierungsprompt oben enthalten).

**Komprimieren Sie Ihre Speicherdateien** — Dateien, die Claude jede Sitzung neu liest, werden zu Eingabe-Tokens:
```
/caveman-compress .claude/memory/project-context.md
```
~46 % Einsparungen bei Eingabe-Tokens pro Sitzung für komprimierte Dateien. Vollständige Implementierung: [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)

---

### 3. MCP-Disziplin — 30.000 Tokens bevor Sie ein Wort tippen

Jeder aktivierte MCP-Server lädt beim Sitzungsstart alle seine Tool-Definitionen in den Kontext. 10 MCP-Server ≈ 80 Tools ≈ **30.000 Tokens verbraucht, bevor Sie ein Wort tippen**.

**Überprüfen Sie Ihre aktiven MCPs:**
```bash
# Check what's enabled
cat ~/.claude/settings.json | grep -A2 mcpServers
cat .claude/settings.json | grep -A2 mcpServers 2>/dev/null
```

**Deaktivieren Sie jeden Server, den Sie in dieser Sitzung nicht verwenden werden.** Das Deaktivieren von 5 ungenutzten MCP-Servern spart ~15.000 Tokens — mehr als die meisten CLAUDE.md-Dateien verbrauchen.

---

### 4. Kontextverwaltung

**CLAUDE.md:**
- Halten Sie das Projekt-CLAUDE.md unter 300 Zeilen
- Entfernen Sie Regeln, die nicht mehr gelten
- Niemals Regeln auf Benutzerebene im Projekt-CLAUDE.md duplizieren

**Dateilesungen:**
- Fragen Sie nach spezifischen Zeilenbereichen: "read auth.py lines 45–90", nicht "read auth.py"
- Vermeiden Sie es, dieselbe große Datei zweimal zu lesen
- Verwenden Sie Subagents für Aufgaben, die das Lesen vieler Dateien erfordern, die die Hauptsitzung nicht benötigt

**Kompaktierung — früh auslösen, nicht bei 95 %:**
```
/compact
```
Kompaktieren Sie vor dem Wechsel zu einer neuen Hauptaufgabe, nach einer langen Debugging-Sitzung oder bevor Sie mit Arbeit beginnen, die das Lesen vieler großer Dateien erfordert. Warten Sie nicht auf die automatische Kompaktierung.

---

### 5. Cavecrew — günstige Agents für günstige Aufgaben

Starten Sie Haiku-basierte Subagents für begrenzte Aufgaben, anstatt Sonnet-Kontext zu verbrauchen:

| Rolle | Modell | Verwenden für |
|-------|--------|---------------|
| Ermittler | Haiku 4.5 | Dateien lokalisieren, Codebasis durchsuchen, schreibgeschützte Aufgaben |
| Ersteller | Sonnet 4.6 | Gezielte Änderungen in 1–3 Dateien |
| Prüfer | Haiku 4.5 | Diff oder Datei auf Probleme prüfen |
| Orchestrator | Opus 4.7 | Nur komplexe mehrstufige Koordination |

**~60 % Token-Einsparungen** gegenüber der Verwendung von Sonnet für jeden Subagent. Haiku für alles verwenden, bei dem die Aufgabe begrenzt und die Ausgabe überprüfbar ist.

---

### 6. Prompt-Effizienz

| Statt | Verwenden |
|-------|-----------|
| "Fix the authentication" | "Fix JWT expiry check in auth/middleware.py:45 — not rejecting expired tokens" |
| Fünf separate "add a test for X" | "Add tests for all five functions in utils.py" |
| "Explain this codebase" | "Explain how auth flows from login to session creation, max 3 paragraphs" |
| Langer Hin-und-her-Austausch | Verwandte Aufgaben in einem Prompt bündeln |

Vage Prompts → Erkundung → mehr Tool-Aufrufe → mehr Kontext verbraucht.
Spezifische Prompts → gezielte Antworten → weniger Tokens.

---

### 7. Sitzungskostenverfolgung

Verwenden Sie den `cost-tracker`-Hook, um die Token-Nutzung pro Tool-Aufruf zu sehen:
```bash
npx claudient add hooks
# Then add hooks/lifecycle/cost-tracker.sh to .claude/settings.json
```

Gibt Ihnen ein laufendes Protokoll der Eingabe-/Ausgabe-Tokens + geschätzte Kosten pro Sitzung. Verwenden Sie es, um zu identifizieren, welche Aufgaben am meisten verbrauchen — und optimieren Sie diese zuerst.

---

## Schnellreferenzkarte

| Situation | Aktion |
|-----------|--------|
| Start einer beliebigen Sitzung | Aktivierungsprompt oben einfügen |
| Einfache Bearbeitung, Lint, Formatierung | Zu Haiku 4.5 wechseln |
| Speicherdateien sind groß | caveman-compress darauf ausführen |
| Kontext wird langsam | `/compact` jetzt, nicht warten |
| Ungenutzte MCPs aktiviert | In settings.json deaktivieren |
| Wiederholende Aufgabe über Dateien | Haiku-Subagent, nicht Hauptsitzung |
| Vage Anfrage, lange Antwort | Als spezifischen, abgegrenzten Prompt umschreiben |
| Architektur-/Sicherheitsentscheidung | Zu Opus eskalieren — lohnt sich |

---
