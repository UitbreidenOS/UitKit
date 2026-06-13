---
name: langgraph
description: "LangGraph stateful agent framework: StateGraph, nodes, edges, conditional branching, persistence/checkpointing, human-in-the-loop, multi-agent subgraphs"
updated: 2026-06-13
---

# LangGraph Skill

## When to activate
- Building a stateful agent that needs to pause, resume, or branch based on conditions
- Implementing human-in-the-loop workflows (agent pauses for approval before continuing)
- Orchestrating multi-step agents with complex branching logic
- Persisting agent state across failures or sessions (checkpointing)
- Building multi-agent systems where subgraphs collaborate

## When NOT to use
- Simple single-turn AI calls — use the Claude API or Vercel AI SDK skill directly
- Linear pipelines with no branching — overkill, use sequential function calls
- When you need a hosted agent loop — use the Mastra skill instead
- Frontend streaming chat UIs — use the Vercel AI SDK skill

## Instructions

### Installation

```bash
npm install @langchain/langgraph @langchain/anthropic @langchain/core
# Python
pip install langgraph langchain-anthropic
```

### Core concepts

LangGraph models agents as **graphs**:
- **Nodes** — functions that run and update state
- **Edges** — connections between nodes (always run → next node, or conditional)
- **State** — a typed object that flows through the graph and accumulates updates
- **Checkpointer** — persists state between runs (enables resume, human-in-the-loop)

### Basic StateGraph (TypeScript)

```typescript
import { StateGraph, Annotation, END, START } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

// 1. Define state shape
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

// 2. Define tools
const searchTool = tool(
  async ({ query }) => `Search results for: ${query}`,
  { name: 'search', description: 'Search the web', schema: z.object({ query: z.string() }) }
)

// 3. Define nodes
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

// 4. Conditional edge — should we keep looping?
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1]
  if (lastMessage.tool_calls?.length) return 'tools'
  return END
}

// 5. Build the graph
const graph = new StateGraph(AgentState)
  .addNode('agent', callModel)
  .addNode('tools', callTools)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent')
  .compile()

// 6. Run it
const result = await graph.invoke({
  messages: [new HumanMessage('Research the latest AI news and summarise it')]
})
```

### Persistence and checkpointing (resume after failure)

```typescript
import { MemorySaver } from '@langchain/langgraph'
// Or for production: PostgresSaver, SqliteSaver

const checkpointer = new MemorySaver()

const graph = new StateGraph(AgentState)
  // ... nodes and edges ...
  .compile({ checkpointer })

// Run with a thread ID — state persists across calls
const config = { configurable: { thread_id: 'user-123-session-1' } }

// First call
await graph.invoke({ messages: [new HumanMessage('Start research')] }, config)

// Resume later (or after failure) — picks up from last checkpoint
await graph.invoke({ messages: [new HumanMessage('Continue')] }, config)

// Get current state
const state = await graph.getState(config)
console.log(state.values.messages)
```

### Human-in-the-loop (interrupt before sensitive action)

```typescript
import { interrupt } from '@langchain/langgraph'

// Node that pauses for human approval
async function reviewBeforeSend(state: typeof AgentState.State) {
  const draft = state.messages[state.messages.length - 1]

  // Pause execution — returns control to the caller
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
  .addNode('review', reviewBeforeSend)  // will pause here
  .addNode('send', finaliseAndSend)
  .addEdge(START, 'draft')
  .addEdge('draft', 'review')
  .addEdge('review', 'send')
  .compile({ checkpointer, interruptBefore: ['review'] })

// Run until interrupt
const result = await graph.invoke(input, config)
// result.status === 'interrupted' — show the draft to user

// Resume after human approval
await graph.invoke(new Command({ resume: true }), config)
// Or reject:
await graph.invoke(new Command({ resume: false }), config)
```

### Multi-agent subgraphs

```typescript
// Subgraph for research tasks
const researchGraph = new StateGraph(ResearchState)
  .addNode('search', searchNode)
  .addNode('extract', extractNode)
  .addNode('summarise', summariseNode)
  .addEdge(START, 'search')
  .addEdge('search', 'extract')
  .addEdge('extract', 'summarise')
  .addEdge('summarise', END)
  .compile()

// Main orchestrator graph
const orchestratorGraph = new StateGraph(OrchestratorState)
  .addNode('plan', planNode)
  .addNode('research', researchGraph)  // entire subgraph as a node
  .addNode('write', writeNode)
  .addNode('review', reviewNode)
  .addEdge(START, 'plan')
  .addEdge('plan', 'research')
  .addEdge('research', 'write')
  .addConditionalEdges('write', needsRevision, { yes: 'review', no: END })
  .addEdge('review', 'write')
  .compile({ checkpointer })
```

### Python equivalent

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

## Example

**User:** Build a content generation agent that: researches a topic, drafts an article, pauses for human review, then publishes — with state persisted so it can be resumed if interrupted.

**Expected output:**
- `AgentState` with `messages`, `draftContent`, `approved`, `published` fields
- Nodes: `research`, `draft`, `review` (with `interrupt()`), `publish`
- `MemorySaver` checkpointer, `thread_id` per content piece
- API endpoint: `POST /generate` (starts graph), `POST /approve` (resumes with `Command({ resume: true })`)
- State retrieval: `GET /status/:threadId` using `graph.getState(config)`

---
