# Kubernetes Manifest Skill

## When to activate

When designing Kubernetes deployments, creating production manifests, writing Helm charts, configuring StatefulSets, implementing RBAC, or managing ConfigMaps and Secrets.

## When NOT to use

For testing with kubectl create or one-off commands; always use declarative manifests in version control.

## Instructions

### Deployment Best Practices

Every Kubernetes manifest must include:

1. **Resource Requests & Limits:** Prevent resource starvation and node eviction
   - CPU: realistic production estimate (e.g., 100m—500m)
   - Memory: JVM heap + overhead (e.g., 256Mi—2Gi)
   - Limits slightly higher than requests to allow spike handling

2. **Health Checks:** Two probes per container
   - **Liveness probe:** Is the container alive? Restart if dead
   - **Readiness probe:** Is the container ready to serve traffic? Remove from load balancer if not ready
   - Initial delay: 5-10 seconds (time for app startup)
   - Period: 10 seconds (check frequency)

3. **Security Context:** Minimize attack surface
   - `runAsNonRoot: true` — Never run as root
   - `readOnlyRootFilesystem: true` — Prevent writes to root FS
   - `allowPrivilegeEscalation: false` — Prevent privilege escalation
   - Drop all Linux capabilities except those explicitly needed

4. **Resource Metadata:** Enable observability
   - Labels for selection and grouping: `app`, `version`, `tier`
   - Annotations for observability: `prometheus.io/scrape: "true"`
   - Namespace for isolation: always specify, never use default

5. **Configuration Management:** Externalize config and secrets
   - ConfigMaps for non-sensitive data
   - Secrets for credentials (preferably encrypted with Sealed Secrets or Kyverno)
   - Never hardcode database URLs, API keys, or credentials

### Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  namespace: production
  labels:
    app: api-service
    version: v1.0.0
  annotations:
    owner: platform-team
    documentation: "https://wiki.example.com/api-service"
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1           # How many extra pods during update
      maxUnavailable: 0     # Must not drop below 3-1=2 pods
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
        version: v1.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: api-service
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: api
        image: registry.example.com/api-service:1.0.0
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
              key: log.level
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: database.url
        - name: ENVIRONMENT
          value: "production"
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: http
            scheme: HTTP
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
            scheme: HTTP
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir:
          sizeLimit: 1Gi
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - api-service
              topologyKey: kubernetes.io/hostname
      tolerations:
      - key: dedicated
        operator: Equal
        value: batch
        effect: NoSchedule
```

### ConfigMap Template

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: production
data:
  log.level: "INFO"
  log.format: "json"
  metrics.enabled: "true"
  cache.ttl: "3600"
```

### Secret Template (Using Sealed Secrets)

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: api-secrets
  namespace: production
spec:
  encryptedData:
    database.url: AgBxJ3o4K2Rc... # Encrypted with sealing key
    api.key: AgC9L4j2K3Mf...
  template:
    metadata:
      name: api-secrets
      namespace: production
    type: Opaque
```

### StatefulSet Template (for Databases)

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: production
spec:
  serviceName: postgres
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - name: postgresql
          containerPort: 5432
        env:
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: postgres-config
              key: database.name
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: password
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: 2000m
            memory: 2Gi
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: ebs
      resources:
        requests:
          storage: 50Gi
```

### Service Template

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: api-service
  ports:
  - name: http
    port: 80
    targetPort: 8080
    protocol: TCP
```

### Network Policy (Restrict Traffic)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-service-netpol
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: production
    ports:
    - protocol: TCP
      port: 5432  # PostgreSQL
  - to:
    - podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53  # DNS
```

## Example

**Scenario:** Deploy a production stateless API service with 3 replicas, observability, security hardening, and health checks.

**Solution:**

1. **Deployment manifest:** Uses the template above with:
   - 3 replicas with pod anti-affinity to spread across nodes
   - Resource requests: 100m CPU, 128Mi memory
   - Liveness probe: checks `/health` every 10 seconds
   - Readiness probe: checks `/ready` every 5 seconds
   - Security context: non-root user, read-only filesystem, no privilege escalation

2. **ConfigMap:** Externalize non-sensitive config (log level, cache TTL, metrics settings)

3. **Secret:** Store encrypted database URL and API keys (using Sealed Secrets or external vault)

4. **Service:** Expose deployment via ClusterIP service on port 80 → 8080

5. **Network Policy:** Allow inbound from ingress-nginx namespace only; restrict egress to PostgreSQL and DNS

6. **Deployment process:**
   - Apply manifest: `kubectl apply -f deployment.yaml`
   - Verify rollout: `kubectl rollout status deployment/api-service -n production`
   - Monitor logs: `kubectl logs -f deployment/api-service -n production`
   - Check readiness: `kubectl get pods -n production -l app=api-service`

This design ensures:
- High availability (3 replicas distributed across nodes)
- Graceful updates (rolling update with maxSurge=1)
- Resource efficiency (requests enable scheduler to bin-pack workloads)
- Security (non-root, read-only filesystem, no capabilities)
- Observability (Prometheus annotations, health endpoints)
- Isolation (namespace, network policies, RBAC)
