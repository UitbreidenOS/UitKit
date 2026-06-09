# Rust-regels

## Van toepassing op
Alle Rust-bestanden (`*.rs`) in elk project.

## Regels

1. **Geef de voorkeur aan `&str` boven `String` voor functieparameters** — accepteer het meest permissieve type. Gebruik `String` in parameters alleen als je eigendom of opslag nodig hebt.

2. **Gebruik `thiserror` voor bibliotheekfouten, `anyhow` voor applicatiefouten** — `thiserror` biedt getypte, samenstelbare fouten. `anyhow` is ergonomisch voor binaries waarbij callers niet overeenkomen met foutvarianten.

3. **Gebruik nooit `.unwrap()` in productiepaden** — gebruik `?` om door te geven, `.expect("invariant reason")` wanneer uitval een bug is en het bericht uitlegt waarom het niet kan gebeuren, `if let` of `match` voor herstelbare gevallen.

4. **Geef de voorkeur aan `impl Trait` boven dynamische dispatch tenzij het type bij compile-time onbekend is** — `fn process(iter: impl Iterator<Item = u32>)` is sneller en voorkomt heap-toewijzing. Gebruik `dyn Trait` alleen voor heterogene collecties of plugin-interfaces.

5. **Implementeer `Debug` op elk type dat je bezit** — niet-`Debug`-typen breken logging, test-asserties en foutformattering. Voeg `Display` alleen toe als er een gebruikersgerichte tekenreeksrepresentatie is.

6. **Vermijd `clone()` in hot paths** — dit signaleert een ontwerpprobleem. Herstructureer lifetimes of gebruik `Rc`/`Arc` waarbij gedeeld eigendom echt nodig is.

7. **Gebruik `#[must_use]` op typen en functies waarvan de retourwaarden kritiek zijn** — `Result`, `Future` en sentineltypen moeten geannoteerd worden zodat de compiler waarschuwt wanneer de oproeper ze verwerpt.

8. **Geef de voorkeur aan iterators boven handmatige indexlussen** — `iter().filter().map().collect()` is idiomatisch, grens-checked en vaak beter geoptimaliseerd. Indexlussen nodigen uit tot off-by-one-fouten.

9. **Maak illegale staten onrepresenteerbaar via typen** — modelleer state machines als enums met bijbehorende gegevens. Geef de voorkeur aan `Option<T>` boven sentinelwaarden zoals `-1` of lege strings.

10. **Gebruik `clippy` en `rustfmt` in CI** — `cargo clippy -- -D warnings` faalt de build op lint-schendingen. `cargo fmt --check` dwingt opmaak af. Geen uitzonderingen.

11. **Groepeer `use`-statements: std, externe crates, interne modules** — consistente ordening maakt imports scanbaar. `rustfmt` dwingt dit af met `imports_granularity`.

12. **Houd `unsafe`-blokken minimaal en documenteer invarianten** — elk `unsafe`-blok moet een opmerking hebben die uitlegt welke invariant de oproeper ondersteunt en waarom de veilige abstractie het niet kan uitdrukken.

13. **Geef de voorkeur aan `Arc<Mutex<T>>` boven `Rc<RefCell<T>>` in async-contexten** — `Rc` en `RefCell` zijn `!Send`. In async of multi-threaded code zijn runtime panics door `RefCell`-misbruik moeilijk op te sporen.

14. **Gebruik `cargo-deny` of `cargo-audit` in CI** — vang ingetrokken crates en bekende beveiligingsproblemen op voordat ze productie bereiken.

15. **Pin afhankelijkheidsversies in `Cargo.lock` voor binaries, niet voor bibliotheken** — commit `Cargo.lock` voor applicaties. Bibliotheken moeten resolutie aan de consument overlaten.


---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
