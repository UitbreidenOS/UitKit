---
description: Dividir un archivo de gran tamaño o con preocupaciones mixtas en módulos enfocados
argument-hint: "[archivo]"
---
Dividir $ARGUMENTS en archivos más pequeños con una única responsabilidad.

1. Leer el archivo completo. Identificar agrupaciones lógicas de símbolos:
   - Agrupar por dominio de preocupación (p. ej., lógica de autenticación, consultas de BD, manejadores HTTP, funciones auxiliares)
   - Agrupar por tipo (p. ej., todos los tipos/interfaces juntos, todas las constantes juntas) si esa es la convención del proyecto
   - Observar archivos hermanos existentes en el mismo directorio para coincidir con el patrón de división establecido

2. Proponer un plan de división antes de realizar cualquier edición:
   - Listar cada nuevo nombre de archivo y qué símbolos contendrá
   - Identificar todas las dependencias entre archivos que la división creará (importaciones que no existían previamente)
   - Indicar qué archivo, si existe, se convierte en el barril de re-exportación (index.ts, __init__.py, mod.rs, etc.)

3. Ejecutar la división:
   - Crear cada nuevo archivo solo con los símbolos asignados a él
   - Añadir todas las sentencias de importación necesarias — tanto dentro de los nuevos archivos como desde cualquier archivo que haya importado previamente el original
   - Actualizar el archivo original para re-exportar desde los nuevos módulos si se requiere compatibilidad hacia atrás; en caso contrario, eliminar el original
   - Eliminar cualquier importación ahora redundante dentro de los nuevos archivos

4. Verificar que cada símbolo que era accesible desde fuera del archivo original siga siendo accesible en la misma ruta de importación, o documentar el cambio de ruta explícitamente.

5. No renombrar símbolos, cambiar lógica ni reformatear código durante la división.

6. Resultado: lista de nuevos archivos creados, símbolos movidos a cada uno, y cualquier ruta de importación que los llamadores externos deben actualizar.

Restricciones:
- Nunca dividir en más de 5 archivos en un paso — si el archivo lo justifica, explicar y parar después de 5.
- No crear archivos más pequeños que aproximadamente 20 líneas significativas a menos que el límite de dominio sea excepcionalmente claro.
- Coincidir los nuevos nombres de archivo con la convención de nomenclatura existente del proyecto.
