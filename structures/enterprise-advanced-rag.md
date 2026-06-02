# 📂 Enterprise Advanced RAG
> The canonical workspace for a production-grade Retrieval-Augmented Generation (RAG) pipeline utilizing hybrid search, parent-child chunking, and cross-encoder re-ranking.

📄 `rag-architecture-brief.md`  # Canonical brief: Search weights (keyword vs. semantic) and chunking limits
🧠 `memory.md`                  # Session memory: Dynamic context tracking for the active retrieval session
🤖 `CLAUDE.md`                  # Operating rules: Strict instructions for the LLM to only cite retrieved context

## 📁 ingestion-pipeline/ (4 skills - Data Preprocessing)
📄 `document-parser.md`         # Multi-format ingestion • handles PDFs, Markdown, and raw text
📄 `metadata-extractor.md`      # Auto-tags chunks with author, date, and source domain for pre-filtering
📄 `pii-scrubber.md`            # Redacts sensitive information before sending to the embedding model
📄 `vector-sync.md`             # Pushes processed documents to Pinecone/Milvus databases

## 📁 chunking-strategies/ (3 skills - Context Slicing)
📄 `semantic-splitter.md`       # Breaks documents naturally at paragraph or header boundaries
📄 `parent-child-linker.md`     # Creates small child chunks for precise search, linked to larger parent chunks for full LLM context
📄 `table-preserver.md`         # Ensures markdown tables are not split horizontally across different chunks

## 📁 retrieval-engine/ (4 skills - The Search Core)
📄 `query-expander.md`          # LLM pre-processing step • generates 3 variations of the user's query to improve hit rates
📄 `hybrid-search.md`           # Combines dense vector search (embeddings) with sparse search (BM25 keyword)
📄 `cross-encoder-reranker.md`  # Passes top 20 results through Cohere ReRank to surface the most relevant top 5
📄 `metadata-filter.md`         # Applies hard constraints (e.g., "only search docs from 2026") before vector matching

## 📁 generation-layer/ (3 skills - Synthesis)
📄 `context-injector.md`        # Formats the top retrieved chunks cleanly into the LLM prompt
📄 `hallucination-guard.md`     # Self-reflection prompt • forces the model to verify its answer against the provided chunks
📄 `citation-builder.md`        # Appends precise source links and page numbers to the final output

## 📁 deployment-evals/ (3 skills - Pipeline Maintenance)
📄 `ragas-evaluator.md`         # Automated metrics measuring context precision and answer relevancy
📄 `cache-invalidation.md`      # Clears stale vector embeddings when source documents are updated
📄 `github-final-sync.md`       # Automated commit of pipeline configurations and test scripts to Github final repos

---
**Configuration Files**
⚙️ `docker-compose.yml`         # Local deployment for testing the vector DB and embedding microservices
📦 `requirements.txt`           # LangChain, LlamaIndex, and embedding model dependencies

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
