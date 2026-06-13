---
name: lead-enrichment
description: "Lead enrichment pipelines: web scraping to structured prospect profiles, company intelligence signals, CRM population — Firecrawl, Clearbit, Apollo patterns"
updated: 2026-06-13
---

# Lead Enrichment Skill

## When to activate
- Building a pipeline that turns a raw email/URL list into rich prospect profiles
- Scraping company websites and LinkedIn for firmographic data
- Populating HubSpot/Salesforce records from external research
- Generating ICP scores based on enriched company data
- Monitoring signals (funding rounds, hiring surges, exec changes) for account triggers

## When NOT to use
- Single ad-hoc lookups — use a browser or LinkedIn directly
- Bulk B2C consumer data — different regulations and data sources
- When verified data is already in your CRM — don't re-enrich unnecessarily

## Instructions

### The enrichment pipeline

```
Raw Input (email / domain / LinkedIn URL)
    ↓
Step 1: IDENTIFY      — resolve email to person + company
Step 2: ENRICH        — fetch firmographic data (company, tech stack, headcount)
Step 3: SIGNAL CHECK  — recent news, funding, hiring, exec changes
Step 4: SCORE         — ICP fit score
Step 5: STORE         — upsert to CRM with enriched fields
```

### Email → person resolution

```typescript
// Using Hunter.io API
async function resolveEmailToPerson(email: string): Promise<PersonData | null> {
  const res = await fetch(
    `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTER_API_KEY}`
  )
  const data = await res.json()
  if (data.data.status !== 'valid') return null
  return {
    email,
    firstName: data.data.first_name,
    lastName: data.data.last_name,
    company: data.data.organization,
    domain: getDomain(email),
  }
}

// Using Apollo.io (richer data)
async function enrichFromApollo(email: string) {
  const res = await fetch('https://api.apollo.io/v1/people/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.APOLLO_API_KEY! },
    body: JSON.stringify({ email }),
  })
  return res.json()
}
```

### Company enrichment via web scraping (Firecrawl)

```typescript
import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

async function enrichCompanyFromWebsite(domain: string): Promise<CompanyData> {
  // Scrape the company website with structured extraction
  const result = await firecrawl.scrapeUrl(`https://${domain}`, {
    formats: ['extract'],
    extract: {
      schema: {
        type: 'object',
        properties: {
          companyName:    { type: 'string' },
          description:    { type: 'string' },
          industry:       { type: 'string' },
          products:       { type: 'array', items: { type: 'string' } },
          techStack:      { type: 'array', items: { type: 'string' } },
          teamSize:       { type: 'string' },
          founded:        { type: 'number' },
          headquarters:   { type: 'string' },
        },
      },
    },
  })

  return result.extract as CompanyData
}
```

### Signal detection (trigger-based outreach)

```typescript
async function detectTriggerSignals(company: string): Promise<TriggerSignal[]> {
  const signals: TriggerSignal[] = []

  // Funding signals — check TechCrunch, Crunchbase
  const fundingNews = await searchRecentNews(`${company} funding round 2026`)
  if (fundingNews.length > 0) {
    signals.push({ type: 'funding', relevance: 0.9, context: fundingNews[0].title })
  }

  // Hiring signals — engineering hires suggest growth/new projects
  const hiringData = await checkLinkedInJobs(company)
  if (hiringData.engineeringJobCount > 10) {
    signals.push({ type: 'hiring_surge', relevance: 0.7, context: `${hiringData.engineeringJobCount} open engineering roles` })
  }

  // Tech stack changes — new tools = new needs
  const techChanges = await checkBuiltWithHistory(getDomain(company))
  if (techChanges.recentAdditions.length > 0) {
    signals.push({ type: 'tech_adoption', relevance: 0.6, context: `Added: ${techChanges.recentAdditions.join(', ')}` })
  }

  return signals.sort((a, b) => b.relevance - a.relevance)
}
```

### Claude-powered profile synthesis

```typescript
async function synthesiseProspectProfile(
  person: PersonData,
  company: CompanyData,
  signals: TriggerSignal[]
): Promise<ProspectProfile> {
  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: z.object({
      icpScore:         z.number().min(0).max(100),
      painPoints:       z.array(z.string()),
      outreachAngle:    z.string(),
      bestChannel:      z.enum(['email', 'linkedin', 'cold_call']),
      bestTiming:       z.string(),
      notAGoodFit:      z.boolean(),
      notAGoodFitReason: z.string().optional(),
    }),
    prompt: `Analyse this prospect for a ${process.env.OUR_PRODUCT_DESCRIPTION}.

Person: ${person.firstName} ${person.lastName}, ${person.jobTitle} at ${company.companyName}
Company: ${company.description}. ${company.teamSize} employees. ${company.industry}.
Tech stack: ${company.techStack.join(', ')}
Recent signals: ${signals.map(s => s.context).join('; ')}

Score their ICP fit, identify pain points we can solve, and suggest the best outreach angle.`,
  })

  return { ...person, ...company, signals, ...object }
}
```

### Full pipeline

```typescript
async function enrichLeadList(emails: string[]): Promise<EnrichedLead[]> {
  const results: EnrichedLead[] = []

  for (const email of emails) {
    try {
      console.log(`Enriching ${email}...`)

      const [person, company] = await Promise.all([
        resolveEmailToPerson(email),
        enrichCompanyFromWebsite(getDomain(email)),
      ])

      if (!person || !company) {
        results.push({ email, status: 'not_found' })
        continue
      }

      const signals = await detectTriggerSignals(company.companyName)
      const profile = await synthesiseProspectProfile(person, company, signals)

      // Upsert to HubSpot
      await upsertHubSpotContact(email, profile)

      results.push({ email, status: 'enriched', profile })

      // Rate limiting
      await new Promise(r => setTimeout(r, 500))
    } catch (err) {
      results.push({ email, status: 'error', error: err.message })
    }
  }

  return results
}
```

## Example

**User:** Build a pipeline that takes 50 company domains from a CSV, scrapes each website for company data, detects funding and hiring signals, scores ICP fit, and pushes results to HubSpot.

**Expected output:**
- `scripts/enrich-pipeline.ts` — reads domains.csv, runs enrichment, writes results.json
- `enrichCompanyFromWebsite(domain)` — Firecrawl structured extraction
- `detectTriggerSignals(company)` — funding + hiring + tech signals
- `scoreICP(company, criteria)` — 0-100 score
- `upsertHubSpotContact(email, enrichedData)` — creates/updates CRM records
- Progress logging, error capture to `failed-enrichments.csv`

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
