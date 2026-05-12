# Contributing to Claudient

Claudient grows through community contributions. If you have a skill, agent, hook, workflow, or prompt that has made Claude Code meaningfully better for you — it belongs here.

---

## What to Contribute

| Type | Location | Description |
|---|---|---|
| Skill | `skills/<category>/` | A slash command that activates domain-specific behavior |
| Agent | `agents/<category>/` | A specialized subagent definition |
| Hook | `hooks/<trigger>/` | An event-triggered automation |
| Rule | `rules/common/` or `rules/<language>/` | An always-follow guideline |
| Workflow | `workflows/` | An end-to-end multi-step process |
| Prompt | `prompts/<category>/` | A reusable prompt template |
| Guide | `guides/` | A deep-dive documentation piece |
| Translation | `guides/<lang>/` | A translation of an existing English guide |

---

## Quality Bar

Before submitting, check that your contribution meets the bar:

**Skills**
- [ ] Has a clear "When to activate" section with specific trigger conditions
- [ ] Has a "When NOT to use" section with at least one anti-pattern
- [ ] Includes at least one concrete example
- [ ] References actual Claude Code features — not generic LLM advice
- [ ] You have tested it in at least one real session

**Agents**
- [ ] Specifies a tool subset (not all tools)
- [ ] Includes model guidance (Haiku / Sonnet / Opus) with reasoning
- [ ] Includes a concrete example use case

**Hooks**
- [ ] Includes the exact `settings.json` JSON snippet
- [ ] Includes the script (if applicable) with setup instructions
- [ ] Describes clearly what fires it and what it does

**Guides**
- [ ] Written for a senior developer audience
- [ ] No placeholder sections
- [ ] Accurate to current Claude Code behavior

---

## Skill Template

Copy this when adding a new skill:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns]

## Instructions
[Skill content]

## Example
[Concrete example]
```

---

## File Naming

- Use `kebab-case.md` for all Markdown files
- Use `kebab-case.sh` or `kebab-case.py` for scripts
- Place files in the correct subdirectory — check `README.md` for the map

---

## Submitting a PR

1. Fork the repo and create a branch: `git checkout -b add/fastapi-skill`
2. Add your file(s) following the format above
3. If you added a new guide in English, note in the PR description which translations are needed
4. Open a PR with a title like: `add: FastAPI skill` or `fix: token-optimization guide`
5. Fill in the PR description — what it is, why it's useful, how you tested it

---

## Translations

To translate an existing English guide:

1. Copy the English file: `cp guides/getting-started.md guides/fr/getting-started.md`
2. Translate the content — keep all code blocks, file paths, and technical terms in English
3. Submit a PR with title: `translate: getting-started guide (French)`

Supported languages: English (primary), French (`fr/`), German (`de/`), Dutch (`nl/`), Spanish (`es/`).

---

## What Gets Rejected

- Content that duplicates an existing file without clear improvement
- Placeholder or incomplete contributions ("coming soon" sections)
- Skills that describe generic LLM behavior rather than Claude Code-specific features
- Application code (this repo is documentation and configuration only)
- Anything that breaks the file naming or format conventions in `CLAUDE.md`

---

## Questions

Open a GitHub Discussion if you're unsure where something belongs or want feedback before building. Issues are for bugs and concrete gaps in coverage.
