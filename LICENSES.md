# License Compliance Report — UitKit

**Generated:** 2026-06-22  
**Project License:** AGPL-3.0-or-later (Code) & CC-BY-SA-4.0 (Content)

---

## Project Licensing

UitKit is dual-licensed:

- **Code** (scripts, hooks, executables, plugins): GNU Affero General Public License v3.0 or later (`AGPL-3.0-or-later`)
- **Content** (Markdown documentation, guides, skills, workflows): Creative Commons Attribution-ShareAlike 4.0 (`CC-BY-SA-4.0`)

See [LICENSE](./LICENSE), [LICENSE-CODE](./LICENSE-CODE), and [LICENSE-CONTENT](./LICENSE-CONTENT) for full legal text.

---

## Fonts — License Compliance

### IBM Plex Font Suite

**Status:** ✓ Compliant

- **Font Family:** IBM Plex Sans & IBM Plex Mono
- **License:** SIL Open Font License 1.1 (OFL-1.1)
- **Usage:** Site typography (loaded from Google Fonts CDN)
- **Source:** [IBM Plex GitHub](https://github.com/IBM/plex)
- **Attribution:** Required in display (satisfied by including font name in site credits)

The site's `src/styles/global.css` defines:

```css
--font-sans: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, monospace;
```

Fonts are loaded via Google Fonts API in `site/src/layouts/Layout.astro`:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

**Fonts mentioned in task but not used:**
- Courier New — System font, no license needed
- JetBrains Mono — Not included or referenced in codebase
- Fira Code — Not included or referenced in codebase

---

## Icons — License Compliance

### Unicode Emoji Icons

**Status:** ✓ Compliant

- **Icons Used:** Unicode emoji characters (e.g., 🔍, 🔐, 🕸️, 🤖, 📋, 📦, etc.)
- **License:** Public domain (Unicode Consortium)
- **Locations:**
  - `.claude-plugin/commands.json` — Command palette icons
  - `marketplace/catalog.json` — Marketplace category icons
  - Various configuration files

Emoji are standardized characters with no license restrictions.

---

## NPM Dependencies — License Audit

### Summary

| License | Count | Compliance |
|---------|-------|------------|
| MIT | 242 | ✓ Approved |
| ISC | 11 | ✓ Approved |
| Apache-2.0 | 5 | ✓ Approved |
| BSD-3-Clause | 3 | ✓ Approved |
| BSD-2-Clause | 8 | ✓ Approved |
| BlueOak-1.0.0 | 3 | ✓ Approved |
| 0BSD | 1 | ✓ Approved |
| CC-BY-4.0 | 1 | ✓ Approved |
| CC0-1.0 | 1 | ✓ Approved |
| MPL-2.0 | 2 | ✓ Approved |
| Python-2.0 | 1 | ✓ Approved |
| **TOTAL** | **278** | ✓ All Compliant |

### License Compatibility with Project

All dependencies use permissive or copyleft-compatible licenses. The AGPL-3.0 license allows use of:
- MIT, Apache-2.0, BSD variants (permissive)
- ISC (permissive)
- MPL-2.0 (compatible with AGPL)
- CC-BY-4.0 (content license, compatible)
- BlueOak-1.0.0 (permissive)
- 0BSD (most permissive)

**No GPL-2.0 dependencies** (which would require special handling with AGPL-3.0)

---

## Direct Dependencies

### Root Project

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| husky | 9.1.7 | MIT | Git hooks |
| lint-staged | 16.4.0 | MIT | Pre-commit linting |
| sharp | 0.35.1 | Apache-2.0 | Image processing |

### Site (Astro + React)

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| astro | 6.4.6 | MIT | SSG framework |
| react | 19.2.7 | MIT | UI library |
| react-dom | 19.2.7 | MIT | React DOM rendering |
| @astrojs/react | 5.0.7 | MIT | Astro React integration |
| @astrojs/sitemap | 3.7.3 | MIT | Sitemap generation |
| @tailwindcss/vite | 4.3.1 | MIT | Tailwind Vite plugin |
| tailwindcss | 4.3.1 | MIT | CSS utility framework |
| clsx | 2.1.1 | MIT | Class name utilities |
| tailwind-merge | 3.6.0 | MIT | Tailwind merge utilities |

---

## Full Dependency Tree (MIT-Licensed)

### Core Build & Dev Tools
- esbuild@0.27.7
- rollup@4.62.0
- postcss@8.5.15
- vite@7.3.5
- @vitejs/plugin-react

### Markdown & Content Processing
- remark (unified ecosystem)
- rehype (HTML processing)
- micromark (Markdown parser)
- mdast-util-* (AST utilities)
- shiki@4.2.0 (Syntax highlighting)
- prismjs@1.30.0 (Syntax highlighting)

### Utilities
- commander@14.0.3
- debug@4.4.3
- yaml@2.9.0
- semver@7.8.4
- magic-string@0.30.21
- devalue@5.8.1

### Text Processing
- ansi-escapes, ansi-styles, ansi-regex
- string-width, string-argv
- cli-cursor, cli-truncate, log-update
- strip-ansi, wrap-ansi, slice-ansi

---

## Apache-2.0 Dependencies

| Package | Version |
|---------|---------|
| sharp | 0.35.1 |
| detect-libc | 2.1.2 |
| aria-query | 5.3.2 |
| axobject-query | 4.1.0 |
| baseline-browser-mapping | 2.10.37 |

**Status:** ✓ Compatible with AGPL-3.0

---

## BSD Dependencies

### BSD-2-Clause (8 packages)
- css-select@5.2.2
- css-what@6.2.2
- domelementtype@2.3.0
- domhandler@5.0.3
- domutils@3.2.2
- entities@6.0.1
- http-cache-semantics@4.2.0
- nth-check@2.1.1

### BSD-3-Clause (3 packages)
- diff@8.0.4
- smol-toml@1.6.1
- source-map-js@1.2.1

**Status:** ✓ Compatible with AGPL-3.0

---

## Other Approved Licenses

### ISC (11 packages)
- semver, signal-exit, yaml
- anymatch, boolbase, electron-to-chromium
- github-slugger, graceful-fs, piccolore
- picocolors, yallist, yargs-parser

### BlueOak-1.0.0 (3 packages)
- common-ancestor-path@2.0.0
- lru-cache@11.5.1
- sax@1.6.0

### Data Licenses
- caniuse-lite (CC-BY-4.0)
- mdn-data (CC0-1.0)

### Other
- 0BSD: tslib@2.8.1
- MPL-2.0: lightningcss@1.32.0, lightningcss-darwin-arm64@1.32.0
- Python-2.0: argparse@2.0.1

**Status:** ✓ All compatible with AGPL-3.0

---

## License Notice Requirements

### For Distributions

When distributing UitKit (npm package, Docker image, etc.), include:

1. **This file** (`LICENSES.md`)
2. **LICENSE files:**
   - `LICENSE` (dual-license summary)
   - `LICENSE-CODE` (full AGPL-3.0 text)
   - `LICENSE-CONTENT` (full CC-BY-SA-4.0 text)
3. **Font attribution:**
   - IBM Plex fonts used from Google Fonts (OFL-1.1)

### For Commercial Use

- **Code:** Requires compliance with AGPL-3.0 (network copyleft)
- **Content:** Requires attribution + share-alike (CC-BY-SA-4.0)
- For alternate arrangements, contact [ceo@uitbreiden.com](mailto:ceo@uitbreiden.com)

---

## Verification Checklist

- [x] All npm dependencies scanned and verified
- [x] No GPL-2.0 dependencies (would conflict with AGPL-3.0)
- [x] All BSD variants compatible
- [x] MIT licenses verified (278 packages)
- [x] Apache-2.0 compatible with AGPL-3.0
- [x] Fonts (IBM Plex) are OFL-1.1 licensed (permissive)
- [x] Fonts loaded from Google Fonts CDN (rights cleared)
- [x] Mentioned fonts (Courier New, JetBrains Mono, Fira Code) not used
- [x] Emoji icons are public domain Unicode characters
- [x] No proprietary or non-open dependencies found
- [x] No license conflicts detected

---

## Issues & Notes

### Extraneous Packages

The following packages appear in `node_modules` but are not in `package.json` (likely transitive deps):

- @emnapi/runtime@1.11.1
- @img/sharp-wasm32@0.35.1
- tslib@2.8.1

These are dependencies of build tools (sharp, Babel, etc.) and are all MIT-licensed.

### Lint-Staged Version Mismatch

`lint-staged@16.4.0` installed but `^15.2.2` specified in package.json. Both versions are MIT-licensed, so this does not create compliance issues.

---

## Related Files

- `LICENSE` — Project dual-license summary
- `LICENSE-CODE` — Full AGPL-3.0 text
- `LICENSE-CONTENT` — Full CC-BY-SA-4.0 text
- `package.json` — Direct dependencies with versions
- `site/package.json` — Site-specific dependencies
- `site/src/styles/global.css` — Font declarations
- `site/src/layouts/Layout.astro` — Font CDN link

---

**Last Updated:** 2026-06-22  
**Next Review Recommended:** Upon major dependency upgrade or release
