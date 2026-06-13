---
description: Genereer een changelog-invoer voor commits sinds de laatste tag of een gegeven ref
argument-hint: "[from-ref]"
---
Bepaal het bereik:
- Als $ARGUMENTS is opgegeven, gebruik `git log $ARGUMENTS...HEAD`
- Voer anders `git describe --tags --abbrev=0` uit om de laatste tag te vinden, gebruik dan `git log <last-tag>...HEAD`
- Als er geen tags bestaan, gebruik de volledige geschiedenis: `git log HEAD`

Voer ook `git log <range> --oneline` en `git diff <range> --stat` uit voor structuur.

Produceer een changelog-invoer in Keep a Changelog-formaat (https://keepachangelog.com):

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

Regels:
- Laat secties achterwege die geen invoeren hebben
- Elke invoer is één regel, geschreven voor een eindgebruiker of API-consument — niet voor interne ontwikkeling
- Groepeer gerelateerde commits in één invoer; vermeld niet elk commit afzonderlijk
- Verwijs naar PR's of issues in haakjes als commit-berichten ze noemen: `(#123)`
- Invoeren beginnen met een hoofdletter, geen punt aan het einde
- Negeer chore/style/refactor commits tenzij ze invloed hebben op openbare-facing gedrag

Voer alleen het markdown-blok uit.
