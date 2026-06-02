# RAG Knowledge Base — Project Structure

> For ML engineers building and maintaining a production RAG pipeline — optimizing the full cycle from raw document ingestion to retrieval-augmented generation with evals and traceability.

## Stack

- **Language:** Python 3.12+ managed via `uv`
- **Orchestration:** LangChain 0.3+ or LlamaIndex 0.12+ (pipeline wiring, chain composition)
- **Vector database:** Qdrant (self-hosted via Docker or Qdrant Cloud) — dense + sparse vector support
- **Embeddings:** OpenAI `text-embedding-3-large` (3072-dim) or Cohere `embed-english-v3.0` (1024-dim, reranker included)
- **LLM (generation):** Anthropic Claude 3.5 Sonnet via `anthropic` SDK (prompt caching enabled)
- **Document parsing:** Unstructured.io (`unstructured[all-docs]`) for PDF, DOCX, HTML, PPTX, XLSX
- **Query API:** FastAPI 0.115+ with Pydantic v2 schemas
- **Cache:** Redis 7 (query-level semantic cache, embedding memoization)
- **Tracing + eval:** LangSmith (trace every chain call, run RAGAS golden-set evals in CI)
- **Eval framework:** RAGAS 0.2+ (faithfulness, answer relevancy, context recall, context precision)
- **Data versioning:** DVC 3.5+ (raw docs, processed chunks, golden sets tracked in remote storage)
- **Testing:** pytest 8+ with pytest-asyncio, VCR cassettes for LLM calls
- **Containerisation:** Docker 25, docker-compose v2 (Qdrant + Redis + API)
- **CI/CD:** GitHub Actions (lint → unit tests → integration tests → RAGAS eval gate → build)
- **Linting/formatting:** Ruff 0.4+, mypy 1.10+

## Directory tree

```
rag-knowledge-base/
├── .github/
│   └── workflows/
│       ├── ci.yml                                  # ruff, mypy, pytest, RAGAS eval gate on PR
│       ├── ingest.yml                              # Manual/scheduled DVC pull + re-ingestion
│       └── cd-production.yml                       # Build + deploy API on version tag push
├── .dvc/
│   ├── config                                      # DVC remote: S3/GCS bucket for raw docs + chunks
│   └── .gitignore
├── configs/
│   ├── chunking.yaml                               # chunk_size, chunk_overlap, splitter strategy per doc type
│   ├── retrieval.yaml                              # top_k, score_threshold, hybrid alpha (dense/sparse mix)
│   ├── embeddings.yaml                             # provider, model, batch_size, retry config
│   └── generation.yaml                             # model, max_tokens, temperature, prompt_version
├── data/
│   ├── raw/                                        # Source documents (DVC-tracked, not committed)
│   │   ├── pdfs/                                   # PDF source files
│   │   ├── docx/                                   # Word documents
│   │   └── html/                                   # Web-scraped HTML files
│   ├── processed/                                  # Parsed + chunked output (DVC-tracked)
│   │   ├── chunks/                                 # JSONL files: {id, text, metadata, source_doc}
│   │   └── embeddings/                             # Cached embedding vectors (numpy .npy or parquet)
│   └── evaluation/
│       ├── golden_set.jsonl                        # Ground-truth QA pairs for RAGAS evaluation
│       └── golden_set_v2.jsonl                     # Versioned golden sets — never overwrite, append only
├── docker/
│   ├── Dockerfile                                  # Multi-stage: builder (uv install) → runtime (non-root)
│   └── docker-compose.yml                          # Qdrant + Redis + API service with healthchecks
├── prompts/
│   ├── rag_system_v1.txt                           # System prompt v1: role, citation format, refusal rules
│   ├── rag_system_v2.txt                           # System prompt v2: updated with structured output
│   └── query_rewrite.txt                           # Prompt for HyDE / query expansion step
├── src/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                                 # FastAPI app factory, lifespan, router registration
│   │   ├── deps.py                                 # Shared dependencies: get_retriever, get_llm_client
│   │   ├── schemas.py                              # QueryRequest, QueryResponse, CitedSource, HealthResponse
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── query.py                            # POST /query — full RAG pipeline endpoint
│   │       ├── ingest.py                           # POST /ingest — trigger document ingestion job
│   │       └── health.py                           # GET /health, GET /health/qdrant, GET /health/redis
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── loaders/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # DocumentLoader abstract base with load() -> list[Document]
│   │   │   ├── pdf_loader.py                       # Unstructured.io PDF parser with table/image handling
│   │   │   ├── docx_loader.py                      # Unstructured.io DOCX parser, heading hierarchy preserved
│   │   │   ├── html_loader.py                      # BeautifulSoup + Unstructured.io for web content
│   │   │   └── loader_registry.py                  # Extension → loader mapping, get_loader(path) factory
│   │   ├── chunkers/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # TextChunker abstract base with chunk() -> list[Chunk]
│   │   │   ├── recursive_chunker.py                # LangChain RecursiveCharacterTextSplitter wrapper
│   │   │   ├── semantic_chunker.py                 # Embedding-based sentence boundary detection
│   │   │   └── chunker_factory.py                  # Returns chunker from configs/chunking.yaml strategy key
│   │   ├── embedders/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # Embedder abstract base with embed_batch() -> list[list[float]]
│   │   │   ├── openai_embedder.py                  # OpenAI text-embedding-3-large, batched, retried
│   │   │   ├── cohere_embedder.py                  # Cohere embed-english-v3.0, input_type=search_document
│   │   │   └── cached_embedder.py                  # Redis-backed wrapper: SHA-256(text) → cached vector
│   │   └── pipeline.py                             # IngestionPipeline: load → chunk → embed → upsert to Qdrant
│   ├── retrieval/
│   │   ├── __init__.py
│   │   ├── qdrant_client.py                        # Qdrant async client factory, collection init, upsert helpers
│   │   ├── dense_retriever.py                      # Cosine ANN search, top_k, score_threshold filter
│   │   ├── sparse_retriever.py                     # BM25 sparse vectors (Qdrant sparse vector support)
│   │   ├── hybrid_retriever.py                     # RRF fusion of dense + sparse results, alpha tuning
│   │   ├── reranker.py                             # Cohere rerank-english-v3.0 or cross-encoder reranker
│   │   └── query_pipeline.py                       # QueryPipeline: expand → retrieve → rerank → return chunks
│   ├── generation/
│   │   ├── __init__.py
│   │   ├── llm_client.py                           # Anthropic SDK client with prompt caching (cache_control)
│   │   ├── prompt_loader.py                        # Loads prompt templates from prompts/ by version tag
│   │   ├── citation_builder.py                     # Builds [1], [2] inline citations from retrieved chunks
│   │   └── rag_chain.py                            # Full RAG chain: query_pipeline + llm_client + citations
│   └── evaluation/
│       ├── __init__.py
│       ├── ragas_runner.py                         # Runs RAGAS metrics over golden_set.jsonl, outputs JSON report
│       ├── metrics.py                              # faithfulness, answer_relevancy, context_recall wrappers
│       └── golden_set_builder.py                   # CLI tool to generate/extend golden_set.jsonl via LLM
├── tests/
│   ├── conftest.py                                 # Pytest fixtures: mock Qdrant, mock embedder, mock LLM
│   ├── cassettes/                                  # VCR cassettes for recorded LLM/embedding API calls
│   ├── unit/
│   │   ├── test_pdf_loader.py                      # Unstructured.io parser output, table extraction
│   │   ├── test_recursive_chunker.py               # Chunk size/overlap boundary conditions
│   │   ├── test_semantic_chunker.py                # Sentence boundary detection on edge cases
│   │   ├── test_hybrid_retriever.py                # RRF fusion logic, alpha=0 (dense only), alpha=1 (sparse)
│   │   ├── test_citation_builder.py                # Citation index assignment, deduplication
│   │   └── test_cached_embedder.py                 # Cache hit/miss, Redis key format
│   └── integration/
│       ├── test_ingestion_pipeline.py              # End-to-end: load PDF → chunk → embed → Qdrant upsert
│       ├── test_query_pipeline.py                  # End-to-end: query → retrieve → rerank → top chunks
│       ├── test_rag_chain.py                       # Full chain with mocked Claude response, citation check
│       └── test_api_query.py                       # POST /query via httpx AsyncClient, schema validation
├── scripts/
│   ├── ingest_docs.py                              # CLI: python scripts/ingest_docs.py --source data/raw/pdfs/
│   ├── build_golden_set.py                         # CLI: generate N QA pairs from chunks using Claude
│   ├── run_evals.py                                # CLI: run RAGAS, print report, exit 1 if below threshold
│   └── migrate_collection.py                       # Qdrant collection migration: recreate with new vector dims
├── pyproject.toml                                  # All deps, ruff config, mypy config, pytest config
├── .env.example                                    # All env vars with descriptions, no real values
├── .env.test                                       # Test env: mock endpoints, no real API keys needed
├── dvc.yaml                                        # DVC pipeline stages: load → chunk → embed → index
├── dvc.lock                                        # Locked DVC stage hashes (committed)
├── Makefile                                        # Targets: dev, ingest, test, eval, lint, build
└── README.md                                       # Setup, architecture overview, eval results table
```

## Key files explained

| Path | Purpose |
|---|---|
| `src/ingestion/pipeline.py` | Orchestrates load → chunk → embed → upsert; reads strategy from `configs/chunking.yaml`; supports incremental ingestion (skips already-indexed doc hashes stored in Qdrant payload) |
| `src/retrieval/hybrid_retriever.py` | Combines Qdrant dense ANN and sparse BM25 results using Reciprocal Rank Fusion; `alpha` param (0–1) controls dense/sparse weight, loaded from `configs/retrieval.yaml` |
| `src/generation/llm_client.py` | Anthropic SDK client with `cache_control` on system prompt and retrieved context blocks; tracks `cache_creation_input_tokens` vs `cache_read_input_tokens` in LangSmith traces |
| `src/generation/rag_chain.py` | End-to-end RAG: calls `QueryPipeline`, formats retrieved chunks into cached context, calls Claude, runs `citation_builder`, returns `QueryResponse` with inline citations |
| `configs/chunking.yaml` | Per-document-type chunking strategy: `chunk_size`, `chunk_overlap`, splitter (`recursive` or `semantic`), `min_chunk_length` to drop noise; source of truth for ingestion params |
| `configs/retrieval.yaml` | `top_k` (pre-rerank), `rerank_top_n` (post-rerank), `score_threshold`, hybrid `alpha`, `enable_hyde` (query expansion with hypothetical doc embedding) |
| `data/evaluation/golden_set.jsonl` | Versioned QA pairs: `{question, ground_truth_answer, ground_truth_contexts}`; never mutated in-place — append new versions as `golden_set_v2.jsonl` |
| `src/evaluation/ragas_runner.py` | Loads golden set, runs full RAG chain per question, feeds predictions to RAGAS metrics, writes `eval_report.json`; CI reads this and fails if faithfulness < 0.80 |

## Quick scaffold

```bash
# Prerequisites: Python 3.12+, Docker, uv (pip install uv), DVC (pip install dvc[s3])
PROJECT=rag-knowledge-base
mkdir -p $PROJECT && cd $PROJECT

# Python project init
uv init --python 3.12

# Core dependencies
uv add fastapi[standard] pydantic[email] \
    anthropic \
    langchain langchain-openai langchain-cohere langchain-community \
    llama-index llama-index-embeddings-openai llama-index-embeddings-cohere \
    qdrant-client \
    openai cohere \
    "unstructured[all-docs]" \
    redis aioredis \
    langsmith ragas \
    dvc "dvc[s3]" \
    pyyaml python-dotenv \
    httpx structlog

uv add --dev pytest pytest-asyncio pytest-recording vcrpy \
    httpx ruff mypy types-redis

# Directory structure
mkdir -p .github/workflows
mkdir -p .dvc
mkdir -p configs
mkdir -p data/raw/{pdfs,docx,html}
mkdir -p data/processed/{chunks,embeddings}
mkdir -p data/evaluation
mkdir -p docker
mkdir -p prompts
mkdir -p src/api/routes
mkdir -p src/ingestion/{loaders,chunkers,embedders}
mkdir -p src/retrieval
mkdir -p src/generation
mkdir -p src/evaluation
mkdir -p tests/{unit,integration,cassettes}
mkdir -p scripts

# Touch all source files
touch src/__init__.py
touch src/api/__init__.py src/api/main.py src/api/deps.py src/api/schemas.py
touch src/api/routes/__init__.py src/api/routes/query.py
touch src/api/routes/ingest.py src/api/routes/health.py
touch src/ingestion/__init__.py src/ingestion/pipeline.py
touch src/ingestion/loaders/__init__.py src/ingestion/loaders/base.py
touch src/ingestion/loaders/pdf_loader.py src/ingestion/loaders/docx_loader.py
touch src/ingestion/loaders/html_loader.py src/ingestion/loaders/loader_registry.py
touch src/ingestion/chunkers/__init__.py src/ingestion/chunkers/base.py
touch src/ingestion/chunkers/recursive_chunker.py src/ingestion/chunkers/semantic_chunker.py
touch src/ingestion/chunkers/chunker_factory.py
touch src/ingestion/embedders/__init__.py src/ingestion/embedders/base.py
touch src/ingestion/embedders/openai_embedder.py src/ingestion/embedders/cohere_embedder.py
touch src/ingestion/embedders/cached_embedder.py
touch src/retrieval/__init__.py src/retrieval/qdrant_client.py
touch src/retrieval/dense_retriever.py src/retrieval/sparse_retriever.py
touch src/retrieval/hybrid_retriever.py src/retrieval/reranker.py src/retrieval/query_pipeline.py
touch src/generation/__init__.py src/generation/llm_client.py
touch src/generation/prompt_loader.py src/generation/citation_builder.py src/generation/rag_chain.py
touch src/evaluation/__init__.py src/evaluation/ragas_runner.py
touch src/evaluation/metrics.py src/evaluation/golden_set_builder.py
touch tests/conftest.py
touch tests/unit/test_pdf_loader.py tests/unit/test_recursive_chunker.py
touch tests/unit/test_semantic_chunker.py tests/unit/test_hybrid_retriever.py
touch tests/unit/test_citation_builder.py tests/unit/test_cached_embedder.py
touch tests/integration/test_ingestion_pipeline.py tests/integration/test_query_pipeline.py
touch tests/integration/test_rag_chain.py tests/integration/test_api_query.py
touch scripts/ingest_docs.py scripts/build_golden_set.py
touch scripts/run_evals.py scripts/migrate_collection.py
touch .env.example .env.test dvc.yaml

# Default configs
cat > configs/chunking.yaml << 'EOF'
default:
  strategy: recursive
  chunk_size: 1000
  chunk_overlap: 200
  min_chunk_length: 50

pdf:
  strategy: recursive
  chunk_size: 800
  chunk_overlap: 150
  min_chunk_length: 40

html:
  strategy: semantic
  chunk_size: 600
  chunk_overlap: 100
  min_chunk_length: 30
EOF

cat > configs/retrieval.yaml << 'EOF'
top_k: 20
rerank_top_n: 5
score_threshold: 0.65
hybrid_alpha: 0.7
enable_hyde: false
enable_query_expansion: false
EOF

cat > configs/embeddings.yaml << 'EOF'
provider: openai
model: text-embedding-3-large
dimensions: 3072
batch_size: 100
max_retries: 3
retry_delay: 1.0
EOF

cat > configs/generation.yaml << 'EOF'
model: claude-3-5-sonnet-20241022
max_tokens: 2048
temperature: 0.1
prompt_version: v2
enable_prompt_caching: true
EOF

# docker-compose
cat > docker/docker-compose.yml << 'EOF'
version: "3.9"
services:
  qdrant:
    image: qdrant/qdrant:v1.9.2
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://localhost:6333/healthz || exit 1"]
      interval: 10s
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

  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    env_file: ../.env
    depends_on:
      qdrant:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  qdrant_storage:
EOF

# Makefile
cat > Makefile << 'EOF'
.PHONY: dev ingest test eval lint build

dev:
	docker compose -f docker/docker-compose.yml up qdrant redis -d
	uv run uvicorn src.api.main:app --reload --port 8000

ingest:
	uv run python scripts/ingest_docs.py --source data/raw/

test:
	uv run pytest tests/ --cov=src --cov-report=term-missing --cov-fail-under=75

test-unit:
	uv run pytest tests/unit/ -v

test-integration:
	uv run pytest tests/integration/ -v

eval:
	uv run python scripts/run_evals.py --golden-set data/evaluation/golden_set.jsonl

build-golden:
	uv run python scripts/build_golden_set.py --n 50 --output data/evaluation/golden_set.jsonl

lint:
	uv run ruff check src/ tests/ scripts/
	uv run ruff format --check src/ tests/ scripts/
	uv run mypy src/

build:
	docker build -f docker/Dockerfile -t rag-knowledge-base:local .

dvc-pull:
	dvc pull data/raw data/processed
EOF

# DVC init
dvc init 2>/dev/null || true
dvc run -n ingest -d data/raw/ -o data/processed/chunks/ \
  "python scripts/ingest_docs.py --source data/raw/" 2>/dev/null || true

# Install Claudient skills
npx claudient add skill data-ml/rag-pipeline
npx claudient add skill data-ml/vector-db-ops
npx claudient add skill data-ml/embedding-strategy
npx claudient add skill data-ml/ragas-eval
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/async-patterns
npx claudient add skill productivity/test-generator

echo "RAG knowledge base scaffold complete. Next: cp .env.example .env && make dev"
```

## CLAUDE.md template

```markdown
# RAG Knowledge Base

Production RAG pipeline: document ingestion → vector storage → hybrid retrieval → Claude-powered generation with citations.
Stack: Python 3.12 + uv, LangChain/LlamaIndex, Qdrant, FastAPI, OpenAI Embeddings, Anthropic Claude, Unstructured.io, Redis, LangSmith, RAGAS.
All pipeline parameters (chunk size, retrieval top_k, hybrid alpha) live in configs/ — do not hardcode them.

## Stack

- Ingestion: Unstructured.io (`unstructured[all-docs]`) parses raw docs → chunkers in src/ingestion/chunkers/
- Embeddings: OpenAI `text-embedding-3-large` (3072-dim) via src/ingestion/embedders/openai_embedder.py
- Vector DB: Qdrant — collection `documents`, dense + sparse vectors, running on port 6333
- Retrieval: Hybrid (dense ANN + BM25 sparse) with RRF fusion, then Cohere reranker
- Generation: Anthropic Claude 3.5 Sonnet via src/generation/llm_client.py with prompt caching
- Cache: Redis on port 6379 — embedding vectors cached by SHA-256(text), query results cached by hash(query+params)
- Tracing: LangSmith — every chain call traced; set LANGSMITH_API_KEY + LANGSMITH_PROJECT in .env
- Evals: RAGAS — run via `make eval`; CI fails if faithfulness < 0.80

## Ingesting a new document type

1. Create `src/ingestion/loaders/<type>_loader.py` extending `DocumentLoader` in `loaders/base.py`
2. Implement `load(path: str) -> list[Document]` using Unstructured.io:
   ```python
   from unstructured.partition.<type> import partition_<type>
   elements = partition_<type>(filename=path, include_metadata=True)
   ```
3. Register in `src/ingestion/loaders/loader_registry.py`:
   ```python
   LOADER_REGISTRY[".ext"] = MyTypeLoader
   ```
4. Add chunking defaults for the new type in `configs/chunking.yaml` under a new key matching the extension
5. Run integration test: `uv run pytest tests/integration/test_ingestion_pipeline.py -k "new_type"`

Supported out of the box: .pdf, .docx, .html — all via Unstructured.io with table and heading preservation.

## Adjusting chunk size / overlap

Parameters live in `configs/chunking.yaml`. Change them there — never hardcode in source.

Trade-offs:
- Smaller chunks (400–600 tokens): higher retrieval precision, risk of losing cross-sentence context
- Larger chunks (1000–1500 tokens): more context per retrieved chunk, lower precision, higher token cost
- Overlap (100–200 tokens): prevents losing information at boundaries; increase if answers are being cut off
- Semantic chunker: use for conversational or narrative content; recursive works better for structured docs

After changing chunking params, you MUST re-ingest all documents — existing Qdrant vectors are no longer comparable.
Delete the collection and re-run: `make ingest`

To find optimal params: build a golden set, run RAGAS with different configs, compare `context_recall` scores.

## Hybrid search configuration

Hybrid alpha is in `configs/retrieval.yaml` → `hybrid_alpha` (0.0 to 1.0).
- `alpha=1.0` — pure dense (semantic, embedding-based); best for natural language queries
- `alpha=0.0` — pure sparse (BM25 keyword); best for exact term matching (product codes, names)
- `alpha=0.7` — recommended default: semantic-leaning with keyword boost

To tune alpha empirically:
```bash
# Run evals at different alpha values and compare context_precision
for alpha in 0.5 0.6 0.7 0.8 0.9; do
  RETRIEVAL_ALPHA=$alpha uv run python scripts/run_evals.py --golden-set data/evaluation/golden_set.jsonl \
    --output eval_results/alpha_${alpha}.json
done
```

Sparse vectors must be generated at ingest time via Qdrant's FastEmbed sparse model.
If you toggled `enable_sparse` after ingestion, delete the collection and re-ingest.

## Running RAGAS evaluations

```bash
# Run against current golden set
make eval

# Run and write JSON report
uv run python scripts/run_evals.py \
  --golden-set data/evaluation/golden_set.jsonl \
  --output eval_report.json

# Build a larger golden set (requires ANTHROPIC_API_KEY)
make build-golden

# Run evals with a specific retrieval config
RETRIEVAL_TOP_K=10 RERANK_TOP_N=3 uv run python scripts/run_evals.py
```

RAGAS metrics tracked:
- `faithfulness` — are claims in the answer supported by retrieved context? (CI threshold: >=0.80)
- `answer_relevancy` — does the answer address the question? (CI threshold: >=0.75)
- `context_recall` — are ground-truth contexts retrieved? (CI threshold: >=0.70)
- `context_precision` — are retrieved chunks all relevant? (informational, no gate)

## Prompt template versioning

Prompt files live in `prompts/` as plain text. They are versioned by filename: `rag_system_v1.txt`, `rag_system_v2.txt`.
`configs/generation.yaml` → `prompt_version` controls which version is loaded by `src/generation/prompt_loader.py`.

Rules:
- Never edit a prompt file in-place after it has been used in production — create a new version
- Include the prompt version in LangSmith trace metadata so evals are tied to the prompt that generated them
- When changing prompt versions, run RAGAS evals on both versions before switching production config
- Prompt caching (Anthropic cache_control) is applied to the system prompt block — changing the system prompt invalidates the cache; prefer editing user-turn instructions for tuning

## Claude prompt caching

`src/generation/llm_client.py` applies `cache_control: {"type": "ephemeral"}` to:
1. The system prompt block (loaded from `prompts/rag_system_v{n}.txt`)
2. The retrieved context block (chunks formatted as a single string)

Cache TTL: 5 minutes (Anthropic default). Cache hits save ~80% of input token cost.
Check cache efficiency in LangSmith: look for `cache_read_input_tokens` in trace metadata.
If cache_read_input_tokens / total_input_tokens < 0.5 on repeated queries, context ordering may be non-deterministic — sort chunks by score before formatting.

## Environment variables

All required vars are in `.env.example`. Critical ones:
- `OPENAI_API_KEY` — for OpenAI embeddings (text-embedding-3-large)
- `COHERE_API_KEY` — for Cohere reranker (rerank-english-v3.0)
- `ANTHROPIC_API_KEY` — for Claude generation
- `QDRANT_URL` — `http://localhost:6333` for local, or Qdrant Cloud URL
- `QDRANT_API_KEY` — only needed for Qdrant Cloud
- `QDRANT_COLLECTION` — collection name, default `documents`
- `REDIS_URL` — `redis://localhost:6379/0`
- `LANGSMITH_API_KEY` — LangSmith tracing (set to any value to disable: LANGCHAIN_TRACING_V2=false)
- `LANGSMITH_PROJECT` — project name in LangSmith dashboard
- `EMBEDDING_PROVIDER` — `openai` or `cohere`

## Running tests

```bash
make test                                 # full suite with coverage
uv run pytest tests/unit/ -v              # unit tests only (no external calls)
uv run pytest tests/integration/ -v      # integration tests (requires running Qdrant + Redis)
uv run pytest -k "test_hybrid" -v        # filter by name
uv run pytest --lf                        # rerun last failures
uv run pytest --record-mode=none          # use VCR cassettes, no live API calls
```

## What not to do

- Do not hardcode chunk_size, top_k, or alpha — always read from configs/
- Do not mutate golden_set.jsonl in-place — create a new version file
- Do not edit prompt files that are already in production use — add a new version
- Do not skip LangSmith tracing in integration tests — set LANGCHAIN_TRACING_V2=false in .env.test
- Do not upsert to Qdrant without checking for existing doc hash in payload (idempotency)
- Do not change embedding dimensions without deleting and recreating the Qdrant collection
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/rag-knowledge-base"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "qdrant": {
      "command": "npx",
      "args": ["-y", "mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "${QDRANT_URL}",
        "QDRANT_API_KEY": "${QDRANT_API_KEY}",
        "COLLECTION_NAME": "${QDRANT_COLLECTION}"
      }
    },
    "redis": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-redis"],
      "env": {
        "REDIS_URL": "${REDIS_URL}"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == *.py ]]; then uv run ruff format \"$FILE\" 2>/dev/null || true; uv run ruff check --fix \"$FILE\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == configs/chunking.yaml || \"$FILE\" == configs/retrieval.yaml || \"$FILE\" == configs/embeddings.yaml ]]; then echo \"[HOOK] Config changed: $FILE — remember to re-ingest documents if chunking.yaml or embeddings.yaml was modified.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && EVAL=$(ls eval_report.json 2>/dev/null); if [ -n \"$EVAL\" ]; then FAITH=$(python3 -c \"import json; d=json.load(open(\\\"eval_report.json\\\")); print(d.get(\\\"faithfulness\\\", \\\"?\\\"))\" 2>/dev/null); echo \"[Reminder] Last RAGAS faithfulness score: $FAITH (threshold: 0.80). Run make eval to refresh.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill data-ml/rag-pipeline
npx claudient add skill data-ml/vector-db-ops
npx claudient add skill data-ml/embedding-strategy
npx claudient add skill data-ml/ragas-eval
npx claudient add skill data-ml/chunking-strategy
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/async-patterns
npx claudient add skill productivity/test-generator
npx claudient add skill productivity/security-audit
npx claudient add skill git/pr-description
```

## Related

- [RAG Pipeline Guide](../guides/rag-pipeline.md)
- [Vector Database Operations](../guides/vector-db-ops.md)
- [Document Ingestion Workflow](../workflows/document-ingestion.md)
- [RAGAS Evaluation Workflow](../workflows/ragas-evaluation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
