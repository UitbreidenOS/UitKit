# CLAUDE.md — Rust CLI Tool (Annotated Example)
> Rust CLI published to crates.io — shows how to express Rust-specific idioms, edition constraints, MSRV, and the publication checklist Claude should follow before releasing.

<!-- ANNOTATION: Rust edition and MSRV are load-bearing facts. Claude needs the edition to use the right syntax, and the MSRV to avoid using APIs unavailable on older compilers. Users on stable distros may be several versions behind. -->
This is a Rust CLI tool targeting Rust 2021 edition. Minimum Supported Rust Version (MSRV) is 1.75.0. Published to crates.io. The binary name is `flux`.

## Crate Structure

```
src/
  main.rs          # Entry point — arg parsing only, delegates to lib
  lib.rs           # Public API (also used for integration tests)
  cli/             # clap argument definitions
  commands/        # One module per subcommand
  config/          # Config file parsing and validation
  output/          # Output formatting (plain, JSON, color)
  error.rs         # Error types (thiserror)
tests/
  integration/     # Integration tests using assert_cmd
benches/           # Criterion benchmarks
```

## Dependencies Philosophy

<!-- ANNOTATION: Rust CLI crates have a well-known set of "blessed" dependencies. Naming them prevents Claude from reaching for heavier alternatives (e.g., structopt instead of clap v4) or reimplementing things that tokio/rayon already solve. -->
- CLI parsing: `clap` v4 with derive macros — no `structopt`, no manual `ArgMatches`
- Error handling: `thiserror` for library errors, `anyhow` for `main()` and command handlers
- Serialization: `serde` + `serde_json` + `serde_yaml` — already in tree
- HTTP: `ureq` (sync, minimal) — we do not use `reqwest` (async overkill for CLI)
- Terminal output: `crossterm` for colors/styles, `indicatif` for progress bars
- Testing: `assert_cmd` + `predicates` for integration tests

## Error Handling Rules

<!-- ANNOTATION: The library vs binary error handling split is a Rust idiom that Claude may not apply consistently. Making it explicit ensures proper error propagation patterns throughout the codebase. -->
- In `src/lib.rs` and `src/commands/`: return `Result<T, FluxError>` (our typed error)
- In `src/main.rs`: use `anyhow::Result` and `?` — top-level error becomes the CLI error message
- Never `unwrap()` or `expect()` in non-test code unless the invariant is truly unreachable (add a comment explaining why)
- All error variants in `error.rs` implement `thiserror::Error` with human-readable messages

## Clap Conventions

<!-- ANNOTATION: clap v4 derive syntax differs from v3. These conventions prevent mixing old and new patterns, and the short/long flag rule keeps the UX consistent. -->
- All commands and flags use the derive API (`#[derive(Parser)]`) — no builder API
- Every flag has both a short and long form unless it's rare/dangerous
- Subcommands live in `src/cli/commands.rs` and are forwarded to `src/commands/`
- Help text in `#[arg(help = "...")]` must be one sentence, no trailing period
- Add `#[command(version, about)]` to the root struct — version comes from `Cargo.toml`

## Code Style

<!-- ANNOTATION: Rust style is largely handled by rustfmt, but Claude sometimes fights it with manual formatting. "Let rustfmt own it" is a strong instruction that prevents style drift. -->
- `rustfmt` owns formatting — do not manually format code, let `cargo fmt` handle it
- `clippy` must pass with no warnings: `cargo clippy -- -D warnings`
- Prefer iterators over manual loops for transformations
- Use `impl Trait` in function signatures when the concrete type is unimportant
- Structs with > 3 fields use named initialization — no positional struct literals

## Testing

```bash
cargo test                    # All unit + integration tests
cargo test --test integration # Integration tests only
cargo bench                   # Criterion benchmarks
cargo clippy -- -D warnings   # Lint (CI-blocking)
```

<!-- ANNOTATION: assert_cmd integration test pattern is the right tool for CLI testing. Naming it prevents Claude from writing brittle shell script tests or subprocess tests by hand. -->
Integration tests use `assert_cmd::Command::cargo_bin("flux")` — they test the binary directly. Unit tests are in `#[cfg(test)]` modules inside source files.

## MSRV Compliance

<!-- ANNOTATION: This is the practical implication of the MSRV. Claude may use const generics, GATs, or let-else that are unavailable on 1.75. The check command makes it testable. -->
- Do not use language features introduced after Rust 1.75
- Check `rust-version` in `Cargo.toml` before adding a new dependency — some crates have higher MSRVs
- Run `cargo +1.75.0 check` before raising the MSRV

## Publication Checklist

<!-- ANNOTATION: crates.io publication is irreversible in the sense that yanked versions remain visible. A checklist prevents shipping with missing metadata, broken docs, or wrong version bumps. -->
Before `cargo publish`:
1. Update `CHANGELOG.md` with the version and date
2. Bump version in `Cargo.toml` following semver — breaking changes require a major bump
3. Run `cargo test --release`
4. Run `cargo doc --no-deps` and check for broken doc links
5. Run `cargo package --list` to verify only intended files are included
6. Tag the commit: `git tag v{version}`
7. `cargo publish --dry-run` first

## What Not To Do

<!-- ANNOTATION: unwrap() in production code is the single most common Rust mistake Claude makes. It's listed first and with emphasis because it causes panics instead of user-friendly errors. -->
- Do not `unwrap()` or `expect()` in production code paths
- Do not add `async` unless the operation is genuinely I/O-bound and concurrent — this is a sync CLI
- Do not use `Box<dyn Error>` in library code — use the typed `FluxError`
- Do not bump MSRV without updating `Cargo.toml` and the README badge
- Do not add `unsafe` code without a written safety comment explaining the invariant
- Do not use `eprintln!` for errors — route through the error type and let `main` print it
