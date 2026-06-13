# AI-agentframeworks — LangGraph, CrewAI, Mastra, en wanneer elk te gebruiken

Drie frameworks domineren productie-agentic AI in 2026: LangGraph, CrewAI en Mastra. Vercel AI SDK behandelt de streaming-laag voor het front-end. Deze gids vertelt u wanneer elk te gebruiken, hoe ze met Claude te integreren en hoe u zonder zelfwijfel kunt kiezen.

---

## Frameworkvergelijking

| Framework | Taal | Sterkte | Beste voor |
|-----------|----------|----------|----------|
| LangGraph | Python (JS beschikbaar) | State machines, voorwaardelijke routering, checkpointing | Complexe multi-stap agents met vertakkingslogica en herhaalvereisten |
| CrewAI | Python | Op rollen gebaseerde agent teams, snelle prototyping | Business process automation waar "rollen" natuurlijk toewijzen aan banen |
| Mastra | TypeScript | Native Next.js-integratie, 3.300+ modelproviders, ingebouwde observability | TypeScript SaaS-backends en full-stack Next.js-applicaties |
| Vercel AI SDK | TypeScript | Streaming UI, `useChat`/`useCompletion`, MCP tool-ondersteuning | Streaming chat front-ends en eenvoudige tool-calling applicaties |

---

## LangGraph

LangGraph modelt agents als een **StateGraph** — nodes vertegenwoordigen stappen, edges vertegenwoordigen transities, en voorwaardelijke edges implementeren vertakkingslogica. State wordt bewaard in nodes via een getypeerd state-object, waardoor checkpointing en hervatten na mislukking mogelijk is.

**Sleutelconcepten:**

- `StateGraph`: de graph-definitie — nodes, edges en state schema
- `nodes`: functies die state ontvangen, werk uitvoeren en bijgewerkte state retourneren
- `conditional_edges`: routeer naar verschillende nodes op basis van state-waarden
- `checkpointer`: bewaar state in SQLite of Postgres voor hervatten na mislukking en human-in-the-loop interrupts

**Claude-integratie:**

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

**Wanneer LangGraph kiezen:**

- De agent heeft voorwaardelijke vertakking die afhangt van tussenliggende resultaten
- U hebt retry logica, fallback paden of human-in-the-loop interrupt points nodig
- Agent state moet procesherstarties overleven (lange termijn taken, geplande pijplijnen)
- Een onderzoeks- of analyse-agent bouwen die looped totdat een kwaliteitsdrempel wordt bereikt

---

## CrewAI

CrewAI modelt agents als een **op rollen gebaseerd team** — elke `Agent` heeft een rol, doel en backstory; `Task` objecten definiëren werkitems; een `Crew` assembleert agents en tasks en voert ze opeenvolgend of parallel uit.

**Sleutelconcepten:**

- `Agent`: een autonoom eenheid met rol, doel, backstory en toolset
- `Task`: een gedefinieerd werkitem met beschrijving, verwachte output en toegewezen agent
- `Crew`: orchestreert agents en tasks; voert de workflow uit
- `Process.sequential` / `Process.hierarchical`: executie modi

**Claude-integratie:**

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

**Wanneer CrewAI kiezen:**

- De workflow wijst natuurlijk aan jobfuncties toe (onderzoeker, schrijver, reviewer, approver)
- Prototyping snelheid is belangrijk — op rollen gebaseerde setup is sneller dan StateGraph definities
- Business process automation waarbij de "team" metafoor intuïtief is voor niet-technische stakeholders
- Minder complexe vertakkingslogica; meestal lineaire pijplijnen met gespecialiseerde stappen

---

## Mastra

Mastra is **TypeScript-first**, gebouwd voor Next.js en Node.js SaaS backends. Het bevat een ingebouwde modelrouter (3.300+ modellen van 94 providers), native observability (traces, logs, evals) en een workflow engine met stappengebaseerde compositie.

**Sleutelconcepten:**

- `Agent`: een agent met instructies, gereedschappen en modelinstelling
- `Workflow`: een composeerbare reeks stappen met vertakkingsondersteuning
- `Model Router`: selecteer uit 3.300+ modellen; wissel providers zonder codewijzigingen
- `Observability`: ingebouwde tracing naar elk OpenTelemetry-compatibel backend

**Claude-integratie:**

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

**Wanneer Mastra kiezen:**

- De stack is TypeScript — Mastra is het enige grote framework dat TypeScript-native is met volledige type veiligheid
- Bouwen in Next.js — Mastra heeft eersteklas integratie met Next.js App Router
- U moet modellen in providers wisselen zonder agent code te herschrijven
- Ingebouwde observability en eval tooling is belangrijk (staging versus productiemodel vergelijking)

---

## Vercel AI SDK

De Vercel AI SDK is een **lichte streaming-laag** voor TypeScript front-ends. Het verwerkt streaming chat UI (`useChat`, `useCompletion`), tool-calling, MCP-integratie en multi-stap agent interacties in React en Next.js apps.

**Sleutelconcepten:**

- `useChat`: React-hook voor chat UI met streaming-ondersteuning
- `useCompletion`: single-turn completion met streaming
- `streamText` / `generateText`: server-side streaming en generatie
- Tool-calling met `tool()` definities en automatische invocatie

**Claude-integratie:**

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

**Wanneer Vercel AI SDK kiezen:**

- Bouw een streaming chat of completion UI in React of Next.js
- Eenvoudige tool-calling usecases — geen complexe state graphs nodig
- Snelle front-end prototyping waarbij de agent logica recht is
- Het team gebruikt al het Vercel-ecosysteem en wilt minimale nieuwe afhankelijkheden

---

## Beslisboom

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

## Combineren met Claude Code

Alle vier frameworks integreren rechtstreeks met Claude Code workflows:

- **Claude Code schrijft de frameworkcode** — beschrijf de agent workflow in natuurlijk taal, Claude Code genereert de StateGraph, Crew definitie of Mastra agent
- **Claude Code test en herhaalt** — voer de agent-pijplijn uit, inspecteer outputs, vraag Claude Code om routeringslogica te verfijnen of tools toe te voegen
- **Claude Code verwerkt de omringende codebase** — databaseverbindingen, API-eindpunten, implementatieconfiguratie, omgevingsvariabelen
- **Het framework voert de agents uit** — bij runtime orchestreert het framework (niet Claude Code) de agent-stappen

Typische workflow:

```
1. Describe the multi-agent workflow to Claude Code
2. Claude Code generates the initial framework scaffolding
3. Run the pipeline: `python main.py` or `npx ts-node agent.ts`
4. Paste failing output back to Claude Code for diagnosis
5. Iterate until the pipeline produces correct output
6. Claude Code writes tests for the workflow's critical paths
```

Claude Code werkt het beste wanneer u aan het begin van de sessie aangeeft welk framework u gebruikt. Voeg de framework-keuze toe aan `CLAUDE.md` in de projectroot om het consistent in sessies te houden.

---
