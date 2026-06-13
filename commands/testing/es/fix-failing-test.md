---
description: Diagnosticar y reparar una prueba fallida, identificar la causa raíz antes de aplicar parche
argument-hint: "[nombre-prueba-o-archivo]"
---
Reparar la prueba fallida: $ARGUMENTS

No toque la prueba ni la implementación hasta que haya diagnosticado la causa raíz.

Paso 1 — Ejecutar la prueba fallida de forma aislada y capturar el resultado completo del error incluyendo el seguimiento de pila.

Paso 2 — Clasificar el fallo:
- Fallo de aserción: el comportamiento del código cambió o la aserción fue incorrecta desde el inicio
- Problema de configuración/desmontaje: estado compartido filtrando entre pruebas, reinicio de mock faltante, orden incorrecto
- Problema de entorno: variable de entorno faltante, directorio de trabajo incorrecto, base de datos/servicio no inicializado
- Error de tipo o importación: firma cambió, ruta del módulo incorrecta, dependencia faltante
- Problema de tiempo/asincronía: promesa sin resolver, await faltante, condición de carrera

Paso 3 — Rastrear el fallo hasta su origen. Lea la implementación que se está probando. Lea cualquier mock o fixture involucrado. Comprenda qué era lo que la prueba originalmente intentaba verificar.

Paso 4 — Determinar quién tiene la culpa:
- Si la implementación tiene un error real introducido por un cambio reciente, reparar la implementación y mantener la prueba.
- Si la prueba estaba asertando comportamiento incorrecto desde el inicio, reparar la prueba.
- Si la prueba está asertando algo que ahora es intencionalmente diferente (la especificación cambió), actualizar la prueba y notar el cambio de especificación.

Paso 5 — Aplicar la corrección mínima. No refactorice código circundante. No cambie aserciones no relacionadas.

Paso 6 — Ejecutar el conjunto completo de pruebas del módulo afectado para confirmar que no se introdujeron regresiones.

Informe: clasificación de la causa raíz, qué cambió y por qué.
