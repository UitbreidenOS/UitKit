---
name: elasticsearch
description: - Designing an Elasticsearch index mapping from scratch
updated: 2026-06-13
---

# Elasticsearch

## When to activate

- Designing an Elasticsearch index mapping from scratch
- Writing Query DSL for full-text search, filtering, or faceted navigation
- Building aggregations for analytics dashboards or search facets
- Tuning search relevance (field boosting, function scores, BM25 parameters)
- Setting up Index Lifecycle Management (ILM) for time-series or log data
- Debugging slow queries, high memory usage, or fielddata circuit breaker errors
- Implementing pagination with scroll API or `search_after`

## When NOT to use

- The project uses OpenSearch — the APIs are similar but diverge at newer ES features
- The task is setting up Kibana or Logstash — those are separate tools
- The question is purely about the application ORM layer (no index design or query writing involved)

## Instructions

### Index Design

**Explicit mapping beats dynamic mapping in production.** Dynamic mapping infers types at index time and can promote fields to the wrong type — a numeric ID inferred as `long` then hit with a string breaks indexing.

```json
PUT /products
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "analysis": {
      "analyzer": {
        "product_name_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "edge_ngram_filter"]
        }
      },
      "filter": {
        "edge_ngram_filter": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 20
        }
      }
    }
  },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "id":          { "type": "keyword" },
      "name":        { "type": "text", "analyzer": "product_name_analyzer", "search_analyzer": "standard" },
      "name_exact":  { "type": "keyword" },
      "description": { "type": "text" },
      "price":       { "type": "scaled_float", "scaling_factor": 100 },
      "category":    { "type": "keyword" },
      "tags":        { "type": "keyword" },
      "in_stock":    { "type": "boolean" },
      "rating":      { "type": "float" },
      "created_at":  { "type": "date" },
      "attributes": {
        "type": "nested",
        "properties": {
          "name":  { "type": "keyword" },
          "value": { "type": "keyword" }
        }
      }
    }
  }
}
```

**Field type decisions:**

| Use case | Type |
|---|---|
| Full-text search | `text` with appropriate analyzer |
| Exact match, aggregation, sorting | `keyword` |
| Same field for both | Multi-field: `text` + `.keyword` sub-field |
| Structured object, queryable | `nested` (separate Lucene docs) |
| Structured object, filter-only | `flattened` (cheaper, less flexible) |
| Numbers used in range queries | `integer`, `long`, `float`, `double` |
| Numbers used only for exact match | `keyword` (avoids numeric range overhead) |
| Geo queries | `geo_point` |

**Nested vs flattened objects:**
- `nested`: each array element is a hidden separate Lucene document. Use when you need to query combinations within a single object (e.g., "attribute name = color AND value = red").
- `flattened`: entire object stored as keyword values. Use when you only need to filter on individual keys, not combinations.

### Query DSL

**`match` vs `term`:**
- `match`: analyzed, for `text` fields — tokenizes the query string before searching
- `term`: exact, unanalyzed — use for `keyword` fields

```json
// Wrong: term on a text field (won't match tokenized content)
{ "term": { "name": "Blue Widget" } }

// Right: match on text, term on keyword
{ "match": { "name": "Blue Widget" } }
{ "term": { "category": "electronics" } }
```

**Bool query structure:**
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "wireless headphones" } }
      ],
      "filter": [
        { "term": { "category": "audio" } },
        { "term": { "in_stock": true } },
        { "range": { "price": { "gte": 50, "lte": 300 } } }
      ],
      "should": [
        { "term": { "tags": "featured" } }
      ],
      "must_not": [
        { "term": { "tags": "discontinued" } }
      ],
      "minimum_should_match": 0
    }
  }
}
```

**`must` vs `filter`:** Use `filter` for conditions that do not affect relevance score (exact match, range, boolean flags). Filter clauses are cached; `must` clauses are not. Queries that can go in `filter` should always go in `filter`.

**Nested query:**
```json
{
  "query": {
    "nested": {
      "path": "attributes",
      "query": {
        "bool": {
          "must": [
            { "term": { "attributes.name": "color" } },
            { "term": { "attributes.value": "red" } }
          ]
        }
      }
    }
  }
}
```

### Relevance Tuning

**Field boosting in multi_match:**
```json
{
  "query": {
    "multi_match": {
      "query": "wireless headphones",
      "fields": ["name^3", "description^1", "tags^2"],
      "type": "best_fields",
      "tie_breaker": 0.3
    }
  }
}
```

**`function_score` — boost featured products and decay by age:**
```json
{
  "query": {
    "function_score": {
      "query": { "match": { "name": "headphones" } },
      "functions": [
        {
          "filter": { "term": { "tags": "featured" } },
          "weight": 2.5
        },
        {
          "gauss": {
            "created_at": {
              "origin": "now",
              "scale": "30d",
              "decay": 0.5
            }
          }
        },
        {
          "field_value_factor": {
            "field": "rating",
            "modifier": "log1p",
            "factor": 1.2,
            "missing": 1
          }
        }
      ],
      "score_mode": "multiply",
      "boost_mode": "multiply"
    }
  }
}
```

BM25 parameters (`k1`, `b`) can be tuned per-index in settings:
```json
{
  "settings": {
    "similarity": {
      "default": {
        "type": "BM25",
        "k1": 1.5,
        "b": 0.75
      }
    }
  }
}
```

Increase `k1` (default 1.2) to reward higher term frequency more. Decrease `b` (default 0.75) to reduce length normalization — useful when document length varies widely and you don't want short documents to dominate.

### Aggregations

**Terms aggregation (faceted navigation):**
```json
{
  "aggs": {
    "by_category": {
      "terms": {
        "field": "category",
        "size": 20,
        "order": { "_count": "desc" }
      }
    },
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 50 },
          { "from": 50, "to": 150 },
          { "from": 150, "to": 500 },
          { "from": 500 }
        ]
      }
    },
    "avg_rating": {
      "avg": { "field": "rating" }
    }
  }
}
```

**Nested aggregation (facet on nested objects):**
```json
{
  "aggs": {
    "attributes": {
      "nested": { "path": "attributes" },
      "aggs": {
        "attribute_names": {
          "terms": { "field": "attributes.name" },
          "aggs": {
            "attribute_values": {
              "terms": { "field": "attributes.value" }
            }
          }
        }
      }
    }
  }
}
```

**Date histogram (time-series analytics):**
```json
{
  "aggs": {
    "orders_over_time": {
      "date_histogram": {
        "field": "created_at",
        "calendar_interval": "1d",
        "time_zone": "UTC",
        "min_doc_count": 0
      },
      "aggs": {
        "revenue": { "sum": { "field": "price" } }
      }
    }
  }
}
```

### Pagination

**Standard `from`/`size`** — simple but limited to 10,000 docs:
```json
{ "from": 0, "size": 20 }
```

**`search_after`** — cursor-based, no deep pagination limit. Requires a unique sort field:
```json
{
  "sort": [
    { "created_at": "desc" },
    { "id": "asc" }
  ],
  "search_after": ["2024-03-15T10:00:00Z", "prod_abc123"],
  "size": 20
}
```

Pass the last hit's sort values as `search_after` for the next page. More efficient than `scroll` for real-time pagination (user-facing search).

**Scroll API** — use for batch export / reindexing, not user-facing pagination. Holds a search context open:
```json
POST /products/_search?scroll=1m
{ "size": 1000, "query": { "match_all": {} } }
```
Then: `POST /_search/scroll` with the `scroll_id`. Clear when done.

### Index Lifecycle Management (ILM)

For time-series data (logs, events, metrics):
```json
PUT /_ilm/policy/logs-policy
{
  "policy": {
    "phases": {
      "hot":  { "actions": { "rollover": { "max_size": "50gb", "max_age": "7d" } } },
      "warm": { "min_age": "7d",  "actions": { "forcemerge": { "max_num_segments": 1 }, "allocate": { "require": { "data": "warm" } } } },
      "cold": { "min_age": "30d", "actions": { "allocate": { "require": { "data": "cold" } } } },
      "delete": { "min_age": "90d", "actions": { "delete": {} } }
    }
  }
}
```

### Performance

- **Doc values** are enabled by default for `keyword`, `numeric`, and `date` fields — they power sorting and aggregations. Only disable for fields never used for these operations.
- **Fielddata** is heap-allocated on demand for `text` fields used in aggregations. Avoid it — add a `.keyword` sub-field instead.
- **Search thread pools** — monitor `_cat/thread_pool/search` for queue depth; a backed-up queue means undersized cluster or too many concurrent queries.
- **Segment merging** — after bulk indexing, call `POST /index/_forcemerge?max_num_segments=1` to reduce segment count and improve query performance.
- **Refresh interval** — during bulk indexing, set `"refresh_interval": "-1"`, bulk index, then restore to `"1s"`. Avoids creating a new segment per refresh cycle.

## Example

Design a product catalog index with full-text search, faceted filtering by category, price, and rating, and a relevance boost for featured products.

**Index mapping:** Use `text` with an `edge_ngram` analyzer on the `name` field for prefix matching. Use `keyword` on `category`, `tags`. Use `scaled_float` for price. Add a `nested` type for `attributes`.

**Search query:**
```json
{
  "query": {
    "function_score": {
      "query": {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": "bluetooth speaker",
                "fields": ["name^3", "description"],
                "type": "best_fields"
              }
            }
          ],
          "filter": [
            { "term":  { "category": "audio" } },
            { "term":  { "in_stock": true } },
            { "range": { "price": { "gte": 30, "lte": 200 } } },
            { "range": { "rating": { "gte": 4.0 } } }
          ]
        }
      },
      "functions": [
        { "filter": { "term": { "tags": "featured" } }, "weight": 2.0 },
        { "field_value_factor": { "field": "rating", "modifier": "sqrt", "factor": 1.5, "missing": 1 } }
      ],
      "score_mode": "sum",
      "boost_mode": "multiply"
    }
  },
  "aggs": {
    "categories": { "terms": { "field": "category", "size": 10 } },
    "price_histogram": { "histogram": { "field": "price", "interval": 50 } },
    "avg_rating": { "avg": { "field": "rating" } }
  },
  "sort": [{ "_score": "desc" }],
  "size": 24
}
```

This query: matches the search text with boosted name field, filters to in-stock audio products in the price/rating range, doubles the score for featured-tagged products, and returns category/price/rating aggregations for the facet panel alongside the results.

---
