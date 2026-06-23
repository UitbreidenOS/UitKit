# CLAUDE.md — RAG Knowledge Base (Annotated Example)
> Retrieval-Augmented Generation pipeline with pgvector and Claude — shows how to express the retrieval quality constraints, evaluation discipline, and the specific failure modes Claude should watch for.

<!-- ANNOTATION: RAG systems have a unique failure mode: returning confidently wrong answers because retrieved context is irrelevant or stale. The first line establishes that retrieval quality is the primary metric — not just whether the system returns an answer. -->
This is a RAG (Retrieval-Augmented Generation) system. The primary quality metric is retrieval precision — returning the right context, not just any context. A system that retrieves irrelevant documents and generates a fluent wrong answer is worse than a system that says "I don't know."

## Architecture

```
pipeline/
  ingestion/
    chunker.py        # Document splitting strategy
    embedder.py       # Embedding generation (batch)
    indexer.py        # pgvector upsert
  retrieval/
    retriever.py      # Query → relevant chunks
    reranker.py       # Cross-encoder reranking
    query_rewriter.py # HyDE and query expansion
  generation/
    prompt_builder.py # Context assembly + prompt
    generator.py      # Claude API call + streaming
    citation.py       # Source attribution
  evaluation/
    ragas_eval.py     # RAGAS metrics
    golden_set/       # Curated Q&A pairs for regression
api/
  routes/             # FastAPI endpoints
data/
  raw/                # Source documents (gitignored)
  processed/          # Chunked + metadata JSON
```

## Chunking Strategy

<!-- ANNOTATION: Chunking is one of the highest-leverage decisions in a RAG system. Wrong chunk size destroys retrieval quality. Documenting the current strategy prevents Claude from "improving" it without understanding why these specific values were chosen. -->
- Current strategy: recursive character splitting with 512 tokens, 64 token overlap
- Overlap is intentional — it prevents context from being split across chunk boundaries
- Do not change chunk size without running the RAGAS evaluation suite first
- Special handling for tables and code blocks: kept as atomic chunks regardless of size
- Metadata attached to every chunk: `source_doc`, `page_number`, `chunk_index`, `created_at`

## Embedding Model

<!-- ANNOTATION: Embedding model and vector dimension are a locked pair. Changing the embedding model means re-embedding the entire corpus. Claude should never suggest "try a better embedding model" as a quick fix. -->
- Model: `text-embedding-3-small` (OpenAI), 1536 dimensions
- Changing the embedding model requires re-embedding the entire corpus — this is a major operation
- Vector column type: `pgvector.Vector(1536)`
- Index type: HNSW with `m=16, ef_construction=64`
- Do not use cosine similarity for this index — use L2 distance (configured in index)

## Retrieval Pipeline

<!-- ANNOTATION: The multi-stage retrieval pipeline (initial retrieval → reranking) is the core quality mechanism. Claude needs to understand that skipping reranking to simplify the code is a quality regression, not an optimization. -->
Retrieval is multi-stage — do not collapse it to a single similarity search:
1. **Query rewriting**: expand the query with HyDE (Hypothetical Document Embeddings)
2. **Initial retrieval**: top-20 candidates from pgvector similarity search
3. **Reranking**: cross-encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2`) narrows to top-5
4. **Context assembly**: chunks assembled with source attribution before generation

## Generation Rules

<!-- ANNOTATION: These generation rules prevent hallucination by contract: if the context doesn't contain the answer, say so. This is a deliberate quality gate, not a limitation to work around. -->
- Use Claude Sonnet as the generation model (configured in `pipeline/generation/generator.py`)
- The system prompt instructs the model to answer only from provided context
- If no relevant context is retrieved, the system must say "I don't have enough information" — not fabricate
- Every generated answer must include citations to the source chunks
- Do not modify the system prompt without running the golden set evaluation

## Evaluation

<!-- ANNOTATION: RAGAS metrics are the ground truth for system quality. Claude should understand that "it seems to work" is not a sufficient quality bar — the numbers must be maintained or improved. -->
RAGAS metrics to maintain (run `python -m evaluation.ragas_eval`):
- `context_precision`: > 0.75 (are retrieved chunks relevant?)
- `context_recall`: > 0.70 (are all relevant chunks retrieved?)
- `faithfulness`: > 0.85 (does the answer only use the context?)
- `answer_relevancy`: > 0.80 (does the answer address the question?)

Run the evaluation suite before any change to chunking, retrieval, or generation.

## Data Pipeline

```bash
# Ingest new documents
python -m pipeline.ingestion.chunker --input data/raw/ --output data/processed/
python -m pipeline.ingestion.embedder --input data/processed/
python -m pipeline.ingestion.indexer --input data/processed/

# Evaluate
python -m evaluation.ragas_eval --golden-set evaluation/golden_set/
```

## Known Limitations

<!-- ANNOTATION: Documenting known limitations prevents Claude from trying to "fix" them with naive approaches that have already been tried and found insufficient. -->
- Multi-hop reasoning (questions requiring synthesis across 3+ documents) has low faithfulness — known issue
- Table data retrieval is weak — structured queries should use SQL, not RAG
- Documents longer than 50 pages are chunked but may lose long-range context

## What Not To Do

<!-- ANNOTATION: "Don't skip reranking" is the most important rule here. The two-stage retrieval is the quality mechanism. Removing it degrades precision significantly and is the most tempting optimization a developer would reach for. -->
- Do not collapse multi-stage retrieval to a single similarity search — reranking is not optional
- Do not change the embedding model without re-indexing the corpus
- Do not modify the generation system prompt without evaluation
- Do not generate answers when no relevant context was retrieved — return a "don't know" response
- Do not add new document types without testing chunking quality on samples first
