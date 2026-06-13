---
name: "vercel-ai-sdk"
description: "Vercel AI SDK: streaming AI responses to Next.js, useChat/useCompletion hooks, tool calls, generative UI, multi-provider routing (Claude, OpenAI, Gemini)"
---

# Vercel AI SDK Skill

## When to activate
- Building the frontend interface for an AI application in Next.js or React
- Streaming AI responses to a UI without managing SSE manually
- Implementing a chat interface with message history
- Calling AI tools and rendering their results as UI components
- Routing requests across multiple AI providers (Claude, OpenAI, Gemini)
- Building generative UI where the AI decides what component to render

## When NOT to use
- Pure backend AI logic with no UI — use the Claude API skill directly
- Long-running autonomous agents with file system access — use the Claude Agent SDK
- When you need full control over the streaming protocol — raw fetch + SSE

## Why Vercel AI SDK for frontend AI

The Vercel AI SDK handles what would otherwise take hundreds of lines of custom code: SSE parsing, stream concatenation, message state, abort controllers, tool result rendering, and provider switching. It is model-agnostic — you can route to Claude, OpenAI, or Gemini by changing one line.

## Instructions

### Installation

```bash
npm install ai @ai-sdk/anthropic
# or for OpenAI
npm install ai @ai-sdk/openai
# or for multiple providers
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
```

### Route handler (Next.js App Router)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export const maxDuration = 30  // Vercel: allow streaming up to 30s

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-opus-4-7'),  // or openai('gpt-4o')
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
```

### useChat hook — the main client hook

```tsx
'use client'
import { useChat } from 'ai/react'

export function ChatInterface() {
  const {
    messages,      // Message[] — full chat history
    input,         // string — current input value
    handleInputChange,  // onChange handler
    handleSubmit,  // onSubmit handler
    isLoading,     // boolean — stream in progress
    stop,          // abort the current stream
    reload,        // regenerate the last response
    error,         // Error | undefined
    append,        // programmatically add a message
  } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Final message:', message)
    },
    onError: (error) => {
      console.error('Stream error:', error)
    },
  })

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-400">Thinking...</div>}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="flex-1 border rounded-lg px-4 py-2"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
        {isLoading && <button type="button" onClick={stop}>Stop</button>}
      </form>
    </div>
  )
}
```

### Tool calls (AI decides to call functions)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-opus-4-7'),
    messages,
    tools: {
      getWeather: tool({
        description: 'Get current weather for a location',
        parameters: z.object({
          location: z.string().describe('City and country'),
          unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
        }),
        execute: async ({ location, unit }) => {
          // Your implementation
          const weather = await fetchWeather(location)
          return { temperature: weather.temp, condition: weather.condition, unit }
        },
      }),

      searchDatabase: tool({
        description: 'Search the product catalog',
        parameters: z.object({
          query: z.string(),
          limit: z.number().int().min(1).max(20).default(5),
        }),
        execute: async ({ query, limit }) => {
          return await db.products.search(query, limit)
        },
      }),
    },
    maxSteps: 5,  // allow up to 5 tool call rounds
  })

  return result.toDataStreamResponse()
}
```

```tsx
// Client renders tool call results
import { useChat } from 'ai/react'

function ChatWithTools() {
  const { messages } = useChat({ api: '/api/chat' })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'assistant' && m.content}
          {/* Render tool invocations inline */}
          {m.toolInvocations?.map(tool => (
            <div key={tool.toolCallId}>
              {tool.toolName === 'getWeather' && tool.state === 'result' && (
                <WeatherCard data={tool.result} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

### generateText (non-streaming, server-side)

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

// Simple text generation
const { text } = await generateText({
  model: anthropic('claude-opus-4-7'),
  prompt: 'Summarize this article: ...',
})

// Structured object generation
const { object } = await generateObject({
  model: anthropic('claude-opus-4-7'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string()),
  }),
  prompt: 'Analyze the sentiment of: "I love this product but the delivery was slow"',
})
// object is fully typed: { sentiment: 'positive', confidence: 0.7, keywords: [...] }
```

### useCompletion hook (single turn, not chat)

```tsx
'use client'
import { useCompletion } from 'ai/react'

function TextImprover() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/improve',
  })

  return (
    <div>
      <textarea onChange={e => complete(e.target.value)} placeholder="Type to improve..." />
      <div className="mt-4 p-4 bg-gray-50 rounded">
        {completion || 'Improved text will appear here...'}
      </div>
    </div>
  )
}

// Route handler
// app/api/improve/route.ts
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const result = await streamText({
    model: anthropic('claude-opus-4-7'),
    system: 'Improve the writing while keeping the same meaning. Be concise.',
    prompt,
  })
  return result.toDataStreamResponse()
}
```

### Multi-provider routing

```typescript
// lib/ai.ts — switch provider based on env or user preference
import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'

export function getModel(provider: 'anthropic' | 'openai' | 'google' = 'anthropic') {
  switch (provider) {
    case 'anthropic': return anthropic('claude-opus-4-7')
    case 'openai':    return openai('gpt-4o')
    case 'google':    return google('gemini-2.0-flash')
  }
}

// Route handler with dynamic provider
export async function POST(req: Request) {
  const { messages, provider } = await req.json()
  const result = await streamText({
    model: getModel(provider),
    messages,
  })
  return result.toDataStreamResponse()
}
```

### Prompt caching with Claude (cost reduction)

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const result = await streamText({
  model: anthropic('claude-opus-4-7'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: largeSystemDocument,
          experimental_providerMetadata: {
            anthropic: { cacheControl: { type: 'ephemeral' } },  // cache this
          },
        },
        { type: 'text', text: 'Summarize section 3.' },
      ],
    },
  ],
})
```

## Example

**User:** Build an AI customer support chat for an e-commerce site — Claude can look up orders and product info via tools, stream the response, and the UI shows a typing indicator and tool results inline.

**Expected output:**
- `app/api/chat/route.ts` — `streamText` with `lookupOrder` + `searchProducts` tools, `maxSteps: 3`
- `components/ChatWindow.tsx` — `useChat` hook, messages list, tool result cards for orders/products
- `components/OrderCard.tsx` — renders when `toolInvocations[].toolName === 'lookupOrder'`
- `app/support/page.tsx` — wraps `ChatWindow` with layout

---
