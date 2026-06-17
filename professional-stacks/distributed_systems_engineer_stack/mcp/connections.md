# Distributed Systems MCP Connections

## Overview

MCP servers for observability, monitoring, and failure injection in distributed systems engineering.

---

## Jaeger Distributed Tracing

### Prerequisites
- Jaeger instance running (local or remote)
- Jaeger gRPC endpoint accessible (default: localhost:14250)
- jaeger-client library for your language
- Instrumented application sending traces

### Setup

1. Start Jaeger locally (Docker):
```bash
docker run -d --name jaeger \
  -p 6831:6831/udp \
  -p 16686:16686 \
  jaegertracing/all-in-one
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "jaeger": {
    "command": "node",
    "args": ["path/to/jaeger-mcp-server.js"],
    "env": {
      "JAEGER_AGENT_HOST": "localhost",
      "JAEGER_AGENT_PORT": "6831",
      "JAEGER_ENDPOINT": "http://localhost:14250"
    }
  }
}
```

### Available Tools

- **Query traces by service** — Find all traces for a service (e.g., "kafka-broker")
- **Query traces by operation** — Find traces for specific operation (e.g., "replicate-entry")
- **Get trace details** — Extract full trace with all spans and timing
- **Analyze latency** — Compute p50, p99, p99.9 latencies across traces
- **Identify bottlenecks** — Find slowest spans in trace (where time is spent)
- **Compare traces** — Compare latency before/after change or during failure

### Example Usage

```
Query: jaeger service traces for "distributed-kvstore" to see replication latency
Response: Returns traces showing write → replicate → ack path with timing
Analysis: "Write path takes 15ms avg: 5ms leader processing + 8ms network + 2ms replica ack"
```

---

## Elastic Stack (ELK) for Log Analysis

### Prerequisites
- Elasticsearch cluster running
- Logstash or Filebeat for log shipping
- Kibana for visualization (optional but recommended)
- Fluent Bit or Fluentd for log collection

### Setup

1. Deploy Elasticsearch (Docker):
```bash
docker run -d --name elasticsearch \
  -e discovery.type=single-node \
  -p 9200:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:8.0.0
```

2. Ship logs to Elasticsearch (Fluent Bit):
```bash
# fluent-bit.conf
[INPUT]
    Name tail
    Path /var/log/distributed-systems/*.log
    Parser json

[OUTPUT]
    Name es
    Match *
    Host elasticsearch
    Port 9200
    Index distributed-systems
```

3. Add to Claude Code settings.json:
```json
{
  "elasticsearch": {
    "command": "node",
    "args": ["path/to/elasticsearch-mcp-server.js"],
    "env": {
      "ELASTICSEARCH_HOST": "localhost:9200",
      "ELASTICSEARCH_USERNAME": "${ES_USER}",
      "ELASTICSEARCH_PASSWORD": "${ES_PASSWORD}"
    }
  }
}
```

### Available Tools

- **Search logs** — Full-text search with filters (service, level, node)
- **Aggregate logs** — Count by field (e.g., "error messages per service")
- **Time-series analysis** — See log volume and patterns over time
- **Extract metrics** — Parse structured logs to extract timing data
- **Correlate events** — Find related logs across multiple nodes

### Example Usage

```
Query: "Find all ERROR logs from kafka-broker-3 in the last 10 minutes"
Response: 47 errors found, grouped by: 15 "replication_timeout", 20 "network_unreachable", 12 "disk_full"
Analysis: "High replication timeouts + network errors suggest partition or overload during 14:25-14:35"
```

---

## Prometheus Metrics

### Prerequisites
- Prometheus server running
- Exporters on distributed system nodes (node_exporter, custom exporters)
- Metrics already being scraped

### Setup

1. Deploy Prometheus (Docker):
```bash
docker run -d --name prometheus \
  -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

2. Configure Prometheus to scrape your system:
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'distributed-system'
    static_configs:
      - targets: ['localhost:9100', 'localhost:9101', 'localhost:9102']
```

3. Add to Claude Code settings.json:
```json
{
  "prometheus": {
    "command": "node",
    "args": ["path/to/prometheus-mcp-server.js"],
    "env": {
      "PROMETHEUS_URL": "http://localhost:9090"
    }
  }
}
```

### Available Tools

- **Query metrics** — PromQL queries (e.g., "rate(replication_lag[5m])")
- **Get time-series** — Fetch metric values over time range
- **Alert status** — Check active alerts
- **Analyze trends** — Compute rate of change, anomaly detection

### Example Usage

```
Query: "replication_lag_ms over last 30 minutes for kafka-cluster"
Response: Shows lag increasing from 10ms → 500ms as load increases
Analysis: "System can handle 5k req/sec before replication lags; need more replicas or faster disks"
```

---

## Gremlin for Chaos Engineering

### Prerequisites
- Gremlin account and API key
- Gremlin CLI installed
- Target system accessible from Gremlin infrastructure
- Blast radius scope defined

### Setup

1. Create Gremlin account at [gremlin.com](https://gremlin.com)

2. Install Gremlin CLI:
```bash
# macOS
brew tap gremlin/tools && brew install gremlin

# Linux
curl -s https://downloads.gremlin.com/gremlin/install.sh | sudo bash
```

3. Authenticate:
```bash
gremlin login
# Follow prompts for API key + certificate
```

4. Add to Claude Code settings.json:
```json
{
  "gremlin": {
    "command": "gremlin",
    "args": ["run"],
    "env": {
      "GREMLIN_API_KEY": "${GREMLIN_API_KEY}",
      "GREMLIN_CERTIFICATE": "${GREMLIN_CERT_PATH}"
    }
  }
}
```

### Available Tools

- **Run attack** — Inject failure scenario (CPU, memory, latency, packet loss)
- **Target by tag** — Specify which nodes/containers are affected
- **Schedule attack** — Run during specific time window
- **Monitor blast** — Get real-time impact metrics
- **Get report** — Post-mortem of what happened, system behavior

### Example Usage

```
Attack: "CPU attack: 95% CPU utilization on kafka-broker-1 for 60 seconds"
Result: "CPU constrained broker becomes slow, replication lag spikes to 5s, then recovers after attack ends"
Analysis: "System tolerates single slow replica; replication timeout prevents cascading failure"
```

---

## Vector DB (Qdrant/Pinecone) for Semantic Trace Analysis

### Prerequisites
- Vector DB instance (Qdrant self-hosted or Pinecone cloud)
- Embeddings model (OpenAI, local embedding service)
- Trace data converted to vectors

### Setup

1. Start Qdrant (Docker):
```bash
docker run -p 6333:6333 qdrant/qdrant
```

2. Index your traces:
```bash
# Convert traces to vectors and store
trace_embedder --source jaeger --target qdrant://localhost:6333
```

3. Add to Claude Code settings.json:
```json
{
  "qdrant": {
    "command": "node",
    "args": ["path/to/qdrant-mcp-server.js"],
    "env": {
      "QDRANT_URL": "http://localhost:6333"
    }
  }
}
```

### Available Tools

- **Find similar traces** — "Show me traces similar to this replication timeout"
- **Cluster anomalies** — Group unusual traces together
- **Semantic search** — "Find all traces where latency spiked mysteriously"

### Example Usage

```
Query: "Find traces similar to [my_slow_write_trace]"
Result: "6 similar traces found: all have high CPU + network latency + replication timeout"
Analysis: "This is a known failure mode; see runbook #42 for recovery steps"
```

---

## Configuration Checklist

Before running distributed systems analysis:

- [ ] Jaeger instance accessible and receiving traces
- [ ] Elasticsearch running with logs being shipped
- [ ] Prometheus scraping your system metrics
- [ ] Gremlin account set up (for chaos engineering)
- [ ] Vector DB (optional) indexed with trace embeddings
- [ ] All MCP servers configured in settings.json
- [ ] Environment variables set (API keys, endpoints)
- [ ] Test connectivity: `claude code eval "jaeger: get trace for [service]"`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Jaeger not receiving traces | Verify jaeger-agent port open (6831 UDP), application configured with correct endpoint |
| Elasticsearch connection timeout | Check ES cluster health (`curl localhost:9200/_health`), verify auth credentials |
| Prometheus metric not found | Run `curl localhost:9090/api/v1/targets` to see scraped metrics |
| Gremlin attack not executing | Verify target tags are correct, agents are running on target machines |
| Vector DB queries slow | Check embedding dimension, add indices, verify query vector is correct format |

---

## Integration Workflow

Typical distributed systems analysis flow:

1. **Design phase** — Use consensus-protocol-designer, failure-mode-analyzer
2. **Load test phase** — Use load-test-designer, collect metrics via Prometheus
3. **Failure analysis** — Query Jaeger traces, correlate with Elasticsearch logs
4. **Chaos phase** — Inject failures via Gremlin, measure impact
5. **Post-mortem** — Use Vector DB to find similar past incidents, extract lessons

---

**Last updated:** 2026-06-15
