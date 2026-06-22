# SWARM Sandbox Workshop: Multi-Agent Orchestration

## Overview

A 2-day intensive workshop on building, testing, and operating distributed multi-agent swarm topologies in Claude Code. Participants learn swarm fundamentals, design safe topologies, and run hands-on exercises with chaos testing.

**Duration:** 2 days (8 hours per day)  
**Audience:** Senior engineers, ML ops, platform architects  
**Prerequisite:** Basic Claude Code understanding; familiarity with agent concepts  
**Max participants:** 16 per cohort

---

## Day 1: Topology Design & Safety Guardrails

### Morning Session: Swarm Fundamentals (4 hours)

#### 1.1 What is a Swarm? (45 minutes)

**Concepts**
- Definition: Dynamically orchestrated ensemble of Claude agents operating under distributed control
- Contrast with: Sequential agents, tree structures, single-agent workflows
- Core properties: autonomy, coordination, fault tolerance, emergence

**Swarm Topology Taxonomy**
```
1. Sequential Chain → Linear dependency, no parallelism
   Agent A → Agent B → Agent C
   
2. Fan-Out/Map-Reduce → Parallel execution, aggregation
   Input → [Agent A, Agent B, Agent C] → Aggregator → Output
   
3. Hierarchical → Multi-level coordination
   Manager → [Senior A, Senior B] → [Junior A-1, A-2, B-1, B-2]
   
4. Peer-to-Peer (Council) → Consensus or debate
   [Expert A, Expert B, Expert C] ⟷ Coordinator
   
5. Hybrid → Combination of above patterns
```

**Interactive Discussion (15 min)**
- When would you choose fan-out over hierarchy?
- What breaks in a peer consensus with 7+ agents?
- How does message passing differ from tool-calling?

**Checkpoint Quiz**
- 3 questions on topology selection
- Everyone votes on a scenario (e.g., "Build a code review swarm")

---

#### 1.2 Claude Code Swarm Architecture (45 minutes)

**Swarm Layer Model**

```
┌────────────────────────────────────────────┐
│     Orchestration & Coordination           │
│  (dispatch, monitoring, state management)  │
├────────────────────────────────────────────┤
│     Agent Runtime Layer                    │
│  (concurrent execution, MCP + tool calls)  │
├────────────────────────────────────────────┤
│     Foundation Models (Claude)             │
│  (Haiku, Sonnet, Opus via API)             │
└────────────────────────────────────────────┘
```

**Key Components**
- **WorktreeManager**: Isolated filesystem + git state per agent
- **ToolRegistry**: Shared and agent-specific tool bindings
- **MessageBroker**: Event queues, retry logic, dead-letter handling
- **StateSnapshot**: Consensus checkpoint system (for council topologies)
- **ChaosMonitor**: Fault injection and resilience testing

**API Surface: SwarmConfig Schema**

```yaml
swarm:
  name: "code-review-swarm"
  topology: "council"  # sequential | fan-out | hierarchical | council | hybrid
  agents:
    - id: "reviewer-security"
      model: "claude-opus-4-1"
      role: "Security expert"
      tools: ["code-analysis", "cve-lookup", "compliance-check"]
      timeout: 60
      retries: 2
      
    - id: "reviewer-performance"
      model: "claude-sonnet-4"
      role: "Performance auditor"
      tools: ["profiler", "benchmark", "trace-analysis"]
      
  coordinator:
    model: "claude-sonnet-4"
    strategy: "consensus-voting"  # voting | debate | negotiation
    threshold: 0.7  # 70% agreement required
    timeout: 120
    
  message_broker:
    queue_backend: "redis"  # local | redis | pg
    max_retries: 3
    retry_backoff: "exponential"
    dead_letter_ttl: 3600
    
  safety:
    max_concurrent_agents: 8
    rate_limit_per_agent: 100  # requests/min
    token_budget_per_run: 500000
    fallback_agent: "claude-haiku-4-5"
    isolation_level: "worktree"  # worktree | container | vm
```

**Hands-on: Config Walkthrough (15 min)**
- Groups of 4 design a swarm config for their domain
- Instructors validate topology choice

---

#### 1.3 Cost & Performance Modeling (30 minutes)

**Token Economics**

| Topology | Agents | Avg Tokens/Run | Est. Cost | Parallelism |
|----------|--------|----------------|-----------|-------------|
| Sequential | 3 | 45K | $0.18 | 0% |
| Fan-Out (5) | 5 | 120K | $0.42 | 100% |
| Hierarchical (8) | 8 | 180K | $0.65 | 70% |
| Council (4) | 4 | 160K | $0.58 | 100% + overhead |

**Cost Optimization Techniques**
1. **Model Cascading**: Start with Haiku, escalate to Sonnet/Opus only on disagreement
2. **Caching**: Claude API prompt caching for system instructions (saves 90% on repeated context)
3. **Sampling**: Use temperature=0 for deterministic agents; 0.5-0.8 for reasoning/debate
4. **Truncation**: Early exit if consensus/quorum reached before all agents respond

**Benchmark Deep-Dive**
- Fan-out with 10 agents: 2.1s parallel vs. 18s sequential
- Council debate (4 experts, 3 rounds): 12s total with caching enabled
- Fallback chain (Haiku → Sonnet → Opus): 0.8s/0.3s/0.1s decision time per tier

**Workshop Activity: Cost Calculator**
- Given a scenario, estimate token spend and select optimal topology
- Reveal actual costs from production runs

---

### Afternoon Session: Safety Guardrails (4 hours)

#### 1.4 Threat Model & Attack Vectors (45 minutes)

**Adversarial Scenarios**

```
┌─────────────────────────────────────────────────────┐
│ Swarm-Specific Risks                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1. AGENT ESCAPE & JAILBREAK                        │
│    Risk: Rogue agent sends malicious tool calls    │
│    Ex: Delete production data via allowed tool     │
│    Mitigation: Input validation + tool sandboxing  │
│                                                     │
│ 2. CONSENSUS MANIPULATION                          │
│    Risk: Attacker-controlled agent biases vote     │
│    Ex: Security expert (compromised) says "OK"     │
│    Mitigation: Supermajority threshold + audit log │
│                                                     │
│ 3. RESOURCE EXHAUSTION                             │
│    Risk: Rogue agent requests infinite context     │
│    Ex: Loop generating 1M-token responses          │
│    Mitigation: Per-agent token budgets + timeouts  │
│                                                     │
│ 4. COORDINATION DEADLOCK                           │
│    Risk: Agents wait for each other indefinitely   │
│    Ex: Manager waits for worker; worker waits...   │
│    Mitigation: Strict message timeouts + retries   │
│                                                     │
│ 5. SIDE-CHANNEL INFORMATION LEAKAGE                │
│    Risk: Agent infers secrets from latency/order   │
│    Ex: Timing attack on worktree access            │
│    Mitigation: Constant-time ops + noise injection │
│                                                     │
│ 6. CASCADING FAILURE                               │
│    Risk: One agent failure collapses entire swarm  │
│    Ex: Central coordinator goes down                │
│    Mitigation: Circuit breakers + graceful fallback│
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Real-World Incident: Case Study (30 min)**

*Scenario: A code review swarm at Acme Inc.*

```
Timeline:
T+0:00   Manager asks 5 reviewers to audit payment code
T+0:45   4 reviewers approve; 1 reviewer (Sonnet model) times out
T+1:00   Manager proceeds with vote (4/5 threshold met)
T+1:30   Deployment starts
T+2:15   Fraud detected: $50K extracted via unreviewed vulnerability
         (The timed-out reviewer had cached the vuln signature)
```

**Lessons**
- Timeouts ≠ approval; require explicit consensus
- Retry exhausted reviewers before proceeding
- Log every vote + reasoning for forensics

**Activity: Threat Modeling Workshop (45 min)**
- Break into 3 groups; each assigned a swarm topology
- Groups identify 5 threats and propose 1 mitigation each
- Gallery walk to review other groups' work

---

#### 1.5 Guardrails Framework (45 minutes)

**Five Layers of Defense**

**Layer 1: Input Validation**
```python
@guardrail
def validate_agent_message(msg: AgentMessage) -> bool:
    """
    Check message structure, size, and content type.
    Return False to drop message without processing.
    """
    # Max message size: 1 MB
    if len(msg.serialize()) > 1_000_000:
        log_security_event("oversized_message", msg.agent_id)
        return False
    
    # Check token count before sending to model
    if estimate_tokens(msg.content) > 10_000:
        log_warning("large_context", msg.agent_id)
        # Still allow; just log for monitoring
    
    # Reject if agent is in quarantine (failed security check)
    if msg.agent_id in QUARANTINE_LIST:
        log_security_event("quarantined_agent", msg.agent_id)
        return False
    
    return True
```

**Layer 2: Tool Authorization**
```yaml
tool_policy:
  rules:
    - agent_id: "reviewer-security"
      allowed_tools:
        - "code-analysis"
        - "cve-lookup"
        - "compliance-check"
      denied_tools:
        - "shell"
        - "delete-file"
        - "export-data"
      rate_limits:
        cve-lookup: 10/min
        code-analysis: 50/min
```

**Layer 3: Resource Limits**

| Resource | Default Limit | Override |
|----------|---------------|----------|
| Token budget per run | 500K | Per swarm config |
| Concurrent agents | 8 | Per orchestrator |
| Message queue depth | 1000 | Per broker |
| Agent timeout | 60s | Per agent config |
| Worktree disk usage | 5 GB | Per agent |

**Layer 4: Consensus & Voting**

```python
class ConsensusStrategy:
    VOTING = "majority"           # >50% agreement
    SUPERMAJORITY = "supermajority"  # ≥67% agreement
    UNANIMOUS = "unanimous"       # 100% agreement
    PLURALITY = "plurality"       # Most votes (≥1)

def apply_consensus(votes: Dict[AgentId, Vote], strategy: str) -> bool:
    agreement = sum(1 for v in votes.values() if v.approved)
    total = len(votes)
    
    if strategy == "supermajority":
        return agreement >= ceil(total * 0.67)
    elif strategy == "unanimous":
        return agreement == total
    # ...
    
    log_consensus_result(strategy, agreement, total, approved)
    return result
```

**Layer 5: Audit & Forensics**

```
Every swarm run produces:
- audit.jsonl (all messages, decisions, timeouts)
- consensus-log.json (vote records with reasoning)
- performance.json (latency per agent, queue depth)
- resource-trace.json (token usage, worktree I/O)
- security-events.jsonl (validation failures, quarantines)

Retention: 90 days (prod), 7 days (staging)
Encryption: AES-256 at rest
```

**Hands-on: Write a Guardrail (30 min)**
- Participants implement a custom Layer 1 validator
- Test against 5 attack payloads (provided)

---

#### 1.6 Configuration & Deployment (30 minutes)

**Config Files**

1. **swarm.yaml** — Topology + agent definitions
2. **guardrails.yaml** — Security policies + rate limits
3. **.claude/settings.json** — Integration with Claude Code
4. **secrets.yaml** (encrypted) — API keys, model org IDs

**Example: Deploy a Swarm**

```bash
# Step 1: Validate config
claude-swarm validate swarm.yaml guardrails.yaml

# Step 2: Dry-run with mock agents
claude-swarm dry-run --agents 3 --rounds 1

# Step 3: Deploy to staging
claude-swarm deploy --env staging --guardrails-enforcement strict

# Step 4: Monitor
claude-swarm monitor --env staging --live-tail audit.jsonl

# Step 5: Promote to prod
claude-swarm promote --from staging --to prod --approval required
```

**Checklist Before Going Live**
- [ ] All agents pass security review
- [ ] Consensus threshold validated against test data
- [ ] Fallback agent assigned and tested
- [ ] Audit logging enabled
- [ ] Cost budget set and alerts configured
- [ ] On-call runbook written
- [ ] Chaos test passed (see Day 2)

**Workshop: Deploy Swarm to Staging**
- Each group deploys their swarm config from morning design
- Instructors verify guardrails are active
- Quick smoke test with dummy input

---

## Day 2: Hands-On Build & Chaos Testing

### Morning Session: Build 2/5/Council Topologies (4 hours)

#### 2.1 Topology 1: Two-Agent Sequential (45 minutes)

**Design Pattern: Planner → Executor**

```
Input → Planner Agent → Executor Agent → Output
         (Claude Sonnet)  (Claude Haiku)
```

**Use Case: Automated Code Cleanup**

```yaml
# swarm-2.yaml
swarm:
  name: "code-cleanup-2"
  topology: "sequential"
  agents:
    - id: "planner"
      role: "Code style analyzer"
      model: "claude-sonnet-4"
      prompt: |
        Analyze this Python file and generate a list of style issues.
        Output JSON with keys: [issue_type, line_no, suggestion]
      
    - id: "executor"
      role: "Code fixer"
      model: "claude-haiku-4-5"
      prompt: |
        Given the issue list from the planner, apply fixes.
        Return the cleaned code.
      dependencies: ["planner"]
      
  message_flow:
    - from: "input"
      to: "planner"
      format: "code_file"
    - from: "planner"
      to: "executor"
      format: "json"
    - from: "executor"
      to: "output"
      format: "code_file"
```

**Build Steps**
1. Define agent prompts (use system prompt template from resources/)
2. Create swarm.yaml config
3. Test locally with 3 code samples
4. Validate output quality
5. Deploy to staging

**Hands-on (45 min)**
- Pairs build the 2-agent swarm
- Write test harness (compare original vs. cleaned)
- Compare execution time & cost vs. single agent

---

#### 2.2 Topology 2: Five-Agent Fan-Out (45 minutes)

**Design Pattern: Map-Reduce**

```
         Input (dataset)
            ↓
    ┌───────┬───────┬───────┬───────┐
    ↓       ↓       ↓       ↓       ↓
  Agent1  Agent2  Agent3  Agent4  Agent5
  (chunk1)(chunk2)(chunk3)(chunk4)(chunk5)
    ↓       ↓       ↓       ↓       ↓
    └───────┴───────┴───────┴───────┘
            ↓
        Aggregator
            ↓
          Output
```

**Use Case: Distributed Security Audit**

```yaml
swarm:
  name: "security-audit-5"
  topology: "fan-out"
  input_splitter: "chunk_by_module"  # Split code into 5 modules
  
  agents:
    - id: "auditor-auth"
      role: "Authentication & secrets reviewer"
      model: "claude-opus-4-1"
      tools: ["regex-scan", "crypto-check"]
      
    - id: "auditor-sql"
      role: "SQL injection & DB security"
      model: "claude-opus-4-1"
      tools: ["ast-parse", "sql-validator"]
      
    - id: "auditor-net"
      role: "Network & API security"
      model: "claude-sonnet-4"
      tools: ["url-analysis", "cors-check"]
      
    - id: "auditor-deps"
      role: "Dependency vulnerability scanner"
      model: "claude-sonnet-4"
      tools: ["cve-lookup", "package-tree"]
      
    - id: "auditor-crypto"
      role: "Cryptographic implementation review"
      model: "claude-opus-4-1"
      tools: ["crypto-analyzer"]
  
  aggregator:
    model: "claude-sonnet-4"
    prompt: |
      Synthesize findings from 5 security agents.
      Rank by severity. Flag critical issues.
      Output: JSON with {severity, count, recommendations}
    timeout: 120
    
  safety:
    max_concurrent: 5
    timeout_per_agent: 60
    token_budget: 800_000
```

**Performance Expected**
- Sequential equivalent: ~5 min
- Fan-out swarm: ~1 min (60K tokens shared cost)
- Speedup: 5x

**Hands-on (45 min)**
- Groups of 3 build the 5-agent audit swarm
- Provide sample codebase (50 files)
- Participants implement aggregator consensus
- Compare results to manual review checklist

---

#### 2.3 Topology 3: Council (Debate & Consensus) (45 minutes)

**Design Pattern: Peer Experts + Coordinator**

```
        Input (proposal)
            ↓
    ┌───────┬───────┬───────┐
    ↓       ↓       ↓       ↓
  Expert1 Expert2 Expert3  Coordinator
   (vote)  (vote)  (vote)  (debate logic)
    ↑       ↑       ↑       ↓
    └───────┴───────┴───────┘
            ↓
       Consensus or Escalation
            ↓
          Output
```

**Use Case: Product Roadmap Decision**

```yaml
swarm:
  name: "roadmap-council"
  topology: "council"
  
  council_members:
    - id: "expert-engineering"
      expertise: "Technical feasibility"
      model: "claude-opus-4-1"
      
    - id: "expert-product"
      expertise: "Customer value & market fit"
      model: "claude-sonnet-4"
      
    - id: "expert-business"
      expertise: "ROI & revenue impact"
      model: "claude-sonnet-4"
      
    - id: "expert-security"
      expertise: "Risk & compliance"
      model: "claude-opus-4-1"
  
  coordinator:
    role: "Chief of Staff"
    model: "claude-opus-4-1"
    consensus_strategy: "supermajority"  # ≥3 out of 4
    max_debate_rounds: 3
    
    system_prompt: |
      Your role is to:
      1. Solicit opinion from each expert
      2. Flag disagreements
      3. Moderate debate (up to 3 rounds)
      4. Apply voting rule: supermajority (≥75%)
      5. Escalate to human if consensus fails
      6. Log all reasoning
      
      Format output as:
      {
        "expert_opinions": {...},
        "consensus_reached": bool,
        "recommendation": "approved|rejected|escalate",
        "reasoning": "..."
      }
  
  safety:
    fallback_strategy: "escalate_to_human"  # If >1 timeout or no consensus
    vote_tie_breaker: "expert-engineering"
    audit_all_rounds: true
```

**Expected Behavior**

```
Round 1: Each expert votes independently
  → Engineering: "feasible in 2 sprints" (approve)
  → Product: "high demand, 3 customers blocking" (approve)
  → Business: "margin pressure, lower ROI" (reject)
  → Security: "some compliance risk" (conditional)
  Tally: 2/4 approve (no consensus yet)

Round 2: Coordinator prompts dissenters for reasoning
  → Business clarifies: "approve if margin >15%"
  → Coordinator checks market analysis → margin 18%
  Retally: 3/4 approve (supermajority reached!)

Output:
{
  "consensus_reached": true,
  "recommendation": "approved",
  "reasoning": "3/4 experts approve; margin constraint met",
  "dissent": {"expert-business": "margin risk"}
}
```

**Hands-on (45 min)**
- Groups build a 4-expert council on a decision scenario (e.g., "Which language for the new service?")
- Implement debug mode: show all expert reasoning in real-time
- Participants modify consensus_strategy and observe effects (majority vs. supermajority vs. unanimous)

---

### Afternoon Session: Chaos Testing & Resilience (4 hours)

#### 2.4 Chaos Testing Framework (45 minutes)

**Principles**
- Introduce failures deliberately and safely
- Measure recovery time and output quality
- Validate guardrails + fallback mechanisms
- Build confidence for production

**Failure Injection Points**

```python
class ChaosScenario:
    """Define a failure pattern."""
    
    name: str  # e.g., "agent-timeout"
    component: str  # "agent", "broker", "coordinator"
    timing: str  # "at_start", "after_50pct", "random"
    probability: float  # 0.0 - 1.0
    recovery_time_sec: int  # Time to recover (if applicable)
    expected_behavior: str  # What should swarm do?

# Example scenarios
scenarios = [
    ChaosScenario(
        name="single-agent-timeout",
        component="agent",
        timing="random",
        probability=0.3,  # 30% of agents timeout in this round
        recovery_time_sec=30,
        expected_behavior="Coordinator should retrigger; if retries exhausted, fallback to single-agent"
    ),
    ChaosScenario(
        name="message-broker-offline",
        component="broker",
        timing="at_start",
        probability=1.0,
        recovery_time_sec=5,
        expected_behavior="Swarm should queue locally; sync once broker is back"
    ),
    ChaosScenario(
        name="agent-invalid-output",
        component="agent",
        timing="random",
        probability=0.1,
        recovery_time_sec=0,
        expected_behavior="Validator rejects output; agent is quarantined; vote is skipped"
    ),
]
```

**Chaos Test Harness**

```bash
# Run all scenarios
claude-swarm chaos-test --config swarm.yaml \
  --scenarios all \
  --trials 10 \
  --output chaos-report.html

# Run specific scenario
claude-swarm chaos-test --config swarm.yaml \
  --scenario single-agent-timeout \
  --probability 0.5 \
  --trials 20

# Real-time visualization
claude-swarm chaos-test --config swarm.yaml \
  --live-dashboard :8000
```

**Metrics Captured**

| Metric | Target | Flag |
|--------|--------|------|
| Success rate (≥3 failures) | ≥95% | <90% |
| P95 latency increase | <2x baseline | >3x |
| Output quality (BLEU vs. healthy) | ≥0.90 | <0.85 |
| Fallback trigger rate | <5% | >10% |
| Audit log coverage | 100% | <95% |

**Activity: Run Chaos Test Suite (45 min)**
- Each group runs their swarm with 5 scenarios
- Instructors introduce live failure injection (kill agent, delay broker)
- Participants measure recovery time and success rate
- Discuss: What surprised you? What guardrail saved the run?

---

#### 2.5 Resilience Patterns & Recovery (45 minutes)

**Pattern 1: Retry with Backoff**

```python
async def call_agent_with_retry(agent_id, message, max_retries=3):
    """Exponential backoff: 1s, 2s, 4s."""
    for attempt in range(max_retries):
        try:
            result = await agent.call(message, timeout=60)
            return result
        except TimeoutError as e:
            if attempt < max_retries - 1:
                backoff = 2 ** attempt
                log_retry(agent_id, attempt, backoff)
                await asyncio.sleep(backoff)
            else:
                log_security_event("retries_exhausted", agent_id)
                raise
```

**Pattern 2: Circuit Breaker**

```python
class CircuitBreaker:
    """Prevent cascading failures."""
    
    def __init__(self, failure_threshold=3, recovery_timeout=60):
        self.failure_count = 0
        self.state = "CLOSED"  # closed=healthy, open=trip, half_open=testing
        self.recovery_timeout = recovery_timeout
        
    async def call(self, func, *args):
        if self.state == "OPEN":
            if time.time() > self.opened_at + self.recovery_timeout:
                self.state = "HALF_OPEN"  # Try recovery
            else:
                raise CircuitBreakerOpen(self.agent_id)
        
        try:
            result = await func(*args)
            if self.state == "HALF_OPEN":
                self.state = "CLOSED"  # Recovery successful
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            if self.failure_count >= self.failure_threshold:
                self.state = "OPEN"
                self.opened_at = time.time()
            raise
```

**Pattern 3: Fallback Chain**

```yaml
fallback_chain:
  - agent_id: "reviewer-security"
    model: "claude-opus-4-1"
    timeout: 60
  
  - agent_id: "reviewer-security-backup"
    model: "claude-sonnet-4"  # Faster, cheaper
    timeout: 30
    
  - agent_id: "reviewer-generic"
    model: "claude-haiku-4-5"  # Ultra-fast fallback
    timeout: 10
    
  - strategy: "manual-review"
    timeout: 3600
    escalation_message: "Alert: Security review escalated to human"
```

**Pattern 4: Consensus Quorum with Majority**

```python
async def gather_votes(experts: List[Agent], proposal: str, timeout=90):
    """
    Collect votes with early exit if quorum reached.
    Quorum: 3 out of 4 votes.
    """
    tasks = [expert.vote(proposal) for expert in experts]
    votes = {}
    quorum = len(experts) * 0.75  # 75%
    
    for task in asyncio.as_completed(tasks, timeout=timeout):
        try:
            agent_id, vote = await task
            votes[agent_id] = vote
            
            # Early exit if quorum reached
            if sum(1 for v in votes.values() if v.approved) >= quorum:
                log_event("quorum_reached", len(votes), len(experts))
                return votes
        except TimeoutError:
            log_event("vote_timeout", agent_id)
    
    if len(votes) < quorum:
        log_security_event("insufficient_votes", len(votes), quorum)
        raise InsufficientVotesError()
    
    return votes
```

**Hands-on: Implement Recovery (45 min)**
- Participants add circuit breaker to one agent in their swarm
- Add fallback chain (primary → secondary → manual escalation)
- Test: Kill the primary agent; verify fallback engages

---

#### 2.6 Performance & Cost Benchmarking (45 minutes)

**Benchmarking Template**

```python
import time
import json
from datetime import datetime

def benchmark_swarm(swarm_config, test_inputs, num_trials=5):
    """Run swarm against test data and capture metrics."""
    
    results = {
        "config": swarm_config.name,
        "timestamp": datetime.utcnow().isoformat(),
        "trials": []
    }
    
    for trial in range(num_trials):
        for test_input in test_inputs:
            t0 = time.time()
            output = swarm.run(test_input)
            elapsed = time.time() - t0
            
            trial_result = {
                "input_size": len(test_input),
                "latency_sec": elapsed,
                "tokens_used": output.token_count,
                "cost_usd": output.cost,
                "success": output.ok,
                "output_quality": evaluate_quality(output),  # BLEU, F1, etc.
            }
            results["trials"].append(trial_result)
    
    # Aggregate
    latencies = [r["latency_sec"] for r in results["trials"]]
    costs = [r["cost_usd"] for r in results["trials"]]
    
    results["aggregate"] = {
        "latency_p50": sorted(latencies)[len(latencies)//2],
        "latency_p95": sorted(latencies)[int(len(latencies)*0.95)],
        "latency_p99": sorted(latencies)[int(len(latencies)*0.99)],
        "cost_mean": sum(costs) / len(costs),
        "cost_median": sorted(costs)[len(costs)//2],
        "success_rate": sum(1 for r in results["trials"] if r["success"]) / len(results["trials"]),
        "quality_mean": sum(r["output_quality"] for r in results["trials"]) / len(results["trials"]),
    }
    
    return results
```

**Comparison: 2-Agent vs. 5-Agent Fan-Out vs. Council**

| Topology | Latency | Cost | Success | Quality | Notes |
|----------|---------|------|---------|---------|-------|
| 2-Agent Sequential | 45s | $0.18 | 99% | 0.92 | Baseline |
| 5-Agent Fan-Out | 12s | $0.52 | 97% | 0.95 | 3.75x faster; higher quality |
| 4-Expert Council | 28s | $0.48 | 98% | 0.94 | Debate overhead; better consensus |

**Activity: Run Benchmarks (45 min)**
- Each group benchmarks their 2-agent, 5-agent, and council swarms
- Compare against single-agent baseline (Opus)
- Create a cost-vs.-quality plot
- Present findings: When is parallelism worth it?

---

#### 2.7 Wrap-Up & Deployment Checklist (30 minutes)

**Pre-Production Checklist**

```
SWARM DEPLOYMENT SIGN-OFF
==========================

Topology & Design
  ☐ Topology choice documented and justified
  ☐ All agents pass individual unit tests
  ☐ Message flow validated with mock data
  ☐ Cost estimate within budget
  
Safety & Guardrails
  ☐ All 5 layers configured (input, tool, resource, consensus, audit)
  ☐ Security review completed
  ☐ Threat model documented
  ☐ Sensitive data redacted from audit logs
  
Testing & Validation
  ☐ Chaos tests passed (success rate ≥95%)
  ☐ Fallback chain tested and working
  ☐ Circuit breaker engaged under load
  ☐ Output quality meets acceptance criteria
  ☐ Latency within SLA (p95)
  
Operations
  ☐ On-call runbook written
  ☐ Monitoring dashboards created
  ☐ Alert thresholds set
  ☐ Audit log retention policy documented
  ☐ Escalation contact list confirmed
  
Deployment
  ☐ Staging deployment successful
  ☐ Smoke test passed
  ☐ Infrastructure capacity verified
  ☐ Rollback plan tested
  ☐ Approval from security & ops lead
```

**Known Issues & Mitigations**

| Issue | Workaround | Target Fix |
|-------|-----------|-----------|
| Council debate timeout with 5+ agents | Reduce to 4 agents; use parallel voting | Async negotiation (v2) |
| Fan-out load balancing | Manual assignment by module | Automatic load balancing (v2) |
| Audit log disk usage (8 GB/day) | Archive after 7 days | Streaming compression (Q3) |

---

## Post-Workshop: Office Hours

### Continuous Support (2 weeks)

**Weekly Sync: 1 hour**
- Time: Thursday 2 PM PT
- Format: Zoom (async recording available)
- Agenda:
  1. Deployment status (5 min)
  2. Q&A from production runs (30 min)
  3. Live debugging (15 min)
  4. Metrics review (10 min)

**Slack Channel: #swarm-workshop**
- Available: Immediately post-workshop
- Response SLA: <2 hours (instructors)
- Pinned: Guardrails checklist, chaos test examples, runbook template

**Self-Serve Resources**
- Video recordings of all sessions (YouTube unlisted)
- Example swarms (GitHub repo): 2-agent, 5-agent, council
- Troubleshooting guide (PDF)
- Cost calculator spreadsheet

**Metrics Dashboard**
- Access: https://swarm-workshop.claudient.io/dashboard
- Tracks: All participant swarms' success rate, cost, latency
- Alerts: If any swarm falls below guardrails

---

## Appendices

### A. Example Swarm Configs

#### A.1 Minimal 2-Agent Example
```yaml
swarm:
  name: "minimal-2"
  topology: "sequential"
  agents:
    - id: "agent-a"
      model: "claude-sonnet-4"
      prompt: "You are a code analyzer."
    - id: "agent-b"
      model: "claude-haiku-4-5"
      prompt: "You are a code cleaner."
      dependencies: ["agent-a"]
```

#### A.2 Production 5-Agent Example
```yaml
# See section 2.2 above
```

#### A.3 Council with Debate Rounds
```yaml
# See section 2.3 above
```

---

### B. Chaos Test Scenarios (JSON)

```json
{
  "scenarios": [
    {
      "name": "agent-timeout-30pct",
      "component": "agent",
      "timing": "random",
      "probability": 0.3,
      "recovery_time_sec": 30
    },
    {
      "name": "broker-offline-5sec",
      "component": "broker",
      "timing": "at_start",
      "probability": 1.0,
      "recovery_time_sec": 5
    },
    {
      "name": "agent-invalid-output-10pct",
      "component": "agent",
      "timing": "random",
      "probability": 0.1,
      "recovery_time_sec": 0
    }
  ]
}
```

---

### C. Glossary

- **Swarm**: Ensemble of coordinated Claude agents operating under distributed control
- **Topology**: Architectural pattern (sequential, fan-out, hierarchical, council, hybrid)
- **Consensus**: Agreement mechanism (voting, debate, supermajority)
- **Guardrails**: Security layers (input validation, tool auth, resource limits, voting, audit)
- **Chaos Test**: Fault injection to validate resilience
- **Circuit Breaker**: Pattern to prevent cascading failures
- **Quorum**: Minimum number of votes required for a decision
- **Fallback**: Secondary agent/strategy if primary fails
- **Audit Log**: Immutable record of all swarm decisions and messages

---

### D. Contact & Further Learning

**Instructors**
- Workshop Lead: [Name] (email)
- Safety Expert: [Name] (email)
- Ops Lead: [Name] (email)

**Resources**
- Claude API Docs: https://docs.anthropic.com
- Swarm Framework Repo: https://github.com/claudient/swarm
- Benchmark Data: https://swarm-workshop.claudient.io/benchmarks

**Feedback**
- Post-workshop survey: https://forms.gle/...
- Retro template (doc): [Link]

---

**Last Updated:** 2026-06-22  
**Workshop Version:** 1.0  
**Estimated Revision:** Q3 2026 (post-production learnings)
