---
name: mastra
description: "Mastra AI: TypeScript agent framework — agents, workflows, tools, memory, RAG, evals — for building production-grade AI applications"
updated: 2026-06-13
---

# Mastra Skill

## When to activate
- Building a production AI agent with memory, tools, and multi-step workflows
- Setting up RAG (Retrieval-Augmented Generation) pipelines
- Orchestrating multi-step AI workflows with branching logic and human-in-the-loop
- Adding evaluations to test AI output quality
- Building analytical CRMs or AI-powered business automation

## When NOT to use
- Simple one-shot Claude API calls with no workflow — use the Claude API skill
- Chat UIs without agent logic — use the Vercel AI SDK skill
- When you need direct Claude Code integration — Claude's native agent loop is better

## Instructions

### Installation

```bash
npm install @mastra/core
# With specific integrations
npm install @mastra/core @mastra/memory @mastra/rag
```

### Basic agent

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

// Generate a response
const response = await analystAgent.generate('Analyze this sales data: ...')
console.log(response.text)

// Stream a response
const stream = await analystAgent.stream('Summarize Q1 performance')
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}
```

### Tools — what the agent can do

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

// Attach tools to an agent
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

### Workflows — multi-step orchestration

```typescript
// src/mastra/workflows/onboarding.ts
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

// Steps
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

// Workflow with conditional branching
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

### Memory — persist context across sessions

```typescript
import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/memory/stores'

const memory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./memory.db',  // or Turso URL for production
  }),
  options: {
    lastMessages: 20,          // keep last 20 messages in context
    semanticRecall: {
      topK: 5,                  // recall 5 most relevant past memories
      messageRange: 2,          // context around each recalled message
    },
  },
})

export const assistantWithMemory = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant with memory of past conversations.',
  model: anthropic('claude-opus-4-7'),
  memory,
})

// Use with a thread (conversation) ID
const response = await assistantWithMemory.generate(
  'What did we discuss last week?',
  { threadId: 'user-123-thread-1', resourceId: 'user-123' }
)
```

### RAG — knowledge base integration

```typescript
import { MastraVector } from '@mastra/core/vector'
import { PgVector } from '@mastra/pg'

// Setup vector store
const vectorStore = new PgVector({ connectionString: process.env.DATABASE_URL! })

// Index documents
async function indexDocuments(docs: Document[]) {
  for (const doc of docs) {
    const embedding = await embed(doc.content)
    await vectorStore.upsert({
      indexName: 'docs',
      vectors: [{ id: doc.id, vector: embedding, metadata: { content: doc.content, title: doc.title } }],
    })
  }
}

// Create RAG tool for agent
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

### Evals — test output quality

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
    new ToxicityMetric(),       // ensure output isn't harmful
    new RelevancyMetric({ threshold: 0.8 }),  // output matches intent
  ],
})

console.log(results.summary)  // pass/fail per metric per test case
```

### Mastra instance (wires everything together)

```typescript
// src/mastra/index.ts
import { Mastra } from '@mastra/core'

export const mastra = new Mastra({
  agents: { analystAgent, crmAgent, assistantWithMemory },
  workflows: { onboardingWorkflow },
  vectors: { docs: vectorStore },
})

// Use in API route
export async function POST(req: Request) {
  const { message, threadId } = await req.json()
  const agent = mastra.getAgent('crmAgent')
  const response = await agent.generate(message, { threadId })
  return Response.json({ text: response.text })
}
```

## Example

**User:** Build an AI-powered customer success agent that can query churned customers, analyze their usage patterns, and send personalized re-engagement emails — with memory so it remembers past campaigns.

**Expected output:**
- `src/mastra/tools/crm.ts` — `queryChurnedCustomers`, `getUsageMetrics`, `sendEmail` tools
- `src/mastra/agents/customer-success.ts` — agent with all 3 tools + memory
- `src/mastra/workflows/reengagement.ts` — workflow: query → analyze → draft email → send
- `src/mastra/index.ts` — `new Mastra({ agents, workflows })`
- `app/api/cs-agent/route.ts` — POST endpoint using `mastra.getAgent()`

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
