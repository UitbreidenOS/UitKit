---
name: pm-sprint-review
description: "Revisión de sprint: velocidad, entregado vs. planificado, bloqueos, aprendizajes, prioridades del próximo sprint"
---

# Habilidad de Revisión de Sprint de PM

## Cuándo activar
- Ejecutar la revisión y retrospectiva al final del sprint
- Preparar el deck de revisión de sprint o el resumen asíncrono para las partes interesadas
- Calcular la velocidad y comparar el alcance entregado vs. planificado
- Extraer bloqueos y causas raíz de un sprint que salió mal
- Establecer prioridades para el próximo sprint basándose en lo aprendido
- Redactar el resumen del sprint para la dirección o actualizaciones para inversores

## Cuándo NO usar
- Refinamiento del backlog — usa `/user-story-writer` para la creación de historias
- Planificación trimestral del roadmap — usa `/product-roadmap`
- Investigación de usuarios post-lanzamiento — usa `/product-analytics` o `/ux-researcher`
- Triaje de bugs — esta es una herramienta de ritmo, no un marco de depuración

## Instrucciones

### Prompt principal de revisión de sprint

```
Ejecuta una revisión de sprint para [NOMBRE DEL EQUIPO] — Sprint [N], [FECHAS].

Objetivo del sprint: [cuál era el objetivo declarado para este sprint]
Duración del sprint: [1 / 2 semanas]
Equipo: [N ingenieros, N diseñadores, N QA]
Contexto de velocidad: velocidad promedio de los últimos 3 sprints: [N puntos de historia]

Datos del sprint (pega tu lista de tickets o resumen):
Tickets planificados: [lista con puntos de historia y estado: hecho / parcial / no iniciado / bloqueado]
Trabajo no planificado añadido a mitad del sprint: [lista]
Total de puntos planificados: [X] | Total entregado: [X] | Velocidad en este sprint: [X]

Produce:

## 1. Resultado del objetivo del sprint
¿Alcanzamos el objetivo del sprint? [Sí / Parcial / No]
Veredicto en una oración: qué se logró en español llano.

## 2. Entregado vs. planificado (tabla)
| Funcionalidad / Historia | Puntos | Estado | Notas |
|---|---|---|---|
| [ticket] | [X] | Hecho / Parcial / Deslizado | [cualquier nota] |

## 3. Qué se deslizó y por qué
Para cada elemento sin terminar: ¿por qué? (subestimado / bloqueado / expansión del alcance / repriorizado a mitad del sprint)
Patrón de causa raíz: ¿hay un tema único? (p. ej., "3 de 4 deslizamientos estaban bloqueados por cambios en la API externa")

## 4. Análisis del trabajo no planificado
¿Cuánto trabajo no planificado se añadió? ¿Estaba justificado?
Regla: trabajo no planificado > 20% de la capacidad del sprint indica un problema de planificación o comunicación.

## 5. Tendencia de velocidad
Tendencia de velocidad en 3 sprints: [Sprint N-2: X] [Sprint N-1: X] [Sprint N: X]
¿La velocidad está mejorando, estable o cayendo? ¿Qué la impulsa?

## 6. Aspectos destacados de la retrospectiva
Qué salió bien (top 2): específico, no genérico
Qué no funcionó (top 2 con causa raíz): honesto, con responsable
Una acción para el próximo sprint: un único cambio de proceso concreto

## 7. Prioridades del próximo sprint
Basándose en lo que se deslizó y lo que sigue en la cola — top 5 elementos recomendados para el próximo sprint.
```

### Análisis de velocidad

```
Analiza la velocidad de [EQUIPO] durante los últimos [N] sprints.

Datos de sprint:
Sprint 1: planificado [X] pts, entregado [X] pts, objetivo del sprint: [cumplido/no cumplido]
Sprint 2: planificado [X] pts, entregado [X] pts, objetivo del sprint: [cumplido/no cumplido]
Sprint 3: planificado [X] pts, entregado [X] pts, objetivo del sprint: [cumplido/no cumplido]
[...]

Diagnostica:
1. Velocidad promedio: [X pts]
2. Predictibilidad: ¿cuál es la desviación estándar? Alta desviación = problema de planificación
3. Patrón: ¿está el equipo sobrecomprometiéndose consistentemente? ¿Entregando por debajo en tipos específicos de trabajo?
4. Tasa de cumplimiento del objetivo del sprint: [X / N sprints] — si está por debajo del 70%, el proceso de planificación necesita corrección
5. Capacidad recomendada para el próximo sprint basada en el promedio de los 3 últimos sprints (no el mejor optimista)

Regla: usa el 80% de la velocidad promedio de los últimos sprints como capacidad realista para el próximo sprint. Deja el 20% para trabajo no planificado, bugs y reuniones.

Recomendación: ¿deberíamos ajustar la duración del sprint, el tamaño del equipo o el proceso de planificación?
```

### Facilitación de retrospectiva

```
Facilita una retrospectiva de sprint para el Sprint [N].

Formato: [síncrono / asíncrono]
Equipo: [N personas, roles]
Resultado del sprint: [objetivo cumplido / parcial / no cumplido]
Temas candentes conocidos: [cualquier tensión o problemas recurrentes que abordar]

Estructura de la retrospectiva:

1. QUÉ SALIÓ BIEN (10 min)
Pregunta: "¿Qué harías igual en el próximo sprint sin dudarlo?"
Buena señal: especificidad. Si la gente dice "la comunicación fue buena", pregunta "dame un ejemplo concreto donde fue específicamente buena."
Captura: los 2-3 temas principales con ejemplos.

2. QUÉ NO FUNCIONÓ (10 min)
Pregunta: "¿Qué nos ralentizó, te frustró, o cambiarías si pudieras rehacer el sprint?"
Reglas:
- No culpar a individuos — culpar a procesos y sistemas
- "El proceso de hacer X era lento", no "Jane era lenta en X"
- Cada problema tiene una gravedad: sería-bueno-arreglarlo vs. esto-está-causando-daño-real

3. ANÁLISIS DE CAUSA RAÍZ (10 min)
Para los 2 principales puntos de "qué no funcionó": aplicar los 5 porqués
Ejemplo:
Problema: "3 tickets se deslizaron porque estábamos bloqueados en la API del backend"
¿Por qué? → La API no estaba lista cuando el frontend la necesitaba
¿Por qué? → El alcance de la API no se acordó antes de iniciar el sprint
¿Por qué? → El descubrimiento ocurría en paralelo con la implementación
¿Por qué? → No tenemos una "definición de listo" para el trabajo dependiente del frontend
Causa raíz: empezamos el trabajo de frontend antes de que el contrato del backend esté finalizado
Corrección: añadir "contrato de API aprobado" como parte de la definición de listo para todos los tickets de frontend

4. ELEMENTOS DE ACCIÓN (10 min)
Regla: máximo 2 elementos de acción por retro. Más de 2 y ninguno se hace.
Formato: [QUÉ] lo hará [QUIÉN] antes del [FECHA]
Ejemplo: "Jordan redactará una lista de verificación de definición de listo y la compartirá en Slack antes del lunes que viene"

Genera la estructura de la retro y facilita cada sección con los datos que proporcione.
```

### Resumen del sprint para partes interesadas

```
Escribe el email/documento de resumen del sprint para [AUDIENCIA].

Audiencia: [dirección / inversores / otros equipos / toda la empresa]
Sprint: [N] | Fechas: [inicio-fin]
Objetivo del sprint: [indícalo]

Reglas de tono:
- Dirección / inversores: máximo 3 párrafos, encabezar con el resultado, respaldado por datos, sin jerga
- Toda la empresa: celebrar los logros con nombres, explicar los deslizamientos sin culpa, establecer expectativas
- Otros equipos: qué se entregó que les afecta, qué viene a continuación, cualquier petición

Plantilla para resumen de dirección:

El Sprint [N] entregó [X puntos de historia] de [Y planificados], [cumplió / cumplió parcialmente / no cumplió] el objetivo del sprint de "[objetivo]".

Entregables clave completados: [2-4 viñetas — nombres específicos de funcionalidades, no descripciones genéricas]
[Funcionalidad]: [qué hace, qué clientes lo pidieron o qué desbloquea]
[Funcionalidad]: [...]

Lo que se deslizó: [1-2 oraciones — qué y por qué, sin maquillaje]

Prioridad del próximo sprint: [lo más importante que se entregará en el Sprint N+1 y por qué importa]

Genera el resumen para mi audiencia con los datos de mi sprint.
```

### Prompt de planificación del sprint (entrada para el próximo sprint)

```
Planifica el Sprint [N+1] basándote en la revisión de este sprint.

Capacidad:
- Equipo: [N ingenieros, N diseñadores]
- Días de sprint: [10 / 5 días laborables]
- Vacaciones o PTO: [lista cualquier ausencia]
- Capacidad esperada: [N% de lo normal — p. ej., 80% por 2 días de PTO]

Elementos del backlog a considerar:
[Pega los 10-15 principales candidatos con estimaciones de puntos de historia]

Restricciones:
- Deslizados del Sprint N (deben seguir adelante): [lista]
- Entregables comprometidos (dependencias externas, promesas a clientes): [lista]
- Deseables (se pueden eliminar si la capacidad es ajustada): [lista]

Candidatos al objetivo del sprint:
Opción A: [objetivo] — justificación
Opción B: [objetivo] — justificación
Opción C: [objetivo] — justificación

Usando la velocidad de los 3 últimos sprints de [X pts] y la regla del 80% de capacidad, recomienda:
1. El objetivo del sprint (qué opción, y por qué)
2. Exactamente qué elementos comprometer en este sprint
3. Qué dejar en el backlog
4. Riesgo: cualquier elemento en este plan que probablemente se deslice, y por qué
```

## Ejemplo

**Usuario:** Sprint 23, sprint de 2 semanas. Objetivo: "Lanzar exportación CSV para que los usuarios enterprise puedan descargar sus datos." Equipo de 4 ingenieros, 1 diseñador. Planificado 42 pts. Entregado: exportación CSV (hecho, 13 pts), UI de selección masiva (hecho, 8 pts), limitación de velocidad de API (parcial — 5/8 pts entregados), 3 correcciones de bugs (hecho, 7 pts), nuevo flujo de onboarding (no iniciado, 14 pts, razón: diseño no finalizado). Velocidad del Sprint 22: 38. Sprint 21: 40.

**Resultado:**

```markdown
# Revisión del Sprint 23 — Semana Terminando el 6 de junio

## Resultado del Objetivo del Sprint
PARCIAL — Entregamos la funcionalidad principal (exportación CSV) pero el flujo de onboarding no se inició porque el diseño no estaba finalizado antes del inicio del sprint. El objetivo principal para los clientes enterprise se logró.

## Entregado vs. Planificado
| Elemento | Puntos | Estado | Notas |
|---|---|---|---|
| Exportación CSV | 13 | Hecho | Objetivo del sprint cumplido |
| UI de selección masiva | 8 | Hecho | Habilita la UX de exportación CSV |
| Limitación de velocidad de API | 8 | Parcial (5 entregados) | Manejo de casos extremos aún pendiente |
| Correcciones de bugs (3) | 7 | Hecho | |
| Nuevo flujo de onboarding | 14 | No iniciado | Diseño no finalizado al inicio del sprint |
| **Total** | **50** | **33 entregados** | **66% de tasa de finalización** |

## Qué Se Deslizó y Por Qué
Flujo de onboarding (14 pts): el diseño no estaba finalizado antes de la planificación del sprint. Esto no es un problema de ejecución del sprint — es un problema de proceso. El equipo se comprometió con trabajo que no estaba listo.
Causa raíz: no tenemos una "definición de listo" — los tickets entraron en la planificación del sprint sin aprobación del diseño.

Limitación de velocidad de API (3 pts restantes): casos extremos subestimados. No es un problema sistémico.

## Trabajo No Planificado
Nada añadido a mitad del sprint. Buena disciplina en este sprint.

## Tendencia de Velocidad
Sprint 21: 40 pts | Sprint 22: 38 pts | Sprint 23: 33 pts
La velocidad está cayendo. Los 14 pts de trabajo no iniciado enmascaran un problema real de capacidad —
el equipo no está obteniendo la preparación del diseño por debajo de la línea antes de comprometerse.

## Aspectos Destacados de la Retrospectiva
Salió bien:
1. La exportación CSV se entregó a tiempo, sin retrabajo — buena definición inicial de alcance por el líder de ingeniería.
2. El lote de corrección de bugs fue eficaz — 3 bugs cerrados en una sesión enfocada.

No funcionó:
1. Flujo de onboarding comprometido sin preparación del diseño. Desperdició la discusión de planificación del sprint.
   Acción: Sarah redactará una lista de verificación de "definición de listo" y la añadirá a nuestra plantilla de sprint antes del próximo lunes.

2. La limitación de velocidad de API fue subestimada. Estimamos incorrectamente la complejidad del backend.
   Acción: Las estimaciones de backend incluirán un búfer de +2 pts para casos extremos a partir de ahora.

## Prioridades del Próximo Sprint
1. Flujo de onboarding (14 pts) — comprometer solo una vez que el diseño esté aprobado (definición de listo)
2. Casos extremos restantes de limitación de velocidad de API (3 pts) — continuar, pequeño
3. [Siguientes elementos del backlog según las prioridades del roadmap]

Capacidad recomendada para el Sprint 24: 37 pts (80% del promedio de 3 sprints de 39 pts)
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
