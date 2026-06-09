---
description: Explica el historial e intención detrás de un archivo o líneas específicas usando git blame y log
argument-hint: "<file> [start-line:end-line]"
---
Analiza $ARGUMENTS:
- El primer token es la ruta del archivo (requerido).
- El segundo token opcional es un rango de líneas en el formato `start:end` (p. ej., `42:67`).

Si no se proporciona un archivo, pide al usuario que lo proporcione y detente.

Ejecuta lo siguiente, sustituyendo los valores analizados:
- `git blame -w -M -C --line-porcelain <file>` (o `-L <start>,<end>` si se proporcionó un rango)
- `git log --follow --oneline -- <file>` para obtener el historial completo de renombrado/movimiento
- Para los 5 commits más citados en la salida de blame: `git show <sha> --stat --format="%H %ae %ad %s%n%b"` para obtener su contexto completo

Produce una explicación organizada como:

**Descripción general del archivo**
Un párrafo: qué hace el archivo, su antigüedad, cuántos autores lo han modificado, y la forma general de su historial (estable vs. frecuentemente cambiado).

**Atribución línea por línea (o bloque por bloque)**
Para cada commit distinto que posea líneas en el rango de blame:
- SHA del commit (corto), autor, fecha
- Líneas que posee (rango o cantidad)
- Qué cambió ese commit y *por qué* (inferir del mensaje del commit y contexto del diff)
- Si el cambio fue parte de una refactorización más grande, una corrección de bug, una característica o una reversión

**Insight clave**
Dos a cuatro oraciones: qué revela el historial sobre la intención de diseño o restricciones detrás del código actual — p. ej., una solución alternativa para un bug conocido, un contrato de API que no puede cambiar, una restricción de rendimiento documentada solo en el historial de commits.

**Líneas riesgosas**
Marca cualquier línea que:
- Haya sido tocada por última vez hace más de 2 años por un autor que ya no aparece en commits recientes
- Haya sido cambiada 4 o más veces (alto churn)
- Haya sido introducida por un mensaje de commit que contenga "hack", "workaround", "tmp", "fixme" o "revert"

No modifiques ningún archivo. No ejecutes `git checkout` ni ninguna operación de escritura.
