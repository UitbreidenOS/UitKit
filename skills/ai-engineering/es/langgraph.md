---
name: langgraph
description: "LangGraph stateful agent framework: StateGraph, nodes, edges, conditional branching, persistence/checkpointing, human-in-the-loop, multi-agent subgraphs"
---

> 🇪🇸 Versión en español. [Versión en inglés](../langgraph.md).

# Habilidad LangGraph

## Cuándo activar
- Construir un agente con estado que necesita pausar, reanudar o bifurcarse según condiciones
- Implementar flujos de trabajo de humano-en-el-bucle (el agente pausa para aprobación antes de continuar)
- Orquestar agentes de múltiples pasos con lógica de ramificación compleja
- Persistir el estado del agente entre fallos o sesiones (checkpointing)
- Construir sistemas multi-agente donde los subgrafos colaboran

## Cuándo NO usar
- Llamadas de IA simples de un solo turno — usar la API Claude o la habilidad Vercel AI SDK directamente
- Pipelines lineales sin ramificaciones — excesivo, usar llamadas de funciones secuenciales
- Cuando necesite un bucle de agente alojado — usar la habilidad Mastra en su lugar
- Interfaces de chat de streaming en frontend — usar la habilidad Vercel AI SDK

## Instrucciones

### Instalación

```bash
npm install @langchain/langgraph @langchain/anthropic @langchain/core
# Python
pip install langgraph langchain-anthropic
```

### Conceptos fundamentales

LangGraph modela agentes como **grafos**:
- **Nodos** — funciones que se ejecutan y actualizan el estado
- **Aristas** — conexiones entre nodos (siempre ejecutar → siguiente nodo, o condicional)
- **Estado** — un objeto tipado que fluye a través del grafo y acumula actualizaciones
- **Checkpointer** — persiste el estado entre ejecuciones (permite reanudar, humano-en-el-bucle)

### StateGraph básico (TypeScript)

```typescript
import { StateGraph, Annotation, END, START } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

// 1. Definir la forma del estado
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

// 2. Definir herramientas
const searchTool = tool(
  async ({ query }) => `Search results for: ${query}`,
  { name: 'search', description: 'Search the web', schema: z.object({ query: z.string() }) }
)

// 3. Definir nodos
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

// 4. Arista condicional — ¿seguimos iterando?
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1]
  if (lastMessage.tool_calls?.length) return 'tools'
  return END
}

// 5. Construir el grafo
const graph = new StateGraph(AgentState)
  .addNode('agent', callModel)
  .addNode('tools', callTools)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent')
  .compile()

// 6. Ejecutarlo
const result = await graph.invoke({
  messages: [new HumanMessage('Research the latest AI news and summarise it')]
})
```

### Persistencia y checkpointing (reanudar después de un fallo)

```typescript
import { MemorySaver } from '@langchain/langgraph'
// O para producción: PostgresSaver, SqliteSaver

const checkpointer = new MemorySaver()

const graph = new StateGraph(AgentState)
  // ... nodos y aristas ...
  .compile({ checkpointer })

// Ejecutar con un ID de hilo — el estado persiste entre llamadas
const config = { configurable: { thread_id: 'user-123-session-1' } }

// Primera llamada
await graph.invoke({ messages: [new HumanMessage('Start research')] }, config)

// Reanudar más tarde (o después de un fallo) — continúa desde el último checkpoint
await graph.invoke({ messages: [new HumanMessage('Continue')] }, config)

// Obtener el estado actual
const state = await graph.getState(config)
console.log(state.values.messages)
```

### Humano-en-el-bucle (interrupción antes de una acción sensible)

```typescript
import { interrupt } from '@langchain/langgraph'

// Nodo que pausa para aprobación humana
async function reviewBeforeSend(state: typeof AgentState.State) {
  const draft = state.messages[state.messages.length - 1]

  // Pausar la ejecución — devuelve el control al llamador
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
  .addNode('review', reviewBeforeSend)  // pausará aquí
  .addNode('send', finaliseAndSend)
  .addEdge(START, 'draft')
  .addEdge('draft', 'review')
  .addEdge('review', 'send')
  .compile({ checkpointer, interruptBefore: ['review'] })

// Ejecutar hasta la interrupción
const result = await graph.invoke(input, config)
// result.status === 'interrupted' — mostrar el borrador al usuario

// Reanudar después de la aprobación humana
await graph.invoke(new Command({ resume: true }), config)
// O rechazar:
await graph.invoke(new Command({ resume: false }), config)
```

### Subgrafos multi-agente

```typescript
// Subgrafo para tareas de investigación
const researchGraph = new StateGraph(ResearchState)
  .addNode('search', searchNode)
  .addNode('extract', extractNode)
  .addNode('summarise', summariseNode)
  .addEdge(START, 'search')
  .addEdge('search', 'extract')
  .addEdge('extract', 'summarise')
  .addEdge('summarise', END)
  .compile()

// Grafo orquestador principal
const orchestratorGraph = new StateGraph(OrchestratorState)
  .addNode('plan', planNode)
  .addNode('research', researchGraph)  // subgrafo completo como nodo
  .addNode('write', writeNode)
  .addNode('review', reviewNode)
  .addEdge(START, 'plan')
  .addEdge('plan', 'research')
  .addEdge('research', 'write')
  .addConditionalEdges('write', needsRevision, { yes: 'review', no: END })
  .addEdge('review', 'write')
  .compile({ checkpointer })
```

### Equivalente en Python

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

## Ejemplo

**Usuario:** Construir un agente de generación de contenido que: investiga un tema, redacta un artículo, pausa para revisión humana, luego publica — con estado persistido para que pueda reanudarse si se interrumpe.

**Resultado esperado:**
- `AgentState` con los campos `messages`, `draftContent`, `approved`, `published`
- Nodos: `research`, `draft`, `review` (con `interrupt()`), `publish`
- Checkpointer `MemorySaver`, `thread_id` por pieza de contenido
- Endpoint de API: `POST /generate` (inicia el grafo), `POST /approve` (reanuda con `Command({ resume: true })`)
- Recuperación de estado: `GET /status/:threadId` usando `graph.getState(config)`

---
