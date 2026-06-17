# Agentic AI Engineer Stack

A comprehensive collection of skills, agents, workflows, prompts, and patterns for building production-grade autonomous agent systems with Claude Code.

## Overview

This stack provides specialized tooling and guidance for:

- **Agent design** — Defining scope, constraints, authority, and decision logic for autonomous agents
- **Multi-agent orchestration** — Coordinating multiple agents, managing dependencies, resource allocation
- **Prompt frameworks** — Parameterized, validated, constraint-aware prompt templates for agents
- **Error recovery** — Fault tolerance, retry logic, circuit breakers, rollback procedures
- **Observability** — Logging, tracing, metrics, audit trails, and anomaly detection for agent systems
- **Safety & verification** — Pre-execution constraint validation, post-action verification, compliance auditing
- **Agent governance** — Versioning, role-based authorization, audit logs, human escalation

## Directory Structure

```
agentic_ai_engineer_stack/
├── skills/                   # Agentic AI-specific slash commands
│   ├── agent-designer/SKILL.md
│   ├── orchestrator-builder/SKILL.md
│   ├── prompt-framework/SKILL.md
│   ├── error-recovery-planner/SKILL.md
│   └── observability-framework/SKILL.md
├── commands/                 # CLI commands for agent operations
│   ├── design-agent.md
│   ├── build-orchestrator.md
│   └── design-prompt-framework.md
├── hooks/                    # Event-triggered automations
│   ├── agent-verifier.md
│   └── orchestration-monitor.md
├── mcp/                      # MCP server integrations
│   ├── connections.md
│   └── anthropic-agents.md
├── CLAUDE.md                 # Stack guidelines and principles
├── README.md                 # This file
└── session-log.md            # Session template for agentic work
```

## Key Components

### Skills

Focused tools for specific agentic tasks:

- **agent-designer** — Define agent purpose, scope, constraints, input/output schemas, authority boundaries
- **orchestrator-builder** — Design multi-agent workflows with task graphs, dependencies, resource limits
- **prompt-framework** — Create parameterized prompts with validation, schema enforcement, constraint handling
- **error-recovery-planner** — Design retry logic, circuit breakers, fallback agents, rollback procedures
- **observability-framework** — Configure comprehensive logging, metrics, tracing, and audit trails

### Commands

Primary entry points for agentic workflows:

- **/design-agent** — Interactively define a new agent: purpose, scope, constraints, decision logic, escalation
- **/build-orchestrator** — Design multi-agent orchestration: task graph, dependencies, resource allocation
- **/design-prompt-framework** — Create validated, constraint-aware prompts for agent systems

### Hooks

Automations triggered during agent operations:

- **agent-verifier** — Validates all agent decisions against constraints before execution
- **orchestration-monitor** — Tracks multi-agent interactions and detects anomalies or deadlocks

### MCP Integrations

External service connections for agent systems:

- **anthropic-agents** — Integration with Anthropic's Agents API for managed agent lifecycle
- **observability-services** — Connect to DataDog, New Relic, or Prometheus for real-time monitoring

## Usage

### Designing a New Agent

```
/design-agent
  Name: content-approver
  Purpose: Autonomously approve content changes under defined constraints
  Model: Haiku (fast, low-cost decisions)
```

### Building a Multi-Agent Workflow

```
/build-orchestrator
  Name: content-pipeline
  Agents: [research-agent, outline-agent, writer-agent, reviewer-agent]
  Constraints: serial pipeline; reviewer can reject; max 10 retries
```

### Creating Parameterized Prompts

```
/design-prompt-framework
  Domain: content moderation
  Variables: [user_input, content_type, risk_threshold]
  Output schema: {decision, confidence, reasoning, escalation_flag}
```

### Enabling Observability

```
/design-observability
  System: multi-agent orchestrator
  Metrics: agent_execution_time, constraint_violations, escalation_rate
  Audit: all decisions, all state transitions, all errors
```

## Agent Design Best Practices

1. **Start with scope.** What specific decisions can this agent make autonomously?
2. **Make constraints explicit.** Hard limits are verified at execution time; document all of them.
3. **Define escalation clearly.** When does this agent ask for human help?
4. **Design for observability.** Instrument every decision point with structured logging.
5. **Plan for failure.** How does this agent handle timeouts, external API failures, constraint violations?
6. **Version everything.** Model version, prompt version, constraint version—track them all.
7. **Test error paths.** Don't just test happy paths; verify recovery and escalation work.

## Multi-Agent Coordination Patterns

### Sequential (Pipeline)
Agent A completes → Agent B starts → Agent C starts. Used for workflows with clear ordering.

### Parallel (Map-Reduce)
Multiple agents work on independent tasks simultaneously, then results are combined.

### Hierarchical (Tree)
Parent agent delegates to child agents; children escalate decisions to parent.

### Consensus (Voting)
Multiple agents evaluate same input; decision made by voting or consensus logic.

### Pub-Sub (Event-Driven)
Agents publish events; other agents subscribe and react. Used for loosely coupled systems.

## Observability Essentials

Every agentic system should emit:

- **Decision logs** — Input, reasoning, output, confidence, constraints checked
- **Performance metrics** — Latency, token usage, cost, throughput
- **Error traces** — Exception type, stack trace, recovery action, retry count
- **Audit trail** — Immutable record of all actions for compliance
- **Anomaly signals** — Unusual patterns: constraint violations, cascading failures, unexpected outputs

## Safety First

Before deploying any agent system:

- [ ] Scope is well-defined and bounded
- [ ] All constraints are verified at execution time
- [ ] Failure modes are documented and tested
- [ ] Recovery procedures work end-to-end
- [ ] Escalation to humans is clear and tested
- [ ] Audit logging captures all decisions
- [ ] Monitoring detects anomalies in real-time

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Slash commands** — Activate skills with `/command-name`
- **Hook automation** — Verify constraints, monitor orchestrations automatically
- **MCP servers** — Access external services for agent management and observability
- **Session logging** — Track agent experiments and orchestration runs

## Contributing

When adding to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Use the template format** — Skills and commands follow the standard structure from CLAUDE.md
3. **Include concrete examples** — Every skill includes a runnable example
4. **Document constraints** — Make implicit assumptions explicit
5. **Design for observability** — Include instrumentation guidance in every component

## Resources

- [CLAUDE.md](./CLAUDE.md) — Complete stack guidelines and principles
- [Anthropic Agents Documentation](https://docs.anthropic.com/en/docs/build-a-system/agents) — Official agent patterns
- [System Prompts Guide](https://docs.anthropic.com/en/docs/build-a-system/agents) — Designing effective agent prompts

## Status

This stack is actively maintained. Last updated: 2026-06-15

---

Built with [Claudient](https://github.com/Claudients/Claudient) · Production-grade agentic AI patterns
