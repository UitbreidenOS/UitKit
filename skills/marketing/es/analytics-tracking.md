---
name: analytics-tracking
description: "Implementación de análisis: GA4, Mixpanel, Amplitude, PostHog seguimiento de eventos, análisis de embudos, cohortes de retención, y modelado de atribución"
---

# Analytics Tracking Skill

## Cuándo activar
- Configurar el seguimiento de eventos para una aplicación web o sitio de marketing
- Diseñar un plan de medición antes de implementar analytics
- Depuración de datos de analytics rotos o faltantes
- Construir embudos para encontrar caídas de conversión
- Analizar cohortes de retención de usuarios para entender el churn
- Elegir entre herramientas de analytics (GA4, Mixpanel, Amplitude, PostHog)

## Cuándo NO usar
- Inteligencia empresarial o consultas de almacén de datos a nivel SQL — eso es una tarea de datos-ml
- Configuración del marco de pruebas A/B — usa la habilidad experiment-designer
- Auditorías de cumplimiento de privacidad/GDPR para seguimiento — usa la habilidad privacy-pia

## Instrucciones

### Plan de medición

```
Construye un plan de medición para [producto/sitio].

Tipo de producto: [SaaS / ecommerce / sitio de contenido / aplicación móvil]
Objetivos comerciales: [qué resultados importan — registros, compras, retención, engagement]
Configuración actual de analytics: [GA4 / Mixpanel / Amplitude / PostHog / ninguna]
Equipo: [desarrollador + analista / solo / equipo de marketing]

Estructura del plan de medición:

1. Métrica de Estrella Polar:
   [El número único que mejor captura la salud del producto]
   por ejemplo, Usuarios Activos Semanales / MRR / Tasa de Activación

2. Métricas de apoyo (nivel 2):
   [3-5 métricas que expliquen la Estrella Polar]

3. Eventos de usuario clave a rastrear:
   Para cada evento:
   - Nombre del evento: [snake_case, nomenclatura consistente]
   - Trigger: [qué acción del usuario activa esto]
   - Propiedades: [atributos clave a capturar — plan: string, amount: number, etc.]
   - Porqué: [qué pregunta comercial responde esto?]

4. Embudos a medir:
   - [Embudo de adquisición: fuente → registro → activación]
   - [Embudo de producto principal: iniciar sesión → acción clave → momento de valor]
   - [Embudo de monetización: prueba → actualización → retención]

5. Dashboards necesarios:
   - [Ejecutivo: MRR, churn, NPS]
   - [Producto: tasa de activación, adopción de características, retención]
   - [Marketing: tráfico, conversión, CAC por canal]

Produce el plan de seguimiento de eventos como una tabla:
Evento | Trigger | Propiedades | Prioridad | Dashboard
```

### Implementación de GA4

```
Configura el seguimiento de eventos GA4 para [sitio web/aplicación].

Tipo de sitio: [sitio de marketing / aplicación web / ecommerce]
Framework: [Next.js / React / JavaScript vanilla / WordPress]
Objetivos: [rastrear estas conversiones — lista]

Plan de implementación:

1. Configuración base:
   - Instala GA4 a través de gtag.js o GTM (usa GTM si los comerciantes necesitan agregar etiquetas después)
   - Configura la secuencia de datos y el ID de medición
   - Habilita Enhanced Measurement para: scrolls, clics salientes, descargas de archivos, búsqueda del sitio

2. Eventos personalizados a implementar:
   Evento: [nombre]
   Código:
   gtag('event', '[event_name]', {
     event_category: '[category]',
     event_label: '[label]',
     value: [valor numérico opcional],
     [custom_parameter]: '[value]'
   });
   Dónde activar: [componente / página / acción]

3. Eventos de conversión:
   Marca estos como conversiones en GA4 admin:
   - [signup_complete]
   - [purchase]
   - [demo_requested]
   Marca en: Admin → Events → Mark as conversion

4. Audiencias para retargeting:
   - Usuarios de prueba que no se convirtieron (visitaron /pricing 2+ veces)
   - Visitantes de alto interés (3+ páginas, 2+ minutos)

5. Depuración y verificación:
   - GA4 DebugView: habilita el modo de depuración en GTM o agrega ?debug_mode=1
   - Informe en tiempo real: confirma eventos activándose en vivo
   - Comprueba eventos duplicados (activar una vez, no en cada re-render)

Genera el código de implementación para mi framework.
```

### Análisis de embudo

```
Analiza mi embudo de conversión e identifica caídas.

Pasos del embudo: [lista cada paso en orden]
Ejemplo: Página principal → Página de registro → Correo confirmado → Dashboard → Característica utilizada → Actualización

Tasas de conversión actuales por paso (si se conocen): [X%]
Herramienta de analytics: [GA4 / Mixpanel / Amplitude / PostHog]
Período de tiempo: [últimos 30 / 60 / 90 días]
Segmentos a comparar: [móvil vs. escritorio / canal / tipo de plan]

Estructura de análisis:
1. Conversión de embudo general (primer paso → último paso): [X%]
2. Caída paso a paso:
   Paso 1 → 2: [X% caída — alta/media/baja en comparación con benchmarks]
   Paso 2 → 3: [X% caída]
   [continuar para cada paso]

3. Peor paso de caída: [qué paso pierde más gente]
   Hipótesis para el porqué:
   - [¿fricción en la UI?]
   - [¿información faltante?]
   - [¿error técnico?]
   - [¿desajuste de expectativas?]

4. Experimentos a ejecutar:
   - [un cambio por hipótesis, medible en analytics]

5. Insight de segmentación:
   - ¿Los usuarios móviles caen en un paso diferente que de escritorio?
   - ¿Los visitantes de anuncios pagados se convierten de manera diferente que orgánico?

Consulta para ejecutar en [herramienta]: [escribe la consulta de embudo o pasos para configurar]
```

### Análisis de cohortes de retención

```
Ejecuta un análisis de cohortes de retención para [producto].

Herramienta de analytics: [Mixpanel / Amplitude / PostHog / GA4 / SQL sin procesar]
Definición de retención: [usuario regresó e hizo X dentro de Y días]
Ventana de tiempo: [cohortes semanales / mensuales]
Edad del producto: [X meses de datos disponibles]

Configuración de análisis de cohortes:
1. Define evento de retención: [la acción que cuenta como "retenida"]
   - No solo "iniciada sesión" — define engagement significativo
   - por ejemplo, "Característica principal utilizada", "elemento creado", "mensaje enviado"

2. Construye tabla de cohortes:
   - Filas: cohortes de registro (semana o mes de primer uso)
   - Columnas: Día 1, Día 7, Día 14, Día 30, Día 60, Día 90
   - Celda: % de usuarios que regresaron ese día

3. Interpreta la forma:
   - Curva plana después del Día 14: producto ha encontrado su piso de retención (bueno)
   - Declive continuo sin piso: problema de encaje de producto-mercado
   - Caída abrupta del Día 1: problema de incorporación, no retención
   - Cohortes recientes mejores que más antiguas: tendencia de mejora (bueno)

4. Identifica qué cohortes se retienen mejor:
   - Por canal de adquisición (orgánico vs. pagado)
   - Por característica de registro utilizada en primera sesión
   - Por plan o segmento

5. Experimento de intervención:
   Basado en caída en Día [X], prueba: [correo electrónico / nudge in-app / destaque de característica]

Escribe la consulta para [herramienta] e interpreta los resultados.
```

### Guía de selección de herramientas

```
Ayúdame a elegir la herramienta de analytics correcta.

Etapa del producto: [pre-lanzamiento / crecimiento temprano / escalado]
Equipo: [solo / 2-5 / 5+]
Recursos técnicos: [desarrollador disponible / solo sin código]
Presupuesto: $[X/mes]
Necesidad primaria: [análisis de producto / atribución de marketing / ecommerce / BI]
Requisitos de privacidad de datos: [GDPR / HIPAA / sin requisitos especiales]

Compara:

GA4 — Mejor para: sitios de marketing, ecommerce, integración de Google Ads. Gratis. Profundidad limitada de análisis de productos.

Mixpanel — Mejor para: análisis de productos SaaS, análisis de embudos y retención. Comienza gratis (eventos limitados).

Amplitude — Mejor para: equipos de productos más grandes, análisis de cohortes, análisis predictivo. Nivel gratuito disponible.

PostHog — Mejor para: opción auto-hospedada, flags de características + analytics en uno, código abierto. Gratis hasta 1M eventos/mes.

Plausible / Fathom — Mejor para: centrado en la privacidad, sin consentimiento de cookies necesario, métricas de tráfico simples. $9-14/mes.

Heap — Mejor para: captura de eventos retroactiva (sin planificación previa necesaria), empresa.

Recomendación para mi situación: [herramienta + porqué + costo a mi escala]
```

## Ejemplo

**Usuario:** Nuestro SaaS tiene una conversión de prueba a pagado del 23%, pero no sabemos dónde cae la gente. Usamos PostHog. Ayúdame a configurar el seguimiento de embudos.

**Plan de Claude:**

**Embudo para construir en PostHog:**
1. Registro de prueba completado → 2. Primera carga del dashboard → 3. Característica principal utilizada (definir: "proyecto creado") → 4. Miembro del equipo invitado → 5. Actualizar a pagado

**Configuración de embudo PostHog:**
En PostHog: Insights → Funnels → agrega estos 5 pasos en orden. Configura ventana de conversión: 14 días (duración de tu prueba).

**Predicción de dónde verás la caída:**
- Paso 1→2 (registro → dashboard): generalmente 85-95%. Si es más bajo, la confirmación de correo está rota o es lenta.
- Paso 2→3 (dashboard → primera acción): este es típicamente la caída más grande (40-60%). Fricción de estado vacío.
- Paso 3→4 (uso solo → invitar equipo): 15-30% de tasa de invitación es normal para herramientas de equipo.
- Paso 4→5 (activo → pagado): si la activación (pasos 1-4) está completa, 50-70% deberían convertirse.

**Primer experimento:** Agrega una lista de verificación de "inicio rápido" en el estado de dashboard vacío con 3 tareas. Cada evento de finalización de tarea = rastreado. El estado vacío es la palanca #1 en el paso 2→3.

---
