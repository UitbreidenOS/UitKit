---
name: growth-dashboard
description: "Panel de crecimiento semanal: métricas de adquisición, activación, retención, ingresos y referidos con análisis de tendencias y comentarios para equipos de crecimiento"
---

# Habilidad de Panel de Crecimiento

## Cuándo activar
- Construir el informe de crecimiento semanal para la dirección o el equipo
- Reunir métricas AARRR a través de adquisición, activación, retención, ingresos y referidos
- Diagnosticar qué palanca de crecimiento está rota esta semana vs. la semana pasada
- Redactar el comentario narrativo alrededor de tus métricas — no solo los números
- Diseñar un nuevo panel de crecimiento en Looker Studio, Metabase o Notion
- Hacer seguimiento del estado del portafolio de experimentos junto con las métricas de negocio

## Cuándo NO usar
- Análisis profundo de una sola métrica — esta es una habilidad de síntesis, no de depuración
- Configurar infraestructura de analítica — usa `/analytics-tracking`
- Diseñar experimentos individuales — usa `/experiment-tracker`
- Modelado financiero para inversores — usa el flujo de trabajo de modelo financiero

## Instrucciones

### Prompt del panel de crecimiento semanal

```
Construye mi panel de crecimiento semanal para la semana de [FECHA].

Producto: [describir — SaaS / marketplace / app móvil / ecommerce]
Etapa: [pre-PMF / post-PMF / escalando]
Métrica Estrella del Norte: [el único número que captura la salud del negocio]

Datos de esta semana:

ADQUISICIÓN
- Nuevos visitantes: [N] (vs. [N] la semana pasada, [N] el mismo mes pasado)
- Nuevos registros / leads: [N] (vs. [N] SP)
- Tasa de registro (visitantes → registros): [X%]
- CAC por canal esta semana: [Google: $X | Meta: $X | Orgánico: $X | Referidos: $X]
- Gasto pagado: $[X] (vs. $[X] SP)

ACTIVACIÓN
- Nuevos usuarios que completaron el evento de activación: [N] / [N] nuevos registros = [X%] tasa de activación
- Definición de activación: [qué cuenta como activado — p. ej., "creó el primer proyecto"]
- Tiempo hasta la activación (mediana): [X horas/días]

RETENCIÓN
- DAU / WAU / MAU: [N] / [N] / [N]
- Ratio DAU/MAU (adherencia): [X%]
- Retención a 7 días (de cohortes de hace 7 días): [X%]
- Retención a 30 días: [X%]
- Bajas esta semana: [N] clientes / $[X] MRR

INGRESOS
- MRR: $[X] (vs. $[X] la semana pasada)
- Nuevo MRR: $[X]
- MRR de expansión: $[X]
- MRR de bajas: $[X]
- MRR neto nuevo: $[X]
- Ratio LTV:CAC: [X:1]
- Periodo de recuperación: [X meses]

REFERIDOS
- Registros por referidos esta semana: [N]
- Tasa de referidos: [registros por referidos / total de registros]: [X%]
- NPS (si se midió esta semana): [X]

EXPERIMENTOS EN EJECUCIÓN
[Lista de pruebas A/B activas, días en ejecución, mejora actual vs. control]

---

Produce el panel de crecimiento semanal con:
1. Cifras principales (esta semana vs. la semana pasada vs. promedio de 4 semanas)
2. Estado semáforo para cada métrica (verde / amarillo / rojo vs. objetivos)
3. Top 3 observaciones — qué cambió de forma significativa y por qué
4. Una hipótesis para cada tendencia negativa
5. Acciones recomendadas para la próxima semana
6. Portafolio de experimentos: qué pruebas concluir, cuáles extender
```

### Constructor del marco AARRR

```
Diseña un marco de métricas AARRR completo para [producto].

Etapa del producto: [pre-lanzamiento / inicial / crecimiento / escala]
Modelo de negocio: [suscripción / transaccional / basado en uso / freemium]
Canal principal: [contenido / pago / PLG / ventas]

Construye métricas para cada etapa:

ADQUISICIÓN — ¿Cómo nos encuentran las personas?
Métricas principales:
- Total de nuevos visitantes / leads / registros por canal
- CAC por canal (gasto / nuevos clientes de ese canal)
- Ratio orgánico vs. pagado
- Puntuación de eficiencia de canal: [tasa de conversión × LTV promedio / CAC]

Benchmarks:
- Buen periodo de recuperación del CAC: < 12 meses para PYME, < 18 meses para mediana empresa
- El orgánico debería crecer como % del total con el tiempo (no estático ni decreciente)

ACTIVACIÓN — ¿Obtienen valor los nuevos usuarios?
Métricas principales:
- Tasa de activación: % de registros que completan [evento del momento aha]
- Tiempo hasta la activación (mediana en días)
- Completitud del momento aha por canal de adquisición (los usuarios orgánicos se activan diferente que los de pago)

Benchmarks:
- < 20% de tasa de activación: problema grave de onboarding
- 20-40%: oportunidad de mejora
- 40-60%: saludable para productos complejos
- > 60%: sólido para herramientas simples

RETENCIÓN — ¿Vuelven los usuarios?
Métricas principales:
- Retención D1 / D7 / D30 (% de usuarios que regresan ese día)
- Curvas de retención de cohortes semanales / mensuales
- Ratio de adherencia DAU/MAU
- Profundidad de adopción de funcionalidades (usuarios usando 1 función vs. 3+ funciones)

Benchmarks:
- Retención D7 > 25%: viable (B2C), > 40%: viable (B2B SaaS)
- D30 > 15% (B2C), > 35% (B2B)
- DAU/MAU > 20%: producto comprometido

INGRESOS — ¿Monetizamos de forma efectiva?
Métricas principales:
- MRR / ARR y tasa de crecimiento (SaS, MaM)
- ARPU / ARPA (por usuario / por cuenta)
- LTV (contrato promedio × margen bruto / tasa de bajas)
- Ratio LTV:CAC
- Periodo de recuperación
- Retención neta de ingresos (RNI): [expansión - bajas] / MRR inicial

Benchmarks:
- LTV:CAC > 3:1: saludable
- Periodo de recuperación < 12 meses: bueno, < 18 meses: aceptable
- RNI > 100%: la expansión compensa las bajas (best-in-class > 120%)

REFERIDOS — ¿Lo recomiendan los usuarios?
Métricas principales:
- Coeficiente viral: nuevos usuarios por usuario existente por periodo
- Tasa de referidos: % de registros por referidos
- NPS y porcentaje de promotores
- Reseñas / casos de estudio generados

Benchmarks:
- Coeficiente viral > 0,5: boca a boca significativo
- > 1,0: viralidad (poco frecuente, a menudo de corta duración)
- NPS > 40: base dominada por promotores

Produce una plantilla de panel para [producto] con las 15 métricas principales, objetivos y fuentes de datos.
```

### Generador de narrativa de crecimiento

```
Escribe el comentario de crecimiento para mi informe semanal/mensual.

Audiencia: [CEO / consejo / equipo de crecimiento / toda la empresa]
Tono: [analítico / resumen ejecutivo / conversacional]

Rendimiento de este periodo:
- [Métrica clave]: [resultado vs. objetivo — ¿fue por encima/debajo/en línea con el objetivo?]
- [Métrica clave]: [resultado]
- [Métrica clave]: [resultado]

Contexto a integrar:
- ¿Qué factores externos afectaron los resultados? [estacionalidad / acción de la competencia / macro]
- ¿Qué cambios internos ocurrieron? [campañas lanzadas / cambios de producto / cambios de precios]
- ¿Qué experimentos concluyeron? [resultados]
- ¿Qué está funcionando bien? [1-2 cosas que van bien]
- ¿Cuál es el riesgo? [1 cosa que te preocupa]
- Enfoque de la próxima semana: [la única palanca que vas a accionar]

Escribe una narrativa de 200-300 palabras que:
1. Encabece con el movimiento de la Métrica Estrella del Norte — positivo o negativo, nómbralo
2. Atribuya el movimiento a 1-2 causas específicas (no vagas — "el CAC de pago subió un 18% porque los cambios de iOS 18 redujeron la calidad de la señal de Meta")
3. Identifique la única métrica que más importa esta semana y por qué
4. Dé una acción concreta — no "lo monitorizaremos" sino "haremos X antes del viernes"
5. Termine con la perspectiva: ¿vamos bien para alcanzar el objetivo del mes?

No escribas: "Vimos resultados mixtos." Nombra los resultados y asúmelos.
```

### Análisis de cohortes de ingresos

```
Analiza mis cohortes de ingresos para entender el LTV y la recuperación.

Producto: [SaaS de suscripción / transaccional]
Definición de cohorte: [mes del primer pago]
Datos disponibles: [meses de historial]

Formato de tabla de cohortes:
Mes | MRR Inicial | MRR Mes 1 | Mes 3 | Mes 6 | Mes 12 | Estimación LTV

Proporciona datos para cada cohorte: [pegar CSV o tabla]

Analiza:
1. Retención por cohorte — ¿qué cohortes retienen mejor y por qué?
   (Pregunta: ¿qué cambió en la adquisición, activación o producto alrededor de la fecha de inicio de esa cohorte?)

2. Ingresos de expansión — ¿los clientes que permanecen están expandiendo?
   RNI = (MRR inicial + expansión - bajas - contracción) / MRR inicial
   RNI > 100%: cada cohorte vale más con el tiempo (best-in-class: 120-140%)

3. Cálculo del LTV:
   Ingresos mensuales promedio por cliente: $[X]
   Vida útil promedio del cliente: 1 / tasa mensual de bajas = [X meses]
   LTV = ingresos mensuales promedio × vida útil promedio × % de margen bruto
   LTV = $[X] × [X] × [X%] = $[X]

4. Periodo de recuperación:
   CAC / (ARPU × % de margen bruto) = [X meses]
   Compara con la vida útil promedio del cliente — si la recuperación > la vida útil, estás en números rojos

5. ¿Qué canal produce los clientes con mayor LTV?
   Desglosar el LTV por canal de adquisición: [pago / orgánico / referidos / ventas]
   Esto te dice dónde aumentar la inversión en CAC

Produce: gráfico de LTV por cohorte, análisis de recuperación y tabla comparativa de LTV por canal.
```

### Optimización de la mezcla de canales

```
Optimiza mi mezcla de canales de marketing para el crecimiento.

Rendimiento actual del canal:
| Canal | Gasto | Nuevos Clientes | CAC | LTV Promedio | LTV:CAC | Recuperación |
|---|---|---|---|---|---|---|
| Google Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X meses] |
| Meta Ads | $[X] | [N] | $[X] | $[X] | [X:1] | [X meses] |
| Contenido/SEO | $[X] | [N] | $[X] | $[X] | [X:1] | [X meses] |
| Referidos | $[X] | [N] | $[X] | $[X] | [X:1] | [X meses] |
| Ventas salientes | $[X] | [N] | $[X] | $[X] | [X:1] | [X meses] |

Presupuesto total: $[X]/mes
Objetivo de crecimiento: [X nuevos clientes/mes o $X de nuevo MRR]

Análisis:
1. Clasificar canales por LTV:CAC — asignar más a canales con ratio > 3:1
2. Identificar canales saturados — si el CAC sube MaM en un canal, estás llegando al techo de escala
3. Identificar canales con inversión insuficiente — el orgánico/referidos a menudo tiene el mejor LTV pero la menor inversión
4. Economía marginal: a 2x el gasto en [canal], ¿qué ocurre con el CAC? (típicamente sube)
5. Gasto mínimo viable — algunos canales (p. ej., SEO, comunidad) requieren una inversión umbral para producir resultados

Recomendación de reasignación presupuestaria:
- Aumentar: [canal] — mayor LTV:CAC, aún no saturado
- Mantener: [canal] — funcionando en el objetivo, CAC estable
- Reducir: [canal] — CAC subiendo, LTV:CAC por debajo de 2:1
- Experimentar: [canal] — no probado, bajo coste de validación

Nueva asignación presupuestaria: [tabla con antes vs. después]
Impacto proyectado: [X más clientes/mes a las tasas de conversión actuales]
```

## Ejemplo

**Usuario:** Aquí están nuestros números semanales. Dime qué está pasando y qué hacer. Registros: 342 (bajando de 410 la semana pasada). Activación: 31% (bajando del 35%). MRR: $48.200 (subiendo $1.100 desde la semana pasada). Bajas: 2 clientes ($400 MRR). Gasto pagado: $12.000.

**Panel de crecimiento de Claude:**

**Semana de [FECHA] — Panel de Crecimiento**

**Estrella del Norte: MRR $48.200 (+$1.100 SaS) — en camino**

| Métrica | Esta Semana | Semana Pasada | Tendencia |
|---|---|---|---|
| Registros | 342 | 410 | -17% |
| Tasa de activación | 31% | 35% | -4pp |
| Nuevo MRR | $1.500 | $1.800 | -17% |
| MRR de bajas | $400 | $300 | +33% |
| MRR neto nuevo | $1.100 | $1.500 | -27% |
| CAC (combinado) | $35 | $29 | +21% |

**Top 3 observaciones:**

1. El volumen de registros cayó un 17% — con el gasto estable en $12K, el CAC subió de $29 a $35. Esta es una señal de problema de calidad de adquisición pagada, no de presupuesto. Revisa los informes de términos de búsqueda de Google Ads y la frecuencia de Meta Ads — probablemente alcanzando fatiga de audiencia.

2. La activación cayó 4 puntos — 342 registros × caída de 4pp = ~14 activaciones menos de las esperadas. Con nuestra conversión típica de activación a pago, eso equivale a ~$700 en riesgo en los próximos 30 días. Algo en el flujo de onboarding cambió o se rompió esta semana — verifica si se implementaron cambios de UI/producto.

3. El MRR sigue siendo positivo porque la expansión se mantuvo — los clientes que hacen upgrade compensaron la desaceleración de nuevos clientes. Esto es frágil; la expansión no puede sostener el negocio si el flujo de nuevos usuarios sigue cayendo.

**Acciones para la próxima semana:**
- Pago: obtener el informe de frecuencia de Meta; si la frecuencia > 4 por persona, lanzar nuevo conjunto creativo
- Activación: ejecutar grabaciones de sesión en la ruta registro → momento aha (Hotjar/FullStory) — encontrar la caída
- Bajas: llamar a los 2 clientes que se fueron esta semana; entender si es producto, precio o competidor

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
