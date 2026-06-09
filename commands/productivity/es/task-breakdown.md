---
description: Dividir un objetivo o característica en tareas delimitadas, secuenciadas y con estimaciones de esfuerzo
argument-hint: "[goal or feature description]"
---
Divide lo siguiente en una lista de tareas secuenciadas: $ARGUMENTS

Produce una lista flat y ordenada de tareas. Para cada tarea:

```
[ ] <verb-first task title>
    Size: XS | S | M | L | XL   (XS=<1h, S=1-3h, M=3-8h, L=1-3d, XL=>3d)
    Depends on: <task number(s), or "none">
    Notes: <one line — key assumption, risk, or constraint. Omit if nothing notable.>
```

Después de la lista, añade una sección **Riesgos y Suposiciones** (3-6 viñetas) que cubra:
- Incógnitas que podrían afectar las estimaciones
- Dependencias externas (APIs, otros equipos, infraestructura)
- Límites de alcance — qué se excluye explícitamente

Reglas:
- Las tareas deben ser completables independientemente por una persona en una sesión (se prefiere M o menor).
- Si una tarea sería XL, divídela.
- Ordena las tareas de modo que cada una pueda comenzar una vez que sus dependencias se completen — sin dependencias circulares.
- Usa verbos a nivel de implementación: Write, Add, Refactor, Deploy, Test, Configure — no verbos vagos como "Handle" o "Work on".
- No incluyas tareas para gastos generales de gestión de proyectos (standups, revisiones) a menos que la solicitud lo pida explícitamente.
- Si $ARGUMENTS es demasiado vago para desglosarlo sin adivinar el alcance, haz una pregunta aclaratoria antes de proceder.
- Sin lenguaje de marketing. Sin "ensure seamless experience".

Produce solo la lista de tareas y la sección de riesgos.
