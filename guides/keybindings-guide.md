# Claude Code Keybindings — Comprehensive Customization Guide

**Last updated: mid-2026 | Audience: senior developers**

---

## What This Guide Covers

Claude Code ships with sensible defaults but lets you remap nearly every interactive action through a single JSON file at `~/.claude/keybindings.json`. This guide covers the full schema, every available context and action, keystroke syntax edge cases, reserved keys you cannot touch, the four Claudient presets and when to reach for each, live-reload behavior, and a troubleshooting index for every category of failure.

---

## The keybindings.json File

**Location:** `~/.claude/keybindings.json`

This is a user-scoped file. There is no project-level equivalent — keybindings apply to every Claude Code session on the machine, regardless of which directory you open. If you share workstations, use separate OS user accounts.

### Minimal valid file

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": []
}
```

An empty `bindings` array is perfectly valid. Claude Code applies its built-in defaults for every action that has no explicit mapping.

### Full schema structure

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "<ContextName>",
      "bindings": {
        "<keystroke>": "<namespace:action>",
        "<keystroke>": null
      }
    }
  ]
}
```

**Top-level fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `$schema` | string | Recommended | Enables IDE validation in VS Code / JetBrains |
| `bindings` | array | Yes | Ordered list of context blocks |

**Per-context block fields:**

| Field | Type | Notes |
|---|---|---|
| `context` | string | Must exactly match one of the eight context names (case-sensitive) |
| `bindings` | object | Map of keystroke strings to action strings or `null` |

**Action value:** A string in `namespace:action` form (e.g., `"chat:submit"`), or `null` to explicitly unbind a key.

Setting a key to `null` removes the built-in default. This is the only way to prevent a default binding from firing — omitting the key entirely leaves the default in place.

---

## Contexts

A context is active when a specific part of the UI has focus or is visible. Bindings in a context only fire while that context is active. The `Global` context is always active regardless of what else is on screen.

### Context reference

| Context | Active when |
|---|---|
| `Global` | Always — fires regardless of focus state |
| `Chat` | The main chat input field is focused |
| `Scroll` | Transcript scroll mode is engaged |
| `Autocomplete` | The slash-command or mention autocomplete menu is open |
| `Confirmation` | A yes/no tool-permission prompt is displayed |
| `Transcript` | The full transcript panel is open |
| `HistorySearch` | The history search overlay (`ctrl+r` by default) is active |
| `ModelPicker` | The model selection dropdown is open |

### Context priority and conflicts

When two contexts are simultaneously active (e.g., `Global` and `Chat`), the more specific context wins. A key bound in `Chat` takes precedence over the same key bound in `Global`. If only `Global` defines a binding for a key, it fires in all contexts including `Chat`.

This means you can reserve a key globally and then override it per-context without worrying about ordering in the file.

### The Transcript context

`Transcript` and `Scroll` are related but distinct. `Scroll` is the context when you navigate with the keyboard through the active session output. `Transcript` applies when the persistent transcript panel (toggled with `app:toggleTranscript`) is open. Most users want their navigation bindings in `Scroll`; the `Transcript` context is for actions that manipulate the panel itself.

---

## Keystroke Syntax

### Modifiers

| Token | Key | Alias |
|---|---|---|
| `ctrl` | Control | — |
| `shift` | Shift | — |
| `alt` | Alt / Option | `opt` |
| `cmd` | Command (macOS) / Meta (Linux) | `super` |

Modifiers are combined with `+` and the base key, all lowercase:

```
ctrl+e
ctrl+shift+k
alt+enter
cmd+shift+p
```

Order does not matter syntactically — `ctrl+shift+k` and `shift+ctrl+k` are equivalent — but convention is modifier alphabetical order (alt, cmd, ctrl, shift) followed by the key.

### Base keys

Standard alphanumerics: `a`–`z`, `0`–`9`. No uppercase letters in the key position — uppercase is expressed with `shift+<letter>`:

```json
"shift+g": "scroll:bottom"
```

**Gotcha:** Writing `"G"` as a keystroke (capital G without shift) is undefined behavior. Claude Code may silently ignore the binding or treat it inconsistently across platforms. Always use `shift+<letter>` for uppercase intent.

Named keys:

| Token | Key |
|---|---|
| `enter` | Enter / Return |
| `tab` | Tab |
| `escape` | Escape |
| `space` | Space bar |
| `backspace` | Backspace |
| `delete` | Delete (forward delete on macOS) |
| `home` | Home |
| `end` | End |
| `pageup` | Page Up |
| `pagedown` | Page Down |
| `up` | Arrow up |
| `down` | Arrow down |
| `left` | Arrow left |
| `right` | Arrow right |
| `f1`–`f12` | Function keys |

Punctuation is written literally: `/`, `\`, `;`, `'`, `,`, `.`, `[`, `]`, `` ` ``. For keys that are special in JSON strings, use standard JSON escaping: `"\\"` for backslash.

### Chords

A chord is a sequence of keystrokes that must be pressed one after the other. Separate each key in the sequence with a space:

```json
"ctrl+x ctrl+e": "chat:externalEditor"
```

This means: press Ctrl+X, release, then press Ctrl+E. Claude Code holds a short chord timeout (~1 second) between key presses. If the second key is not pressed in time, the chord fails and the first key is handled independently (which may fire a different binding or type into the input).

**Chord depth:** Two-chord sequences are fully supported. Three or more are not. `"ctrl+x ctrl+e ctrl+z"` is invalid.

**Chord conflicts:** If you bind both `ctrl+x` and `ctrl+x ctrl+e`, pressing Ctrl+X alone will fire the single-key binding immediately (no ambiguity wait). This is different from Emacs, where a prefix key is consumed. Plan accordingly — if you use Emacs-style `ctrl+x` prefix chords, do not also bind standalone `ctrl+x`.

**Gotcha:** Terminal emulators intercept many chord combinations before Claude Code ever sees them. `ctrl+shift+<letter>` is safe in most modern terminals (kitty, WezTerm, iTerm2 with full keyboard protocol enabled, Windows Terminal). `ctrl+<letter>` without shift is dangerous for letters where the terminal has a built-in: Ctrl+C, Ctrl+D, Ctrl+S (XON/XOFF in some configs), Ctrl+Q, Ctrl+Z. Always verify that your terminal is passing the keystroke through before assuming Claude Code isn't responding.

---

## Complete Action Reference

### `app` namespace — Global context

These actions fire regardless of what the UI is showing.

| Action | Default | Description |
|---|---|---|
| `app:interrupt` | `escape` | Stop the current in-progress tool operation. Does not clear input. |
| `app:toggleTodos` | — | Show or hide the task/todo panel |
| `app:toggleTranscript` | — | Show or hide the persistent transcript view |

`app:interrupt` is the programmatic equivalent of pressing Escape mid-run. Bind this to something muscle-memory accessible if you frequently need to halt tool chains.

### `chat` namespace — Chat context

| Action | Default | Description |
|---|---|---|
| `chat:submit` | `enter` | Send the current input as a message |
| `chat:newline` | `shift+enter` | Insert a literal newline without submitting |
| `chat:cancel` | — | Cancel / dismiss the current input state |
| `chat:clearInput` | — | Wipe the entire input buffer |
| `chat:undo` | — | Undo the last edit to the input buffer |
| `chat:cycleMode` | — | Cycle between chat modes (e.g. plan, auto, code) |
| `chat:modelPicker` | — | Open the model selection overlay |
| `chat:fastMode` | — | Toggle fast mode (Opus 4.7 with faster output) |
| `chat:thinkingToggle` | — | Toggle extended thinking on/off |
| `chat:externalEditor` | — | Open the current input buffer in `$EDITOR` |

`chat:externalEditor` is the most underused action. It opens whatever is in `$EDITOR` (or `$VISUAL`) with the current input content, lets you write in your real editor, and imports the buffer back on save. Indispensable for multi-paragraph prompts or prompts with embedded code snippets.

**Gotcha — `chat:submit` vs `enter`:** The default submit key is Enter. If you rebind `chat:submit` to something else (e.g., `alt+enter` in the ergonomic preset), Enter will type a newline into the buffer instead. This is intentional and is the correct behavior for heavy keyboard users. If you rebind submit, also rebind `chat:newline` to `ctrl+enter` or similar to keep both functions accessible.

### `scroll` namespace — Scroll context

| Action | Default | Description |
|---|---|---|
| `scroll:lineUp` | `up` | Scroll up one line |
| `scroll:lineDown` | `down` | Scroll down one line |
| `scroll:top` | `ctrl+home` | Jump to beginning of transcript |
| `scroll:bottom` | `ctrl+end` | Jump to end (most recent output) |
| `scroll:pageUp` | `pageup` | Scroll up one viewport height |
| `scroll:pageDown` | `pagedown` | Scroll down one viewport height |

### `confirmation` namespace — Confirmation context

| Action | Default | Description |
|---|---|---|
| `confirmation:confirm` | `y` | Accept a tool permission or destructive action |
| `confirmation:deny` | `n` | Reject a tool permission or destructive action |

**Security consideration:** If you rebind `confirmation:confirm` to a key that's easy to press accidentally (e.g., a bare letter that you type constantly), you risk approving tool calls without reading them. The ergonomic preset uses `alt+y` to prevent this. Choose deliberately.

### `historySearch` namespace — HistorySearch context

| Action | Default | Description |
|---|---|---|
| `historySearch:up` | `up` | Move to previous match in history |
| `historySearch:down` | `down` | Move to next match in history |
| `historySearch:cancel` | `escape` | Close history search without selecting |

### `autocomplete` namespace — Autocomplete context

| Action | Default | Description |
|---|---|---|
| `autocomplete:up` | `up` | Move to previous suggestion |
| `autocomplete:down` | `down` | Move to next suggestion |
| `autocomplete:cancel` | `escape` | Dismiss the autocomplete menu |

### `modelPicker` namespace — ModelPicker context

| Action | Default | Description |
|---|---|---|
| `modelPicker:up` | `up` | Move to previous model in list |
| `modelPicker:down` | `down` | Move to next model in list |
| `modelPicker:cancel` | `escape` | Close model picker without selecting |

---

## Reserved Keys

The following keys cannot be meaningfully rebound. Entries for these in `keybindings.json` are either silently ignored or produce undefined behavior:

| Key | Reason |
|---|---|
| `ctrl+c` | SIGINT / hard interrupt — handled at the terminal level, never reaches Claude Code's key handler |
| `ctrl+d` | EOF signal — exits the process or closes the session; terminal-level |
| `ctrl+m` | Identical byte sequence to Enter (`\r`) at the terminal protocol level — rebinding it rebinds Enter |
| `ctrl+i` | Identical to Tab — rebinding `ctrl+i` rebinds Tab globally |
| `ctrl+h` | Identical to Backspace in most terminals |

**Platform-specific reservations:**

On macOS, `cmd+<key>` combinations are often consumed by the operating system or the terminal application before they reach Claude Code. `cmd+tab`, `cmd+space`, `cmd+q`, `cmd+w`, and `cmd+h` are system-level. Test any `cmd+` binding carefully before committing to muscle memory.

On Linux, whether `ctrl+shift+<letter>` bindings are passed through depends entirely on your terminal emulator's configuration. Terminals running in legacy VTE mode do not pass these. Kitty, Alacritty (with CSI u mode), and WezTerm pass all modifier combinations by default.

---

## The Four Claudient Presets

These presets live in `keybindings/` in the Claudient repository. Each is a complete `keybindings.json` file you can drop in directly or use as a base for further customization.

### `vim.json` — Vim-style navigation

**Philosophy:** Bring scroll navigation and overlay navigation inline with Vim muscle memory. Does not attempt to add a modal editing layer — Claude Code's input is always in insert mode.

**Key mappings:**

| Key | Action | Why it matters |
|---|---|---|
| `j` / `k` | `scroll:lineDown` / `scroll:lineUp` | Home-row scroll in Scroll context |
| `g` | `scroll:top` | Lowercase g to top (matches gg idiom when typed twice — first g enters scroll, second g fires) |
| `shift+g` | `scroll:bottom` | Capital G to bottom, mirroring Vim's G |
| `ctrl+f` / `ctrl+b` | `scroll:pageDown` / `scroll:pageUp` | Page scroll as in Vim |
| `ctrl+d`: `null` | Unbinds ctrl+d in Scroll context | Prevents accidental session exit while scrolling |
| `ctrl+u` | `scroll:pageUp` | Vim's Ctrl+U half-page (mapped to full page here) |
| `ctrl+[` | `chat:cancel` | Escape substitute for terminals that intercept Escape |
| `ctrl+l` | `chat:clearInput` | Clear input (Vim users also use this in shell) |
| `ctrl+p` | `chat:cycleMode` | Mimics Ctrl+P command palette muscle memory |
| `y` / `n` | `confirmation:confirm` / `confirmation:deny` | Single-key confirm in Confirmation context |
| `ctrl+p` / `ctrl+n` | `historySearch:up` / `historySearch:down` | Standard reverse-search navigation |
| `ctrl+[` | `historySearch:cancel` | Escape alias |
| `ctrl+t` | `app:toggleTodos` | Quick todo toggle |
| `ctrl+\` | `app:toggleTranscript` | Transcript toggle |

**Best paired with:** `editorMode: "vim"` in `/config`, which enables Vim keybindings in the text input field itself.

**Gotcha:** `j` and `k` are only active in `Scroll` context. They type normally in the chat input. If you find yourself scrolling when you meant to type, you have entered scroll mode — press Escape or start typing to exit.

**Install:**
```bash
cp keybindings/vim.json ~/.claude/keybindings.json
```

---

### `emacs.json` — Emacs chord system

**Philosophy:** GNU Readline / Emacs conventions for navigation and command invocation. Uses `ctrl+x <key>` as a prefix chord for Claude-specific actions, leaving bare Ctrl shortcuts for Readline text editing.

**Key mappings:**

| Key | Action | Emacs equivalent |
|---|---|---|
| `ctrl+g` | `chat:cancel` | Universal cancel |
| `ctrl+x ctrl+e` | `chat:externalEditor` | Edit in `$EDITOR` (mirrors shell `ctrl+x ctrl+e`) |
| `ctrl+/` | `chat:undo` | Emacs undo |
| `ctrl+k` | `chat:clearInput` | Kill to end of line (repurposed to clear input) |
| `alt+m` | `chat:cycleMode` | Alt+M mnemonic for Mode |
| `ctrl+x m` | `chat:modelPicker` | Ctrl+X prefix + M for Model |
| `ctrl+x f` | `chat:fastMode` | Ctrl+X prefix + F for Fast |
| `ctrl+x t` | `chat:thinkingToggle` | Ctrl+X prefix + T for Thinking |
| `ctrl+n` / `ctrl+p` | `scroll:lineDown` / `scroll:lineUp` | Next/previous line |
| `alt+<` / `alt+>` | `scroll:top` / `scroll:bottom` | Buffer boundaries |
| `ctrl+v` / `alt+v` | `scroll:pageDown` / `scroll:pageUp` | Page scroll |
| `ctrl+x ctrl+t` | `app:toggleTodos` | Ctrl+X prefix + T for Todos |
| `ctrl+x ctrl+r` | `app:toggleTranscript` | Ctrl+X prefix + R for Record |
| `ctrl+x ctrl+z` | `app:interrupt` | Ctrl+X prefix + Z for suspend (repurposed) |
| `ctrl+g` | `historySearch:cancel` / `autocomplete:cancel` / `modelPicker:cancel` | Universal Ctrl+G cancel |
| `ctrl+p` / `ctrl+n` | `historySearch:up` / `historySearch:down` | Previous/next in all navigation contexts |

**Chord note:** `ctrl+x ctrl+e` is the most ergonomically important binding in this preset. It mirrors the shell behavior of opening `$EDITOR` with the current command line — the same muscle memory applies here for composing long prompts.

**Conflict to watch:** `ctrl+k` in Emacs normally kills to end of line. In the Chat context, this preset repurposes it to clear the entire input. If you rely on `ctrl+k` for text editing inside the prompt, remove this binding.

**Install:**
```bash
cp keybindings/emacs.json ~/.claude/keybindings.json
```

---

### `ergonomic.json` — Alt-key layout for extended sessions

**Philosophy:** Move all Claude-specific actions to `alt+<letter>`, keeping fingers on the home row and avoiding Ctrl+letter finger contortion. Prioritizes RSI prevention over familiarity.

**Key design decisions:**

- Submit is moved to `alt+enter`, freeing Enter for newlines (reverses the default)
- Navigation reuses `alt+j/k` (Vim-adjacent) for consistency across contexts
- Every Claude-specific action has exactly one dedicated `alt+` binding
- No chords — all bindings are single-key with one modifier

**Key mappings:**

| Key | Action |
|---|---|
| `alt+enter` | `chat:submit` |
| `ctrl+enter` | `chat:newline` |
| `alt+e` | `chat:externalEditor` |
| `alt+c` | `chat:cancel` |
| `alt+z` | `chat:undo` |
| `alt+x` | `chat:clearInput` |
| `alt+tab` | `chat:cycleMode` |
| `alt+m` | `chat:modelPicker` |
| `alt+f` | `chat:fastMode` |
| `alt+t` | `chat:thinkingToggle` |
| `alt+j` / `alt+k` | `scroll:lineDown` / `scroll:lineUp` |
| `alt+h` / `alt+l` | `scroll:top` / `scroll:bottom` |
| `alt+n` / `alt+p` | `scroll:pageDown` / `scroll:pageUp` |
| `alt+i` | `app:interrupt` |
| `alt+o` | `app:toggleTodos` |
| `alt+r` | `app:toggleTranscript` |
| `alt+y` / `alt+n` | `confirmation:confirm` / `confirmation:deny` |
| `alt+j` / `alt+k` | `historySearch:down` / `historySearch:up` (and autocomplete, modelPicker) |
| `alt+c` | `historySearch:cancel` / `autocomplete:cancel` / `modelPicker:cancel` |

**Critical behavior change:** Submit is `alt+enter`, not Enter. This affects every user who opens this preset without reading the docs. Enter inserts newlines freely, which is a major workflow improvement for multi-line prompts but a disorientation until the new habit forms.

**`alt+tab` on macOS:** In most macOS terminal emulators, Alt+Tab is intercepted by the window manager for application switching. Test this binding before relying on it. `alt+grave` or `alt+,` may be better alternatives for `chat:cycleMode` on macOS.

**Install:**
```bash
cp keybindings/ergonomic.json ~/.claude/keybindings.json
```

---

### `power-user.json` — Fast access to AI-specific controls

**Philosophy:** Prioritize the actions most relevant to heavy AI usage — model switching, thinking mode, fast mode, and mode cycling — and put them on safe `ctrl+shift+<key>` chords that do not conflict with standard terminal or text-editing shortcuts.

**Key mappings:**

| Key | Action |
|---|---|
| `ctrl+shift+m` | `chat:modelPicker` |
| `ctrl+shift+f` | `chat:fastMode` |
| `ctrl+shift+t` | `chat:thinkingToggle` |
| `ctrl+e` | `chat:externalEditor` |
| `ctrl+shift+c` | `chat:cycleMode` |
| `ctrl+shift+x` | `chat:clearInput` |
| `ctrl+z` | `chat:undo` |
| `ctrl+shift+o` | `app:toggleTodos` |
| `ctrl+shift+r` | `app:toggleTranscript` |
| `ctrl+shift+i` | `app:interrupt` |
| `ctrl+shift+j` / `ctrl+shift+k` | Navigation down/up in all contexts |
| `ctrl+shift+g` | `scroll:bottom` |
| `ctrl+home` | `scroll:top` |
| `ctrl+end` | `scroll:bottom` |
| `ctrl+shift+n` / `ctrl+shift+p` | `scroll:pageDown` / `scroll:pageUp` |
| `ctrl+shift+y` / `ctrl+shift+n` | `confirmation:confirm` / `confirmation:deny` |
| `ctrl+shift+q` | Cancel in HistorySearch, Autocomplete, ModelPicker |

**Design rationale:** `ctrl+shift+<letter>` is safe in Kitty, WezTerm, iTerm2, and Windows Terminal. In legacy terminals (gnome-terminal default, macOS Terminal.app), many of these may not pass through. If you are on Terminal.app, switch to iTerm2 with the full keyboard report option enabled, or use the ergonomic preset instead.

**The three AI-control bindings** (`ctrl+shift+m`, `ctrl+shift+f`, `ctrl+shift+t`) are the core of this preset. Model picker, fast mode toggle, and thinking toggle are the most workflow-relevant controls for power users and warrant one-chord access.

**Install:**
```bash
cp keybindings/power-user.json ~/.claude/keybindings.json
```

---

## Merging Presets

If you have existing custom bindings you want to preserve, do not `cp` a preset over your file. Merge manually:

1. Open your current `~/.claude/keybindings.json`
2. Open the preset file
3. For each context block in the preset, either:
   - Append new key entries into the matching context block in your file, or
   - Add the entire context block if your file does not have that context

The `bindings` array is deduplicated by context name at load time — Claude Code uses the last-defined context block if the same context appears more than once. Merging by hand is safer than relying on this deduplication.

**Quick merge script (non-destructive):**

```bash
cp ~/.claude/keybindings.json ~/.claude/keybindings.json.bak
# Then edit manually — jq can help inspect both files:
jq '.bindings[] | .context' ~/.claude/keybindings.json
jq '.bindings[] | .context' keybindings/power-user.json
```

---

## Live Reload

Claude Code reads `~/.claude/keybindings.json` at **session startup**, not continuously. There is no inotify watch or daemon watching the file.

**To apply changes:**

- If you are in an active session: exit (`ctrl+d` or `/exit`) and reopen
- If you are launching a new session from scratch: changes are effective immediately

There is no `--reload-keybindings` flag or in-session command to reload without restarting. This is by design — keybindings that change mid-session would conflict with active input state.

**Workflow for iterating on a new layout:**

```bash
# Edit the file
$EDITOR ~/.claude/keybindings.json

# Validate JSON syntax before reopening
python3 -m json.tool ~/.claude/keybindings.json > /dev/null && echo "valid"

# Then start a new session — changes are live
claude
```

Running `python3 -m json.tool` before reopening saves time. A syntax error in `keybindings.json` causes Claude Code to silently ignore the entire file and fall back to defaults, with no error message in the UI.

---

## Troubleshooting

### Binding does nothing

**1. Check JSON syntax.** A single misplaced comma or missing brace silently invalidates the whole file. Validate with:
```bash
python3 -m json.tool ~/.claude/keybindings.json
```

**2. Check that the session was restarted.** Changes require a new session.

**3. Check the context name.** Context names are case-sensitive. `"chat"` does not match `"Chat"`. Use exactly: `Global`, `Chat`, `Scroll`, `Autocomplete`, `Confirmation`, `Transcript`, `HistorySearch`, `ModelPicker`.

**4. Check that the action name is valid.** `"chat:submit"` is valid; `"Chat:Submit"` is not. All action strings are lowercase with a colon separator.

**5. Check that the terminal is passing the key.** Open a test tool (`cat`, `xxd`) and type the keystroke. If nothing appears or you see a different byte sequence, the terminal is consuming it before Claude Code.

---

### Binding fires in wrong context

**Symptom:** You press a key bound in `Scroll`, but it fires in `Chat` (or vice versa).

**Cause:** You bound the key in `Global` somewhere, and the Global binding is shadowing a more specific one, or vice versa.

**Fix:** Audit for the same key across all context blocks in your file. Remember that `Global` bindings fire in all contexts unless overridden by a more specific context block.

---

### Two bindings conflict

**Symptom:** One of two keys for the same action fires; the other doesn't.

**Cause:** You defined the same key in the same context twice across two different context blocks. Claude Code uses the last-defined one.

**Fix:** Consolidate all bindings for a given context into a single object. Having two separate `"context": "Chat"` blocks in the `bindings` array is valid JSON but only the second takes effect.

---

### Chord second key fires independently

**Symptom:** Pressing `ctrl+x` then `ctrl+e` opens the external editor, but `ctrl+x` alone also triggers something.

**Cause:** You have a standalone `ctrl+x` binding in the same context.

**Fix:** Remove the standalone binding, or accept the behavior (standalone fires immediately; chord fires if the second key follows within the timeout window).

---

### Keys work in one terminal, not another

**Cause:** Terminal emulator keyboard protocol mismatch. Legacy terminals do not pass `ctrl+shift+<letter>` combinations.

**Diagnostics:**

```bash
# In kitty or WezTerm:
# ctrl+shift+j should show a distinct escape sequence
# In Terminal.app: it may show the same as ctrl+j or nothing
xxd   # then press the key combination
```

**Fix:** Switch to a terminal that supports the full keyboard protocol (kitty `--listen-on`, WezTerm, iTerm2 with "Use modern keyboard reporting"), or choose bindings that work in your current terminal (single modifier + letter, or alt-based bindings from the ergonomic preset).

---

### `null` unbind not working

**Symptom:** Setting a key to `null` in a context does not remove the default behavior.

**Cause:** The default is defined in a higher-priority context. A `null` in `Chat` will not suppress a default in `Global`. You need to set the key to `null` in whichever context actually defines it.

**Workaround:** If the default context is unknown, add the `null` binding in both `Chat` and `Global`:

```json
{
  "context": "Global",
  "bindings": {
    "ctrl+s": null
  }
},
{
  "context": "Chat",
  "bindings": {
    "ctrl+s": null
  }
}
```

---

### `$EDITOR` not opening for `chat:externalEditor`

**Cause:** `$EDITOR` is not set in the environment Claude Code inherits.

**Fix:** Set `$EDITOR` in your shell profile:

```bash
# ~/.zshrc or ~/.bashrc
export EDITOR="nvim"
export VISUAL="nvim"
```

Claude Code inherits environment variables from the shell it is launched from. If you run `claude` from a shell where `$EDITOR` is set, the external editor action works. If you launch Claude Code via a desktop shortcut or from a shell that does not source your profile, `$EDITOR` may be empty.

---

### Confirmation keys trigger accidentally

**Symptom:** You accidentally approve tool calls by typing `y` or `n` in a confirmation prompt.

**Cause:** The default `confirmation:confirm` is the bare letter `y`. If you type fast, a pending confirmation prompt can capture a stray keystroke.

**Fix:** Rebind confirmation actions to modified keys:

```json
{
  "context": "Confirmation",
  "bindings": {
    "y": null,
    "n": null,
    "alt+y": "confirmation:confirm",
    "alt+n": "confirmation:deny"
  }
}
```

This is the approach taken in the ergonomic preset.

---

## Example: Building a Custom Layout

A developer who uses Vim in the terminal, wants fast model switching, and does extended sessions (RSI concern) might merge the best parts of vim and power-user:

```json
{
  "$schema": "https://www.schemastore.org/claude-code-keybindings.json",
  "bindings": [
    {
      "context": "Scroll",
      "bindings": {
        "j": "scroll:lineDown",
        "k": "scroll:lineUp",
        "g": "scroll:top",
        "shift+g": "scroll:bottom",
        "ctrl+f": "scroll:pageDown",
        "ctrl+b": "scroll:pageUp",
        "ctrl+d": null
      }
    },
    {
      "context": "Chat",
      "bindings": {
        "ctrl+[": "chat:cancel",
        "ctrl+l": "chat:clearInput",
        "ctrl+e": "chat:externalEditor",
        "ctrl+shift+m": "chat:modelPicker",
        "ctrl+shift+f": "chat:fastMode",
        "ctrl+shift+t": "chat:thinkingToggle",
        "ctrl+shift+c": "chat:cycleMode"
      }
    },
    {
      "context": "Global",
      "bindings": {
        "ctrl+shift+i": "app:interrupt",
        "ctrl+shift+o": "app:toggleTodos",
        "ctrl+shift+r": "app:toggleTranscript"
      }
    },
    {
      "context": "Confirmation",
      "bindings": {
        "y": null,
        "n": null,
        "alt+y": "confirmation:confirm",
        "alt+n": "confirmation:deny"
      }
    },
    {
      "context": "HistorySearch",
      "bindings": {
        "ctrl+p": "historySearch:up",
        "ctrl+n": "historySearch:down",
        "ctrl+[": "historySearch:cancel"
      }
    }
  ]
}
```

This gives Vim scroll navigation, power-user AI controls, Escape-equivalent cancel via `ctrl+[`, and protected confirmation keys — without touching the default Enter/submit behavior.

---

## Schema Validation

The `$schema` reference at the top of the file enables JSON Schema validation in VS Code and JetBrains IDEs. With the schema active, your editor will flag invalid context names, misspelled action names, and incorrect value types inline before you ever run Claude Code.

Install the SchemaStore extension for VS Code if auto-detection is not working:

```bash
code --install-extension tamasfe.even-better-toml  # for TOML; JSON schema validation is built into VS Code
```

For standalone validation without an IDE:

```bash
npm install -g ajv-cli
ajv validate -s https://www.schemastore.org/claude-code-keybindings.json -d ~/.claude/keybindings.json
```

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
