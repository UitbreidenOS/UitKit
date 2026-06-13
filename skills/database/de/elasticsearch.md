# Elasticsearch

## Wann zu aktivieren

- Design eines Elasticsearch-Index-Mappings von Grund auf
- Schreiben von Query DSL für Volltextsuche, Filterung oder Facettennavigation
- Erstellung von Aggregationen für Analytics-Dashboards oder Such-Facetten
- Abstimmung der Suchrelevanz (Field Boosting, Function Scores, BM25-Parameter)
- Setup von Index Lifecycle Management (ILM) für Zeitreihen- oder Log-Daten
- Debugging langsamer Abfragen, hohem Speicherverbrauch oder fielddata Circuit Breaker Fehlern
- Implementierung der Paginierung mit Scroll API oder `search_after`

## Wann NICHT zu verwenden

- Das Projekt verwendet OpenSearch — die APIs ähneln sich, divergieren aber bei neueren ES-Features
- Die Aufgabe ist das Einrichten von Kibana oder Logstash — das sind separate Tools
- Die Frage betrifft rein die Application ORM-Schicht (kein Index-Design oder Query-Schreiben involviert)

## Anweisungen

### Index-Design

**Explizites Mapping schlägt dynamisches Mapping in Produktion.** Dynamisches Mapping leitet Typen zur Index-Zeit ab und kann Felder zu falschen Typen promovieren — eine numerische ID als `long` abgeleitet, dann mit einem String getroffen, bricht die Indexierung.

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

**Field-Typ-Entscheidungen:**

| Anwendungsfall | Typ |
|---|---|
| Volltextsuche | `text` mit passendem Analyzer |
| Exakte Übereinstimmung, Aggregation, Sortierung | `keyword` |
| Gleiches Feld für beide | Multi-field: `text` + `.keyword` sub-field |
| Strukturiertes Objekt, abfragbar | `nested` (separate Lucene Docs) |
| Strukturiertes Objekt, nur Filterung | `flattened` (billiger, weniger flexibel) |
| Zahlen in Range-Abfragen | `integer`, `long`, `float`, `double` |
| Zahlen nur für exakte Übereinstimmung | `keyword` (vermeidet numerischen Overhead) |
| Geo-Abfragen | `geo_point` |

**Nested vs flattened Objekte:**
- `nested`: jedes Array-Element ist ein verstecktes separates Lucene-Dokument. Verwenden wenn Sie Kombinationen innerhalb eines einzelnen Objekts abfragen müssen (z.B. "attribute name = color AND value = red").
- `flattened`: gesamtes Objekt als Keyword-Werte gespeichert. Verwenden wenn Sie nur auf einzelnen Schlüsseln filtern müssen, nicht auf Kombinationen.

### Query DSL

**`match` vs `term`:**
- `match`: analysiert, für `text` Felder — tokenisiert den Query-String vor der Suche
- `term`: exakt, unanalysiert — verwenden Sie für `keyword` Felder

```json
// Falsch: term auf text field (matched nicht tokenisierten Inhalt)
{ "term": { "name": "Blue Widget" } }

// Richtig: match auf text, term auf keyword
{ "match": { "name": "Blue Widget" } }
{ "term": { "category": "electronics" } }
```

**Bool-Query-Struktur:**
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

**`must` vs `filter`:** Verwenden Sie `filter` für Bedingungen die den Relevanz-Score nicht beeinflussen (exakte Übereinstimmung, Range, Boolean-Flags). Filter-Clauses werden gecacht; `must` Clauses nicht. Queries die in `filter` gehen können sollten immer dorthin.

**Nested-Abfrage:**
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

### Relevanz-Abstimmung

**Field Boosting in multi_match:**
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

**`function_score` — booste featured Produkte und decay nach Alter:**
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

BM25-Parameter (`k1`, `b`) können pro-Index in Settings abgestimmt werden:
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

Erhöhen Sie `k1` (default 1.2) um höhere Term-Frequency mehr zu belohnen. Verringern Sie `b` (default 0.75) um Längennormalisierung zu reduzieren — nützlich wenn Dokumentlänge stark variiert und Sie nicht möchten dass kurze Dokumente dominieren.

### Aggregationen

**Terms-Aggregation (Facetten-Navigation):**
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

**Nested-Aggregation (Facette auf nested Objekten):**
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

**Date-Histogram (Zeit-Reihen-Analytik):**
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

### Paginierung

**Standard `from`/`size`** — einfach aber begrenzt auf 10.000 Docs:
```json
{ "from": 0, "size": 20 }
```

**`search_after`** — cursor-basiert, keine Deep-Pagination-Grenze. Benötigt eindeutiges Sort-Feld:
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

Übergeben Sie die Sort-Werte des letzten Hit als `search_after` für die nächste Seite. Effizienter als `scroll` für echte Paginierung (user-facing Search).

**Scroll API** — verwenden Sie für Batch-Export / Reindexing, nicht user-facing Paginierung. Hält einen Search-Context offen:
```json
POST /products/_search?scroll=1m
{ "size": 1000, "query": { "match_all": {} } }
```
Dann: `POST /_search/scroll` mit der `scroll_id`. Löschen Sie wenn fertig.

### Index Lifecycle Management (ILM)

Für Zeit-Reihen-Daten (Logs, Events, Metrics):
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

- **Doc values** sind standardmäßig für `keyword`, numerische und `date` Felder aktiviert — sie unterstützen Sortierung und Aggregationen. Deaktivieren Sie nur für Felder die nie für diese Operationen verwendet werden.
- **Fielddata** ist heap-allokiert on-demand für `text` Felder in Aggregationen. Vermeiden Sie es — fügen Sie stattdessen ein `.keyword` sub-field hinzu.
- **Search thread pools** — monitoren Sie `_cat/thread_pool/search` auf Queue-Tiefe; eine stau queue bedeutet undersized Cluster oder zu viele concurrent Queries.
- **Segment Merging** — nach Bulk-Indexing rufen Sie `POST /index/_forcemerge?max_num_segments=1` auf um Segment-Count zu reduzieren und Query-Performance zu verbessern.
- **Refresh interval** — während Bulk-Indexing setzen Sie `"refresh_interval": "-1"`, bulk index, dann restore zu `"1s"`. Vermeidet neue Segment-Erstellung pro Refresh-Zyklus.

## Beispiel

Designen Sie einen Produktkatalog-Index mit Volltextsuche, Facetten-Filterung nach Kategorie, Preis und Rating, und einem Relevanz-Boost für Featured-Produkte.

**Index Mapping:** Verwenden Sie `text` mit `edge_ngram` Analyzer auf dem `name` Feld für Präfix-Matching. Verwenden Sie `keyword` auf `category`, `tags`. Verwenden Sie `scaled_float` für Preis. Fügen Sie `nested` Typ für `attributes` hinzu.

**Search Query:**
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

Diese Query: matched den Such-Text mit gepushtem Name-Feld, filtert auf in-stock Audio-Produkte im Preis/Rating-Bereich, verdoppelt den Score für featured-markierte Produkte, und returnt Kategorie/Preis/Rating-Aggregationen für das Facetten-Panel neben den Ergebnissen.

---
