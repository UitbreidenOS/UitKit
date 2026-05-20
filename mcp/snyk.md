# MCP: Snyk Security Scanning

Real-time vulnerability scanning from inside Claude Code. Ask Claude to check your dependencies for CVEs, get fix suggestions, and understand the severity — without leaving your session.

## Why you need this

Instead of running `npm audit` and pasting results into Claude, the Snyk MCP server lets Claude query vulnerabilities directly:
- "Are there any critical CVEs in this project?"
- "What's the fix for the lodash vulnerability?"
- "Which dependencies should I update before shipping?"

## Prerequisites

```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate (free account available)
snyk auth
```

## Configuration

```json
{
  "mcpServers": {
    "snyk": {
      "command": "npx",
      "args": ["-y", "snyk-mcp"],
      "env": {
        "SNYK_TOKEN": "your-snyk-token-here"
      }
    }
  }
}
```

Get your token: [app.snyk.io/account](https://app.snyk.io/account)

## What Claude can do with Snyk

```
# Check for vulnerabilities
"Scan this project for security vulnerabilities"

# Fix specific issues
"The lodash vulnerability — how do I fix it without breaking anything?"

# Pre-ship check
"Are there any Critical or High CVEs that would block a production deploy?"

# Licence check
"Are any of our dependencies using GPL licences that might cause issues?"
```

## Available tools

| Tool | What it does |
|---|---|
| `snyk_test` | Scan project for vulnerabilities |
| `snyk_fix` | Generate fix recommendations |
| `snyk_monitor` | Register project for ongoing monitoring |
| `snyk_iac` | Scan Terraform/K8s/Docker for misconfigs |
| `snyk_container` | Scan Docker images |

## Free tier limits

Snyk free tier: 200 tests/month for open source projects. Sufficient for most development workflows.

## Combine with the dependency-auditor skill

Use the `/dependency-auditor` skill to understand what to fix and why, and Snyk MCP for automated, real-time detection.
