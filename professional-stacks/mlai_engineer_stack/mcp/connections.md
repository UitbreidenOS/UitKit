# ML/AI Stack MCP Connections

## Weights & Biases (W&B)

### Prerequisites
- W&B account and API key
- Python 3.8+
- `wandb` CLI installed

### Setup

1. Authenticate with W&B:
```bash
wandb login
```

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "wandb": {
    "command": "npx",
    "args": ["@wandb/mcp-server"],
    "env": {
      "WANDB_API_KEY": "${WANDB_API_KEY}"
    }
  }
}
```

3. Set environment variable:
```bash
export WANDB_API_KEY="your_api_key_here"
```

### Available Tools
- Log runs and metrics
- Query experiment history
- Access datasets and artifacts
- Fetch model metadata

---

## Hugging Face

### Prerequisites
- Hugging Face account and access token
- `huggingface-hub` library
- Write permissions for model/dataset operations

### Setup

1. Generate access token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

2. Add to Claude Code settings.json under `mcpServers`:
```json
{
  "huggingface": {
    "command": "npx",
    "args": ["@huggingface/mcp-server"],
    "env": {
      "HF_TOKEN": "${HF_TOKEN}"
    }
  }
}
```

3. Set environment variable:
```bash
export HF_TOKEN="hf_your_token_here"
```

### Available Tools
- Search and download models
- Access datasets and documentation
- Manage model cards and repos
- Query Hub metadata

---

## Testing Connections

```bash
# Test W&B connection
claude code eval "wandb: get current user info"

# Test Hugging Face connection
claude code eval "huggingface: list models by filter"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Auth failures | Verify API keys are valid and unexpired |
| Connection timeout | Check firewall; ensure MCPs are properly installed |
| Missing tools | Verify `mcpServers` config matches installed package versions |

