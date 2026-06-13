# Go Rules

## Apply to
All Go files (`*.go`) in any project.

## Rules

1. **Errors are values — wrap with `%w`** — `fmt.Errorf("operation failed: %w", err)` preserves the original error for `errors.Is` and `errors.As` checks. Never discard errors with `_`.

2. **Table-driven tests** — use `[]struct{ name, input, want, wantErr }` patterns. Each case has a `t.Run(tt.name, ...)` sub-test. Makes test cases easy to add and failure messages descriptive.

3. **Context as first argument** — every function that does I/O or blocks takes `ctx context.Context` as its first parameter. Never store context in a struct.

4. **Define interfaces where they're consumed, not where implemented** — put the interface in the package that uses it, not the package that provides the implementation. Keeps packages decoupled.

5. **Interfaces 1-3 methods max** — larger interfaces are harder to satisfy and mock. If an interface has 8 methods, consider splitting it.

6. **`panic` only for truly unrecoverable programmer errors** — missing required configuration at startup, violated invariants that should never happen. Not for runtime errors like "record not found".

7. **No naked returns** — `return x, nil` not just `return`. Named return values are fine for documentation, but naked returns obscure what's being returned.

8. **`init()` only for package-level side effects with no alternative** — registration patterns, driver init. Never for loading config or establishing connections — that belongs in `main` or a constructor.

9. **`log/slog` for structured logging** — `slog.Info("request", "method", r.Method, "path", r.URL.Path)`. `fmt.Println` is for CLI output only.

10. **`sync.Once` for lazy singleton initialization** — thread-safe, zero overhead after first call:
    ```go
    var (
        instance *DB
        once     sync.Once
    )
    func GetDB() *DB {
        once.Do(func() { instance = newDB() })
        return instance
    }
    ```

11. **Embed don't inherit** — Go has no inheritance. Compose types via embedding: `type AdminUser struct { User; AdminLevel int }`. Use interfaces for polymorphism.

12. **Capture loop variables explicitly** — in goroutines inside loops: `i, v := i, v` before the `go func()`. In Go 1.22+, loop variables are per-iteration; in earlier versions they're shared.

13. **`errgroup` for concurrent operations with error propagation** — `golang.org/x/sync/errgroup` over manual `WaitGroup` when you need to return errors from goroutines.

14. **Sentinel errors for expected conditions, typed errors for structured errors** — `var ErrNotFound = errors.New("not found")` for simple conditions. Custom error types (implementing `error` interface) when callers need to inspect fields.

15. **HTTP handlers get only `(w http.ResponseWriter, r *http.Request)`** — don't embed handlers in structs or use closures for simple handlers. Use dependency injection via a handler struct with a `ServeHTTP` method when dependencies are needed.


---
