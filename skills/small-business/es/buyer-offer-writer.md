---
name: buyer-offer-writer
description: "Carta de oferta del comprador y carta de presentación personal: personalizar según la situación del vendedor, destacar las fortalezas del comprador, redactar para escenarios competitivos con múltiples ofertas y vendedores emocionales"
---

# Habilidad: Redactor de Ofertas para Compradores

## Cuándo activar
- Tu comprador quiere adjuntar una carta personal con su oferta (especialmente en ventas emocionales o de vivienda familiar)
- En una situación con múltiples ofertas y necesitas diferenciar a tu comprador más allá del precio
- Redactar la carta de presentación del resumen de oferta del agente al agente de listado
- Preparar una carta para un vendedor que ha vivido en la propiedad durante décadas y le importa su legado
- Tu comprador está renunciando a contingencias y necesita comunicar solidez financiera de manera convincente

## Cuándo NO usar
- El agente de listado o el vendedor ha solicitado que no se envíen cartas — respeta esto; algunos vendedores declinan para evitar responsabilidad por la Ley de Vivienda Justa
- Transacciones de propiedades comerciales o de inversión — las decisiones son financieras, no emocionales
- La carta revelaría información de clase protegida (tamaño de familia, origen nacional, religión) — Claude la marcará y eliminará
- Ventas en dificultades (ejecución hipotecaria, sucesión) donde el tomador de decisiones es un banco o tribunal

## Nota sobre la Ley de Vivienda Justa

Las cartas de compradores pueden crear inadvertidamente responsabilidad bajo la Ley de Vivienda Justa cuando hacen referencia al estado familiar, origen nacional, religión, raza o discapacidad. Claude:
- Marcará cualquier detalle que proporciones que implique características de clase protegida
- Sugerirá alternativas conformes que transmitan la misma conexión emocional
- Nunca incluirá detalles sobre número de hijos, prácticas religiosas, origen nacional o estado de discapacidad

Tú eres responsable de la revisión final antes de la presentación.

## Instrucciones

### Carta de presentación personal (comprador al vendedor)

```
Write a personal offer letter from a buyer to a home seller.

BUYER DETAILS (provide only what's relevant and Fair Housing compliant):
- Buyer name(s): [first names only]
- Connection to the property or neighborhood: [why this specific home — describe without protected class info]
- What they love about the property: [specific features — fireplace, garden, workshop, layout]
- Their story (Fair Housing compliant): [career, lifestyle, connection to community — not family structure]
- Their commitment: [cash offer / pre-approved / flexible closing / no contingencies]

SELLER DETAILS (what you know about them):
- Seller's relationship to the home: [long-time owner, raised family here, inherited, etc.]
- Seller's known priorities: [speed, price, certainty, right buyer]
- Any known emotional ties: [garden they planted, custom woodwork, neighborhood legacy]

OFFER CONTEXT:
- Offer price: $[X] (vs. list price $[X])
- Offer type: [at list / above list / with escalation clause]
- Strength of offer: [pre-approval amount $[X], cash, [X]% down, flexible close date]
- Contingencies: [financing / inspection / appraisal — or specify waivers]
- Competitive context: [multiple offers expected / single offer / deadline]

Write a letter that:
1. Opens with a genuine, specific connection to this property (not generic "we love your home")
2. Tells the buyer's story in 1-2 sentences (lifestyle, not demographics)
3. Highlights 2-3 specific features of the home they love (shows they've been there)
4. Communicates financial strength without sounding clinical
5. Addresses the seller's known priorities directly
6. Closes with warmth and confidence — not desperation
Keep it under 300 words. No Fair Housing red flags.
```

---

### Carta de presentación del agente (agente a agente)

```
Write a cover letter from buyer's agent to listing agent to accompany an offer.

OFFER SUMMARY:
- Property: [address]
- Offer price: $[X]
- Earnest money: $[X] ([X]% of purchase price)
- Down payment: [X]%
- Loan type: [conventional / FHA / VA / jumbo / cash]
- Pre-approval: [pre-approved with [lender], up to $[X], verified income and assets]
- Close date: [X days from acceptance / flexible]
- Possession: [at close / [X] days after]

CONTINGENCIES:
- Inspection: [yes / waived / information-only]
- Financing: [yes / waived — cash / strong approval]
- Appraisal: [yes / waived / gap coverage up to $[X]]
- HOA docs: [yes / waived]

BUYER STRENGTH POINTS:
[List 3-4 reasons this offer is clean and will close]

OFFER STRATEGY CONTEXT:
- Is this a multiple-offer situation? [yes/no — if yes, what's the competitive angle?]
- Any special accommodations to seller? [flexible close, rent-back, personal property items]
- Escalation clause? [yes — up to $[X] in $[X] increments, with proof of competing offer]

Write a professional agent-to-agent letter that:
1. Summarizes the offer terms clearly in the first paragraph
2. Establishes buyer credibility (lender name, financial strength)
3. Highlights what makes this offer clean (low risk to seller)
4. States any seller accommodations
5. Provides your contact information and availability
Tone: Professional, collegial, confident. Not pushy.
Under 250 words.
```

---

### Explicación de cláusula de escalación

```
Draft a plain-English escalation clause explanation for my buyers to understand, and a professional disclosure for the listing agent.

Escalation details:
- Base offer price: $[X]
- Escalation increment: $[X] above any competing bona fide offer
- Escalation cap: $[X] (maximum we will pay)
- Proof required: [yes — copy of competing offer / no proof required]
- Appraisal gap coverage: [yes, up to $[X] above appraised value / no]

Write two versions:
1. BUYER EXPLANATION (plain English, how it works in practice, 100 words max)
2. AGENT DISCLOSURE (for the listing agent, precise terms, 80 words max)
```

---

### Prompt de estrategia competitiva con múltiples ofertas

```
My buyer is competing in a multiple-offer situation. Help me build the strongest possible offer package.

Property: [address]
List price: $[X]
Offer deadline: [date/time]
Number of competing offers (if known): [X]
Estimated competition: [all conventional / likely cash offers / FHA buyers]

My buyer's situation:
- Pre-approved: $[X] with [lender name]
- Down payment: [X]%
- Flexibility: [close date range, move-out accommodation, etc.]
- Contingencies they'll keep: [inspection / financing / appraisal]
- Contingencies they'll waive: [list]
- Cash reserves after close: $[X] (can document)
- Maximum price: $[X]

Generate:
1. Recommended offer price and rationale
2. Escalation clause structure (if appropriate)
3. Which contingencies to waive and what risk that carries
4. 3 non-price ways to strengthen this offer
5. One-paragraph letter strategy (emotional vs. financial focus based on seller profile)
6. Red lines — what NOT to do even in competition (overextend, blind escalation cap, etc.)
```

---

### Respuesta a contraoferta

```
My buyer received a counter-offer. Help me draft the response letter and advise on strategy.

Original offer: $[X], [contingencies], close [date]
Counter-offer: $[X], [changes to terms], close [date]
Difference: $[X] / [what changed]

My buyer's position:
- Maximum they'll pay: $[X]
- Non-negotiables: [what they won't change]
- What they can offer in return for a better price: [close date flexibility, larger earnest money, etc.]

Generate:
1. Counter-proposal terms (what to offer back)
2. Brief letter accepting the counter / proposing a middle ground (under 150 words)
3. Walk-away recommendation: at what price or terms should my buyer decline?
```

---

### Seguimiento posterior a la oferta

```
My buyer's offer was not selected. Write a follow-up message to the listing agent.

Context: [offer price, why it may not have been chosen, any intel on what won]
Goal: [stay in backup position / get feedback / keep relationship]

Write a brief, gracious message that:
1. Thanks the listing agent for the opportunity
2. Asks for feedback on what the winning offer looked like (agents often share this)
3. Positions the buyer as a backup if the first deal falls through
Under 100 words. Professional and warm.
```

## Ejemplo

**Usuario:** Mis compradores (una pareja, nombres de pila Sarah y Tom) están ofreciendo $715K sobre un precio de listado de $699K en Denver. Los vendedores son una pareja jubilada que ha vivido allí 25 años. El agente de los vendedores dice que les importa que la casa vaya a alguien que la ame, no que la revenda. Mis compradores son ambos maestros, les encanta el jardín trasero y quieren quedarse en el vecindario a largo plazo. Préstamo convencional, 20% de entrada, preaprobados hasta $800K con Chase. Renuncian a la brecha de tasación hasta $20K.

**Resultado esperado:** Una carta personal de 280 palabras de Sarah y Tom que abre con un detalle específico sobre el jardín ("los canteros elevados a lo largo de la cerca sur"), menciona sus carreras como algo que los vincula a la comunidad, expresa la intención de quedarse y mantener el carácter de la propiedad, y cierra con calidez. Sin mención de hijos, religión u origen nacional. Carta de presentación del agente por separado — resume la oferta de $715K, 20% de entrada, convencional con Chase, cobertura de brecha de tasación hasta $20K, cierre flexible, y posiciona la oferta como de bajo riesgo para los vendedores.

---

> **Trabaja con nosotros:** Claudient cuenta con el respaldo de [Uitbreiden](https://uitbreiden.com/) — desarrollamos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
