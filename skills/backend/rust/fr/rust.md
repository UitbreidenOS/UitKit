# Développement Rust

## Quand activer
- Écriture ou examen du code Rust avec propriété, emprunteur, ou erreurs de durée de vie
- Conception de la stratégie de gestion des erreurs utilisant `Result`, `thiserror`, ou `anyhow`
- Construction de services asynchrones avec Tokio
- Structuration d'un workspace Cargo multi-crates
- Sélection des types de pointeurs intelligents (`Box`, `Rc`, `Arc`, `Mutex`, `RwLock`)
- Configuration des lints Clippy pour un projet
- Implémentation de traits et décision entre objets de trait vs génériques

## Quand ne PAS utiliser
- Écriture de code non-Rust partageant des concepts proches de Rust
- Questions générales de programmation système ne concernant pas spécifiquement Rust
- Débogage de l'interopérabilité C/C++ quand le problème est côté C

## Instructions

### Transfert de propriété vs emprunt

La sémantique de déplacement est par défaut. Préférer l'emprunt (`&T` ou `&mut T`) quand l'appelé n'a pas besoin de posséder la valeur.

```rust
// Transfer ownership — callee owns the String
fn consume(s: String) { /* s is dropped here */ }

// Immutable borrow — caller retains ownership
fn inspect(s: &str) { println!("{}", s); }

// Mutable borrow — caller retains ownership, one active at a time
fn append(s: &mut String) { s.push_str(" world"); }
```

Règles pour choisir :
- Passer `&T` quand la fonction ne fait que lire
- Passer `&mut T` quand la fonction modifie sur place et l'appelant a besoin de la valeur après
- Passer `T` (déplacement) quand l'appelé stocke la valeur, la lance entre threads, ou construit une collection possédée
- Utiliser `Clone` délibérément, pas réflexivement — cela signale un coût de copie profonde

### Sélection de pointeur intelligent

| Type | Cas d'utilisation |
|---|---|
| `Box<T>` | Allouer un propriétaire unique ; types récursifs ; objets de trait |
| `Rc<T>` | Propriété partagée dans code single-threaded ; reference-counted |
| `Arc<T>` | Propriété partagée entre threads ; atomic reference count |
| `Mutex<T>` | Accès mutable exclusif entre threads |
| `RwLock<T>` | Plusieurs lecteurs concurrents OU un writer |
| `Cell<T>` / `RefCell<T>` | Mutabilité intérieure dans code single-threaded |

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

Éviter `Rc` dans le code qui pourrait devenir concurrent — préférer `Arc` si le type traversera les limites de threads.

### Gestion des erreurs avec Result et thiserror

Définir les erreurs de domaine comme énumérations avec `thiserror::Error` :

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

Utiliser `?` pour propager les erreurs vers le haut de la pile d'appels. Convertir entre types d'erreurs avec `#[from]` sur la variante énumération. Réserver `anyhow` pour les binaires au niveau application où la détail du type d'erreur n'est pas nécessaire au site d'appel ; utiliser `thiserror` dans les bibliothèques.

```rust
async fn fetch_user(id: i64, pool: &PgPool) -> AppResult<User> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(pool)
        .await?
        .ok_or(AppError::NotFound { resource: "user", id })?;
    Ok(user)
}
```

### Async / Await avec Tokio

Ajouter Tokio avec la fonctionnalité `full` pour la plupart des services :

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

Point d'entrée :

```rust
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // async context available here
    run().await
}
```

Générer des tâches concurrentes avec `tokio::spawn`. Joindre un ensemble fixe avec `tokio::join!`, un ensemble dynamique avec `tokio::task::JoinSet` :

```rust
let mut set = tokio::task::JoinSet::new();
for id in ids {
    set.spawn(fetch_user(id, pool.clone()));
}
while let Some(result) = set.join_next().await {
    let user = result??;
    process(user);
}
```

Utiliser `tokio::select!` pour les futures en compétition ou gestion de l'annulation. Toujours propager l'annulation correctement — les fonctions `async` ne devraient pas tenir des verrous non-async sur les points `.await`.

### Objets de trait vs génériques

Génériques (monomorphisation) : coût d'exécution zéro, binaire plus grand, le compilateur résout le type au moment de la compilation.

```rust
fn log_event<E: Event>(event: &E) {
    println!("{}", event.summary());
}
```

Objets de trait (`dyn Trait`) : dispatch d'exécution, allocation heap, fonctionne avec des collections hétérogènes.

```rust
fn log_event(event: &dyn Event) {
    println!("{}", event.summary());
}

let handlers: Vec<Box<dyn Handler>> = vec![Box::new(EmailHandler), Box::new(SlackHandler)];
```

Préférer les génériques dans les bibliothèques pour la performance. Préférer `dyn Trait` quand stocker des types concrets mixtes ou quand les temps de compilation importent plus que le coût du dispatch d'exécution.

### Workspace Cargo pour projets multi-crates

```
my-project/
├── Cargo.toml
├── crates/
│   ├── core/
│   ├── api/
│   ├── worker/
│   └── cli/
```

`Cargo.toml` racine :

```toml
[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.dependencies]
tokio = { version = "1", features = ["full"] }
thiserror = "1"
```

Membre `Cargo.toml` hérite des dépendances workspace :

```toml
[dependencies]
tokio.workspace = true
thiserror.workspace = true
```

Exécuter workspace-wide : `cargo build --workspace`, `cargo test --workspace`, `cargo clippy --workspace`.

### Lints Clippy

Activer un ensemble strict de lints :

```rust
#![warn(
    clippy::all,
    clippy::pedantic,
    clippy::unwrap_used,
    clippy::expect_used,
)]
```

Exécuter en CI : `cargo clippy --workspace -- -D warnings`

## Exemple

Construction d'un service HTTP basé sur Tokio avec erreurs typées :

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
    let pool = Arc::new(sqlx::PgPoolOptions::new()
        .max_connections(20)
        .connect(&std::env::var("DATABASE_URL")?).await?);

    let app = Router::new()
        .route("/users/:id", get(get_user))
        .with_state(pool);

    axum::Server::bind(&"0.0.0.0:3000".parse()?)
        .serve(app.into_make_service_with_connect_info::<std::net::SocketAddr>())
        .await?;
    Ok(())
}
```

---
