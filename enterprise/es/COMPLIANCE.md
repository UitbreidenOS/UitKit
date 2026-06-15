# Cumplimiento y certificaciones

Este documento describe la posición de cumplimiento de Claudient Enterprise Edition, certificaciones y alineación con marcos reguladores.

## SOC 2 Type II

**Estado**: Atestación disponible para despliegues de Claudient Cloud

Claudient Cloud se audita anualmente por una firma de contadores públicos independiente. El informe cubre:

- **CC6 — Controles de acceso lógico y físico**: Autenticación de usuario (SSO), gestión de claves API
- **CC7 — Monitoreo del sistema**: Registro continuo de todas las llamadas de herramientas
- **CC8 — Gestión de cambios**: Audit trail de escritura de archivos
- **CC9 — Mitigación de riesgos**: Los límites de costo previenen sobrecarga

**Cómo acceder**: Solicite `SOC 2 Type II Report` desde sales@claudient.com (NDA requerida)

## ISO 27001

**Estado**: Certificación en progreso (Q3 2026)

Claudient implementa un Sistema de Gestión de Seguridad de la Información ISO 27001 que cubre:

- Organización de seguridad de la información
- Seguridad de recursos humanos
- Gestión de activos
- Control de acceso
- Criptografía
- Seguridad operacional
- Seguridad de comunicaciones
- Desarrollo de sistemas
- Relaciones de proveedores
- Gestión de incidentes de seguridad

**Objetivo**: Certificación en agosto de 2026

## Cumplimiento GDPR

### Acuerdo de procesamiento de datos (DPA)

Al utilizar Claudient Cloud, se aplica un Apéndice de procesamiento de datos (DPA):

- Claudient actúa como **Procesador de datos** (usted es el Controlador)
- Cláusulas contractuales estándar de la UE (ECC) incluidas
- Subprocesadores listados y aprobados
- Las transferencias de datos a EE.UU. requieren salvaguardas adicionales

**Cómo obtener**: Incluido con licencia empresarial

### Sus responsabilidades

Como controlador que utiliza Claude Code + Claudient Cloud:

1. **Minimización de datos**: Evite procesar datos personales innecesariamente
2. **Consentimiento**: Asegúrese de que empleados/usuarios consientan al procesamiento
3. **Derecho al olvido**: Los usuarios pueden solicitar la eliminación de sus registros de auditoría
4. **Retención de datos**: Configure la retención según su política
5. **Notificación de incumplimiento**: Si hay una incidencia, notifique su DPA dentro de 72 horas

## HIPAA

**Estado**: Cumplimiento HIPAA disponible para Claudient Cloud (requiere Acuerdo de asociado comercial)

Si procesa Información de Salud Protegida (PHI):

1. **Solicite BAA**: Claudient firmará el Acuerdo de Asociado Comercial
2. **Habilite encriptación**: Registros de auditoría encriptados en reposo (AES-256-GCM), TLS 1.3 en tránsito
3. **Audit trail**: Todos los accesos a PHI se registran
4. **Controles de acceso**: Use RBAC para limitar quién puede acceder
5. **Respuesta a incidentes**: Claudient respalda la exportación de registros forenses

### Lista de verificación para despliegues HIPAA

- [ ] BAA firmado con Claudient
- [ ] Claudient Cloud habilitada
- [ ] Encriptación en reposo habilitada
- [ ] TLS 1.3 para todo el tráfico de red
- [ ] SSO SAML configurado
- [ ] Registro de auditoría habilitado con retención de 6 años
- [ ] Escaneo PII habilitado
- [ ] Aplicador de límite de costo implementado
- [ ] Capacitación del personal
- [ ] Plan de respuesta a incidentes

## PCI-DSS

**Estado**: Fuera del alcance para Claudient (Claude Code nunca debe procesar datos de tarjetas)

Si trabaja con datos de pago:

1. **NO procese datos de tarjetahabientes** en sesiones de Claude Code
2. **Use escaneo PII**: Habilite para detectar y bloquear números de tarjeta
3. **Tokenización**: Reemplace números de tarjeta con tokens
4. **Audite por separado**: Si un archivo con PII se procesa accidentalmente, los registros de auditoría están disponibles

## FedRAMP (Contratistas gubernamentales)

**Estado**: Implementación autorizada por FedRAMP Q4 2026

Para contratistas del gobierno de EE.UU.:

- Claudient Cloud busca autorización **FedRAMP Moderate**
- Despliegue on-prem air-gapped disponible ahora
- Admite controles NIST SP 800-53

**Capacidades actuales**:
- Registro de auditoría local
- Registros de auditoría encriptados
- Integración SAML 2.0 con IdP on-prem
- Sin llamadas de API externas
- Aplicación de costos mediante hooks locales

## Cumplimiento de la Ley de IA de la UE

**Estado**: Alineación con la Regulación de IA de la UE (2024/1689)

Claude Code es un **sistema de IA** bajo la regulación. Claudient implementa:

### Categorías de alto riesgo

Claude Code **no es** alto riesgo (es una herramienta de desarrollo). Sin embargo, si lo usa para construir sistemas de IA de alto riesgo:

1. **Transparencia**: Los registros de auditoría documentan todas las decisiones de Claude
2. **Supervisión humana**: RBAC asegura que el oficial de seguridad revise antes del despliegue
3. **Calidad de datos**: El escaneo PII evita el entrenamiento con datos personales
4. **Documentación**: El audit trail sirve como documentación de cumplimiento

## SOX (Ley Sarbanes-Oxley)

**Estado**: Útil para equipos de finanzas/auditoría

Si su empresa cotizan en bolsa:

1. **Controles generales de TI (ITGC)**: Claudient satisface gestión de cambios, control de acceso, segregación de funciones
2. **Cambios de sistemas financieros**: Registre todos los cambios en sistemas contables
3. **Documentación**: Exporte registros de auditoría para revisión del comité de auditoría

## Detectión de reglas PII

El escáner PII integrado de Claudient detecta:

| Tipo | Regex | Acción |
|------|-------|--------|
| Email | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` | Block / Flag |
| Teléfono | `(\+?1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}` | Block / Flag |
| SSN | `\d{3}-\d{2}-\d{4}` | Block / Flag |
| Tarjeta de crédito | `\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b` | Block / Flag |

Configurar en settings.json:

```json
{
  "security": {
    "pii_scanning": {
      "enabled": true,
      "action": "block"
    }
  }
}
```

## Lista de verificación de auditoría de cumplimiento

Utilice cuando se prepare para una auditoría externa:

- [ ] SSO configurado
- [ ] Registro de auditoría habilitado (retención de 7+ años)
- [ ] Encriptación habilitada (TLS 1.3, AES-256 en reposo)
- [ ] RBAC configurado
- [ ] Escaneo PII habilitado
- [ ] Límites de costo aplicados
- [ ] Plan de respuesta a incidentes documentado
- [ ] Capacitación del personal completada
- [ ] DPA/BAA firmado
- [ ] Registros de auditoría retenidos por política

---

**Last updated**: 2026-06-15  
**Contact**: compliance@claudient.com  
**Related files**: `AUDIT_TRAIL.md`, `RBAC.md`, `SSO_SETUP.md`
