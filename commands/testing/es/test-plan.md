---
description: Generar un plan de pruebas estructurado para una característica, módulo o PR
argument-hint: "[descripción de característica, archivo o PR]"
---
Generar un plan de pruebas para: $ARGUMENTS

Pasos:

1. Analizar el argumento para determinar el alcance:
   - Si es una ruta de archivo: leer el archivo y extraer funciones públicas, clases, rutas o componentes
   - Si es una descripción de característica: identificar el dominio y inferir las superficies afectadas
   - Si hay un PR o diff en el contexto: usar los archivos modificados como alcance

2. Para el alcance identificado, enumerar las categorías de prueba en este orden:
   a. Pruebas unitarias — funciones individuales, métodos o lógica pura
   b. Pruebas de integración — límites de módulos, interacciones de servicios, consultas de BD
   c. Pruebas de componentes/UI — si el alcance incluye código frontend
   d. Pruebas E2E — si flujos enfocados al usuario se ven afectados
   e. Pruebas de contrato — si el alcance incluye puntos finales de API consumidos por clientes externos

3. Para cada categoría, enumerar casos de prueba específicos. Cada entrada de caso de prueba debe incluir:
   - Una descripción de una línea en el formato: `[sujeto] [acción/estado] → [resultado esperado]`
   - Prioridad: P0 (debe enviarse), P1 (debería enviarse), P2 (agradable tener)
   - Tipo: caso feliz | caso extremo | ruta de error | regresión

4. Identificar:
   - Cualquier prueba existente que cubra terreno superpuesto (verificar directorios de pruebas)
   - Brechas donde actualmente no existen pruebas
   - Dependencias externas que requieren mocking (APIs, bases de datos, tiempo, aleatoriedad)

5. Señalar casos que son de alto esfuerzo o bajo valor — no incluirlos silenciosamente; anotar el equilibrio.

6. Presentar el plan como una tabla Markdown o lista anidada. No escribir ningún código de prueba.

7. Terminar con una línea de resumen: casos de prueba totales por prioridad (p. ej., "P0: 4, P1: 7, P2: 3").
