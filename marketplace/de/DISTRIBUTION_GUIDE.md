# Plugin-Verteilungsleitfaden

Dieser Leitfaden behandelt die Verteilung von Claudient-Plugins über mehrere Kanäle: npm-Registrierung, GitHub-Releases, Marketplace-Einreichung und Versionierungsstrategie.

## Übersicht

Claudient-Plugins können über drei primäre Kanäle verteilt werden:

1. **npm-Registrierung** — Für programmgesteuerte Installation und Abhängigkeitsverwaltung
2. **GitHub Releases** — Für direkte Downloads und Versionskontrolle
3. **Claudient Marketplace** — Für Entdeckbarkeit und Ökosystem-Integration

Jeder Kanal erfüllt unterschiedliche Anwendungsfälle; die meisten Verleger nutzen alle drei.

---

## Teil 1: Veröffentlichung in der npm-Registrierung

### Voraussetzungen

- npm-Konto mit verifizierter E-Mail ([npmjs.com](https://npmjs.com))
- Zwei-Faktor-Authentifizierung aktiviert (erforderlich für Paketverwaltung)
- `npm`-CLI lokal installiert (`npm --version`)
- Ordnungsgemäße `package.json`-Konfiguration

### Schritt 1: package.json vorbereiten

Stellen Sie sicher, dass die `package.json` der Wurzel Ihres Plugins richtig konfiguriert ist:

```json
{
  "name": "@claudient/plugin-ihr-plugin-name",
  "version": "1.0.0",
  "description": "Einzeilige Beschreibung des Plugins (max. 80 Zeichen)",
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
  "keywords": ["claude-code", "claudient", "plugin", "domain"],
  "author": {
    "name": "Ihr Name",
    "email": "sie@example.com",
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

### Schritt 2: Verteilungsdateien vorbereiten

Vor der Veröffentlichung stellen Sie sicher, dass diese Dateien vorhanden sind:

```
ihr-plugin/
├── package.json          (wie oben konfiguriert)
├── README.md            (Übersicht + Installation)
├── CLAUDE.md            (Plugin-Prinzipien)
├── LICENSE              (MIT oder kompatibel)
├── .claude-plugin/      (Metadaten)
│   └── plugin.json      (siehe Teil 3)
├── .npmignore           (nicht wesentliche Dateien ausschließen)
├── skills/              (Ihre Skills)
├── agents/              (Ihre Agenten)
├── hooks/               (Ihre Hooks)
└── mcp/                 (Ihre MCP-Konfigurationen)
```

### Schritt 3: .npmignore erstellen

Unnötige Dateien aus dem npm-Paket ausschließen:

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

### Schritt 4: Anmeldung bei npm

```bash
npm login
# Benutzername, Passwort und OTP eingeben, wenn aufgefordert
```

Authentifizierung überprüfen:

```bash
npm whoami
```

### Schritt 5: Zu npm veröffentlichen

Vor der Veröffentlichung lokal testen:

```bash
# Paketinhalt testen
npm pack

# Installation simulieren
npm install ./ihr-plugin-1.0.0.tgz

# Installation überprüfen
ls node_modules/@claudient/plugin-ihr-plugin-name/
```

Bei npm veröffentlichen:

```bash
npm publish
```

### Schritt 6: Veröffentlichung überprüfen

```bash
# Paket auf npm überprüfen
npm view @claudient/plugin-ihr-plugin-name

# Installation testen
npm install @claudient/plugin-ihr-plugin-name
```

---

## Teil 2: GitHub Releases und Downloads

### Schritt 1: Release-Artefakte erstellen

Packen Sie Ihr Plugin zum direkten Download:

```bash
# Verteilbare Archive erstellen
mkdir -p dist/
tar -czf dist/plugin-ihr-plugin-name-1.0.0.tar.gz \
  skills/ agents/ hooks/ mcp/ workflows/ \
  README.md CLAUDE.md .claude-plugin/ LICENSE

# Prüfsumme erstellen
shasum -a 256 dist/plugin-ihr-plugin-name-1.0.0.tar.gz > dist/CHECKSUMS.txt
```

### Schritt 2: Versionsinformationen vorbereiten

Erstellen Sie `RELEASE_NOTES.md`:

```markdown
# Version v1.0.0

## Was ist neu

- Erstveröffentlichung mit 5 Kernkompetenzen
- 3 Beispiel-Workflows
- Vollständige Dokumentation

## Installation

### Via npm
\`\`\`bash
npm install @claudient/plugin-ihr-plugin-name
\`\`\`

### Via direktem Download
[Download plugin-ihr-plugin-name-1.0.0.tar.gz](https://github.com/yourname/plugin-repo/releases/download/v1.0.0/plugin-ihr-plugin-name-1.0.0.tar.gz)

## Breaking Changes

Keine.
```

### Schritt 3: GitHub Release erstellen

Mit GitHub CLI:

```bash
# Release mit Entwurfsstatus erstellen
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  --draft

# Artefakte hochladen
gh release upload v1.0.0 dist/plugin-ihr-plugin-name-1.0.0.tar.gz
gh release upload v1.0.0 dist/CHECKSUMS.txt

# Release veröffentlichen
gh release edit v1.0.0 --draft=false
```

---

## Teil 3: Claudient Marketplace-Einreichung

### Schritt 1: Marketplace-Metadaten vorbereiten

Erstellen Sie `.claude-plugin/plugin.json` im Plugin-Stammverzeichnis:

```json
{
  "name": "Ihr Plugin-Name",
  "id": "ihr-plugin-id",
  "version": "1.0.0",
  "description": "Einzeilige Beschreibung (max. 80 Zeichen)",
  "longDescription": "Detaillierte Beschreibung von 2-3 Sätzen.",
  "author": {
    "name": "Ihr Name",
    "email": "sie@example.com",
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

### Schritt 2: Zum Marketplace einreichen

1. **Fork** das Claudient-Repository: `github.com/claudients/claudient`
2. **Erstelle einen Feature-Branch:**
   ```bash
   git checkout -b submit/ihr-plugin-name
   ```
3. **Fügen Sie Ihr Plugin zu `plugins/` hinzu:**
   ```
   plugins/ihr-plugin-name/
   ├── .claude-plugin/plugin.json
   ├── README.md
   ├── CLAUDE.md
   └── skills/
   ```
4. **Öffnen Sie einen PR** mit vollständiger Beschreibung
5. **Adressieren Sie Review-Feedback**
6. **Zusammenführen** — Das Plugin erscheint innerhalb von 24 Stunden im Marketplace

---

## Teil 4: Versionierungsstrategie

### Semantische Versionierung (SemVer)

Folgen Sie streng [semver.org](https://semver.org):

- **MAJOR** (X.0.0) — Breaking Changes
- **MINOR** (0.X.0) — Neue rückwärtskompatible Features
- **PATCH** (0.0.X) — Fehlerbehebungen

### Git-Tags

Markieren Sie jede Veröffentlichung:

```bash
git tag -a v1.0.0 -m "Release Version 1.0.0"
git push origin v1.0.0
```

### Änderungsprotokoll-Pflege

Verwalten Sie `CHANGELOG.md` im Projektstammverzeichnis:

```markdown
# Changelog

Alle bemerkenswerten Änderungen sind in dieser Datei dokumentiert.

## [1.0.0] - 2026-06-22

### Hinzugefügt
- Erstveröffentlichung mit 5 Kernkompetenzen

### Behoben
- Bug #45: Falsche Parameteranalyse

### Entfernt
- Agent-old (verwenden Sie stattdessen agent-new)
```

---

## Teil 5: Vollständige Verteilungs-Checkliste

### Vor Release

- [ ] `package.json`-Version aktualisiert
- [ ] `CHANGELOG.md` aktualisiert
- [ ] `.claude-plugin/plugin.json` aktualisiert
- [ ] Alle Skills/Agenten haben README.md-Dateien
- [ ] Beispiele getestet und funktionsfähig
- [ ] LICENSE-Datei vorhanden (MIT/Apache 2.0/CC-BY-SA-4.0)

### npm-Veröffentlichung

- [ ] `.npmignore` konfiguriert
- [ ] `npm login` erfolgreich
- [ ] `npm publish` erfolgreich
- [ ] `npm view` zeigt Paketmetadaten
- [ ] Installationstest erfolgreich

### GitHub Release

- [ ] Git-Tag erstellt (`git tag v1.0.0`)
- [ ] Release-Artefakte generiert (`.tar.gz`)
- [ ] Prüfsummen generiert (`CHECKSUMS.txt`)
- [ ] Versionsinformationen vorbereitet
- [ ] Release veröffentlicht

### Marketplace-Einreichung

- [ ] `.claude-plugin/plugin.json` vollständig
- [ ] README.md marketplace-freundlich
- [ ] Fork des Claudient-Repository erstellt
- [ ] Plugin zum `plugins/`-Verzeichnis hinzugefügt
- [ ] PR mit vollständiger Beschreibung geöffnet
- [ ] PR zusammengeführt

---

**Zuletzt aktualisiert:** 22. Juni 2026  
**Verwalter:** Claudient Core Team  
**Lizenz:** CC-BY-SA-4.0
