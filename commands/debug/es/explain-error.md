---
description: Explicar un mensaje de error o excepción con análisis de causa raíz y orientación sobre correcciones
argument-hint: "[error message or paste]"
---
Se te proporciona un error o excepción. Analízalo a fondo y produce una explicación estructurada.

Error o excepción a analizar:
$ARGUMENTS

Sigue este proceso:

1. **Identifica el tipo de error** — clasifícalo (runtime, compilación, red, permiso, lógica, OOM, etc.) e identifica el nombre exacto de la clase de error o código si está presente.

2. **Análisis de causa raíz** — explica qué salió mal realmente a nivel mecánico. No te detengas en el mensaje de superficie; rastrea hasta la causa subyacente. Si el error involucra un stack trace, sigue cada marco e identifica la llamada originaria.

3. **Pistas de contexto** — extrae cualquier ruta de archivo, número de línea, nombre de módulo, cadena de versión o pista de entorno incrustada en el error. Explica qué nos dice cada uno.

4. **Disparadores comunes** — enumera los 3–5 escenarios más probables que producen este error exacto, clasificados por frecuencia. Para cada uno, establece cómo confirmarlo o descartarlo.

5. **Estrategia de corrección** — para cada causa probable, proporciona la corrección concreta. Sé específico: incluye claves de configuración, patrones de código, comandos o cambios de archivo según corresponda. Prefiere la corrección mínima correcta sobre reescrituras amplias.

6. **Prevención** — si esta clase de error es evitable sistemáticamente (p. ej., con una regla de linter, una anotación de tipo, una política de reintento, una verificación nula), menciónalo brevemente.

Restricciones:
- No rellenar con consejos genéricos que se apliquen a cada error.
- Si el texto del error es ambiguo o incompleto, establece qué contexto adicional cambiaría tu análisis y cómo.
- Cuando la corrección implique cambios de código, muestra un diff antes/después o un fragmento concreto, no una descripción de un fragmento.
- Mantén la respuesta densa. Los ingenieros senior leen rápido.
