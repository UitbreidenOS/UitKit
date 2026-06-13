# Claude voor Zorgbeheerders

Alles wat een Zorgbeheerder of Praktijkmanager nodig heeft om AI-ondersteunde patiëntcommunicatie, standaardwerkprocedures, nalevingsopvolging, personeelsplanning en factureringsbeheer uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een praktijkmanager, kliniekbeheerder of coördinator van een medisch kantoor. Jouw taak is om de praktijk draaiende te houden — patiëntplanning, personeelsroosters, facturering, nalevingsdocumentatie, leverancierscommunicatie — terwijl klinisch personeel zich op de zorg kan richten. Je hebt te veel openstaande taken en te weinig uren.

**Voor Claude Code:** 45 minuten om een patiëntcommunicatiebeleid op te stellen. 30 minuten per SOP-update. Handmatige opvolging van openstaande facturen. Nalevingschecklists beheerd in spreadsheets. Functiebeschrijvingen van nul schrijven bij elke aanwerving.

**Erna:** Sjablonen voor patiëntcommunicatie in 2 minuten. Eerste SOP-concepten in 5 minuten. Herinneringsmails voor achterstallige facturen opgesteld in 30 seconden. Nalevingshiatenanalyse vanuit een beleidsdocument in minder dan een minuut. Functiebeschrijvingen met alle vereiste openbaarmakingen in 3 minuten.

---

## Belangrijke disclaimer — lees dit voor je begint

Claude Code helpt uitsluitend met **administratief werk**.

- Gebruik Claude Code niet om klinische beslissingen van welke aard dan ook te nemen, te informeren of voor te stellen
- Plak geen identificeerbare patiëntgegevens in een prompt — namen, geboortedatums, NHS/verzekeringsnummers, adressen, contactgegevens of elke combinatie die een echte persoon kan identificeren
- Gebruik plaatsaanduidingsnamen (bijv. Patiënt A, Dhr. X) en geanonimiseerde verwijzingen in alle voorbeelden
- Alle uitvoer moet worden beoordeeld door een gekwalificeerd mens voordat die naar patiënten wordt verzonden of in gereguleerde processen wordt gebruikt
- Niets in deze gids vormt juridisch, klinisch of regelgevend advies

Claude Code is geen HIPAA-gedekte entiteit en mag niet worden behandeld als onderdeel van je conforme data-infrastructuur. Als je gegevens verwerkt die onderworpen zijn aan HIPAA, AVG of gelijkwaardige kaders, raadpleeg dan het databeleid van je organisatie voordat je AI-tooling gebruikt. Raadpleeg bij twijfel je Functionaris voor Gegevensbescherming of juridisch adviseur.

---

## Installatie in 30 seconden

```bash
# Installeer alle vaardigheden en agents voor zorgbeheer
npx claudient add skill ops/dental-practice
npx claudient add skill ops/sop-writer
npx claudient add skill hr/hiring-pipeline
npx claudient add skill hr/job-description
npx claudient add skill compliance/gdpr-expert
npx claudient add skill compliance/privacy-pia

# Of installeer de volledige ops-, compliance- en HR-bundels:
npx claudient add skills ops
npx claudient add skills compliance
npx claudient add skills hr
```

---

## Jouw Claude Code-stack voor zorgbeheer

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/dental-practice` | Sjablonen voor praktijkbeheer — afspraakherinneringen, recallbrieven, taal voor toestemmingsformulieren, scripts voor de receptie | Dagelijks patiëntcommunicatiebeheer |
| `/sop-writer` | Eerste SOP-concepten vanuit opsommingspunten — opgemaakt, versienummered, klaar voor beoordeling | SOP's voor klinische administratie bijwerken of aanmaken |
| `/hiring-pipeline` | End-to-end aanwervingsworkflow — vacature, screening, interviewvragen, aanbod | Aanwerving van administratief, receptie- of klinisch ondersteunend personeel |
| `/job-description` | Conforme functiebeschrijvingen met vereiste openbaarmakingen voor zorgrollen | Elke nieuwe aanwervingsopdracht |
| `/gdpr-expert` | AVG-compliance Q&A, concepten voor verzoeken van betrokkenen, beoordeling van bewaringsschema | Gegevensbeheer, verzoeken om patiëntgegevens, beleidsbeoordeling |
| `/privacy-pia` | Scaffolding voor Gegevensbeschermingseffectbeoordeling bij nieuwe systemen of proceswijzigingen | Voordat nieuwe software of gegevensstroom wordt onboarded |
| `/invoice-chaser` | Concept opvolgings-e-mails voor achterstallige facturen met escalerende toon | Achtervolgen van uitstaande betalingen van verzekeraars of leveranciers |
| `/expense-audit` | Afwijkingen markeren, uitgaven categoriseren, beleidsuitzonderingen markeren | Maandelijkse beoordeling van uitgaven en inkoop |
| `/customer-inquiry` | Sjablonen voor reacties op patiëntvragen — vragen over afspraken, service-informatie, klachten | Conceptreacties op patiëntvragen (geanonimiseerd) |
| `/review-response` | Professionele reacties op online patiëntbeoordelingen opstellen | Beoordelingsbeheer op Google, NHS Choices of Trustpilot |

### Agents

| Agent | Model | Wanneer inzetten |
|---|---|---|
| `roles/healthcare-admin` | Sonnet | Volledige administratieve sessies — planning, communicatie, factureringscoördinatie |
| `advisors/general-counsel` | Opus | Nalevingsvragen, contracttaal, gegevensbeheer, regelgevingsinterpretatie |
| `advisors/chro-advisor` | Sonnet | Personeels-HR — aanwerving, disciplinaire procedures, contracten, verzuimbeheer |

---

## Dagelijkse werkstroom

### Ochtend — beoordeling patiëntplanning (15-20 minuten)

**1. Dagvoorbereiding — wat heeft vandaag aandacht nodig**
```
/dental-practice

Administratieve prioriteiten voor vandaag:
- We hebben [N] afspraken. Markeer alle afspraken die bevestigingsgesprekken vóór de afspraak nodig hebben.
- Stel een herinneringsbericht op voor afspraken in de middag (geanonimiseerd sjabloon).
- Eventuele recallbrieven die deze week vervallen — stel het sjabloon op voor [recalltype].

Gebruik overal plaatsaanduidingsnamen voor patiënten.
```

**2. Triage van patiëntvragen**
```
/customer-inquiry

Stel reacties op voor de volgende soorten vragen die vanochtend zijn ontvangen:
1. Patiënt die wil verzetten — zoekt de vroegst beschikbare slot
2. Patiënt die vraagt over [servicetype] en kosten
3. Patiënt die klaagt over wachttijden bij het laatste bezoek

Houd alle reacties professioneel, vriendelijk en onder de 150 woorden elk.
Voeg geen echte patiëntgegevens in — ik voeg namen handmatig toe voor verzending.
```

---

### Middag — facturering en beheer (20-30 minuten)

**3. Opvolging facturen**
```
/invoice-chaser

Stel opvolgings-e-mails op voor de volgende uitstaande facturen:
- Factuur [ref]: [naam leverancier/verzekeraar], [N] dagen geleden vervallen, bedrag [X]
- Factuur [ref]: [naam leverancier/verzekeraar], [N] dagen geleden vervallen, bedrag [X]

Toon voor 15 dagen achterstallig: vriendelijke herinnering.
Toon voor 30+ dagen achterstallig: stellig, met verwijzing naar betalingsvoorwaarden.
Voeg geen echte patiëntgegevens op in factuurreferenties.
```

**4. Uitgavenbeoordeling**
```
/expense-audit

Hier is de uitgavensamenvatting van deze maand per categorie:
[Plak geanonimiseerde uitgavendata — geen patiëntidentificatoren]

Markeer alles wat ongebruikelijk lijkt, over budget is of buiten beleid valt.
Vat samen voor het maandrapport van de praktijkmanager.
```

---

### Middag — naleving en documentatie (20-30 minuten)

**5. SOP-update**
```
/sop-writer

Ik heb een eerste concept nodig van een SOP voor:
[Onderwerp — bijv. "afhandeling van verzoeken van patiënten voor inzage in persoonsgegevens"]

Belangrijke stappen waarvan ik weet dat ze behandeld moeten worden:
- [Stap 1]
- [Stap 2]
- [Stap 3]

Formaat: genummerde stappen, eigenaar voor elke stap, beoordelingsfrequentie, versievak bovenaan.
Markeer eventuele hiaten waar ik onze FG of juridisch team moet raadplegen.
```

**6. Nalevingscontrole**
```
/gdpr-expert

We zijn van plan om een nieuwe [software/proces] te onboarden die [type data] zal verwerken.
Begeleid me door de vragen die ik moet beantwoorden voor goedkeuring:
- Hebben we een GEB nodig?
- Welke verwerkersovereenkomsten hebben we nodig?
- Hoe moet het bewaringsschema eruitzien?

Geen echte patiëntgegevens — dit is een planningsoefening.
```

---

### Personeelscoördinatie (indien nodig)

**7. Aanwerving — nieuwe rol**
```
/job-description

Rol: [functietitel — bijv. Receptionist / Praktijkcoördinator / Medisch Secretaresse]
Omgeving: [huisartsenpraktijk / tandartspraktijk / specialistische kliniek]
Uren: [voltijds / deeltijds]
Belangrijkste verantwoordelijkheden: [opsommingslijst]
Vereiste kwalificaties: [lijst]
Vereiste openbaarmakingen: VOG vereist, verificatie van werkvergunning

Stel een conforme functiebeschrijving op en een korte vacatureadvertentie voor NHS Jobs / Indeed.
```

**8. Sollicitatieproces**
```
/hiring-pipeline

We werven een [rol]. We hebben [N] kandidaten in de screeningsfase.

Stel op:
1. Een gestructureerde set interviewvragen (8-10 vragen, competentiegericht)
2. Een beoordelingsrubriek voor elke vraag
3. Een standaard afwijzings-e-mailsjabloon
4. Een overzicht van een aanbiedingsbrief (ik voeg specifieke voorwaarden toe voor verzending)
```

---

### Wekelijks — beoordeling en rapportage (vrijdag, 30 minuten)

**9. Reactie op online beoordeling**
```
/review-response

We ontvingen de volgende online beoordeling:
[Plak beoordeling — verwijder alle details die de patiënt kunnen identificeren]

Stel een professionele reactie op die:
- De beoordelaar bedankt
- De zorg erkent zonder aansprakelijkheid toe te geven
- Hen uitnodigt om rechtstreeks contact op te nemen met de praktijk
- Onder de 100 woorden blijft
```

**10. Wekelijkse administratieve samenvatting**
```
/dental-practice

Stel een wekelijkse administratieve samenvatting op voor de praktijkhouder:
- Afspraken deze week: [N]
- Ontvangen klachten: [N]
- Uitstaande facturen: [N], totaal [X]
- Bijgewerkte SOP's: [lijst]
- Open nalevingsacties: [lijst]
- Personeelskwesties: [beschrijving]

Éénpagina-formaat. Markeer items waarvoor goedkeuring van de praktijkhouder nodig is.
```

---

## 30-daags ingroeiplan (beheerders die nieuw zijn bij Claude Code)

### Week 1 — Installatie en oriëntatie
- Installeer alle vaardigheden via `npx claudient add skills ops compliance hr`
- Lees de disclaimersectie volledig — informeer je team over wat niet in prompts geplakt mag worden
- Voer `/sop-writer` uit op je drie meest gebruikte procedures — maak kennis met de uitvoerkwaliteit voordat je erop vertrouwt
- Gebruik `/gdpr-expert` om één bestaand dataproces dat jij beheert, te auditen
- Stel je eerste sjabloon voor patiëntcommunicatie op met `/dental-practice` — vergelijk met je huidige sjablonen
- Lees het databeleid van je organisatie voordat je Claude Code gebruikt voor live administratieve taken

### Week 2 — Communicatie en facturering
- Gebruik `/customer-inquiry` om een bibliotheek van 10 standaardsjablonen voor patiëntvragen te bouwen
- Stel alle achterstallige factuuropvolgingen op met `/invoice-chaser` — vergelijk het responspercentage met de vorige maand
- Voer `/expense-audit` uit op de uitgaven van vorige maand — presenteer bevindingen aan je manager
- Begin met bijhouden hoeveel tijd er aan communicatiebeheer wordt besteed versus de basislijn voor Claude Code

### Week 3 — Naleving en documentatie
- Voer `/privacy-pia` uit op de volgende systeem- of proceswijziging in je pipeline
- Gebruik `/gdpr-expert` om één openstaande nalevingsvraag te beantwoorden die je team al een tijd uitstelt
- Update ten minste twee SOP's met `/sop-writer` — stuur beide in voor klinische of managementbeoordeling
- Identificeer je meest voorkomende terugkerende administratieve taak en bouw hiervoor een herbruikbaar sjabloon

### Week 4 — Personeel en rapportage
- Gebruik `/hiring-pipeline` en `/job-description` op je volgende openstaande rol — meet tijdsbesparing vs. je vorige aanwerving
- Voer `/review-response` uit op je laatste vijf onbeantwoorde online beoordelingen
- Stel je maandelijks administratief rapport op met Claude Code — vergelijk de benodigde tijd met vorige maanden
- Presenteer één procesverbetering aan je praktijkhouder, onderbouwd met tijdbesparingsdata

---

## HIPAA-bewustzijn en gegevensverwerking

Als je praktijk onderworpen is aan HIPAA (VS), AVG (VK/EU) of gelijkwaardige kaders, volg dan deze regels zonder uitzondering:

- **Plak nooit een echte patiëntnaam, geboortedatum, adres, telefoonnummer, e-mailadres of verzekerings-/NHS-nummer in een prompt**
- Gebruik plaatsaanduidingen: "Patiënt A", "Dhr. X", "Geboortedatum: [geredact]", "Claimbewijs: [ref]"
- Behandel Claude Code zoals je elke externe SaaS-tool zou behandelen — deel geen gegevens die je niet zou delen met een externe leverancier zonder een ondertekende verwerkersovereenkomst
- Houd bij voor welke administratieve processen je Claude Code gebruikt — je FG heeft dit mogelijk nodig voor een verwerkingsregister
- Als je een verzoek om inzage in persoonsgegevens ontvangt, gebruik dan `/gdpr-expert` om de proceschecklist op te stellen, maar verwerk de werkelijke patiëntgegevens volledig buiten Claude Code

Bouw en test bij twijfel je sjabloon met een fictief voorbeeld en pas het vervolgens handmatig toe op echte gegevens in je praktijkbeheersysteem.

---

## Benchmarks

Houd deze maandelijks bij om waarde aan te tonen voor je praktijkhouder:

| Statistiek | Voor Claude Code | Doel met Claude Code |
|---|---|---|
| Bespaarde beheeruren per week | Basislijn | 4-8 uur |
| Tijd om sjabloon voor patiëntcommunicatie op te stellen | 30-45 min | Onder 5 min |
| Tijd voor eerste concept van een SOP | 45-60 min | Onder 10 min |
| Reactietijd op patiëntvragen | 24-48 uur | Zelfde dag |
| Oplossingstijd voor uitstaande facturen | 14+ dagen | 7-10 dagen |
| Tijd voor opstellen functiebeschrijving | 60-90 min | Onder 15 min |
| Responspercentage voor online beoordelingen | Variabel | 100% binnen 5 dagen |
| Nalevingstaken op tijd afgerond | Handmatig bijhouden | Verbetering van 30% |

Voer in Week 1 een basislijnmeting uit voor je Claude Code op schaal gebruikt. Evalueer na 30 en 90 dagen.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [SOP writer skill](../skills/ops/sop-writer.md)
- [GDPR expert skill](../skills/compliance/gdpr-expert.md)
- [Privacy PIA skill](../skills/compliance/privacy-pia.md)
- [Hiring pipeline skill](../skills/hr/hiring-pipeline.md)
- [Invoice chaser skill](../skills/finance/invoice-chaser.md)

---
