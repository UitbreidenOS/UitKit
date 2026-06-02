# Investor / VC Workspace — Projektstruktur

> Für Risikokapitalinvestoren oder Angel-Investoren, die Deal-Flows, Due Diligence, Portfolio-Überwachung und LP-Beziehungen durch eine strukturierte Pipeline von Sourcing, IC-Memos und vierteljährlichen Berichten verwalten.

## Stack

- **Notion** oder **Airtable** — Deal-CRM, Pipeline-Kanban, Portfolio-Tracker, Unternehmens-Datenbank
- **Carta** — Cap-Table-Management, Eigenkapitalverfolgung, Pro-Rata-Rechte, Option-Pool-Modellierung
- **AngelList** oder **Visible** — LP-Reporting, Fund-Performance-Dashboards, Investor-Updates
- **QuickBooks** — Fund-Accounting, Management-Fee-Verfolgung, Carried-Interest-Berechnungen
- **Pitchbook** oder **Crunchbase** — Marktdaten, Comp-Sets, Bewertungsbenchmarks, Sector-Mapping
- **Slack** — Founder-Kanäle, Co-Investor-Threads, IC-asynchrone Diskussionen, Deal-Room-Kanäle
- **Google Workspace** — Drive für Due-Diligence-Dokumente, Sheets für KPI-Tracking, Docs für Memos
- **Claude Code** — Deal-Screening, IC-Memo-Entwürfe, Portfolio-Überwachung, LP-Bericht-Generierung

## Verzeichnisstruktur

```
investor-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace-Anweisungen (Vorlage unten einfügen)
│   ├── settings.json                          # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── deal-screen.md                     # /deal-screen — akzeptiert Company-URL oder Deck, gibt strukturierte Triage aus
│       ├── ic-memo.md                         # /ic-memo — vollständiges Investment-Committee-Memo aus Due-Diligence-Notizen
│       ├── portfolio-update.md                # /portfolio-update — monatliche KPI-Erzählung aus ungefilterten Metriken
│       ├── lp-report.md                       # /lp-report — vierteljährliches LP-Schreiben mit Fund-Performance-Zusammenfassung
│       ├── founder-update.md                  # /founder-update — strukturierte Antwort auf monatliches Founder-Update
│       ├── market-thesis.md                   # /market-thesis — Sector-Thesis-Dokument aus Forschungsinputs
│       └── due-diligence.md                   # /due-diligence — vollständige Checkliste + Findings-Synthese
├── pipeline/
│   ├── sourcing/                              # Eingehende und ausgehende Leads nicht yet getroffen
│   │   ├── _template/
│   │   │   └── initial-screen.md              # Blank-Screening-Formular — Unternehmen, Stadium, Thesis-Fit, Quelle
│   │   ├── acme-ai/
│   │   │   └── initial-screen.md              # First-Pass-Screen: Traktion, Team, Markt, Ask
│   │   ├── beta-biotech/
│   │   │   └── initial-screen.md
│   │   └── gamma-fintech/
│   │       └── initial-screen.md
│   ├── first-meeting/                         # Gescreent — erstes Gründer-Gespräch geplant oder abgeschlossen
│   │   ├── delta-robotics/
│   │   │   ├── initial-screen.md              # Screen-Notizen aus Sourcing
│   │   │   └── first-meeting-notes.md         # Ungefilterte Gesprächsnotizen — Gründer-Hintergrund, Produkt, Ask, Signale
│   │   └── epsilon-health/
│   │       ├── initial-screen.md
│   │       └── first-meeting-notes.md
│   ├── diligence/                             # Aktive Diligence — tiefere Reference-Checks, Finanzberichte, Tech
│   │   ├── zeta-infra/
│   │   │   ├── initial-screen.md
│   │   │   ├── first-meeting-notes.md
│   │   │   ├── diligence-tracker.md           # Offene Punkte, Besitzer, Fristen über alle Workstreams
│   │   │   ├── financial-review.md            # Umsatzmodell, Unit-Ökonomie, Burn, Runway-Analyse
│   │   │   ├── tech-audit-notes.md            # Architektur-Review, Skalierbarkeit, Sicherheitsstatus
│   │   │   ├── reference-checks/              # Strukturierte Reference-Check-Transkripte
│   │   │   │   ├── ref-cto-john-doe.md
│   │   │   │   └── ref-customer-acme.md
│   │   │   └── data-room/                     # Spiegel von Gründer-freigegebenen Dokumenten
│   │   │       ├── .gitkeep
│   │   │       └── cap-table-summary.md       # Extrahierte Cap-Table-Zusammenfassung aus Carta-Export
│   │   └── eta-saas/
│   │       ├── diligence-tracker.md
│   │       ├── financial-review.md
│   │       └── reference-checks/
│   │           └── .gitkeep
│   ├── ic/                                    # IC-Memo abgeschlossen — ausstehend Investment-Committee-Abstimmung
│   │   └── theta-marketplace/
│   │       ├── ic-memo.md                     # Finales IC-Memo — Investment-Thesis, Risiken, Konditionen, Empfehlung
│   │       ├── diligence-tracker.md
│   │       ├── financial-review.md
│   │       └── comps-analysis.md              # Öffentliche und private vergleichbare Unternehmen, Bewertungsbenchmarks
│   ├── closed/                                # Getätigte Investitionen — nach dem Geschlossen in portfolio/ verschieben
│   │   └── iota-logistics/
│   │       ├── ic-memo.md
│   │       ├── closing-checklist.md           # Überweisungsbestätigung, Carta-Update, Pro-Rata-Verfolgung
│   │       └── post-close-intro.md            # Post-Close-Einführungs-E-Mail an Portfolio-Ressourcen
│   └── passed/                                # Abgelehnte Deals mit Pass-Begründung zur zukünftigen Referenz
│       ├── kappa-crypto/
│       │   ├── initial-screen.md
│       │   └── pass-rationale.md              # Warum haben wir abgelehnt — Thesis-Misfit, Bewertung, Team, Markt-Timing
│       └── lambda-hr-tech/
│           ├── initial-screen.md
│           └── pass-rationale.md
├── portfolio/                                 # Ein Ordner pro aktives Portfolio-Unternehmen
│   ├── _template/                             # Beim Abschluss einer neuen Investition kopieren
│   │   ├── memo.md                            # IC-Memo (kopiert aus pipeline/closed/)
│   │   ├── cap-table.md                       # Eigentumsanteile %, Anteile, Option-Pool, Konditionen der letzten Runde
│   │   ├── kpis.md                            # Monatliches KPI-Protokoll — ARR, Wachstum, Burn, Mitarbeiterzahl, NRR
│   │   ├── updates/                           # Monatliche Gründer-Updates, chronologisch archiviert
│   │   │   └── .gitkeep
│   │   └── board-notes/                       # Board-Meeting-Vorbereitung und Post-Meeting-Notizen
│   │       └── .gitkeep
│   ├── acme-series-a/                         # Echtes Portfolio-Unternehmen (Deal abgeschlossen, jetzt aktiv)
│   │   ├── memo.md                            # Ursprüngliches IC-Memo
│   │   ├── cap-table.md                       # Aktuelle Cap-Table-Zusammenfassung aus Carta
│   │   ├── kpis.md                            # Laufendes KPI-Tabelle monatlich aktualisiert
│   │   ├── updates/
│   │   │   ├── 2026-05-update.md              # Mai 2026 Gründer-Update — mit Highlights annotiert
│   │   │   └── 2026-04-update.md
│   │   └── board-notes/
│   │       ├── 2026-05-board-prep.md          # Board-Deck-Outline, Agenda, Fragen zum Aufwerfen
│   │       └── 2026-05-board-notes.md         # Post-Board Maßnahmen und Entscheidungen
│   └── beta-seed/
│       ├── memo.md
│       ├── cap-table.md
│       ├── kpis.md
│       ├── updates/
│       │   └── 2026-05-update.md
│       └── board-notes/
│           └── .gitkeep
├── memos/                                     # Alle Investment-Memos, Pass-Memos, Deal-Notizen an einem Ort
│   ├── ic-memos/                              # Investment-Committee-Memos (genehmigte Deals)
│   │   ├── 2026-05-acme-series-a.md
│   │   └── 2026-03-beta-seed.md
│   ├── deal-memos/                            # Kürzere Deal-Briefs für erstes Treffen oder frühe Diligence
│   │   ├── 2026-06-zeta-infra-brief.md
│   │   └── 2026-05-eta-saas-brief.md
│   └── pass-memos/                            # Dokumentierte Pass-Begründung — suchbar für zukünftige Mustererkennung
│       ├── 2026-05-kappa-crypto-pass.md
│       └── 2026-04-lambda-hr-tech-pass.md
├── lp/                                        # LP-nahe Materialien und Fund-Performance-Verfolgung
│   ├── quarterly-reports/
│   │   ├── 2026-q1-lp-report.md              # Q1 2026 LP-Schreiben — Fund-Performance, Portfolio-Highlights
│   │   └── 2025-q4-lp-report.md
│   ├── annual-reports/
│   │   └── 2025-annual-report.md             # Jährliche Fund-Zusammenfassung — IRR, DPI, RVPI, Top-Performer
│   ├── fund-performance/
│   │   ├── nav-tracker.md                     # Nettovermögenswert nach Quartal — markierte Portfoliowerte
│   │   └── cash-flow-log.md                  # Capital Calls, Ausschüttungen, Management-Fee-Auszüge
│   └── lp-communications/
│       ├── capital-call-notice-template.md    # Standard-Capital-Call-Mitteilung mit Überweisungsanweisungen
│       └── distribution-notice-template.md   # Ausschüttungs-Mitteilungsformat für realisierte Exits
├── thesis/                                    # Markt-Thesen und Sector-Forschung
│   ├── ai-infrastructure-thesis.md           # Vollständige Sector-Thesis — Markt-Map, Timing, Ziel-Profil
│   ├── climate-tech-thesis.md
│   ├── fintech-thesis.md
│   └── sector-notes/                          # Ungefilterte Forschungsnotizen, die in Thesis-Dokumente einfließen
│       ├── ai-infra-market-data.md
│       └── climate-founding-team-patterns.md
├── diligence/                                 # Wiederverwendbare Diligence-Vorlagen und Checklisten
│   ├── reference-check-template.md           # Strukturierter Reference-Interview-Leitfaden — 12 Standardfragen
│   ├── financial-review-checklist.md         # Finanz-Diligence-Checkliste — Modell, Annahmen, Red Flags
│   ├── tech-audit-template.md                # Technische Diligence-Anleitung — Architektur, Sicherheit, Skalierbarkeit
│   ├── legal-review-checklist.md             # Rechtliche Diligence — IP, Beschäftigung, Verträge, Rechtsstreitigkeiten
│   └── founder-background-check.md           # Gründer-Bilanz, Referenzen, LinkedIn-Verifikation
└── scratch/
    ├── weekly-deal-notes.md                  # Informeller Staging-Bereich für Notizen vor dem Einreichen in Pipeline
    └── research-staging.md                   # Ungefilterte Market-Research-Clips vor der Formatierung in Thesis-Dokumente
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/deal-screen.md` | Slash-Befehl, der eine Company-URL, Deck-PDF-Zusammenfassung oder AngelList-Profil akzeptiert und eine strukturierte Triage zurückgibt: Thesis-Fit, Team-Signal, Marktgröße, Traktion, Red Flags und empfohlener nächster Schritt |
| `.claude/commands/ic-memo.md` | Slash-Befehl, der ein vollständiges Investment-Committee-Memo aus Due-Diligence-Notizen generiert — Investment-Thesis, Marktanalyse, Team-Bewertung, Risiken und Mitigationen, vorgeschlagene Konditionen und Empfehlung |
| `.claude/commands/lp-report.md` | Slash-Befehl, der Fund-Performance-Daten und Portfolio-Highlights nimmt und einen vierteljährlichen LP-Brief in der Stimme des Fonds produziert — Performance-Zusammenfassung, Portfolio-Updates, neue Investitionen, Ausblick |
| `.claude/commands/due-diligence.md` | Slash-Befehl, der Reference-Check-Transkripte, Financial-Review-Notizen und Tech-Audit-Notizen in ein strukturiertes Findings-Dokument mit offenen Punkte und IC-Bereitschaftsbewertung synthetisiert |
| `pipeline/diligence/_template/diligence-tracker.md` | Master-Tracker für alle offenen Diligence-Punkte über Workstreams — Besitzer, Frist, Status — täglich während aktiver Diligence aktualisiert |
| `portfolio/_template/kpis.md` | Monatliche KPI-Protokoll-Vorlage mit ARR, Monat-zu-Monat-Wachstum, Burn-Rate, Runway, Mitarbeiterzahl, NRR und Bruttomarge — verwendet zur Generierung von Portfolio-Update-Erzählungen |
| `lp/fund-performance/nav-tracker.md` | Vierteljährliches NAV pro Portfolio-Unternehmen — markierte Werte, Eigentumsanteile %, implizierte Renditen — fließt direkt in LP-Berichte und jährliche Fund-Zusammenfassung ein |
| `diligence/reference-check-template.md` | Strukturierter 12-Fragen-Reference-Interview-Leitfaden, der Gründer-Fähigkeiten, Arbeitsweise, Schwächen und unternehmensspezifische Bedenken abdeckt — wird für jeden Diligence-Prozess verwendet |

## Quick Scaffold

```bash
# Workspace-Root erstellen
mkdir -p investor-workspace

# .claude-Struktur erstellen
mkdir -p investor-workspace/.claude/commands

# Pipeline-Stage-Verzeichnisse mit Vorlagen erstellen
mkdir -p investor-workspace/pipeline/sourcing/_template
mkdir -p investor-workspace/pipeline/first-meeting
mkdir -p investor-workspace/pipeline/diligence/_template/reference-checks
mkdir -p investor-workspace/pipeline/diligence/_template/data-room
mkdir -p investor-workspace/pipeline/ic
mkdir -p investor-workspace/pipeline/closed
mkdir -p investor-workspace/pipeline/passed

# Portfolio-Vorlage erstellen
mkdir -p investor-workspace/portfolio/_template/updates
mkdir -p investor-workspace/portfolio/_template/board-notes

# Memo-Kategorien erstellen
mkdir -p investor-workspace/memos/ic-memos
mkdir -p investor-workspace/memos/deal-memos
mkdir -p investor-workspace/memos/pass-memos

# LP-Verzeichnisse erstellen
mkdir -p investor-workspace/lp/quarterly-reports
mkdir -p investor-workspace/lp/annual-reports
mkdir -p investor-workspace/lp/fund-performance
mkdir -p investor-workspace/lp/lp-communications

# Thesis- und Diligence-Verzeichnisse erstellen
mkdir -p investor-workspace/thesis/sector-notes
mkdir -p investor-workspace/diligence
mkdir -p investor-workspace/scratch

# .gitkeep-Platzhalter säen
touch investor-workspace/pipeline/diligence/_template/reference-checks/.gitkeep
touch investor-workspace/pipeline/diligence/_template/data-room/.gitkeep
touch investor-workspace/portfolio/_template/updates/.gitkeep
touch investor-workspace/portfolio/_template/board-notes/.gitkeep

# Finance-Skills installieren
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/dcf-model
npx claudient add skill finance/comps-analysis

# Befehl-Stubs in .claude/commands/ kopieren
npx claudient add skill finance/deal-screening --output investor-workspace/.claude/commands/deal-screen.md
npx claudient add skill finance/ic-memo --output investor-workspace/.claude/commands/ic-memo.md
npx claudient add skill finance/portfolio-monitor --output investor-workspace/.claude/commands/portfolio-update.md
npx claudient add skill finance/deal-memo --output investor-workspace/.claude/commands/lp-report.md
```

## CLAUDE.md-Vorlage

```markdown
# Investor Workspace — Claude Code Anweisungen

## Was das ist

Dies ist das Arbeitsverzeichnis für einen Risikokapitalinvestor oder Angel-Investor, der Deal-Flows,
Diligence, Portfolio-Überwachung und LP-Beziehungen verwaltet. Pipeline-Stadien befinden sich in pipeline/,
aktive Investitionen in portfolio/, IC-Memos in memos/, LP-Materialien in lp/ und Sector-Forschung
in thesis/. Das gesamte Deal-Screening, Memo-Drafting und Reporting erfolgt über Claude Code.

## Stack

- Notion / Airtable — Deal-CRM und Portfolio-Datenbank; Pipeline-Kanban nach Stadium
- Carta — Cap-Table of Record; Zusammenfassungen exportieren zu portfolio/<company>/cap-table.md
- AngelList / Visible — LP-Reporting-Portal; Vierteljährliche Berichte in lp/quarterly-reports/ entwerfern
- QuickBooks — Fund-Accounting; Management-Gebühren, Capital Calls, Ausschüttungen
- Pitchbook / Crunchbase — Marktdaten und Comps; Daten exportieren zu thesis/sector-notes/ und memos
- Slack — Gründer-Kanäle und Co-Investor-Deal-Räume; relevante Threads in Deal-Ordner einfügen
- Google Workspace — Freigegebene Diligence-Data-Rooms; Schlüssel-Dokumente zu pipeline/diligence/<co>/data-room/ spiegeln

## Häufige Aufgaben und exakte Befehle

### Einen eingehenden Deal screenen
```
/deal-screen

Company: [Name]
URL: [Website oder AngelList-Profil]
Stage: [Seed / Series A / Series B]
Sector: [Kategorie]
Ask: $[Betrag] at $[Bewertung] cap
Source: [Eingehend / Warme Einführung von X / Ausgehend]
Deck-Zusammenfassung oder Schlüsselmetriken: [Einfügen oder beschreiben]
```

### Ein IC-Memo entwerfern
```
/ic-memo

Company: [Name], Stage: [Runde], Sector: [Kategorie]
Ask: $[Betrag], Valuation: $[Post-Money]
Investment-Thesis: [1-2 Sätze über Warum jetzt und Warum wir]
Markt: [TAM, Wachstumsrate, Schlüsseldynamiken]
Team: [Gründer-Hintergründe, relevante Erfahrung]
Traction: [ARR, Wachstumsrate, Schlüsselkunden, NRR]
Risiken: [Top 3 Risiken und vorgeschlagene Mitigationen]
Comparable Deals: [Comps mit Entry-Multiples]
Diligence-Notizen: [Schlüsselfunde aus financial-review.md und reference-checks/ einfügen]
```

### Eine monatliche Portfolio-Update synthetisieren
```
/portfolio-update

Company: [Name]
Month: [Monat YYYY]
Ungefilterte Update vom Gründer: [Monatliche Gründer-Update-E-Mail oder Notizen einfügen]
Prior Month KPIs: [Aus portfolio/<company>/kpis.md einfügen]
Board Notes Kontext: [Alle offenen Maßnahmen oder Bedenken]
```

### Einen vierteljährlichen LP-Bericht entwerfern
```
/lp-report

Quarter: Q[X] [JAHR]
Fund: [Fund-Name und Vintage]
NAV dieses Quartals: $[X]M (vorheriges Quartal: $[Y]M)
Neue Investitionen: [Unternehmen, Betrag, Stadium]
Portfolio-Highlights: [Top 2-3 Gewinne — Umsatz-Meilensteine, Follow-on-Runden, Partnerschaften]
Write-Downs oder Bedenken: [Alle Marken zum Flaggen]
Markt-Ausblick: [Makro-Kontext relevant zu Fund-Thesis]
Fund-Performance: [IRR, DPI, RVPI falls verfügbar]
```

### Eine Referenz für ein Portfolio-Unternehmen oder Diligence screenen
```
/due-diligence

Company: [Name]
Diligence-Stadium: [Reference Checks / Finanzielle Überprüfung / Tech-Audit / Vollständige Synthese]
Offene Punkte: [Aus pipeline/diligence/<co>/diligence-tracker.md einfügen]
Findings bis dato: [financial-review.md oder Reference-Check-Transkripte einfügen]
IC-Datum: [Zieldatum für Memo-Fertigstellung]
```

### Eine Markt-Thesis aufbauen
```
/market-thesis

Sector: [Kategorie]
Thesis-Frage: [Welche spezifische Wette machen wir?]
Markt-Daten: [Aus Pitchbook/Crunchbase-Export oder sector-notes/ einfügen]
Vergleichbare Fonds und Investitionen: [Wer sonst investiert, was sind die Signale?]
Ziel-Unternehmensprofil: [Stadium, Geographie, Gründer-Typ, Umsatzbereich]
Thesis-Risiken: [Was würde diese Thesis falsch machen?]
```

### Auf eine monatliche Gründer-Update antworten
```
/founder-update

Company: [Name]
Gründer-Update: [Vollständiges Update einfügen]
Unser Eigentumsanteil: [%], Investitionsdatum: [Datum], Letztes Board: [Datum]
Offene Maßnahmen des letzten Board: [Liste]
Schlüsselbedenken zum Adressieren: [Board-Level-Bedenken, falls vorhanden]
```

## Zu befolgende Konventionen

- Alle Pipeline-Deals durchlaufen Stadien: Sourcing → First-Meeting → Diligence → IC → Closed oder Passed
- Wenn ein Deal geschlossen wird, kopieren Sie das IC-Memo zu portfolio/<company>/memo.md und erstellen Sie den vollständigen Portfolio-Ordner
- Pass-Begründung wird immer in pipeline/passed/<company>/pass-rationale.md dokumentiert — screened Deals nie löschen
- Gründer-Updates werden in portfolio/<company>/updates/YYYY-MM-update.md gespeichert — eine Datei pro Monat
- KPIs werden appended (nie überschrieben) in portfolio/<company>/kpis.md — laufende Tabelle mit datierten Zeilen
- Reference-Check-Transkripte gehen in pipeline/diligence/<company>/reference-checks/ref-<name>.md
- Alle IC-Memos werden auch nach der IC-Abstimmung in memos/ic-memos/YYYY-MM-<company>.md eingereicht
- NAV-Tracker in lp/fund-performance/nav-tracker.md wird jeden Quartal aktualisiert, bevor der LP-Bericht gesendet wird
- Diligence-Tracker bleiben offen, bis das IC-Memo eingereicht wird — schließen Sie Punkte mit Datum und Ergebnis, nicht Löschung
```

## MCP-Server

```json
{
  "mcpServers": {
    "crunchbase": {
      "command": "npx",
      "args": ["-y", "@crunchbase/mcp-server"],
      "env": {
        "CRUNCHBASE_API_KEY": "your-crunchbase-api-key"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@slack/mcp-server"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-slack-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/investor-workspace"
      ]
    },
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"ic-memo.md\"; then echo \"[hook] IC-Memo geschrieben — Kopieren Sie vor dem IC-Call zu memos/ic-memos/ mit YYYY-MM-<company>-Benennung einreichen\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"pass-rationale.md\"; then echo \"[hook] Pass-Memo gespeichert — bestätigen Sie, dass der Deal von pipeline/diligence/ oder pipeline/first-meeting/ zu pipeline/passed/ verschoben wird\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'DOM=$(date +%d); if [ \"$DOM\" = \"01\" ]; then echo \"[reminder] Erster des Monats — aktualisieren Sie Portfolio-KPI-Protokolle (portfolio/<company>/kpis.md) und bereiten Sie Portfolio-Update-Erzählungen für Board-Sichtbarkeit vor\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

```bash
# Core-Investor-Skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/dcf-model
npx claudient add skill finance/comps-analysis

# Unterstützende Finance- und Research-Skills
npx claudient add skill finance/lp-reporting
npx claudient add skill finance/cap-table-analysis
npx claudient add skill finance/reference-check-synthesizer
npx claudient add skill finance/market-sizing
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Installieren Sie alle Finance-Skills auf einmal
npx claudient add skills finance
```

## Verwandt

- [Investor-Leitfaden](../guides/for-investor.md)
- [Deal-Flow-Workflow](../workflows/deal-flow.md)
- [IC-Memo-Workflow](../workflows/ic-memo-process.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
