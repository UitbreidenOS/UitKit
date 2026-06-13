---
name: crm-hygiene
description: "CRM data hygiene: detect stale records, merge duplicates, fill missing fields, reassign ownership, run scheduled cleanup — HubSpot and Salesforce patterns"
updated: 2026-06-13
---

# CRM Hygiene Skill

## When to activate
- Your CRM has contacts that haven't been touched in months/years
- Duplicate records are polluting reports and outreach lists
- Key fields (phone, company, job title) are missing across many records
- Preparing for a campaign where data quality matters
- Running a quarterly or annual CRM cleanup

## When NOT to use
- Real-time data validation (build this into your intake forms instead)
- GDPR/data deletion requests — handle separately with legal guidance
- Migrating between CRM platforms — use a dedicated migration tool

## Instructions

### Find stale contacts

```typescript
// HubSpot API — contacts with no activity in 90 days
const staleContacts = await hubspot.crm.contacts.searchApi.doSearch({
  filterGroups: [{
    filters: [
      {
        propertyName: 'hs_last_sales_activity_date',
        operator: 'LT',
        value: String(Date.now() - 90 * 86400000),
      },
      {
        propertyName: 'lifecyclestage',
        operator: 'EQ',
        value: 'lead',
      },
    ],
  }],
  properties: ['email', 'firstname', 'lastname', 'company', 'hs_last_sales_activity_date'],
  limit: 100,
})

// Decision per stale contact:
// < 180 days: re-engagement sequence
// 180–365 days: move to 'cold' lifecycle stage
// > 365 days: archive or delete (with GDPR check)
```

### Detect and merge duplicates

```typescript
// Find likely duplicates by email domain + name similarity
async function findDuplicates(contacts: Contact[]): Promise<DuplicatePair[]> {
  const pairs: DuplicatePair[] = []
  const emailMap = new Map<string, Contact[]>()

  // Group by email (exact)
  for (const c of contacts) {
    const key = c.email.toLowerCase()
    emailMap.set(key, [...(emailMap.get(key) ?? []), c])
  }

  // Flag exact email duplicates
  for (const [email, dupes] of emailMap) {
    if (dupes.length > 1) {
      pairs.push({ type: 'exact_email', contacts: dupes, email })
    }
  }

  // Also check: same name + same company (fuzzy)
  // ... name similarity logic ...

  return pairs
}

// HubSpot merge (keep the record with most activity)
async function mergeContacts(primaryId: string, secondaryId: string) {
  await hubspot.crm.contacts.mergeApi.merge({
    primaryObjectId: primaryId,
    objectIdToMerge: secondaryId,
  })
}
```

### Fill missing fields via enrichment

```typescript
async function fillMissingFields(contactId: string, email: string) {
  const contact = await hubspot.crm.contacts.basicApi.getById(contactId, ['company', 'jobtitle', 'phone'])

  const missingFields = []
  if (!contact.properties.company) missingFields.push('company')
  if (!contact.properties.jobtitle) missingFields.push('jobtitle')

  if (missingFields.length === 0) return

  // Enrich from external source
  const enriched = await clearbit.enrichment.find({ email })

  const updates: Record<string, string> = {}
  if (!contact.properties.company && enriched?.company?.name) {
    updates.company = enriched.company.name
  }
  if (!contact.properties.jobtitle && enriched?.person?.employment?.title) {
    updates.jobtitle = enriched.person.employment.title
  }

  if (Object.keys(updates).length > 0) {
    await hubspot.crm.contacts.basicApi.update(contactId, { properties: updates })
  }
}
```

### Ownership reassignment

```typescript
// Reassign contacts from departed team members
async function reassignContacts(fromOwnerId: string, toOwnerId: string) {
  const orphanedContacts = await hubspot.crm.contacts.searchApi.doSearch({
    filterGroups: [{
      filters: [{ propertyName: 'hubspot_owner_id', operator: 'EQ', value: fromOwnerId }],
    }],
    properties: ['email', 'firstname', 'lastname'],
    limit: 100,
  })

  for (const contact of orphanedContacts.results) {
    await hubspot.crm.contacts.basicApi.update(contact.id, {
      properties: { hubspot_owner_id: toOwnerId },
    })
    await new Promise(r => setTimeout(r, 100)) // rate limit
  }

  console.log(`Reassigned ${orphanedContacts.results.length} contacts`)
}
```

### Scheduled hygiene run (cron pattern)

```typescript
// Run weekly — Sunday night
// 1. Find and flag stale contacts
// 2. Find exact-email duplicates
// 3. Fill top-3 most common missing fields
// 4. Post summary to Slack

async function weeklyHygieneRun() {
  const report = {
    staleContacts: 0,
    duplicatesFound: 0,
    fieldsFilled: 0,
    errors: [] as string[],
  }

  // Step 1: Stale contacts
  const stale = await findStaleContacts(90)
  report.staleContacts = stale.length
  await tagContactsForReview(stale, 'needs-review-stale')

  // Step 2: Duplicates
  const allContacts = await getAllContacts()
  const dupes = await findDuplicates(allContacts)
  report.duplicatesFound = dupes.length
  await tagDuplicatesForReview(dupes)

  // Step 3: Enrich top missing fields
  const incomplete = await getContactsMissingFields(['company', 'jobtitle'])
  for (const c of incomplete.slice(0, 50)) { // cap at 50/run
    await fillMissingFields(c.id, c.properties.email)
    report.fieldsFilled++
  }

  // Post to Slack
  await postSlackSummary(report)
}
```

### CRM health score

```typescript
// Score your CRM data quality 0-100
function calculateCRMHealthScore(contacts: Contact[]): number {
  const scores = contacts.map(c => {
    let score = 0
    if (c.email) score += 20
    if (c.company) score += 15
    if (c.jobtitle) score += 15
    if (c.phone) score += 10
    if (c.lifecyclestage) score += 15
    if (c.hubspot_owner_id) score += 10
    if (c.hs_last_sales_activity_date) score += 15
    return score
  })

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
```

## Example

**User:** Run a monthly hygiene pass on our HubSpot CRM — find stale leads, flag duplicates, and post a report to Slack every first Monday.

**Expected output:**
- `scripts/crm-hygiene.ts` — finds stale contacts (90 days), exact-email duplicates, enriches top 50 missing company fields
- `scheduleHygieneRun()` — cron: `0 9 1 * 1` (first Monday 9am)
- Slack report: "🧹 CRM Hygiene: 47 stale leads tagged, 12 duplicates flagged, 38 company fields filled"

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
