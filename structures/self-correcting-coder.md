# 📂 Self-Correcting Coder
> The canonical workspace for an autonomous code generation loop that writes, tests, and iteratively fixes its own code before syncing to production.

📄 `loop-architecture-brief.md` # Canonical brief: Defines the acceptable failure threshold and maximum iteration depth
🧠 `memory.md`                  # Session memory: Dynamic context tracking for the active compilation loop
🤖 `CLAUDE.md`                  # Operating rules: Strict instructions for interpreting stack traces instead of guessing

## 📁 generation-engine/ (4 skills - Initial Code Creation)
📄 `spec-analyzer.md`           # Parses PR requirements • identifies necessary dependencies
📄 `scaffolding-builder.md`     # Creates the boilerplate structure based on the tech stack
📄 `logic-writer.md`            # Core execution • drafts the initial functional logic
📄 `docstring-generator.md`     # Automatically documents inline logic and parameter types

## 📁 execution-sandbox/ (3 skills - Isolated Testing)
📄 `local-runner.md`            # Safe execution environment • prevents destructive host commands
📄 `test-matrix.md`             # Maps generated code to required unit and integration tests
📄 `timeout-guard.md`           # Kills infinite loops or hanging execution threads

## 📁 feedback-evaluator/ (4 skills - The "Self-Correction")
📄 `linter-parser.md`           # Ingests ESLint/Ruff outputs • maps syntax errors to specific lines
📄 `stack-trace-analyzer.md`    # Reads runtime failure logs • isolates the exact point of failure
📄 `diff-proposer.md`           # Generates atomic, surgical code changes instead of rewriting the whole file
📄 `iteration-limiter.md`       # Hard cap on retry attempts (e.g., max 5 loops) before human escalation

## 📁 deployment-sync/ (3 skills - Handoff)
📄 `format-enforcer.md`         # Final Prettier/Black formatting pass
📄 `coverage-validator.md`      # Ensures the final code meets the 85%+ test coverage threshold
📄 `github-final-sync.md`       # Automated commit and PR creation to your Github final repos

---
**Configuration Files**
⚙️ `tox.ini`                    # Standardized testing environment configurations
📦 `pyproject.toml`             # Core project dependencies and build system requirements

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
