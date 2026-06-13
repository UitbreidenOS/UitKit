---
description: Generieren Sie ein Test-Harness zur Evaluierung eines LLM-Prompts oder einer Chain anhand eines Datensatzes
argument-hint: "[Prompt-Datei oder Beschreibung der zu evaluierenden Aufgabe]"
---
Sie erstellen ein LLM-Evaluierungs-Harness für die in $ARGUMENTS beschriebene Aufgabe.

Lesen Sie alle angegebenen Dateipfade. Falls eine reine Beschreibung gegeben ist, leiten Sie die Aufgabe ab.

**Schritt 1 — Evaluierungsanforderungen identifizieren**

Bestimmen Sie:
- Aufgabentyp: Klassifizierung, Extraktion, Generierung, RAG, Tool-Nutzung, Multi-Turn oder andere
- Wie „korrekt" aussieht: exakte Übereinstimmung, semantische Übereinstimmung, Rubrik-Bewertung, strukturierte Schema-Validierung oder Mensch-in-der-Schleife
- Fehlermodi, die es zu erfassen gilt: Halluzination, Ablehnung, Format-Verletzung, Latenz, Token-Überfluss

**Schritt 2 — Test-Datensatz-Schema entwerfen**

Geben Sie ein JSONL-Schema für Testfälle aus. Jeder Datensatz muss enthalten:
- `id`: eindeutige Zeichenkette
- `input`: die Benutzermeldung oder vollständiger Prompt-Kontext (Systemprompt einbeziehen, falls relevant)
- `expected`: Ground Truth oder Rubrik (Form an Aufgabentyp anpassen)
- `tags`: Array von Zeichenketten zum Filtern (z. B. `["edge-case", "language:fr"]`)

Zeigen Sie 3–5 repräsentative Beispieldatensätze mit: erfolgreicher Pfad, Grenzfall, adversarieller Input.

**Schritt 3 — Harness-Skript generieren**

Schreiben Sie ein eigenständiges Python-Skript mit dem Anthropic SDK (`anthropic`-Paket). Anforderungen:
- Testfälle von `evals.jsonl` laden
- Für jeden Fall das Modell aufrufen (Standard: `claude-sonnet-4-6`, überschreibbar mit `--model`)
- Jedes Ergebnis mit dem passenden Evaluator bewerten:
  - Exakte/Regex-Übereinstimmung für strukturierte Ausgaben
  - Embedding-Kosinus-Ähnlichkeit für semantische Aufgaben (use `sentence-transformers` falls verfügbar, sonst überspringen)
  - LLM-as-Judge-Rubrik-Bewertung für offene Generierung (eigenständig, `claude-haiku-4-5-20251001` nutzen)
- Ergebnis-JSONL und eine Zusammenfassungstabelle auf stdout ausgeben
- Flag `--sample N` unterstützen, um auf N zufälligen Fällen zu laufen
- `asyncio` + `AsyncAnthropic` für parallele Ausführung mit konfigurierbarem Concurrency-Limit verwenden

**Schritt 4 — CI-Integrations-Snippet**

Zeigen Sie einen GitHub Actions-Schritt, der:
- Das Harness auf jedem PR ausführt
- Den Check fehlschlagen lässt, wenn die Erfolgsquote unter einen konfigurierbaren Schwellenwert fällt (Standard 90%)
- Eine Zusammenfassungskommentar mit Pro-Tag-Aufschlüsselungen postet

**Ausgabeformat:**
1. Datensatz-Schema + Beispieldatensätze (JSONL)
2. Vollständiges Python-Harness (`eval_harness.py`)
3. GitHub Actions YAML-Snippet
4. Ein-Zeilen-`README`-Nutzungsblock

Keine Platzhalter-Kommentare. Jede Funktion muss implementiert sein.
