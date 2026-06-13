# Leitfaden für Bereitstellungsmuster

Häufige Bereitstellungsstrategien — wann man jede einsetzt, wie man sie implementiert und die Kompromisse.

## Muster 1: Direkte Bereitstellung (alles auf einmal)

**Wie es funktioniert:** Neue Version auf alle Server gleichzeitig bereitstellen.

**Wann verwenden:**
- Nicht kritische Services oder interne Tools
- Kleine Nutzerbasis, wo Rollback schnell ist
- Zustandslose Services ohne Datenbankmigrationen
- Notfall-Hotfixes, die überall sofort sein müssen

**Wie:**
```bash
# Railway / Render / Heroku Stil
git push origin main

# Docker / Kubernetes
kubectl set image deployment/api api=my-image:v2.0.0

# Verifizieren
kubectl rollout status deployment/api
```

**Rollback:**
```bash
kubectl rollout undo deployment/api
# oder: vorheriges Image-Tag bereitstellen
```

**Risiken:** Vollständiger Impact wenn etwas falsch ist. Alle Nutzer sofort betroffen.

---

## Muster 2: Rolling Deploy

**Wie es funktioniert:** Instanzen einzeln ersetzen. Zu jedem Zeitpunkt führen einige alte, andere neue Version aus.

**Wann verwenden:**
- Services, die gleichzeitig Anfragen von alten und neuen Versionen sicher verarbeiten können
- Standard Web APIs ohne Breaking Schema-Änderungen
- Die meisten Production Services als Default-Strategie

**Wie (Kubernetes):**
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # 1 neue Pod vor Entfernung der alten hinzufügen
      maxUnavailable: 0    # nie weniger als gewünscht laufende Pods
```

```bash
# Bereitstellen
kubectl apply -f deployment.yaml

# Überwachen
kubectl rollout status deployment/api
# Watch: kubectl get pods -w
```

**Vorbedingung:** Anwendung muss während Übergang abwärtskompatibel sein (alt und neu parallel).

**Rollback:**
```bash
kubectl rollout undo deployment/api
```

---

## Muster 3: Blue-Green Deploy

**Wie es funktioniert:** Zwei identische Umgebungen (blau = aktuell, grün = neu). Traffic sofort umschalten.

**Wann verwenden:**
- Nullausfallzeit-Anforderung
- Sofortige Rollback-Fähigkeit nötig
- Datenbankmigrationen, die bestimmte App-Version erfordern
- Hochlast-Services, wo graduelles Rollout nicht granular genug

**Wie:**
```yaml
# Zwei Deployments: api-blue (aktuell) und api-green (neu)
# Service wählt, welches Deployment Traffic bekommt

# Neue Version zu grün bereitstellen
kubectl apply -f deployment-green.yaml

# Grün testen (nur interner Traffic)
kubectl port-forward svc/api-green 3001:3000

# Traffic zu grün wechseln
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# Grün ist jetzt live. Blau für sofortiges Rollback behalten.
# Nach 24h stabil: blau stilllegen
kubectl delete deployment api-blue
```

**Mit AWS ALB:**
```bash
# Gewichtetes Routing: 100% → blau
# Neue Version über direkt grünen Endpoint testen
# Tausch: 100% → grün
aws elbv2 modify-rule --rule-arn ... --actions ... 
```

---

## Muster 4: Canary Deploy

**Wie es funktioniert:** Senden % Traffic zu neuer Version, graduell erhöhen.

**Wann verwenden:**
- Große Nutzerbasis, wo 1% Traffic bedeutendes Signal ist
- Hochrisiko-Änderungen, wo echte Nutzerdaten vor vollem Rollout
- SLO-getriebene Bereitstellung (Auto-Rollback wenn Metriken degradieren)

**Wie (Kubernetes + Argo Rollouts):**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 5    # 5% Traffic
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

**Einfacher Canary ohne Argo (Kubernetes):**
```bash
# Neue Deployment neben alter mit 1 Replik (alt hat 9 = 10% canary)
kubectl scale deployment api-new --replicas=1
kubectl scale deployment api-old --replicas=9

# Wenn gesund, graduell verschieben
kubectl scale deployment api-new --replicas=5
kubectl scale deployment api-old --replicas=5

# Vollständiger Cutover
kubectl scale deployment api-new --replicas=10
kubectl delete deployment api-old
```

---

## Muster 5: Feature Flags (Release Toggles)

**Wie es funktioniert:** Code ist bereitgestellt aber Features sind ein/aus ohne Deploy.

**Wann verwenden:**
- Deploy von Release entkoppeln (immer empfohlen)
- A/B-Tests neuer Features
- Graduelles Rollout nach Nutzersegment (% Nutzer, spezifische Kunden, Beta-Nutzer)
- Kill-Switch für Features die Probleme verursachen könnten

**Einfache Implementierung:**
```typescript
// Feature-Flag-Service verwenden (LaunchDarkly, Flagsmith, Growthbook, oder PostHog)
const flags = await getFeatureFlags(userId)

if (flags.newCheckoutFlow) {
  return <NewCheckout />
} else {
  return <OldCheckout />
}

// Oder: Umgebungsvariablen-basiert (einfacher, weniger granular)
const showNewFeature = process.env.FEATURE_NEW_CHECKOUT === 'true'
```

**PostHog Feature Flags (kostenlos, open source):**
```typescript
import { PostHog } from 'posthog-node'
const client = new PostHog(process.env.POSTHOG_API_KEY!)

const isEnabled = await client.isFeatureEnabled('new-checkout', userId)
```

---

## Richtiges Muster wählen

| Muster | Geschwindigkeit | Rollback | Risiko | Beste für |
|---|---|---|---|---|
| Direkt | Schnell | Langsam | Hoch | Hotfixes, interne Tools |
| Rolling | Mittel | Mittel | Mittel | Standard API-Deployments |
| Blue-Green | Schnell (Switch) | Sofort | Niedrig | Nullausfallzeit |
| Canary | Langsam | Schnell | Sehr niedrig | Hochrisiko, große Skalierung |
| Feature Flags | Sofort | Sofort | Minimal | Alle Production-Features |

**Standardempfehlung:** Rolling Deploy + Feature Flags. Rolling für Infrastruktur; Flags für Produktänderungen.

---
