# Claude voor SDR's

Alles wat een Sales Development Representative nodig heeft om AI-ondersteunde prospectie, outreach, reactieverwerking en pijplijnbeheer uit te voeren in Claude Code.

---

## Voor wie is dit bedoeld

Je bent een SDR, BDR of salesvertegenwoordiger wiens taak het is gekwalificeerde pijplijn te genereren — de juiste accounts vinden, contact opnemen, meetings boeken en overdragen aan AE's. Je besteedt te veel tijd aan onderzoek, e-mail schrijven en inbox-triage. Claude Code vermindert dit met 30-40x.

**Voor Claude Code:** 20 minuten per onderzocht account. 15 minuten per gepersonaliseerde e-mail. 2-4 uur per dag in de inbox. Handmatige CRM-updates na elk gesprek.

**Erna:** Volledig account-dossier in 30 seconden. Gepersonaliseerde e-mail in 30 seconden. Inbox getrieerd en reacties opgesteld in 8 minuten. CRM automatisch bijgewerkt vanuit gespreksscripten.

---

## Installatie in 30 seconden

```bash
# Installeer alle SDR-vaardigheden, agents en workflows
npx claudient add skills gtm
npx claudient add agents roles/sdr-agent

# Of selecteer wat je nodig hebt:
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/sdr-agent
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

---

## Jouw Claude Code SDR-stack

### Vaardigheden (slash-commando's)

| Vaardigheid | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/sdr-research-brief` | 30-seconden account-dossier met triggers, ICP-score, stakeholderkaart | Vóór elke outreach |
| `/sdr-agent` | End-to-end SDR-workflow — onderzoek → concept → goedkeuren → sturen → loggen | Volledige pijplijn-sessies |
| `/sdr-reply-classifier` | Inbox triageren: intentie classificeren, reactie opstellen, CRM bijwerken | Twee keer per dag inbox-check |
| `/sdr-call-prep` | Gespreksscripts, bezwaarscripts, discovery-vragen voor elk gesprek | 30 min voor bellen |
| `/sdr-call-analysis` | Gespreksscript na gesprek → CRM-notitie + coaching-feedback + follow-up | Na elk gesprek |
| `/sdr-objection-handler` | Dynamische bezwaarreactie voor prijs, concurrent, timing, vertrouwen | Op verzoek, elk kanaal |
| `/sdr-territory-mapper` | Whitespace-analyse, prioritaire accounts, territoriumplan | Wekelijkse/kwartaalplanning |
| `/sdr-lead-scorer` | ICP-fit scoring 0-100 met laag en aanbevolen actie | Prioriteren van leadlijsten |
| `/email-automation` | Multi-stap sequentieontwerp, afleverbaarheid, reactie-routing | Nieuwe sequenties bouwen |
| `/lead-enrichment` | Apollo/Clearbit/Firecrawl pijplijn om leads te verrijken en scoren | Bulk-verrijking |
| `/crm-hygiene` | HubSpot/Salesforce opschonen, deduplicatie, verouderde contacten, eigenaarschap | Maandelijkse CRM-gezondheid |
| `/hubspot` | Native HubSpot CRM-toegang — contacten, deals, notities lezen/schrijven | Direct CRM-werk |

### Agents

| Agent | Model | Wanneer te starten |
|---|---|---|
| `sdr-agent` | Opus (onderzoek) / Sonnet (concepten) | Volledige onderzoek-tot-outreach-sessies |
| `market-researcher` | Sonnet | Diepgaand account- of marktonderzoek |
| `competitive-analyst` | Sonnet | Concurrentie-intelligentie voor bezwaarvoorbereiding |

---

## Dagelijkse workflow

### Ochtend (30-60 minuten)

**1. Territorium-brief — wat vandaag te focussen**
```
/sdr-territory-mapper

Toon me de prioritaire accounts van vandaag:
- Welke A-tier accounts zijn nog niet gecontacteerd?
- Nieuwe triggersignalen op accounts in mijn pijplijn?
- Welke sequenties zijn op Dag 3 of Dag 7 (vandaag follow-up nodig)?
```

**2. Lead-scoring — nieuwe leads van 's nachts**
```
/sdr-lead-scorer

[Plak nieuwe inkomende leads, evenementsaanmeldingen of Apollo-exports]

Score tegen ICP en geef me de A-tier lijst om vandaag te bellen.
```

**3. Outreach-batch — onderzoek + concept voor de doelgroepen van vandaag**
```
/sdr-agent

Onderzoek en ontwerp gepersonaliseerde outreach voor:
1. [Bedrijf 1] — contact: [Naam, Titel]
2. [Bedrijf 2] — contact: [Naam, Titel]
3. [Bedrijf 3] — contact: [Naam, Titel]

Mijn product: [één zin]
Mijn ICP: [definitie]
Toon me alle concepten ter beoordeling voordat ze worden gepland.
```

---

### Middag (15-20 minuten)

**4. Inbox-triage — reactieclassificatie**
```
/sdr-reply-classifier

Hier zijn mijn reacties van vanmorgen:

Reactie 1 (van: naam@bedrijf.com):
[plak reactie]

Reactie 2 (van: naam@bedrijf.com):
[plak reactie]

Classificeer elk, stel reacties op voor geïnteresseerde/bezwaar-reacties,
update CRM, informeer me over warme leads.
```

---

### Vóór gesprek (2-5 minuten)

**5. Gespreksvoorbereiding — elk gesprek in het komende uur**
```
/sdr-call-prep

Naam: [prospectnaam]
Titel: [titel]
Bedrijf: [bedrijf]
Gesprekstype: [koud / follow-up / discovery]
Doel: [20-minuten discovery boeken]
Mijn product: [één zin]
Recente trigger: [wat je over hen weet]

Geef me: openingsscript, gespreksscript, top 3 bezwaren + reacties, voicemail.
```

---

### Na gesprek (2-5 minuten)

**6. Gespreksanalyse — loggen en leren**
```
/sdr-call-analysis

[Plak gespreksscript of notities]

Prospect: [naam, titel, bedrijf]
Gesprekstype: koud gesprek
Doel: discovery-meeting boeken
Uitkomst: [wat er gebeurde]

Extraheer: CRM-notitie, volgende stap, geuite bezwaren, coaching-feedback, follow-up e-mail concept.
```

---

### Wekelijks (vrijdag — 30 minuten)

**7. Territoriumreview en pijplijnrapport**
```
/sdr-territory-mapper

Wekelijkse review:
- Geboekte meetings deze week: [N]
- Gestarte sequenties: [N]
- Ontvangen reacties: [N]
- Resterend whitespace: [N]

Toon me: welke accounts te prioriteren volgende week, eventuele triggers die ik miste,
en of ik op schema lig voor mijn maandelijkse meeting-quotum.
```

---

## 30-daags opstartplan (nieuwe SDR's)

### Week 1 — Installatie en beheersing van onderzoek
- Installeer alle SDR-vaardigheden via `npx claudient add skills gtm`
- Configureer HubSpot MCP (zie `/hubspot`-vaardigheid voor installatie)
- Voer `/sdr-territory-mapper` uit op je initiële accountlijst
- Score 50+ accounts met `/sdr-lead-scorer` — raak vertrouwd met je ICP
- Lees: `/sdr-objection-handler` volledige bibliotheek voor je eerste gesprek

### Week 2 — Outreach lanceren
- Gebruik `/sdr-research-brief` voor elk account voor het eerste contact
- Stel eerste 20 e-mails op met `/sdr-agent` — beoordeel elk zorgvuldig
- Begin bijhouden: tijd per e-mail (doel: onder 5 minuten met Claude)
- Gebruik `/sdr-call-prep` voor elk koud gesprek — niet improviseren

### Week 3 — Reactieverwerking en gespreksanalyse
- Voer `/sdr-reply-classifier` uit op elke reactie — niet handmatig sorteren
- Neem elk gesprek op, voer `/sdr-call-analysis` uit op het transcript
- Vergelijk je bezwaarafhandeling met het playbook — identificeer het 1 bezwaar dat je blijft verliezen
- Gebruik `/sdr-objection-handler` om de bezwaren te oefenen die je het zwakst beheerst

### Week 4 — Optimalisatie
- Voer je eerste territoriumplanningssessie uit met `/sdr-territory-mapper`
- Bekijk alle gespreksanalyses — welke patronen komen naar voren?
- Identificeer je best presterende e-mailhaken (hoogste reactieratio) en bouw varianten
- Rapporteer aan je manager met data uit je CRM

---

## Tool-integraties

### HubSpot (aanbevolen CRM)

```json
// Voeg toe aan ~/.claude/settings.json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Hiermee verbonden kan Claude:
- Contacten, bedrijven, deals en notities lezen en schrijven
- Levenscyclusfasen en eigenaarstoewijzingen bijwerken
- Follow-up taken aanmaken vanuit gespreksanalyse
- CRM-opschoning uitvoeren op je territorium

### Gmail / Outlook
Gebruik Claude Code om e-mails te ontwerpen → plak in je e-mailclient → verzend.
Voor geautomatiseerd verzenden, integreer via n8n of Make met de Gmail-node.

### Apollo.io / Seamless.ai
Exporteer leads als CSV → plak in `/sdr-lead-scorer` → ontvang een geprioriteerde lijst.
Voor realtime verrijking, gebruik de `/lead-enrichment`-vaardigheid met de Apollo API.

### Gong / Aircall / Fireflies
Ontvang gespreksscript → plak in `/sdr-call-analysis` → extraheer CRM-notitie, coaching, follow-up.
Voor geautomatiseerde post-gesprek-analyse, stel een webhook in die `/sdr-call-analysis` triggert wanneer een opname klaar is.

### n8n (automatiserings-orkestratie)
```
Automatiseer de volledige loop:
- Nieuwe inkomende lead → /sdr-lead-scorer → doorsturen naar SDR of nurture
- Nieuwe reactie ontvangen → /sdr-reply-classifier → concept + Slack-waarschuwing
- Gesprek voltooid → transcript → /sdr-call-analysis → HubSpot-update
```

---

## Bij te houden metrieken

Gebruik Claude Code om deze wekelijks uit HubSpot te halen:

| Metriek | Doel (vroege fase) | Doel (geraamde SDR) |
|---|---|---|
| Onderzochte accounts/dag | 10 | 20 |
| Verzonden outreach-e-mails/week | 50 | 150 |
| Reactieratio | >5% | >8% |
| Positieve reactieratio | >1,5% | >3% |
| Geboekte meetings/week | 3-5 | 8-12 |
| Gesprek-tot-meeting-ratio | 5% | 10% |
| Tijd per account (onderzoek + concept) | <10 min | <5 min |
| CRM-updatepercentage | 90% | 100% |

---

## Veelgemaakte fouten (en hoe Claude Code ze voorkomt)

**Fout 1: Generieke outreach sturen**
Claude Code dwingt je een trigger te onderzoeken voordat je een concept schrijft. Geen trigger = geen e-mail.

**Fout 2: Gesprekken niet loggen in CRM**
`/sdr-call-analysis` genereert de CRM-notitie voor je — plak en klaar.

**Fout 3: Slechte bezwaarafhandeling**
`/sdr-objection-handler` heeft 20+ scripts. Voer ze uit vóór elk gesprek. Oefen de scripts die je mist.

**Fout 4: Contact opnemen met opted-out prospects**
`/crm-hygiene` houdt je CRM schoon. Altijd controleren voordat je aan een sequentie toevoegt.

**Fout 5: Focussen op de verkeerde accounts**
`/sdr-territory-mapper` en `/sdr-lead-scorer` prioriteren voor je. Werk de A-tier eerst.

---

## Bronnen

- [Aan de slag met Claude Code](../getting-started.md)
- [HubSpot MCP-installatie](../mcp/hubspot.md)
- [SDR dagelijkse workflow](../workflows/sdr-daily.md)
- [E-mailsequenties gids](../skills/gtm/email-automation.md)
- [Bezwaarafhandeling volledige bibliotheek](../skills/gtm/sdr-objection-handler.md)

---
