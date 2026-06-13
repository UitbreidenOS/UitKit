---
name: feature-flags
description: "Feature flags: gradual rollouts, A/B testing, kill switches — LaunchDarkly, Unleash, Statsig, and home-built patterns with database or env vars"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../feature-flags.md).

# Skill: Feature Flags

## Wanneer activeren
- Een nieuwe functie uitrollen naar een percentage van de gebruikers
- Een A/B-test uitvoeren op een UI-wijziging of prijsexperiment
- Een kill switch toevoegen om een functie uit te schakelen zonder te deployen
- Code-deployment scheiden van functiepublicatie
- Bètatests met specifieke gebruikersgroepen

## Wanneer NIET gebruiken
- Langdurige configuratiewaarden — gebruik omgevingsvariabelen
- Permanente functieomschakeling (voor altijd aan/uit) — lever de functie gewoon of verwijder de code
- Feature flags als vervanging voor correcte functiebranches

## Instructies

### Eenvoudige omgevingsvariabele-flags (geen externe service nodig)

```typescript
// lib/flags.ts — goedkoopste optie, goed voor kleine teams
const FLAGS = {
  newCheckout:      process.env.FLAG_NEW_CHECKOUT === 'true',
  aiSuggestions:    process.env.FLAG_AI_SUGGESTIONS === 'true',
  betaDashboard:    process.env.FLAG_BETA_DASHBOARD === 'true',
} as const

export type Flag = keyof typeof FLAGS

export function isEnabled(flag: Flag): boolean {
  return FLAGS[flag] ?? false
}

// Gebruik
if (isEnabled('newCheckout')) {
  return <NewCheckout />
}
```

### Database-ondersteunde flags (rolloutpercentages)

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

  // Deterministisch bucketing — dezelfde gebruiker krijgt altijd hetzelfde resultaat
  const hash = crypto.createHash('md5').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 8), 16) % 100
  return bucket < flag.rolloutPercentage
}

// Gebruik
const showNewUI = await isFeatureEnabled('new-dashboard', user.id)
```

### LaunchDarkly (beheerde feature flags)

```typescript
import LaunchDarkly from '@launchdarkly/node-server-sdk'

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!)
await ldClient.waitForInitialization()

// Een flag evalueren voor een gebruiker
async function getFlag(flagKey: string, userId: string, defaultValue: boolean) {
  const context = {
    kind: 'user',
    key: userId,
    // Optioneel: attributen toevoegen voor targetingregels
    // plan: user.plan, email: user.email, country: user.country
  }
  return ldClient.variation(flagKey, context, defaultValue)
}

// React-component (client-side SDK)
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk'

function Dashboard() {
  const { newDashboard } = useFlags()
  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Unleash (open-source, zelf te hosten)

```typescript
import { initialize } from 'unleash-client'

const unleash = initialize({
  url: process.env.UNLEASH_URL + '/api/',
  appName: 'my-app',
  customHeaders: { Authorization: process.env.UNLEASH_API_TOKEN! },
})

await unleash.start()

// Functie controleren
if (unleash.isEnabled('new-checkout', { userId: user.id })) {
  // nieuw afrekenen tonen
}

// Met geleidelijke rollout — configureren in Unleash-UI
// Strategie: geleidelijke rollout, 20% → 50% → 100%
```

### A/B-testpatroon

```typescript
// Gebruikers deterministisch aan een variant toewijzen
function assignVariant(userId: string, flagName: string, variants: string[]): string {
  const hash = crypto.createHash('sha256').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 4), 16) % variants.length
  return variants[bucket]
}

// Bijhouden welke variant een gebruiker heeft gezien
async function trackExperiment(userId: string, variant: string, event: string) {
  await analytics.track({
    userId,
    event: 'Experiment Viewed',
    properties: { experiment: 'checkout-redesign', variant, event },
  })
}

// Gebruik
const variant = assignVariant(user.id, 'checkout-redesign', ['control', 'treatment'])
await trackExperiment(user.id, variant, 'checkout_page_viewed')

return variant === 'treatment' ? <NewCheckout /> : <OldCheckout />
```

### Kill switch-patroon

```typescript
// Noodkill switch — een functie uitschakelen die problemen veroorzaakt
// zonder een code-deployment

const KILL_SWITCHES = {
  aiRecommendations: process.env.KILL_SWITCH_AI_RECS === 'true',
  newPaymentFlow:    process.env.KILL_SWITCH_PAYMENT_FLOW === 'true',
}

// Of vanuit database (kan in < 1 minuut worden omgeschakeld)
export async function isKilled(feature: string): Promise<boolean> {
  const flag = await redis.get(`kill_switch:${feature}`)
  return flag === 'true'
}

// In uw betalingsstroom
if (await isKilled('new-payment-flow')) {
  return legacyPaymentFlow(cart)
}
return newPaymentFlow(cart)
```

### Next.js middleware voor vlag-gebaseerde routering

```typescript
// middleware.ts — gebruikers doorsturen naar verschillende pagina's op basis van vlaggen
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

## Voorbeeld

**Gebruiker:** Een feature flag-systeem toevoegen aan een Next.js-app om geleidelijk een nieuwe AI-zoekfunctie uit te rollen — beginnen bij 5%, verhogen naar 25%, dan 100%, met een kill switch.

**Verwachte output:**
- `lib/flags.ts` — `isFeatureEnabled(flagName, userId)` met DB-gebaseerde rollout%
- Drizzle-schema: `feature_flags`-tabel met `name`, `enabled`, `rollout_percentage`
- `app/search/page.tsx` — rendert voorwaardelijk `<AISearch />` of `<LegacySearch />`
- Admin-API: `PATCH /api/admin/flags/:name` om rollout% bij te werken zonder deployment
- Redis-kill switch: `KILL_SWITCH_AI_SEARCH=true` schakelt uit ongeacht rollout

---
