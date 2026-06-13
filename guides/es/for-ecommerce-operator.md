# Claude para Operadores de Comercio Electrónico

Todo lo que un operador de comercio electrónico necesita para gestionar listados de productos, atención al cliente, campañas de marketing e informes operativos aumentados con IA — ya sea que trabajes en Shopify, Amazon, Etsy o los tres.

---

## Para quién es esta guía

Eres un operador de comercio electrónico, propietario de tienda en línea o vendedor en marketplaces cuyo trabajo abarca producto, marketing, atención al cliente y operaciones. Escribes listados, gestionas campañas de email, administras reseñas, tramitas devoluciones y monitoreas el gasto en publicidad — a menudo todo en el mismo día.

**Antes de Claude Code:** Nuevo listado de producto: 45 minutos. Respuesta a una queja de cliente: 15 minutos (y te lo replanteas). Campaña de email: 2 horas. Informe mensual: medio día.

**Después:** Listado de producto optimizado en 15 minutos. Queja de cliente gestionada en 3 minutos. Campaña de email planificada y redactada en 30 minutos. Informe mensual extraído y formateado en 20 minutos.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de comercio electrónico
npx claudient add skills small-business/shopify-operations
npx claudient add skills small-business/ecommerce-seller
npx claudient add skills small-business/email-campaign
npx claudient add skills small-business/review-response
npx claudient add skills marketing/paid-ads
npx claudient add skills small-business/product-listing-optimizer
npx claudient add skills small-business/returns-handler
npx claudient add agents specialists/ecommerce-specialist
```

---

## Tu stack de comercio electrónico en Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/product-listing-optimizer` | Optimiza listados para SEO y conversión: título, viñetas, descripción, contenido A+, briefing de imágenes | Nuevos listados, SKUs con baja conversión, actualizaciones de temporada |
| `/ecommerce-seller` | Operaciones completas de vendedor: estrategia de precios, decisiones de inventario, tácticas de marketplace | Decisiones diarias del vendedor |
| `/shopify-operations` | Específico de Shopify: configuración de la tienda, decisiones de tema, recomendaciones de apps, optimización del checkout | Gestión de tienda Shopify |
| `/email-campaign` | Planificación de campañas, textos, estrategia de envío para email marketing | Campañas promocionales y newsletters |
| `/review-response` | Responde a reseñas de clientes: positivas, negativas, neutras — todos los canales | Triage diario de reseñas |
| `/returns-handler` | Política de devoluciones, plantillas de respuesta, resolución de disputas, análisis de tendencias | Gestión de devoluciones y reembolsos |
| `/paid-ads` | Textos publicitarios, estructura de campaña, segmentación de audiencia, análisis de rendimiento | Publicidad en redes sociales y búsqueda |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `ecommerce-specialist` | Sonnet | Decisiones complejas: estrategia de marketplace, planificación de temporada, expansión de categorías |

---

## Flujo de trabajo diario

### Dashboard de ventas matutino (15 minutos)

Comienza cada día con una imagen clara del rendimiento:

```
/ecommerce-seller

Control matutino del [FECHA]:

Métricas de ayer:
- Ingresos: [$X]
- Pedidos: [X]
- Valor medio del pedido: [$X]
- Unidades vendidas por SKU principal: [lista]
- Solicitudes de devolución: [X]
- Nuevas reseñas: [positivas: X / negativas: X]
- Gasto en publicidad: [$X] / ROAS: [X]
- Tasa de abandono de carrito: [X%]

Señala:
- Cualquier SKU con stock < 14 días de suministro a la velocidad actual
- Cualquier campaña publicitaria con ROAS por debajo del umbral [$X objetivo]
- Cualquier reseña negativa que necesite respuesta el mismo día
- Cualquier pedido con riesgo de retraso en el cumplimiento
```

---

### Consultas de clientes y gestión de reseñas (20-30 minutos)

**Respuesta a reseña negativa:**

```
/review-response

Plataforma: [Amazon / Google / Trustpilot / Etsy]
Reseña: [pega el texto de la reseña]
Puntuación: [1-3]
Producto: [nombre]
Detalles del pedido que tengo (si los hay): [pega]

Escribe una respuesta profesional que:
- Reconozca la queja específica (no una disculpa genérica)
- Indique qué estamos haciendo para solucionarlo (o ya hemos hecho)
- Ofrezca una vía de resolución (reemplazo, reembolso, contacto directo)
- No sea defensiva
- Tenga menos de 100 palabras
```

**Solicitud de devolución:**

```
/returns-handler

Escenario: [describe la solicitud — p. ej., el cliente quiere devolver unas botas alegando que la suela se está despegando después de 3 semanas]
Detalles del pedido: [fecha, producto, importe]
Dentro del período de política: [sí / no — y qué política aplica]

Redacta: respuesta al cliente + nota interna para el registro.
```

---

### Optimización de listados (30-60 minutos)

**Nuevo listado de producto:**

```
/product-listing-optimizer

Marketplace: [Amazon / Shopify / Etsy / eBay]
Producto: [nombre y descripción]
Categoría: [categoría + subcategoría]
Precio: [$X]
Cliente objetivo: [quién compra esto, qué problema resuelve]
Características principales: [lista]
Competidor principal: [nombre o URL]

Produce: investigación de palabras clave, título optimizado, 5 viñetas, descripción, briefing de imágenes.
```

**Auditoría de listado (SKU con baja conversión):**

```
/product-listing-optimizer

Modo de auditoría.

Listado actual: [pega título + viñetas + descripción]
Tasa de conversión actual: [X%] (promedio de la categoría: [Y%])
Posición actual para la palabra clave principal: [posición o desconocida]

Diagnostica: ¿qué está perjudicando la conversión? Puntúa cada elemento. Dame las 2 mejoras con mayor impacto.
```

---

### Revisión del rendimiento publicitario (20 minutos)

```
/paid-ads

Plataforma: [Meta Ads / Google Ads / Amazon PPC]

Rendimiento de los últimos 7 días:
- Gasto total: [$X]
- Ingresos atribuidos: [$X]
- ROAS: [X]
- CTR: [X%]
- Tasa de conversión: [X%]
- 3 campañas principales: [nombre, gasto, ROAS de cada una]
- 3 campañas inferiores: [nombre, gasto, ROAS de cada una]

Análisis:
- ¿Qué campañas están por debajo del ROAS objetivo? Recomienda: pausar / reducir puja / actualizar creatividad
- ¿Qué audiencias están sobreindexando? Recomienda: escalar
- ¿Hay cambios en la asignación de presupuesto que deba hacer hoy?
```

---

### Control de inventario (10 minutos, diario)

```
/ecommerce-seller

Estado del inventario:

[Pega tu CSV de inventario o lista los SKUs clave con: unidades en existencia, velocidad media diaria de ventas]

Señala:
- Riesgo de rotura de stock en < 14 días a la velocidad actual
- Artículos con exceso de stock (> 90 días de suministro) — recomienda descuento o bundle
- Recomendaciones de reorden: cantidad y momento basados en el tiempo de entrega de [X días]

Resultado: lista de acciones priorizadas — qué pedir hoy, qué descontar, qué monitorear.
```

---

## Ritmo semanal

### Lunes — Planificación de campañas y contenido

```
/email-campaign

Planifica el email de esta semana:
- Segmento de audiencia: [nombre del segmento, tamaño]
- Objetivo: [generar ingresos / reactivar / anunciar producto]
- Oferta o ángulo de contenido: [p. ej., lanzamiento de nuevo producto / venta del 20% / feature de temporada]
- Rendimiento de la campaña anterior: [última tasa de apertura, CTR]

Produce: briefing de campaña, asunto (variantes A/B), borrador del email, recomendación de hora de envío.
```

### Miércoles — Revisión de listados y SEO

Ejecuta `/product-listing-optimizer` en tus 3 SKUs con menor rendimiento (por tasa de conversión).
Un listado optimizado por semana = mejora compuesta significativa en 90 días.

### Viernes — Informe de rendimiento semanal

```
/ecommerce-seller

Informe semanal para [semana]:

Ingresos: [$X] vs. [$X semana anterior] vs. [$X objetivo]
Pedidos: [X] / VMO: [$X]
Top 3 productos por ingresos: [lista]
Gasto en marketing: [$X] / Ingresos atribuidos: [$X] / ROAS combinado: [X]
Atención al cliente: [X tickets] / [X devoluciones] / Tiempo medio de resolución: [X horas]
Inventario: [¿algún problema de rotura de stock o exceso?]

Formato: resumen ejecutivo (3 puntos) + desglose detallado para registros.
¿En qué debo centrarme la semana que viene?
```

---

## Planificación de temporada

Usa el agente `ecommerce-specialist` 60-90 días antes de los eventos principales:

```
@ecommerce-specialist

Planifica nuestra campaña de [Q4 / Prime Day / Black Friday / San Valentín].

Productos a destacar: [lista]
Presupuesto: [$X total para marketing]
Cronograma: [fecha de inicio hasta fecha del evento]
Posición de inventario: [stock actual + tiempo de entrega para reorden]
Resultados del año pasado para este evento (si aplica): [métricas]

Produce:
- Lista de verificación de preparación a 90-60-30 días
- Estrategia de precios y descuentos
- Calendario de campañas (email + publicidad)
- Cantidades y momentos de pedido de inventario
- Plan de actualización de listados para los productos destacados
```

---

## Plan de 30 días

### Semana 1 — Auditar tu base de referencia

- Instala todas las habilidades de comercio electrónico
- Ejecuta `/product-listing-optimizer` en modo auditoría en tus 10 SKUs principales por ingresos
- Verifica tu política de devoluciones actual con `/returns-handler` — ¿te protege legalmente y retiene clientes?
- Extrae los datos de rendimiento publicitario de 30 días y realiza un análisis de brechas con `/paid-ads`
- Configura tu plantilla de dashboard diario en `/ecommerce-seller`

### Semana 2 — Renovación de listados y reseñas

- Reescribe tus 3 listados con menor conversión con `/product-listing-optimizer`
- Responde a todas las reseñas sin responder de los últimos 90 días con `/review-response`
- Configura un flujo de trabajo de monitoreo de reseñas: triage diario de reseñas como parte de la rutina matutina

### Semana 3 — Marketing y atención al cliente

- Planifica y lanza tu primera campaña de email redactada con IA usando `/email-campaign`
- Reescribe tu política de devoluciones y las plantillas de respuesta con `/returns-handler`
- Ejecuta una actualización de creatividad `/paid-ads` en tus campañas con mayor gasto

### Semana 4 — Sistematizar

- Construye tu plantilla de informes semanal con `/ecommerce-seller`
- Forma a cualquier miembro del equipo o asistente virtual en el uso de las habilidades para el triage diario
- Identifica tu próximo evento de temporada y comienza la planificación de 60 días
- Revisa el rendimiento mes a mes: ¿qué métricas mejoraron más?

---

## Integraciones de herramientas

### Shopify (gestión de tienda)

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "your-token",
        "SHOPIFY_STORE_DOMAIN": "yourstore.myshopify.com"
      }
    }
  }
}
```

Con Shopify conectado: Claude puede leer pedidos, datos de productos e inventario directamente.

### Klaviyo (email marketing)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Útil para: análisis de segmentos, datos de rendimiento de campañas, optimización de flujos.

### Google Analytics / GA4

Exporta los datos de rendimiento de tus productos y tráfico como CSV → pégalos en `/ecommerce-seller` para su análisis.

### n8n (automatización)

```
Automatiza el ciclo de respuesta a reseñas:
Nueva reseña → clasificar sentimiento → redactar respuesta → alerta en Slack para aprobación humana → publicar

Automatiza las alertas de inventario:
Control diario de stock → si stock < 14 días → crear tarea de reorden en tu herramienta de gestión de proyectos
```

---

## Métricas a seguir

| Métrica | Objetivo | Señal de alerta |
|---|---|---|
| Tasa de conversión (página de producto) | > 3% (media Shopify) / > 15% (Amazon) | < 1.5% |
| Tasa de devolución | < 10% (general) / < 20% (ropa) | > 25% |
| ROAS (publicidad) | > 3x (mínimo) / > 5x (saludable) | < 2x |
| Tasa de apertura de email | > 25% | < 15% |
| Tasa de respuesta a reseñas | 100% de las negativas | Cualquier negativa sin respuesta |
| Tiempo de respuesta a consultas | < 4 horas | > 24 horas |
| Tasa de rotura de stock | < 2% de los SKUs en cualquier momento | > 5% |
| VMO (valor medio del pedido) | Creciendo mes a mes | Cayendo 2+ meses consecutivos |

---

## Errores comunes y cómo Claude Code ayuda a evitarlos

**Error 1: Listados genéricos que no posicionan**
`/product-listing-optimizer` exige investigación de palabras clave antes de escribir. Sin palabras clave = sin posicionamiento = sin tráfico.

**Error 2: Ignorar las reseñas negativas**
`/review-response` convierte la respuesta en una tarea de 3 minutos. Cada reseña negativa sin respuesta cuesta conversiones futuras.

**Error 3: Usar la misma creatividad indefinidamente**
`/paid-ads` detecta el agotamiento creativo antes de que lo notes en el ROAS. Las señales de actualización provienen de las tendencias de CTR, no solo del ROAS.

**Error 4: La política de devoluciones como reflexión posterior**
`/returns-handler` construye políticas que retienen clientes y te protegen del fraude. "Contáctanos para devolver" es una política — solo que la peor.

**Error 5: Comprar inventario basándose en intuición**
`/ecommerce-seller` convierte tus datos de velocidad en una recomendación de reorden. Las roturas de stock y el exceso de inventario son igualmente costosos.

---

## Recursos

- [Comenzar con Claude Code](./getting-started.md)
- [Habilidad de operaciones Shopify](../skills/small-business/shopify-operations.md)
- [Optimizador de listados de productos](../skills/small-business/product-listing-optimizer.md)
- [Gestor de devoluciones](../skills/small-business/returns-handler.md)
- [Flujo de trabajo semanal de comercio electrónico](../workflows/ecommerce-weekly.md)

---
