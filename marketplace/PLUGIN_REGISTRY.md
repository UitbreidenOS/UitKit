# PLUGIN_REGISTRY.md — Plugin Registry Schema

## Overview

`plugins.json` is the master registry for all Claude Code plugins available in the Claudient marketplace. It maintains the authoritative record of plugin metadata, versioning, ratings, download statistics, and pricing information. This file is consumed by:

- Marketplace UI (plugin discovery, filtering, sorting)
- Plugin installer (`claudient install <plugin-name>`)
- Plugin update checker (version management)
- Analytics and reporting dashboards
- Revenue attribution (revenue-share calculations)

## Schema

Each entry in `plugins.json` adheres to this structure:

```json
{
  "$schema": "https://code.claude.com/schema/plugins.json",
  "version": "1.0.0",
  "timestamp": "ISO8601-timestamp",
  "total": "number",
  "entries": [
    {
      "id": "string — kebab-case unique identifier",
      "name": "string — display name",
      "version": "semver — current published version",
      "description": "string — short description (one sentence)",
      "author": {
        "name": "string — author username/handle",
        "email": "string — optional contact email",
        "verified": "boolean — author identity verified by core team"
      },
      "repo": "string — HTTPS git URL or https://github.com/owner/repo format",
      "downloads": {
        "total": "number — all-time downloads",
        "thisMonth": "number — downloads in current month",
        "thisWeek": "number — downloads in current week"
      },
      "rating": {
        "average": "number 0.0-5.0 — average user rating",
        "count": "number — total number of ratings",
        "verified": "boolean — ratings from verified purchases/installs only"
      },
      "price": {
        "model": "free|paid|freemium — pricing tier",
        "amount": "number — USD price (0 for free)",
        "currency": "USD",
        "billingCycle": "one-time|monthly|yearly",
        "trialDays": "number — days before paid features lock (freemium only)"
      },
      "tags": [
        "string — functional/domain tags for discovery"
      ],
      "category": "string — primary category ID",
      "status": "active|deprecated|archived|beta",
      "certification": {
        "level": "gold|silver|bronze|uncertified",
        "verifiedAt": "ISO8601 — when certification was last verified",
        "expiresAt": "ISO8601 — certification expiration date"
      },
      "metadata": {
        "icon": "emoji or SVG URL",
        "source": "string — relative path in plugins/ directory",
        "languages": [
          "en"
        ],
        "assets": {
          "skills": "number",
          "agents": "number",
          "hooks": "number",
          "commands": "number",
          "mcp": "number",
          "guides": "number"
        },
        "dependencies": [
          "array of plugin IDs that this plugin requires"
        ],
        "compatibility": {
          "minClaudeVersion": "semver",
          "maxClaudeVersion": "semver or null",
          "supportedPlatforms": [
            "darwin|linux|win32"
          ]
        },
        "keywords": [
          "searchable terms for SEO/filtering"
        ]
      },
      "stats": {
        "publishedAt": "ISO8601",
        "updatedAt": "ISO8601",
        "lastReviewedAt": "ISO8601",
        "issuesOpen": "number",
        "issuesResolved": "number",
        "prsMerged": "number"
      },
      "support": {
        "documentationUrl": "string",
        "issuesUrl": "string",
        "licenseType": "MIT|Apache-2.0|GPL-3.0|proprietary|other",
        "licenseUrl": "string"
      }
    }
  ]
}
```

## Field Definitions

### Core Identity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier in kebab-case (e.g., `claudient-backend`, `my-custom-plugin`). Used in CLI commands. |
| `name` | string | ✓ | Display name (may contain spaces, punctuation). Shown in marketplace UI. |
| `version` | semver | ✓ | Current published version (e.g., `1.10.1`). Must be valid semantic versioning. |
| `description` | string | ✓ | One-sentence description. Used in search results and plugin cards. Max 200 chars recommended. |

### Authorship & Verification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `author.name` | string | ✓ | Author username or team name. |
| `author.email` | string | ✗ | Contact email for support inquiries. |
| `author.verified` | boolean | ✓ | `true` if author identity verified by Claudient core team (reduces fraud). |
| `repo` | string | ✓ | Source repository URL (GitHub, GitLab, etc.). Used for issue tracking and source browsing. |

### Download Analytics

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `downloads.total` | number | ✓ | Cumulative all-time installs. Used for popularity ranking. |
| `downloads.thisMonth` | number | ✓ | Installs in current calendar month. Used for trending detection. |
| `downloads.thisWeek` | number | ✓ | Installs in current week (Mon-Sun). Used for velocity calculation. |

**Update frequency:** Daily (midnight UTC via automated pipeline)

### User Ratings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rating.average` | number 0.0-5.0 | ✓ | Mean of all user ratings. Displayed prominently in UI. |
| `rating.count` | number | ✓ | Total number of ratings submitted. Low count (< 5) should display disclaimer. |
| `rating.verified` | boolean | ✓ | `true` if ratings are from verified installs only (filters review spam). |

**Stars:** 5-star system; conversion: 1⭐–5⭐ → 1.0–5.0

### Pricing Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `price.model` | enum | ✓ | `free`: no charges. `paid`: all features paid. `freemium`: limited features free, premium features paid. |
| `price.amount` | number | ✓ | Price in USD (0 for free). Precision: two decimal places. |
| `price.currency` | string | ✓ | Currently `USD`. Extensible for multi-currency future. |
| `price.billingCycle` | enum | ✓ | `one-time`: perpetual license. `monthly`: auto-renew each month. `yearly`: auto-renew annually. |
| `price.trialDays` | number | ✗ | For `freemium` only. Number of days users can access paid features before requiring payment. |

**Examples:**
- Free plugin: `{ "model": "free", "amount": 0, "currency": "USD" }`
- $9.99/month: `{ "model": "paid", "amount": 9.99, "billingCycle": "monthly", "currency": "USD" }`
- Freemium (14-day trial): `{ "model": "freemium", "amount": 29.99, "billingCycle": "yearly", "trialDays": 14 }`

### Discovery & Classification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tags` | array[string] | ✓ | Functional tags for filtering (e.g., `["backend", "python", "fastapi", "rest-api"]`). Also used for SEO. Min 2, max 10 recommended. |
| `category` | string | ✓ | Primary category ID. Must match entry in `categories.json`. |
| `status` | enum | ✓ | `active`: published & maintained. `beta`: pre-release, features may change. `deprecated`: still available but maintenance paused. `archived`: no longer supported. |

### Certification & Trust

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `certification.level` | enum | ✓ | `gold`: highest vetting tier. `silver`: verified quality. `bronze`: basic vetting. `uncertified`: unreviewed. See CERTIFICATION.md. |
| `certification.verifiedAt` | ISO8601 | ✗ | When certification was last confirmed/renewed. |
| `certification.expiresAt` | ISO8601 | ✗ | When certification must be renewed (typically 12 months from verifiedAt). Null = perpetual. |

### Plugin Metadata

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metadata.icon` | string | ✓ | Emoji (e.g., `🚀`) or SVG/PNG URL. Used in UI. |
| `metadata.source` | string | ✓ | Relative path from `.claude-plugin/plugins/` (e.g., `claudient-backend`). |
| `metadata.languages` | array | ✓ | Supported language codes (e.g., `["en", "fr", "de", "es", "nl"]`). |
| `metadata.assets.skills` | number | ✓ | Count of included skill files. |
| `metadata.assets.agents` | number | ✓ | Count of included agent definitions. |
| `metadata.assets.hooks` | number | ✓ | Count of included hook scripts. |
| `metadata.assets.commands` | number | ✓ | Count of slash commands. |
| `metadata.assets.mcp` | number | ✓ | Count of MCP server configs. |
| `metadata.assets.guides` | number | ✓ | Count of guide/documentation files. |
| `metadata.dependencies` | array | ✗ | Plugin IDs that must be installed first. CLI respects for dependency resolution. |
| `metadata.compatibility.minClaudeVersion` | semver | ✓ | Minimum Claude version required (e.g., `0.3.0`). |
| `metadata.compatibility.maxClaudeVersion` | semver or null | ✗ | Maximum supported version. Null = no upper bound. |
| `metadata.compatibility.supportedPlatforms` | array | ✓ | OS support (subset of `["darwin", "linux", "win32"]`). |
| `metadata.keywords` | array | ✓ | SEO/search terms (e.g., `["python", "async", "httpx", "api-client"]`). |

### Statistics & Activity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stats.publishedAt` | ISO8601 | ✓ | When plugin first published. |
| `stats.updatedAt` | ISO8601 | ✓ | When latest version published. Used to highlight recently-updated plugins. |
| `stats.lastReviewedAt` | ISO8601 | ✗ | When last reviewed by Claudient core team (for certification maintenance). |
| `stats.issuesOpen` | number | ✓ | Count of open GitHub issues (if repo is GitHub). |
| `stats.issuesResolved` | number | ✓ | Count of closed/resolved issues. Used to calculate issue resolution rate. |
| `stats.prsMerged` | number | ✓ | Count of merged PRs. Indicates maintenance activity. |

### Support & Legal

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `support.documentationUrl` | string | ✓ | Link to plugin docs (README, wiki, or custom site). |
| `support.issuesUrl` | string | ✓ | Link to issue tracker (GitHub issues, GitLab, etc.). |
| `support.licenseType` | enum | ✓ | License identifier: `MIT`, `Apache-2.0`, `GPL-3.0`, `proprietary`, `other`. |
| `support.licenseUrl` | string | ✓ | Link to full license text. |

## Metadata Object Examples

### Backend Plugin
```json
{
  "id": "claudient-backend",
  "name": "Claudient Backend Stack",
  "version": "1.10.1",
  "description": "41 framework-specific skills covering Python, Node.js, Go, Rust, Ruby, Java, Elixir, Flutter, Swift, Kotlin, .NET, and PHP.",
  "author": {
    "name": "tushar2704",
    "verified": true
  },
  "repo": "https://github.com/tushar2704/claudient",
  "downloads": {
    "total": 45230,
    "thisMonth": 2156,
    "thisWeek": 487
  },
  "rating": {
    "average": 4.8,
    "count": 312,
    "verified": true
  },
  "price": {
    "model": "free",
    "amount": 0,
    "currency": "USD"
  },
  "tags": ["backend", "frameworks", "python", "nodejs", "golang", "rust", "rest-api"],
  "category": "backend",
  "status": "active",
  "certification": {
    "level": "gold",
    "verifiedAt": "2026-06-15T10:00:00Z",
    "expiresAt": "2027-06-15T10:00:00Z"
  },
  "metadata": {
    "icon": "🔙",
    "source": "claudient-backend",
    "languages": ["en"],
    "assets": {
      "skills": 41,
      "agents": 3,
      "hooks": 5,
      "commands": 12,
      "mcp": 2,
      "guides": 8
    },
    "dependencies": [],
    "compatibility": {
      "minClaudeVersion": "0.3.0",
      "maxClaudeVersion": null,
      "supportedPlatforms": ["darwin", "linux", "win32"]
    },
    "keywords": ["fastapi", "django", "nextjs", "nestjs", "hono", "golang", "rust"]
  },
  "stats": {
    "publishedAt": "2024-01-10T08:30:00Z",
    "updatedAt": "2026-06-22T03:55:46Z",
    "lastReviewedAt": "2026-06-15T10:00:00Z",
    "issuesOpen": 8,
    "issuesResolved": 156,
    "prsMerged": 47
  },
  "support": {
    "documentationUrl": "https://github.com/tushar2704/claudient/tree/main/plugins/claudient-backend",
    "issuesUrl": "https://github.com/tushar2704/claudient/issues",
    "licenseType": "MIT",
    "licenseUrl": "https://github.com/tushar2704/claudient/blob/main/LICENSE"
  }
}
```

### Premium Plugin (Paid)
```json
{
  "id": "premium-ai-trainer",
  "name": "Premium AI Trainer Plugin",
  "version": "2.1.0",
  "description": "Advanced AI model fine-tuning and prompt optimization tools for enterprise users.",
  "author": {
    "name": "acme-labs",
    "email": "support@acmelabs.com",
    "verified": true
  },
  "repo": "https://github.com/acme-labs/premium-ai-trainer",
  "downloads": {
    "total": 12400,
    "thisMonth": 340,
    "thisWeek": 78
  },
  "rating": {
    "average": 4.6,
    "count": 89,
    "verified": true
  },
  "price": {
    "model": "paid",
    "amount": 49.99,
    "currency": "USD",
    "billingCycle": "monthly"
  },
  "tags": ["ai-training", "prompt-optimization", "enterprise", "fine-tuning", "nlp"],
  "category": "ai-engineering",
  "status": "active",
  "certification": {
    "level": "silver",
    "verifiedAt": "2026-05-10T14:22:00Z",
    "expiresAt": "2027-05-10T14:22:00Z"
  },
  "metadata": {
    "icon": "🎓",
    "source": "premium-ai-trainer",
    "languages": ["en", "fr"],
    "assets": {
      "skills": 18,
      "agents": 2,
      "hooks": 3,
      "commands": 7,
      "mcp": 1,
      "guides": 5
    },
    "dependencies": ["claudient-ai-engineering"],
    "compatibility": {
      "minClaudeVersion": "0.4.0",
      "maxClaudeVersion": null,
      "supportedPlatforms": ["darwin", "linux", "win32"]
    },
    "keywords": ["huggingface", "lora", "quantization", "dpo", "ppo"]
  },
  "stats": {
    "publishedAt": "2025-02-15T09:00:00Z",
    "updatedAt": "2026-06-20T15:30:00Z",
    "lastReviewedAt": "2026-05-10T14:22:00Z",
    "issuesOpen": 2,
    "issuesResolved": 34,
    "prsMerged": 12
  },
  "support": {
    "documentationUrl": "https://docs.acmelabs.com/premium-ai-trainer",
    "issuesUrl": "https://github.com/acme-labs/premium-ai-trainer/issues",
    "licenseType": "proprietary",
    "licenseUrl": "https://acmelabs.com/terms/license"
  }
}
```

## Update Strategy

### Automatic Updates

The following fields are updated automatically via CI/CD pipeline (daily runs):

- `downloads.total`, `downloads.thisMonth`, `downloads.thisWeek`
- `rating.average`, `rating.count`
- `stats.issuesOpen`, `stats.issuesResolved`, `stats.prsMerged`
- `stats.updatedAt` (when new version released)

### Manual Updates

Authors/maintainers can update these fields via marketplace API:

- `name`, `description` (via marketplace dashboard)
- `tags`, `metadata.keywords`
- `metadata.languages` (when translations added)
- `price.*` (pricing changes)
- `support.*` (documentation, license URLs)

**Note:** Certification changes are core-team only and must go through VETTING.md process.

## Validation Rules

- All required fields must be present and non-null
- `version` must be valid semver (x.y.z)
- `rating.average` must be between 0.0 and 5.0
- `downloads.*` must be non-negative integers
- `id` must match regex: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$`
- `tags` must be 2–10 items, lowercase, hyphenated
- `repo` must be valid HTTPS URL
- `price.amount` must be >= 0
- `metadata.assets.*` must be non-negative integers

## Related Files

- **marketplace.json** — Plugin source registry (paths and versions)
- **CERTIFICATION.md** — Tier definitions and audit criteria
- **categories.json** — Valid category IDs and descriptions
- **VETTING.md** — Quality review process for new plugins
- **PUBLISHER_GUIDELINES.md** — Requirements for submitting new plugins

---

**Last updated:** June 22, 2026
