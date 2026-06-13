---
name: feature-flags
description: "Feature flags: gradual rollouts, A/B testing, kill switches — LaunchDarkly, Unleash, Statsig, and home-built patterns with database or env vars"
---

> 🇪🇸 Versión en español. [Versión en inglés](../feature-flags.md).

# Habilidad de Feature Flags

## Cuándo activar
- Desplegando una nueva funcionalidad a un porcentaje de usuarios
- Ejecutando una prueba A/B en un cambio de UI o experimento de precios
- Agregando un kill switch para deshabilitar una funcionalidad sin desplegar
- Separando el despliegue de código del lanzamiento de funcionalidades
- Pruebas beta con grupos específicos de usuarios

## Cuándo NO usar
- Valores de configuración de larga duración — usar variables de entorno
- Conmutación permanente de funcionalidades (activado/desactivado para siempre) — simplemente lance la funcionalidad o elimine el código
- Feature flags como sustituto de ramas de funcionalidades apropiadas

## Instrucciones

### Flags simples con variables de entorno (sin servicio externo)

```typescript
// lib/flags.ts — la opción más económica, buena para equipos pequeños
const FLAGS = {
  newCheckout:      process.env.FLAG_NEW_CHECKOUT === 'true',
  aiSuggestions:    process.env.FLAG_AI_SUGGESTIONS === 'true',
  betaDashboard:    process.env.FLAG_BETA_DASHBOARD === 'true',
} as const

export type Flag = keyof typeof FLAGS

export function isEnabled(flag: Flag): boolean {
  return FLAGS[flag] ?? false
}

// Uso
if (isEnabled('newCheckout')) {
  return <NewCheckout />
}
```

### Flags respaldados por base de datos (porcentajes de despliegue)

```typescript
// esquema: feature_flags(name, enabled, rollout_percentage, targeting_rules)
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

  // Bucketing determinista — el mismo usuario siempre obtiene el mismo resultado
  const hash = crypto.createHash('md5').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 8), 16) % 100
  return bucket < flag.rolloutPercentage
}

// Uso
const showNewUI = await isFeatureEnabled('new-dashboard', user.id)
```

### LaunchDarkly (feature flags gestionados)

```typescript
import LaunchDarkly from '@launchdarkly/node-server-sdk'

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!)
await ldClient.waitForInitialization()

// Evaluar un flag para un usuario
async function getFlag(flagKey: string, userId: string, defaultValue: boolean) {
  const context = {
    kind: 'user',
    key: userId,
    // Opcional: agregar atributos para reglas de targeting
    // plan: user.plan, email: user.email, country: user.country
  }
  return ldClient.variation(flagKey, context, defaultValue)
}

// Componente React (SDK del lado del cliente)
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk'

function Dashboard() {
  const { newDashboard } = useFlags()
  return newDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Unleash (open-source, auto-hospedable)

```typescript
import { initialize } from 'unleash-client'

const unleash = initialize({
  url: process.env.UNLEASH_URL + '/api/',
  appName: 'my-app',
  customHeaders: { Authorization: process.env.UNLEASH_API_TOKEN! },
})

await unleash.start()

// Verificar funcionalidad
if (unleash.isEnabled('new-checkout', { userId: user.id })) {
  // mostrar nuevo proceso de pago
}

// Con despliegue gradual — configurar en la UI de Unleash
// Estrategia: despliegue gradual, 20% → 50% → 100%
```

### Patrón de prueba A/B

```typescript
// Asignar usuarios a una variante de forma determinista
function assignVariant(userId: string, flagName: string, variants: string[]): string {
  const hash = crypto.createHash('sha256').update(`${flagName}:${userId}`).digest('hex')
  const bucket = parseInt(hash.substring(0, 4), 16) % variants.length
  return variants[bucket]
}

// Rastrear qué variante vio un usuario
async function trackExperiment(userId: string, variant: string, event: string) {
  await analytics.track({
    userId,
    event: 'Experiment Viewed',
    properties: { experiment: 'checkout-redesign', variant, event },
  })
}

// Uso
const variant = assignVariant(user.id, 'checkout-redesign', ['control', 'treatment'])
await trackExperiment(user.id, variant, 'checkout_page_viewed')

return variant === 'treatment' ? <NewCheckout /> : <OldCheckout />
```

### Patrón de kill switch

```typescript
// Kill switch de emergencia — deshabilitar una funcionalidad que está causando problemas
// sin un despliegue de código

const KILL_SWITCHES = {
  aiRecommendations: process.env.KILL_SWITCH_AI_RECS === 'true',
  newPaymentFlow:    process.env.KILL_SWITCH_PAYMENT_FLOW === 'true',
}

// O desde la base de datos (se puede activar en < 1 minuto)
export async function isKilled(feature: string): Promise<boolean> {
  const flag = await redis.get(`kill_switch:${feature}`)
  return flag === 'true'
}

// En su flujo de pago
if (await isKilled('new-payment-flow')) {
  return legacyPaymentFlow(cart)
}
return newPaymentFlow(cart)
```

### Middleware Next.js para enrutamiento basado en flags

```typescript
// middleware.ts — enrutar usuarios a diferentes páginas según los flags
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

## Ejemplo

**Usuario:** Agregar un sistema de feature flags a una aplicación Next.js para desplegar gradualmente una nueva función de búsqueda con IA — empezar al 5%, aumentar al 25%, luego al 100%, con un kill switch.

**Resultado esperado:**
- `lib/flags.ts` — `isFeatureEnabled(flagName, userId)` con rollout% respaldado por BD
- Esquema Drizzle: tabla `feature_flags` con `name`, `enabled`, `rollout_percentage`
- `app/search/page.tsx` — renderiza condicionalmente `<AISearch />` o `<LegacySearch />`
- API Admin: `PATCH /api/admin/flags/:name` para actualizar el rollout% sin desplegar
- Kill switch Redis: `KILL_SWITCH_AI_SEARCH=true` deshabilita independientemente del rollout

---
