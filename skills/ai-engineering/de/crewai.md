# CrewAI Multi-Agent Framework

## Wann aktivieren
Aufbau rollenbasierter Multi-Agent-Workflows in Python; Benutzer erwähnt CrewAI; Bedarf eines funktionierenden Multi-Agent-Prototyps schnell; das Problem entspricht natürlich Arbeitrollen (Forscher, Schriftsteller, Reviewer, Analyst); sequenzielle Pipeline-Logik mit Claude als zugrunde liegendes Modell.

## Wann NICHT verwenden
TypeScript-Projekte — verwende Mastra stattdessen; komplexe bedingte Routing- oder Verzweigungslogik erforderlich — verwende LangGraph; Produktionssysteme, die Checkpointing, Fehlerwiederherstellung und wiederaufnehmbare Läufe benötigen — verwende LangGraph; Single-Agent-Aufgaben, wo die Rollenabstraktion Overhead ohne Vorteil hinzufügt.

## Anweisungen

**Kernmodell :**
CrewAI organisiert Arbeit als eine `Crew` von `Agents` ausführende `Tasks` mit `Tools`. Das Framework kümmert sich um Agent-zu-Agent-Kommunikation, Ausgabeweitergabe und Prozessorkestrierung.

**Installation :**
```bash
pip install crewai crewai-tools
```

**Drei Kernkonzepte :**

- `Agent` — eine Rolle mit Ziel, Backstory, LLM und Tool-Liste. Definiert wer die Arbeit macht.
- `Task` — eine Beschreibung, erwartete Ausgabe, und zugewiesener Agent. Definiert was getan wird.
- `Crew` — die Sammlung von Agenten und Aufgaben mit einem Prozesstyp. Definiert wie es läuft.

**Prozesstypen :**
- `Process.sequential` — Aufgaben laufen der Reihe nach, jede Ausgabe für die nächste verfügbar (Standard, einfachster)
- `Process.hierarchical` — ein Manager-Agent liest alle Aufgaben und delegiert sie dynamisch an Spezialisten-Agenten

**Claude-Integration :**
```python
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-6")
```
Verwende Sonnet für die meisten Agent-Rollen. Verwende Haiku für voluminöse, niedriger Komplexität Schritte (Extraktion, Formatierung). Reserviere Opus für reasoning-schwere Rollen, die die Kosten rechtfertigen.

**Speicher :** Übergebe `memory=True` zu `Crew`, um Agenten zu ermöglichen, Kontext über Aufgaben im gleichen Durchlauf hinweg zu behalten.

**Vollständiges Beispiel :**
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

**Wann CrewAI LangGraph schlägt :**
Wenn Rollen natürlich auf das Problem passen, wenn Sie einen funktionierenden Prototyp in unter einer Stunde brauchen, wenn der Workflow sequenziell und vorhersehbar ist. CrewAI ist optimiert für Lesbarkeit und schnelle Iteration — nicht für komplexe State Machines.

## Beispiel

Content-Pipeline für einen Entwickler-Blog: ein `ResearchAgent` sammelt technische Fakten über eine neue Bibliothek, ein `WriterAgent` entwirft den Artikel, ein `ReviewerAgent` prüft Genauigkeit und Ton. Sequenzieller Prozess, Claude Sonnet auf allen drei Agenten, in unter 50 Codezeilen erledigt.

---
