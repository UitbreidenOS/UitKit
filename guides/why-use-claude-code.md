# Why Claude Code — Harness vs Prompt

A common misconception: "As models improve, features become prompts — so a well-written prompt equals a fully configured harness." This is wrong. Understanding why matters for getting the most out of Claude Code and for deciding what belongs in a prompt versus what belongs in configuration.

---

## The 10 Things a Harness Does That Prompts Cannot

| # | Capability | Harness | Prompt |
|---|---|---|---|
| 1 | **Context isolation** | Subagents run in separate context windows | Prompts share one context — everything bleeds together |
| 2 | **Tool restrictions** | Harness enforces which tools an agent can call — blocked at the runtime level | Prompts can only request; the model may comply or not |
| 3 | **Lazy loading** | Skills load only when semantically matched — startup context stays small | Prompts must front-load all instructions — large context from the start |
| 4 | **Hooks** | Shell commands fire on events (PreToolUse, Stop, PostCompact) regardless of model output | Prompts instruct; the model decides whether to follow |
| 5 | **Model routing** | Different tasks route to Haiku, Sonnet, or Opus based on agent definition | A single prompt runs on one model — no routing |
| 6 | **Parallelism** | Multiple agents run simultaneously in separate processes | Sequential prompts cannot parallelize — one turn at a time |
| 7 | **Cross-session persistence** | CLAUDE.md, rules, and memory persist across every session automatically | Prompts reset at session end — context must be re-injected every time |
| 8 | **Modular system prompt** | Hundreds of conditional fragments activate based on project config | One flat prompt — everything is always present or never present |
| 9 | **Automatic skill activation** | Domain expertise activates on file match or semantic trigger | Skills must be manually invoked — nothing is automatic |
| 10 | **Permission gates** | Harness enforces `allow`/`deny` rules for destructive operations at runtime | Prompts can only ask politely — no enforcement |

---

## The Token Asymmetry

Your prompt is typically 6–60 tokens. The harness manages 5,000–50,000+ tokens of model input through lazy loading, conditional activation, and prompt caching.

A "strong prompt" operates at the user-input layer — a fraction of what the model actually sees. It cannot reach:

- The system prompt fragments injected before your message
- The tool descriptions loaded by the harness
- The skill content activated by file context
- The rule files matched to the current working path
- The cached CLAUDE.md content from previous sessions

Writing a long, detailed user prompt to compensate for missing configuration is like increasing the signal by shouting while ignoring the noise floor.

---

## Practical Implications

**Do not replicate harness behavior in prompts.**

Prompts that attempt to enforce tool restrictions ("do not use Bash") or set persistent preferences ("always use TypeScript for new files") are not reliable. The model may follow them most of the time, but there is no guarantee. Harness configuration enforces; prompts request.

| What you want | Wrong approach | Right approach |
|---|---|---|
| Persistent coding standards | Repeat in every prompt | `CLAUDE.md` |
| Restrict agent to read-only | "Please don't write files" | Agent `tools:` allowlist |
| Run linter after every edit | "Please run lint after edits" | `PostToolUse` hook |
| Domain expertise for a task | Paste docs into the prompt | Skill file |
| Guaranteed side effects | "After finishing, notify me" | `Stop` hook |
| Security boundary | "Don't touch prod credentials" | `deny` permission rule |

---

## When Prompts Are the Right Tool

Prompts are the right tool for:

- **One-off task instructions** — specific, per-invocation guidance that doesn't generalize
- **Dynamic context** — information only known at runtime (a URL, a user-supplied file path, a specific version number)
- **Conversation steering** — redirecting mid-session based on what you just saw
- **Clarifying ambiguity** — explaining what "correct behavior" looks like for this specific case

Everything else — defaults, standards, patterns, restrictions, automation, persistence — belongs in the harness layer.

---

## The Compounding Effect

Harness configuration compounds. A project with a well-structured CLAUDE.md, three focused skills, two hook automations, and properly restricted agents works better on day 100 than on day 1, because every session benefits from the accumulated configuration without any additional prompt engineering.

A project that relies on prompts degrades over time. As the codebase grows, prompts get longer, context gets noisier, and the overhead of re-establishing context at the start of every session increases.

The investment in harness configuration pays dividends on every future session. The investment in a long system prompt pays dividends only on the current one.

---
