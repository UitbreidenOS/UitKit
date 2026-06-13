---
description: Runs the solution-architect skill to design a complete system based on requirements. Returns architecture document with component diagram, data model, APIs, deployment topology, and trade-off analysis. Saves to designs/{name}-architecture.md.
---

# /design-system

## What This Does

Synthesizes a complete system architecture document from approved requirements. Runs the solution-architect skill to produce: system overview diagram, component breakdown, data model, API contracts, deployment strategy, scalability plan, security/compliance controls, monitoring strategy, disaster recovery plan, and implementation roadmap.

## Steps Claude Follows

1. Ask for: system name and path to Requirements Matrix (or ask user to summarize requirements)
2. Review requirements to understand scope, constraints, and tech stack
3. Run solution-architect skill — full architecture design checklist
4. Create system diagram (ASCII or Mermaid) showing major components
5. Define component responsibilities and tech stack for each
6. Design data model (ER diagram or schema outline)
7. Specify API contracts (request/response examples)
8. Lay out deployment topology (environments, containers, networking)
9. Map scalability strategy (bottlenecks, caching, async patterns)
10. Define security/compliance controls (auth, encryption, audit)
11. Plan monitoring/observability (metrics, logs, traces, alerts)
12. Document DR strategy (RTO/RPO, backup, failover)
13. Create implementation roadmap (phases, timeline)
14. Analyze key trade-offs (consistency vs. availability, cost vs. complexity)
15. Save architecture to designs/{system-name}-architecture.md

## Output Format

```markdown
# [System Name] — System Architecture

## Overview
[Executive summary of the solution]

## Architecture Diagram
[ASCII or Mermaid diagram]

## Components
[Table with responsibility, tech, scaling, dependencies]

## Data Model
[ER diagram or schema outline]

## APIs
[Key API contracts with examples]

## Deployment
[Topology, environments, CI/CD]

## Scalability
[Bottlenecks, caching, async, load targets]

## Security & Compliance
[Auth, encryption, audit, compliance]

## Monitoring
[Metrics, logs, alerting]

## Disaster Recovery
[RTO/RPO, backup, failover]

## Implementation Roadmap
[Phases with timeline]

## Trade-off Analysis
[Key decisions and rationale]
```

## Next Actions

- Run `/design-review [system-name]` to validate the architecture
- Run `/assess-capacity [system-name]` to forecast infrastructure needs
- Discuss with team and customer, request changes via `/design-system` again

## Example Usage

```
/design-system

You: We want to build an order management system. I have a Requirements Matrix from discovery.

Claude: Got it. Let me design the architecture for your order management system.

[Claude runs solution-architect skill, produces architecture document]

Claude: I've created an architecture for your order management system. 
Key decisions:
- Microservices with 4 main services (Orders, Inventory, Payments, Notifications)
- PostgreSQL primary + replica for consistency
- Redis cache for inventory reads
- Async order processing via message queue
- REST APIs for all external integrations
- Can scale to 10K req/sec with this design

See: designs/order-management-architecture.md
Next: Run /design-review to validate, or make changes.
```
