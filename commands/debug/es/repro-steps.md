---
description: Generar un caso de reproducción mínimo a partir de una descripción de error o prueba fallida
argument-hint: "[descripción del error o nombre de la prueba]"
---
Dado: $ARGUMENTS

Tu tarea es producir un caso de reproducción mínimo y autónomo para este error.

Pasos:

1. Identifica la superficie de fallo — ¿es un fallo unitario, de integración o de tiempo de ejecución? ¿Qué capa lo controla?

2. Reduce la reproducción a su forma más pequeña:
   - Elimina toda configuración, fixtures y datos no relacionados
   - Elimina llamadas de red/sistema de archivos cuando sea posible — úsalas con mock o stub
   - La reproducción debe fallar de forma determinista, no aleatoria

3. Establece las condiciones exactas del entorno requeridas:
   - Versión del tiempo de ejecución, restricciones del SO si son relevantes
   - Variables de entorno o valores de configuración requeridos
   - Cualquier dato semilla o precondición

4. Escribe la reproducción como código ejecutable (prueba o script). Incluye:
   - Imports y configuración
   - La secuencia mínima de llamadas que dispara el error
   - Una afirmación o impresión de error que marque claramente el fallo

5. Añade un bloque de comentario al principio:
   ```
   // BUG: <descripción de una línea>
   // EXPECTED: <lo que debería suceder>
   // ACTUAL: <lo que realmente sucede>
   // SCOPE: <unidad más pequeña conocida que lo reproduce>
   ```

6. Si el error es no determinista, documenta la frecuencia observada y cualquier condición
   que aumente la reproducibilidad (ej. nivel de concurrencia, tamaño de datos, tiempo).

7. Verifica que la reproducción realmente falle antes de presentarla. Si puedes ejecutarla, hazlo.

Output: el contenido del archivo repro listo para pegar en un archivo nuevo, seguido de un resumen
de una oración del mecanismo de fallo raíz si puedes identificarlo solo desde la reproducción.
