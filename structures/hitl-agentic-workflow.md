# 📂 HITL Agentic Workflow

> The canonical workspace for a Human-in-the-Loop (HITL) orchestration engine, designed to pause autonomous execution for manual human approval on high-stakes actions.

📄 `workflow-brief.md`        # Canonical brief: Defines which specific actions require human sign-off (e.g., payments, outbound emails)
🧠 `memory.md`                # Session memory: Dynamic context of the workflow leading up to the pause state
🤖 `CLAUDE.md`                # Operating rules: Strict instructions on how to format payloads for human review

## 📁 workflow-orchestrator/ (4 skills - Execution Engine)
📄 `task-router.md`           # Standard autonomous execution paths
📄 `pause-handler.md`         # Checkpointing logic • suspends agent state safely without dropping data
📄 `resume-trigger.md`        # Reactivation hook • wakes the agent once the human approval webhook is received
📄 `timeout-abort.md`         # Graceful degradation if the human doesn't respond within 24 hours

## 📁 human-approval-gateway/ (3 skills - The Interface)
📄 `approval-queue.md`        # Manages the pending tasks list for the human operator
📄 `payload-formatter.md`     # Summarizes the agent's intended action into a clean, readable diff for the human
📄 `override-protocols.md`    # Allows the human to edit the agent's proposed action before approving

## 📁 notification-engine/ (3 skills - Alerts)
📄 `slack-alerts.md`          # Pings a dedicated #agent-approvals channel with an interactive block kit
📄 `websocket-broadcaster.md` # Pushes real-time alerts to a Next.js/React frontend dashboard
📄 `escalation-router.md`     # Pings secondary operators if the primary human is offline

## 📁 state-resumption/ (3 skills - Memory Sync)
📄 `memory-rehydration.md`    # Reloads the agent's context window perfectly upon reactivation
📄 `redis-state-lock.md`      # Distributed lock preventing duplicate approvals on the same task
📄 `context-pruner.md`        # Cleans up unnecessary tokens before restarting the run

## 📁 audit-logs/ (Immutable Records)
📄 `decision-ledger.log`      # Tracks exactly which human approved which agent action and when
📄 `rejection-analyzer.md`    # Collects data on *why* humans reject actions to improve the agent later

---
**Configuration Files**
⚙️ `temporal-config.yaml`     # Configuration for Temporal.io or similar stateful workflow engines
📦 `package.json`             # Webhook listeners and Slack SDK dependencies

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
