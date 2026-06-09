---
description: Generar una entrada de registro de cambios para commits desde la última etiqueta o una ref dada
argument-hint: "[from-ref]"
---
Determina el rango:
- Si se proporciona $ARGUMENTS, usa `git log $ARGUMENTS...HEAD`
- De lo contrario, ejecuta `git describe --tags --abbrev=0` para encontrar la última etiqueta, luego usa `git log <last-tag>...HEAD`
- Si no existen etiquetas, usa el historial completo: `git log HEAD`

También ejecuta `git log <range> --oneline` y `git diff <range> --stat` para la estructura.

Produce una entrada de registro de cambios en formato Keep a Changelog (https://keepachangelog.com):

```markdown
## [Unreleased] — <today's date YYYY-MM-DD>

### Added
- <new features and capabilities>

### Changed
- <modifications to existing behavior>

### Deprecated
- <features flagged for future removal>

### Removed
- <deleted features or APIs>

### Fixed
- <bug fixes>

### Security
- <vulnerability patches>
```

Reglas:
- Omite secciones que no tengan entradas
- Cada entrada ocupa una línea, escrita para un usuario final o consumidor de API — no para desarrollo interno
- Agrupa commits relacionados en una única entrada; no enumeres cada commit individualmente
- Referencia PRs o issues entre paréntesis cuando los mensajes de commit los mencionan: `(#123)`
- Las entradas comienzan con una letra mayúscula, sin punto final
- Ignora commits de chore/style/refactor a menos que afecten el comportamiento público

Devuelve solo el bloque de markdown.
