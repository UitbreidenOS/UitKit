# Reglas de Rust

## Aplicar a
Todos los archivos Rust (`*.rs`) en cualquier proyecto.

## Reglas

1. **Preferir `&str` sobre `String` para parámetros de función** — acepta el tipo más permisivo. Solo usa `String` en parámetros cuando necesites propiedad o almacenamiento.

2. **Usar `thiserror` para errores de biblioteca, `anyhow` para errores de aplicación** — `thiserror` proporciona errores tipados y componibles. `anyhow` es ergonómico para binarios donde los llamadores no coinciden con variantes de error.

3. **Nunca usar `.unwrap()` en rutas de producción** — usa `?` para propagar, `.expect("invariant reason")` cuando el fallo es un error y el mensaje explica por qué no puede ocurrir, `if let` o `match` para casos recuperables.

4. **Preferir `impl Trait` sobre despacho dinámico a menos que el tipo sea desconocido en tiempo de compilación** — `fn process(iter: impl Iterator<Item = u32>)` es más rápido y evita asignación en heap. Usa `dyn Trait` solo para colecciones heterogéneas o interfaces de complementos.

5. **Derivar `Debug` en cada tipo que poseas** — los tipos sin `Debug` rompen el logging, las aserciones de prueba y el formateo de errores. Agrega `Display` solo cuando haya una representación de cadena orientada al usuario.

6. **Evitar `clone()` en rutas críticas** — señala un problema de diseño. Reestructura las vidas útiles o usa `Rc`/`Arc` donde la propiedad compartida es genuinamente necesaria.

7. **Usar `#[must_use]` en tipos y funciones cuyos valores de retorno son críticos** — `Result`, `Future` y tipos centinela deben anotarse para que el compilador advierta cuando el llamador los descarta.

8. **Preferir iteradores sobre bucles de índice manual** — `iter().filter().map().collect()` es idiomático, está verificado en límites y a menudo se optimiza mejor. Los bucles de índice invitan a errores de uno.

9. **Hacer que estados ilegales sean irrepresentables a través de tipos** — modela máquinas de estado como enumeraciones con datos asociados. Prefiere `Option<T>` sobre valores centinela como `-1` o cadenas vacías.

10. **Usar `clippy` y `rustfmt` en CI** — `cargo clippy -- -D warnings` falla la compilación en violaciones de lint. `cargo fmt --check` hace cumplir el formateo. Sin excepciones.

11. **Agrupar declaraciones `use`: std, crates externos, módulos internos** — el ordenamiento consistente hace que las importaciones sean fáciles de escanear. `rustfmt` hace cumplir esto con `imports_granularity`.

12. **Mantener bloques `unsafe` mínimos y documentar invariantes** — cada bloque `unsafe` debe tener un comentario explicando qué invariante cumple el llamador y por qué la abstracción segura no puede expresarlo.

13. **Preferir `Arc<Mutex<T>>` sobre `Rc<RefCell<T>>` en contextos async** — `Rc` y `RefCell` son `!Send`. En código async o multi-hilo, los pánicos en tiempo de ejecución del mal uso de `RefCell` son difíciles de depurar.

14. **Usar `cargo-deny` o `cargo-audit` en CI** — detecta crates desactualizados y vulnerabilidades conocidas antes de que lleguen a producción.

15. **Fijar versiones de dependencias en `Cargo.lock` para binarios, no para bibliotecas** — confirma `Cargo.lock` para aplicaciones. Las bibliotecas deben dejar la resolución al consumidor.


---
