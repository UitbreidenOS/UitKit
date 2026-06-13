---
name: ui-testing
description: Drive native or web UI to test user flows end-to-end via computer use — screenshot, click, assert, and report.
updated: 2026-06-13
---

# UI Testing via Computer Use

## When to activate

- User asks to test a user flow in a running app (web or native) without an existing test harness
- The app has no testable API surface and the UI is the only interface
- A Playwright or Cypress suite exists but the user wants a quick sanity check without running the full suite
- User says "test this flow manually", "click through and verify", or "make sure the UI works"
- You need to verify a newly deployed build behaves correctly for a specific journey
- The app uses a framework that is difficult to instrument (Electron, Tauri, Qt, native macOS/Windows apps)
- User explicitly asks to prefer computer use over Playwright for a specific reason (speed, no test infra, CI not available)

## When NOT to use

- A Playwright, Cypress, or Selenium suite already covers the flow — run the existing tests first
- The app requires login with real credentials stored in a password manager — do not click into credential screens
- The flow touches payment forms, health records, or any screen containing PII — stop and ask the user
- You are inside a production environment — computer use in prod is high-risk; confirm environment first
- The screen is not visible or the app is not running — do not attempt blind actions
- The user wants a persistent, reproducible test artifact — write a Playwright test instead

## Instructions

### Pre-flight checklist

1. Confirm the target app is running and visible on screen before any action.
2. Ask which environment (local dev, staging, prod). If prod, warn and require explicit confirmation.
3. Identify the user flow to test: start state, sequence of actions, success condition.
4. Take an initial screenshot to establish baseline state.

### Safety rules

- Never interact with screens that show: passwords, API keys, credit card fields, SSN fields, medical records, bank balances.
- Before each click, narrate what you are about to do and what you expect to happen.
- After each action, take a screenshot and verify the screen changed as expected before proceeding.
- If the screen shows an unexpected state (error, wrong page, modal), stop and report — do not continue clicking blindly.
- Limit each test session to one clearly scoped flow. Do not chain unrelated flows.

### Testing loop

For each step in the user flow:

1. **Describe** — State what action you are about to take and the expected outcome.
2. **Act** — Perform the single action (click, type, scroll, keypress).
3. **Screenshot** — Capture the screen immediately after the action.
4. **Assert** — Check the screenshot for the expected state:
   - Correct page/view loaded
   - Expected UI elements are visible (button label, heading text, form field)
   - No error banners, toast messages with failure copy, or broken layouts
5. **Record** — Note pass/fail for this step with the screenshot reference.

Repeat until the success condition is reached or a failure is detected.

### When to prefer computer use over Playwright

| Situation | Prefer |
|---|---|
| No test infra exists, quick one-off check | Computer use |
| App is Electron / native / no DOM access | Computer use |
| Reproducing a layout bug a user reported | Computer use |
| Need a shareable, runnable test file | Playwright |
| Flow will be tested on every deploy | Playwright |
| CI pipeline available | Playwright |

### Reporting results

After completing the flow, produce a concise report:

```
Flow: [name]
Environment: [local/staging/prod]
Steps tested: [n]
Pass: [n]
Fail: [n]

Step-by-step:
1. [action] → PASS — [what was observed]
2. [action] → FAIL — [what was observed vs expected]

Screenshots: [list of captured screenshots]
Recommendation: [fix X on step 2 / all clear]
```

### Common pitfalls

- Clicking coordinates that shift on scroll — scroll to element first, then click
- Animations delaying element appearance — wait for the element to settle before asserting
- Shadow DOM or canvas elements that look interactive but are not — treat as read-only visual checks
- Modals blocking underlying UI — always close or dismiss modals before asserting page state

## Example

**Scenario**: Test the signup flow for a local Next.js app at `http://localhost:3000`.

**Flow defined by user**: Navigate to /signup, enter email and password, click "Create account", verify redirect to /dashboard with welcome message.

**Execution**:

1. Take screenshot — confirm the browser is on `/signup`, form is visible.
2. Click the email input field. Type `testuser@example.com`. Screenshot — field contains email.
3. Click the password field. Type `TestPass123!`. Screenshot — field shows masked characters.
4. Click "Create account" button. Screenshot — check for loading state.
5. Wait for redirect. Screenshot — URL bar shows `/dashboard`.
6. Assert: heading "Welcome, testuser" is visible on screen. PASS.

**Report**:
```
Flow: Signup → Dashboard
Environment: local
Steps tested: 5
Pass: 5 / Fail: 0

All steps passed. User can complete signup and reach the dashboard.
```

If step 5 instead showed a "Something went wrong" toast, report would flag FAIL at step 5 with the screenshot and stop — no further clicks.
