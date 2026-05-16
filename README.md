# Claudient

> The definitive knowledge system for Claude Code — skills, agents, hooks, rules, workflows, and prompts that multiply what you can build.

![Claudient](web/public/social-preview.svg)

[![npm](https://img.shields.io/npm/v/claudient)](https://www.npmjs.com/package/claudient)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-EN%20%7C%20FR%20%7C%20DE%20%7C%20NL%20%7C%20ES-orange)](#translations)
[![Reddit](https://img.shields.io/badge/Reddit-r%2Fuitbreiden-FF4500?logo=reddit&logoColor=white)](https://www.reddit.com/r/uitbreiden/)
[![YouTube](https://img.shields.io/badge/YouTube-%40UITBREIDEN-FF0000?logo=youtube&logoColor=white)](https://www.youtube.com/@UITBREIDEN)
[![Website](https://img.shields.io/badge/Website-uitbreiden.com-orange)](https://uitbreiden.com/)

---

## Install

```bash
npx claudient add all
```

That's it. All skills are copied to `~/.claude/skills/`. Restart Claude Code and every skill is available as a slash command.

---

## Run Claude at maximum efficiency

Claudient includes a `/lean-claude` skill that activates token-efficient mode for any session with a single prompt. It consolidates model selection, context management, output compression, subagent strategy, and prompt efficiency into one ready-to-use activation command.

```bash
npx claudient add skills productivity
# Then use /lean-claude in Claude Code to activate it
```

See [`skills/productivity/lean-claude.md`](skills/productivity/lean-claude.md) for the full reference.

---

## What's included

| Type | Count | What it does |
|---|---|---|
| Skills | 22 | FastAPI, NestJS, Kubernetes, Terraform, Go, C#, Claude API, MLflow, Spark, and more |
| Agents | 6 | Subagent definitions — Planner, Architect, Code Reviewer, Security Reviewer, Build Resolvers |
| Hooks | 7 | Pre-tool-use safety, post-tool-use formatting and audit logging, lifecycle tracking |
| Rules | 8 | Coding standards, git hygiene, security, testing, and language-specific guidelines |
| Workflows | 5 | End-to-end processes for feature dev, debugging, code review, refactoring, and bootstrapping |
| Guides | 7 | Deep-dive docs in 5 languages (EN / FR / DE / NL / ES) |
| Prompts | 8 | System prompts, project starters, and task-specific templates |

---

## CLI Reference

```bash
# Install skills
npx claudient add skills                    # all skills (English)
npx claudient add skills backend            # one category
npx claudient add skills backend --lang fr  # French translation

# Install other content
npx claudient add agents                    # copies to ~/.claude/agents/
npx claudient add hooks                     # copies .sh scripts to ~/.claude/hooks/
npx claudient add rules                     # shows rules + instructions
npx claudient add rules --write             # appends all rules to ./CLAUDE.md
npx claudient add all                       # skills + agents + hooks
npx claudient add all --lang de             # everything in German

# Search
npx claudient search fastapi                # find skills by name or description
npx claudient search "model registry"       # search across all 22 skills

# Manage
npx claudient remove skills backend         # uninstall a category
npx claudient remove agents                 # uninstall agents
npx claudient update                        # check for newer version
npx claudient list                          # browse all content
npx claudient list agents                   # browse one type
```

**Supported languages:** `en` (default) · `fr` · `de` · `nl` · `es`

**Skill categories:** `backend` · `devops-infra` · `data-ml` · `database` · `finance-payments` · `ai-engineering`

---

## Skills

Each skill is a slash command that activates domain-specific expertise in Claude Code.

| Category | Skills |
|---|---|
| `backend` | FastAPI, Django, Next.js, NestJS, Go, C#/.NET |
| `devops-infra` | Kubernetes, Terraform, Docker, GitHub Actions |
| `data-ml` | Pandas/Polars, PyTorch/TensorFlow, dbt |
| `database` | GraphQL |
| `finance-payments` | Stripe |
| `ai-engineering` | Claude API, Agent Construction |

**Example:**
```bash
npx claudient add skills backend
# Then in Claude Code:
# /fastapi — activate FastAPI patterns
# /nestjs  — activate NestJS patterns
```

---

## Agents

Agents are subagent definitions — spawn them with the `Agent` tool using `subagent_type`.

- **Planner** — decomposes tasks into steps before coding begins
- **Architect** — reviews system design and makes structural decisions
- **Code Reviewer** — thorough PR review with security and performance focus
- **Security Reviewer** — dedicated security audit with OWASP coverage
- **Python Build Resolver** — diagnoses and fixes Python dependency and import errors
- **TypeScript Build Resolver** — resolves TypeScript compilation failures

---

## Hooks

Drop-in shell scripts for `PreToolUse`, `PostToolUse`, and lifecycle events.

| Hook | Event | What it does |
|---|---|---|
| `block-dangerous.sh` | PreToolUse | Blocks destructive commands (`rm -rf /`, fork bombs, etc.) |
| `git-push-confirm.sh` | PreToolUse | Warns before any `git push`, blocks force push to main |
| `audit-log.sh` | PostToolUse | Logs every tool call to `.claude/logs/audit.log` |
| `prettier.sh` | PostToolUse | Auto-runs Prettier after every Write/Edit |
| `cost-tracker.sh` | PostToolUse | Tracks token usage and estimated cost per session |
| `pre-compact-save.sh` | PreCompact | Saves session state before context compaction |
| `session-start.sh` | Notification | Prints branch, uncommitted files, and session notes on start |

```bash
npx claudient add hooks
# Scripts are copied to ~/.claude/hooks/
# See each hook's .md file for the settings.json entry
```

---

## Rules

Add to your project's `CLAUDE.md` to enforce consistent behaviour:

```bash
npx claudient add rules --write   # appends all rules to ./CLAUDE.md
```

**Available rules:** Coding Style · Git · Security · Testing · Performance · Python · TypeScript · Go

---

## Workflows

Reference documents for complex multi-step tasks — read before starting, not invoked as slash commands.

- `feature-development` — idea → scoped → coded → reviewed → merged
- `debugging-session` — reproduce → isolate → fix → verify
- `code-review` — structured review with security and performance checks
- `refactor-safely` — incremental refactoring with test coverage at every step
- `new-project-bootstrap` — scaffold with the right structure from day one

All 5 workflows available in EN / FR / DE / NL / ES.

---

## Manual installation (git clone)

If you prefer to manage files yourself:

```bash
git clone https://github.com/Claudient/Claudient.git
cd Claudient

# Copy a skill manually
cp skills/backend/python/fastapi.md ~/.claude/skills/

# Symlink for development (auto-updates with git pull)
bash scripts/link-skills.sh
```

---

## Translations

Every skill, guide, workflow, agent, and prompt is available in:

| Language | Code |
|---|---|
| English | `en` (default) |
| Français | `fr` |
| Deutsch | `de` |
| Nederlands | `nl` |
| Español | `es` |

Hook scripts (`.sh`) are English-only — shell is universal.

---

## Guides

| Guide | What it covers |
|---|---|
| [Getting Started](guides/getting-started.md) | Setup, first skill, first hook |
| [Skill Authoring](guides/skill-authoring.md) | How to write a skill that actually works |
| [Token Optimization](guides/token-optimization.md) | Model selection, context math, cost reduction |
| [Memory Management](guides/memory-management.md) | Session persistence, compaction strategies |
| [Security](guides/security.md) | Isolation, approval boundaries, sanitization |
| [Agent Orchestration](guides/agent-orchestration.md) | Subagent patterns, parallelization |
| [Hooks Cookbook](guides/hooks-cookbook.md) | Hook patterns with real examples |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) — includes the skill template, quality checklist, and review process.

---

## Work With Us

Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products with developer communities and deliver B2B AI solutions.

**[uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)**

---

## License

MIT
