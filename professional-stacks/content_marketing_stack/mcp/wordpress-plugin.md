# WordPress Plugin MCP

Integration for publishing and scheduling blog content to WordPress.

## Tools

- `wp.create_post` — Create new blog post with metadata
- `wp.schedule_post` — Schedule post publication
- `wp.update_seo_meta` — Update Yoast SEO metadata
- `wp.fetch_categories` — List available post categories
- `wp.list_posts` — Retrieve published posts with filters

## Configuration

```json
{
  "mcp": {
    "wordpress": {
      "url": "https://example.com",
      "api_key": "${WP_API_KEY}",
      "user": "${WP_USER}"
    }
  }
}
```

## Usage Example

```
Create post titled "SEO Guide" in "Technical" category, schedule for 2026-06-15
```
