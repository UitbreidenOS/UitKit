---
description: Verouderde of opgeblazen snapshots beoordelen en beslissen update versus herschrijven
argument-hint: "[snapshot file, test file, or directory]"
---
Snapshots beoordelen in: $ARGUMENTS

Stappen:

1. Zoek snapshot-bestanden. Veelvoorkomende locaties:
   - Jest: `__snapshots__/*.snap` aangrenzend aan testbestanden
   - Vitest: hetzelfde patroon als Jest
   - Storybook: `*.stories.snap`
   - Als het argument verwijst naar een testbestand, zoek het bijbehorende `.snap`-bestand.

2. Voor elke snapshot in bereik, evalueer:

   **Grootte**
   - Tel geserialiseerde regels. Markeer snapshots die langer zijn dan 50 regels als kandidaat voor vervanging.
   - Grote snapshots verbergen vaak de werkelijke assertie — de bedoeling is begraven.

   **Stabiliteit**
   - Identificeer inhoud die bij elke run verandert: tijdstempels, gegenereerde ID's, geheugenaddressen, willekeurige waarden, build-hashes.
   - Deze maken snapshots onbetrouwbaar en moeten worden gemaskeerd of vervangen.

   **Specificiteit**
   - Bepaal wat de test werkelijk probeert te verifiëren. Als een snapshot een volledig gerenderde component vastlegt maar de test heet "renders the submit button", is de snapshot overgespecificeerd.

   **Duplicatie**
   - Markeer snapshots over meerdere tests die dezelfde subtree met kleine variatie vastleggen — ze kunnen worden gecombineerd.

3. Voor elke gemarkeerde snapshot, aanbevelingen geven:
   - **Update** — de snapshot is correct in structuur maar verouderd; voer `--updateSnapshot` uit
   - **Replace** — vervang de snapshot door gerichte property-asserties (toon de vervanging)
   - **Mask** — behoud de snapshot maar voeg serializer-transformaties of `expect.any()` toe om volatiele waarden te neutraliseren
   - **Delete** — de snapshot dupliceert een ander test of levert geen signaal op; verwijder het

4. Pas vervangingen en verwijderingen toe die ondubbelzinnig zijn. Werk verouderde snapshots niet automatisch bij — markeer ze zodat de gebruiker ze kan bevestigen met `--updateSnapshot`.

5. Voor elke vervanging, toon:
   - De originele snapshot (afgekapt indien >10 regels)
   - De nieuwe assertie(s) die deze vervangen
   - Waarom dit beter onderhoudbaar is

6. Eindig met een samenvatting: X snapshots beoordeeld, Y bijgewerkt, Z vervangen door asserties, W verwijderd, V gemarkeerd voor handmatige beoordeling.
