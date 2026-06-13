> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../git.md).

# Git-regels

Kopieer de relevante secties naar de `CLAUDE.md` van je project.

---

## Commit-berichten

- Formaat: `type: korte beschrijving` (gebiedende wijs, ≤ 72 tekens)
- Typen: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`
- Voorbeelden: `feat: add webhook signature verification`, `fix: handle null user in auth middleware`
- Geen generieke berichten: "update", "changes", "fix bug", "wip" zijn niet acceptabel
- Berichttekst (optioneel): leg uit WAAROM, niet wat. De diff toont wat.

## Branches

- Feature-branches: `feat/korte-beschrijving`
- Bugfixes: `fix/korte-beschrijving`
- Commit nooit direct naar `main` of `master`
- Verwijder branches na merge

## Wat nooit te committen

- `.env`-bestanden of bestanden met secrets
- `node_modules/`, `__pycache__/`, build-artefacten
- Persoonlijke editorinstellingen (`.idea/`, `.vscode/settings.json`)
- Bestanden > 10MB (gebruik git-lfs of externe opslag)
- Gegenereerde bestanden die kunnen worden gereproduceerd vanuit bron

## Voor pushen

- Voer tests lokaal uit — push nooit rood
- Bekijk je eigen diff voor elke push: `git diff origin/main...HEAD`
- Squash WIP-commits voor push naar een gedeelde branch
- Force-push nooit naar `main` of een gedeelde branch

## Gevaarlijke commando's — bevestig altijd voor uitvoering

- `git reset --hard` — vernietigt niet-gecommitte wijzigingen permanent
- `git clean -f` — verwijdert niet-gevolgde bestanden permanent
- `git push --force` — herschrijft de externe geschiedenis
- `git stash drop` — gooit stashed wijzigingen permanent weg

---
