# GitHub MCP

## Overview

The GitHub MCP provides authenticated access to GitHub repositories, issues, pull requests, discussions, and workflows through the Claude Code harness. Use this when you need to interact with GitHub APIs without manual authentication or rate-limit concerns.

## Setup

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

Set your GitHub personal access token:
```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

Required scopes: `repo`, `workflow`, `read:discussion`

## Available Tools

- **Read repository files** — `gh api repos/{owner}/{repo}/contents/{path}`
- **List issues and PRs** — `gh api repos/{owner}/{repo}/issues`
- **Create/update issues** — `gh api repos/{owner}/{repo}/issues` (POST/PATCH)
- **Manage pull requests** — `gh api repos/{owner}/{repo}/pulls`
- **Read workflows and runs** — `gh api repos/{owner}/{repo}/actions`
- **Discussions** — `gh api repos/{owner}/{repo}/discussions`

## When to Use

- Automated PR review workflows
- Extracting repository metadata programmatically
- Reading file content without cloning
- Querying issue/PR history at scale

## When NOT to Use

- Simple operations: use `gh` CLI instead (faster, less overhead)
- Pushing code or merging PRs: prefer native Git operations
- Non-GitHub platforms: use platform-specific MCPs

## Example

Fetch all open PRs in a repository:

```bash
curl -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  https://api.github.com/repos/owner/repo/pulls?state=open
```

Or via Claude Code MCP tools:

```
gh api repos/owner/repo/pulls --paginate -q '.[] | .number, .title, .author.login'
```
