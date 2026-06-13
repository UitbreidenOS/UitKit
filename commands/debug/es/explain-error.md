---
description: Explicar un mensaje de error o excepción con análisis de causa raíz y orientación de reparación
argument-hint: "[mensaje de error o pegado]"
---
Se te proporciona un error o excepción. Analízalo a fondo y produce una explicación estructurada.

Error o excepción a analizar:
$ARGUMENTS

Sigue este proceso:

1. **Identificar el tipo de error** — clasifícalo (tiempo de ejecución, compilación, red, permiso, lógica, falta de memoria, etc.) y nombra la clase de error o código exacto si está presente.

2. **Análisis de causa raíz** — explica qué salió mal realmente a nivel mecánico. No te detengas en el mensaje superficial; rastrea hasta la causa subyacente. Si el error implica un seguimiento de pila, sigue cada marco e identifica la llamada originaria.

3. **Pistas de contexto** — extrae cualquier ruta de archivo, número de línea, nombre de módulo, cadenas de versión o pistas de entorno incrustadas en el error. Explica qué nos dice cada una.

4. **Desencadenantes comunes** — lista los 3–5 escenarios más probables que producen este error exacto, clasificados por frecuencia. Para cada uno, indica cómo confirmarlo o descartarlo.

5. **Estrategia de reparación** — para cada causa probable, proporciona la reparación concreta. Sé específico: incluye claves de configuración, patrones de código, comandos o cambios de archivo según corresponda. Prefiere la reparación mínima correcta sobre reescrituras amplias.

6. **Prevención** — si esta clase de error es evitable sistemáticamente (por ejemplo, con una regla de linter, una anotación de tipo, una política de reintentos, una verificación nula), indícalo brevemente.

Restricciones:
- No llenes la respuesta con consejos genéricos que apliquen a cada error.
- Si el texto del error es ambiguo o incompleto, indica qué contexto adicional cambiaría tu análisis y cómo.
- Cuando la reparación implique cambios de código, muestra un diff antes/después o un fragmento concreto, no una descripción de un fragmento.
- Mantén la respuesta densa. Los ingenieros sénior leen rápido.
