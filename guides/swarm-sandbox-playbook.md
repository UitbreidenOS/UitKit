# Swarm Sandbox Playbook

Operations guide for Swarm Sandbox Simulator — sandbox environment for multi-agent orchestration, agent behavior simulation, and cluster topology experimentation before production deployment.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for sandbox isolation)
- 4GB+ RAM (per 10 concurrent agents)

### Installation
```bash
git clone https://github.com/claudient/swarm-sandbox.git
cd swarm-sandbox
npm install
```

### Start sandbox
```bash
npm run sandbox:dev
```

Sandbox server runs on `http://localhost:3001`. Web UI available at `/dashboard`.

### Deploy first agent
```bash
npm run agent:new -- --name "echo-agent" --template simple
```

This creates an agent template in `/agents/echo-agent.yaml`.

Edit agent config:
```yaml
name: echo-agent
model: claude-haiku-4-5-20251001
instructions: |
  You are an echo agent. Repeat user messages back verbatim.
tools:
  - name: echo
    description: Echo a message
    input_schema:
      type: object
      properties:
        message:
          type: string
```

Register agent:
```bash
npm run agent:register -- --file agents/echo-agent.yaml
```

Test with curl:
```bash
curl -X POST http://localhost:3001/api/agents/echo-agent/invoke \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

---

## Topology Templates

Pre-built multi-agent configurations for common patterns.

### 1. Sequential Pipeline
Agents execute in order; output of one becomes input to the next.

**Use case:** Data processing, content transformation, approval workflows.

```yaml
# topologies/pipeline.yaml
topology: sequential
name: data-pipeline
agents:
  - name: validator
    template: input-validator
    config:
      schema: strict
  - name: processor
    template: data-transform
    config:
      operation: normalize
  - name: enricher
    template: knowledge-enricher
    config:
      knowledge_base: internal
  - name: publisher
    template: output-formatter
    config:
      format: json

flow:
  - from: validator
    to: processor
    on: success
  - from: processor
    to: enricher
    on: success
  - from: enricher
    to: publisher
    on: success
```

Deploy:
```bash
npm run topology:load -- --file topologies/pipeline.yaml
npm run topology:start -- --name data-pipeline
```

### 2. Fan-Out / Fan-In
One agent spawns parallel tasks; results consolidated by another.

**Use case:** Distributed research, parallel analysis, concurrent API calls.

```yaml
# topologies/fanout-fanin.yaml
topology: fanout-fanin
name: research-swarm
coordinator: research-coordinator

fan_out:
  trigger: research-request
  agents:
    - name: web-researcher
      count: 3
      template: search-agent
    - name: doc-analyzer
      count: 2
      template: document-analyzer
    - name: summarizer
      count: 2
      template: summary-agent

fan_in:
  consolidator: research-coordinator
  aggregation_strategy: dedup-and-merge
  timeout_ms: 30000
```

Deploy:
```bash
npm run topology:load -- --file topologies/fanout-fanin.yaml
npm run topology:start -- --name research-swarm
```

Monitor:
```bash
npm run swarm:status -- --name research-swarm
```

### 3. Hierarchical Supervisor
Manager agent delegates to workers; workers report results back.

**Use case:** Delegation patterns, task distribution, hierarchical control.

```yaml
# topologies/hierarchical.yaml
topology: hierarchical
name: task-manager
supervisor: task-supervisor
worker_pools:
  - pool_name: validators
    template: input-validator
    count: 3
  - pool_name: processors
    template: task-processor
    count: 5
  - pool_name: finalizers
    template: result-finalizer
    count: 2

supervisor_config:
  strategy: round-robin
  health_check_interval_ms: 5000
  worker_timeout_ms: 60000
```

Deploy:
```bash
npm run topology:load -- --file topologies/hierarchical.yaml
npm run topology:start -- --name task-manager
```

### 4. Mesh (Fully Connected)
Every agent can communicate with every other agent.

**Use case:** Collaborative problem-solving, consensus-building, negotiation.

```yaml
# topologies/mesh.yaml
topology: mesh
name: collaborative-swarm
agents:
  - name: analyst-1
    template: analytical-agent
    domain: markets
  - name: analyst-2
    template: analytical-agent
    domain: tech
  - name: analyst-3
    template: analytical-agent
    domain: policy
  - name: consensus-agent
    template: consensus-builder
    role: aggregator

communication:
  protocol: direct-message
  allow_peer_to_peer: true
  broadcast_channel: swarm-broadcast
```

Deploy:
```bash
npm run topology:load -- --file topologies/mesh.yaml
npm run topology:start -- --name collaborative-swarm
```

### 5. Request-Response (Client-Server)
Agents serve specific request types; router directs to correct agent.

**Use case:** API microservices, request routing, specialized handlers.

```yaml
# topologies/request-response.yaml
topology: request-response
name: api-swarm
router:
  type: rule-based
  timeout_ms: 10000

handlers:
  - route: /query
    handler: query-agent
    template: database-query-agent
    instances: 3
  - route: /transform
    handler: transform-agent
    template: data-transform-agent
    instances: 2
  - route: /summarize
    handler: summary-agent
    template: summary-agent
    instances: 2

fallback:
  handler: error-handler
  template: error-responder
```

Deploy:
```bash
npm run topology:load -- --file topologies/request-response.yaml
npm run topology:start -- --name api-swarm
```

---

## Safety Checks

Critical validations before swarm deployment.

### Pre-Deployment Checklist

Run before any topology launch:
```bash
npm run safety:check -- --topology topologies/your-topology.yaml
```

This validates:

**1. Agent Configuration**
- All referenced templates exist
- Model names are valid (claude-haiku-4-5-20251001, etc.)
- Tool definitions are valid JSON Schema
- Required fields present (name, instructions)

**2. Communication Safety**
- No circular dependencies (for sequential topologies)
- Timeout values are reasonable (100ms minimum, 300s maximum)
- Message queue capacity sufficient for agent count
- Rate limiting configured for external API calls

**3. Resource Limits**
- CPU per agent: max 2 cores
- Memory per agent: max 1GB
- Concurrent agent limit enforced (default: 50)
- Disk quota per swarm: max 10GB

**4. Access Control**
- Tools only expose approved capabilities
- API keys not hardcoded (use secrets vault)
- Agent permissions narrowly scoped
- Network egress restricted to whitelist

### Runtime Safety Guardrails

Enable automatic safeguards during sandbox execution:

```bash
npm run sandbox:dev -- \
  --enable-guardrails \
  --cpu-limit 2000m \
  --memory-limit 4gb \
  --timeout 300s \
  --disable-external-apis
```

**Guardrails enabled:**
- Kill agent if exceeds CPU/memory limits
- Terminate tool calls exceeding timeout
- Block all external API calls (unless explicitly allowed)
- Interrupt infinite loops (detection after 1000 iterations)
- Rate-limit agent-to-agent messages (100 msg/sec max)

### Vault Configuration

Secure secrets for swarm agents:

```bash
npm run vault:init
```

Store API keys:
```bash
npm run vault:set -- \
  --key openai_api_key \
  --value "sk-..." \
  --scope swarm-agents
```

Reference in agent instructions:
```yaml
tools:
  - name: search-web
    config:
      api_key: "{{ vault.openai_api_key }}"
```

---

## Monitoring Swarms

### Live Dashboard

Web UI available at `http://localhost:3001/dashboard`:

- **Overview:** Swarm status, agent count, message rate
- **Agents:** Per-agent CPU, memory, message latency
- **Messages:** Real-time message flow between agents
- **Errors:** Recent errors and stack traces
- **Performance:** Latency percentiles, throughput

### CLI Monitoring

Check swarm status:
```bash
npm run swarm:status -- --name data-pipeline
```

Output:
```
Name: data-pipeline
Status: running
Agents: 4
Uptime: 2m 14s
Messages/sec: 23.4
CPU usage: 45%
Memory: 512MB / 4GB
Last error: (none)
```

Watch live events:
```bash
npm run swarm:watch -- --name data-pipeline
```

Stream metrics to file:
```bash
npm run swarm:metrics -- \
  --name data-pipeline \
  --output metrics.jsonl \
  --interval 1s
```

### Health Checks

Automated health monitoring:

```bash
npm run swarm:health-check -- --name data-pipeline
```

Checks:
- Agent liveness (heartbeat every 5s)
- Message queue depth (alert if > 1000)
- Error rate (alert if > 5% of messages)
- Agent memory growth (alert if > 100MB/min)
- API response latency (alert if > 5s)

Configure health thresholds:

```yaml
# configs/health.yaml
health_checks:
  agent_heartbeat_timeout_ms: 5000
  message_queue_max: 1000
  error_rate_threshold: 0.05
  memory_growth_rate_threshold: 100  # MB/min
  api_latency_p99_threshold_ms: 5000
  check_interval_ms: 10000
```

Apply:
```bash
npm run config:update -- --file configs/health.yaml
```

### Alerting

Set up alerts for critical conditions:

```bash
npm run alert:configure -- \
  --condition "error_rate > 0.1" \
  --action "send-slack" \
  --channel "#alerts" \
  --severity critical
```

Common alerts:
```bash
npm run alert:configure -- \
  --condition "agent_count == 0" \
  --action "send-pagerduty" \
  --severity critical

npm run alert:configure -- \
  --condition "memory_usage > 0.8" \
  --action "send-email" \
  --recipient ops@company.com \
  --severity warning

npm run alert:configure -- \
  --condition "message_latency_p99 > 5000" \
  --action "auto-scale" \
  --scale-factor 1.5
```

View all alerts:
```bash
npm run alert:list
```

---

## Debugging Agent Interactions

### Trace Execution

Enable detailed logging for a single agent:

```bash
npm run agent:debug -- --name echo-agent --level verbose
```

Output includes:
- Function calls with arguments
- Tool execution results
- Agent state changes
- Message send/receive events
- Timing for each step

Filter logs:
```bash
npm run agent:debug -- \
  --name echo-agent \
  --level verbose \
  --filter "tool.*" \
  --output debug.log
```

### Message Inspection

View messages between agents in real-time:

```bash
npm run swarm:trace -- --name data-pipeline
```

Output:
```
[12:34:56.123] validator -> processor
  {
    "id": "msg-001",
    "status": "valid",
    "data": {"items": 42}
  }

[12:34:56.145] processor -> enricher
  {
    "id": "msg-002",
    "status": "processed",
    "data": {"items": 42, "processed_at": "2026-06-22T..."}
  }
```

Save trace to file:
```bash
npm run swarm:trace -- \
  --name data-pipeline \
  --output trace.jsonl \
  --duration 60s
```

Replay trace:
```bash
npm run swarm:replay -- --trace-file trace.jsonl
```

### Breakpoint Debugging

Pause execution at specific conditions:

```bash
npm run agent:debug -- \
  --name echo-agent \
  --breakpoint-on "tool.search"
```

Breakpoint commands:
- `continue` — Resume execution
- `step` — Execute next step
- `step-over` — Skip function internals
- `print <variable>` — Inspect variable
- `watch <condition>` — Break if condition true

Example session:
```bash
> breakpoint hit: tool.search
> print args
  {query: "test", limit: 10}
> print state
  {mode: "search", count: 3}
> step
> step
> continue
```

### Snapshot Testing

Compare agent behavior across versions:

Create baseline:
```bash
npm run snapshot:create -- \
  --name echo-agent \
  --input '{"message": "hello"}' \
  --output baseline.json
```

Test against baseline:
```bash
npm run snapshot:test -- \
  --name echo-agent \
  --input '{"message": "hello"}' \
  --baseline baseline.json
```

Diff output:
```bash
npm run snapshot:diff -- \
  --baseline baseline.json \
  --current current.json
```

### Stress Testing

Load test a swarm:

```bash
npm run swarm:load-test -- \
  --name data-pipeline \
  --concurrency 100 \
  --duration 60s \
  --request-rate 1000 \
  --output load-test-results.json
```

Generates:
- Latency percentiles (p50, p95, p99, p99.9)
- Throughput (requests/sec)
- Error rates by type
- Agent memory/CPU during test

### Memory Profiling

Detect memory leaks in agents:

```bash
npm run profile:memory -- \
  --name echo-agent \
  --duration 120s \
  --sample-interval 1000
```

Generates heap dump:
```bash
npm run profile:analyze -- \
  --heap heap-dump.json \
  --output memory-report.html
```

---

## Migration to Production

### Pre-Production Validation

1. **Run full test suite**
   ```bash
   npm run test:swarms
   ```

2. **Performance baseline**
   ```bash
   npm run benchmark:baseline -- \
     --topology topologies/your-topology.yaml \
     --output baseline-metrics.json
   ```

3. **Security audit**
   ```bash
   npm run security:audit -- \
     --topology topologies/your-topology.yaml \
     --report security-audit.html
   ```

4. **Compliance check**
   ```bash
   npm run compliance:check -- \
     --topology topologies/your-topology.yaml \
     --standard sox  # or gdpr, hipaa, pci
   ```

### Production Configuration

Create production topology (extends sandbox config):

```yaml
# topologies/production.yaml
topology: sequential
name: data-pipeline-prod
extends: topologies/pipeline.yaml

overrides:
  # Use production model
  agents:
    - name: validator
      model: claude-opus-4-1-20250805  # Stronger model

  # Increase replicas for redundancy
  replicas:
    validator: 2
    processor: 3
    enricher: 2
    publisher: 2

  # Stricter timeouts
  flow:
    - from: validator
      to: processor
      on: success
      timeout_ms: 5000

  # Health monitoring
  health:
    heartbeat_interval_ms: 1000
    max_retries: 3

  # Resource limits
  resources:
    cpu_limit: 1000m
    memory_limit: 512mb
```

Deploy to production:
```bash
npm run topology:deploy -- \
  --file topologies/production.yaml \
  --environment production \
  --version 1.0.0
```

### Monitoring in Production

Enable comprehensive observability:

```bash
npm run monitoring:setup -- \
  --environment production \
  --metrics prometheus \
  --logs datadog \
  --traces jaeger
```

Export metrics to Prometheus:
```bash
curl http://prod-swarm:9090/metrics
```

### Rollback Procedure

If production swarm fails:

```bash
# Stop current version
npm run swarm:stop -- --name data-pipeline-prod

# Inspect error logs
npm run logs:tail -- \
  --name data-pipeline-prod \
  --lines 100

# Identify issue, then rollback to previous version
npm run swarm:deploy -- \
  --version 0.9.0 \
  --environment production \
  --strategy blue-green
```

Blue-green deployment:
- Version 1.0.0 running (blue)
- Deploy version 0.9.0 (green)
- Route traffic to green
- Monitor error rates
- If good, retire blue; if bad, switch back immediately

### Scaling in Production

Auto-scale based on metrics:

```bash
npm run autoscale:configure -- \
  --topology data-pipeline-prod \
  --metric message_queue_depth \
  --target 500 \
  --scale-factor 1.5 \
  --min-instances 2 \
  --max-instances 20
```

Manual scale:
```bash
npm run swarm:scale -- \
  --name data-pipeline-prod \
  --agent processor \
  --replicas 10
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Agents not communicating | Network policy blocks inter-agent traffic | Check firewall rules, enable mesh networking |
| High message latency | Agent overloaded or tool timeout too short | Scale up agent replicas, increase timeout |
| Memory leak | Agent not releasing resources | Enable profiling, check for circular references |
| Topology won't start | Configuration syntax error | Run `npm run safety:check`, review YAML |
| Random agent crashes | OOM kill or resource limit hit | Increase memory limit, reduce concurrency |
| Messages lost | Queue overflow or agent crash | Enable persistence, increase queue capacity |
| Tool calls failing | API key missing or incorrect permissions | Check vault, verify tool access control |

---

## Additional Resources

- [Agent Template Reference](../skills/agent-templates.md)
- [Tool Definition Guide](../guides/tool-definitions.md)
- [Swarm Topology Specification](../mcp/swarm-spec.md)
- [Claude Models Reference](../skills/claude-api.md)
