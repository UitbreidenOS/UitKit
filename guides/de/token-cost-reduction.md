# 30–50% Token-Kostenreduktion

Praktische Strategien zur Kürzung von Claude Code und Claude API Token-Ausgaben, jede mit Mechanismus, Implementierungs-Schritte und realistischer Savings-Schätzung. Keine spekulativen Ratschläge — jede Strategie hier hat einen messbaren Effekt.

---

## Baseline: Wo Token gehen

Vor der Optimierung, wissen Sie, wofür Sie zahlen. Token-Ausgaben in einer typischen Claude Code-Sitzung brechen ungefähr auf:

| Quelle | Ungefähres Anteile |
|---|---|
| System-Prompt + CLAUDE.md (jeder Turn) | 10–30% |
| Konversations-History (wächst pro Turn) | 20–40% |
| Datei-Inhalte gelesen in Kontext | 20–40% |
| Output Tokens | 10–20% |

Die höchste-Leverage-Strategien zielten zuerst die größten Kategorien.

---

## Strategie 1: Prompt Caching

**Mechanismus:** Markieren Sie statischen Inhalt (System-Prompt, CLAUDE.md, große Referenz-Dokumente) als cacheierbar. Claude speichert diese für 5 Minuten (ephemeral) oder 1 Stunde (extended). Cache-Hits kosten 0.1× des normalen Input-Preises.

**Savings:** 60–90% auf cached Tokens für wiederholte Calls. In der Praxis, 20–40% der gesamten Session-Kosten.

**Implementierung (API):**

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,
      cache_control: { type: 'ephemeral' }  // 5-minute TTL
    }
  ],
  messages: conversationHistory
})
```

**Cache-Breakpoint-Platzierung:**
- Platzieren Sie Breakpoints am Ende von Inhalt, der zwischen Turns statisch bleibt
- System-Prompt → immer cacheierbar
- CLAUDE.md-Inhalt injiziert als Kontext → cacheierbar
- Datei-Inhalte, die sich in dieser Session nicht ändern → cacheierbar
- Konversations-History → NICHT cachen (ändert sich jeder Turn)

**Extended Cache (1-Stunden-TTL):** Verwenden Sie `{ type: 'ephemeral', ttl: 3600 }` für Dokumente, die über mehrere Sessions referenziert werden (große Codebases, lange Spezifikationen).

**Gotchas:**
- Minimum cacheierbare Block ist 1024 Token (Haiku) oder 2048 Token (Sonnet/Opus)
- Cache ist pro-Modell — Modell-Switches invalidieren den Cache
- Inhalt muss Byte-identisch sein zu Cache-Hit — auch eine Whitespace-Änderung misst

---

## Strategie 2: Haiku für mechanische Aufgaben

**Mechanismus:** Haiku kostet ungefähr 60% weniger als Sonnet pro Token. Aufgaben, die mechanische Transformation benötigen (Übersetzung, Klassifizierung, Extraktion, Formatierung) produzieren äquivalente Qualität auf Haiku ohne sinnvolle Degradation.

**Savings:** 50–65% auf Aufgaben-Typen unterhalb vs. Laufen auf Sonnet.

**Verwenden Sie Haiku für:**
- Übersetzungen (Sprach-Lokalisierung — siehe Claudients Übersetzungs-Pipeline)
- Eine Aufgabe oder Routing zu einem Specialist klassifizieren
- Strukturierte Daten aus Text extrahieren (JSON aus unstrukturiertem Inhalt)
- Einfaches Reformatieren (Markdown → HTML, JSON → CSV)
- Watchdog-Agenten (Beobachtung, nicht Reasoning)
- Test-Daten oder Fixture-Dateien generieren

**Verwenden Sie Sonnet für:**
- Code-Generierung und Review
- Architektur-Reasoning
- Debugging nicht-trivialer Bugs
- Jede Aufgabe, die Judgment über Trade-Offs benötigt

**Verwenden Sie Opus für:**
- High-Stakes Entscheidungen, die teuer zu rückgängig zu machen sind
- Komplexes Multi-Step Reasoning über große Codebases
- Research, die tiefe Synthese benötigt

**Implementierung in Claude Code:**

Setzen Sie Modell pro Agent in Ihrem Workflow:
```
Spawn Übersetzungs-Agent unter Verwendung claude-haiku-4-5:
  Übersetzen Sie die folgende Datei ins Französische...
```

Oder konfigurieren Sie in `settings.json` für spezifische Slash-Befehle, um Haiku standard zu werden.

---

## Strategie 3: Batch API

**Mechanismus:** Die Anthropic Batch API verarbeitet Anfragen asynchron mit 50% Rabatt. Anfragen werden innerhalb 24 Stunden abgeschlossen (normalerweise viel schneller).

**Savings:** 50% flacher Rabatt auf Batch-geeignete Arbeit.

**Wann verwenden:**
- Massen-Übersetzung vieler Dateien
- Derselben Prompt über viele Inputs laufen (100 PRs analysieren, 50 Tickets zusammenfassen)
- Non-Time-Sensitive Daten-Extraktion
- Generieren Test-Fixtures oder Seed-Daten in Skala

**Wann NICHT verwenden:**
- Interaktive Sessions (Sie benötigen eine Antwort jetzt)
- Aufgaben, bei denen die Ausgabe einer Anfrage die nächste füttert
- Einzelne Anfragen — Batch-Overhead ist nicht wert darunter ~10 Anfragen

**Implementierung:**
```python
batch = anthropic.messages.batches.create(
  requests=[
    {
      "custom_id": f"translate-{filename}",
      "params": {
        "model": "claude-haiku-4-5",
        "max_tokens": 4096,
        "messages": [{"role": "user", "content": file_content}]
      }
    }
    for filename, file_content in files_to_translate.items()
  ]
)
# poll batch.id until complete, then retrieve results
```

---

## Strategie 4: Programmatische Werkzeugaufrufe (PTC)

**Mechanismus:** Wenn ein Agent mehrere sequenzielle Werkzeugaufrufe macht, enthält jeder Round-Trip die volle Konversations-History. PTC (auch genannt Tool Streaming oder Parallel Tool Calling) batched mehrere Werkzeugaufrufe in einem Turn, den Anzahl der History-tragenden Round-Trips reduzierend.

**Savings:** Bis zu 37% weniger Input-Tokens für Multi-Tool-Workflows.

**Wenn es anwendet:**
- Agenten, die 3+ Dateien lesen vor dem Tun von irgendwas
- Untersuch-Aufgaben, die mehrere Datenquellen abfragen
- Jeder Workflow mit einer "Gather dann Act"-Struktur

**Implementierung:**
```typescript
// Statt: read file A → get result → read file B → get result → read file C
// Verwenden Sie: request all three reads in one turn
const tools = [readFileTool, readFileTool, readFileTool]
// Claude gibt alle drei in einer einzelnen Antwort zurück; Sie verarbeiten Sie zusammen
```

In Claude Code, dies ist automatisch bearbeitet, wenn Sie Claude instruieren, mehrere Dateien gleichzeitig zu lesen statt eine nach der anderen:
```
Lesen Sie alle der folgenden Dateien, bevor Sie antworten: [list Dateien]
```

---

## Strategie 5: Aufgeschobenes Werkzeug-Laden

**Mechanismus:** Statt jedes Werkzeugs vollständigen Schema am Start einer Session zu laden, laden Sie nur die Schemas, die für die aktuelle Aufgabe benötigt werden. Werkzeug-Schemas verbrauchen Input-Tokens bei jedem Turn.

**Savings:** 85% Reduktion in Werkzeug-Schema Token-Overhead für große Werkzeug-Kataloge.

**Angewendet wenn:** Sie haben 10+ MCP-Werkzeuge registriert oder einen großen benutzerdefinierten Werkzeug-Katalog.

**Implementierung mit ToolSearch:**
```
Laden Sie nicht alle Werkzeuge beim Session-Start.
Laden Sie nur [spezifische Werkzeuge] für diese Aufgabe.
Wenn die Aufgabe ändert, laden Sie [verschiedenes Werkzeug-Set].
```

In MCP Config, vermeiden Sie, jeden Server global zu registrieren — verwenden Sie Project-Level MCP-Configs, damit nur relevante Werkzeuge pro Project aktiv sind.

---

## Strategie 6: Output-Längen-Kontrolle

**Mechanismus:** Output-Tokens kosten das Gleiche wie Input-Tokens (oder mehr auf einigen Models). Verbose Antworten verschwenden Geld und verlangsamen Sessions.

**Savings:** 15–30% auf Output-Heavy Sessions.

**CLAUDE.md Instruktionen zum Hinzufügen:**
```
Wenn Sie mir antwortet:
- Geben Sie mir die Antwort, nicht das Reasoning, es sei denn, ich frage nach Reasoning
- Kein Preamble ("Sure, I'll help you with that...")
- Keine Zusammenfassung am Ende wiederholend, was gerade getan wurde
- Code Blocks: keine Prosa vor oder nach es sei denn, die Prosa fügt Informationen hinzu
- Listen: verwenden Sie, wenn es 3+ Items gibt; Prosa für 1-2
- Ein Satz ist besser als ein Absatz wenn beide dieselbe Information vermitteln
```

**API-Level Kontrolle:**
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,  // set an upper bound appropriate to the task
  system: "Be concise. Answer directly. No preamble.",
  messages: [...]
})
```

---

## Strategie 7: Kontext-Pruning

**Mechanismus:** Konversations-History wächst mit jedem Turn. Nach einer langen Session, History kann Input-Token-Anzahl dominieren.

**Takten:**

`/compact` mit einem Hinweis (Claude Code eingebaut):
```
/compact Fokus auf die Authentication-Änderungen, die wir machten — verwerfen Sie alles über die UI-Diskussion
```

Subagent-Isolation — spawnen Sie einen Subagent für eine Subtask, damit es mit einem frischen Kontextfenster startet:
```
Der Parent-Agent gibt nur eine Eins-Absatz-Zusammenfassung der Session zu dem Subagent,
nicht die volle History. Subagent macht seine Arbeit und gibt Ergebnisse an Parent zurück.
```

Explizite Kontext-Drops:
```
Vergessen Sie die Datei-Analyse, die wir auf orders.ts machten — es ist nicht mehr relevant. 
Folgend fokus auf das Payments-Modul nur.
```

---

## Strategie 8: CLAUDE.md Größen-Impact

**Mechanismus:** CLAUDE.md ist geladen am Start jeder Claude Code-Session. Jede Zeile, die Sie hinzufügen kostet Tokens bei jedem Session-Start, für jeden Benutzer.

**Savings:** Variiert mit Dateigröße. Eine 300-Zeilen-CLAUDE.md gekürzt auf 150 Zeilen spart ~150 Tokens × Sessions pro Monat.

**Ziel:** Behalten Sie CLAUDE.md unter 2000 Tokens (ungefähr 150–180 Zeilen dichter Prosa oder 250 Zeilen gemischter Inhalt).

**Verwenden Sie den Context-Auditor Prompt** (`prompts/task-specific/context-auditor.md`) um Ihre CLAUDE.md ohne Einziehen eindeutiger Guidance zu trimmen.

**Regeln für CLAUDE.md Economy:**
- Ein Instruction pro Zeile wo möglich
- Keine Erklärungen, warum eine Konvention existiert (nur die Konvention)
- Keine Instruktionen, die Claude standardmäßig folgt (keine "schreiben Sie sauberen Code")
- Verwenden Sie Links zu externen Docs statt sie einbettend

---

## Kostenrechner-Referenz

Ungefähre Kosten bei Mai 2026 Pricing. Prüfen Sie Anthropics Pricing-Seite für aktuelle Raten.

| Modell | Input ($/MTok) | Output ($/MTok) | Cache Hit ($/MTok) |
|---|---|---|---|
| Haiku 4.5 | ~$0.80 | ~$4.00 | ~$0.08 |
| Sonnet 4.6 | ~$3.00 | ~$15.00 | ~$0.30 |
| Opus 4.7 | ~$15.00 | ~$75.00 | ~$1.50 |

**Beispiel Session-Kostenrechnung:**

10 Turns, 5k Tokens Input pro Turn (inklusive 2k gecachter System-Prompt), 500 Tokens Output pro Turn, Sonnet:

- Ohne Caching: 10 × 5000 × $0.000003 + 10 × 500 × $0.000015 = $0.15 + $0.075 = **$0.225**
- Mit Caching (2k Tokens gecacht): 10 × 3000 × $0.000003 + 10 × 2000 × $0.0000003 + 10 × 500 × $0.000015 = $0.09 + $0.006 + $0.075 = **$0.171** — 24% Saving

**Kombinierter Strategie-Impact:**

| Strategie | Savings | Komplexität |
|---|---|---|
| Prompt Caching | 20–40% | Niedrig |
| Haiku für mechanische Aufgaben | 50–65% auf geeignete Aufgaben | Niedrig |
| Batch API | 50% Flat | Mittel |
| PTC / Parallel Tool Calls | Bis zu 37% auf Tool-Heavy Sessions | Niedrig |
| Aufgeschobenes Werkzeug-Laden | Bis zu 85% auf Schema-Overhead | Mittel |
| Output-Längen-Kontrolle | 15–30% | Niedrig |
| Kontext-Pruning | 10–25% auf lange Sessions | Niedrig |
| CLAUDE.md Trimmen | 5–15% | One-Time |

Die Anwendung aller Low-Complexity-Strategien zusammen erreicht typischerweise 30–50% gesamte Kostenreduktion ohne die Qualität der Ergebnisse zu ändern.

---
