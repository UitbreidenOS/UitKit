---
name: competitor-monitor
description: "Inteligencia competitiva semanal: seguimiento de cambios de precios, cambios de posicionamiento, noticias y publicaciones de empleo como señales — sintetizado en un resumen de una página"
---

# Competitor Monitor

## When to activate
- Realizas una revisión competitiva semanal o quincenal y quieres convertir los hallazgos brutos en señales claras
- Un competidor acaba de hacer un gran anuncio y necesitas entender qué significa para tu negocio
- Estás preparando un cambio de precio y quieres saber cómo estás posicionado antes de moverte
- Estás perdiendo acuerdos y sospechas que un competidor específico es la razón

## When NOT to use
- Investigación competitiva profunda para una presentación de financiamiento — eso requiere investigación de mercado profesional
- Monitoreo legal o de PI — usa un especialista para monitoreo de marcas/patentes
- Seguimiento automatizado en tiempo real — esta habilidad requiere que hagas la revisión semanal; sintetiza lo que encuentras, no raspa automáticamente

## Instructions

### Set up your competitor list

Mantenlo en 3-5 competidores. Más que eso produce ruido, no señal. Para cada uno, dale a Claude:
- Su nombre y sitio web
- Su producto o servicio principal y cómo se superpone con el tuyo
- Sus precios públicos (si están disponibles) — nombres de niveles, puntos de precio, qué incluye cada nivel
- Por qué son conocidos — su diferenciador principal o ángulo de marketing
- Cualquier noticia reciente que ya sepas sobre ellos

Hazlo una vez. Guárdalo como tu bloque de contexto competidor y pégalo al inicio de cada sesión semanal.

### Build your weekly checklist

Pídele a Claude que genere una lista de verificación semanal de 15-20 minutos para tu conjunto de competidores específico. Claude la personaliza a tu industria — una lista de verificación de competidores SaaS difiere de una lista de verificación de competidores de restaurante.

La lista de verificación estándar cubre: página de precios (¿cambió algo?), registro de cambios de productos o blog (¿características nuevas o actualizaciones?), tablero de empleos (¿qué roles están contratando?), sitios de reseñas (¿reseñas nuevas, tendencia de calificación?), LinkedIn y noticias (¿anuncios?), y tus propios datos de ventas (¿algún acuerdo perdido cita a este competidor?).

Haces la verificación. Toma 5 minutos por competidor. Luego pegas los hallazgos.

### Weekly digest

Pega tus hallazgos de la lista de verificación. Claude los sintetiza en un resumen estructurado de una página:

**Lo que cambió esta semana** — resumen factual de cualquier cosa diferente a la semana pasada

**Lo que señala** — Claude interpreta cada cambio. Una caída de precio podría señalar que están bajo presión, no que están ganando. Un auge de contratación en una función específica señala dónde invierten después. Nuevas reseñas negativas señalan problemas de soporte o calidad que puedes usar en conversaciones de ventas.

**Acción recomendada** — una cosa concreta que deberías hacer, si corresponde. A menudo la respuesta es « monitorear — no se necesita acción aún. » Claude no fabrica urgencia.

### Job posting signals

Las publicaciones de empleo son una de las señales públicas más confiables para la estrategia competidor. Claude lee publicaciones de empleo y te dice qué significan:

- Contrataciones de ingeniería en un área específica: están construyendo una característica que aún no tienen
- Contrataciones de ventas en una región específica: están expandiendo allí
- Contrataciones de éxito del cliente: están creciendo o churnando — depende del contexto
- Reemplazo de C-suite: inestabilidad de liderazgo
- Contrataciones de datos y análisis: están a punto de tomar decisiones más impulsadas por datos, posiblemente relacionadas con precios

Pega el título y descripción de la publicación de empleo. Claude lo interpreta en el contexto de lo que ya sabes sobre ellos.

### Pricing change response

Si un competidor baja su precio, cuéntale a Claude:
- El cambio (precio anterior, nuevo precio, qué nivel)
- Tu precio actual relative al suyo
- Tu situación ganar/perder en acuerdos recientes

Claude redacta puntos de conversación para tus conversaciones de venta — no una respuesta de pánico, sino una respuesta tranquila y factual a la pregunta « ¿por qué estás $50 más caro? » que enfatiza las cosas específicas que haces mejor.

### Lost deal debrief

Después de perder un acuerdo ante un competidor, cuéntale a Claude:
- Lo que el cliente dijo fue la razón
- Lo que sabes sobre el pitch de tu competidor
- El tamaño del acuerdo y el perfil del cliente

Claude identifica si esto es un patrón u otro y sugiere si se justifica una respuesta de precio, mensajería o producto.

---

### Prompt template

```
Aquí está mi contexto competidor (actualizar mensualmente):

Competidor A: [nombre]
- Sitio web: [url]
- Producto principal: [descripción]
- Precios: [niveles y precios]
- Conocido por: [diferenciador]

[repite para cada competidor]

---

Hallazgos de esta semana:

Competidor A:
- [Lo que encontré en su página de precios]
- [Lo que encontré en su tablero de empleos]
- [Cualquier noticia o anuncio]
- [Nuevas reseñas o cambios de calificación]

Competidor B:
- [hallazgos]

Por favor, dame:
1. Lo que cambió esta semana (factual)
2. Lo que cada cambio señala
3. Una acción recomendada, si corresponde
```

## Example

Ejecutas una empresa de software de programación B2B. Pegas tus hallazgos semanales:

- El competidor A bajó su plan Starter de $79 a $49 por mes
- El competidor B publicó tres roles de « Ingeniería de Datos » en LinkedIn esta semana
- El competidor C recibió 4 nuevas reseñas de 1 estrella esta semana, todas citando tiempos de respuesta del soporte lentos

Claude produce:

Lo que cambió: El competidor A redujo la fijación de precios de Starter en 38%. El competidor B está construyendo activamente infraestructura de datos interna. El competidor C tiene un problema visible de calidad de soporte esta semana (4 nuevas reseñas de 1 estrella en 7 días son inusualmente concentradas).

Lo que señala: La caída de precio del competidor A probablemente refleje presión en sus números de adquisición de nivel inicial, no fortaleza — las empresas con ingresos crecientes generalmente suben o mantienen precios. Esta es una oportunidad para reposicionar tu precio como premium con integración más rápida. El competidor B que construye ingeniería de datos interna sugiere que se están moviendo hacia reducir una dependencia de integración de terceros — vale la pena monitorear qué integración están reemplazando. El clúster de soporte del competidor C es un activo de ventas: menciona tu SLA y tiempo de respuesta promedio en tus próximas tres propuestas.

Acción recomendada: Actualiza tu one-pager de ventas para agregar una comparación de tiempo de respuesta. Si un prospecto cita el nuevo precio de $49 del competidor A, usa este script: « Su plan Starter a $49 incluye [limitación X]. Nuestro plan base a $89 incluye [Y y Z] y una llamada de incorporación dedicada — la mayoría de los clientes recuperan esa diferencia de $40 en la primera semana. »

---
