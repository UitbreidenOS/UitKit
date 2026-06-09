---
description: Generar una actualización de standup a partir de actividad git reciente o notas libres
argument-hint: "[context or notes]"
---
Generar una actualización de standup concisa basada en: $ARGUMENTS

Si $ARGUMENTS está vacío, inspeccionar el registro de git de las últimas 24 horas (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) y derivar ayer/hoy a partir de los commits. Si el repositorio tiene cambios preparados o sin preparar, notar qué está en progreso.

Estructurar la salida como tres secciones simples — sin encabezados, sin viñetas a menos que sea natural:

Yesterday: qué se completó o se avanzó significativamente.
Today: qué está planeado o en progreso activo.
Blockers: cualquier cosa que bloquee el progreso. Si no hay ninguna, omitir esta línea completamente.

Rules:
- Mantener cada sección a máximo 1–3 oraciones.
- Escribir en primera persona, tiempo pasado/presente.
- Eliminar detalles de implementación — escribir al nivel de tarea/característica, no nombres de funciones.
- No mencionar rutas de archivo, números de línea o SHAs de commits.
- No agregar amabilidades, despedidas o frases relleno como "Espero que todos estén bien."
- Si $ARGUMENTS contiene notas explícitas, preferirlas sobre el historial de git.
- Si el historial de git es ambiguo (commits de fusión, solo tareas), hacer una pregunta aclaratoria antes de generar.

Salida solo el texto del standup. Sin preámbulo, sin envoltura "Aquí está tu standup:".
