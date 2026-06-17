# Kubernetes Configuration

## When to activate

When designing Kubernetes manifests, creating or updating Helm charts, configuring network policies, setting up RBAC, defining resource quotas, or optimizing workload scheduling. Use when deploying services to Kubernetes or auditing cluster configurations.

## When NOT to use

For cluster upgrades, node management, or troubleshooting runtime issues. For Kubernetes operations beyond manifest/configuration design, use infrastructure or runbook skills.

## Instructions

### 1. Design Deployment Strategy

Decide how your service will run:

**Deployment vs StatefulSet vs DaemonSet:**
- Deployment: Stateless services, web APIs, workers
- StatefulSet: Databases, caches with persistent state, ordered startup
- DaemonSet: Log collectors, monitoring agents, running on every node
- Job/CronJob: One-time tasks, scheduled batches

**Replica Strategy:**
- Minimum replicas: What's the bare minimum for redundancy?
- Maximum replicas: What's the upper bound before cost becomes prohibitive?
- Desired replicas: Normal operating level
- Pod Disruption Budget (PDB): How many can be disrupted during updates?

**Update Strategy:**
- Rolling updates: Replace pods gradually (default, zero-downtime)
- Blue-green: Switch traffic between two complete sets
- Canary: Route 10% to new version, monitor, then ramp to 100%
- Recreate: Delete all, then create new (downtime acceptable)

### 2. Configure Resource Requests & Limits

Define CPU and memory:

**Requests (reservation):**
- CPU: Millicores (m). e.g., 250m = 0.25 CPU
- Memory: Bytes, typically Mi or Gi. e.g., 256Mi = 256 megabytes
- Scheduler uses requests to place pods on nodes
- **Always set requests** — without them, pods can be evicted on node pressure

**Limits (cap):**
- CPU: Hard limit; pod is throttled if it exceeds
- Memory: Hard limit; pod is OOMKilled if it exceeds
- Set limits to prevent resource hogging
- Limit ≥ request, typically 2x request

**Sizing Guide:**
- Small service: requests: 100m CPU / 128Mi RAM, limits: 200m / 256Mi
- Medium service: requests: 250m / 256Mi, limits: 500m / 512Mi
- Large service: requests: 500m / 512Mi, limits: 1000m / 1Gi
- Memory-intensive: requests: 500m / 1Gi, limits: 1000m / 2Gi

### 3. Configure Health Checks

Ensure Kubernetes knows when your service is healthy:

**Liveness Probe:** Is the pod alive or crashed?
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 10        # Wait before first check
  periodSeconds: 10              # Check every 10 seconds
  timeoutSeconds: 2              # Fail if response takes > 2 sec
  failureThreshold: 3            # Restart after 3 failures
```

**Readiness Probe:** Is the service ready to accept traffic?
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 1
  failureThreshold: 2            # Remove from load balancer after 2 failures
```

**Startup Probe:** Has the service initialized? (for slow-starting apps)
```yaml
startupProbe:
  httpGet:
    path: /startup
    port: 8080
  failureThreshold: 30           # Give 30 * 10 = 300 seconds to start
  periodSeconds: 10
```

### 4. Set Up Network Policies

Control traffic between pods:

**Default: Deny all ingress**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

**Allow specific ingress:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-service
    ports:
    - protocol: TCP
      port: 5432
```

### 5. Configure RBAC

Control what pods can do:

**ServiceAccount: Identity for pods**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-service
  namespace: production
```

**Role: Permissions within namespace**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: api-service-role
  namespace: production
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["api-credentials"]
  verbs: ["get"]
```

**RoleBinding: Connect ServiceAccount to Role**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-service-binding
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: api-service-role
subjects:
- kind: ServiceAccount
  name: api-service
  namespace: production
```

### 6. Use ConfigMaps and Secrets

Manage configuration and secrets:

**ConfigMap: Non-sensitive configuration**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: production
data:
  LOG_LEVEL: "info"
  DATABASE_POOL_SIZE: "20"
  CACHE_TTL_SECONDS: "3600"
```

**Secret: Sensitive data (use external secret manager in production)**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-credentials
  namespace: production
type: Opaque
stringData:
  database-password: "..." # Use external secret manager instead
  api-key: "..."
```

### 7. Complete Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  namespace: production
  labels:
    app: api-service
    version: v1.2.3
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # Create 1 extra pod during update
      maxUnavailable: 0    # Never remove a pod (zero downtime)
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
        version: v1.2.3
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: api-service
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
      - name: api
        image: myregistry.azurecr.io/api:v1.2.3
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        env:
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: api-config
              key: LOG_LEVEL
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: api-credentials
              key: database-password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 10
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          failureThreshold: 2
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values: ["api-service"]
              topologyKey: kubernetes.io/hostname
      terminationGracePeriodSeconds: 30

---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  selector:
    app: api-service
  type: ClusterIP
  ports:
  - name: http
    port: 80
    targetPort: http
    protocol: TCP

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-service-pdb
  namespace: production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api-service
```

## Helm Chart Example

For production deployments, use Helm charts to templatize configurations:

**Chart structure:**
```
api-service-chart/
├── Chart.yaml
├── values.yaml                  # Default values
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── networkpolicy.yaml
│   ├── rbac.yaml
│   └── ingress.yaml
└── values/
    ├── dev.yaml                 # Development overrides
    ├── staging.yaml             # Staging overrides
    └── production.yaml          # Production overrides
```

**Deploy across environments:**
```bash
# Development
helm install api-service ./api-service-chart \
  --namespace dev \
  --values api-service-chart/values/dev.yaml

# Production
helm install api-service ./api-service-chart \
  --namespace production \
  --values api-service-chart/values/production.yaml
```

## Best Practices

1. **Always set resource requests** — Scheduler needs them to place pods
2. **Use liveness + readiness probes** — Kubernetes needs to know pod health
3. **Run as non-root** — Reduce security blast radius
4. **Use SecurityContext** — Drop capabilities, set read-only filesystem
5. **Pod Disruption Budget** — Protect against voluntary disruptions
6. **Namespace isolation** — Separate dev/staging/production
7. **Network policies** — Default deny, allow only necessary traffic
8. **Image pull policy** — Use specific image tags, not `:latest`
9. **Graceful shutdown** — Handle SIGTERM, drain connections before exit
10. **Monitor resource usage** — Track requests vs actual usage, adjust quarterly

---
