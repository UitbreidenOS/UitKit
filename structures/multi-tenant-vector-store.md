# 📂 Multi-Tenant Vector Store
> The canonical workspace for a highly secure, multi-tenant RAG vector database where enterprise data isolation is mathematically guaranteed at the query level.

📄 `tenant-architecture-brief.md` # Canonical brief: Defines namespace routing, metadata schemas, and row-level security (RLS) for vectors
🧠 `memory.md`                    # Session memory: Context tracking for active tenant ingestion pipelines
🤖 `CLAUDE.md`                    # Operating rules: Strict instructions to NEVER write queries without a hardcoded `tenant_id` filter

## 📁 identity-gateway/ (4 skills - Authentication & Routing)
📄 `jwt-decoder.md`               # Parses incoming requests to extract the immutable `tenant_id` and `user_role`
📄 `namespace-allocator.md`       # Maps large enterprise clients to dedicated physical index namespaces (e.g., Pinecone namespaces)
📄 `rate-limiter.md`              # Prevents noisy neighbor problems • caps API throughput per tenant
📄 `zero-trust-middleware.md`     # Rejects any vector payload missing explicit tenant ownership metadata

## 📁 ingestion-api/ (3 skills - Secure Data Uploads)
📄 `tenant-aware-chunker.md`      # Slices documents while forcibly appending the `tenant_id` to every single chunk's metadata
📄 `embedding-proxy.md`           # Batches texts to OpenAI/Cohere while tracking token costs back to the specific tenant
📄 `data-retention-manager.md`    # Automated cron job to hard-delete vector chunks when a tenant cancels their subscription (GDPR compliance)

## 📁 search-gateway/ (4 skills - Isolated Retrieval)
📄 `query-rewriter.md`            # Takes the user's natural language question and formats it for vector search
📄 `filter-enforcer.md`           # CRITICAL: Automatically injects `{ "tenant_id": { "$eq": current_tenant } }` into EVERY search filter before execution
📄 `hybrid-search-router.md`      # Blends dense vector search with BM25 keyword search, scoped strictly to the tenant's data
📄 `cross-encoder-reranker.md`    # Re-scores the top 20 isolated results to ensure the highest precision for the LLM

## 📁 compliance-auditing/ (3 skills - Security Logging)
📄 `access-ledger.md`             # Immutable logging of exactly which user queried which vectors
📄 `breach-detector.md`           # Nightly heuristic scan ensuring no chunk in Tenant A's namespace has Tenant B's metadata
📄 `soc2-report-generator.md`     # Compiles automated evidence of data segregation for enterprise security reviews

## 📁 infrastructure/ (3 skills - Deployment)
📄 `vector-db-connector.md`       # Connection pooling for Qdrant/Pinecone/Milvus
📄 `disaster-recovery.md`         # Point-in-time snapshotting of the vector database
📄 `github-final-sync.md`         # Automated commits of updated schema definitions to Github final repos

---
**Configuration Files**
⚙️ `qdrant-schema.json`           # Defines the exact payload structure, ensuring `tenant_id` is a required index
📦 `package.json`                 # Node/TypeScript dependencies (LangChain, vector DB SDKs, JWT utilities)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
