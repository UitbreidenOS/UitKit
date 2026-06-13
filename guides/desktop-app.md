# Claude Code Desktop App

Complete guide to the pane-based desktop workspace introduced in Claude Code v1.2581.0.

---

## Overview

The Claude Code desktop app is not a chat window with a sidebar. It is a full pane-based workspace — multiple independently resizable panels that Claude and the developer share simultaneously. Each pane type serves a distinct purpose, and they compose into layouts saved per project.

**Requirements:** Desktop v1.2581.0 or later. Download from [claude.ai/code](https://claude.ai/code).

The core shift from terminal Claude Code: you no longer context-switch between your editor, browser, and terminal. The workspace holds all of them, and Claude can see and interact with the same panes you do.

---

## Pane System

### Pane Types

**Chat pane**
The main conversation interface. Always present — it cannot be closed. All prompts, responses, and tool call summaries appear here.

**Diff pane** — `Cmd+Shift+D`
Interactive diff viewer. Shows diffs per turn, not just the cumulative final state. Navigate backward through turns to see exactly what changed when. Per-file breakdown with expandable sections. Supports inline comments on specific lines.

**Preview pane** — `Cmd+Shift+P`
Renders HTML files live without a browser, and opens PDFs, images, and videos inline. Auto-updates when the file changes on disk. Claude can use this pane for visual verification — taking screenshots and inspecting the DOM — without leaving the workspace. The `Persist sessions` option retains cookies and auth state across restarts.

**Terminal pane** — `Ctrl+\``
Integrated terminal. Runs inside the project directory. Useful for running tests, watching logs, or issuing commands in parallel with an active Claude session without switching windows.

**File pane**
Opens when you click any file path mentioned in chat or the diff viewer. Provides a direct editor for targeted edits. Saves to disk immediately on save. Warns if the file changed on disk since you opened it. Not a full IDE — suited for focused edits, not large structural refactors.

**Plan pane**
Visible during plan mode. Shows Claude's current plan as a structured list. Updates as Claude revises the plan mid-task.

**Tasks pane**
Task list view. Shows active and completed tasks across the current session.

**Subagent pane**
Displays running subagents and their current status — which tool each is executing, whether it is blocked waiting for input, and when it completes. Useful for monitoring parallel agent work without polling the chat.

### Pane Controls

| Action | Method |
|---|---|
| Reposition a pane | Drag the pane header |
| Resize a pane | Drag the pane edge |
| Close the focused pane | `Cmd+\` |
| Open additional panes | Views menu |

Layouts are saved per project. Reopening a project restores the last-used pane arrangement.

---

## Parallel Sessions

The sessions sidebar on the left lists all active sessions for the current window. Click to switch between them. Each session has independent context — switching does not interrupt the other session.

`Cmd+;` opens a **side chat** that does not affect main session history. The side chat sees the full current context but leaves no trace in the conversation when closed. Use it for quick questions mid-task — checking a value, asking about a pattern — without polluting the session with exploratory back-and-forth.

Drag and drop panels to arrange parallel views across sessions. A common layout: main session chat on the left, subagent pane on the right, diff viewer at the bottom.

---

## Preview Pane

The preview pane is the highest-leverage pane for frontend and document work.

- Opens HTML rendered live — changes to the file on disk appear immediately, no browser reload
- Opens PDFs, images, and video files inline
- Claude can take a screenshot of the preview and use it as visual verification before committing a change
- Claude can inspect the DOM through the preview pane, catching layout issues without a separate browser devtools session
- `Persist sessions` keeps cookies and authentication state across restarts — useful for previewing authenticated UI states
- The pane updates automatically on file save — no manual refresh

Use this in place of a browser for iterating on UI. Keep the preview pane open alongside the chat pane when working on any HTML, CSS, or template file.

---

## File Editor Pane

Click any file path in the chat output or the diff viewer to open the file in the file editor pane.

- Edits save to disk immediately when you save
- The pane warns if the file was modified on disk since you opened it
- Useful for reviewing Claude's writes and making small corrections directly
- Not intended for large refactors — open a proper IDE for those

---

## Diff Viewer

The diff viewer shows per-turn diffs, not just the final accumulated state.

- Navigate turn-by-turn using the turn selector at the top of the pane
- See exactly which lines changed in which response
- Per-file breakdown with expandable sections
- Add inline comments on specific lines — comments are visible to Claude in subsequent turns

Open with `Cmd+Shift+D`. Useful when reviewing a long multi-step task to understand the sequence of changes, not just the result.

---

## Auto-Archive

Sessions automatically archive when the linked pull request is merged. Archived sessions are removed from the active sessions sidebar but remain searchable. Re-open any archived session from the Archive tab.

Manual archiving is also available: right-click any session in the sidebar to archive it immediately.

---

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Open diff pane | `Cmd+Shift+D` |
| Open preview pane | `Cmd+Shift+P` |
| Open terminal pane | `Ctrl+\`` |
| Open side chat | `Cmd+;` |
| Close focused pane | `Cmd+\` |
| New session | `Cmd+N` |
| Switch to session 1–9 | `Cmd+[1-9]` |
| Submit prompt | `Enter` |
| New line in prompt | `Shift+Enter` |

---

## Custom Themes

Set Light, Dark, or System theme via `/config`. For power users, custom CSS injection is available — inject a stylesheet to override any visual element in the workspace. This is an advanced option with no official API stability guarantee.

---

## Tips

- Keep the preview pane open when iterating on any UI. Claude will use it for visual verification before declaring a task done.
- Use `Cmd+;` for side chats during active tasks — ask a quick question about the codebase without it appearing in the session context that Claude carries forward.
- Open a terminal pane alongside chat when running tests. Run the test suite directly without leaving the workspace.
- The subagent pane shows real-time status for parallel agents — check it instead of asking Claude for a status update.
- Drag sessions in the sidebar to reorder them. Keep the most active sessions at the top.
- The diff viewer's per-turn navigation is the fastest way to review what a long agent task actually did — use it before merging.

---
