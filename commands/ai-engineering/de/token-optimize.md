---
description: Audit eines Prompts oder einer LLM-Pipeline auf Token-Verschwendung und Anwendung gezielter Reduzierungen
argument-hint: "[Prompt-Datei, Chain-Datei oder Code-Pfad]"
---
Audit des Prompts oder der Pipeline unter $ARGUMENTS auf Token-Ineffizienz und Erstellung einer optimierten Version.

Lese alle bereitgestellten Dateipfade. Wenn das Argument ein Verzeichnis ist, scanne nach `.py`, `.ts`, `.md` Dateien mit Prompt-Strings oder LLM-Aufrufen.

**Audit-Dimensionen — überprüfe jede:**

**1. Prompt-Weitschweifigkeit**
- Füllwörter, die Token hinzufügen, ohne Einschränkungen hinzuzufügen ("Als KI-Sprachmodell", "Natürlich!", "Sicherlich")
- Wiederholte Anweisungen, die sowohl in System- als auch in Benutzermeldung vorkommen
- Redundante Beispiele, die identische Fälle abdecken
- Prosa-Anweisungen, die als Aufzählungsliste mit halben Token sein könnten

**2. Context-Window-Missbrauch**
- Vollständiges Dokument übergeben, obwohl nur ein Abschnitt benötigt wird — mit geschätzten Einsparungen kennzeichnen
- Chat-Verlauf wörtlich enthalten, wenn eine Zusammenfassung ausreichen würde
- Duplizierter Inhalt: gleicher Text unter verschiedenen Schlüsseln enthalten

**3. Caching-Möglichkeiten**
- Identifiziere statische Prompt-Segmente (System-Prompt, statischer Kontext, Few-Shot-Beispiele), die `cache_control: {"type": "ephemeral"}` in der Anthropic API verwenden sollten
- Kennzeichne, wenn das Cache-berechtigte Segment < 1024 Token ist (unter dem minimalen Cache-Schwellenwert — kein Vorteil)
- Zeige das umstrukturierte Message-Array mit korrekt platzierten Cache-Blöcken

**4. Output-Länge**
- Ist `max_tokens` gesetzt? Falls nicht, kennzeichne als unbegrenztes Kostenrisiko
- Fragt der Prompt nach Erklärung, wenn nur strukturierte Daten benötigt werden?
- Würde ein kürzeres Output-Format (JSON vs. Prosa, nur Code vs. Code+Erklärung) die Generierungskosten reduzieren?

**5. Modell-Tier-Passung**
- Nutzt die Aufgabe `claude-sonnet-4-6` oder `claude-opus-4-7` für Arbeit, die `claude-haiku-4-5-20251001` zu 10x niedrigeren Kosten handhaben kann?
- Klassifiziere Aufgabenkomplexität: einfache Extraktion/Klassifizierung → Haiku; Reasoning/Generierung → Sonnet; komplexe Multi-Schritt → Opus

**Output-Format:**

```
## Token-Audit-Zusammenfassung
| Problem | Ort | Geschätzte Token-Auswirkung | Priorität |
|---------|-----|---------------------------|-----------|
| ...     | ... | ...                       | H/M/L     |

## Optimierter Prompt / Chain
<vollständig neu geschriebene Version mit angewendeten Änderungen>

## Caching-Konfiguration
<Message-Array-Snippet mit cache_control-Platzierung, falls zutreffend>

## Geschätzte Einsparungen
Vorher: ~N Token/Aufruf  →  Nachher: ~M Token/Aufruf  (~X% Reduktion)
Bei 1000 Aufrufen/Tag auf [Modell]: $Y/Monat Einsparungen
```

Wende alle hochprioratären Fixes direkt im Output an. Erkläre mittlere/niedrige Priorität-Elemente, wende sie aber nicht ohne Rückfrage an.
