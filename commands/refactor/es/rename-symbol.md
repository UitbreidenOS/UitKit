---
description: Renombrar un símbolo consistentemente en todos los archivos en el alcance
argument-hint: "[old-name] [new-name] [file or directory]"
---
Renombra el símbolo especificado en $ARGUMENTS — formato: `<old-name> <new-name> <path>`.

1. Analiza los argumentos: nombre anterior, nombre nuevo y el archivo o directorio en el que operar.

2. Antes de renombrar, valida:
   - El nombre nuevo sigue la convención de nombres utilizada para ese tipo de símbolo en este repositorio (camelCase, snake_case, PascalCase, SCREAMING_SNAKE, etc.)
   - El nombre nuevo no existe ya en el mismo alcance
   - El nombre nuevo no es una palabra clave reservada ni un nombre utilizado por una dependencia importada

3. Encuentra cada referencia al nombre anterior dentro del alcance especificado:
   - Declaración (definición de función, clase, variable, alias de tipo, constante, miembro de enumeración)
   - Todos los sitios de llamada y puntos de uso
   - Sentencias de importación/exportación (importaciones nombradas, re-exportaciones)
   - Literales de cadena que se sabe que se refieren al símbolo (por ejemplo, nombres de eventos, `require()` dinámico, acceso a cadena `keyof`) — señala pero no renombres automáticamente, ya que pueden ser contratos de API
   - Referencias en JSDoc / docstrings
   - Comentarios que nombran el símbolo — actualiza si el cambio de nombre hace que el comentario sea incorrecto

4. Aplica el cambio de nombre en cada ubicación identificada. No renombres:
   - Coincidencias parciales (por ejemplo, renombrar `user` no debe afectar `username` o `currentUser`)
   - Símbolos no relacionados que casualmente comparten el nombre en un alcance diferente
   - Archivos externos fuera de la ruta especificada a menos que el símbolo se exporte y esos archivos estén dentro del repositorio

5. Después de renombrar, verifica que todas las rutas de importación y las re-exportaciones de módulos sean internamente consistentes.

6. Salida: cantidad total de referencias actualizadas, lista de archivos modificados y cualquier ubicación señalada para revisión manual (literales de cadena, acceso dinámico).
