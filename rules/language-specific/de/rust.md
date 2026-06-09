# Rust-Regeln

## Anwendbar auf
Alle Rust-Dateien (`*.rs`) in jedem Projekt.

## Regeln

1. **`&str` gegenüber `String` für Funktionsparameter bevorzugen** — akzeptiere den permissivsten Typ. Verwende `String` in Parametern nur, wenn du Ownership oder Speicher benötigst.

2. **`thiserror` für Bibliotheksfehler, `anyhow` für Anwendungsfehler verwenden** — `thiserror` bietet typisierte, komponierbare Fehler. `anyhow` ist ergonomisch für Binärdateien, bei denen Aufrufer nicht auf Fehlervarianten abgleichen.

3. **`.unwrap()` niemals in Produktionspfaden verwenden** — verwende `?` zum Weitergeben, `.expect("Invarianten-Grund")` wenn ein Fehler ein Bug ist und die Nachricht erklärt, warum dies nicht vorkommen kann, `if let` oder `match` für wiederherstellbare Fälle.

4. **`impl Trait` gegenüber dynamischem Dispatch bevorzugen, es sei denn, der Typ ist zur Compile-Zeit unbekannt** — `fn process(iter: impl Iterator<Item = u32>)` ist schneller und vermeidet Heap-Allocation. Verwende `dyn Trait` nur für heterogene Sammlungen oder Plugin-Schnittstellen.

5. **`Debug` auf jedem Typ ableiten, den du besitzt** — nicht-`Debug`-Typen brechen Logging, Test-Assertions und Fehlerformatierung. Füge `Display` nur hinzu, wenn es eine benutzergerichtete String-Darstellung gibt.

6. **`clone()` in Hot-Pfaden vermeiden** — dies signalisiert ein Designproblem. Restrukturiere Lifetimes oder verwende `Rc`/`Arc`, wenn gemeinsames Ownership wirklich benötigt wird.

7. **`#[must_use]` auf Typen und Funktionen verwenden, deren Rückgabewerte kritisch sind** — `Result`, `Future` und Sentinel-Typen sollten annotiert werden, damit der Compiler warnt, wenn der Aufrufer diese verwirft.

8. **Iteratoren gegenüber manuellen Index-Schleifen bevorzugen** — `iter().filter().map().collect()` ist idiomatisch, grenzengeprüft und oft besser optimiert. Index-Schleifen führen zu Off-by-One-Fehlern ein.

9. **Illegale Zustände durch Typen unrepräsentierbar machen** — modelliere State Machines als Enums mit zugehörigen Daten. Bevorzuge `Option<T>` gegenüber Sentinel-Werten wie `-1` oder leeren Strings.

10. **`clippy` und `rustfmt` in CI verwenden** — `cargo clippy -- -D warnings` schlägt den Build bei Lint-Verstößen fehl. `cargo fmt --check` erzwingt Formatierung. Keine Ausnahmen.

11. **`use`-Anweisungen gruppieren: std, externe Crates, interne Module** — einheitliche Reihenfolge macht Imports scanbar. `rustfmt` erzwingt dies mit `imports_granularity`.

12. **`unsafe`-Blöcke minimal halten und Invarianten dokumentieren** — jeder `unsafe`-Block muss einen Kommentar haben, der erklärt, welche Invariante der Aufrufer einhält und warum die sichere Abstraktion dies nicht ausdrücken kann.

13. **`Arc<Mutex<T>>` gegenüber `Rc<RefCell<T>>` in Async-Kontexten bevorzugen** — `Rc` und `RefCell` sind `!Send`. In Async- oder Multi-Threading-Code sind Runtime-Panics aus `RefCell`-Missbrauch schwer zu debuggen.

14. **`cargo-deny` oder `cargo-audit` in CI verwenden** — erfasse gelöschte Crates und bekannte Sicherheitslücken, bevor sie in die Produktion gelangen.

15. **Abhängigkeitsversionen in `Cargo.lock` für Binärdateien anheften, nicht für Bibliotheken** — commit `Cargo.lock` für Anwendungen. Bibliotheken sollten die Auflösung dem Verbraucher überlassen.


---

> **Arbeite mit uns zusammen:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir erstellen KI-Produkte und B2B-Lösungen mit Developer Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
