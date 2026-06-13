---
name: langgraph
description: "LangGraph stateful agent framework: StateGraph, nodes, edges, conditional branching, persistence/checkpointing, human-in-the-loop, multi-agent subgraphs"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../langgraph.md).

# LangGraph-vaardigheid

## Wanneer activeren
- Een stateful agent bouwen die moet pauzeren, hervatten of vertakken op basis van condities
- Mens-in-de-lus-workflows implementeren (agent pauzeert voor goedkeuring voordat hij doorgaat)
- Meerstapsagenten orchestreren met complexe vertakkingslogica
- Agentenstatus bewaren over storingen of sessies heen (checkpointing)
- Multi-agentsystemen bouwen waarbij subgrafen samenwerken

## Wanneer NIET gebruiken
- Eenvoudige enkelvoudige AI-aanroepen — gebruik de Claude API of de Vercel AI SDK-vaardigheid rechtstreeks
- Lineaire pipelines zonder vertakkingen — te zwaar, gebruik sequentiële functieaanroepen
- Wanneer u een gehoste agentenlus nodig heeft — gebruik de Mastra-vaardigheid
- Frontend-streaming-chat-UI's — gebruik de Vercel AI SDK-vaardigheid

## Instructies

### Installatie

```bash
npm install @langchain/langgraph @langchain/anthropic @langchain/core
# Python
pip install langgraph langchain-anthropic
```

### Kernconcepten

LangGraph modelleert agenten als **grafen**:
- **Knooppunten** — functies die worden uitgevoerd en de status bijwerken
- **Randen** — verbindingen tussen knooppunten (altijd uitvoeren → volgend knooppunt, of voorwaardelijk)
- **Status** — een getypeerd object dat door de graaf stroomt en updates accumuleert
- **Checkpointer** — bewaart de status tussen uitvoeringen (maakt hervatten, mens-in-de-lus mogelijk)

### Basis StateGraph (TypeScript)

```typescript
import { StateGraph, Annotation, END, START } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

// 1. Statusvorm definiëren
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

// 2. Tools definiëren
const searchTool = tool(
  async ({ query }) => `Search results for: ${query}`,
  { name: 'search', description: 'Search the web', schema: z.object({ query: z.string() }) }
)

// 3. Knooppunten definiëren
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

// 4. Voorwaardelijke rand — blijven we lussen?
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1]
  if (lastMessage.tool_calls?.length) return 'tools'
  return END
}

// 5. De graaf bouwen
const graph = new StateGraph(AgentState)
  .addNode('agent', callModel)
  .addNode('tools', callTools)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent')
  .compile()

// 6. Uitvoeren
const result = await graph.invoke({
  messages: [new HumanMessage('Research the latest AI news and summarise it')]
})
```

### Persistentie en checkpointing (hervatten na storing)

```typescript
import { MemorySaver } from '@langchain/langgraph'
// Of voor productie: PostgresSaver, SqliteSaver

const checkpointer = new MemorySaver()

const graph = new StateGraph(AgentState)
  // ... knooppunten en randen ...
  .compile({ checkpointer })

// Uitvoeren met een thread-ID — status blijft bewaard over aanroepen
const config = { configurable: { thread_id: 'user-123-session-1' } }

// Eerste aanroep
await graph.invoke({ messages: [new HumanMessage('Start research')] }, config)

// Later hervatten (of na storing) — gaat verder vanaf laatste checkpoint
await graph.invoke({ messages: [new HumanMessage('Continue')] }, config)

// Huidige status ophalen
const state = await graph.getState(config)
console.log(state.values.messages)
```

### Mens-in-de-lus (onderbreking voor gevoelige actie)

```typescript
import { interrupt } from '@langchain/langgraph'

// Knooppunt dat pauzeert voor menselijke goedkeuring
async function reviewBeforeSend(state: typeof AgentState.State) {
  const draft = state.messages[state.messages.length - 1]

  // Uitvoering pauzeren — controle teruggeven aan de aanroeper
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
  .addNode('review', reviewBeforeSend)  // zal hier pauzeren
  .addNode('send', finaliseAndSend)
  .addEdge(START, 'draft')
  .addEdge('draft', 'review')
  .addEdge('review', 'send')
  .compile({ checkpointer, interruptBefore: ['review'] })

// Uitvoeren tot onderbreking
const result = await graph.invoke(input, config)
// result.status === 'interrupted' — concept tonen aan gebruiker

// Hervatten na menselijke goedkeuring
await graph.invoke(new Command({ resume: true }), config)
// Of afwijzen:
await graph.invoke(new Command({ resume: false }), config)
```

### Multi-agent subgrafen

```typescript
// Subgraaf voor onderzoekstaken
const researchGraph = new StateGraph(ResearchState)
  .addNode('search', searchNode)
  .addNode('extract', extractNode)
  .addNode('summarise', summariseNode)
  .addEdge(START, 'search')
  .addEdge('search', 'extract')
  .addEdge('extract', 'summarise')
  .addEdge('summarise', END)
  .compile()

// Hoofdorkestratorgraaf
const orchestratorGraph = new StateGraph(OrchestratorState)
  .addNode('plan', planNode)
  .addNode('research', researchGraph)  // gehele subgraaf als knooppunt
  .addNode('write', writeNode)
  .addNode('review', reviewNode)
  .addEdge(START, 'plan')
  .addEdge('plan', 'research')
  .addEdge('research', 'write')
  .addConditionalEdges('write', needsRevision, { yes: 'review', no: END })
  .addEdge('review', 'write')
  .compile({ checkpointer })
```

### Python-equivalent

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

## Voorbeeld

**Gebruiker:** Bouw een contentgeneratieagent die: een onderwerp onderzoekt, een artikel opstelt, pauzeert voor menselijke beoordeling, en vervolgens publiceert — met bewaarde status zodat het kan worden hervat als het wordt onderbroken.

**Verwachte uitvoer:**
- `AgentState` met de velden `messages`, `draftContent`, `approved`, `published`
- Knooppunten: `research`, `draft`, `review` (met `interrupt()`), `publish`
- `MemorySaver`-checkpointer, `thread_id` per inhoudsonderdeel
- API-endpoint: `POST /generate` (start graaf), `POST /approve` (hervat met `Command({ resume: true })`)
- Statusophaling: `GET /status/:threadId` met `graph.getState(config)`

---
