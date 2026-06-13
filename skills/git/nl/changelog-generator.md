---
name: changelog-generator
description: "Generate Keep a Changelog entries from git log, commit history, or PR list — grouped by type with semver guidance"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../changelog-generator.md).

# Vaardigheid: Changelog-generator

## Wanneer activeren
- Een release voorbereiden en CHANGELOG.md bijwerken
- Een lijst van commits of PRs omzetten naar mensvriendelijke release-notes
- Controleren wat er is veranderd tussen twee versies
- Bepalen van de volgende semver-bump op basis van de typen wijzigingen

## Wanneer NIET gebruiken
- Volledig geautomatiseerde CI-changelogs — gebruik in plaats daarvan `conventional-changelog-cli` of `release-please`
- Enkele commit-patches waarbij het commit-bericht voldoende is
- Interne ontwikkelingsnotities die geen publieke changelog-vermeldingen nodig hebben

## Instructies

### Keep a Changelog formaat
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

### Semver-aanbevelingen op basis van commit-type

| Commit-type | Semver-bump |
|-------------|-------------|
| `fix`, `perf`, `docs`, `style`, `test`, `chore` | Patch (`1.0.X`) |
| `feat`, `refactor` | Minor (`1.X.0`) |
| Elk commit met `BREAKING CHANGE` of `!` (bijv. `feat!:`) | Major (`X.0.0`) |

### Werkstroom

**Vanuit git log:**
```bash
git log v1.1.0..HEAD --oneline --no-merges
```
Plak de uitvoer en vraag Claude om changelog-vermeldingen te genereren.

**Vanuit een bereik:**
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

**Claude zal:**
1. Elk commit categoriseren in Added / Changed / Fixed / Security
2. Elke vermelding herschrijven in gebruikersgerichte taal (geen ontwikkelaarsjargon)
3. Gerelateerde vermeldingen groeperen
4. Puur interne vermeldingen (`chore`, `style`, `test`) uit de publieke changelog verwijderen
5. De semver-bump aanbevelen en uitleggen waarom

### Schrijfstijl voor vermeldingen
- **Gebruikersgericht:** "Add Google login" niet "feat(auth): add OAuth2 Google login provider via passport.js"
- **Verleden tijd** voor de changelog-tekst: "Fixed date picker on Safari"
- **Gebiedende wijs** is acceptabel: "Fix date picker z-index on Safari"
- **Geen implementatiedetails** — "Improve database query performance" niet "Add btree index on orders.user_id"
- **Gebruikersimpact opnemen** voor breaking changes: "**Breaking:** API responses now paginate by default. Pass `?per_page=1000` to restore previous behaviour."

## Voorbeeld

**Invoer-commits:**
```
feat(export): add CSV bulk export for orders
feat!: remove deprecated /v1/users endpoint (use /v2/users)
fix(checkout): prevent double-charge on payment retry
fix(ui): sidebar collapse animation on mobile
perf: cache user permissions in Redis
chore: upgrade Node.js to 22.x
test: add e2e tests for checkout flow
```

**Verwachte uitvoer:**
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
