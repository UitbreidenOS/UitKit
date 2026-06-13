---
name: product-roadmap
description: "Construcción de hojas de ruta de productos: frameworks de priorización (RICE, MoSCoW, puntuación de oportunidades), formatos de hojas de ruta, alineación de OKR, comunicación de partes interesadas y planificación trimestral"
---

# Habilidad de Hoja de Ruta de Productos

## Cuándo activar
- Construcción o reestructuración de una hoja de ruta de productos
- Priorización de un trabajo pendiente de características y oportunidades
- Alineación de la hoja de ruta a los OKRs de la empresa
- Comunicación de la hoja de ruta a diferentes partes interesadas (ingeniería, ventas, ejecutivos, clientes)
- Ejecución de un proceso de planificación trimestral
- Decidir qué cortar cuando la capacidad es limitada

## Cuándo NO usar
- Planificación de tareas a nivel de sprint — eso es gestión de entregas, no hoja de ruta
- Descubrimiento (decidir qué problemas resolver) — use la habilidad product-discovery
- Escribir specs técnicas o historias de usuario — eso es después de la decisión de hoja de ruta
- Diseño de prueba A/B — use la habilidad experiment-designer

## Instrucciones

### Framework de priorización

```
Priorizar este trabajo pendiente usando [RICE / MoSCoW / puntuación de oportunidades].

Elementos a priorizar: [lista — pueden ser características, proyectos o áreas problemáticas]
Restricciones: [tamaño del equipo, horizonte temporal, presupuesto]
Objetivos estratégicos este trimestre: [OKRs o principales prioridades]

Puntuación RICE (para decisiones de características):
| Elemento | Alcance | Impacto | Confianza | Esfuerzo | Puntuación RICE |
|---|---|---|---|---|---|
| Característica A | 500 usuarios/t | 3 (alto) | 80% | 3 semanas | (500×3×0,8)/3 = 400 |
| Característica B | 1000 usuarios/t | 1 (bajo) | 90% | 1 semana | (1000×1×0,9)/1 = 900 |

Alcance: usuarios afectados por trimestre
Impacto: masivo=3 / alto=2 / medio=1 / bajo=0,5 / mínimo=0,25
Confianza: % de certidumbre sobre estimaciones de alcance e impacto
Esfuerzo: semanas de ingeniería para un ingeniero

MoSCoW (para lanzamientos de alcance fijo):
- Debe tener: sin esto, el lanzamiento falla
- Debería tener: alto valor, incluir si la capacidad permite
- Podría tener: agradable tener, primero a cortar
- No tendrá: explícitamente fuera de alcance (previene expansión de alcance)

Puntuación de oportunidades (priorización a nivel de problema):
Puntuación = Importancia + (Importancia − Satisfacción)
Elementos con puntuación > 10 = oportunidad fuerte

Aplique [framework elegido] a mi trabajo pendiente y genere una lista priorizada con justificación.
```

### Diseño de formato de hoja de ruta

```
Diseñe un formato de hoja de ruta para [audiencia y horizonte temporal].

Audiencia: [ingeniería interna / equipo de ventas / clientes / equipo ejecutivo / todos]
Horizonte temporal: [trimestral / anual / 6 meses rodantes]
Nivel de compromiso: [comprometido / direccional / aspiracional]
Herramienta actual: [Linear / Jira / Notion / ProductBoard / hoja de cálculo]

Formatos de hoja de ruta por audiencia:

Hoja de ruta de ingeniería (alta fidelidad, comprometida a corto plazo):
| Tema | Característica | Trimestre | Estado | Propietario | Dependencias |
|---|---|---|---|---|---|
Alta confianza en Q1, direccional para Q2-Q3, marcador de posición para Q4.

Hoja de ruta de ventas (direccional, sin fechas):
Formato "Ahora / Siguiente / Más tarde" — evita comprometerse con fechas específicas con clientes.
Ahora: qué está en desarrollo activo
Siguiente: qué viene después (este trimestre o próximo — no fecha específica)
Más tarde: qué estamos considerando (sin compromiso)

Hoja de ruta ejecutiva (enfocada en resultados, no listas de características):
Mostrar OKRs → iniciativas → resultados esperados
No: "Construir característica X"
Sí: "Reducir tiempo de activación en 40% → rediseño de incorporación + secuencia de correo electrónico"

Hoja de ruta orientada al cliente:
Solo temas, sin fechas ("próximamente" / "planeado" / "explorando")
Nunca incluir fechas a menos que la característica esté a semanas
Seguridad: no se comprometa públicamente con características que podrían ser cortadas

Diseñe el formato de hoja de ruta para mi audiencia específica y genere una plantilla.
```

### Alineación de OKR

```
Alinear elementos de hoja de ruta con OKRs.

OKRs de empresa para [trimestre/año]: [lista — objetivo + resultados clave]
OKRs de producto (si es aparte): [lista]
Elementos de hoja de ruta actualmente planeados: [lista de características o iniciativas]

Verificación de alineación:

Para cada elemento de hoja de ruta:
- ¿A qué OKR contribuye? (debe vincularse a al menos uno)
- ¿Qué resultado clave mueve? (sea específico)
- ¿Cuán seguro está de que moverá ese KR? (alto / medio / bajo)
- Elementos sin enlace de OKR: cortar o deprioritizar a menos que haya una excepción convincente

Para cada OKR:
- ¿Qué elementos de hoja de ruta contribuyen? (debe ser 1-3 elementos por KR)
- ¿Existe un KR sin cobertura de hoja de ruta? (brecha — necesidad de agregar iniciativas)
- ¿Existe un KR sobre-cubierto? (demasiados elementos persiguiendo el mismo resultado — enfoque)

Salida: 
- Tabla de mapeo hoja de ruta a OKR
- Brechas (OKRs sin cobertura)
- Sobre-inversiones (demasiados elementos en un OKR)
- Recomendaciones para cortes o adiciones

Alinee mi hoja de ruta con los OKRs que he proporcionado.
```

### Proceso de planificación trimestral

```
Ejecute un proceso de planificación trimestral para [equipo de productos].

Tamaño del equipo: [X ingenieros + X PMs + X diseñadores]
Horizonte de planificación: [T3 2026 — julio a septiembre]
OKRs actuales: [pegar]
Capacidad: [X semanas de ingeniería disponibles después de guardia, deuda técnica, errores]

Calendario de planificación trimestral (proceso de 4 semanas):

Semana 1 — Recopilación de insumos:
□ Compilar: comentarios de clientes, entradas de soporte, verbatims de NPS, razones de ventas ganadas/perdidas
□ Ejecutar: revisión de datos (¿qué métricas son saludables / insalubres?)
□ Recopilar: solicitudes de partes interesadas (de ventas, SC, marketing)
□ Identificar: deuda técnica que está ralentizando activamente al equipo

Semana 2 — Dimensionamiento de oportunidades:
□ Agrupar insumos en temas (aún no características — problemas)
□ Puntuar cada tema: impacto del usuario × frecuencia × ajuste estratégico
□ Identificar las 3-5 mejores oportunidades para el trimestre

Semana 3 — Alcance y secuenciación:
□ Para cada oportunidad: tamaño aproximado de camiseta (P/M/G/MG)
□ Ajuste de capacidad: X semanas de ingeniería totales
□ Secuencia: ¿qué debe venir primero (dependencias, riesgo)?
□ Negociar: cortar hasta que se cumpla la capacidad + 20% de amortiguación

Semana 4 — Alineación y comunicación:
□ Revisión de ingeniería: verificación de viabilidad técnica
□ Aprobación ejecutiva: alineación de OKR confirmada
□ Presentación de ventas/SC: qué viene, qué no
□ Publicar: hoja de ruta interna actualizada
□ Lanzamiento del equipo: planificación del T3 completada

Resultado: plantilla de plan trimestral completada con elementos, propietarios y asignación de capacidad.
```

## Ejemplo

**Usuario:** Tenemos 8 ingenieros, 2 PMs, los OKRs de T3 se enfocan en tasa de activación (+30%) y NPS (+10 puntos). El trabajo pendiente tiene 23 elementos. Ayúdeme a priorizar.

**Proceso de Claude:**

Primero — filtre sin piedad antes de puntuar.

**Filtro 1 — Relevancia de OKR:**
De sus 23 elementos, separe en:
- Impacto de activación: [elementos que afectan el tiempo-a-valor, incorporación, participación de la primera semana]
- Impacto de NPS: [elementos que los clientes han solicitado explícitamente o de los que se han quejado]
- Ninguno de los dos: [elementos que son técnicamente interesantes pero no mueven estos dos KRs]

La pila de "ninguno de los dos" debe cortarse o trasladarse al T4 antes de puntuarse.

**Filtro 2 — Verificación de realidad del esfuerzo:**
Con 8 ingenieros durante 13 semanas = ~104 semanas de ingeniería. Reserve 20% para errores/incidentes = ~83 semanas disponibles.
Elementos MG (>8 semanas cada uno) = solo puede hacer 2-3 por trimestre. Corte el resto o reduzca el alcance.

**Puntuación RICE de la lista corta (ejemplo):**

| Elemento | Alcance | Impacto | Confianza | Esfuerzo | RICE | OKR |
|---|---|---|---|---|---|---|
| Rediseño de lista de verificación de incorporación | 400 | 3 | 85% | 3w | 340 | Activación |
| Mejora de secuencia de correo electrónico | 800 | 2 | 70% | 2w | 560 | Activación |
| Encuesta NPS en la aplicación | 1000 | 1 | 90% | 1w | 900 | NPS |
| Característica de exportación masiva | 200 | 2 | 60% | 6w | 40 | Ninguno de los dos |

**Recomendación:**
Encuesta NPS en la aplicación (1w, RICE alto) primero — victoria rápida, permite medición de su OKR de NPS.
Secuencia de correo electrónico (2w) segunda — ROI de activación más alto por semana.
Rediseño de incorporación (3w) tercera — mejora de activación más estratégica.
Exportación masiva — empujar al T4 a menos que las ventas estén perdiendo acuerdos por esto.

---
