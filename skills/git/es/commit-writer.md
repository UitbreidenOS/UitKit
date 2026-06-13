---
name: commit-writer
description: "Write conventional commit messages from staged diff — type, scope, subject, body, breaking changes"
---

> 🇪🇸 Versión en español. [Versión en inglés](../commit-writer.md).

# Habilidad: Redacción de Mensajes de Commit

## Cuándo activar
- Tiene cambios en el área de staging y necesita un mensaje de commit bien estructurado
- Escribir mensajes de commit en un equipo que usa Conventional Commits
- Generar mensajes de commit que alimentarán changelogs automatizados
- Desea que Claude analice el diff y proponga el tipo de commit correcto

## Cuándo NO usar
- Commits de trabajo en progreso / borrador — use `git commit -m "wip"` y haga squash después
- Commits de merge — deje que git los genere
- Commits de revert — `git revert` genera el mensaje automáticamente

## Instrucciones

### Formato de Conventional Commits
```
<type>(<scope>): <subject>

[body]

[footer]
```

**Tipos:**

| Tipo | Cuándo usar |
|------|-------------|
| `feat` | Nueva función o capacidad visible para los usuarios |
| `fix` | Corrección de bug |
| `docs` | Solo documentación — sin cambio de código |
| `style` | Formato, espacios en blanco — sin cambio de lógica |
| `refactor` | Reestructuración del código sin cambio de comportamiento |
| `perf` | Mejora de rendimiento |
| `test` | Añadir o corregir tests |
| `chore` | Build, herramientas, actualizaciones de dependencias |
| `ci` | Cambios en la configuración de CI/CD |
| `revert` | Revierte un commit anterior |

**Reglas:**
- Asunto: modo imperativo, minúsculas, sin punto final, máximo 72 caracteres — "add user auth" no "Added user auth"
- Scope: opcional, entre paréntesis — el módulo, paquete, o área de archivo afectada
- Cuerpo: explique el *por qué*, no el *qué* (el diff muestra el qué)
- Cambios importantes: añada `BREAKING CHANGE:` en el footer, o `!` después del tipo (`feat!:`)

### Flujo de trabajo

Ejecute esto antes de invocar la habilidad:
```bash
git diff --staged   # ver lo que va a commitear
```

Luego pregunte a Claude:
```
Write a conventional commit message for these staged changes:

[paste git diff --staged output, or describe what changed]
```

Claude hará:
1. Identificar el tipo de cambio principal
2. Inferir el scope a partir de los archivos modificados
3. Redactar una línea de asunto (imperativo, ≤72 caracteres)
4. Añadir un cuerpo si el cambio necesita explicación
5. Marcar los cambios importantes si están presentes

### Commits con múltiples cambios
Si el diff contiene múltiples cambios lógicos, Claude ya sea:
- Escribirá un commit que cubra el cambio principal (mencionando los demás en el cuerpo)
- Sugerirá dividir en commits separados con `git add -p`

### Formato de salida
Claude produce el mensaje de commit listo para copiar y pegar:
```bash
git commit -m "feat(auth): add JWT refresh token rotation

Implement sliding session windows by rotating refresh tokens on each use.
Previous tokens are invalidated immediately after rotation.

Closes #234"
```

## Ejemplo

**El diff en staging incluye:**
- `src/auth/tokens.py` — nueva función `rotate_refresh_token()`
- `tests/test_tokens.py` — tests para la nueva función
- `CHANGELOG.md` — actualizado

**Salida esperada:**
```
feat(auth): add refresh token rotation

Rotate refresh tokens on each use to implement sliding session windows.
Previous tokens are invalidated immediately, reducing the window for
token theft after a session is compromised.

Closes #234
```

---
