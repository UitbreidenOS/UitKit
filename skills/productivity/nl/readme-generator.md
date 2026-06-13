---
name: readme-generator
description: "Generate complete README.md files: badges, install, usage, API reference, contributing guide, from code or description"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../readme-generator.md).

# Vaardigheid: README-Generator

## Wanneer activeren
- Een nieuw project heeft een README nodig die vanaf nul wordt geschreven
- De bestaande README is verouderd of onvolledig
- Een project wordt open-source gemaakt en heeft professionele documentatie nodig
- Er is al een README, maar installatiehandleidingen, gebruiksvoorbeelden of API-referentie ontbreekt

## Wanneer NIET gebruiken
- Interne tools die niet bedoeld zijn voor publiek gebruik
- Projecten met een bestaande documentatiewebsite (Docusaurus, MkDocs, etc.) — de README moet daar alleen naar verwijzen
- Wanneer u uitgebreide API-referentiedocumentatie nodig heeft — gebruik een geschikte documentatiegenerator (TypeDoc, Sphinx)

## Instructies

### Standaard README-structuur

```markdown
# Projectnaam

> Beschrijving in één zin van wat het project doet en voor wie het bedoeld is.

[![npm](badge)] [![license](badge)] [![ci](badge)]

## Functies (optioneel — weglaten voor eenvoudige tools)
- Kernfunctionaliteit 1
- Kernfunctionaliteit 2

## Installatie
\`\`\`bash
# Primaire installatiemethode
npm install your-package

# of
pip install your-package
\`\`\`

## Snelstart
\`\`\`language
// Minimaal werkend voorbeeld — klaar om te kopiëren en plakken
\`\`\`

## Gebruik
[Meer gedetailleerde voorbeelden die de belangrijkste gebruiksscenario's behandelen]

## API-referentie (als bibliotheek/SDK)
### `functionName(param, options)`
Beschrijving.
**Parameters:** ...
**Retourneert:** ...
**Voorbeeld:** ...

## Configuratie
[Tabel met omgevingsvariabelen of configuratie-opties]

## Bijdragen
[Één alinea + link naar CONTRIBUTING.md]

## Licentie
MIT — zie [LICENSE](LICENSE)
```

### De vaardigheid aanroepen

**Vanaf nul:**
```
/readme-generator

Project: {naam}
What it does: {één alinea}
Tech stack: {lijst}
Install method: {npm/pip/brew/binary/etc}
Key commands: {lijst}
Target audience: {developers / end-users / both}
```

**Vanuit bestaande code:**
```
/readme-generator

Read the codebase and generate a complete README.md.
Focus on: install, quick start, and API reference for exported functions.
```

**Bestaande README bijwerken:**
```
/readme-generator

Update README.md — the install instructions are outdated (now uses pnpm),
and the API reference is missing the new `createSession()` function.
```

### Badge-generatie

Claude stelt relevante badges voor vanuit shields.io:

```markdown
[![npm version](https://img.shields.io/npm/v/package-name)](https://npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/org/repo/actions)
[![Downloads](https://img.shields.io/npm/dm/package-name)](https://npmjs.com/package/package-name)
```

### Schrijfprincipes

**De eerste 3 regels zijn alles.** GitHub toont een voorbeeld — zorg dat de beschrijving en snelstart zichtbaar zijn zonder scrollen.

**Werkende voorbeelden boven beschrijvingen.** Een codeblok dat werkt, is 10 alinea's proza waard.

**De installatie moet klaar zijn om te kopiëren en plakken.** Elke stap moet letterlijk werken op een vers systeem.

**API-referentieformaat:**
```markdown
### `createUser(email, options?)`

Maakt een nieuw gebruikersaccount aan.

| Parameter | Type | Vereist | Beschrijving |
|-----------|------|---------|--------------|
| `email` | `string` | Ja | E-mailadres van de gebruiker |
| `options.role` | `'admin' \| 'user'` | Nee | Standaard: `'user'` |

**Retourneert:** `Promise<User>`

\`\`\`typescript
const user = await createUser('alice@example.com', { role: 'admin' })
\`\`\`
```

### Diepte kalibreren

| Projecttype | README-diepte |
|---|---|
| CLI-tool | Installatie + gebruik + alle vlaggen/commando's |
| npm-bibliotheek | Volledige API-referentie voor elke export |
| SaaS / webapplicatie | Functies + implementatiehandleiding + omgevingsvariabelen |
| GitHub-sjabloon | Wat te vervangen + hoe aan te passen |
| Interne tool | Installatie + belangrijkste commando's + hoe bij te dragen |

## Voorbeeld

**Invoer:**
```
Project: claudient
What it does: npm package with Claude Code skills, agents, hooks, and workflows
Install: npx claudient add all
Key commands: add, remove, list, search, init
Target audience: developers using Claude Code
```

**Verwachte uitvoer:** Volledige README met hero-beschrijving, npm/licentie/taal-badges, installatiesectie (`npx claudient add all`), CLI-referentietabel voor alle subcommando's, categorielijst, bijdragende sectie, MIT-licentievoettekst.

---
