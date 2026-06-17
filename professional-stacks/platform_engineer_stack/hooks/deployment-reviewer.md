# Deployment Reviewer Hook

## Purpose

Automatically validates infrastructure changes (Terraform, Helm, Kubernetes manifests) for security, cost, and reliability issues before applying changes to production.

## settings.json Configuration

```json
{
  "hooks": {
    "preToolUse": {
      "deployment-reviewer": {
        "shell": "bash",
        "script": "platform_engineer_stack/hooks/deployment-reviewer.sh",
        "filter": {
          "toolNames": ["CompatBash07a2a1"],
          "commandPatterns": [
            "terraform apply",
            "kubectl apply",
            "helm upgrade",
            "helm install",
            "argocd app sync"
          ]
        }
      }
    }
  }
}
```

## Hook Behavior

This hook fires BEFORE infrastructure changes are applied. It:

1. **Detects infrastructure commands** — terraform apply, kubectl apply, helm upgrade, etc.
2. **Extracts the change** — Identifies what files are being modified
3. **Validates for issues:**
   - Security: Secrets in plaintext? Overly permissive IAM? Unencrypted data?
   - Cost: Provisioning expensive resources without justification? Reserved instances available?
   - Reliability: Missing health checks? Single point of failure? No backup strategy?
   - Compliance: RBAC properly configured? Audit logging enabled?
4. **Surfaces findings** — Lists potential issues and recommends fixes
5. **Allows override** — User can acknowledge risks and proceed if intentional

## Example Flow

```
User: kubectl apply -f deployment.yaml

Hook intercepts and checks:
✓ Pod has resource limits
✓ Pod has liveness probe
✗ Pod missing readiness probe
⚠ Image tag is 'latest', should use specific version
⚠ Service account has broad permissions (wildcard on secrets)

Recommendation:
- Add readiness probe
- Use image:v1.2.3 instead of latest
- Restrict service account to specific secrets

Prompt: "Proceed with changes? [y/n/details]"
```

## Implementation

Hook script: `platform_engineer_stack/hooks/deployment-reviewer.sh`

**Script responsibilities:**

1. Parse infrastructure config files
2. Check against security policies
3. Estimate cost impact
4. Validate reliability patterns
5. Report findings to user
6. Allow override for acknowledged risks

## Validation Rules

### Security

```bash
# Secrets in Terraform files
grep -r 'password\|api_key\|secret' *.tf | grep -v 'secret_ref' && echo "FAIL: Secrets in plaintext"

# RBAC too permissive
grep -r 'verbs: \["*"\]' k8s/*.yaml && echo "FAIL: Overly broad RBAC"

# Encryption enabled
grep 'encrypted: true' *.tf || echo "WARN: Encryption not enabled"

# TLS configured
grep -r 'protocol: TCP' k8s/*.yaml | grep -v '443\|8443' && echo "WARN: Non-TLS traffic allowed"
```

### Cost

```bash
# Resource requests set (required for scheduling)
grep -r 'requests:' k8s/*.yaml || echo "WARN: No resource requests set"

# Instance type reasonable
grep 'instance_type = "p3.8xlarge"' *.tf && echo "WARN: Expensive GPU instance"

# Reserved instances available
# Check if baseline workload could use reserved capacity
```

### Reliability

```bash
# Health checks configured
grep -r 'livenessProbe\|readinessProbe' k8s/*.yaml || echo "WARN: No health probes"

# Replicas > 1
grep 'replicas: 1' k8s/*.yaml && echo "WARN: Single replica (no redundancy)"

# Backup strategy defined
grep -r 'backup' *.tf || echo "WARN: No backup strategy"

# Multi-AZ
grep -r 'availability_zones = \[.*,.*\]' *.tf || echo "WARN: Single AZ deployment"
```

## Status

Stub — structure defined, implementation pending. Script should be created with validation rules.

## Testing the Hook

```bash
# Test with intentionally problematic manifest
kubectl apply -f bad-deployment.yaml

# Hook should catch issues:
# WARN: Secrets in environment variables (use SecretKeyRef instead)
# WARN: No resource limits (add memory/CPU limits)
# WARN: Single replica (add redundancy for production)
```

---
