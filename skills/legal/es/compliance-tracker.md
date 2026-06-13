---
name: compliance-tracker
description: "Realiza el seguimiento de obligaciones regulatorias, plazos y requisitos de evidencia en GDPR, SOC2, ISO27001"
---

# Habilidad: Rastreador de Cumplimiento

## Cuándo activar
- Construir o auditar un registro de obligaciones de cumplimiento en múltiples marcos normativos
- Realizar el seguimiento de los plazos de recopilación de evidencia para auditorías de SOC2, ISO 27001 o GDPR
- Mapear qué controles aplican a qué marcos para evitar trabajo duplicado
- Monitorear plazos regulatorios (ventanas de respuesta a DSAR, plazos de notificación de brechas, renovaciones de certificaciones)
- Incorporar a un nuevo responsable de cumplimiento y necesitar inventariar las obligaciones actuales
- Prepararse para una auditoría y necesitar un análisis de brechas respecto a la evidencia requerida

## Cuándo NO usar
- Asesoramiento jurídico específico por jurisdicción — esta habilidad identifica obligaciones; un abogado las interpreta
- Monitoreo regulatorio en tiempo real — Claude trabaja a partir de marcos conocidos, no de fuentes de derecho en vivo
- Preparación de documentos de presentación reales — esta es una herramienta de seguimiento y planificación
- Reemplazar una plataforma GRC (Vanta, Drata, Secureframe) — usar esas para la recopilación automatizada de evidencia

## IMPORTANTE

Los requisitos de cumplimiento cambian. Todas las listas de obligaciones deben verificarse contra la versión actual de cada estándar (GDPR: según enmiendas; SOC2: Criterios de Servicios de Confianza AICPA 2017; ISO 27001: ISO/IEC 27001:2022). Valide siempre este resultado con su asesor jurídico y auditores externos antes de tratarlo como autoritativo.

## Instrucciones

### Prompt para el registro de obligaciones

```
Build a compliance obligation register for [COMPANY].

Company context:
- Industry: [sector]
- Jurisdictions: [list — e.g. EU/EEA, UK, US, California]
- Data types processed: [personal data / financial data / health data / etc.]
- Business model: [SaaS / marketplace / services / etc.]
- Applicable frameworks: [GDPR / UK GDPR / SOC2 Type II / ISO 27001 / CCPA / HIPAA / PCI-DSS]
- Current certifications: [list with expiry dates, or "none"]
- Annual revenue (for materiality thresholds): [optional]

Produce an obligation register with:

For each framework:
1. Key obligations (condensed — what you must do, not full regulatory text)
2. Evidence type required (policy / record / log / audit / report)
3. Responsible owner (role, not name)
4. Frequency (ongoing / annual / per-event / per-request)
5. Deadline or SLA (where time-bound)
6. Current status: [Compliant / Gap / In Progress / Not Started]

Output format: one table per framework.
```

### Rastreador de obligaciones GDPR

```typescript
interface GDPRObligation {
  article: string             // e.g. "Art. 13", "Art. 30"
  obligation: string          // plain-language description
  evidenceRequired: string[]  // what proves compliance
  owner: string               // DPO / Legal / IT / HR / Marketing
  frequency: 'ongoing' | 'annual' | 'per-event' | 'per-request'
  sla: string | null          // time limit if applicable
  status: 'compliant' | 'gap' | 'in-progress' | 'not-started'
}

const GDPR_CORE_OBLIGATIONS: GDPRObligation[] = [
  {
    article: 'Art. 13-14',
    obligation: 'Provide privacy notices to data subjects at point of collection',
    evidenceRequired: ['Privacy policy', 'Cookie notice', 'Sign-up flow screenshots'],
    owner: 'Legal / Marketing',
    frequency: 'ongoing',
    sla: 'At time of collection',
    status: 'gap', // placeholder — update to actual
  },
  {
    article: 'Art. 30',
    obligation: 'Maintain Records of Processing Activities (RoPA)',
    evidenceRequired: ['RoPA document', 'Last review date and sign-off'],
    owner: 'DPO / Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 32',
    obligation: 'Implement appropriate technical and organisational measures (TOMs)',
    evidenceRequired: ['Security policy', 'Encryption standards doc', 'Access control records', 'Pen test reports'],
    owner: 'CISO / IT',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
  {
    article: 'Art. 33',
    obligation: 'Report personal data breaches to supervisory authority within 72 hours',
    evidenceRequired: ['Incident response plan', 'Breach notification template', 'Breach log'],
    owner: 'DPO / Legal / IT',
    frequency: 'per-event',
    sla: '72 hours from awareness',
    status: 'gap',
  },
  {
    article: 'Art. 35',
    obligation: 'Conduct DPIA for high-risk processing activities',
    evidenceRequired: ['DPIA register', 'Completed DPIAs for high-risk activities'],
    owner: 'DPO',
    frequency: 'per-event',
    sla: 'Before processing begins',
    status: 'gap',
  },
  {
    article: 'Art. 37',
    obligation: 'Appoint a DPO if required (public authority / large-scale processing)',
    evidenceRequired: ['DPO appointment letter', 'DPO contact published on website'],
    owner: 'Legal',
    frequency: 'ongoing',
    sla: null,
    status: 'gap',
  },
]
```

### Rastreador de controles SOC2

```
Build a SOC2 Type II control tracker.

Trust Services Criteria in scope: [TSC — Security (mandatory) + Privacy / Availability / Confidentiality / Processing Integrity]

For each control category, list:
- Control objective
- Control activity (what we actually do)
- Evidence type (the artefact an auditor will ask for)
- Collection method (automated / manual)
- Frequency
- Owner
- Status (in place / partial / gap)

Common security controls to track:

CC6 — LOGICAL AND PHYSICAL ACCESS:
CC6.1: Logical access security measures to protect against threats
  Evidence: Access control policy, SSO/MFA screenshots, quarterly access reviews
  Owner: IT / Security | Frequency: Ongoing + quarterly review | Status: [?]

CC6.2: Registration and authorisation for new internal users
  Evidence: User provisioning process doc, Jira tickets or HRIS records
  Owner: IT / HR | Frequency: Per event | Status: [?]

CC6.3: Removal of access when access is no longer authorised
  Evidence: Offboarding checklist, access removal records
  Owner: IT / HR | Frequency: Per event | Status: [?]

CC7 — SYSTEM OPERATIONS:
CC7.1: Detect and monitor for configuration changes
  Evidence: Change management policy, change log records, SIEM alerts
  Owner: IT / DevOps | Frequency: Ongoing | Status: [?]

CC7.2: Monitor system components for anomalies
  Evidence: Monitoring tool screenshots (Datadog, CloudWatch, etc.), alert configuration
  Owner: Engineering | Frequency: Ongoing | Status: [?]

[Continue for all applicable controls]
```

### Rastreador de cláusulas ISO 27001

```
Build an ISO 27001:2022 compliance tracker.

Applicable Annex A controls: [use all / or list specific domains in scope]

Format for each clause:

Clause [X.X]: [Clause name]
Requirement: [Plain language — what ISO requires]
Gap analysis: [Current state vs. requirement]
Evidence needed: [Policy / procedure / record / technical control]
Owner: [Role]
Target date: [When will this be complete]
Status: [Compliant / In Progress / Gap]

Priority clauses to track (ISO 27001:2022):

A.5 — Information Security Policies:
  A.5.1: Policies for information security → Evidence: IS Policy signed by top management, annual review
  A.5.2: Information security roles and responsibilities → Evidence: RACI, org chart with security ownership

A.6 — People Controls:
  A.6.1: Screening → Evidence: Background check process, records (GDPR-compliant)
  A.6.3: Information security awareness → Evidence: Training records, completion rates

A.8 — Technological Controls:
  A.8.2: Privileged access rights → Evidence: Privileged account inventory, PAM tool screenshots
  A.8.5: Secure authentication → Evidence: MFA enforcement policy, SSO configuration
  A.8.8: Management of technical vulnerabilities → Evidence: Vulnerability scan reports, patch records
  A.8.24: Use of cryptography → Evidence: Encryption standards document, key management procedure
  A.8.29: Security testing in development → Evidence: SAST/DAST configuration, pen test reports

[Generate remaining clauses based on scope]
```

### Prompt de análisis de brechas

```
Run a compliance gap analysis.

Framework: [GDPR / SOC2 / ISO 27001 / CCPA / HIPAA]
Evidence I have confirmed in place: [list what exists]
Known gaps: [list what you know is missing]
Audit date: [when is the next audit / certification]

Produce:
1. Gap list — what is missing vs. what the framework requires
2. Effort estimate — how long to close each gap (days/weeks)
3. Priority ranking — which gaps would cause audit failure if not closed
4. Owner recommendations — which team should close each gap
5. Remediation plan — a 90-day action list ordered by priority

Format as:
| Gap | Framework | Severity | Effort | Owner | Target Close Date | Status |
|---|---|---|---|---|---|---|
| [Gap] | [Framework] | [Critical/High/Medium/Low] | [X days] | [Role] | [Date] | [Open] |
```

### Prompt de rastreador de plazos

```
Build a compliance deadline tracker.

Include all time-sensitive obligations from my applicable frameworks:

REGULATORY DEADLINES (non-negotiable):
- GDPR Art. 33: Personal data breach → supervisory authority: 72 hours from awareness
- GDPR Art. 34: Data breach → high-risk individuals: "without undue delay"
- GDPR Art. 12: DSAR response: 30 days (extensible to 90 with notice)
- UK GDPR: Same as GDPR (72-hour breach, 30-day DSAR)
- CCPA: DSAR response: 45 days (extensible to 90)
- HIPAA breach (>500 individuals): 60 days from discovery; notify HHS + media
- HIPAA breach (<500): Annual report to HHS (within 60 days of year end)

CERTIFICATION DEADLINES:
- SOC2 Type II: Annual report window — [our audit start date]: [date]
- ISO 27001: Surveillance audit: [date] | Recertification: [date]
- PCI-DSS: Annual assessment due: [date]

INTERNAL DEADLINES:
- Quarterly access reviews: [next date]
- Annual policy reviews: [next date]
- Employee security training: [completion deadline]
- Vendor risk assessments: [next batch due]

Format as a calendar view by quarter, with RAG status:
🔴 Red: <30 days away
🟡 Amber: 30-90 days away
🟢 Green: >90 days away
```

### Lista de verificación de recopilación de evidencia

```
Generate an evidence collection checklist for [FRAMEWORK] audit preparation.

For each required evidence item:
- What it is (plain language)
- Where to get it (system, tool, or process owner)
- Format auditors expect (screenshot / export / signed document / log file)
- Retention period required
- Who is responsible for collecting it

Group by control category. Flag items that require automation vs. manual collection.

Example output format:
| Evidence Item | Source | Format | Owner | Retention | Collection Method |
|---|---|---|---|---|---|
| MFA enforcement screenshot | Okta admin console | PNG, dated | IT | 12 months | Manual, monthly |
| Access review completion record | HRIS + Jira | Signed PDF | IT + HR | 12 months | Manual, quarterly |
| Vulnerability scan report | Qualys / Nessus | PDF export | Security | 12 months | Automated, monthly |
```

## Ejemplo

**Usuario:** Somos una empresa SaaS en Serie B que procesa datos personales de la UE. Aplica el GDPR y estamos trabajando hacia la certificación SOC2 Tipo II. Nuestra auditoría es en 4 meses. ¿Cuáles son nuestras 10 brechas de cumplimiento más críticas?

**Resultado esperado:**
```markdown
# Las 10 Brechas de Cumplimiento Críticas — Preparación GDPR + SOC2 Tipo II
[VERIFICAR contra las versiones actuales del marco y con su asesor jurídico]

Prioridad | Brecha | Marco | Riesgo de Auditoría | Esfuerzo | Responsable
---|---|---|---|---|---
1 | Sin Registros de Actividades de Tratamiento (RoPA) | GDPR Art.30 | Alto — los auditores lo solicitan primero | 3-5 días | DPO/Legal
2 | Sin DPA con proveedores para procesadores de terceros | GDPR Art.28 | Alto — obligación contractual | 1-2 semanas | Legal
3 | Ausencia de avisos de privacidad en los puntos de recopilación | GDPR Art.13 | Alto — visible para el auditor | 3-5 días | Legal + Marketing
4 | Sin proceso formal de revisión de acceso (trimestral) | SOC2 CC6.3 | Alto — se prueba durante todo el período | 2 semanas para establecer | IT
5 | Sin registro de gestión de cambios en sistemas de producción | SOC2 CC7.1 | Alto — requiere muestra de 12 meses | Inmediato — comenzar ahora | DevOps
6 | Plan de respuesta a incidentes no probado (sin ejercicio de mesa) | SOC2 CC7.3 / GDPR Art.33 | Medio — necesitan evidencia de pruebas | 1 día de ejercicio | DPO + IT
7 | Sin DPIA formal para procesamiento de alto riesgo (modelo ML) | GDPR Art.35 | Medio | 1-2 semanas | DPO
8 | Formación en concienciación de seguridad no documentada | SOC2 CC2.2 | Medio — se necesitan registros de finalización | 2-3 días | HR + IT
9 | Cifrado en reposo no confirmado para todos los almacenes de datos | SOC2 CC6.7 | Medio — evidencia técnica | 1-2 días de auditoría | Engineering
10 | Sin programa de gestión de vulnerabilidades (análisis + SLA de parches) | SOC2 CC7.1 | Medio — requiere evidencia periódica | 2 semanas para establecer | Security
```

---
