# Anthropic Agents MCP Integration

Direct integration with Anthropic's Agents API for deploying, monitoring, and managing autonomous agents in production.

## Overview

The Anthropic Agents API provides:

- **Managed deployment** — Deploy agents without managing infrastructure
- **Built-in observability** — Automatic logging, metrics, and distributed tracing
- **Scalable execution** — Handle thousands of concurrent agent invocations
- **Resource management** — Automatic scaling, quota enforcement, cost tracking
- **Security** — API key management, audit logging, access controls

## Configuration

Add to Claude Code settings.json:

```json
{
  "mcpServers": {
    "anthropic-agents": {
      "command": "python",
      "args": ["-m", "anthropic_agents_mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}",
        "ANTHROPIC_ORG_ID": "${ANTHROPIC_ORG_ID}"
      }
    }
  }
}
```

Alternatively, use Node.js:

```json
{
  "mcpServers": {
    "anthropic-agents": {
      "command": "npx",
      "args": ["@anthropic/agents-mcp"],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

## Tool: Deploy Agent

Deploy an agent specification to Anthropic's infrastructure.

**Purpose:** Create a managed agent that can be invoked via API

**Input:**

```json
{
  "name": "string, required",
  "system_prompt": "string, required (the agent's instructions)",
  "model": "string, default: claude-3-5-sonnet",
  "constraints": {
    "max_tokens_per_invocation": 2048,
    "max_invocations_per_minute": 100,
    "required_confidence_threshold": 0.75
  },
  "metadata": {
    "team": "string",
    "environment": "dev|staging|production",
    "version": "semver string"
  }
}
```

**Output:**

```json
{
  "agent_id": "agent-abc123xyz",
  "name": "ContentModerator",
  "status": "active",
  "model": "claude-3-5-sonnet",
  "endpoint": "https://api.anthropic.com/v1/agents/agent-abc123xyz/invoke",
  "created_at": "2026-06-15T10:30:15Z",
  "resource_tier": "standard"
}
```

**Example:**

```python
client = anthropic.Anthropic(api_key="sk-ant-...")

agent = client.agents.deploy(
    name="ContentModerator",
    system_prompt="""You are a content moderation agent. Your job is to:
    1. Evaluate user-generated content against safety policies
    2. Approve content that complies with all policies
    3. Reject content with explicit policy violations
    4. Escalate ambiguous cases (confidence < 0.80)
    
    Output JSON:
    {
      "decision": "approve|reject|escalate",
      "confidence": 0.0-1.0,
      "reasoning": "why this decision",
      "policy_violations": ["list of detected violations"]
    }
    """,
    model="claude-3-5-sonnet",
    constraints={
        "max_tokens_per_invocation": 1024,
        "max_invocations_per_minute": 1000
    }
)

print(f"Agent deployed: {agent.agent_id}")
```

## Tool: Invoke Agent

Call a deployed agent synchronously.

**Purpose:** Get a decision from the agent

**Input:**

```json
{
  "agent_id": "string, required",
  "input": "string or object, required (the request data)",
  "timeout_seconds": "integer, default: 30",
  "trace_id": "string, optional (for distributed tracing)"
}
```

**Output:**

```json
{
  "agent_id": "agent-abc123xyz",
  "invocation_id": "inv-def456uvw",
  "status": "success|failure|timeout",
  "decision": "string or object (agent's output)",
  "confidence": 0.95,
  "latency_ms": 1234,
  "tokens_used": {
    "input": 1024,
    "output": 256,
    "total": 1280
  },
  "cost_usd": 0.0032,
  "timestamp": "2026-06-15T10:30:15Z"
}
```

**Example:**

```python
response = client.agents.invoke(
    agent_id="agent-abc123xyz",
    input={
        "content_id": "c-98765",
        "content_text": "This is a post from a user",
        "content_type": "post",
        "user_id": "user-abc"
    },
    timeout_seconds=30
)

print(f"Decision: {response.decision}")
print(f"Confidence: {response.confidence}")
print(f"Latency: {response.latency_ms}ms")
print(f"Cost: ${response.cost_usd:.4f}")
```

## Tool: List Agents

Query deployed agents.

**Purpose:** Discover available agents; check their status and metrics

**Input:**

```json
{
  "filter": {
    "status": "active|inactive|all",
    "team": "string, optional",
    "environment": "dev|staging|production"
  },
  "limit": 50,
  "offset": 0
}
```

**Output:**

```json
{
  "agents": [
    {
      "agent_id": "agent-abc123xyz",
      "name": "ContentModerator",
      "status": "active",
      "model": "claude-3-5-sonnet",
      "created_at": "2026-06-15T10:30:15Z",
      "created_by": "user@example.com",
      "invocations_total": 45230,
      "success_rate": 0.97,
      "avg_latency_ms": 1450
    }
  ],
  "total_count": 23,
  "limit": 50,
  "offset": 0
}
```

**Example:**

```python
agents = client.agents.list(
    filter={"status": "active", "environment": "production"},
    limit=10
)

for agent in agents.agents:
    print(f"{agent.name}: {agent.success_rate * 100:.1f}% success rate")
```

## Tool: Get Agent Metrics

Retrieve performance and usage metrics.

**Purpose:** Monitor agent health, performance, and cost

**Input:**

```json
{
  "agent_id": "string, required",
  "metrics": ["latency", "success_rate", "token_usage", "cost"],
  "period": "1h|1d|7d|30d",
  "granularity": "minute|hour|day"
}
```

**Output:**

```json
{
  "agent_id": "agent-abc123xyz",
  "period": "1d",
  "timestamp": "2026-06-15T10:30:15Z",
  "latency": {
    "p50_ms": 1200,
    "p95_ms": 3400,
    "p99_ms": 5600,
    "max_ms": 8900,
    "mean_ms": 1450
  },
  "success_rate": {
    "total": 12450,
    "successful": 12085,
    "failed": 365,
    "rate": 0.9706
  },
  "token_usage": {
    "input_tokens": 18500000,
    "output_tokens": 5200000,
    "total_tokens": 23700000
  },
  "cost": {
    "total_usd": 234.56,
    "cost_per_invocation_usd": 0.01882
  },
  "errors": [
    {
      "error_type": "timeout",
      "count": 200
    },
    {
      "error_type": "input_validation",
      "count": 165
    }
  ]
}
```

**Example:**

```python
metrics = client.agents.metrics(
    agent_id="agent-abc123xyz",
    metrics=["latency", "success_rate", "cost"],
    period="7d"
)

print(f"P95 latency: {metrics.latency.p95_ms}ms")
print(f"Success rate: {metrics.success_rate.rate * 100:.2f}%")
print(f"7-day cost: ${metrics.cost.total_usd:.2f}")
```

## Tool: Update Agent

Modify agent configuration (system prompt, constraints, model).

**Purpose:** Update agent behavior without redeployment

**Input:**

```json
{
  "agent_id": "string, required",
  "system_prompt": "string, optional (new instructions)",
  "constraints": {
    "max_tokens_per_invocation": 2048,
    "required_confidence_threshold": 0.75
  },
  "metadata": {
    "version": "semver string"
  }
}
```

**Output:**

```json
{
  "agent_id": "agent-abc123xyz",
  "status": "updated",
  "previous_version": "1.0.0",
  "current_version": "1.1.0",
  "updated_at": "2026-06-15T10:40:00Z"
}
```

**Example:**

```python
# Update agent prompt to be more conservative
updated_agent = client.agents.update(
    agent_id="agent-abc123xyz",
    system_prompt="""[Updated instructions with stricter confidence threshold]
    Escalate if confidence < 0.85 (previously 0.80)
    """,
    constraints={"required_confidence_threshold": 0.85}
)

print(f"Agent updated to version {updated_agent.current_version}")
```

## Tool: Delete Agent

Deactivate or remove a deployed agent.

**Purpose:** Stop accepting invocations; archive old agents

**Input:**

```json
{
  "agent_id": "string, required",
  "mode": "deactivate|delete"
}
```

**Output:**

```json
{
  "agent_id": "agent-abc123xyz",
  "status": "deactivated",
  "deactivated_at": "2026-06-15T10:50:00Z"
}
```

## Production Patterns

### Pattern 1: Canary Deployment

Deploy a new version alongside production; gradually shift traffic.

```python
# Deploy v2
agent_v2 = client.agents.deploy(
    name="ContentModerator-v2",
    system_prompt="[Updated instructions]",
    metadata={"version": "2.0.0"}
)

# Monitor v2 metrics
v1_metrics = client.agents.metrics(agent_id="agent-v1-id", period="1d")
v2_metrics = client.agents.metrics(agent_id=agent_v2.agent_id, period="1d")

# Compare success rates
v1_success = v1_metrics.success_rate.rate
v2_success = v2_metrics.success_rate.rate

if v2_success >= v1_success - 0.01:  # Within 1% of v1
    # Shift traffic to v2
    print(f"Promoting v2: {v2_success * 100:.2f}% success rate")
else:
    # Revert to v1
    print(f"v2 degradation detected; staying with v1")
    client.agents.delete(agent_id=agent_v2.agent_id)
```

### Pattern 2: A/B Testing

Run two agent versions in parallel; measure impact.

```python
# Create variant A and B
agent_a = client.agents.deploy(name="Moderator-A", system_prompt="[prompt A]")
agent_b = client.agents.deploy(name="Moderator-B", system_prompt="[prompt B]")

# Route requests randomly (50/50)
import random

content = {"content_id": "c-123", "content_text": "..."}

if random.random() < 0.5:
    result = client.agents.invoke(agent_id=agent_a.agent_id, input=content)
else:
    result = client.agents.invoke(agent_id=agent_b.agent_id, input=content)

# After sufficient samples, check metrics
metrics_a = client.agents.metrics(agent_id=agent_a.agent_id, period="7d")
metrics_b = client.agents.metrics(agent_id=agent_b.agent_id, period="7d")

print(f"Agent A: {metrics_a.success_rate.rate * 100:.2f}%")
print(f"Agent B: {metrics_b.success_rate.rate * 100:.2f}%")
```

### Pattern 3: Cost Optimization

Monitor and optimize agent token usage.

```python
metrics = client.agents.metrics(agent_id="agent-id", period="30d")

cost_per_decision = metrics.cost.cost_per_invocation_usd
token_efficiency = metrics.success_rate.total / metrics.token_usage.total_tokens

print(f"Cost per decision: ${cost_per_decision:.4f}")
print(f"Tokens per decision: {token_efficiency:.2f}")

# If cost is high, consider:
# 1. Using a smaller model (Haiku instead of Sonnet)
# 2. Reducing max_tokens_per_invocation
# 3. Optimizing system prompt for brevity
```

## Error Handling

Agents API returns standard HTTP errors:

| Status | Meaning | Recovery |
|---|---|---|
| 200 | Success | Use the result |
| 400 | Invalid input | Fix input schema |
| 401 | Auth failure | Check API key |
| 429 | Rate limited | Retry with backoff |
| 500 | Server error | Retry after delay |
| 504 | Timeout | Increase timeout or reduce scope |

**Example error handling:**

```python
import time

max_retries = 3
backoff = 1

for attempt in range(max_retries):
    try:
        result = client.agents.invoke(
            agent_id=agent_id,
            input=data,
            timeout_seconds=30
        )
        print(f"Success: {result.decision}")
        break
    except anthropic.RateLimitError:
        if attempt < max_retries - 1:
            time.sleep(backoff)
            backoff *= 2
        else:
            print("Max retries exceeded; escalating to human")
    except anthropic.APIError as e:
        print(f"API error: {e.status_code} {e.message}")
        # Escalate or fail gracefully
```

## Cost Tracking

Monitor token usage and costs:

```python
# Get 30-day cost report
metrics = client.agents.metrics(
    agent_id="agent-id",
    metrics=["token_usage", "cost"],
    period="30d"
)

print(f"Input tokens: {metrics.token_usage.input_tokens:,}")
print(f"Output tokens: {metrics.token_usage.output_tokens:,}")
print(f"Total cost: ${metrics.cost.total_usd:.2f}")
print(f"Cost per invocation: ${metrics.cost.cost_per_invocation_usd:.4f}")
```

## References

- [Anthropic Agents API Documentation](https://docs.anthropic.com/en/docs/build-a-system/agents)
- [Claude Models Pricing](https://www.anthropic.com/pricing)
- [API Status and Rate Limits](https://docs.anthropic.com/en/docs/resources/rate-limits)
