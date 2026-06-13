# Cadres d'agent IA — LangGraph, CrewAI, Mastra et quand utiliser chacun

Trois cadres dominent l'IA agentique en production en 2026 : LangGraph, CrewAI et Mastra. Vercel AI SDK couvre la couche de diffusion en continu du frontend. Ce guide vous dit quand utiliser chacun, comment les intégrer à Claude et comment choisir sans vous remettre en question.

---

## Comparaison des cadres

| Cadre | Langage | Point fort | Meilleur pour |
|-----------|----------|----------|----------|
| LangGraph | Python (JS disponible) | Machines d'état, routage conditionnel, points de contrôle | Les agents complexes multi-étapes avec logique de branchement et exigences de retry |
| CrewAI | Python | Équipes d'agents basées sur les rôles, prototypage rapide | L'automatisation des processus métier où les « rôles » correspondent naturellement aux fonctions professionnelles |
| Mastra | TypeScript | Intégration native Next.js, 3,300+ fournisseurs de modèles, observabilité intégrée | Les backends Next.js SaaS et les applications full-stack |
| Vercel AI SDK | TypeScript | UI de diffusion en continu, `useChat`/`useCompletion`, support d'outils MCP | Les frontends de chat en diffusion en continu et les applications simples d'appel d'outils |

---

## LangGraph

LangGraph modélise les agents en tant que **StateGraph** — les nœuds représentent les étapes, les arêtes représentent les transitions et les arêtes conditionnelles implémentent la logique de branchement. L'état est conservé entre les nœuds via un objet d'état typé, ce qui permet les points de contrôle et la reprise après défaillance.

**Concepts clés :**

- `StateGraph` : la définition du graphe — nœuds, arêtes et schéma d'état
- `nodes` : les fonctions qui reçoivent l'état, effectuent le travail et renvoient l'état mis à jour
- `conditional_edges` : acheminer vers différents nœuds en fonction des valeurs d'état
- `checkpointer` : persister l'état dans SQLite ou Postgres pour la reprise après défaillance et les interruptions interactives

**Intégration Claude :**

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

**Quand choisir LangGraph :**

- L'agent a un branchement conditionnel qui dépend des résultats intermédiaires
- Vous avez besoin de logique de retry, de chemins de secours ou de points d'interruption interactifs
- L'état du flux de travail doit survivre aux redémarrages de processus (travaux de longue durée, pipelines programmés)
- Construction d'un agent de recherche ou d'analyse qui boucle jusqu'à atteindre un seuil de qualité

---

## CrewAI

CrewAI modélise les agents en tant qu'**équipe basée sur les rôles** — chaque `Agent` a un rôle, un objectif et une histoire ; les objets `Task` définissent les éléments de travail ; une `Crew` assemble les agents et les tâches et les exécute séquentiellement ou en parallèle.

**Concepts clés :**

- `Agent` : une unité autonome avec un rôle, un objectif, une histoire et un ensemble d'outils
- `Task` : un élément de travail défini avec une description, une sortie prévue et un agent affecté
- `Crew` : orchestre les agents et les tâches ; exécute le flux de travail
- `Process.sequential` / `Process.hierarchical` : modes d'exécution

**Intégration Claude :**

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

**Quand choisir CrewAI :**

- Le flux de travail correspond naturellement aux fonctions professionnelles (chercheur, rédacteur, examinateur, approbateur)
- La vitesse de prototypage importe — la configuration basée sur les rôles est plus rapide que les définitions StateGraph
- L'automatisation des processus métier où la métaphore de « l'équipe » est intuitive pour les parties prenantes non techniques
- Une logique de branchement moins complexe ; principalement des pipelines linéaires avec des étapes spécialisées

---

## Mastra

Mastra est **TypeScript-first**, construit pour Next.js et les backends Node.js SaaS. Il comprend un routeur de modèle intégré (3,300+ modèles de 94 fournisseurs), une observabilité native (traces, logs, evals) et un moteur de flux de travail avec composition basée sur les étapes.

**Concepts clés :**

- `Agent` : un agent avec des instructions, des outils et une affectation de modèle
- `Workflow` : une série composable d'étapes avec support de branchement
- `Model Router` : sélectionner parmi 3,300+ modèles ; changer de fournisseur sans modifications de code
- `Observability` : suivi intégré vers n'importe quel backend compatible OpenTelemetry

**Intégration Claude :**

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

**Quand choisir Mastra :**

- La pile est TypeScript — Mastra est le seul cadre majeur qui est TypeScript-native avec la sécurité de type complète
- Construire dans Next.js — Mastra a une intégration de première classe avec Next.js App Router
- Vous devez basculer entre les modèles des fournisseurs sans réécrire le code de l'agent
- L'observabilité intégrée et les outils d'eval importent (comparaison du modèle en staging vs. en production)

---

## Vercel AI SDK

Le Vercel AI SDK est une **couche de diffusion en continu légère** pour les frontends TypeScript. Il gère l'UI de chat en diffusion en continu (`useChat`, `useCompletion`), l'appel d'outils, l'intégration MCP et les interactions d'agent multi-étapes dans les applications React et Next.js.

**Concepts clés :**

- `useChat` : crochet React pour l'UI de chat avec support de diffusion en continu
- `useCompletion` : complétion simple avec diffusion en continu
- `streamText` / `generateText` : génération et diffusion en continu côté serveur
- Appel d'outils avec définitions `tool()` et invocation automatique

**Intégration Claude :**

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

**Quand choisir Vercel AI SDK :**

- Construire une UI de chat ou de complétion en diffusion en continu dans React ou Next.js
- Les cas d'usage simples d'appel d'outils — pas de graphiques d'état complexes nécessaires
- Le prototypage rapide du frontend où la logique de l'agent est simple
- L'équipe utilise déjà l'écosystème Vercel et veut un minimum de nouvelles dépendances

---

## Arbre de décision

```
La pile est-elle Python ou TypeScript?
│
├── Python
│   │
│   └── Le flux de travail a-t-il un branchement complexe, une logique de retry ou des points de contrôle?
│       │
│       ├── Oui → LangGraph
│       │
│       └── Non → Les étapes correspondent-elles naturellement aux rôles professionnels (chercheur, rédacteur, examinateur)?
│               │
│               ├── Oui → CrewAI
│               └── Non  → LangGraph (StateGraph est assez flexible pour les pipelines linéaires aussi)
│
└── TypeScript
    │
    └── Cela s'agit-il d'une SaaS full-stack Next.js ou un backend Node?
        │
        ├── Oui → Mastra
        │
        └── Non → S'agit-il principalement d'une UI de chat en diffusion en continu ou un appel d'outils simple?
                │
                ├── Oui → Vercel AI SDK
                └── Non  → Mastra (meilleure observabilité et outils d'agent que le SDK IA brut)
```

---

## Combinaison avec Claude Code

Les quatre cadres s'intègrent directement aux flux de travail Claude Code :

- **Claude Code écrit le code du cadre** — décrivez le flux de travail de l'agent en langage naturel, Claude Code génère le StateGraph, la définition Crew ou l'agent Mastra
- **Claude Code teste et itère** — exécutez le pipeline d'agent, inspectez les sorties, demandez à Claude Code d'affiner la logique de routage ou d'ajouter des outils
- **Claude Code gère la base de code environnante** — connexions à la base de données, points de terminaison API, configuration du déploiement, variables d'environnement
- **Le cadre exécute les agents** — au moment de l'exécution, le cadre (pas Claude Code) orchestre les étapes de l'agent

Flux de travail typique :

```
1. Décrire le flux de travail multi-agent à Claude Code
2. Claude Code génère l'échafaudage initial du cadre
3. Exécuter le pipeline : `python main.py` ou `npx ts-node agent.ts`
4. Coller la sortie défaillante vers Claude Code pour diagnostic
5. Itérer jusqu'à ce que le pipeline produise une sortie correcte
6. Claude Code écrit des tests pour les chemins critiques du flux de travail
```

Claude Code fonctionne mieux quand vous lui dites quel cadre vous utilisez au début de la session. Ajouter le choix du cadre à `CLAUDE.md` dans la racine du projet pour le maintenir cohérent entre les sessions.

---
