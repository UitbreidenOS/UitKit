# CLI Tool (Node.js) — Estructura del Proyecto

> Para mantenedores de CLI de Node.js que envíen una herramienta de línea de comandos de TypeScript a npm, optimizando el ciclo completo desde agregar un nuevo comando hasta lanzar una versión.

## Stack

- **Lenguaje:** TypeScript 5.5+ (modo estricto)
- **Dev runner:** tsx 4+ (reemplazo de ts-node, sin paso de compilación en desarrollo)
- **Build:** tsup 8+ (agrupa a CommonJS + ESM, genera .d.ts, tree-shakes)
- **Análisis de argumentos:** Commander.js 12+ (subcomandos, opciones, generación de ayuda)
- **Prompts interactivos:** Inquirer.js 10+ (lista, entrada, confirmar, tipos de prompts de contraseña)
- **Terminal UI:** chalk 5+ (colores), ora 8+ (spinners), listr2 5+ (listas de tareas con progreso)
- **Persistencia de configuración:** conf 13+ (archivo de configuración JSON en ruta estándar del SO, validación de esquema)
- **Cliente HTTP:** got 14+ (basado en promesas, reintentos, hooks) o axios 1.7+
- **Pruebas:** Vitest 2+ (unitarias + integración), @vitest/coverage-v8 para reportes de cobertura
- **Versionado:** changesets 2+ (generación de changelog, bumping de versión, npm publish)
- **CI/CD:** GitHub Actions (matriz de pruebas, npm publish en lanzamiento)
- **Linting:** ESLint 9+ (configuración plana), Prettier 3+
- **Package manager:** pnpm 9+

## Árbol de directorios

```
my-cli/
├── .changeset/
│   ├── config.json                        # Configuración de changesets: access, baseBranch, changelog
│   └── README.md                          # Auto-generado; no editar manualmente
├── .github/
│   └── workflows/
│       ├── ci.yml                         # Lint, type-check, matriz de pruebas (Node 18/20/22)
│       ├── release.yml                    # Se dispara por fusión de changeset PR: version + npm publish
│       └── codeql.yml                     # Escaneo de seguridad CodeQL en PRs destinadas a main
├── bin/
│   └── my-cli.js                          # Punto de entrada: #!/usr/bin/env node, importa dist/index.js
├── src/
│   ├── index.ts                           # Raíz: crea programa Commander, registra todos los comandos
│   ├── commands/
│   │   ├── init.ts                        # `my-cli init` — configura scaffolding, ejecuta asistente Inquirer
│   │   ├── run.ts                         # `my-cli run <target>` — comando de ejecución principal
│   │   ├── config.ts                      # `my-cli config get|set|reset` — árbol de subcomandos config
│   │   ├── auth.ts                        # `my-cli auth login|logout|whoami` — árbol de subcomandos auth
│   │   └── upgrade.ts                     # `my-cli upgrade` — verifica registry npm, auto-actualiza
│   ├── lib/
│   │   ├── config.ts                      # Instancia conf: esquema, valores por defecto, helpers de get/set tipados
│   │   ├── http.ts                        # Instancia got/axios con encabezados de auth, reintentos, timeout
│   │   ├── auth.ts                        # Lectura/escritura de token a conf, asistente de flujo OAuth PKCE
│   │   ├── errors.ts                      # Clases de error personalizadas: CliError, AuthError, NetworkError
│   │   ├── logger.ts                      # Helpers de registro basados en chalk: info, warn, error, debug, success
│   │   ├── spinner.ts                     # Envoltura ora: utilidad withSpinner(label, fn)
│   │   ├── prompt.ts                      # Helpers Inquirer: confirmDestructive, selectFromList
│   │   ├── version.ts                     # Lee versión de package.json, verifica npm para actualizaciones
│   │   └── output.ts                      # Formateadores de tabla, JSON y texto plano para bandera --output
│   ├── types/
│   │   ├── config.ts                      # Tipo ConfigSchema, valores por defecto, esquema Zod
│   │   ├── api.ts                         # Formas de respuesta de API (respuestas got/axios tipadas)
│   │   └── command.ts                     # Tipos de opciones compartidas: GlobalOptions, OutputFormat
│   └── env.ts                             # Validación process.env con Zod, fail-fast en variables faltantes
├── tests/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── config.test.ts             # Unitario: conf get/set/reset con aislamiento de directorio tmp
│   │   │   ├── errors.test.ts             # Unitario: jerarquía de clase de error, formato de mensaje
│   │   │   ├── logger.test.ts             # Unitario: salida chalk capturada vía espía stdout
│   │   │   ├── output.test.ts             # Unitario: formas de salida del formateador tabla/JSON
│   │   │   └── version.test.ts            # Unitario: comparación semver, lógica de verificación de actualización
│   │   └── commands/
│   │       ├── config.test.ts             # Unitario: lógica del comando config get/set/reset
│   │       └── auth.test.ts               # Unitario: almacenamiento de token, transiciones de estado login/logout
│   └── integration/
│       ├── helpers/
│       │   ├── run-cli.ts                 # Genera binario CLI compilado, captura stdout/stderr/exitCode
│       │   └── mock-server.ts             # Servidor HTTP mock MSW o nock para pruebas de integración de API
│       ├── init.test.ts                   # Integración: `my-cli init` produce archivo config correcto
│       ├── run.test.ts                    # Integración: `my-cli run` contra API mock, códigos de salida
│       ├── config.test.ts                 # Integración: round-trips del subcomando config
│       └── auth.test.ts                   # Integración: flujo de login, persistencia de token, whoami
├── dist/                                  # Salida tsup — comprometido a .gitignore, generado en build
│   ├── index.js
│   ├── index.cjs
│   └── index.d.ts
├── .claude/
│   ├── CLAUDE.md                          # Instrucciones de nivel de proyecto para Claude Code (ver plantilla abajo)
│   └── settings.json                      # Hooks, permisos, referencias de servidor MCP
├── .changeset/
│   └── config.json                        # Configuración de changesets
├── package.json                           # name, bin field, exports map, scripts, peerDeps
├── tsconfig.json                          # strict, moduleResolution: bundler, target: ES2022
├── tsconfig.build.json                    # Extiende tsconfig.json, excluye tests/, usado por tsup
├── tsup.config.ts                         # Entrada: src/index.ts, formatos: [esm, cjs], dts: true
├── vitest.config.ts                       # coverage: v8, thresholds, include patterns
├── eslint.config.js                       # Configuración plana ESLint 9: typescript-eslint, compatibilidad prettier
├── .prettierrc                            # Prettier: printWidth 100, singleQuote true, semi false
├── .npmignore                             # Excluye: src/, tests/, .claude/, *.config.ts
├── .env.example                           # MY_CLI_API_URL, MY_CLI_LOG_LEVEL — sin valores reales
└── CHANGELOG.md                           # Auto-generado por changesets — no editar manualmente
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `src/index.ts` | Crea el programa raíz Commander, establece versión desde `package.json`, registra cada módulo de comando vía `.addCommand()`, y llama a `.parseAsync(process.argv)` |
| `src/commands/init.ts` | Ejecuta el asistente Inquirer en el primer uso, escribe el archivo conf inicial, valida la URL de API con una solicitud de prueba, e imprime un resumen de éxito con próximos pasos |
| `src/lib/config.ts` | Exporta una instancia `conf` tipada con un esquema validado por Zod; también exporta helpers `getConfig()` y `setConfig()` usados por cada comando que lee o muta configuraciones |
| `src/lib/errors.ts` | Define `CliError` (base), `AuthError`, `NetworkError`, y `ConfigError` — todas capturadas en el manejador de error `parseAsync` raíz que las mapea a salida stderr legible y códigos de salida correctos |
| `src/lib/output.ts` | Formateador `--output json\|table\|plain` usado por cada comando list y show; JSON va a stdout para piping, table usa cli-table3, plain es newline-delimited |
| `tests/integration/helpers/run-cli.ts` | Genera `node dist/index.js` con `child_process.spawn`, transmite stdout/stderr en strings, se resuelve con `{ stdout, stderr, exitCode }` — usado por todas las pruebas de integración |
| `.changeset/config.json` | Establece `access: public`, `baseBranch: main`, `changelog: @changesets/cli/changelog` — gobierna cómo se calculan los bumps de versión y se escribe CHANGELOG.md |
| `.github/workflows/release.yml` | Se dispara cuando se fusiona el PR del bot changesets; ejecuta `pnpm changeset version` luego `pnpm changeset publish` con `NODE_AUTH_TOKEN` de secretos del repositorio |

## Andamiaje rápido

```bash
# Inicializa un nuevo proyecto CLI desde cero
mkdir my-cli && cd my-cli
git init

# Inicializa proyecto pnpm
pnpm init

# Instala dependencias de runtime
pnpm add commander inquirer chalk ora listr2 conf got

# Instala dependencias de desarrollo
pnpm add -D typescript tsx tsup vitest @vitest/coverage-v8 \
  @types/node @types/inquirer \
  eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  prettier eslint-config-prettier \
  @changesets/cli

# Crea estructura de directorios
mkdir -p src/commands src/lib src/types
mkdir -p tests/unit/lib tests/unit/commands
mkdir -p tests/integration/helpers
mkdir -p bin dist .changeset .github/workflows .claude

# Punto de entrada
echo '#!/usr/bin/env node' > bin/my-cli.js
echo 'import("../dist/index.js")' >> bin/my-cli.js
chmod +x bin/my-cli.js

# Toca archivos fuente
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

# Escribe tsconfig
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

# Escribe configuración tsup
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

# Escribe configuración vitest
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

# Agrega scripts a package.json (se requiere edición manual para campos bin + exports)
# Scripts clave a agregar:
# "build": "tsup"
# "dev": "tsx src/index.ts"
# "test": "vitest run"
# "test:watch": "vitest"
# "test:coverage": "vitest run --coverage"
# "lint": "eslint src tests"
# "typecheck": "tsc --noEmit"
# "release": "changeset publish"
# "version": "changeset version"

# Inicializa changesets
pnpm changeset init

# Agrega CLAUDE.md
touch .claude/CLAUDE.md

echo "Proyecto CLI andamiado. Edita package.json para agregar campos bin, exports, y scripts."
```

## Plantilla CLAUDE.md

```markdown
# my-cli — Instrucciones de Claude Code

Esta es una herramienta CLI Node.js de producción escrita en TypeScript. Se publica en npm y
es utilizada por desarrolladores para interactuar con la API de My CLI desde la terminal. La base de código sigue
una estructura estricta de comando por archivo; cada nueva característica es un nuevo archivo de comando.

## Stack

- TypeScript 5.5 (modo estricto, moduleResolution: bundler)
- Commander.js 12 para análisis de argumentos y árboles de subcomandos
- Inquirer.js 10 para prompts interactivos (asistente de primera ejecución, confirmaciones destructivas)
- chalk 5 + ora 8 + listr2 5 para toda la salida de terminal
- conf 13 para persistencia de configuración (archivo config en ruta estándar del SO — ver src/lib/config.ts)
- got 14 para HTTP con reintentos, timeout, e inyección de encabezado de autenticación
- Vitest 2 para todas las pruebas (unitarias + integración)
- tsup 8 para compilar dist/ (salida dual ESM + CJS)
- changesets 2 para versionado, generación de changelog, y npm publish

## Agregar un nuevo comando

1. Crea `src/commands/<command-name>.ts`
2. Exporta un `Command` desde Commander.js con `.name()`, `.description()`, `.option()`, y `.action()`
3. Importa y registrarlo en `src/index.ts` vía `program.addCommand(myCommand)`
4. Agrega pruebas unitarias en `tests/unit/commands/<command-name>.test.ts`
5. Agrega pruebas de integración en `tests/integration/<command-name>.test.ts` usando `run-cli.ts`
6. Ejecuta `pnpm build && pnpm test` antes de abrir un PR

Las funciones de acción de comando deben:
- Usar `src/lib/logger.ts` para toda la salida (nunca `console.log` directamente)
- Usar `src/lib/spinner.ts` `withSpinner()` para cualquier operación async sobre ~300ms
- Lanzar errores tipados desde `src/lib/errors.ts` — nunca lanzar `Error` sin procesar
- Respetar la bandera global `--output json|table|plain` vía `src/lib/output.ts`
- Salir con código 0 en éxito, 1 en error de usuario, 2 en error de sistema/red

## Probar salida CLI

Las pruebas de integración generan el binario compilado. Siempre ejecuta `pnpm build` antes de pruebas de integración.

```ts
// Patrón de tests/integration/helpers/run-cli.ts
const { stdout, stderr, exitCode } = await runCli(['run', '--target', 'foo'])
expect(exitCode).toBe(0)
expect(stdout).toContain('Success')
```

Las pruebas unitarias para comandos mockean `src/lib/config.ts` y `src/lib/http.ts` a nivel de módulo.
Nunca pruebes códigos de color chalk directamente — elimina ANSI antes de afirmar en strings de salida.

Ejecutar pruebas:
- `pnpm test` — suite completa unitaria + integración
- `pnpm test:watch` — modo watch durante el desarrollo
- `pnpm test:coverage` — genera reporte de cobertura en coverage/

Puerta de cobertura: 80% líneas, 80% funciones, 75% ramas. CI falla por debajo del threshold.

## Flujo de lanzamiento con changesets

1. Realiza cambios de código en una rama de característica
2. Ejecuta `pnpm changeset` — selecciona tipo de bump (patch/minor/major), escribe entrada de changelog
3. Confirma el `.changeset/<random-name>.md` generado junto con tus cambios de código
4. Abre un PR — el bot de GitHub changesets comentará con el resumen de lanzamiento
5. Después de fusionar el PR a main, el bot abre un PR de "Version Packages" automáticamente
6. Revisa y fusiona el PR de Version Packages — esto dispara `release.yml`
7. `release.yml` ejecuta `pnpm changeset publish` que bumps `package.json`, actualiza
   `CHANGELOG.md`, crea una etiqueta git, y publica a npm

Nunca edites manualmente `CHANGELOG.md` o bumps `package.json` version — changesets es el propietario de estos.
Nunca ejecutes `pnpm changeset publish` localmente — solo CI ejecuta esto con el secreto `NODE_AUTH_TOKEN`.

## Ubicación del archivo de configuración y esquema

La instancia conf está en `src/lib/config.ts`. La configuración se almacena en:
- macOS: `~/Library/Preferences/my-cli-nodejs/config.json`
- Linux: `~/.config/my-cli-nodejs/config.json`
- Windows: `%APPDATA%\my-cli-nodejs\Config\config.json`

Esquema de configuración (definido en `src/types/config.ts`):
- `apiUrl` (string, requerido) — URL base para la API de My CLI
- `authToken` (string, opcional) — bearer token desde `my-cli auth login`
- `outputFormat` (enum: json|table|plain, por defecto: table)
- `logLevel` (enum: debug|info|warn|error, por defecto: info)
- `updateCheckInterval` (number, por defecto: 86400) — segundos entre verificaciones de actualización npm

Usa `my-cli config get <key>` y `my-cli config set <key> <value>` para inspeccionar y modificar.
Ejecuta `my-cli config reset` para limpiar el archivo de configuración y ejecutar nuevamente el asistente init.

## Convenciones

- Toda la salida va a través de `src/lib/logger.ts` — sin `console.log` desnudo
- Las llamadas HTTP van a través de la instancia got en `src/lib/http.ts` — nunca importes got directamente
- El spinner envuelve cada operación async: `withSpinner('Fetching...', () => http.get(...))`
- Las operaciones destructivas requieren `await confirmDestructive(message)` antes de ejecutar
- La bandera `--dry-run` en cualquier comando mutante debe ser manejada y debe omitir la llamada HTTP
- Cada comando que lista recursos soporta `--output json|table|plain`
- Nunca almacenes secretos en el archivo conf en texto plano más allá del token de auth — usa keychain para datos sensibles

## Qué no hacer

- No agregues declaraciones console.log — usa logger.info/warn/error
- No confirmes dist/ — es generado por CI antes de publicar
- No omitas escribir una confirmación Inquirer para ningún comando que elimine u sobrescriba datos
- No agregues un comando sin registrarlo en src/index.ts
- No fusiones sin una entrada de changeset si el cambio afecta el comportamiento publicado
```

## Servidores MCP

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

## Hooks recomendados

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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -q \"changeset publish\"; then echo \"[HOOK] No ejecutes changeset publish localmente — esto se ejecuta en CI solo vía release.yml.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if git -C \"$PWD\" diff --name-only 2>/dev/null | grep -q \"^src/\"; then echo \"Recordatorio: src/ tiene cambios no confirmados. Ejecuta pnpm build && pnpm test antes de confirmar.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

```bash
npx claudient add skill productivity/code-review
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
npx claudient add skill productivity/refactor
npx claudient add skill productivity/changelog-writer
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill devops-infra/oncall-runbook
```

## Relacionado

- [Publishing a CLI Guide](../guides/publishing-cli.md)
- [Changesets Release Workflow](../workflows/changesets-release.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
