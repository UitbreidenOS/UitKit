---
description: Genereer een CONTRIBUTING.md afgestemd op de daadwerkelijke werkstroom van deze repository
argument-hint: "[output-path]"
---
Genereer een CONTRIBUTING.md voor deze repository.

Alvorens iets te schrijven:
1. Lees de bestaande README, enige CI-configuratie (`.github/workflows/`, `Makefile`, `justfile`),
   lint/format-configuratie (`.eslintrc`, `pyproject.toml`, `.prettierrc`, enz.) en test runner
   configuratie (`jest.config.*`, `pytest.ini`, `vitest.config.*`).
2. Controleer op bestaande bijdragedocumentatie — als `CONTRIBUTING.md` al bestaat, lees deze
   eerst alvorens te overschrijven. Behoud nauwkeurige secties; vervang verouderde of ontbrekende secties.
3. Identificeer de daadwerkelijk gebruikte commando's: install, build, test, lint, format. Gebruik wat de
   repository definieert, niet generieke standaardwaarden.

Schrijf CONTRIBUTING.md met deze secties:

### Prerequisites
Exacte vereiste runtime/tool-versies (Node, Python, Go, enz.), afkomstig van `.nvmrc`,
`.python-version`, `go.mod`, of gelijkwaardig. Indien niet gevonden, vermeld dit.

### Getting Started
Clone → install → eerste run. Alleen exacte commando's. Geen "je hebt mogelijk nodig" voorbehoud.

### Development Workflow
Hoe je de dev server / watcher / REPL kunt uitvoeren. Hoe je tests en lints kunt uitvoeren. Exacte commando's.

### Making Changes
Branchnaamconventie (afleiden uit bestaande branchnamen of CI-regels indien aanwezig).
Commit-berichtformat (afleiden uit git log of commitlint-configuratie).
PR-proces: wie beoordeelt, welke controles moeten slagen, hoe je beoordeling kunt aanvragen.

### Code Style
Vat afgedwongen regels uit de linter/formatter-configuratie samen. Vermeld niet alle regels —
alleen beslissingen die een medewerker actief zou nemen (naming, bestandsstructuur, test-colocation).

### Testing Requirements
Welke testdekking wordt verwacht. Waar je nieuwe tests moet plaatsen. Hoe je slechts een subset kunt uitvoeren.

### Submitting a PR
Checklist: tests slagen, lint slaat, documenten bijgewerkt indien nodig, changelog-invoer indien van toepassing.
Link naar CI indien GitHub Actions aanwezig zijn.

Nauwkeurigheidsregels:
- Elk commando moet afkomstig zijn uit werkelijke repo-configuratie. Verzin geen scripts.
- Indien een sectie geen bewijs in de repo heeft, laat deze achterwege in plaats van een generieke aanduiding te schrijven.
- Output naar: $ARGUMENTS (standaard: `CONTRIBUTING.md` in repo root).
- Druk na het schrijven de lijst met bronbestanden af die je hebt gelezen voor de output.
