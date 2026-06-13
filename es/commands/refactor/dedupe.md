---
description: Encontrar y eliminar lógica, datos o estructura duplicados
argument-hint: "[archivo o directorio]"
---
Deduplicar código en $ARGUMENTS.

1. Escanear el ámbito en busca de duplicación:
   - Cuerpos de función idénticos o casi idénticos (>5 líneas con variación trivial)
   - Estructuras de datos o bloques de configuración copiados y pegados con diferencias menores
   - Lógica inline repetida que podría extraerse una sola vez (p. ej., la misma validación, el mismo comparador de ordenamiento, la misma transformación)
   - Definiciones de tipo duplicadas o declaraciones de interfaz
   - Múltiples funciones que difieren solo por un valor de parámetro único — candidatos para parametrización

2. Para cada grupo de duplicados encontrado:
   - Identificar la versión canónica a mantener (preferir la más completa, mejor nombrada o modificada más recientemente)
   - Determinar si las copias difieren por datos (→ parametrizar) o por comportamiento (→ mantener separadas, no son duplicados)
   - Producir una única implementación compartida: extraer una función, constante o tipo según corresponda

3. Reemplazar todos los sitios duplicados con llamadas a la implementación compartida. No dejar las copias antiguas en su lugar.

4. Después del reemplazo, eliminar cualquier importación o ayudante que existiera únicamente para soportar las copias removidas.

5. Salida: para cada deduplicación, listar el símbolo compartido creado, cuántos sitios fueron reemplazados y dónde estaba ubicado cada uno.

Restricciones:
- "Similar" no es "duplicado". Solo fusionar código que tiene la misma intención y semántica — no forzar código no relacionado en una abstracción compartida solo porque se ve igual.
- No introducir una nueva capa de abstracción (clase, módulo, mixin) solo para deduplicar un único par de dos funciones. Una extracción de función simple es suficiente.
- Preservar todo el comportamiento existente. Si colapsar duplicados requiere cambios sutiles en cualquier sitio de llamada, marcarlos explícitamente.
- No deduplicar pruebas — la redundancia en pruebas a menudo es intencional.
