# MCP: Puppeteer Browser Automation

Control a real browser from Claude Code. Navigate, click, fill forms, take screenshots, and scrape pages — all from within your session.

## Why you need this

Some tasks require a real browser: scraping JavaScript-rendered content, automating workflows on web apps, testing UI flows, or capturing screenshots. The Puppeteer MCP server gives Claude full browser control.

## Configuration

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {
        "PUPPETEER_HEADLESS": "true"
      }
    }
  }
}
```

Set `PUPPETEER_HEADLESS` to `false` to watch the browser as it runs.

## What Claude can do

```
# Screenshot any page


# Scrape structured data
"Go to [URL] and extract all product names and prices into a JSON list"

# Fill and submit forms
"Navigate to our staging site, log in with test@example.com, and confirm the checkout flow works"

# Generate PDFs
"Convert https://docs.example.com/guide to a PDF"

# Test UI interactions
"Click the 'Get started' button and tell me what happens next"
```

## Available tools

| Tool | What it does |
|---|---|
| `puppeteer_navigate` | Go to a URL |
| `puppeteer_screenshot` | Capture a screenshot |
| `puppeteer_click` | Click an element |
| `puppeteer_fill` | Fill a form field |
| `puppeteer_evaluate` | Run JavaScript on the page |
| `puppeteer_pdf` | Generate a PDF |
| `puppeteer_select` | Select a dropdown option |

## Use cases

**Content scraping:**
"Scrape the top 20 posts from this news site and summarise each one"

**Competitive research:**
"Go to competitor's pricing page and extract their tier names, prices, and features"

**Automated testing:**
"Run through our complete sign-up flow and report any errors you encounter"

**Documentation:**
"Take screenshots of each page of our onboarding flow for the user guide"

## vs. Playwright skill

The `/playwright-pro` skill generates Playwright test code. This MCP server gives Claude direct browser control for on-demand automation — complementary, not competing.

## Prerequisites

```bash
# Puppeteer installs Chromium automatically on first run
# Ensure Node.js 18+ is installed
node --version
```
