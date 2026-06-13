# Framework Multi-Agente CrewAI

## Cuándo activar
Crear flujos de trabajo multi-agente basados en roles en Python; el usuario menciona CrewAI; necesidad de un prototipo multi-agente funcional rápidamente; el problema se asigna naturalmente a roles de trabajo (investigador, escritor, revisor, analista); lógica de pipeline secuencial con Claude como modelo subyacente.

## Cuándo NO usar
Proyectos TypeScript — usa Mastra en su lugar; se requiere lógica de enrutamiento condicional o ramificación compleja — usa LangGraph; sistemas de producción que necesitan checkpointing, recuperación de fallas y ejecuciones reanudables — usa LangGraph; tareas de agente único donde la abstracción de rol agrega sobrecarga sin beneficio.

## Instrucciones

**Modelo central :**
CrewAI organiza el trabajo como una `Crew` de `Agents` ejecutando `Tasks` con `Tools`. El framework maneja la comunicación de agente a agente, paso de salida y orquestación de procesos.

**Instalación :**
```bash
pip install crewai crewai-tools
```

**Tres conceptos principales :**

- `Agent` — un rol con un objetivo, historia, LLM y lista de herramientas. Define quién hace el trabajo.
- `Task` — una descripción, salida esperada y agente asignado. Define qué se hace.
- `Crew` — la colección de agentes y tareas con un tipo de proceso. Define cómo funciona.

**Tipos de procesos :**
- `Process.sequential` — las tareas se ejecutan en orden, cada salida disponible para la siguiente (predeterminada, la más simple)
- `Process.hierarchical` — un agente gerente lee todas las tareas y las delega dinámicamente a agentes especialistas

**Integración Claude :**
```python
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-6")
```
Usa Sonnet para la mayoría de roles de agente. Usa Haiku para pasos de alto volumen y baja complejidad (extracción, formato). Reserva Opus para roles con uso intensivo de razonamiento que justifiquen el costo.

**Memoria :** Pasa `memory=True` a `Crew` para permitir que los agentes retengan contexto entre tareas en la misma ejecución.

**Ejemplo completo :**
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

**Cuándo CrewAI vence a LangGraph :**
Cuando los roles se asignan naturalmente al problema, cuando necesitas un prototipo funcionando en menos de una hora, cuando el flujo de trabajo es secuencial y predecible. CrewAI está optimizado para legibilidad e iteración rápida — no para máquinas de estado complejas.

## Ejemplo

Pipeline de contenido para un blog de desarrolladores: un `ResearchAgent` recopila datos técnicos sobre una nueva biblioteca, un `WriterAgent` redacta el artículo, un `ReviewerAgent` verifica precisión y tono. Proceso secuencial, Claude Sonnet en los tres agentes, completado en menos de 50 líneas de código.

---
