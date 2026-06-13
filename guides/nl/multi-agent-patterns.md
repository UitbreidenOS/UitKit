# Multi-agentpatronen Gids

Ontwerppatronen voor het bouwen van betrouwbare multi-agentsystemen met Claude Code.

## Wanneer multi-agentpatronen gebruiken

Gebruik meerdere agenten wanneer:
- Een taak echte onafhankelijke subtaken heeft die parallel kunnen lopen
- Verschillende subtaken verschillende expertise of context vereisen
- De taak te groot is om in één contextvenster te passen
- U redundante controles nodig hebt (meerdere agenten herzien dezelfde output)
- Verschillende delen van de taak verschillende tool-toegangsniveaus vereisen

Gebruik niet meerdere agenten wanneer:
- Eén agent de taak kan verwerken — orchestratie-overhead is niet gratis
- Subtaken hebben complexe afhankelijkheden (beter: sequentiële prompting)
- De taak continue gedeelde toestand vereist (agenten kunnen geheugen niet gemakkelijk delen)

## Patroon 1: Parallelle workers

**Wanneer:** Meerdere onafhankelijke taken van hetzelfde type.

```typescript
// Claude Code — genereer agenten parallel voor onafhankelijke taken
// Voorbeeld: vertaal een vaardigheidsbestand gelijktijdig naar 4 talen

const translationTasks = ['fr', 'de', 'nl', 'es'].map(lang =>
  Agent({
    description: `Vertaal naar ${lang}`,
    model: 'haiku',  // kleiner model voor vertaling gebruiken
    prompt: `Vertaal dit vaardigheidsbestand naar ${lang}: [inhoud]`
  })
)

// Alle 4 lopen parallel — 4x sneller dan sequentieel
const [fr, de, nl, es] = await Promise.all(translationTasks)
```

**Regels:**
- Elke agent moet volledig zelfstandig zijn (alle context in prompt)
- Geen agent mag afhankelijk zijn van een ander's output
- Gebruik goedkopere modellen voor eenvoudigere taken

## Patroon 2: Pijplijn (sequentiële overdracht)

**Wanneer:** Elke fase's output is de volgende fase's input.

```
Onderzoeksagent → Analysisagent → Schrijfagent → Beoordelingsagent
```

```typescript
// Fase 1: onderzoek
const research = await Agent({
  prompt: 'Onderzoek het concurrentielandschap voor [onderwerp]. Output gestructureerde bevindingen.'
})

// Fase 2: analyse (gebruikt fase 1's output)
const analysis = await Agent({
  prompt: `Analyseer deze onderzoeksbevindingen en identificeer belangrijke strategische inzichten:
  ${research.output}`
})

// Fase 3: schrijf (gebruikt fase 2's output)
const draft = await Agent({
  prompt: `Schrijf een strategisch memorandum op basis van deze analyse:
  ${analysis.output}`
})

// Fase 4: beoordeel (onafhankelijke controle)
const reviewed = await Agent({
  prompt: `Controleer dit memorandum op nauwkeurigheid, duidelijkheid en strategische hiaten:
  ${draft.output}`
})
```

**Regels:**
- Elke fase valideert vorige fase's output voor voortgang
- Expliciet pass/fail criteria op elk handoff opnemen
- Definieer wat te doen als fase faalt (opnieuw, overslaan, waarschuwing)

## Patroon 3: Specialist + Generalist

**Wanneer:** Algemene taak maar specifieke delen vereisen diepe expertise.

```
Generalist Agent (coördineert)
├── Veiligheidsspecialist Agent (auth-code)
├── Prestaties Specialist Agent (database queries)
└── UX Specialist Agent (gebruikerstekst)
```

```typescript
const [securityReview, perfReview, uxReview] = await Promise.all([
  Agent({
    description: 'Veiligheidscontrole',
    prompt: `Controleer deze code op veiligheidslekken. Focus: auth, injection, datalek.
    Code: ${authCode}`
  }),
  Agent({
    description: 'Prestatie review', 
    prompt: `Controleer deze database queries op prestatieproblemen. Focus: N+1, ontbrekende indexen.
    Code: ${dbCode}`
  }),
  Agent({
    description: 'UX-review',
    prompt: `Controleer deze kopij op duidelijkheid en conversie. Focus: CTA-tekst, foutmeldingen.
    Kopij: ${uiCopy}`
  })
])

// Bevindingen samensynthetiseren
const synthesis = await Agent({
  prompt: `Combineer deze specialist reviews in een geprioriteerde actielijst:
  Veiligheid: ${securityReview}
  Prestatie: ${perfReview}
  UX: ${uxReview}`
})
```

## Patroon 4: Redundante verificatie

**Wanneer:** Juistheid is kritiek en fouten zijn duur.

```typescript
// Dezelfde taak, twee onafhankelijke agenten, vergelijk outputs
const [agent1Result, agent2Result] = await Promise.all([
  Agent({ prompt: reviewPrompt }),
  Agent({ prompt: reviewPrompt })
])

// Vergelijk overeenstemming
if (agent1Result.verdict !== agent2Result.verdict) {
  // Onenigheid — escaleer naar mens of gebruik derde agent als scheidsrechter
  const tiebreaker = await Agent({
    prompt: `Twee beoordelaars waren het oneens. Breng samen:
    Beoordelaar 1: ${agent1Result}
    Beoordelaar 2: ${agent2Result}
    Geef de juiste conclusie.`
  })
}
```

**Wanneer gebruiken:** Veiligheidscontroles, juridische risicobeoordelingen, financiële berekeningen, medische informatie.

## Patroon 5: Map-Reduce

**Wanneer:** Grote dataset parallel verwerken, vervolgens aggregeren.

```typescript
// Map: verwerk elk segment onafhankelijk
const chunks = splitIntoChunks(largeDocument, chunkSize)
const chunkResults = await Promise.all(
  chunks.map(chunk => Agent({
    model: 'haiku',
    prompt: `Extraheer sleutelentiteiten en claims uit deze sectie: ${chunk}`
  }))
)

// Reduce: aggregeer alle chunk-resultaten
const finalSummary = await Agent({
  model: 'sonnet',
  prompt: `Synthetiseer deze sectie-analyses in een uniforme samenvatting:
  ${chunkResults.join('\n\n')}`
})
```

## Best practices agent-communicatie

**Ontwerp voor staatloosheid:**
- Elke agent ontvangt alle context nodig in de prompt
- Agenten delen geen geheugen of toestand tussen aanroepen
- Output is het enige communicatiekanaal tussen agenten

**Expliciete outputcontracten:**
```typescript
// Zeg agenten precies welk format uit te voeren
prompt: `
Analyseer deze code op bugs.

Output SLECHTS geldig JSON in dit exacte formaat:
{
  "bugs": [{"severity": "high|medium|low", "description": "string", "line": number}],
  "summary": "string"
}
`

// Valideer vervolgens de output
const result = outputSchema.parse(JSON.parse(agentOutput))
```

**Foutafhandeling:**
```typescript
try {
  const result = await Agent({ prompt })
  return parseOutput(result)
} catch (error) {
  // Agent mislukt — beslis: retry, fallback, of escaleer
  if (isRetryable(error)) {
    return await retryWithBackoff(() => Agent({ prompt }), 3)
  }
  throw new AgentError(`Agent mislukt voor taak: ${taskDescription}`, { cause: error })
}
```

## Kostenbeheer

- Haiku gebruiken voor extractie, vertaling, classificatie (hoog volume, eenvoudige taken)
- Sonnet gebruiken voor redeneren, schrijven, analyse (standaard voor meeste taken)
- Opus gebruiken voor kritische beslissingen, complex code review (alleen hoge inzet)
- Dure agenten slechts eenmaal uitvoeren — output cachen of opslaan

---
