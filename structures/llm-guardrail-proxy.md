# 📂 LLM Guardrail Proxy
> The canonical workspace for an enterprise-grade LLM proxy that intercepts, caches, and audits all outbound AI API calls to prevent runaway token costs and enforce security.

📄 `proxy-architecture-brief.md` # Canonical brief: Defines the global token limits, semantic cache thresholds, and routing rules
🧠 `memory.md`                   # Session memory: Dynamic context tracking for current proxy latency and active spikes
🤖 `CLAUDE.md`                   # Operating rules: Strict instructions on how to handle API timeouts and fallback logic

## 📁 traffic-interceptor/ (4 skills - The Gateway)
📄 `request-validator.md`        # Rejects malformed payloads before they reach the LLM API
📄 `rate-limiter.md`             # Enforces tokens-per-minute (TPM) limits per user or tenant ID
📄 `pii-redactor.md`             # Scrubs sensitive data (SSNs, emails) from prompts before egress
📄 `prompt-injection-guard.md`   # Heuristic checks to block adversarial jailbreak attempts

## 📁 cost-optimization/ (3 skills - Token Management)
📄 `semantic-cache.md`           # Redis-backed vector search • serves cached answers for similar queries without hitting the LLM
📄 `context-compressor.md`       # Automatically summarizes or truncates excessively long message histories
📄 `model-downgrader.md`         # Dynamically routes simple queries to Claude 3.5 Haiku to save costs, reserving Sonnet for complex reasoning

## 📁 observability-engine/ (4 skills - Analytics)
📄 `token-ledger.md`             # High-precision accounting of prompt vs. completion tokens per tenant
📄 `latency-tracker.md`          # Monitors Time-to-First-Token (TTFT) and total generation time
📄 `error-classifier.md`         # Groups API failures (e.g., 429 Too Many Requests vs 500 Internal Server Error)
📄 `github-final-sync.md`        # Automated commits of daily compliance logs and proxy configurations to Github final repos

## 📁 fallback-orchestrator/ (3 skills - High Availability)
📄 `circuit-breaker.md`          # Temporarily halts traffic to a specific LLM provider if failure rates spike
📄 `cross-region-router.md`      # Fails over to different AWS Bedrock regions to bypass local outages
📄 `retry-jitter.md`             # Exponential backoff algorithms for handling rate limits smoothly

## 📁 evals/ (3 skills - Proxy Benchmarking)
📄 `cache-hit-ratio.md`          # Evaluates how much money the semantic cache is actually saving
📄 `redaction-accuracy.md`       # Audits the PII redactor against dummy sensitive payloads
📄 `overhead-latency.md`         # Ensures the proxy itself isn't adding more than 50ms of delay

---
**Configuration Files**
⚙️ `envoy.yaml`                  # Edge proxy configurations for routing high-throughput traffic
📦 `go.mod`                      # Go dependencies for ultra-fast concurrent request handling

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
