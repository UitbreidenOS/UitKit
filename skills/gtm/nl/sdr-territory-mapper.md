---
name: sdr-territory-mapper
description: "SDR-territoriumanalyse: breng accountdekking in kaart, identificeer witruimte, prioriteer op ICP-dichtheid en concentratie van aanleidingssignalen, bouw territoriaalplannen en dekkingsrapporten"
---

# SDR Territoriaal Mapper Skill

## Wanneer activeren
- Een nieuwe territoriumtoewijzing plannen voor een SDR of AE
- Je huidige territorium controleren op witruimte en onaangeraakte accounts
- Kwartaalplanning voor territorium en afstemming van personeelsbestand
- Identificeren welke segmenten of geografieën de hoogste ICP-dichtheid hebben
- Een territoriumplan presenteren aan je manager of in een QBR
- Territoriums herbalanceren na teamwijzigingen of een marktpivot

## Wanneer NIET gebruiken
- Individueel accountonderzoek — gebruik `/sdr-research-brief` daarvoor
- Volledig RevOps-forecasting — gebruik `/revenue-operations` voor pipelinemetrieken
- Klantsegmentatie voor CS — andere functie en signalen
- TAM/SAM/SOM voor investeerdersdekken — gebruik `/pitch-deck` daarvoor

## Instructies

### Territoriumgezondheidcheck

```
Voer een territoriumgezondheidcheck uit voor [TERRITORIUM — bijv. "Mid-Market EMEA, 200-1000 medewerkers, SaaS-verticalen"].

Mijn product: [wat je verkoopt]
Mijn ICP: [bedrijfsomvang, sector, tech-stack, doelrol]
Beschikbare territoriumdata: [CRM-export / Apollo-lijst / LinkedIn Sales Navigator-export / handmatige lijst]

[PLAK ACCOUNTLIJST OF DATA]

Analyseer:

## 1. Dekkingsoverzicht
- Totaal accounts in territorium: [N]
- Accounts ten minste één keer gecontacteerd: [N] ([%])
- Accounts nooit gecontacteerd: [N] — dit is de witruimte
- Accounts in actieve sequence: [N]
- Accounts met open kansen: [N]
- Accounts gesloten-gewonnen: [N]
- Accounts gesloten-verloren: [N] → geschikt voor heractivering in [X maanden]?

## 2. ICP-dichtheid per segment
Verdeel accounts op:
- Bedrijfsomvanggroep (50-200 / 200-500 / 500-1000 / 1000+)
- Sectorverticaal
- Geografie (land/regio)
Identificeer: welk segment heeft de hoogste ICP-dichtheid EN de laagste dekking = prioritaire witruimte

## 3. Concentratie aanleidingssignalen
Welk segment heeft de meeste accounts met actieve aanleidingen op dit moment?
(Financiering, executive-aanstellingen, productlanceringen, groeispurten)
Dit zijn je hoogst-kans doelen van deze maand.

## 4. Prioritaire accountlijst
Top 25 accounts om dit kwartaal op te focussen:
Gerangschikt op: ICP-score × aanleidingsrecentheid × toegankelijkheid contactpersoon
| Rang | Account | ICP-score | Aanleiding | Laatste contact | Prioriteit |
|---|---|---|---|---|---|

## 5. Territoriumhiaten
- Segmenten waar je onderpenetreert
- Sectoren zonder dekking
- Geografieën met accounts maar geen outreach
- Rollen die je niet hebt getarget (alleen VP Sales mailen maar niet CTO)

## 6. Aanbevolen wekelijkse cadans
Op basis van territoriumomvang en pipelinedoelstellingen:
- Accounts per dag te onderzoeken: [N]
- Nieuwe outreach per week te starten: [N]
- Follow-ups per dag: [N]
- Gesprekken per dag doelstelling: [N]
```

### ICP-dichtheidskaartprompt

```
Breng de ICP-dichtheid in kaart over mijn doelmarkt.

ICP-definitie:
- Sector: [lijst]
- Bedrijfsomvang: [X-Y medewerkers]
- Geografie: [regio/land]
- Tech-stacksignalen: [tools die fit aangeven]
- Te targeten rollen: [titels]

Gegevensbron: [Apollo-export / LinkedIn Sales Nav / CRM / handmatig]

[PLAK DATA]

Uitvoer:
1. Warmtekaart per segment — waar is de ICP-dichtheid het hoogst?
2. Onderbediende segmenten — hoge ICP-dichtheid, lage bestaande dekking
3. Oververzadigde segmenten — hoge concurrentie, dalende opbrengsten
4. Aanbevolen: waar 80% van de outreach-inspanning dit kwartaal te richten
```

### Witruimte-identificatieprompt

```
Identificeer witruimte in mijn territorium.

[PLAK CRM-EXPORT OF ACCOUNTLIJST]
[PLAK ACCOUNTS AL AANGERAAKT IN DE AFGELOPEN 6 MAANDEN]

Witruimte = accounts die:
1. Voldoen aan ICP-criteria
2. NIET zijn gecontacteerd in de afgelopen 6 maanden
3. Minstens één actief aanleidingssignaal hebben (financiering, werving, executive-aanstelling)

Uitvoer:
- Totale witruimte-accounts: [N]
- Top 20 witruimte-accounts gerangschikt op ICP-score + aanleidingsrecentheid
- Aanpak: koud, warm (wederzijdse verbinding), of onderzoek-eerst
```

### Territoriaalplan document (voor managerbeoordeling)

```
Schrijf een kwartaal territoriaalplan voor Q[X] [JAAR].

Territorium: [definitie]
SDR/AE: [naam]
Quota: [$ of meetingdoelstelling]
Prestaties vorig kwartaal: [% realisatie]

Genereer:

## Territoriumoverzicht
[1 alinea — wat het territorium is en waarom het een goede markt is]

## ICP-analyse
[Welke bedrijven in het territorium de beste fit zijn en waarom]

## Topaccounts (Prioriteit 1)
[Top 10 accounts — waarom elk een prioriteit is, aanleidingssignaal, contactstrategie]

## Dekkingsplan
[Wekelijkse activiteitsopbouw — onderzoek, nieuwe outreach, follow-ups, gesprekken]

## Pipelineprognose
[Verwachte geboekte meetings, conversie naar pipeline, verwachte omzetbijdrage]

## Benodigde middelen
[Welke ondersteuning nodig is — marketingcampagnes, content, introducties, tools]

## Risico's en mitigaties
[Wat er mis kan gaan en de noodmaatregel]
```

### Accountscoringsmodel voor territoriumprioriteiting

```typescript
interface TerritoryAccount {
  company: string
  employees: number
  industry: string
  techStack: string[]
  lastContactedDaysAgo: number | null
  triggerSignals: TriggerSignal[]
  linkedInConnections: number // 2e-graads verbindingen
  crmStatus: 'never_contacted' | 'in_sequence' | 'opportunity' | 'closed_lost' | 'closed_won'
}

function scoreTerritoryAccount(account: TerritoryAccount, icp: ICPCriteria): number {
  let score = 0

  // ICP-fit (50 punten)
  score += scoreCompanySize(account.employees, icp.sizeRange) * 0.2    // max 20
  score += scoreIndustry(account.industry, icp.industries) * 0.15       // max 15
  score += scoreTechStack(account.techStack, icp.techStack) * 0.15     // max 15

  // Timing (30 punten)
  const recentTriggers = account.triggerSignals.filter(t => t.recencyDays <= 90)
  score += Math.min(30, recentTriggers.length * 10)

  // Toegankelijkheid (10 punten)
  score += Math.min(10, account.linkedInConnections * 2)

  // Straf voor contactrecentheid (10 punten)
  if (account.lastContactedDaysAgo === null) {
    score += 10 // Nooit gecontacteerd — vers territorium = bonus
  } else if (account.lastContactedDaysAgo > 180) {
    score += 7  // Geschikt voor heractivering
  } else if (account.lastContactedDaysAgo > 90) {
    score += 3
  } else {
    score -= 10 // Recentelijk gecontacteerd — prioriteit verlagen
  }

  // CRM-statusaanpassing
  if (account.crmStatus === 'closed_lost') score += 5  // Kan heractiveren
  if (account.crmStatus === 'closed_won') score -= 50  // Nooit koude outreach naar bestaande klanten

  return Math.max(0, Math.min(100, score))
}

function buildTerritoryPriorityList(
  accounts: TerritoryAccount[],
  icp: ICPCriteria,
  topN: number = 25
): TerritoryAccount[] {
  return accounts
    .map(account => ({ account, score: scoreTerritoryAccount(account, icp) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ account }) => account)
}
```

### Identificatie van heractivering

```
Identificeer gesloten-verloren accounts die in aanmerking komen voor heractivering.

[PLAK CRM-EXPORT OF GESLOTEN-VERLOREN LIJST]

Heriactiveringscriteria:
- Deal verloren meer dan [90/180] dagen geleden
- Verloorreden is NIET: "nooit een fit" / "verkeerd bedrijf" / "afgemeld"
- Bedrijf heeft een nieuw aanleidingssignaal sedert het sluiten van de deal
- OF: een nieuwe beslisser is bijgekomen sedert het sluiten van de deal

Uitvoer:
- In aanmerking komende accounts: [N]
- Top 10 heriactiveringsdoelen gerangschikt op: nieuw aanleiding-kracht + tijd sedert verlies
- Aanbevolen aanpak: [koud herstart / warm e-mail met verwijzing naar geschiedenis / alleen nieuw contact]
- Onderwerpregelsuggestie voor heractiverings-e-mail
```

## Voorbeeld

**Gebruiker:** Territoriumplanning Q3. Ik heb EMEA mid-market SaaS, 200-1000 medewerkers. Mijn CRM-export toont 847 accounts, slechts 312 zijn de afgelopen 6 maanden gecontacteerd. Help me prioriteren.

**Uitvoer:**

**Dekkingsoverzicht:**
- 847 totale accounts | 312 aangeraakt (37%) | **535 witruimte-accounts** (63%)
- Actieve sequences: 89 accounts
- Open kansen: 23 accounts
- Gesloten-verloren geschikt voor heractivering: 67 accounts (verloren 90+ dagen geleden met nieuwe aanleidingen)

**Prioriteitsopbouw:**
- Prioriteit 1 (ICP-score 80+, recente aanleiding): 48 accounts → 100% van outreach week 1-2
- Prioriteit 2 (ICP-score 60-79, geen aanleiding): 127 accounts → outreach week 3-6
- Prioriteit 3 (ICP-score 40-59): 360 accounts → alleen low-touch sequence
- Deprioriteer (<40 score): 312 accounts → dit kwartaal uitsluiten

**Witruimte hotzone:** UK-gebaseerde FinTech (100-500 medewerkers) — 34 onaangeraakte accounts met hoge ICP-dichtheid, 12 met financieringsaanleidingen in de afgelopen 60 dagen. Dit is je Q3-sprintdoel.

**Weekplan:**
- Ma-di: 8 nieuwe accounts onderzocht + sequence gestart
- Wo-do: 15 follow-ups + 20 gesprekken
- Vr: Pipelinereview + voorbereiding volgende week
- Doelstelling: 12 nieuwe meetings geboekt / maand → 36 meetings / kwartaal

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
