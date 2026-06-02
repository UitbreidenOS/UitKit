# SDR / BDR Workspace — Projektstruktur

> Tägliches Betriebssystem für Sales Development Representatives: Territoriumsverwaltung, Kontoresearch, personalisierte Outreach, Inbox-Triage, Anrufvorbereitung und Pipeline-Berichterstattung — alles angetrieben durch Claude Code Slash-Befehle, die mit HubSpot, Apollo.io, Gong und Slack verbunden sind.

## Stack

- **HubSpot** — CRM, Kontakt-/Unternehmenseinträge, Sequence-Eintragung, Deal-Erstellung
- **Apollo.io** — Prospecting-Datenbank, E-Mail-Anreicherung, Intent-Signale
- **Outreach / Salesloft** — Sequence-Ausführung, Cadence-Management, Schritt-Tracking
- **Gong** — Anrufaufzeichnung, Transkriptzugriff, Sprechzeit-Analytik
- **Clay** — Anreicherungs-Workflows, Waterfall-Datenbeschaffung, List-Building
- **Slack** — Team-Standup, Deal-Benachrichtigungen, AE-Handoff-Benachrichtigungen
- **Claude Code** — Slash-Befehle für jeden wiederholbaren SDR-Workflow

## Verzeichnisbaum

```
sdr-workspace/
├── .claude/
│   ├── CLAUDE.md                        # Workspace-Anweisungen für Claude
│   ├── settings.json                    # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── morning-brief.md             # Territory-Benachrichtigungen abrufen + Konten priorisieren
│       ├── research.md                  # Tiefe Kontenbriefing (nimmt $COMPANY arg)
│       ├── draft-email.md               # Personalisierter Cold/Follow-up E-Mail-Writer
│       ├── triage-inbox.md              # Replies klassifizieren + Responses entwerfen + CRM-Logging
│       ├── call-prep.md                 # Talk Track + Discovery Qs + Einwand-Skripte
│       ├── log-call.md                  # Strukturierte Anrufnotiz → HubSpot-Aktivität
│       └── weekly-review.md             # Pipeline-Metriken + Aktivitätszusammenfassung + nächster Fokus
├── icp/
│   ├── icp-definition.md                # Firmographische + technographische Fit-Kriterien
│   ├── persona-vp-sales.md              # VP Sales / CRO Buyer Persona
│   ├── persona-head-of-revops.md        # RevOps Buyer Persona
│   ├── persona-sales-enablement.md      # Enablement Buyer Persona
│   ├── negative-icp.md                  # Explizite Disqualifizierer (Größe, Branche, Phase)
│   └── scoring-rubric.md                # 0-100 Lead-Score-Gewichte nach Signaltyp
├── sequences/
│   ├── cold/
│   │   ├── saas-outbound-7step.md       # 7-Touch Cold Sequence für SaaS-Ziele
│   │   ├── enterprise-12step.md         # 12-Touch Enterprise Sequence (60 Tage)
│   │   └── smb-3step.md                 # Schnelle 3-Touch für SMB-Konten
│   ├── inbound/
│   │   ├── demo-request-followup.md     # Inbound Demo-Anfrage Response Sequence
│   │   └── content-download-nurture.md  # Nurture für Gated-Content-Downloads
│   └── reactivation/
│       ├── cold-lead-reactivation.md    # Stale Opportunities (90+ Tage silent)
│       └── former-customer-winback.md   # Churned Customers Wiederannäherung
├── territory/
│   ├── account-list.csv                 # Vollständiges Territorium — alle zugewiesenen Konten
│   ├── tier-1-priority.csv              # Top 25 Konten für dieses Quartal
│   ├── whitespace-analysis.md           # Abgedeckte Segmente + Expansionsmöglichkeiten
│   ├── territory-map.md                 # Geografische / vertikale Aufteilung
│   └── account-notes/
│       ├── acme-corp.md                 # Pro-Konto Recherche-Notizen + Verlauf
│       ├── initech-llc.md
│       └── globodyne-inc.md
├── intel/
│   ├── battlecards/
│   │   ├── vs-competitor-a.md           # Head-to-Head Vergleich + Talk Tracks
│   │   ├── vs-competitor-b.md
│   │   └── vs-competitor-c.md
│   ├── value-props/
│   │   ├── roi-calculator.md            # ROI Talking Points nach Use Case
│   │   ├── feature-differentiators.md   # Top 5 Differenzierer mit Nachweis
│   │   └── customer-stories.md          # Reference Customers nach Branche
│   └── objection-library.md             # Indexierte Einwand → Response-Map
├── logs/
│   └── weekly/
│       ├── 2026-W22.md                  # Wöchentliche Überprüfung: Aktivitäten, Pipeline, Erkenntnisse
│       ├── 2026-W21.md
│       └── 2026-W20.md
└── README.md                            # Quick-Start für diesen Workspace
```

## Wichtigste Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/morning-brief.md` | Ruft offene Aufgaben aus HubSpot ab, zeigt Konten mit aktuellen Intent-Signalen von Apollo.io auf und gibt eine priorisierte Anrufliste für den Tag aus |
| `.claude/commands/research.md` | Nimmt einen Unternehmensnamen, zieht firmographische Daten, aktuelle Nachrichten, Tech Stack von Apollo.io und Clay, bewertet gegen ICP-Rubrik, gibt strukturierte Kontenbriefing aus |
| `.claude/commands/triage-inbox.md` | Liest E-Mail-/Outreach-Reply-Warteschlange, klassifiziert jede als Interessiert/Nicht Jetzt/Einwand/Bounce/Auto-reply, entwerft Responses, flaggt Hot Replies für sofortige Aktion |
| `.claude/commands/call-prep.md` | Nimmt Kontakt + Unternehmen, generiert 3-teiliges Prep-Dokument: Discovery Question Bank, Einwand-Skripte gekoppelt zu ihrer Rolle, und sanftes Close-Skript |
| `.claude/commands/log-call.md` | Nimmt rohe Anrufnotizen oder Gong-Transkript-Link, extrahiert nächste Schritte, aktualisiert HubSpot-Aktivitätsprotokoll und setzt Follow-up-Task mit Fälligkeitsdatum |
| `icp/scoring-rubric.md` | Definiert die 0-100 Scoring-Gewichte, die von `/sdr-lead-scorer` verwendet werden — bearbeiten, wenn sich ICP ändert, um Scoring kalibriert zu halten |
| `intel/objection-library.md` | Master Einwand-Index, der von `/sdr-objection-handler` verwendet wird — fügen Sie neue Einwände nach Anrufen hinzu, um es aktuell zu halten |
| `logs/weekly/` | Persistente wöchentliche Überprüfungs-Logs, die von `/weekly-review` verwendet werden, um Metriken im Laufe der Zeit zu trennen und Coaching-Möglichkeiten zu identifizieren |

## Quick Scaffold

```bash
# Erstellen Sie das Workspace-Verzeichnis und alle Unterverzeichnisse
mkdir -p sdr-workspace/.claude/commands
mkdir -p sdr-workspace/icp
mkdir -p sdr-workspace/sequences/cold
mkdir -p sdr-workspace/sequences/inbound
mkdir -p sdr-workspace/sequences/reactivation
mkdir -p sdr-workspace/territory/account-notes
mkdir -p sdr-workspace/intel/battlecards
mkdir -p sdr-workspace/intel/value-props
mkdir -p sdr-workspace/logs/weekly

# Stub-Befehlsdateien
touch sdr-workspace/.claude/commands/morning-brief.md
touch sdr-workspace/.claude/commands/research.md
touch sdr-workspace/.claude/commands/draft-email.md
touch sdr-workspace/.claude/commands/triage-inbox.md
touch sdr-workspace/.claude/commands/call-prep.md
touch sdr-workspace/.claude/commands/log-call.md
touch sdr-workspace/.claude/commands/weekly-review.md

# Stub ICP-Dateien
touch sdr-workspace/icp/icp-definition.md
touch sdr-workspace/icp/negative-icp.md
touch sdr-workspace/icp/scoring-rubric.md

# Stub Intel-Dateien
touch sdr-workspace/intel/objection-library.md
touch sdr-workspace/intel/value-props/roi-calculator.md
touch sdr-workspace/intel/value-props/feature-differentiators.md
touch sdr-workspace/intel/value-props/customer-stories.md

# Erstellen Sie diese Woche's Log-Datei
echo "# Weekly Review — $(date +%Y-W%V)" > sdr-workspace/logs/weekly/$(date +%Y-W%V).md

# Installieren Sie alle SDR-Skills
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

echo "SDR workspace scaffold complete."
```

## CLAUDE.md Template

```markdown
# SDR Workspace — Claude-Anweisungen

## Was dies ist

Dies ist ein SDR/BDR täglicher Arbeits-Workspace. Jedes Verzeichnis und jeder Befehl hier ist
optimiert für ein Ergebnis: gebuchte Meetings. Claude Code führt Research, Drafting,
Triage, Call Prep und Logging durch — Sie kümmern sich um Beziehungen und Urteile.

Fügen Sie hier keinen Anwendungscode hinzu. Dies ist ein Inhalts- und Workflow-Workspace.

## Stack

- HubSpot: CRM des Datensatzes — Kontakte, Unternehmen, Aktivitäten, Sequences, Deals
- Apollo.io: Prospecting-Datenbank, Anreicherung, Intent-Signale
- Outreach: Sequence Cadence Ausführung (oder Salesloft — überprüfen Sie, welche aktiv ist)
- Gong: Call-Transkripte, Sprechzeit-Daten, Moment-Erkennung
- Clay: Anreicherungs-Waterfall-Workflows, List-Building
- Slack: Team-Komms, Deal-Alerts (#sdr-wins, #ae-handoffs Kanäle)

## Territory

- ICP-Definition in icp/icp-definition.md — lesen Sie es vor dem Scoring eines Kontos
- Scoring-Rubrik in icp/scoring-rubric.md — verwenden Sie diese Gewichte beim Ausführen von /sdr-lead-scorer
- Tier-1-Konten in territory/tier-1-priority.csv — diese werden zuerst jeden Tag bearbeitet
- Pro-Konto-Notizen in territory/account-notes/ — eine Datei pro Konto, nach jedem Kontakt aktualisieren

## Häufige Aufgaben — genaue Befehle

### Starten Sie den Tag
/morning-brief
→ Gibt priorisierte Anrufliste aus, flaggt Hot Inbound Replies, zeigt Intent-Signale

### Recherchieren Sie ein Konto vor Outreach
/research [company name]
→ Vollständige Kontenbriefing: Firmographiken, Tech Stack, ICP-Score, Trigger-Events, Stakeholder-Map

### Schreiben Sie eine personalisierte Cold-E-Mail
/draft-email
→ Fragt nach Kontenbriefing + Persona, gibt Subject + Body mit Personalisierungs-Tokens aus

### Triage Ihre Inbox
/triage-inbox
→ Liest Reply-Warteschlange, klassifiziert jede Reply, entwerft Responses, flaggt Hot Leads

### Prep für einen Anruf
/call-prep
→ Nimmt Kontaktname + Unternehmen, gibt Discovery-Fragen, Einwand-Skripte, sanften Close aus

### Log-Anruf zu HubSpot
/log-call
→ Fügen Sie rohe Notizen oder Gong-Transkript-Link ein — Claude extrahiert nächste Schritte und aktualisiert CRM

### Wochenendüberprüfung
/weekly-review
→ Zieht Aktivitätsmetriken, Pipeline-Fortschritt, Bookings vs. Ziel und Focus-Bereiche nächste Woche

## Konventionen

- Kontische Notizen: immer Last Touched-Datum, Last Outcome und Next Step oben einfügen
- Subject Lines: max 6 Wörter, keine GROSSBUCHSTABEN, keine Ausrufezeichen
- Anruf-Logs: immer einen Next Step mit einem spezifischen Datum einfügen — keine offenen Follow-ups
- Wöchentliche Logs: gespeichert zu logs/weekly/YYYY-WNN.md — löschen Sie niemals historische Logs
- Sequence-Auswahl: cold/ für Net-New, inbound/ für Demo-Anfragen, reactivation/ für 90+ Tage dunkel
- Battlecards: vs-competitor-*.md aktualisieren, wann immer ein Prospect einen neuen Einwand aufwirft oder der Competitor ein neues Feature ausrollt

## Was Claude nicht tun sollte

- Senden Sie keine E-Mails oder enroll Sequences ohne explizite Bestätigung
- Erstellen Sie keine HubSpot-Deals, ohne zu bestätigen, dass der ICP-Score über 60 liegt
- Loggen Sie keine Anrufe mit leeren Next Step Feldern
- Entwerfen Sie keine Outreach, ohne vorher die Kontonotiz zu lesen, falls vorhanden
```

## MCP-Server

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

## Empfohlene Hooks

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

## Zu installierende Skills

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

## Verwandt

- [SDR guide — vollständige Workflow-Dokumentation](../guides/for-sdr.md)
- [SDR täglicher Workflow — End-to-End-Prozess](../workflows/sdr-daily.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
