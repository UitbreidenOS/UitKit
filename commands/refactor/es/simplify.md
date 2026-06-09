---
description: Simplifica expresiones, condiciones y flujos de control demasiado complejos sin cambiar el comportamiento
argument-hint: "[file or file:line-range]"
---
Estás realizando una revisión de simplificación en $ARGUMENTS. El objetivo es reducir la carga cognitiva sin alterar el comportamiento.

Trabaja a través de las siguientes categorías en orden. Para cada cambio, aplícalo directamente — no listes sugerencias.

**Simplificación de expresiones**
- Colapsa dobles negaciones (`!!x` → `Boolean(x)` o simplemente `x` donde la verificación de truthy es suficiente; `!(a !== b)` → `a === b`)
- Reduce ternarios anidados más de un nivel profundo a retornos tempranos o variables nombradas
- Reemplaza construcciones manuales de arrays/objetos con equivalentes idiomáticos (spreads, comprensiones, desestructuración)
- Colapsa `.filter().map()` encadenados donde un único `.reduce()` o `.flatMap()` es más limpio — solo si genuinamente reduce líneas y sigue siendo legible

**Simplificación condicional**
- Convierte `if (x) return true; else return false;` → `return x;` (y variantes tipadas)
- Fusiona cláusulas de protección: múltiples patrones `if (!a || !b || !c) throw` en una única protección
- Reemplaza switch/if-else ladders sobre un enum/string con una tabla de búsqueda donde las ramas son retornos simples de valores
- Elimina `else` redundante después de `return`, `throw`, `continue`, o `break`

**Simplificación de flujo de control**
- Aplana anidamientos innecesarios: si el cuerpo del `if` externo contiene solo un `if`, invierte la condición y retorna temprano
- Elimina ramas sin operación (`if (x) { /* nothing */ }`)
- Reemplaza bucles `for` contados que construyen un array con map/fill/from idiomático donde sea idiomático en el lenguaje

**Simplificación de variables**
- Incorpora variables de un solo uso que no agregan claridad (`const x = a + b; return x;` → `return a + b;`)
- Elimina variables intermedias que solo aliasean otra variable sin transformación

Aplica todos los cambios seguros. No cambies la lógica. No renombres símbolos a menos que un nombre sea activamente engañoso. No reformatees código no relacionado con las simplificaciones.

Produce un diff unificado de todos los cambios realizados.
