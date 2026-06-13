---
name: vector-databases
updated: 2026-06-13
---

# Vector Databases

## When to activate
- User is implementing semantic search, RAG pipelines, or recommendation systems
- Code imports `qdrant_client`, `pinecone`, `weaviate`, `psycopg2` with `pgvector`, or `chromadb`
- User asks about embedding storage, similarity search, or nearest-neighbor retrieval
- User is building a system where "find documents similar to X" is a core operation
- User needs deduplication at scale using embedding similarity
- User is designing chunk strategy, HNSW parameters, or hybrid search for a production system

## When NOT to use
- The user needs exact keyword search only — use Elasticsearch or Postgres full-text search
- Data is tabular and queries are filter-based with no semantic component — use SQL
- The dataset is under ~1,000 items — a simple cosine similarity loop over in-memory numpy arrays is sufficient
- The user is asking about training embedding models, not using them for retrieval

## Instructions

### When to use vector databases

Use a vector DB when you need to retrieve by meaning, not by value:
- **Semantic search**: "find docs about payment failures" without exact keyword matches
- **RAG**: retrieve top-K relevant chunks before passing context to an LLM
- **Recommendations**: "users who liked X also liked Y" via embedding proximity
- **Deduplication**: cluster near-duplicate records at scale
- **Anomaly detection**: flag records far from all cluster centroids

### Comparison table

| | Qdrant | Weaviate | Pinecone | pgvector | Chroma |
|---|---|---|---|---|---|
| Deployment | Self-host or cloud | Self-host or cloud | Cloud only | Self-host (Postgres extension) | Self-host or cloud |
| Language | Rust | Go | Managed | C (Postgres) | Python |
| Hybrid search | Yes (built-in sparse) | Yes (BM25 + dense) | Yes (serverless) | Manual (tsvector join) | Limited |
| Filtering | Payload filters, indexed | GraphQL where clauses | Metadata filters | SQL WHERE | Metadata dict |
| Scale | 100M+ vectors | 100M+ vectors | 100M+ (pods) | <10M practical | <5M practical |
| Best for | Production RAG, fast filtering | Schema-rich data, multi-tenancy | Zero-ops cloud | Already on Postgres | Local dev, prototyping |
| Managed cost | Free tier + $0.08/GB | Free tier + compute | $0.096/1M reads | Postgres instance cost | Free self-host |

### Embedding models

Choose embedding model before choosing vector DB — model determines dimensionality and quality.

| Model | Dims | Context | Best for |
|---|---|---|---|
| `text-embedding-3-small` (OpenAI) | 1536 (reducible) | 8191 tokens | General purpose, cost-efficient |
| `text-embedding-3-large` (OpenAI) | 3072 | 8191 tokens | Highest OpenAI quality |
| `voyage-3` (Voyage AI) | 1024 | 32000 tokens | Long documents, RAG |
| `nomic-embed-text` (local) | 768 | 8192 tokens | On-prem, no API cost |
| `BAAI/bge-m3` (local) | 1024 | 8192 tokens | Multilingual, hybrid search |

Use `text-embedding-3-small` as the default unless you have a specific reason to switch. You can reduce its dimensions to 256 or 512 for cheaper storage at a small quality cost.

### Chunking strategy

Chunk before embedding — the embedding window is your hard constraint.

| Chunk size | Use when |
|---|---|
| 256 tokens | High-precision retrieval, short factual answers, FAQ |
| 512 tokens | Balanced RAG — most common default |
| 1024 tokens | Long-form context needed, summarization tasks |

Always add overlap (10–20% of chunk size) to avoid splitting context across boundaries:

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\n\n", "\n", ". ", " "],
)
chunks = splitter.split_text(document)
```

**Late chunking**: embed the full document first, then extract chunk embeddings from the full-document attention — preserves cross-chunk context. Use `jina-embeddings-v2` or `nomic-embed-text` which support this natively.

### HNSW indexing parameters

HNSW (Hierarchical Navigable Small World) is the default index for all major vector DBs.

| Parameter | Effect | Default | Tune when |
|---|---|---|---|
| `m` | Graph connectivity (edges per node) | 16 | Increase to 32–64 for higher recall, costs more RAM |
| `ef_construction` | Build-time search width | 100 | Increase for better index quality, slower build |
| `ef` (search) | Query-time search width | 128 | Increase for higher recall at query time |

For datasets under 10,000 vectors, use a flat (brute-force) index — HNSW has overhead that isn't justified at small scale.

### Qdrant

```python
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
)

client = QdrantClient(url="http://localhost:6333")
# Cloud: QdrantClient(url="https://xyz.qdrant.io", api_key="...")

# Create collection
client.recreate_collection(
    collection_name="documents",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

# Upsert — always batch, never one-at-a-time
points = [
    PointStruct(
        id=i,
        vector=embedding,
        payload={"text": chunk, "source": filename, "page": page_num},
    )
    for i, (embedding, chunk, filename, page_num) in enumerate(records)
]
client.upsert(collection_name="documents", points=points, wait=True)

# Search with payload filter
results = client.search(
    collection_name="documents",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[FieldCondition(key="source", match=MatchValue(value="report.pdf"))]
    ),
    limit=5,
    with_payload=True,
)

for r in results:
    print(r.score, r.payload["text"])
```

Index payload fields that you filter on:

```python
client.create_payload_index(
    collection_name="documents",
    field_name="source",
    field_schema="keyword",
)
```

### Pinecone

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="...")

# Serverless (recommended — no pod management)
pc.create_index(
    name="documents",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

index = pc.Index("documents")

# Namespace isolation — use for multi-tenant apps
index.upsert(
    vectors=[
        {"id": str(i), "values": emb, "metadata": {"text": chunk, "source": src}}
        for i, (emb, chunk, src) in enumerate(records)
    ],
    namespace="tenant-123",
)

results = index.query(
    vector=query_embedding,
    top_k=5,
    filter={"source": {"$eq": "report.pdf"}},
    include_metadata=True,
    namespace="tenant-123",
)
```

Serverless vs pod-based: use serverless for most workloads — it scales to zero, no capacity planning. Use pods only if you need guaranteed query latency under 10ms or have >1B vectors.

### pgvector

Best when: you already run Postgres, your vector dataset stays under ~5–10M rows, and you want to avoid adding a new infrastructure dependency.

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table with vector column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    source TEXT,
    embedding vector(1536)
);

-- HNSW index (Postgres 15+, pgvector 0.5+)
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Similarity search with filter
SELECT content, source, 1 - (embedding <=> $1::vector) AS score
FROM documents
WHERE source = 'report.pdf'
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

```python
import psycopg2
import numpy as np

conn = psycopg2.connect("postgresql://user:pass@localhost/mydb")
cur = conn.cursor()

# Insert with embedding
cur.execute(
    "INSERT INTO documents (content, source, embedding) VALUES (%s, %s, %s)",
    (chunk, filename, embedding.tolist()),
)
conn.commit()

# Query
cur.execute(
    "SELECT content, 1 - (embedding <=> %s::vector) AS score "
    "FROM documents ORDER BY embedding <=> %s::vector LIMIT 5",
    (query_embedding.tolist(), query_embedding.tolist()),
)
rows = cur.fetchall()
```

### Hybrid search

Dense (semantic) + sparse (keyword/BM25) retrieval combined with Reciprocal Rank Fusion (RRF):

```python
# Qdrant sparse + dense hybrid
from qdrant_client.models import SparseVector, NamedVector, NamedSparseVector

# Sparse vector from BM25 (use fastembed or splade)
from fastembed import SparseTextEmbedding
sparse_model = SparseTextEmbedding("prithvida/Splade_PP_en_v1")
sparse_vec = list(sparse_model.embed([query]))[0]

results = client.query_points(
    collection_name="documents",
    prefetch=[
        {"query": {"indices": sparse_vec.indices.tolist(), "values": sparse_vec.values.tolist()}, "using": "sparse", "limit": 20},
        {"query": dense_embedding, "using": "dense", "limit": 20},
    ],
    query={"fusion": "rrf"},  # RRF reranking
    limit=5,
)
```

RRF formula: `score = sum(1 / (k + rank_i))` where `k=60` is standard. Most vector DBs implement this natively — do not implement manually.

### Production patterns

**Batched upserts**: always upsert in batches of 100–500. Single-record inserts are 10–50x slower due to network round-trips.

```python
def batch_upsert(client, collection, points, batch_size=200):
    for i in range(0, len(points), batch_size):
        client.upsert(collection_name=collection, points=points[i:i+batch_size])
```

**Index warm-up**: after loading a large index, run a few dummy queries before serving traffic — HNSW graph traversal is slow on first access due to page cache misses.

**Dimensionality**: use the minimum dimension that meets your quality bar. 256-dim `text-embedding-3-small` vectors use 4x less RAM and storage than 1536-dim — run an offline recall benchmark to find your floor.

**Payload vs. separate store**: store only filterable metadata in the vector DB payload. Store large text blobs in S3/Postgres and join by ID at query time.

## Example

RAG pipeline with Qdrant and Claude:

```python
import os
from anthropic import Anthropic
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

# Clients
anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
qdrant = QdrantClient(url="http://localhost:6333")

COLLECTION = "knowledge-base"
EMBED_MODEL = "text-embedding-3-small"
EMBED_DIM = 1536


def setup_collection():
    qdrant.recreate_collection(
        collection_name=COLLECTION,
        vectors_config=VectorParams(size=EMBED_DIM, distance=Distance.COSINE),
    )


def embed(texts: list[str]) -> list[list[float]]:
    response = openai_client.embeddings.create(model=EMBED_MODEL, input=texts)
    return [r.embedding for r in response.data]


def ingest_documents(documents: list[dict]):
    """documents: list of {"id": str, "text": str, "source": str}"""
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        embeddings = embed([d["text"] for d in batch])
        points = [
            PointStruct(
                id=idx + i,
                vector=emb,
                payload={"text": doc["text"], "source": doc["source"]},
            )
            for idx, (doc, emb) in enumerate(zip(batch, embeddings))
        ]
        qdrant.upsert(collection_name=COLLECTION, points=points, wait=True)
        print(f"Ingested {min(i + batch_size, len(documents))}/{len(documents)}")


def retrieve(query: str, top_k: int = 5) -> list[dict]:
    query_embedding = embed([query])[0]
    results = qdrant.search(
        collection_name=COLLECTION,
        query_vector=query_embedding,
        limit=top_k,
        with_payload=True,
    )
    return [
        {"text": r.payload["text"], "source": r.payload["source"], "score": r.score}
        for r in results
    ]


def answer(question: str) -> str:
    chunks = retrieve(question, top_k=5)

    context = "\n\n".join(
        f"[Source: {c['source']}]\n{c['text']}" for c in chunks
    )

    response = anthropic.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=(
            "You are a helpful assistant. Answer questions using only the provided context. "
            "If the context does not contain the answer, say so."
        ),
        messages=[
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}",
            }
        ],
    )
    return response.content[0].text


# Usage
if __name__ == "__main__":
    setup_collection()

    docs = [
        {"id": "1", "text": "Qdrant stores vectors with payloads...", "source": "docs/qdrant.md"},
        {"id": "2", "text": "HNSW indexes trade RAM for recall...", "source": "docs/indexing.md"},
    ]
    ingest_documents(docs)

    print(answer("How does HNSW affect memory usage?"))
```
