# Agentic productie runbook

Operationeel playbook voor monitorering, alertering en herstel van multi-agent workflows in productie — definieert SLOs, incident response, rollback procedures en escalatie paden.

---

## Wanneer gebruiken

- Multi-agent workflows in productie met live gebruikersverzoeken of kritische batch jobs
- Workflows met SLO vereisten (response tijd, beschikbaarheid, kosten)
- Systemen die consistentie onder gedeeltelijke fouten moeten behouden
- Deployments die automatisch herstel of handmatige escalatie procedures vereisen

Niet gebruiken voor experimentele of alleen-ontwikkeling workflows, of eenmalige batch jobs zonder real-time beperkingen.

---

## SLOs en fout budgetten

Definieer beschikbaarheids en performance doelen voor multi-agent workflow:

```json
{
  "workflow": "research_and_synthesize",
  "slo_version": "2026-06",
  "slos": [
    {
      "slo_id": "slo_availability",
      "metric": "workflow_success_rate",
      "target": "99.5%",
      "window": "30_days",
      "error_budget_pct": 0.5,
      "alert_threshold": "95%"
    },
    {
      "slo_id": "slo_latency_p99",
      "metric": "workflow_latency_ms",
      "target": 300000,
      "percentile": 99,
      "window": "7_days",
      "alert_threshold": 250000
    },
    {
      "slo_id": "slo_cost",
      "metric": "cost_per_workflow_cents",
      "target": 150,
      "window": "30_days",
      "alert_threshold": 130,
      "direction": "lower_is_better"
    }
  ],
  "error_budget_tracking": {
    "budget_available_pct": 0.42,
    "budget_consumed_pct": 0.08,
    "budget_remaining_days": 28,
    "burn_rate_pct_per_day": 0.0027
  }
}
```

**SLO regels:**
- Beschikbaarheid: percentage workflows dat succesvol voltooid
- Latentie: response tijd van verzoek naar uiteindelijke output (p99 is typisch)
- Kosten: gemiddelde tokens/API calls per workflow
- Fout budget: hoeveel fout is acceptabel voor on-call paging

---

## Monitorering en alertering

Real-time metreken verzameld van `.claude/workflow-metrics.jsonl`:

```json
{
  "metric_id": "metric_xyz789",
  "workflow": "research_and_synthesize",
  "timestamp": "2026-06-15T14:20:00Z",
  "execution_id": "exec_abc123",
  "metrics": {
    "workflow_status": "completed",
    "success": true,
    "latency_ms": 897000,
    "total_tokens": 24200,
    "cost_cents": 145,
    "agent_calls": 3,
    "retries": 0,
    "errors": 0,
    "timeout_count": 0
  },
  "agent_metrics": [
    {
      "agent": "researcher",
      "status": "completed",
      "latency_ms": 929000,
      "input_tokens": 2400,
      "output_tokens": 1850,
      "cost_cents": 78,
      "tool_calls": 5
    },
    {
      "agent": "analyst",
      "status": "completed",
      "latency_ms": 390000,
      "input_tokens": 3100,
      "output_tokens": 1200,
      "cost_cents": 48,
      "tool_calls": 1
    },
    {
      "agent": "writer",
      "status": "completed",
      "latency_ms": 78000,
      "input_tokens": 1800,
      "output_tokens": 890,
      "cost_cents": 19,
      "tool_calls": 0
    }
  ]
}
```

**Waarschuwingsregels (onmiddellijk afvuren):**

```json
{
  "alerts": [
    {
      "alert_id": "alert_workflow_failure",
      "condition": "success == false",
      "severity": "page",
      "throttle_seconds": 300,
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_latency_spike",
      "condition": "latency_ms > 600000",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_cost_spike",
      "condition": "cost_cents > 200",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_agent_timeout",
      "condition": "any(agent_metrics.latency_ms > 300000)",
      "severity": "page",
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_error_budget_exceeded",
      "condition": "burn_rate_pct_per_day > 0.01",
      "severity": "critical",
      "action": "page_engineering"
    }
  ]
}
```

---

## Incident response

Wanneer waarschuwing afvuurt, volg dit playbook:

### SEV1: Workflow faling

Volledige service outage (success_rate < 90% of latency > 10 min).

```
1. VERKLAAR INCIDENT
   ├─ Page on-call engineer
   ├─ Maak #incidents thread
   └─ Wijs IC (incident commander) toe

2. BEPAAL IMPACT (5 min)
   ├─ Hoeveel workflows gefaald? (% van verkeer)
   ├─ Welke agenten falen? (allemaal of specifieke agent?)
   ├─ Hoe lang aan de gang?
   └─ Beïnvloet het gebruikers? (inkomsten impact?)

3. ONDERZOEK (5-15 min)
   ├─ Controleer agent logs (laatst 30 agent calls)
   ├─ Controleer blackboard staat (is staat coherent?)
   ├─ Controleer infrastructuur (opslag, API rate limits)
   ├─ Controleer agent model (is model beschikbaar?)
   └─ Controleer upstream afhankelijkheden (APIs we bellen, zijn ze down?)

4. MITIGEER (kortste weg tot gebruiker impact reductie)
   ├─ Optie A: Disable workflow (feature flag)
   ├─ Optie B: Rollback naar laatst bekende werkende agent versie
   ├─ Optie C: Schaal resources op (als capaciteitsprobleem)
   └─ Optie D: Pas emergency hotfix toe (als simpele fix)

5. VERLOS (na mitigatie)
   ├─ Fix root cause (code, config, infrastructure)
   ├─ Deploy fix
   ├─ Verifieer metreken terug naar normaal
   └─ Plan post-mortem

6. COMMUNICEER (voortdurend)
   ├─ Interne updates elke 30 min
   └─ Klant status pagina updates
```

### SEV2: Agent timeout of degradatie

Één agent consistent traag (latency > 5 min) maar algemeen succes tarief > 90%.

```
1. ONDERZOEK (10 min)
   ├─ Welke agent is traag? (controleer agent_metrics.latency_ms)
   ├─ Is het consistent traag of intermitterend?
   ├─ Wat veranderde? (nieuw model? nieuwe prompt? nieuwe tools?)
   └─ Blokkeert het andere agenten? (wacht writer op analyst?)

2. MITIGEER
   ├─ Optie A: Wissel naar sneller model (Sonnet i.p.v. Opus)
   ├─ Optie B: Verminder input grootte (bijv. minder bronnen om te analyseren)
   ├─ Optie C: Voeg timeout toe en implementeer fallback agent
   └─ Optie D: Disable workflow tijdelijk

3. VERLOS
   ├─ Root cause analyse
   ├─ Deploy fix
   └─ Test voor re-enabling
```

### SEV3: Kost spike

Workflow kosten verhoogd > 50% (cost_cents > 150 voor slo_cost=100).

```
1. ONDERZOEK (5 min)
   ├─ Verhoogde token count? (input_tokens, output_tokens)
   ├─ Verhoogde retry count? (retries veld)
   ├─ Veranderde model? (bijv. Haiku → Opus)
   └─ Verhoogde tool call count?

2. MITIGEER
   ├─ Optie A: Verminder input context (minder bronnen naar analyst)
   ├─ Optie B: Wissel naar goedkoper model (als nauwkeurigheid acceptabel)
   ├─ Optie C: Voeg cache laag toe (cache onderzoeksresultaten per topic)
   └─ Optie D: Implementeer token budget (abort als > max_tokens)

3. VERLOS
   ├─ Optimaliseer system prompts (verwijder verbose preamble)
   ├─ Optimaliseer input formatting (verwijder redundante data)
   └─ Voeg expliciet token limit toe aan agent calls
```

---

## Rollback procedures

### Agent versie rollback

Als nieuwe agent versie fouten veroorzaakt:

```bash
# Current production agents
agents/roles/researcher.md@HEAD
agents/roles/analyst.md@HEAD
agents/roles/writer.md@HEAD

# Previous stable version (known to work)
agents/roles/researcher.md@v1.2.3
agents/roles/analyst.md@v1.2.3
agents/roles/writer.md@v1.2.3

# Rollback
git checkout v1.2.3 -- agents/roles/
# Verify in staging
# Deploy to production
```

### Workflow configuratie rollback

Als blackboard schema of coördinatie contract wijziging workflows breekt:

```bash
# Current config
workflows/agent-team-kickoff.md@HEAD

# Previous stable config
workflows/agent-team-kickoff.md@v1.1.0

# Rollback
git checkout v1.1.0 -- workflows/agent-team-kickoff.md
# Verify in staging
# Deploy to production
```

**Rollback checklist:**
- [ ] Identificeer welke component broken is
- [ ] Identificeer vorige stabiele versie
- [ ] Verificeer fix in staging environment (replay 10 recente executies)
- [ ] Voer rollback uit
- [ ] Monitor metreken voor 30 minuten
- [ ] Als metreken normaal, declareer hersteld
- [ ] Als nog failing, escaleer naar engineering team

---

## Escalatie paden

```
Gebruiker meldt fout
       ↓
Waarschuwing afgevuurd (SEV3: waarschuwing)
       ↓
Log naar #ops-alerts Slack
       ↓
Wacht 10 min op auto-herstel
       ↓
       ├─ Hersteld? → Sluit ticket, plan RCA
       │
       └─ Nog steeds failing?
              ↓
         Waarschuwing afgevuurd (SEV2: page)
              ↓
         Page on-call engineer
              ↓
         Acknowledgement in 5 min?
              ↓
         ├─ JA → Begin mitigatie
         │
         └─ NEE → Escaleer naar backup on-call
                ↓
         Page backup engineer
                ↓
         Acknowledgement in 5 min?
                ↓
         ├─ JA → Begin mitigatie
         │
         └─ NEE → Page engineering manager
                ↓
         Declareer SEV1
                ↓
         All-hands incident response
```

---

## Post-incident review

Na elk SEV1 of SEV2 incident, plan RCA (post-mortem):

```json
{
  "rca_id": "rca_2026_06_15_001",
  "incident_id": "inc_abc123",
  "workflow": "research_and_synthesize",
  "date": "2026-06-15",
  "severity": "SEV1",
  "duration_minutes": 18,
  "impact": {
    "workflows_failed": 847,
    "revenue_lost": 12340
  },
  "timeline": [
    {"time": "14:02", "event": "Alert fired: success_rate < 90%"},
    {"time": "14:05", "event": "On-call paged"},
    {"time": "14:08", "event": "Identified analyst timeout"},
    {"time": "14:15", "event": "Rolled back analyst to v1.2.3"},
    {"time": "14:20", "event": "Metrics recovered"}
  ],
  "root_cause": "Analyst agent system prompt was too verbose, causing token overflow and timeout",
  "contributing_factors": [
    "No token budget enforced at agent level",
    "Analyst timeout not caught by circuit breaker"
  ],
  "action_items": [
    {
      "action": "Add token budget to agent calls (max 5000 tokens)",
      "assigned_to": "alice@example.com",
      "due_date": "2026-06-20"
    },
    {
      "action": "Implement circuit breaker (fail fast after 3 timeouts)",
      "assigned_to": "bob@example.com",
      "due_date": "2026-06-25"
    },
    {
      "action": "Add agent latency SLI to monitoring dashboard",
      "assigned_to": "charlie@example.com",
      "due_date": "2026-06-18"
    }
  ]
}
```

---

## Voorbeeld: Incident response

**Incident:** Workflow faling spike op 2026-06-15 om 14:02 UTC.

```
14:02 → Alert fires: "research_and_synthesize success_rate = 85% (target 99.5%)"
14:02 → On-call paged
14:05 → IC (Alice) joins war room
14:05 → IC assess impact: ~800 workflows failed in last 3 minutes
14:07 → IC checks metrics: analyst agent latency spiked to 15 minutes (normal: 6 min)
14:09 → IC checks logs: analyst model API rate limited (hitting OpenAI quota? no, we use Anthropic)
14:10 → IC hypothesis: Analyst system prompt changed in last deploy
14:11 → IC checks git: Analyst prompt was updated 45 min ago
14:12 → IC reviews change: Added extensive reasoning preamble (200 tokens)
14:13 → IC rolls back: git revert HEAD~1 -- agents/roles/analyst.md
14:14 → IC deploys to production
14:15 → IC monitors: latency decreasing, success_rate recovering
14:20 → Metrics normal: latency = 6m, success_rate = 99.6%
14:22 → IC closes incident
14:30 → RCA scheduled for 2026-06-16

Action items:
- Add token budget enforcement (max 5000 input tokens per agent)
- Implement circuit breaker (fail after 3 consecutive timeouts)
- Add pre-deploy validation (max system prompt size 1000 tokens)
```

---
