---
name: build-skill
description: "Claude Code skill builder wizard: workflow guidelines, best practices, instructions, and integration examples"
updated: 2026-06-17
---

# Skill Builder Wizard

## When to activate
Activate when the user says they want to create a new custom skill for their specific workflow, or when they invoke `/build-skill`.

## When NOT to use
Do not use if the user just wants to run an existing skill, or if they are asking you to write normal application code.

## Instructions
1. You are acting as an interactive wizard to help the user build a new Claude Code skill.
2. Follow these steps sequentially. Do not skip steps. Ask the user one question at a time.
    *   **Step 1: The Goal.** Ask: "What repetitive task or workflow do you want to turn into a skill? (e.g., 'Generate a Redux slice' or 'Review code for OWASP vulnerabilities')." Wait for their response.
    *   **Step 2: The Name.** Suggest a `kebab-case.md` file name based on their goal (e.g., `redux-slice-generator.md`) and ask if they approve.
    *   **Step 3: The Rules.** Ask: "What specific rules, conventions, or 'gotchas' should I know about when performing this task in the future? (e.g., 'Always use TypeScript interfaces, never types')." Wait for their response.
    *   **Step 4: The Example.** Ask: "Can you provide a small example of what the final output should look like, or should I try to generate one based on our conversation?"
3. Once you have gathered all the information, synthesize it into the strict Claudient markdown skill format.
4. **Required Format:**
    ```markdown
    # [Skill Name]

    ## When to activate
    [When to use this skill, including the /slash-command]

    ## When NOT to use
    [Anti-patterns]

    ## Instructions
    [The step-by-step instructions and rules gathered from the user]

    ## Example
    [The example output]
    ```
5. Use the `WriteFile` tool to save the generated skill file into the `.claude/commands/` directory of the current project (or `skills/productivity/` if instructed by the user).
6. Inform the user that their skill is ready to use!

## Example
User: `/build-skill`
Claude: Let's build a new skill! **Step 1:** What repetitive task or workflow do you want to turn into a skill?