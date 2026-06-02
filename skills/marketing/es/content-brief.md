---
name: content-brief
description: "Briefing de contenido optimizado para SEO: targeting de palabras clave, esquema, brechas de competidores, enlaces internos, CTA"
---

# Habilidad Content Brief

## Cuándo activar
- Informando a un escritor (humano o IA) antes de producir una publicación de blog, página de destino o guía
- Asegurando que los fundamentos de SEO estén integrados antes de que comience la escritura, no después
- Identificando qué le falta al contenido de los competidores antes de elegir tu ángulo
- Estructurando contenido de formato largo para que obtenga fragmentos destacados y posicione bien
- Estandarizando la calidad del briefing en un equipo de contenido para que cada pieza cumpla el mismo estándar

## Cuándo NO usar
- Publicaciones cortas en redes sociales — demasiado ligeras para hacer un briefing de esta manera
- Documentos internos, POEs o presentaciones de ventas — estructura diferente, no orientado al SEO
- Estás escribiendo el contenido tú mismo sin un briefing — simplemente empieza a escribir
- Contenido de oportunidad / reactivo — la velocidad importa más que la profundidad del briefing aquí

## Instrucciones

### Prompt principal del briefing de contenido

```
Genera un briefing de contenido SEO completo para esta pieza.

Palabra clave objetivo: [palabra clave principal]
Palabras clave secundarias: [lista de 3-5 términos relacionados]
Audiencia objetivo: [persona específica — cargo, contexto, problema que está intentando resolver]
Tipo de contenido: [cómo-hacerlo / listicle / comparación / caso de estudio / pilar / opinión]
Recuento de palabras objetivo: [basado en análisis de competidores — pídele a Claude que recomiende si no estás seguro]
Publicación: [blog de la empresa / artículo invitado / página de destino]
CTA de negocio: [qué queremos que el lector haga al final]
Tono: [autoritativo / conversacional / técnico / accesible]
URLs de competidores a superar: [las 3-5 páginas mejor posicionadas para la palabra clave principal]

Produce:

## 1. Estrategia de palabras clave
- Palabra clave principal: [coincidencia exacta, estimación de volumen de búsqueda, dificultad]
- Palabras clave semánticas a incluir: [términos LSI, variantes de preguntas, menciones de entidades]
- Oportunidad de fragmento destacado: [sí/no, y qué formato debe apuntar]
- Intención de búsqueda: [informacional / navegacional / comercial / transaccional]

## 2. Análisis de brechas de competidores
Para cada URL de la competencia:
- Lo que cubren bien (no lo ignores — iguálalo o supéralo)
- Lo que les falta (tu ángulo de diferenciación)
- Recuento de palabras y profundidad del contenido
- Datos únicos, ejemplos o perspectivas que les faltan

## 3. Ángulo recomendado
Una oración: por qué esta pieza posicionará Y será compartida por encima de los competidores.

## 4. Esquema completo del contenido
Con H2 y H3, recuento estimado de palabras por sección y notas para el escritor.

## 5. Enlaces internos
- 3-5 páginas de nuestro sitio que deberían enlazar A esta pieza
- 3-5 piezas existentes a las que esta nueva pieza debería enlazar

## 6. Meta título, meta descripción y slug de URL

## 7. Lista de verificación SEO on-page
```

### Marco de estrategia de palabras clave

```typescript
interface ContentBrief {
  keyword: {
    primary: string
    volume: string            // monthly searches (approximate)
    difficulty: number        // 0-100 (Ahrefs KD equivalent)
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
    featuredSnippetFormat: 'paragraph' | 'list' | 'table' | 'none'
  }
  semanticKeywords: string[]  // include naturally in the content
  entityKeywords: string[]    // people, tools, brands to mention for topical depth
  questionKeywords: string[]  // "People Also Ask" targets → answer in H2/H3s

  competitors: Array<{
    url: string
    wordCount: number
    strengths: string[]       // what they do well
    gaps: string[]            // what they miss
    differentiator: string    // how to beat this specific URL
  }>

  brief: {
    recommendedWordCount: number
    sections: Array<{
      heading: string         // H2 or H3
      level: 'H2' | 'H3'
      purpose: string         // what this section accomplishes
      wordCount: number       // target for this section
      writerNote: string      // specific guidance (include stat, example, table, etc.)
    }>
  }
}
```

### Prompt de análisis de brechas de competidores

```
Ejecuta un análisis de brechas de contenido de competidores para: [PALABRA CLAVE PRINCIPAL]

URLs mejor posicionadas:
1. [URL 1]
2. [URL 2]
3. [URL 3]

Para cada URL, identifica:
1. Ángulo principal y tesis
2. Profundidad del contenido (qué temas se cubren vs. se tocan superficialmente)
3. Datos únicos, investigaciones o ejemplos que citan
4. Elecciones de formato (tablas, listas, capturas de pantalla, incrustaciones de video)
5. Temas que faltan que un lector todavía querría después de leer esto
6. Secciones más débiles (contenido superficial, información desactualizada, consejos genéricos)

Luego produce:
- Nuestra matriz de diferenciación: 3 ángulos que ninguno de los 3 primeros cubre
- La "única cosa" que debemos poseer en esta pieza que los competidores no tienen
- Tipos de evidencia que debemos incluir (datos originales, citas de expertos, casos de estudio)
- Recuento de palabras recomendado para superar el promedio de los 3 primeros
```

### Generador de esquema de contenido

```
Genera un esquema de contenido detallado.

Tema: [título o título de trabajo]
Palabra clave principal: [palabra clave]
Audiencia: [perfil del lector]
Objetivo de la pieza: [qué logra el lector al leer de principio a fin]

FORMATO DEL ESQUEMA:
Para cada sección:
H2: [Encabezado de la sección — consciente de la palabra clave pero sin sobreutilizarla]
  Propósito: [qué logra esta sección para el lector]
  Puntos clave: [2-3 puntos que el escritor debe abordar]
  Recomendación de formato: [párrafo / lista / tabla / ejemplo / captura de pantalla]
  Recuento de palabras: [objetivo para esta sección]
  Nota para el escritor: [instrucción específica — p.ej. "incluye un ejemplo real de cliente aquí"]

Requisitos de la introducción:
- Gancho en la primera oración (estadística, pregunta o afirmación audaz)
- Establece el problema del lector en las oraciones 2-3
- Promete el resultado ("al final de esto sabrás...")
- SIN aperturas del tipo "En este artículo veremos..."
- Incluye la palabra clave principal de forma natural en las primeras 100 palabras

Requisitos de la conclusión:
- Resume las 3 conclusiones más importantes
- CTA: [específico — "descarga la plantilla" / "reserva una demo" / "suscríbete"]
- Lectura relacionada: [2 enlaces internos]
```

### Lista de verificación SEO on-page

```
Antes de publicar, verifica:

ETIQUETA DE TÍTULO (meta título):
- [ ] Contiene la palabra clave principal
- [ ] Menos de 60 caracteres
- [ ] Atractivo — tiene una palabra de poder (Mejor, Completo, Definitivo, Guía, etc.)
- [ ] No duplica otro título en el sitio

META DESCRIPCIÓN:
- [ ] 150-160 caracteres
- [ ] Contiene la palabra clave principal
- [ ] Tiene una propuesta de valor clara o gancho
- [ ] Termina con un CTA suave o bucle abierto

SLUG DE URL:
- [ ] Corto (2-4 palabras)
- [ ] Contiene la palabra clave principal
- [ ] Todo en minúsculas, con guiones, sin palabras vacías

H1:
- [ ] Contiene la palabra clave principal
- [ ] Diferente redacción de la etiqueta de título (está bien variar)
- [ ] Solo un H1

H2 y H3:
- [ ] 3-8 H2 (hoja de ruta del contenido para el lector)
- [ ] Palabra clave principal en al menos un H2
- [ ] Palabras clave secundarias y preguntas en H2/H3
- [ ] Sin sobreutilización de palabras clave — los encabezados deben ser descriptivos

CONTENIDO DEL CUERPO:
- [ ] Palabra clave principal en el primer párrafo
- [ ] Densidad de palabras clave 0,5-1,5% (natural, no forzada)
- [ ] Palabras clave semánticas y LSI distribuidas por todo el texto
- [ ] Al menos una tabla, lista o elemento estructurado (objetivo de fragmento)
- [ ] Cada imagen tiene texto alternativo (descriptivo, con palabra clave donde sea natural)

ENLACES INTERNOS:
- [ ] 3-5 enlaces a contenido existente en el sitio
- [ ] El texto del enlace es descriptivo (no "haz clic aquí")
- [ ] Al menos un enlace desde una página de alta autoridad existente hacia esta pieza

ENLACES EXTERNOS:
- [ ] Enlaza a 2-4 fuentes autorizadas (estadísticas, investigaciones, herramientas)
- [ ] Configura los enlaces externos como rel="noopener" (no nofollow a menos que sea de pago/UGC)

MARCADO DE ESQUEMA:
- [ ] Esquema de artículo (siempre)
- [ ] Esquema de FAQ si tienes una sección de preguntas y respuestas
- [ ] Esquema HowTo si es un tutorial/paso a paso
```

### Orientación hacia fragmentos destacados

```
Optimiza este contenido para capturar el fragmento destacado para: [PALABRA CLAVE]

Titular actual del fragmento (si lo hay): [URL y texto del fragmento]

Formatos de fragmentos destacados según el tipo de palabra clave:
- "Cómo [tarea]" → Lista numerada paso a paso con un H2 que es la pregunta exacta
- "Qué es [término]" → Párrafo de definición de 2-3 oraciones bajo un H2 que refleja la pregunta
- "Mejor [herramientas/opciones]" → Tabla con columnas de nombre/función/precio, o lista ordenada
- "[Término] vs [Término]" → Tabla comparativa, luego explicación en prosa

Instrucciones para la estructura orientada a fragmentos:
1. Usa la pregunta exacta como encabezado H2
2. Respóndela directa y completamente en las primeras 40-60 palabras bajo ese encabezado
3. Para fragmentos de lista: usa <ol> o <ul> inmediatamente después del encabezado
4. Para fragmentos de tabla: usa una tabla HTML correcta con encabezados
5. Luego amplía con párrafos de detalle (Claude lee más allá del fragmento)
6. NO entierres la respuesta — ponla primero, explica después

Escribe el encabezado H2 optimizado y la sección de apertura:
```

### Plantilla de briefing (copiar y pegar para escritores)

```markdown
# Briefing de Contenido: [TÍTULO]

**Palabra clave principal:** [palabra clave] | Volumen: [X/mes] | Dificultad: [X/100]
**Palabras clave secundarias:** [lista]
**Recuento de palabras objetivo:** [X palabras]
**Fecha de publicación objetivo:** [fecha]
**Escritor:** [nombre]
**Revisión del editor antes del:** [fecha]

## Audiencia
[Cargo], [tamaño de la empresa], [problema específico que están resolviendo con esta búsqueda].
Están en [etapa de consciencia: consciente del problema / consciente de la solución / consciente del producto].

## Intención de búsqueda
[¿Qué quiere lograr el lector al buscar esta palabra clave? ¿Qué formato espera?]

## Ángulo recomendado
[Una oración — por qué nuestra pieza será mejor que los 3 resultados principales actuales]

## Esquema

### Introducción (~150 palabras)
Gancho con: [estadística / pregunta / afirmación audaz]
Establece el problema: [con qué está luchando el lector]
Promete el resultado: [qué sabrán al final]

### H2: [Título de la sección 1] (~300 palabras)
[Puntos clave que el escritor debe cubrir]
[Formato: párrafo/lista/tabla]
[Nota para el escritor: instrucción específica]

### H2: [Título de la sección 2] (~400 palabras)
...

### Conclusión (~200 palabras)
Resumen: [3 conclusiones clave]
CTA: [acción específica]
Relacionado: [2 enlaces internos]

## Requisitos de SEO
- [ ] Palabra clave principal en las primeras 100 palabras
- [ ] H2 que sea una pregunta de "People Also Ask"
- [ ] Una tabla o lista numerada (objetivo de fragmento)
- [ ] 4+ enlaces internos
- [ ] Todas las imágenes con texto alternativo descriptivo

## Meta
**Etiqueta de título:** [máx. 60 caracteres] [BORRADOR]
**Meta descripción:** [máx. 155 caracteres] [BORRADOR]
**Slug de URL:** /[slug]

## Plan de enlaces internos
Enlazar DESDE esta pieza hacia:
- [URL 1] — texto del enlace: [texto]
- [URL 2] — texto del enlace: [texto]

Enlazar HACIA esta pieza desde:
- [URL 1] — actualizar esa página para agregar un enlace aquí
- [URL 2] — agregar enlace contextual
```

## Ejemplo

**Usuario:** Escribe un briefing de contenido para "estrategia de marketing de contenidos" dirigido a gerentes de marketing B2B.

**Resultado:**
```markdown
# Briefing de Contenido: La Guía de Estrategia de Marketing de Contenidos B2B (2026)

**Palabra clave principal:** estrategia de marketing de contenidos | Volumen: ~18.000/mes | Dificultad: 68/100
**Palabras clave secundarias:** estrategia de contenido b2b, marco de marketing de contenidos, plantilla de estrategia de contenido, cómo construir una estrategia de contenido
**Recuento de palabras objetivo:** 3.800 palabras (competidores promedian 3.100 — profundiza más en marcos y plantillas)
**Intención de búsqueda:** Informacional — el lector quiere un proceso paso a paso a seguir, con plantillas para adaptar

## Audiencia
Gerente de Marketing B2B en una empresa de SaaS o servicios de 50-500 personas. Acaba de asumir la responsabilidad del contenido. Necesita presentar una estrategia a su VP de Marketing en 30 días. Busca en el trabajo, en el escritorio, durante un ciclo de planificación.

## Ángulo recomendado
La mayoría de las guías listan tácticas. Esta guía construye un marco de estrategia real en una secuencia paso a paso con una plantilla descargable — el lector termina con un plan completo de 90 días, no solo inspiración.

## Esquema

### Introducción (~200 palabras)
Gancho: "La mayoría de las estrategias de contenido fracasan en los primeros 90 días — no porque la escritura sea mala, sino porque nunca hubo una estrategia real."
Problema: Los equipos producen contenido sin investigación de audiencia, mapeo de palabras clave ni planes de distribución.
Promesa: "Al final de esta guía tendrás una estrategia de contenido de 90 días que puedes presentar esta semana."

### H2: Qué es realmente una Estrategia de Marketing de Contenidos B2B (~300 palabras)
[Objetivo de fragmento destacado — responde el "qué es" en 50 palabras primero]
Define: estrategia vs. tácticas vs. calendario
Los 5 componentes de una estrategia real: audiencia, objetivos, mezcla de canales, sistema de producción, medición

### H2: Paso 1 — Define tus Objetivos de Contenido (~400 palabras)
Tabla de traducción de objetivos de negocio a objetivos de contenido
Tráfico, leads, pipeline, marca: qué métricas se corresponden con qué objetivo
Nota para el escritor: Incluye un ejemplo B2B real que muestre cómo una empresa SaaS estableció KPIs de contenido

### H2: Paso 2 — Investigación de Audiencia y Palabras Clave (~500 palabras)
Mapeo de intención de palabra clave del ICP
Herramientas: Ahrefs, Semrush, Answer the Public, notas internas de llamadas de ventas
Nota para el escritor: Muestra el proceso de investigación de palabras clave como una lista paso a paso (objetivo de fragmento)

### H2: Paso 3 — Construye tus Clústeres de Temas (~400 palabras)
Modelo pilar/satélite con descripción del diagrama
Cómo elegir pilares basándose en objetivos de negocio, no solo en volumen
Enlace interno: [/publicación del blog del calendario editorial]

### H2: Paso 4 — Elige tu Mezcla de Contenido (~400 palabras)
Tabla de mezcla de tipos de contenido: [Tipo | % | Cuándo usar | Ejemplo]
La mezcla de empresa en etapa temprana vs. madura difiere — muestra ambas

### H2: Paso 5 — Construye un Sistema de Producción (~400 palabras)
Flujo de trabajo de briefing → borrador → edición → publicación → distribución
Roles: quién hace qué (incluso si es una sola persona)
Herramientas: Notion, Airtable, o una plantilla simple de Google Sheets

### H2: Paso 6 — Mide e Itera (~400 palabras)
Métricas por objetivo (tráfico / leads / marca)
Plantilla de revisión mensual de contenido
Cómo se ve el "éxito" a los 30/60/90 días

### Conclusión (~200 palabras)
Conclusiones: 3 cosas que hacer esta semana
CTA: Descarga la plantilla de estrategia de contenido de 90 días
Relacionado: Enlaza a /seo-audit, /editorial-calendar

## Meta
**Etiqueta de título:** Estrategia de Marketing de Contenidos B2B: La Guía Paso a Paso de 2026
**Meta descripción:** Construye una estrategia de contenido B2B que impulse pipeline real. Marco de 6 pasos, plantillas y un plan de 90 días que puedes presentar esta semana.
**Slug de URL:** /estrategia-marketing-contenidos
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
