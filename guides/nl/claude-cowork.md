# Claude Cowork — GUI Agentic AI voor niet-technische teams

Claude Cowork is de GUI-gebaseerde versie van Claudes agentische mogelijkheden — geen terminal, geen code, geen configuratie vereist. Het is gebouwd voor PM's, marketeers, financiële teams en kleine bedrijfseigenaren die autonome AI-ondersteuning nodig hebben zonder setup voor ontwikkelaars. Waar Claude Code in een terminal werkt, werkt Cowork via een point-and-click desktop- en webinterface die wordt ondersteund door dezelfde onderliggende agentische mogelijkheid.

---

## Wat Cowork is versus Claude Code

| Functie | Claude Cowork | Claude Code |
|---------|--------------|-------------|
| Interface | Web + Desktop GUI | Terminal CLI |
| Technische vereiste | Geen | Comfortabel met terminal |
| Bestandstoegang | Door gebruiker geselecteerde map (GUI-kiezer) | Huidige directoryboom |
| Connectors | Google Drive, Gmail, Docusign, FactSet | MCP-servers (handmatige configuratie) |
| Slash-opdrachten | Gestructureerde formulieren (velden invullen) | Raw-tekstopdrachten |
| Automatisering | Click-to-configure workflows | Hooks + settings.json |
| Doelgroep | Niet-technische teams | Ontwikkelaars |
| Agent-delegatie | Visuele agent-kaarten | Subagenten via CLAUDE.md |

Beide gebruiken dezelfde Claude-modellen. Cowork is de operator-ervaring; Claude Code is de developer-ervaring.

---

## Connectors instellen

Cowork maakt verbinding met externe hulpmiddelen via Connectors — OAuth-gebaseerde integraties die eenmaal vanuit het Cowork-instellingenpaneel worden geconfigureerd. Geen API-sleutels, geen configuratiebestanden.

| Connector | Wat Claude kan doen |
|-----------|-------------------|
| Google Drive | Bestanden en mappen lezen/schrijven, zoeken op inhoud |
| Gmail | E-mails lezen, conceptantwoorden opstellen, verzenden met goedkeuring |
| Google Calendar | Eventos bekijken en maken, beschikbaarheid zoeken |
| Google Sheets | Spreadsheetgegevens lezen en bijwerken |
| Docusign | Documenten ter ondertekening verzenden, status volgen |
| FactSet | Financiële gegevensquery's, marktgegevens ophalen |
| Slack (plugin) | Berichten plaatsen, kanalen lezen, geschiedenis doorzoeken |
| Linear (plugin) | Problemen maken, status bijwerken, projectborden lezen |

Elke connector vereist één keer OAuth-autorisatie. Claude leest of schrijft alleen wanneer een workflow die actie expliciet activeert — het pollt connectors niet op de achtergrond.

---

## Slash-opdrachten met gestructureerde formulieren

In tegenstelling tot de vrije-vormtekstopdrachten van Claude Code openen Cowork-schuifdelopdrachten gestructureerde formulieren die fouten voorkomen en automatisering zonder prompt engineering kennis toegankelijk maken.

```
/generate-report
  ├── Report type:   [Weekly Summary] [Monthly P&L] [Custom]
  ├── Date range:    [from ____] [to ____]
  ├── Include:       [x] Charts  [x] Raw data  [ ] Executive summary
  └── Output format: [PDF] [Google Slides] [Email]

/email-triage
  ├── Inbox:         [Primary] [All labels] [Specific label: ____]
  ├── Action:        [Summarize] [Draft replies] [Categorize + tag]
  └── Approval:      [Auto-send] [Review before send]

/meeting-prep
  ├── Meeting:       [pull from calendar ▼]
  ├── Context docs:  [attach from Drive]
  └── Output:        [Briefing doc] [Talking points] [Both]
```

Aangepaste opdrachten kunnen als benoemde workflows worden opgeslagen en met teamgenoten worden gedeeld.

---

## Algemene Cowork-workflows

### Wekelijks rapportgeneratie
Trek gegevens uit Google Drive en FactSet, genereer een geformateerde PDF en e-mail deze naar een distributielijst — gepland of handmatig geactiveerd.

### E-mailtriage
Lees inbox, categoriseer per onderwerp of urgentie, stel antwoorden op voor threads met hoge prioriteit en presenteer ze voor eenklik goedkeuring vóór verzending.

### Documentworkflows
Lees contracten in Google Drive, extraheer sleutelclausules en datums, markeer afwijkingen en stuur naar Docusign voor ondertekening met vooringevulde velden.

### Vergaderingvoorbereiding
Lees de kalender van de volgende dag, trek relevante documenten voor elke vergadering van Drive en genereer een briefing van één pagina die context, deelnemers en openstaande items behandelt.

### Standupsamenvattingen
Lees Slack-activiteit en Linear-ticket updates van de afgelopen 24 uur, genereer een standupsamenvassing per teamlid en plaats deze in het standup-kanaal.

### Financiële momentopname
Query FactSet voor portfoliogegevens, trek werkelijke gegevens uit een Google Sheet en produceer een P&L-vergelijking van één pagina als een Google Slides-deck.

---

## Plugins

Cowork ondersteunt plugins — installeerbare workflowpakketten die nieuwe schuifdelopdrachten en connectors toevoegen. Blader door beschikbare plugins in de Cowork-plugingalerie.

Een plugin installeren:
1. Open Cowork-instellingen → Plugins
2. Doorzoek de galerie of plak een plugin-URL
3. Autoriseer alle nieuwe connectors die de plugin vereist
4. Nieuwe schuifdelopdrachten verschijnen onmiddellijk in het opdrachtenpalet

Plugins zijn beperkt tot de werkruimte — installatie voor uw account beïnvloedt teamgenoten niet tenzij zij afzonderlijk installeren of een admin naar de hele werkruimte duwt.

---

## Automatisering: Click-to-Configure versus Hooks

Cowork-automatisering wordt geconfigureerd via een visuele werkstroombouwer — geen `settings.json`, geen shellscripts.

| Triggertype | Cowork | Claude Code equivalent |
|-------------|--------|----------------------|
| Gepland (cron) | Tijdkiezer in werkstroombouwer | Cron-taak roept `claude` op |
| Bestandswijziging | Mapkiezer bekijken | `PostToolUse` hook op Write |
| E-mail ontvangen | Gmail connector trigger | Geen direct equivalent |
| Formulier indienen | Webhook-invoer | Aangepast MCP-hulpmiddel |
| Handmatig | Run-knop | Directe CLI-aanroeping |

Voor teams die Cowork-automatisering naast Claude Code-automatisering willen uitvoeren: Cowork-workflows kunnen webhook-URL's aanroepen, waardoor het mogelijk is Claudé Code-pijplijnen te activeren via Cowork-eventos.

---

## Wanneer Cowork versus Claude Code gebruiken

**Cowork gebruiken voor:**
- Document-zware workflows (contracten, rapporten, decks)
- E-mail- en kalenderautomatisering
- Niet-technische teamleden die autonome AI-ondersteuning nodig hebben
- Bedrijfsoperatieswerk dat leeft in Google Workspace en soortgelijke SaaS
- No-code automatisering die anders Zapier of Make zou vereisen

**Claude Code gebruiken voor:**
- Code schrijven, bewerken of debuggen
- Terminalopdrachten en shellscripts
- Complexe multi-stap technische taken met voorwaardelijke logica
- Aangepaste automatisering waarvoor hooks en fijnkorrel controle vereist zijn
- Werken in een git-repository

---
