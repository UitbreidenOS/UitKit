---
name: langgraph
description: "LangGraph stateful agent framework: StateGraph, nodes, edges, conditional branching, persistence/checkpointing, human-in-the-loop, multi-agent subgraphs"
---

> 🇫🇷 Version française. [English version](../langgraph.md).

# Compétence LangGraph

## Quand activer
- Construire un agent avec état qui doit s'interrompre, reprendre ou bifurquer selon des conditions
- Implémenter des flux de travail humain-dans-la-boucle (l'agent s'arrête pour approbation avant de continuer)
- Orchestrer des agents multi-étapes avec une logique de branchement complexe
- Persister l'état de l'agent entre les pannes ou les sessions (checkpointing)
- Construire des systèmes multi-agents où des sous-graphes collaborent

## Quand NE PAS utiliser
- Appels IA simples à tour unique — utiliser directement l'API Claude ou la compétence Vercel AI SDK
- Pipelines linéaires sans branchement — trop lourd, utiliser des appels de fonctions séquentiels
- Quand vous avez besoin d'une boucle d'agent hébergée — utiliser la compétence Mastra à la place
- Interfaces de chat en streaming côté frontend — utiliser la compétence Vercel AI SDK

## Instructions

### Installation

```bash
npm install @langchain/langgraph @langchain/anthropic @langchain/core
# Python
pip install langgraph langchain-anthropic
```

### Concepts fondamentaux

LangGraph modélise les agents comme des **graphes** :
- **Nœuds** — fonctions qui s'exécutent et mettent à jour l'état
- **Arêtes** — connexions entre les nœuds (toujours exécuter → nœud suivant, ou conditionnel)
- **État** — un objet typé qui traverse le graphe et accumule des mises à jour
- **Checkpointer** — persiste l'état entre les exécutions (permet la reprise, l'humain-dans-la-boucle)

### StateGraph de base (TypeScript)

```typescript
import { StateGraph, Annotation, END, START } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

// 1. Définir la forme de l'état
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (existing, update) => [...existing, ...update],
    default: () => [],
  }),
  toolResults: Annotation<string[]>({
    reducer: (existing, update) => [...existing, ...update],
    default: () => [],
  }),
})

// 2. Définir les outils
const searchTool = tool(
  async ({ query }) => `Search results for: ${query}`,
  { name: 'search', description: 'Search the web', schema: z.object({ query: z.string() }) }
)

// 3. Définir les nœuds
const model = new ChatAnthropic({ model: 'claude-opus-4-7' }).bindTools([searchTool])

async function callModel(state: typeof AgentState.State) {
  const response = await model.invoke(state.messages)
  return { messages: [response] }
}

async function callTools(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1]
  const results = []
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const result = await searchTool.invoke(toolCall.args)
    results.push(new ToolMessage({ content: result, tool_call_id: toolCall.id }))
  }
  return { messages: results }
}

// 4. Arête conditionnelle — continuer à boucler ?
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1]
  if (lastMessage.tool_calls?.length) return 'tools'
  return END
}

// 5. Construire le graphe
const graph = new StateGraph(AgentState)
  .addNode('agent', callModel)
  .addNode('tools', callTools)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent')
  .compile()

// 6. L'exécuter
const result = await graph.invoke({
  messages: [new HumanMessage('Research the latest AI news and summarise it')]
})
```

### Persistance et checkpointing (reprise après panne)

```typescript
import { MemorySaver } from '@langchain/langgraph'
// Ou pour la production : PostgresSaver, SqliteSaver

const checkpointer = new MemorySaver()

const graph = new StateGraph(AgentState)
  // ... nœuds et arêtes ...
  .compile({ checkpointer })

// Exécuter avec un ID de thread — l'état persiste entre les appels
const config = { configurable: { thread_id: 'user-123-session-1' } }

// Premier appel
await graph.invoke({ messages: [new HumanMessage('Start research')] }, config)

// Reprendre plus tard (ou après une panne) — reprend depuis le dernier checkpoint
await graph.invoke({ messages: [new HumanMessage('Continue')] }, config)

// Obtenir l'état actuel
const state = await graph.getState(config)
console.log(state.values.messages)
```

### Humain-dans-la-boucle (interruption avant une action sensible)

```typescript
import { interrupt } from '@langchain/langgraph'

// Nœud qui s'arrête pour approbation humaine
async function reviewBeforeSend(state: typeof AgentState.State) {
  const draft = state.messages[state.messages.length - 1]

  // Suspendre l'exécution — rend le contrôle à l'appelant
  const approved = interrupt({
    message: 'Please review this draft before sending:',
    draft: draft.content,
  })

  if (!approved) {
    return { messages: [new HumanMessage('Draft rejected — please revise')] }
  }

  await sendEmail(draft.content)
  return { messages: [new AIMessage('Email sent successfully')] }
}

const graph = new StateGraph(AgentState)
  .addNode('draft', generateDraft)
  .addNode('review', reviewBeforeSend)  // s'arrêtera ici
  .addNode('send', finaliseAndSend)
  .addEdge(START, 'draft')
  .addEdge('draft', 'review')
  .addEdge('review', 'send')
  .compile({ checkpointer, interruptBefore: ['review'] })

// Exécuter jusqu'à l'interruption
const result = await graph.invoke(input, config)
// result.status === 'interrupted' — montrer le brouillon à l'utilisateur

// Reprendre après approbation humaine
await graph.invoke(new Command({ resume: true }), config)
// Ou rejeter :
await graph.invoke(new Command({ resume: false }), config)
```

### Sous-graphes multi-agents

```typescript
// Sous-graphe pour les tâches de recherche
const researchGraph = new StateGraph(ResearchState)
  .addNode('search', searchNode)
  .addNode('extract', extractNode)
  .addNode('summarise', summariseNode)
  .addEdge(START, 'search')
  .addEdge('search', 'extract')
  .addEdge('extract', 'summarise')
  .addEdge('summarise', END)
  .compile()

// Graphe orchestrateur principal
const orchestratorGraph = new StateGraph(OrchestratorState)
  .addNode('plan', planNode)
  .addNode('research', researchGraph)  // sous-graphe entier comme nœud
  .addNode('write', writeNode)
  .addNode('review', reviewNode)
  .addEdge(START, 'plan')
  .addEdge('plan', 'research')
  .addEdge('research', 'write')
  .addConditionalEdges('write', needsRevision, { yes: 'review', no: END })
  .addEdge('review', 'write')
  .compile({ checkpointer })
```

### Équivalent Python

```python
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langchain_anthropic import ChatAnthropic
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]

model = ChatAnthropic(model="claude-opus-4-7").bind_tools(tools)

def should_continue(state: AgentState) -> str:
    last = state["messages"][-1]
    return "tools" if last.tool_calls else END

graph = (
    StateGraph(AgentState)
    .add_node("agent", lambda s: {"messages": [model.invoke(s["messages"])]})
    .add_node("tools", ToolNode(tools))
    .add_edge(START, "agent")
    .add_conditional_edges("agent", should_continue)
    .add_edge("tools", "agent")
    .compile(checkpointer=MemorySaver())
)

result = graph.invoke(
    {"messages": [HumanMessage("Research AI news")]},
    config={"configurable": {"thread_id": "session-1"}}
)
```

## Exemple

**Utilisateur :** Construire un agent de génération de contenu qui : recherche un sujet, rédige un article, s'arrête pour une révision humaine, puis publie — avec l'état persisté afin qu'il puisse être repris si interrompu.

**Résultat attendu :**
- `AgentState` avec les champs `messages`, `draftContent`, `approved`, `published`
- Nœuds : `research`, `draft`, `review` (avec `interrupt()`), `publish`
- Checkpointer `MemorySaver`, `thread_id` par contenu
- Endpoint API : `POST /generate` (démarre le graphe), `POST /approve` (reprend avec `Command({ resume: true })`)
- Récupération d'état : `GET /status/:threadId` en utilisant `graph.getState(config)`

---
