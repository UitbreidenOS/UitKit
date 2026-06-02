# 📂 GraphRAG Knowledge Core

> The canonical workspace for a GraphRAG pipeline, extracting entities and relationships to build a Neo4j knowledge graph for complex, multi-hop reasoning.

📄 `graph-architecture-brief.md` # Canonical brief: Defines ontology rules, node labels, and relationship types
🧠 `memory.md`                   # Session memory: Dynamic context tracking for the active entity extraction session
🤖 `CLAUDE.md`                   # Operating rules: Strict instructions for generating valid Cypher queries

## 📁 ingestion-pipeline/ (4 skills - Unstructured to Graph)
📄 `document-chunker.md`         # Text segmentation optimized for entity extraction rather than vector search
📄 `entity-extractor.md`         # LLM pipeline • identifies core nouns, organizations, and people
📄 `relationship-mapper.md`      # Defines the semantic edges between extracted entities (e.g., "WORKS_FOR", "OWNS")
📄 `ontology-enforcer.md`        # Prevents duplicate nodes • maps "Anthropic" and "Anthropic PBC" to the same entity ID

## 📁 graph-database/ (3 skills - Neo4j Sync)
📄 `neo4j-connector.md`          # Secure authentication and connection pooling for the graph database
📄 `batch-committer.md`          # Groups graph mutations into bulk transactions to avoid database locks
📄 `index-manager.md`            # Auto-generates full-text and vector indices on node properties for fast retrieval

## 📁 retrieval-engine/ (4 skills - Query Generation)
📄 `intent-classifier.md`        # Determines if the user's question requires a vector search or a multi-hop graph traversal
📄 `cypher-generator.md`         # Translates natural language questions into highly optimized Neo4j Cypher queries
📄 `schema-injector.md`          # Passes the graph's schema to the LLM so it knows exactly what relationships are available
📄 `fallback-vector-search.md`   # Triggers standard RAG if the Cypher query returns empty

## 📁 synthesis-layer/ (3 skills - Response Formatting)
📄 `graph-context-formatter.md`  # Translates raw JSON graph paths back into readable context for the LLM
📄 `multi-hop-reasoner.md`       # Synthesizes answers that span across 3+ degrees of separation in the graph
📄 `github-final-sync.md`        # Automated commits of updated ontology definitions to Github final repos

## 📁 telemetry-evals/ (3 skills - Graph Health)
📄 `orphan-node-detector.md`     # Finds and cleans up entities that have no connected relationships
📄 `extraction-cost-tracker.md`  # Monitors the token burn of running heavy entity extraction pipelines
📄 `cypher-error-logger.md`      # Tracks syntax failures in LLM-generated graph queries for fine-tuning

---
**Configuration Files**
⚙️ `docker-compose.yml`          # Local Neo4j APOC instance and worker node deployments
📦 `requirements.txt`            # Neo4j driver, LangChain Graph, and Anthropic SDK dependencies

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
