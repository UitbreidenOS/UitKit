# Vector Databases

## Wanneer activeren
- Gebruiker implementeer semantic zoeken, RAG pipelines, of recommendation systemen
- Code imports `qdrant_client`, `pinecone`, `weaviate`, `psycopg2` met `pgvector`, of `chromadb`
- Gebruiker vraag over embedding opslag, similarity zoeken, of nearest-neighbor ophalen
- Gebruiker bouw systeem waar "vind documenten gelijkaardige X" kernoperatie
- Gebruiker nodig deduplication schaal gebruiken embedding similarity
- Gebruiker ontwerp chunk strategie, HNSW parameters, of hybrid zoeken production systeem

## Wanneer NIET gebruiken
- Gebruiker nodig exact keyword zoeken alleen — gebruik Elasticsearch of Postgres full-text zoeken
- Data tabular en queries filter-based geen semantic component — gebruik SQL
- Dataset onder ~1.000 items — enkel cosine similarity loop over in-memory numpy arrays voldoende
- Gebruiker vraag over trainend embedding models, niet gebruiken zij

Zie vector database documentatie voor complete implementatie gidsen en best practices.

---
