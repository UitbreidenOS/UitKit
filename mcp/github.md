# MCP: GitHub

Interact with GitHub directly from Claude Code. Read issues, open PRs, review code, search repositories, and manage releases — all without leaving the terminal or switching to a browser.

## Why you need this

The `gh` CLI covers most local Git operations, but GitHub's API surface is much larger. With GitHub MCP:
- Claude can search code across your entire org, not just the current repo
- Issue triage, labeling, and commenting happen inside the same session as your code changes
- PR creation and review are part of the workflow, not a separate browser task
- Repository metadata, commit history, and file contents from any branch are queryable
- Cross-repo tasks (dependency audits, org-wide searches) become single prompts

## Installation

```bash
npm install -g @modelcontextprotocol/server-github
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-pat-here"
      }
    }
  }
}
```

## Key tools

- `create_or_update_file` — create or update a file in a repository
- `search_repositories` — search GitHub for repositories by keyword or topic
- `create_repository` — create a new repository under your account or org
- `get_file_contents` — read a file from any branch of any accessible repo
- `push_files` — push multiple file changes as a single commit
- `create_issue` — open a new issue with title, body, labels, and assignees
- `create_pull_request` — open a PR with title, body, base, and head branch
- `fork_repository` — fork a repo to your account
- `create_branch` — create a new branch from any ref
- `list_commits` — get the commit history for a branch or file path
- `list_issues` / `get_issue` — query issues by state, label, assignee, or milestone
- `add_issue_comment` — add a comment to any issue or PR
- `search_code` — search code across GitHub using the code search syntax
- `search_issues` — search issues and PRs with GitHub's full query syntax

## Usage examples

```
List all open issues in this repo labeled 'bug', sorted by comment count,
and give me a priority-ordered summary of what needs fixing first.
```

```
Read the PR description for #123 and write a detailed code review comment
on the authentication changes — focus on security and edge cases.
```

```
Search for all TODO and FIXME comments across the codebase using search_code,
then create a GitHub issue for each one in the TECH project,
assigned to me with the label 'tech-debt'.
```

```
Create a release branch called release/2.4.0 from main, then open a PR
back to main with the changelog for everything merged in the last two weeks.
```

```
Search all repos in our org for package.json files that depend on
lodash version 4.17.20 or earlier and list the affected repositories.
```

## Authentication

1. Go to **GitHub → Settings → Developer settings → Personal access tokens**
2. Choose **Fine-grained tokens** (recommended) or **Tokens (classic)**
3. For classic tokens, select these scopes: `repo`, `read:org`, `read:user`
4. For fine-grained tokens, grant **Contents**, **Issues**, **Pull requests**, and **Metadata** permissions on the repos you need
5. Copy the token and set it as `GITHUB_PERSONAL_ACCESS_TOKEN` in the config block above

## Tips

**Use fine-grained tokens:** Scope the token to specific repositories rather than your entire account. If the token leaks, the blast radius is contained.

**Rate limits:** The GitHub API allows 5,000 requests per hour for authenticated requests. Org-wide code searches count against a separate search rate limit (30 requests per minute) — cache results when running bulk operations.

**Combining with local git:** GitHub MCP handles the remote API surface; use your local `git` commands for staging, committing, and pushing. The two complement each other in the same session.

**Code search syntax:** `search_code` supports GitHub's full query syntax — `language:typescript repo:myorg/myrepo "TODO"` works exactly as it does in the GitHub UI. Use it for targeted queries rather than fetching whole files.

**PR body quality:** When using `create_pull_request`, give Claude the diff and the issue context and ask it to draft the PR body. The result will be more useful than a template-filled placeholder.

---
