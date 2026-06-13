# Computer Use in Claude Code

Computer use lets Claude control a desktop environment — it takes screenshots to see the screen, then sends mouse clicks, keyboard input, and scroll events to interact with any visible application. No browser driver or API required.

---

## How It Works

Claude operates a feedback loop:

1. Takes a screenshot of the current desktop state
2. Analyzes what it sees (application windows, buttons, text fields, dialogs)
3. Decides the next action (click at coordinates, type text, press a key)
4. Executes the action
5. Takes another screenshot to verify the result
6. Repeats until the task is done

Every screenshot is a full inference call. This makes computer use significantly slower and more expensive than CLI or API-based automation — plan accordingly.

---

## Enabling Computer Use

**CLI flag:**
```bash
claude --computer-use
```

**Settings file** (`settings.json`):
```json
{
  "computer_use": true
}
```

**Per-session toggle:** Type `/computer-use` to enable in the current session.

Computer use requires the model to support it. Claude Opus 4.7 is recommended for complex desktop tasks. Haiku does not support computer use.

---

## Available Actions

| Action | Description | Example |
|---|---|---|
| `screenshot` | Capture the current screen | Baseline observation |
| `click` | Left-click at pixel coordinates | `click(450, 320)` |
| `right_click` | Right-click at coordinates | Context menus |
| `double_click` | Double-click at coordinates | Open files, activate fields |
| `type` | Type a string of text | Fill form fields |
| `key` | Press a key or chord | `key("ctrl+s")`, `key("Return")` |
| `scroll` | Scroll at coordinates | `scroll(400, 300, direction="down", amount=3)` |
| `drag` | Click-hold-drag from point to point | Reorder items, resize windows |
| `move` | Move mouse without clicking | Trigger hover states |

---

## Coordinate System

- 1:1 pixel mapping at the current display resolution
- Origin `(0, 0)` is the top-left corner of the screen
- Maximum resolution: **2576px wide, 3.75MP total** for Claude Opus 4.7
- For high-DPI (Retina) displays, the logical resolution and physical resolution differ — Claude operates in logical pixels

If the screen is larger than the supported resolution, Claude will work on a scaled-down version. Target UI elements may shift slightly. Test with explicit coordinate logging when precision matters.

---

## Use Cases

**UI testing without a browser driver**
Screenshot before and after a CSS change, compare layouts, verify component rendering across viewports.

**Form automation for non-API tools**
Fill out web forms, internal tools, or desktop applications that expose no programmatic interface.

**Data extraction from desktop applications**
Read values displayed in GUI apps (Excel, database GUIs, dashboards) that have no export option.

**Automating non-CLI installers**
Step through wizard-style installers that require GUI interaction.

**Verifying deployed features**
Open a URL in a real browser (not headless), interact with the page as a user would, screenshot the result.

---

## Limitations

| Limitation | Detail |
|---|---|
| Speed | Each action requires a screenshot (one inference). Complex tasks can take 10–30+ minutes. |
| Cost | Opus 4.7 at screenshot frequency is expensive — budget carefully |
| Parallelism | One desktop at a time; actions are strictly sequential |
| Precision | Coordinate-based clicks can miss small targets at high DPI; use element descriptions when possible |
| State recovery | If a dialog appears unexpectedly, Claude must recognize and dismiss it — this adds turns |
| No undo | Mouse and keyboard events are real; computer use can trigger irreversible actions |

---

## Safety

**Always use `--dry-run` first on destructive workflows:**
```bash
claude --computer-use --dry-run "Delete all files in the Downloads folder that are older than 30 days"
```

Dry-run mode logs every planned action without executing it. Review the plan before allowing execution.

**Scope your prompt tightly.** Computer use can click anything visible — a broadly scoped prompt like "clean up my desktop" can trigger unintended actions. Name specific applications, windows, and operations.

**Set `maxTurns` for long tasks:**
```json
{
  "computer_use": true,
  "maxTurns": 50
}
```

Without a turn limit, a confused Claude can loop indefinitely on a stuck UI state.

---

## Computer Use vs Playwright

| | Computer Use | Playwright |
|---|---|---|
| **Works on** | Any visible UI (web, desktop, native apps) | Web only (Chromium, Firefox, WebKit) |
| **Speed** | Slow (screenshot per action) | Fast (direct DOM access) |
| **Reliability** | Moderate (coordinate-sensitive) | High (selector-based) |
| **Setup** | None | `npm install playwright` |
| **Use when** | No programmatic interface exists | Automating web UIs |

**Rule of thumb:** Use Playwright for web automation. Use computer use only when there is no browser automation path — native desktop apps, web apps that defeat headless detection, or tools that require a real authenticated GUI session.

---

## Example: Automated Screenshot Test

Compare UI before and after a CSS change:

```
You have computer use enabled.

1. Open http://localhost:3000/dashboard in Chrome
2. Take a screenshot and save it to /tmp/before.png
3. I'm going to make a CSS change — wait for me to say "done"
4. After I say done, take a second screenshot and save it to /tmp/after.png
5. Compare the two screenshots and describe any visual differences you see
```

For a non-interactive version (routine or CI step):

```
You have computer use enabled.

Open http://localhost:3000/dashboard in Chrome. 
Take a screenshot.
Compare it to the reference screenshot at /tmp/reference.png.
Report any layout differences, missing elements, or color changes.
Write your findings to /tmp/visual-diff-report.md.
```

---
