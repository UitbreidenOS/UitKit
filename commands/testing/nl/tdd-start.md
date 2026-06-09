---
description: Bootstrap een TDD-cyclus — schrijf eerst failing tests, implementeer daarna
argument-hint: "[function, class, or feature to build]"
---
Start een TDD-cyclus voor: $ARGUMENTS

Stappen:

1. Verduidelijk het doel van het argument:
   - Als functiesignatuur of beschrijving: leid input/output-contracten af
   - Als classnaam of modulenaam: herken verantwoordelijkheden van de naam en bestaande codecontext
   - Als functieomschrijving: identificeer de kleinste eenheid van gedrag om mee te starten

2. Controleer op bestaande implementatie of gedeeltelijk code. Lees het indien aanwezig, maar pas het nog niet aan.

3. Schrijf eerst failing tests — nog geen implementatiecode.

   Voor elke test:
   - Noem het in het format: `[unit] [scenario] [expected result]`
   - Behandel in deze volgorde: happy path → edge cases → error paths
   - Schrijf het minimale aantal tests dat het contract volledig specificeert (vermijd redundantie)
   - Gebruik het bestaande testframework en assertion-stijl van het project

   Minimale testcases om te schrijven voordat je stopt:
   - Minstens 1 happy-path-test
   - Minstens 1 boundary- of edge-case-test
   - Minstens 1 error/invalid-input-test (als het doel kan falen)

4. Voer de tests uit. Bevestig dat ze falen om de juiste reden (niet vanwege syntaxfout of importfout — een echt assertion-failure tegen ontbrekende logica).

5. Schrijf de minimale implementatie die de tests laat slagen:
   - Geen logica buiten wat de tests vereisen
   - Geen speculatieve afhandeling van gevallen die nog niet zijn getest
   - Volg de bestaande codestijl van het project

6. Voer de tests opnieuw uit. Als alle slagen, rapporteer succes.

7. Als een test nog steeds faalt na implementatie, toon de foutuitvoer en diagnosceer de kloof voordat je een oplossing probeert.

8. Eindigen met:
   - Gemaakte of gewijzigde bestanden
   - Testcount en pass/fail-status
   - Volgende aanbevolen test om te schrijven (één stap verder in de TDD-cyclus)
