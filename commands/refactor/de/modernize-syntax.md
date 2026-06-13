---
description: Code auf aktuelle Sprachmuster aktualisieren, ohne das Verhalten zu ändern
argument-hint: "[Datei oder Verzeichnis]"
---
Modernisieren Sie die Syntax und Idiome in $ARGUMENTS auf aktuelle Sprachstandards.

1. Lesen Sie die Datei(en) und identifizieren Sie die Sprache und ihre aktuelle stabile Version (prüfen Sie package.json, go.mod, Cargo.toml, pyproject.toml oder ähnliche Dateien).

2. Wenden Sie nur Änderungen an, die:
   - Von der bereits verwendeten Sprachversion unterstützt werden (aktualisieren Sie nicht die Sprachversion)
   - Reine Syntax-Umschreibungen sind — gleiche Semantik, neuere Form
   - Konsistent mit den bereits in der Datei vorhandenen Mustern sind

3. Häufige Modernisierungsziele nach Sprache:

   JavaScript / TypeScript:
   - `var` → `const`/`let` mit korrekter Veränderbarkeit
   - `.then()/.catch()` Ketten → `async/await`
   - `arguments` → Rest-Parameter
   - Manuelles Objekt-Spreading → `{ ...obj }`
   - `Array.prototype.forEach` für Nebenwirkungen ist akzeptabel; `.map`/`.filter`/`.reduce` wo ein Wert benötigt wird
   - Named Exports über Default Exports, wo die Codebasis diese bereits verwendet

   Python:
   - Alte-Stil `%` und `.format()` Strings → f-Strings (Python 3.6+)
   - `open()` ohne Context Manager → `with open()`
   - Manuelle List-Building-Schleifen → List/Dict/Set Comprehensions wo lesbar
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → eingebaute `list/dict/tuple` (Python 3.9+)

   Go:
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Manuelle Slice-Schleifen wo `range` sauberer ist
   - Named Return Values nur wo sie die Klarheit unterstützen, nicht als Standard

   Rust:
   - `unwrap()` in Nicht-Test-Code → korrekte Fehlerbehandlung mit `?`
   - `match` über `if let` Ketten bei mehreren Arms
   - Redundante `.clone()` Aufrufe wo ein Borrow ausreicht

4. Modernisieren Sie nicht:
   - Code, der einen Kommentar hat, der erklärt, warum die ältere Form beabsichtigt ist
   - Muster, die ein Sprachversions-Update erfordern
   - Stil-Präferenzen (z.B. Tabs vs. Leerzeichen) — das gehört zum Formatter

5. Wenden Sie alle Änderungen an. Ausgabe: Liste der ersetzten Muster und Zeilenzähler.
