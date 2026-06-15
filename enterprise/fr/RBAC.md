# Role-Based Access Control (RBAC)

Enterprise Edition implémente fine-grained RBAC pour contrôler quels utilisateurs peuvent accéder quels tools, stacks, et features. Ce document spécifie le role model, permissions, et team management.

## Role Hierarchy

Les rôles sont hiérarchiques. Les rôles supérieurs héritent toutes permissions des rôles inférieurs.

```
┌─────────────────────────────────────────────┐
│ Admin                                       │
│ (Full access, manage users/roles, audit)   │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼──────────┐  ┌──────▼─────────────┐
│ Security Officer │  │ Cost Controller    │
│ (Audit, RBAC)    │  │ (Budget enforce)   │
└───────┬──────────┘  └──────┬─────────────┘
        │                    │
        └────────┬───────────┘
                 │
        ┌────────▼────────┐
        │ Engineer        │
        │ (Basic tools)   │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Viewer          │
        │ (Read-only)     │
        └─────────────────┘
```

## Role Definitions

### Viewer
**Base read-only role**

Permissions:
- `Read` — lire files
- `Bash` (read-only) — `ls`, `cat`, `git status`
- View audit logs (own session seulement)
- View cost (own session seulement)

Use case: Nouveaux team members, contractors, auditeurs reviewing code.

### Engineer
**Rôle development standard**

Hérite: Viewer

Permissions additionnelles:
- `Write`, `Edit` — modify files
- `Bash` (tous) — full shell access
- `Bash` tool calls (non-destructive): `git add`, `npm install`, etc.
- Spawn subagents (basique)
- Create/run tasks

Restrictions:
- Ne peut pas modify RBAC ou team assignments
- Ne peut pas enable/disable hooks
- Ne peut pas view autres users' audit logs (seulement own)
- Cost cap: $5 USD par session (configurable)

Use case: Software engineers, developers, technical writers.

### Cost Controller
**Budget enforcement & reporting**

Hérite: Engineer

Permissions additionnelles:
- `Read` audit logs (tous users, tous time)
- Enforce cost caps (global ou per-user)
- Generate cost reports
- Export audit logs pour billing/FinOps
- Spawn cost-monitoring agents

Restrictions:
- Ne peut pas modify code files (read-only pour `Write`/`Edit`)
- Ne peut pas modify user permissions
- Ne peut pas access SSO settings

Use case: Finance team, FinOps engineer, CFO.

### Security Officer
**Compliance & audit oversight**

Hérite: Engineer

Permissions additionnelles:
- `Read` audit logs (tous users, tous time)
- Modify PII scanning rules
- Enable/disable compliance hooks
- Review RBAC assignments
- Spawn security-review agents
- Modify audit log retention policy

Restrictions:
- Ne peut pas modify cost settings (read-only)
- Ne peut pas delete audit logs
- Ne peut pas disable logging entièrement

Use case: Security team, compliance officer, risk management.

### Admin
**Full system access**

Hérite: Tous

Permissions:
- Modify RBAC: create/delete roles, assign users
- Manage teams et team stacks
- Enable/disable any hook
- Configure SSO, encryption, secrets
- Delete ou archive audit logs
- Manage licenses et billing (Cloud)

Use case: System administrators, tech leads, operations.

## Default Role Assignments

Quand un user login pour la première fois:

| User Type | Default Role | Comment escalader |
|-----------|--------------|-----------------|
| SSO user avec group "Engineering" | Engineer | Admin grants explicitement |
| SSO user avec group "Security" | Security Officer | — |
| SSO user avec group "Finance" | Cost Controller | — |
| SSO user (aucun group) | Viewer | Request depuis admin |
| Git user (local, non SSO) | Engineer | Set CLAUDIENT_ROLE env var |

## Team Stack Management

Les équipes peuvent own/restrict access à specific stacks.

### Define Team Ownership

```json
{
  "teams": {
    "platform-team": {
      "members": ["alice@company.com", "bob@company.com"],
      "role": "Engineer",
      "owned_stacks": [
        "devops_platform_stack",
        "infrastructure_as_code_stack",
        "kubernetes_stack"
      ],
      "cost_budget_usd": 500
    },
    "data-team": {
      "members": ["carol@company.com", "dave@company.com"],
      "role": "Engineer",
      "owned_stacks": [
        "data_engineer_stack",
        "database_admin_stack",
        "analytics_engineer_stack"
      ],
      "cost_budget_usd": 1000
    }
  }
}
```

### Stack-Level Permissions

Quand un user accède à un stack:

1. Check user role (Viewer < Engineer < Officer < Admin)
2. Check team membership: si user est member de stack's owner team, grant full access
3. Check tool whitelist: si stack restreint tools, enforce (e.g., "data team ne peut pas utiliser Bash")
4. Check cost: deduct depuis team budget + user budget

Exemple: Data team avec restricted Bash

```json
{
  "stacks": {
    "database_admin_stack": {
      "owned_by": "data-team",
      "role_requirement": "Engineer",
      "restricted_tools": ["Bash"],
      "bash_whitelist": ["mysql", "psql", "pg_restore"],
      "cost_budget_usd": 2000
    }
  }
}
```

User "carol" depuis data-team:
- ✅ Peut run `Bash` avec `mysql` commands
- ✅ Peut run `Read`, `Write`, `Edit`
- ❌ Ne peut pas run arbitrary Bash (`find`, `rm`, etc.)
- ❌ Ne peut pas access "platform-team" stacks

## Permission Matrix

| Permission | Viewer | Engineer | Cost Ctrl | Security | Admin |
|------------|--------|----------|-----------|----------|-------|
| Read files | ✅ | ✅ | ✅ | ✅ | ✅ |
| Write/Edit | ❌ | ✅ | ❌ | ✅ | ✅ |
| Bash (safe) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bash (all) | ❌ | ✅ | ❌ | ✅ | ✅ |
| View own logs | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all logs | ❌ | ❌ | ✅ | ✅ | ✅ |
| Modify RBAC | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage teams | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configure SSO | ❌ | ❌ | ❌ | ❌ | ✅ |
| Enforce costs | ❌ | ❌ | ✅ | ❌ | ✅ |
| Modify compliance | ❌ | ❌ | ❌ | ✅ | ✅ |
| Spawn agents | ✅* | ✅ | ✅* | ✅ | ✅ |
| Delete logs | ❌ | ❌ | ❌ | ❌ | ✅ |

*Viewer et Cost Controller peuvent spawn read-only agents seulement.

## Assigning Roles

### Via SSO (Recommandé)

Configurez dans settings.json:

```json
{
  "sso": {
    "group_mapping": {
      "okta_group:Engineering": "role:engineer",
      "okta_group:Security": "role:security-officer",
      "okta_group:Finance": "role:cost-controller",
      "okta_group:Admins": "role:admin"
    }
  }
}
```

Quand user login, leurs rôles sont automatiquement assignés basé sur IdP group membership.

### Via Git Config (Local)

Pour on-prem sans SSO:

```bash
# Assignez un user à un rôle
git config --global claudient.role engineer
git config --global claudient.team platform-team
```

Ou set environment variable:

```bash
export CLAUDIENT_ROLE=engineer
export CLAUDIENT_TEAM=platform-team
```

### Via API (Claudient Cloud)

```bash
curl -X POST https://api.claudient.com/enterprise/users/alice%40company.com/role \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "security-officer",
    "team": "security-team"
  }'
```

## RBAC Violation Responses

Quand un user tente une action qu'ils n'ont pas permission pour:

### By Role

| Violation | Viewer | Engineer | Cost Ctrl | Security | Admin |
|-----------|--------|----------|-----------|----------|-------|
| Write file | 🚫 Block | — | 🚫 Block | — | — |
| Bash (restricted) | 🚫 Block | 🚫 Block | 🚫 Block | — | — |
| View other's logs | 🚫 Block | 🚫 Block | — | — | — |
| Modify RBAC | 🚫 Block | 🚫 Block | 🚫 Block | 🚫 Block | — |

### Enforcement Mechanism

Les violations sont attrapées par le hook `rbac-enforcer.sh` (PreToolUse):

```bash
# Hook vérifie user role contre tool
# Si denied, prints error et exits

echo "ERROR: User 'viewer@company.com' ne peut pas utiliser 'Write' tool (requiert Engineer+ role)"
exit 1
```

Le tool call n'est jamais exécuté. Session logs inclut la violation attempt pour audit.

## Delegated Administration

Admins peuvent delegate specific responsibilities:

### Security Officer Delegation

Un admin peut créer un custom role:

```json
{
  "roles": {
    "pii-reviewer": {
      "inherits": "security-officer",
      "permissions": [
        "audit_logs.read",
        "pii_scanning.config",
        "incident_response.report"
      ],
      "restrictions": [
        "cannot:delete_logs",
        "cannot:modify_encryption"
      ]
    }
  }
}
```

Puis assignez à un team member:

```bash
git config --global claudient.role pii-reviewer
```

### Cost Controller Delegation

Finance manager peut être limité à budget enforcement seulement:

```json
{
  "roles": {
    "budget-manager": {
      "inherits": "viewer",
      "permissions": [
        "audit_logs.read",
        "costs.enforce",
        "costs.report",
        "agent.spawn:cost-controller"
      ]
    }
  }
}
```

## Auditing RBAC Changes

Chaque RBAC change est loggé:

```json
{
  "timestamp": "2026-06-15T14:00:00Z",
  "event_type": "rbac_change",
  "actor": "admin@company.com",
  "action": "assign_role",
  "target_user": "carol@company.com",
  "new_role": "security-officer",
  "previous_role": "engineer"
}
```

Query toutes RBAC changes:

```bash
jq 'select(.event_type == "rbac_change")' .claude/logs/audit.log
```

## Compliance Benefits

- **SOC 2 Type II**: RBAC démontre logical access control (CC6.1)
- **GDPR**: Role restrictions préviennent unauthorized data access (Article 32)
- **HIPAA**: Segregation of duties entre engineers, security, finance
- **ISO 27001**: Access control policy (A.9.1)

---

**Last updated**: 2026-06-15  
**Related files**: `AUDIT_TRAIL.md`, `SSO_SETUP.md`, `COMPLIANCE.md`
