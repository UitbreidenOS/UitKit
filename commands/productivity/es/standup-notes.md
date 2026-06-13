---
description: Genera una actualización de standup a partir de la actividad reciente de git o notas libres
argument-hint: "[contexto o notas]"
---
Genera una actualización de standup concisa basada en: $ARGUMENTS

Si $ARGUMENTS está vacío, inspecciona el git log de las últimas 24 horas (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) y deriva ayer/hoy a partir de los commits. Si el repositorio tiene cambios staged o unstaged, nota qué está en progreso.

Estructura la salida como tres secciones simples — sin encabezados, sin bullets a menos que sean naturales:

Ayer: qué fue completado o avanzó significativamente.
Hoy: qué está planeado o activamente en progreso.
Bloqueadores: cualquier cosa que bloquee el progreso. Si no hay ninguno, omite esta línea completamente.

Reglas:
- Mantén cada sección a un máximo de 1–3 oraciones.
- Escribe en primera persona, tiempo pasado/presente.
- Elimina detalles de implementación — escribe al nivel de tarea/feature, no nombres de funciones.
- No menciones rutas de archivos, números de línea o SHAs de commits.
- No añadas cortesías, despedidas o frases de relleno como "Espero que todos estén bien".
- Si $ARGUMENTS contiene notas explícitas, prefierelas sobre el historial de git.
- Si el historial de git es ambiguo (merge commits, solo chores), haz una pregunta aclaratoria antes de generar.

Genera solo el texto del standup. Sin preámbulo, sin envoltorio "Aquí está tu standup:".
