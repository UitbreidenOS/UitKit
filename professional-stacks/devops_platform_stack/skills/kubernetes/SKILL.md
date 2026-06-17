# Kubernetes Deployment

## When to activate

User is deploying workloads to Kubernetes, debugging pod issues, or managing cluster resources.

## When NOT to use

For local Docker development — use docker-optimization skill instead.

## Instructions

1. Validate manifests (`kubectl apply --dry-run=client`)
2. Review resource requests/limits
3. Check rollout status and pod logs
4. Apply changes with approval

## Example

Deploy a stateless service with canary rollout strategy.
