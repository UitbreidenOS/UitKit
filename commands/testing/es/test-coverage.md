---
description: Analizar brechas de cobertura de pruebas y generar pruebas para cerrarlas
argument-hint: "[file-or-directory]"
---
Analizar y mejorar la cobertura de pruebas para: $ARGUMENTS

Paso 1 — Medir la cobertura actual.
Ejecutar la herramienta de cobertura del proyecto (Jest --coverage, pytest --cov, go test -cover, etc.) limitado a $ARGUMENTS. Analizar la salida e identificar:
- Líneas/ramas sin cobertura
- Funciones que no han sido probadas en absoluto
- Ramas (if/else, switch, ternario) donde solo se ejecuta una ruta

Paso 2 — Priorizar brechas por riesgo.
Clasificar el código no cubierto por:
1. Rutas críticas para el negocio (pago, autenticación, mutación de datos)
2. Manejo de errores y ramas alternativas
3. Lógica condicional compleja (complejidad ciclomática > 3)
4. Superficie de API pública vs. ayudantes internos

Paso 3 — Para cada brecha de alta prioridad, escribir una prueba dirigida.
- Nombrar la prueba según el escenario exacto que cubre ("lanza AuthError cuando el token ha expirado")
- Mantener la configuración mínima — solo lo necesario para alcanzar la rama no cubierta
- Afirmar el comportamiento específico, no solo que no se lanzó excepción

Paso 4 — Volver a ejecutar la cobertura después de agregar pruebas y confirmar que la brecha está cerrada. Reportar:
- Cobertura antes: X%
- Cobertura después: Y%
- Brechas restantes y por qué es aceptable dejarlas (p. ej., código muerto, ramas específicas de plataforma)

No generar pruebas que rellenen métricas de cobertura sin afirmar comportamiento real (p. ej., llamar a una función y afirmar `toBeTruthy()`). Calidad sobre cantidad.
