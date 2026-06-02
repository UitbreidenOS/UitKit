# 📂 Local-First Agentic Sandbox

> The canonical workspace for running an entirely offline, air-gapped autonomous agent utilizing local open-weights models (Ollama/Qwen/Llama 3).

📄 `offline-brief.md`         # Canonical brief: System architecture for zero-latency, local-only execution
🧠 `memory.md`                # Session memory: Dynamic context tracking for the active local agent session
🤖 `CLAUDE.md`                # Operating rules: Strict instructions to bypass external API fallbacks

## 📁 model-orchestration/ (4 skills - Local LLM Engine)
📄 `ollama-router.md`         # Model multiplexer • routes complex logic to Qwen-72B and simple tasks to Llama-3-8B
📄 `modelfile-manager.md`     # Dynamic system prompt injection for local GGUF models
📄 `vram-allocator.md`        # GPU memory monitoring • prevents out-of-memory (OOM) crashes on local hardware
📄 `fallback-handler.md`      # Model quantization downgrades (e.g., Q8 to Q4) if memory spikes

## 📁 local-tools/ (5 skills - Offline Execution)
📄 `file-system-editor.md`    # Scoped CRUD operations for local directories
📄 `local-bash-runner.md`     # Shell execution engine isolated within the host OS
📄 `sqlite-manager.md`        # Direct queries to local lightweight databases without network overhead
📄 `offline-linter.md`        # Code validation using purely local static analysis tools
📄 `local-rag-search.md`      # BM25 keyword + local dense vector search

## 📁 memory-store/ (3 skills - Persistent State)
📄 `chromadb-manager.md`      # Ephemeral and persistent vector storage running strictly on localhost
📄 `sqlite-state-tracker.md`  # Transactional log of all agent steps for pause/resume capabilities
📄 `context-pruner.md`        # Sliding window token management tailored to local model limits (e.g., 8k context)

## 📁 security-boundaries/ (3 skills - Host Protection)
📄 `chroot-jail.md`           # Directory confinement ensuring the agent cannot access `~/.ssh` or system roots
📄 `network-blocker.md`       # Firewall rules enforcing strict zero-egress policies
📄 `resource-limits.md`       # Cgroups configuration to throttle max CPU/RAM usage by the agent process

## 📁 evals/ (3 skills - Local Benchmarking)
📄 `inference-speed.md`       # Tracks tokens-per-second (TPS) on local hardware
📄 `tool-accuracy.md`         # Ground-truth comparison for local bash and SQLite outputs
📄 `hardware-thermals.md`     # Monitors system temperatures to pause inference if hardware overheats

---
**Configuration Files**
⚙️ `Modelfile`                # Custom Ollama instructions and parameter settings (temperature, top_k)
⚙️ `docker-compose.local.yml` # Standalone local stack for ChromaDB, UI, and model serving

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
