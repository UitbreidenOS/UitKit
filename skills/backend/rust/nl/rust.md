# Rust Development

## Wanneer activeren
- Schrijven of reviewen van Rust code met ownership, borrow checker, of lifetime errors
- Ontwerpen van error handling strategie met `Result`, `thiserror`, of `anyhow`
- Bouwen van async services met Tokio
- Structureren van multi-crate Cargo workspace
- Selecteren van smart pointer types (`Box`, `Rc`, `Arc`, `Mutex`, `RwLock`)
- Configureren van Clippy lints voor project
- Implementeren van traits en kiezen tussen trait objects vs generics

## Wanneer NIET gebruiken
- Schrijven van non-Rust code dat Rust-adjacent concepten delen
- Algemene systems programming vragen die Rust niet specifiek betreffen
- Debugging C/C++ interop wanneer issue aan C side is

## Instructies

### Ownership Transfer vs Borrowing

Move semantics zijn default. Prefer borrowing (`&T` of `&mut T`) wanneer callee ownership niet nodig heeft.

```rust
// Transfer ownership — callee owns the String
fn consume(s: String) { /* s is dropped here */ }

// Immutable borrow — caller retains ownership
fn inspect(s: &str) { println!("{}", s); }

// Mutable borrow — caller retains ownership, one active at a time
fn append(s: &mut String) { s.push_str(" world"); }
```

Rules voor kiezen:
- Pass `&T` wanneer functie alleen leest
- Pass `&mut T` wanneer functie in plaats modifieert en caller value daarna nodig heeft
- Pass `T` (move) wanneer callee value sla op, spawn over threads, of bouw owned collection

### Smart Pointer Selection

| Type | Use case |
|---|---|
| `Box<T>` | Heap-allocate single owner; recursive types; trait objects |
| `Rc<T>` | Shared ownership in single-threaded code; reference-counted |
| `Arc<T>` | Shared ownership across threads; atomic reference count |
| `Mutex<T>` | Exclusive mutable access across threads |
| `RwLock<T>` | Multiple concurrent readers OR one writer |
| `Cell<T>` / `RefCell<T>` | Interior mutability in single-threaded code |

```rust
use std::sync::{Arc, Mutex};

// Shared mutable state across threads
let counter = Arc::new(Mutex::new(0u64));
let c = Arc::clone(&counter);
std::thread::spawn(move || {
    let mut n = c.lock().unwrap();
    *n += 1;
});
```

### Error Handling with Result and thiserror

Definieer domain errors als enums met `thiserror::Error`:

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("not found: {resource} id={id}")]
    NotFound { resource: &'static str, id: i64 },

    #[error("invalid input: {0}")]
    Validation(String),
}

pub type AppResult<T> = Result<T, AppError>;
```

Gebruik `?` propageerfouten omhoog de call stack. Converteer tussen error types met `#[from]` op enum variant.

### Async / Await with Tokio

```rust
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // async context available here
    run().await
}
```

Spawn concurrent tasks met `tokio::spawn`. Join fixed set met `tokio::join!`, dynamic set met `tokio::task::JoinSet`:

```rust
let mut set = tokio::task::JoinSet::new();
for id in ids {
    set.spawn(fetch_user(id, pool.clone()));
}
while let Some(result) = set.join_next().await {
    let user = result??;   // outer ? = JoinError, inner ? = AppError
    process(user);
}
```

### Cargo Workspace for Multi-Crate Projects

```
my-project/
├── Cargo.toml          # workspace root
├── crates/
│   ├── core/           # domain logic, no I/O
│   ├── api/            # axum HTTP layer
│   ├── worker/         # Tokio background jobs
│   └── cli/            # binary entry point
```

Root `Cargo.toml`:

```toml
[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
thiserror = "1"
```

---
