---
name: playwright-pro
description: "Playwright Advanced: Schrijf betrouwbare E2E-tests, state-management, parallelisering, reporting, debugging"
---

# Vaardigheid Playwright Pro

## Wanneer activeren
- Schrijf robuuste en onderhoudbare E2E-tests
- Test-uitvoering paralleliseren
- Playwright best practices implementeren
- Flaky tests debuggen
- Reporting en analyse instellen

## Instructies

```
Playwright E2E-suite voor [applicatie].

Framework: [Playwright Test / POM pattern]
Strategie: [Locators / Actions / Assertions]

Best Practices:

1. Betrouwbare Locators
   - data-testid in plaats van broos CSS
   - Text, role verkiezen boven generieke selectors

2. State-Management
   - Fixtures voor setup/teardown
   - Database seed voor initial state
   - Test-afhankelijkheden vermijden

3. Parallelisering
   - Standaard parallel uitvoeren
   - Tests isoleren (data, servers)
   - Sharding bij te veel tests

4. Debugging
   - --debug flag
   - trace: 'on-first-retry'
   - Automatische screenshots bij fouten

5. Reporting
   - Ingebouwde HTML-rapportage
   - JUnit XML voor CI/CD
   - Video's op mislukte tests

E2E-suite voor mijn applicatie genereren.
```

---
