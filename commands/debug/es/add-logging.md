---
description: Añadir registro estructurado a un archivo o función con niveles de registro y contexto apropiados
argument-hint: "[file or function path]"
---
Añadir registro estructurado de calidad de producción al código objetivo.

Target: $ARGUMENTS

Lee el archivo o función objetivo. Luego:

1. **Auditar el registro existente** — identificar qué ya está registrado, qué biblioteca o framework de registro se utiliza (logging de stdlib, structlog, Winston, pino, slog, zerolog, etc.), y las convenciones de nivel de registro del proyecto. No introduzcas una segunda dependencia de registro.

2. **Identificar puntos de registro** — determinar dónde falta el registro o es insuficiente:
   - Entrada y salida de funciones no triviales (con argumentos relevantes y valores de retorno, redactados si pueden contener PII o secretos)
   - Decisiones de ramificación que afecten el comportamiento (registra qué rama se tomó y por qué)
   - Llamadas externas (HTTP, BD, cola, caché) — registra la intención antes de la llamada y el resultado después, siempre incluyendo duración
   - Caminos de error y excepción — registra el contexto completo, no solo el mensaje
   - Transiciones de estado en objetos de larga duración o máquinas de estado

3. **Elegir los niveles de registro correctos** — aplica estas reglas estrictamente:
   - DEBUG: estado interno, iteraciones de bucle, valores de configuración resueltos
   - INFO: hitos significativos que un operador humano querría ver en producción
   - WARN: anomalías recuperables, rutas obsoletas, comportamiento degradado
   - ERROR: fallos que requieren atención; siempre incluye el objeto de excepción/pila

4. **Añadir campos estructurados** — registra pares clave=valor o campos JSON, no cadenas interpoladas. Incluye: IDs de solicitud/traza/correlación si están disponibles en el alcance, IDs de entidad relevantes, tiempo, contexto del entorno.

5. **Aplicar los cambios** — escribe el archivo actualizado. No cambies la lógica, el formato fuera de las líneas añadidas, o los nombres de variables. Añade importaciones solo si es necesario y aún no están presentes.

6. **Mostrar un resumen** — lista cada declaración de registro añadida con su nivel y una justificación de una línea.

No registres secretos, tokens, contraseñas, cuerpos de solicitud completos, o PII. Si tales valores están en el alcance, registra su presencia o un hash, nunca su contenido.
