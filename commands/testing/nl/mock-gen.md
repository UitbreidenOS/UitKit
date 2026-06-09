---
description: Genereer typeveilige mocks en stubs voor een bepaalde module of interface
argument-hint: "[module-path-or-interface-name]"
---
Genereer mocks en stubs voor: $ARGUMENTS

1. Zoek het doel — vind het modulebestand, de klasse of interface genoemd in $ARGUMENTS. Lees het volledig om het volledige oppervlak te begrijpen: alle geëxporteerde functies, klassemethoden en hun type signatures.

2. Detecteer de mock-aanpak van het project:
   - Jest: `jest.fn()`, `jest.mock()`, handmatige mocks in `__mocks__/`
   - Pytest: `unittest.mock.MagicMock`, `pytest-mock` fixtures
   - Go: op interface gebaseerde handmatige mocks of `mockery`-stijl gegenereerde structs
   - TypeScript: behoud alle generieke typen; gebruik niet `any`

3. Genereer mocks die:
   - De volledige interface implementeren — geen ontbrekende methoden
   - Typeveilig zijn (geen casting, geen `any` tenzij het origineel `any` gebruikt)
   - Configureerbare retourwaarden per oproep hebben via standaard mock API's
   - Een standaardimplementatie hebben die nulwaarden / lege structs retourneert, zodat tests zonder extra setup compileren
   - Oproeptracking blootstellen (oproepcount, ontvangen argumenten) waar het framework dit ondersteunt

4. Genereer een overeenkomende factory of fixture die een vooraf geconfigureerde mock retourneert, geschikt voor veelvoorkomende testscenario's. Noem het `make<Name>Mock` of volg de naamgevingsconventie van het project.

5. Plaats de mock op de juiste locatie volgens projectconventies (`__mocks__/`, `mocks/`, `testutil/`, enz.). Als het project geen conventie heeft, plaats het naast het bronbestand.

6. Schrijf één voorbeeldtest die aantoont hoe u de mock importeert en gebruikt, inclusief hoe u assertions doet op ontvangen oproepen.

Output: het mockbestand en de voorbeeldtest. Geen placeholdermethoden.
