---
description: Generar un plan de prueba estructurado para una funcionalidad, módulo o PR
argument-hint: "[feature, file, or PR description]"
---
Generar un plan de prueba estructurado para: $ARGUMENTS

Pasos:

1. Analizar el argumento para determinar el alcance:
   - Si es una ruta de archivo: leer el archivo y extraer funciones públicas, clases, rutas o componentes
   - Si es una descripción de funcionalidad: identificar el dominio e inferir las superficies afectadas
   - Si hay un PR o diff en el contexto: usar los archivos cambiados como alcance

2. Para el alcance identificado, enumerar las categorías de prueba en este orden:
   a. Pruebas unitarias — funciones individuales, métodos o lógica pura
   b. Pruebas de integración — límites de módulos, interacciones de servicios, consultas a BD
   c. Pruebas de componentes/UI — si el alcance incluye código frontend
   d. Pruebas E2E — si se ven afectados flujos que el usuario puede ver
   e. Pruebas de contrato — si el alcance incluye puntos finales de API consumidos por clientes externos

3. Para cada categoría, listar casos de prueba específicos. Cada entrada de caso de prueba debe incluir:
   - Una descripción de una línea en el formato: `[sujeto] [acción/estado] → [resultado esperado]`
   - Prioridad: P0 (debe enviarse), P1 (debería enviarse), P2 (bueno tener)
   - Tipo: caso feliz | caso límite | camino de error | regresión

4. Identificar:
   - Cualquier prueba existente que cubra terreno superpuesto (verificar directorios de pruebas)
   - Vacíos donde actualmente no existen pruebas
   - Dependencias externas que requieren mocking (APIs, bases de datos, tiempo, aleatoriedad)

5. Señalar casos que tienen alto esfuerzo o bajo valor — no incluirlos silenciosamente; anotar el balance.

6. Mostrar el plan como una tabla de Markdown o lista anidada. No escribir código de prueba alguno.

7. Finalizar con una línea de resumen: casos de prueba totales por prioridad (p. ej., "P0: 4, P1: 7, P2: 3").
