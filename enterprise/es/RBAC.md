# Control de acceso basado en roles (RBAC)

Enterprise Edition implementa RBAC granular para controlar a qué herramientas, stacks y características pueden acceder los usuarios. Este documento especifica el modelo de rol, permisos y gestión de equipos.

## Jerarquía de roles

Los roles son jerárquicos. Los roles superiores heredan todos los permisos de roles inferiores.

```
┌─────────────────────────────────────────────┐
│ Admin                                       │
│ (Acceso completo, gestionar usuarios/roles) │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼──────────┐  ┌──────▼─────────────┐
│ Security Officer │  │ Cost Controller    │
│ (Auditoría)      │  │ (Aplicación budget)│
└───────┬──────────┘  └──────┬─────────────┘
        │                    │
        └────────┬───────────┘
                 │
        ┌────────▼────────┐
        │ Engineer        │
        │ (Herramientas   │
        │  básicas)       │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Viewer          │
        │ (Solo lectura)  │
        └─────────────────┘
```

## Definiciones de rol

### Viewer
**Rol base de solo lectura**

Permisos:
- `Read` — leer archivos
- `Bash` (solo lectura) — `ls`, `cat`, `git status`
- Ver registros de auditoría (solo sesión propia)
- Ver costo (solo sesión propia)

Caso de uso: Miembros de nuevo equipo, contratistas, auditores

### Engineer
**Rol de desarrollo estándar**

Hereda: Viewer

Permisos adicionales:
- `Write`, `Edit` — modificar archivos
- `Bash` (todos) — acceso completo al shell
- Llamadas de herramienta `Bash` (no destructivas)
- Spawn subagentes
- Crear/ejecutar tareas

Restricciones:
- No puede modificar RBAC
- No puede habilitar/deshabilitar hooks
- No puede ver registros de auditoría de otros usuarios
- Límite de costo: $5 por sesión

Caso de uso: Ingenieros de software, desarrolladores

### Cost Controller
**Aplicación de presupuesto e informes**

Hereda: Engineer

Permisos adicionales:
- `Read` registros de auditoría (todos los usuarios)
- Aplicar límites de costo
- Generar informes de costos
- Spawn agentes de monitoreo de costos

Restricciones:
- No puede modificar archivos de código
- No puede modificar permisos de usuario
- No puede acceder a configuración SSO

Caso de uso: Equipo de finanzas, ingeniero FinOps

### Security Officer
**Supervisión de cumplimiento y auditoría**

Hereda: Engineer

Permisos adicionales:
- `Read` registros de auditoría (todos los usuarios, todas las veces)
- Modificar reglas de escaneo PII
- Habilitar/deshabilitar hooks de cumplimiento
- Spawn agentes de revisión de seguridad
- Modificar política de retención de registros de auditoría

Restricciones:
- No puede modificar configuración de costos
- No puede eliminar registros de auditoría
- No puede deshabilitar registro

Caso de uso: Equipo de seguridad, oficial de cumplimiento

### Admin
**Acceso completo al sistema**

Hereda: Todos

Permisos:
- Modificar RBAC
- Gestionar equipos y stacks de equipo
- Habilitar/deshabilitar cualquier hook
- Configurar SSO, encriptación, secretos
- Eliminar/archivar registros de auditoría
- Gestionar licencias y facturación (Cloud)

Caso de uso: Administradores de sistemas, líderes técnicos

## Asignaciones de rol predeterminadas

Cuando un usuario inicia sesión por primera vez:

| Tipo de usuario | Rol predeterminado | Escalada |
|-----------|--------------|------------|
| Usuario SSO con grupo "Engineering" | Engineer | Admin concede explícitamente |
| Usuario SSO con grupo "Security" | Security Officer | — |
| Usuario SSO con grupo "Finance" | Cost Controller | — |
| Usuario SSO (sin grupo) | Viewer | Solicitar desde admin |
| Usuario Git (local, sin SSO) | Engineer | Establecer variable env CLAUDIENT_ROLE |

## Gestión de stack de equipo

Los equipos pueden poseer/restringir acceso a stacks específicos.

### Definir propiedad del equipo

```json
{
  "teams": {
    "platform-team": {
      "members": ["alice@company.com", "bob@company.com"],
      "role": "Engineer",
      "owned_stacks": ["devops_platform_stack", "kubernetes_stack"],
      "cost_budget_usd": 500
    }
  }
}
```

## Matriz de permisos

| Permiso | Viewer | Engineer | Cost Ctrl | Security | Admin |
|---------|--------|----------|-----------|----------|-------|
| Leer archivos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Escribir/Editar | ❌ | ✅ | ❌ | ✅ | ✅ |
| Bash (seguro) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bash (todos) | ❌ | ✅ | ❌ | ✅ | ✅ |
| Ver registros propios | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver todos los registros | ❌ | ❌ | ✅ | ✅ | ✅ |
| Modificar RBAC | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gestionar equipos | ❌ | ❌ | ❌ | ❌ | ✅ |
| Configurar SSO | ❌ | ❌ | ❌ | ❌ | ✅ |
| Aplicar costos | ❌ | ❌ | ✅ | ❌ | ✅ |
| Modificar cumplimiento | ❌ | ❌ | ❌ | ✅ | ✅ |
| Eliminar registros | ❌ | ❌ | ❌ | ❌ | ✅ |

## Asignar roles

### Vía SSO (Recomendado)

Configure en settings.json:

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

### Vía Git Config (Local)

Para on-prem sin SSO:

```bash
git config --global claudient.role engineer
git config --global claudient.team platform-team
```

O variable de entorno:

```bash
export CLAUDIENT_ROLE=engineer
export CLAUDIENT_TEAM=platform-team
```

### Vía API (Claudient Cloud)

```bash
curl -X POST https://api.claudient.com/enterprise/users/alice%40company.com/role \
  -H "Authorization: Bearer $CLAUDIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "security-officer",
    "team": "security-team"
  }'
```

## Respuestas de violación de RBAC

Cuando un usuario intenta una acción para la cual no tiene permiso:

### Por rol

| Violación | Viewer | Engineer | Cost Ctrl | Security | Admin |
|-----------|--------|----------|-----------|----------|-------|
| Escribir archivo | 🚫 Block | — | 🚫 Block | — | — |
| Bash (restringido) | 🚫 Block | 🚫 Block | 🚫 Block | — | — |
| Ver registros de otros | 🚫 Block | 🚫 Block | — | — | — |
| Modificar RBAC | 🚫 Block | 🚫 Block | 🚫 Block | 🚫 Block | — |

## Beneficios de cumplimiento

- **SOC 2 Type II**: RBAC demuestra control de acceso lógico
- **GDPR**: Las restricciones de rol previenen acceso no autorizado a datos
- **HIPAA**: Segregación de funciones entre ingenieros, seguridad, finanzas
- **ISO 27001**: Política de control de acceso

---

**Last updated**: 2026-06-15  
**Related files**: `AUDIT_TRAIL.md`, `SSO_SETUP.md`, `COMPLIANCE.md`
