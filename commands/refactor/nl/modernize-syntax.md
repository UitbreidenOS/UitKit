---
description: Werk code bij naar huidige taalidiomatismen zonder gedrag te wijzigen
argument-hint: "[file or directory]"
---
Moderniseer de syntaxis en idiomatismen in $ARGUMENTS naar huidige taalstandaarden.

1. Lees het/de bestand(en) en identificeer de taal en de huidige stabiele versie in gebruik (controleer package.json, go.mod, Cargo.toml, pyproject.toml, of soortgelijk).

2. Pas alleen wijzigingen toe die:
   - Ondersteund worden door de taalversie die al in gebruik is (voer geen upgrade van de taalversie uit)
   - Pure syntaxherschrijvingen zijn — dezelfde semantiek, nieuwere vorm
   - Consistent zijn met de patronen die al in het bestand aanwezig zijn

3. Veelgebruikte moderniseringsdoelen per taal:

   JavaScript / TypeScript:
   - `var` → `const`/`let` met correcte veranderbaarheid
   - `.then()/.catch()` ketens → `async/await`
   - `arguments` → rest-parameters
   - Handmatig object-spread → `{ ...obj }`
   - `Array.prototype.forEach` voor neveneffecten is prima; `.map`/`.filter`/`.reduce` waar een waarde nodig is
   - Benoemde exports boven standaard-exports waar de codebase deze al gebruikt

   Python:
   - Oude-stijl `%` en `.format()` strings → f-strings (Python 3.6+)
   - `open()` zonder context manager → `with open()`
   - Handmatige lijstbouw lussen → list/dict/set comprehensions waar leesbaar
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → ingebouwde `list/dict/tuple` (Python 3.9+)

   Go:
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Handmatige slice-lussen waar `range` schoner is
   - Benoemde retourwaarden alleen waar ze helpen met duidelijkheid, niet als standaard

   Rust:
   - `unwrap()` in niet-test-code → juiste foutafhandeling met `?`
   - `match` boven `if let` ketens bij het matchen van meerdere armen
   - Redundante `.clone()` aanroepen waar een verwijzing volstaat

4. Moderniseer niet:
   - Code die een opmerking bevat waarin wordt uitgelegd waarom de oudere vorm opzettelijk is
   - Patronen die een upgrade van de taalversie vereisen
   - Stijlvoorkeur (bijv. tabs versus spaties) — dat hoort in de formatter

5. Pas alle wijzigingen toe. Uitvoer: lijst van vervangende patronen en regeltellingen.
