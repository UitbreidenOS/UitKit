# Security Scanning

## When to activate

Running vulnerability scans, enforcing policy compliance, or remediating CVEs.

## When NOT to use

For architectural security reviews — escalate to security specialist agent.

## Instructions

1. Run container/dependency scanners (Trivy, Dependabot)
2. Review CVE severity and remediation paths
3. Update base images and dependencies
4. Document exception and approval workflow

## Example

Scan Kubernetes manifests for misconfigured RBAC, missing network policies, and exposed secrets.
