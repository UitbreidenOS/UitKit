---
name: "CrewAI Multi-Agent Framework"
description: "Building role-based multi-agent workflows in Python; user mentions CrewAI; need a working multi-agent prototype fast; the problem maps naturally to job roles (researcher, writer, reviewer, analyst); s"
---

# CrewAI Multi-Agent Framework

## When to activate
Building role-based multi-agent workflows in Python; user mentions CrewAI; need a working multi-agent prototype fast; the problem maps naturally to job roles (researcher, writer, reviewer, analyst); sequential pipeline logic with Claude as the underlying model.

## When NOT to use
TypeScript projects — use Mastra instead; complex conditional routing or branching logic required — use LangGraph; production systems that need checkpointing, failure recovery, and resumable runs — use LangGraph; single-agent tasks where the role abstraction adds overhead without benefit.

## Instructions

**Core model:**
CrewAI organizes work as a `Crew` of `Agents` running `Tasks` with `Tools`. The framework handles agent-to-agent communication, output passing, and process orchestration.

**Installation:**
```bash
pip install crewai crewai-tools
```

**Three core concepts:**

- `Agent` — a role with a goal, backstory, LLM, and tool list. Defines who does the work.
- `Task` — a description, expected output, and assigned agent. Defines what gets done.
- `Crew` — the collection of agents and tasks with a process type. Defines how it runs.

**Process types:**
- `Process.sequential` — tasks run in order, each output available to the next (default, simplest)
- `Process.hierarchical` — a manager agent reads all tasks and delegates to specialist agents dynamically

**Claude integration:**
```python
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-6")
```
Use Sonnet for most agent roles. Use Haiku for high-volume, low-complexity steps (extraction, formatting). Reserve Opus for reasoning-heavy roles that justify the cost.

**Memory:** Pass `memory=True` to `Crew` to enable agents to retain context across tasks in the same run.

**Full example:**
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

**When CrewAI beats LangGraph:**
When roles map naturally to the problem, when you need a working prototype in under an hour, when the workflow is sequential and predictable. CrewAI is optimized for readability and fast iteration — not for complex state machines.

## Example

Content pipeline for a developer blog: a `ResearchAgent` gathers technical facts about a new library, a `WriterAgent` drafts the article, a `ReviewerAgent` checks for accuracy and tone. Sequential process, Claude Sonnet on all three agents, done in under 50 lines of code.

---
