# Legal Data Connectors voor Claude

## Overzicht

LLM training data heeft een harde afsnijdatum — elke wet die dit kwartaal is gewijzigd, elk circuit split dat vorige maand is beslist, elk regelgeving guidance letter dat vorige week is gepubliceerd is onzichtbaar voor een model's weights. Juridisch werk is jurisdictie-specifiek, zaak-specifiek en current-state afhankelijk op manieren die offline knowledge vrijwel nutteloos maken voor iets anders dan algemene redenering. Data connectors lossen dit op door Claude aan de authoritative live sources vast te stellen: Westlaw voor controlling law, iManage voor client matter documents, CourtListener voor public dockets, en compliance databases voor sanctions en beneficial ownership. Het resultaat is een systeem waar Claude ontwerpt, analyzeert, en redeneert tegen real data in plaats van gememoriseerde approximaties — dit is de enige acceptabele standaard voor juridisch werk.

---

## Connector Categorieën

| Categorie | Voorbeelden | Wat Claude kan doen |
|---|---|---|
| Legal research DBs | Westlaw, LexisNexis, Bloomberg Law | Cite statutes, pull case law, summarize holdings |
| Document management | iManage, NetDocuments | Search matters, draft from precedents |
| Contract intelligence | Kira, Luminance, Ironclad | Extract clauses, flag deviations, redline |
| Public legal data | CourtListener (Free Law Project), PACER | Case search, docket tracking |
| Compliance data | Refinitiv/LSEG, FactSet | Regulatory lookups, sanctions screening |
| eDiscovery | Relativity | Privilege review, issue tagging |

---

## Thomson Reuters / Westlaw MCP

### Wat het biedt

De Thomson Reuters MCP server stelt de volledige Westlaw content set bloot: US federal en state statutes, regulations (CFR, Federal Register), case law met KeyCite citator signals, Restatements, en Practical Law practice guides. Coverage strekt zich uit tot select internationale jurisdicties en cross-border regulatory content.

- Statutes: USCA, state annotated codes, volledige historische versies
- Regulations: CFR current en historisch, Federal Register notices, agency guidance
- Case law: federale courts (alle circuits), state supreme en appellate courts, KeyCite validation
- Secondary: Practical Law checklists, standaard documents, legal updates

### Vereisten

1. Active Westlaw subscription met API access tier (contact uw TR account manager — API access is niet inbegrepen in standaard seat licenses)
2. API key van [developer.thomsonreuters.com](https://developer.thomsonreuters.com)
3. Uw organisatie's Westlaw client ID

### Configuratie

Installeer de server:

```bash
npm install -g @thomsonreuters/westlaw-mcp
```

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

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

Voor project-scoped configuratie waar verschillende matters verschillende jurisdiction defaults vereisen:

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

### Voorbeeld prompts

```
Find Delaware case law on fiduciary duty standards for directors in the
context of a merger transaction. Focus on post-Corwin decisions from
the Court of Chancery. Summarize the business judgment rule vs. entire
fairness framework and what triggers each.
```

```
Pull GDPR Article 17 (right to erasure) full text and summarize the
six grounds for erasure, the three-month obligation timeline for
controllers, and any current EU court interpretations that narrow or
expand the scope of "public interest" exceptions.
```

```
Retrieve New York CPLR §7501 through §7514 (arbitration provisions),
cite the most recent Court of Appeals decisions applying them, and
flag any 2024-2025 amendments.
```

```
Get the current CFPB regulation on UDAAP enforcement guidance from
the CFR and summarize the agency's position as reflected in the
three most recent consent orders.
```

### Kostennota

API calls tekenen uit uw Thomson Reuters API quota, niet uit Claude API credits. TR rekent per content item opgehaald, niet per query. High-volume use cases (bulk matter research) zouden batch retrieval patterns moeten gebruiken in plaats van individual queries per document. Controleer uw TR contract voor per-unit pricing en monthly caps.

---

## LexisNexis MCP

### Wat het biedt

LexisNexis stelt case law, statutes, Shepard's citator signals, Practical Guidance documents, legal news (Law360 integration), en de Lexis+ AI content layer bloot. Shepard's is het kritieke differentiator — het biedt direct en indirect citation history, negative treatment flags (overruled, distinguished, questioned), en subsequent history voor elk case.

- Case law: federaal, alle 50 staten, plus select internationaal
- Statutes: USCA, state codes, geannoteerd met case citations
- Shepard's: volledige citator history met treatment codes
- Practical Guidance: jurisdictie-specifieke checklists en template documents
- News: Law360, legal wire services, regulatory announcements

### Vereisten

Active Lexis+ subscription met API tier. Verkrijg credentials van [developer.lexisnexis.com](https://developer.lexisnexis.com). API access vereist een apart contract addendum van de standaard research subscription.

### Configuratie

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

De server behandelt OAuth2 token refresh automatisch met `LEXIS_CLIENT_ID` en `LEXIS_CLIENT_SECRET`. Tokens verlopen elke uur; de MCP server beheert vernieuwing zonder tussenkomst.

### Voorbeeld: een opinion memo opstellen

```
Using LexisNexis, research the enforceability of non-compete agreements
in California. Pull the controlling statute (Cal. Bus. & Prof. Code §16600),
the Edwards v. Arthur Andersen holding, and any Court of Appeal decisions
from 2020 onward that address the "narrow restraint" exception. Then draft
a two-page opinion memo advising a SaaS company on whether its standard
employee NCA is enforceable as applied to a software engineer in San Jose.
Cite every case with Shepard's signal.
```

Claude zal LexisNexis aanroepen om de statute text op te halen, de cases op te halen, Shepard's signals op elke citation te controleren, en de memo met inline citations op te stellen. De memo zal cases met negative Shepard's treatment noteren.

---

## Free Law Project / CourtListener MCP

### Wat het biedt

CourtListener is een gratis, open-source legal research platform ondersteund door het Free Law Project. Het indexeert meer dan 8 miljoen US court opinions uit federale en state courts, PACER docket data, oral argument recordings, en judge profiles inclusief recusal history en financial disclosures.

Omdat het op public domain court opinions opereert, zijn er geen per-query charges en geen subscription vereist. Dit maakt het geschikt voor high-volume workflows: bulk docket monitoring, litigation tracking over meerdere matters, en judge research.

Coverage:
- US Supreme Court (volledige historisch)
- Alle 13 US Circuit Courts of Appeals
- Alle US District Courts (PACER integratie waar beschikbaar)
- State supreme en appellate courts (varieert per state)
- PACER dockets met real-time updates
- Bankruptcy courts

GitHub: [github.com/freelawproject/courtlistener](https://github.com/freelawproject/courtlistener)

### Configuratie

#### Optie A: Remote endpoint (Free Law Project hosted)

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

Verkrijg een gratis API token op [courtlistener.com/sign-in/](https://www.courtlistener.com/sign-in/).

#### Optie B: Lokale npm install

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

### Beste use cases

- Researching van de prior rulings van een judge voordat u een klacht indient — alle opinions van judge name ophalen, filteren op case type
- Tracking active dockets voor een client of counterparty — monitor PACER entries naarmate zij indienen
- Finding van alle circuit decisions op een narrow legal issue zonder een paid subscription
- Pulling van opinion text voor training, analyse, of internal precedent databases
- Bankruptcy monitoring — track debtor filings naar industrie of geografie

### Voorbeeld prompts

```
Search CourtListener for all Second Circuit opinions from 2022 to present
that cite Ashcroft v. Iqbal and address the pleading standard for fraud
claims under Rule 9(b). Return citations, holdings, and any circuit splits
with other circuits.
```

```
Pull the PACER docket for [case number] in the Southern District of New York
and summarize all entries from the past 30 days. Flag any discovery motions,
scheduling order modifications, or summary judgment filings.
```

---

## iManage / NetDocuments (DMS Connectors)

### Hoe document management systems via MCP verbinden

Law firms en legal departments slaan hun work product op in document management systems (DMS) — niet op local filesystems. iManage Work en NetDocuments zijn de twee dominante platforms. MCP connectors voor deze systemen geven Claude direct access tot matter documents: precedents, prior drafts, executed contracts, correspondence, en work product.

Het sleutel architectuur verschil van public legal databases: DMS connectors werken binnen uw network perimeter en authenticeren tegen uw firm's identity provider. Documents opgehaald via deze connectors worden covered door attorney-client privilege en work product protection — zie de Security and Privilege sectie voor handling requirements.

### iManage Work MCP

iManage Work MCP stelt de iManage Work REST API via een MCP interface bloot. Het ondersteunt document search per matter, client, document type, author, date range, en full-text content. Het kan document content ophalen, documents checkout en in, en nieuwe document versies plaatsen.

#### Vereisten

- iManage Work 10.x of later met REST API enabled
- OAuth2 application geregistreerd in uw iManage Control Center
- Client ID en secret van uw iManage administrator
- Workspace en library IDs voor uw deployment

#### Configuratie

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

De MCP server behandelt de OAuth2 authorization code flow bij eerste launch, opening a browser window voor user authentication. Latere calls gebruiken de refreshed access token opgeslagen in de server's local credential cache.

#### Beschikbare operaties

- `search_documents` — full-text en metadata search over matters
- `get_document` — retrieve document content door document ID
- `search_matters` — find matters per client name, matter number, of practice group
- `checkout_document` — check out a document voor editing (locks het in iManage)
- `checkin_document` — check in een nieuwe versie na editing
- `list_matter_documents` — list alle documents in een specifieke matter workspace
- `get_document_versions` — retrieve version history voor een document

#### Voorbeeld prompts

```
Search iManage for all NDAs executed with Acme Corp over the past two years.
Return document title, date, author, and matter number. Then retrieve the
most recent executed NDA and summarize the key terms: term, governing law,
scope of confidential information, and carve-outs.
```

```
Find all M&A engagement letters in the Davis matter workspace from 2023
onward. List them by date and pull the fee structure from each. I need
to compare how our engagement terms have evolved across these transactions.
```

```
Retrieve the latest draft of the merger agreement in matter 2024-0892.
Check it out under my name, then identify all representations and
warranties that reference material adverse effect and summarize the
current MAC definition language.
```

### NetDocuments MCP

NetDocuments gebruikt een soortgelijk pattern naar iManage. De sleutel structuur verschillen: NetDocuments organiseert content in cabinets en folders in plaats van workspaces en matter-centric libraries, en zijn API gebruikt een ander authentication model (OAuth2 met NetDocuments-specifieke scopes).

#### Configuratie

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

NetDocuments gebruikt cabinet IDs om searches te scopen. Stel `ND_DEFAULT_CABINET` in de environment in als uw firm een consistent cabinet structure gebruikt, of geef de cabinet ID per query door.

#### Beschikbare operaties

- `search` — full-text search over alle accessible cabinets
- `get_document` — retrieve document content per ndID
- `list_folder` — list documents in een folder of cabinet path
- `search_by_attribute` — filter door custom metadata (client, matter, doctype)
- `get_document_history` — version en checkout history

---

## Ironclad Contract Intelligence

### Wat het biedt

Ironclad is een contract lifecycle management (CLM) platform. Zijn MCP server stelt contract repository search, gestructureerde clause extraction, workflow status queries, en workflow trigger endpoints bloot. Het is het integration point wanneer contract operations (approval routing, counterparty negotiation workflows, signature collection) naast Claude's drafting en analysis capabilities moeten worden georchestreerd.

Ironclad's data model centers op records — elk contract is een record met gestructureerde attributen (parties, effective date, expiry, jurisdiction, governing law) plus de volledige contract text en extracted clause data.

### Vereisten

- Ironclad account met API access (beschikbaar op Growth en Enterprise plans)
- API token van Ironclad Settings → API & Integrations
- Uw Ironclad subdomain (bijv. `yourcompany.ironcladapp.com`)

### Configuratie

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

### Beschikbare operaties

- `search_contracts` — search per party name, type, status, date range, of full text
- `get_contract` — retrieve volledige contract record inclusief gestructureerde attributen en raw text
- `get_clause` — extract een specifieke clause type van een contract (bijv. limitation of liability, indemnification)
- `list_workflows` — list active workflows per type en status
- `trigger_workflow` — initiate een contract workflow (send voor approval, send voor signature)
- `compare_clause` — compare een clause tegen een playbook standard

### Voorbeeld prompts

```
Search Ironclad for all SaaS subscription agreements with renewal clauses
expiring in Q3 2026. Return party name, contract value, auto-renewal notice
deadline, and current status. Flag any where the notice deadline is within
45 days.
```

```
Retrieve the limitation of liability clause from contract ID IC-2024-4421
and compare it against our standard playbook cap of 12 months fees. Flag
any deviation and draft proposed redline language to bring it back to
standard.
```

```
Find all vendor agreements where we accepted unlimited liability for data
breaches. List them by value, jurisdiction, and expiry date so I can
prioritize renegotiation.
```

```
Trigger the standard renewal workflow for contract IC-2024-0234 and
notify the assigned account manager that auto-renewal notice deadline
is in 30 days.
```

---

## Kira / Luminance (AI Contract Review)

### Deze zijn AI-native tools — hoe zij Claude aanvullen

Kira Systems (nu onderdeel van Litera) en Luminance zijn machine learning platforms purpose-built voor contract review. Zij zijn trained op miljoenen legal contracts en produceren gestructureerde extracted data — clause locations, clause text, party names, dates, defined terms — als gestructureerde output.

Het integration pattern is niet native MCP per mei 2026. Noch Kira noch Luminance shipped met een MCP server. In plaats daarvan stellen beide platforms REST APIs bloot die gestructureerde JSON retourneren, en de integratie met Claude is via een intermediair pattern:

1. **Kira of Luminance** extraheert gestructureerde clause data van uploaded contracts (batch of single document)
2. Een lightweight **bridge script** roept de Kira/Luminance API aan en formatteert de output als een tool response
3. **Claude** ontvangt de gestructureerde extraction en voert de higher-order analyse uit: drafts de memo, compares tegen playbook, identifies risk, writes de executive summary

### Kira API bridge (custom MCP server pattern)

```bash
# Scaffold a custom MCP server to bridge Kira's REST API
npx @modelcontextprotocol/create-server kira-bridge
```

De bridge stelt twee tools bloot:

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

Configureer in `.claude/mcp.json`:

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

### Luminance pattern

Luminance's REST API volgt hetzelfde pattern. De extraction response van Luminance omvat zowel de clause text als Luminance's eigen risk classification, die Claude als startsignaal kan gebruiken voordat zijn eigen analyse wordt toegepast.

### Wanneer dit pattern gebruiken vs. native DMS

Gebruik Kira/Luminance als extraction layer wanneer:
- U grote contract portfolios beoordeelt (50+ documents) waar gestructureerde extraction sneller is dan Claude processing van raw PDFs
- Uw workflow auditable extraction records vereist (Kira/Luminance logs elke extraction)
- U Kira/Luminance's pre-trained provision models nodig hebt voor een specifieke contract type (bijv. real estate leases, IP assignments)

Gebruik Claude direct op raw documents wanneer:
- U 1-10 contracts hebt en de overhead van de extraction pipeline niet gerechtvaardigd is
- Het contract type ongewoon is en de pre-trained models waarschijnlijk niet goed presteren
- U free-form analyse doet die niet op gedefinieerde provision types map

---

## FactSet / Bloomberg Law (Finance-Legal Crossover)

### Wat deze bieden

Financial-legal crossover use cases — KYC, sanctions screening, beneficial ownership lookup, SEC filing analysis, en regulatory change tracking — vereisen data sources die aan het intersection van legal en financial intelligence zitten. FactSet en Bloomberg Law zijn de primaire platforms hier.

**FactSet MCP** stelt bloot:
- Company data: legal entity identifiers, corporate structure, beneficial ownership chains
- Regulatory filings: SEC EDGAR (10-K, 10-Q, 8-K, proxy statements, S-1s)
- Sanctions en watchlists: OFAC SDN, EU consolidated list, UN sanctions
- ESG en regulatory ratings: third-party compliance scores
- Ownership data: institutional holdings, insider transactions

**Bloomberg Law** stelt bloot:
- Legal news en docket monitoring
- Regulatory tracking (agency rulemaking, comment periods)
- Transactional precedents (deal terms database)
- Practical guidance en Bloomberg Law Analysis pieces

### FactSet MCP configuratie

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

FactSet gebruikt username + API key authentication. Genereer een API key op [developer.factset.com](https://developer.factset.com). Merk op dat FactSet's API products apart gelicentieerd zijn — bevestig dat uw FactSet contract de data sets omvat die u van plan bent op te vragen (Ownership, EDGAR filings, en Watchlist screening zijn separate modules).

### Bloomberg Law MCP configuratie

Bloomberg Law MCP is beschikbaar voor Bloomberg Terminal subscribers met het Law product enabled. Configureer via de Bloomberg MCP gateway:

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

### Use cases

```
Look up the ultimate beneficial ownership structure for Meridian Holdings Ltd
(LEI: 254900...). Trace all entities with more than 10% ownership, identify
any individuals on OFAC SDN or EU consolidated watchlists, and flag any
jurisdictions with elevated FATF risk ratings.
```

```
Retrieve all 8-K filings for Acme Corp from the past 12 months from SEC EDGAR.
Summarize each material event disclosed, flag any litigation disclosures or
government investigation notices, and identify any changes to the company's
stated risk factors that relate to regulatory compliance.
```

```
Screen the attached list of 45 vendor names against OFAC SDN, EU consolidated
sanctions, and UK OFSI lists. Return matches with match confidence score,
matched list entry, and the basis for designation.
```

```
Track all CFPB rulemaking activity from January 2025 to present. List each
proposed rule, its comment period status, and summarize the primary industry
objections filed during public comment periods.
```

---

## Bouw van een Legal Research Pipeline

### End-to-end voorbeeld: arbitration clause risk memo

Een partner vraagt: "Draft een risk memo op onze arbitration clause onder New York law voor de Johnson matter."

Dit vereist drie data sources die samen werken: current NY arbitration case law, de controlling statute text, en de client's actual arbitration clause uit de DMS.

#### Stap 1: CourtListener MCP — fetch NY arbitration cases

Claude roept `search_opinions` aan op CourtListener:
- Court: `ny` (New York Court of Appeals) en `ca2` (Second Circuit)
- Query: `arbitration clause enforcement CPLR 7501`
- Date range: 2020-01-01 tot heden
- Returns: 12 opinions met volledige text

#### Stap 2: Westlaw MCP — pull NY CPLR §7501 en gerelateerde regulations

Claude roept `get_statute` aan op het Westlaw MCP:
- Citation: `N.Y. C.P.L.R. §7501`
- Includes: geannoteerde versie met case citations
- Also retrieves: §7503 (application to compel arbitration), §7511 (vacating award)

#### Stap 3: iManage MCP — retrieve client's current arbitration clause

Claude roept `search_documents` aan op iManage:
- Matter: Johnson (opgehaald per matter number uit de user's context)
- Document type: Agreement
- Full-text filter: `arbitration`
- Returns: de current executed services agreement met de arbitration clause

#### Stap 4: Claude stelt de memo op

Met alle drie sources opgehaald, stelt Claude de memo op — citering CourtListener en Westlaw sources inline, quoting de client's actual clause, en flagging het specifieke risk (bijv. de clause mist een seat designation, die NY courts als een defect in enforceability hebben behandeld onder current Court of Appeals precedent).

### CLAUDE.md configuratie om alle drie MCPs in te verbinden

Voeg dit toe aan `.claude/CLAUDE.md` voor een matter-specifiek project:

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

### MCP configuratie voor het matter project

Maak `.claude/mcp.json` in de matter project directory:

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

Gebruik environment variable references (`${VAR_NAME}`) in plaats van hardcoded secrets in committed config files. Inject values van een secrets manager of een `.env` file die gitignored is.

---

## Security en Privilege

### Attorney-client privilege

De meest significante security constraint in legal MCP deployments is attorney-client privilege. Documents opgeslagen in iManage en NetDocuments zijn privileged work product. Routing ze via een third-party cloud MCP server — zelfs een vendor-supplied — verheft inadvertent disclosure risk: de transit kan als een waiver worden beargumenteerd afhankelijk van jurisdictie en de server's terms of service.

**Rule:** Voor elke MCP server die privileged matter documents verwerkt, deploy self-hosted of on-premises. Gebruik niet vendor-hosted cloud MCP endpoints voor DMS connectors tenzij uw firm's ethics counsel de specifieke vendor terms heeft beoordeeld en geen privilege risk heeft bevestigd.

Voor iManage en NetDocuments connectors:

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

Point de Claude config naar de internal host:

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

### Audit logging

Elke MCP tool call zou moeten worden gelogd met: timestamp, tool name, parameters (gesaniteerd van PII waar appropriate), response status, en de Claude session ID. Gebruik een Stop hook om de volledige conversation transcript na elke sessie vast te leggen en te archiveren.

Voeg toe aan `.claude/settings.json`:

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

`mcp-call-log.sh` ontvangt de tool call details via stdin als JSON. Schrijf de log entry naar uw firm's SIEM of append naar een matter-specifiek audit file:

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

### Data residency

Voordat u een MCP server deploy, bevestig:

1. **Cloud provider region** — Als uw client data agreement US-only data residency specificeert (common in government, healthcare, en financial services matters), verifieer dat elke SaaS MCP server of cloud-hosted DMS connector in een compliant region draait. Check vendor data processing agreements en sub-processor lists.

2. **Westlaw / LexisNexis API routing** — TR en LexisNexis route API calls standaard via US-based infrastructure, maar bevestig als uw matters non-US clients betrokken zijn subject naar GDPR, SCCs, of local data localization requirements. EU client matter data naar US API endpoints sturen kan een legal basis onder GDPR Chapter V vereisen.

3. **Log storage** — Audit logs geschreven door de Stop en PreToolUse hooks moeten in een locatie worden opgeslagen consistent met uw firm's data retention policy. Schrijf ze niet naar een personal laptop of shared drive die lacks appropriate access controls.

4. **MCP server credentials** — API keys voor Westlaw, LexisNexis, FactSet, en iManage zijn firm credentials, geen personal credentials. Behandel ze als secrets: store in een firm-managed secrets manager (HashiCorp Vault, AWS Secrets Manager), rotate op een schedule, en revoke onmiddellijk na attorney departure.

5. **Cross-matter contamination** — Wanneer Claude over meerdere matters in dezelfde sessie draait, verifieer dat iManage of NetDocuments search results geen documents uit matters oppervlakken die de user niet mag openen. Configureer MCP server scope op matter level, niet op user level, waar de DMS het ondersteunt.

---
