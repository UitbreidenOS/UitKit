# Legal Data Connectors für Claude

## Übersicht

LLM-Trainingsdaten haben einen strikten Cutoff — jeder letzte Gerichtstermin, jede letzte Gerichtsentscheidung, jede letzte Behördenanweisung ist unsichtbar für die Modellgewichte. Juristische Arbeit ist jurisdiktionsspezifisch, fallspezifisch und abhängig vom aktuellen Stand auf eine Weise, die Offline-Wissen fast unbrauchbar macht außer für allgemeines Reasoning. Daten-Connectors lösen dies, indem sie Claude zu den autoritativen Live-Quellen anschließen: Westlaw für kontrollierendes Recht, iManage für Mandatendokumente, CourtListener für öffentliche Dossiers und Compliance-Datenbanken für Sanktionen und Beneficial Ownership. Das Ergebnis ist ein System, wo Claude gegen echte Daten verfasst, analysiert und räsoniert, anstatt gegen gespeicherte Annäherungen — was der einzige akzeptable Standard für juristische Arbeit ist.

---

## Connector-Kategorien

| Kategorie | Beispiele | Was Claude tun kann |
|---|---|---|
| Juristische Recherche DBs | Westlaw, LexisNexis, Bloomberg Law | Statuten zitieren, Rechtsprechung abrufen, Haltungen zusammenfassen |
| Dokumentenverwaltung | iManage, NetDocuments | Mandate durchsuchen, aus Präzedenzfällen verfassen |
| Vertragsintelligenz | Kira, Luminance, Ironclad | Klauseln extrahieren, Abweichungen kennzeichnen, redlinen |
| Öffentliche juristische Daten | CourtListener (Free Law Project), PACER | Fallsuche, Dossier-Tracking |
| Compliance-Daten | Refinitiv/LSEG, FactSet | Behördliche Recherchen, Sanktions-Screening |
| eDiscovery | Relativity | Privilegien-Review, Issue Tagging |

---

## Thomson Reuters / Westlaw MCP

### Was es bereitstellt

Der Thomson Reuters MCP Server exponiert das vollständige Westlaw-Content-Set: US-Bundesgesetze und Staatsgesetze, Verordnungen (CFR, Federal Register), Rechtsprechung mit KeyCite Citator-Signalen, Restatements und Practical Law Practice Guides. Die Abdeckung erstreckt sich auf ausgewählte internationale Jurisdiktionen und grenzüberschreitende behördliche Inhalte.

- Statuten: USCA, State Annotated Codes, vollständige historische Versionen
- Verordnungen: CFR aktuell und historisch, Federal Register Notices, Behördenleitfäden
- Rechtsprechung: Bundesgerichte (alle Circuits), State Supreme und Appellate Courts, KeyCite Validierung
- Secondary: Practical Law Checklisten, Standard Documents, Legal Updates

### Voraussetzungen

1. Aktives Westlaw-Abonnement mit API Access Tier (kontaktieren Sie Ihren TR Account Manager — API Access ist nicht in Standard-Seat-Lizenzen enthalten)
2. API-Schlüssel von [developer.thomsonreuters.com](https://developer.thomsonreuters.com)
3. Ihre Organisations-Westlaw Client ID

### Konfiguration

Installieren Sie den Server:

```bash
npm install -g @thomsonreuters/westlaw-mcp
```

Fügen Sie hinzu zu `~/.claude.json` oder Projekt `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id",
        "TR_JURISDICTION": "US",
        "TR_CONTENT_TYPES": "cases,statutes,regulations,practicallaw"
      }
    }
  }
}
```

Für Projekt-Konfiguration, wo verschiedene Mandate verschiedene Jurisdiktions-Defaults erfordern:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp", "--jurisdiction=DE", "--content=cases,statutes"],
      "env": {
        "TR_API_KEY": "your-tr-api-key-here",
        "TR_CLIENT_ID": "your-westlaw-client-id"
      }
    }
  }
}
```

### Beispiel-Prompts

```
Finden Sie Delaware Rechtsprechung zu Fiduciary Duty Standards für Directors
im Kontext einer Merger-Transaktion. Konzentrieren Sie sich auf Post-Corwin Entscheidungen
aus dem Court of Chancery. Fassen Sie Business Judgment Rule vs. Entire Fairness Framework
zusammen und was jede auslöst.
```

```
Rufen Sie GDPR Artikel 17 (Recht auf Löschung) vollständiger Text ab und fassen Sie
die sechs Lösch-Grundlagen zusammen, die Drei-Monats-Obligation für Controller und
aktuelle EU-Gerichtsinterpretationen, die den Umfang von „öffentlichem Interesse" Ausnahmen
verengen oder erweitern.
```

```
Rufen Sie New York CPLR §7501 bis §7514 (Schiedsbestimmungen) ab,
zitieren Sie die neuesten Court of Appeals Entscheidungen, die diese anwenden und
kennzeichnen Sie alle 2024-2025 Änderungen.
```

```
Rufen Sie aktuelle CFPB-Verordnung zu UDAAP Enforcement Guidance aus dem CFR ab
und fassen Sie die Haltung der Agentur zusammen, wie in den drei neuesten Consent Orders reflektiert.
```

### Kosten-Hinweis

API-Aufrufe werden aus Ihrem Thomson Reuters API-Kontingent gezogen, nicht aus Claude API-Credits. TR berechnet pro abgerufenes Content-Element, nicht pro Abfrage. High-Volume Use Cases (Bulk Matter Research) sollten Batch-Abruf-Muster verwenden, nicht einzelne Abfragen pro Dokument. Überprüfen Sie Ihren TR-Vertrag auf Per-Unit-Preisgestaltung und monatliche Limits.

---

## LexisNexis MCP

### Was es bereitstellt

LexisNexis exponiert Rechtsprechung, Statuten, Shepard's Citator-Signale, Practical Guidance Dokumente, Rechtsnachrichten (Law360-Integration) und die Lexis+ AI Content Layer. Shepard's ist der kritische Differentiator — es bietet direkte und indirekte Zitationsgeschichte, Negative Treatment Flags (overruled, distinguished, questioned) und Subsequent History für jeden Fall.

- Rechtsprechung: Bundesebene, alle 50 Bundesländer, plus ausgewählte International
- Statuten: USCA, State Codes, annotiert mit Case Citations
- Shepard's: vollständige Citator-Geschichte mit Treatment Codes
- Practical Guidance: Jurisdiktions-spezifische Checklisten und Template-Dokumente
- News: Law360, Legal Wire Services, Regulatory Announcements

### Voraussetzungen

Aktives Lexis+-Abonnement mit API Tier. Rufen Sie Credentials von [developer.lexisnexis.com](https://developer.lexisnexis.com) ab. API Access erfordert einen separaten Vertrags-Nachtrag zum Standard-Forschungs-Abonnement.

### Konfiguration

```bash
npm install -g @lexisnexis/lexis-mcp
```

```json
{
  "mcpServers": {
    "lexisnexis": {
      "command": "npx",
      "args": ["-y", "@lexisnexis/lexis-mcp"],
      "env": {
        "LEXIS_CLIENT_ID": "your-lexis-client-id",
        "LEXIS_CLIENT_SECRET": "your-lexis-client-secret",
        "LEXIS_SCOPE": "research shepards practicalguidance",
        "LEXIS_REGION": "us"
      }
    }
  }
}
```

Der Server verwaltet OAuth2-Token-Erneuerung automatisch mit `LEXIS_CLIENT_ID` und `LEXIS_CLIENT_SECRET`. Tokens verfallen jede Stunde; der MCP Server verwaltet Erneuerung ohne Eingriff.

### Beispiel: Opinion Memo verfassen

```
Verwenden Sie LexisNexis, um die Durchsetzbarkeit von Non-Compete Agreements
in Kalifornien zu recherchieren. Rufen Sie das kontrollierbare Statut ab (Cal. Bus. & Prof. Code §16600),
die Edwards v. Arthur Andersen Entscheidung und alle Court of Appeal Entscheidungen von 2020 an,
die die „narrow restraint" Ausnahme adressieren. Dann verfassen Sie ein zweiseitiges
Opinion Memo, das ein SaaS-Unternehmen zu der Durchsetzbarkeit seines Standard-Employee-NCA
für einen Software-Engineer in San Jose berät. Zitieren Sie jeden Fall mit Shepard's Signal.
```

Claude wird LexisNexis aufrufen, um den Statute-Text abzurufen, die Cases zu ziehen, Shepard's-Signale auf jeder Zitation zu überprüfen und das Memo mit Inline-Zitationen zu verfassen. Das Memo wird jeden Fall mit negativer Shepard's-Behandlung vermerken.

---

## Free Law Project / CourtListener MCP

### Was es bereitstellt

CourtListener ist eine freie, Open-Source Legal Research Plattform, die vom Free Law Project gepflegt wird. Sie indexiert über 8 Millionen US-Gerichtsentscheidungen von Bundes- und Staatsgerichten, PACER-Dossier-Daten, Oral-Argument-Aufnahmen und Richter-Profile einschließlich Recusal-Historie und Finanzoffenlegungen.

Weil es mit öffentlich zugänglichen Gerichtsentscheidungen operiert, gibt es keine Per-Query-Kosten und keine Abonnements-Anforderung. Dies macht es geeignet für High-Volume Workflows: Bulk Dossier Monitoring, Litigation Tracking über mehrere Mandate und Judge Research.

Abdeckung:
- US Supreme Court (vollständig historisch)
- Alle 13 US Circuit Courts of Appeals
- Alle US District Courts (PACER Integration wo verfügbar)
- State Supreme und Appellate Courts (variiert nach Bundesland)
- PACER Dossiers mit Real-Time Updates
- Bankruptcy Courts

GitHub: [github.com/freelawproject/courtlistener](https://github.com/freelawproject/courtlistener)

### Konfiguration

#### Option A: Remote Endpoint (Free Law Project gehostet)

```json
{
  "mcpServers": {
    "courtlistener": {
      "type": "remote",
      "url": "https://mcp.courtlistener.com/sse",
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com"
      }
    }
  }
}
```

Rufen Sie einen kostenlosen API Token unter [courtlistener.com/sign-in/](https://www.courtlistener.com/sign-in/) ab.

#### Option B: Lokale npm Installation

```bash
npm install -g @freelawproject/courtlistener-mcp
```

```json
{
  "mcpServers": {
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "your-token-from-courtlistener.com",
        "CL_BASE_URL": "https://www.courtlistener.com/api/rest/v4"
      }
    }
  }
}
```

### Beste Use Cases

- Recherche früherer Entscheidungen eines Richters vor Einreichung — alle Entscheidungen des Richters nach Namen abrufen, nach Falltyp filtern
- Tracking aktiver Dossiers für einen Client oder Counterparty — PACER-Einträge bei Einreichung überwachen
- Alle Circuit-Entscheidungen zu enger juristischer Frage ohne bezahltes Abonnement finden
- Opinion-Text für Training, Analyse oder interne Präzedenz-Datenbanken abrufen
- Bankruptcy Monitoring — Debtor Filings nach Industrie oder Geographie verfolgen

### Beispiel-Prompts

```
Suchen Sie in CourtListener nach allen Second Circuit Entscheidungen von 2022 bis heute,
die Ashcroft v. Iqbal zitieren und den Pleading Standard für Fraud Claims
unter Rule 9(b) adressieren. Geben Sie Zitationen, Holdings und alle Circuit Splits
mit anderen Circuits zurück.
```

```
Rufen Sie das PACER-Dossier für [Fall-Nummer] im Southern District of New York ab
und fassen Sie alle Einträge der letzten 30 Tage zusammen. Kennzeichnen Sie alle
Discovery Motions, Scheduling Order Modifikationen oder Summary Judgment Filings.
```

---

## iManage / NetDocuments (DMS Connectors)

### Wie Document Management Systeme sich via MCP verbinden

Anwaltskanzleien und Rechtsabteilungen speichern ihr Arbeitsprodukt in Document Management Systems (DMS) — nicht auf lokalen Dateisystemen. iManage Work und NetDocuments sind die beiden dominanten Plattformen. MCP Connectors für diese Systeme geben Claude direkten Zugriff auf Matter-Dokumente: Präzedenzfälle, frühere Entwürfe, ausgeführte Verträge, Korrespondenz und Arbeitsprodukt.

Die Schlüssel-Architektur-Unterschied zu öffentlichen Rechtsdatenbanken: DMS Connectors operat innerhalb Ihres Netzwerk-Perimeters und authentifizieren gegen Ihren Kanzlei-Identity Provider. Über diese Connectors abgerufene Dokumente sind durch Anwalts-Klient-Privileg und Work Product Protection abgedeckt — siehe Sicherheits- und Privilegebereich für Handhabungsanforderungen.

### MCP iManage Work

iManage Work MCP exponiert die iManage Work REST API über eine MCP-Schnittstelle. Es unterstützt Dokumentsuche nach Mandat, Client, Dokumenttyp, Autor, Datumsbereich und Volltext-Inhalt. Es kann Dokumentinhalt abrufen, Dokumente ein- und auschecken und neue Dokumentversionen posten.

#### Voraussetzungen

- iManage Work 10.x oder später mit REST API aktiviert
- OAuth2-Anwendung in Ihrem iManage Control Center registriert
- Client ID und Secret von Ihrem iManage Administrator
- Workspace und Library IDs für Ihre Deployment

#### Konfiguration

```bash
npm install -g @imanage/work-mcp
```

```json
{
  "mcpServers": {
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "https://work.yourfirm.com",
        "IMANAGE_CLIENT_ID": "your-oauth2-client-id",
        "IMANAGE_CLIENT_SECRET": "your-oauth2-client-secret",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_CUSTOMER_ID": "your-customer-id",
        "IMANAGE_SCOPE": "user openid read write"
      }
    }
  }
}
```

Der MCP Server verwaltet den OAuth2-Authorization-Code-Flow beim ersten Starten, öffnet ein Browser-Fenster für Benutzer-Authentifizierung. Nachfolgende Aufrufe verwenden den in der lokalen Credential-Cache des Servers gespeicherten aktualisierten Access Token.

#### Verfügbare Operationen

- `search_documents` — Volltext- und Metadaten-Suche über Mandate
- `get_document` — Dokumentinhalt nach Dokument-ID abrufen
- `search_matters` — Mandate nach Client-Name, Mandat-Nummer oder Practice Group finden
- `checkout_document` — Dokument zum Bearbeiten auschecken (sperrt in iManage)
- `checkin_document` — Neue Version nach Bearbeitung einchecken
- `list_matter_documents` — Alle Dokumente in einem spezifischen Matter-Workspace auflisten
- `get_document_versions` — Versionshistorie für ein Dokument abrufen

#### Beispiel-Prompts

```
Suchen Sie in iManage nach allen NDAs, die in den letzten zwei Jahren mit Acme Corp
ausgeführt wurden. Geben Sie Dokumenttitel, Datum, Autor und Mandatsnummer zurück.
Dann rufen Sie den neuesten ausgeführten NDA ab und fassen Sie die wichtigsten Begriffe
zusammen: Laufzeit, anwendbares Recht, Umfang vertraulicher Informationen und Ausnahmen.
```

```
Finden Sie alle M&A Engagement Letters im Davis Matter Workspace ab 2023.
Auflisten Sie sie nach Datum und rufen Sie die Fee Structure aus jeder ab.
Ich muss vergleichen, wie sich unsere Engagement-Bedingungen über diese Transaktionen entwickelt haben.
```

```
Rufen Sie den neuesten Entwurf des Merger Agreement in Matter 2024-0892 ab.
Checken Sie ihn unter meinem Namen aus, dann identifizieren Sie alle Representations
und Warranties, die auf Material Adverse Effect referenzieren und fassen Sie die
aktuelle MAC-Definition Sprache zusammen.
```

### MCP NetDocuments

NetDocuments folgt einem ähnlichen Pattern zu iManage. Die Schlüssel-Struktur-Unterschiede: NetDocuments organisiert Inhalt in Cabinets und Folders statt Workspaces und Matter-zentrierten Bibliotheken, und seine API verwendet ein anderes Authentifizierungs-Modell (OAuth2 mit NetDocuments-spezifischen Scopes).

#### Konfiguration

```bash
npm install -g @netdocuments/nd-mcp
```

```json
{
  "mcpServers": {
    "netdocuments": {
      "command": "npx",
      "args": ["-y", "@netdocuments/nd-mcp"],
      "env": {
        "ND_BASE_URL": "https://api.netdocuments.com/v2",
        "ND_CLIENT_ID": "your-nd-client-id",
        "ND_CLIENT_SECRET": "your-nd-client-secret",
        "ND_REPOSITORY_ID": "your-repository-id",
        "ND_REDIRECT_URI": "http://localhost:4321/callback"
      }
    }
  }
}
```

NetDocuments verwendet Cabinet IDs zum Scoping von Suchvorgängen. Setzen Sie `ND_DEFAULT_CABINET` in der Umgebung wenn Ihre Kanzlei eine konsistente Cabinet-Struktur verwendet, oder übergeben Sie die Cabinet ID pro Abfrage.

#### Verfügbare Operationen

- `search` — Volltext-Suche über alle zugänglichen Cabinets
- `get_document` — Dokumentinhalt nach ndID abrufen
- `list_folder` — Dokumente in einem Folder oder Cabinet Path auflisten
- `search_by_attribute` — Nach Custom Metadata filtern (Client, Matter, DocType)
- `get_document_history` — Versions- und Checkout-Geschichte

---

## Ironclad Contract Intelligence

### Was es bereitstellt

Ironclad ist eine Contract Lifecycle Management (CLM) Plattform. Sein MCP Server exponiert Contract Repository Search, strukturierte Klausel-Extraktion, Workflow-Status-Abfragen und Workflow-Trigger-Endpoints. Es ist der Integrationspunkt wenn Contract Operations (Approval Routing, Counterparty Negotiation Workflows, Signature Collection) neben Claudes Draft- und Analyse-Fähigkeiten orchestriert werden müssen.

Ironclads Datenmodell ist auf Records zentriert — jeder Vertrag ist ein Record mit strukturierten Attributen (Parteien, Effective Date, Expiry, Jurisdiction, Governing Law) plus vollständiger Vertragstext und extrahierte Klausel-Daten.

### Voraussetzungen

- Ironclad Account mit API Access (verfügbar auf Growth und Enterprise Plans)
- API Token von Ironclad Settings → API & Integrations
- Ihre Ironclad Subdomain (z.B. `yourcompany.ironcladapp.com`)

### Konfiguration

```bash
npm install -g @ironcladapp/ironclad-mcp
```

```json
{
  "mcpServers": {
    "ironclad": {
      "command": "npx",
      "args": ["-y", "@ironcladapp/ironclad-mcp"],
      "env": {
        "IRONCLAD_API_TOKEN": "your-ironclad-api-token",
        "IRONCLAD_SUBDOMAIN": "yourcompany",
        "IRONCLAD_API_VERSION": "v1"
      }
    }
  }
}
```

### Verfügbare Operationen

- `search_contracts` — Nach Party Name, Type, Status, Date Range oder Volltext suchen
- `get_contract` — Vollständigen Contract Record abrufen, inkl. strukturierte Attribute und Raw Text
- `get_clause` — Spezifische Klausel-Art aus Vertrag extrahieren (z.B. Limitation of Liability, Indemnification)
- `list_workflows` — Aktive Workflows nach Type und Status auflisten
- `trigger_workflow` — Contract Workflow initiieren (zur Genehmigung senden, zur Signatur senden)
- `compare_clause` — Klausel gegen Playbook Standard vergleichen

### Beispiel-Prompts

```
Suchen Sie Ironclad nach allen SaaS Subscription Agreements mit Renewal Clauses,
die Q3 2026 ablaufen. Geben Sie Party Name, Contract Value, Auto-Renewal Notice Deadline
und aktuellen Status zurück. Kennzeichnen Sie all jene, wo die Notice Deadline innerhalb
45 Tagen ist.
```

```
Rufen Sie die Limitation of Liability Klausel aus Contract ID IC-2024-4421 ab
und vergleichen Sie sie gegen unsere Standard Playbook Cap von 12 Monaten Gebühren.
Kennzeichnen Sie jede Abweichung und verfassen Sie vorgeschlagenes Redline-Sprache,
um sie zurück zum Standard zu bringen.
```

```
Finden Sie alle Vendor Agreements, wo wir unbegrenzte Haftung für Data Breaches
akzeptiert haben. Auflisten Sie sie nach Wert, Jurisdiction und Expiry Date,
damit ich Renegotiation priorisieren kann.
```

```
Lösen Sie den Standard-Renewal-Workflow für Contract IC-2024-0234 aus und
benachrichtigen Sie den zugeordneten Account Manager, dass die Auto-Renewal
Notice Deadline in 30 Tagen ist.
```

---

## Kira / Luminance (KI-gestützte Vertragsprüfung)

### Dies sind KI-native Tools — wie sie Claude ergänzen

Kira Systems (jetzt Teil von Litera) und Luminance sind Machine Learning Plattformen, die spezifisch für Vertragsprüfung gebaut sind. Sie sind auf Millionen von Rechtverträgen trainiert und produzieren strukturierte extrahierte Daten — Klausel-Orte, Klausel-Text, Party-Namen, Daten, definierte Begriffe — als strukturierte Ausgabe.

Das Integrationsmuster ist nicht natives MCP ab Mai 2026. Weder Kira noch Luminance versendet einen MCP Server. Stattdessen exponieren beide Plattformen REST APIs, die strukturiertes JSON retournieren, und die Integration mit Claude ist via Intermediate Pattern:

1. **Kira oder Luminance** extrahiert strukturierte Klausel-Daten aus hochgeladenen Verträgen (Batch oder einzelnes Dokument)
2. Ein leichtes **Bridge Script** ruft die Kira/Luminance API auf und formatiert die Ausgabe als Tool Response
3. **Claude** empfängt die strukturierte Extraktion und führt höher-ordnung Analyse durch: verfasst das Memo, vergleicht gegen Playbook, identifiziert Risiko, schreibt die Executive Summary

### Kira API Bridge (Custom MCP Server Pattern)

```bash
# Gerüst einen Custom MCP Server zum Bridging der Kira REST API
npx @modelcontextprotocol/create-server kira-bridge
```

Der Bridge exponiert zwei Tools:

```json
{
  "tools": [
    {
      "name": "kira_extract",
      "description": "Submit a document to Kira for clause extraction and return structured results",
      "inputSchema": {
        "type": "object",
        "properties": {
          "document_url": { "type": "string" },
          "provision_types": {
            "type": "array",
            "items": { "type": "string" },
            "description": "e.g. ['limitation_of_liability', 'indemnification', 'governing_law']"
          }
        }
      }
    },
    {
      "name": "kira_batch_status",
      "description": "Check status of a Kira batch extraction job",
      "inputSchema": {
        "type": "object",
        "properties": {
          "job_id": { "type": "string" }
        }
      }
    }
  ]
}
```

Konfigurieren in `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "kira": {
      "command": "node",
      "args": ["/path/to/kira-bridge/build/index.js"],
      "env": {
        "KIRA_API_KEY": "your-kira-api-key",
        "KIRA_BASE_URL": "https://api.kirasystems.com/v2",
        "KIRA_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

### Luminance Pattern

Luminance's REST API folgt dem gleichen Pattern. Die Extraction Response von Luminance enthält sowohl den Klausel-Text als auch Luminance's eigene Risk Classification, die Claude als Start-Signal verwenden kann, bevor es seine eigene Analyse anwendet.

### Wann dieses Pattern vs. natives DMS verwenden

Verwenden Sie Kira/Luminance als Extraction Layer wenn:
- Sie große Vertragsportfolios (50+ Dokumente) reviewen, wo strukturierte Extraktion schneller ist als Claude Raw PDFs verarbeitet
- Ihr Workflow überprüfbare Extraction Records erfordert (Kira/Luminance protokolliert jede Extraktion)
- Sie Kira/Luminance's Pre-Trained Provision Models für einen spezifischen Vertragstyp benötigen (z.B. Real Estate Leases, IP Assignments)

Verwenden Sie Claude direkt auf Raw Documents wenn:
- Sie 1-10 Verträge haben und der Extraction Pipeline Overhead nicht gerechtfertigt ist
- Der Vertragstyp ungewöhnlich ist und Pre-Trained Models wahrscheinlich nicht gut performen
- Sie Free-Form Analyse führen, die nicht auf definierten Provision Types mapped

---

## FactSet / Bloomberg Law (Finance-Legal Crossover)

### Was sie bereitstellen

Finance-Legal Crossover Use Cases — KYC, Sanctions Screening, Beneficial Ownership Lookup, SEC Filing Analysis und Regulatory Change Tracking — erfordern Datenquellen, die am Schnittpunkt von Legal und Financial Intelligence sitzen. FactSet und Bloomberg Law sind die primären Plattformen hier.

**FactSet MCP** exponiert:
- Company Data: Legal Entity Identifiers, Corporate Structure, Beneficial Ownership Chains
- Regulatory Filings: SEC EDGAR (10-K, 10-Q, 8-K, Proxy Statements, S-1s)
- Sanctions und Watchlists: OFAC SDN, EU Consolidated List, UN Sanctions
- ESG und Regulatory Ratings: Third-Party Compliance Scores
- Ownership Data: Institutional Holdings, Insider Transactions

**Bloomberg Law** exponiert:
- Legal News und Docket Monitoring
- Regulatory Tracking (Agency Rulemaking, Comment Periods)
- Transactional Precedents (Deal Terms Database)
- Practical Guidance und Bloomberg Law Analysis Pieces

### FactSet MCP Konfiguration

```bash
npm install -g @factset/factset-mcp
```

```json
{
  "mcpServers": {
    "factset": {
      "command": "npx",
      "args": ["-y", "@factset/factset-mcp"],
      "env": {
        "FACTSET_USERNAME": "your-factset-username",
        "FACTSET_API_KEY": "your-factset-api-key",
        "FACTSET_SCOPE": "company ownership sanctions filings",
        "FACTSET_ENVIRONMENT": "production"
      }
    }
  }
}
```

FactSet verwendet Username + API Key Authentifizierung. Generieren Sie einen API Key unter [developer.factset.com](https://developer.factset.com). Beachten Sie, dass FactSet API Produkte separat lizenziert sind — bestätigen Sie, dass Ihr FactSet Contract die Datensätze enthält, die Sie abfragen beabsichtigen (Ownership, EDGAR Filings und Watchlist Screening sind separate Module).

### Bloomberg Law MCP Konfiguration

Bloomberg Law MCP ist verfügbar für Bloomberg Terminal Subscriber mit Law Product aktiviert. Konfigurieren Sie über das Bloomberg MCP Gateway:

```json
{
  "mcpServers": {
    "bloomberg-law": {
      "command": "npx",
      "args": ["-y", "@bloomberg/blaw-mcp"],
      "env": {
        "BLAW_API_KEY": "your-bloomberg-law-api-key",
        "BLAW_CLIENT_ID": "your-client-id",
        "BLAW_BASE_URL": "https://api.blaw.com/v1"
      }
    }
  }
}
```

### Use Cases

```
Schauen Sie auf die ultimative Beneficial Ownership Struktur für Meridian Holdings Ltd
(LEI: 254900...). Verfolgen Sie alle Entities mit mehr als 10% Ownership, identifizieren Sie
any Individuals auf OFAC SDN oder EU Consolidated Watchlist und kennzeichnen Sie any
Jurisdictions mit erhöhten FATF Risk Ratings.
```

```
Rufen Sie alle 8-K Filings für Acme Corp aus den letzten 12 Monaten von SEC EDGAR ab.
Fassen Sie jedes Material Event zusammen, das offengelegt ist, kennzeichnen Sie Litigation
Disclosures oder Government Investigation Notices und identifizieren Sie änderungen
zu Statedrisk Factors des Unternehmens, die Regulatory Compliance betreffen.
```

```
Screenen Sie die angefügte Liste von 45 Vendor Namen gegen OFAC SDN, EU Consolidated
Sanctions und UK OFSI Lists. Geben Sie Matches mit Match Confidence Score, matched
List Entry und Designation Basis zurück.
```

```
Verfolgen Sie alle CFPB Rulemaking Activity von Januar 2025 bis heute. Auflisten Sie
jeden Proposed Rule, seinen Comment Period Status und fassen Sie primäre Industry
Objections zusammen, die während Public Comment Periods eingereicht wurden.
```

---

## Building a Legal Research Pipeline

### End-to-End Beispiel: Arbitration Clause Risk Memo

Ein Partner fragt: „Verfassen Sie ein Risk Memo zu unserer Arbitration Clause unter New York Law für das Johnson Matter."

Dies erfordert drei Datenquellen, die zusammenarbeiten: aktuelle NY Arbitration Case Law, Controlling Statute Text und der Client's tatsächliche Arbitration Clause aus dem DMS.

#### Schritt 1: CourtListener MCP — NY Arbitration Cases abrufen

Claude ruft `search_opinions` auf CourtListener auf:
- Court: `ny` (New York Court of Appeals) und `ca2` (Second Circuit)
- Query: `arbitration clause enforcement CPLR 7501`
- Date Range: 2020-01-01 to Present
- Returns: 12 Opinions mit vollständigem Text

#### Schritt 2: Westlaw MCP — NY CPLR §7501 und verwandte Verordnungen abrufen

Claude ruft `get_statute` auf dem Westlaw MCP auf:
- Citation: `N.Y. C.P.L.R. §7501`
- Includes: Annotierte Version mit Case Citations
- Ruft auch ab: §7503 (Anwendung zur Erzwingung von Arbitrage), §7511 (Award Vacatur)

#### Schritt 3: iManage MCP — Client's aktuelle Arbitration Clause abrufen

Claude ruft `search_documents` auf iManage auf:
- Matter: Johnson (abgerufen by Matter Number aus User Context)
- Document Type: Agreement
- Full-Text Filter: `arbitration`
- Returns: die aktuelle ausgeführte Services Agreement, die die Arbitration Clause enthält

#### Schritt 4: Claude verfasst das Memo

Mit allen drei Quellen abgerufen, verfasst Claude das Memo — citiert CourtListener und Westlaw Quellen inline, zitiert die Client's tatsächliche Clause und kennzeichnet das spezifische Risiko (z.B. die Clause fehlt eine Seat Designation, die NY Courts als Enforceability Defect unter aktuellem Court of Appeals Precedent behandelt haben).

### CLAUDE.md Konfiguration zur Verdrahtung aller drei MCPs

Fügen Sie dies zu `.claude/CLAUDE.md` für ein Matter-spezifisches Projekt hinzu:

```markdown
# Matter: Johnson — Arbitration Research Project

## MCP configuration

This project connects to three data sources:
- **westlaw**: current NY statutes and case law
- **courtlistener**: public federal and NY state court opinions
- **imanage**: Johnson matter documents (matter ID: 2024-JOH-0112)

## Research workflow

When asked to research a legal issue for this matter:
1. Always pull the controlling statute from westlaw first
2. Retrieve relevant case law from both westlaw (for KeyCite signals) and courtlistener (for full opinion text)
3. Check iManage for any existing research memos or prior analysis before starting new research
4. Draft memos in IRAC structure: Issue, Rule, Application, Conclusion
5. Include citation signals (KeyCite/Shepard's) next to every case citation

## Privilege note

All documents retrieved from iManage are privileged. Do not include document content in any output that will be shared outside the firm.
```

### MCP-Konfiguration für das Matter Project

Erstellen Sie `.claude/mcp.json` im Matter Project Directory:

```json
{
  "mcpServers": {
    "westlaw": {
      "command": "npx",
      "args": ["-y", "@thomsonreuters/westlaw-mcp"],
      "env": {
        "TR_API_KEY": "${TR_API_KEY}",
        "TR_CLIENT_ID": "${TR_CLIENT_ID}",
        "TR_JURISDICTION": "NY",
        "TR_CONTENT_TYPES": "cases,statutes"
      }
    },
    "courtlistener": {
      "command": "npx",
      "args": ["-y", "@freelawproject/courtlistener-mcp"],
      "env": {
        "COURTLISTENER_API_TOKEN": "${COURTLISTENER_API_TOKEN}"
      }
    },
    "imanage": {
      "command": "npx",
      "args": ["-y", "@imanage/work-mcp"],
      "env": {
        "IMANAGE_HOST": "${IMANAGE_HOST}",
        "IMANAGE_CLIENT_ID": "${IMANAGE_CLIENT_ID}",
        "IMANAGE_CLIENT_SECRET": "${IMANAGE_CLIENT_SECRET}",
        "IMANAGE_LIBRARY": "ACTIVE",
        "IMANAGE_DEFAULT_MATTER": "2024-JOH-0112"
      }
    }
  }
}
```

Verwenden Sie Umgebungs-Variable-Referenzen (`${VAR_NAME}`) statt hardcodierter Secrets in Committed Config Files. Injizieren Sie Werte von einem Secrets Manager oder einer `.env` Datei, die gitignored ist.

---

## Sicherheit und Privileg

### Anwalts-Klient-Privileg

Die signifikanteste Sicherheits-Einschränkung in Legal MCP Deployments ist Attorney-Client Privilege. In iManage und NetDocuments gespeicherte Dokumente sind privilegiertes Work Product. Sie durch einen Dritt-Cloud MCP Server zu routen — selbst einen vom Hersteller bereitgestellten — wirft Risiko unbeabsichtigter Offenlegung auf: das Transit könnte je nach Jurisdiction und des Servers Terms of Service als Waiver argumentiert werden.

**Regel:** Für jeden MCP Server, der privilegierte Matter Documents verarbeitet, Deploy Self-Hosted oder On-Premises. Verwenden Sie nicht Cloud-gehostete Hersteller-Cloud MCP Endpoints für DMS Connectors, wenn der Ethics Counsel Ihres Firmes die spezifischen Vendor Terms nicht überprüft und kein Privilege Risk bestätigt hat.

Für iManage und NetDocuments Connectors:

```bash
# Self-hosted deployment — run on firm infrastructure, not vendor cloud
docker run -d \
  --name imanage-mcp \
  --network internal \
  -e IMANAGE_HOST=https://work.yourfirm.com \
  -e IMANAGE_CLIENT_ID=$IMANAGE_CLIENT_ID \
  -e IMANAGE_CLIENT_SECRET=$IMANAGE_CLIENT_SECRET \
  -p 127.0.0.1:3100:3100 \
  firmregistry.yourfirm.com/imanage-mcp:latest
```

Zeigen Sie die Claude Config zum Internal Host:

```json
{
  "mcpServers": {
    "imanage": {
      "type": "remote",
      "url": "http://127.0.0.1:3100/sse"
    }
  }
}
```

### Audit Logging

Jeder MCP Tool Call sollte protokolliert werden mit: Timestamp, Tool Name, Parameters (sanitized von PII wo appropriate), Response Status und Claude Session ID. Verwenden Sie einen Stop Hook um die vollständige Conversation Transcript vor jeder Session zu archivieren.

Fügen Sie zu `.claude/settings.json` hinzu:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/legal-audit-log.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "mcp__",
        "hooks": [
          {
            "type": "command",
            "command": "/usr/local/bin/mcp-call-log.sh"
          }
        ]
      }
    ]
  }
}
```

`mcp-call-log.sh` empfängt Tool Call Details via stdin als JSON. Schreiben Sie das Log Entry zu Ihrer Firma's SIEM oder fügen zu einer Matter-spezifischen Audit Datei an:

```bash
#!/bin/bash
# mcp-call-log.sh
# Logs every MCP call to a matter-specific audit file
# Receives tool call JSON on stdin

INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
MATTER_ID=$(echo "$INPUT" | jq -r '.tool_input.matter_id // "none"')

LOG_DIR="/var/log/claude-legal-audit"
LOG_FILE="$LOG_DIR/mcp-calls-$(date +%Y-%m-%d).jsonl"

mkdir -p "$LOG_DIR"
echo "{\"timestamp\":\"$TIMESTAMP\",\"session\":\"$SESSION_ID\",\"tool\":\"$TOOL_NAME\",\"matter\":\"$MATTER_ID\"}" >> "$LOG_FILE"
```

### Data Residency

Bevor Sie einen MCP Server deployen, bestätigen Sie:

1. **Cloud Provider Region** — Wenn Ihr Client Data Agreement US-only Data Residency spezifiziert (häufig in Government, Healthcare und Financial Services Matters), verifizieren Sie, dass jeder SaaS MCP Server oder Cloud-Hosted DMS Connector in einer konformen Region läuft. Überprüfen Sie Hersteller Data Processing Agreements und Sub-Processor Lists.

2. **Westlaw / LexisNexis API Routing** — TR und LexisNexis routen API Calls durch US-basierte Infrastruktur standardmäßig, aber bestätigen Sie, ob Ihre Matters nicht-US Clients unter GDPR, SCCs oder lokale Data Localization Requirements beinhalten. Sending EU Client Matter Data durch US API Endpoints kann eine Legal Basis unter GDPR Kapitel V erfordern.

3. **Log Storage** — Audit Logs geschrieben von Stop und PreToolUse Hooks müssen in einer Location konsistent mit Ihrer Firma's Data Retention Policy gespeichert werden. Schreiben Sie sie nicht zu einem Personal Laptop oder Shared Drive, der angemessene Access Controls fehlen.

4. **MCP Server Credentials** — API Keys für Westlaw, LexisNexis, FactSet und iManage sind Firma Credentials, nicht persönliche Credentials. Behandeln Sie sie als Secrets: store in einem Firma-Managed Secrets Manager (HashiCorp Vault, AWS Secrets Manager), rotieren auf Schedule und revoke sofort nach Attorney Departure.

5. **Cross-Matter Contamination** — Wenn Claude über mehrere Matters in der gleichen Session läuft, verifizieren Sie, dass iManage oder NetDocuments Search Results keine Dokumente von Matters surfacen, auf die der User nicht berechtigt ist zuzugreifen. Konfigurieren Sie MCP Server Scope auf Matter Level, nicht User Level, wo das DMS es unterstützt.

---
