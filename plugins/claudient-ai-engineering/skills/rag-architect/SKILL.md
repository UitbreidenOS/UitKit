---
name: "rag-architect"
description: "RAG system design: chunking strategies, embedding model selection, vector store choice, retrieval patterns, reranking, evaluation — production-grade retrieval-augmented generation"
---

# RAG Architect Skill

## When to activate
- Designing a Retrieval-Augmented Generation system from scratch
- Choosing between chunking strategies for your document type
- Selecting an embedding model and vector store
- Improving RAG accuracy (reducing hallucinations, improving relevance)
- Setting up evaluation metrics for your RAG pipeline
- Deciding between naive RAG vs. advanced patterns (HyDE, multi-query, etc.)

## When NOT to use
- Simple FAQ bots with < 50 documents — prompt engineering is enough
- When your data fits in the context window — just stuff it in
- Real-time data that changes every minute — RAG on stale indexes won't help

## Instructions

### Design the architecture

```
Design a RAG architecture for this use case:

Data: [describe — PDFs / web pages / database records / code / emails / etc.]
Volume: [X documents, total ~XMB/GB]
Query types: [factual lookup / synthesis / comparison / analysis]
Latency requirement: [< Xs response time]
Accuracy requirement: [what's the cost of a wrong answer?]
Stack: [Python / Node.js / preferred cloud]
Budget: [self-hosted / managed service / no constraint]

Design:
1. Ingestion pipeline (how data gets in)
2. Chunking strategy (how to split documents)
3. Embedding model (what converts text to vectors)
4. Vector store (where vectors live)
5. Retrieval strategy (how to find relevant chunks)
6. Reranking (optional but powerful)
7. Generation (prompt + model + context assembly)
8. Evaluation (how to measure if it's working)
```

### Chunking strategies

```
Recommend a chunking strategy for this document type.

Document type: [PDF reports / code / legal contracts / chat logs / news articles / technical docs]
Average document length: [X pages / X words]
Query patterns: [single-fact / multi-step / requires whole document context]

Options to evaluate:
1. Fixed-size: [X tokens] with [Y token] overlap
   - Pros: simple, predictable
   - Cons: splits sentences/concepts mid-thought

2. Sentence splitting: split on sentence boundaries
   - Pros: preserves semantic units
   - Cons: variable chunk size, some chunks too small

3. Recursive character splitting: tries paragraphs → sentences → characters
   - Best for: general documents

4. Semantic chunking: embed and split where cosine similarity drops
   - Best for: long documents with clear topic shifts
   - Requires: embedding model at ingestion time

5. Document-specific: headings structure (for PDFs/docs with clear sections)
   - Best for: technical docs, legal contracts, manuals

6. Parent-child / hierarchical: store small chunks for retrieval, fetch parent for context
   - Best for: high-precision requirements with large context windows

Recommendation for my case + implementation example.
```

### Embedding model selection

```
Help me choose an embedding model.

Use case: [describe the type of content and queries]
Language: [English only / multilingual]
Latency requirement: [real-time / batch OK]
Budget: [per-token cost sensitivity]
Self-hosted requirement: [yes / no]

Compare:
- OpenAI text-embedding-3-small: strong quality, cheap ($0.02/1M tokens), hosted
- OpenAI text-embedding-3-large: best OpenAI quality, more expensive
- Anthropic (Claude via API): use for consistency if Claude is generating too
- Cohere embed-v3: strong multilingual, 1,024 dimension default
- Voyage AI voyage-3: excellent for code and technical docs
- Local: nomic-embed-text, all-MiniLM-L6-v2 (fast, free, lower quality)
- Google text-embedding-004: best multilingual at scale

Recommendation based on my constraints.
```

### Retrieval patterns

```
Design the retrieval strategy for this RAG system.

Query types we receive: [describe]
Known failure modes in naive retrieval: [too literal / misses paraphrases / multi-hop queries]

Basic patterns:
1. Semantic similarity: embed query, top-k cosine similarity — baseline
2. MMR (Maximal Marginal Relevance): diversity-aware retrieval, reduces redundancy
3. Hybrid (BM25 + semantic): keyword + semantic, strong for named entities

Advanced patterns:
4. HyDE (Hypothetical Document Embeddings): generate a "fake answer" and embed it
   - Good for: queries where the question looks different from the answer
5. Multi-query: generate 3-5 reformulations, retrieve for each, deduplicate
   - Good for: ambiguous queries, improves recall
6. Contextual compression: retrieve → compress to relevant sentences → generate
   - Good for: long chunks with partially relevant content
7. Step-back prompting: abstract the question to a higher level, retrieve from that
8. FLARE: generate iteratively, retrieve when confidence drops

Which patterns apply to my use case? Implementation order?
```

### Evaluation framework

```
Design a RAG evaluation framework for this system.

What "good" looks like for my use case: [describe — accuracy / completeness / faithfulness]

Metrics to track:
1. Retrieval quality:
   - Precision@k: are the retrieved chunks relevant?
   - Recall@k: are all relevant chunks retrieved?
   - MRR (Mean Reciprocal Rank): is the best chunk ranked first?

2. Generation quality:
   - Faithfulness: does the answer stick to the retrieved context? (no hallucination)
   - Answer relevance: does the answer address the question?
   - Context relevance: are retrieved chunks actually used?

Evaluation tools:
- RAGAS: automated RAG evaluation framework (ragas.io)
- LangChain Evaluators: built-in faithfulness + correctness checks
- Manual golden set: [X] question-answer pairs, human or Claude as judge

Create a test set of [10] question-answer pairs for my domain.
Set up: when does my RAG fail and how do I know?
```

## Example

**User:** Building RAG for a 5,000-page internal knowledge base (Notion pages, PDFs, Slack threads). Queries are mostly "how do I do X" and "what's our policy on Y."

**Claude's architecture:**

**Chunking:** Recursive character splitting with 512-token chunks and 50-token overlap. For Slack threads: group by thread (treat as one chunk), not individual messages.

**Embedding:** text-embedding-3-small — balanced cost and quality, English-only is fine here.

**Vector store:** Qdrant (self-hosted) or Pinecone (managed) — at 5,000 pages (~250K chunks), both handle this easily.

**Retrieval:** Hybrid BM25 + semantic. "Policy on Y" queries benefit from keyword match (BM25); "how do I" benefits from semantic. Combine with RRF (Reciprocal Rank Fusion).

**Reranking:** Cohere rerank-v3 — run top-20 through reranker to get top-5 for generation. Biggest quality win for the effort.

**Evaluation:** Create 50 gold-standard Q&A pairs from your team's most common questions. Use RAGAS faithfulness score — target > 0.85 before shipping.

**Expected accuracy:** Hybrid + reranking typically reaches 75-85% answer accuracy on internal knowledge bases. Pure semantic without reranking: ~55-65%.

---
