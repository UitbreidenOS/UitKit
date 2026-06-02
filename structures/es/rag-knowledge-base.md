# Base de Conocimiento RAG — Estructura del Proyecto

> Para ingenieros de ML que construyen y mantienen un pipeline RAG de producción — optimizando el ciclo completo desde la ingesta de documentos sin procesar hasta la generación aumentada por recuperación con evaluaciones y trazabilidad.

## Stack

- **Lenguaje:** Python 3.12+ gestionado via `uv`
- **Orquestación:** LangChain 0.3+ o LlamaIndex 0.12+ (cableado de pipeline, composición de cadenas)
- **Base de datos vectorial:** Qdrant (autohospedado via Docker o Qdrant Cloud) — soporte de vectores densos + dispersos
- **Embeddings:** OpenAI `text-embedding-3-large` (3072-dim) o Cohere `embed-english-v3.0` (1024-dim, reranqueador incluido)
- **LLM (generación):** Anthropic Claude 3.5 Sonnet via SDK `anthropic` (caché de prompts habilitado)
- **Análisis de documentos:** Unstructured.io (`unstructured[all-docs]`) para PDF, DOCX, HTML, PPTX, XLSX
- **API de consultas:** FastAPI 0.115+ con esquemas Pydantic v2
- **Caché:** Redis 7 (caché semántica a nivel de consulta, memoización de embeddings)
- **Trazas + eval:** LangSmith (rastrear cada llamada de cadena, ejecutar evaluaciones RAGAS de conjunto dorado en CI)
- **Marco de evaluación:** RAGAS 0.2+ (fidelidad, relevancia de respuesta, recuperación de contexto, precisión de contexto)
- **Versionado de datos:** DVC 3.5+ (documentos sin procesar, chunks procesados, conjuntos dorados rastreados en almacenamiento remoto)
- **Pruebas:** pytest 8+ con pytest-asyncio, cassettes VCR para llamadas LLM
- **Containerización:** Docker 25, docker-compose v2 (Qdrant + Redis + API)
- **CI/CD:** GitHub Actions (lint → pruebas unitarias → pruebas de integración → compuerta de eval RAGAS → compilación)
- **Linting/formateo:** Ruff 0.4+, mypy 1.10+

## Árbol de directorios

```
rag-knowledge-base/
├── .github/
│   └── workflows/
│       ├── ci.yml                                  # ruff, mypy, pytest, compuerta de eval RAGAS en PR
│       ├── ingest.yml                              # Pull de DVC manual/programado + re-ingesta
│       └── cd-production.yml                       # Compilación + despliegue de API en push de etiqueta de versión
├── .dvc/
│   ├── config                                      # DVC remoto: bucket S3/GCS para documentos sin procesar + chunks
│   └── .gitignore
├── configs/
│   ├── chunking.yaml                               # chunk_size, chunk_overlap, estrategia de divisor por tipo de doc
│   ├── retrieval.yaml                              # top_k, score_threshold, alpha híbrido (mezcla denso/disperso)
│   ├── embeddings.yaml                             # proveedor, modelo, batch_size, configuración de reintentos
│   └── generation.yaml                             # modelo, max_tokens, temperature, versión de prompt
├── data/
│   ├── raw/                                        # Documentos fuente (rastreados por DVC, no comprometidos)
│   │   ├── pdfs/                                   # Archivos PDF de fuente
│   │   ├── docx/                                   # Documentos de Word
│   │   └── html/                                   # Archivos HTML raspados de la web
│   ├── processed/                                  # Salida analizada + dividida en chunks (rastreada por DVC)
│   │   ├── chunks/                                 # Archivos JSONL: {id, text, metadata, source_doc}
│   │   └── embeddings/                             # Vectores de embeddings en caché (numpy .npy o parquet)
│   └── evaluation/
│       ├── golden_set.jsonl                        # Pares QA de verdad fundamental para evaluación RAGAS
│       └── golden_set_v2.jsonl                     # Conjuntos dorados versionados — nunca sobrescribir, solo añadir
├── docker/
│   ├── Dockerfile                                  # Multi-etapa: compilador (uv install) → tiempo de ejecución (sin root)
│   └── docker-compose.yml                          # Servicio Qdrant + Redis + API con healthchecks
├── prompts/
│   ├── rag_system_v1.txt                           # Prompt del sistema v1: rol, formato de cita, reglas de rechazo
│   ├── rag_system_v2.txt                           # Prompt del sistema v2: actualizado con salida estructurada
│   └── query_rewrite.txt                           # Prompt para paso de expansión de consulta HyDE / reescritura
├── src/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                                 # Fábrica de aplicación FastAPI, lifespan, registro de router
│   │   ├── deps.py                                 # Dependencias compartidas: get_retriever, get_llm_client
│   │   ├── schemas.py                              # QueryRequest, QueryResponse, CitedSource, HealthResponse
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── query.py                            # POST /query — punto final del pipeline RAG completo
│   │       ├── ingest.py                           # POST /ingest — desencadenar trabajo de ingesta de documentos
│   │       └── health.py                           # GET /health, GET /health/qdrant, GET /health/redis
│   ├── ingestion/
│   │   ├── __init__.py
│   │   ├── loaders/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # Base abstracta DocumentLoader con load() -> list[Document]
│   │   │   ├── pdf_loader.py                       # Analizador PDF Unstructured.io con manejo de tabla/imagen
│   │   │   ├── docx_loader.py                      # Analizador DOCX Unstructured.io, jerarquía de encabezados preservada
│   │   │   ├── html_loader.py                      # BeautifulSoup + Unstructured.io para contenido web
│   │   │   └── loader_registry.py                  # Extensión → mapeo de cargador, fábrica get_loader(path)
│   │   ├── chunkers/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # Base abstracta TextChunker con chunk() -> list[Chunk]
│   │   │   ├── recursive_chunker.py                # Envoltura RecursiveCharacterTextSplitter de LangChain
│   │   │   ├── semantic_chunker.py                 # Detección de límites de oración basada en embeddings
│   │   │   └── chunker_factory.py                  # Devuelve chunker de clave de estrategia configs/chunking.yaml
│   │   ├── embedders/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                             # Base abstracta Embedder con embed_batch() -> list[list[float]]
│   │   │   ├── openai_embedder.py                  # OpenAI text-embedding-3-large, por lotes, reintentado
│   │   │   ├── cohere_embedder.py                  # Cohere embed-english-v3.0, input_type=search_document
│   │   │   └── cached_embedder.py                  # Envoltura respaldada por Redis: SHA-256(text) → vector en caché
│   │   └── pipeline.py                             # IngestionPipeline: cargar → dividir → incrustar → upsert a Qdrant
│   ├── retrieval/
│   │   ├── __init__.py
│   │   ├── qdrant_client.py                        # Fábrica de cliente async de Qdrant, init de colección, ayudantes upsert
│   │   ├── dense_retriever.py                      # Búsqueda ANN de coseno, top_k, filtro score_threshold
│   │   ├── sparse_retriever.py                     # Vectores dispersos BM25 (soporte de vectores dispersos de Qdrant)
│   │   ├── hybrid_retriever.py                     # Fusión RRF de resultados densos + dispersos, sintonización de alpha
│   │   ├── reranker.py                             # Reranqueador Cohere rerank-english-v3.0 o cross-encoder
│   │   └── query_pipeline.py                       # QueryPipeline: expandir → recuperar → rerangular → devolver chunks
│   ├── generation/
│   │   ├── __init__.py
│   │   ├── llm_client.py                           # Cliente SDK Anthropic con caché de prompts (cache_control)
│   │   ├── prompt_loader.py                        # Carga plantillas de prompts desde prompts/ por etiqueta de versión
│   │   ├── citation_builder.py                     # Construye citas en línea [1], [2] desde chunks recuperados
│   │   └── rag_chain.py                            # Cadena RAG completa: query_pipeline + llm_client + citas
│   └── evaluation/
│       ├── __init__.py
│       ├── ragas_runner.py                         # Ejecuta métricas RAGAS sobre golden_set.jsonl, genera informe JSON
│       ├── metrics.py                              # Envolturas de fidelidad, relevancia_respuesta, recuperación_contexto
│       └── golden_set_builder.py                   # Herramienta CLI para generar/extender golden_set.jsonl via LLM
├── tests/
│   ├── conftest.py                                 # Accesorios de Pytest: mock Qdrant, mock embedder, mock LLM
│   ├── cassettes/                                  # Cassettes VCR para llamadas API LLM/embedding registradas
│   ├── unit/
│   │   ├── test_pdf_loader.py                      # Salida del analizador Unstructured.io, extracción de tabla
│   │   ├── test_recursive_chunker.py               # Condiciones límite de tamaño/superposición de chunk
│   │   ├── test_semantic_chunker.py                # Detección de límites de oración en casos extremos
│   │   ├── test_hybrid_retriever.py                # Lógica de fusión RRF, alpha=0 (solo denso), alpha=1 (solo disperso)
│   │   ├── test_citation_builder.py                # Asignación de índice de cita, deduplicación
│   │   └── test_cached_embedder.py                 # Acierto/fallo en caché, formato de clave de Redis
│   └── integration/
│       ├── test_ingestion_pipeline.py              # De extremo a extremo: cargar PDF → dividir → incrustar → upsert de Qdrant
│       ├── test_query_pipeline.py                  # De extremo a extremo: consultar → recuperar → rerangular → chunks principales
│       ├── test_rag_chain.py                       # Cadena completa con respuesta Claude simulada, verificación de cita
│       └── test_api_query.py                       # POST /query via httpx AsyncClient, validación de esquema
├── scripts/
│   ├── ingest_docs.py                              # CLI: python scripts/ingest_docs.py --source data/raw/pdfs/
│   ├── build_golden_set.py                         # CLI: generar N pares QA desde chunks usando Claude
│   ├── run_evals.py                                # CLI: ejecutar RAGAS, imprimir informe, exit 1 si está por debajo del umbral
│   └── migrate_collection.py                       # Migración de colección de Qdrant: recrear con nuevas dimensiones de vector
├── pyproject.toml                                  # Todas las deps, configuración de ruff, configuración de mypy, configuración de pytest
├── .env.example                                    # Todas las variables de entorno con descripciones, sin valores reales
├── .env.test                                       # Env de prueba: puntos finales simulados, sin claves API reales necesarias
├── dvc.yaml                                        # Etapas de pipeline de DVC: cargar → dividir → incrustar → indexar
├── dvc.lock                                        # Hashes de etapa DVC bloqueados (comprometidos)
├── Makefile                                        # Objetivos: dev, ingest, test, eval, lint, build
└── README.md                                       # Setup, descripción general de arquitectura, tabla de resultados de eval
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `src/ingestion/pipeline.py` | Orquesta cargar → dividir → incrustar → upsert; lee estrategia de `configs/chunking.yaml`; soporta ingesta incremental (salta hashes de doc ya indexados almacenados en payload de Qdrant) |
| `src/retrieval/hybrid_retriever.py` | Combina resultados ANN denso de Qdrant y BM25 disperso usando Reciprocal Rank Fusion; parámetro `alpha` (0–1) controla peso denso/disperso, cargado de `configs/retrieval.yaml` |
| `src/generation/llm_client.py` | Cliente SDK Anthropic con `cache_control` en bloque de prompt del sistema y bloques de contexto recuperado; rastrea `cache_creation_input_tokens` vs `cache_read_input_tokens` en trazas de LangSmith |
| `src/generation/rag_chain.py` | RAG de extremo a extremo: llama a `QueryPipeline`, formatea chunks recuperados en contexto en caché, llama a Claude, ejecuta `citation_builder`, devuelve `QueryResponse` con citas en línea |
| `configs/chunking.yaml` | Estrategia de chunking por tipo de documento: `chunk_size`, `chunk_overlap`, divisor (`recursive` o `semantic`), `min_chunk_length` para descartar ruido; fuente de verdad para parámetros de ingesta |
| `configs/retrieval.yaml` | `top_k` (pre-rerangular), `rerank_top_n` (post-rerangular), `score_threshold`, alpha `hybrid` (mezcla denso/disperso), `enable_hyde` (expansión de consulta con embedding de documento hipotético) |
| `data/evaluation/golden_set.jsonl` | Pares QA versionados: `{question, ground_truth_answer, ground_truth_contexts}`; nunca mutados en el lugar — anexar nuevas versiones como `golden_set_v2.jsonl` |
| `src/evaluation/ragas_runner.py` | Carga conjunto dorado, ejecuta cadena RAG completa por pregunta, alimenta predicciones a métricas RAGAS, escribe `eval_report.json`; CI lee esto y falla si fidelidad < 0.80 |

## Andamiaje rápido

```bash
# Requisitos previos: Python 3.12+, Docker, uv (pip install uv), DVC (pip install dvc[s3])
PROJECT=rag-knowledge-base
mkdir -p $PROJECT && cd $PROJECT

# Inicialización del proyecto Python
uv init --python 3.12

# Dependencias principales
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

# Estructura de directorios
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

# Tocar todos los archivos fuente
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

# Configuraciones por defecto
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

# Inicialización de DVC
dvc init 2>/dev/null || true
dvc run -n ingest -d data/raw/ -o data/processed/chunks/ \
  "python scripts/ingest_docs.py --source data/raw/" 2>/dev/null || true

# Instalar habilidades de Claudient
npx claudient add skill data-ml/rag-pipeline
npx claudient add skill data-ml/vector-db-ops
npx claudient add skill data-ml/embedding-strategy
npx claudient add skill data-ml/ragas-eval
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/async-patterns
npx claudient add skill productivity/test-generator

echo "Andamiaje de base de conocimiento RAG completado. Siguiente: cp .env.example .env && make dev"
```

## Plantilla de CLAUDE.md

```markdown
# Base de Conocimiento RAG

Pipeline RAG de producción: ingesta de documentos → almacenamiento vectorial → recuperación híbrida → generación potenciada por Claude con citas.
Stack: Python 3.12 + uv, LangChain/LlamaIndex, Qdrant, FastAPI, OpenAI Embeddings, Anthropic Claude, Unstructured.io, Redis, LangSmith, RAGAS.
Todos los parámetros del pipeline (tamaño de chunk, top_k de recuperación, alpha híbrido) viven en configs/ — no codificar en duro.

## Stack

- Ingesta: Unstructured.io (`unstructured[all-docs]`) analiza documentos sin procesar → chunkers en src/ingestion/chunkers/
- Embeddings: OpenAI `text-embedding-3-large` (3072-dim) via src/ingestion/embedders/openai_embedder.py
- Base de datos vectorial: Qdrant — colección `documents`, vectores densos + dispersos, ejecutándose en puerto 6333
- Recuperación: Híbrida (ANN denso + BM25 disperso) con fusión RRF, luego reranqueador Cohere
- Generación: Anthropic Claude 3.5 Sonnet via src/generation/llm_client.py con caché de prompts
- Caché: Redis en puerto 6379 — vectores de embeddings en caché por SHA-256(text), resultados de consulta en caché por hash(consulta+params)
- Trazas: LangSmith — cada llamada de cadena rastreada; establecer LANGSMITH_API_KEY + LANGSMITH_PROJECT en .env
- Evals: RAGAS — ejecutar via `make eval`; CI falla si fidelidad < 0.80

## Ingesta de nuevo tipo de documento

1. Crear `src/ingestion/loaders/<type>_loader.py` extendiendo `DocumentLoader` en `loaders/base.py`
2. Implementar `load(path: str) -> list[Document]` usando Unstructured.io:
   ```python
   from unstructured.partition.<type> import partition_<type>
   elements = partition_<type>(filename=path, include_metadata=True)
   ```
3. Registrar en `src/ingestion/loaders/loader_registry.py`:
   ```python
   LOADER_REGISTRY[".ext"] = MyTypeLoader
   ```
4. Añadir valores por defecto de chunking para el nuevo tipo en `configs/chunking.yaml` bajo una nueva clave que coincida con la extensión
5. Ejecutar prueba de integración: `uv run pytest tests/integration/test_ingestion_pipeline.py -k "new_type"`

Soportado de forma inmediata: .pdf, .docx, .html — todos via Unstructured.io con preservación de tabla y encabezado.

## Ajuste de tamaño de chunk / superposición

Los parámetros viven en `configs/chunking.yaml`. Cambiarlos allí — nunca codificar en duro en fuente.

Compromisos:
- Chunks más pequeños (400–600 tokens): mayor precisión de recuperación, riesgo de perder contexto entre oraciones
- Chunks más grandes (1000–1500 tokens): más contexto por chunk recuperado, menor precisión, mayor costo de token
- Superposición (100–200 tokens): previene perder información en límites; aumentar si las respuestas se cortan
- Chunker semántico: usar para contenido conversacional o narrativo; recursive funciona mejor para docs estructurados

Después de cambiar parámetros de chunking, DEBE re-ingestar todos los documentos — los vectores de Qdrant existentes ya no son comparables.
Eliminar la colección y re-ejecutar: `make ingest`

Para encontrar parámetros óptimos: construir un conjunto dorado, ejecutar RAGAS con diferentes configuraciones, comparar puntuaciones `context_recall`.

## Configuración de búsqueda híbrida

El alpha híbrido está en `configs/retrieval.yaml` → `hybrid_alpha` (0.0 a 1.0).
- `alpha=1.0` — puro denso (semántico, basado en embeddings); mejor para consultas en lenguaje natural
- `alpha=0.0` — puro disperso (BM25 palabra clave); mejor para coincidencia de término exacta (códigos de producto, nombres)
- `alpha=0.7` — valor por defecto recomendado: semántico con impulso de palabra clave

Para sintonizar alpha empíricamente:
```bash
# Ejecutar evals en diferentes valores de alpha y comparar context_precision
for alpha in 0.5 0.6 0.7 0.8 0.9; do
  RETRIEVAL_ALPHA=$alpha uv run python scripts/run_evals.py --golden-set data/evaluation/golden_set.jsonl \
    --output eval_results/alpha_${alpha}.json
done
```

Los vectores dispersos deben generarse en el tiempo de ingesta via modelo disperso FastEmbed de Qdrant.
Si alternó `enable_sparse` después de la ingesta, elimine la colección y re-ingeste.

## Ejecución de evaluaciones RAGAS

```bash
# Ejecutar contra conjunto dorado actual
make eval

# Ejecutar y escribir informe JSON
uv run python scripts/run_evals.py \
  --golden-set data/evaluation/golden_set.jsonl \
  --output eval_report.json

# Construir un conjunto dorado más grande (requiere ANTHROPIC_API_KEY)
make build-golden

# Ejecutar evals con una configuración de recuperación específica
RETRIEVAL_TOP_K=10 RERANK_TOP_N=3 uv run python scripts/run_evals.py
```

Métricas de RAGAS rastreadas:
- `faithfulness` — ¿son las afirmaciones en la respuesta soportadas por el contexto recuperado? (umbral de CI: >=0.80)
- `answer_relevancy` — ¿la respuesta aborda la pregunta? (umbral de CI: >=0.75)
- `context_recall` — ¿se recuperan los contextos de verdad fundamental? (umbral de CI: >=0.70)
- `context_precision` — ¿son todos los chunks recuperados relevantes? (informativo, sin compuerta)

## Versionado de plantilla de prompt

Los archivos de prompt viven en `prompts/` como texto plano. Se versionan por nombre de archivo: `rag_system_v1.txt`, `rag_system_v2.txt`.
`configs/generation.yaml` → `prompt_version` controla qué versión se carga por `src/generation/prompt_loader.py`.

Reglas:
- Nunca editar un archivo de prompt en el lugar después de que haya sido usado en la producción — crear una nueva versión
- Incluir la versión del prompt en metadatos de traza de LangSmith para que evals estén vinculados al prompt que los generó
- Al cambiar versiones de prompt, ejecutar evals de RAGAS en ambas versiones antes de cambiar la configuración de producción
- El caché de prompt (Anthropic cache_control) se aplica al bloque de prompt del sistema — cambiar el prompt del sistema invalida el caché; preferir editar instrucciones de turno de usuario para sintonización

## Caché de prompt de Claude

`src/generation/llm_client.py` aplica `cache_control: {"type": "ephemeral"}` a:
1. Bloque de prompt del sistema (cargado de `prompts/rag_system_v{n}.txt`)
2. Bloque de contexto recuperado (chunks formateados como una sola cadena)

TTL de caché: 5 minutos (valor por defecto de Anthropic). Los aciertos de caché ahorran ~80% del costo de token de entrada.
Verificar eficiencia de caché en LangSmith: buscar `cache_read_input_tokens` en metadatos de traza.
Si cache_read_input_tokens / total_input_tokens < 0.5 en consultas repetidas, el ordenamiento de contexto puede ser no determinista — ordenar chunks por puntuación antes de formatear.

## Variables de entorno

Todas las variables requeridas están en `.env.example`. Las críticas:
- `OPENAI_API_KEY` — para embeddings de OpenAI (text-embedding-3-large)
- `COHERE_API_KEY` — para reranqueador Cohere (rerank-english-v3.0)
- `ANTHROPIC_API_KEY` — para generación de Claude
- `QDRANT_URL` — `http://localhost:6333` para local, o URL de Qdrant Cloud
- `QDRANT_API_KEY` — solo necesario para Qdrant Cloud
- `QDRANT_COLLECTION` — nombre de colección, por defecto `documents`
- `REDIS_URL` — `redis://localhost:6379/0`
- `LANGSMITH_API_KEY` — trazas de LangSmith (establecer en cualquier valor para deshabilitadar: LANGCHAIN_TRACING_V2=false)
- `LANGSMITH_PROJECT` — nombre de proyecto en panel de control de LangSmith
- `EMBEDDING_PROVIDER` — `openai` o `cohere`

## Ejecución de pruebas

```bash
make test                                 # suite completo con cobertura
uv run pytest tests/unit/ -v              # solo pruebas unitarias (sin llamadas externas)
uv run pytest tests/integration/ -v      # pruebas de integración (requiere Qdrant + Redis ejecutándose)
uv run pytest -k "test_hybrid" -v        # filtrar por nombre
uv run pytest --lf                        # re-ejecutar últimos fallos
uv run pytest --record-mode=none          # usar cassettes VCR, sin llamadas API en vivo
```

## Qué no hacer

- No codificar en duro chunk_size, top_k, o alpha — siempre leer desde configs/
- No mutar golden_set.jsonl en el lugar — crear un nuevo archivo de versión
- No editar archivos de prompt que ya están en uso en producción — añadir una nueva versión
- No omitir trazas de LangSmith en pruebas de integración — establecer LANGCHAIN_TRACING_V2=false en .env.test
- No upsert a Qdrant sin verificar hash de doc existente en payload (idempotencia)
- No cambiar dimensiones de embeddings sin eliminar y recrear la colección de Qdrant
```

## Servidores MCP

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

## Hooks recomendados

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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == configs/chunking.yaml || \"$FILE\" == configs/retrieval.yaml || \"$FILE\" == configs/embeddings.yaml ]]; then echo \"[HOOK] Configuración cambiada: $FILE — recuerde re-ingestar documentos si chunking.yaml o embeddings.yaml fue modificado.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && EVAL=$(ls eval_report.json 2>/dev/null); if [ -n \"$EVAL\" ]; then FAITH=$(python3 -c \"import json; d=json.load(open(\\\"eval_report.json\\\")); print(d.get(\\\"faithfulness\\\", \\\"?\\\"))\" 2>/dev/null); echo \"[Recordatorio] Última puntuación de fidelidad RAGAS: $FAITH (umbral: 0.80). Ejecute make eval para actualizar.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

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

## Relacionados

- [Guía de Pipeline RAG](../guides/rag-pipeline.md)
- [Operaciones de Base de Datos Vectorial](../guides/vector-db-ops.md)
- [Flujo de Trabajo de Ingesta de Documentos](../workflows/document-ingestion.md)
- [Flujo de Trabajo de Evaluación RAGAS](../workflows/ragas-evaluation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
