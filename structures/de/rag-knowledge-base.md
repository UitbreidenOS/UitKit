# RAG Knowledge Base — Projektstruktur

> Für ML-Ingenieure, die eine produktive RAG-Pipeline aufbauen und warten — Optimierung des gesamten Zyklus von der Rohentladung über den Abruf bis zur abrufverstärkten Generierung mit Evaluierungen und Nachverfolgbarkeit.

## Stack

- **Sprache:** Python 3.12+ verwaltet über `uv`
- **Orchestrierung:** LangChain 0.3+ oder LlamaIndex 0.12+ (Pipeline-Verdrahtung, Kettenkomposition)
- **Vektordatenbank:** Qdrant (selbstgehostet über Docker oder Qdrant Cloud) — Unterstützung für dichte und dünne Vektoren
- **Embeddings:** OpenAI `text-embedding-3-large` (3072-dim) oder Cohere `embed-english-v3.0` (1024-dim, Reranker enthalten)
- **LLM (Generierung):** Anthropic Claude 3.5 Sonnet über `anthropic` SDK (Prompt-Caching aktiviert)
- **Dokumentenverarbeitung:** Unstructured.io (`unstructured[all-docs]`) für PDF, DOCX, HTML, PPTX, XLSX
- **Abfrage-API:** FastAPI 0.115+ mit Pydantic v2 Schemata
- **Cache:** Redis 7 (semantischer Query-Cache, Embedding-Memoization)
- **Verfolgung + Evaluierung:** LangSmith (Verfolgung jedes Chain-Aufrufs, RAGAS-Evaluierungen auf Goldenen Datensätzen in CI)
- **Evaluierungsrahmen:** RAGAS 0.2+ (Treue, Antwortrelevanz, Kontext-Rückruf, Kontextpräzision)
- **Datenversionierung:** DVC 3.5+ (Rohdokumente, verarbeitete Chunks, Goldene Datensätze in Remote-Speicher)
- **Tests:** pytest 8+ mit pytest-asyncio, VCR-Kassetten für LLM-Aufrufe
- **Containerisierung:** Docker 25, docker-compose v2 (Qdrant + Redis + API)
- **CI/CD:** GitHub Actions (Lint → Unit-Tests → Integrationstests → RAGAS-Evaluierungs-Gate → Build)
- **Linting/Formatierung:** Ruff 0.4+, mypy 1.10+

## Verzeichnisbaum

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

## Erklärte Schlüsseldateien

| Pfad | Zweck |
|---|---|
| `src/ingestion/pipeline.py` | Orchestriert Load → Chunk → Embed → Upsert; liest Strategie aus `configs/chunking.yaml`; unterstützt inkrementelle Aufnahme (überspringt bereits indizierte Doc-Hashes in Qdrant-Payload) |
| `src/retrieval/hybrid_retriever.py` | Kombiniert Qdrant dichte ANN und sparsame BM25-Ergebnisse mit Reziproken Rang Fusion; Parameter `alpha` (0–1) kontrolliert dichte/sparsame Gewichtung, geladen aus `configs/retrieval.yaml` |
| `src/generation/llm_client.py` | Anthropic SDK-Client mit `cache_control` auf Systemprompt und abgerufenen Kontextblöcken; verfolgt `cache_creation_input_tokens` vs `cache_read_input_tokens` in LangSmith-Traces |
| `src/generation/rag_chain.py` | End-to-End RAG: ruft `QueryPipeline` auf, formatiert abgerufene Chunks in gecachten Kontext, ruft Claude auf, führt `citation_builder` aus, gibt `QueryResponse` mit Inline-Zitaten zurück |
| `configs/chunking.yaml` | Pro-Dokumenttyp-Chunking-Strategie: `chunk_size`, `chunk_overlap`, Splitter (`recursive` oder `semantic`), `min_chunk_length` zum Löschen von Rauschen; Quelle der Wahrheit für Aufnahmeparameter |
| `configs/retrieval.yaml` | `top_k` (vor Reranking), `rerank_top_n` (nach Reranking), `score_threshold`, Hybrid `alpha`, `enable_hyde` (Query-Erweiterung mit hypothetischem Doc-Embedding) |
| `data/evaluation/golden_set.jsonl` | Versionierte QA-Paare: `{question, ground_truth_answer, ground_truth_contexts}`; niemals vor Ort mutiert — neue Versionen als `golden_set_v2.jsonl` anhängen |
| `src/evaluation/ragas_runner.py` | Lädt goldenen Satz, führt vollständige RAG-Kette pro Frage aus, speist Vorhersagen an RAGAS-Metriken, schreibt `eval_report.json`; CI liest dies und schlägt fehl, wenn Treue < 0,80 |

## Schnelles Gerüst

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

## CLAUDE.md Vorlage

```markdown
# RAG Knowledge Base

Produktive RAG-Pipeline: Dokumentaufnahme → Vektorspeicherung → Hybrid-Abruf → Claude-gestützte Generierung mit Zitaten.
Stack: Python 3.12 + uv, LangChain/LlamaIndex, Qdrant, FastAPI, OpenAI Embeddings, Anthropic Claude, Unstructured.io, Redis, LangSmith, RAGAS.
Alle Pipeline-Parameter (Chunk-Größe, Abruf-Top-K, Hybrid-Alpha) befinden sich in configs/ — kodieren Sie sie nicht hart.

## Stack

- Aufnahme: Unstructured.io (`unstructured[all-docs]`) analysiert Rohdokumente → Chunker in src/ingestion/chunkers/
- Embeddings: OpenAI `text-embedding-3-large` (3072-dim) über src/ingestion/embedders/openai_embedder.py
- Vector DB: Qdrant — Sammlung `documents`, dichte + sparsame Vektoren, läuft auf Port 6333
- Abruf: Hybrid (dichte ANN + BM25 sparse) mit RRF-Fusion, dann Cohere Reranker
- Generierung: Anthropic Claude 3.5 Sonnet über src/generation/llm_client.py mit Prompt-Caching
- Cache: Redis auf Port 6379 — Embedding-Vektoren gecacht nach SHA-256(text), Query-Ergebnisse gecacht nach hash(query+params)
- Verfolgung: LangSmith — jeder Chain-Aufruf wird verfolgt; setzen Sie LANGSMITH_API_KEY + LANGSMITH_PROJECT in .env
- Evals: RAGAS — ausgeführt über `make eval`; CI schlägt fehl, wenn Treue < 0,80

## Neuen Dokumenttyp aufnehmen

1. Erstellen Sie `src/ingestion/loaders/<type>_loader.py`, das `DocumentLoader` in `loaders/base.py` erweitert
2. Implementieren Sie `load(path: str) -> list[Document]` mit Unstructured.io:
   ```python
   from unstructured.partition.<type> import partition_<type>
   elements = partition_<type>(filename=path, include_metadata=True)
   ```
3. Registrieren Sie in `src/ingestion/loaders/loader_registry.py`:
   ```python
   LOADER_REGISTRY[".ext"] = MyTypeLoader
   ```
4. Fügen Sie Chunking-Standardwerte für den neuen Typ in `configs/chunking.yaml` unter einem neuen Schlüssel hinzu, der mit der Erweiterung übereinstimmt
5. Führen Sie einen Integrationstest aus: `uv run pytest tests/integration/test_ingestion_pipeline.py -k "new_type"`

Unterstützt sofort: .pdf, .docx, .html — alle über Unstructured.io mit Tabellen- und Überschriftsbewahrung.

## Chunk-Größe/Überlappung anpassen

Parameter befinden sich in `configs/chunking.yaml`. Ändern Sie sie dort — kodieren Sie sie niemals hart in der Quelle.

Kompromisse:
- Kleinere Chunks (400–600 Token): höhere Abrufgenauigkeit, Risiko, Konttext zwischen Sätzen zu verlieren
- Größere Chunks (1000–1500 Token): mehr Kontext pro abgerufenem Chunk, geringere Genauigkeit, höhere Token-Kosten
- Überlappung (100–200 Token): verhindert Informationsverlust an Grenzen; erhöhen Sie sie, wenn Antworten abgeschnitten werden
- Semantic Chunker: Verwenden Sie dies für Konversations- oder narrative Inhalte; rekursiv funktioniert besser für strukturierte Dokumente

Nach dem Ändern der Chunking-Parameter MÜSSEN Sie alle Dokumente erneut aufnehmen — vorhandene Qdrant-Vektoren sind nicht mehr vergleichbar.
Löschen Sie die Sammlung und führen Sie erneut aus: `make ingest`

Um optimale Parameter zu finden: Erstellen Sie einen goldenen Satz, führen Sie RAGAS mit verschiedenen Konfigurationen aus, vergleichen Sie `context_recall`-Ergebnisse.

## Hybrid-Suchkonfiguration

Hybrid Alpha befindet sich in `configs/retrieval.yaml` → `hybrid_alpha` (0,0 bis 1,0).
- `alpha=1.0` — reines Dicht (semantisch, Embedding-basiert); am besten für Abfragen in natürlicher Sprache
- `alpha=0.0` — reines Sparse (BM25-Stichwort); am besten für genaue Begriffszuordnung (Produktcodes, Namen)
- `alpha=0.7` — empfohlener Standard: Semantic-Neigung mit Stichwort-Boost

So stimmen Sie Alpha empirisch ab:
```bash
# Führen Sie Evals bei verschiedenen Alpha-Werten aus und vergleichen Sie context_precision
for alpha in 0.5 0.6 0.7 0.8 0.9; do
  RETRIEVAL_ALPHA=$alpha uv run python scripts/run_evals.py --golden-set data/evaluation/golden_set.jsonl \
    --output eval_results/alpha_${alpha}.json
done
```

Sparsame Vektoren müssen zum Aufnahmezeitpunkt über das sparsame Modell von Qdrant FastEmbed generiert werden.
Wenn Sie `enable_sparse` nach der Aufnahme umgeschaltet haben, löschen Sie die Sammlung und nehmen Sie erneut auf.

## RAGAS-Evaluierungen ausführen

```bash
# Gegen aktuellen goldenen Satz ausführen
make eval

# Ausführen und JSON-Bericht schreiben
uv run python scripts/run_evals.py \
  --golden-set data/evaluation/golden_set.jsonl \
  --output eval_report.json

# Einen größeren goldenen Satz erstellen (erfordert ANTHROPIC_API_KEY)
make build-golden

# Evals mit spezifischer Abrufkonfiguration ausführen
RETRIEVAL_TOP_K=10 RERANK_TOP_N=3 uv run python scripts/run_evals.py
```

Verfölgte RAGAS-Metriken:
- `faithfulness` — werden Behauptungen in der Antwort durch abgerufenen Kontext gestützt? (CI-Schwellenwert: >=0,80)
- `answer_relevancy` — beantwortet die Antwort die Frage? (CI-Schwellenwert: >=0,75)
- `context_recall` — werden Ground-Truth-Kontexte abgerufen? (CI-Schwellenwert: >=0,70)
- `context_precision` — sind alle abgerufenen Chunks relevant? (informativ, kein Gate)

## Vorlage zur Versionierung

Eingabevorlagen befinden sich in `prompts/` als Klartext. Sie werden nach Dateiname versioniert: `rag_system_v1.txt`, `rag_system_v2.txt`.
`configs/generation.yaml` → `prompt_version` kontrolliert, welche Version durch `src/generation/prompt_loader.py` geladen wird.

Regeln:
- Bearbeiten Sie eine Eingabevorlagendatei nach der Verwendung in der Produktion nicht neu — erstellen Sie eine neue Version
- Schließen Sie die Prompt-Version in LangSmith-Trace-Metadaten ein, damit Evals an den Prompt gebunden sind, der sie generiert hat
- Führen Sie bei Änderung der Prompt-Versionen RAGAS-Evals für beide Versionen aus, bevor Sie die Produktionskonfiguration wechseln
- Prompt-Caching (Anthropic cache_control) wird auf den Systemprompt-Block angewendet — das Ändern des Systemprompts invalidiert den Cache; Bevorzugen Sie die Bearbeitung von User-Turn-Anweisungen zum Abstimmen

## Claude Prompt Caching

`src/generation/llm_client.py` wendet `cache_control: {"type": "ephemeral"}` auf:
1. Den Systemprompt-Block (geladen aus `prompts/rag_system_v{n}.txt`)
2. Den abgerufenen Kontextblock (Chunks als einzelne Zeichenfolge formatiert)

Cache-TTL: 5 Minuten (Anthropic Standard). Cache-Treffer sparen ~80% der Input-Token-Kosten.
Überprüfen Sie die Cache-Effizienz in LangSmith: Suchen Sie nach `cache_read_input_tokens` in Trace-Metadaten.
Wenn cache_read_input_tokens / total_input_tokens < 0,5 bei wiederholten Abfragen, kann die Kontext-Reihenfolge nicht deterministisch sein — sortieren Sie Chunks nach Score vor der Formatierung.

## Umgebungsvariablen

Alle erforderlichen Variablen befinden sich in `.env.example`. Kritische:
- `OPENAI_API_KEY` — für OpenAI-Embeddings (text-embedding-3-large)
- `COHERE_API_KEY` — für Cohere-Reranker (rerank-english-v3.0)
- `ANTHROPIC_API_KEY` — für Claude-Generierung
- `QDRANT_URL` — `http://localhost:6333` für lokal oder Qdrant Cloud-URL
- `QDRANT_API_KEY` — nur für Qdrant Cloud erforderlich
- `QDRANT_COLLECTION` — Sammlungsname, Standard `documents`
- `REDIS_URL` — `redis://localhost:6379/0`
- `LANGSMITH_API_KEY` — LangSmith-Verfolgung (auf einen beliebigen Wert setzen, um zu deaktivieren: LANGCHAIN_TRACING_V2=false)
- `LANGSMITH_PROJECT` — Projektname im LangSmith-Dashboard
- `EMBEDDING_PROVIDER` — `openai` oder `cohere`

## Tests ausführen

```bash
make test                                 # full suite with coverage
uv run pytest tests/unit/ -v              # unit tests only (no external calls)
uv run pytest tests/integration/ -v      # integration tests (requires running Qdrant + Redis)
uv run pytest -k "test_hybrid" -v        # filter by name
uv run pytest --lf                        # rerun last failures
uv run pytest --record-mode=none          # use VCR cassettes, no live API calls
```

## Was nicht zu tun ist

- Kodieren Sie nicht hart chunk_size, top_k oder Alpha — lesen Sie immer aus configs/
- Mutieren Sie nicht golden_set.jsonl vor Ort — erstellen Sie eine neue Versionsdatei
- Bearbeiten Sie nicht Eingabevorlagendateien, die bereits in der Produktion verwendet werden — fügen Sie eine neue Version hinzu
- Überspringen Sie nicht LangSmith-Verfolgung in Integrationstests — setzen Sie LANGCHAIN_TRACING_V2=false in .env.test
- Führen Sie keinen Upsert zu Qdrant durch, ohne auf vorhandenen Doc-Hash in Payload zu prüfen (Idempotenz)
- Ändern Sie nicht die Embedding-Dimensionen, ohne die Qdrant-Sammlung zu löschen und neu zu erstellen
```

## MCP Server

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

## Empfohlene Hooks

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

## Zu installierende Kompetenzen

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

## Verwandt

- [RAG Pipeline Guide](../guides/rag-pipeline.md)
- [Vector Database Operations](../guides/vector-db-ops.md)
- [Document Ingestion Workflow](../workflows/document-ingestion.md)
- [RAGAS Evaluation Workflow](../workflows/ragas-evaluation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
