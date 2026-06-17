# Kubernetes Orchestration

## When to activate

When designing production Kubernetes clusters, planning networking architectures, configuring autoscaling, or setting up monitoring for containerized workloads.

## When NOT to use

For simple applications that don't require container orchestration, or workloads better suited to serverless platforms.

## Instructions

Kubernetes is powerful but complex. Focus on production patterns, not just basic setup. Follow this framework:

### 1. Cluster Design

**Decision: Managed vs. Self-Managed**

| Aspect | EKS (AWS) | AKS (Azure) | GKE (GCP) | Self-managed |
|--------|-----------|-----------|-----------|---|
| Control plane | Managed | Managed | Managed | You manage |
| Nodes | You manage | You manage | You manage | You manage |
| Cost | ~$73/month | ~$70/month | Free (no charge) | Lower but labor |
| Upgrading | Simple | Simple | Simple | Manual, complex |
| Complexity | Medium | Medium | Low | High |
| Recommendation | Enterprise AWS | Enterprise Azure | Cost-conscious | Expert teams |

**Cluster architecture:**

```
EKS Cluster (prod)
├── Control Plane (AWS-managed)
│   └── etcd, API server, scheduler, controller manager
├── Node Groups
│   ├── System nodes (3 × m5.xlarge, 2 AZs minimum)
│   │   └── Runs kube-system pods (CoreDNS, kube-proxy)
│   ├── Application nodes (5-10 × m5.2xlarge, autoscaling)
│   │   └── Runs workload pods
│   └── Spot nodes (3 × m5.2xlarge, optional)
│       └── Runs interruptible workloads (batch jobs, non-critical)
└── Add-ons
    ├── VPC CNI (networking)
    ├── CoreDNS (DNS)
    ├── kube-proxy (service routing)
    ├── Calico (network policies)
    └── EBS CSI driver (storage)
```

### 2. Networking Architecture

**Ingress design (entry point):**

```
Users
  ↓
Route 53 (DNS)
  ↓
ALB/NLB (load balancer)
  ↓
Ingress Controller (nginx, AWS ALB)
  ↓
Service (ClusterIP)
  ↓
Pods (running application)
```

**Ingress resource:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "alb"
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
```

**Service mesh (optional but recommended):**

For large clusters with complex inter-service communication:
```
Istio or Linkerd
├── Sidecar proxies (Envoy)
├── Traffic management (retries, timeouts, circuit breaker)
├── Observability (distributed tracing, metrics)
├── Security (mTLS, authorization policies)
└── Cost: ~10% overhead, requires expertise
```

**Network policies (security):**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  # Deny all by default

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      tier: api
  ingress:
    - from:
        - podSelector:
            matchLabels:
              tier: frontend
      ports:
        - protocol: TCP
          port: 8080
```

### 3. Storage Architecture

**Persistent Volumes (PVs):**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: database-pvc
  namespace: production
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: gp3  # EBS gp3 volume
  resources:
    requests:
      storage: 100Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: production
spec:
  serviceName: postgres
  replicas: 1
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
          image: postgres:15
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ "ReadWriteOnce" ]
        storageClassName: gp3
        resources:
          requests:
            storage: 100Gi
```

**Storage tiers:**

| Use Case | Storage Class | Cost | Persistence |
|----------|---------------|------|-------------|
| Ephemeral (logs, cache) | emptyDir | Free | Pod lifetime |
| Database | EBS gp3/io2 | $0.10-0.40/GB/month | Permanent, snapshots |
| Shared data | EFS/NFS | $0.30/GB/month | Multi-pod access |
| Archive | S3 | $0.023/GB/month | Glacier: $0.004/GB/month |

### 4. Autoscaling

**Horizontal Pod Autoscaler (HPA):**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 3
  maxReplicas: 50
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
      stabilizationWindowSeconds: 300  # Wait 5 min before scaling down
      policies:
        - type: Percent
          value: 50  # Scale down by max 50%
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0  # Scale up immediately
      policies:
        - type: Percent
          value: 100  # Double pods if needed
          periodSeconds: 30
```

**Cluster Autoscaler (scale nodes):**

```yaml
# Scales worker nodes up/down based on pod demand
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-autoscaler-status
  namespace: kube-system
data:
  nodes.max: "100"  # Max worker nodes
  nodes.min: "3"    # Min worker nodes
```

### 5. Resource Requests & Limits

**Set requests and limits for every pod:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  template:
    spec:
      containers:
        - name: app
          image: api:1.0.0
          resources:
            requests:
              cpu: "500m"      # 0.5 vCPU guaranteed
              memory: "512Mi"  # 512 MB guaranteed
            limits:
              cpu: "2000m"     # Max 2 vCPU
              memory: "2Gi"    # Max 2 GB
```

**Rationale:**
- Requests: What K8s guarantees the pod gets (used for scheduling)
- Limits: Max resource usage (pod killed if exceeded)
- Without requests: K8s can overschedule nodes
- Without limits: Single pod can starve others

**Cost impact:**
```
Cluster: 3 × m5.2xlarge (32 GB, 8 vCPU each) = 96 GB, 24 vCPU total

Pod requests:
- 50 API pods × 1 GB = 50 GB memory
- 50 API pods × 500m = 25 vCPU

Utilization: 50/96 GB (52%), 25/24 vCPU (104% oversubscribed)
Action: Add more nodes or reduce replicas
```

### 6. Observability (Metrics, Logs, Traces)

**Prometheus (metrics):**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    scrape_configs:
      - job_name: kubernetes-pods
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: "true"
```

**Key metrics to track:**
```
container_cpu_usage_seconds_total     # CPU usage
container_memory_usage_bytes          # Memory usage
http_requests_total                   # Request count
http_request_duration_seconds         # Latency
errors_total                          # Error count
pod_network_io_errors_total           # Network errors
```

**Loki (logs):**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: loki-config
data:
  loki-config.yaml: |
    clients:
      - url: http://loki:3100/loki/api/v1/push
```

**Jaeger (traces):**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jaeger-config
data:
  jaeger-config.json: |
    {
      "sampler": {"type": "const", "param": 0.1},
      "logLevel": "info"
    }
```

### 7. Security Best Practices

**Pod Security Policy:**

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - configMap
    - secret
    - emptyDir
    - persistentVolumeClaim
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: MustRunAsNonRoot
  fsGroup:
    rule: RunAsAny
  readOnlyRootFilesystem: true
```

**RBAC (Role-Based Access Control):**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: production
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods", "pods/logs"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: developer
subjects:
  - kind: User
    name: john.doe@example.com
```

### 8. GitOps Deployment (ArgoCD)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: api-server
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/infrastructure
    path: kubernetes/api-server
    targetRevision: HEAD
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### 9. Cost Optimization

**Node sizing:**
```
Option A: Many small nodes (t3.xlarge × 20)
- Flexibility: Can bin-pack different workload sizes
- Operational: More nodes to manage
- Cost: Higher (small instances less efficient)

Option B: Fewer large nodes (m5.4xlarge × 5)
- Efficiency: Better bin-packing, less waste
- Operational: Easier to manage
- Cost: Lower
- Trade-off: Pod density limits, failure impact

Recommendation: Medium nodes (m5.2xlarge) with autoscaling
```

**Spot instances:**
```yaml
# Use spot for non-critical workloads
apiVersion: apps/v1
kind: Deployment
metadata:
  name: batch-processor
spec:
  template:
    spec:
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              preference:
                matchExpressions:
                  - key: karpenter.sh/capacity-type
                    operator: In
                    values: ["spot"]  # Prefer spot, fall back to on-demand
```

### 10. Disaster Recovery

**Multi-AZ cluster:**
- At least 3 nodes spread across 3 AZs
- Automatic failover via Kubernetes self-healing
- RTO < 5 minutes (pod reschedules to healthy node)

**Multi-region cluster:**
```
Primary cluster (us-east-1)
Secondary cluster (eu-west-1)
Shared data layer (RDS Multi-region, S3 cross-region replication)
Traffic: Route 53 health check, DNS failover
```

---

## Example

### Production E-commerce Cluster

**Cluster specification:**
```
EKS cluster (prod):
├── 2 AZs minimum (us-east-1a, 1b)
├── System node group: 3 × m5.large (1 per AZ + 1 extra)
├── Application node group: 5-20 × m5.2xlarge (autoscaling)
└── Spot node group: 2-10 × m5.2xlarge (cost optimization)

Control plane: AWS managed, backup enabled
```

**Resource allocation:**
```
API servers:        10 pods × 1 GB = 10 GB
Database proxy:     5 pods × 512 MB = 2.5 GB
Cache layer:        3 pods × 2 GB = 6 GB
Message processor:  20 pods × 256 MB = 5 GB
Monitoring:         10 pods × 512 MB = 5 GB
Total requested:    ~29 GB
Available:          60 GB (system + 5 × m5.2xlarge)
Utilization:        48% (headroom for spikes)
```

**Cost:**
```
System nodes:       3 × $0.192/hour = $1,382/month
App nodes (baseline): 5 × $0.384/hour = $1,382/month
App nodes (burst):  varies, target: 5-10 nodes
Spot nodes:         2-10 × $0.115/hour = $331-1,656/month
Storage:            $200/month (EBS, EFS, snapshots)
Data transfer:      $300/month
EKS control plane:  $73/month
Total:              ~$4,000-5,000/month
```

**Deployment:**
```
git push → GitHub Actions
└─ Build docker image
└─ Push to ECR
└─ Update kustomize/helm
└─ Commit to infra repo
ArgoCD watches infra repo
└─ Detects change
└─ Applies to EKS
└─ Monitors pod health
└─ Rolls back if failure
```

---

**Version:** 1.0  
**Last updated:** 2026-06-15
