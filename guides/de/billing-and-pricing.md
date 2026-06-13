# Billing and Pricing — Claude Plans, Agent SDK Credits, and Cost Management

Eine praktische Referenz zum Verständnis von Claudes Abonnementtarifen, der Abrechnungsteilung vom 15. Juni, API-Token-Gebühren und Kostenoptimierungsstrategien.

---

## Übersicht der Pläne

| Plan | Monatlicher Preis | Interaktive Limits | Agent SDK Credits |
|---|---|---|---|
| **Pro** | $20/mo | Standard | $20/mo |
| **Max 5×** | $100/mo | 5× Standard | $100/mo |
| **Max 20×** | $200/mo | 20× Standard | $200/mo |
| **Team** | Pro Benutzer | Gemeinsamer Pool | Separate API-Abrechnung |
| **Enterprise** | Pro Benutzer | Verhandelt | Separate API-Abrechnung |

**Team- und Enterprise-Konten** verwenden Preisgestaltung pro Benutzer mit API-Abrechnung zu Token-Sätzen — es gibt keinen festen Agent SDK-Kreditpool. Der gesamte Token-Verbrauch wird direkt gegen die API abgerechnet.

---

## Die Abrechnungsänderung vom 15. Juni 2026

> **Diese Änderung betrifft alle Pro- und Max-Abonnenten.** API-Key-Benutzer (kein Abonnement) sind nicht betroffen — sie werden schon immer pro Token abgerechnet.

Vor dem 15. Juni 2026: `claude -p` (Print-Modus), Agent SDK-Sessions und Managed Agent-Sessions zogen alle aus demselben Pool wie interaktive Claude-Chat und Claude Code-Terminal-Sessions.

Nach dem 15. Juni 2026: **Zwei separate Pools.**

### Pool 1 — Interaktiver Pool
Deckt ab:
- Claude.ai-Chat-Sessions
- Claude Code-Terminal-Sessions (`claude` in Ihrem Terminal, interaktiver Modus)

### Pool 2 — Agent SDK-Kreditpool
Deckt ab:
- `claude -p` (Print-Modus / nicht-interaktiv)
- Agent SDK-Sessions (programmgesteuerte API-Aufrufe)
- Managed Agent-Sessions (Cloud-gehostete Agents via `client.beta.sessions`)

### Was dies in der Praxis bedeutet

- Sie können `claude -p`-Skripte, Pipelines und Automationen den ganzen Monat über ausführen, ohne Ihre interaktiven Chat-Limits zu berühren.
- Agent SDK-Gutschriften **werden nicht** monatlich übertragen. Ungenutzte Guthaben verfallen am Ende des Abrechnungszeitraums.
- Wenn Sie das Agent SDK-Kreditlimit überschreiten, geben nachfolgende Aufrufe ein `429` mit `X-Limit-Pool: agent_sdk` im Response-Header zurück. Die interaktive Nutzung ist nicht betroffen.
- API-Key-Benutzer: keine Änderung. Abrechnung pro Token wie bisher — keine Pools, kein Übertrag.

### Überwachung der Nutzung

```bash
# In Claude Code — zeigt eine Aufschlüsselung nach Kategorie
/usage
```

Die `/usage`-Ausgabe zeigt jetzt zwei Zeilen: `interactive` und `agent_sdk`, jeweils mit verwendeten Tokens und verbleibender Zulage. Überprüfen Sie dies, bevor Sie große Batch-Jobs ausführen, um zu bestätigen, dass Sie ausreichende Agent SDK-Guthaben haben.

Die Claude.ai-Nutzungsseite (Settings → Usage) verfolgt auch monatliche Limits pro Pool mit einem Fortschrittsbalken für jeden.

---

## API-Preisgestaltung (API-Key-Benutzer)

Abgerechnet pro Token. Kein Abonnement erforderlich. Sätze ab Juni 2026:

### Input / Output Sätze

| Modell | Input (pro 1M Tokens) | Output (pro 1M Tokens) |
|---|---|---|
| Claude Opus 4.7 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $0.25 | $1.25 |

### Prompt Cache Sätze

| Cache-Operation | Multiplikator des Input-Preises |
|---|---|
| Cache Read | 0.1× (90% Rabatt) |
| Cache Write | 1.25× (25% Aufschlag beim ersten Schreiben) |

Caching ist netto-positiv, wenn Sie mit mehr als 1 Read pro Write rechnen. Zu Opus 4.7-Sätzen: Ein 100K-Token-Kontext kostet $0,50 zum Schreiben in den Cache und $0,05 pro Cache-Read. Gewinnschwelle bei 1,25 Reads; jeder Read danach spart $0,45.

### Batch API

Die Batch API verarbeitet Anfragen asynchron und gibt Ergebnisse innerhalb von 24 Stunden zurück. Rabatt: **50% Rabatt auf Standard-Sätze** für Input- und Output-Tokens. Verwenden Sie sie für:
- Klassifizierungsjobs
- Massen-Dokumentverarbeitung
- Overnight-Analysepipelines
- Beliebige Arbeitslasten, bei denen Latenz keine Einschränkung ist

---

## Kostenoptimierungsstrategien

### 1. Haiku für mechanische Aufgaben verwenden

Haiku 4.5 ist ungefähr 12× billiger als Opus 4.7 bei Input-Tokens. Für Aufgaben, die keine Argumentation erfordern — Klassifikation, Zusammenfassung, Template-Ausfüllung, Übersetzung, Extraktion aus strukturierten Daten — produziert Haiku gleichwertige Ergebnisse zu einem Bruchteil der Kosten.

Faustregel: Wenn Sie dafür einen Regex schreiben könnten, verarbeitet Haiku es. Wenn die Aufgabe mehrstufiges Nachdenken oder Urteilsvermögen erfordert, greifen Sie zu Sonnet oder Opus.

### 2. Prompt Caching für wiederholte große Kontexte

Alle Kontextblöcke, die sich über Aufrufe wiederholen — Systemaufforderungen, große Codebasen, Referenzdokumente, Tool-Schemas — sollten zwischengespeichert werden. Zu einem Cache-Read-Satz von 0,1×, eine 200K-Token-Systemaufforderung kostet $1,00 zum einmaligen Schreiben und $0,10 pro Read danach.

Cache-Writes sind explizit: Verwenden Sie den Marker `cache_control: {"type": "ephemeral"}` auf dem Content-Block. Zwischengespeicherte Inhalte haben eine TTL von 5 Minuten, die bei jedem Read zurückgesetzt wird.

### 3. Batch API für zeitlich nicht kritische Arbeitslasten

Wenn eine Pipeline bis zu 24 Stunden Latenz tolerieren kann, leiten Sie sie durch die Batch API. 50% Rabatt auf alle Modelle. Großflächig reduziert dies Ihre API-Ausgaben für asynchrone Jobs um die Hälfte.

### 4. Output-Längenkontrolle

Output-Tokens kosten 5× mehr als Input-Tokens zum gleichen Satz. Weisen Sie das Modell an, prägnant zu sein, wenn Sie nur strukturierte Ausgabe oder kurze Antworten benötigen. Fügen Sie Ihrer Systemaufforderung hinzu:

```
Respond with only what was asked. Do not add explanations, caveats, or summaries unless explicitly requested.
```

Für Extraktionsaufgaben: Weisen Sie JSON-Only-Ausgabe ohne umgebende Prosa an.

### 5. Verzögerte Tool-Laden

Das Auflisten von 50+ Tools in einer Systemaufforderung kann 10K–20K Tokens Kontext pro Aufruf hinzufügen. Das deferred tool loading Muster von Claude Code lädt Tool-Schemas nur, wenn Claude sie anfordert, und reduziert dadurch die Startup-Kontext um bis zu 85% für große Tool-Kataloge.

Siehe `guides/token-cost-reduction.md` für das deferred loading Implementierungsmuster.

### 6. Agent SDK Gutschriften vor API-Keys für Scripting verwenden

Wenn Sie ein Max-Abonnement haben, ist Ihr Agent SDK-Kreditpool bezahlt. Die Ausführung von `claude -p`-Skripten gegen Ihr Abonnement kostet nichts extra, bis der Kreditpool aufgebraucht ist. Greifen Sie nur auf direkte API-Key-Abrechnung zurück, wenn Ihr Kreditpool aufgebraucht ist oder für Arbeitslasten, die das Kreditlimit überschreiten.

---

## Überwachung

| Werkzeug | Was es anzeigt |
|---|---|
| `/usage` in Claude Code | Aktuelle Session-Token-Nutzung nach Kategorie (interactive / agent_sdk) |
| Claude.ai → Settings → Usage | Monatliche Limits, Per-Pool-Fortschrittsbälkchen |
| `hooks/post-tool-use/cost-tracker.sh` | Per-Session-Kostenprotokollierung via PostToolUse-Hook |

Für API-Key-Benutzer bietet die Anthropic Console (console.anthropic.com) tägliche Token-Nutzung aufgeschlüsselt nach Modell und einen Ausgabengraphen für den Abrechnungszeitraum.

---
