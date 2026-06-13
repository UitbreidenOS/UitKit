# Desarrollo Rust

## Cuándo activar
- Escritura o revisión de código Rust con propiedad, borrow checker, o errores de lifetime
- Diseño de estrategia de manejo de errores usando `Result`, `thiserror`, o `anyhow`
- Construcción de servicios async con Tokio
- Estructuración de un workspace Cargo de múltiples crates
- Selección de tipos de puntero inteligente (`Box`, `Rc`, `Arc`, `Mutex`, `RwLock`)
- Configuración de lints de Clippy para un proyecto
- Implementación de traits y decisión entre objetos trait vs genéricos

## Cuándo NO usar
- Escritura de código que no es Rust que comparte conceptos relacionados con Rust
- Preguntas generales de programación de sistemas que no involucran específicamente Rust
- Depuración de interop C/C++ cuando el problema está en el lado C

## Instrucciones

### Transferencia de Propiedad vs Préstamo

La semántica de movimiento es la predeterminada. Preferir préstamo (`&T` o `&mut T`) cuando el destinatario no necesita poseer el valor.

```rust
// Transfer ownership — callee owns the String
fn consume(s: String) { /* s is dropped here */ }

// Immutable borrow — caller retains ownership
fn inspect(s: &str) { println!("{}", s); }

// Mutable borrow — caller retains ownership, one active at a time
fn append(s: &mut String) { s.push_str(" world"); }
```

Reglas para elegir:
- Pasar `&T` cuando la función solo lee
- Pasar `&mut T` cuando la función modifica in-place y la llamada necesita el valor después
- Pasar `T` (move) cuando el destinatario almacena el valor, lo genera entre threads, o construye una colección poseída
- Usar `Clone` deliberadamente, no reflexivamente — señala un costo de copia profunda

### Selección de Puntero Inteligente

| Type | Caso de uso |
|---|---|
| `Box<T>` | Asignar en heap un único propietario; tipos recursivos; objetos trait |
| `Rc<T>` | Propiedad compartida en código single-threaded; reference-counted |
| `Arc<T>` | Propiedad compartida entre threads; atomic reference count |
| `Mutex<T>` | Acceso mutable exclusivo entre threads |
| `RwLock<T>` | Múltiples lectores concurrentes O un escritor |
| `Cell<T>` / `RefCell<T>` | Interior mutability en código single-threaded |

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

Evitar `Rc` en código que puede después volverse concurrente — preferir `Arc` si el tipo cruzará límites de thread.

### Manejo de Errores con Result y thiserror

Definir errores de dominio como enums con `thiserror::Error`:

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

Usar `?` para propagar errores hacia arriba en la pila de llamadas. Convertir entre tipos de error con `#[from]` en la variante enum. Reservar `anyhow` para binarios de nivel de aplicación donde detalle de tipo de error no es necesario en el sitio de llamada; usar `thiserror` en librerías.

```rust
async fn fetch_user(id: i64, pool: &PgPool) -> AppResult<User> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(pool)
        .await?                                          // sqlx::Error -> AppError::Database via #[from]
        .ok_or(AppError::NotFound { resource: "user", id })?;
    Ok(user)
}
```

### Async / Await con Tokio

Agregar Tokio con la característica `full` para la mayoría de servicios:

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

Punto de entrada:

```rust
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // async context available here
    run().await
}
```

Generar tareas concurrentes con `tokio::spawn`. Unirse a un conjunto fijo con `tokio::join!`, un conjunto dinámico con `tokio::task::JoinSet`:

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

Usar `tokio::select!` para correr futuras o manejar cancelación. Siempre propagar cancelación correctamente — funciones `async` no deben mantener locks no-async entre puntos `.await`.

### Objetos Trait vs Genéricos

Genéricos (monomorphisation): costo de tiempo de ejecución cero, binario más grande, compilador resuelve tipo en tiempo de compilación.

```rust
fn log_event<E: Event>(event: &E) {
    println!("{}", event.summary());
}
```

Objetos trait (`dyn Trait`): dispatch en tiempo de ejecución, asignación en heap, funciona con colecciones heterogéneas.

```rust
fn log_event(event: &dyn Event) {
    println!("{}", event.summary());
}

let handlers: Vec<Box<dyn Handler>> = vec![Box::new(EmailHandler), Box::new(SlackHandler)];
```

Preferir genéricos en librerías para rendimiento. Preferir `dyn Trait` cuando se almacenan tipos concretos mixtos o cuando tiempos de compilación importan más que costo de dispatch en tiempo de ejecución.

### Workspace Cargo para Proyectos Multi-Crate

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

Ejecutar workspace-wide: `cargo build --workspace`, `cargo test --workspace`, `cargo clippy --workspace`.

### Lints de Clippy

Habilitar conjunto de lint estricto en raíz de workspace o por crate:

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

Ejecutar en CI: `cargo clippy --workspace --all-targets -- -D warnings`

## Ejemplo

Construcción de un servicio HTTP basado en Tokio con errores tipados:

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

---
