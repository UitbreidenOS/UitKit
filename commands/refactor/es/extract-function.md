---
description: Extrae un bloque resaltado o lógica descrita en una función nombrada con firma correcta y actualizaciones del sitio de llamada
argument-hint: "[file] [line-range or description]"
---
Estás realizando un refactor quirúrgico de extracción de función en $ARGUMENTS.

Pasos:
1. Lee el archivo de destino. Identifica el bloque de código a extraer — ya sea el rango de líneas dado o la lógica que coincida con la descripción.
2. Determina el conjunto mínimo de entradas que necesita la función extraída (parámetros) y qué debe devolver (valores de retorno o mutaciones).
3. Elige un nombre que sea preciso y que comience con un verbo (por ejemplo, `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). No uses nombres vagos como `helper` o `util`.
4. Escribe la función extraída con:
   - La firma correcta que coincida con las convenciones del lenguaje anfitrión (anotaciones de tipo si el lenguaje las soporta)
   - Una docstring/comentario de una sola línea solo si el propósito no es obvio
   - Sin efectos secundarios más allá de los que tenía el código original
5. Reemplaza el bloque original con una llamada a la nueva función, pasando los argumentos identificados y capturando los valores de retorno.
6. Verifica:
   - El sitio de llamada se compila/analiza correctamente (verifica variables no utilizadas dejadas atrás, retornos faltantes, flujo de control roto)
   - Ninguna variable del ámbito externo se hace referencia ahora dentro de la función que no fue explícitamente pasada
   - Si el lenguaje es tipado, los tipos son consistentes de extremo a extremo
7. Si la lógica extraída aparece más de una vez en otro lugar del archivo, reemplaza esas ocurrencias también y anota cuántos sitios de llamada fueron actualizados.
8. Emite el diff. No reescribas código no relacionado.

Restricciones:
- Preserva el comportamiento existente exactamente — esto es un refactor, no una reescritura.
- No cambies la lógica del bloque extraído, solo su ubicación e invocación.
- Si la extracción no es segura (por ejemplo, el bloque muta varias variables externas de manera entrelazada), explica por qué y sugiere un límite más seguro en su lugar.
