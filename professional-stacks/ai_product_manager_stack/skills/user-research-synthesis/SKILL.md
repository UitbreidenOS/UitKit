# User Research Synthesis

## When to activate

You have raw user research (interview transcripts, survey responses, usage data) and need to distill it into actionable insights: personas, jobs-to-be-done, use cases, or design requirements. Use this skill for design handoffs, feature validation, persona development, or user journey mapping.

---

## When NOT to use

- For conducting the interviews (that's user research methodology, not synthesis)
- For market-level analysis (use Market Research skill)
- For feature prioritization based on demand (use Feature Prioritization skill)
- For validating your own ideas without listening to users (don't skip the research step)

---

## Instructions

### Step 1: Organize Raw Research Data

**Gather all available sources:**
- Interview transcripts (30-60 min interviews with 5-15 customers)
- Survey responses (for scale; 50+ respondents is ideal)
- Usage data (log analysis, heatmaps, funnel drops)
- Support tickets (complaint themes, feature requests)
- Sales notes (pain points from conversations)
- Behavioral data (which features used, which abandoned)

**Template to organize:**
```markdown
## Research Data Inventory

### Interview Data
- 7 interviews conducted (June 2026)
- Average duration: 45 minutes
- Participants: 4 scale-ups, 2 mid-market, 1 enterprise
- Transcripts: Available in [path]

### Survey Data
- 102 responses (email list + product onboarding)
- Questions: [link to survey]
- Response rate: 8% (typical for product surveys)

### Usage Data
- Time period: May 1-31, 2026 (30 days)
- Metrics: Feature adoption, funnel drops, time-to-first-value
- Tool: [analytics platform]

### Support Data
- 200 support tickets (last 60 days)
- Themes: Onboarding (40%), Feature request (35%), Bug (25%)
- Tool: Zendesk

### Sales Data
- 30 conversations with prospects
- Common objections: Cost (30%), Compliance (20%), Incumbency (50%)
- Gating factors: [list]
```

### Step 2: Extract Themes (Open Coding)

**Read through all raw data. Identify patterns. Code manually or use AI tool.**

**Process:**
1. Read 2-3 interviews carefully; write down themes you notice
2. Go through remaining interviews; tag quotes that illustrate each theme
3. Identify new themes that don't fit existing buckets
4. Count theme frequency (how many customers mentioned each)

**Example theme extraction (AI Ops platform):**

```
Interview 1: "We spend 2 weeks every release debugging latency issues.
There's no visibility into which model version caused the slowdown."

Interview 2: "Our biggest pain is not knowing whether GPT-4 or Claude is
faster for our use case. We A/B test, but manual."

Interview 3: "Cost is a black box. We don't know which features are expensive."

Interview 4: "We have 3 people doing what should be 1 person's job because
there's no automation for model monitoring."

Themes extracted:
- Theme A: Lack of latency visibility [Interviews 1, 2] → Pain: "Can't debug slow models"
- Theme B: Model comparison is manual [Interview 2] → Pain: "No automated A/B testing"
- Theme C: Cost opacity [Interview 3] → Pain: "Don't know where money goes"
- Theme D: Operational overhead [Interview 4] → Pain: "Too much toil for monitoring"

Frequency count:
- Latency visibility: 2/4 (50%)
- Cost transparency: 1/4 (25%)
- Model comparison: 1/4 (25%)
- Operational overhead: 1/4 (25%)
```

### Step 3: Identify Jobs-to-be-Done (JTBD)

**Convert pain themes into customer jobs.**

**JTBD format:** "As [persona], I need to [job], so that [outcome]."

**Example JTBD extraction:**

```
Pain: Lack of latency visibility
→ Job 1: "Monitor inference latency in real-time"
→ Job 2: "Debug latency regressions across model versions"

Pain: Model comparison is manual
→ Job 3: "Compare performance (latency, cost, accuracy) across models"
→ Job 4: "A/B test models in production safely"

Pain: Cost opacity
→ Job 5: "Track and visualize inference costs by model/feature/customer"

Pain: Operational overhead
→ Job 6: "Automate anomaly detection and alerting for ML models"

Priority (by frequency + stated importance):
1. Monitor inference latency (high pain, 50% of sample)
2. Automate anomaly detection (high pain, enables ops efficiency)
3. Compare models objectively (high pain, blocks feature development)
4. Track costs (medium pain, enables optimization)
5. A/B test models safely (medium pain, valuable but not urgent)
```

### Step 4: Build Personas

**Create 2-4 personas** (more than 4 is too many).

**Persona structure:**
```markdown
## Persona: [Name]

### Demographics
- Title: [Job title]
- Company size: [Number of employees]
- Industry: [Vertical]
- Company stage: [Seed/Growth/Mature]
- Location: [Geography]

### Goals
- Goal 1: [What they're trying to accomplish]
- Goal 2: [What they're trying to accomplish]
- Goal 3: [What they're trying to accomplish]

### Pain Points
- Pain 1: [Current problem]
- Pain 2: [Current problem]
- Pain 3: [Current problem]

### Current Solution
- Tool 1: [What they use now]
- Tool 2: [What they use now]
- Workaround: [Manual process or hack]

### Motivations for Change
- Reason 1: [Why they'd switch]
- Reason 2: [Why they'd switch]
- Reason 3: [Why they'd switch]

### Buying Power
- Budget authority: [Do they control budget?]
- Budget size: [How much can they spend?]
- Decision timeline: [Fast/slow?]
- Risk tolerance: [High/medium/low?]

### Communication Preferences
- Channels: [How to reach them]
- Content type: [What they consume]
- Decision drivers: [What matters to them?]

### Success Metrics
- Metric 1: [How they measure success]
- Metric 2: [How they measure success]
- Metric 3: [How they measure success]
```

**Example persona (AI Ops):**

```markdown
## Persona 1: ML Ops Engineer

### Demographics
- Title: ML Ops Engineer / Platform Engineer
- Company size: 50-500 employees
- Industry: Tech/SaaS (AI-native)
- Company stage: Growth (Series A-B)
- Location: NA (SF Bay, NYC, Austin)

### Goals
- Reduce manual toil in ML monitoring (spend <10% time debugging latency)
- Enable model A/B testing in production (self-serve for data scientists)
- Optimize inference costs (save 20%+ through model routing)

### Pain Points
- Latency issues go undetected until customers complain
- Model comparison is manual (takes 2 weeks to evaluate new model)
- Cost is opaque (don't know which feature/model is expensive)

### Current Solution
- Tool 1: Prometheus + custom scripts (latency monitoring)
- Tool 2: Manual A/B testing (write code, deploy, analyze)
- Workaround: "We have a person who just monitors dashboards"

### Motivations for Change
- Automate latency detection (reduce incident response time from 2 hours to 5 min)
- Enable self-serve model testing (unblock data scientists)
- Optimize costs (prove ROI to finance)

### Buying Power
- Budget authority: Owns $500K+ eng budget; consults with CTO on tools
- Budget size: $100-150K/year for tools
- Decision timeline: 6-8 weeks (faster than enterprise; still evaluation period)
- Risk tolerance: Medium-High (startup culture)

### Communication Preferences
- Channels: Slack communities, technical blogs, product-led signup
- Content type: Technical deep-dives, open-source examples, case studies
- Decision drivers: Ease of setup (wants working system in <1 day), developer UX

### Success Metrics
- Latency detection time (from <5 min)
- Time to A/B test a model (from 2 weeks to 1 day)
- Cost savings from optimization (target: 20%)

---

## Persona 2: VP of Product / Data Science Manager

### Demographics
- Title: VP of Product / Head of Data Science
- Company size: 200-1K employees
- Industry: Tech/SaaS/FinTech
- Company stage: Growth to Late-stage (Series B-C)
- Location: NA

### Goals
- Ship more models faster (reduce release cycle from monthly to weekly)
- Reduce model failures in production (maintain 99.5% uptime)
- Measure model impact on business metrics (track unit economics)

### Pain Points
- High latency on new models blocks feature launches
- Model bugs (accuracy drop) discovered late
- Can't correlate model performance to business outcomes

### Current Solution
- Tool 1: Datadog for infrastructure monitoring
- Tool 2: Manual analysis of model performance
- Workaround: "We do daily model checks manually"

### Motivations for Change
- Automate model health checks (earlier detection)
- Integrate model monitoring with business metrics
- Enable non-technical stakeholders to understand model impact

### Buying Power
- Budget authority: Owns $2M+ annual budget
- Budget size: $500K-2M for tools
- Decision timeline: Slow (4-6 month RFP process)
- Risk tolerance: Low (enterprise-like, risk-averse)

### Communication Preferences
- Channels: LinkedIn, industry conferences, sales outreach
- Content type: Executive summaries, ROI calculators, case studies from peers
- Decision drivers: Proven ROI, compliance/security (SOC 2, etc.), vendor stability

### Success Metrics
- Model release cadence (from monthly to weekly)
- Production model failure rate (target: <0.5%)
- Business impact measurement (revenue uplift from model, cost reduction)
```

**Tips for building personas:**
- Use names and photos (makes them feel real)
- Ground in actual quotes from interviews
- Keep to 1-2 pages max (personas die if they're novels)
- Create 2-4 personas (more is analysis paralysis)
- Update annually as market/product evolves

### Step 5: Map Use Cases

**From JTBD + personas, extract specific use cases (workflows).**

**Format:**
```markdown
## Use Case 1: [Name]

### Persona
[Which persona does this apply to?]

### Scenario
[What situation triggers this use case?]

### Current Workflow
1. [Step 1: What they do today]
2. [Step 2]
3. [Step 3]
4. [Pain point / inefficiency]

### Desired Workflow
1. [Step 1: What they want to do]
2. [Step 2]
3. [Step 3]
4. [Expected benefit]

### Success Criteria
- Metric 1: [How to measure success]
- Metric 2: [How to measure success]
- Metric 3: [How to measure success]
```

**Example use case:**

```markdown
## Use Case 1: Debug Inference Latency Regression

### Persona
ML Ops Engineer (startup scale)

### Scenario
Production inference latency increased 40% overnight. Customers are complaining. 
Need to figure out why and fix it ASAP (target: 1-2 hours).

### Current Workflow (Painful)
1. Check Prometheus dashboard (generic latency metric)
2. Correlate with recent deployments (manual review of git log)
3. Check model version: Is it the new model, or old model version?
4. Check inference environment: Is it a resource constraint (CPU/GPU)?
5. Manual analysis of logs (grep, tail, interpret)
6. Create hypothesis, test in staging, roll back if wrong
**Pain:** Takes 2-3 hours; requires manual sleuthing; blocks incident response

### Desired Workflow (Ideal)
1. Alert fires: "Latency anomaly detected on model_v3 in prod"
2. Open dashboard; see: 
   - Which model version caused latency spike
   - Which feature/customer segment affected
   - Cost impact (additional spend due to higher inference load)
3. Decision: Rollback model_v3 to model_v2, or investigate further
4. Hit "Rollback" button; automatic canary test (5% traffic to old model)
5. If no issues, shift 100% traffic back
**Benefit:** <5 min to detect, <10 min to resolve; ops engineer can handle alone

### Success Criteria
- Detection time: <5 min (vs. 2-3 hours today)
- Resolution time: <10 min (vs. 1-2 hours today)
- Automation level: 80% of incidents resolved with <1 click (vs. manual today)
- Team efficiency: Save 10 hours/month per ops engineer (freed up for proactive work)
```

### Step 6: Extract Design Requirements

**From use cases + JTBD, derive feature/design requirements.**

**Requirements template:**
```markdown
## Feature: [Feature Name]

### Related JTBD
- Job 1: [Associated job]
- Job 2: [Associated job]

### Related Use Case
- Use Case 1: [Associated use case]

### Functional Requirements
- FR1: [What the system must do]
- FR2: [What the system must do]
- FR3: [What the system must do]

### Non-Functional Requirements
- Performance: [Speed/latency target]
- Scalability: [Data volume, user count]
- Reliability: [Uptime SLA, error handling]
- Usability: [UX standards, accessibility]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Design Notes
[Any specific UX/interaction patterns to support]
```

**Example design requirements:**

```markdown
## Feature: Latency Anomaly Detection

### Related JTBD
- Job: Monitor inference latency in real-time
- Job: Debug latency regressions across model versions

### Related Use Case
- Use Case: Debug Inference Latency Regression

### Functional Requirements
- FR1: Detect latency spikes >30% within 5 minutes of occurrence
- FR2: Identify which model/feature/segment caused spike
- FR3: Auto-suggest rollback or investigation (was it code, infrastructure, or data?)
- FR4: Enable 1-click rollback to previous model version
- FR5: Show impact of rollback in real-time (A/B test)

### Non-Functional Requirements
- Performance: Detection latency <5 min; dashboard load <1 sec
- Scalability: Support 1000 requests/sec per customer
- Reliability: 99.9% uptime for alerting
- Usability: No training required; works for non-data-scientists

### Acceptance Criteria
- [ ] Anomaly detected in < 5 minutes (from incident to alert)
- [ ] Root cause identified correctly 85% of the time
- [ ] Rollback completes in < 2 minutes
- [ ] System survives 1000 req/sec load test

### Design Notes
- Alert should include: [metric], [model], [customer impact], [suggested action]
- Rollback flow: Show preview impact, then 1-click execute
- Should work via API (for automated remediation) and UI (for manual review)
```

### Step 7: Create Synthesis Deliverable

**Format: User Research Summary Report (8-12 pages)**

```markdown
# User Research Synthesis: AI Operations Intelligence (Q2 2026)

## Executive Summary

**Research scope:** 7 customer interviews (scale-ups + mid-market), 102 survey responses, 
200 support tickets, 30 sales conversations. 

**Key finding:** ML Ops engineers are overwhelmed with manual toil (latency debugging, 
model comparison, cost tracking). They want **automation (anomaly detection), visibility 
(cost/performance), and self-serve (A/B testing)**. Buying power varies: Individual 
engineers can adopt (self-serve), but larger purchases require VP/manager approval.

**Research confidence:** High on pain points (5+ mentions each); Medium on willingness 
to pay (small sample); Medium on feature priorities (may shift with market).

---

## Research Methodology

### Interview Data
- 7 interviews conducted May 20-June 10, 2026
- Participants: 4 scale-ups (50-300 people), 2 mid-market (300-1K), 1 enterprise
- Duration: 40-60 minutes each
- Format: Semi-structured (prepared questions + follow-ups)

### Survey Data
- 102 responses (email list + product signup)
- 8% response rate
- Questions focused on: Current tools, pain points, willingness to pay, feature priorities

### Usage Data
- 30 days (May 1-31, 2026)
- Metrics: Feature adoption, funnel, time-to-first-value, churn triggers

### Support Data
- 200 support tickets (last 60 days)
- Themes: Onboarding (40%), feature requests (35%), bugs (25%)

---

## Key Findings

### Finding 1: Latency Visibility is Job #1
**Evidence:** 5/7 interviews mentioned latency debugging as top pain
- "Latency issues go undetected until customers complain"
- "We spend 2 weeks debugging which model version caused slowdown"
- "Current tools (Datadog) don't understand model-specific latency"

**Implication:** Latency monitoring feature is table-stakes for product viability.

**Quantitative:** 5/7 (71%) of interviewees; strongly stated pain (unprompted)

### Finding 2: Cost Opacity is a Close Second
**Evidence:** 4/7 interviews mentioned cost as pain
- "We don't know which models are expensive"
- "Cost is a black box; we don't correlate to revenue"
- "Finance wants to know ROI of inference"

**Implication:** Cost tracking feature is high-value for both ops and finance alignment.

**Quantitative:** 4/7 (57%) of interviewees

### Finding 3: Model A/B Testing Needs Automation
**Evidence:** 3/7 interviews mentioned model testing as manual/slow
- "Evaluating new models takes 2-3 weeks of manual work"
- "We write Python scripts to compare performance"
- "Can't safely test new models in production today"

**Implication:** Self-serve A/B testing tool (non-technical) is differentiated feature.

**Quantitative:** 3/7 (43%) of interviewees

### Finding 4: Buying Power Varies by Persona
**Evidence:** Interview patterns show two distinct personas
- **ML Ops Engineers:** Self-serve adopters; can spend <$100K without approval
- **VP of Product/Data Science:** Need compliance (SOC 2), budget approval, vendor stability

**Implication:** Go-to-market must address both; don't assume all prospects buy same way.

**Quantitative:** 4 engineers (self-serve path); 2 VPs (enterprise path); 1 hybrid

### Finding 5: Onboarding is Critical to Adoption
**Evidence:** 40% of support tickets are onboarding-related
- "Too complicated to get up and running"
- "Took 30 minutes just to see first metric"
- "We have to hire someone to integrate this" (negative signal)

**Implication:** 3-minute time-to-first-value is must-have. Anything >15 min loses users.

**Quantitative:** 40/100 support tickets; 3/7 interviews mentioned ease-of-setup

---

## Personas

### Persona 1: ML Ops Engineer (Scale-up)
**Profile:** 28-year-old engineer, 50-300 person company, Series A-B stage

**Motivation:** Reduce toil, enable data scientists, ship faster

**Goals:**
1. Reduce manual latency debugging (save 10+ hours/month)
2. Enable self-serve A/B testing (unblock data scientists)
3. Optimize costs (prove ROI to finance)

**Pain Points:**
- Latency issues go undetected
- Model comparison is manual (2-3 weeks)
- Cost is opaque

**Budget:** Can spend $50-100K/year without approval; prefers <$10K/month

**Sales motion:** Self-serve; wants to try before buying; needs working proof in <1 day

**Top feature:** Latency anomaly detection + 1-click rollback

---

### Persona 2: VP Product / Head of Data Science (Mid-market+)
**Profile:** 35-year-old manager, 300-1K+ person company, Series B-C stage

**Motivation:** Ship more models, reduce failures, measure impact

**Goals:**
1. Accelerate model release cadence (from monthly to weekly)
2. Reduce production model failures
3. Align model decisions with business metrics

**Pain Points:**
- High latency blocks releases
- Model bugs discovered late
- Can't measure model impact on business

**Budget:** $500K-2M/year; needs ROI justification; CTO/VP Eng approval required

**Sales motion:** 4-6 month evaluation; needs compliance (SOC 2), references, vendor stability

**Top feature:** Business metrics integration + automated health checks

---

## Jobs-to-be-Done (JTBD)

Prioritized by frequency + stated importance:

### Job 1: Monitor inference latency in real-time (High Priority)
- Frequency: 5/7 interviews
- Importance: Stated as "top pain" by 4/7
- Current workaround: Manual Prometheus dashboard checks

### Job 2: Debug latency regressions across model versions (High Priority)
- Frequency: 4/7 interviews
- Importance: Stated as "takes 2-3 hours" (high cost)
- Current workaround: Manual log analysis

### Job 3: Automate anomaly detection for ML models (Medium Priority)
- Frequency: 3/7 interviews
- Importance: "Would save 10+ hours/month"
- Current workaround: Manual monitoring + on-call

### Job 4: Compare performance (latency, cost, accuracy) across models (Medium Priority)
- Frequency: 3/7 interviews
- Importance: "Blocks feature development"
- Current workaround: Manual Python scripts

### Job 5: A/B test models in production safely (Medium Priority)
- Frequency: 3/7 interviews
- Importance: "Non-technical team can't do this"
- Current workaround: None; deferred (blocked)

### Job 6: Track inference costs by model/feature/customer (Medium Priority)
- Frequency: 4/7 interviews
- Importance: "Finance needs this for ROI"
- Current workaround: Manual log aggregation

---

## Use Cases (Detailed)

### Use Case 1: Debug Inference Latency Regression
**Persona:** ML Ops Engineer (Scale-up)
**Frequency:** Happens ~2x/month
**Criticality:** High (customers complaining)

**Current workflow:**
1. Customer reports slow inference
2. Check Prometheus; see latency spike
3. Correlate with git log; identify which deployment/model
4. Manual log analysis to confirm root cause
5. Hypothesis: Old model or new model or infrastructure?
6. Test in staging; if wrong hypothesis, repeat
**Time to resolution:** 2-3 hours
**Cost:** Blocks one engineer for half day

**Desired workflow:**
1. System alerts: "Model_v3 latency anomaly detected (40% spike)"
2. Open dashboard; see root cause suggestion (model version, feature, segment)
3. 1-click rollback to previous version
4. Dashboard shows A/B test result in real-time
**Time to resolution:** <10 minutes
**Benefit:** Reduces toil, enables faster incident response

---

### Use Case 2: Evaluate New Model for Production
**Persona:** Data Scientist (requesting) + ML Ops Engineer (executing)
**Frequency:** ~1x/week
**Criticality:** Medium (blocks feature development)

**Current workflow:**
1. Data scientist trains new model (GPT-4 vs. Claude)
2. ML Ops engineer sets up A/B test infrastructure (custom code)
3. Deploy to staging; run manual tests
4. Compare accuracy/latency/cost (spreadsheet)
5. Make decision; if approved, deploy to production manually
6. Monitor results manually for 2 weeks
**Time to decision:** 2-3 weeks
**Cost:** 1 engineer for 2-3 weeks

**Desired workflow:**
1. Data scientist uploads new model to platform
2. System auto-runs A/B test (5% production traffic)
3. Dashboard shows results in 4 hours: accuracy, latency, cost, user satisfaction
4. Data scientist clicks "Deploy" if satisfied
5. System auto-shifts traffic over 24 hours; alerts on anomalies
**Time to decision:** 1 day
**Benefit:** Accelerates model release by 10x

---

## Feature Requirements (from JTBD + Use Cases)

### Feature 1: Latency Anomaly Detection
- **JTBD:** Monitor inference latency in real-time + Debug regressions
- **Requirement:** Detect latency spikes >30% within 5 minutes
- **Success metric:** <5 min detection time; <10 min resolution time

### Feature 2: Model Comparison Dashboard
- **JTBD:** Compare performance across models
- **Requirement:** Auto-compare accuracy, latency, cost; highlight winner
- **Success metric:** Reduce model eval time from 2 weeks to 1 day

### Feature 3: Cost Tracking
- **JTBD:** Track inference costs
- **Requirement:** Show cost by model, feature, customer segment
- **Success metric:** 80% cost visibility (vs. 0% today)

### Feature 4: A/B Testing Framework
- **JTBD:** A/B test models in production safely
- **Requirement:** Deploy new model to X% traffic; auto-monitor results
- **Success metric:** Enable non-technical users to A/B test (vs. engineer-only today)

### Feature 5: Alerts & Remediation
- **JTBD:** Automate anomaly detection
- **Requirement:** Alert on anomaly + suggest action (rollback, investigate)
- **Success metric:** Auto-resolve 80% of incidents without human intervention

---

## Design Implications

### Implication 1: Time-to-value is make-or-break
- Minimum: <3 min to first metric visible
- <15 min for non-technical user to be productive
- Implication: Onboarding flow is critical; invest heavily here

### Implication 2: Multiple personas, multiple selling motions
- Engineers want self-serve; managers want compliance + proof
- Implication: Build both (freemium for engineers; enterprise sales for managers)

### Implication 3: Cost visibility creates new feature opportunities
- Not just "show cost"; also "optimize cost" (model routing, caching)
- Implication: Costs feature is a wedge; can upsell optimization tools

### Implication 4: A/B testing is table-stakes for data scientists
- Currently only technical users can do this
- Implication: Non-technical UX for A/B testing is differentiator

### Implication 5: Compliance matters for mid-market+
- VP interviewees mentioned SOC 2, GDPR, audit trails
- Implication: Plan for compliance early (not post-sale)

---

## Research Confidence & Caveats

### High confidence findings
- Latency visibility is critical pain (5/7 interviews, unprompted)
- Cost tracking is valuable (4/7 interviews, unprompted)
- Onboarding/ease-of-use is make-or-break (40% of support tickets)

### Medium confidence findings
- Model A/B testing is willing-to-pay feature (3/7 interviews, maybe overstated)
- Exact pricing/budget tolerance (small sample, may not represent market)
- Enterprise sales motion (only 1 enterprise interviewee)

### Limitations
- Small sample size (7 interviews, 102 surveys)
- Geographic bias (mostly US; EU/APAC underrepresented)
- Selection bias (only talked to current prospects; not customers of competitors)
- Timing (market may shift between now and launch)

---

## Validation Plan (Next 90 days)

- [ ] 5 more interviews (add EU/APAC representation; deepen enterprise understanding)
- [ ] Build prototype of latency detection feature; test with 3 customers
- [ ] Build prototype of model A/B testing UI; test with 3 data scientists
- [ ] Refine personas based on new data
- [ ] Quantify willingness to pay (survey 50+ prospects)

---

**Report prepared:** June 15, 2026  
**Data source:** 7 interviews, 102 surveys, usage data, support data  
**Research confidence:** 7/10 (small sample; good triangulation)  
**Next update:** September 1, 2026 (post-beta launch feedback)
```

---

## Example

AI Ops product research synthesis (Q2 2026):
- **Top JTBD:** Latency monitoring > cost tracking > model A/B testing
- **Primary persona:** ML Ops Engineer in scale-ups (self-serve buyer)
- **Secondary persona:** VP of Product in mid-market+ (enterprise buyer, slower cycle)
- **Key use case:** Debug latency regressions (currently takes 2-3 hours; target: <10 min)
- **Design implications:** Onboarding is critical; build for both engineers and managers
- **Confidence level:** High on pain (latency/cost); Medium on pricing/willingness-to-pay

---

## Tools & Templates

**Interview coding template:**
```
Interview #: [1-7]
Participant: [Name, title, company]
Duration: [Time]

Themes identified:
- Theme A: [Description] [Quote 1] [Quote 2]
- Theme B: [Description] [Quote 1]
```

**JTBD extraction template:**
```
Pain point: [Description]
→ Job: [As X, I need to Y, so that Z]
→ Frequency: [How often?]
→ Importance: [Critical / High / Medium / Low]
```

**Persona template:** (see Step 4 above)

**Use case template:** (see Step 5 above)

