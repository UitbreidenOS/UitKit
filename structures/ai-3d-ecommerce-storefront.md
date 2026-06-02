# 📂 AI 3D Ecommerce Storefront

> The canonical workspace for a production-grade AI backend architecture, designed to handle high-concurrency LLM inference, dynamic multi-agent task routing, and rapid SaaS monetization.

📄 `backend-architecture-brief.md` # Canonical brief: Defines the core API boundaries, token latency SLAs, and the overarching multi-agent business model
🧠 `active-agent-sessions.md`      # Session memory: Dynamic context tracking for current virtual employee workloads and active database connections
🤖 `CLAUDE.md`                     # Operating rules: Strict instructions to enforce API rate limiting and mandate stateless server configurations

## 📁 api-gateway-and-routes/ (4 skills - The Front Door)
📄 `health-api-core.md`            # The central FastAPI/Node server handling all incoming client requests for the core health-api repository
📄 `streaming-response-handler.md` # Server-Sent Events (SSE) logic to instantly stream multi-agent thought processes back to the UI
📄 `rate-limit-and-auth.md`        # Redis-backed middleware ensuring users cannot DDoS the expensive inference endpoints
📄 `rapid-monetization-webhooks.md`# Stripe integrations perfectly mapped to token usage to ensure you monetize the SaaS quickly and cleanly

## 📁 multi-agent-orchestration/ (3 skills - Virtual Employees)
📄 `saas-employee-router.md`       # The supervisor state machine that classifies user intents and hands off tasks to specialized AI agent "employees"
📄 `inter-agent-pubsub.md`         # Kafka or Redis Pub/Sub channels allowing the "Research Agent" to pass structured data to the "Coding Agent" asynchronously
📄 `hallucination-firewall.md`     # Pydantic schema validators that automatically reject and retry agent outputs that break the expected JSON structure

## 📁 compute-load-balancer/ (4 skills - Cost & Scale)
📄 `bedrock-primary-allocator.md`  # Terraform configurations for routing heavy, multi-agent systems and RAG pipelines directly to AWS Bedrock
📄 `mac-mini-fallback.md`          # Dynamic routing logic that detects non-urgent background tasks and pushes them to a dedicated Mac mini to drastically cut cloud costs
📄 `dgx-spark-ml-runner.md`        # Custom endpoints for offloading deep-learning tasks and local model fine-tuning to heavy Nvidia DGX hardware
📄 `token-budget-enforcer.md`      # Circuit breakers that automatically pause an AI employee's execution loop if it exceeds its allocated API spend

## 📁 memory-and-context/ (3 skills - State Management)
📄 `vector-db-connector.md`        # Connection pools and semantic caching layers for Pinecone/pgvector
📄 `short-term-redis-memory.md`    # Manages the active conversation window, automatically summarizing older messages to prevent token bloat
📄 `long-term-s3-archives.md`      # Cold storage for finalized agent outputs and system logs

## 📁 ci-cd-and-deployment/ (3 skills - Shipping)
📄 `container-optimization.md`     # Multi-stage Dockerfiles that completely strip out heavy ML dependencies for the production build
📄 `load-test-simulator.md`        # k6 scripts mimicking 1,000 concurrent agent API calls to test system bottlenecks
📄 `github-final-sync.md`          # Automated actions to lint, test, and push the production-ready backend code directly to your Github final repos

---
**Configuration Files**
⚙️ `openapi-schema.yaml`           # The single source of truth for the health-api contracts, ensuring the frontend never breaks
📦 `celery-worker.conf`            # Configuration for the asynchronous task queues managing overnight agent jobs

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
