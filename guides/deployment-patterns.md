# Deployment Patterns Guide

Common deployment strategies — when to use each, how to implement it, and the tradeoffs.

## Pattern 1: Direct Deploy (all-at-once)

**How it works:** Deploy new version to all servers simultaneously.

**When to use:**
- Non-critical services or internal tools
- Small user base where rollback is fast
- Stateless services with no database migrations
- Emergency hotfixes that need to be everywhere immediately

**How:**
```bash
# Railway / Render / Heroku style
git push origin main

# Docker / Kubernetes
kubectl set image deployment/api api=my-image:v2.0.0

# Verify
kubectl rollout status deployment/api
```

**Rollback:**
```bash
kubectl rollout undo deployment/api
# or: deploy the previous image tag
```

**Risks:** Full impact if something is wrong. All users affected immediately.

---

## Pattern 2: Rolling Deploy

**How it works:** Replace instances one-by-one. At any point, some instances run old code, some run new.

**When to use:**
- Services that can safely handle requests from both old and new versions simultaneously
- Standard web APIs with no breaking schema changes
- Most production services as the default strategy

**How (Kubernetes):**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # add 1 new pod before removing old
      maxUnavailable: 0    # never have fewer than desired pods running
```

```bash
# Deploy
kubectl apply -f deployment.yaml

# Monitor
kubectl rollout status deployment/api
# Watch: kubectl get pods -w
```

**Prerequisite:** Application must be backwards-compatible during the transition (old and new run simultaneously).

**Rollback:**
```bash
kubectl rollout undo deployment/api
```

---

## Pattern 3: Blue-Green Deploy

**How it works:** Run two identical environments (blue = current, green = new). Switch traffic instantly.

**When to use:**
- Zero-downtime requirement
- Need instant rollback capability
- Database migration that requires a specific app version
- High-traffic services where gradual rollout isn't granular enough

**How:**
```yaml
# Two deployments: api-blue (current) and api-green (new)
# Service selects which deployment gets traffic

# Deploy new version to green
kubectl apply -f deployment-green.yaml

# Test green (internal traffic only)
kubectl port-forward svc/api-green 3001:3000

# Switch traffic to green
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# Green is now live. Blue is kept for instant rollback.
# After 24h stable: decommission blue
kubectl delete deployment api-blue
```

**With AWS ALB:**
```bash
# Weighted routing: 100% → blue
# Test new version via direct green endpoint
# Swap: 100% → green
aws elbv2 modify-rule --rule-arn ... --actions ... 
```

---

## Pattern 4: Canary Deploy

**How it works:** Send a small % of traffic to new version, gradually increase.

**When to use:**
- Large user base where even 1% of traffic is meaningful signal
- High-risk changes where you want real user data before full rollout
- SLO-driven deployment (auto-rollback if metrics degrade)

**How (Kubernetes + Argo Rollouts):**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5    # 5% of traffic
        - pause: {duration: 10m}
        - setWeight: 25
        - pause: {duration: 20m}
        - setWeight: 50
        - pause: {duration: 20m}
        - setWeight: 100
      analysis:
        templates:
          - templateName: success-rate
        args:
          - name: service-name
            value: api
```

**Simple canary without Argo (Kubernetes):**
```bash
# Run new deployment alongside old with 1 replica (old has 9 = 10% canary)
kubectl scale deployment api-new --replicas=1
kubectl scale deployment api-old --replicas=9

# If healthy, gradually shift
kubectl scale deployment api-new --replicas=5
kubectl scale deployment api-old --replicas=5

# Full cutover
kubectl scale deployment api-new --replicas=10
kubectl delete deployment api-old
```

---

## Pattern 5: Feature Flags (Release Toggles)

**How it works:** Code is deployed but features are toggled on/off without a deploy.

**When to use:**
- Decouple deploy from release (always recommended)
- A/B testing new features
- Gradual rollout by user segment (% of users, specific customers, beta users)
- Kill switch for features that might cause issues

**Simple implementation:**
```typescript
// Using a feature flag service (LaunchDarkly, Flagsmith, Growthbook, or PostHog)
const flags = await getFeatureFlags(userId)

if (flags.newCheckoutFlow) {
  return <NewCheckout />
} else {
  return <OldCheckout />
}

// Or: environment-variable-based (simpler, less granular)
const showNewFeature = process.env.FEATURE_NEW_CHECKOUT === 'true'
```

**PostHog feature flags (free tier, open source):**
```typescript
import { PostHog } from 'posthog-node'
const client = new PostHog(process.env.POSTHOG_API_KEY!)

const isEnabled = await client.isFeatureEnabled('new-checkout', userId)
```

---

## Choosing the right pattern

| Pattern | Speed | Rollback | Risk | Best for |
|---|---|---|---|---|
| Direct | Fast | Slow | High | Hotfixes, internal tools |
| Rolling | Medium | Medium | Medium | Standard API deployments |
| Blue-Green | Fast (switch) | Instant | Low | Zero-downtime requirement |
| Canary | Slow | Fast | Very low | High-risk, large scale |
| Feature flags | Instant | Instant | Minimal | All production features |

**Default recommendation:** Rolling deploy + feature flags. Rolling for infrastructure; feature flags for product changes.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
