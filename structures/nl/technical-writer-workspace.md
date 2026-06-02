# Technical Writer Workspace — Projectstructuur

> Voor een technisch schrijver die documentatie voor ontwikkelaars produceert, API-referenties, tutorials en releasenotes met behulp van een docs-as-code workflow met GitHub, Mintlify/Docusaurus en Notion.

## Stack

- **Docs-as-code:** GitHub (PRs, reviews, branch protection op `main`)
- **Documentatiesite:** Mintlify (voorkeur) of Docusaurus 3.x of GitBook — een per werkruimte
- **Planning & briefs:** Notion (content calendar, SME interview notes, doc requests)
- **Diagrammen:** Figma met FigJam voor architectuur- en flowdiagrammen
- **API testen:** Postman (validate request/response examples vóór publicatie)
- **Video walkthroughs:** Loom (embedded in tutorials voor complexe flows)
- **Communicatie:** Slack (`#docs`, `#dev-rel`, `#product-feedback` kanalen)
- **Linting:** Vale (prose linting tegen custom style rules), markdownlint
- **Link checking:** lychee (dead link detection in CI)
- **Zoeken:** Algolia DocSearch (Mintlify) of local lunr.js (Docusaurus)

## Directoryboom

```
technical-writer-workspace/
├── .claude/
│   ├── CLAUDE.md                           # Workspace instructions for Claude Code
│   ├── settings.json                       # MCP servers, hooks, permissions
│   └── commands/
│       ├── api-doc.md                      # /api-doc — generate endpoint doc from OpenAPI spec
│       ├── tutorial-draft.md               # /tutorial-draft — scaffold step-by-step tutorial
│       ├── changelog-entry.md              # /changelog-entry — write versioned release note entry
│       ├── doc-audit.md                    # /doc-audit — audit a doc page for accuracy and freshness
│       ├── onboarding-guide.md             # /onboarding-guide — generate developer onboarding doc
│       ├── release-notes.md                # /release-notes — compile release notes from changelog entries
│       └── style-check.md                  # /style-check — lint prose against style guide rules
├── api-reference/
│   ├── _template.md                        # Canonical endpoint doc format (source of truth)
│   ├── authentication.md                   # Auth overview: API keys, OAuth 2.0, token scopes
│   ├── errors.md                           # Error codes, status codes, retry guidance
│   ├── rate-limits.md                      # Rate limit tiers, headers, backoff strategy
│   ├── pagination.md                       # Cursor vs offset pagination, page size limits
│   ├── versioning.md                       # API versioning policy, deprecation timeline
│   ├── users/
│   │   ├── list-users.md                   # GET /users — parameters, response schema, examples
│   │   ├── get-user.md                     # GET /users/{id}
│   │   ├── create-user.md                  # POST /users — request body, validation rules
│   │   ├── update-user.md                  # PATCH /users/{id}
│   │   └── delete-user.md                  # DELETE /users/{id} — soft delete behavior
│   ├── auth/
│   │   ├── token-exchange.md               # POST /auth/token
│   │   ├── refresh-token.md                # POST /auth/refresh
│   │   └── revoke-token.md                 # POST /auth/revoke
│   ├── webhooks/
│   │   ├── overview.md                     # Webhook delivery, retries, signature verification
│   │   ├── event-types.md                  # All event schemas with example payloads
│   │   └── register-endpoint.md            # POST /webhooks — registration and validation
│   └── sdks/
│       ├── node.md                         # Node.js SDK: install, init, code examples per endpoint
│       ├── python.md                       # Python SDK
│       └── go.md                           # Go SDK
├── guides/
│   ├── _template.md                        # Conceptual guide format: overview, why, how, next steps
│   ├── getting-started.md                  # First integration: auth → first API call → response
│   ├── authentication.md                   # Deep dive: choosing auth method, token lifecycle
│   ├── error-handling.md                   # Defensive coding patterns, retry logic, exponential backoff
│   ├── security-best-practices.md          # Key rotation, scope minimization, secret storage
│   ├── migrating-from-v1.md               # v1 → v2 migration: breaking changes, codemods
│   ├── idempotency.md                      # Idempotency keys: when, why, implementation
│   └── testing-your-integration.md         # Sandbox env, test data, Postman collection link
├── tutorials/
│   ├── _template.md                        # Tutorial format: goal, prereqs, steps, verify, next
│   ├── quickstart-5-minutes.md             # End-to-end: API key → first successful call
│   ├── build-a-webhook-receiver.md         # Node.js express server that handles events
│   ├── sync-users-from-csv.md              # Batch import workflow with error handling
│   ├── oauth-integration-nextjs.md         # OAuth 2.0 PKCE flow in a Next.js app
│   ├── automate-user-provisioning.md       # SCIM 2.0 provisioning tutorial
│   └── postman-collection-walkthrough.md   # Import collection, set variables, run all calls
├── changelogs/
│   ├── _template.md                        # Changelog entry format: date, version, sections
│   ├── 2025-06-02-v3.1.0.md               # Latest: added, changed, deprecated, fixed, removed
│   ├── 2025-04-15-v3.0.0.md               # Major version: breaking changes prominently first
│   ├── 2025-02-10-v2.9.5.md
│   ├── 2025-01-08-v2.9.0.md
│   └── archive/
│       ├── 2024-changelogs.md              # Consolidated archive for older versions
│       └── 2023-changelogs.md
├── architecture/
│   ├── system-overview.md                  # High-level system diagram, component responsibilities
│   ├── data-flow.md                        # Request lifecycle: client → API gateway → service → DB
│   ├── authentication-flow.md              # OAuth 2.0 sequence diagram with Mermaid
│   ├── webhook-delivery.md                 # Webhook pipeline: event → queue → delivery → retry
│   ├── decisions/
│   │   ├── _template.md                    # ADR format: status, context, decision, consequences
│   │   ├── adr-001-api-versioning.md       # Decision record: URL versioning over header versioning
│   │   ├── adr-002-pagination-strategy.md  # Cursor pagination chosen over offset
│   │   └── adr-003-webhook-retry-policy.md # Exponential backoff with 72-hour window
│   └── openapi/
│       ├── openapi.yaml                    # Canonical OpenAPI 3.1 spec (source of truth)
│       └── postman-collection.json         # Exported Postman collection (generated from spec)
├── style-guide/
│   ├── voice-and-tone.md                   # Active voice, second person, present tense rules
│   ├── terminology.md                      # Approved/banned term list: API key vs access token, etc.
│   ├── code-examples.md                    # Language standards, line length, comment rules
│   ├── formatting.md                       # Heading hierarchy, admonitions, table usage
│   ├── screenshots.md                      # When to use, alt text requirements, naming convention
│   ├── .vale.ini                           # Vale prose linter config: rule packages enabled
│   └── vale-rules/
│       ├── Headings.yml                    # Custom Vale rule: sentence case only
│       ├── AvoidPassive.yml                # Flag passive voice constructions
│       └── BannedTerms.yml                 # Enforce terminology.md via Vale
├── reviews/
│   ├── doc-review-checklist.md             # Pre-publish checklist: accuracy, links, examples
│   ├── sme-interview-template.md           # SME interview question framework
│   ├── sme-feedback/
│   │   ├── 2025-05-auth-review.md          # SME feedback session: auth docs with eng team
│   │   └── 2025-04-webhooks-review.md
│   └── audits/
│       ├── 2025-q2-api-reference-audit.md  # Quarterly accuracy audit: stale endpoints, broken examples
│       └── 2025-q1-tutorial-audit.md
├── .vale.ini                               # Root Vale config (applies to all .md files)
├── .markdownlint.json                      # markdownlint rules: line length, heading style
├── .lychee.toml                            # lychee link checker: timeout, excluded domains
├── mint.json                               # Mintlify site config: nav, colors, anchors, analytics
└── .github/
    └── workflows/
        ├── vale-lint.yml                   # PR: run Vale on changed .md files, post annotations
        ├── markdownlint.yml                # PR: markdownlint check
        ├── link-check.yml                  # PR + weekly schedule: lychee dead link detection
        └── openapi-diff.yml               # PR: detect breaking changes in openapi.yaml
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `.claude/commands/api-doc.md` | Slash command die een OpenAPI endpoint path gebruikt, de spec ophaalt en een volledige endpoint doc page genereert volgens `api-reference/_template.md` conventies |
| `.claude/commands/doc-audit.md` | Auditeert een doc page tegen de live API: controleert dat request/response examples overeenkomen met de huidige spec, markeert verouderde parameters en identificeert ontbrekende error codes |
| `api-reference/_template.md` | Canonical endpoint doc format: description, base URL, authentication note, path/query/body parameters, response schema, code examples in drie talen, error table |
| `architecture/openapi/openapi.yaml` | Single OpenAPI 3.1 source of truth — alle API reference docs en de Postman collection zijn afgeleid van dit bestand; edit endpoint docs nooit zonder eerst de spec te controleren |
| `style-guide/terminology.md` | Goedgekeurd en verboden term lijst gebruikt door Vale's `BannedTerms.yml` rule — de enige autoriteit op product-specifieke woordenschat |
| `changelogs/_template.md` | Afgedwongen changelog format: date, semver, en vier secties (Added, Changed, Deprecated, Fixed) volgens Keep a Changelog conventies |
| `reviews/doc-review-checklist.md` | Pre-publish gate: accuracy geverifieerd met Postman, alle code examples getest, alle links passing lychee, Vale en markdownlint clean, SME sign-off genoteerd |
| `style-guide/.vale.ini` | Vale configuration: enables Google style package voor prose quality, Microsoft style voor terminology, en custom local rules in `vale-rules/` |

## Quick scaffold

```bash
# Create the full Technical Writer workspace structure
mkdir -p technical-writer-workspace
cd technical-writer-workspace

# Claude Code config
mkdir -p .claude/commands

# Content directories
mkdir -p api-reference/users api-reference/auth api-reference/webhooks api-reference/sdks
mkdir -p guides tutorials
mkdir -p changelogs/archive
mkdir -p architecture/decisions architecture/openapi
mkdir -p style-guide/vale-rules
mkdir -p reviews/sme-feedback reviews/audits
mkdir -p .github/workflows

# Scaffold template files
touch api-reference/_template.md
touch guides/_template.md
touch tutorials/_template.md
touch changelogs/_template.md
touch architecture/decisions/_template.md
touch reviews/doc-review-checklist.md reviews/sme-interview-template.md

# Scaffold style guide files
touch style-guide/voice-and-tone.md
touch style-guide/terminology.md
touch style-guide/code-examples.md
touch style-guide/formatting.md
touch style-guide/screenshots.md

# Vale config
cat > .vale.ini << 'EOF'
StylesPath = style-guide/vale-rules
MinAlertLevel = suggestion

[*.md]
BasedOnStyles = Vale
EOF

cat > style-guide/.vale.ini << 'EOF'
StylesPath = vale-rules
MinAlertLevel = warning

[*.md]
BasedOnStyles = Vale, Google, Microsoft
EOF

# markdownlint config
cat > .markdownlint.json << 'EOF'
{
  "default": true,
  "MD013": { "line_length": 120 },
  "MD033": false,
  "MD041": false
}
EOF

# Mintlify config stub
cat > mint.json << 'EOF'
{
  "name": "Product Docs",
  "logo": { "light": "/logo/light.svg", "dark": "/logo/dark.svg" },
  "favicon": "/favicon.svg",
  "colors": { "primary": "#0D9373" },
  "navigation": [
    { "group": "Get Started", "pages": ["guides/getting-started"] },
    { "group": "API Reference", "pages": ["api-reference/authentication"] }
  ],
  "analytics": { "posthog": { "apiKey": "" } }
}
EOF

# lychee config
cat > .lychee.toml << 'EOF'
timeout = 20
max_retries = 3
exclude = ["localhost", "127.0.0.1", "example.com"]
exclude_path = ["changelogs/archive"]
EOF

# Install skills
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review

# Copy installed skills as workspace commands
cp ~/.claude/skills/productivity/api-doc-writer.md .claude/commands/api-doc.md
cp ~/.claude/skills/git/changelog-generator.md .claude/commands/changelog-entry.md
cp ~/.claude/skills/productivity/doc-site-builder.md .claude/commands/onboarding-guide.md

echo "Technical Writer workspace scaffolded."
```

## CLAUDE.md template

```markdown
# Technical Writer Workspace

Deze werkruimte beheert alle documentatie gericht op ontwikkelaars: API reference, conceptuele gidsen,
tutorials en releasenotes. Content staat in version control en publiceert naar Mintlify.
Nauwkeurigheid en volledigheid zijn de primaire kwaliteitsmetrieken — elke code example moet worden getest
tegen de live API vóór publicatie.

## Stack

- Doc site: Mintlify (config: mint.json)
- API spec: OpenAPI 3.1 (architecture/openapi/openapi.yaml — source of truth)
- Prose linting: Vale + custom rules in style-guide/vale-rules/
- Markdown linting: markdownlint (.markdownlint.json)
- Link checking: lychee (.lychee.toml)
- API testing: Postman (validate all examples before publishing)
- Planning: Notion (doc requests, content calendar, SME interview notes)
- Video: Loom (embed walkthroughs in complex tutorials)

## Directoryconventies

- `api-reference/` — één bestand per endpoint; volg api-reference/_template.md exact
- `guides/` — conceptuele diepgang; niet stap-voor-stap (dat hoort in tutorials/)
- `tutorials/` — genummerde stappen; moet een "Verify it works" sectie bevatten vóór "Next steps"
- `changelogs/` — één bestand per release; volg changelogs/_template.md en Keep a Changelog
- `architecture/decisions/` — één ADR per significant doc-system decision
- `style-guide/` — enige bron van waarheid voor voice, terminology, en formatting
- `reviews/` — nooit SME feedback verwijderen; het is het accuracy audit trail

## Veelgestelde taken — gebruik deze exacte commands

### API endpoint documentatie genereren van spec
/api-doc — plak het OpenAPI path object of endpoint URL

### Een nieuwe tutorial opstellen
/tutorial-draft — beschrijf het user goal en target developer persona

### Een changelog entry schrijven voor een release
/changelog-entry — plak de PR list of Jira release notes

### Een doc page auditen op nauwkeurigheid
/doc-audit — plak het doc page path en de relevante OpenAPI sectie

### Een developer onboarding gids genereren
/onboarding-guide — geef het product area en target role

### Release notes samenstellen van changelog entries
/release-notes — geef het version range (bv. v3.0.0 to v3.1.0)

### Prose controleren tegen de style guide
/style-check — plak of referentie het doc bestand te linten

## API reference conventies

- Elke endpoint doc moet bevatten: één cURL example, één Python example, één Node.js example
- Response examples moeten het werkelijke antwoord van Postman tonen — nooit JSON uitvinden
- Error table moet alle HTTP status codes opsommen die de endpoint werkelijk retourneert (check de spec)
- Parameters table: markeer required vs optional; include type, format, en valid values/range
- Link naar de relevante gids voor conceptuele achtergrond — verklaar concepten niet inline

## Changelog conventies

- Gebruik Keep a Changelog format: Added, Changed, Deprecated, Fixed, Removed, Security
- Breaking changes gaan bovenaan onder een "Breaking" heading vóór alle andere secties
- Elke entry moet de API endpoint of feature name refereren — geen vage "improvements"
- Deprecated items moeten de removal target version en migration path bevatten

## Style rules (korte vorm — zie style-guide/ voor volledige rules)

- Active voice: "The API returns a token" niet "A token is returned by the API"
- Second person: "You can authenticate using..." niet "Users can authenticate using..."
- Present tense voor behavior: "Returns 404" niet "Will return 404"
- Sentence case voor alle headings: "Create a user" niet "Create a User"
- Goedgekeurde termen: API key, access token, endpoint, payload, webhook event
- Verboden termen: simply, just, easy, straightforward — flag met /style-check

## Pre-publish checklist

Vóór het openen van een PR, verifieer alle items in reviews/doc-review-checklist.md:
1. Alle code examples getest in Postman tegen de huidige sandbox environment
2. Vale passes met nul errors (warnings acceptabel met justificatie)
3. markdownlint passes met nul errors
4. lychee toont geen broken links
5. SME heeft accuracy gereview voor architecturaal of behavioral claims
6. mint.json navigation geupdate als een nieuwe pagina wordt toegevoegd

## Wat niet te doen

- Verzin geen API behavior — verifieer altijd tegen openapi.yaml of test in Postman
- Edit openapi.yaml niet direct — dat bestand wordt onderhouden door het engineering team
- Merge geen doc PRs zonder Vale passing — de CI check is verplicht
- Schrijf geen tutorials in de guides/ directory of conceptuele content in tutorials/
- Gebruik geen passive voice of second-order conditionals ("would be", "could potentially")
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_TOKEN": "${NOTION_API_TOKEN}"
      }
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == *.md ]]; then npx markdownlint \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>&1 | head -20 || true; fi'"
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
            "command": "bash -c 'if [[ \"$CLAUDE_TOOL_INPUT_FILE_PATH\" == *api-reference/* ]] && ! grep -q \"## Parameters\" \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null; then echo \"[HOOK] API reference file is missing a Parameters section — check api-reference/_template.md\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'changed=$(git -C \"$PWD\" diff --name-only 2>/dev/null | grep \"\\.md$\" | wc -l | tr -d \" \"); if [ \"$changed\" -gt 0 ]; then echo \"Reminder: $changed unsaved .md file(s) changed — run Vale and markdownlint before opening a PR.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review
```

## Gerelateerd

- [Technical Writer Guide](../guides/for-technical-writer.md)
- [Changelog Writing Workflow](../workflows/changelog-writing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
