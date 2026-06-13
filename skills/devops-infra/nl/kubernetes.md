> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../kubernetes.md).

# Kubernetes Skill

## Wanneer te activeren
- Kubernetes manifests schrijven (Deployments, Services, ConfigMaps, Secrets, Ingress)
- Helm charts of values-bestanden configureren voor een applicatie
- Een falende Pod, CrashLoopBackOff, of OOMKilled container debuggen
- Horizontal pod autoscaling (HPA) of vertical pod autoscaling (VPA) instellen
- Resource requests en limits definiëren voor containers
- RBAC-beleid schrijven of reviewen (Roles, ClusterRoles, RoleBindings)
- Liveness-, readiness- en startup-probes instellen
- Persistent volumes en persistent volume claims configureren
- Network policies schrijven om pod-naar-pod-verkeer te beheren
- Namespaces en multi-tenant isolatie instellen

## Wanneer NIET te gebruiken
- Docker Compose-setups die niet naar Kubernetes worden gemigreerd
- Serverless (Cloud Run, Lambda, Fargate) — ander deployment-model
- Eenvoudige single-container apps die geen orkestratie nodig hebben
- Lokale ontwikkelomgevingen waar Docker alleen voldoende is
- Nomad, Mesos, of andere niet-Kubernetes orchestrators

## Instructies

### Manifest-structuur
Stel deze velden altijd in voor elke Deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-name
  namespace: production          # Altijd expliciet — nooit vertrouwen op de default namespace
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
          image: registry/app-name:tag   # Gebruik nooit :latest in productie
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Resource requests en limits
- Stel altijd zowel `requests` als `limits` in — nooit weglaten
- `requests` = gegarandeerde resources (gebruikt voor scheduling)
- `limits` = maximaal toegestaan (OOMKilled als geheugen wordt overschreden)
- CPU-limits zijn optioneel in clusters met CPU-throttling uitgeschakeld — maar geheugenlimieten zijn verplicht
- Begin conservatief: requests op ~25% van verwacht, limits op 2x verwacht, dan bijstellen met werkelijke metrieken

### Health probes
Alle productiecontainers moeten probes hebben:
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
- `livenessProbe`-fout → container herstart
- `readinessProbe`-fout → verwijderd uit Service load balancer (geen verkeer, geen herstart)
- Wijs beide nooit naar hetzelfde endpoint — readiness moet afhankelijkheden controleren, liveness niet

### Secrets-beheer
- Zet nooit secrets in ConfigMaps — gebruik Secrets
- Commit nooit Secret-manifests met echte waarden — gebruik sealed-secrets, external-secrets-operator, of Vault
- Verwijs naar secrets als omgevingsvariabelen, niet als volumes, tenzij de app specifiek bestandsgebaseerde secrets vereist:
```yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

### Namespace-conventies
- `default` namespace: alleen voor dev/testing
- Productie-workloads altijd in benoemde namespaces
- Gebruik `ResourceQuota` en `LimitRange` op elke productie-namespace
- RBAC: ontwikkelaars krijgen edit in dev-namespaces, view in productie

### Veelvoorkomende CrashLoopBackOff-oorzaken en oplossingen
1. Ontbrekende omgevingsvariabele → controleer de sectie Events van `kubectl describe pod`
2. Mislukte healthcheck → logs tonen de werkelijke fout, probe detecteert alleen
3. OOMKilled → verhoog de geheugenlimiet of los geheugenlek op
4. Image pull-fout → controleer imagePullPolicy en registrygegevens
5. Init container-fout → `kubectl logs pod-name -c init-container-name`

## Voorbeeld

**Gebruiker:** Implementeer een FastAPI-app met PostgreSQL-verbinding, 3 replica's, resource-limieten en health checks.

**Verwachte outputstructuur:**
- Namespace-manifest
- Secret voor `DATABASE_URL`
- Deployment met 3 replica's, resource requests/limits, liveness + readiness probes die verwijzen naar `/healthz` en `/ready`
- Service (ClusterIP) die port 80 blootstelt → container port 8080
- HorizontalPodAutoscaler gericht op 70% CPU-gebruik, min 3 / max 10 replica's

---
