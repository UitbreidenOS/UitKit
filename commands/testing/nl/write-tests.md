---
description: Genereer grondige unit tests voor het opgegeven bestand of de gespecificeerde functie
argument-hint: "[file-or-function]"
---
Je schrijft unit tests voor: $ARGUMENTS

Volg deze stappen:

1. Lees het doelbestand of zoek de genoemde functie in de codebase. Begrijp de openbare interface, neveneffecten en afhankelijkheden.

2. Identificeer alle benodigde testcases:
   - Gelukkige pad (typische geldige invoer)
   - Grenswaarden (leeg, nul, max, min, enkel element)
   - Foutpaden (ongeldige invoer, ontbrekende deps, gegooide uitzonderingen)
   - Randgevallen specifiek voor de domeinlogica

3. Detecteer het bestaande testframework en conventies in dit project (Jest, Pytest, Go testing, Vitest, RSpec, enz.). Pas de stijl exact aan — dezelfde describe/it nestingsdiepte, dezelfde assertiestijl, dezelfde mock/stub patronen die al in gebruik zijn.

4. Schrijf tests die:
   - Geïsoleerd zijn: geen gedeelde veranderbare staat tussen tests
   - Beschrijvende namen hebben die lezen als specificaties ("retourneert null wanneer gebruiker niet wordt gevonden", niet "testcase 1")
   - Één logisch concept per test asserten
   - Arrange-act-assert structuur gebruiken
   - Alleen mocks gebruiken wat een echte grens kruist (netwerk, bestandssysteem, DB, tijd, willekeurigheid)

5. Mock NIET de unit onder test zelf. Schrijf GEEN tests die alleen de mock testen.

6. Plaats het testbestand aangrenzend aan het bronbestand volgens projectconventies (bijv. `__tests__/`, `.test.ts`, `_test.go`).

7. Na het schrijven, voer de tests uit en bevestig dat ze slagen. Als er een mislukt, repareer ofwel de test (als de verwachting onjuist was) ofwel maak de bug in de implementatie duidelijk aan het licht.

Schrijf geen placeholdertests. Laat geen `TODO` opmerkingen achter. Elke test moet volledig en betekenisvol zijn.
