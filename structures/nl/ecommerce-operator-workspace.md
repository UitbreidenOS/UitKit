# E-commerce Operator Workspace — Projectstructuur

> Voor DTC-merkoperators die een Shopify-winkel runnen en behoefte hebben aan Claude voor dagelijkse optimalisatie van productaanbiedingen, concepten van campagnes, klantenservicesjablonen, leverancierscommunicatie en prestatierapportage over de volledige stack.

## Stack

- Shopify (winkelvoorkant, inventaris, bestellingen, metavelden)
- Klaviyo (e-mail- en SMS-flows, segmenten, campagnes)
- Meta Ads Manager + Google Ads (betaalde acquisitie)
- Triple Whale of Northbeam (multi-touch-attributie, MER, nCAC)
- Gorgias (ondersteuningstickets, macro's, CSAT)
- ShipBob of Flexport (3PL-fulfillment, tracking, retouren)
- QuickBooks Online (P&L, COGS, reconciliatie)
- Slack (teamcommunicatie, waarschuwingsrouting)

---

## Directoryboom

```
ecommerce-workspace/
├── .claude/
│   ├── settings.json                    # MCP servers, hooks, permissions
│   └── commands/
│       ├── listing-optimizer.md         # Rewrites a product title + description + SEO meta
│       ├── email-campaign.md            # Drafts Klaviyo campaign copy with subject variants
│       ├── ad-copy.md                   # Generates Meta and Google ad copy sets
│       ├── returns-policy.md            # Drafts or updates returns policy language
│       ├── supplier-update.md           # Generates supplier PO follow-up or reorder email
│       ├── weekly-performance.md        # Summarizes channel ROAS, CAC, and top SKUs
│       └── inventory-alert.md           # Flags SKUs below reorder threshold
├── CLAUDE.md                            # Workspace instructions (see template below)
├── products/
│   ├── active/
│   │   ├── sku-overview.csv             # Master SKU list with handle, title, price, cost, status
│   │   ├── descriptions/
│   │   │   ├── product-copy-template.md # Brand voice + structure for all PDPs
│   │   │   ├── seasonal-refresh-log.md  # What was updated and when, by SKU
│   │   │   └── [slug].md                # One file per product (e.g., cotton-tote-natural.md)
│   │   └── seo/
│   │       ├── meta-titles.csv          # Current title tag and proposed variants per product
│   │       ├── meta-descriptions.csv    # 155-char meta descriptions per product
│   │       └── keyword-targets.md       # Primary and secondary keyword map by collection
│   ├── drafts/
│   │   └── new-product-brief-template.md # Pre-launch checklist for new SKUs
│   └── archived/
│       └── discontinued-skus.csv        # Retired products with discontinuation reason
├── campaigns/
│   ├── email/
│   │   ├── briefs/
│   │   │   ├── campaign-brief-template.md   # Audience, goal, offer, CTA, send date
│   │   │   ├── 2026-q2-mothers-day.md
│   │   │   └── 2026-q3-back-to-school.md
│   │   ├── copy/
│   │   │   ├── welcome-series.md            # 3-email onboarding flow copy
│   │   │   ├── abandoned-cart.md            # 2-touch abandoned cart sequence
│   │   │   ├── post-purchase.md             # Review request + upsell flow
│   │   │   └── win-back-90d.md              # Win-back flow for 90-day lapsed buyers
│   │   └── results/
│   │       └── klaviyo-campaign-log.csv     # Campaign name, send date, OR, CTR, revenue
│   └── paid-ads/
│       ├── briefs/
│       │   ├── ad-brief-template.md         # Offer, audience, hook, CTA, budget, platform
│       │   ├── 2026-q2-prospecting-meta.md
│       │   └── 2026-q2-branded-search-gads.md
│       ├── copy/
│       │   ├── meta-primary-text.md         # Hook variants (5+) for Meta primary text
│       │   ├── meta-headlines.md            # Headline variants for Meta
│       │   ├── google-rsa-headlines.md      # 15 headlines for Google RSA
│       │   └── google-rsa-descriptions.md   # 4 descriptions for Google RSA
│       └── results/
│           └── attribution-notes.md         # Triple Whale / Northbeam anomalies and decisions
├── customer-service/
│   ├── templates/
│   │   ├── response-library.md          # 20+ macro drafts by ticket type
│   │   ├── where-is-my-order.md         # WISMO macro with tracking link placeholder
│   │   ├── damaged-item.md              # Damaged goods response + replacement flow
│   │   ├── wrong-item.md                # Wrong item received — resolution template
│   │   └── subscription-cancel.md       # Retention offer + cancellation acknowledgment
│   ├── policies/
│   │   ├── returns-policy.md            # Current customer-facing returns policy
│   │   ├── shipping-policy.md           # Carrier SLAs, international rules, cutoffs
│   │   └── refund-matrix.md             # Internal decision tree for edge cases
│   └── gorgias/
│       └── macro-import-template.csv    # Gorgias-format CSV for bulk macro upload
├── suppliers/
│   ├── vendor-directory.md              # Supplier name, contact, lead time, MOQ, terms
│   ├── po-template.md                   # Purchase order template with all required fields
│   ├── reorder-tracker.csv              # SKU, supplier, last PO date, next reorder date
│   └── comms/
│       ├── supplier-update-template.md  # Standard follow-up email template
│       └── [supplier-name]/
│           └── po-history.md            # Thread of POs and confirmations per supplier
├── reports/
│   ├── weekly/
│   │   ├── weekly-performance-template.md   # Blended ROAS, CAC, AOV, CR, top SKUs
│   │   └── 2026-w22-performance.md
│   ├── monthly/
│   │   ├── monthly-pl-template.md           # Revenue, COGS, gross margin, ad spend, net
│   │   ├── channel-performance-template.md  # Shopify vs. wholesale vs. Amazon by month
│   │   └── 2026-05-monthly.md
│   └── attribution/
│       └── triple-whale-export-notes.md     # How to read the exports, known discrepancies
└── sops/
    ├── new-product-launch.md            # End-to-end checklist: brief → listing → ads → email
    ├── inventory-reorder.md             # Trigger conditions, supplier contact, lead time buffer
    ├── returns-processing.md            # ShipBob returns workflow → restock or write-off
    ├── ad-account-audit.md              # Weekly paid media review checklist
    ├── klaviyo-health-check.md          # List hygiene, deliverability, flow audit cadence
    └── end-of-month-close.md            # QuickBooks reconciliation with Shopify payouts
```

---

## Belangrijke bestanden uitgelegd

| Path | Doel |
|---|---|
| `.claude/commands/listing-optimizer.md` | Schuine opdracht: neemt een producthandle of onbewerkte informatie en geeft een herschreven titel, beschrijving en metatags uit in merkstijl |
| `.claude/commands/weekly-performance.md` | Schuine opdracht: accepteert geplakte Triple Whale- of Northbeam-samenvatting en produceert een gestructureerd verhaal voor belanghebbenden |
| `products/active/sku-overview.csv` | Bron van waarheid voor alle live SKU's — voer dit in Claude in bij het uitvoeren van takenlijst- of inventaristakenlijsten |
| `campaigns/email/copy/welcome-series.md` | Ontwerp van 3-e-mailwelkoomflow — bewerk hier en plak vervolgens in Klaviyo-floweditor |
| `customer-service/policies/refund-matrix.md` | Interne beslissingsboom die Claude gebruikt bij het genereren van macro-reacties voor randgevallen |
| `suppliers/vendor-directory.md` | Leveranciercontacten en voorwaarden — Claude leest dit voordat hij enige leverancierscommunicatie opmaakt |
| `reports/weekly/weekly-performance-template.md` | Gestructureerde sjabloon die Claude elke maandag invult op basis van geplakte platformexports |
| `sops/new-product-launch.md` | De controlelijst die Claude doorloopt wanneer een nieuwe SKU van brief naar live gaat |

---

## Snel raamwerk

```bash
# Create the top-level workspace and all subdirectories
mkdir -p ecommerce-workspace/.claude/commands
mkdir -p ecommerce-workspace/products/active/descriptions
mkdir -p ecommerce-workspace/products/active/seo
mkdir -p ecommerce-workspace/products/drafts
mkdir -p ecommerce-workspace/products/archived
mkdir -p ecommerce-workspace/campaigns/email/briefs
mkdir -p ecommerce-workspace/campaigns/email/copy
mkdir -p ecommerce-workspace/campaigns/email/results
mkdir -p ecommerce-workspace/campaigns/paid-ads/briefs
mkdir -p ecommerce-workspace/campaigns/paid-ads/copy
mkdir -p ecommerce-workspace/campaigns/paid-ads/results
mkdir -p ecommerce-workspace/customer-service/templates
mkdir -p ecommerce-workspace/customer-service/policies
mkdir -p ecommerce-workspace/customer-service/gorgias
mkdir -p ecommerce-workspace/suppliers/comms
mkdir -p ecommerce-workspace/reports/weekly
mkdir -p ecommerce-workspace/reports/monthly
mkdir -p ecommerce-workspace/reports/attribution
mkdir -p ecommerce-workspace/sops

# Install Claudient skills
npx claudient add skill small-business/shopify-operations
npx claudient add skill small-business/ecommerce-seller
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill small-business/returns-handler
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro

# Install Claudient slash commands into .claude/commands/
npx claudient add command listing-optimizer
npx claudient add command email-campaign
npx claudient add command ad-copy
npx claudient add command returns-policy
npx claudient add command supplier-update
npx claudient add command weekly-performance
npx claudient add command inventory-alert

# Create placeholder CLAUDE.md
touch ecommerce-workspace/CLAUDE.md

# Seed key CSV and template files
touch ecommerce-workspace/products/active/sku-overview.csv
touch ecommerce-workspace/suppliers/vendor-directory.md
touch ecommerce-workspace/suppliers/reorder-tracker.csv
```

---

## CLAUDE.md sjabloon

```markdown
# E-commerce Operator Workspace

Dit is een Claude Code-werkruimte voor het beheren van een DTC-merk op Shopify. Claude helpt bij
optimalisatie van productaanbiedingen, concepten van campagnes, klantenservicesjablonen, leverancierscommunicatie
en wekelijkse prestatierapportage. Alle taken zijn operationeel — geen applicatiecode bevindt zich hier.

---

## Stack

- Shopify — winkelvoorkant, inventaris, bestellingen
- Klaviyo — e-mail- en SMS-campagnes en flows
- Meta Ads Manager + Google Ads — betaalde acquisitie
- Triple Whale (of Northbeam) — attributie, MER, blended ROAS
- Gorgias — ondersteuningstickets en macro's
- ShipBob (of Flexport) — 3PL-fulfillment en retouren
- QuickBooks Online — P&L, COGS, reconciliatie

---

## Mapconventies

- `products/active/` — alle live SKU's; bewerk beschrijvingen hier voordat u naar Shopify pusht
- `campaigns/` — brieven gaan in `briefs/`, afgewerkte kopie gaat in `copy/`
- `customer-service/policies/` — bron van waarheid voor alle taal van klantrichtlijn
- `suppliers/comms/[supplier-name]/` — één map per leverancier voor PO-geschiedenis
- `reports/weekly/` — één bestand per week genaamd `YYYY-Www-performance.md`
- `sops/` — operationele controlelijsten die Claude stap voor stap volgt

---

## Veelvoorkomende taken — exacte opdrachten

### Herschrijf een productaanbod
/listing-optimizer
Plak de huidige Shopify-producttitel, beschrijving, prijs en doelsleutelwoorden.
Claude geeft een herschreven titel (≤70 tekens), PDP-beschrijving (voordeel-geleid, 150-200 woorden),
en metatitel + metabeschrijving klaar om in Shopify te plakken.

### Concept van een e-mailcampagne
/email-campaign
Geef op: campagnedoel, target Klaviyo-segment, aanbod of hook, verzendatum.
Claude geeft 2 onderwerpregelvarianten (A/B), preview-tekst en volledige body copy terug.

### Advertentietekst genereren
/ad-copy
Geef op: platform (Meta of Google), campagnedoelstelling, product of aanbod, publiek.
Meta-uitvoer: 5 primaire teksthaken + 5 koppen. Google-uitvoer: 15 RSA-koppen + 4 beschrijvingen.

### Retourbeleid bijwerken
/returns-policy
Beschrijf de nodige wijziging (bijv. "verleng retourvenster van 30 tot 45 dagen voor vakantieorders").
Claude herschrijft het betreffende gedeelte en markeert eventuele downstreamgevolgen voor de terugbetaalgridmatrix.

### Concept van een e-mail aan leverancier
/supplier-update
Geef op: leveranciersnaam, PO-nummer of product, het probleem of verzoek.
Claude haalt contactgegevens uit `suppliers/vendor-directory.md` en stelt een professionele e-mail op.

### Wekelijk prestatierapport genereren
/weekly-performance
Plak uw Triple Whale- of Northbeam-wekelijkse samenvattingsexport.
Claude geeft een gestructureerd verhaal terug dat blended ROAS, nCAC, MER, top 5 SKU's op omzet en
één aanbevolen actie omvat.

### Waarschuwing voor inventaris activeren
/inventory-alert
Plak de SKU-lijst met huidige voorraadniveaus.
Claude markeert elke SKU onder de drempel voor hertaaksplanning in `suppliers/reorder-tracker.csv`
en stelt een aanbeveling voor hertaaksplanning op.

---

## Conventies

- Merkstijl is [MERKTOON INVOEGEN: bijv. "direct, warm, nooit dwingend"]. Pas toe op alle kopie.
- Productbeschrijvingen beginnen met het voordeel voor de klant, niet met de functie.
- Alle monetaire cijfers in USD tenzij anders vermeld.
- E-mails van leveranciers zijn professioneel en beknopt — geen inhoudsloze taal.
- Wekelijkse rapporten volgen de sjabloon in `reports/weekly/weekly-performance-template.md` exact.
- Bewerk niet `products/archived/` — discontinue SKU's zijn alleen-lezen records.
- Wanneer een beleidsbestand verandert, noteert u de datum en reden boven aan dat bestand.
```

---

## MCP servers

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
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/path/to/ecommerce-workspace"
      ]
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_OUTPUT_PATH\" == */reports/weekly/* ]]; then echo \"[hook] Weekly report written: $CLAUDE_TOOL_OUTPUT_PATH\" >> .claude/report-log.txt; fi'"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_PATH\" == */customer-service/policies/* ]]; then cp \"$CLAUDE_TOOL_INPUT_PATH\" \"${CLAUDE_TOOL_INPUT_PATH}.bak\" 2>/dev/null; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"Session ended at $(date)\" >> .claude/session-log.txt'"
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
npx claudient add skill small-business/ecommerce-seller
npx claudient add skill small-business/product-listing-optimizer
npx claudient add skill small-business/returns-handler
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/page-cro
```

---

## Gerelateerd

- [Guide: Claude for E-commerce Operators](../guides/for-ecommerce-operator.md)
- [Workflow: New Product Launch](../workflows/new-product-launch.md)
- [Workflow: Weekly Performance Review](../workflows/weekly-performance-review.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
