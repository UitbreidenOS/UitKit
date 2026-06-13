---
name: mastra
description: "Mastra AI: TypeScript agent framework — agents, workflows, tools, memory, RAG, evals — for building production-grade AI applications"
---

> 🇩🇪 Deutsche Version. [Englische Version](../mastra.md).

# Mastra Skill

## Wann aktivieren
- Aufbau eines produktionsreifen KI-Agenten mit Memory, Tools und mehrstufigen Workflows
- Einrichten von RAG-Pipelines (Retrieval-Augmented Generation)
- Orchestrierung mehrstufiger KI-Workflows mit Verzweigungslogik und menschlicher Kontrolle
- Hinzufügen von Evals zur Überprüfung der KI-Ausgabequalität
- Aufbau analytischer CRMs oder KI-gestützter Geschäftsautomatisierung

## Wann NICHT verwenden
- Einfache einmalige Claude-API-Aufrufe ohne Workflow — Claude-API-Skill verwenden
- Chat-UIs ohne Agentenlogik — Vercel-AI-SDK-Skill verwenden
- Wenn direkte Claude-Code-Integration benötigt wird — die native Agentenschleife von Claude ist besser

## Anweisungen

### Installation

```bash
npm install @mastra/core
# Mit spezifischen Integrationen
npm install @mastra/core @mastra/memory @mastra/rag
```

### Basis-Agent

```typescript
// src/mastra/agents/analyst.ts
import { Agent } from '@mastra/core/agent'
import { anthropic } from '@ai-sdk/anthropic'

export const analystAgent = new Agent({
  name: 'Data Analyst',
  instructions: `You are a data analyst. When given data, you:
    1. Identify trends and anomalies
    2. Provide actionable recommendations
    3. Format output as structured JSON when asked`,
  model: anthropic('claude-opus-4-7'),
})

// Eine Antwort generieren
const response = await analystAgent.generate('Analyze this sales data: ...')
console.log(response.text)

// Eine Antwort streamen
const stream = await analystAgent.stream('Summarize Q1 performance')
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
```

### Tools — was der Agent tun kann

```typescript
// src/mastra/tools/database.ts
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const queryCustomersTool = createTool({
  id: 'query-customers',
  description: 'Query the customer database with filters',
  inputSchema: z.object({
    status:    z.enum(['active', 'churned', 'trial']).optional(),
    minSpend:  z.number().optional(),
    limit:     z.number().int().min(1).max(100).default(20),
  }),
  outputSchema: z.object({
    customers: z.array(z.object({
      id:    z.string(),
      name:  z.string(),
      email: z.string(),
      spend: z.number(),
    })),
    total: z.number(),
  }),
  execute: async ({ context }) => {
    const { status, minSpend, limit } = context
    const customers = await db.customers.findMany({
      where: {
        ...(status && { status }),
        ...(minSpend && { totalSpend: { gte: minSpend } }),
      },
      take: limit,
    })
    return { customers, total: customers.length }
  },
})

export const sendEmailTool = createTool({
  id: 'send-email',
  description: 'Send an email to a customer',
  inputSchema: z.object({
    to:      z.string().email(),
    subject: z.string(),
    body:    z.string(),
  }),
  execute: async ({ context }) => {
    await emailService.send(context)
    return { sent: true, timestamp: new Date().toISOString() }
  },
})

// Tools an einen Agenten anhängen
export const crmAgent = new Agent({
  name: 'CRM Assistant',
  instructions: 'You help analyze customers and send targeted communications.',
  model: anthropic('claude-opus-4-7'),
  tools: {
    queryCustomers: queryCustomersTool,
    sendEmail:      sendEmailTool,
  },
})
```

### Workflows — mehrstufige Orchestrierung

```typescript
// src/mastra/workflows/onboarding.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

// Schritte
const analyzeUserStep = createStep({
  id: 'analyze-user',
  inputSchema: z.object({ userId: z.string() }),
  outputSchema: z.object({
    userId:   z.string(),
    segment:  z.string(),
    riskScore: z.number(),
  }),
  execute: async ({ inputData }) => {
    const user = await db.users.findById(inputData.userId)
    const analysis = await analystAgent.generate(
      `Analyze this user for onboarding segmentation: ${JSON.stringify(user)}`
    )
    return {
      userId:    inputData.userId,
      segment:   extractSegment(analysis.text),
      riskScore: extractRiskScore(analysis.text),
    }
  },
})

const sendWelcomeStep = createStep({
  id: 'send-welcome',
  inputSchema: z.object({ userId: z.string(), segment: z.string() }),
  outputSchema: z.object({ emailSent: z.boolean() }),
  execute: async ({ inputData }) => {
    const template = WELCOME_TEMPLATES[inputData.segment] ?? WELCOME_TEMPLATES.default
    await emailService.send({ userId: inputData.userId, template })
    return { emailSent: true }
  },
})

// Workflow mit bedingter Verzweigung
const onboardingWorkflow = createWorkflow({
  name: 'User Onboarding',
  triggerSchema: z.object({ userId: z.string() }),
})
  .then(analyzeUserStep)
  .branch([
    {
      when: async ({ inputData }) => inputData.riskScore > 0.7,
      step: createStep({
        id: 'flag-for-review',
        execute: async ({ inputData }) => {
          await flagHighRiskUser(inputData.userId)
          return { flagged: true }
        },
      }),
    },
    {
      when: async ({ inputData }) => inputData.riskScore <= 0.7,
      step: sendWelcomeStep,
    },
  ])
  .commit()
```

### Memory — Kontext sitzungsübergreifend speichern

```typescript
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/memory/stores'

const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./memory.db',  // oder Turso-URL für die Produktion
  }),
  options: {
    lastMessages: 20,          // die letzten 20 Nachrichten im Kontext behalten
    semanticRecall: {
      topK: 5,                  // die 5 relevantesten vergangenen Erinnerungen abrufen
      messageRange: 2,          // Kontext um jede abgerufene Nachricht
    },
  },
})

export const assistantWithMemory = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant with memory of past conversations.',
  model: anthropic('claude-opus-4-7'),
  memory,
})

// Mit einer Thread-ID (Konversation) verwenden
const response = await assistantWithMemory.generate(
  'What did we discuss last week?',
  { threadId: 'user-123-thread-1', resourceId: 'user-123' }
)
```

### RAG — Wissensdatenbank-Integration

```typescript
import { MastraVector } from '@mastra/core/vector'
import { PgVector } from '@mastra/pg'

// Vektorspeicher einrichten
const vectorStore = new PgVector({ connectionString: process.env.DATABASE_URL! })

// Dokumente indexieren
async function indexDocuments(docs: Document[]) {
  for (const doc of docs) {
    const embedding = await embed(doc.content)
    await vectorStore.upsert({
      indexName: 'docs',
      vectors: [{ id: doc.id, vector: embedding, metadata: { content: doc.content, title: doc.title } }],
    })
  }
}

// RAG-Tool für den Agenten erstellen
export const searchKnowledgeBaseTool = createTool({
  id: 'search-knowledge-base',
  description: 'Search internal documentation and knowledge base',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ context }) => {
    const queryEmbedding = await embed(context.query)
    const results = await vectorStore.query({
      indexName: 'docs',
      queryVector: queryEmbedding,
      topK: 5,
    })
    return { results: results.map(r => r.metadata) }
  },
})
```

### Evals — Ausgabequalität testen

```typescript
import { evaluate } from '@mastra/evals'
import { ToxicityMetric, RelevancyMetric } from '@mastra/evals/metrics'

const results = await evaluate({
  agent: crmAgent,
  testCases: [
    {
      input: 'Find all churned customers from last month',
      expectedOutput: 'Should list churned customers with their contact info',
    },
  ],
  metrics: [
    new ToxicityMetric(),       // sicherstellen, dass die Ausgabe nicht schädlich ist
    new RelevancyMetric({ threshold: 0.8 }),  // Ausgabe entspricht der Absicht
  ],
})

console.log(results.summary)  // Bestanden/Nicht bestanden pro Metrik pro Testfall
```

### Mastra-Instanz (verbindet alles)

```typescript
// src/mastra/index.ts
import { Mastra } from '@mastra/core'

export const mastra = new Mastra({
  agents: { analystAgent, crmAgent, assistantWithMemory },
  workflows: { onboardingWorkflow },
  vectors: { docs: vectorStore },
})

// In einer API-Route verwenden
export async function POST(req: Request) {
  const { message, threadId } = await req.json()
  const agent = mastra.getAgent('crmAgent')
  const response = await agent.generate(message, { threadId })
  return Response.json({ text: response.text })
}
```

## Beispiel

**Benutzer:** Einen KI-gestützten Kundenerfolgs-Agenten erstellen, der abgewanderte Kunden abfragen, ihre Nutzungsmuster analysieren und personalisierte Reaktivierungs-E-Mails senden kann — mit Memory, sodass vergangene Kampagnen erinnert werden.

**Erwartete Ausgabe:**
- `src/mastra/tools/crm.ts` — Tools `queryChurnedCustomers`, `getUsageMetrics`, `sendEmail`
- `src/mastra/agents/customer-success.ts` — Agent mit allen 3 Tools + Memory
- `src/mastra/workflows/reengagement.ts` — Workflow: Abfrage → Analyse → E-Mail-Entwurf → Versand
- `src/mastra/index.ts` — `new Mastra({ agents, workflows })`
- `app/api/cs-agent/route.ts` — POST-Endpunkt mit `mastra.getAgent()`

---
