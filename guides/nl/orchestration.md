# Orchestratieprotocol

Een licht patroon voor het coördineren van persona's, agenten en vaardigheden op complex multidisciplinair werk.

Geen framework nodig. Geen afhankelijkheden. Alleen gestructureerde prompting.

---

## Kernbegrip

Meeste echte werk kruist domeinengrenzen. Een productlancering heeft engineering, marketing en strategie nodig. Een architectuuroverzicht heeft beveiliging, kostenanalyse en teamevaluatie nodig.

Orchestratie verbindt de juiste expertise met elke werkfase:

- **Agenten** definiëren *wie* denkt — identiteit, oordeel, communicatiestijl
- **Vaardigheden** definiëren *hoe* uit te voeren — stappen, sjablonen, voorbeelden, patronen
- **Fasen** definiëren *wanneer* te wisselen — als het werk van het ene domein naar het ander gaat

U combineert ze. Het patroon is altijd hetzelfde.

---

## Het patroon

### 1. Het doel bepalen

Zeg wat je wilt bereiken, niet hoe je het wilt bereiken.

```
Doel: Een nieuw SaaS-product voor kleine boekhoudkantoren lanceren.
Beperkingen: 2-persoonsteam, $5K budget, 6-weekse planning.
Succeskriterium: 50 betalende klanten in eerste 30 dagen.
```

### 2. De juiste agent selecteren

Kies de agent wiens oordeel bij de huidige fase past. Agenten dragen meningen, prioriteiten en besluitvormingskaders.

| Situatie | Agent | Waarom |
|---|---|---|
| Architectuurbeslissingen, tech stack, kopen vs. bouwen | `cto-advisor` | Engineering-oordeel |
| Lanceringsstrategie, groeikanalen, content | `cmo-advisor` | GTM- en kanaalexpertise |
| Financieel model, unit economics, fundraising | `cfo-advisor` | Cijfergebaseerde beslissingen |
| Productroadmap, prioritering, gebruikersonderzoek | `cpo-advisor` | Gebruikerssuccesfocus |
| Operaties, proces, teamstructuur | `coo-advisor` | Uitvoering eerst |
| Alles tegelijk, alleen | `ceo-advisor` | Multidisciplinaire prioritering |

**Activering:**
```
/agents/advisors/cto-advisor
```

### 3. Vaardigheden voor uitvoering laden

Agenten weten *wat* te doen. Vaardigheden weten *hoe* het met precisie te doen. Laad de vaardigheden die uw huidige fase nodig heeft.

```
/skills/devops-infra/aws-architect       — infrastructuurpatroon
/skills/backend/nodejs/nextjs            — frontend framework
/skills/devops-infra/cicd               — implementatiepijplijn
```

De agent stuurt beslissingen aan. De vaardigheden bieden gestructureerde stappen, sjablonen en concrete patronen.

### 4. In fasen werken

Verdeel het doel in fasen. Elke fase kan verschillende agenten en vaardigheden gebruiken.

```
Fase 1: Technische basis (Week 1-2)
  Agent: cto-advisor
  Vaardigheden: aws-architect, codebase-onboarding, cicd
  Output: Architectuurdoc, geïmplementeerd skelet, CI-pijplijn

Fase 2: Lanceringsvoorbereiding (Week 3-4)
  Agent: cmo-advisor
  Vaardigheden: copywriting, content-strategy, seo-audit
  Output: Landingspagina, inhoudskalender, lanceringsplan

Fase 3: Go-to-Market (Week 5-6)
  Agent: ceo-advisor
  Vaardigheden: email-sequence, analytics-tracking, pricing-strategy
  Output: Gelanceerd product, tracking, eerste klanten
```

### 5. Overdracht tussen fasen

Wanneer u van fase omschakelt, vat u altijd samen wat is besloten en wat open staat:

```
Fase 1 compleet.
Besluiten: AWS serverless (Lambda + DynamoDB), Next.js frontend, GitHub Actions CI
Gemaakte artefacten: architecture-doc.md, in staging geïmplementeerd
Openstaande vragen: prijsmodel (Fase 3 beslissing)

Overstap naar Fase 2. Laden van cmo-advisor + copywriting + content-strategy vaardigheden.
```

---

## Algemene orchestratiepatronen

### Patroon A: Solo Sprint

Eén persoon, één doel, meerdere domeinen. Wissel agenten als u de fasen doorloopt.

```
Week 1: cto-advisor + engineering vaardigheden → Product bouwen
Week 2: cmo-advisor + marketing vaardigheden  → Lancering voorbereiding
Week 3: ceo-advisor + GTM vaardigheden        → Verzenden en itereren
```

Beter voor: nevenprojecten, MVPs, solo-oprichters, one-person startups.

### Patroon B: Domeinduik

Eén domein, maximale diepte. Enkele agent, meerdere gestapelde vaardigheden.

```
Agent: cto-advisor
Vaardigheden tegelijk geladen:
  - aws-architect       → infrastructuurontwerp
  - cloud-security      → beveiligingspostuur
  - slo-architect       → betrouwbaarheidsdoelen
  - chaos-engineering   → uitvalmodustest

Taak: Volledig productie-gereedheidsonderzoek
```

Beter voor: architectuuronderzoeken, complianceaudits, technische dieptes vóór lancering.

### Patroon C: Multi-agentonderzoek

Verschillende agenten onderzoeken hetzelfde probleem vanuit verschillende invalshoeken.

```
Stap 1: cto-advisor ontwerpt de technische architectuur
Stap 2: cfo-advisor beoordeelt het bouw-vs-koop kostenmodel
Stap 3: ceo-advisor maakt de uiteindelijke compromisbeslissing
```

Beter voor: risicobeslissingen, investorvoorbereiding, raadsbeslissingen, grote pivots.

### Patroon D: Vaardighedenketen

Geen agent nodig. Vaardigheden sequentieel ketenen voor procedureel werk.

```
1. /product-discovery    → Probleem identificeren en valideren
2. /experiment-designer  → Test ontwerpen
3. /analytics-tracking   → Meting instellen
4. /product-analytics    → Resultaten interpreteren
```

Beter voor: herhaalbare workflows, contentpijplijnen, nalevingschecklists, onderzoeksprocessen.

---

## Voorbeeld: Volledige productlancering (6 weken)

**Instelling:**
```
Doel: Een B2B-factureringtool voor freelancers lanceren
Team: 1 ontwikkelaar + 1 marketer
Tijdschema: 6 weken
Budget: $5K
```

**Week 1-2: Bouwen**
```
Agent: cto-advisor
Vaardigheden: aws-architect, nextjs, postgresql, stripe

Afleveringen:
- Architectuurbeslissing (serverless: Lambda + DynamoDB + Stripe)
- Geïmplementeerd MVP: auth, facturering, betalingsverzameling
- CI/CD-pijplijn (GitHub Actions → AWS)
```

**Week 3-4: Lanceringsvoorbereiding**
```
Agent: cmo-advisor
Vaardigheden: copywriting, seo-audit, content-strategy, email-sequence

Afleveringen:
- Landingspagina live (hero, prijzen, sociale bewijs)
- 3 blogberichten gepland (SEO-gericht)
- Welkome-e-mailreeks geconfigureerd (5 e-mails, 14-daagse druppeling)
- Lanceringsdag checklist
```

**Week 5: Lancering**
```
Agent: ceo-advisor
Vaardigheden: pricing-strategy, analytics-tracking, onboarding-cro

Afleveringen:
- Prijzen gefinaliseerd (3-tier: Solo $19 / Pro $49 / Team $99)
- Analytics-tracking end-to-end geverifieerd
- Product Hunt-inzending voorbereidt
- Onboarding-checklist geactiveerd (5-stap in-app)
```

**Week 6: Itereren**
```
Agent: ceo-advisor
Vaardigheden: product-analytics, experiment-designer, customer-success

Afleveringen:
- Week 1 metrieken: aanmeldingen, activeringsfrequentie, eerste betaling
- Geïdentificeerd topfrictionspunt (onboarding stap 3)
- Ontworpen en gelanceerd experiment
- Maand 2 roadmap geschetst
```

---

## Regels

1. **Eén agent tegelijk.** Wisselen is prima, maar vermengt niet twee agenten in dezelfde gespreksbeurt.
2. **Vaardigheden stapelen vrij.** Laad zoveel vaardigheden als de taak nodig heeft. Ze conflicteren niet.
3. **Agenten zijn optioneel.** Voor procedureel werk zijn vaardighedenketen alleen voldoende.
4. **Context gaat verder.** Bij het wisselen van fasen, vat u altijd eerst besluiten en artefacten samen.
5. **U beslist.** Orchestratie is een suggestie. Negeer elke fase, agent of vaardigheid te allen tijde.

---

## Snelverwijzing

**Agentactivering:**
```
/agents/advisors/cto-advisor
/agents/advisors/cmo-advisor
/agents/advisors/cfo-advisor
/agents/advisors/cpo-advisor
/agents/advisors/coo-advisor
/agents/advisors/ceo-advisor
/agents/advisors/general-counsel
/agents/roles/incident-commander
/agents/roles/senior-backend
/agents/roles/senior-frontend
/agents/roles/red-team
```

**Vaardighedenactivering:**
```
/skills/devops-infra/aws-architect
/skills/marketing/content-strategy
/skills/product/product-discovery
[zie skills/ directory voor volledige catalogus]
```

**Faseoordrachtssjabloon:**
```
Fase [N] voltooid.
Besluiten: [belangrijkste gemaakte besluiten opsommen]
Artefacten: [gemaakte bestanden of documenten opsommen]
Openstaande items: [wat de volgende fase moet oplossen]
Overstap naar: [agent] + [vaardigheden]
```

---
