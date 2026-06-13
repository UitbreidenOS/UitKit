---
description: Genereer realistische seed-datascripts voor ontwikkelings- of testomgevingen
argument-hint: "[tabelnamen, schemabestand, of beschrijving]"
---
Genereer seeddata voor: $ARGUMENTS

Als $ARGUMENTS een tabelnaam of lijst met namen is, zoek schemadefinities in de codebase. Als het een schemabestand is, lees het in. Als het een beschrijving is, leid het schema af uit context.

Regels voor seeddata-generatie:

1. Detecteer het seedmechanisme dat in dit project wordt gebruikt:
   - SQL INSERT-bestanden, framework seeders (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds), of factory-bibliotheken (FactoryBot, factory-boy, Faker.js).
   - Pas de bestaande indeling exact aan.

2. Genereer gegevens die:
   - Realistisch zijn: gebruik domeingeschikte waarden (realistische namen, geldige e-mailadressen, plausibele datums, correcte opsommingswaarden).
   - Gevarieerd zijn: minstens 10-20 rijen per tabel, tenzij de tabel een kleine verzameling vertegenwoordigt.
   - Consistent zijn over verwante tabellen: vreemde sleutels verwijzen naar geldige ID's in bovenliggende tabellen; seedingvolgorde respecteert FK-constraints.
   - Veilig zijn: gebruik nooit echte PII-patronen — gebruik duidelijk nep-gegevens (bijv. `alice@example.com`, niet `alice@gmail.com`).

3. Dek randzaken af:
   - Minstens één rij per duidelijke opsommingswaarde.
   - Null-waarden voor nullbare kolommen waar de toepassing deze moet afhandelen.
   - Grenswaarden (nulbedragen, maximale tekenlengte, verre toekomst/verleden datums) waar relevant voor testen.

4. Als het schema soft-delete-kolommen heeft, neem zowel actieve als verwijderde records op.

5. Voer het seeddatumbestand(en) uit met correcte bestandsnamen en paden volgens projectconventies.

6. Voeg na de seeddata een lijst in van alle vereiste prerequisite-seeds die eerst moeten worden uitgevoerd (afhankelijkheidsvolgorde) en alle handmatige installatiestappen (bijv. een superuser aanmaken voordat gebruikersrollen worden gesesd).

Voer niet meer dan 50 rijen per tabel uit, tenzij uitdrukkelijk aangevraagd.
