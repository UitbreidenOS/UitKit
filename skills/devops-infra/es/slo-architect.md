---
name: slo-architect
description: "Diseño de SLO: definir SLI's, establecer objetivos de confiabilidad, calcular presupuestos de errores, diseñar políticas de alerta, construir runbooks — metodología Google SRE"
---

> 🇪🇸 Versión en español. [Versión en inglés](../slo-architect.md).

# Habilidad de Arquitecto SLO

## Cuándo activar
- Definición de Objetivos de Nivel de Servicio (SLO's) para un servicio
- Cálculo de presupuestos de errores y establecimiento de alertas de tasa de quemadura
- Cambio de monitoreo reactivo "¿está funcionando?" a alertas proactivas basadas en SLO
- Redacción de SLA's para clientes basados en SLO's internos
- Construcción de una cultura de confiabilidad desde cero

## Cuándo NO usar
- Configuración específica de herramientas de monitoreo (use documentación de herramientas para sintaxis Prometheus/Datadog)
- Procedimientos de respuesta a incidentes — use la habilidad de runbook
- Monitoreo puro de tiempo de actividad — Uptime Robot es más simple para verificaciones básicas

## Instrucciones

### Defina SLI's (Indicadores de Nivel de Servicio)

```
Defina SLI's para este servicio.

Servicio: [describir — API / aplicación web / pipeline de datos / procesador de pagos]
Usuarios: [¿quién depende de este servicio?]
Lo que "funciona" significa para los usuarios: [su experiencia cuando todo va bien]

Tipos SLI comunes:
1. Disponibilidad: % de tiempo que el servicio es alcanzable
   Medición: solicitudes exitosas / solicitudes totales
   
2. Latencia: qué tan rápido vienen las respuestas
   Medición: % de solicitudes que se completan bajo umbral (p.ej. p99 < 200ms)
   
3. Tasa de error: % de solicitudes que fallan
   Medición: respuestas de error / respuestas totales
   
4. Rendimiento: capacidad para manejar carga
   Medición: solicitudes procesadas por segundo
   
5. Actualidad de datos: qué tan obsoletos son los datos?
   Medición: % de consultas que devuelven datos < X minutos de antigüedad
   
6. Exactitud: ¿son los resultados precisos?
   Medición: % de salidas que coinciden con lo esperado (requiere pruebas sintéticas)

Para mi servicio: defina 2-4 SLI's con fórmulas de medición exactas.
```

### Establezca objetivos de SLO

```
Ayúdeme a establecer objetivos de SLO apropiados.

Criticidad del servicio: [crítico / importante / solo-interno]
Línea base de confiabilidad actual: [tiempo de actividad / tasa de error en últimos 90 días]
Impacto comercial del tiempo de inactividad: [describir — pérdida de ingresos / impacto del cliente]
Madurez del equipo: [sin SRE / equipo SRE pequeño / SRE experimentado]

Orientación de objetivos de SLO:
- 99% (2 nueves): ~7,3 horas de tiempo de inactividad/mes — OK para herramientas internas
- 99,5%: ~3,6 horas de tiempo de inactividad/mes — típico B2B SaaS
- 99,9% (3 nueves): ~43 minutos de tiempo de inactividad/mes — estándar para orientado al cliente
- 99,95%: ~21 minutos — expectativa de alta confiabilidad
- 99,99% (4 nueves): ~4,3 minutos — pagos, sanidad, infraestructura crítica

Regla: El SLO debe ser alcanzable pero significativo. Nunca establezca 100% — es inalcanzable y crea incentivos incorrectos.

Para mi servicio: ¿cuál es un objetivo SLO apropiado y por qué?
```

### Calcular presupuesto de error

```
Calcule el presupuesto de error para estos SLO's.

SLO 1: [métrica] = [X]% sobre [28 días / mes calendario / rolling]
SLO 2: [métrica] = [X]%

Presupuesto de error = 1 - objetivo SLO
Para ventana de 28 días:
- SLO de 99,9% → presupuesto de error del 0,1% = 40,3 minutos de tiempo de inactividad permitido
- SLO de 99,5% → presupuesto de error del 0,5% = 3,36 horas permitidas

Consumo de presupuesto de error actual:
- ¿Cuánto presupuesto hemos usado hasta ahora este período? [%]
- ¿Cuántos días quedan en el período?
- ¿Estamos en camino de mantenernos dentro del presupuesto?

Si está por encima del presupuesto: ¿qué debemos dejar de hacer (lanzamientos de nuevas características) hasta que se recupere el presupuesto?
Si está por debajo del presupuesto: ¿qué riesgo podemos tomar (mantenimiento planificado, experimentos)?
```

### Diseño de alertas (Alertas de tasa de quemadura)

```
Diseñe alertas de tasa de quemadura para este SLO.

SLO: [X]% disponibilidad durante 28 días
Presupuesto de error: [calculado arriba]

Estrategia de alerta (Manual de SRE de Google):
1. Quemadura rápida (crítica): consumo de presupuesto 14x más rápido que lo normal
   → Se dispara en: 1 hora de quemadura sostenida
   → Alerta: paginar inmediatamente, esto agotará el presupuesto en ~2 días
   
2. Quemadura lenta (advertencia): consumo de presupuesto 6x más rápido que lo normal  
   → Se dispara en: 6 horas de quemadura sostenida
   → Alerta: ticket, revisar en la próxima reunión diaria, no es una llamada de vigilia
   
3. Presupuesto en X%: alerta de umbral absoluto
   → Cuando el 50% del presupuesto se consume en los primeros 14 días
   → Alerta: "en camino de agotar el presupuesto, revisar velocidad"

Para mi SLO, genere:
- Umbrales de alerta (números reales, no X)
- Nombres de alertas y niveles de gravedad
- Política de escalada en guardia
- Referencia de runbook para cada tipo de alerta
```

### Diseño del dashboard de SLO

```
Diseñe un dashboard de SLO para [servicio].

Stakeholders clave que ven esto:
- Engineering: necesita ver presupuesto de error y tasa de quemadura
- Product: necesita ver tendencias de confiabilidad, impacto en usuarios
- Leadership: necesita ver salud general, nada demasiado técnico

Secciones del dashboard:
1. Estado actual de SLO: verde/amarillo/rojo para cada SLO
2. Presupuesto de error restante: gráfico de medidor, % restante este período
3. Tasa de quemadura: tasa de quemadura de 1 hora y 6 horas vs objetivo
4. Tendencia histórica: rendimiento de SLO en 90 días
5. Correlación de incidentes: incidentes recientes e impacto en presupuesto

Herramientas: [Grafana / Datadog / Google Cloud Monitoring / New Relic / Honeycomb]
```

## Ejemplo

**Usuario:** Tengo una API REST utilizada por clientes que pagan. Sin SLO's actualmente, solo alertas de "¿está funcionando?". ¿Por dónde empiezo?

**Paquete de inicio de SLO de Claude:**

**Paso 1 — Definir 3 SLI's:**
- Disponibilidad: `solicitudes_exitosas / solicitudes_totales` (excluir 400s, contar 500s + timeouts como fallos)
- Latencia: `p99_response_time < 500ms` como proporción de todas las solicitudes
- Tasa de error: `5xx_responses / total_responses`

**Paso 2 — Establecer objetivos iniciales de SLO (conservador):**
- Disponibilidad: 99,5% (presupuesto de 3,6 horas/mes)
- Latencia p99: 99% de solicitudes bajo 500ms
- Tasa de error: < 0,5%

**Paso 3 — Una alerta para empezar:**
Alerta de tasa de quemadura: si la disponibilidad cae por debajo del 99,5% durante 1 hora → paginar al ingeniero en guardia.

**Paso 4 — Revisar en 90 días:**
Mire el rendimiento real vs SLO. Si nunca usó el presupuesto, el objetivo puede ser demasiado holgado. Si está constantemente por encima, el objetivo necesita ajuste o inversión.

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
