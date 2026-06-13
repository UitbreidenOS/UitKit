# MCP: Figma

Read Figma designs directly inside Claude Code. Extract component specs, color tokens, typography scales, layer structure, and export assets — then immediately generate code that matches the design, without switching between browser tabs and the terminal.

## Why you need this

The gap between design and implementation is where consistency breaks down. With Figma MCP:
- Claude reads the actual spec instead of relying on your description of it
- Color tokens, spacing values, and type scales come straight from the source of truth
- Components get generated with the correct dimensions, not approximations
- Design comments (open questions, redline notes) are accessible programmatically
- You can diff a live implementation against the Figma spec in a single prompt

## Installation

```bash
npm install -g figma-mcp
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["figma-mcp"],
      "env": {
        "FIGMA_API_TOKEN": "your-figma-personal-access-token"
      }
    }
  }
}
```

## Key tools

- `get_file` — fetch the full structure of a Figma file (all frames, components, and layers)
- `get_node` — get a specific frame, component, or layer by node ID
- `get_styles` — extract all color, typography, and effect styles defined in the file
- `get_components` — list every component in the file with its properties
- `get_comments` — read design comments, useful for flagging open questions or pending decisions
- `export_node` — export any node as PNG, SVG, or PDF at a specified scale
- `get_file_versions` — view the version history of a file

## Usage examples

```
Read the design for the checkout page (node ID: 123:456) and generate
the React component with Tailwind classes that match the spacing,
colors, and typography in the spec exactly.
```

```
Extract all color styles from our design system file
(file key: aBcDeFgHiJkL) and generate a Tailwind theme config
with the correct hex values and token names.
```

```
Get the typography scale from our Figma design file and create
a CSS custom properties sheet with --font-size-xs through --font-size-4xl.
```

```
List all open design comments in the file and create a GitHub issue
for each one, tagged with the label 'design-feedback'.
```

```
Compare the Button component in the Figma file to our current
implementation in src/components/Button.tsx and list any visual
discrepancies in spacing, color, or font weight.
```

## Authentication

1. Log in to Figma and open **Account settings** (click your avatar → Settings)
2. Navigate to **Security** → **Personal access tokens**
3. Click **Generate new token**, give it a name, and copy the value
4. A read-only token is sufficient for all read/export operations — no write scopes needed unless you want to create comments

Set the token as `FIGMA_API_TOKEN` in the config block above. Do not commit it to version control.

## Tips

**Finding file keys and node IDs:** The file key is the string between `/file/` and the next `/` in the Figma URL. The node ID is the value of the `node-id` query parameter (e.g., `node-id=123-456` → use `123:456` with a colon).

**Rate limits:** The Figma REST API allows 600 requests per minute. For large design systems with hundreds of components, batch your queries rather than looping over every node individually.

**Exporting assets:** `export_node` returns binary data. Tell Claude where to write the file: `"Export node 123:456 as SVG and save it to src/assets/icons/arrow.svg"`.

**Combining tools:** Use `get_styles` first to build your token map, then `get_node` for individual components. This avoids redundant API calls when generating a full design system.

**Visual diff workflow:** Take a screenshot of the implemented component with Playwright MCP, then fetch the Figma spec with this server. Ask Claude to compare the two side by side and list differences.

---
