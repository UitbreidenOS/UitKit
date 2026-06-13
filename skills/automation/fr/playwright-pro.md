---
name: playwright-pro
description: "Playwright avancé : écriture de tests E2E fiables, gestion des state, parallélisation, rapports, debugging"
---

# Compétence Playwright Pro

## Quand l'activer
- Écrire des tests E2E robustes et maintenables
- Configurer l'exécution de tests en parallèle
- Implémenter les meilleures pratiques Playwright
- Déboguer les tests flaky
- Mettre en place le reporting et l'analyse

## Instructions

```
Suite E2E Playwright pour [application].

Framework: [Playwright Test / POM pattern]
Stratégie: [Locators / Actions / Assertions]

Meilleures pratiques:

1. Locators fiables
   - data-testid plutôt que CSS fragile
   - Préférer text, role aux selecteurs génériques

2. Gestion du state
   - Fixtures pour setup/teardown
   - Database seed pour state initial
   - Éviter les test dépendances

3. Parallélisation
   - Exécuter en parallèle par défaut
   - Isoler les tests (données, serveurs)
   - Sharding si trop de tests

4. Debugging
   - --debug flag
   - trace: 'on-first-retry'
   - Screenshots automatiques sur erreur

5. Rapports
   - HTML report intégré
   - JUnit XML pour CI/CD
   - Vidéos sur les tests qui échouent

Générer suite E2E pour mon application.
```

---
