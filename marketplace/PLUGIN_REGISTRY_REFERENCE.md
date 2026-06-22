# PLUGIN_REGISTRY_REFERENCE.md — Quick Reference

## File Locations

- **Schema documentation:** `marketplace/PLUGIN_REGISTRY.md`
- **Registry instance:** `marketplace/plugins.json`
- **Source configuration:** `.claude-plugin/marketplace.json`
- **Catalog index:** `marketplace/catalog.json`

## Quick Schema at a Glance

### Required Fields (All plugins must have these)

```json
{
  "id": "kebab-case-id",
  "name": "Display Name",
  "version": "1.0.0",
  "description": "One sentence description",
  "author": {
    "name": "username",
    "verified": true/false
  },
  "repo": "https://github.com/owner/repo",
  "downloads": {
    "total": 0,
    "thisMonth": 0,
    "thisWeek": 0
  },
  "rating": {
    "average": 4.5,
    "count": 100,
    "verified": true
  },
  "price": {
    "model": "free|paid|freemium",
    "amount": 0.00,
    "currency": "USD"
  },
  "tags": ["tag1", "tag2"],
  "category": "category-id",
  "status": "active|beta|deprecated|archived",
  "certification": {
    "level": "gold|silver|bronze|uncertified"
  },
  "metadata": {
    "icon": "emoji",
    "source": "plugin-dir-name",
    "languages": ["en"],
    "assets": {
      "skills": 0,
      "agents": 0,
      "hooks": 0,
      "commands": 0,
      "mcp": 0,
      "guides": 0
    },
    "compatibility": {
      "minClaudeVersion": "0.3.0",
      "maxClaudeVersion": null,
      "supportedPlatforms": ["darwin", "linux", "win32"]
    },
    "keywords": ["keyword1", "keyword2"]
  },
  "stats": {
    "publishedAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-06-22T00:00:00Z",
    "issuesOpen": 0,
    "issuesResolved": 0,
    "prsMerged": 0
  },
  "support": {
    "documentationUrl": "https://...",
    "issuesUrl": "https://...",
    "licenseType": "MIT",
    "licenseUrl": "https://..."
  }
}
```

## Certification Levels

| Level | Criteria | Expires |
|-------|----------|---------|
| **gold** | Comprehensive vetting, security audit, active maintenance | 12 months |
| **silver** | Standard vetting, quality checks, responsive author | 12 months |
| **bronze** | Basic vetting, minimal issues | 12 months |
| **uncertified** | Not yet reviewed by core team | None |

## Pricing Models

```json
{
  "free": {
    "model": "free",
    "amount": 0,
    "currency": "USD"
  },
  
  "paid-monthly": {
    "model": "paid",
    "amount": 9.99,
    "currency": "USD",
    "billingCycle": "monthly"
  },
  
  "paid-yearly": {
    "model": "paid",
    "amount": 99.99,
    "currency": "USD",
    "billingCycle": "yearly"
  },
  
  "paid-one-time": {
    "model": "paid",
    "amount": 29.99,
    "currency": "USD",
    "billingCycle": "one-time"
  },
  
  "freemium-14-day": {
    "model": "freemium",
    "amount": 49.99,
    "currency": "USD",
    "billingCycle": "monthly",
    "trialDays": 14
  }
}
```

## Update Frequency

| Field | Updated | By |
|-------|---------|-----|
| `downloads.*` | Daily (UTC midnight) | Automated pipeline |
| `rating.*` | Daily (UTC midnight) | Automated pipeline |
| `stats.issuesOpen` | Daily | GitHub sync |
| `stats.issuesResolved` | Daily | GitHub sync |
| `stats.prsMerged` | Daily | GitHub sync |
| `stats.updatedAt` | On new version release | Automated |
| `name`, `description`, `tags` | On demand | Author via API |
| `price.*` | On demand | Author via API |
| `support.*` | On demand | Author via API |
| `certification.*` | On approval | Core team only |

## API Endpoints (Proposed)

```bash
# Get single plugin
GET /api/plugins/{id}

# List all plugins
GET /api/plugins?limit=50&offset=0

# Search plugins
GET /api/plugins/search?q=backend&category=backend

# Filter by certification
GET /api/plugins?certification=gold

# Sort by downloads
GET /api/plugins?sort=downloads.total&order=desc

# Update plugin metadata (author only)
PATCH /api/plugins/{id}

# Get analytics
GET /api/plugins/{id}/stats
```

## Validation Checks

```javascript
// ID validation
/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(plugin.id)

// Semantic versioning
plugin.version === "1.0.0" // x.y.z format

// Rating range
plugin.rating.average >= 0.0 && plugin.rating.average <= 5.0

// Downloads non-negative
plugin.downloads.total >= 0
plugin.downloads.thisMonth >= 0
plugin.downloads.thisWeek >= 0

// Tags count
plugin.tags.length >= 2 && plugin.tags.length <= 10

// Price validation
plugin.price.amount >= 0
plugin.price.currency === "USD"

// ISO8601 timestamps
new Date(plugin.stats.publishedAt).toISOString()
```

## Tags Taxonomy

**Domain Tags** (Primary function)
- `ai-engineering`, `backend`, `data-ml`, `devops-infra`, `frontend`, `automation`
- `finance`, `legal`, `marketing`, `gtm`, `product`, `productivity`

**Technology Tags** (Specific frameworks/tools)
- `python`, `nodejs`, `golang`, `rust`, `java`, `kotlin`, `swift`
- `postgresql`, `mongodb`, `redis`, `elasticsearch`, `graphql`
- `aws`, `azure`, `gcp`, `kubernetes`, `docker`, `terraform`

**Capability Tags** (What the plugin helps with)
- `rest-api`, `cli`, `web-scraping`, `orm`, `testing`, `security-audit`
- `performance-optimization`, `refactoring`, `code-review`, `debugging`

## Common Queries

### Find all gold-certified plugins
```json
{"certification.level": "gold", "status": "active"}
```

### Find trending plugins this month
```json
{"downloads.thisMonth": {">": 1000}, "status": "active"}
```

### Find plugins by author
```json
{"author.name": "tushar2704"}
```

### Find free plugins in category
```json
{"price.model": "free", "category": "backend"}
```

### Find highly-rated, verified plugins
```json
{"rating.average": {">": 4.5}, "rating.verified": true}
```

## Related Documentation

- **PLUGIN_REGISTRY.md** — Complete schema specification
- **CERTIFICATION.md** — Certification tier requirements
- **VETTING.md** — Quality review process
- **PUBLISHER_GUIDELINES.md** — Requirements for publishing plugins
- **catalog.json** — Complete stack/plugin catalog

---

**Last updated:** June 22, 2026
