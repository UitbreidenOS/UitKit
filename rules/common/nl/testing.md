> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../testing.md).

# Testregels

Kopieer de relevante secties naar de `CLAUDE.md` van je project.

---

## Wat te testen

- Test gedrag via publieke API's — geen interne implementatiedetails
- Tests moeten refactoring overleven: als het hernoemen van een private functie tests breekt, zijn de tests fout
- Test randgevallen: null/lege invoer, grenswaarden, foutpaden
- Test geen framework-code of taalbuiltins

## Teststructuur

- Één logische bewering per test — als een test meerdere niet-gerelateerde zaken controleert, splits dan
- Testnamen beschrijven WAT het systeem doet, niet HOE: `"returns 404 when user not found"` niet `"test findUser"`
- Arrange → Act → Assert — één blok per fase, geen vermenging
- Geen conditionele logica in tests — als je een `if` nodig hebt, schrijf twee tests

## Mocken

- Mock geen interne modules — mock alleen op systeemgrenzen (externe API's, databases, bestandssysteem)
- Mock nooit de klasse/module die wordt getest
- Integratietests moeten de echte database raken — gebruik een testdatabase, geen mocks
- Als een unit-test 5+ mocks vereist, is de code waarschijnlijk niet goed gestructureerd

## Dekking

- Dekking is een bodem, geen doel — 80% dekking met slechte tests is erger dan 60% met goede tests
- Elke nieuwe functie heeft minimaal één happy-path test en één foutpad test nodig
- Elke bugfix heeft een regressietest nodig die de bug had moeten vangen

## Testdata

- Gebruik factories of fixtures — codeer nooit gebruikers-ID's, e-mailadressen of UUID's hard in tests
- Tests moeten geïsoleerd zijn — geen gedeelde veranderlijke state tussen tests
- Tests moeten deterministisch zijn — geen willekeurige data, geen tijdsafhankelijke beweringen zonder de klok te mocken
- Ruim na elke test op — verkort tabellen, reset mocks, verwijder gemaakte bestanden

---
