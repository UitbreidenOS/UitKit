---
description: Encuentra y elimina lógica duplicada, datos o estructura
argument-hint: "[file or directory]"
---
Desduplicar código en $ARGUMENTS.

1. Escanea el alcance para encontrar duplicación:
   - Cuerpos de función idénticos o casi idénticos (>5 líneas con variación trivial)
   - Estructuras de datos copiadas o bloques de configuración con pequeñas diferencias
   - Lógica inline repetida que podría extraerse una sola vez (por ejemplo, la misma validación, el mismo comparador de ordenamiento, la misma transformación)
   - Definiciones de tipo duplicadas o declaraciones de interfaz
   - Múltiples funciones que difieren solo por un valor de parámetro único — candidatos para parametrización

2. Para cada grupo de duplicación encontrado:
   - Identifica la versión canónica a mantener (prefiere la más completa, mejor nombrada o modificada más recientemente)
   - Determina si las copias difieren por datos (→ parametrizar) o por comportamiento (→ mantener separadas, no son duplicados)
   - Produce una única implementación compartida: extrae una función, constante o tipo según sea apropiado

3. Reemplaza todos los sitios duplicados con llamadas a la implementación compartida. No dejes las copias antiguas en su lugar.

4. Después del reemplazo, elimina cualquier importación o ayuda que existiera únicamente para soportar las copias eliminadas.

5. Salida: para cada desduplicación, enumera el símbolo compartido creado, cuántos sitios fueron reemplazados y dónde se ubicaba cada uno.

Restricciones:
- "Similar" no es "duplicado". Solo fusiona código que tenga la misma intención y semántica — no fuerces código no relacionado en una abstracción compartida porque se vea similar.
- No introduzcas una nueva capa de abstracción (clase, módulo, mixin) solo para desduplicar un único par de dos funciones. Una extracción de función simple es suficiente.
- Preserva todo el comportamiento existente. Si colapsar duplicados requiere cambios sutiles en cualquier sitio de llamada, márcalos explícitamente.
- No desduplicar pruebas — la redundancia de pruebas es a menudo intencional.
