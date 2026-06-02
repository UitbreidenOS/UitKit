---
name: cma-report
description: "Informe de Análisis Comparativo de Mercado: selección de comparables, rango de valor, estrategia de precio, narrativa de presentación al vendedor — convierte datos brutos de ventas en un paquete de CMA persuasivo"
---

# Habilidad: Informe de CMA

## Cuándo activar
- Preparar una presentación de listado y necesitar una narrativa de CMA pulida para acompañar los datos de comparables
- Un vendedor cuestiona tu precio y necesitas una refutación respaldada por datos
- Tienes datos brutos de ventas/activos/vencidos y necesitas estructurarlos en un informe profesional
- Realizar una revisión anual del mercado para clientes anteriores con el fin de generar referencias
- Comparar el precio de oferta de un comprador con ventas comparables recientes

## Cuándo NO usar
- Avalúos formales de propiedad — solo los tasadores con licencia producen valoraciones legalmente válidas
- Análisis comercial o de múltiples unidades — metodología de valoración diferente (enfoque de ingresos)
- Propiedades sin ventas comparables en los últimos 12 meses (rural, ultra lujo, única) — revela esta limitación
- Modelos de Valoración Automatizada (AVM) — si necesitas un AVM, usa directamente tu MLS o la herramienta de Zillow

## Instrucciones

### Prompt principal de CMA

```
Generate a Comparative Market Analysis report for a seller listing presentation.

SUBJECT PROPERTY:
- Address: [city/neighborhood, no street number required]
- Property type: [SFR / condo / townhome]
- Beds/Baths: [X] bed / [X.X] bath
- Square footage: [X] sq ft (heated/cooled)
- Lot size: [X] sq ft or acres
- Year built: [YYYY]
- Condition/updates: [describe recent updates — kitchen remodel 2022, new HVAC 2023, etc.]
- Special features: [pool, view, ADU, solar, premium lot, etc.]
- Seller's timeline: [X weeks/months to close]

COMPARABLE SALES (provide 3-6 recent sales):
For each comp:
- Comp [N]: [beds/baths], [sq ft], [address or cross-streets], sold $[X], list $[X], [X] days on market, sold [date], [notable features or differences]

ACTIVE LISTINGS (current competition — 2-3):
- Active [N]: [beds/baths], [sq ft], listed at $[X], [X] days on market, [notes]

EXPIRED/WITHDRAWN (if any — shows pricing ceiling):
- Expired [N]: [sq ft], listed at $[X], [X] days on market, expired [date]

LOCAL MARKET CONTEXT:
- Current absorption rate: [X] months of inventory
- Average days on market: [X] days
- List-to-sale price ratio: [X]%
- Recent market trend: [appreciating / stable / correcting]

ADJUSTMENTS YOU'VE MADE:
[Describe any adjustments: Comp 2 lacks pool (-$15K), Comp 3 has older kitchen (+$8K adjustment to bring in line, etc.]

My recommended price range: $[X] - $[X]

Generate:
1. Market conditions summary (2-3 sentences, present-tense)
2. Comparable sales analysis with adjustment rationale
3. Active competition analysis (what the seller is competing against)
4. Pricing strategy recommendation with tiered approach
5. Seller presentation narrative (3-4 paragraphs, professional tone, designed to be read aloud or left as takeaway)
6. Price reduction triggers (if the property doesn't sell — when and by how much)
```

---

### Marco de selección de comparables

Usa esto para orientar a Claude en la elección de los comparables correctos:

```
Help me select the best comparable sales from this list for a CMA.

Subject property: [X] bed / [X] bath, [X] sq ft, [neighborhood], sold price target ~$[X]

Candidate comps (paste your list):
[comp 1 details]
[comp 2 details]
...

Rank these comps by their suitability as comparables. Score each on:
1. Location proximity (same subdivision / neighborhood: 10pts, within 1 mile: 7pts, 1-3 miles: 3pts)
2. Size similarity (within 10% of subject sq ft: 10pts, 11-20%: 5pts, >20%: 1pt)
3. Recency (sold within 90 days: 10pts, 91-180 days: 6pts, 181-365 days: 3pts)
4. Similarity of features (same bed/bath count: 5pts each, garage match: 5pts)
5. Market conditions (same market cycle / no distressed sale: 10pts)

Select the 3 best comps and explain why each was chosen.
Flag any adjustments needed before using these in the CMA.
```

---

### Prompt de análisis de ajustes

```
Help me calculate and document adjustments for these comparable sales.

Subject property: [facts]
Comp [N]: [facts]

For each difference between the comp and subject, estimate an adjustment:

Common adjustment categories:
- Location premium/discount: [$/sq ft or lump sum]
- Size adjustment: [$/sq ft for sq footage difference]
- Condition/update adjustment: [lump sum — new kitchen = $X, new HVAC = $X]
- Garage: [$/space]
- Pool: [$X in this market]
- Lot premium (view, corner, cul-de-sac): [$X]
- Age adjustment: [$/year if significant age gap]

For each comp:
1. Raw sale price: $[X]
2. List all adjustments with dollar amounts and rationale
3. Adjusted value: $[X]
4. Implied subject property value: $[X]

Final value range from adjusted comps: $[low] - $[high]
Recommended list price: $[X] (rationale: [which comp is most similar, market direction])
```

---

### Niveles de estrategia de precio

```
Generate a tiered pricing strategy for a seller who wants to maximise price but also needs to sell within [X] weeks.

Adjusted value range from CMA: $[X] - $[X]
Seller's minimum acceptable price: $[X]
Current absorption rate: [X] months
Average DOM in this price range: [X] days

Generate three pricing scenarios:

TIER 1 — AGGRESSIVE (top of range):
Price: $[X]
Risk: [% chance of sitting; estimated DOM]
Strategy: [what needs to go right for this to work]
Price reduction trigger: [if X DOM without offer, reduce to $Y]

TIER 2 — MARKET (middle of range):
Price: $[X]
Risk: [estimated DOM at this price]
Strategy: [how to position at this price vs. competition]
Price reduction trigger: [if needed]

TIER 3 — MOVE-IT (below market):
Price: $[X]
Expected outcome: [multiple offers / fast close probability]
When to use this tier: [seller timeline, financial pressure, property condition]

Recommendation: [which tier and why, given seller's situation]
```

---

### Plantilla de narrativa para presentación al vendedor

```
Write a seller presentation CMA narrative. Professional tone, designed to be read aloud or left with the seller. No jargon.

Market context: [paste your market summary]
Comp analysis results: [paste adjusted values]
Recommended price: $[X] - $[X]
Seller's situation: [timeline, motivation — brief]

Structure:
Paragraph 1: What the market is doing right now (buyer demand, inventory, price trends)
Paragraph 2: What comparable sales tell us — walk through 2-3 most relevant comps with adjustments
Paragraph 3: What you are competing against (active listings)
Paragraph 4: My recommendation — the price, the strategy, and what happens if it doesn't sell in [X] days

Keep it under 400 words. End with a question that invites the seller to discuss: "Does this pricing align with your timeline?"
```

---

### Prompts de respuesta a objeciones

```
Draft a response to a seller who says: "Zillow says my house is worth $[X more than your CMA]."

My CMA recommended price: $[X]
Zillow estimate: $[X]
Difference: $[X] ([X]%)

Key facts on my side:
- [Which comps support my price]
- [Any condition factors Zillow doesn't see]
- [Recent neighborhood sales Zillow may have missed]

Write a response that:
1. Acknowledges the seller's concern without dismissing it
2. Explains how AVMs work and their known limitations
3. Points to the specific comparable sales that support your price
4. Proposes a path forward (e.g., "Let's price at $[X] for 2 weeks — if we get strong traffic, we hold; if not, we have data to act on")
Keep it under 200 words. Professional, not defensive.
```

---

### Formato de salida — Informe completo de CMA

```markdown
# Análisis Comparativo de Mercado
**[Dirección de la propiedad o "Presentación al Vendedor"]**
**Preparado por:** [Nombre del Agente] | **Fecha:** [Fecha]

---

## Resumen de Condiciones del Mercado
[2-3 oraciones sobre la demanda actual de compradores, inventario y tendencia de precios en este submercado]

---

## Análisis de Ventas Comparables

| Comp | Dirección | Precio de Venta | Precio Ajustado | m² | $/m² | Fecha de Venta | Diferencias Clave |
|---|---|---|---|---|---|---|---|
| Comp 1 | [área] | $[X] | $[X] | [X] | $[X] | [fecha] | [notas] |
| Comp 2 | [área] | $[X] | $[X] | [X] | $[X] | [fecha] | [notas] |
| Comp 3 | [área] | $[X] | $[X] | [X] | $[X] | [fecha] | [notas] |

**Rango de valor ajustado de las ventas:** $[X] – $[X]

---

## Competencia Activa

| Listado | Precio de Lista | m² | Días en Mercado | Notable |
|---|---|---|---|---|
| Activo 1 | $[X] | [X] | [X] | [notas] |
| Activo 2 | $[X] | [X] | [X] | [notas] |

**Conclusión:** [¿Están los activos sobrevaluados? ¿Reducirán? ¿Son competencia directa?]

---

## Recomendación de Precio

**Precio de listado recomendado:** $[X] – $[X]
**Justificación:** [Qué comparable impulsó esto y por qué]

**Disparador de reducción de precio:** Si no hay oferta en [X] días, reducir a $[X].

---

## Narrativa de Presentación al Vendedor

[Narrativa de 3-4 párrafos lista para leer en voz alta o dejar con el vendedor]

---

## Calendario de Reducción de Precios (si es necesario)

- **Días 1–14:** Mantener en $[X] — recopilar comentarios de visitas
- **Día 15:** Si menos de [X] visitas y sin oferta, reducir a $[X]
- **Día 30:** Si no hay oferta, reevaluar condiciones del mercado y discutir $[X]
```

## Ejemplo

**Usuario:** Tengo un rancho de 4 habitaciones/2 baños, 1.950 pies cuadrados en los suburbios de Denver, cocina renovada en 2024, sin piscina. El vendedor quiere $625K. Tres comparables: 4/2 de 1.900 pies cuadrados vendido en $598K (hace 90 días), 4/2.5 de 2.100 pies cuadrados vendido en $641K (hace 45 días, tiene baño extra), 3/2 de 1.800 pies cuadrados vendido en $572K (hace 60 días). La tasa de absorción del mercado es de 2,1 meses, días promedio en mercado de 22 días, ratio precio de lista a venta del 99,2%.

**Resultado esperado:** Un informe completo de CMA con la tabla de comparables mostrando ajustes (+$8K por el baño adicional del Comp 2, -$10K por el menor tamaño del Comp 3), rango de valor ajustado de $608K–$628K, precio de listado recomendado de $618K, una narrativa de 3 párrafos para el vendedor explicando el mercado equilibrado y cómo la cocina renovada justifica el extremo superior del rango, y un disparador de reducción de precio en el Día 14 / $599K si no hay ofertas.

---

> **Trabaja con nosotros:** Claudient cuenta con el respaldo de [Uitbreiden](https://uitbreiden.com/) — desarrollamos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
