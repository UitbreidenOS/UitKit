---
description: Fortalecer anotaciones de tipo débiles o faltantes en todo un archivo
argument-hint: "[file]"
---
Ajusta los tipos en $ARGUMENTS.

1. Lee el archivo. Identifica cada ubicación donde los tipos son más débiles de lo que deberían ser:
   - `any` en TypeScript — reemplazarlo con el tipo más específico, unión o genérico correcto
   - Parámetros de función o valores de retorno sin tipo
   - Tipos demasiado amplios (`object`, `Record<string, any>`, `dict`, `interface{}`) donde se conoce una forma concreta
   - Opcional (`T | undefined`, `T | None`) usado donde el valor siempre está presente
   - No-opcional usado donde el valor puede estar ausente legítimamente — agregar el opcional y manejarlo en los sitios de llamada
   - Enumeraciones o tipos de unión que podrían reemplazar literales `string` o `number` desnudos
   - Casts `as` / aserciones de tipo que podrían reemplazarse con estrechamiento de tipo adecuado o guardias

2. Para cada tipo débil encontrado:
   - Inferir el tipo correcto del uso, contexto circundante y cualquier documentación existente
   - Aplicar el tipo más ajustado en el sitio de declaración
   - Arreglar cualquier error de tipo posterior que el ajuste exponga — no dejar sitios de llamada rotos
   - Si el ajuste requiere un nuevo alias de tipo o interfaz, definirlo cerca de la parte superior del archivo (o en un archivo de tipos existente si el proyecto tiene uno)

3. No cambies el comportamiento en tiempo de ejecución. Solo cambios de tipo.

4. No agregues tipos solo por agregar tipos — si el tipo de una variable local es obvio de una asignación literal y el lenguaje lo infiere correctamente, dejar la inferencia sola.

5. Si el tipo de retorno de una función se infiere actualmente y la inferencia es correcta y estable, dejarlo. Solo anotar donde el tipo inferido es demasiado amplio o probable que cambie.

6. Después de todos los cambios, verifica que el archivo pasaría el verificador de tipos del proyecto (`tsc --noEmit`, `mypy`, `cargo check`, etc.) conceptualmente. Si no puedes verificar, señala cualquier cambio que podría introducir un error de tipo.

7. Salida: lista de cada tipo ajustado, tipo original, tipo nuevo y ubicación.
