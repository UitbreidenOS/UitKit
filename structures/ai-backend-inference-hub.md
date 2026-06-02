# AI Backend Inference Hub

A production-grade AI backend for high-concurrency LLM inference, multi-agent routing, and SaaS monetization. Designed for teams building AI-powered applications with strict latency, cost, and governance requirements.

---

## Directory Structure

```
ai-backend-inference-hub/
├── api-gateway-and-routes/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point
│   ├── routes.py                  # Core API endpoints (inference, agents, status)
│   ├── middleware.py              # Auth, rate limiting, error handling
│   ├── schemas.py                 # Pydantic models (request/response)
│   └── exceptions.py              # Custom exceptions
├── agents/
│   ├── __init__.py
│   ├── router.py                  # Agent dispatcher (route to correct agent)
│   ├── registry.py                # Agent catalog and metadata
│   ├── base.py                    # BaseAgent abstract class
│   ├── chat_agent.py              # Conversational agent
│   ├── reasoning_agent.py         # Chain-of-thought reasoning
│   ├── code_interpreter.py        # Sandboxed code execution
│   └── search_agent.py            # Web/knowledge search integration
├── tasks/
│   ├── __init__.py
│   ├── celery_app.py              # Celery app, Redis connection
│   ├── inference_task.py          # Async inference job
│   ├── batch_processor.py         # Batch job orchestration
│   └── health_monitor.py          # Heartbeat, queue depth monitoring
├── inference/
│   ├── __init__.py
│   ├── bedrock_client.py          # AWS Bedrock wrapper (Claude, Llama)
│   ├── streaming_handler.py       # Stream tokens to client
│   ├── token_counter.py           # Estimate + count tokens
│   └── prompt_cache.py            # Prompt caching layer (Redis)
├── billing/
│   ├── __init__.py
│   ├── stripe_integration.py      # Stripe SDK wrapper
│   ├── metering.py                # Usage tracking (tokens, requests)
│   ├── quota_enforcer.py          # Rate limits, quota checks
│   └── webhook_handlers.py        # Stripe events
├── database/
│   ├── __init__.py
│   ├── models.py                  # SQLAlchemy ORM (User, Inference Log, Batch Job)
│   ├── connection.py              # PostgreSQL session factory
│   ├── migrations/
│   │   └── alembic/               # Database migrations (Alembic)
│   │       ├── env.py
│   │       ├── versions/
│   │       │   ├── 001_initial.py
│   │       │   ├── 002_add_usage_snapshots.py
│   │       │   └── 003_add_batch_jobs.py
│   │       └── script.py.mako
│   └── repositories.py            # Data access layer
├── config/
│   ├── __init__.py
│   ├── settings.py                # Pydantic BaseSettings (env vars)
│   ├── agents.yaml                # Agent definitions and routing rules
│   ├── models.yaml                # LLM model configs (Bedrock aliases)
│   └── rate_limits.yaml           # Rate limit tiers (free/pro/enterprise)
├── kubernetes/
│   ├── base/
│   │   ├── deployment.yaml        # Deployment spec
│   │   ├── service.yaml           # LoadBalancer service
│   │   ├── configmap.yaml         # agents.yaml, models.yaml
│   │   ├── secret.yaml            # AWS credentials, Stripe key (kustomize)
│   │   ├── hpa.yaml               # Horizontal Pod Autoscaling (CPU/memory)
│   │   ├── ingress.yaml           # Ingress with SSL termination
│   │   └── kustomization.yaml
│   ├── overlays/
│   │   ├── staging/
│   │   │   ├── kustomization.yaml # Override replicas, resources, env
│   │   │   └── ingress-patch.yaml
│   │   └── production/
│   │       ├── kustomization.yaml
│   │       ├── ingress-patch.yaml
│   │       └── hpa-patch.yaml     # Higher replica limits
│   └── README.md                  # Deployment guide (kustomize, ArgoCD)
├── terraform/
│   ├── main.tf                    # Provider, backend config
│   ├── eks.tf                     # EKS cluster, node groups
│   ├── rds.tf                     # PostgreSQL database
│   ├── elasticache.tf             # Redis for caching, Celery broker
│   ├── ecr.tf                     # ECR repository for Docker images
│   ├── iam.tf                     # IAM roles (Bedrock, Stripe, logging)
│   ├── outputs.tf
│   ├── variables.tf
│   └── terraform.tfvars.example
├── tests/
│   ├── conftest.py                # Pytest fixtures (mocked Bedrock, Stripe)
│   ├── test_api.py                # API endpoint tests
│   ├── test_agents.py             # Agent routing logic
│   ├── test_inference.py          # Token counting, caching
│   ├── test_billing.py            # Quota enforcement, metering
│   ├── integration_test.py        # End-to-end flow
│   └── fixtures/
│       ├── sample_requests.json
│       └── sample_responses.json
├── docker/
│   ├── Dockerfile                 # Multi-stage build (Python 3.12)
│   ├── docker-compose.yml         # Local dev (FastAPI, Celery, Redis, PostgreSQL)
│   └── .dockerignore
├── scripts/
│   ├── setup.sh                   # Poetry install, alembic upgrade
│   ├── scaffold.py                # Generate project from template
│   ├── run_worker.sh              # Start Celery worker
│   └── seed_config.py             # Load agents.yaml → database
├── pyproject.toml                 # Dependencies, build config
├── README.md                      # Setup, deployment, API docs link
├── CLAUDE.md                      # Agent development, prompt versions, observability
└── .env.example                   # Template (AWS_ACCESS_KEY, STRIPE_API_KEY, etc.)
```

## Key files explained

| Path | Purpose |
|---|---|
| `src/api/main.py` | FastAPI app factory: register routes, middleware (auth, rate limit, request ID), CORS config, lifespan (init Bedrock client, Redis pool, Celery connection) |
| `src/inference/client.py` | Singleton `BedrockClient` using boto3; wraps `invoke_model` and `invoke_model_with_response_stream`; injects `system` prompt with cache_control blocks for cost optimization |
| `src/agents/router.py` | `AgentRouter` class: given input metadata (user_id, intent, complexity), selects agent type from registry; returns agent config + routing decision (sync vs async via Celery) |
| `src/tasks/inference_task.py` | Celery `@shared_task`: receives agent_id + input, invokes AgentRouter, executes agent, logs token usage to Redis + PostgreSQL, triggers Stripe metering event |
| `src/billing/metering.py` | `UsageMeter` class: tracks tokens-consumed per user per day; on threshold, emits `stripe.billing.meter_event` via Stripe API; idempotent on meter_event_id |
| `src/billing/quota.py` | `QuotaManager` class: enforces per-user limits (tokens/month, cost/month); blocks inference if quota exceeded; returns quota exhaustion error with retry-after header |
| `src/cache/session.py` | `SessionCache` class: Redis-backed multi-turn conversation state; sliding-window eviction by timestamp; TTL = session duration (config-driven, e.g., 24h) |
| `src/db/schema.py` | SQLAlchemy ORM: `User`, `ApiKey`, `InferenceLog`, `BatchJob`, `UsageSnapshot` tables; all audit columns (created_at, updated_at, deleted_at for soft deletes) |
| `migrations/versions/` | Alembic migration scripts; run on startup via FastAPI lifespan event or manual CLI; schema version stored in alembic_version table |
| `infra/terraform/modules/eks/` | Terraform EKS module: cluster creation, node groups with auto-scaling, IAM roles for Bedrock + RDS access, security groups for ingress/egress |
| `infra/kubernetes/base/celery-deployment.yaml` | Celery worker deployment: pulls from ECR, mounts config (agents.yaml, rate_limits.yaml), env vars (CELERY_BROKER_URL=redis://...), replicas configurable |

## Quick scaffold

```bash
# Prerequisites: Python 3.12+, poetry, Docker, kubectl
PROJECT=ai-backend-inference-hub
mkdir -p $PROJECT && cd $PROJECT

# Init Python project with Poetry
poetry init --name $PROJECT --no-interaction
poetry add fastapi uvicorn pydantic pydantic-settings \
  bedrock-runtime boto3 \
  celery redis kombu \
  sqlalchemy alembic psycopg[binary] asyncpg \
  stripe \
  prometheus-client opentelemetry-api opentelemetry-sdk \
  opentelemetry-exporter-prometheus opentelemetry-instrumentation-fastapi \
  opentelemetry-instrumentation-sqlalchemy \
  sentry-sdk \
  python-dotenv

poetry add -G dev pytest pytest-asyncio pytest-cov \
  ruff black mypy \
  httpx \
  fakeredis \
  sqlalchemy[mypy]

# Directory structure
mkdir -p .github/workflows
mkdir -p infra/kubernetes/{base,overlays/{staging,production/patches}}
mkdir -p infra/terraform/environments/{staging,production}
mkdir -p infra/terraform/modules/{eks,rds,elasticache,ecr,iam}
mkdir -p infra/docker
mkdir -p src/{api/{routes,middleware},agents/agents,tasks,inference,billing,db,cache,observability,utils}
mkdir -p src/agents/prompt_templates
mkdir -p tests/{unit/test_api,unit/test_inference,unit/test_billing,unit/test_tasks,integration,fixtures}
mkdir -p migrations/versions
mkdir -p config
mkdir -p scripts
mkdir -p .claude/commands

# Touch source files
touch src/__init__.py
touch src/api/{__init__.py,main.py,schemas.py}
touch src/api/{routes,middleware}/__init__.py
touch src/api/routes/{inference,batch,agents,models,usage,webhooks,health}.py
touch src/api/middleware/{auth,rate_limit,request_id,error_handler}.py
touch src/agents/{__init__.py,router.py,registry.py,types.py,base.py}
touch src/agents/agents/__init__.py
touch src/agents/agents/{chat_agent,reasoning_agent,code_interpreter_agent,search_agent}.py
touch src/agents/prompt_templates/{chat,reasoning,code_interpreter}.md
touch src/tasks/{__init__.py,celery_app.py,inference_task.py,batch_task.py,monitor_task.py}
touch src/inference/{__init__.py,client.py,streaming.py,token_counter.py,cache.py}
touch src/billing/{__init__.py,stripe_client.py,metering.py,quota.py,webhook_handler.py}
touch src/db/{__init__.py,client.py,schema.py,queries.py}
touch src/cache/{__init__.py,redis_client.py,session.py,rate_limit.py,model_cache.py}
touch src/observability/{__init__.py,logging.py,metrics.py,tracing.py,sentry_config.py}
touch src/utils/{__init__.py,config.py,crypto.py,time_utils.py,decorators.py}
touch tests/{conftest.py,README.md}
touch tests/unit/test_api/{test_inference,test_agents,test_auth,test_webhooks}.py
touch tests/unit/test_inference/{test_client,test_streaming,test_token_counter}.py
touch tests/unit/test_billing/{test_metering,test_quota,test_stripe_client}.py
touch tests/unit/test_tasks/{test_inference_task,test_batch_task}.py
touch tests/integration/{test_inference_e2e,test_batch_e2e,test_agent_routing,test_billing_e2e}.py
touch tests/fixtures/{__init__.py,bedrock.py,stripe.py,db.py,redis.py}
touch migrations/{alembic.ini,env.py,script.py.mako}
touch migrations/versions/{0001_create_users_table,0002_create_inference_logs,0003_create_batch_jobs,0004_create_usage_snapshots}.py
touch config/{agents.yaml,models.yaml,rate_limits.yaml}
touch scripts/{seed_db.py,migrate_stripe_customers.py,health_check.py}
touch .env.example .env.test
touch infra/docker/{Dockerfile,.dockerignore,docker-compose.yml}
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/{add-agent,add-model,load-test,metering-report,incident-response}.md

# pyproject.toml sections (merge manually or use poetry's interactive CLI)
cat > pyproject.toml << 'EOF'
[tool.poetry]
name = "ai-backend-inference-hub"
version = "0.1.0"
description = "Production-grade AI backend for high-concurrency LLM inference and multi-agent routing"
authors = ["Your Name <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.12"
# (append your poetry add output here)

[tool.poetry.group.dev.dependencies]
# (append your dev deps here)

[tool.poetry.scripts]
seed-db = "scripts.seed_db:main"
health-check = "scripts.health_check:main"

[tool.ruff]
line-length = 100
target-version = "py312"
select = ["E", "F", "W", "I", "N", "UP"]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
addopts = "-v --cov=src --cov-report=term-min=80 --cov-report=html"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
EOF

# .env.example
cat > .env.example << 'EOF'
# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Stripe
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/inference_hub

# Redis
REDIS_URL=redis://localhost:6379/0

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# API
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO

# Observability
SENTRY_DSN=https://...@sentry.io/...
PROMETHEUS_PORT=9090
EOF

# docker-compose.yml for local dev
cat > infra/docker/docker-compose.yml << 'EOF'
version: "3.9"
services:
  api:
    build:
      context: ../..
      dockerfile: infra/docker/Dockerfile
      target: development
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/inference_hub
      REDIS_URL: redis://redis:6379/0
      CELERY_BROKER_URL: redis://redis:6379/1
    depends_on:
      - postgres
      - redis
    volumes:
      - ../../src:/app/src

  celery_worker:
    build:
      context: ../..
      dockerfile: infra/docker/Dockerfile
      target: development
    command: celery -A src.tasks.celery_app worker --loglevel=info
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/inference_hub
      CELERY_BROKER_URL: redis://redis:6379/1
    depends_on:
      - postgres
      - redis
    volumes:
      - ../../src:/app/src

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: inference_hub
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
EOF

# Dockerfile
cat > infra/docker/Dockerfile << 'EOF'
FROM python:3.12-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir poetry

FROM base AS development
COPY pyproject.toml poetry.lock ./
RUN poetry install --with dev
COPY . .
CMD ["poetry", "run", "uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM base AS runtime
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main
COPY src ./src
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
CMD ["poetry", "run", "uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

echo "Scaffold complete. Next: poetry install && docker compose -f infra/docker/docker-compose.yml up"
```

## CLAUDE.md template

```markdown
# AI Backend Inference Hub

Production AI backend for high-concurrency LLM inference, dynamic multi-agent task routing, and SaaS monetization.
All inference logic is in src/inference/. Agent routing in src/agents/. Billing in src/billing/.

## Stack

- FastAPI 0.115+ — async HTTP API in src/api/; streaming via SSE on POST /v1/inference?stream=true
- AWS Bedrock — Claude 3.5 Sonnet and Haiku via boto3; prompt caching enabled for cost optimization
- Celery 5.4+ — async task queue for long-running inference; Redis broker for routing
- PostgreSQL 16 — user accounts, inference logs, usage snapshots, batch job tracking
- Redis 7+ — session cache (multi-turn state), rate limit buckets, Celery queue
- Stripe 13+ — usage-based billing, subscription management, webhook event processing
- Kubernetes 1.28+ (EKS) — stateless API pods, horizontally scalable Celery workers

## Adding a new agent type

1. **Define schema** — update `config/agents.yaml`:
   ```yaml
   agents:
     my_agent:
       model: "anthropic.claude-3-5-sonnet-20241022-v2:0"
       max_tokens: 4096
       token_budget: 50000
       tools: ["web_search", "code_execution"]
   ```

2. **Create agent class** — `src/agents/agents/my_agent.py`:
   ```python
   from src.agents.base import BaseAgent
   from src.agents.types import AgentInput, AgentResult

   class MyAgent(BaseAgent):
       async def run(self, input: AgentInput) -> AgentResult:
           # Agent logic here
           pass
   ```

3. **Register agent** — update `src/agents/registry.py`:
   - Import your agent class
   - Add to `AGENT_REGISTRY = { "my_agent": MyAgent, ... }`

4. **Update router** — in `src/agents/router.py`:
   - Add routing rule: `if intent == "my_intent": return AgentConfig(type="my_agent", ...)`

5. **Test** — create `tests/unit/test_agents/test_my_agent.py`:
   - Mock Bedrock responses
   - Test happy path, error handling, token budget enforcement

## Inference flow (single-turn, no tools)

1. Client: `POST /v1/inference`
   ```json
   {
     "user_id": "user_123",
     "model": "claude-3-5-sonnet",
     "messages": [{"role": "user", "content": "Hello"}],
     "stream": false
   }
   ```

2. Auth middleware verifies API key via Stripe (customer lookup).

3. RateLimitMiddleware checks Redis for per-user request count; increments sliding window.

4. Route handler calls `src.inference.client.BedrockClient.invoke_model()`.

5. Bedrock returns full Message object; handler logs to PostgreSQL (inference_logs table).

6. Stripe metering: handler calls `UsageMeter.record(user_id, tokens_used)`.

7. Quota check: QuotaManager checks if user is at limit; returns 429 if over threshold.

8. Response: `{ "id": "msg_...", "content": [...], "usage": { "input_tokens": 100, "output_tokens": 50 } }`

## Inference flow (multi-agent routing)

1. Client: `POST /v1/agents/route` with input + metadata.

2. AgentRouter analyzes input; selects agent type based on intent/complexity.

3. If agent is async (code execution, web search): dispatch Celery task `inference_task.py`.
   - Task runs agent via BaseAgent.run(); logs usage; emits Stripe metering event.
   - Returns job_id + polling URL.

4. If agent is sync (chat): run directly in FastAPI worker; return response.

5. Long-poll or webhook callback notifies client of result.

## Rate limiting tiers

```yaml
rate_limits:
  starter:
    requests_per_minute: 10
    tokens_per_day: 1000000
  pro:
    requests_per_minute: 100
    tokens_per_day: 10000000
  enterprise:
    requests_per_minute: 1000
    tokens_per_day: unlimited
```

Enforcement: `src/billing/quota.py` reads tier from Stripe subscription + checks Redis counters.

## Billing & metering

1. User makes inference → logs token count to PostgreSQL.

2. Every hour (or on-demand): `UsageMeter.sync_stripe()` aggregates daily usage.

3. Stripe receives `stripe.billing.meter_event` with `quantity=tokens_used`.

4. Stripe applies usage-based charge to invoice at month-end.

5. Webhook handler processes `invoice.payment_succeeded` → grant fresh quota.

Monitor: `GET /v1/usage/tokens?period=month` returns running total + percentage of quota.

## Prompt versioning & caching

Active prompts in `src/agents/prompt_templates/`. Bedrock prompt cache enabled via:
```python
system=[
    {
        "type": "text",
        "text": system_prompt,
        "cache_control": {"type": "ephemeral"}
    }
]
```

This caches the system prompt across requests within a 5-minute window → ~10x cost reduction on repeated agents.

## Running locally

```bash
docker compose -f infra/docker/docker-compose.yml up
poetry run python scripts/seed_db.py
poetry run uvicorn src.api.main:app --reload
# In another terminal:
poetry run celery -A src.tasks.celery_app worker --loglevel=info
```

## Deployment to EKS

```bash
# Build & push image
docker build -f infra/docker/Dockerfile -t 123456789.dkr.ecr.us-east-1.amazonaws.com/inference-hub:latest .
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/inference-hub:latest

# Deploy via Kustomize
kubectl apply -k infra/kubernetes/overlays/production

# Monitor rollout
kubectl rollout status deployment/inference-api -n default
```

## What not to do

- Do not make direct Bedrock API calls outside of `src/inference/client.py` — always route through singleton.
- Do not skip token counting — log every inference to PostgreSQL for billing accuracy.
- Do not cache user sessions longer than 24h — rotate session tokens weekly for security.
- Do not deploy without Stripe webhooks configured — billing won't sync.
- Do not skip Bedrock model caching setup — it will inflate inference costs 10x.
- Do not use single-replica API pods in production — always run >=3 replicas with PDB.
```

## Configuration files

**config/agents.yaml** — Agent registry with model, token budget, tools per agent type.

**config/models.yaml** — Available Bedrock models, availability status, pricing metadata.

**config/rate_limits.yaml** — Rate limit tiers (starter/pro/enterprise) with token quotas.

**infra/kubernetes/overlays/production/kustomization.yaml** — Prod-specific replica counts, resource limits, ingress config.

**infra/terraform/environments/production/main.tf** — Multi-AZ EKS, RDS read replicas, Redis cluster, ALB with WAF.

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
