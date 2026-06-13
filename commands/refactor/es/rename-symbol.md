---
description: Renombrar un símbolo de manera consistente en todos los archivos del alcance
argument-hint: "[nombre-antiguo] [nombre-nuevo] [archivo o directorio]"
---
Renombra el símbolo especificado en $ARGUMENTS — formato: `<nombre-antiguo> <nombre-nuevo> <ruta>`.

1. Analiza los argumentos: nombre antiguo, nombre nuevo y el archivo o directorio sobre el que operar.

2. Antes de renombrar, valida:
   - El nombre nuevo sigue la convención de nombres utilizada para ese tipo de símbolo en esta base de código (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, etc.)
   - El nombre nuevo no existe ya en el mismo alcance
   - El nombre nuevo no es una palabra clave reservada ni un nombre utilizado por una dependencia importada

3. Encuentra cada referencia al nombre antiguo dentro del alcance especificado:
   - Declaración (definición de función, clase, variable, alias de tipo, constante, miembro enum)
   - Todos los sitios de llamada y puntos de uso
   - Sentencias import/export (imports nombrados, re-exports)
   - Literales de cadena que se sabe que hacen referencia al símbolo (p. ej., nombres de eventos, `require()` dinámico, acceso de cadena `keyof`) — señala pero no renombres automáticamente estos, ya que pueden ser contratos de API
   - Referencias en JSDoc / docstring
   - Comentarios que nombran el símbolo — actualiza si el renombramiento hace que el comentario sea incorrecto

4. Aplica el renombramiento en cada ubicación identificada. No renombres:
   - Coincidencias parciales (p. ej., renombrar `user` no debe tocar `username` o `currentUser`)
   - Símbolos no relacionados que sucede que comparten el nombre en un alcance diferente
   - Archivos externos fuera de la ruta especificada a menos que el símbolo sea exportado y esos archivos estén dentro del repositorio

5. Después de renombrar, verifica que todas las rutas de importación y re-exports de módulos sean internamente consistentes.

6. Salida: recuento total de referencias actualizadas, lista de archivos modificados y cualquier ubicación marcada para revisión manual (literales de cadena, acceso dinámico).
