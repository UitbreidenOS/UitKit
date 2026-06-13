# Kostenoptimierungsleitfaden

Praktische Strategien zur Reduzierung von Claude API- und Claude Code-Kosten ohne Qualitätseinbußen.

## Verstehen, was die Kosten antreibt

Claude-Preise basieren auf **Token** (Eingabe + Ausgabe). Kosten = Token × Preis pro Token.

**Was die Kosten erhöht:**
- Lange Systemaufforderungen, die bei jedem Aufruf wiederholt werden
- Große Dateiinhalte, die als Kontext übergeben werden
- Lange Gesprächshistorien
- Ausführliche, mehrabsätzige Antworten
- Wiederholte Werkzeugaufrufe, die dieselben Dateien erneut lesen
- Verwendung von Opus, wenn Sonnet ausreichen würde

**Claude-Modell-Preisgestaltung (ungefähr, Mai 2026):**
| Modell | Eingabe | Ausgabe | Am besten für |
|---|---|---|---|
| Haiku 4.5 | am günstigsten | am günstigsten | Einfache Aufgaben, hohes Volumen |
| Sonnet 4.6 | mittel | mittel | Die meiste Arbeit — Standardwahl |
| Opus 4.7 | am teuersten | am teuersten | Komplexes Denken, kritische Aufgaben |

**Faustregel:** Verwenden Sie das günstigste Modell, das eine akzeptable Qualität für Ihre Aufgabe liefert.

## Prompt-Caching

Claude API unterstützt Prompt-Caching — cachieren Sie Ihre Systemaufforderung und statische Kontexte, damit Sie nicht den vollständigen Preis bei jedem Aufruf zahlen.

```typescript
// Ohne Caching: vollständiger Eingabepreis bei jedem Aufruf
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: longSystemPrompt,  // jedes Mal berechnet
  messages: [{ role: 'user', content: query }],
})

// Mit Caching: Systemaufforderung nach erstem Aufruf gecacht (90% Rabatt auf gecachte Token)
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: longSystemPrompt,
      cache_control: { type: 'ephemeral' }  // dies bis zu 5 Minuten cachen
    }
  ],
  messages: [{ role: 'user', content: query }],
})
```

**Wann Caching verwenden:**
- Gleiche Systemaufforderung wird für mehrere Anfragen verwendet (Chatbot, Multi-Turn-Konversationen)
- Großes Dokument, das mehrere Abfragen referenzieren
- Tool-Definitionen, die sich zwischen Aufrufen nicht ändern

**Ersparnisse:** 90% Rabatt auf gecachte Eingabe-Token. 5-Minuten-TTL (ephemeres Caching).

## Richtige Modellgröße

Die meiste Arbeit benötigt kein Opus. Ein praktischer Leitfaden:

| Aufgabe | Empfohlenes Modell |
|---|---|
| Übersetzungen | Haiku |
| Zusammenfassung | Haiku oder Sonnet |
| Klassifizierung | Haiku |
| Code-Generierung (einfach) | Sonnet |
| Code-Überprüfung | Sonnet |
| Architekturentscheidungen | Sonnet oder Opus |
| Komplexes Denken | Opus |
| Debuggen kniffliger Probleme | Opus |
| Sicherheitsanalyse | Opus |

**Routing-Muster (in Production AI-Apps verwenden):**
```typescript
function selectModel(task: string, complexity: 'low' | 'medium' | 'high') {
  if (complexity === 'low') return 'claude-haiku-4-5-20251001'
  if (complexity === 'medium') return 'claude-sonnet-4-6'
  return 'claude-opus-4-7'
}
```

## Reduzieren Sie den Kontext pro Aufruf

**Segmentierte Abfrage statt volles Dokument:**
```typescript
// TEUER: vollständiges Dokument bei jedem Aufruf übergeben
const response = await claude.generate({ context: fullDocument, query })

// GÜNSTIGER: nur relevante Segmente abrufen (RAG-Muster)
const relevantChunks = await vectorSearch(query, { topK: 5 })
const response = await claude.generate({ context: relevantChunks.join('\n'), query })
```

**Kürzere Antworten anfordern:**
```typescript
// Zur Systemaufforderung hinzufügen:
"Seien Sie prägnant. Antworten Sie in 2-3 Sätzen, es sei denn, mehr Details werden explizit angefordert."

// Oder max_tokens setzen:
max_tokens: 256  // Antwortlänge für einfache Abfragen begrenzen
```

**Vermeiden Sie das erneute Lesen ungeänderter Dateien:**
Bitten Sie Claude bei Claude Code-Sitzungen nicht, eine Datei, die bereits im Kontext ist, erneut zu lesen. Der Dateiinhalt ist bereits vorhanden — das erneute Lesen verdoppelt die Kosten für diesen Kontext.

## Batch-Verarbeitung

Für Massenaufgaben (100 Dokumente übersetzen, 500 Beschreibungen generieren), verwenden Sie die Batch API:
```typescript
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

// Erstellen Sie einen Batch anstelle von 500 einzelnen Aufrufen
const batch = await client.beta.messages.batches.create({
  requests: documents.map((doc, i) => ({
    custom_id: `doc-${i}`,
    params: {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: `Translate: ${doc.text}` }],
    },
  })),
})

// Ergebnisse abrufen
const results = await client.beta.messages.batches.retrieve(batch.id)
```

**Ersparnisse:** 50% Rabatt auf Batch API-Preise vs. Echtzeit-API.

## Claude Code-Sitzungskosten

Claude Code berechnet pro Sitzung. Sitzungskosten reduzieren:

1. **`/lean-claude` verwenden** — aktiviert Token-effizienten Modus, kürzere Antworten
2. **`/compact` verwenden** — komprimiert Gesprächsverlauf wenn er zu lang wird
3. **Kontext via CLAUDE.md vorbeladen** — einmalig Lesen vs. wiederholte Erkundung
4. **Fokussierte Sitzungen** — eine Aufgabe pro Sitzung, weniger irrelevanter Kontext
5. **Modellwahl** — Claude Code verwendet standardmäßig Sonnet; mit `/model haiku` zu Haiku für einfache Aufgaben wechseln

## Kostenüberwachung

```typescript
// Ausgaben in der Produktion verfolgen
const response = await claude.messages.create({ ... })

const cost = calculateCost(
  response.usage.input_tokens,
  response.usage.output_tokens,
  model
)

// Warnung wenn einzelner Aufruf das Budget überschreitet
if (cost > COST_ALERT_THRESHOLD) {
  logger.warn('high_cost_llm_call', { cost, tokens: response.usage })
}

// Tägliches Budget-Tracking
await redis.incrbyfloat(`daily_llm_cost:${today}`, cost)
const dailyTotal = await redis.get(`daily_llm_cost:${today}`)
if (Number(dailyTotal) > DAILY_BUDGET) {
  alertOncall('Daily LLM budget exceeded')
}
```

## Typische Kosten-Benchmarks

| Anwendungsfall | Typische Kosten/Anfrage | Optimierungspotenzial |
|---|---|---|
| Einfache Chatbot-Antwort | $0.001-0.01 | Hoch (Systemaufforderung cachen, Haiku verwenden) |
| Code-Generierung | $0.01-0.05 | Mittel (Modellgröße richtig wählen) |
| Dokumentenanalyse | $0.05-0.50 | Hoch (Segmentabruf, Dokument cachen) |
| Komplexes Denken | $0.10-1.00 | Niedrig (Opus möglicherweise erforderlich) |
| Batch-Übersetzung | $0.0005/doc | Sehr hoch (Batch API + Haiku) |

---
