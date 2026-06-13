---
name: readme-generator
description: "Generate complete README.md files: badges, install, usage, API reference, contributing guide, from code or description"
---

> 🇩🇪 Deutsche Version. [Englische Version](../readme-generator.md).

# Skill: README-Generator

## Wann aktivieren
- Ein neues Projekt braucht ein README von Grund auf
- Das vorhandene README ist veraltet oder unvollständig
- Ein Projekt wird open-sourced und benötigt professionelle Dokumentation
- Ein README ist vorhanden, fehlt aber Installationsanweisungen, Verwendungsbeispiele oder API-Referenz

## Wann NICHT verwenden
- Interne Tools, die nicht für die öffentliche Nutzung bestimmt sind
- Projekte mit einer bestehenden Dokumentationswebsite (Docusaurus, MkDocs, etc.) — das README sollte nur dorthin verlinken
- Wenn Sie eine ausführliche API-Referenzdokumentation benötigen — verwenden Sie einen geeigneten Dokumentationsgenerator (TypeDoc, Sphinx)

## Anweisungen

### Standard-README-Struktur

```markdown
# Projektname

> Ein-Satz-Beschreibung, was das Projekt macht und für wen es gedacht ist.

[![npm](badge)] [![license](badge)] [![ci](badge)]

## Funktionen (optional — bei einfachen Tools weglassen)
- Schlüsselfähigkeit 1
- Schlüsselfähigkeit 2

## Installation
\`\`\`bash
# Primäre Installationsmethode
npm install your-package

# oder
pip install your-package
\`\`\`

## Schnellstart
\`\`\`language
// Minimales funktionierendes Beispiel — bereit zum Kopieren und Einfügen
\`\`\`

## Verwendung
[Ausführlichere Beispiele, die die wichtigsten Anwendungsfälle abdecken]

## API-Referenz (wenn Bibliothek/SDK)
### `functionName(param, options)`
Beschreibung.
**Parameter:** ...
**Rückgabe:** ...
**Beispiel:** ...

## Konfiguration
[Tabelle der Umgebungsvariablen oder Konfigurationsoptionen]

## Mitwirken
[Ein Absatz + Link zu CONTRIBUTING.md]

## Lizenz
MIT — siehe [LICENSE](LICENSE)
```

### Skill aufrufen

**Von Grund auf:**
```
/readme-generator

Project: {name}
What it does: {ein Absatz}
Tech stack: {liste}
Install method: {npm/pip/brew/binary/etc}
Key commands: {liste}
Target audience: {developers / end-users / both}
```

**Aus vorhandenem Code:**
```
/readme-generator

Read the codebase and generate a complete README.md.
Focus on: install, quick start, and API reference for exported functions.
```

**Vorhandenes README aktualisieren:**
```
/readme-generator

Update README.md — the install instructions are outdated (now uses pnpm),
and the API reference is missing the new `createSession()` function.
```

### Badge-Generierung

Claude schlägt relevante Badges von shields.io vor:

```markdown
[![npm version](https://img.shields.io/npm/v/package-name)](https://npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/org/repo/actions)
[![Downloads](https://img.shields.io/npm/dm/package-name)](https://npmjs.com/package/package-name)
```

### Schreibprinzipien

**Die ersten 3 Zeilen sind entscheidend.** GitHub zeigt eine Vorschau — machen Sie Beschreibung und Schnellstart ohne Scrollen sichtbar.

**Funktionierende Beispiele statt Beschreibungen.** Ein ausführbarer Codeblock ist 10 Prosaabsätze wert.

**Die Installation muss kopierbereit sein.** Jeder Schritt sollte auf einem frischen System wörtlich funktionieren.

**API-Referenzformat:**
```markdown
### `createUser(email, options?)`

Erstellt ein neues Benutzerkonto.

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|-----|--------------|--------------|
| `email` | `string` | Ja | E-Mail-Adresse des Benutzers |
| `options.role` | `'admin' \| 'user'` | Nein | Standard: `'user'` |

**Rückgabe:** `Promise<User>`

\`\`\`typescript
const user = await createUser('alice@example.com', { role: 'admin' })
\`\`\`
```

### Tiefe kalibrieren

| Projekttyp | README-Tiefe |
|---|---|
| CLI-Tool | Installation + Verwendung + alle Flags/Befehle |
| npm-Bibliothek | Vollständige API-Referenz für jeden Export |
| SaaS / Web-App | Funktionen + Deploy-Anleitung + Umgebungsvariablen |
| GitHub-Vorlage | Was zu ersetzen ist + wie man anpasst |
| Internes Tool | Installation + wichtige Befehle + wie man beiträgt |

## Beispiel

**Eingabe:**
```
Project: claudient
What it does: npm package with Claude Code skills, agents, hooks, and workflows
Install: npx claudient add all
Key commands: add, remove, list, search, init
Target audience: developers using Claude Code
```

**Erwartete Ausgabe:** Vollständiges README mit Hero-Beschreibung, npm/Lizenz/Sprache-Badges, Installationsabschnitt (`npx claudient add all`), CLI-Referenztabelle für alle Unterbefehle, Kategorieliste, Beitragsabschnitt, MIT-Lizenz-Fußzeile.

---
