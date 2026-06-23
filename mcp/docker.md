# Docker MCP Server

Connects Claude Code to Docker for container management, image inspection, and log analysis.

---

## Installation

```json
{
  "mcpServers": {
    "docker": {
      "command": "npx",
      "args": ["-y", "docker-mcp-server"]
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `list_containers` | List running and stopped containers |
| `container_logs` | Get logs from a specific container |
| `inspect_container` | Get detailed container configuration |
| `list_images` | List Docker images |
| `container_stats` | Get CPU/memory usage for containers |

## Usage

```
> "What containers are currently running?"
> "Get the last 100 lines of logs from the api-gateway container"
> "Why is the database container using so much memory?"
> "List all images and their sizes — find ones I can clean up"
> "Show me the environment variables in the worker container"
```

## Security Notes

- Requires Docker socket access — ensure proper permissions
- Use read-only operations for inspection (avoid destructive commands in MCP)
- Never expose Docker socket over network

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
