---
description: Genereer realistische seed-data scripts voor ontwikkelings- of testomgevingen
argument-hint: "[table name(s), schema file, or description]"
---
Genereer seed-data voor: $ARGUMENTS

Als $ARGUMENTS een tabelnaam of lijst met namen is, zoek schemadefinities in de codebase. Als het een schemabestand is, lees dit. Als het een beschrijving is, leid het schema af uit context.

Regels voor seed-data generatie:

1. Detecteer het seeding-mechanisme dat in dit project wordt gebruikt:
   - SQL INSERT-bestanden, framework seeders (Rails db/seeds.rb, Django fixtures, Prisma seed.ts, Laravel seeders, Knex seeds), of factory libraries (FactoryBot, factory-boy, Faker.js).
   - Match het bestaande formaat exact.

2. Genereer data die:
   - Realistisch is: gebruik domein-geschikte waarden (realistische namen, geldige e-mails, plausibele datums, correcte enum-waarden).
   - Gevarieerd is: minimaal 10-20 rijen per tabel, tenzij de tabel een kleine opzoekset vertegenwoordigt.
   - Consistent is over gerelateerde tabellen: foreign keys verwijzen naar geldige ID's in parent tables; seeding-volgorde respecteert FK-beperkingen.
   - Veilig is: gebruik nooit echte PII-patronen — gebruik duidelijk nep-data (bijv. `alice@example.com`, niet `alice@gmail.com`).

3. Dek edge cases af:
   - Minstens één rij per afzonderlijke enum/status-waarde.
   - Null-waarden voor nullable kolommen waar de applicatie deze moet afhandelen.
   - Grenswaarden (nulbedragen, maximale lengtetekenreeksen, verre toekomst/verleden datums) waar relevant voor testen.

4. Als het schema soft-delete kolommen heeft, voeg zowel actieve als verwijderde records toe.

5. Geef het seed-bestand(en) uit met juiste bestandsnamen en paden volgens projectconventies.

6. Na de seed-data, geef een lijst van eventuele vereiste prerequisite-seeds die eerst moeten draaien (afhankelijkheidsvolgorde) en eventuele handmatige instellingsstappen (bijv. een superuser aanmaken vóór het seeden van gebruikersrollen).

Geef niet meer dan 50 rijen per tabel uit, tenzij expliciet aangevraagd.
