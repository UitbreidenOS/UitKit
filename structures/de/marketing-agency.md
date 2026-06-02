# Marketing-Agentur-Betrieb — Projektstruktur

> Für Marketingagenturen, die mehrere Kundenkampagnen verwalten — von Onboarding und Briefing-Erfassung über Inhaltsproduktion, bezahlte Medien, monatliche Berichte bis zur Retainer-Abrechnung — alles in einem einzigen Claude-Code-Arbeitsbereich.

## Stack

- **Projektmanagement:** Asana (Projekte, Timelines, Portfolios) oder Monday.com (Boards, Automationen, Dashboards)
- **CRM + Kampagnenverfolgung:** HubSpot CRM (Kontakte, Deals, Kampagnenleistung, E-Mail-Sequenzen)
- **Dokumente + Zusammenarbeit:** Google Workspace (Docs, Sheets, Slides, Drive)
- **Kreatives:** Figma (Markendesign, Werbecreatives, Landing-Page-Mockups, Präsentationsdecks)
- **SEO:** Semrush (Keyword Magic, Position Tracking, Site Audit, Backlink-Analysen)
- **Bezahlte Suche:** Google Ads (Search, Display, Performance Max, Demand Gen-Kampagnen)
- **Bezahlte soziale Medien:** Meta Business Suite (Facebook + Instagram Ads Manager, Audience Insights)
- **Kommunikation:** Slack (Kundenchannels, interne Channels, Kampagnen-Alerts)
- **Zeiterfassung:** Harvest (Zeiterfassung auf Projektebene, Budget-Burndown, Team-Kapazität)
- **Abrechnung:** FreshBooks (Retainer-Rechnungen, Projektabrechnung, Ausgabenverfolgung, Berichte)
- **Analysen:** Google Analytics 4, Looker Studio (kanalübergreifende Dashboards)

## Verzeichnisbaum

```
marketing-agency/
├── .claude/
│   ├── CLAUDE.md                                     # Arbeitsbereich-Anweisungen für Claude Code
│   ├── settings.json                                 # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── new-client.md                             # /new-client — vollständiges Kundenverzeichnis aus Vorlage scaffolden
│       ├── campaign-brief.md                         # /campaign-brief — Kampagnenbrief aus Intake-Notizen erstellen
│       ├── monthly-report.md                         # /monthly-report — Metriken abrufen und Kundenbericht schreiben
│       ├── retainer-check.md                         # /retainer-check — protokollierte Stunden vs. Retainer-Umfang vergleichen
│       ├── proposal.md                               # /proposal — neuen Business-Proposal aus Brief erstellen
│       ├── ad-copy.md                                # /ad-copy — Google Ads und Meta-Anzeigentexte variieren
│       ├── seo-audit.md                              # /seo-audit — Semrush Site-Audit-Zusammenfassung für Kunden ausführen
│       └── scope-change.md                           # /scope-change — Scope-Change-Order mit Abrechnungsauswirkungen entwerfen
├── clients/
│   ├── _template/                                    # Master-Vorlage — beim Intake zu clients/<client-name>/ kopieren
│   │   ├── brief/
│   │   │   ├── client-intake.md                     # Intake-Fragenbogen-Antworten
│   │   │   └── discovery-notes.md                   # Notizen aus dem Kickoff-Anruf
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md                # Gesamtstrategie und 90-Tage-Roadmap für Kanäle
│   │   │   ├── target-audience.md                   # ICP, Personas, Schmerzpunkte
│   │   │   └── competitor-analysis.md               # Wettbewerbslandschaft, Lücken, Chancen
│   │   ├── campaigns/
│   │   │   └── _campaign-template/
│   │   │       ├── campaign-brief.md                # Ziele, Publikum, Messaging, Budget, Zeitplan
│   │   │       ├── ad-copy.md                       # Alle Anzeigentexte nach Kanal
│   │   │       ├── creative-brief.md                # Figma-Brief für Design-Team
│   │   │       └── results/
│   │   │           └── campaign-report.md           # Nachkampagnen-Ergebnisbericht
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md                  # Markenfarben, Schriftarten, Sprachton
│   │   │   ├── logo/                                # Genehmigte Logo-Dateien (SVG, PNG)
│   │   │   └── approved-copy/                       # Genehmigte Headlines, Taglines, Standardtexte
│   │   ├── reports/
│   │   │   ├── onboarding-report.md                 # Baseline-Audit beim Kickoff bereitgestellt
│   │   │   └── _monthly-template.md                 # Für jeden monatlichen Bericht kopieren
│   │   └── contracts/
│   │       ├── sow.md                               # Leistungsbeschreibung mit Lieferergebnissen und Umfang
│   │       ├── retainer-agreement.md                # Monatliche Retainer-Bedingungen und Stunden
│   │       └── amendments/                          # Unterzeichnete Scope-Change-Orders
│   ├── acme-corp/
│   │   ├── brief/
│   │   │   ├── client-intake.md
│   │   │   └── discovery-notes.md
│   │   ├── strategy/
│   │   │   ├── marketing-strategy.md
│   │   │   ├── target-audience.md
│   │   │   └── competitor-analysis.md
│   │   ├── campaigns/
│   │   │   ├── 2026-q2-brand-awareness/
│   │   │   │   ├── campaign-brief.md
│   │   │   │   ├── ad-copy.md
│   │   │   │   ├── creative-brief.md
│   │   │   │   └── results/
│   │   │   │       └── campaign-report.md
│   │   │   └── 2026-q3-lead-gen/
│   │   │       ├── campaign-brief.md
│   │   │       ├── ad-copy.md
│   │   │       └── creative-brief.md
│   │   ├── assets/
│   │   │   ├── brand-guidelines.md
│   │   │   ├── logo/
│   │   │   └── approved-copy/
│   │   ├── reports/
│   │   │   ├── onboarding-report.md
│   │   │   ├── 2026-04-monthly-report.md
│   │   │   ├── 2026-05-monthly-report.md
│   │   │   └── _monthly-template.md
│   │   └── contracts/
│   │       ├── sow.md
│   │       ├── retainer-agreement.md
│   │       └── amendments/
│   │           └── 2026-05-scope-change-01.md
│   └── blueprint-health/
│       ├── brief/
│       ├── strategy/
│       ├── campaigns/
│       ├── assets/
│       ├── reports/
│       └── contracts/
├── templates/
│   ├── campaign-brief.md                            # Leeres Kampagnenbrief — Ziele, Publikum, Budget, Kanäle
│   ├── monthly-report.md                            # Monatliche Berichtstruktur — Executive Summary, KPIs, Kanalaufschlüsselung
│   ├── proposal.md                                  # Neuer Business-Proposal — Situation, Ansatz, Team, Investition
│   ├── sow.md                                       # Leistungsbeschreibung — Lieferergebnisse, Zeitpläne, Umfang, Ausschlüsse
│   ├── creative-brief.md                            # Kreatives Brief für Figma — Kontext, Lieferergebnisse, Spezifikationen, Verbotenes
│   └── scope-change-order.md                        # Scope-Change-Order — Beschreibung, Stunden, überarbeitete Abrechnung
├── campaigns/
│   └── active/
│       ├── acme-corp--q3-lead-gen/                  # Symlink oder Kopie des aktiven Kampagnenverzeichnisses für schnellen Zugriff
│       └── blueprint-health--seo-sprint/
├── new-business/
│   ├── prospect-list.md                             # CRM-ähnliche Prospect-Verfolgung mit Status, Kontakt, Notizen
│   ├── proposals/
│   │   ├── greenfield-retail-2026-05.md             # Gesendete Proposals hier archiviert
│   │   └── northstar-saas-2026-06.md
│   └── pitch-decks/
│       ├── agency-capabilities-2026.md              # Master-Capabilities-Dokument (aus diesem für Decks ziehen)
│       └── greenfield-retail-deck-outline.md        # Deck-Gliederung vor dem Wechsel zu Slides/Figma
├── operations/
│   ├── sops/
│   │   ├── client-onboarding.md                    # Schritt-für-Schritt neues Kunden-Onboarding-Checkliste
│   │   ├── campaign-launch.md                      # Pre-Launch-Checkliste für bezahlte Kampagnen
│   │   ├── monthly-reporting.md                    # Berichtsworkflow — Daten ziehen, Entwurf, Überprüfung, Senden
│   │   ├── offboarding.md                          # Kunden-Offboarding — Asset-Übergabe, Zugriffswiderruf
│   │   └── retainer-renewal.md                     # Erneuerungsprozess — Überprüfung, Upsell, überarbeitete SOW
│   ├── onboarding/
│   │   ├── new-hire-checklist.md                   # Tools-Zugriff, Slack-Channels, Harvest-Setup
│   │   └── client-onboarding-checklist.md          # Parallele Checkliste für kundenseitige Setup-Schritte
│   ├── offboarding/
│   │   └── client-offboarding-checklist.md
│   └── rate-card.md                                # Aktuelle Stundenhonorar und Retainer-Tier-Preise
└── resources/
    ├── brand-guidelines/
    │   └── agency-brand.md                          # Agentur-eigener Brand Guide für Pitches und Proposals
    ├── media-kits/
    │   └── agency-media-kit-2026.md                 # Agentur-Übersicht, Kundenliste, Ergebnis-Highlights
    └── case-studies/
        ├── acme-corp-brand-awareness.md             # Strukturierte Fallstudie — Challenge, Ansatz, Ergebnisse
        └── blueprint-health-seo.md
```

## Wichtige Dateien erklären

| Pfad | Zweck |
|---|---|
| `.claude/commands/new-client.md` | Slash-Befehl, der den vollständigen `clients/<slug>/`-Verzeichnisbaum aus `clients/_template/` erstellt, das Intake-Formular vorausfüllt und einen Entwurf von SOW und Retainer-Vereinbarung erstellt |
| `.claude/commands/campaign-brief.md` | Nimmt Client-Slug, Kampagnenziel, Budget und Kanäle als Eingabe; erstellt einen vollständig strukturierten Kampagnenbrief, der an die bestehenden Brand Guidelines und Strategie des Clients abgestimmt ist |
| `.claude/commands/monthly-report.md` | Liest Kanal-Metriken (GA4, Google Ads, Meta, Semrush) aus einer strukturierten Datendatei und schreibt den monatlichen Kundenbericht mit `templates/monthly-report.md` |
| `.claude/commands/retainer-check.md` | Vergleicht in Harvest protokollierte Stunden mit dem Retainer-Umfang des Clients in `contracts/retainer-agreement.md` und kennzeichnet Überläufe oder verfügbares Budget |
| `.claude/commands/scope-change.md` | Erstellt einen Scope-Change-Order mit Stunden, Begründung und überarbeiteter Abrechnung mit `templates/scope-change-order.md`; speichert in `clients/<slug>/contracts/amendments/` |
| `clients/_template/` | Master-Scaffolding-Verzeichnis — kopieren Sie diesen ganzen Ordner beim Onboarden eines neuen Clients, um sicherzustellen, dass jeder Ordner und jede Datei vor dem Kickoff existiert |
| `operations/sops/monthly-reporting.md` | Kanonische SOP für den monatlichen Berichtsprozess — definiert, wer Daten zieht, wie der Überprüfungszyklus aussieht und wann Berichte an Clients gehen |
| `templates/campaign-brief.md` | Standard-Kampagnenbrief der Agentur mit Abschnitten für Business-Ziel, Erfolgskennzahlen, Publikum, Messaging-Säulen, Kanalplan, Budget und Zeitplan |

## Schnelle Scaffolding

```bash
# Arbeitsbereich-Root erstellen
mkdir -p marketing-agency && cd marketing-agency

# Claude-Code-Konfiguration
mkdir -p .claude/commands

# Client _template-Verzeichnis (volle Tiefe)
mkdir -p clients/_template/brief
mkdir -p clients/_template/strategy
mkdir -p clients/_template/campaigns/_campaign-template/results
mkdir -p clients/_template/assets/logo
mkdir -p clients/_template/assets/approved-copy
mkdir -p clients/_template/reports
mkdir -p clients/_template/contracts/amendments

# Beispiel-Kundenverzeichnisse
mkdir -p clients/acme-corp/brief
mkdir -p clients/acme-corp/strategy
mkdir -p clients/acme-corp/campaigns/2026-q2-brand-awareness/results
mkdir -p clients/acme-corp/campaigns/2026-q3-lead-gen
mkdir -p clients/acme-corp/assets/logo
mkdir -p clients/acme-corp/assets/approved-copy
mkdir -p clients/acme-corp/reports
mkdir -p clients/acme-corp/contracts/amendments

mkdir -p clients/blueprint-health/brief
mkdir -p clients/blueprint-health/strategy
mkdir -p clients/blueprint-health/campaigns
mkdir -p clients/blueprint-health/assets
mkdir -p clients/blueprint-health/reports
mkdir -p clients/blueprint-health/contracts/amendments

# Templates
mkdir -p templates

# Aktive Kampagnen-Verknüpfung
mkdir -p campaigns/active

# Neuer Business
mkdir -p new-business/proposals
mkdir -p new-business/pitch-decks

# Operationen
mkdir -p operations/sops
mkdir -p operations/onboarding
mkdir -p operations/offboarding

# Ressourcen
mkdir -p resources/brand-guidelines
mkdir -p resources/media-kits
mkdir -p resources/case-studies

# Konfigurationsdateien initialisieren
touch .claude/CLAUDE.md
touch .claude/settings.json

# Platzhalter-Template-Dateien erstellen
touch clients/_template/brief/client-intake.md
touch clients/_template/brief/discovery-notes.md
touch clients/_template/strategy/marketing-strategy.md
touch clients/_template/strategy/target-audience.md
touch clients/_template/strategy/competitor-analysis.md
touch clients/_template/campaigns/_campaign-template/campaign-brief.md
touch clients/_template/campaigns/_campaign-template/ad-copy.md
touch clients/_template/campaigns/_campaign-template/creative-brief.md
touch clients/_template/reports/_monthly-template.md
touch clients/_template/contracts/sow.md
touch clients/_template/contracts/retainer-agreement.md
touch templates/campaign-brief.md
touch templates/monthly-report.md
touch templates/proposal.md
touch templates/sow.md
touch templates/creative-brief.md
touch templates/scope-change-order.md
touch new-business/prospect-list.md
touch operations/sops/client-onboarding.md
touch operations/sops/campaign-launch.md
touch operations/sops/monthly-reporting.md
touch operations/sops/offboarding.md
touch operations/sops/retainer-renewal.md
touch operations/rate-card.md

# Alle relevanten Skills installieren
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill data-ml/stakeholder-report

# Slash-Befehle installieren
npx claudient add command new-client
npx claudient add command campaign-brief
npx claudient add command monthly-report
npx claudient add command retainer-check
npx claudient add command proposal
npx claudient add command ad-copy
npx claudient add command seo-audit
npx claudient add command scope-change

echo "Marketing-Agentur-Arbeitsbereich bereit."
```

## CLAUDE.md-Vorlage

```markdown
# Marketing-Agentur-Betrieb — Claude-Anweisungen

## Was dies ist

Dieser Arbeitsbereich verwaltet Multi-Client-Marketing-Agentur-Operationen: Client-Onboarding,
Kampagnenbrief-Entwicklung, bezahlte Medien (Google Ads + Meta), SEO (Semrush), monatliche
Berichterstattung, Retainer-Umfang-Verfolgung und neuer Business-Proposal-Entwicklung. Jeder Client
hat ein isoliertes Verzeichnis unter clients/. Alle Vorlagen befinden sich in templates/.

## Stack

- Projektmanagement: Asana (ein Projekt pro Client, Kampagnenaufgaben, Timelines)
- CRM: HubSpot (Kontakt- und Deal-Datensätze, Kampagnenverfolgung, E-Mail-Sequenzen)
- Dokumente: Google Workspace (Docs für Lieferergebnisse, Sheets für Medienpläne, Slides für Decks)
- Kreatives: Figma (Werbecreatives, Landing Pages, Präsentationsdecks)
- SEO: Semrush (Keyword-Recherche, Position Tracking, Site Audit, Backlink-Analyse)
- Bezahlte Suche: Google Ads (Search, Display, Performance Max)
- Bezahlte soziale Medien: Meta Business Suite (Facebook + Instagram Ads Manager)
- Zeiterfassung: Harvest (Projektebene, abrechenbar vs. nicht abrechenbar pro Client)
- Abrechnung: FreshBooks (Retainer-Rechnungen, Projektabrechnung, Ausgabenabstimmung)
- Kommunikation: Slack (#client-<name> pro Client, #campaigns, #new-business, #ops)
- Analysen: Google Analytics 4, Looker Studio Dashboards

## Verzeichniskonventionen

- clients/<client-slug>/ — alle Kundenclient-Lieferergebnisse; Client-Assets nie über Ordner mischen
- clients/<client-slug>/campaigns/<YYYY-qN-campaign-name>/ — ein Verzeichnis pro Kampagne
- clients/<client-slug>/reports/<YYYY-MM>-monthly-report.md — monatliche Berichte nach Periode benannt
- clients/<client-slug>/contracts/amendments/ — jede Scope-Änderung erhält eine nummerierte Datei
- templates/ — Source of Truth für alle Dokumentstrukturen; nie ohne Kopieren einer Vorlage entwerfen
- new-business/ — nur Prospect-Verfolgung, Proposals und Pitch-Deck-Gliederungen
- operations/sops/ — kanonische Prozessdokumentation; diese aktualisieren wenn sich Prozess ändert

## Einen neuen Client onboarden

1. Kopieren Sie clients/_template/ zu clients/<new-client-slug>/:
   cp -r clients/_template clients/<new-client-slug>
2. Führen Sie /new-client client="<Name>" slug="<slug>" retainer="<monthly-hours>" aus
3. Vervollständigen Sie clients/<slug>/brief/client-intake.md vor dem Kickoff-Anruf
4. Nach dem Kickoff füllen Sie clients/<slug>/strategy/marketing-strategy.md aus
5. Entwerfen Sie SOW mit templates/sow.md; speichern Sie in clients/<slug>/contracts/sow.md
6. Erstellen Sie Asana-Projekt und verlinken Sie Projekt-ID in clients/<slug>/brief/discovery-notes.md
7. Erstellen Sie HubSpot-Deal-Datensatz und verlinken Sie Deal-ID in discovery-notes.md
8. Öffnen Sie Harvest-Projekt für den Client mit der Rate Card in operations/rate-card.md

## Kampagnenbrief-Workflow

1. Führen Sie /campaign-brief client="<slug>" goal="<objective>" budget="<amount>" channels="<list>" aus
2. Überprüfen und verfeinern Sie clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md
3. Führen Sie /ad-copy brief=clients/<slug>/campaigns/<campaign-dir>/campaign-brief.md aus
4. Senden Sie creative-brief.md an Figma — referenzieren Sie brand-guidelines.md für Spec-Einschränkungen
5. Beim Start führen Sie /seo-audit client="<slug>" für organische Kampagnen aus; überprüfen Sie Semrush-Positions-Baseline
6. Protokollieren Sie Kampagnen-Startdatum in Harvest als Milestone-Notiz

## Monatlicher Berichtsprozess

1. Exportieren Sie Kanaldaten (GA4, Google Ads, Meta, Semrush Position Tracking) in CSV oder strukturiert .md
2. Platzieren Sie exportierte Daten in clients/<slug>/reports/raw-data-<YYYY-MM>.md
3. Führen Sie /monthly-report client="<slug>" period="<YYYY-MM>" data=clients/<slug>/reports/raw-data-<YYYY-MM>.md aus
4. Überprüfen Sie den Entwurf bei clients/<slug>/reports/<YYYY-MM>-monthly-report.md
5. Interne Überprüfung über Slack #campaigns vor dem Senden an den Client
6. Nach Client-Genehmigung in Google Drive archivieren und in Asana als gesendet markieren

## Retainer-Umfang-Management

- Führen Sie /retainer-check client="<slug>" month="<YYYY-MM>" nach jedem Harvest-Export aus
- Stunden über dem Umfang: Entwerfen Sie Scope-Change-Order vor dem Protokollieren zusätzlicher Zeit
  /scope-change client="<slug>" hours="<overage>" reason="<description>"
- Speichern Sie die Ausgabe in clients/<slug>/contracts/amendments/YYYY-MM-scope-change-NN.md
- Retainer-Erneuerungen: folgen Sie operations/sops/retainer-renewal.md 30 Tage vor dem Enddatum

## Anzeigentext-Konventionen

- Google Ads Headlines: maximal 30 Zeichen; schreiben Sie 10+ Varianten pro Kampagne
- Google Ads Beschreibungen: maximal 90 Zeichen; beginnen Sie mit Vorteil, enden Sie mit CTA
- Meta Primary Text: 125 Zeichen sichtbar vor Abschnitt; haken Sie in den ersten 80 Zeichen ein
- Meta Headline: maximal 40 Zeichen; vorteilsorientiert, kein Clickbait
- Alle Texte müssen vor dem Upload gegen Client Brand Guidelines genehmigt werden

## Abrechnungskonventionen

- Protokollieren Sie Zeit in Harvest sofort nach jeder Aufgabe — nicht am Ende der Woche sammeln
- Abrechnungscodes: Strategy, Content, Paid-Media, Reporting, Account-Management, Design
- Nicht abrechenbar: interne Schulung, Tooling-Setup, Administration
- Rechnungsstellung am 1. des Monats über FreshBooks; beziehen Sie Harvest-Bericht für Stunden-Aufschlüsselung ein
```

## MCP-Server

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/marketing-agency"
      ]
    },
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
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google-labs/google-drive-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_REFRESH_TOKEN": "${GOOGLE_REFRESH_TOKEN}"
      }
    },
    "asana": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "${ASANA_ACCESS_TOKEN}"
      }
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */campaigns/*/campaign-brief.md ]]; then echo \"[hook] Campaign brief saved: $FILE — run /ad-copy and /creative-brief next\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */contracts/amendments/*.md ]]; then echo \"[hook] Scope change order saved: $FILE — update Harvest budget and send to client for signature\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find clients/ -mindepth 1 -maxdepth 1 -type d ! -name _template | while read CLIENT; do [ ! -f \"$CLIENT/contracts/retainer-agreement.md\" ] && echo \"$CLIENT\"; done | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[reminder] $MISSING client(s) missing retainer-agreement.md — check contracts/ directories\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills zu installieren

```bash
npx claudient add skill marketing/campaign-brief
npx claudient add skill marketing/ad-copy-generator
npx claudient add skill marketing/monthly-report
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/social-media-manager
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/investor-update
```

## Verwandt

- [Guide: Claude for Marketing Teams](../guides/for-content-marketer.md)
- [Workflow: Campaign Launch end-to-end](../workflows/campaign-launch.md)
- [Workflow: Monthly Client Reporting](../workflows/monthly-reporting.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
