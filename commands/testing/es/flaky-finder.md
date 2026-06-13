---
description: Identificar y corregir fuentes de inestabilidad en pruebas existentes
argument-hint: "[archivo de prueba o directorio]"
---
Analizar pruebas para detectar inestabilidad en: $ARGUMENTS

Pasos:

1. Leer el archivo de destino o todos los archivos de prueba bajo el directorio de destino.

2. Escanear cada uno de los siguientes patrones de inestabilidad y anotar cada ocurrencia con ruta de archivo y número de línea:

   **Problemas de temporización**
   - Llamadas fijas a `sleep`/`wait` en lugar de esperas basadas en condiciones
   - Aserciones inmediatamente después de operaciones asincrónicas sin esperar
   - Tiempos de espera codificados que pueden diferir entre ambientes CI y locales

   **Dependencia del orden**
   - Pruebas que mutan estado compartido a nivel de módulo o global sin limpieza
   - Configuración en `beforeAll` en la que las pruebas posteriores dependen pero no declaran
   - Archivos de prueba que asumen orden de ejecución dentro de una suite

   **No determinismo**
   - Uso de `Math.random()`, `Date.now()`, o `new Date()` en aserciones sin mock
   - Llamadas de red a endpoints reales (sin interceptores/mocks)
   - Lecturas del sistema de archivos sin fixtures — rutas que difieren por ambiente

   **Contención de recursos**
   - Pruebas paralelas escribiendo en las mismas filas de base de datos o archivos
   - Conflictos de puerto en pruebas de inicio de servidor
   - Reversiones de transacciones o teardown faltantes

   **Fragilidad de selectores (UI/E2E)**
   - Selectores de clase CSS que codifican estilo visual, no semántica
   - Expresiones XPath dependientes de profundidad DOM
   - Coincidencias de contenido de texto que fallan con cambios i18n o de copia

3. Para cada hallazgo, proporcionar:
   - Categoría de patrón (de arriba)
   - Ubicación exacta (archivo:línea)
   - Causa raíz en una oración
   - Una corrección concreta — mostrar fragmento de código antes/después

4. Después de catalogar, aplicar correcciones a cualquier problema que sea inequívocamente seguro cambiar (p. ej., reemplazar `sleep(500)` por una espera adecuada, agregar limpieza `afterEach` faltante).

5. Para correcciones que requieren decisiones de diseño (p. ej., introducir una base de datos de prueba, agregar un servidor mock), describir el enfoque pero no implementar sin confirmación.

6. Terminar con un recuento: X hallazgos, Y auto-corregidos, Z requieren acción manual.
