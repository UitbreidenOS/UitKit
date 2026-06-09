---
description: Revisa snapshots desactualizados o innecesarios y decide entre actualizar o reescribir
argument-hint: "[snapshot file, test file, or directory]"
---
Revisar snapshots en: $ARGUMENTS

Pasos:

1. Localiza archivos snapshot. Ubicaciones comunes:
   - Jest: `__snapshots__/*.snap` adyacente a archivos de prueba
   - Vitest: mismo patrón que Jest
   - Storybook: `*.stories.snap`
   - Si el argumento apunta a un archivo de prueba, encuentra su archivo `.snap` asociado.

2. Para cada snapshot en alcance, evalúa:

   **Tamaño**
   - Cuenta las líneas serializadas. Marca cualquier snapshot que exceda 50 líneas como candidato para reemplazo.
   - Los snapshots grandes a menudo oscurecen la aserción real — la intención queda enterrada.

   **Estabilidad**
   - Identifica contenido que cambiará en cada ejecución: timestamps, IDs generados, direcciones de memoria, valores aleatorios, hashes de compilación.
   - Estos hacen que los snapshots sean poco confiables y deben ser enmascarados o reemplazados.

   **Especificidad**
   - Determina qué es lo que la prueba realmente está intentando verificar. Si un snapshot captura un componente renderizado completo pero la prueba se llama "renders the submit button", el snapshot está sobre-especificado.

   **Duplicación**
   - Marca snapshots en múltiples pruebas que capturan el mismo subárbol con variación menor — pueden ser colapsables.

3. Para cada snapshot marcado, recomienda uno de:
   - **Actualizar** — el snapshot es correcto en estructura pero desactualizado; ejecuta `--updateSnapshot`
   - **Reemplazar** — reemplaza el snapshot con aserciones de propiedades específicas (muestra el reemplazo)
   - **Enmascarar** — mantén el snapshot pero agrega transformadores serializadores o `expect.any()` para neutralizar valores volátiles
   - **Eliminar** — el snapshot duplica otra prueba o no proporciona señal alguna; elimínalo

4. Aplica reemplazos y eliminaciones que sean inequívocos. No actualices snapshots desactualizados automáticamente — márcalos para que el usuario los confirme con `--updateSnapshot`.

5. Para cada reemplazo, muestra:
   - El snapshot original (truncado si >10 líneas)
   - La(s) nueva(s) aserción(es) que lo reemplazan
   - Por qué esto es más mantenible

6. Finaliza con un resumen: X snapshots revisados, Y actualizados, Z reemplazados con aserciones, W eliminados, V marcados para revisión manual.
