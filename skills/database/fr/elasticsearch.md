# Elasticsearch

## Quand activer

- Conception d'un mapping d'index Elasticsearch à partir de zéro
- Écriture de Query DSL pour recherche en texte intégral, filtrage ou navigation à facettes
- Construction d'agrégations pour tableaux de bord analytiques ou facettes de recherche
- Ajustement de la pertinence de recherche (renforcement de champ, scores de fonction, paramètres BM25)
- Configuration de la gestion du cycle de vie des index (ILM) pour données chronologiques ou journaux
- Débogage de requêtes lentes, utilisation élevée de mémoire ou erreurs de circuit breaker fielddata
- Implémentation de pagination avec API de défilement ou `search_after`

## Quand NE PAS utiliser

- Le projet utilise OpenSearch — les API sont similaires mais divergent sur les nouvelles fonctionnalités ES
- La tâche est de configurer Kibana ou Logstash — ce sont des outils distincts
- La question porte purement sur la couche ORM d'application (pas de conception d'index ou d'écriture de requête impliquée)

## Instructions

### Conception d'index

**Le mapping explicite bat le mapping dynamique en production.** Le mapping dynamique déduit les types à l'heure de l'indexation et peut promouvoir les champs au mauvais type — un ID numérique déduit comme `long` puis frappé par une chaîne casse l'indexation.

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

**Décisions de type de champ:**

| Cas d'usage | Type |
|---|---|
| Recherche en texte intégral | `text` avec analyseur approprié |
| Correspondance exacte, agrégation, tri | `keyword` |
| Même champ pour les deux | Multi-champ: `text` + sous-champ `.keyword` |
| Objet structuré, interrogeable | `nested` (documents Lucene séparés) |
| Objet structuré, filtre uniquement | `flattened` (moins cher, moins flexible) |
| Nombres utilisés dans requêtes de plage | `integer`, `long`, `float`, `double` |
| Nombres utilisés uniquement pour correspondance exacte | `keyword` (évite les frais généraux numériques) |
| Requêtes géographiques | `geo_point` |

**Objets imbriqués vs aplatis:**
- `nested`: chaque élément de tableau est un document Lucene séparé caché. Utiliser quand vous avez besoin de interroger les combinaisons au sein d'un seul objet (par exemple, "nom d'attribut = couleur ET valeur = rouge").
- `flattened`: objet entier stocké comme valeurs de mot-clé. Utiliser quand vous avez besoin uniquement de filtrer sur des clés individuelles, pas des combinaisons.

### Query DSL

**`match` vs `term`:**
- `match`: analysé, pour les champs `text` — tokenise la chaîne de requête avant de chercher
- `term`: exact, non analysé — utiliser pour les champs `keyword`

```json
// Mauvais: term sur un champ text (ne correspond pas au contenu tokenisé)
{ "term": { "name": "Blue Widget" } }

// Correct: match sur text, term sur keyword
{ "match": { "name": "Blue Widget" } }
{ "term": { "category": "electronics" } }
```

**Structure de requête bool:**
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

**`must` vs `filter`:** Utilisez `filter` pour les conditions qui ne affectent pas le score de pertinence (correspondance exacte, plage, drapeaux booléens). Les clauses de filtre sont mises en cache; les clauses `must` ne le sont pas. Les requêtes qui peuvent aller dans `filter` devraient toujours y aller.

**Requête imbriquée:**
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

### Ajustement de pertinence

**Renforcement de champ en multi_match:**
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

**`function_score` — stimuler les produits en vedette et décroître par âge:**
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

Les paramètres BM25 (`k1`, `b`) peuvent être ajustés par index dans les paramètres:
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

Augmentez `k1` (par défaut 1.2) pour récompenser davantage la fréquence des termes plus élevée. Diminuez `b` (par défaut 0.75) pour réduire la normalisation de longueur — utile quand la longueur du document varie énormément et que vous ne voulez pas que les documents courts dominent.

### Agrégations

**Agrégation de termes (navigation à facettes):**
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

**Agrégation imbriquée (facette sur objets imbriqués):**
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

**Histogramme de dates (analytique de séries chronologiques):**
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

**`from`/`size` standard** — simple mais limité à 10 000 docs:
```json
{ "from": 0, "size": 20 }
```

**`search_after`** — basé sur le curseur, pas de limite de pagination profonde. Nécessite un champ de tri unique:
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

Transmettez les valeurs de tri du dernier hit comme `search_after` pour la page suivante. Plus efficace que `scroll` pour la pagination en temps réel (recherche orientée utilisateur).

**API Scroll** — utiliser pour export par lot / réindexation, pas la pagination orientée utilisateur. Maintient un contexte de recherche ouvert:
```json
POST /products/_search?scroll=1m
{ "size": 1000, "query": { "match_all": {} } }
```
Ensuite: `POST /_search/scroll` avec le `scroll_id`. Effacez quand vous avez terminé.

### Gestion du cycle de vie des index (ILM)

Pour les données de séries chronologiques (journaux, événements, métriques):
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

- **Les valeurs de doc** sont activées par défaut pour les champs `keyword`, numériques et `date` — elles alimentent le tri et les agrégations. Désactivez uniquement pour les champs jamais utilisés pour ces opérations.
- **Fielddata** est alloué en tas à la demande pour les champs `text` utilisés dans les agrégations. Évitez-le — ajoutez un sous-champ `.keyword` à la place.
- **Pools de threads de recherche** — surveillez `_cat/thread_pool/search` pour la profondeur de la file d'attente; une file d'attente sauvegardée signifie un cluster sous-dimensionné ou trop de requêtes simultanées.
- **Fusion de segments** — après indexation en masse, appelez `POST /index/_forcemerge?max_num_segments=1` pour réduire le nombre de segments et améliorer les performances de requête.
- **Intervalle d'actualisation** — pendant l'indexation en masse, définissez `"refresh_interval": "-1"`, indexez en masse, puis restaurez à `"1s"`. Évite de créer un nouveau segment par cycle d'actualisation.

## Exemple

Concevez un index de catalogue de produits avec recherche en texte intégral, filtrage à facettes par catégorie, prix et note, et un renforcement de pertinence pour les produits en vedette.

**Mapping d'index:** Utilisez `text` avec un analyseur `edge_ngram` sur le champ `name` pour la correspondance de préfixe. Utilisez `keyword` sur `category`, `tags`. Utilisez `scaled_float` pour le prix. Ajoutez un type `nested` pour `attributes`.

**Requête de recherche:**
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

Cette requête: correspond au texte de recherche avec le champ de nom renforcé, filtre les produits audio en stock dans la plage prix/note, double le score des produits marqués featured, et retourne les agrégations catégorie/prix/note pour le panneau de facette à côté des résultats.

---
