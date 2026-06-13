---
name: rag-architect
description: "Diseño de sistema RAG: estrategias de chunking, selección de modelo de incrustación, elección de almacén vectorial, patrones de recuperación, reranking, evaluación — generación aumentada por recuperación lista para producción"
---

> 🇪🇸 Versión en español. [Versión en inglés](../rag-architect.md).

# Habilidad de Arquitecto RAG

## Cuándo activar
- Diseño de un sistema de Generación Aumentada por Recuperación desde cero
- Elegir entre estrategias de chunking para su tipo de documento
- Selección de un modelo de incrustación y almacén vectorial
- Mejora de la precisión de RAG (reducción de alucinaciones, mejora de relevancia)
- Configuración de métricas de evaluación para su pipeline RAG
- Decidir entre RAG ingenuo vs. patrones avanzados (HyDE, multi-query, etc.)

## Cuándo NO usar
- Bots de preguntas frecuentes simples con < 50 documentos — la ingeniería de prompts es suficiente
- Cuando sus datos caben en la ventana de contexto — simplemente inclúyalos
- Datos en tiempo real que cambian cada minuto — RAG en índices obsoletos no ayuda

## Instrucciones

### Diseñe la arquitectura

```
Diseñe una arquitectura RAG para este caso de uso:

Datos: [describir — PDF's / páginas web / registros de base de datos / código / correos electrónicos / etc.]
Volumen: [X documentos, total ~XMB/GB]
Tipos de consultas: [búsqueda de hechos / síntesis / comparación / análisis]
Requisito de latencia: [< Xs tiempo de respuesta]
Requisito de precisión: [¿cuál es el costo de una respuesta incorrecta?]
Stack: [Python / Node.js / nube preferida]
Presupuesto: [autohospedado / servicio administrado / sin restricción]

Diseño:
1. Pipeline de ingestión (cómo entran los datos)
2. Estrategia de chunking (cómo se dividen los documentos)
3. Modelo de incrustación (lo que convierte el texto en vectores)
4. Almacén vectorial (dónde viven los vectores)
5. Estrategia de recuperación (cómo se encuentran fragmentos relevantes)
6. Reranking (opcional pero potente)
7. Generación (prompt + modelo + ensamblaje de contexto)
8. Evaluación (cómo medir si funciona)
```

### Estrategias de chunking

```
Recomiende una estrategia de chunking para este tipo de documento.

Tipo de documento: [reportes PDF / código / contratos legales / registros de chat / artículos de noticias / documentación técnica]
Longitud promedio del documento: [X páginas / X palabras]
Patrones de consultas: [monofacto / multi-paso / requiere contexto de documento completo]

Opciones a evaluar:
1. Tamaño fijo: [X tokens] con [Y token] superposición
   - Pros: simple, predecible
   - Contras: divide oraciones/conceptos por la mitad

2. División de oraciones: divide en límites de oraciones
   - Pros: preserva unidades semánticas
   - Contras: tamaño de chunk variable, algunos chunks demasiado pequeños

3. División de caracteres recursiva: intenta párrafos → oraciones → caracteres
   - Mejor para: documentos generales

4. Chunking semántico: incrusta y divide donde la similitud del coseno cae
   - Mejor para: documentos largos con cambios de tema claros
   - Requiere: modelo de incrustación en tiempo de ingestión

5. Específico del documento: estructura de encabezados (para PDF's/docs con secciones claras)
   - Mejor para: documentación técnica, contratos legales, manuales

6. Padre-hijo / Jerárquico: chunks pequeños para recuperar, padre para contexto
   - Mejor para: requisitos de alta precisión con ventanas de contexto grandes

Recomendación para mi caso + ejemplo de implementación.
```

### Selección de modelo de incrustación

```
Ayúdeme a elegir un modelo de incrustación.

Caso de uso: [describir el tipo de contenido y consultas]
Idioma: [solo inglés / multilingüe]
Requisito de latencia: [tiempo real / batch OK]
Presupuesto: [sensibilidad a costo por token]
Autohospedaje requerido: [sí / no]

Comparar:
- OpenAI text-embedding-3-small: calidad fuerte, barato ($0.02/1M tokens), hospedado
- OpenAI text-embedding-3-large: mejor calidad de OpenAI, más caro
- Anthropic (Claude via API): use para consistencia si Claude también genera
- Cohere embed-v3: multilingüismo fuerte, dimensión 1,024 predeterminada
- Voyage AI voyage-3: excelente para código y documentación técnica
- Local: nomic-embed-text, all-MiniLM-L6-v2 (rápido, gratis, menor calidad)
- Google text-embedding-004: mejor multilingüismo a escala

Recomendación basada en mis restricciones.
```

### Patrones de recuperación

```
Diseñe la estrategia de recuperación para este sistema RAG.

Tipos de consultas que recibimos: [describir]
Modos de fallo conocidos en recuperación ingenua: [demasiado literal / pierde parafrasis / consultas multi-salto]

Patrones básicos:
1. Similitud semántica: insertar consulta, similitud de coseno top-k — línea base
2. MMR (Relevancia Marginal Máxima): recuperación consciente de la diversidad, reduce redundancia
3. Híbrido (BM25 + semántico): palabra clave + semántico, rendimiento fuerte para entidades nombradas

Patrones avanzados:
4. HyDE (Embeddings de Documentos Hipotéticos): genera una "respuesta falsa" e incrústalas
   - Bueno para: consultas donde la pregunta parece diferente de la respuesta
5. Multi-query: genera 3-5 reformulaciones, recupera cada una, deduplica
   - Bueno para: consultas ambiguas, mejora recall
6. Compresión contextual: recuperar → comprimir a oraciones relevantes → generar
   - Bueno para: chunks largos con contenido parcialmente relevante
7. Prompting paso atrás: abstraer la pregunta a nivel superior, recuperar de eso
8. FLARE: generar iterativamente, recuperar cuando la confianza cae

¿Qué patrones aplican a mi caso de uso? ¿Orden de implementación?
```

### Marco de evaluación

```
Diseñe un marco de evaluación RAG para este sistema.

Lo que "bueno" significa para mi caso de uso: [describir — precisión / integridad / fidelidad]

Métricas a rastrear:
1. Calidad de recuperación:
   - Precisión@k: ¿son los chunks recuperados relevantes?
   - Recall@k: ¿se recuperaron todos los chunks relevantes?
   - MRR (Rango Recíproco Medio): ¿está el mejor chunk clasificado primero?

2. Calidad de generación:
   - Fidelidad: ¿se adhiere la respuesta al contexto recuperado? (sin alucinación)
   - Relevancia de respuesta: ¿la respuesta responde la pregunta?
   - Relevancia de contexto: ¿se usan realmente los chunks recuperados?

Herramientas de evaluación:
- RAGAS: marco de evaluación RAG automatizado (ragas.io)
- LangChain Evaluators: verificaciones de fidelidad + corrección integradas
- Conjunto dorado manual: [X] pares pregunta-respuesta, humano o Claude como juez

Cree un conjunto de prueba de [10] pares pregunta-respuesta para mi dominio.
Configurar: ¿cuándo falla mi RAG y cómo lo sé?
```

## Ejemplo

**Usuario:** Construya RAG para una base de conocimiento interna de 5,000 páginas (páginas de Notion, PDF's, threads de Slack). Las consultas son principalmente "cómo hago X" y "cuál es nuestra política sobre Y."

**Arquitectura de Claude:**

**Chunking:** División recursiva de caracteres con chunks de 512 tokens y superposición de 50 tokens. Para threads de Slack: agrupar por thread (tratar como un chunk), no mensajes individuales.

**Incrustación:** text-embedding-3-small — costo y calidad equilibrados, solo inglés está bien aquí.

**Almacén vectorial:** Qdrant (autohospedado) o Pinecone (administrado) — en 5,000 páginas (~250K chunks), ambos lo manejan fácilmente.

**Recuperación:** Híbrido BM25 + semántico. Las consultas "política sobre Y" se benefician de coincidencia de palabras clave (BM25); "cómo hago" se beneficia de semántico. Combine con RRF (Reciprocal Rank Fusion).

**Reranking:** Cohere rerank-v3 — ejecutar top-20 a través del reranker para top-5 para generación. Mayor ganancia de calidad por el esfuerzo.

**Evaluación:** Cree 50 pares Q&A de estándar de oro de las preguntas más comunes de su equipo. Use puntuación de fidelidad RAGAS — objetivo > 0,85 antes del envío.

**Precisión esperada:** Híbrido + reranking típicamente alcanzan 75-85% precisión de respuesta en bases de conocimiento internas. Solo semántico sin reranking: ~55-65%.

---
