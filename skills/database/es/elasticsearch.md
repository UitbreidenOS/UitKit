# Elasticsearch

## Cuándo activar

- Diseñar un mapeo de índice Elasticsearch desde cero
- Escribir Query DSL para búsqueda de texto completo, filtrado o navegación por facetas
- Construir agregaciones para dashboards analíticos o facetas de búsqueda
- Ajustar la relevancia de búsqueda (impulso de campo, puntuaciones de función, parámetros BM25)
- Configurar Index Lifecycle Management (ILM) para datos de series de tiempo o registros
- Depurar consultas lentas, uso alto de memoria o errores de circuit breaker fielddata
- Implementar paginación con API de scroll o `search_after`

## Cuándo NO usar

- El proyecto usa OpenSearch — las API son similares pero divergen en características ES más nuevas
- La tarea es configurar Kibana o Logstash — esas son herramientas separadas
- La pregunta es puramente sobre la capa ORM de aplicación (sin diseño de índice o escritura de consulta involucrada)

## Instrucciones

### Diseño de índice

**El mapeo explícito vence al mapeo dinámico en producción.** El mapeo dinámico deduce tipos al tiempo de indexación y puede promover campos al tipo incorrecto — un ID numérico deducido como `long` luego golpeado con una cadena rompe la indexación.

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

**Decisiones de tipo de campo:**

| Caso de uso | Tipo |
|---|---|
| Búsqueda de texto completo | `text` con analizador apropiado |
| Coincidencia exacta, agregación, clasificación | `keyword` |
| Mismo campo para ambos | Multicampo: `text` + subcampo `.keyword` |
| Objeto estructurado, consultable | `nested` (documentos Lucene separados) |
| Objeto estructurado, solo filtrado | `flattened` (más barato, menos flexible) |
| Números usados en consultas de rango | `integer`, `long`, `float`, `double` |
| Números usados solo para coincidencia exacta | `keyword` (evita sobrecarga numérica) |
| Consultas geográficas | `geo_point` |

**Objetos anidados vs aplanados:**
- `nested`: cada elemento de matriz es un documento Lucene separado oculto. Utilizar cuando necesites consultar combinaciones dentro de un único objeto (p. ej., "nombre de atributo = color Y valor = rojo").
- `flattened`: objeto completo almacenado como valores de palabra clave. Utilizar cuando solo necesites filtrar en claves individuales, no combinaciones.

### Query DSL

**`match` vs `term`:**
- `match`: analizado, para campos `text` — tokeniza la cadena de consulta antes de buscar
- `term`: exacto, no analizado — usar para campos `keyword`

```json
// Incorrecto: term en campo text (no coincide con contenido tokenizado)
{ "term": { "name": "Blue Widget" } }

// Correcto: match en text, term en keyword
{ "match": { "name": "Blue Widget" } }
{ "term": { "category": "electronics" } }
```

**Estructura de consulta bool:**
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

**`must` vs `filter`:** Usa `filter` para condiciones que no afectan la puntuación de relevancia (coincidencia exacta, rango, banderas booleanas). Las cláusulas de filtro se almacenan en caché; las cláusulas `must` no. Las consultas que pueden ir en `filter` siempre deberían ir allí.

**Consulta anidada:**
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

### Sintonización de relevancia

**Impulso de campo en multi_match:**
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

**`function_score` — impulsa productos destacados y decremento por antigüedad:**
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

Los parámetros BM25 (`k1`, `b`) se pueden ajustar por índice en configuración:
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

Aumenta `k1` (predeterminado 1.2) para recompensar más frecuencia de término más alta. Disminuye `b` (predeterminado 0.75) para reducir la normalización de longitud — útil cuando la longitud del documento varía ampliamente y no deseas que los documentos cortos dominen.

### Agregaciones

**Agregación de términos (navegación por facetas):**
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

**Agregación anidada (faceta en objetos anidados):**
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

**Histograma de fechas (análisis de series de tiempo):**
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

### Paginación

**`from`/`size` estándar** — simple pero limitado a 10.000 documentos:
```json
{ "from": 0, "size": 20 }
```

**`search_after`** — basado en cursor, sin límite de paginación profunda. Requiere campo de clasificación único:
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

Pasa los valores de clasificación del último hit como `search_after` para la siguiente página. Más eficiente que `scroll` para paginación en tiempo real (búsqueda orientada al usuario).

**API Scroll** — usar para exportación por lotes / reindexación, no paginación orientada al usuario. Mantiene un contexto de búsqueda abierto:
```json
POST /products/_search?scroll=1m
{ "size": 1000, "query": { "match_all": {} } }
```
Luego: `POST /_search/scroll` con el `scroll_id`. Limpia cuando termines.

### Index Lifecycle Management (ILM)

Para datos de series de tiempo (registros, eventos, métricas):
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

### Desempeño

- **Los valores de documento** están habilitados de forma predeterminada para campos `keyword`, numéricos y `date` — alimentan clasificación y agregaciones. Deshabilita solo para campos nunca usados para estas operaciones.
- **Fielddata** se asigna en montón bajo demanda para campos `text` usados en agregaciones. Evítalo — agrega un subcampo `.keyword` en su lugar.
- **Grupos de threads de búsqueda** — monitorea `_cat/thread_pool/search` para profundidad de cola; una cola atrasada significa cluster subdimensionado o demasiadas consultas concurrentes.
- **Fusión de segmentos** — después de indexación por lotes, llama a `POST /index/_forcemerge?max_num_segments=1` para reducir el recuento de segmentos y mejorar el desempeño de consultas.
- **Intervalo de actualización** — durante la indexación por lotes, establece `"refresh_interval": "-1"`, indexa por lotes, luego restaura a `"1s"`. Evita crear un nuevo segmento por ciclo de actualización.

## Ejemplo

Diseña un índice de catálogo de productos con búsqueda de texto completo, filtrado por facetas de categoría, precio y calificación, e impulso de relevancia para productos destacados.

**Mapeo de índice:** Usa `text` con analizador `edge_ngram` en el campo `name` para coincidencia de prefijo. Usa `keyword` en `category`, `tags`. Usa `scaled_float` para precio. Agrega tipo `nested` para `attributes`.

**Consulta de búsqueda:**
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

Esta consulta: coincide con el texto de búsqueda con el campo de nombre impulsado, filtra productos de audio en stock en el rango precio/calificación, duplica la puntuación para productos etiquetados como destacados, y devuelve agregaciones de categoría/precio/calificación para el panel de facetas junto con los resultados.

---
