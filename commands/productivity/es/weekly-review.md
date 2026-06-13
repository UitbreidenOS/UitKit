---
description: Producir una revisión semanal desde el historial de git, notas o entrada libre
argument-hint: "[contexto de la semana, notas, o dejar en blanco para git]"
---
Generar una revisión semanal basada en: $ARGUMENTS

Si $ARGUMENTS está vacío o es mínimo, ejecutar `git log --since="7 days ago" --oneline --author=$(git config user.email)` para derivar logros de los commits.

Producir estas secciones:

**Entregado / Completado**  
Lista con viñetas. Cada elemento es un entregable concreto o hito, no una tarea. Agrupar commits relacionados en un solo elemento. No más de 8 viñetas.

**En Progreso**  
Lista con viñetas. Qué está actualmente en desarrollo y se espera que se cierre en las próximas 1–2 semanas. Incluir porcentaje aproximado de finalización si es inferible.

**Bloqueado / En Riesgo**  
Lista con viñetas. Cada elemento: qué está bloqueado, por qué, y quién/qué lo desbloquea. Omitir si nada está bloqueado.

**Aprendizajes**  
2–4 viñetas. Observaciones sobre proceso, herramientas, enfoque o conocimiento del dominio adquirido esta semana. No un resumen de lo que se hizo — solo perspectiva.

**Enfoque de la Próxima Semana**  
3–5 viñetas. Prioridades concretas para la próxima semana, ordenadas por importancia.

Reglas:
- Escribir en primera persona.
- Calibrar el detalle a relación señal-ruido: omitir tareas triviales y actualizaciones de dependencias a menos que fueran problemáticas.
- No incluir estimaciones de tiempo para la próxima semana a menos que la entrada las proporcionara.
- Si el historial de git muestra solo commits automatizados (bots, CI), notarlo y solicitar entrada manual.
- Mantener cada viñeta en una oración a menos que una segunda oración agregue contexto esencial.
- El resultado total debe ser escaneable en menos de 2 minutos.

Salida solo la revisión semanal.
