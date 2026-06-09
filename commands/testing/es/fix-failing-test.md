---
description: Diagnosticar y corregir una prueba fallida, identificando la causa raíz antes de parchear
argument-hint: "[test-name-or-file]"
---
Corregir la prueba fallida: $ARGUMENTS

No toques la prueba ni la implementación hasta que hayas diagnosticado la causa raíz.

Paso 1 — Ejecuta la prueba fallida de forma aislada y captura el resultado de error completo incluyendo el rastreo de pila.

Paso 2 — Clasifica el fallo:
- Fallo de aserción: el comportamiento del código cambió o la aserción fue incorrecta desde el principio
- Problema de configuración/desmontaje: estado compartido filtrándose entre pruebas, restablecimiento de simulación faltante, orden incorrecto
- Problema de entorno: variable de entorno faltante, directorio de trabajo incorrecto, DB/servicio no inicializado
- Error de tipo o importación: firma cambió, ruta del módulo incorrecta, dependencia faltante
- Problema de sincronización/asincronía: promesa no resuelta, falta await, condición de carrera

Paso 3 — Rastrea el fallo hasta su origen. Lee la implementación siendo probada. Lee cualquier simulación o accesorio involucrado. Entiende qué pretendía verificar la prueba originalmente.

Paso 4 — Determina quién es el responsable:
- Si la implementación tiene un error real introducido por un cambio reciente, corrige la implementación y mantén la prueba.
- Si la prueba estaba afirmando comportamiento incorrecto desde el inicio, corrige la prueba.
- Si la prueba está afirmando algo que ahora es intencionalmente diferente (especificación cambió), actualiza la prueba y anota el cambio de especificación.

Paso 5 — Aplica la corrección mínima. No refactorices el código circundante. No cambies aserciones no relacionadas.

Paso 6 — Ejecuta el conjunto de pruebas completo para el módulo afectado para confirmar que no se han introducido regresiones.

Informe: clasificación de causa raíz, qué cambiaste y por qué.
