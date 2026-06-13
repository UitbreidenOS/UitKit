---
description: Simplificar expresiones, condiciones y flujos de control excesivamente complejos sin alterar el comportamiento
argument-hint: "[archivo o archivo:rango-de-líneas]"
---
Estás realizando un pase de simplificación en $ARGUMENTS. El objetivo es reducir la carga cognitiva sin alterar el comportamiento.

Trabaja a través de las siguientes categorías en orden. Para cada cambio, aplícalo directamente — no enumeres sugerencias.

**Simplificación de expresiones**
- Colapsa dobles negaciones (`!!x` → `Boolean(x)` o simplemente `x` donde la verificación de veracidad es suficiente; `!(a !== b)` → `a === b`)
- Reduce ternarios anidados más de un nivel de profundidad en devoluciones tempranas o variables nombradas
- Reemplaza la construcción manual de arrays/objetos con equivalentes idiomáticos (spread, comprensiones, desestructuración)
- Colapsa encadenamientos `.filter().map()` donde un único `.reduce()` o `.flatMap()` es más limpio — solo si genuinamente reduce líneas y sigue siendo legible

**Simplificación de condicionales**
- Convierte `if (x) return true; else return false;` → `return x;` (y variantes tipadas)
- Fusiona cláusulas de guardia: múltiples patrones `if (!a || !b || !c) throw` en una única guardia
- Reemplaza cadenas de switch/if-else sobre enum/string con una tabla de búsqueda donde las ramas son devoluciones de valores simples
- Elimina `else` redundante después de `return`, `throw`, `continue` o `break`

**Simplificación de flujo de control**
- Aplana anidamiento innecesario: si el cuerpo del `if` externo contiene solo un `if`, invierte la condición y devuelve temprano
- Elimina ramas sin operación (`if (x) { /* nada */ }`)
- Reemplaza bucles `for` contados que construyen un array con map/fill/from idiomáticos donde sea idiomático en el lenguaje

**Simplificación de variables**
- Alinea variables de un solo uso que no añaden claridad (`const x = a + b; return x;` → `return a + b;`)
- Elimina variables intermedias que solo son alias de otra variable sin transformación

Aplica todos los cambios seguros. No cambies la lógica. No renombres símbolos a menos que un nombre sea activamente engañoso. No reformatees código no relacionado con las simplificaciones.

Emite un diff unificado de todos los cambios realizados.
