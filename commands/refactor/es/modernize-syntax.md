---
description: Actualizar código a las expresiones idiomáticas actuales sin cambiar el comportamiento
argument-hint: "[file or directory]"
---
Moderniza la sintaxis y las expresiones idiomáticas en $ARGUMENTS a los estándares actuales del lenguaje.

1. Lee los archivos e identifica el lenguaje y su versión estable actual en uso (verifica package.json, go.mod, Cargo.toml, pyproject.toml, o similar).

2. Aplica solo cambios que sean:
   - Compatibles con la versión del lenguaje ya en uso (no actualices la versión del lenguaje)
   - Reescrituras de sintaxis pura — semántica idéntica, forma más nueva
   - Consistentes con los patrones ya presentes en el archivo

3. Objetivos de modernización comunes por lenguaje:

   JavaScript / TypeScript:
   - `var` → `const`/`let` con mutabilidad correcta
   - `.then()/.catch()` cadenas → `async/await`
   - `arguments` → parámetros rest
   - Dispersión manual de objetos → `{ ...obj }`
   - `Array.prototype.forEach` para efectos secundarios está bien; `.map`/`.filter`/`.reduce` donde se necesita un valor
   - Exportaciones nombradas sobre exportaciones predeterminadas donde el código base ya las usa

   Python:
   - Cadenas de estilo antiguo `%` y `.format()` → f-strings (Python 3.6+)
   - `open()` sin gestor de contexto → `with open()`
   - Bucles de construcción manual de listas → comprensiones de lista/diccionario/conjunto donde sea legible
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → built-in `list/dict/tuple` (Python 3.9+)

   Go:
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Bucles manuales de segmentos donde `range` es más limpio
   - Valores de retorno nombrados solo cuando aclaran, no como predeterminado

   Rust:
   - `unwrap()` en código que no sea de prueba → propagación de errores adecuada con `?`
   - `match` sobre cadenas `if let` cuando se coinciden múltiples brazos
   - Llamadas redundantes `.clone()` donde un préstamo es suficiente

4. No modernices:
   - Código que tiene un comentario explicando por qué la forma anterior es intencional
   - Patrones que requieren una actualización de versión de lenguaje
   - Preferencias de estilo (por ejemplo, pestañas vs. espacios) — eso corresponde al formateador

5. Aplica todos los cambios. Salida: lista de patrones reemplazados y conteos de líneas.
