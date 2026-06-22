# I18N Validation Report — 3 Features

**Generated:** 2026-06-22  
**Scope:** Validation of FR/DE/NL/ES translation readiness for:
1. SVG Map Inspector
2. Swarm Sandbox
3. Matrix Theme Pack

---

## Executive Summary

| Feature | Status | TR Status | Key Issues |
|---------|--------|-----------|-----------|
| **SVG Map Inspector** | ⚠️ Partial | FR ✓ DE ✓ | Hardcoded HTML strings, no RTL support, missing NL/ES |
| **Swarm Sandbox** | ⚠️ Partial | ES ✓ | Hardcoded code comments, missing FR/DE/NL |
| **Matrix Theme** | ⚠️ Not Started | None | No translations exist, hardcoded UI labels |

---

## 1. SVG Map Inspector

### File Locations
- **English:** `skills/frontend/svg-map-inspector.md`
- **Translations:** `skills/frontend/fr/svg-map-inspector.md`, `skills/frontend/de/svg-map-inspector.md`
- **Missing:** NL, ES

### Hardcoded Strings Analysis

#### ❌ CRITICAL ISSUES

**1. HTML lang attribute not dynamic (Line 169)**
```html
<html lang="en">
```
**Impact:** Inspector always renders in English locale regardless of user language.  
**Fix Required:** Pass lang attribute via i18n config or URL parameter.

**2. Hardcoded UI Labels in JavaScript (Lines 392-410)**
```javascript
<button class="toolbar-button" id="fitViewBtn" title="Fit View">Fit View</button>
<button class="toolbar-button" id="resetBtn" title="Reset">Reset</button>
<button class="toolbar-button" id="downloadBtn" title="Download">Download</button>
<div class="zoom-display" id="zoomDisplay">100%</div>
<div class="empty-state-text">
  Load an SVG map to inspect.<br>
  <small>Drag to pan • Scroll to zoom • Click to select</small>
</div>
<div class="sidebar-header">Inspector</div>
<div id="emptyInspector" style="color: #71717a; font-size: 13px;">
  Select a node to view details.
</div>
```
**Impact:** ~10 user-facing strings with no i18n abstraction.  
**Fix Required:** Extract to translations object, use i18next or similar.

**3. Dynamic innerHTML without sanitization (Lines 549, 591, 610)**
```javascript
this.metadataPanel.innerHTML = html;  // Line 549
this.metadataPanel.innerHTML = '';     // Line 591
this.svg.innerHTML = '';               // Line 610
```
**Impact:** User-generated data (node metadata) directly injected; XSS risk if mixed-language content not properly escaped.  
**Fix Required:** Use `textContent` for plain text, sanitize HTML with DOMPurify.

**4. No Unicode/Emoji handling (Line 395)**
```javascript
<div class="zoom-display" id="zoomDisplay">100%</div>
```
**Impact:** Percentage display assumes Latin numerals; Arabic/Persian/Devanagari speakers see misaligned display.  
**Fix Required:** Use `toLocaleString()` with locale-aware number formatting.

**5. Class names and attributes in English**
```javascript
data-node, data-node-id, data-node-label, data-node-type
```
**Impact:** Low—these are internal attributes, not user-visible strings. OK to leave as-is.

### RTL Readiness Assessment

**RTL Support Score: 0/5** ⚠️

- ✗ No `dir="rtl"` attribute switch based on locale
- ✗ No CSS flexbox direction inversion for sidebar (`.sidebar` uses `flex-direction: column` unconditionally)
- ✗ No margin/padding swap logic for RTL layout
- ✗ No transform calculations adjusted for right-to-left coordinates
- ✗ No cursor/interaction indicators for RTL (pan directions reversed)

**RTL Breakdown:**
- **Sidebar:** Fixed right position; needs `inset-inline-start` / `inset-inline-end` properties
- **Pan/Zoom:** Coordinates assume LTR; Arabic users experience inverted pan behavior
- **Text:** No `unicode-bidi: plaintext` or `html[dir="rtl"]` handling

### Unicode Handling

**Unicode Score: 2/5** ⚠️

- ✓ UTF-8 declared (`<meta charset="UTF-8">`)
- ✗ No Intl API usage for number/date formatting
- ✗ No locale-aware text measurement (node labels in Japanese/Arabic may overflow)
- ✗ No CJK text wrapping handling
- ✗ Cascade character string includes Japanese (`"01アイウエオ"` in matrix guide) but not localized

**Issue Example:**
```javascript
this.zoomDisplay.textContent = Math.round(this.state.zoomLevel * 100) + '%';
// Fails for Arabic numerals; renders as 100% instead of ١٠٠٪
```

### Translation File Status

| Language | File | Completeness | Updated |
|----------|------|--------------|---------|
| FR | `skills/frontend/fr/svg-map-inspector.md` | 95% (HTML markup still EN) | 2026-06-22 |
| DE | `skills/frontend/de/svg-map-inspector.md` | 95% (HTML markup still EN) | 2026-06-22 |
| NL | MISSING | — | — |
| ES | MISSING | — | — |

### Recommended Fixes

1. **Extract UI strings to i18n JSON:**
   ```json
   {
     "en": {
       "fitView": "Fit View",
       "reset": "Reset",
       "download": "Download",
       "loadMapPrompt": "Load an SVG map to inspect.",
       "dragToPan": "Drag to pan",
       "scrollToZoom": "Scroll to zoom",
       "selectNode": "Select a node to view details."
     },
     "fr": { ... },
     "de": { ... },
     "es": { ... },
     "nl": { ... }
   }
   ```

2. **Add RTL support:**
   ```javascript
   const rtlLanguages = ['ar', 'he', 'ur', 'fa'];
   if (rtlLanguages.includes(userLang)) {
     document.documentElement.dir = 'rtl';
     document.documentElement.lang = userLang;
   }
   ```

3. **Use Intl API for numbers:**
   ```javascript
   this.zoomDisplay.textContent = new Intl.NumberFormat(userLocale, {
     style: 'percent'
   }).format(this.state.zoomLevel);
   ```

4. **Sanitize innerHTML:**
   ```javascript
   import DOMPurify from 'dompurify';
   this.metadataPanel.innerHTML = DOMPurify.sanitize(html);
   ```

5. **Create NL and ES translations** (currently missing)

---

## 2. Swarm Sandbox

### File Locations
- **English:** `skills/ai-engineering/swarm-sandbox.md`
- **Translations:** `skills/ai-engineering/es/swarm-sandbox.md`
- **Missing:** FR, DE, NL

### Hardcoded Strings Analysis

#### ⚠️ MEDIUM ISSUES

**1. Code Comments in English (Throughout)**
```javascript
// Entorno de simulación simulado
const mock2AgentEnv = {
  // Agent-primary envía tarea a agent-specialist
  scenario_1: {
    name: "Standard delegation",  // ← Still English
    steps: [
```
**Impact:** English comment strings mixed with Spanish translations; inconsistent developer experience.  
**Fix Required:** Translate all inline code comments in skill documentation to target language.

**2. Example scenario names hardcoded in English (Lines 86, 116, 147)**
```javascript
"name": "Standard delegation",
"name": "Timeout recovery",
"name": "Rate limit enforcement",
```
**Impact:** Developers copying code see English field values; confusing in Spanish/French documentation.  
**Fix Required:** Translate example scenario names to match language.

**3. No environment variable localization (Line 78)**
```javascript
"metrics": ["latency_ms", "error_rate", "queue_depth", "token_usage"]
```
**Impact:** Metric label keys are English; output would require translation at runtime.  
**Fix Required:** Document that these keys should remain English (internal API), but provide translation table.

### RTL Readiness Assessment

**RTL Support Score: N/A** (Skill is API/code-focused, not UI)

- This skill is primarily code documentation and mock configuration—no HTML/CSS layout.
- RTL concerns only apply if swarm monitoring dashboards consume this output (not covered in this skill).

### Unicode Handling

**Unicode Score: 3/5** ✓ Partial

- ✓ UTF-8 implicitly supported in markdown
- ✓ Spanish translation includes proper accents (e.g., "Cuándo", "enrutamiento", "guardianes")
- ✗ Code blocks use Latin-only identifiers; fine for JavaScript but limits non-Latin developer experience
- ✗ No guidance on handling multi-language error messages in actual swarm implementation

**Example Issue:**
```markdown
## Cuándo NO usar
```
Translation is correct, but:
```javascript
// Este patrón será ejecutado
const sandbox2Agent = {
  agents: [{
    role: "orchestrator",  // ← Would need translation in actual swarm UI
  }],
```

### Translation File Status

| Language | File | Completeness | Updated |
|----------|------|--------------|---------|
| ES | `skills/ai-engineering/es/swarm-sandbox.md` | 75% (comments still EN) | 2026-06-22 |
| FR | MISSING | — | — |
| DE | MISSING | — | — |
| NL | MISSING | — | — |

### Recommended Fixes

1. **Translate all code comments** in ES file:
   ```javascript
   // CURRENT (EN)
   // Agent-primary sends task to agent-specialist
   
   // SHOULD BE (ES)
   // Agent-primary envía tarea a agent-specialist
   ```

2. **Translate example scenario names:**
   ```json
   {
     "name": "Delegación estándar",
     "name": "Recuperación de tiempo de espera",
     "name": "Cumplimiento de límite de velocidad"
   }
   ```

3. **Create FR, DE, NL translations** (currently missing)

4. **Document metric key invariants:**
   > Note: Metric keys (`latency_ms`, `error_rate`, etc.) remain in English as they are internal API contracts. Translate only the display labels in monitoring dashboards.

---

## 3. Matrix Theme Pack

### File Locations
- **English:** `guides/matrix-theme-guide.md`, `guides/matrix-theme-installation.md`, `guides/matrix-theme-edge-cases.md`
- **Translations:** NONE
- **Missing:** FR, DE, NL, ES (all)

### Hardcoded Strings Analysis

#### ❌ CRITICAL ISSUES

**1. No translated guides at all**
```
guides/
├── matrix-theme-guide.md          ✓ EN
├── matrix-theme-installation.md   ✓ EN
├── matrix-theme-edge-cases.md     ✓ EN
├── fr/                            ✗ (no matrix-theme-*.md)
├── de/                            ✗ (no matrix-theme-*.md)
├── nl/                            ✗ (no matrix-theme-*.md)
├── es/                            ✗ (no matrix-theme-*.md)
```

**2. Hardcoded terminal commands and file paths (Throughout)**
```bash
~/.claude/settings.json
~/.claude/themes/matrix-dark/
~/.zshrc
~/.bashrc
```
**Impact:** Path references are locale-agnostic (good), but surrounding explanatory text is English-only.

**3. Hardcoded configuration keys**
```json
{
  "theme": {
    "name": "matrix-dark",
    "variant": "strict",
    "colorScheme": "matrix-primary"
  }
}
```
**Impact:** Config keys are correct to leave in English (API contract), but descriptions above are not translated.

**4. Table headers and labels in English (Line 59-64)**
```markdown
| Variant | Appearance | Best for |
|---|---|---|
| `strict` | Pure green on black, no UI smoothing | Nostalgic, minimal CPU overhead |
```
**Impact:** Guide is unexplored by non-English readers; 5+ tables with English-only labels.

**5. Keybinding descriptions (Lines 501-506)**
```markdown
| `Cmd+Shift+M` | Toggle between Matrix variants | Quick theme switching |
| `Cmd+Shift+G` | Toggle glow effects | Performance optimization on demand |
```
**Impact:** User-facing descriptions entirely in English.

**6. Troubleshooting section hardcoded (Lines 550+)**
```markdown
### Colors Not Rendering Correctly

**Symptom:** Theme colors appear muted, washed out, or monochrome.
```
**Impact:** ~1,000 lines of diagnostic text untranslated.

### RTL Readiness Assessment

**RTL Support Score: 1/5** ⚠️

- ✗ JSON config uses `left`/`right` keys (no `inset-inline-*`)
- ✗ keybindings.json has no RTL support guidance
- ✗ terminal.conf examples use LTR-only directions
- ✓ Colors (green on black) are locale-neutral

**Example Issue:**
```json
// Current (LTR-only)
{
  "statusBar.foreground": "#00ff00",
  "statusBar.background": "#001100"
}

// Needs RTL alternative (if dashboards use sidebar on left for RTL)
// But this feature doesn't address it
```

### Unicode Handling

**Unicode Score: 2/5** ⚠️

- ✓ UTF-8 markdown support (implicit)
- ✗ Cascade character example uses English + Japanese (`"01アイウエオ"`) but not other scripts
- ✗ No guidance on CJK font rendering in terminal
- ✗ No mention of right-to-left terminal considerations
- ✗ bash/zsh aliases don't account for locale-specific character encoding

**Example Issue (Line 395):**
```json
{
  "effects": {
    "cascadeCharacters": "01アイウエオ"
  }
}
```
- ✓ Japanese works fine
- ✗ No Arabic/Hebrew/Devanagari variants shown
- ✗ No guidance for users to customize per locale

### Translation File Status

| Language | File | Completeness | Status |
|----------|------|--------------|--------|
| EN | guides/matrix-theme-*.md | 100% | Complete (3 files) |
| FR | guides/fr/matrix-theme-*.md | 0% | NOT STARTED |
| DE | guides/de/matrix-theme-*.md | 0% | NOT STARTED |
| NL | guides/nl/matrix-theme-*.md | 0% | NOT STARTED |
| ES | guides/es/matrix-theme-*.md | 0% | NOT STARTED |

### Recommended Fixes

1. **Create translated guide files:**
   ```
   guides/fr/matrix-theme-guide.md
   guides/fr/matrix-theme-installation.md
   guides/fr/matrix-theme-edge-cases.md
   guides/de/matrix-theme-*.md
   guides/nl/matrix-theme-*.md
   guides/es/matrix-theme-*.md
   ```

2. **Translate all table headers:**
   ```markdown
   # French example
   | Variante | Apparence | Idéal pour |
   |---|---|---|
   | `strict` | Vert pur sur noir, sans lissage UI | Nostalgique, surcharge CPU minimale |
   ```

3. **Translate keybinding table descriptions**

4. **Translate all troubleshooting sections**

5. **Add RTL guidance** (optional for v1):
   ```markdown
   > Note: Matrix Theme colors render identically in LTR and RTL terminal environments.
   > No special RTL configuration needed.
   ```

6. **Extend cascade character examples:**
   ```json
   {
     "cascadeCharacters": {
       "en": "01アイウエオ",
       "ar": "٠١٢٣٤٥",
       "he": "אבגדה",
       "de": "0123456",
       "ja": "アイウエオ"
     }
   }
   ```

---

## Summary Table

| Feature | EN | FR | DE | NL | ES | RTL | Unicode | Status |
|---------|----|----|----|----|----|----|---------|--------|
| **SVG Inspector** | ✓ | ✓* | ✓* | ✗ | ✗ | ✗ | ⚠️ | 40% Ready |
| **Swarm Sandbox** | ✓ | ✗ | ✗ | ✗ | ✓* | N/A | ✓ | 25% Ready |
| **Matrix Theme** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠️ | 20% Ready |

*Partial: Translation exists but contains hardcoded English strings (code/examples)

---

## Priority Roadmap

### Phase 1 (Critical) — Fix Existing Translations
1. **SVG Inspector:** Translate HTML markup in FR/DE; extract hardcoded UI strings
2. **Swarm Sandbox:** Translate code comments in ES version; add RTL/Unicode guidance
3. **Matrix Theme:** Begin FR/DE guide translations

### Phase 2 (High) — Add Missing Translations
1. SVG Inspector: Add NL, ES versions
2. Swarm Sandbox: Add FR, DE, NL versions
3. Matrix Theme: Complete FR, DE, NL, ES versions

### Phase 3 (Medium) — RTL & Unicode
1. SVG Inspector: Add `dir="rtl"` support, Intl API integration
2. Matrix Theme: Document RTL terminal considerations
3. All features: Audit for hardcoded strings in subsequent updates

### Phase 4 (Low) — Enhanced Localization
1. Create locale-specific examples (Arabic terminal, Japanese fonts)
2. Add right-to-left keybinding tables
3. Extend cascade character sets for all scripts

---

## Validation Checklist

Use this checklist for each feature before marking "i18n-ready":

- [ ] All user-facing strings extracted to i18n dictionary
- [ ] No hardcoded English in translated versions
- [ ] `<html lang="xx">` set correctly in HTML output
- [ ] Unicode characters render correctly (test with sample text)
- [ ] RTL layout tested in Arabic/Hebrew environments (if applicable)
- [ ] Intl API used for numbers, dates, formatting
- [ ] DOMPurify or equivalent sanitizes dynamic content
- [ ] Translations updated when English source changes
- [ ] All 4 languages (FR, DE, NL, ES) present
- [ ] QA review completed for each language

---

## Technical Debt

| Item | Feature | Severity | Effort |
|------|---------|----------|--------|
| Extract UI strings to JSON | SVG Inspector | HIGH | 2h |
| Add DOMPurify for innerHTML | SVG Inspector | MEDIUM | 1h |
| Implement Intl.NumberFormat | SVG Inspector | MEDIUM | 1h |
| Add RTL CSS variables | SVG Inspector | MEDIUM | 3h |
| Translate code comments | Swarm Sandbox | MEDIUM | 2h |
| Create FR/DE/NL translations | All 3 | HIGH | 15h |
| Translate Matrix guides | Matrix Theme | HIGH | 8h |
| Add RTL guidance | All 3 | LOW | 3h |

**Total Estimated Effort:** ~35 hours to achieve full i18n compliance (FR/DE/NL/ES + RTL + Unicode)

---

**Status:** ⚠️ **CONDITIONAL PASS** — Features are functional but lack full i18n support. Recommended for internal use; external release should wait for Phase 1 completion.
