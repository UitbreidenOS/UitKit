---
description: Diagnosticar y ubicar una fuga de memoria dada una descripción de síntomas o ruta de código
argument-hint: "[symptom description, file, or function name]"
---
Investigar una fuga de memoria basada en: $ARGUMENTS

Trabaja a través de esto sistemáticamente. No adivines — rastrea las rutas de asignación.

1. **Establecer la firma de la fuga**
   - ¿El uso del heap crece sin límites, o es un pico único que nunca se libera?
   - ¿La fuga es en todo el proceso o aislada a un subsistema (p. ej., un manejador de solicitud, un hilo de trabajo)?
   - Nota el lenguaje/runtime — los lenguajes con GC (JS, Python, Go, JVM) tienen fugas diferentes que los lenguajes de memoria manual (C, C++, Rust unsafe).

2. **Identificar sitios candidatos** — escanea la ruta de código en $ARGUMENTS para:
   - Colecciones de larga duración (cachés, registros, mapas de oyentes de eventos) que crecen sin desalojo
   - Cierres o lambdas que capturan objetos grandes que sobreviven a su alcance útil
   - Referencias circulares que anulan los GC de conteo de referencias (Python, Swift, ObjC)
   - Finalizadores o destructores que nunca se llaman (manijas de recursos, descriptores de archivo, sockets)
   - Estado `static` o de nivel de módulo acumulado a través de solicitudes/llamadas
   - Búferes o flujos asignados pero nunca cerrados/drenados

3. **Instrumentar para verificación** — antes de afirmar que está solucionado:
   - Agrega una instantánea del heap o un contador de asignación en el sitio sospechoso
   - Escribe un bucle que ejerza la ruta sospechosa N veces y afirma que el crecimiento del heap está limitado
   - En lenguajes con GC, fuerza una recolección antes de medir para evitar falsos positivos

4. **Identificar la referencia que retiene** — sigue la cadena de referencias desde el objeto filtrado hasta una raíz de GC:
   - ¿Qué mantiene una referencia al objeto filtrado?
   - ¿Es intencional (caché) o no intencional (oyente olvidado, cierre obsoleto)?

5. **Proponer la solución** — una vez que tengas la referencia retenida:
   - Caché acotado con desalojo LRU/TTL
   - Llamada explícita de deregistro/limpieza en un finally/defer/destructor
   - WeakRef o WeakMap donde la propiedad fuerte no es necesaria
   - Reducción de alcance para que el objeto se libere al final del bloque

6. **Escribir una prueba de regresión** — una prueba que asigne/libere N veces y afirme que el RSS máximo o
   el recuento de objetos permanece plano. Las pruebas de fugas inestables son peor que ninguna; hazla determinista.

Output: el o los sitios sospechosos de fuga con referencias file:line, la cadena de referencia retenida,
y la solución propuesta. Si no puedes confirmar sin ejecutar el código, dilo explícitamente.
