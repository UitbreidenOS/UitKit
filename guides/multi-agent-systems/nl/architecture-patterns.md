# Multi-Agent-systemen: Architectuurpatronen

Uitgebreide gids voor veelvoorkomende architecturen voor multi-agent AI-systemen, hun afwegingen en wanneer elk patroon te gebruiken.

---

## Patroonkeuzes Matrix

| Patroon | Agenten | Complexiteit | Latentie | Foutvergeling | Gebruikscase |
|---------|--------|-----------|---------|-----------------|----------|
| Sequentiële Pipeline | 2-5 | Laag | N/A (sequentieel) | Geen | Lineaire workflows, geen parallellisering |
| Parallelle Fan-Out | 3-10 | Gemiddeld | Verminderd | Enige | Onafhankelijke subtaken, samenvoeging van resultaten |
| DAG-orkestratie | 5-100+ | Hoog | Geoptimaliseerd | Goed | Complexe afhankelijkheden, parallellisering |
| Blackboard-patroon | 3-20 | Gemiddeld | N/A | Matig | Gedeelde status, samenwerkende agenten |
| Saga-patroon | 3-10 | Gemiddeld | N/A | Uitstekend | Gedistribueerde transacties, rollback |
| Supervisor + Subagenten | 5-50 | Hoog | Geoptimaliseerd | Uitstekend | Grote teams, duidelijke hiërarchie |

---

## Sequentiële Pipeline

Agenten voeren achtereenvolgens uit, elk met behulp van de vorige uitvoer.

```
Input → Agent A → Output A → Agent B → Output B → Agent C → Final Output
```

**Wanneer te gebruiken:**
- Workflows met strikte volgorde (kunnen niet worden geparallelliseerd)
- Elke agent hangt volledig af van de vorige uitvoer
- < 3 agenten (eenvoudig genoeg om geen orkestratie nodig te hebben)

**Implementatie:**
```python
result_a = agent_a(user_input)
result_b = agent_b(result_a)
result_c = agent_c(result_b)
return result_c
```

**Afwegingen:**
- ✓ Eenvoudigst te implementeren en debuggen
- ✗ Kan niet worden geparallelliseerd; totale latentie = som van alle latencies
- ✗ Geen foutvergeling (eerste fout stopt alles)

---

## Parallelle Fan-Out + Samenvoeging

Een orkestratortaak splitst zich in onafhankelijke subtaken, dan samenvoeging van resultaten.

```
                ┌─→ Agent A ─┐
Input → Split →├─→ Agent B ─┤→ Merge → Output
                └─→ Agent C ─┘
```

**Wanneer te gebruiken:**
- Meerdere onafhankelijke subtaken (bv. onderzoek uit 3 bronnen)
- Subtaken kunnen parallel uitvoeren
- Resultaten zijn samen te voegen (geen complexe afhankelijkheden)

**Implementatie:**
```python
import asyncio

results = await asyncio.gather(
    agent_a(input),
    agent_b(input),
    agent_c(input)
)

merged = merge_results(*results)
return merged
```

**Afwegingen:**
- ✓ Parallellisering reduceert latentie
- ✓ Fout van één agent blokkeert anderen niet
- ✗ Kan gedeeltelijke afhankelijkheden niet uitdrukken (Agent D hangt af van A en B, maar niet C)
- ✗ Samenvoegingslogica kan complex zijn als resultaten conflicteren

---

## DAG-orkestratie

Agenten worden weergegeven als knooppunten, afhankelijkheden als randen. Voer taken uit in topologische volgorde.

```
       validate
        /     \
    check    verify
       |       |
    reserve   (merged)
       \     /
       charge → send
```

**Wanneer te gebruiken:**
- 5+ agenten met complexe afhankelijkheden
- Moet parallelliseren met respect voor gedeeltelijke afhankelijkheden
- Wil automatische deadlockdetectie en foutenherstel

**Implementatie:**
Gebruik topologische sortering om uitvoeringsrijen te berekenen (sets taken die parallel kunnen uitvoeren):

```python
lanes = topological_sort(dag)
# lanes[0] = [validate]
# lanes[1] = [check, verify]
# lanes[2] = [reserve]
# lanes[3] = [charge]
# lanes[4] = [send]

for lane in lanes:
    results = await run_lane_parallel(lane)
    save_state(results)
```

**Afwegingen:**
- ✓ Optimale parallellisering
- ✓ Automatische deadlockdetectie
- ✓ Kan van elk punt worden hervat (toestandspersistentie)
- ✗ Complexer te implementeren
- ✗ Vereist formele afhankelijkheidsspecificatie

---

## Blackboard-patroon

Agenten lezen/schrijven een gedeelde gegevensstructuur (blackboard), coördinatie via gedeelde status in plaats van directe handoffs.

```
                ┌─────────────────┐
                │   Blackboard    │
                │ ┌─────────────┐ │
                │ │ research    │ │
                │ │ analysis    │ │
                │ │ synthesis   │ │
                │ └─────────────┘ │
                └────────┬────────┘
                 ╱      ╲      ╲
        Agent A ───    Agent B   Agent C
```

**Wanneer te gebruiken:**
- Agenten moeten via gedeelde status coördineren
- Meerdere agenten lezen dezelfde gegevens
- Agenten kunnen in niet-lineaire volgorde aan gegevens werken
- Versiecoherentie en conflictresolutie zijn belangrijk

**Implementatie:**
```python
# Onderzoeker schrijft naar blackboard
write_phase('research', sources=[...], summary='...')

# Analist leest van blackboard
research_data = read_phase('research')

# Analist schrijft analyse
write_phase('analysis', themes=[...])

# Schrijver leest beide
research = read_phase('research')
analysis = read_phase('analysis')
```

**Afwegingen:**
- ✓ Flexibele coördinatie (agenten hoeven elkaar niet te kennen)
- ✓ Gecentraliseerde status maakt debuggen gemakkelijker
- ✗ Gelijktijdig schrijven vereist conflictdetectie
- ✗ Versiebeheersoverhead
- ✗ Niet geschikt voor event-driven/streaming workflows

---

## Saga-patroon

Gedistribueerd transactiepatroon: voer stappen vooruit uit, en als een stap mislukt, compenseert u terug.

```
Step 1 → Step 2 → Step 3 (fails) ← Compensate 2 ← Compensate 1
  ✓        ✓        ✗               ✓              ✓
```

**Wanneer te gebruiken:**
- Elke stap muteert externe toestand (DB-schrijfbewerkingen, API-aanroepen)
- Moet atomair zijn (alle stappen slagen of alles wordt teruggedraaid)
- Kan twee-fasecommit niet gebruiken (geen gedistribueerde vergrendelingen)
- Stappen zijn idempotent en reversibel

**Implementatie:**
```python
for step in saga_steps:
    result = run_step(step)
    context[step.output_key] = result
    if result.error:
        # Rollback: voer compensaties in omgekeerde volgorde uit
        for step in reversed(completed_steps):
            run_compensation(step, context)
        return 'FAILED_AND_ROLLED_BACK'
```

**Afwegingen:**
- ✓ Behandelt gedistribueerde toestandsmutaties
- ✓ Sterke rollback-garanties
- ✗ Voorbijgaande inconsistentie (toestand gedeeltelijk vastgelegd)
- ✗ Compensatielogica moet handmatig worden geschreven
- ✗ Niet geschikt voor workflows zonder reversibele bewerkingen

---

## Supervisor + Subagenten

Strikte hiërarchie: supervisor ontleedt taken en delegeert aan gespecialiseerde subagenten.

```
             Supervisor
           /    |     \
        Agent A Agent B Agent C
```

**Wanneer te gebruiken:**
- Duidelijke hiërarchische structuur (één orkestrator, veel gespecialiseerde agenten)
- Moet centraal toepassen van resources afdwingen (budgetten, timeouts)
- Moet kwaliteitsgates en validatie tussen stappen
- Agenten mogen niet direct met elkaar communiceren

**Implementatie:**
```python
class Supervisor:
    def decompose(self, request):
        return [task_1, task_2, task_3]
    
    def delegate(self, task):
        result = spawn_agent(task.agent, task.input)
        self.validate(result)
        return result
    
    def orchestrate(self, request):
        tasks = self.decompose(request)
        results = []
        for task in tasks:
            result = self.delegate(task)
            results.append(result)
        return self.assemble(results)
```

**Afwegingen:**
- ✓ Duidelijke rollengrenzen
- ✓ Centrale toepassingsdwang voor resources
- ✓ Supervisor kan valideren en opnieuw proberen
- ✗ Supervisor wordt een bottleneck
- ✗ Minder flexibel (agenten kunnen niet direct communiceren)

---

## Vergelijking: Real-World Voorbeeld

**Taak:** Verwerk een e-commerce-bestelling (valideren, inventaris controleren, betaling verwerken, bevestiging verzenden)

### Sequentiële Pipeline
```python
validate_order(order)
check_inventory(order)
process_payment(order)
send_confirmation(order)
# Totale latentie : T_v + T_i + T_p + T_c
```

### Parallelle Fan-Out
```python
# Onmogelijk: validatie moet eerst, daarna controle/betaling parallel
```

### DAG-orkestratie
```
validate (5s) → check (10s), payment (8s) → charge (5s) → send (3s)
# Totale latentie : 5 + max(10, 8) + 5 + 3 = 23s
# Versnelling vs sequentieel : (5+10+8+5+3) / 23 = 1.7x
```

### Saga-patroon
```
1. Bestelling valideren          → succes
2. Inventaris controleren        → succes, artikelen reserveren
3. Betaling verwerken            → MISLUKKEN (kaart afgewezen)
   └─ Compensatie: inventaris vrijgeven
   └─ Compensatie: bestelling als geannuleerd markeren
# Resultaat : Bestelling geannuleerd, inventaris vrijgegeven, geen betaling
```

### Supervisor + Subagenten
```
Supervisor ontleedt: [validate, check&pay (parallel), charge, send]
Supervisor delegeert aan agenten, valideert outputs
Bij fout, opnieuw proberen (tot 2 keer) daarna escaleren
```

---

## Anti-Patronen om te Vermijden

### Volledig Verbonden Mesh

Elke agent communiceert met elke andere agent. Leidt tot onvoorspelbare communicatiepatronen en opkomende bugs.

❌ **Slecht:**
```
A ←→ B ←→ C ←→ D
↑         ↑
└─────────┘
```

✓ **Goed:** Gebruik hiërarchie of DAG met expliciete afhankelijkheden.

### Circulaire Afhankelijkheden

Agent A wacht op Agent B, die wacht op Agent A. Deadlock.

❌ **Slecht:**
```
A → B → A (cycle)
```

✓ **Goed:** Gebruik topologische sortering om cycli voor uitvoering op te sporen en af te wijzen.

### Stille Fouten

Agent mislukt maar orkestrator weet het niet, gaat door met verouderde gegevens.

❌ **Slecht:**
```python
result = agent_call(...)
# Geen foutbehandeling, succes aannemen
return result
```

✓ **Goed:**
```python
result = agent_call(...)
if result.status == 'error':
    raise AgentFailure(result.error)
    # of opnieuw proberen, of escaleren
```

### Onbegrensde Pogingen

Agent mislukt in een lus, herprobeert voor altijd, voltooit nooit.

❌ **Slecht:**
```python
while True:
    try:
        return agent_call(...)
    except:
        pass  # Voor altijd opnieuw proberen
```

✓ **Goed:**
```python
for attempt in range(max_retries):
    try:
        return agent_call(...)
    except Exception as e:
        if attempt == max_retries - 1:
            escalate(e)
```

---

## Beslissingsboom

**Hoeveel agenten?**
- 1-2: Enkele agent met lussen, geen orkestratie nodig
- 3-5: Sequentiële pipeline of parallelle fan-out
- 5-20: DAG-orkestratie of blackboard-patroon
- 20+: Supervisor + subagenten met toepassing van resources

**Werken agenten aan gedeelde status?**
- Ja: Blackboard-patroon
- Nee: DAG, saga of supervisor

**Atomaire transacties behouden?**
- Ja: Saga-patroon
- Nee: DAG of blackboard

**Automatische parallellisering nodig?**
- Ja: DAG-orkestratie
- Nee: Sequentieel of fan-out

**Strikte rollengrenzen nodig?**
- Ja: Supervisor + subagenten
- Nee: DAG of blackboard

---
