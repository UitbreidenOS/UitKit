---
name: changelog-generator
description: "Generate Keep a Changelog entries from git log, commit history, or PR list — grouped by type with semver guidance"
---

> 🇫🇷 Version française. [English version](../changelog-generator.md).

# Compétence : Générateur de Changelog

## Quand activer
- Préparation d'une release et besoin de mettre à jour CHANGELOG.md
- Transformer une liste de commits ou de PRs en notes de version lisibles par un humain
- Auditer ce qui a changé entre deux versions
- Décider du prochain bump semver en fonction des types de changements

## Quand NE PAS utiliser
- Changelogs CI entièrement automatisés — utilisez `conventional-changelog-cli` ou `release-please` à la place
- Patchs sur un seul commit où le message de commit suffit
- Notes de développement internes qui n'ont pas besoin d'entrées publiques dans le changelog

## Instructions

### Format Keep a Changelog
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

### Recommandations semver selon le type de commit

| Type de commit | Bump semver |
|---------------|-------------|
| `fix`, `perf`, `docs`, `style`, `test`, `chore` | Patch (`1.0.X`) |
| `feat`, `refactor` | Minor (`1.X.0`) |
| Tout commit avec `BREAKING CHANGE` ou `!` (ex. `feat!:`) | Major (`X.0.0`) |

### Flux de travail

**À partir du git log :**
```bash
git log v1.1.0..HEAD --oneline --no-merges
```
Copiez la sortie et demandez à Claude de générer les entrées du changelog.

**À partir d'une plage :**
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

**Claude va :**
1. Catégoriser chaque commit en Added / Changed / Fixed / Security
2. Réécrire chaque entrée en langage orienté utilisateur (pas du jargon développeur)
3. Regrouper les entrées liées
4. Supprimer les entrées purement internes (`chore`, `style`, `test`) du changelog public
5. Recommander le bump semver et expliquer pourquoi

### Style d'écriture pour les entrées
- **Orienté utilisateur :** "Add Google login" pas "feat(auth): add OAuth2 Google login provider via passport.js"
- **Passé** pour le corps du changelog : "Fixed date picker on Safari"
- **L'impératif** est acceptable : "Fix date picker z-index on Safari"
- **Pas de détails d'implémentation** — "Improve database query performance" pas "Add btree index on orders.user_id"
- **Inclure l'impact utilisateur** pour les changements majeurs : "**Breaking:** API responses now paginate by default. Pass `?per_page=1000` to restore previous behaviour."

## Exemple

**Commits en entrée :**
```
feat(export): add CSV bulk export for orders
feat!: remove deprecated /v1/users endpoint (use /v2/users)
fix(checkout): prevent double-charge on payment retry
fix(ui): sidebar collapse animation on mobile
perf: cache user permissions in Redis
chore: upgrade Node.js to 22.x
test: add e2e tests for checkout flow
```

**Résultat attendu :**
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

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
