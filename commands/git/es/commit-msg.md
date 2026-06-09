---
description: Generar un mensaje de commit compatible con Conventional Commits a partir de cambios preparados
argument-hint: "[scope]"
---
Ejecuta `git diff --cached` para obtener el diff completo de cambios preparados. Si no hay nada preparado, ejecuta `git diff HEAD` en su lugar y nota que los cambios no están preparados.

Analiza el diff y produce un único mensaje de commit siguiendo Conventional Commits 1.0.0:

Formato:
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

Reglas:
- Type debe ser uno de: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: modo imperativo, minúscula, sin punto, ≤72 caracteres
- Body: envuelve en 72 caracteres, explica *por qué* no *qué*, incluye ratificación de cambios incompatibles si es aplicable
- Footer: referencia problemas como `Fixes #N` o `Closes #N`; marca cambios incompatibles como `BREAKING CHANGE: <description>`
- Scope: usa $ARGUMENTS si se proporciona, de lo contrario infiere desde rutas de archivos cambiados o nombres de módulos

Produce solo el mensaje de commit final — sin preámbulo, sin bloques de código, sin explicación.

Si el diff abarca múltiples preocupaciones no relacionadas (por ejemplo, feature + refactor no relacionado), señala esto explícitamente antes del mensaje y sugiere dividir el commit.
