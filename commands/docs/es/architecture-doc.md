---
description: Generar un documento de arquitectura estructurado para una base de código o módulo
argument-hint: "[path or module name]"
---
Produce un documento de arquitectura completo para: $ARGUMENTS

Pasos:
1. Explora el destino — lee puntos de entrada, archivos de configuración y estructura de directorios. No omitas directorios ocultos como `.claude/` o `infra/`.
2. Identifica y nombra los componentes de nivel superior: servicios, capas, tiendas, colas, integraciones externas.
3. Para cada componente, especifica:
   - Responsabilidad (una oración)
   - Tecnología / lenguaje / marco de trabajo
   - Dependencias entrantes y salientes
   - Datos que posee o transmite
4. Dibuja el flujo de datos en tiempo de ejecución como un diagrama ASCII. Etiqueta la dirección de la llamada con flechas. Incluye límites asíncronos.
5. Identifica preocupaciones transversales: autenticación, registro, manejo de errores, banderas de características, almacenamiento en caché.
6. Lista restricciones conocidas o decisiones no obvias (p. ej., "usa sondeo en lugar de webhooks porque la API del proveedor es de solo lectura").
7. Identifica brechas: partes no documentadas, pruebas faltantes, propiedad poco clara.

Formato de salida:
- Encabezados H2 para cada sección
- Tablas para listas de componentes (Componente | Responsabilidad | Tecnología | Depende de)
- Diagrama ASCII insertado bajo "Flujo de Datos"
- Listas con viñetas para preocupaciones transversales y brechas
- Sin prólogo introductorio — comienza con la tabla de componentes
