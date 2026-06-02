# CLI Tool (Node.js) — Projectstructuur

> Voor Node.js CLI-beheerders die een TypeScript-first command-line tool naar npm verzenden — optimalisering van de volledige cyclus van het toevoegen van een nieuw commando tot het uitbrengen van een versioned release.

## Stack

- **Taal:** TypeScript 5.5+ (strict mode)
- **Dev runner:** tsx 4+ (ts-node vervanger, geen compile stap in development)
- **Build:** tsup 8+ (bundelt naar CommonJS + ESM, genereert .d.ts, tree-shakes)
- **Arg parsing:** Commander.js 12+ (subcommands, options, help generation)
- **Interactieve prompts:** Inquirer.js 10+ (list, input, confirm, password prompt types)
- **Terminal UI:** chalk 5+ (kleuren), ora 8+ (spinners), listr2 5+ (taaklijsten met voortgang)
- **Config persistence:** conf 13+ (JSON config file op OS-standaardpad, schema validatie)
- **HTTP client:** got 14+ (promise-based, retries, hooks) of axios 1.7+
- **Testen:** Vitest 2+ (unit + integration), @vitest/coverage-v8 voor coverage reports
- **Versioning:** changesets 2+ (changelog generation, version bumping, npm publish)
- **CI/CD:** GitHub Actions (test matrix, npm publish on release)
- **Linting:** ESLint 9+ (flat config), Prettier 3+
- **Package manager:** pnpm 9+

## Directoryboom

```
my-cli/
├── .changeset/
│   ├── config.json                        # Changesets config: access, baseBranch, changelog
│   └── README.md                          # Auto-generated; do not edit manually
├── .github/
│   └── workflows/
│       ├── ci.yml                         # Lint, type-check, test matrix (Node 18/20/22)
│       ├── release.yml                    # Triggered by changeset PR merge: version + npm publish
│       └── codeql.yml                     # CodeQL security scan on PRs targeting main
├── bin/
│   └── my-cli.js                          # Entry point: #!/usr/bin/env node, imports dist/index.js
├── src/
│   ├── index.ts                           # Root: creates Commander program, registers all commands
│   ├── commands/
│   │   ├── init.ts                        # `my-cli init` — scaffolds config, runs Inquirer wizard
│   │   ├── run.ts                         # `my-cli run <target>` — core execution command
│   │   ├── config.ts                      # `my-cli config get|set|reset` — config subcommand tree
│   │   ├── auth.ts                        # `my-cli auth login|logout|whoami` — auth subcommand tree
│   │   └── upgrade.ts                     # `my-cli upgrade` — checks npm registry, self-updates
│   ├── lib/
│   │   ├── config.ts                      # conf instance: schema, defaults, typed get/set helpers
│   │   ├── http.ts                        # got/axios instance with auth headers, retry, timeout
│   │   ├── auth.ts                        # Token read/write to conf, OAuth PKCE flow helper
│   │   ├── errors.ts                      # Custom error classes: CliError, AuthError, NetworkError
│   │   ├── logger.ts                      # chalk-based log helpers: info, warn, error, debug, success
│   │   ├── spinner.ts                     # ora wrapper: withSpinner(label, fn) utility
│   │   ├── prompt.ts                      # Inquirer helpers: confirmDestructive, selectFromList
│   │   ├── version.ts                     # Reads package.json version, checks npm for updates
│   │   └── output.ts                      # Table, JSON, and plain text formatters for --output flag
│   ├── types/
│   │   ├── config.ts                      # ConfigSchema type, default values, Zod schema
│   │   ├── api.ts                         # API response shapes (typed got/axios responses)
│   │   └── command.ts                     # Shared option types: GlobalOptions, OutputFormat
│   └── env.ts                             # process.env validation with Zod, fail-fast on missing vars
├── tests/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── config.test.ts             # Unit: conf get/set/reset with tmp dir isolation
│   │   │   ├── errors.test.ts             # Unit: error class hierarchy, message formatting
│   │   │   ├── logger.test.ts             # Unit: chalk output captured via stdout spy
│   │   │   ├── output.test.ts             # Unit: table/JSON formatter output shapes
│   │   │   └── version.test.ts            # Unit: semver comparison, update-check logic
│   │   └── commands/
│   │       ├── config.test.ts             # Unit: config get/set/reset command logic
│   │       └── auth.test.ts               # Unit: token storage, login/logout state transitions
│   └── integration/
│       ├── helpers/
│       │   ├── run-cli.ts                 # Spawns built CLI binary, captures stdout/stderr/exitCode
│       │   └── mock-server.ts             # MSW or nock HTTP mock server for API integration tests
│       ├── init.test.ts                   # Integration: `my-cli init` produces correct config file
│       ├── run.test.ts                    # Integration: `my-cli run` against mock API, exit codes
│       ├── config.test.ts                 # Integration: config subcommand round-trips
│       └── auth.test.ts                   # Integration: login flow, token persistence, whoami
├── dist/                                  # tsup output — committed to .gitignore, generated on build
│   ├── index.js
│   ├── index.cjs
│   └── index.d.ts
├── .claude/
│   ├── CLAUDE.md                          # Project-level Claude Code instructions (see template below)
│   └── settings.json                      # Hooks, permissions, MCP server refs
├── .changeset/
│   └── config.json                        # Changesets configuration
├── package.json                           # name, bin field, exports map, scripts, peerDeps
├── tsconfig.json                          # strict, moduleResolution: bundler, target: ES2022
├── tsconfig.build.json                    # Extends tsconfig.json, excludes tests/, used by tsup
├── tsup.config.ts                         # Entry: src/index.ts, formats: [esm, cjs], dts: true
├── vitest.config.ts                       # coverage: v8, thresholds, include patterns
├── eslint.config.js                       # ESLint 9 flat config: typescript-eslint, prettier compat
├── .prettierrc                            # Prettier: printWidth 100, singleQuote true, semi false
├── .npmignore                             # Excludes: src/, tests/, .claude/, *.config.ts
├── .env.example                           # MY_CLI_API_URL, MY_CLI_LOG_LEVEL — no real values
└── CHANGELOG.md                           # Auto-generated by changesets — do not edit manually
```

## Belangrijke bestanden uitgelegd

| Pad | Doel |
|---|---|
| `src/index.ts` | Creëert het root Commander programma, stelt versie in van `package.json`, registreert elk command module via `.addCommand()`, en roept `.parseAsync(process.argv)` aan |
| `src/commands/init.ts` | Voert de Inquirer wizard uit bij eerste gebruik, schrijft het initiële conf bestand, valideert de API URL met een testaanvraag, en drukt een succesverhaal af met volgende stappen |
| `src/lib/config.ts` | Exporteert een getypeerde `conf` instantie met een Zod-gevalideerd schema; exporteert ook `getConfig()` en `setConfig()` helpers gebruikt door elk command dat instellingen leest of muteert |
| `src/lib/errors.ts` | Definieert `CliError` (basis), `AuthError`, `NetworkError`, en `ConfigError` — allemaal afgehandeld in de root `parseAsync` error handler die ze in human-readable stderr output en correcte exit codes omzet |
| `src/lib/output.ts` | `--output json\|table\|plain` formatter gebruikt door elk list en show command; JSON gaat naar stdout voor piping, table gebruikt cli-table3, plain is newline-delimited |
| `tests/integration/helpers/run-cli.ts` | Spawnt `node dist/index.js` met `child_process.spawn`, streamt stdout/stderr in strings, resolved met `{ stdout, stderr, exitCode }` — gebruikt door alle integration tests |
| `.changeset/config.json` | Stelt `access: public`, `baseBranch: main`, `changelog: @changesets/cli/changelog` in — bepaalt hoe versiebugs berekend en CHANGELOG.md geschreven wordt |
| `.github/workflows/release.yml` | Geactiveerd wanneer de changesets bot PR samengevoegd is; voert `pnpm changeset version` dan `pnpm changeset publish` uit met `NODE_AUTH_TOKEN` uit repository secrets |

## Snel scaffold

```bash
# Bootstrap a new CLI project from scratch
mkdir my-cli && cd my-cli
git init

# Init pnpm project
pnpm init

# Install runtime dependencies
pnpm add commander inquirer chalk ora listr2 conf got

# Install dev dependencies
pnpm add -D typescript tsx tsup vitest @vitest/coverage-v8 \
  @types/node @types/inquirer \
  eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  prettier eslint-config-prettier \
  @changesets/cli

# Create directory structure
mkdir -p src/commands src/lib src/types
mkdir -p tests/unit/lib tests/unit/commands
mkdir -p tests/integration/helpers
mkdir -p bin dist .changeset .github/workflows .claude

# Entry point
echo '#!/usr/bin/env node' > bin/my-cli.js
echo 'import("../dist/index.js")' >> bin/my-cli.js
chmod +x bin/my-cli.js

# Touch source files
touch src/index.ts
touch src/commands/init.ts src/commands/run.ts src/commands/config.ts
touch src/commands/auth.ts src/commands/upgrade.ts
touch src/lib/config.ts src/lib/http.ts src/lib/auth.ts
touch src/lib/errors.ts src/lib/logger.ts src/lib/spinner.ts
touch src/lib/prompt.ts src/lib/version.ts src/lib/output.ts
touch src/types/config.ts src/types/api.ts src/types/command.ts
touch src/env.ts
touch tests/integration/helpers/run-cli.ts tests/integration/helpers/mock-server.ts
touch tests/integration/init.test.ts tests/integration/run.test.ts
touch tests/integration/config.test.ts tests/integration/auth.test.ts
touch tests/unit/lib/config.test.ts tests/unit/lib/errors.test.ts
touch tests/unit/lib/logger.test.ts tests/unit/lib/output.test.ts
touch .env.example .npmignore

# Write tsconfig
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true
  },
  "include": ["src"]
}
EOF

cat > tsconfig.build.json << 'EOF'
{
  "extends": "./tsconfig.json",
  "exclude": ["tests", "**/*.test.ts"]
}
EOF

# Write tsup config
cat > tsup.config.ts << 'EOF'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'node18',
})
EOF

# Write vitest config
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      thresholds: { lines: 80, functions: 80, branches: 75 },
    },
    include: ['tests/**/*.test.ts'],
  },
})
EOF

# Add scripts to package.json (manual edit required for bin + exports fields)
# Key scripts to add:
# "build": "tsup"
# "dev": "tsx src/index.ts"
# "test": "vitest run"
# "test:watch": "vitest"
# "test:coverage": "vitest run --coverage"
# "lint": "eslint src tests"
# "typecheck": "tsc --noEmit"
# "release": "changeset publish"
# "version": "changeset version"

# Init changesets
pnpm changeset init

# Add CLAUDE.md
touch .claude/CLAUDE.md

echo "CLI project scaffolded. Edit package.json to add bin, exports, and scripts fields."
```

## CLAUDE.md template

```markdown
# my-cli — Claude Code Instructies

Dit is een productie Node.js CLI tool geschreven in TypeScript. Het wordt gepubliceerd naar npm en
gebruikt door ontwikkelaars om met de My CLI API van de terminal interactie te hebben. De codebase volgt
een strikte command-per-file structuur; elk nieuw feature is een nieuw command bestand.

## Stack

- TypeScript 5.5 (strict mode, moduleResolution: bundler)
- Commander.js 12 voor arg parsing en subcommand trees
- Inquirer.js 10 voor interactieve prompts (first-run wizard, destructive confirmations)
- chalk 5 + ora 8 + listr2 5 voor alle terminal output
- conf 13 voor config persistence (config bestand op OS standaard pad — zie src/lib/config.ts)
- got 14 voor HTTP met retry, timeout, en auth header injection
- Vitest 2 voor alle tests (unit + integration)
- tsup 8 voor build dist/ (ESM + CJS dual output)
- changesets 2 voor versioning, changelog generation, en npm publish

## Een nieuw command toevoegen

1. Maak `src/commands/<command-name>.ts` aan
2. Exporteer een `Command` van Commander.js met `.name()`, `.description()`, `.option()`, en `.action()`
3. Importeer en registreer het in `src/index.ts` via `program.addCommand(myCommand)`
4. Voeg unit tests toe in `tests/unit/commands/<command-name>.test.ts`
5. Voeg integration tests toe in `tests/integration/<command-name>.test.ts` met behulp van `run-cli.ts`
6. Voer `pnpm build && pnpm test` uit voordat je een PR opent

Command action functies moeten:
- `src/lib/logger.ts` gebruiken voor alle output (nooit direct `console.log`)
- `src/lib/spinner.ts` `withSpinner()` gebruiken voor elke async operatie langer dan ~300ms
- Getypeerde errors van `src/lib/errors.ts` gooien — nooit rauwe `Error`
- Het `--output json|table|plain` global flag respecteren via `src/lib/output.ts`
- Afsluiten met code 0 bij succes, 1 bij gebruikersfout, 2 bij systeem/netwerk fout

## CLI output testen

Integration tests spawnen het gebouwde binary. Voer altijd `pnpm build` uit voordat integration tests.

```ts
// tests/integration/helpers/run-cli.ts patroon
const { stdout, stderr, exitCode } = await runCli(['run', '--target', 'foo'])
expect(exitCode).toBe(0)
expect(stdout).toContain('Success')
```

Unit tests voor commands mocken `src/lib/config.ts` en `src/lib/http.ts` op module niveau.
Test nooit chalk colorcodes rechtstreeks — strip ANSI voordat je op output strings beweert.

Tests uitvoeren:
- `pnpm test` — volledige unit + integration suite
- `pnpm test:watch` — watch mode tijdens development
- `pnpm test:coverage` — genereert coverage report in coverage/

Coverage gate: 80% lines, 80% functions, 75% branches. CI faalt onder drempel.

## Release flow met changesets

1. Maak code changes op een feature branch
2. Voer `pnpm changeset` uit — selecteer bump type (patch/minor/major), schrijf changelog entry
3. Commit het gegenereerde `.changeset/<random-name>.md` samen met je code changes
4. Open een PR — de changesets GitHub bot zal een opmerking maken met de release summary
5. Na PR merge naar main, opent de bot automatisch een "Version Packages" PR
6. Review en merge de Version Packages PR — dit triggert `release.yml`
7. `release.yml` voert `pnpm changeset publish` uit die `package.json` bumpt, updates
   `CHANGELOG.md`, creëert een git tag, en publiceert naar npm

Bewerk nooit handmatig `CHANGELOG.md` of bump `package.json` versie — changesets is eigenaar hiervan.
Voer nooit `pnpm changeset publish` lokaal uit — alleen CI doet dit met het `NODE_AUTH_TOKEN` secret.

## Config bestand locatie en schema

De conf instantie is in `src/lib/config.ts`. Config wordt opgeslagen op:
- macOS: `~/Library/Preferences/my-cli-nodejs/config.json`
- Linux: `~/.config/my-cli-nodejs/config.json`
- Windows: `%APPDATA%\my-cli-nodejs\Config\config.json`

Config schema (gedefinieerd in `src/types/config.ts`):
- `apiUrl` (string, required) — basis URL voor de My CLI API
- `authToken` (string, optional) — bearer token van `my-cli auth login`
- `outputFormat` (enum: json|table|plain, default: table)
- `logLevel` (enum: debug|info|warn|error, default: info)
- `updateCheckInterval` (number, default: 86400) — seconden tussen npm update checks

Gebruik `my-cli config get <key>` en `my-cli config set <key> <value>` om in te zien en te wijzigen.
Voer `my-cli config reset` uit om het config bestand te wissen en de init wizard opnieuw uit te voeren.

## Conventies

- Alle output gaat door `src/lib/logger.ts` — geen blote `console.log`
- HTTP calls gaan door de `src/lib/http.ts` got instantie — nooit import got rechtstreeks
- Spinner wrap elke async operatie: `withSpinner('Fetching...', () => http.get(...))`
- Destructieve operaties vereisen `await confirmDestructive(message)` voordat ze uitgevoerd worden
- `--dry-run` flag op elk muterend command moet afgehandeld worden en moet de HTTP call overslaan
- Elk command dat resources opsomt ondersteunt `--output json|table|plain`
- Sla nooit secrets op in het conf bestand in plaintext voorbij de auth token — gebruik keychain voor gevoelige gegevens

## Wat niet te doen

- Voeg geen console.log statements toe — gebruik logger.info/warn/error
- Commit dist/ niet — het wordt gegenereerd door CI voordat publish
- Sla een Inquirer confirmation niet over voor elk command dat gegevens verwijdert of overschrijft
- Voeg een command niet toe zonder het in src/index.ts te registreren
- Merge niet zonder changeset entry als de change published behavior beïnvloedt
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/my-cli"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "npm": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-npm"],
      "env": {}
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == *.ts ]]; then npx prettier --write \"$FILE\" 2>/dev/null && npx eslint --fix \"$FILE\" 2>/dev/null || true; fi'"
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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -q \"changeset publish\"; then echo \"[HOOK] Do not run changeset publish locally — this runs in CI only via release.yml.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if git -C \"$PWD\" diff --name-only 2>/dev/null | grep -q \"^src/\"; then echo \"Reminder: src/ has uncommitted changes. Run pnpm build && pnpm test before committing.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills te installeren

```bash
npx claudient add skill productivity/code-review
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/refactor
npx claudient add skill productivity/changelog-writer
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill devops-infra/oncall-runbook
```

## Gerelateerd

- [Publishing a CLI Guide](../guides/publishing-cli.md)
- [Changesets Release Workflow](../workflows/changesets-release.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
