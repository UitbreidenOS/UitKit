---
description: Revisar snapshots desactualizadas o excesivas y decidir actualizar vs. reescribir
argument-hint: "[archivo snapshot, archivo test o directorio]"
---
Revisar snapshots en: $ARGUMENTS

Pasos:

1. Localizar archivos snapshot. Ubicaciones comunes:
   - Jest: `__snapshots__/*.snap` adyacente a archivos test
   - Vitest: mismo patrón que Jest
   - Storybook: `*.stories.snap`
   - Si el argumento apunta a un archivo test, encontrar su archivo asociado `.snap`.

2. Para cada snapshot en alcance, evaluar:

   **Tamaño**
   - Contar líneas serializadas. Marcar cualquier snapshot que exceda 50 líneas como candidato para reemplazo.
   - Los snapshots grandes a menudo oscurecen la aserción real — la intención está enterrada.

   **Estabilidad**
   - Identificar contenido que cambiará en cada ejecución: marcas de tiempo, IDs generados, direcciones de memoria, valores aleatorios, hashes de compilación.
   - Estos hacen los snapshots poco confiables y deben ser enmascarados o reemplazados.

   **Especificidad**
   - Determinar qué está realmente tratando de verificar el test. Si un snapshot captura un componente completo renderizado pero el test se llama "renders the submit button", el snapshot está sobre-especificado.

   **Duplicación**
   - Marcar snapshots en múltiples tests que capturan el mismo subárbol con variación menor — pueden ser colapsables.

3. Para cada snapshot marcado, recomendar uno de:
   - **Actualizar** — el snapshot es correcto en estructura pero está desactualizado; ejecutar `--updateSnapshot`
   - **Reemplazar** — intercambiar el snapshot por aserciones de propiedad dirigidas (mostrar el reemplazo)
   - **Enmascarar** — mantener el snapshot pero añadir transformaciones serializador o `expect.any()` para neutralizar valores volátiles
   - **Eliminar** — el snapshot duplica otro test o no proporciona señal; eliminarlo

4. Aplicar reemplazos y eliminaciones que sean inequívocos. No actualizar snapshots desactualizados automáticamente — marcarlos para que el usuario confirme con `--updateSnapshot`.

5. Para cada reemplazo, mostrar:
   - El snapshot original (truncado si >10 líneas)
   - La(s) nueva(s) aserción(es) que lo reemplazan
   - Por qué esto es más mantenible

6. Terminar con un resumen: X snapshots revisados, Y actualizados, Z reemplazados con aserciones, W eliminados, V marcados para revisión manual.
