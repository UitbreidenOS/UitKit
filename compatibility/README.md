# Claudient — Cross-Harness Compatibility

> Use Claudient's 380+ skills, 182 agents, 100 commands, and 32 rules in any AI coding tool.

## Quick reference — what works where

A comprehensive compatibility matrix across tools:

| Claudient content | Claude Code | Cursor | Windsurf | Codex CLI | Gemini | Copilot |
|---|---|---|---|---|---|---|
| Skills (as markdown prompts) | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt |
| Commands (slash command definitions) | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | ❌ N/A | 🔄 Adapt |
| Agents (subagent YAML/MD) | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | ❌ N/A |
| Rules (always-follow guidelines) | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt |
| Hooks (event-driven automation) | ✅ Native | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |
| CLAUDE.md examples | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt |
| Personas (system prompts) | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt |
| Output styles | ✅ Native | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |
| Themes | ✅ Native | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |
| Statuslines | ✅ Native | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |
| Keybindings | ✅ Native | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |
| Plugin marketplace | ✅ Native | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A |
| MCP integration | ✅ Native | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt | 🔄 Adapt |

## What's harness-agnostic (works everywhere with minimal effort)

These Claudient elements are portable across any AI coding tool with minimal or no adaptation:

- **Skills and commands** — Markdown prompts that can be invoked via any tool's chat, command palette, or slash command system
- **Rules** — Always-follow guidelines that translate directly to system prompts or instruction sets
- **Agents** — Agent definitions (YAML or Markdown) can be repurposed as system prompts or spawned via any harness's delegation API
- **CLAUDE.md examples** — Strip Claude Code-specific references (e.g., `/slash-command` → generic command reference) and reuse the logic
- **Personas** — Adapt as system prompts or agent role definitions in any tool
- **MCP** — Most tools support MCP; Claudient's MCP configurations work across harnesses (Claude Code, Cursor, Windsurf, etc.)

## What's Claude Code exclusive

These features are native to Claude Code and do not translate to other tools:

- **Plugin marketplace** — `/plugin install` and `.claude-plugin/marketplace.json` are Claude Code-specific
- **Hooks** — Event-driven automation (pre-commit, post-test, on-deploy) is handled by Claude Code's settings.json hooks system
- **SKILL.md auto-invocation** — Claude Code's automatic skill detection and invocation based on file presence
- **Statuslines** — Custom status bar rendering in Claude Code's UI
- **Output styles** — Claude Code's output formatting and visual customization
- **Themes** — Claude Code's terminal and UI theming system
- **Keybindings** — ~/.claude/keybindings.json key remapping is Claude Code-specific

## Per-tool guides

Adapter guides and patterns for each tool:

- **[Claude Code](claude-code.md)** — Native support; no adaptation needed. Use skills, agents, hooks, and plugin marketplace out of the box.
- **[Cursor](cursor.md)** — Adapt skills as custom commands; use agents as system prompts via .cursorrules.
- **[Windsurf](windsurf.md)** — Adapt skills via Windsurf's command palette; use Cascade for agent-like behavior.
- **[Codex CLI](codex-cli.md)** — Adapt skills as CLI prompts; invoke agents via Codex's delegation API.
- **[Gemini](gemini.md)** — Adapt skills as chat prompts; use agents as system instructions via Gemini's API.
- **[GitHub Copilot](copilot.md)** — Adapt skills as VS Code snippets and custom instructions; limited agent support.

## The adaptation pattern

A universal 5-step process for adapting any Claudient skill to any AI coding tool:

1. **Extract the core prompt** — Copy the skill's Instructions section verbatim.
2. **Strip harness references** — Remove Claude Code-specific syntax (`/slash-commands`, `@agents`, hooks, settings.json keys).
3. **Adapt to target tool's invocation** — Reframe as a chat prompt (Gemini), custom command (Cursor), Cascade workflow (Windsurf), or CLI invocation (Codex).
4. **Preserve context and examples** — Keep the skill's When to activate, When NOT to use, and Example sections intact.
5. **Test in target tool** — Run a simple test case to verify the adapted skill produces the expected output.

### Example: Adapting the "code-review" skill to Cursor

**Original Claudient skill prompt:**
```
/code-review --effort high --comment
Review the current diff for correctness bugs and reuse/simplification/efficiency cleanups at the given effort level.
```

**Adapted for Cursor:**
1. Create `.cursorrules` entry:
```
# Code Review (High Effort)
When user requests a code review, analyze the current diff for:
- Correctness bugs (logic errors, edge cases, type mismatches)
- Reuse opportunities (DRY violations, duplicate patterns)
- Simplification (unnecessary complexity, redundant code)
- Efficiency improvements (algorithmic optimizations, performance bottlenecks)
Provide inline comments with specific line references and actionable suggestions.
```

2. Invoke via Cursor's chat: "Review the current diff using the high-effort code review pattern."

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
