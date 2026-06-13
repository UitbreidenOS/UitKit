# SDK vs CLI — System Prompt Differences

When you use Claude Code via the CLI versus via the Claude Agent SDK, the system prompt loaded into the model's context is dramatically different. This matters when building automated pipelines, debugging unexpected behavior, or tuning cost.

---

## What the CLI Loads

The CLI loads a modular system prompt assembled from 110+ conditionally-activated fragments at startup. What's included depends on your project configuration:

| Fragment category | Tokens (approximate) |
|---|---|
| Base prompt (always loaded) | ~269 |
| Tool descriptions (Read, Write, Edit, Bash, etc.) | ~800–1,200 |
| CLAUDE.md content (global + project) | Varies — can be 0 to 4,000+ |
| Skill descriptions (`.claude/skills/`) | ~50–200 per skill |
| Rule files (`.claude/rules/`) | Varies |
| MCP tool descriptions | ~100–500 per server |
| Session context (cwd, git status, platform) | ~100–300 |
| **Total with full config** | **up to ~5,000–8,000 tokens** |

None of this is visible to you in the terminal. The fragments are injected before your first message.

---

## What the SDK Loads

Without explicit configuration, the SDK (`anthropic` package with standard `messages.create`) loads no Claude Code context at all — it behaves as a plain API call. No CLAUDE.md, no skills, no tool descriptions beyond what you pass explicitly.

To load the CLI-equivalent system prompt from the SDK:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system=[
        {
            "type": "text",
            "text": "Your custom instructions here"
        }
    ],
    messages=[{"role": "user", "content": "Do X"}]
)
```

To load the Claude Code preset (includes tool descriptions and base prompt):

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system={"type": "preset", "preset": "claude_code"},
    messages=[{"role": "user", "content": "Do X"}]
)
```

To also load project settings from `.claude/settings.json`, add:

```python
extra_headers={"X-Setting-Sources": "project"}
```

---

## Behavior Differences at a Glance

| Behavior | CLI | SDK (default) | SDK + preset |
|---|---|---|---|
| CLAUDE.md loaded | Yes | No | No (add manually) |
| Tool use enabled | Yes | Requires explicit tools | Yes |
| Skill descriptions | Yes | No | No |
| Rule files | Yes | No | No |
| Session git context | Yes | No | No |
| Base safety instructions | Yes | Yes | Yes |
| MCP tool descriptions | Yes (if configured) | No | No |
| Cost vs CLI session | Reference | ~40–70% lower | ~80–95% of CLI |

---

## The `--bare` Flag

`claude -p "task" --bare` skips all project discovery at the CLI level:

- No CLAUDE.md loading
- No `.claude/settings.json` discovery
- No MCP server connections
- No skill loading

The result is a CLI invocation that behaves close to a direct SDK call, with the CLI UX layer on top. Startup time drops from ~2–3 seconds to ~200ms on warm systems.

Use `--bare` for:
- High-frequency automation scripts calling Claude via CLI
- SDK-style integrations that happen to use the CLI binary
- Testing prompts in isolation without project context interference

Do not use `--bare` for:
- Interactive development sessions (you lose CLAUDE.md, skills, rules)
- Workflows that need tool access to project MCP servers

---

## No Determinism Guarantee

There is no `seed` parameter equivalent for Claude Code or the Claude API. At temperature=0, responses are consistent in practice but not guaranteed to be identical across API calls. This is a fundamental model property — not a configuration issue, and not something `--bare` or the preset solves.

If your automation depends on deterministic output:
- Use structured output with defined JSON schemas
- Validate outputs against a schema rather than comparing raw text
- Build idempotent pipelines that tolerate variation in phrasing

---

## Startup Latency Reference

| Mode | Typical cold startup | Typical warm startup |
|---|---|---|
| `claude` (full CLI) | 3–5 seconds | 1–2 seconds |
| `claude -p "x"` (print mode) | 2–4 seconds | 1–1.5 seconds |
| `claude -p "x" --bare` | 0.3–0.5 seconds | 0.1–0.2 seconds |
| SDK `messages.create` | ~100–200ms (network) | ~100ms (network) |

Bare CLI mode is the right choice when you need the Claude Code binary but care about latency. The SDK is faster still when you don't need the CLI at all.

---
