---
description: Reducir la complejidad ciclomática y la profundidad de anidamiento en una función o archivo
argument-hint: "[archivo] [nombre de función o número de línea, opcional]"
---
Reduce la complejidad del código en $ARGUMENTS.

1. Lee el objetivo. Si se proporciona una función o línea específica, enfócate allí. De lo contrario, identifica las regiones de mayor complejidad: condicionales profundamente anidados, funciones largas con muchas ramas, cadenas de guardias que oscurecen el camino feliz.

2. Mide las señales de complejidad:
   - Profundidad de anidamiento > 3 niveles
   - Longitud de función > 40 líneas con múltiples responsabilidades
   - Complejidad ciclomática > 10 (conteo: `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||` ramas)
   - Expresiones booleanas con > 3 operandos
   - Cadenas largas de if-else que podrían ser impulsadas por datos o polimórficas

3. Aplica reducciones dirigidas:

   Retornos tempranos / cláusulas de guarda:
   - Invierte las condiciones para fallar rápidamente en la parte superior de la función, eliminando la necesidad de ramas else profundas

   Extrae sub-funciones:
   - Extrae condiciones complejas en funciones predicadas nombradas (`isEligible()`, `hasPermission()`)
   - Extrae cuerpos de bucles en funciones nombradas si el cuerpo es > 5 líneas

   Reemplaza condicionales con datos:
   - Si una cadena de `if/else` o `switch` mapea valores de entrada a valores de salida, reemplaza con una tabla de búsqueda / mapa

   Aplana bucles anidados:
   - Usa `.flatMap()`, generadores o funciones auxiliares para evitar bucles triplemente anidados
   - Si el lenguaje lo permite, considera patrones de concurrencia estructurada o tuberías

   Simplifica la lógica booleana:
   - Aplica las leyes de De Morgan para eliminar expresiones negadas compuestas
   - Extrae booleanos nombrados para condiciones complejas (`const isExpired = date < now && !renewed`)

4. No reduzcas la complejidad ocultándola (p. ej., moviendo una rama compleja a una lambda que se invoca inmediatamente). El objetivo es la simplificación genuina, no la reubicación.

5. Preserva todo el comportamiento exactamente. Ejecuta un diff mental: cada entrada que produjo salida X debe seguir produciendo salida X.

6. Salida: estimación de complejidad original, estimación nueva y un resumen de cada transformación aplicada.
