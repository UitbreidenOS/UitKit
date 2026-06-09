---
description: Genereer een changelog-vermelding voor commits sinds de laatste tag of een gegeven ref
argument-hint: "[from-ref]"
---
Bepaal het bereik:
- Als $ARGUMENTS is opgegeven, gebruik `git log $ARGUMENTS...HEAD`
- Voer anders `git describe --tags --abbrev=0` uit om de laatste tag te vinden, gebruik dan `git log <last-tag>...HEAD`
- Als geen tags bestaan, gebruik de volledige geschiedenis: `git log HEAD`

Voer ook `git log <range> --oneline` en `git diff <range> --stat` uit voor structuur.

Produceer een changelog-vermelding in Keep a Changelog-format (https://keepachangelog.com):

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
- Laat secties weg die geen vermeldingen hebben
- Elke vermelding is één regel, geschreven voor een eindgebruiker of API-consument — niet voor interne ontwikkeling
- Groepeer gerelateerde commits in één vermelding; vermeld niet elke commit afzonderlijk
- Verwijs naar PR's of issues tussen haakjes wanneer commit-berichten deze vermelden: `(#123)`
- Vermeldingen beginnen met een hoofdletter, geen punt op het einde
- Negeer chore/style/refactor commits tenzij zij het openbare gedrag beïnvloeden

Voer alleen het markdown-blok uit.
