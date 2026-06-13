---
name: email-ab-tester
description: "Diseño y análisis de pruebas A/B de email: hipótesis, variantes, tamaño de muestra, interpretación de resultados"
---

# Habilidad de Pruebas A/B de Email

## Cuándo activar
- Quieres mejorar la tasa de apertura, clic o conversión en campañas de email
- Necesitas elegir entre dos líneas de asunto, CTAs o estructuras de email
- Tienes resultados de una prueba dividida y quieres saber si son estadísticamente significativos
- Construir un backlog de optimización a largo plazo con hipótesis de email para probar
- Ejecutaste una prueba A/B y no estás seguro de cómo interpretar "ganador" vs. "ruido"

## Cuándo NO usar
- Tu lista tiene menos de 1.000 suscriptores — no tendrás significancia estadística sin volumen suficiente; optimiza con métodos cualitativos en su lugar
- Probar campañas completamente diferentes (diferentes ofertas, diferentes audiencias) — eso es un cambio de estrategia, no una prueba A/B
- Probar más de una variable a la vez (a menos que quieras explícitamente multivariante) — aísla la variable o tus resultados serán ininterpretables
- Ya sabes lo que funciona — no pruebes para confirmar, prueba para aprender

## Instrucciones

### Prompt de diseño de prueba A/B

```
Diseña una prueba A/B para mi campaña de email.

Tipo de campaña: [boletín / promocional / secuencia automatizada / transaccional]
Tamaño de lista disponible para la prueba: [X suscriptores]
Objetivo principal: [tasa de apertura / tasa de clic / conversión / ingresos por email]
Lo que quiero probar: [línea de asunto / nombre del remitente / hora de envío / CTA / longitud del email / formato / encuadre de la oferta]

Referencia actual:
- Tasa de apertura promedio: [X%]
- Tasa de clic promedio: [X%]
- Tasa de conversión promedio: [X%]

Lo que creo que es verdad (hipótesis): [p. ej., "Una línea de asunto basada en curiosidad superará a una línea de asunto de beneficio directo para este segmento porque nuestra audiencia está orientada a la investigación"]

Diseña la prueba:

## Hipótesis
Estructura Si/Entonces/Porque:
Si [cambio], Entonces [métrica] [aumentará/disminuirá] en [X%], Porque [razón basada en lo que sabes de la audiencia].

Por qué este formato importa: "simplemente probar líneas de asunto diferentes" no es una hipótesis — es variación aleatoria. Una hipótesis adecuada te obliga a entender por qué algo podría funcionar, para que aprendas incluso cuando la prueba falla.

## Variable a probar (aislar UNA)
Qué cambia exactamente entre A y B:
Variante A (control): [versión actual / texto específico]
Variante B (retadora): [nueva versión / texto específico]

Qué permanece idéntico:
- Hora de envío: la misma
- Nombre del remitente: el mismo
- Cuerpo del email: el mismo
- Segmento de audiencia: el mismo
- Todo lo demás: igual

## Cálculo del tamaño de muestra
Usando un nivel de confianza del 95% y un poder estadístico del 80%:

Tasa de conversión base (métrica actual): [X%]
Efecto mínimo detectable (EMD): [% de mejora que necesitas ver para que valga la pena actuar — p. ej., mejora relativa del 10%]
Muestra requerida por variante: [calcular o Claude calculará]
Total de suscriptores necesarios: [2 × muestra por variante]
Nota: si tu lista es más pequeña que esto, la prueba puede estar infrapotenciada.

Referencia rápida (para pruebas de tasa de apertura, base del 25%):
Para detectar una mejora relativa del 10% (25% → 27,5%): ~3.800 por variante
Para detectar una mejora relativa del 20% (25% → 30%): ~950 por variante
Para detectar una mejora relativa del 30% (25% → 32,5%): ~430 por variante

## Plan de ejecución de la prueba
1. Segmentar la audiencia de prueba aleatoriamente (no por engagement — eso sesga los resultados)
2. Enviar ambas variantes simultáneamente (misma hora, mismo día — o dentro de 1 hora)
3. Esperar a la significancia estadística antes de declarar un ganador
4. No revisar anticipadamente y declarar un ganador basándose en 4 horas de datos — eso infla los falsos positivos

## Qué medir
Métrica principal: [la única métrica sobre la que trata tu hipótesis]
Métricas secundarias: [observa estas, pero no tomes decisiones basándote solo en ellas]
Métricas de guardarraíl: [métricas que no quieres perjudicar — p. ej., tasa de desuscripción]

## Regla de decisión
Si la Variante B supera a la Variante A por el EMD con un 95% de confianza → adoptar B
Si los resultados no son significativos → la prueba es no concluyente — no la llames empate
Si la Variante A gana → entiende por qué B falló antes de probar un retador diferente
```

### Generador de variantes de línea de asunto A/B

```
Genera variantes de prueba A/B para líneas de asunto.

Contenido del email: [describe de qué trata el email]
Público objetivo: [quiénes son y qué les importa]
Tono de marca: [formal / conversacional / lúdico / directo]
Mejor línea de asunto actual: [pégala — o describe lo que has probado]

Genera 5 pares de variantes de línea de asunto, cada uno probando un resorte psicológico diferente:

Par 1 — Beneficio directo vs. Curiosidad
A: [indica el beneficio claramente]
B: [crea una brecha de curiosidad o bucle abierto]

Par 2 — Personalización vs. Prueba social
A: [usa el nombre del destinatario o el segmento]
B: [hace referencia a un grupo o autoridad]

Par 3 — Número específico vs. Titular conceptual
A: [dato o número específico]
B: [beneficio sin el número]

Par 4 — Pregunta vs. Afirmación
A: [hace una pregunta al lector]
B: [hace una afirmación directa]

Par 5 — Corta (< 35 caracteres) vs. Descriptiva (40-55 caracteres)
A: [impactante, menos de 35 caracteres]
B: [más descriptiva, menos de 55 caracteres]

Para cada par, identifica:
- Qué hipótesis prueba
- Qué significa un triunfo de A vs. un triunfo de B para la estrategia futura
- Texto de vista previa para emparejar con cada línea de asunto
```

### Intérprete de resultados de prueba A/B

```
Interpreta mis resultados de prueba A/B.

Detalles de la prueba:
- Lo que se probó: [línea de asunto / CTA / hora de envío / etc.]
- Variante A (control): [descripción]
- Variante B (retadora): [descripción]
- Tamaño de muestra: Variante A: [X emails], Variante B: [X emails]
- Resultado:
  - Variante A: [métrica, p. ej., tasa de apertura del 24,3%]
  - Variante B: [métrica, p. ej., tasa de apertura del 27,1%]
- Duración de la prueba: [X horas / X días]
- Nivel de confianza reportado por la plataforma (si lo hay): [X%]

Interpreta:

## ¿Es este resultado estadísticamente significativo?
Calcula (o verifica el cálculo de la plataforma):
- Mejora relativa: ([B - A] / A) × 100 = X%
- Prueba z de dos proporciones:
  p1 = tasa de Variante A, n1 = envíos de Variante A
  p2 = tasa de Variante B, n2 = envíos de Variante B
- Interpretación del valor p:
  p < 0,05: estadísticamente significativo con un 95% de confianza → seguro actuar
  p 0,05-0,10: marginalmente significativo → proceder con precaución, volver a probar
  p > 0,10: no significativo → no actuar sobre este resultado

## Significancia práctica
Incluso si es estadísticamente significativo, ¿es la mejora relevante?
- ¿Cuántas aperturas/clics adicionales por cada 1.000 envíos?
- ¿Cuál es el impacto anual proyectado si aplicas esto a tu programa completo?

## Errores comunes de interpretación a evitar
1. Declarar ganador anticipadamente: muchas plataformas muestran "ganador" en pocas horas. Ignora hasta que el envío completo esté terminado.
2. Confusión por tiempo: ¿Salió A el lunes por la mañana y B el viernes por la tarde? Las diferencias de tiempo invalidan los resultados.
3. Contaminación de la muestra: ¿recibieron algunas variantes algunos suscriptores? Esto ocurre con segmentos de reactivación.
4. Problema de pruebas múltiples: si probaste 10 líneas de asunto y "encontraste" un ganador, la probabilidad de un falso positivo es alta. Corrígelo.

## Qué hacer con este resultado
Si B gana (significativo): [acción específica — actualizar plantilla, documentar el principio aprendido, aplicar a la próxima campaña]
Si no es concluyente: [qué probar a continuación — mayor muestra, mayor diferencia de variante, métrica diferente]
Si A gana (B es peor): [registra POR QUÉ — ¿qué te dice esto sobre la audiencia? ¿Qué principio confirma o niega?]

## Aprendizaje a registrar
Cada resultado de prueba A/B — gane, pierda o sea no concluyente — debe añadirse a tu base de conocimientos de email:
Hipótesis probada: [repite la hipótesis]
Resultado: [lo que ocurrió]
Principio extraído: [generalización en 1 oración, p. ej., "Nuestra audiencia responde a la especificidad — los números superan a las afirmaciones conceptuales"]
Aplica a: [líneas de asunto / CTAs / cuerpo del texto / todo el email]
```

### Constructor de backlog de pruebas A/B de email

```
Construye un backlog de pruebas A/B de 90 días para mi programa de email.

Mi programa de email actual:
- Tamaño de lista: [X]
- Frecuencia de envío: [X emails/semana o mes]
- Tasa de apertura promedio: [X%]
- Tasa de clic promedio: [X%]
- Tasa de conversión promedio: [X%]
- Mayor brecha: [tasa de apertura / tasa de clic / conversión — ¿dónde pierdes más?]

Genera un backlog priorizado de 10 pruebas, ordenadas por:
1. Impacto potencial en tu mayor brecha
2. Facilidad de ejecución
3. Valor de aprendizaje (incluso si el resultado es negativo)

Para cada prueba:
- Nombre de la prueba e hipótesis
- Métrica objetivo
- Tamaño de muestra requerido
- Tiempo de ejecución
- Qué aprendes independientemente del resultado

Regla de priorización:
- Arregla primero la parte superior del embudo (tasa de apertura) antes de optimizar el medio del embudo (tasa de clic)
  porque una mejora del 10% en tasa de apertura mejora automáticamente todas las métricas posteriores
- Prueba una variable por envío — no mezcles cambios de línea de asunto + CTA en la misma prueba
- Espaciar las pruebas al menos 2 semanas para evitar contaminación del aprendizaje

Resultado como calendario:
Mes 1 (base): probar variables de tasa de apertura
Mes 2 (engagement): probar variables de tasa de clic
Mes 3 (conversión): probar variables de aterrizaje/conversión
```

### Guía de pruebas multivariante (avanzado)

```
Diseña una prueba de email multivariante.

IMPORTANTE: las pruebas multivariantes requieren un tamaño de muestra mínimo 10 veces mayor que una prueba A/B simple.
Úsalas solo si tienes una lista muy grande (> 100k envíos disponibles) y puedes tolerar la complejidad.

Variables a probar:
Variable 1: [p. ej., línea de asunto — 2 variantes]
Variable 2: [p. ej., texto del CTA — 2 variantes]
Variable 3: [p. ej., imagen hero — 2 variantes]

Número de combinaciones: 2³ = 8 celdas de prueba
Muestra mínima por celda: [calculada según métrica base y EMD]
Muestra total requerida: [8 × mínimo por celda]

Explica por qué la mayoría de los equipos NO deben ejecutar pruebas multivariantes:
1. El requisito de tamaño de muestra es prohibitivo para la mayoría de las listas
2. Los efectos de interacción entre variables son difíciles de interpretar
3. La celda ganadora puede no generalizarse — no puedes aislar qué causó el triunfo
4. Es mejor ejecutar 3 pruebas A/B secuenciales que 1 prueba multivariante
   (Las pruebas secuenciales pierden algo de velocidad pero ganan en interpretabilidad)

En su lugar se recomienda: Prueba A/B factorial (secuencia de 3 pruebas, aplicando el ganador cada vez).
```

### Referencia de calculadora de significancia estadística

```typescript
// Prueba z de dos proporciones para resultados de email A/B
function calculateSignificance(
  variantARate: number,   // e.g., 0.243 for 24.3%
  variantASize: number,   // e.g., 5000
  variantBRate: number,   // e.g., 0.271
  variantBSize: number    // e.g., 5000
): { zScore: number; pValue: number; significant: boolean } {

  const pCombined = (variantARate * variantASize + variantBRate * variantBSize)
    / (variantASize + variantBSize)

  const standardError = Math.sqrt(
    pCombined * (1 - pCombined) * (1/variantASize + 1/variantBSize)
  )

  const zScore = (variantBRate - variantARate) / standardError
  // Convert zScore to p-value using normal distribution
  // |z| > 1.96 = p < 0.05 = 95% confidence
  // |z| > 2.576 = p < 0.01 = 99% confidence

  return {
    zScore,
    pValue: /* normal CDF calculation */ 0,
    significant: Math.abs(zScore) > 1.96
  }
}

// Minimum detectable effect (MDE) at 95% confidence, 80% power
function minimumSampleSize(
  baselineRate: number,
  mde: number  // relative improvement as decimal, e.g., 0.10 for 10%
): number {
  const p1 = baselineRate
  const p2 = baselineRate * (1 + mde)
  // Standard formula: n = 16 * p(1-p) / (p2-p1)^2 (approximate)
  return Math.ceil(16 * p1 * (1 - p1) / Math.pow(p2 - p1, 2))
}
```

## Ejemplo

**Usuario:** Mi prueba de línea de asunto tuvo 5.200 envíos por variante. La Variante A (directa): "Tus resultados del Q4 están listos" obtuvo un 24,8% de tasa de apertura. La Variante B (curiosidad): "Encontramos algo sorprendente en tus datos" obtuvo un 28,2% de tasa de apertura. ¿Es real?

**Interpretación:**

```
## Resumen de Resultados
Mejora relativa: (28,2 - 24,8) / 24,8 = +13,7%
Mejora absoluta: +3,4 puntos porcentuales

## Prueba Estadística
n = 5.200 por variante
Tasa combinada: (0,248 × 5200 + 0,282 × 5200) / 10400 = 0,265
Error estándar = √(0,265 × 0,735 × (1/5200 + 1/5200)) = 0,00869
Puntuación Z = (0,282 - 0,248) / 0,00869 = 3,91

p < 0,0001 — altamente significativo. Esto no es ruido.

## Significancia Práctica
Con 5.200 envíos: +177 aperturas adicionales por campaña
Aplicado a tu lista completa (asumiendo 20k envíos/campaña): +680 aperturas
Con un CTR del 2% en aperturas, eso son +14 clics adicionales por campaña.

## Decisión
Adoptar la Variante B para este tipo de email: el encuadre "algo inesperado en tus datos".
Este es un patrón de brecha de curiosidad — no estás dando la respuesta en la línea de asunto.

## Principio a Registrar
"Las líneas de asunto con brecha de curiosidad superan a las de beneficio directo en ~14%
para emails de datos/resultados. La audiencia quiere saber qué fue sorprendente —
la pregunta sin respuesta impulsa la apertura."

## Advertencia
Esta fue una sola prueba. Valida con una segunda prueba en una campaña diferente antes de tratar
esto como una regla universal. Los principios se generalizan; los resultados de una sola prueba puede que no.
```

---
