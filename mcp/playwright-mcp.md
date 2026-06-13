# MCP: Playwright

Control a real browser directly from Claude Code. Playwright MCP lets Claude navigate pages, click elements, fill forms, take screenshots, and extract content — turning browser automation into a natural conversation instead of a scripting exercise.

## Why you need this

Browser-based tasks normally force you out of the terminal: open a browser, click around manually, copy-paste results back. With Playwright MCP:
- Claude can test UI flows end-to-end without you touching the mouse
- Screenshots give Claude visual confirmation of what the page actually looks like
- Form filling, login flows, and multi-step interactions run in a single prompt
- Scraping and content extraction become one-liners instead of scripts
- Works headless in CI or headed locally for debugging

## Installation

```bash
# Install the MCP server
npm install -g @playwright/mcp

# Install the Chromium browser binary (required)
npx playwright install chromium
```

## Configuration

Add to `~/.claude.json` or project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

For headed mode (visible browser window, useful for debugging):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false"
      }
    }
  }
}
```

## Key tools

- `browser_navigate` — go to a URL
- `browser_screenshot` — capture the current page as an image
- `browser_click` — click an element by CSS selector or coordinates
- `browser_type` — type text into an input field
- `browser_select_option` — choose a value from a dropdown
- `browser_scroll` — scroll the page by a pixel amount or to an element
- `browser_evaluate` — execute JavaScript in the page context and return the result
- `browser_get_text` — extract visible text from the page or a specific element
- `browser_wait_for` — wait for an element to appear, network to go idle, or a timeout

## Usage examples

```
Navigate to the login page, fill in the test credentials, submit the form,
and take a screenshot so I can verify the dashboard loads correctly.
```

```
Go to our staging environment at https://staging.myapp.com/dashboard,
extract all the text from error message elements, and return them as a list.
```

```
Test the checkout flow: navigate to the product page, add the first item
to the cart, proceed to checkout, and verify the order summary shows
the correct item and price.
```

```
Scrape the pricing page at https://myapp.com/pricing — extract the plan names,
prices, and feature lists, then return everything as structured JSON.
```

```
Take a screenshot of each page in the main navigation and save them
to /screenshots with filenames matching the nav labels.
```

## Authentication

No API key required. The browser runs locally on your machine. For sites that require login:
- Use `browser_navigate` + `browser_type` + `browser_click` to authenticate as part of the prompt
- For persistent sessions, use `browser_evaluate` to inject auth cookies directly:
  ```
  Set the auth cookie: document.cookie = "session=abc123; path=/"
  ```

## Tips

**Headless vs headed:** Default is headless — faster and CI-safe. Switch to `PLAYWRIGHT_HEADLESS=false` when a flow is failing and you want to watch what Claude is clicking.

**Viewport size:** If a page behaves differently at mobile vs desktop widths, specify it in the prompt: `"Set the viewport to 375x812 before taking the screenshot"`.

**Waiting for content:** Dynamic pages that load data asynchronously can fool `browser_get_text`. Ask Claude to use `browser_wait_for` with a network idle condition before extracting content.

**Playwright MCP vs Playwright test scripts:** Use this MCP for exploratory, one-off, or conversational automation. Write a proper Playwright test script when you need repeatable, version-controlled tests that run in CI on every push.

**Multi-step flows:** Chain tools naturally in a single prompt. Claude will sequence `navigate → wait → type → click → screenshot` in the right order without you specifying each step separately.

---
