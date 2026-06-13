---
name: vercel-ai-sdk
description: "Vercel AI SDK: transmisión de respuestas IA a Next.js, hooks useChat/useCompletion, llamadas a herramientas, UI generativa, enrutamiento multi-proveedor (Claude, OpenAI, Gemini)"
---

> 🇪🇸 Versión en español. [Versión en inglés](../vercel-ai-sdk.md).

# Skill Vercel AI SDK

## Cuándo activar
- Construir la interfaz frontend para una aplicación de IA en Next.js o React
- Transmitir respuestas de IA a una UI sin gestionar SSE manualmente
- Implementar una interfaz de chat con historial de mensajes
- Llamar a herramientas de IA y renderizar sus resultados como componentes UI
- Enrutar solicitudes entre múltiples proveedores de IA (Claude, OpenAI, Gemini)
- Construir UI generativa donde la IA decide qué componente renderizar

## Cuándo NO usar
- Lógica de IA puramente backend sin UI — usar la skill Claude API directamente
- Agentes autónomos de larga duración con acceso al sistema de archivos — usar el Claude Agent SDK
- Cuando se necesita control total sobre el protocolo de streaming — fetch puro + SSE

## Por qué el Vercel AI SDK para IA en frontend

El Vercel AI SDK gestiona lo que de otra forma requeriría cientos de líneas de código personalizado: análisis de SSE, concatenación de streams, estado de mensajes, abort controllers, renderizado de resultados de herramientas y cambio de proveedor. Es agnóstico al modelo — se puede enrutar a Claude, OpenAI o Gemini cambiando una sola línea.

## Instrucciones

### Instalación

```bash
npm install ai @ai-sdk/anthropic
# o para OpenAI
npm install ai @ai-sdk/openai
# o para múltiples proveedores
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
```

### Manejador de ruta (Next.js App Router)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export const maxDuration = 30  // Vercel: permitir streaming hasta 30s

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-opus-4-7'),  // o openai('gpt-4o')
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
```

### Hook useChat — el hook principal del cliente

```tsx
'use client'
import { useChat } from 'ai/react'

export function ChatInterface() {
  const {
    messages,      // Message[] — historial completo del chat
    input,         // string — valor de entrada actual
    handleInputChange,  // manejador onChange
    handleSubmit,  // manejador onSubmit
    isLoading,     // boolean — stream en progreso
    stop,          // cancelar el stream actual
    reload,        // regenerar la última respuesta
    error,         // Error | undefined
    append,        // añadir un mensaje programáticamente
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
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-400">Pensando...</div>}
      </div>

      {/* Entrada */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Pregunta lo que quieras..."
          className="flex-1 border rounded-lg px-4 py-2"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Enviar</button>
        {isLoading && <button type="button" onClick={stop}>Detener</button>}
      </form>
    </div>
  )
}
```

### Llamadas a herramientas (la IA decide llamar a funciones)

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
          // Su implementación
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
    maxSteps: 5,  // permitir hasta 5 rondas de llamadas a herramientas
  })

  return result.toDataStreamResponse()
}
```

```tsx
// El cliente renderiza los resultados de las llamadas a herramientas
import { useChat } from 'ai/react'

function ChatWithTools() {
  const { messages } = useChat({ api: '/api/chat' })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'assistant' && m.content}
          {/* Renderizar invocaciones de herramientas en línea */}
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

### generateText (sin streaming, del lado del servidor)

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

// Generación de texto simple
const { text } = await generateText({
  model: anthropic('claude-opus-4-7'),
  prompt: 'Summarize this article: ...',
})

// Generación de objetos estructurados
const { object } = await generateObject({
  model: anthropic('claude-opus-4-7'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string()),
  }),
  prompt: 'Analyze the sentiment of: "I love this product but the delivery was slow"',
})
// el objeto está completamente tipado: { sentiment: 'positive', confidence: 0.7, keywords: [...] }
```

### Hook useCompletion (turno único, no chat)

```tsx
'use client'
import { useCompletion } from 'ai/react'

function TextImprover() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/improve',
  })

  return (
    <div>
      <textarea onChange={e => complete(e.target.value)} placeholder="Escribe para mejorar..." />
      <div className="mt-4 p-4 bg-gray-50 rounded">
        {completion || 'El texto mejorado aparecerá aquí...'}
      </div>
    </div>
  )
}

// Manejador de ruta
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

### Enrutamiento multi-proveedor

```typescript
// lib/ai.ts — cambiar proveedor según entorno o preferencia del usuario
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

// Manejador de ruta con proveedor dinámico
export async function POST(req: Request) {
  const { messages, provider } = await req.json()
  const result = await streamText({
    model: getModel(provider),
    messages,
  })
  return result.toDataStreamResponse()
}
```

### Caché de prompts con Claude (reducción de costos)

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
            anthropic: { cacheControl: { type: 'ephemeral' } },  // cachear esto
          },
        },
        { type: 'text', text: 'Summarize section 3.' },
      ],
    },
  ],
})
```

## Ejemplo

**Usuario:** Construir un chat de soporte al cliente con IA para un sitio de e-commerce — Claude puede buscar pedidos e información de productos mediante herramientas, transmitir la respuesta, y la UI muestra un indicador de escritura y los resultados de las herramientas en línea.

**Resultado esperado:**
- `app/api/chat/route.ts` — `streamText` con herramientas `lookupOrder` + `searchProducts`, `maxSteps: 3`
- `components/ChatWindow.tsx` — hook `useChat`, lista de mensajes, tarjetas de resultados de herramientas para pedidos/productos
- `components/OrderCard.tsx` — se renderiza cuando `toolInvocations[].toolName === 'lookupOrder'`
- `app/support/page.tsx` — envuelve `ChatWindow` con diseño

---
