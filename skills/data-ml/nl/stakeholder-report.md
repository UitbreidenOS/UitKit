---
name: stakeholder-report
description: "Wekelijks en maandelijks gegevensrapport voor belanghebbenden: hoofdstatistieken, trends, grondoorzaakanalyse, actiepunten — gestructureerd voor directie- en cross-functioneel publiek"
---

# Stakeholderrapport Vaardigheid

## Wanneer activeren
- Bij het schrijven van het wekelijkse of maandelijkse gegevensrapport voor leidinggevenden, raad van bestuur of cross-functionele belanghebbenden
- Bij het vertalen van ruwe analyses naar een beslissingsklaar document — niet alleen een gegevensdump
- Wanneer u zowel wat er is gebeurd als waarom moet presenteren, niet alleen statistieken
- Bij de voorbereiding van het analytische gedeelte van een bedrijfsreview, QBR of bestuurspakket
- Bij het communiceren van gegevensbevindingen aan een gemengd publiek (technisch en niet-technisch)

## Wanneer NIET gebruiken
- Live dashboardupdates — stel die in uw BI-tool in
- Ruwe gegevensexports — belanghebbenden hoeven geen CSV's te zien
- Statistische onderzoeksartikelen — dit is zakelijke communicatie, geen academische analyse
- Eenmalige verkennende analyse — gebruik `/sql` of `/pandas-polars` voor ad-hoc werk

## Instructies

### Wekelijks stakeholderrapport

```
Schrijf een wekelijks gegevensrapport voor [publiek: leiderschapsteam / afdelingshoofden / raad van bestuur].

BEDRIJF/TEAM: [naam]
WEEK VAN: [datumbereik]
RAPPORTAUTEUR: [uw naam/team]

HOOFDSTATISTIEKEN (vs. vorige week en vs. doel):

Groei:
- [Statistiek 1]: [waarde] ([+/-X%] WoW, [+/-X%] vs. doel)
- [Statistiek 2]: [waarde] ([+/-X%] WoW, [+/-X%] vs. doel)

Omzet:
- [Statistiek]: [waarde] ([verandering])

Betrokkenheid / Product:
- [Statistiek]: [waarde] ([verandering])

Efficiëntie:
- [Statistiek]: [waarde] ([verandering])

WAT DEZE WEEK IS GEBEURD (gebeurtenissen die de cijfers verklaren):
- [Gebeurtenis 1: productrelease, campagne, incident, partnerovereenkomst, etc.]
- [Gebeurtenis 2]

ANALYSE:
- Grondoorzaak van de grootste positieve beweging: [beschrijf]
- Grondoorzaak van de grootste negatieve beweging: [beschrijf]
- Eventuele afwijkingen die niet in het patroon passen: [beschrijf of "geen"]

DEZE WEEK BENODIGDE BESLISSINGEN:
[Vermeld beslissingen die de gegevens informeren — wat moet het team anders doen?]

VOORUITBLIK VOLGENDE WEEK:
- Te volgen statistieken: [welke statistieken zullen volgende week het meest bewegen en waarom]
- Geplande wijzigingen die gegevens beïnvloeden: [releases, campagnes, etc.]

Genereer een rapport in narratief + gegevensformaat. Begin met een alinea samenvatting voor leidinggevenden. Gebruik koppen voor elke sectie. Voeg specifieke datapunten toe. Vermijd vage taal ("relatief goed" → "14% boven plan"). Totale lengte: 600-800 woorden.
```

---

### Maandelijks stakeholderrapport

```
Schrijf een maandelijks gegevensrapport. Gedetailleerder dan wekelijks — bevat trends, cohortanalyse en toekomstgerichte commentaar.

MAAND: [Maand Jaar]
PUBLIEK: [leidinggevenden / raad van bestuur / investeerders / alle medewerkers]

SAMENVATTING VOOR LEIDINGGEVENDEN:
- Maand in één zin: [het belangrijkste dat is gebeurd]
- Maand vs. plan: [op koers / vooruit / achter — primaire drijfveer]

MAANDELIJKSE STATISTIEKEN (vs. vorige maand en vs. zelfde maand vorig jaar):

[Statistiek] | [Deze maand] | [Vorige maand] | [MoM %] | [Vorig jaar] | [YoY %] | [vs. plan]
Omzet | $[X]M | $[X]M | [+/-X%] | $[X]M | [+/-X%] | [+/-X%]
[Statistiek 2] | ... | ... | ... | ... | ... | ...
[Ga door voor elke KPI]

TRENDANALYSE:
- 3-maandse trend op [belangrijkste statistiek]: [beschrijf richting en veranderingssnelheid]
- 12-maandse trend op [omzet of primaire KPI]: [beschrijf]
- Vroege indicatoren voor volgende maand: [wat zeggen vroege signalen over volgende maand?]

GRONDOORZAAKANALYSE — WINSTEN:
[Voor de grootste positieve beweging: wat dreef het, is het herhaalbaar, wat moeten we meer van doen?]

GRONDOORZAAKANALYSE — MISSERS:
[Voor de grootste misser: wat veroorzaakte het, is het eenmalig of structureel, wat is het plan?]

COHORTINZICHTEN (indien van toepassing):
[Prestaties nieuwe gebruikerscohort, retentiecurven, LTV per acquisitiebron]

PROGNOSE-UPDATE:
- Herziene K[?]-prognose: $[X]M (was $[X]M, verandering vanwege: [reden])
- Jaarlijkse prognose: $[X]M ([X]% boven/onder oorspronkelijk plan)
- Wijzigingen in kernassumpties: [wat is er veranderd in het model]

ACTIES EN EIGENAREN:
| Actie | Eigenaar | Deadline | Successtatistiek |
|---|---|---|---|
| [Actie 1] | [Naam] | [Datum] | [Hoe we het meten] |
| [Actie 2] | [Naam] | [Datum] | [Hoe we het meten] |

Genereer het volledige maandelijkse rapport. Verhalende toon — geen opsommingslijst. Elke sectie moet verbonden zijn met de volgende.
```

---

### Grondoorzaakanalysesectie

Dit is de meest waardevolle en moeilijkste sectie om te schrijven. Gebruik deze prompt om het te structureren:

```
Schrijf een grondoorzaakanalyse voor [statistieknaam] [stijging/daling] met [X%] in [periode].

SYMPTOOM:
[Statistiek] veranderde van [X] naar [X] — een [X%] [stijging/daling].
Dit was [verwacht / onverwacht / gedeeltelijk verwacht].

GEGEVENS DIE IK HEB:
- Segmentopsplitsing: [hoe splitst deze statistiek op naar [kanaal / cohort / geografie / productlijn]?]
- Correlatie met andere statistieken: [wat bewoog tegelijkertijd?]
- Tijdlijn: [wanneer begon het precies te bewegen? Was het geleidelijk of plotseling?]

HYPOTHESEN (vermeld in volgorde van waarschijnlijkheid):
1. [Meest waarschijnlijke oorzaak] — ondersteund door: [welke gegevens ondersteunen dit]
2. [Tweede hypothese] — ondersteund door: [gegevens]
3. [Derde hypothese] — ondersteund door: [gegevens]

WAT IK HEB UITGESLOTEN:
- [Hypothese X] — omdat [bewijs daartegen]

CONCLUSIE:
- Primaire oorzaak: [uw beste beoordeling]
- Betrouwbaarheid: [Hoog / Gemiddeld / Laag]
- Hoe te verifiëren: [welke analyse zou dit bevestigen]
- Aanbevolen actie: [wat er aan te doen]
- Verwachte impact van actie: [X% verbetering in statistiek over X weken]

Schrijf dit als een 300-woorden GBA-sectie klaar om te plaatsen in een stakeholderrapport.
```

---

### Gegevenssamenvatting op bestuursniveau

```
Schrijf de gegevens-/statistieksectie van een bestuursupdate.

BESTUURSVERGADERING: [datum]
RAPPORTAGEPERIODE: [kwartaal of maand]
BEDRIJFSFASE: [seed / Series A / groei / pre-IPO]

HOOFDSTATISTIEKEN vs. PLAN:
[Plak uw kernstatistieken met planvergelijking]

Kernpunten waar besturen om geven (per fase):

SEED/SERIES A:
- Omzet/ARR en groeipercentage vs. plan
- Burn rate en runway
- Kern product- of klantmijlpalen
- Aanwerving vs. plan

GROEIFASE:
- Omzet, brutomarge en unit economics-trends
- CAC en terugverdientijd — verbetert of verslechtert?
- NRR — expansie vs. verloop
- Pad naar winstgevendheid (indien relevant)

PRE-IPO:
- GAAP vs. non-GAAP statistieken
- Rule of 40 positie
- Kwartaalprognose en variantieverklaring

Schrijf de statistieksectie:
1. Samenvatting in 2 zinnen (eerlijk — besturen prikken door spin heen)
2. Tabel kernstatistieken met vs. plan
3. 3 punten: wat prestaties dreef (positief en negatief)
4. 1 toekomstgerichte zin: herziene prognose of kernpunt om volgende kwartaal te volgen

Onder 300 woorden. Geen jargon. Begin met feiten.
```

---

### Gegevenspakket kwartaalsbedrijfsreview (QBR)

```
Schrijf het gegevenspakket voor een kwartaalsbedrijfsreview met [publiek: klanten / interne leidinggevenden / partners].

KWARTAAL: K[?] [Jaar]
TYPE: [Interne QBR / Klant-QBR / Partner-QBR]

INTERNE QBR (leiderschapsteam):
- Kwartaalprestaties vs. OKR's
- Top 3 winsten met gegevens
- Top 3 missers met grondoorzaak
- Herziene jaarprognose
- Resourceaanbevelingen voor volgend kwartaal

KLANT-QBR (voor een SaaS-klantsucces-review):
Klant: [naam]
- Gebruiksstatistieken: [DAU's, gebruikte kernfuncties, adoptie vs. gecontracteerde seats]
- Geleverde waarde: [behaalde resultaten — kwantificeer waar mogelijk]
- Aankomende roadmap-functies die voor hen relevant zijn
- Verlooprisiconiveau: [Groen / Geel / Rood]
- Aanbevolen volgende stappen voor hun account

PARTNER-QBR:
- Gezamenlijk gegenereerde pipeline: $[X]M
- Gezamenlijke winsten: [N] klanten, $[X]M ARR
- Pipeline op risico: [N] deals, redenen
- Co-marketingprestaties
- Aanbevolen investeringen voor volgend kwartaal

Genereer het passende QBR-gegevenspakket op basis van het geselecteerde type.
```

---

### Statistiekenglossariumsectie

Wanneer uw belanghebbenden niet weten wat de statistieken betekenen:

```
Genereer een begrijpelijk statistiekenglossarium voor ons stakeholderrapport.

TE DEFINIËREN STATISTIEKEN:
[Vermeld uw statistieken]

Per statistiek:
- Naam: [officiële naam]
- Begrijpelijke omschrijving: [wat het meet in één zin — geen jargon]
- Waarom het belangrijk is: [waarom deze statistiek ons vertelt of het bedrijf gezond is]
- Hoe het wordt berekend: [formule of beknopte beschrijving]
- Streefbereik: [wat "goed" eruit ziet voor ons bedrijf]
- Wat het doet bewegen: [de voornaamste drijfveren]

Houd elke definitie onder 80 woorden. Schrijf voor een niet-technisch leidinggevende die slim is maar geen data-analist.
```

## Voorbeeld

**Gebruiker:** Maandelijks rapport voor het leiderschapsteam. Omzet oktober: $2,1M (plan was $2,0M, +5%). MoM-groei: +12%. YoY: +47%. Verloop: 2,1% (was 1,8% vorige maand). NRR: 108% (was 112% vorige maand). Grootste gebeurtenis: enterprise-klant verliet midden in de maand (was 8% van ARR). Nieuwe logo-winsten: 14 (beste maand ooit). Publiek: CEO, CFO, VP Sales, VP Product.

**Verwachte uitvoer:** Volledig maandelijks rapport dat opent met "Oktober was een recordmaand voor nieuwe business die gedeeltelijk werd gecompenseerd door onze grootste klantverliesgebeurtenis tot nu toe." Omzetsectie toont $2,1M vs. $2,0M plan. Grondoorzaak verloop: het vertrek van de enterprise-klant dreef de NRR-daling van 112% naar 108% — een structurele, geen trendgebeurtenis. Record nieuwe logo's is een echt signaal. Actietabel: post-mortem op verlopen account (VP Customer Success, 7 nov), ICP-verfijning om klanten met soortgelijk risicoprofiel uit te sluiten (VP Product + VP Sales, 14 nov). Bewakingslijst: enterprise-verlengingspipeline voor K4.

---
