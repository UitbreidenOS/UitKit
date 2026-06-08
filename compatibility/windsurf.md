# Claudient × Windsurf

> How to use Claudient content in Windsurf's Cascade AI.

Windsurf (by Codeium) is an AI coding editor that brings agentic workflows to the IDE. While Windsurf doesn't natively support Claude Code's skill system or plugin marketplace, its core features—Cascade workflows, custom rules, and system prompts—allow you to adapt Claudient's entire knowledge base into Windsurf's environment.

This guide shows you exactly how to port Claudient skills, agents, rules, and project context into Windsurf.

---

## What works natively

Windsurf has native support for:

- **Cascade workflows** — Multi-step agentic processes (equivalent to Claude Code agents)
- **`.windsurfrules` file** — Project-specific rules and guidelines (equivalent to CLAUDE.md)
- **System prompts** — Custom instructions for Cascade (equivalent to agent prompts)
- **Chat-based skill invocation** — Ask Windsurf to follow a skill's instructions in natural language
- **File and folder context** — Windsurf can read project files and apply rules automatically

Windsurf's memory system (`~/.codeium/windsurf/memories/`) stores persistent instructions across sessions, similar to Claude Code's hooks.

---

## What needs adaptation

Claudient features that require translation to Windsurf equivalents:

| Claudient | Windsurf equivalent | Adaptation effort |
|---|---|---|
| Skills (as `.md` with frontmatter) | Cascade workflows or chat prompts | Low — extract Instructions section |
| Agents (subagent YAML/MD) | Cascade system prompt or custom workflow | Medium — convert to Cascade syntax |
| Rules (guidelines markdown) | `.windsurfrules` entries | Low — copy rule content directly |
| Hooks (event-driven automation) | Cascade workflows triggered by file events | High — requires workflow design |
| CLAUDE.md project context | `.windsurfrules` with context section | Low — strip Claude Code references |
| Personas (system prompts) | Cascade system instruction | Low — rename and apply |
| Plugin marketplace | Manual installation or Cascade library | N/A — Windsurf has no marketplace |

---

## Installation

### Prerequisites

- **Windsurf 1.8.0+** with Cascade AI enabled
- `~/.codeium/windsurf/` directory (auto-created on first Windsurf launch)
- A Claudient project with skills, agents, and rules directories

### Step 1: Copy rules into `.windsurfrules`

Windsurf reads project-level rules from a `.windsurfrules` file in your project root.

```bash
cat > .windsurfrules << 'EOF'
# Project Rules for Windsurf Cascade

## Code Style
- Variables and functions: camelCase (JS/TS), snake_case (Python)
- Classes and types: PascalCase in all languages
- Boolean variables: prefix with is, has, can, should
- No abbreviations unless universally known (id, url, db, ctx)

## Functions
- One responsibility per function
- Maximum 40 lines per function
- Return early for guard clauses
- No boolean parameters—use options objects instead

## Comments
- Write only when the WHY is non-obvious
- Never describe what the code does (the code already does that)
- Write when: hidden constraint, workaround for a bug, or surprising behavior

## Error Handling
- Never swallow errors silently
- Always handle at the boundary where you can take action
- Propagate errors upward with context

## File Organization
- One primary export per file
- File names match their primary export
- No barrel files (index.ts re-exports)
- Group imports: external, then internal, then relative

EOF
```

### Step 2: Store Cascade instructions in Windsurf memories

Windsurf's memory system persists instructions across sessions. Copy agent definitions or complex skills here:

```bash
mkdir -p ~/.codeium/windsurf/memories/

# Example: Architecture Advisor persona
cat > ~/.codeium/windsurf/memories/architect-advisor.md << 'EOF'
# Architect Advisor Persona

You are an architecture advisor. Do not write implementation code.

When evaluating architectural decisions:
1. Understand the problem: what decision is being made?
2. Gather context: stack, scale, team, constraints
3. Enumerate options: list 2-3 specific approaches
4. Analyze each: advantages, disadvantages, reversibility
5. Recommend: pick one with clear rationale

For each option, cover:
- How it works in this context
- Advantages specific to our constraints
- Disadvantages and risks
- Cost to reverse this decision later

Always end with: your recommendation, one-sentence rationale, and what to record in an ADR.
EOF
```

---

## Adaptation Guide

### Skills → Windsurf Rules / `.windsurfrules`

Claudient skills are markdown files with a standardized structure. Windsurf doesn't have a "skill" equivalent, but you can:

1. **As `.windsurfrules` entries** — For short, always-apply guidelines (e.g., coding style, naming conventions)
2. **As Cascade workflows** — For multi-step processes that need branching logic
3. **As chat prompts** — For one-off invocations via Windsurf's chat interface

#### Example: Adapting the "adr-writer" skill

**Original Claudient skill** (`skills/productivity/adr-writer.md`):

```markdown
# ADR Writer

## When to activate
- Making a decision between technical approaches
- After a verbal decision needs formal documentation
- Before a hard-to-reverse architectural change

## When NOT to use
- Implementation details (variable naming, folder structure)
- Purely stylistic decisions with no trade-offs

## Instructions

A decision warrants an ADR if:
1. It is hard to reverse
2. It would be surprising without context
3. A real trade-off existed

ADR format (Nygard):
# ADR-[NNNN]: [Short Title]
**Date:** [YYYY-MM-DD]
**Status:** [Accepted | Superseded | Deprecated]
...
```

**Adapted for Windsurf `.windsurfrules`:**

```
# ADR Writer Rule

When proposing an architectural decision:
1. Check if all three are true:
   - It is hard to reverse (significant effort or downstream impact)
   - It would be surprising without context (a new dev would wonder why)
   - A real trade-off existed (plausible alternative was considered and rejected)
2. If yes, create an ADR with this format:

   # ADR-[NNNN]: [Short Title in Noun Phrase]
   **Date:** [YYYY-MM-DD]
   **Status:** [Accepted | Superseded by ADR-NNNN | Deprecated]
   
   ## Context
   [2-4 sentences: what situation forced this decision?]
   
   ## Decision
   [One sentence, active voice, present tense.]
   
   ## Consequences
   [Positive and negative outcomes of this choice.]

3. Commit ADR to `docs/adr/` with filename `adr-NNNN.md`
```

**Using in Windsurf:**

- Add this rule to `.windsurfrules`
- When you need to document a decision, invoke Cascade:
  ```
  /cascade
  I need to document an architectural decision about [topic].
  Use the ADR Writer rule to structure this.
  ```

#### Example: Complex skill as a Cascade workflow

For skills with multiple steps, create a Cascade workflow. Create a file `.windsurf/cascades/code-review.yaml`:

```yaml
name: code-review
description: Review code for bugs, reuse, simplification, and efficiency
author: Claudient
version: 1.0

steps:
  - id: gather-diff
    action: git_diff
    description: Gather the current diff
    
  - id: analyze-bugs
    action: analyze
    prompt: |
      Review this diff for correctness bugs:
      - Logic errors and edge cases
      - Type mismatches and null safety issues
      - Off-by-one errors and boundary conditions
      - Unhandled error cases
      
      Diff:
      {{git_diff}}
    
  - id: analyze-reuse
    action: analyze
    prompt: |
      Review this diff for reuse opportunities:
      - DRY (Don't Repeat Yourself) violations
      - Duplicate patterns that should be extracted
      - Missing abstractions
      
      Diff:
      {{git_diff}}
    
  - id: analyze-simplification
    action: analyze
    prompt: |
      Review this diff for unnecessary complexity:
      - Over-engineering for future scenarios
      - Redundant code that could be removed
      - Clearer ways to express the logic
      
      Diff:
      {{git_diff}}
    
  - id: summarize
    action: combine_results
    prompt: |
      Summarize the code review findings in a concise format.
      Group by category: bugs, reuse, simplification, efficiency.
      Provide specific line references and actionable suggestions.
      
      Bugs: {{analyze_bugs}}
      Reuse: {{analyze_reuse}}
      Simplification: {{analyze_simplification}}
```

Invoke with: `/cascade --workflow code-review`

### Agents → Cascade system prompt

Claudient agents are subagents that own a specific domain. In Windsurf, map agents to Cascade system prompts.

#### Example: Architect Agent

**Original Claudient agent** (`agents/core/architect.md`):

```markdown
# Architect Agent

## Purpose
Evaluates architectural options for a system design problem, considers trade-offs, and recommends a specific approach with justification.

## Model guidance
**Opus 4.7** — architectural decisions are high-stakes, hard-to-reverse, and require genuine reasoning over complex trade-offs.

## Tools
- Read — read existing architecture files, CLAUDE.md, ADRs
- Bash (read-only: find, grep) — explore existing patterns
- WebFetch — check documentation

## When to delegate here
- Choosing between fundamentally different approaches
- A decision that will be expensive to reverse
- Evaluating whether to build vs. buy a component
- Reviewing an existing architecture

## Prompt template
You are an architecture advisor. Do not write implementation code.
...
```

**Adapted for Windsurf Cascade:**

1. Create `.windsurf/personas/architect.md`:

```markdown
# Architect Advisor

You are an architecture advisor. Do not write implementation code.

**Your role:**
- Evaluate architectural options for system design problems
- Consider trade-offs between approaches
- Recommend a specific approach with clear justification
- Review existing architectures for scalability and maintainability

**You should:**
- Read existing architecture files, CLAUDE.md, ADRs, and design docs
- Explore the codebase to understand existing patterns and dependencies
- Check documentation for specific technologies under consideration
- Ask clarifying questions about scale, team expertise, and constraints

**You should NOT:**
- Write implementation code
- Make decisions that are already decided
- Optimize existing code (that's not architectural)
- Make implementation-level technology choices

**For each architectural option, cover:**
1. How it works in this specific context
2. Advantages specific to our constraints
3. Disadvantages and risks
4. Cost to reverse this decision later
5. Recommendation with one-sentence rationale

**End with:**
What should be recorded in an ADR about this decision?
```

2. Invoke with Cascade:
   ```
   /cascade --persona architect
   I need to evaluate between [option A] and [option B] for [our system].
   Current stack: [describe stack, scale, team, constraints]
   ```

### Rules → `.windsurfrules`

Claudient rules are always-follow guidelines. Copy them directly into `.windsurfrules`:

**Example from `rules/common/coding-style.md`:**

```bash
cat >> .windsurfrules << 'EOF'

## Naming Conventions
- Variables and functions: camelCase (JS/TS), snake_case (Python, Go, Rust)
- Classes and types: PascalCase in all languages
- Constants: SCREAMING_SNAKE_CASE only for true constants that never change
- Boolean variables: prefix with is, has, can, should (isActive, hasPermission)
- Do not abbreviate names unless universally known (id, url, db, ctx)

## Function Design
- One responsibility per function—if you need "and" in the description, split it
- Maximum 40 lines per function; if longer, extract sub-functions
- No boolean parameters—use an options object or two separate functions
- Return early for guard clauses—don't nest happy path inside conditionals

## Comments
- Write no comments unless the WHY is non-obvious
- Never write comments that describe what the code does (the code already does that)
- Write a comment when: there is a hidden constraint, a workaround for a specific bug, or behavior that would surprise a reader
- Never write TODO comments—create a tracked issue instead

## Error Handling
- Never swallow errors silently (catch (e) {} is always wrong)
- Always handle errors at the boundary where you can take action
- Propagate errors upward with context—wrap with the relevant ID or operation name
- Do not use console.error in production code—use the project's logger

## File Organization
- One primary export per file
- File names match their primary export (UserService.ts exports UserService)
- No barrel files (index.ts re-exports)—import directly from the source file
- Group imports: external packages first, then internal modules, then relative imports

EOF
```

### CLAUDE.md examples → `.windsurfrules` context

If your project has a CLAUDE.md, extract the context section and add it to `.windsurfrules`:

**Original CLAUDE.md section:**

```markdown
## Project Context

This is a B2B SaaS API built with FastAPI and PostgreSQL.
- Tech stack: Python 3.11, FastAPI, SQLAlchemy ORM, PostgreSQL
- Team: 3 backend engineers, 1 DevOps
- Scale: ~10k API calls/day, <1s response time SLA
- Key constraints: GDPR compliance, data residency in EU, no external APIs

## Architectural decisions
- Monolithic API with future microservices plan (see ADR-0001)
- PostgreSQL with read replicas for scale (see ADR-0002)
- Event-driven worker queue (Celery + Redis) for async tasks
```

**Adapted for `.windsurfrules`:**

```bash
cat >> .windsurfrules << 'EOF'

## Project Context

**Tech Stack:** Python 3.11, FastAPI, SQLAlchemy ORM, PostgreSQL
**Team:** 3 backend engineers, 1 DevOps engineer
**Scale:** ~10k API calls/day, <1s response time SLA
**Key Constraints:** GDPR compliance, data residency in EU, no external APIs

### Architecture
- Monolithic API with future microservices plan (see ADR-0001)
- PostgreSQL with read replicas for horizontal scale (see ADR-0002)
- Event-driven worker queue (Celery + Redis) for async tasks

### Relevant ADRs
- ADR-0001: Monolith-first architecture with service extraction path
- ADR-0002: Master-read replica topology for PostgreSQL

EOF
```

---

## Compatibility matrix

This matrix shows which Claudient content types work in Windsurf and how much adaptation is required:

| Claudient content | Windsurf equivalent | Adaptation effort | Notes |
|---|---|---|---|
| Skills (productivity, backend, etc.) | Cascade workflows or `.windsurfrules` | Low | Extract core prompt; may need workflow YAML |
| Agents (core, advisors, roles) | Cascade persona or system prompt | Medium | Convert to Cascade YAML or persona markdown |
| Rules (common, language-specific) | `.windsurfrules` file entries | Low | Copy rule content directly, no CLI references |
| Hooks (pre-commit, post-test) | Cascade workflows with file triggers | High | Requires Cascade workflow design |
| CLAUDE.md project context | `.windsurfrules` context section | Low | Strip Claude Code references |
| Personas (system prompts) | `.windsurf/personas/*.md` or Cascade | Low | Rename and apply as Cascade persona |
| MCP configurations | `.windsurf/mcp.json` | Low | Format varies; check Windsurf MCP docs |
| Commands (slash definitions) | Cascade workflows or chat invocation | Low | Reframe as workflow or natural language prompt |
| Keybindings | `.windsurf/keybindings.json` | Medium | Windsurf uses different keybinding format |
| Output styles | N/A | N/A | Windsurf has no equivalent |
| Themes | N/A | N/A | Windsurf has no custom theme system |

---

## Quick install

This bash script copies Claudient rules and context into a Windsurf project:

```bash
#!/bin/bash
# install-windsurf-rules.sh
# Copies Claudient rules into .windsurfrules for the current project

set -e

CLAUDIENT_PATH="${1:-.}"
RULES_DIR="$CLAUDIENT_PATH/rules/common"

if [ ! -d "$RULES_DIR" ]; then
  echo "Error: Claudient rules directory not found at $RULES_DIR"
  exit 1
fi

# Create .windsurfrules from scratch
cat > .windsurfrules << 'EOF'
# Windsurf Rules for Cascade AI
# Auto-generated from Claudient project

## Core Guidelines

Always follow these rules in your code, documentation, and recommendations.

EOF

# Append each rule file
for rule_file in "$RULES_DIR"/*.md; do
  if [ -f "$rule_file" ]; then
    rule_name=$(basename "$rule_file" .md)
    echo "" >> .windsurfrules
    echo "## $rule_name" >> .windsurfrules
    # Extract content after the title/header
    tail -n +2 "$rule_file" | grep -v "Work with us:" | sed 's/^> .*//' >> .windsurfrules
  fi
done

echo ".windsurfrules created successfully"
echo ""
echo "Next steps:"
echo "1. Review .windsurfrules for accuracy"
echo "2. Add project context section (team, tech stack, constraints)"
echo "3. Commit to your repository"
echo "4. Windsurf will load rules automatically on next session"
```

Usage:

```bash
chmod +x install-windsurf-rules.sh
./install-windsurf-rules.sh /path/to/claudient
```

### Alternative: Manual setup

If you prefer to set up Windsurf rules manually:

1. **Copy rules into `.windsurfrules`:**
   ```bash
   cp /path/to/claudient/rules/common/*.md .windsurfrules
   ```

2. **Create Cascade personas directory:**
   ```bash
   mkdir -p .windsurf/personas/
   cp /path/to/claudient/agents/core/*.md .windsurf/personas/
   ```

3. **Verify Windsurf loads the rules:**
   - Restart Windsurf
   - Open a file and check that Cascade suggestions reference your rules

---

## Invoking Claudient content in Windsurf

### Chat-based skill invocation

For simple skills, ask Cascade in natural language:

```
I need to review this PR for code quality issues. 
Use the code-review skill guidelines:
- Look for logic errors and edge cases
- Find reuse opportunities and DRY violations
- Suggest simplifications
- Flag performance improvements
```

### Cascade workflows for complex skills

For multi-step processes, use Cascade workflows:

```
/cascade --workflow code-review
```

### Using personas for domain expertise

Invoke a persona for domain-specific advice:

```
/cascade --persona architect
I need to evaluate between storing this data in PostgreSQL vs. Redis.
Current context: [describe your system]
```

### Rule-based recommendations

Windsurf automatically applies `.windsurfrules` when:
- You write code (style violations are flagged)
- You ask for a review or suggestion
- You generate documentation

No explicit invocation needed—Cascade reads and applies rules automatically.

---

## Troubleshooting

### Windsurf isn't loading `.windsurfrules`

1. Verify the file exists in your project root: `ls -la .windsurfrules`
2. Restart Windsurf completely (quit and reopen)
3. Check Windsurf's status bar for rule loading messages
4. Ensure `.windsurfrules` is valid Markdown (no syntax errors)

### Cascade isn't using my persona

1. Verify the persona file exists: `ls -la .windsurf/personas/*.md`
2. Use the exact filename in the Cascade command: `/cascade --persona filename-without-extension`
3. Restart Windsurf to reload persona definitions

### MCP tools aren't available in Cascade

1. Check MCP configuration: `cat ~/.codeium/windsurf/mcp.json`
2. Verify MCP servers are installed and running
3. Restart Windsurf and try again

---

## Examples

### Example 1: Adapting a backend skill

**Claudient skill:** `skills/backend/python/fastapi-crud.md`

**Steps:**
1. Extract the Instructions section
2. Create a Cascade workflow in `.windsurf/cascades/fastapi-crud.yaml`
3. Include model, endpoint design, error handling, and testing steps
4. Invoke with `/cascade --workflow fastapi-crud`

### Example 2: Using an agent for architectural decisions

**Claudient agent:** `agents/core/architect.md`

**Steps:**
1. Copy the agent's prompt template to `.windsurf/personas/architect.md`
2. In your project, invoke Cascade: `/cascade --persona architect`
3. Describe your architectural problem and constraints
4. Cascade will evaluate options and recommend one

### Example 3: Enforcing project rules

**Claudient rules:** `rules/common/coding-style.md`, `rules/common/error-handling.md`

**Steps:**
1. Append all rule files to `.windsurfrules`
2. Add a project context section (team, stack, constraints)
3. Commit `.windsurfrules` to your repository
4. Cascade automatically references these rules in code suggestions

---

## Resources

- [Windsurf documentation](https://windsurf.dev/docs)
- [Cascade AI workflows](https://windsurf.dev/docs/cascade)
- [Codeium memory system](https://codeium.com/docs/windsurf/memories)
- [Claudient skills library](https://github.com/claudient/claudient)
- [Claudient agents](https://github.com/claudient/claudient/tree/main/agents)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
