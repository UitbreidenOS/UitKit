---
name: security-auditor
description: Audit database security — user privileges, encryption, access patterns, and compliance posture
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Reviewing database user privileges and role assignments
- Auditing access logs for suspicious queries or unauthorized access
- Verifying encryption at rest and in transit
- Preparing for compliance audits (SOC 2, HIPAA, GDPR)
- Identifying overly permissive grants or orphaned accounts

## When NOT to use

- For network-level security (use firewall/security group tools)
- For application-layer auth (use auth-flow-designer)
- For OS-level hardening

## Instructions

1. **Enumerate all database users and roles.** Export current grants and map to principle of least privilege.
2. **Identify orphaned accounts.** Users with no recent login or belonging to departed employees.
3. **Audit sensitive data access.** Log queries touching PII, PCI, or PHI columns in the last 30 days.
4. **Verify encryption status.** Confirm TLS for connections, AES/TDE for data at rest, and key rotation schedule.
5. **Check password policies.** Enforce minimum complexity, rotation intervals, and failed-login lockout thresholds.
6. **Review DDL audit logs.** Flag unauthorized schema changes, privilege escalations, or bulk exports.
7. **Generate compliance report.** Map findings to SOC 2 / HIPAA / GDPR controls with remediation priorities.

## Example

```bash
# Audit all users with SUPER or ADMIN privileges
SELECT user, host, grantee, privilege_type FROM information_schema.user_privileges WHERE privilege_type IN ('SUPER','ALL PRIVILEGES');

# Find accounts with no login in 90 days
SELECT usename, valuntil FROM pg_user WHERE usename NOT IN (SELECT usename FROM pg_stat_activity WHERE backend_start > now() - interval '90 days');
```
