---
description: Revisar un esquema de base de datos para detectar defectos de diseño, problemas de normalización y preparación para producción
argument-hint: "[schema file or table name(s)]"
---
Estás realizando una revisión de preparación para producción de un esquema de base de datos. Objetivo de la revisión: $ARGUMENTS

Si $ARGUMENTS es una ruta de archivo, lee el archivo. Si es un nombre de tabla o lista de nombres, busca definiciones de esquema en la base de código (migraciones, modelos ORM, schema.sql, schema.rb, prisma.schema, etc.).

Revisa el esquema en estas dimensiones:

**Normalización e Integridad de Datos**
- Identifica violaciones de 1NF, 2NF, 3NF. Anota las denormalizaciones que son intencionales (para rendimiento de lectura) versus accidentales.
- Detecta columnas que almacenan múltiples valores (listas separadas por comas, arrays JSON utilizados como relaciones).
- Verifica que cada tabla tenga una clave primaria clara.
- Verifica que las claves externas estén declaradas y no solo implícitas por convención de nombres.
- Comprueba si faltan restricciones UNIQUE en columnas que deberían ser únicas.
- Detecta columnas anulables que deberían ser NOT NULL según la semántica del negocio.

**Idoneidad de Tipos**
- Marca columnas de cadena utilizadas para almacenar correos electrónicos, UUIDs, direcciones IP, JSON, montos de dinero o fechas/horas — sugiere tipos apropiados.
- Marca INT usado para booleano (usar BOOLEAN), o FLOAT usado para moneda (usar DECIMAL/NUMERIC).
- Comprueba el manejo de zonas horarias: TIMESTAMP vs TIMESTAMPTZ (PostgreSQL), DATETIME vs TIMESTAMP (MySQL).

**Nomenclatura y Consistencia**
- Comprueba convenciones de nomenclatura consistentes (snake_case vs camelCase, nombres de tablas plurales vs singulares).
- Identifica patrones de nomenclatura de columnas inconsistentes para campos comunes (created_at vs createdAt vs create_time).

**Preocupaciones de Escalabilidad**
- Tablas que carecen de índice en columnas de clave externa.
- Tablas sin una estrategia de partición obvia que probablemente excedarán 10 millones de filas.
- Patrón de borrado suave faltante donde los borrados permanentes romperían requisitos de auditoría.
- VARCHAR sin un límite de longitud razonable en columnas que probablemente serán indexadas.

**Seguridad**
- Columnas que parecen almacenar datos sensibles (contraseña, número de seguro social, número de tarjeta, secreto) sin una convención de nomenclatura que indique que están hash/encriptadas.

Genera un informe estructurado con calificaciones de severidad (CRÍTICO / ADVERTENCIA / SUGERENCIA) para cada hallazgo, y una corrección concreta para cada uno.
