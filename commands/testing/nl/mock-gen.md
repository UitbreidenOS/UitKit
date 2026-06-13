---
description: Genereer type-veilige mocks en stubs voor een gegeven module of interface
argument-hint: "[module-pad-of-interface-naam]"
---
Genereer mocks en stubs voor: $ARGUMENTS

1. Bepaal het doel — vind het modulebestand, klasse of interface met de naam in $ARGUMENTS. Lees het volledig om de volledige oppervlakte te begrijpen: alle geëxporteerde functies, klassemethoden en hun typesignaturen.

2. Detecteer de mockingbenadering van het project:
   - Jest: `jest.fn()`, `jest.mock()`, handmatige mocks in `__mocks__/`
   - Pytest: `unittest.mock.MagicMock`, `pytest-mock` fixtures
   - Go: interface-gebaseerde handmatige mocks of `mockery`-stijl gegenereerde structs
   - TypeScript: behoud alle generieke types; gebruik `any` niet

3. Genereer mocks die:
   - De volledige interface implementeren — geen ontbrekende methoden
   - Type-veilig zijn (geen casting, geen `any` tenzij het origineel `any` gebruikt)
   - Configureerbare retourwaarden per oproep hebben via standaard mock-API's
   - Een standaardimplementatie bevatten die nulwaarden/lege structs retourneert zodat tests zonder extra setup compileren
   - Oproeptracking onthullen (oproeptellingen, ontvangen argumenten) waar het framework dit ondersteunt

4. Genereer een overeenkomstige factory of fixture die een vooraf geconfigureerde mock retourneert die geschikt is voor veelvoorkomende testscenario's. Noem het `make<Naam>Mock` of volg de naamgeving van het project.

5. Plaats de mock op de juiste locatie volgens projectconventies (`__mocks__/`, `mocks/`, `testutil/`, etc.). Als het project geen conventie heeft, plaats het naast het bronbestand.

6. Schrijf één voorbeeldtest die aantoont hoe je de mock importeert en gebruikt, inclusief hoe je asserties doet op ontvangen oproepen.

Output: het mockbestand en de voorbeeldtest. Geen platoonhouders voor methoden.
