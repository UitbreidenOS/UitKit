---
description: Generar documentación de referencia de API para módulos o puntos finales públicos
argument-hint: "[file-or-directory]"
---
Generar documentación de referencia de API completa para: $ARGUMENTS

Si no se proporciona ningún argumento, escanea el repositorio en busca de superficies de API públicas — módulos exportados, puntos finales REST/GraphQL, interfaces CLI — y documenta todos ellos.

Proceso:
1. Identifica la superficie de API:
   - Para bibliotecas: funciones exportadas, clases, tipos (lee la fuente + cualquier archivo de índice/barril).
   - Para API HTTP: definiciones de rutas (Express, FastAPI, Django, Rails, etc.).
   - Para CLI: analizadores de argumentos (argparse, click, cobra, yargs, etc.).
2. Para cada símbolo/punto final público, extrae: nombre, firma/ruta+método, parámetros con tipos, tipo de retorno, descripción de docstrings/comentarios existentes (si los hay), condiciones de error.
3. Tenga en cuenta cualquier esquema de autenticación, limitación de velocidad o versionado presente en el código.

Formato de salida — Documento de referencia en Markdown:

## API Reference

Para cada módulo / espacio de nombres / grupo de rutas:

### `<SymbolName>` / `<METHOD /path>`

**Description:** Lo que hace (inferido de la implementación si no existe docstring).

**Parameters / Request:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| ...  | ...  | ...      | ...         |

**Returns / Response:** tipo y forma, o códigos de estado HTTP con forma de cuerpo.

**Errors:** Lista condiciones de error conocidas y sus códigos/tipos.

**Example:**
```<lang>
// minimal working example
```

Reglas:
- Documenta solo lo que está realmente en el código — no inventes parámetros.
- Si el tipo de un parámetro es ambiguo, indica el tipo inferido y márcalo con `<!-- verify -->`.
- Para API HTTP, muestra ejemplos de curl.
- Para funciones de biblioteca, muestra el lenguaje anfitrión.
- Agrupa por espacio de nombres lógico / recurso / módulo — alfabético dentro de cada grupo.
- Si el destino es un directorio, recursa en todos los archivos fuente.

Escribe la salida en `docs/api-reference.md` (crea `docs/` si está ausente), o en $ARGUMENTS si termina en `.md`. Confirma la ruta escrita.
