# Einrichtungs-Workflow für Matrix-Design

End-to-End-Prozess für die Installation und Anpassung des Matrix-Designs im gesamten Team — von der Ersteinrichtung bis zur Standardisierung und laufenden Wartung.

---

## Wann diesen Workflow verwenden

Verwenden Sie diesen Workflow, wenn:
- Ein neues Team auf das Matrix-Design übernimmt
- Die Design-Konfiguration über mehrere Entwickler oder Rechner hinweg standardisiert wird
- Das Matrix-Design in CI/CD-Umgebungen bereitgestellt wird
- Design-Anpassungsrichtlinien für die Organisation eingerichtet werden
- Migration von anderen Designs zu Matrix durchgeführt wird

---

## Phase 1: Planung und Voraussetzungen (Tag 1)

**Design-Umfang definieren:**
- [ ] Identifizieren, welche Anwendungen/Projekte das Matrix-Design verwenden
- [ ] Festlegen, ob dies ein Team-weiter Standard oder projektspezifisch ist
- [ ] Alle erforderlichen Branding-Anpassungen oder Farb-Overrides dokumentieren
- [ ] Alle Umgebungen auflisten (lokale Entwicklung, Staging, Produktion)
- [ ] Identifizieren, welche Mitglieder Zugriff auf die Design-Konfiguration benötigen

**Technische Voraussetzungen:**
- [ ] Node.js-Versionskompatibilität überprüfen (14+ empfohlen)
- [ ] npm/yarn/pnpm-Version für Ihr Projekt bestätigen
- [ ] Auf vorhandene Designs oder Style-Frameworks prüfen, die migriert werden sollen
- [ ] Build-Pipeline des Projekts überprüfen (webpack, Vite, esbuild-Konfiguration)
- [ ] Alle CSS-in-JS oder Style-Library-Integrationspunkte dokumentieren

**Team-Kommunikation:**
- [ ] 15-minütiges Team-Briefing zur Adoption des Matrix-Designs planen
- [ ] Gemeinsames Dokument zur Verfolgung von Anpassungen und Entscheidungen erstellen
- [ ] Design-Verantwortlichen zuweisen (Ansprechpartner für Wartung und Updates)

---

## Phase 2: Installation und Setup (Tage 2-3)

**Matrix-Design-Paket installieren:**

```bash
# Mit npm
npm install @matrix/theme

# Mit yarn
yarn add @matrix/theme

# Mit pnpm
pnpm add @matrix/theme
```

**Installation überprüfen:**
```bash
npm list @matrix/theme
# Sollte installierte Version anzeigen, keine Fehler
```

**Zum Projekteingangspoint hinzufügen (z.B. `index.js`, `App.tsx`):**
```javascript
import '@matrix/theme'
// oder nur für CSS-Variablen:
import '@matrix/theme/css-variables'
```

**Build-Pipeline konfigurieren:**

Wenn Webpack verwendet wird:
```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    }
  ]
}
```

Wenn Vite verwendet wird:
```javascript
export default {
  css: {
    preprocessorOptions: {
      css: {
        // Matrix-Design-CSS wird automatisch geladen
      }
    }
  }
}
```

**Basisintegration testen:**
```bash
npm run dev
# Browser DevTools überprüfen → Elements-Reiter
# Matrix-Design-Klassen überprüfen: .matrix-*, --matrix-*
```

Testkomponente erstellen, um zu bestätigen, dass Design aktiv ist:
```jsx
export function ThemeTest() {
  return (
    <div className="matrix-container">
      <h1 className="matrix-heading">Matrix-Design Aktiv</h1>
      <p className="matrix-text">Wenn dieser Text formatiert erscheint, ist die Integration erfolgreich.</p>
    </div>
  )
}
```

---

## Phase 3: Anpassung und Branding (Tage 4-5)

**Design-Konfigurationsdatei erstellen (`src/theme-config.js` oder ähnlich):**

```javascript
// theme-config.js
export const matrixThemeConfig = {
  colors: {
    primary: '#00FF00',      // Matrix-Grün überschreiben
    secondary: '#00AA00',
    background: '#000000',
    text: '#00FF00',
    accent: '#00DD00'
  },
  typography: {
    fontFamily: 'Courier New, monospace',
    headingScale: 1.2
  },
  spacing: {
    unit: 8,  // Basiseinheit in Pixel
  }
}
```

**CSS-Variablen in Haupt-Stylesheet überschreiben (`src/styles/theme-overrides.css`):**

```css
:root {
  /* Matrix-Design-Standardeinstellungen */
  --matrix-primary: #00FF00;
  --matrix-secondary: #00AA00;
  --matrix-background: #000000;
  --matrix-text: #00FF00;
  --matrix-accent: #00DD00;
  --matrix-border-radius: 2px;
  --matrix-transition: 0.2s ease-out;
}

/* Dunkelmodus-Variante */
@media (prefers-color-scheme: dark) {
  :root {
    --matrix-background: #0a0a0a;
    --matrix-text: #00FF00;
  }
}

/* Hellmodus-Variante (falls beide unterstützt) */
@media (prefers-color-scheme: light) {
  :root {
    --matrix-background: #F5F5F5;
    --matrix-text: #004D00;
    --matrix-primary: #00AA00;
  }
}
```

**Overrides im Haupteingangspoint importieren:**

```javascript
import '@matrix/theme'
import './styles/theme-overrides.css'
```

**Anpassungsentscheidungen dokumentieren:**

`docs/THEME.md` erstellen:
```markdown
# Matrix-Design-Konfiguration

## Farbpalette
- Primär: #00FF00 (Unternehmensmarkengrün)
- Sekundär: #00AA00 (sekundäre Aktionen)
- Hintergrund: #000000 (entspricht Unternehmensästhetik)

## Typografie
- Schriftfamilie: Courier New, monospace
- Überschriften verwenden --matrix-heading-scale: 1.2

## Abstände
- Basiseinheit: 8px
- --matrix-spacing-* Variablen für Konsistenz verwenden

## Wann sollte man überschreiben
- Nur für Markenausrichtung überschreiben
- Alle Overrides müssen in dieser Datei dokumentiert werden
- Keine benutzerdefinierten Varianten ohne Team-Genehmigung erstellen

## Wartung
- Design-Verantwortlicher: @[Name]
- Zuletzt aktualisiert: [Datum]
- Überprüfungsplan: Vierteljährlich
```

---

## Phase 4: Standardisierung im Team (Tage 6-7)

**Freigegebenes Konfigurationspaket erstellen (optional, aber für größere Teams empfohlen):**

```
packages/theme-config/
├── index.js              # Design-Konfiguration exportieren
├── colors.js             # Farbpalette
├── typography.js         # Schrift- und Texteinstellungen
├── spacing.js            # Abstands-Skala
└── README.md            # Verwendungsdokumentation
```

In jedem Projekt's `package.json`:
```json
{
  "dependencies": {
    "@company/theme-config": "^1.0.0",
    "@matrix/theme": "^x.x.x"
  }
}
```

In jedem Projekt's Eingangspoint:
```javascript
import '@matrix/theme'
import { applyThemeConfig } from '@company/theme-config'

applyThemeConfig()
```

**Installationscheckliste für neue Team-Mitglieder erstellen:**

`.claude/matrix-theme-checklist.md` erstellen:
```markdown
# Matrix-Design Onboarding-Checkliste

- [ ] `npm install` ausführen (installiert @matrix/theme automatisch)
- [ ] Import in `src/index.js` oder `src/App.tsx` überprüfen
- [ ] `npm run dev` ausführen und Browser-Konsole auf CSS-Fehler überprüfen
- [ ] DevTools → Elements öffnen und Matrix-Klassen bestätigen
- [ ] `docs/THEME.md` für Anpassungsregeln lesen
- [ ] `.env.example` auf THEME_* Variablen überprüfen
- [ ] `npm run test` ausführen, um zu bestätigen, dass Design Tests nicht bricht
- [ ] Design-Verantwortlichen (@[Name]) bitten, Setup zu überprüfen

Fragen? Siehe theme-config-Paket README oder #design-systems Slack-Kanal.
```

**Design in CI/CD-Umgebung einrichten:**

In `.github/workflows/build.yml` (oder Äquivalent):
```yaml
name: Build with Matrix Theme

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Verify theme assets bundled
        run: |
          grep -r "matrix-" dist/ || echo "Warning: No Matrix theme classes in output"
```

**Umgebungsspezifische Overrides dokumentieren:**

`src/theme-env.js` erstellen:
```javascript
// Umgebungsspezifische Design-Anpassungen anwenden

const env = process.env.NODE_ENV || 'development'

export const getEnvTheme = () => {
  switch (env) {
    case 'production':
      return {
        primaryColor: '#00FF00',
        reducedMotion: false
      }
    case 'staging':
      return {
        primaryColor: '#FFFF00',  // Gelbes Banner für Staging
        reducedMotion: false
      }
    case 'development':
    default:
      return {
        primaryColor: '#00FF00',
        reducedMotion: true  // Schneller für lokale Entwicklung
      }
  }
}
```

---

## Phase 5: Tests und Validierung (Tage 8-9)

**Einheitstests für Design-Integration:**

`src/theme.test.js` erstellen:
```javascript
describe('Matrix Theme', () => {
  it('should load theme CSS variables', () => {
    const root = document.documentElement
    const primaryColor = getComputedStyle(root).getPropertyValue('--matrix-primary').trim()
    expect(primaryColor).toBeTruthy()
  })

  it('should apply theme classes to components', () => {
    const element = document.querySelector('.matrix-container')
    expect(element).toBeTruthy()
  })

  it('should respect color overrides', () => {
    const root = document.documentElement
    const overriddenColor = getComputedStyle(root).getPropertyValue('--matrix-primary').trim()
    expect(overriddenColor).toMatch(/#[0-9A-Fa-f]{6}/) // Gültige Hex-Farbe
  })
})
```

**Visuelles Regressionstesting (optional aber empfohlen):**

Percy, Chromatic oder ähnlichen Service verwenden, um Basis-Screenshots zu erfassen.

**Barrierefreiheits-Audit:**

```bash
# Barrierefreiheitsprüfer installieren
npm install --save-dev @axe-core/react axe-playwright

# Audit ausführen
npm run test:a11y
```

Überprüfen:
- [ ] Farbkontrast erfüllt WCAG AA (4.5:1 für Text)
- [ ] Fokuszustände mit angewendetem Matrix-Design sichtbar
- [ ] Tastaturnavigation funktioniert
- [ ] Bildschirmleser liest designgestylte Elemente korrekt

**Browser-Kompatibilitätstests:**

Matrix-Design testen auf:
- [ ] Chrome/Chromium (neueste)
- [ ] Firefox (neueste)
- [ ] Safari (neueste)
- [ ] Mobile Browser (iOS Safari, Chrome Mobile)

Kompatibilitätsprobleme in `docs/THEME.md` dokumentieren.

---

## Phase 6: Team-Training und Rollout (Tage 10-11)

**30-Minütige Team-Schulungssitzung veranstalten:**

Agenda:
1. Warum Matrix-Design (5 Min) — Geschäfts-/UX-Begründung
2. Wie man es verwendet (10 Min) — Import, Anpassungspunkte, Override-Muster
3. Häufige Fallstricke (5 Min) — CSS-Spezifität, Variablenbenennung, Haltepunkte
4. F&A (10 Min)

Aufnehmen und asynchron für Team-Mitglieder teilen, die nicht teilnehmen können.

**Dokumentation teilen:**
- [ ] Link zu `docs/THEME.md` im Team-Slack/Email versenden
- [ ] Checkliste im relevanten Slack-Kanal anheften
- [ ] Kurzes Demo-Video mit Vorher/Nachher erstellen
- [ ] Team-Wiki oder Onboarding-Docs aktualisieren

**Alle Projekte bereitstellen:**

Für Monorepo-Setup:
```bash
# root package.json aktualisieren
npm install @matrix/theme

# Über alle Workspaces installieren
npm install --workspaces
```

Für mehrere Repositories:
```bash
# Skript zum Massen-Update erstellen
for repo in repo1 repo2 repo3; do
  cd $repo
  npm install @matrix/theme
  git commit -am "chore: install Matrix theme"
  git push origin feature/matrix-theme
done
```

**Pull Requests zur Überprüfung erstellen:**

Jede PR sollte enthalten:
- Design-Installation und Import
- Design-Konfigurationsdatei oder Referenz zur freigegebenen Konfiguration
- Aktualisierte `docs/THEME.md` oder Team-Design-Docs
- Überprüfung, dass Tests bestanden
- Link zur Design-Checkliste

Beispiel-PR-Beschreibung:
```markdown
## Matrix-Design Installation

Installiert @matrix/theme und konfiguriert es für [Projektname].

### Änderungen
- @matrix/theme zu Abhängigkeiten hinzugefügt
- src/theme-config.js mit Branding-Anpassung erstellt
- Haupteingangspoint zum Designimport aktualisiert
- docs/THEME.md mit Team-Standards hinzugefügt

### Tests
- [ ] Lokale Entwicklung: `npm run dev` zeigt formatierte Komponenten
- [ ] Build: `npm run build` enthält Design-CSS
- [ ] Tests: Alle bestanden
- [ ] Barrierefreiheit: Keine neuen Kontrastverletzungen

### Rollout
- [ ] Überprüfen und genehmigen
- [ ] Mit main mergen
- [ ] Zur Staging 24h für QA bereitstellen
- [ ] Zu Produktion bereitstellen

Siehe workflows/matrix-theme-setup.md für vollständigen Prozess.
```

---

## Phase 7: Laufende Wartung (Wöchentlich/Monatlich)

**Wöchentliche Design-Gesundheitsprüfung (5 Min):**
- [ ] Slack auf designbezogene Bugs oder Fragen überwachen
- [ ] Überprüfen, ob neue Funktionen ordnungsgemäß mit Matrix-Design integriert werden
- [ ] Überprüfen, dass CI/CD-Pipeline Design immer noch korrekt bündelt

**Monatliche Design-Überprüfung (30 Min, asynchron):**
- [ ] Team-Feedback in dedizierten Slack-Thread sammeln
- [ ] Alle erkannten Anpassungen oder Grenzfälle überprüfen
- [ ] `docs/THEME.md` mit neuen Mustern oder Fallstricken aktualisieren
- [ ] Überprüfen, ob eine neuere Version von @matrix/theme verfügbar ist

**Vierteljährliches Design-Audit (1-2 Stunden):**
- [ ] Barrierefreiheits-Audit erneut über alle Projekte ausführen
- [ ] Browser-Kompatibilität erneut überprüfen
- [ ] Performance-Impact-Analyse (CSS-Bundle-Größe, Ladezeit)
- [ ] Anpassungs-Compliance überprüfen (keine Ad-hoc-Overrides)
- [ ] Mögliche Breaking-Upgrades zur nächsten Hauptversion planen

**Dokumentation aktuell halten:**
```markdown
# Letztes Audit: [Datum]
# Wartungsverantwortlicher: @[Name]
# Nächste Überprüfung: [Datum + 90 Tage]
```

---

## Troubleshooting-Anleitung

**Design-CSS lädt nicht:**
- [ ] `import '@matrix/theme'` im Eingangspoint überprüfen
- [ ] Build-Logs auf CSS-Loader-Fehler überprüfen
- [ ] Überprüfen, dass postcss-loader konfiguriert ist, falls benutzerdefinierte Variablen verwendet
- [ ] node_modules löschen und neu installieren: `rm -rf node_modules && npm install`

**Design-Klassen werden nicht angezeigt:**
- [ ] Browser DevTools → Elements auf `class="matrix-*"` überprüfen
- [ ] Komponenten-Markup verwendet korrekte Klassennamen (siehe Docs)
- [ ] Überprüfen, ob CSS durch Production Build entfernt wird (Minifizierungsproblem)

**Farb-Overrides funktionieren nicht:**
- [ ] Überprüfen, dass CSS-Variable vor Design-Import gesetzt ist
- [ ] CSS-Spezifität überprüfen (Matrix-Design verwendet `:root`, Overrides sollten auch)
- [ ] Browser-Cache löschen: Ctrl+Shift+R oder Cmd+Shift+R

**Design bricht auf Mobilgeräten:**
- [ ] Überprüfen, dass Responsive Breakpoints definiert sind
- [ ] Media Queries auf Konflikt mit Design-Stilen überprüfen
- [ ] Überprüfen, dass Touch-Zustände formatiert sind (Hover funktioniert auf Mobile nicht)

**Performance-Verschlechterung:**
- [ ] Bundle-Größe überprüfen: `npm run build:analyze`
- [ ] Auf ungenutzte Design-Variablen im endgültigen CSS achten
- [ ] Tree-shaking erwägen, falls CSS-in-JS verwendet

**Team-Mitglied hat veraltete Version:**
- [ ] `npm install @matrix/theme@latest` ausführen lassen
- [ ] npm-Cache löschen: `npm cache clean --force`
- [ ] Neu installieren: `rm -rf node_modules && npm install`

---

## Rollback-Plan

Falls Matrix-Design kritische Probleme in der Produktion verursacht:

```bash
# Schritt 1: Problem identifizieren
# [Fehler-Logs überprüfen, Benutzerberichte]

# Schritt 2: Design-Import rückgängig machen
# In src/index.js auskommentieren oder entfernen:
# import '@matrix/theme'

# Schritt 3: Build überprüfen
npm run build

# Schritt 4: Lokal testen
npm run dev
# Bestätigen, dass App ohne Design funktioniert

# Schritt 5: Rollback bereitstellen
git commit -am "Revert: Matrix theme (temporary rollback)"
git push origin main
# Zur Produktion bereitstellen

# Schritt 6: Grundursache untersuchen
# GitHub-Issue zum Rollback erstellen
# Design-Verantwortlichem zur Diagnose zuweisen

# Schritt 7: Mit Behebung wieder einführen
# Nach Behebung Design mit aktualisierter Version wiedereinfügen
```

---

## Checkliste: Matrix-Design vollständig bereitgestellt

- [ ] Phase 1: Planung abgeschlossen, Team bei Umfang ausgerichtet
- [ ] Phase 2: Installation in mindestens einem Projekt überprüft
- [ ] Phase 3: Anpassungen in `docs/THEME.md` dokumentiert
- [ ] Phase 4: Freigegebenes Konfigurationspaket erstellt (falls zutreffend)
- [ ] Phase 4: CI/CD-Pipeline-Tests mit Design bestanden
- [ ] Phase 5: Barrierefreiheits-Audit bestanden (WCAG AA)
- [ ] Phase 5: Browser-Kompatibilität überprüft
- [ ] Phase 6: Team-Schulung abgeschlossen
- [ ] Phase 6: Alle Team-Projekte haben Design installiert
- [ ] Phase 6: Design-Verantwortlicher zugewiesen und Slack-Kanal erstellt
- [ ] Phase 7: Wartungsplan dokumentiert
- [ ] Rollback-Plan getestet (falls in Produktion)

---
