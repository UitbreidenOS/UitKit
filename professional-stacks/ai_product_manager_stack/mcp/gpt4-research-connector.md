# GPT-4 Research Connector (MCP Integration)

**Purpose:** Leverage GPT-4 API for advanced research synthesis, competitive intelligence, and large-scale document processing in AI PM workflows.

---

## Overview

The GPT-4 Research Connector extends Claude's native capabilities with specialized research functions:
- **Market trend analysis:** Synthesize research reports, identify patterns
- **Competitive intelligence:** Summarize competitor announcements, positioning
- **Research synthesis:** Process interviews, surveys, user feedback at scale
- **Strategy synthesis:** Generate insights from disparate data sources

**Why GPT-4 (vs. native Claude)?**
- Specialized models for research use cases (improved context understanding)
- Faster processing of long documents (research reports, interview transcripts)
- Parallel processing (analyze 10 interviews simultaneously)
- Specialized reasoning for market analysis (better at numerical reasoning)

---

## Configuration

### Step 1: Add to settings.json

```json
{
  "mcp": {
    "gpt4-research": {
      "enabled": true,
      "type": "openai-api",
      "model": "gpt-4-turbo-preview",
      "api_key": "${OPENAI_API_KEY}",
      "api_endpoint": "https://api.openai.com/v1",
      "max_tokens": 4096,
      "temperature": 0.3,
      "timeout_seconds": 30,
      "retry_attempts": 3
    }
  }
}
```

### Step 2: Set API Key

```bash
export OPENAI_API_KEY="sk-..."
```

### Step 3: Test Connection

```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4-turbo-preview", "messages": [{"role": "user", "content": "Test"}], "max_tokens": 100}'

# Success: Returns 200 OK with response
```

---

## Use Cases & Examples

### Use Case 1: Competitive Intelligence Synthesis

**Prompt Template:**
```
You are a product strategy analyst. Analyze the following competitor announcements 
and identify:
1. Strategic direction (what are they building?)
2. Positioning shift (how does this change their market position?)
3. Threat level (how does this impact us?)
4. Response recommendation (what should we do?)

Competitor announcements:
[Competitor press releases, product launches, pricing changes]

Analyze and provide:
- Executive summary (1-2 sentences)
- Threat assessment (High/Medium/Low)
- Our competitive response (3-5 actions)
- Timeline (urgency of response)
```

**Example request (via MCP):**
```
/mcp gpt4-research analyze-competitor \
  --competitor "datadog" \
  --documents "datadog-q2-earnings.pdf,datadog-ai-ops-announcement.md"

GPT-4 returns:
{
  "summary": "Datadog announced AI Ops module with latency, cost, model health features",
  "threat_level": "HIGH",
  "positioning_shift": "From general DevOps to AI-native observability",
  "response": [
    "Differentiate on depth not breadth (own AI specialization)",
    "Lock in reference customers before Datadog catchup",
    "Message: 'AI-first, not DevOps-first'",
    "Accelerate 2 features Datadog doesn't have"
  ],
  "timeline": "6-12 months before feature parity risk"
}
```

---

### Use Case 2: Market Research Synthesis

**Prompt Template:**
```
You are a market research analyst. Synthesize the following market data and 
research into a TAM estimate.

Data sources:
1. Analyst reports: [Gartner, IDC, Forrester quotes]
2. Customer interviews: [Summary of 7 conversations]
3. Market comparables: [Similar products, their revenue]
4. Bottom-up estimates: [Customer count × ACV estimates]

Provide:
- TAM estimate (with range and confidence interval)
- SAM estimate (what we can realistically address)
- SOM estimate (Year 1 obtainable market)
- Key assumptions
- Risk factors
```

**Example request:**
```
/mcp gpt4-research estimate-tam \
  --segment "ai-ops" \
  --research-files "gartner-devops-2026.pdf,customer-interviews.txt,pricing-benchmarks.csv"

GPT-4 returns:
{
  "tam": {
    "estimate": 3000000000,
    "range": [2000000000, 4000000000],
    "confidence": "70%",
    "basis": "DevOps market $8.2B × AI Ops penetration 25-30%"
  },
  "sam": {
    "estimate": 450000000,
    "filters": ["geography: NA", "vertical: Tech", "company_size: Mid+"]
  },
  "som": {
    "year1": 2400000,
    "model": "20 customers × $100K ACV"
  },
  "key_assumptions": [
    "AI Ops is 25-30% of DevOps market",
    "15% penetration of SAM in Year 1",
    "No major price compression"
  ],
  "risks": [
    "Incumbent consolidation (Datadog, New Relic)",
    "Open-source adoption",
    "Regulatory delays"
  ]
}
```

---

### Use Case 3: Research Synthesis at Scale

**Prompt Template:**
```
You are a user research analyst. Process the following interview transcripts 
and synthesize into personas, jobs-to-be-done, and design requirements.

Input: 7 interview transcripts (40-60 min each, ~50K words total)

Output:
1. Personas (2-3, with demographics, goals, pain points)
2. Jobs-to-be-done (prioritized by frequency)
3. Use cases (top 3-5)
4. Design requirements (functional, non-functional)
5. Confidence levels (high/medium/low)
```

**Example request:**
```
/mcp gpt4-research synthesize-research \
  --interview-files "interviews/*.txt" \
  --output-format "personas,jobs,use-cases,design-reqs"

GPT-4 processes all transcripts in parallel, returns:
{
  "personas": [
    {
      "name": "ML Ops Engineer",
      "demographics": {
        "title": "ML Ops Engineer / Platform Engineer",
        "company_size": "50-500",
        "industry": "Tech/SaaS"
      },
      "goals": ["Reduce toil", "Enable data scientists", "Optimize costs"],
      "pain_points": ["Latency invisible", "Cost opaque", "Model testing manual"],
      "buying_power": "$100K/year without approval"
    }
  ],
  "jobs": [
    {
      "job": "Monitor inference latency in real-time",
      "frequency": 5,
      "importance": "High",
      "current_workaround": "Manual Prometheus checks"
    }
  ],
  "confidence": "High on pain points; Medium on pricing tolerance"
}
```

---

### Use Case 4: Win/Loss Analysis

**Prompt Template:**
```
You are a sales analyst. Analyze win/loss patterns from the following sales data.

Input:
- 10 closed deals (5 wins, 5 losses)
- Opportunity details (company size, deal size, timeline)
- Why we won/lost (sales notes, customer feedback)
- Competitive alternatives

Synthesize:
1. Win patterns (common characteristics of our wins)
2. Loss patterns (why we lose)
3. Buyer persona profile (who buys from us?)
4. Competitive positioning (vs. whom are we losing?)
5. Sales strategy recommendations
```

**Example request:**
```
/mcp gpt4-research analyze-win-loss \
  --deals-file "crm-export-last-30-days.csv" \
  --salesforce-connection true

GPT-4 returns:
{
  "win_rate": 0.50,
  "win_patterns": [
    "Wins against open-source (70%)",
    "Wins when DIY cost is high (80%)",
    "Wins when latency pain is acute (85%)"
  ],
  "loss_patterns": [
    "Loss to Datadog (30%): Incumbent + breadth",
    "Loss to New Relic (40%): Compliance requirement not met",
    "Loss to homegrown (20%): Cost sensitivity"
  ],
  "buyer_persona": {
    "segment": "Scale-ups (50-300 people)",
    "role": "ML Ops Engineer or VP Product",
    "trigger": "Latency issue in production",
    "buying_cycle": "6-8 weeks"
  },
  "recommendations": [
    "Message to Scale-ups: Speed to value (3 min setup)",
    "Enterprise play: Lead with compliance roadmap",
    "Competitive positioning: AI-first, not general DevOps"
  ]
}
```

---

## Integration with Skills

### Market Research Skill + GPT-4 Connector

```markdown
## Instruction: Use GPT-4 to synthesize market research

1. **Data gathering:**
   - Analyst reports (Gartner, IDC)
   - Customer interviews (7 conversations)
   - Competitive pricing data
   → Aggregate into inputs/

2. **Call GPT-4 Research Connector:**
   ```
   /mcp gpt4-research estimate-tam \
     --segment [segment] \
     --data-directory inputs/
   ```

3. **Synthesize output:**
   - Triangulate TAM estimates
   - Identify key assumptions
   - Flag risks
   → Create Market Research report

4. **Deliverable:**
   - TAM/SAM/SOM estimates
   - Confidence intervals
   - Risk assessment
```

### User Research Synthesis Skill + GPT-4 Connector

```markdown
## Instruction: Use GPT-4 to process research at scale

1. **Collect research data:**
   - Interview transcripts (7 × 50 min = 350 min)
   - Survey responses (100+)
   - Support tickets (200)
   → Upload to GPT-4 Research Connector

2. **Call GPT-4 for synthesis:**
   ```
   /mcp gpt4-research synthesize-research \
     --interviews "interviews/*.txt" \
     --surveys "surveys.json" \
     --support-tickets "support-export.csv"
   ```

3. **Validate output:**
   - Does persona profile match interviews?
   - Are JTBD ranked by frequency?
   - Are design requirements grounded in quotes?

4. **Deliverable:**
   - Personas (2-3)
   - Jobs-to-be-done (5-6, ranked)
   - Use cases (top 3)
   - Design requirements
```

---

## Cost & Performance

### Token Usage Estimation

| Use Case | Input Tokens | Output Tokens | Estimated Cost |
|----------|--------------|---------------|----------------|
| Competitor analysis (1 announcement) | 2,000 | 500 | $0.07 |
| Market TAM synthesis (5 sources) | 5,000 | 1,000 | $0.18 |
| Interview synthesis (7 interviews) | 25,000 | 2,000 | $0.89 |
| Win/loss analysis (10 deals) | 3,000 | 800 | $0.11 |
| Monthly total (estimated) | 50,000 | 10,000 | ~$2.00 |

### Performance Benchmarks

| Task | Time (GPT-4) | Time (Manual) | Speedup |
|------|--------------|---------------|---------|
| Analyze competitor announcement | 30 sec | 30 min | 60x |
| Synthesize TAM estimate | 2 min | 4 hours | 120x |
| Process 7 interviews | 3 min | 8 hours | 160x |
| Win/loss analysis (10 deals) | 1 min | 2 hours | 120x |

---

## Best Practices

### 1. Temperature Settings by Use Case

```json
{
  "market_research": {
    "temperature": 0.2,
    "rationale": "Conservative; we want facts, not creativity"
  },
  "competitive_analysis": {
    "temperature": 0.3,
    "rationale": "Analytical; interpretive but grounded"
  },
  "research_synthesis": {
    "temperature": 0.4,
    "rationale": "Balanced; need both analysis and insight"
  }
}
```

### 2. Prompt Engineering

**Good prompt:**
```
Analyze the following 7 interview transcripts and extract:
1. Top 3 pain points (ordered by frequency)
2. Jobs-to-be-done (with supporting quotes)
3. Feature requests (grouped by theme)

Transcripts: [files]

Respond in JSON format with high/medium/low confidence for each finding.
```

**Bad prompt:**
```
Analyze these interviews.
```

### 3. Validation & Fact-Checking

```
Always validate GPT-4 output:
- Check quotes are accurate (grounded in source)
- Verify numbers (don't hallucinate statistics)
- Cross-reference with multiple sources
- Use confidence scores (output format should include these)
```

### 4. Streaming Responses

For long analyses, use streaming:

```bash
/mcp gpt4-research estimate-tam \
  --streaming true \
  --segment "ai-ops"
  
# Returns partial results as they're generated (real-time)
```

---

## Troubleshooting

### Issue: "Rate limit exceeded"
**Solution:** Implement exponential backoff
```json
{
  "retry_policy": {
    "max_retries": 3,
    "initial_backoff_ms": 1000,
    "max_backoff_ms": 32000
  }
}
```

### Issue: "Token limit exceeded" (for large documents)
**Solution:** Split documents, process in batches
```bash
# Bad: One large request
/mcp gpt4-research synthesize-research --input large-document.txt

# Good: Split and batch
split-transcript.sh interviews/ --chunk 15000-tokens
/mcp gpt4-research synthesize-research \
  --input interviews-chunked/ \
  --batch-mode true
```

### Issue: "Hallucination" (GPT-4 making up data)
**Solution:** Use low temperature + validation
```json
{
  "temperature": 0.1,
  "max_tokens": 2000,
  "require_citations": true,
  "validation": "manual-review-required"
}
```

---

## Security & Privacy

### Data Handling

**Safe to send to GPT-4:**
- Aggregated insights ("5 customers mentioned latency")
- Anonymized quotes
- Public competitive information
- Market-level data

**NOT safe to send:**
- Customer names, emails, specific IDs
- Financial data (revenue, pricing, contracts)
- Proprietary code or product details
- Personal information from interviews

### Configuration

```json
{
  "gpt4-research": {
    "pii_redaction": "enabled",
    "data_encryption": "tls",
    "retention_days": 0,
    "audit_logging": "enabled"
  }
}
```

---

## Examples in Action

### Example 1: Quarterly Competitive Review

```bash
# 1. Fetch all competitor announcements this quarter
/mcp research fetch-competitor-news --competitors "datadog,new-relic" --days 90

# 2. Analyze with GPT-4
/mcp gpt4-research analyze-competitor \
  --documents "competitor-news/*.md" \
  --output "threat-assessment.json"

# 3. Cross-reference with win/loss data
/mcp gpt4-research analyze-win-loss --period "last-quarter"

# 4. Synthesize into report
Output: "Quarterly Competitive Assessment" report
```

### Example 2: User Research Sprint

```bash
# 1. Collect research
interviews/
  ├── interview-1.txt (45 min)
  ├── interview-2.txt (50 min)
  └── interview-7.txt (40 min)

# 2. Synthesize with GPT-4
/mcp gpt4-research synthesize-research \
  --interviews "interviews/*.txt" \
  --output-format "personas,jobs,design-reqs"

# 3. Validate output (manual)
PM reviews personas, checks against notes

# 4. Finalize
Output: User Research Summary + Design Brief
```

---

## Integration Roadmap

**Current:** GPT-4 Turbo (gpt-4-turbo-preview)

**Planned:**
- GPT-4o (faster, cheaper) — Q3 2026
- Custom fine-tuned models (PM-specific patterns) — Q4 2026
- Multimodal (process screenshots, videos) — Q4 2026

---

**Last updated:** June 15, 2026  
**Status:** Production-ready  
**Maintenance:** OpenAI updates, quarterly validation
