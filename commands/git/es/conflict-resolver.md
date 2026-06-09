---
description: Explica y resuelve conflictos de fusión en el árbol de trabajo actual
argument-hint: "[file]"
---
Ejecuta `git diff --diff-filter=U --name-only` para listar todos los archivos con conflictos de fusión sin resolver. Si se proporciona $ARGUMENTS, restringe el análisis a ese archivo.

Para cada archivo en conflicto (o solo el especificado), lee el contenido sin procesar y ubica cada bloque de marcador de conflicto:

```
<<<<<<< HEAD
... ours ...
=======
... theirs ...
>>>>>>> branch-name
```

Para cada bloque de conflicto:
1. Identifica el lado de HEAD y el lado entrante leyendo el contexto circundante (nombre de función, alcance de variable, bloque de importación, clave de configuración, etc.).
2. Indica en una oración qué intenta hacer cada lado.
3. Determina la resolución correcta usando este orden de prioridad:
   - Si un lado es una operación sin efecto relativo al otro (por ejemplo, solo espacios en blanco o una reversión), prefiere el cambio sustancial.
   - Si ambos lados agregan lógica distinta, combínalos (el orden importa — explica tu elección de ordenamiento).
   - Si los dos lados son semánticamente incompatibles, indícalo y pregunta al usuario qué intención mantener antes de escribir una resolución.
4. Escribe el bloque resuelto — sin marcadores de conflicto, sin líneas en blanco adicionales agregadas gratuitamente.

Después de resolver todos los bloques en un archivo, muestra la versión completamente resuelta de cada fragmento en conflicto (no todo el archivo a menos que sea corto).

Luego genera una tabla de resumen:

| File | Conflicts resolved | Action taken |
|------|--------------------|--------------|
| ...  | N                  | merged / chose ours / chose theirs / needs decision |

No ejecutes `git add` o `git commit`. No modifiques archivos en disco a menos que el usuario confirme las resoluciones propuestas.

Si un conflicto está dentro de un archivo de bloqueo (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `poetry.lock`), aconseja al usuario que elimine el archivo de bloqueo y lo regenere en lugar de resolver manualmente, y omite ese archivo.
