---
name: "enterprise-search"
description: "Enterprise search and knowledge retrieval: design multi-source search systems, implement hybrid search (semantic + keyword + structured), build knowledge graphs, handle access control, and create unified search across docs, wikis, code, and databases"
---

# Enterprise Search & Knowledge Retrieval

## When to activate
- Building internal search across multiple knowledge sources (docs, wikis, code, Slack, email)
- Implementing hybrid search combining semantic, keyword, and structured queries
- Designing access-controlled retrieval (user sees only what they're authorized to access)
- Building knowledge graphs for organizational knowledge
- When naive RAG retrieval returns irrelevant or unauthorized content
- Creating search systems that handle multi-hop queries across sources

## When NOT to use
- Simple single-source document search (use rag-architect)
- Public-facing search without access control requirements
- Full-text search on a single database table (use standard SQL/FTS)
- Vector-only similarity search on a single corpus

## Instructions

### 1. Multi-Source Architecture

```yaml
enterprise_search:
  sources:
    - name: documentation
      type: markdown_files
      paths: [/docs, /wiki, /runbooks]
      index: full_text + embeddings
      refresh: on_commit
      
    - name: codebase
      type: code
      paths: [/src, /lib, /infra]
      index: code_embeddings + AST + symbols
      refresh: on_push
      
    - name: tickets
      type: api
      endpoint: jira_api
      index: full_text + metadata
      refresh: hourly
      
    - name: conversations
      type: api
      endpoint: slack_export
      index: embeddings + thread_context
      refresh: daily
      
    - name: database
      type: structured
      connection: postgresql_readonly
      index: schema_metadata + column_embeddings
      refresh: schema_on_change

  unified_index:
    type: hybrid  # vector + inverted index + graph
    vector_store: qdrant
    fts_engine: elasticsearch
    graph_store: neo4j  # for entity relationships
```

### 2. Hybrid Search Strategy

Combine three search modalities for optimal results:

```python
class HybridSearch:
    """Multi-modal enterprise search."""
    
    async def search(
        self,
        query: str,
        user: User,
        top_k: int = 20,
        source_filter: list[str] = None,
    ) -> SearchResult:
        
        # 1. Semantic search (meaning-based)
        query_embedding = await self.embed(query)
        semantic_results = await self.vector_store.search(
            embedding=query_embedding,
            top_k=top_k * 2,  # over-fetch for reranking
            filter=self.build_acl_filter(user) + self.build_source_filter(source_filter),
        )
        
        # 2. Keyword search (exact match, BM25)
        keyword_results = await self.fts_engine.search(
            query=self.expand_query(query),  # synonym expansion
            top_k=top_k * 2,
            filter=self.build_acl_filter(user),
        )
        
        # 3. Graph search (entity-relationship)
        entities = await self.extract_entities(query)
        graph_results = await self.graph_store.search(
            entities=entities,
            relationship_depth=2,
            filter=self.build_acl_filter(user),
        )
        
        # Reciprocal Rank Fusion (RRF) to combine results
        fused = self.reciprocal_rank_fusion(
            semantic_results, keyword_results, graph_results,
            weights=[0.5, 0.3, 0.2],  # semantic > keyword > graph
        )
        
        # Rerank with cross-encoder for precision
        reranked = await self.reranker.rerank(
            query=query,
            documents=fused[:top_k * 2],
            top_k=top_k,
        )
        
        return SearchResult(
            results=reranked,
            sources=self.group_by_source(reranked),
            facets=self.compute_facets(reranked),
        )
```

### 3. Access Control Layer

```python
class ACLFilter:
    """Document-level access control for search results."""
    
    def build_filter(self, user: User) -> dict:
        """Build access control filter for vector/FTS search."""
        return {
            "must": [
                # User must have access to at least one of these
                {"should": [
                    # Public documents
                    {"term": {"access_level": "public"}},
                    # Documents in user's teams
                    {"terms": {"team_ids": user.team_ids}},
                    # Documents user explicitly owns
                    {"term": {"owner_id": user.id}},
                    # Documents shared with user
                    {"term": {"shared_with": user.id}},
                ], "minimum_should_match": 1},
                # Never include archived/deleted
                {"term": {"status": "active"}},
            ]
        }
    
    async def verify_access(self, doc_id: str, user: User) -> bool:
        """Real-time access verification (defense in depth)."""
        doc_acl = await self.acl_store.get(doc_id)
        return (
            doc_acl.is_public
            or user.id in doc_acl.viewers
            or any(team in user.team_ids for team in doc_acl.team_ids)
            or user.has_role("admin")
        )
```

### 4. Knowledge Graph Construction

```python
class KnowledgeGraph:
    """Build and query entity relationships across enterprise data."""
    
    async def extract_and_link(self, document: Document):
        """Extract entities and relationships from a document."""
        # Extract entities
        entities = await self.ner_model.extract(document.text)
        # Extract relationships
        relationships = await self.re_model.extract(document.text, entities)
        
        # Upsert to graph
        for entity in entities:
            await self.graph.upsert_node(
                label=entity.type,  # Person, Service, API, Database, etc.
                properties={
                    "name": entity.name,
                    "source": document.source,
                    "doc_id": document.id,
                    "last_seen": datetime.now(),
                }
            )
        
        for rel in relationships:
            await self.graph.upsert_edge(
                source=rel.source_entity,
                target=rel.target_entity,
                type=rel.relationship,  # OWNS, DEPENDS_ON, MANAGES, etc.
                properties={"doc_id": document.id, "confidence": rel.confidence}
            )
    
    async def multi_hop_query(self, question: str, max_hops: int = 3):
        """Answer questions requiring multi-hop reasoning."""
        # "Who owns the service that the payment API depends on?"
        # Query: PaymentAPI -[DEPENDS_ON]-> ?Service -[OWNED_BY]-> ?Person
        
        entities = await self.extract_entities(question)
        cypher = await self.nl_to_cypher(question, entities)
        return await self.graph.query(cypher)
```

### 5. Search Quality Monitoring

```
ENTERPRISE SEARCH DASHBOARD
┌───────────────────────────────────────────────┐
│ QUERY VOLUME                                    │
│ Today: 2,847 queries | Avg: 2,340/day          │
│                                                │
│ QUALITY METRICS                                  │
│ MRR@10: 0.72 (target: 0.75)                    │
│ Hit rate: 89% (users click result within top 5)│
│ Zero-result rate: 3.2% (target: <5%)           │
│                                                │
│ LATENCY                                         │
│ P50: 180ms | P95: 450ms | P99: 1.2s            │
│                                                │
│ TOP ZERO-RESULT QUERIES (needs attention)       │
│ 1. "new hire onboarding checklist" (23 today)  │
│ 2. "Q3 planning doc" (18 today)                │
│ 3. "incident response runbook" (12 today)      │
│                                                │
│ SOURCE COVERAGE                                 │
│ Docs: 94% indexed | Code: 100% | Jira: 87%     │
│ Slack: 76% (last 90 days) | Email: not indexed │
└───────────────────────────────────────────────┘
```

### 6. Query Enhancement

```python
class QueryEnhancer:
    """Enhance raw queries for better retrieval."""
    
    async def enhance(self, query: str, user: User) -> EnhancedQuery:
        # 1. Intent classification
        intent = await self.classify_intent(query)
        # Types: lookup, comparison, how-to, troubleshooting, navigation
        
        # 2. Query expansion (synonyms, related terms)
        expanded = await self.expand_query(query)
        # "deploy" → "deploy", "deployment", "release", "rollout", "ship"
        
        # 3. Temporal grounding
        temporal = await self.extract_temporal(query)
        # "last week's incident" → filter: date > 2026-06-06
        
        # 4. Source routing
        sources = await self.route_to_sources(query, intent)
        # "how to reset password" → docs, runbooks (not code)
        
        # 5. Personalization
        boost = await self.personalize(user)
        # Boost user's team docs, recently accessed sources
        
        return EnhancedQuery(
            original=query,
            expanded=expanded,
            intent=intent,
            temporal_filter=temporal,
            source_boost=sources,
            personalization_boost=boost,
        )
```

## Example

**Enterprise search for "Why did the payment service crash last Tuesday?"**

```
QUERY ENHANCEMENT:
  Intent: troubleshooting
  Entities: [payment_service, crash]
  Temporal: last Tuesday (2026-06-09)
  Sources: incident_reports > slack > runbooks > code

SEARCH RESULTS (hybrid, reranked):
  1. [Incident Report] INC-2026-0847: Payment Service OOM Crash (2026-06-09)
     Source: PagerDuty | Score: 0.94 | Team: platform-eng (user's team ✅)
  
  2. [Slack Thread] #incident-response: Payment service memory leak investigation
     Source: Slack | Score: 0.89 | 2026-06-09 14:32-18:45
  
  3. [Runbook] Payment Service Memory Troubleshooting
     Source: Docs | Score: 0.82 | Updated: 2026-06-10 (post-incident)
  
  4. [Code] PR #4521: Fix memory leak in payment processor connection pool
     Source: GitHub | Score: 0.78 | Merged: 2026-06-11
  
  5. [Jira] PAY-1234: Payment service OOM kills under load
     Source: Jira | Score: 0.71 | Status: Done

KNOWLEDGE GRAPH CONTEXT:
  payment_service → DEPENDS_ON → connection_pool → HAD_ISSUE → memory_leak
  payment_service → OWNED_BY → platform-eng team
  INC-2026-0847 → RESOLVED_BY → PR #4521
```

## Anti-Patterns

- **Single-modality search:** Vector-only misses exact matches; keyword-only misses semantic meaning
- **No access control:** Users seeing documents they shouldn't — security breach
- **Stale indexes:** Search results pointing to deleted or moved documents
- **No query enhancement:** Raw user queries are vague — expand, classify, route
- **Ignoring zero-result queries:** These are gold — they tell you what content is missing
- **Over-indexing:** Indexing everything creates noise — curate sources and set relevance thresholds
