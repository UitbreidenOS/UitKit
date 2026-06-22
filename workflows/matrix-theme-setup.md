# Matrix Theme Setup Workflow

End-to-end process for installing and customizing the Matrix theme across a team — from initial setup through standardization and ongoing maintenance.

---

## When to use this workflow

Use this workflow when:
- Onboarding a new team to Matrix theme
- Standardizing theme configuration across multiple developers or machines
- Deploying Matrix theme to CI/CD environments
- Setting up theme customization guidelines for the organization
- Migrating from other themes to Matrix

---

## Phase 1: Planning & Prerequisites (Day 1)

**Define theme scope:**
- [ ] Identify which applications/projects will use Matrix theme
- [ ] Determine if this is a team-wide standard or project-specific choice
- [ ] Document any custom branding or color overrides needed
- [ ] List all environments (local dev, staging, production)
- [ ] Identify team members who need access to theme configuration

**Technical prerequisites:**
- [ ] Verify Node.js version compatibility (14+ recommended)
- [ ] Confirm npm/yarn/pnpm version supports your project
- [ ] Check for any existing theme or styling frameworks to migrate from
- [ ] Review project build pipeline (webpack, Vite, esbuild config)
- [ ] Document any CSS-in-JS or styling library integration points

**Team communication:**
- [ ] Schedule a 15-minute team briefing on why Matrix theme is being adopted
- [ ] Create a shared document for tracking customizations and decisions
- [ ] Assign a theme owner (point person for maintenance and updates)

---

## Phase 2: Installation & Setup (Days 2–3)

**Install Matrix theme package:**

```bash
# Using npm
npm install @matrix/theme

# Using yarn
yarn add @matrix/theme

# Using pnpm
pnpm add @matrix/theme
```

**Verify installation:**
```bash
npm list @matrix/theme
# Should display installed version, no errors
```

**Add to project entry point (e.g., `index.js`, `App.tsx`):**
```javascript
import '@matrix/theme'
// or for CSS variables only:
import '@matrix/theme/css-variables'
```

**Configure build pipeline:**

If using Webpack:
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

If using Vite:
```javascript
export default {
  css: {
    preprocessorOptions: {
      css: {
        // Matrix theme CSS will load automatically
      }
    }
  }
}
```

**Test basic integration:**
```bash
npm run dev
# Check browser DevTools → Elements tab
# Verify Matrix theme classes are present: .matrix-*, --matrix-*
```

Create a test component to confirm theme is active:
```jsx
export function ThemeTest() {
  return (
    <div className="matrix-container">
      <h1 className="matrix-heading">Matrix Theme Active</h1>
      <p className="matrix-text">If this text appears styled, integration is successful.</p>
    </div>
  )
}
```

---

## Phase 3: Customization & Branding (Days 4–5)

**Create theme configuration file (`src/theme-config.js` or similar):**

```javascript
// theme-config.js
export const matrixThemeConfig = {
  colors: {
    primary: '#00FF00',      // Override default Matrix green
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
    unit: 8,  // Base unit in pixels
  }
}
```

**Override CSS variables in root stylesheet (`src/styles/theme-overrides.css`):**

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

/* Dark mode variant */
@media (prefers-color-scheme: dark) {
  :root {
    --matrix-background: #0a0a0a;
    --matrix-text: #00FF00;
  }
}

/* Light mode variant (if supporting both) */
@media (prefers-color-scheme: light) {
  :root {
    --matrix-background: #F5F5F5;
    --matrix-text: #004D00;
    --matrix-primary: #00AA00;
  }
}
```

**Import overrides in main entry point:**

```javascript
import '@matrix/theme'
import './styles/theme-overrides.css'
```

**Document customization decisions:**

Create `docs/THEME.md`:
```markdown
# Matrix Theme Configuration

## Color Palette
- Primary: #00FF00 (company brand green)
- Secondary: #00AA00 (secondary actions)
- Background: #000000 (matches company aesthetic)

## Typography
- Font family: Courier New, monospace
- Headings use --matrix-heading-scale: 1.2

## Spacing
- Base unit: 8px
- Use --matrix-spacing-* variables for consistency

## When to override
- Only override to align with company branding
- All overrides must be documented in this file
- Do not create custom variants without team approval

## Maintenance
- Theme owner: @[name]
- Last updated: [date]
- Review schedule: Quarterly
```

---

## Phase 4: Standardization Across Team (Days 6–7)

**Create a shared configuration package (optional but recommended for larger teams):**

```
packages/theme-config/
├── index.js              # Export theme configuration
├── colors.js             # Color palette
├── typography.js         # Font and text settings
├── spacing.js            # Spacing scale
└── README.md            # Usage documentation
```

In each project's `package.json`:
```json
{
  "dependencies": {
    "@company/theme-config": "^1.0.0",
    "@matrix/theme": "^x.x.x"
  }
}
```

In each project's entry point:
```javascript
import '@matrix/theme'
import { applyThemeConfig } from '@company/theme-config'

applyThemeConfig()
```

**Create installation checklist for new team members:**

Create `.claude/matrix-theme-checklist.md`:
```markdown
# Matrix Theme Onboarding Checklist

- [ ] Run `npm install` (installs @matrix/theme automatically)
- [ ] Verify import in `src/index.js` or `src/App.tsx`
- [ ] Run `npm run dev` and check browser console for no CSS errors
- [ ] Open DevTools → Elements and confirm Matrix classes are present
- [ ] Read `docs/THEME.md` for customization rules
- [ ] Check `.env.example` for any THEME_* variables
- [ ] Run `npm run test` to confirm theme doesn't break tests
- [ ] Ask theme owner (@[name]) to review your setup

Questions? See the theme-config package README or #design-systems Slack channel.
```

**Set up theme in CI/CD environment:**

In `.github/workflows/build.yml` (or equivalent):
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

**Document environment-specific overrides:**

Create `src/theme-env.js`:
```javascript
// Apply environment-specific theme adjustments

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
        primaryColor: '#FFFF00',  // Yellow banner for staging
        reducedMotion: false
      }
    case 'development':
    default:
      return {
        primaryColor: '#00FF00',
        reducedMotion: true  // Faster for local development
      }
  }
}
```

---

## Phase 5: Testing & Validation (Days 8–9)

**Unit tests for theme integration:**

Create `src/theme.test.js`:
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
    expect(overriddenColor).toMatch(/#[0-9A-Fa-f]{6}/) // Valid hex color
  })
})
```

**Visual regression testing (optional but recommended):**

Use Percy, Chromatic, or similar service to capture baseline screenshots.

**Accessibility audit:**

```bash
# Install accessibility checker
npm install --save-dev @axe-core/react axe-playwright

# Run audit
npm run test:a11y
```

Verify:
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus states visible with Matrix theme applied
- [ ] Keyboard navigation works
- [ ] Screen reader reads theme-styled elements correctly

**Browser compatibility testing:**

Test Matrix theme on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

Document any compatibility issues in `docs/THEME.md`.

---

## Phase 6: Team Training & Rollout (Days 10–11)

**Host a 30-minute team training session:**

Agenda:
1. Why Matrix theme (5 min) — business/UX rationale
2. How to use it (10 min) — import, customization points, override pattern
3. Common gotchas (5 min) — CSS specificity, variable naming, breakpoints
4. Q&A (10 min)

Record and share async for team members who can't attend.

**Share documentation:**
- [ ] Send link to `docs/THEME.md` in team Slack/email
- [ ] Pin checklist in relevant Slack channel
- [ ] Create a short demo video showing before/after
- [ ] Update team wiki or onboarding docs

**Deploy to all projects:**

For monorepo setup:
```bash
# Update root package.json
npm install @matrix/theme

# Install across all workspaces
npm install --workspaces
```

For multiple repositories:
```bash
# Create a script to bulk update
for repo in repo1 repo2 repo3; do
  cd $repo
  npm install @matrix/theme
  git commit -am "chore: install Matrix theme"
  git push origin feature/matrix-theme
done
```

**Create pull requests for review:**

Each PR should include:
- Theme installation and import
- Theme configuration file or reference to shared config
- Updated `docs/THEME.md` or team theme docs
- Verification that tests pass
- Link to theme checklist

Example PR description:
```markdown
## Matrix Theme Installation

Installs @matrix/theme and configures it for [project name].

### Changes
- Added @matrix/theme to dependencies
- Created src/theme-config.js with brand customization
- Updated main entry point to import theme
- Added docs/THEME.md with team standards

### Testing
- [ ] Local dev: `npm run dev` shows styled components
- [ ] Build: `npm run build` includes theme CSS
- [ ] Tests: All passing
- [ ] Accessibility: No new contrast violations

### Rollout
- [ ] Review and approve
- [ ] Merge to main
- [ ] Deploy to staging for 24h QA
- [ ] Deploy to production

See workflows/matrix-theme-setup.md for full process.
```

---

## Phase 7: Ongoing Maintenance (Weekly/Monthly)

**Weekly theme health check (5 min):**
- [ ] Monitor Slack for theme-related bugs or questions
- [ ] Check if new features integrate cleanly with Matrix theme
- [ ] Verify CI/CD pipeline still bundles theme correctly

**Monthly theme review (30 min, async):**
- [ ] Collect feedback from team in dedicated Slack thread
- [ ] Review any customizations or edge cases discovered
- [ ] Update `docs/THEME.md` with new patterns or gotchas
- [ ] Check if a newer version of @matrix/theme is available

**Quarterly theme audit (1–2 hours):**
- [ ] Run accessibility audit again across all projects
- [ ] Browser compatibility re-check
- [ ] Performance impact analysis (CSS bundle size, load time)
- [ ] Review customization compliance (no ad-hoc overrides)
- [ ] Plan any breaking upgrades to next major version

**Keep documentation current:**
```markdown
# Last Audit: [Date]
# Maintenance Owner: @[name]
# Next Review: [Date + 90 days]
```

---

## Troubleshooting Guide

**Theme CSS not loading:**
- [ ] Verify `import '@matrix/theme'` is in entry point
- [ ] Check build logs for CSS loader errors
- [ ] Ensure postcss-loader is configured if using custom variables
- [ ] Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Theme classes not appearing:**
- [ ] Check browser DevTools → Elements for `class="matrix-*"`
- [ ] Verify component markup uses correct class names (see docs)
- [ ] Check if CSS is stripped by production build (minification issue)

**Color overrides not working:**
- [ ] Verify CSS variable is set before theme import
- [ ] Check CSS specificity (Matrix theme uses `:root`, make sure overrides are also `:root`)
- [ ] Clear browser cache: Ctrl+Shift+R or Cmd+Shift+R

**Theme breaks on mobile:**
- [ ] Check if responsive breakpoints are defined
- [ ] Test media queries are not conflicting with theme styles
- [ ] Verify touch states are styled (hover won't work on mobile)

**Performance degradation:**
- [ ] Check bundle size: `npm run build:analyze`
- [ ] Look for unused theme variables in final CSS
- [ ] Consider tree-shaking if using CSS-in-JS

**Team member has outdated version:**
- [ ] Have them run `npm install @matrix/theme@latest`
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Reinstall: `rm -rf node_modules && npm install`

---

## Rollback Plan

If Matrix theme causes critical issues in production:

```bash
# Step 1: Identify issue
# [Check error logs, user reports]

# Step 2: Revert theme import
# In src/index.js, remove or comment out:
# import '@matrix/theme'

# Step 3: Verify build
npm run build

# Step 4: Test locally
npm run dev
# Confirm app works without theme

# Step 5: Deploy rollback
git commit -am "Revert: Matrix theme (temporary rollback)"
git push origin main
# Deploy to production

# Step 6: Investigate root cause
# Create GitHub issue linking to this rollback
# Assign to theme owner for diagnosis

# Step 7: Re-introduce with fix
# After root cause is fixed, re-apply theme with updated version
```

---

## Checklist: Matrix Theme Fully Deployed

- [ ] Phase 1: Planning complete, team aligned on scope
- [ ] Phase 2: Installation verified in at least one project
- [ ] Phase 3: Customizations documented in `docs/THEME.md`
- [ ] Phase 4: Shared config package created (if applicable)
- [ ] Phase 4: CI/CD pipeline tests passing with theme
- [ ] Phase 5: Accessibility audit passed (WCAG AA)
- [ ] Phase 5: Browser compatibility verified
- [ ] Phase 6: Team training completed
- [ ] Phase 6: All team projects have theme installed
- [ ] Phase 6: Theme owner assigned and Slack channel created
- [ ] Phase 7: Maintenance schedule documented
- [ ] Rollback plan tested (if in production)

---
