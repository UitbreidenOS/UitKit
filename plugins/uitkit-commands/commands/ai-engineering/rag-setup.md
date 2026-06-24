---
description: Scaffold a production-ready RAG pipeline for a given data source and stack
argument-hint: "[data source description and preferred stack]"
---
You are designing a retrieval-augmented generation pipeline based on: $ARGUMENTS

If no stack preference is given, default to: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` for generation, `text-embedding-3-small` via OpenAI for embeddings (swap to Voyage AI if user specifies Anthropic-only).

**Step 1 — Understand the data**

Identify from $ARGUMENTS:
- Source type: PDFs, web pages, database rows, code files, Notion/Confluence, emails, or mixed
- Update frequency: static corpus, append-only, or frequently mutated
- Size estimate: <1 k docs, 1 k–100 k, or 100 k+
- Sensitivity: PII present? Air-gapped required?

State your assumptions explicitly if not given.

**Step 2 — Choose chunking strategy**

Select and justify one:
- Fixed-size with overlap (fast, baseline)
- Semantic / sentence-window (better coherence for prose)
- Recursive character splitting by doc structure (code, markdown)
- Parent-document retriever (retrieve small chunk, return parent context)

Show the exact chunker config: `chunk_size`, `chunk_overlap`, separator list.

**Step 3 — Generate the ingestion pipeline**

Write a Python script (`ingest.py`) that:
- Loads documents from the source type identified above
- Cleans and normalises text (strip boilerplate, normalise whitespace, handle encoding)
- Chunks documents with the chosen strategy
- Embeds chunks in batches (max 512 per API call)
- Upserts into the vector store with metadata: `source`, `chunk_index`, `ingested_at`
- Is idempotent — re-running on unchanged docs does not re-embed

**Step 4 — Generate the retrieval + generation chain**

Write a Python module (`rag_chain.py`) that:
- Accepts a user query string
- Embeds the query and retrieves top-K chunks (default K=5) with MMR reranking
- Constructs a system prompt that instructs the model to answer only from retrieved context and cite sources by `source` metadata field
- Calls `claude-sonnet-4-6` with prompt caching on the context block (use `cache_control: {"type": "ephemeral"}` on the context messages)
- Returns: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Step 5 — Operational checklist**

List as checkboxes:
- [ ] Index freshness strategy (scheduled re-ingest vs. webhook trigger)
- [ ] Embedding model version pinning
- [ ] Retrieval quality metrics to track (MRR, recall@K)
- [ ] Fallback when retrieval confidence is low
- [ ] PII scrubbing if applicable

Output: `ingest.py`, `rag_chain.py`, operational checklist. No stubs.
