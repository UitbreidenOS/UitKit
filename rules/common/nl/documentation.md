# Documentatieregels

Toepassen bij het schrijven of controleren van README-bestanden, API-documentatie, gidsen of inline-documentatie.

## Wat moet je documenteren

- Documenteer het *waarom*, niet het *wat* — code laat zien wat; documentatie legt intent, beperkingen en compromissen uit
- Elk openbaar API-oppervlak heeft een beschrijving, parametertypen, retourtype en minstens één voorbeeld nodig
- Documenteer niet-voor-de-hand-liggende gedrag expliciet: snelheidslimieten, uiteindelijke consistentie, ordeningsgaranties, bekende foutmodi
- Architecture Decision Records (ADR's) voor elke beslissing die meer dan een dag kostte — anders gaat de context verloren

## Wat niet te documenteren

- Herhaal niet wat de code al duidelijk zegt: `// increments counter by 1` bij `counter++` is ruis
- Documenteer geen tijdelijke toestanden ("dit is een workaround totdat X is opgelost") — dat hoort in de issue tracker
- Schrijf geen speculatieve documentatie voor functies die nog niet bestaan

## README's

Elke project-README moet deze vragen op volgende volgorde beantwoorden:

1. Wat doet dit project? (één zin)
2. Hoe draai ik het lokaal? (exacte commando's, geen aannames)
3. Hoe draai ik de tests?
4. Wat zijn de belangrijkste omgevingsvariabelen?
5. Waar kan ik meer informatie vinden? (links naar aanvullende documentatie)

Een README die meer dan 5 minuten nodig heeft om van nul tot een werkende lokale omgeving te komen, is te lang of mist stappen.

## API-documentatie

- Houd API-documentatie dicht bij de code — documentatie die in een aparte repository leeft, raakt verouderd
- Gebruik OpenAPI/Swagger voor REST; SDL + beschrijvingen voor GraphQL; genereer vanuit de bron waar mogelijk
- Elk eindpunt documenteert: authenticatievereisten, request/response-schema, foutcodes, snelheidslimieten
- Bied uitvoerbare voorbeelden (curl, SDK-snippets) — abstracte beschrijvingen zonder voorbeelden zijn niet nuttig

## Schrijfstijl

- Schrijf voor een lezer die competent is maar niet vertrouwd met dit specifieke systeem
- Korte zinnen, actieve stem, imperatieve wijs voor instructies
- Gebruik concrete voorbeelden boven abstracte beschrijvingen: toon een echte request/response, niet alleen een schemamagram
- Tabellen voor referentiemateriaal; proza voor uitleg; genummerde lijsten voor opeenvolgende stappen

## Onderhoud

- Documentatie die fout is, is erger dan geen documentatie — behandel verouderde documentatie als een bug
- Werk documentatie bij in dezelfde PR als de codewijziging; laat nooit een "documentatie-PR volgt"
- Voeg een `last-verified` datum toe aan langere gidsen zodat lezers de vernieuwdheid kunnen beoordelen
- Link naar de canonieke waarbronbron; kopieer niet willekeurig inhoud die zal rotten
