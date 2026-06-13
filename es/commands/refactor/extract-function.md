---
description: Extraer un bloque resaltado o lógica descrita en una función nombrada con firma correcta y actualizaciones del sitio de llamada
argument-hint: "[archivo] [rango de líneas o descripción]"
---
Estás realizando un refactor de extracción de función quirúrgico en $ARGUMENTS.

Pasos:
1. Lee el archivo objetivo. Identifica el bloque de código a extraer — ya sea el rango de líneas dado o la lógica que coincida con la descripción.
2. Determina el conjunto mínimo de entradas que la función extraída necesita (parámetros) y qué debe devolver (valores de retorno o mutaciones).
3. Elige un nombre que sea preciso y comience con verbo (ej. `computeRetryDelay`, `parseHeaderToken`, `buildQueryString`). No uses nombres vagos como `helper` o `util`.
4. Escribe la función extraída con:
   - La firma correcta que coincida con las convenciones del lenguaje anfitrión (anotaciones de tipo si el lenguaje las soporta)
   - Un comentario o docstring de una sola línea solo si el propósito no es obvio
   - Sin efectos secundarios más allá de los que tenía el código original
5. Reemplaza el bloque original con una llamada a la nueva función, pasando los argumentos identificados y capturando los valores de retorno.
6. Verifica:
   - El sitio de llamada se compila/analiza correctamente (verifica si hay variables no utilizadas dejadas atrás, retornos faltantes, flujo de control roto)
   - Ninguna variable del ámbito externo ahora se referencia dentro de la función que no haya sido pasada explícitamente
   - Si el lenguaje es tipado, los tipos son consistentes de principio a fin
7. Si la lógica extraída aparece más de una vez en otro lugar del archivo, reemplaza también esas ocurrencias y nota cuántos sitios de llamada fueron actualizados.
8. Genera el diff. No reescribas código no relacionado.

Restricciones:
- Preserva el comportamiento existente exactamente — esto es un refactor, no una reescritura.
- No cambies la lógica del bloque extraído, solo su ubicación e invocación.
- Si la extracción no es segura (ej. el bloque muta varias variables externas de forma entrelazada), explica por qué y sugiere un límite más seguro en su lugar.
