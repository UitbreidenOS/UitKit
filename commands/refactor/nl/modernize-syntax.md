---
description: Code bijwerken naar huidige taalidioma's zonder gedragsverandering
argument-hint: "[bestand of map]"
---
Moderniseer de syntaxis en idioma's in $ARGUMENTS naar huidige taalstandaarden.

1. Lees het/de bestand(en) en identificeer de taal en de huidige stabiele versie in gebruik (controleer package.json, go.mod, Cargo.toml, pyproject.toml, of vergelijkbaar).

2. Pas alleen wijzigingen toe die:
   - Ondersteund zijn door de taalversie die al in gebruik is (voer geen taalversie-upgrade uit)
   - Pure syntaxis-herschrijvingen zijn — dezelfde semantiek, nieuwere vorm
   - Consistent zijn met de patronen die al in het bestand aanwezig zijn

3. Veelgebruikte moderniseringsdoelen per taal:

   JavaScript / TypeScript:
   - `var` → `const`/`let` met juiste muteerbaarheid
   - `.then()/.catch()` ketens → `async/await`
   - `arguments` → rest-parameters
   - Handmatig object spread → `{ ...obj }`
   - `Array.prototype.forEach` voor neveneffecten is prima; `.map`/`.filter`/`.reduce` waar een waarde nodig is
   - Named exports boven default exports waar de codebase deze al gebruikt

   Python:
   - Oude-stijl `%` en `.format()` strings → f-strings (Python 3.6+)
   - `open()` zonder context manager → `with open()`
   - Handmatige lijstbouw lussen → list/dict/set comprehensions waar leesbaar
   - `Union[X, Y]` → `X | Y` (Python 3.10+), `Optional[X]` → `X | None`
   - `typing.List/Dict/Tuple` → ingebouwde `list/dict/tuple` (Python 3.9+)

   Go:
   - `errors.New(fmt.Sprintf(...))` → `fmt.Errorf(...)`
   - Handmatige slice lussen waar `range` schoner is
   - Named return values alleen waar ze helderheid bieden, niet als standaard

   Rust:
   - `unwrap()` in non-test code → juiste foutafhandeling met `?`
   - `match` boven `if let` ketens bij het matchen van meerdere armen
   - Redundante `.clone()` aanroepen waar een borrow voldoende is

4. Moderniseer niet:
   - Code die een opmerking heeft die uitlegt waarom de oudere vorm opzettelijk is
   - Patronen die een taalversie-upgrade vereisen
   - Stijlvoorkeuren (bijv. tabs vs. spaties) — dat hoort bij de formatter

5. Pas alle wijzigingen toe. Uitvoer: lijst van vervangen patronen en regelaantallen.
