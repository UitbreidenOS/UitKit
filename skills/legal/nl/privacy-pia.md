---
name: privacy-pia
description: "Gegevensbeschermings-effectbeoordeling (PIA/DPIA): intake verwerkingsactiviteit, rechtmatigheidsgrondslag controle, DPIA noodzakelijkheid test, risicoregister, DPO handoff — GDPR Artikel 35 werkstroom"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../privacy-pia.md).

# Privacy PIA-vaardigheid

## Wanneer activeren
- Lancering van een nieuwe productfunctie die persoonlijke gegevens verwerkt
- Onboarding van een nieuwe leverancier die persoonlijke gegevens verwerkt
- Wijziging van hoe u bestaande persoonlijke gegevens gebruikt (nieuw doel, nieuwe deling)
- Verplichte DPIA vereist onder GDPR Artikel 35 (systematische profilering, grootschalige verwerking, publiek toezicht)
- Voorbereiding van uw privacy governance-documentatie voor een compliance-audit

## Wanneer NIET gebruiken
- Reactie op een live gegevensinbreuk — ander proces (GDPR Art. 33/34)
- Aanvragen om toegang tot gegevens van betrokkenen — gebruik de DSAR-vaardigheid
- Formele juridische inzendingen bij toezichthoudende autoriteiten — benodigt uw DPO + advocaat

## Belangrijk

Een DPIA is verplicht onder GDPR Art. 35 vóór verwerking die "waarschijnlijk tot hoog risico leidt". Het nalaten om een vereiste DPIA uit te voeren is zelf een schending. Claude structureert de beoordeling — uw DPO moet controleren en goedkeuren voordat de verwerkingsactiviteit begint.

## Instructies

### Stap 1 — Intake verwerkingsactiviteit

```
Documenteer deze verwerkingsactiviteit:

Activiteitsnaam: [wat u bouwt of wijzigt]
Doel: [waarom u deze gegevens verwerkt — wees specifiek]
Betrokkenen: [wie — klanten / medewerkers / gebruikers / publiek]
Persoonlijke gegevenscategorieën:
- Standaard: [naam, e-mail, adres, telefoon, etc.]
- Speciale categorieën (GDPR Art. 9): [gezondheid / biometrisch / etnische afkomst / politiek / religieus / seksuele oriëntatie / strafblad]
Verwerkingsverantwoordelijke: [uw organisatie]
Gezamenlijke verwerkingsverantwoordelijken (indien van toepassing): [andere organisaties met beslissingsbevoegdheid]
Verwerkers: [leveranciers / gereedschappen die gegevens namens u verwerken]
Betrokken landen: [waar gegevens worden opgeslagen / naar overgedragen]
Bewaartermijn: [hoe lang u de gegevens bewaart]
```

### Stap 2 — Rechtmatigheidsgrondslag

```
Identificeer de rechtmatigheidsgrondslag voor deze verwerkingsactiviteit.

GDPR Artikel 6 rechtmatigheidsgrondslag (kies er één):
1. Toestemming (Art. 6(1)(a)): vrij gegeven, specifiek, geïnformeerd, ondubbelzinnig — kan worden ingetrokken
2. Contract (Art. 6(1)(b)): nodig voor een contract met de betrokkene
3. Wettelijke verplichting (Art. 6(1)(c)): vereist door EU/lidstaat wet
4. Vitale belangen (Art. 6(1)(d)): leven beschermen
5. Openbare taak (Art. 6(1)(e)): openbaar belang of officiële autoriteit
6. Gerechtvaardigd belang (Art. 6(1)(f)): uw belangen vs. rechten van betrokkenen (LIA nodig)

Voor speciale categoriegegevens, OOK een Art. 9(2) grondslag nodig:
- Expliciete toestemming
- Arbeidsrechtelijke verplichting
- Vitale belangen (onbekwaam persoon)
- Rechtmatige activiteiten van organisatie zonder winstoogmerk
- Openbaar gemaakt
- Rechtsvorderingen
- Wezenlijk openbaar belang
- Gezondheid/sociaal
- Volksgezondheid
- Archivering/onderzoek

Documenteer de rechtmatigheidsgrondslag en waarom deze van toepassing is.
[VERIFY] met DPO — het kiezen van de verkeerde grondslag is een compliance-probleem.
```

### Stap 3 — DPIA noodzakelijkheid test

```
Bepaal of een volledige DPIA (Gegevensbeschermings-effectbeoordeling) verplicht is.

DPIA is verplicht als verwerking "waarschijnlijk tot hoog risico leidt". Controleer:

Verplichte triggers (Art. 35(3) en EDPB-richtlijnen):
- Systematische en grootschalige geautomatiseerde profilering met juridische/aanzienlijke gevolgen? [ja/nee]
- Grootschalige verwerking van speciale categoriegegevens (gezondheid, biometrisch, etc.)? [ja/nee]
- Systematisch toezicht op publiek toegankelijk gebied? [ja/nee]

EDPB-criteria (2+ = DPIA waarschijnlijk nodig):
- Evaluatie/scoring van personen? [ja/nee]
- Geautomatiseerde besluitvorming met juridische/aanzienlijke gevolgen? [ja/nee]
- Systematisch toezicht? [ja/nee]
- Gevoelige gegevens of gegevens persoonlijke aard? [ja/nee]
- Grootschalige verwerking? [ja/nee]
- Matching of combinatie van datasets? [ja/nee]
- Gegevens over kwetsbare personen? [ja/nee]
- Innovatief gebruik of toepassing van nieuwe technologische/organisatorische oplossingen? [ja/nee]
- Verhindert betrokkenen het uitoefenen van hun rechten? [ja/nee]

Aanbeveling: [DPIA verplicht / DPIA aanbevolen / DPIA niet nodig — document reasoning]
```

### Stap 4 — Risicoregister

```
Identificeer en beoordeel privacy-risico's voor deze verwerkingsactiviteit.

Voor elk risico: [Risico] | [Waarschijnlijkheid: Hoog/Midden/Laag] | [Ernst: Hoog/Midden/Laag] | [Beperking] | [Restrisico na beperking]

Gangbare risico's om te beoordelen:
1. Onbevoegde toegang / gegevensinbreuk
2. Gegevens gebruikt buiten vermeld doel (doelcreep)
3. Buitensporige inzameling (falen gegevensminimalisatie)
4. Onnauwkeurige gegevens die betrokkene schaden
5. Inhouding langer dan nodig
6. Overdracht naar derde land zonder passende waarborgen
7. Weigering van rechten (toegang, wissen, overdraagbaarheid)
8. Discriminatoire uitkomsten van geautomatiseerde verwerking
9. Re-identificatie van gepseudonimiseerde gegevens
10. Uitval van leverancier/verwerker

Is restrisico na beperkingsmaatregelen aanvaardbaar?
Als HOOG restrisico blijft — moet toezichthouder raadplegen vóór verdergaan (Art. 36).
```

### Stap 5 — DPO handoff samenvatting

```
Genereer een DPO handoff-samenvatting voor deze PIA/DPIA.

Neem op:
- Activiteitsbeschrijving (één alinea)
- Rechtmatigheidsgrondslag en logica
- DPIA nodig? Ja/Nee — logica
- Top 3 risico's en beperkingen
- Openstaande vragen voor DPO-richtlijnen
- Aanbevolen goedkeuring: [goed / goed met voorwaarden / afwijzen / DPA raadplegen]

[VERIFY] met DPO voordat verwerking begint.
```

## Voorbeeld

**Nieuwe functie:** Een app wil locatiegegevens + aankoophistorie gebruiken om gebruikersprofielen voor gepersonaliseerde advertenties op te bouwen.

**Beoordeling van Claude:**

**Verwerkingsactiviteit:** Combinatie van locatie- en aankoophistoriegegevens voor op profilering gebaseerde gepersonaliseerde advertenties.

**Rechtmatigheidsgrondslag:** Toestemming (Art. 6(1)(a)) vereist — gerechtvaardigd belang waarschijnlijk onvoldoende om indringerigheid van locatietracking op te wegen.

**DPIA verplicht:** JA — systematische profilering (trigger 1), matching van meerdere datasets (EDPB-criterium 6), en speciale karakter van locatiegegevens (persistent tracking). 3+ criteria vervuld.

**Top-risico's:**
- Hoog: Profielgegevens gebruikt buiten advertentiedoel (doelcreep) — beperking: contractuele doelbeperking + technische handhaving
- Hoog: Locatiegegevens openbaren gevoelige informatie (gezondheid, religieuze praktijk, vakbondsactiviteit) — beperking: aggregatie + minimale precisie
- Midden: Toestemming niet vrij gegeven als feature-gated — beperking: echte opt-in, geen straf voor weigering

**DPO-aanbeveling:** DPIA verplicht vóór lancering. DPA raadplegen als restrisico na beperking hoog blijft.

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
