---
description: Fortalecer aserciones débiles o superficiales en pruebas existentes
argument-hint: "[test file or directory]"
---
Revisa y mejora las aserciones en: $ARGUMENTS

Pasos:

1. Lee el archivo de destino o todos los archivos de prueba bajo el directorio de destino.

2. Identifica patrones de aserciones débiles — anota cada uno con la ruta del archivo y número de línea:

   **Coincidencias demasiado amplias**
   - `toBeTruthy` / `toBeFalsy` cuando se puede verificar un valor específico
   - `toBeDefined` cuando la forma o el tipo puede ser asertado
   - `toContain` en objetos completos cuando una coincidencia exacta sería apropiada

   **Cobertura incompleta**
   - Pruebas que verifican el valor de retorno pero no el efecto secundario (o viceversa)
   - Rutas de error que solo comprueban `throw` sin verificar el mensaje de error o el tipo
   - Funciones asincrónicas cuyo caso de rechazo no está probado

   **Uso excesivo de snapshots**
   - Snapshots que cubren árboles de componentes grandes completos donde aserciones de propiedades dirigidas serían más estables y legibles
   - Snapshots que codifican detalles de implementación irrelevantes (por ejemplo, nombres de clases CSS internos)

   **Verificaciones de límites faltantes**
   - Funciones que aceptan arreglos/cadenas pero sin prueba de entrada vacía
   - Funciones numéricas sin prueba en cero, negativo o límite máximo
   - Parámetros anulables sin prueba nula/indefinida

   **Recuento de aserciones**
   - Pruebas con cero aserciones (falso paso)
   - Pruebas con un único `expect` que no puede distinguir entre dos modos de fallo similares

3. Para cada hallazgo, muestra:
   - La aserción actual
   - Por qué es débil
   - Un reemplazo que sea más específico, significativo o completo

4. Aplica todos los cambios que sean mejoras inequívocas — no cambies pruebas que pasen a que fallen.

5. No añadas nuevos casos de prueba; solo mejora las aserciones dentro de las pruebas existentes.

6. Resume: X aserciones revisadas, Y reemplazadas, Z marcadas pero no cambiadas (con razón).
