---
name: chaos-engineering
description: "Chaos engineering: ontwerp failure-injection-experimenten, identificeer blast radius, definieer steady state, gebruik Chaos Monkey / Gremlin / Litmus — bouw veerkracht"
---

# Vaardigheid Chaos Engineering

## Wanneer activeren
- Systemveerkracht vóór grote lancering valideren
- Testen of circuit breakers en fallbacks echt werken
- Onbekende afhankelijkheden en single points of failure identificeren
- Chaos-engineering-praktijk helemaal opnieuw instellen
- Specifiek failure-injection-experiment ontwerpen

## Wanneer NIET gebruiken
- Productiesystemen zonder bestaande observability
- Systemen zonder rollback-mogelijkheid
- Gereglementeerde omgevingen zonder expliciete goedkeuring
- Als vervanging voor load-tests

## Instructies

### Chaos-experiment-ontwerp

```
Chaos-engineering-experiment voor [systeem/service] ontwerpen.

Systeem: [architectuur beschrijven]
Hypothese: [wat gelooft u dat gebeurt als X mislukt?]
Doel: [welke component kapot maken]
Steady State: [hoe meet u "systeem is gezond"?]

Chaos-experiment-template:

1. Hypothese: "Wanneer [component X] mislukt, [reageert systeem met Y] omdat [we circuit breaker Z hebben]."

2. Steady State definitie (VÓÓRdat we failure injecteren):
   - Metriek 1: [bijv. p99 API-latentie < 200ms]
   - Metriek 2: [bijv. foutfrequentie < 0.1%]
   - Metriek 3: [bijv. alle gezondheidscontroles groen]

3. Te injecteren failure:
   - Wat: [proces doden / latentie toevoegen / pakketten droppen / schijf vullen]
   - Waar: [specifieke pod / host / AZ / afhankelijkheid]
   - Blast Radius: [enkele instantie / alles in 1 AZ / gehele service]

4. Waarnemingsperiode: [5 minuten om te starten]

5. Rollback-trigger:
   - Stop als: [metriek X overtreft Y drempel]
   - Rollback-methode: [precieze commando of actie]

6. Analyse:
   - Bereikt systeem steady state opnieuw in [X minuten]?
   - Werden gebruikers beïnvloed? Hoe lang?
   - Werd waarschuwing geactiveerd? Was het de juiste waarschuwing?

7. Actie als hypothese fout was:
   - [gat repareren — circuit breaker toevoegen, fallback verbeteren, redundantie toevoegen]

Specifiek experiment voor mijn systeem ontwerpen.
```

### Veelvoorkomende failureszenaario's

Netwerk-, resource-, dependency-failures, Kubernetes-speci fiek. LitmusChaos, Chaos Mesh, AWS FIS, Gremlin gebruiken.

### Blast-radius-beoordeling

Analyse directe/indirecte consumenten, externe impact, recovery-pad, risicodrivu.

### Game-day-planning

Game-day-agenda voor [team], voorbereiding, uitvoeringsoefeningen, debriefing.

---
