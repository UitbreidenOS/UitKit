---
description: Perfila una ruta de código lenta e identifica los principales cuellos de botella con soluciones accionables
argument-hint: "[file, function, endpoint, or operation description]"
---
Perfila y diagnostica el desempeño para: $ARGUMENTS

Trabaja con datos. No especules sobre cuellos de botella antes de medir.

1. **Define el objetivo de desempeño**
   - ¿Cuál es la latencia/rendimiento medida actualmente?
   - ¿Cuál es el objetivo aceptable?
   - ¿Cuál es la carga de trabajo representativa (tamaño de entrada, concurrencia, forma de datos)?

2. **Selecciona la herramienta de perfilamiento correcta para el tiempo de ejecución**
   - Python: `cProfile` + `snakeviz`, `py-spy` para attachar en vivo, `memray` para perfilamiento de asignación
   - Node/JS: `--prof` + `node --prof-process`, Chrome DevTools CPU profile, `clinic.js`
   - Go: `pprof` (CPU, heap, goroutine, mutex, block profiles), `go test -bench -cpuprofile`
   - JVM: async-profiler, JFR, VisualVM
   - Rust: `cargo flamegraph`, `perf`, `samply`
   - C/C++: `perf`, `valgrind --tool=callgrind`, `gperftools`
   - HTTP genérico: `wrk`, `hey`, `k6` para carga; trace spans para desglose por solicitud

3. **Captura un perfil bajo carga representativa**
   - No perfilen contra entradas de juguete — usa datos de escala de producción o una aproximación fiel
   - Calienta los cachés/JIT antes de capturar — mide estado estable, no inicio en frío, a menos que el inicio en frío sea el problema
   - Captura al menos 30 segundos de perfil de CPU para obtener muestras estadísticamente significativas

4. **Lee el perfil — de arriba hacia abajo**
   - Identifica las 3–5 funciones principales por tiempo propio (ciclos de CPU gastados dentro de la función, no en llamadas)
   - Identifica los principales llamadores de esas funciones calientes — ¿dónde se ingresa en la ruta caliente?
   - Busca sorpresas: serialización, compilación de regex, contención de bloqueos, frecuencia de llamadas al sistema

5. **Categoriza cada cuello de botella**
   - CPU-bound: complejidad algorítmica, computación redundante, bucles ajustados realizando trabajo evitable
   - I/O-bound: consultas N+1, falta de batch/pipeline, llamadas síncronas que podrían ser asincrónicas
   - Memory-bound: asignación excesiva/presión de GC, gran rotación de objetos, cache misses por mala disposición de datos
   - Contención de bloqueos: threads serializando en un mutex caliente — busca estructuras de datos alternativas o sharding

6. **Propón soluciones dirigidas** — una solución por cuello de botella, ordenada por impacto esperado:
   - Incluye aceleración estimada donde puedas razonar sobre ello (p. ej., "elimina escaneo O(n) por solicitud")
   - Prefiere la solución más simple que logre el objetivo — evita la ingeniería excesiva prematura
   - Marca cualquier solución que cambie comportamiento observable (caching, batching, async) para revisión

7. **Escribe un micro-benchmark** — para cada solución propuesta, escribe un benchmark que mida la operación específica antes y después, para que la mejora pueda verificarse y no regresará.

Output: el comando de perfilamiento a ejecutar, los principales cuellos de botella con referencias file:line, y las soluciones propuestas en orden de prioridad. Si no puedes perfilan sin ejecutar el código, dilo y proporciona el comando de perfilamiento que el desarrollador debe ejecutar y reportar de vuelta.
