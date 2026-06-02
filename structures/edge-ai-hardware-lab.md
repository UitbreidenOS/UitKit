# 📂 Edge AI Hardware Lab
> The canonical workspace for an AI Founder operating at the intersection of local hardware compute (Mac mini cluster, Nvidia DGX), physical 3D manufacturing (Bambu Lab), and multi-agent SaaS deployment.

📄 `lab-architecture-brief.md`      # Canonical brief: Hardware topology, compute allocation strategy, inference pipeline, and SaaS monetization model
🧠 `active-hardware-jobs.md`        # Session memory: Real-time tracking of cluster utilization, in-flight 3D prints, model inference queue, and cost per request
🤖 `CLAUDE.md`                      # Operating rules: Strict resource isolation between inference/manufacturing, enforce hardware-first design decisions, prohibit overallocation beyond 85% compute utilization

## 📁 local-compute-cluster/ (4 skills - Physical Compute)
📄 `mac-mini-m4-cluster-setup.md`   # Configuration for 4-node Mac mini M4 cluster running inference services and agent coordination with unified SSH orchestration
📄 `nvidia-dgx-spark-routing.md`    # Compute allocation rules, CUDA/cuDNN configuration, and task priority queues for offloading heavy LLM inference and fine-tuning
📄 `edge-inference-gateway.md`       # Load balancing, latency optimization, and fallback strategies when on-premise compute saturates; routing to managed endpoints
📄 `cluster-health-monitoring.md`    # Prometheus metrics, thermal alerts, power draw tracking, and automated shutdown triggers to prevent hardware damage

## 📁 3d-fabrication-ops/ (4 skills - Manufacturing Pipeline)
📄 `bambu-x1c-slicer-automation.md` # G-code generation, multi-material profiles, overnight print scheduling, and filament cost tracking per unit produced
📄 `hardware-design-validation.md`   # CAD-to-gcode checks, wall thickness validation, support removal analysis, and structural integrity checks for edge-deployed enclosures
📄 `print-queue-dispatcher.md`       # Job scheduler prioritizing print runs, material switchover workflows, and automated failure recovery with ML-predicted retry logic
📄 `manufacturing-cost-ledger.md`    # Per-unit material cost tracking, energy consumption logging, machine hour allocation, and break-even analysis for each product variant

## 📁 agent-deployment/ (4 skills - SaaS Workforce)
📄 `multi-agent-orchestrator.md`    # State machine for routing tasks between Claude Agents running on-premise, managing handoffs and async coordination
📄 `inference-service-deployment.md`# Containerized agent runtimes on Mac cluster, scaling rules, version pinning, and A/B testing workflows for model upgrades
📄 `edge-api-gateway.md`             # REST/WebSocket endpoints exposed to customers, request throttling, authentication tokens, and usage metering for billing
📄 `managed-agent-integration.md`    # Fallback bridge to Claude Managed Agents API for burst capacity, cost per token tracking, and automatic switchover logic

## 📁 edge-inference/ (3 skills - Model Operations)
📄 `quantized-model-registry.md`     # Versioning and deployment of GGUF/ONNX models, 4-bit/8-bit quantization profiles for Mac mini inference, latency benchmarks
📄 `fine-tuning-pipeline.md`         # Local LoRA/QLoRA workflows on DGX Spark, dataset versioning, validation split tracking, and A/B testing rollout for custom models
📄 `inference-caching-strategy.md`   # Token-level caching, KV cache management, context window optimization, and per-customer model personalization tracking

## 📁 cost-optimization/ (3 skills - Economics & Efficiency)
📄 `unit-economics-dashboard.md`     # Real-time cost per inference, gross margins by feature, DRI assignments for cost reduction, and breakeven analysis per customer cohort
📄 `hardware-utilization-tuning.md`  # Batch sizing optimization, inference scheduling to minimize idle time, thermal throttling recovery, and power draw optimization per workload
📄 `capacity-planning-rules.md`      # Demand forecasting, cluster expansion triggers when sustained utilization exceeds 75%, depreciation schedules, and ROI models for hardware refresh cycles

---
**Configuration Files**
⚙️ `hardware-topology.yaml`         # Node inventory (Mac mini M4 count, DGX Spark specs), network topology, inference endpoint mappings, and failover rules
⚙️ `edge-agent-manifest.json`       # Deployed agent list, allocated CPU cores per agent, memory reservations, and inference model assignments per service
⚙️ `manufacturing-bill-of-materials.yaml` # Part costs, lead times, suppliers, and reorder triggers for filament and hardware consumables
📦 `requirements.txt`               # Python dependencies (GGUF loaders, quantization libraries, monitoring SDKs, inference frameworks for edge deployment)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
