# E-commerce Brand Operations — Projectstructuur

> Voor DTC-merkteams die Shopify Plus gebruiken en Claude nodig hebben voor dagelijks productbeheer, email- en SMS-campagnes, advertentieteksten, voorraadbeheer, klantenserviceëscalatie en prestatieanalyses in een modern martech-stack.

## Stack

- Shopify Plus — storefront, productcatalogus, inventaris, metavelden, B2B
- Klaviyo — email flows, SMS-reeksen, segmenten, campagnebeheer
- Meta Ads Manager — prospecting, retargeting, DPA-campagnes
- Google Performance Max — shopping, zoeken, display, geünificeerde campagnes
- Triple Whale of Northbeam — multi-touch attributie, MER, nCAC, blended ROAS
- Gorgias — klantenservicetickets, macro's, CSAT, automatiseringsregels
- ShipBob — 3PL-afhandeling, WMS, returns-portal, gedistribueerde inventaris
- Recharge Payments — abonnementsplannen, factureringslogica, churnbeheer
- Yotpo — reviews, UGC, loyalty- en referraalprogramma's
- QuickBooks Online — P&L, COGS-tracking, Shopify-uitbetalingsafstemming

---

## Directorystructuur

```
ecommerce-brand/
├── .claude/
│   ├── settings.json                          # MCP-servers, hooks, machtigingen
│   └── commands/
│       ├── product-launch.md                  # End-to-end handleiding voor nieuw SKU-lancering
│       ├── listing-optimizer.md               # Titel, beschrijving, SEO-metadata per SKU herschrijven
│       ├── campaign-brief.md                  # Klaviyo- of advertentiecampagnebrief genereren
│       ├── email-copy.md                      # Campagne- of flow-email met onderwerpvarianten opstellen
│       ├── sms-copy.md                        # Klaviyo SMS met opt-out en tekencount opstellen
│       ├── ad-copy-meta.md                    # 5 primaire teksthaken + 5 koppen voor Meta
│       ├── ad-copy-pmax.md                    # Koppen, beschrijvingen en assets voor PMax
│       ├── inventory-check.md                 # SKU's onder reorder-drempel per supplier markeren
│       ├── reorder-draft.md                   # PO- of supplier-email opstellen van reorder-tracker
│       ├── cs-macro.md                        # Gorgias-macro genereren van tickettype + beleid
│       ├── escalation-handler.md              # Ticket triëren en escalatiepad toepassen
│       ├── subscription-retention.md          # Retentieaanbod voor Recharge cancel-intent opstellen
│       ├── review-response.md                 # Openbare reactie voor 1–3-sterrenreviews opstellen
│       └── weekly-report.md                   # Narratiefrapport van Triple Whale/Northbeam-export
├── CLAUDE.md                                  # Werkruimteinstructies (zie sjabloon hieronder)
├── products/
│   ├── sku-overview.csv                       # Master: handle, titel, variant, prijs, kosten, status, supplier
│   ├── listings/
│   │   ├── _brand-voice.md                    # Toonrichtlijn, verboden woorden, stijlregels voor alle kopie
│   │   ├── _pdp-template.md                   # Standaard PDP-structuur: hook, voordelen, specs, CTA
│   │   ├── cotton-canvas-tote-natural.md      # Voorbeeld: één bestand per actief SKU
│   │   ├── merino-crewneck-charcoal.md
│   │   └── stainless-tumbler-matte-black.md
│   ├── seo/
│   │   ├── meta-titles.csv                    # handle, huidige_titel, voorgestelde_titel, tekencount
│   │   ├── meta-descriptions.csv              # handle, huidige_beschrijving, voorgestelde_beschrijving, tekencount
│   │   ├── keyword-map.md                     # Primaire + secundaire trefwoorden per collectie
│   │   └── collection-page-copy.md            # SEO-geoptimaliseerde collectiepaginabeschrijvingen
│   ├── drafts/
│   │   ├── new-product-brief-template.md      # Pre-lanceringsformulier: concept, prijs, supplier, lanceringsdatum
│   │   ├── 2026-q3-canvas-crossbody.md        # Lopende brief voor aankomende lancering
│   │   └── 2026-q4-holiday-bundle.md
│   └── archived/
│       └── discontinued-skus.csv              # Afgeschafte SKU's met einddatum en reden
├── marketing/
│   ├── email-sms/
│   │   ├── sequences/
│   │   │   ├── welcome-series.md              # Emails 1–3: onboarding flow kopie + timingnotities
│   │   │   ├── abandoned-cart.md              # Emails 1–2 + SMS 1: carrière-hersteelsequentie
│   │   │   ├── post-purchase.md               # Emails 1–2: review-aanvraag + cross-sell
│   │   │   ├── win-back-90d.md                # 3-touch win-back voor 90-daagse inactieve kopers
│   │   │   ├── subscription-churn.md          # Recharge cancel-intent: aanbod + bewaarkopie
│   │   │   └── loyalty-milestone.md           # Yotpo points milestone geactiveerde email
│   │   └── campaigns/
│   │       ├── _campaign-brief-template.md    # Doelgroep, doel, aanbod, CTA, Klaviyo-segment, verzenddatum
│   │       ├── 2026-q2-mothers-day.md         # Definitieve brief + kopie voor meimaand-campagne
│   │       ├── 2026-q3-back-to-school.md
│   │       ├── 2026-q4-bfcm-email.md          # Black Friday / Cyber Monday campagnebestand
│   │       └── klaviyo-campaign-log.csv       # Campagnenaam, verzenddatum, lijstgrootte, OR, CTR, omzet
│   └── paid-ads/
│       ├── copy/
│       │   ├── meta-primary-text.md           # Hook-varianten (5+) per aanbod voor Meta primaire tekst
│       │   ├── meta-headlines.md              # 5+ kopvarianten voor Meta-advertentiesets
│       │   ├── pmax-headlines.md              # 15 koppen (≤30 teken) voor Google PMax-activumgroep
│       │   ├── pmax-descriptions.md           # 4 beschrijvingen (≤90 teken) voor PMax
│       │   └── dpa-catalog-copy.md            # Tekstregels voor dynamische productadvertenties
│       └── creative-briefs/
│           ├── _ad-brief-template.md          # Aanbod, hook-hoek, doelgroep, platform, budget, formaat
│           ├── 2026-q2-prospecting-meta.md    # Brief voor Q2 cold traffic Meta-campagnes
│           ├── 2026-q2-retargeting-meta.md
│           ├── 2026-q2-branded-pmax.md        # Brief voor branded search PMax-campagne
│           └── 2026-q3-ugc-creative-meta.md
│   └── social/
│       ├── content-calendar.md                # Maandelijks poststem met formaat en hook
│       └── caption-library.md                 # Herbruikbare onderschriften georganiseerd op product/thema
├── operations/
│   ├── inventory-sops/
│   │   ├── reorder-triggers.md                # Reorder-drempelregels per SKU-snelheid en levertijd
│   │   ├── reorder-tracker.csv                # SKU, supplier, last_po_date, next_reorder_date, qty
│   │   ├── low-stock-alert-process.md         # Stap-voor-stap: detecteren → PO opstellen → bevestigen → vastleggen
│   │   └── dead-stock-review.md               # Driemaandelijks proces voor langzaam bewegende voorraadbeslissingen
│   ├── fulfillment-sops/
│   │   ├── shipbob-receiving-checklist.md     # Stappen voor binnenkomende zendingen registreren in ShipBob WMS
│   │   ├── returns-processing.md              # ShipBob returns-portal → beoordelen → opnieuw voorraad of afschrijving
│   │   ├── shipbob-exception-handler.md       # Stappen voor verloren, beschadigde of vertraagde zendingen
│   │   └── distributed-inventory-rules.md    # Welke SKU's in welke ShipBob-warehouse en waarom
│   └── cs-playbooks/
│       ├── escalation-matrix.md               # Tickettype → tier 1 / tier 2 / oprichter-escalatiekaart
│       ├── wismo-playbook.md                  # WISMO: ShipBob controleren → Gorgias-macro → vervolgings-SLA
│       ├── damaged-item-playbook.md           # Beschadigde goederen: foto vereist → vervanging of teruggave
│       ├── wrong-item-playbook.md             # Verkeerd artikel: betaald label → verzending → log in Gorgias
│       ├── subscription-cancel-playbook.md    # Recharge cancel-intent → retentieaanbod → log churn
│       └── chargeback-playbook.md             # Bewijsverzameling, Shopify-reactie, geschilchronologie
├── analytics/
│   ├── weekly-dashboard.md                    # Sjabloon: MER, blended ROAS, nCAC, AOV, top SKU's, actie
│   ├── channel-benchmarks.md                  # Platform-niveau KPI-benchmarks per maand en kwartaal
│   ├── cohort-analysis.md                     # LTV cohorttabel: 30/60/90/180-daagse heraankoop per maand
│   ├── triple-whale-export-notes.md           # TW-exports lezen, bekende afwijkingen, overschrijvingen
│   └── northbeam-attribution-log.md           # Modelveranderingslogboek en wekelijkse anomalieopmerkingen
├── finance/
│   ├── p-and-l-template.md                    # Maandelijkse P&L: opbrengsten, COGS, brutomargebemiddeling, ad-spend, netto
│   ├── unit-economics.md                      # CAC, LTV, terugverdientijd, contributiewinstmarge per SKU
│   ├── quickbooks-reconciliation-sop.md       # Shopify-uitbetalingen → QB-inkomstenrekening → COGS-invoer
│   └── end-of-month-close.md                  # Checklist: QB reconciliatie, uitbetalingsmatch, margeverifiering
└── vendors/
    ├── supplier-directory.md                  # Naam, contactpersoon, MOQ, levertijd, betalingsvoorwaarden, valuta
    ├── po-template.md                          # Standaard inkooporder met alle vereiste velden
    └── [supplier-name]/
        ├── po-history.md                       # Alle PO's met datums, hoeveelheden, bevestigingen
        └── quality-notes.md                    # Defectpercentages, inspectieresultaten, onopgeloste problemen
```

---

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `products/sku-overview.csv` | SKU-master-register — voer dit bestand in voordat u listing-, inventaris- of supplier-taken uitvoert, zodat context nauwkeurig is |
| `products/listings/_brand-voice.md` | Toonrichtlijn die Claude toepast op alle listing-herschrijvingen, campagne-concepten en CS-macro's — bewerk dit eerst als merktoon verandert |
| `operations/cs-playbooks/escalation-matrix.md` | Beslissingsboom die Claude volgt bij `/escalation-handler` — mapt tickettype naar Tier 1, Tier 2 of oprichter-reactie |
| `operations/inventory-sops/reorder-tracker.csv` | Bron van waarheid voor wanneer opnieuw bestellen — Claude leest dit bij `/inventory-check` of `/reorder-draft` |
| `marketing/email-sms/campaigns/_campaign-brief-template.md` | Vereist briefformaat voordat Claude Klaviyo-campagnekopie ontwerpt — dwingt doelgroep-, segment-, aanbod- en CTA-velden af |
| `analytics/weekly-dashboard.md` | Gestructureerd sjabloon dat Claude maandagmorgen vult vanuit geplakte Triple Whale- of Northbeam-export |
| `finance/unit-economics.md` | CAC, LTV en contributiewinstmarge per SKU — Claude raadpleegt dit voor budget- of kanaalreclameaanbevelingen |
| `vendors/supplier-directory.md` | Supplier-contacten en voorwaarden — Claude haalt dit op voordat hij PO of supplier-email ontwerpt |

---

## Snel scaffold

```bash
# Alle directories aanmaken
mkdir -p ecommerce-brand/.claude/commands
mkdir -p ecommerce-brand/products/listings
mkdir -p ecommerce-brand/products/seo
mkdir -p ecommerce-brand/products/drafts
mkdir -p ecommerce-brand/products/archived
mkdir -p ecommerce-brand/marketing/email-sms/sequences
mkdir -p ecommerce-brand/marketing/email-sms/campaigns
mkdir -p ecommerce-brand/marketing/paid-ads/copy
mkdir -p ecommerce-brand/marketing/paid-ads/creative-briefs
mkdir -p ecommerce-brand/marketing/social
mkdir -p ecommerce-brand/operations/inventory-sops
mkdir -p ecommerce-brand/operations/fulfillment-sops
mkdir -p ecommerce-brand/operations/cs-playbooks
mkdir -p ecommerce-brand/analytics
mkdir -p ecommerce-brand/finance
mkdir -p ecommerce-brand/vendors

# Kernstubbestanden seeden
touch ecommerce-brand/products/sku-overview.csv
touch ecommerce-brand/products/listings/_brand-voice.md
touch ecommerce-brand/products/listings/_pdp-template.md
touch ecommerce-brand/products/seo/meta-titles.csv
touch ecommerce-brand/products/seo/meta-descriptions.csv
touch ecommerce-brand/marketing/email-sms/campaigns/_campaign-brief-template.md
touch ecommerce-brand/marketing/email-sms/campaigns/klaviyo-campaign-log.csv
touch ecommerce-brand/marketing/paid-ads/creative-briefs/_ad-brief-template.md
touch ecommerce-brand/operations/inventory-sops/reorder-tracker.csv
touch ecommerce-brand/operations/cs-playbooks/escalation-matrix.md
touch ecommerce-brand/analytics/weekly-dashboard.md
touch ecommerce-brand/analytics/channel-benchmarks.md
touch ecommerce-brand/analytics/cohort-analysis.md
touch ecommerce-brand/finance/p-and-l-template.md
touch ecommerce-brand/finance/unit-economics.md
touch ecommerce-brand/vendors/supplier-directory.md
touch ecommerce-brand/vendors/po-template.md
touch ecommerce-brand/CLAUDE.md

# Claudient-vaardigheden installeren
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/klaviyo-campaign
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill operations/inventory-management
npx claudient add skill operations/customer-service-escalation
npx claudient add skill data-ml/weekly-performance-report

# Schuine opdrachten installeren
npx claudient add command product-launch
npx claudient add command listing-optimizer
npx claudient add command campaign-brief
npx claudient add command email-copy
npx claudient add command sms-copy
npx claudient add command ad-copy-meta
npx claudient add command ad-copy-pmax
npx claudient add command inventory-check
npx claudient add command reorder-draft
npx claudient add command cs-macro
npx claudient add command escalation-handler
npx claudient add command subscription-retention
npx claudient add command review-response
npx claudient add command weekly-report
```

---

## CLAUDE.md-sjabloon

```markdown
# E-commerce Brand Operations-werkruimte

Dit is een Claude Code-werkruimte voor het bedrijven van een Shopify Plus DTC-merk. Claude verwerkt
optimalisatie van productlijsten, Klaviyo-campagne- en flow-kopie, Meta- en Google PMax-advertentieteksten,
voorraadbeheer, klantenserviceëscalatie, Recharge-abonnementsbehoud, Yotpo-beoordelingsreacties en wekelijkse prestatierapporten. Geen applicatiecode bevindt zich hier.

---

## Stack

- Shopify Plus — storefront, catalogus, inventaris, metavelden
- Klaviyo — email flows, SMS-reeksen, campagnebeheer
- Meta Ads Manager — prospecting, retargeting, DPA
- Google Performance Max — shopping, zoeken, display
- Triple Whale / Northbeam — attributie, MER, nCAC, blended ROAS
- Gorgias — supporttickets, macro's, CSAT, escalatieroutering
- ShipBob — 3PL-afhandeling, WMS, returns-portal
- Recharge Payments — abonnementen, facturering, cancel-intent flows
- Yotpo — reviews, UGC, loyalty en referral
- QuickBooks Online — P&L, COGS, Shopify-uitbetalingsafstemming

---

## Directoryconventies

- `products/sku-overview.csv` — voer dit bestand altijd in bij listing- of inventaristaken
- `products/listings/_brand-voice.md` — pas deze toonregels toe op alle kopie
- `marketing/email-sms/campaigns/_campaign-brief-template.md` — vereist voordat u Klaviyo-campagnekopie ontwerpt
- `marketing/paid-ads/creative-briefs/_ad-brief-template.md` — vereist voordat u advertentieteksten ontwerpt
- `operations/cs-playbooks/escalation-matrix.md` — volg dit bij het triëren van supporttickets
- `operations/inventory-sops/reorder-tracker.csv` — bron van waarheid voor reorder-timing
- `analytics/weekly-dashboard.md` — vul dit sjabloon elke maandagochtend vanuit platformexports
- `vendors/supplier-directory.md` — haal contactpersoon en voorwaarden hiervandaan voordat u PO of supplier-email ontwerpt

---

## Werkstroom voor lancering van nieuw product

Wanneer u wordt gevraagd een nieuw product te lanceren, volgt u deze stappen op volgorde:
1. Bevestig dat een volledige `products/drafts/[product-slug].md`-brief aanwezig is
2. Voer `/listing-optimizer` uit om titel, PDP-beschrijving, meta-titel, meta-beschrijving te produceren
3. Controleer of SKU is toegevoegd aan `products/sku-overview.csv` met juiste COGS en supplier
4. Voer `/campaign-brief` uit voor de lancering-email — gebruik Klaviyo-segment: Alle abonnees
5. Voer `/email-copy` uit met de goedgekeurde brief
6. Voer `/ad-copy-meta` en `/ad-copy-pmax` uit met de lancering-brief
7. Bevestig dat reorder-drempel is ingesteld in `operations/inventory-sops/reorder-tracker.csv`
8. Verplaats het conceptbestand van `products/drafts/` naar `products/listings/[slug].md`

---

## Campagnebriefproces

Voordat u campagnekopie schrijft, moet een volledige brief aanwezig zijn in de juiste map.
Voor Klaviyo-campagnes: `marketing/email-sms/campaigns/[campaign-slug].md`
Voor betaalde advertenties: `marketing/paid-ads/creative-briefs/[campaign-slug].md`

Een brief moet opgeven: doelgroep/segment, doel (verwerving / behoud / reactivering),
aanbod of hook, CTA, platform, verzenddatum of go-live-datum, en budget (voor betaald).
Claude zal geen kopie opstellen zonder een volledige brief — vraag om eventuele ontbrekende velden.

---

## Triggers voor voorraadbeheer opnieuw bestellen

Claude controleert `operations/inventory-sops/reorder-tracker.csv` en markeert herbestelling wanneer:
- Eenheden in voorraad dalen onder de reorder-drempel van de SKU (kolom: reorder_threshold)
- Dagen voorraad blijft (eenheden_in_hand / avg_daily_velocity) < supplier-levertijd + 7 dagen
Bij trigger: voer `/reorder-draft` uit met de SKU en supplier-naam uit supplier-directory.md.

---

## Escalatiepaden voor klantenservice

Volg `operations/cs-playbooks/escalation-matrix.md` voor alle ticket-triage.
Tier 1 (Gorgias-macro): WISMO, standaard retourverzoeken, vragen over maat
Tier 2 (CS lead-beoordeling): beschadigde goederen, verkeerd artikel, terugboeking van geschillen, abonnementsfacturering
Oprichter-escalatie: bedreigingen in media, juridische taal, bestellingen > $500, herhaalde fouten

Wanneer u `/escalation-handler` uitvoert, haal altijd het huidige beleid uit:
- `operations/cs-playbooks/[issue-type]-playbook.md` voor stap-voor-stap resolutie
- `operations/fulfillment-sops/returns-processing.md` voor fysieke retour
- Gorgias-ticketgeschiedenis als de klant eerder contact heeft opgenomen (noteer als herhaalcontact)

---

## Veelgebruikte taken — exacte opdrachten

### Een productlijsting optimaliseren
/listing-optimizer
Geef op: producthandle of slug, huidige titel, doeltrefwoorden (van `products/seo/keyword-map.md`).
Output: herschreven titel (≤70 teken), PDP-beschrijving (voordeel-geleide, 150–200 woorden),
meta-titel (≤60 teken), meta-beschrijving (≤155 teken).

### Een Klaviyo-emailcampagne opstellen
/email-copy
Geef op: link naar de volledige brief in `marketing/email-sms/campaigns/`.
Output: 2 onderwerpvarianten (A/B), voorbeeldtekst, volledige kopie in Klaviyo-indeling.

### Een Klaviyo SMS opstellen
/sms-copy
Geef op: campagnedoel, aanbod, Klaviyo-segment, verzenddatum.
Output: SMS-body (≤160 teken inclusief opt-out) en fallback met 2 delen als >160 teken.

### Meta-advertentieteksten genereren
/ad-copy-meta
Geef op: link naar de brief in `marketing/paid-ads/creative-briefs/`.
Output: 5 primaire teksthaken, 5 koppen (≤40 teken elk), 2 linkbeschrijvingsvarianten.

### Google PMax-activumgroepkopie genereren
/ad-copy-pmax
Geef op: link naar de brief in `marketing/paid-ads/creative-briefs/`.
Output: 15 koppen (≤30 teken), 4 beschrijvingen (≤90 teken), lange kop (≤90 teken).

### Inventaris controleren en herstellen opnieuw bestellen
/inventory-check — plak huidige ShipBob-voorraadenexport
/reorder-draft — geef SKU en supplier-naam op na alert

### Supportticket triëren
/escalation-handler
Geef op: Gorgias-ticket-ID of plak de ticketbody.
Claude geeft terug: tier-toewijzing, handleiding te volgen, macro of conceptversie.

### Wekelijks prestatiesrapport genereren
/weekly-report
Plak de Triple Whale- of Northbeam-export van wekelijkse samenvatting.
Output: gestructureerde vertelsel over MER, blended ROAS, nCAC, AOV, top 5 SKU's, één actie-item.

---

## Conventies

- Alle geldbedragen in USD tenzij een supplier-voorwaarden anders bepalen.
- Productenkopie begint met het voordeel voor de klant, niet de productfunctie.
- Klaviyo-segmenten zijn correct geschreven exact zoals ze in de Klaviyo UI voorkomen.
- Bewerk niet `products/archived/` — records zijn alleen-lezen.
- Bij het bijwerken van een beleidsbestand, voeg een gedateerde opmerking toe aan de bovenkant van dat bestand.
- Wekelijkse dashboardbestanden krijgen de naam `YYYY-Www-performance.md` (bijv. `2026-W22-performance.md`).
```

---

## MCP-servers

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": ["-y", "@shopify/mcp-server"],
      "env": {
        "SHOPIFY_ACCESS_TOKEN": "${SHOPIFY_ACCESS_TOKEN}",
        "SHOPIFY_SHOP_DOMAIN": "${SHOPIFY_SHOP_DOMAIN}"
      }
    },
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "${KLAVIYO_API_KEY}"
      }
    },
    "gorgias": {
      "command": "npx",
      "args": ["-y", "@gorgias/mcp-server"],
      "env": {
        "GORGIAS_DOMAIN": "${GORGIAS_DOMAIN}",
        "GORGIAS_API_KEY": "${GORGIAS_API_KEY}",
        "GORGIAS_API_EMAIL": "${GORGIAS_API_EMAIL}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/path/to/ecommerce-brand"
      ]
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

---

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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_PATH\"; if [[ \"$FILE\" == */analytics/weekly-dashboard* || \"$FILE\" == */analytics/*performance* ]]; then echo \"[$(date +%Y-%m-%d)] Report written: $FILE\" >> .claude/report-log.txt; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_PATH\"; if [[ \"$FILE\" == */marketing/paid-ads/copy/* || \"$FILE\" == */marketing/email-sms/campaigns/* ]]; then echo \"[$(date +%Y-%m-%d)] Campaign asset written: $FILE\" >> .claude/campaign-log.txt; fi'"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_PATH\"; if [[ \"$FILE\" == */operations/cs-playbooks/* || \"$FILE\" == *escalation-matrix* ]]; then cp \"$FILE\" \"${FILE}.bak\" 2>/dev/null; echo \"[$(date +%Y-%m-%d)] Backup created: ${FILE}.bak\"; fi'"
          }
        ]
      }
    ]
  }
}
```

---

## Vaardigheden om te installeren

```bash
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/klaviyo-campaign
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
npx claudient add skill operations/inventory-management
npx claudient add skill operations/customer-service-escalation
npx claudient add skill data-ml/weekly-performance-report
npx claudient add skill productivity/vendor-evaluator
```

---

## Verwant

- [Guide: Claude for E-commerce Operators](../guides/for-ecommerce-operator.md)
- [Workflow: New Product Launch](../workflows/new-product-launch.md)
- [Workflow: Weekly Performance Review](../workflows/weekly-performance-review.md)
- [Workflow: Inventory Reorder](../workflows/inventory-reorder.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
