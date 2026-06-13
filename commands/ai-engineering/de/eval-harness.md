---
description: Generieren Sie ein Test-Harness zur Evaluierung eines LLM-Prompts oder einer Chain gegen einen Datensatz
argument-hint: "[Promptdatei oder Beschreibung der zu evaluierenden Aufgabe]"
---
Sie bauen ein LLM-Evaluierungs-Harness für die in $ARGUMENTS beschriebene Aufgabe.

Lesen Sie alle angegebenen Dateipfade. Falls eine reine Beschreibung gegeben ist, leiten Sie die Aufgabe ab.

**Schritt 1 — Evaluierungsanforderungen identifizieren**

Bestimmen Sie:
- Aufgabentyp: Klassifizierung, Extraktion, Generierung, RAG, Tool-Verwendung, Multi-Turn oder andere
- Wie "korrekt" aussieht: exakte Übereinstimmung, semantische Übereinstimmung, Rubric-Score, strukturierte Schema-Validierung oder Human-in-the-Loop
- Fehlermodi, die es zu erkennen gilt: Halluzination, Ablehnung, Formatverletzung, Latenz, Token-Überschreitung

**Schritt 2 — Das Test-Datensatz-Schema entwerfen**

Geben Sie ein JSONL-Schema für Testfälle aus. Jeder Datensatz muss enthalten:
- `id`: eindeutige Zeichenkette
- `input`: die Benutzernachricht oder der vollständige Prompt-Kontext (Systemprompt einbeziehen, falls relevant)
- `expected`: Grundwahrheit oder Rubric (Form an Aufgabentyp anpassen)
- `tags`: Array von Zeichenketten zum Filtern (z.B. `["edge-case", "language:fr"]`)

Zeigen Sie 3–5 repräsentative Beispieldatensätze, die abdecken: Happy Path, Edge Case, gegnerischer Input.

**Schritt 3 — Das Harness-Skript generieren**

Schreiben Sie ein eigenständiges Python-Skript mit dem Anthropic SDK (`anthropic`-Paket). Anforderungen:
- Laden Sie Testfälle aus `evals.jsonl`
- Rufen Sie das Modell für jeden Fall auf (Standard: `claude-sonnet-4-6`, überschreibbar über `--model`)
- Bewerten Sie jedes Ergebnis mit dem entsprechenden Evaluator:
  - Exakte/Regex-Übereinstimmung für strukturierte Ausgaben
  - Embedding-Kosinus-Ähnlichkeit für semantische Aufgaben (verwenden Sie `sentence-transformers`, falls verfügbar, ansonsten überspringen)
  - LLM-as-Judge Rubric-Scoring für offene Generierung (eigenständig, verwenden Sie `claude-haiku-4-5-20251001`)
- Geben Sie eine JSONL-Ergebnisdatei und eine Zusammenfassungstabelle auf stdout aus
- Unterstützen Sie Flag `--sample N` zum Ausführen auf N zufälligen Fällen
- Verwenden Sie `asyncio` + `AsyncAnthropic` für parallele Ausführung mit einem konfigurierbaren Parallelisierungslimit

**Schritt 4 — CI-Integrations-Snippet**

Zeigen Sie einen GitHub Actions-Schritt, der:
- Das Harness bei jedem PR ausführt
- Den Check fehlschlagen lässt, wenn die Erfolgsquote unter einen konfigurierbaren Schwellwert fällt (Standard 90%)
- Einen Zusammenfassungskommentar mit Pro-Tag-Aufschlüsselungen postet

**Ausgabeformat:**
1. Datensatz-Schema + Beispieldatensätze (JSONL)
2. Vollständiges Python-Harness (`eval_harness.py`)
3. GitHub Actions YAML-Snippet
4. Einzeilige `README` Verwendungsblock

Keine Platzhalter-Kommentare. Jede Funktion muss implementiert sein.
