# Claude Code Computer Use — Comprehensive Guide

Computer use turns Claude Code into a desktop automation agent. Instead of calling APIs or running shell commands, Claude takes screenshots, analyzes the screen, then sends real mouse and keyboard events to any visible application. No browser driver, no accessibility tree, no DOM — just pixels and input events.

This guide covers everything a senior developer needs to deploy computer use reliably: how it works under the hood, how to enable it, what to avoid, prompt patterns that hold up in production, and failure modes to anticipate.

---

## How the Loop Works

Every computer use session runs the same core cycle:

1. Claude requests a `screenshot` tool call
2. The harness captures the screen and returns the image as a base64 payload
3. Claude analyzes the image — reading text, identifying UI elements, inferring application state
4. Claude issues an action: `click(x, y)`, `type("text")`, `key("ctrl+s")`, etc.
5. The harness executes the action on the live desktop
6. Return to step 1

Each screenshot is a full inference call against Opus 4.8. A task that requires 30 interactions to complete will make 30 screenshot inferences plus 30 action inferences. That's 60 model calls. Plan costs accordingly.

The feedback loop is the key design constraint: Claude cannot queue multiple actions based on a single screenshot. It sees the result of each action before deciding the next one. This makes computer use correct but slow.

---

## Capabilities

### Mouse and Keyboard Actions

| Action | Description | Notes |
|---|---|---|
| `screenshot` | Capture current screen state | Triggers an inference call |
| `click(x, y)` | Left-click at pixel coordinates | Most common action |
| `right_click(x, y)` | Right-click for context menus | |
| `double_click(x, y)` | Double-click to open/activate | |
| `middle_click(x, y)` | Middle-click (scroll-wheel click) | |
| `type("text")` | Type a string character-by-character | Respects active focus |
| `key("chord")` | Press a key or keyboard shortcut | `"ctrl+s"`, `"cmd+shift+z"`, `"Return"`, `"Escape"` |
| `scroll(x, y, direction, amount)` | Scroll at a point | `direction`: `"up"` \| `"down"` \| `"left"` \| `"right"` |
| `drag(x1, y1, x2, y2)` | Click-hold-drag from point to point | File reordering, window resizing |
| `move(x, y)` | Move mouse without clicking | Trigger tooltips, hover states |

### Application-Level Tasks Claude Can Handle

- **Open applications**: via `key("super")` + type app name, via Spotlight/Alfred, or via shell command through the integrated terminal
- **Click buttons, checkboxes, dropdowns, tabs**: any element visible in the screenshot
- **Fill forms**: click into field, clear existing text, type new content
- **Navigate file dialogs**: open a save/open dialog, type a path into the filename field, press Return
- **Read displayed data**: extract values from GUI-only applications with no CLI or export
- **Drag-and-drop**: reorder items in lists, move files between folders in Finder/Explorer
- **Scroll and paginate**: scroll tables, PDFs, web pages
- **Multi-window workflows**: alt-tab between applications, arrange windows, work across multiple contexts
- **Browser interaction**: open URLs, fill web forms, click links, handle login flows in real browser sessions
- **Screenshot capture and comparison**: take, save, and diff screenshots programmatically

### Resolution and Display Limits

- Opus 4.8 supports up to **2576px wide** and approximately **3.75 megapixels** total
- On Retina/HiDPI displays, Claude works in **logical pixels** — not physical pixels
- If your display exceeds the supported resolution, the harness scales it down before sending to the model; coordinates are mapped back automatically
- On macOS with a 2x display at 2560×1600 logical resolution: Claude sees a 1280×800 logical canvas
- External monitors at 4K+ may cause coordinate drift — verify by logging a test click and checking where it lands

---

## Enabling Computer Use

### CLI Flag (Per-Session)

```bash
claude --computer-use
```

Enables computer use for the session. Combine with other flags:

```bash
claude --computer-use --model claude-opus-4-8 --max-turns 100
```

### Settings File (Persistent)

`~/.claude/settings.json` or `.claude/settings.json` in your project:

```json
{
  "computer_use": true,
  "model": "claude-opus-4-8",
  "maxTurns": 75
}
```

Project-level settings override user-level settings. Use project settings to scope computer use to specific workflows.

### Per-Session Toggle

Inside a running Claude Code session:

```
/computer-use
```

Toggles computer use on or off without restarting the session. Useful when a session starts as a coding task but needs GUI interaction partway through.

### Model Requirements

Computer use requires Opus. As of March 2026:

| Model | Computer Use | Notes |
|---|---|---|
| `claude-opus-4-8` | Full support | Best accuracy; recommended for all computer use tasks |
| `claude-opus-4-7` | Full support | Functional but slower on visual disambiguation |
| `claude-sonnet-4-6` | Partial | Experimental; accuracy drops significantly on complex layouts |
| `claude-haiku-4-5` | Not supported | — |

Always specify the model explicitly when enabling computer use:

```bash
claude --computer-use --model claude-opus-4-8
```

Without specifying, Claude Code may default to a model that degrades accuracy on dense UIs.

### Desktop App vs CLI

The desktop app and CLI both support computer use, but differ in significant ways:

| | CLI | Desktop App |
|---|---|---|
| **Session startup** | `claude --computer-use` | Toggle in session settings |
| **Screen capture** | Full display or specified display | Full display |
| **Multi-monitor** | `DISPLAY_INDEX` env var controls which monitor | Captures primary display |
| **Window focus** | Must be managed explicitly in prompts | Can leverage macOS/Windows focus APIs |
| **Background execution** | Runs fine; screen must be unlocked | Requires active desktop session |
| **Headless use** | Not supported (requires visible screen) | Not supported |
| **Recommended for** | CI-adjacent tasks, scripted workflows | Ad-hoc tasks, interactive supervision |

For multi-monitor setups in CLI:

```bash
DISPLAY_INDEX=1 claude --computer-use
```

`DISPLAY_INDEX` is 0-based. `0` is the primary display.

---

## Safety Rules and Hard Limits

### What Claude Will Refuse to Interact With

Computer use has built-in visual heuristics that block interaction with sensitive screen content. As of Opus 4.8, Claude will refuse or warn before acting on screens containing:

- **Financial account data**: online banking, brokerage platforms, wire transfer forms, payment terminal screens
- **Health and medical records**: EHR systems, patient portals, prescription management tools
- **Credential and authentication screens**: password manager GUIs, SSH key management, MFA seed displays
- **Plaintext secrets**: screens where API keys, private keys, or tokens are fully visible in the UI

These refusals are model-level — they cannot be overridden with prompt instructions. If your workflow legitimately needs to interact with these surfaces, use purpose-built automation tools (Playwright with stored credentials, Ansible Vault, etc.) rather than computer use.

### Practical Safety Rules for Production Use

**Use `--dry-run` before any destructive workflow:**

```bash
claude --computer-use --dry-run "Delete all projects marked as archived in the project list"
```

Dry-run mode prints every planned action (with coordinates and content) without executing. Review the plan. If it touches something unexpected, tighten the prompt before running live.

**Set `maxTurns` on every computer use session:**

```json
{
  "computer_use": true,
  "maxTurns": 50
}
```

Without a turn cap, a stuck UI state (dialog that won't dismiss, loading spinner that never resolves) can spin indefinitely. A 50-turn cap on a task that should take 15 turns gives enough headroom without risking runaway sessions.

**Scope prompts tightly to a single application and task:**

```
# Too broad — risk of accidental navigation
"Clean up my workspace"

# Correct — application + task + explicit bounds
"In the Figma desktop app, select all frames in the 'Archive Q1' page and move them to the 'Trash' section at the bottom of the layers panel. Do not interact with any other page."
```

**Never run computer use on a screen that shares space with sensitive open tabs or applications.** Claude sees the entire screenshot. Even if you instruct it to ignore a terminal window showing an API key, that content is in the inference.

**For unattended runs, lock down the desktop to a known state first:**

```bash
# Close everything except the target app
# Set the browser to a specific URL
# Then launch the computer use session
claude --computer-use "Starting from the current state of Chrome on http://localhost:3000 ..."
```

---

## Practical Use Cases

### 1. UI Testing Without a Browser Driver

Test rendered output in a real browser without configuring Playwright or Selenium:

```
You have computer use enabled. Model: claude-opus-4-8.

1. Open http://localhost:3000/checkout in Chrome
2. Take a screenshot and save it as /tmp/checkout-initial.png
3. Click "Add to Cart" on the first product
4. Take a screenshot and save it as /tmp/checkout-after-add.png
5. Compare the two screenshots. Report:
   - Did the cart icon count change?
   - Is there a toast notification visible?
   - Did any layout shift occur?
   Write findings to /tmp/ui-test-report.md
```

This handles cases that headless browsers struggle with: specific font rendering, CSS animations at frame N, lazy-loaded images, browser-specific quirks.

### 2. Automating Non-API Internal Tools

Many internal tools — JIRA-adjacent dashboards, legacy admin panels, data ops tools — expose no API. Computer use is the only automation path:

```
You have computer use enabled.

Open the Retool dashboard at http://internal-ops/deployments
For each deployment with status "Pending Review":
  1. Click on the deployment name
  2. In the details panel, read the "Last Updated" timestamp
  3. If Last Updated is more than 48 hours ago, click "Escalate"
  4. Confirm the escalation dialog
Log each escalated deployment to /tmp/escalations.log with timestamp.
```

### 3. Installer and Setup Wizard Automation

GUI-only installers with click-through steps:

```
You have computer use enabled.

An installer dialog is open. Complete the installation with these settings:
- Installation path: /opt/vendor-tool
- License key: [provided in environment variable VENDOR_LICENSE]
- Components: select "Core" and "CLI Tools" only — deselect "Telemetry"
- When asked for a restart, click "Restart Later"

If any step shows an unexpected dialog, take a screenshot and stop. Do not click through error dialogs.
```

The "stop on unexpected dialog" instruction is critical. Without it, Claude may dismiss error dialogs that represent real problems.

### 4. Cross-Application Data Entry

When data must move between applications with no export/import path:

```
You have computer use enabled.

I have a CSV file at /tmp/new-vendors.csv with columns: name, contact_email, country_code, tier.
The vendor management app is open at http://internal-crm/vendors.

For each row in the CSV:
1. Click "Add Vendor"
2. Fill in the form fields from the CSV row
3. Click "Save"
4. Confirm the vendor appears in the list before proceeding to the next row
5. If a save fails (error message visible), log the row to /tmp/failed-entries.csv and continue

Do not process more than 20 rows without pausing and reporting progress.
```

The "confirm before proceeding" pattern catches silent failures. The "pause and report" pattern prevents runaway behavior on large datasets.

### 5. Visual Regression Monitoring

Run as a scheduled task or pre-deploy check:

```
You have computer use enabled.

Reference screenshots are in /tmp/reference/.

For each file in /tmp/reference/:
1. Derive the URL from the filename (e.g., dashboard.png → http://localhost:3000/dashboard)
2. Open the URL in Chrome
3. Take a screenshot
4. Compare visually to the reference
5. Report differences: missing elements, layout shifts, color changes, text truncation

Write a summary to /tmp/visual-regression-report.md.
Exit code 1 if any differences found.
```

### 6. Desktop Application QA

Testing native apps that have no web interface:

```
You have computer use enabled.

Open Xcode. Create a new project:
- Template: iOS App
- Product name: TestProject
- Organization: com.example
- Interface: SwiftUI
- Language: Swift
- Save to ~/Desktop/TestProject

Once the project opens, verify:
- The project navigator is visible on the left
- ContentView.swift is listed under Sources
- The canvas preview renders without error

Report pass/fail and take a final screenshot.
```

---

## Prompt Patterns That Work

### Pattern 1: State Before Action

Always describe the expected current state before issuing instructions. Claude's first screenshot may not match your assumption:

```
# Fragile — assumes state
"Click the Settings button"

# Robust — describes expected state, handles mismatch
"The Chrome browser should be open with http://app.example.com/dashboard loaded. 
If the page is not loaded, navigate there first.
Once on the dashboard, click the gear icon (Settings) in the top-right corner."
```

### Pattern 2: Verification Steps

After every significant action, verify the result before continuing:

```
"Click the Delete button.
Wait for a confirmation dialog to appear.
Verify the dialog text contains the word 'permanently' before clicking Confirm.
If the dialog text does not contain 'permanently', take a screenshot and stop."
```

### Pattern 3: Explicit Failure Conditions

Define what Claude should do when things go wrong rather than letting it improvise:

```
"If at any step you see:
- An error dialog: take a screenshot, write the error text to /tmp/error.txt, and stop.
- A loading spinner that persists for more than 30 seconds: take a screenshot and stop.
- A login screen: stop and report that authentication is required.
Do not attempt to dismiss error dialogs or retry failed operations."
```

### Pattern 4: Chunked Tasks with Checkpoints

For workflows with many steps, break into chunks with explicit reporting:

```
"Process the first 5 rows of /tmp/data.csv through the form at http://internal/import.
After each row, confirm the success message appears.
After all 5 rows, report: rows processed, rows that showed errors, current state of the form.
Stop after 5 rows — I will review before continuing."
```

### Pattern 5: Bounding Box Hints for Dense UIs

On UIs with many small elements, hint at the target location:

```
# Coordinate-fragile
"Click the Export button"

# Resilient — provides region context
"Find the Export button. It should be in the top toolbar area, to the right of the Save button. 
The toolbar runs horizontally across the top of the main content area, below the menu bar."
```

### Pattern 6: Clipboard as a Reliability Bridge

For text extraction from dense or styled UIs, use clipboard copy instead of screenshot OCR:

```
"Click on the value in the 'Total Revenue' cell in the first row of the table.
Use Ctrl+A to select all text in the cell, then Ctrl+C to copy it.
Report the copied value.
Do not attempt to read the value from the screenshot — copy it explicitly."
```

This is significantly more reliable than OCR on small-font numerical data in tables.

---

## Failure Modes

### 1. Coordinate Drift on High-DPI Displays

**Symptom:** Claude clicks confidently but the click lands 20–40px from the target. Buttons get partially missed, dropdowns open in wrong positions.

**Cause:** Logical-to-physical pixel mapping inconsistency. Common on macOS Retina displays with non-standard scaling (125%, 150%).

**Fix:**
```bash
# Force a standard scaling before the session
# macOS: System Settings → Displays → Resolution → set to exact (not "More Space")
# Then verify with a test click
claude --computer-use "Click the center of the screen and report what you clicked"
```

### 2. Dynamic UI Elements Missed

**Symptom:** Claude reports it clicked a button, but the UI didn't respond. Re-screenshots show the button still in its pre-click state.

**Cause:** Element appeared during screenshot delay, rendered after the screenshot was taken, or rendered at a different position than where Claude clicked.

**Fix:** Add explicit wait patterns:
```
"After clicking the 'Load Data' button, take a screenshot 2 seconds later to verify the data loaded.
If the loading indicator is still visible, wait and screenshot again before proceeding."
```

### 3. OCR Misreads on Small or Stylized Text

**Symptom:** Claude reads values incorrectly from tables, dashboards, or non-standard fonts. Numeric data is especially affected (1 vs l, 0 vs O, 6 vs b at small sizes).

**Cause:** Screenshot compression and small font sizes reduce OCR reliability.

**Fix:** Use clipboard copy (Pattern 6 above) for any data you need to read precisely. For table data specifically:
```
"Select the row by clicking its checkbox, then right-click and choose 'Copy Row Data' if available.
If no copy option exists, click the value cell and use Ctrl+A, Ctrl+C."
```

### 4. Stuck in a Dialog Loop

**Symptom:** Claude encounters an unexpected dialog (update prompt, OS permission request, error message), dismisses it, and a new dialog appears. Session loops until `maxTurns` is hit.

**Cause:** The application is in a state that continuously generates dialogs. Claude tries to be helpful and keeps dismissing them.

**Fix:** Explicit stop conditions (Pattern 3 above), plus:
```json
{
  "computer_use": true,
  "maxTurns": 30,
  "onMaxTurns": "stop"
}
```

And in the prompt: `"If you encounter any system dialog that is not part of the target application's UI, take a screenshot and stop immediately."`)

### 5. Application Focus Loss

**Symptom:** Claude types text but it appears in the wrong application. A background app stole focus.

**Cause:** OS notifications, system dialogs, or other apps taking focus between Claude's screenshot and type action.

**Fix:** Include explicit focus commands before critical type actions:
```
"Before typing the API key, click once on the text field to ensure it has focus.
Verify the cursor is visible in the field (the field border should be highlighted).
Then type the value."
```

### 6. Scroll Position Assumptions

**Symptom:** Claude says "I can see the Save button" and clicks where it expects it, but the page has scrolled and the Save button is now off-screen or at a different coordinate.

**Cause:** Claude's coordinate model from the previous screenshot is stale after a scroll.

**Fix:** After every scroll action, take a fresh screenshot before clicking:
```
"Scroll down to find the Save button. After scrolling, take a screenshot to confirm the current position. 
Then click the Save button based on its position in the new screenshot."
```

### 7. Window Obscuring

**Symptom:** Claude tries to click an element but an overlapping window or tooltip covers it.

**Cause:** Tooltip, dropdown, or background window in the way.

**Fix:** Add window management to the setup preamble:
```
"Before starting, take a screenshot. If any window other than [target app] is visible, 
press Cmd+H to hide other applications. Take another screenshot to confirm."
```

### 8. Clipboard Interference

**Symptom:** When using clipboard-copy patterns, the pasted value is wrong — it contains content from a prior clipboard operation.

**Cause:** Another application modified the clipboard between copy and paste.

**Fix:** Clear the clipboard before the task and verify immediately after copying:
```
"Clear the clipboard by typing a space into a text field and copying it (Ctrl+A Ctrl+C) in a scratch area.
Then perform the target copy operation and read the result."
```

---

## CLI vs Desktop App: Decision Guide

### When to Use the CLI

- **Scripted or scheduled workflows**: computer use tasks triggered by cron, CI pipelines, or shell scripts
- **Multi-monitor targeting**: `DISPLAY_INDEX` gives precise control over which display is captured
- **Non-interactive execution**: tasks that run to completion without human intervention
- **Logging and audit trails**: CLI output is easier to pipe, capture, and parse
- **Session reproducibility**: CLI flags and environment variables make sessions deterministic

```bash
# Scheduled nightly UI test run
DISPLAY_INDEX=0 claude \
  --computer-use \
  --model claude-opus-4-8 \
  --max-turns 60 \
  --print \
  "Run the UI regression check per /tmp/ui-test-instructions.md. Output results to /tmp/nightly-report.md"
```

### When to Use the Desktop App

- **Interactive supervision**: you want to watch Claude work and intervene if needed
- **Ad-hoc tasks**: one-off workflows where scripting isn't worth it
- **Debugging a computer use session**: easier to inspect screenshots in the UI as they happen
- **Mixed workflows**: sessions that start with code editing and shift to GUI interaction mid-task

### Key Behavioral Differences

The desktop app renders each screenshot inside the Claude Code UI as the task progresses. This makes it easy to catch errors early. The CLI streams action descriptions as text — you don't see the screenshots unless you add explicit save-screenshot steps to your prompt.

For production use, always write task instructions to a markdown file and reference the file:

```bash
claude --computer-use "Follow the instructions in /tmp/task.md exactly."
```

This separates task definition from invocation, makes tasks version-controllable, and avoids shell escaping issues in complex prompts.

---

## Cost Estimation

Computer use is the most expensive Claude Code mode. Rough estimates for Opus 4.8 (adjust as pricing changes):

| Task Complexity | Estimated Turns | Approx. Cost |
|---|---|---|
| Simple form fill (5 fields) | 15–20 | $0.10–0.20 |
| Multi-step wizard (10 screens) | 35–55 | $0.30–0.60 |
| Data entry loop (20 rows) | 80–120 | $0.70–1.20 |
| Full UI regression (10 pages) | 60–100 | $0.50–1.00 |

The dominant cost is screenshot inference. Each screenshot is a large image token payload. Reduce costs by:

1. **Narrowing the task scope** — fewer steps, fewer screenshots
2. **Combining verification steps** — don't screenshot after every micro-action; screenshot after logical sub-task completion
3. **Using explicit coordinates when you know them** — if you've logged that the Save button is always at (1140, 680) in your app, provide the coordinate and skip the "find and click" reasoning overhead
4. **Switching to Playwright for web tasks** — computer use for web UIs is 10–50x more expensive than equivalent Playwright automation

---

## Integration Pattern: Computer Use + Shell

Computer use pairs well with shell commands in a single session. Claude can drop into terminal operations between GUI steps:

```
You have computer use enabled.

1. In Terminal, run: psql -c "SELECT id, name FROM pending_approvals LIMIT 10" > /tmp/pending.txt
2. Open the internal approval dashboard at http://ops/approvals in Chrome
3. For each ID in /tmp/pending.txt, find the matching entry in the dashboard and click "Approve"
4. After all approvals, run in Terminal: psql -c "SELECT COUNT(*) FROM approvals WHERE approved_at > NOW() - INTERVAL '1 hour'"
5. Verify the count matches the number of rows you approved. Report the result.
```

This pattern is more reliable than pure computer use for data-driven tasks: use SQL/shell for data retrieval (fast, exact), computer use only for the GUI operations that have no programmatic alternative.

---

## Gotchas Specific to Opus 4.8

- **Longer deliberation on ambiguous UIs**: Opus 4.8 takes more turns on complex layouts but makes fewer wrong clicks than 4.7. Net cost is similar; reliability is higher.
- **Refusal expansion**: Opus 4.8 refuses a broader set of credential-adjacent screens than 4.7. If you see a refusal on a screen that doesn't contain actual credentials, it may be refusing based on visual similarity (e.g., an API key configuration page that *looks* like a credential manager). Reframe the task to avoid the sensitive-looking elements.
- **Scroll confidence**: Opus 4.8 is more conservative about scrolling — it will take more screenshots to confirm it's reached the right position before acting. This is correct behavior but adds turns. Account for it in `maxTurns`.
- **Multi-tab awareness**: Opus 4.8 understands browser tab bars and will navigate between tabs if instructed. Explicitly state "Do not open new tabs" or "Only interact with the currently active tab" to prevent tab pollution.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
