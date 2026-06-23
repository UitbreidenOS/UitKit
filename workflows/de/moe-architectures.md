# Mixture of Experts (MoE) Architekturen in Claudient

Dieses Dokument beschreibt Architekturen zur Weiterleitung von Anfragen an mehrere Modelle zur Optimierung von Code-Generierung, Argumentation und Kosten.

---

## 1. Architektur 1: Komplexitätsbasiertes Routing (Tiered Dispatch)

### Wie es funktioniert
Das System skaliert die Argumentation dynamisch basierend auf Eingabeheuristiken (z. B. Zeilenhinzufügungen, betroffene Dateien, Sicherheits-Flags).

---

## 2. Architektur 2: Domänenexperten-Routing (Rollenbasierter Dispatch)

### Wie es funktioniert
Abfragen werden nach Schlüsselwörtern, Sprachen und technischen Verzeichnissen analysiert, um sie an hochspezialisierte Vorlagen/Systemanweisungen weiterzuleiten.

---

## 3. Architektur 3: Multi-Agenten-Konsens-Schwarm (Debatten-Routing)

### Wie es funktioniert
Bei folgenschweren Entscheidungen koordiniert ein Supervisor-Agent eine Debatte zwischen zwei gegnerischen Experten-Agenten und synthetisiert die Ergebnisse vor der Ausführung.
