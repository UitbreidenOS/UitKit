# CrewAI Multi-Agent Framework

## Wanneer activeren
Het bouwen van op rollen gebaseerde multi-agent workflows in Python; gebruiker vermeldt CrewAI; behoefte aan werkend multi-agent prototype snel; het probleem past natuurlijk op werkrollen (onderzoeker, schrijver, reviewer, analist); sequentiële pipeline logica met Claude als onderliggend model.

## Wanneer NIET gebruiken
TypeScript-projecten — gebruik Mastra in plaats daarvan; complexe voorwaardelijke routing- of vertakkingslogica vereist — gebruik LangGraph; productiesystemen die checkpointing, foutherstel en hervatbare runs nodig hebben — gebruik LangGraph; single-agent taken waarbij de rolabstractie overhead zonder voordeel toevoegt.

## Instructies

**Kernmodel :**
CrewAI organiseert werk als een `Crew` van `Agents` uitvoerend `Tasks` met `Tools`. Het framework handelt agent-naar-agent communicatie, output passing en procesorchestratie af.

**Installatie :**
```bash
pip install crewai crewai-tools
```

**Drie kernconcepten :**

- `Agent` — een rol met doel, backstory, LLM en toollijst. Bepaalt wie het werk doet.
- `Task` — een beschrijving, verwachte output en toegewezen agent. Bepaalt wat gedaan wordt.
- `Crew` — de verzameling van agents en taken met een procestype. Bepaalt hoe het werkt.

**Procestypes :**
- `Process.sequential` — taken draaien in volgorde, elke output beschikbaar voor volgende (standaard, eenvoudigste)
- `Process.hierarchical` — een manager-agent leest alle taken en delegeert ze dynamisch naar specia­list-agents

**Claude integratie :**
```python
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-6")
```
Gebruik Sonnet voor de meeste agent-rollen. Gebruik Haiku voor high-volume, laag-complexiteit stappen (extractie, formattering). Reserveer Opus voor reasoning-zware rollen die de kosten rechtvaardigen.

**Geheugen :** Geef `memory=True` door aan `Crew` om agents in staat te stellen context tussen taken in dezelfde run te behouden.

**Volledig voorbeeld :**
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

**Wanneer CrewAI LangGraph verslaat :**
Wanneer rollen natuurlijk op het probleem passen, wanneer je een werkend prototype in minder dan een uur nodig hebt, wanneer de workflow sequentieel en voorspelbaar is. CrewAI is geoptimaliseerd voor leesbaarheid en snelle iteratie — niet voor complexe state machines.

## Voorbeeld

Content-pipeline voor een developer blog: een `ResearchAgent` verzamelt technische feiten over een nieuwe bibliotheek, een `WriterAgent` ontwerpt het artikel, een `ReviewerAgent` controleert op nauwkeurigheid en toon. Sequentieel proces, Claude Sonnet op alle drie agents, voltooid in minder dan 50 coderegels.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
