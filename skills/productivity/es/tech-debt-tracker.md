---
name: tech-debt-tracker
description: "Technical debt management: catalogue, categorise, and prioritise tech debt — build a debt register, quantify impact, present to leadership, and create a paydown strategy"
---

# Habilidad de Rastreador de Deuda Técnica

## Cuándo activar
- Crear un registro de deuda técnica por primera vez
- Priorizar qué deuda pagar primero
- Hacer el caso para invertir en deuda técnica ante el liderazgo
- Categorizar deuda descubierta durante un sprint o revisión de código
- Planificar un sprint de refactorización o un trimestre de pago de deuda
- Documentar el "por qué" detrás de las decisiones técnicas para que futuros ingenieros comprendan

## Cuándo NO usar
- Corrección activa de errores — esa es la habilidad de depuración
- Perfilado de rendimiento — use la habilidad de profile-profiler
- Vulnerabilidades de seguridad inmediatas — corríjalas ahora, no las agregue al registro
- Decisiones de diseño de arquitectura — use un ADR (Architecture Decision Record) en su lugar

## Instrucciones

### Registro de deuda técnica

```
Create a tech debt register for [codebase/system].

System: [describe]
Team: [X engineers]
Current pain points: [list what's slowing the team down]
Sources of debt: [past deadline pressure / changing requirements / outdated tech / missing tests]

Debt register format:

| ID | Name | Category | Location | Impact | Effort | Priority | Notes |
|---|---|---|---|---|---|---|---|
| TD-001 | [name] | [type] | [file/service] | [H/M/L] | [S/M/L/XL] | [score] | [context] |

Debt categories:
- CODE: duplication, complexity, bad naming, anti-patterns
- ARCHITECTURE: wrong abstractions, coupling, missing separation of concerns
- TEST: missing tests, brittle tests, test coverage gaps
- DEPENDENCY: outdated packages, deprecated libraries, security-vulnerable deps
- DOCUMENTATION: missing, outdated, or misleading docs
- DATA: schema inconsistency, missing indexes, migration backlog
- INFRASTRUCTURE: manual processes that should be automated, legacy config
- SECURITY: known vulnerabilities, insufficient access controls

For each debt item:
Name: [short, descriptive — "Authentication module uses MD5 hashing"]
Category: [from list above]
Location: [file path / service name / database table]
Description: [what the problem is — 1-3 sentences]
Root cause: [why this debt exists — deadline / changing requirements / originally reasonable decision]
Impact: [what it costs the team — slower development / higher bug rate / security risk / etc.]
Effort to fix: S (< 1 day) / M (1-3 days) / L (1-2 weeks) / XL (> 2 weeks)
Risk if not fixed: [what happens if we leave this — scale it, maintain it, never fix it]

Generate the debt register template and populate with items from my codebase description.
```

### Priorización de deuda

```
Prioritise our tech debt backlog.

Debt items: [paste register or list]
Team velocity: [X story points / sprint]
Current business pressure: [shipping features / reliability focus / growth / stability]

Prioritisation framework:

Score each item on 3 axes (1-10 each):

1. PAIN (how much it slows the team right now):
   10 = blocks daily work, causes regular bugs
   5 = noticed weekly, slows specific workflows
   1 = theoretical problem, not practically felt yet

2. RISK (what happens if we leave it):
   10 = security vulnerability or will cause outage
   5 = will become worse at scale, increasing future cost
   1 = cosmetic, manageable indefinitely

3. LEVERAGE (how much fixing it helps):
   10 = enables future features, reduces maintenance by 50%+
   5 = localised improvement, contained benefit
   1 = cosmetic or negligible improvement

Priority score = (Pain + Risk + Leverage) / 3

Effort multiplier:
S: score × 1.5 (quick win — high priority)
M: score × 1.0 (standard)
L: score × 0.7 (higher bar to justify)
XL: score × 0.4 (needs strong justification)

Quadrant view:
High pain + low effort = DO FIRST (quick wins)
High pain + high effort = PLAN (invest time, high ROI)
Low pain + low effort = BATCH (do in spare cycles)
Low pain + high effort = DEFER (unless risk is high)

Produce: prioritised debt backlog with top 5 items to address this quarter.
```

### Presentación de liderazgo

```
Write a leadership presentation for [debt investment request].

Audience: [CTO / VP Engineering / CEO / Board]
Ask: [X engineer-weeks to address Y debt items]
Business context: [what business goal is debt blocking or slowing]
Current cost of debt: [describe in business terms — not just "code is messy"]

Framing for leadership:

WRONG framing: "We need to refactor the authentication module because the code is messy."
RIGHT framing: "Authentication bugs account for 23% of our P1 incidents this year. Fixing the root cause will reduce incident response time by 40% and let us ship the SSO feature 3 weeks earlier."

One-page structure:

SITUATION:
"Our [system/codebase] has accumulated [X years of] technical debt that is now measurably slowing our delivery velocity and increasing our incident rate."

IMPACT (quantify):
- Development velocity: "Features that take 2 days in a greenfield system take 5 days in our codebase due to [specific debt]."
- Incident rate: "X% of our incidents trace back to [specific module/pattern]."
- Engineer retention: "Our last exit interview cited codebase complexity as a reason for leaving." (if applicable)
- Customer impact: "[X] bugs this quarter were caused by [specific debt item]."

PROPOSED INVESTMENT:
"We propose allocating [X] engineer-weeks over [Y] months to address the highest-impact debt items."
[Table: debt item / engineer-weeks / expected outcome]

EXPECTED RETURN:
- [X%] reduction in bug rate in affected areas
- [X] weeks faster delivery on [upcoming feature]
- Enables [initiative] that was previously blocked

WHAT WE'RE NOT ASKING FOR:
"We are not asking to rewrite everything. This is a targeted, scoped paydown of the debt causing the most measurable pain."

Write the leadership brief for my specific ask.
```

### Sprint de pago de deuda

```
Plan a tech debt paydown sprint for [team].

Team: [X engineers]
Sprint length: [2 weeks]
Debt items to tackle: [list from prioritised register]
Constraint: [some feature work must continue / full debt sprint / mixed]

Sprint planning for debt:

Allocation (recommended):
- 70% debt / 30% features: full debt focus sprint
- 50/50: balanced sprint
- 20% debt / 80% features: ongoing hygiene (sustainable velocity approach)

Note: the best approach is rarely a big-bang "debt sprint." Sustainable: reserve 20% of every sprint permanently for debt. This prevents accumulation faster than periodic sprints.

For each debt item selected:
Task: [specific change]
Owner: [engineer]
Definition of done: [how do we know it's fixed?]
Test coverage required: [yes — debt fixes without tests create new debt]
Review requirement: [which engineer reviews this change?]

Risk management:
- All debt changes in feature branches
- No debt work in the same PR as feature work (keeps history clean)
- Run full test suite before merging any debt change
- Have a rollback plan for database or infrastructure changes

Retrospective question for after the sprint:
"Did we actually feel faster in the following sprint? Which debt items had the most noticeable impact?"

Sprint plan for my team and selected debt items.
```

## Ejemplo

**Usuario:** Nuestro monolito Node.js tiene 4 años de deuda. Los ingenieros se quejan constantemente pero nunca lo hemos abordado sistemáticamente. ¿Por dónde empiezo?

**Plan de 30 días de Claude:**

No comience con el código. Comience con la catalogación.

**Semana 1 — Construir el registro:**
Ejecute una "encuesta de deuda" — pida a cada ingeniero que pase 20 minutos escribiendo las 3 cosas que más los ralentizan. Utilice un formulario simple de Google:
- ¿Cuál es el problema?
- ¿Dónde está? (archivo/módulo)
- ¿Con qué frecuencia lo encuentra?
- ¿Tiempo aproximado de reparación?

Agregue respuestas → obtendrá 15-30 elementos. Muchos se agruparán alrededor de 3-5 causas raíz.

**Semana 2 — Categorizar y puntuar:**
Tome los elementos agrupados y puntúe cada uno:
- Dolor: ¿con qué frecuencia los ingenieros lo encuentran?
- Riesgo: ¿cuál es el peor caso si lo ignoramos?
- Apalancamiento: ¿arreglar esto desbloquea otras cosas?

Probablemente encontrará: 2-3 elementos puntúan > 8 en las tres dimensiones. Esos son sus P1s.

**Patrones P1 comunes en monolitos Node.js de 4 años:**
- Código asincrónico callback-hell (debería ser async/await) → causa errores, confunde nuevos ingenieros
- Sin seguridad de tipos (JS simple → se requiere migración de TypeScript) → errores ocultos en producción
- Sin pruebas de integración → cada implementación se siente arriesgada
- Dependencias circulares entre módulos → no se puede extraer o escalar un servicio
- Un único archivo de 3.000 líneas que todos tocan → conflictos de fusión en cada sprint

**Mes 2 en adelante — pago sostenible:**
Agregue un ticket de deuda a cada sprint por valor de aproximadamente el 20% de la capacidad. No haga grandes sprints de deuda — son desmoralizadores y rara vez se completan. La reducción de deuda en estado estacionario se compone: 20% de capacidad de deuda durante 6 meses = 60% de un sprint de deuda pura, pero distribuido en 6 meses de trabajo sostenible.

Informe al liderazgo mensualmente: "Hemos cerrado X elementos de deuda, aquí está el resultado medible."

---
