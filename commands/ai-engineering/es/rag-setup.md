---
description: Armar un pipeline de generación aumentada por recuperación listo para producción basado en una fuente de datos y stack específicos
argument-hint: "[descripción de fuente de datos y stack preferido]"
---
Estás diseñando un pipeline de generación aumentada por recuperación (RAG) basado en: $ARGUMENTS

Si no se especifica una preferencia de stack, usa por defecto: Python, LangChain, pgvector (PostgreSQL), `claude-sonnet-4-6` para generación, `text-embedding-3-small` vía OpenAI para embeddings (cambiar a Voyage AI si el usuario especifica Anthropic exclusivamente).

**Paso 1 — Comprender los datos**

Identifica a partir de $ARGUMENTS:
- Tipo de fuente: PDFs, páginas web, filas de base de datos, archivos de código, Notion/Confluence, correos electrónicos, o mixtos
- Frecuencia de actualización: corpus estático, solo-agregación, o frecuentemente mutado
- Estimación de tamaño: <1 k documentos, 1 k–100 k, o 100 k+
- Sensibilidad: ¿PII presente? ¿Se requiere aislamiento?

Declara tus suposiciones explícitamente si no se proporcionan.

**Paso 2 — Elegir estrategia de fragmentación**

Selecciona y justifica una:
- Tamaño fijo con solapamiento (rápido, línea base)
- Semántica / ventana de oración (mejor coherencia para prosa)
- División de caracteres recursiva por estructura de documento (código, markdown)
- Recuperador de documento padre (recuperar fragmento pequeño, retornar contexto padre)

Muestra la configuración exacta del fragmentador: `chunk_size`, `chunk_overlap`, lista de separadores.

**Paso 3 — Generar el pipeline de ingesta**

Escribe un script de Python (`ingest.py`) que:
- Cargue documentos del tipo de fuente identificado arriba
- Limpie y normalice texto (elimine código repetitivo, normalice espacios en blanco, maneje codificación)
- Fragmente documentos con la estrategia elegida
- Inserte fragmentos en lotes (máx. 512 por llamada a API)
- Haga upsert en el almacén vectorial con metadatos: `source`, `chunk_index`, `ingested_at`
- Sea idempotente — ejecutar nuevamente en documentos sin cambios no re-inserta

**Paso 4 — Generar la cadena de recuperación + generación**

Escribe un módulo de Python (`rag_chain.py`) que:
- Acepte una cadena de consulta del usuario
- Inserte la consulta y recupere los fragmentos más relevantes (K por defecto=5) con reranking MMR
- Construya un prompt del sistema que instruya al modelo a responder solo desde contexto recuperado y citar fuentes por el campo de metadatos `source`
- Llame a `claude-sonnet-4-6` con almacenamiento en caché de prompts en el bloque de contexto (usa `cache_control: {"type": "ephemeral"}` en los mensajes de contexto)
- Retorne: `{"answer": str, "sources": list[str], "tokens_used": int}`

**Paso 5 — Lista de verificación operacional**

Lista como casillas de verificación:
- [ ] Estrategia de actualización del índice (re-ingesta programada vs. disparador webhook)
- [ ] Fijación de versión del modelo de embedding
- [ ] Métricas de calidad de recuperación a rastrear (MRR, recall@K)
- [ ] Alternativa cuando la confianza de recuperación es baja
- [ ] Limpieza de PII si aplica

Resultado: `ingest.py`, `rag_chain.py`, lista de verificación operacional. Sin stubs.
