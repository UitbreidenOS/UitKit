---
name: "chaos-engineering"
description: "Chaos engineering: design failure injection experiments, identify blast radius, define steady state, use Chaos Monkey / Gremlin / Litmus — build resilience through controlled failures"
---

# Chaos Engineering Skill

## When to activate
- Validating system resilience before a major launch or traffic event
- Testing whether circuit breakers and fallbacks actually work
- Identifying unknown dependencies and single points of failure
- Setting up a chaos engineering practice from scratch
- Designing a specific failure injection experiment

## When NOT to use
- Production systems with no existing observability — you won't be able to measure the impact
- Systems with no rollback capability — you need to be able to stop the experiment
- Regulated environments (banking, healthcare) without explicit sign-off — check compliance first
- Replacing load testing — chaos tests failure modes, load tests capacity

## Instructions

### Chaos experiment design

```
Design a chaos engineering experiment for [system/service].

System: [describe the architecture — microservices / monolith / serverless]
Hypothesis: [what do you believe will happen when X fails?]
Target: [which component to break]
Steady state: [how do you measure "the system is healthy"?]

Chaos experiment template:

1. Hypothesis:
   "When [component X] fails, [the system will respond with Y — e.g. graceful degradation, fallback, no user impact] because [we have circuit breaker Z / retry logic / cache fallback]."

2. Steady state definition (measure BEFORE injecting failure):
   - Metric 1: [e.g. p99 API latency < 200ms]
   - Metric 2: [e.g. error rate < 0.1%]
   - Metric 3: [e.g. all health checks green]

3. Failure to inject:
   - What: [kill process / add latency / drop packets / fill disk / exhaust connections]
   - Where: [specific pod / host / availability zone / dependency]
   - Blast radius: [single instance / all instances in 1 AZ / entire service]

4. Observation period: [how long to run the experiment — start with 5 minutes]

5. Rollback trigger:
   - Stop experiment if: [metric X exceeds Y threshold]
   - Rollback method: [describe exact command or action]

6. Analysis:
   - Did system reach steady state again within [X minutes]?
   - Were users impacted? For how long?
   - Did alerting fire? Was it the right alert?

7. Action if hypothesis was wrong (system degraded unexpectedly):
   - [fix the gap — add circuit breaker, improve fallback, add redundancy]

Design a specific experiment for my system.
```

### Common failure scenarios

```
Generate failure injection experiments for [architecture].

Architecture: [describe]
Infrastructure: [AWS / GCP / Azure / on-prem / Kubernetes]

Failure scenario library (choose what applies):

NETWORK failures:
□ Latency injection: add 200-500ms to all calls to [service]
□ Packet loss: drop 10% of packets to [dependency]
□ DNS failure: break DNS resolution for [service]
□ Bandwidth throttle: limit network throughput to [X Mbps]

RESOURCE failures:
□ CPU stress: consume 80% CPU on [host] for [X minutes]
□ Memory pressure: fill memory to 90% — does OOM killer fire correctly?
□ Disk full: fill disk to 95% — do logs rotate? Do queues back up?
□ Process kill: SIGKILL the [service] process — does it restart? How fast?

DEPENDENCY failures:
□ Database connection pool exhausted: set pool max = 1
□ Third-party API down: block requests to [api.external.com]
□ Message queue unavailable: stop Kafka / RabbitMQ
□ Cache miss: flush Redis — does the system survive cache-cold?

KUBERNETES-specific:
□ Pod eviction: kubectl delete pod [pod-name] — does it reschedule?
□ Node failure: cordon + drain a node — is workload rescheduled?
□ ConfigMap / Secret deleted: what fails first?
□ Resource quota exceeded: set low resource limits — which pods OOMKilled?

For each experiment:
Tool (Kubernetes): LitmusChaos, Chaos Mesh
Tool (Cloud): AWS Fault Injection Simulator, Gremlin
Tool (Process): Chaos Monkey (Netflix/OSS), Pumba

Generate the 3 highest-risk experiments for my specific architecture.
```

### Blast radius assessment

```
Assess blast radius before running a chaos experiment.

Target: [the component I want to fail]
System map: [describe what calls what — or paste architecture diagram description]

Blast radius analysis:

Direct consumers (tier 1):
[Services that directly call the failing component]
Impact if target fails: [immediate errors / degraded / unaffected]

Indirect consumers (tier 2):
[Services that call tier 1 services]
Impact: [cascading failure risk / isolated / cache absorbs]

External-facing impact:
[Which user-visible features break if target fails?]
User impact severity: [all users / % users / no users (if fallback exists)]

Recovery path:
- Does the system self-heal? [yes / no / partial]
- Manual intervention required: [what and who]
- Time to recover: [< 1 min / 5 min / > 5 min]

Risk rating: [Low / Medium / High / Critical]
Proceed with experiment: [yes / no — if high blast radius, fix dependencies first]

Recommendation: run experiment in [staging / canary / 1 AZ of production] first.
```

### Game day planning

```
Plan a chaos engineering game day for [team].

Team size: [X engineers]
Systems in scope: [list services]
Duration: [half-day / full day]
Experience level: [first game day / intermediate / experienced]

Game day agenda:

Pre-game (30 min):
□ Brief the team: what is chaos engineering, what are the rules
□ Review steady state baselines for all systems
□ Confirm rollback procedures are documented and tested
□ Assign roles: facilitator / experiment runner / observer / rollback owner

Experiment schedule (timebox each to 30-45 min):

Experiment 1: [lowest risk — single instance failure]
- Run by: [team member]
- Success criteria: [service recovers in < 2 min, no user impact]
- Rollback: [command]

Experiment 2: [medium risk — dependency failure]
- Run by: [team member]
- Success criteria: [fallback activates, error rate stays < X%]

Experiment 3: [higher risk — AZ-level failure simulation]
- Run by: [team member]
- Only if experiments 1+2 passed

Post-game (1 hour):
□ Review: did hypotheses hold?
□ Document: what broke unexpectedly?
□ Backlog: create tickets for gaps found
□ Celebrate: failed hypothesis = success (found a gap before users did)

Output: game day report with findings, blast radius surprises, and priority fixes.
```

## Example

**User:** We use microservices on Kubernetes. Our payment service depends on a fraud-check API. We've never tested what happens if the fraud-check API goes down. Design the experiment.

**Claude's experiment:**

**Hypothesis:**
"When the fraud-check API becomes unavailable, the payment service will return a graceful fallback response (allow low-risk transactions, queue high-risk ones for review) and alert on-call. Checkout flow will remain functional for 95%+ of users."

**Steady state (measure for 10 min before experiment):**
- Payment success rate: > 98%
- p99 checkout latency: < 800ms
- Fraud API response time: < 200ms (verify it's being called)

**Failure injection:**
Using Chaos Mesh on Kubernetes:
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: fraud-api-outage
spec:
  action: loss
  mode: all
  selector:
    namespaces: [payments]
    labelSelectors: {"app": "payment-service"}
  loss:
    loss: "100"          # 100% packet loss to fraud API
  direction: to
  externalTargets: ["fraud-api.internal"]
  duration: "5m"
```

**What to watch:**
- Does payment service retry or fail-open?
- Does circuit breaker open after N failures?
- Does on-call alert fire within 2 minutes?
- Do payment success rates drop or hold?

**If hypothesis fails (payments start failing):**
→ Fix: implement circuit breaker pattern with `opossum` (Node.js) or `resilience4j` (Java) — fail-open with manual review queue for the duration of the outage.

---
