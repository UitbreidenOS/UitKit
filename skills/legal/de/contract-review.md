---
name: contract-review
description: "KI-Vertragsanalyse: Risikoflaggung (GREEN/YELLOW/RED), NDA-Triage, Vendorvertragsüberprüfung, Schadensersatz- und Haftungsbegrenzungsanalyse — Claude Legal Plugin Muster"
---

> 🇩🇪 Deutsche Version. [Englische Version](../contract-review.md).

# Skill zur Vertragsüberprüfung

## Wann zu aktivieren
- Überprüfung eines Vendorvertrags, SaaS-Vereinbarung oder NDA auf rote Flaggen
- Flaggung fehlender Klauseln, die in einen Vertrag gehören
- Vergleich von Vertragsbedingungen mit einem Satz akzeptabler Positionen
- Triage einer Reihe von NDAs, um zu ermitteln, welche Anwaltsaufmerksamkeit benötigen
- Verständnis der Bedeutung einer bestimmten Klausel in einfacher Sprache

## Wann NICHT zu verwenden
- Jurisdiktionsspezifische Rechtsberatung — Claude identifiziert Probleme, ein Anwalt gibt Rat
- Gerichtseinreichungen, Litigationsdokumente oder behördliche Einreichungen
- Echtzeit-Rechtsüberprüfungen — Claude unterstützt menschliche Überprüfung, ersetzt sie nicht

## WICHTIG: KI-Einschränkungen bei Verträgen

Claude kann Muster identifizieren, Probleme flaggen und Klauseln erklären. Es kann nicht: Rechtsberatung geben, jurisdiktionsspezifische Gesetze auslegen oder garantieren, dass alle Probleme erfasst wurden. Lassen Sie immer einen Anwalt hochwertige Verträge überprüfen.

## Anweisungen

### Das Überprüfungsframework (GREEN / YELLOW / RED)

```typescript
type RiskLevel = 'GREEN' | 'YELLOW' | 'RED'

interface ContractIssue {
  clause:       string        // Der spezifische Klauseltext
  section:      string        // Wo im Dokument (z.B. "Abschnitt 8.2")
  risk:         RiskLevel
  issue:        string        // Was das Problem ist
  impact:       string        // Was passieren könnte
  suggestion:   string        // Wie man es beheben kann
}

// RED  = blockierend — muss vor Unterzeichnung behoben werden
// YELLOW = verhandeln — zurückdrücken, aber kein Dealbreaker
// GREEN = akzeptabel — Standard-Marktbedingungen
```

### Überprüfung eines Vertrags mit Claude

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

### NDA-Triage

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

### Häufige rote Flaggen zum Überprüfen

```typescript
const RED_FLAG_PATTERNS = [
  {
    name: 'Unbegrenzte Schadensersatzverpflichtung',
    check: (text: string) => /indemnif.*without.*limit|unlimited.*indemnif/i.test(text),
    impact: 'Unbegrenzte finanzielle Haftung — Sie könnten weit mehr schulden als der Vertragswert',
  },
  {
    name: 'Keine Haftungsbegrenzung',
    check: (text: string) => !/(limitation|limit).*liability/i.test(text),
    impact: 'Keine Schadensersatzbegrenzung — jeder Verstoß könnte zu unbegrenzter Haftung führen',
  },
  {
    name: 'Automatische Verlängerung ohne Mitteilung',
    check: (text: string) => /auto.*renew.*without.*notice|renew.*unless.*cancel/i.test(text),
    impact: 'Könnte für einen weiteren Zeitraum gesperrt werden, ohne es zu bemerken',
  },
  {
    name: 'IP-Eigentumsrecht über Ihre Eingaben',
    check: (text: string) => /intellectual property.*all.*work|assign.*all.*ip/i.test(text),
    impact: 'Sie können das Eigentum an erstellten Materialien verlieren',
  },
  {
    name: 'Einseitige Änderung',
    check: (text: string) => /reserves.*right.*modify|may.*change.*terms.*without.*notice/i.test(text),
    impact: 'Der Anbieter kann Bedingungen ohne Ihre Zustimmung ändern',
  },
  {
    name: 'Anwendbares Recht in ungünstiger Gerichtsbarkeit',
    check: (text: string, ourJurisdiction: string) => {
      const match = text.match(/governed by.*law.*of ([\w\s]+)/i)
      return match ? !match[1].includes(ourJurisdiction) : false
    },
    impact: 'Streitigkeiten müssen unter fremdem Recht beigelegt werden — teuer und unbequem',
  },
]
```

### Batch-Vertragsverarbeitung

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

  // Nach Risiko sortieren — Anwalt überprüft zuerst höchstes Risiko
  return {
    results: results.sort((a, b) => a.risk === 'HIGH' ? -1 : 1),
    highRiskCount: results.filter(r => r.risk === 'HIGH').length,
  }
}
```

### Klausel-Erklärung (einfache Sprache)

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

## Beispiel

**Benutzer:** Überprüfen Sie eine SaaS-Vereinbarung mit einem Anbieter (PDF/Text), flaggen Sie alle RED-Probleme, die wir beheben müssen, YELLOW-Probleme zum Verhandeln und fassen Sie zusammen, was fehlt — Ausgabe als strukturierter Bericht.

**Erwartete Ausgabe:**
```
VERTRAG ÜBERPRÜFUNGSBERICHT
Gesamtrisiko: HOCH

🔴 RED (3 Probleme — müssen vor Unterzeichnung behoben werden)
  Abschnitt 12.1 — Unbegrenzte Schadensersatzverpflichtung
  Klausel: "Der Kunde entschädigt den Anbieter für alle Ansprüche, Verluste und Kosten..."
  Problem: Keine Obergrenze für Schadensersatz — unbegrenzte finanzielle Haftung
  Behebung: Hinzufügen von "nicht zu überschreiten die Gebühren, die in den 12 Monaten vor dem Anspruch gezahlt wurden"

🟡 YELLOW (2 Probleme — verhandeln)
  Abschnitt 8.3 — Automatische Verlängerung mit 60-Tage-Kündigungsfrist
  ...

🟢 GREEN (8 Klauseln — akzeptable Standard-Bedingungen)

FEHLENDE KLAUSELN:
  - Keine Datenverarbeitungsvereinbarung (erforderlich unter DSGVO)
  - Keine SLA für Verfügbarkeitszusagen
  - Keine Datenlöschungsklausel bei Kündigung

EMPFEHLUNG: Nicht unterzeichnen, bis RED-Probleme gelöst sind. Mit Änderungsversprechungen zurückgeben.
```

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
