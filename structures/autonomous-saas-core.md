# 📂 Autonomous SaaS Core
> The canonical workspace for a production multi-agent SaaS routing engine on AWS Bedrock.

📄 `router-brief.md`      # Canonical brief: System architecture and tenant isolation rules
🧠 `memory.md`            # Session memory: Dynamic context for the active routing session
🤖 `CLAUDE.md`            # Operating rules: Strict instructions for the routing agent

## 📁 core-routing/ (7 skills - Supervisor Logic)
📄 `tenant-isolation.md`  # Data boundaries • cross-tenant strict suppression
📄 `task-analyzer.md`     # Intent extraction • required capability mapping
📄 `worker-handoff.md`    # Payload structuring • async event triggers
📄 `state-manager.md`     # Checkpointing • human-in-the-loop pause states
📄 `fallback-handler.md`  # API timeout protocols • graceful degradation
📄 `context-pruner.md`    # Token management • semantic compression
📄 `bedrock-selector.md`  # Dynamic model routing based on task complexity

## 📁 worker-nodes/ (4 agent personas - The "Employees")
📄 `coder-agent.md`       # Autonomous repo execution • overnight run policies
📄 `qa-agent.md`          # Test generation • matrix validation
📄 `data-analyst.md`      # SQL generation • schema exploration
📄 `ops-agent.md`         # Infrastructure checks • log parsing

## 📁 memory-sync/ (3 skills - Persistent State)
📄 `redis-caching.md`     # Short-term session retrieval
📄 `vector-commit.md`     # Long-term pgvector storage mapping
📄 `memory-cleanup.md`    # GDPR compliance • PII scrubbing before storage

## 📁 infrastructure/ (4 skills - AWS Bedrock & Deploy)
📄 `bedrock-auth.md`      # IAM role assumption • cross-account access
📄 `api-gateway.md`       # Rate limiting • tenant API quota tracking
📄 `docker-sandbox.md`    # Isolated execution environments for code workers
📄 `deployment-sync.md`   # CI/CD handoff • staging vs production rules

## 📁 evals/ (3 skills - Nightly Benchmarks)
📄 `routing-accuracy.md`  # Did the supervisor pick the right worker?
📄 `cost-analyzer.md`     # Token spend per tenant • alert thresholds
📄 `hallucination-check.md` # Output grounding • factual consistency

---
**Configuration Files**
⚙️ `config.yaml`          # Global environment variables and model endpoints
📦 `pyproject.toml`       # Python dependencies (LangGraph, Boto3, etc.)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
