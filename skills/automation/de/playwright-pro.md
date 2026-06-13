---
name: playwright-pro
description: "Playwright Advanced: Schreibe zuverlässige E2E-Tests, State-Management, Parallelisierung, Reporting, Debugging"
---

# Fähigkeit Playwright Pro

## Wann aktivieren
- Schreiben robuster und wartbarer E2E-Tests
- Test-Ausführung parallelisieren
- Playwright Best Practices implementieren
- Flaky Tests debuggen
- Reporting und Analyse aufsetzen

## Anweisungen

```
Playwright E2E-Suite für [Anwendung].

Framework: [Playwright Test / POM pattern]
Strategie: [Locators / Actions / Assertions]

Best Practices:

1. Zuverlässige Locators
   - data-testid statt fragiler CSS
   - Text, role bevorzugen über generische Selektoren

2. State-Management
   - Fixtures für Setup/Teardown
   - Database Seed für initialen State
   - Test-Abhängigkeiten vermeiden

3. Parallelisierung
   - Standardmäßig parallel ausführen
   - Tests isolieren (Daten, Server)
   - Sharding wenn zu viele Tests

4. Debugging
   - --debug Flag
   - trace: 'on-first-retry'
   - Automatische Screenshots bei Fehlern

5. Reporting
   - Integrierter HTML-Report
   - JUnit XML für CI/CD
   - Videos auf fehlgeschlagene Tests

E2E-Suite für meine Anwendung generieren.
```

---
