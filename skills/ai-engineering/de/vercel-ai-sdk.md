---
name: vercel-ai-sdk
description: "Vercel AI SDK: KI-Antworten an Next.js streamen, useChat/useCompletion-Hooks, Tool-Aufrufe, generative UI, Multi-Provider-Routing (Claude, OpenAI, Gemini)"
---

> 🇩🇪 Deutsche Version. [Englische Version](../vercel-ai-sdk.md).

# Vercel AI SDK Skill

## Wann aktivieren
- Das Frontend-Interface für eine KI-Anwendung in Next.js oder React erstellen
- KI-Antworten an eine UI streamen ohne manuelles SSE-Management
- Eine Chat-Oberfläche mit Nachrichtenverlauf implementieren
- KI-Tools aufrufen und ihre Ergebnisse als UI-Komponenten rendern
- Anfragen über mehrere KI-Anbieter routen (Claude, OpenAI, Gemini)
- Generative UI entwickeln, bei der die KI entscheidet, welche Komponente gerendert wird

## Wann NICHT verwenden
- Reine Backend-KI-Logik ohne UI — Claude API Skill direkt verwenden
- Lang laufende autonome Agenten mit Dateisystemzugriff — Claude Agent SDK verwenden
- Wenn vollständige Kontrolle über das Streaming-Protokoll benötigt wird — rohes fetch + SSE

## Warum das Vercel AI SDK für Frontend-KI

Das Vercel AI SDK übernimmt, was sonst Hunderte von Zeilen eigenem Code erfordern würde: SSE-Parsing, Stream-Konkatenation, Nachrichtenstatus, Abort Controller, Tool-Ergebnis-Rendering und Provider-Wechsel. Es ist modell-agnostisch — durch Änderung einer einzigen Zeile kann auf Claude, OpenAI oder Gemini geroutet werden.

## Anweisungen

### Installation

```bash
npm install ai @ai-sdk/anthropic
# oder für OpenAI
npm install ai @ai-sdk/openai
# oder für mehrere Provider
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
```

### Route Handler (Next.js App Router)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export const maxDuration = 30  // Vercel: Streaming bis zu 30s erlauben

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-opus-4-7'),  // oder openai('gpt-4o')
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
```

### useChat Hook — der Haupt-Client-Hook

```tsx
'use client'
import { useChat } from 'ai/react'

export function ChatInterface() {
  const {
    messages,      // Message[] — vollständiger Chat-Verlauf
    input,         // string — aktueller Eingabewert
    handleInputChange,  // onChange-Handler
    handleSubmit,  // onSubmit-Handler
    isLoading,     // boolean — Stream läuft
    stop,          // aktuellen Stream abbrechen
    reload,        // letzte Antwort neu generieren
    error,         // Error | undefined
    append,        // Nachricht programmatisch hinzufügen
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
      {/* Nachrichten */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-400">Denke nach...</div>}
      </div>

      {/* Eingabe */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Fragen Sie etwas..."
          className="flex-1 border rounded-lg px-4 py-2"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Senden</button>
        {isLoading && <button type="button" onClick={stop}>Stopp</button>}
      </form>
    </div>
  )
}
```

### Tool-Aufrufe (KI entscheidet, Funktionen aufzurufen)

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
          // Eigene Implementierung
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
    maxSteps: 5,  // bis zu 5 Tool-Aufruf-Runden erlauben
  })

  return result.toDataStreamResponse()
}
```

```tsx
// Client rendert Tool-Aufruf-Ergebnisse
import { useChat } from 'ai/react'

function ChatWithTools() {
  const { messages } = useChat({ api: '/api/chat' })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'assistant' && m.content}
          {/* Tool-Aufruf-Ergebnisse inline rendern */}
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

### generateText (nicht-streaming, serverseitig)

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

// Einfache Textgenerierung
const { text } = await generateText({
  model: anthropic('claude-opus-4-7'),
  prompt: 'Summarize this article: ...',
})

// Strukturierte Objektgenerierung
const { object } = await generateObject({
  model: anthropic('claude-opus-4-7'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string()),
  }),
  prompt: 'Analyze the sentiment of: "I love this product but the delivery was slow"',
})
// object ist vollständig typisiert: { sentiment: 'positive', confidence: 0.7, keywords: [...] }
```

### useCompletion Hook (einzelner Durchgang, kein Chat)

```tsx
'use client'
import { useCompletion } from 'ai/react'

function TextImprover() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/improve',
  })

  return (
    <div>
      <textarea onChange={e => complete(e.target.value)} placeholder="Text zum Verbessern eingeben..." />
      <div className="mt-4 p-4 bg-gray-50 rounded">
        {completion || 'Verbesserter Text erscheint hier...'}
      </div>
    </div>
  )
}

// Route Handler
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

### Multi-Provider-Routing

```typescript
// lib/ai.ts — Provider basierend auf Umgebung oder Benutzerpräferenz wechseln
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

// Route Handler mit dynamischem Provider
export async function POST(req: Request) {
  const { messages, provider } = await req.json()
  const result = await streamText({
    model: getModel(provider),
    messages,
  })
  return result.toDataStreamResponse()
}
```

### Prompt-Caching mit Claude (Kostensenkung)

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
            anthropic: { cacheControl: { type: 'ephemeral' } },  // dies cachen
          },
        },
        { type: 'text', text: 'Summarize section 3.' },
      ],
    },
  ],
})
```

## Beispiel

**Benutzer:** Einen KI-Kundensupport-Chat für einen E-Commerce-Shop erstellen — Claude kann Bestellungen und Produktinformationen über Tools suchen, die Antwort streamen, und die UI zeigt einen Tipp-Indikator und Tool-Ergebnisse inline.

**Erwartete Ausgabe:**
- `app/api/chat/route.ts` — `streamText` mit `lookupOrder` + `searchProducts` Tools, `maxSteps: 3`
- `components/ChatWindow.tsx` — `useChat` Hook, Nachrichtenliste, Tool-Ergebnis-Karten für Bestellungen/Produkte
- `components/OrderCard.tsx` — wird gerendert, wenn `toolInvocations[].toolName === 'lookupOrder'`
- `app/support/page.tsx` — umhüllt `ChatWindow` mit Layout

---
