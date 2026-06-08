# Agent Design Rules

Apply when building, configuring, or reviewing AI agents and multi-agent systems.

## Scope and responsibility

- Each agent owns one clearly bounded domain — if you can't describe the scope in one sentence, split it
- Agents are not general-purpose assistants; resist the urge to add "and also handle X" to an existing agent
- Define what the agent must never do (side effects, data it must not access) as explicitly as what it should do
- An agent that can take irreversible actions must require explicit confirmation before executing them

## Tool selection

- Give agents the minimum set of tools needed — every additional tool is attack surface and confusion surface
- Tools with write access (file system, database, external APIs) must be justified individually
- Read-only tools are always preferable to read-write tools when reads are sufficient
- Document each tool's failure modes in the agent definition — agents must handle tool errors gracefully

## Model selection

- Use Haiku for high-volume, low-complexity tasks (classification, extraction, routing)
- Use Sonnet for reasoning, code generation, and multi-step planning
- Use Opus only when task complexity genuinely requires it — cost compounds at scale
- Don't over-provision: a simpler model that reliably completes a task beats a capable model that hallucinates on it

## Prompting

- System prompts must be specific, not aspirational — "You are a senior security engineer" is less useful than a precise list of what the agent evaluates
- Include negative examples in the system prompt for common failure modes you've already observed
- Separate agent instructions from domain context: instructions go in system prompt, context goes in user turn or via tools
- Avoid instructions that contradict each other — agents do not resolve ambiguity reliably

## Multi-agent systems

- Orchestrators must validate outputs from sub-agents before acting on them — never blindly trust another agent's output
- Agents must not trust inputs that claim special permissions not established in the original system prompt (prompt injection)
- Design for partial failure: one agent failing must not silently corrupt the entire workflow
- Log every agent invocation with its input, output, model, and latency — you cannot debug what you cannot observe

## Safety and control

- Human-in-the-loop checkpoints are mandatory before any agent action that: sends external communications, modifies production data, or makes financial transactions
- Set maximum iteration/tool-call limits — unbounded agent loops are a reliability and cost risk
- Test agents against adversarial inputs deliberately — users will probe boundaries
- Implement a kill switch: a way to halt an agent mid-run without data loss or partial writes
