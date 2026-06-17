# Kubernetes Integration

## Purpose

Deep integration with Kubernetes clusters for deployment management, debugging, and cluster operations. Enables direct kubectl access through MCP for reading cluster state, applying manifests, and monitoring workloads.

## Architecture

```
Claude Code
    ↓
MCP Kubernetes Server
    ↓
kubectl API
    ↓
Kubernetes Control Plane
    ↓
Cluster Nodes
```

## Configuration

### Prerequisites

1. kubectl installed and authenticated:
```bash
kubectl config current-context
kubectl cluster-info
```

2. Access to multiple clusters (optional):
```bash
kubectl config get-contexts
kubectl config use-context production
```

3. Sufficient permissions on clusters:
```bash
# Check what actions you can perform
kubectl auth can-i list pods --all-namespaces
kubectl auth can-i get pods
kubectl auth can-i create deployments
```

### settings.json Configuration

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "npx",
      "args": ["@kubernetes/mcp-server"],
      "env": {
        "KUBECONFIG": "/Users/tushar/.kube/config",
        "KUBECTL_CONTEXT": "production",
        "LOG_LEVEL": "info"
      },
      "timeout": 30000
    }
  }
}
```

### Multiple Clusters

To work with multiple clusters, create cluster-specific contexts:

```bash
# List contexts
kubectl config get-contexts

# Switch context before Claude Code session
kubectl config use-context staging

# Or specify in environment
export KUBECTL_CONTEXT=production
```

## Capabilities

### Read Operations (Safe)

These operations are read-only and safe:

- **List resources:** pods, deployments, services, ingresses, configmaps, secrets, pvcs, nodes
- **Get details:** describe pods, deployments, services; view manifests
- **Inspect state:** get events, check pod readiness, view metrics
- **View logs:** stream pod logs, get previous logs from crashed containers
- **Query API:** Get API resources, check API server status

### Write Operations (Require Confirmation)

These operations modify cluster state:

- **Apply manifests:** kubectl apply, create deployments, apply configs
- **Scale workloads:** kubectl scale, update replica counts
- **Update configs:** patch deployments, update ConfigMaps
- **Delete resources:** Delete pods, deployments, services (be careful!)

### Debugging Operations

- **Execute commands:** `kubectl exec` for running commands in pods
- **Port forward:** Forward local ports to pod ports
- **Attach to pods:** Interactive access to running containers
- **Get metrics:** Resource usage (CPU, memory) per pod/node

## Common Workflows

### Deploy a Service

```bash
# 1. Apply manifest
kubectl apply -f deployment.yaml -n production

# 2. Verify deployment started
kubectl get deployment api-service -n production
kubectl rollout status deployment/api-service -n production

# 3. Check pod status
kubectl get pods -n production -l app=api-service
kubectl describe pod api-service-abc123 -n production

# 4. View logs
kubectl logs -f pod/api-service-abc123 -n production

# 5. Verify readiness
kubectl get pods -n production -o wide
# All pods should show READY 1/1 and STATUS Running
```

### Debug a Failing Pod

```bash
# 1. Find failing pod
kubectl get pods -n production
# Look for STATUS other than Running

# 2. Describe pod for errors
kubectl describe pod <pod-name> -n production
# Look at Events section for clues

# 3. Check logs
kubectl logs pod/<pod-name> -n production
# For crashed pod, get previous logs:
kubectl logs pod/<pod-name> -n production --previous

# 4. Check parent deployment
kubectl describe deployment <deployment-name> -n production
# Look for errors in ReplicaSet events

# 5. Execute into pod for investigation
kubectl exec -it pod/<pod-name> -n production -- /bin/sh
# Run diagnostics inside container
```

### Scale Deployment

```bash
# Quick scale
kubectl scale deployment api-service --replicas=5 -n production

# Verify scaling
kubectl rollout status deployment/api-service -n production --timeout=5m
kubectl get pods -n production | grep api-service | wc -l
```

### View Resource Usage

```bash
# Node-level metrics
kubectl top nodes

# Pod-level metrics
kubectl top pods -n production
kubectl top pods -n production -l app=api-service

# Resource requests vs usage
kubectl describe nodes | grep -A5 "Allocated resources"
```

### Rollout Management

```bash
# Check rollout history
kubectl rollout history deployment/api-service -n production

# See current version
kubectl describe deployment api-service -n production | grep Image

# Undo to previous version
kubectl rollout undo deployment/api-service -n production

# Rollback to specific version
kubectl rollout undo deployment/api-service -n production --to-revision=3

# Pause/resume rollout
kubectl rollout pause deployment/api-service -n production
kubectl rollout resume deployment/api-service -n production
```

## Query Examples

### Health Checks

```bash
# Pods not ready
kubectl get pods -n production --field-selector=status.phase!=Running

# Pods restarting frequently
kubectl get pods -n production \
  -o json | jq '.items[] | select(.status.containerStatuses[].restartCount > 3)'

# Nodes not ready
kubectl get nodes --field-selector=status.phase!=Ready
```

### Resource Optimization

```bash
# Pods with no resource limits
kubectl get pods -n production -o json | \
  jq '.items[] | select(.spec.containers[].resources.limits == null)'

# Services with no pod selectors (unused)
kubectl get svc -n production -o json | \
  jq '.items[] | select(.spec.selector == null)'

# PersistentVolumes not mounted
kubectl get pv -o json | jq '.items[] | select(.status.phase == "Available")'
```

### Network Policies

```bash
# List network policies
kubectl get networkpolicy -n production

# Check which pods can talk to each other
kubectl describe networkpolicy <policy-name> -n production

# Test connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- /bin/sh
# Inside pod: ping target-service.namespace.svc.cluster.local
```

### Ingress Management

```bash
# List ingresses
kubectl get ingress -n production

# Check ingress rules
kubectl describe ingress api-ingress -n production

# Get ingress IP
kubectl get ingress -n production -o wide
```

## Namespace Management

### Isolate Environments

```bash
# Create namespaces
kubectl create namespace production
kubectl create namespace staging
kubectl create namespace development

# Deploy to specific namespace
kubectl apply -f deployment.yaml -n production

# Switch default namespace
kubectl config set-context --current --namespace=production

# View all resources across namespaces
kubectl get pods --all-namespaces
```

### Resource Quotas

```bash
# Create quota for namespace
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    requests.cpu: "100"
    requests.memory: "100Gi"
    limits.cpu: "200"
    limits.memory: "200Gi"
    pods: "100"
EOF

# Check quota usage
kubectl describe resourcequota production-quota -n production
```

## Advanced Operations

### Port Forwarding

```bash
# Forward local port to pod
kubectl port-forward pod/api-service-abc123 8080:8080 -n production

# Forward to service
kubectl port-forward svc/api-service 8080:8080 -n production

# Access locally
curl http://localhost:8080/health
```

### Execute Commands

```bash
# Run command in pod
kubectl exec pod/api-service-abc123 -n production -- ls -la

# Interactive shell
kubectl exec -it pod/api-service-abc123 -n production -- /bin/bash

# Multiple containers
kubectl exec pod/api-service-abc123 -c api-container -n production -- env
```

### Copy Files

```bash
# Copy from pod to local
kubectl cp production/api-service-abc123:/app/logs/ ./logs

# Copy from local to pod
kubectl cp ./config.yaml production/api-service-abc123:/app/config.yaml
```

## Monitoring Integration

### Get Events

```bash
# Recent cluster events
kubectl get events -n production --sort-by='.lastTimestamp'

# Pod-specific events
kubectl describe pod api-service-abc123 -n production

# Watch events as they occur
kubectl get events -n production --watch
```

### Metrics

```bash
# Top pods by CPU
kubectl top pods -n production --sort-by=cpu

# Top pods by memory
kubectl top pods -n production --sort-by=memory

# Pod resource requests vs actual usage
kubectl describe pod <pod-name> -n production
# Look at Requests and Limits vs actual usage from metrics
```

## Best Practices

1. **Use namespaces** — Separate production, staging, development
2. **Set resource requests/limits** — Scheduler needs them for placement
3. **Add health probes** — Liveness and readiness for production
4. **Label resources** — Use labels for organization and queries
5. **Monitor metrics** — CPU, memory, restarts, network
6. **Keep secrets secure** — Use secret management, not ConfigMaps
7. **Version images** — Never use `:latest`, use specific tags
8. **Test rollbacks** — Know how to recover quickly
9. **Document procedures** — Runbooks for common operations
10. **Automate with Helm** — Don't manually manage manifests

## Troubleshooting

| Issue | Solution |
|-------|----------|
| kubectl: command not found | Install kubectl: `brew install kubectl` or download from k8s.io |
| Connection refused | Check KUBECONFIG, verify cluster is running, test `kubectl cluster-info` |
| Permission denied | Check RBAC, verify user has permissions with `kubectl auth can-i` |
| Pod not starting | Check events with `kubectl describe pod`, check logs with `kubectl logs` |
| High memory usage | Check for memory leaks, verify resource limits, scale up if needed |
| Frequent restarts | Check logs for crashes, verify health probe configuration |

---
