# Kafka MCP Server

Connects Claude Code to Apache Kafka clusters for topic inspection, consumer group monitoring, and message analysis.

---

## Installation

```json
{
  "mcpServers": {
    "kafka": {
      "command": "npx",
      "args": ["-y", "kafka-mcp-server"],
      "env": {
        "KAFKA_BROKERS": "localhost:9092"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `list_topics` | List all topics with partition counts |
| `describe_topic` | Get topic configuration and partition details |
| `consumer_groups` | List consumer groups and their lag |
| `read_messages` | Read recent messages from a topic |
| `cluster_info` | Get Kafka cluster broker information |

## Usage

```
> "List all Kafka topics and their partition counts"
> "What's the consumer lag for the order-processing group?"
> "Read the last 10 messages from the events topic"
> "Show me the retention policy for the logs topic"
> "Which consumer groups are active right now?"
```

## Security Notes

- Use SASL/SSL for production Kafka clusters
- Limit to read operations in MCP (no producing messages)
- Monitor consumer lag regularly — it's the key health metric

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
