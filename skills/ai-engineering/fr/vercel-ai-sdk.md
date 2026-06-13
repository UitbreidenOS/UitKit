---
name: vercel-ai-sdk
description: "Vercel AI SDK: diffusion de réponses IA vers Next.js, hooks useChat/useCompletion, appels d'outils, UI générative, routage multi-fournisseur (Claude, OpenAI, Gemini)"
---

> 🇫🇷 Version française. [English version](../vercel-ai-sdk.md).

# Compétence Vercel AI SDK

## Quand l'activer
- Construire l'interface frontend pour une application IA dans Next.js ou React
- Diffuser des réponses IA vers une interface sans gérer SSE manuellement
- Implémenter une interface de chat avec historique des messages
- Appeler des outils IA et afficher leurs résultats en tant que composants UI
- Router les requêtes entre plusieurs fournisseurs IA (Claude, OpenAI, Gemini)
- Construire une UI générative où l'IA décide quel composant afficher

## Quand NE PAS utiliser
- Logique IA purement backend sans interface — utiliser directement la compétence Claude API
- Agents autonomes de longue durée avec accès au système de fichiers — utiliser le Claude Agent SDK
- Quand vous avez besoin d'un contrôle total sur le protocole de streaming — fetch brut + SSE

## Pourquoi le Vercel AI SDK pour le frontend IA

Le Vercel AI SDK gère ce qui prendrait autrement des centaines de lignes de code personnalisé : analyse SSE, concaténation de flux, état des messages, contrôleurs d'annulation, rendu des résultats d'outils et changement de fournisseur. Il est agnostique au modèle — vous pouvez router vers Claude, OpenAI ou Gemini en changeant une seule ligne.

## Instructions

### Installation

```bash
npm install ai @ai-sdk/anthropic
# ou pour OpenAI
npm install ai @ai-sdk/openai
# ou pour plusieurs fournisseurs
npm install ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
```

### Gestionnaire de route (Next.js App Router)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export const maxDuration = 30  // Vercel: autoriser le streaming jusqu'à 30s

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: anthropic('claude-opus-4-7'),  // ou openai('gpt-4o')
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 2048,
  })

  return result.toDataStreamResponse()
}
```

### Hook useChat — le hook client principal

```tsx
'use client'
import { useChat } from 'ai/react'

export function ChatInterface() {
  const {
    messages,      // Message[] — historique complet du chat
    input,         // string — valeur de saisie actuelle
    handleInputChange,  // gestionnaire onChange
    handleSubmit,  // gestionnaire onSubmit
    isLoading,     // boolean — flux en cours
    stop,          // annuler le flux actuel
    reload,        // regénérer la dernière réponse
    error,         // Error | undefined
    append,        // ajouter un message par programme
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
        {isLoading && <div className="text-gray-400">Réflexion en cours...</div>}
      </div>

      {/* Saisie */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Posez votre question..."
          className="flex-1 border rounded-lg px-4 py-2"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>Envoyer</button>
        {isLoading && <button type="button" onClick={stop}>Arrêter</button>}
      </form>
    </div>
  )
}
```

### Appels d'outils (l'IA décide d'appeler des fonctions)

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
          // Votre implémentation
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
    maxSteps: 5,  // autoriser jusqu'à 5 tours d'appels d'outils
  })

  return result.toDataStreamResponse()
}
```

```tsx
// Le client affiche les résultats des appels d'outils
import { useChat } from 'ai/react'

function ChatWithTools() {
  const { messages } = useChat({ api: '/api/chat' })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'assistant' && m.content}
          {/* Afficher les invocations d'outils en ligne */}
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

### generateText (non-streaming, côté serveur)

```typescript
import { anthropic } from '@ai-sdk/anthropic'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

// Génération de texte simple
const { text } = await generateText({
  model: anthropic('claude-opus-4-7'),
  prompt: 'Summarize this article: ...',
})

// Génération d'objet structuré
const { object } = await generateObject({
  model: anthropic('claude-opus-4-7'),
  schema: z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string()),
  }),
  prompt: 'Analyze the sentiment of: "I love this product but the delivery was slow"',
})
// l'objet est entièrement typé : { sentiment: 'positive', confidence: 0.7, keywords: [...] }
```

### Hook useCompletion (tour unique, pas de chat)

```tsx
'use client'
import { useCompletion } from 'ai/react'

function TextImprover() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/improve',
  })

  return (
    <div>
      <textarea onChange={e => complete(e.target.value)} placeholder="Tapez pour améliorer..." />
      <div className="mt-4 p-4 bg-gray-50 rounded">
        {completion || 'Le texte amélioré apparaîtra ici...'}
      </div>
    </div>
  )
}

// Gestionnaire de route
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

### Routage multi-fournisseur

```typescript
// lib/ai.ts — changer de fournisseur selon l'env ou la préférence utilisateur
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

// Gestionnaire de route avec fournisseur dynamique
export async function POST(req: Request) {
  const { messages, provider } = await req.json()
  const result = await streamText({
    model: getModel(provider),
    messages,
  })
  return result.toDataStreamResponse()
}
```

### Mise en cache des prompts avec Claude (réduction des coûts)

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
            anthropic: { cacheControl: { type: 'ephemeral' } },  // mettre en cache ceci
          },
        },
        { type: 'text', text: 'Summarize section 3.' },
      ],
    },
  ],
})
```

## Exemple

**Utilisateur :** Construire un chat de support client IA pour un site e-commerce — Claude peut rechercher des commandes et des informations produit via des outils, diffuser la réponse, et l'interface affiche un indicateur de frappe et les résultats des outils en ligne.

**Résultat attendu :**
- `app/api/chat/route.ts` — `streamText` avec les outils `lookupOrder` + `searchProducts`, `maxSteps: 3`
- `components/ChatWindow.tsx` — hook `useChat`, liste des messages, cartes de résultats d'outils pour commandes/produits
- `components/OrderCard.tsx` — s'affiche quand `toolInvocations[].toolName === 'lookupOrder'`
- `app/support/page.tsx` — enveloppe `ChatWindow` avec une mise en page

---
