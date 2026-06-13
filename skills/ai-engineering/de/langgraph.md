---
name: langgraph
description: "LangGraph stateful agent framework: StateGraph, nodes, edges, conditional branching, persistence/checkpointing, human-in-the-loop, multi-agent subgraphs"
---

> 🇩🇪 Deutsche Version. [Englische Version](../langgraph.md).

# LangGraph-Kompetenz

## Wann aktivieren
- Aufbau eines zustandsbehafteten Agenten, der anhalten, fortsetzen oder basierend auf Bedingungen verzweigen muss
- Implementierung von Mensch-in-der-Schleife-Workflows (Agent hält vor Genehmigung an)
- Orchestrierung von Mehrstufenagenten mit komplexer Verzweigungslogik
- Persistierung des Agentenzustands zwischen Ausfällen oder Sitzungen (Checkpointing)
- Aufbau von Multi-Agenten-Systemen, bei denen Teilgraphen zusammenarbeiten

## Wann NICHT verwenden
- Einfache Einzel-Runden-KI-Aufrufe — direkt die Claude API oder die Vercel AI SDK-Kompetenz verwenden
- Lineare Pipelines ohne Verzweigungen — zu aufwändig, sequentielle Funktionsaufrufe verwenden
- Wenn eine gehostete Agentenschleife benötigt wird — stattdessen die Mastra-Kompetenz verwenden
- Frontend-Streaming-Chat-UIs — die Vercel AI SDK-Kompetenz verwenden

## Anweisungen

### Installation

```bash
npm install @langchain/langgraph @langchain/anthropic @langchain/core
# Python
pip install langgraph langchain-anthropic
```

### Kernkonzepte

LangGraph modelliert Agenten als **Graphen**:
- **Knoten** — Funktionen, die ausgeführt werden und den Zustand aktualisieren
- **Kanten** — Verbindungen zwischen Knoten (immer ausführen → nächster Knoten, oder konditional)
- **Zustand** — ein typisiertes Objekt, das durch den Graphen fließt und Aktualisierungen akkumuliert
- **Checkpointer** — persistiert den Zustand zwischen Ausführungen (ermöglicht Wiederaufnahme, Mensch-in-der-Schleife)

### Basis-StateGraph (TypeScript)

```typescript
import { StateGraph, Annotation, END, START } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

// 1. Zustandsform definieren
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

// 2. Tools definieren
const searchTool = tool(
  async ({ query }) => `Search results for: ${query}`,
  { name: 'search', description: 'Search the web', schema: z.object({ query: z.string() }) }
)

// 3. Knoten definieren
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

// 4. Bedingte Kante — weiter schleifen?
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1]
  if (lastMessage.tool_calls?.length) return 'tools'
  return END
}

// 5. Graphen aufbauen
const graph = new StateGraph(AgentState)
  .addNode('agent', callModel)
  .addNode('tools', callTools)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent')
  .compile()

// 6. Ausführen
const result = await graph.invoke({
  messages: [new HumanMessage('Research the latest AI news and summarise it')]
})
```

### Persistenz und Checkpointing (Wiederaufnahme nach Ausfall)

```typescript
import { MemorySaver } from '@langchain/langgraph'
// Oder für Produktion: PostgresSaver, SqliteSaver

const checkpointer = new MemorySaver()

const graph = new StateGraph(AgentState)
  // ... Knoten und Kanten ...
  .compile({ checkpointer })

// Mit Thread-ID ausführen — Zustand persistiert über Aufrufe
const config = { configurable: { thread_id: 'user-123-session-1' } }

// Erster Aufruf
await graph.invoke({ messages: [new HumanMessage('Start research')] }, config)

// Später wiederaufnehmen (oder nach Ausfall) — beginnt am letzten Checkpoint
await graph.invoke({ messages: [new HumanMessage('Continue')] }, config)

// Aktuellen Zustand abrufen
const state = await graph.getState(config)
console.log(state.values.messages)
```

### Mensch-in-der-Schleife (Unterbrechung vor sensibler Aktion)

```typescript
import { interrupt } from '@langchain/langgraph'

// Knoten, der auf menschliche Genehmigung wartet
async function reviewBeforeSend(state: typeof AgentState.State) {
  const draft = state.messages[state.messages.length - 1]

  // Ausführung pausieren — Kontrolle an Aufrufer zurückgeben
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
  .addNode('review', reviewBeforeSend)  // wird hier pausieren
  .addNode('send', finaliseAndSend)
  .addEdge(START, 'draft')
  .addEdge('draft', 'review')
  .addEdge('review', 'send')
  .compile({ checkpointer, interruptBefore: ['review'] })

// Bis zur Unterbrechung ausführen
const result = await graph.invoke(input, config)
// result.status === 'interrupted' — Entwurf dem Benutzer zeigen

// Nach menschlicher Genehmigung fortsetzen
await graph.invoke(new Command({ resume: true }), config)
// Oder ablehnen:
await graph.invoke(new Command({ resume: false }), config)
```

### Multi-Agenten-Teilgraphen

```typescript
// Teilgraph für Rechercheaufgaben
const researchGraph = new StateGraph(ResearchState)
  .addNode('search', searchNode)
  .addNode('extract', extractNode)
  .addNode('summarise', summariseNode)
  .addEdge(START, 'search')
  .addEdge('search', 'extract')
  .addEdge('extract', 'summarise')
  .addEdge('summarise', END)
  .compile()

// Haupt-Orchestratorgraph
const orchestratorGraph = new StateGraph(OrchestratorState)
  .addNode('plan', planNode)
  .addNode('research', researchGraph)  // gesamter Teilgraph als Knoten
  .addNode('write', writeNode)
  .addNode('review', reviewNode)
  .addEdge(START, 'plan')
  .addEdge('plan', 'research')
  .addEdge('research', 'write')
  .addConditionalEdges('write', needsRevision, { yes: 'review', no: END })
  .addEdge('review', 'write')
  .compile({ checkpointer })
```

### Python-Äquivalent

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

## Beispiel

**Benutzer:** Einen Content-Generierungsagenten aufbauen, der: ein Thema recherchiert, einen Artikel entwirft, für menschliche Überprüfung pausiert, dann veröffentlicht — mit persistiertem Zustand, damit er bei Unterbrechung fortgesetzt werden kann.

**Erwartetes Ergebnis:**
- `AgentState` mit den Feldern `messages`, `draftContent`, `approved`, `published`
- Knoten: `research`, `draft`, `review` (mit `interrupt()`), `publish`
- `MemorySaver`-Checkpointer, `thread_id` pro Inhaltsstück
- API-Endpunkt: `POST /generate` (startet Graphen), `POST /approve` (setzt fort mit `Command({ resume: true })`)
- Zustandsabfrage: `GET /status/:threadId` mit `graph.getState(config)`

---
