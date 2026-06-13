---
name: mastra
description: "Mastra AI: TypeScript agent framework — agents, workflows, tools, memory, RAG, evals — for building production-grade AI applications"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../mastra.md).

# Mastra Skill

## Wanneer activeren
- Het bouwen van een productie-AI-agent met memory, tools en meerstaps-workflows
- Het opzetten van RAG-pipelines (Retrieval-Augmented Generation)
- Orkestreren van meerstaps AI-workflows met vertakkingslogica en menselijke tussenkomst
- Evaluaties toevoegen om de kwaliteit van AI-uitvoer te testen
- Het bouwen van analytische CRM's of AI-gestuurde bedrijfsautomatisering

## Wanneer NIET gebruiken
- Eenvoudige eenmalige Claude-API-aanroepen zonder workflow — gebruik de Claude API-skill
- Chat-UI's zonder agentlogica — gebruik de Vercel AI SDK-skill
- Wanneer directe Claude Code-integratie nodig is — de native agentlus van Claude is beter

## Instructies

### Installatie

```bash
npm install @mastra/core
# Met specifieke integraties
npm install @mastra/core @mastra/memory @mastra/rag
```

### Basisagent

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

// Een antwoord genereren
const response = await analystAgent.generate('Analyze this sales data: ...')
console.log(response.text)

// Een antwoord streamen
const stream = await analystAgent.stream('Summarize Q1 performance')
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
```

### Tools — wat de agent kan doen

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

// Tools aan een agent koppelen
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

### Workflows — meerstaps orkestratie

```typescript
// src/mastra/workflows/onboarding.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

// Stappen
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

// Workflow met conditionele vertakking
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

### Memory — context bewaren tussen sessies

```typescript
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/memory/stores'

const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./memory.db',  // of Turso-URL voor productie
  }),
  options: {
    lastMessages: 20,          // de laatste 20 berichten in context bewaren
    semanticRecall: {
      topK: 5,                  // de 5 meest relevante oude herinneringen ophalen
      messageRange: 2,          // context rondom elk opgehaald bericht
    },
  },
})

export const assistantWithMemory = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant with memory of past conversations.',
  model: anthropic('claude-opus-4-7'),
  memory,
})

// Gebruiken met een thread-ID (conversatie)
const response = await assistantWithMemory.generate(
  'What did we discuss last week?',
  { threadId: 'user-123-thread-1', resourceId: 'user-123' }
)
```

### RAG — integratie van kennisbank

```typescript
import { MastraVector } from '@mastra/core/vector'
import { PgVector } from '@mastra/pg'

// Vectoropslag instellen
const vectorStore = new PgVector({ connectionString: process.env.DATABASE_URL! })

// Documenten indexeren
async function indexDocuments(docs: Document[]) {
  for (const doc of docs) {
    const embedding = await embed(doc.content)
    await vectorStore.upsert({
      indexName: 'docs',
      vectors: [{ id: doc.id, vector: embedding, metadata: { content: doc.content, title: doc.title } }],
    })
  }
}

// RAG-tool voor de agent aanmaken
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

### Evals — uitvoerkwaliteit testen

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
    new ToxicityMetric(),       // zorgen dat de uitvoer niet schadelijk is
    new RelevancyMetric({ threshold: 0.8 }),  // uitvoer komt overeen met de intentie
  ],
})

console.log(results.summary)  // geslaagd/mislukt per maatstaf per testgeval
```

### Mastra-instantie (verbindt alles)

```typescript
// src/mastra/index.ts
import { Mastra } from '@mastra/core'

export const mastra = new Mastra({
  agents: { analystAgent, crmAgent, assistantWithMemory },
  workflows: { onboardingWorkflow },
  vectors: { docs: vectorStore },
})

// Gebruiken in een API-route
export async function POST(req: Request) {
  const { message, threadId } = await req.json()
  const agent = mastra.getAgent('crmAgent')
  const response = await agent.generate(message, { threadId })
  return Response.json({ text: response.text })
}
```

## Voorbeeld

**Gebruiker:** Een AI-gestuurde klantsucces-agent bouwen die afgehakte klanten kan opvragen, hun gebruikspatronen kan analyseren en gepersonaliseerde heractiverings-e-mails kan versturen — met memory zodat eerdere campagnes worden onthouden.

**Verwachte uitvoer:**
- `src/mastra/tools/crm.ts` — tools `queryChurnedCustomers`, `getUsageMetrics`, `sendEmail`
- `src/mastra/agents/customer-success.ts` — agent met alle 3 tools + memory
- `src/mastra/workflows/reengagement.ts` — workflow: opvragen → analyseren → e-mail opstellen → versturen
- `src/mastra/index.ts` — `new Mastra({ agents, workflows })`
- `app/api/cs-agent/route.ts` — POST-eindpunt met `mastra.getAgent()`

---
