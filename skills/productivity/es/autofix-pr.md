# /autofix-pr — Aplicación Automática de Correcciones de PR

## Cuándo activar
El usuario quiere que Claude aplique automáticamente las sugerencias de revisión de código sin intervención manual; el usuario menciona `/autofix-pr`; el usuario quiere refinamiento de PR sin intervención después de hacer push del código y recibir comentarios del revisor.

## Cuándo NO usar
El usuario quiere revisar cada cambio antes de que se aplique; repos sin integración GitHub; PR con comentarios de revisión arquitectónica compleja que requieren decisiones; situaciones donde cualquier auto-commit a la rama violaría la política del equipo.

## Instrucciones

**Lo que hace :**
`/autofix-pr` habilita la aplicación automática de sugerencias de revisión de PR no destructivas. Claude lee los comentarios de revisión abiertos en el PR actual y aplica correcciones que cumplen con los criterios de aplicación automática sin esperar confirmación manual.

**Lo que Claude aplica automáticamente :**
- Correcciones de formato (indentación, espacios finales, líneas en blanco)
- Correcciones de errores tipográficos en código y comentarios
- Cambios de nombre de variable simple donde el revisor indicó explícitamente el nuevo nombre
- Refactorizaciones obvias con descripción clara e inequívoca ("extraer esto en una función auxiliar llamada X")
- Fixes de reglas de linting (importaciones no utilizadas, puntos y comas faltantes, const versus let)

**Lo que Claude NO aplica automáticamente :**
- Cambios arquitectónicos (mover archivos, reestructurar módulos)
- Reescrituras de lógica o cambios de algoritmo
- Cualquier cosa que requiera criterio sobre compensaciones
- Sugerencias formuladas como preguntas ("tal vez considerar…?")
- Sugerencias ambiguas donde existen múltiples interpretaciones válidas

**Manejo de comentarios ambiguos :**
Claude te muestra el comentario, explica por qué es ambiguo, y pregunta antes de aplicar. Respondes, Claude aplica, pasa al siguiente.

**Requisitos :**
- El repo debe estar conectado a Claude Code (misma sesión que abrió el PR, o sesión en el mismo repo local)
- La integración GitHub debe estar activa
- El PR debe estar abierto y tener comentarios de revisión

**Visibilidad :**
Cada fix aplicado automáticamente aparece como un commit en la cronología de PR con una nota indicando que fue aplicado automáticamente. Los revisores ven exactamente qué cambió y por qué.

**Cambiar :**
- `/autofix-pr` — habilitar para esta sesión
- `/autofix-pr off` — deshabilitar

## Ejemplo

PR tiene 12 comentarios de revisión. 9 son: "usa `const` en lugar de `let`", "añade punto y coma faltante en línea 47", "el nombre de variable debe ser `userId` no `user_id`", "elimina importación no utilizada". Claude aplica automáticamente todos los 9, los commitea como un único commit de limpieza, y destaca los 3 comentarios arquitectónicos restantes para revisión manual: "Los siguientes 3 comentarios requieren tu entrada antes de poder aplicarlos."

---

> **Trabaje con nosotros:** Claudient es respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
