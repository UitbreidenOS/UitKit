---
name: sdr-research-brief
description: "30-seconden accountdossier voor SDR's: bedrijfsoverzicht, recente aanleidingen, koopsignalen, stakeholderkaart en gepersonaliseerde outreach-invalshoek — op basis van een URL of bedrijfsnaam"
---

# SDR Onderzoeksbriefing Skill

## Wanneer activeren
- Je hebt een volledige accountbriefing nodig voordat je koude outreach schrijft
- Je hebt een bedrijfsnaam of URL en wilt binnen een minuut aanleidingen, signalen en stakeholders
- Voorbereiding voor een koud gesprek en je hebt gespreksonderwerpen + waarschijnlijke bezwaren nodig
- Een doelaccountlijst opbouwen en prioriteren op fit + timing
- Een bedrijf onderzoeken dat net betrokken is geraakt bij je content of een meeting heeft geboekt

## Wanneer NIET gebruiken
- Je hebt al diepgaande accountcontext van een vorige AE of in het CRM
- Bulk-verrijking van 50+ accounts tegelijk — gebruik de `/lead-enrichment` skill daarvoor
- Consumer/B2C-doelwitten — andere signalen en onderzoeksmethoden
- Als je alleen e-mailpersonalisatie nodig hebt — gebruik `/sdr-agent` rechtstreeks

## Instructies

### Kern accountbriefing prompt

```
Genereer een SDR-accountbriefing voor [BEDRIJFSNAAM / URL].

Mijn product: [wat je verkoopt in één zin]
Mijn ICP: [ideaal klantprofiel — omvang, sector, rol, pijn]

Produceer:

## 1. Bedrijfsoverzicht (30 seconden)
- Wat ze doen (1 zin, geen jargon)
- Omvang: personeelsbestand, geschatte omzet, financieringsfase
- Hoofdkantoor en hoofdmarkten
- Tech-stacksignalen (uit vacatures, BuiltWith, G2-recensies)
- Bedrijfsmodel: PLG / sales-led / self-serve / enterprise

## 2. Recente aanleidingen (waarom NU contact opnemen — niet 6 maanden geleden)
Scan op:
- Financieringsronde in de afgelopen 90 dagen → budget vrijgekomen
- Executive-aanstelling (nieuwe VP Sales, CRO, CFO) → nieuwe koper met mandaat om te veranderen
- Productlancering → schaalmodust, nieuwe werving
- Ontslagen → efficiëntiemandaat, kostenbesparingen
- Overname → integratiepijn, nieuwe tech-stackbehoeften
- Vacatures voor rollen die jouw product verwijdert of verbetert

## 3. ICP-fitscore (0-100)
Scoor op deze dimensies:
- Bedrijfsomvangfit: [gewicht 25]
- Sectorfit: [gewicht 20]
- Tech-stackoverlap: [gewicht 20]
- Aanleiding/timing: [gewicht 25]
- Toegankelijkheid beslisser: [gewicht 10]

## 4. Stakeholderkaart
Identificeer 3 personen om contact mee op te nemen (Champion, Economische Koper, Blocker):
- Naam, titel, LinkedIn-URL (indien openbaar)
- Waarom ze geïnteresseerd zijn in jouw product
- Beste kanaal om ze te bereiken
- Recente activiteit of bericht om naar te verwijzen

## 5. Gepersonaliseerde outreach-invalshoek
- De ENE haak die deze outreach nu relevant maakt
- Aanbevolen onderwerpregel (A/B-variant)
- Eerste zin concept (niet generiek — verwijs naar specifieke aanleiding)
- Bezwaar dat ze waarschijnlijk als eerste opwerpen
```

### Snelle briefing (CLI-stijl — onder 10 seconden)

```
Snelle SDR-briefing — [BEDRIJF]:
- Wat ze doen: [1 zin]
- Aanleiding: [het meest recente signaal — financiering, executive-aanstelling, vacature]
- Wie te contacten: [naam, titel]
- Openingshaak: [1 zin die verwijst naar de aanleiding]
- Risico: [wat hen mogelijk GEEN fit maakt]
```

### Kader voor aanleidingsonderzoek

Gebruik dit om signalen te vinden die Claude kan onderzoeken:

```typescript
interface TriggerSignal {
  type: 'funding' | 'exec_hire' | 'product_launch' | 'layoffs' | 'acquisition' | 'hiring_surge' | 'tech_change'
  recency: number // dagen geleden
  relevance: number // 0-1, hoe relevant is dit voor jouw product
  hook: string // hoe ernaar te verwijzen in outreach
}

const TRIGGER_SOURCES = [
  'Crunchbase / TechCrunch — financieringsrondes',
  'LinkedIn — executive-aanstellingen in de afgelopen 90 dagen',
  'Bedrijfsblog — productaankondigingen',
  'LinkedIn Jobs — openstaande vacatures (signaal: 10+ tech-vacatures = groei)',
  'G2 / Capterra-recensies — welke tools ze gebruiken en haten',
  'Glassdoor — cultuurssignalen, tech-stackvermeldingen',
  'SEC-ingediende documenten — alleen beursgenoteerde bedrijven, gebruik earnings calls voor pijnpunten',
  'Reddit/HN — bij technische oprichters, kijk wat ze klagen',
]

// Prioriteitsvolgorde: financiering > executive-aanstelling > productlancering > ontslagen > groeispurt > tech-wijziging
// Ouder dan 90 dagen: deprioriteer — de timing is voorbij
```

### Stakeholderkaartprompt

```
Breng de koopcommissie in kaart voor [BEDRIJF] voor een aankoop van [PRODUCTCATEGORIE].

Typische rollen in deze koopbeslissing:
- Champion (gebruikt het product dagelijks, pleit intern)
- Economische Koper (tekent het contract, geeft om ROI)
- Technische Evaluator (beoordeelt beveiliging, integratie, schaalbaarheid)
- Blocker (juridisch, financiën, IT — kan deals torpederen)

Per rol:
1. Wie bij [BEDRIJF] vervult het waarschijnlijk? (naam indien vindbaar op LinkedIn)
2. Waar geven ze het meest om?
3. Welk bezwaar werpen ze op?
4. Welke boodschap zorgt ervoor dat ze ja zeggen?

Uitvoer als tabel: Rol | Naam | Titel | Pijn | Boodschap | Bezwaar
```

### ICP-scoringcriteria (aanpassen per product)

```
ICP-scoring — [PRODUCTNAAM]

BEDRIJFSOMVANG (25 ptn):
- 50-500 medewerkers: 25 ptn
- 500-2000: 15 ptn
- <50 of >2000: 5 ptn

SECTOR (20 ptn):
- Doelverticalen [lijst de jouwe]: 20 ptn
- Aangrenzend: 10 ptn
- Buiten: 0 ptn

TECH-STACK (20 ptn):
- Gebruikt [jouw integratiepartners]: +5 ptn elk, max 20
- Gebruikt directe concurrent: -10 ptn (moeilijkere verkoop, maar mogelijk)

AANLEIDING (25 ptn):
- Financiering in 90 dagen: 25 ptn
- Executive-aanstelling in 90 dagen: 20 ptn
- Productlancering: 15 ptn
- Groeispurt (>20% groei personeelsbestand): 15 ptn
- Geen recente aanleiding: 5 ptn

TOEGANKELIJKHEID BESLISSER (10 ptn):
- Directe LinkedIn-verbinding met koper: 10 ptn
- 2e-graads verbinding: 7 ptn
- Geen verbinding: 3 ptn

TOTAAL: /100
- 80+: Prioriteit 1 — gepersonaliseerde outreach onmiddellijk
- 60-79: Prioriteit 2 — sequence binnen 2 weken
- 40-59: Prioriteit 3 — nurture
- <40: Geen fit — sla over
```

### Sjabloon voor onderzoeksuitvoer

```markdown
# Accountbriefing: [BEDRIJF] — [DATUM]

## Overzicht
[Bedrijf] is een [beschrijving]. [Medewerkers] medewerkers. [Financieringsfase].
Primaire markt: [geografie + segment]. Tech-stack: [belangrijkste tools].

## Waarom Nu (Aanleiding)
[AANLEIDINGSTYPE] — [specifieke gebeurtenis, datum, bron].
Relevantie: [hoe dit verbindt met jouw product/pijnpunt].

## ICP-Score: [X]/100
- Omvang: [X/25] | Sector: [X/20] | Stack: [X/20] | Aanleiding: [X/25] | Toegang: [X/10]

## Contact Opnemen Met
| Rol | Naam | Titel | LinkedIn | Prioriteit |
|---|---|---|---|---|
| Champion | [Naam] | [Titel] | [URL] | 1e |
| Economische Koper | [Naam] | [Titel] | [URL] | 2e |
| Blocker | [Naam] | [Titel] | [URL] | Ter info |

## Outreach-invalshoek
Haak: [de specifieke aanleiding-gebaseerde haak]
Onderwerp: [A-versie] / [B-versie]
Opening: [Eerste zin die verwijst naar de haak — niet generiek]
Waarschijnlijk bezwaar: [Waar ze als eerste op terugkomen]
```

## Voorbeeld

**Gebruiker:** Geef me een accountbriefing over Vercel. Ik verkoop een B2B observability-tool voor frontend-prestaties.

**Uitvoer:**
```markdown
# Accountbriefing: Vercel — juni 2026

## Overzicht
Vercel is een cloudplatform voor frontend-ontwikkelaars, gebruikt door 1M+ ontwikkelaars wereldwijd.
~1.200 medewerkers. Series E ($150M, 2023). Hoofdkantoor: San Francisco. Stack: Next.js (eigen),
Turborepo, Datadog, PagerDuty, Segment.

## Waarom Nu (Aanleiding)
NIEUWE EXECUTIVE-AANSTELLING — VP of Platform Engineering aangesteld vanuit Cloudflare (LinkedIn, 14 dagen geleden).
Nieuwe platformleiders controleren monitoring-tools doorgaans in de eerste 90 dagen.
Relevantie: Vercels schaal (miljoenen deploys/dag) creëert frontend-latentiecomplexiteit
die hun huidige stack (Datadog) niet optimaliseert.

## ICP-Score: 88/100
- Omvang: 25/25 | Sector: 20/20 | Stack: 15/20 | Aanleiding: 25/25 | Toegang: 3/10

## Contact Opnemen Met
| Rol | Naam | Titel | LinkedIn | Prioriteit |
|---|---|---|---|---|
| Champion | [VP Platform] | VP Platform Engineering | [URL] | 1e |
| Economische Koper | [CTO] | CTO | [URL] | 2e |
| Blocker | [IT/Beveiliging] | Head of Security | [URL] | Ter info |

## Outreach-invalshoek
Haak: Nieuwe VP Platform op jouw schaal — Datadog toont geen frontend-latentie per edge-node
Onderwerp A: "Frontend observability voor Vercels schaal" / Onderwerp B: "Hoe [X] p95-latentie met 40% verlaagde"
Opening: "Gefeliciteerd met de VP Platform-aanstelling — teams op jouw schaal merken bij de eerste 90-dagenaudit doorgaans
hiaten in frontend-specifieke observability die algemene APM-tools zoals Datadog niet dekken."
Waarschijnlijk bezwaar: "We hebben al Datadog / we hebben dit intern gebouwd"
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
