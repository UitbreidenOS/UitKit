---
description: Generar un documento de arquitectura estructurado para una base de código o módulo
argument-hint: "[ruta o nombre de módulo]"
---
Produce un documento de arquitectura exhaustivo para: $ARGUMENTS

Pasos:
1. Explora el objetivo — lee puntos de entrada, archivos de configuración y estructura de directorios. No omitas directorios ocultos como `.claude/` o `infra/`.
2. Identifica y nombra los componentes de nivel superior: servicios, capas, almacenes, colas, integraciones externas.
3. Para cada componente, establece:
   - Responsabilidad (una oración)
   - Tecnología / lenguaje / framework
   - Dependencias entrantes y salientes
   - Datos que posee o pasa
4. Dibuja el flujo de datos en tiempo de ejecución como un diagrama ASCII. Etiqueta la dirección de llamada con flechas. Incluye límites asíncronos.
5. Identifica preocupaciones transversales: autenticación, logging, manejo de errores, feature flags, caché.
6. Enumera restricciones conocidas o decisiones no obvias (por ejemplo, "utiliza polling en lugar de webhooks porque la API del proveedor es de solo lectura").
7. Identifica lagunas: partes sin documentar, pruebas faltantes, propiedad poco clara.

Formato de salida:
- Encabezados H2 para cada sección
- Tablas para listados de componentes (Componente | Responsabilidad | Tech | Depende de)
- Diagrama ASCII en línea bajo "Flujo de datos"
- Listas de viñetas para preocupaciones transversales y lagunas
- Sin relleno introductorio — comienza con la tabla de componentes

Reglas de precisión:
- Fundamenta cada afirmación en archivos reales. Si no puedes verificar una afirmación, márcala `[sin verificar]`.
- No inventes integraciones o capas que no existan en el código.
- Si $ARGUMENTS está vacío, documenta toda la raíz del repositorio.
