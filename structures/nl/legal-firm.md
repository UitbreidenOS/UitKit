# Advocatenkantoor / Juridische Praktijk Activiteiten — Projectstructuur

> Voor advocaten en juridisch personeel van een klein tot middelgroot advocatenkantoor dat zich bezighoudt met zaken-intake, juridisch onderzoek, documentconcepten, facturering, klantencommunicatie, termijntracking en compliance — met advocaat-cliëntprivilege op elke laag afgedwongen.

## Stack

- **Clio** — Zaakbeheer, contactendatabase, tijdregistratie, facturering, trustaccounting, cliëntportaal
- **Westlaw** of **LexisNexis** — Primair juridisch onderzoek, rechtspraakgegevens, wettelijke interpretatie, KeyCite/Shepard's citatiecontrole
- **Microsoft 365** — Word (conceptontwerp, redactions), Outlook (cliënt-/tegenpartijcommunicatie), Teams (interne samenwerking)
- **NetDocuments** of **iManage** — Documentbeheersysteem (DMS); alle zaken en geclassificeerde documenten bevinden zich uitsluitend hier
- **DocuSign** — eSignature-routering voor geëxecuteerde overeenkomsten, engagement letters, schikkingsdocumenten
- **QuickBooks** — Kantoorboekhouding, operationele rekeningafstemming, leveranciersboekhouding, salarisadministratie
- **Claude Code** — Documentconcepten, onderzoeksmemosjablonen, checklistgeneratie, facturering SOP-documentatie, niet-geclassificeerde workflowautomatisering

## Directorystructuur

```
legal-firm-workspace/
├── .claude/
│   ├── CLAUDE.md                                  # Privilegekennisgevingen, stack, opdrachten, afspraken
│   ├── settings.json                              # MCP-servers, hooks, gereedschapsmachtigingen
│   └── commands/
│       ├── matter-intake.md                       # /matter-intake — checklist voor nieuwe zaak-intake en conflictzoekprompt genereren
│       ├── research-memo.md                       # /research-memo — juridisch onderzoeksmemo met IRAC-structuur opbouwen
│       ├── draft-contract.md                      # /draft-contract [type] — eerste contractconcept uit zaaktype + sleutelvoorwaarden
│       ├── redline-review.md                      # /redline-review — ontbrekende clausules, eenzijdige voorwaarden, risicoprovisies markeren
│       ├── billing-entry.md                       # /billing-entry — notities omzetten in ABA-taakcode-compatibele tijdingangen
│       ├── deadline-check.md                      # /deadline-check — verjaring en dossierdeadlines van zaaknotities oppervlaktig maken
│       ├── cite-check.md                          # /cite-check — zaken markeren die KeyCite- of Shepard's-verificatie nodig hebben
│       └── client-update.md                       # /client-update — cliëntstatusupdatebericht opstellen (geen geclassificeerde feiten in prompt)
├── templates/
│   ├── contracts/
│   │   ├── nda-mutual.docx                        # Wederzijdse NDA — bilaterale vertrouwelijkheid, standaard 2-jarige termijn
│   │   ├── nda-one-way.docx                       # Eenzijdige NDA — openbarende partij begunstigd
│   │   ├── services-agreement.docx                # Master services agreement met SOW-aanhangsel
│   │   ├── independent-contractor.docx            # IC-overeenkomst met IP-overdracht en non-solicitation
│   │   ├── asset-purchase.docx                    # Aankoop van activaovereenkomst met plannenenplaceholder
│   │   └── settlement-agreement.docx              # Schikking en kwijting — algemene en ADEA-compatibele versies
│   ├── litigation-docs/
│   │   ├── complaint-template.docx                # Federale civiele klacht — titel, jurisdictie, bezwaren, verzoeken
│   │   ├── answer-template.docx                   # Antwoord met beweerdelijke verdedigingen
│   │   ├── motion-to-dismiss.docx                 # 12(b)(6) motie-shell — argumentsecties gelabeld
│   │   ├── summary-judgment-motion.docx           # MSJ met verklaarde feitenverklaring-indeling
│   │   ├── discovery-requests/
│   │   │   ├── interrogatories-plaintiff.docx     # Standaard eisersinterrogatoriums, 25 RFA's
│   │   │   ├── interrogatories-defendant.docx     # Standaard verweerder-interrogatoriums
│   │   │   ├── rfp-plaintiff.docx                 # Verzoeken voor productie — eisersset
│   │   │   └── rfp-defendant.docx                 # Verzoeken voor productie — verweerdersstelling
│   │   └── deposition-notice.docx                 # Opmerking van depositie met duces tecum-aanhangsel
│   ├── corporate/
│   │   ├── articles-of-incorporation.docx         # Delaware C-corp articles shell
│   │   ├── bylaws-corporation.docx                # Vennootschapsstatuten — standaardbepalingen
│   │   ├── llc-operating-agreement.docx           # Eenlid en meerledige LLC OA-varianten
│   │   ├── board-consent.docx                     # Schriftelijke toestemming in plaats van vergadering — bestuurshandeling
│   │   ├── shareholder-consent.docx               # Schriftelijke toestemming — aandeelhouderhandeling
│   │   └── stock-purchase-agreement.docx          # Series seed / angel round SPA met verklaringen
│   ├── employment/
│   │   ├── offer-letter-exempt.docx               # FLSA-vrijgestelde aanbiedingsbrief met at-will-clausule
│   │   ├── offer-letter-nonexempt.docx            # Niet-vrijgestelde aanbiedingsbrief met overwerkkennisgeving
│   │   ├── separation-agreement.docx              # Vertrekregeling en kwijting — 21-daagse bedenktijd
│   │   ├── noncompete-agreement.docx              # Staatswet-specifieke non-concurrentiebeding (markeervaardig)
│   │   └── employee-handbook-shell.docx           # Beleidsecties: verlof, intimidatie, gedragscode
│   └── real-estate/
│       ├── purchase-agreement-residential.docx    # Residentiële PSA met geschrevenkantine-alinea's
│       ├── purchase-agreement-commercial.docx     # Commerciële PSA met due diligence-periode
│       ├── lease-commercial.docx                  # NNN-commerciële huurovereenkomst — eigenaarvoorkeur
│       ├── lease-residential.docx                 # Residentiële huurovereenkomst — rechtsgebied-neutraal shell
│       └── closing-checklist.docx                 # Sluitingschecklist voor onroerend goed met titel-/escrow-stappen
├── research/
│   ├── memo-template.md                           # IRAC-memoindeling: Kwestie, Regel, Analyse, Conclusie
│   ├── case-law-notes/
│   │   ├── _index.md                              # Lopende index van aangehaalde zaken per onderwerp
│   │   ├── contracts/                             # Samenvattingen van contractenrecht en uitspraken
│   │   ├── employment/                            # Notities arbeidsrecht
│   │   ├── corporate/                             # Ondernemingscode rechtspraak
│   │   └── litigation/                            # Procedurele en bewijsrechtspraak
│   └── regulatory-summaries/
│       ├── state-noncompete-map.md                # Staat-voor-staat afdwingbaarheidstabel (laatste updateringsdatum vereist)
│       ├── data-privacy-overview.md               # CCPA, staatswetlandschap — geen cliëntspecifieke gegevens
│       └── bar-admission-rules.md                 # Pro hac vice-vereisten per rechtsgebied
├── checklists/
│   ├── matter-opening.md                          # Nieuwe zaak: conflictcontrole, engagement letter, retainer, Clio-instelling
│   ├── conflicts-check.md                         # Stap-voor-stap conflictzoekprotocol in Clio + laterale inhuuronthullingen
│   ├── due-diligence.md                           # M&A / transactie due diligence — organisatorisch, IP, geschil, contracten
│   ├── closing.md                                 # Transactie sluitingschecklist — voorsluitend, sluitingsdag, na-sluitend
│   ├── litigation-hold.md                         # Litigatieblokkering kennisgevingsstappen en vereisten voor documentbehoud
│   └── matter-closing.md                          # Zaaksluiting: definitieve facturering, geëxecuteerde documenten voor DMS, behoudsadvies
├── billing/
│   ├── time-entry-sops.md                         # ABA-taakcodes, UTBMS-codes, narratiefrichtlijnen, minimale stappen
│   ├── invoice-review-checklist.md                # Voorafgaande factuurcontrole: afschrijvingen, tariefverificatie, narratiefkwaliteit, vertrouwen
│   ├── rate-schedule.md                           # Tariefschemavoor timekeeper per rol (partner, advocaat, paralegal, griffier)
│   └── trust-accounting-quick-ref.md              # IOLTA-aanbetaling/uitbetaalingsregels, herinnering driepartsafstemming
├── compliance/
│   ├── bar-requirements.md                        # CLE-credits, jaarlijkse registratiedeadlines per rechtsgebied
│   ├── trust-accounting-sop.md                    # Volledige IOLTA SOP: depotregels, uitbetaling, afstemming, controlesleuf
│   ├── malpractice-checklist.md                   # Reikwijdte engagement, diarizeringstermijnen, conflicten, bestandsbehoud
│   ├── conflicts-policy.md                        # Kantourbeleidsconflicten: lateraal, prospectieve cliënt, toegerekende disqualificatie
│   └── data-security-policy.md                    # Wachtwoordbeleid, DMS-toegangscontroles, breukresponstappen
└── marketing/
    ├── bio-templates.md                           # Advocaatbio-indeling: onderwijs, toepassingswerkdagen, praktijkgebieden, publicaties
    ├── practice-area-descriptions.md              # Webklaar praktijkgebiedomschrijvingen — beoordeling op adverteerderswettelijkheidsnalevering
    └── client-alert-template.md                  # Waarschuwingsformaat voor regelgeving/regelgeversvragen voor cliëntdistributie
```

## Sleutelbestanden verklaard

| Pad | Doel |
|---|---|
| `.claude/CLAUDE.md` | Privilege-kennisgeving, stack-overzicht, opdrachtindex, vertrouwelijkheidregels — lezen voor elke sessie |
| `.claude/commands/matter-intake.md` | Genereert de volledige checklist voor nieuwe zaak: stappen voor conflictzoek, engagement letter-trigger, Clio-zaakinstelling, inhouding verzameling |
| `.claude/commands/billing-entry.md` | Zet ruwe tijdnotities om in ABA-taakcode-compatibele narratieven; dwingt minimale kabinetsstap en narratiefkwaliteitsregels af |
| `checklists/matter-opening.md` | Gezaghebbende stap-voor-stap-procedure voor zaakopening — conflicten, engagement letter, retainer, DMS-mappenmaaksel |
| `checklists/conflicts-check.md` | Gestructureerd conflictzoekprotocol met betrekking tot Clio-database, tegenstrijdige partijen, schermen voor zijdelingse inhuur |
| `billing/time-entry-sops.md` | UTBMS/ABA-taakcodes, minimale factureerbare eenheid, narratieve do's en don'ts — het factureringsstijlboek |
| `compliance/trust-accounting-sop.md` | Volledige IOLTA SOP: wat in vertrouwen gaat, afdwingingscontroles, driepartsafstemming, voorbereiding op staafaudits |
| `research/memo-template.md` | IRAC-gestructureerde onderzoeksmemo-shell — dwingt citatiecontroleherinnering af vóór voltooiing |
| `templates/litigation-docs/complaint-template.docx` | Federale civiele klachtshell met titel, rechtsmachtverklaringen, veroorzaakingen en verzoekingsverlangen |
| `compliance/malpractice-checklist.md` | Pre-zaak- en voortdurende controles voor beroepsfoutrisico: scopedocumentatie, diarizeringstermijnen, conflictvernieuwing, bestandsbehoud |

## Snelsteiger

```bash
# Maak de workspace-root
mkdir -p legal-firm-workspace && cd legal-firm-workspace

# .claude directory en opdrachten
mkdir -p .claude/commands

# Sjablonen naar zaaktype
mkdir -p templates/contracts
mkdir -p templates/litigation-docs/discovery-requests
mkdir -p templates/corporate
mkdir -p templates/employment
mkdir -p templates/real-estate

# Onderzoek
mkdir -p research/case-law-notes/contracts
mkdir -p research/case-law-notes/employment
mkdir -p research/case-law-notes/corporate
mkdir -p research/case-law-notes/litigation
mkdir -p research/regulatory-summaries

# Checklists
mkdir -p checklists

# Facturering
mkdir -p billing

# Compliance
mkdir -p compliance

# Marketing
mkdir -p marketing

# Steiger belangrijkste markdown-bestanden
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

# .claude opdrachten
touch .claude/commands/matter-intake.md
touch .claude/commands/research-memo.md
touch .claude/commands/draft-contract.md
touch .claude/commands/redline-review.md
touch .claude/commands/billing-entry.md
touch .claude/commands/deadline-check.md
touch .claude/commands/cite-check.md
touch .claude/commands/client-update.md

# Installeer relevante Claudient-vaardigheden
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

echo "Steiger voltooid. Vul CLAUDE.md in vóór eerste gebruik."
```

## CLAUDE.md-sjabloon

```markdown
# Advocatenkantoor / Juridische Praktijk Activiteiten — Werkplek

## KENNISGEVING ADVOCAAT-CLIËNTPRIVILEGE EN VERTROUWELIJKHEID

**Deze werkplek bevat GEEN cliëntsakendetails, zaakfeiten of geclassificeerde communicatie.**

Alle zaakbestanden, cliëntdocumenten, correspondentie, onderzoeksmemo's gekoppeld aan actieve zaken
en inhoud die onder het advocaat-cliëntprivilege of de werkproductdoctrine valt, wordt opgeslagen
uitsluitend in het documentbeheersysteem (DMS) van het kantoor:
- NetDocumenten: https://vault.netdocuments.com
- iManage: https://app.imanage.com

Plak GEEN cliëntnamen, zaainummers gekoppeld aan echte zaken, namen van tegenpartijen, zaakfeiten,
schikkingsbedragen of geclassificeerde inhoud in Claude Code-aanwijzingen. Deze werkplek
is alleen voor sjablonen, SOP's, checklists en inhoud die niet specifiek is voor zaken.

Bij twijfel: als het op een privilege-logboek zou verschijnen, hoort het hier niet thuis.

---

## Wat deze werkplek is

Een niet-geclassificeerde activiteitenwerkplek voor het kantoor. Advocaten en personeel gebruiken dit voor:
- Documentsjablonen opstellen en onderhouden (contracten, litigatieshells, bedrijfsformulieren)
- Facturerings- en ingang-werkschema's met ABA-taakcodes uitvoeren
- Nalevingsdeadlines beheren (CLE, IOLTA-afstemming, beroepsfoutchecklist)
- Onderzoeksmemo's produceren (IRAC-structuur, citatiecontrole-herinneringen)
- Marketinginhoud van het kantoor onderhouden (bio's, praktijkgebiedomschrijvingen)

Alle opdrachten werken op sjablonen en SOP's — nooit op live cliëntgegevens.

---

## Stack

- **Clio** — Zaakbeheer, tijdregistratie, facturering, trustaccounting, cliëntportaal
- **Westlaw / LexisNexis** — Juridisch onderzoek; alle aangehaalde zaken moeten worden KeyCited of Shepardized vóór gebruik
- **Microsoft 365** — Word (concepten/redactions), Outlook (cliëntcomm), Teams (intern)
- **NetDocumenten / iManage** — DMS; alle geclassificeerde zaakbestanden hier opgeslagen
- **DocuSign** — Geëxecuteerde overeenkomstonzending en -opslag
- **QuickBooks** — Kantooropperationele rekening, salarisadministratie, AP

---

## Schuine opdrachten

| Opdracht | Wat het doet |
|---|---|
| `/matter-intake` | Genereert nieuwe zaakchecklist: conflicten, engagement letter, retainer, Clio-instelling |
| `/research-memo` | Steiger IRAC-memo met citaatcontrole-herinnering en bronplaceholder |
| `/draft-contract [type]` | Eerste contractconcept uit type (NDA, MSA, OA, PSA) + sleutelvoorwaarden |
| `/redline-review` | Herzieningen geplakte contracttaal voor ontbrekende clausules en eenzijdige voorwaarden |
| `/billing-entry` | Zet ruwe tijdnotities om in ABA/UTBMS-compatibele narratieveninvoeren |
| `/deadline-check` | Toont verjaring, antwoorddeadlines en dossierdata uit notities |
| `/cite-check` | Vlag zaken in een memo die KeyCite- of Shepard's-verificatie nodig hebben |
| `/client-update` | Concepten cliëntstatusupdatebericht — geen geclassificeerde zaakfeiten in prompt |

---

## Vereiste Cite-controle

Elk juridisch onderzoeksmemo of sectieconcept dat door Claude Code is geproduceerd, is slechts een EERSTE CONCEPT.
Elke rechtspraakverwijzing moet in Westlaw KeyCite of LexisNexis Shepard's worden geverifieerd vóórdat
het document het kantoor verlaat. Claude Code heeft geen live-toegang tot rechtsprakadatabases
en kan niet bevestigen of een zaak is overruled, onderscheiden of beperkt.

Voeg deze voettekst toe aan elke onderzoeksuitvoer: "ONTWERP — ALLE CITATEN VEREISEN KEYCITE/SHEPARD'S-VERIFICATIE VÓÓR GEBRUIK"

---

## Factureringsverdragen

- Minimale factureerbare eenheid: 0,1 uur (6 minuten)
- UTBMS-taakcodes gebruiken: L100–L500 voor litigatie; A100–A300 voor bedrijfsstructuur/transactioneel
- Tijdingangsnarra's moeten het uitgevoerde werk beschrijven, niet alleen de taakencategorie
- Trustaccountinvoeren vereisen zaainummer en cliëntmachtigingsverwijzing
- Voorafgaande factuurcontrole: voer `/billing-entry`-uitvoer uit via invoice-review-checklist.md vóór verzending

---

## Conflictcontroleprotocol

Voer voorafgaand aan elke zaakopening een conflictcontrole uit tegen:
1. Clio-contactendatabase (cliëntnaam, tegenpartij, gerelateerde entiteiten)
2. Scherm voor laterale inhuurverhaal (onderhouden door kantoormanager)
3. Intakeloga prospectieve cliënt

Documenteer het resultaat van de conflictcontrole in Clio voordat de engagement letter wordt verzonden.
Zie checklists/conflicts-check.md voor de volledige procedure.

---

## Bestandsbehoud en zaaksluiting

Gesloten zaakbestanden worden bewaard volgens het behoudschema van het kantoor (zie compliance/malpractice-checklist.md).
Fysieke en elektronische bestanden gaan naar de DMS-archiefmap bij zaaksluiting.
Sla gesloten zaakdocumenten niet op in deze werkplek.
```

## MCP-servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/Users/shared/legal-firm-workspace"],
      "comment": "Scoped to workspace root only — no access to DMS mount points or client file shares"
    },
    "microsoft-365": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-msgraph"],
      "env": {
        "TENANT_ID": "${M365_TENANT_ID}",
        "CLIENT_ID": "${M365_CLIENT_ID}",
        "CLIENT_SECRET": "${M365_CLIENT_SECRET}"
      },
      "comment": "Access to Teams channels, Outlook drafts, SharePoint template library — scoped to firm tenant"
    },
    "clio": {
      "command": "npx",
      "args": ["-y", "@clio/mcp-server"],
      "env": {
        "CLIO_CLIENT_ID": "${CLIO_CLIENT_ID}",
        "CLIO_CLIENT_SECRET": "${CLIO_CLIENT_SECRET}",
        "CLIO_REGION": "us"
      },
      "comment": "Read-only access to matter list, contact database, and time entry codes — no write access to trust accounts"
    },
    "docusign": {
      "command": "npx",
      "args": ["-y", "@docusign/mcp-server"],
      "env": {
        "DOCUSIGN_ACCOUNT_ID": "${DOCUSIGN_ACCOUNT_ID}",
        "DOCUSIGN_INTEGRATION_KEY": "${DOCUSIGN_INTEGRATION_KEY}",
        "DOCUSIGN_BASE_URL": "https://na3.docusign.net/restapi"
      },
      "comment": "Envelope status lookup and template retrieval only — no send capability from Claude Code"
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
            "command": "grep -i 'privilege\\|confidential\\|attorney.client\\|work product' \"$CLAUDE_TOOL_OUTPUT_PATH\" && echo '[WARN] Possible privileged content detected in written file — review before saving' || true",
            "comment": "Scan any file written by Claude Code for privilege keywords and surface a warning"
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
            "command": "echo '[CHECK] Writing to: '\"$CLAUDE_TOOL_INPUT_PATH\"' — confirm this is a template or SOP file, not a matter document'",
            "comment": "Log every file write with a reminder to confirm it is non-privileged content"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo '[REMINDER] End of session — any drafted research memos require cite verification in Westlaw KeyCite or LexisNexis Shepards before use'",
            "comment": "Surfaces the cite-check reminder at the end of every Claude Code session"
          }
        ]
      }
    ]
  }
}
```

## Te installeren vaardigheden

```bash
# Document en procesworkflows
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/vendor-evaluator

# Onderzoeks- en analysegegevens
npx claudient add skill productivity/exec-briefing

# Cliënt- en zakelijke ontwikkeling
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/investor-update

# Facturering en tijdbeheer
npx claudient add skill productivity/engineering-strategy
```

## Gerelateerd

- [Legal & Compliance Workspace guide](../structures/legal-compliance-workspace.md)
- [Operations Manager Workspace](../structures/operations-manager-workspace.md)
- [Finance Analyst Workspace](../structures/finance-analyst-workspace.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
