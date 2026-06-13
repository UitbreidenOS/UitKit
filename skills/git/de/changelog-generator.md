---
name: changelog-generator
description: "Generate Keep a Changelog entries from git log, commit history, or PR list — grouped by type with semver guidance"
---

> 🇩🇪 Deutsche Version. [Englische Version](../changelog-generator.md).

# Skill: Changelog-Generator

## Wann aktivieren
- Vorbereitung eines Releases und Aktualisierung von CHANGELOG.md erforderlich
- Eine Liste von Commits oder PRs in menschenlesbare Release-Notes umwandeln
- Überprüfen, was sich zwischen zwei Versionen geändert hat
- Den nächsten semver-Bump basierend auf den Änderungstypen bestimmen

## Wann NICHT verwenden
- Vollständig automatisierte CI-Changelogs — verwenden Sie stattdessen `conventional-changelog-cli` oder `release-please`
- Einzelne Commit-Patches, bei denen die Commit-Nachricht ausreicht
- Interne Entwicklungsnotizen, die keine öffentlichen Changelog-Einträge benötigen

## Anweisungen

### Keep a Changelog Format
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

### Semver-Empfehlungen nach Commit-Typ

| Commit-Typ | Semver-Bump |
|------------|-------------|
| `fix`, `perf`, `docs`, `style`, `test`, `chore` | Patch (`1.0.X`) |
| `feat`, `refactor` | Minor (`1.X.0`) |
| Jeder Commit mit `BREAKING CHANGE` oder `!` (z.B. `feat!:`) | Major (`X.0.0`) |

### Arbeitsablauf

**Aus dem git log:**
```bash
git log v1.1.0..HEAD --oneline --no-merges
```
Fügen Sie die Ausgabe ein und bitten Sie Claude, Changelog-Einträge zu generieren.

**Aus einem Bereich:**
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

**Claude wird:**
1. Jeden Commit in Added / Changed / Fixed / Security kategorisieren
2. Jeden Eintrag in benutzerorientierter Sprache neu schreiben (kein Entwicklerjargon)
3. Verwandte Einträge gruppieren
4. Nur intern relevante Einträge (`chore`, `style`, `test`) aus dem öffentlichen Changelog herausfiltern
5. Den semver-Bump empfehlen und erklären warum

### Schreibstil für Einträge
- **Benutzerorientiert:** "Add Google login" nicht "feat(auth): add OAuth2 Google login provider via passport.js"
- **Vergangenheit** für den Changelog-Text: "Fixed date picker on Safari"
- **Imperativ** ist akzeptabel: "Fix date picker z-index on Safari"
- **Keine Implementierungsdetails** — "Improve database query performance" nicht "Add btree index on orders.user_id"
- **Benutzerauswirkung einschließen** bei Breaking Changes: "**Breaking:** API responses now paginate by default. Pass `?per_page=1000` to restore previous behaviour."

## Beispiel

**Eingabe-Commits:**
```
feat(export): add CSV bulk export for orders
feat!: remove deprecated /v1/users endpoint (use /v2/users)
fix(checkout): prevent double-charge on payment retry
fix(ui): sidebar collapse animation on mobile
perf: cache user permissions in Redis
chore: upgrade Node.js to 22.x
test: add e2e tests for checkout flow
```

**Erwartete Ausgabe:**
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
