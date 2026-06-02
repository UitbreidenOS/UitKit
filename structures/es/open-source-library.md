# Biblioteca de Código Abierto (TypeScript) — Estructura del Proyecto

> Para autores de bibliotecas TypeScript que publican en NPM, optimizando el flujo de trabajo desde la creación de una nueva exportación hasta la publicación con versión y presupuesto de tamaño, en dual-formato.

## Stack

- **Lenguaje:** TypeScript 5.x (modo strict, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- **Build:** tsup 8.x — salida dual ESM + CJS, generación `.d.ts`, source maps
- **Test runner:** Vitest 2.x — pruebas unitarias, cobertura via V8, snapshots inline
- **Linter/Formatter:** Biome 1.x — herramienta única reemplazando ESLint + Prettier; sin derivas de configuración
- **Versionado:** Changesets 2.x — archivos changeset por PR, CHANGELOG.md automatizado, `npm publish`
- **CI/CD:** GitHub Actions — `ci.yml` (typecheck + lint + test en PR), `release.yml` (publicar al fusionar rama de release)
- **Actualizaciones de dependencias:** Renovate — PRs agrupados minor/patch, PRs major individuales, pin devDependencies
- **Tamaño del bundle:** size-limit 11.x — presupuesto ESM y CJS reforzado en CI; falla PR si se excede presupuesto
- **Documentación de API:** TypeDoc 0.26.x — genera HTML desde comentarios TSDoc; implementado en GitHub Pages
- **Gestor de paquetes:** pnpm 9+

## Árbol de directorios

```
my-ts-library/                          # Raíz de la biblioteca publicada
├── .changeset/
│   ├── config.json                     # Changesets: access, baseBranch, changelog format
│   └── README.md                       # Instrucciones de autoría de Changeset (no eliminar)
├── .claude/
│   ├── settings.json                   # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── new-export.md               # /new-export — scaffold src/ + tests/ + exportación en index.ts
│       ├── add-changeset.md            # /add-changeset — ejecuta pnpm changeset, rellena resumen
│       ├── size-check.md               # /size-check — ejecuta size-limit y explica cuáles exportaciones crecieron
│       └── typedoc-preview.md          # /typedoc-preview — construye docs y abre en navegador
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                      # Puerta de PR: typecheck, biome check, vitest, size-limit
│   │   └── release.yml                 # Se activa al hacer push a main: changesets/action publica en NPM
│   └── renovate.json                   # Config Renovate: patches agrupados, PRs major separados
├── docs/
│   ├── getting-started.md              # Guía de instalación y primer uso
│   ├── api-reference.md                # Narrativa API escrita a mano (TypeDoc cubre firmas)
│   └── migration/
│       └── v1-to-v2.md                 # Guía de migración para cambios incompatibles
├── examples/
│   ├── README.md                       # Cómo ejecutar ejemplos
│   ├── basic-usage/
│   │   ├── package.json                # {"type":"module"} + dependencia local: file:
│   │   └── index.ts                    # Importa desde "../dist" — prueba salida de compilación real
│   ├── cjs-usage/
│   │   ├── package.json                # {"type":"commonjs"} — valida que funcione la exportación CJS
│   │   └── index.js
│   └── advanced/
│       ├── package.json
│       └── index.ts                    # Demuestra patrones de configuración compleja
├── src/
│   ├── index.ts                        # Punto de entrada del paquete: re-exporta toda superficie de API pública
│   ├── core/
│   │   ├── index.ts                    # Re-exportaciones para submódulo core
│   │   ├── client.ts                   # Clase/función principal — la exportación principal
│   │   ├── client.types.ts             # Interfaces TypeScript y tipos exportados
│   │   └── defaults.ts                 # Valores de configuración por defecto
│   ├── utils/
│   │   ├── index.ts
│   │   ├── validation.ts               # Ayudantes de validación de entrada (no exportados públicamente)
│   │   └── formatting.ts              # Utilidades de formato de string/datos
│   ├── errors/
│   │   ├── index.ts
│   │   └── errors.ts                   # Clases de error tipificadas extendiendo Error
│   └── internal/
│       └── symbols.ts                  # Símbolos privados — NO re-exportar desde src/index.ts
├── tests/
│   ├── core/
│   │   ├── client.test.ts              # Pruebas unitarias reflejando src/core/client.ts
│   │   └── client.types.test-d.ts     # Pruebas a nivel de tipo con expect-type (estilo tsd)
│   ├── utils/
│   │   ├── validation.test.ts
│   │   └── formatting.test.ts
│   ├── errors/
│   │   └── errors.test.ts
│   ├── fixtures/
│   │   └── sample-data.ts              # Fixtures compartidos de pruebas — importar en archivos de prueba
│   └── integration/
│       └── roundtrip.test.ts           # End-to-end: salida de compilación consumida por importación real
├── dist/                               # Salida compilada — gitignored, publicada en NPM
│   ├── index.js                        # Punto de entrada CJS
│   ├── index.mjs                       # Punto de entrada ESM
│   ├── index.d.ts                      # Punto de entrada de declaraciones de tipos
│   └── ...                             # .js/.mjs/.d.ts por archivo desde chunking de tsup
├── typedoc-out/                        # Salida HTML de TypeDoc — gitignored
├── .biome.json                         # Reglas Biome lint + format (reemplaza .eslintrc + .prettierrc)
├── .gitignore                          # dist/, typedoc-out/, node_modules/, coverage/
├── .npmignore                          # Excluir src/, tests/, docs/ del tarball de NPM
├── tsconfig.json                       # Base: strict, target ES2022, moduleResolution bundler
├── tsconfig.build.json                 # Extiende base; excluye tests/; usado por tsup
├── tsup.config.ts                      # Entry: src/index.ts; format: esm+cjs; dts: true
├── vitest.config.ts                    # Coverage: v8, include: src/**, exclude: src/internal/
├── .size-limit.json                    # Presupuesto por exportación: ESM <= 5kB, CJS <= 6kB (gzip)
├── typedoc.json                        # entryPoints: src/index.ts; out: typedoc-out/
├── CHANGELOG.md                        # Auto-generado por changesets — no editar manualmente
├── LICENSE
├── README.md
└── package.json                        # Mapa de exports, files, engines, peerDependencies
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `tsup.config.ts` | Declara `entry: ['src/index.ts']`, `format: ['esm', 'cjs']`, `dts: true`, `sourcemap: true`, `clean: true`; debe reflejar exactamente el mapa `exports` en `package.json` |
| `tsconfig.build.json` | Extiende `tsconfig.json`; establece `exclude: ['tests/**', 'examples/**']` para que TypeDoc y tsup salten tipos de prueba; nunca usado para IDE local — solo para CI y tsup |
| `.changeset/config.json` | Establece `access: "public"`, `baseBranch: "main"`, `changelog: "@changesets/cli/changelog"`; controla qué paquetes se actualizan juntos |
| `.size-limit.json` | Cada entrada establece `path`, `import` (exportación con nombre a medir), `limit` en bytes; CI falla PR si cualquier importación excede su presupuesto |
| `src/index.ts` | Fuente única de verdad para superficie de API pública; cada símbolo exportado aquí se publica — todo en `src/internal/` no debe aparecer aquí |
| `package.json` | Contiene mapa `exports` con condiciones `import`/`require`/`types`, `files: ["dist"]`, `engines: { "node": ">=18" }`, y `sideEffects: false` |
| `.github/workflows/release.yml` | Ejecuta `changesets/action` con `publish: pnpm release`; crea versión GitHub + publicación NPM atómicamente cuando se fusiona PR de Versión |
| `vitest.config.ts` | Establece `coverage.provider: 'v8'`, `coverage.include: ['src/**']`, `coverage.exclude: ['src/internal/**']`, `coverage.thresholds.lines: 90` |

## Scaffold rápido

```bash
# Requisitos previos: Node 20+, pnpm 9+

mkdir my-ts-library && cd my-ts-library
pnpm init

# Instalar TypeScript + herramientas de compilación
pnpm add -D typescript@5 tsup@8 @types/node

# Instalar Biome (reemplaza ESLint + Prettier)
pnpm add -D @biomejs/biome
pnpm biome init

# Instalar Vitest + cobertura
pnpm add -D vitest@2 @vitest/coverage-v8

# Instalar changesets
pnpm add -D @changesets/cli
pnpm changeset init

# Instalar size-limit
pnpm add -D size-limit @size-limit/preset-small-lib

# Instalar TypeDoc
pnpm add -D typedoc@0.26

# Instalar config Renovate (local del proyecto)
pnpm add -D renovate

# Crear directorios de origen
mkdir -p src/core src/utils src/errors src/internal
mkdir -p tests/core tests/utils tests/errors tests/fixtures tests/integration
mkdir -p docs/migration
mkdir -p examples/basic-usage examples/cjs-usage examples/advanced
mkdir -p .changeset .claude/commands .github/workflows

# Crear archivos de configuración
touch tsconfig.json tsconfig.build.json tsup.config.ts vitest.config.ts
touch .biome.json .size-limit.json typedoc.json
touch .gitignore .npmignore
touch src/index.ts src/core/index.ts src/core/client.ts
touch src/core/client.types.ts src/utils/index.ts src/errors/index.ts
touch tests/core/client.test.ts tests/fixtures/sample-data.ts
touch .github/workflows/ci.yml .github/workflows/release.yml
touch .github/renovate.json

# Agregar dist/ y directorios generados a .gitignore
printf 'dist/\ntypedoc-out/\ncoverage/\nnode_modules/\n*.tsbuildinfo\n' >> .gitignore

# Agregar mapa de exports de package.json (editar manualmente después del scaffold)
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

# Crear configuración Claude Code
touch .claude/settings.json
touch .claude/commands/new-export.md
touch .claude/commands/add-changeset.md
touch .claude/commands/size-check.md
touch .claude/commands/typedoc-preview.md

# Instalar skills de Claudient
npx claudient add skill productivity/doc-site-builder
npx claudient add skill testing/vitest
npx claudient add skill devops-infra/cicd

echo "Scaffold de biblioteca de código abierto completado. Ejecutar: pnpm install && pnpm build"
```

## Plantilla CLAUDE.md

```markdown
# my-ts-library

Biblioteca TypeScript publicada en NPM como paquete dual ESM + CJS. Toda API pública
vive en src/index.ts. Las pruebas reflejan estructura de src/ bajo tests/. Los lanzamientos son
manejados por changesets — nunca actualizar versión de package.json a mano.

## Stack

- TypeScript 5.x (strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess)
- tsup 8 — compilación dual ESM + CJS, generación .d.ts, source maps
- Vitest 2 — pruebas unitarias + cobertura V8; umbral: 90% cobertura de líneas
- Biome 1 — lint y formato (reemplaza ESLint + Prettier; una config, un comando)
- Changesets 2 — archivos changeset por PR impulsan CHANGELOG.md y publicación NPM
- size-limit 11 — presupuesto de tamaño de bundle reforzado en CI
- TypeDoc 0.26 — docs de API desde comentarios TSDoc, implementados en GitHub Pages
- GitHub Actions: ci.yml (puerta de PR), release.yml (publicación NPM al fusionar main)
- Renovate — PRs de dependencias automatizadas (minor/patch agrupados, major individual)

## Agregar nueva exportación — pasos exactos

1. Crear la implementación en el subdirectorio src/ correcto
   - Lógica: src/core/, src/utils/, o nuevo directorio src/[feature]/
   - Solo tipos: agregar a *.types.ts existente o crear [feature].types.ts
   - Ayudantes internos (no públicos): src/internal/ — NO re-exportar desde src/index.ts
2. Escribir bloque de comentario TSDoc en cada símbolo exportado (TypeDoc los analiza)
3. Agregar la exportación a src/index.ts
4. Crear archivo de prueba coincidente en tests/[same-path]/[filename].test.ts
5. Ejecutar pnpm typecheck — corregir todos errores de tipo antes de proceder
6. Ejecutar pnpm lint:fix — Biome auto-corrige la mayoría de problemas de estilo
7. Ejecutar pnpm test:coverage — confirmar que cobertura se mantiene arriba de 90%
8. Ejecutar pnpm build — confirmar que tsup produce dist/ sin errores
9. Ejecutar pnpm size — confirmar que nueva exportación está dentro del presupuesto (editar .size-limit.json si
   intencionalmente aumentó alcance; justificar en descripción de PR)
10. Usar comando /new-export para hacer scaffold de pasos 1–4 automáticamente

## Flujo de lanzamiento de Changeset

Cada PR que cambia comportamiento público (nueva exportación, corrección de bug, cambio incompatible)
necesita archivo changeset. Reglas de actualización: patch para correcciones de bug, minor para nuevas características
(compatibles hacia atrás), major para cambios incompatibles.

```bash
# Crear changeset interactivamente — ejecutar esto antes de hacer push a rama
pnpm changeset

# Después que PRs se fusionen a main, changesets/action crea "Version PR"
# que actualiza package.json y CHANGELOG.md. Fusionar ese PR para publicar en NPM.

# Dry-run para previsualizar qué sería publicado
pnpm changeset status

# Publicación manual de emergencia (solo si GitHub Actions release.yml está roto)
pnpm build && pnpm changeset publish
```

Nunca editar CHANGELOG.md a mano. Nunca ejecutar npm version o actualizar package.json
manualmente. changesets/action se encarga de ello.

## Escribir pruebas

- Reflejar layout de src/: src/core/client.ts -> tests/core/client.test.ts
- Importar solo desde rutas src/, nunca desde dist/
- Usar globals de Vitest (describe, it, expect) — sin importación necesaria (configurado en vitest.config.ts)
- Fixtures compartidos viven en tests/fixtures/sample-data.ts — agregar a esto, no duplicar
- Pruebas a nivel de tipo: tests/core/[name].test-d.ts usando expectTypeOf de vitest
- Ejecutar en watch mode durante desarrollo: pnpm test:watch
- Cobertura debe mantenerse en o por arriba de 90% líneas a través de src/ — CI falla de otra forma

## Disciplina de tamaño de bundle

- .size-limit.json define presupuesto para cada exportación nombrada (gzip, ESM)
- Ejecutar pnpm size localmente antes de hacer push a cualquier PR que agregue código nuevo
- Si nueva exportación genuinamente necesita más bytes, actualizar .size-limit.json y
  explicar el tradeoff en descripción de PR
- Nunca importar dependencias de terceros sin verificar su tamaño primero:
  usar bundlephobia.com o pnpm why para evaluar impacto
- Mantener src/internal/ para ayudantes que son tree-shaken de la compilación pública

## Ejecutar ejemplos

Los ejemplos importan desde salida local de dist/ — siempre compilar primero.

```bash
# Compilar la biblioteca
pnpm build

# Ejecutar ejemplo ESM
cd examples/basic-usage && pnpm install && pnpm tsx index.ts

# Ejecutar ejemplo CJS
cd examples/cjs-usage && pnpm install && node index.js

# Ejecutar ejemplo avanzado
cd examples/advanced && pnpm install && pnpm tsx index.ts
```

Si un ejemplo falla después de una compilación, el contrato de API pública puede haber roto.
Tratar fallos de ejemplo igual que fallos de prueba.

## Comandos comunes

| Comando | Qué hace |
|---|---|
| pnpm build | tsup: compilar + emitir .d.ts + source maps a dist/ |
| pnpm typecheck | tsc --noEmit contra tsconfig.json (todos archivos incluyendo pruebas) |
| pnpm lint | biome check . — reportar solo |
| pnpm lint:fix | biome check --write . — aplicar auto-fixes seguros |
| pnpm test | vitest run — paso único, sin watch |
| pnpm test:coverage | vitest run --coverage — abre reporte html en coverage/ |
| pnpm size | size-limit — comparar compilación actual a presupuestos en .size-limit.json |
| pnpm docs | typedoc — escribir HTML a typedoc-out/ |
| pnpm changeset | Interactivo: crear archivo changeset nuevo en .changeset/ |
| pnpm changeset status | Previsualizar actualizaciones de versión pendientes y entradas de changelog |

## Qué no hacer

- No exportar símbolos desde src/internal/ — no son parte de la API pública
- No editar CHANGELOG.md o actualizar versión de package.json manualmente
- No hacer commit a dist/ — está en gitignored y generado por CI antes de publicar
- No agregar dependencias a dependencies sin evaluar impacto de tamaño de bundle
- No usar ESLint o Prettier — Biome maneja ambos; agregar ambos crea conflictos
- No saltar escribir changeset para PR que toque src/ — CI te lo recordará
```

## Servidores MCP

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

## Skills para instalar

```bash
npx claudient add skill testing/vitest
npx claudient add skill devops-infra/cicd
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/changelog-writer
npx claudient add skill productivity/vendor-evaluator
```

## Relacionado

- [TypeScript Library Guide](../guides/typescript-library.md)
- [Changesets Release Workflow](../workflows/changesets-release.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
