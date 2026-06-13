---
name: screenshot-verify
description: Capture and verify that a code change actually rendered correctly — the "see it work" loop after an edit.
updated: 2026-06-13
---

# Screenshot Verify

## When to activate

- User says "check if this looks right", "verify the change rendered", or "does it work visually"
- You just made a code edit and want to confirm the change is visible in the running app before reporting done
- A build was reloaded and the user wants confirmation the new version is live
- You need to close the loop after a CSS, layout, or component change — the edit alone is not proof
- The user asks "can you see it working" or "show me a screenshot after the fix"
- Debugging a change that "should have worked" — confirming whether the new code is actually running
- Verifying a feature flag, environment variable, or config change took effect visually

## When NOT to use

- The change is purely backend/API with no visual output — use test execution or logs instead
- The app is not running and cannot be started without user-provided credentials or environment setup
- The visual state cannot be reached without logging in through a sensitive credential screen
- The user explicitly says "just run the tests, don't check visually"
- The change is in a component with no rendered output (utility function, type definition, server-side only logic)

## Instructions

### The verify loop

The verify loop is the minimal cycle to close the gap between "I made a change" and "I can see the change working":

```
EDIT → RELOAD → NAVIGATE → SCREENSHOT → ASSERT → REPORT
```

Each phase is described below.

### Phase 1: EDIT

Confirm the change has been saved to disk. If you made the edit, it is saved. If the user made the edit, ask: "Is the file saved?" before proceeding.

Note the exact file and line changed so you know what visual output to expect.

### Phase 2: RELOAD

Trigger a reload of the running application:

**Web app (browser)**:
- If hot module replacement (HMR) is active, the change may have already reloaded. Check the browser console for HMR activity.
- If not, trigger a hard reload: Cmd+Shift+R (macOS) or Ctrl+Shift+F5 (Windows).
- Wait for the network activity indicator to stop before taking a screenshot.

**Native / Electron app**:
- Check if live reload is configured. If yes, wait for the reload indicator.
- If no live reload, ask the user to restart the app or use the app's own reload shortcut.

**Server-side rendered app**:
- Confirm the dev server picked up the change (watch for file change log in terminal).
- Hard reload the browser.

**Static file served locally**:
- Confirm the file is being served from disk (not a cached version). Hard reload with cache bypass.

### Phase 3: NAVIGATE

Navigate to the exact view where the change should be visible:

1. Note the URL or screen path before navigating.
2. Take a screenshot at the target view before asserting — this is your evidence the correct screen is loaded.
3. If the change only appears after a user interaction (click, hover, input), perform the minimum interaction needed to surface it.

Do not screenshot a page that is still loading — wait for the loading indicator to clear.

### Phase 4: SCREENSHOT

Capture the screen with precision:

- Scroll to the area where the changed element is visible if needed.
- If the change is in a specific component, zoom in on that component after the full-page screenshot.
- If comparing to a before state, capture at the same scroll position and viewport width as the before screenshot.
- Name the screenshot with the context: `[component]-[state]-after.png` — do not use generic names like `screenshot1.png`.

### Phase 5: ASSERT

Examine the screenshot and check the specific change:

For a **CSS change** (color, font, spacing, layout):
- Is the new value visibly applied? Describe what you see.
- Is it consistent across all instances of the component on this screen?
- Are there any adjacent elements that look broken as a side effect?

For a **text/content change**:
- Does the new text appear exactly as written in the edit?
- Is it in the correct location (not displaced to a different element)?
- Is the old text gone?

For a **new component or feature**:
- Is the component rendered and visible?
- Is it in the correct position in the layout?
- Does it respond to the expected interaction (visible active state, label, icon)?

For a **bug fix**:
- Is the previously broken state gone?
- Is the corrected state present?
- Describe both the old problem and the new state in the assertion.

For a **config or feature flag change**:
- Is the conditional content shown/hidden as expected?
- Check the opposite condition too if possible — confirm it is not showing when it should not.

### Phase 6: REPORT

Produce a concise verification statement after the screenshot check:

**Pass format**:
```
Verified: [what was changed]
Screenshot shows: [specific observation confirming the change]
No regressions observed in adjacent elements.
Status: CONFIRMED
```

**Fail format**:
```
Verification failed: [what was changed]
Expected: [what the screenshot should show]
Observed: [what the screenshot actually shows]
Possible cause: [most likely reason — wrong file saved, wrong selector, HMR not active, cached build]
Next step: [specific action to investigate]
Status: NOT CONFIRMED
```

### Common failure modes and how to diagnose

| Symptom | Likely cause | Check |
|---|---|---|
| Change not visible after reload | File not saved, or wrong file edited | Confirm file path and content |
| Old version still showing | Browser cache | Hard reload with Cmd+Shift+R |
| Change visible in wrong place | CSS selector too broad | Inspect selector scope |
| Component not rendering at all | Import error, conditional rendering, feature flag off | Check browser console for errors |
| Change visible in dev but not after build | Build step needed, not just dev server | Run the build step |
| App shows blank screen after edit | Syntax error in edited file | Check terminal/console for compile error |

### Verifying in multiple states

Some changes only appear in specific states. For each relevant state, run the verify loop independently:

- **Default state** — initial render without user interaction
- **Active/hover state** — after mouse interaction (take screenshot while hovered if possible)
- **Error state** — with invalid input or a failed fetch
- **Empty state** — with no data loaded
- **Loading state** — immediately after triggering a data fetch

### Safety rules

- Do not interact with any form that could submit data as a side effect of navigating to verify a visual change.
- If the navigation path to reach the changed view passes through a sensitive screen (payment, auth, health), stop and ask the user to navigate there manually, then screenshot from that point.
- Verification is read-only observation — do not make additional edits during a verify loop. If a regression is spotted, report it and wait for instruction.

## Example

**Scenario**: Developer changed the primary button color from blue to indigo in a Tailwind config. Wants confirmation the change is live across the app.

**Edit made**: `tailwind.config.js` — `primary` color updated from `#3B82F6` to `#6366F1`.

**Verify loop**:

1. **RELOAD**: Browser HMR is active. Check terminal — "Tailwind config changed, rebuilding..." message visible. Wait for rebuild complete message.

2. **NAVIGATE**: Go to `http://localhost:3000` — homepage with a "Get Started" primary button visible.

3. **SCREENSHOT**: Capture full page. Note the primary button.

4. **ASSERT**: Button background color is visually indigo (purple-leaning) not blue. Matches the expected `#6366F1` tone. No other elements appear broken. Adjacent secondary buttons still grey.

5. Navigate to `/pricing` — another primary CTA button present. Screenshot. Same indigo color applied. Consistent.

**Report**:
```
Verified: Primary button color change from blue (#3B82F6) to indigo (#6366F1)
Screenshot shows: Both homepage CTA and pricing page CTA display the new indigo color
No regressions observed — secondary and tertiary buttons unchanged
Status: CONFIRMED
```

**If the button was still blue**:
```
Verification failed: Primary button color change
Expected: Indigo (#6366F1) button background
Observed: Button still showing blue (#3B82F6)
Possible cause: Tailwind JIT did not pick up config change, or browser cached old CSS
Next step: Check terminal for rebuild errors; try hard reload with Cmd+Shift+R; confirm tailwind.config.js is in the content paths
Status: NOT CONFIRMED
```
