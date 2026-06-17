# Write Kubernetes Manifest Command

## When to activate

When creating or updating Kubernetes manifests (Deployments, StatefulSets, Services, ConfigMaps, Secrets, DaemonSets), writing Helm charts, or managing Kubernetes resource definitions.

## When NOT to use

For kubectl imperative commands; always use declarative manifests stored in version control.

## Instructions

### Kubernetes Manifest Generation Process

```
/write-k8s-manifest --kind <Deployment|StatefulSet|Service|ConfigMap|Secret> --name <resource-name> --namespace <namespace> --image <image:tag>
```

This command generates production-grade manifests with:

1. **Resource requests & limits:**
   - CPU: realistic production estimate (100m—500m)
   - Memory: app heap + overhead (128Mi—2Gi)
   - Limits: slightly higher than requests for spike handling

2. **Health checks:**
   - Liveness probe: is container alive? (restart if dead)
   - Readiness probe: is container ready for traffic? (remove from load balancer if not ready)
   - Initial delays: 5-10 seconds (app startup time)
   - Periods: 10 seconds (check frequency)

3. **Security hardening:**
   - Security context: runAsNonRoot, readOnlyRootFilesystem, no privilege escalation
   - Drop all Linux capabilities unless needed
   - Service account with minimal RBAC

4. **Metadata for observability:**
   - Labels for grouping: app, version, tier
   - Annotations for monitoring: Prometheus scrape config
   - Namespace for isolation

5. **Configuration management:**
   - ConfigMaps for non-sensitive config
   - Secrets for credentials (encrypted at rest)
   - Environment variables from ConfigMaps/Secrets

6. **Replica and scaling:**
   - Initial replicas appropriate for workload
   - Pod anti-affinity to spread across nodes
   - Horizontal Pod Autoscaler for dynamic scaling

### Deployment Manifest Template

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
      maxSurge: 1
      maxUnavailable: 0
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
        seccompProfile:
          type: RuntimeDefault
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
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
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
      volumes:
      - name: tmp
        emptyDir: {}
      tolerations:
      - key: dedicated
        operator: Equal
        value: batch
        effect: NoSchedule

---
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

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: production
data:
  log.level: "INFO"
  log.format: "json"
  metrics.enabled: "true"

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-service
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  minReplicas: 3
  maxReplicas: 9
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-service
  namespace: production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api-service
```

### StatefulSet Template (for Stateful Workloads)

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
        - containerPort: 5432
          name: postgresql
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

### Service Account and RBAC

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api-service
  namespace: production

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: api-service
  namespace: production
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-service
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: api-service
subjects:
- kind: ServiceAccount
  name: api-service
  namespace: production
```

### Network Policy (Ingress and Egress)

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
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
```

## Validation Checklist

Before deploying any manifest:

- [ ] Resource requests and limits set for all containers
- [ ] Liveness and readiness probes configured
- [ ] Security context: runAsNonRoot, readOnlyRootFilesystem
- [ ] No secrets hardcoded in YAML
- [ ] ImagePullPolicy explicit (IfNotPresent or Always)
- [ ] Labels for identification: app, version
- [ ] Annotations for monitoring (if applicable)
- [ ] Service account created with minimal RBAC
- [ ] Network policies restrict traffic appropriately
- [ ] PodDisruptionBudget set for critical workloads
- [ ] Tested with `kubectl apply --dry-run=client`
- [ ] Validated with kubeval and Kubesec

## Example Workflow

```bash
# 1. Generate manifest
/write-k8s-manifest --kind Deployment --name api-service --namespace production --image myregistry/api:1.0.0

# 2. Validate YAML syntax
kubeval deployment.yaml

# 3. Security scan
kubesec scan deployment.yaml

# 4. Apply to cluster (dry-run first)
kubectl apply -f deployment.yaml --dry-run=client

# 5. Monitor rollout
kubectl rollout status deployment/api-service -n production

# 6. Verify readiness
kubectl get pods -n production -l app=api-service
```

## Next Steps

1. Generate manifest using this command
2. Review for security and resource requirements
3. Validate with kubeval and Kubesec
4. Apply to development cluster first
5. Monitor health checks and metrics
6. Deploy to production with GitOps pipeline
