# 📂 Hierarchical Agent Team
> The canonical workspace for a Supervisor-Worker agent architecture, where a manager LLM delegates sub-tasks to specialized worker nodes and synthesizes their outputs.

📄 `team-charter-brief.md`    # Canonical brief: Overarching goal of the team and definition of done
🧠 `global-memory.md`         # Session memory: Shared whiteboard for the supervisor to track overall progress
🤖 `CLAUDE.md`                # Operating rules: Strict instructions for the supervisor to avoid doing the work itself

## 📁 supervisor-node/ (5 skills - The Manager)
📄 `task-decomposer.md`       # Breaks down complex user requests into atomic, independent sub-tasks
📄 `worker-router.md`         # Maps sub-tasks to the correct specialized worker persona
📄 `dependency-grapher.md`    # Determines execution order (e.g., Data Analyst must finish before Report Writer starts)
📄 `quality-reviewer.md`      # Evaluates worker outputs against the initial prompt criteria
📄 `synthesis-engine.md`      # Combines approved worker outputs into a single cohesive final response

## 📁 specialized-workers/ (4 agent personas - The Team)
📄 `researcher-agent.md`      # Deep search capability • web scraping and RAG querying
📄 `analyst-agent.md`         # Data processing • Python/Pandas execution sandbox
📄 `writer-agent.md`          # Content formatting • enforces tone and brand guidelines
📄 `qa-tester-agent.md`       # Code or logic validation • tries to break the other workers' outputs

## 📁 communication-bus/ (3 skills - Message Passing)
📄 `message-broker.md`        # Handles asynchronous JSON payloads between supervisor and workers
📄 `context-culling.md`       # Prevents sending the entire global memory to a worker • sends only relevant scope
📄 `escalation-protocol.md`   # How a worker flags the supervisor if a task is impossible or blocked

## 📁 state-management/ (3 skills - Checkpointing)
📄 `redis-task-queue.md`      # Tracks pending, in-progress, and completed sub-tasks
📄 `dead-letter-queue.md`     # Captures failed worker executions for human review or supervisor retry
📄 `github-final-sync.md`     # Automated commits of the final synthesized output to Github final repos

## 📁 team-evals/ (3 skills - Performance Metrics)
📄 `delegation-accuracy.md`   # Did the supervisor choose the right worker for the job?
📄 `worker-latency.md`        # Tracks how long each persona takes to return a payload
📄 `token-spend-tracker.md`   # Aggregates LLM API costs across the entire hierarchy

---
**Configuration Files**
⚙️ `langgraph-config.yaml`    # Graph state definition mapping the nodes (supervisor) and edges (workers)
📦 `pyproject.toml`           # Python dependencies and build requirements

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
