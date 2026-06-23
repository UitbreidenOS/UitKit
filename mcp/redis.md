# Redis MCP Server

Connects Claude Code to Redis instances for cache inspection, key management, and pub/sub monitoring.

---

## Installation

```json
{
  "mcpServers": {
    "redis": {
      "command": "npx",
      "args": ["-y", "redis-mcp-server"],
      "env": {
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `redis_command` | Execute Redis commands (GET, SET, HGETALL, KEYS, etc.) |
| `redis_info` | Get Redis server info and memory stats |
| `redis_keys` | Search keys by pattern |

## Usage

```
> "Show me all session keys matching 'sess:*'"
> "What's the memory usage of the Redis instance?"
> "Get all fields from the user:123 hash"
> "Set a cache key 'feature_flags' with TTL of 1 hour"
```

## Security Notes

- Use AUTH password for production Redis instances
- Restrict to read-only commands for cache inspection
- Never connect to production without SSL/TLS

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
