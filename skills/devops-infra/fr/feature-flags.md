---
name: feature-flags
description: "Feature flags: gradual rollouts, A/B testing, kill switches — LaunchDarkly, Unleash, Statsig, and home-built patterns with database or env vars"
---

> 🇫🇷 Version française. [English version](../feature-flags.md).

# Compétence Feature Flags

## Quand activer
- Déploiement d'une nouvelle fonctionnalité auprès d'un pourcentage d'utilisateurs
- Exécution d'un test A/B sur une modification d'interface ou une expérience de tarification
- Ajout d'un kill switch pour désactiver une fonctionnalité sans déployer
- Séparation du déploiement de code de la mise en production d'une fonctionnalité
- Tests bêta avec des groupes d'utilisateurs spécifiques

## Quand NE PAS utiliser
- Valeurs de configuration durables — utiliser les variables d'environnement
- Basculement permanent de fonctionnalité (activé/désactivé pour toujours) — publiez simplement la fonctionnalité ou supprimez le code
- Feature flags comme substitut aux branches de fonctionnalités appropriées

## Instructions

### Flags simples par variable d'environnement (sans service externe)

```typescript
// lib/flags.ts — le moins coûteux, adapté aux petites équipes
const FLAGS = {
  newCheckout:      process.env.FLAG_NEW_CHECKOUT === 'true',
  aiSuggestions:    process.env.FLAG_AI_SUGGESTIONS === 'true',
  betaDashboard:    process.env.FLAG_BETA_DASHBOARD === 'true',
} as const

export type Flag = keyof typeof FLAGS

export function isEnabled(flag: Flag): boolean {
  return FLAGS[flag] ?? false
}

// Utilisation
if (isEnabled('newCheckout')) {
  return <NewCheckout />
}
```

### Flags basés sur base de données (pourcentages de déploiement)

```typescript
// schéma : feature_flags(name, enabled, rollout_percentage, targeting_rules)
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

  // Bucketing déterministe — le même utilisateur obtient toujours le même résultat
  const hash = crypto.createHash('md5').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 8), 16) % 100
  return bucket < flag.rolloutPercentage
}

// Utilisation
const showNewUI = await isFeatureEnabled('new-dashboard', user.id)
```

### LaunchDarkly (feature flags gérés)

```typescript
import LaunchDarkly from '@launchdarkly/node-server-sdk'

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!)
await ldClient.waitForInitialization()

// Évaluer un flag pour un utilisateur
async function getFlag(flagKey: string, userId: string, defaultValue: boolean) {
  const context = {
    kind: 'user',
    key: userId,
    // Optionnel : ajouter des attributs pour les règles de ciblage
    // plan: user.plan, email: user.email, country: user.country
  }
  return ldClient.variation(flagKey, context, defaultValue)
}

// Composant React (SDK côté client)
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk'

function Dashboard() {
  const { newDashboard } = useFlags()
  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Unleash (open-source, auto-hébergeable)

```typescript
import { initialize } from 'unleash-client'

const unleash = initialize({
  url: process.env.UNLEASH_URL + '/api/',
  appName: 'my-app',
  customHeaders: { Authorization: process.env.UNLEASH_API_TOKEN! },
})

await unleash.start()

// Vérifier une fonctionnalité
if (unleash.isEnabled('new-checkout', { userId: user.id })) {
  // afficher le nouveau processus de paiement
}

// Avec déploiement progressif — configurer dans l'interface Unleash
// Stratégie : déploiement progressif, 20% → 50% → 100%
```

### Modèle de test A/B

```typescript
// Assigner les utilisateurs à une variante de façon déterministe
function assignVariant(userId: string, flagName: string, variants: string[]): string {
  const hash = crypto.createHash('sha256').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 4), 16) % variants.length
  return variants[bucket]
}

// Suivre quelle variante un utilisateur a vue
async function trackExperiment(userId: string, variant: string, event: string) {
  await analytics.track({
    userId,
    event: 'Experiment Viewed',
    properties: { experiment: 'checkout-redesign', variant, event },
  })
}

// Utilisation
const variant = assignVariant(user.id, 'checkout-redesign', ['control', 'treatment'])
await trackExperiment(user.id, variant, 'checkout_page_viewed')

return variant === 'treatment' ? <NewCheckout /> : <OldCheckout />
```

### Modèle de kill switch

```typescript
// Kill switch d'urgence — désactiver une fonctionnalité qui cause des problèmes
// sans déploiement de code

const KILL_SWITCHES = {
  aiRecommendations: process.env.KILL_SWITCH_AI_RECS === 'true',
  newPaymentFlow:    process.env.KILL_SWITCH_PAYMENT_FLOW === 'true',
}

// Ou depuis la base de données (peut être basculé en < 1 minute)
export async function isKilled(feature: string): Promise<boolean> {
  const flag = await redis.get(`kill_switch:${feature}`)
  return flag === 'true'
}

// Dans votre flux de paiement
if (await isKilled('new-payment-flow')) {
  return legacyPaymentFlow(cart)
}
return newPaymentFlow(cart)
```

### Middleware Next.js pour le routage basé sur les flags

```typescript
// middleware.ts — router les utilisateurs vers différentes pages selon les flags
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

## Exemple

**Utilisateur :** Ajouter un système de feature flags à une application Next.js pour déployer progressivement une nouvelle fonctionnalité de recherche alimentée par IA — commencer à 5%, augmenter à 25%, puis 100%, avec un kill switch.

**Résultat attendu :**
- `lib/flags.ts` — `isFeatureEnabled(flagName, userId)` avec déploiement % basé sur BDD
- Schéma Drizzle : table `feature_flags` avec `name`, `enabled`, `rollout_percentage`
- `app/search/page.tsx` — rend conditionnellement `<AISearch />` ou `<LegacySearch />`
- API Admin : `PATCH /api/admin/flags/:name` pour mettre à jour le % de déploiement sans déployer
- Kill switch Redis : `KILL_SWITCH_AI_SEARCH=true` désactive indépendamment du déploiement

---
