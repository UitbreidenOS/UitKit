# Multi-Agent-Systeme: Architekturmuster

Umfassender Leitfaden zu häufigen Architekturen für Multi-Agent-KI-Systeme, deren Kompromisse und wann man jedes Muster verwendet.

---

## Musterwahl-Matrix

| Muster | Agenten | Komplexität | Latenz | Fehlertoleranz | Anwendungsfall |
|---------|--------|-----------|---------|-----------------|----------|
| Sequenzielle Pipeline | 2-5 | Niedrig | N/A (sequenziell) | Keine | Lineare Workflows, keine Parallelisierung |
| Paralleles Fan-Out | 3-10 | Mittel | Reduziert | Einige | Unabhängige Subaufgaben, Ergebnisfusion |
| DAG-Orchestrierung | 5-100+ | Hoch | Optimiert | Gut | Komplexe Abhängigkeiten, Parallelisierung |
| Blackboard-Muster | 3-20 | Mittel | N/A | Moderat | Gemeinsamer Status, kollegiale Agenten |
| Saga-Muster | 3-10 | Mittel | N/A | Ausgezeichnet | Verteilte Transaktionen, Rollback |
| Supervisor + Subagenten | 5-50 | Hoch | Optimiert | Ausgezeichnet | Große Teams, klare Hierarchie |

---

## Sequenzielle Pipeline

Agenten führen nacheinander aus, jeweils unter Verwendung der vorherigen Ausgabe.

```
Input → Agent A → Output A → Agent B → Output B → Agent C → Final Output
```

**Wann zu verwenden:**
- Workflows mit strikter Reihenfolge (kann nicht parallelisiert werden)
- Jeder Agent hängt vollständig von der vorherigen Ausgabe ab
- < 3 Agenten (einfach genug, um keine Orchestrierung zu benötigen)

**Implementierung:**
```python
result_a = agent_a(user_input)
result_b = agent_b(result_a)
result_c = agent_c(result_b)
return result_c
```

**Kompromisse:**
- ✓ Am einfachsten zu implementieren und zu debuggen
- ✗ Kann nicht parallelisiert werden; Gesamtlatenz = Summe aller Latenzen
- ✗ Keine Fehlertoleranz (erste Fehlschlag stoppt alles)

---

## Paralleles Fan-Out + Merge

Eine Orchestrierungs-Task spaltet sich in unabhängige Subaufgaben auf, dann Ergebnisse fusionieren.

```
                ┌─→ Agent A ─┐
Input → Split →├─→ Agent B ─┤→ Merge → Output
                └─→ Agent C ─┘
```

**Wann zu verwenden:**
- Mehrere unabhängige Subaufgaben (z.B. Recherche aus 3 Quellen)
- Subaufgaben können parallel ausgeführt werden
- Ergebnisse sind fusionierbar (keine komplexen Abhängigkeiten)

**Implementierung:**
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

**Kompromisse:**
- ✓ Parallelisierung reduziert Latenz
- ✓ Fehlschlag eines Agenten blockiert nicht andere
- ✗ Kann partielle Abhängigkeiten nicht ausdrücken (Agent D hängt von A und B ab, aber nicht C)
- ✗ Fusionslogik kann komplex sein, wenn Ergebnisse in Konflikt geraten

---

## DAG-Orchestrierung

Agenten werden als Knoten dargestellt, Abhängigkeiten als Kanten. Führen Sie Aufgaben in topologischer Reihenfolge aus.

```
       validate
        /     \
    check    verify
       |       |
    reserve   (merged)
       \     /
       charge → send
```

**Wann zu verwenden:**
- 5+ Agenten mit komplexen Abhängigkeiten
- Muss parallelisieren und gleichzeitig partielle Abhängigkeiten respektieren
- Möchte automatische Blockierungserkennung und Absturzwiederherstellung

**Implementierung:**
Verwenden Sie topologische Sortierung, um Ausführungsspuren zu berechnen (Sätze von Aufgaben, die parallel ausgeführt werden können):

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

**Kompromisse:**
- ✓ Optimale Parallelisierung
- ✓ Automatische Blockierungserkennung
- ✓ Kann von jedem Punkt aus wiederaufgenommen werden (Zustandspersistenz)
- ✗ Komplexer zu implementieren
- ✗ Erfordert formale Abhängigkeitsspezifikation

---

## Blackboard-Muster

Agenten lesen/schreiben eine gemeinsam genutzte Datenstruktur (Blackboard) und koordinieren sich über gemeinsamen Status statt direkter Handoffs.

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

**Wann zu verwenden:**
- Agenten müssen über gemeinsamen Status koordinieren
- Mehrere Agenten lesen die gleichen Daten
- Agenten können in nicht-linearer Reihenfolge an Daten arbeiten
- Versionskohärenz und Konfliktlösung sind wichtig

**Implementierung:**
```python
# Researcher schreibt auf Blackboard
write_phase('research', sources=[...], summary='...')

# Analyst liest vom Blackboard
research_data = read_phase('research')

# Analyst schreibt Analyse
write_phase('analysis', themes=[...])

# Writer liest beides
research = read_phase('research')
analysis = read_phase('analysis')
```

**Kompromisse:**
- ✓ Flexible Koordination (Agenten müssen sich nicht kennen)
- ✓ Zentraler Status erleichtert Debugging
- ✗ Gleichzeitige Schreibvorgänge erfordern Konflikterkennung
- ✗ Versionsverwaltungs-Overhead
- ✗ Nicht geeignet für ereignisgesteuerte/Streaming-Workflows

---

## Saga-Muster

Verteiltes Transaktionsmuster: Führen Sie Schritte vorwärts aus, und wenn ein Schritt fehlschlägt, kompensieren Sie rückwärts.

```
Step 1 → Step 2 → Step 3 (fails) ← Compensate 2 ← Compensate 1
  ✓        ✓        ✗               ✓              ✓
```

**Wann zu verwenden:**
- Jeder Schritt mutiert externen Status (DB-Schreibvorgänge, API-Aufrufe)
- Muss atomisch sein (alle Schritte erfolgreich, oder alle zurückgerollt)
- Kann Zwei-Phasen-Commit nicht verwenden (keine verteilten Sperren)
- Schritte sind idempotent und reversibel

**Implementierung:**
```python
for step in saga_steps:
    result = run_step(step)
    context[step.output_key] = result
    if result.error:
        # Rollback: Führen Sie Kompensationen in umgekehrter Reihenfolge aus
        for step in reversed(completed_steps):
            run_compensation(step, context)
        return 'FAILED_AND_ROLLED_BACK'
```

**Kompromisse:**
- ✓ Handhaben Sie verteilte Zustandsmutationen
- ✓ Starke Rollback-Garantien
- ✗ Vorübergehende Inkohärenz (Status teilweise committed)
- ✗ Kompensationslogik muss manuell geschrieben werden
- ✗ Nicht geeignet für Workflows ohne reversible Operationen

---

## Supervisor + Subagenten

Strikte Hierarchie: Supervisor zerlegt Aufgaben und delegiert an spezialisierte Subagenten.

```
             Supervisor
           /    |     \
        Agent A Agent B Agent C
```

**Wann zu verwenden:**
- Klare hierarchische Struktur (ein Orchestrierer, viele spezialisierte Agenten)
- Muss Ressourcen zentralisiert durchsetzen (Budgets, Timeouts)
- Benötige Qualitätsgates und Validierung zwischen Schritten
- Agenten sollten nicht direkt miteinander kommunizieren

**Implementierung:**
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

**Kompromisse:**
- ✓ Klare Rollengrenzen
- ✓ Zentralisierte Ressourcendurchsetzung
- ✓ Supervisor kann validieren und wiederholen
- ✗ Supervisor wird zum Engpass
- ✗ Weniger flexibel (Agenten können nicht direkt kommunizieren)

---

## Vergleich: Reales Beispiel

**Aufgabe:** Verarbeite eine E-Commerce-Bestellung (validieren, Lagerbestand prüfen, Zahlungsverarbeitung, Bestätigung senden)

### Sequenzielle Pipeline
```python
validate_order(order)
check_inventory(order)
process_payment(order)
send_confirmation(order)
# Gesamtlatenz : T_v + T_i + T_p + T_c
```

### Paralleles Fan-Out
```python
# Unmöglich: Validierung muss zuerst erfolgen, dann Überprüfung/Zahlung parallel
```

### DAG-Orchestrierung
```
validate (5s) → check (10s), payment (8s) → charge (5s) → send (3s)
# Gesamtlatenz : 5 + max(10, 8) + 5 + 3 = 23s
# Speedup vs sequenziell : (5+10+8+5+3) / 23 = 1.7x
```

### Saga-Muster
```
1. Bestellung validieren          → Erfolg
2. Lagerbestand überprüfen        → Erfolg, Artikel reservieren
3. Zahlung verarbeiten            → FEHLER (Karte abgelehnt)
   └─ Compensation: Lagerbestand freigeben
   └─ Compensation: Bestellung als storniert markieren
# Ergebnis : Bestellung storniert, Lagerbestand freigegeben, keine Zahlung
```

### Supervisor + Subagenten
```
Supervisor zerlegt: [validate, check&pay (parallel), charge, send]
Supervisor delegiert an Agenten, validiert Ausgaben
Bei Fehler, wiederholt (bis zu 2 mal) dann eskaliert
```

---

## Anti-Muster zu Vermeiden

### Vollständig verbundenes Netz

Jeder Agent kommuniziert mit jedem anderen Agent. Führt zu unvorhersehbaren Kommunikationsmustern und aufstrebenden Bugs.

❌ **Schlecht:**
```
A ←→ B ←→ C ←→ D
↑         ↑
└─────────┘
```

✓ **Gut:** Verwenden Sie Hierarchie oder DAG mit expliziten Abhängigkeiten.

### Zirkuläre Abhängigkeiten

Agent A wartet auf Agent B, der auf Agent A wartet. Blockade.

❌ **Schlecht:**
```
A → B → A (cycle)
```

✓ **Gut:** Verwenden Sie topologische Sortierung, um Zyklen vor der Ausführung zu erkennen und abzulehnen.

### Stille Fehler

Agent schlägt fehl, aber Orchestrierer weiß nicht, fährt mit alten Daten fort.

❌ **Schlecht:**
```python
result = agent_call(...)
# Keine Fehlerbehandlung, Erfolg annehmen
return result
```

✓ **Gut:**
```python
result = agent_call(...)
if result.status == 'error':
    raise AgentFailure(result.error)
    # oder wiederholen, oder eskalieren
```

### Unbegrenzte Wiederholungen

Agent schlägt in einer Schleife fehl, wiederholt endlos, beendet nie.

❌ **Schlecht:**
```python
while True:
    try:
        return agent_call(...)
    except:
        pass  # Wiederholen endlos
```

✓ **Gut:**
```python
for attempt in range(max_retries):
    try:
        return agent_call(...)
    except Exception as e:
        if attempt == max_retries - 1:
            escalate(e)
```

---

## Entscheidungsbaum

**Wie viele Agenten?**
- 1-2: Einzelner Agent mit Schleifen, keine Orchestrierung erforderlich
- 3-5: Sequenzielle Pipeline oder paralleles Fan-Out
- 5-20: DAG-Orchestrierung oder Blackboard-Muster
- 20+: Supervisor + Subagenten mit Ressourcendurchsetzung

**Arbeiten Agenten an gemeinsamen Status?**
- Ja: Blackboard-Muster
- Nein: DAG, Saga oder Supervisor

**Atomare Transaktionen beibehalten?**
- Ja: Saga-Muster
- Nein: DAG oder Blackboard

**Automatische Parallelisierung erforderlich?**
- Ja: DAG-Orchestrierung
- Nein: Sequenziell oder Fan-Out

**Strikte Rollengrenzen erforderlich?**
- Ja: Supervisor + Subagenten
- Nein: DAG oder Blackboard

---
