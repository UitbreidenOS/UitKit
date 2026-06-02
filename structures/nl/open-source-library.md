# Open Source Bibliotheek (TypeScript) — Projectstructuur

> Voor TypeScript-bibliotheekauteurs die naar NPM publiceren, waarbij de workflow van ontwerp tot release wordt geoptimaliseerd, van nieuwe export tot versioned, groottebegrote, dual-format publicatie.

## Stack

- **Taal:** TypeScript 5.x (strict mode, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- **Build:** tsup 8.x — dual ESM + CJS output, `.d.ts` generation, source maps
- **Test runner:** Vitest 2.x — unit tests, coverage via V8, inline snapshots
- **Linter/Formatter:** Biome 1.x — single tool replacing ESLint + Prettier; zero config drift
- **Versioning:** Changesets 2.x — per-PR changeset files, automated CHANGELOG.md, `npm publish`
- **CI/CD:** GitHub Actions — `ci.yml` (typecheck + lint + test on PR), `release.yml` (publish on release branch merge)
- **Dependency updates:** Renovate — grouped minor/patch PRs, major PRs individually, pin devDependencies
- **Bundle size:** size-limit 11.x — ESM and CJS budget enforced in CI; fails PR if budget exceeded
- **API docs:** TypeDoc 0.26.x — generates HTML from TSDoc comments; deployed to GitHub Pages
- **Package manager:** pnpm 9+

## Directorystructuur

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

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `tsup.config.ts` | Declares `entry: ['src/index.ts']`, `format: ['esm', 'cjs']`, `dts: true`, `sourcemap: true`, `clean: true`; moet exact overeenkomen met de `exports` kaart in `package.json` |
| `tsconfig.build.json` | Extends `tsconfig.json`; sets `exclude: ['tests/**', 'examples/**']` zodat TypeDoc en tsup testtypen overslaan; wordt nooit gebruikt voor lokale IDE — alleen voor CI en tsup |
| `.changeset/config.json` | Sets `access: "public"`, `baseBranch: "main"`, `changelog: "@changesets/cli/changelog"`; bepaalt welke pakketten samen worden bijgewerkt |
| `.size-limit.json` | Elk item stelt `path`, `import` (benoemde export om te meten), `limit` in bytes in; CI faalt de PR als een export zijn budget overschrijdt |
| `src/index.ts` | Enige bron van waarheid voor openbare API-oppervlak; elk symbool dat hier wordt geëxporteerd, wordt gepubliceerd — alles in `src/internal/` mag hier niet verschijnen |
| `package.json` | Bevat `exports` kaart met `import`/`require`/`types` voorwaarden, `files: ["dist"]`, `engines: { "node": ">=18" }`, en `sideEffects: false` |
| `.github/workflows/release.yml` | Voert `changesets/action` uit met `publish: pnpm release`; creert GitHub-release + NPM-publicatie atomair wanneer een Version PR wordt samengevoegd |
| `vitest.config.ts` | Sets `coverage.provider: 'v8'`, `coverage.include: ['src/**']`, `coverage.exclude: ['src/internal/**']`, `coverage.thresholds.lines: 90` |

## Snel scaffold

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

## CLAUDE.md sjabloon

```markdown
# my-ts-library

TypeScript-bibliotheek gepubliceerd naar NPM als een dual ESM + CJS-pakket. Alle openbare API
leeft in src/index.ts. Tests spiegelen src/ structuur onder tests/. Releases zijn
beheerd door changesets — werk nooit handmatig package.json versie bij.

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

## Een nieuwe export toevoegen — exact stappen

1. Maak de implementatie in de juiste src/ subdirectory
   - Logica: src/core/, src/utils/, of een nieuwe src/[feature]/ directory
   - Alleen typen: add to an existing *.types.ts or create [feature].types.ts
   - Interne helpers (niet openbaar): src/internal/ — do NOT re-export from src/index.ts
2. Schrijf een TSDoc-commentblok op elk geëxporteerd symbool (TypeDoc parseert deze)
3. Voeg de export toe aan src/index.ts
4. Maak een overeenkomend testbestand in tests/[same-path]/[filename].test.ts
5. Run pnpm typecheck — fix all type errors before proceeding
6. Run pnpm lint:fix — Biome auto-fixes most style issues
7. Run pnpm test:coverage — confirm coverage stays above 90%
8. Run pnpm build — confirm tsup produces dist/ without errors
9. Run pnpm size — confirm new export is within budget (edit .size-limit.json if
   you intentionally increased scope; justify in the PR description)
10. Use /new-export slash command to scaffold steps 1–4 automatically

## Changeset release flow

Every PR that changes public behavior (new export, bug fix, breaking change)
needs a changeset file. Bump rules: patch for bug fixes, minor for new features
(backwards-compatible), major for breaking changes.

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

Never edit CHANGELOG.md by hand. Never run npm version or bump package.json
manually. The changesets/action handles it.

## Tests schrijven

- Mirror src/ layout: src/core/client.ts -> tests/core/client.test.ts
- Import only from src/ paths, never from dist/
- Use Vitest globals (describe, it, expect) — no import needed (configured in vitest.config.ts)
- Shared fixtures live in tests/fixtures/sample-data.ts — add to it, don't duplicate
- Type-level tests: tests/core/[name].test-d.ts using expectTypeOf from vitest
- Run in watch mode during development: pnpm test:watch
- Coverage must stay at or above 90% lines across src/ — CI fails otherwise

## Bundle size discipline

- .size-limit.json defines a budget for each named export (gzip, ESM)
- Run pnpm size locally before pushing any PR that adds new code
- If a new export genuinely needs more bytes, update .size-limit.json and
  explain the tradeoff in the PR description
- Never import third-party dependencies without checking their size first:
  use bundlephobia.com or pnpm why to assess impact
- Keep src/internal/ for helpers that are tree-shaken from the public build

## Voorbeelden uitvoeren

Examples import from the local dist/ output — always build first.

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

If an example fails after a build, the public API contract may have broken.
Treat example failures the same as test failures.

## Veelgebruikte commando's

| Commando | Wat het doet |
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

## Wat niet te doen

- Do not export symbols from src/internal/ — they are not part of the public API
- Do not edit CHANGELOG.md or bump package.json version manually
- Do not commit dist/ — it is gitignored and generated by CI before publish
- Do not add dependencies to dependencies without assessing bundle size impact
- Do not use ESLint or Prettier — Biome handles both; adding both creates conflicts
- Do not skip writing a changeset for a PR that touches src/ — CI will remind you
```

## MCP servers

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

## Aanbevolen hooks

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

## Te installeren vaardigheden

```bash
npx claudient add skill testing/vitest
npx claudient add skill devops-infra/cicd
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/changelog-writer
npx claudient add skill productivity/vendor-evaluator
```

## Gerelateerd

- [TypeScript Library Guide](../guides/typescript-library.md)
- [Changesets Release Workflow](../workflows/changesets-release.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
