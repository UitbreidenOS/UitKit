---
name: changelog-generator
description: "Generate Keep a Changelog entries from git log, commit history, or PR list — grouped by type with semver guidance"
---

> 🇪🇸 Versión en español. [Versión en inglés](../changelog-generator.md).

# Habilidad: Generador de Changelog

## Cuándo activar
- Preparando una release y necesita actualizar CHANGELOG.md
- Convertir una lista de commits o PRs en notas de versión legibles por humanos
- Auditar qué cambió entre dos versiones
- Decidir el próximo bump de semver basado en los tipos de cambios

## Cuándo NO usar
- Changelogs de CI completamente automatizados — use `conventional-changelog-cli` o `release-please` en su lugar
- Parches de un solo commit donde el mensaje de commit es suficiente
- Notas de desarrollo internas que no necesitan entradas públicas en el changelog

## Instrucciones

### Formato de Keep a Changelog
```markdown
## [Unreleased]

## [1.2.0] - 2026-05-15
### Added
- New feature descriptions (for `feat` commits)

### Changed
- Behaviour changes that aren't breaking (for `refactor`, `perf`)

### Deprecated
- Features that will be removed in a future version

### Removed
- Features removed in this version

### Fixed
- Bug fix descriptions (for `fix` commits)

### Security
- Security fix descriptions
```

### Guía de semver según el tipo de commit

| Tipo de commit | Bump semver |
|---------------|-------------|
| `fix`, `perf`, `docs`, `style`, `test`, `chore` | Patch (`1.0.X`) |
| `feat`, `refactor` | Minor (`1.X.0`) |
| Cualquier commit con `BREAKING CHANGE` o `!` (ej. `feat!:`) | Major (`X.0.0`) |

### Flujo de trabajo

**Desde git log:**
```bash
git log v1.1.0..HEAD --oneline --no-merges
```
Pegue la salida y pida a Claude que genere las entradas del changelog.

**Desde un rango:**
```
Generate CHANGELOG.md entries for version 1.3.0 from these commits:

feat(auth): add OAuth2 Google login
feat(api): add bulk export endpoint
fix(billing): correct proration calculation for mid-cycle upgrades
fix(ui): fix date picker z-index on Safari
perf(db): add index on orders.user_id
chore(deps): upgrade SQLAlchemy to 2.0.36
docs: update API reference for export endpoint

Suggest the semver bump from 1.2.0.
```

**Claude hará:**
1. Categorizar cada commit en Added / Changed / Fixed / Security
2. Reescribir cada entrada en lenguaje orientado al usuario (sin jerga de desarrollador)
3. Agrupar entradas relacionadas
4. Filtrar entradas puramente internas (`chore`, `style`, `test`) del changelog público
5. Recomendar el bump de semver y explicar por qué

### Estilo de escritura para las entradas
- **Orientado al usuario:** "Add Google login" no "feat(auth): add OAuth2 Google login provider via passport.js"
- **Tiempo pasado** para el cuerpo del changelog: "Fixed date picker on Safari"
- **Imperativo** es aceptable: "Fix date picker z-index on Safari"
- **Sin detalles de implementación** — "Improve database query performance" no "Add btree index on orders.user_id"
- **Incluir el impacto en el usuario** para breaking changes: "**Breaking:** API responses now paginate by default. Pass `?per_page=1000` to restore previous behaviour."

## Ejemplo

**Commits de entrada:**
```
feat(export): add CSV bulk export for orders
feat!: remove deprecated /v1/users endpoint (use /v2/users)
fix(checkout): prevent double-charge on payment retry
fix(ui): sidebar collapse animation on mobile
perf: cache user permissions in Redis
chore: upgrade Node.js to 22.x
test: add e2e tests for checkout flow
```

**Salida esperada:**
```markdown
## [2.0.0] - 2026-05-15

### Added
- Bulk CSV export for orders via the new `/orders/export` endpoint

### Changed
- User permissions are now cached, reducing API response times by ~40ms on average

### Removed
- **Breaking:** The deprecated `/v1/users` endpoint has been removed. Use `/v2/users` instead.

### Fixed
- Double-charge prevented when a payment retry occurs at checkout
- Sidebar collapse animation now works correctly on mobile devices

---
**Semver bump:** 1.x.x → 2.0.0 (MAJOR — breaking removal of /v1/users endpoint)
```

---
