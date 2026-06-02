# Legal & Compliance Workspace — Projektstruktur

> Für in-house Counsel oder Compliance-Beauftragten, die Vertragsüberprüfung, regulatorisches Tracking, GDPR-/Datenschutzcompliance, Vendor Due Diligence und Policy-Erstellung über Clio, Ironclad, Westlaw, DocuSign und Microsoft 365 verwalten.

## Stack

- **Clio** oder **Ironclad** — Matter-Verwaltung, Contract Lifecycle, Redline-Tracking, Signatur-Routing
- **Westlaw** oder **LexisNexis** — Primäre juristische Recherche, Case Law Retrieval, regulatorische Orientierungen
- **DocuSign** — eSignature Routing, Envelope-Tracking, ausgeführte Vereinbarungsspeicherung
- **Microsoft 365** — Word (Redlines), Outlook (externe Rechtsanwälte), Teams (Legal Channel), SharePoint (Dokumentverwaltung)
- **Notion** — Policy-Dokumentation, Compliance-Kalender, internes Jura-Wiki
- **Slack** — Interne rechtliche Anfrageannahme, Deal-Team-Zusammenarbeit, Compliance-Benachrichtigungen
- **Claude Code** — Vertragsüberprüfung, NDA-Redlining, GDPR-Lückenanalyse, Vendor Diligence, Policy-Entwurf, juristische Forschung

## Verzeichnisbaum

```
legal-compliance-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace-Anweisungen (Vorlage unten einfügen)
│   ├── settings.json                          # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── contract-review.md                 # /contract-review [type] — Redline, Risikomarkierungen, fehlende Klauseln
│       ├── nda-review.md                      # /nda-review — gegenseitige vs. einseitige NDA-Analyse und Redlines
│       ├── gdpr-check.md                      # /gdpr-check — GDPR/CCPA-Lückenanalyse auf Dokument oder Prozess
│       ├── vendor-diligence.md                # /vendor-diligence — Vendor-Vertrag + Sicherheitsfragebogen-Überprüfung
│       ├── policy-draft.md                    # /policy-draft — Corporate Policy entwerfen oder aktualisieren
│       ├── legal-research.md                  # /legal-research — Rechtsgutachten aus Westlaw-Quellen erstellen
│       └── compliance-audit.md                # /compliance-audit — strukturiertes Audit-Checklist durchführen (SOC2, ISO, GDPR)
├── contracts/
│   ├── templates/
│   │   ├── nda/
│   │   │   ├── mutual-nda-template.docx       # Standard gegenseitige NDA — Company-Paper, bevorzugte Bedingungen
│   │   │   ├── one-way-nda-template.docx      # Einseitige NDA für Vendors, die dem Unternehmen offenbaren
│   │   │   └── nda-fallback-positions.md      # Redline-Rückfallpositionen: was man zugestehen und was man halten kann
│   │   ├── msa/
│   │   │   ├── msa-customer-paper.docx        # Master Services Agreement — Unternehmen als Kunde
│   │   │   ├── msa-vendor-paper.docx          # MSA — Unternehmen als Anbieter/Lieferant
│   │   │   └── msa-redline-guide.md           # Klausel-für-Klausel Redline-Strategie und Rückfallpositionen
│   │   ├── sow/
│   │   │   ├── sow-template.docx              # Statement of Work — Services, Leistungen, Meilensteine, Gebühren
│   │   │   └── sow-fixed-fee-template.docx    # Fixed-Fee SOW Variante
│   │   ├── employment/
│   │   │   ├── offer-letter-template.docx     # Standard-Angebot — At-Will, Equity, Leistungen
│   │   │   ├── contractor-agreement.docx      # Unabhängiger Auftragnehmervertrag — IP-Abtretung, CIIA
│   │   │   └── severance-template.docx        # Abfindungs- und Verzichtsvereinbarung
│   │   └── vendor/
│   │       ├── vendor-dpa-template.docx       # Datenverarbeitungsvereinbarung — GDPR Artikel 28 konform
│   │       ├── vendor-msa-template.docx       # Vendor MSA mit Schadloshaltung, Haftungsbeschränkung, Kündigung
│   │       └── vendor-security-addendum.docx  # Sicherheits- und Datenschutz-Zusatz für datenfreigabe-Anbieter
│   └── executed/
│       ├── ndas/
│       │   └── .gitkeep                       # Ausgeführte NDAs nach Gegenpartei-Name + Datum
│       ├── msas/
│       │   └── .gitkeep                       # Ausgeführte MSAs — Kunde und Vendor
│       └── dpas/
│           └── .gitkeep                       # Ausgeführte DPAs — eine pro Datenverarbeitungs-Vendor
├── active-matters/
│   ├── _template/
│   │   ├── matter-summary.md                  # Matter-Name, -Typ, Eröffnungsdatum, Lead Counsel, Status
│   │   ├── timeline.md                        # Chronologisches Ereignisprotokoll — Daten, Aktionen, Parteien
│   │   ├── docs/
│   │   │   └── .gitkeep                       # Matter-Dokumente — Schriftsätze, Korrespondenz, Beweise
│   │   └── research/
│   │       └── .gitkeep                       # Recherchememos spezifisch für diese Matter
│   ├── employment-dispute-2026/
│   │   ├── matter-summary.md
│   │   ├── timeline.md
│   │   ├── docs/
│   │   │   ├── demand-letter-2026-03-15.pdf
│   │   │   ├── company-response-2026-03-28.pdf
│   │   │   └── mediation-brief-2026-05-01.docx
│   │   └── research/
│   │       ├── wrongful-termination-memo.md
│   │       └── at-will-exceptions-analysis.md
│   └── ip-ownership-review/
│       ├── matter-summary.md
│       ├── timeline.md
│       ├── docs/
│       │   └── contractor-ciia-review.docx
│       └── research/
│           └── work-for-hire-doctrine.md
├── compliance/
│   ├── regulatory-calendar.md                 # Alle regulatorischen Fristen — GDPR, CCPA, SOC2, ISO — mit Eigentümern
│   ├── gdpr/
│   │   ├── ropa.md                            # Verzeichnis der Verarbeitungstätigkeiten — Artikel 30 Register
│   │   ├── data-subjects-register.md          # Aktive DSARs und Response-Protokoll (30-Tage-Fristen verfolgt)
│   │   ├── dpia-log.md                        # Datenschutz-Folgenabschätzungen — eine Zeile pro Projekt
│   │   ├── breach-register.md                 # Incident-Protokoll — Datum, Umfang, DPA-Benachrichtigungsstatus
│   │   ├── transfer-mechanisms.md             # SCCs, Angemessenheitsentscheidungen, BCRs pro Transfer-Route
│   │   └── consent-records/
│   │       └── .gitkeep                       # Consent-Erfassungsdatensätze nach Produktfunktion
│   ├── soc2/
│   │   ├── evidence-tracker.md                # SOC2 Type II Evidence Map — Control, Eigentümer, Evidenz, Status
│   │   ├── controls-matrix.md                 # Komplette CC/A/P/C/PI Control-Set mit Implementierungsnotizen
│   │   ├── audit-log.md                       # Auditor-Interaktionen, angeforderte Proben, eingereichte Responses
│   │   └── evidence/
│   │       ├── access-reviews/
│   │       │   └── .gitkeep                   # Vierteljährliche Access Review Exporte
│   │       └── vendor-reviews/
│   │           └── .gitkeep                   # Jährliche Vendor Security Review Berichte
│   └── iso27001/
│       ├── isms-scope.md                      # ISMS-Umfangsangabe und Anwendbarkeit
│       ├── risk-register.md                   # Informationssicherheits-Risikoregister — Risiko, Rating, Behandlung
│       └── statement-of-applicability.md      # SOA — Control, im Geltungsbereich, Implementierungsstatus
├── policies/
│   ├── data-classification-policy.md          # Datenklassifizierungsebenen — öffentlich, intern, vertraulich, eingeschränkt
│   ├── privacy-policy.md                      # Externe Datenschutzrichtlinie — GDPR/CCPA konform
│   ├── acceptable-use-policy.md               # AUP — Mitarbeiternutzung von Unternehmensystemen und -daten
│   ├── information-security-policy.md         # ISP — Controls, Incident Response, Zugriffsverwaltung
│   ├── ai-use-policy.md                       # Genehmigte KI-Tools, untersagte Verwendungen, Datenbehandlungsregeln
│   ├── ethics-code.md                         # Verhaltenskodex — Interessenskonflikte, Geschenke, Whistleblower
│   ├── records-retention-policy.md            # Aufbewahrungsplan nach Datensatztyp — Legal Hold Verfahren
│   └── changelog.md                           # Policy-Revisionsverlauf — Version, Datum, Autor, Zusammenfassung der Änderungen
├── research/
│   ├── _template-memo.md                      # Standard-Rechtsgutachten-Format — Frage, Regel, Analyse, Schlussfolgerung
│   ├── regulatory-guidance/
│   │   ├── gdpr-enforcement-tracker.md        # DPA-Durchsetzungsmaßnahmen und Bußgelder — laufendes Protokoll
│   │   ├── ccpa-amendments-summary.md         # CPRA und nachfolgende CCPA-Änderungen und Stichtage
│   │   └── ai-regulation-watch.md             # EU AI Act, US EO on AI, NIST AI RMF — Status Tracker
│   └── memos/
│       ├── 2026-05-open-source-license-risk.md
│       └── 2026-04-employee-monitoring-limits.md
└── ip/
    ├── trademark/
    │   ├── trademark-register.md              # Alle Marken — Wort, Logo, Klassen, Jurisdiktion, Erneuerungsdaten
    │   └── filings/
    │       └── .gitkeep                       # USPTO/EUIPO Anmeldequittungen und Amtsmaßnahmen
    ├── patents/
    │   ├── patent-register.md                 # Patent-Portfolio — Antrags-#, Status, Jurisdiktion, Ablauf
    │   └── .gitkeep
    └── oss-license-log.md                     # Open-Source-Komponenten-Inventar — Lizenztyp, Verpflichtungen, Risikorating
```

## Wichtigsten Dateien erklärt

| Pfad | Zweck |
|---|---|
| `.claude/commands/contract-review.md` | Slash-Befehl, der einen Vertragstyp (NDA, MSA, SOW, DPA, Anstellung) und Vertragstext annimmt und dann Risikomarkierungen, fehlende Standardklauseln und eine nach Schweregrad organisierte Risikoübersicht zurückgibt |
| `.claude/commands/gdpr-check.md` | Slash-Befehl, der eine strukturierte GDPR/CCPA-Lückenanalyse auf einem Dokument, Prozessbeschreibung oder Produktmerkmal durchführt — gibt Lücken ausgegeben auf spezifische Artikel abgebildet mit empfohlener Abhilfe |
| `.claude/commands/vendor-diligence.md` | Slash-Befehl für Vendor-Vertragsüberprüfung — überprüft DPA-Angemessenheit, Haftungsbeschränkungen, Schadloshaltung, Datenlöschung, Audit-Rechte und Subprozessor-Offenlegung gegen interne Standards |
| `.claude/commands/compliance-audit.md` | Slash-Befehl, der ein strukturiertes Audit-Checklist durchführt (SOC2 CC, GDPR Kapitel IV, ISO 27001 Anlage A) und einen Gap-Report mit Control-Eigentümern und Evidence-Anforderungen ausgibt |
| `compliance/gdpr/ropa.md` | Artikel 30 Verzeichnis der Verarbeitungstätigkeiten — erforderlich unter GDPR — verfolgt jede Verarbeitungstätigkeit, Zweck, Rechtsgrundlage, Datenkategorien, Empfänger und Aufbewahrungsdauer |
| `compliance/soc2/evidence-tracker.md` | Verknüpft jeden SOC2-Control mit dem Evidence-Artefakt, Eigentümer, Erfassungshäufigkeit und Audit-Status — der Master-Tracker, der während der Type II Audit Feldarbeit verwendet wird |
| `contracts/templates/vendor/vendor-dpa-template.docx` | Company-Paper DPA zur Verwendung mit allen Datenverarbeitungs-Vendors — GDPR Artikel 28 konform, enthält SCCs als Anlage für grenzüberschreitende Transfers |
| `policies/changelog.md` | Revisionsverlauf für alle Policies in policies/ — erforderlich für ISO 27001 Dokumentenkontrolle und SOC2 Policy Review Evidence |

## Schnelles Gerüst

```bash
# Create workspace root
mkdir -p legal-compliance-workspace

# Create .claude structure
mkdir -p legal-compliance-workspace/.claude/commands

# Create contracts directory tree
mkdir -p legal-compliance-workspace/contracts/templates/nda
mkdir -p legal-compliance-workspace/contracts/templates/msa
mkdir -p legal-compliance-workspace/contracts/templates/sow
mkdir -p legal-compliance-workspace/contracts/templates/employment
mkdir -p legal-compliance-workspace/contracts/templates/vendor
mkdir -p legal-compliance-workspace/contracts/executed/ndas
mkdir -p legal-compliance-workspace/contracts/executed/msas
mkdir -p legal-compliance-workspace/contracts/executed/dpas

# Create active-matters template
mkdir -p legal-compliance-workspace/active-matters/_template/docs
mkdir -p legal-compliance-workspace/active-matters/_template/research

# Create compliance directories
mkdir -p legal-compliance-workspace/compliance/gdpr/consent-records
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/access-reviews
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews
mkdir -p legal-compliance-workspace/compliance/iso27001

# Create policies, research, and IP directories
mkdir -p legal-compliance-workspace/policies
mkdir -p legal-compliance-workspace/research/regulatory-guidance
mkdir -p legal-compliance-workspace/research/memos
mkdir -p legal-compliance-workspace/ip/trademark/filings
mkdir -p legal-compliance-workspace/ip/patents

# Seed .gitkeep placeholders
touch legal-compliance-workspace/contracts/executed/ndas/.gitkeep
touch legal-compliance-workspace/contracts/executed/msas/.gitkeep
touch legal-compliance-workspace/contracts/executed/dpas/.gitkeep
touch legal-compliance-workspace/active-matters/_template/docs/.gitkeep
touch legal-compliance-workspace/active-matters/_template/research/.gitkeep
touch legal-compliance-workspace/compliance/gdpr/consent-records/.gitkeep
touch legal-compliance-workspace/compliance/soc2/evidence/access-reviews/.gitkeep
touch legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews/.gitkeep
touch legal-compliance-workspace/ip/trademark/filings/.gitkeep
touch legal-compliance-workspace/ip/patents/.gitkeep

# Install legal skills
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Copy command stubs into .claude/commands/
npx claudient add skill legal/contract-review --output legal-compliance-workspace/.claude/commands/contract-review.md
npx claudient add skill legal/nda-review --output legal-compliance-workspace/.claude/commands/nda-review.md
npx claudient add skill legal/gdpr-expert --output legal-compliance-workspace/.claude/commands/gdpr-check.md
npx claudient add skill legal/vendor-contract-review --output legal-compliance-workspace/.claude/commands/vendor-diligence.md
npx claudient add skill legal/soc2-compliance --output legal-compliance-workspace/.claude/commands/compliance-audit.md
npx claudient add skill legal/legal-research --output legal-compliance-workspace/.claude/commands/legal-research.md
```

## CLAUDE.md Vorlage

```markdown
# Legal & Compliance Workspace — Claude Code Anweisungen

## Was das ist

Dieser Workspace ist das Arbeitsverzeichnis für in-house Counsel und Compliance-Beauftragte.
Verträge sind nach Typ in contracts/ organisiert, aktive juristische Angelegenheiten in active-matters/,
regulatorische Compliance-Unterlagen in compliance/, Unternehmensrichtlinien in policies/ und juristische
Recherchememos in research/. Alle Vertragsüberprüfungen, GDPR-Analysen, Vendor Diligence und
Policy-Entwürfe erfolgen durch Claude Code Skills.

## Stack

- Clio / Ironclad — Matter-Verwaltung und Contract Lifecycle (Sync Exporte zu active-matters/)
- Westlaw / LexisNexis — Primäre juristische Recherche; Quellen zitieren in research/memos/ mit vollständiger Zitation
- DocuSign — eSignature Routing; Envelope-IDs im relevanten Vertragsordner protokollieren
- Microsoft 365 Word — Redlines und Änderungsverfolgung; endgültige Versionen als .docx in contracts/ speichern
- Notion — Policy-Wiki; policies/ mit Notion als autorisierter Quelle synchron halten
- Slack — Interne rechtliche Anfrageannahme über #legal-requests Channel

## Häufige Aufgaben und genaue Befehle

### Überprüfung eines eingehenden Vertrags
```
/contract-review [type: NDA | MSA | SOW | DPA | employment | vendor]

Contract text:
[paste full contract or key sections]

Context:
- Counterparty: [name and role — customer, vendor, partner, employee]
- Our paper or their paper: [specify]
- Deal size / risk level: [approximate ARR or contract value]
- Any known issues flagged by business: [optional]
```

### NDA redline
```
/nda-review

NDA text:
[paste full NDA]

Type: [mutual | one-way (we disclose) | one-way (they disclose)]
Counterparty: [name]
Purpose of disclosure: [what is being shared and why]
Any non-standard requests from counterparty: [optional]
```

### Führe eine GDPR/CCPA-Lückenanalyse durch
```
/gdpr-check

Subject: [document | process | product feature | vendor]

Content:
[paste document text, process description, or feature spec]

Jurisdiction focus: [GDPR | CCPA | both]
Data types involved: [personal data categories — e.g., health, financial, behavioral]
```

### Überprüfung eines Vendor-Vertrags und DPA
```
/vendor-diligence

Vendor: [name and service description]
Contract type: [MSA | SaaS subscription | DPA | security addendum]

Contract text:
[paste contract or key sections]

Vendor processes personal data: [yes | no]
Data categories: [list if yes]
Sub-processors disclosed: [yes | no | unknown]
```

### Entwurf oder Aktualisierung einer Corporate Policy
```
/policy-draft

Policy: [data classification | acceptable use | privacy | AI use | records retention | ethics]
Action: [draft from scratch | update existing | add section]

Context:
[paste existing policy if updating, or describe what the policy must address]

Trigger: [what regulatory requirement or incident prompted this update]
```

### Verfassen eines juristischen Recherchememos
```
/legal-research

Issue: [precise legal question]
Jurisdiction: [US federal | California | EU | specific state or country]
Context: [the factual scenario — 2-3 sentences]
Urgency: [standard | expedited]
Output format: [IRAC memo | summary bullet points | regulation comparison table]
```

### Führe ein strukturiertes Compliance-Audit durch
```
/compliance-audit

Framework: [SOC2 Type II | GDPR Chapter IV | ISO 27001 Annex A | CCPA]
Scope: [full | specific controls — list control IDs]
Evidence available: [describe what records, exports, and logs are on hand]
Audit date or period: [date or date range]
```

## Zu befolgende Konventionen

- Jede aktive Matter muss matter-summary.md und timeline.md haben, bevor Docs hinzugefügt werden
- Alle Redlines werden als YYYY-MM-DD-counterparty-[type]-redline.docx im contracts Ordner gespeichert
- GDPRs ropa.md ist das Artikel 30 Register — aktualisieren Sie es, wann immer eine neue Verarbeitungstätigkeit genehmigt wird
- DSARs geloggt in gdpr/data-subjects-register.md haben eine feste 30-Tage-Antwortfrist — Flag bei Einnahme
- SOC2 evidence-tracker.md wird zu Beginn jedes Audit Fieldwork-Zyklus aktualisiert — nie Geschichte überschreiben
- Policy changelog.md wird jedes Mal aktualisiert, wenn eine Policy in policies/ überarbeitet wird — Version + Datum erforderlich
- Juristische Recherchememos in research/memos/ folgen IRAC-Format und enthalten vollständige Westlaw/LexisNexis-Zitationen
- Ausgeführte Verträge gehen in contracts/executed/ — nie permanent in active-matters/ lassen
- IP trademark-register.md Erneuerungsdaten werden vierteljährlich überprüft — Erneuerungen innerhalb von 90 Tagen flaggen
- OSS-Lizenz-Verpflichtungen in ip/oss-license-log.md werden überprüft, bevor eine neue Open-Source-Komponente ausgeliefert wird
```

## MCP Server

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp-server"],
      "env": {
        "WESTLAW_API_KEY": "your-westlaw-api-key",
        "WESTLAW_CLIENT_ID": "your-client-id",
        "WESTLAW_BASE_URL": "https://api.westlaw.com/v1"
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
        "/Users/your-username/legal-compliance-workspace"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"ropa.md\"; then echo \"[hook] ROPA updated — verify the new processing activity has a legal basis entry and a retention period before closing\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"policies/\"; then echo \"[hook] Policy file written — update policies/changelog.md with version, date, and summary of changes\"; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"breach-register.md\"; then echo \"[hook] CAUTION — writing to breach register. Confirm whether 72-hour DPA notification window applies before saving.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

```bash
# Core legal skills
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Install all legal skills at once
npx claudient add skills legal
```

## Verwandt

- [Legal & Compliance Guide](../guides/for-legal-compliance.md)
- [Contract Review Workflow](../workflows/contract-review-cycle.md)
- [GDPR Compliance Workflow](../workflows/gdpr-compliance.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
