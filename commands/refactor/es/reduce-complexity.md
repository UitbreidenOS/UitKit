---
description: Reducir la complejidad ciclomática y la profundidad de anidamiento en una función o archivo
argument-hint: "[file] [function name or line number, optional]"
---
Reduce la complejidad del código en $ARGUMENTS.

1. Lee el destino. Si se proporciona una función o línea específica, enfócate allí. De lo contrario, identifica las regiones de mayor complejidad: condicionales profundamente anidados, funciones largas con muchas ramas, cadenas de guardias que oscurecen el camino feliz.

2. Mide las señales de complejidad:
   - Profundidad de anidamiento > 3 niveles
   - Longitud de función > 40 líneas con múltiples responsabilidades
   - Complejidad ciclomática > 10 (conteo: `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` ramas)
   - Expresiones booleanas con > 3 operandos
   - Cadenas largas if-else que podrían ser impulsadas por tabla o polimórficas

3. Aplica reducciones dirigidas:

   Retornos anticipados / cláusulas de guardia:
   - Invierte condiciones para fallar rápidamente en la parte superior de la función, eliminando la necesidad de ramas else profundas

   Extrae subfunciones:
   - Extrae condiciones complejas en funciones predicado nombradas (`isEligible()`, `hasPermission()`)
   - Extrae cuerpos de bucles en funciones nombradas si el cuerpo tiene > 5 líneas

   Reemplaza condicionales con datos:
   - Si una cadena de `if/else` o `switch` mapea valores de entrada a valores de salida, reemplaza con una tabla de búsqueda / mapa

   Aplana bucles anidados:
   - Usa `.flatMap()`, generadores o funciones auxiliares para evitar bucles triple-anidados
   - Si el lenguaje lo admite, considera concurrencia estructurada o patrones de canalización

   Simplifica la lógica booleana:
   - Aplica las leyes de De Morgan para eliminar expresiones compuestas negadas
   - Extrae booleanos nombrados para condiciones complejas (`const isExpired = date < now && !renewed`)

4. No reduzcas la complejidad ocultándola (por ejemplo, moviendo una rama compleja a una lambda que se invoca inmediatamente). El objetivo es una simplificación genuina, no una relocalización.

5. Preserva exactamente todo el comportamiento. Ejecuta un diff mental: cada entrada que produjo salida X debe seguir produciendo salida X.

6. Salida: estimación de complejidad original, estimación nueva y un resumen de cada transformación aplicada.
