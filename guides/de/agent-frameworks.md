# AI Agent Frameworks — LangGraph, CrewAI, Mastra, and When to Use Each

Drei Frameworks dominieren produktion agentic AI in 2026: LangGraph, CrewAI und Mastra. Vercel AI SDK deckt die Frontend-Streaming-Schicht ab. Dieser Leitfaden sagt Ihnen, wann Sie jedes verwenden, wie Sie sie mit Claude integrieren, und wie Sie ohne Selbstzweifel wählen.

---

## Framework-Vergleich

| Framework | Sprache | Stärke | Am besten für |
|---|---|---|---|
| LangGraph | Python (JS verfügbar) | State Machines, Conditional Routing, Checkpointing | Komplexe mehrstufige Agents mit Verzweigungslogik und Wiederholungsanforderungen |
| CrewAI | Python | Rollenbasierte Agent Teams, schnelle Prototypenerstellung | Business Process Automation, wo "Rollen" natürlich zu Jobfunktionen passen |
| Mastra | TypeScript | Native Next.js Integration, 3.300+ Modell-Provider, integrierte Observability | TypeScript SaaS Backends und Full-Stack Next.js Anwendungen |
| Vercel AI SDK | TypeScript | Streaming UI, `useChat`/`useCompletion`, MCP Tool Support | Streaming Chat Frontends und einfache Tool-Calling Anwendungen |

---

## LangGraph

LangGraph modelliert Agents als **StateGraph** — Nodes repräsentieren Schritte, Edges repräsentieren Übergänge, und Conditional Edges implementieren Verzweigungslogik. State wird über einen typisierten State-Object über Nodes hinweg persistiert, was Checkpointing und Resume-nach-Fehler ermöglicht.

**Schlüsselkonzepte:**

- `StateGraph`: die Graph-Definition — Nodes, Edges und State-Schema
- `nodes`: Funktionen, die State erhalten, Arbeit durchführen und aktualisierten State zurückgeben
- `conditional_edges`: Leiten zu verschiedenen Nodes basierend auf State-Werten
- `checkpointer`: Persistiert State zu SQLite oder Postgres für Resume-nach-Fehler und Human-in-the-Loop Interrupts

**Claude-Integration:**

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

**Wann LangGraph wählen:**

- Der Agent hat Conditional Branching, das von Zwischenergebnissen abhängt
- Sie benötigen Wiederholungslogik, Fallback-Pfade oder Human-in-the-Loop Interrupt Points
- Workflow-State muss Prozessneustarts überleben (lange Jobs, geplante Pipelines)
- Bauen eines Research- oder Analysis-Agents, der bis zu einem Qualitätsschwellenwert loopt

---

## CrewAI

CrewAI modelliert Agents als **rollenbasiertes Team** — jeder `Agent` hat eine Rolle, ein Ziel und eine Hintergrundgeschichte; `Task`-Objekte definieren Work Items; eine `Crew` montiert Agents und Tasks und führt sie sequenziell oder parallel aus.

**Schlüsselkonzepte:**

- `Agent`: eine autonome Einheit mit Rolle, Ziel, Hintergrundgeschichte und Tool-Set
- `Task`: ein definiertes Work Item mit Beschreibung, erwarteter Ausgabe und zugewiesenem Agent
- `Crew`: orchestriert Agents und Tasks; führt den Workflow aus
- `Process.sequential` / `Process.hierarchical`: Ausführungsmodi

**Claude-Integration:**

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

**Wann CrewAI wählen:**

- Der Workflow passt natürlich zu Jobfunktionen (Researcher, Writer, Reviewer, Approver)
- Prototyping-Geschwindigkeit ist wichtig — rollenbasiertes Setup ist schneller als StateGraph-Definitionen
- Business Process Automation, wo die "Team"-Metapher für non-technical Stakeholder intuitiv ist
- Weniger komplexe Verzweigungslogik; meist lineare Pipelines mit spezialisierten Schritten

---

## Mastra

Mastra ist **TypeScript-first**, gebaut für Next.js und Node.js SaaS Backends. Es beinhaltet einen integrierten Model Router (3.300+ Modelle von 94 Providern), native Observability (Traces, Logs, Evals) und eine Workflow Engine mit Step-basierter Komposition.

**Schlüsselkonzepte:**

- `Agent`: ein Agent mit Instruktionen, Tools und Modell-Zuweisung
- `Workflow`: eine komponierbare Serie von Schritten mit Verzweigungsunterstützung
- `Model Router`: Wählen Sie aus 3.300+ Modellen; wechseln Sie Provider ohne Code-Änderungen
- `Observability`: integrierte Tracing zu OpenTelemetry-kompatiblem Backend

**Claude-Integration:**

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

**Wann Mastra wählen:**

- Der Stack ist TypeScript — Mastra ist das einzige große Framework, das TypeScript-nativ mit vollständiger Type Safety ist
- Bauen in Next.js — Mastra hat First-Class-Integration mit Next.js App Router
- Sie müssen Modelle über Provider hinweg wechseln, ohne Agent-Code zu schreiben
- Integrierte Observability und Eval-Tooling ist wichtig (Staging vs. Produktions-Modell-Vergleich)

---

## Vercel AI SDK

Das Vercel AI SDK ist eine **leichte Streaming-Schicht** für TypeScript Frontends. Es verarbeitet Streaming Chat UI (`useChat`, `useCompletion`), Tool-Calling, MCP-Integration und mehrstufige Agent-Interaktionen in React und Next.js Apps.

**Schlüsselkonzepte:**

- `useChat`: React Hook für Chat UI mit Streaming-Unterstützung
- `useCompletion`: Single-Turn Completion mit Streaming
- `streamText` / `generateText`: Server-Side Streaming und Generierung
- Tool-Calling mit `tool()`-Definitionen und automatischer Invokation

**Claude-Integration:**

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

**Wann Vercel AI SDK wählen:**

- Bauen einer Streaming Chat oder Completion UI in React oder Next.js
- Einfache Tool-Calling Use-Cases — keine komplexe State-Graphen erforderlich
- Schnelle Frontend-Prototypenerstellung, wo die Agent-Logik unkompliziert ist
- Das Team nutzt bereits das Vercel-Ökosystem und möchte minimale neue Abhängigkeiten

---

## Entscheidungsbaum

```
Ist der Stack Python oder TypeScript?
│
├── Python
│   │
│   └── Hat der Workflow komplexe Branching, Wiederholungslogik oder Checkpointing?
│       │
│       ├── Ja → LangGraph
│       │
│       └── Nein → Passen die Schritte natürlich zu Jobfunktionen (Researcher, Writer, Reviewer)?
│               │
│               ├── Ja → CrewAI
│               └── Nein  → LangGraph (StateGraph ist flexibel genug für lineare Pipelines auch)
│
└── TypeScript
    │
    └── Ist dies ein Full-Stack Next.js SaaS oder Node Backend?
        │
        ├── Ja → Mastra
        │
        └── Nein → Ist dies primär eine Streaming Chat oder einfache Tool-Calling UI?
                │
                ├── Ja → Vercel AI SDK
                └── Nein  → Mastra (bessere Observability und Agent Tooling als raw AI SDK)
```

---

## Kombinieren mit Claude Code

Alle vier Frameworks integrieren direkt mit Claude Code Workflows:

- **Claude Code schreibt Framework-Code** — beschreiben Sie den Agent-Workflow in natürlicher Sprache, Claude Code generiert die StateGraph, Crew Definition oder Mastra Agent
- **Claude Code testet und iteriert** — führen Sie die Agent-Pipeline aus, inspizieren Sie Ausgaben, fragen Sie Claude Code, um Routing-Logik zu verfeinern oder Tools hinzuzufügen
- **Claude Code verarbeitet die umgebende Codebase** — Datenbankverbindungen, API-Endpoints, Deployment-Konfiguration, Umgebungsvariablen
- **Das Framework führt die Agents aus** — zur Laufzeit orchestriert das Framework (nicht Claude Code) die Agent-Schritte

Typischer Workflow:

```
1. Beschreiben Sie den Multi-Agent-Workflow zu Claude Code
2. Claude Code generiert das initiale Framework-Scaffolding
3. Führen Sie die Pipeline aus: `python main.py` oder `npx ts-node agent.ts`
4. Fügen Sie fehlerhafte Ausgabe zurück zu Claude Code zur Diagnose
5. Iterieren Sie, bis die Pipeline korrekte Ausgabe produziert
6. Claude Code schreibt Tests für die kritischen Pfade des Workflows
```

Claude Code funktioniert am besten, wenn Sie beim Start der Session mitteilen, welches Framework Sie verwenden. Fügen Sie die Framework-Wahl zur `CLAUDE.md` im Projekt-Root hinzu, um sie über Sessions hinweg konsistent zu halten.

---
