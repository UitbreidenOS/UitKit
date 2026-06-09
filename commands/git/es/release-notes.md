---
description: Redacta notas de versión desde commits entre dos refs o desde la última etiqueta
argument-hint: "[from-ref] [to-ref]"
---
Analiza $ARGUMENTS como hasta dos refs de git separadas por un espacio: `from-ref` y `to-ref`. Si se proporcionan dos refs, úsalas directamente. Si se proporciona una ref, trátala como `from-ref` y usa `HEAD` como `to-ref`. Si no se proporcionan argumentos, detecta la etiqueta anterior con `git describe --tags --abbrev=0` como `from-ref` y `HEAD` como `to-ref`.

Ejecuta:
```
git log <from-ref>..<to-ref> --pretty=format:"%H %s" --no-merges
```

También recopila referencias de PR/issue escaneando subjects en busca de `#\d+` y líneas de pie de página (`Closes`, `Fixes`, `Refs`).

Clasifica cada commit según su prefijo de Conventional Commits:
- `feat` → Características
- `fix` → Correcciones de errores
- `perf` → Rendimiento
- `refactor` → Cambios internos (omitir de notas de versión externas a menos que sean significativos)
- `docs` → Documentación
- `build` / `ci` → Infraestructura (omitir de notas de versión externas)
- Footer `BREAKING CHANGE` o sufijo `!` → Cambios de ruptura (siempre primero, siempre destacado)
- Sin clasificar → Otros cambios

Redacta las notas de versión en esta estructura:

```markdown
## [version] — YYYY-MM-DD

### Cambios de ruptura
- ...

### Características
- ...

### Correcciones de errores
- ...

### Rendimiento
- ...

### Documentación
- ...
```

Reglas:
- Reescribe los subjects de los commits en lenguaje orientado al usuario: imperativo, tiempo presente, sin jerga interna
- Agrupa commits relacionados en un solo punto cuando abordan la misma característica o corrección
- Añade referencias `(#N)` de PR/issue al final de cada punto cuando estén disponibles
- Omite commits `build`, `ci` y `chore` puros a menos que afecten la interfaz pública
- Si `to-ref` es HEAD y aún no está etiquetado, usa `[Unreleased]` como marcador de versión

Genera solo el borrador. No escribas en ningún archivo ni crees una etiqueta.
