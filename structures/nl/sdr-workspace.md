# SDR / BDR werkruimte — Projectstructuur

> Dagelijks operationeel systeem voor Sales Development Representatives: territoriummanagement, accountonderzoek, gepersonaliseerde outreach, inboxbeheer, callvoorbereiding en pipelinerapportage — allemaal aangestuurd door Claude Code slash commands gekoppeld aan HubSpot, Apollo.io, Gong en Slack.

## Stack

- **HubSpot** — CRM, contact-/bedrijfsrecords, sequenceinschrijving, dealcreatie
- **Apollo.io** — Prospectingdatabase, e-mailenrichment, intentiesignalen
- **Outreach / Salesloft** — Sequenceuitvoering, cadencebeheer, staptracking
- **Gong** — Oproepopname, transcripttoegang, spreken-tijdanalytics
- **Clay** — Verrijkingsworkflows, watervalpulldata, lijstbouw
- **Slack** — Teamstandup, dealalarmen, AE-overdracht-meldingen
- **Claude Code** — Slash commands voor elke herhaalbare SDR-workflow

## Directorystructuur

```
sdr-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Werkruimte-instructies voor Claude
│   ├── settings.json                    # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── morning-brief.md             # Trek territorialerts op + prioriteer accounts
│       ├── research.md                  # Diep accountbrief (accepteert $COMPANY arg)
│       ├── draft-email.md               # Gepersonaliseerde cold/vervolgmail-schrijver
│       ├── triage-inbox.md              # Classificeer antwoorden + concept-antwoorden + log CRM
│       ├── call-prep.md                 # Praattrack + discovery Qs + inwerpingsscripts
│       ├── log-call.md                  # Gestructureerde post-call-aantekening → HubSpot activity
│       └── weekly-review.md             # Pipelinemetriek + activiteitensamenvattingv + volgende focus
├── icp/
│   ├── icp-definition.md                # Firmografische + technografische fitcriteria
│   ├── persona-vp-sales.md              # VP Sales / CRO koperpersona
│   ├── persona-head-of-revops.md        # RevOps koperpersona
│   ├── persona-sales-enablement.md      # Enablement koperpersona
│   ├── negative-icp.md                  # Expliciete disqualificators (grootte, verticaal, stadium)
│   └── scoring-rubric.md                # 0-100 leadscoregewichten per signaaltype
├── sequences/
│   ├── cold/
│   │   ├── saas-outbound-7step.md       # 7-touch coldsequence voor SaaS-doelen
│   │   ├── enterprise-12step.md         # 12-touch enterprisesequence (60-dag)
│   │   └── smb-3step.md                 # Snelle 3-touch voor SMB-accounts
│   ├── inbound/
│   │   ├── demo-request-followup.md     # Inbound demoaanvraag-antwoordsequence
│   │   └── content-download-nurture.md  # Nurture voor downloaders van gated content
│   └── reactivation/
│       ├── cold-lead-reactivation.md    # Verouderde kansen (90+ dagen stil)
│       └── former-customer-winback.md   # Churned klanten heraanpak
├── territory/
│   ├── account-list.csv                 # Volledige territorium — alle toegewezen accounts
│   ├── tier-1-priority.csv              # Top 25 accounts om dit kwartaal aan te werken
│   ├── whitespace-analysis.md           # Onbedekte segmenten + expansiekanalen
│   ├── territory-map.md                 # Geografische / verticale verdeling
│   └── account-notes/
│       ├── acme-corp.md                 # Per-account onderzoeksaantekeningen + geschiedenis
│       ├── initech-llc.md
│       └── globodyne-inc.md
├── intel/
│   ├── battlecards/
│   │   ├── vs-competitor-a.md           # Gelijkvaardig vergelijking + praatsporen
│   │   ├── vs-competitor-b.md
│   │   └── vs-competitor-c.md
│   ├── value-props/
│   │   ├── roi-calculator.md            # ROI-praatpunten per use-case
│   │   ├── feature-differentiators.md   # Top 5 differentiators met bewijspunten
│   │   └── customer-stories.md          # Referentieklanten per verticaal
│   └── objection-library.md             # Geïndexeerde inwerping → antwoordkaart
├── logs/
│   └── weekly/
│       ├── 2026-W22.md                  # Wekelijks overzicht: activiteiten, pijplijn, lessen
│       ├── 2026-W21.md
│       └── 2026-W20.md
└── README.md                            # Snelstartgids voor deze werkruimte
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/morning-brief.md` | Haalt openstaande taken uit HubSpot op, maakt accounts met recente intentiesignalen van Apollo.io zichtbaar, en voert een geprioriseerde calllijst voor de dag uit |
| `.claude/commands/research.md` | Accepteert een bedrijfsnaam, haalt firmografische gegevens op, recent nieuws, techstack van Apollo.io en Clay, scoreert tegen ICP-rubriek, voert een gestructureerde accountbrief uit |
| `.claude/commands/triage-inbox.md` | Leest e-mail-/Outreach-antwoordwachtrij, classificeert elk antwoord als Geïnteresseerd/Niet Nu/Inwerping/Bounce/Automatisch antwoord, concepten antwoorden, markeert hete antwoorden voor onmiddellijke actie |
| `.claude/commands/call-prep.md` | Accepteert contactpersoon + bedrijf, genereert een 3-delige voorbereiddingsdoc: discovery vragenbank, inwerping scripts gekoppeld aan hun rol, en een zacht sluitscript |
| `.claude/commands/log-call.md` | Accepteert onbewerkte aantekeningen of Gong-transcriptlink, haalt volgende stappen uit, werkt HubSpot-activiteitenlogboek bij, en stelt vervolgingstaak in met vervaldatum |
| `icp/scoring-rubric.md` | Definieert de 0-100 scoregewichten die door `/sdr-lead-scorer` worden gebruikt — bewerk wanneer ICP verandert om scoring gekalibreerd te houden |
| `intel/objection-library.md` | Master inwerping-index gebruikt door `/sdr-objection-handler` — voeg nieuwe inwerping toe na calls om dit vers te houden |
| `logs/weekly/` | Permanente wekelijkse overzichtslogboeken gebruikt door `/weekly-review` om metriek in de loop van de tijd in trend in te zetten en coachingskansen aan het licht te brengen |

## Snel raamwerk

```bash
# Maak de werkruimtedirectory en alle subdirectories
mkdir -p sdr-workspace/.claude/commands
mkdir -p sdr-workspace/icp
mkdir -p sdr-workspace/sequences/cold
mkdir -p sdr-workspace/sequences/inbound
mkdir -p sdr-workspace/sequences/reactivation
mkdir -p sdr-workspace/territory/account-notes
mkdir -p sdr-workspace/intel/battlecards
mkdir -p sdr-workspace/intel/value-props
mkdir -p sdr-workspace/logs/weekly

# Stub-bestanden commando's
touch sdr-workspace/.claude/commands/morning-brief.md
touch sdr-workspace/.claude/commands/research.md
touch sdr-workspace/.claude/commands/draft-email.md
touch sdr-workspace/.claude/commands/triage-inbox.md
touch sdr-workspace/.claude/commands/call-prep.md
touch sdr-workspace/.claude/commands/log-call.md
touch sdr-workspace/.claude/commands/weekly-review.md

# Stub ICP-bestanden
touch sdr-workspace/icp/icp-definition.md
touch sdr-workspace/icp/negative-icp.md
touch sdr-workspace/icp/scoring-rubric.md

# Stub intel-bestanden
touch sdr-workspace/intel/objection-library.md
touch sdr-workspace/intel/value-props/roi-calculator.md
touch sdr-workspace/intel/value-props/feature-differentiators.md
touch sdr-workspace/intel/value-props/customer-stories.md

# Maak deze week's logbestand
echo "# Wekelijks overzicht — $(date +%Y-W%V)" > sdr-workspace/logs/weekly/$(date +%Y-W%V).md

# Installeer alle SDR-vaardigheden
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot

echo "SDR werkruimte raamwerk compleet."
```

## CLAUDE.md-sjabloon

```markdown
# SDR werkruimte — Claude instructies

## Wat dit is

Dit is een SDR/BDR dagelijkse operationele werkruimte. Elke directory en elk commando hier is
geoptimaliseerd voor één uitkomst: geboekte bijeenkomsten. Claude Code voert onderzoek uit, concept,
triage, callvoorbereiding en logging — u handelt relaties en beoordelingen af.

Voeg hier geen toepassingscode toe. Dit is een inhoud- en workflowwerkruimte.

## Stack

- HubSpot: CRM van record — contactpersonen, bedrijven, activiteiten, sequences, deals
- Apollo.io: prospectingdatabase, verrijking, intentiesignalen
- Outreach: sequencecadenceuitvoering (of Salesloft — controleer welk actief is)
- Gong: oproeptranscripten, spreken-tijddata, momentdetectie
- Clay: verrijking watervallworkflows, lijstbouw
- Slack: teamcommunicatie, dealalarmen (#sdr-wins, #ae-handoffs kanalen)

## Territorium

- ICP-definitie leeft in icp/icp-definition.md — lees voor het scoren van accounts
- Scorerubriek leeft in icp/scoring-rubric.md — gebruik deze gewichten bij het uitvoeren van /sdr-lead-scorer
- Tier-1 accounts leven in territory/tier-1-priority.csv — deze worden eerst elke dag bewerkt
- Per-account aantekeningen in territory/account-notes/ — één bestand per account, update na elke aanraking

## Veelvoorkomende taken — exacte commando's

### Begin de dag
/morning-brief
→ Voert geprioriseerde calllijst uit, markeert hete inbound-antwoorden, maakt intentiesignalen zichtbaar

### Onderzoek een account vóór outreach
/research [bedrijfsnaam]
→ Volledige accountbrief: firmografische gegevens, techstack, ICP-score, triggergebeurtenissen, stakeholderkaart

### Schrijf een gepersonaliseerde cold email
/draft-email
→ Prompts voor accountbrief + persona, voert onderwerp + tekst uit met personalisatietokens

### Trieer je inbox
/triage-inbox
→ Leest antwoordwachtrij, classificeert elk antwoord, concepten antwoorden, markeert hete leads

### Bereid je voor op een call
/call-prep
→ Accepteert contactnaam + bedrijf, voert discovery-vragen, inwerping-scripts, zacht sluitingsscript uit

### Log een call naar HubSpot
/log-call
→ Plak onbewerkte aantekeningen of Gong-transcriptlink — Claude haalt volgende stappen uit en werkt CRM bij

### Einde-van-week beoordeling
/weekly-review
→ Haalt activiteitsmetriek op, pipelinevooruitgang, boeken vs. doelstelling, en volgende-week focusgebieden

## Conventies

- Account-aantekeningen: altijd Last Touched date, Last Outcome, en Next Step bovenaan opnemen
- Onderwerpen: maximaal 6 woorden, geen ALLES KAPITAAL, geen uitroeptekens
- Call logs: altijd inclusief a Next Step met een specifieke datum — geen open vervolgingen
- Wekelijkse logs: opgeslagen in logs/weekly/YYYY-WNN.md — verwijder nooit historische logs
- Sequenceselectie: cold/ voor net-new, inbound/ voor demoverzoeken, reactivation/ voor 90+ dagen donker
- Battlecards: update vs-competitor-*.md telkens wanneer een prospect een nieuwe inwerping aan het licht brengt of de concurrent een nieuwe functie afstudeert

## Wat Claude niet moet doen

- Stuur geen e-mails of schrijf geen sequences in zonder expliciete bevestiging
- Maak geen HubSpot-deals aan zonder te bevestigen dat de ICP-score hoger is dan 60
- Log geen calls met lege Next Step-velden
- Concepteer geen outreach zonder eerst de account-aantekening te lezen als er een bestaat
```

## MCP-servers

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "${HUBSPOT_ACCESS_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/$USER/sdr-workspace"
      ]
    }
  }
}
```

## Aanbevolen hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */logs/weekly/* ]]; then echo \"[hook] Weekly log updated: $CLAUDE_TOOL_RESULT_PATH\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[$(date +%H:%M)] Session ended. Run /morning-brief tomorrow to reprioritize.\" >> /tmp/sdr-session.log'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__hubspot__create_deal",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[hook] Deal creation triggered — confirm ICP score >= 60 before proceeding.\"'"
          }
        ]
      }
    ]
  }
}
```

## Vaardigheden om te installeren

```bash
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

## Gerelateerd

- [SDR-gids — volledige workflowdocumentatie](../guides/for-sdr.md)
- [SDR dagelijkse workflow — end-to-end proces](../workflows/sdr-daily.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
