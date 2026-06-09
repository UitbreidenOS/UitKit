---
description: Genera un caso de reproducción mínimo a partir de una descripción de error o prueba fallida
argument-hint: "[bug description or test name]"
---
Dado: $ARGUMENTS

Tu tarea es producir un caso de reproducción mínimo y autosuficiente para este error.

Pasos:

1. Identifica la superficie de falla — ¿es una falla de unidad, integración o tiempo de ejecución? ¿Qué capa la posee?

2. Reduce la reproducción a su forma más pequeña:
   - Elimina toda la configuración, fixtures y datos no relacionados
   - Elimina llamadas de red/sistema de archivos cuando sea posible — úsalas como mock o stub
   - La reproducción debe fallar de forma determinista, no aleatoriamente

3. Establece las condiciones exactas del entorno requeridas:
   - Versión del runtime, limitaciones del SO si es relevante
   - Variables de entorno o valores de configuración requeridos
   - Cualquier dato inicial o precondición

4. Escribe la reproducción como código ejecutable (prueba o script). Incluye:
   - Importaciones y configuración
   - La secuencia mínima de llamadas que desencadena el error
   - Una aserción o impresión de error que marque claramente la falla

5. Añade un bloque de comentario en la parte superior:
   ```
   // BUG: <descripción de una línea>
   // EXPECTED: <lo que debería suceder>
   // ACTUAL: <lo que realmente sucede>
   // SCOPE: <unidad más pequeña conocida que lo reproduce>
   ```

6. Si el error es no determinista, documenta la frecuencia observada y cualquier condición
   que aumente la reproducibilidad (p. ej., nivel de concurrencia, tamaño de datos, tiempo).

7. Verifica que la reproducción realmente falle antes de presentarla. Si puedes ejecutarla, hazlo.

Salida: el contenido del archivo de reproducción listo para pegar en un nuevo archivo, seguido de un resumen
de una oración del mecanismo de falla raíz si puedes identificarlo solo desde la reproducción.
