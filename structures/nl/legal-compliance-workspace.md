# Juridische & Compliance Werkruimte — Projectstructuur

> Voor intern juridisch adviseurs of compliance-medewerkers die contractbeoordelingen, regelgevingsvervolging, GDPR/privacycompliance, vendor due diligence en beleidsontwikkeling beheren via Clio, Ironclad, Westlaw, DocuSign en Microsoft 365.

## Stack

- **Clio** of **Ironclad** — Zaakbeheer, contractlevenscyclus, redline-tracking, handtekeningrouting
- **Westlaw** of **LexisNexis** — Primair juridisch onderzoek, rechtszaken ophalen, regelgevingsguidance
- **DocuSign** — eSignature-routing, enveloptracking, uitgevoerde overeenkomsten opslaan
- **Microsoft 365** — Word (redlines), Outlook (extern juridisch adviseurs), Teams (juridisch kanaal), SharePoint (documentbeheer)
- **Notion** — Beleidsdocumentatie, compliancecalendars, intern juridisch wiki
- **Slack** — Interne juridische verzoeken, samenwerkingsteam, compliancewaarschuwingen
- **Claude Code** — Contractbeoordelingen, NDA-redlines, GDPR-gapanalyse, vendor-onderzoek, beleidsontwikkeling, juridisch onderzoek

## Directoriumstructuur

```
legal-compliance-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Werkruimte-instructies (plak de sjabloon hieronder)
│   ├── settings.json                          # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── contract-review.md                 # /contract-review [type] — redline, risikovlaggen, ontbrekende clausules
│       ├── nda-review.md                      # /nda-review — wederzijdse vs. eenzijdige NDA-analyse en redlines
│       ├── gdpr-check.md                      # /gdpr-check — GDPR/CCPA-gapanalyse op document of proces
│       ├── vendor-diligence.md                # /vendor-diligence — vendorcontract + veiligheidsvragelistverzameling
│       ├── policy-draft.md                    # /policy-draft — ontwerp of update benoemd bedrijfsbeleid
│       ├── legal-research.md                  # /legal-research — juridisch memo uit Westlaw-bronnen
│       └── compliance-audit.md                # /compliance-audit — voer gestructureerde auditchecklist uit (SOC2, ISO, GDPR)
├── contracts/
│   ├── templates/
│   │   ├── nda/
│   │   │   ├── mutual-nda-template.docx       # Standaard wederzijdse NDA — bedrijfspolopatible, voorkeurvoorwaarden
│   │   │   ├── one-way-nda-template.docx      # Eenzijdige NDA voor vendors die naar bedrijf openbaren
│   │   │   └── nda-fallback-positions.md      # Redline fallback-posities: wat toegeven en wat vasthouden
│   │   ├── msa/
│   │   │   ├── msa-customer-paper.docx        # Master Services Agreement — bedrijf als klant
│   │   │   ├── msa-vendor-paper.docx          # MSA — bedrijf als leverancier
│   │   │   └── msa-redline-guide.md           # Clausule-voor-clausule redline-strategie en fallback-posities
│   │   ├── sow/
│   │   │   ├── sow-template.docx              # Statement of Work — services, deliverables, mijlpalen, kosten
│   │   │   └── sow-fixed-fee-template.docx    # Vast-prijs SOW-variant
│   │   ├── employment/
│   │   │   ├── offer-letter-template.docx     # Standaard aanbiedingsbrief — at-will, aandelen, voordelen
│   │   │   ├── contractor-agreement.docx      # Onafhankelijke contractoovereenkomst — IP-toewijzing, CIIA
│   │   │   └── severance-template.docx        # Uitkeringsuit en vrijstellingsovereenkomst
│   │   └── vendor/
│   │       ├── vendor-dpa-template.docx       # Gegevensverwerkerovereenkomst — GDPR Artikel 28 compliant
│   │       ├── vendor-msa-template.docx       # Vendor MSA met indemniteit, aansprakelijkheidscap, beëindiging
│   │       └── vendor-security-addendum.docx  # Veiligheid- en privacybijlage voor gegevensdeling-vendors
│   └── executed/
│       ├── ndas/
│       │   └── .gitkeep                       # Uitgevoerde NDA's op naam tegenpartij + datum
│       ├── msas/
│       │   └── .gitkeep                       # Uitgevoerde MSA's — klant en vendor
│       └── dpas/
│           └── .gitkeep                       # Uitgevoerde DPA's — één per gegevensverwerker
├── active-matters/
│   ├── _template/
│   │   ├── matter-summary.md                  # Zaaknaam, type, openingsdatum, leidend advocaat, status
│   │   ├── timeline.md                        # Chronologische gebeurtenissenlogboek — data, acties, partijen
│   │   ├── docs/
│   │   │   └── .gitkeep                       # Zaakdocumenten — klachten, correspondentie, bewijs
│   │   └── research/
│   │       └── .gitkeep                       # Onderzoeksmemo's specifiek voor deze zaak
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
│   ├── regulatory-calendar.md                 # Alle regelgevingsdeadlines — GDPR, CCPA, SOC2, ISO — met eigenaren
│   ├── gdpr/
│   │   ├── ropa.md                            # Registratie van verwerkingsactiviteiten — Artikel 30-register
│   │   ├── data-subjects-register.md          # Actieve DSAR's en antwoordlogboek (30-daagse deadlines tracked)
│   │   ├── dpia-log.md                        # Gegevensbeschermingsimpactbeoordelingen — één rij per project
│   │   ├── breach-register.md                 # Incidentlogboek — datum, omvang, DPA-notificatiestatus
│   │   ├── transfer-mechanisms.md             # SCC's, aangemesenheidsbeslissingen, BCR's in gebruik per transferroute
│   │   └── consent-records/
│   │       └── .gitkeep                       # Toestemmingsvastleggingsrecords per productfunctie
│   ├── soc2/
│   │   ├── evidence-tracker.md                # SOC2 Type II bewijskaart — controle, eigenaar, bewijs, status
│   │   ├── controls-matrix.md                 # Volledige CC/A/P/C/PI controleset met implementatienotities
│   │   ├── audit-log.md                       # Controleur-interacties, aangevraagde monsters, verstuurde antwoorden
│   │   └── evidence/
│   │       ├── access-reviews/
│   │       │   └── .gitkeep                   # Driemaandelijkse toegangscontrolerapporten
│   │       └── vendor-reviews/
│   │           └── .gitkeep                   # Jaarlijkse veiligheidsstudies leveranciers
│   └── iso27001/
│       ├── isms-scope.md                      # ISMS-bereikverklaring en toepasselijkheid
│       ├── risk-register.md                   # Informatiebeveiliging risicobeschrijving — risico, beoordeling, behandeling
│       └── statement-of-applicability.md      # SOA — controle, in-scope, implementatiestatus
├── policies/
│   ├── data-classification-policy.md          # Gegevensclassificatielagen — openbaar, intern, vertrouwelijk, beperkt
│   ├── privacy-policy.md                      # Extern gericht privacybeleid — GDPR/CCPA compliant
│   ├── acceptable-use-policy.md               # AUP — werknemergebruik van bedrijfssystemen en gegevens
│   ├── information-security-policy.md         # ISP — controles, incidentrespons, toegangsbeheer
│   ├── ai-use-policy.md                       # Goedgekeurde AI-tools, verboden toepassingen, gegevensverwerkingsregels
│   ├── ethics-code.md                         # Gedragscode — belangenconflicten, geschenken, klokkenluideraar
│   ├── records-retention-policy.md            # Retentieschema op recordtype — juridische bewaarprocedure
│   └── changelog.md                           # Beleidswijzigingshistorie — versie, datum, auteur, samenvatting wijzigingen
├── research/
│   ├── _template-memo.md                      # Standaard juridische memo-indeling — issue, regel, analyse, conclusie
│   ├── regulatory-guidance/
│   │   ├── gdpr-enforcement-tracker.md        # DPA-handhaving en boetes — lopend logboek
│   │   ├── ccpa-amendments-summary.md         # CPRA en latere CCPA-wijzigingen en ingangsdatums
│   │   └── ai-regulation-watch.md             # EU AI Act, US EO op AI, NIST AI RMF — statustracker
│   └── memos/
│       ├── 2026-05-open-source-license-risk.md
│       └── 2026-04-employee-monitoring-limits.md
└── ip/
    ├── trademark/
    │   ├── trademark-register.md              # Alle merken — woord, logo, klassen, jurisdictie, verlengingsdatums
    │   └── filings/
    │       └── .gitkeep                       # USPTO/EUIPO-indieningen en kantooreracties
    ├── patents/
    │   ├── patent-register.md                 # Patentportefeuille — toepassingsnummer, status, jurisdictie, vervaldatum
    │   └── .gitkeep
    └── oss-license-log.md                     # Open-source-componentinventaris — licentietype, verplichtingen, risicobeoordeling
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/contract-review.md` | Slash-commando dat een contracttype (NDA, MSA, SOW, DPA, employment) en contracttekst aanneemt, en dan risicogemarkeerde redlines, ontbrekende standaardclausules en een risicosamenvattingswaarvan georganiseerd naar ernst retourneert |
| `.claude/commands/gdpr-check.md` | Slash-commando dat een gestructureerde GDPR/CCPA-gapanalyse uitvoert op een document, procesbeschrijving of productfunctie — voert gaten uit die zijn toegewezen aan specifieke artikelen met aanbevolen herstel |
| `.claude/commands/vendor-diligence.md` | Slash-commando voor vendorcontractbeoordeling — controleert DPA-adequaatheid, aansprakelijkheidscaps, indemniteit, gegevensverwijdering, controlerechten en subprocessoropenbaring tegen interne normen |
| `.claude/commands/compliance-audit.md` | Slash-commando dat een gestructureerde checklistaudit (SOC2 CC, GDPR Hoofdstuk IV, ISO 27001 Bijlage A) uitvoert en een gaprapport voert met controle-eigenaren en bewijsvereisten |
| `compliance/gdpr/ropa.md` | Artikel 30-Registratie van verwerkingsactiviteiten — vereist onder GDPR — volgt elke verwerkingsactiviteit, doel, juridische grondslag, gegevenscategorieën, ontvangers en retentieperiode |
| `compliance/soc2/evidence-tracker.md` | Wijst elke SOC2-controle toe aan het bewijsartefact, eigenaar, inzamelingsfrekentie en auditstatus — de meesttracker die wordt gebruikt tijdens Type II-auditveldwerk |
| `contracts/templates/vendor/vendor-dpa-template.docx` | Bedrijfs-DPA voor gebruik met alle gegevensverwerkers — GDPR Artikel 28 compliant, bevat SCC's als bijlage voor grensoverschrijdende overdrachten |
| `policies/changelog.md` | Wijzigingshistorie voor alle beleidsregels in policies/ — vereist voor ISO 27001-documentbeheer en SOC2-beleidsbeoordelingsbewijs |

## Snelscaffold

```bash
# Werkruimteroot maken
mkdir -p legal-compliance-workspace

# .claude-structuur maken
mkdir -p legal-compliance-workspace/.claude/commands

# Contractdirectorystructuur maken
mkdir -p legal-compliance-workspace/contracts/templates/nda
mkdir -p legal-compliance-workspace/contracts/templates/msa
mkdir -p legal-compliance-workspace/contracts/templates/sow
mkdir -p legal-compliance-workspace/contracts/templates/employment
mkdir -p legal-compliance-workspace/contracts/templates/vendor
mkdir -p legal-compliance-workspace/contracts/executed/ndas
mkdir -p legal-compliance-workspace/contracts/executed/msas
mkdir -p legal-compliance-workspace/contracts/executed/dpas

# Sjabloon voor actieve zaken maken
mkdir -p legal-compliance-workspace/active-matters/_template/docs
mkdir -p legal-compliance-workspace/active-matters/_template/research

# Compliancedirectories maken
mkdir -p legal-compliance-workspace/compliance/gdpr/consent-records
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/access-reviews
mkdir -p legal-compliance-workspace/compliance/soc2/evidence/vendor-reviews
mkdir -p legal-compliance-workspace/compliance/iso27001

# Beleidsregels-, onderzoeks- en IP-directories maken
mkdir -p legal-compliance-workspace/policies
mkdir -p legal-compliance-workspace/research/regulatory-guidance
mkdir -p legal-compliance-workspace/research/memos
mkdir -p legal-compliance-workspace/ip/trademark/filings
mkdir -p legal-compliance-workspace/ip/patents

# .gitkeep placeholders vullen
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

# Juridische vaardigheden installeren
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Opdrachtvoorbeelden in .claude/commands/ kopiëren
npx claudient add skill legal/contract-review --output legal-compliance-workspace/.claude/commands/contract-review.md
npx claudient add skill legal/nda-review --output legal-compliance-workspace/.claude/commands/nda-review.md
npx claudient add skill legal/gdpr-expert --output legal-compliance-workspace/.claude/commands/gdpr-check.md
npx claudient add skill legal/vendor-contract-review --output legal-compliance-workspace/.claude/commands/vendor-diligence.md
npx claudient add skill legal/soc2-compliance --output legal-compliance-workspace/.claude/commands/compliance-audit.md
npx claudient add skill legal/legal-research --output legal-compliance-workspace/.claude/commands/legal-research.md
```

## CLAUDE.md sjabloon

```markdown
# Juridische & Compliance Werkruimte — Claude Code Instructies

## Wat dit is

Deze werkruimte is de werkdirectory voor intern juridisch adviseurs en compliance-medewerkers.
Contracten worden georganiseerd per type in contracts/, actieve juridische zaken in active-matters/,
regelgevingscompliancerecords in compliance/, bedrijfsbeleidsregels in policies/ en juridische
onderzoeksmemo's in research/. Alle contractbeoordelingen, GDPR-analyses, vendor-onderzoeken en
beleidsontwikkelingen gebeuren via Claude Code-vaardigheden.

## Stack

- Clio / Ironclad — Zaakbeheer en contractlevenscyclus (sync-exports naar active-matters/)
- Westlaw / LexisNexis — Primair juridisch onderzoek; citeerbare bronnen in research/memos/ met volledige citatie
- DocuSign — eSignature-routing; logboek-envelopeID's in de relevante contractmap
- Microsoft 365 Word — Redlines en tracked changes; bewaar eindversies als .docx in contracts/
- Notion — Beleidswiki; houd policies/ gesynchroniseerd met Notion als autoritaire bron
- Slack — Interne juridische verzoeken via #legal-requests kanaal

## Gemeenschappelijke taken en exacte commando's

### Beoordeel een binnenkomend contract
```
/contract-review [type: NDA | MSA | SOW | DPA | employment | vendor]

Contract text:
[plak volledige contract of belangrijkste secties]

Context:
- Counterparty: [naam en rol — klant, leverancier, partner, werknemer]
- Our paper or their paper: [geef op]
- Deal size / risk level: [geschatte jaarlijkse herhaalde inkomsten of contractwaarde]
- Any known issues flagged by business: [optioneel]
```

### Redline een NDA
```
/nda-review

NDA text:
[plak volledige NDA]

Type: [mutual | one-way (we disclose) | one-way (they disclose)]
Counterparty: [naam]
Purpose of disclosure: [wat wordt gedeeld en waarom]
Any non-standard requests from counterparty: [optioneel]
```

### Voer een GDPR/CCPA-gapanalyse uit
```
/gdpr-check

Subject: [document | process | product feature | vendor]

Content:
[plak documenttekst, procbeschrijving of functiespec]

Jurisdiction focus: [GDPR | CCPA | both]
Data types involved: [persoonlijke gegevenscategorieën — bijv. gezondheid, financieel, gedrag]
```

### Beoordeel een vendorcontract en DPA
```
/vendor-diligence

Vendor: [naam en servicebeschrijving]
Contract type: [MSA | SaaS subscription | DPA | security addendum]

Contract text:
[plak contract of belangrijkste secties]

Vendor processes personal data: [yes | no]
Data categories: [lijst als ja]
Sub-processors disclosed: [yes | no | unknown]
```

### Ontwerp of update een bedrijfsbeleid
```
/policy-draft

Policy: [data classification | acceptable use | privacy | AI use | records retention | ethics]
Action: [draft from scratch | update existing | add section]

Context:
[plak bestaand beleid als update, of beschrijf wat het beleid moet aanpakken]

Trigger: [welke regelgevingsvereiste of incident deze update heeft uitgelokt]
```

### Schrijf een juridische onderzoeksmemo
```
/legal-research

Issue: [precieze juridische vraag]
Jurisdiction: [US federal | California | EU | specific state or country]
Context: [het feitelijke scenario — 2-3 zinnen]
Urgency: [standard | expedited]
Output format: [IRAC memo | summary bullet points | regulation comparison table]
```

### Voer een gestructureerde complianceaudit uit
```
/compliance-audit

Framework: [SOC2 Type II | GDPR Chapter IV | ISO 27001 Annex A | CCPA]
Scope: [full | specific controls — list control IDs]
Evidence available: [beschrijf welke records, exports en logs beschikbaar zijn]
Audit date or period: [datum of datumreeks]
```

## Conventies om te volgen

- Elke actieve zaak moet matter-summary.md en timeline.md hebben voordat documenten worden toegevoegd
- Alle redlines worden opgeslagen als YYYY-MM-DD-counterparty-[type]-redline.docx in de contractsmap
- GDPR's ropa.md is het Artikel 30-register — update het telkens wanneer een nieuwe verwerkingsactiviteit is goedgekeurd
- DSAR's geregistreerd in gdpr/data-subjects-register.md hebben een harde 30-daagse antwoorddeadline — markering bij inname
- SOC2 evidence-tracker.md wordt bijgewerkt aan het begin van elke auditveldwerkcyclus — overschrijf nooit geschiedenis
- Policy changelog.md wordt bijgewerkt telkens wanneer een beleid in policies/ is herzien — versie + datum vereist
- Juridische onderzoeksmemo's in research/memos/ volgen IRAC-indeling en bevatten volledige Westlaw/LexisNexis-citaties
- Uitgevoerde contracten gaan in contracts/executed/ — laat ze nooit permanent in active-matters/
- IP-merknaam-register.md verlengingsdatums worden driemaandelijks beoordeeld — markering verlenging vervalt binnen 90 dagen
- OSS-licentieverplichtingen in ip/oss-license-log.md worden gecontroleerd vóórdat een nieuw open-sourceonderdeel wordt verzonden
```

## MCP-servers

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

## Aanbevolen hooks

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

## Vaardigheden om te installeren

```bash
# Kernrechts vaardigheden
npx claudient add skill legal/contract-review
npx claudient add skill legal/nda-review
npx claudient add skill legal/gdpr-expert
npx claudient add skill legal/compliance-tracker
npx claudient add skill legal/vendor-contract-review
npx claudient add skill legal/brief-section-drafter
npx claudient add skill legal/soc2-compliance
npx claudient add skill legal/legal-research

# Alle juridische vaardigheden tegelijk installeren
npx claudient add skills legal
```

## Gerelateerd

- [Juridische & Compliance gids](../guides/for-legal-compliance.md)
- [Contractbeoordelingswerkstroom](../workflows/contract-review-cycle.md)
- [GDPR-compliancewerkstroom](../workflows/gdpr-compliance.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
