---
name: mastra
description: "Mastra AI: TypeScript agent framework — agents, workflows, tools, memory, RAG, evals — for building production-grade AI applications"
---

> 🇪🇸 Versión en español. [Versión en inglés](../mastra.md).

# Skill Mastra

## Cuándo activar
- Construir un agente de IA de producción con memory, tools y workflows de múltiples pasos
- Configurar pipelines de RAG (Retrieval-Augmented Generation)
- Orquestar workflows de IA de múltiples pasos con lógica de ramificación e intervención humana
- Añadir evals para probar la calidad de la salida de la IA
- Construir CRM analíticos o automatización empresarial impulsada por IA

## Cuándo NO usar
- Llamadas simples a la API de Claude sin workflow — usar el skill de la API de Claude
- Interfaces de chat sin lógica de agente — usar el skill de Vercel AI SDK
- Cuando se necesita integración directa con Claude Code — el bucle de agente nativo de Claude es mejor

## Instrucciones

### Instalación

```bash
npm install @mastra/core
# Con integraciones específicas
npm install @mastra/core @mastra/memory @mastra/rag
```

### Agente básico

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

// Generar una respuesta
const response = await analystAgent.generate('Analyze this sales data: ...')
console.log(response.text)

// Transmitir una respuesta
const stream = await analystAgent.stream('Summarize Q1 performance')
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
```

### Tools — qué puede hacer el agente

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

// Adjuntar tools a un agente
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

### Workflows — orquestación de múltiples pasos

```typescript
// src/mastra/workflows/onboarding.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

// Pasos
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

// Workflow con ramificación condicional
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

### Memory — persistir el contexto entre sesiones

```typescript
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/memory/stores'

const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./memory.db',  // o URL de Turso para producción
  }),
  options: {
    lastMessages: 20,          // mantener los últimos 20 mensajes en el contexto
    semanticRecall: {
      topK: 5,                  // recuperar los 5 recuerdos pasados más relevantes
      messageRange: 2,          // contexto alrededor de cada mensaje recuperado
    },
  },
})

export const assistantWithMemory = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant with memory of past conversations.',
  model: anthropic('claude-opus-4-7'),
  memory,
})

// Usar con un ID de hilo (conversación)
const response = await assistantWithMemory.generate(
  'What did we discuss last week?',
  { threadId: 'user-123-thread-1', resourceId: 'user-123' }
)
```

### RAG — integración de base de conocimientos

```typescript
import { MastraVector } from '@mastra/core/vector'
import { PgVector } from '@mastra/pg'

// Configurar el almacén vectorial
const vectorStore = new PgVector({ connectionString: process.env.DATABASE_URL! })

// Indexar documentos
async function indexDocuments(docs: Document[]) {
  for (const doc of docs) {
    const embedding = await embed(doc.content)
    await vectorStore.upsert({
      indexName: 'docs',
      vectors: [{ id: doc.id, vector: embedding, metadata: { content: doc.content, title: doc.title } }],
    })
  }
}

// Crear tool de RAG para el agente
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

### Evals — probar la calidad de la salida

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
    new ToxicityMetric(),       // asegurar que la salida no sea dañina
    new RelevancyMetric({ threshold: 0.8 }),  // la salida coincide con la intención
  ],
})

console.log(results.summary)  // aprobado/fallido por métrica por caso de prueba
```

### Instancia Mastra (conecta todo)

```typescript
// src/mastra/index.ts
import { Mastra } from '@mastra/core'

export const mastra = new Mastra({
  agents: { analystAgent, crmAgent, assistantWithMemory },
  workflows: { onboardingWorkflow },
  vectors: { docs: vectorStore },
})

// Usar en una ruta API
export async function POST(req: Request) {
  const { message, threadId } = await req.json()
  const agent = mastra.getAgent('crmAgent')
  const response = await agent.generate(message, { threadId })
  return Response.json({ text: response.text })
}
```

## Ejemplo

**Usuario:** Construir un agente de éxito de cliente impulsado por IA que pueda consultar clientes que se han dado de baja, analizar sus patrones de uso y enviar correos electrónicos de reenganche personalizados — con memory para recordar campañas pasadas.

**Salida esperada:**
- `src/mastra/tools/crm.ts` — tools `queryChurnedCustomers`, `getUsageMetrics`, `sendEmail`
- `src/mastra/agents/customer-success.ts` — agente con los 3 tools + memory
- `src/mastra/workflows/reengagement.ts` — workflow: consulta → análisis → borrador de correo → envío
- `src/mastra/index.ts` — `new Mastra({ agents, workflows })`
- `app/api/cs-agent/route.ts` — endpoint POST usando `mastra.getAgent()`

---
