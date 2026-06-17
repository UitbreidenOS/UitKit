# MCP Tool: Terraform State

## Purpose

Inspect Terraform state, plan diffs, and resource metadata without running terraform locally.

## Tools Provided

- `terraform-show` — Display state contents
- `terraform-plan` — Generate plan JSON
- `terraform-state-list` — List all resources
- `terraform-import` — Add resources to state
- `terraform-validate` — Check syntax and configuration

## Config

```json
{
  "mcp": [
    {
      "name": "terraform-state",
      "command": "terraform",
      "env": {
        "TF_DATA_DIR": "~/.terraform"
      }
    }
  ]
}
```

## Example

Show all AWS resources and their current configuration from state.
