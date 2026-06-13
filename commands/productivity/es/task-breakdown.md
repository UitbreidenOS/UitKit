---
description: Desglosar un objetivo o característica en tareas con alcance, secuencia y estimaciones de esfuerzo
argument-hint: "[descripción del objetivo o característica]"
---
Desglosa lo siguiente en una lista de tareas secuenciadas: $ARGUMENTS

Produce una lista plana y ordenada de tareas. Para cada tarea:

```
[ ] <título de tarea con verbo primero>
    Size: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Depends on: <número(s) de tarea, o "none">
    Notes: <una línea — suposición clave, riesgo o restricción. Omitir si no hay nada notable.>
```

Después de la lista, agrega una sección **Riesgos y Suposiciones** (3–6 puntos) que cubra:
- Incógnitas que podrían invalidar las estimaciones
- Dependencias externas (APIs, otros equipos, infraestructura)
- Límites de alcance — qué explícitamente NO está incluido

Reglas:
- Las tareas deben ser completables independientemente por una persona en una sesión (preferiblemente M o menor).
- Si una tarea sería XL, divídela.
- Ordena las tareas de modo que cada una pueda comenzar una vez completadas sus dependencias — sin dependencias circulares.
- Usa verbos a nivel de implementación: Write, Add, Refactor, Deploy, Test, Configure — no verbos vagos como "Handle" o "Work on".
- No incluyas tareas para gastos generales de gestión de proyectos (standups, reviews) a menos que la solicitud lo pida explícitamente.
- Si $ARGUMENTS es demasiado vago para desglosarlo sin adivinar el alcance, haz una pregunta aclaratoria antes de proceder.
- Sin lenguaje de marketing. No "ensure seamless experience".

Devuelve solo la lista de tareas y la sección de riesgos.
