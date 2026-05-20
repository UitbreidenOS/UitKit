# Cost Optimisation Guide

Practical strategies for reducing Claude API and Claude Code costs without sacrificing quality.

## Understanding what drives cost

Claude pricing is based on **tokens** (input + output). Cost = tokens × price per token.

**What increases cost:**
- Long system prompts repeated on every call
- Large file contents passed as context
- Long conversation histories
- Verbose, multi-paragraph responses
- Repeated tool calls that re-read the same files
- Using Opus when Sonnet would do

**Claude model pricing (approximate, May 2026):**
| Model | Input | Output | Best for |
|---|---|---|---|
| Haiku 4.5 | cheapest | cheapest | Simple tasks, high volume |
| Sonnet 4.6 | mid | mid | Most work — default choice |
| Opus 4.7 | most expensive | most expensive | Complex reasoning, critical tasks |

**Rule of thumb:** Use the cheapest model that produces acceptable quality for your task.

## Prompt caching

Claude API supports prompt caching — cache your system prompt and static context so you don't pay full price on every call.

```typescript
// Without caching: full input price on every call
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: longSystemPrompt,  // charged every time
  messages: [{ role: 'user', content: query }],
})

// With caching: system prompt cached after first call (90% discount on cached tokens)
const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  system: [
    {
      type: 'text',
      text: longSystemPrompt,
      cache_control: { type: 'ephemeral' }  // cache this for up to 5 minutes
    }
  ],
  messages: [{ role: 'user', content: query }],
})
```

**When to use caching:**
- Same system prompt used for multiple requests (chatbot, multi-turn conversations)
- Large document that multiple queries reference
- Tool definitions that don't change between calls

**Savings:** 90% discount on cached input tokens. 5-minute TTL (ephemeral cache).

## Right-size the model

Most work doesn't need Opus. A practical guide:

| Task | Recommended model |
|---|---|
| Translations | Haiku |
| Summarisation | Haiku or Sonnet |
| Classification | Haiku |
| Code generation (simple) | Sonnet |
| Code review | Sonnet |
| Architecture decisions | Sonnet or Opus |
| Complex reasoning | Opus |
| Debugging tricky issues | Opus |
| Security analysis | Opus |

**Routing pattern (use in production AI apps):**
```typescript
function selectModel(task: string, complexity: 'low' | 'medium' | 'high') {
  if (complexity === 'low') return 'claude-haiku-4-5-20251001'
  if (complexity === 'medium') return 'claude-sonnet-4-6'
  return 'claude-opus-4-7'
}
```

## Reduce context per call

**Chunked retrieval instead of full document:**
```typescript
// EXPENSIVE: pass entire document on every call
const response = await claude.generate({ context: fullDocument, query })

// CHEAPER: retrieve only relevant chunks (RAG pattern)
const relevantChunks = await vectorSearch(query, { topK: 5 })
const response = await claude.generate({ context: relevantChunks.join('\n'), query })
```

**Request shorter responses:**
```typescript
// Add to system prompt:
"Be concise. Respond in 2-3 sentences unless more detail is explicitly requested."

// Or set max_tokens:
max_tokens: 256  // limit response length for simple queries
```

**Avoid re-reading unchanged files:**
In Claude Code sessions, don't ask Claude to re-read a file it already has in context. The file content is already there — re-reading it doubles the cost for that context.

## Batch processing

For bulk tasks (translating 100 documents, generating 500 descriptions), use the Batch API:
```typescript
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

// Create a batch instead of 500 individual calls
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

// Poll for results
const results = await client.beta.messages.batches.retrieve(batch.id)
```

**Savings:** 50% discount on batch API pricing vs. real-time API.

## Claude Code session cost

Claude Code bills per session. Reduce session cost:

1. **Use `/lean-claude`** — activates token-efficient mode, shorter responses
2. **Use `/compact`** — compresses conversation history when it gets long
3. **Pre-load context via CLAUDE.md** — one-time read vs. repeated exploration
4. **Focused sessions** — one task per session, less irrelevant context
5. **Model selection** — Claude Code uses Sonnet by default; switch to Haiku for simple tasks with `/model haiku`

## Cost monitoring

```typescript
// Track spend in production
const response = await claude.messages.create({ ... })

const cost = calculateCost(
  response.usage.input_tokens,
  response.usage.output_tokens,
  model
)

// Alert if a single call exceeds budget
if (cost > COST_ALERT_THRESHOLD) {
  logger.warn('high_cost_llm_call', { cost, tokens: response.usage })
}

// Daily budget tracking
await redis.incrbyfloat(`daily_llm_cost:${today}`, cost)
const dailyTotal = await redis.get(`daily_llm_cost:${today}`)
if (Number(dailyTotal) > DAILY_BUDGET) {
  alertOncall('Daily LLM budget exceeded')
}
```

## Typical cost benchmarks

| Use case | Typical cost/request | Optimisation potential |
|---|---|---|
| Simple chatbot response | $0.001-0.01 | High (cache system prompt, use Haiku) |
| Code generation | $0.01-0.05 | Medium (right-size model) |
| Document analysis | $0.05-0.50 | High (chunk retrieval, cache document) |
| Complex reasoning | $0.10-1.00 | Low (Opus may be required) |
| Batch translation | $0.0005/doc | Very high (batch API + Haiku) |

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
