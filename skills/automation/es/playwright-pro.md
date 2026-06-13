---
name: playwright-pro
description: "Playwright Advanced: escribe pruebas E2E confiables, gestión de state, paralelización, reporting, debugging"
---

# Habilidad Playwright Pro

## Cuándo activar
- Escribir pruebas E2E robustas y mantenibles
- Paralelizar ejecución de pruebas
- Implementar mejores prácticas de Playwright
- Depurar pruebas flaky
- Establecer reporting y análisis

## Instrucciones

```
Suite E2E Playwright para [aplicación].

Framework: [Playwright Test / POM pattern]
Estrategia: [Locators / Actions / Assertions]

Mejores Prácticas:

1. Locators Confiables
   - data-testid en lugar de CSS frágil
   - Preferir text, role sobre selectores genéricos

2. Gestión de State
   - Fixtures para setup/teardown
   - Database seed para state inicial
   - Evitar dependencias entre tests

3. Paralelización
   - Ejecutar en paralelo por defecto
   - Aislar tests (datos, servidores)
   - Sharding si hay muchas pruebas

4. Debugging
   - Flag --debug
   - trace: 'on-first-retry'
   - Screenshots automáticos en errores

5. Reporting
   - Reporte HTML integrado
   - JUnit XML para CI/CD
   - Videos de pruebas fallidas

Genere suite E2E para mi aplicación.
```

---
