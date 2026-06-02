# Technical Writer Workspace — Project Structure

> For a technical writer producing developer docs, API references, tutorials, and release notes using a docs-as-code workflow with GitHub, Mintlify/Docusaurus, and Notion.

## Stack

- **Docs-as-code:** GitHub (PRs, reviews, branch protection on `main`)
- **Doc site:** Mintlify (preferred) or Docusaurus 3.x or GitBook — one per workspace
- **Planning & briefs:** Notion (content calendar, SME interview notes, doc requests)
- **Diagrams:** Figma with FigJam for architecture and flow diagrams
- **API testing:** Postman (validate request/response examples before publishing)
- **Video walkthroughs:** Loom (embedded in tutorials for complex flows)
- **Communication:** Slack (`#docs`, `#dev-rel`, `#product-feedback` channels)
- **Linting:** Vale (prose linting against custom style rules), markdownlint
- **Link checking:** lychee (dead link detection in CI)
- **Search:** Algolia DocSearch (Mintlify) or local lunr.js (Docusaurus)

## Directory tree

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

## Key files explained

| Path | Purpose |
|---|---|
| `.claude/commands/api-doc.md` | Slash command that takes an OpenAPI endpoint path, fetches the spec, and generates a complete endpoint doc page following `api-reference/_template.md` conventions |
| `.claude/commands/doc-audit.md` | Audits a doc page against the live API: checks that request/response examples match the current spec, flags stale parameters, and identifies missing error codes |
| `api-reference/_template.md` | Canonical endpoint doc format: description, base URL, authentication note, path/query/body parameters, response schema, code examples in three languages, error table |
| `architecture/openapi/openapi.yaml` | Single OpenAPI 3.1 source of truth — all API reference docs and the Postman collection are derived from this file; never edit endpoint docs without checking the spec first |
| `style-guide/terminology.md` | Approved and banned term list used by Vale's `BannedTerms.yml` rule — the single authority on product-specific vocabulary |
| `changelogs/_template.md` | Enforced changelog format: date, semver, and four sections (Added, Changed, Deprecated, Fixed) following Keep a Changelog conventions |
| `reviews/doc-review-checklist.md` | Pre-publish gate: accuracy verified with Postman, all code examples tested, all links passing lychee, Vale and markdownlint clean, SME sign-off noted |
| `style-guide/.vale.ini` | Vale configuration: enables Google style package for prose quality, Microsoft style for terminology, and custom local rules in `vale-rules/` |

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

This workspace manages all developer-facing documentation: API reference, conceptual guides,
tutorials, and release notes. Content lives in version control and publishes to Mintlify.
Accuracy and completeness are the primary quality metrics — every code example must be tested
against the live API before publication.

## Stack

- Doc site: Mintlify (config: mint.json)
- API spec: OpenAPI 3.1 (architecture/openapi/openapi.yaml — source of truth)
- Prose linting: Vale + custom rules in style-guide/vale-rules/
- Markdown linting: markdownlint (.markdownlint.json)
- Link checking: lychee (.lychee.toml)
- API testing: Postman (validate all examples before publishing)
- Planning: Notion (doc requests, content calendar, SME interview notes)
- Video: Loom (embed walkthroughs in complex tutorials)

## Directory conventions

- `api-reference/` — one file per endpoint; follow api-reference/_template.md exactly
- `guides/` — conceptual depth; not step-by-step (that belongs in tutorials/)
- `tutorials/` — numbered steps; must include a "Verify it works" section before "Next steps"
- `changelogs/` — one file per release; follow changelogs/_template.md and Keep a Changelog
- `architecture/decisions/` — one ADR per significant doc-system decision
- `style-guide/` — single source of truth for voice, terminology, and formatting
- `reviews/` — never delete SME feedback; it is the accuracy audit trail

## Common tasks — use these exact commands

### Generate API endpoint documentation from spec
/api-doc — paste the OpenAPI path object or endpoint URL

### Draft a new tutorial
/tutorial-draft — describe the user goal and target developer persona

### Write a changelog entry for a release
/changelog-entry — paste the PR list or Jira release notes

### Audit a doc page for accuracy
/doc-audit — paste the doc page path and the relevant OpenAPI section

### Generate a developer onboarding guide
/onboarding-guide — provide the product area and target role

### Compile release notes from changelog entries
/release-notes — provide the version range (e.g., v3.0.0 to v3.1.0)

### Check prose against the style guide
/style-check — paste or reference the doc file to lint

## API reference conventions

- Every endpoint doc must include: one cURL example, one Python example, one Node.js example
- Response examples must show the actual response from Postman — never invent JSON
- Error table must list all HTTP status codes the endpoint actually returns (check the spec)
- Parameters table: mark required vs optional; include type, format, and valid values/range
- Link to the relevant guide for conceptual background — do not explain concepts inline

## Changelog conventions

- Use Keep a Changelog format: Added, Changed, Deprecated, Fixed, Removed, Security
- Breaking changes go at the top under a "Breaking" heading before all other sections
- Each entry must reference the API endpoint or feature name — no vague "improvements"
- Deprecated items must include the removal target version and migration path

## Style rules (short form — see style-guide/ for full rules)

- Active voice: "The API returns a token" not "A token is returned by the API"
- Second person: "You can authenticate using..." not "Users can authenticate using..."
- Present tense for behavior: "Returns 404" not "Will return 404"
- Sentence case for all headings: "Create a user" not "Create a User"
- Approved terms: API key, access token, endpoint, payload, webhook event
- Banned terms: simply, just, easy, straightforward — flag with /style-check

## Pre-publish checklist

Before opening a PR, verify all items in reviews/doc-review-checklist.md:
1. All code examples tested in Postman against the current sandbox environment
2. Vale passes with zero errors (warnings acceptable with justification)
3. markdownlint passes with zero errors
4. lychee shows no broken links
5. SME has reviewed accuracy for any architectural or behavioral claims
6. mint.json navigation updated if adding a new page

## What not to do

- Do not invent API behavior — always verify against openapi.yaml or test in Postman
- Do not edit openapi.yaml directly — that file is maintained by the engineering team
- Do not merge doc PRs without Vale passing — the CI check is mandatory
- Do not write tutorials in the guides/ directory or conceptual content in tutorials/
- Do not use passive voice or second-order conditionals ("would be", "could potentially")
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

## Skills to install

```bash
npx claudient add skill productivity/api-doc-writer
npx claudient add skill productivity/readme-generator
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/runbook-generator
npx claudient add skill git/changelog-generator
npx claudient add skill productivity/lit-review
```

## Related

- [Technical Writer Guide](../guides/for-technical-writer.md)
- [Changelog Writing Workflow](../workflows/changelog-writing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
