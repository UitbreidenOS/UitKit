# Recruiter / Talent Acquisition Workspace — Projektstruktur

> Tägliches Betriebssystem für interne und externe Recruiter: Stellenbeschreibung, Kandidatenquellen, Screening, Koordination von Interviews, Angebotsverwaltung und Pipeline-Reporting — alles gesteuert durch Claude Code Slash-Befehle, die mit Greenhouse/Lever/Ashby, LinkedIn Recruiter und Slack verbunden sind.

## Stack

- **Greenhouse / Lever / Ashby** — ATS-System: Stellenausschreibungen, Kandidaten-Pipeline, Stage-Tracking, Angebotsverwaltung
- **LinkedIn Recruiter** — Boolean-Suche, InMail-Outreach, Talent-Pool-Verwaltung, Sourcing-Analytik
- **Slack** — Koordination von Hiring Managern, Debrief-Planung, Angebotsgenehmigungen, Team-Benachrichtigungen
- **HireRight** — Bestellung von Hintergrundchecks, Adjudikation, Compliance-Dokumentation
- **Karat / CoderPad** — Technische Screening-Aufgaben, Live-Coding-Interviews, Bewertungsergebnisse
- **Calendly** — Interview-Planung, Panel-Verfügbarkeit, Self-Schedule-Links für Kandidaten
- **Notion** — Recruiting-Playbooks, Interview-Guides, Onboarding von Hiring Managern
- **Claude Code** — Slash-Befehle für jeden wiederholbaren Recruiting-Workflow

## Verzeichnisstruktur

```
recruiter-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace-Anweisungen für Claude
│   ├── settings.json                          # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── job-description.md                 # Entwirft JD aus Rollenbeschreibung (nimmt $ROLE arg)
│       ├── sourcing-strategy.md               # Boolean-Strings + Kanäle für Rollentyp
│       ├── screen-email.md                    # Screening-Email oder InMail-Vorlagenwriter
│       ├── interview-scorecard.md             # Erstellt strukturierte Scorecard für Rolle
│       ├── offer-letter.md                    # Generiert Anschreiben aus Vergütungsband + Eingaben
│       ├── pipeline-report.md                 # Zieht ATS-Daten → wöchentliche Pipeline-Zusammenfassung
│       └── candidate-debrief.md              # Strukturiert Debrief-Notizen nach Interview-Panel
├── roles/
│   ├── _template/                             # Kopieren Sie diesen Ordner für jede neue offene Stelle
│   │   ├── job-description.md                 # Endgültige genehmigte JD (aus /job-description)
│   │   ├── role-brief.md                      # HM-Aufnahmeformular: Ebene, Umfang, Muss-Haves, Nice-to-Haves
│   │   ├── sourcing-log.md                    # Verwendete Boolean-Strings, versuchte Kanäle, Response-Raten
│   │   ├── interview-guide.md                 # Stage-für-Stage-Interview-Struktur + Fragenbänke
│   │   ├── scorecard.md                       # Evaluierungsrichtlinie mit Kompetenzgewichtungen
│   │   └── offers/
│   │       ├── offer-draft.md                 # Arbeitsentwurf vor Genehmigung
│   │       └── offer-final.md                 # Genehmigtes Angebot an Kandidaten gesendet
│   ├── senior-engineer-backend/
│   │   ├── job-description.md
│   │   ├── role-brief.md
│   │   ├── sourcing-log.md
│   │   ├── interview-guide.md
│   │   ├── scorecard.md
│   │   └── offers/
│   │       ├── offer-draft.md
│   │       └── offer-final.md
│   ├── product-manager-growth/
│   │   ├── job-description.md
│   │   ├── role-brief.md
│   │   ├── sourcing-log.md
│   │   ├── interview-guide.md
│   │   ├── scorecard.md
│   │   └── offers/
│   │       └── offer-draft.md
│   └── account-executive-mid-market/
│       ├── job-description.md
│       ├── role-brief.md
│       ├── sourcing-log.md
│       ├── interview-guide.md
│       ├── scorecard.md
│       └── offers/
│           └── offer-draft.md
├── candidates/
│   ├── pipeline-tracker.md                    # Aktive Kandidaten über alle Rollen hinweg: Stage, Status, Owner
│   ├── feedback-log.md                        # Interview-Feedback nach Kandidat + Rolle indexiert
│   ├── declined/
│   │   ├── declined-template.md               # Standard-Ablehnungsvorlagen nach Stage
│   │   └── declined-log.md                    # Abgelehnte Kandidaten mit Reason Codes für Analytik
│   └── silver-medalists/
│       ├── silver-medalist-index.md           # Finalisten zur Reaktivierung bei neuen Stellen
│       └── re-engagement-template.md          # Warme Ansprache für Silver Medalists
├── sourcing/
│   ├── boolean-strings/
│   │   ├── software-engineer.md               # Boolean-Strings für SWE-Sourcing nach Stack
│   │   ├── product-manager.md                 # Boolean-Strings für PM-Sourcing
│   │   ├── data-scientist.md                  # Boolean-Strings für DS/ML-Rollen
│   │   ├── sales-ae-sdr.md                    # Boolean-Strings für GTM-Rollen
│   │   └── design-ux.md                       # Boolean-Strings für Design-Rollen
│   ├── sourcing-channels.md                   # Kanalliste mit Response-Rate-Benchmarks pro Rollentyp
│   ├── talent-pools/
│   │   ├── engineering-pool.md                # Warme Engineering-Kontakte zur Reaktivierung
│   │   ├── gtm-pool.md                        # Warme GTM-Kontakte
│   │   └── leadership-pool.md                 # VP/Director-Level passive Kandidaten
│   └── linkedin-saved-searches.md             # Benannte LinkedIn Recruiter-Suchen zum monatlichen Rerun
├── offer-management/
│   ├── comp-bands.md                          # Gehaltsbänder nach Ebene und Funktion (vierteljährlich aktualisiert)
│   ├── offer-letter-templates/
│   │   ├── full-time-standard.md              # Standard-FTE-Angebotsbriefvorlage
│   │   ├── full-time-executive.md             # Executive-Angebotsbrief mit Equity-Cliff-Sprache
│   │   └── contract-to-hire.md                # Contract-to-Hire-Angebotsbrief-Vorlage
│   ├── equity-explainer.md                    # Einfache Equity-FAQ für Kandidaten
│   ├── negotiation-scripts.md                 # Counter-Offer-Response-Scripts nach Szenario
│   └── approval-workflow.md                   # Angebotsgenehmigungskette: Recruiter → HRBP → Finance → CEO
├── onboarding/
│   ├── day-1-checklist.md                     # IT, Badge, Tools, Introductions
│   ├── first-week-schedule-template.md        # Tag-für-Tag-Plan für erste Woche des Neuzugangs
│   ├── welcome-email-template.md              # Pre-Start-Willkommens-Email 3 Tage vor Start
│   ├── hiring-manager-checklist.md            # HM-Aufgaben vor und am ersten Tag
│   └── new-hire-survey.md                     # 30-Tage-Zufriedenheitsumfrage für Neuzugänge
├── employer-brand/
│   ├── company-overview.md                    # 2-Seiten-Unternehmensbeschreibung für Kandidaten
│   ├── culture-deck.md                        # Werte, Arbeitsstil, Team-Zusammensetzung
│   ├── candidate-faq.md                       # Häufige Kandidatenfragen mit genehmigten Antworten
│   ├── glassdoor-response-templates.md        # Genehmigte Antworten auf häufige Glassdoor-Themen
│   └── job-board-descriptions/
│       ├── linkedin-company-bio.md            # 300-Zeichen-LinkedIn-Unternehmensbeschreibung
│       └── greenhouse-about-us.md             # ATS "Über uns"-Block für Stellenausschreibungen
└── reports/
    ├── weekly-pipeline.md                     # Wöchentliche Snapshot: aktive Rollen, Stages, Velocity
    ├── time-to-fill.md                        # Time-to-Fill nach Rollentyp und Quartal
    ├── source-of-hire.md                      # Hire-Attribution nach Sourcing-Kanal
    ├── dei-metrics.md                         # Funnel-Diversity-Daten nach Stage und Rolle
    └── weekly/
        ├── 2026-W22.md                        # Archivierter wöchentlicher Pipeline-Report
        ├── 2026-W21.md
        └── 2026-W20.md
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/job-description.md` | Nimmt eine `role-brief.md` als Kontext und entwirft eine vollständige JD mit Verantwortungen, Anforderungen, bevorzugten Qualifikationen und einem Durchgang für inklusive Sprache — bereit zum Posten auf Greenhouse oder LinkedIn |
| `.claude/commands/sourcing-strategy.md` | Generiert Boolean-Suchstrings, empfiehlt Sourcing-Kanäle mit geschätzten Response-Raten und gibt einen Sourcing-Plan aus, der auf die Rollenbeschreibung und den Talent-Pool zugeschnitten ist |
| `.claude/commands/interview-scorecard.md` | Erstellt eine strukturierte Scorecard aus einer Rollenbeschreibung: Kompetenzliste, Behavioral-Fragenbank und numerische Richtlinie (1-5-Skala mit Ankern) für jede Kompetenz |
| `.claude/commands/offer-letter.md` | Nimmt Kandidatenname, Rolle, Ebene, Startdatum und Vergütungseingaben; zieht die entsprechende Vorlage aus `offer-management/offer-letter-templates/`; generiert einen vollständigen Entwurf zur Überprüfung |
| `.claude/commands/pipeline-report.md` | Fragt Greenhouse oder Ashby nach offenen Rollen, aktiven Kandidaten pro Stage und Time-in-Stage-Daten ab; formatiert eine wöchentliche Pipeline-Zusammenfassung mit Velocity-Highlights und Blockern |
| `roles/_template/` | Kanonische Ordnerstruktur für jede neue offene Stelle — kopieren Sie dieses Verzeichnis, wenn eine neue Anforderung offen ist, um konsistente Dokumentation über den Recruiting-Lebenszyklus zu gewährleisten |
| `offer-management/comp-bands.md` | Single Source of Truth für Gehaltsbänder nach Ebene und Funktion — vierteljährlich aktualisiert; referenziert von `/offer-letter` und `/comp-benchmarker` zur Einhaltung der Angebote |
| `candidates/silver-medalists/silver-medalist-index.md` | Indexierte Liste starker Kandidaten, die nicht eingestellt wurden — reaktiviert bei neuer Stelle, um Sourcing-Zykluszeit zu reduzieren |
| `sourcing/boolean-strings/` | Vordefinierte Boolean-Suchstrings organisiert nach Rollenfamilie — laden Sie die relevante Datei vor jeder LinkedIn Recruiter-Sitzung, um zu vermeiden, Strings von Grund auf neu zu erstellen |
| `reports/dei-metrics.md` | Verfolgt die Darstellung in jeder Funnel-Stage (beworben, gescreent, interviewt, angeboten, eingestellt), um Drop-off-Punkte zu ermitteln und die Sourcing-Kanalstrategie zu informieren |

## Schneller Scaffold

```bash
# Erstelle den Workspace und alle Unterverzeichnisse
mkdir -p recruiter-workspace/.claude/commands
mkdir -p recruiter-workspace/roles/_template/offers
mkdir -p recruiter-workspace/roles/senior-engineer-backend/offers
mkdir -p recruiter-workspace/roles/product-manager-growth/offers
mkdir -p recruiter-workspace/roles/account-executive-mid-market/offers
mkdir -p recruiter-workspace/candidates/declined
mkdir -p recruiter-workspace/candidates/silver-medalists
mkdir -p recruiter-workspace/sourcing/boolean-strings
mkdir -p recruiter-workspace/sourcing/talent-pools
mkdir -p recruiter-workspace/offer-management/offer-letter-templates
mkdir -p recruiter-workspace/onboarding
mkdir -p recruiter-workspace/employer-brand/job-board-descriptions
mkdir -p recruiter-workspace/reports/weekly

# Stub out Claude commands
touch recruiter-workspace/.claude/commands/job-description.md
touch recruiter-workspace/.claude/commands/sourcing-strategy.md
touch recruiter-workspace/.claude/commands/screen-email.md
touch recruiter-workspace/.claude/commands/interview-scorecard.md
touch recruiter-workspace/.claude/commands/offer-letter.md
touch recruiter-workspace/.claude/commands/pipeline-report.md
touch recruiter-workspace/.claude/commands/candidate-debrief.md

# Stub out role template
touch recruiter-workspace/roles/_template/job-description.md
touch recruiter-workspace/roles/_template/role-brief.md
touch recruiter-workspace/roles/_template/sourcing-log.md
touch recruiter-workspace/roles/_template/interview-guide.md
touch recruiter-workspace/roles/_template/scorecard.md
touch recruiter-workspace/roles/_template/offers/offer-draft.md

# Stub out sourcing files
touch recruiter-workspace/sourcing/boolean-strings/software-engineer.md
touch recruiter-workspace/sourcing/boolean-strings/product-manager.md
touch recruiter-workspace/sourcing/boolean-strings/data-scientist.md
touch recruiter-workspace/sourcing/boolean-strings/sales-ae-sdr.md
touch recruiter-workspace/sourcing/boolean-strings/design-ux.md
touch recruiter-workspace/sourcing/sourcing-channels.md
touch recruiter-workspace/sourcing/linkedin-saved-searches.md
touch recruiter-workspace/sourcing/talent-pools/engineering-pool.md
touch recruiter-workspace/sourcing/talent-pools/gtm-pool.md
touch recruiter-workspace/sourcing/talent-pools/leadership-pool.md

# Stub out offer management files
touch recruiter-workspace/offer-management/comp-bands.md
touch recruiter-workspace/offer-management/offer-letter-templates/full-time-standard.md
touch recruiter-workspace/offer-management/offer-letter-templates/full-time-executive.md
touch recruiter-workspace/offer-management/offer-letter-templates/contract-to-hire.md
touch recruiter-workspace/offer-management/equity-explainer.md
touch recruiter-workspace/offer-management/negotiation-scripts.md
touch recruiter-workspace/offer-management/approval-workflow.md

# Stub out onboarding files
touch recruiter-workspace/onboarding/day-1-checklist.md
touch recruiter-workspace/onboarding/first-week-schedule-template.md
touch recruiter-workspace/onboarding/welcome-email-template.md
touch recruiter-workspace/onboarding/hiring-manager-checklist.md
touch recruiter-workspace/onboarding/new-hire-survey.md

# Stub out employer brand files
touch recruiter-workspace/employer-brand/company-overview.md
touch recruiter-workspace/employer-brand/culture-deck.md
touch recruiter-workspace/employer-brand/candidate-faq.md
touch recruiter-workspace/employer-brand/glassdoor-response-templates.md
touch recruiter-workspace/employer-brand/job-board-descriptions/linkedin-company-bio.md
touch recruiter-workspace/employer-brand/job-board-descriptions/greenhouse-about-us.md

# Stub out candidate tracking
touch recruiter-workspace/candidates/pipeline-tracker.md
touch recruiter-workspace/candidates/feedback-log.md
touch recruiter-workspace/candidates/declined/declined-template.md
touch recruiter-workspace/candidates/declined/declined-log.md
touch recruiter-workspace/candidates/silver-medalists/silver-medalist-index.md
touch recruiter-workspace/candidates/silver-medalists/re-engagement-template.md

# Stub out report files
touch recruiter-workspace/reports/weekly-pipeline.md
touch recruiter-workspace/reports/time-to-fill.md
touch recruiter-workspace/reports/source-of-hire.md
touch recruiter-workspace/reports/dei-metrics.md
echo "# Weekly Pipeline — $(date +%Y-W%V)" > recruiter-workspace/reports/weekly/$(date +%Y-W%V).md

# Install all recruiter skills
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description

echo "Recruiter workspace scaffold complete."
```

## CLAUDE.md-Vorlage

```markdown
# Recruiter Workspace — Claude-Anweisungen

## Was dies ist

Dies ist ein täglicher Talent-Acquisition-Betriebsworkspace. Jedes Verzeichnis und jeder Befehl
hier ist auf ein Ergebnis optimiert: Stellen mit großartigen Kandidaten schneller besetzen. Claude
Code behandelt JD-Entwürfe, Sourcing-Strategie, Screening, Scorecard-Generierung, Angebotsbriefe
und Pipeline-Reporting — Sie behandeln Beziehungen, Urteile und Genehmigungen.

Fügen Sie keinen Anwendungscode hier hinzu. Dies ist ein Inhalts- und Workflow-Workspace.

## Stack

- Greenhouse / Ashby: ATS-System — Anforderungen, Kandidaten, Pipeline-Stages, Angebote, Reporting
- LinkedIn Recruiter: Boolean-Suche, InMail, gespeicherte Suchen, Talent-Pool-Verwaltung
- Slack: Hiring-Manager-Kommunikation, Debrief-Koordination, Angebotsgenehmigungsthreads
- HireRight: Bestellung und Adjudikation von Hintergrundchecks
- Karat / CoderPad: Technikale Bewertungslieferung und Ergebniszugriff
- Calendly: Kandidatenplanung, Panel-Koordination
- Notion: Recruiting-Playbooks, Prozessdokumentation

## Offene Stellen

- Alle aktiven Anforderungen befinden sich in roles/ — ein Unterverzeichnis pro offene Stelle
- Rollenbeschreibung (role-brief.md) muss ausgefüllt sein, bevor Befehle für diese Rolle ausgeführt werden
- Scorecard (scorecard.md) muss vorhanden sein, bevor Interviews beginnen
- Angebote erfordern immer Genehmigung vor dem Senden — siehe offer-management/approval-workflow.md

## Häufige Aufgaben — genaue Befehle

### Stellenbeschreibung schreiben
/job-description
→ Lesen Sie zunächst die role-brief.md, dann entwerfen Sie eine vollständige JD. Bestätigen Sie vor dem Schreiben auf
  die job-description.md der Rolle.

### Sourcing-Strategie erstellen
/sourcing-strategy
→ Nimmt Rollentyp + Ebene, gibt Boolean-Strings und Kanalempfehlungen mit
  erwarteten Response-Rate-Benchmarks aus.

### Screening-Email oder InMail entwerfen
/screen-email
→ Fordert Rolle, Kandidatenhintergrund und Outreach-Typ an (kalte InMail vs. warme
  Referral vs. Application Follow-up); gibt Betreff + Text aus.

### Interview-Scorecard erstellen
/interview-scorecard
→ Nimmt Rollenbeschreibung, gibt Kompetenzliste mit Behavioral-Fragen und 1-5-Richtlinie
  mit Bewertungsankern für jede Kompetenz aus.

### Anschreiben generieren
/offer-letter
→ Nimmt Kandidatenname, Rolle, Ebene, Startdatum, Grundgehalt, Eigenkapital und Signing-Bonus-Eingaben;
  zieht entsprechende Vorlage aus offer-management/offer-letter-templates/;
  gibt Entwurf zur Überprüfung aus. Niemals ohne Genehmigungsbestätigung versenden.

### Wöchentlichen Pipeline-Report abrufen
/pipeline-report
→ Fragt ATS nach offenen Rollen, Kandidatenzahlen nach Stage, Time-in-Stage und Blockern ab;
  formatiert und speichert unter reports/weekly/YYYY-WNN.md.

### Debrief strukturieren
/candidate-debrief
→ Nimmt Rohinterviewer-Notizen + Scorecard, synthetisiert eine Hire/No-Hire-Empfehlung
  mit unterstützenden Beweisen, die jeder Kompetenz zugeordnet sind.

## Konventionen

- Rollenordner: Immer roles/_template/ kopieren beim Öffnen einer neuen Anforderung — niemals ad hoc erstellen
- JDs: Verwenden Sie inklusive Sprache; vermeiden Sie gegenderte Pronomen, "Rockstar", "Ninja", "Culture Fit"
- Scorecards: Alle Kompetenzen mit 1-5 Ankern bewertet — keine nur freien Evaluierungen
- Angebote: Die Vergütung muss vor dem Entwurf im Angebot-management/comp-bands.md innerhalb des Bandes liegen
- Pipeline-Tracker: Aktualisieren Sie candidates/pipeline-tracker.md nach jedem Stage-Wechsel
- Silver Medalists: Protokollieren Sie jeden starken No-Hire unter candidates/silver-medalists/silver-medalist-index.md
  mit Rolle, Datum, Grund und Datum zur Wiederaufnahme vorschlagen
- Reports: Gespeichert unter reports/weekly/YYYY-WNN.md — historische Reports niemals überschreiben
- Abgelehnte Kandidaten: Protokollieren Sie candidates/declined/declined-log.md mit Reason Code für Analytik

## Was Claude nicht tun sollte

- Versenden Sie Angebotsbriefe nicht ohne explizite Genehmigungsbestätigung des Benutzers
- Posten Sie Stellenbeschreibungen nicht auf LinkedIn oder Greenhouse ohne Benutzerbestätigung
- Bestellen Sie keinen Hintergrundchecks (HireRight) — kennzeichnen Sie wenn passend, Benutzer initiiert
- Geben Sie Vergütungsbanddetails nicht in einem kandidatenbezogenen Entwurf frei
- Erstellen Sie Scorecards nicht ohne zunächst die role-brief.md für diese Rolle zu lesen
- Empfehlen Sie nicht, einen Kandidaten basierend auf geschützten Merkmalen abzulehnen
```

## MCP-Server

```json
{
  "mcpServers": {
    "greenhouse": {
      "command": "npx",
      "args": ["-y", "@greenhouse/mcp-server"],
      "env": {
        "GREENHOUSE_API_KEY": "${GREENHOUSE_API_KEY}",
        "GREENHOUSE_ON_BEHALF_OF": "${GREENHOUSE_USER_ID}"
      }
    },
    "ashby": {
      "command": "npx",
      "args": ["-y", "@ashby-hq/mcp-server"],
      "env": {
        "ASHBY_API_KEY": "${ASHBY_API_KEY}"
      }
    },
    "linkedin": {
      "command": "npx",
      "args": ["-y", "@linkedin/mcp-server"],
      "env": {
        "LINKEDIN_ACCESS_TOKEN": "${LINKEDIN_ACCESS_TOKEN}",
        "LINKEDIN_ORGANIZATION_ID": "${LINKEDIN_ORGANIZATION_ID}"
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
        "/Users/$USER/recruiter-workspace"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */offers/offer-draft.md ]]; then echo \"[hook] Offer draft written. Reminder: obtain approval before sending — see offer-management/approval-workflow.md\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_RESULT_PATH\" == */reports/weekly/* ]]; then echo \"[hook] Pipeline report saved: $CLAUDE_TOOL_RESULT_PATH\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__greenhouse__create_offer",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"[hook] Offer creation triggered in Greenhouse — confirm approval chain in offer-management/approval-workflow.md is complete before proceeding.\"'"
          }
        ]
      }
    ]
  }
}
```

## Zu installierende Skills

```bash
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/tech-interview-kit
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
```

## Verwandt

- [Recruiter-Anleitung — vollständige Workflow-Dokumentation](../guides/for-recruiter.md)
- [Hiring-Pipeline-Workflow — End-to-End-Prozess](../workflows/hiring-pipeline.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
