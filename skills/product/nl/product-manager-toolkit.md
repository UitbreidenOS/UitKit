---
name: product-manager-toolkit
description: "Productmanager toolkit: RICE-prioritering, PRD-sjablonen, functiespecificatieschrijving, stakeholder alignment, go-to-market checklist en discovery-to-delivery workflow"
---

# Productmanager-toolkit Vaardigheid

## Wanneer activeren
- Prioritering van een backlog van functies met een gestructureerd framework
- Het schrijven van een PRD (Product Requirements Document) of functiespecs
- Voorbereiding van een go-to-market-plan voor een nieuwe functiestartup
- Het runnen van een stakeholder alignment sessie voor de bouw
- Het synthetiseren van klantonderzoek in actiepunten
- Het schrijven van gebruikersverhalten met passende acceptatiecriteria

## Wanneer NIET gebruiken
- Strategische productroadmap — gebruik de product-roadmap vaardigheid
- Gebruikersonderzoek en persona-creatie — gebruik de ux-researcher vaardigheid
- A/B-testontwerp — gebruik de experiment-designer vaardigheid
- Jira-setup en sprintplanning — gebruik de jira-expert vaardigheid

## Instructies

### RICE-prioritering

```
Prioriteer deze functielijst met RICE-scoring.

Functies om in te scoren: [lijst]
Teamcapaciteit: [X engineer-weken per sprint]
Tijdhorizon: [dit kwartaal / deze sprint / deze maand]

RICE-formule:
Score = (Bereik × Impact × Zekerheid) / Inspanning

BEREIK — betreffende gebruikers per kwartaal:
- Tel de gebruikers die deze functie daadwerkelijk zullen gebruiken in een 3-maands venster
- Niet: "alle gebruikers zouden theoretisch van kunnen profiteren"
- Ja: "23% van onze DAU die de betalingsstroom gebruiken"
- Uitdrukken als getal (bijv. 1.500 gebruikers)

IMPACT — impact per gebruiker (schaal 1-3):
- 3: Massaal — verandert fundamenteel hoe gebruikers met het product werken
- 2: Hoog — aanzienlijke verbetering van een belangrijke workflow
- 1: Gemiddeld — merkbare verbetering
- 0,5: Laag — kleine gemakverbetering
- 0,25: Minimaal — alleen cosmetisch of edge-case

ZEKERHEID — hoe zeker bent u (0-100%):
- 100%: Gevalideerd met gegevens en onderzoek
- 80%: Enig onderzoek, redelijke aannames
- 50%: Buikgevoel, nog geen onderzoek
- 20%: Zuivere hypothese, ongetest

INSPANNING — engineer-weken om te bouwen (inclusief ontwerp, test, deploy):
- Wees eerlijk. Verdubbel je eerste schatting.
- Inclusief: design, development, testing, docs, analytics instrumentering

Scoringtabel:
| Functie | Bereik | Impact | Zekerheid | Inspanning | RICE Score | Opmerkingen |
|---|---|---|---|---|---|---|
| [Functie A] | 2500 | 2 | 80% | 3w | (2500×2×0,8)/3 = 1333 | |
| [Functie B] | 800 | 3 | 50% | 6w | (800×3×0,5)/6 = 200 | |

Output: gerangschikte lijst + top 3 om deze sprint op [X] capaciteit te bouwen.
```

### PRD-sjabloon

```
Schrijf een PRD voor [functie].

Functie: [beschrijf]
Probleem dat het oplost: [het gebruikersprobleem, niet de functieomschrijving]
Wie heeft het aangevraagd: [klanten / intern / datagestuurde]
Prioriteit: [P0 kritiek / P1 hoog / P2 gemiddeld]
Doelrelease: [sprint / kwartaal]

PRD-structuur:

## Overzicht
**Functie:** [Naam]
**Auteur:** [PM-naam] | **Datum:** [datum] | **Status:** [Concept / Review / Goedgekeurd]
**Engineering eigenaar:** [naam] | **Design eigenaar:** [naam]

## Probleemstelling
[2-3 zinnen: wie heeft dit probleem, wat kost het probleem en waarom is het nu belangrijk om het op te lossen. Geen oplossingstaal hier.]

## Succesmetrieken
Primaire metriek: [de ene KPI die verandert als dit wordt uitgebracht]
Secundaire metrieken: [1-2 ondersteunende metrieken]
Tegen-metrieken: [wat we monitoren om ervoor te zorgen dat we niets anders breken]

## Gebruikersverhalten
Formaat: "Als [gebruikerstype], wil ik [actie], zodat [resultaat]."

Gelukkig pad:
- Als [gebruiker], wil ik [kernactie], zodat [kernwaarde].

Edge cases:
- Als [gebruiker], wanneer [edge voorwaarde], wil ik [actie], zodat [resultaat].

Fouttoestanden:
- Als [gebruiker], wanneer [fout optreedt], wil ik [feedback], zodat [herstelactie].

## Acceptatiecriteria
□ [Specifieke, testbare voorwaarde — moet binair slagen/mislukken]
□ [Nog een voorwaarde]
□ [Foutbehandelingsverzekering]

## Bereik

In bereik:
- [Specifiek gedrag 1]
- [Specifiek gedrag 2]

Buiten bereik (expliciet):
- [Iets dat we in deze versie NIET bouwen]
- [Edge case uitgesteld naar v2]

## Design- en technische opmerkingen
[Link naar Figma / design spec]
[Alle technische beperkingen waarvan PM zich bewust is]
[API- of datamodel implicaties]

## Open vragen
- [ ] [Vraag die moet worden opgelost voordat de bouw begint] — eigenaar: [naam] — vervaldatum: [datum]

## Launchplan
- [ ] Analytics-instrumentering: [evenementen om af te steken]
- [ ] Functievlag: [ja — rollout-plan / nee]
- [ ] Communicatie: [klantgericht? / alleen intern?]
- [ ] Docs-update nodig: [ja/nee]

Genereer de PRD voor mijn functie met deze structuur.
```

### Functiespecs

```
Schrijf een gedetailleerde functiespecs voor [functie].

Functie: [naam]
PRD: [link of plak sleutelschema's]
Publiek: [engineering team]

Specs-structuur (technischer dan PRD):

## Functie: [Naam]
**Versie:** 1.0 | **Status:** Klaar voor ontwikkeling

## Functionele vereisten

### [Subfunctie of gebruikersstroamnaam]
**Trigger:** [wat initieert deze stroom]
**Actor:** [wie voert deze actie uit]

Stappen:
1. Gebruiker [actie] → Systeem [respons]
2. Gebruiker [actie] → Systeem [respons]

Gegevensvereisten:
- Invoer: [welke gegevens zijn nodig]
- Output: [welke gegevens worden geretourneerd/opgeslagen]
- Validatie: [regels die geldige invoer bepalen]

**Fouttoestanden:**
| Voorwaarde | Systeemrespons | Gebruiker ziet |
|---|---|---|
| [foutvoorwaarde] | [wat er gebeurt] | [foutbericht] |

## Niet-functionele vereisten
- Performance: [responsetijddoel, bijv. < 200ms p99]
- Beschikbaarheid: [dezelfde SLA als rest van product]
- Gegevensbewaring: [hoe lang worden deze gegevens bewaard?]
- Beveiliging: [auth, permission of PII overwegingen]

## API-ontwerp (indien van toepassing)
Eindpunt: [METHODE /pad]
Request body: [schema]
Response: [schema]
Foutcodes: [lijst]

## Analytics-gebeurtenissen die moeten worden afgevuurd
| Evenement | Wanneer | Eigenschappen |
|---|---|---|
| [event_name] | [wanneer het afvuurt] | [sleuteleigenschappen] |

## Rollout-plan
- [ ] Feature flag-sleutel: [feature.flag.name]
- [ ] Interne test: [welk team + wanneer]
- [ ] Kanary: [X% van gebruikers, beginnend wanneer]
- [ ] Volledige release: [datum of sprint]

Schrijf de specs voor mijn functie.
```

### Go-to-Market Checklist

```
Bouw een go-to-market checklist voor [functielunch].

Functie: [beschrijf]
Launchtype: [groot / klein / intern]
Publiek: [alle gebruikers / segment / nieuwe aanmeldingen / B2B-klanten]
Launchdatum: [doelstelling]

Go-to-market checklist per rol:

PRODUCT (eigenaar):
□ Functie volledig QA'd en bugvrij op staging
□ Analytics-events geverifieerd als correct afgegaan (controleren in debug mode)
□ Functievlag geconfigureerd met correct rollout%
□ Rollback-plan gedocumenteerd (hoe je de vlag uit kunt zetten als iets mis gaat)
□ A/B-test ingesteld (indien van toepassing)

ENGINEERING (leider):
□ Alle acceptatiecriteria nagekomen
□ Performance getest bij verwachte belasting
□ Foutbewaking ingesteld voor nieuwe codepads
□ Databasemigraties voltooid en getest
□ Feature flag killswitch getest

DESIGN:
□ Uiteindelijke ontwerpen correct geïmplementeerd (steekproef met ontwerper)
□ Mobile responsiveness geverifieerd
□ Toegankelijkheidsproof afgerond
□ Lege en fouttoestanden geïmplementeerd

MARKETING (indien klantgericht):
□ In-app aankondiging of tooltip geschreven en beoordeeld
□ E-mail aan betrokken gebruikers opgesteld (indien nodig)
□ Blogpost of changelog-item klaar om te publiceren
□ Helpdocs bijgewerkt of geschreven
□ Sales team ingelicht over nieuwe capaciteit

CUSTOMER SUCCESS (indien enterprise):
□ CSM's gedeeld in functie en belangrijkste use cases
□ High-touch klanten van tevoren op de hoogte gebracht
□ FAQs voorbereide voor supportteam

LAUNCHDAG:
□ Functievlag ingeschakeld op [X]% (of 100% voor klein)
□ Monitor: foutpercentage op nieuwe endpoints voor eerste 30 minuten
□ Monitor: p99 latentie ongewijzigd
□ Aankondiging gepubliceerd (in-app / email / blog)
□ Slack #launches update geplaatst

POST-LAUNCH (1 week):
□ Primaire metriek: [X]% verbetering vs baseline
□ Foutpercentage: terug naar normaal
□ Supportticket volume: geen piek op deze functie
□ Kwalitatief: feedback van gebruikers over de functie?

Genereer de checklist voor uw launchtype en teamstructuur.
```

## Voorbeeld

**Gebruiker:** PM bij een SaaS-bedrijf. Engineering vraagt me om te prioriteren tussen: (A) CSV-export, (B) Slack-integratie, (C) donkere modus, (D) aangepaste webhooks. We hebben 4 engineer-weken volgende sprint. Hoe besluit ik?

**Claude's RICE-analyse:**

Ik zal deze namens jou scoren met redelijke aannames — je moet de nummers valideren, maar deze structuur maakt de beslissing verdedigbaar.

**Aannames die ik maak (corrigeer me als ik ongelijk heb):**
- Je bent B2B SaaS, ~500 MAU die de betreffende functies gebruiken
- Geen eerdere research of data over deze specifiek

| Functie | Bereik | Impact | Zekerheid | Inspanning | RICE | Verdict |
|---|---|---|---|---|---|---|
| CSV-export | 400 | 2 | 70% | 1w | 560 | **Bouwen** |
| Slack-integratie | 200 | 3 | 60% | 3w | 120 | Misschien |
| Donkere modus | 500 | 0,5 | 50% | 2w | 62 | Uitstel |
| Aangepaste webhooks | 80 | 3 | 80% | 4w | 48 | Uitstel |

**Aanbeveling: CSV-export deze sprint, rest uitstellen.**

**Waarom CSV-export wint:** Bijna elke gebruiker in een B2B-product moet uiteindelijk gegevens exporteren. Hoog bereik, snel op te bouwen, hoge zekerheid dat het nodig is (als klanten het nog niet vragen, zullen ze het binnen 6 maanden van productrijpheid doen).

**Waarom Slack-integratie laag scoort:** De integratie zelf kan 3 weken duren, maar de Slack-to-value journey is lang — gebruikers moeten het instellen, meldingen configureren en gewoonten veranderen. Echte bereik is waarschijnlijk 30-40% van uw schatting als adoptie in acht wordt genomen. Tafel het tot je klantvalidatie hebt.

**Waarom donkere modus laag scoort:** Het is een standaardfunctie die bijna nooit de reden is waarom iemand koopt of vertrekt. Zend het uiteindelijk uit, maar niet ten koste van retentie- of acquisitiefeatures.

**Waarom aangepaste webhooks laag scoort:** Hoge impact per gebruiker, maar alleen power users hebben het nodig. De 80 gebruikers die het nodig hebben, zijn waarschijnlijk luid, maar vertegenwoordigen een klein deel van uw groeihendel.

---
