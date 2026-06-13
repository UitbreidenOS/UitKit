---
name: vercel-ai-sdk
description: "Vercel AI SDK: AI-antwoorden streamen naar Next.js, useChat/useCompletion-hooks, tool calls, generatieve UI, multi-provider routing (Claude, OpenAI, Gemini)"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../vercel-ai-sdk.md).

# Vercel AI SDK Skill

## Wanneer activeren
- De frontend-interface bouwen voor een AI-applicatie in Next.js of React
- AI-antwoorden streamen naar een UI zonder SSE handmatig te beheren
- Een chatinterface implementeren met berichtgeschiedenis
- AI-tools aanroepen en hun resultaten weergeven als UI-componenten
- Verzoeken routen over meerdere AI-providers (Claude, OpenAI, Gemini)
- Generatieve UI bouwen waarbij de AI beslist welk component te renderen

## Wanneer NIET gebruiken
- Pure backend AI-logica zonder UI — gebruik de Claude API skill rechtstreeks
- Langlopende autonome agents met toegang tot het bestandssysteem — gebruik de Claude Agent SDK
- Wanneer u volledige controle over het streamingprotocol nodig heeft — ruwe fetch + SSE

## Waarom de Vercel AI SDK voor frontend AI

De Vercel AI SDK verwerkt wat anders honderden regels aangepaste code zou kosten: SSE-parsing, stream-concatenatie, berichtstatus, abort controllers, tool-resultaat rendering en provider-wisseling. Het is modelneutraal — u kunt routeren naar Claude, OpenAI of Gemini door één regel te wijzigen.

## Instructies

### Installatie

```bash
npm install ai @ai-sdk/anthropic
# of voor OpenAI
npm install ai @ai-sdk/openai
# of voor meerdere providers
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
```

### Route handler (Next.js App Router)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export const maxDuration = 30  // Vercel: streaming tot 30s toestaan

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-opus-4-7'),  // of openai('gpt-4o')
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
```

### useChat hook — de belangrijkste client hook

```tsx
'use client'
import { useChat } from 'ai/react'

export function ChatInterface() {
  const {
    messages,      // Message[] — volledige chatgeschiedenis
    input,         // string — huidige invoerwaarde
    handleInputChange,  // onChange-handler
    handleSubmit,  // onSubmit-handler
    isLoading,     // boolean — stream actief
    stop,          // huidige stream afbreken
    reload,        // laatste antwoord opnieuw genereren
    error,         // Error | undefined
    append,        // programmatisch een bericht toevoegen
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
      {/* Berichten */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-400">Aan het nadenken...</div>}
      </div>

      {/* Invoer */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Stel een vraag..."
          className="flex-1 border rounded-lg px-4 py-2"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Versturen</button>
        {isLoading && <button type="button" onClick={stop}>Stoppen</button>}
      </form>
    </div>
  )
}
```

### Tool calls (AI beslist functies aan te roepen)

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
          // Uw implementatie
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
    maxSteps: 5,  // tot 5 tool call-rondes toestaan
  })

  return result.toDataStreamResponse()
}
```

```tsx
// Client rendert tool call-resultaten
import { useChat } from 'ai/react'

function ChatWithTools() {
  const { messages } = useChat({ api: '/api/chat' })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'assistant' && m.content}
          {/* Tool-aanroepresultaten inline weergeven */}
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

### generateText (niet-streaming, server-side)

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

// Eenvoudige tekstgeneratie
const { text } = await generateText({
  model: anthropic('claude-opus-4-7'),
  prompt: 'Summarize this article: ...',
})

// Gestructureerde objectgeneratie
const { object } = await generateObject({
  model: anthropic('claude-opus-4-7'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string()),
  }),
  prompt: 'Analyze the sentiment of: "I love this product but the delivery was slow"',
})
// object is volledig getypeerd: { sentiment: 'positive', confidence: 0.7, keywords: [...] }
```

### useCompletion hook (enkele ronde, geen chat)

```tsx
'use client'
import { useCompletion } from 'ai/react'

function TextImprover() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/improve',
  })

  return (
    <div>
      <textarea onChange={e => complete(e.target.value)} placeholder="Typ om te verbeteren..." />
      <div className="mt-4 p-4 bg-gray-50 rounded">
        {completion || 'Verbeterde tekst verschijnt hier...'}
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
// lib/ai.ts — provider wisselen op basis van omgeving of gebruikersvoorkeur
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

// Route handler met dynamische provider
export async function POST(req: Request) {
  const { messages, provider } = await req.json()
  const result = await streamText({
    model: getModel(provider),
    messages,
  })
  return result.toDataStreamResponse()
}
```

### Prompt caching met Claude (kostenbesparing)

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
            anthropic: { cacheControl: { type: 'ephemeral' } },  // dit cachen
          },
        },
        { type: 'text', text: 'Summarize section 3.' },
      ],
    },
  ],
})
```

## Voorbeeld

**Gebruiker:** Een AI-klantenservicechat bouwen voor een e-commercesite — Claude kan bestellingen en productinformatie opzoeken via tools, de reactie streamen, en de UI toont een typindicator en tool-resultaten inline.

**Verwachte uitvoer:**
- `app/api/chat/route.ts` — `streamText` met `lookupOrder` + `searchProducts` tools, `maxSteps: 3`
- `components/ChatWindow.tsx` — `useChat` hook, berichtenlijst, tool-resultaatkaarten voor bestellingen/producten
- `components/OrderCard.tsx` — wordt weergegeven wanneer `toolInvocations[].toolName === 'lookupOrder'`
- `app/support/page.tsx` — omsluit `ChatWindow` met een lay-out

---
