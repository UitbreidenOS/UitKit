---
description: Inicia un ciclo TDD — escribe pruebas fallidas primero, luego implementa
argument-hint: "[function, class, or feature to build]"
---
Inicia un ciclo TDD para: $ARGUMENTS

Pasos:

1. Clarifica el objetivo del argumento:
   - Si es una firma de función o descripción: deriva los contratos de entrada/salida
   - Si es un nombre de clase o módulo: infiere las responsabilidades del nombre y de cualquier contexto de código existente
   - Si es una descripción de característica: identifica la unidad más pequeña de comportamiento para comenzar

2. Verifica si hay alguna implementación existente o código parcial. Si se encuentra, léelo pero no lo modifiques aún.

3. Escribe primero las pruebas fallidas — sin código de implementación aún.

   Para cada prueba:
   - Nómbrala en el formato: `[unidad] [escenario] [resultado esperado]`
   - Cubre en este orden: camino feliz → casos límite → caminos de error
   - Escribe el número mínimo de pruebas que especifique completamente el contrato (evita redundancia)
   - Usa el marco de pruebas existente del proyecto y el estilo de aserciones

   Casos de prueba mínimos para escribir antes de detener:
   - Al menos 1 prueba de camino feliz
   - Al menos 1 prueba de límite o caso especial
   - Al menos 1 prueba de error/entrada inválida (si el objetivo puede fallar)

4. Ejecuta las pruebas. Confirma que fallan por la razón correcta (no por un error de sintaxis o fallo de importación — una falla de aserciones genuina contra lógica faltante).

5. Escribe la implementación mínima que haga que las pruebas pasen:
   - Sin lógica más allá de lo que las pruebas requieren
   - Sin manejo especulativo de casos no probados aún
   - Sigue el estilo de código existente del proyecto

6. Ejecuta las pruebas de nuevo. Si todas pasan, reporta éxito.

7. Si alguna prueba aún falla después de la implementación, muestra la salida del fallo y diagnostica la brecha antes de intentar una corrección.

8. Termina con:
   - Archivos creados o modificados
   - Cantidad de pruebas y estado de paso/fallo
   - Próxima prueba sugerida para escribir (un paso más adelante en el ciclo TDD)
