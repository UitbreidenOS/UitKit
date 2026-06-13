# Marcos de trabajo de agentes de IA — LangGraph, CrewAI, Mastra, y cuándo usar cada uno

Tres marcos dominan la IA agente de producción en 2026: LangGraph, CrewAI y Mastra. El SDK de IA de Vercel cubre la capa de streaming frontend. Esta guía te dice cuándo usar cada uno, cómo integrarlos con Claude y cómo elegir sin segundo pensamiento.

---

## Comparación de marcos de trabajo

| Marco de trabajo | Lenguaje | Fortaleza | Mejor para |
|-----------|----------|----------|----------|
| LangGraph | Python (JS disponible) | Máquinas de estado, enrutamiento condicional, puntos de control | Agentes complejos de múltiples pasos con lógica de bifurcación y requisitos de reintentos |
| CrewAI | Python | Equipos de agentes basados en roles, prototipado rápido | Automatización de procesos empresariales donde los "roles" se asignan naturalmente a funciones laborales |
| Mastra | TypeScript | Integración nativa de Next.js, 3,300+ proveedores de modelos, observabilidad incorporada | Backends de SaaS de TypeScript y aplicaciones Next.js full-stack |
| Vercel AI SDK | TypeScript | UI de streaming, `useChat`/`useCompletion`, soporte de herramientas MCP | Frontends de chat de streaming y aplicaciones simple de tool-calling |

---

## LangGraph

LangGraph modela agentes como un **StateGraph** — los nodos representan pasos, los bordes representan transiciones, y los bordes condicionales implementan lógica de bifurcación. El estado se persiste en los nodos a través de un objeto de estado tipado, lo que permite puntos de control y reanudación después del fallo.

**Conceptos clave:**

- `StateGraph`: la definición del gráfico — nodos, bordes y esquema de estado
- `nodes`: funciones que reciben estado, realizan trabajo y devuelven estado actualizado
- `conditional_edges`: enrutan a diferentes nodos según valores de estado
- `checkpointer`: persiste estado a SQLite o Postgres para reanudación después del fallo e interrupciones en el bucle humano

**Integración de Claude:**

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

**Cuándo elegir LangGraph:**

- El agente tiene bifurcación condicional que depende de resultados intermedios
- Necesitas lógica de reintento, rutas alternativas o puntos de interrupción en el bucle humano
- El estado del flujo de trabajo debe sobrevivir a reinicios de procesos (trabajos de larga duración, tuberías programadas)
- Construyendo un agente de investigación o análisis que hace bucles hasta alcanzar un umbral de calidad

---

## CrewAI

CrewAI modela agentes como un **equipo basado en roles** — cada `Agent` tiene un rol, objetivo y trasfondo; los objetos `Task` definen elementos de trabajo; una `Crew` ensambla agentes y tareas y los ejecuta secuencial o paralelamente.

**Conceptos clave:**

- `Agent`: una unidad autónoma con rol, objetivo, trasfondo y conjunto de herramientas
- `Task`: un elemento de trabajo definido con descripción, salida esperada y agente asignado
- `Crew`: orquesta agentes y tareas; ejecuta el flujo de trabajo
- `Process.sequential` / `Process.hierarchical`: modos de ejecución

**Integración de Claude:**

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

**Cuándo elegir CrewAI:**

- El flujo de trabajo se asigna naturalmente a funciones laborales (investigador, escritor, revisor, aprobador)
- La velocidad de prototipado es importante — la configuración basada en roles es más rápida que definiciones de StateGraph
- Automatización de procesos empresariales donde la metáfora del "equipo" es intuitiva para las partes interesadas no técnicas
- Lógica de bifurcación menos compleja; principalmente tuberías lineales con pasos especializados

---

## Mastra

Mastra es **TypeScript-first**, construido para backends de Next.js y Node.js SaaS. Incluye un enrutador de modelos incorporado (3,300+ modelos de 94 proveedores), observabilidad nativa (trazas, registros, evals) y un motor de flujo de trabajo con composición basada en pasos.

**Conceptos clave:**

- `Agent`: un agente con instrucciones, herramientas y asignación de modelo
- `Workflow`: una serie de pasos componibles con soporte de bifurcación
- `Model Router`: selecciona de 3,300+ modelos; cambia proveedores sin cambios de código
- `Observability`: rastreo incorporado a cualquier backend compatible con OpenTelemetry

**Integración de Claude:**

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

**Cuándo elegir Mastra:**

- El stack es TypeScript — Mastra es el único marco importante que es nativo de TypeScript con seguridad de tipo completa
- Construyendo en Next.js — Mastra tiene integración de primera clase con Next.js App Router
- Necesitas intercambiar modelos entre proveedores sin reescribir código del agente
- La observabilidad y herramientas de eval incorporadas importan (comparación de modelos staging vs. producción)

---

## Vercel AI SDK

El SDK de IA de Vercel es una **capa de streaming liviana** para frontends de TypeScript. Maneja UI de chat de streaming (`useChat`, `useCompletion`), tool calling, integración MCP e interacciones de agentes de múltiples pasos en aplicaciones React y Next.js.

**Conceptos clave:**

- `useChat`: hook de React para UI de chat con soporte de streaming
- `useCompletion`: finalización de un solo turno con streaming
- `streamText` / `generateText`: generación y streaming del lado del servidor
- Tool calling con definiciones de `tool()` e invocación automática

**Integración de Claude:**

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

**Cuándo elegir Vercel AI SDK:**

- Construyendo una UI de chat o finalización de streaming en React o Next.js
- Casos simples de tool-calling — no se requieren gráficos de estado complejos
- Prototipado rápido de frontend donde la lógica del agente es directa
- El equipo ya está usando el ecosistema de Vercel y quiere dependencias mínimas nuevas

---

## Árbol de decisión

```
¿Es el stack Python o TypeScript?
│
├── Python
│   │
│   └── ¿Tiene el flujo de trabajo bifurcación compleja, lógica de reintento o puntos de control?
│       │
│       ├── Sí → LangGraph
│       │
│       └── No → ¿Los pasos se asignan naturalmente a roles laborales (investigador, escritor, revisor)?
│               │
│               ├── Sí → CrewAI
│               └── No  → LangGraph (StateGraph es lo suficientemente flexible para tuberías lineales también)
│
└── TypeScript
    │
    └── ¿Es esto un SaaS Next.js full-stack o un backend Node?
        │
        ├── Sí → Mastra
        │
        └── No → ¿Esto es principalmente una UI de chat de streaming o simple tool-calling?
                │
                ├── Sí → Vercel AI SDK
                └── No  → Mastra (mejor observabilidad y herramientas de agentes que AI SDK sin procesar)
```

---

## Combinación con Claude Code

Los cuatro marcos se integran directamente con flujos de trabajo de Claude Code:

- **Claude Code escribe el código del marco** — describe el flujo de trabajo del agente en lenguaje natural, Claude Code genera el StateGraph, definición de Crew o agente Mastra
- **Claude Code prueba e itera** — ejecuta la tubería del agente, inspecciona salidas, pide a Claude Code que refine lógica de enrutamiento o agregue herramientas
- **Claude Code maneja la base de código circundante** — conexiones de base de datos, endpoints de API, configuración de implementación, variables de entorno
- **El marco ejecuta los agentes** — en tiempo de ejecución, el marco (no Claude Code) orquesta los pasos del agente

Flujo de trabajo típico:

```
1. Describe el flujo de trabajo multi-agente a Claude Code
2. Claude Code genera el andamiaje del marco inicial
3. Ejecuta la tubería: `python main.py` o `npx ts-node agent.ts`
4. Pega salida fallida de nuevo a Claude Code para diagnóstico
5. Itera hasta que la tubería produce salida correcta
6. Claude Code escribe pruebas para las rutas críticas del flujo de trabajo
```

Claude Code funciona mejor cuando le dices qué marco estás usando al inicio de la sesión. Agrega la opción del marco a `CLAUDE.md` en la raíz del proyecto para mantenerla consistente en sesiones.

---
