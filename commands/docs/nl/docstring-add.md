---
description: Voeg docstrings/JSDoc/type annotaties toe of verbeter deze voor alle openbare symbolen in een bestand
argument-hint: "<file>"
---
Voeg of verbeter documentatiecommentaren toe voor elk openbaar symbool in: $ARGUMENTS

Regels voor wat telt als een openbaar symbool:
- Python: alle functies/klassen/methoden zonder `_` voorvoegsel, plus modulegebruiksconstanten in `__all__` als gedefinieerd.
- TypeScript/JavaScript: alle geëxporteerde functies, klassen, interfaces, type aliases en constanten.
- Go: alle geëxporteerde identifiers (met hoofdletter).
- Rust: alle `pub` items.
- Andere talen: pas de gebruikelijke openbare/private onderscheiding van de taal toe.

Voor elk openbaar symbool dat niet is gedocumenteerd of heeft een zwakke/placeholder doc:

1. Lees de volledige implementatie — niet alleen de handtekening.
2. Schrijf een docstring die het volgende omvat:
   - **Wat** de functie doet (één zin, imperatief: "Parseert...", "Retourneert...", "Valideert...").
   - **Parameters**: naam, type (als niet in handtekening), betekenis, beperkingen, standaard indien relevant.
   - **Geretourneerde waarde**: wat het is en onder welke omstandigheden (inclusief `null`/`None`/`undefined`/`error` geeft).
   - **Raises/throws**: elk exception- of errortype dat de beller moet verwerken.
   - **Bijwerkingen**: I/O, mutaties, netwerkoproepen — zo aanwezig.
   - **Voorbeeld**: één minimaal gebruiksvoorbeeld als de functie niet-triviaal is.
3. Gebruik het idomatische formaat voor de taal van het bestand:
   - Python: Google-style docstrings (Args / Returns / Raises secties).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (zin beginnend met de symboolnaam).
   - Rust: `///` doc commentaren met `# Examples` sectie voor niet-triviale items.
4. Verander GEEN logica, handtekeningen of opmaak buiten de documentatiecommentaren.
5. Voeg GEEN docs toe aan private/interne symbolen tenzij ze al een opmerking hebben die je moet verbeteren.
6. Als er al een docstring bestaat en deze is nauwkeurig, laat deze ongewijzigd. Als deze onnauwkeurig of onvolledig is, vervang alleen de gebrekkige onderdelen.

Na het bewerken drukt u een compacte samenvatting af:
- Hoeveel symbolen werden gedocumenteerd (nieuw).
- Hoeveel zijn verbeterd.
- Vermeld alle symbolen die u hebt overgeslagen en waarom.
