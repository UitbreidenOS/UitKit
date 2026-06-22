# Pluginverdelingshandleiding

Deze handleiding behandelt hoe u Claudient-plugins via meerdere kanalen verspreidt: npm-register, GitHub-releases, Marketplace-indiening en versieringsstrategie.

## Overzicht

Claudient-plugins kunnen via drie primaire kanalen worden verspreid:

1. **npm-register** — Voor programmatische installatie en afhankelijkheidsbeheer
2. **GitHub Releases** — Voor directe downloads en versiebeheer
3. **Claudient Marketplace** — Voor vindbaarheid en ecosysteemintegratie

Elk kanaal dient verschillende gebruiksgevallen; de meeste uitgevers gebruiken alle drie.

---

## Deel 1: Publiceren naar het npm-register

### Vereisten

- npm-account met geverifieerd e-mailadres ([npmjs.com](https://npmjs.com))
- Twee-factorverificatie ingeschakeld (vereist voor pakketbeheer)
- `npm`-CLI lokaal geïnstalleerd (`npm --version`)
- Juiste `package.json`-configuratie

### Stap 1: package.json voorbereiden

Zorg ervoor dat de `package.json` van de wortel van uw plugin correct is geconfigureerd:

```json
{
  "name": "@claudient/plugin-uw-plugin-naam",
  "version": "1.0.0",
  "description": "Eenregelbeschrijving van plugin (max 80 tekens)",
  "main": "index.js",
  "files": [
    "skills/",
    "agents/",
    "hooks/",
    "mcp/",
    "workflows/",
    ".claude-plugin/",
    "README.md",
    "CLAUDE.md",
    "LICENSE"
  ],
  "keywords": ["claude-code", "claudient", "plugin", "domein"],
  "author": {
    "name": "Uw Naam",
    "email": "u@example.com",
    "url": "https://github.com/yourname"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Stap 2: Verdelingsbestanden voorbereiden

Voordat u publiceert, zorg ervoor dat deze bestanden bestaan:

```
uw-plugin/
├── package.json          (geconfigureerd zoals hierboven)
├── README.md            (overzicht + installatie)
├── CLAUDE.md            (plugin-principes)
├── LICENSE              (MIT of compatibel)
├── .claude-plugin/      (metagegevens)
│   └── plugin.json      (zie Deel 3)
├── .npmignore           (niet-essentiële bestanden uitsluiten)
├── skills/              (uw skills)
├── agents/              (uw agenten)
├── hooks/               (uw hooks)
└── mcp/                 (uw MCP-configuraties)
```

### Stap 3: .npmignore aanmaken

Onnodig bestanden uit het npm-pakket uitsluiten:

```
.git*
.claude/
.vscode/
node_modules/
*.test.js
*.spec.js
examples/
docs/
audit_*.py
cleanup_*.py
*.sh
.env
.env.local
development.md
```

### Stap 4: Aanmelden bij npm

```bash
npm login
# Voer gebruikersnaam, wachtwoord en OTP in wanneer erom wordt gevraagd
```

Verifieer verificatie:

```bash
npm whoami
```

### Stap 5: Publiceren naar npm

Voordat u publiceert, test lokaal:

```bash
# Pakketinhoud testen
npm pack

# Installatie simuleren
npm install ./uw-plugin-1.0.0.tgz

# Installatie verifiëren
ls node_modules/@claudient/plugin-uw-plugin-naam/
```

Publiceer naar npm:

```bash
npm publish
```

### Stap 6: Publicatie verifiëren

```bash
# Pakket controleren op npm
npm view @claudient/plugin-uw-plugin-naam

# Installatie testen
npm install @claudient/plugin-uw-plugin-naam
```

---

## Deel 2: GitHub Releases en Downloads

### Stap 1: Release-artefacten aanmaken

Verpak uw plugin voor directe download:

```bash
# Distribueerbare archief aanmaken
mkdir -p dist/
tar -czf dist/plugin-uw-plugin-naam-1.0.0.tar.gz \
  skills/ agents/ hooks/ mcp/ workflows/ \
  README.md CLAUDE.md .claude-plugin/ LICENSE

# Checksum aanmaken
shasum -a 256 dist/plugin-uw-plugin-naam-1.0.0.tar.gz > dist/CHECKSUMS.txt
```

### Stap 2: Releaseopmerkingen voorbereiden

Maak `RELEASE_NOTES.md` aan:

```markdown
# Release v1.0.0

## Wat is nieuw

- Eerste release met 5 kernvaardigheden
- 3 voorbeeldworkflows
- Volledige documentatie

## Installatie

### Via npm
\`\`\`bash
npm install @claudient/plugin-uw-plugin-naam
\`\`\`

### Via directe download
[Download plugin-uw-plugin-naam-1.0.0.tar.gz](https://github.com/yourname/plugin-repo/releases/download/v1.0.0/plugin-uw-plugin-naam-1.0.0.tar.gz)

## Breaking Changes

Geen.
```

### Stap 3: GitHub Release aanmaken

Met GitHub CLI:

```bash
# Release met conceptstatus aanmaken
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  --draft

# Artefacten uploaden
gh release upload v1.0.0 dist/plugin-uw-plugin-naam-1.0.0.tar.gz
gh release upload v1.0.0 dist/CHECKSUMS.txt

# Release publiceren
gh release edit v1.0.0 --draft=false
```

---

## Deel 3: Claudient Marketplace-indiening

### Stap 1: Marketplace-metagegevens voorbereiden

Maak `.claude-plugin/plugin.json` aan in de wortel van uw plugin:

```json
{
  "name": "Uw pluginnaam",
  "id": "uw-plugin-id",
  "version": "1.0.0",
  "description": "Eenregelbeschrijving (max 80 tekens)",
  "longDescription": "Gedetailleerde beschrijving van 2-3 zinnen.",
  "author": {
    "name": "Uw Naam",
    "email": "u@example.com",
    "type": "community"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "category": "backend",
  "tags": ["framework", "api"],
  "minClaudeCodeVersion": "1.0.0"
}
```

### Stap 2: Indienen bij Marketplace

1. **Fork** de Claudient-repository: `github.com/claudients/claudient`
2. **Maak een feature-branch aan:**
   ```bash
   git checkout -b submit/uw-plugin-naam
   ```
3. **Voeg uw plugin toe aan `plugins/`:**
   ```
   plugins/uw-plugin-naam/
   ├── .claude-plugin/plugin.json
   ├── README.md
   ├── CLAUDE.md
   └── skills/
   ```
4. **Open een PR** met volledige beschrijving
5. **Adresseer review-feedback**
6. **Samenvoegen** — Plugin verschijnt binnen 24 uur in Marketplace

---

## Deel 4: Versieringsstrategie

### Semantische Versiering (SemVer)

Volg strikt [semver.org](https://semver.org):

- **MAJOR** (X.0.0) — Breaking Changes
- **MINOR** (0.X.0) — Nieuwe achterwaarts compatibele functies
- **PATCH** (0.0.X) — Bugfixes

### Git-tags

Tag elke release:

```bash
git tag -a v1.0.0 -m "Release versie 1.0.0"
git push origin v1.0.0
```

### Changelog-onderhoud

Onderhoud `CHANGELOG.md` in de projectwortel:

```markdown
# Changelog

Alle opvallende wijzigingen zijn in dit bestand gedocumenteerd.

## [1.0.0] - 2026-06-22

### Toegevoegd
- Eerste release met 5 kernvaardigheden

### Opgelost
- Bug #45: Onjuiste parameteranalyse

### Verwijderd
- Agent-old (gebruik in plaats daarvan agent-new)
```

---

## Deel 5: Volledige verdelingschecklist

### Voor release

- [ ] `package.json`-versie bijgewerkt
- [ ] `CHANGELOG.md` bijgewerkt
- [ ] `.claude-plugin/plugin.json` bijgewerkt
- [ ] Alle skills/agenten hebben README.md-bestanden
- [ ] Voorbeelden getest en werkend
- [ ] LICENSE-bestand aanwezig (MIT/Apache 2.0/CC-BY-SA-4.0)

### npm-publicatie

- [ ] `.npmignore` geconfigureerd
- [ ] `npm login` succesvol
- [ ] `npm publish` succesvol
- [ ] `npm view` toont pakketmetagegevens
- [ ] Installatietest succesvol

### GitHub Release

- [ ] Git-tag aangemaakt (`git tag v1.0.0`)
- [ ] Release-artefacten gegenereerd (`.tar.gz`)
- [ ] Checksums gegenereerd (`CHECKSUMS.txt`)
- [ ] Releaseopmerkingen voorbereidt
- [ ] Release gepubliceerd

### Marketplace-indiening

- [ ] `.claude-plugin/plugin.json` volledig
- [ ] README.md marketplace-vriendelijk
- [ ] Fork van Claudient-repository aangemaakt
- [ ] Plugin aan `plugins/`-map toegevoegd
- [ ] PR met volledige beschrijving geopend
- [ ] PR samengevoegd

---

**Laatst bijgewerkt:** 22 juni 2026  
**Beheerder:** Claudient Core Team  
**Licentie:** CC-BY-SA-4.0
