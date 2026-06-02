# Anwaltskanzlei / Juristische Praxisoperationen — Projektstruktur

> Für Anwälte und Mitarbeiter einer kleinen bis mittleren Anwaltskanzlei, die Mandanteneingänge, juristische Recherche, Dokumentenerstellung, Abrechnung, Mandantenkommunikation, Fristen-Tracking und Compliance verwalten — mit anwaltlicher Verschwiegenheit auf allen Ebenen durchgesetzt.

## Stack

- **Clio** — Mandatsmanagement, Kontaktdatenbank, Zeitterfassung, Abrechnung, Treuhandrechnung, Mandantenportal
- **Westlaw** oder **LexisNexis** — Primäre juristische Recherche, Fallrechtabfrage, Auslegung von Gesetzen, KeyCite/Shepard's Überprüfung von Zitaten
- **Microsoft 365** — Word (Dokumentenerstellung, Textmarkerarbeiten), Outlook (Mandanten-/Gegenseite-Kommunikation), Teams (interne Zusammenarbeit)
- **NetDocuments** oder **iManage** — Dokumentenmanagementsystem (DMS); alle Mandatsakten und privilegierte Dokumente befinden sich ausschließlich hier
- **DocuSign** — eSignatur-Routing für unterzeichnete Vereinbarungen, Mandatsschreiben, Vergleichsdokumente
- **QuickBooks** — Kanzleibuchhaltung, Betriebskonto-Abstimmung, Verbindlichkeiten, Gehaltsverwaltung
- **Claude Code** — Dokumentenerstellung, Recherche-Memo-Vorlagen, Checklistengenerierung, Dokumentation von Abrechnungsverfahren, Automatisierung nicht-privilegierter Workflows

## Verzeichnisstruktur

```
legal-firm-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Verschwiegenheitsmitteilungen, Stack, Befehle, Konventionen
│   ├── settings.json                              # MCP-Server, Hooks, Tool-Berechtigungen
│   └── commands/
│       ├── matter-intake.md                       # /matter-intake — Checkliste für neuen Mandanteneintritt und Interessenkonflikt-Suchprompt generieren
│       ├── research-memo.md                       # /research-memo — Juristische Recherche-Memo mit IRAC-Struktur Grundlagen
│       ├── draft-contract.md                      # /draft-contract [type] — Vertragsentwurf aus Mandatstyp + Schlüsselbegriffe
│       ├── redline-review.md                      # /redline-review — Fehlende Klauseln, einseitige Bedingungen, Risikobestimmungen kennzeichnen
│       ├── billing-entry.md                       # /billing-entry — Notizen in ABA-Task-Code-konforme Zeiteintragungen konvertieren
│       ├── deadline-check.md                      # /deadline-check — Fristen und Aktenfristen aus Notizen anzeigen
│       ├── cite-check.md                          # /cite-check — Fälle kennzeichnen, die KeyCite oder Shepard's Überprüfung benötigen
│       └── client-update.md                       # /client-update — Mandatenzustandsmitteilungsschreiben (keine privilegierten Fakten im Prompt)
├── templates/
│   ├── contracts/
│   │   ├── nda-mutual.docx                        # Gegenseitige NDA — bilaterale Vertraulichkeit, Standard 2-Jahres-Laufzeit
│   │   ├── nda-one-way.docx                       # Einseitige NDA — offenbarender Partei bevorzugt
│   │   ├── services-agreement.docx                # Master-Service-Vereinbarung mit SOW-Anlage
│   │   ├── independent-contractor.docx            # Unabhängiger Auftragnehmer-Vereinbarung mit IP-Abtretung und Non-Solicitation
│   │   ├── asset-purchase.docx                    # Vermögenserwerbsvereinbarung mit Zeitplan-Platzhalter
│   │   └── settlement-agreement.docx              # Vergleichs- und Verzichtsvereinbarung — allgemeine und ADEA-konforme Versionen
│   ├── litigation-docs/
│   │   ├── complaint-template.docx                # Bundeszivilbeschwerde — Kopfzeile, Zuständigkeit, Ansprüche, Antragsgebet
│   │   ├── answer-template.docx                   # Gegenantrag mit affirmativ Einwänden
│   │   ├── motion-to-dismiss.docx                 # 12(b)(6) Antragsvorlage — Argumentationsabschnitte beschriftet
│   │   ├── summary-judgment-motion.docx           # MSJ mit Aufstellung unbestrittener Fakten Format
│   │   ├── discovery-requests/
│   │   │   ├── interrogatories-plaintiff.docx     # Standard-Fragen des Klägers, 25 Dokumentanfragen
│   │   │   ├── interrogatories-defendant.docx     # Standard-Fragen des Beklagten
│   │   │   ├── rfp-plaintiff.docx                 # Dokumentanfragen — Kläger-Satz
│   │   │   └── rfp-defendant.docx                 # Dokumentanfragen — Beklagter-Satz
│   │   └── deposition-notice.docx                 # Vernehmungsmitteilung mit Duces Tecum Anlage
│   ├── corporate/
│   │   ├── articles-of-incorporation.docx         # Delaware C-Corp-Gründungsurkunde Vorlage
│   │   ├── bylaws-corporation.docx                # Unternehmensstatuten — Standardbestimmungen
│   │   ├── llc-operating-agreement.docx           # Varianten für Einzelmitglied und Multi-Mitglied LLC
│   │   ├── board-consent.docx                     # Schriftliche Zustimmung anstelle eines Meetings — Vorstandsbeschluss
│   │   ├── shareholder-consent.docx               # Schriftliche Zustimmung — Aktionärsbeschluss
│   │   └── stock-purchase-agreement.docx          # Series Seed / Angel Round SPA mit Gewährleistungen
│   ├── employment/
│   │   ├── offer-letter-exempt.docx               # FLSA-befreites Angebot mit freier Beschäftigung Klausel
│   │   ├── offer-letter-nonexempt.docx            # Nicht-befreites Angebot mit Überzeitmitteilung
│   │   ├── separation-agreement.docx              # Abfindungs- und Verzichtsvereinbarung — 21-Tage-Überlegungsfrist
│   │   ├── noncompete-agreement.docx              # Bundesgerichts-spezifische Konkurrenzvereinbarung (Gerichtsbarkeit kennzeichnen)
│   │   └── employee-handbook-shell.docx           # Richtlinienabschnitte: PTO, Belästigung, Verhaltenskodex
│   └── real-estate/
│       ├── purchase-agreement-residential.docx    # Wohnimmobilien-Kaufvertrag mit Bedingungsabsätzen
│       ├── purchase-agreement-commercial.docx     # Gewerbliche PSA mit Due-Diligence-Periode
│       ├── lease-commercial.docx                  # NNN-Gewerbemietvertrag — Vermieter-bevorzugt
│       ├── lease-residential.docx                 # Wohnmietvertrag — Gerichtsbarkeit-unabhängige Vorlage
│       └── closing-checklist.docx                 # Immobilienabschluss-Checkliste mit Titel-/Treuhand-Schritten
├── research/
│   ├── memo-template.md                           # IRAC-Memo-Format: Problem, Rechtsregel, Analyse, Schlussfolgerung
│   ├── case-law-notes/
│   │   ├── _index.md                              # Laufende Fallrechtindexierung nach Thema
│   │   ├── contracts/                             # Vertragsrecht-Fallzusammenfassungen und Rechtssätze
│   │   ├── employment/                            # Arbeitsrecht-Fallnotizen
│   │   ├── corporate/                             # Unternehmensführungs-Fallrecht
│   │   └── litigation/                            # Prozess- und Beweis-Fallnotizen
│   └── regulatory-summaries/
│       ├── state-noncompete-map.md                # Staatliche Durchsetzbarkeitstabelle (Aktualisierungsdatum erforderlich)
│       ├── data-privacy-overview.md               # CCPA, Datenschutzlandschaft der Staaten — keine Mandantenenangaben
│       └── bar-admission-rules.md                 # Pro Hac Vice-Anforderungen nach Gerichtsbarkeit
├── checklists/
│   ├── matter-opening.md                          # Neue Sache: Interessenkonfliktprüfung, Mandatsschreiben, Honorar, Clio-Setup
│   ├── conflicts-check.md                         # Schritt-für-Schritt Interessenkonfliktsuche über Clio + Laterale Neueinstellungs-Offenbarungen
│   ├── due-diligence.md                           # M&A / Transaktions-Due-Diligence — Organisatorisch, IP, Rechtsstreit, Verträge
│   ├── closing.md                                 # Transaktionsabschluss-Checkliste — vor Abschluss, Abschlusstag, nach Abschluss
│   ├── litigation-hold.md                         # Rechtsstreit-Aufbewahrungsmitteilungsschritte und Dokumentkonservierungsanforderungen
│   └── matter-closing.md                          # Aktenschluss: endgültige Abrechnung, unterzeichnete Dokumente zum DMS, Aufbewahrungsmitteilung
├── billing/
│   ├── time-entry-sops.md                         # ABA-Task-Codes, UTBMS-Codes, Erzählung-Richtlinien, Mindestschritte
│   ├── invoice-review-checklist.md                # Pre-Bill-Überprüfung: Abschreibungen, Tarifprüfung, Erzählung-Qualität, Treuhand
│   ├── rate-schedule.md                           # Zeitmacher-Sätze nach Rolle (Partner, Anwalt, Rechtshilfe, Praktikant)
│   └── trust-accounting-quick-ref.md              # IOLTA Einzahlungs-/Auszahlungsregeln, Drei-Wege-Abstimmungserinnerung
├── compliance/
│   ├── bar-requirements.md                        # CLE-Credits, jährliche Registrierungsfristen nach Gerichtsbarkeit
│   ├── trust-accounting-sop.md                    # Vollständiger IOLTA-SOP: Einzahlungsregeln, Auszahlung, Abstimmung, Audit-Trail
│   ├── malpractice-checklist.md                   # Mandatsumfang, Fristen-Einträge, Interessenskonflikte, Aufbewahrung
│   ├── conflicts-policy.md                        # Firmenpolitik zu Interessenskonflikten: Lateral, Prospektiver Mandant, Imputed Disqualifikation
│   └── data-security-policy.md                    # Passwort-Richtlinie, DMS-Zugriffskontrolle, Verstöße-Reaktionsschritte
└── marketing/
    ├── bio-templates.md                           # Anwalts-Bio-Format: Bildung, Anwaltskammerzulassung, Praktikabereiche, Veröffentlichungen
    ├── practice-area-descriptions.md              # Web-bereite Praktikabereiche-Blurbs — Überprüfung auf Werberecht-Konformität
    └── client-alert-template.md                  # Legislative/Regulatorische Update-Benachrichtigungsformat zur Mandantenverteilung
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/CLAUDE.md` | Verschwiegenheitsmitteilung, Stack-Übersicht, Befehlsindex, Vertraulichkeitsregeln — vor jeder Sitzung lesen |
| `.claude/commands/matter-intake.md` | Generiert die vollständige Checkliste für neuen Mandanteneintritt: Interessenkonflikt-Suchschritte, Mandatsschreiben-Trigger, Clio-Setup, Honorareinzug |
| `.claude/commands/billing-entry.md` | Konvertiert rohe Zeitnotizen zu ABA-Task-Code-konformen Erzählungen; erzwingt Kanzlei-Mindestschritte und Erzählungs-Qualitätsregeln |
| `checklists/matter-opening.md` | Autoritative Schritt-für-Schritt-Sache-Öffnungsprozedur — Interessenskonflikte, Mandatsschreiben, Honorar, DMS-Ordner-Erstellung |
| `checklists/conflicts-check.md` | Strukturiertes Interessenkonflikt-Suchprotokoll abdecken Clio-Datenbank, Gegner, laterale Neueinstellungs-Screening |
| `billing/time-entry-sops.md` | UTBMS/ABA-Task-Codes, Mindest-Abrechnungsschritte, Erzählungs-Dos und Dont's — der Abrechnungs-Stilguide |
| `compliance/trust-accounting-sop.md` | Vollständiger IOLTA-SOP: Was in Treuhand geht, Auszahlungskontrollen, Drei-Wege-Abstimmung, Anwaltsbarr-Audit-Bereitschaft |
| `research/memo-template.md` | IRAC-strukturierte juristische Recherche-Memo-Vorlage — erzwingt Zitat-Überprüfungs-Erinnerung vor Abschluss |
| `templates/litigation-docs/complaint-template.docx` | Bundeszivilbeschwerde-Vorlage mit Kopfzeile, Zuständigkeitsangaben, Anspruchsgrundlagen und Antragsgebet |
| `compliance/malpractice-checklist.md` | Pre-Sache und laufende Kunstfehlerhaftungsrisiko-Kontrollen: Umfang-Dokumentation, Fristen-Eintragung, Interessenskonflikte Erneuerung, Aufbewahrung |

## Schnelle Gerüst

```bash
# Arbeitsplatzwurzel erstellen
mkdir -p legal-firm-workspace && cd legal-firm-workspace

# .claude Verzeichnis und Befehle
mkdir -p .claude/commands

# Vorlagen nach Mandatstyp
mkdir -p templates/contracts
mkdir -p templates/litigation-docs/discovery-requests
mkdir -p templates/corporate
mkdir -p templates/employment
mkdir -p templates/real-estate

# Recherche
mkdir -p research/case-law-notes/contracts
mkdir -p research/case-law-notes/employment
mkdir -p research/case-law-notes/corporate
mkdir -p research/case-law-notes/litigation
mkdir -p research/regulatory-summaries

# Checklisten
mkdir -p checklists

# Abrechnung
mkdir -p billing

# Compliance
mkdir -p compliance

# Marketing
mkdir -p marketing

# Schlüssel-Markdown-Dateien Grundgerüst
touch checklists/matter-opening.md
touch checklists/conflicts-check.md
touch checklists/due-diligence.md
touch checklists/closing.md
touch checklists/litigation-hold.md
touch checklists/matter-closing.md

touch billing/time-entry-sops.md
touch billing/invoice-review-checklist.md
touch billing/rate-schedule.md
touch billing/trust-accounting-quick-ref.md

touch compliance/bar-requirements.md
touch compliance/trust-accounting-sop.md
touch compliance/malpractice-checklist.md
touch compliance/conflicts-policy.md
touch compliance/data-security-policy.md

touch research/memo-template.md
touch research/case-law-notes/_index.md
touch research/regulatory-summaries/state-noncompete-map.md
touch research/regulatory-summaries/data-privacy-overview.md
touch research/regulatory-summaries/bar-admission-rules.md

touch marketing/bio-templates.md
touch marketing/practice-area-descriptions.md
touch marketing/client-alert-template.md

# .claude Befehle
touch .claude/commands/matter-intake.md
touch .claude/commands/research-memo.md
touch .claude/commands/draft-contract.md
touch .claude/commands/redline-review.md
touch .claude/commands/billing-entry.md
touch .claude/commands/deadline-check.md
touch .claude/commands/cite-check.md
touch .claude/commands/client-update.md

# Relevante Claudient-Skills installieren
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

echo "Gerüst abgeschlossen. CLAUDE.md vor Erstgebrauch ausfüllen."
```

## CLAUDE.md Vorlage

```markdown
# Anwaltskanzlei / Juristische Praxisoperationen — Arbeitsplatz

## ANWALTLICHER VERSCHWIEGENHEIT UND VERTRAULICHKEITSMITTEILUNG

**Dieser Arbeitsplatz enthält KEINE Mandatenfakten, Fallfakten oder privilegierte Mitteilungen.**

Alle Mandatsakten, Mandantendokumente, Korrespondenz, juristische Recherche-Memos gebunden an aktive Mandate
und alle Inhalte geschützt durch anwaltliche Verschwiegenheit oder Arbeitsproduktdoktrin sind gespeichert
ausschließlich im Dokumentenmanagementsystem (DMS) der Kanzlei:
- NetDocuments: https://vault.netdocuments.com
- iManage: https://app.imanage.com

KEINE Mandantennamen, an echte Fälle gebundene Mandatsnummern, Gegnerische Parteinamen, Fallfakten,
Vergleichssummen oder privilegierte Inhalte in Claude Code Prompts einfügen. Dieser Arbeitsplatz
ist ausschließlich für Vorlagen, SOPs, Checklisten und nicht-Mandaten-spezifischen Inhalt.

Im Zweifelsfall: Wenn es auf einem Privileg-Log erscheinen würde, gehört es nicht hier.

---

## Was dieser Arbeitsplatz ist

Ein nicht-privilegierter Arbeitsplatz für die Kanzlei. Anwälte und Mitarbeiter verwenden diesen zum:
- Entwurf und Wartung von Dokumentvorlagen (Verträge, Prozessformularshell, Unternehmensformulare)
- Ausführung von Abrechnungs- und Zeiteintragungs-Workflows mit ABA-Task-Codes
- Verwaltung von Compliance-Fristen (CLE, IOLTA-Abstimmung, Kunstfehlerhaftungs-Checkliste)
- Erstellung von juristische Recherche-Memo-Gerüsten (IRAC-Struktur, Zitat-Überprüfungs-Erinnerungen)
- Wartung von Kanzlei-Marketing-Inhalte (Bios, Praktikabereiche-Beschreibungen)

Alle Befehle funktionieren auf Vorlagen und SOPs — niemals auf Live-Mandatendaten.

---

## Stack

- **Clio** — Mandatsmanagement, Zeitterfassung, Abrechnung, Treuhandrechnung, Mandantenportal
- **Westlaw / LexisNexis** — Juristische Recherche; alle zitierten Fälle müssen KeyCite oder Shepardize vor Gebrauch
- **Microsoft 365** — Word (Entwurf/Textmarkerarbeiten), Outlook (Mandanten-Kommunikation), Teams (intern)
- **NetDocuments / iManage** — DMS; alle privilegierten Mandatsakten hier gespeichert
- **DocuSign** — Ausführte Vereinbarungs-Routing und Speicherung
- **QuickBooks** — Kanzlei-Betriebskonto, Gehaltsverwaltung, AP

---

## Schrägstrich-Befehle

| Befehl | Was er tut |
|---|---|
| `/matter-intake` | Generiert Checkliste für neuen Mandanteneintritt: Interessenskonflikte, Mandatsschreiben, Honorar, Clio-Setup |
| `/research-memo` | Gerüste IRAC-Memo mit Zitat-Überprüfungs-Erinnerung und Quellenplatzhalter |
| `/draft-contract [type]` | Vertragsentwurf aus Typ (NDA, MSA, OA, PSA) + Schlüsselbegriffe |
| `/redline-review` | Überprüfung eingefügter Vertragsprache auf fehlende Klauseln und einseitige Bedingungen |
| `/billing-entry` | Konvertiert rohe Zeitnotizen zu ABA/UTBMS-konformen Erzählungseinträgen |
| `/deadline-check` | Anzeige von Fristen, Reaktion Fristen und Aktendaten aus Notizen |
| `/cite-check` | Kennzeichnungen von Fällen in einer Memo die KeyCite oder Shepard's Überprüfung benötigen |
| `/client-update` | Entwürfe eines Mandaten-Zustandsmitteilungsschreibens — keine privilegierten Mandatenfakten im Prompt |

---

## Zitat-Überprüfungs-Anforderung

Alle jede juristische Recherche-Memo oder Abschnitte einer Beschwerde produziert von Claude Code ist ein ENTWURF ERSTER VERSUCH nur.
Alle Fallfallzitate müssen in Westlaw KeyCite oder LexisNexis Shepard's überprüft werden vor
das Dokument die Kanzlei verlässt. Claude Code hat keinen Live-Zugang zu Fallrecht-Datenbanken
und kann nicht bestätigen ob ein Fall aufgehoben, unterschieden oder begrenzt wurde.

Fügen Sie diese Fußzeile zu allen Recherche-Ausgaben hinzu: "ENTWURF — ALLE ZITATE BENÖTIGEN KEYCITE/SHEPARD'S ÜBERPRÜFUNG VOR GEBRAUCH"

---

## Abrechnungs-Konventionen

- Mindest-Abrechnungsschritte: 0,1 Stunden (6 Minuten)
- UTBMS Task-Codes verwenden: L100–L500 für Prozessuale; A100–A300 für Unternehmens-/Transaktional
- Zeiteintrag-Erzählungen müssen die ausgeführte Arbeit beschreiben, nicht nur die Task-Kategorie
- Treuhand-Konto-Einträge benötigen Mandatsnummer und Mandanten-Autorisierungs-Referenz
- Pre-Bill-Überprüfung: Führen Sie `/billing-entry` Ausgabe durch invoice-review-checklist.md vor dem Versenden durch

---

## Interessenkonflikt-Überprüfungs-Protokoll

Vor Öffnung jeder neuen Sache führen Sie eine Interessenkonflikt-Überprüfung durch gegen:
1. Clio Kontaktdatenbank (Mandantenname, Gegner, verbundene Entitäten)
2. Laterale Neueinstellungs-Offenbarungsliste (verwaltet durch Büro-Manager)
3. Prospektive Mandanten-Eintragsprotokoll

Dokumentieren Sie das Interessenkonflikt-Überprüfungsergebnis in Clio vor dem Versand des Mandatsschreibens.
Siehe checklists/conflicts-check.md für die vollständige Prozedur.

---

## Aufbewahrung und Sache-Schluss

Geschlossene Mandatsakten werden pro Aufbewahrungsplan der Kanzlei aufbewahrt (siehe compliance/malpractice-checklist.md).
Physische und elektronische Akten verschieben sich zu dem DMS-Archiv-Ordner auf Sache-Schluss.
Speichern Sie keine geschlossenen Mandatendokumente in diesem Arbeitsplatz.
```

## MCP-Server

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/Users/shared/legal-firm-workspace"],
      "comment": "Auf Arbeitsplatzwurzel beschränkt nur — kein Zugang zu DMS Bereitstellungspunkten oder Mandantendateifreigaben"
    },
    "microsoft-365": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-msgraph"],
      "env": {
        "TENANT_ID": "${M365_TENANT_ID}",
        "CLIENT_ID": "${M365_CLIENT_ID}",
        "CLIENT_SECRET": "${M365_CLIENT_SECRET}"
      },
      "comment": "Zugang zu Teams-Kanälen, Outlook-Entwürfen, SharePoint-Vorlagen-Bibliothek — auf Firmenmandant beschränkt"
    },
    "clio": {
      "command": "npx",
      "args": ["-y", "@clio/mcp-server"],
      "env": {
        "CLIO_CLIENT_ID": "${CLIO_CLIENT_ID}",
        "CLIO_CLIENT_SECRET": "${CLIO_CLIENT_SECRET}",
        "CLIO_REGION": "us"
      },
      "comment": "Schreibgeschützter Zugang zu Mandatsliste, Kontaktdatenbank und Zeiteintragungs-Codes — kein Schreibzugriff auf Treuhandkonten"
    },
    "docusign": {
      "command": "npx",
      "args": ["-y", "@docusign/mcp-server"],
      "env": {
        "DOCUSIGN_ACCOUNT_ID": "${DOCUSIGN_ACCOUNT_ID}",
        "DOCUSIGN_INTEGRATION_KEY": "${DOCUSIGN_INTEGRATION_KEY}",
        "DOCUSIGN_BASE_URL": "https://na3.docusign.net/restapi"
      },
      "comment": "Umschlag-Status-Abfrage und Vorlage-Abruf nur — keine Sende-Funktion von Claude Code"
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
            "command": "grep -i 'privilege\\|confidential\\|attorney.client\\|work product' \"$CLAUDE_TOOL_OUTPUT_PATH\" && echo '[WARN] Möglicher privilegierter Inhalt in geschriebener Datei erkannt — Überprüfung vor dem Speichern' || true",
            "comment": "Scanne alle von Claude Code geschriebenen Dateien auf Verschwiegenheitsschlüsselwörter und zeige eine Warnung an"
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
            "command": "echo '[CHECK] Schreiben an: '\"$CLAUDE_TOOL_INPUT_PATH\"' — Bestätigen Sie, dass dies eine Vorlage oder SOP-Datei ist, keine Mandatendatei'",
            "comment": "Protokolliere alle Datei-Schreibvorgänge mit einer Erinnerung, um zu bestätigen, dass es nicht-privilegierter Inhalt ist"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[REMINDER] Sitzungsende — alle erstellte Recherche-Memos benötigen Zitat-Überprüfung in Westlaw KeyCite oder LexisNexis Shepards vor Gebrauch'",
            "comment": "Zeige die Zitat-Überprüfungs-Erinnerung am Ende jeder Claude Code Sitzung an"
          }
        ]
      }
    ]
  }
}
```

## Skills zu installieren

```bash
# Dokument- und Prozess-Workflows
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

# Recherche und Analyse
npx claudient add skill productivity/exec-briefing

# Mandanten- und Geschäftsentwicklung
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/investor-update

# Abrechnung und Zeitmanagement
npx claudient add skill productivity/engineering-strategy
```

## Verknüpft

- [Legal & Compliance Workspace Führer](../structures/legal-compliance-workspace.md)
- [Operations Manager Arbeitsplatz](../structures/operations-manager-workspace.md)
- [Finance Analyst Arbeitsplatz](../structures/finance-analyst-workspace.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
