# 📂 Realtime Vector Ingestion
> The canonical workspace for a real-time RAG ingestion pipeline, utilizing Kafka and Pinecone to process and embed streaming document updates with sub-second latency.

📄 `streaming-architecture-brief.md` # Canonical brief: Kafka topic partitioning, consumer group scaling, and vector dimensions
🧠 `memory.md`                       # Session memory: Dynamic context for active consumer offset tracking
🤖 `CLAUDE.md`                       # Operating rules: Strict instructions for handling malformed JSON payloads gracefully

## 📁 stream-consumers/ (4 skills - Kafka Ingestion)
📄 `topic-subscriber.md`             # Manages connections to high-throughput Kafka/Redpanda topics
📄 `offset-committer.md`             # Ensures exactly-once processing • prevents re-embedding the same document on restart
📄 `dead-letter-router.md`           # Catches corrupted messages and routes them to a secure bucket for human review
📄 `schema-validator.md`             # Enforces strict Protobuf/Avro schemas before allowing data into the pipeline

## 📁 transformation-layer/ (3 skills - Real-Time Processing)
📄 `streaming-chunker.md`            # Splits incoming text streams into vector-ready segments on the fly
📄 `metadata-enricher.md`            # Appends timestamp, source ID, and author to every chunk for downstream filtering
📄 `embedding-generator.md`          # Async batch caller for OpenAI/Cohere embedding APIs • maximizes throughput

## 📁 vector-sync/ (3 skills - Database Writes)
📄 `pinecone-upserter.md`            # Handles bulk upserts to the vector database • optimizes network calls
📄 `collision-handler.md`            # Redis-backed deduplication • overwrites stale chunks if a document was updated
📄 `index-optimizer.md`              # Triggers periodic background merges to keep vector search latency low

## 📁 fallback-mechanisms/ (3 skills - Fault Tolerance)
📄 `retry-jitter.md`                 # Exponential backoff for embedding API rate limits (429 errors)
📄 `circuit-breaker.md`              # Pauses Kafka consumption if the vector database goes down
📄 `spooling-cache.md`               # Temporarily writes to local disk if network egress completely fails

## 📁 observability/ (3 skills - Pipeline Health)
📄 `throughput-monitor.md`           # Tracks messages-per-second (MPS) and embedding latency
📄 `lag-detector.md`                 # Alerts Slack if consumer groups fall behind the Kafka producer
📄 `github-final-sync.md`            # Automated commits of schema updates and pipeline configurations to Github final repos

---
**Configuration Files**
⚙️ `docker-compose.yml`              # Local Kafka, Zookeeper, and Redis cluster setup
📦 `go.mod`                          # Go dependencies (concurrency is critical for streaming throughput)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
