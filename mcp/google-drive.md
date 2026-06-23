# Google Drive MCP Server

Connects Claude Code to Google Drive for file search, document reading, and content management.

---

## Installation

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-gdrive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your-client-id.apps.googleusercontent.com",
        "GOOGLE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

## Tools Provided

| Tool | Description |
|---|---|
| `search_files` | Search Google Drive files by name, type, or content |
| `read_file` | Read Google Docs, Sheets, or Slides content |
| `list_folder` | List files in a Drive folder |
| `create_doc` | Create new Google Docs with content |

## Usage

```
> "Find the Q4 roadmap document in Google Drive"
> "Read the meeting notes from last sprint"
> "Search for all spreadsheets with 'revenue' in the name"
> "Create a new design doc from this outline"
```

## Setup

1. Create OAuth 2.0 credentials at console.cloud.google.com
2. Enable Google Drive API and Google Docs API
3. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Claude Code](https://claude.com/claude-code)
