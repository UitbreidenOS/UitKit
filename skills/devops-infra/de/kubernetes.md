> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../kubernetes.md).

# Kubernetes Skill

## Wann aktivieren
- Kubernetes-Manifeste schreiben (Deployments, Services, ConfigMaps, Secrets, Ingress)
- Helm-Charts oder Values-Dateien für eine Anwendung konfigurieren
- Einen fehlerhaften Pod, CrashLoopBackOff oder OOMKilled-Container debuggen
- Horizontal Pod Autoscaling (HPA) oder Vertical Pod Autoscaling (VPA) einrichten
- Ressourcenanforderungen und -limits für Container definieren
- RBAC-Richtlinien schreiben oder prüfen (Roles, ClusterRoles, RoleBindings)
- Liveness-, Readiness- und Startup-Probes einrichten
- Persistente Volumes und Persistent Volume Claims konfigurieren
- Netzwerkrichtlinien zur Steuerung des Pod-zu-Pod-Traffics schreiben
- Namespaces und Multi-Tenant-Isolation einrichten

## Wann NICHT verwenden
- Docker Compose-Setups, die nicht nach Kubernetes migriert werden
- Serverless (Cloud Run, Lambda, Fargate) — anderes Deployment-Modell
- Einfache Single-Container-Apps, die keine Orchestrierung benötigen
- Lokale Entwicklungsumgebungen, bei denen Docker allein ausreicht
- Nomad, Mesos oder andere Nicht-Kubernetes-Orchestratoren

## Anweisungen

### Manifest-Struktur
Diese Felder immer in jedem Deployment setzen:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  namespace: production          # Immer explizit — niemals auf den Standard-Namespace verlassen
  labels:
    app: app-name
    version: "1.0.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-name
  template:
    metadata:
      labels:
        app: app-name
        version: "1.0.0"
    spec:
      containers:
        - name: app-name
          image: registry/app-name:tag   # Niemals :latest in der Produktion verwenden
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Ressourcenanforderungen und -limits
- Immer sowohl `requests` als auch `limits` setzen — niemals weglassen
- `requests` = garantierte Ressourcen (werden für das Scheduling verwendet)
- `limits` = maximal erlaubt (OOMKilled, wenn Speicher überschritten wird)
- CPU-Limits sind in Clustern mit deaktivierter CPU-Drosselung optional — aber Speicher-Limits sind obligatorisch
- Konservativ beginnen: requests bei ~25% des Erwarteten, limits bei 2x dem Erwarteten, dann mit tatsächlichen Metriken anpassen

### Health-Probes
Alle Produktions-Container müssen Probes haben:
```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```
- `livenessProbe`-Fehler → Container-Neustart
- `readinessProbe`-Fehler → aus dem Service-Load-Balancer entfernt (kein Traffic, kein Neustart)
- Beide niemals auf denselben Endpunkt zeigen — Readiness sollte Abhängigkeiten prüfen, Liveness nicht

### Secrets-Verwaltung
- Niemals Secrets in ConfigMaps — Secrets verwenden
- Niemals Secret-Manifeste mit echten Werten committen — sealed-secrets, external-secrets-operator oder Vault verwenden
- Secrets als Umgebungsvariablen referenzieren, nicht als Volumes, außer die App benötigt dateibasierte Secrets:
```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

### Namespace-Konventionen
- `default`-Namespace: nur für Dev/Testing
- Produktions-Workloads immer in benannten Namespaces
- `ResourceQuota` und `LimitRange` auf jedem Produktions-Namespace verwenden
- RBAC: Entwickler erhalten edit in Dev-Namespaces, view in der Produktion

### Häufige CrashLoopBackOff-Ursachen und Lösungen
1. Fehlende Umgebungsvariable → `kubectl describe pod` Events-Abschnitt prüfen
2. Fehlgeschlagener Healthcheck → Logs zeigen den eigentlichen Fehler, Probe erkennt ihn nur
3. OOMKilled → Speicher-Limit erhöhen oder Speicherleck beheben
4. Image-Pull-Fehler → imagePullPolicy und Registry-Anmeldedaten prüfen
5. Init-Container-Fehler → `kubectl logs pod-name -c init-container-name`

## Beispiel

**Benutzer:** Eine FastAPI-App mit PostgreSQL-Verbindung, 3 Replikas, Ressourcen-Limits und Health-Checks deployen.

**Erwartete Ausgabestruktur:**
- Namespace-Manifest
- Secret für `DATABASE_URL`
- Deployment mit 3 Replikas, Ressourcenanforderungen/-limits, Liveness + Readiness-Probes, die auf `/healthz` und `/ready` zeigen
- Service (ClusterIP), der Port 80 → Container-Port 8080 exponiert
- HorizontalPodAutoscaler mit 70% CPU-Auslastung als Ziel, min 3 / max 10 Replikas

---
