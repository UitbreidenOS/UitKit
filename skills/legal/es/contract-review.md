---
name: contract-review
description: "Revisión de contratos con IA: señalización de riesgos (GREEN/YELLOW/RED), selección de NDA, verificación de contratos con proveedores, análisis de indemnización y limitación de responsabilidad — patrones del complemento Claude Legal"
---

> 🇪🇸 Versión en español. [Versión en inglés](../contract-review.md).

# Habilidad de Revisión de Contratos

## Cuándo activar
- Revisión de un contrato de proveedor, acuerdo SaaS o NDA en busca de banderas rojas
- Señalizar cláusulas faltantes que deberían estar en un contrato
- Comparar términos del contrato contra un conjunto de posiciones aceptables
- Seleccionar un lote de NDA para identificar cuáles necesitan atención legal
- Entender qué significa una cláusula específica en lenguaje simple

## Cuándo NO usar
- Asesoramiento legal específico de jurisdicción — Claude identifica problemas, un abogado aconseja
- Presentaciones judiciales, documentos de litigio o presentaciones regulatorias
- Decisiones legales en tiempo real — Claude asiste a revisión humana, no la reemplaza

## IMPORTANTE: Limitaciones de IA en contratos

Claude puede identificar patrones, señalar problemas y explicar cláusulas. No puede: dar asesoramiento legal, interpretar leyes específicas de jurisdicción o garantizar que ha detectado todos los problemas. Siempre haga que un abogado revise contratos de alto valor.

## Instrucciones

### El marco de revisión (GREEN / YELLOW / RED)

```typescript
type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

interface ContractIssue {
  clause:       string        // El texto de cláusula específica
  section:      string        // Dónde en el documento (p.ej. "Sección 8.2")
  risk:         RiskLevel
  issue:        string        // Cuál es el problema
  impact:       string        // Qué podría suceder
  suggestion:   string        // Cómo solucionarlo
}

// RED  = bloqueante — debe solucionarse antes de firmar
// YELLOW = negociar — rechazar pero no es un factor decisivo
// GREEN = aceptable — términos estándar del mercado
```

### Revisión de un contrato con Claude

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import fs from 'fs'

const IssueSchema = z.object({
  section:    z.string(),
  clause:     z.string(),
  risk:       z.enum(['RED', 'YELLOW', 'GREEN']),
  issue:      z.string(),
  impact:     z.string(),
  suggestion: z.string(),
})

const ReviewSchema = z.object({
  summary:          z.string(),
  overallRisk:      z.enum(['HIGH', 'MEDIUM', 'LOW']),
  issues:           z.array(IssueSchema),
  missingClauses:   z.array(z.string()),
  recommendation:   z.string(),
})

async function reviewContract(contractPath: string, context: ReviewContext) {
  const contractText = fs.readFileSync(contractPath, 'utf-8')

  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: ReviewSchema,
    system: `You are a contract review assistant. Your job is to identify risks, flag problematic clauses, and note missing protections. Be specific and cite exact clause language. Focus on practical business impact, not legal technicalities.`,
    prompt: `Review this ${context.contractType} contract from a ${context.ourRole} perspective.

Our key concerns: ${context.concerns.join(', ')}
Our position: ${context.companySize}, ${context.industry}

CONTRACT:
${contractText}

Flag all issues with GREEN/YELLOW/RED risk ratings. RED = blocking/unacceptable, YELLOW = negotiate, GREEN = acceptable.`,
  })

  return object
}
```

### Selección de NDA

```typescript
async function triageNDA(ndaText: string): Promise<NDATriage> {
  const { object } = await generateObject({
    model: anthropic('claude-opus-4-7'),
    schema: z.object({
      ndaType:            z.enum(['mutual', 'one_way_us', 'one_way_them']),
      term:               z.string(),          // "2 years", "indefinite"
      scopeIssues:        z.array(z.string()), // overly broad definitions
      exclusions:         z.array(z.string()), // what's excluded from confidentiality
      redFlags:           z.array(z.string()),
      requiresLawyerReview: z.boolean(),
      summary:            z.string(),
    }),
    prompt: `Triage this NDA. Identify: type (mutual/one-way), term, any overly broad scope definitions, missing standard exclusions (public info, prior knowledge, independent development), and any unusual restrictions on disclosure.

NDA TEXT:
${ndaText}`,
  })

  return object
}
```

### Banderas rojas comunes a verificar

```typescript
const RED_FLAG_PATTERNS = [
  {
    name: 'Indemnización sin límite',
    check: (text: string) => /indemnif.*without.*limit|unlimited.*indemnif/i.test(text),
    impact: 'Exposición financiera ilimitada — podría deber mucho más que el valor del contrato',
  },
  {
    name: 'Sin limitación de responsabilidad',
    check: (text: string) => !/(limitation|limit).*liability/i.test(text),
    impact: 'Sin tope en daños — cualquier incumplimiento podría resultar en responsabilidad ilimitada',
  },
  {
    name: 'Renovación automática sin aviso',
    check: (text: string) => /auto.*renew.*without.*notice|renew.*unless.*cancel/i.test(text),
    impact: 'Podría estar bloqueado por otro término sin darse cuenta',
  },
  {
    name: 'Propiedad intelectual sobre sus datos',
    check: (text: string) => /intellectual property.*all.*work|assign.*all.*ip/i.test(text),
    impact: 'Podría perder la propiedad de materiales que crea',
  },
  {
    name: 'Modificación unilateral',
    check: (text: string) => /reserves.*right.*modify|may.*change.*terms.*without.*notice/i.test(text),
    impact: 'El proveedor puede cambiar términos sin su consentimiento',
  },
  {
    name: 'Ley aplicable en jurisdicción desfavorable',
    check: (text: string, ourJurisdiction: string) => {
      const match = text.match(/governed by.*law.*of ([\w\s]+)/i)
      return match ? !match[1].includes(ourJurisdiction) : false
    },
    impact: 'Las disputas deben resolverse bajo ley extranjera — caro e inconveniente',
  },
]
```

### Procesamiento de lotes de contratos

```typescript
async function processContractBatch(contracts: ContractFile[]): Promise<BatchReport> {
  const results = []

  for (const contract of contracts) {
    console.log(`Reviewing: ${contract.name}`)

    const review = await reviewContract(contract.path, {
      contractType: contract.type,
      ourRole: 'customer',
      concerns: ['IP ownership', 'data protection', 'liability', 'termination'],
      companySize: 'startup',
      industry: 'SaaS',
    })

    results.push({
      contract: contract.name,
      risk:     review.overallRisk,
      redCount: review.issues.filter(i => i.risk === 'RED').length,
      summary:  review.summary,
      requiresLawyer: review.overallRisk === 'HIGH',
    })
  }

  // Ordenar por riesgo — abogado revisa riesgo más alto primero
  return {
    results: results.sort((a, b) => a.risk === 'HIGH' ? -1 : 1),
    highRiskCount: results.filter(r => r.risk === 'HIGH').length,
  }
}
```

### Explicación de cláusula (lenguaje simple)

```typescript
async function explainClause(clauseText: string): Promise<string> {
  const { text } = await generateText({
    model: anthropic('claude-opus-4-7'),
    prompt: `Explain this contract clause in plain language. What does it mean for a non-lawyer? What are the practical implications?

CLAUSE: "${clauseText}"

Explain in 2-3 sentences as if speaking to a business owner, not a lawyer.`,
  })
  return text
}
```

## Ejemplo

**Usuario:** Revise un acuerdo SaaS con proveedor (PDF/texto), señale todos los problemas RED que debemos solucionar, problemas YELLOW a negociar, y resuma lo que falta — salida como informe estructurado.

**Salida esperada:**
```
INFORME DE REVISIÓN DE CONTRATO
Riesgo general: ALTO

🔴 RED (3 problemas — deben solucionarse antes de firmar)
  Sección 12.1 — Indemnización sin límite
  Cláusula: "El cliente indemnizará al proveedor por todos los reclamos, pérdidas y gastos..."
  Problema: Sin tope en indemnización — exposición financiera ilimitada
  Solución: Agregue "no a exceder las tarifas pagadas en los 12 meses anteriores al reclamo"

🟡 YELLOW (2 problemas — negociar)
  Sección 8.3 — Renovación automática con requerimiento de aviso de 60 días
  ...

🟢 GREEN (8 cláusulas — términos estándar aceptables)

CLÁUSULAS FALTANTES:
  - Sin acuerdo de procesamiento de datos (requerido bajo GDPR)
  - Sin SLA para garantías de tiempo de actividad
  - Sin cláusula de eliminación de datos al término

RECOMENDACIÓN: No firme hasta resolver problemas RED. Devuelva con cambios solicitados.
```

---

> **Trabaje con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
