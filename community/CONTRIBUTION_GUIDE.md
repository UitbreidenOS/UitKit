# Claudient Contributor Guide

Welcome to Claudient's community contribution ecosystem. This guide covers how to contribute themes, skill enhancements, CLI commands, and other Claude Code extensions to the project.

---

## Quick Start — Choose Your Contribution Type

| Contribution | Time | Prerequisites | Path |
|---|---|---|---|
| **Skill enhancement** | 30 min | CLAUDE.md skills knowledge | [Skill Enhancement](#skill-enhancement) |
| **New theme** | 1 hour | CSS/color theory basics | [Theme Contribution](#theme-contribution) |
| **CLI command** | 1-2 hours | Shell scripting or TypeScript | [CLI Command](#cli-command-contribution) |
| **Hook automation** | 1-2 hours | Bash/Python + Claude Code events | [Hook Contribution](#hook-contribution) |
| **Workflow documentation** | 2 hours | Domain expertise | [Workflow Contribution](#workflow-contribution) |
| **Agent specialization** | 2-3 hours | YAML + prompt engineering | [Agent Contribution](#agent-contribution) |
| **Full stack** | 4-6 hours | Read CLAUDE.md guidelines | [Community Stack](#community-stack-full-stack) |

**For the full process and review criteria, see:**
- **README.md** — Overview of community stacks, submission process, review timeline
- **REVIEW_CHECKLIST.md** — Detailed acceptance criteria (automated + manual review)
- **template/stack-template/** — Boilerplate for a new stack

---

## Prerequisites

All contributors must:

1. **Install Claude Code**
   ```bash
   npm install -g @anthropic-ai/claude-code
   # Or via desktop app: https://claude.com/download
   ```

2. **Fork the Claudient repository**
   ```bash
   git clone https://github.com/Claudient/Claudient
   cd Claudient
   ```

3. **Read the repository standards**
   - Review `CLAUDE.md` (file naming, structure, content rules)
   - Understand the directory ownership table
   - Familiarize yourself with the codebase style

4. **Set up your environment**
   ```bash
   npm install            # Install dev dependencies
   npm run build          # Build plugins and marketplace
   npm run validate       # Run pre-submission checks
   ```

5. **Join the community**
   - GitHub Discussions: Ask questions before starting large contributions
   - Reddit: [r/uitbreiden](https://www.reddit.com/r/uitbreiden/)
   - Discord (if applicable): #contributors channel

---

## Skill Enhancement

### What Is a Skill?

A skill is a single-file markdown (`.md`) definition that teaches Claude Code to handle a domain-specific task. When invoked via slash command or auto-trigger, Claude reads the skill and applies its expertise to your context.

**Example:** `/nextjs-app` skill teaches Claude to scaffold a Next.js project with proper structure, auth, and tests.

### Prerequisites

- Familiarity with Claude Code skill format (see `CLAUDE.md`)
- Domain expertise in the skill's subject
- Access to test/verify the skill works

### Step 1: Identify the Gap

Before writing, check:

1. Does the skill already exist?
   ```bash
   npx claudient search "your-topic"
   find ./skills -name "*.md" | grep -i "keyword"
   ```

2. Is there a related skill you can enhance instead of duplicate?
   - Check the skill's "When NOT to use" section
   - Look at issue tracker for enhancement requests

3. Write a GitHub issue first
   ```
   Title: "Enhancement: Add X capability to [skill-name]"
   Description: Why this enhancement is needed, what it unlocks, example use case
   ```

### Step 2: Write the Skill

**File location:** `skills/[category]/[skill-name].md`

**Required sections** (from CLAUDE.md):

```markdown
# Skill Name

## When to activate
[Specific trigger conditions — be precise, not generic]

## When NOT to use
[Anti-patterns — when this skill is the wrong tool]

## Instructions
[The actual skill content — patterns, prompts, steps]

## Example
[At least one concrete example showing the skill in use]
```

**Quality checklist:**
- [ ] Skill name is descriptive and kebab-case
- [ ] "When to activate" is specific (not "whenever you need X"; be precise)
- [ ] "When NOT to use" identifies real anti-patterns
- [ ] Instructions are actionable (Claude can execute them step-by-step)
- [ ] Example is concrete and runnable (not abstract)
- [ ] No placeholder content or "coming soon" sections
- [ ] Tone is senior-developer-first (no hand-holding)

### Step 3: Test the Skill

1. Copy the skill file to your local `.claude/commands/` directory
   ```bash
   mkdir -p ~/.claude/commands/[category]
   cp skills/[category]/[skill-name].md ~/.claude/commands/[category]/
   ```

2. Open Claude Code and trigger the skill
   ```
   /[skill-name]
   ```
   Or reference it in a prompt:
   ```
   Use the [skill-name] skill to...
   ```

3. Verify the output matches your instructions

### Step 4: Submit via PR

```bash
git checkout -b skill/your-skill-name
git add skills/[category]/[skill-name].md
git commit -m "feat: add [skill-name] skill"
git push origin skill/your-skill-name
```

**PR description template:**
```markdown
## Skill: [Skill Name]

**Category:** [backend/devops-infra/etc.]  
**Domain:** [What problem does it solve?]  
**Related to:** [Any existing skills or issues it builds on]

### What this skill does
[1-2 sentences on the value and use case]

### Who it's for
[Which developers or roles benefit]

### Example use case
[Quick real-world example]

### Translation status
- [ ] English (complete)
- [ ] Needs translation (will be handled by community managers)
```

---

## Theme Contribution

### What Is a Theme?

A theme customizes Claude Code's UI with a color palette, fonts, and visual style. Themes live in `themes/` and are applied via `/theme [name]`.

**Example themes:** Dracula, Nord, Tokyo Night, Catppuccin, Gruvbox, Solarized, Rosé Pine, Monokai.

### Prerequisites

- Basic understanding of color theory (contrast, accessibility)
- JSON editing experience
- WCAG AA accessibility standard familiarity

### Step 1: Understand Theme Structure

Examine an existing theme:

```bash
cat themes/dracula.json
```

**Expected structure:**

```json
{
  "name": "Theme Display Name",
  "description": "Short description for marketplace",
  "colorScheme": {
    "primary": "#RRGGBB",
    "secondary": "#RRGGBB",
    "background": "#RRGGBB",
    "foreground": "#RRGGBB",
    "accent": "#RRGGBB",
    "error": "#RRGGBB",
    "warning": "#RRGGBB",
    "success": "#RRGGBB"
  },
  "fonts": {
    "monospace": "Font Name",
    "ui": "Font Name"
  },
  "metadata": {
    "author": "Your Name",
    "version": "1.0.0",
    "license": "MIT or CC-BY-SA-4.0"
  }
}
```

### Step 2: Design Your Theme

1. **Choose a color philosophy**
   - Light (high contrast, accessibility-first)
   - Dark (reduced eye strain, modern)
   - High-contrast (accessibility for low vision)

2. **Ensure WCAG AA compliance**
   - Foreground/background contrast ratio ≥ 4.5:1
   - Test with tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

3. **Define your palette** (8+ colors minimum)
   - Primary, secondary, background, foreground
   - Accent (highlights, interactive elements)
   - Error, warning, success (semantic colors)

4. **Choose monospace font**
   - System fonts: Menlo, Courier New, Consolas
   - Open-source: FiraCode, JetBrains Mono, Source Code Pro
   - Ensure file includes `@font-face` declaration if custom

### Step 3: Create the Theme File

**File location:** `themes/[theme-name].json`

```bash
# Example
cat > themes/my-theme.json << 'EOF'
{
  "name": "My Custom Theme",
  "description": "A cohesive color palette inspired by [inspiration]",
  "colorScheme": {
    "primary": "#007ACC",
    "secondary": "#6A9955",
    "background": "#1E1E1E",
    "foreground": "#D4D4D4",
    "accent": "#CE9178",
    "error": "#F48771",
    "warning": "#DCDCAA",
    "success": "#6A9955"
  },
  "fonts": {
    "monospace": "Fira Code",
    "ui": "Segoe UI"
  },
  "metadata": {
    "author": "Your Name",
    "version": "1.0.0",
    "license": "CC-BY-SA-4.0"
  }
}
EOF
```

### Step 4: Test the Theme

```bash
# Copy to local themes directory
mkdir -p ~/.claude/themes/
cp themes/my-theme.json ~/.claude/themes/

# Open Claude Code
/theme my-theme
```

Verify:
- Colors are consistent and readable
- Contrast is sufficient (especially for error/warning states)
- Monospace font renders correctly
- No visual glitches or misaligned elements

### Step 5: Document the Theme

Create a **themes/README-[theme-name].md** (optional but recommended):

```markdown
# [Theme Name] Theme

## Inspiration
[What inspired the palette? Design philosophy? Reference projects?]

## Color Palette
[Show hex values and previews]

## Accessibility
[Note WCAG compliance level, contrast ratios, who benefits]

## Font Pairing
[Monospace + UI font rationale]

## Installation
\`\`\`bash
/plugin install claudient-themes  # if via marketplace
# Or manually copy to ~/.claude/themes/
\`\`\`

## Author
[Your name and links]
```

### Step 6: Submit via PR

```bash
git checkout -b theme/my-theme
git add themes/my-theme.json [themes/README-my-theme.md]
git commit -m "feat: add [my-theme] theme"
git push origin theme/my-theme
```

**PR description template:**
```markdown
## Theme: [Theme Name]

**Inspiration:** [Design philosophy or reference]  
**Accessibility:** [WCAG level, high-contrast variant if available]  
**Author:** [Your name]

### Color Palette
[Sample colors with hex values]

### Preview
[Screenshot or color grid]

### Accessibility audit
- Foreground/background contrast: [ratio] (WCAG AA ✓/✗)
- Error color contrast: [ratio]
- All semantic colors verified: ✓

### Fonts
- Monospace: [Font Name]
- UI: [Font Name]
```

---

## CLI Command Contribution

### What Is a CLI Command?

CLI commands (skills that execute shell logic) are stored in `commands/[category]/[command-name].md` and can include embedded shell scripts or Python for automation.

**Examples:** `commit-msg`, `pr-description`, `changelog`, `write-tests`, `security-scan`

### Prerequisites

- Shell scripting (bash) or TypeScript knowledge
- Understanding of Claude Code tool invocation
- Testing and debugging skills

### Step 1: Validate the Command Necessity

Before writing, ask:

1. Is this a unique command or enhancement to existing?
   ```bash
   find commands/ -name "*.md" | xargs grep -l "your-command"
   ```

2. Can Claude already do this with a prompt?
   - If yes, consider a skill instead of a command

3. Does it need real CLI automation?
   - If yes, it belongs in `commands/`

### Step 2: Choose Implementation Pattern

**Pattern A: Prompt-based skill** (most common)
- Use for cognitive tasks: refactoring, documentation, analysis
- File: `commands/[category]/[command-name].md`
- No shell script required; Claude executes via context

**Pattern B: Shell wrapper + prompt**
- Use for environment-aware tasks: running tests, linting, deployments
- File: `commands/[category]/[command-name].sh` (wrapper) + `.md` (skill)
- Wrapper detects environment and invokes appropriate tools

**Pattern C: Standalone utility**
- Use for infrastructure: CI/CD integration, monitoring, automation
- File: `commands/[category]/[command-name].sh` (executable)
- Runs without Claude context (hook, cron, or manual trigger)

### Step 3: Write the Command

**File structure for Pattern A:**

`commands/git/commit-msg.md`
```markdown
# Commit Message Generator

## When to activate
When Claude is ready to create a git commit and needs a properly formatted message.

## When NOT to use
- For atomic work that shouldn't be committed yet
- When the commit scope is unclear or too broad

## Instructions
1. Analyze the staged changes (run `git diff --cached`)
2. Determine the type: feat, fix, refactor, docs, test, chore, perf
3. Write a concise subject line (under 50 characters)
4. Add body (if multi-line), wrapping at 72 characters
5. Reference related issues: "Fixes #123" or "Closes #456"
6. Follow conventional commits format

## Example
Input: User just staged a new authentication guard
Output:
\`\`\`
feat: add JWT validation middleware for API routes

- Extract token from Authorization header
- Validate token signature and expiration
- Return 401 if token is invalid or missing
- Add test coverage for valid and invalid tokens

Closes #89
\`\`\`
```

**File structure for Pattern B:**

`commands/testing/run-tests.sh` (wrapper)
```bash
#!/bin/bash
# Run project tests with Claude context awareness

set -e

# Detect language/framework
if [[ -f "package.json" ]]; then
    npm test
elif [[ -f "pytest.ini" ]]; then
    pytest -v
elif [[ -f "go.mod" ]]; then
    go test ./...
else
    echo "Unsupported project type"
    exit 1
fi
```

`commands/testing/run-tests.md` (skill)
```markdown
# Test Runner

## When to activate
After implementing a feature or fix, to verify tests still pass.

## Instructions
1. Execute wrapper script: `./commands/testing/run-tests.sh`
2. Parse output for failures
3. If failures detected, provide remediation steps
4. If all pass, report coverage metrics

## Example
[Example output and Claude's response]
```

### Step 4: Test the Command

```bash
# For shell commands
bash commands/testing/run-tests.sh

# For skill-based commands, invoke in Claude Code
/run-tests
```

### Step 5: Submit via PR

```bash
git checkout -b command/my-command
git add commands/[category]/[command-name].*
git commit -m "feat: add [command-name] CLI command"
git push origin command/my-command
```

**PR description:**
```markdown
## CLI Command: [Command Name]

**Category:** [git/testing/devops/etc.]  
**Type:** [prompt-based/shell-wrapper/standalone]  
**Dependencies:** [Python 3.9+, Node 18+, etc.]

### What it does
[1-2 sentence description]

### Use case
[Real-world example]

### Testing
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] Tested on Windows (if applicable)
- [ ] No external API dependencies (or documented)

### Example usage
\`\`\`
/[command-name]
[output]
\`\`\`
```

---

## Hook Contribution

### What Is a Hook?

Hooks are event-driven automations that fire at specific Claude Code lifecycle moments (before tool use, after file edit, session start, etc.) without interrupting your workflow.

**Examples:** `secret-scanner`, `tdd-guard`, `lint-check`, `test-runner`, `telegram-pr-notify`

### Prerequisites

- Bash or Python scripting
- Understanding of Claude Code events (PreToolUse, PostToolUse, SessionStart, etc.)
- Familiarity with `settings.json` configuration

### Step 1: Understand Hook Events

| Event | When it fires | Use for |
|---|---|---|
| `PreToolUse` | Before Claude runs a tool (file edit, bash command) | Secret scanning, injection detection, permission checks |
| `PostToolUse` | After tool execution completes | Linting, test running, auto-staging, notifications |
| `SessionStart` | When Claude Code session begins | Context loading, setup, keepalive |
| `SessionEnd` | When session ends | Cleanup, transcript archival, billing |
| `Stop` | When Claude's response completes | Notifications, TTS, keepalive pokes |
| `ExitPlanMode` | Exiting plan mode before execution | Plan annotation, validation |

### Step 2: Write the Hook Script

**File structure:**

`hooks/post-tool-use/[hook-name].sh`
```bash
#!/bin/bash
# Hook: Auto-lint TypeScript files after edit

# Receive context from Claude Code (as environment variables)
TOOL_NAME="$CLAUDE_TOOL"              # e.g., "bash" or "edit"
TOOL_INPUT="$CLAUDE_TOOL_INPUT"      # The tool's input JSON
OUTPUT_PATH="$CLAUDE_OUTPUT_PATH"    # Path to tool output

# Only run if a TS file was edited
if [[ ! "$TOOL_NAME" == "edit" ]] || [[ ! "$TOOL_INPUT" == *.ts* ]]; then
    exit 0
fi

# Run linter
eslint "$TOOL_INPUT" --fix

# Report result
echo "✓ Linted $TOOL_INPUT"
```

### Step 3: Create the settings.json Entry

Hooks must be registered in `.claude/settings.json`. Create a documentation file showing the exact config:

`hooks/post-tool-use/auto-lint-ts.md`
```markdown
# Auto-Lint TypeScript Hook

## What it does
Automatically runs ESLint on `.ts` files after you edit them, fixing auto-fixable issues.

## Setup

Add to `.claude/settings.json`:

\`\`\`json
{
  "hooks": {
    "post-tool-use": [
      {
        "id": "auto-lint-ts",
        "script": "~/.claude/hooks/post-tool-use/auto-lint-ts.sh",
        "disabled": false
      }
    ]
  }
}
\`\`\`

Then copy the script:
\`\`\`bash
mkdir -p ~/.claude/hooks/post-tool-use
cp hooks/post-tool-use/auto-lint-ts.sh ~/.claude/hooks/post-tool-use/
chmod +x ~/.claude/hooks/post-tool-use/auto-lint-ts.sh
\`\`\`

## When it fires
After every file edit, if the file is TypeScript.

## Configuration
- **disabled:** Set to true to temporarily disable
- **script:** Full path to the shell script (supports `~` expansion)

## Example output
\`\`\`
editing /src/utils.ts
✓ Linted /src/utils.ts (fixed 2 issues)
\`\`\`

## Troubleshooting
- **Hook doesn't run:** Verify `chmod +x` on the script
- **Slow performance:** Add early exit if file extension doesn't match
- **Not finding eslint:** Use absolute path or verify ESLint is in PATH
```

### Step 4: Test the Hook

1. Copy the script to your local hooks directory
   ```bash
   mkdir -p ~/.claude/hooks/post-tool-use
   cp hooks/post-tool-use/auto-lint-ts.sh ~/.claude/hooks/post-tool-use/
   chmod +x ~/.claude/hooks/post-tool-use/auto-lint-ts.sh
   ```

2. Add to `.claude/settings.json`
3. Edit a TypeScript file in Claude Code
4. Verify the hook runs and produces expected output

### Step 5: Submit via PR

```bash
git checkout -b hook/my-hook
git add hooks/[event]/[hook-name].sh hooks/[event]/[hook-name].md
git commit -m "feat: add [hook-name] hook"
git push origin hook/my-hook
```

**PR description:**
```markdown
## Hook: [Hook Name]

**Event:** [PreToolUse/PostToolUse/SessionStart/etc.]  
**Dependencies:** [eslint, pytest, Node 18+, etc.]  
**Use case:** [What problem does it solve?]

### What it does
[1-2 sentence description]

### When it fires
[Specific trigger condition with examples]

### Configuration
[settings.json snippet required]

### Testing
- [ ] Tested in new session
- [ ] Verified hook fires at correct event
- [ ] Verified no false positives
- [ ] No performance impact (< 500ms overhead)
```

---

## Workflow Contribution

### What Is a Workflow?

Workflows are end-to-end process documentation showing how to complete a complex task using multiple Claude Code features (skills, agents, commands, hooks).

**Examples:** RPI Feature Development, RIPER, Autonomous Loop, Bug Investigation

### Prerequisites

- Deep domain expertise
- Experience with Claude Code workflows
- Ability to document multi-step processes clearly

### Step 1: Define the Workflow

Answer these questions:

1. **What is the end goal?** (e.g., "Deploy a service to production safely")
2. **Who is the persona?** (e.g., "SRE engineer managing 50+ microservices")
3. **What are the phases?** (e.g., "Plan → Test → Deploy → Monitor → Rollback")
4. **Which skills/commands/agents are used in each phase?**
5. **What are decision points?** (e.g., "If test fails, remediate or rollback?")

### Step 2: Write the Workflow

**File location:** `workflows/[workflow-name].md`

**Structure:**

```markdown
# Workflow Name

## Purpose
One-sentence description of the end goal and who this workflow is for.

## Phases

### Phase 1: [Phase Name]
**Goal:** What happens in this phase  
**Duration:** Time estimate  
**Skills/Commands:** List relevant tools

[Step-by-step instructions]

### Phase 2: [Phase Name]
[Continue...]

## Decision Tree
[ASCII diagram or table showing decision points]

## Example
[Real-world walkthrough from start to finish]

## Troubleshooting
[Common issues and remediation]

## See Also
[Related workflows, skills, or agents]
```

### Step 3: Test the Workflow

- Follow the workflow end-to-end in Claude Code
- Verify all referenced skills exist
- Update any broken cross-references

### Step 4: Submit via PR

```bash
git checkout -b workflow/my-workflow
git add workflows/my-workflow.md
git commit -m "docs: add [my-workflow] workflow"
git push origin workflow/my-workflow
```

---

## Agent Contribution

### What Is an Agent?

Agents are specialist personas spawned in Claude Code with specific tools, models, and trigger conditions. Each agent owns a domain and acts as an expert for delegated work.

**Examples:** `sre-engineer`, `kubernetes-architect`, `security-auditor`, `cto-advisor`

### Prerequisites

- Expertise in the domain the agent will cover
- Understanding of Claude Code agent YAML format
- Ability to define precise tool scopes

### Step 1: Design the Agent

Answer:

1. **Domain:** What specific area does this agent own?
2. **Model:** Haiku (fast, simple), Sonnet (balanced), or Opus (complex reasoning)?
3. **Tools:** Which Claude Code tools should this agent have access to?
4. **Triggers:** When should Claude delegate to this agent?
5. **Example tasks:** 3-5 concrete examples of work this agent handles

### Step 2: Write the Agent Definition

**File location:** `agents/[category]/[agent-name].md`

**Structure** (from CLAUDE.md):

```markdown
# Agent Name

## Purpose
[One sentence — what domain or task this agent owns]

## Model guidance
[Haiku / Sonnet / Opus — and why]

## Tools
[Specific tool subset this agent should use — not all tools]

## When to delegate here
[Trigger conditions for spawning this agent]

## Example use case
[Concrete example]
```

**Example:**

```markdown
# SRE Engineer

## Purpose
Autonomous incident response, SLO management, and infrastructure reliability planning.

## Model guidance
**Sonnet.** Requires complex reasoning across multiple systems (logs, metrics, deployment state), rapid decision-making, and multi-step remediation. Haiku is insufficient for high-stakes incident scenarios. Opus is overkill for routine tasks.

## Tools
- Bash (for querying logs, metrics, deployment state)
- Git (for checking recent deployments)
- Read (for reviewing runbooks and incident reports)
- Web search (for known CVEs or service advisories)
- Web fetch (for checking status pages)

**Restricted from:**
- File editing (incident response should not modify production code mid-incident)
- Plugin management
- Long-running tasks (escalate to human if investigation exceeds 10 minutes)

## When to delegate here
- "I'm getting alerts from [service]. Investigate and recommend immediate actions."
- "Our error budget for [service] is at 20%. Design a burn rate alert strategy."
- "Walk me through a safe rollback plan for [service] if deployment goes wrong."
- Any incident response task where speed and system knowledge are critical.

## Example use case
**Scenario:** Production API is returning 500s after deployment.  
**User:** "We deployed 5 minutes ago. Something's wrong. Help."  
**SRE Agent:**
1. Queries logs for errors in the last 10 minutes
2. Checks recent deployments and diff
3. Compares error rate to baseline
4. Recommends either quick fix or rollback
5. Provides command to execute either option
6. Sets up post-incident review cadence
```

### Step 3: Test the Agent

- Invoke the agent in Claude Code with a representative task
- Verify it uses the intended tools correctly
- Check that decisions are sound for the domain

### Step 4: Submit via PR

```bash
git checkout -b agent/my-agent
git add agents/[category]/[agent-name].md
git commit -m "feat: add [agent-name] specialist agent"
git push origin agent/my-agent
```

---

## Community Stack (Full Stack)

For contributing a complete stack (multiple skills, commands, hooks, CLAUDE.md, and workflows), refer to:

- **community/README.md** — Overview and why to contribute
- **community/REVIEW_CHECKLIST.md** — Detailed acceptance criteria
- **community/template/stack-template/** — Boilerplate to copy and customize

**Key differences from single-skill contributions:**
- Requires a full `CLAUDE.md` with domain identity, persona, skills table, commands, hooks
- Must include 3+ skills (not a single isolated skill)
- Requires `submission.json` with author, license, category, keywords
- Goes through both automated and manual review

---

## PR Process & Review Criteria

### Before You Submit

- [ ] All files follow naming conventions (kebab-case)
- [ ] No placeholder content or "coming soon" sections
- [ ] Examples are concrete and runnable (not abstract)
- [ ] Tone is senior-developer-first (no hand-holding)
- [ ] No application code (no `src/`, `bin/`, runtime logic)
- [ ] All cross-references are valid (no 404 links)
- [ ] Markdown syntax is clean (no typos, broken formatting)

### During Review

**Automated checks (24 hours):**
- File structure and naming
- JSON/YAML syntax validation
- Markdown validity
- No malicious code

**Manual review (1-2 weeks):**
- Content completeness and accuracy
- Quality of instructions and examples
- Clarity and tone
- Alignment with project standards

### After Approval

- PR is merged to main
- Contribution is added to marketplace or plugin
- You're credited as author/contributor
- Community discussions may follow (issue tracker, Reddit, Discord)

---

## Code of Conduct

By contributing to Claudient, you agree to:

1. **Accuracy** — All claims about functionality are truthful and verifiable
2. **No malware** — Your contribution contains no hidden, malicious, or harmful code
3. **Respect** — You respect the Claudient code of conduct and community guidelines
4. **Attribution** — You credit all sources, inspiration, and prior art
5. **Maintenance** — For stacks/significant contributions, you're responsive to issues for 3+ months
6. **Community spirit** — You contribute to help others, not for self-promotion or profit

Violations may result in contribution removal and contributor suspension.

---

## FAQ

**Q: Can I contribute a theme for a commercial product?**  
A: Only if it's useful to non-customers too. Obvious advertising will be rejected. Community-centric themes welcome.

**Q: How often can I update my contribution?**  
A: As often as needed. Submit updates via PR; we'll review within 1-2 weeks. Batch updates when possible.

**Q: Can my hook modify global config files?**  
A: Not recommended. Hooks should be opt-in and transparent. If you need global config, document it clearly and require explicit user approval.

**Q: Do I need to translate my contribution?**  
A: Submit in English. Community managers may add translations (FR, DE, NL, ES) after publication. You can contribute translations in a follow-up PR.

**Q: What if I disagree with reviewer feedback?**  
A: Discuss it in the PR comment thread. We're collaborative—the goal is to improve the contribution together.

**Q: How do I handle maintenance after publication?**  
A: Monitor GitHub issues and discussions for bugs, feature requests, and feedback. Respond within 1-2 weeks. If you can't maintain long-term, transfer to a co-maintainer or request archival.

---

## Getting Help

- **GitHub Discussions** — Ask questions before starting
- **Community issues** — Open an issue for feedback on your contribution idea
- **Reddit** — [r/uitbreiden](https://www.reddit.com/r/uitbreiden/) for community tips
- **Email** — hello@uitbreiden.com for technical questions

---

## What's Next?

1. **Choose your contribution type** from the Quick Start table
2. **Read the detailed guide** for your contribution type (above)
3. **Check the file structure** in `CLAUDE.md` and existing examples
4. **Write and test** your contribution locally
5. **Submit a PR** with a clear description
6. **Respond to reviewer feedback** collaboratively
7. **Celebrate!** Your contribution is published and helps the community

---

**Last updated:** June 22, 2026  
**Maintained by:** Claudient Community Team

---

## Related Documents

- [CLAUDE.md](../CLAUDE.md) — Repository structure and file format standards
- [README.md](README.md) — Community stack overview and process
- [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) — Detailed review criteria for all contribution types
- [Skill Authoring Guide](../guides/skill-authoring.md) — Deep dive on skill design patterns
- [Plugin Authoring Guide](../guides/plugin-authoring.md) — Building marketplace plugins
