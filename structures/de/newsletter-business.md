# Newsletter Business — Projektstruktur

> Für einen Creator oder ein Medienunternehmen, das einen Newsletter betreibt — Verwaltung von Ausgabenschreiben, redaktioneller Planung, Sponsoring-Deals, Listenwachstum und Leistungsanalyse in einem einzigen Claude Code-Arbeitsbereich.

## Stack

- **ESP + Publishing:** Beehiiv (bevorzugt für Monetarisierung), Substack (Creator-freundlich) oder ConvertKit (Automation-fokussiert)
- **Social-Distribution:** Typefully (Twitter/X Thread-Planung, Analytics) oder Hypefury (Auto-Retweet, immergrüne Warteschlangen)
- **Redaktionelle Planung:** Notion (Content-Calendar-Datenbank, Ideen-Backlog, Pipeline-Ansichten)
- **Visuals:** Canva (Ausgabenkopfbilder, Sponsor-Banner, Social Cards — 1200x630px und 1080x1080px)
- **Sponsoring-Abrechnung:** Sponsy (Buchung, Rechnungsstellung, Ad-Copy-Workflow) oder Stripe (manuelle Rechnungsstellung über Stripe Invoices)
- **Analytics:** Google Analytics 4 (Web-/Archiv-Traffic), Beehiiv/Substack-native Analytics (Öffnungsrate, CTR, Abonnentenwachstum)
- **Kommunikation:** Slack (redaktionelle Warnungen, Sponsor-Kommunikation, Growth-Experiments-Kanal)
- **Claude Code-Skills:** productivity/newsletter-writer, productivity/stakeholder-comms, data-ml/stakeholder-report, productivity/vendor-evaluator

## Verzeichnisbaum

```
newsletter-business/
├── .claude/
│   ├── CLAUDE.md                              # Arbeitsbereich-Anweisungen für Claude Code
│   ├── settings.json                          # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── write-issue.md                     # /write-issue — Komplette Ausgabe aus Thema + Gliederung verfassen
│       ├── edit-issue.md                      # /edit-issue — Korrekturlesen, straffen, Stilhandbuch anwenden
│       ├── sponsorship-brief.md               # /sponsorship-brief — Ad-Copy aus Sponsor-Intake generieren
│       ├── growth-experiment.md               # /growth-experiment — A/B-Test für Akquisitionskanal konzipieren
│       ├── performance-report.md              # /performance-report — Wöchentliche Öffnungs-/CTR-/Wachstums-Metriken abrufen
│       ├── social-promo.md                    # /social-promo — Twitter/X + LinkedIn Promo für Ausgabe generieren
│       └── list-health-check.md               # /list-health-check — Churn-Signale kennzeichnen, Re-Engagement-Trigger auslösen
├── issues/
│   ├── _template/
│   │   ├── draft.md                           # Leerer Ausgabenentwurf (vor jeder Ausgabe kopieren)
│   │   └── performance-metrics.md             # Leerer Metriken-Blatt (nach 7/30/60 Tagen ausfüllen)
│   ├── 2026-06-02-issue-001/
│   │   ├── draft.md                           # Arbeitsentwurf — in Bearbeitung
│   │   ├── final.md                           # Gesperrte Kopie, die an ESP gesendet wurde
│   │   └── performance-metrics.md             # Öffnungsrate, CTR, Antworten, Abmeldungen — nach dem Versand ausgefüllt
│   ├── 2026-05-26-issue-000/
│   │   ├── draft.md
│   │   ├── final.md
│   │   └── performance-metrics.md             # Historische Metriken zum Benchmarking
│   └── 2026-05-19-issue-999/
│       ├── draft.md
│       ├── final.md
│       └── performance-metrics.md
├── editorial/
│   ├── content-calendar.md                    # Monatlicher Ausgabenplan: Datum, Thema, Sponsor-Slot, Status
│   ├── idea-backlog.md                        # Laufende Liste von Story-Ideen mit Quelle und Priorität
│   ├── topic-clusters.md                      # Wiederkehrende Themen und deren Zuordnung zu Ausgaben
│   └── style-guide.md                         # Stimme, Ton, verbotene Phrasen, Formatierungsregeln
├── sponsorships/
│   ├── media-kit.md                           # Publikumsstatistiken, Preisliste, Ad-Format-Spezifikationen — an Sponsoren senden
│   ├── sponsor-tracker.md                     # Pipeline: Interessent, verhandelnd, bestätigt, in Rechnung gestellt, bezahlt
│   ├── ad-copy-templates.md                   # Wiederverwendbare Ad-Copy-Strukturen (primär, sekundär, klassifiziert)
│   └── invoice-log.md                         # Ausgestellte Rechnungen: Sponsor, Betrag, Ausgabedatum, Bezahldatum
├── growth/
│   ├── referral-program.md                    # Beehiiv/SparkLoop Referral-Regeln, Stufen, Reward-Erfüllung
│   ├── acquisition-channels.md                # Kanalaufschlüsselung: organisch, Cross-Promos, bezahlt, SEO-Archiv
│   └── experiment-log.md                      # A/B-Tests: Hypothese, Variante, Ergebnis, Entscheidung
├── templates/
│   ├── issue-format.md                        # Standard-Ausgabenskelett (Hook, Body-Abschnitte, Sponsor-Slot, CTA)
│   ├── welcome-email.md                       # Automatisierte Willkommenssequenz — Ausgaben 1 und 2
│   ├── re-engagement.md                       # Win-Back-E-Mail für 90-Tage-Inaktive
│   └── social-promo.md                        # Twitter/X Thread-Vorlage + LinkedIn Post-Vorlage
└── analytics/
    ├── weekly-dashboard.md                    # Wöchentliche Momentaufnahme: Abonnenten, Öffnungsrate, CTR, Einnahmen
    └── cohort-benchmarks.md                   # Subscriber-Kohortenaufbewahrung bei 30/60/90/180 Tagen
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `issues/<date-slug>/draft.md` | Arbeitskopie für jede Ausgabe — hier geschrieben, hier bearbeitet, dann vor dem Planen in ESP zu final.md gesperrt |
| `issues/<date-slug>/final.md` | Unveränderliche Kopie nach dem Versand — nach dem Versand nie bearbeitet; verwendet für Archivierung und Wiederverwendung |
| `issues/<date-slug>/performance-metrics.md` | Öffnungsrate, CTR, Top-Links, Abmeldungen, Antworten — gefüllt bei 7, 30 und 60 Tagen nach dem Versand |
| `editorial/content-calendar.md` | Single Source of Truth für kommende Ausgaben: Veröffentlichungsdatum, Thema, Sponsor-Slot bestätigt oder offen, Entwurfsstatus |
| `editorial/style-guide.md` | Sprach- und Formatierungsregeln, die von Claude bei jeder Bearbeitung durchgesetzt werden — Satzlängenbeschränkungen, verbotene Füllphrasen, Abschnittsreihenfolge |
| `sponsorships/sponsor-tracker.md` | Vollständige Sponsoring-Pipeline von Interessent bis bezahlt; jede Zeile ist ein Deal mit Ausgabe-Slot, Satz, Copy-Frist und Zahlungsstatus |
| `sponsorships/media-kit.md` | Publikumsgröße, Öffnungsrate, Demografie, Ad-Format-Spezifikationen und Preisgestaltung — das Dokument, das an eingehende und ausgehende Sponsor-Interessenten gesendet wird |
| `analytics/weekly-dashboard.md` | Rollende wöchentliche Tabelle mit Schlüsselmetriken — verwendet als Kontext, wenn Claude Performance-Reports oder Wachstumsempfehlungen schreibt |

## Schnelles Gerüst

```bash
# Arbeitsbereich-Root erstellen
mkdir -p newsletter-business && cd newsletter-business

# Claude Code-Verzeichnisse
mkdir -p .claude/commands

# Ausgabeverzeichnisse — Vorlage + zwei aktuelle Ausgaben
mkdir -p issues/_template
mkdir -p issues/2026-06-02-issue-001
mkdir -p issues/2026-05-26-issue-000

# Editorial
mkdir -p editorial

# Sponsorships
mkdir -p sponsorships

# Growth
mkdir -p growth

# Templates
mkdir -p templates

# Analytics
mkdir -p analytics

# Seed Template-Dateien
touch issues/_template/draft.md
touch issues/_template/performance-metrics.md

# Seed Editorial-Dateien
touch editorial/content-calendar.md
touch editorial/idea-backlog.md
touch editorial/topic-clusters.md
touch editorial/style-guide.md

# Seed Sponsoring-Dateien
touch sponsorships/media-kit.md
touch sponsorships/sponsor-tracker.md
touch sponsorships/ad-copy-templates.md
touch sponsorships/invoice-log.md

# Seed Growth-Dateien
touch growth/referral-program.md
touch growth/acquisition-channels.md
touch growth/experiment-log.md

# Seed Template-Dateien
touch templates/issue-format.md
touch templates/welcome-email.md
touch templates/re-engagement.md
touch templates/social-promo.md

# Seed Analytics-Dateien
touch analytics/weekly-dashboard.md
touch analytics/cohort-benchmarks.md

# Claude Code-Konfiguration initialisieren
touch .claude/CLAUDE.md
touch .claude/settings.json

# Skills installieren
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper

# Slash Commands installieren
npx claudient add command write-issue
npx claudient add command edit-issue
npx claudient add command sponsorship-brief
npx claudient add command growth-experiment
npx claudient add command performance-report
npx claudient add command social-promo
npx claudient add command list-health-check

echo "Newsletter Business-Arbeitsbereich ist bereit."
```

## CLAUDE.md-Vorlage

```markdown
# Newsletter Business — Claude-Anweisungen

## Was das ist

Dieser Arbeitsbereich verwaltet eine Newsletter-Publikation von Ende zu Ende: Ausgabenschreiben und -bearbeitung,
redaktionelle Planung, Sponsoring-Verkauf und -Erfüllung, Listenwachstums-Experimente und
Leistungsanalyse. Der Newsletter wird in einem festen Rhythmus veröffentlicht (wöchentlich oder zweiwöchentlich).
Alle Inhalte sind für ein spezifisches Nischen-Publikum geschrieben — siehe editorial/style-guide.md.

## Stack

- ESP + Publishing: Beehiiv (primär) — Ausgaben werden hier entworfen und in Beehiiv geplant
- Social-Distribution: Typefully — Twitter/X Threads und LinkedIn-Posts nach dem Versand geplant
- Redaktionelle Planung: Notion (kanonischer redaktioneller Kalender, gespiegelt zu editorial/content-calendar.md)
- Visuals: Canva — Kopfbilder bei 1200x630px, Sponsor-Banner bei 600x200px
- Sponsoring-Abrechnung: Sponsy (Buchung und Rechnungsstellung) + Stripe (Zahlungsverarbeitung)
- Analytics: Beehiiv-native Analytics + Google Analytics 4 (Archiv-Seiten-Traffic)
- Kommunikation: Slack #newsletter-ops für Versendwarnungen und Sponsor-Bestätigungen

## Verzeichniskonventionen

- issues/<YYYY-MM-DD-issue-NNN>/ — ein Verzeichnis pro Ausgabe; immer Date-Slug-Benennung verwenden
- issues/<slug>/draft.md — aktive Arbeitskopie; bearbeitet bis zum Versendtag
- issues/<slug>/final.md — gesperrte Kopie; genau das einfügen, das an ESP gesendet wurde
- issues/<slug>/performance-metrics.md — ausfüllen bei 7, 30 und 60 Tagen nach dem Versand
- editorial/ — Planungsdokumente; content-calendar.md ist die Source of Truth für den Zeitplan
- sponsorships/ — alle Sponsor-bezogenen Dateien; sponsor-tracker.md ist die Pipeline-Source of Truth
- growth/ — Experiments-Log und Kanalverfolgung; eine Zeile pro Experiment in experiment-log.md
- analytics/ — Aggregat-Dashboards; weekly-dashboard.md jeden Montag aktualisiert

## Ausgabenschreib-Workflow

1. Editorial/content-calendar.md nach der nächsten geplanten Ausgabe überprüfen
2. Verzeichnis issues/<YYYY-MM-DD-issue-NNN>/ erstellen; issues/_template/draft.md hinein kopieren
3. /write-issue topic="[topic]" audience="[reader persona]" sponsor="[sponsor name or none]" ausführen
4. draft.md überprüfen; /edit-issue draft=issues/<slug>/draft.md ausführen, um zu straffen und Stilprüfung durchzuführen
5. sponsorships/sponsor-tracker.md überprüfen — wenn ein Sponsor für diesen Slot bestätigt ist, /sponsorship-brief sponsor="[name]" product="[product]" cta="[URL]" words=75 ausführen
6. Finale Ad-Copy in draft.md am designierten Sponsor-Slot einfügen
7. Finale Copy überprüfen; zu issues/<slug>/final.md kopieren; in Beehiiv planen
8. Editorial/content-calendar.md Status auf „geplant" aktualisieren
9. Nach Versand: /social-promo source=issues/<slug>/final.md ausführen; in Typefully planen
10. Nach 7 Tagen: issues/<slug>/performance-metrics.md aus Beehiiv-Analytics-Dashboard ausfüllen
11. Nach 30 Tagen: analytics/weekly-dashboard.md mit Kohortenaufbewahrungsdaten aktualisieren

## Sponsoring-Rhythmus

- Sponsor-Pipeline lebt in sponsorships/sponsor-tracker.md — nach jedem Sponsor-Kontakt aktualisieren
- Ad-Copy-Frist beträgt 5 Geschäftstage vor Versendatum — mit Sponsoren durchsetzen
- Alle neuen Ad-Copy-Entwürfe durchlaufen /sponsorship-brief, bevor sie zur Genehmigung an den Sponsor gesendet werden
- Sobald der Sponsor die Copy genehmigt, „copy approved" in sponsor-tracker.md markieren
- Rechnung über Sponsy unmittelbar nach dem Versand; in sponsorships/invoice-log.md protokollieren
- Unbezahlte Rechnungen nach 14 Tagen verfolgen; nach 30 Tagen eskalieren

## Listengesundheitsüberwachung

- /list-health-check wöchentlich ausführen — liest analytics/weekly-dashboard.md und kennzeichnet:
    - Öffnungsrate-Abfall >3pp Woche gegenüber Woche (Lieferbarkeits- oder Content-Signal)
    - Abmelderate >0,3% bei einer einzelnen Ausgabe (Content-/Publikums-Fit-Signal)
    - Netto-Abonnentenwachstum unter wöchentlichem Ziel (Akquisitions-Signal)
- Wenn 90-Tage-Inaktive-Kohorte 15% der Liste überschreitet: Re-Engagement-Sequenz auslösen
  (templates/re-engagement.md als Basis verwenden; /edit-issue zum Personalisieren ausführen)
- Segmentdaten leben in Beehiiv — mit analytics/cohort-benchmarks.md überprüfen

## Häufige Aufgaben — exakte Befehle

**Einen neuen Ausgabenentwurf schreiben:**
/write-issue topic="[topic]" audience="[persona]" sponsor="[name or none]" length=800

**Einen Entwurf bearbeiten und Stilprüfung durchführen:**
/edit-issue draft=issues/[slug]/draft.md style=editorial/style-guide.md

**Sponsor-Ad-Copy generieren:**
/sponsorship-brief sponsor="[company]" product="[product description]" cta="[URL]" words=75

**Social-Promotion-Posts generieren:**
/social-promo source=issues/[slug]/final.md channels="twitter,linkedin"

**Wöchentlicher Performance-Report:**
/performance-report dashboard=analytics/weekly-dashboard.md period=7d

**Ein Growth-Experiment konzipieren:**
/growth-experiment channel="[channel]" hypothesis="[hypothesis]" log=growth/experiment-log.md

**Listengesundheitsprüfung:**
/list-health-check dashboard=analytics/weekly-dashboard.md benchmarks=analytics/cohort-benchmarks.md

## Stilkonventionen (aus editorial/style-guide.md)

- Betreffzeilen: max. 9 Wörter, kein Clickbait, Thema vorne positionieren
- Erster Satz: max. 20 Wörter, Punkt sofort darlegen
- Absätze: max. 4 Sätze; niemals Fülleröffner verwenden („In dieser Ausgabe...")
- Sponsor-Slots: klar begrenzt, ehrliche Offenlegung („Diese Ausgabe wird gesponsert von...")
- CTAs: ein primärer CTA pro Ausgabe; nach dem Haupttext platzieren, vor dem Abschluss
- Ton: direkt, informiert, gesprächig — keine Corporate-Absicherung, keine Ausrufezeichen
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
        "/Users/${USER}/newsletter-business"
      ]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
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
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */issues/*/draft.md ]]; then echo \"[hook] Draft gespeichert — /edit-issue ausführen, um das Stilhandbuch vor der Finalisierung anzuwenden\"; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == */issues/*/final.md ]]; then echo \"[hook] Schreiben zu final.md — bestätigen, dass dies die genaue Kopie ist, die zu Beehiiv/Substack gesendet wurde, bevor Sie sie sperren\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" 2>/dev/null || exit 0; UNFILLED=$(find issues/ -name \"performance-metrics.md\" -empty 2>/dev/null | grep -v _template | wc -l | tr -d \" \"); [ \"$UNFILLED\" -gt 0 ] && echo \"[reminder] $UNFILLED Ausgabe(n) haben leere performance-metrics.md — aus Beehiiv-Analytics ausfüllen\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

```bash
npx claudient add skill productivity/newsletter-writer
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/founder-weekly-review
```

## Verwandt

- [Leitfaden: Claude für Content Creator](../guides/for-content-creator.md)
- [Workflow: Issue Production End-to-End](../workflows/newsletter-issue-production.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
