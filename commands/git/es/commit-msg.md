---
description: Generar un mensaje de commit conforme a Conventional Commits a partir de cambios organizados
argument-hint: "[scope]"
---
Ejecuta `git diff --cached` para obtener el diff completo de los cambios organizados. Si no hay cambios organizados, ejecuta `git diff HEAD` en su lugar y nota que los cambios no están organizados.

Analiza el diff y produce un único mensaje de commit siguiendo Conventional Commits 1.0.0:

Formato:
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

Reglas:
- Type debe ser uno de: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Subject: modo imperativo, minúsculas, sin punto, ≤72 caracteres
- Body: envuelve a 72 caracteres, explica *por qué* no *qué*, incluye la justificación de cambios disruptivos si aplica
- Footer: referencia problemas como `Fixes #N` o `Closes #N`; marca cambios disruptivos como `BREAKING CHANGE: <description>`
- Scope: usa $ARGUMENTS si se proporciona, de lo contrario infiere de las rutas de archivos cambiados o nombres de módulos

Devuelve solo el mensaje de commit final — sin preámbulo, sin cercas de código, sin explicación.

Si el diff abarca múltiples preocupaciones no relacionadas (p. ej., característica + refactorización no relacionada), señala esto explícitamente antes del mensaje y sugiere dividir el commit.
