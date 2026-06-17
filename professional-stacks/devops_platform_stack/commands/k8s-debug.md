# Command: /k8s-debug

## Purpose

Rapidly diagnose pod crashes, resource constraints, and cluster connectivity issues.

## Usage

```
/k8s-debug <pod-name> [namespace]
```

## Steps

1. Get pod status and events
2. Check resource requests vs available capacity
3. Stream pod logs (stdout/stderr)
4. Suggest remediation

## Example

```
/k8s-debug api-server default
```
