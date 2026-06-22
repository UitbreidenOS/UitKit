# Matrix Theme Setup Workflow

End-to-end proces voor het installeren en aanpassen van Matrix theme in het hele team — van initiële setup tot standaardisering en lopend onderhoud.

---

## Wanneer dit workflow gebruiken

Gebruik dit workflow wanneer:
- Een nieuw team onboarden naar Matrix theme
- Theme-configuratie standaardiseren over meerdere developers of machines
- Matrix theme implementeren in CI/CD-omgevingen
- Theme-aanpassingsrichtlijnen voor de organisatie instellen
- Migreren van andere themes naar Matrix

---

## Fase 1: Planning & Vereisten (Dag 1)

**Theme-scope definiëren:**
- [ ] Identificeer welke applicaties/projecten Matrix theme zullen gebruiken
- [ ] Bepaal of dit een team-breed standaard of projectspecifiek is
- [ ] Documenteer alle aangepaste branding of kleur-overrides nodig
- [ ] Vermeld alle omgevingen (lokale dev, staging, productie)
- [ ] Identificeer teamleden die toegang tot theme-configuratie nodig hebben

**Technische vereisten:**
- [ ] Controleer Node.js-versiecompatibiliteit (14+ aanbevolen)
- [ ] Bevestig npm/yarn/pnpm-versie ondersteunt uw project
- [ ] Controleer op bestaande theme- of styling-frameworks om van te migreren
- [ ] Beoordeel project-buildpipeline (webpack, Vite, esbuild config)
- [ ] Documenteer alle CSS-in-JS of styling library integratiepunten

**Team-communicatie:**
- [ ] Plan een 15-minuut team-briefing over Matrix theme adoptie
- [ ] Maak een gedeeld document aan voor het bijhouden van aanpassingen en beslissingen
- [ ] Wijs een theme-owner aan (contactpersoon voor onderhoud en updates)

---

## Fase 2: Installatie & Setup (Dagen 2-3)

**Installeer Matrix theme package:**

```bash
# Met npm
npm install @matrix/theme

# Met yarn
yarn add @matrix/theme

# Met pnpm
pnpm add @matrix/theme
```

**Controleer installatie:**
```bash
npm list @matrix/theme
# Moet geïnstalleerde versie tonen, geen fouten
```

**Voeg toe aan project entry point (b.v. `index.js`, `App.tsx`):**
```javascript
import '@matrix/theme'
// of alleen voor CSS-variabelen:
import '@matrix/theme/css-variables'
```

**Configureer build pipeline:**

Indien Webpack gebruikt:
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

Indien Vite gebruikt:
```javascript
export default {
  css: {
    preprocessorOptions: {
      css: {
        // Matrix theme CSS zal automatisch laden
      }
    }
  }
}
```

**Test basisintegratie:**
```bash
npm run dev
# Controleer browser DevTools → Elements tab
# Verifieer Matrix theme classes aanwezig: .matrix-*, --matrix-*
```

Maak een test component aan om te bevestigen dat theme actief is:
```jsx
export function ThemeTest() {
  return (
    <div className="matrix-container">
      <h1 className="matrix-heading">Matrix Theme Actief</h1>
      <p className="matrix-text">Als deze tekst geformatteerd verschijnt, is integratie geslaagd.</p>
    </div>
  )
}
```

---

## Fase 3: Aanpassing & Branding (Dagen 4-5)

**Maak theme-configuratiebestand aan (`src/theme-config.js` of soortgelijk):**

```javascript
// theme-config.js
export const matrixThemeConfig = {
  colors: {
    primary: '#00FF00',      // Matrix-groen overschrijven
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
    unit: 8,  // Basiseenheid in pixels
  }
}
```

**Override CSS-variabelen in root stylesheet (`src/styles/theme-overrides.css`):**

```css
:root {
  /* Matrix theme defaults */
  --matrix-primary: #00FF00;
  --matrix-secondary: #00AA00;
  --matrix-background: #000000;
  --matrix-text: #00FF00;
  --matrix-accent: #00DD00;
  --matrix-border-radius: 2px;
  --matrix-transition: 0.2s ease-out;
}

/* Donkere modus variant */
@media (prefers-color-scheme: dark) {
  :root {
    --matrix-background: #0a0a0a;
    --matrix-text: #00FF00;
  }
}

/* Lichte modus variant (indien beide ondersteund) */
@media (prefers-color-scheme: light) {
  :root {
    --matrix-background: #F5F5F5;
    --matrix-text: #004D00;
    --matrix-primary: #00AA00;
  }
}
```

**Importeer overrides in hoofd entry point:**

```javascript
import '@matrix/theme'
import './styles/theme-overrides.css'
```

**Documenteer aanpassingsbeslissingen:**

Maak `docs/THEME.md` aan:
```markdown
# Matrix Theme Configuratie

## Kleurenpalet
- Primair: #00FF00 (bedrijfsmerk groen)
- Secundair: #00AA00 (secundaire acties)
- Achtergrond: #000000 (komt overeen met bedrijfsesthetiek)

## Typografie
- Lettertypefamilie: Courier New, monospace
- Koppen gebruiken --matrix-heading-scale: 1.2

## Spatiëring
- Basiseenheid: 8px
- Gebruik --matrix-spacing-* variabelen voor consistentie

## Wanneer te overriden
- Override alleen voor bedrijfsmerk afstemming
- Alle overrides moeten in dit bestand gedocumenteerd worden
- Geen aangepaste varianten zonder team-goedkeuring aanmaken

## Onderhoud
- Theme-eigenaar: @[naam]
- Laatst bijgewerkt: [datum]
- Beoordelingsschema: Driemaandelijks
```

---

## Fase 4: Standaardisering in Team (Dagen 6-7)

**Maak gedeeld configuratiepackage aan (optioneel maar aanbevolen voor grotere teams):**

```
packages/theme-config/
├── index.js              # Exporteer theme-configuratie
├── colors.js             # Kleurenpalet
├── typography.js         # Lettertype- en tekstinstellingen
├── spacing.js            # Spacingschaal
└── README.md            # Gebruiksdocumentatie
```

In elk project's `package.json`:
```json
{
  "dependencies": {
    "@company/theme-config": "^1.0.0",
    "@matrix/theme": "^x.x.x"
  }
}
```

In elk project's entry point:
```javascript
import '@matrix/theme'
import { applyThemeConfig } from '@company/theme-config'

applyThemeConfig()
```

**Maak installatiechecklist voor nieuwe teamleden aan:**

Maak `.claude/matrix-theme-checklist.md` aan:
```markdown
# Matrix Theme Onboarding Checklist

- [ ] Voer `npm install` uit (installeert @matrix/theme automatisch)
- [ ] Controleer import in `src/index.js` of `src/App.tsx`
- [ ] Voer `npm run dev` uit en controleer browser console op CSS-fouten
- [ ] Open DevTools → Elements en bevestig Matrix classes aanwezig
- [ ] Lees `docs/THEME.md` voor aanpassingsregels
- [ ] Controleer `.env.example` op THEME_* variabelen
- [ ] Voer `npm run test` uit om te bevestigen dat theme tests niet breekt
- [ ] Vraag theme-eigenaar (@[naam]) je setup te controleren

Vragen? Zie theme-config package README of #design-systems Slack kanaal.
```

**Configureer theme in CI/CD omgeving:**

In `.github/workflows/build.yml` (of gelijkwaardig):
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

**Documenteer omgevingsspecifieke overrides:**

Maak `src/theme-env.js` aan:
```javascript
// Pas omgevingsspecifieke theme-aanpassingen toe

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
        primaryColor: '#FFFF00',  // Geel banner voor staging
        reducedMotion: false
      }
    case 'development':
    default:
      return {
        primaryColor: '#00FF00',
        reducedMotion: true  // Sneller voor lokale ontwikkeling
      }
  }
}
```

---

## Fase 5: Testen & Validatie (Dagen 8-9)

**Eenheidstests voor theme-integratie:**

Maak `src/theme.test.js` aan:
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
    expect(overriddenColor).toMatch(/#[0-9A-Fa-f]{6}/) // Geldige hex-kleur
  })
})
```

**Visueel regressietesten (optioneel maar aanbevolen):**

Gebruik Percy, Chromatic, of soortgelijke service om basisschermafbeeldingen vast te leggen.

**Toegankelijkheidaudit:**

```bash
# Installeer toegankelijkheidchecker
npm install --save-dev @axe-core/react axe-playwright

# Voer audit uit
npm run test:a11y
```

Controleer:
- [ ] Kleurcontrast voldoet aan WCAG AA (4.5:1 voor tekst)
- [ ] Focusstaten zichtbaar met Matrix theme toegepast
- [ ] Toetsenbordnavigatie werkt
- [ ] Schermlezer leest theme-gestijlde elementen correct

**Browsercompatibiliteitstests:**

Test Matrix theme op:
- [ ] Chrome/Chromium (nieuwste)
- [ ] Firefox (nieuwste)
- [ ] Safari (nieuwste)
- [ ] Mobiele browsers (iOS Safari, Chrome Mobile)

Documenteer compatibiliteitsproblemen in `docs/THEME.md`.

---

## Fase 6: Team Training & Rollout (Dagen 10-11)

**Organiseer 30-minuten teamtrainingssessie:**

Agenda:
1. Waarom Matrix theme (5 min) — zakelijke/UX rationale
2. Hoe te gebruiken (10 min) — import, aanpassingspunten, override patroon
3. Veelgehoorde problemen (5 min) — CSS specificiteit, variabelen naamgeving, breakpoints
4. V&A (10 min)

Neem op en deel asynchroon voor teamleden die niet kunnen deelnemen.

**Deel documentatie:**
- [ ] Stuur link naar `docs/THEME.md` via team Slack/email
- [ ] Zet checklist vast in relevant Slack kanaal
- [ ] Maak korte demo video met voor/na
- [ ] Update team wiki of onboarding docs

**Implementeer in alle projecten:**

Voor monorepo setup:
```bash
# Update root package.json
npm install @matrix/theme

# Installeer over alle workspaces
npm install --workspaces
```

Voor meerdere repositories:
```bash
# Maak script aan voor bulk update
for repo in repo1 repo2 repo3; do
  cd $repo
  npm install @matrix/theme
  git commit -am "chore: install Matrix theme"
  git push origin feature/matrix-theme
done
```

**Maak pull requests aan voor beoordeling:**

Elke PR moet bevatten:
- Theme installatie en import
- Theme configuratiebestand of referentie naar gedeelde config
- Bijgewerkte `docs/THEME.md` of team theme docs
- Verificatie dat tests slagen
- Link naar theme checklist

Voorbeeld PR beschrijving:
```markdown
## Matrix Theme Installatie

Installeert @matrix/theme en configureert deze voor [projectnaam].

### Wijzigingen
- @matrix/theme aan afhankelijkheden toegevoegd
- src/theme-config.js aangemaakt met brand aanpassing
- Hoofd entry point bijgewerkt om theme te importeren
- docs/THEME.md toegevoegd met team standaarden

### Testen
- [ ] Lokale dev: `npm run dev` toont gestijlde componenten
- [ ] Build: `npm run build` bevat theme CSS
- [ ] Tests: Allemaal geslaagd
- [ ] Toegankelijkheid: Geen nieuwe contrastverletzingen

### Rollout
- [ ] Controleer en goed
- [ ] Merge naar main
- [ ] Implementeer op staging voor 24u QA
- [ ] Implementeer in productie

Zie workflows/matrix-theme-setup.md voor volledig proces.
```

---

## Fase 7: Lopend Onderhoud (Wekelijks/Maandelijks)

**Wekelijkse theme-gezondheidscheck (5 min):**
- [ ] Monitor Slack voor theme-gerelateerde bugs of vragen
- [ ] Controleer of nieuwe functies schoon integreren met Matrix theme
- [ ] Controleer CI/CD pipeline bundelt theme nog steeds correct

**Maandelijkse theme-review (30 min, asynchroon):**
- [ ] Verzamel feedback van team in toegewijd Slack thread
- [ ] Controleer aanpassingen of grensgevallen die ontdekt zijn
- [ ] Update `docs/THEME.md` met nieuwe patronen of problemen
- [ ] Controleer of nieuwere versie van @matrix/theme beschikbaar is

**Driemaandelijkse theme-audit (1-2 uur):**
- [ ] Voer toegankelijkheidaudit opnieuw uit over alle projecten
- [ ] Browser compatibiliteit opnieuw controleren
- [ ] Performance impact analyse (CSS bundle grootte, laadtijd)
- [ ] Controleer aanpassingsnaleving (geen ad-hoc overrides)
- [ ] Plan eventuele breaking upgrades naar volgende versie

**Houd documentatie actueel:**
```markdown
# Laatste Audit: [Datum]
# Onderhoudseigenaar: @[naam]
# Volgende Review: [Datum + 90 dagen]
```

---

## Probleemoplossing Gids

**Theme CSS laadt niet:**
- [ ] Controleer `import '@matrix/theme'` in entry point
- [ ] Controleer build logs voor CSS loader fouten
- [ ] Zorg dat postcss-loader geconfigureerd is als aangepaste variabelen gebruikt
- [ ] Wis node_modules en herinstalleer: `rm -rf node_modules && npm install`

**Theme classes verschijnen niet:**
- [ ] Controleer browser DevTools → Elements voor `class="matrix-*"`
- [ ] Controleer component markup gebruikt correcte klassennamen (zie docs)
- [ ] Controleer of CSS verwijderd wordt door productie build (minificatieprobleem)

**Kleur overrides werken niet:**
- [ ] Controleer CSS variabele ingesteld vóór theme import
- [ ] Controleer CSS specificiteit (Matrix theme gebruikt `:root`, zorg dat overrides ook `:root`)
- [ ] Wis browsercache: Ctrl+Shift+R of Cmd+Shift+R

**Theme breekt op mobiel:**
- [ ] Controleer responsive breakpoints zijn gedefinieerd
- [ ] Test media queries zijn niet conflicterend met theme styles
- [ ] Controleer touch states zijn gestijld (hover werkt niet op mobiel)

**Performanceverslechtering:**
- [ ] Controleer bundle grootte: `npm run build:analyze`
- [ ] Zoek ongebruikte theme variabelen in finaal CSS
- [ ] Overweeg tree-shaking als CSS-in-JS gebruikt

**Teamlid heeft verouderde versie:**
- [ ] Laat hen `npm install @matrix/theme@latest` uitvoeren
- [ ] Wis npm cache: `npm cache clean --force`
- [ ] Herinstalleer: `rm -rf node_modules && npm install`

---

## Rollback Plan

Indien Matrix theme kritieke problemen in productie veroorzaakt:

```bash
# Stap 1: Probleem identificeren
# [Controleer error logs, gebruikersrapporten]

# Stap 2: Herzie theme import
# In src/index.js, uit commentaar of verwijder:
# import '@matrix/theme'

# Stap 3: Controleer build
npm run build

# Stap 4: Test lokaal
npm run dev
# Bevestig app werkt zonder theme

# Stap 5: Implementeer rollback
git commit -am "Revert: Matrix theme (temporary rollback)"
git push origin main
# Implementeer in productie

# Stap 6: Onderzoek onderliggende oorzaak
# Maak GitHub issue aan gekoppeld aan deze rollback
# Wijs toe aan theme-eigenaar voor diagnose

# Stap 7: Herinstalleer met fix
# Na root cause gefixt, theme opnieuw toepassen met bijgewerkte versie
```

---

## Checklist: Matrix Theme Volledig Geïmplementeerd

- [ ] Fase 1: Planning compleet, team aligned op scope
- [ ] Fase 2: Installatie geverifieerd in minstens één project
- [ ] Fase 3: Aanpassingen gedocumenteerd in `docs/THEME.md`
- [ ] Fase 4: Gedeeld configuratiepackage aangemaakt (indien van toepassing)
- [ ] Fase 4: CI/CD pipeline tests slagen met theme
- [ ] Fase 5: Toegankelijkheidaudit geslaagd (WCAG AA)
- [ ] Fase 5: Browsercompatibiliteit geverifieerd
- [ ] Fase 6: Team training voltooid
- [ ] Fase 6: Alle team projecten hebben theme geïnstalleerd
- [ ] Fase 6: Theme-eigenaar toegewezen en Slack kanaal aangemaakt
- [ ] Fase 7: Onderhoudschema gedocumenteerd
- [ ] Rollback plan getest (indien in productie)

---
