# Kostenoptimalisatiegids

Praktische strategieën om Claude API- en Claude Code-kosten te verlagen zonder kwaliteit op te offeren.

## Begrijpen wat kosten aandrijft

Claude-prijzen zijn gebaseerd op **tokens** (invoer + uitvoer). Kosten = tokens × prijs per token.

**Wat kosten verhoogt:**
- Lange systeempromt herhaald bij elke oproep
- Grote bestandsinhoud doorgegeven als context
- Lange gespreksgeschiedenissen
- Uitgebreide, multi-alinea-antwoorden
- Herhaalde tooloproepen die dezelfde bestanden opnieuw lezen
- Opus gebruiken wanneer Sonnet volstaat

**Claude-modelprijzen (ongeveer mei 2026):**
| Model | Invoer | Uitvoer | Best voor |
|---|---|---|---|
| Haiku 4.5 | goedkoopste | goedkoopste | Eenvoudige taken, hoog volume |
| Sonnet 4.6 | gemiddeld | gemiddeld | Meeste werk — standaard keuze |
| Opus 4.7 | duurste | duurste | Complex redeneren, kritieke taken |

**Vuistregel:** Gebruik het goedkoopste model dat aanvaardbare kwaliteit voor uw taak levert.

## Prompt-caching

Claude API ondersteunt prompt-caching — cache uw systeempromt en statische context zodat u niet volledige prijs betaalt per oproep.

```typescript
// Zonder caching: volledige invoerprijs per oproep
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: longSystemPrompt,  // elke keer berekend
  messages: [{ role: 'user', content: query }],
})

// Met caching: systeempromt gecached na eerste oproep (90% korting op cached tokens)
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: longSystemPrompt,
      cache_control: { type: 'ephemeral' }  // dit tot 5 minuten cachen
    }
  ],
  messages: [{ role: 'user', content: query }],
})
```

**Wanneer caching gebruiken:**
- Dezelfde systeempromt gebruikt voor meerdere verzoeken (chatbot, multi-turn gesprekken)
- Groot document dat meerdere query's referenzeren
- Gereedschapsdefinities die niet veranderen tussen oproepen

**Besparingen:** 90% korting op cached invoer-tokens. 5-minuten TTL (ephemere cache).

## Juiste modelgrootte

De meeste werk heeft geen Opus nodig. Praktische gids:

| Taak | Aanbevolen model |
|---|---|
| Vertalingen | Haiku |
| Samenvatting | Haiku of Sonnet |
| Classificatie | Haiku |
| Codegeneratie (eenvoudig) | Sonnet |
| Codereview | Sonnet |
| Architectuurbeslissingen | Sonnet of Opus |
| Complex redeneren | Opus |
| Lastige bugs debuggen | Opus |
| Veiligheidsanalyse | Opus |

**Routeringspatroon (in productie AI-apps gebruiken):**
```typescript
function selectModel(task: string, complexity: 'low' | 'medium' | 'high') {
  if (complexity === 'low') return 'claude-haiku-4-5-20251001'
  if (complexity === 'medium') return 'claude-sonnet-4-6'
  return 'claude-opus-4-7'
}
```

## Verminder context per oproep

**Gesegmenteerde retrieval in plaats van volledig document:**
```typescript
// DUUR: volledig document per oproep doorgegeven
const response = await claude.generate({ context: fullDocument, query })

// GOEDKOPER: alleen relevante chunks ophalen (RAG-patroon)
const relevantChunks = await vectorSearch(query, { topK: 5 })
const response = await claude.generate({ context: relevantChunks.join('\n'), query })
```

**Kortere antwoorden aanvragen:**
```typescript
// Toevoegen aan systeempromt:
"Wees beknopt. Antwoord in 2-3 zinnen tenzij meer detail uitdrukkelijk wordt aangevraagd."

// Of max_tokens instellen:
max_tokens: 256  // antwoordlengte voor eenvoudige query's beperken
```

**Vermijd het opnieuw lezen van ongewijzigde bestanden:**
Vraag Claude in Claude Code-sessies niet opnieuw een bestand te lezen dat al in context is. De bestandsinhoud is al daar — opnieuw lezen verdubbelt de kosten voor die context.

## Batchverwerking

Voor bulktaken (100 documenten vertalen, 500 beschrijvingen genereren), gebruik de Batch API:
```typescript
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

// Maak een batch in plaats van 500 afzonderlijke oproepen
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

// Resultaten ophalen
const results = await client.beta.messages.batches.retrieve(batch.id)
```

**Besparingen:** 50% korting op batch API-prijzen vs. real-time API.

## Claude Code-sessiekosten

Claude Code factureren per sessie. Sessiekosten verlagen:

1. **Gebruik `/lean-claude`** — activeert token-efficiënte modus, kortere antwoorden
2. **Gebruik `/compact`** — comprimeren gesprekshistorie als het lang wordt
3. **Voorladen context via CLAUDE.md** — eenmalig lezen vs. herhaalde verkenning
4. **Gerichte sessies** — één taak per sessie, minder irrelevante context
5. **Modelkeuze** — Claude Code gebruikt standaard Sonnet; naar Haiku voor eenvoudige taken via `/model haiku`

## Kostenbewaking

```typescript
// Uitgaven in productie volgen
const response = await claude.messages.create({ ... })

const cost = calculateCost(
  response.usage.input_tokens,
  response.usage.output_tokens,
  model
)

// Waarschuwen als enkele oproep budget overschrijdt
if (cost > COST_ALERT_THRESHOLD) {
  logger.warn('high_cost_llm_call', { cost, tokens: response.usage })
}

// Dagelijk budget-tracking
await redis.incrbyfloat(`daily_llm_cost:${today}`, cost)
const dailyTotal = await redis.get(`daily_llm_cost:${today}`)
if (Number(dailyTotal) > DAILY_BUDGET) {
  alertOncall('Daily LLM budget exceeded')
}
```

## Typische kostenbenchmarks

| Geval | Typische kosten/verzoek | Optimisatiepotentieel |
|---|---|---|
| Eenvoudig chatbot-antwoord | $0.001-0.01 | Hoog (systeempromt cachen, Haiku gebruiken) |
| Codegeneratie | $0.01-0.05 | Gemiddeld (juiste modelgrootte) |
| Documentanalyse | $0.05-0.50 | Hoog (chunk retrieval, document cachen) |
| Complex redeneren | $0.10-1.00 | Laag (Opus kan nodig zijn) |
| Batch-vertaling | $0.0005/doc | Zeer hoog (batch API + Haiku) |

---
