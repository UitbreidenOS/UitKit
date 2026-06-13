---
description: Identificar y eliminar código inalcanzable, no utilizado u obsoleto
argument-hint: "[archivo o directorio]"
---
Realiza un pase de eliminación de código muerto en $ARGUMENTS.

1. Lee todos los archivos en el alcance. Construye un mapa mental de:
   - Símbolos exportados vs. internos
   - Funciones, variables, tipos, constantes, importaciones que se declaran pero nunca se referencian
   - Ramas que nunca pueden ser alcanzadas (p. ej., código después de un retorno incondicional, condiciones que siempre son verdaderas/falsas debido a valores constantes)
   - Banderas de características o guardias de variables de entorno que están permanentemente activadas o desactivadas dado el estado actual del código
   - Bloques de código comentado — elimínalos a menos que contengan un comentario de justificación con fecha

2. Para cada símbolo o bloque muerto encontrado:
   - Confirma que no se referencie mediante envío dinámico, reflexión, búsqueda basada en cadenas o un llamador externo fuera del alcance escaneado. Si tienes incertidumbre, indícalo y omite.
   - Elimina la declaración y toda su estructura local asociada (alias de tipos asociados, variables auxiliares usadas solo por ella, re-exportaciones que solo la exponen).

3. Después de cada eliminación, elimina las importaciones o requires que ahora no se utilizan.

4. No reformatees, renombres ni reestructures nada más. Solo eliminación de código muerto.

5. Genera una lista de todos los elementos eliminados: nombre del símbolo, archivo, rango de líneas y razón (no utilizado / inalcanzable / superado).

6. Si un símbolo parece muerto pero tiene un comentario sugiriendo uso futuro o es parte de un contrato de API pública (p. ej., exportado desde el archivo de índice de una biblioteca), señálalo en lugar de eliminarlo.

Restricciones:
- No elimines código solo porque se vea redundante — debe ser comprobablemente no referenciado o inalcanzable.
- No modifiques archivos de prueba a menos que el argumento los incluya explícitamente.
- Si la eliminación cambiaría el comportamiento observable (p. ej., una importación con efectos secundarios), señálalo y no elimines.
