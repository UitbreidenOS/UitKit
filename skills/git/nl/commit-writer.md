---
name: commit-writer
description: "Write conventional commit messages from staged diff — type, scope, subject, body, breaking changes"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../commit-writer.md).

# Vaardigheid: Commit-berichten schrijven

## Wanneer activeren
- U heeft gestagede wijzigingen en heeft een goed gestructureerd commit-bericht nodig
- Commit-berichten schrijven in een team dat Conventional Commits gebruikt
- Commit-berichten genereren die worden ingevoerd in geautomatiseerde changelogs
- U wilt dat Claude het diff analyseert en het juiste commit-type voorstelt

## Wanneer NIET gebruiken
- Work in progress / concept-commits — gebruik `git commit -m "wip"` en squash later
- Merge-commits — laat git deze genereren
- Revert-commits — `git revert` genereert het bericht automatisch

## Instructies

### Formaat van Conventional Commits
```
<type>(<scope>): <subject>

[body]

[footer]
```

**Types:**

| Type | Wanneer gebruiken |
|------|-------------------|
| `feat` | Nieuwe functie of mogelijkheid zichtbaar voor gebruikers |
| `fix` | Bugfix |
| `docs` | Alleen documentatie — geen codewijziging |
| `style` | Opmaak, witruimte — geen logicawijziging |
| `refactor` | Codeherstructurering zonder gedragswijziging |
| `perf` | Prestatieverbeteringen |
| `test` | Tests toevoegen of corrigeren |
| `chore` | Build, tooling, dependency-updates |
| `ci` | CI/CD-configuratiewijzigingen |
| `revert` | Maakt een vorige commit ongedaan |

**Regels:**
- Onderwerp: gebiedende wijs, kleine letters, geen punt, max. 72 tekens — "add user auth" niet "Added user auth"
- Scope: optioneel, tussen haakjes — de betreffende module, pakket of bestandsgebied
- Tekst: leg het *waarom* uit, niet het *wat* (het diff toont het wat)
- Breaking changes: voeg `BREAKING CHANGE:` toe in de footer, of `!` na het type (`feat!:`)

### Werkstroom

Voer dit uit vóór het aanroepen van de vaardigheid:
```bash
git diff --staged   # bekijk wat u gaat committen
```

Vraag Claude vervolgens:
```
Write a conventional commit message for these staged changes:

[paste git diff --staged output, or describe what changed]
```

Claude zal:
1. Het primaire wijzigingstype identificeren
2. De scope afleiden uit gewijzigde bestanden
3. Een onderwerpregel opstellen (gebiedende wijs, ≤72 tekens)
4. Een tekst toevoegen als de wijziging uitleg vereist
5. Breaking changes markeren indien aanwezig

### Commits met meerdere wijzigingen
Als het diff meerdere logische wijzigingen bevat, zal Claude ofwel:
- Één commit schrijven die de primaire wijziging dekt (andere vermelden in de tekst)
- Voorstellen te splitsen in afzonderlijke commits met `git add -p`

### Uitvoerformaat
Claude geeft het commit-bericht klaar om te kopiëren en plakken:
```bash
git commit -m "feat(auth): add JWT refresh token rotation

Implement sliding session windows by rotating refresh tokens on each use.
Previous tokens are invalidated immediately after rotation.

Closes #234"
```

## Voorbeeld

**Gestagede diff bevat:**
- `src/auth/tokens.py` — nieuwe functie `rotate_refresh_token()`
- `tests/test_tokens.py` — tests voor de nieuwe functie
- `CHANGELOG.md` — bijgewerkt

**Verwachte uitvoer:**
```
feat(auth): add refresh token rotation

Rotate refresh tokens on each use to implement sliding session windows.
Previous tokens are invalidated immediately, reducing the window for
token theft after a session is compromised.

Closes #234
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
