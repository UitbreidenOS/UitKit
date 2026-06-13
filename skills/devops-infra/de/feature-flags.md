---
name: feature-flags
description: "Feature flags: gradual rollouts, A/B testing, kill switches — LaunchDarkly, Unleash, Statsig, and home-built patterns with database or env vars"
---

> 🇩🇪 Deutsche Version. [Englische Version](../feature-flags.md).

# Skill: Feature Flags

## Wann aktivieren
- Einführung eines neuen Features für einen Prozentsatz der Nutzer
- Durchführung eines A/B-Tests bei einer UI-Änderung oder Preis-Experiment
- Hinzufügen eines Kill Switches, um ein Feature ohne Deployment zu deaktivieren
- Trennung von Code-Deployment und Feature-Veröffentlichung
- Beta-Tests mit bestimmten Nutzergruppen

## Wann NICHT verwenden
- Langlebige Konfigurationswerte — Umgebungsvariablen verwenden
- Permanentes Feature-Toggling (dauerhaft an/aus) — Feature einfach veröffentlichen oder Code entfernen
- Feature Flags als Ersatz für ordentliche Feature-Branches

## Anweisungen

### Einfache Umgebungsvariablen-Flags (kein externer Service nötig)

```typescript
// lib/flags.ts — günstigste Option, gut für kleine Teams
const FLAGS = {
  newCheckout:      process.env.FLAG_NEW_CHECKOUT === 'true',
  aiSuggestions:    process.env.FLAG_AI_SUGGESTIONS === 'true',
  betaDashboard:    process.env.FLAG_BETA_DASHBOARD === 'true',
} as const

export type Flag = keyof typeof FLAGS

export function isEnabled(flag: Flag): boolean {
  return FLAGS[flag] ?? false
}

// Verwendung
if (isEnabled('newCheckout')) {
  return <NewCheckout />
}
```

### Datenbankbasierte Flags (Rollout-Prozentsätze)

```typescript
// Schema: feature_flags(name, enabled, rollout_percentage, targeting_rules)
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

  // Deterministisches Bucketing — gleicher Nutzer erhält immer gleiches Ergebnis
  const hash = crypto.createHash('md5').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 8), 16) % 100
  return bucket < flag.rolloutPercentage
}

// Verwendung
const showNewUI = await isFeatureEnabled('new-dashboard', user.id)
```

### LaunchDarkly (verwaltete Feature Flags)

```typescript
import LaunchDarkly from '@launchdarkly/node-server-sdk'

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!)
await ldClient.waitForInitialization()

// Flag für einen Nutzer auswerten
async function getFlag(flagKey: string, userId: string, defaultValue: boolean) {
  const context = {
    kind: 'user',
    key: userId,
    // Optional: Attribute für Targeting-Regeln hinzufügen
    // plan: user.plan, email: user.email, country: user.country
  }
  return ldClient.variation(flagKey, context, defaultValue)
}

// React-Komponente (Client-seitiges SDK)
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk'

function Dashboard() {
  const { newDashboard } = useFlags()
  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Unleash (Open-Source, selbst hostbar)

```typescript
import { initialize } from 'unleash-client'

const unleash = initialize({
  url: process.env.UNLEASH_URL + '/api/',
  appName: 'my-app',
  customHeaders: { Authorization: process.env.UNLEASH_API_TOKEN! },
})

await unleash.start()

// Feature prüfen
if (unleash.isEnabled('new-checkout', { userId: user.id })) {
  // neuen Checkout anzeigen
}

// Mit schrittweisem Rollout — in Unleash-UI konfigurieren
// Strategie: schrittweiser Rollout, 20% → 50% → 100%
```

### A/B-Test-Muster

```typescript
// Nutzer deterministisch einer Variante zuweisen
function assignVariant(userId: string, flagName: string, variants: string[]): string {
  const hash = crypto.createHash('sha256').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 4), 16) % variants.length
  return variants[bucket]
}

// Verfolgen, welche Variante ein Nutzer gesehen hat
async function trackExperiment(userId: string, variant: string, event: string) {
  await analytics.track({
    userId,
    event: 'Experiment Viewed',
    properties: { experiment: 'checkout-redesign', variant, event },
  })
}

// Verwendung
const variant = assignVariant(user.id, 'checkout-redesign', ['control', 'treatment'])
await trackExperiment(user.id, variant, 'checkout_page_viewed')

return variant === 'treatment' ? <NewCheckout /> : <OldCheckout />
```

### Kill-Switch-Muster

```typescript
// Notfall-Kill-Switch — ein Feature deaktivieren, das Probleme verursacht
// ohne Code-Deployment

const KILL_SWITCHES = {
  aiRecommendations: process.env.KILL_SWITCH_AI_RECS === 'true',
  newPaymentFlow:    process.env.KILL_SWITCH_PAYMENT_FLOW === 'true',
}

// Oder aus Datenbank (kann in < 1 Minute umgeschaltet werden)
export async function isKilled(feature: string): Promise<boolean> {
  const flag = await redis.get(`kill_switch:${feature}`)
  return flag === 'true'
}

// In Ihrem Zahlungsfluss
if (await isKilled('new-payment-flow')) {
  return legacyPaymentFlow(cart)
}
return newPaymentFlow(cart)
```

### Next.js Middleware für flagbasiertes Routing

```typescript
// middleware.ts — Nutzer basierend auf Flags zu verschiedenen Seiten routen
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

## Beispiel

**Benutzer:** Ein Feature-Flag-System zu einer Next.js-App hinzufügen, um schrittweise eine neue KI-gestützte Suchfunktion einzuführen — bei 5% starten, auf 25% erhöhen, dann 100%, mit Kill Switch.

**Erwartete Ausgabe:**
- `lib/flags.ts` — `isFeatureEnabled(flagName, userId)` mit DB-basiertem Rollout-%
- Drizzle-Schema: `feature_flags`-Tabelle mit `name`, `enabled`, `rollout_percentage`
- `app/search/page.tsx` — rendert bedingt `<AISearch />` oder `<LegacySearch />`
- Admin-API: `PATCH /api/admin/flags/:name` um Rollout-% ohne Deploy zu aktualisieren
- Redis-Kill-Switch: `KILL_SWITCH_AI_SEARCH=true` deaktiviert unabhängig vom Rollout

---
