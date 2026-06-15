# Performance-Optimierung

## Wann aktivieren

Reduzierung von CPU-, Speicher-, Festplatten-I/O- oder Netzwerk-Overhead in Datenaufträgen.

## Wann NICHT verwenden

Nicht für Probleme mit algorithmischer Korrektheit; Fokus auf Ressourceneffizienz.

## Anweisungen

1. Ressourcennutzung profilieren
2. Engpässe identifizieren (Berechnung, I/O, Netzwerk)
3. Parallelisierung oder Batch-Verarbeitung empfehlen
4. Verbesserungen validieren

## Beispiel

Spark-Job dauert 45 Minuten. Profiling zeigt 90% I/O-Zeit. Lösung: Partitionierung von 10 auf 50 Partitionen erhöhen, Broadcast-Join für kleine Dimension verwenden. Neue Laufzeit: 12 Minuten.
