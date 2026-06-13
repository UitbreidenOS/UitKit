---
description: Integrar una función, variable o constante que añade indirección sin valor
argument-hint: "[nombre-símbolo] [archivo]"
---
Integra el símbolo especificado en $ARGUMENTS — formato: `<nombre-símbolo> <archivo>`.

1. Lee el archivo. Localiza la declaración del símbolo nombrado y cada sitio de llamada o uso.

2. Determina si la integración es apropiada. La integración es apropiada cuando:
   - El símbolo se llama en solo uno o dos lugares
   - El cuerpo del símbolo es más simple o claro que lo que su nombre implica (el nombre no añade información)
   - El símbolo es un envoltorio de una sola expresión sin valor de reutilización
   - Una variable o constante se asigna una vez y se usa una vez, y el nombre intermedio no ayuda a la legibilidad

   NO integres cuando:
   - El símbolo se usa en 3 o más lugares (la integración reintroduciría duplicación)
   - El nombre es genuinamente informativo y su eliminación obscurecería la intención
   - El símbolo tiene efectos secundarios que se ejecutan en el momento de la declaración (la integración podría cambiar el orden de ejecución)
   - El símbolo se exporta o es parte de una API pública

3. Para cada sitio de llamada:
   - Sustituye el cuerpo del símbolo directamente, con cualquier enlace de parámetro sustituido correctamente
   - Si el cuerpo referencia variables de su ámbito original que no están disponibles en el sitio de llamada, detente e informa — la integración no es segura
   - Asegúrate de que la precedencia del operador sea correcta después de la sustitución (añade paréntesis si es necesario)

4. Después de integrar todos los sitios, elimina la declaración original.

5. Elimina cualquier importación que existiera únicamente para soportar el símbolo ahora eliminado.

6. Verifica que el resultado sea sintáctica y semánticamente correcto:
   - Sin referencias pendientes
   - Sin orden de evaluación cambiado para expresiones con efectos secundarios
   - Los tipos aún se validan si el lenguaje es tipado

7. Resultado: nombre del símbolo, número de sitios integrados, ubicación de la declaración original, y confirmación de que fue eliminada.
