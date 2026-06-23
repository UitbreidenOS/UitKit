# CLAUDE.md — Open Source Library (Annotated Example)
> NPM + PyPI dual-publish library — shows how to constrain Claude around semver discipline, backwards compatibility, changelog maintenance, and public API surface.

<!-- ANNOTATION: Open source libraries have a social contract with their users: semver. Claude must understand that changing a public API is not just a code change — it's a breaking change that requires a major version bump and a migration guide. -->
This is an open source library published to both NPM and PyPI. Semver is strictly followed. Any change to the public API surface is a breaking change requiring a major version bump. The library has ~8,000 dependents — backwards compatibility matters more than elegance.

## Package Info

- NPM: `@acme/utils` (TypeScript, ESM + CJS dual output)
- PyPI: `acme-utils` (Python 3.10+, typed)
- Both packages expose the same logical API — changes should be mirrored
- Current version: 2.4.1

## What Is "Public API"

<!-- ANNOTATION: Claude needs to know what counts as breaking. Without this definition, it may rename a parameter, change a return type, or remove an export thinking it's "just a refactor". These are all breaking changes. -->
The public API is anything exported from the package root (`index.ts` / `__init__.py`) and documented in the README. Breaking changes include:
- Removing or renaming an exported function/class/type
- Changing the type of a parameter or return value
- Adding a required parameter to an existing function
- Changing observable behavior (same input → different output)

Non-breaking changes:
- Adding new optional parameters with defaults
- Adding new exports
- Internal refactors with unchanged external behavior
- Performance improvements

## TypeScript (NPM Package)

```
src/
  index.ts          # Public exports — the API surface
  core/             # Implementation — not exported directly
  types.ts          # All public types — exported from index.ts
  internal/         # Types/utils marked @internal — not in public API
dist/
  esm/              # ES modules output
  cjs/              # CommonJS output
  types/            # .d.ts files
```

<!-- ANNOTATION: Dual ESM+CJS output has specific tsup/rollup configuration needs. Telling Claude the bundler prevents it from suggesting an incompatible build setup. -->
- Build tool: `tsup` — do not change the build configuration without testing both ESM and CJS outputs
- Target: ES2020 — no features beyond this
- No default exports — named exports only (tree-shaking friendly)
- All public types are in `src/types.ts` and re-exported from `src/index.ts`

## Python (PyPI Package)

```
acme_utils/
  __init__.py       # Public exports
  _internal/        # Private implementation (underscore prefix = not public API)
  py.typed          # PEP 561 marker
tests/
  test_*.py
```

- Python 3.10+ — use `match` statements and union types (`X | Y`) freely
- All public functions have full type annotations
- Use `__all__` in `__init__.py` to explicitly define the public API
- Private modules prefixed with `_` — never import these in external code

## Versioning and Changelog

<!-- ANNOTATION: The changelog is user-facing documentation. Claude must treat it as a first-class artifact, not an afterthought. The keep-a-changelog format means Claude can follow a template without inventing its own style. -->
- Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format
- Every PR that changes behavior must update `CHANGELOG.md`
- Sections: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`
- Do not write "various improvements" — be specific about what changed
- Breaking changes get a `### BREAKING CHANGES` subsection with migration instructions

## Deprecation Process

<!-- ANNOTATION: Libraries can't just remove things. The deprecation cycle (warn → remove) protects users who can't update immediately. Claude should follow it rather than proposing direct removal. -->
1. Add `@deprecated` JSDoc / Python `DeprecationWarning` in the current minor version
2. Document the replacement in the deprecation message
3. Remove in the next major version (minimum 2 minor releases after deprecation)
4. Do not skip the deprecation cycle — even for internal-looking APIs

## Testing Standards

<!-- ANNOTATION: Libraries need higher test coverage than applications because their bugs affect thousands of downstream projects. The 95% target is intentional and high. -->
- Coverage target: 95% on `src/` (TS) and `acme_utils/` (Python)
- Every public function has at least one test for: happy path, edge cases, error cases
- Add regression tests when fixing bugs — test must fail before fix, pass after
- TypeScript tests: Vitest; Python tests: pytest with pytest-cov
- Do not merge if tests fail

## CI / Release Process

```bash
# Local checks before PR
pnpm test && pnpm typecheck && pnpm build
python -m pytest --cov && python -m mypy acme_utils/

# Release (maintainers only)
pnpm changeset          # Describe changes
pnpm version            # Bumps versions
pnpm release            # Publishes to NPM + PyPI
```

## What Not To Do

<!-- ANNOTATION: The backwards compat rule is the heart of this entire file. Every other rule flows from the social contract that open source library authors have with their users. -->
- Do not remove or rename public exports without a deprecation cycle
- Do not add required parameters to existing public functions
- Do not merge a PR that breaks existing tests
- Do not add a runtime dependency without evaluating bundle size impact
- Do not use default exports — they break tree-shaking and named re-exports
- Do not publish without updating `CHANGELOG.md`
