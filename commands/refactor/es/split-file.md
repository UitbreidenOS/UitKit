---
description: Dividir un archivo de tamaño excesivo o con múltiples responsabilidades en módulos enfocados
argument-hint: "[file]"
---
Dividir $ARGUMENTS en archivos más pequeños con una única responsabilidad.

1. Leer el archivo completo. Identificar clusters lógicos de símbolos:
   - Agrupar por dominio de responsabilidad (p. ej., lógica de autenticación, consultas de BD, manejadores HTTP, funciones auxiliares)
   - Agrupar por tipo (p. ej., todos los tipos/interfaces juntos, todas las constantes juntas) si esa es la convención del proyecto
   - Observar los archivos hermanos existentes en el mismo directorio para coincidir con el patrón de división establecido

2. Proponer un plan de división antes de hacer ediciones:
   - Listar cada nombre de nuevo archivo y qué símbolos contendrá
   - Identificar todas las dependencias entre archivos que la división creará (importaciones que no existían previamente)
   - Indicar qué archivo, si alguno, se convierte en el re-export barrel (index.ts, __init__.py, mod.rs, etc.)

3. Ejecutar la división:
   - Crear cada nuevo archivo con solo los símbolos asignados a él
   - Añadir todas las declaraciones de importación necesarias — tanto dentro de los nuevos archivos como desde archivos que previamente importaban el original
   - Actualizar el archivo original para re-exportar desde los nuevos módulos si se requiere compatibilidad hacia atrás; de lo contrario, eliminar el original
   - Eliminar cualquier importación ahora redundante dentro de los nuevos archivos

4. Verificar que cada símbolo que era accesible desde fuera del archivo original siga siendo accesible en la misma ruta de importación, o documentar explícitamente el cambio de ruta.

5. No renombrar símbolos, cambiar lógica o reformatear código durante la división.

6. Resultado: lista de nuevos archivos creados, símbolos movidos a cada uno, y cualquier ruta de importación que las personas que llaman externamente deben actualizar.

Restricciones:
- Nunca dividir en más de 5 archivos en una sola pasada — si el archivo lo justifica, explicar y detener después de 5.
- No crear archivos más pequeños que ~20 líneas significativas a menos que el límite del dominio sea excepcionalmente claro.
- Coincidir los nombres de los nuevos archivos con la convención de nombres existente del proyecto.
