# Real Estate Agent Workspace — Project Structure

> For a residential or commercial real estate agent managing listings, buyers, sellers, offers, and closing pipelines end-to-end — from first contact to funded deal — with Follow Up Boss, DocuSign, MLS/RPR, and Google Workspace as the operating stack.

## Stack

- **Follow Up Boss** or **Wise Agent** — CRM, lead routing, pipeline stages, drip campaigns, task automation
- **Zillow Premier Agent** / **Realtor.com** — Listing portals, lead capture, showing requests, market exposure
- **DocuSign** — Purchase agreements, listing agreements, addenda routing, eSignature audit trail
- **Google Workspace** — Gmail (client email threads), Google Drive (file storage), Google Calendar (showings)
- **RPR (Realtors Property Resource)** or **MLS** — Market data, comp pulls, CMAs, neighborhood stats
- **BombBomb** — Video email for listing announcements, buyer tour recaps, offer presentation follow-up
- **Canva** — Just-listed flyers, social media graphics, buyer presentation decks, listing brochures
- **Claude Code** — Listing copy, CMA narrative, offer drafts, client follow-up emails, showing summaries

## Directory tree

```
real-estate-workspace/
├── .claude/
│   ├── CLAUDE.md                              # Workspace instructions (paste the template below)
│   ├── settings.json                          # MCP servers, hooks, permissions
│   └── commands/
│       ├── listing-create.md                  # /listing-create — MLS-ready description + marketing copy from property details
│       ├── cma-report.md                      # /cma-report — comparable analysis narrative + price recommendation
│       ├── offer-draft.md                     # /offer-draft — purchase agreement cover email + offer strategy summary
│       ├── client-followup.md                 # /client-followup — personalized follow-up email from CRM notes
│       ├── showing-notes.md                   # /showing-notes — structured showing feedback from raw notes
│       ├── market-update.md                   # /market-update — neighborhood market snapshot for client nurture
│       └── buyer-package.md                   # /buyer-package — buyer presentation deck outline + search criteria doc
├── listings/
│   ├── active/
│   │   ├── _template/                         # Blank listing folder — copy when a new listing goes live
│   │   │   ├── mls-data.md                    # MLS input sheet: beds, baths, sqft, lot, year built, features
│   │   │   ├── marketing-copy.md              # Headline, MLS description, social caption, email subject variants
│   │   │   ├── showing-feedback/              # Folder for per-showing feedback files
│   │   │   │   └── .gitkeep
│   │   │   ├── photos/                        # Photo file index and captions (filenames, not binaries)
│   │   │   │   └── photo-index.md
│   │   │   └── price-history.md               # List price, date of change, reason for change
│   │   ├── 42-maple-st-springfield/
│   │   │   ├── mls-data.md
│   │   │   ├── marketing-copy.md
│   │   │   ├── price-history.md               # $489K → $475K on 2026-05-10 (days on market: 21)
│   │   │   ├── listing-agreement.md           # Agreement date, expiration, commission split, dual agency clause
│   │   │   ├── showing-feedback/
│   │   │   │   ├── 2026-05-03-showing.md      # Buyer agent, buyer reaction, objections, interest level
│   │   │   │   ├── 2026-05-07-showing.md
│   │   │   │   └── 2026-05-14-showing.md
│   │   │   └── photos/
│   │   │       └── photo-index.md
│   │   └── 110-river-rd-unit-4b/
│   │       ├── mls-data.md
│   │       ├── marketing-copy.md
│   │       ├── price-history.md
│   │       ├── listing-agreement.md
│   │       └── showing-feedback/
│   │           └── .gitkeep
│   └── past/
│       ├── 2025-closed/
│       │   ├── 78-elm-ave-westfield/
│       │   │   ├── mls-data.md
│       │   │   ├── final-sale-price.md        # List price, sale price, days on market, concessions given
│       │   │   └── closing-notes.md           # Title company, closing date, net to seller, lessons
│       │   └── 203-birch-ln-lakewood/
│       │       ├── mls-data.md
│       │       ├── final-sale-price.md
│       │       └── closing-notes.md
│       └── 2024-closed/
│           └── .gitkeep
├── buyers/
│   ├── _template/
│   │   ├── buyer-profile.md                   # Names, contact info, lender, pre-approval amount, timeline
│   │   ├── search-criteria.md                 # Beds, baths, price range, neighborhoods, must-haves, deal-breakers
│   │   ├── showing-history.md                 # Log of homes shown: address, date, reaction, ranking
│   │   └── offer-history.md                   # Offers submitted: address, amount, terms, outcome
│   ├── chen-family/
│   │   ├── buyer-profile.md                   # Pre-approved $620K, conventional, 20% down, lender: First National
│   │   ├── search-criteria.md                 # 3BR+ Northside/Eastbrook, school district priority, garage required
│   │   ├── showing-history.md
│   │   │   # 2026-05-01 — 42 Maple St: liked layout, objected to backyard size
│   │   │   # 2026-05-09 — 18 Oak Ct: strong interest, HOA concern
│   │   └── offer-history.md
│   │       # 2026-05-12 — 18 Oak Ct: $598K, 10-day inspection, declined by seller
│   ├── rodriguez-patricia/
│   │   ├── buyer-profile.md
│   │   ├── search-criteria.md
│   │   ├── showing-history.md
│   │   └── offer-history.md
│   └── kim-david/
│       ├── buyer-profile.md
│       ├── search-criteria.md
│       ├── showing-history.md
│       └── offer-history.md
├── sellers/
│   ├── _template/
│   │   ├── seller-profile.md                  # Names, contact info, motivation to sell, timeline, equity estimate
│   │   ├── cma.md                             # Comparable analysis: actives, pendings, solds + price recommendation
│   │   ├── listing-agreement.md               # Agreement terms, expiration, exclusions, dual agency disclosure
│   │   └── price-change-history.md            # Log of list price reductions with dates and rationale
│   ├── johnson-mark-and-linda/
│   │   ├── seller-profile.md                  # 42 Maple St — relocating, must close by Aug 1
│   │   ├── cma.md                             # CMA run 2026-04-20, recommended $489K–$499K
│   │   ├── listing-agreement.md
│   │   └── price-change-history.md
│   └── torres-carlos/
│       ├── seller-profile.md
│       ├── cma.md
│       ├── listing-agreement.md
│       └── price-change-history.md
├── templates/
│   ├── listing-description-template.md        # Headline + body formula for MLS, Zillow, and social media
│   ├── buyer-offer-letter-template.md         # Personal offer letter from buyer — builds emotional connection
│   ├── neighborhood-summary-template.md       # Walkable amenities, school ratings, commute, market trend snapshot
│   ├── market-update-template.md              # Monthly email: new listings, avg DOM, list-to-sale ratio, forecast
│   ├── showing-feedback-request-template.md   # Email to buyer's agent requesting specific feedback post-showing
│   ├── price-reduction-announcement.md        # Email + social copy for listing price reduction notification
│   └── open-house-followup-template.md        # Same-day follow-up to open house attendees with CTA
├── contracts/
│   ├── purchase-agreements/
│   │   ├── residential-purchase-agreement-ca.md    # California RPA — key fields, contingency defaults, timeline
│   │   ├── residential-purchase-agreement-tx.md    # Texas TREC One-to-Four Family Residential — key fields
│   │   └── commercial-purchase-agreement.md        # LOI to PSA flow, due diligence period defaults
│   ├── addenda/
│   │   ├── inspection-contingency-removal.md       # Contingency removal timing and default language
│   │   ├── loan-contingency-addendum.md            # Loan type, LTV, rate cap, removal deadline
│   │   ├── seller-rent-back-addendum.md            # Rent-back terms, daily rate, security deposit
│   │   └── as-is-addendum.md                       # As-is disclosure, buyer acceptance language
│   └── disclosure-packets/
│       ├── seller-property-questionnaire.md        # SPQ key sections to review with seller before listing
│       └── transfer-disclosure-statement.md        # TDS fields, red flags checklist for agents
├── marketing/
│   ├── email-templates/
│   │   ├── just-listed-announcement.md        # To sphere + past clients — new listing announcement
│   │   ├── under-contract-social-proof.md     # Announcement to sphere building momentum
│   │   ├── just-sold-case-study.md            # Post-close email with sale price, DOM, lessons
│   │   └── quarterly-market-report-email.md   # Q[X] market stats + your production summary
│   ├── social-posts/
│   │   ├── listing-launch-post.md             # Instagram/Facebook caption for new listing
│   │   ├── sold-announcement-post.md          # Social proof post with agent stats
│   │   └── market-tip-series.md              # 5-part educational post series for nurture
│   └── video-scripts/
│       ├── listing-tour-intro.md              # BombBomb script — property intro for buyer prospects
│       ├── offer-presentation-script.md       # Video to seller presenting offer terms and recommendation
│       └── buyer-check-in-script.md           # Weekly video touchpoint for active buyer clients
├── reports/
│   ├── monthly-production-report.md           # Closed volume, active listings, buyer clients, avg DOM, commission
│   ├── pipeline-tracker.md                    # All active buyers + listings by stage: active, under contract, pending
│   ├── lead-source-tracker.md                 # Leads by source (Zillow, referral, open house) and conversion rate
│   └── quarterly-review.md                    # Q[X] goals vs. actuals, top wins, adjustments for next quarter
└── scratch/
    ├── weekly-priorities.md                   # Monday draft: top 3 listings, top 3 buyers, follow-ups due
    └── call-notes-staging.md                  # Raw post-call notes before filing to buyer or seller folder
```

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/listing-create.md` | Slash command that takes raw property details (beds, baths, features, selling points) and returns MLS-ready description, headline variants, and social captions in one pass |
| `.claude/commands/cma-report.md` | Slash command that takes comps from RPR or MLS and returns a structured CMA narrative with price recommendation and confidence level |
| `.claude/commands/offer-draft.md` | Slash command that takes buyer profile, target property, and offer terms and returns a cover email, personal offer letter, and agent-to-agent message for submission |
| `.claude/commands/client-followup.md` | Slash command that takes a buyer or seller name, last interaction, and next step, then drafts a personalized follow-up email in the agent's voice |
| `.claude/commands/showing-notes.md` | Slash command that converts raw post-showing notes into a structured feedback file with buyer reaction, objections, interest score, and recommended next step |
| `listings/active/_template/` | Canonical folder structure to copy when a new listing goes active — ensures every listing has MLS data, marketing copy, showing feedback, and price history in one place |
| `sellers/<name>/cma.md` | CMA run for each seller client — stores comp selection, price range rationale, and final recommendation; updated if market conditions shift before pricing decision |
| `reports/pipeline-tracker.md` | Single source of truth for all active deals by stage — reviewed every Monday morning to prioritize follow-ups and flag deals at risk of falling out |

## Quick scaffold

```bash
# Create the workspace root
mkdir -p real-estate-workspace

# Create .claude structure with commands
mkdir -p real-estate-workspace/.claude/commands

# Create listings structure
mkdir -p real-estate-workspace/listings/active/_template/showing-feedback
mkdir -p real-estate-workspace/listings/active/_template/photos
mkdir -p real-estate-workspace/listings/active/42-maple-st-springfield/showing-feedback
mkdir -p real-estate-workspace/listings/active/42-maple-st-springfield/photos
mkdir -p real-estate-workspace/listings/active/110-river-rd-unit-4b/showing-feedback
mkdir -p real-estate-workspace/listings/past/2025-closed/78-elm-ave-westfield
mkdir -p real-estate-workspace/listings/past/2025-closed/203-birch-ln-lakewood
mkdir -p real-estate-workspace/listings/past/2024-closed

# Create buyers structure
mkdir -p real-estate-workspace/buyers/_template
mkdir -p real-estate-workspace/buyers/chen-family
mkdir -p real-estate-workspace/buyers/rodriguez-patricia
mkdir -p real-estate-workspace/buyers/kim-david

# Create sellers structure
mkdir -p real-estate-workspace/sellers/_template
mkdir -p real-estate-workspace/sellers/johnson-mark-and-linda
mkdir -p real-estate-workspace/sellers/torres-carlos

# Create templates, contracts, marketing, reports, scratch
mkdir -p real-estate-workspace/templates
mkdir -p real-estate-workspace/contracts/purchase-agreements
mkdir -p real-estate-workspace/contracts/addenda
mkdir -p real-estate-workspace/contracts/disclosure-packets
mkdir -p real-estate-workspace/marketing/email-templates
mkdir -p real-estate-workspace/marketing/social-posts
mkdir -p real-estate-workspace/marketing/video-scripts
mkdir -p real-estate-workspace/reports
mkdir -p real-estate-workspace/scratch

# Seed .gitkeep placeholders
touch real-estate-workspace/listings/active/_template/showing-feedback/.gitkeep
touch real-estate-workspace/listings/past/2024-closed/.gitkeep
touch real-estate-workspace/buyers/_template/.gitkeep
touch real-estate-workspace/sellers/_template/.gitkeep

# Install real estate skills
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer
npx claudient add skill marketing/email-sequence
npx claudient add skill gtm/crm-hygiene

# Copy command stubs into .claude/commands/
npx claudient add skill small-business/real-estate-listing --output real-estate-workspace/.claude/commands/listing-create.md
npx claudient add skill small-business/cma-report --output real-estate-workspace/.claude/commands/cma-report.md
npx claudient add skill small-business/buyer-offer-writer --output real-estate-workspace/.claude/commands/offer-draft.md
npx claudient add skill marketing/email-sequence --output real-estate-workspace/.claude/commands/client-followup.md
```

## CLAUDE.md template

```markdown
# Real Estate Agent Workspace — Claude Code Instructions

## What this is

This is the working directory for a real estate agent managing active listings, buyer clients,
seller clients, contracts, and marketing. Listings live in listings/, buyer files in buyers/,
seller files in sellers/, and reusable assets in templates/ and contracts/.
All listing copy, CMAs, offer drafts, client follow-ups, and market updates run through Claude Code skills.

## Stack

- Follow Up Boss — CRM of record (leads, pipeline stages, drip campaigns, tasks)
- DocuSign — Contract routing; track envelope IDs in the relevant listing or buyer folder
- RPR / MLS — Market data; paste comp tables into the relevant cma.md before running /cma-report
- Google Drive — Long-term file archive; sync closed deal folders after funding
- BombBomb — Video email; scripts live in marketing/video-scripts/
- Canva — Marketing graphics; reference design names in marketing/social-posts/
- Zillow / Realtor.com — Listing portals; note portal IDs in mls-data.md for each listing

## Common tasks and exact commands

### Create a new listing description
```
/listing-create

Address: [street address]
Property type: [single-family / condo / multi-family / commercial]
Beds: [N] | Baths: [N] | Sqft: [N] | Lot: [N sqft or acres] | Year built: [YYYY]
Garage: [yes/no, N-car] | Pool: [yes/no] | HOA: [yes/no, $X/mo]
Upgrades: [list key renovations or features]
Selling points: [location benefit, school district, commute, lifestyle]
Price: $[X]
Tone: [luxury / family-friendly / investment / starter home]
```

### Run a CMA and get a price recommendation
```
/cma-report

Subject property: [address, beds, baths, sqft, lot, year built, condition]
Active comps: [list 2-4 with address, list price, beds/baths/sqft, DOM]
Pending comps: [list 1-3 with address, list price, beds/baths/sqft]
Sold comps (last 90 days): [list 3-5 with address, sale price, close date, beds/baths/sqft, DOM]
Adjustments needed: [pool, garage, condition, lot size — note differences]
Market trend: [appreciating / flat / softening — and by how much per month]
```

### Draft an offer submission package
```
/offer-draft

Property: [address]
Buyer: [first names for personal letter]
Offer price: $[X] | List price: $[Y]
Down payment: [%] | Loan type: [conventional / FHA / VA / cash]
Earnest money: $[X]
Inspection contingency: [yes/no, N days]
Loan contingency: [yes/no, N days]
Appraisal contingency: [yes/no]
Close of escrow: [date or N days]
Seller rent-back: [yes/no, N days at $X/day]
Personal letter angle: [something real about the buyer and why they love this home]
Competing offers: [yes/no — adjust urgency accordingly]
```

### Write a client follow-up email
```
/client-followup

Client: [name(s)]
Client type: [buyer / seller]
Last interaction: [date and what happened — showing, phone call, offer submitted, etc.]
Their current status: [active searching / under contract / listing prep / waiting for offer]
Next step needed: [what you need them to do or what you want them to know]
Tone: [reassuring / excited / informative / urgent]
```

### Log and structure showing notes
```
/showing-notes

Property shown: [address]
Buyer: [name]
Date: [YYYY-MM-DD]
Raw notes: [paste your voice memo transcription or bullet notes verbatim]
Buyer's agent feedback (if received): [paste or summarize]
```

### Draft a market update for client nurture
```
/market-update

Neighborhood: [name]
Date range: [e.g., May 2026]
New listings: [N at avg $X]
Sold: [N at avg $X, avg DOM Y days]
List-to-sale ratio: [X%]
Inventory level: [N months of supply]
Trend: [buyer's market / balanced / seller's market]
Audience: [past clients / active buyers / sphere of influence]
```

### Create a buyer presentation package
```
/buyer-package

Buyer names: [first names]
Pre-approval: $[X] | Lender: [name]
Target neighborhoods: [list]
Search criteria: [beds, baths, must-haves, deal-breakers]
Timeline: [when they want to be in]
First-time buyer: [yes/no]
```

## Conventions to follow

- Every active listing must have mls-data.md and marketing-copy.md before it goes live on MLS
- Every showing gets a feedback file in listings/active/<address>/showing-feedback/ named YYYY-MM-DD-showing.md
- Every buyer client must have buyer-profile.md, search-criteria.md, showing-history.md, and offer-history.md
- CMA files live in sellers/<name>/cma.md — append a new section if a re-run is needed; do not overwrite
- Listing price changes are logged to listings/active/<address>/price-history.md with date and reason
- Closed deals move from listings/active/ to listings/past/YYYY-closed/ within 5 days of funding
- Offer submissions are logged to buyers/<name>/offer-history.md — include address, amount, terms, and outcome
- pipeline-tracker.md is reviewed every Monday and updated with current stage for every active file
- All contract addenda are stored in contracts/addenda/ and referenced by name in the relevant deal folder
```

## MCP servers

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "your-google-oauth-client-id",
        "GDRIVE_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GDRIVE_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "gmail": {
      "command": "npx",
      "args": ["-y", "@google/mcp-server-gmail"],
      "env": {
        "GMAIL_CLIENT_ID": "your-google-oauth-client-id",
        "GMAIL_CLIENT_SECRET": "your-google-oauth-client-secret",
        "GMAIL_REFRESH_TOKEN": "your-google-refresh-token"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/mcp-server-filesystem",
        "/Users/your-username/real-estate-workspace"
      ]
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"showing-feedback\"; then echo \"[hook] Showing notes saved — remember to log buyer reaction in buyers/<name>/showing-history.md and follow up within 24 hours\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_FILE_PATH\" | grep -q \"offer-history\"; then echo \"[hook] Offer logged — update pipeline-tracker.md stage and set a follow-up task in Follow Up Boss\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'TODAY=$(date +%A); if [ \"$TODAY\" = \"Monday\" ]; then echo \"[reminder] Monday — review reports/pipeline-tracker.md and update every active listing and buyer to current stage\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
# Core real estate skills
npx claudient add skill small-business/real-estate-listing
npx claudient add skill small-business/cma-report
npx claudient add skill small-business/buyer-offer-writer

# Marketing and nurture skills
npx claudient add skill marketing/email-sequence
npx claudient add skill marketing/social-content-writer
npx claudient add skill marketing/video-script-writer

# CRM and operations skills
npx claudient add skill gtm/crm-hygiene
npx claudient add skill productivity/client-followup
npx claudient add skill productivity/weekly-review
```

## Related

- [Real estate agent guide](../guides/for-real-estate-agent.md)
- [Listing launch workflow](../workflows/listing-launch.md)
- [Buyer tour workflow](../workflows/buyer-tour-cycle.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
