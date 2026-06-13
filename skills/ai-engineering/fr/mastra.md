---
name: mastra
description: "Mastra AI: TypeScript agent framework — agents, workflows, tools, memory, RAG, evals — for building production-grade AI applications"
---

> 🇫🇷 Version française. [English version](../mastra.md).

# Compétence Mastra

## Quand activer
- Construction d'un agent IA de production avec mémoire, outils et workflows multi-étapes
- Mise en place de pipelines RAG (Retrieval-Augmented Generation)
- Orchestration de workflows IA multi-étapes avec logique de branchement et intervention humaine
- Ajout d'évaluations pour tester la qualité des sorties IA
- Construction de CRM analytiques ou d'automatisation métier alimentée par l'IA

## Quand NE PAS utiliser
- Appels simples à l'API Claude sans workflow — utiliser la compétence API Claude
- Interfaces de chat sans logique d'agent — utiliser la compétence Vercel AI SDK
- Quand vous avez besoin d'une intégration directe avec Claude Code — la boucle d'agent native de Claude est meilleure

## Instructions

### Installation

```bash
npm install @mastra/core
# Avec des intégrations spécifiques
npm install @mastra/core @mastra/memory @mastra/rag
```

### Agent de base

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

// Générer une réponse
const response = await analystAgent.generate('Analyze this sales data: ...')
console.log(response.text)

// Diffuser une réponse en continu
const stream = await analystAgent.stream('Summarize Q1 performance')
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
```

### Outils — ce que l'agent peut faire

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

// Attacher des outils à un agent
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

### Workflows — orchestration multi-étapes

```typescript
// src/mastra/workflows/onboarding.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

// Étapes
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

// Workflow avec branchement conditionnel
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

### Memory — persister le contexte entre les sessions

```typescript
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/memory/stores'

const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./memory.db',  // ou URL Turso pour la production
  }),
  options: {
    lastMessages: 20,          // conserver les 20 derniers messages dans le contexte
    semanticRecall: {
      topK: 5,                  // rappeler les 5 souvenirs passés les plus pertinents
      messageRange: 2,          // contexte autour de chaque message rappelé
    },
  },
})

export const assistantWithMemory = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant with memory of past conversations.',
  model: anthropic('claude-opus-4-7'),
  memory,
})

// Utiliser avec un ID de fil (conversation)
const response = await assistantWithMemory.generate(
  'What did we discuss last week?',
  { threadId: 'user-123-thread-1', resourceId: 'user-123' }
)
```

### RAG — intégration de base de connaissances

```typescript
import { MastraVector } from '@mastra/core/vector'
import { PgVector } from '@mastra/pg'

// Configurer le stockage vectoriel
const vectorStore = new PgVector({ connectionString: process.env.DATABASE_URL! })

// Indexer des documents
async function indexDocuments(docs: Document[]) {
  for (const doc of docs) {
    const embedding = await embed(doc.content)
    await vectorStore.upsert({
      indexName: 'docs',
      vectors: [{ id: doc.id, vector: embedding, metadata: { content: doc.content, title: doc.title } }],
    })
  }
}

// Créer un outil RAG pour l'agent
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

### Evals — tester la qualité des sorties

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
    new ToxicityMetric(),       // s'assurer que la sortie n'est pas nuisible
    new RelevancyMetric({ threshold: 0.8 }),  // la sortie correspond à l'intention
  ],
})

console.log(results.summary)  // réussite/échec par métrique par cas de test
```

### Instance Mastra (relie tout ensemble)

```typescript
// src/mastra/index.ts
import { Mastra } from '@mastra/core'

export const mastra = new Mastra({
  agents: { analystAgent, crmAgent, assistantWithMemory },
  workflows: { onboardingWorkflow },
  vectors: { docs: vectorStore },
})

// Utiliser dans une route API
export async function POST(req: Request) {
  const { message, threadId } = await req.json()
  const agent = mastra.getAgent('crmAgent')
  const response = await agent.generate(message, { threadId })
  return Response.json({ text: response.text })
}
```

## Exemple

**Utilisateur :** Construire un agent de succès client alimenté par l'IA capable d'interroger les clients désabonnés, d'analyser leurs schémas d'utilisation et d'envoyer des e-mails de réengagement personnalisés — avec mémoire pour se souvenir des campagnes passées.

**Résultat attendu :**
- `src/mastra/tools/crm.ts` — outils `queryChurnedCustomers`, `getUsageMetrics`, `sendEmail`
- `src/mastra/agents/customer-success.ts` — agent avec les 3 outils + mémoire
- `src/mastra/workflows/reengagement.ts` — workflow : requête → analyse → rédaction d'e-mail → envoi
- `src/mastra/index.ts` — `new Mastra({ agents, workflows })`
- `app/api/cs-agent/route.ts` — endpoint POST utilisant `mastra.getAgent()`

---
