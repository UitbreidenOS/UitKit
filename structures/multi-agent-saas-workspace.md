# 📂 Multi-Agent SaaS Workspace

> The canonical workspace for an AI Platform Architect, designed to build, scale, and monetize a SaaS platform where autonomous AI agents operate as virtual employees.

📄 `platform-architecture-brief.md` # Canonical brief: Defines the agent "employee" personas, core monetization strategy, and multi-tenant data isolation
🧠 `active-workforce-memory.md`     # Session memory: Dynamic context tracking for current agent task queues and inter-agent communication logs
🤖 `CLAUDE.md`                      # Operating rules: Strict instructions to enforce deterministic tool routing and prevent infinite agent loops

## 📁 agent-workforce/ (4 skills - Virtual Employees)
📄 `employee-persona-router.md`     # The supervisor node that classifies user intents and delegates tasks to specialized departmental agents (e.g., Sales Agent, Support Agent)
📄 `zaltaclaw-autonomous-loop.md`   # Core execution engine for running continuous, overnight autonomous agent operations without human intervention
📄 `inter-agent-protocols.md`       # Message-passing standards allowing the "Marketing Agent" to seamlessly hand off context to the "Sales Agent"
📄 `hallucination-guardrails.md`    # Pre-flight heuristic checks blocking adversarial inputs or out-of-bounds agent actions

## 📁 infrastructure-and-compute/ (4 skills - Scale & Cost)
📄 `aws-bedrock-allocator.md`       # Terraform scripts provisioning secure, scalable foundation models and knowledge bases via AWS Bedrock
📄 `local-compute-fallback.md`      # Routing logic to offload heavy, non-time-sensitive inference tasks to a dedicated Mac mini to save cloud costs
📄 `context-window-manager.md`      # Summarizes and truncates massive RAG pipeline retrievals to prevent token-limit crashes
📄 `model-agnostic-wrapper.md`      # Allows the platform to seamlessly swap between Claude 3, GPT-4, and local models depending on the task difficulty

## 📁 monetization-and-billing/ (3 skills - Revenue)
📄 `rapid-monetization-model.md`    # Stripe billing structures optimized for "pay-per-task" or "agent-seat" subscription tiers
📄 `token-spend-tracker.md`         # Aggregates API costs per tenant in real-time, enforcing hard limits to prevent runaway cloud bills
📄 `freemium-feature-flags.md`      # Maps specific autonomous tools and memory capacities to the user's active billing tier

## 📁 deployment-pipeline/ (3 skills - CI/CD)
📄 `agent-eval-framework.md`        # Automated LLM-as-a-judge scripts that test the virtual employees against a golden dataset of perfect responses
📄 `prompt-drift-detector.md`       # Alerts the team if a newly deployed system prompt degrades the autonomous coding agents' success rate
📄 `github-final-sync.md`           # CI/CD workflows to cleanly merge approved agent behaviors and platform updates directly to Github final repos

---
**Configuration Files**
⚙️ `bedrock-agent-schema.json`      # Infrastructure-as-code defining the action groups and OpenAPI schemas for AWS Bedrock agents
📦 `redis-memory-cache.yaml`        # Configuration for fast, short-term memory retrieval across the agent cluster

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
