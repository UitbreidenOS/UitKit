---
description: Incorporar una función, variable o constante que añade indirección sin valor
argument-hint: "[symbol-name] [file]"
---
Incorporar el símbolo especificado en $ARGUMENTS — formato: `<symbol-name> <file>`.

1. Lee el archivo. Localiza la declaración del símbolo nombrado y cada sitio de llamada o uso.

2. Determina si la incorporación es apropiada. La incorporación es apropiada cuando:
   - El símbolo se llama en solo uno o dos lugares
   - El cuerpo del símbolo es más simple o claro que lo que implica su nombre (el nombre no añade información)
   - El símbolo es un envoltorio de una sola expresión sin valor de reutilización
   - Una variable o constante se asigna una vez y se usa una vez, y el nombre intermedio no ayuda a la legibilidad

   NO incorpores cuando:
   - El símbolo se usa en 3+ lugares (la incorporación reintroduciría duplicación)
   - El nombre es genuinamente informativo y su eliminación oscurecería la intención
   - El símbolo tiene efectos secundarios que se ejecutan en el momento de la declaración (la incorporación podría cambiar el orden de ejecución)
   - El símbolo se exporta o es parte de una API pública

3. Para cada sitio de llamada:
   - Sustituye el cuerpo del símbolo directamente, con cualquier vinculación de parámetros sustituida correctamente
   - Si el cuerpo hace referencia a variables de su ámbito original que no están disponibles en el sitio de llamada, detente e informa — la incorporación no es segura
   - Asegúrate de que la precedencia de operadores sea correcta después de la sustitución (añade paréntesis si es necesario)

4. Después de incorporar todos los sitios, elimina la declaración original.

5. Elimina las importaciones que existían únicamente para apoyar el símbolo que ya no existe.

6. Verifica que el resultado sea sintáctica y semánticamente correcto:
   - Sin referencias colgantes
   - Sin cambio en el orden de evaluación para expresiones con efectos secundarios
   - Los tipos aún se verifican si el lenguaje es tipado

7. Salida: nombre del símbolo, número de sitios incorporados, ubicación de la declaración original, y confirmación de que fue eliminada.
