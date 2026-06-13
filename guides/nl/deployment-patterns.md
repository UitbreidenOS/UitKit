# Implementatiepatronen Gids

Algemene implementatiestrategieën — wanneer elk moet worden gebruikt, hoe het moet worden geïmplementeerd en de afwegingen.

## Patroon 1: Directe implementatie (allemaal tegelijk)

**Hoe het werkt:** Implementeer nieuwe versie op alle servers tegelijk.

**Wanneer gebruiken:**
- Niet-kritieke services of interne tools
- Kleine gebruikersbasis waar rollback snel is
- Stateless services zonder database migraties
- Noodhotfixes die overal onmiddellijk moeten zijn

**Hoe:**
```bash
# Railway / Render / Heroku-stijl
git push origin main

# Docker / Kubernetes
kubectl set image deployment/api api=my-image:v2.0.0

# Verifieer
kubectl rollout status deployment/api
```

**Rollback:**
```bash
kubectl rollout undo deployment/api
# of: vorige image tag implementeren
```

**Risico's:** Volledige impact als iets fout gaat. Alle gebruikers onmiddellijk getroffen.

---

## Patroon 2: Rolling Deploy

**Hoe het werkt:** Vervang instances één voor één. Te allen tijde voeren sommige oude, anderen nieuwe code uit.

**Wanneer gebruiken:**
- Services die veilig verzoeken van beide versies tegelijk kunnen afhandelen
- Standaard web API's zonder breaking schemawijzigingen
- De meeste productieservices als standaardstrategie

**Hoe (Kubernetes):**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # voeg 1 nieuwe pod toe voor het verwijderen van oud
      maxUnavailable: 0    # zorg nooit voor minder dan gewenste pods
```

```bash
# Implementeer
kubectl apply -f deployment.yaml

# Monitoren
kubectl rollout status deployment/api
# Watch: kubectl get pods -w
```

**Vereiste:** Applicatie moet achterwaarts compatibel zijn tijdens overgang (oud en nieuw parallel).

**Rollback:**
```bash
kubectl rollout undo deployment/api
```

---

## Patroon 3: Blauw-groen implementatie

**Hoe het werkt:** Voer twee identieke omgevingen uit (blauw = huidige, groen = nieuw). Schakkel traffic onmiddellijk.

**Wanneer gebruiken:**
- Nul downtime vereiste
- Nodig directe rollback mogelijkheid
- Database migratie die specifieke app versie vereist
- High-traffic services waar graduele rollout niet granulaar genoeg

**Hoe:**
```yaml
# Twee implementaties: api-blue (huiidg) en api-green (nieuw)
# Service selecteert welke implementatie traffic krijgt

# Implementeer nieuwe versie naar groen
kubectl apply -f deployment-green.yaml

# Test groen (alleen intern verkeer)
kubectl port-forward svc/api-green 3001:3000

# Schakel traffic naar groen
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# Groen is nu live. Blauw behouden voor directe rollback.
# Na 24h stabiel: blauw buiten gebruik stellen
kubectl delete deployment api-blue
```

**Met AWS ALB:**
```bash
# Gewogen routering: 100% → blauw
# Test nieuwe versie via directe groen endpoint
# Swap: 100% → groen
aws elbv2 modify-rule --rule-arn ... --actions ... 
```

---

## Patroon 4: Kanarie-implementatie

**Hoe het werkt:** Stuur kleine % van verkeer naar nieuwe versie, verhoog gradueel.

**Wanneer gebruiken:**
- Grote gebruikersbasis waar zelfs 1% verkeer betekenissignaal is
- Wijzigingen met hoog risico waar echte gebruikersgegevens voor volledige rollout
- SLO-gestuurde implementatie (auto-rollback als metrieken verslechteren)

**Hoe (Kubernetes + Argo Rollouts):**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5    # 5% van verkeer
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

**Eenvoudige kanarie zonder Argo (Kubernetes):**
```bash
# Voer nieuwe implementatie naast oud uit met 1 replica (oud heeft 9 = 10% kanarie)
kubectl scale deployment api-new --replicas=1
kubectl scale deployment api-old --replicas=9

# Als gezond, gradueel verschuiven
kubectl scale deployment api-new --replicas=5
kubectl scale deployment api-old --replicas=5

# Volledig cutover
kubectl scale deployment api-new --replicas=10
kubectl delete deployment api-old
```

---

## Patroon 5: Functie-vlaggen (Release toggles)

**Hoe het werkt:** Code wordt geïmplementeerd maar functies worden in/uit geschakeld zonder implementatie.

**Wanneer gebruiken:**
- Ontkoppel implementatie van release (altijd aanbevolen)
- A/B-test nieuwe functies
- Graduele rollout per gebruikerssegment (% gebruikers, specifieke klanten, bèta-gebruikers)
- Dodenschakelaar voor functies die problemen kunnen veroorzaken

**Eenvoudige implementatie:**
```typescript
// Feature flag service gebruiken (LaunchDarkly, Flagsmith, Growthbook, of PostHog)
const flags = await getFeatureFlags(userId)

if (flags.newCheckoutFlow) {
  return <NewCheckout />
} else {
  return <OldCheckout />
}

// Of: omgevingsvariabele-gebaseerd (eenvoudiger, minder granulaar)
const showNewFeature = process.env.FEATURE_NEW_CHECKOUT === 'true'
```

**PostHog feature flags (gratis tier, open source):**
```typescript
import { PostHog } from 'posthog-node'
const client = new PostHog(process.env.POSTHOG_API_KEY!)

const isEnabled = await client.isFeatureEnabled('new-checkout', userId)
```

---

## Het juiste patroon kiezen

| Patroon | Snelheid | Rollback | Risico | Beste voor |
|---|---|---|---|---|
| Direct | Snel | Traag | Hoog | Hotfixes, interne tools |
| Rolling | Gemiddeld | Gemiddeld | Gemiddeld | Standaard API implementaties |
| Blauw-groen | Snel (switch) | Direct | Laag | Nul downtime vereiste |
| Kanarie | Traag | Snel | Zeer laag | Hoog risico, grote schaal |
| Functie-vlaggen | Direct | Direct | Minimaal | Alle productie functies |

**Standaard aanbeveling:** Rolling implementatie + functie-vlaggen. Rolling voor infra; vlaggen voor productwijzigingen.

---
