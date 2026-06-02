# Claude para Content Marketers y SEO

Todo lo que un Content Marketer o Especialista en SEO necesita para ejecutar estrategia de contenido, producción, optimización y distribución potenciadas por IA en Claude Code.

---

## Para quién es esto

Eres un content marketer, SEO manager o growth marketer cuyo trabajo consiste en construir una audiencia, aumentar el tráfico orgánico y convertir lectores en leads o clientes. Pasas demasiado tiempo mirando páginas en blanco, redactando briefs, reformateando contenido para distintos canales y recopilando analíticas para informes.

**Antes de Claude Code:** 90 minutos para investigar y preparar el brief de un artículo de blog. 45 minutos para escribir una serie de publicaciones en redes sociales. Media jornada para producir un calendario editorial mensual. Horas persiguiendo a redactores para obtener briefs que siguen siendo vagos.

**Después:** Brief de contenido completo en 5 minutos. Calendario editorial del mes en 15 minutos. Esquema de artículo de blog con análisis de la competencia en menos de 10 minutos. Reutilización en redes sociales de un solo artículo de blog en 3 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de content marketing y SEO
npx claudient add skills marketing

# O seleccionar lo que necesitas:
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/social-media-manager
npx claudient add skill marketing/email-sequence
npx claudient add agents advisors/cmo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Tu stack de Claude Code para content marketing

### Skills (comandos slash)

| Skill | Qué hace | Cuándo usarla |
|---|---|---|
| `/content-brief` | Brief de contenido optimizado para SEO: keyword, esquema, brechas, enlaces internos, CTA | Antes de cada pieza de contenido |
| `/editorial-calendar` | Calendario mensual: clusters de temas, calendario de publicación, mix de contenido, distribución | Planificación mensual |
| `/content-strategy` | Estrategia de contenido completa: audiencia, objetivos, canales, clusters de temas, KPIs | Planificación trimestral o al lanzar una marca |
| `/seo-audit` | Auditoría SEO técnica y on-page: problemas, oportunidades, lista de correcciones priorizadas | Auditoría mensual del sitio |
| `/ai-seo` | SEO en la era de la IA: optimización para ChatGPT, Perplexity, Bing AI, featured snippets | Al actualizar contenido existente |
| `/programmatic-seo` | Plantillas de páginas programáticas: schema, patrones N-de-M, producción escalable | Escalar la producción de contenido |
| `/copywriting` | Landing pages, titulares, CTAs, copy de anuncios — orientado a la conversión | Cualquier copy crítico para la conversión |
| `/social-media-manager` | Creación de publicaciones nativas por plataforma, estrategia de programación, playbooks de engagement | Contenido social y gestión de canales |
| `/email-sequence` | Secuencias drip, newsletters, flujos automatizados — copywriting completo + lógica | Contenido de email y flujos de nurturing |

### Agentes

| Agente | Modelo | Cuándo invocarlo |
|---|---|---|
| `cmo-advisor` | Opus | Preguntas de estrategia, priorización de canales, posicionamiento de contenido |
| `competitive-analyst` | Sonnet | Auditorías de contenido de la competencia, análisis de brechas, inteligencia de posicionamiento |

---

## Flujo de trabajo diario

### Mañana — Revisión de analíticas (15 minutos)

**1. Pulso de rendimiento**
```
/seo-audit

Extrae mis métricas clave de contenido de ayer:
- Top 5 páginas por sesiones
- Cualquier página nueva que aparezca en Google Search Console
- Cualquier página que haya bajado en ranking en los últimos 7 días
- Tasa de apertura del newsletter del envío de ayer

Dame un briefing de 5 viñetas: qué celebrar, qué investigar, qué solucionar hoy.
```

**2. Escaneo de oportunidades**
```
/ai-seo

¿Qué keywords relacionadas con [mi cluster de temas] han tenido picos en los últimos 7 días?
¿Hay alguna pregunta trending en mi nicho que deba aprovechar hoy?
Revisa: Google Trends, Reddit, temas trending en LinkedIn.
```

---

### Creación de contenido (variable — 1-4 horas)

**3. Brief de una nueva pieza**
```
/content-brief

Keyword objetivo: [keyword]
Keywords secundarias: [lista]
Tipo de contenido: [how-to / comparación / liderazgo de opinión]
Audiencia objetivo: [persona específica con problema específico]
URLs de la competencia: [top 3 páginas en ranking]
Nuestro CTA: [qué queremos que hagan los lectores]
Objetivo de palabras: [basado en el promedio de la competencia]
```

**4. Escribir o revisar contenido**
```
/copywriting

Escribe [tipo de contenido] basado en este brief:
[pega el brief de arriba]

Tono: [conversacional / autoritativo / técnico]
Voz de marca: [breve descripción — o pega las guías de marca]
Debe incluir: [puntos específicos, datos o ejemplos]
```

---

### Optimización SEO (20-30 minutos, varias veces por semana)

**5. Optimización on-page**
```
/seo-audit

Revisa este borrador antes de publicar:
[pega el contenido]

Keyword objetivo: [keyword]
Comprueba: title tag, meta description, H1, estructura de H2, enlaces internos,
oportunidad de featured snippet, texto alternativo de imágenes, schema markup.
Dame una checklist de publicación: qué está bien, qué corregir.
```

---

### Programación en redes sociales (15-30 minutos, diariamente o en lotes semanales)

**6. Reutilizar contenido publicado**
```
/social-media-manager

Acabo de publicar: [URL o pega el contenido]

Crea:
- 3 publicaciones en LinkedIn (solo texto, concepto de carrusel y una encuesta)
- 5 publicaciones en X/Twitter (incluyendo un hilo y 4 independientes)
- 1 caption para Instagram
- 1 guion de vídeo corto (60 segundos)

Reutiliza el insight principal adaptado al formato nativo de cada plataforma.
No copies simplemente la intro del blog — extrae la idea más compartible de cada sección.
```

---

### Informes de rendimiento (30-60 minutos, semanalmente)

**7. Informe semanal de contenido**
```
/content-strategy

Revisión semanal de rendimiento:
- Publicado esta semana: [lista]
- Contenido de mejor rendimiento (sesiones, tiempo en página, conversiones): [datos]
- Estadísticas del newsletter: [envíos, tasa de apertura, CTR]
- Estadísticas en redes sociales: [impresiones, interacciones, variación de seguidores]

Resume: qué funcionó, qué no, y qué debo producir más la próxima semana.
Genera un informe de 1 página que pueda compartir con mi manager.
```

---

## Flujo de planificación mensual

### Fin de mes: planificar el calendario del próximo mes (60-90 minutos)

**Paso 1 — Revisar el mes anterior**
```
/content-strategy

Auditoría de contenido del mes pasado:
- ¿Qué piezas generaron más tráfico orgánico?
- ¿Cuáles generaron más leads/conversiones?
- ¿Cuáles tuvieron mayor engagement en redes sociales?
- ¿Algún contenido que no rindió a pesar del alto esfuerzo?

Dame: lista de qué hacer más (más contenido como este), lista de qué cortar (detener este formato) y 3 nuevas ideas basadas en lo que funcionó.
```

**Paso 2 — Construir el calendario del próximo mes**
```
/editorial-calendar

Construye el calendario editorial para [próximo mes].

Marca: [nombre de la empresa + descripción en una línea]
Audiencia: [descripción del ICP]
Objetivo: [tráfico / leads / marca]
Canales: [blog / newsletter / LinkedIn / X]
Cadencia de publicación: [X/semana blog, LinkedIn diario, newsletter semanal]
Cluster de keywords principal actual: [área temática principal]
```

**Paso 3 — Brief de cada pieza**
```
/content-brief

[Ejecutar para cada pieza planificada en el calendario]
```

---

## Plan de incorporación de 30 días (nuevos content marketers)

### Semana 1 — Auditar y entender
- Instala todas las skills de marketing: `npx claudient add skills marketing`
- Ejecuta `/seo-audit` en todo tu sitio — conoce lo que tienes antes de publicar más
- Ejecuta `/competitive-analyst` en tus 3 competidores principales — ¿sobre qué escriben ellos que tú no?
- Audita tu lista de email: tasas de apertura, clicks, bajas — ¿qué contenido rinde?
- Mapea tus clusters de temas: usa `/content-strategy` para definir tus 3 pilares

### Semana 2 — Configuración del sistema
- Construye tu primer calendario editorial con `/editorial-calendar`
- Crea plantillas de brief para tus 3 tipos de contenido más comunes
- Configura tu checklist de distribución de contenido (cada publicación = distribución en 5 canales)
- Define tu mapa de enlaces internos: ¿cuáles son las 10 piezas cornerstone de tu contenido?

### Semana 3 — Lanzamiento de producción
- Prepara y produce tus primeras 4 piezas usando `/content-brief` + `/copywriting`
- Usa `/social-media-manager` para reutilizar cada pieza en todos los canales
- Configura tu email semanal con `/email-sequence`
- Publica, distribuye, haz seguimiento de los resultados

### Semana 4 — Analizar y optimizar
- Ejecuta `/seo-audit` — ¿qué mejoró? ¿Qué nuevas oportunidades aparecieron?
- Identifica tu mejor pieza y usa `/content-brief` para producir 3 más similares
- Configura la plantilla de informes analíticos mensuales
- Presenta tu primer informe mensual de estrategia de contenido

---

## Integraciones de herramientas

### Ahrefs / Semrush

```
Pega datos de keywords directamente en Claude:
1. Exporta el informe de keywords desde Ahrefs → Copia las 100 filas principales
2. /seo-audit: pega los datos y pide una lista de oportunidades priorizadas
3. Usa /content-brief con las keywords identificadas

Para brecha de contenido frente a la competencia:
1. Ejecuta el informe "Content Gap" en Ahrefs frente a los 3 competidores principales
2. Pega las keywords de brecha en /editorial-calendar
3. Mapea las keywords a clusters de temas y construye el calendario
```

### Google Search Console

```bash
# Conecta los datos de GSC a Claude mediante MCP
# Añadir a ~/.claude/settings.json:
{
  "mcpServers": {
    "google-search-console": {
      "command": "npx",
      "args": ["-y", "@anthropic/gsc-mcp"],
      "env": {
        "GSC_CREDENTIALS": "ruta/a/credentials.json",
        "GSC_SITE_URL": "https://tudominio.com"
      }
    }
  }
}
```

Con esto conectado, Claude puede:
- Obtener directamente tus principales consultas y páginas
- Identificar keywords en posición 11-20 (objetivos de optimización rápida)
- Seguir impresiones vs. clicks para encontrar oportunidades de CTR
- Monitorear caídas en ranking en todo tu contenido

### HubSpot / Marketo (atribución de contenido)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "tu-token"
      }
    }
  }
}
```

Con esto conectado:
- Pregunta a Claude qué artículos de blog están generando más conversiones de contacto
- Identifica qué contenido consumieron tus mejores leads antes de convertir
- Construye planes de distribución con seguimiento UTM vinculados a la influencia en deals

### Notion / Airtable (calendario editorial)

```
Exporta tu calendario de contenido de Notion o Airtable como CSV o markdown.
Pégalo en Claude con:
"/editorial-calendar — aquí está mi calendario actual. Identifica brechas en la cobertura de temas,
exceso de un tipo de contenido y piezas que necesitan una actualización prioritaria."
```

### n8n / Make (automatización)

```
Automatiza el bucle de producción de contenido:
- Nueva alerta de keyword en Ahrefs → brief de contenido generado automáticamente → página de Notion creada
- Artículo de blog publicado → /social-media-manager → publicaciones programadas en Buffer/Hootsuite
- Email enviado → tasa de apertura por debajo del umbral → /email-sequence → variantes de asunto generadas
- Mensualmente: informe de Google Analytics → /content-strategy → documento de revisión mensual creado
```

---

## Benchmarks a seguir

Extráelos de Google Analytics, GSC y tu plataforma de email semanalmente:

| Métrica | Etapa inicial | Etapa de crecimiento | Madurez |
|---|---|---|---|
| Sesiones orgánicas/mes | 1.000 | 10.000 | 50.000+ |
| Crecimiento orgánico MoM | >10% | 5-10% | 2-5% |
| Piezas publicadas/mes | 8 | 16 | 25+ |
| Tasa de apertura de email | >25% | >30% | >35% |
| CTR de email | >2% | >3% | >4% |
| Tasa de engagement en redes sociales (LinkedIn) | >2% | >3% | >4% |
| Leads atribuidos al contenido/mes | 5 | 25 | 100+ |
| Tiempo por brief de contenido | <30 min | <15 min | <10 min |

---

## Errores comunes (y cómo Claude Code ayuda a evitarlos)

**Error 1: Escribir sin un brief**
`/content-brief` tarda 5 minutos. Saltárselo te cuesta 3 horas de reescrituras cuando la pieza no cumple la intención.

**Error 2: Producir contenido sin un plan de distribución**
`/editorial-calendar` incorpora el plan de distribución al calendario. Cada pieza tiene un plan de 5 canales antes de escribirse.

**Error 3: Publicar sin enlaces internos**
`/content-brief` mapea los enlaces internos como parte del brief. No más contenido huérfano publicado.

**Error 4: Ignorar la degradación del contenido**
`/seo-audit` identifica páginas que estaban en ranking pero han bajado. Actualizar supera a publicar nuevo contenido en sitios establecidos.

**Error 5: Publicaciones en redes sociales que solo comparten el enlace**
`/social-media-manager` reescribe el contenido como publicaciones nativas de cada plataforma. Carruseles de LinkedIn, hilos de Twitter, captions de Instagram — todos distintos al artículo del blog.

---

## Recursos

- [Cómo empezar con Claude Code](../getting-started.md)
- [Flujo de trabajo de creación de contenido](../workflows/content-creation.md)
- [Skill de auditoría SEO](../skills/marketing/seo-audit.md)
- [Skill de content brief](../skills/marketing/content-brief.md)
- [Skill de calendario editorial](../skills/marketing/editorial-calendar.md)
- [Skill de secuencia de email](../skills/marketing/email-sequence.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
