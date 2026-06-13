# Framework Multi-Agent CrewAI

## Quand activer
Construire des workflows multi-agent basés sur les rôles en Python ; l'utilisateur mentionne CrewAI ; besoin d'un prototype multi-agent fonctionnel rapidement ; le problème correspond naturellement à des rôles de travail (chercheur, rédacteur, examinateur, analyste) ; logique de pipeline séquentielle avec Claude comme modèle sous-jacent.

## Quand ne PAS utiliser
Projets TypeScript — utiliser Mastra à la place ; logique de routage ou de branchement conditionnel complexe requise — utiliser LangGraph ; systèmes de production qui ont besoin de checkpoint, récupération d'erreur, et exécutions reprenables — utiliser LangGraph ; tâches à agent unique où l'abstraction de rôle ajoute une surcharge sans bénéfice.

## Instructions

**Modèle de base :**
CrewAI organise le travail en tant qu'une `Crew` de `Agents` exécutant des `Tasks` avec des `Tools`. Le framework gère la communication agent-à-agent, le passage de sortie, et l'orchestration des processus.

**Installation :**
```bash
pip install crewai crewai-tools
```

**Trois concepts de base :**

- `Agent` — un rôle avec un objectif, une histoire, un LLM, et une liste d'outils. Définit qui fait le travail.
- `Task` — une description, une sortie attendue, et un agent assigné. Définit ce qui se fait.
- `Crew` — la collection d'agents et de tâches avec un type de processus. Définit comment cela fonctionne.

**Types de processus :**
- `Process.sequential` — les tâches s'exécutent dans l'ordre, chaque sortie disponible pour la suivante (défaut, plus simple)
- `Process.hierarchical` — un agent manager lit toutes les tâches et les délègue dynamiquement aux agents spécialistes

**Intégration Claude :**
```python
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-6")
```
Utilisez Sonnet pour la plupart des rôles d'agent. Utilisez Haiku pour les étapes volumineuses et peu complexes (extraction, formatage). Réservez Opus pour les rôles lourd en raisonnement qui justifient le coût.

**Mémoire :** Passez `memory=True` à `Crew` pour permettre aux agents de retenir le contexte entre les tâches dans la même exécution.

**Exemple complet :**
```python
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-6")

researcher = Agent(
    role="Research Analyst",
    goal="Find accurate, up-to-date information on the given topic",
    backstory="You specialize in fast, thorough research and structured summaries.",
    llm=llm,
    verbose=True,
)

writer = Agent(
    role="Content Writer",
    goal="Write clear, engaging content based on research input",
    backstory="You turn technical research into readable prose for developer audiences.",
    llm=llm,
    verbose=True,
)

research_task = Task(
    description="Research {topic} and summarize the key findings in bullet points.",
    agent=researcher,
    expected_output="Bullet-point summary of 5-10 key facts with sources noted.",
)

write_task = Task(
    description="Write a 500-word article based on the research output.",
    agent=writer,
    expected_output="Complete article, ready to publish.",
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    memory=True,
)

result = crew.kickoff(inputs={"topic": "Claude Code agent frameworks"})
print(result)
```

**Quand CrewAI bat LangGraph :**
Quand les rôles correspondent naturellement au problème, quand vous avez besoin d'un prototype fonctionnel en moins d'une heure, quand le workflow est séquentiel et prévisible. CrewAI est optimisé pour la lisibilité et l'itération rapide — pas pour les machines d'état complexes.

## Exemple

Pipeline de contenu pour un blog de développeurs : un `ResearchAgent` rassemble des faits techniques sur une nouvelle bibliothèque, un `WriterAgent` rédige l'article, un `ReviewerAgent` vérifie la précision et le ton. Processus séquentiel, Claude Sonnet sur les trois agents, terminé en moins de 50 lignes de code.

---
