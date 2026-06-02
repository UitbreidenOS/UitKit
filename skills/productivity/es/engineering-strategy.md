---
name: engineering-strategy
description: "Documento de estrategia de ingeniería: visión tecnológica, decisiones de construir vs. comprar, topología de equipos, hoja de ruta de 12 meses"
---

# Habilidad: Estrategia de Ingeniería

## Cuándo activar
- Escribir el documento de estrategia de ingeniería para un nuevo rol de CTO o al inicio de un ciclo de planificación
- Presentar la dirección de ingeniería al consejo, CEO o inversores
- Decidir si construir, comprar o asociarse en una capacidad técnica importante
- Rediseñar la topología de equipos después de un crecimiento significativo, una reorganización o un giro de producto
- Establecer una hoja de ruta de 12 meses que equilibre la entrega de producto con la salud de la plataforma
- Documentar la visión técnica después de decisiones arquitectónicas importantes

## Cuándo NO usar
- Decisiones de arquitectura individuales — usa `/adr-writer` para esas
- Planificación a nivel de sprint — usa tu herramienta de gestión de proyectos
- Contratación de roles individuales — usa una descripción del puesto y una rúbrica de contratación en su lugar
- Revisiones post-incidente — eso es un artefacto operativo específico, no un documento de estrategia

## Instrucciones

### Documento completo de estrategia de ingeniería

```
Escribe un documento de estrategia de ingeniería para [EMPRESA].

Contexto:
- Etapa de la empresa: [semilla / serie A / serie B / crecimiento / empresa grande]
- Tamaño actual del equipo de ingeniería: [X ingenieros]
- Arquitectura actual: [monolito / microservicios / serverless / híbrida]
- Stack tecnológico principal: [lenguajes, frameworks, proveedor de nube]
- Mayor problema técnico actual: [ej., velocidad de despliegue, confiabilidad, escalado, deuda técnica]
- Contexto de negocio: [qué está tratando de lograr la empresa en los próximos 12 meses]
- Top 3 prioridades de producto del CEO/CPO: [listarlas]

Produce un documento de estrategia que cubra:

## 1. Visión de Ingeniería (12 meses)
Un párrafo: ¿Cómo es nuestra organización de ingeniería en 12 meses?
Abordar específicamente:
- Frecuencia de despliegue (objetivo)
- Confiabilidad del sistema (objetivo de tiempo de actividad / tasa de error)
- Estructura del equipo (cuántos equipos, qué modelo)
- Experiencia del desarrollador (¿qué tan rápido puede un nuevo ingeniero lanzar su primera función?)

## 2. Evaluación del Estado Actual
Diagnóstico honesto — qué funciona, qué está roto:
- Arquitectura: [estado actual y limitaciones clave]
- Deuda técnica: [cuantificar si es posible — % del tiempo de desarrollo perdido en ella]
- Velocidad de despliegue: [despliegues actuales por día o semana]
- Confiabilidad: [tiempo de actividad actual, tasa de incidentes]
- Estructura del equipo: [topología actual y dónde falla]

## 3. Prioridades Estratégicas (clasificadas)
Top 3-5 apuestas de ingeniería para los próximos 12 meses.
Para cada prioridad:
- Qué es
- Por qué importa (impacto en el negocio, no elegancia técnica)
- Cómo se ve el éxito (medible)
- Inversión aproximada requerida (semanas de ingeniería / número de personas)

## 4. Construir vs. Comprar vs. Asociarse
Para cada capacidad técnica importante que necesitamos:
| Capacidad | Construir | Comprar | Asociarse | Recomendación | Justificación |
Usar criterios:
- ¿Diferenciador central? → Construir
- ¿Problema resuelto/commodity? → Comprar
- ¿Necesitas alcance/red? → Asociarse
- ¿Tiempo de comercialización crítico? → Inclinarse hacia Comprar

## 5. Topología de Equipos
Estructura actual → objetivo durante 12 meses.
Modelos de equipo para elegir:
- Equipos alineados por flujo (propiedad de producto-función)
- Equipos de plataforma/habilitación (experiencia del desarrollador, infra)
- Equipos de subsistemas complicados (ML, búsqueda, pipeline de datos)
Usar vocabulario de Team Topologies: alineado por flujo, plataforma, habilitador, subsistema complicado.
Para cada equipo: misión, tamaño, propiedad tecnológica, interfaces con otros equipos.

## 6. Apuestas Tecnológicas
¿A qué nos comprometemos durante los próximos 2-3 años?
- Lenguajes y frameworks principales (en qué estamos estandarizando)
- Proveedor de nube y servicios gestionados clave
- De qué nos alejamos (plan de retiro)
- Qué estamos observando pero aún no comprometiendo

## 7. Métricas de Salud de Ingeniería
¿Cómo mediremos si la estrategia está funcionando?
| Métrica | Actual | Objetivo a 6 meses | Objetivo a 12 meses |
Incluir: métricas DORA (frecuencia de despliegue, tiempo de entrega, MTTR, tasa de fallos de cambio), disponibilidad, NPS de desarrolladores, ratio de deuda técnica.

## 8. Riesgos y Mitigaciones
Top 3 riesgos para esta estrategia:
- Riesgo, probabilidad, impacto, mitigación

## 9. Solicitud de Inversión
¿Qué necesitamos para ejecutar esta estrategia?
- Número de personas: [X ingenieros a contratar en los próximos 12 meses]
- Presupuesto de herramientas: [$X para decisiones de construir vs. comprar]
- Infraestructura: [cambio esperado en el costo de infraestructura]
```

### Marco de decisión de construir vs. comprar

```
Ayúdame a decidir si construir o comprar [CAPACIDAD].

Descripción de la capacidad: [qué necesitamos que haga]
Nuestro enfoque actual: [cómo lo manejamos hoy, si acaso]
Presión de tiempo: [cuándo lo necesitamos]
Costo de ingeniería para construir: [estimación en semanas de ingeniería, o pedir a Claude que estime]
Opciones de compra que he identificado: [nombres de proveedores, precio si se conoce]
Experiencia de nuestro equipo en esta área: [sólida / débil / ninguna]

Evaluar con estos criterios:

1. Prueba del diferenciador central
¿Es esta capacidad parte de nuestra propuesta de valor única?
- SÍ → Señal fuerte para construir (poseerla = ventaja competitiva)
- NO → Señal fuerte para comprar (es infraestructura commodity)

2. Complejidad vs. experiencia
- Alta complejidad + poca experiencia del equipo → Comprar (el riesgo de construir es alto)
- Alta complejidad + sólida experiencia del equipo → Construir (si es diferenciador)
- Baja complejidad + cualquier experiencia → Construir (a menos que off-the-shelf sea trivial)

3. Tiempo de comercialización
- Necesitar en < 3 meses → Comprar casi siempre gana
- 3-12 meses → depende de la importancia estratégica
- 12+ meses → construir si es diferenciador

4. Costo total de propiedad (horizonte de 3 años)
Construir: costo de ingeniería + costo de mantenimiento + costo de oportunidad
Comprar: tarifas de licencia + integración + prima de lock-in

5. Riesgo del proveedor
- Proveedor startup: riesgo de lock-in, riesgo de adquisición
- Proveedor establecido: riesgo de poder de precios, riesgo de hoja de ruta lenta
- Código abierto: carga de mantenimiento, riesgo de comunidad

Salida:
- Recomendación: Construir / Comprar / Híbrido / Posponer
- 3 razones más sólidas para la recomendación
- Qué cambiaría tu decisión
- Si Comprar: lista corta de proveedores y próximo paso
- Si Construir: arquitectura aproximada y asignación de equipo
```

### Diseño de topología de equipos

```
Diseña la topología de equipos para nuestra organización de ingeniería.

Estado actual:
- Total de ingenieros: [X]
- Equipos actuales: [listarlos y qué hacen]
- Mayores problemas de coordinación: [¿dónde se rompen o ralentizan las transferencias?]
- Áreas de producto: [listar los principales dominios de producto]
- Madurez de plataforma/infra: [sólida / débil / inexistente]

Estado objetivo:
- Ingenieros en 12 meses: [X (incluido el plan de contratación)]
- Prioridad de negocio principal: [lanzar funciones de producto / escalar infraestructura / reducir incidentes]

Diseña la topología objetivo usando estos tipos de equipo:
1. Equipos alineados por flujo: Son propietarios de un dominio de producto de extremo a extremo, flujo rápido, empoderados
2. Equipo de plataforma: Producto interno — CI/CD, observabilidad, herramientas de desarrollador, infra
3. Equipo habilitador: Temporal, entrena a otros equipos en transiciones (migración, nueva tecnología)
4. Equipo de subsistema complicado: Se requiere experiencia profunda — ML, búsqueda, procesamiento de pagos

Para cada equipo en el diseño objetivo:
- Nombre del equipo y misión
- Tamaño del equipo (objetivo e intermedio)
- Qué poseen (servicios, funciones, infra)
- De qué dependen (del equipo de plataforma o externo)
- Cómo interactúan con equipos adyacentes (API, servicio compartido, consulta)
- Métrica de éxito para este equipo

Modos de interacción entre equipos:
- Colaboración: trabaja estrechamente, comunicación frecuente (temporal, para transiciones)
- X-as-a-Service: relación consumidor/proveedor con interfaz definida
- Facilitación: un equipo ayuda a otro a desarrollar capacidad (con límite de tiempo)

Salida: organigrama + cartas de equipo + diagrama de modelo de interacción (basado en texto)
```

### Hoja de ruta de ingeniería de 12 meses

```
Construye una hoja de ruta de ingeniería de 12 meses.

Prioridades de negocio del liderazgo:
Q1: [qué necesita lanzar / lograr la empresa]
Q2: [qué necesita lanzar / lograr la empresa]
Q3: [qué necesita lanzar / lograr la empresa]
Q4: [qué necesita lanzar / lograr la empresa]

Restricciones de ingeniería:
- Capacidad actual del equipo: [X ingenieros × 10 días productivos/sprint]
- Contratación planificada: [cuándo y qué roles]
- Obligaciones de deuda técnica conocidas: [qué debe abordarse]
- Migraciones planificadas: [ej., pasando a microservicios, actualizando infra]

Formato de la hoja de ruta:

## Q1 — [Tema]
Entregables de producto: [lista]
Trabajo de plataforma / infra: [lista]
Deuda técnica abordada: [lista]
Contratación: [roles]
Riesgo: [qué podría descarrilar este trimestre]

[repetir para Q2, Q3, Q4]

## Distribución de inversión (objetivo)
- Nuevas funciones de producto: [X]%
- Plataforma e infraestructura: [X]%
- Reducción de deuda técnica: [X]%
- Confiabilidad y guardia: [X]%

Ratio objetivo para organizaciones de ingeniería saludables:
- Etapa temprana: 70/15/10/5 (lanzar rápido, preocuparse por la deuda después)
- Etapa de crecimiento: 60/20/15/5 (comenzar a invertir en plataforma)
- Etapa de escala: 50/25/20/5 (la deuda y la confiabilidad se vuelven existenciales)

## Dependencias y bloqueadores
¿Qué debe suceder fuera de ingeniería para que esta hoja de ruta tenga éxito?
- Decisiones de producto necesarias para [fecha]
- Recursos de diseño necesarios en [trimestre]
- Aprobaciones de datos / legales / cumplimiento necesarias para [función]
```

### Línea base de métricas DORA

```typescript
interface DORAMetrics {
  // Frecuencia de despliegue: con qué frecuencia despliegas a producción
  deploymentFrequency: 'multiple_per_day' | 'daily' | 'weekly' | 'monthly' | 'less_than_monthly'

  // Tiempo de entrega de cambios: tiempo desde el commit hasta producción
  leadTimeHours: number

  // Tasa de fallos de cambio: % de despliegues que causan incidentes
  changeFailureRate: number  // 0.0 a 1.0

  // Tiempo medio de restauración: tiempo promedio para recuperarse de un incidente
  mttrHours: number
}

// Benchmarks de rendimiento élite (informe DORA State of DevOps)
const DORA_ELITE: DORAMetrics = {
  deploymentFrequency: 'multiple_per_day',
  leadTimeHours: 1,
  changeFailureRate: 0.05,   // < 5%
  mttrHours: 1,
}

// Benchmarks de alto rendimiento
const DORA_HIGH: DORAMetrics = {
  deploymentFrequency: 'daily',
  leadTimeHours: 24,
  changeFailureRate: 0.10,   // < 10%
  mttrHours: 8,
}

// Usar estos para comparar el estado actual y establecer objetivos en la estrategia de ingeniería
```

## Ejemplo

**Usuario:** Soy un nuevo CTO en una startup en Serie B (120 empleados, 18 ingenieros). Tenemos un monolito Rails de 6 años, 4 equipos no diferenciados, 1 despliegue por semana y 97% de tiempo de actividad. El consejo quiere triplicar nuestra entrega de producto en 12 meses.

**Extracto de la salida:**

```
## Visión de Ingeniería (12 meses)
Una organización de ingeniería de 25 personas que lanza a producción 10 veces por día con 99.5% de tiempo de actividad,
estructurada en 4 equipos de producto alineados por flujo y 1 equipo de plataforma. Un nuevo ingeniero lanza
a producción en su primera semana.

## Evaluación del Estado Actual
Arquitectura: Monolito Rails 6, 6 años de deuda. Limitación principal: los feature flags no existen,
así que cada despliegue es todo o nada — por eso los despliegues semanales se sienten necesarios.
Velocidad de despliegue: 1 despliegue/semana = rendimiento DORA "medio". Objetivo: mínimo diario, múltiples/día para Q4.
Confiabilidad: 97% de tiempo de actividad = ~260 horas/año de tiempo de inactividad. Objetivo: 99.5% = < 44 horas/año.
Estructura del equipo: 4 equipos no diferenciados = todos dependen de todos. La sobrecarga de coordinación
explica por qué 18 ingenieros se sienten como si se estuvieran moviendo lentamente.

## Prioridades Estratégicas
1. Infraestructura de feature flags (Q1): Habilitar despliegue continuo seguro. Sin esto, la velocidad no puede mejorar.
2. Formación del equipo de plataforma (Q1): 3 ingenieros fuera del trabajo de producto, tiempo completo en CI/CD, observabilidad, despliegue
3. Propiedad de dominio del equipo (Q2): Asignar límites claros de dominio de producto — detener la red de dependencias entre equipos
4. Extracción de servicios (Q3-Q4): Extraer 2-3 contextos acotados de mayor valor del monolito

## Construir vs. Comprar
| Capacidad | Recomendación | Justificación |
|---|---|---|
| Feature flags | Comprar (LaunchDarkly) | No es un diferenciador. $20k/año ahorra 8 semanas de ingeniería |
| Observabilidad | Comprar (Datadog o Honeycomb) | Commodity. Comprar ahora, construir pipeline de datos después |
| Pipeline CI/CD | Construir en GitHub Actions | Ya es propio, el equipo tiene experiencia |
| Gestión de incidentes | Comprar (PagerDuty) | Problema resuelto, ruta crítica |
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
