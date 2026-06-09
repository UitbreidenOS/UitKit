---
description: Generiere ein Test-Harness, um einen LLM-Prompt oder eine Kette gegen einen Datensatz zu evaluieren
argument-hint: "[prompt file or description of the task being evaluated]"
---
Du erstellst ein LLM-Evaluierungs-Harness für die in $ARGUMENTS beschriebene Aufgabe.

Lese alle angegebenen Dateipfade. Wenn eine einfache Beschreibung gegeben wird, leite die Aufgabe ab.

**Schritt 1 — Evaluierungsanforderungen identifizieren**

Bestimme:
- Aufgabentyp: Klassifikation, Extraktion, Generierung, RAG, Werkzeuggebrauch, Multi-Turn oder andere
- Was "richtig" aussieht: exakte Übereinstimmung, semantische Übereinstimmung, Rubric-Score, Validierung strukturierter Schemata oder Mensch-in-der-Schleife
- Fehlermodi, die es zu beachten gilt: Halluzination, Ablehnung, Formatverletzung, Latenz, Token-Überlauf

**Schritt 2 — Datensatzschema für Tests entwerfen**

Gib ein JSONL-Schema für Testfälle aus. Jeder Datensatz muss enthalten:
- `id`: eindeutige Zeichenkette
- `input`: die Benutzernachricht oder der vollständige Prompt-Kontext (beziehe Systemprompt ein, falls relevant)
- `expected`: Ground Truth oder Rubric (passe die Form an den Aufgabentyp an)
- `tags`: Array von Zeichenketten zum Filtern (z. B. `["edge-case", "language:fr"]`)

Zeige 3–5 repräsentative Beispieldatensätze, die abdecken: Happy Path, Edge Case, adversarielle Eingabe.

**Schritt 3 — Harness-Skript generieren**

Schreibe ein eigenständiges Python-Skript mit dem Anthropic SDK (`anthropic`-Paket). Anforderungen:
- Lade Testfälle aus `evals.jsonl`
- Rufe das Modell für jeden Fall auf (Standard: `claude-sonnet-4-6`, überschreibbar via `--model`)
- Bewerte jedes Ergebnis mit dem passenden Evaluator:
  - Exakte/Regex-Übereinstimmung für strukturierte Ausgaben
  - Embedding-Kosinus-Ähnlichkeit für semantische Aufgaben (verwende `sentence-transformers` falls verfügbar, sonst überspringe)
  - LLM-als-Richter-Rubric-Scoring für offene Generierung (eigenständig, verwende `claude-haiku-4-5-20251001`)
- Gebe eine Results-JSONL und eine Summary-Tabelle auf stdout aus
- Unterstütze `--sample N`-Flag, um auf N zufälligen Fällen zu laufen
- Verwende `asyncio` + `AsyncAnthropic` für parallele Ausführung mit konfigurierbarem Concurrency-Limit

**Schritt 4 — CI-Integrations-Snippet**

Zeige einen GitHub Actions-Schritt, der:
- Das Harness bei jedem PR ausführt
- Den Check fehlschlagen lässt, wenn die Pass-Rate unter einen konfigurierbaren Schwellenwert fällt (Standard 90%)
- Einen Summary-Kommentar mit Pro-Tag-Aufschlüsselungen postet

**Ausgabeformat:**
1. Datensatzschema + Beispieldatensätze (JSONL)
2. Vollständiges Python-Harness (`eval_harness.py`)
3. GitHub Actions YAML-Snippet
4. Einzeiliger `README`-Verwendungsblock

Keine Platzhalter-Kommentare. Jede Funktion muss implementiert sein.
