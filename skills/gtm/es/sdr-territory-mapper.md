---
name: sdr-territory-mapper
description: "Análisis de territorio SDR: mapea la cobertura de cuentas, identifica espacios en blanco, prioriza por densidad de ICP y concentración de señales de desencadenantes, construye planes de territorio e informes de cobertura"
---

# Habilidad de Mapeo de Territorio para SDR

## Cuándo activar
- Planificando una nueva asignación de territorio para un SDR o AE
- Auditando tu territorio actual en busca de espacios en blanco y cuentas no tocadas
- Planificación trimestral de territorio y alineación de headcount
- Identificando qué segmentos o geografías tienen mayor densidad de ICP
- Presentando un plan de territorio a tu gerente o en un QBR
- Re-equilibrando territorios después de cambios en el equipo o un pivote de mercado

## Cuándo NO usar
- Investigación individual de cuentas — usa `/sdr-research-brief` para eso
- Pronóstico completo de RevOps — usa `/revenue-operations` para métricas de pipeline
- Segmentación de clientes para CS — función y señales diferentes
- TAM/SAM/SOM para decks de inversores — usa `/pitch-deck` para eso

## Instrucciones

### Verificación de salud del territorio

```
Ejecuta una verificación de salud del territorio para [TERRITORIO — p.ej. "Mid-Market EMEA, 200-1000 empleados, verticales SaaS"].

Mi producto: [lo que vendes]
Mi ICP: [tamaño de empresa, industria, tech stack, rol objetivo]
Datos de territorio disponibles: [exportación de CRM / lista de Apollo / exportación de LinkedIn Sales Navigator / lista manual]

[PEGAR LISTA DE CUENTAS O DATOS]

Analiza:

## 1. Resumen de cobertura
- Total de cuentas en el territorio: [N]
- Cuentas contactadas al menos una vez: [N] ([%])
- Cuentas nunca contactadas: [N] — estos son el espacio en blanco
- Cuentas en secuencia activa: [N]
- Cuentas con oportunidades abiertas: [N]
- Cuentas cerradas-ganadas: [N]
- Cuentas cerradas-perdidas: [N] → ¿elegibles para re-engagement en [X meses]?

## 2. Densidad de ICP por segmento
Desglose de cuentas por:
- Bucket de tamaño de empresa (50-200 / 200-500 / 500-1000 / 1000+)
- Vertical de industria
- Geografía (país/región)
Identifica: qué segmento tiene mayor densidad de ICP Y menor cobertura = espacio en blanco prioritario

## 3. Concentración de señales de desencadenantes
¿Qué segmento tiene más cuentas con desencadenantes activos ahora mismo?
(Financiación, contrataciones ejecutivas, lanzamientos de productos, picos de contratación)
Estos son tus objetivos de mayor probabilidad este mes.

## 4. Lista de cuentas prioritarias
Las 25 cuentas principales en las que enfocarse este trimestre:
Ordenadas por: puntuación ICP × recencia del desencadenante × accesibilidad del contacto
| Rango | Cuenta | Puntuación ICP | Desencadenante | Último contacto | Prioridad |
|---|---|---|---|---|---|

## 5. Brechas del territorio
- Segmentos en los que estás subrepresentado
- Industrias sin cobertura
- Geografías con cuentas pero sin contacto
- Roles que no has dirigido (solo enviando emails a VP Ventas pero no al CTO)

## 6. Cadencia semanal recomendada
Basada en el tamaño del territorio y los objetivos de pipeline:
- Cuentas a investigar por día: [N]
- Nuevo contacto a iniciar por semana: [N]
- Seguimientos por día: [N]
- Objetivo de llamadas por día: [N]
```

### Prompt de mapeo de densidad de ICP

```
Mapea la densidad de ICP en mi mercado objetivo.

Definición de ICP:
- Industria: [lista]
- Tamaño de empresa: [X-Y empleados]
- Geografía: [región/país]
- Señales de tech stack: [herramientas que indican ajuste]
- Roles a targetear: [títulos]

Fuente de datos: [exportación de Apollo / LinkedIn Sales Nav / CRM / manual]

[PEGAR DATOS]

Resultado:
1. Mapa de calor por segmento — ¿dónde es mayor la densidad de ICP?
2. Segmentos desatendidos — alta densidad de ICP, baja cobertura existente
3. Segmentos saturados — alta competencia, rendimientos decrecientes
4. Recomendado: dónde asignar el 80% del esfuerzo de contacto este trimestre
```

### Prompt de identificación de espacios en blanco

```
Identifica espacios en blanco en mi territorio.

[PEGAR EXPORTACIÓN DE CRM O LISTA DE CUENTAS]
[PEGAR CUENTAS YA CONTACTADAS EN LOS ÚLTIMOS 6 MESES]

Espacio en blanco = cuentas que:
1. Cumplen los criterios de ICP
2. NO han sido contactadas en los últimos 6 meses
3. Tienen al menos una señal de desencadenante activa (financiación, contratación, contratación ejecutiva)

Resultado:
- Total de cuentas de espacio en blanco: [N]
- Las 20 principales cuentas de espacio en blanco ordenadas por puntuación ICP + recencia del desencadenante
- Cómo abordar: frío, cálido (conexión mutua) o investigación primero
```

### Documento del plan de territorio (para revisión del gerente)

```
Escribe un plan de territorio trimestral para Q[X] [AÑO].

Territorio: [definición]
SDR/AE: [nombre]
Cuota: [$ u objetivo de reuniones]
Desempeño del trimestre anterior: [% de cumplimiento]

Genera:

## Descripción general del territorio
[1 párrafo — qué es el territorio y por qué es un buen mercado]

## Análisis de ICP
[Qué empresas del territorio tienen mejor ajuste y por qué]

## Principales cuentas (Prioridad 1)
[Las 10 principales cuentas — por qué cada una es prioritaria, señal de desencadenante, estrategia de contacto]

## Plan de cobertura
[Desglose semanal de actividades — investigación, nuevo contacto, seguimientos, llamadas]

## Proyección de pipeline
[Reuniones esperadas agendadas, conversión a pipeline, contribución de ingresos proyectada]

## Necesidades de recursos
[Qué soporte se necesita — campañas de marketing, contenido, presentaciones, herramientas]

## Riesgos y mitigaciones
[Qué podría salir mal y el plan de contingencia]
```

### Modelo de puntuación de cuentas para priorización de territorio

```typescript
interface TerritoryAccount {
  company: string
  employees: number
  industry: string
  techStack: string[]
  lastContactedDaysAgo: number | null
  triggerSignals: TriggerSignal[]
  linkedInConnections: number // 2nd-degree connections
  crmStatus: 'never_contacted' | 'in_sequence' | 'opportunity' | 'closed_lost' | 'closed_won'
}

function scoreTerritoryAccount(account: TerritoryAccount, icp: ICPCriteria): number {
  let score = 0

  // ICP fit (50 points)
  score += scoreCompanySize(account.employees, icp.sizeRange) * 0.2    // max 20
  score += scoreIndustry(account.industry, icp.industries) * 0.15       // max 15
  score += scoreTechStack(account.techStack, icp.techStack) * 0.15     // max 15

  // Timing (30 points)
  const recentTriggers = account.triggerSignals.filter(t => t.recencyDays <= 90)
  score += Math.min(30, recentTriggers.length * 10)

  // Accessibility (10 points)
  score += Math.min(10, account.linkedInConnections * 2)

  // Contact recency penalty (10 points)
  if (account.lastContactedDaysAgo === null) {
    score += 10 // Never contacted — fresh territory = bonus
  } else if (account.lastContactedDaysAgo > 180) {
    score += 7  // Eligible for re-engagement
  } else if (account.lastContactedDaysAgo > 90) {
    score += 3
  } else {
    score -= 10 // Recently contacted — reduce priority
  }

  // CRM status adjustment
  if (account.crmStatus === 'closed_lost') score += 5  // Can re-engage
  if (account.crmStatus === 'closed_won') score -= 50  // Never cold outreach existing customers

  return Math.max(0, Math.min(100, score))
}

function buildTerritoryPriorityList(
  accounts: TerritoryAccount[],
  icp: ICPCriteria,
  topN: number = 25
): TerritoryAccount[] {
  return accounts
    .map(account => ({ account, score: scoreTerritoryAccount(account, icp) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ account }) => account)
}
```

### Identificación de re-engagement

```
Identifica cuentas cerradas-perdidas elegibles para re-engagement.

[PEGAR EXPORTACIÓN DE CRM O LISTA DE CERRADOS-PERDIDOS]

Criterios de re-engagement:
- Perdieron el trato hace más de [90/180] días
- La razón de pérdida NO es: "nunca fue un ajuste" / "empresa incorrecta" / "optó por no contactar"
- La empresa tiene una nueva señal de desencadenante desde que se cerró el trato
- O: un nuevo tomador de decisiones se unió desde que se cerró el trato

Resultado:
- Cuentas elegibles: [N]
- Los 10 principales objetivos de re-engagement ordenados por: fortaleza del nuevo desencadenante + tiempo desde la pérdida
- Enfoque sugerido: [reinicio en frío / email cálido referenciando historial / solo contacto nuevo]
- Sugerencia de línea de asunto para el email de re-engagement
```

## Ejemplo

**Usuario:** Planificación de territorio Q3. Tengo Mid-Market EMEA en SaaS, 200-1000 empleados. Mi exportación de CRM muestra 847 cuentas, solo 312 han sido contactadas en los últimos 6 meses. Ayúdame a priorizar.

**Resultado:**

**Resumen de cobertura:**
- 847 cuentas totales | 312 contactadas (37%) | **535 cuentas de espacio en blanco** (63%)
- Secuencias activas: 89 cuentas
- Oportunidades abiertas: 23 cuentas
- Cerradas-perdidas elegibles para re-engagement: 67 cuentas (perdidas hace 90+ días con nuevos desencadenantes)

**Desglose de prioridades:**
- Prioridad 1 (puntuación ICP 80+, desencadenante reciente): 48 cuentas → 100% del contacto Semanas 1-2
- Prioridad 2 (puntuación ICP 60-79, sin desencadenante): 127 cuentas → contacto Semanas 3-6
- Prioridad 3 (puntuación ICP 40-59): 360 cuentas → solo secuencia de bajo contacto
- Despriorizar (puntuación <40): 312 cuentas → excluir este trimestre

**Zona caliente de espacio en blanco:** FinTech con sede en UK (100-500 empleados) — 34 cuentas sin contactar con alta densidad de ICP, 12 con desencadenantes de financiación en los últimos 60 días. Este es tu objetivo sprint de Q3.

**Plan semanal:**
- Lun-Mar: 8 nuevas cuentas investigadas + secuencia iniciada
- Mié-Jue: 15 seguimientos + 20 llamadas
- Vie: Revisión de pipeline + preparación de la próxima semana
- Objetivo: 12 nuevas reuniones agendadas / mes → 36 reuniones / trimestre

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
