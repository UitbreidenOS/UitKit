---
description: Identificar y eliminar código inaccesible, no utilizado u obsoleto
argument-hint: "[file or directory]"
---
Realiza un pase de eliminación de código muerto en $ARGUMENTS.

1. Lee todos los archivos en el alcance. Construye un mapa mental de:
   - Símbolos exportados vs. internos
   - Funciones, variables, tipos, constantes, importaciones que se declaran pero nunca se referencian
   - Ramas que nunca pueden alcanzarse (por ejemplo, código después de un retorno incondicional, condiciones que siempre son verdaderas/falsas debido a valores constantes)
   - Banderas de características o guardias de variables de entorno que están permanentemente activadas o desactivadas dado el estado actual del código
   - Bloques de código comentados — elimínalos a menos que contengan un comentario de justificación fechado

2. Para cada símbolo o bloque muerto encontrado:
   - Confirma que no se referencia a través de despacho dinámico, reflexión, búsqueda basada en cadenas o un llamador externo fuera del alcance escaneado. Si no estás seguro, indícalo y omítelo.
   - Elimina la declaración y todo su andamiaje local (alias de tipo asociados, variables auxiliares usadas solo por él, re-exportaciones que solo lo exponen).

3. Después de cada eliminación, elimina las importaciones o requiere que ahora no se utilizan.

4. No reformatees, renombres ni reestructures nada más. Solo eliminación de código muerto.

5. Genera una lista de cada elemento eliminado: nombre del símbolo, archivo, rango de líneas y razón (no utilizado / inaccesible / supersedido).

6. Si un símbolo parece muerto pero tiene un comentario que sugiere uso futuro o es parte de un contrato de API pública (por ejemplo, exportado desde el archivo de índice de una biblioteca), indícalo en lugar de eliminarlo.

Restricciones:
- No elimines código solo porque parezca redundante — debe ser comprobablemente no referenciado o inaccesible.
- No toques archivos de prueba a menos que el argumento los incluya explícitamente.
- Si la eliminación cambiaría el comportamiento observable (por ejemplo, una importación con efectos secundarios), indícalo y no elimines.
