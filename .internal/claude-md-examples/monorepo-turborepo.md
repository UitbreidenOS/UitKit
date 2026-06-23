# CLAUDE.md — Turborepo Monorepo (Annotated Example)
> Multi-app, multi-package monorepo — shows how to tell Claude about workspace boundaries, shared packages, and which commands to run from which directory.

<!-- ANNOTATION: The critical fact for any monorepo CLAUDE.md: where to run commands. Claude defaults to the repo root; this section makes that explicit and lists the exceptions. -->
This is a Turborepo monorepo. Run all commands from the repo root unless otherwise specified. The package manager is pnpm with workspaces. Node 20 LTS.

## Workspace Layout

```
apps/
  web/          # Next.js 14 customer-facing app (port 3000)
  admin/        # Next.js 14 internal admin panel (port 3001)
  api/          # Express + tRPC API server (port 4000)
  docs/         # Docusaurus documentation site (port 3002)
packages/
  ui/           # Shared React component library
  types/        # Shared TypeScript types (no runtime code)
  utils/        # Shared utility functions
  config/
    eslint/     # Shared ESLint config
    typescript/ # Shared tsconfig bases
    tailwind/   # Shared Tailwind config
tooling/
  scripts/      # Repo-level automation scripts
```

## Commands

<!-- ANNOTATION: Turborepo pipeline commands work from the root. App-specific commands (migrations, seed) sometimes need to run from the app directory. Both cases are listed so Claude knows when to cd and when not to. -->
```bash
# From root — runs via Turborepo pipeline
pnpm dev                       # All apps in parallel
pnpm dev --filter=web          # Only the web app
pnpm dev --filter=web...       # web + its dependencies
pnpm build                     # Full production build (respects cache)
pnpm test                      # All tests
pnpm lint                      # All packages
pnpm typecheck                 # All packages

# App-specific (run from app directory)
cd apps/api && pnpm db:migrate  # Run pending Prisma migrations
cd apps/api && pnpm db:seed     # Seed development data
```

## Package Boundaries

<!-- ANNOTATION: Without explicit boundary rules, Claude may create circular dependencies or put shared code in the wrong package. These rules tell it the dependency direction: apps depend on packages, packages don't depend on apps. -->
- Apps can depend on `packages/*` — packages must NOT depend on apps
- `packages/types` has zero runtime dependencies — types only
- `packages/ui` depends on React but is framework-agnostic beyond that — no Next.js imports
- `packages/config/*` are dev-dependency-only — never imported at runtime
- Adding a new shared utility: put it in `packages/utils` and export from `packages/utils/index.ts`

## TypeScript Configuration

<!-- ANNOTATION: TypeScript project references in a monorepo are subtle. This tells Claude to extend the shared base configs rather than write tsconfig from scratch, avoiding common misconfiguration. -->
- All `tsconfig.json` files extend from `packages/config/typescript/`
- Use `base.json` for non-React packages, `nextjs.json` for Next.js apps
- Path aliases (`@/`) are configured per-app in their own tsconfig — do not rely on them cross-package
- `packages/types` is included via project references, not node_modules — use `/// <reference types>` if needed

## tRPC API

<!-- ANNOTATION: tRPC has a specific router pattern. Naming the file location and the pattern prevents Claude from recreating the router or writing REST endpoints for new features that should be tRPC procedures. -->
- tRPC router root is at `apps/api/src/router/index.ts`
- Add new procedures as sub-routers in `apps/api/src/router/[domain].ts`
- The tRPC client is initialized in `packages/utils/trpc.ts` and shared across apps
- Use Zod for all input validation on procedures
- Subscriptions use server-sent events — the transport is configured in `apps/api/src/server.ts`

## Shared UI Components

<!-- ANNOTATION: "Don't re-implement" is important because Claude may not know a component already exists in the shared library. It's better to tell it to check first. -->
- Before creating a new component in an app, check `packages/ui/` — it may already exist
- New shared components go in `packages/ui/components/` and must be exported from `packages/ui/index.ts`
- Component stories live alongside components: `Button.tsx` + `Button.stories.tsx`
- Storybook runs from `packages/ui`: `cd packages/ui && pnpm storybook`

## Turborepo Cache

<!-- ANNOTATION: Turborepo's remote cache is a team feature. Claude should not suggest disabling it when debugging — that's a footgun. Instead, it should know the bypass flag for single-task debugging. -->
- Remote cache is enabled for CI — do not disable it
- To force a rebuild without cache: `pnpm build --force`
- Cache inputs are defined in `turbo.json` — update `inputs` when adding new config files that affect builds
- Do not add `outputs` to `turbo.json` for tasks that don't produce artifacts

## Adding a New App

When scaffolding a new app in `apps/`:
1. Copy the `packages/config/typescript/base.json` tsconfig pattern
2. Add it to the `pnpm-workspace.yaml` `packages` list
3. Add a `dev` and `build` script to its `package.json`
4. Turborepo will pick it up automatically — no changes to `turbo.json` needed for standard pipelines

## CI

- GitHub Actions — workflows in `.github/workflows/`
- Turborepo remote cache is authenticated via `TURBO_TOKEN` secret
- Each PR runs: typecheck, lint, test, build
- Deploy is triggered on merge to `main`

## What Not To Do

<!-- ANNOTATION: Cross-package circular deps and breaking shared package APIs are the two most expensive mistakes in a monorepo. Both are named explicitly. -->
- Do not create circular dependencies between packages
- Do not import from `apps/*` inside `packages/*`
- Do not add app-specific code to `packages/ui` — it's a shared library
- Do not modify `packages/config/*` without checking that all apps still pass typecheck
- Do not run `pnpm install` inside a specific app — always run from root
- Do not commit changes to `pnpm-lock.yaml` alongside unrelated changes
