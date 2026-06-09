---
description: Überprüfe einen Prompt oder eine LLM-Pipeline auf Token-Verschwendung und wende gezielte Reduktionen an
argument-hint: "[prompt file, chain file, or code path]"
---
Überprüfe den Prompt oder die Pipeline unter $ARGUMENTS auf Token-Ineffizienz und erstelle eine optimierte Version.

Lese alle bereitgestellten Dateipfade. Wenn das Argument ein Verzeichnis ist, scanne nach `.py`, `.ts`, `.md` Dateien, die Prompt-Strings oder LLM-Aufrufe enthalten.

**Audit-Dimensionen — überprüfe jede:**

**1. Prompt-Verbosität**
- Füllphrasen, die Token ohne zusätzliche Einschränkungen hinzufügen ("As an AI language model", "Of course!", "Certainly")
- Wiederholte Anweisungen, die sowohl in System- als auch in Benutzernachrichten vorkommen
- Redundante Beispiele, die identische Fälle abdecken
- Prosa-Anweisungen, die als Aufzählungsliste mit der Hälfte der Token dargestellt werden könnten

**2. Context-Window-Missbrauch**
- Vollständiges Dokument übergeben, wenn nur ein Abschnitt erforderlich ist — mit geschätztem Einsparungspotenzial kennzeichnen
- Chat-Verlauf wörtlich eingefügt, wenn eine Zusammenfassung ausreichen würde
- Duplizierter Inhalt: derselbe Text, der zweimal unter verschiedenen Schlüsseln eingefügt ist

**3. Caching-Möglichkeiten**
- Statische Prompt-Segmente identifizieren (Systemprompt, statischer Kontext, Few-Shot-Beispiele), die `cache_control: {"type": "ephemeral"}` in der Anthropic API verwenden sollten
- Kennzeichnen, wenn das Cache-geeignete Segment < 1024 Token ist (unter der minimalen Cache-Schwelle — kein Nutzen)
- Die umstrukturierte Nachrichtenarray mit korrekt platzierten Cache-Blöcken anzeigen

**4. Ausgabelänge**
- Ist `max_tokens` festgelegt? Falls nicht, als unbegrenztes Kostenrisiko kennzeichnen
- Verlangt der Prompt nach Erklärung, wenn nur strukturierte Daten erforderlich sind?
- Würde ein kürzeres Ausgabeformat (JSON vs. Prosa, nur Code vs. Code+Erklärung) die Generierungskosten senken?

**5. Model-Tier-Passung**
- Verwendet die Aufgabe `claude-sonnet-4-6` oder `claude-opus-4-7` für Arbeiten, die `claude-haiku-4-5-20251001` mit 10x niedrigeren Kosten bewältigen kann?
- Klassifiziere Aufgabenkomplexität: einfache Extraktion/Klassifizierung → Haiku; Reasoning/Generierung → Sonnet; komplexe Multi-Step → Opus

**Ausgabeformat:**

```
## Token audit summary
| Issue | Location | Est. token impact | Priority |
|-------|----------|-------------------|----------|
| ...   | ...      | ...               | H/M/L    |

## Optimized prompt / chain
<full rewritten version with changes applied>

## Caching configuration
<message array snippet showing cache_control placement, if applicable>

## Estimated savings
Before: ~N tokens/call  →  After: ~M tokens/call  (~X% reduction)
At 1000 calls/day on [model]: $Y/month savings
```

Wende alle Fixes mit hoher Priorität direkt in der Ausgabe an. Erkläre Elemente mit mittlerer/niedriger Priorität, wende sie aber nicht ohne Rückfrage an.
