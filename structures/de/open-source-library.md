# Open Source Library (TypeScript) — Projektstruktur

> Für TypeScript-Bibliotheksautoren, die auf NPM veröffentlichen und den Authoring-to-Release-Workflow optimieren – von neuer Exportfunktion bis zur versionierten, größenbudgetierten Dual-Format-Veröffentlichung.

## Stack

- **Language:** TypeScript 5.x (strict mode, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- **Build:** tsup 8.x — dual ESM + CJS output, `.d.ts` generation, source maps
- **Test runner:** Vitest 2.x — unit tests, coverage via V8, inline snapshots
- **Linter/Formatter:** Biome 1.x — single tool replacing ESLint + Prettier; zero config drift
- **Versioning:** Changesets 2.x — per-PR changeset files, automated CHANGELOG.md, `npm publish`
- **CI/CD:** GitHub Actions — `ci.yml` (typecheck + lint + test on PR), `release.yml` (publish on release branch merge)
- **Dependency updates:** Renovate — grouped minor/patch PRs, major PRs individually, pin devDependencies
- **Bundle size:** size-limit 11.x — ESM and CJS budget enforced in CI; fails PR if budget exceeded
- **API docs:** TypeDoc 0.26.x — generates HTML from TSDoc comments; deployed to GitHub Pages
- **Package manager:** pnpm 9+

## Verzeichnisstruktur

```
my-ts-library/                          # Root of the published library
├── .changeset/
│   ├── config.json                     # Changesets: access, baseBranch, changelog format
│   └── README.md                       # Changeset authoring instructions (do not delete)
├── .claude/
│   ├── settings.json                   # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-export.md               # /new-export — scaffold src/ + tests/ + export in index.ts
│       ├── add-changeset.md            # /add-changeset — run pnpm changeset, fill in summary
│       ├── size-check.md               # /size-check — run size-limit and explain which exports grew
│       └── typedoc-preview.md          # /typedoc-preview — build docs and open in browser
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                      # PR gate: typecheck, biome check, vitest, size-limit
│   │   └── release.yml                 # Triggered on push to main: changesets/action publishes to NPM
│   └── renovate.json                   # Renovate config: grouped patches, major PRs separate
├── docs/
│   ├── getting-started.md              # Installation and first-use guide
│   ├── api-reference.md                # Hand-written API narrative (TypeDoc covers signatures)
│   └── migration/
│       └── v1-to-v2.md                 # Breaking change migration guide
├── examples/
│   ├── README.md                       # How to run examples
│   ├── basic-usage/
│   │   ├── package.json                # {"type":"module"} + local file: dependency
│   │   └── index.ts                    # Imports from "../dist" — tests real build output
│   ├── cjs-usage/
│   │   ├── package.json                # {"type":"commonjs"} — validates CJS export works
│   │   └── index.js
│   └── advanced/
│       ├── package.json
│       └── index.ts                    # Demonstrates complex configuration patterns
├── src/
│   ├── index.ts                        # Package entry: re-exports all public API surface
│   ├── core/
│   │   ├── index.ts                    # Re-exports for core submodule
│   │   ├── client.ts                   # Primary class / function — the main export
│   │   ├── client.types.ts             # Exported TypeScript interfaces and types
│   │   └── defaults.ts                 # Default configuration values
│   ├── utils/
│   │   ├── index.ts
│   │   ├── validation.ts               # Input validation helpers (not exported publicly)
│   │   └── formatting.ts              # String/data formatting utilities
│   ├── errors/
│   │   ├── index.ts
│   │   └── errors.ts                   # Typed error classes extending Error
│   └── internal/
│       └── symbols.ts                  # Private symbols — NOT re-exported from src/index.ts
├── tests/
│   ├── core/
│   │   ├── client.test.ts              # Unit tests mirroring src/core/client.ts
│   │   └── client.types.test-d.ts     # Type-level tests with expect-type (tsd-style)
│   ├── utils/
│   │   ├── validation.test.ts
│   │   └── formatting.test.ts
│   ├── errors/
│   │   └── errors.test.ts
│   ├── fixtures/
│   │   └── sample-data.ts              # Shared test fixtures — import in test files
│   └── integration/
│       └── roundtrip.test.ts           # End-to-end: build output consumed by real import
├── dist/                               # Built output — gitignored, published to NPM
│   ├── index.js                        # CJS entry
│   ├── index.mjs                       # ESM entry
│   ├── index.d.ts                      # Type declarations entry
│   └── ...                             # Per-file .js/.mjs/.d.ts from tsup chunking
├── typedoc-out/                        # TypeDoc HTML output — gitignored
├── .biome.json                         # Biome lint + format rules (replaces .eslintrc + .prettierrc)
├── .gitignore                          # dist/, typedoc-out/, node_modules/, coverage/
├── .npmignore                          # Exclude src/, tests/, docs/ from NPM tarball
├── tsconfig.json                       # Base: strict, target ES2022, moduleResolution bundler
├── tsconfig.build.json                 # Extends base; excludes tests/; used by tsup
├── tsup.config.ts                      # Entry: src/index.ts; format: esm+cjs; dts: true
├── vitest.config.ts                    # Coverage: v8, include: src/**, exclude: src/internal/
├── .size-limit.json                    # Budget per export: ESM <= 5kB, CJS <= 6kB (gzip)
├── typedoc.json                        # entryPoints: src/index.ts; out: typedoc-out/
├── CHANGELOG.md                        # Auto-generated by changesets — do not edit manually
├── LICENSE
├── README.md
└── package.json                        # exports map, files, engines, peerDependencies
```

## Schlüsseldateien erklärt

| Pfad | Zweck |
|---|---|
| `tsup.config.ts` | Declares `entry: ['src/index.ts']`, `format: ['esm', 'cjs']`, `dts: true`, `sourcemap: true`, `clean: true`; must mirror the `exports` map in `package.json` exactly |
| `tsconfig.build.json` | Extends `tsconfig.json`; sets `exclude: ['tests/**', 'examples/**']` so TypeDoc and tsup skip test types; never used for local IDE — only for CI and tsup |
| `.changeset/config.json` | Sets `access: "public"`, `baseBranch: "main"`, `changelog: "@changesets/cli/changelog"`; controls which packages get bumped together |
| `.size-limit.json` | Each entry sets `path`, `import` (named export to measure), `limit` in bytes; CI fails the PR if any import exceeds its budget |
| `src/index.ts` | Single source of truth for public API surface; every symbol exported here is published — everything in `src/internal/` must not appear here |
| `package.json` | Contains `exports` map with `import`/`require`/`types` conditions, `files: ["dist"]`, `engines: { "node": ">=18" }`, and `sideEffects: false` |
| `.github/workflows/release.yml` | Runs `changesets/action` with `publish: pnpm release`; creates GitHub release + NPM publish atomically when a Version PR is merged |
| `vitest.config.ts` | Sets `coverage.provider: 'v8'`, `coverage.include: ['src/**']`, `coverage.exclude: ['src/internal/**']`, `coverage.thresholds.lines: 90` |

## Schnelles Gerüst

```bash
# Prerequisites: Node 20+, pnpm 9+

mkdir my-ts-library && cd my-ts-library
pnpm init

# Install TypeScript + build tooling
pnpm add -D typescript@5 tsup@8 @types/node

# Install Biome (replaces ESLint + Prettier)
pnpm add -D @biomejs/biome
pnpm biome init

# Install Vitest + coverage
pnpm add -D vitest@2 @vitest/coverage-v8

# Install changesets
pnpm add -D @changesets/cli
pnpm changeset init

# Install size-limit
pnpm add -D size-limit @size-limit/preset-small-lib

# Install TypeDoc
pnpm add -D typedoc@0.26

# Install Renovate config (project-local)
pnpm add -D renovate

# Create source directories
mkdir -p src/core src/utils src/errors src/internal
mkdir -p tests/core tests/utils tests/errors tests/fixtures tests/integration
mkdir -p docs/migration
mkdir -p examples/basic-usage examples/cjs-usage examples/advanced
mkdir -p .changeset .claude/commands .github/workflows

# Create config files
touch tsconfig.json tsconfig.build.json tsup.config.ts vitest.config.ts
touch .biome.json .size-limit.json typedoc.json
touch .gitignore .npmignore
touch src/index.ts src/core/index.ts src/core/client.ts
touch src/core/client.types.ts src/utils/index.ts src/errors/index.ts
touch tests/core/client.test.ts tests/fixtures/sample-data.ts
touch .github/workflows/ci.yml .github/workflows/release.yml
touch .github/renovate.json

# Add dist/ and generated dirs to .gitignore
printf 'dist/\ntypedoc-out/\ncoverage/\nnode_modules/\n*.tsbuildinfo\n' >> .gitignore

# Add package.json exports map (edit manually after scaffold)
node -e "
const pkg = require('./package.json');
pkg.exports = {
  '.': {
    import: './dist/index.mjs',
    require: './dist/index.js',
    types: './dist/index.d.ts'
  }
};
pkg.files = ['dist'];
pkg.engines = { node: '>=18' };
pkg.sideEffects = false;
pkg.scripts = {
  build: 'tsup',
  dev: 'tsup --watch',
  typecheck: 'tsc --noEmit',
  lint: 'biome check .',
  'lint:fix': 'biome check --write .',
  test: 'vitest run',
  'test:watch': 'vitest',
  'test:coverage': 'vitest run --coverage',
  'size': 'size-limit',
  docs: 'typedoc',
  release: 'changeset publish'
};
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

# Create Claude Code config
touch .claude/settings.json
touch .claude/commands/new-export.md
touch .claude/commands/add-changeset.md
touch .claude/commands/size-check.md
touch .claude/commands/typedoc-preview.md

# Install Claudient skills
npx claudient add skill productivity/doc-site-builder
npx claudient add skill testing/vitest
npx claudient add skill devops-infra/cicd

echo "Open source library scaffold complete. Run: pnpm install && pnpm build"
```

## CLAUDE.md Template

```markdown
# my-ts-library

TypeScript-Bibliothek, die als Dual-ESM- + CJS-Paket auf NPM veröffentlicht wird. Die gesamte öffentliche API befindet sich in src/index.ts. Tests spiegeln die src/-Struktur unter tests/ wider. Releases werden von Changesets verwaltet – Aktualisiere package.json nie manuell.

## Stack

- TypeScript 5.x (strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess)
- tsup 8 — dual ESM + CJS build, .d.ts generation, source maps
- Vitest 2 — unit tests + V8 coverage; threshold: 90% line coverage
- Biome 1 — lint and format (replaces ESLint + Prettier; one config, one command)
- Changesets 2 — per-PR changeset files drive CHANGELOG.md and NPM publish
- size-limit 11 — bundle size budget enforced in CI
- TypeDoc 0.26 — API docs from TSDoc comments, deployed to GitHub Pages
- GitHub Actions: ci.yml (PR gate), release.yml (NPM publish on main merge)
- Renovate — automated dependency PRs (grouped minor/patch, individual major)

## Neue Exportfunktion hinzufügen – genaue Schritte

1. Erstelle die Implementierung im korrekten src/-Unterverzeichnis
   - Logik: src/core/, src/utils/, oder ein neues src/[feature]/-Verzeichnis
   - Nur Typen: zur bestehenden *.types.ts hinzufügen oder [feature].types.ts erstellen
   - Interne Helfer (nicht öffentlich): src/internal/ – NICHT von src/index.ts neu exportieren
2. Schreibe einen TSDoc-Kommentblock auf jedes exportierte Symbol (TypeDoc parst diese)
3. Füge den Export zu src/index.ts hinzu
4. Erstelle eine entsprechende Testdatei in tests/[same-path]/[filename].test.ts
5. Führe pnpm typecheck aus – behebe alle Typfehler, bevor du fortfährst
6. Führe pnpm lint:fix aus – Biome behebt die meisten Stilprobleme automatisch
7. Führe pnpm test:coverage aus – bestätige, dass die Abdeckung über 90% liegt
8. Führe pnpm build aus – bestätige, dass tsup dist/ ohne Fehler erzeugt
9. Führe pnpm size aus – bestätige, dass neue Exportfunktion im Budget liegt (bearbeite .size-limit.json, wenn du den Umfang absichtlich erhöht hast; rechtfertige es in der PR-Beschreibung)
10. Verwende den /new-export Slash Command, um die Schritte 1–4 automatisch zu gerüsten

## Changesets Release Flow

Jeder PR, der öffentliches Verhalten ändert (neue Exportfunktion, Bugfix, Breaking Change), benötigt eine Changesets-Datei. Bump-Regeln: Patch für Bugfixes, Minor für neue Features (rückwärtskompatibel), Major für Breaking Changes.

```bash
# Create changeset interactively — run this before pushing your branch
pnpm changeset

# After PRs merge to main, changesets/action creates a "Version PR"
# that bumps package.json and CHANGELOG.md. Merge that PR to publish to NPM.

# Dry-run to preview what would be published
pnpm changeset status

# Emergency manual publish (only if GitHub Actions release.yml is broken)
pnpm build && pnpm changeset publish
```

Bearbeite CHANGELOG.md nie manuell. Führe npm version nie aus oder aktualisiere package.json manuell. Die Changesets/action verwaltet es.

## Tests schreiben

- Mirror src/ layout: src/core/client.ts -> tests/core/client.test.ts
- Import only from src/ paths, never from dist/
- Use Vitest globals (describe, it, expect) — no import needed (configured in vitest.config.ts)
- Shared fixtures live in tests/fixtures/sample-data.ts — add to it, don't duplicate
- Type-level tests: tests/core/[name].test-d.ts using expectTypeOf from vitest
- Run in watch mode during development: pnpm test:watch
- Coverage must stay at or above 90% lines across src/ — CI fails otherwise

## Bundle Size Disziplin

- .size-limit.json definiert ein Budget für jede benannte Exportfunktion (gzip, ESM)
- Führe pnpm size lokal aus, bevor du einen PR mit neuem Code pushst
- Wenn eine neue Exportfunktion wirklich mehr Bytes benötigt, aktualisiere .size-limit.json und erkläre den Tradeoff in der PR-Beschreibung
- Importiere nie Third-Party-Abhängigkeiten ohne vorherige Größenprüfung: verwende bundlephobia.com oder pnpm why, um die Auswirkungen zu beurteilen
- Behalte src/internal/ für Helfer, die aus dem öffentlichen Build entfernt werden

## Beispiele ausführen

Beispiele importieren aus der lokalen dist/-Ausgabe – baue zuerst immer.

```bash
# Build the library
pnpm build

# Run ESM example
cd examples/basic-usage && pnpm install && pnpm tsx index.ts

# Run CJS example
cd examples/cjs-usage && pnpm install && node index.js

# Run advanced example
cd examples/advanced && pnpm install && pnpm tsx index.ts
```

Wenn ein Beispiel nach einem Build fehlschlägt, ist der öffentliche API-Vertrag möglicherweise gebrochen. Behandle Beispielfehler genauso wie Testfehler.

## Häufige Befehle

| Befehl | Was es macht |
|---|---|
| pnpm build | tsup: compile + emit .d.ts + source maps to dist/ |
| pnpm typecheck | tsc --noEmit against tsconfig.json (all files including tests) |
| pnpm lint | biome check . — report only |
| pnpm lint:fix | biome check --write . — apply safe auto-fixes |
| pnpm test | vitest run — single pass, no watch |
| pnpm test:coverage | vitest run --coverage — opens html report in coverage/ |
| pnpm size | size-limit — compare current build to budgets in .size-limit.json |
| pnpm docs | typedoc — write HTML to typedoc-out/ |
| pnpm changeset | Interactive: author a new changeset file in .changeset/ |
| pnpm changeset status | Preview pending version bumps and changelog entries |

## Was du nicht tun solltest

- Exportiere nie Symbole aus src/internal/ – sie sind nicht Teil der öffentlichen API
- Bearbeite CHANGELOG.md nicht oder aktualisiere package.json-Version manuell
- Commit dist/ nicht – es ist gitignored und wird vor der Veröffentlichung von CI erzeugt
- Füge Abhängigkeiten ohne Größenauswirkungsprüfung hinzu
- Verwende nicht ESLint oder Prettier – Biome verwaltet beide; das Hinzufügen beider führt zu Konflikten
- Überspringe nie, eine Changesets-Datei für einen PR zu schreiben, der src/ berührt – CI erinnert dich
```

## MCP Server

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/my-ts-library/src",
        "/Users/yourname/my-ts-library/tests"
      ]
    },
    "npm": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem"],
      "env": {
        "NPM_TOKEN": "${NPM_TOKEN}"
      }
    }
  }
}
```

## Empfohlene Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.ts && \"$f\" != *.test.ts && \"$f\" != *.test-d.ts ]]; then cd /Users/yourname/my-ts-library && npx biome check --write \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */src/index.ts ]]; then echo \"[HOOK] src/index.ts updated — run: pnpm build && pnpm size to verify exports and budget\" >&2; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"changeset publish\"; then echo \"[HOOK] Manual publish detected — confirm dist/ is fresh: run pnpm build first\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Zu installierende Skills

```bash
npx claudient add skill testing/vitest
npx claudient add skill devops-infra/cicd
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/changelog-writer
npx claudient add skill productivity/vendor-evaluator
```

## Verwandte Themen

- [TypeScript Library Guide](../guides/typescript-library.md)
- [Changesets Release Workflow](../workflows/changesets-release.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
