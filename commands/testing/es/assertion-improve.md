---
description: Reforzar afirmaciones débiles o superficiales en pruebas existentes
argument-hint: "[archivo o directorio de pruebas]"
---
Revisar y mejorar afirmaciones en: $ARGUMENTS

Pasos:

1. Leer el archivo objetivo o todos los archivos de prueba bajo el directorio objetivo.

2. Identificar patrones de afirmación débil — anotar cada uno con ruta de archivo y número de línea:

   **Coincidencias demasiado amplias**
   - `toBeTruthy` / `toBeFalsy` cuando se puede verificar un valor específico
   - `toBeDefined` cuando la forma o tipo se puede afirmar
   - `toContain` en objetos completos cuando una coincidencia exacta sería apropiada

   **Cobertura incompleta**
   - Pruebas que afirman el valor de retorno pero no el efecto secundario (o viceversa)
   - Rutas de error que solo verifican `throw` sin verificar el mensaje de error o el tipo
   - Funciones asincrónicas cuyo caso de rechazo no se prueba

   **Uso excesivo de snapshots**
   - Snapshots que cubren árboles de componentes completos grandes donde afirmaciones de propiedades específicas serían más estables y legibles
   - Snapshots que codifican detalles de implementación irrelevantes (por ejemplo, nombres de clases CSS internas)

   **Faltan verificaciones de límites**
   - Funciones que aceptan matrices/cadenas pero sin prueba de entrada vacía
   - Funciones numéricas sin prueba en cero, negativo o límite máximo
   - Parámetros anulables sin prueba null/undefined

   **Conteo de afirmaciones**
   - Pruebas con cero afirmaciones (falsa aprobación)
   - Pruebas con un solo `expect` que no puede distinguir entre dos modos de fallo similares

3. Para cada hallazgo, mostrar:
   - La afirmación actual
   - Por qué es débil
   - Un reemplazo que sea más específico, significativo o completo

4. Aplicar todos los cambios que sean mejoras inequívocas — no cambiar pruebas que pasan a pruebas que fallan.

5. No agregar nuevos casos de prueba; solo mejorar afirmaciones dentro de pruebas existentes.

6. Resumir: X afirmaciones revisadas, Y reemplazadas, Z marcadas pero no cambiadas (con razón).
