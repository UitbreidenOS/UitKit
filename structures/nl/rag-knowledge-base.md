# RAG Knowledge Base — Projectstructuur

> Voor ML-engineers die een productie-RAG-pijplijn bouwen en onderhouden — optimaliseer de volledige cyclus van ruwe documentopname tot retrieval-augmented generation met evaluaties en traceerbaarheid.

## Stack

- **Taal:** Python 3.12+ beheerd via `uv`
- **Orchestratie:** LangChain 0.3+ of LlamaIndex 0.12+ (pijplijnbewaking, kettingsamenstelling)
- **Vectordatabase:** Qdrant (zelf-gehost via Docker of Qdrant Cloud) — ondersteuning voor dichte + schaarse vectoren
- **Embeddings:** OpenAI `text-embedding-3-large` (3072-dim) of Cohere `embed-english-v3.0` (1024-dim, reranker inbegrepen)
- **LLM (generatie):** Anthropic Claude 3.5 Sonnet via `anthropic` SDK (prompt caching ingeschakeld)
- **Documentparsing:** Unstructured.io (`unstructured[all-docs]`) voor PDF, DOCX, HTML, PPTX, XLSX
- **Query API:** FastAPI 0.115+ met Pydantic v2 schema's
- **Cache:** Redis 7 (semantische cache op queryniveau, embedding-memoisatie)
- **Tracing + eval:** LangSmith (trace elke kettingoproep, voer RAGAS golden-set evaluaties uit in CI)
- **Eval-framework:** RAGAS 0.2+ (getrouwheid, antwoordrelevantie, contextherinnering, contextprecisie)
- **Gegevensversiebeheer:** DVC 3.5+ (ruwe documenten, verwerkte chunks, golden sets bijgehouden in externe opslag)
- **Testen:** pytest 8+ met pytest-asyncio, VCR-cassettes voor LLM-aanroepen
- **Containerisatie:** Docker 25, docker-compose v2 (Qdrant + Redis + API)
- **CI/CD:** GitHub Actions (lint → unittests → integratietests → RAGAS eval-gate → build)
- **Linting/opmaak:** Ruff 0.4+, mypy 1.10+

## Boomstructuur van mappen

```
rag-knowledge-base/
├── .github/
│   └── workflows/
│       ├── ci.yml                                  # ruff, mypy, pytest, RAGAS eval gate op PR
│       ├── ingest.yml                              # Handmatig/geplande DVC-pull + re-opname
│       └── cd-production.yml                       # Build + implementeer API op versie-tag push
├── .dvc/
│   ├── config                                      # DVC remote: S3/GCS bucket voor ruwe docs + chunks
│   └── .gitignore
├── configs/
│   ├── chunking.yaml                               # chunk_size, chunk_overlap, splitter strategie per doctype
│   ├── retrieval.yaml                              # top_k, score_threshold, hybrid alpha (dichte/schaarse mix)
│   ├── embeddings.yaml                             # provider, model, batch_size, retry config
│   └── generation.yaml                             # model, max_tokens, temperature, prompt_version
├── data/
│   ├── raw/                                        # Brondocumenten (DVC-bijgehouden, niet gecommit)
│   │   ├── pdfs/                                   # PDF-bronbestanden
│   │   ├── docx/                                   # Word-documenten
│   │   └── html/                                   # Web-geschrapte HTML-bestanden
│   ├── processed/                                  # Geparst + chunked output (DVC-bijgehouden)
│   │   ├── chunks/                                 # JSONL-bestanden: {id, text, metadata, source_doc}
│   │   └── embeddings/                             # Cached embedding vectors (numpy .npy of parquet)
│   └── evaluation/
│       ├── golden_set.jsonl                        # Ground-truth QA-paren voor RAGAS-evaluatie
│       └── golden_set_v2.jsonl                     # Versie golden sets — nooit overschrijven, alleen toevoegen
├── docker/
│   ├── Dockerfile                                  # Multi-stage: builder (uv install) → runtime (niet-root)
│   └── docker-compose.yml                          # Qdrant + Redis + API service met healthchecks
├── prompts/
│   ├── rag_system_v1.txt                           # Systeemprompt v1: rol, citatieformat, weigerings-regels
│   ├── rag_system_v2.txt                           # Systeemprompt v2: bijgewerkt met gestructureerde output
│   └── query_rewrite.txt                           # Prompt voor HyDE / query-expansiestap
├── src/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                                 # FastAPI app factory, lifespan, router registration
│   │   ├── deps.py                                 # Gedeelde dependencies: get_retriever, get_llm_client
│   │   ├── schemas.py                              # QueryRequest, QueryResponse, CitedSource, HealthResponse
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── query.py                            # POST /query — volledige RAG-pijplijn eindpunt
│   │       ├── ingest.py                           # POST /ingest — trigger document opname-taak
│   │       └── health.py                           # GET /health, GET /health/qdrant, GET /health/redis
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── loaders/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # DocumentLoader abstracte basis met load() -> list[Document]
│   │   │   ├── pdf_loader.py                       # Unstructured.io PDF-parser met tabel/afbeeldingen-afhandeling
│   │   │   ├── docx_loader.py                      # Unstructured.io DOCX-parser, koppelingshiërarchie behouden
│   │   │   ├── html_loader.py                      # BeautifulSoup + Unstructured.io voor webinhoud
│   │   │   └── loader_registry.py                  # Extensie → loader-toewijzing, get_loader(path) factory
│   │   ├── chunkers/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # TextChunker abstracte basis met chunk() -> list[Chunk]
│   │   │   ├── recursive_chunker.py                # LangChain RecursiveCharacterTextSplitter wrapper
│   │   │   ├── semantic_chunker.py                 # Embedding-gebaseerde zinsgrensdetectie
│   │   │   └── chunker_factory.py                  # Geeft chunker terug uit configs/chunking.yaml strategie-sleutel
│   │   ├── embedders/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # Embedder abstracte basis met embed_batch() -> list[list[float]]
│   │   │   ├── openai_embedder.py                  # OpenAI text-embedding-3-large, batch-verwerkt, retry
│   │   │   ├── cohere_embedder.py                  # Cohere embed-english-v3.0, input_type=search_document
│   │   │   └── cached_embedder.py                  # Redis-backed wrapper: SHA-256(text) → cached vector
│   │   └── pipeline.py                             # IngestionPipeline: load → chunk → embed → upsert naar Qdrant
│   ├── retrieval/
│   │   ├── __init__.py
│   │   ├── qdrant_client.py                        # Qdrant async client factory, collection init, upsert helpers
│   │   ├── dense_retriever.py                      # Cosine ANN-zoeken, top_k, score_threshold filter
│   │   ├── sparse_retriever.py                     # BM25 schaarse vectoren (Qdrant sparse vector support)
│   │   ├── hybrid_retriever.py                     # RRF-fusie van dichte + schaarse resultaten, alpha-tuning
│   │   ├── reranker.py                             # Cohere rerank-english-v3.0 of cross-encoder reranker
│   │   └── query_pipeline.py                       # QueryPipeline: expand → retrieve → rerank → return chunks
│   ├── generation/
│   │   ├── __init__.py
│   │   ├── llm_client.py                           # Anthropic SDK client met prompt caching (cache_control)
│   │   ├── prompt_loader.py                        # Laadt promptsjablonen uit prompts/ op versie-tag
│   │   ├── citation_builder.py                     # Bouwt [1], [2] inline-citaten uit opgehaalde chunks
│   │   └── rag_chain.py                            # Volledige RAG-keten: query_pipeline + llm_client + citations
│   └── evaluation/
│       ├── __init__.py
│       ├── ragas_runner.py                         # Voert RAGAS-metrieken uit over golden_set.jsonl, voert JSON-rapport uit
│       ├── metrics.py                              # faithfulness, answer_relevancy, context_recall wrappers
│       └── golden_set_builder.py                   # CLI-tool om golden_set.jsonl te genereren/uit te breiden via LLM
├── tests/
│   ├── conftest.py                                 # Pytest fixtures: mock Qdrant, mock embedder, mock LLM
│   ├── cassettes/                                  # VCR cassettes voor opgenomen LLM/embedding API-aanroepen
│   ├── unit/
│   │   ├── test_pdf_loader.py                      # Unstructured.io parser output, tabel extractie
│   │   ├── test_recursive_chunker.py               # Chunk size/overlap grensvoorwaarden
│   │   ├── test_semantic_chunker.py                # Zinsgrensdetectie op randgevallen
│   │   ├── test_hybrid_retriever.py                # RRF fusie-logica, alpha=0 (alleen dicht), alpha=1 (alleen schaars)
│   │   ├── test_citation_builder.py                # Citatieindex-toewijzing, deduplicatie
│   │   └── test_cached_embedder.py                 # Cache hit/miss, Redis-sleutelformat
│   └── integration/
│       ├── test_ingestion_pipeline.py              # End-to-end: load PDF → chunk → embed → Qdrant upsert
│       ├── test_query_pipeline.py                  # End-to-end: query → retrieve → rerank → top chunks
│       ├── test_rag_chain.py                       # Volledige keten met gemokte Claude-respons, citaatcontrole
│       └── test_api_query.py                       # POST /query via httpx AsyncClient, schema validatie
├── scripts/
│   ├── ingest_docs.py                              # CLI: python scripts/ingest_docs.py --source data/raw/pdfs/
│   ├── build_golden_set.py                         # CLI: genereer N QA-paren uit chunks met Claude
│   ├── run_evals.py                                # CLI: voer RAGAS uit, druk rapport af, exit 1 als onder drempel
│   └── migrate_collection.py                       # Qdrant collection-migratie: recreeer met nieuwe vector-dimensies
├── pyproject.toml                                  # Alle deps, ruff config, mypy config, pytest config
├── .env.example                                    # Alle env vars met beschrijvingen, geen echte waarden
├── .env.test                                       # Test env: mock endpoints, geen echte API keys nodig
├── dvc.yaml                                        # DVC pijplijn-fasen: load → chunk → embed → index
├── dvc.lock                                        # Vergrendelde DVC-stagehashes (gecommit)
├── Makefile                                        # Doelen: dev, ingest, test, eval, lint, build
└── README.md                                       # Setup, architectuuroverzicht, eval-resultatentabel
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `src/ingestion/pipeline.py` | Orkestreert load → chunk → embed → upsert; leest strategie uit `configs/chunking.yaml`; ondersteunt incrementele opname (slaat al geïndexeerde doc-hashes in Qdrant-payload over) |
| `src/retrieval/hybrid_retriever.py` | Combineert Qdrant dichte ANN en schaarse BM25-resultaten met Reciprocal Rank Fusion; `alpha` param (0–1) bepaalt dichte/schaarse gewicht, geladen uit `configs/retrieval.yaml` |
| `src/generation/llm_client.py` | Anthropic SDK client met `cache_control` op systeemprompt en opgehaalde contextblokken; traceert `cache_creation_input_tokens` vs `cache_read_input_tokens` in LangSmith-traces |
| `src/generation/rag_chain.py` | End-to-end RAG: roept `QueryPipeline` aan, formatteert opgehaalde chunks in gecachede context, roept Claude aan, voert `citation_builder` uit, geeft `QueryResponse` terug met inline-citaten |
| `configs/chunking.yaml` | Per-doctype chunking strategie: `chunk_size`, `chunk_overlap`, splitter (`recursive` of `semantic`), `min_chunk_length` om ruis te verwijderen; bron van waarheid voor opnamen-params |
| `configs/retrieval.yaml` | `top_k` (pre-rerank), `rerank_top_n` (post-rerank), `score_threshold`, hybride `alpha`, `enable_hyde` (query-expansie met hypothetische doc-embedding) |
| `data/evaluation/golden_set.jsonl` | Versie QA-paren: `{question, ground_truth_answer, ground_truth_contexts}`; nooit ter plekke gemuteerd — voeg nieuwe versies toe als `golden_set_v2.jsonl` |
| `src/evaluation/ragas_runner.py` | Laadt golden set, voert volledige RAG-keten uit per vraag, voert voorspellingen aan RAGAS-metrieken toe, schrijft `eval_report.json`; CI leest dit en mislukt als getrouwheid < 0.80 |

## Snelle steiger

```bash
# Vereisten: Python 3.12+, Docker, uv (pip install uv), DVC (pip install dvc[s3])
PROJECT=rag-knowledge-base
mkdir -p $PROJECT && cd $PROJECT

# Python-projectinitialisatie
uv init --python 3.12

# Kernafhankelijkheden
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

# Mappenstructuur
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

# Raak alle bronbestanden aan
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

# Standaardconfigs
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

# Installeer Claudient-vaardigheden
npx claudient add skill data-ml/rag-pipeline
npx claudient add skill data-ml/vector-db-ops
npx claudient add skill data-ml/embedding-strategy
npx claudient add skill data-ml/ragas-eval
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/async-patterns
npx claudient add skill productivity/test-generator

echo "RAG knowledge base steiger compleet. Volgende: cp .env.example .env && make dev"
```

## CLAUDE.md-sjabloon

```markdown
# RAG Knowledge Base

Productie-RAG-pijplijn: documentopname → vectoropslag → hybride ophaling → Claude-aangedreven generatie met citaten.
Stack: Python 3.12 + uv, LangChain/LlamaIndex, Qdrant, FastAPI, OpenAI Embeddings, Anthropic Claude, Unstructured.io, Redis, LangSmith, RAGAS.
Alle pijplijnparameters (chunk size, retrieval top_k, hybrid alpha) bevinden zich in configs/ — hardcoded ze niet.

## Stack

- Opname: Unstructured.io (`unstructured[all-docs]`) parseert ruwe docs → chunkers in src/ingestion/chunkers/
- Embeddings: OpenAI `text-embedding-3-large` (3072-dim) via src/ingestion/embedders/openai_embedder.py
- Vector DB: Qdrant — collection `documents`, dichte + schaarse vectoren, draait op poort 6333
- Ophaling: Hybride (dichte ANN + BM25 schaars) met RRF fusie, dan Cohere reranker
- Generatie: Anthropic Claude 3.5 Sonnet via src/generation/llm_client.py met prompt caching
- Cache: Redis op poort 6379 — embedding vectors gecachet op SHA-256(text), queryresultaten gecachet op hash(query+params)
- Tracing: LangSmith — elke kettingoproep getraceerd; stel LANGSMITH_API_KEY + LANGSMITH_PROJECT in in .env
- Evals: RAGAS — voer uit via `make eval`; CI mislukt als getrouwheid < 0.80

## Een nieuw documenttype opnemen

1. Maak `src/ingestion/loaders/<type>_loader.py` aanvullend `DocumentLoader` in `loaders/base.py`
2. Implementeer `load(path: str) -> list[Document]` met Unstructured.io:
   ```python
   from unstructured.partition.<type> import partition_<type>
   elements = partition_<type>(filename=path, include_metadata=True)
   ```
3. Registreer in `src/ingestion/loaders/loader_registry.py`:
   ```python
   LOADER_REGISTRY[".ext"] = MyTypeLoader
   ```
4. Voeg chunking-standaardinstellingen voor het nieuwe type toe in `configs/chunking.yaml` onder een nieuwe sleutel die overeenkomt met de extensie
5. Voer integratietest uit: `uv run pytest tests/integration/test_ingestion_pipeline.py -k "new_type"`

Ondersteund out of the box: .pdf, .docx, .html — allemaal via Unstructured.io met tabel- en kopelingsbehoud.

## Chunk size / overlap aanpassen

Parameters bevinden zich in `configs/chunking.yaml`. Verander ze daar — hardcoded ze nooit in bron.

Afwegingen:
- Kleinere chunks (400–600 tokens): hogere ophaal-precisie, risico van verlies van context over zinnen heen
- Grotere chunks (1000–1500 tokens): meer context per opgehaalde chunk, lagere precisie, hoger token-kostencijfer
- Overlap (100–200 tokens): verhindert informatieverlies aan grenzen; verhoog als antwoorden worden afgekapt
- Semantische chunker: gebruik voor conversationele of narratieve inhoud; recursief werkt beter voor gestructureerde docs

Na het veranderen van chunking-params MOET je alle documenten opnieuw opnemen — bestaande Qdrant-vectoren zijn niet meer vergelijkbaar.
Verwijder de collection en voer opnieuw uit: `make ingest`

Om optimale params te vinden: bouw een golden set, voer RAGAS uit met verschillende configs, vergelijk `context_recall`-scores.

## Hybride zoekconfiguratie

Hybride alpha bevindt zich in `configs/retrieval.yaml` → `hybrid_alpha` (0.0 tot 1.0).
- `alpha=1.0` — puur dicht (semantisch, op embedding gebaseerd); best voor natuurlijke taalquery's
- `alpha=0.0` — puur schaars (BM25 trefwoord); best voor exact overeenkomende termen (productcodes, namen)
- `alpha=0.7` — aanbevolen standaard: semantisch-leunend met sleutelwoordboost

Alpha empirisch afstemmen:
```bash
# Voer evals uit bij verschillende alpha-waarden en vergelijk context_precision
for alpha in 0.5 0.6 0.7 0.8 0.9; do
  RETRIEVAL_ALPHA=$alpha uv run python scripts/run_evals.py --golden-set data/evaluation/golden_set.jsonl \
    --output eval_results/alpha_${alpha}.json
done
```

Schaarse vectoren moeten tijdens opname worden gegenereerd via Qdrant's FastEmbed sparse model.
Als je `enable_sparse` na opname hebt omgeschakeld, verwijder dan de collection en voer opnieuw in.

## RAGAS-evaluaties uitvoeren

```bash
# Voer uit tegen huidige golden set
make eval

# Voer uit en schrijf JSON-rapport
uv run python scripts/run_evals.py \
  --golden-set data/evaluation/golden_set.jsonl \
  --output eval_report.json

# Bouw een grotere golden set (vereist ANTHROPIC_API_KEY)
make build-golden

# Voer evals uit met een specifieke ophaalconfig
RETRIEVAL_TOP_K=10 RERANK_TOP_N=3 uv run python scripts/run_evals.py
```

RAGAS-metrieken bijgehouden:
- `faithfulness` — worden claims in het antwoord ondersteund door opgehaalde context? (CI-drempel: >=0.80)
- `answer_relevancy` — beantwoordt het antwoord de vraag? (CI-drempel: >=0.75)
- `context_recall` — worden ground-truth contexten opgehaald? (CI-drempel: >=0.70)
- `context_precision` — zijn opgehaalde chunks allemaal relevant? (informatief, geen gate)

## Promptsjabloon versiebeheer

Promptbestanden bevinden zich in `prompts/` als platte tekst. Ze zijn versiebeheerd op bestandsnaam: `rag_system_v1.txt`, `rag_system_v2.txt`.
`configs/generation.yaml` → `prompt_version` bepaalt welke versie wordt geladen door `src/generation/prompt_loader.py`.

Regels:
- Bewerk een promptbestand nooit ter plekke nadat het in productie is gebruikt — maak een nieuwe versie
- Voeg de promptversie toe aan LangSmith trace-metagegevens zodat evals zijn gekoppeld aan de prompt die deze heeft gegenereerd
- Wanneer u promptversies verandert, voert u RAGAS-evals uit op beide versies voordat u de productieconfiguratie wijzigt
- Promptcaching (Anthropic cache_control) wordt toegepast op het systeempromptblok — het veranderen van de systeemprompt ongeldig maakt de cache; voorkeur voor het bewerken van gebruiker-turn-instructies voor afstemming

## Claude-promptcaching

`src/generation/llm_client.py` past `cache_control: {"type": "ephemeral"}` toe op:
1. Het systeempromptblok (geladen uit `prompts/rag_system_v{n}.txt`)
2. Het opgehaalde contextblok (chunks opgemaakt als een enkele tekenreeks)

Cache-TTL: 5 minuten (Anthropic standaard). Cache-hits sparen ongeveer 80% van de invoertokenkosten.
Controleer cache-efficiëntie in LangSmith: zoek naar `cache_read_input_tokens` in trace-metagegevens.
Als cache_read_input_tokens / total_input_tokens < 0.5 op herhaalde query's, kan contextordering niet-deterministisch zijn — sorteer chunks op score vóór opmaak.

## Omgevingsvariabelen

Alle vereiste vars bevinden zich in `.env.example`. Kritieke:
- `OPENAI_API_KEY` — voor OpenAI embeddings (text-embedding-3-large)
- `COHERE_API_KEY` — voor Cohere reranker (rerank-english-v3.0)
- `ANTHROPIC_API_KEY` — voor Claude-generatie
- `QDRANT_URL` — `http://localhost:6333` voor lokaal, of Qdrant Cloud-URL
- `QDRANT_API_KEY` — alleen nodig voor Qdrant Cloud
- `QDRANT_COLLECTION` — collectienaam, standaard `documents`
- `REDIS_URL` — `redis://localhost:6379/0`
- `LANGSMITH_API_KEY` — LangSmith tracing (stel in op een willekeurige waarde om uit te schakelen: LANGCHAIN_TRACING_V2=false)
- `LANGSMITH_PROJECT` — projectnaam in LangSmith-dashboard
- `EMBEDDING_PROVIDER` — `openai` of `cohere`

## Tests uitvoeren

```bash
make test                                 # volledige suite met coverage
uv run pytest tests/unit/ -v              # unit tests alleen (geen externe aanroepen)
uv run pytest tests/integration/ -v      # integratietests (vereist draaiende Qdrant + Redis)
uv run pytest -k "test_hybrid" -v        # filter op naam
uv run pytest --lf                        # voer laatste mislukkingen opnieuw uit
uv run pytest --record-mode=none          # gebruik VCR cassettes, geen live API-aanroepen
```

## Wat niet te doen

- Hardcoded chunk_size, top_k, of alpha niet — lees altijd uit configs/
- Muteer golden_set.jsonl ter plekke niet — maak een nieuw versiebestand
- Bewerk promptbestanden die al in productie worden gebruikt niet — voeg een nieuwe versie toe
- Sla LangSmith-tracing in integratietests niet over — stel LANGCHAIN_TRACING_V2=false in in .env.test
- Voer niet in Qdrant in zonder bestaande doc-hash in payload te controleren (idempotentie)
- Wijzig embeddingdimensies niet zonder de Qdrant-collection te verwijderen en opnieuw aan te maken
```

## MCP-servers

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

## Aanbevolen hooks

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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == configs/chunking.yaml || \"$FILE\" == configs/retrieval.yaml || \"$FILE\" == configs/embeddings.yaml ]]; then echo \"[HOOK] Config changed: $FILE — herinnering: documenteren opnieuw opnemen als chunking.yaml of embeddings.yaml is gewijzigd.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && EVAL=$(ls eval_report.json 2>/dev/null); if [ -n \"$EVAL\" ]; then FAITH=$(python3 -c \"import json; d=json.load(open(\\\"eval_report.json\\\")); print(d.get(\\\"faithfulness\\\", \\\"?\\\"))\" 2>/dev/null); echo \"[Herinnering] Laatste RAGAS-getrouwheid-score: $FAITH (drempel: 0.80). Voer make eval uit om te vernieuwen.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

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

## Gerelateerd

- [RAG Pipeline Guide](../guides/rag-pipeline.md)
- [Vector Database Operations](../guides/vector-db-ops.md)
- [Document Ingestion Workflow](../workflows/document-ingestion.md)
- [RAGAS Evaluation Workflow](../workflows/ragas-evaluation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
