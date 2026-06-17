---
name: "sonar"
description: "Claude Code sonar codebase cartographer: workflow guidelines, best practices, instructions, and integration examples"
---

# Sonar Codebase Cartographer

## When to activate
Activate when navigating a massive, unfamiliar, or legacy codebase (especially Enterprise monoliths) where reading entire files would quickly exhaust the token context limit. Invoked via `/sonar`.

## When NOT to use
Do not use in very small projects (under 20 files), or when you already know exactly where the code you need to edit is located.

## Instructions
1. When invoked, your goal is to create a highly condensed "satellite map" of the entire repository containing only the architectural skeletons (Classes, Functions, Structs, and Exports) without the implementation bodies.
2. Use the `Bash` tool to run extreme filtering commands. For example:
   - For TypeScript/JavaScript: `grep -rE '^(export )?(class|const|function|let) .*=' src/ | grep -v node_modules`
   - For Python: `grep -rE '^(class|def) ' . | grep -v env`
   - For Go: `grep -rE '^(func|type) ' . | grep -v vendor`
   *(Adapt the regex or use tools like `ripgrep` or `ctags` if available on the user's system to get better AST-level extractions).*
3. Synthesize the raw output into a clean, hierarchical markdown file.
4. Save this file to the project root as `CODEBASE_MAP.md`.
5. Instruct the user: "I have mapped the codebase. From now on, I will consult `CODEBASE_MAP.md` first to locate functions before attempting to read massive files, saving you thousands of tokens."

## Example
User: `/sonar`
Claude: Running Sonar mapping... 
[Executes grep commands, parsing thousands of files into just their signatures]
[Writes CODEBASE_MAP.md]
I have mapped 4,500 files into a 300-line map. I can now navigate your enterprise monolith without blowing up our context window!