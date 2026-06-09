---
description: Code an aktuelle Sprachidiome aktualisieren, ohne das Verhalten zu ändern
argument-hint: "[file or directory]"
---
Modernisiere die Syntax und Idiome in $ARGUMENTS nach aktuellen Sprachstandards.

1. Lese die Datei(en) und identifiziere die Sprache und ihre aktuelle stabile Version, die verwendet wird (überprüfe package.json, go.mod, Cargo.toml, pyproject.toml oder Ähnliches).

2. Wende nur Änderungen an, die:
   - Von der bereits verwendeten Sprachversion unterstützt werden (aktualisiere nicht die Sprachversion)
   - Reine Syntax-Umschreibungen sind — gleiche Semantik, neuere Form
   - Mit den Mustern übereinstimmen, die bereits in der Datei vorhanden sind

3. Häufige Modernisierungsziele nach Sprache:

   JavaScript / TypeScript:
   - `var` → `const`/`let` mit korrekter Mutierbarkeit
   - `.then()/.catch()`-Ketten → `async/await`
   - `arguments` → Rest-Parameter
   - Manuelles Objekt-Spread → `{ ...obj }`
   - `Array.prototype.forEach` für Nebenwirkungen ist in Ordnung; `.map`/`.filter`/`.reduce` wenn ein Wert benötigt wird
   - Benannte Exporte gegenüber Standard-Exporten, wo die Codebasis sie bereits verwendet

   Python:
   - Alte `%`- und `.format()`-Strings → f-Strings (Python 3.6+)
   - `open()` ohne Context-Manager → `with open()`
   - Manuelle List-Building-Schleifen → List-/Dict-/Set-Comprehensions, wo lesbar
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → eingebaute `list/dict/tuple` (Python 3.9+)

   Go:
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Manuelle Schleifen über Slices, wo `range` sauberer ist
   - Benannte Rückgabewerte nur, wenn sie die Klarheit verbessern, nicht als Standard

   Rust:
   - `unwrap()` in Nicht-Test-Code → ordnungsgemäße Fehlerbehandlung mit `?`
   - `match` gegenüber `if let`-Ketten beim Abgleich mehrerer Arme
   - Redundante `.clone()`-Aufrufe, wo eine Borrow ausreicht

4. Modernisiere nicht:
   - Code, der einen Kommentar hat, der erklärt, warum die ältere Form absichtlich ist
   - Muster, die ein Sprachversions-Upgrade erfordern
   - Stilpräferenzen (z. B. Tabulatoren vs. Leerzeichen) — das gehört zum Formatter

5. Wende alle Änderungen an. Ausgabe: Liste der ersetzten Muster und Zeilenanzahlen.
