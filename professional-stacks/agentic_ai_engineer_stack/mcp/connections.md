# Agentic AI Stack MCP Connections

This document describes MCP (Model Context Protocol) server integrations for agentic AI systems.

## Anthropic Agents API

Official support for managed agent lifecycle, including deployment, monitoring, and resource management.

### Prerequisites

- Anthropic API key with Agents API access
- `anthropic` Python SDK (v0.25+) or Node.js SDK
- Proper authentication and permissions configured

### Setup

1. **Install Anthropic SDK:**

```bash
# Python
pip install anthropic>=0.25.0

# Node.js
npm install @anthropic-ai/sdk
```

2. **Configure in Claude Code settings.json:**

```json
{
  "mcpServers": {
    "anthropic-agents": {
      "command": "python",
      "args": ["-m", "anthropic_agents_mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

3. **Set environment variable:**

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Available Tools

#### Deploy Agent

Deploy an agent to Anthropic's managed infrastructure.

**Input:**
```json
{
  "agent_name": "string",
  "agent_definition": "JSON agent spec",
  "model": "claude-3-5-sonnet",
  "resource_tier": "standard|advanced"
}
```

**Output:**
```json
{
  "agent_id": "string",
  "status": "deploying|active",
  "endpoint": "https://api.anthropic.com/agents/...",
  "created_at": "ISO 8601"
}
```

#### Invoke Agent

Call a deployed agent synchronously.

**Input:**
```json
{
  "agent_id": "string",
  "input": "user message or JSON",
  "timeout_seconds": 30
}
```

**Output:**
```json
{
  "decision": "string|JSON",
  "status": "success|failure|timeout",
  "latency_ms": 1234,
  "tokens_used": {"input": 1024, "output": 256}
}
```

#### List Agents

Query deployed agents.

**Input:**
```json
{
  "status": "active|inactive|all",
  "limit": 10
}
```

**Output:**
```json
{
  "agents": [
    {
      "agent_id": "string",
      "name": "string",
      "status": "active",
      "created_at": "ISO 8601",
      "invocations": 12345,
      "success_rate": 0.98
    }
  ]
}
```

#### Get Agent Metrics

Retrieve performance metrics for a deployed agent.

**Input:**
```json
{
  "agent_id": "string",
  "metrics": ["latency", "success_rate", "token_usage"],
  "period": "1h|1d|7d"
}
```

**Output:**
```json
{
  "agent_id": "string",
  "period": "1d",
  "latency": {"p50_ms": 1200, "p95_ms": 3400, "p99_ms": 5600},
  "success_rate": 0.97,
  "token_usage": {"total": 250000, "input": 180000, "output": 70000},
  "invocations": 450
}
```

### Example: Deploy and Invoke Agent

```python
import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

# Deploy agent
agent_spec = {
    "name": "ContentModerator",
    "purpose": "Autonomously moderate user content",
    "constraints": {
        "max_decisions_per_minute": 100,
        "required_confidence": 0.75
    },
    "system_prompt": "You are a content moderator..."
}

agent = client.agents.create(
    name="ContentModerator",
    definition=agent_spec,
    model="claude-3-5-sonnet"
)

print(f"Agent deployed: {agent.id}")

# Invoke agent
response = client.agents.invoke(
    agent_id=agent.id,
    input={
        "content_id": "c-123",
        "content_text": "This is a post",
        "content_type": "post"
    },
    timeout_seconds=30
)

print(f"Decision: {response.decision}")
print(f"Latency: {response.latency_ms}ms")
```

## Observability Services Integration

### DataDog

Connect agents to DataDog APM for comprehensive monitoring.

**Setup:**

```json
{
  "mcpServers": {
    "datadog": {
      "command": "npx",
      "args": ["@datadog/mcp-server"],
      "env": {
        "DD_API_KEY": "${DD_API_KEY}",
        "DD_SITE": "datadoghq.com",
        "DD_SERVICE": "agentic-system"
      }
    }
  }
}
```

**Available tools:**
- Log events to DataDog
- Send custom metrics
- Query traces and metrics
- Create/manage monitors and alerts
- Access dashboards

### New Relic

Connect agents to New Relic for real-time monitoring and alerting.

**Setup:**

```json
{
  "mcpServers": {
    "newrelic": {
      "command": "npx",
      "args": ["@newrelic/mcp-server"],
      "env": {
        "NEW_RELIC_API_KEY": "${NEW_RELIC_API_KEY}",
        "NEW_RELIC_ACCOUNT_ID": "123456"
      }
    }
  }
}
```

**Available tools:**
- Send custom events
- Query NRQL (New Relic Query Language)
- Access APM data
- Configure alerts

### Prometheus

Export agent metrics to Prometheus for long-term storage and querying.

**Setup:**

```json
{
  "mcpServers": {
    "prometheus": {
      "command": "python",
      "args": ["-m", "prometheus_mcp"],
      "env": {
        "PROMETHEUS_URL": "http://localhost:9090"
      }
    }
  }
}
```

**Available tools:**
- Push metrics to Prometheus Pushgateway
- Query Prometheus API
- Access time-series data

## Debugging & Logging Services

### Sentry

Capture agent errors and exceptions for real-time alerting.

**Setup:**

```json
{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": ["@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "your-org",
        "SENTRY_PROJECT": "agents"
      }
    }
  }
}
```

### Honeycomb

Send structured logs and spans from agents for debugging and performance analysis.

**Setup:**

```json
{
  "mcpServers": {
    "honeycomb": {
      "command": "npx",
      "args": ["@honeycomb/mcp-server"],
      "env": {
        "HONEYCOMB_API_KEY": "${HONEYCOMB_API_KEY}",
        "HONEYCOMB_DATASET": "agents"
      }
    }
  }
}
```

## Testing Connections

Verify MCP servers are properly configured:

```bash
# Test Anthropic Agents API
claude code eval "anthropic-agents: list deployed agents"

# Test DataDog
claude code eval "datadog: get current metrics for agent 'ContentModerator'"

# Test New Relic
claude code eval "newrelic: query events from last 1 hour"

# Test Prometheus
claude code eval "prometheus: query metric agent_latency_ms"
```

## Best Practices

1. **Separate credentials per environment** — Use different API keys for dev/staging/production
2. **Rotate API keys regularly** — Minimize exposure of long-lived credentials
3. **Enable audit logging** — Track all MCP tool invocations for compliance
4. **Monitor MCP connection health** — Set up alerts if services become unavailable
5. **Use rate limiting** — Prevent MCP requests from overwhelming downstream services

## Troubleshooting

| Issue | Solution |
|---|---|
| Auth failures | Verify API keys are valid, permissions set, and environment variables correctly named |
| Connection timeout | Check firewall; ensure MCP servers are properly installed; test network connectivity |
| Missing tools | Verify MCP server version matches integration spec; reinstall if needed |
| High latency | Profile MCP requests; consider caching responses if queries are repeated |
| Rate limit errors | Implement backoff logic; increase rate limit quotas if sustainable |

---

For detailed setup instructions and API reference, see the documentation links below:

- [Anthropic Agents API Documentation](https://docs.anthropic.com/en/docs/build-a-system/agents)
- [DataDog APM Guide](https://docs.datadoghq.com/tracing/)
- [New Relic APM](https://docs.newrelic.com/docs/apm/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
