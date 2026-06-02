# CLI Tool (Node.js) — Project Structure

> For Node.js CLI maintainers shipping a TypeScript-first command-line tool to npm — optimizing the full cycle from adding a new command to cutting a versioned release.

## Stack

- **Language:** TypeScript 5.5+ (strict mode)
- **Dev runner:** tsx 4+ (ts-node replacement, no compile step in development)
- **Build:** tsup 8+ (bundles to CommonJS + ESM, generates .d.ts, tree-shakes)
- **Arg parsing:** Commander.js 12+ (subcommands, options, help generation)
- **Interactive prompts:** Inquirer.js 10+ (list, input, confirm, password prompt types)
- **Terminal UI:** chalk 5+ (colors), ora 8+ (spinners), listr2 5+ (task lists with progress)
- **Config persistence:** conf 13+ (JSON config file at OS-standard path, schema validation)
- **HTTP client:** got 14+ (promise-based, retries, hooks) or axios 1.7+
- **Testing:** Vitest 2+ (unit + integration), @vitest/coverage-v8 for coverage reports
- **Versioning:** changesets 2+ (changelog generation, version bumping, npm publish)
- **CI/CD:** GitHub Actions (test matrix, npm publish on release)
- **Linting:** ESLint 9+ (flat config), Prettier 3+
- **Package manager:** pnpm 9+

## Directory tree

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

## Key files explained

| Path | Purpose |
|---|---|
| `src/index.ts` | Creates the root Commander program, sets version from `package.json`, registers every command module via `.addCommand()`, and calls `.parseAsync(process.argv)` |
| `src/commands/init.ts` | Runs the Inquirer wizard on first use, writes the initial conf file, validates the API URL with a test request, and prints a success summary with next steps |
| `src/lib/config.ts` | Exports a typed `conf` instance with a Zod-validated schema; also exports `getConfig()` and `setConfig()` helpers used by every command that reads or mutates settings |
| `src/lib/errors.ts` | Defines `CliError` (base), `AuthError`, `NetworkError`, and `ConfigError` — all caught in the root `parseAsync` error handler which maps them to human-readable stderr output and correct exit codes |
| `src/lib/output.ts` | `--output json\|table\|plain` formatter used by every list and show command; JSON goes to stdout for piping, table uses cli-table3, plain is newline-delimited |
| `tests/integration/helpers/run-cli.ts` | Spawns `node dist/index.js` with `child_process.spawn`, streams stdout/stderr into strings, resolves with `{ stdout, stderr, exitCode }` — used by all integration tests |
| `.changeset/config.json` | Sets `access: public`, `baseBranch: main`, `changelog: @changesets/cli/changelog` — governs how version bumps are calculated and CHANGELOG.md is written |
| `.github/workflows/release.yml` | Triggered when the changesets bot PR is merged; runs `pnpm changeset version` then `pnpm changeset publish` with `NODE_AUTH_TOKEN` from repository secrets |

## Quick scaffold

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
# my-cli — Claude Code Instructions

This is a production Node.js CLI tool written in TypeScript. It is published to npm and
used by developers to interact with the My CLI API from the terminal. The codebase follows
a strict command-per-file structure; each new feature is a new command file.

## Stack

- TypeScript 5.5 (strict mode, moduleResolution: bundler)
- Commander.js 12 for arg parsing and subcommand trees
- Inquirer.js 10 for interactive prompts (first-run wizard, destructive confirmations)
- chalk 5 + ora 8 + listr2 5 for all terminal output
- conf 13 for config persistence (config file at OS standard path — see src/lib/config.ts)
- got 14 for HTTP with retry, timeout, and auth header injection
- Vitest 2 for all tests (unit + integration)
- tsup 8 to build dist/ (ESM + CJS dual output)
- changesets 2 for versioning, changelog generation, and npm publish

## Adding a new command

1. Create `src/commands/<command-name>.ts`
2. Export a `Command` from Commander.js with `.name()`, `.description()`, `.option()`, and `.action()`
3. Import and register it in `src/index.ts` via `program.addCommand(myCommand)`
4. Add unit tests in `tests/unit/commands/<command-name>.test.ts`
5. Add integration tests in `tests/integration/<command-name>.test.ts` using `run-cli.ts`
6. Run `pnpm build && pnpm test` before opening a PR

Command action functions must:
- Use `src/lib/logger.ts` for all output (never `console.log` directly)
- Use `src/lib/spinner.ts` `withSpinner()` for any async operation over ~300ms
- Throw typed errors from `src/lib/errors.ts` — never throw raw `Error`
- Respect the `--output json|table|plain` global flag via `src/lib/output.ts`
- Exit with code 0 on success, 1 on user error, 2 on system/network error

## Testing CLI output

Integration tests spawn the built binary. Always run `pnpm build` before integration tests.

```ts
// tests/integration/helpers/run-cli.ts pattern
const { stdout, stderr, exitCode } = await runCli(['run', '--target', 'foo'])
expect(exitCode).toBe(0)
expect(stdout).toContain('Success')
```

Unit tests for commands mock `src/lib/config.ts` and `src/lib/http.ts` at the module level.
Never test chalk color codes directly — strip ANSI before asserting on output strings.

Run tests:
- `pnpm test` — full unit + integration suite
- `pnpm test:watch` — watch mode during development
- `pnpm test:coverage` — generates coverage report in coverage/

Coverage gate: 80% lines, 80% functions, 75% branches. CI fails below threshold.

## Release flow with changesets

1. Make code changes on a feature branch
2. Run `pnpm changeset` — select bump type (patch/minor/major), write changelog entry
3. Commit the generated `.changeset/<random-name>.md` alongside your code changes
4. Open a PR — the changesets GitHub bot will comment with the release summary
5. After PR is merged to main, the bot opens a "Version Packages" PR automatically
6. Review and merge the Version Packages PR — this triggers `release.yml`
7. `release.yml` runs `pnpm changeset publish` which bumps `package.json`, updates
   `CHANGELOG.md`, creates a git tag, and publishes to npm

Never manually edit `CHANGELOG.md` or bump `package.json` version — changesets owns these.
Never run `pnpm changeset publish` locally — only CI runs this with the `NODE_AUTH_TOKEN` secret.

## Config file location and schema

The conf instance is in `src/lib/config.ts`. Config is stored at:
- macOS: `~/Library/Preferences/my-cli-nodejs/config.json`
- Linux: `~/.config/my-cli-nodejs/config.json`
- Windows: `%APPDATA%\my-cli-nodejs\Config\config.json`

Config schema (defined in `src/types/config.ts`):
- `apiUrl` (string, required) — base URL for the My CLI API
- `authToken` (string, optional) — bearer token from `my-cli auth login`
- `outputFormat` (enum: json|table|plain, default: table)
- `logLevel` (enum: debug|info|warn|error, default: info)
- `updateCheckInterval` (number, default: 86400) — seconds between npm update checks

Use `my-cli config get <key>` and `my-cli config set <key> <value>` to inspect and modify.
Run `my-cli config reset` to wipe the config file and rerun the init wizard.

## Conventions

- All output goes through `src/lib/logger.ts` — no bare `console.log`
- HTTP calls go through the `src/lib/http.ts` got instance — never import got directly
- Spinner wraps every async operation: `withSpinner('Fetching...', () => http.get(...))`
- Destructive operations require `await confirmDestructive(message)` before executing
- `--dry-run` flag on any mutating command must be handled and must skip the HTTP call
- Every command that lists resources supports `--output json|table|plain`
- Never store secrets in the conf file in plaintext beyond the auth token — use keychain for sensitive data

## What not to do

- Do not add console.log statements — use logger.info/warn/error
- Do not commit dist/ — it is generated by CI before publish
- Do not skip writing an Inquirer confirmation for any command that deletes or overwrites data
- Do not add a command without registering it in src/index.ts
- Do not merge without a changeset entry if the change affects published behavior
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

## Recommended hooks

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

## Skills to install

```bash
npx claudient add skill productivity/code-review
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/refactor
npx claudient add skill productivity/changelog-writer
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill devops-infra/oncall-runbook
```

## Related

- [Publishing a CLI Guide](../guides/publishing-cli.md)
- [Changesets Release Workflow](../workflows/changesets-release.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
