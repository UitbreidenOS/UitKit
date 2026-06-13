---
name: solution-architect
description: Designs a complete solution architecture given requirements, constraints, and tech stack. Outputs system design doc with component diagram, data flows, API contracts, and deployment topology. Includes trade-off analysis and risk mitigation.
allowed-tools: Read, Write
effort: high
---

# Solution Architect

## When to activate

After requirements discovery is complete and a Requirements Matrix exists. Triggered when: customer has signed off on scope, team needs a design baseline, or architecture review is scheduled. Must have clarity on budget, timeline, tech constraints, and scale targets. Do not activate if requirements are still in flux.

## When NOT to use

Not for proof-of-concept or spike design (too heavyweight). Not for existing system optimization (use performance-tuning instead). Not if customer hasn't committed to a timeline or budget. Not for vendor selection — this assumes tech stack is decided. Not for refactoring legacy code (use refactoring-guide instead).

## Architecture Design Checklist

1. **System Boundary** — What's in scope? What's out? Dependencies on external systems?
2. **User Flows** — How do personas interact with the system? Critical paths?
3. **Component Breakdown** — What are the major services/modules? Responsibility of each?
4. **Data Architecture** — What data lives where? Consistency model? Backup/DR?
5. **API Contracts** — What APIs do components expose? Request/response schema?
6. **Deployment Model** — Monolith, microservices, serverless, hybrid? Deployment frequency?
7. **Scalability Plan** — Bottlenecks? How does it scale to 10x load?
8. **Security & Compliance** — Auth/authz, encryption, data residency, audit trail?
9. **Monitoring & Observability** — Logs, metrics, traces? Alerting strategy?
10. **Disaster Recovery** — Backup strategy? RTO/RPO targets? Failover plan?

## Output Format

### System Design Document

**Executive Summary**
- Problem statement (from requirements)
- High-level solution approach
- Key trade-offs and rationale
- Expected outcomes (KPIs, timeline, cost)

**System Overview**
```
[ASCII or Mermaid diagram of major components and flows]
Example:
┌─────────────────────────────────────────────────┐
│ Load Balancer                                   │
└────────────┬────────────────────────────────────┘
             │
     ┌───────┴───────┐
     │               │
 ┌───▼───┐      ┌───▼───┐
 │API 1   │      │API 2   │
 └───┬───┘      └───┬───┘
     │               │
     └───────┬───────┘
         ┌───▼───────┐
         │ Database   │
         │ (Primary)  │
         └───────────┘
```

**Component Breakdown**

| Component | Responsibility | Tech Stack | Scaling | Dependencies |
|---|---|---|---|---|
| API Gateway | Route requests, rate limit, auth | Kong / AWS API Gateway | Horizontal (stateless) | Identity service |
| Service 1 | [Responsibility] | [Tech] | [Strategy] | [Dependencies] |
| Service 2 | [Responsibility] | [Tech] | [Strategy] | [Dependencies] |
| Database | [Responsibility] | [Tech] | [Strategy] | [Backup strategy] |
| Cache | [Responsibility] | [Tech] | [Strategy] | [Invalidation logic] |

**Data Model** (ER diagram or schema outline)
- Entity definitions (tables/collections)
- Relationships (1-to-many, many-to-many)
- Constraints (unique keys, foreign keys)
- Partitioning strategy (if large-scale)

**API Contracts** (OpenAPI or GraphQL schema excerpt)
```
GET /orders/{id}
Response: { id, status, items[], customer_id, created_at, updated_at }

POST /orders
Request: { customer_id, items[] }
Response: { id, status, created_at }

Errors: 400 (validation), 401 (auth), 404 (not found), 500 (server)
```

**Deployment Architecture**
- Environment topology (dev, staging, prod)
- Container/VM strategy
- Networking (VPCs, security groups)
- CI/CD pipeline
- Secrets management

**Scalability & Performance**
- Anticipated load (requests/sec, users, data volume at 6mo, 1yr, 3yr)
- Bottlenecks and mitigation (caching, sharding, async processing)
- SLA targets (uptime, latency p99, throughput)

**Security & Compliance**
- Authentication (OAuth2, JWT, etc.)
- Authorization (RBAC, attribute-based)
- Encryption (in transit, at rest)
- Compliance requirements (GDPR, SOC2, etc.)
- Audit logging strategy

**Monitoring & Observability**
- Key metrics (latency, error rate, throughput, queue depth)
- Logging strategy (centralized logs, structured logs, retention)
- Alerting rules (thresholds, on-call escalation)
- Tracing (distributed tracing, service dependencies)

**Disaster Recovery**
- RTO (recovery time objective) and RPO (recovery point objective)
- Backup strategy (frequency, retention, testing)
- Failover procedures (automated or manual)
- Data residency and geo-redundancy

**Trade-off Analysis**

| Trade-off | Option A | Option B | Recommendation | Rationale |
|---|---|---|---|---|
| Consistency Model | Strong (ACID) | Eventual | [Choice] | [Why, given requirements] |
| Storage | Relational DB | NoSQL | [Choice] | [Why, given scale/schema] |
| Deployment | Monolith | Microservices | [Choice] | [Why, given team/complexity] |

**Implementation Roadmap**
- Phase 1 (Months 0–2): [What ships, what's MVP]
- Phase 2 (Months 2–4): [Scaling/feature work]
- Phase 3+ (Months 4+): [Optimization/nice-to-haves]

**Risk Mitigation**

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| [Risk 1] | [Consequence] | [H/M/L] | [Mitigation plan] |
| [Risk 2] | [Consequence] | [H/M/L] | [Mitigation plan] |

---
