# 📂 Multi-Agent SaaS Core
> The canonical multi-tenant hierarchy for hosting concurrent, isolated AI agent instances as scalable enterprise employees.

📄 `saas-architecture-brief.md` # Canonical brief: Multi-tenant tenant maps, router rules, and cross-account boundaries
🧠 `tenant-state-memory.md`    # Session memory: Dynamic context tracking for the active tenant worker pool
🤖 `CLAUDE.md`                 # Operating rules: Strict instructions for maintaining tenant security boundaries

## 📁 tenant-router/ (6 skills - Gateway & Context Control)
📄 `tenant-authenticator.md`   # Decodes JWT tokens • maps incoming requests to isolated tenant IDs
📄 `quota-guardrail.md`        # Real-time token tracking • API rate limit checks per tier
📄 `dynamic-context-loader.md` # Injects tenant-specific business rules dynamically into the agent prompt
📄 `isolation-verifier.md`     # Security layer • ensures no cross-contamination of multi-agent memory paths
📄 `billing-hook-router.md`    # Stripe usage events • pauses worker processes if subscription expires
📄 `model-tier-allocator.md`   # Routes free-tier to Claude 3.5 Haiku and enterprise-tier to Claude 3.5 Sonnet

## 📁 agent-marketplace/ (Core Employee Archetypes)
📄 `hr-onboarding-agent.md`   # Automated workflows for tenant employee setup
📄 `finance-auditor-agent.md`  # Transaction checking and ledger verification
📄 `support-dispatcher.md`     # Customer ticketing triage and resolution routing

## 📁 shared-state-engine/ (4 skills - Multi-Agent Coordination)
📄 `state-store-sync.md`       # Redis-backed distributed state locker to prevent race conditions
📄 `message-bus.md`            # Pub/Sub layer allowing agents to pass structured messages to each other
📄 `human-approval-gate.md`    # Interrupt mechanics • halts agent workflow pending tenant dashboard confirmation
📄 `event-history-logger.md`   # Immutable audit trail of agent decisions rendered to tenant UI

## 📁 enterprise-connectors/ (3 skills - Data Integration)
📄 `stripe-webhook.md`         # Listens for direct subscription upgrades, downgrades, and cancellations
📄 `database-pool-manager.md`  # Row-level security (RLS) PostgreSQL mapping for multi-tenant isolation
📄 `external-crm-bridge.md`    # Dynamic connection management for tenant-owned Salesforce/HubSpot instances

## 📁 telemetry-evals/ (3 skills - Nightly Usage Metrics)
📄 `tenant-cost-analyzer.md]   # Aggregates precise daily LLM token costs per individual tenant workspace
📄 `efficiency-tracker.md`     # Monitors step counts and execution latencies across active agent cohorts
📄 `security-compliance.md]    # Automated scanning for PII leakages across tenant worker boundaries

---
**Configuration Files**
⚙️ `pnpm-workspace.yaml`       # Monorepo architecture manager (Next.js dashboard + FastAPI agent core)
⚙️ `prisma.schema`              # Database schema enforcing strict TenantId relations
📦 `poetry.lock`                # Fast, deterministic Python dependencies lockfile

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
