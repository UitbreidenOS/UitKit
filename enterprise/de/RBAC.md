# Role-Based Access Control (RBAC)

Enterprise Edition implementiert granulares RBAC, um zu steuern, auf welche Tools, Stacks und Features Benutzer zugreifen können. Dieses Dokument spezifiziert das Rollenmodell, Berechtigungen und Team-Management.

## Rollenhierarchie

Rollen sind hierarchisch. Höhere Rollen erben alle Berechtigungen niedrigerer Rollen.

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

## Rollendefinitionen

### Viewer
**Basis Read-Only-Rolle**

Berechtigungen:
- `Read` — Dateien lesen
- `Bash` (read-only) — `ls`, `cat`, `git status`
- Audit-Logs anzeigen (nur eigene Session)
- Kosten anzeigen (nur eigene Session)

Anwendungsfall: Neue Team-Mitglieder, Contractor, Auditoren

### Engineer
**Standard-Entwicklungsrolle**

Erbt: Viewer

Zusätzliche Berechtigungen:
- `Write`, `Edit` — Dateien ändern
- `Bash` (all) — vollständiger Shell-Zugriff
- Subagenten spawnen
- Tasks erstellen/ausführen

Einschränkungen:
- Kann RBAC nicht ändern
- Kann Hooks nicht aktivieren/deaktivieren
- Kann nur eigene Audit-Logs anzeigen
- Cost Cap: $5 pro Session

Anwendungsfall: Software Engineers, Entwickler

### Cost Controller
**Budget Enforcement & Reporting**

Erbt: Engineer

Zusätzliche Berechtigungen:
- `Read` Audit Logs (alle Benutzer)
- Kostenkontrollen durchsetzen
- Kostenberichte generieren
- Cost-Monitoring-Agenten spawnen

Einschränkungen:
- Kann Code-Dateien nicht ändern
- Kann Benutzerberechtigungen nicht ändern
- Kann SSO-Einstellungen nicht zugreifen

Anwendungsfall: Finance Team, FinOps Engineer

### Security Officer
**Compliance & Audit Oversight**

Erbt: Engineer

Zusätzliche Berechtigungen:
- `Read` Audit Logs (alle Benutzer, alle Zeiten)
- PII-Scan-Regeln ändern
- Compliance-Hooks aktivieren/deaktivieren
- Security-Review-Agenten spawnen
- Audit-Log-Aufbewahrungsrichtlinie ändern

Einschränkungen:
- Kann Kosteneinstellungen nicht ändern
- Kann Audit-Logs nicht löschen
- Kann Logging nicht deaktivieren

Anwendungsfall: Security Team, Compliance Officer

### Admin
**Vollständiger Systemzugriff**

Erbt: Alle

Berechtigungen:
- RBAC ändern
- Teams und Team-Stacks verwalten
- Alle Hooks aktivieren/deaktivieren
- SSO, Verschlüsselung, Geheimnisse konfigurieren
- Audit-Logs löschen/archivieren
- Lizenzen und Abrechnung verwalten (Cloud)

Anwendungsfall: Systemadministratoren, Tech Leads

## Standard-Rollenzuweisungen

Wenn sich ein Benutzer zum ersten Mal anmeldet:

| Benutzertyp | Standard-Rolle | Eskalation |
|-----------|--------------|------------|
| SSO-Benutzer mit Gruppe "Engineering" | Engineer | Admin vergibt explizit |
| SSO-Benutzer mit Gruppe "Security" | Security Officer | — |
| SSO-Benutzer mit Gruppe "Finance" | Cost Controller | — |
| SSO-Benutzer (keine Gruppe) | Viewer | Vom Admin anfordern |
| Git-Benutzer (lokal, kein SSO) | Engineer | CLAUDIENT_ROLE env var setzen |

## Team Stack Management

Teams können Zugriff auf bestimmte Stacks besitzen/einschränken.

### Team Ownership definieren

```json
{
  "teams": {
    "platform-team": {
      "members": ["alice@company.com", "bob@company.com"],
      "role": "Engineer",
      "owned_stacks": [
        "devops_platform_stack",
        "kubernetes_stack"
      ],
      "cost_budget_usd": 500
    }
  }
}
```

### Stack-Level Berechtigungen

Wenn ein Benutzer einen Stack zugreift:

1. Benutzerrolle überprüfen
2. Team-Mitgliedschaft überprüfen
3. Tool-Whitelist überprüfen
4. Kosten überprüfen

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
| Delete logs | ❌ | ❌ | ❌ | ❌ | ✅ |

## Rollen zuweisen

### Via SSO (Empfohlen)

Konfigurieren Sie in settings.json:

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

### Via Git Config (Lokal)

Für On-Prem ohne SSO:

```bash
git config --global claudient.role engineer
git config --global claudient.team platform-team
```

Oder Environment Variable setzen:

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

Wenn ein Benutzer versucht, auf eine Aktion zuzugreifen, für die er keine Berechtigung hat:

### Nach Rolle

| Verstoß | Viewer | Engineer | Cost Ctrl | Security | Admin |
|---------|--------|----------|-----------|----------|-------|
| Write file | 🚫 Block | — | 🚫 Block | — | — |
| Bash (restricted) | 🚫 Block | 🚫 Block | 🚫 Block | — | — |
| View other's logs | 🚫 Block | 🚫 Block | — | — | — |
| Modify RBAC | 🚫 Block | 🚫 Block | 🚫 Block | 🚫 Block | — |

### Durchsetzungsmechanismus

Verstöße werden vom Hook `rbac-enforcer.sh` erfasst:

```bash
echo "ERROR: User 'viewer@company.com' kann 'Write' Tool nicht verwenden"
exit 1
```

Der Tool-Aufruf wird nie ausgeführt. Session-Logs enthalten den Verstoß für Audit.

## Delegierte Verwaltung

Admins können spezifische Verantwortung delegieren:

### Security Officer Delegation

Ein Admin kann eine benutzerdefinierte Rolle erstellen:

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
        "cannot:delete_logs"
      ]
    }
  }
}
```

### Cost Controller Delegation

Finance-Manager kann auf Budget-Durchsetzung begrenzt werden:

```json
{
  "roles": {
    "budget-manager": {
      "inherits": "viewer",
      "permissions": [
        "audit_logs.read",
        "costs.enforce",
        "costs.report"
      ]
    }
  }
}
```

## Auditing RBAC Changes

Jede RBAC-Änderung wird protokolliert:

```json
{
  "timestamp": "2026-06-15T14:00:00Z",
  "event_type": "rbac_change",
  "actor": "admin@company.com",
  "action": "assign_role",
  "target_user": "carol@company.com",
  "new_role": "security-officer"
}
```

## Compliance Benefits

- **SOC 2 Type II**: RBAC zeigt logische Zugriffskontrolle
- **GDPR**: Rollenbeschränkungen verhindern unauthorized Datenzugriff
- **HIPAA**: Segregation von Pflichten
- **ISO 27001**: Zugriffskontrollrichtlinie

---

**Last updated**: 2026-06-15  
**Related files**: `AUDIT_TRAIL.md`, `SSO_SETUP.md`, `COMPLIANCE.md`
