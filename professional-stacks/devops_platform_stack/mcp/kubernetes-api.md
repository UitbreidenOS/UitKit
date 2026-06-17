# MCP Tool: Kubernetes API

## Purpose

Direct access to Kubernetes cluster state, pod logs, and resource queries.

## Tools Provided

- `kubectl-get` — Query resources (pods, services, deployments, etc.)
- `kubectl-logs` — Stream pod logs
- `kubectl-describe` — Get detailed resource information
- `kubectl-exec` — Run commands inside pods
- `kubectl-apply` — Apply manifests

## Config

```json
{
  "mcp": [
    {
      "name": "kubernetes-api",
      "command": "kubectl",
      "env": {
        "KUBECONFIG": "~/.kube/config"
      }
    }
  ]
}
```

## Example

Query all pods in default namespace and return their status.
