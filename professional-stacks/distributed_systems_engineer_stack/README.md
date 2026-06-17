# Distributed Systems Engineer Stack

A comprehensive collection of skills, agents, workflows, and prompts designed for distributed systems engineers building fault-tolerant, scalable infrastructure with Claude Code.

## Overview

This stack provides specialized tooling and guidance for:

- **Consensus protocols** — Design and validate Raft, Paxos, Zookeeper, and other consensus mechanisms
- **Failure mode analysis** — Identify and model partition tolerance, cascading failures, Byzantine scenarios
- **Replication strategies** — Primary-backup, multi-leader, leaderless architectures; consistency guarantees
- **Load testing & chaos** — Design realistic load tests and chaos engineering scenarios
- **Disaster recovery** — Plan RTO/RPO strategies, backup procedures, failover runbooks
- **Consistency validation** — Verify linearizability, causal consistency, and eventual consistency claims
- **Distributed tracing** — Model request flows through multi-node systems; identify latency bottlenecks
- **Operational runbooks** — Document failure scenarios and recovery procedures

## Directory Structure

```
distributed_systems_engineer_stack/
├── skills/                      # Distributed systems-specific skills
│   ├── consensus-protocol-designer/
│   ├── failure-mode-analyzer/
│   ├── replication-architect/
│   ├── load-test-designer/
│   ├── disaster-recovery-planner/
│   └── ... (language subdirectories: fr/, de/, es/, nl/)
├── agents/                      # Specialized agent definitions
│   ├── consensus-specialist.md
│   ├── chaos-engineer.md
│   └── reliability-architect.md
├── workflows/                   # End-to-end processes
│   ├── consensus-validation-cycle.md
│   ├── chaos-testing-workflow.md
│   └── disaster-recovery-planning.md
├── commands/                    # Slash command definitions
│   ├── design-consensus.md
│   ├── analyze-failures.md
│   └── design-replication.md
├── hooks/                       # Event-triggered automations
│   ├── failure-scenario-logger.md
│   └── consistency-checker.md
├── mcp/                         # MCP server integrations
│   ├── connections.md           # Vector DB, tracing systems, chaos tools
│   ├── elastic-stack.md         # Distributed logging for observability
│   └── jaeger-tracing.md        # Distributed request tracing
├── session-log.md               # Session logging template
├── CLAUDE.md                    # Stack identity and framework
└── README.md                    # This file
```

## Key Components

### Skills
Focused tools for specific distributed systems tasks:

- **consensus-protocol-designer** — Model consensus protocols with fault tolerance analysis, message complexity
- **failure-mode-analyzer** — Systematically analyze failure scenarios: partitions, cascades, Byzantine
- **replication-architect** — Design read/write paths, consistency models, replication lag bounds
- **load-test-designer** — Build realistic load tests with failure injection and chaos scenarios
- **disaster-recovery-planner** — Define RTO/RPO, backup strategy, recovery procedures
- **consistency-model-validator** — Verify linearizability and causal consistency claims

### Agents
Specialized subagents for distributed systems work:

- **consensus-specialist** — Deep expertise in consensus algorithms, protocol design, formal verification
- **chaos-engineer** — Designs and executes failure injection, analyzes system behavior under adversity
- **reliability-architect** — Focuses on end-to-end availability, recovery strategies, operational procedures

### Workflows
Complete processes for common distributed systems tasks:

- **Consensus validation cycle** — Design → Model → Test → Validate → Deploy
- **Chaos testing workflow** — Plan → Inject → Measure → Analyze → Mitigate
- **Disaster recovery planning** — Define RTO/RPO → Design backup → Build runbook → Test recovery

### Commands
- `/design-consensus` — Design consensus protocol with formal analysis
- `/analyze-failures` — Systematic failure mode analysis
- `/design-replication` — Replication strategy and consistency model specification
- `/design-load-test` — Load test plan with failure injection
- `/plan-disaster-recovery` — Disaster recovery and RTO/RPO planning

### Hooks
Automations that trigger during your workflow:

- **failure-scenario-logger** — Auto-logs failure simulations and recovery outcomes
- **consistency-checker** — Validates consistency model claims before design review
- **replication-lag-monitor** — Tracks replication lag during load tests

### MCP Integrations

- **Elastic Stack (ELK)** — Centralized logging for distributed system analysis
- **Jaeger** — Distributed request tracing to identify latency bottlenecks
- **Chaos tools** — Gremlin, Chaos Toolkit integration for failure injection

## Usage

### Activate a Skill
```
/design-consensus
```

### Delegate to an Agent
```
@chaos-engineer help me design a failure injection test for my Kafka cluster
```

### Follow a Workflow
See specific workflow files in `workflows/` for step-by-step guidance.

### Design a Consensus Protocol
Use the consensus protocol template to model your algorithm:
- Specify fault model (crash, partition, Byzantine)
- Model message rounds and state machine
- Trace through failure scenarios
- Validate against benchmark protocols (Raft, Paxos)

### Analyze Failure Modes
Systematically work through:
1. Single node failures → Detection → Recovery
2. Network partitions → Majority/minority behavior
3. Cascading failures → Bulkhead design
4. Byzantine scenarios → If threat model requires

## Translation

All skills, agents, workflows, and guides are available in:
- English (en/)
- French (fr/)
- German (de/)
- Spanish (es/)
- Dutch (nl/)

Each language subdirectory mirrors the English structure.

## Contributing

When adding new content to this stack:

1. **Follow naming conventions** — Files use `kebab-case.md`, directories use `kebab-case/`
2. **Include translations** — All non-hook files must be translated to fr/, de/, es/, nl/
3. **Match established format** — Skills use standard skill format; agents use agent format
4. **Reference real systems** — Examples should reference production systems (Google Bigtable, Amazon DynamoDB, Kafka, etc.)
5. **Include formal analysis** — Consensus protocols, failure modes, and load tests must be precise and verifiable
6. **Write for senior engineers** — Assume domain knowledge; focus on tradeoffs and patterns

## Integration with Claude Code

This stack integrates with Claude Code through:

- **Slash commands** — Activate skills with `/skill-name`
- **Agent delegation** — Spawn specialized agents with `@agent-name`
- **Hooks** — Automated triggers on specific events
- **MCP servers** — Access distributed systems tools (tracing, logging, chaos injection)

## Resources

- [CLAUDE.md](./CLAUDE.md) — Stack identity, persona, and framework
- [Designing Data-Intensive Applications](https://dataintensive.info/) — Foundational reference for distributed systems
- [Jepsen](https://jepsen.io/) — Consistency testing and failure injection
- [Consensus protocol references](https://raft.io/) — Formal specifications
- [Chaos engineering handbook](https://www.oreilly.com/library/view/chaos-engineering/9781491988474/) — Failure injection best practices

## Status

This stack is production-ready and actively maintained. Check individual files for last-updated dates and version information.

---

**Last updated:** 2026-06-15
