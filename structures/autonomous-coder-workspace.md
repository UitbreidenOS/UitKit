# 📂 Autonomous Coder Workspace
> The canonical workspace for running an overnight autonomous coding agent in a strictly isolated execution environment.

📄 `project-brief.md`      # Canonical brief: Current sprint tickets and overnight PR goals
🧠 `memory.md`             # Session memory: Dynamic context for the active coding session
🤖 `CLAUDE.md`             # Operating rules: Strict instructions for the overnight run (YOLO mode allowed within sandbox)

## 📁 .docker-sandbox/ (5 skills - Isolation & Security)
📄 `sandbox-config.yaml`   # MicroVM definition • CPU/RAM limits for the container
📄 `network-policy.md`     # Egress rules • explicit allowlist for package managers (npm, pip)
📄 `credential-proxy.md`   # Secret injection • MITM proxy to keep host keys off the agent VM
📄 `mounts.yaml`           # Volume binds • strictly scoped to the `target-repo/` path
📄 `lifecycle-hooks.sh`    # Ephemeral teardown • auto-destroy container on failure

## 📁 target-repo/ (The Target Codebase)
📄 `docker-compose.yml`    # The application environment the agent uses to test its own code
📄 `package.json`          # Agent is allowed to manage dependencies via its isolated daemon

## 📁 validation-suite/ (4 skills - Unattended Testing)
📄 `matrix-runner.md`      # E2E test execution instructions
📄 `lint-fixer.md`         # Auto-formatting rules before committing
📄 `coverage-check.sh`     # Minimum coverage thresholds (e.g., 80%) required for PR approval
📄 `sandbox-tests.md`      # Validates the agent cannot escape the container during execution

## 📁 ops-automation/ (4 skills - CI/CD & Handoff)
📄 `git-manager.md`        # Scoped credential git pushes via secure proxy
📄 `commit-validator.md`   # Semantic commit enforcement (feat:, fix:, chore:)
📄 `pr-generator.md`       # Automated GitHub PR description writing
📄 `slack-webhook.md`      # Morning summary notification on pipeline success or failure

## 📁 audit-logs/ (Immutable Records)
📄 `shell-history.log`     # Immutable record of every bash command the agent executed
📄 `network-events.log`    # All external API calls intercepted by the proxy

---
**Configuration Files**
⚙️ `Makefile`              # `make run-overnight` (triggers sandbox build and agent kickoff)
📦 `agent-config.toml`     # LLM routing and token limit configurations

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
