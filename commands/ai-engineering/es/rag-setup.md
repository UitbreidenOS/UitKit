---
description: Construir un pipeline de RAG listo para producción para una fuente de datos y stack determinados
argument-hint: "[data source description and preferred stack]"
---
Estás diseñando un pipeline de generación aumentada por recuperación basado en: $ARGUMENTS

Si no se proporciona preferencia de stack, usa por defecto: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` para generación, `text-embedding-3-small` a través de OpenAI para embeddings (cambiar a Voyage AI si el usuario especifica solo Anthropic).

**Paso 1 — Entender los datos**

Identifica de $ARGUMENTS:
- Tipo de fuente: PDFs, páginas web, filas de base de datos, archivos de código, Notion/Confluence, correos electrónicos, o mixtos
- Frecuencia de actualización: corpus estático, solo adiciones, o mutaciones frecuentes
- Estimación de tamaño: <1 k documentos, 1 k–100 k, o 100 k+
- Sensibilidad: ¿Hay PII presente? ¿Se requiere aire aislado?

Establece tus suposiciones explícitamente si no se proporcionan.

**Paso 2 — Elegir estrategia de fragmentación**

Selecciona y justifica una:
- Tamaño fijo con superposición (rápido, línea base)
- Semántico / ventana de oraciones (mejor coherencia para prosa)
- División de caracteres recursivos por estructura de documento (código, markdown)
- Recuperador de documento padre (recupera fragmento pequeño, devuelve contexto padre)

Muestra la configuración exacta del fragmentador: `chunk_size`, `chunk_overlap`, lista de separadores.

**Paso 3 — Generar el pipeline de ingesta**

Escribe un script de Python (`ingest.py`) que:
- Cargue documentos desde el tipo de fuente identificado arriba
- Limpie y normalice texto (eliminar contenido no esencial, normalizar espacios en blanco, manejar codificación)
- Fragmente documentos con la estrategia elegida
- Incruste fragmentos en lotes (máximo 512 por llamada API)
- Realice upsert en el almacén vectorial con metadatos: `source`, `chunk_index`, `ingested_at`
- Sea idempotente — ejecutar nuevamente en documentos sin cambios no re-incrusta

**Paso 4 — Generar la cadena de recuperación + generación**

Escribe un módulo de Python (`rag_chain.py`) que:
- Acepte una cadena de consulta del usuario
- Incruste la consulta y recupere los fragmentos principales (K predeterminado=5) con reranking MMR
- Construya un prompt del sistema que indique al modelo responder solo desde el contexto recuperado y citar fuentes por el campo de metadatos `source`
- Llame a `claude-sonnet-4-6` con almacenamiento en caché de prompt en el bloque de contexto (usa `cache_control: {"type": "ephemeral"}` en los mensajes de contexto)
- Devuelve: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Paso 5 — Lista de verificación operacional**

Lista como casillas de verificación:
- [ ] Estrategia de actualización de índices (re-ingesta programada vs. disparador webhook)
- [ ] Fijación de versión del modelo de embedding
- [ ] Métricas de calidad de recuperación a rastrear (MRR, recall@K)
- [ ] Alternativa cuando la confianza de recuperación es baja
- [ ] Limpieza de PII si es aplicable

Salida: `ingest.py`, `rag_chain.py`, lista de verificación operacional. Sin fragmentos.
