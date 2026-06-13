---
description: Voeg documentatiecommentaren toe of verbeter deze voor alle openbare symbolen in een bestand
argument-hint: "<bestand>"
---
Voeg of verbeter documentatiecommentaren toe voor elk openbaar symbool in: $ARGUMENTS

Regels voor wat als openbaar symbool geldt:
- Python: alle functies/klassen/methoden zonder voorvoegsel `_`, plus constanten op moduleniveau in `__all__` indien gedefinieerd.
- TypeScript/JavaScript: alle geëxporteerde functies, klassen, interfaces, type-aliassen en constanten.
- Go: alle geëxporteerde identifiers (met hoofdletter).
- Rust: alle `pub`-items.
- Andere talen: pas de conventionele onderscheiding tussen openbaar/privé van de taal toe.

Voor elk openbaar symbool dat niet gedocumenteerd is of een zwakke/placeholder-documentatie heeft:

1. Lees de volledige implementatie — niet alleen de handtekening.
2. Schrijf een docstring die het volgende omvat:
   - **Wat** de functie doet (één zin, imperatief: "Parseert...", "Retourneert...", "Valideert...").
   - **Parameters**: naam, type (indien niet in handtekening), betekenis, beperkingen, standaardwaarde indien relevant.
   - **Retourwaarde**: wat het is en onder welke omstandigheden (inclusief `null`/`None`/`undefined`/`error`-retouren).
   - **Genereert/Gooit**: elk uitzonderingen- of fouttype dat de aanroeper moet afhandelen.
   - **Bijwerkingen**: I/O, mutaties, netwerkoproepen — indien van toepassing.
   - **Voorbeeld**: één minimaal gebruiksvoorbeeld als de functie niet-triviaal is.
3. Gebruik de idiomatische notatie voor de taal van het bestand:
   - Python: Google-stijl docstrings (Args / Returns / Raises-secties).
   - TypeScript/JavaScript: JSDoc (`@param`, `@returns`, `@throws`).
   - Go: godoc (zin beginnend met de symboolnaam).
   - Rust: `///` documentatiecommentaren met `# Examples`-sectie voor niet-triviale items.
4. Wijzig GEEN logica, handtekeningen of opmaak buiten de documentatiecommentaren.
5. Voeg GEEN documentatie toe aan privé/interne symbolen tenzij zij al een opmerking hebben die u moet verbeteren.
6. Als een docstring al bestaat en accurate is, laat deze ongewijzigd. Als deze onnauwkeurig of onvolledig is, vervang dan alleen de ontoereikende delen.

Na het bewerken, druk een compacte samenvatting af:
- Hoeveel symbolen zijn gedocumenteerd (nieuw).
- Hoeveel zijn verbeterd.
- Geef een lijst van symbolen die u hebt overgeslagen en waarom.
