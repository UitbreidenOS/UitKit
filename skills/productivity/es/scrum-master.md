---
name: scrum-master
description: "Facilitación Scrum: ceremonias de sprint, formatos retrospectivos, eliminación de bloqueadores, coaching de velocidad, escalado de scrum en múltiples equipos — patrones prácticos de Scrum Master"
---

# Habilidad Scrum Master

## Cuándo activar
- Facilitar ceremonias de sprint (planificación, standup, revisión, retro)
- Ejecutar retrospectivas que expongan problemas reales (no solo "qué salió bien")
- Ayudar a un equipo que lucha con velocidad, alcance o compromiso
- Escalar de un equipo a múltiples equipos (Scrum of Scrums, bases SAFe)
- Entrenar a un nuevo equipo en prácticas Scrum
- Escribir agendas para ceremonias de sprint

## Cuándo NO usar
- Configuración Jira — usar la habilidad jira-expert
- Decisiones de hoja de ruta de productos — ese es el dominio del PM
- Decisiones técnicas de ingeniería — no es preocupación de Scrum Master
- Reemplazar un Scrum Master real para equipos en conflicto — se necesita facilitación humana

## Instrucciones

### Retrospectiva de sprint

```
Diseñar una retrospectiva para [contexto de equipo].

Tamaño del equipo: [X personas]
Duración del sprint: [2 semanas]
Salud del equipo: [saludable / algo de tensión / luchando]
Última retro: [qué formato / qué salió de ella]
Evento sobresaliente de este sprint: [incidente / presión de entrega / cambio de equipo / ninguno]

Elija un formato retrospectivo basado en el contexto:

1. Comenzar / Detener / Continuar (predeterminado, contextos de equipo completo):
   - Comenzar: ¿qué debería comenzar?
   - Detener: ¿qué deberíamos dejar de hacer?
   - Continuar: ¿qué funciona que deberíamos proteger?
   Duración: 60 min para un sprint de 2 semanas

2. 4Ls (después de un sprint difícil):
   - Gusto: ¿qué disfrutaste?
   - Aprendido: ¿qué descubriste?
   - Faltó: ¿qué faltaba?
   - Deseado: ¿qué hubieras querido que fuera diferente?

3. Velero (para equipos que se sienten sin dirección):
   - Viento (que nos impulsa): ¿qué nos ayuda a avanzar?
   - Anclas (que nos ralentizan): ¿qué nos retiene?
   - Rocas (riesgos venideros): ¿qué podría hundirse?
   - Sol (destino): ¿hacia dónde estamos navegando?

4. Línea de tiempo (después de incidentes o entregas mayores):
   - Mapear el sprint en una línea de tiempo
   - Marcar puntos altos y bajos como equipo
   - Discutir qué causó cada pico y valle
   - Identificar patrones

Guía de facilitación para [formato elegido]:
1. Establecer el escenario (5 min): encuadre de seguridad psicológica
2. Recopilar datos (15 min): notas adhesivas silenciosas en el tablero
3. Perspectivas (20 min): agrupar notas en temas, discutir
4. Decidir qué hacer (15 min): votar sobre los 2-3 mejores elementos de acción
5. Cerrar (5 min): confirmar propietarios y fechas límite para cada acción

Regla: ninguna retro termina sin un propietario nombrado y una fecha límite para cada elemento de acción. "El equipo..." = nadie lo hará.

Generar la agenda completa para mi contexto específico.
```

### Facilitación de Standup

```
Mejorar nuestro standup diario.

Standup actual: [describir — cuánto tiempo, formato, problemas]
Tamaño del equipo: [X personas]
Remoto / presencial / híbrido: [especificar]
Problemas comunes: [dura demasiado / las personas no están presentes / sin bloqueadores compartidos / reporte de estado en lugar de sincronización]

Formatos de Standup:

3 preguntas clásicas (por persona):
1. ¿Qué hice ayer?
2. ¿Qué hago hoy?
3. ¿Hay bloqueadores?
Problema: se convierte en un reporte de estado — las personas hablan AL Scrum Master, no entre sí.

Recorrer el tablero (mejor para enfoque en progreso):
- Mire cada elemento "En Progreso", no cada persona
- "¿Quién está trabajando en esto? ¿Hay bloqueadores?"
- Se enfoca en terminar, no en comenzar
- Mejor para equipos adyacentes a Kanban

Modelo de dos preguntas (más ligero):
1. ¿En qué estoy trabajando?
2. ¿Necesito ayuda?
Sin "ayer" = reduce el standup a < 10 minutos con < 10 personas

Consejos para standup remoto:
- Usar un tablero compartido (Jira, Linear) en pantalla — previene reportes de estado abstractos
- Comenzar a tiempo, terminar a tiempo — los llegada tarde se unen sin recapitulación
- Los bloqueadores van en Slack async; el standup es para coordinación, no solución

Anti-patrones de standup comunes para reparar:
- "Sin bloqueadores" cada día → los bloqueadores existen; las personas no se sienten cómodas compartiendo
  Reparación: pregunta "¿qué te haría ir más rápido?" en su lugar
- Una persona habla 5+ minutos → usa un cronómetro (2 min/persona)
- Nadie mueve sus tickets después → los bloqueadores o tickets están mal

Rediseñe mi standup para el contexto de mi equipo.
```

### Coaching de velocidad

```
Ayudar a mejorar la velocidad del equipo.

Velocidad actual: [X puntos de historia / promedio de sprint últimos 3 sprints]
Duración del sprint: [2 semanas]
Tamaño del equipo: [X ingenieros]
Problemas conocidos: [scope creep / estimaciones irrealistas / interrupciones / deuda técnica / historias poco claras]

Marco de diagnóstico de velocidad:

Paso 1 — Distinción de tipos de problemas de velocidad:
a) Problema de compromiso: el equipo se compromete a X, entrega Y < X → la planificación está rota
b) Problema de estimación: el equipo entrega X pero las historias se re-estiman constantemente más altas a mitad del sprint
c) Problema de interrupción: trabajo no planificado (errores, incidentes, solicitudes de slack) consumiendo capacidad
d) Problema de entrega: las historias permanecen "En Progreso" durante la mayor parte del sprint

Paso 2 — Medir el problema real:
- Tasa de interrupción: rastrear trabajo no planificado añadido a mitad del sprint durante 3 sprints. Si > 20% del trabajo comprometido, ese es el problema — no estimación.
- Tiempo de ciclo: si las historias toman en promedio > 5 días, el límite WIP es demasiado alto
- Tasa de compromiso: comprometido / entregado en últimos 3 sprints

Paso 3 — Intervenciones por tipo de problema:
a) Compromiso: ejecute la planificación del sprint con el equipo, no para ellos. Deje de comprometerse a historias sin refinar.
b) Estimación: ejecute una sesión de calibración de puntos (compare estimaciones pasadas con las reales)
c) Interrupciones: presupuesto para interrupciones (reserve 20% de velocidad para trabajo no planificado)
d) Tiempo de ciclo: imponga un límite WIP de máximo 2 historias por ingeniero

Paso 4 — No optimice la velocidad directamente:
La velocidad es una herramienta de planificación, no una métrica de rendimiento. Un equipo que hace 40 puntos de trabajo significativo es mejor que uno que hace 60 puntos de trabajo de bajo valor.

Diagnosticar el problema de velocidad de mi equipo y recomendar el cambio de mayor apalancamiento.
```

### Calendario de ceremonias Scrum

```
Diseñar el calendario de ceremonias de sprint para [equipo].

Equipo: [X personas — ingenieros, PM, diseñador, QA]
Duración del sprint: [2 semanas]
Zona horaria: [todas iguales / distribuidas]
Superposición de horas de trabajo: [X horas/día de superposición]

Calendario de ceremonia de sprint de dos semanas:

Lunes, Inicio de Sprint:
- 10:00 — Planificación del Sprint (2 horas)
  Quién: Equipo completo
  Objetivo: Backlog del sprint acordado, objetivo del sprint establecido

Diariamente de lunes a viernes:
- 09:30 — Standup Diario (máximo 15 min)
  Quién: Equipo completo
  Formato: Recorrer el tablero

Viernes de la Semana 1:
- 15:00 — Refinamiento del Backlog (1 hora)
  Quién: PM + 2-3 ingenieros (rotativo)
  Objetivo: Top 10 elementos del backlog estimados y clarificados

Jueves de la Semana 2 (día antes de que termine el sprint):
- 14:00 — Revisión del Sprint (1 hora)
  Quién: Equipo completo + partes interesadas
  Objetivo: Demostrar trabajo completado, recopilar retroalimentación
- 15:30 — Retrospectiva (1 hora)
  Quién: Solo equipo (sin partes interesadas)
  Objetivo: 2-3 mejoras accionables para el siguiente sprint

Viernes de la Semana 2 (Fin del Sprint):
- El equipo completa el trabajo restante
- PM cierra el sprint en Jira, prepara el gráfico de velocidad

Diseñar el calendario para el tamaño de mi equipo, zona horaria y estilo de trabajo.
```

## Ejemplo

**Usuario:** Nuestras retrospectivas siempre terminan con los mismos 3 elementos de acción ("escribir mejores tickets", "comunicarse más", "reducir scope creep") y nada nunca cambia. ¿Cómo lo reparo?

**Diagnóstico de Claude:**

Estos 3 elementos de acción son lugares comunes de proceso — nombran síntomas sin abordar causas, y no tienen propietario. Por eso nada cambia. La retro hace la ceremonia correcta, pero la cosa equivocada.

**Causa raíz de "escribir mejores tickets":**
Esto significa: los tickets que entran en el sprint están subespecificados, causando rework o implementación incorrecta.
Pregunta real a hacer: "¿Qué ticket en los últimos 3 sprints causó la mayor cantidad de rework? ¿Por qué fue poco claro? ¿Quién lo escribió? ¿Qué faltaba?"
Acción específica: "Antes de la próxima planificación del sprint, el PM revisa todos los tickets con el ingeniero que los poseerá — toma 30 min cada jueves."

**Causa raíz de "comunicarse más":**
Esto es generalmente un síntoma de propiedad poco clara, no una falla de comunicación.
Pregunta real a hacer: "En el último sprint, ¿cuándo no sabías qué hacer a continuación y tuviste que preguntarle a alguien? ¿Por qué no se te dijo antes?"
Acción específica: "Agrega un campo 'dependencias' a cada historia > 3 puntos — ¿quién más necesita estar involucrado?"

**Causa raíz de "reducir scope creep":**
Esto significa: los elementos se agregan a mitad del sprint sin quitar otros.
Pregunta real a hacer: "¿Quién aprobó las adiciones a mitad del sprint en los últimos 3 sprints? ¿Fue urgente o evitable?"
Acción específica: "Nuevo elemento agregado a mitad del sprint requiere aprobación explícita de PM + tech lead Y remoción de puntos equivalentes."

**Cambio de formato retro:**
Deja de usar Comenzar/Detener/Continuar. Cambia a una retro de Línea de tiempo — recorre el último sprint día a día. Esto fuerza ejemplos específicos en lugar de quejas genéricas, y ejemplos específicos tienen causas específicas.

---
