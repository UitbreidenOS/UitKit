---
name: feature-flags
description: "Feature flags: gradual rollouts, A/B testing, kill switches — LaunchDarkly, Unleash, Statsig, and home-built patterns with database or env vars"
updated: 2026-06-13
---

# Feature Flags Skill

## When to activate
- Rolling out a new feature to a percentage of users
- Running an A/B test on a UI change or pricing experiment
- Adding a kill switch to disable a feature without deploying
- Separating code deployment from feature release
- Beta testing with specific user groups

## When NOT to use
- Long-lived config values — use environment variables
- Permanent feature toggling (on/off forever) — just ship the feature or remove the code
- Feature flags as a substitute for proper feature branches

## Instructions

### Simple env-var flags (no external service needed)

```typescript
// lib/flags.ts — cheapest, good for small teams
const FLAGS = {
  newCheckout:      process.env.FLAG_NEW_CHECKOUT === 'true',
  aiSuggestions:    process.env.FLAG_AI_SUGGESTIONS === 'true',
  betaDashboard:    process.env.FLAG_BETA_DASHBOARD === 'true',
} as const

export type Flag = keyof typeof FLAGS

export function isEnabled(flag: Flag): boolean {
  return FLAGS[flag] ?? false
}

// Usage
if (isEnabled('newCheckout')) {
  return <NewCheckout />
}
```

### Database-backed flags (rollout percentages)

```typescript
// schema: feature_flags(name, enabled, rollout_percentage, targeting_rules)
export async function isFeatureEnabled(
  flagName: string,
  userId?: string
): Promise<boolean> {
  const flag = await db.query.featureFlags.findFirst({
    where: eq(featureFlags.name, flagName),
  })

  if (!flag || !flag.enabled) return false
  if (flag.rolloutPercentage === 100) return true
  if (!userId) return false

  // Deterministic bucketing — same user always gets same result
  const hash = crypto.createHash('md5').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 8), 16) % 100
  return bucket < flag.rolloutPercentage
}

// Usage
const showNewUI = await isFeatureEnabled('new-dashboard', user.id)
```

### LaunchDarkly (managed feature flags)

```typescript
import LaunchDarkly from '@launchdarkly/node-server-sdk'

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!)
await ldClient.waitForInitialization()

// Evaluate a flag for a user
async function getFlag(flagKey: string, userId: string, defaultValue: boolean) {
  const context = {
    kind: 'user',
    key: userId,
    // Optional: add attributes for targeting rules
    // plan: user.plan, email: user.email, country: user.country
  }
  return ldClient.variation(flagKey, context, defaultValue)
}

// React component (client-side SDK)
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk'

function Dashboard() {
  const { newDashboard } = useFlags()
  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Unleash (open-source, self-hostable)

```typescript
import { initialize } from 'unleash-client'

const unleash = initialize({
  url: process.env.UNLEASH_URL + '/api/',
  appName: 'my-app',
  customHeaders: { Authorization: process.env.UNLEASH_API_TOKEN! },
})

await unleash.start()

// Check feature
if (unleash.isEnabled('new-checkout', { userId: user.id })) {
  // show new checkout
}

// With gradual rollout — configure in Unleash UI
// Strategy: gradual rollout, 20% → 50% → 100%
```

### A/B testing pattern

```typescript
// Assign users to a variant deterministically
function assignVariant(userId: string, flagName: string, variants: string[]): string {
  const hash = crypto.createHash('sha256').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 4), 16) % variants.length
  return variants[bucket]
}

// Track which variant a user saw
async function trackExperiment(userId: string, variant: string, event: string) {
  await analytics.track({
    userId,
    event: 'Experiment Viewed',
    properties: { experiment: 'checkout-redesign', variant, event },
  })
}

// Usage
const variant = assignVariant(user.id, 'checkout-redesign', ['control', 'treatment'])
await trackExperiment(user.id, variant, 'checkout_page_viewed')

return variant === 'treatment' ? <NewCheckout /> : <OldCheckout />
```

### Kill switch pattern

```typescript
// Emergency kill switch — disable a feature that's causing issues
// without a code deployment

const KILL_SWITCHES = {
  aiRecommendations: process.env.KILL_SWITCH_AI_RECS === 'true',
  newPaymentFlow:    process.env.KILL_SWITCH_PAYMENT_FLOW === 'true',
}

// Or from database (can be toggled in < 1 minute)
export async function isKilled(feature: string): Promise<boolean> {
  const flag = await redis.get(`kill_switch:${feature}`)
  return flag === 'true'
}

// In your payment flow
if (await isKilled('new-payment-flow')) {
  return legacyPaymentFlow(cart)
}
return newPaymentFlow(cart)
```

### Next.js middleware for flag-based routing

```typescript
// middleware.ts — route users to different pages based on flags
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value

  if (request.nextUrl.pathname === '/checkout' && userId) {
    const useNewCheckout = await isFeatureEnabled('new-checkout', userId)
    if (useNewCheckout) {
      return NextResponse.rewrite(new URL('/checkout/v2', request.url))
    }
  }

  return NextResponse.next()
}
```

## Example

**User:** Add a feature flag system to a Next.js app to gradually roll out a new AI-powered search feature — start at 5%, increase to 25%, then 100%, with a kill switch.

**Expected output:**
- `lib/flags.ts` — `isFeatureEnabled(flagName, userId)` with DB-backed rollout %
- Drizzle schema: `feature_flags` table with `name`, `enabled`, `rollout_percentage`
- `app/search/page.tsx` — conditionally renders `<AISearch />` or `<LegacySearch />`
- Admin API: `PATCH /api/admin/flags/:name` to update rollout % without deploy
- Redis kill switch: `KILL_SWITCH_AI_SEARCH=true` disables regardless of rollout

---
