# Werkstroom voor functiestarts

End-to-end proces voor het starten van een productfunctie — van finaleontwickeling tot communicatie en monitoring.

## Wanneer gebruiken

Gebruik deze werkstroom voor elk functiestarts dat:
- Meer dan 10% van uw gebruikersbasis beïnvloedt
- Betalings flows, verificatie of kernproductfunctionaliteit beïnvloedt
- Externe integraties of API's beïnvloedt waarvan andere services afhangen
- Alles met een mediaberichte ervan aangebonden

## Fase 1: Startvoorbereiding (1 week voor)

**Checkliste voor techniek:**
- [ ] Alle acceptatiecriteria van de specificatie zijn vervuld
- [ ] Code is beoordeeld en goedgekeurd
- [ ] Unit- en integratietests geslaagd
- [ ] E2E-tests geslaagd op staging
- [ ] Prestaties getest: geen regressie in p99 latentie
- [ ] Functiemarker geconfigureerd voor geleidelijke uitrol
- [ ] Analytica-events geinstrumenteerd en geverifieerd
- [ ] Terugdraaierplan gedocumenteerd en getest
- [ ] Monitoringwaarschuwingen ingesteld voor nieuwe codepaden

**Productchecklis:**
- [ ] Functie getest door PM op staging tegen acceptatiecriteria
- [ ] Grensgevallen getest (lege status, foutstatus, mobiel)
- [ ] Help-documentatie geschreven of bijgewerkt
- [ ] In-app tooltips of onboarding voor nieuwe UI (indien van toepassing)
- [ ] Succesmaatstaven gedefinieerd en basiswaarde vastgesteld

**Designchecklis:**
- [ ] Eindimplementatie komt overeen met goedgekeurde ontwerpen
- [ ] Responsief op mobiel (indien web)
- [ ] Toegankelijkheid: toetsenbordnavigatie, schermlezer, kleurcontrast
- [ ] Laad- en foutstaten geimplementeerd

## Fase 2: Communicatiemarkering (3-5 dagen voor)

**Interne communicatie:**
- [ ] Techniekteam gebriefd over wat er wordt gelanceerd en wanneer
- [ ] Customer success team gebriefd (wat's nieuw, verwachte klantenvragen)
- [ ] Verkoopteam gebriefd als dit beïnvloedt wat zij kunnen demonstreren of verkopen
- [ ] Supportteam heeft documentatie om veelgestelde vragen af te handelen

**Externe communicatie (indien klantgericht):**
- [ ] Changelog-item geschreven
- [ ] In-app aankondiging opgesteld (indien nodig)
- [ ] E-mail aan betrokken gebruikers opgesteld (indien nodig)
- [ ] Blogbericht of social media voorbereide (indien significant)
- [ ] Pers / PR gecoördineerd (bij grote lancering)

## Fase 3: Startuitvoering

**Dag van het start:**

```
1. Bevestig dat alle items op de pre-launch controlelijst voltooid zijn
2. Bericht team in Slack: "Start [Functie] op [tijd]"
3. Schakel functie-vlag in voor [X]% van gebruikers (klein beginnen: 5-10%)
4. Monitor gedurende 30 minuten:
   - Foutpercentage op nieuwe codepaden
   - p99 latentie ongewijzigd
   - Kernzakelijke metrieke zijne niet regressief
5. Indien gezond: opschalen naar 50%, 30 min wachten
6. Indien gezond: opschalen naar 100%
7. Aankondiging in Slack: "Functie is live voor 100% van gebruikers ✅"
8. Publiceer changelog item / blogbericht indien voorbereide
```

**Rollback-trigger:** Als foutpercentage stijgt > 2x basislijn of gebruikersgericht foutspoel stijgt → functiemarker onmiddellijk uitschakelen en onderzoeken.

## Fase 4: Monitoring na starten (24-72 uur)

**Volg gedurende 48 uur na starten:**
- [ ] Foutpercentage terug naar normaal
- [ ] p99 latentie terug naar normaal
- [ ] Primaire succesmaatstaf beweegt in de juiste richting
- [ ] Supportticketvolume: geen pieken in verband met de functie
- [ ] Gebruikersfeedback (indien van toepassing): NPS, in-app reacties

**Snel aanpakken:**
- Bugs die gebruikers in de eerste 24 uur melden (klanten zijn het meest vergevingsgezind direkt na lancering)
- Verwarrende UI-patronen aangeduid door support
- Grensgevallen die testen hebben ontdoken

## Fase 5: Beoordeling (1 week na)

**Feature retrospective (15-minuten async of sync):**
1. Bereikt de functie de succesmaatstaven die we hebben gedefinieerd?
2. Welke gebruikersfeedback hebben we ontvangen?
3. Wat ging goed in het startproces?
4. Wat zouden we volgende keer anders doen?
5. Enig vervolgwerk geidentificeerd (bugs, verbeteringen, v2-ideeën)?

**Roadmap bijwerken:**
- Archiveer de functiespecificatie met werkelijk resultaat versus voorspeld resultaat
- Voeg vervolgartikelen toe aan de achtergrond
- Publiceer interne inzichten (vooral als er iets verrassends gebeurde)

## Starttypes en het juiste proces voor elk

| Type | Publiek | Uitrol | Communicatie | Monitoring |
|---|---|---|---|---|
| **Groter** | Alle gebruikers, kernstroom | Functiemarker, 5→50→100% | Email + in-app + blog | 72h actief monitoring |
| **Matig** | Specifiek segment | Geleidelijk | In-app of email | 48h actief monitoring |
| **Klein** | Alle gebruikers, niet-kern | Direct naar 100% | Alleen changelog | 24h passief |
| **Intern** | Alleen team | Direct | Slack | Standaard monitoring |
| **Beta** | Opt-in gebruikers | Alleen uitnodiging | Uitnodigingse-mail | Wekelijkse controle |

---
