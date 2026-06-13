# Elasticsearch

## Wanneer activeren

- Ontwerp van Elasticsearch-indexmapping vanaf nul
- Schrijven van Query DSL voor full-text search, filtering of facetnavigatie
- Bouw van aggregaties voor analytics-dashboards of zoekfacetten
- Afstelling van zoeklevantie (veldversterking, functiescores, BM25-parameters)
- Setup van Index Lifecycle Management (ILM) voor tijdreeksen- of loggegevens
- Debugging van langzame query's, hoog geheugengebruik of fielddata circuit breaker fouten
- Implementatie van paginering met scroll API of `search_after`

## Wanneer NIET te gebruiken

- Het project gebruikt OpenSearch — API's zijn vergelijkbaar maar divergeren op nieuwere ES-features
- De taak is het instellen van Kibana of Logstash — dat zijn aparte tools
- De vraag betreft zuiver de application ORM-laag (geen indexdesign of queryschrijven betrokken)

## Instructies

### Indexontwerp

**Expliciet mapping slaat dynamisch mapping in productie.** Dynamisch mapping leidt typen af op indextijd en kan velden naar het verkeerde type promoveren — een numerieke ID afgeleid als `long` vervolgens geraakt door een string breekt indexering.

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

**Veldtype-besluiten:**

| Gebruiksscenario | Type |
|---|---|
| Volledige tekstzoeking | `text` met passende analyzer |
| Exacte overeenkomst, aggregatie, sortering | `keyword` |
| Hetzelfde veld voor beide | Multi-veld: `text` + `.keyword` subveld |
| Gestructureerd object, opvraagbaar | `nested` (aparte Lucene-documenten) |
| Gestructureerd object, alleen filterung | `flattened` (goedkoper, minder flexibel) |
| Getallen in bereikquery's | `integer`, `long`, `float`, `double` |
| Getallen alleen voor exacte overeenkomst | `keyword` (voorkomt numerieke overhead) |
| Geoquery's | `geo_point` |

**Nested vs vlakke objecten:**
- `nested`: elk arrayelement is een verborgen afzonderlijk Lucene-document. Gebruiken wanneer u combinaties binnen één object moet opvragen (bijv. "attributnaam = kleur EN waarde = rood").
- `flattened`: heel object opgeslagen als trefwoordwaarden. Gebruiken wanneer u alleen op afzonderlijke sleutels moet filteren, niet op combinaties.

### Query DSL

**`match` vs `term`:**
- `match`: geanalyseerd, voor `text` velden — tokeniseert de querystring voordat gezocht wordt
- `term`: exact, niet geanalyseerd — gebruiken voor `keyword` velden

```json
// Verkeerd: term op textfield (matched geen getokeniseerde inhoud)
{ "term": { "name": "Blue Widget" } }

// Correct: match op text, term op keyword
{ "match": { "name": "Blue Widget" } }
{ "term": { "category": "electronics" } }
```

**Bool-querystructuur:**
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

**`must` vs `filter`:** Gebruik `filter` voor voorwaarden die het relevantiescores niet beïnvloeden (exacte overeenkomst, bereik, boolean-vlaggen). Filterlausules worden gecacht; `must`-lausen niet. Query's die in `filter` kunnen gaan moeten altijd daarheen.

**Geneste query:**
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

### Relevantieafstelling

**Veldversterking in multi_match:**
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

**`function_score` — boost aanbevolen producten en verval naar leeftijd:**
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

BM25-parameters (`k1`, `b`) kunnen per-index in instellingen worden afgestemd:
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

Verhoog `k1` (standaard 1.2) om hogere termfrequentie meer te belonen. Verlaag `b` (standaard 0.75) om lengtenormalisering te verminderen — nuttig als documentlengte sterk varieert en u niet wilt dat korte documenten domineren.

### Aggregaties

**Termsaggregatie (facetnavigatie):**
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

**Geneste aggregatie (facet op geneste objecten):**
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

**Datumhistogram (tijdreeksanalytica):**
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

### Paginering

**Standaard `from`/`size`** — eenvoudig maar beperkt tot 10.000 documenten:
```json
{ "from": 0, "size": 20 }
```

**`search_after`** — op cursor gebaseerd, geen diepe pagineringslimiet. Vereist uniek sortveld:
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

Geef de sorteerwaarden van de laatste hit als `search_after` voor de volgende pagina. Efficiënter dan `scroll` voor realtime-paginering (gebruikersgerichte zoeking).

**Scroll API** — gebruiken voor batch-export / herindexering, niet gebruikersgerichte paginering. Houdt een zoekcontext open:
```json
POST /products/_search?scroll=1m
{ "size": 1000, "query": { "match_all": {} } }
```
Vervolgens: `POST /_search/scroll` met de `scroll_id`. Schoon op wanneer gereed.

### Index Lifecycle Management (ILM)

Voor tijdreeksgegevens (logs, events, metrieken):
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

### Prestatie

- **Docwaarden** zijn standaard ingeschakeld voor `keyword`-, numerieke en `date` velden — zij ondersteunen sortering en aggregaties. Schakel alleen uit voor velden die nooit voor deze bewerkingen worden gebruikt.
- **Fielddata** is heap-toegewezen on-demand voor `text` velden in aggregaties. Vermijd het — voeg in plaats daarvan een `.keyword` subveld toe.
- **Zoekthreadpools** — controleer `_cat/thread_pool/search` op wachtrijdiepte; een achtergebleven wachtrij betekent undersized cluster of te veel gelijktijdige query's.
- **Segmentsamenvoeging** — roep na bulk-indexering `POST /index/_forcemerge?max_num_segments=1` aan om segmentaantal te verminderen en queryprestaties te verbeteren.
- **Vernieuwingsinterval** — stel tijdens bulk-indexering `"refresh_interval": "-1"` in, bulk-indexeer, herstel vervolgens naar `"1s"`. Vermijdt segmenten per vernieuwingscyclus te maken.

## Voorbeeld

Ontwerp een productcatalogusindex met full-text search, facetfiltering op categorie, prijs en rating, en relevanteversterking voor aanbevolen producten.

**Indexmapping:** Gebruik `text` met `edge_ngram` analyzer op het `name` veld voor voorvoegselovereenkomst. Gebruik `keyword` op `category`, `tags`. Gebruik `scaled_float` voor prijs. Voeg `nested` type toe voor `attributes`.

**Zoekquery:**
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

Deze query: matched zoektekst met versterkt naamveld, filtert op in-stock audioproducten in prijs-/ratingbereik, verdubbelt score voor aanbevolen-getagde producten, en retourneert categorie-/prijs-/ratingaggregaties voor het facetpaneel naast resultaten.

---
