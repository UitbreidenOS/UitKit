---
description: Generar una revisión semanal basada en historial de git, notas o entrada libre
argument-hint: "[contexto de la semana, notas, o dejar en blanco para git]"
---
Generar una revisión semanal basada en: $ARGUMENTS

Si $ARGUMENTS está vacío o es mínimo, ejecutar `git log --since="7 days ago" --oneline --author=$(git config user.email)` para derivar logros desde los commits.

Generar estas secciones:

**Enviado / Completado**  
Lista con viñetas. Cada elemento es un entregable o hito concreto, no una tarea. Agrupar commits relacionados en un elemento. No más de 8 viñetas.

**En Progreso**  
Lista con viñetas. Lo que está en desarrollo activo y se espera que se cierre en las próximas 1–2 semanas. Incluir porcentaje de finalización aproximado si es inferible.

**Bloqueado / En Riesgo**  
Lista con viñetas. Cada elemento: qué está bloqueado, por qué, y quién/qué lo desbloquea. Omitir si nada está bloqueado.

**Aprendizajes**  
2–4 viñetas. Observaciones sobre proceso, herramientas, enfoque, o conocimiento de dominio adquirido esta semana. No un resumen de lo que se hizo — solo información.

**Enfoque de la Próxima Semana**  
3–5 viñetas. Prioridades concretas para la próxima semana, ordenadas por importancia.

Reglas:
- Escribir en primera persona.
- Calibrar el detalle a relación señal-ruido: omitir tareas triviales y actualizaciones de dependencias a menos que hayan sido problemáticas.
- No incluir estimaciones de tiempo para la próxima semana a menos que la entrada las haya proporcionado.
- Si el historial de git muestra solo commits automatizados (bots, CI), señalar esto y solicitar entrada manual.
- Mantener cada viñeta a una oración a menos que una segunda oración añada contexto esencial.
- El resultado total debe ser escaneable en menos de 2 minutos.

Generar solo la revisión semanal.
