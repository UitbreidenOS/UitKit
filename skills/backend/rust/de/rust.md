# Rust Development

## Wann aktivieren
- Schreiben oder Überprüfung von Rust Code mit Ownership, Borrow Checker oder Lifetime Fehlern
- Designen einer Error Handling Strategie mit `Result`, `thiserror` oder `anyhow`
- Aufbau von Async Services mit Tokio
- Strukturierung eines Multi-Crate Cargo Workspace
- Auswahl von Smart Pointer Typen (`Box`, `Rc`, `Arc`, `Mutex`, `RwLock`)
- Konfigurierung von Clippy Lints für ein Projekt
- Implementierung von Traits und Entscheidung zwischen Trait Objects vs Generics

## Wann NICHT verwenden
- Schreiben von Nicht-Rust Code, der Rust-benachbarte Konzepte teilt
- Allgemeine Systems Programming Fragen, die nicht spezifisch Rust betreffen
- Debugging von C/C++ Interop, wenn das Problem auf C-Seite ist

## Anweisungen

### Ownership Transfer vs Borrowing

Move Semantics sind die Standard. Bevorzugen Sie Borrowing (`&T` oder `&mut T`), wenn der Aufgerufene den Wert nicht besitzen muss.

```rust
// Transfer ownership — callee owns the String
fn consume(s: String) { /* s is dropped here */ }

// Immutable borrow — caller retains ownership
fn inspect(s: &str) { println!("{}", s); }

// Mutable borrow — caller retains ownership, one active at a time
fn append(s: &mut String) { s.push_str(" world"); }
```

Rules für die Auswahl:
- Pass `&T`, wenn die Funktion nur liest
- Pass `&mut T`, wenn die Funktion in-place modifiziert und der Aufrufer den Wert danach benötigt
- Pass `T` (move), wenn der Aufgerufene den Wert speichert, über Threads spawnt oder eine eigene Collection baut
- Verwenden Sie `Clone` bewusst, nicht reflexiv — es signalisiert einen Deep Copy Cost

### Smart Pointer Selection

| Type | Use case |
|---|---|
| `Box<T>` | Heap-allocate a single owner; recursive types; trait objects |
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

Vermeiden Sie `Rc` in Code, der später konkurrent werden könnte — bevorzugen Sie `Arc`, wenn der Typ Thread Grenzen kreuzen wird.

### Error Handling mit Result und thiserror

Definieren Sie Domain Errors als Enums mit `thiserror::Error`:

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

Verwenden Sie `?`, um Fehler den Call Stack hochzupropagieren. Konvertieren Sie zwischen Error Typen mit `#[from]` auf der Enum Variant. Reservieren Sie `anyhow` für Application-Level Binaries, wo Error Type Detail am Call Site nicht benötigt wird; verwenden Sie `thiserror` in Libraries.

```rust
async fn fetch_user(id: i64, pool: &PgPool) -> AppResult<User> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(pool)
        .await?                                          // sqlx::Error -> AppError::Database via #[from]
        .ok_or(AppError::NotFound { resource: "user", id })?;
    Ok(user)
}
```

### Async / Await mit Tokio

Fügen Sie Tokio mit dem `full` Feature für die meisten Services hinzu:

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

Entry Point:

```rust
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // async context available here
    run().await
}
```

Spawn Concurrent Tasks mit `tokio::spawn`. Join ein festes Set mit `tokio::join!`, ein dynamisches Set mit `tokio::task::JoinSet`:

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

Verwenden Sie `tokio::select!` zum Racen von Futures oder Handling von Cancellation. Propagieren Sie Cancellation immer korrekt — `async` Funktionen sollten nicht Non-Async-Locks über `.await` Punkte halten.

### Trait Objects vs Generics

Generics (Monomorphisation): Zero Runtime Cost, größeres Binary, Compiler löst Type beim Compile Time auf.

```rust
fn log_event<E: Event>(event: &E) {
    println!("{}", event.summary());
}
```

Trait Objects (`dyn Trait`): Runtime Dispatch, Heap Allocation, funktioniert mit Heterogenous Collections.

```rust
fn log_event(event: &dyn Event) {
    println!("{}", event.summary());
}

let handlers: Vec<Box<dyn Handler>> = vec![Box::new(EmailHandler), Box::new(SlackHandler)];
```

Bevorzugen Sie Generics in Libraries für Leistung. Bevorzugen Sie `dyn Trait`, wenn Mixed Concrete Types speichern oder wenn Compile Times wichtiger sind als Runtime Dispatch Cost.

### Cargo Workspace für Multi-Crate Projekte

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

Member `Cargo.toml` erbt Workspace Dependencies, um Versionen konsistent zu halten:

```toml
[dependencies]
tokio.workspace = true
thiserror.workspace = true
```

Führen Sie Workspace-weit aus: `cargo build --workspace`, `cargo test --workspace`, `cargo clippy --workspace`.

### Clippy Lints

Aktivieren Sie einen strikten Lint-Set im Workspace Root oder pro Crate:

```rust
// lib.rs or main.rs
#![warn(
    clippy::all,
    clippy::pedantic,
    clippy::nursery,
    clippy::unwrap_used,       // require explicit error handling
    clippy::expect_used,       // document why expect is safe
    clippy::panic,
    clippy::indexing_slicing,
)]
#![allow(
    clippy::module_name_repetitions,
    clippy::must_use_candidate,
)]
```

Ausführen in CI: `cargo clippy --workspace --all-targets -- -D warnings`

Wichtige Lints zum Verstehen:
- `clippy::unwrap_used` — erzwingt Handling von `None`/`Err` statt zu panicken
- `clippy::clone_on_ref_ptr` — warnt, wenn `Arc`/`Rc` direkt geklont werden statt `Arc::clone` zu verwenden
- `clippy::large_futures` — warnt, wenn eine Future groß genug ist, um Boxing zu rechtfertigen
- `clippy::redundant_closure_for_method_calls` — fängt `.map(|x| x.foo())` → `.map(Foo::foo)` auf

## Beispiel

Aufbau eines Tokio-basierten HTTP Service mit typisierten Errors:

```rust
// crates/core/src/error.rs
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ServiceError {
    #[error("database: {0}")]
    Db(#[from] sqlx::Error),
    #[error("not found")]
    NotFound,
}

// crates/api/src/main.rs
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = PgPoolOptions::new()
        .max_connections(20)
        .connect(&std::env::var("DATABASE_URL")?).await?;

    let pool = Arc::new(pool);

    let app = Router::new()
        .route("/users/:id", get(get_user))
        .with_state(pool);

    axum::Server::bind(&"0.0.0.0:3000".parse()?)
        .serve(app.into_make_service())
        .await?;
    Ok(())
}

async fn get_user(
    Path(id): Path<i64>,
    State(pool): State<Arc<PgPool>>,
) -> Result<Json<User>, StatusCode> {
    fetch_user(id, &pool).await
        .map(Json)
        .map_err(|e| match e {
            ServiceError::NotFound => StatusCode::NOT_FOUND,
            ServiceError::Db(_) => StatusCode::INTERNAL_SERVER_ERROR,
        })
}
```

Ausführung:
```bash
cargo clippy --workspace -- -D warnings
cargo test --workspace
cargo build --release
```

---
