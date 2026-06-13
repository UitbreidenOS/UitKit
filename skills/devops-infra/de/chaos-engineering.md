---
name: chaos-engineering
description: "Chaos Engineering: Design Failure-Injection-Experimente, identifiziere Blast Radius, definiere Steady State, nutze Chaos Monkey / Gremlin / Litmus — baue Resilienz"
---

# Fähigkeit Chaos Engineering

## Wann aktivieren
- Systemresilienz vor großem Launch validieren
- Testen, ob Circuit Breaker und Fallbacks tatsächlich funktionieren
- Unbekannte Abhängigkeiten und Single Points of Failure identifizieren
- Chaos-Engineering-Praxis von Grund auf einrichten
- Spezifisches Failure-Injection-Experiment entwerfen

## Wann NICHT verwenden
- Produktionssysteme ohne bestehende Observability
- Systeme ohne Rollback-Fähigkeit
- Regulierte Umgebungen ohne explizite Genehmigung
- Als Ersatz für Load-Tests

## Anweisungen

### Chaos-Experiment-Design

```
Chaos-Engineering-Experiment für [System/Service] entwerfen.

System: [Architektur beschreiben]
Hypothese: [was glauben Sie wird passieren wenn X ausfällt?]
Ziel: [welche Komponente kaputt machen]
Steady State: [wie messen Sie "System ist gesund"?]

Chaos-Experiment-Template:

1. Hypothese: "Wenn [Komponente X] ausfällt, [wird System mit Y reagieren] weil [wir Circuit Breaker Z haben]."

2. Steady State Definition (VOR Failure-Injection messen):
   - Metrik 1: [z.B. p99 API-Latenz < 200ms]
   - Metrik 2: [z.B. Fehlerrate < 0.1%]
   - Metrik 3: [z.B. alle Health Checks grün]

3. Zu injizierender Fehler:
   - Was: [Prozess killen / Latenz hinzufügen / Pakete droppen / Disk füllen]
   - Wo: [spezifischer Pod / Host / AZ / Abhängigkeit]
   - Blast Radius: [einzelne Instanz / alle in 1 AZ / gesamter Service]

4. Beobachtungszeitraum: [5 Minuten zum Start]

5. Rollback-Trigger:
   - Stopp wenn: [Metrik X übersteigt Y Schwelle]
   - Rollback-Methode: [exakte Befehl oder Aktion]

6. Analyse:
   - Erreichte System Steady State wieder in [X Minuten]?
   - Wurden Benutzer beeinträchtigt? Wie lange?
   - Wurde Alert ausgelöst? War es der richtige Alert?

7. Aktion wenn Hypothese falsch war:
   - [Lücke beheben — Circuit Breaker hinzufügen, Fallback verbessern, Redundanz hinzufügen]

Spezifisches Experiment für mein System entwerfen.
```

### Häufige Fehlerszenarien

Netzwerk, Ressourcen, Abhängigkeits-Fehler, Kubernetes-spezifisch. LitmusChaos, Chaos Mesh, AWS FIS, Gremlin verwenden.

### Blast-Radius-Bewertung

Direkte/indirekte Konsumenten-Analyse, externe Auswirkungen, Recovery-Weg, Risikobewertung.

### Game-Day-Planung

Game-Day-Agenda für [Team], Vorbereitung, Ausführungsübungen, Nachbesprechung.

---
