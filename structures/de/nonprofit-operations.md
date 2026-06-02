# Nonprofit-Organisationsbetrieb — Projektstruktur

> Für eine gemeinnützige Organisation, die Programme, Fundraising, Spenderbeziehungen, Antragschreiben und Compliance verwaltet – Optimierung des gesamten Zyklus von der Prospekt-Recherche und Antragsstellung bis zur Programmausführung, Spenderbetreuung und IRS 990-Berichterstattung.

## Stack

- **Salesforce Nonprofit Success Pack (NPSP)** — Spender-CRM, Geschenktracking, Beziehungsmanagement, Kampagnenberichterstattung
- **Bloomerang** — Alternative Spender-CRM; Retention-Scoring, inaktive Spender-Segmentierung, Engagement-Timeline
- **Mailchimp** oder **Constant Contact** — E-Mail-Newsletter, Spender-Segmentierungskampagnen, Veranstaltungseinladungen, automatisierte Betreuungssequenzen
- **QuickBooks Nonprofit** — Fondsrechnung, eingeschränkte/uneingeschränkte Einnahmen-Verfolgung, Zuschussausgaben-Berichterstattung, 990-Vorbereitung Exporte
- **Google Workspace** (Gmail, Docs, Drive, Sheets, Calendar) — interne Kommunikation, Vorstandsdokumente, gemeinsamer Dateispeicher
- **Canva** — Wirkungsberichte, Social-Media-Grafiken, Antrag-Titelseiten, Veranstaltungsmaterialien, Jahresbericht-Design
- **Zoom** — Vorstandssitzungen, Spender-Schulungsereignisse, Programmausführung (virtuell), Personal-Vollversammlungen
- **DonorSearch** oder **iWave** — Prospekt-Recherche, Vermögens-Screening, philanthropisches Kapazitäts-Scoring, Affinitätsbewertungen
- **Submittable** oder **Fluxx** — Antrag-Einreicher und Verwaltungsportal für Zuschüsse
- **Claude Code** — Antrag-Narrative-Entwurf, Spender-Bestätigungsschreiben, Vorstandsberichte-Redaktion, Wirkungsgeschichte-Generierung, 990-Vorbereitung Unterstützung

## Verzeichnisbaum

```
nonprofit-operations/
├── .claude/
│   ├── CLAUDE.md                                    # Workspace-Anweisungen — Spender-Vertraulichkeit, Antrag-Fristen, 990-Termine
│   ├── settings.json                                # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── grant-narrative.md                       # /grant-narrative — Antrag-Propositions-Abschnitt aus Funder Brief und Programmdaten entwerfen
│       ├── donor-acknowledgment.md                  # /donor-acknowledgment — IRS-konformes Spender-Bestätigungsschreiben erstellen
│       ├── impact-story.md                          # /impact-story — Wirkungsgeschichte der Teilnehmer aus Mitarbeiter-Interviewnotizen schreiben
│       ├── board-report.md                          # /board-report — monatlichen/vierteljährlichen Vorstandsbericht aus Programm- und Finanzdaten zusammenstellen
│       ├── prospect-profile.md                      # /prospect-profile — großes Geschenk-Prospekt-Profil aus Recherche-Inputs synthetisieren
│       ├── grant-report.md                          # /grant-report — Funder-Fortschritts- oder Abschlussbericht aus Programm-Ergebnisdaten entwerfen
│       └── donor-segment.md                         # /donor-segment — segmentierte Spenden- oder Betreuungsmitteilung für Spender-Stufe generieren
├── programs/
│   ├── README.md                                    # Programme-Übersicht — Liste aktiver Programme, Direktoren, Geschäftsjahre
│   ├── youth-workforce-development/                 # Beispiel-Programm-Ordner — ein Ordner pro aktives Programm
│   │   ├── logic-model.md                           # Theorie der Veränderung: Eingaben, Aktivitäten, Ausgaben, Ergebnisse, Auswirkungen
│   │   ├── activities.md                            # Aktivitätskalender, Sitzungspläne, Lehrplan Übersicht, Moderator-Zuordnungen
│   │   ├── outcomes-tracking.md                     # Ergebnis-Indikatoren, Messmethoden, Datenerfassungsplan, Ziele vs. Ist-Zahlen
│   │   ├── participant-data-sop.md                  # SOP für Erfassung, Speicherung und Schutz von Teilnehmer-PII — Zustimmungsformulare, Salesforce-Eintrag, Aufbewahrungsplan
│   │   └── program-budget.md                        # Programm-Budget nach Ausgaben-Kategorie — verknüpft mit Zuschuss-Beschränkungen
│   ├── senior-food-assistance/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   ├── financial-literacy-education/
│   │   ├── logic-model.md
│   │   ├── activities.md
│   │   ├── outcomes-tracking.md
│   │   ├── participant-data-sop.md
│   │   └── program-budget.md
│   └── evaluation/
│       ├── evaluation-framework.md                  # organisations-weites Evaluierungskonzept — allgemeine Indikatoren, Datenstandards
│       ├── data-collection-tools.md                 # Umfrage-Vorlagen, Aufnahmeformulare, Vor-/Nach-Assessments — keine echten Teilnehmer-Daten
│       └── annual-outcomes-report-template.md       # Vorlage zum Zusammenstellen von Programm-übergreifenden Ergebnissen in Funder-Bericht
├── fundraising/
│   ├── donor-segments.md                            # Segment-Definitionen — Großspender ($10K+), mittlere Ebene ($1K–$9,999), Jahresfonds (<$1K), inaktiv, neu
│   ├── major-gift-prospects.md                      # Top 25 Großspender-Prospects — Kapazitäts-Bewertung, Affinität, Beziehungs-Inhaber, nächster Schritt, Anfrage-Betrag
│   ├── event-calendar.md                            # Fundraising-Veranstaltungskalender — Gala, Golf-Turnier, Giving Tuesday, Peer-to-Peer-Kampagnen
│   ├── annual-fund-plan.md                          # Jahresfonds-Strategie — Anfrage-Zeitplan, Kanal-Mix, Matching Gift Ziele, Beibehaltungs-Ziele
│   ├── planned-giving.md                            # Legacy-Gesellschafts-Programm — Testament-Sprache, Vermögensplanungs-Ressourcen, Mitglied-Betreuungsplan
│   ├── major-gifts/
│   │   ├── cultivation-moves-template.md            # Moves-Management-Vorlage — Erkennung, Kultivierung, Anfrage, Betreuungs-Schritte
│   │   ├── gift-agreement-template.md               # Großgeschenk-Vereinbarungs-Vorlage — Geschenk-Betrag, Zweck, Anerkennung, Berichtspflichten
│   │   ├── solicitation-letter-template.md          # Großgeschenk-Anfrage-Brief-Vorlage — Personalisierungsfelder, Case for Support Narrative
│   │   └── stewardship-calendar.md                  # jährlicher Kontaktkalender für Großspender — Anrufe, Ortsbesuche, Berichte, Anerkennung
│   ├── annual-fund/
│   │   ├── direct-mail-appeal-template.md           # Direktpost-Anfrage-Brief-Vorlage — Herbst-, Jahresende-, Frühjahrsversionen
│   │   ├── email-appeal-template.md                 # E-Mail-Anfrage-Vorlage — Betreffzeilen-Varianten, A/B-Test-Struktur
│   │   ├── matching-gift-tracker.md                 # Unternehmens-Matching-Geschenk-Möglichkeiten — Arbeitgeber, Matching-Verhältnis, Frist, Status
│   │   └── retention-report-template.md             # Spender-Beibehaltungs-Analyse-Vorlage — neu, beibehalten, inaktiv, reaktiviert nach Jahr
│   └── prospect-research/
│       ├── prospect-research-sop.md                 # SOP für DonorSearch/iWave Screening — wann ausführen, wie Ergebnisse in Salesforce/Bloomerang protokollieren
│       ├── wealth-screen-criteria.md                # Kapazitäts- und Affinitäts-Bewertungs-Kriterien — Immobilien, SEC-Anmeldungen, vorherige Spenden, philanthropische Geschichte
│       └── prospect-briefing-template.md            # Ein-Seiten-Prospekt-Briefing-Vorlage — Biografie, Spenden-Geschichte, Verbindungen, vorgeschlagene Anfrage
├── grants/
│   ├── grant-calendar.md                            # Master-Zuschuss-Fristenkalender — Funder, Betrag, Frist, zugewiesener Verfasser, Status, Bericht fällig
│   ├── funder-research/
│   │   ├── funder-research-sop.md                   # SOP für Recherche neuer Funder — 990-Analyse, Prioritäten, vorherige Begünstigte, Eignung-Bewertung
│   │   ├── funder-profiles/
│   │   │   ├── smith-family-foundation.md           # Funder-Profil: Prioritäten, Berechtigung, durchschnittliche Zuschussgröße, vorherige Zuschüsse an Org, Kontakt
│   │   │   ├── city-arts-council.md
│   │   │   └── federal-cdbg-program.md
│   │   └── prospect-funders.md                      # Funder unter Recherche — Name, Eignung-Bewertung, nächste Aktion, zugewiesener Mitarbeiter
│   ├── active-grants/
│   │   ├── README.md                                # Aktive Zuschuss-Bestandsaufnahme — Funder, Zuschussbetrag, Zeitraum, eingeschränkter Zweck, Berichts-Daten
│   │   ├── smith-family-foundation-fy2025/
│   │   │   ├── grant-agreement.md                   # Zuschussbetrag, Einschränkungen, Berichtspflichten, Kontaktinfo
│   │   │   ├── budget-narrative.md                  # Bewilligtes Budget mit Zeileneintrag-Narrative — entspricht QuickBooks Zuschuss-Code
│   │   │   ├── progress-report-q1.md                # Q1 narrative Fortschritts-Bericht — Aktivitäten, Ergebnisse, Ausgaben
│   │   │   └── final-report-draft.md                # Abschlussbericht-Entwurf — Narrative, Finanzen, gelernte Lektionen
│   │   └── federal-workforce-grant-fy2025/
│   │       ├── grant-agreement.md
│   │       ├── budget-narrative.md
│   │       ├── subrecipient-monitoring-log.md       # Unterempfänger-Überwachungs-Protokoll — Ortsbesuche, Schreibtisch-Überprüfungen, Erkenntnisse (erforderlich für Bundes-Zuschüsse)
│   │       └── sam-registration-renewal.md          # SAM.gov Registrierungs-Verlängerung Prüfliste und Ablaufdatum
│   ├── reporting-templates/
│   │   ├── progress-report-template.md              # Standard zwischenbericht Fortschritts-Bericht — Aktivitäten, Ausgaben, Ergebnisse, Finanz-Zusammenfassung
│   │   ├── final-report-template.md                 # Abschlusszuschuss-Bericht — Narrative, Ergebnisse vs. Ziele, Finanz-Buchhaltung, Lektionen
│   │   └── budget-variance-report-template.md       # Budget vs. Ist Varianz-Erklärung-Vorlage für Funder
│   └── past-applications/
│       ├── README.md                                 # Index vergangener Anträge — Funder, Jahr, Ergebnis, wiederverwendbare Narrative-Abschnitte
│       ├── youth-workforce-development-narrative.md  # Wiederverwendbare Programm-Narrative für Jugendbeschäftigungs-Zuschuss-Anträge
│       └── organizational-capacity-narrative.md     # Wiederverwendbare Organisationskapazitäts- und Erfolgsbilanz-Abschnitte
├── communications/
│   ├── social-calendar.md                           # Social-Media-Inhaltskalender — Plattform, Post-Datum, Inhalts-Thema, Kampagne, Grafik-Asset
│   ├── annual-report.md                             # Jahresbericht-Übersicht und Produktions-Prüfliste — Inhalts-Abschnitte, Canva-Vorlage, Verteilungsplan
│   ├── newsletter-templates/
│   │   ├── monthly-newsletter-template.md           # Monatlicher Spender-Newsletter — Abschnitte: Wirkungsgeschichte, Programm-Update, zukünftige Ereignisse, Anfrage
│   │   ├── event-invitation-template.md             # Veranstaltungs-Einladungs-E-Mail — Betreffzeile, RSVP-Link-Platzhalter, Logistik
│   │   └── year-end-appeal-email-series.md          # Jahresende-Anfrage-E-Mail-Serie — 4-E-Mail-Sequenz mit Betreffzeilen, Timing, CTAs
│   └── impact-stories/
│       ├── impact-story-sop.md                      # SOP für Erfassung, Überprüfung und Veröffentlichung von Teilnehmer-Geschichten — Zustimmung erforderlich, Datenschutz-Richtlinien
│       ├── story-interview-guide.md                 # Mitarbeiter-Leitfaden für Teilnehmer-Geschichten-Interviews — offene Fragen, Freigabe-Formular
│       └── published-stories/
│           ├── 2025-maria-workforce-story.md        # Veröffentlichte Wirkungsgeschichte — anonymisiert oder zugestimmt, Programm-Ergebnis illustriert
│           └── 2025-james-food-assistance-story.md
├── finance/
│   ├── budget-template.md                           # Jahres-Betriebsbudget-Vorlage — nach Programm, eingeschränkt vs. uneingeschränkt, vorherige Jahr-Ist-Zahlen
│   ├── 990-prep-checklist.md                        # IRS Form 990 Vorbereitung Prüfliste — Fristen, erforderliche Zeitpläne, Daten aus QuickBooks ziehen
│   ├── audit-prep.md                                # Jahres-Audit-Vorbereitung Prüfliste — Dokumentenanforderungen, Bankabstimmungen, Zuschuss-Abhebung Bestätigungen
│   ├── grant-expense-tracking.md                    # Zuschuss-Ausgaben-Verfolgung SOP — QuickBooks Zuschuss-Codes, Zuordnungen, eingeschränkte Fonds-Regeln
│   ├── fund-accounting-sop.md                       # Fonds-Buchhaltung SOP — eingeschränkt vs. uneingeschränkt, temporär eingeschränkte Freigabe, FASB ASC 958
│   └── financial-reports/
│       ├── monthly-financial-report-template.md     # Vorstandsfertiger monatlicher Finanzbericht — Budget vs. Ist, YTD, Narrative Zusammenfassung
│       └── grant-financial-report-template.md       # Funder Finanzbericht-Vorlage — Ausgaben nach Budget-Zeile, verbleibender Saldo
├── board/
│   ├── board-roster.md                              # Vorstandsmitglieder-Roster — Name, Amtszeit, Ausschuss, Kontakt, Arbeitgeber, Spender-Status
│   ├── meeting-agendas/
│   │   ├── agenda-template.md                       # Standard-Vorstandssitzungs-Tagesordnung-Vorlage — Zustimmungs-Tagesordnung, Ausschuss-Berichte, Aktionspunkte
│   │   ├── 2025-01-board-agenda.md
│   │   ├── 2025-03-board-agenda.md
│   │   └── 2025-06-board-agenda.md
│   ├── resolutions/
│   │   ├── resolution-template.md                   # Vorstandsbeschluss-Vorlage — WHEREAS/RESOLVED Format, Abstimmungs-Aufzeichnung
│   │   ├── 2025-01-banking-resolution.md
│   │   └── 2025-03-executive-compensation-resolution.md
│   └── committee-charters/
│       ├── finance-committee-charter.md             # Finanz-Ausschuss-Geltungsbereich, Mitgliedschaft, Sitzungs-Kadenz, Verantwortlichkeiten
│       ├── executive-committee-charter.md
│       ├── fundraising-committee-charter.md
│       └── program-committee-charter.md
└── compliance/
    ├── state-registration-tracker.md               # Gemeinnützige Spendensammlung Registrierung nach Bundesstaat — Ablaufdaten, Gebühren, registrierter Agent
    ├── conflict-of-interest-log.md                 # Jährliche Interessenskonflikts-Offenlegung-Protokoll — Vorstand und Schlüsselpersonal, pro IRS 990 Schedule L
    ├── document-retention-policy.md                # IRS-konforme Dokumentenaufbewahrungs-Zeitplan — Kategorien, Aufbewahrungszeiträume, Vernichtungs-Protokoll
    ├── whistleblower-policy.md                     # Hinweisgeber und Anti-Vergeltungs-Richtlinie — erforderlich für 990 Part VI Offenlegung
    └── 990-schedule-checklist/
        ├── schedule-a-checklist.md                 # Öffentliche Unterstützungs-Test — 509(a)(1) oder (a)(2) Berechnung Prüfliste
        ├── schedule-b-checklist.md                 # Schedule B Beitragszahler — Schwelle, Anonymisierungs-Regeln, Staatsoffenlegung-Anforderungen
        ├── schedule-d-checklist.md                 # Schedule D Ergänzungs-Finanzberichte — Stiftung, eingeschränkte Fonds
        └── schedule-o-checklist.md                 # Schedule O Ergänz-Informationen — Governance-Richtlinien, Entschädigungs-Erklärung
```

## Wichtigste Dateien erklärt

| Pfad | Zweck |
|---|---|
| `grants/grant-calendar.md` | Master-Zuschuss-Fristenkalender, der alle aktiven und Pipeline-Funder abdeckt — die wichtigste Datei für Zuschuss-Operationen; enthält Funder-Namen, Zuschussbetrag, Antrag-Frist, zugewiesener Verfasser, Einreichungs-Status und Berichts-Fälligkeitsdaten |
| `.claude/commands/grant-narrative.md` | Slash-Befehl, der einen Zuschuss-Propositions-Abschnitt (Bedarfs-Aussage, Programmbeschreibung, Evaluationsplan oder Nachhaltigkeit) aus einer Funder-Anleitung und Programm-Ergebnisdaten entwirft — reduziert Erst-Entwurfs-Zeit von 4+ Stunden auf unter 30 Minuten |
| `fundraising/major-gift-prospects.md` | Top 25 Großspender-Prospects-Liste mit DonorSearch/iWave Kapazitäts-Bewertungen, Beziehungs-Inhaber, letztes Kontakt-Datum, nächster Kultivierungs-Schritt und angestrebter Anfrage-Betrag — wird als vertraulich behandelt; niemals außerhalb der Organisation geteilt |
| `finance/990-prep-checklist.md` | IRS Form 990 Vorbereitung Prüfliste mit Einreichungs-Frist (4,5 Monate nach Geschäftsjahr-Ende oder 11/15 für Kalender-Jahr-Einreicher), erforderliche Zeitpläne nach Org-Profil, auszuführende QuickBooks-Berichte und CPA-Übergabe-Prüfliste |
| `grants/active-grants/README.md` | Bestandsaufnahme aller aktiven Zuschüsse mit Funder, Zuschussbetrag, Zuschuss-Zeitraum, eingeschränktem Zweck, QuickBooks-Zuschuss-Code und zukünftigen Berichts-Daten — verwendet in monatlichen Finanz- und Vorstandsberichten |
| `programs/[program]/participant-data-sop.md` | Pro-Programm SOP für Erfassung und Schutz von Teilnehmer-persönlich identifizierbaren Informationen (PII) — definiert Zustimmungs-Anforderungen, Salesforce-Dateneintrag-Verfahren, Zugriffs-Kontrollen und Aufbewahrungs-/Vernichtungs-Zeitplan |
| `board/board-roster.md` | Aktueller Vorstandsmitglieder-Roster mit Amtszeit-Ablauf, Ausschuss-Zuordnungen, jährlichem Spender-Status und Arbeitgeber für Matching-Geschenk-Screening — aktualisiert nach jeder Vorstandssitzung |
| `fundraising/prospect-research/prospect-briefing-template.md` | Ein-Seiten-Großspender-Prospekt-Briefing-Vorlage aus DonorSearch/iWave gefüllt — Biografie, philanthropische Geschichte, Verbindung zur Organisation, vorgeschlagener Anfrage-Bereich und Kultivierungs-Strategie |
| `communications/impact-stories/impact-story-sop.md` | Regelt Erfassung und Veröffentlichung von Teilnehmer-Geschichten — Zustimmungs-Formular-Anforderungen, Anonymisierungs-Regeln, Genehmigungsarbeitsablauf und Canva-Asset-Produktions-Schritte |
| `compliance/state-registration-tracker.md` | Gemeinnützige Spendensammlung Registrierungs-Tracker für alle Bundesstaaten, in denen die Organisation spendet — Ablaufdaten, Verlängerungs-Gebühren, registrierter Agent Kontakte und jährliche Einreichungs-Fristen |

## Schnelles Gerüst

```bash
# Workspace-Wurzel erstellen
mkdir -p nonprofit-operations

# .claude-Struktur erstellen
mkdir -p nonprofit-operations/.claude/commands

# Programme-Verzeichnisse erstellen
mkdir -p nonprofit-operations/programs/youth-workforce-development
mkdir -p nonprofit-operations/programs/senior-food-assistance
mkdir -p nonprofit-operations/programs/financial-literacy-education
mkdir -p nonprofit-operations/programs/evaluation

# Fundraising-Verzeichnisse erstellen
mkdir -p nonprofit-operations/fundraising/major-gifts
mkdir -p nonprofit-operations/fundraising/annual-fund
mkdir -p nonprofit-operations/fundraising/prospect-research

# Zuschuss-Verzeichnisse erstellen
mkdir -p nonprofit-operations/grants/funder-research/funder-profiles
mkdir -p nonprofit-operations/grants/active-grants
mkdir -p nonprofit-operations/grants/reporting-templates
mkdir -p nonprofit-operations/grants/past-applications

# Kommunikations-Verzeichnisse erstellen
mkdir -p nonprofit-operations/communications/newsletter-templates
mkdir -p nonprofit-operations/communications/impact-stories/published-stories

# Finanz-Verzeichnisse erstellen
mkdir -p nonprofit-operations/finance/financial-reports

# Vorstandsverzeichnisse erstellen
mkdir -p nonprofit-operations/board/meeting-agendas
mkdir -p nonprofit-operations/board/resolutions
mkdir -p nonprofit-operations/board/committee-charters

# Compliance-Verzeichnisse erstellen
mkdir -p nonprofit-operations/compliance/990-schedule-checklist

# Zuschuss-Kalender mit Spalten-Überschriften säen
cat > nonprofit-operations/grants/grant-calendar.md << 'EOF'
# Grant Deadline Calendar

**Updated:** [date]
**Owner:** [Grants Manager name]

| Funder | Program | Amount | Application Deadline | Assigned Writer | Status | Report Due |
|---|---|---|---|---|---|---|
| Smith Family Foundation | Youth Workforce | $50,000 | 2025-09-15 | [name] | Drafting | 2026-06-30 |
| City Arts Council | Financial Literacy | $15,000 | 2025-10-01 | [name] | Research | 2026-03-31 |

## Upcoming (next 90 days)
- [auto-populate from table above filtered by deadline]

## Report Due (next 90 days)
- [auto-populate from table above filtered by report due date]
EOF

# Aktive Zuschüsse README säen
cat > nonprofit-operations/grants/active-grants/README.md << 'EOF'
# Active Grants Inventory

| Funder | Award Amount | Grant Period | Restricted Purpose | QuickBooks Grant Code | Next Report Due |
|---|---|---|---|---|---|
| Smith Family Foundation | $50,000 | 7/1/2025–6/30/2026 | Youth workforce stipends and staffing | GR-2025-001 | 2026-01-15 |

**Rule:** Each active grant must have its own subfolder named [funder-kebab-case]-[fiscal-year].
Subfolder must contain: grant-agreement.md, budget-narrative.md, and one file per progress/final report.
EOF

# Spender-Vertraulichkeits-Richtlinien README säen
cat > nonprofit-operations/fundraising/prospect-research/prospect-research-sop.md << 'EOF'
# Prospect Research SOP

## Confidentiality policy
Prospect research data (DonorSearch ratings, iWave scores, wealth estimates) is strictly confidential.
- Do NOT share prospect profiles outside the development department without VP approval
- Do NOT store prospect data in shared Google Drive folders accessible to program staff or volunteers
- Salesforce/Bloomerang prospect records are accessible to development staff only — check role permissions quarterly
- Printed prospect briefings must be collected and shredded after board or committee meetings

## When to run a screen
- New board member prospects before nomination committee vote
- Major gift prospects with cumulative giving $5,000+
- Event attendees before personal outreach at $10,000+ capacity events
- Planned giving society inquiries

## Process
1. Export name and address list from Salesforce/Bloomerang in CSV format
2. Upload to DonorSearch batch screening portal (Settings > Batch Upload)
3. Allow 24–48 hours for results
4. Download results and import ratings back into Salesforce using the DonorSearch integration or manual field update
5. Log screening date in the prospect record
6. Flag top-rated prospects (DS Rating 5+) to Major Gifts Officer for briefing preparation
EOF

# Nonprofit-Skills installieren
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report
```

## CLAUDE.md-Vorlage

```markdown
# Nonprofit-Organisationsbetrieb — Claude Code Anweisungen

## Was das ist

Dies ist das Arbeitsverzeichnis für eine gemeinnützige Organisation, die Programme, Fundraising, Spenderbeziehungen, Antragschreiben und Berichterstattung sowie Vorstandsleitung und IRS-Compliance verwaltet.

SPENDER-VERTRAULICHKEITS-REGEL: Spender-Datensätze, Spenden-Beträge, Prospekt-Recherch-Daten (DonorSearch/iWave-Bewertungen, Vermögensschätzungen, Kapazitäts-Scores) und beabsichtigte Vermächtnisse sind streng vertraulich. Nehmen Sie keine spezifischen Spender-Namen, Geschenk-Beträge oder Prospekt-Bewertungen in Dateien auf, auf die Freiwillige, Praktikanten oder Programmitarbeiter zugreifen könnten. Entwicklungs-sensitive Dateien befinden sich unter fundraising/major-gift-prospects.md und fundraising/prospect-research/ — behandeln Sie diese als eingeschränkt.

TEILNEHMER-DATENSCHUTZ-REGEL: Programmteilnehmer-Namen, Kontaktinformationen, demografische Daten und Ergebnis-Aufzeichnungen sind persönlich identifizierbare Informationen (PII). Diese Daten befinden sich in Salesforce NPSP oder der Programmdatenbank — nicht in diesem Arbeitsbereich. Vorlagen verwenden nur in eckige Klammern gesetzte Platzhalter.

## Stack

- Salesforce Nonprofit Success Pack (NPSP) — Spender-CRM; alle Spender-Datensätze und Spenden-Geschichte befinden sich hier
- Bloomerang — Alternative CRM bei Bedarf; Retention-Scoring, Engagement-Timeline, inaktive Spender-Berichte
- Mailchimp / Constant Contact — E-Mail-Kampagnen, Newsletter-Versand, Veranstaltungseinladungen, Anfrage-Sequenzen
- QuickBooks Nonprofit — Fonds-Buchhaltung; Zuschuss-Ausgaben-Codes, eingeschränkte Fonds-Verfolgung, 990-Vorbereitung Exporte
- Google Workspace — Docs, Drive, Sheets, Calendar für interne Zusammenarbeit und Dokumentspeicherung
- Canva — Jahresbericht-Design, Wirkungsgeschichte-Grafiken, Social-Media-Assets, Antrag-Titelseiten
- Zoom — Vorstandssitzungen, Spender-Kultivierungs-Veranstaltungen, virtuelle Programmausführung
- DonorSearch / iWave — Prospekt-Vermögens-Screening und philanthropische Kapazitäts-Bewertungen (nur Entwicklungs-Team)
- Submittable / Fluxx — Antrag-Einreichungs-Portal für Stiftungs- und Regierungsfunder

## Zuschuss-Fristenkalender

Siehe grants/grant-calendar.md — dies ist die einzige zuverlässige Informationsquelle für alle Zuschuss-Fristen.
Überprüfen und aktualisieren Sie diese Datei jeden Montagmorgen. Wenn eine neue Zuschuss-Gelegenheit bestätigt wird:
1. Fügen Sie eine Zeile zu grant-calendar.md mit Funder, Betrag, Frist, zugewiesenem Verfasser und Berichts-Fälligkeitsdatum hinzu
2. Erstellen Sie einen Unterordner unter grants/active-grants/ mit der Benennung [funder-kebab-case]-[fiscal-year]
3. Fügen Sie den Zuschuss zu grants/active-grants/README.md mit dem QuickBooks-Zuschuss-Code hinzu
4. Blockieren Sie das Einreichungs-Deadline in Google Calendar 30 Tage und 7 Tage im Voraus

Hauptfristen:
- IRS Form 990: fällig 4,5 Monate nach Geschäftsjahr-Ende (Kalender-Jahr = 15. Mai; mit Verlängerung = 15. November)
- Staatliche gemeinnützige Spendensammlung Registrierungen: siehe compliance/state-registration-tracker.md
- Jahres-Audit: typischerweise 3–4 Monate nach Geschäftsjahr-Ende — siehe finance/audit-prep.md

## 990-Vorbereitungs-Zeitplan

- Monat 1 nach Geschäftsjahr-Ende: QuickBooks-Berichte ausführen; alle Zuschuss-Codes abstimmen; eingeschränkte Fonds-Salden bestätigen
- Monat 2: finance/990-prep-checklist.md fertigstellen; Schedule A öffentliche Unterstützungs-Daten sammeln; Interessenskonflikts-Offenlegungen protokollieren
- Monat 3: QuickBooks-Daten-Paket und unterstützende Dokumente für Prüfer/CPA bereitstellen
- Monat 4 (oder Monat 10 mit Verlängerung): Form 990 einreichen; auf GuideStar/Candid innerhalb von 30 Tagen nach Einreichung veröffentlichen

## Häufige Aufgaben und genaue Befehle

### Antrag-Propositions-Abschnitt entwerfen
```
/grant-narrative

Funder: [foundation name]
Section: [need statement / program description / evaluation plan / sustainability / organization capacity]
Program: [program name]
Funder priorities: [paste from funder guidelines or profile in grants/funder-research/funder-profiles/]
Outcomes data: [paste relevant outcome metrics from programs/[program]/outcomes-tracking.md]
Word limit: [number]
```

### Spender-Bestätigungsschreiben erstellen
```
/donor-acknowledgment

Gift type: [cash / stock / in-kind / matching gift / planned gift notification]
Gift amount: $[amount] (leave blank for non-cash gifts without appraisal)
Fund/purpose: [unrestricted / [program name] restricted]
Donor type: [individual / couple / foundation / corporate]
IRS language required: [yes — no goods or services provided / yes — event ticket value was $X]
Personalization notes: [any special context — e.g., memorial gift, first-time donor, board member]
```

### Funder-Fortschritts- oder Abschlussbericht schreiben
```
/grant-report

Funder: [foundation name]
Report type: [interim / final]
Grant period: [dates]
Approved purpose: [paste from grants/active-grants/[folder]/grant-agreement.md]
Activities completed: [paste from programs/[program]/activities.md]
Outcomes achieved vs. targets: [paste from programs/[program]/outcomes-tracking.md]
Budget summary: [expenditures vs. approved budget — from QuickBooks grant expense report]
Word limit: [number]
```

### Großspender-Prospekt-Profil erstellen
```
/prospect-profile

Prospect name: [name]
DonorSearch rating: [1–10] / iWave score: [RFM or capacity estimate]
Prior giving to org: [amounts and years — from Salesforce/Bloomerang]
Employment: [employer, title]
Board or community connections: [known relationships to board members or staff]
Philanthropic interests: [known giving to other organizations — from 990 data or DonorSearch]
Suggested ask range: [$X–$Y]
```

### Wirkungsgeschichte aus Mitarbeiter-Interviewnotizen entwerfen
```
/impact-story

Program: [program name]
Story source: [paste staff interview notes or key quotes — use participant first name or pseudonym only]
Consent status: [signed release on file / anonymized — no identifying details]
Outcomes to highlight: [which program outcomes does this story illustrate]
Intended use: [annual report / newsletter / grant application / social media]
Target word count: [150–300 / 300–500 / 500–800]
```

### Vorstandsbericht zusammenstellen
```
/board-report

Report period: [month or quarter]
Program updates: [paste highlights from program directors — activities, outcomes, enrollment]
Financial summary: [paste budget vs. actual from QuickBooks monthly report]
Fundraising update: [YTD raised vs. goal, major gifts closed, upcoming events]
Grant pipeline: [paste from grants/grant-calendar.md]
Action items needed: [decisions or votes required at this meeting]
```

### Spender-Segmentierungs-Meldung erstellen
```
/donor-segment

Segment: [major donors $10K+ / mid-level $1K–$9,999 / annual fund / lapsed 13–24 months / new donors]
Message type: [year-end appeal / spring campaign / event invitation / impact update / stewardship]
Campaign theme: [brief description of the campaign narrative]
Specific ask: [gift amount suggestion, upgrade amount, or event RSVP]
```

## Zu befolgenden Konventionen

- Zuschuss-Kalender (grants/grant-calendar.md) wird jeden Montag aktualisiert; niemals eine Frist versäumen ohne 30-Tage-Warnung
- Jeder aktive Zuschuss hat einen Unterordner unter grants/active-grants/ benannt [funder-kebab-case]-[fiscal-year]
- QuickBooks Zuschuss-Codes folgen dem Format GR-[YYYY]-[###] — sequenziell jedes Geschäftsjahr zuweisen
- Spender-Bestätigungsschreiben müssen IRS 501(c)(3)-Sprache enthalten: keine Waren oder Dienstleistungen wurden im Austausch bereitgestellt (oder geben Sie den angemessenen Zeitwert jedes empfangenen Vorteils an)
- Wirkungsgeschichten erfordern ein unterzeichnetes Teilnehmer-Freigabe-Formular vor der Veröffentlichung — verweisen Sie auf die Datei in communications/impact-stories/impact-story-sop.md
- Vorstandssitzungs-Unterlagen werden mindestens 5 Tage vor jeder Sitzung in den Vorstandsordner von Google Drive hochgeladen
- Prospekt-Recherch-Briefings sind mit VERTRAULICH gekennzeichnet und nicht in gemeinsamen Laufwerken gespeichert, auf die nicht-Entwicklungspersonal zugeben kann
- Neue Funder-Profile gehen in grants/funder-research/funder-profiles/ unter Verwendung der Benennung [funder-kebab-case].md
- 990-Vorbereitung beginnt in Monat 1 nach Geschäftsjahr-Ende — siehe finance/990-prep-checklist.md für den vollständigen Zeitplan
```

## MCP-Server

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-google-drive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-google-oauth-client-id",
        "GOOGLE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GOOGLE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@salesforce/mcp-server"],
      "env": {
        "SF_LOGIN_URL": "https://login.salesforce.com",
        "SF_USERNAME": "your-salesforce-username",
        "SF_PASSWORD": "your-salesforce-password",
        "SF_SECURITY_TOKEN": "your-salesforce-security-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/nonprofit-operations"
      ]
    },
    "mailchimp": {
      "command": "npx",
      "args": ["-y", "@mailchimp/mcp-server"],
      "env": {
        "MAILCHIMP_API_KEY": "your-mailchimp-api-key",
        "MAILCHIMP_SERVER_PREFIX": "us1"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/grant-calendar\"; then echo \"[grants] grant-calendar.md updated — verify all deadlines have Google Calendar events 30 days and 7 days out\"; fi'"
          },
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -q \"grants/active-grants\"; then echo \"[grants] Active grant file updated — confirm the QuickBooks grant code in grants/active-grants/README.md matches finance/grant-expense-tracking.md\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'python3 -c \"\nimport datetime, re\ntry:\n    with open(\\\"grants/grant-calendar.md\\\") as f:\n        content = f.read()\n    today = datetime.date.today()\n    lines = content.split(\\\"\\\\n\\\")\n    warnings = []\n    for line in lines:\n        dates = re.findall(r\\\"(\\\\d{4}-\\\\d{2}-\\\\d{2})\\\", line)\n        for d in dates:\n            delta = (datetime.date.fromisoformat(d) - today).days\n            if 0 < delta <= 30:\n                warnings.append(f\\\"DEADLINE IN {delta} DAYS: {line.strip()}\\\")\n    if warnings:\n        print(\\\"[grant-deadline-alert] \\\" + \\\"\\\\n\\\".join(warnings))\nexcept:\n    pass\n\" 2>/dev/null'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if echo \"$FILE\" | grep -qE \"fundraising/major-gift-prospects|prospect-research\"; then echo \"[confidentiality] Writing to a donor-confidential file. Confirm this file is not in a Google Drive folder shared with volunteers or program staff before proceeding.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

```bash
# Grant writing and reporting
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/investor-update
npx claudient add skill productivity/process-mapper
npx claudient add skill data-ml/stakeholder-report

# Donor communications and fundraising
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill productivity/lesson-planner

# Board and governance
npx claudient add skill productivity/engineering-strategy
npx claudient add skill productivity/doc-site-builder

# Program management and outcomes
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill productivity/interview-scorecard
```

## Verwandt

- [Nonprofit Operations guide](../guides/for-nonprofit-operations.md)
- [Grant writing workflow](../workflows/grant-writing-workflow.md)
- [Donor stewardship workflow](../workflows/donor-stewardship-workflow.md)
- [IRS 990 preparation workflow](../workflows/990-prep-workflow.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
