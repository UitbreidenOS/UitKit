---
name: customer-feedback-synthesizer
description: "Convierte 50-200+ reseñas, respuestas de encuestas o tickets de soporte en puntos críticos priorizados, solicitudes de características, tendencias de sentimiento y un plan de acción concreto"
---

# Customer Feedback Synthesizer

## When to activate
- Tienes más reseñas de las que tienes tiempo para leer y necesitas los temas rápido
- Se acerca una revisión comercial trimestral y necesitas un resumen de clientes respaldado por datos
- Acabas de lanzar un producto o característica y quieres saber cómo fue recibido
- Estás preparando un informe de clientes para tu equipo, inversores o una junta asesora

## When NOT to use
- Tienes menos de 10 reseñas — léelas tú mismo, los patrones necesitan volumen
- Necesitas análisis estadísticamente riguroso de NPS o CSAT — usa una herramienta de encuesta dedicada
- Quieres un registro verbatim de cada queja — esta habilidad sintetiza, no archiva

## Instructions

### What to give Claude

Pega tus reseñas directamente. Copia desde Google, Yelp, Trustpilot, App Store o G2. Pega resúmenes de tickets de soporte. Pega respuestas de encuesta abiertas. No se necesita formato — solo texto sin procesar, una reseña tras otra. Claude puede procesar 200+ en un solo paso.

Si exportaste un CSV, pega solo la columna de texto de reseña. No necesitas limpiarlo.

Dile a Claude:
- El período que cubren las reseñas (por ejemplo, «últimos 3 meses» o «desde nuestro lanzamiento en enero»)
- Tu tipo de negocio (restaurante, SaaS, venta al por menor, servicio) para que Claude tenga contexto
- Cualquier pregunta específica que quieras que se responda (por ejemplo, «¿por qué nuestras calificaciones están bajando?» o «¿qué quiere la gente que agreguemos?»)

### What Claude produces

Claude produce cinco cosas:

**1. Top 5 puntos críticos** — clasificados por cuántas reseñas los mencionan, con un recuento de frecuencia e intensidad emocional típica (frustrado vs. ligeramente molesto vs. enojado)

**2. Top 5 solicitudes de características o productos** — clasificadas por cuántas personas las solicitan, con el lenguaje exacto que los clientes usan con mayor frecuencia (útil para tu copia y argumentos de hoja de ruta)

**3. Tendencia de sentimiento** — mejorando, estable o declinando — basada en el tono en el período que proporcionaste. Si le das a Claude reseñas de dos períodos, las compara directamente.

**4. Top 3 puntos destacados «lo que funciona»** — lo que los clientes elogian más, que es tan importante como lo que critican. Útil para copia de marketing y para saber qué no cambiar.

**5. Matriz de urgencia** — cada punto crítico clasificado como:
- Crítico: muchas personas lo mencionan, fuerte emoción negativa, afecta la experiencia central
- Importante: frecuente, frustración moderada, vale la pena arreglarlo este trimestre
- Monitorear: ocasional, leve, aún no digno de acción pero vale la pena seguirlo

### Suggested fixes

Para cada punto crítico en los niveles crítico e importante, pregúntale a Claude: «Para cada problema, sugiere una acción concreta que pudiera tomar». Claude produce una acción breve por elemento — no un documento estratégico, solo el siguiente paso.

### Monthly cadence

Ejecuta esto una vez al mes. Guarda cada resultado (cópialo en un documento). Después de tres meses, pega los tres resultados y pregúntale a Claude: «¿Se están mejorando los problemas críticos del mes uno?» Esto rastrear si tus correcciones realmente están funcionando.

---

### Prompt template

```
Voy a pegar [número] reseñas de [plataforma] que cubren [período].
Mi negocio es un(a) [tipo de negocio].

Por favor, dame:
1. Top 5 puntos críticos con recuento de frecuencia e intensidad emocional
2. Top 5 solicitudes de características o productos clasificadas por cuántas personas las solicitan
3. Tendencia de sentimiento: mejorando, estable o declinando
4. Top 3 cosas que los clientes elogian más
5. Una matriz de urgencia que clasifique cada punto crítico como crítico, importante o monitorear
6. Para elementos críticos e importantes: una acción concreta que pudiera tomar para cada uno

Aquí están las reseñas:
[pega reseñas]
```

## Example

Eres propietario de un restaurante y pegas 80 reseñas de Google de los últimos 3 meses. Le dices a Claude que tu negocio es un restaurante de servicio casual.

Claude identifica:

Puntos críticos:
1. Tiempo de espera (34 reseñas, fuerte frustración) — Crítico
2. Tamaños de porción inconsistentes (18 reseñas, frustración moderada) — Importante
3. Estacionamiento (11 reseñas, molestia leve) — Monitorear
4. Nivel de ruido los fines de semana (9 reseñas, moderado) — Monitorear
5. Opciones vegetarianas limitadas (7 reseñas, leve) — Monitorear

Solicitudes de características:
1. Pedidos en línea o reservaciones (22 reseñas)
2. Porciones más grandes en el menú del almuerzo (14 reseñas)
3. Un programa de lealtad (8 reseñas)

Tendencia de sentimiento: Declinando — las reseñas de los meses 1-2 mostraban un lenguaje más cálido; el mes 3 muestra más frustración específicamente alrededor de los tiempos de espera, coincidiendo con tus nuevos horarios de fin de semana.

Lo que funciona: Amabilidad del personal (mencionada positivamente en 61 de 80 reseñas), calidad de alimentos en los platos principales y relación calidad-precio.

Acciones de matriz de urgencia:
- Tiempo de espera (Crítico): Claude sugiere agregar un sistema de notificación por texto cuando las mesas estén listas y mostrar tiempos de espera estimados en la puerta
- Tamaños de porción (Importante): Claude sugiere estandarizar el plato del almuerzo con una guía de porción documentada para el personal de cocina

Tiempo total: menos de 2 minutos para ir de un pegado bruto a este resultado.

---
