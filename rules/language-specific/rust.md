# Rust Rules

## Apply to
All Rust files (`*.rs`) in any project.

## Rules

1. **Prefer `&str` over `String` for function parameters** — accept the most permissive type. Only use `String` in parameters when you need ownership or storage.

2. **Use `thiserror` for library errors, `anyhow` for application errors** — `thiserror` gives typed, composable errors. `anyhow` is ergonomic for binaries where callers don't match on error variants.

3. **Never use `.unwrap()` in production paths** — use `?` to propagate, `.expect("invariant reason")` when failure is a bug and the message explains why it can't happen, `if let` or `match` for recoverable cases.

4. **Prefer `impl Trait` over dynamic dispatch unless the type is unknown at compile time** — `fn process(iter: impl Iterator<Item = u32>)` is faster and avoids heap allocation. Use `dyn Trait` only for heterogeneous collections or plugin interfaces.

5. **Derive `Debug` on every type you own** — non-`Debug` types break logging, test assertions, and error formatting. Add `Display` only when there's a user-facing string representation.

6. **Avoid `clone()` in hot paths** — it signals a design issue. Restructure lifetimes or use `Rc`/`Arc` where shared ownership is genuinely needed.

7. **Use `#[must_use]` on types and functions whose return values are critical** — `Result`, `Future`, and sentinel types should be annotated so the compiler warns when the caller discards them.

8. **Prefer iterators over manual index loops** — `iter().filter().map().collect()` is idiomatic, bounds-checked, and often optimized better. Index loops invite off-by-one errors.

9. **Make illegal states unrepresentable via types** — model state machines as enums with associated data. Prefer `Option<T>` over sentinel values like `-1` or empty strings.

10. **Use `clippy` and `rustfmt` in CI** — `cargo clippy -- -D warnings` fails the build on lint violations. `cargo fmt --check` enforces formatting. No exceptions.

11. **Group `use` statements: std, external crates, internal modules** — consistent ordering makes imports scannable. `rustfmt` enforces this with `imports_granularity`.

12. **Keep `unsafe` blocks minimal and document invariants** — every `unsafe` block must have a comment explaining what invariant the caller upholds and why the safe abstraction cannot express it.

13. **Prefer `Arc<Mutex<T>>` over `Rc<RefCell<T>>` in async contexts** — `Rc` and `RefCell` are `!Send`. In async or multi-threaded code, runtime panics from `RefCell` misuse are hard to debug.

14. **Use `cargo-deny` or `cargo-audit` in CI** — catch yanked crates and known vulnerabilities before they reach production.

15. **Pin dependency versions in `Cargo.lock` for binaries, not libraries** — commit `Cargo.lock` for applications. Libraries should leave resolution to the consumer.


---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
