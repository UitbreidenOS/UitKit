---
description: Identificar y reparar una condición de carrera en código concurrente o asincrónico
argument-hint: "[file, function, or symptom description]"
---
Analizar en busca de condiciones de carrera: $ARGUMENTS

Las condiciones de carrera son errores dependientes del orden. Trata esto como un problema de prueba, no una adivinanza.

1. **Mapea el estado compartido**
   - Enumera cada variable, estructura de datos o recurso al que accedan más de una gorrutina/hilo/cadena asincrónica en el código afectado
   - Para cada uno: identifica todos los sitios de lectura y todos los sitios de escritura
   - Anota si los accesos están protegidos (bloqueo, atómico, canal, mutex, semáforo) o desprotegidos

2. **Identifica el tipo de peligro**
   - Carrera de lectura-escritura: un escritor, uno o más lectores concurrentes, sin sincronización
   - Carrera de escritura-escritura: dos escritores, sin sincronización
   - Verificación-entonces-acción: condición verificada, luego acción realizada, con una ventana entre ellas (TOCTOU clásico)
   - Problema ABA: valor verificado, cambiado externamente, cambiado de nuevo — la verificación parece pasar pero el estado es incorrecto
   - Carrera de inicialización: patrón de inicialización perezosa sin protección once-guard

3. **Construye el intercalado** — escribe el intercalado específico de hilo/tarea que causa el error:
   ```
   Hilo A                      Hilo B
   lee x == 0
                               escribe x = 1
   escribe x = 0 (lectura obsoleta)
   ```
   Si no puedes construir un intercalado concreto, no has encontrado la carrera.

4. **Verifica trampas específicas del lenguaje**
   - JS/TS: los espacios asincrónico entre puntos `await` son ventanas de intercalado — cualquier estado compartido mutado entre awaits es sospechoso
   - Go: las lecturas/escrituras de mapas no son seguras para concurrencia; cierres de gorrutina capturando variables de bucle
   - Python: el GIL no protege operaciones compuestas; brechas `asyncio` entre puntos `await`
   - Java/Kotlin: problemas de visibilidad (campos no volátiles), antipatrón de double-checked locking

5. **Propón la corrección** — adapta la corrección al peligro:
   - Lectura-escritura / escritura-escritura: mutex, RWMutex, CAS atómico, o canal
   - Verificación-entonces-acción: mover la verificación dentro del bloqueo, o usar comparación-e-intercambio atómico
   - Inicialización: `sync.Once`, `std::call_once`, inicialización a nivel de módulo, o un bloqueo alrededor de init perezosa
   - Espacios asincrónico: mantén todo el estado compartido en variables locales antes del primer await, o usa snapshots inmutables

6. **Escribe una prueba de estrés** — una prueba que ejecute la ruta concurrente bajo alta contención (por ejemplo, 100 gorrutinas,
   bucle estrecho) con `-race` / thread sanitizer / Helgrind habilitado. Confirma que pase sin problemas.

Resultado: el mapa de estado compartido, el intercalado malo concreto, la corrección con ediciones file:line,
y la prueba. No sugieras "agregar un retraso" o "reintentar" como correcciones — esas ocultan carreras.
