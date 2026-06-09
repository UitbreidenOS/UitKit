# GraphQL-regels

Pas toe bij het ontwerpen van schema's, resolvers of clientquery's.

## Schemaontwerp

- Model het domein, niet de database — typen moeten zakelijke entiteiten weerspiegelen, geen tabelrijen
- Gebruik non-null (`!`) agressief; nullable velden zijn een belofte aan clients dat de waarde afwezig kan zijn
- Geef voorkeur aan beschrijvende veldnamen boven afgekorte: `createdAt` niet `cAt`
- Invoertypen voor mutaties moeten gescheiden zijn van queryretourtypen — hergebruik nooit hetzelfde type
- Gebruik enums voor velden met een begrensde reeks waarden; documenteer elke enum-waarde

## Query's en mutaties

- Query's moeten vrij zijn van neveneffecten; mutaties zijn het enige invoerpunt voor schrijfbewerkingen
- Noem mutaties als `<verb><Noun>`: `createOrder`, `cancelSubscription`
- Retourneer het gemuteerde object van elke mutatie — clients hebben het nodig om hun cache bij te werken
- Mutaties die gedeeltelijk kunnen mislukken moeten een union-type retourneren: `CreateOrderResult = Order | ValidationError`
- Implementeer cursor-gebaseerde paginering (`first`/`after`) voor elke lijst die onbeperkt kan groeien

## Resolvers

- Batch N+1-query's met een DataLoader — geef nooit één databasequery per lijstitem uit
- Houd resolverlogica dun: valideer invoer, roep een service aan, retourneer het resultaat
- Los alleen op wat wordt gevraagd — haal joins niet op voor velden die niet in de selectieset staan
- Stel per-veldcomplexiteitskost in; wijs query's af die een totaal budget overschrijden
- Expose nooit interne foutmeldingen aan de client; log ze aan serverzijde

## Veiligheid

- Verifieer bij de gateway voordat een resolver wordt uitgevoerd
- Autoriseer op resolverniveau — controleer eigendom voordat je gegevens retourneert of muteert
- Schakel introspectie uit voor extern gerichte API's in productie
- Zet querydiepte-limieten en querycomplexiteit-limieten af
- Expose nooit stack traces in `errors[].extensions`

## Abonnementen

- Gebruik abonnementen alleen voor echte real-time gegevens; polling is eenvoudiger voor de meeste gevallen
- Filter abonnementsgebeurtenissen altijd op het bereik van de geverifieerde gebruiker
- Implementeer backpressure-verwerking — duw niet sneller dan de client kan verbruiken

## Versiebeheer en evolutie

- Verouderde velden met `@deprecated(reason: "…")` voordat u ze verwijdert
- Verwijder of hernoem een veld nooit in één release — markeer als verouderd, wacht één releasecyclus
- Additieve wijzigingen (nieuwe velden, nieuwe typen) zijn niet-brekend en kunnen op elk moment worden geïmplementeerd
