---
description: Identifica y soluciona fuentes de inestabilidad en pruebas existentes
argument-hint: "[test file or directory]"
---
Analiza pruebas de inestabilidad en: $ARGUMENTS

Pasos:

1. Lee el archivo de destino o todos los archivos de prueba bajo el directorio de destino.

2. Escanea cada uno de los siguientes patrones de inestabilidad y anota cada ocurrencia con la ruta del archivo y el número de línea:

   **Problemas de tiempo**
   - Llamadas fijas a `sleep`/`wait` en lugar de esperas basadas en condiciones
   - Afirmaciones inmediatamente después de operaciones asincrónicas sin esperar
   - Tiempos de espera codificados que pueden variar entre CI y entornos locales

   **Dependencia del orden**
   - Pruebas que modifican estado compartido a nivel de módulo o global sin limpieza
   - Configuración de `beforeAll` en la que las pruebas posteriores dependen pero no declaran
   - Archivos de prueba que asumen el orden de ejecución dentro de una suite

   **No determinismo**
   - Uso de `Math.random()`, `Date.now()` o `new Date()` en afirmaciones sin simulación
   - Llamadas de red a puntos de conexión reales (sin interceptores/mocks)
   - Lecturas del sistema de archivos sin fixtures — rutas que varían según el entorno

   **Contención de recursos**
   - Pruebas paralelas escribiendo en las mismas filas de base de datos o archivos
   - Conflictos de puerto en pruebas de inicio de servidor
   - Reversiones de transacciones o limpieza faltante

   **Fragilidad del selector (UI/E2E)**
   - Selectores de clase CSS que codifican estilo visual, no semántica
   - Expresiones XPath dependientes de la profundidad del DOM
   - Coincidencias de contenido de texto que fallan en cambios de i18n o copia

3. Para cada hallazgo, proporciona:
   - Categoría de patrón (de arriba)
   - Ubicación exacta (file:line)
   - Causa raíz en una oración
   - Una corrección concreta — muestra el fragmento de código antes/después

4. Después de catalogar, aplica correcciones a cualquier problema que sea inequívocamente seguro cambiar (por ejemplo, intercambiar `sleep(500)` por una espera adecuada, agregar limpieza `afterEach` faltante).

5. Para correcciones que requieren decisiones de diseño (por ejemplo, introducir una base de datos de prueba, agregar un servidor simulado), describe el enfoque pero no implementes sin confirmación.

6. Termina con un recuento: X hallazgos, Y corregidos automáticamente, Z requieren acción manual.
