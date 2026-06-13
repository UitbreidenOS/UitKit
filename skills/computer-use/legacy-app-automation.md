---
name: legacy-app-automation
description: Automate desktop or legacy apps with no API via computer use — slow, verified, safe interaction with Win32, VB6, mainframe, and thick-client apps.
updated: 2026-06-13
---

# Legacy App Automation via Computer Use

## When to activate

- The target application has no API, no CLI, no scriptable interface, and no web frontend
- App is a native desktop app: Win32, MFC, VB6, Delphi, PowerBuilder, Java Swing, legacy Electron
- User needs to extract data from an app that only displays it on screen
- Automating repetitive form entry into a thick-client ERP, CRM, or line-of-business app
- User says "there's no other way to do this" or "the vendor doesn't have an API"
- Mainframe terminal (3270/5250) automation where no modern connector exists
- Migrating data out of a legacy system that can only export via UI-driven dialogs

## When NOT to use

- The app has an API, database connection, or export function — use those instead; computer use is the last resort
- The automation requires interacting with credential entry screens (login with password, MFA codes) — stop and ask the user to authenticate manually first
- The screen contains financial transaction confirmation dialogs (wire transfers, payment submissions) — require explicit per-action user confirmation
- The app is unstable or known to crash — do not automate unstable software; the risk of leaving data in a corrupt state is too high
- You cannot verify each action's outcome (the app gives no visual feedback) — blind clicking is not acceptable
- The task requires speed over safety — legacy app automation must be slow and verified; if speed is the priority, find a different approach

## Instructions

### Baseline assessment

Before touching anything:

1. Take a full screenshot of the app in its starting state.
2. Identify and document:
   - App name and version (visible in title bar or About dialog)
   - Current screen/view
   - What data or action is the target
   - Any warning dialogs or confirmation prompts that might appear
3. Ask the user: "Are you already logged in? Are there any confirmation prompts I should be aware of?"
4. Establish a recovery plan: what does the user do if the automation leaves the app in a bad state?

### The slow-and-verify principle

Legacy apps are fragile. A click on the wrong element, a keystroke arriving while a dialog is still loading, or a focus event on the wrong field can corrupt data or trigger irreversible actions.

Every action follows this sequence — no exceptions:

```
1. OBSERVE  — screenshot, confirm the app is in the expected state
2. LOCATE   — identify the exact target element (by label, position, tab order)
3. NARRATE  — state what you are about to do and what the result should be
4. ACT      — perform the single, minimal action
5. WAIT     — pause for the app to respond (legacy apps are often slow; wait for visual change)
6. VERIFY   — screenshot, confirm the outcome matched expectation
7. LOG      — record the step result before proceeding
```

Never chain two actions without completing the verify step for the first.

### Interaction patterns for legacy apps

**Keyboard-first approach**: Many legacy apps have unreliable mouse click targets. Prefer keyboard navigation:
- Tab to cycle through fields
- Enter to confirm
- Alt+[underlined letter] for menu accelerators
- F-keys for common actions (F3 search, F4 new, F8 submit — varies by app)

**Timing**: Insert deliberate pauses after:
- Opening a new screen (wait for the screen to fully render)
- Saving a record (wait for the confirmation indicator)
- Running a query or search (wait for results to load)
- Any network call (status bar often shows activity)

**Field entry discipline**:
1. Click or tab to the field.
2. Triple-click to select existing content (do not assume the field is empty).
3. Type the new value.
4. Screenshot to confirm the value was entered correctly before moving on.

**Confirmation dialogs**: When a confirmation dialog appears:
- Screenshot it immediately.
- Read the exact text of the dialog — do not assume.
- If the dialog is for a destructive or irreversible action, stop and ask the user to confirm before clicking OK.

### Safety rules — mandatory

- **Never automate financial transactions** (payments, wire transfers, journal entries, invoices) without the user explicitly confirming each transaction before you click OK/Submit.
- **Never enter or interact with credential fields** (passwords, tokens, PINs). Ask the user to log in manually before you start.
- **Never interact with screens containing health data** (patient records, lab results, prescriptions) without confirming the user has proper authorization and the environment is appropriate.
- **Stop on unexpected screens**: if a screen appears that was not part of the planned flow (error, unexpected dialog, wrong view), stop completely, screenshot, and report to the user before doing anything else.
- **No bulk irreversible actions**: do not automate mass deletions, bulk updates, or batch submissions without a human review checkpoint after a small pilot batch.

### Data extraction pattern

When the goal is to read/export data from a legacy app:

1. Navigate to the data view.
2. Screenshot each screen of data.
3. If the app has a print or export function (even to a printer dialog), use it — a PDF export is safer than manual transcription.
4. If transcription is unavoidable, transcribe visible fields one record at a time, screenshot each record as evidence.
5. After extraction, validate a sample of extracted values against the on-screen source.

### Form entry pattern

When the goal is to enter data into the legacy app:

1. User provides the data in a structured format (CSV, list, JSON) before automation starts.
2. Process one record at a time.
3. After each record is saved, screenshot the confirmation and log the record ID or confirmation message.
4. If any record fails, stop the batch, report the failure, and wait for user instruction before continuing.

### Recovery and error handling

If the app enters an unexpected state:

1. Do not click anything. Screenshot first.
2. Look for an Escape key or Cancel button to safely exit the current operation.
3. Check if the operation was already committed (look for a success/failure status message).
4. Report exact screen state to the user and ask for guidance.
5. Do not attempt to "fix" an unknown state by guessing — stop and report.

## Example

**Scenario**: Export 50 customer records from a legacy VB6 CRM that has no export function. Each record must be opened individually and key fields transcribed.

**App**: "CustomerBase 2.4" — VB6 app, list view shows customer IDs, double-click opens detail screen.

**Execution**:

1. Screenshot: Confirm app is open on the customer list view. 50 records visible.
2. Double-click first record (Customer ID: 10042). Wait for detail screen.
3. Screenshot: Detail screen loaded — Name, Phone, Email, Account Type visible.
4. Transcribe: `{"id": "10042", "name": "Acme Corp", "phone": "555-0192", "email": "billing@acme.com", "type": "Enterprise"}`.
5. Screenshot: Confirm transcribed values match on-screen values.
6. Press Escape to return to list. Screenshot: List view restored.
7. Repeat for record 10043.

After 5 records, validate the extracted data against screenshots — check for transcription errors before continuing the batch.

After all 50 records:
- Provide the structured data to the user.
- Attach a sample of screenshots as evidence of accuracy.
- Note any records where data was unclear or fields were empty.

**What would cause a stop**:
- Detail screen opens to a "Payment History" tab showing invoice amounts — stop, report, ask if this screen is in scope.
- A "Delete Record" confirmation dialog appears unexpectedly — stop immediately, do not click anything, screenshot and report.
- The app becomes unresponsive after opening record 23 — stop, report the state, do not retry without user confirmation.
