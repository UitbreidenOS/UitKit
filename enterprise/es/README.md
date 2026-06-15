# Enterprise Edition

Claudient Enterprise Edition extiende Claude Code con seguridad, cumplimiento y características de gobernanza de nivel producción para industrias reguladas y despliegues de alta seguridad.

## Características clave vs. OSS

| Característica | OSS | Enterprise |
|---|---|---|
| Audit logging | Configuración manual | Salida JSONL encriptada integrada |
| Session replay | No | Audit trail completo con capacidad de reproducción |
| Detección PII | No | Escaneo pre-herramienta, patrones regex + ML |
| Aplicación de costos | No | Límites por sesión, alertas de presupuesto, bloqueos de sobrecargo |
| RBAC | No | Roles usuario/equipo, whitelist herramientas, permisos stack |
| Integración SSO | No | SAML 2.0, OIDC, Active Directory |
| Artefactos de cumplimiento | No | Reportes SOC 2 Type II, atestación ISO 27001 |
| Endurecimiento de seguridad | Básico | Despliegue air-gapped, aislamiento de red, escaneo de secretos |
| Agentes gestionados | Básico | Agentes oficial de seguridad, controlador de costos |
| Garantías SLA | No | Disponibilidad 99.99%, soporte 24/7, respuesta a incidentes |

## Quién debería usar Enterprise

- **Servicios financieros**: Bancos, fintech, seguros — requisitos GDPR, SOX, PCI-DSS
- **Sanidad**: Sistemas regulados HIPAA, integración EHR, audit trails
- **Contratistas gubernamentales**: Cumplimiento FedRAMP, CJIS, EAR
- **Grandes empresas**: Despliegues multi-equipo, control de costos, gobernanza de seguridad
- **Organizaciones sensibles a datos**: Investigación médica, biotecnología, entornos IP sensibles

## Arquitectura

Enterprise se despliega como:
- **Despliegue local**: Hooks air-gapped `.claude` con audit logs encriptados
- **Cloud gestionada**: Audit de sesión completa, aislamiento de rol, reportes de cumplimiento (Claudient Cloud)
- **Híbrido**: Compute local + backend de audit cloud (Q3 2026)

## Archivos en este directorio

- **README.md** — Este archivo; descripción de características y opciones de despliegue
- **AUDIT_TRAIL.md** — Esquema de audit log, formato de logging estructurado, captura de sesión
- **SSO_SETUP.md** — Configuración de SAML 2.0 y OIDC para proveedores de identidad empresariales
- **COMPLIANCE.md** — Notas de certificación: SOC 2 Type II, ISO 27001, alineación GDPR, cumplimiento EU AI Act
- **RBAC.md** — Control de acceso basado en roles: roles de usuario, permisos de herramientas, gestión de stack de equipo

## Quick Start

### Deploy audit logging (5 minutos)
```bash
cp hooks/enterprise/audit-logger.sh .claude/hooks/
chmod +x .claude/hooks/audit-logger.sh
# Add settings.json config (see enterprise/AUDIT_TRAIL.md)
```

### Enable PII scanning (3 minutos)
```bash
cp hooks/enterprise/pii-scanner.sh .claude/hooks/
# Add pre-tool-use hook to settings.json
```

### Set up SSO (30 minutos)
Siga las instrucciones de SAML 2.0 u OIDC en **SSO_SETUP.md** con su IdP (Okta, Azure AD, Ping, etc.).

### Enforce cost caps (2 minutos)
```bash
cp hooks/enterprise/cost-cap-enforcer.sh .claude/hooks/
# Set MAX_SESSION_COST and ALERT_THRESHOLD in settings.json
```

## Soporte & Certificación

- **Atestación SOC 2 Type II**: Disponible bajo solicitud para despliegues Claudient Cloud
- **Alcance ISO 27001**: Entornos de despliegue empresariales
- **Acuerdo de Procesamiento de Datos GDPR**: Incluido con licencia empresarial
- **Soporte**: security@claudient.com, respuesta a incidentes 24/7

## Licenciamiento

Enterprise Edition está disponible bajo licencia comercial. Las características pueden ser:
- **Por puesto**: Precios de equipo, renovación anual
- **Despliegue**: On-prem, air-gapped (listo para FedRAMP)
- **Cloud**: Claudient Cloud gestionado con reportes de cumplimiento

Contacte a sales@claudient.com para precios.

---

**Last updated**: 2026-06-15  
**Model guidance**: Haiku (documentation), Opus (security reviews)
