# AI Agent Frameworks — LangGraph, CrewAI, Mastra, and When to Use Each

Three frameworks dominate production agentic AI in 2026: LangGraph, CrewAI, and Mastra. Vercel AI SDK covers the frontend streaming layer. This guide tells you when to use each, how to integrate them with Claude, and how to choose without second-guessing yourself.

---

## Framework Comparison

| Framework | Language | Strength | Best for |
|-----------|----------|----------|----------|
| LangGraph | Python (JS available) | State machines, conditional routing, checkpointing | Complex multi-step agents with branching logic and retry requirements |
| CrewAI | Python | Role-based agent teams, fast prototyping | Business process automation where "roles" map naturally to job functions |
| Mastra | TypeScript | Native Next.js integration, 3,300+ model providers, built-in observability | TypeScript SaaS backends and full-stack Next.js applications |
| Vercel AI SDK | TypeScript | Streaming UI, `useChat`/`useCompletion`, MCP tool support | Streaming chat frontends and simple tool-calling applications |

---

## LangGraph

LangGraph models agents as a **StateGraph** — nodes represent steps, edges represent transitions, and conditional edges implement branching logic. State is persisted across nodes via a typed state object, which enables checkpointing and resume-after-failure.

**Key concepts:**

- `StateGraph`: the graph definition — nodes, edges, and state schema
- `nodes`: functions that receive state, perform work, and return updated state
- `conditional_edges`: route to different nodes based on state values
- `checkpointer`: persist state to SQLite or Postgres for resume-after-failure and human-in-the-loop interrupts

**Claude integration:**

```bash
pip install langchain-anthropic langgraph
```

```python
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from typing import TypedDict, Annotated
import operator

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    next_step: str

llm = ChatAnthropic(model="claude-opus-4-7")

def analyze(state: AgentState) -> AgentState:
    response = llm.invoke(state["messages"])
    return {"messages": [response], "next_step": "review"}

def route(state: AgentState) -> str:
    return state["next_step"] if state["next_step"] != "done" else END

graph = StateGraph(AgentState)
graph.add_node("analyze", analyze)
graph.add_conditional_edges("analyze", route)
graph.set_entry_point("analyze")

app = graph.compile()
```

**When to choose LangGraph:**

- The agent has conditional branching that depends on intermediate results
- You need retry logic, fallback paths, or human-in-the-loop interrupt points
- Workflow state must survive process restarts (long-running jobs, scheduled pipelines)
- Building a research or analysis agent that loops until a quality threshold is met

---

## CrewAI

CrewAI models agents as a **role-based team** — each `Agent` has a role, goal, and backstory; `Task` objects define work items; a `Crew` assembles agents and tasks and runs them sequentially or in parallel.

**Key concepts:**

- `Agent`: an autonomous unit with a role, goal, backstory, and tool set
- `Task`: a defined work item with a description, expected output, and assigned agent
- `Crew`: orchestrates agents and tasks; executes the workflow
- `Process.sequential` / `Process.hierarchical`: execution modes

**Claude integration:**

```bash
pip install crewai
```

```python
from crewai import Agent, Task, Crew, Process, LLM

claude = LLM(model="anthropic/claude-opus-4-7")

researcher = Agent(
    role="Market Researcher",
    goal="Find accurate, current market data on the target segment",
    backstory="Expert in competitive analysis and market sizing.",
    llm=claude,
    verbose=True,
)

writer = Agent(
    role="Report Writer",
    goal="Turn research findings into a concise executive summary",
    backstory="Experienced business writer with a clarity-first approach.",
    llm=claude,
)

editor = Agent(
    role="Senior Editor",
    goal="Review the draft for accuracy and tone before final output",
    backstory="Former management consultant, high bar for precision.",
    llm=claude,
)

research_task = Task(
    description="Research the competitive landscape for B2B SaaS in the HR tech space",
    expected_output="A structured list of top 10 competitors with positioning and pricing notes",
    agent=researcher,
)

write_task = Task(
    description="Write a 500-word executive summary from the research output",
    expected_output="Formatted executive summary with key findings and recommendation",
    agent=writer,
)

edit_task = Task(
    description="Review and finalize the executive summary",
    expected_output="Final polished document ready for stakeholder delivery",
    agent=editor,
)

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, write_task, edit_task],
    process=Process.sequential,
    verbose=True,
)

result = crew.kickoff()
```

**When to choose CrewAI:**

- The workflow maps naturally to job functions (researcher, writer, reviewer, approver)
- Prototyping speed matters — role-based setup is faster than StateGraph definitions
- Business process automation where the "team" metaphor is intuitive for non-technical stakeholders
- Less complex branching logic; mostly linear pipelines with specialized steps

---

## Mastra

Mastra is **TypeScript-first**, built for Next.js and Node.js SaaS backends. It includes a built-in model router (3,300+ models from 94 providers), native observability (traces, logs, evals), and a workflow engine with step-based composition.

**Key concepts:**

- `Agent`: an agent with instructions, tools, and a model assignment
- `Workflow`: a composable series of steps with branching support
- `Model Router`: select from 3,300+ models; switch providers without code changes
- `Observability`: built-in tracing to any OpenTelemetry-compatible backend

**Claude integration:**

```bash
npm install @mastra/core @ai-sdk/anthropic
```

```typescript
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { anthropic } from "@ai-sdk/anthropic";

const analysisAgent = new Agent({
  name: "Analysis Agent",
  instructions:
    "You analyze user data and produce structured JSON reports. Be precise and concise.",
  model: anthropic("claude-opus-4-7"),
});

const mastra = new Mastra({
  agents: { analysisAgent },
});

const agent = mastra.getAgent("analysisAgent");

const result = await agent.generate(
  "Analyze the following churn data and identify the top three risk factors: ...",
  { output: "json" }
);

console.log(result.object);
```

**When to choose Mastra:**

- The stack is TypeScript — Mastra is the only major framework that is TypeScript-native with full type safety
- Building in Next.js — Mastra has first-class integration with Next.js App Router
- You need to swap models across providers without rewriting agent code
- Built-in observability and eval tooling matters (staging vs. production model comparison)

---

## Vercel AI SDK

The Vercel AI SDK is a **lightweight streaming layer** for TypeScript frontends. It handles streaming chat UI (`useChat`, `useCompletion`), tool calling, MCP integration, and multi-step agent interactions in React and Next.js apps.

**Key concepts:**

- `useChat`: React hook for chat UI with streaming support
- `useCompletion`: single-turn completion with streaming
- `streamText` / `generateText`: server-side streaming and generation
- Tool calling with `tool()` definitions and automatic invocation

**Claude integration:**

```bash
npm install @ai-sdk/anthropic ai
```

```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-sonnet-4-6"),
    messages,
    tools: {
      getWeather: tool({
        description: "Get current weather for a location",
        parameters: z.object({ city: z.string() }),
        execute: async ({ city }) => fetchWeather(city),
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
```

**When to choose Vercel AI SDK:**

- Building a streaming chat or completion UI in React or Next.js
- Simple tool-calling use cases — no complex state graphs needed
- Rapid frontend prototyping where the agent logic is straightforward
- The team is already using the Vercel ecosystem and wants minimal new dependencies

---

## Decision Tree

```
Is the stack Python or TypeScript?
│
├── Python
│   │
│   └── Does the workflow have complex branching, retry logic, or checkpointing?
│       │
│       ├── Yes → LangGraph
│       │
│       └── No → Do the steps map naturally to job roles (researcher, writer, reviewer)?
│               │
│               ├── Yes → CrewAI
│               └── No  → LangGraph (StateGraph is flexible enough for linear pipelines too)
│
└── TypeScript
    │
    └── Is this a full-stack Next.js SaaS or Node backend?
        │
        ├── Yes → Mastra
        │
        └── No → Is this primarily a streaming chat or simple tool-calling UI?
                │
                ├── Yes → Vercel AI SDK
                └── No  → Mastra (better observability and agent tooling than raw AI SDK)
```

---

## Combining with Claude Code

All four frameworks integrate directly with Claude Code workflows:

- **Claude Code writes the framework code** — describe the agent workflow in natural language, Claude Code generates the StateGraph, Crew definition, or Mastra agent
- **Claude Code tests and iterates** — run the agent pipeline, inspect outputs, ask Claude Code to refine routing logic or add tools
- **Claude Code handles the surrounding codebase** — database connections, API endpoints, deployment config, environment variables
- **The framework executes the agents** — at runtime, the framework (not Claude Code) orchestrates the agent steps

Typical workflow:

```
1. Describe the multi-agent workflow to Claude Code
2. Claude Code generates the initial framework scaffolding
3. Run the pipeline: `python main.py` or `npx ts-node agent.ts`
4. Paste failing output back to Claude Code for diagnosis
5. Iterate until the pipeline produces correct output
6. Claude Code writes tests for the workflow's critical paths
```

Claude Code works best when you tell it which framework you are using at the start of the session. Add the framework choice to `CLAUDE.md` in the project root to keep it consistent across sessions.

---
